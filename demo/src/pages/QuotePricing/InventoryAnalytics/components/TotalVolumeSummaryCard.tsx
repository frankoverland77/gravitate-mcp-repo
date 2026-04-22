import { Fragment, useMemo, useState } from 'react'
import { Vertical, Texto } from '@gravitate-js/excalibrr'
import type { InventoryQuoteRow } from '../InventoryAnalytics.types'

type DayVolumes = {
  allocationTarget: number
  inventoryTarget: number
  spotTarget: number
  allocationSold: number | null
  inventorySold: number | null
  spotSold: number | null
}

function seededRandom(seed: number): () => number {
  let s = Math.imul(seed || 1, 2654435761) >>> 0
  if (s === 0) s = 1
  return () => {
    s = (Math.imul(s, 16807) % 2147483647) >>> 0
    if (s === 0) s = 1
    return s / 2147483647
  }
}

function buildDayVolumes(row: InventoryQuoteRow, dayOffset: number): DayVolumes {
  const rand = seededRandom(row.id * 10007 + (dayOffset + 20) * 31)
  const base = Math.max(row.currentBarrels, 20000) / 6

  const allocationTarget = Math.round(base * (0.9 + rand() * 0.4))
  const inventoryTarget = Math.round(base * 0.35 * (0.85 + rand() * 0.3))

  const hasSpot = rand() > 0.35
  const rawSpot = hasSpot ? Math.round(base * 0.18 * (0.4 + rand() * 1.2)) : 0
  const spotCap = Math.min(allocationTarget, inventoryTarget)
  const spotTarget = Math.min(rawSpot, spotCap)

  if (dayOffset > 0) {
    return {
      allocationTarget,
      inventoryTarget,
      spotTarget,
      allocationSold: null,
      inventorySold: null,
      spotSold: null,
    }
  }

  const allocationSold = Math.round(allocationTarget * (0.65 + rand() * 0.3))
  const inventorySold = Math.round(inventoryTarget * (0.6 + rand() * 0.35))
  const spotSold = spotTarget > 0 ? Math.round(spotTarget * (0.5 + rand() * 0.45)) : 0
  return { allocationTarget, inventoryTarget, spotTarget, allocationSold, inventorySold, spotSold }
}

function dayDateLabel(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const CUSTOMERS = [
  'Kwik Trip',
  'Circle K',
  '7-Eleven',
  'Pilot Flying J',
  "Love's",
  "Casey's",
  'Sheetz',
  'RaceTrac',
  "Buc-ee's",
  'Wawa',
]

type DayCustomerLift = {
  allocation: number | null
  inventory: number | null
  spot: number | null
}

// Distribute `total` across `indices` using seeded weights. Returns a map index -> value.
// Adjusts the first index to make the sum exactly match `total`.
function distribute(rand: () => number, total: number, indices: number[]): Record<number, number> {
  if (indices.length === 0 || total <= 0) return {}
  const weights = indices.map(() => 0.5 + rand())
  const sum = weights.reduce((a, b) => a + b, 0)
  const raw = weights.map(w => (total * w) / sum)
  const rounded = raw.map(v => Math.round(v))
  const drift = total - rounded.reduce((a, b) => a + b, 0)
  rounded[0] = Math.max(0, rounded[0] + drift)
  const out: Record<number, number> = {}
  indices.forEach((idx, i) => {
    out[idx] = rounded[i]
  })
  return out
}

function buildCustomerLifts(
  row: InventoryQuoteRow,
  volumes: DayVolumes[],
): DayCustomerLift[][] {
  // Returns customerLifts[customerIndex][dayIndex]
  const result: DayCustomerLift[][] = CUSTOMERS.map(() => [])

  volumes.forEach((v, dayIdx) => {
    const isFuture = v.allocationSold === null
    if (isFuture) {
      CUSTOMERS.forEach((_, cIdx) => {
        result[cIdx].push({ allocation: null, inventory: null, spot: null })
      })
      return
    }

    const rand = seededRandom(row.id * 100003 + dayIdx * 97 + 7)

    // Assign each customer a category (allocation | inventory | none) and an independent spot flag.
    type Category = 'allocation' | 'inventory' | 'none'
    const category: Category[] = CUSTOMERS.map(() => {
      const r = rand()
      if (r < 0.38) return 'allocation'
      if (r < 0.68) return 'inventory'
      return 'none'
    })
    const hasSpot = CUSTOMERS.map(() => rand() < 0.35)

    const allocIdx = category
      .map((c, i) => (c === 'allocation' ? i : -1))
      .filter(i => i >= 0)
    const invIdx = category
      .map((c, i) => (c === 'inventory' ? i : -1))
      .filter(i => i >= 0)
    let spotIdx = hasSpot.map((h, i) => (h ? i : -1)).filter(i => i >= 0)

    // Guarantee at least one customer per non-zero bucket, preserving the
    // "no customer lifts both allocation AND inventory on the same day" rule.
    if ((v.allocationSold ?? 0) > 0 && allocIdx.length === 0) {
      const candidate = CUSTOMERS.findIndex((_, i) => !invIdx.includes(i))
      if (candidate >= 0) allocIdx.push(candidate)
    }
    if ((v.inventorySold ?? 0) > 0 && invIdx.length === 0) {
      const candidate = CUSTOMERS.findIndex((_, i) => !allocIdx.includes(i))
      if (candidate >= 0) invIdx.push(candidate)
    }
    if ((v.spotSold ?? 0) > 0 && spotIdx.length === 0) spotIdx.push(0)

    const allocDist = distribute(rand, v.allocationSold ?? 0, allocIdx)
    const invDist = distribute(rand, v.inventorySold ?? 0, invIdx)
    const spotDist = distribute(rand, v.spotSold ?? 0, spotIdx)

    const allocSet = new Set(allocIdx)
    const invSet = new Set(invIdx)
    const spotSet = new Set(spotIdx)

    CUSTOMERS.forEach((_, cIdx) => {
      const lift: DayCustomerLift = {
        allocation: allocSet.has(cIdx) ? (allocDist[cIdx] ?? 0) : null,
        inventory: invSet.has(cIdx) ? (invDist[cIdx] ?? 0) : null,
        spot: spotSet.has(cIdx) && (v.spotSold ?? 0) > 0 ? (spotDist[cIdx] ?? 0) : null,
      }
      result[cIdx].push(lift)
    })
  })

  return result
}

type MetricRow = {
  key: string
  label: string
  values: (number | null)[]
  children?: MetricRow[]
  isParent?: boolean
  subtle?: boolean
  valuePrefix?: string
}

function formatValue(v: number | null): string {
  if (v === null) return '—'
  if (v === 0) return '0'
  return v.toLocaleString()
}

interface TotalVolumeSummaryCardProps {
  row: InventoryQuoteRow
  fillHeight?: boolean
}

const DAY_OFFSETS = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
const TODAY_INDEX = DAY_OFFSETS.indexOf(0)

export function TotalVolumeSummaryCard({ row, fillHeight }: TotalVolumeSummaryCardProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const { discretionary, groups } = useMemo(() => {
    const volumes: DayVolumes[] = DAY_OFFSETS.map(o => buildDayVolumes(row, o))
    const mapValues = (fn: (v: DayVolumes) => number | null) => volumes.map(fn)

    const customerLifts = buildCustomerLifts(row, volumes)

    const makeCustomerChildren = (
      key: 'allocation' | 'inventory' | 'spot',
      parentKey: string,
    ): MetricRow[] =>
      CUSTOMERS.map((name, cIdx) => ({
        key: `${parentKey}-cust-${cIdx}`,
        label: name,
        subtle: true,
        values: customerLifts[cIdx].map(lift => lift[key]),
      }))

    const discretionary: MetricRow = {
      key: 'discretionary',
      label: 'Discretionary Demand',
      valuePrefix: '±',
      values: mapValues(v =>
        Math.round((v.allocationTarget + v.inventoryTarget + v.spotTarget) * 0.9),
      ),
    }

    const groups: { parent: MetricRow; children: MetricRow[] }[] = [
      {
        parent: {
          key: 'totalTarget',
          label: 'Total Volume Target',
          isParent: true,
          values: mapValues(v => v.allocationTarget + v.inventoryTarget + v.spotTarget),
        },
        children: [
          {
            key: 'allocTargetMin',
            label: 'Allocation Target Min (90%)',
            subtle: true,
            values: mapValues(v => Math.round(v.allocationTarget * 0.9)),
          },
          {
            key: 'allocTargetMax',
            label: 'Allocation Target Max (125%)',
            subtle: true,
            values: mapValues(v => Math.round(v.allocationTarget * 1.25)),
          },
          { key: 'allocTarget', label: 'Allocation Target', values: mapValues(v => v.allocationTarget) },
          { key: 'invTarget', label: 'Inventory Target', values: mapValues(v => v.inventoryTarget) },
          { key: 'spotTarget', label: 'Spot Target', values: mapValues(v => v.spotTarget) },
        ],
      },
      {
        parent: {
          key: 'totalSold',
          label: 'Total Volume Sold',
          isParent: true,
          values: mapValues(v =>
            v.allocationSold === null
              ? null
              : v.allocationSold + (v.inventorySold ?? 0) + (v.spotSold ?? 0),
          ),
        },
        children: [
          {
            key: 'allocSold',
            label: 'Allocation Sold',
            values: mapValues(v => v.allocationSold),
            children: makeCustomerChildren('allocation', 'allocSold'),
          },
          {
            key: 'invSold',
            label: 'Inventory Sold',
            values: mapValues(v => v.inventorySold),
            children: makeCustomerChildren('inventory', 'invSold'),
          },
          {
            key: 'spotSold',
            label: 'Spot Sold',
            values: mapValues(v => v.spotSold),
            children: makeCustomerChildren('spot', 'spotSold'),
          },
        ],
      },
    ]

    return { discretionary, groups }
  }, [row])

  const toggle = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const headerCellBase: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: 'var(--gray-500)',
    padding: '6px 6px',
    textAlign: 'center',
    borderBottom: '1px solid var(--gray-200)',
    background: 'var(--gray-50)',
  }
  const labelCellBase: React.CSSProperties = {
    fontSize: 12,
    padding: '5px 8px',
    color: 'var(--text-1)',
    whiteSpace: 'nowrap',
    position: 'sticky',
    left: 0,
    background: 'var(--bg-1)',
    zIndex: 1,
  }
  const valueCellBase: React.CSSProperties = {
    fontSize: 12,
    padding: '5px 6px',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    minWidth: 58,
  }

  function renderRow(
    m: MetricRow,
    opts: { depth: number; borderTop?: boolean },
  ): React.ReactNode {
    const hasChildren = !!m.children && m.children.length > 0
    const isEmphasis = !!m.isParent
    const canToggle = hasChildren
    const isExpanded = canToggle && expanded[m.key]
    const weight = isEmphasis ? 700 : m.subtle ? 400 : 500
    const color = m.subtle ? 'var(--gray-500)' : 'var(--text-1)'
    const rowBg = isEmphasis ? 'var(--gray-50)' : 'transparent'
    const stickyBg = isEmphasis ? 'var(--gray-50)' : 'var(--bg-1)'
    const indent = opts.depth * 14

    return (
      <Fragment key={m.key}>
        <tr
          onClick={canToggle ? () => toggle(m.key) : undefined}
          style={{
            background: rowBg,
            borderTop: opts.borderTop ? '1px solid var(--gray-200)' : 'none',
            cursor: canToggle ? 'pointer' : 'default',
          }}
        >
          <td style={{ ...labelCellBase, fontWeight: weight, color, background: stickyBg }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingLeft: indent }}>
              {canToggle ? (
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 150ms',
                    color: 'var(--gray-500)',
                    fontSize: 10,
                  }}
                >
                  ▶
                </span>
              ) : (
                <span style={{ display: 'inline-block', width: 10 }} />
              )}
              {m.label}
            </span>
          </td>
          {m.values.map((v, i) => {
            const isToday = i === TODAY_INDEX
            const formatted = formatValue(v)
            const display =
              v !== null && v !== 0 && m.valuePrefix ? `${m.valuePrefix}${formatted}` : formatted
            return (
              <td
                key={i}
                style={{
                  ...valueCellBase,
                  fontWeight: weight,
                  color,
                  background: isToday
                    ? 'var(--theme-color-50, rgba(99, 102, 241, 0.06))'
                    : undefined,
                }}
              >
                {display}
              </td>
            )
          })}
        </tr>
        {isExpanded &&
          m.children!.map(child => renderRow(child, { depth: opts.depth + 1 }))}
      </Fragment>
    )
  }

  return (
    <Vertical
      style={{
        border: '1px solid var(--gray-200)',
        borderRadius: 8,
        padding: 12,
        background: 'var(--bg-1)',
        flex: 1,
        minWidth: 0,
        ...(fillHeight ? { height: '100%' } : {}),
        overflow: 'hidden',
      }}
    >
      <Texto weight="700" style={{ fontSize: 14, marginBottom: 10 }}>
        {row.productName} @ {row.locationName}
      </Texto>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th
                style={{
                  ...headerCellBase,
                  textAlign: 'left',
                  position: 'sticky',
                  left: 0,
                  zIndex: 2,
                  minWidth: 220,
                }}
              >
                Metric
              </th>
              {DAY_OFFSETS.map((offset, i) => {
                const isToday = i === TODAY_INDEX
                return (
                  <th
                    key={offset}
                    style={{
                      ...headerCellBase,
                      background: isToday
                        ? 'var(--theme-color-50, #eef2ff)'
                        : headerCellBase.background,
                      color: isToday ? 'var(--theme-color-1)' : headerCellBase.color,
                      minWidth: 58,
                    }}
                  >
                    {dayDateLabel(offset)}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {renderRow(discretionary, { depth: 0 })}
            {groups.map((group, gi) => (
              <Fragment key={group.parent.key}>
                {renderRow(
                  { ...group.parent, children: group.children },
                  { depth: 0, borderTop: gi === 1 },
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Vertical>
  )
}
