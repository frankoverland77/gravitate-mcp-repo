import { useState } from 'react'
import { GraviGrid, Vertical, Horizontal, GraviButton, Texto } from '@gravitate-js/excalibrr'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Modal, Input, Alert, message } from 'antd'
import type { ColDef } from 'ag-grid-community'
import type { TierLevel } from '../GlobalTieredPricing.types'

interface TierLevelsPanelProps {
  levels: TierLevel[]
  onLevelsChange: (levels: TierLevel[]) => void
}

export function TierLevelsPanel({ levels, onLevelsChange }: TierLevelsPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<TierLevel | null>(null)
  const [label, setLabel] = useState('')

  const handleAdd = () => {
    setEditingLevel(null)
    setLabel('')
    setModalOpen(true)
  }

  const handleEdit = (level: TierLevel) => {
    setEditingLevel(level)
    setLabel(level.label)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!label.trim()) {
      message.error('Label is required')
      return
    }

    if (editingLevel) {
      const updated = levels.map(l =>
        l.id === editingLevel.id ? { ...l, label: label.trim() } : l
      )
      onLevelsChange(updated)
      message.success('Level updated')
    } else {
      const newId = `tier-${levels.length + 1}-${Date.now()}`
      const newLevel: TierLevel = {
        id: newId,
        label: label.trim(),
        order: levels.length + 1,
        isDefault: false,
      }
      onLevelsChange([...levels, newLevel])
      message.success('Level created')
    }

    setModalOpen(false)
  }

  const handleDelete = (level: TierLevel) => {
    if (level.isDefault) {
      message.warning('Cannot delete default tier levels')
      return
    }
    Modal.confirm({
      title: `Delete "${level.label}"?`,
      content: 'This tier level will be removed from the system.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        onLevelsChange(levels.filter(l => l.id !== level.id))
        message.success('Level deleted')
      },
    })
  }

  const columnDefs: ColDef[] = [
    { field: 'order', headerName: 'ORDER', width: 80, sortable: true },
    { field: 'label', headerName: 'LABEL', flex: 1, sortable: true },
    {
      field: 'isDefault',
      headerName: 'DEFAULT',
      width: 100,
      valueFormatter: (params: { value: boolean }) => params.value ? 'Yes' : 'No',
    },
    {
      headerName: 'ACTIONS',
      width: 120,
      cellRenderer: (params: { data: TierLevel }) => (
        <Horizontal gap={4}>
          <span style={{ cursor: 'pointer', padding: 4 }} onClick={() => handleEdit(params.data)}>
            <EditOutlined />
          </span>
          <span
            style={{
              cursor: params.data.isDefault ? 'not-allowed' : 'pointer',
              padding: 4,
              color: params.data.isDefault ? 'var(--gray-400)' : 'var(--theme-error)',
            }}
            onClick={() => !params.data.isDefault && handleDelete(params.data)}
          >
            <DeleteOutlined />
          </span>
        </Horizontal>
      ),
    },
  ]

  return (
    <Vertical height="100%">
      <Alert
        message="Open Question: Naming Convention"
        description="Tier levels support both generic naming (Tier 1, Tier 2, Tier 3) and user-defined naming (Diamond, Gold, Silver). The final convention is pending a design decision."
        type="info"
        showIcon
        style={{ margin: '0 0 12px 0' }}
      />

      <GraviGrid
        storageKey="tier-levels-management-grid"
        rowData={levels}
        columnDefs={columnDefs}
        agPropOverrides={{
          getRowId: (params: { data: TierLevel }) => params.data.id,
          domLayout: 'autoHeight',
        }}
        controlBarProps={{
          title: 'Tier Levels',
          actionButtons: (
            <GraviButton
              buttonText="Add Level"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            />
          ),
        }}
      />

      <Modal
        title={editingLevel ? 'Edit Level' : 'Add Level'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText={editingLevel ? 'Save' : 'Create'}
      >
        <Vertical gap={12} style={{ paddingTop: 8 }}>
          <Vertical gap={4}>
            <Texto weight="bold">Label</Texto>
            <Input
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g., Tier 1 or Diamond"
              autoFocus
            />
          </Vertical>
        </Vertical>
      </Modal>
    </Vertical>
  )
}
