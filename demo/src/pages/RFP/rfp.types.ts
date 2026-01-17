/**
 * RFP Management Types
 *
 * Types for the Request for Proposal (RFP) management feature
 * enabling large retail fuel buyers to compare supplier bids.
 */

export type RFPStatus = 'draft' | 'round1' | 'round2' | 'awarded'
export type RFPRound = number // 1, 2, 3, 4... (any positive integer)
export type AllocationLevel = 'flexible' | 'moderate' | 'strict'
export type MetricStatus = 'pass' | 'fail'
export type SortOption = 'recommended' | 'price-low' | 'volume' | 'fewest-issues'
export type DetailMetric = 'price' | 'volume' | 'ratability' | 'allocation' | 'penalties'
export type HistoricalMetric = 'price' | 'volume'

// Screen navigation for RFP tab
// Now supports dynamic round screens: 'round1', 'round2', 'round3', etc.
export type RFPScreen = 'list' | `round${number}` | 'award' | 'success'

/**
 * Main RFP entity - container for procurement process
 */
export interface RFP {
  id: string
  name: string
  market: string
  status: RFPStatus
  currentRound: RFPRound | null
  targetPrice: number | null
  createdAt: string
  supplierCount: number
  winnerName?: string // For awarded RFPs
}

/**
 * Supplier metrics for comparison
 */
export interface SupplierMetrics {
  avgPrice: number
  totalVolume: number // gallons/month
  ratability: number // volume requirement (e.g., 80000 = 80K/mo)
  ratabilityStatus: MetricStatus
  allocation: AllocationLevel
  allocationStatus: MetricStatus
  penalties: number // $/gal
  penaltiesStatus: MetricStatus
  issues: number // count of threshold violations
}

/**
 * Individual supplier bid submission
 */
export interface Supplier {
  id: string
  name: string
  isIncumbent: boolean
  rank: number
  score: number // composite score for ranking
  metrics: SupplierMetrics
  isEliminated?: boolean
  eliminatedInRound?: RFPRound
}

/**
 * Threshold configuration for flagging issues
 */
export interface ThresholdConfig {
  penaltyMax: number // cents/gal
  ratabilityMin: number // percentage
  ratabilityMax: number // percentage
  allocationMin: AllocationLevel
}

/**
 * Parameter configuration for pricing/volume assumptions
 */
export interface ParameterConfig {
  marketIndex: 'cbob-gulf' | 'cbob-atlantic' | 'ulsd-gulf' | 'ulsd-midwest'
  priceAssumption: 'current' | 'forward-curve' | 'flat'
  globalPriceAdjustment: number // percentage
  targetVolume: number // gal/mo
  globalVolumeAdjustment: number // percentage
  comparisonPeriod: 'annual' | 'q1' | 'q2' | 'q3' | 'q4' | 'custom'
}

/**
 * Product/location detail row data
 */
export interface DetailRow {
  id: string
  product: '87 Octane' | '93 Octane' | 'Diesel'
  location: 'Dallas' | 'Beaumont' | 'Houston'
  supplierValues: Record<string, number> // supplierId -> value for current metric
}

/**
 * AI recommendation for supplier
 */
export interface AIRecommendation {
  rank: number
  supplierId: string
  supplierName: string
  price: string
  tags: string[]
}

/**
 * Contract preview for Award screen
 */
export interface ContractPreview {
  name: string
  counterparty: string
  startDate: string
  endDate: string
  pricingFormula: string
  volumeCommitment: string
}

/**
 * Summary stats for RFP list
 */
export interface RFPListStats {
  activeRFPs: number
  inRound2: number
  awardedThisYear: number
  totalSuppliers: number
}

/**
 * Historical bid data for round-over-round comparison chart
 */
export interface RoundBidData {
  supplierId: string
  supplierName: string
  isIncumbent: boolean
  r1Price: number
  r1Volume: number
  r2Price: number | null // null if R2 not yet submitted
  r2Volume: number | null
  priceChange: number | null // calculated delta (negative = improvement)
}

/**
 * Terminal history data point for time-series chart
 */
export interface TerminalHistoryDataPoint {
  date: Date
  dateLabel: string
  volume: number // gallons lifted
  contractPrice: number // what user paid
  rackAverage: number // market benchmark (PRIMARY)
  spotPrice: number // spot market
  rackAvgDiff: number // contract vs rack (contractPrice - rackAverage)
  spotDiff: number // contract vs spot (contractPrice - spotPrice)
}

/**
 * Terminal history data for time-series comparison chart
 */
export interface TerminalHistoryData {
  terminalId: string
  terminalName: string
  period: string // e.g., "Last 12 Months"
  data: TerminalHistoryDataPoint[]
  // Current RFP context for overlay
  rfpProposedVolume: number // gallons/month
  rfpProposedPrice: number // $/gal
  avgHistoricalPrice: number // calculated average for reference line
}

// Time period options for terminal history chart
export type TerminalHistoryPeriod = '6mo' | '12mo' | '18mo' | '24mo'

export const TERMINAL_HISTORY_PERIOD_OPTIONS: Array<{ value: TerminalHistoryPeriod; label: string }> = [
  { value: '6mo', label: '6 Months' },
  { value: '12mo', label: '12 Months' },
  { value: '18mo', label: '18 Months' },
  { value: '24mo', label: '24 Months' },
]

// Default threshold configuration
export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  penaltyMax: 2, // 2 cents/gal
  ratabilityMin: 90,
  ratabilityMax: 110,
  allocationMin: 'flexible',
}

// Default parameter configuration
export const DEFAULT_PARAMETERS: ParameterConfig = {
  marketIndex: 'cbob-gulf',
  priceAssumption: 'forward-curve',
  globalPriceAdjustment: 0,
  targetVolume: 2400000,
  globalVolumeAdjustment: 0,
  comparisonPeriod: 'annual',
}

// Sort option labels
export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'recommended', label: 'Gravitate Recommended' },
  { value: 'price-low', label: 'Price (Low to High)' },
  { value: 'volume', label: 'Volume Capacity' },
  { value: 'fewest-issues', label: 'Fewest Issues' },
]

// Product options for filtering
export const PRODUCT_OPTIONS = ['87 Octane', '93 Octane', 'Diesel'] as const

// Location options for filtering
export const LOCATION_OPTIONS = ['Dallas', 'Beaumont', 'Houston'] as const

// Market index options
export const MARKET_INDEX_OPTIONS = [
  { value: 'cbob-gulf', label: 'CBOB Gulf Coast' },
  { value: 'cbob-atlantic', label: 'CBOB Atlantic' },
  { value: 'ulsd-gulf', label: 'ULSD Gulf Coast' },
  { value: 'ulsd-midwest', label: 'ULSD Midwest' },
]

// Price assumption options
export const PRICE_ASSUMPTION_OPTIONS = [
  { value: 'current', label: 'Current Market' },
  { value: 'forward-curve', label: 'Forward Curve' },
  { value: 'flat', label: "Flat (Today's Price)" },
]

// Comparison period options
export const COMPARISON_PERIOD_OPTIONS = [
  { value: 'annual', label: 'Annual' },
  { value: 'q1', label: 'Q1' },
  { value: 'q2', label: 'Q2' },
  { value: 'q3', label: 'Q3' },
  { value: 'q4', label: 'Q4' },
  { value: 'custom', label: 'Custom Range' },
]

// Allocation level options
export const ALLOCATION_OPTIONS: Array<{ value: AllocationLevel; label: string }> = [
  { value: 'flexible', label: 'Flexible only' },
  { value: 'moderate', label: 'Moderate OK' },
  { value: 'strict', label: 'Any' },
]

// Helper to generate RFP ID
export function generateRFPId(): string {
  return `rfp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper to generate Supplier ID
export function generateSupplierId(): string {
  return `supplier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Eliminated supplier tracking per round
 */
export interface EliminatedSupplierInfo {
  supplierId: string
  supplierName: string
  eliminatedInRound: number
  priceAtElimination: number
}
