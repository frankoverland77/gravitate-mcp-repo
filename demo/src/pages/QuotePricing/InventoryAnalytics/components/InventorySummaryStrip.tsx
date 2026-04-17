import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { InventoryQuoteRow } from '../InventoryAnalytics.types'

function StatusDot({ status }: { status: 'containment' | 'runout' | 'normal' }) {
  const color = status === 'normal' ? '#16a34a' : '#dc2626'
  return (
    <span style={{
      display: 'inline-block',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
    }} />
  )
}

function Metric({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <Horizontal gap={4} alignItems="center" style={{ whiteSpace: 'nowrap' }}>
      <Texto appearance="medium" style={{ fontSize: 10 }}>{label}</Texto>
      <Texto weight="600" style={{ fontSize: 11 }}>
        {value}{unit ? ` ${unit}` : ''}
      </Texto>
    </Horizontal>
  )
}

interface InventorySummaryStripProps {
  row: InventoryQuoteRow
}

export function InventorySummaryStrip({ row }: InventorySummaryStripProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '4px 8px',
      background: 'var(--gray-50)',
      borderTop: '1px solid var(--gray-200)',
      flexShrink: 0,
    }}>
      {/* Row 1: Current Inventory */}
      <Horizontal gap={12} alignItems="center" style={{ minHeight: 18 }}>
        <Horizontal gap={4} alignItems="center">
          <Texto weight="700" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3, color: 'var(--gray-400)' }}>Now</Texto>
          <StatusDot status={row.currentStatus} />
        </Horizontal>
        <Metric label="Inv" value={`${(row.currentInventoryPct * 100).toFixed(0)}%`} />
        <Metric label="Bbl" value={row.currentBarrels.toLocaleString()} />
        <Texto appearance="medium" style={{ fontSize: 9, color: 'var(--gray-400)' }}>
          as of {new Date(row.lastUpdated).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        </Texto>
      </Horizontal>

      {/* Row 2: Upcoming Inventory (Projected) */}
      <Horizontal gap={12} alignItems="center" style={{ minHeight: 18 }}>
        <Horizontal gap={4} alignItems="center">
          <Texto weight="700" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3, color: 'var(--gray-400)' }}>Next</Texto>
          <StatusDot status={row.afterNextBatchStatus} />
          <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 0.2 }}>Projected</span>
        </Horizontal>
        <Metric label="Inv" value={`${(row.afterBatchInventoryPct * 100).toFixed(0)}%`} />
        <Metric label="Bbl" value={row.afterBatchBarrels.toLocaleString()} />
        <Metric label="Batch" value={row.nextBatchDate.slice(5)} />
      </Horizontal>
    </div>
  )
}
