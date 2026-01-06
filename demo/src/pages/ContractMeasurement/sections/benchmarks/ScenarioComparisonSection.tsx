import { useState, useMemo } from 'react'
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { CheckSquareOutlined, BorderOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import { Table, Checkbox, Tooltip } from 'antd'
import type { Scenario, ComparisonRowData, ScenarioCellData } from '../../types/scenario.types'

interface ScenarioComparisonSectionProps {
  scenarios: Scenario[]
  primarySelections: Record<string, string> // detailId -> scenarioId
  onSetPrimary: (detailId: string, scenarioId: string) => void
  onSetColumnPrimary: (scenarioId: string) => void
}

// Sample data for the comparison table
const SAMPLE_DETAILS = [
  { detailId: 'DTL-001', product: '87 Gas', location: 'Houston Terminal', volume: 120000, percentTotal: 25.8 },
  { detailId: 'DTL-002', product: '89 Gas', location: 'Houston Terminal', volume: 160000, percentTotal: 34.4 },
  { detailId: 'DTL-003', product: 'Diesel #2', location: 'Tulsa Terminal', volume: 85000, percentTotal: 18.3 },
  { detailId: 'DTL-004', product: 'Jet Fuel', location: 'Dallas Terminal', volume: 100000, percentTotal: 21.5 },
]

// Generate sample scenario cell data
const generateScenarioCellData = (scenarioId: string, isPrimary: boolean, detailIndex: number): ScenarioCellData => {
  const basePrice = 2.45 + Math.random() * 0.3 - 0.15
  const primaryPrice = 2.45
  const delta = isPrimary ? undefined : basePrice - primaryPrice
  const allocation = SAMPLE_DETAILS[detailIndex].volume
  const rateability = 85 + Math.random() * 25

  return {
    scenarioId,
    price: basePrice,
    delta: delta,
    deltaPercent: delta ? (delta / primaryPrice) * 100 : undefined,
    formulaRef: isPrimary ? 'OPIS Houston Rack + $0.03' : `OPIS Contract ${scenarioId.includes('A') ? 'Low' : 'High'}`,
    allocation,
    rateability,
    rateabilityStatus: rateability >= 90 ? 'on-track' : rateability >= 80 ? 'at-risk' : 'below-min',
    impact: delta ? Math.round(delta * allocation) : undefined,
    isPrimary,
  }
}

export function ScenarioComparisonSection({ scenarios, primarySelections, onSetPrimary, onSetColumnPrimary }: ScenarioComparisonSectionProps) {
  const [isPrimaryMode, setIsPrimaryMode] = useState(false)

  // Build comparison data
  const comparisonData = useMemo(() => {
    return SAMPLE_DETAILS.map((detail, index) => {
      const scenarioData: Record<string, ScenarioCellData> = {}

      // Always add a "primary" column (first scenario or designated primary)
      const primaryScenarioId = primarySelections[detail.detailId] || scenarios[0]?.id || 'primary'

      scenarios.forEach((scenario) => {
        const isPrimaryForRow = primarySelections[detail.detailId] === scenario.id || (!primarySelections[detail.detailId] && scenario.isPrimary)
        scenarioData[scenario.id] = generateScenarioCellData(scenario.id, isPrimaryForRow, index)
      })

      return {
        ...detail,
        scenarios: scenarioData,
      } as ComparisonRowData
    })
  }, [scenarios, primarySelections])

  // Calculate totals
  const totals = useMemo(() => {
    const result: Record<string, { volume: number; impact: number }> = {}

    scenarios.forEach((scenario) => {
      let totalVolume = 0
      let totalImpact = 0

      comparisonData.forEach((row) => {
        const cellData = row.scenarios[scenario.id]
        if (cellData) {
          totalVolume += cellData.allocation
          totalImpact += cellData.impact || 0
        }
      })

      result[scenario.id] = { volume: totalVolume, impact: totalImpact }
    })

    return result
  }, [scenarios, comparisonData])

  // Get status color
  const getStatusColor = (status: ScenarioCellData['rateabilityStatus']) => {
    switch (status) {
      case 'on-track':
        return '#51b073'
      case 'at-risk':
        return '#faad14'
      case 'below-min':
        return '#ff4d4f'
      default:
        return '#8c8c8c'
    }
  }

  // Get delta color
  const getDeltaColor = (delta: number | undefined) => {
    if (delta === undefined) return '#8c8c8c'
    if (delta < 0) return '#51b073' // Negative delta = lower price = good
    if (delta > 0) return '#ff4d4f' // Positive delta = higher price = bad
    return '#8c8c8c'
  }

  // Render cell content
  const renderScenarioCell = (record: ComparisonRowData, scenario: Scenario) => {
    const cellData = record.scenarios[scenario.id]
    if (!cellData) return null

    const isPrimaryForRow = primarySelections[record.detailId] === scenario.id || (!primarySelections[record.detailId] && scenario.isPrimary)

    return (
      <div
        style={{
          padding: '8px',
          backgroundColor: isPrimaryForRow ? 'rgba(81, 176, 115, 0.08)' : 'transparent',
          borderRadius: '4px',
          position: 'relative',
        }}
      >
        {isPrimaryMode && (
          <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
            <Checkbox checked={isPrimaryForRow} onChange={() => onSetPrimary(record.detailId, scenario.id)} />
          </div>
        )}

        <Vertical style={{ gap: '4px' }}>
          {/* Price */}
          <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
            <Texto weight='600'>${cellData.price.toFixed(2)}/gal</Texto>
            {isPrimaryForRow && <StarFilled style={{ color: '#51b073', fontSize: '12px' }} />}
          </Horizontal>

          {/* Delta (if not primary) */}
          {!isPrimaryForRow && cellData.delta !== undefined && (
            <Texto category='p2' style={{ color: getDeltaColor(cellData.delta) }}>
              Δ {cellData.delta >= 0 ? '+' : ''}
              {cellData.delta.toFixed(2)} ({cellData.deltaPercent?.toFixed(1)}%)
            </Texto>
          )}

          {/* Formula reference */}
          <Texto category='p2' appearance='medium' style={{ fontSize: '11px' }}>
            {cellData.formulaRef}
          </Texto>

          {/* Volume & Rateability */}
          <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
            <Texto category='p2' appearance='medium' style={{ fontSize: '11px' }}>
              {(cellData.allocation / 1000).toFixed(0)}K gal
            </Texto>
            <Tooltip title={`Rateability: ${cellData.rateability.toFixed(0)}%`}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  backgroundColor: getStatusColor(cellData.rateabilityStatus) + '20',
                  color: getStatusColor(cellData.rateabilityStatus),
                  textTransform: 'uppercase',
                }}
              >
                {cellData.rateabilityStatus.replace('-', ' ')}
              </span>
            </Tooltip>
          </Horizontal>

          {/* Financial Impact */}
          {!isPrimaryForRow && cellData.impact !== undefined && (
            <Texto category='p2' weight='600' style={{ color: getDeltaColor(cellData.impact) }}>
              Impact: {cellData.impact >= 0 ? '+' : ''}${(cellData.impact / 1000).toFixed(1)}K
            </Texto>
          )}
        </Vertical>
      </div>
    )
  }

  // Build columns
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'DETAIL',
        dataIndex: 'product',
        key: 'detail',
        width: 180,
        fixed: 'left' as const,
        render: (_: any, record: ComparisonRowData) => (
          <Vertical style={{ gap: '2px' }}>
            <Texto weight='600'>{record.product}</Texto>
            <Texto category='p2' appearance='medium'>
              {record.location}
            </Texto>
          </Vertical>
        ),
      },
      {
        title: 'VOLUME',
        dataIndex: 'volume',
        key: 'volume',
        width: 100,
        render: (_: any, record: ComparisonRowData) => (
          <Vertical style={{ gap: '2px' }}>
            <Texto>{(record.volume / 1000).toFixed(0)}K gal</Texto>
            <Texto category='p2' appearance='medium'>
              {record.percentTotal.toFixed(1)}%
            </Texto>
          </Vertical>
        ),
      },
    ]

    // Add scenario columns
    const scenarioColumns = scenarios.map((scenario) => ({
      title: (
        <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
          {isPrimaryMode && (
            <Checkbox
              checked={Object.values(primarySelections).every((id) => id === scenario.id) && Object.keys(primarySelections).length === SAMPLE_DETAILS.length}
              indeterminate={Object.values(primarySelections).some((id) => id === scenario.id) && !Object.values(primarySelections).every((id) => id === scenario.id)}
              onChange={() => onSetColumnPrimary(scenario.id)}
            />
          )}
          <span>{scenario.name}</span>
          {scenario.isPrimary && <StarFilled style={{ color: '#51b073', fontSize: '12px' }} />}
        </Horizontal>
      ),
      dataIndex: scenario.id,
      key: scenario.id,
      width: 200,
      render: (_: any, record: ComparisonRowData) => renderScenarioCell(record, scenario),
    }))

    return [...baseColumns, ...scenarioColumns]
  }, [scenarios, primarySelections, isPrimaryMode])

  // Summary row
  const summaryRow = () => (
    <Table.Summary fixed>
      <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
        <Table.Summary.Cell index={0}>
          <Texto weight='600'>TOTAL</Texto>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1}>
          <Texto weight='600'>{(SAMPLE_DETAILS.reduce((sum, d) => sum + d.volume, 0) / 1000).toFixed(0)}K gal</Texto>
        </Table.Summary.Cell>
        {scenarios.map((scenario, index) => (
          <Table.Summary.Cell key={scenario.id} index={index + 2}>
            <Vertical style={{ gap: '4px' }}>
              <Texto weight='600'>{(totals[scenario.id]?.volume / 1000).toFixed(0)}K gal</Texto>
              {totals[scenario.id]?.impact !== 0 && (
                <Texto weight='600' style={{ color: getDeltaColor(totals[scenario.id]?.impact) }}>
                  {totals[scenario.id]?.impact >= 0 ? '+' : ''}${(totals[scenario.id]?.impact / 1000).toFixed(1)}K
                </Texto>
              )}
            </Vertical>
          </Table.Summary.Cell>
        ))}
      </Table.Summary.Row>
    </Table.Summary>
  )

  if (scenarios.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <Vertical style={{ alignItems: 'center', gap: '16px' }}>
          <StarOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
          <Texto category='h4'>No Scenarios</Texto>
          <Texto appearance='medium'>Add a scenario from the sidebar to start comparing pricing options.</Texto>
        </Vertical>
      </div>
    )
  }

  return (
    <Vertical style={{ gap: '16px' }}>
      {/* Header */}
      <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Texto category='h4' weight='600'>
            Scenario Comparison
          </Texto>
          <Texto category='p2' appearance='medium'>
            Compare pricing scenarios across all product details
          </Texto>
        </div>
        <Horizontal style={{ gap: '12px' }}>
          <GraviButton
            buttonText={isPrimaryMode ? 'Done' : 'Set Primary'}
            icon={isPrimaryMode ? <CheckSquareOutlined /> : <BorderOutlined />}
            appearance={isPrimaryMode ? 'success' : 'outlined'}
            onClick={() => setIsPrimaryMode(!isPrimaryMode)}
          />
          <GraviButton buttonText='Export Results' appearance='outlined' />
        </Horizontal>
      </Horizontal>

      {isPrimaryMode && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#e6f4ff',
            border: '1px solid #91caff',
            borderRadius: '8px',
          }}
        >
          <Texto category='p2'>
            <strong>Primary Selection Mode:</strong> Click cells or column headers to set which scenario is the primary reference for each row. Deltas and
            impacts will be calculated relative to the primary.
          </Texto>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Table
          columns={columns}
          dataSource={comparisonData}
          rowKey='detailId'
          pagination={false}
          scroll={{ x: 'max-content' }}
          summary={summaryRow}
          size='small'
        />
      </div>
    </Vertical>
  )
}
