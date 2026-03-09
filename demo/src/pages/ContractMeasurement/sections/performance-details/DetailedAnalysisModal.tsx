import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Progress, Modal } from 'antd'
import {
  DashboardOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  FallOutlined,
} from '@ant-design/icons'
import type { DetailedAnalysisData } from '../../types/performanceDetails.types'

interface DetailedAnalysisModalProps {
  open: boolean
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

export function DetailedAnalysisModal({ open, onClose, data }: DetailedAnalysisModalProps) {
  // Calculate derived values only when data exists
  const product = data?.product
  const dailyLiftingData = data?.dailyLiftingData || []
  const dayOfWeekPattern = data?.dayOfWeekPattern || []
  const projectedCompletion = data?.projectedCompletion || ''
  const projectedShortfall = data?.projectedShortfall || 0
  const daysToTarget = data?.daysToTarget || 0

  // Fixed y-axis max for both charts
  const yMax = 15000

  // Generate Lower-of Impact waterfall data
  const waterfallData = (() => {
    if (!product) return []
    const baseSeed = product.id * 137
    const contractRevenue = Math.round(product.actualVolume * 2.45) // ~$2.45/gal contract terms
    const steps: { label: string; value: number; type: 'start' | 'loss' | 'end' }[] = []
    steps.push({ label: 'Contract\nTerms', value: contractRevenue, type: 'start' })

    // Generate 10 weekly loss periods where rack undercut contract
    let cumLoss = 0
    for (let i = 0; i < 10; i++) {
      let s = baseSeed + i * 2654435761
      s = ((s >>> 16) ^ s) * 0x45d9f3b
      s = ((s >>> 16) ^ s) & 0x7fffffff
      const loss = Math.round((s % 35000) + 3000) // $3k - $38k loss per week
      cumLoss += loss
      steps.push({ label: `Wk ${i + 1}`, value: -loss, type: 'loss' })
    }

    steps.push({ label: 'Realized', value: contractRevenue - cumLoss, type: 'end' })
    return steps
  })()

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={product ? `Detailed Analysis: ${product.productName} @ ${product.location}` : 'Detailed Analysis'}
      width={1000}
      destroyOnHidden
      footer={
        <Horizontal justifyContent='flex-end'>
          <GraviButton buttonText='Close' onClick={onClose} />
        </Horizontal>
      }
    >
      {product ? (
      <Vertical gap={24}>
        {/* Overview Metrics - 3 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* Performance Card */}
          <div style={cardStyle}>
            <Vertical gap={12}>
              <Horizontal gap={8} alignItems='center'>
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
            <Vertical gap={12}>
              <Horizontal gap={8} alignItems='center'>
                <ThunderboltOutlined style={{ fontSize: '16px', color: '#faad14' }} />
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Weekly Pace
                </Texto>
              </Horizontal>
              <Texto category='h3' weight='600'>
                {(product.dailyAverageLifting * 7).toLocaleString()}
              </Texto>
              <Texto category='p2' appearance='medium'>
                Required: {(product.requiredDailyPace * 7).toLocaleString()}
              </Texto>
              <Texto category='p2' style={{ color: product.paceVariance >= 0 ? '#52c41a' : '#cf1322' }}>
                {product.paceVariance >= 0 ? '+' : ''}
                {product.paceVariance.toFixed(1)}% vs required
              </Texto>
            </Vertical>
          </div>

          {/* Timeline Card */}
          <div style={cardStyle}>
            <Vertical gap={12}>
              <Horizontal gap={8} alignItems='center'>
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
            <Vertical gap={16} style={{ height: '100%' }}>
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
                  <Horizontal gap={16} style={{ marginTop: '8px' }}>
                    <Horizontal gap={6} alignItems='center'>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#1890ff', borderRadius: '2px' }} />
                      <Texto category='p2' appearance='medium'>
                        Actual
                      </Texto>
                    </Horizontal>
                    <Horizontal gap={6} alignItems='center'>
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
            <Vertical gap={16} style={{ height: '100%' }}>
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

        {/* Lower-of Impact Waterfall */}
        {waterfallData.length > 0 && (() => {
          const startValue = waterfallData[0].value
          const maxValue = startValue
          const chartHeight = 200
          const losses = waterfallData.filter(d => d.type === 'loss')
          const totalLoss = losses.reduce((sum, d) => sum + Math.abs(d.value), 0)
          const endValue = waterfallData[waterfallData.length - 1].value
          let runningTotal = startValue

          return (
            <div style={{ ...cardStyle, backgroundColor: '#fff' }}>
              <Vertical gap={16}>
                <Horizontal alignItems='center' justifyContent='space-between'>
                  <Horizontal gap={8} alignItems='center'>
                    <FallOutlined style={{ fontSize: '18px', color: '#cf1322' }} />
                    <Texto category='h5' weight='600'>
                      Lower-of Impact Analysis
                    </Texto>
                  </Horizontal>
                  <Horizontal gap={16}>
                    <Texto category='p2' appearance='medium'>
                      Total Impact: <span style={{ color: '#cf1322', fontWeight: 600 }}>-${totalLoss.toLocaleString()}</span>
                    </Texto>
                    <Texto category='p2' appearance='medium'>
                      Rack Won: <span style={{ fontWeight: 600 }}>{losses.length} of {waterfallData.length - 2} periods</span>
                    </Texto>
                  </Horizontal>
                </Horizontal>

                {/* Waterfall Chart */}
                <div style={{ position: 'relative', height: `${chartHeight + 40}px` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: `${chartHeight}px`, gap: '4px', paddingLeft: '60px' }}>
                    {waterfallData.map((step, index) => {
                      if (step.type === 'start') {
                        const barHeight = (step.value / maxValue) * chartHeight
                        return (
                          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Texto category='p2' weight='600' style={{ fontSize: '10px', marginBottom: '4px' }}>
                              ${(step.value / 1000000).toFixed(2)}M
                            </Texto>
                            <div style={{
                              width: '100%',
                              height: `${barHeight}px`,
                              backgroundColor: '#1890ff',
                              borderRadius: '4px 4px 0 0',
                              opacity: 0.85,
                            }} />
                          </div>
                        )
                      }
                      if (step.type === 'loss') {
                        const prevTotal = runningTotal
                        runningTotal += step.value // step.value is negative
                        const topOffset = ((maxValue - prevTotal) / maxValue) * chartHeight
                        const lossHeight = (Math.abs(step.value) / maxValue) * chartHeight

                        return (
                          <div key={index} style={{ flex: 1, position: 'relative', height: `${chartHeight}px` }}>
                            {/* Connector line from previous bar */}
                            <div style={{
                              position: 'absolute',
                              top: `${topOffset}px`,
                              left: '-2px',
                              width: 'calc(50% + 2px)',
                              height: '1px',
                              borderTop: '1px dashed #bfbfbf',
                            }} />
                            {/* Loss bar */}
                            <div style={{
                              position: 'absolute',
                              top: `${topOffset}px`,
                              left: '10%',
                              right: '10%',
                              height: `${Math.max(lossHeight, 4)}px`,
                              backgroundColor: '#cf1322',
                              borderRadius: '4px',
                              opacity: 0.85,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {lossHeight > 16 && (
                                <Texto category='p2' style={{ fontSize: '9px', color: '#fff', fontWeight: 600 }}>
                                  -${(Math.abs(step.value) / 1000).toFixed(0)}K
                                </Texto>
                              )}
                            </div>
                          </div>
                        )
                      }
                      // End bar
                      const barHeight = (step.value / maxValue) * chartHeight
                      return (
                        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: `${chartHeight}px`, position: 'relative' }}>
                          {/* Connector line */}
                          <div style={{
                            position: 'absolute',
                            top: `${((maxValue - endValue) / maxValue) * chartHeight}px`,
                            left: '-2px',
                            width: 'calc(50% + 2px)',
                            height: '1px',
                            borderTop: '1px dashed #bfbfbf',
                          }} />
                          <Texto category='p2' weight='600' style={{ fontSize: '10px', marginBottom: '4px' }}>
                            ${(step.value / 1000000).toFixed(2)}M
                          </Texto>
                          <div style={{
                            width: '100%',
                            height: `${barHeight}px`,
                            backgroundColor: '#52c41a',
                            borderRadius: '4px 4px 0 0',
                            opacity: 0.85,
                          }} />
                        </div>
                      )
                    })}
                  </div>
                  {/* X-axis labels */}
                  <div style={{ display: 'flex', gap: '4px', paddingLeft: '60px', marginTop: '8px' }}>
                    {waterfallData.map((step, index) => (
                      <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                        <Texto category='p2' appearance='medium' style={{ fontSize: '10px' }}>
                          {step.label}
                        </Texto>
                      </div>
                    ))}
                  </div>
                  {/* Y-axis labels */}
                  <div style={{ position: 'absolute', top: 0, left: 0, height: `${chartHeight}px`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '55px' }}>
                    <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>
                      ${(maxValue / 1000000).toFixed(1)}M
                    </Texto>
                    <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>
                      ${(maxValue / 2000000).toFixed(1)}M
                    </Texto>
                    <Texto category='p2' appearance='medium' style={{ fontSize: '10px', textAlign: 'right' }}>
                      $0
                    </Texto>
                  </div>
                </div>

                {/* Legend */}
                <Horizontal gap={20}>
                  <Horizontal gap={6} alignItems='center'>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#1890ff', borderRadius: '2px', opacity: 0.85 }} />
                    <Texto category='p2' appearance='medium'>Contract Terms Revenue</Texto>
                  </Horizontal>
                  <Horizontal gap={6} alignItems='center'>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#cf1322', borderRadius: '2px', opacity: 0.85 }} />
                    <Texto category='p2' appearance='medium'>Rack Undercut (Margin Erosion)</Texto>
                  </Horizontal>
                  <Horizontal gap={6} alignItems='center'>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#52c41a', borderRadius: '2px', opacity: 0.85 }} />
                    <Texto category='p2' appearance='medium'>Actual Realized Revenue</Texto>
                  </Horizontal>
                </Horizontal>
              </Vertical>
            </div>
          )
        })()}

        {/* Pace Analysis */}
        <div style={{ ...cardStyle, backgroundColor: '#fff' }}>
          <Vertical gap={16}>
            <Texto category='h5' weight='600'>
              Pace Analysis
            </Texto>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              <Vertical gap={4}>
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Current Pace
                </Texto>
                <Texto category='h4' weight='600'>
                  {(product.dailyAverageLifting * 7).toLocaleString()}/week
                </Texto>
              </Vertical>
              <Vertical gap={4}>
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Required Pace
                </Texto>
                <Texto category='h4' weight='600'>
                  {(product.requiredDailyPace * 7).toLocaleString()}/week
                </Texto>
              </Vertical>
              <Vertical gap={4}>
                <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Variance
                </Texto>
                <Texto category='h4' weight='600' style={{ color: product.paceVariance >= 0 ? '#52c41a' : '#cf1322' }}>
                  {product.paceVariance >= 0 ? '+' : ''}
                  {product.paceVariance.toFixed(1)}%
                </Texto>
              </Vertical>
              <Vertical gap={4}>
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

      </Vertical>
      ) : null}
    </Modal>
  )
}

export default DetailedAnalysisModal
