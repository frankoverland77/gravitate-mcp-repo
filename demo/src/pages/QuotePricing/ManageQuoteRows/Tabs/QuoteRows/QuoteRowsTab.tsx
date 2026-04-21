import { useState, useMemo, useCallback } from 'react'
import {
  GraviGrid,
  Vertical,
  Horizontal,
  GraviButton,
} from '@gravitate-js/excalibrr'
import {
  AppstoreOutlined,
  PlusOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { quoteConfigData, mockGroups, mockReportingAttributes } from './Grid/mockData'
import { getManageQuoteRowsColumnDefs } from './Grid/columnDefs'
import {
  isBulkAttributesPayload,
  applyBulkAttributesPayload,
} from '@components/shared/Grid/bulkChange/BulkAttributesEditor'
import { ManageListPanel } from './ManageListPanel'

type ReportingAttribute = { id: number; name: string }
type Group = { id: number; name: string }

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

type OpenPanel = 'groups' | 'attributes' | null

export function QuoteRowsTab() {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)
  const [rowData, setRowData] = useState(quoteConfigData)
  const [attributes, setAttributes] = useState<ReportingAttribute[]>(mockReportingAttributes)
  const [groups, setGroups] = useState<Group[]>(mockGroups)

  const togglePanel = (panel: Exclude<OpenPanel, null>) =>
    setOpenPanel((prev) => (prev === panel ? null : panel))

  // ── Groups CRUD ────────────────────────────────────────
  const handleCreateGroup = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setGroups((prev) => {
      if (prev.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) return prev
      const nextId = prev.length > 0 ? Math.max(...prev.map((g) => g.id)) + 1 : 1
      return [...prev, { id: nextId, name: trimmed }]
    })
  }, [])

  const handleRenameGroup = useCallback(
    (id: number, nextName: string) => {
      const target = groups.find((g) => g.id === id)
      if (!target) return
      const trimmed = nextName.trim()
      if (!trimmed) return
      const dup = groups.some((g) => g.id !== id && g.name.toLowerCase() === trimmed.toLowerCase())
      if (dup) return
      const oldName = target.name
      setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name: trimmed } : g)))
      setRowData((prev) =>
        prev.map((r) => (r.group === oldName ? { ...r, group: trimmed } : r))
      )
    },
    [groups]
  )

  const handleDeleteGroup = useCallback(
    (id: number) => {
      const target = groups.find((g) => g.id === id)
      if (!target) return
      setGroups((prev) => prev.filter((g) => g.id !== id))
      setRowData((prev) =>
        prev.map((r) => (r.group === target.name ? { ...r, group: 'None' } : r))
      )
    },
    [groups]
  )

  const getGroupUsageCount = useCallback(
    (name: string) => rowData.reduce((acc, r) => (r.group === name ? acc + 1 : acc), 0),
    [rowData]
  )

  // ── Attributes CRUD ────────────────────────────────────
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

  const getAttributeUsageCount = useCallback(
    (name: string) => rowData.reduce((acc, r) => (r.reportingAttributes?.includes(name) ? acc + 1 : acc), 0),
    [rowData]
  )

  // ── Grid ───────────────────────────────────────────────
  const columnDefs = useMemo(
    () => getManageQuoteRowsColumnDefs({
      reportingAttributeOptions: attributes,
      onCreateAttribute: handleCreateAttribute,
    }),
    [attributes, handleCreateAttribute]
  )

  const handleSelectionChanged = useCallback(() => {}, [])

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

  return (
    <Vertical height="100%">
      <Horizontal flex="1" style={{ minHeight: 0 }}>
        <Vertical flex="1" style={{ minWidth: 0 }}>
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
                    onClick={() => togglePanel('groups')}
                  />
                  <GraviButton
                    buttonText="Manage Attributes"
                    icon={<TagsOutlined />}
                    onClick={() => togglePanel('attributes')}
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
        </Vertical>

        <ManageListPanel
          visible={openPanel === 'groups'}
          title="Manage Quote Groups"
          sectionLabel="QUOTE GROUPS"
          items={groups}
          onClose={() => setOpenPanel(null)}
          onCreate={handleCreateGroup}
          onRename={handleRenameGroup}
          onDelete={handleDeleteGroup}
          getUsageCount={getGroupUsageCount}
          getSubtitle={(_g, count) => `Quote Rows (${count})`}
          addButtonLabel="ADD QUOTE GROUP"
          addPlaceholder="Enter a Quote Group name"
          searchPlaceholder="Quick Search"
        />

        <ManageListPanel
          visible={openPanel === 'attributes'}
          title="Manage Reporting Attributes"
          sectionLabel="REPORTING ATTRIBUTES"
          items={attributes}
          onClose={() => setOpenPanel(null)}
          onCreate={handleCreateAttribute}
          onRename={handleRenameAttribute}
          onDelete={handleDeleteAttribute}
          getUsageCount={getAttributeUsageCount}
          getSubtitle={(_a, count) => `Quote Rows (${count})`}
          addButtonLabel="ADD REPORTING ATTRIBUTE"
          addPlaceholder="Enter a Reporting Attribute name"
          searchPlaceholder="Quick Search"
        />
      </Horizontal>
    </Vertical>
  )
}
