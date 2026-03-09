import { useMemo } from 'react'
import { Vertical, Texto, Horizontal } from '@gravitate-js/excalibrr'
import { Slider } from 'antd'
import type { ElasticityCurveParams } from '../data/elasticity.types'
import { generateFittedCurve, formatPricePosition, formatCents } from '../data/elasticity.data'

interface WhatIfPanelProps {
  curveParams: ElasticityCurveParams
  currentPricePosition: number
  whatIfPricePosition: number
  onWhatIfChange: (value: number) => void
}

interface ComparisonColumn {
  label: string
  pricePosition: number
  volume: number
  margin: number
  revenue: number
  color: string
  highlight?: boolean
}

export function WhatIfPanel({ curveParams, currentPricePosition, whatIfPricePosition, onWhatIfChange }: WhatIfPanelProps) {
  const fittedCurve = useMemo(
    () => generateFittedCurve(curveParams.elasticityCoefficient, curveParams.cliffThreshold, curveParams.sampleSize),
    [curveParams],
  )

  const getVolumeAtPrice = (price: number): number => {
    const closest = fittedCurve.reduce((best, p) =>
      Math.abs(p.pricePosition - price) < Math.abs(best.pricePosition - price) ? p : best,
    )
    return closest.fittedVolume
  }

  const columns: ComparisonColumn[] = useMemo(() => {
    const currentVol = getVolumeAtPrice(currentPricePosition)
    const optimalVol = getVolumeAtPrice(curveParams.optimalPricePoint)
    const whatIfVol = getVolumeAtPrice(whatIfPricePosition)

    const baseVolume = 10000 // normalized base volume in gal

    return [
      {
        label: 'Current',
        pricePosition: currentPricePosition,
        volume: currentVol,
        margin: currentPricePosition * 0.8 + 0.04,
        revenue: (currentVol / 100) * baseVolume * (currentPricePosition * 0.8 + 0.04),
        color: 'var(--theme-color-1, #0C5A58)',
      },
      {
        label: 'Optimal',
        pricePosition: curveParams.optimalPricePoint,
        volume: optimalVol,
        margin: curveParams.optimalPricePoint * 0.8 + 0.04,
        revenue: (optimalVol / 100) * baseVolume * (curveParams.optimalPricePoint * 0.8 + 0.04),
        color: '#52c41a',
      },
      {
        label: 'What-If',
        pricePosition: whatIfPricePosition,
        volume: whatIfVol,
        margin: whatIfPricePosition * 0.8 + 0.04,
        revenue: (whatIfVol / 100) * baseVolume * (whatIfPricePosition * 0.8 + 0.04),
        color: '#722ed1',
        highlight: true,
      },
    ]
  }, [currentPricePosition, curveParams, whatIfPricePosition, fittedCurve])

  const sliderMarks: Record<string, string> = {
    '-0.12': '-12c',
    [String(curveParams.optimalPricePoint)]: 'Opt',
    [String(curveParams.cliffThreshold)]: 'Cliff',
    '0.12': '+12c',
  }

  return (
    <Vertical gap={16} style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e8e8e8' }}>
      <Vertical gap={2}>
        <Texto category="h5" weight="600">
          What-If Simulation
        </Texto>
        <Texto category="p2" appearance="medium">
          Drag to model projected impact
        </Texto>
      </Vertical>

      {/* Slider */}
      <Vertical gap={4} style={{ padding: '0 4px' }}>
        <Texto
          category="p2"
          appearance="medium"
          style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}
        >
          Price Position
        </Texto>
        <Slider
          min={-0.12}
          max={0.12}
          step={0.001}
          value={whatIfPricePosition}
          onChange={onWhatIfChange}
          marks={sliderMarks as never}
          tipFormatter={(value: number | undefined) => (value !== undefined ? formatPricePosition(value) : '')}
          trackStyle={{ backgroundColor: '#722ed1' }}
          handleStyle={{ borderColor: '#722ed1' }}
        />
      </Vertical>

      {/* Three-column comparison */}
      <Vertical gap={12}>
        <Horizontal gap={8}>
          {columns.map((col) => (
            <Vertical
              key={col.label}
              flex="1"
              gap={8} style={{ padding: '12px',
                borderRadius: '6px',
                backgroundColor: col.highlight ? '#f9f0ff' : '#ffffff',
                border: col.highlight ? '1px solid #d3adf7' : '1px solid #e8e8e8' }}
            >
              <Horizontal gap={6} alignItems="center">
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: col.color,
                  }}
                />
                <Texto category="p2" weight="600" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {col.label}
                </Texto>
              </Horizontal>

              <Vertical gap={6}>
                <MetricRow label="Price" value={formatPricePosition(col.pricePosition)} />
                <MetricRow label="Volume" value={`${col.volume.toFixed(1)}%`} />
                <MetricRow label="Margin" value={formatCents(col.margin)} />
                <MetricRow label="Rev Index" value={`$${col.revenue.toFixed(0)}`} bold />
              </Vertical>
            </Vertical>
          ))}
        </Horizontal>

        {/* Delta indicators */}
        <Horizontal justifyContent="space-between" style={{ padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e8e8e8' }}>
          <Vertical gap={2} alignItems="center" flex="1">
            <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
              vs Current
            </Texto>
            <DeltaValue value={columns[2].revenue - columns[0].revenue} prefix="$" />
          </Vertical>
          <div style={{ width: 1, backgroundColor: '#e8e8e8' }} />
          <Vertical gap={2} alignItems="center" flex="1">
            <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
              vs Optimal
            </Texto>
            <DeltaValue value={columns[2].revenue - columns[1].revenue} prefix="$" />
          </Vertical>
          <div style={{ width: 1, backgroundColor: '#e8e8e8' }} />
          <Vertical gap={2} alignItems="center" flex="1">
            <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
              Volume Change
            </Texto>
            <DeltaValue value={columns[2].volume - columns[0].volume} suffix="%" />
          </Vertical>
        </Horizontal>
      </Vertical>
    </Vertical>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function MetricRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Horizontal justifyContent="space-between" alignItems="center">
      <Texto category="p2" appearance="medium" style={{ fontSize: '12px' }}>
        {label}
      </Texto>
      <Texto category="p2" weight={bold ? '700' : '500'} style={{ fontSize: '12px' }}>
        {value}
      </Texto>
    </Horizontal>
  )
}

function DeltaValue({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const isPositive = value >= 0
  const color = isPositive ? '#52c41a' : '#ff4d4f'
  const arrow = isPositive ? '+' : ''

  return (
    <Texto category="p2" weight="600" style={{ color, fontSize: '13px' }}>
      {arrow}
      {prefix}
      {value.toFixed(1)}
      {suffix}
    </Texto>
  )
}
