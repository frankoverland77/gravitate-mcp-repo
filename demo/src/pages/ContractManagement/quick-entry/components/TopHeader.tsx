/**
 * Top Header Component
 *
 * Page title + badge + action buttons (Cancel, Save Draft)
 * Matches wireframe: white background, border-bottom, space-between layout
 * Supports create/edit/view modes
 */

import { Horizontal, Texto, GraviButton, BBDTag } from '@gravitate-js/excalibrr'
import type { PageMode, ContractStatus } from '../../types/contract.types'
import styles from './TopHeader.module.css'

interface TopHeaderProps {
  onCancel: () => void
  onSaveDraft: () => void
  mode?: PageMode
  contractName?: string
  contractStatus?: ContractStatus
}

const statusConfig: Record<ContractStatus, { success?: boolean; warning?: boolean; error?: boolean; label: string }> = {
  active: { success: true, label: 'Active' },
  draft: { warning: true, label: 'Draft' },
  pending: { warning: true, label: 'Pending' },
  expired: { error: true, label: 'Expired' },
}

export function TopHeader({ onCancel, onSaveDraft, mode = 'create', contractStatus }: TopHeaderProps) {
  const isViewMode = mode === 'view'

  return (
    <Horizontal className={styles.container} justifyContent='space-between' alignItems='center'>
      <Horizontal gap={16} alignItems='center'>
        <Texto category='h3' weight='600'>
          Quick Deal Entry
        </Texto>
        {mode === 'create' ? (
          <span className={styles.badge}>New Contract</span>
        ) : contractStatus ? (
          <BBDTag
            success={statusConfig[contractStatus]?.success}
            warning={statusConfig[contractStatus]?.warning}
            error={statusConfig[contractStatus]?.error}
          >
            {statusConfig[contractStatus]?.label || contractStatus}
          </BBDTag>
        ) : null}
      </Horizontal>

      {!isViewMode && (
        <Horizontal gap={12}>
          <GraviButton buttonText='Cancel' onClick={onCancel} />
          <GraviButton buttonText='Save as Draft' onClick={onSaveDraft} />
        </Horizontal>
      )}
    </Horizontal>
  )
}
