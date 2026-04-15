import { useState, useMemo, useCallback } from 'react'
import { GraviGrid, Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { PlusOutlined, DeleteOutlined, EditOutlined, WarningOutlined, StopOutlined } from '@ant-design/icons'
import { Modal, Input, Select, message, Alert } from 'antd'
import type { ICellRendererParams } from 'ag-grid-community'
import type { TierGroup, TierLevel, TieredPricingRow } from './GlobalTieredPricing.types'
import { defaultTierGroups, defaultTierLevels, tieredPricingData, counterpartyAssignments } from './GlobalTieredPricing.data'
import { loadPersistedGroups, persistGroups, loadPersistedLevels, persistLevels, loadPersistedRows } from './GlobalTieredPricing.persistence'
import { TierLevelDetailPanel } from './components/TierLevelDetailPanel'

// Parent row type — levels embedded on each row, same pattern as CompetitorQuoteRow.competitorAssociations
type GroupGridRow = TierGroup & {
  levelCount: number
  rowCount: number
  levels: TierLevel[]
}

export function TierGroupManagement() {
  const [groups, setGroups] = useState<TierGroup[]>(() => loadPersistedGroups() ?? defaultTierGroups)
  const [levels, setLevels] = useState<TierLevel[]>(() => loadPersistedLevels() ?? defaultTierLevels)
  const [rows] = useState<TieredPricingRow[]>(() => loadPersistedRows() ?? tieredPricingData)

  // Group modal
  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<TierGroup | null>(null)
  const [groupLabel, setGroupLabel] = useState('')
  const [groupDescription, setGroupDescription] = useState('')

  // Level modal
  const [levelModalOpen, setLevelModalOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<TierLevel | null>(null)
  const [levelLabel, setLevelLabel] = useState('')
  const [levelGroupId, setLevelGroupId] = useState('')

  // Delete modals
  const [deleteLevelModal, setDeleteLevelModal] = useState<{ level: TierLevel; affectedCount: number } | null>(null)
  const [deleteGroupModal, setDeleteGroupModal] = useState<{ group: TierGroup; affectedCount: number; levelBreakdown: { label: string; count: number }[] } | null>(null)
  const [reassignTarget, setReassignTarget] = useState<string>('')

  const rowCountsByGroup = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const row of rows) { counts[row.group] = (counts[row.group] || 0) + 1 }
    return counts
  }, [rows])

  const rowCountsByLevel = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of counterpartyAssignments) {
      const key = `${a.groupId}|${a.tierLevel}`
      counts[key] = (counts[key] || 0) + 1
    }
    return counts
  }, [])

  const levelsByGroup = useMemo(() => {
    const map: Record<string, TierLevel[]> = {}
    for (const level of levels) {
      if (!map[level.groupId]) map[level.groupId] = []
      map[level.groupId].push(level)
    }
    for (const key of Object.keys(map)) { map[key].sort((a, b) => a.order - b.order) }
    return map
  }, [levels])

  // Build grid rows with levels embedded — same pattern as competitorAssociations on CompetitorQuoteRow
  const groupGridData: GroupGridRow[] = useMemo(() =>
    groups.map(g => ({
      ...g,
      levelCount: (levelsByGroup[g.id] ?? []).length,
      rowCount: rowCountsByGroup[g.id] ?? 0,
      levels: levelsByGroup[g.id] ?? [],
    })),
    [groups, levelsByGroup, rowCountsByGroup]
  )

  // ── Group CRUD ──

  const handleAddGroup = () => {
    setEditingGroup(null); setGroupLabel(''); setGroupDescription(''); setGroupModalOpen(true)
  }
  const handleEditGroup = (group: TierGroup) => {
    setEditingGroup(group); setGroupLabel(group.label); setGroupDescription(group.description ?? ''); setGroupModalOpen(true)
  }
  const handleSaveGroup = () => {
    if (!groupLabel.trim()) { message.error('Label is required'); return }
    let newGroups: TierGroup[]
    if (editingGroup) {
      newGroups = groups.map(g => g.id === editingGroup.id ? { ...g, label: groupLabel.trim(), description: groupDescription.trim() || undefined } : g)
      message.success('Group updated')
    } else {
      const newId = `group-${groupLabel.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      newGroups = [...groups, { id: newId, label: groupLabel.trim(), description: groupDescription.trim() || undefined, order: groups.length + 1 }]
      message.success('Group created')
    }
    setGroups(newGroups); persistGroups(newGroups); setGroupModalOpen(false)
  }
  const handleDeleteGroup = (group: TierGroup) => {
    const count = rowCountsByGroup[group.id] ?? 0
    const groupLevels = levelsByGroup[group.id] ?? []
    if (count === 0) {
      Modal.confirm({
        title: `Delete "${group.label}"?`,
        content: `This will also delete ${groupLevels.length} tier level(s). No rows are affected.`,
        okText: 'Delete', okButtonProps: { danger: true },
        onOk: () => executeDeleteGroup(group.id),
      })
    } else {
      setReassignTarget('')
      setDeleteGroupModal({ group, affectedCount: count, levelBreakdown: groupLevels.map(l => ({ label: l.label, count: rowCountsByLevel[`${group.id}|${l.label}`] ?? 0 })) })
    }
  }
  const executeDeleteGroup = (groupId: string) => {
    setGroups(prev => { const n = prev.filter(g => g.id !== groupId); persistGroups(n); return n })
    setLevels(prev => { const n = prev.filter(l => l.groupId !== groupId); persistLevels(n); return n })
    message.success('Group and its levels deleted')
  }
  const handleConfirmDeleteGroup = (reassign: boolean) => {
    if (!deleteGroupModal) return
    if (reassign && !reassignTarget) { message.error('Select a group to reassign rows to'); return }
    if (reassign) message.info(`Rows reassigned to ${groups.find(g => g.id === reassignTarget)?.label}. Tier levels cleared.`)
    executeDeleteGroup(deleteGroupModal.group.id); setDeleteGroupModal(null)
  }

  // ── Level CRUD ──

  const handleAddLevel = useCallback((groupId: string, label: string) => {
    const groupLevels = levelsByGroup[groupId] ?? []
    const newId = `${groupId}-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const newLevels = [...levels, { id: newId, groupId, label, order: groupLevels.length + 1, isDefault: false }]
    setLevels(newLevels); persistLevels(newLevels)
    message.success('Level created')
  }, [levels, levelsByGroup])

  const handleEditLevel = useCallback((level: TierLevel) => {
    setEditingLevel(level); setLevelLabel(level.label); setLevelGroupId(level.groupId); setLevelModalOpen(true)
  }, [])

  const handleSaveLevel = () => {
    if (!levelLabel.trim()) { message.error('Label is required'); return }
    const newLevels = levels.map(l => l.id === editingLevel!.id ? { ...l, label: levelLabel.trim() } : l)
    setLevels(newLevels); persistLevels(newLevels); setLevelModalOpen(false); message.success('Level updated')
  }

  const handleDeleteLevel = useCallback((level: TierLevel) => {
    const groupLevels = levelsByGroup[level.groupId] ?? []
    const affectedCount = rowCountsByLevel[`${level.groupId}|${level.label}`] ?? 0
    const isLastLevel = groupLevels.length === 1
    const groupHasRows = (rowCountsByGroup[level.groupId] ?? 0) > 0

    if (isLastLevel && groupHasRows) {
      Modal.error({ title: 'Cannot Delete Last Level', content: `"${level.label}" is the only level in this group with assigned rows. Delete the group instead, or add another level first.` })
      return
    }
    if (affectedCount === 0) {
      Modal.confirm({ title: `Delete "${level.label}"?`, content: 'No rows are affected.', okText: 'Delete', okButtonProps: { danger: true }, onOk: () => executeDeleteLevel(level.id) })
    } else {
      setReassignTarget(''); setDeleteLevelModal({ level, affectedCount })
    }
  }, [levelsByGroup, rowCountsByLevel, rowCountsByGroup])

  const executeDeleteLevel = (levelId: string) => {
    setLevels(prev => { const n = prev.filter(l => l.id !== levelId); persistLevels(n); return n })
    message.success('Level deleted')
  }
  const handleConfirmDeleteLevel = (reassign: boolean) => {
    if (!deleteLevelModal) return
    if (reassign && !reassignTarget) { message.error('Select a level to reassign rows to'); return }
    if (reassign) message.info(`Rows reassigned to ${levels.find(l => l.id === reassignTarget)?.label}.`)
    executeDeleteLevel(deleteLevelModal.level.id); setDeleteLevelModal(null)
  }

  const siblingLevelOptions = useMemo(() => {
    if (!deleteLevelModal) return []
    return (levelsByGroup[deleteLevelModal.level.groupId] ?? []).filter(l => l.id !== deleteLevelModal.level.id).map(l => ({ value: l.id, label: l.label }))
  }, [deleteLevelModal, levelsByGroup])

  const otherGroupOptions = useMemo(() => {
    if (!deleteGroupModal) return []
    return groups.filter(g => g.id !== deleteGroupModal.group.id).map(g => ({ value: g.id, label: g.label }))
  }, [deleteGroupModal, groups])

  // ── Detail level columns (same across all groups) ──

  const getLevelColDefs = useCallback(() => [
    { field: 'order', headerName: 'Order', width: 80 },
    { field: 'label', headerName: 'Level Name', flex: 1 },
    {
      headerName: 'Rows', width: 90, type: 'rightAligned',
      valueGetter: (p: any) => p.data ? (rowCountsByLevel[`${p.data.groupId}|${p.data.label}`] ?? 0) : 0,
    },
    {
      headerName: '', width: 100, suppressMenu: true, sortable: false,
      cellRenderer: (p: ICellRendererParams<TierLevel>) => {
        if (!p.data) return null
        return (
          <Horizontal gap={4} alignItems="center" style={{ height: '100%' }}>
            <span style={{ cursor: 'pointer', padding: 4 }} onClick={() => handleEditLevel(p.data!)}><EditOutlined /></span>
            <span style={{ cursor: 'pointer', padding: 4, color: 'var(--theme-error)' }} onClick={() => handleDeleteLevel(p.data!)}><DeleteOutlined /></span>
          </Horizontal>
        )
      },
    },
  ], [rowCountsByLevel, handleEditLevel, handleDeleteLevel])

  // ── Detail renderer — follows CompetitorDetailRenderer pattern exactly ──

  const TierLevelRenderer = useCallback(
    (params: any) => {
      const parentRow = params.data as GroupGridRow
      if (!parentRow) return null

      return (
        <TierLevelDetailPanel
          parentGroupId={parentRow.id}
          parentGroupLabel={parentRow.label}
          levels={parentRow.levels}
          levelColDefs={getLevelColDefs()}
          onAddLevel={handleAddLevel}
        />
      )
    },
    [getLevelColDefs, handleAddLevel],
  )

  // ── Parent grid columns ──

  const groupColumnDefs = useMemo((): any[] => [
    {
      field: 'label',
      headerName: 'Group Name',
      flex: 1,
      sortable: true,
      cellRenderer: 'agGroupCellRenderer',
    },
    { field: 'order', headerName: 'Order', width: 80, sortable: true },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'levelCount', headerName: 'Levels', width: 90, type: 'rightAligned' },
    { field: 'rowCount', headerName: 'Rows', width: 90, type: 'rightAligned' },
    {
      headerName: '', width: 100, suppressMenu: true, sortable: false,
      cellRenderer: (params: ICellRendererParams<GroupGridRow>) => {
        if (!params.data) return null
        return (
          <Horizontal gap={4} alignItems="center" style={{ height: '100%' }}>
            <span style={{ cursor: 'pointer', padding: 4 }} onClick={(e) => { e.stopPropagation(); handleEditGroup(params.data!) }}><EditOutlined /></span>
            <span style={{ cursor: 'pointer', padding: 4, color: 'var(--theme-error)' }} onClick={(e) => { e.stopPropagation(); handleDeleteGroup(params.data!) }}><DeleteOutlined /></span>
          </Horizontal>
        )
      },
    },
  ], [])

  return (
    <Vertical height="100%">
      <GraviGrid
        storageKey="tier-management-groups-grid"
        rowData={groupGridData}
        columnDefs={groupColumnDefs}
        agPropOverrides={{
          getRowId: (p: any) => String(p.data.id),
          rowSelection: 'multiple' as const,
          suppressRowClickSelection: true,
          rowGroupPanelShow: 'never',
          masterDetail: true,
          detailRowAutoHeight: true,
          isRowMaster: (data: GroupGridRow) => data?.levelCount > 0,
          detailCellRenderer: TierLevelRenderer,
        }}
        controlBarProps={{
          title: 'Tier Management',
          hideActiveFilters: true,
          hideSearch: true,
          actionButtons: (
            <GraviButton buttonText="Add Group" icon={<PlusOutlined />} onClick={handleAddGroup} />
          ),
        }}
      />

      {/* Group Add/Edit Modal */}
      <Modal title={editingGroup ? 'Edit Group' : 'Add Group'} open={groupModalOpen} onOk={handleSaveGroup} onCancel={() => setGroupModalOpen(false)} okText={editingGroup ? 'Save' : 'Create'}>
        <Vertical gap={12} style={{ paddingTop: 8 }}>
          <Vertical gap={4}><Texto weight="bold">Label</Texto><Input value={groupLabel} onChange={e => setGroupLabel(e.target.value)} placeholder="e.g., Scott's Group" autoFocus /></Vertical>
          <Vertical gap={4}><Texto weight="bold">Description</Texto><Input value={groupDescription} onChange={e => setGroupDescription(e.target.value)} placeholder="Optional description" /></Vertical>
        </Vertical>
      </Modal>

      {/* Level Edit Modal */}
      <Modal title="Edit Level" open={levelModalOpen} onOk={handleSaveLevel} onCancel={() => setLevelModalOpen(false)} okText="Save">
        <Vertical gap={12} style={{ paddingTop: 8 }}>
          <Vertical gap={4}><Texto weight="bold">Level Name</Texto><Input value={levelLabel} onChange={e => setLevelLabel(e.target.value)} placeholder="e.g., Platinum" autoFocus /></Vertical>
        </Vertical>
      </Modal>

      {/* Delete Level Modal */}
      <Modal
        title={<Horizontal gap={8} alignItems="center"><WarningOutlined style={{ color: '#d97706' }} /> Delete "{deleteLevelModal?.level.label}"</Horizontal>}
        open={!!deleteLevelModal} onCancel={() => setDeleteLevelModal(null)}
        footer={<Horizontal gap={8} justifyContent="flex-end">
          <GraviButton buttonText="Cancel" onClick={() => setDeleteLevelModal(null)} />
          <GraviButton buttonText="Delete Without Reassignment" appearance="outlined" style={{ color: 'var(--theme-error)', borderColor: 'var(--theme-error)' }} onClick={() => handleConfirmDeleteLevel(false)} />
          {siblingLevelOptions.length > 0 && <GraviButton buttonText="Reassign & Delete" success disabled={!reassignTarget} onClick={() => handleConfirmDeleteLevel(true)} />}
        </Horizontal>}
      >
        <Vertical gap={12} style={{ paddingTop: 8 }}>
          <Alert type="warning" showIcon message={`${deleteLevelModal?.affectedCount} row(s) are assigned to this level.`} description="Deleting will remove all tier diff values for this level." />
          {siblingLevelOptions.length > 0
            ? <Vertical gap={4}><Texto weight="bold">Reassign rows to another level:</Texto><Select placeholder="Select a level" value={reassignTarget || undefined} onChange={setReassignTarget} options={siblingLevelOptions} style={{ width: '100%' }} /></Vertical>
            : <Alert type="info" showIcon message="No other levels to reassign to." />
          }
        </Vertical>
      </Modal>

      {/* Delete Group Modal */}
      <Modal
        title={<Horizontal gap={8} alignItems="center"><WarningOutlined style={{ color: '#dc2626' }} /> Delete "{deleteGroupModal?.group.label}"</Horizontal>}
        open={!!deleteGroupModal} onCancel={() => setDeleteGroupModal(null)} width={520}
        footer={<Horizontal gap={8} justifyContent="flex-end">
          <GraviButton buttonText="Cancel" onClick={() => setDeleteGroupModal(null)} />
          <GraviButton buttonText="Delete Without Reassignment" appearance="outlined" style={{ color: 'var(--theme-error)', borderColor: 'var(--theme-error)' }} onClick={() => handleConfirmDeleteGroup(false)} />
          {otherGroupOptions.length > 0 && <GraviButton buttonText="Reassign & Delete" success disabled={!reassignTarget} onClick={() => handleConfirmDeleteGroup(true)} />}
        </Horizontal>}
      >
        <Vertical gap={12} style={{ paddingTop: 8 }}>
          <Alert type="error" showIcon message={`${deleteGroupModal?.affectedCount} row(s) across ${deleteGroupModal?.levelBreakdown?.length} level(s) affected.`} description="Deleting removes all levels and tier diff values." />
          {deleteGroupModal?.levelBreakdown && deleteGroupModal.levelBreakdown.length > 0 && (
            <Vertical gap={2} style={{ padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 4 }}>
              <Texto weight="bold" style={{ marginBottom: 4 }}>By level:</Texto>
              {deleteGroupModal.levelBreakdown.map((lb, i) => <Horizontal key={i} justifyContent="space-between"><Texto>{lb.label}</Texto><Texto appearance="medium">{lb.count} rows</Texto></Horizontal>)}
            </Vertical>
          )}
          {otherGroupOptions.length > 0
            ? <Vertical gap={4}><Texto weight="bold">Reassign rows to another group:</Texto><Texto appearance="medium" style={{ fontSize: 12 }}>Tier levels will be cleared.</Texto><Select placeholder="Select a group" value={reassignTarget || undefined} onChange={setReassignTarget} options={otherGroupOptions} style={{ width: '100%' }} /></Vertical>
            : <Alert type="info" showIcon message="No other groups to reassign to." />
          }
        </Vertical>
      </Modal>
    </Vertical>
  )
}
