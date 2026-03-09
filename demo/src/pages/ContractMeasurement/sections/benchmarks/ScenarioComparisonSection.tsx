import { useState, useMemo, useCallback, useEffect } from 'react';
import { Texto, GraviButton, Horizontal, Vertical, BBDTag, NotificationMessage } from '@gravitate-js/excalibrr';
import {
  CheckSquareOutlined,
  BorderOutlined,
  StarOutlined,
  StarFilled,
  PlusOutlined,
  EditOutlined,
  HolderOutlined,
  SwapOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  DeleteOutlined,
  RightOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { Table, Checkbox, Tooltip, Select, Popover, Popconfirm, DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { Scenario, ComparisonRowData, ScenarioCellData, GroupingDimension, GroupHeaderRow, TableRow } from '../../types/scenario.types';
import { GROUPING_OPTIONS } from '../../types/scenario.types';
import { useFeatureMode } from '../../../../contexts/FeatureModeContext';
import { ScenarioCellRenderer, getDeltaColorClass } from './ScenarioCellRenderer'
import { exportScenarioComparison } from './scenarioExport';
import { BenchmarkScenarioDrawer } from '../../components/BenchmarkScenarioDrawer';
import { FormulaScenarioDrawer } from '../../components/FormulaScenarioDrawer';
import { UploadScenarioDrawer } from '../../components/UploadScenarioDrawer';
import { SAMPLE_DETAILS, type ContractDetail } from '../../ContractMeasurement.data';
import { getInstrumentsByProductGroup } from '../../../../shared/data/pricePublishers.data';
import styles from './ScenarioComparisonSection.module.css';

const formatShortDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// Instrument picker popover content for no-match cells
function InstrumentPickerPopover({
  product,
  location,
  productGroup,
  onApply,
}: {
  product: string;
  location: string;
  productGroup: string;
  onApply: (instrumentId: string, price: number) => void;
}) {
  const [selectedInstrument, setSelectedInstrument] = useState<string | undefined>(undefined);
  const group = productGroup === 'diesel' ? 'diesel' : 'gasoline';
  const instruments = getInstrumentsByProductGroup(group);

  // Deterministic mock price based on instrument ID
  const resolvedPrice = useMemo(() => {
    if (!selectedInstrument) return null;
    const seed = selectedInstrument.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const frac = (((Math.sin(seed * 7919) * 43758.5453) % 1) + 1) % 1;
    return 2.2 + frac * 0.35;
  }, [selectedInstrument]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: 280, padding: '4px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Texto weight="600">Select Instrument</Texto>
        <Texto category="p2" appearance="medium">
          {product} — {location}
        </Texto>
      </div>
      <Select
        showSearch
        placeholder="Choose an instrument..."
        value={selectedInstrument}
        onChange={setSelectedInstrument}
        optionFilterProp="label"
        options={instruments.map((inst) => ({
          value: inst.id,
          label: `${inst.publisher} — ${inst.name} (${inst.region})`,
        }))}
        style={{ width: '100%' }}
      />
      {resolvedPrice !== null && (
        <div
          style={{
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <Texto category="p2" appearance="medium">Resolved Price</Texto>
          <Texto weight="700" style={{ color: '#52c41a' }}>
            ${resolvedPrice.toFixed(4)}/gal
          </Texto>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <GraviButton
          buttonText="Apply"
          theme1
          size="small"
          disabled={!selectedInstrument || resolvedPrice === null}
          onClick={() => {
            if (selectedInstrument && resolvedPrice !== null) {
              onApply(selectedInstrument, resolvedPrice);
            }
          }}
        />
      </div>
    </div>
  );
}

interface ScenarioComparisonSectionProps {
  scenarios: Scenario[];
  includedDetails: ContractDetail[];
  excludedDetailIds: Set<string>;
  onExcludeDetails: (ids: string[]) => void;
  onRestoreDetails: (ids: string[]) => void;
  onRestoreAll: () => void;
  referenceSelections: Record<string, string>;
  onSetColumnReference: (scenarioId: string) => void;
  onAddScenario?: (scenario: Scenario) => void;
  onUpdateScenario?: (scenario: Scenario) => void;
  onReorderScenarios?: (newOrder: string[]) => void;
  groupingDimension: GroupingDimension;
  onGroupingChange: (dimension: GroupingDimension) => void;
  hasComparisonScenarios?: boolean;
  effectiveDateRange?: [Dayjs | null, Dayjs | null] | null;
  onEffectiveDateRangeChange?: (range: [Dayjs | null, Dayjs | null] | null) => void;
}

function generateScenarioCellData(
  scenarioId: string,
  isReference: boolean,
  detailIndex: number,
  scenario?: Scenario
): ScenarioCellData {
  const totalDetails = SAMPLE_DETAILS.length;

  // For benchmark scenarios, simulate no-match on last 2 details and partial data on 2 other details
  if (scenario?.entryMethod === 'benchmark' && scenario.status === 'complete') {
    const noMatchThreshold = totalDetails - 2;
    const partialDataIndex1 = totalDetails - 3;
    const partialDataIndex2 = totalDetails - 5;

    // No match — lookup failure
    if (detailIndex >= noMatchThreshold) {
      const allocation = SAMPLE_DETAILS[detailIndex].volume;
      return {
        scenarioId,
        price: 0,
        formulaRef: 'No instrument found',
        allocation,
        rateability: 0,
        rateabilityStatus: 'below-min',
        isReference,
        isMissingPrice: true,
      };
    }

    // Partial data — instrument found but incomplete prices (2 rows with different ratios)
    if (detailIndex === partialDataIndex1 || detailIndex === partialDataIndex2) {
      const seed = detailIndex * 7919 + scenarioId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const frac = (((Math.sin(seed) * 43758.5453) % 1) + 1) % 1;
      const basePrice = 2.45 + frac * 0.3 - 0.15;
      const primaryPrice = 2.45;
      const delta = isReference ? undefined : basePrice - primaryPrice;
      const allocation = SAMPLE_DETAILS[detailIndex].volume;
      const rateability = 85 + frac * 25;
      const partialInfo =
        detailIndex === partialDataIndex1 ? { available: 18, total: 22 } : { available: 7, total: 10 };
      return {
        scenarioId,
        price: basePrice,
        delta,
        deltaPercent: delta ? (delta / primaryPrice) * 100 : undefined,
        formulaRef: isReference
          ? 'OPIS Houston Rack + $0.03'
          : `OPIS Contract ${scenarioId.includes('A') ? 'Low' : 'High'}`,
        allocation,
        rateability,
        rateabilityStatus: rateability >= 90 ? 'on-track' : rateability >= 80 ? 'at-risk' : 'below-min',
        impact: delta ? Math.round(delta * allocation) : undefined,
        isReference,
        missingPriceInfo: partialInfo,
      };
    }
  }

  const seed = detailIndex * 7919 + scenarioId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const frac = (((Math.sin(seed) * 43758.5453) % 1) + 1) % 1;
  const basePrice = 2.45 + frac * 0.3 - 0.15;
  const primaryPrice = 2.45;
  const delta = isReference ? undefined : basePrice - primaryPrice;
  const allocation = SAMPLE_DETAILS[detailIndex].volume;
  const rateability = 85 + frac * 25;

  return {
    scenarioId,
    price: basePrice,
    delta,
    deltaPercent: delta ? (delta / primaryPrice) * 100 : undefined,
    formulaRef: isReference
      ? 'OPIS Houston Rack + $0.03'
      : `OPIS Contract ${scenarioId.includes('A') ? 'Low' : 'High'}`,
    allocation,
    rateability,
    rateabilityStatus: rateability >= 90 ? 'on-track' : rateability >= 80 ? 'at-risk' : 'below-min',
    impact: delta ? Math.round(delta * allocation) : undefined,
    isReference,
  };
}

export function ScenarioComparisonSection({
  scenarios,
  includedDetails,
  excludedDetailIds,
  onExcludeDetails,
  onRestoreDetails,
  onRestoreAll,
  referenceSelections,
  onSetColumnReference,
  onAddScenario,
  onUpdateScenario,
  onReorderScenarios,
  groupingDimension,
  onGroupingChange,
  hasComparisonScenarios = true,
  effectiveDateRange,
  onEffectiveDateRangeChange,
}: ScenarioComparisonSectionProps) {
  const { isFutureMode } = useFeatureMode();
  const [isReferenceMode, setIsReferenceMode] = useState(false);
  const [addScenarioOpen, setAddScenarioOpen] = useState(false);
  const [benchmarkDrawerVisible, setBenchmarkDrawerVisible] = useState(false);
  const [formulaDrawerVisible, setFormulaDrawerVisible] = useState(false);
  const [uploadDrawerVisible, setUploadDrawerVisible] = useState(false);

  // Edit mode state
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null); // For single-detail edit

  // Instrument override state for resolved no-match cells
  const [instrumentOverrides, setInstrumentOverrides] = useState<Map<string, { instrumentId: string; price: number }>>(new Map());

  const handleInstrumentOverride = useCallback((detailId: string, scenarioId: string, instrumentId: string, price: number) => {
    const key = `${detailId}:${scenarioId}`;
    setInstrumentOverrides((prev) => {
      const next = new Map(prev);
      next.set(key, { instrumentId, price });
      return next;
    });
    NotificationMessage('Instrument Applied', `Override price set to $${price.toFixed(4)}/gal`, false);
  }, []);

  // Row selection state for exclusion
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Filter state
  const [productFilter, setProductFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);

  // Sort state (always sorts by delta column)
  const [sortScenarioId, setSortScenarioId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Drag-and-drop state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Reset sort if sorted scenario is removed
  useEffect(() => {
    if (sortScenarioId && !scenarios.some((s) => s.id === sortScenarioId)) {
      setSortScenarioId(null);
      setSortDirection(null);
    }
  }, [scenarios, sortScenarioId]);

  // Handle editing a scenario (header click - edit all details)
  const handleEditScenario = useCallback((scenario: Scenario) => {
    setEditingScenario(scenario);
    setEditingDetailId(null); // Edit all details
    if (scenario.entryMethod === 'formula') {
      setFormulaDrawerVisible(true);
    } else if (scenario.entryMethod === 'upload') {
      setUploadDrawerVisible(true);
    } else {
      setBenchmarkDrawerVisible(true);
    }
  }, []);

  // Handle editing a single detail (cell click - formula scenarios only)
  const handleEditDetail = useCallback((scenario: Scenario, detailId: string) => {
    setEditingScenario(scenario);
    setEditingDetailId(detailId);
    setFormulaDrawerVisible(true);
  }, []);

  // Handle selecting a scenario type (Benchmark, Formula, or Upload)
  const handleSelectScenarioType = useCallback((type: 'benchmark' | 'formula' | 'upload') => {
    setEditingScenario(null);
    setEditingDetailId(null);
    if (type === 'benchmark') {
      setBenchmarkDrawerVisible(true);
    } else if (type === 'formula') {
      setFormulaDrawerVisible(true);
    } else {
      setUploadDrawerVisible(true);
    }
  }, []);

  // Handle closing drawers
  const handleCloseBenchmarkDrawer = useCallback(() => {
    setBenchmarkDrawerVisible(false);
    setEditingScenario(null);
  }, []);

  const handleCloseFormulaDrawer = useCallback(() => {
    setFormulaDrawerVisible(false);
    setEditingScenario(null);
    setEditingDetailId(null);
  }, []);

  // Handle saving a benchmark scenario (new or update)
  const handleSaveBenchmarkScenario = useCallback(
    (scenario: Scenario) => {
      if (editingScenario) {
        onUpdateScenario?.(scenario);
        NotificationMessage('Success', `Scenario "${scenario.name}" updated successfully`, false);
      } else {
        onAddScenario?.(scenario);
        NotificationMessage('Success', `Scenario "${scenario.name}" added successfully`, false);
      }
      handleCloseBenchmarkDrawer();
    },
    [editingScenario, onAddScenario, onUpdateScenario, handleCloseBenchmarkDrawer]
  );

  // Handle saving a formula scenario (new or update)
  const handleSaveFormulaScenario = useCallback(
    (scenario: Scenario) => {
      if (editingScenario) {
        onUpdateScenario?.(scenario);
        NotificationMessage('Success', `Scenario "${scenario.name}" updated successfully`, false);
      } else {
        onAddScenario?.(scenario);
        NotificationMessage('Success', `Scenario "${scenario.name}" added successfully`, false);
      }
      handleCloseFormulaDrawer();
    },
    [editingScenario, onAddScenario, onUpdateScenario, handleCloseFormulaDrawer]
  );

  // Handle closing upload drawer
  const handleCloseUploadDrawer = useCallback(() => {
    setUploadDrawerVisible(false);
    setEditingScenario(null);
  }, []);

  // Handle saving an upload scenario (new or update)
  const handleSaveUploadScenario = useCallback(
    (scenario: Scenario) => {
      if (editingScenario) {
        onUpdateScenario?.(scenario);
        NotificationMessage('Success', `Scenario "${scenario.name}" updated successfully`, false);
      } else {
        onAddScenario?.(scenario);
        NotificationMessage('Success', `Scenario "${scenario.name}" imported successfully`, false);
      }
      handleCloseUploadDrawer();
    },
    [editingScenario, onAddScenario, onUpdateScenario, handleCloseUploadDrawer]
  );

  const allRowsHaveSameReference = useMemo(() => {
    const selections = Object.values(referenceSelections);
    if (selections.length === 0 || selections.length !== includedDetails.length) return true;
    return selections.every((id) => id === selections[0]);
  }, [referenceSelections, includedDetails.length]);

  const columnReferenceScenarioId = useMemo(() => {
    if (!allRowsHaveSameReference) return null;
    const selections = Object.values(referenceSelections);
    if (selections.length === 0) return scenarios.find((s) => s.isReference)?.id || null;
    return selections[0] || null;
  }, [allRowsHaveSameReference, referenceSelections, scenarios]);

  const isColumnReference = useCallback(
    (scenarioId: string) => {
      if (!allRowsHaveSameReference) return false;
      const selections = Object.values(referenceSelections);
      if (selections.length === 0)
        return scenarios.find((s) => s.id === scenarioId)?.isReference || false;
      return selections[0] === scenarioId;
    },
    [allRowsHaveSameReference, referenceSelections, scenarios]
  );

  // Derived filter options from data
  const uniqueProducts = useMemo(
    () => [...new Set(includedDetails.map((d) => d.product))].map((p) => ({ value: p, label: p })),
    [includedDetails]
  );
  const uniqueLocations = useMemo(
    () => [...new Set(includedDetails.map((d) => d.location))].map((l) => ({ value: l, label: l })),
    [includedDetails]
  );

  const hasActiveFilters = productFilter.length > 0 || locationFilter.length > 0;

  const comparisonData = useMemo(() => {
    return includedDetails.map((detail, index) => {
      const scenarioData: Record<string, ScenarioCellData> = {};
      scenarios.forEach((scenario) => {
        const isReferenceForRow =
          referenceSelections[detail.detailId] === scenario.id ||
          (!referenceSelections[detail.detailId] && (scenario.isReference ?? false));
        const cellData = generateScenarioCellData(scenario.id, isReferenceForRow, index, scenario);

        // Apply instrument override if a no-match cell has been resolved
        const overrideKey = `${detail.detailId}:${scenario.id}`;
        const override = instrumentOverrides.get(overrideKey);
        if (override && cellData.isMissingPrice && !cellData.missingPriceInfo) {
          const primaryPrice = 2.45;
          const delta = isReferenceForRow ? undefined : override.price - primaryPrice;
          scenarioData[scenario.id] = {
            ...cellData,
            price: override.price,
            delta,
            deltaPercent: delta ? (delta / primaryPrice) * 100 : undefined,
            formulaRef: `Override: ${override.instrumentId}`,
            isMissingPrice: false,
          };
        } else {
          scenarioData[scenario.id] = cellData;
        }
      });
      return { ...detail, scenarios: scenarioData } as ComparisonRowData;
    });
  }, [scenarios, referenceSelections, includedDetails, instrumentOverrides]);

  // Apply filters
  const filteredData = useMemo(() => {
    return comparisonData.filter((row) => {
      if (productFilter.length > 0 && !productFilter.includes(row.product)) return false;
      if (locationFilter.length > 0 && !locationFilter.includes(row.location)) return false;
      return true;
    });
  }, [comparisonData, productFilter, locationFilter]);

  // Apply sort (by delta of a specific scenario column)
  const sortedData = useMemo(() => {
    if (!sortScenarioId || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const deltaA = a.scenarios[sortScenarioId]?.delta ?? 0;
      const deltaB = b.scenarios[sortScenarioId]?.delta ?? 0;
      const cmp = deltaA - deltaB;
      if (cmp !== 0) return sortDirection === 'asc' ? cmp : -cmp;
      // Tie-break on detailId for stability
      return a.detailId.localeCompare(b.detailId);
    });
  }, [filteredData, sortScenarioId, sortDirection]);

  // Grouping expand/collapse state
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Auto-expand all groups when grouping dimension changes
  useEffect(() => {
    if (groupingDimension === 'none') {
      setExpandedGroups(new Set());
      return;
    }
    // Compute all group keys and expand them
    const keys = new Set<string>();
    sortedData.forEach((row) => {
      const key = groupingDimension === 'product-family' ? row.productGroup : row.locationRegion;
      keys.add(key);
    });
    setExpandedGroups(keys);
  }, [groupingDimension]); // intentionally only depends on dimension change

  const handleToggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  }, []);

  // Grouped display data pipeline
  const displayData = useMemo<TableRow[]>(() => {
    if (groupingDimension === 'none') return sortedData;

    const groups = new Map<string, ComparisonRowData[]>();
    const groupOrder: string[] = [];

    for (const row of sortedData) {
      const key = groupingDimension === 'product-family' ? row.productGroup : row.locationRegion;
      if (!groups.has(key)) {
        groups.set(key, []);
        groupOrder.push(key);
      }
      groups.get(key)!.push(row);
    }

    const result: TableRow[] = [];
    for (const groupKey of groupOrder) {
      const rows = groups.get(groupKey)!;
      const totalVolume = rows.reduce((s, r) => s + r.volume, 0);
      const totalPercentage = rows.reduce((s, r) => s + r.percentTotal, 0);
      const weightedContractPrice =
        totalVolume > 0 ? rows.reduce((s, r) => s + r.contractPrice * r.volume, 0) / totalVolume : 0;

      // Compute volume-weighted aggregates per scenario
      const aggregatedScenarios: GroupHeaderRow['aggregatedScenarios'] = {};
      scenarios.forEach((scenario) => {
        let sumPrice = 0;
        let sumDelta = 0;
        let deltaCount = 0;
        let sumImpact = 0;
        let scenarioVolume = 0;

        rows.forEach((row) => {
          const cell = row.scenarios[scenario.id];
          if (cell) {
            sumPrice += cell.price * row.volume;
            scenarioVolume += row.volume;
            if (cell.delta !== undefined) {
              sumDelta += cell.delta * row.volume;
              deltaCount++;
            }
            sumImpact += cell.impact || 0;
          }
        });

        aggregatedScenarios[scenario.id] = {
          avgPrice: scenarioVolume > 0 ? sumPrice / scenarioVolume : 0,
          avgDelta: deltaCount > 0 && scenarioVolume > 0 ? sumDelta / scenarioVolume : undefined,
          totalVolume: scenarioVolume,
          totalImpact: sumImpact,
        };
      });

      result.push({
        isGroupHeader: true,
        groupKey,
        groupLabel: groupKey.charAt(0).toUpperCase() + groupKey.slice(1),
        rowCount: rows.length,
        totalVolume,
        totalPercentage,
        contractPrice: weightedContractPrice,
        aggregatedScenarios,
      });

      if (expandedGroups.has(groupKey)) {
        rows.forEach((row) => result.push({ ...row, isGroupHeader: false as const, groupKey }));
      }
    }
    return result;
  }, [sortedData, groupingDimension, expandedGroups, scenarios]);

  const totals = useMemo(() => {
    const result: Record<string, { volume: number; impact: number; avgCpgDelta: number; includedCount: number; excludedCount: number }> = {};
    scenarios.forEach((scenario) => {
      let totalVolume = 0,
        totalImpact = 0,
        sumCpgDelta = 0,
        includedCount = 0,
        excludedCount = 0;
      filteredData.forEach((row) => {
        const cellData = row.scenarios[scenario.id];
        if (!cellData) return;
        // Skip full no-match cells (price=0, no partial data) from averages
        if (cellData.isMissingPrice && !cellData.missingPriceInfo) {
          excludedCount++;
          return;
        }
        totalVolume += cellData.allocation;
        totalImpact += cellData.impact || 0;
        sumCpgDelta += cellData.price - row.contractPrice;
        includedCount++;
      });
      result[scenario.id] = {
        volume: totalVolume,
        impact: totalImpact,
        avgCpgDelta: includedCount > 0 ? sumCpgDelta / includedCount : 0,
        includedCount,
        excludedCount,
      };
    });
    return result;
  }, [scenarios, filteredData]);

  // Use Map keyed by detailId so sorting doesn't break delta-to-row association
  const fixedDeltas = useMemo(() => {
    if (!columnReferenceScenarioId) return null;
    const perRow = new Map<string, number | null>();
    let sum = 0;
    let includedCount = 0;
    let excludedCount = 0;
    filteredData.forEach((row) => {
      const primaryCell = row.scenarios[columnReferenceScenarioId];
      // Skip full no-match cells
      if (primaryCell && primaryCell.isMissingPrice && !primaryCell.missingPriceInfo) {
        perRow.set(row.detailId, null);
        excludedCount++;
        return;
      }
      const delta = primaryCell ? row.contractPrice - primaryCell.price : 0;
      perRow.set(row.detailId, delta);
      sum += delta;
      includedCount++;
    });
    const avg = includedCount > 0 ? sum / includedCount : 0;
    return { perRow, average: avg, includedCount, excludedCount };
  }, [filteredData, columnReferenceScenarioId]);

  // Sort toggle: unsorted → asc → desc → unsorted
  const handleToggleSort = useCallback(
    (scenarioId: string) => {
      if (sortScenarioId !== scenarioId) {
        setSortScenarioId(scenarioId);
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortScenarioId(null);
        setSortDirection(null);
      }
    },
    [sortScenarioId, sortDirection]
  );

  // Drag handlers for column reordering
  const handleDragStart = useCallback((e: React.DragEvent, scenarioId: string) => {
    setDraggingId(scenarioId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', scenarioId);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, scenarioId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (scenarioId !== draggingId) {
        setDragOverId(scenarioId);
      }
    },
    [draggingId]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData('text/plain');

      if (sourceId && sourceId !== targetId && onReorderScenarios) {
        const currentOrder = scenarios.map((s) => s.id);
        const sourceIndex = currentOrder.indexOf(sourceId);
        const targetIndex = currentOrder.indexOf(targetId);

        if (sourceIndex !== -1 && targetIndex !== -1) {
          const newOrder = [...currentOrder];
          newOrder.splice(sourceIndex, 1);
          newOrder.splice(targetIndex, 0, sourceId);
          onReorderScenarios(newOrder);
        }
      }

      setDraggingId(null);
      setDragOverId(null);
    },
    [scenarios, onReorderScenarios]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  const addScenarioPopoverContent = useMemo(() => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0', minWidth: 160 }}>
      <GraviButton buttonText="Benchmark" appearance="outlined" style={{ width: '100%' }}
        onClick={() => { setAddScenarioOpen(false); handleSelectScenarioType('benchmark'); }} />
      <GraviButton buttonText="Formula" appearance="outlined" style={{ width: '100%' }}
        onClick={() => { setAddScenarioOpen(false); handleSelectScenarioType('formula'); }} />
      {isFutureMode && (
        <GraviButton buttonText="Upload" appearance="outlined" style={{ width: '100%' }}
          onClick={() => { setAddScenarioOpen(false); handleSelectScenarioType('upload'); }} />
      )}
    </div>
  ), [isFutureMode, handleSelectScenarioType]);

  const renderScenarioCell = useCallback(
    (record: ComparisonRowData, scenario: Scenario) => {
      // For formula scenarios, check if this specific detail has been configured
      if (scenario.entryMethod === 'formula' && scenario.detailFormulas) {
        const detailFormula = scenario.detailFormulas.find((d) => d.detailId === record.detailId);
        if (!detailFormula || detailFormula.status !== 'confirmed') {
          return (
            <div className={`${styles.emptyCell} ${styles.cellWithEdit}`}>
              <Texto category="p2" appearance="medium" style={{ fontStyle: 'italic' }}>
                Empty
              </Texto>
              <Tooltip title="Edit detail">
                <EditOutlined
                  className={styles.cellEditIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditDetail(scenario, record.detailId);
                  }}
                />
              </Tooltip>
            </div>
          );
        }
      }

      // Show "Unconfirmed" placeholder for incomplete benchmark scenarios
      if (scenario.entryMethod === 'benchmark' && scenario.status !== 'complete') {
        return (
          <div className={styles.unconfirmedCell}>
            <Texto category="p2" appearance="medium" style={{ fontStyle: 'italic' }}>
              Unconfirmed
            </Texto>
          </div>
        );
      }

      const cellData = record.scenarios[scenario.id];
      if (!cellData) return null;

      // No match — lookup failure (benchmark scenario, isMissingPrice=true, no missingPriceInfo)
      if (scenario.entryMethod === 'benchmark' && cellData.isMissingPrice && !cellData.missingPriceInfo) {
        if (isFutureMode) {
          return (
            <Popover
              trigger="click"
              placement="right"
              content={
                <InstrumentPickerPopover
                  product={record.product}
                  location={record.location}
                  productGroup={record.productGroup}
                  onApply={(instrumentId, price) =>
                    handleInstrumentOverride(record.detailId, scenario.id, instrumentId, price)
                  }
                />
              }
            >
              <div className={styles.noMatchCell}>
                <WarningFilled style={{ color: '#ff4d4f', fontSize: 18 }} />
                <Texto category="p2" weight="600" style={{ fontSize: '11px', color: '#ff4d4f', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  No Match
                </Texto>
                <Texto category="p2" style={{ fontSize: '11px', textAlign: 'center' }}>
                  No instrument found for <span style={{ fontWeight: 600 }}>{record.product}</span>
                </Texto>
                <span className={styles.noMatchFixLink}>
                  <EditOutlined style={{ fontSize: 12 }} />
                  Select instrument
                </span>
              </div>
            </Popover>
          );
        }
        return (
          <div className={styles.noMatchCell}>
            <WarningFilled style={{ color: '#ff4d4f', fontSize: 18 }} />
            <Texto category="p2" weight="600" style={{ fontSize: '11px', color: '#ff4d4f', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              No Match
            </Texto>
            <Texto category="p2" style={{ fontSize: '11px', textAlign: 'center' }}>
              No instrument found for <span style={{ fontWeight: 600 }}>{record.product}</span>
            </Texto>
          </div>
        );
      }

      const isReferenceForRow =
        referenceSelections[record.detailId] === scenario.id ||
        (!referenceSelections[record.detailId] && (scenario.isReference ?? false));
      const showRowStar = isColumnReference(scenario.id);

      // For formula scenarios, wrap with edit icon
      if (scenario.entryMethod === 'formula') {
        return (
          <div className={styles.cellWithEdit}>
            <ScenarioCellRenderer
              cellData={cellData}
              isReferenceForRow={isReferenceForRow}
              showRowStar={showRowStar}
            />
            <Tooltip title="Edit detail">
              <EditOutlined
                className={styles.cellEditIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditDetail(scenario, record.detailId);
                }}
              />
            </Tooltip>
          </div>
        );
      }

      return (
        <ScenarioCellRenderer
          cellData={cellData}
          isReferenceForRow={isReferenceForRow}
          showRowStar={showRowStar}
        />
      );
    },
    [referenceSelections, isColumnReference, isReferenceMode, handleEditDetail, handleInstrumentOverride]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnsType<any> = useMemo(() => {
    const isGrouped = groupingDimension !== 'none';

    const baseColumns: ColumnsType<TableRow> = [
      {
        title: 'DETAIL',
        dataIndex: 'product',
        key: 'detail',
        width: 200,
        maxWidth: 270,
        fixed: 'left',
        onCell: () => ({ style: { verticalAlign: 'top' } }),
        render: (_: unknown, record: TableRow) => {
          if (record.isGroupHeader) {
            const isExpanded = expandedGroups.has(record.groupKey);
            return (
              <div
                className={styles.groupHeaderCell}
                onClick={() => handleToggleGroup(record.groupKey)}
              >
                <RightOutlined
                  style={{
                    fontSize: 12,
                    transition: 'transform 0.2s',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                />
                <Texto weight="600">{record.groupLabel}</Texto>
                <Texto category="p2" appearance="medium">
                  ({record.rowCount} details)
                </Texto>
              </div>
            );
          }
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Texto weight="600" category="p2">{record.product}</Texto>
                <Texto category="p2" appearance="medium" style={{ fontSize: 11 }}>{record.detailId}</Texto>
              </div>
              <Texto category="p2" appearance="medium">
                {record.location}
              </Texto>
              <Texto category="p2" appearance="medium" style={{ fontSize: 10 }}>
                {formatShortDate(record.effectiveStartDate)} – {formatShortDate(record.effectiveEndDate)}
              </Texto>
            </div>
          );
        },
      },
      ...(isFutureMode
        ? [
            {
              title: 'VOLUME',
              dataIndex: 'volume',
              key: 'volume',
              width: 100,
              maxWidth: 250,
              render: (_: unknown, record: TableRow) => {
                if (record.isGroupHeader) {
                  return (
                    <Vertical gap={2}>
                      <Texto weight="600">{(record.totalVolume / 1000).toFixed(0)}K gal</Texto>
                      <Texto category="p2" appearance="medium">
                        {record.totalPercentage.toFixed(1)}%
                      </Texto>
                    </Vertical>
                  );
                }
                return (
                  <Vertical gap={2}>
                    <Texto>{(record.volume / 1000).toFixed(0)}K gal</Texto>
                    <Texto category="p2" appearance="medium">
                      {record.percentTotal.toFixed(1)}%
                    </Texto>
                  </Vertical>
                );
              },
            },
          ]
        : []),
    ];

    const scenarioColumns: ColumnsType<TableRow> = scenarios.map((scenario) => {
      const isSorted = sortScenarioId === scenario.id;
      const isDragging = draggingId === scenario.id;
      const isDragOver = dragOverId === scenario.id;
      const canDrag = !!onReorderScenarios && !isReferenceMode;

      const headerClassNames = [
        styles.columnHeader,
        isDragging ? styles.scenarioHeaderDragging : '',
        isDragOver ? styles.scenarioHeaderDragOver : '',
      ]
        .filter(Boolean)
        .join(' ');

      return {
        title: (
          <div
            className={headerClassNames}
            draggable={canDrag}
            onDragStart={canDrag ? (e) => handleDragStart(e, scenario.id) : undefined}
            onDragOver={canDrag ? (e) => handleDragOver(e, scenario.id) : undefined}
            onDragLeave={canDrag ? handleDragLeave : undefined}
            onDrop={canDrag ? (e) => handleDrop(e, scenario.id) : undefined}
            onDragEnd={canDrag ? handleDragEnd : undefined}
          >
            <Horizontal gap={8} alignItems="center">
              {canDrag && (
                <Tooltip title="Drag to reorder">
                  <HolderOutlined className={styles.dragHandle} />
                </Tooltip>
              )}
              {isReferenceMode && (
                <Checkbox
                  checked={
                    Object.values(referenceSelections).every((id) => id === scenario.id) &&
                    Object.keys(referenceSelections).length === includedDetails.length
                  }
                  indeterminate={
                    Object.values(referenceSelections).some((id) => id === scenario.id) &&
                    !Object.values(referenceSelections).every((id) => id === scenario.id)
                  }
                  onChange={() => onSetColumnReference(scenario.id)}
                />
              )}
              <span>{scenario.name}</span>
              {scenario.priceConfig?.source === 'adhoc' && (
                <Tooltip title="Ad-hoc benchmark — local to this contract measurement">
                  <span className={styles.adhocIndicator}>
                    <span className={styles.adhocDot} />
                    Local
                  </span>
                </Tooltip>
              )}
              {isColumnReference(scenario.id) && (
                <Tooltip title="Reference">
                  <StarFilled className={styles.starIconHeader} />
                </Tooltip>
              )}
            </Horizontal>
            <Horizontal gap={4} alignItems="center">
              <Tooltip title={isSorted ? (sortDirection === 'asc' ? 'Sort descending' : 'Clear sort') : 'Sort by delta'}>
                {isSorted && sortDirection === 'asc' ? (
                  <SortAscendingOutlined
                    className={`${styles.headerSortIcon} ${styles.headerSortActive}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSort(scenario.id);
                    }}
                  />
                ) : isSorted && sortDirection === 'desc' ? (
                  <SortDescendingOutlined
                    className={`${styles.headerSortIcon} ${styles.headerSortActive}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSort(scenario.id);
                    }}
                  />
                ) : (
                  <SwapOutlined
                    className={styles.headerSortIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSort(scenario.id);
                    }}
                  />
                )}
              </Tooltip>
              <Tooltip title="Edit scenario">
                <EditOutlined
                  className={styles.headerEditIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditScenario(scenario);
                  }}
                />
              </Tooltip>
            </Horizontal>
          </div>
        ),
        dataIndex: scenario.id,
        key: scenario.id,
        minWidth: 250,
        render: (_: unknown, record: TableRow) => {
          if (record.isGroupHeader) {
            const agg = record.aggregatedScenarios[scenario.id];
            if (!agg) return null;
            return (
              <div className={styles.groupAggCell}>
                <Texto weight="600">${agg.avgPrice.toFixed(4)}/gal</Texto>
                {agg.avgDelta !== undefined && (
                  <Texto category="p2" className={getDeltaColorClass(agg.avgDelta)}>
                    {agg.avgDelta >= 0 ? '+' : ''}
                    {agg.avgDelta.toFixed(4)}
                  </Texto>
                )}
              </div>
            );
          }
          return renderScenarioCell(record as ComparisonRowData, scenario);
        },
        onCell: (record: TableRow) => {
          const style: React.CSSProperties = { verticalAlign: 'top' };
          if (!record.isGroupHeader) {
            const compRecord = record as ComparisonRowData;
            const cellData = compRecord.scenarios[scenario.id];
            const isPartial = !!cellData?.missingPriceInfo;
            const isRef =
              referenceSelections[compRecord.detailId] === scenario.id ||
              (!referenceSelections[compRecord.detailId] && (scenario.isReference ?? false));

            if (isPartial) {
              // Amber takes priority — signals data quality issue
              style.backgroundColor = 'rgba(250, 173, 20, 0.04)';
              style.borderLeft = '3px solid #faad14';
            } else if (isRef) {
              style.backgroundColor = 'rgba(81, 176, 115, 0.08)';
            }
          }
          return { style };
        },
      };
    });

    const fixedDeltaColumn: ColumnsType<TableRow> =
      allRowsHaveSameReference && columnReferenceScenarioId
        ? [
            {
              title: (
                <Tooltip title="Difference between contract price and the selected reference benchmark price">
                  <Vertical gap={2} style={{ cursor: 'default' }}>
                    <Texto category="p2" weight="600">
                      CONTRACT DELTA
                    </Texto>
                    <Texto category="p2" appearance="medium">
                      vs Benchmark
                    </Texto>
                  </Vertical>
                </Tooltip>
              ),
              key: 'fixedDelta',
              width: 130,
              onCell: () => ({ style: { verticalAlign: 'top' } }),
              render: (_: unknown, record: TableRow) => {
                if (record.isGroupHeader) {
                  if (!fixedDeltas) return null;
                  const groupRows = sortedData.filter((r) => {
                    const key = groupingDimension === 'product-family' ? r.productGroup : r.locationRegion;
                    return key === record.groupKey;
                  });
                  if (groupRows.length === 0) return null;
                  let sum = 0;
                  let count = 0;
                  groupRows.forEach((r) => {
                    const d = fixedDeltas.perRow.get(r.detailId);
                    if (d !== undefined && d !== null) {
                      sum += d;
                      count++;
                    }
                  });
                  if (count === 0) return (
                    <Tooltip title="No benchmark price found for this contract detail">
                      <span><Texto weight="600" appearance="medium">—</Texto></span>
                    </Tooltip>
                  );
                  const avg = sum / count;
                  return (
                    <Texto category="p2" weight="600" className={getDeltaColorClass(avg)}>
                      {avg >= 0 ? '+$' : '-$'}
                      {Math.abs(avg).toFixed(4)}/gal
                    </Texto>
                  );
                }
                // Per-row delta
                if (!fixedDeltas) return null;
                const delta = fixedDeltas.perRow.get(record.detailId);
                if (delta === null || delta === undefined) {
                  return (
                    <Tooltip title="No benchmark price found for this contract detail">
                      <span><Texto category="p2" weight="600" appearance="medium">—</Texto></span>
                    </Tooltip>
                  );
                }
                return (
                  <Texto category="p2" weight="600" className={getDeltaColorClass(delta)}>
                    {delta >= 0 ? '+$' : '-$'}
                    {Math.abs(delta).toFixed(4)}/gal
                  </Texto>
                );
              },
            },
          ]
        : [];

    const actionColumn: ColumnsType<TableRow> = isFutureMode ? [
      {
        title: '',
        key: 'rowActions',
        width: 52,
        fixed: 'right',
        render: (_: unknown, record: TableRow) => {
          if (record.isGroupHeader) return null
          return (
            <Popconfirm
              title='Remove Product'
              description='Are you sure you want to remove this product?'
              onConfirm={() => {
                if (includedDetails.length <= 1) {
                  NotificationMessage('Cannot Remove All', 'At least one detail must remain in the analysis', true)
                  return
                }
                onExcludeDetails([record.detailId])
                NotificationMessage('Detail Excluded', '1 detail removed from analysis', false)
              }}
              okText='Remove'
              cancelText='Cancel'
              okButtonProps={{ danger: true }}
            >
              <GraviButton
                icon={<DeleteOutlined />}
                appearance='outlined'
                size='small'
                style={{ minWidth: 'auto', padding: '4px 8px' }}
              />
            </Popconfirm>
          )
        },
      },
    ] : [];

    return [...baseColumns, ...scenarioColumns, ...fixedDeltaColumn, ...actionColumn];
  }, [
    scenarios,
    hasComparisonScenarios,
    referenceSelections,
    isReferenceMode,
    isColumnReference,
    onSetColumnReference,
    renderScenarioCell,
    addScenarioOpen,
    addScenarioPopoverContent,
    handleSelectScenarioType,
    handleEditScenario,
    isFutureMode,
    allRowsHaveSameReference,
    columnReferenceScenarioId,
    fixedDeltas,
    sortScenarioId,
    sortDirection,
    draggingId,
    dragOverId,
    onReorderScenarios,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleToggleSort,
    groupingDimension,
    expandedGroups,
    handleToggleGroup,
    displayData,
    sortedData,
    filteredData,
    includedDetails,
    onExcludeDetails,
  ]);

  const hasFixedDelta = allRowsHaveSameReference && !!columnReferenceScenarioId;

  // Custom header wrapper that appends a CPG delta summary row inside <thead>
  const HeaderWrapper = useCallback(
    (props: React.HTMLAttributes<HTMLTableSectionElement>) => {
      if (sortedData.length === 0) return <thead {...props} />

      return (
        <thead {...props}>
          {props.children}
          <tr className={styles.summaryHeaderRow}>
            {/* Checkbox column (from rowSelection) */}
            <td className={styles.summaryHeaderCell} />
            {/* DETAIL column */}
            <td className={styles.summaryHeaderCell}>
              <div className={styles.summaryHeaderLabel}>
                <Texto>AVG CPG DELTA</Texto>
                <Texto category="p2" appearance="medium">vs Contract Price</Texto>
              </div>
            </td>
            {/* VOLUME column (conditional) */}
            {isFutureMode && (
              <td className={styles.summaryHeaderCell}>
                <Texto weight="600">
                  {(filteredData.reduce((sum, d) => sum + d.volume, 0) / 1000).toFixed(0)}K gal
                </Texto>
              </td>
            )}
            {/* One cell per scenario */}
            {scenarios.map((scenario) => {
              const scenarioTotals = totals[scenario.id];
              return (
                <td key={scenario.id} className={styles.summaryHeaderCell}>
                  {isFutureMode && (
                    <Texto weight="600">{(scenarioTotals?.volume / 1000).toFixed(0)}K gal</Texto>
                  )}
                  <Texto weight="600" className={getDeltaColorClass(scenarioTotals?.avgCpgDelta)}>
                    {scenarioTotals?.avgCpgDelta >= 0 ? '+$' : '-$'}
                    {Math.abs(scenarioTotals?.avgCpgDelta).toFixed(4)}/gal
                  </Texto>
                  {scenarioTotals?.excludedCount > 0 && (
                    <Tooltip title={`${scenarioTotals.excludedCount} row(s) had no benchmark price and are excluded from this average`}>
                      <Texto category="p2" appearance="medium" style={{ cursor: 'default' }}>
                        {scenarioTotals.includedCount}/{scenarioTotals.includedCount + scenarioTotals.excludedCount} rows
                      </Texto>
                    </Tooltip>
                  )}
                </td>
              );
            })}
            {/* Fixed delta column (conditional) */}
            {hasFixedDelta && fixedDeltas && (
              <td className={styles.summaryHeaderCell}>
                <Texto weight="600" className={getDeltaColorClass(fixedDeltas.average)}>
                  {fixedDeltas.average >= 0 ? '+$' : '-$'}
                  {Math.abs(fixedDeltas.average).toFixed(4)}/gal
                </Texto>
                {fixedDeltas.excludedCount > 0 && (
                  <Tooltip title={`${fixedDeltas.excludedCount} row(s) had no benchmark price and are excluded from this average`}>
                    <Texto category="p2" appearance="medium" style={{ cursor: 'default' }}>
                      {fixedDeltas.includedCount}/{fixedDeltas.includedCount + fixedDeltas.excludedCount} rows
                    </Texto>
                  </Tooltip>
                )}
              </td>
            )}
            {/* Ghost column (conditional, empty) */}
            {!hasComparisonScenarios && <td className={styles.summaryHeaderCell} />}
            {/* Action column (empty, Future State only) */}
            {isFutureMode && <td className={styles.summaryHeaderCell} />}
          </tr>
        </thead>
      )
    },
    [sortedData.length, isFutureMode, scenarios, totals, filteredData, hasFixedDelta, fixedDeltas, hasComparisonScenarios]
  )

  if (scenarios.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Vertical gap={16} alignItems="center">
          <StarOutlined className={styles.emptyIcon} />
          <Texto category="h4">No Scenarios Configured</Texto>
          <Texto appearance="medium">Contact your administrator.</Texto>
        </Vertical>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Texto category="h4" weight="600">
            Scenario Comparison
          </Texto>
          <Texto category="p2" appearance="medium">
            {hasComparisonScenarios
              ? 'Compare pricing scenarios across all product details'
              : 'Add a comparison scenario to get started'}
          </Texto>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <Texto category="p2" style={{ color: '#595959' }}>Effective date</Texto>
          <DatePicker.RangePicker
            value={effectiveDateRange ?? undefined}
            onChange={(range) => onEffectiveDateRangeChange?.(range as [Dayjs | null, Dayjs | null] | null)}
            allowClear
          />
          {hasComparisonScenarios && (
            <>
              {isFutureMode && (
                <>
                  <Texto category="p2" style={{ color: '#595959' }}>
                    Group by
                  </Texto>
                  <Select
                    value={groupingDimension}
                    onChange={onGroupingChange}
                    options={GROUPING_OPTIONS}
                    style={{ minWidth: 150 }}
                  />
                </>
              )}
              <Texto category="p2" style={{ color: '#595959' }}>
                Filter by
              </Texto>
              <Select
                mode="multiple"
                placeholder="All Products"
                value={productFilter}
                onChange={setProductFilter}
                options={uniqueProducts}
                style={{ minWidth: 200 }}
                maxTagCount={2}
                allowClear
              />
              <Select
                mode="multiple"
                placeholder="All Locations"
                value={locationFilter}
                onChange={setLocationFilter}
                options={uniqueLocations}
                style={{ minWidth: 200 }}
                maxTagCount={2}
                allowClear
              />
              {hasActiveFilters && (
                <GraviButton
                  buttonText="Clear"
                  appearance="text"
                  onClick={() => {
                    setProductFilter([]);
                    setLocationFilter([]);
                  }}
                />
              )}
              {hasActiveFilters && (
                <Texto category="p2" appearance="medium">
                  Showing {filteredData.length} of {comparisonData.length} details
                </Texto>
              )}
              <div style={{ width: '1px', height: '24px', backgroundColor: '#e8e8e8' }} />
              <GraviButton
                buttonText={isReferenceMode ? 'Done' : 'Set Reference'}
                icon={isReferenceMode ? <CheckSquareOutlined /> : <BorderOutlined />}
                theme1
                appearance={isReferenceMode ? 'filled' : 'outlined'}
                onClick={() => setIsReferenceMode(!isReferenceMode)}
              />
            </>
          )}
          <Popover trigger="click" open={addScenarioOpen} onOpenChange={(v) => setAddScenarioOpen(v)} content={addScenarioPopoverContent}>
            <GraviButton
              buttonText="Add Scenario"
              icon={<PlusOutlined />}
              theme1
            />
          </Popover>
          {hasComparisonScenarios && (
            <GraviButton
              buttonText="Export Results"
              appearance="outlined"
              onClick={() => exportScenarioComparison(scenarios, filteredData, totals)}
            />
          )}
          {isFutureMode && selectedRowKeys.length > 0 && (
            <>
              <div style={{ width: '1px', height: '24px', backgroundColor: '#e8e8e8' }} />
              <GraviButton
                buttonText={`Remove ${selectedRowKeys.length} Selected`}
                icon={<DeleteOutlined />}
                appearance="outlined"
                style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
                onClick={() => {
                  if (selectedRowKeys.length >= includedDetails.length) {
                    NotificationMessage('Cannot Remove All', 'At least one detail must remain in the analysis', true);
                    return;
                  }
                  onExcludeDetails(selectedRowKeys);
                  setSelectedRowKeys([]);
                  NotificationMessage(
                    'Details Excluded',
                    `${selectedRowKeys.length} detail(s) removed from analysis`,
                    false,
                  );
                }}
              />
            </>
          )}
        </div>
      </div>

      {isReferenceMode && (
        <div className={styles.infoBar}>
          <Texto category="p2">
            <strong>Reference Selection Mode:</strong> Click a column header to set that scenario
            as the reference for all rows.
          </Texto>
        </div>
      )}

      {isFutureMode && excludedDetailIds.size > 0 && (
        <div className={styles.exclusionBar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Texto category="p2">
              <strong>{excludedDetailIds.size} detail(s) excluded</strong> from analysis
            </Texto>
            <Popover
              trigger="click"
              placement="bottomRight"
              content={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 280 }}>
                  {SAMPLE_DETAILS.filter((d) => excludedDetailIds.has(d.detailId)).map((d) => (
                    <div
                      key={d.detailId}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Texto weight="600">{d.product}</Texto>
                        <Texto category="p2" appearance="medium">
                          {d.location}
                        </Texto>
                      </div>
                      <GraviButton buttonText="Restore" appearance="text" onClick={() => onRestoreDetails([d.detailId])} />
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '8px', marginTop: '4px' }}>
                    <GraviButton buttonText="Restore All" appearance="text" onClick={onRestoreAll} />
                  </div>
                </div>
              }
            >
              <GraviButton buttonText="View & Restore" appearance="text" />
            </Popover>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        {hasActiveFilters && filteredData.length === 0 ? (
          <div className={styles.emptyFilterResult}>
            <Texto category="p1" appearance="medium">
              No details match the current filters
            </Texto>
            <GraviButton
              buttonText="Clear Filters"
              appearance="outlined"
              onClick={() => {
                setProductFilter([]);
                setLocationFilter([]);
              }}
            />
          </div>
        ) : (
          <>
            <Table
              components={{
                header: { wrapper: HeaderWrapper },
              }}
              rowSelection={isFutureMode ? {
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys as string[]),
                getCheckboxProps: (record: TableRow) => ({
                  style: record.isGroupHeader ? { display: 'none' } : undefined,
                  disabled: record.isGroupHeader,
                }),
              } : undefined}
              columns={columns}
              dataSource={displayData}
              rowKey={(record: TableRow) =>
                record.isGroupHeader ? `group-${record.groupKey}` : record.detailId
              }
              rowClassName={(record: TableRow) => {
                if (record.isGroupHeader) return styles.groupHeaderRow
                if (groupingDimension !== 'none' && !record.isGroupHeader) return styles.groupChildRow
                return ''
              }}
              pagination={false}
              scroll={{ x: 'max-content' }}
              size="small"
            />
          </>
        )}
      </div>

      {/* Scenario Drawers */}
      <BenchmarkScenarioDrawer
        open={benchmarkDrawerVisible}
        onClose={handleCloseBenchmarkDrawer}
        onSave={handleSaveBenchmarkScenario}
        editingScenario={editingScenario?.entryMethod === 'benchmark' ? editingScenario : undefined}
      />
      <FormulaScenarioDrawer
        open={formulaDrawerVisible}
        onClose={handleCloseFormulaDrawer}
        onSave={handleSaveFormulaScenario}
        editingScenario={editingScenario?.entryMethod === 'formula' ? editingScenario : undefined}
        editingDetailId={editingDetailId}
      />
      <UploadScenarioDrawer
        open={uploadDrawerVisible}
        onClose={handleCloseUploadDrawer}
        onSave={handleSaveUploadScenario}
        editingScenario={editingScenario?.entryMethod === 'upload' ? editingScenario : undefined}
      />
    </div>
  );
}
