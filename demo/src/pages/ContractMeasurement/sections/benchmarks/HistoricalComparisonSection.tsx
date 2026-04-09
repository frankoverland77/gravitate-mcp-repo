import { useState, useMemo, useEffect, Fragment } from 'react'
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
import { Select, Button, Segmented, DatePicker } from 'antd'
import type { Dayjs } from 'dayjs'
import {
  LineChartOutlined,
  BarChartOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek)
dayjs.extend(isSameOrBefore)
import type { Scenario } from '../../types/scenario.types'
import { SAMPLE_DETAILS, type ContractDetail } from '../../ContractMeasurement.data'

// ============================================================================
// TYPES
// ============================================================================

type Aggregation = 'daily' | 'weekly' | 'monthly' | 'quarterly'
type Method = 'simple' | 'weekly-median' | 'monthly-median'

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
// COLOR SCHEME
// ============================================================================

// Per-detail palette (first is blue to match existing "Entire Deal" appearance)
const DETAIL_COLORS = ['#1890ff', '#722ed1', '#fa8c16', '#13c2c2', '#eb2f96', '#a0d911', '#2f54eb']
const SCENARIO_COLORS = ['#52c41a', '#f5222d', '#faad14', '#1890ff', '#722ed1', '#eb2f96', '#13c2c2']
const SCENARIO_DASH_PATTERNS = ['8 4', '5 3', '12 3', '3 3']

// ============================================================================
// DATA GENERATION - Per-detail daily series
// ============================================================================

function seededNoise(index: number, offset: number): number {
  const seed = Math.sin(index * 127.1 + offset) * 43758.5453
  return (seed - Math.floor(seed)) - 0.5
}

const generatePerDetailDailyData = (details: ContractDetail[]): DetailDailyData[] => {
  const endDate = dayjs('2024-12-04')
  const startDate = endDate.clone().subtract(12, 'months')

  return details.map((detail, detailIndex) => {
    const data: ChartDataPoint[] = []
    const baseContract = detail.contractPrice
    const baseRack = baseContract - 0.03
    const baseSpot = baseContract + 0.10
    const baseVolume = detail.volume / 12 // approximate daily from monthly

    let current = startDate.clone()
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

      current = current.add(1, 'day')
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
  const m = dayjs(date)
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
  const m = dayjs(date)
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
  const m = dayjs(date)
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

// Chart colors for reference series
const chartColors = {
  rackAverage: '#51B073',
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
  onAggregationChange: (value: Aggregation) => void
  hasComparisonScenarios?: boolean
  effectiveDateRange?: [Dayjs | null, Dayjs | null] | null
  onEffectiveDateRangeChange?: (range: [Dayjs | null, Dayjs | null] | null) => void
}

export function HistoricalComparisonSection({
  scenarios = [],
  includedDetails,
  aggregation,
  onAggregationChange,
  hasComparisonScenarios = true,
  effectiveDateRange,
  onEffectiveDateRangeChange,
}: HistoricalComparisonSectionProps) {
  const method: Method = 'simple'
  const { isFutureMode } = useFeatureMode()
  const [activeView, setActiveView] = useState<ViewMode>('prices')
  const [visibleSeries, setVisibleSeries] = useState<VisibleSeries>({
    contractPrice: true,
    rackAverage: true,
    spotPrice: true,
  })
  const [selectedDetails, setSelectedDetails] = useState<string[]>(['all'])
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

  // Auto-reset if any selected detail is excluded
  useEffect(() => {
    if (!includedDetails) return
    const includedIds = new Set(includedDetails.map((d) => d.detailId))
    setSelectedDetails((prev) => {
      const filtered = prev.filter((key) => key === 'all' || includedIds.has(key))
      return filtered.length > 0 ? filtered : ['all']
    })
  }, [includedDetails])

  // View dropdown options
  const viewOptions = useMemo(
    () => [
      { value: 'all', label: 'Entire Deal' },
      ...(includedDetails || SAMPLE_DETAILS).map((d) => ({
        value: d.detailId,
        label: `${d.product} — ${d.location}`,
      })),
    ],
    [includedDetails],
  )

  // Resolve each selected key to its raw daily data + label
  const selectedSeriesData = useMemo(() => {
    const detailsToUse = includedDetails ?? SAMPLE_DETAILS
    return selectedDetails.map((key) => {
      if (key === 'all') {
        return { key: 'all', label: 'Entire Deal', rawData: aggregateEntireDeal(includedPerDetailData, method) }
      }
      const d = detailsToUse.find((d) => d.detailId === key)
      const rawData = includedPerDetailData.find((d) => d.detailId === key)?.dailyData ?? []
      return { key, label: d ? `${d.product} — ${d.location}` : key, rawData }
    })
  }, [selectedDetails, method, includedPerDetailData, includedDetails])

  // Aggregate each series
  const allAggregatedSeries = useMemo(() => {
    return selectedSeriesData.map(({ key, label, rawData }) => ({
      key,
      label,
      data: aggregateChartData(rawData, aggregation, method),
    }))
  }, [selectedSeriesData, aggregation, method])

  // Merge all series into a single ChartDataPoint[] array
  // rackAverage and spotPrice come from the longest (base) series for reference lines
  const displayData = useMemo(() => {
    if (allAggregatedSeries.length === 0) return []
    const base = allAggregatedSeries.reduce((a, b) => (a.data.length > b.data.length ? a : b))

    return base.data.map((point, i) => {
      const merged: ChartDataPoint = { ...point } // keeps rackAverage, spotPrice, volume from base
      allAggregatedSeries.forEach(({ key, data }) => {
        const p = data[i] ?? point
        merged[`cp-${key}`] = p.contractPrice
        merged[`rackAvgDiff-${key}`] = Number((p.contractPrice - p.rackAverage).toFixed(4))
        merged[`spotDiff-${key}`] = Number((p.contractPrice - p.spotPrice).toFixed(4))
        nonReferenceScenarios.forEach((s, sIdx) => {
          const scenarioPrice = deriveScenarioPrice(p, s, sIdx)
          merged[`scenario-${key}-${s.id}`] = scenarioPrice
          merged[`scenarioDiff-${key}-${s.id}`] = Number((scenarioPrice - p.contractPrice).toFixed(4))
        })
      })
      return merged
    })
  }, [allAggregatedSeries, nonReferenceScenarios])

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
      allPrices.push(d.rackAverage as number, d.spotPrice as number)
      allAggregatedSeries.forEach(({ key }) => {
        const cp = d[`cp-${key}`]
        if (typeof cp === 'number') allPrices.push(cp)
        nonReferenceScenarios.forEach((s) => {
          const val = d[`scenario-${key}-${s.id}`]
          if (typeof val === 'number') allPrices.push(val)
        })
      })
    }
    const min = Math.min(...allPrices)
    const max = Math.max(...allPrices)
    const padding = (max - min) * 0.1
    return [min - padding, max + padding]
  }, [displayData, allAggregatedSeries, nonReferenceScenarios])

  // Calculate Y-axis domain for difference view (include scenario diffs)
  const differenceDomain = useMemo(() => {
    const allDiffs: number[] = []
    for (const d of displayData) {
      allAggregatedSeries.forEach(({ key }) => {
        const rd = d[`rackAvgDiff-${key}`]
        const sd = d[`spotDiff-${key}`]
        if (typeof rd === 'number') allDiffs.push(rd)
        if (typeof sd === 'number') allDiffs.push(sd)
        nonReferenceScenarios.forEach((s) => {
          const val = d[`scenarioDiff-${key}-${s.id}`]
          if (typeof val === 'number') allDiffs.push(val)
        })
      })
    }
    if (allDiffs.length === 0) return [-0.1, 0.1]
    const absMax = Math.max(...allDiffs.map(Math.abs))
    const padding = absMax * 0.2
    return [-(absMax + padding), absMax + padding]
  }, [displayData, allAggregatedSeries, nonReferenceScenarios])

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
          gap={12} style={{ justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap' }}
        >
          {/* Left: View Toggle */}
          <Button.Group>
            <Button
              type={activeView === 'prices' ? 'primary' : 'default'}
              icon={<LineChartOutlined />}
              onClick={() => setActiveView('prices')}
              style={activeView === 'prices' ? { backgroundColor: '#51B073', borderColor: '#51B073' } : {}}
            >
              {isFutureMode ? 'Prices & Volume' : 'Prices'}
            </Button>
            <Button
              type={activeView === 'difference' ? 'primary' : 'default'}
              icon={<BarChartOutlined />}
              onClick={() => setActiveView('difference')}
              style={activeView === 'difference' ? { backgroundColor: '#51B073', borderColor: '#51B073' } : {}}
            >
              Difference
            </Button>
          </Button.Group>

          {/* Effective Date Range */}
          <Horizontal gap={8} style={{ alignItems: 'center' }}>
            <Texto category='p2' appearance='medium'>Effective date:</Texto>
            <DatePicker.RangePicker
              value={effectiveDateRange ?? undefined}
              onChange={(range) => onEffectiveDateRangeChange?.(range as [Dayjs | null, Dayjs | null] | null)}
              allowClear
            />
          </Horizontal>

          {/* Granularity Selector */}
          <Horizontal gap={8} style={{ alignItems: 'center' }}>
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

          {/* Multi-select View */}
          <Horizontal gap={8} style={{ alignItems: 'center' }}>
            <Texto category='p2' appearance='medium'>
              View:
            </Texto>
            <Select
              mode='multiple'
              value={selectedDetails}
              onChange={(vals: string[]) => setSelectedDetails(vals.length > 0 ? vals : ['all'])}
              style={{ minWidth: 280, maxWidth: 420 }}
              maxTagCount={2}
              maxTagPlaceholder={(omitted) => `+${omitted.length} more`}
              options={viewOptions}
            />
          </Horizontal>

        </Horizontal>

        {/* Legend Controls */}
        <Horizontal gap={16} style={{ marginBottom: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Per-detail contract price groups */}
          {allAggregatedSeries.map(({ key, label }, detailIdx) => {
            const color = DETAIL_COLORS[detailIdx % DETAIL_COLORS.length]
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${color}22`,
                  backgroundColor: `${color}08`,
                }}
              >
                {/* Detail color swatch */}
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                <Texto category='p2' weight='600' style={{ color }}>
                  {label}
                </Texto>
                {/* Contract price toggle (solid line indicator) */}
                {activeView === 'prices' && (
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginLeft: '4px' }}
                    onClick={() => toggleSeries('contractPrice')}
                  >
                    {visibleSeries.contractPrice ? (
                      <EyeOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />
                    )}
                    <div style={{ width: 16, height: 2, backgroundColor: visibleSeries.contractPrice ? color : '#d9d9d9' }} />
                    <Texto category='p2' style={{ color: visibleSeries.contractPrice ? '#595959' : '#bfbfbf' }}>
                      Contract
                    </Texto>
                  </span>
                )}
                {/* Scenario indicators */}
                {nonReferenceScenarios.map((s, sIdx) => {
                  const visible = isScenarioVisible(s.id)
                  const dash = SCENARIO_DASH_PATTERNS[sIdx % SCENARIO_DASH_PATTERNS.length]
                  return (
                    <span
                      key={s.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginLeft: '4px' }}
                      onClick={() => toggleScenarioVisibility(s.id)}
                    >
                      {visible ? (
                        <EyeOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                      ) : (
                        <EyeInvisibleOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />
                      )}
                      <svg width='16' height='4'>
                        <line
                          x1='0' y1='2' x2='16' y2='2'
                          stroke={visible ? color : '#d9d9d9'}
                          strokeWidth='2'
                          strokeDasharray={dash}
                        />
                      </svg>
                      <Texto category='p2' style={{ color: visible ? '#595959' : '#bfbfbf' }}>
                        {s.name}
                      </Texto>
                    </span>
                  )
                })}
              </div>
            )
          })}

          {/* Reference line toggles */}
          <Horizontal
            gap={8} style={{ alignItems: 'center', cursor: 'pointer' }}
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
              {activeView === 'prices' ? 'Rack Average' : 'Rack Avg Diff'}
            </Texto>
            <div
              style={{
                backgroundColor: '#51B073',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              REF
            </div>
          </Horizontal>

          <Horizontal
            gap={8} style={{ alignItems: 'center', cursor: 'pointer' }}
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
              {activeView === 'prices' ? 'Spot Price' : 'Spot Diff'}
            </Texto>
          </Horizontal>

          {/* Scenario legend entries */}
          {nonReferenceScenarios.map((s, idx) => {
            const color = SCENARIO_COLORS[idx % SCENARIO_COLORS.length]
            const visible = isScenarioVisible(s.id)
            return (
              <Horizontal
                key={s.id}
                gap={8} style={{ alignItems: 'center', cursor: 'pointer' }}
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

                {/* Rack Average - Thick Reference Line */}
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

                {/* Spot Price - Dashed Reference Line */}
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

                {/* Per-detail contract price and scenario lines */}
                {allAggregatedSeries.map(({ key, label }, detailIdx) => {
                  const color = DETAIL_COLORS[detailIdx % DETAIL_COLORS.length]
                  return (
                    <Fragment key={key}>
                      {/* Contract Price — Area when single detail, Line when multiple */}
                      {visibleSeries.contractPrice && (
                        allAggregatedSeries.length === 1 ? (
                          <Area
                            yAxisId='price'
                            type='monotone'
                            dataKey={`cp-${key}`}
                            name={label}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.15}
                            strokeWidth={2}
                            dot={showDots ? { r: 3, fill: color } : false}
                            activeDot={{ r: 5 }}
                          />
                        ) : (
                          <Line
                            yAxisId='price'
                            type='monotone'
                            dataKey={`cp-${key}`}
                            name={label}
                            stroke={color}
                            strokeWidth={2}
                            dot={showDots ? { r: 3, fill: color } : false}
                            activeDot={{ r: 5 }}
                          />
                        )
                      )}
                      {/* Scenario lines for this detail */}
                      {nonReferenceScenarios
                        .filter((s) => isScenarioVisible(s.id))
                        .map((s, sIdx) => (
                          <Line
                            key={`scenario-${key}-${s.id}`}
                            yAxisId='price'
                            type='monotone'
                            dataKey={`scenario-${key}-${s.id}`}
                            name={allAggregatedSeries.length === 1 ? s.name : `${label} — ${s.name}`}
                            stroke={color}
                            strokeWidth={1.5}
                            strokeDasharray={SCENARIO_DASH_PATTERNS[sIdx % SCENARIO_DASH_PATTERNS.length]}
                            dot={false}
                            activeDot={{ r: 4 }}
                          />
                        ))}
                    </Fragment>
                  )
                })}
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

                {/* Per-detail difference lines */}
                {allAggregatedSeries.map(({ key, label }, detailIdx) => {
                  const color = DETAIL_COLORS[detailIdx % DETAIL_COLORS.length]
                  return (
                    <Fragment key={key}>
                      {/* Rack Avg Diff */}
                      {visibleSeries.rackAverage && (
                        <Line
                          type='monotone'
                          dataKey={`rackAvgDiff-${key}`}
                          name={allAggregatedSeries.length === 1 ? 'Rack Average Difference' : `${label} vs Rack Avg`}
                          stroke={color}
                          strokeWidth={2}
                          dot={showDots ? { r: 3, fill: color } : false}
                          activeDot={{ r: 5 }}
                        />
                      )}
                      {/* Spot Diff */}
                      {visibleSeries.spotPrice && (
                        <Line
                          type='monotone'
                          dataKey={`spotDiff-${key}`}
                          name={allAggregatedSeries.length === 1 ? 'Spot Price Difference' : `${label} vs Spot`}
                          stroke={color}
                          strokeWidth={2}
                          strokeDasharray='5 5'
                          dot={showDots ? { r: 3, fill: color } : false}
                          activeDot={{ r: 5 }}
                        />
                      )}
                      {/* Scenario diff lines */}
                      {nonReferenceScenarios
                        .filter((s) => isScenarioVisible(s.id))
                        .map((s, sIdx) => (
                          <Line
                            key={`scenarioDiff-${key}-${s.id}`}
                            type='monotone'
                            dataKey={`scenarioDiff-${key}-${s.id}`}
                            name={allAggregatedSeries.length === 1 ? `${s.name} Difference` : `${label} — ${s.name} Diff`}
                            stroke={color}
                            strokeWidth={1.5}
                            strokeDasharray={SCENARIO_DASH_PATTERNS[sIdx % SCENARIO_DASH_PATTERNS.length]}
                            dot={false}
                            activeDot={{ r: 4 }}
                          />
                        ))}
                    </Fragment>
                  )
                })}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Muted message when no comparison scenarios exist */}
      {!hasComparisonScenarios && (
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#fafafa',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
          }}
        >
          <Texto category='p1' appearance='medium'>
            Add a comparison scenario to see historical trend lines overlaid on this chart
          </Texto>
        </div>
      )}
    </div>
  )
}
