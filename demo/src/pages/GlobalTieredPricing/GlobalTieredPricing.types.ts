/**
 * Types for Global Tiered Pricing feature
 */

import type { GeneratedTieredPricingRow } from '../../shared/data'

/** Row data type used throughout the grid */
export type TieredPricingRow = GeneratedTieredPricingRow

/** A Tier Group (e.g., Group A, Group B) */
export interface TierGroup {
  id: string
  label: string
  description?: string
  order: number
}

/** A Tier Level belonging to a specific Tier Group (e.g., Group A → Platinum/Gold/Silver) */
export interface TierLevel {
  id: string
  groupId: string
  label: string
  order: number
  isDefault: boolean
}

/** A counterparty assigned to a product-location within a tier group */
export interface CounterpartyAssignment {
  counterparty: string
  tierLevel: string
  location: string
  product: string
  groupId: string
}

/** Spread configuration for tier calculations */
export interface SpreadConfig {
  tier2Spread: number
  tier3Spread: number
  autoCalculate: boolean
}

/** Props for the SpreadConfigPanel component */
export interface SpreadConfigPanelProps {
  tier2Spread: number
  tier3Spread: number
  autoCalculate: boolean
  onSpreadChange: (tier: 'tier2' | 'tier3', value: number | null) => void
  onAutoCalculateToggle: (checked: boolean) => void
}