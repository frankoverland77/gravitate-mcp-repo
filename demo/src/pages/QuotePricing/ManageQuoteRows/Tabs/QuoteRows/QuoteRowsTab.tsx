import { useState, useMemo, useCallback } from 'react'
import {
  GraviGrid,
  Vertical,
  Horizontal,
  Texto,
  GraviButton,
} from '@gravitate-js/excalibrr'
import { Drawer } from 'antd'
import {
  AppstoreOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { quoteConfigData, mockGroups } from './Grid/mockData'
import { getManageQuoteRowsColumnDefs } from './Grid/columnDefs'

export function QuoteRowsTab() {
  const [isGroupsDrawerOpen, setIsGroupsDrawerOpen] = useState(false)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)
  const [rowData, setRowData] = useState(quoteConfigData)

  const columnDefs = useMemo(() => getManageQuoteRowsColumnDefs(), [])

  const handleSelectionChanged = useCallback((_event: any) => {}, [])

  const handleBulkUpdate = useCallback(async (rows: any | any[]) => {
    const updatedRows = Array.isArray(rows) ? rows : [rows]
    const updatedMap = new Map(updatedRows.map((u: any) => [u.id, u]))
    setRowData(prev => prev.map(row => {
      const updated = updatedMap.get(row.id)
      if (!updated) return row
      if (updated.tierGroup !== row.tierGroup) {
        return { ...updated, tierLevel: null }
      }
      return updated
    }))
  }, [])

  return (
    <Vertical height="100%">
      <GraviGrid
        storageKey="manage-quote-rows-grid"
        rowData={rowData}
        columnDefs={columnDefs}
        agPropOverrides={{
          getRowId: (p: any) => String(p.data.id),
          groupDefaultExpanded: -1,
          rowSelection: 'multiple',
          suppressRowClickSelection: true,
          groupDisplayType: 'groupRows',
          suppressAggFuncInHeader: true,
        }}
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={setIsBulkChangeVisible}
        updateEP={handleBulkUpdate}
        onSelectionChanged={handleSelectionChanged}
        controlBarProps={{
          title: 'Manage Quote Rows',
          hideActiveFilters: true,
          actionButtons: (
            <Horizontal gap={8}>
              <GraviButton
                buttonText="Manage Groups"
                icon={<AppstoreOutlined />}
                onClick={() => setIsGroupsDrawerOpen(true)}
              />
              <GraviButton
                buttonText={
                  isBulkChangeVisible ? 'Exit Bulk Change' : 'Bulk Change'
                }
                icon={<EditOutlined />}
                onClick={() => setIsBulkChangeVisible((v) => !v)}
              />
              <GraviButton
                success
                buttonText="Add Row"
                icon={<PlusOutlined />}
              />
            </Horizontal>
          ),
        }}
      />

      <Drawer
        title="Manage Quote Groups"
        open={isGroupsDrawerOpen}
        placement="right"
        width={420}
        onClose={() => setIsGroupsDrawerOpen(false)}
      >
        <Vertical>
          {mockGroups.map((g) => (
            <Horizontal
              key={g.id}
              alignItems="center"
              gap={8}
              style={{
                padding: '10px 0',
                borderBottom: '1px solid var(--gray-100)',
              }}
            >
              <div style={{ flex: 1 }}><Texto>{g.name}</Texto></div>
              <GraviButton icon={<EditOutlined />} />
            </Horizontal>
          ))}
          <GraviButton
            buttonText="New Group"
            icon={<PlusOutlined />}
            className="mt-3"
          />
        </Vertical>
      </Drawer>
    </Vertical>
  )
}
