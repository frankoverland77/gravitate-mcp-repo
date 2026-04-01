/**
 * Types for Global Tiered Pricing feature
 */

import type { GeneratedTieredPricingRow } from '../../shared/data'

/** Row data type used throughout the grid */
export type TieredPricingRow = GeneratedTieredPricingRow

/** Spread configuration for tier calculations */
export interface SpreadConfig {
  tier2Spread: number
  tier3Spread: number
  autoCalculate: boolean
}

/** Props for the BulkEditModal component */
export interface BulkEditModalProps {
  open: boolean
  selectedCount: number
  onApply: (tier1Value: number) => void
  onCancel: () => void
}

/** Props for the SpreadConfigPanel component */
export interface SpreadConfigPanelProps {
  tier2Spread: number
  tier3Spread: number
  autoCalculate: boolean
  onSpreadChange: (tier: 'tier2' | 'tier3', value: number | null) => void
  onAutoCalculateToggle: (checked: boolean) => void
}