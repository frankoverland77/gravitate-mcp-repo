/**
 * Unified Supply Options & Volume Commitments View
 *
 * A single integrated grid where each row is a supply option (origin, supplier, channel)
 * with both price columns and volume commitment columns grouped by period (Month, Week).
 * Users can search, sort, filter, and select a supply option to set the proposed cost.
 *
 * The "Focused" view reduces cognitive load by:
 *   - Collapsing volume metrics into a single Commitment Health summary column
 *   - Showing a strategy recommendation indicator on the recommended row
 *   - Displaying a decision summary bar with key metrics
 *   - Grouping rows by channel type with visual separators
 *   - Using color-coded delta indicators for instant cost comparison
 */

import { useMemo, useState } from 'react'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { Segmented, Tag, Tooltip } from 'antd'
import type { DeliveredPricingQuoteRow } from '../DeliveredPricing.data'
import { generateSupplyOptionsData, type SupplyOptionRow } from '../supplyOptions.data'

type SupplyOptionsViewMode = 'all' | 'focused'

interface SupplyOptionsViewProps {
  selectedRow: DeliveredPricingQuoteRow
  /** The supply option IDs that should be highlighted as active */
  activeSupplyOptionIds?: number[]
  /** The supply option ID that the current strategy would auto-select */
  strategyDefaultId?: number | null
  /** Called when the user selects one or more supply option rows (shift/ctrl/cmd multi-select) */
  onSupplyOptionsSelected?: (rows: SupplyOptionRow[]) => void
}

// ============================================================================
// Formatters & Styles
// ============================================================================

const currencyFormatter = (params: any) => {
  if (params.value == null) return ''
  return `$${Number(params.value).toFixed(4)}`
}

const numberFormatter = (params: any) => {
  if (params.value == null) return ''
  return Number(params.value).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const pctFormatter = (params: any) => {
  if (params.value == null) return ''
  return `${params.value}%`
}

/** Returns true when a supply option row has hit its allocation limit (month or week) */
function isAllocationLimitRow(data: SupplyOptionRow | undefined): boolean {
  if (!data) return false
  return data.month?.status === 'Allocation Limit' || data.week?.status === 'Allocation Limit'
}

/** Shared inactive cell style applied to every cell in an allocation-limited row */
const INACTIVE_CELL_STYLE = { color: '#bfbfbf' } as const

/** Status → stoplight color mapping */
const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  'On Track': { color: '#52c41a', label: 'On Track' },
  Behind: { color: '#faad14', label: 'Behind' },
  'At Risk': { color: '#cf1322', label: 'At Risk' },
  'Allocation Limit': { color: '#bfbfbf', label: 'Allocation Limit' },
}

/** Renders a colored stoplight dot with tooltip showing the full status label */
function statusCellRenderer(params: any) {
  if (params.value == null) return null

  const config = STATUS_CONFIG[params.value]
  if (!config) return null

  // For allocation-limited rows, use muted gray regardless of individual cell status
  const isInactive = isAllocationLimitRow(params.data)
  const dotColor = isInactive ? '#d9d9d9' : config.color

  return (
    <Tooltip title={config.label} mouseEnterDelay={0.3}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: dotColor,
          }}
        />
      </div>
    </Tooltip>
  )
}

/** Renders a labeled status chip (larger, more readable) for the focused view */
function statusChipRenderer(params: any) {
  if (params.value == null) return null

  const config = STATUS_CONFIG[params.value]
  if (!config) return null

  const isInactive = isAllocationLimitRow(params.data)
  const chipColor = isInactive ? '#d9d9d9' : config.color
  const textColor = isInactive ? '#bfbfbf' : params.value === 'On Track' ? '#389e0d' : params.value === 'Behind' ? '#d48806' : params.value === 'At Risk' ? '#cf1322' : '#8c8c8c'

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          fontWeight: 500,
          color: textColor,
          backgroundColor: isInactive ? '#f5f5f5' : `${chipColor}18`,
          padding: '1px 6px',
          borderRadius: 3,
          lineHeight: '18px',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: chipColor,
            flexShrink: 0,
          }}
        />
        {config.label}
      </span>
    </div>
  )
}

/** Color-coded delta formatter with directional arrow */
function deltaRenderer(params: any) {
  if (params.value == null) return null

  const val = Number(params.value)
  const isInactive = isAllocationLimitRow(params.data)

  if (isInactive) {
    return (
      <span style={{ color: '#bfbfbf' }}>
        {val === 0 ? '—' : `${val > 0 ? '+' : '-'}${Math.abs(val).toFixed(4)}`}
      </span>
    )
  }

  if (val === 0) {
    return <span style={{ color: '#8c8c8c' }}>—</span>
  }

  const isSaving = val < 0
  const color = isSaving ? '#389e0d' : '#cf1322'
  const arrow = isSaving ? '▼' : '▲'

  return (
    <span style={{ color, fontWeight: 500 }}>
      {arrow} {Math.abs(val).toFixed(4)}
    </span>
  )
}

/** Commitment health summary renderer — condenses month+week status into one cell */
function commitmentHealthRenderer(params: any) {
  const data: SupplyOptionRow | undefined = params.data
  if (!data) return null

  // No commitment: Rack options or contracts with no volume obligation
  if (data.channel === 'Rack' || (data.month == null && data.week == null)) {
    return (
      <span style={{ color: '#8c8c8c', fontSize: 11, fontStyle: 'italic' }}>
        No commitment
      </span>
    )
  }

  const isInactive = isAllocationLimitRow(data)
  if (isInactive) {
    return (
      <span
        style={{
          color: '#bfbfbf',
          fontSize: 11,
          fontStyle: 'italic',
        }}
      >
        Allocation limit
      </span>
    )
  }

  // Determine worst status between month and week
  const statusPriority: Record<string, number> = {
    'At Risk': 3,
    Behind: 2,
    'On Track': 1,
    'Allocation Limit': 0,
  }

  const monthStatus = data.month?.status ?? null
  const weekStatus = data.week?.status ?? null
  const worstStatus =
    monthStatus && weekStatus
      ? (statusPriority[monthStatus] ?? 0) >= (statusPriority[weekStatus] ?? 0)
        ? monthStatus
        : weekStatus
      : monthStatus ?? weekStatus

  if (!worstStatus) return null

  const config = STATUS_CONFIG[worstStatus]
  if (!config) return null

  const textColor =
    worstStatus === 'On Track'
      ? '#389e0d'
      : worstStatus === 'Behind'
        ? '#d48806'
        : '#cf1322'

  return (
    <Tooltip
      mouseEnterDelay={0.3}
      title={
        <div style={{ fontSize: 12 }}>
          {monthStatus && (
            <div>
              Month: {monthStatus}
              {data.month?.toDatePctOfForecast != null && ` (${data.month.toDatePctOfForecast}% of forecast)`}
            </div>
          )}
          {weekStatus && (
            <div>
              Week: {weekStatus}
              {data.week?.toDatePctOfForecast != null && ` (${data.week.toDatePctOfForecast}% of forecast)`}
            </div>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 500,
            color: textColor,
            backgroundColor: `${config.color}18`,
            padding: '1px 6px',
            borderRadius: 3,
            lineHeight: '18px',
            whiteSpace: 'nowrap',
            cursor: 'default',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: config.color,
              flexShrink: 0,
            }}
          />
          {config.label}
        </span>
      </div>
    </Tooltip>
  )
}

function pctCellStyle(params: any) {
  if (isAllocationLimitRow(params.data)) return INACTIVE_CELL_STYLE
  if (params.value == null) return {}
  if (params.value >= 100) return { color: 'var(--theme-success)', fontWeight: 'bold' }
  if (params.value < 70) return { color: 'var(--theme-error)' }
  return {}
}

// ============================================================================
// Column Definitions
// ============================================================================

/** Build volume metric columns for a given period key (month, week) — used in "All" view */
function periodColumns(periodKey: 'month' | 'week', headerName: string) {
  return {
    headerName,
    marryChildren: true,
    children: [
      {
        field: `${periodKey}.forecast`,
        headerName: 'Forecast',
        valueFormatter: numberFormatter,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 100,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: `${periodKey}.liftings`,
        headerName: 'Liftings',
        valueFormatter: numberFormatter,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 100,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: `${periodKey}.status`,
        headerName: 'Status',
        cellRenderer: statusCellRenderer,
        filter: true,
        sortable: true,
        width: 55,
      },
      {
        field: `${periodKey}.toDateForecast`,
        headerName: 'TD Forecast',
        valueFormatter: numberFormatter,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 110,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: `${periodKey}.toDatePctOfForecast`,
        headerName: 'TD % Fcst',
        valueFormatter: pctFormatter,
        cellStyle: pctCellStyle,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 100,
      },
    ],
  }
}

/** Full column set for the "All" view — all volume detail columns */
const allViewColumnDefs = [
  {
    headerName: 'Supply Option',
    marryChildren: true,
    children: [
      {
        field: 'originLocation',
        headerName: 'Origin',
        filter: true,
        sortable: true,
        width: 110,
        pinned: 'left' as const,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: 'supplier',
        headerName: 'Supplier',
        filter: true,
        sortable: true,
        width: 110,
        pinned: 'left' as const,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: 'channel',
        headerName: 'Price Type',
        filter: true,
        sortable: true,
        width: 100,
        pinned: 'left' as const,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
    ],
  },
  {
    headerName: 'Pricing',
    marryChildren: true,
    children: [
      {
        field: 'price',
        headerName: 'Price',
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        valueFormatter: currencyFormatter,
        width: 110,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: 'priceRank',
        headerName: 'Rank',
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        width: 80,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: 'delta',
        headerName: 'Delta',
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        cellRenderer: deltaRenderer,
        width: 110,
      },
    ],
  },
  periodColumns('month', 'Month'),
  periodColumns('week', 'Week'),
]

/** Simplified column set for the "Focused" view — collapsed commitment health */
function getFocusedColumnDefs(strategyDefaultId: number | null | undefined) {
  return [
    {
      headerName: '',
      marryChildren: true,
      children: [
        {
          headerName: '',
          field: '_recommendation',
          width: 34,
          pinned: 'left' as const,
          sortable: false,
          filter: false,
          suppressMenu: true,
          cellRenderer: (params: any) => {
            const data: SupplyOptionRow | undefined = params.data
            if (!data || strategyDefaultId == null || data.id !== strategyDefaultId) return null
            return (
              <Tooltip title="Strategy recommendation" mouseEnterDelay={0.2}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }}>★</span>
                </div>
              </Tooltip>
            )
          },
          cellStyle: (params: any) => {
            const data: SupplyOptionRow | undefined = params.data
            if (data && strategyDefaultId != null && data.id === strategyDefaultId) {
              return { color: 'var(--theme-primary, #1890ff)' }
            }
            return {}
          },
        },
      ],
    },
    {
      headerName: 'Supply Option',
      marryChildren: true,
      children: [
        {
          field: 'originLocation',
          headerName: 'Origin',
          filter: true,
          sortable: true,
          width: 100,
          pinned: 'left' as const,
          cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
        },
        {
          field: 'supplier',
          headerName: 'Supplier',
          filter: true,
          sortable: true,
          width: 100,
          pinned: 'left' as const,
          cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
        },
        {
          field: 'channel',
          headerName: 'Price Type',
          filter: true,
          sortable: true,
          width: 90,
          pinned: 'left' as const,
          cellRenderer: (params: any) => {
            if (!params.value) return null
            const isInactive = isAllocationLimitRow(params.data)
            const colorMap: Record<string, string> = {
              'Day Deal': '#722ed1',
              Contract: '#1890ff',
              Rack: '#8c8c8c',
            }
            const color = isInactive ? '#bfbfbf' : colorMap[params.value] ?? '#8c8c8c'
            return <span style={{ color, fontWeight: 500 }}>{params.value}</span>
          },
        },
      ],
    },
    {
      headerName: 'Pricing',
      marryChildren: true,
      children: [
        {
          field: 'price',
          headerName: 'Price',
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'rightAligned',
          valueFormatter: currencyFormatter,
          width: 110,
          cellStyle: (params: any) => {
            if (isAllocationLimitRow(params.data)) return INACTIVE_CELL_STYLE
            if (params.data?.priceRank === 1)
              return { color: '#389e0d', fontWeight: 'bold' }
            return {}
          },
        },
        {
          field: 'priceRank',
          headerName: 'Rank',
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'rightAligned',
          width: 70,
          cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
        },
        {
          field: 'delta',
          headerName: 'vs. Current',
          sortable: true,
          filter: 'agNumberColumnFilter',
          type: 'rightAligned',
          cellRenderer: deltaRenderer,
          width: 115,
        },
      ],
    },
    {
      headerName: 'Commitment Health',
      marryChildren: true,
      children: [
        {
          field: 'month.status',
          headerName: 'Status',
          cellRenderer: commitmentHealthRenderer,
          filter: true,
          sortable: true,
          width: 170,
        },
        {
          field: 'month.toDatePctOfForecast',
          headerName: 'MTD %',
          valueFormatter: pctFormatter,
          cellStyle: (params: any) => {
            if (isAllocationLimitRow(params.data)) return INACTIVE_CELL_STYLE
            if (params.data?.channel === 'Rack') return { color: '#8c8c8c' }
            return pctCellStyle(params)
          },
          type: 'rightAligned',
          filter: 'agNumberColumnFilter',
          sortable: true,
          width: 85,
        },
        {
          headerName: 'Avail Vol',
          colId: 'monthAvailableVolume',
          valueGetter: (params: any) => {
            const data: SupplyOptionRow | undefined = params.data
            if (!data) return null
            // Use month data if available, fall back to week (e.g. Day Deal is weekly-only)
            const period = data.month ?? data.week
            if (!period) return null
            const forecast = period.forecast ?? 0
            const liftings = period.liftings ?? 0
            return forecast - liftings
          },
          valueFormatter: numberFormatter,
          type: 'rightAligned',
          filter: 'agNumberColumnFilter',
          sortable: true,
          width: 95,
          cellStyle: (params: any) => {
            if (isAllocationLimitRow(params.data)) return INACTIVE_CELL_STYLE
            if (params.data?.channel === 'Rack' || (params.data?.month == null && params.data?.week == null)) {
              return { color: '#8c8c8c' }
            }
            if (params.value != null && params.value <= 0) {
              return { color: 'var(--theme-error, #ff4d4f)', fontWeight: 'bold' }
            }
            return {}
          },
        },
      ],
    },
  ]
}

// ============================================================================
// Decision Summary Bar
// ============================================================================

function DecisionSummaryBar({
  rowData,
  strategyDefaultId,
  activeSupplyOptionIds,
  strategy,
}: {
  rowData: SupplyOptionRow[]
  strategyDefaultId: number | null | undefined
  activeSupplyOptionIds: Set<number>
  strategy: string
}) {
  if (!rowData.length) return null

  const cheapest = rowData.reduce((best, row) =>
    !isAllocationLimitRow(row) && row.price < best.price ? row : best
  )

  const recommended = strategyDefaultId != null
    ? rowData.find((r) => r.id === strategyDefaultId)
    : null

  const activeIds = [...activeSupplyOptionIds]
  const activeOption = activeIds.length === 1
    ? rowData.find((r) => r.id === activeIds[0])
    : null

  const atRiskCount = rowData.filter(
    (r) =>
      !isAllocationLimitRow(r) &&
      (r.month?.status === 'At Risk' || r.week?.status === 'At Risk')
  ).length

  const behindCount = rowData.filter(
    (r) =>
      !isAllocationLimitRow(r) &&
      (r.month?.status === 'Behind' || r.week?.status === 'Behind')
  ).length

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '4px 12px',
        fontSize: 12,
        borderBottom: '1px solid var(--theme-border, #e8e8e8)',
        backgroundColor: 'var(--theme-bg-elevated, #fafafa)',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      {/* Cheapest available */}
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: '#8c8c8c' }}>Lowest:</span>
        <span style={{ fontWeight: 600, color: '#389e0d' }}>
          ${cheapest.price.toFixed(4)}
        </span>
        <span style={{ color: '#8c8c8c' }}>
          ({cheapest.supplier} · {cheapest.channel})
        </span>
      </span>

      {/* Divider */}
      <span style={{ color: '#d9d9d9' }}>|</span>

      {/* Strategy recommendation */}
      {recommended && (
        <>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--theme-primary, #1890ff)' }}>★</span>
            <span style={{ color: '#8c8c8c' }}>{strategy}:</span>
            <span style={{ fontWeight: 600 }}>
              ${recommended.price.toFixed(4)}
            </span>
            <span style={{ color: '#8c8c8c' }}>
              ({recommended.supplier} · {recommended.channel})
            </span>
          </span>
          <span style={{ color: '#d9d9d9' }}>|</span>
        </>
      )}

      {/* Current selection (if different from recommended) */}
      {activeOption && recommended && activeOption.id !== recommended.id && (
        <>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#8c8c8c' }}>Selected:</span>
            <span style={{ fontWeight: 600 }}>
              ${activeOption.price.toFixed(4)}
            </span>
            <span style={{ color: '#8c8c8c' }}>
              ({activeOption.supplier} · {activeOption.channel})
            </span>
            {activeOption.price > recommended.price && (
              <Tag color="orange" style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>
                +${(activeOption.price - recommended.price).toFixed(4)} vs rec.
              </Tag>
            )}
          </span>
          <span style={{ color: '#d9d9d9' }}>|</span>
        </>
      )}

      {/* Commitment alerts */}
      {(atRiskCount > 0 || behindCount > 0) && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {atRiskCount > 0 && (
            <Tag color="red" style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>
              {atRiskCount} At Risk
            </Tag>
          )}
          {behindCount > 0 && (
            <Tag color="orange" style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>
              {behindCount} Behind
            </Tag>
          )}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

export function SupplyOptionsView({
  selectedRow,
  activeSupplyOptionIds,
  strategyDefaultId,
  onSupplyOptionsSelected,
}: SupplyOptionsViewProps) {
  const [viewMode, setViewMode] = useState<SupplyOptionsViewMode>('focused')

  const allRowData = useMemo(() => generateSupplyOptionsData(selectedRow), [selectedRow])

  const rowData = useMemo(() => {
    if (viewMode === 'focused') {
      // Focused view: all non-allocated contracts, top 3 rack prices, and all day deals
      const contracts = allRowData.filter(
        (row) => row.channel === 'Contract' && !isAllocationLimitRow(row)
      )
      const racks = allRowData
        .filter((row) => row.channel === 'Rack')
        .sort((a, b) => a.price - b.price)
        .slice(0, 3)
      const dayDeals = allRowData.filter((row) => row.channel === 'Day Deal')
      // Merge and deduplicate by id
      const idSet = new Set<number>()
      const merged: SupplyOptionRow[] = []
      for (const row of [...dayDeals, ...contracts, ...racks]) {
        if (!idSet.has(row.id)) {
          idSet.add(row.id)
          merged.push(row)
        }
      }
      // Sort by channel order (Day Deal first, then Contract, then Rack), then by price within channel
      const channelOrder: Record<string, number> = { 'Day Deal': 0, Contract: 1, Rack: 2 }
      return merged.sort((a, b) => {
        const orderDiff = (channelOrder[a.channel] ?? 9) - (channelOrder[b.channel] ?? 9)
        if (orderDiff !== 0) return orderDiff
        return a.price - b.price
      })
    }
    return allRowData
  }, [allRowData, viewMode])

  const activeIdSet = useMemo(
    () => new Set(activeSupplyOptionIds ?? []),
    [activeSupplyOptionIds]
  )

  const columnDefs = useMemo(
    () => (viewMode === 'focused' ? getFocusedColumnDefs(strategyDefaultId) : allViewColumnDefs),
    [viewMode, strategyDefaultId]
  )

  const controlBarProps = useMemo(
    () => ({
      title: viewMode === 'focused' ? 'Supply Options — Focused' : 'Supply Options',
      hideActiveFilters: true,
      actionButtons: (
        <Segmented
          size="small"
          value={viewMode}
          onChange={(val) => setViewMode(val as SupplyOptionsViewMode)}
          options={[
            { label: 'All', value: 'all' },
            { label: 'Focused', value: 'focused' },
          ]}
        />
      ),
    }),
    [viewMode]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => String(params.data?.id),
      domLayout: 'normal' as const,
      headerHeight: 28,
      rowHeight: 28,
      rowSelection: 'multiple' as const,
      isRowSelectable: (node: any) => !isAllocationLimitRow(node.data),
      onRowSelected: (event: any) => {
        if (!onSupplyOptionsSelected || !event.node.isSelected()) return
        const selected: SupplyOptionRow[] = event.api.getSelectedRows()
        if (selected.length > 0) {
          onSupplyOptionsSelected(selected)
        }
      },
      getRowStyle: (params: any) => {
        const data: SupplyOptionRow | undefined = params.data
        if (isAllocationLimitRow(data)) {
          return {
            backgroundColor: 'var(--theme-bg-disabled, #f5f5f5)',
            color: '#bfbfbf',
            fontStyle: 'italic',
          }
        }
        if (activeIdSet.has(data?.id)) {
          return {
            backgroundColor: 'var(--theme-primary-dim, rgba(24, 144, 255, 0.08))',
            borderLeft: '3px solid var(--theme-primary, #1890ff)',
          }
        }
        // In focused mode, add subtle channel grouping separator
        if (viewMode === 'focused' && params.node?.rowIndex > 0) {
          const prevData = params.api?.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data
          if (prevData && data && prevData.channel !== data.channel) {
            return {
              borderTop: '2px solid var(--theme-border, #e8e8e8)',
            }
          }
        }
        return undefined
      },
    }),
    [activeIdSet, onSupplyOptionsSelected, viewMode]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Decision summary bar — only in focused mode */}
      {viewMode === 'focused' && (
        <DecisionSummaryBar
          rowData={rowData}
          strategyDefaultId={strategyDefaultId}
          activeSupplyOptionIds={activeIdSet}
          strategy={selectedRow.Strategy}
        />
      )}

      {/* Grid */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraviGrid
          storageKey={`dp-supply-options-${viewMode}-grid`}
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          headerHeight={28}
        />
      </div>
    </div>
  )
}
