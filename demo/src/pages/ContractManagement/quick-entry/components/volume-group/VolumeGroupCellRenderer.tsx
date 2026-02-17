/**
 * VolumeGroupCellRenderer
 *
 * AG Grid cell renderer for volume group assignments.
 * 0 groups: italic "— None"
 * 1 group: plain text group name
 * 2+ groups: "N groups" link with popover listing colored pills
 */

import { Texto } from '@gravitate-js/excalibrr'
import type { ICellRendererParams } from 'ag-grid-community'
import { Popover } from 'antd'

import type { ContractDetail, VolumeGroup } from '../../../types/contract.types'
import styles from './VolumeGroupCellRenderer.module.css'

interface VolumeGroupCellRendererParams extends ICellRendererParams<ContractDetail> {
  volumeGroups: VolumeGroup[]
}

export function VolumeGroupCellRenderer(params: VolumeGroupCellRendererParams) {
  const groupIds: string[] = params.value ?? []
  const volumeGroups: VolumeGroup[] = params.volumeGroups ?? []

  if (groupIds.length === 0) {
    return (
      <Texto category='p2' appearance='medium' style={{ fontStyle: 'italic' }}>
        &mdash; None
      </Texto>
    )
  }

  const resolvedGroups = groupIds.map((id) => volumeGroups.find((g) => g.id === id)).filter(Boolean) as VolumeGroup[]

  if (resolvedGroups.length === 0) return null

  if (resolvedGroups.length === 1) {
    return <Texto category='p2'>{resolvedGroups[0].name}</Texto>
  }

  const popoverContent = (
    <div className={styles['popover-list']}>
      {resolvedGroups.map((group) => {
        const pillClass = group.compliance === 'warning' ? styles['pill-warning'] : styles['pill-ok']
        return (
          <span key={group.id} className={`${styles.pill} ${pillClass}`}>
            {group.name}
          </span>
        )
      })}
    </div>
  )

  return (
    <Popover content={popoverContent} trigger='click' placement='bottomLeft'>
      <span className={styles['group-link']}>{resolvedGroups.length} groups</span>
    </Popover>
  )
}
