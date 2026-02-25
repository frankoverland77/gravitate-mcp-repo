import { useState, useMemo } from 'react'
import { GraviGrid, Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import type { TerminalComparisonRow, FittedCurvePoint } from '../data/elasticity.types'
import { MOCK_TERMINAL_COMPARISON, formatPricePosition, getConfidenceBadge } from '../data/elasticity.data'
import { ElasticityCurveChart } from './ElasticityCurveChart'

export function TerminalComparisonView() {
  const [selectedTerminal, setSelectedTerminal] = useState<TerminalComparisonRow | null>(null)

  const columnDefs = useMemo<ColDef<TerminalComparisonRow>[]>(
    () => [
      {
        field: 'terminal',
        headerName: 'Terminal',
        flex: 1,
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams<TerminalComparisonRow>) => (
          <Texto category="p2" weight="500">
            {params.value}
          </Texto>
        ),
      },
      {
        field: 'product',
        headerName: 'Product',
        width: 80,
      },
      {
        field: 'elasticityCoefficient',
        headerName: 'Elasticity',
        width: 95,
        cellRenderer: (params: ICellRendererParams<TerminalComparisonRow>) => {
          if (params.value === null || params.value === undefined) return null
          const abs = Math.abs(params.value)
          const color = abs > 2.5 ? '#ff4d4f' : abs > 1.5 ? '#faad14' : '#52c41a'
          return (
            <Texto category="p2" weight="600" style={{ color }}>
              {params.value.toFixed(2)}
            </Texto>
          )
        },
      },
      {
        field: 'cliffThreshold',
        headerName: 'Cliff',
        width: 80,
        cellRenderer: (params: ICellRendererParams<TerminalComparisonRow>) => (
          <Texto category="p2" appearance="error">
            {formatPricePosition(params.value)}
          </Texto>
        ),
      },
      {
        field: 'optimalPrice',
        headerName: 'Optimal',
        width: 80,
        cellRenderer: (params: ICellRendererParams<TerminalComparisonRow>) => (
          <Texto category="p2" appearance="success">
            {formatPricePosition(params.value)}
          </Texto>
        ),
      },
      {
        field: 'currentPrice',
        headerName: 'Current',
        width: 80,
        cellRenderer: (params: ICellRendererParams<TerminalComparisonRow>) => {
          if (!params.data) return null
          const nearCliff = params.data.currentPrice >= params.data.cliffThreshold - 0.01
          return (
            <Texto category="p2" weight="600" style={{ color: nearCliff ? '#ff4d4f' : undefined }}>
              {formatPricePosition(params.data.currentPrice)}
            </Texto>
          )
        },
      },
      {
        field: 'confidenceLevel',
        headerName: 'Confidence',
        width: 110,
        cellRenderer: (params: ICellRendererParams<TerminalComparisonRow>) => {
          if (!params.data) return null
          const { label, color } = getConfidenceBadge(params.data.confidenceLevel)
          return (
            <Horizontal alignItems="center" style={{ gap: '4px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color }} />
              <Texto category="p2" style={{ color, fontSize: '12px' }}>
                {label}
              </Texto>
            </Horizontal>
          )
        },
      },
      {
        field: 'sparklineData',
        headerName: 'Curve Shape',
        flex: 1,
        minWidth: 140,
        cellRenderer: (params: ICellRendererParams<TerminalComparisonRow>) => {
          if (!params.data || !params.data.sparklineData) return null
          return <SparklineCurve data={params.data.sparklineData} cliffThreshold={params.data.cliffThreshold} currentPrice={params.data.currentPrice} />
        },
      },
    ],
    [],
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: { data: TerminalComparisonRow }) => String(params.data.terminalId),
      rowSelection: 'single' as const,
      onSelectionChanged: (event: { api: { getSelectedRows: () => TerminalComparisonRow[] } }) => {
        const selected = event.api.getSelectedRows()
        setSelectedTerminal(selected.length > 0 ? selected[0] : null)
      },
      rowHeight: 48,
    }),
    [],
  )

  return (
    <Vertical height="100%" style={{ gap: '12px' }}>
      {/* Header */}
      <Horizontal justifyContent="space-between" alignItems="center" style={{ padding: '0 4px' }}>
        <Vertical style={{ gap: '2px' }}>
          <Texto category="h5" weight="600">
            Cross-Terminal Elasticity Comparison
          </Texto>
          <Texto category="p2" appearance="medium">
            Compare pricing power and sensitivity across terminals for ULSD
          </Texto>
        </Vertical>
      </Horizontal>

      {/* Grid */}
      <Vertical flex={selectedTerminal ? '1' : '1'} style={{ minHeight: selectedTerminal ? '200px' : '300px' }}>
        <GraviGrid
          storageKey="terminal-comparison-grid"
          columnDefs={columnDefs}
          rowData={MOCK_TERMINAL_COMPARISON}
          agPropOverrides={agPropOverrides}
          controlBarProps={{ title: 'Terminals', hideActiveFilters: false }}
        />
      </Vertical>

      {/* Detail curve for selected terminal */}
      {selectedTerminal && (
        <Vertical style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
          <ElasticityCurveChart
            curveParams={{
              elasticityCoefficient: selectedTerminal.elasticityCoefficient,
              rSquared: selectedTerminal.rSquared,
              cliffThreshold: selectedTerminal.cliffThreshold,
              optimalPricePoint: selectedTerminal.optimalPrice,
              sampleSize: selectedTerminal.sampleSize,
              calculationDate: '2026-02-20',
              observationPeriodStart: '2025-02-01',
              observationPeriodEnd: '2026-02-15',
              confidenceLevel: selectedTerminal.confidenceLevel,
            }}
            currentPricePosition={selectedTerminal.currentPrice}
            title={`${selectedTerminal.terminal} - ${selectedTerminal.product}`}
            subtitle="Full elasticity curve with confidence bands"
            seedOffset={selectedTerminal.terminalId * 200}
            height="300px"
          />
        </Vertical>
      )}
    </Vertical>
  )
}

// ============================================================================
// SPARKLINE COMPONENT
// ============================================================================

function SparklineCurve({
  data,
  cliffThreshold,
  currentPrice,
}: {
  data: FittedCurvePoint[]
  cliffThreshold: number
  currentPrice: number
}) {
  const width = 120
  const height = 32
  const padding = 2

  const xMin = data[0]?.pricePosition ?? -0.15
  const xMax = data[data.length - 1]?.pricePosition ?? 0.15
  const yMin = 0
  const yMax = 100

  const scaleX = (v: number) => padding + ((v - xMin) / (xMax - xMin)) * (width - padding * 2)
  const scaleY = (v: number) => height - padding - ((v - yMin) / (yMax - yMin)) * (height - padding * 2)

  const path = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.pricePosition)},${scaleY(p.fittedVolume)}`).join(' ')

  const cliffX = scaleX(cliffThreshold)
  const currentX = scaleX(currentPrice)

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {/* Zone backgrounds */}
      <rect x={padding} y={padding} width={Math.max(0, cliffX - padding)} height={height - padding * 2} fill="#52c41a" opacity={0.08} />
      <rect x={cliffX} y={padding} width={Math.max(0, width - padding - cliffX)} height={height - padding * 2} fill="#ff4d4f" opacity={0.08} />

      {/* Fitted curve */}
      <path d={path} fill="none" stroke="#1890ff" strokeWidth={1.5} />

      {/* Cliff line */}
      <line x1={cliffX} y1={padding} x2={cliffX} y2={height - padding} stroke="#ff4d4f" strokeWidth={1} strokeDasharray="2,2" />

      {/* Current price marker */}
      <line x1={currentX} y1={padding} x2={currentX} y2={height - padding} stroke="var(--theme-color-1, #0C5A58)" strokeWidth={1.5} />
    </svg>
  )
}
