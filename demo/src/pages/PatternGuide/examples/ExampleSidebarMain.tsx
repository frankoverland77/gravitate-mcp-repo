import { useState } from 'react'
import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'
import { Select, Switch, Slider } from 'antd'
import styles from './ExampleSidebarMain.module.css'

const CONTRACTS = [
  { id: 'CTR-2024-001', commodity: 'Crude Oil', volume: '50,000 bbl', status: 'Active', price: '$84.20/bbl' },
  { id: 'CTR-2024-002', commodity: 'Natural Gas', volume: '120,000 MMBtu', status: 'Active', price: '$3.45/MMBtu' },
  { id: 'CTR-2024-003', commodity: 'Ethanol', volume: '30,000 gal', status: 'Draft', price: '$2.18/gal' },
  { id: 'CTR-2024-004', commodity: 'Crude Oil', volume: '75,000 bbl', status: 'Expired', price: '$78.90/bbl' },
  { id: 'CTR-2024-005', commodity: 'Natural Gas', volume: '200,000 MMBtu', status: 'Active', price: '$3.62/MMBtu' },
  { id: 'CTR-2024-006', commodity: 'Ethanol', volume: '45,000 gal', status: 'Draft', price: '$2.05/gal' },
]

const STATUS_STYLES: Record<string, { background: string; color: string; border: string }> = {
  Active: { background: '#f6ffed', color: '#52c41a', border: '#b7eb8f' },
  Draft: { background: '#fffbe6', color: '#faad14', border: '#ffe58f' },
  Expired: { background: '#fff1f0', color: '#ff4d4f', border: '#ffa39e' },
}

export function ExampleSidebarMain() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('All')
  const [commodity, setCommodity] = useState('All')
  const [showInactive, setShowInactive] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [sortBy, setSortBy] = useState('Name')
  const [priceThreshold, setPriceThreshold] = useState(5)
  const [volumeThreshold, setVolumeThreshold] = useState(10)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Vertical gap={4}>
          <button className={styles.backLink} onClick={() => navigate('/PatternGuide/Examples')}>
            <LeftOutlined /> Back to Examples
          </button>
          <Texto category="h3" weight="600">Contract Analysis</Texto>
        </Vertical>
      </div>

      <div className={styles.splitPanel}>
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <Texto category="p2" weight="600">Configuration</Texto>
          </div>

          <div className={styles.scrollArea}>
            <Vertical gap={16} className={styles.panelSection}>
              <Vertical gap={4}>
                <Texto category="p2" weight="500">Status</Texto>
                <Select value={status} onChange={setStatus} style={{ width: '100%' }} options={[
                  { value: 'All', label: 'All' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Expired', label: 'Expired' },
                ]} />
              </Vertical>
              <Vertical gap={4}>
                <Texto category="p2" weight="500">Commodity</Texto>
                <Select value={commodity} onChange={setCommodity} style={{ width: '100%' }} options={[
                  { value: 'All', label: 'All' },
                  { value: 'Crude Oil', label: 'Crude Oil' },
                  { value: 'Natural Gas', label: 'Natural Gas' },
                  { value: 'Ethanol', label: 'Ethanol' },
                ]} />
              </Vertical>
              <Vertical gap={4}>
                <Texto category="p2" weight="500">Date Range</Texto>
                <div className={styles.datePlaceholder}>
                  <Texto category="p2" appearance="medium">Select date range...</Texto>
                </div>
              </Vertical>
            </Vertical>

            <div className={styles.panelDivider} />

            <Vertical gap={12} className={styles.panelSection}>
              <div className={styles.switchRow}>
                <Texto category="p2" weight="500">Show Inactive</Texto>
                <Switch checked={showInactive} onChange={setShowInactive} size="small" />
              </div>
              <div className={styles.switchRow}>
                <Texto category="p2" weight="500">Show Archived</Texto>
                <Switch checked={showArchived} onChange={setShowArchived} size="small" />
              </div>
              <Vertical gap={4}>
                <Texto category="p2" weight="500">Sort By</Texto>
                <Select value={sortBy} onChange={setSortBy} style={{ width: '100%' }} options={[
                  { value: 'Name', label: 'Name' },
                  { value: 'Date', label: 'Date' },
                  { value: 'Volume', label: 'Volume' },
                ]} />
              </Vertical>
            </Vertical>

            <div className={styles.panelDivider} />

            <Vertical gap={16} className={styles.panelSection}>
              <Vertical gap={4}>
                <Texto category="p2" weight="500">Price Threshold</Texto>
                <Slider value={priceThreshold} onChange={setPriceThreshold} min={0} max={15} marks={{ 0: '0%', 5: '5%', 10: '10%', 15: '15%' }} />
              </Vertical>
              <Vertical gap={4}>
                <Texto category="p2" weight="500">Volume Threshold</Texto>
                <Slider value={volumeThreshold} onChange={setVolumeThreshold} min={0} max={20} marks={{ 0: '0%', 10: '10%', 20: '20%' }} />
              </Vertical>
            </Vertical>
          </div>

          <div className={styles.panelFooter}>
            <GraviButton buttonText="Apply Filters" theme1 className={styles.fullWidth} />
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.filterBar}>
            <FilterTag label="Status" value={status} />
            <FilterTag label="Commodity" value={commodity} />
            <FilterTag label="Sort" value={sortBy} />
            <FilterTag label="Price" value={`${priceThreshold}%`} />
            <FilterTag label="Volume" value={`${volumeThreshold}%`} />
          </div>

          <div className={styles.cardGrid}>
            {CONTRACTS.map((contract) => {
              const badgeStyle = STATUS_STYLES[contract.status] ?? STATUS_STYLES.Active
              return (
                <div key={contract.id} className={styles.contractCard}>
                  <Texto category="h5" weight="600">{contract.id}</Texto>
                  <Texto category="p2" appearance="medium">{contract.commodity} — {contract.volume}</Texto>
                  <div>
                    <span style={{ background: badgeStyle.background, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}`, padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                      {contract.status}
                    </span>
                  </div>
                  <Texto category="p2">{contract.price}</Texto>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterTag({ label, value }: { label: string; value: string }) {
  return <span className={styles.filterTag}>{label}: {value}</span>
}
