/**
 * localStorage persistence for Global Tiered Pricing
 *
 * Tier diffs persist permanently until explicitly changed or zeroed out.
 * No period reset, no "clear all" behavior.
 */

import type { TieredPricingRow, TierGroup, TierLevel } from './GlobalTieredPricing.types'

const STORAGE_KEY_ROWS = 'global-tiered-pricing-rows'
const STORAGE_KEY_GROUPS = 'global-tiered-pricing-groups'
const STORAGE_KEY_LEVELS = 'global-tiered-pricing-levels'

export function loadPersistedRows(): TieredPricingRow[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROWS)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function persistRows(rows: TieredPricingRow[]): void {
  localStorage.setItem(STORAGE_KEY_ROWS, JSON.stringify(rows))
}

export function loadPersistedGroups(): TierGroup[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GROUPS)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function persistGroups(groups: TierGroup[]): void {
  localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups))
}

export function loadPersistedLevels(): TierLevel[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEVELS)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function persistLevels(levels: TierLevel[]): void {
  localStorage.setItem(STORAGE_KEY_LEVELS, JSON.stringify(levels))
}
