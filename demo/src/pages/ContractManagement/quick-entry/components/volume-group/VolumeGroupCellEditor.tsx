/**
 * VolumeGroupCellEditor
 *
 * AG Grid cell editor for multi-selecting volume groups on a contract detail.
 * Uses forwardRef + useImperativeHandle for AG Grid cell editor contract.
 * Dropdown stays open on toggle, closes on "None" selection or outside click.
 * Includes a "Create New Group" option at the bottom.
 */

import { forwardRef, useImperativeHandle, useState, useRef, useEffect, useCallback } from 'react'
import type { ICellEditorParams } from 'ag-grid-community'

import type { ContractDetail, VolumeGroup } from '../../../types/contract.types'
import { getComplianceColor } from '../../volumeGroup.utils'
import styles from './VolumeGroupCellEditor.module.css'

interface VolumeGroupCellEditorProps extends ICellEditorParams<ContractDetail> {
  volumeGroups: VolumeGroup[]
  onOpenCreateGroup?: () => void
}

export const VolumeGroupCellEditor = forwardRef((props: VolumeGroupCellEditorProps, ref) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(props.value ?? [])
  const selectedIdsRef = useRef<string[]>(props.value ?? [])
  const containerRef = useRef<HTMLDivElement>(null)
  const volumeGroups: VolumeGroup[] = props.volumeGroups ?? []

  useImperativeHandle(ref, () => ({
    getValue() {
      return selectedIdsRef.current
    },
    isPopup() {
      return true
    },
  }))

  const stopEditing = useCallback(() => {
    if (props.api) {
      props.api.stopEditing()
    }
  }, [props.api])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        stopEditing()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [stopEditing])

  function handleToggleGroup(groupId: string) {
    setSelectedIds((prev) => {
      const next = prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
      selectedIdsRef.current = next
      return next
    })
  }

  function handleClearAll() {
    selectedIdsRef.current = []
    setSelectedIds([])
    stopEditing()
  }

  function handleCreateGroup() {
    if (props.onOpenCreateGroup) {
      props.onOpenCreateGroup()
    }
    stopEditing()
  }

  return (
    <div ref={containerRef} className={styles.dropdown}>
      <div className={styles['option-list']}>
        {/* None option */}
        <div className={styles.option} onClick={handleClearAll}>
          <span className={styles['check-placeholder']} />
          <span className={styles['option-label-none']}>&mdash; None</span>
        </div>

        {/* Group options */}
        {volumeGroups.map((group) => {
          const isSelected = selectedIds.includes(group.id)
          return (
            <div
              key={group.id}
              className={`${styles.option} ${isSelected ? styles['option-selected'] : ''}`}
              onClick={() => handleToggleGroup(group.id)}
            >
              <span className={styles['check-mark']} style={{ visibility: isSelected ? 'visible' : 'hidden' }}>
                &#10003;
              </span>
              <span
                className={styles['compliance-dot']}
                style={{ backgroundColor: getComplianceColor(group.compliance) }}
              />
              <span className={styles['option-label']}>{group.name}</span>
            </div>
          )
        })}
      </div>

      {/* Create new group option */}
      <div className={styles.divider} />
      <div className={`${styles.option} ${styles['option-create']}`} onClick={handleCreateGroup}>
        <span className={styles['create-icon']}>+</span>
        <span className={styles['option-label']}>Create New Group</span>
      </div>
    </div>
  )
})

VolumeGroupCellEditor.displayName = 'VolumeGroupCellEditor'
