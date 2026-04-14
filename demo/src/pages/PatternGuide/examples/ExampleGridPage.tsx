import { useState, useMemo } from 'react'
import { Vertical, Horizontal, Texto, GraviButton, GraviGrid } from '@gravitate-js/excalibrr'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons'
import { Input, Select, Drawer, Checkbox } from 'antd'
import styles from './ExampleGridPage.module.css'

const COLUMN_DEFS: any[] = [
  { headerName: 'Contract ID', field: 'id', width: 140 },
  { headerName: 'Counterparty', field: 'counterparty', flex: 1 },
  { headerName: 'Commodity', field: 'commodity', width: 140 },
  { headerName: 'Volume', field: 'volume', width: 120 },
  { headerName: 'Status', field: 'status', width: 120 },
  { headerName: 'Start Date', field: 'startDate', width: 130 },
]

const ROW_DATA = [
  { id: 'CTR-2401', counterparty: 'Apex Energy Corp', commodity: 'Natural Gas', volume: '10,000 MMBtu', status: 'Active', startDate: '2026-01-15' },
  { id: 'CTR-2402', counterparty: 'Summit Power LLC', commodity: 'Crude Oil', volume: '5,000 bbl', status: 'Active', startDate: '2026-02-01' },
  { id: 'CTR-2403', counterparty: 'Meridian Resources', commodity: 'Natural Gas', volume: '25,000 MMBtu', status: 'Draft', startDate: '2026-03-10' },
  { id: 'CTR-2404', counterparty: 'Pacific Trading Co', commodity: 'Ethanol', volume: '8,000 gal', status: 'Active', startDate: '2025-11-20' },
  { id: 'CTR-2405', counterparty: 'Northern Pipeline Inc', commodity: 'Crude Oil', volume: '12,000 bbl', status: 'Expired', startDate: '2025-06-01' },
  { id: 'CTR-2406', counterparty: 'Coastal Refining Ltd', commodity: 'Diesel', volume: '15,000 gal', status: 'Active', startDate: '2026-01-05' },
  { id: 'CTR-2407', counterparty: 'Heartland Fuels', commodity: 'Natural Gas', volume: '30,000 MMBtu', status: 'Draft', startDate: '2026-04-01' },
  { id: 'CTR-2408', counterparty: 'Evergreen Commodities', commodity: 'Propane', volume: '6,500 gal', status: 'Active', startDate: '2026-02-18' },
]

export function ExampleGridPage() {
  const navigate = useNavigate()
  const rowData = useMemo(() => ROW_DATA, [])
  const columnDefs = useMemo(() => COLUMN_DEFS, [])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [detailRow, setDetailRow] = useState<typeof ROW_DATA[0] | null>(null)

  return (
    <>
      <Vertical flex="1" height="100%">
        <div className={styles.header}>
          <Horizontal justifyContent="space-between" alignItems="center">
            <Vertical gap={4}>
              <button className={styles.backLink} onClick={() => navigate('/PatternGuide/Examples')}>
                <LeftOutlined /> Back to Examples
              </button>
              <Texto category="h3" weight="600">Contracts</Texto>
            </Vertical>
            <GraviButton buttonText="New Contract" theme1 icon={<PlusOutlined />} />
          </Horizontal>
        </div>

        <Horizontal justifyContent="space-between" alignItems="center" className={styles.controlBar}>
          <Horizontal gap={8} alignItems="center">
            <Input placeholder="Search contracts..." style={{ width: 240 }} />
            <Select
              defaultValue="All Statuses"
              style={{ width: 160 }}
              options={[
                { value: 'All Statuses', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Expired', label: 'Expired' },
              ]}
            />
            <GraviButton
              buttonText={filtersOpen ? 'Hide Filters' : 'Filters'}
              icon={filtersOpen ? <CloseOutlined /> : <FilterOutlined />}
              onClick={() => setFiltersOpen(!filtersOpen)}
            />
          </Horizontal>
          <GraviButton buttonText="Export" icon={<DownloadOutlined />} />
        </Horizontal>

        {filtersOpen && (
          <div className={styles.filterPanel}>
            <Vertical gap={4} flex="1">
              <Texto category="p2" weight="500">Commodity</Texto>
              <Horizontal gap={12}>
                <Checkbox defaultChecked>Crude Oil</Checkbox>
                <Checkbox defaultChecked>Natural Gas</Checkbox>
                <Checkbox defaultChecked>Ethanol</Checkbox>
                <Checkbox defaultChecked>Diesel</Checkbox>
                <Checkbox defaultChecked>Propane</Checkbox>
              </Horizontal>
            </Vertical>
            <Vertical gap={4}>
              <Texto category="p2" weight="500">Volume Min</Texto>
              <Input placeholder="0" style={{ width: 120 }} />
            </Vertical>
            <Vertical gap={4}>
              <Texto category="p2" weight="500">Volume Max</Texto>
              <Input placeholder="999,999" style={{ width: 120 }} />
            </Vertical>
            <Horizontal gap={8}>
              <GraviButton buttonText="Clear" onClick={() => setFiltersOpen(false)} />
              <GraviButton buttonText="Apply" theme1 />
            </Horizontal>
          </div>
        )}

        <Vertical flex="1">
          <GraviGrid
            storageKey="pattern-guide-grid-example"
            rowData={rowData}
            columnDefs={columnDefs}
            agPropOverrides={{
              onRowClicked: (e: any) => setDetailRow(e.data),
            }}
          />
        </Vertical>
      </Vertical>

      <Drawer
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow?.id ?? 'Contract Detail'}
        width={520}
        destroyOnHidden
        footer={
          <div className={styles.drawerFooter}>
            <GraviButton buttonText="Close" onClick={() => setDetailRow(null)} />
            <GraviButton buttonText="Edit Contract" theme1 />
          </div>
        }
      >
        {detailRow && (
          <Vertical gap={24}>
            <div className={styles.sectionCard}>
              <div className={styles.sectionCardHeader}>
                <Texto category="h5" weight="600">Contract Details</Texto>
              </div>
              <div className={styles.sectionCardBody}>
                <Vertical gap={16}>
                  <DetailRow label="Contract ID" value={detailRow.id} />
                  <DetailRow label="Counterparty" value={detailRow.counterparty} />
                  <DetailRow label="Commodity" value={detailRow.commodity} />
                  <DetailRow label="Volume" value={detailRow.volume} />
                  <DetailRow label="Status" value={detailRow.status} />
                  <DetailRow label="Start Date" value={detailRow.startDate} />
                </Vertical>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionCardHeader}>
                <Texto category="h5" weight="600">Activity</Texto>
              </div>
              <div className={styles.sectionCardBody}>
                <Vertical gap={12}>
                  <div>
                    <Texto category="p2" appearance="medium">2026-03-15</Texto>
                    <Texto category="p2">Contract created by John Smith</Texto>
                  </div>
                  <div className={styles.divider} />
                  <div>
                    <Texto category="p2" appearance="medium">2026-03-20</Texto>
                    <Texto category="p2">Volume amended from 8,000 to {detailRow.volume}</Texto>
                  </div>
                  <div className={styles.divider} />
                  <div>
                    <Texto category="p2" appearance="medium">2026-04-01</Texto>
                    <Texto category="p2">Status changed to {detailRow.status}</Texto>
                  </div>
                </Vertical>
              </div>
            </div>
          </Vertical>
        )}
      </Drawer>
    </>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <Texto category="p2" appearance="medium">{label}</Texto>
      <Texto category="p2" weight="500">{value}</Texto>
    </div>
  )
}
