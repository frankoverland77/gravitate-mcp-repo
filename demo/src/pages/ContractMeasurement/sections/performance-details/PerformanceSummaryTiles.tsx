import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  WarningOutlined,
  AlertOutlined,
} from '@ant-design/icons'
import type { PerformanceSummary } from '../../types/performanceDetails.types'

interface PerformanceSummaryTilesProps {
  summary: PerformanceSummary
}

const cardStyle = {
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
  format?: 'number' | 'percentage'
}

function MetricTile({ icon, iconColor = '#8c8c8c', label, value, valueColor, format = 'number' }: MetricTileProps) {
  const formattedValue = format === 'percentage' ? `${Number(value).toFixed(1)}%` : value

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
          {formattedValue}
        </Texto>
      </Vertical>
    </div>
  )
}

export function PerformanceSummaryTiles({ summary }: PerformanceSummaryTilesProps) {
  return (
    <Vertical style={{ gap: '16px' }}>
      {/* Section Header */}
      <div>
        <Texto category='h4' weight='600'>
          Performance Summary
        </Texto>
        <Texto category='p2' appearance='medium'>
          Key metrics across all product-location combinations
        </Texto>
      </div>

      {/* 7 Metric Tiles in responsive grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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

        <MetricTile icon={<MinusCircleOutlined />} iconColor='#8c8c8c' label='At Benchmark' value={summary.atBenchmark} />

        <MetricTile
          icon={<CloseCircleOutlined />}
          iconColor='#cf1322'
          label='Below Benchmark'
          value={summary.belowBenchmark}
          valueColor='#cf1322'
        />

        <MetricTile
          icon={<DashboardOutlined />}
          label='Avg Performance'
          value={summary.avgPerformance}
          format='percentage'
        />

        <MetricTile
          icon={<WarningOutlined />}
          iconColor='#faad14'
          label='Under-performing'
          value={summary.underPerforming}
          valueColor='#faad14'
        />

        <MetricTile
          icon={<AlertOutlined />}
          iconColor='#fa8c16'
          label='At Risk'
          value={summary.atRisk}
          valueColor='#fa8c16'
        />
      </div>
    </Vertical>
  )
}

export default PerformanceSummaryTiles
