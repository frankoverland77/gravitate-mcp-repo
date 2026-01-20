import { useCallback } from 'react'
import { Horizontal, Texto, GraviButton, NotificationMessage } from '@gravitate-js/excalibrr'
import { SearchOutlined, SettingOutlined, SwapOutlined, EyeInvisibleOutlined, StopOutlined } from '@ant-design/icons'
import { Select, Input, Popover, Checkbox, Tooltip } from 'antd'
import type { SortOption, ThresholdConfig } from '../rfp.types'
import { SORT_OPTIONS, ALLOCATION_OPTIONS } from '../rfp.types'
import styles from './ComparisonToolbar.module.css'

interface ComparisonToolbarProps {
  round: number // Now supports any round number
  sortOrder: SortOption
  searchQuery: string
  thresholds: ThresholdConfig
  hiddenSuppliers: Set<string>
  hiddenSupplierNames?: Record<string, string>
  isManualMode?: boolean
  onSortChange: (sortOrder: SortOption) => void
  onSearchChange: (query: string) => void
  onToggleManualMode?: () => void
  onShowSupplier?: (supplierId: string) => void
  onShowAllSuppliers?: () => void
  onOpenThresholds?: () => void
  onAdvanceToNextRound?: () => void // Generic handler for any round
  onAward?: () => void
  onEditBids?: () => void
  onOpenEliminationModal?: () => void // New: open elimination modal
  selectedCount?: number
  isViewingHistory?: boolean
}

// Threshold pill component
function ThresholdPill({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <span className={styles.thresholdPill} onClick={onClick}>
      {label}
    </span>
  )
}

// Hidden suppliers popover content
function HiddenSuppliersPopover({
  hiddenSuppliers,
  hiddenSupplierNames,
  onShowSupplier,
  onShowAllSuppliers,
}: {
  hiddenSuppliers: Set<string>
  hiddenSupplierNames: Record<string, string>
  onShowSupplier?: (supplierId: string) => void
  onShowAllSuppliers?: () => void
}) {
  const hiddenList = Array.from(hiddenSuppliers)

  return (
    <div className={styles.hiddenPopover}>
      <Texto category="p2" weight="600" className="mb-2">
        Hidden Suppliers
      </Texto>
      {hiddenList.map((id) => (
        <Horizontal key={id} alignItems="center" style={{ gap: '8px' }} className="mb-1">
          <Checkbox checked={false} onChange={() => onShowSupplier?.(id)} />
          <Texto category="p2">{hiddenSupplierNames[id] || id}</Texto>
        </Horizontal>
      ))}
      <GraviButton
        type="link"
        buttonText="Show All"
        onClick={onShowAllSuppliers}
        style={{ padding: 0, marginTop: '8px' }}
      />
    </div>
  )
}

export function ComparisonToolbar({
  round,
  sortOrder,
  searchQuery,
  thresholds,
  hiddenSuppliers,
  hiddenSupplierNames = {},
  isManualMode = false,
  onSortChange,
  onSearchChange,
  onToggleManualMode,
  onShowSupplier,
  onShowAllSuppliers,
  onOpenThresholds,
  onAdvanceToNextRound,
  onAward,
  onEditBids,
  onOpenEliminationModal,
  selectedCount = 0,
  isViewingHistory = false,
}: ComparisonToolbarProps) {
  // Format threshold labels
  const penaltyLabel = `≤${thresholds.penaltyMax}¢/gal`
  const ratabilityLabel = `${thresholds.ratabilityMin}-${thresholds.ratabilityMax}%`
  const allocationLabel = ALLOCATION_OPTIONS.find((opt) => opt.value === thresholds.allocationMin)?.label || 'Flexible'

  // Handle edit bids click
  const handleEditBids = useCallback(() => {
    if (onEditBids) {
      onEditBids()
    } else {
      NotificationMessage('Coming Soon', 'Edit bids functionality will be available in a future release.', false)
    }
  }, [onEditBids])

  // Determine if actions should be disabled
  // Can eliminate: need at least 1 supplier selected
  const canEliminate = selectedCount >= 1
  // Can advance: need 2-3 suppliers selected to advance to next round
  const canAdvance = selectedCount >= 2 && selectedCount <= 3
  // Can award: need at least 1 supplier selected
  const canAward = selectedCount >= 1

  // Tooltip for advance button when disabled
  const advanceTooltip = !canAdvance
    ? selectedCount === 0
      ? 'Select 2-3 suppliers to advance to next round'
      : selectedCount === 1
        ? 'Select 1-2 more suppliers to advance'
        : 'Select up to 3 suppliers to advance'
    : undefined

  return (
    <Horizontal justifyContent="space-between" alignItems="center" className={styles.toolbar}>
      {/* Left section - Controls */}
      <Horizontal alignItems="center" style={{ gap: '12px' }}>
        {/* Sort dropdown */}
        <Select
          value={sortOrder}
          onChange={onSortChange}
          options={SORT_OPTIONS}
          style={{ width: 200 }}
          disabled={isViewingHistory}
        />

        {/* Manual reorder toggle */}
        {!isViewingHistory && (
          <GraviButton
            buttonText="Manual"
            icon={<SwapOutlined />}
            appearance={isManualMode ? 'theme1' : 'outlined'}
            onClick={onToggleManualMode}
          />
        )}

        {/* Search input */}
        <Input
          placeholder="Search suppliers..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />

        {/* Hidden suppliers badge */}
        {hiddenSuppliers.size > 0 && (
          <Popover
            content={
              <HiddenSuppliersPopover
                hiddenSuppliers={hiddenSuppliers}
                hiddenSupplierNames={hiddenSupplierNames}
                onShowSupplier={onShowSupplier}
                onShowAllSuppliers={onShowAllSuppliers}
              />
            }
            trigger="click"
            placement="bottomRight"
          >
            <span className={styles.hiddenBadge}>
              <EyeInvisibleOutlined />
              {hiddenSuppliers.size} hidden
            </span>
          </Popover>
        )}
      </Horizontal>

      {/* Right section - Actions & Thresholds */}
      <Horizontal alignItems="center" style={{ gap: '12px' }}>
        {/* Actions (only if not viewing history) */}
        {!isViewingHistory && (
          <>
            {round >= 2 && (
              <GraviButton buttonText='Edit Bids' appearance='outlined' onClick={handleEditBids} />
            )}

            {/* Eliminate button */}
            <Tooltip title={!canEliminate ? 'Select suppliers to eliminate' : undefined}>
              <span>
                <GraviButton
                  buttonText={`Eliminate (${selectedCount})`}
                  icon={<StopOutlined />}
                  appearance='warning'
                  onClick={onOpenEliminationModal}
                  disabled={!canEliminate}
                />
              </span>
            </Tooltip>

            {/* Advance button - available on all rounds */}
            <Tooltip title={advanceTooltip}>
              <span>
                <GraviButton
                  buttonText={`Advance to R${round + 1} (${selectedCount})`}
                  theme1
                  onClick={onAdvanceToNextRound}
                  disabled={!canAdvance}
                />
              </span>
            </Tooltip>

            <GraviButton buttonText='Award' success onClick={onAward} disabled={!canAward} />
          </>
        )}

        {/* Threshold pills */}
        <Horizontal alignItems="center" style={{ gap: '8px' }}>
          <ThresholdPill label={penaltyLabel} onClick={onOpenThresholds} />
          <ThresholdPill label={ratabilityLabel} onClick={onOpenThresholds} />
          <ThresholdPill label={allocationLabel} onClick={onOpenThresholds} />
        </Horizontal>

        {/* Parameters button */}
        <GraviButton
          type="text"
          icon={<SettingOutlined />}
          onClick={onOpenThresholds}
          style={{ padding: '4px 8px' }}
        />
      </Horizontal>
    </Horizontal>
  )
}
