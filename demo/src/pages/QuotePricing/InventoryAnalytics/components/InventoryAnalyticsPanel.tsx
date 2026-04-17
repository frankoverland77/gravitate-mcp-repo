import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { InventorySummaryCard } from './InventorySummaryCard'
import { UnifiedView } from './UnifiedView'
import type { InventoryQuoteRow, AnalyticsViewType } from '../InventoryAnalytics.types'

const viewOptions: { value: AnalyticsViewType; label: string }[] = [
  { value: 'inventory', label: 'Inventory' },
  { value: 'unified_view', label: 'Unified View' },
  { value: 'liftings_vs_benchmark', label: 'Liftings vs Benchmark' },
  { value: 'liftings_vs_margin', label: 'Liftings vs Margin' },
  { value: 'customer_liftings', label: 'Customer Liftings' },
  { value: 'competitor_prices', label: 'Competitor Prices' },
  { value: 'allocation', label: 'Allocation' },
]

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

function InventoryChart({ row }: { row: InventoryQuoteRow }) {
  const chartData = row.inventoryForecast.map(p => ({
    date: p.date.slice(5),
    inventory: p.inventory,
    actual: p.recordType === 'estimate' ? null : p.inventory,
    forecast: p.recordType === 'estimate' ? p.inventory : null,
  }))

  const todayLabel = new Date().toISOString().split('T')[0].slice(5)

  return (
    <div style={{ flex: 1, padding: '4px 8px' }}>
      <Horizontal gap={8} alignItems="center" style={{ marginBottom: 4 }}>
        <Texto weight="600" style={{ fontSize: 12 }}>Rolling Inventory</Texto>
        <Horizontal gap={12} alignItems="center">
          <Horizontal gap={4} alignItems="center">
            <div style={{ width: 16, height: 2, background: '#64D28D' }} />
            <Texto appearance="medium" style={{ fontSize: 10 }}>Actual</Texto>
          </Horizontal>
          <Horizontal gap={4} alignItems="center">
            <div style={{ width: 16, height: 2, background: '#64D28D', borderTop: '2px dashed #64D28D' }} />
            <Texto appearance="medium" style={{ fontSize: 10 }}>Projected</Texto>
          </Horizontal>
        </Horizontal>
      </Horizontal>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={3} />
          <YAxis tick={{ fontSize: 10 }} domain={[0, 100000]} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip
            formatter={(val: number) => val.toLocaleString()}
            labelFormatter={(label: string) => `Date: ${label}`}
          />
          <ReferenceLine
            y={row.tankTop}
            stroke="#ca8a04"
            strokeDasharray="4 4"
            label={<TankLabel value="Tank Top" position="above" />}
          />
          <ReferenceLine
            y={row.tankBottom}
            stroke="#ca8a04"
            strokeDasharray="4 4"
            label={<TankLabel value="Tank Bottom" position="below" />}
          />
          <ReferenceLine
            x={todayLabel}
            stroke="#9ca3af"
            strokeDasharray="4 4"
            label={{ value: 'Today', fontSize: 10, fill: '#9ca3af', position: 'insideTopLeft' }}
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#64D28D"
            fill="#64D28D"
            fillOpacity={0.2}
            strokeWidth={2}
            connectNulls={false}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#64D28D"
            strokeDasharray="6 3"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

interface InventoryAnalyticsPanelProps {
  open: boolean
  selectedRow?: InventoryQuoteRow | null
  selectedView: AnalyticsViewType
  onViewChange: (view: AnalyticsViewType) => void
}

export function InventoryAnalyticsPanel({
  open,
  selectedRow,
  selectedView,
  onViewChange,
}: InventoryAnalyticsPanelProps) {
  return (
    <div style={{
      height: open ? '380px' : '0px',
      overflow: 'hidden',
      transition: 'height 300ms ease',
      borderBottom: open ? '1px solid var(--gray-200)' : 'none',
    }}>
      <Vertical style={{ padding: '12px 16px', height: '100%' }}>
        {/* Header */}
        <Horizontal justifyContent="space-between" alignItems="center" style={{ marginBottom: 8, flexShrink: 0 }}>
          <Horizontal gap={12} alignItems="center">
            <Texto category="h5" weight="600">Quote Analytics</Texto>
            <Select
              style={{ width: 220 }}
              value={selectedView}
              onChange={onViewChange}
              options={viewOptions}
            />
            <div style={{ width: 1, height: 20, background: 'var(--gray-200)' }} />
            {selectedRow && (
              <Texto appearance="medium" style={{ fontSize: 13 }}>
                {selectedRow.productName} @ {selectedRow.locationName}
              </Texto>
            )}
          </Horizontal>
        </Horizontal>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {!selectedRow ? (
            <Vertical justifyContent="center" alignItems="center" height="100%">
              <Texto appearance="medium">Select a row to view analytics</Texto>
            </Vertical>
          ) : selectedView === 'inventory' ? (
            <Horizontal height="100%" gap={12}>
              <InventorySummaryCard row={selectedRow} fillHeight />
              <InventoryChart row={selectedRow} />
            </Horizontal>
          ) : selectedView === 'unified_view' ? (
            <UnifiedView row={selectedRow} />
          ) : (
            <Vertical justifyContent="center" alignItems="center" height="100%">
              <Texto appearance="medium">
                {viewOptions.find(v => v.value === selectedView)?.label || selectedView} view coming soon
              </Texto>
            </Vertical>
          )}
        </div>
      </Vertical>
    </div>
  )
}
