import { useState } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined, HomeOutlined, FileTextOutlined, BarChartOutlined, TeamOutlined } from '@ant-design/icons'
import { Select, Switch, Slider } from 'antd'

const NAV_ITEMS = [
  { key: 'home', label: 'Dashboard', icon: <HomeOutlined /> },
  { key: 'contracts', label: 'Contracts', icon: <FileTextOutlined />, active: true },
  { key: 'analytics', label: 'Analytics', icon: <BarChartOutlined /> },
  { key: 'team', label: 'Team', icon: <TeamOutlined /> },
]

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
          <Horizontal gap={8} alignItems="center">
            <GraviButton type="text" icon={<LeftOutlined />} onClick={() => navigate('/PatternGuide/Examples')} />
            <Texto category="h3" weight="600">Contract Analysis</Texto>
          </Horizontal>
        </Horizontal>

        {/* Split panel */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left: configuration panel */}
          <div style={{ width: 320, minWidth: 320, borderRight: '1px solid #e8e8e8', background: '#fafafa', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Panel header */}
            <div style={{ padding: 16, borderBottom: '1px solid #e8e8e8' }}>
              <Texto category="p2" weight="600">Configuration</Texto>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {/* Filters section */}
              <Vertical gap={16} style={{ padding: 16 }}>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Status</Texto>
                  <Select
                    value={status}
                    onChange={setStatus}
                    style={{ width: '100%' }}
                    options={[
                      { value: 'All', label: 'All' },
                      { value: 'Active', label: 'Active' },
                      { value: 'Draft', label: 'Draft' },
                      { value: 'Expired', label: 'Expired' },
                    ]}
                  />
                </Vertical>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Commodity</Texto>
                  <Select
                    value={commodity}
                    onChange={setCommodity}
                    style={{ width: '100%' }}
                    options={[
                      { value: 'All', label: 'All' },
                      { value: 'Crude Oil', label: 'Crude Oil' },
                      { value: 'Natural Gas', label: 'Natural Gas' },
                      { value: 'Ethanol', label: 'Ethanol' },
                    ]}
                  />
                </Vertical>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Date Range</Texto>
                  <div style={{ height: 32, background: '#fff', border: '1px solid #d9d9d9', borderRadius: 6, padding: '4px 11px', display: 'flex', alignItems: 'center' }}>
                    <Texto category="p2" appearance="medium">Select date range...</Texto>
                  </div>
                </Vertical>
              </Vertical>

              {/* Divider */}
              <div style={{ height: 1, background: '#e8e8e8', margin: '0 16px' }} />

              {/* Display Options section */}
              <Vertical gap={12} style={{ padding: 16 }}>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Show Inactive</Texto>
                  <Switch checked={showInactive} onChange={setShowInactive} size="small" />
                </Horizontal>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Show Archived</Texto>
                  <Switch checked={showArchived} onChange={setShowArchived} size="small" />
                </Horizontal>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Sort By</Texto>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    style={{ width: '100%' }}
                    options={[
                      { value: 'Name', label: 'Name' },
                      { value: 'Date', label: 'Date' },
                      { value: 'Volume', label: 'Volume' },
                    ]}
                  />
                </Vertical>
              </Vertical>

              {/* Divider */}
              <div style={{ height: 1, background: '#e8e8e8', margin: '0 16px' }} />

              {/* Thresholds section */}
              <Vertical gap={16} style={{ padding: 16 }}>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Price Threshold</Texto>
                  <Slider
                    value={priceThreshold}
                    onChange={setPriceThreshold}
                    min={0}
                    max={15}
                    marks={{ 0: '0%', 5: '5%', 10: '10%', 15: '15%' }}
                  />
                </Vertical>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Volume Threshold</Texto>
                  <Slider
                    value={volumeThreshold}
                    onChange={setVolumeThreshold}
                    min={0}
                    max={20}
                    marks={{ 0: '0%', 10: '10%', 20: '20%' }}
                  />
                </Vertical>
              </Vertical>
            </div>

            {/* Bottom sticky area */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #e8e8e8' }}>
              <GraviButton buttonText="Apply Filters" theme1 style={{ width: '100%' }} />
            </div>
          </div>

          {/* Right: contract results */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#f5f5f5' }}>
            {/* Filter summary bar */}
            <Horizontal gap={8} style={{ marginBottom: 16, flexWrap: 'wrap' }}>
              <FilterTag label="Status" value={status} />
              <FilterTag label="Commodity" value={commodity} />
              <FilterTag label="Sort" value={sortBy} />
              <FilterTag label="Price" value={`${priceThreshold}%`} />
              <FilterTag label="Volume" value={`${volumeThreshold}%`} />
            </Horizontal>

            {/* Contract cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {CONTRACTS.map((contract) => {
                const styles = STATUS_STYLES[contract.status] ?? STATUS_STYLES.Active
                return (
                  <div
                    key={contract.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #e8e8e8',
                      borderRadius: 8,
                      padding: 24,
                    }}
                  >
                    <Texto category="h5" weight="600">{contract.id}</Texto>
                    <Texto category="p2" appearance="medium" style={{ marginTop: 8 }}>
                      {contract.commodity} — {contract.volume}
                    </Texto>
                    <div style={{ marginTop: 8 }}>
                      <span
                        style={{
                          padding: '2px 10px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 500,
                          background: styles.background,
                          color: styles.color,
                          border: `1px solid ${styles.border}`,
                        }}
                      >
                        {contract.status}
                      </span>
                    </div>
                    <Texto category="p2" style={{ marginTop: 12 }}>{contract.price}</Texto>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterTag({ label, value }: { label: string; value: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 10px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 500,
        background: '#e6f7ff',
        color: '#1890ff',
        border: '1px solid #91d5ff',
      }}
    >
      {label}: {value}
    </span>
  )
}
