import { useState } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { useNavigate } from 'react-router-dom'
import { Drawer, Checkbox } from 'antd'
import { LeftOutlined, ReloadOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons'
import styles from './ExampleDashboard.module.css'

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
    <div className={styles.page}>
      <div className={styles.header}>
        <Horizontal justifyContent="space-between" alignItems="center">
          <Vertical gap={4}>
            <button className={styles.backLink} onClick={() => navigate('/PatternGuide/Examples')}>
              <LeftOutlined /> Back to Examples
            </button>
            <Horizontal gap={12} alignItems="center">
              <Texto category="h3" weight="600">Dashboard</Texto>
              <span className={styles.badge}>Live</span>
            </Horizontal>
          </Vertical>
          <Horizontal gap={8}>
            <GraviButton buttonText="Refresh" icon={<ReloadOutlined />} />
            <GraviButton buttonText="Export" icon={<DownloadOutlined />} onClick={() => setExportOpen(true)} />
          </Horizontal>
        </Horizontal>
      </div>

      <div className={styles.content}>
          <div className={styles.counterCard}>
            {COUNTERS.map((c, i) => (
              <>
                <div key={c.label} className={styles.counterColumn}>
                  <Texto category="p2" weight="500">{c.label}</Texto>
                  <Texto category="h2" weight="700">{c.value}</Texto>
                </div>
                {i < COUNTERS.length - 1 && <div className={styles.counterDivider} />}
              </>
            ))}
          </div>

          <div className={styles.statsRow}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statCard} onClick={() => setDetailOpen(s.label)}>
                <Texto category="p2" weight="500">{s.label}</Texto>
                <Texto category="h2" weight="700">{s.value}</Texto>
                <Texto category="p2" appearance={s.up ? 'success' : 'error'}>{s.delta}</Texto>
              </div>
            ))}
          </div>

          <div className={styles.twoCol}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionCardHeader}>
                <Texto category="h5" weight="600">Recent Activity</Texto>
              </div>
              <div className={styles.sectionCardBody}>
                <Vertical gap={16}>
                  {ACTIVITY.map((a, i) => (
                    <Horizontal key={i} gap={12} alignItems="flex-start">
                      <div className={styles.activityDot} style={{ background: a.color }} />
                      <Vertical flex="1">
                        <Texto category="p2">{a.text}</Texto>
                        <Texto category="p2" appearance="medium">{a.time}</Texto>
                      </Vertical>
                    </Horizontal>
                  ))}
                </Vertical>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionCardHeader}>
                <Texto category="h5" weight="600">Top Commodities</Texto>
              </div>
              <div className={styles.sectionCardBody}>
                <Vertical gap={20}>
                  {COMMODITIES.map((c) => (
                    <div key={c.name}>
                      <Horizontal justifyContent="space-between">
                        <Texto category="p2" weight="500">{c.name}</Texto>
                        <Texto category="p2" appearance="medium">{c.volume}</Texto>
                      </Horizontal>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: `${c.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </Vertical>
              </div>
            </div>
          </div>
      </div>

      <Drawer
        open={!!detailOpen}
        onClose={() => setDetailOpen(null)}
        title={detailOpen + ' Details'}
        width={520}
        destroyOnHidden
      >
        <Vertical gap={24}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionCardHeader}>
              <Texto category="h5" weight="600">Breakdown</Texto>
            </div>
            <div className={styles.sectionCardBody}>
              <Vertical gap={12}>
                {(DETAIL_DATA[detailOpen ?? 'Revenue'] ?? DETAIL_DATA.Revenue).map((row) => (
                  <div key={row.label} className={styles.breakdownRow}>
                    <Texto category="p2" weight="500">{row.label}</Texto>
                    <Texto category="p2">{row.value}</Texto>
                  </div>
                ))}
              </Vertical>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionCardHeader}>
              <Texto category="h5" weight="600">Trend</Texto>
            </div>
            <div className={styles.sectionCardBody}>
              <div className={styles.chartPlaceholder}>
                <Texto category="p2" appearance="medium">Chart placeholder</Texto>
              </div>
            </div>
          </div>
        </Vertical>
      </Drawer>

      <Drawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        placement="bottom"
        height="50vh"
        title={null}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <Horizontal justifyContent="space-between" alignItems="center" className={styles.drawerHeader}>
          <Texto category="h4" weight="600">Export Dashboard</Texto>
          <GraviButton type="text" icon={<CloseOutlined />} onClick={() => setExportOpen(false)} />
        </Horizontal>
        <div className={styles.drawerBody}>
          <Vertical gap={24}>
            <div>
              <Texto category="h5" weight="600">Format</Texto>
              <div className={styles.formatRow}>
                {EXPORT_FORMATS.map((fmt) => (
                  <div key={fmt.key} className={styles.formatCard}>
                    <DownloadOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
                    <Texto category="p2" weight="500">{fmt.label}</Texto>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Texto category="h5" weight="600">Sections to Include</Texto>
              <Vertical gap={10}>
                {EXPORT_SECTIONS.map((section) => (
                  <Checkbox key={section.key} defaultChecked>{section.label}</Checkbox>
                ))}
              </Vertical>
            </div>

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
