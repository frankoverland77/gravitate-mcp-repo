import { useState, useMemo } from 'react'
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  ComposedChart,
  Line,
  ReferenceLine,
} from 'recharts'
import { Select, Tag, Empty, Segmented } from 'antd'
import { CopyOutlined, DownloadOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import type {
  RoundBidData,
  HistoricalMetric,
  Supplier,
  TerminalHistoryData,
  TerminalHistoryPeriod,
  TerminalHistoryDataPoint,
} from '../rfp.types'
import { TERMINAL_HISTORY_PERIOD_OPTIONS } from '../rfp.types'
import { getTerminalHistoryByPeriod } from '../rfp.data'
import styles from './HistoricalRFPSection.module.css'

// ============================================================================
// CHART COLORS
// ============================================================================

const chartColors = {
  r1: '#bfbfbf', // Gray for Round 1
  r2: '#51b073', // Green for Round 2
  incumbent: '#1890ff', // Blue for incumbent badge
  // Terminal history colors
  contractPrice: '#1890ff', // Blue for contract price
  rackAverage: '#51b073', // Green for rack average (PRIMARY)
  spotPrice: '#ff4d4f', // Red for spot price
  volume: 'rgba(24, 144, 255, 0.3)', // Light blue for volume bars
  rfpReference: '#722ed1', // Purple for RFP reference line
  avgReference: '#faad14', // Orange for historical average
}

// ============================================================================
// TYPES
// ============================================================================

interface HistoricalRFPSectionProps {
  suppliers: Supplier[]
  round: number // Now supports any round number
  historicalData: RoundBidData[]
  terminalHistory?: TerminalHistoryData
  onExport?: () => void
}

interface ChartDataPoint {
  name: string
  supplierId: string
  isIncumbent: boolean
  r1Value: number
  r2Value: number | null
  priceChange: number | null
  hasR2: boolean
}

type HistoricalViewMode = 'bids' | 'terminal'
type TerminalViewMode = 'prices' | 'difference'

interface SeriesVisibility {
  contractPrice: boolean
  rackAverage: boolean
  spotPrice: boolean
  volume: boolean
}

// ============================================================================
// BID HISTORY TOOLTIP
// ============================================================================

interface BidTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    color: string
    name: string
    payload: ChartDataPoint
  }>
  viewMetric: HistoricalMetric
}

function BidHistoryTooltip({ active, payload, viewMetric }: BidTooltipProps) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload
  const isPrice = viewMetric === 'price'

  const formatValue = (value: number | null) => {
    if (value === null) return 'Pending'
    return isPrice ? `$${value.toFixed(2)}` : `${(value / 1000000).toFixed(1)}M gal`
  }

  return (
    <Vertical className={styles.tooltip}>
      <Horizontal gap={8} alignItems='center'>
        <Texto category='p2' weight='600'>
          {data.name}
        </Texto>
        {data.isIncumbent && (
          <Tag color='blue' style={{ margin: 0 }}>
            INCUMBENT
          </Tag>
        )}
      </Horizontal>

      <Horizontal justifyContent='space-between' style={{ marginTop: '8px' }}>
        <Horizontal gap={6} alignItems='center'>
          <div className={styles.legendDot} style={{ backgroundColor: chartColors.r1 }} />
          <Texto category='p2' appearance='medium'>
            Round 1:
          </Texto>
        </Horizontal>
        <Texto category='p2'>{formatValue(data.r1Value)}</Texto>
      </Horizontal>

      <Horizontal justifyContent='space-between' style={{ marginTop: '4px' }}>
        <Horizontal gap={6} alignItems='center'>
          <div className={styles.legendDot} style={{ backgroundColor: chartColors.r2 }} />
          <Texto category='p2' appearance='medium'>
            Round 2:
          </Texto>
        </Horizontal>
        <Texto category='p2'>{formatValue(data.r2Value)}</Texto>
      </Horizontal>

      {isPrice && data.priceChange !== null && (
        <Horizontal
          justifyContent='space-between'
          style={{ marginTop: '8px', borderTop: '1px solid #f0f0f0', paddingTop: '8px' }}
        >
          <Texto category='p2' appearance='medium'>
            Change:
          </Texto>
          <Texto category='p2' appearance={data.priceChange < 0 ? 'success' : 'error'} weight='600'>
            {data.priceChange < 0 ? '' : '+'}${data.priceChange.toFixed(2)}
          </Texto>
        </Horizontal>
      )}
    </Vertical>
  )
}

// ============================================================================
// TERMINAL HISTORY TOOLTIP
// ============================================================================

interface TerminalTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    color: string
    name: string
    payload: TerminalHistoryDataPoint
  }>
  viewMode: TerminalViewMode
}

function TerminalHistoryTooltip({ active, payload, viewMode }: TerminalTooltipProps) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload

  if (viewMode === 'prices') {
    return (
      <Vertical className={styles.tooltip}>
        <Texto category='p2' weight='600' style={{ marginBottom: '8px' }}>
          {data.dateLabel}
        </Texto>

        <Horizontal justifyContent='space-between' style={{ marginBottom: '4px' }}>
          <Horizontal gap={6} alignItems='center'>
            <div className={styles.legendDot} style={{ backgroundColor: chartColors.contractPrice }} />
            <Texto category='p2' appearance='medium'>
              Contract:
            </Texto>
          </Horizontal>
          <Texto category='p2'>${data.contractPrice.toFixed(2)}</Texto>
        </Horizontal>

        <Horizontal justifyContent='space-between' style={{ marginBottom: '4px' }}>
          <Horizontal gap={6} alignItems='center'>
            <div className={styles.legendDot} style={{ backgroundColor: chartColors.rackAverage }} />
            <Texto category='p2' appearance='medium'>
              Rack Avg:
            </Texto>
          </Horizontal>
          <Texto category='p2'>${data.rackAverage.toFixed(2)}</Texto>
        </Horizontal>

        <Horizontal justifyContent='space-between' style={{ marginBottom: '4px' }}>
          <Horizontal gap={6} alignItems='center'>
            <div className={styles.legendDot} style={{ backgroundColor: chartColors.spotPrice }} />
            <Texto category='p2' appearance='medium'>
              Spot:
            </Texto>
          </Horizontal>
          <Texto category='p2'>${data.spotPrice.toFixed(2)}</Texto>
        </Horizontal>

        <Horizontal
          justifyContent='space-between'
          style={{ marginTop: '8px', borderTop: '1px solid #f0f0f0', paddingTop: '8px' }}
        >
          <Horizontal gap={6} alignItems='center'>
            <div className={styles.legendDot} style={{ backgroundColor: chartColors.volume }} />
            <Texto category='p2' appearance='medium'>
              Volume:
            </Texto>
          </Horizontal>
          <Texto category='p2'>{(data.volume / 1000).toFixed(0)}K gal</Texto>
        </Horizontal>
      </Vertical>
    )
  }

  // Difference view tooltip
  return (
    <Vertical className={styles.tooltip}>
      <Texto category='p2' weight='600' style={{ marginBottom: '8px' }}>
        {data.dateLabel}
      </Texto>

      <Horizontal justifyContent='space-between' style={{ marginBottom: '4px' }}>
        <Texto category='p2' appearance='medium'>
          vs Rack Avg:
        </Texto>
        <Texto category='p2' appearance={data.rackAvgDiff < 0 ? 'success' : 'error'} weight='600'>
          {data.rackAvgDiff < 0 ? '' : '+'}${data.rackAvgDiff.toFixed(3)}
        </Texto>
      </Horizontal>

      <Horizontal justifyContent='space-between'>
        <Texto category='p2' appearance='medium'>
          vs Spot:
        </Texto>
        <Texto category='p2' appearance={data.spotDiff < 0 ? 'success' : 'error'} weight='600'>
          {data.spotDiff < 0 ? '' : '+'}${data.spotDiff.toFixed(3)}
        </Texto>
      </Horizontal>
    </Vertical>
  )
}

// ============================================================================
// BID HISTORY CHART (Existing functionality)
// ============================================================================

interface BidHistoryChartProps {
  historicalData: RoundBidData[]
  round: number // Now supports any round number
  onExport?: () => void
}

function BidHistoryChart({ historicalData, round, onExport }: BidHistoryChartProps) {
  const [viewMetric, setViewMetric] = useState<HistoricalMetric>('price')

  // Transform data for the chart
  const chartData = useMemo((): ChartDataPoint[] => {
    const sorted = [...historicalData].sort((a, b) => {
      if (round === 2) {
        if (a.r2Price !== null && b.r2Price === null) return -1
        if (a.r2Price === null && b.r2Price !== null) return 1
        if (a.priceChange !== null && b.priceChange !== null) {
          return a.priceChange - b.priceChange
        }
      }
      return a.r1Price - b.r1Price
    })

    return sorted.map((item) => ({
      name: item.supplierName,
      supplierId: item.supplierId,
      isIncumbent: item.isIncumbent,
      r1Value: viewMetric === 'price' ? item.r1Price : item.r1Volume,
      r2Value: round === 2 ? (viewMetric === 'price' ? item.r2Price : item.r2Volume) : null,
      priceChange: round === 2 ? item.priceChange : null,
      hasR2: round === 2 && item.r2Price !== null,
    }))
  }, [historicalData, viewMetric, round])

  const yDomain = useMemo(() => {
    if (viewMetric === 'price') {
      const allPrices = chartData.flatMap((d) => [d.r1Value, d.r2Value].filter((v): v is number => v !== null))
      const min = Math.min(...allPrices)
      const max = Math.max(...allPrices)
      const padding = (max - min) * 0.3
      return [Math.max(0, min - padding), max + padding]
    } else {
      const allVolumes = chartData.flatMap((d) => [d.r1Value, d.r2Value].filter((v): v is number => v !== null))
      const max = Math.max(...allVolumes)
      return [0, max * 1.2]
    }
  }, [chartData, viewMetric])

  const formatYAxis = (value: number) => {
    if (viewMetric === 'price') {
      return `$${value.toFixed(2)}`
    }
    return `${(value / 1000000).toFixed(1)}M`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatPriceChange = (change: any) => {
    if (change === null || change === undefined) return ''
    return change < 0 ? `-$${Math.abs(change).toFixed(2)}` : `+$${change.toFixed(2)}`
  }

  const hasR2Data = round === 2 && chartData.some((d) => d.hasR2)

  return (
    <div className={styles.chartCard}>
      {/* Controls Row */}
      <Horizontal justifyContent='space-between' alignItems='center' className={styles.controlsRow}>
        <Horizontal gap={8} alignItems='center'>
          <Texto category='p2' appearance='medium'>
            View:
          </Texto>
          <Select
            value={viewMetric}
            onChange={(value) => setViewMetric(value as HistoricalMetric)}
            style={{ width: 120 }}
            options={[
              { value: 'price', label: 'Price' },
              { value: 'volume', label: 'Volume' },
            ]}
          />
        </Horizontal>

        <Horizontal gap={8}>
          <GraviButton icon={<CopyOutlined />}>Copy Data</GraviButton>
          <GraviButton icon={<DownloadOutlined />} onClick={onExport}>
            Export
          </GraviButton>
        </Horizontal>
      </Horizontal>

      {/* Legend */}
      <Horizontal className={styles.legend}>
        <Horizontal gap={8} alignItems='center'>
          <div className={styles.legendDot} style={{ backgroundColor: chartColors.r1 }} />
          <Texto category='p2'>R1 Bid</Texto>
        </Horizontal>
        <Horizontal gap={8} alignItems='center'>
          <div className={styles.legendDot} style={{ backgroundColor: chartColors.r2 }} />
          <Texto category='p2'>R2 Bid</Texto>
        </Horizontal>
        <Horizontal alignItems='center' gap={8} style={{ marginLeft: '16px' }}>
          <Tag color='blue' style={{ margin: 0 }}>
            INCUMBENT
          </Tag>
          <Texto category='p2'>Marathon</Texto>
        </Horizontal>
      </Horizontal>

      {/* R1-Only Message */}
      {round === 1 && !hasR2Data && (
        <div className={styles.pendingMessage}>
          <Texto category='p2' appearance='medium'>
            Round 2 bids will appear here after finalists submit
          </Texto>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className={styles.chartContainer}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: viewMetric === 'price' ? 60 : 30 }} barCategoryGap='20%'>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='name' tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis domain={yDomain} tickLine={false} axisLine={false} tickFormatter={formatYAxis} width={70} tick={{ fontSize: 12 }} />
              <Tooltip content={<BidHistoryTooltip viewMetric={viewMetric} />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

              <Bar dataKey='r1Value' name='R1 Bid' fill={chartColors.r1} radius={[4, 4, 0, 0]} barSize={24}>
                {chartData.map((_, index) => (
                  <Cell key={`r1-${index}`} fill={chartColors.r1} />
                ))}
              </Bar>

              <Bar dataKey='r2Value' name='R2 Bid' fill={chartColors.r2} radius={[4, 4, 0, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={`r2-${index}`} fill={entry.hasR2 ? chartColors.r2 : 'transparent'} />
                ))}
                {viewMetric === 'price' && (
                  <LabelList
                    dataKey='priceChange'
                    position='bottom'
                    offset={35}
                    formatter={formatPriceChange}
                    style={{
                      fill: '#51b073',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <Empty description='No bid data available' className={styles.emptyState} />
      )}
    </div>
  )
}

// ============================================================================
// TERMINAL HISTORY CHART (New time-series chart)
// ============================================================================

interface TerminalHistoryChartProps {
  terminalHistory: TerminalHistoryData
  onExport?: () => void
}

function TerminalHistoryChart({ onExport }: TerminalHistoryChartProps) {
  const [viewMode, setViewMode] = useState<TerminalViewMode>('prices')
  const [timePeriod, setTimePeriod] = useState<TerminalHistoryPeriod>('12mo')
  const [seriesVisibility, setSeriesVisibility] = useState<SeriesVisibility>({
    contractPrice: true,
    rackAverage: true,
    spotPrice: true,
    volume: true,
  })

  // Get data for selected time period
  const terminalHistory = useMemo(() => {
    return getTerminalHistoryByPeriod(timePeriod)
  }, [timePeriod])

  const toggleSeries = (series: keyof SeriesVisibility) => {
    setSeriesVisibility((prev) => ({ ...prev, [series]: !prev[series] }))
  }

  // Calculate Y-axis domains
  const priceDomain = useMemo(() => {
    const allPrices = terminalHistory.data.flatMap((d) => [d.contractPrice, d.rackAverage, d.spotPrice])
    const min = Math.min(...allPrices)
    const max = Math.max(...allPrices)
    const padding = (max - min) * 0.2
    return [Math.max(0, min - padding), max + padding]
  }, [terminalHistory.data])

  const volumeDomain = useMemo(() => {
    const maxVolume = Math.max(...terminalHistory.data.map((d) => d.volume))
    return [0, maxVolume * 1.2]
  }, [terminalHistory.data])

  const diffDomain = useMemo(() => {
    const allDiffs = terminalHistory.data.flatMap((d) => [d.rackAvgDiff, d.spotDiff])
    const min = Math.min(...allDiffs)
    const max = Math.max(...allDiffs)
    const absMax = Math.max(Math.abs(min), Math.abs(max))
    return [-absMax * 1.2, absMax * 1.2]
  }, [terminalHistory.data])

  const formatPriceAxis = (value: number) => `$${value.toFixed(2)}`
  const formatVolumeAxis = (value: number) => `${(value / 1000).toFixed(0)}K`
  const formatDiffAxis = (value: number) => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)}¢`

  return (
    <div className={styles.chartCard}>
      {/* Header with terminal info */}
      <Horizontal justifyContent='space-between' alignItems='center' style={{ marginBottom: '16px' }}>
        <Vertical gap={4}>
          <Texto category='p1' weight='600'>
            {terminalHistory.terminalName}
          </Texto>
          <Texto category='p2' appearance='medium'>
            {terminalHistory.period}
          </Texto>
        </Vertical>
      </Horizontal>

      {/* Controls Row */}
      <Horizontal justifyContent='space-between' alignItems='center' className={styles.controlsRow}>
        <Horizontal gap={16} alignItems='center'>
          {/* View mode toggle */}
          {/* @ts-expect-error - Antd Segmented type definitions issue */}
          <Segmented
            value={viewMode}
            onChange={(value: string | number) => setViewMode(value as TerminalViewMode)}
            options={[
              { label: 'Prices & Volume', value: 'prices' },
              { label: 'Difference', value: 'difference' },
            ]}
          />

          {/* Time period selector */}
          <Horizontal gap={8} alignItems='center'>
            <Texto category='p2' appearance='medium'>
              View:
            </Texto>
            <Select
              value={timePeriod}
              onChange={(value) => setTimePeriod(value as TerminalHistoryPeriod)}
              style={{ width: 120 }}
              options={TERMINAL_HISTORY_PERIOD_OPTIONS}
            />
          </Horizontal>
        </Horizontal>

        <Horizontal gap={8}>
          <GraviButton icon={<CopyOutlined />}>Copy Data</GraviButton>
          <GraviButton icon={<DownloadOutlined />} onClick={onExport}>
            Export
          </GraviButton>
        </Horizontal>
      </Horizontal>

      {/* Series visibility toggles */}
      <Horizontal className={styles.seriesToggles}>
        <button
          className={`${styles.seriesToggle} ${seriesVisibility.contractPrice ? styles.active : ''}`}
          onClick={() => toggleSeries('contractPrice')}
        >
          {seriesVisibility.contractPrice ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          <div className={styles.legendDot} style={{ backgroundColor: chartColors.contractPrice }} />
          <span>Contract Price</span>
        </button>

        <button
          className={`${styles.seriesToggle} ${seriesVisibility.rackAverage ? styles.active : ''}`}
          onClick={() => toggleSeries('rackAverage')}
        >
          {seriesVisibility.rackAverage ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          <div className={styles.legendDot} style={{ backgroundColor: chartColors.rackAverage }} />
          <span>Rack Average (PRIMARY)</span>
        </button>

        <button
          className={`${styles.seriesToggle} ${seriesVisibility.spotPrice ? styles.active : ''}`}
          onClick={() => toggleSeries('spotPrice')}
        >
          {seriesVisibility.spotPrice ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          <div className={styles.legendDot} style={{ backgroundColor: chartColors.spotPrice }} />
          <span>Spot Price</span>
        </button>

        {viewMode === 'prices' && (
          <button
            className={`${styles.seriesToggle} ${seriesVisibility.volume ? styles.active : ''}`}
            onClick={() => toggleSeries('volume')}
          >
            {seriesVisibility.volume ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            <div className={styles.legendDot} style={{ backgroundColor: chartColors.volume, border: '1px solid #1890ff' }} />
            <span>Volume</span>
          </button>
        )}
      </Horizontal>

      {/* Chart */}
      <div className={styles.chartContainerLarge}>
        <ResponsiveContainer width='100%' height='100%'>
          {viewMode === 'prices' ? (
            <ComposedChart data={terminalHistory.data} margin={{ top: 20, right: 60, left: 60, bottom: 30 }}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='dateLabel' tickLine={false} axisLine={false} tick={{ fontSize: 11 }} interval='preserveStartEnd' />
              <YAxis
                yAxisId='price'
                domain={priceDomain}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatPriceAxis}
                width={60}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                yAxisId='volume'
                orientation='right'
                domain={volumeDomain}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatVolumeAxis}
                width={50}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<TerminalHistoryTooltip viewMode={viewMode} />} />

              {/* Volume bars (background) */}
              {seriesVisibility.volume && (
                <Bar yAxisId='volume' dataKey='volume' fill={chartColors.volume} radius={[2, 2, 0, 0]} />
              )}

              {/* Price lines */}
              {seriesVisibility.contractPrice && (
                <Line
                  yAxisId='price'
                  type='monotone'
                  dataKey='contractPrice'
                  stroke={chartColors.contractPrice}
                  strokeWidth={2}
                  dot={false}
                  name='Contract Price'
                />
              )}

              {seriesVisibility.rackAverage && (
                <Line
                  yAxisId='price'
                  type='monotone'
                  dataKey='rackAverage'
                  stroke={chartColors.rackAverage}
                  strokeWidth={2}
                  dot={false}
                  name='Rack Average'
                />
              )}

              {seriesVisibility.spotPrice && (
                <Line
                  yAxisId='price'
                  type='monotone'
                  dataKey='spotPrice'
                  stroke={chartColors.spotPrice}
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  dot={false}
                  name='Spot Price'
                />
              )}

              {/* RFP proposed price reference line */}
              <ReferenceLine
                yAxisId='price'
                y={terminalHistory.rfpProposedPrice}
                stroke={chartColors.rfpReference}
                strokeDasharray='3 3'
                strokeWidth={2}
                label={{
                  value: `RFP: $${terminalHistory.rfpProposedPrice.toFixed(2)}`,
                  position: 'insideTopRight',
                  fill: chartColors.rfpReference,
                  fontSize: 11,
                }}
              />

              {/* Historical average reference line */}
              <ReferenceLine
                yAxisId='price'
                y={terminalHistory.avgHistoricalPrice}
                stroke={chartColors.avgReference}
                strokeDasharray='8 4'
                strokeWidth={1}
                label={{
                  value: `Avg: $${terminalHistory.avgHistoricalPrice.toFixed(2)}`,
                  position: 'insideBottomRight',
                  fill: chartColors.avgReference,
                  fontSize: 11,
                }}
              />
            </ComposedChart>
          ) : (
            // Difference view
            <ComposedChart data={terminalHistory.data} margin={{ top: 20, right: 30, left: 60, bottom: 30 }}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='dateLabel' tickLine={false} axisLine={false} tick={{ fontSize: 11 }} interval='preserveStartEnd' />
              <YAxis domain={diffDomain} tickLine={false} axisLine={false} tickFormatter={formatDiffAxis} width={60} tick={{ fontSize: 11 }} />
              <Tooltip content={<TerminalHistoryTooltip viewMode={viewMode} />} />

              {/* Zero reference line */}
              <ReferenceLine y={0} stroke='#d9d9d9' strokeWidth={1} />

              {/* Difference lines */}
              {seriesVisibility.rackAverage && (
                <Line
                  type='monotone'
                  dataKey='rackAvgDiff'
                  stroke={chartColors.rackAverage}
                  strokeWidth={2}
                  dot={false}
                  name='vs Rack Average'
                />
              )}

              {seriesVisibility.spotPrice && (
                <Line
                  type='monotone'
                  dataKey='spotDiff'
                  stroke={chartColors.spotPrice}
                  strokeWidth={2}
                  strokeDasharray='5 5'
                  dot={false}
                  name='vs Spot Price'
                />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Reference line legend */}
      <Horizontal className={styles.referenceLegend}>
        <Horizontal gap={8} alignItems='center'>
          <div className={styles.referenceLine} style={{ borderColor: chartColors.rfpReference }} />
          <Texto category='p2'>RFP Proposed Price: ${terminalHistory.rfpProposedPrice.toFixed(2)}</Texto>
        </Horizontal>
        <Horizontal gap={8} alignItems='center'>
          <div className={`${styles.referenceLine} ${styles.dashed}`} style={{ borderColor: chartColors.avgReference }} />
          <Texto category='p2'>Avg Historical: ${terminalHistory.avgHistoricalPrice.toFixed(2)}</Texto>
        </Horizontal>
      </Horizontal>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HistoricalRFPSection({ round, historicalData, terminalHistory, onExport }: HistoricalRFPSectionProps) {
  const [viewMode, setViewMode] = useState<HistoricalViewMode>('bids')

  // Use provided terminal history or default
  const terminalHistoryData = terminalHistory || getTerminalHistoryByPeriod('12mo')

  return (
    <Vertical className={styles.container}>
      {/* Header */}
      <Vertical gap={4}>
        <Texto category='h4' weight='600'>
          Historical Analysis
        </Texto>
        <Texto category='p2' appearance='medium'>
          Compare supplier bid evolution and terminal performance history
        </Texto>
      </Vertical>

      {/* View Mode Toggle */}
      {/* @ts-expect-error - Antd Segmented type definitions issue */}
      <Segmented
        value={viewMode}
        onChange={(value: string | number) => setViewMode(value as HistoricalViewMode)}
        options={[
          { label: 'Bid History', value: 'bids' },
          { label: 'Terminal History', value: 'terminal' },
        ]}
        className={styles.viewToggle}
      />

      {/* Conditional Chart Rendering */}
      {viewMode === 'bids' ? (
        <BidHistoryChart historicalData={historicalData} round={round} onExport={onExport} />
      ) : (
        <TerminalHistoryChart terminalHistory={terminalHistoryData} onExport={onExport} />
      )}
    </Vertical>
  )
}
