/**
 * Global Tiered Pricing Data
 *
 * Sample data for tiered pricing demonstration.
 * Dynamically generated from shared terminal and product data for consistency.
 */

import { generateTieredPricingData, type GeneratedTieredPricingRow } from '../../shared/data'

// Re-export the type for backward compatibility
export type { GeneratedTieredPricingRow as TieredPricingRow } from '../../shared/data'

// Generate tiered pricing data from shared products and locations
// Creates 30 rows with 5 locations per product
export const tieredPricingData: TieredPricingRow[] = generateTieredPricingData(30, 5)

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
