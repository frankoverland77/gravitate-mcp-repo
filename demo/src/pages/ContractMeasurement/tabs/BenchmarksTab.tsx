import { useState, useCallback } from 'react'
import { Horizontal } from '@gravitate-js/excalibrr'
import { BenchmarksSidebar } from '../sections/benchmarks/BenchmarksSidebar'
import { ScenarioComparisonSection } from '../sections/benchmarks/ScenarioComparisonSection'
import { HistoricalComparisonSection } from '../sections/benchmarks'
import { ScenarioDrawer } from '../components/ScenarioDrawer'
import type { Scenario, AnalysisParameters, ScenarioFormData } from '../types/scenario.types'
import { DEFAULT_PARAMETERS, createNewScenario, generateScenarioId } from '../types/scenario.types'

// Initial sample scenarios
const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'scenario-primary',
    name: 'Current Contract',
    products: 'all',
    status: 'complete',
    entryMethod: 'benchmark',
    isPrimary: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'scenario-a',
    name: 'Scenario A - OPIS Contract Low',
    counterparty: 'circle-k',
    products: 'all',
    status: 'complete',
    entryMethod: 'benchmark',
    isPrimary: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function BenchmarksTab() {
  // Scenarios state
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS)

  // Parameters state
  const [parameters, setParameters] = useState<AnalysisParameters>(DEFAULT_PARAMETERS)

  // Primary selections per row (detailId -> scenarioId)
  const [primarySelections, setPrimarySelections] = useState<Record<string, string>>({})

  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingScenario, setEditingScenario] = useState<Scenario | undefined>(undefined)

  // Handle adding a new scenario
  const handleAddScenario = useCallback(() => {
    setEditingScenario(undefined)
    setDrawerVisible(true)
  }, [])

  // Handle editing an existing scenario
  const handleEditScenario = useCallback((scenario: Scenario) => {
    setEditingScenario(scenario)
    setDrawerVisible(true)
  }, [])

  // Handle duplicating a scenario
  const handleDuplicateScenario = useCallback((scenario: Scenario) => {
    const duplicate: Scenario = {
      ...scenario,
      id: generateScenarioId(),
      name: `${scenario.name} (Copy)`,
      isPrimary: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setScenarios((prev) => [...prev, duplicate])
  }, [])

  // Handle deleting a scenario
  const handleDeleteScenario = useCallback((scenarioId: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== scenarioId))
    // Clean up primary selections
    setPrimarySelections((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (next[key] === scenarioId) {
          delete next[key]
        }
      })
      return next
    })
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
          isPrimary: false,
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

  // Handle setting primary for a specific row
  const handleSetPrimary = useCallback((detailId: string, scenarioId: string) => {
    setPrimarySelections((prev) => ({
      ...prev,
      [detailId]: scenarioId,
    }))
  }, [])

  // Handle setting primary for entire column
  const handleSetColumnPrimary = useCallback(
    (scenarioId: string) => {
      // Get all detail IDs from sample data (would come from actual data in real implementation)
      const detailIds = ['DTL-001', 'DTL-002', 'DTL-003', 'DTL-004']
      const newSelections: Record<string, string> = {}
      detailIds.forEach((id) => {
        newSelections[id] = scenarioId
      })
      setPrimarySelections(newSelections)

      // Also update the isPrimary flag on scenarios
      setScenarios((prev) =>
        prev.map((s) => ({
          ...s,
          isPrimary: s.id === scenarioId,
        }))
      )
    },
    []
  )

  return (
    <>
      <Horizontal style={{ gap: '24px', alignItems: 'flex-start' }}>
        {/* Left Sidebar */}
        <BenchmarksSidebar
          scenarios={scenarios}
          parameters={parameters}
          onAddScenario={handleAddScenario}
          onEditScenario={handleEditScenario}
          onDuplicateScenario={handleDuplicateScenario}
          onDeleteScenario={handleDeleteScenario}
          onUpdateParameters={setParameters}
        />

        {/* Right Results Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', minWidth: 0 }}>
          {/* Scenario Comparison Table */}
          <ScenarioComparisonSection
            scenarios={scenarios}
            primarySelections={primarySelections}
            onSetPrimary={handleSetPrimary}
            onSetColumnPrimary={handleSetColumnPrimary}
          />

          {/* Historical Comparison Chart */}
          <HistoricalComparisonSection scenarios={scenarios} />
        </div>
      </Horizontal>

      {/* Scenario Drawer */}
      <ScenarioDrawer visible={drawerVisible} onClose={handleCloseDrawer} scenario={editingScenario} onSave={handleSaveScenario} />
    </>
  )
}
