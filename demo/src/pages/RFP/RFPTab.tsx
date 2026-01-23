import { useState, useCallback, useMemo } from 'react';
import {
  Vertical,
  Texto,
  GraviButton,
  Horizontal,
  NotificationMessage,
} from '@gravitate-js/excalibrr';
import { LeftOutlined, InfoCircleOutlined, BulbOutlined, StarFilled, TrophyOutlined, DownOutlined } from '@ant-design/icons';
import { Tabs, Alert, Drawer, Dropdown, Menu } from 'antd';
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
import { SAMPLE_SUPPLIERS, sortSuppliers, TERMINAL_HISTORY_DATA, SAMPLE_DETAILS, SAMPLE_DETAILS_EXTENDED, AI_RECOMMENDATIONS } from './rfp.data';
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

const { TabPane } = Tabs;

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
      const newProducts = product ? new Set([product]) : prev.selectedProducts;
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
          <Horizontal alignItems="center" style={{ gap: '12px' }}>
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
              {state.currentRound > 1 ? (
                <Dropdown
                  overlay={
                    <Menu onClick={({ key }) => handleViewHistoricalRound(Number(key))}>
                      {Array.from({ length: state.currentRound }, (_, i) => (
                        <Menu.Item key={i + 1} disabled={i + 1 === displayRound}>
                          Round {i + 1}
                        </Menu.Item>
                      ))}
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <span style={{ cursor: 'pointer' }}>
                    <Horizontal alignItems="center" style={{ gap: '4px' }}>
                      <Texto category="p2" appearance="medium">
                        Round {displayRound} - {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}
                        {state.isViewingHistory && ' (Read-Only)'}
                      </Texto>
                      <DownOutlined style={{ fontSize: '10px', color: 'var(--theme-color-2)' }} />
                    </Horizontal>
                  </span>
                </Dropdown>
              ) : (
                <Texto category="p2" appearance="medium">
                  Round {displayRound} - {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''}
                  {state.isViewingHistory && ' (Read-Only)'}
                </Texto>
              )}
            </Vertical>
          </Horizontal>
          <GraviButton
            buttonText="Key Insights"
            icon={<BulbOutlined />}
            onClick={handleOpenInsightsPanel}
            style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', color: '#fff' }}
          />
        </Horizontal>

        {/* Historical view banner */}
        {state.isViewingHistory && (
          <Alert
            className={styles.contentSection}
            message={`Viewing Round ${state.viewingRound} (Completed) - This round is locked`}
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            action={
              <GraviButton
                type="link"
                buttonText={`Return to Round ${state.currentRound}`}
                onClick={handleBackToCurrentRound}
              />
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
            onChange={(key) =>
              setState((prev) => ({ ...prev, viewTab: key as 'comparison' | 'historical' }))
            }
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
          <Vertical style={{ gap: '24px', padding: '24px' }}>
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
          <Vertical style={{ gap: '24px', padding: '24px' }}>
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
        visible={state.isThresholdsModalOpen}
        thresholds={state.thresholds}
        parameters={state.parameters}
        importanceRanking={state.importanceRanking}
        onClose={handleCloseThresholds}
        onSave={handleSaveThresholds}
      />
      <EliminationModal
        visible={state.isEliminationModalOpen}
        supplierNames={getSelectedSupplierNames()}
        onConfirm={handleConfirmElimination}
        onCancel={handleCloseEliminationModal}
      />
      <EditBidsDrawer
        visible={state.isEditBidsDrawerOpen}
        onClose={handleCloseEditBids}
        rfp={state.selectedRFP}
        round={state.currentRound}
        suppliers={getSortedSuppliers()}
        details={state.extendedDetails}
        onSave={handleSaveEditedBids}
      />
      <BidLogDrawer
        visible={state.isBidLogOpen}
        onClose={handleCloseBidLog}
        bidEdits={state.bidEdits}
        onRevert={handleRevert}
      />
      <Drawer
        title="Key Insights"
        placement="right"
        width={400}
        visible={state.isInsightsPanelOpen}
        onClose={handleCloseInsightsPanel}
        mask={false}
      >
        <Vertical className="p-3" style={{ gap: '24px' }}>
          {/* Top Recommendation Section */}
          <Vertical style={{ gap: '12px' }}>
            <Horizontal alignItems="center" style={{ gap: '8px' }}>
              <StarFilled style={{ color: '#faad14', fontSize: '16px' }} />
              <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Top Recommendation
              </Texto>
            </Horizontal>
            <Vertical style={{ gap: '8px' }}>
              <Texto category="h4" weight="600">
                {AI_RECOMMENDATIONS[0]?.supplierName}
              </Texto>
              <Texto category="p1" appearance="medium">
                {AI_RECOMMENDATIONS[0]?.price}
              </Texto>
              <Horizontal style={{ gap: '6px', flexWrap: 'wrap' }}>
                {AI_RECOMMENDATIONS[0]?.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      backgroundColor: '#e6f4ff',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#1890ff',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </Horizontal>
            </Vertical>
          </Vertical>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #e8e8e8' }} />

          {/* Supplier Rankings Section */}
          <Vertical style={{ gap: '12px' }}>
            <Horizontal alignItems="center" style={{ gap: '8px' }}>
              <TrophyOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
              <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Supplier Rankings
              </Texto>
            </Horizontal>
            <Vertical style={{ gap: '10px' }}>
              {AI_RECOMMENDATIONS.map((rec) => (
                <Horizontal key={rec.supplierId} alignItems="center" style={{ gap: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '32px',
                      padding: '4px 8px',
                      backgroundColor: rec.rank === 1 ? '#fff7e6' : '#f5f5f5',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: rec.rank === 1 ? '#d46b08' : '#595959',
                    }}
                  >
                    #{rec.rank}
                  </div>
                  <Texto weight={rec.rank === 1 ? '600' : '400'}>{rec.supplierName}</Texto>
                  <Texto category="p2" appearance="medium" style={{ marginLeft: 'auto' }}>
                    {rec.price}
                  </Texto>
                </Horizontal>
              ))}
            </Vertical>
          </Vertical>
        </Vertical>
      </Drawer>
    </div>
  );
}
