import { useState } from 'react'
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

type AnalyticsData = {
  readinessPct: number
  hardCount: number
  softCount: number
  cleanCount: number
  total: number
  flaggedComponents: { name: string; severity: 'hard' | 'soft'; count: number }[]
  worstOffenders: { rowId: number; quote: string; location: string; deviation: string; excCount: number; type: 'hard' | 'soft' }[]
}

interface QuoteBookAnalyticsPanelProps {
  visible: boolean
  selectedRow?: any
  analyticsData: AnalyticsData
  onSelectRow?: (id: number) => void
}

function SeverityCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      padding: '8px 12px',
      borderRadius: 6,
      borderLeft: `3px solid ${color}`,
      background: 'var(--gray-50)',
    }}>
      <Texto weight="700" style={{ fontSize: 16, color }}>{count}</Texto>
      <Texto appearance="medium" style={{ fontSize: 11 }}>{label}</Texto>
    </div>
  )
}

export function QuoteBookAnalyticsPanel({ visible, selectedRow, analyticsData, onSelectRow }: QuoteBookAnalyticsPanelProps) {
  const [selectedView, setSelectedView] = useState('liftings_vs_benchmark')

  const isExceptions = selectedView === 'exceptions'
  const { readinessPct, hardCount, softCount, cleanCount, total, flaggedComponents, worstOffenders } = analyticsData
  const progressColor = readinessPct >= 80 ? '#16a34a' : readinessPct >= 50 ? '#d97706' : '#dc2626'

  return (
    <div style={{
      height: visible ? (isExceptions ? '310px' : '280px') : '0px',
      overflow: 'hidden',
      transition: 'height 300ms ease',
      borderBottom: visible ? '1px solid var(--gray-200)' : 'none',
    }}>
      <Vertical style={{ padding: '12px 16px', height: '100%' }}>
        <Horizontal justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
          <Texto category="h5" weight="600">Quote Analytics</Texto>
          <Select
            style={{ width: 220 }}
            value={selectedView}
            onChange={setSelectedView}
            options={[
              { value: 'liftings_vs_benchmark', label: 'Liftings vs Benchmark' },
              { value: 'liftings_vs_margin', label: 'Liftings vs Margin' },
              { value: 'customer_liftings', label: 'Customer Liftings' },
              { value: 'competitor_prices', label: 'Competitor Prices' },
              { value: 'allocation', label: 'Allocation' },
              { value: 'exceptions', label: 'Exceptions' },
            ]}
          />
        </Horizontal>
        {isExceptions ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            flex: 1,
            overflow: 'auto',
          }}>
            {/* Publish Readiness card */}
            <div style={{
              border: '1px solid var(--gray-200)',
              borderRadius: 8,
              padding: 16,
              background: 'var(--bg-1)',
            }}>
              <Texto weight="600" style={{ fontSize: 13, marginBottom: 12 }}>
                Publish Readiness
              </Texto>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
                {/* Left: progress */}
                <div>
                  <Texto category="h4" weight="700" style={{ color: progressColor, marginBottom: 4 }}>
                    {readinessPct}% Publish Ready
                  </Texto>
                  <Texto appearance="medium" style={{ fontSize: 11, marginBottom: 8 }}>
                    {cleanCount} of {total} rows · {hardCount + softCount} with active exceptions
                  </Texto>
                  {/* Progress bar */}
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--gray-100)', overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ width: `${readinessPct}%`, height: '100%', borderRadius: 4, background: progressColor }} />
                  </div>
                  {/* Flagged components */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {flaggedComponents.slice(0, 5).map(c => (
                      <Horizontal key={c.name} alignItems="center" style={{ gap: '6px' }}>
                        <span style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: c.severity === 'hard' ? '#dc2626' : '#d97706',
                          flexShrink: 0,
                        }} />
                        <Texto appearance="medium" style={{ fontSize: 11 }}>{c.name} ({c.count})</Texto>
                      </Horizontal>
                    ))}
                  </div>
                </div>
                {/* Right: severity cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 110 }}>
                  <SeverityCard label="Hard" count={hardCount} color="#dc2626" />
                  <SeverityCard label="Soft" count={softCount} color="#d97706" />
                  <SeverityCard label="Clean" count={cleanCount} color="#16a34a" />
                </div>
              </div>
            </div>

            {/* Worst Offenders card */}
            <div style={{
              border: '1px solid var(--gray-200)',
              borderRadius: 8,
              padding: 16,
              background: 'var(--bg-1)',
            }}>
              <Texto weight="600" style={{ fontSize: 13, marginBottom: 12 }}>
                Worst Offenders
              </Texto>
              {worstOffenders.length === 0 ? (
                <Texto appearance="medium" style={{ fontSize: 12 }}>No exceptions found.</Texto>
              ) : (
                <>
                  {/* Mini table header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 80px 1fr 30px 40px',
                    gap: 4,
                    padding: '4px 0',
                    borderBottom: '1px solid var(--gray-200)',
                    fontSize: 10,
                    color: 'var(--gray-400)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 600,
                  }}>
                    <span>Quote</span>
                    <span>Location</span>
                    <span>Deviation</span>
                    <span>Exc</span>
                    <span>Type</span>
                  </div>
                  {/* Rows */}
                  {worstOffenders.map(row => (
                    <div
                      key={row.quote}
                      onClick={() => onSelectRow?.(row.rowId)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 80px 1fr 30px 40px',
                        gap: 4,
                        padding: '6px 0',
                        borderBottom: '1px solid var(--gray-50)',
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-50)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ fontWeight: 500 }}>{row.quote}</span>
                      <Texto appearance="medium" style={{ fontSize: 12 }}>{row.location}</Texto>
                      <span style={{ color: '#dc2626', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>
                        {row.deviation}
                      </span>
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>{row.excCount}</span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: row.type === 'hard' ? '#dc2626' : '#d97706',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                      }}>
                        {row.type}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : selectedRow ? (
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
