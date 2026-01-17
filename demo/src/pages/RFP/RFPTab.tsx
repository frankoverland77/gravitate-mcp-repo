import { useState, useCallback } from 'react'
import { Vertical, Texto, GraviButton, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import { LeftOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Tabs, Alert } from 'antd'
import type {
  RFPScreen,
  RFP,
  ThresholdConfig,
  ParameterConfig,
  SortOption,
  DetailMetric,
  Supplier,
  EliminatedSupplierInfo,
} from './rfp.types'
import styles from './RFPTab.module.css'
import { DEFAULT_THRESHOLDS, DEFAULT_PARAMETERS } from './rfp.types'
import { ThresholdsModal } from './components/ThresholdsModal'
import { SAMPLE_SUPPLIERS, sortSuppliers, TERMINAL_HISTORY_DATA } from './rfp.data'
import {
  RFPListSection,
  RoundStepper,
  AIRecommendationsPanel,
  ComparisonToolbar,
  SupplierMatrixSection,
  DetailGridSection,
  AwardSection,
  SuccessSection,
  HistoricalRFPSection,
  EliminatedSuppliersSection,
} from './sections'
import { HISTORICAL_BID_DATA } from './rfp.data'

const { TabPane } = Tabs

// State management for RFP tab
interface RFPTabState {
  currentScreen: RFPScreen
  selectedRFP: RFP | null
  currentRound: number // Now supports any round number
  isViewingHistory: boolean
  selectedSuppliers: Set<string>
  hiddenSuppliers: Set<string>
  pinnedSuppliers: Set<string>
  sortOrder: SortOption
  searchQuery: string
  currentMetric: DetailMetric
  thresholds: ThresholdConfig
  parameters: ParameterConfig
  isThresholdsModalOpen: boolean
  winnerId: string | null
  isManualMode: boolean
  viewTab: 'comparison' | 'historical'
  // Multi-round support
  eliminatedSuppliers: Map<number, EliminatedSupplierInfo[]> // round -> eliminated suppliers
  activeSupplierIds: Set<string> // suppliers still in the running
}

const initialState: RFPTabState = {
  currentScreen: 'list',
  selectedRFP: null,
  currentRound: 1,
  isViewingHistory: false,
  selectedSuppliers: new Set(),
  hiddenSuppliers: new Set(),
  pinnedSuppliers: new Set(),
  sortOrder: 'recommended',
  searchQuery: '',
  currentMetric: 'price',
  thresholds: DEFAULT_THRESHOLDS,
  parameters: DEFAULT_PARAMETERS,
  isThresholdsModalOpen: false,
  winnerId: null,
  isManualMode: false,
  viewTab: 'comparison',
  // Multi-round support
  eliminatedSuppliers: new Map(),
  activeSupplierIds: new Set(SAMPLE_SUPPLIERS.map((s) => s.id)),
}

export function RFPTab() {
  const [state, setState] = useState<RFPTabState>(initialState)

  // Get sorted suppliers for current view (filtered by active suppliers)
  const getSortedSuppliers = useCallback((): Supplier[] => {
    // Filter to only active (non-eliminated) suppliers
    const activeSuppliers = SAMPLE_SUPPLIERS.filter((s) => state.activeSupplierIds.has(s.id))
    return sortSuppliers(activeSuppliers, state.sortOrder)
  }, [state.activeSupplierIds, state.sortOrder])

  // Get the winner supplier for award/success screens
  const getWinnerSupplier = useCallback((): Supplier | null => {
    if (state.winnerId) {
      return SAMPLE_SUPPLIERS.find((s) => s.id === state.winnerId) || null
    }
    // Fallback to first selected if no winner set
    const firstSelected = Array.from(state.selectedSuppliers)[0]
    if (firstSelected) {
      return SAMPLE_SUPPLIERS.find((s) => s.id === firstSelected) || null
    }
    return null
  }, [state.winnerId, state.selectedSuppliers])

  // Navigation: RFP List row click
  const handleRFPClick = useCallback((rfp: RFP) => {
    const round = rfp.status === 'round2' ? 2 : 1
    if (rfp.status === 'round1' || rfp.status === 'round2') {
      setState((prev) => ({
        ...prev,
        currentScreen: `round${round}` as RFPScreen,
        selectedRFP: rfp,
        currentRound: round,
        selectedSuppliers: new Set(),
        winnerId: null,
        hiddenSuppliers: new Set(),
        pinnedSuppliers: new Set(),
        sortOrder: 'recommended',
        searchQuery: '',
        isViewingHistory: false,
        // Reset eliminated tracking for fresh RFP view
        eliminatedSuppliers: new Map(),
        activeSupplierIds: new Set(SAMPLE_SUPPLIERS.map((s) => s.id)),
      }))
    }
  }, [])

  // Navigation: Back to list
  const handleBackToList = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'list',
      selectedRFP: null,
      isViewingHistory: false,
    }))
  }, [])

  // Selection handlers
  const handleToggleSelection = useCallback((supplierId: string) => {
    setState((prev) => {
      const newSelections = new Set(prev.selectedSuppliers)
      if (newSelections.has(supplierId)) {
        newSelections.delete(supplierId)
      } else {
        newSelections.add(supplierId)
      }
      return { ...prev, selectedSuppliers: newSelections }
    })
  }, [])

  // Hide/Pin handlers
  const handleToggleHide = useCallback((supplierId: string) => {
    setState((prev) => {
      const newHidden = new Set(prev.hiddenSuppliers)
      if (newHidden.has(supplierId)) {
        newHidden.delete(supplierId)
      } else {
        newHidden.add(supplierId)
      }
      return { ...prev, hiddenSuppliers: newHidden }
    })
  }, [])

  const handleTogglePin = useCallback((supplierId: string) => {
    setState((prev) => {
      const newPinned = new Set(prev.pinnedSuppliers)
      if (newPinned.has(supplierId)) {
        newPinned.delete(supplierId)
      } else {
        newPinned.add(supplierId)
      }
      return { ...prev, pinnedSuppliers: newPinned }
    })
  }, [])

  const handleShowSupplier = useCallback((supplierId: string) => {
    setState((prev) => {
      const newHidden = new Set(prev.hiddenSuppliers)
      newHidden.delete(supplierId)
      return { ...prev, hiddenSuppliers: newHidden }
    })
  }, [])

  const handleShowAllSuppliers = useCallback(() => {
    setState((prev) => ({ ...prev, hiddenSuppliers: new Set() }))
  }, [])

  // Sort/filter handlers
  const handleSortChange = useCallback((sortOrder: SortOption) => {
    setState((prev) => ({ ...prev, sortOrder, isManualMode: false }))
    NotificationMessage('Sorted', `Suppliers sorted by ${sortOrder.replace('-', ' ')}`, false)
  }, [])

  const handleSearchChange = useCallback((searchQuery: string) => {
    setState((prev) => ({ ...prev, searchQuery }))
  }, [])

  const handleMetricChange = useCallback((currentMetric: DetailMetric) => {
    setState((prev) => ({ ...prev, currentMetric }))
  }, [])

  const handleToggleManualMode = useCallback(() => {
    setState((prev) => ({ ...prev, isManualMode: !prev.isManualMode }))
  }, [])

  // Threshold handlers
  const handleOpenThresholds = useCallback(() => {
    setState((prev) => ({ ...prev, isThresholdsModalOpen: true }))
  }, [])

  const handleCloseThresholds = useCallback(() => {
    setState((prev) => ({ ...prev, isThresholdsModalOpen: false }))
  }, [])

  const handleSaveThresholds = useCallback((thresholds: ThresholdConfig, parameters: ParameterConfig) => {
    setState((prev) => ({ ...prev, thresholds, parameters, isThresholdsModalOpen: false }))
    NotificationMessage('Settings Saved', 'Parameters and thresholds updated successfully.', false)
  }, [])

  // Round progression handlers - now supports advancing to any round
  const handleAdvanceToNextRound = useCallback(() => {
    if (state.selectedSuppliers.size < 2 || state.selectedSuppliers.size > 3) {
      NotificationMessage(
        'Invalid Selection',
        `Please select 2-3 suppliers to advance to Round ${state.currentRound + 1}.`,
        true
      )
      return
    }

    // Get all current active suppliers and track eliminated ones
    const currentSuppliers = getSortedSuppliers()
    const eliminatedInThisRound: EliminatedSupplierInfo[] = currentSuppliers
      .filter((s) => !state.selectedSuppliers.has(s.id))
      .map((s) => ({
        supplierId: s.id,
        supplierName: s.name,
        eliminatedInRound: state.currentRound,
        priceAtElimination: s.metrics.avgPrice,
      }))

    // Create new active suppliers set (only selected ones)
    const newActiveSupplierIds = new Set(state.selectedSuppliers)

    // Update eliminated suppliers map
    const newEliminatedSuppliers = new Map(state.eliminatedSuppliers)
    newEliminatedSuppliers.set(state.currentRound, eliminatedInThisRound)

    const nextRound = state.currentRound + 1

    setState((prev) => ({
      ...prev,
      currentScreen: `round${nextRound}` as RFPScreen,
      currentRound: nextRound,
      selectedSuppliers: new Set(),
      winnerId: null,
      isViewingHistory: false,
      eliminatedSuppliers: newEliminatedSuppliers,
      activeSupplierIds: newActiveSupplierIds,
    }))
    NotificationMessage('Advanced', `Suppliers advanced to Round ${nextRound}!`, false)
  }, [state.selectedSuppliers, state.currentRound, getSortedSuppliers])

  const handleViewHistoricalRound = useCallback((round: number) => {
    setState((prev) => ({
      ...prev,
      currentScreen: `round${round}` as RFPScreen,
      isViewingHistory: true,
    }))
  }, [])

  const handleBackToCurrentRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: `round${prev.currentRound}` as RFPScreen,
      isViewingHistory: false,
    }))
  }, [])

  const handleAward = useCallback(() => {
    // Now all rounds use checkboxes - require at least 1 selection to award
    if (state.selectedSuppliers.size === 0) {
      NotificationMessage('No Selection', 'Please select a supplier to award.', true)
      return
    }
    // Set the winner to the first selected supplier if not already set
    const winnerToUse = state.winnerId || Array.from(state.selectedSuppliers)[0]
    setState((prev) => ({
      ...prev,
      currentScreen: 'award',
      isViewingHistory: false,
      winnerId: winnerToUse,
    }))
  }, [state.selectedSuppliers, state.winnerId])

  const handleGoToSuccess = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'success',
      isViewingHistory: false,
    }))
    NotificationMessage('Contract Created', 'Contract successfully created in Pricing Engine!', false)
  }, [])

  const handleViewContract = useCallback(() => {
    NotificationMessage('Opening Pricing Engine', 'Navigating to contract in Pricing Engine...', false)
    // In production, this would navigate to the Pricing Engine
  }, [])

  // Build hidden supplier names map
  const hiddenSupplierNames = SAMPLE_SUPPLIERS.reduce(
    (acc, s) => {
      acc[s.id] = s.name
      return acc
    },
    {} as Record<string, string>
  )

  // Build supplier counts for each round (for RoundStepper)
  const getRoundSupplierCounts = useCallback((): Map<number, number> => {
    const counts = new Map<number, number>()
    // Round 1 always has all suppliers
    counts.set(1, SAMPLE_SUPPLIERS.length)
    // Subsequent rounds: count based on who advanced
    let remaining = SAMPLE_SUPPLIERS.length
    for (let round = 1; round < state.currentRound; round++) {
      const eliminated = state.eliminatedSuppliers.get(round) || []
      remaining -= eliminated.length
      counts.set(round + 1, remaining)
    }
    return counts
  }, [state.currentRound, state.eliminatedSuppliers])

  // Render Round screen (shared between all rounds)
  const renderRoundScreen = () => {
    const suppliers = getSortedSuppliers()
    const roundSupplierCounts = getRoundSupplierCounts()

    return (
      <div className={styles.roundPage}>
        {/* Header - won't shrink */}
        <Horizontal alignItems="center" className={styles.pageHeader} style={{ gap: '12px' }}>
          <GraviButton type="text" icon={<LeftOutlined />} onClick={handleBackToList} style={{ padding: '4px 8px' }} />
          <Vertical>
            <Texto category="h3" weight="600">
              {state.selectedRFP?.name}
            </Texto>
            <Texto category="p2" appearance="medium">
              Round {state.currentRound} - {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}
            </Texto>
          </Vertical>
        </Horizontal>

        {/* Historical view banner */}
        {state.isViewingHistory && (
          <Alert
            className={styles.contentSection}
            message={`Viewing Round ${state.currentRound} (Completed) - This round is locked`}
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            action={
              <GraviButton type="link" buttonText="Back to Current Round" onClick={handleBackToCurrentRound} />
            }
          />
        )}

        {/* Round stepper */}
        <div className={styles.stepperWrapper}>
          <RoundStepper
            currentRound={state.currentRound}
            totalRounds={state.currentRound}
            roundSupplierCounts={roundSupplierCounts}
            isViewingHistory={state.isViewingHistory}
            onRoundClick={handleViewHistoricalRound}
          />
        </div>

        {/* Updated bids banner (Round 2+ only) */}
        {state.currentRound >= 2 && !state.isViewingHistory && (
          <Alert
            className={styles.contentSection}
            message={`Updated Bids Received - ${suppliers.length} finalist${suppliers.length !== 1 ? 's' : ''} in Round ${state.currentRound}`}
            type="success"
            showIcon
          />
        )}

        {/* AI Recommendations - full width */}
        <AIRecommendationsPanel />

        {/* View tabs - full width */}
        <div className={styles.contentSection}>
          <Tabs
            activeKey={state.viewTab}
            onChange={(key) => setState((prev) => ({ ...prev, viewTab: key as 'comparison' | 'historical' }))}
          >
            <TabPane tab="Comparison" key="comparison" />
            <TabPane tab="Historical" key="historical" />
          </Tabs>
        </div>

        {/* Conditionally render based on viewTab */}
        {state.viewTab === 'comparison' ? (
          <>
            {/* Comparison toolbar */}
            <ComparisonToolbar
              round={state.currentRound}
              sortOrder={state.sortOrder}
              searchQuery={state.searchQuery}
              thresholds={state.thresholds}
              hiddenSuppliers={state.hiddenSuppliers}
              hiddenSupplierNames={hiddenSupplierNames}
              isManualMode={state.isManualMode}
              selectedCount={state.selectedSuppliers.size}
              isViewingHistory={state.isViewingHistory}
              onSortChange={handleSortChange}
              onSearchChange={handleSearchChange}
              onToggleManualMode={handleToggleManualMode}
              onShowSupplier={handleShowSupplier}
              onShowAllSuppliers={handleShowAllSuppliers}
              onOpenThresholds={handleOpenThresholds}
              onAdvanceToNextRound={handleAdvanceToNextRound}
              onAward={handleAward}
            />

            {/* Supplier matrix - now uses checkboxes for all rounds */}
            <SupplierMatrixSection
              suppliers={suppliers}
              round={state.currentRound}
              selectedSuppliers={state.selectedSuppliers}
              hiddenSuppliers={state.hiddenSuppliers}
              pinnedSuppliers={state.pinnedSuppliers}
              searchQuery={state.searchQuery}
              currentMetric={state.currentMetric}
              isViewingHistory={state.isViewingHistory}
              onToggleSelection={handleToggleSelection}
              onToggleHide={handleToggleHide}
              onTogglePin={handleTogglePin}
              onMetricClick={handleMetricChange}
            />

            {/* Eliminated suppliers section (Round 2+) */}
            {state.currentRound >= 2 && (
              <EliminatedSuppliersSection
                eliminatedSuppliers={state.eliminatedSuppliers}
                allSuppliers={SAMPLE_SUPPLIERS}
                currentRound={state.currentRound}
              />
            )}

            {/* Detail grid */}
            <div className={styles.detailGridWrapper}>
              <DetailGridSection
                suppliers={suppliers}
                hiddenSuppliers={state.hiddenSuppliers}
                pinnedSuppliers={state.pinnedSuppliers}
                currentMetric={state.currentMetric}
                searchQuery={state.searchQuery}
                onMetricChange={handleMetricChange}
              />
            </div>
          </>
        ) : (
          <div style={{ flexShrink: 0 }}>
            <HistoricalRFPSection
              suppliers={suppliers}
              round={state.currentRound}
              historicalData={HISTORICAL_BID_DATA}
              terminalHistory={TERMINAL_HISTORY_DATA}
            />
          </div>
        )}
      </div>
    )
  }

  // Render current screen - handles dynamic round screens
  const renderScreen = () => {
    // Check if it's a round screen (round1, round2, round3, etc.)
    const isRoundScreen = state.currentScreen.startsWith('round')

    if (state.currentScreen === 'list') {
      return (
        <Vertical className="p-3">
          <RFPListSection onRFPClick={handleRFPClick} />
        </Vertical>
      )
    }

    if (isRoundScreen) {
      return renderRoundScreen()
    }

    if (state.currentScreen === 'award') {
      const winner = getWinnerSupplier()
      if (!state.selectedRFP || !winner) {
        return (
          <Vertical style={{ gap: '24px', padding: '24px' }}>
            <Texto>No RFP or winner selected.</Texto>
            <GraviButton buttonText="Back to List" onClick={handleBackToList} />
          </Vertical>
        )
      }
      return (
        <Vertical className="p-3">
          <AwardSection
            rfp={state.selectedRFP}
            winner={winner}
            onBack={() =>
              setState((prev) => ({ ...prev, currentScreen: `round${prev.currentRound}` as RFPScreen }))
            }
            onCreateContract={handleGoToSuccess}
          />
        </Vertical>
      )
    }

    if (state.currentScreen === 'success') {
      const winner = getWinnerSupplier()
      if (!state.selectedRFP || !winner) {
        return (
          <Vertical style={{ gap: '24px', padding: '24px' }}>
            <Texto>No RFP or winner selected.</Texto>
            <GraviButton buttonText="Back to List" onClick={handleBackToList} />
          </Vertical>
        )
      }
      return (
        <Vertical className="p-3">
          <SuccessSection
            rfp={state.selectedRFP}
            winner={winner}
            onViewContract={handleViewContract}
            onBackToList={handleBackToList}
          />
        </Vertical>
      )
    }

    return null
  }

  return (
    <div style={{ height: '100%' }}>
      {renderScreen()}
      <ThresholdsModal
        visible={state.isThresholdsModalOpen}
        thresholds={state.thresholds}
        parameters={state.parameters}
        onClose={handleCloseThresholds}
        onSave={handleSaveThresholds}
      />
    </div>
  )
}
