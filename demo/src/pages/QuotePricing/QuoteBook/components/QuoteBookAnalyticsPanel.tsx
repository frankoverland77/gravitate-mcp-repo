import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const mockChartData = [
  { name: 'Mon', value: 45000 },
  { name: 'Tue', value: 52000 },
  { name: 'Wed', value: 38000 },
  { name: 'Thu', value: 61000 },
  { name: 'Fri', value: 55000 },
]

interface QuoteBookAnalyticsPanelProps {
  visible: boolean
  selectedRow?: any
}

export function QuoteBookAnalyticsPanel({ visible, selectedRow }: QuoteBookAnalyticsPanelProps) {
  return (
    <div style={{
      height: visible ? '280px' : '0px',
      overflow: 'hidden',
      transition: 'height 300ms ease',
      borderBottom: visible ? '1px solid var(--gray-200)' : 'none',
    }}>
      <Vertical style={{ padding: '12px 16px', height: '100%' }}>
        <Horizontal justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
          <Texto category="h5" weight="600">Quote Analytics</Texto>
          <Select
            style={{ width: 220 }}
            defaultValue="liftings_vs_benchmark"
            options={[
              { value: 'liftings_vs_benchmark', label: 'Liftings vs Benchmark' },
              { value: 'liftings_vs_margin', label: 'Liftings vs Margin' },
              { value: 'customer_liftings', label: 'Customer Liftings' },
              { value: 'competitor_prices', label: 'Competitor Prices' },
              { value: 'allocation', label: 'Allocation' },
            ]}
          />
        </Horizontal>
        {selectedRow ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--theme-color-1)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Vertical justifyContent="center" alignItems="center" flex="1">
            <Texto appearance="medium">Select a row to view analytics</Texto>
          </Vertical>
        )}
      </Vertical>
    </div>
  )
}
