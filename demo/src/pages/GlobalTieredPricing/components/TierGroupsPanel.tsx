import { useState, useMemo } from 'react'
import { GraviGrid, Vertical, Horizontal, GraviButton, Texto } from '@gravitate-js/excalibrr'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Modal, Input, message } from 'antd'
import type { ColDef } from 'ag-grid-community'
import type { TierGroup, TieredPricingRow } from '../GlobalTieredPricing.types'

interface TierGroupsPanelProps {
  groups: TierGroup[]
  rows: TieredPricingRow[]
  onGroupsChange: (groups: TierGroup[]) => void
}

export function TierGroupsPanel({ groups, rows, onGroupsChange }: TierGroupsPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<TierGroup | null>(null)
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')

  const rowCountsByGroup = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const row of rows) {
      counts[row.group] = (counts[row.group] || 0) + 1
    }
    return counts
  }, [rows])

  const gridData = useMemo(() =>
    groups.map(g => ({
      ...g,
      rowCount: rowCountsByGroup[g.id] ?? 0,
    })),
    [groups, rowCountsByGroup]
  )

  const handleAdd = () => {
    setEditingGroup(null)
    setLabel('')
    setDescription('')
    setModalOpen(true)
  }

  const handleEdit = (group: TierGroup) => {
    setEditingGroup(group)
    setLabel(group.label)
    setDescription(group.description ?? '')
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!label.trim()) {
      message.error('Label is required')
      return
    }

    if (editingGroup) {
      const updated = groups.map(g =>
        g.id === editingGroup.id
          ? { ...g, label: label.trim(), description: description.trim() || undefined }
          : g
      )
      onGroupsChange(updated)
      message.success('Group updated')
    } else {
      const newId = `group-${label.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      const newGroup: TierGroup = {
        id: newId,
        label: label.trim(),
        description: description.trim() || undefined,
        order: groups.length + 1,
      }
      onGroupsChange([...groups, newGroup])
      message.success('Group created')
    }

    setModalOpen(false)
  }

  const handleDelete = (group: TierGroup) => {
    const count = rowCountsByGroup[group.id] ?? 0
    Modal.confirm({
      title: `Delete "${group.label}"?`,
      content: count > 0
        ? `This group has ${count} assigned rows. They will become unassigned.`
        : 'This group has no assigned rows.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        onGroupsChange(groups.filter(g => g.id !== group.id))
        message.success('Group deleted')
      },
    })
  }

  const columnDefs: ColDef[] = [
    { field: 'order', headerName: 'ORDER', width: 80, sortable: true },
    { field: 'label', headerName: 'LABEL', flex: 1, sortable: true },
    { field: 'description', headerName: 'DESCRIPTION', flex: 2 },
    { field: 'rowCount', headerName: 'AFFECTED ROWS', width: 130, type: 'rightAligned' },
    {
      headerName: 'ACTIONS',
      width: 120,
      cellRenderer: (params: { data: TierGroup & { rowCount: number } }) => (
        <Horizontal gap={4}>
          <span style={{ cursor: 'pointer', padding: 4 }} onClick={() => handleEdit(params.data)}>
            <EditOutlined />
          </span>
          <span style={{ cursor: 'pointer', padding: 4, color: 'var(--theme-error)' }} onClick={() => handleDelete(params.data)}>
            <DeleteOutlined />
          </span>
        </Horizontal>
      ),
    },
  ]

  return (
    <Vertical height="100%">
      <GraviGrid
        storageKey="tier-groups-management-grid"
        rowData={gridData}
        columnDefs={columnDefs}
        agPropOverrides={{
          getRowId: (params: { data: TierGroup }) => params.data.id,
          domLayout: 'autoHeight',
        }}
        controlBarProps={{
          title: 'Tier Groups',
          actionButtons: (
            <GraviButton
              buttonText="Add Group"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            />
          ),
        }}
      />

      <Modal
        title={editingGroup ? 'Edit Group' : 'Add Group'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText={editingGroup ? 'Save' : 'Create'}
      >
        <Vertical gap={12} style={{ paddingTop: 8 }}>
          <Vertical gap={4}>
            <Texto weight="bold">Label</Texto>
            <Input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g., Group A or Wholesale"
              autoFocus
            />
          </Vertical>
          <Vertical gap={4}>
            <Texto weight="bold">Description</Texto>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </Vertical>
        </Vertical>
      </Modal>
    </Vertical>
  )
}
