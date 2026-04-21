import { useState, useMemo, useCallback } from 'react'
import {
  GraviGrid,
  Vertical,
  Horizontal,
  Texto,
  GraviButton,
} from '@gravitate-js/excalibrr'
import { Button, Drawer, Input } from 'antd'
import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { quoteConfigData, mockGroups, mockReportingAttributes } from './Grid/mockData'
import { getManageQuoteRowsColumnDefs } from './Grid/columnDefs'
import {
  isBulkAttributesPayload,
  applyBulkAttributesPayload,
} from '@components/shared/Grid/bulkChange/BulkAttributesEditor'
import {
  ManageReportingAttributesDrawer,
  type ReportingAttribute,
} from './ManageReportingAttributesDrawer'

function renameAttributeOnRow<T extends { reportingAttributes: string[] }>(
  row: T,
  oldName: string,
  nextName: string
): T {
  if (!row.reportingAttributes?.includes(oldName)) return row
  return {
    ...row,
    reportingAttributes: row.reportingAttributes.map((n) => (n === oldName ? nextName : n)),
  }
}

export function QuoteRowsTab() {
  const [isGroupsDrawerOpen, setIsGroupsDrawerOpen] = useState(false)
  const [isAttrsDrawerOpen, setIsAttrsDrawerOpen] = useState(false)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)
  const [rowData, setRowData] = useState(quoteConfigData)
  const [attributes, setAttributes] = useState<ReportingAttribute[]>(mockReportingAttributes)
  const [groups, setGroups] = useState(mockGroups)
  const [newGroupName, setNewGroupName] = useState('')
  const [groupSearch, setGroupSearch] = useState('')

  const handleAddGroup = () => {
    const trimmed = newGroupName.trim()
    if (!trimmed) return
    setGroups((prev) => {
      if (prev.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) return prev
      const nextId = prev.length > 0 ? Math.max(...prev.map((g) => g.id)) + 1 : 1
      return [...prev, { id: nextId, name: trimmed }]
    })
    setNewGroupName('')
  }

  const handleCreateAttribute = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setAttributes((prev) => {
      if (prev.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) return prev
      const nextId = prev.length > 0 ? Math.max(...prev.map((a) => a.id)) + 1 : 1
      return [...prev, { id: nextId, name: trimmed }]
    })
  }, [])

  const handleRenameAttribute = useCallback(
    (id: number, nextName: string) => {
      const target = attributes.find((a) => a.id === id)
      if (!target) return
      const dup = attributes.some((a) => a.id !== id && a.name.toLowerCase() === nextName.toLowerCase())
      if (dup) return
      const oldName = target.name
      setAttributes((prev) => prev.map((a) => (a.id === id ? { ...a, name: nextName } : a)))
      setRowData((prev) => prev.map((r) => renameAttributeOnRow(r, oldName, nextName)))
    },
    [attributes]
  )

  const handleDeleteAttribute = useCallback((id: number) => {
    setAttributes((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const columnDefs = useMemo(
    () => getManageQuoteRowsColumnDefs({
      reportingAttributeOptions: attributes,
      onCreateAttribute: handleCreateAttribute,
    }),
    [attributes, handleCreateAttribute]
  )

  const handleSelectionChanged = useCallback(() => {
    /* reserved for future selection-driven UI */
  }, [])

  const handleBulkUpdate = useCallback(async (rows: unknown | unknown[]) => {
    const updatedRows = (Array.isArray(rows) ? rows : [rows]) as Array<Record<string, unknown> & { id: number }>
    const updatedMap = new Map(updatedRows.map((u) => [u.id, u]))
    setRowData(prev => prev.map(row => {
      const updated = updatedMap.get(row.id)
      if (!updated) return row

      // Resolve additive bulk-attributes payload against the ORIGINAL row's attrs.
      let reportingAttributes = updated.reportingAttributes as unknown
      if (isBulkAttributesPayload(reportingAttributes)) {
        reportingAttributes = applyBulkAttributesPayload(row.reportingAttributes, reportingAttributes)
      }

      const next = { ...row, ...updated, reportingAttributes: reportingAttributes as string[] }

      if (next.tierGroup !== row.tierGroup) {
        return { ...next, tierLevel: null }
      }
      return next
    }))
  }, [])

  const getAttributeUsageCount = useCallback(
    (name: string) => rowData.reduce((acc, r) => (r.reportingAttributes?.includes(name) ? acc + 1 : acc), 0),
    [rowData]
  )

  return (
    <Vertical height="100%">
      <GraviGrid
        storageKey="manage-quote-rows-grid"
        rowData={rowData}
        columnDefs={columnDefs}
        agPropOverrides={{
          getRowId: (p: { data: { id: number | string } }) => String(p.data.id),
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
                buttonText="Manage Attributes"
                icon={<TagsOutlined />}
                onClick={() => setIsAttrsDrawerOpen(true)}
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
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
      >
        {/* Quick search */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100, #f3f4f6)' }}>
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--gray-400, #9ca3af)' }} />}
            placeholder="Search groups"
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
            allowClear
          />
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px' }}>
          {groups
            .filter((g) =>
              groupSearch.trim()
                ? g.name.toLowerCase().includes(groupSearch.trim().toLowerCase())
                : true
            )
            .map((g) => (
              <div
                key={g.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--gray-100, #f3f4f6)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Texto>{g.name}</Texto>
                </div>
                <Button type="text" icon={<EditOutlined />} />
                <Button type="text" icon={<DeleteOutlined />} />
              </div>
            ))}
        </div>

        {/* Sticky Add control */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--gray-100, #f3f4f6)',
            background: 'var(--gray-50, #f9fafb)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Input
            placeholder="Name a new group, then press Enter"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onPressEnter={handleAddGroup}
          />
          <GraviButton
            success
            buttonText="Add"
            icon={<PlusOutlined />}
            onClick={handleAddGroup}
          />
        </div>
      </Drawer>

      <ManageReportingAttributesDrawer
        open={isAttrsDrawerOpen}
        attributes={attributes}
        getUsageCount={getAttributeUsageCount}
        onClose={() => setIsAttrsDrawerOpen(false)}
        onCreate={handleCreateAttribute}
        onRename={handleRenameAttribute}
        onDelete={handleDeleteAttribute}
      />
    </Vertical>
  )
}
