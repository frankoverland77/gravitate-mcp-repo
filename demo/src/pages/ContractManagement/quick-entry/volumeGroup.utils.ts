/**
 * Volume Group Utilities
 *
 * Functions for managing volume group assignments on contract details.
 * detail.volumeGroupIds is the single source of truth — group.detailIds is always derived.
 */

import type { ContractDetail, VolumeGroup, GroupCompliance } from '../types/contract.types'

/**
 * Add a group to a detail (additive, no duplicates)
 */
export function addGroupToDetail(detail: ContractDetail, groupId: string): ContractDetail {
  const ids = detail.volumeGroupIds ?? []
  if (ids.includes(groupId)) return detail
  return { ...detail, volumeGroupIds: [...ids, groupId] }
}

/**
 * Remove a group from a detail
 */
export function removeGroupFromDetail(detail: ContractDetail, groupId: string): ContractDetail {
  const ids = detail.volumeGroupIds ?? []
  return { ...detail, volumeGroupIds: ids.filter((id) => id !== groupId) }
}

/**
 * Toggle group membership on a detail
 */
export function toggleGroupOnDetail(detail: ContractDetail, groupId: string): ContractDetail {
  const ids = detail.volumeGroupIds ?? []
  if (ids.includes(groupId)) {
    return removeGroupFromDetail(detail, groupId)
  }
  return addGroupToDetail(detail, groupId)
}

/**
 * Clear all group assignments from a detail
 */
export function clearGroupsFromDetail(detail: ContractDetail): ContractDetail {
  return { ...detail, volumeGroupIds: [] }
}

/**
 * Derive group.detailIds from details (single source of truth pattern).
 * Returns a new array of groups with updated detailIds.
 */
export function syncGroupDetailIds(details: ContractDetail[], groups: VolumeGroup[]): VolumeGroup[] {
  return groups.map((group) => ({
    ...group,
    detailIds: details.filter((d) => (d.volumeGroupIds ?? []).includes(group.id)).map((d) => d.id),
  }))
}

/**
 * Get CSS color for a compliance status
 */
export function getComplianceColor(compliance: GroupCompliance): string {
  return compliance === 'ok' ? '#2563eb' : '#d97706'
}

/**
 * Get CSS color for the allocation bar fill
 */
export function getComplianceBarColor(compliance: GroupCompliance): string {
  return compliance === 'ok' ? '#16a34a' : '#d97706'
}
