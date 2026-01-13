import { Texto, Horizontal, Vertical, GraviButton } from '@gravitate-js/excalibrr'
import { Button, Input, Checkbox } from 'antd'
import { CopyOutlined, CloseOutlined, SnippetsOutlined } from '@ant-design/icons'
import type { FormulaClipboard, DetailFormulaConfig } from '../types/scenario.types'
import styles from './FormulaScenarioDrawer.module.css'

interface HeaderProps {
  onClose: () => void
  isEditMode?: boolean
  isSingleDetailMode?: boolean
}

export function DrawerHeader({ onClose, isEditMode, isSingleDetailMode }: HeaderProps) {
  const title = isEditMode
    ? isSingleDetailMode
      ? 'Edit Detail Formula'
      : 'Edit Formula Scenario'
    : 'Add Formula Scenario'

  const subtitle = isSingleDetailMode
    ? 'Update the formula for this product/location detail'
    : 'Configure formulas for each product/location detail'

  return (
    <div className={styles.header}>
      <Horizontal justifyContent="space-between" alignItems="flex-start">
        <Vertical style={{ gap: '4px' }}>
          <Texto style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>{title}</Texto>
          <Texto style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>{subtitle}</Texto>
        </Vertical>
        <Button
          type="link"
          onClick={onClose}
          style={{ color: '#ffffff', fontSize: '20px', padding: 0, height: 'auto', lineHeight: 1 }}
        >
          ×
        </Button>
      </Horizontal>
    </div>
  )
}

export function StatusLegend() {
  return (
    <div className={styles.statusLegend}>
      <span className={`${styles.statusPill} ${styles.statusEmpty}`}>
        <span className={styles.statusDot} />
        Empty
      </span>
      <span className={`${styles.statusPill} ${styles.statusInProgress}`}>
        <span className={styles.statusDot} />
        In Progress
      </span>
      <span className={`${styles.statusPill} ${styles.statusConfirmed}`}>
        <span className={styles.statusDot} />
        Confirmed
      </span>
    </div>
  )
}

interface ClipboardBarProps {
  clipboard: FormulaClipboard
  onClear: () => void
}

export function ClipboardBar({ clipboard, onClear }: ClipboardBarProps) {
  if (!clipboard.hasContent) return null

  return (
    <div className={styles.clipboardBar}>
      <div className={styles.clipboardContent}>
        <CopyOutlined className={styles.clipboardIcon} />
        <Texto category="p2">Formula copied from "{clipboard.sourceName}"</Texto>
      </div>
      <GraviButton buttonText="Clear" appearance="outlined" size="small" onClick={onClear} />
    </div>
  )
}

interface BulkActionBarProps {
  selectedCount: number
  hasClipboard: boolean
  onBulkPaste: () => void
  onClearSelection: () => void
}

export function BulkActionBar({
  selectedCount,
  hasClipboard,
  onBulkPaste,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className={styles.bulkActionBar}>
      <Texto category="p2" weight="600">
        {selectedCount} row(s) selected
      </Texto>
      <div className={styles.bulkActionButtons}>
        {hasClipboard && (
          <GraviButton
            buttonText="Paste Formula"
            icon={<SnippetsOutlined />}
            appearance="outlined"
            size="small"
            onClick={onBulkPaste}
          />
        )}
        <GraviButton
          buttonText="Clear Selection"
          icon={<CloseOutlined />}
          appearance="outlined"
          size="small"
          onClick={onClearSelection}
        />
      </div>
    </div>
  )
}

interface ScenarioNameInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ScenarioNameInput({ value, onChange, disabled }: ScenarioNameInputProps) {
  return (
    <div style={{ padding: '16px 24px', backgroundColor: '#ffffff', marginBottom: '16px' }}>
      <Texto
        style={{
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '8px',
          display: 'block',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#595959',
        }}
      >
        Scenario Name
      </Texto>
      <Input
        placeholder="Enter scenario name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="large"
        maxLength={100}
        disabled={disabled}
      />
    </div>
  )
}

interface DetailsListHeaderProps {
  allSelected: boolean
  someSelected: boolean
  onSelectAll: () => void
}

export function DetailsListHeader({ allSelected, someSelected, onSelectAll }: DetailsListHeaderProps) {
  return (
    <div className={styles.detailsHeader}>
      <div className={styles.headerCheckbox}>
        <Checkbox checked={allSelected} indeterminate={someSelected} onChange={onSelectAll} />
      </div>
      <div className={styles.headerTitle}>Product / Location</div>
      <div className={styles.headerStatus}>Status</div>
    </div>
  )
}

interface FooterProps {
  progress: { confirmed: number; total: number; percentage: number }
  confirmableCount: number
  hasSelection?: boolean
  isEditMode?: boolean
  onConfirmAll: () => void
  onCancel: () => void
  onSave: () => void
}

export function DrawerFooter({
  progress,
  confirmableCount,
  hasSelection = false,
  isEditMode = false,
  onConfirmAll,
  onCancel,
  onSave,
}: FooterProps) {
  const confirmButtonText = hasSelection
    ? `Confirm Selected (${confirmableCount})`
    : `Confirm All (${confirmableCount})`

  const saveButtonText = isEditMode ? 'Save Changes' : 'Add Scenario'

  return (
    <div className={styles.footer}>
      <Horizontal justifyContent="space-between" alignItems="center">
        <div className={styles.footerProgress}>
          {/* Progress bar */}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress.percentage}%` }} />
          </div>
          {/* Count text */}
          <Texto category="p2" className={styles.progressText}>
            {progress.confirmed} of {progress.total} confirmed
          </Texto>
          {/* Confirm button */}
          {confirmableCount > 0 && (
            <GraviButton
              buttonText={confirmButtonText}
              appearance="outlined"
              size="small"
              onClick={onConfirmAll}
            />
          )}
        </div>

        {/* Right side: Cancel + Save buttons */}
        <Horizontal style={{ gap: '16px' }}>
          <GraviButton
            buttonText="Cancel"
            size="large"
            appearance="outlined"
            onClick={onCancel}
            style={{ minWidth: '100px' }}
          />
          <GraviButton
            buttonText={saveButtonText}
            size="large"
            success
            onClick={onSave}
            style={{ minWidth: '140px' }}
          />
        </Horizontal>
      </Horizontal>
    </div>
  )
}
