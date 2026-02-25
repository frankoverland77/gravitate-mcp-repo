import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { CustomerLiftingsTotals } from '../data/elasticity.types'
import { numberToShortString } from '../data/elasticity.data'

interface CompactTotalsHeaderProps {
  totals: CustomerLiftingsTotals
}

export function CompactTotalsHeader({ totals }: CompactTotalsHeaderProps) {
  return (
    <Horizontal
      alignItems="center"
      style={{
        gap: '20px',
        padding: '6px 12px',
        backgroundColor: '#fafafa',
        borderRadius: '6px',
        border: '1px solid #f0f0f0',
      }}
    >
      <CompactMetric label="Volume" value={`${numberToShortString(totals.totalVolume)} gal`} />
      <Divider />
      <CompactMetric
        label="Strategy Delta"
        value={`$${totals.strategyDelta.toFixed(4)}`}
        negative={totals.strategyDelta < 0}
      />
      <Divider />
      <CompactMetric label="Discounted" value={`$${numberToShortString(totals.totalDiscounted)}`} />
      <Divider />
      <CompactMetric label="Customers" value={String(totals.activeCustomers)} />
    </Horizontal>
  )
}

function CompactMetric({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <Horizontal alignItems="center" style={{ gap: '6px' }}>
      <Texto category="p2" appearance="medium" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </Texto>
      <Texto category="p2" weight="600" style={{ fontSize: '12px', color: negative ? '#ff4d4f' : undefined }}>
        {value}
      </Texto>
    </Horizontal>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 16, backgroundColor: '#d9d9d9' }} />
}
