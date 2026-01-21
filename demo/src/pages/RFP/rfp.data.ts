/**
 * RFP Mock Data
 *
 * Sample data for RFP Management feature demonstration
 */

import type {
  RFP,
  Supplier,
  DetailRow,
  AIRecommendation,
  ContractPreview,
  RFPListStats,
  RoundBidData,
  TerminalHistoryData,
  TerminalHistoryDataPoint,
  TerminalHistoryPeriod,
  ProductGroupMetrics,
} from './rfp.types'

// 4 Sample RFPs per spec
export const SAMPLE_RFPS: RFP[] = [
  {
    id: 'rfp-dallas-2026',
    name: 'Dallas Terminal Market - 2026 Supply',
    market: 'Dallas',
    status: 'round1',
    currentRound: 1,
    targetPrice: 2.32,
    createdAt: '2025-10-15',
    supplierCount: 8,
  },
  {
    id: 'rfp-houston-2026',
    name: 'Houston Metro Region',
    market: 'Houston',
    status: 'round2',
    currentRound: 2,
    targetPrice: 2.28,
    createdAt: '2025-09-01',
    supplierCount: 3,
  },
  {
    id: 'rfp-phoenix-2026',
    name: 'Phoenix / Tucson',
    market: 'Phoenix',
    status: 'draft',
    currentRound: null,
    targetPrice: null,
    createdAt: '2025-11-01',
    supplierCount: 0,
  },
  {
    id: 'rfp-atlanta-2026',
    name: 'Atlanta Metro',
    market: 'Atlanta',
    status: 'awarded',
    currentRound: null,
    targetPrice: 2.3,
    createdAt: '2025-06-01',
    supplierCount: 1,
    winnerName: 'Marathon',
  },
]

// 8 Suppliers for Round 1 (per spec)
export const SAMPLE_SUPPLIERS: Supplier[] = [
  {
    id: 'supplier-marathon',
    name: 'Marathon',
    isIncumbent: true,
    rank: 2,
    score: 92,
    metrics: {
      avgPrice: 2.34,
      totalVolume: 2400000,
      ratability: 80000,
      ratabilityStatus: 'pass',
      allocation: 'flexible',
      allocationPeriod: 'daily',
      allocationStatus: 'pass',
      penalties: 0.02,
      penaltiesStatus: 'pass',
      issues: 0,
    },
  },
  {
    id: 'supplier-p66',
    name: 'P66',
    isIncumbent: false,
    rank: 1,
    score: 95,
    metrics: {
      avgPrice: 2.31,
      totalVolume: 2100000,
      ratability: 75000,
      ratabilityStatus: 'pass',
      allocation: 'strict',
      allocationPeriod: 'quarterly',
      allocationStatus: 'fail',
      penalties: 0.03,
      penaltiesStatus: 'pass',
      issues: 1,
    },
  },
  {
    id: 'supplier-shell',
    name: 'Shell',
    isIncumbent: false,
    rank: 3,
    score: 90,
    metrics: {
      avgPrice: 2.32,
      totalVolume: 2600000,
      ratability: 85000,
      ratabilityStatus: 'pass',
      allocation: 'flexible',
      allocationPeriod: 'weekly',
      allocationStatus: 'pass',
      penalties: 0.02,
      penaltiesStatus: 'pass',
      issues: 0,
    },
  },
  {
    id: 'supplier-valero',
    name: 'Valero',
    bidName: 'Best Price Option',
    bidCode: 'A',
    isIncumbent: false,
    rank: 4,
    score: 78,
    metrics: {
      avgPrice: 2.35,
      totalVolume: 2200000,
      ratability: 90000,
      ratabilityStatus: 'fail',
      allocation: 'moderate',
      allocationPeriod: 'monthly',
      allocationStatus: 'pass',
      penalties: 0.04,
      penaltiesStatus: 'fail',
      issues: 2,
    },
  },
  {
    id: 'supplier-valero-2',
    name: 'Valero',
    bidName: 'Volume Tier 1',
    bidCode: 'B',
    isIncumbent: false,
    rank: 9,
    score: 71,
    metrics: {
      avgPrice: 2.38,
      totalVolume: 2800000,
      ratability: 100000,
      ratabilityStatus: 'fail',
      allocation: 'flexible',
      allocationPeriod: 'weekly',
      allocationStatus: 'pass',
      penalties: 0.03,
      penaltiesStatus: 'pass',
      issues: 1,
    },
  },
  {
    id: 'supplier-fhr',
    name: 'FHR',
    isIncumbent: false,
    rank: 5,
    score: 85,
    metrics: {
      avgPrice: 2.33,
      totalVolume: 2000000,
      ratability: 70000,
      ratabilityStatus: 'pass',
      allocation: 'flexible',
      allocationPeriod: 'daily',
      allocationStatus: 'pass',
      penalties: 0.03,
      penaltiesStatus: 'pass',
      issues: 0,
    },
  },
  {
    id: 'supplier-hf-sinclair',
    name: 'HF Sinclair',
    isIncumbent: false,
    rank: 6,
    score: 72,
    metrics: {
      avgPrice: 2.36,
      totalVolume: 2300000,
      ratability: 85000,
      ratabilityStatus: 'pass',
      allocation: 'strict',
      allocationPeriod: 'quarterly',
      allocationStatus: 'fail',
      penalties: 0.05,
      penaltiesStatus: 'fail',
      issues: 2,
    },
  },
  {
    id: 'supplier-bp',
    name: 'BP',
    isIncumbent: false,
    rank: 7,
    score: 82,
    metrics: {
      avgPrice: 2.34,
      totalVolume: 2100000,
      ratability: 80000,
      ratabilityStatus: 'pass',
      allocation: 'moderate',
      allocationPeriod: 'tri-weekly',
      allocationStatus: 'pass',
      penalties: 0.02,
      penaltiesStatus: 'pass',
      issues: 0,
    },
  },
  {
    id: 'supplier-cenex',
    name: 'Cenex',
    isIncumbent: false,
    rank: 8,
    score: 68,
    metrics: {
      avgPrice: 2.37,
      totalVolume: 1900000,
      ratability: 75000,
      ratabilityStatus: 'pass',
      allocation: 'flexible',
      allocationPeriod: 'weekly',
      allocationStatus: 'pass',
      penalties: 0.04,
      penaltiesStatus: 'fail',
      issues: 1,
    },
  },
]

// Round 2 finalists (subset of suppliers)
export const ROUND2_FINALISTS = SAMPLE_SUPPLIERS.filter((s) =>
  ['supplier-marathon', 'supplier-p66', 'supplier-shell'].includes(s.id)
)

// Detail grid data - 9 rows (3 products x 3 locations)
export const SAMPLE_DETAILS: DetailRow[] = [
  {
    id: 'detail-87-dallas',
    product: '87 Octane',
    location: 'Dallas',
    supplierValues: {
      'supplier-marathon': 2.32,
      'supplier-p66': 2.29,
      'supplier-shell': 2.3,
      'supplier-valero': 2.33,
      'supplier-valero-2': 2.36,
      'supplier-fhr': 2.31,
      'supplier-hf-sinclair': 2.34,
      'supplier-bp': 2.32,
      'supplier-cenex': 2.35,
    },
  },
  {
    id: 'detail-87-beaumont',
    product: '87 Octane',
    location: 'Beaumont',
    supplierValues: {
      'supplier-marathon': 2.34,
      'supplier-p66': 2.31,
      'supplier-shell': 2.32,
      'supplier-valero': 2.35,
      'supplier-valero-2': 2.38,
      'supplier-fhr': 2.33,
      'supplier-hf-sinclair': 2.36,
      'supplier-bp': 2.34,
      'supplier-cenex': 2.37,
    },
  },
  {
    id: 'detail-87-houston',
    product: '87 Octane',
    location: 'Houston',
    supplierValues: {
      'supplier-marathon': 2.33,
      'supplier-p66': 2.3,
      'supplier-shell': 2.31,
      'supplier-valero': 2.34,
      'supplier-valero-2': 2.37,
      'supplier-fhr': 2.32,
      'supplier-hf-sinclair': 2.35,
      'supplier-bp': 2.33,
      'supplier-cenex': 2.36,
    },
  },
  {
    id: 'detail-93-dallas',
    product: '93 Octane',
    location: 'Dallas',
    supplierValues: {
      'supplier-marathon': 2.42,
      'supplier-p66': 2.39,
      'supplier-shell': 2.4,
      'supplier-valero': 2.43,
      'supplier-valero-2': 2.46,
      'supplier-fhr': 2.41,
      'supplier-hf-sinclair': 2.44,
      'supplier-bp': 2.42,
      'supplier-cenex': 2.45,
    },
  },
  {
    id: 'detail-93-beaumont',
    product: '93 Octane',
    location: 'Beaumont',
    supplierValues: {
      'supplier-marathon': 2.44,
      'supplier-p66': 2.41,
      'supplier-shell': 2.42,
      'supplier-valero': 2.45,
      'supplier-valero-2': 2.48,
      'supplier-fhr': 2.43,
      'supplier-hf-sinclair': 2.46,
      'supplier-bp': 2.44,
      'supplier-cenex': 2.47,
    },
  },
  {
    id: 'detail-93-houston',
    product: '93 Octane',
    location: 'Houston',
    supplierValues: {
      'supplier-marathon': 2.43,
      'supplier-p66': 2.4,
      'supplier-shell': 2.41,
      'supplier-valero': 2.44,
      'supplier-valero-2': 2.47,
      'supplier-fhr': 2.42,
      'supplier-hf-sinclair': 2.45,
      'supplier-bp': 2.43,
      'supplier-cenex': 2.46,
    },
  },
  {
    id: 'detail-diesel-dallas',
    product: 'Diesel',
    location: 'Dallas',
    supplierValues: {
      'supplier-marathon': 2.28,
      'supplier-p66': 2.25,
      'supplier-shell': 2.26,
      'supplier-valero': 2.29,
      'supplier-valero-2': 2.32,
      'supplier-fhr': 2.27,
      'supplier-hf-sinclair': 2.3,
      'supplier-bp': 2.28,
      'supplier-cenex': 2.31,
    },
  },
  {
    id: 'detail-diesel-beaumont',
    product: 'Diesel',
    location: 'Beaumont',
    supplierValues: {
      'supplier-marathon': 2.3,
      'supplier-p66': 2.27,
      'supplier-shell': 2.28,
      'supplier-valero': 2.31,
      'supplier-valero-2': 2.34,
      'supplier-fhr': 2.29,
      'supplier-hf-sinclair': 2.32,
      'supplier-bp': 2.3,
      'supplier-cenex': 2.33,
    },
  },
  {
    id: 'detail-diesel-houston',
    product: 'Diesel',
    location: 'Houston',
    supplierValues: {
      'supplier-marathon': 2.29,
      'supplier-p66': 2.26,
      'supplier-shell': 2.27,
      'supplier-valero': 2.3,
      'supplier-valero-2': 2.33,
      'supplier-fhr': 2.28,
      'supplier-hf-sinclair': 2.31,
      'supplier-bp': 2.29,
      'supplier-cenex': 2.32,
    },
  },
]

// AI Recommendations for Round 1
export const AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    rank: 1,
    supplierId: 'supplier-p66',
    supplierName: 'P66',
    price: '$2.31 avg',
    tags: ['Cheapest'],
  },
  {
    rank: 2,
    supplierId: 'supplier-marathon',
    supplierName: 'Marathon',
    price: '$2.34 avg',
    tags: ['Incumbent', 'Best Overall'],
  },
  {
    rank: 3,
    supplierId: 'supplier-shell',
    supplierName: 'Shell',
    price: '$2.32 avg',
    tags: ['Strong Alternative'],
  },
]

// AI insight text
export const AI_INSIGHT_TEXT =
  'P66 offers the lowest price. Marathon remains competitive as incumbent with lowest penalties. Shell provides best volume flexibility.'

// Sample contract preview for Award screen
export const SAMPLE_CONTRACT_PREVIEW: ContractPreview = {
  name: 'Marathon - Dallas 2026',
  counterparty: 'Marathon Petroleum Supply',
  startDate: 'January 1, 2026',
  endDate: 'December 31, 2026',
  pricingFormula: 'OPIS Low - $0.02',
  volumeCommitment: '2.4M gal/month',
}

// Stats for RFP list page
export const RFP_LIST_STATS: RFPListStats = {
  activeRFPs: 3,
  inRound2: 1,
  awardedThisYear: 7,
  totalSuppliers: 24,
}

// Historical bid data for round-over-round comparison chart
// All 8 suppliers have R1 bids, only 3 finalists (Marathon, P66, Shell) have R2 bids
export const HISTORICAL_BID_DATA: RoundBidData[] = [
  {
    supplierId: 'supplier-marathon',
    supplierName: 'Marathon',
    isIncumbent: true,
    r1Price: 2.36,
    r1Volume: 2400000,
    r2Price: 2.34,
    r2Volume: 2400000,
    priceChange: -0.02,
  },
  {
    supplierId: 'supplier-p66',
    supplierName: 'P66',
    isIncumbent: false,
    r1Price: 2.34,
    r1Volume: 2100000,
    r2Price: 2.31,
    r2Volume: 2100000,
    priceChange: -0.03,
  },
  {
    supplierId: 'supplier-shell',
    supplierName: 'Shell',
    isIncumbent: false,
    r1Price: 2.33,
    r1Volume: 2600000,
    r2Price: 2.32,
    r2Volume: 2600000,
    priceChange: -0.01,
  },
  {
    supplierId: 'supplier-valero',
    supplierName: 'Valero (Best Price)',
    isIncumbent: false,
    r1Price: 2.35,
    r1Volume: 2200000,
    r2Price: null,
    r2Volume: null,
    priceChange: null,
  },
  {
    supplierId: 'supplier-valero-2',
    supplierName: 'Valero (Volume Tier 1)',
    isIncumbent: false,
    r1Price: 2.38,
    r1Volume: 2800000,
    r2Price: null,
    r2Volume: null,
    priceChange: null,
  },
  {
    supplierId: 'supplier-fhr',
    supplierName: 'FHR',
    isIncumbent: false,
    r1Price: 2.33,
    r1Volume: 2000000,
    r2Price: null,
    r2Volume: null,
    priceChange: null,
  },
  {
    supplierId: 'supplier-hf-sinclair',
    supplierName: 'HF Sinclair',
    isIncumbent: false,
    r1Price: 2.36,
    r1Volume: 2300000,
    r2Price: null,
    r2Volume: null,
    priceChange: null,
  },
  {
    supplierId: 'supplier-bp',
    supplierName: 'BP',
    isIncumbent: false,
    r1Price: 2.34,
    r1Volume: 2100000,
    r2Price: null,
    r2Volume: null,
    priceChange: null,
  },
  {
    supplierId: 'supplier-cenex',
    supplierName: 'Cenex',
    isIncumbent: false,
    r1Price: 2.37,
    r1Volume: 1900000,
    r2Price: null,
    r2Volume: null,
    priceChange: null,
  },
]

// Helper function to get RFP by ID
export function getRFPById(id: string): RFP | undefined {
  return SAMPLE_RFPS.find((rfp) => rfp.id === id)
}

// Helper function to get supplier by ID
export function getSupplierById(id: string): Supplier | undefined {
  return SAMPLE_SUPPLIERS.find((s) => s.id === id)
}

// Helper function to get suppliers for a round
export function getSuppliersForRound(round: 1 | 2): Supplier[] {
  if (round === 1) {
    return SAMPLE_SUPPLIERS
  }
  return ROUND2_FINALISTS
}

// Helper to format volume
export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M gal/mo`
  }
  return `${(volume / 1000).toFixed(0)}K gal/mo`
}

// Helper to format price
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

// Helper to format penalties
export function formatPenalties(penalties: number): string {
  const cents = Math.round(penalties * 100)
  return `$0.0${cents}/g`
}

// Helper to format ratability
export function formatRatability(ratability: number): string {
  return `${(ratability / 1000).toFixed(0)}K/mo`
}

// Sort suppliers by sort option
export function sortSuppliers(
  suppliers: Supplier[],
  sortOption: 'recommended' | 'price-low' | 'volume' | 'fewest-issues'
): Supplier[] {
  const sorted = [...suppliers]

  // Incumbent always stays first
  const incumbent = sorted.find((s) => s.isIncumbent)
  const others = sorted.filter((s) => !s.isIncumbent)

  switch (sortOption) {
    case 'recommended':
      others.sort((a, b) => b.score - a.score)
      break
    case 'price-low':
      others.sort((a, b) => a.metrics.avgPrice - b.metrics.avgPrice)
      break
    case 'volume':
      others.sort((a, b) => b.metrics.totalVolume - a.metrics.totalVolume)
      break
    case 'fewest-issues':
      others.sort((a, b) => a.metrics.issues - b.metrics.issues)
      break
  }

  // Return incumbent first, then sorted others
  return incumbent ? [incumbent, ...others] : others
}

// ============================================================================
// TERMINAL HISTORY DATA (for time-series chart)
// ============================================================================

/**
 * Generate terminal history mock data
 * Creates daily data points with realistic price/volume patterns
 */
function generateTerminalHistoryData(months: number): TerminalHistoryDataPoint[] {
  const data: TerminalHistoryDataPoint[] = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setMonth(startDate.getMonth() - months)

  // Base prices (will vary seasonally and with noise)
  const baseRackAverage = 2.31
  const baseContractPrice = 2.28 // Usually slightly below rack (good contract)
  const baseSpotPrice = 2.35 // Usually higher than rack

  // Base volume per day (varies by day of week and season)
  const baseVolume = 25000 // gallons per day average

  // Generate daily data
  const currentDate = new Date(startDate)
  while (currentDate <= today) {
    // Calculate seasonal factor (higher demand in summer/winter)
    const month = currentDate.getMonth()
    const seasonalFactor =
      month >= 5 && month <= 8
        ? 1.15 // Summer peak
        : month >= 11 || month <= 1
          ? 1.1 // Winter peak
          : 0.95 // Spring/Fall dip

    // Day of week factor (lower on weekends)
    const dayOfWeek = currentDate.getDay()
    const dayFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1.0

    // Add some random variation
    const priceNoise = (Math.random() - 0.5) * 0.08 // ±4 cents
    const volumeNoise = (Math.random() - 0.5) * 0.4 // ±20%

    // Calculate trend (slight upward over time)
    const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const trendFactor = daysSinceStart * 0.00005 // Very gradual increase

    // Calculate values
    const rackAverage = Number((baseRackAverage + priceNoise + trendFactor).toFixed(4))
    const contractPrice = Number((baseContractPrice + priceNoise * 0.8 + trendFactor).toFixed(4))
    const spotPrice = Number((baseSpotPrice + priceNoise * 1.2 + trendFactor).toFixed(4))
    const volume = Math.round(baseVolume * seasonalFactor * dayFactor * (1 + volumeNoise))

    data.push({
      date: new Date(currentDate),
      dateLabel: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      volume,
      contractPrice,
      rackAverage,
      spotPrice,
      rackAvgDiff: Number((contractPrice - rackAverage).toFixed(4)),
      spotDiff: Number((contractPrice - spotPrice).toFixed(4)),
    })

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

/**
 * Aggregate daily data to weekly for better visualization
 */
function aggregateToWeekly(dailyData: TerminalHistoryDataPoint[]): TerminalHistoryDataPoint[] {
  const weeks: TerminalHistoryDataPoint[] = []
  let weekData: TerminalHistoryDataPoint[] = []

  dailyData.forEach((point, index) => {
    weekData.push(point)

    // Every 7 days or at the end, aggregate
    if (weekData.length === 7 || index === dailyData.length - 1) {
      const avgContractPrice = weekData.reduce((sum, d) => sum + d.contractPrice, 0) / weekData.length
      const avgRackAverage = weekData.reduce((sum, d) => sum + d.rackAverage, 0) / weekData.length
      const avgSpotPrice = weekData.reduce((sum, d) => sum + d.spotPrice, 0) / weekData.length
      const totalVolume = weekData.reduce((sum, d) => sum + d.volume, 0)

      weeks.push({
        date: weekData[0].date,
        dateLabel: weekData[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: totalVolume,
        contractPrice: Number(avgContractPrice.toFixed(4)),
        rackAverage: Number(avgRackAverage.toFixed(4)),
        spotPrice: Number(avgSpotPrice.toFixed(4)),
        rackAvgDiff: Number((avgContractPrice - avgRackAverage).toFixed(4)),
        spotDiff: Number((avgContractPrice - avgSpotPrice).toFixed(4)),
      })

      weekData = []
    }
  })

  return weeks
}

// Pre-generate data for all periods (24 months max)
const fullDailyData = generateTerminalHistoryData(24)
const fullWeeklyData = aggregateToWeekly(fullDailyData)

/**
 * Get terminal history data for a specific time period
 */
export function getTerminalHistoryByPeriod(period: TerminalHistoryPeriod): TerminalHistoryData {
  const monthsMap: Record<TerminalHistoryPeriod, number> = {
    '6mo': 6,
    '12mo': 12,
    '18mo': 18,
    '24mo': 24,
  }

  const months = monthsMap[period]
  const weeksToInclude = Math.ceil((months * 30) / 7)

  // Get the most recent weeks based on period
  const periodData = fullWeeklyData.slice(-weeksToInclude)

  // Calculate period-specific average
  const periodAvgPrice = Number((periodData.reduce((sum, d) => sum + d.contractPrice, 0) / periodData.length).toFixed(2))

  return {
    terminalId: 'terminal-dallas',
    terminalName: 'Dallas Terminal',
    period: `Last ${months} Months`,
    data: periodData,
    rfpProposedVolume: 2400000, // 2.4M gal/month (from RFP)
    rfpProposedPrice: 2.28, // From RFP target price
    avgHistoricalPrice: periodAvgPrice,
  }
}

// Default terminal history data (12 months)
export const TERMINAL_HISTORY_DATA: TerminalHistoryData = getTerminalHistoryByPeriod('12mo')

/**
 * Per-product average prices (each product averaged across all locations)
 */
export interface PerProductAverages {
  [productName: string]: {
    [supplierId: string]: number
  }
}

/**
 * Calculate average prices per individual product per supplier
 *
 * Returns the average price for each specific product (across all locations) per supplier.
 * Products: 87 Octane, 93 Octane, Diesel
 *
 * @param details - DetailRow array with supplier values
 * @param supplierIds - Array of supplier IDs to calculate for
 * @returns PerProductAverages with per-product averages per supplier
 */
export function calculatePerProductAverages(details: DetailRow[], supplierIds: string[]): PerProductAverages {
  // Get unique products from details
  const products = Array.from(new Set(details.map((d) => d.product)))

  const result: PerProductAverages = {}

  products.forEach((product) => {
    result[product] = {}
    const productRows = details.filter((d) => d.product === product)

    supplierIds.forEach((supplierId) => {
      const values = productRows.map((row) => row.supplierValues[supplierId]).filter((v) => v !== undefined)

      if (values.length > 0) {
        result[product][supplierId] = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
      }
    })
  })

  return result
}

/**
 * Calculate volume breakdown by product for each supplier
 * Distributes total volume proportionally: 87 Octane (45%), 93 Octane (25%), Diesel (30%)
 *
 * @param suppliers - Array of Supplier objects
 * @returns PerProductAverages with volumes per product per supplier
 */
export function calculatePerProductVolumes(suppliers: Supplier[]): PerProductAverages {
  const result: PerProductAverages = {}

  // Product distribution ratios (should sum to 1)
  const productDistribution: Record<string, number> = {
    '87 Octane': 0.45,
    '93 Octane': 0.25,
    Diesel: 0.30,
  }

  // Initialize products
  Object.keys(productDistribution).forEach((product) => {
    result[product] = {}
  })

  // Calculate volume per product for each supplier
  suppliers.forEach((supplier) => {
    const totalVolume = supplier.metrics.totalVolume
    Object.entries(productDistribution).forEach(([product, ratio]) => {
      result[product][supplier.id] = Math.round(totalVolume * ratio)
    })
  })

  return result
}

/**
 * Calculate average prices by product group (gasoline vs diesel) per supplier
 *
 * Product groups:
 * - Gasoline: 87 Octane + 93 Octane (averaged across all locations)
 * - Diesel: Diesel (averaged across all locations)
 *
 * @param details - DetailRow array with supplier values
 * @param supplierIds - Array of supplier IDs to calculate for
 * @returns ProductGroupMetrics with gasoline and diesel averages per supplier
 */
export function calculateProductGroupAverages(details: DetailRow[], supplierIds: string[]): ProductGroupMetrics {
  const result: ProductGroupMetrics = {
    gasoline: {},
    diesel: {},
  }

  // Group details by product type
  const gasolineRows = details.filter((d) => d.product === '87 Octane' || d.product === '93 Octane')
  const dieselRows = details.filter((d) => d.product === 'Diesel')

  // Calculate average for each supplier
  supplierIds.forEach((supplierId) => {
    // Gasoline average (all 87 + 93 octane rows across locations)
    const gasolineValues = gasolineRows.map((row) => row.supplierValues[supplierId]).filter((v) => v !== undefined)
    if (gasolineValues.length > 0) {
      result.gasoline[supplierId] = Number((gasolineValues.reduce((a, b) => a + b, 0) / gasolineValues.length).toFixed(2))
    }

    // Diesel average (all diesel rows across locations)
    const dieselValues = dieselRows.map((row) => row.supplierValues[supplierId]).filter((v) => v !== undefined)
    if (dieselValues.length > 0) {
      result.diesel[supplierId] = Number((dieselValues.reduce((a, b) => a + b, 0) / dieselValues.length).toFixed(2))
    }
  })

  return result
}
