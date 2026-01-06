import { useState } from 'react'
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { DownOutlined, RightOutlined, EditOutlined, CopyOutlined, DeleteOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Tag, Select, Popconfirm } from 'antd'
import type { Scenario, AnalysisParameters } from '../../types/scenario.types'
import { DEFAULT_PARAMETERS } from '../../types/scenario.types'

interface BenchmarksSidebarProps {
  scenarios: Scenario[]
  parameters: AnalysisParameters
  onAddScenario: () => void
  onEditScenario: (scenario: Scenario) => void
  onDuplicateScenario: (scenario: Scenario) => void
  onDeleteScenario: (scenarioId: string) => void
  onUpdateParameters: (params: AnalysisParameters) => void
}

export function BenchmarksSidebar({
  scenarios,
  parameters,
  onAddScenario,
  onEditScenario,
  onDuplicateScenario,
  onDeleteScenario,
  onUpdateParameters,
}: BenchmarksSidebarProps) {
  // Section expansion state
  const [parametersExpanded, setParametersExpanded] = useState(true)
  const [scenariosExpanded, setScenariosExpanded] = useState(true)
  const [parametersEditMode, setParametersEditMode] = useState(false)

  // Scenario card expansion state
  const [expandedScenarioIds, setExpandedScenarioIds] = useState<Set<string>>(new Set())

  const toggleScenarioExpansion = (scenarioId: string) => {
    setExpandedScenarioIds((prev) => {
      const next = new Set(prev)
      if (next.has(scenarioId)) {
        next.delete(scenarioId)
      } else {
        next.add(scenarioId)
      }
      return next
    })
  }

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    padding: '16px',
  }

  const sectionHeaderStyle = {
    cursor: 'pointer',
    padding: '12px 0',
  }

  // Format parameters for display
  const formatPriceParams = () => {
    return `${parameters.price.lookback}, ${parameters.price.aggregation.charAt(0).toUpperCase() + parameters.price.aggregation.slice(1)}, ${parameters.price.method === 'weighted' ? 'Weighted Avg' : parameters.price.method === 'simple' ? 'Simple Avg' : 'Median'}`
  }

  const formatVolumeParams = () => {
    return `${parameters.volume.lookback}, ${parameters.volume.granularity.charAt(0).toUpperCase() + parameters.volume.granularity.slice(1)}, ${parameters.volume.calculation === 'sum' ? 'Sum' : 'Average'}`
  }

  const getProductsLabel = (products: Scenario['products']) => {
    switch (products) {
      case 'all':
        return 'All (47)'
      case 'gasoline':
        return 'Gasoline (32)'
      case 'diesel':
        return 'Diesel (12)'
      case 'jet':
        return 'Jet Fuel (3)'
      case 'custom':
        return 'Custom'
      default:
        return products
    }
  }

  return (
    <div
      style={{
        width: '300px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'sticky',
        top: '20px',
        alignSelf: 'flex-start',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
      }}
    >
      {/* Parameters Section */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle} onClick={() => setParametersExpanded(!parametersExpanded)}>
          <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
              {parametersExpanded ? <DownOutlined style={{ fontSize: '10px' }} /> : <RightOutlined style={{ fontSize: '10px' }} />}
              <Texto weight='600' style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '12px' }}>
                Parameters
              </Texto>
            </Horizontal>
            <SettingOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
          </Horizontal>
        </div>

        {parametersExpanded && (
          <Vertical style={{ gap: '12px', marginTop: '8px' }}>
            {!parametersEditMode ? (
              // Summary View
              <>
                <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Vertical style={{ gap: '8px' }}>
                    <Horizontal style={{ gap: '8px' }}>
                      <Texto category='p2' appearance='medium' style={{ minWidth: '50px' }}>
                        Price:
                      </Texto>
                      <Texto category='p2'>{formatPriceParams()}</Texto>
                    </Horizontal>
                    <Horizontal style={{ gap: '8px' }}>
                      <Texto category='p2' appearance='medium' style={{ minWidth: '50px' }}>
                        Volume:
                      </Texto>
                      <Texto category='p2'>{formatVolumeParams()}</Texto>
                    </Horizontal>
                  </Vertical>
                </Horizontal>
                <GraviButton buttonText='Edit' icon={<EditOutlined />} appearance='outlined' onClick={() => setParametersEditMode(true)} />
              </>
            ) : (
              // Edit Mode
              <Vertical style={{ gap: '16px' }}>
                {/* Price History */}
                <Vertical style={{ gap: '8px' }}>
                  <Texto category='p2' weight='600'>
                    Price History
                  </Texto>
                  <Horizontal style={{ gap: '8px', flexWrap: 'wrap' }}>
                    <Select
                      size='small'
                      value={parameters.price.lookback}
                      onChange={(val) => onUpdateParameters({ ...parameters, price: { ...parameters.price, lookback: val } })}
                      options={[
                        { value: '6mo', label: '6mo' },
                        { value: '12mo', label: '12mo' },
                        { value: '18mo', label: '18mo' },
                        { value: '24mo', label: '24mo' },
                      ]}
                      style={{ width: '70px' }}
                    />
                    <Select
                      size='small'
                      value={parameters.price.aggregation}
                      onChange={(val) => onUpdateParameters({ ...parameters, price: { ...parameters.price, aggregation: val } })}
                      options={[
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'quarterly', label: 'Quarterly' },
                      ]}
                      style={{ width: '90px' }}
                    />
                    <Select
                      size='small'
                      value={parameters.price.method}
                      onChange={(val) => onUpdateParameters({ ...parameters, price: { ...parameters.price, method: val } })}
                      options={[
                        { value: 'weighted', label: 'Weighted' },
                        { value: 'simple', label: 'Simple' },
                        { value: 'median', label: 'Median' },
                      ]}
                      style={{ width: '90px' }}
                    />
                  </Horizontal>
                </Vertical>

                {/* Volume History */}
                <Vertical style={{ gap: '8px' }}>
                  <Texto category='p2' weight='600'>
                    Volume History
                  </Texto>
                  <Horizontal style={{ gap: '8px', flexWrap: 'wrap' }}>
                    <Select
                      size='small'
                      value={parameters.volume.lookback}
                      onChange={(val) => onUpdateParameters({ ...parameters, volume: { ...parameters.volume, lookback: val } })}
                      options={[
                        { value: '6mo', label: '6mo' },
                        { value: '12mo', label: '12mo' },
                        { value: '18mo', label: '18mo' },
                        { value: '24mo', label: '24mo' },
                      ]}
                      style={{ width: '70px' }}
                    />
                    <Select
                      size='small'
                      value={parameters.volume.granularity}
                      onChange={(val) => onUpdateParameters({ ...parameters, volume: { ...parameters.volume, granularity: val } })}
                      options={[
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'quarterly', label: 'Quarterly' },
                      ]}
                      style={{ width: '90px' }}
                    />
                    <Select
                      size='small'
                      value={parameters.volume.calculation}
                      onChange={(val) => onUpdateParameters({ ...parameters, volume: { ...parameters.volume, calculation: val } })}
                      options={[
                        { value: 'sum', label: 'Sum' },
                        { value: 'average', label: 'Average' },
                      ]}
                      style={{ width: '80px' }}
                    />
                  </Horizontal>
                </Vertical>

                <GraviButton buttonText='Done' success onClick={() => setParametersEditMode(false)} />
              </Vertical>
            )}
          </Vertical>
        )}
      </div>

      {/* Scenarios Section */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle} onClick={() => setScenariosExpanded(!scenariosExpanded)}>
          <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
              {scenariosExpanded ? <DownOutlined style={{ fontSize: '10px' }} /> : <RightOutlined style={{ fontSize: '10px' }} />}
              <Texto weight='600' style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '12px' }}>
                Scenarios
              </Texto>
              <Tag color='default' style={{ marginLeft: '4px' }}>
                {scenarios.length}
              </Tag>
            </Horizontal>
          </Horizontal>
        </div>

        {scenariosExpanded && (
          <Vertical style={{ gap: '12px', marginTop: '8px' }}>
            {/* Scenario Cards */}
            {scenarios.map((scenario) => {
              const isExpanded = expandedScenarioIds.has(scenario.id)
              return (
                <div
                  key={scenario.id}
                  style={{
                    border: scenario.isPrimary ? '2px solid #51b073' : '1px solid #e8e8e8',
                    borderRadius: '8px',
                    padding: '12px',
                    backgroundColor: scenario.isPrimary ? 'rgba(81, 176, 115, 0.05)' : '#fafafa',
                  }}
                >
                  <div style={{ cursor: 'pointer' }} onClick={() => toggleScenarioExpansion(scenario.id)}>
                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                        {isExpanded ? <DownOutlined style={{ fontSize: '10px' }} /> : <RightOutlined style={{ fontSize: '10px' }} />}
                        <Texto weight='600' style={{ fontSize: '13px' }}>
                          {scenario.name}
                        </Texto>
                        {scenario.isPrimary && (
                          <Tag color='green' style={{ marginLeft: '4px', fontSize: '10px' }}>
                            PRIMARY
                          </Tag>
                        )}
                      </Horizontal>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: scenario.status === 'complete' ? '#51b073' : '#8c8c8c',
                        }}
                      />
                    </Horizontal>
                  </div>

                  {isExpanded && (
                    <Vertical style={{ marginTop: '12px', gap: '8px' }}>
                      <Texto category='p2' appearance='medium'>
                        Products: {getProductsLabel(scenario.products)}
                      </Texto>
                      <Texto category='p2' appearance='medium'>
                        Entry: {scenario.entryMethod === 'benchmark' ? 'Benchmark' : 'Formula'}
                      </Texto>
                      {scenario.counterparty && (
                        <Texto category='p2' appearance='medium'>
                          Counterparty: {scenario.counterparty}
                        </Texto>
                      )}

                      <Horizontal style={{ gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <GraviButton buttonText='Edit' icon={<EditOutlined />} appearance='outlined' onClick={() => onEditScenario(scenario)} />
                        <GraviButton buttonText='Duplicate' icon={<CopyOutlined />} appearance='outlined' onClick={() => onDuplicateScenario(scenario)} />
                        <Popconfirm
                          title='Delete Scenario'
                          description='Are you sure you want to delete this scenario?'
                          onConfirm={() => onDeleteScenario(scenario.id)}
                          okText='Delete'
                          cancelText='Cancel'
                          okButtonProps={{ danger: true }}
                        >
                          <GraviButton buttonText='Delete' icon={<DeleteOutlined />} appearance='outlined' />
                        </Popconfirm>
                      </Horizontal>
                    </Vertical>
                  )}
                </div>
              )
            })}

            {/* Add Scenario Button */}
            <GraviButton buttonText='Add Scenario' icon={<PlusOutlined />} success onClick={onAddScenario} />
          </Vertical>
        )}
      </div>
    </div>
  )
}
