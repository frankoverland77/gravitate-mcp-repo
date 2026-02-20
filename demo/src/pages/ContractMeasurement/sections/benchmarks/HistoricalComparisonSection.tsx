import { useState, useMemo, useEffect } from 'react'
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { useFeatureMode } from '../../../../contexts/FeatureModeContext'
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from 'recharts'
import { Select, Button, Segmented } from 'antd'
import {
  LineChartOutlined,
  BarChartOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import type { Scenario, AnalysisParameters } from '../../types/scenario.types'
import { SAMPLE_DETAILS, type ContractDetail } from '../../ContractMeasurement.data'

// ============================================================================
// TYPES
// ============================================================================

type Aggregation = AnalysisParameters['price']['aggregation']
type Method = AnalysisParameters['price']['method']

interface ChartDataPoint {
  date: Date
  dateLabel: string
  volume: number
  contractPrice: number
  rackAverage: number
  spotPrice: number
  rackAvgDiff: number
  spotDiff: number
  // Dynamic scenario keys added at display time
  [key: string]: number | Date | string
}

interface DetailDailyData {
  detailId: string
  product: string
  location: string
  dailyData: ChartDataPoint[]
}

// ============================================================================
// SCENARIO COLORS
// ============================================================================

const SCENARIO_COLORS = ['#722ed1', '#eb2f96', '#fa8c16', '#13c2c2', '#2f54eb', '#a0d911']

// ============================================================================
// DATA GENERATION - Per-detail daily series
// ============================================================================

function seededNoise(index: number, offset: number): number {
  const seed = Math.sin(index * 127.1 + offset) * 43758.5453
  return (seed - Math.floor(seed)) - 0.5
}

const generatePerDetailDailyData = (details: ContractDetail[]): DetailDailyData[] => {
  const endDate = moment('2024-12-04')
  const startDate = endDate.clone().subtract(12, 'months')

  return details.map((detail, detailIndex) => {
    const data: ChartDataPoint[] = []
    const baseContract = detail.contractPrice
    const baseRack = baseContract - 0.03
    const baseSpot = baseContract + 0.10
    const baseVolume = detail.volume / 12 // approximate daily from monthly

    const current = startDate.clone()
    let dayIndex = 0
    const seedOffset = detailIndex * 1000 + 7919

    while (current.isSameOrBefore(endDate)) {
      const month = current.month()
      const seasonalFactor = month >= 5 && month <= 8 ? 1.12 : month >= 11 || month <= 1 ? 1.08 : 0.95
      const dayOfWeek = current.day()

      const noise1 = seededNoise(dayIndex, seedOffset + 311.7)
      const noise2 = seededNoise(dayIndex, seedOffset + 183.3)
      const noise3 = seededNoise(dayIndex, seedOffset + 571.1)
      const noise4 = seededNoise(dayIndex, seedOffset + 97.7)

      const trendFactor = dayIndex * 0.00004

      const contractPrice = Number(
        (baseContract + noise1 * 0.06 + trendFactor + seasonalFactor * 0.01).toFixed(4),
      )
      const rackAverage = Number(
        (baseRack + noise2 * 0.06 + trendFactor + seasonalFactor * 0.01).toFixed(4),
      )
      const spotPrice = Number(
        (baseSpot + noise3 * 0.1 + trendFactor + seasonalFactor * 0.01).toFixed(4),
      )
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const volume = isWeekend ? 0 : Math.max(0, Math.round(baseVolume * seasonalFactor * (1 + noise4 * 0.4)))

      data.push({
        date: current.toDate(),
        dateLabel: current.format('MMM D'),
        volume,
        contractPrice,
        rackAverage,
        spotPrice,
        rackAvgDiff: Number((contractPrice - rackAverage).toFixed(4)),
        spotDiff: Number((contractPrice - spotPrice).toFixed(4)),
      })

      current.add(1, 'day')
      dayIndex++
    }

    return {
      detailId: detail.detailId,
      product: detail.product,
      location: detail.location,
      dailyData: data,
    }
  })
}

// Module-level constant
const perDetailData = generatePerDetailDailyData(SAMPLE_DETAILS)

// ============================================================================
// AGGREGATION HELPERS
// ============================================================================

function aggregateEntireDeal(allDetails: DetailDailyData[], method: Method): ChartDataPoint[] {
  if (allDetails.length === 0) return []
  const dayCount = allDetails[0].dailyData.length

  const result: ChartDataPoint[] = []
  for (let i = 0; i < dayCount; i++) {
    const points = allDetails.map((d) => d.dailyData[i])
    const volumes = points.map((p) => p.volume)
    const totalVol = volumes.reduce((s, v) => s + v, 0)

    let cp: number, ra: number, sp: number
    if (method === 'weighted' && totalVol > 0) {
      cp = points.reduce((s, p, j) => s + p.contractPrice * volumes[j], 0) / totalVol
      ra = points.reduce((s, p, j) => s + p.rackAverage * volumes[j], 0) / totalVol
      sp = points.reduce((s, p, j) => s + p.spotPrice * volumes[j], 0) / totalVol
    } else {
      cp = points.reduce((s, p) => s + p.contractPrice, 0) / points.length
      ra = points.reduce((s, p) => s + p.rackAverage, 0) / points.length
      sp = points.reduce((s, p) => s + p.spotPrice, 0) / points.length
    }

    result.push({
      date: points[0].date,
      dateLabel: points[0].dateLabel,
      volume: totalVol,
      contractPrice: Number(cp.toFixed(4)),
      rackAverage: Number(ra.toFixed(4)),
      spotPrice: Number(sp.toFixed(4)),
      rackAvgDiff: Number((cp - ra).toFixed(4)),
      spotDiff: Number((cp - sp).toFixed(4)),
    })
  }
  return result
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function averageByMethod(prices: number[], volumes: number[], method: Method): number {
  if (method === 'median') return median(prices)
  if (method === 'weighted') {
    const totalVol = volumes.reduce((s, v) => s + v, 0)
    if (totalVol > 0) {
      return prices.reduce((s, p, i) => s + p * volumes[i], 0) / totalVol
    }
  }
  // simple or weighted fallback
  return prices.reduce((s, p) => s + p, 0) / prices.length
}

function bucketKey(date: Date, aggregation: Aggregation): string {
  const m = moment(date)
  switch (aggregation) {
    case 'daily':
      return m.format('YYYY-MM-DD')
    case 'weekly':
      return m.startOf('isoWeek').format('YYYY-MM-DD')
    case 'monthly':
      return m.format('YYYY-MM')
    case 'quarterly':
      return `${m.year()}-Q${m.quarter()}`
  }
}

function bucketLabel(date: Date, aggregation: Aggregation): string {
  const m = moment(date)
  switch (aggregation) {
    case 'daily':
      return m.format('MMM D')
    case 'weekly':
      return m.startOf('isoWeek').format('MMM D')
    case 'monthly':
      return m.format("MMM 'YY")
    case 'quarterly':
      return `Q${m.quarter()} '${m.format('YY')}`
  }
}

function tooltipLabel(date: Date, aggregation: Aggregation): string {
  const m = moment(date)
  switch (aggregation) {
    case 'daily':
      return m.format('MMM. D, YYYY')
    case 'weekly':
      return `Week of ${m.startOf('isoWeek').format('MMM. D, YYYY')}`
    case 'monthly':
      return m.format('MMMM YYYY')
    case 'quarterly':
      return `Q${m.quarter()} ${m.year()}`
  }
}

function aggregateChartData(daily: ChartDataPoint[], aggregation: Aggregation, method: Method): ChartDataPoint[] {
  if (aggregation === 'daily') return daily

  const buckets = new Map<string, ChartDataPoint[]>()
  for (const point of daily) {
    const key = bucketKey(point.date, aggregation)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(point)
  }

  const result: ChartDataPoint[] = []
  for (const [, points] of buckets) {
    const volumes = points.map((p) => p.volume)
    const cp = averageByMethod(
      points.map((p) => p.contractPrice),
      volumes,
      method,
    )
    const ra = averageByMethod(
      points.map((p) => p.rackAverage),
      volumes,
      method,
    )
    const sp = averageByMethod(
      points.map((p) => p.spotPrice),
      volumes,
      method,
    )

    result.push({
      date: points[0].date,
      dateLabel: bucketLabel(points[0].date, aggregation),
      volume: volumes.reduce((s, v) => s + v, 0),
      contractPrice: Number(cp.toFixed(4)),
      rackAverage: Number(ra.toFixed(4)),
      spotPrice: Number(sp.toFixed(4)),
      rackAvgDiff: Number((cp - ra).toFixed(4)),
      spotDiff: Number((cp - sp).toFixed(4)),
    })
  }

  return result
}

// ============================================================================
// SCENARIO PRICE DERIVATION
// ============================================================================

function deriveScenarioPrice(
  point: ChartDataPoint,
  scenario: Scenario,
  index: number,
): number {
  const config = scenario.priceConfig
  const benchmarkId = config?.benchmarkId

  // Map benchmarkId to a base series value
  let base: number
  switch (benchmarkId) {
    case 'rack-average':
      base = point.rackAverage
      break
    case 'contract-low':
      base = point.contractPrice - 0.04
      break
    case 'spot':
      base = point.spotPrice
      break
    case 'rack-low':
      base = point.rackAverage - 0.02
      break
    default: {
      // Fallback: offset from contract price with deterministic noise
      const offset = (index + 1) * 0.015
      const dayIdx = typeof point.dateLabel === 'string' ? point.dateLabel.length : 0
      const noise = seededNoise(dayIdx, (index + 1) * 4217)
      base = point.contractPrice + offset + noise * 0.02
      break
    }
  }

  // Apply diff if present
  if (config?.diff) {
    const diffAmount = config.diff.amount
    base = config.diff.sign === '+' ? base + diffAmount : base - diffAmount
  }

  return Number(base.toFixed(4))
}

// ============================================================================
// STYLES
// ============================================================================

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '16px 20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

// Chart colors (Quote Book aligned)
const chartColors = {
  contractPrice: '#1890ff',
  rackAverage: '#52c41a',
  spotPrice: '#ff4d4f',
  volume: '#1890ff',
  zeroLine: '#bfbfbf',
}

// ============================================================================
// TYPES
// ============================================================================

type ViewMode = 'prices' | 'difference'

interface VisibleSeries {
  contractPrice: boolean
  rackAverage: boolean
  spotPrice: boolean
}

// ============================================================================
// CUSTOM TOOLTIP COMPONENT
// ============================================================================

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    color: string
    name: string
  }>
  label?: string
  viewMode: ViewMode
  showVolume?: boolean
  displayData: ChartDataPoint[]
  aggregation: Aggregation
}

const CustomTooltip = ({
  active,
  payload,
  label,
  viewMode,
  showVolume = true,
  displayData,
  aggregation,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null

  const dataPoint = displayData.find((d) => d.dateLabel === label)

  return (
    <Vertical
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: '4px',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: 180,
      }}
    >
      <Texto category='p2' weight='600'>
        {dataPoint ? tooltipLabel(dataPoint.date as Date, aggregation) : label}
      </Texto>

      {showVolume && viewMode === 'prices' && dataPoint && (
        <Horizontal style={{ justifyContent: 'space-between', marginTop: '8px' }}>
          <Texto category='p2' appearance='medium'>
            {aggregation === 'daily' ? 'Lifting:' : 'Total Volume:'}
          </Texto>
          <Texto category='p2'>
            {(dataPoint.volume as number) > 0 ? (dataPoint.volume as number).toLocaleString() : 'No lifting'}
          </Texto>
        </Horizontal>
      )}

      <div style={{ marginTop: '8px' }}>
        {payload.map((item) => {
          if (item.dataKey === 'volume') return null

          const value = item.value
          const isDifference = viewMode === 'difference'
          let formattedValue: string

          if (isDifference) {
            formattedValue = value >= 0 ? `+$${value.toFixed(4)}` : `-$${Math.abs(value).toFixed(4)}`
          } else {
            formattedValue = `$${value.toFixed(4)}`
          }

          return (
            <Horizontal key={item.dataKey} style={{ justifyContent: 'space-between', marginTop: '4px' }}>
              <Texto style={{ color: item.color }}>{item.name}:</Texto>
              <Texto style={{ color: item.color, fontWeight: 500 }}>{formattedValue}</Texto>
            </Horizontal>
          )
        })}
      </div>
    </Vertical>
  )
}

// ============================================================================
// COMPONENT
// ============================================================================

interface HistoricalComparisonSectionProps {
  scenarios?: Scenario[]
  includedDetails?: ContractDetail[]
  aggregation: Aggregation
  method: Method
  onAggregationChange: (value: Aggregation) => void
}

export function HistoricalComparisonSection({
  scenarios = [],
  includedDetails,
  aggregation,
  method,
  onAggregationChange,
}: HistoricalComparisonSectionProps) {
  const { isFutureMode } = useFeatureMode()
  const [activeView, setActiveView] = useState<ViewMode>('prices')
  const [visibleSeries, setVisibleSeries] = useState<VisibleSeries>({
    contractPrice: true,
    rackAverage: true,
    spotPrice: true,
  })
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [visibleScenarios, setVisibleScenarios] = useState<Record<string, boolean>>({})

  const isScenarioVisible = (id: string) => visibleScenarios[id] !== false

  const toggleSeries = (series: keyof VisibleSeries) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [series]: !prev[series],
    }))
  }

  const toggleScenarioVisibility = (id: string) => {
    setVisibleScenarios((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }))
  }

  // Non-primary scenarios for chart rendering
  const nonReferenceScenarios = useMemo(() => scenarios.filter((s) => !s.isReference), [scenarios])

  // Filter perDetailData to only included details
  const includedPerDetailData = useMemo(() => {
    if (!includedDetails) return perDetailData
    const includedIds = new Set(includedDetails.map((d) => d.detailId))
    return perDetailData.filter((d) => includedIds.has(d.detailId))
  }, [includedDetails])

  // Auto-reset if currently-selected detail is excluded
  useEffect(() => {
    if (
      selectedProduct !== 'all' &&
      includedDetails &&
      !includedDetails.some((d) => d.detailId === selectedProduct)
    ) {
      setSelectedProduct('all')
    }
  }, [includedDetails, selectedProduct])

  // View dropdown options
  const viewOptions = useMemo(
    () => [
      { value: 'all', label: 'Entire Deal' },
      ...(includedDetails || SAMPLE_DETAILS).map((d) => ({
        value: d.detailId,
        label: `${d.product} - ${d.location}`,
      })),
    ],
    [includedDetails],
  )

  // Base daily data: entire deal (aggregated) or specific detail
  const baseDailyData = useMemo(() => {
    if (selectedProduct === 'all') {
      return aggregateEntireDeal(includedPerDetailData, method)
    }
    const found = includedPerDetailData.find((d) => d.detailId === selectedProduct)
    return found ? found.dailyData : includedPerDetailData[0]?.dailyData ?? []
  }, [selectedProduct, method, includedPerDetailData])

  // Aggregate + merge scenario prices
  const displayData = useMemo(() => {
    const aggregated = aggregateChartData(baseDailyData, aggregation, method)

    if (nonReferenceScenarios.length === 0) return aggregated

    return aggregated.map((point) => {
      const extended: ChartDataPoint = { ...point }
      nonReferenceScenarios.forEach((s, idx) => {
        const scenarioPrice = deriveScenarioPrice(point, s, idx)
        extended[`scenario-${s.id}`] = scenarioPrice
        extended[`scenarioDiff-${s.id}`] = Number((scenarioPrice - (point.contractPrice as number)).toFixed(4))
      })
      return extended
    })
  }, [baseDailyData, aggregation, method, nonReferenceScenarios])

  // Dynamic dot visibility — hide dots when data is dense
  const showDots = displayData.length <= 52

  // Dynamic x-axis interval — aim for ~12-15 labels max
  const xAxisInterval = useMemo(() => {
    if (displayData.length <= 15) return 0
    return Math.ceil(displayData.length / 14) - 1
  }, [displayData.length])

  // Calculate Y-axis domain for prices view (include scenario prices)
  const pricesDomain = useMemo(() => {
    const allPrices: number[] = []
    for (const d of displayData) {
      allPrices.push(d.contractPrice as number, d.rackAverage as number, d.spotPrice as number)
      nonReferenceScenarios.forEach((s) => {
        const val = d[`scenario-${s.id}`]
        if (typeof val === 'number') allPrices.push(val)
      })
    }
    const min = Math.min(...allPrices)
    const max = Math.max(...allPrices)
    const padding = (max - min) * 0.1
    return [min - padding, max + padding]
  }, [displayData, nonReferenceScenarios])

  // Calculate Y-axis domain for difference view (include scenario diffs)
  const differenceDomain = useMemo(() => {
    const allDiffs: number[] = []
    for (const d of displayData) {
      allDiffs.push(d.rackAvgDiff as number, d.spotDiff as number)
      nonReferenceScenarios.forEach((s) => {
        const val = d[`scenarioDiff-${s.id}`]
        if (typeof val === 'number') allDiffs.push(val)
      })
    }
    const absMax = Math.max(...allDiffs.map(Math.abs))
    const padding = absMax * 0.2
    return [-(absMax + padding), absMax + padding]
  }, [displayData, nonReferenceScenarios])

  // Calculate volume domain
  const volumeDomain = useMemo(() => {
    const maxVolume = Math.max(...displayData.map((d) => d.volume as number))
    return [0, maxVolume * 1.2]
  }, [displayData])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Texto category='h4' weight='600'>
          Historical Comparison
        </Texto>
        <Texto category='p2' appearance='medium'>
          Track price trends over time against your benchmarks
        </Texto>
      </div>

      {/* Chart Card */}
      <div style={cardStyle}>
        {/* Controls Row */}
        <Horizontal
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Left: View Toggle */}
          <Button.Group>
            <Button
              type={activeView === 'prices' ? 'primary' : 'default'}
              icon={<LineChartOutlined />}
              onClick={() => setActiveView('prices')}
              style={activeView === 'prices' ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
            >
              {isFutureMode ? 'Prices & Volume' : 'Prices'}
            </Button>
            <Button
              type={activeView === 'difference' ? 'primary' : 'default'}
              icon={<BarChartOutlined />}
              onClick={() => setActiveView('difference')}
              style={activeView === 'difference' ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
            >
              Difference
            </Button>
          </Button.Group>

          {/* Granularity Selector */}
          <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
            <Texto category='p2' appearance='medium'>
              Granularity:
            </Texto>
            <Segmented
              size='small'
              value={aggregation}
              onChange={(val) => onAggregationChange(val as Aggregation)}
              options={[
                { label: 'D', value: 'daily' },
                { label: 'W', value: 'weekly' },
                { label: 'M', value: 'monthly' },
                { label: 'Q', value: 'quarterly' },
              ]}
            />
          </Horizontal>

          {/* Product Filter / View */}
          <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
            <Texto category='p2' appearance='medium'>
              View:
            </Texto>
            <Select
              value={selectedProduct}
              onChange={setSelectedProduct}
              style={{ width: 280 }}
              options={viewOptions}
            />
          </Horizontal>

          {/* Right: Timestamp and Export */}
          <Horizontal style={{ alignItems: 'center', gap: '16px' }}>
            <Texto category='p2' appearance='medium'>
              Updated 1m ago
            </Texto>
            <Horizontal style={{ gap: '8px' }}>
              <GraviButton icon={<CopyOutlined />}>Copy Data</GraviButton>
              <GraviButton icon={<DownloadOutlined />}>Export</GraviButton>
            </Horizontal>
          </Horizontal>
        </Horizontal>

        {/* Legend Controls */}
        <Horizontal style={{ gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {activeView === 'prices' && (
            <Horizontal
              style={{ alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => toggleSeries('contractPrice')}
            >
              {visibleSeries.contractPrice ? (
                <EyeOutlined style={{ color: '#8c8c8c' }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: '#bfbfbf' }} />
              )}
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: visibleSeries.contractPrice ? chartColors.contractPrice : '#d9d9d9',
                }}
              />
              <Texto category='p2' style={{ color: visibleSeries.contractPrice ? '#262626' : '#bfbfbf' }}>
                {selectedProduct === 'all' ? 'Current Contract' : 'Contract Price'}
              </Texto>
            </Horizontal>
          )}

          <Horizontal
            style={{ alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => toggleSeries('rackAverage')}
          >
            {visibleSeries.rackAverage ? (
              <EyeOutlined style={{ color: '#8c8c8c' }} />
            ) : (
              <EyeInvisibleOutlined style={{ color: '#bfbfbf' }} />
            )}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: visibleSeries.rackAverage ? chartColors.rackAverage : '#d9d9d9',
              }}
            />
            <Texto category='p2' style={{ color: visibleSeries.rackAverage ? '#262626' : '#bfbfbf' }}>
              {activeView === 'prices' ? 'Rack Average' : 'Rack Average Difference'}
            </Texto>
            <div
              style={{
                backgroundColor: '#52c41a',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              REFERENCE
            </div>
          </Horizontal>

          <Horizontal
            style={{ alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => toggleSeries('spotPrice')}
          >
            {visibleSeries.spotPrice ? (
              <EyeOutlined style={{ color: '#8c8c8c' }} />
            ) : (
              <EyeInvisibleOutlined style={{ color: '#bfbfbf' }} />
            )}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: visibleSeries.spotPrice ? chartColors.spotPrice : '#d9d9d9',
              }}
            />
            <Texto category='p2' style={{ color: visibleSeries.spotPrice ? '#262626' : '#bfbfbf' }}>
              {activeView === 'prices' ? 'Spot Price' : 'Spot Price Difference'}
            </Texto>
          </Horizontal>

          {/* Scenario legend entries */}
          {nonReferenceScenarios.map((s, idx) => {
            const color = SCENARIO_COLORS[idx % SCENARIO_COLORS.length]
            const visible = isScenarioVisible(s.id)
            return (
              <Horizontal
                key={s.id}
                style={{ alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => toggleScenarioVisibility(s.id)}
              >
                {visible ? (
                  <EyeOutlined style={{ color: '#8c8c8c' }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: '#bfbfbf' }} />
                )}
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: visible ? color : '#d9d9d9',
                  }}
                />
                <Texto category='p2' style={{ color: visible ? '#262626' : '#bfbfbf' }}>
                  {activeView === 'prices' ? s.name : `${s.name} Difference`}
                </Texto>
              </Horizontal>
            )
          })}
        </Horizontal>

        {/* Chart Container */}
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width='100%' height='100%'>
            {activeView === 'prices' ? (
              <ComposedChart
                data={displayData}
                margin={{ top: 20, right: isFutureMode ? 80 : 40, bottom: 20, left: 80 }}
              >
                <CartesianGrid strokeDasharray='3 3' vertical={false} />

                {/* X-Axis */}
                <XAxis
                  dataKey='dateLabel'
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  interval={xAxisInterval}
                />

                {/* Left Y-Axis - Price */}
                <YAxis
                  yAxisId='price'
                  orientation='left'
                  domain={pricesDomain}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                  tickFormatter={(value: number) => `$${value.toFixed(2)}`}
                  tick={{ fontSize: 12 }}
                >
                  <Label
                    value='PRICE'
                    angle={-90}
                    position='insideLeft'
                    fill='#8c8c8c'
                    style={{ textAnchor: 'middle', letterSpacing: '2px', fontSize: 11 }}
                  />
                </YAxis>

                {/* Right Y-Axis - Volume (Future State only) */}
                {isFutureMode && (
                  <YAxis
                    yAxisId='volume'
                    orientation='right'
                    domain={volumeDomain}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                    tickFormatter={(value: number) => (value > 0 ? `${(value / 1000).toFixed(0)}K` : '0')}
                    tick={{ fontSize: 12 }}
                  >
                    <Label
                      value='VOLUME'
                      angle={90}
                      position='insideRight'
                      fill='#8c8c8c'
                      style={{ textAnchor: 'middle', letterSpacing: '2px', fontSize: 11 }}
                    />
                  </YAxis>
                )}

                {/* Tooltip */}
                <Tooltip
                  content={
                    <CustomTooltip
                      viewMode='prices'
                      showVolume={isFutureMode}
                      displayData={displayData}
                      aggregation={aggregation}
                    />
                  }
                  cursor={{ strokeDasharray: '3 3' }}
                />

                {/* Volume Bars - Behind lines (Future State only) */}
                {isFutureMode && (
                  <Bar
                    yAxisId='volume'
                    dataKey='volume'
                    fill={chartColors.volume}
                    fillOpacity={0.3}
                    barSize={10}
                    radius={[2, 2, 0, 0]}
                  />
                )}

                {/* Contract Price - Area */}
                {visibleSeries.contractPrice && (
                  <Area
                    yAxisId='price'
                    type='monotone'
                    dataKey='contractPrice'
                    name={selectedProduct === 'all' ? 'Current Contract' : 'Contract Price'}
                    stroke={chartColors.contractPrice}
                    fill={chartColors.contractPrice}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={showDots ? { r: 3, fill: chartColors.contractPrice } : false}
                    activeDot={{ r: 5 }}
                  />
                )}

                {/* Rack Average - Thick Line (REFERENCE) */}
                {visibleSeries.rackAverage && (
                  <Line
                    yAxisId='price'
                    type='monotone'
                    dataKey='rackAverage'
                    name='Rack Average'
                    stroke={chartColors.rackAverage}
                    strokeWidth={3}
                    dot={showDots ? { r: 3, fill: chartColors.rackAverage } : false}
                    activeDot={{ r: 5 }}
                  />
                )}

                {/* Spot Price - Dashed Line */}
                {visibleSeries.spotPrice && (
                  <Line
                    yAxisId='price'
                    type='monotone'
                    dataKey='spotPrice'
                    name='Spot Price'
                    stroke={chartColors.spotPrice}
                    strokeWidth={2}
                    strokeDasharray='5 5'
                    dot={showDots ? { r: 3, fill: chartColors.spotPrice } : false}
                    activeDot={{ r: 5 }}
                  />
                )}

                {/* Scenario Lines */}
                {nonReferenceScenarios
                  .filter((s) => isScenarioVisible(s.id))
                  .map((s, idx) => (
                    <Line
                      key={s.id}
                      yAxisId='price'
                      type='monotone'
                      dataKey={`scenario-${s.id}`}
                      name={s.name}
                      stroke={SCENARIO_COLORS[nonReferenceScenarios.indexOf(s) % SCENARIO_COLORS.length]}
                      strokeWidth={2}
                      strokeDasharray={idx % 2 === 0 ? undefined : '8 4'}
                      dot={showDots ? { r: 2 } : false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
              </ComposedChart>
            ) : (
              <ComposedChart data={displayData} margin={{ top: 20, right: 40, bottom: 20, left: 80 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />

                {/* X-Axis */}
                <XAxis
                  dataKey='dateLabel'
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  interval={xAxisInterval}
                />

                {/* Y-Axis - Difference */}
                <YAxis
                  domain={differenceDomain}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                  tickFormatter={(value: number) =>
                    value >= 0 ? `+$${value.toFixed(2)}` : `-$${Math.abs(value).toFixed(2)}`
                  }
                  tick={{ fontSize: 12 }}
                >
                  <Label
                    value='DIFFERENCE'
                    angle={-90}
                    position='insideLeft'
                    fill='#8c8c8c'
                    style={{ textAnchor: 'middle', letterSpacing: '2px', fontSize: 11 }}
                  />
                </YAxis>

                {/* Zero Reference Line */}
                <ReferenceLine y={0} stroke={chartColors.zeroLine} strokeDasharray='4 4' strokeWidth={1} />

                {/* Tooltip */}
                <Tooltip
                  content={<CustomTooltip viewMode='difference' displayData={displayData} aggregation={aggregation} />}
                  cursor={{ strokeDasharray: '3 3' }}
                />

                {/* Rack Average Difference - Solid Line */}
                {visibleSeries.rackAverage && (
                  <Line
                    type='monotone'
                    dataKey='rackAvgDiff'
                    name='Rack Average Difference'
                    stroke={chartColors.rackAverage}
                    strokeWidth={2}
                    dot={showDots ? { r: 3, fill: chartColors.rackAverage } : false}
                    activeDot={{ r: 5 }}
                  />
                )}

                {/* Spot Price Difference - Dashed Line */}
                {visibleSeries.spotPrice && (
                  <Line
                    type='monotone'
                    dataKey='spotDiff'
                    name='Spot Price Difference'
                    stroke={chartColors.spotPrice}
                    strokeWidth={2}
                    strokeDasharray='5 5'
                    dot={showDots ? { r: 3, fill: chartColors.spotPrice } : false}
                    activeDot={{ r: 5 }}
                  />
                )}

                {/* Scenario Difference Lines */}
                {nonReferenceScenarios
                  .filter((s) => isScenarioVisible(s.id))
                  .map((s, idx) => (
                    <Line
                      key={s.id}
                      type='monotone'
                      dataKey={`scenarioDiff-${s.id}`}
                      name={`${s.name} Difference`}
                      stroke={SCENARIO_COLORS[nonReferenceScenarios.indexOf(s) % SCENARIO_COLORS.length]}
                      strokeWidth={2}
                      strokeDasharray={idx % 2 === 0 ? undefined : '8 4'}
                      dot={showDots ? { r: 2 } : false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
