/**
 * GroupPanelListView
 *
 * List view for the volume group panel. Shows group tiles with compliance status,
 * detail chips, allocation progress bars, and an ungrouped items section with
 * drag-and-drop support.
 */

import { useState, type DragEvent } from 'react'
import { Texto, GraviButton, Vertical } from '@gravitate-js/excalibrr'
import { PlusOutlined } from '@ant-design/icons'

import type { ContractDetail, VolumeGroup } from '../../../types/contract.types'
import { formatVolume } from '../../../data/contract.data'
import { getComplianceColor } from '../../volumeGroup.utils'
import { AllocationProgressBar } from './AllocationProgressBar'
import { GroupDetailChip } from './GroupDetailChip'
import styles from './GroupPanelListView.module.css'

interface GroupPanelListViewProps {
  volumeGroups: VolumeGroup[]
  details: ContractDetail[]
  selectedDetailIds: string[]
  onEditGroup: (groupId: string) => void
  onPanelApply: (groupId: string) => void
  onNewGroup: () => void
  onDragDropAssign: (detailId: string, groupId: string) => void
}

export function GroupPanelListView({
  volumeGroups,
  details,
  selectedDetailIds,
  onEditGroup,
  onPanelApply,
  onNewGroup,
  onDragDropAssign,
}: GroupPanelListViewProps) {
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null)

  const hasSelection = selectedDetailIds.length > 0

  const ungroupedDetails = details.filter(
    (d) => !d.volumeGroupIds || d.volumeGroupIds.length === 0
  )

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function handleDragEnter(groupId: string) {
    setDragOverGroupId(groupId)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>, groupId: string) {
    const relatedTarget = e.relatedTarget as Node | null
    const currentTarget = e.currentTarget as Node
    if (relatedTarget && currentTarget.contains(relatedTarget)) return
    if (dragOverGroupId === groupId) {
      setDragOverGroupId(null)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, groupId: string) {
    e.preventDefault()
    setDragOverGroupId(null)
    const detailId = e.dataTransfer.getData('text/plain')
    if (detailId) {
      onDragDropAssign(detailId, groupId)
    }
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>, detailId: string) {
    e.dataTransfer.setData('text/plain', detailId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <Vertical flex='1' height='100%'>
      <div className={styles['list-container']}>
        {/* Group tiles */}
        {volumeGroups.map((group) => {
          const groupDetails = details.filter(
            (d) => d.volumeGroupIds && d.volumeGroupIds.includes(group.id)
          )
          const isDragOver = dragOverGroupId === group.id
          const tileClass = `${styles['group-tile']}${isDragOver ? ` ${styles['group-tile-drag-over']}` : ''}`

          return (
            <div
              key={group.id}
              className={tileClass}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(group.id)}
              onDragLeave={(e) => handleDragLeave(e, group.id)}
              onDrop={(e) => handleDrop(e, group.id)}
            >
              {/* Header row: name + button */}
              <div className={styles['group-header']}>
                <div className={styles['group-name-row']}>
                  <span
                    className={styles['compliance-dot']}
                    style={{ backgroundColor: getComplianceColor(group.compliance) }}
                  />
                  <Texto category='p1' weight='600'>
                    {group.name}
                  </Texto>
                </div>
                {hasSelection ? (
                  <GraviButton
                    buttonText='Apply'
                    size='small'
                    theme1
                    onClick={() => onPanelApply(group.id)}
                  />
                ) : (
                  <GraviButton
                    buttonText='Edit'
                    size='small'
                    type='link'
                    onClick={() => onEditGroup(group.id)}
                  />
                )}
              </div>

              {/* Summary line */}
              <Texto category='p2' appearance='medium' style={{ marginTop: '4px' }}>
                {formatVolume(group.allocation)} {group.allocationUnit} &middot; {group.frequency}
              </Texto>

              {/* Detail chips */}
              {groupDetails.length > 0 && (
                <div className={styles['detail-chips']}>
                  {groupDetails.map((d) => (
                    <GroupDetailChip key={d.id} product={d.product} location={d.location} />
                  ))}
                </div>
              )}

              {/* Progress bar */}
              <div className={styles['progress-row']}>
                <AllocationProgressBar
                  percent={group.liftedPercent}
                  compliance={group.compliance}
                />
              </div>
            </div>
          )
        })}

        {/* Ungrouped section */}
        {ungroupedDetails.length > 0 && (
          <div className={styles['ungrouped-section']}>
            <Texto category='p2' appearance='medium' weight='600' className={styles['ungrouped-title']}>
              UNGROUPED
            </Texto>
            {ungroupedDetails.map((d) => (
              <div
                key={d.id}
                className={styles['ungrouped-item']}
                draggable
                onDragStart={(e) => handleDragStart(e, d.id)}
              >
                <span className={styles['drag-handle']}>&#x2807;</span>
                <Texto category='p2'>
                  {d.product} &mdash; {d.location}
                </Texto>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <GraviButton
          buttonText='New Volume Group'
          icon={<PlusOutlined />}
          type='dashed'
          block
          onClick={onNewGroup}
        />
      </div>
    </Vertical>
  )
}
