import { useState } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { useNavigate } from 'react-router-dom'
import { Drawer } from 'antd'
import { LeftOutlined, EditOutlined, HistoryOutlined, CloseOutlined } from '@ant-design/icons'
import styles from './ExampleFullWidth.module.css'

const STATS = [
  { label: 'Total Volume', value: '12,450', unit: 'MT' },
  { label: 'Avg Price', value: '$84.20' },
  { label: 'Open Positions', value: '37' },
  { label: 'Exceptions', value: '5' },
]

const ACTIVITY = [
  { time: 'Today, 2:45 PM', text: 'Price updated for position CTR-2024-015 by John Smith' },
  { time: 'Today, 11:20 AM', text: 'Volume amendment approved for CTR-2024-001' },
  { time: 'Yesterday, 4:10 PM', text: 'New exception flagged on CTR-2024-008 — threshold exceeded by 3.2%' },
]

const HISTORY_ENTRIES = [
  { date: 'Apr 10, 2026 — 3:22 PM', description: 'Volume amended from 10,200 MT to 12,450 MT by Sarah Chen' },
  { date: 'Mar 28, 2026 — 11:05 AM', description: 'End date extended from Jun 30, 2024 to Dec 31, 2024 by John Smith' },
  { date: 'Mar 15, 2026 — 9:40 AM', description: 'Status changed from Draft to Active by Sarah Chen' },
  { date: 'Feb 20, 2026 — 2:18 PM', description: 'Commodity updated from Brent Crude to Crude Oil WTI by Mike Torres' },
  { date: 'Jan 15, 2026 — 10:00 AM', description: 'Contract CTR-2024-001 created by Sarah Chen' },
]

const FORM_FIELDS = ['Contract ID', 'Status', 'Start Date', 'End Date', 'Commodity', 'Volume']

export function ExampleFullWidth() {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Horizontal justifyContent="space-between" alignItems="center">
          <Vertical gap={4}>
            <button className={styles.backLink} onClick={() => navigate('/PatternGuide/Examples')}>
              <LeftOutlined /> Back to Examples
            </button>
            <Texto category="h3" weight="600">Contract Details</Texto>
          </Vertical>
          <Horizontal gap={8}>
            <GraviButton buttonText="History" icon={<HistoryOutlined />} onClick={() => setHistoryOpen(true)} />
            <GraviButton buttonText="Edit" icon={<EditOutlined />} onClick={() => setEditOpen(true)} />
            <GraviButton buttonText="Publish" theme1 />
          </Horizontal>
        </Horizontal>
      </div>

      <div className={styles.content}>
          <div className={styles.statsRow}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <Texto category="p2" weight="500">{s.label}</Texto>
                <Horizontal gap={4} alignItems="baseline">
                  <Texto category="h2" weight="700">{s.value}</Texto>
                  {s.unit && <Texto category="p2" appearance="medium">{s.unit}</Texto>}
                </Horizontal>
              </div>
            ))}
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionCardHeader}>
              <Texto category="h5" weight="600">Contract Information</Texto>
            </div>
            <div className={styles.sectionCardBody}>
              <div className={styles.fieldGrid}>
                <FieldDisplay label="Contract ID" value="CTR-2024-001" />
                <FieldDisplay label="Status" value="Active" />
                <FieldDisplay label="Start Date" value="Jan 15, 2024" />
                <FieldDisplay label="End Date" value="Dec 31, 2024" />
                <FieldDisplay label="Commodity" value="Crude Oil WTI" />
                <FieldDisplay label="Volume" value="12,450 MT" />
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionCardHeader}>
              <Texto category="h5" weight="600">Activity Log</Texto>
            </div>
            <div className={styles.sectionCardBody}>
              <Vertical gap={16}>
                {ACTIVITY.map((a, i) => (
                  <div key={i}>
                    <Texto category="p2" appearance="medium">{a.time}</Texto>
                    <Texto category="p2">{a.text}</Texto>
                    {i < ACTIVITY.length - 1 && <div className={styles.divider} />}
                  </div>
                ))}
              </Vertical>
            </div>
          </div>
      </div>

      <Drawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Contract"
        width={520}
        placement="right"
        destroyOnHidden
        footer={
          <div className={styles.drawerFooter}>
            <GraviButton buttonText="Cancel" onClick={() => setEditOpen(false)} />
            <GraviButton buttonText="Save Changes" theme1 />
          </div>
        }
      >
        <Vertical gap={16}>
          {FORM_FIELDS.map((label) => (
            <Vertical key={label} gap={4}>
              <Texto category="p2" weight="500">{label}</Texto>
              <div className={styles.formInput} />
            </Vertical>
          ))}
        </Vertical>
      </Drawer>

      <Drawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        placement="bottom"
        height="70vh"
        title={null}
        closable={false}
        styles={{ body: { padding: 0 } }}
        destroyOnHidden
      >
        <div className={styles.drawerHeader}>
          <Texto category="h4" weight="600">Amendment History</Texto>
          <GraviButton type="text" icon={<CloseOutlined />} onClick={() => setHistoryOpen(false)} />
        </div>
        <div className={styles.drawerBody}>
          <Vertical gap={16}>
            {HISTORY_ENTRIES.map((entry, i) => (
              <div key={i}>
                <Texto category="p2" weight="500">{entry.date}</Texto>
                <Texto category="p2">{entry.description}</Texto>
                {i < HISTORY_ENTRIES.length - 1 && <div className={styles.divider} />}
              </div>
            ))}
          </Vertical>
        </div>
      </Drawer>
    </div>
  )
}

function FieldDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fieldRow}>
      <Texto category="p2" appearance="medium">{label}</Texto>
      <Texto category="p2" weight="500">{value}</Texto>
    </div>
  )
}
