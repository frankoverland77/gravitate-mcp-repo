import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { InventoryQuoteRow } from '../InventoryAnalytics.types'

function StatusBadge({ status }: { status: 'containment' | 'runout' | 'normal' }) {
  const config: Record<string, { bg: string; color: string }> = {
    containment: { bg: '#fecaca', color: '#dc2626' },
    runout: { bg: '#fecaca', color: '#dc2626' },
    normal: { bg: '#dcfce7', color: '#16a34a' },
  }
  const style = config[status] || config.normal
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      background: style.bg,
      color: style.color,
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  )
}

function SummaryRow({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <Horizontal justifyContent="space-between" alignItems="center" style={{ padding: '3px 0' }}>
      <Texto appearance="medium" style={{ fontSize: 12 }}>{label}</Texto>
      <Texto weight="600" style={{ fontSize: 12 }}>
        {value}{unit ? ` ${unit}` : ''}
      </Texto>
    </Horizontal>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <Texto weight="700" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--gray-400)', marginTop: 8, marginBottom: 4 }}>
      {children}
    </Texto>
  )
}

interface InventorySummaryCardProps {
  row: InventoryQuoteRow
  fillHeight?: boolean
}

export function InventorySummaryCard({ row, fillHeight }: InventorySummaryCardProps) {
  return (
    <Vertical
      style={{
        border: '1px solid var(--gray-200)',
        borderRadius: 8,
        padding: 16,
        background: 'var(--bg-1)',
        width: 300,
        minWidth: 300,
        ...(fillHeight ? { flex: 1 } : {}),
        overflow: 'auto',
      }}
    >
      <Texto weight="700" style={{ fontSize: 14, marginBottom: 12 }}>
        {row.productName} @ {row.locationName}
      </Texto>

      <GroupLabel>Current State</GroupLabel>
      <SummaryRow label="Inventory" value={`${(row.currentInventoryPct * 100).toFixed(0)}%`} />
      <SummaryRow label="Barrels" value={row.currentBarrels.toLocaleString()} unit="bbl" />
      <Horizontal justifyContent="space-between" alignItems="center" style={{ padding: '3px 0' }}>
        <Texto appearance="medium" style={{ fontSize: 12 }}>Status</Texto>
        <StatusBadge status={row.currentStatus} />
      </Horizontal>
      <SummaryRow label="Days of Supply" value={row.daysOfSupply} unit="days" />

      <GroupLabel>After Next Batch &mdash; {row.nextBatchDate}</GroupLabel>
      <SummaryRow label="Inventory" value={`${(row.afterBatchInventoryPct * 100).toFixed(0)}%`} />
      <SummaryRow label="Barrels" value={row.afterBatchBarrels.toLocaleString()} unit="bbl" />
      <Horizontal justifyContent="space-between" alignItems="center" style={{ padding: '3px 0' }}>
        <Texto appearance="medium" style={{ fontSize: 12 }}>Status</Texto>
        <StatusBadge status={row.afterNextBatchStatus} />
      </Horizontal>
      <SummaryRow label="Days of Supply" value={row.afterBatchDaysOfSupply} unit="days" />
    </Vertical>
  )
}
