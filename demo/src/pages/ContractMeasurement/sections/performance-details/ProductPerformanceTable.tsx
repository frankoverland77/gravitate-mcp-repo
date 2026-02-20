import { useMemo } from 'react'
import { GraviGrid, BBDTag } from '@gravitate-js/excalibrr'
import {
  ShopOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  RiseOutlined,
  FallOutlined,
  LineOutlined,
  RightOutlined,
} from '@ant-design/icons'
import type { ProductPerformanceRecord } from '../../types/performanceDetails.types'

interface ProductPerformanceTableProps {
  data: ProductPerformanceRecord[]
  onRowClick: (record: ProductPerformanceRecord) => void
}

// Status labels for BBDTag
const statusLabels: Record<string, string> = {
  ahead: 'AHEAD',
  'on-track': 'ON-TRACK',
  behind: 'BEHIND',
  critical: 'CRITICAL',
}

// Mini sparkline component for trend visualization
function MiniSparkline({ data }: { data: number[] }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: '24px' }}>
      {data.slice(-10).map((value, index) => {
        const height = ((value - min) / range) * 100
        return (
          <div
            key={index}
            style={{
              width: '4px',
              height: `${Math.max(height, 10)}%`,
              backgroundColor: '#1890ff',
              borderRadius: '1px',
              opacity: 0.4 + index * 0.06,
            }}
          />
        )
      })}
    </div>
  )
}

export function ProductPerformanceTable({ data, onRowClick }: ProductPerformanceTableProps) {
  const columnDefs = useMemo(
    () => [
      {
        field: 'productName',
        headerName: 'PRODUCT & LOCATION',
        width: 220,
        cellRenderer: (params: any) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShopOutlined style={{ fontSize: '14px', color: '#8c8c8c' }} />
              <span style={{ fontWeight: 600 }}>{params.data.productName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <EnvironmentOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
              <span style={{ fontSize: '12px', color: '#595959' }}>{params.data.location}</span>
            </div>
          </div>
        ),
        sortable: true,
      },
      {
        field: 'fulfillmentPercentage',
        headerName: 'PERFORMANCE',
        width: 180,
        cellRenderer: (params: any) => {
          const pct = params.data.fulfillmentPercentage
          const status = params.data.performanceStatus
          const barColor =
            status === 'critical' ? '#cf1322' : status === 'behind' ? '#faad14' : status === 'ahead' ? '#52c41a' : '#1890ff'

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600 }}>{pct.toFixed(1)}%</span>
                <BBDTag
                  success={status === 'ahead'}
                  warning={status === 'behind'}
                  error={status === 'critical'}
                  theme1={status === 'on-track'}
                  style={{ width: 'fit-content' }}
                >
                  {statusLabels[status]}
                </BBDTag>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#e8e8e8',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    height: '100%',
                    backgroundColor: barColor,
                    borderRadius: '3px',
                  }}
                />
              </div>
              <span style={{ fontSize: '11px', color: '#595959' }}>
                {params.data.actualVolume.toLocaleString()} / {params.data.targetVolume.toLocaleString()}
              </span>
            </div>
          )
        },
        sortable: true,
      },
      {
        field: 'dailyAverageLifting',
        headerName: 'DAILY AVERAGE',
        width: 140,
        cellRenderer: (params: any) => {
          const variance = params.data.paceVariance
          const varianceColor = variance >= 0 ? '#52c41a' : '#cf1322'

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 600 }}>{params.data.dailyAverageLifting.toLocaleString()}</span>
              <span style={{ fontSize: '11px', color: '#595959' }}>
                Target: {params.data.requiredDailyPace.toLocaleString()}
              </span>
              <span style={{ fontSize: '11px', color: varianceColor }}>
                {variance >= 0 ? '+' : ''}
                {variance.toFixed(1)}% pace
              </span>
            </div>
          )
        },
        sortable: true,
      },
      {
        field: 'benchmarkPrice',
        headerName: 'BENCHMARK $/GAL',
        width: 130,
        cellRenderer: (params: any) => (
          <span style={{ fontWeight: 600 }}>${params.value.toFixed(2)}</span>
        ),
        sortable: true,
      },
      {
        field: 'varianceVsBenchmark',
        headerName: 'Δ VS BENCHMARK',
        width: 150,
        cellRenderer: (params: any) => {
          const value = params.value
          const isAbove = value > 0
          const isAt = value === 0
          const color = isAbove ? '#52c41a' : isAt ? '#8c8c8c' : '#cf1322'
          const Icon = isAbove ? ArrowUpOutlined : isAt ? MinusOutlined : ArrowDownOutlined
          const label = isAbove ? 'Above Benchmark' : isAt ? 'At Benchmark' : 'Below Benchmark'

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon style={{ color, fontSize: '12px' }} />
                <span style={{ fontWeight: 600, color }}>
                  {value >= 0 ? '+' : ''}
                  {value.toFixed(1)}&#162;
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#595959' }}>{label}</span>
            </div>
          )
        },
        sortable: true,
      },
      {
        field: 'riskScore',
        headerName: 'RISK',
        width: 100,
        cellRenderer: (params: any) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <BBDTag
              success={params.data.riskLevel === 'low'}
              warning={params.data.riskLevel === 'medium'}
              error={params.data.riskLevel === 'high' || params.data.riskLevel === 'critical'}
              style={{ width: 'fit-content' }}
            >
              {params.value}
            </BBDTag>
            <span style={{ fontSize: '11px', color: '#595959', textTransform: 'uppercase' }}>
              {params.data.riskLevel}
            </span>
          </div>
        ),
        sortable: true,
      },
      {
        field: 'trend',
        headerName: 'TREND',
        width: 120,
        cellRenderer: (params: any) => {
          const trend = params.value
          const TrendIcon =
            trend === 'improving' ? RiseOutlined : trend === 'declining' ? FallOutlined : LineOutlined
          const iconColor = trend === 'improving' ? '#52c41a' : trend === 'declining' ? '#cf1322' : '#8c8c8c'

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendIcon style={{ color: iconColor }} />
                <span style={{ textTransform: 'capitalize' }}>{trend}</span>
              </div>
              <MiniSparkline data={params.data.trendData} />
            </div>
          )
        },
      },
      {
        headerName: '',
        width: 60,
        pinned: 'right' as const,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <RightOutlined
              style={{
                fontSize: '16px',
                color: '#595959',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onClick={() => onRowClick(params.data)}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#262626')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#595959')}
            />
          </div>
        ),
      },
    ],
    [onRowClick]
  )

  const agPropOverrides = useMemo(
    () => ({
      domLayout: 'autoHeight' as const,
      headerHeight: 40,
      rowHeight: 70,
      suppressRowClickSelection: true,
      onRowClicked: (event: any) => {
        if (event.data) {
          onRowClick(event.data)
        }
      },
    }),
    [onRowClick]
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Product Performance',
      hideActiveFilters: true,
    }),
    []
  )

  return (
    <div style={{ marginTop: '16px' }}>
      <GraviGrid
          rowData={data}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          storageKey='ProductPerformanceGrid'
        />
    </div>
  )
}

export default ProductPerformanceTable
