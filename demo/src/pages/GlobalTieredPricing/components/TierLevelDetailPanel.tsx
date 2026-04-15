import { useState, useCallback, useRef } from 'react'
import { GraviGrid, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Input, message } from 'antd'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons'
import type { TierLevel } from '../GlobalTieredPricing.types'

interface TierLevelDetailPanelProps {
  parentGroupId: string
  parentGroupLabel: string
  levels: TierLevel[]
  levelColDefs: any[]
  onAddLevel?: (groupId: string, label: string) => void
}

export function TierLevelDetailPanel({
  parentGroupId,
  parentGroupLabel,
  levels,
  levelColDefs,
  onAddLevel,
}: TierLevelDetailPanelProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')

  const handleStartAdd = useCallback(() => {
    setIsAdding(true)
    setNewLabel('')
  }, [])

  const handleCancelAdd = useCallback(() => {
    setIsAdding(false)
    setNewLabel('')
  }, [])

  const handleSave = useCallback(() => {
    if (!newLabel.trim()) {
      message.error('Level name is required')
      return
    }
    onAddLevel?.(parentGroupId, newLabel.trim())
    setIsAdding(false)
    setNewLabel('')
  }, [newLabel, parentGroupId, onAddLevel])

  return (
    <div style={{ padding: '8px 12px 12px 48px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Texto appearance="medium" style={{ fontSize: 12 }}>
          {levels.length} level{levels.length !== 1 ? 's' : ''}
          {isAdding && <span style={{ color: 'var(--success-color, #10b981)', fontWeight: 600 }}> + 1 new</span>}
        </Texto>
        {isAdding ? (
          <Horizontal gap={8}>
            <GraviButton success buttonText="Save" icon={<SaveOutlined />} onClick={handleSave} />
            <GraviButton buttonText="Cancel" onClick={handleCancelAdd} />
          </Horizontal>
        ) : (
          <GraviButton success buttonText="Add Level" icon={<PlusOutlined />} onClick={handleStartAdd} />
        )}
      </div>

      {isAdding && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          padding: '10px 12px',
          border: '1px solid #fcd34d',
          background: '#fffef5',
          marginBottom: 8,
          borderRadius: 4,
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>Level Name</span>
            <Input
              placeholder="e.g., Platinum, Gold, or Tier 1"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onPressEnter={handleSave}
              autoFocus
            />
          </div>
        </div>
      )}

      <GraviGrid
        storageKey={`tier-levels-${parentGroupId}`}
        rowData={levels}
        columnDefs={levelColDefs}
        agPropOverrides={{
          domLayout: 'autoHeight',
          suppressRowDrag: true,
          suppressMovableColumns: true,
          getRowId: (p: any) => String(p.data.id),
        }}
        hideControlBar={true}
      />
    </div>
  )
}
