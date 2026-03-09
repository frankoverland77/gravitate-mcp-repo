import { useCallback } from 'react';
import {
  Horizontal,
  Vertical,
  Texto,
  GraviButton,
  NotificationMessage,
} from '@gravitate-js/excalibrr';
import {
  SearchOutlined,
  SettingOutlined,
  EyeInvisibleOutlined,
  StopOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { Select, Input, Popover, Checkbox, Tooltip } from 'antd';
import type { SortOption, ThresholdConfig } from '../rfp.types';
import { SORT_OPTIONS, ALLOCATION_PERIOD_OPTIONS } from '../rfp.types';
import styles from './ComparisonToolbar.module.css';

// Round completion status from parent
interface RoundCompletionStatus {
  advancingCount: number;
  eliminatedCount: number;
  pendingCount: number;
  canAdvance: boolean;
  activeCount: number;
}

// Historical outcome for completed rounds
interface HistoricalOutcome {
  advancedCount: number;
  eliminatedCount: number;
  nextRound: number;
}

interface ComparisonToolbarProps {
  round: number; // Now supports any round number
  sortOrder: SortOption;
  searchQuery: string;
  thresholds: ThresholdConfig;
  hiddenSuppliers: Set<string>;
  hiddenSupplierNames?: Record<string, string>;
  onSortChange: (sortOrder: SortOption) => void;
  onSearchChange: (query: string) => void;
  onShowSupplier?: (supplierId: string) => void;
  onShowAllSuppliers?: () => void;
  onOpenThresholds?: () => void;
  onAdvanceToNextRound?: () => void; // Generic handler for any round
  onAward?: () => void;
  onEditBids?: () => void;
  onOpenBidLog?: () => void; // Open bid log drawer
  bidEditCount?: number; // Number of active bid edits
  onOpenEliminationModal?: () => void; // Open elimination modal
  onMarkAdvancing?: () => void; // Mark selected as advancing
  onSelectPending?: () => void; // Select all pending suppliers
  selectedCount?: number;
  isViewingHistory?: boolean;
  // Disposition status
  roundCompletionStatus?: RoundCompletionStatus;
  // Historical view support
  viewingRound?: number; // Which round we're viewing (for history)
  historicalOutcome?: HistoricalOutcome; // Outcome of a completed round
  onViewCurrentRound?: () => void; // Navigate to current round
}

// Threshold pill component
function ThresholdPill({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <span className={styles.thresholdPill} onClick={onClick}>
      {label}
    </span>
  );
}

// Hidden suppliers popover content
function HiddenSuppliersPopover({
  hiddenSuppliers,
  hiddenSupplierNames,
  onShowSupplier,
  onShowAllSuppliers,
}: {
  hiddenSuppliers: Set<string>;
  hiddenSupplierNames: Record<string, string>;
  onShowSupplier?: (supplierId: string) => void;
  onShowAllSuppliers?: () => void;
}) {
  const hiddenList = Array.from(hiddenSuppliers);

  return (
    <div className={styles.hiddenPopover}>
      <Texto category="p2" weight="600" className="mb-2">
        Hidden Suppliers
      </Texto>
      {hiddenList.map((id) => (
        <Horizontal gap={8} key={id} alignItems="center" className="mb-1">
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
  );
}

export function ComparisonToolbar({
  round,
  sortOrder,
  searchQuery,
  thresholds,
  hiddenSuppliers,
  hiddenSupplierNames = {},
  onSortChange,
  onSearchChange,
  onShowSupplier,
  onShowAllSuppliers,
  onOpenThresholds,
  onAdvanceToNextRound,
  onAward,
  onEditBids,
  onOpenBidLog,
  bidEditCount = 0,
  onOpenEliminationModal,
  onMarkAdvancing,
  onSelectPending,
  selectedCount = 0,
  isViewingHistory = false,
  roundCompletionStatus,
  historicalOutcome,
  onViewCurrentRound,
}: ComparisonToolbarProps) {
  // Format threshold labels
  const penaltyLabel = `≤${thresholds.penaltyMax}¢/gal`;
  const ratabilityLabel = `${thresholds.ratabilityMin}-${thresholds.ratabilityMax}%`;
  const allocationLabel =
    ALLOCATION_PERIOD_OPTIONS.find((opt) => opt.value === thresholds.allocationMin)?.label ||
    'Monthly';

  // Handle edit bids click
  const handleEditBids = useCallback(() => {
    if (onEditBids) {
      onEditBids();
    } else {
      NotificationMessage(
        'Coming Soon',
        'Edit bids functionality will be available in a future release.',
        false
      );
    }
  }, [onEditBids]);

  // Determine if actions should be disabled based on disposition status
  const canEliminate = selectedCount >= 1;
  const canMarkAdvancing = selectedCount >= 1;
  const canAward = selectedCount >= 1;

  // For advancing, use disposition-based validation if available
  const canAdvanceRound = roundCompletionStatus?.canAdvance ?? false;

  // Tooltip for advance button when disabled
  const getAdvanceTooltip = () => {
    if (!roundCompletionStatus) return 'Loading...';
    const { pendingCount, advancingCount } = roundCompletionStatus;
    if (pendingCount > 0) {
      return `Set disposition for all ${pendingCount} pending supplier${pendingCount !== 1 ? 's' : ''} first`;
    }
    if (advancingCount < 2) {
      return 'Mark at least 2 suppliers as advancing';
    }
    return undefined;
  };

  const advanceTooltip = !canAdvanceRound ? getAdvanceTooltip() : undefined;

  return (
    <Vertical className={styles.toolbar}>
      {/* Row 1: Controls + Action buttons + Parameters */}
      <Horizontal justifyContent="space-between" alignItems="center">
        {/* Left: Sort, Manual, Search, Hidden */}
        <Horizontal gap={12} alignItems="center">
          <Select
            value={sortOrder}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            style={{ width: 200 }}
            disabled={isViewingHistory}
          />

          <Input
            placeholder="Search suppliers..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 180 }}
            allowClear
          />

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

        {/* Right: Action buttons + Parameters */}
        <Horizontal gap={12} alignItems="center">
          {!isViewingHistory && (
            <>
              {round >= 2 && (
                <GraviButton
                  buttonText="Edit Bids"
                  appearance="outlined"
                  onClick={handleEditBids}
                />
              )}

              <GraviButton
                buttonText={bidEditCount > 0 ? `Bid Log (${bidEditCount})` : 'Bid Log'}
                icon={<HistoryOutlined />}
                ghost
                onClick={onOpenBidLog}
              />

              {onSelectPending &&
                roundCompletionStatus &&
                roundCompletionStatus.pendingCount > 0 && (
                  <GraviButton
                    buttonText={`Select Remaining (${roundCompletionStatus.pendingCount})`}
                    icon={<CheckCircleOutlined />}
                    appearance="outlined"
                    onClick={onSelectPending}
                  />
                )}

              <Tooltip
                title={!canMarkAdvancing ? 'Select suppliers to mark as advancing' : undefined}
              >
                <span>
                  <GraviButton
                    buttonText={`Mark Advancing (${selectedCount})`}
                    icon={<CheckCircleOutlined />}
                    success
                    onClick={onMarkAdvancing}
                    disabled={!canMarkAdvancing}
                  />
                </span>
              </Tooltip>

              <Tooltip title={!canEliminate ? 'Select suppliers to eliminate' : undefined}>
                <span>
                  <GraviButton
                    buttonText={`Eliminate (${selectedCount})`}
                    icon={<StopOutlined />}
                    appearance="warning"
                    onClick={onOpenEliminationModal}
                    disabled={!canEliminate}
                  />
                </span>
              </Tooltip>

              <GraviButton buttonText="Award" success onClick={onAward} disabled={!canAward} />
            </>
          )}

          <GraviButton
            type="text"
            icon={<SettingOutlined />}
            onClick={onOpenThresholds}
            style={{ padding: '4px 8px' }}
          />
        </Horizontal>
      </Horizontal>

      {/* Row 2: Disposition counter + Advance on left, Threshold pills on right */}
      <Horizontal justifyContent="space-between" alignItems="center">
        {/* Left: Counter + Advance button (current) OR Historical summary + View button (history view) */}
        <Horizontal gap={12} alignItems="center">
          {isViewingHistory && historicalOutcome ? (
            <>
              <Texto category="p2" appearance="medium">
                Sent {historicalOutcome.advancedCount} to Round {historicalOutcome.nextRound} ·
                Eliminated {historicalOutcome.eliminatedCount}
              </Texto>
              <GraviButton
                buttonText={`View Round ${historicalOutcome.nextRound}`}
                appearance="outlined"
                onClick={onViewCurrentRound}
              />
            </>
          ) : roundCompletionStatus ? (
            <>
              <Texto category="p2" appearance="medium">
                {roundCompletionStatus.advancingCount} advancing ·{' '}
                {roundCompletionStatus.eliminatedCount} eliminated ·{' '}
                {roundCompletionStatus.pendingCount} pending
              </Texto>

              <Tooltip title={advanceTooltip}>
                <span>
                  <GraviButton
                    buttonText={`Advance to R${round + 1}`}
                    theme1
                    onClick={onAdvanceToNextRound}
                    disabled={!canAdvanceRound}
                  />
                </span>
              </Tooltip>
            </>
          ) : null}
        </Horizontal>

        {/* Right: Threshold pills only */}
        <Horizontal gap={8} alignItems="center">
          <ThresholdPill label={penaltyLabel} onClick={onOpenThresholds} />
          <ThresholdPill label={ratabilityLabel} onClick={onOpenThresholds} />
          <ThresholdPill label={allocationLabel} onClick={onOpenThresholds} />
        </Horizontal>
      </Horizontal>
    </Vertical>
  );
}
