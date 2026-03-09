/**
 * Context Summary Panel
 *
 * Left panel showing read-only context about the contract detail being edited.
 */

import { Vertical, Texto } from '@gravitate-js/excalibrr'

import type { ContractDetail } from '../../../types/contract.types'
import styles from './ContextSummaryPanel.module.css'

interface ContextSummaryPanelProps {
  detail: ContractDetail
}

interface FieldDisplayProps {
  label: string
  value: string | undefined
}

function FieldDisplay({ label, value }: FieldDisplayProps) {
  return (
    <Vertical className={styles.field}>
      <Texto category='p2' appearance='medium' style={{ fontSize: '11px' }}>
        {label}
      </Texto>
      <Texto category='p1' weight='500' style={{ fontSize: '14px' }}>
        {value || '—'}
      </Texto>
    </Vertical>
  )
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function ContextSummaryPanel({ detail }: ContextSummaryPanelProps) {
  return (
    <Vertical className={styles.container}>
      <Texto
        category='p2'
        appearance='medium'
        weight='600'
        style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}
        className='mb-2'
      >
        Detail Summary
      </Texto>

      <Vertical gap={16}>
        <FieldDisplay label='Product' value={detail.product} />
        <FieldDisplay label='Location' value={detail.location} />
        {detail.destination && (
          <FieldDisplay label='Destination' value={detail.destination} />
        )}
        <FieldDisplay label='Calendar' value={detail.calendar} />
        <FieldDisplay
          label='Date Range'
          value={`${formatDate(detail.startDate)} - ${formatDate(detail.endDate)}`}
        />
        <FieldDisplay
          label='Quantity'
          value={
            detail.quantity > 0
              ? `${new Intl.NumberFormat('en-US').format(detail.quantity)} GAL`
              : undefined
          }
        />
      </Vertical>
    </Vertical>
  )
}
