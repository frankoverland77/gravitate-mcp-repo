/**
 * VolumeGroupPanel
 *
 * Right-side panel container for volume group management.
 * Manages view state machine: list -> edit, list -> create, with back navigation.
 * 380px width, CSS transition for show/hide.
 */

import { useState, useEffect } from 'react'
import { Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CloseOutlined } from '@ant-design/icons'

import type {
  ContractDetail,
  VolumeGroup,
  VolumeGroupPanelView,
} from '../../types/contract.types'
import { GroupPanelListView } from '../components/volume-group/GroupPanelListView'
import { GroupPanelEditView } from '../components/volume-group/GroupPanelEditView'
import { GroupPanelCreateView } from '../components/volume-group/GroupPanelCreateView'
import styles from './VolumeGroupPanel.module.css'

interface VolumeGroupPanelProps {
  visible: boolean
  volumeGroups: VolumeGroup[]
  details: ContractDetail[]
  selectedDetailIds: string[]
  onGroupUpdate: (group: VolumeGroup) => void
  onGroupCreate: (group: Omit<VolumeGroup, 'id' | 'detailIds' | 'compliance' | 'liftedPercent'>) => void
  onGroupDelete: (groupId: string) => void
  onPanelApply: (groupId: string) => void
  onDragDropAssign: (detailId: string, groupId: string) => void
  onClose: () => void
}

export function VolumeGroupPanel({
  visible,
  volumeGroups,
  details,
  selectedDetailIds,
  onGroupUpdate,
  onGroupCreate,
  onGroupDelete,
  onPanelApply,
  onDragDropAssign,
  onClose,
}: VolumeGroupPanelProps) {
  const [currentView, setCurrentView] = useState<VolumeGroupPanelView>('list')
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)

  // Reset to list view when panel is hidden
  useEffect(() => {
    if (!visible) {
      setCurrentView('list')
      setEditingGroupId(null)
    }
  }, [visible])

  const panelClass = `${styles.panel}${!visible ? ` ${styles['panel-hidden']}` : ''}`

  const editingGroup = editingGroupId
    ? volumeGroups.find((g) => g.id === editingGroupId) ?? null
    : null

  function handleEditGroup(groupId: string) {
    setEditingGroupId(groupId)
    setCurrentView('edit')
  }

  function handleNewGroup() {
    setCurrentView('create')
  }

  function handleBackToList() {
    setCurrentView('list')
    setEditingGroupId(null)
  }

  function handleSaveGroup(updated: VolumeGroup) {
    onGroupUpdate(updated)
    handleBackToList()
  }

  function handleCreateGroup(group: Omit<VolumeGroup, 'id' | 'detailIds' | 'compliance' | 'liftedPercent'>) {
    onGroupCreate(group)
    handleBackToList()
  }

  function handleRemoveDetail(detailId: string) {
    if (!editingGroup) return
    // This triggers the parent to remove the detail from the group
    // by updating the detail's volumeGroupIds
    onGroupDelete(detailId)
  }

  return (
    <div className={panelClass}>
      {/* Header - only shown in list view */}
      {currentView === 'list' && (
        <div className={styles['panel-header']}>
          <Texto category='h5' weight='600'>
            Volume Groups
          </Texto>
          <GraviButton
            type='text'
            icon={<CloseOutlined />}
            onClick={onClose}
            size='small'
          />
        </div>
      )}

      {/* Body */}
      <div className={styles['panel-body']}>
        {currentView === 'list' && (
          <GroupPanelListView
            volumeGroups={volumeGroups}
            details={details}
            selectedDetailIds={selectedDetailIds}
            onEditGroup={handleEditGroup}
            onPanelApply={onPanelApply}
            onNewGroup={handleNewGroup}
            onDragDropAssign={onDragDropAssign}
          />
        )}

        {currentView === 'edit' && editingGroup && (
          <GroupPanelEditView
            group={editingGroup}
            details={details}
            onSave={handleSaveGroup}
            onCancel={handleBackToList}
            onRemoveDetail={handleRemoveDetail}
          />
        )}

        {currentView === 'create' && (
          <GroupPanelCreateView
            onCreateGroup={handleCreateGroup}
            onCancel={handleBackToList}
          />
        )}
      </div>
    </div>
  )
}
