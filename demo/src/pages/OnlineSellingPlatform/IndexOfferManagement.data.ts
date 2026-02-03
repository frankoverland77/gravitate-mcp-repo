/**
 * Index Offer Management Data
 *
 * Market context data for the Online Selling Platform.
 * Dynamically generated from shared terminal and product data for consistency.
 */

import {
  generateMarketContextData as generateSharedMarketContextData,
  type GeneratedMarketContextData,
} from '../../shared/data'

// Re-export the interface for backward compatibility
export interface MarketContextData extends GeneratedMarketContextData {}

/**
 * Generate market context data for each offer
 * Dynamically creates data from shared products and locations
 */
export function generateMarketContextData(): MarketContextData[] {
  return generateSharedMarketContextData(15)
}

/**
 * Helper function to get market context for a specific offer
 */
export function getMarketContextForOffer(offerId: number): MarketContextData | undefined {
  const allMarketData = generateMarketContextData()
  return allMarketData.find((data) => data.offerId === offerId)
}

/**
 * Helper function to determine rank color
 */
export function getRankColor(rank: number): string {
  if (rank <= 3) return '#52c41a' // Green - top tier
  if (rank <= 7) return '#1890ff' // Blue - mid tier
  return '#fa8c16' // Orange - needs improvement
}

/**
 * Helper function to determine rank description
 */
export function getRankDescription(rank: number, total: number): string {
  if (rank === 1) return 'Most Competitive'
  if (rank === total) return 'Least Competitive'
  if (rank <= 3) return 'Highly Competitive'
  if (rank <= 7) return 'Moderately Competitive'
  return 'Below Average'
}
