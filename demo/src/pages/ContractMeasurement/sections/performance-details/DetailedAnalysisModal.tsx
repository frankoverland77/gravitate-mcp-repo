import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Progress, Modal } from 'antd'
import {
  DashboardOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  BulbOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import type { DetailedAnalysisData } from '../../types/performanceDetails.types'

interface DetailedAnalysisModalProps {
  visible: boolean
  onClose: () => void
  data: DetailedAnalysisData | null
}

const cardStyle = {
  backgroundColor: '#f5f5f5',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '20px',
}

const chartCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '20px',
  height: '280px',
}

export function DetailedAnalysisModal({ visible, onClose, data }: DetailedAnalysisModalProps) {
  // Calculate derived values only when data exists
  const product = data?.product
  const dailyLiftingData = data?.dailyLiftingData || []
  const dayOfWeekPattern = data?.dayOfWeekPattern || []
  const projectedCompletion = data?.projectedCompletion || ''
  const projectedShortfall = data?.projectedShortfall || 0
  const daysToTarget = data?.daysToTarget || 0
  const recommendations = data?.recommendations || []

  // Fixed y-axis max for both charts
  const yMax = 15000

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title={product ? `Detailed Analysis: ${product.productName} @ ${product.location}` : 'Detailed Analysis'}
      width={1000}
      destroyOnClose
      footer={
        <Horizontal justifyContent='flex-end'>
          <GraviButton buttonText='Close' onClick={onClose} />
        </Horizontal>
      }
    >
      {product ? (
      <Vertical style={{ gap: '24px' }}>
        {/* Overview Metrics - 3 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* Performance Card */}
          <div style={cardStyle}>
            <Vertical style={{ gap: '12px' }}>
              <Horizontal alignItems='center' style={{ gap: '8px' }}>
                <DashboardOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Performance
                </Texto>
              </Horizontal>
              <Texto category='h3' weight='600'>
                {product.fulfillmentPercentage.toFixed(1)}%
              </Texto>
              <Progress
                percent={Math.min(product.fulfillmentPercentage, 100)}
                size='small'
                showInfo={false}
                strokeColor={product.fulfillmentPercentage >= 90 ? '#52c41a' : product.fulfillmentPercentage >= 70 ? '#1890ff' : '#cf1322'}
              />
              <Texto category='p2' appearance='medium'>
                {product.actualVolume.toLocaleString()} / {product.targetVolume.toLocaleString()}
              </Texto>
            </Vertical>
          </div>

          {/* Daily Pace Card */}
          <div style={cardStyle}>
            <Vertical style={{ gap: '12px' }}>
              <Horizontal alignItems='center' style={{ gap: '8px' }}>
                <ThunderboltOutlined style={{ fontSize: '16px', color: '#faad14' }} />
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Daily Pace
                </Texto>
              </Horizontal>
              <Texto category='h3' weight='600'>
                {product.dailyAverageLifting.toLocaleString()}
              </Texto>
              <Texto category='p2' appearance='medium'>
                Required: {product.requiredDailyPace.toLocaleString()}
              </Texto>
              <Texto category='p2' style={{ color: product.paceVariance >= 0 ? '#52c41a' : '#cf1322' }}>
                {product.paceVariance >= 0 ? '+' : ''}
                {product.paceVariance.toFixed(1)}% vs required
              </Texto>
            </Vertical>
          </div>

          {/* Timeline Card */}
          <div style={cardStyle}>
            <Vertical style={{ gap: '12px' }}>
              <Horizontal alignItems='center' style={{ gap: '8px' }}>
                <CalendarOutlined style={{ fontSize: '16px', color: '#722ed1' }} />
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Timeline
                </Texto>
              </Horizontal>
              <Texto category='h3' weight='600'>
                {daysToTarget > 0 ? `${daysToTarget} days` : 'Complete'}
              </Texto>
              <Texto category='p2' appearance='medium'>
                Est. completion: {projectedCompletion}
              </Texto>
              {projectedShortfall > 0 && (
                <Texto category='p2' style={{ color: '#cf1322' }}>
                  Shortfall: {projectedShortfall.toLocaleString()}
                </Texto>
              )}
            </Vertical>
          </div>
        </div>

        {/* Charts Row - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Daily Lifting Chart */}
          <div style={chartCardStyle}>
            <Vertical style={{ gap: '16px', height: '100%' }}>
              <Texto category='h5' weight='600'>
                Daily Lifting (30 Days)
              </Texto>
              <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                {/* Y-axis labels */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '24px', marginRight: '8px', width: '40px', flexShrink: 0 }}>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>15,000</Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>10,000</Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>5,000</Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>0</Texto>
                </div>
                {/* Chart area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2px', borderLeft: '1px solid #d9d9d9', borderBottom: '1px solid #d9d9d9' }}>
                    {dailyLiftingData.slice(-15).map((d, index) => {
                      const chartHeight = 160
                      const actualHeight = Math.max((d.actual / yMax) * chartHeight, 2)
                      const targetBottom = (d.target / yMax) * chartHeight
                      return (
                        <div key={index} style={{ flex: 1, position: 'relative', height: `${chartHeight}px` }}>
                          {/* Target line */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: `${targetBottom}px`,
                              left: 0,
                              right: 0,
                              height: '2px',
                              backgroundColor: '#cf1322',
                              opacity: 0.5,
                            }}
                          />
                          {/* Actual bar */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: '10%',
                              right: '10%',
                              height: `${actualHeight}px`,
                              backgroundColor: d.actual >= d.target ? '#52c41a' : '#1890ff',
                              borderRadius: '2px 2px 0 0',
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                  {/* Legend */}
                  <Horizontal style={{ gap: '16px', marginTop: '8px' }}>
                    <Horizontal alignItems='center' style={{ gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#1890ff', borderRadius: '2px' }} />
                      <Texto category='p2' appearance='medium'>
                        Actual
                      </Texto>
                    </Horizontal>
                    <Horizontal alignItems='center' style={{ gap: '6px' }}>
                      <div style={{ width: '12px', height: '2px', backgroundColor: '#cf1322' }} />
                      <Texto category='p2' appearance='medium'>
                        Target
                      </Texto>
                    </Horizontal>
                  </Horizontal>
                </div>
              </div>
            </Vertical>
          </div>

          {/* Day of Week Pattern */}
          <div style={chartCardStyle}>
            <Vertical style={{ gap: '16px', height: '100%' }}>
              <Texto category='h5' weight='600'>
                Day of Week Pattern
              </Texto>
              <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
                {/* Y-axis labels */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '24px', marginRight: '8px', width: '40px', flexShrink: 0 }}>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>15,000</Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>10,000</Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>5,000</Texto>
                  <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>0</Texto>
                </div>
                {/* Chart area */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', gap: '8px', paddingBottom: '24px', borderLeft: '1px solid #d9d9d9', borderBottom: '1px solid #d9d9d9', marginBottom: '0px' }}>
                  {dayOfWeekPattern.map((d, index) => {
                    const chartHeight = 160
                    const barHeight = Math.max((d.avgVolume / yMax) * chartHeight, 2)
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: `${barHeight}px`,
                            backgroundColor: '#722ed1',
                            borderRadius: '4px 4px 0 0',
                            opacity: 0.7 + (index % 2) * 0.15,
                          }}
                        />
                        <Texto category='p2' appearance='medium' style={{ fontSize: '11px' }}>
                          {d.day}
                        </Texto>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Vertical>
          </div>
        </div>

        {/* Pace Analysis */}
        <div style={{ ...cardStyle, backgroundColor: '#fff' }}>
          <Vertical style={{ gap: '16px' }}>
            <Texto category='h5' weight='600'>
              Pace Analysis
            </Texto>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              <Vertical style={{ gap: '4px' }}>
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Current Pace
                </Texto>
                <Texto category='h4' weight='600'>
                  {product.dailyAverageLifting.toLocaleString()}/day
                </Texto>
              </Vertical>
              <Vertical style={{ gap: '4px' }}>
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Required Pace
                </Texto>
                <Texto category='h4' weight='600'>
                  {product.requiredDailyPace.toLocaleString()}/day
                </Texto>
              </Vertical>
              <Vertical style={{ gap: '4px' }}>
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Variance
                </Texto>
                <Texto category='h4' weight='600' style={{ color: product.paceVariance >= 0 ? '#52c41a' : '#cf1322' }}>
                  {product.paceVariance >= 0 ? '+' : ''}
                  {product.paceVariance.toFixed(1)}%
                </Texto>
              </Vertical>
              <Vertical style={{ gap: '4px' }}>
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Trend
                </Texto>
                <Texto category='h4' weight='600' style={{ textTransform: 'capitalize' }}>
                  {product.trend}
                </Texto>
              </Vertical>
            </div>
          </Vertical>
        </div>

        {/* Recommendations */}
        <div style={{ ...cardStyle, backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
          <Vertical style={{ gap: '16px' }}>
            <Horizontal alignItems='center' style={{ gap: '8px' }}>
              <BulbOutlined style={{ fontSize: '18px', color: '#52c41a' }} />
              <Texto category='h5' weight='600'>
                Recommendations
              </Texto>
            </Horizontal>
            <Vertical style={{ gap: '12px' }}>
              {recommendations.map((rec, index) => (
                <Horizontal key={index} alignItems='flex-start' style={{ gap: '8px' }}>
                  <CheckCircleOutlined style={{ fontSize: '14px', color: '#52c41a', marginTop: '3px' }} />
                  <Texto category='p1'>{rec}</Texto>
                </Horizontal>
              ))}
            </Vertical>
          </Vertical>
        </div>
      </Vertical>
      ) : null}
    </Modal>
  )
}

export default DetailedAnalysisModal
