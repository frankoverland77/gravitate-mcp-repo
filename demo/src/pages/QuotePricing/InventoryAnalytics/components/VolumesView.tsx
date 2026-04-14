import { useState, useCallback, useRef, useEffect } from 'react'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { InventorySummaryCard } from './InventorySummaryCard'
import { AllocationGrid } from './AllocationGrid'
import { RackRankingsGrid } from './RackRankingsGrid'
import { CustomerLiftingsGrid } from './CustomerLiftingsGrid'
import type { InventoryQuoteRow } from '../InventoryAnalytics.types'

const LS_KEY_PAGE1 = 'inv-volumes-split-p1'
const LS_KEY_PAGE2 = 'inv-volumes-split-p2'

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

function PageArrow({ direction, label, onClick }: { direction: 'left' | 'right'; label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        background: 'var(--gray-100)',
        borderRadius: 4,
        flexShrink: 0,
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        userSelect: 'none',
      }}
    >
      <Texto appearance="medium" style={{ fontSize: 10, transform: direction === 'left' ? 'rotate(180deg)' : 'none' }}>
        {direction === 'left' ? '\u2190' : '\u2192'} {label}
      </Texto>
    </div>
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
    actual: p.isForecast ? null : p.inventory,
    forecast: p.isForecast ? p.inventory : null,
  }))

  const todayLabel = new Date().toISOString().split('T')[0].slice(5)

  return (
    <div style={{ height: '100%', padding: '8px 4px' }}>
      <Texto weight="600" style={{ fontSize: 12, marginBottom: 4, paddingLeft: 8 }}>Inventory Burndown</Texto>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={chartData}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={3} />
          <YAxis tick={{ fontSize: 10 }} domain={[0, 100000]} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
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

interface VolumesViewProps {
  row: InventoryQuoteRow
}

export function VolumesView({ row }: VolumesViewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const [splitP1, setSplitP1] = useState(() => {
    const saved = localStorage.getItem(LS_KEY_PAGE1)
    return saved ? Number(saved) : 50
  })
  const [splitP2, setSplitP2] = useState(() => {
    const saved = localStorage.getItem(LS_KEY_PAGE2)
    return saved ? Number(saved) : 50
  })

  useEffect(() => { localStorage.setItem(LS_KEY_PAGE1, String(splitP1)) }, [splitP1])
  useEffect(() => { localStorage.setItem(LS_KEY_PAGE2, String(splitP2)) }, [splitP2])

  const handleDragP1 = useCallback((dx: number) => {
    if (!containerRef.current) return
    const totalWidth = containerRef.current.offsetWidth - 300 - 6 - 48
    const pctDelta = (dx / totalWidth) * 100
    setSplitP1(prev => Math.max(20, Math.min(80, prev + pctDelta)))
  }, [])

  const handleDragP2 = useCallback((dx: number) => {
    if (!containerRef.current) return
    const totalWidth = containerRef.current.offsetWidth - 300 - 6 - 48
    const pctDelta = (dx / totalWidth) * 100
    setSplitP2(prev => Math.max(20, Math.min(80, prev + pctDelta)))
  }, [])

  return (
    <div ref={containerRef} style={{ display: 'flex', height: '100%', gap: 8 }}>
      <InventorySummaryCard row={row} fillHeight />

      {currentPage === 0 && (
        <>
          <div style={{ flex: splitP1, overflow: 'hidden' }}>
            <BurndownChart row={row} />
          </div>
          <DraggableDivider onDrag={handleDragP1} />
          <div style={{ flex: 100 - splitP1, overflow: 'hidden' }}>
            <AllocationGrid productName={row.productName} />
          </div>
          <PageArrow direction="right" label="Rankings" onClick={() => setCurrentPage(1)} />
        </>
      )}

      {currentPage === 1 && (
        <>
          <PageArrow direction="left" label="Burndown" onClick={() => setCurrentPage(0)} />
          <div style={{ flex: splitP2, overflow: 'hidden' }}>
            <RackRankingsGrid productName={row.productName} />
          </div>
          <DraggableDivider onDrag={handleDragP2} />
          <div style={{ flex: 100 - splitP2, overflow: 'hidden' }}>
            <CustomerLiftingsGrid />
          </div>
        </>
      )}

      {/* Page dots */}
      <div style={{
        position: 'absolute',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 6,
      }}>
        {[0, 1].map(p => (
          <div
            key={p}
            onClick={() => setCurrentPage(p)}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: currentPage === p ? 'var(--theme-color-1)' : 'var(--gray-300)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  )
}
