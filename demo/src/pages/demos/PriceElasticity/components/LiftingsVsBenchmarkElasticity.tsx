import { useState, useMemo, useCallback } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Radio, Select } from 'antd'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { SegmentationLevel } from '../data/elasticity.types'
import {
  PRODUCT_CURVE_PARAMS,
  generateFittedCurve,
  generateScatterData,
  formatPricePosition,
} from '../data/elasticity.data'
import { ConfidenceBadge } from './ConfidenceBadge'

type ViewMode = 'histogram' | 'trend' | 'elasticity'

export function LiftingsVsBenchmarkElasticity() {
  const [viewMode, setViewMode] = useState<ViewMode>('histogram')
  const [showOverlay, setShowOverlay] = useState(false)
  const [segmentation, setSegmentation] = useState<SegmentationLevel>('product-terminal')

  const curveParams = PRODUCT_CURVE_PARAMS
  const currentPrice = 0.038

  const fittedCurve = useMemo(
    () => generateFittedCurve(curveParams.elasticityCoefficient, curveParams.cliffThreshold, curveParams.sampleSize),
    [curveParams],
  )

  const scatterData = useMemo(
    () => generateScatterData(curveParams.elasticityCoefficient, curveParams.cliffThreshold, curveParams.sampleSize, 42),
    [curveParams],
  )

  // Histogram data (binned price delta vs volume)
  const histogramData = useMemo(() => {
    const bins: Record<string, { priceDelta: number; volume: number; count: number }> = {}
    const binWidth = 0.01

    scatterData.forEach((point) => {
      const binKey = (Math.round(point.pricePosition / binWidth) * binWidth).toFixed(2)
      if (!bins[binKey]) {
        bins[binKey] = { priceDelta: parseFloat(binKey), volume: 0, count: 0 }
      }
      bins[binKey].volume += point.volumeResponse
      bins[binKey].count++
    })

    return Object.values(bins)
      .map((b) => ({
        priceDelta: b.priceDelta,
        avgVolume: b.count > 0 ? b.volume / b.count : 0,
        label: formatPricePosition(b.priceDelta),
      }))
      .sort((a, b) => a.priceDelta - b.priceDelta)
  }, [scatterData])

  // Nivo scatter data for elasticity standalone mode
  const nivoData = useMemo(
    () => [
      {
        id: 'Observations',
        data: scatterData.map((d) => ({ x: d.pricePosition, y: d.volumeResponse })),
      },
    ],
    [scatterData],
  )

  // Quick metrics
  const avgDelta = useMemo(() => {
    const sum = scatterData.reduce((acc, d) => acc + d.pricePosition, 0)
    return sum / scatterData.length
  }, [scatterData])

  const avgLifting = useMemo(() => {
    const sum = scatterData.reduce((acc, d) => acc + d.volumeResponse, 0)
    return sum / scatterData.length
  }, [scatterData])

  const avgMargin = useMemo(() => {
    const sum = scatterData.reduce((acc, d) => acc + d.margin, 0)
    return sum / scatterData.length
  }, [scatterData])

  // Zone coloring layer for standalone elasticity chart
  const zoneLayer = useCallback(
    (props: { xScale: (v: number) => number; innerWidth: number; innerHeight: number }) => {
      const { xScale, innerHeight } = props
      const cliffX = xScale(curveParams.cliffThreshold)
      const cautionX = xScale(curveParams.cliffThreshold - 0.03)

      return (
        <g>
          <rect x={0} y={0} width={Math.max(0, cautionX)} height={innerHeight} fill="#52c41a" opacity={0.06} />
          <rect x={Math.max(0, cautionX)} y={0} width={Math.max(0, cliffX - cautionX)} height={innerHeight} fill="#faad14" opacity={0.08} />
          <rect x={Math.max(0, cliffX)} y={0} width={Math.max(0, props.innerWidth - cliffX)} height={innerHeight} fill="#ff4d4f" opacity={0.08} />
        </g>
      )
    },
    [curveParams.cliffThreshold],
  )

  const curveLineLayer = useCallback(
    (props: { xScale: (v: number) => number; yScale: (v: number) => number }) => {
      const { xScale, yScale } = props
      const path = fittedCurve.map((p) => `${xScale(p.pricePosition)},${yScale(p.fittedVolume)}`).join(' L ')
      return <path d={`M ${path}`} fill="none" stroke="#1890ff" strokeWidth={2.5} />
    },
    [fittedCurve],
  )

  const confidenceBandLayer = useCallback(
    (props: { xScale: (v: number) => number; yScale: (v: number) => number }) => {
      const { xScale, yScale } = props
      const upperPath = fittedCurve.map((p) => `${xScale(p.pricePosition)},${yScale(p.confidenceUpper)}`).join(' L ')
      const lowerPath = fittedCurve.slice().reverse().map((p) => `${xScale(p.pricePosition)},${yScale(p.confidenceLower)}`).join(' L ')
      return <path d={`M ${upperPath} L ${lowerPath} Z`} fill="#1890ff" opacity={0.1} />
    },
    [fittedCurve],
  )

  const markersLayer = useCallback(
    (props: { xScale: (v: number) => number; yScale: (v: number) => number; innerHeight: number }) => {
      const { xScale, yScale, innerHeight } = props
      const cliffX = xScale(curveParams.cliffThreshold)
      const optimalX = xScale(curveParams.optimalPricePoint)
      const currentX = xScale(currentPrice)

      const optPt = fittedCurve.reduce((c, p) => (Math.abs(p.pricePosition - curveParams.optimalPricePoint) < Math.abs(c.pricePosition - curveParams.optimalPricePoint) ? p : c))
      const curPt = fittedCurve.reduce((c, p) => (Math.abs(p.pricePosition - currentPrice) < Math.abs(c.pricePosition - currentPrice) ? p : c))

      return (
        <g>
          <line x1={cliffX} y1={0} x2={cliffX} y2={innerHeight} stroke="#ff4d4f" strokeWidth={2} strokeDasharray="6,4" />
          <text x={cliffX + 4} y={14} fill="#ff4d4f" fontSize={11} fontWeight={600}>CLIFF</text>
          <line x1={optimalX} y1={0} x2={optimalX} y2={innerHeight} stroke="#52c41a" strokeWidth={2} strokeDasharray="6,4" />
          <text x={optimalX + 4} y={14} fill="#52c41a" fontSize={11} fontWeight={600}>OPTIMAL</text>
          <circle cx={optimalX} cy={yScale(optPt.fittedVolume)} r={6} fill="#52c41a" stroke="#fff" strokeWidth={2} />
          <line x1={currentX} y1={0} x2={currentX} y2={innerHeight} stroke="var(--theme-color-1, #0C5A58)" strokeWidth={2.5} />
          <circle cx={currentX} cy={yScale(curPt.fittedVolume)} r={7} fill="var(--theme-color-1, #0C5A58)" stroke="#fff" strokeWidth={2} />
          <text x={currentX + 4} y={innerHeight - 6} fill="var(--theme-color-1, #0C5A58)" fontSize={11} fontWeight={600}>CURRENT</text>
        </g>
      )
    },
    [curveParams, currentPrice, fittedCurve],
  )

  return (
    <Horizontal style={{ height: '100%' }}>
      {/* Quick Metrics panel */}
      <Vertical
        style={{
          width: '140px',
          borderRight: '1px solid #e8e8e8',
          padding: '16px 12px',
          gap: '16px',
        }}
      >
        <QuickMetric icon="$" label="Avg Delta" value={formatPricePosition(avgDelta)} />
        <QuickMetric icon="V" label="Avg Lifting" value={`${avgLifting.toFixed(1)}%`} />
        <QuickMetric icon="M" label="Avg Margin" value={`$${avgMargin.toFixed(4)}`} />
      </Vertical>

      {/* Chart area */}
      <Vertical flex="1" style={{ padding: '12px', gap: '8px' }}>
        {/* Controls header */}
        <Horizontal justifyContent="space-between" alignItems="center">
          <Horizontal style={{ gap: '12px' }} alignItems="center">
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              size="small"
              buttonStyle="solid"
            >
              <Radio.Button value="histogram">Histogram</Radio.Button>
              <Radio.Button value="trend">Trend</Radio.Button>
              <Radio.Button value="elasticity">Elasticity</Radio.Button>
            </Radio.Group>

            {viewMode === 'histogram' && (
              <Horizontal alignItems="center" style={{ gap: '6px' }}>
                <input
                  type="checkbox"
                  checked={showOverlay}
                  onChange={(e) => setShowOverlay(e.target.checked)}
                  id="overlay-toggle"
                />
                <label htmlFor="overlay-toggle">
                  <Texto category="p2" appearance="medium" style={{ cursor: 'pointer' }}>
                    Show Elasticity Overlay
                  </Texto>
                </label>
              </Horizontal>
            )}
          </Horizontal>

          <Horizontal style={{ gap: '8px' }} alignItems="center">
            <Select
              value={segmentation}
              onChange={setSegmentation}
              size="small"
              style={{ width: 160 }}
              options={[
                { value: 'product', label: 'Product Level' },
                { value: 'product-terminal', label: 'Product @ Terminal' },
                { value: 'product-customer', label: 'Product / Customer' },
              ]}
            />
            {(viewMode === 'elasticity' || showOverlay) && (
              <ConfidenceBadge
                level={curveParams.confidenceLevel}
                sampleSize={curveParams.sampleSize}
                rSquared={curveParams.rSquared}
                calculationDate={curveParams.calculationDate}
              />
            )}
          </Horizontal>
        </Horizontal>

        {/* Chart content */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '16px',
            minHeight: '350px',
          }}
        >
          {viewMode === 'histogram' && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={histogramData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} label={{ value: 'Price Delta to Benchmark', position: 'bottom', offset: 10, fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: 'Avg Volume %', angle: -90, position: 'insideLeft', offset: 5, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '6px', border: '1px solid #e8e8e8' }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Avg Volume']}
                />
                <Bar dataKey="avgVolume" fill="var(--theme-color-1, #0C5A58)" opacity={0.7} radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {viewMode === 'elasticity' && (
            <div style={{ height: '100%', width: '100%' }}>
              <ResponsiveScatterPlot
                data={nivoData}
                margin={{ top: 24, right: 30, bottom: 56, left: 60 }}
                xScale={{ type: 'linear', min: -0.15, max: 0.15 }}
                yScale={{ type: 'linear', min: 0, max: 100 }}
                colors={['rgba(24, 144, 255, 0.35)']}
                nodeSize={6}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  legend: 'Price Position vs Benchmark',
                  legendPosition: 'middle' as const,
                  legendOffset: 44,
                  format: (value: number) => formatPricePosition(value),
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  legend: 'Volume Response',
                  legendPosition: 'middle' as const,
                  legendOffset: -48,
                  format: (value: number) => `${value}%`,
                }}
                useMesh={true}
                tooltip={({ node }) => (
                  <div
                    style={{
                      background: 'white',
                      padding: '8px 12px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    }}
                  >
                    <Texto category="p2" weight="600">
                      Price: {formatPricePosition(node.data.x as number)}
                    </Texto>
                    <Texto category="p2" appearance="medium">
                      Volume: {(node.data.y as number).toFixed(1)}%
                    </Texto>
                  </div>
                )}
                layers={[
                  zoneLayer as never,
                  'grid',
                  'axes',
                  confidenceBandLayer as never,
                  curveLineLayer as never,
                  'nodes',
                  markersLayer as never,
                  'mesh',
                ]}
              />
            </div>
          )}

          {viewMode === 'trend' && (
            <Vertical height="100%" justifyContent="center" alignItems="center">
              <Texto category="p1" appearance="medium">
                Trend view - existing time-series chart (unchanged)
              </Texto>
              <Texto category="p2" appearance="medium">
                Shows liftings and price delta over time
              </Texto>
            </Vertical>
          )}
        </div>

        {/* Legend for elasticity mode */}
        {(viewMode === 'elasticity' || showOverlay) && (
          <Horizontal style={{ gap: '16px' }} justifyContent="center">
            <LegendItem color="#52c41a" label="Optimal Zone" />
            <LegendItem color="#faad14" label="Caution" />
            <LegendItem color="#ff4d4f" label="Cliff / Danger" />
            <LegendItem color="#1890ff" label="Fitted Curve" shape="line" />
            <LegendItem color="rgba(24, 144, 255, 0.15)" label="Confidence Band" shape="rect" />
          </Horizontal>
        )}
      </Vertical>
    </Horizontal>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function QuickMetric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Vertical style={{ gap: '4px' }}>
      <Horizontal alignItems="center" style={{ gap: '6px' }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: 'var(--theme-color-1, #0C5A58)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          {icon}
        </div>
        <Texto category="p2" appearance="medium" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </Texto>
      </Horizontal>
      <Texto category="h5" weight="600" style={{ paddingLeft: '30px' }}>
        {value}
      </Texto>
    </Vertical>
  )
}

function LegendItem({ color, label, shape = 'circle' }: { color: string; label: string; shape?: 'circle' | 'line' | 'rect' }) {
  return (
    <Horizontal style={{ gap: '4px' }} alignItems="center">
      {shape === 'circle' && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />}
      {shape === 'line' && <div style={{ width: 14, height: 3, backgroundColor: color }} />}
      {shape === 'rect' && <div style={{ width: 14, height: 10, backgroundColor: color, borderRadius: 2 }} />}
      <Texto category="p2" appearance="medium">
        {label}
      </Texto>
    </Horizontal>
  )
}
