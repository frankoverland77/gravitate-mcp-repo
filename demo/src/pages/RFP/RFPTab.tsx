import { useState, useCallback, useMemo } from 'react';
import {
  Vertical,
  Texto,
  GraviButton,
  Horizontal,
  NotificationMessage,
} from '@gravitate-js/excalibrr';
import {
  LeftOutlined,
  BulbOutlined,
  StarFilled,
  TrophyOutlined,
  DownOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  WarningFilled,
  CheckCircleFilled,
  RiseOutlined,
  DashboardOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { Tabs, Alert, Drawer, Dropdown, Menu, Progress, Tag } from 'antd';
import type {
  RFPScreen,
  RFP,
  ThresholdConfig,
  ParameterConfig,
  ImportanceRankingConfig,
  SortOption,
  DetailMetric,
  Supplier,
  EliminatedSupplierInfo,
  DetailRowExtended,
  BidEdit,
  BidChange,
} from './rfp.types';
import styles from './RFPTab.module.css';
import {
  DEFAULT_THRESHOLDS,
  DEFAULT_PARAMETERS,
  DEFAULT_IMPORTANCE_RANKING,
  PRODUCT_OPTIONS,
  LOCATION_OPTIONS,
} from './rfp.types';
import { ThresholdsModal, EliminationModal, EditBidsDrawer, BidLogDrawer } from './components';
import { SAMPLE_SUPPLIERS, sortSuppliers, TERMINAL_HISTORY_DATA, SAMPLE_DETAILS, SAMPLE_DETAILS_EXTENDED, AI_RECOMMENDATIONS, formatPrice, formatVolume, formatPenalties, formatRatability } from './rfp.data';
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
} from './sections';
import { HISTORICAL_BID_DATA } from './rfp.data';

// Supplier disposition type for round management
type SupplierDisposition = 'advance' | 'eliminate' | 'pending';

// State management for RFP tab
interface RFPTabState {
  currentScreen: RFPScreen;
  selectedRFP: RFP | null;
  currentRound: number; // Now supports any round number
  viewingRound: number; // Which round we're viewing (when in history mode)
  isViewingHistory: boolean;
  selectedSuppliers: Set<string>;
  hiddenSuppliers: Set<string>;
  pinnedSuppliers: Set<string>;
  sortOrder: SortOption;
  searchQuery: string;
  currentMetric: DetailMetric;
  thresholds: ThresholdConfig;
  parameters: ParameterConfig;
  importanceRanking: ImportanceRankingConfig;
  isThresholdsModalOpen: boolean;
  winnerId: string | null;
  viewTab: 'comparison' | 'historical';
  // Multi-round support
  eliminatedSuppliers: Map<number, EliminatedSupplierInfo[]>; // round -> eliminated suppliers
  activeSupplierIds: Set<string>; // suppliers still in the running
  // Disposition tracking for round completion
  supplierDispositions: Map<string, SupplierDisposition>; // supplierId -> disposition
  // Pending elimination reasons (stored until round advances)
  pendingEliminationReasons: Map<string, string>; // supplierId -> reason
  // Elimination modal
  isEliminationModalOpen: boolean;
  // Column reorder support
  supplierColumnOrder: string[] | null; // Custom column order (supplier IDs, excluding incumbent)
  // Detail grid filters (lifted from DetailGridSection for summary grid sync)
  selectedProducts: Set<string>;
  selectedLocations: Set<string>;
  // Edit bids drawer
  isEditBidsDrawerOpen: boolean;
  extendedDetails: DetailRowExtended[];
  // Bid edit history
  bidEdits: BidEdit[];
  isBidLogOpen: boolean;
  // Key Insights drawer
  isInsightsPanelOpen: boolean;
}

const initialState: RFPTabState = {
  currentScreen: 'list',
  selectedRFP: null,
  currentRound: 1,
  viewingRound: 1,
  isViewingHistory: false,
  selectedSuppliers: new Set(),
  hiddenSuppliers: new Set(),
  pinnedSuppliers: new Set(),
  sortOrder: 'recommended',
  searchQuery: '',
  currentMetric: 'price',
  thresholds: DEFAULT_THRESHOLDS,
  parameters: DEFAULT_PARAMETERS,
  importanceRanking: DEFAULT_IMPORTANCE_RANKING,
  isThresholdsModalOpen: false,
  winnerId: null,
  viewTab: 'comparison',
  // Multi-round support
  eliminatedSuppliers: new Map(),
  activeSupplierIds: new Set(SAMPLE_SUPPLIERS.map((s) => s.id)),
  // Disposition tracking - all active suppliers start as pending
  supplierDispositions: new Map(
    SAMPLE_SUPPLIERS.map((s) => [s.id, 'pending' as SupplierDisposition])
  ),
  // Pending elimination reasons
  pendingEliminationReasons: new Map(),
  // Elimination modal
  isEliminationModalOpen: false,
  // Column reorder support
  supplierColumnOrder: null,
  // Detail grid filters
  selectedProducts: new Set(PRODUCT_OPTIONS),
  selectedLocations: new Set(LOCATION_OPTIONS),
  // Edit bids drawer
  isEditBidsDrawerOpen: false,
  extendedDetails: SAMPLE_DETAILS_EXTENDED,
  // Bid edit history
  bidEdits: [],
  isBidLogOpen: false,
  // Key Insights drawer
  isInsightsPanelOpen: false,
};

export function RFPTab() {
  const [state, setState] = useState<RFPTabState>(initialState);

  // Get sorted suppliers for current view (filtered by active suppliers)
  // When viewing history, show suppliers that were present in that round
  const getSortedSuppliers = useCallback((): Supplier[] => {
    if (state.isViewingHistory) {
      // For historical view: show suppliers that were in that round (before elimination)
      // Start with all suppliers, then remove those eliminated before the viewing round
      const suppliersInRound = SAMPLE_SUPPLIERS.filter((s) => {
        // Check if supplier was eliminated before this round
        for (let round = 1; round < state.viewingRound; round++) {
          const eliminatedInRound = state.eliminatedSuppliers.get(round) || [];
          if (eliminatedInRound.some((e) => e.supplierId === s.id)) {
            return false; // Was eliminated before viewing round
          }
        }
        return true;
      });
      return sortSuppliers(suppliersInRound, state.sortOrder);
    }
    // For current view: only active (non-eliminated) suppliers
    const activeSuppliers = SAMPLE_SUPPLIERS.filter((s) => state.activeSupplierIds.has(s.id));
    return sortSuppliers(activeSuppliers, state.sortOrder);
  }, [
    state.activeSupplierIds,
    state.sortOrder,
    state.isViewingHistory,
    state.viewingRound,
    state.eliminatedSuppliers,
  ]);

  // Get the winner supplier for award/success screens
  const getWinnerSupplier = useCallback((): Supplier | null => {
    if (state.winnerId) {
      return SAMPLE_SUPPLIERS.find((s) => s.id === state.winnerId) || null;
    }
    // Fallback to first selected if no winner set
    const firstSelected = Array.from(state.selectedSuppliers)[0];
    if (firstSelected) {
      return SAMPLE_SUPPLIERS.find((s) => s.id === firstSelected) || null;
    }
    return null;
  }, [state.winnerId, state.selectedSuppliers]);

  // Navigation: RFP List row click
  const handleRFPClick = useCallback((rfp: RFP) => {
    const round = rfp.status === 'round2' ? 2 : 1;
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
        // Reset dispositions - all suppliers start as pending
        supplierDispositions: new Map(
          SAMPLE_SUPPLIERS.map((s) => [s.id, 'pending' as SupplierDisposition])
        ),
        // Reset pending elimination reasons
        pendingEliminationReasons: new Map(),
      }));
    }
  }, []);

  // Navigation: Back to list
  const handleBackToList = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'list',
      selectedRFP: null,
      isViewingHistory: false,
    }));
  }, []);

  // Selection handlers
  const handleToggleSelection = useCallback((supplierId: string) => {
    setState((prev) => {
      const newSelections = new Set(prev.selectedSuppliers);
      if (newSelections.has(supplierId)) {
        newSelections.delete(supplierId);
      } else {
        newSelections.add(supplierId);
      }
      return { ...prev, selectedSuppliers: newSelections };
    });
  }, []);

  // Select all pending suppliers
  const handleSelectPending = useCallback(() => {
    const pendingSupplierIds = new Set<string>();
    state.activeSupplierIds.forEach((id) => {
      if (state.supplierDispositions.get(id) === 'pending') {
        pendingSupplierIds.add(id);
      }
    });

    if (pendingSupplierIds.size === 0) {
      NotificationMessage('No Pending Suppliers', 'All suppliers have been designated.', false);
      return;
    }

    setState((prev) => ({
      ...prev,
      selectedSuppliers: pendingSupplierIds,
    }));
  }, [state.activeSupplierIds, state.supplierDispositions]);

  // Hide/Pin handlers
  const handleToggleHide = useCallback((supplierId: string) => {
    setState((prev) => {
      const newHidden = new Set(prev.hiddenSuppliers);
      if (newHidden.has(supplierId)) {
        newHidden.delete(supplierId);
      } else {
        newHidden.add(supplierId);
      }
      return { ...prev, hiddenSuppliers: newHidden };
    });
  }, []);

  const handleTogglePin = useCallback((supplierId: string) => {
    setState((prev) => {
      const newPinned = new Set(prev.pinnedSuppliers);
      if (newPinned.has(supplierId)) {
        newPinned.delete(supplierId);
      } else {
        newPinned.add(supplierId);
      }
      return { ...prev, pinnedSuppliers: newPinned };
    });
  }, []);

  const handleShowSupplier = useCallback((supplierId: string) => {
    setState((prev) => {
      const newHidden = new Set(prev.hiddenSuppliers);
      newHidden.delete(supplierId);
      return { ...prev, hiddenSuppliers: newHidden };
    });
  }, []);

  const handleShowAllSuppliers = useCallback(() => {
    setState((prev) => ({ ...prev, hiddenSuppliers: new Set() }));
  }, []);

  // Sort/filter handlers
  const handleSortChange = useCallback((sortOrder: SortOption) => {
    // Reset column order when sort changes
    setState((prev) => ({ ...prev, sortOrder, supplierColumnOrder: null }));
    NotificationMessage('Sorted', `Suppliers sorted by ${sortOrder.replace('-', ' ')}`, false);
  }, []);

  // Column reorder handler
  const handleSupplierColumnReorder = useCallback((newOrder: string[]) => {
    setState((prev) => ({ ...prev, supplierColumnOrder: newOrder }));
  }, []);

  const handleSearchChange = useCallback((searchQuery: string) => {
    setState((prev) => ({ ...prev, searchQuery }));
  }, []);

  const handleMetricChange = useCallback((currentMetric: DetailMetric, product?: string) => {
    setState((prev) => {
      // If a product is provided (clicking on child row), filter to only that product
      // If no product (clicking parent row), reset to show all products
      const newProducts = product ? new Set([product]) : new Set(PRODUCT_OPTIONS);
      return { ...prev, currentMetric, selectedProducts: newProducts };
    });
  }, []);

  // Product/location filter handlers (lifted from DetailGridSection)
  const handleToggleProduct = useCallback((product: string) => {
    setState((prev) => {
      const next = new Set(prev.selectedProducts);
      if (next.has(product)) {
        if (next.size > 1) next.delete(product);
      } else {
        next.add(product);
      }
      return { ...prev, selectedProducts: next };
    });
  }, []);

  const handleToggleLocation = useCallback((location: string) => {
    setState((prev) => {
      const next = new Set(prev.selectedLocations);
      if (next.has(location)) {
        if (next.size > 1) next.delete(location);
      } else {
        next.add(location);
      }
      return { ...prev, selectedLocations: next };
    });
  }, []);

  // Threshold handlers
  const handleOpenThresholds = useCallback(() => {
    setState((prev) => ({ ...prev, isThresholdsModalOpen: true }));
  }, []);

  const handleCloseThresholds = useCallback(() => {
    setState((prev) => ({ ...prev, isThresholdsModalOpen: false }));
  }, []);

  const handleSaveThresholds = useCallback(
    (
      thresholds: ThresholdConfig,
      parameters: ParameterConfig,
      importanceRanking: ImportanceRankingConfig
    ) => {
      setState((prev) => ({
        ...prev,
        thresholds,
        parameters,
        importanceRanking,
        isThresholdsModalOpen: false,
      }));
      NotificationMessage(
        'Settings Saved',
        'Parameters and thresholds updated successfully.',
        false
      );
    },
    []
  );

  // Elimination handlers
  const handleOpenEliminationModal = useCallback(() => {
    if (state.selectedSuppliers.size === 0) {
      NotificationMessage('No Selection', 'Please select suppliers to eliminate.', true);
      return;
    }
    setState((prev) => ({ ...prev, isEliminationModalOpen: true }));
  }, [state.selectedSuppliers.size]);

  const handleCloseEliminationModal = useCallback(() => {
    setState((prev) => ({ ...prev, isEliminationModalOpen: false }));
  }, []);

  const handleConfirmElimination = useCallback(
    (reason: string) => {
      // Store elimination reasons for when we finalize eliminations on round advance
      // For now, just mark the disposition as 'eliminate' - they stay visible in the table
      const newDispositions = new Map(state.supplierDispositions);
      const newPendingReasons = new Map(state.pendingEliminationReasons);

      state.selectedSuppliers.forEach((id) => {
        newDispositions.set(id, 'eliminate');
        newPendingReasons.set(id, reason);
      });

      const count = state.selectedSuppliers.size;

      setState((prev) => ({
        ...prev,
        supplierDispositions: newDispositions,
        pendingEliminationReasons: newPendingReasons,
        selectedSuppliers: new Set(),
        isEliminationModalOpen: false,
      }));

      NotificationMessage(
        'Marked for Elimination',
        `${count} supplier${count !== 1 ? 's' : ''} marked for elimination. Use "Undo" to restore before advancing.`,
        false
      );
    },
    [state.selectedSuppliers, state.supplierDispositions, state.pendingEliminationReasons]
  );

  // Get supplier names for elimination modal
  const getSelectedSupplierNames = useCallback((): string[] => {
    return Array.from(state.selectedSuppliers)
      .map((id) => SAMPLE_SUPPLIERS.find((s) => s.id === id)?.name || '')
      .filter(Boolean);
  }, [state.selectedSuppliers]);

  // Mark selected suppliers as advancing
  const handleMarkAdvancing = useCallback(() => {
    if (state.selectedSuppliers.size === 0) {
      NotificationMessage('No Selection', 'Please select suppliers to mark as advancing.', true);
      return;
    }

    setState((prev) => {
      const newDispositions = new Map(prev.supplierDispositions);
      prev.selectedSuppliers.forEach((id) => {
        newDispositions.set(id, 'advance');
      });
      return {
        ...prev,
        supplierDispositions: newDispositions,
        selectedSuppliers: new Set(), // Clear selection
      };
    });

    const count = state.selectedSuppliers.size;
    NotificationMessage(
      'Marked for Advancement',
      `${count} supplier${count !== 1 ? 's' : ''} marked to advance to next round.`,
      false
    );
  }, [state.selectedSuppliers]);

  // Undo elimination - restore supplier to pending status (within current round)
  const handleUndoElimination = useCallback((supplierId: string) => {
    setState((prev) => {
      const newDispositions = new Map(prev.supplierDispositions);
      newDispositions.set(supplierId, 'pending');

      // Remove from pending elimination reasons
      const newPendingReasons = new Map(prev.pendingEliminationReasons);
      newPendingReasons.delete(supplierId);

      return {
        ...prev,
        supplierDispositions: newDispositions,
        pendingEliminationReasons: newPendingReasons,
      };
    });
    NotificationMessage('Restored', 'Supplier restored to pending status.', false);
  }, []);

  // Restore supplier from previous round eliminations (between-round restore)
  const handleRestoreSupplier = useCallback(
    (supplierId: string, fromRound: number) => {
      setState((prev) => {
        // Remove from eliminatedSuppliers
        const newEliminatedSuppliers = new Map(prev.eliminatedSuppliers);
        const roundEliminated = newEliminatedSuppliers.get(fromRound) || [];
        newEliminatedSuppliers.set(
          fromRound,
          roundEliminated.filter((e) => e.supplierId !== supplierId)
        );

        // Add back to activeSupplierIds
        const newActiveSupplierIds = new Set(prev.activeSupplierIds);
        newActiveSupplierIds.add(supplierId);

        // Set disposition to pending
        const newDispositions = new Map(prev.supplierDispositions);
        newDispositions.set(supplierId, 'pending');

        return {
          ...prev,
          eliminatedSuppliers: newEliminatedSuppliers,
          activeSupplierIds: newActiveSupplierIds,
          supplierDispositions: newDispositions,
        };
      });
      NotificationMessage('Restored', `Supplier restored to Round ${state.currentRound}.`, false);
    },
    [state.currentRound]
  );

  // Round completion validation
  const getRoundCompletionStatus = useCallback(() => {
    const activeCount = state.activeSupplierIds.size;
    let advancingCount = 0;
    let eliminatedCount = 0;

    state.activeSupplierIds.forEach((id) => {
      const disposition = state.supplierDispositions.get(id);
      if (disposition === 'advance') advancingCount++;
      if (disposition === 'eliminate') eliminatedCount++;
    });

    const pendingCount = activeCount - advancingCount - eliminatedCount;
    const canAdvance = pendingCount === 0 && advancingCount >= 2;

    return { advancingCount, eliminatedCount, pendingCount, canAdvance, activeCount };
  }, [state.activeSupplierIds, state.supplierDispositions]);

  // Calculate historical outcome for a viewing round
  const getHistoricalOutcome = useCallback(() => {
    if (!state.isViewingHistory) return undefined;

    const eliminated = state.eliminatedSuppliers.get(state.viewingRound) || [];
    const eliminatedCount = eliminated.length;

    // Calculate suppliers that were in viewing round
    let suppliersInRound = SAMPLE_SUPPLIERS.length;
    for (let r = 1; r < state.viewingRound; r++) {
      suppliersInRound -= (state.eliminatedSuppliers.get(r) || []).length;
    }

    return {
      advancedCount: suppliersInRound - eliminatedCount,
      eliminatedCount,
      nextRound: state.viewingRound + 1,
    };
  }, [state.isViewingHistory, state.viewingRound, state.eliminatedSuppliers]);

  // Round progression handlers - now uses disposition-based validation
  const handleAdvanceToNextRound = useCallback(() => {
    const status = getRoundCompletionStatus();

    // Validate round completion
    if (status.pendingCount > 0) {
      NotificationMessage(
        'Round Not Complete',
        `You must eliminate or advance all ${status.pendingCount} remaining supplier${status.pendingCount !== 1 ? 's' : ''} to continue.`,
        true
      );
      return;
    }

    if (status.advancingCount < 2) {
      NotificationMessage(
        'Not Enough Suppliers',
        `Mark at least 2 suppliers as advancing to continue.`,
        true
      );
      return;
    }

    // Get suppliers marked for advancement
    const advancingSupplierIds = new Set<string>();
    state.activeSupplierIds.forEach((id) => {
      if (state.supplierDispositions.get(id) === 'advance') {
        advancingSupplierIds.add(id);
      }
    });

    // NOW finalize eliminations - get all suppliers marked as 'eliminate' and add to eliminated map
    const eliminatedThisRound: EliminatedSupplierInfo[] = [];
    state.activeSupplierIds.forEach((id) => {
      if (state.supplierDispositions.get(id) === 'eliminate') {
        const supplier = SAMPLE_SUPPLIERS.find((s) => s.id === id);
        if (supplier) {
          eliminatedThisRound.push({
            supplierId: id,
            supplierName: supplier.name,
            eliminatedInRound: state.currentRound,
            priceAtElimination: supplier.metrics.avgPrice,
            reason: state.pendingEliminationReasons.get(id) || 'Eliminated in round',
          });
        }
      }
    });

    // Update eliminated suppliers map
    const newEliminatedSuppliers = new Map(state.eliminatedSuppliers);
    const existingEliminated = newEliminatedSuppliers.get(state.currentRound) || [];
    newEliminatedSuppliers.set(state.currentRound, [...existingEliminated, ...eliminatedThisRound]);

    const nextRound = state.currentRound + 1;

    // Reset dispositions for advancing suppliers (all start as pending in new round)
    const newDispositions = new Map<string, SupplierDisposition>();
    advancingSupplierIds.forEach((id) => {
      newDispositions.set(id, 'pending');
    });

    setState((prev) => ({
      ...prev,
      currentScreen: `round${nextRound}` as RFPScreen,
      currentRound: nextRound,
      selectedSuppliers: new Set(),
      winnerId: null,
      isViewingHistory: false,
      eliminatedSuppliers: newEliminatedSuppliers,
      activeSupplierIds: advancingSupplierIds,
      supplierDispositions: newDispositions,
      pendingEliminationReasons: new Map(), // Clear pending reasons after finalization
    }));
    NotificationMessage(
      'Advanced',
      `${advancingSupplierIds.size} suppliers advanced to Round ${nextRound}!`,
      false
    );
  }, [
    state.activeSupplierIds,
    state.supplierDispositions,
    state.currentRound,
    state.eliminatedSuppliers,
    state.pendingEliminationReasons,
    getRoundCompletionStatus,
  ]);

  const handleViewHistoricalRound = useCallback((round: number) => {
    setState((prev) => ({
      ...prev,
      currentScreen: `round${round}` as RFPScreen,
      viewingRound: round,
      isViewingHistory: true,
    }));
  }, []);

  const handleBackToCurrentRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: `round${prev.currentRound}` as RFPScreen,
      viewingRound: prev.currentRound,
      isViewingHistory: false,
    }));
  }, []);

  // Handler for round stepper clicks - routes to current or historical view
  const handleRoundStepperClick = useCallback((round: number) => {
    setState((prev) => {
      // If clicking current round while viewing history, go back to current round view
      if (round === prev.currentRound) {
        return {
          ...prev,
          currentScreen: `round${round}` as RFPScreen,
          viewingRound: round,
          isViewingHistory: false,
        };
      }
      // Otherwise, view historical round
      return {
        ...prev,
        currentScreen: `round${round}` as RFPScreen,
        viewingRound: round,
        isViewingHistory: true,
      };
    });
  }, []);

  const handleAward = useCallback(() => {
    // Now all rounds use checkboxes - require at least 1 selection to award
    if (state.selectedSuppliers.size === 0) {
      NotificationMessage('No Selection', 'Please select a supplier to award.', true);
      return;
    }
    // Set the winner to the first selected supplier if not already set
    const winnerToUse = state.winnerId || Array.from(state.selectedSuppliers)[0];
    setState((prev) => ({
      ...prev,
      currentScreen: 'award',
      isViewingHistory: false,
      winnerId: winnerToUse,
    }));
  }, [state.selectedSuppliers, state.winnerId]);

  const handleGoToSuccess = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'success',
      isViewingHistory: false,
    }));
    NotificationMessage(
      'Contract Created',
      'Contract successfully created in Pricing Engine!',
      false
    );
  }, []);

  const handleViewContract = useCallback(() => {
    NotificationMessage(
      'Opening Pricing Engine',
      'Navigating to contract in Pricing Engine...',
      false
    );
    // In production, this would navigate to the Pricing Engine
  }, []);

  // Edit Bids drawer handlers
  const handleOpenEditBids = useCallback(() => {
    setState((prev) => ({ ...prev, isEditBidsDrawerOpen: true }));
  }, []);

  const handleCloseEditBids = useCallback(() => {
    setState((prev) => ({ ...prev, isEditBidsDrawerOpen: false }));
  }, []);

  const handleSaveEditedBids = useCallback(
    (updatedDetails: DetailRowExtended[], changes: BidChange[]) => {
      // Generate unique bulk upload ID for grouping
      const bulkUploadId = `upload-${Date.now()}`;
      const timestamp = new Date();

      // Convert BidChange[] to BidEdit[]
      const newBidEdits: BidEdit[] = changes
        .filter((change) => change.changeType === 'price')
        .map((change) => ({
          id: `edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          cellKey: `${change.product}-${change.location}-${change.supplierId}`,
          productName: change.product,
          locationName: change.location,
          supplierId: change.supplierId,
          supplierName: change.supplierName,
          previousValue: change.oldValue as number,
          newValue: change.newValue as number,
          timestamp,
          userId: 'current-user',
          userName: 'Jane Smith',
          source: 'bulk-upload',
          bulkUploadId,
          bulkUploadFilename: 'Simulated Upload',
          isReverted: false,
        }));

      setState((prev) => ({
        ...prev,
        extendedDetails: updatedDetails,
        bidEdits: [...newBidEdits, ...prev.bidEdits],
        isEditBidsDrawerOpen: false,
      }));

      NotificationMessage(
        'Bids Updated',
        `${newBidEdits.length} bid changes applied and logged.`,
        false
      );
    },
    []
  );

  // Bid Log drawer handlers
  const handleOpenBidLog = useCallback(() => {
    setState((prev) => ({ ...prev, isBidLogOpen: true }));
  }, []);

  const handleCloseBidLog = useCallback(() => {
    setState((prev) => ({ ...prev, isBidLogOpen: false }));
  }, []);

  // Key Insights panel handlers
  const handleOpenInsightsPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isInsightsPanelOpen: true }));
  }, []);

  const handleCloseInsightsPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isInsightsPanelOpen: false }));
  }, []);

  // Derived: Set of edited cell keys for visual indicator
  const editedCellKeys = useMemo(() => {
    return new Set(
      state.bidEdits.filter((e) => !e.isReverted).map((e) => e.cellKey)
    );
  }, [state.bidEdits]);

  // Active edit count for Bid Log button badge
  const activeEditCount = useMemo(() => {
    return state.bidEdits.filter((e) => !e.isReverted).length;
  }, [state.bidEdits]);

  // Handle inline cell edit
  const handleCellEdit = useCallback(
    (
      cellKey: string,
      oldValue: number,
      newValue: number,
      product: string,
      location: string,
      supplierId: string,
      supplierName: string
    ) => {
      const edit: BidEdit = {
        id: `edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        cellKey,
        productName: product,
        locationName: location,
        supplierId,
        supplierName,
        previousValue: oldValue,
        newValue,
        timestamp: new Date(),
        userId: 'current-user',
        userName: 'Jane Smith', // Mock for demo
        source: 'inline',
        isReverted: false,
      };

      setState((prev) => {
        // Update bid edits (newest first)
        const newBidEdits = [edit, ...prev.bidEdits];

        // Update the actual SAMPLE_DETAILS data
        // Note: In production this would update the extendedDetails
        // For the prototype, we update SAMPLE_DETAILS directly via reference

        return { ...prev, bidEdits: newBidEdits };
      });

      NotificationMessage('Bid Updated', `Price updated to $${newValue.toFixed(4)}`, false);
    },
    []
  );

  // Handle revert - reverts all edits on the same cell up to the specified edit
  const handleRevert = useCallback((editId: string) => {
    setState((prev) => {
      const editIndex = prev.bidEdits.findIndex((e) => e.id === editId);
      if (editIndex === -1) return prev;

      const edit = prev.bidEdits[editIndex];

      // Mark all edits on this cell from this one forward as reverted
      const updatedEdits = prev.bidEdits.map((e, idx) => {
        if (e.cellKey === edit.cellKey && idx <= editIndex && !e.isReverted) {
          return { ...e, isReverted: true, revertedAt: new Date(), revertedBy: 'Jane Smith' };
        }
        return e;
      });

      return { ...prev, bidEdits: updatedEdits };
    });

    NotificationMessage('Reverted', 'Bid change has been reverted.', false);
  }, []);

  // Build hidden supplier names map
  const hiddenSupplierNames = SAMPLE_SUPPLIERS.reduce(
    (acc, s) => {
      acc[s.id] = s.name;
      return acc;
    },
    {} as Record<string, string>
  );

  // Build supplier counts for each round (for RoundStepper)
  const getRoundSupplierCounts = useCallback((): Map<number, number> => {
    const counts = new Map<number, number>();
    // Round 1 always has all suppliers
    counts.set(1, SAMPLE_SUPPLIERS.length);
    // Subsequent rounds: count based on who advanced
    let remaining = SAMPLE_SUPPLIERS.length;
    for (let round = 1; round < state.currentRound; round++) {
      const eliminated = state.eliminatedSuppliers.get(round) || [];
      remaining -= eliminated.length;
      counts.set(round + 1, remaining);
    }
    return counts;
  }, [state.currentRound, state.eliminatedSuppliers]);

  // Render Round screen (shared between all rounds)
  const renderRoundScreen = () => {
    const suppliers = getSortedSuppliers();
    const roundSupplierCounts = getRoundSupplierCounts();
    // Use viewingRound when in history mode, otherwise currentRound
    const displayRound = state.isViewingHistory ? state.viewingRound : state.currentRound;

    return (
      <div className={styles.roundPage}>
        {/* Header - won't shrink */}
        <Horizontal alignItems="center" justifyContent="space-between" className={styles.pageHeader}>
          <Horizontal gap={12} alignItems="center">
            <GraviButton
              type="text"
              icon={<LeftOutlined />}
              onClick={handleBackToList}
              style={{ padding: '4px 8px' }}
            />
            <Vertical>
              <Texto category="h3" weight="600">
                {state.selectedRFP?.name}
              </Texto>
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) => handleViewHistoricalRound(Number(key))}
                    items={Array.from({ length: state.currentRound }, (_, i) => ({
                      key: i + 1,
                      label: `Round ${i + 1}`,
                      disabled: i + 1 === displayRound,
                    }))}
                  />
                }
                trigger={['click']}
              >
                <span style={{ cursor: 'pointer' }}>
                  <Horizontal gap={4} alignItems="center">
                    <Texto category="p2" appearance="medium">
                      Round {displayRound} - {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}
                      {state.isViewingHistory && ' (Read-Only)'}
                    </Texto>
                    <DownOutlined style={{ fontSize: '10px', color: 'var(--theme-color-2)' }} />
                  </Horizontal>
                </span>
              </Dropdown>
            </Vertical>
          </Horizontal>
          <GraviButton
            buttonText="Key Insights"
            icon={<BulbOutlined />}
            onClick={handleOpenInsightsPanel}
            style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', color: '#fff' }}
          />
        </Horizontal>

        {/* Round stepper */}
        <div className={styles.stepperWrapper}>
          <RoundStepper
            currentRound={state.currentRound}
            totalRounds={state.currentRound}
            roundSupplierCounts={roundSupplierCounts}
            isViewingHistory={state.isViewingHistory}
            viewingRound={state.viewingRound}
            onRoundClick={handleRoundStepperClick}
          />
        </div>

        {/* Historical view banner - styled like success banner */}
        {state.isViewingHistory && (
          <Alert
            className={styles.contentSection}
            message={
              <Horizontal gap={8} alignItems="center">
                <GraviButton
                  type="link"
                  buttonText={`Go to Round ${state.currentRound}`}
                  onClick={handleBackToCurrentRound}
                  style={{ padding: 0 }}
                />
                <Texto category="p2">
                  Round {state.viewingRound} is completed. This round is locked.
                </Texto>
              </Horizontal>
            }
            type="info"
            showIcon
          />
        )}

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
            onChange={(key) =>
              setState((prev) => ({ ...prev, viewTab: key as 'comparison' | 'historical' }))
            }
            items={[
              { key: 'comparison', label: 'Comparison' },
              { key: 'historical', label: 'Historical' },
            ]}
          />
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
              selectedCount={state.selectedSuppliers.size}
              isViewingHistory={state.isViewingHistory}
              roundCompletionStatus={getRoundCompletionStatus()}
              historicalOutcome={getHistoricalOutcome()}
              onViewCurrentRound={handleBackToCurrentRound}
              onSortChange={handleSortChange}
              onSearchChange={handleSearchChange}
              onShowSupplier={handleShowSupplier}
              onShowAllSuppliers={handleShowAllSuppliers}
              onOpenThresholds={handleOpenThresholds}
              onAdvanceToNextRound={handleAdvanceToNextRound}
              onAward={handleAward}
              onEditBids={handleOpenEditBids}
              onOpenBidLog={handleOpenBidLog}
              bidEditCount={activeEditCount}
              onOpenEliminationModal={handleOpenEliminationModal}
              onMarkAdvancing={handleMarkAdvancing}
              onSelectPending={handleSelectPending}
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
              detailData={SAMPLE_DETAILS}
              columnOrder={state.supplierColumnOrder ?? undefined}
              supplierDispositions={state.supplierDispositions}
              onToggleSelection={handleToggleSelection}
              onToggleHide={handleToggleHide}
              onTogglePin={handleTogglePin}
              onMetricClick={handleMetricChange}
              onColumnReorder={handleSupplierColumnReorder}
              onUndoElimination={handleUndoElimination}
            />

            {/* Eliminated suppliers section (Round 2+) */}
            {state.currentRound >= 2 && (
              <EliminatedSuppliersSection
                eliminatedSuppliers={state.eliminatedSuppliers}
                allSuppliers={SAMPLE_SUPPLIERS}
                currentRound={state.currentRound}
                onRestoreSupplier={handleRestoreSupplier}
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
                selectedProducts={state.selectedProducts}
                selectedLocations={state.selectedLocations}
                editedCellKeys={editedCellKeys}
                onMetricChange={handleMetricChange}
                onToggleProduct={handleToggleProduct}
                onToggleLocation={handleToggleLocation}
                onCellEdit={handleCellEdit}
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
    );
  };

  // Render current screen - handles dynamic round screens
  const renderScreen = () => {
    // Check if it's a round screen (round1, round2, round3, etc.)
    const isRoundScreen = state.currentScreen.startsWith('round');

    if (state.currentScreen === 'list') {
      return (
        <Vertical className="p-3">
          <RFPListSection onRFPClick={handleRFPClick} />
        </Vertical>
      );
    }

    if (isRoundScreen) {
      return renderRoundScreen();
    }

    if (state.currentScreen === 'award') {
      const winner = getWinnerSupplier();
      if (!state.selectedRFP || !winner) {
        return (
          <Vertical gap={24} style={{ padding: '24px' }}>
            <Texto>No RFP or winner selected.</Texto>
            <GraviButton buttonText="Back to List" onClick={handleBackToList} />
          </Vertical>
        );
      }
      return (
        <Vertical className="p-3">
          <AwardSection
            rfp={state.selectedRFP}
            winner={winner}
            onBack={() =>
              setState((prev) => ({
                ...prev,
                currentScreen: `round${prev.currentRound}` as RFPScreen,
              }))
            }
            onCreateContract={handleGoToSuccess}
          />
        </Vertical>
      );
    }

    if (state.currentScreen === 'success') {
      const winner = getWinnerSupplier();
      if (!state.selectedRFP || !winner) {
        return (
          <Vertical gap={24} style={{ padding: '24px' }}>
            <Texto>No RFP or winner selected.</Texto>
            <GraviButton buttonText="Back to List" onClick={handleBackToList} />
          </Vertical>
        );
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
      );
    }

    return null;
  };

  return (
    <div style={{ height: '100%' }}>
      {renderScreen()}
      <ThresholdsModal
        open={state.isThresholdsModalOpen}
        thresholds={state.thresholds}
        parameters={state.parameters}
        importanceRanking={state.importanceRanking}
        onClose={handleCloseThresholds}
        onSave={handleSaveThresholds}
      />
      <EliminationModal
        open={state.isEliminationModalOpen}
        supplierNames={getSelectedSupplierNames()}
        onConfirm={handleConfirmElimination}
        onCancel={handleCloseEliminationModal}
      />
      <EditBidsDrawer
        open={state.isEditBidsDrawerOpen}
        onClose={handleCloseEditBids}
        rfp={state.selectedRFP}
        round={state.currentRound}
        suppliers={getSortedSuppliers()}
        details={state.extendedDetails}
        onSave={handleSaveEditedBids}
      />
      <BidLogDrawer
        open={state.isBidLogOpen}
        onClose={handleCloseBidLog}
        bidEdits={state.bidEdits}
        onRevert={handleRevert}
      />
      <Drawer
        title={
          <Horizontal gap={8} alignItems="center">
            <BulbOutlined style={{ color: '#722ed1' }} />
            <span>Key Insights</span>
            <Tag color="purple" style={{ marginLeft: 'auto', fontSize: '10px' }}>AI-POWERED</Tag>
          </Horizontal>
        }
        placement="right"
        width={460}
        open={state.isInsightsPanelOpen}
        onClose={handleCloseInsightsPanel}
        mask={false}
      >
        <Vertical gap={20} height="auto">
          {/* Top Recommendation - hero card */}
          <div style={{
            background: 'linear-gradient(135deg, #722ed1 0%, #1890ff 100%)',
            borderRadius: '12px',
            padding: '20px',
            color: '#fff',
          }}>
            <Horizontal gap={8} alignItems="center" style={{ marginBottom: '12px' }}>
              <StarFilled style={{ color: '#ffd666', fontSize: '18px' }} />
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85 }}>
                Top Recommendation
              </span>
            </Horizontal>
            <Texto category="h3" weight="600" style={{ color: '#fff', marginBottom: '4px' }}>
              {AI_RECOMMENDATIONS[0]?.supplierName}
            </Texto>
            <Texto category="h4" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>
              {AI_RECOMMENDATIONS[0]?.price}
            </Texto>
            <Horizontal gap={6} style={{ flexWrap: 'wrap' }}>
              {AI_RECOMMENDATIONS[0]?.tags.map((tag) => (
                <Tag key={tag} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '12px', fontSize: '11px' }}>
                  {tag}
                </Tag>
              ))}
            </Horizontal>
          </div>

          {/* Quick Stats Row */}
          <Horizontal gap={12}>
            {[
              { label: 'Avg Spread', value: '$0.07', icon: <RiseOutlined />, color: '#52c41a', bg: '#f6ffed' },
              { label: 'Total Vol.', value: formatVolume(SAMPLE_SUPPLIERS.reduce((sum, s) => sum + s.metrics.totalVolume, 0)), icon: <BarChartOutlined />, color: '#1890ff', bg: '#e6f7ff' },
              { label: 'Compliance', value: `${Math.round((SAMPLE_SUPPLIERS.filter(s => s.metrics.issues === 0).length / SAMPLE_SUPPLIERS.length) * 100)}%`, icon: <SafetyCertificateOutlined />, color: '#722ed1', bg: '#f9f0ff' },
            ].map((stat) => (
              <div key={stat.label} style={{
                flex: 1,
                backgroundColor: stat.bg,
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}>
                <div style={{ color: stat.color, fontSize: '18px', marginBottom: '4px' }}>{stat.icon}</div>
                <Texto category="h5" weight="600">{stat.value}</Texto>
                <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>{stat.label}</Texto>
              </div>
            ))}
          </Horizontal>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #f0f0f0' }} />

          {/* Supplier Rankings */}
          <Vertical gap={12}>
            <Horizontal gap={8} alignItems="center">
              <TrophyOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
              <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Supplier Rankings
              </Texto>
            </Horizontal>
            <Vertical gap={8}>
              {SAMPLE_SUPPLIERS.slice().sort((a, b) => a.rank - b.rank).slice(0, 5).map((supplier) => {
                const isTop = supplier.rank === 1;
                return (
                  <div key={supplier.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    backgroundColor: isTop ? '#fffbe6' : '#fafafa',
                    borderRadius: '8px',
                    border: isTop ? '1px solid #ffe58f' : '1px solid #f0f0f0',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isTop ? '#faad14' : '#e8e8e8',
                      color: isTop ? '#fff' : '#595959',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {supplier.rank}
                    </div>
                    <Vertical gap={2} style={{ flex: 1, minWidth: 0 }}>
                      <Horizontal gap={6} alignItems="center">
                        <Texto weight="600" style={{ fontSize: '13px' }}>{supplier.name}</Texto>
                        {supplier.isIncumbent && <Tag color="blue" style={{ fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>INC</Tag>}
                      </Horizontal>
                      <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
                        Score: {supplier.score}/100
                      </Texto>
                    </Vertical>
                    <Vertical gap={2} style={{ textAlign: 'right', flexShrink: 0 }}>
                      <Texto weight="600" style={{ fontSize: '13px' }}>{formatPrice(supplier.metrics.avgPrice)}</Texto>
                      <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
                        {supplier.metrics.issues === 0 ? (
                          <span style={{ color: '#52c41a' }}><CheckCircleFilled /> Clear</span>
                        ) : (
                          <span style={{ color: '#faad14' }}><WarningFilled /> {supplier.metrics.issues} issue{supplier.metrics.issues !== 1 ? 's' : ''}</span>
                        )}
                      </Texto>
                    </Vertical>
                  </div>
                );
              })}
            </Vertical>
          </Vertical>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #f0f0f0' }} />

          {/* Volume Analysis */}
          <Vertical gap={12}>
            <Horizontal gap={8} alignItems="center">
              <BarChartOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
              <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Volume Capacity
              </Texto>
            </Horizontal>
            <Vertical gap={10}>
              {SAMPLE_SUPPLIERS.slice().sort((a, b) => b.metrics.totalVolume - a.metrics.totalVolume).slice(0, 4).map((supplier) => {
                const maxVol = Math.max(...SAMPLE_SUPPLIERS.map(s => s.metrics.totalVolume));
                const pct = Math.round((supplier.metrics.totalVolume / maxVol) * 100);
                return (
                  <Vertical key={supplier.id} gap={4}>
                    <Horizontal justifyContent="space-between">
                      <Texto category="p2" weight="500">{supplier.name}</Texto>
                      <Texto category="p2" appearance="medium">{formatVolume(supplier.metrics.totalVolume)}</Texto>
                    </Horizontal>
                    <Progress
                      percent={pct}
                      showInfo={false}
                      strokeColor={pct > 80 ? '#52c41a' : pct > 50 ? '#1890ff' : '#faad14'}
                      size="small"
                    />
                  </Vertical>
                );
              })}
            </Vertical>
          </Vertical>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #f0f0f0' }} />

          {/* Ratability Constraints */}
          <Vertical gap={12}>
            <Horizontal gap={8} alignItems="center">
              <DashboardOutlined style={{ color: '#13c2c2', fontSize: '16px' }} />
              <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Ratability Constraints
              </Texto>
            </Horizontal>
            <Vertical gap={8}>
              {SAMPLE_SUPPLIERS.slice().sort((a, b) => a.rank - b.rank).slice(0, 5).map((supplier) => (
                <Horizontal key={supplier.id} justifyContent="space-between" alignItems="center" style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: supplier.metrics.ratabilityStatus === 'fail' ? '#fff2f0' : '#f6ffed',
                  border: `1px solid ${supplier.metrics.ratabilityStatus === 'fail' ? '#ffccc7' : '#d9f7be'}`,
                }}>
                  <Horizontal gap={8} alignItems="center">
                    {supplier.metrics.ratabilityStatus === 'pass' ? (
                      <CheckCircleFilled style={{ color: '#52c41a' }} />
                    ) : (
                      <WarningFilled style={{ color: '#ff4d4f' }} />
                    )}
                    <Texto category="p2" weight="500">{supplier.name}</Texto>
                  </Horizontal>
                  <Texto category="p2" weight="600">{formatRatability(supplier.metrics.ratability)}</Texto>
                </Horizontal>
              ))}
            </Vertical>
          </Vertical>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #f0f0f0' }} />

          {/* Penalty Simulation */}
          <Vertical gap={12}>
            <Horizontal gap={8} alignItems="center">
              <FireOutlined style={{ color: '#fa541c', fontSize: '16px' }} />
              <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Penalty Risk Simulation
              </Texto>
              <Tag color="orange" style={{ fontSize: '9px', lineHeight: '16px', padding: '0 4px', marginLeft: 'auto' }}>SIMULATED</Tag>
            </Horizontal>
            <Texto category="p2" appearance="medium" style={{ fontSize: '12px', lineHeight: '18px' }}>
              Projected annual penalty exposure based on current terms and historical shortfall patterns.
            </Texto>
            <Vertical gap={8}>
              {SAMPLE_SUPPLIERS.slice().sort((a, b) => a.rank - b.rank).slice(0, 5).map((supplier) => {
                const annualPenalty = supplier.metrics.penalties * supplier.metrics.totalVolume * 0.05;
                const maxPenalty = Math.max(...SAMPLE_SUPPLIERS.map(s => s.metrics.penalties * s.metrics.totalVolume * 0.05));
                const riskLevel = annualPenalty < maxPenalty * 0.3 ? 'low' : annualPenalty < maxPenalty * 0.65 ? 'medium' : 'high';
                const riskColors = { low: { text: '#52c41a', bg: '#f6ffed' }, medium: { text: '#faad14', bg: '#fffbe6' }, high: { text: '#ff4d4f', bg: '#fff2f0' } };

                return (
                  <div key={supplier.id} style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: riskColors[riskLevel].bg,
                    border: '1px solid #f0f0f0',
                  }}>
                    <Horizontal justifyContent="space-between" alignItems="center" style={{ marginBottom: '6px' }}>
                      <Horizontal gap={8} alignItems="center">
                        <Texto category="p2" weight="600">{supplier.name}</Texto>
                        <Tag
                          color={riskLevel === 'low' ? 'success' : riskLevel === 'medium' ? 'warning' : 'error'}
                          style={{ fontSize: '9px', lineHeight: '16px', padding: '0 4px', textTransform: 'uppercase' }}
                        >
                          {riskLevel} risk
                        </Tag>
                      </Horizontal>
                      <Texto weight="600" style={{ color: riskColors[riskLevel].text }}>
                        ${Math.round(annualPenalty).toLocaleString()}
                      </Texto>
                    </Horizontal>
                    <Horizontal justifyContent="space-between">
                      <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
                        Rate: {formatPenalties(supplier.metrics.penalties)}/gal
                      </Texto>
                      <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
                        Est. shortfall: 5%
                      </Texto>
                    </Horizontal>
                  </div>
                );
              })}
            </Vertical>
          </Vertical>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #f0f0f0' }} />

          {/* AI Summary */}
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#f9f0ff',
            border: '1px solid #d3adf7',
          }}>
            <Horizontal gap={8} alignItems="center" style={{ marginBottom: '8px' }}>
              <ThunderboltOutlined style={{ color: '#722ed1' }} />
              <Texto category="p2" weight="600" style={{ color: '#722ed1' }}>AI Analysis Summary</Texto>
            </Horizontal>
            <Texto category="p2" appearance="medium" style={{ lineHeight: '20px' }}>
              P66 offers the lowest average price with minimal penalty exposure. Marathon, as incumbent, provides the most flexible allocation terms and zero compliance issues. Shell balances competitive pricing with the highest volume capacity at 2.6M gal. Consider Marathon for risk-adjusted value or P66 for pure cost optimization.
            </Texto>
          </div>
        </Vertical>
      </Drawer>
    </div>
  );
}
