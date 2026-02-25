import { useState, useMemo } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Select, Table } from 'antd'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { SegmentationLevel } from '../data/elasticity.types'
import { PRODUCT_CURVE_PARAMS } from '../data/elasticity.data'
import { ConfidenceBadge } from './ConfidenceBadge'

interface MarginElasticityDataPoint {
  period: string
  volume: number
  margin: number
  pricePosition: number
  zone: 'optimal' | 'caution' | 'danger'
}

export function LiftingsVsMarginElasticity() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [segmentation, setSegmentation] = useState<SegmentationLevel>('product-terminal')

  const curveParams = PRODUCT_CURVE_PARAMS

  // Generate time-series data with zone annotations
  const timeSeriesData: MarginElasticityDataPoint[] = useMemo(() => {
    const data: MarginElasticityDataPoint[] = []
    const periods = 24

    for (let i = 0; i < periods; i++) {
      const weekNum = periods - i
      const seed = Math.sin(i * 127.1 + 311.7) * 43758.5453
      const noise = (seed - Math.floor(seed)) - 0.5

      const pricePosition = 0.03 + noise * 0.06
      const volume = 70 + noise * 20

      const zone: MarginElasticityDataPoint['zone'] =
        pricePosition >= curveParams.cliffThreshold
          ? 'danger'
          : pricePosition >= curveParams.cliffThreshold - 0.03
            ? 'caution'
            : 'optimal'

      data.push({
        period: `W${weekNum}`,
        volume: Number(Math.max(20, Math.min(100, volume)).toFixed(1)),
        margin: Number((pricePosition * 0.8 + 0.04).toFixed(4)),
        pricePosition: Number(pricePosition.toFixed(4)),
        zone,
      })
    }

    return data.reverse()
  }, [curveParams])

  // Table detail data (sorted by period descending)
  const tableData = useMemo(
    () =>
      timeSeriesData
        .slice()
        .reverse()
        .map((d, idx) => ({ ...d, key: idx })),
    [timeSeriesData],
  )

  const tableColumns = [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      width: 70,
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
      width: 80,
      align: 'right' as const,
      render: (value: number) => `$${value.toFixed(4)}`,
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      width: 70,
      align: 'right' as const,
      render: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      title: 'Zone',
      dataIndex: 'zone',
      key: 'zone',
      width: 80,
      render: (zone: string) => {
        const colors: Record<string, { bg: string; text: string; label: string }> = {
          optimal: { bg: '#f6ffed', text: '#52c41a', label: 'Optimal' },
          caution: { bg: '#fffbe6', text: '#faad14', label: 'Caution' },
          danger: { bg: '#fff2f0', text: '#ff4d4f', label: 'Danger' },
        }
        const c = colors[zone] || colors.optimal
        return (
          <span
            style={{
              padding: '1px 8px',
              borderRadius: '10px',
              backgroundColor: c.bg,
              color: c.text,
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            {c.label}
          </span>
        )
      },
    },
  ]

  // Custom dot component for zone coloring on chart
  const renderDot = (props: { cx: number; cy: number; payload: MarginElasticityDataPoint }) => {
    const { cx, cy, payload } = props
    const colors: Record<string, string> = {
      optimal: '#52c41a',
      caution: '#faad14',
      danger: '#ff4d4f',
    }
    const isSelected = payload.period === selectedPeriod
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isSelected ? 6 : 3}
        fill={colors[payload.zone] || '#52c41a'}
        stroke={isSelected ? '#fff' : 'none'}
        strokeWidth={isSelected ? 2 : 0}
      />
    )
  }

  return (
    <Horizontal style={{ height: '100%' }}>
      {/* Detail table panel */}
      <Vertical
        style={{
          width: '320px',
          minWidth: '280px',
          maxWidth: '350px',
          borderRight: '1px solid #e8e8e8',
          padding: '12px',
          gap: '8px',
        }}
      >
        <Texto category="h6" weight="600">
          Period Details
        </Texto>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Table
            dataSource={tableData}
            columns={tableColumns}
            size="small"
            pagination={false}
            sticky
            onRow={(record) => ({
              onClick: () => setSelectedPeriod(record.period === selectedPeriod ? null : record.period),
              style: {
                cursor: 'pointer',
                backgroundColor: record.period === selectedPeriod ? '#e6f7ff' : undefined,
              },
            })}
          />
        </div>
      </Vertical>

      {/* Chart area */}
      <Vertical flex="1" style={{ padding: '12px', gap: '8px' }}>
        <Horizontal justifyContent="space-between" alignItems="center">
          <Vertical style={{ gap: '2px' }}>
            <Texto category="h6" weight="600">
              Volume vs Margin with Elasticity Zones
            </Texto>
            <Texto category="p2" appearance="medium">
              Each point colored by zone position on elasticity curve
            </Texto>
          </Vertical>
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
            <ConfidenceBadge
              level={curveParams.confidenceLevel}
              sampleSize={curveParams.sampleSize}
              rSquared={curveParams.rSquared}
              calculationDate={curveParams.calculationDate}
            />
          </Horizontal>
        </Horizontal>

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
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timeSeriesData} margin={{ top: 10, right: 40, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11 }}
                label={{ value: 'Period', position: 'bottom', offset: 10, fontSize: 12 }}
              />
              <YAxis
                yAxisId="volume"
                tick={{ fontSize: 11 }}
                label={{ value: 'Volume %', angle: -90, position: 'insideLeft', offset: 5, fontSize: 12 }}
              />
              <YAxis
                yAxisId="margin"
                orientation="right"
                tick={{ fontSize: 11 }}
                label={{ value: 'Margin ($)', angle: 90, position: 'insideRight', offset: 5, fontSize: 12 }}
                tickFormatter={(v: number) => `$${v.toFixed(3)}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '6px', border: '1px solid #e8e8e8' }}
                formatter={(value: number, name: string) => {
                  if (name === 'volume') return [`${value.toFixed(1)}%`, 'Volume']
                  if (name === 'margin') return [`$${value.toFixed(4)}`, 'Margin']
                  return [value, name]
                }}
              />
              <ReferenceLine yAxisId="margin" y={0} stroke="#d9d9d9" />
              <Area
                yAxisId="volume"
                dataKey="volume"
                fill="#82ca9d"
                fillOpacity={0.2}
                stroke="none"
              />
              <Line
                yAxisId="margin"
                dataKey="margin"
                stroke="var(--theme-color-1, #0C5A58)"
                strokeWidth={2}
                dot={renderDot as never}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Zone legend */}
        <Horizontal style={{ gap: '16px' }} justifyContent="center">
          <Horizontal style={{ gap: '4px' }} alignItems="center">
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#52c41a' }} />
            <Texto category="p2" appearance="medium">Optimal Zone</Texto>
          </Horizontal>
          <Horizontal style={{ gap: '4px' }} alignItems="center">
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#faad14' }} />
            <Texto category="p2" appearance="medium">Caution</Texto>
          </Horizontal>
          <Horizontal style={{ gap: '4px' }} alignItems="center">
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff4d4f' }} />
            <Texto category="p2" appearance="medium">Danger Zone</Texto>
          </Horizontal>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
