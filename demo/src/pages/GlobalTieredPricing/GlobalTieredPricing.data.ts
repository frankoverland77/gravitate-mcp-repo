/**
 * Global Tiered Pricing Data
 *
 * Sample data for tiered pricing demonstration.
 * Dynamically generated from shared terminal and product data for consistency.
 */

import { generateTieredPricingData, type GeneratedTieredPricingRow } from '../../shared/data'
import type { TierGroup, TierLevel } from './GlobalTieredPricing.types'

// Re-export the type for backward compatibility
export type { GeneratedTieredPricingRow as TieredPricingRow } from '../../shared/data'

// Generate tiered pricing data from shared products and locations
// Creates 30 rows with 5 locations per product
export const tieredPricingData: GeneratedTieredPricingRow[] = generateTieredPricingData(30, 5)

export const defaultTierGroups: TierGroup[] = [
  { id: 'group-a', label: 'Group A', description: 'Primary wholesale accounts', order: 1 },
  { id: 'group-b', label: 'Group B', description: 'Secondary distribution', order: 2 },
  { id: 'group-c', label: 'Group C', description: 'Retail partners', order: 3 },
]

export const defaultTierLevels: TierLevel[] = [
  { id: 'tier-1', label: 'Tier 1', order: 1, isDefault: true },
  { id: 'tier-2', label: 'Tier 2', order: 2, isDefault: true },
  { id: 'tier-3', label: 'Tier 3', order: 3, isDefault: true },
]

/**
 * Get unique locations from the tiered pricing data
 */
export function getTieredPricingLocations(): string[] {
  return [...new Set(tieredPricingData.map((row) => row.location))]
}

/**
 * Get unique products from the tiered pricing data
 */
export function getTieredPricingProducts(): string[] {
  return [...new Set(tieredPricingData.map((row) => row.product))]
}
