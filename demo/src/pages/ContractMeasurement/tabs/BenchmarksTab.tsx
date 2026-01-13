import { useState, useCallback } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Segmented } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { ScenarioComparisonSection } from '../sections/benchmarks/ScenarioComparisonSection'
import { HistoricalComparisonSection } from '../sections/benchmarks'
import { ScenarioDrawer } from '../components/ScenarioDrawer'
import { ParametersModal } from '../components/ParametersModal'
import type { Scenario, AnalysisParameters, ScenarioFormData } from '../types/scenario.types'
import { DEFAULT_PARAMETERS, generateScenarioId } from '../types/scenario.types'

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

type ViewTab = 'scenarios' | 'historical'

export function BenchmarksTab() {
  // View tab state
  const [activeView, setActiveView] = useState<ViewTab>('scenarios')

  // Scenarios state
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS)

  // Parameters state
  const [parameters, setParameters] = useState<AnalysisParameters>(DEFAULT_PARAMETERS)

  // Primary selections per row (detailId -> scenarioId)
  const [primarySelections, setPrimarySelections] = useState<Record<string, string>>({})

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
  const handleSetColumnPrimary = useCallback((scenarioId: string) => {
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
  }, [])

  return (
    <>
      <Vertical style={{ gap: '24px' }}>
        {/* View Toggle with Parameters link */}
        <Horizontal justifyContent="space-between" alignItems="center">
          <Segmented
            size="large"
            options={[
              { label: 'Scenario Comparison', value: 'scenarios' },
              { label: 'Historical Comparison', value: 'historical' },
            ]}
            value={activeView}
            onChange={(value) => setActiveView(value as ViewTab)}
          />
          <Horizontal
            alignItems="center"
            style={{ gap: '6px', cursor: 'pointer' }}
            onClick={() => setParametersModalVisible(true)}
          >
            <SettingOutlined style={{ fontSize: '14px', color: '#666' }} />
            <Texto category="p2" appearance="medium" style={{ textDecoration: 'underline' }}>
              Parameters
            </Texto>
          </Horizontal>
        </Horizontal>

        {/* Conditional Content */}
        {activeView === 'scenarios' ? (
          <ScenarioComparisonSection
            scenarios={scenarios}
            primarySelections={primarySelections}
            onSetPrimary={handleSetPrimary}
            onSetColumnPrimary={handleSetColumnPrimary}
            onAddScenario={handleAddScenario}
            onUpdateScenario={handleUpdateScenario}
          />
        ) : (
          <HistoricalComparisonSection scenarios={scenarios} />
        )}
      </Vertical>

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
