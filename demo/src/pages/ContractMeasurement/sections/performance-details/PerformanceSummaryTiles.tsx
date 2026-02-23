import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import type { PerformanceSummary } from '../../types/performanceDetails.types'

interface PerformanceSummaryTilesProps {
  summary: PerformanceSummary
}

const cardStyle = {
  flex: 1,
  minWidth: 0,
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

interface MetricTileProps {
  icon: React.ReactNode
  iconColor?: string
  label: string
  value: number | string
  valueColor?: string
}

function MetricTile({ icon, iconColor = '#8c8c8c', label, value, valueColor }: MetricTileProps) {
  return (
    <div style={cardStyle}>
      <Vertical style={{ gap: '12px' }}>
        <Horizontal alignItems='center' style={{ gap: '8px' }}>
          <span style={{ fontSize: '16px', color: iconColor }}>{icon}</span>
          <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
          </Texto>
        </Horizontal>
        <Texto category='h3' weight='600' style={{ color: valueColor }}>
          {value}
        </Texto>
      </Vertical>
    </div>
  )
}

export function PerformanceSummaryTiles({ summary }: PerformanceSummaryTilesProps) {
  const marginColor = summary.totalMargin >= 0 ? '#52c41a' : '#cf1322'
  const marginPrefix = summary.totalMargin >= 0 ? '+' : ''
  const profitColor = summary.totalProfitability >= 0 ? '#52c41a' : '#cf1322'
  const profitPrefix = summary.totalProfitability >= 0 ? '+' : ''

  return (
    <div>
      {/* Section Header */}
      <div style={{ marginBottom: '16px' }}>
        <Texto category='h4' weight='600'>
          Performance Summary
        </Texto>
        <Texto category='p2' appearance='medium'>
          Key metrics across all product-location combinations
        </Texto>
      </div>

      {/* 6 Metric Tiles in single row */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
        }}
      >
        <MetricTile icon={<AppstoreOutlined />} label='Total Details' value={summary.totalDetails} />

        <MetricTile
          icon={<CheckCircleOutlined />}
          iconColor='#52c41a'
          label='Above Benchmark'
          value={summary.aboveBenchmark}
          valueColor='#52c41a'
        />

        <MetricTile
          icon={<CloseCircleOutlined />}
          iconColor='#cf1322'
          label='Below Benchmark'
          value={summary.belowBenchmark}
          valueColor='#cf1322'
        />

        <MetricTile
          icon={<BarChartOutlined />}
          label='Volume Lifted'
          value={summary.volumeLifted.toLocaleString()}
        />

        <MetricTile
          icon={<DollarOutlined />}
          label='Total Margin'
          value={`${marginPrefix}$${summary.totalMargin.toFixed(4)}`}
          valueColor={marginColor}
        />

        <MetricTile
          icon={<RiseOutlined />}
          label='Total Profitability'
          value={`${profitPrefix}$${Math.round(summary.totalProfitability).toLocaleString()}`}
          valueColor={profitColor}
        />
      </div>
    </div>
  )
}

export default PerformanceSummaryTiles
