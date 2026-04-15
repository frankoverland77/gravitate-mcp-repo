/**
 * Global Tiered Pricing Data
 *
 * Sample data for tiered pricing demonstration.
 * Dynamically generated from shared terminal and product data for consistency.
 */

import { generateTieredPricingData, type GeneratedTieredPricingRow } from '../../shared/data'
import type { TierGroup, TierLevel, CounterpartyAssignment } from './GlobalTieredPricing.types'

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
  // Group A levels
  { id: 'ga-tier-1', groupId: 'group-a', label: 'Tier 1', order: 1, isDefault: true },
  { id: 'ga-tier-2', groupId: 'group-a', label: 'Tier 2', order: 2, isDefault: true },
  { id: 'ga-tier-3', groupId: 'group-a', label: 'Tier 3', order: 3, isDefault: true },
  // Group B levels (custom names)
  { id: 'gb-platinum', groupId: 'group-b', label: 'Platinum', order: 1, isDefault: true },
  { id: 'gb-gold', groupId: 'group-b', label: 'Gold', order: 2, isDefault: true },
  { id: 'gb-silver', groupId: 'group-b', label: 'Silver', order: 3, isDefault: true },
  // Group C levels (two levels only)
  { id: 'gc-primary', groupId: 'group-c', label: 'Primary', order: 1, isDefault: true },
  { id: 'gc-secondary', groupId: 'group-c', label: 'Secondary', order: 2, isDefault: true },
]

const counterpartyNames = [
  'Acme Fuels', 'Beta Energy', 'Coral Logistics', 'Delta Petroleum', 'Eagle Transport',
  'Falcon Oil', 'Gulf Stream Co', 'Harbor Fuels', 'Iron Bridge Energy', 'Jet Fuel Direct',
  'Keystone Supply', 'Lakeview Energy', 'Metro Fuels', 'Northstar Oil', 'Omega Transport',
]

const levelsByGroup: Record<string, string[]> = {
  'group-a': ['Tier 1', 'Tier 2', 'Tier 3'],
  'group-b': ['Platinum', 'Gold', 'Silver'],
  'group-c': ['Primary', 'Secondary'],
}

/** Mock counterparty assignments — links counterparties to product-locations within groups */
export const counterpartyAssignments: CounterpartyAssignment[] = (() => {
  const assignments: CounterpartyAssignment[] = []
  const uniqueProductLocations = [...new Set(tieredPricingData.map(r => `${r.location}|${r.product}`))]
  const groupIds = ['group-a', 'group-b', 'group-c']

  let nameIdx = 0
  for (const pl of uniqueProductLocations) {
    const [location, product] = pl.split('|')
    // Create assignments across all groups for each product-location
    for (const groupId of groupIds) {
      const levels = levelsByGroup[groupId] ?? []
      const count = 2 + (nameIdx % 2)
      for (let i = 0; i < count; i++) {
        assignments.push({
          counterparty: counterpartyNames[nameIdx % counterpartyNames.length],
          tierLevel: levels[nameIdx % levels.length],
          location,
          product,
          groupId,
        })
        nameIdx++
      }
    }
  }
  return assignments
})()

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
