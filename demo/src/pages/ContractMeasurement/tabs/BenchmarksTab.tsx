import { useState, useCallback, useMemo } from 'react'
import { Texto } from '@gravitate-js/excalibrr'
import { Segmented } from 'antd'
import { SettingOutlined, WarningFilled } from '@ant-design/icons'
import { ScenarioComparisonSection } from '../sections/benchmarks/ScenarioComparisonSection'
import { HistoricalComparisonSection } from '../sections/benchmarks'
import { ScenarioDrawer } from '../components/ScenarioDrawer'
import { ParametersModal } from '../components/ParametersModal'
import { getDeltaColorClass } from '../sections/benchmarks/ScenarioCellRenderer'
import { SAMPLE_DETAILS } from '../ContractMeasurement.data'
import type { Scenario, AnalysisParameters, ScenarioFormData, GroupingDimension, BlendedReferenceSummary, BlendedGroupBreakdown } from '../types/scenario.types'
import { DEFAULT_PARAMETERS, generateScenarioId } from '../types/scenario.types'

// Initial sample scenarios
const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'scenario-primary',
    name: 'Current Contract',
    products: 'all',
    status: 'complete',
    entryMethod: 'benchmark',
    isReference: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceConfig: {
      source: 'managed',
      managedBenchmarkId: 'rack-average',
      benchmarkId: 'rack-average',
      publisher: 'opis',
      productHierarchy: 'target-index',
      locationHierarchy: 'city',
    },
  },
  {
    id: 'scenario-a',
    name: 'Scenario A - OPIS Contract Low',
    counterparty: 'circle-k',
    products: 'all',
    status: 'complete',
    entryMethod: 'benchmark',
    isReference: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceConfig: {
      source: 'adhoc',
      benchmarkId: 'contract-low',
      publisher: 'opis',
      productHierarchy: 'product-grade',
      locationHierarchy: 'state',
    },
  },
]

type ViewTab = 'scenarios' | 'historical'

export function BenchmarksTab() {
  // View tab state
  const [activeView, setActiveView] = useState<ViewTab>('scenarios')

  // Scenarios state
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS)

  // Parameters state
  const [parameters, setParameters] = useState<AnalysisParameters>(DEFAULT_PARAMETERS)

  // Primary selections per row (detailId -> scenarioId)
  const [referenceSelections, setReferenceSelections] = useState<Record<string, string>>({})

  // Detail exclusion state
  const [excludedDetailIds, setExcludedDetailIds] = useState<Set<string>>(new Set())

  // Grouping state
  const [groupingDimension, setGroupingDimension] = useState<GroupingDimension>('none')

  // Blended reference mode state
  const [isBlendedMode, setIsBlendedMode] = useState(false)

  const includedDetails = useMemo(
    () => SAMPLE_DETAILS.filter((d) => !excludedDetailIds.has(d.detailId)),
    [excludedDetailIds],
  )

  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingScenario, setEditingScenario] = useState<Scenario | undefined>(undefined)

  // Parameters modal state
  const [parametersModalVisible, setParametersModalVisible] = useState(false)

  // Handle adding a new scenario (directly receives the scenario object)
  const handleAddScenario = useCallback((scenario: Scenario) => {
    setScenarios((prev) => [...prev, scenario])
  }, [])

  // Handle updating an existing scenario
  const handleUpdateScenario = useCallback((updatedScenario: Scenario) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === updatedScenario.id ? updatedScenario : s))
    )
  }, [])

  // Handle saving a scenario (create or update)
  const handleSaveScenario = useCallback(
    (formData: ScenarioFormData) => {
      const now = new Date().toISOString()

      if (editingScenario) {
        // Update existing
        setScenarios((prev) =>
          prev.map((s) =>
            s.id === editingScenario.id
              ? {
                  ...s,
                  ...formData,
                  updatedAt: now,
                }
              : s
          )
        )
      } else {
        // Create new
        const newScenario: Scenario = {
          id: generateScenarioId(),
          ...formData,
          status: 'incomplete',
          isReference: false,
          createdAt: now,
          updatedAt: now,
        }
        setScenarios((prev) => [...prev, newScenario])
      }

      setDrawerVisible(false)
      setEditingScenario(undefined)
    },
    [editingScenario]
  )

  // Handle closing the drawer
  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false)
    setEditingScenario(undefined)
  }, [])

  // Handle excluding details from analysis
  const handleExcludeDetails = useCallback((detailIds: string[]) => {
    setExcludedDetailIds((prev) => {
      const next = new Set(prev)
      detailIds.forEach((id) => next.add(id))
      return next
    })
    // Clean up referenceSelections for excluded rows
    setReferenceSelections((prev) => {
      const next = { ...prev }
      detailIds.forEach((id) => delete next[id])
      return next
    })
  }, [])

  // Handle restoring excluded details
  const handleRestoreDetails = useCallback((detailIds: string[]) => {
    setExcludedDetailIds((prev) => {
      const next = new Set(prev)
      detailIds.forEach((id) => next.delete(id))
      return next
    })
  }, [])

  // Handle restoring all excluded details
  const handleRestoreAll = useCallback(() => {
    setExcludedDetailIds(new Set())
  }, [])

  // Handle setting primary for a specific row
  const handleSetReference = useCallback((detailId: string, scenarioId: string) => {
    setReferenceSelections((prev) => ({
      ...prev,
      [detailId]: scenarioId,
    }))
  }, [])

  // Handle setting primary for entire column
  const handleSetColumnReference = useCallback((scenarioId: string) => {
    const detailIds = includedDetails.map((d) => d.detailId)
    const newSelections: Record<string, string> = {}
    detailIds.forEach((id) => {
      newSelections[id] = scenarioId
    })
    setReferenceSelections(newSelections)

    // Also update the isReference flag on scenarios
    setScenarios((prev) =>
      prev.map((s) => ({
        ...s,
        isReference: s.id === scenarioId,
      }))
    )
  }, [includedDetails])

  // Handle reordering scenarios via drag-and-drop
  const handleReorderScenarios = useCallback((newOrder: string[]) => {
    setScenarios((prev) => {
      const map = new Map(prev.map((s) => [s.id, s]))
      return newOrder.map((id) => map.get(id)!).filter(Boolean)
    })
  }, [])

  // Compute column primary scenario for summary card
  const allRowsHaveSameReference = useMemo(() => {
    const selections = Object.values(referenceSelections)
    if (selections.length === 0 || selections.length !== includedDetails.length) return true
    return selections.every((id) => id === selections[0])
  }, [referenceSelections, includedDetails.length])

  const columnReferenceScenarioId = useMemo(() => {
    if (!allRowsHaveSameReference) return null
    const selections = Object.values(referenceSelections)
    if (selections.length === 0) return scenarios.find((s) => s.isReference)?.id || null
    return selections[0] || null
  }, [allRowsHaveSameReference, referenceSelections, scenarios])

  // Compute fixed delta average for summary card (deterministic seeded values)
  const fixedDeltaAverage = useMemo(() => {
    if (!columnReferenceScenarioId) return null
    const hash = columnReferenceScenarioId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    let sum = 0
    includedDetails.forEach((detail, index) => {
      const seed = index * 7919 + hash
      const frac = (((Math.sin(seed) * 43758.5453) % 1) + 1) % 1
      const scenarioPrice = 2.45 + frac * 0.3 - 0.15
      sum += detail.contractPrice - scenarioPrice
    })
    return includedDetails.length > 0 ? sum / includedDetails.length : 0
  }, [columnReferenceScenarioId, includedDetails])

  // Compute per-group delta breakdown when grouping is active
  const perGroupDeltas = useMemo(() => {
    if (groupingDimension === 'none' || !columnReferenceScenarioId) return null
    const hash = columnReferenceScenarioId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const groups = new Map<string, { sum: number; count: number }>()

    includedDetails.forEach((detail, index) => {
      const key = groupingDimension === 'product-family' ? detail.productGroup : detail.locationRegion
      const seed = index * 7919 + hash
      const frac = (((Math.sin(seed) * 43758.5453) % 1) + 1) % 1
      const scenarioPrice = 2.45 + frac * 0.3 - 0.15
      const delta = detail.contractPrice - scenarioPrice

      if (!groups.has(key)) groups.set(key, { sum: 0, count: 0 })
      const g = groups.get(key)!
      g.sum += delta
      g.count++
    })

    const result: Array<{ label: string; avg: number }> = []
    groups.forEach((v, k) => {
      result.push({ label: k.charAt(0).toUpperCase() + k.slice(1), avg: v.count > 0 ? v.sum / v.count : 0 })
    })
    return result
  }, [groupingDimension, columnReferenceScenarioId, includedDetails])

  // Toggle handler for blended mode — when switching OFF, apply most common reference to all rows
  const handleToggleBlendedMode = useCallback(
    (newBlended: boolean) => {
      if (!newBlended && isBlendedMode) {
        const counts: Record<string, number> = {}
        Object.values(referenceSelections).forEach((sid) => {
          counts[sid] = (counts[sid] || 0) + 1
        })
        const entries = Object.entries(counts)
        if (entries.length > 0) {
          const mostCommon = entries.sort((a, b) => b[1] - a[1])[0][0]
          handleSetColumnReference(mostCommon)
        }
      }
      setIsBlendedMode(newBlended)
    },
    [isBlendedMode, referenceSelections, handleSetColumnReference],
  )

  // Blended summary: volume-weighted avg delta across assigned rows + per-group breakdown
  const blendedSummary = useMemo<BlendedReferenceSummary | null>(() => {
    if (!isBlendedMode) return null

    const assignedDetails = includedDetails.filter((d) => referenceSelections[d.detailId])
    const totalCount = includedDetails.length
    const assignedCount = assignedDetails.length

    if (assignedCount === 0) {
      return {
        weightedAvgDelta: 0,
        assignedCount: 0,
        totalCount,
        coveragePercent: 0,
        groupBreakdowns: [],
      }
    }

    // Volume-weighted avg delta using same seeded price generation as fixedDeltaAverage
    let weightedSum = 0
    let totalVolume = 0
    assignedDetails.forEach((detail) => {
      const refId = referenceSelections[detail.detailId]
      const hash = refId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const detailIndex = includedDetails.indexOf(detail)
      const seed = detailIndex * 7919 + hash
      const frac = (((Math.sin(seed) * 43758.5453) % 1) + 1) % 1
      const scenarioPrice = 2.45 + frac * 0.3 - 0.15
      const delta = detail.contractPrice - scenarioPrice
      weightedSum += delta * detail.volume
      totalVolume += detail.volume
    })

    const weightedAvgDelta = totalVolume > 0 ? weightedSum / totalVolume : 0

    // Per-group breakdown
    const groupBreakdowns: BlendedGroupBreakdown[] = []
    if (groupingDimension !== 'none') {
      const groups = new Map<string, { details: typeof includedDetails; refIds: Set<string> }>()
      includedDetails.forEach((detail) => {
        const key = groupingDimension === 'product-family' ? detail.productGroup : detail.locationRegion
        if (!groups.has(key)) groups.set(key, { details: [], refIds: new Set() })
        const g = groups.get(key)!
        g.details.push(detail)
        const refId = referenceSelections[detail.detailId]
        if (refId) g.refIds.add(refId)
      })

      groups.forEach((g, key) => {
        const assigned = g.details.filter((d) => referenceSelections[d.detailId])
        let sum = 0
        let count = 0
        assigned.forEach((detail) => {
          const refId = referenceSelections[detail.detailId]
          const hash = refId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
          const detailIndex = includedDetails.indexOf(detail)
          const seed = detailIndex * 7919 + hash
          const frac = (((Math.sin(seed) * 43758.5453) % 1) + 1) % 1
          const scenarioPrice = 2.45 + frac * 0.3 - 0.15
          sum += detail.contractPrice - scenarioPrice
          count++
        })

        let referenceLabel = '-- (unassigned)'
        if (g.refIds.size === 1) {
          const refId = [...g.refIds][0]
          referenceLabel = scenarios.find((s) => s.id === refId)?.name || refId
        } else if (g.refIds.size > 1) {
          referenceLabel = 'Mixed'
        }

        groupBreakdowns.push({
          groupKey: key,
          groupLabel: key.charAt(0).toUpperCase() + key.slice(1),
          avgDelta: count > 0 ? sum / count : 0,
          assignedCount: assigned.length,
          totalCount: g.details.length,
          referenceLabel,
        })
      })
    }

    return {
      weightedAvgDelta,
      assignedCount,
      totalCount,
      coveragePercent: Math.round((assignedCount / totalCount) * 100),
      groupBreakdowns,
    }
  }, [isBlendedMode, includedDetails, referenceSelections, groupingDimension, scenarios])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', minHeight: 0 }}>
        {/* Summary Card — uniform mode */}
        {!isBlendedMode && allRowsHaveSameReference && fixedDeltaAverage !== null && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              width: 'fit-content',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Texto
                category="p2"
                appearance="medium"
                weight="600"
                style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                Average Fixed Delta vs Contract
              </Texto>
              <Texto category="h3" weight="700" className={getDeltaColorClass(fixedDeltaAverage)}>
                {fixedDeltaAverage >= 0 ? '+$' : '-$'}
                {Math.abs(fixedDeltaAverage).toFixed(4)}/gal
              </Texto>
              <Texto category="p2" appearance="medium">
                Reference: {scenarios.find((s) => s.id === columnReferenceScenarioId)?.name || 'None'} · Across{' '}
                {includedDetails.length} detail rows
              </Texto>
              {perGroupDeltas && perGroupDeltas.length > 0 && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {perGroupDeltas.map((g) => (
                    <Texto key={g.label} category="p2" className={getDeltaColorClass(g.avg)}>
                      {g.label}: {g.avg >= 0 ? '+$' : '-$'}
                      {Math.abs(g.avg).toFixed(4)}/gal
                    </Texto>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary Card — blended mode */}
        {isBlendedMode && blendedSummary && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              width: 'fit-content',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Texto
                category="p2"
                appearance="medium"
                weight="600"
                style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                Blended Reference Summary
              </Texto>
              {blendedSummary.assignedCount > 0 ? (
                <Texto category="h3" weight="700" className={getDeltaColorClass(blendedSummary.weightedAvgDelta)}>
                  {blendedSummary.weightedAvgDelta >= 0 ? '+$' : '-$'}
                  {Math.abs(blendedSummary.weightedAvgDelta).toFixed(4)}/gal
                </Texto>
              ) : (
                <Texto category="h3" weight="700" appearance="medium">
                  --
                </Texto>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Texto category="p2" appearance="medium">
                  Coverage: {blendedSummary.assignedCount}/{blendedSummary.totalCount} rows (
                  {blendedSummary.coveragePercent}%)
                </Texto>
                {blendedSummary.coveragePercent < 100 && (
                  <WarningFilled style={{ color: '#faad14', fontSize: '14px' }} />
                )}
              </div>
              {blendedSummary.groupBreakdowns.length > 0 && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {blendedSummary.groupBreakdowns.map((g) => (
                    <div key={g.groupKey} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <Texto category="p2" className={getDeltaColorClass(g.avgDelta)}>
                        {g.groupLabel}: {g.assignedCount > 0 ? `${g.avgDelta >= 0 ? '+$' : '-$'}${Math.abs(g.avgDelta).toFixed(4)}/gal` : '--'}
                      </Texto>
                      <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
                        {g.referenceLabel} · {g.assignedCount}/{g.totalCount}
                      </Texto>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Toggle with Parameters link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <Segmented
            size="large"
            options={[
              { label: 'Scenario Comparison', value: 'scenarios' },
              { label: 'Historical Comparison', value: 'historical' },
            ]}
            value={activeView}
            onChange={(value) => setActiveView(value as ViewTab)}
          />
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            onClick={() => setParametersModalVisible(true)}
          >
            <SettingOutlined style={{ fontSize: '14px', color: '#666' }} />
            <Texto category="p2" appearance="medium" style={{ textDecoration: 'underline' }}>
              Parameters
            </Texto>
          </div>
        </div>

        {/* Conditional Content */}
        {activeView === 'scenarios' ? (
          <ScenarioComparisonSection
            scenarios={scenarios}
            includedDetails={includedDetails}
            excludedDetailIds={excludedDetailIds}
            onExcludeDetails={handleExcludeDetails}
            onRestoreDetails={handleRestoreDetails}
            onRestoreAll={handleRestoreAll}
            referenceSelections={referenceSelections}
            onSetReference={handleSetReference}
            onSetColumnReference={handleSetColumnReference}
            onAddScenario={handleAddScenario}
            onUpdateScenario={handleUpdateScenario}
            onReorderScenarios={handleReorderScenarios}
            groupingDimension={groupingDimension}
            onGroupingChange={setGroupingDimension}
            isBlendedMode={isBlendedMode}
            onToggleBlendedMode={handleToggleBlendedMode}
          />
        ) : (
          <HistoricalComparisonSection
            scenarios={scenarios}
            includedDetails={includedDetails}
            aggregation={parameters.price.aggregation}
            method={parameters.price.method}
            onAggregationChange={(value) =>
              setParameters((prev) => ({
                ...prev,
                price: { ...prev.price, aggregation: value },
              }))
            }
          />
        )}
      </div>

      {/* Scenario Drawer */}
      <ScenarioDrawer
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        scenario={editingScenario}
        onSave={handleSaveScenario}
      />

      {/* Parameters Modal */}
      <ParametersModal
        visible={parametersModalVisible}
        parameters={parameters}
        onClose={() => setParametersModalVisible(false)}
        onApply={(newParams) => {
          setParameters(newParams)
          setParametersModalVisible(false)
        }}
      />
    </>
  )
}
