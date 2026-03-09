import { useMemo, useCallback, useRef } from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { Vertical, Texto, Horizontal } from '@gravitate-js/excalibrr'
import type { ElasticityCurveParams } from '../data/elasticity.types'
import { generateFittedCurve, generateScatterData, formatPricePosition } from '../data/elasticity.data'
import { ConfidenceBadge } from './ConfidenceBadge'

interface ElasticityCurveChartProps {
  curveParams: ElasticityCurveParams
  currentPricePosition: number
  title?: string
  subtitle?: string
  seedOffset?: number
  onPriceHover?: (pricePosition: number | null) => void
  height?: string
}

export function ElasticityCurveChart({
  curveParams,
  currentPricePosition,
  title,
  subtitle,
  seedOffset = 0,
  height = '380px',
}: ElasticityCurveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const fittedCurve = useMemo(
    () =>
      generateFittedCurve(curveParams.elasticityCoefficient, curveParams.cliffThreshold, curveParams.sampleSize),
    [curveParams],
  )

  const scatterData = useMemo(
    () =>
      generateScatterData(
        curveParams.elasticityCoefficient,
        curveParams.cliffThreshold,
        curveParams.sampleSize,
        seedOffset,
      ),
    [curveParams, seedOffset],
  )

  const chartData = useMemo(
    () => [
      {
        id: 'Observations',
        data: scatterData.map((d) => ({ x: d.pricePosition, y: d.volumeResponse })),
      },
    ],
    [scatterData],
  )

  // Zone color bands layer
  const zoneLayer = useCallback(
    (props: { xScale: (v: number) => number; innerWidth: number; innerHeight: number }) => {
      const { xScale, innerWidth, innerHeight } = props
      const cliffX = xScale(curveParams.cliffThreshold)
      const cautionX = xScale(curveParams.cliffThreshold - 0.03)

      return (
        <g>
          {/* Green zone - optimal */}
          <rect x={0} y={0} width={Math.max(0, cautionX)} height={innerHeight} fill="#52c41a" opacity={0.06} />
          {/* Yellow zone - caution */}
          <rect
            x={Math.max(0, cautionX)}
            y={0}
            width={Math.max(0, cliffX - cautionX)}
            height={innerHeight}
            fill="#faad14"
            opacity={0.08}
          />
          {/* Red zone - danger */}
          <rect
            x={Math.max(0, cliffX)}
            y={0}
            width={Math.max(0, innerWidth - cliffX)}
            height={innerHeight}
            fill="#ff4d4f"
            opacity={0.08}
          />
        </g>
      )
    },
    [curveParams.cliffThreshold],
  )

  // Confidence band layer
  const confidenceBandLayer = useCallback(
    (props: { xScale: (v: number) => number; yScale: (v: number) => number }) => {
      const { xScale, yScale } = props

      const upperPath = fittedCurve.map((p) => `${xScale(p.pricePosition)},${yScale(p.confidenceUpper)}`).join(' L ')
      const lowerPath = fittedCurve
        .slice()
        .reverse()
        .map((p) => `${xScale(p.pricePosition)},${yScale(p.confidenceLower)}`)
        .join(' L ')

      return <path d={`M ${upperPath} L ${lowerPath} Z`} fill="#1890ff" opacity={0.1} />
    },
    [fittedCurve],
  )

  // Fitted curve line layer
  const curveLineLayer = useCallback(
    (props: { xScale: (v: number) => number; yScale: (v: number) => number }) => {
      const { xScale, yScale } = props

      const path = fittedCurve.map((p) => `${xScale(p.pricePosition)},${yScale(p.fittedVolume)}`).join(' L ')

      return <path d={`M ${path}`} fill="none" stroke="#1890ff" strokeWidth={2.5} />
    },
    [fittedCurve],
  )

  // Key markers layer (cliff, optimal, current price)
  const markersLayer = useCallback(
    (props: { xScale: (v: number) => number; yScale: (v: number) => number; innerHeight: number }) => {
      const { xScale, yScale, innerHeight } = props

      const cliffX = xScale(curveParams.cliffThreshold)
      const optimalX = xScale(curveParams.optimalPricePoint)
      const currentX = xScale(currentPricePosition)

      // Find volume at optimal and current price
      const optimalPoint = fittedCurve.reduce((closest, p) =>
        Math.abs(p.pricePosition - curveParams.optimalPricePoint) <
        Math.abs(closest.pricePosition - curveParams.optimalPricePoint)
          ? p
          : closest,
      )
      const currentPoint = fittedCurve.reduce((closest, p) =>
        Math.abs(p.pricePosition - currentPricePosition) < Math.abs(closest.pricePosition - currentPricePosition)
          ? p
          : closest,
      )

      return (
        <g>
          {/* Cliff threshold line */}
          <line x1={cliffX} y1={0} x2={cliffX} y2={innerHeight} stroke="#ff4d4f" strokeWidth={2} strokeDasharray="6,4" />
          <text x={cliffX + 4} y={14} fill="#ff4d4f" fontSize={11} fontWeight={600}>
            CLIFF
          </text>

          {/* Optimal price line */}
          <line
            x1={optimalX}
            y1={0}
            x2={optimalX}
            y2={innerHeight}
            stroke="#52c41a"
            strokeWidth={2}
            strokeDasharray="6,4"
          />
          <text x={optimalX + 4} y={14} fill="#52c41a" fontSize={11} fontWeight={600}>
            OPTIMAL
          </text>

          {/* Optimal price dot */}
          <circle cx={optimalX} cy={yScale(optimalPoint.fittedVolume)} r={6} fill="#52c41a" stroke="#fff" strokeWidth={2} />

          {/* Current price indicator */}
          <line
            x1={currentX}
            y1={0}
            x2={currentX}
            y2={innerHeight}
            stroke="var(--theme-color-1, #0C5A58)"
            strokeWidth={2.5}
          />
          <circle
            cx={currentX}
            cy={yScale(currentPoint.fittedVolume)}
            r={7}
            fill="var(--theme-color-1, #0C5A58)"
            stroke="#fff"
            strokeWidth={2}
          />
          <text
            x={currentX + 4}
            y={innerHeight - 6}
            fill="var(--theme-color-1, #0C5A58)"
            fontSize={11}
            fontWeight={600}
          >
            CURRENT
          </text>
        </g>
      )
    },
    [curveParams, currentPricePosition, fittedCurve],
  )

  return (
    <Vertical gap={8}>
      {(title || subtitle) && (
        <Vertical gap={2}>
          <Horizontal justifyContent="space-between" alignItems="center">
            {title && (
              <Texto category="h5" weight="600">
                {title}
              </Texto>
            )}
            <ConfidenceBadge level={curveParams.confidenceLevel} sampleSize={curveParams.sampleSize} />
          </Horizontal>
          {subtitle && (
            <Texto category="p2" appearance="medium">
              {subtitle}
            </Texto>
          )}
        </Vertical>
      )}
      <div
        ref={containerRef}
        style={{
          height,
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div style={{ height: '100%', width: '100%' }}>
          <ResponsiveScatterPlot
            data={chartData}
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
      </div>
      {/* Legend */}
      <Horizontal gap={16} justifyContent="center">
        <Horizontal gap={4} alignItems="center">
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#52c41a' }} />
          <Texto category="p2" appearance="medium">
            Optimal Zone
          </Texto>
        </Horizontal>
        <Horizontal gap={4} alignItems="center">
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#faad14' }} />
          <Texto category="p2" appearance="medium">
            Caution
          </Texto>
        </Horizontal>
        <Horizontal gap={4} alignItems="center">
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff4d4f' }} />
          <Texto category="p2" appearance="medium">
            Cliff / Danger
          </Texto>
        </Horizontal>
        <Horizontal gap={4} alignItems="center">
          <div style={{ width: 12, height: 3, backgroundColor: '#1890ff' }} />
          <Texto category="p2" appearance="medium">
            Fitted Curve
          </Texto>
        </Horizontal>
        <Horizontal gap={4} alignItems="center">
          <div style={{ width: 12, height: 12, backgroundColor: '#1890ff', opacity: 0.15, borderRadius: 2 }} />
          <Texto category="p2" appearance="medium">
            Confidence Band
          </Texto>
        </Horizontal>
      </Horizontal>
    </Vertical>
  )
}
