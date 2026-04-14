import { useState } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { useNavigate } from 'react-router-dom'
import { Drawer, Checkbox } from 'antd'
import { LeftOutlined, ReloadOutlined, HomeOutlined, FileTextOutlined, BarChartOutlined, TeamOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons'

const NAV_ITEMS = [
  { key: 'home', label: 'Dashboard', icon: <HomeOutlined />, active: true },
  { key: 'contracts', label: 'Contracts', icon: <FileTextOutlined /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChartOutlined /> },
  { key: 'team', label: 'Team', icon: <TeamOutlined /> },
]

const COUNTERS = [
  { label: 'Total Quotes', value: '142' },
  { label: 'Awarded', value: '89' },
  { label: 'Pending', value: '38' },
  { label: 'Rejected', value: '15' },
]

const STATS = [
  { label: 'Revenue', value: '$2.4M', delta: '+12.5%', up: true },
  { label: 'Volume', value: '45,000 MT', delta: '+8.2%', up: true },
  { label: 'Avg Contract Value', value: '$64K', delta: '-3.1%', up: false },
]

const ACTIVITY = [
  { color: '#52c41a', text: 'Contract CTR-2024-015 awarded to Apex Energy', time: '2 min ago' },
  { color: '#1890ff', text: 'Quote QT-2024-089 submitted by Pacific Trading', time: '15 min ago' },
  { color: '#faad14', text: 'Exception flagged on CTR-2024-008 — threshold exceeded', time: '1 hour ago' },
  { color: '#ff4d4f', text: 'Quote QT-2024-087 rejected — price outside range', time: '2 hours ago' },
  { color: '#1890ff', text: 'New RFP received from Northern Pipeline Inc', time: '3 hours ago' },
]

const COMMODITIES = [
  { name: 'Crude Oil', volume: '18,500 MT', pct: 80 },
  { name: 'Natural Gas', volume: '12,200 MMBtu', pct: 60 },
  { name: 'Copper', volume: '8,400 MT', pct: 45 },
  { name: 'Aluminum', volume: '5,100 MT', pct: 30 },
]

const DETAIL_DATA: Record<string, { label: string; value: string }[]> = {
  Revenue: [
    { label: 'Q1', value: '$580K' },
    { label: 'Q2', value: '$620K' },
    { label: 'Q3', value: '$640K' },
    { label: 'Q4', value: '$560K' },
  ],
  Volume: [
    { label: 'Q1', value: '10,200 MT' },
    { label: 'Q2', value: '11,800 MT' },
    { label: 'Q3', value: '12,500 MT' },
    { label: 'Q4', value: '10,500 MT' },
  ],
  'Avg Contract Value': [
    { label: 'Q1', value: '$68K' },
    { label: 'Q2', value: '$65K' },
    { label: 'Q3', value: '$62K' },
    { label: 'Q4', value: '$61K' },
  ],
}

const EXPORT_FORMATS = [
  { key: 'csv', label: 'CSV' },
  { key: 'pdf', label: 'PDF' },
  { key: 'excel', label: 'Excel' },
]

const EXPORT_SECTIONS = [
  { key: 'overview', label: 'Overview Stats' },
  { key: 'revenue', label: 'Revenue Breakdown' },
  { key: 'activity', label: 'Activity Log' },
  { key: 'commodities', label: 'Commodities' },
]

export function ExampleDashboard() {
  const navigate = useNavigate()
  const [detailOpen, setDetailOpen] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      {/* Fake sidebar */}
      <div style={{ width: 220, minWidth: 220, background: '#1a1a2e', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 16px 12px' }}>
          <Texto style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: 0.5 }}>Gravitate</Texto>
        </div>
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.key}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
                background: item.active ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: item.active ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 14,
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Horizontal justifyContent="space-between" alignItems="center" style={{ height: 56, minHeight: 56, padding: '0 24px', borderBottom: '1px solid #e8e8e8' }}>
          <Horizontal gap={12} alignItems="center">
            <GraviButton type="text" icon={<LeftOutlined />} onClick={() => navigate('/PatternGuide/Examples')} />
            <Texto category="h3" weight="600">Dashboard</Texto>
            <span style={{ padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' }}>Live</span>
          </Horizontal>
          <Horizontal gap={8}>
            <GraviButton buttonText="Refresh" icon={<ReloadOutlined />} />
            <GraviButton buttonText="Export" icon={<DownloadOutlined />} onClick={() => setExportOpen(true)} />
          </Horizontal>
        </Horizontal>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-5)', background: '#f5f5f5' }}>
          <Vertical gap={24}>
            {/* Multi-counter card */}
            <div style={{ display: 'flex', borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden', background: '#fff' }}>
              {COUNTERS.map((c, i) => (
                <div key={c.label} style={{ flex: 1, padding: 'var(--space-5)', textAlign: 'center', borderRight: i < COUNTERS.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>{c.label}</Texto>
                  <Texto category="h2" weight="700" style={{ marginTop: 'var(--space-1)' }}>{c.value}</Texto>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {STATS.map((s) => (
                <div
                  key={s.label}
                  onClick={() => setDetailOpen(s.label)}
                  style={{ flex: 1, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: 'var(--space-5)', cursor: 'pointer' }}
                >
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>{s.label}</Texto>
                  <Texto category="h2" weight="700" style={{ marginTop: 'var(--space-1)' }}>{s.value}</Texto>
                  <Texto category="p2" appearance={s.up ? 'success' : 'error'} style={{ marginTop: 'var(--space-1)' }}>{s.delta}</Texto>
                </div>
              ))}
            </div>

            {/* Two-column section */}
            <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
              {/* Recent Activity */}
              <div style={{ flex: 1, borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden', background: '#fff' }}>
                <div style={{ padding: 'var(--space-4)', background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                  <Texto category="h5" weight="600">Recent Activity</Texto>
                </div>
                <div style={{ padding: 'var(--space-5)' }}>
                  <Vertical gap={16}>
                    {ACTIVITY.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: 6, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <Texto category="p2">{a.text}</Texto>
                          <Texto category="p2" appearance="medium" style={{ fontSize: 12, marginTop: 2 }}>{a.time}</Texto>
                        </div>
                      </div>
                    ))}
                  </Vertical>
                </div>
              </div>

              {/* Top Commodities */}
              <div style={{ flex: 1, borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden', background: '#fff' }}>
                <div style={{ padding: 'var(--space-4)', background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                  <Texto category="h5" weight="600">Top Commodities</Texto>
                </div>
                <div style={{ padding: 'var(--space-5)' }}>
                  <Vertical gap={20}>
                    {COMMODITIES.map((c) => (
                      <div key={c.name}>
                        <Horizontal justifyContent="space-between" style={{ marginBottom: 6 }}>
                          <Texto category="p2" weight="500">{c.name}</Texto>
                          <Texto category="p2" appearance="medium">{c.volume}</Texto>
                        </Horizontal>
                        <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${c.pct}%`, height: '100%', background: '#1890ff', borderRadius: 4 }} />
                        </div>
                      </div>
                    ))}
                  </Vertical>
                </div>
              </div>
            </div>
          </Vertical>
        </div>
      </div>

      {/* Right Drawer — stat detail */}
      <Drawer
        open={!!detailOpen}
        onClose={() => setDetailOpen(null)}
        title={detailOpen + ' Details'}
        width={520}
        destroyOnHidden
      >
        <Vertical gap={24}>
          {/* Breakdown section */}
          <div style={{ borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4)', background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
              <Texto category="h5" weight="600">Breakdown</Texto>
            </div>
            <div style={{ padding: 'var(--space-5)' }}>
              <Vertical gap={12}>
                {(DETAIL_DATA[detailOpen ?? 'Revenue'] ?? DETAIL_DATA.Revenue).map((row) => (
                  <Horizontal key={row.label} justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Texto category="p2" weight="500">{row.label}</Texto>
                    <Texto category="p2">{row.value}</Texto>
                  </Horizontal>
                ))}
              </Vertical>
            </div>
          </div>

          {/* Trend section */}
          <div style={{ borderRadius: 8, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4)', background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
              <Texto category="h5" weight="600">Trend</Texto>
            </div>
            <div style={{ padding: 'var(--space-5)' }}>
              <div style={{ height: 200, background: '#fafafa', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Texto category="p2" appearance="medium">Chart placeholder</Texto>
              </div>
            </div>
          </div>
        </Vertical>
      </Drawer>

      {/* Bottom Drawer — export options */}
      <Drawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        placement="bottom"
        height="50vh"
        title={null}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        {/* Custom header */}
        <Horizontal justifyContent="space-between" alignItems="center" style={{ padding: '12px 24px', borderBottom: '1px solid #e8e8e8' }}>
          <Texto category="h4" weight="600">Export Dashboard</Texto>
          <GraviButton type="text" icon={<CloseOutlined />} onClick={() => setExportOpen(false)} />
        </Horizontal>

        {/* Content */}
        <div style={{ padding: 24 }}>
          <Vertical gap={24}>
            {/* Format section */}
            <div>
              <Texto category="h5" weight="600" style={{ marginBottom: 12 }}>Format</Texto>
              <div style={{ display: 'flex', gap: 12 }}>
                {EXPORT_FORMATS.map((fmt) => (
                  <div
                    key={fmt.key}
                    style={{
                      flex: 1, border: '1px solid #e8e8e8', borderRadius: 8, padding: '16px 12px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DownloadOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
                    </div>
                    <Texto category="p2" weight="500">{fmt.label}</Texto>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections to include */}
            <div>
              <Texto category="h5" weight="600" style={{ marginBottom: 12 }}>Sections to Include</Texto>
              <Vertical gap={10}>
                {EXPORT_SECTIONS.map((section) => (
                  <Checkbox key={section.key} defaultChecked>{section.label}</Checkbox>
                ))}
              </Vertical>
            </div>

            {/* Footer */}
            <Horizontal justifyContent="flex-end" gap={8}>
              <GraviButton buttonText="Cancel" onClick={() => setExportOpen(false)} />
              <GraviButton buttonText="Export" theme1 />
            </Horizontal>
          </Vertical>
        </div>
      </Drawer>
    </div>
  )
}
