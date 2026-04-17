import { useState, useCallback, useRef, useEffect } from 'react'
import { Texto } from '@gravitate-js/excalibrr'
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { InventorySummaryStrip } from './InventorySummaryStrip'
import { AllocationGrid } from './AllocationGrid'
import { RackRankingsGrid } from './RackRankingsGrid'
import { CustomerLiftingsGrid } from './CustomerLiftingsGrid'
import type { InventoryQuoteRow } from '../InventoryAnalytics.types'

const LS_KEY_SPLITS = 'inv-unified-splits'
const DEFAULT_SPLITS = [25, 25, 25, 25]

function DraggableDivider({ onDrag }: { onDrag: (deltaX: number) => void }) {
  const dragging = useRef(false)
  const lastX = useRef(0)
  const [hovered, setHovered] = useState(false)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    lastX.current = e.clientX
    e.preventDefault()

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      const dx = ev.clientX - lastX.current
      lastX.current = ev.clientX
      onDrag(dx)
    }
    const onMouseUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [onDrag])

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 6,
        cursor: 'col-resize',
        background: hovered || dragging.current ? 'var(--theme-color-1)' : 'var(--gray-200)',
        transition: 'background 150ms',
        flexShrink: 0,
        borderRadius: 3,
      }}
    />
  )
}

function TankLabel({ viewBox, value, position }: any) {
  if (!viewBox) return null
  const { x, y, width } = viewBox
  const labelX = (x || 0) + (width || 0) - 8
  const labelY = position === 'above' ? (y || 0) - 6 : (y || 0) + 14
  return (
    <g>
      <rect
        x={labelX - 52}
        y={labelY - 10}
        width={56}
        height={14}
        rx={3}
        fill="var(--bg-1, #fff)"
        stroke="#ca8a04"
        strokeWidth={0.5}
        opacity={0.95}
      />
      <text
        x={labelX - 24}
        y={labelY}
        textAnchor="middle"
        fontSize={9}
        fontWeight={600}
        fill="#ca8a04"
      >
        {value}
      </text>
    </g>
  )
}

function BurndownChart({ row }: { row: InventoryQuoteRow }) {
  const chartData = row.inventoryForecast.map(p => ({
    date: p.date.slice(5),
    inventory: p.inventory,
    actual: p.recordType === 'estimate' ? null : p.inventory,
    forecast: p.recordType === 'estimate' ? p.inventory : null,
  }))

  const todayLabel = new Date().toISOString().split('T')[0].slice(5)

  return (
    <div style={{ flex: 1, padding: '4px 4px 0' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={4} />
          <YAxis tick={{ fontSize: 9 }} domain={[0, 100000]} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} width={35} />
          <Tooltip formatter={(val: number) => val.toLocaleString()} />
          <ReferenceLine y={row.tankTop} stroke="#ca8a04" strokeDasharray="4 4" label={<TankLabel value="Tank Top" position="above" />} />
          <ReferenceLine y={row.tankBottom} stroke="#ca8a04" strokeDasharray="4 4" label={<TankLabel value="Tank Bottom" position="below" />} />
          <ReferenceLine x={todayLabel} stroke="#9ca3af" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="actual" stroke="#64D28D" fill="#64D28D" fillOpacity={0.2} connectNulls={false} dot={false} />
          <Line type="monotone" dataKey="forecast" stroke="#64D28D" strokeDasharray="6 3" dot={false} connectNulls={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

interface UnifiedViewProps {
  row: InventoryQuoteRow
}

export function UnifiedView({ row }: UnifiedViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [splits, setSplits] = useState<number[]>(() => {
    const saved = localStorage.getItem(LS_KEY_SPLITS)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === 4) return parsed
      } catch { /* use default */ }
    }
    return [...DEFAULT_SPLITS]
  })

  useEffect(() => {
    localStorage.setItem(LS_KEY_SPLITS, JSON.stringify(splits))
  }, [splits])

  const makeDragHandler = useCallback((dividerIndex: number) => {
    return (dx: number) => {
      if (!containerRef.current) return
      const dividerCount = 3
      const totalWidth = containerRef.current.offsetWidth - dividerCount * 6
      const pctDelta = (dx / totalWidth) * 100

      setSplits(prev => {
        const next = [...prev]
        const leftIdx = dividerIndex
        const rightIdx = dividerIndex + 1

        const newLeft = next[leftIdx] + pctDelta
        const newRight = next[rightIdx] - pctDelta

        if (newLeft < 10 || newRight < 10) return prev

        next[leftIdx] = newLeft
        next[rightIdx] = newRight
        return next
      })
    }
  }, [])

  const handleMaxMode = useCallback(() => {
    // Placeholder for future max-mode analytics view
    console.log('Customer Liftings max-mode requested')
  }, [])

  return (
    <div ref={containerRef} style={{ display: 'flex', height: '100%', gap: 0 }}>
      {/* Column 1: Inventory (burndown chart + summary strip) */}
      <div style={{ flex: splits[0], display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <BurndownChart row={row} />
        <InventorySummaryStrip row={row} />
      </div>

      <DraggableDivider onDrag={makeDragHandler(0)} />

      {/* Column 2: Allocation Grid */}
      <div style={{ flex: splits[1], overflow: 'hidden', minWidth: 0 }}>
        <AllocationGrid productName={row.productName} />
      </div>

      <DraggableDivider onDrag={makeDragHandler(1)} />

      {/* Column 3: Rack Rankings */}
      <div style={{ flex: splits[2], overflow: 'hidden', minWidth: 0 }}>
        <RackRankingsGrid productName={row.productName} />
      </div>

      <DraggableDivider onDrag={makeDragHandler(2)} />

      {/* Column 4: Customer Liftings */}
      <div style={{ flex: splits[3], overflow: 'hidden', minWidth: 0 }}>
        <CustomerLiftingsGrid onMaxMode={handleMaxMode} />
      </div>
    </div>
  )
}
