import { useState, useMemo } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Segmented, Select } from 'antd'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import type { SellerRFP } from '../types/sellerRfp.types'
import { formatPrice, formatMarginCpg, getMarginColor } from '../types/sellerRfp.types'
import { generatePriceHistory, generateSensitivityData } from '../data/sellerRfp.data'
import type { PriceHistoryPoint, SensitivityRow } from '../data/sellerRfp.data'
import styles from './AnalysisTab.module.css'

type Lookback = '3mo' | '6mo' | '12mo' | '24mo'
type Aggregation = 'D' | 'W' | 'M' | 'Q'

const LOOKBACK_MONTHS: Record<Lookback, number> = {
  '3mo': 3,
  '6mo': 6,
  '12mo': 12,
  '24mo': 24,
}

interface AnalysisTabProps {
  rfp: SellerRFP
}

function aggregateData(points: PriceHistoryPoint[], aggregation: Aggregation): PriceHistoryPoint[] {
  if (aggregation === 'D') return points

  const buckets: Record<string, PriceHistoryPoint[]> = {}

  for (const p of points) {
    const d = new Date(p.date)
    let key: string

    if (aggregation === 'W') {
      const startOfWeek = new Date(d)
      startOfWeek.setDate(d.getDate() - d.getDay())
      key = startOfWeek.toISOString().split('T')[0]
    } else if (aggregation === 'M') {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    } else {
      const q = Math.floor(d.getMonth() / 3)
      key = `${d.getFullYear()}-Q${q + 1}`
    }

    if (!buckets[key]) buckets[key] = []
    buckets[key].push(p)
  }

  return Object.entries(buckets).map(([key, pts]) => {
    const avg = (fn: (p: PriceHistoryPoint) => number) =>
      Math.round((pts.reduce((s, p) => s + fn(p), 0) / pts.length) * 10000) / 10000

    return {
      date: key,
      costPrice: avg((p) => p.costPrice),
      salePrice: avg((p) => p.salePrice),
      rackAverage: avg((p) => p.rackAverage),
      margin: Math.round(pts.reduce((s, p) => s + p.margin, 0) / pts.length * 100) / 100,
    }
  })
}

export function AnalysisTab({ rfp }: AnalysisTabProps) {
  const detailOptions = useMemo(
    () => rfp.details.map((d) => ({ value: d.id, label: `${d.product} — ${d.terminal}` })),
    [rfp.details],
  )

  const [selectedDetailId, setSelectedDetailId] = useState<string>(rfp.details[0]?.id || '')
  const [lookback, setLookback] = useState<Lookback>('12mo')
  const [aggregation, setAggregation] = useState<Aggregation>('D')

  const selectedDetail = rfp.details.find((d) => d.id === selectedDetailId) || rfp.details[0]

  const chartData = useMemo(() => {
    if (!selectedDetail) return []
    const months = LOOKBACK_MONTHS[lookback]
    const raw = generatePriceHistory(selectedDetail.product, months)
    return aggregateData(raw, aggregation)
  }, [selectedDetail, lookback, aggregation])

  const sensitivityData = useMemo<SensitivityRow[]>(() => {
    if (!selectedDetail) return []
    const currentMargin = selectedDetail.margin ?? 3.5
    const totalVolume = rfp.details.reduce((s, d) => s + (d.volume || 0), 0)
    return generateSensitivityData(currentMargin, totalVolume)
  }, [selectedDetail, rfp.details])

  const formatXAxis = (value: string) => {
    if (aggregation === 'Q') return value
    if (aggregation === 'M') {
      const [y, m] = value.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[parseInt(m) - 1]} '${y.slice(2)}`
    }
    const d = new Date(value)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Vertical gap={32} style={{ overflow: 'visible' }}>
      {/* Historical Price Comparison */}
      <Vertical gap={16} style={{ overflow: 'visible' }}>
        <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Texto category="h5" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
            Historical Price Comparison
          </Texto>
          <Horizontal gap={12} style={{ alignItems: 'center' }}>
            <Select
              value={selectedDetailId}
              onChange={setSelectedDetailId}
              options={detailOptions}
              style={{ width: 280 }}
              size="small"
            />
            <Segmented
              value={lookback}
              onChange={(v) => setLookback(v as Lookback)}
              options={[
                { value: '3mo', label: '3M' },
                { value: '6mo', label: '6M' },
                { value: '12mo', label: '12M' },
                { value: '24mo', label: '24M' },
              ]}
              size="small"
            />
            <Segmented
              value={aggregation}
              onChange={(v) => setAggregation(v as Aggregation)}
              options={[
                { value: 'D', label: 'D' },
                { value: 'W', label: 'W' },
                { value: 'M', label: 'M' },
                { value: 'Q', label: 'Q' },
              ]}
              size="small"
            />
          </Horizontal>
        </Horizontal>

        <div className={styles['chart-container']}>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                fontSize={11}
                tick={{ fill: '#999' }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                fontSize={11}
                tick={{ fill: '#999' }}
                width={60}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `$${value.toFixed(4)}`,
                  name === 'costPrice' ? 'Cost' : name === 'salePrice' ? 'Sale' : 'Rack Average',
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e8e8e8' }}
              />
              <Legend
                formatter={(value) =>
                  value === 'costPrice' ? 'Cost Price' : value === 'salePrice' ? 'Sale Price' : 'Rack Average'
                }
                wrapperStyle={{ fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="costPrice"
                stroke="#1677ff"
                fill="#e6f4ff"
                strokeWidth={1.5}
                fillOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="salePrice"
                stroke="#52c41a"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="rackAverage"
                stroke="#faad14"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
              {selectedDetail?.costPrice && (
                <ReferenceLine
                  y={selectedDetail.costPrice}
                  stroke="#1677ff"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{ value: 'Current Cost', fill: '#1677ff', fontSize: 10, position: 'left' }}
                />
              )}
              {selectedDetail?.salePrice && (
                <ReferenceLine
                  y={selectedDetail.salePrice}
                  stroke="#52c41a"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{ value: 'Current Sale', fill: '#52c41a', fontSize: 10, position: 'right' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Vertical>

      {/* Margin Sensitivity */}
      <Vertical gap={16} style={{ overflow: 'visible' }}>
        <Texto category="h5" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Margin Sensitivity Analysis
        </Texto>
        <Texto category="p2" appearance="medium">
          Shows how differential adjustments affect margin and monthly dollar impact for {selectedDetail?.product || 'selected product'} at {selectedDetail?.terminal || 'selected terminal'}.
        </Texto>

        <div className={styles['sensitivity-table']}>
          <table>
            <thead>
              <tr>
                <th>Adjustment</th>
                <th>Adjusted Margin</th>
                <th>Monthly $ Impact</th>
              </tr>
            </thead>
            <tbody>
              {sensitivityData.map((row) => {
                const marginColor = getMarginColor(row.newMargin)
                return (
                  <tr key={row.adjustment} className={row.isCurrent ? styles['current-row'] : ''}>
                    <td>
                      <Texto category="p2" weight={row.isCurrent ? '700' : '400'}>
                        {row.adjustment === 0 ? 'Current' : `${row.adjustment > 0 ? '+' : ''}${row.adjustment}¢/gal`}
                      </Texto>
                    </td>
                    <td>
                      <Texto
                        category="p2"
                        weight="600"
                        style={{
                          color: marginColor === 'green' ? '#52c41a' : marginColor === 'yellow' ? '#faad14' : marginColor === 'red' ? '#ff4d4f' : undefined,
                        }}
                      >
                        {formatMarginCpg(row.newMargin)}
                      </Texto>
                    </td>
                    <td>
                      <Texto category="p2" weight="500">
                        ${row.monthlyImpact.toLocaleString()}
                      </Texto>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Vertical>
    </Vertical>
  )
}
