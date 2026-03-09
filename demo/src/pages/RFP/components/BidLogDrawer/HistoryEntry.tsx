/**
 * History Entry Component
 *
 * Displays a single bid edit with cell identifier, value change, metadata, and revert button.
 */

import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { UndoOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import type { BidEdit } from '../../rfp.types'
import styles from './BidLogDrawer.module.css'

interface HistoryEntryProps {
  edit: BidEdit
  onRevert: () => void
  compact?: boolean
}

function formatTimestamp(date: Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatPrice(value: number): string {
  return `$${value.toFixed(4)}`
}

export function HistoryEntry({ edit, onRevert, compact = false }: HistoryEntryProps) {
  const isReverted = edit.isReverted
  const sourceIcon = edit.source === 'inline' ? <EditOutlined /> : <UploadOutlined />
  const sourceLabel = edit.source === 'inline' ? 'Inline edit' : 'Bulk upload'

  return (
    <div className={`${styles.historyEntry} ${isReverted ? styles.reverted : ''} ${compact ? styles.compact : ''}`}>
      <Horizontal justifyContent='space-between' alignItems='flex-start'>
        <Vertical gap={4} style={{ flex: 1 }}>
          {/* Cell identifier */}
          <Texto weight='600' className={isReverted ? styles.strikethrough : ''}>
            {edit.productName} / {edit.locationName}
          </Texto>
          <Texto category='p2' appearance='medium'>
            {edit.supplierName}
          </Texto>

          {/* Value change */}
          <Horizontal gap={8} alignItems='center'>
            <Texto category='p2' className={isReverted ? styles.strikethrough : ''}>
              <span className={styles.oldValue}>{formatPrice(edit.previousValue)}</span>
              <span className={styles.arrow}> → </span>
              <span className={styles.newValue}>{formatPrice(edit.newValue)}</span>
            </Texto>
          </Horizontal>

          {/* Metadata */}
          <Horizontal gap={8} alignItems='center'>
            <span className={styles.sourceIcon}>{sourceIcon}</span>
            <Texto category='p2' appearance='medium'>
              {sourceLabel}
            </Texto>
            <span className={styles.separator}>•</span>
            <Texto category='p2' appearance='medium'>
              {edit.userName}
            </Texto>
            <span className={styles.separator}>•</span>
            <Texto category='p2' appearance='medium'>
              {formatTimestamp(edit.timestamp)}
            </Texto>
          </Horizontal>

          {/* Reverted label */}
          {isReverted && (
            <Texto category='p2' appearance='medium' className={styles.revertedLabel}>
              (Reverted{edit.revertedAt ? ` ${formatTimestamp(edit.revertedAt)}` : ''})
            </Texto>
          )}
        </Vertical>

        {/* Revert button */}
        {!isReverted && (
          <GraviButton
            type='text'
            icon={<UndoOutlined />}
            onClick={onRevert}
            title='Revert this change'
            className={styles.revertButton}
          />
        )}
      </Horizontal>
    </div>
  )
}
