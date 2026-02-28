/**
 * Data Generators
 *
 * Utility functions to dynamically generate sample/demo data
 * from shared products, locations, and counterparties.
 *
 * These generators ensure demo pages use consistent data from the
 * shared data layer rather than hardcoded arrays.
 */

import { PRODUCTS, getProductsByGroup } from './products.data'
import { LOCATIONS, getTerminalLocations } from './locations.data'
import { getSuppliers } from './counterparties.data'
import type { Product } from '../types/product.types'
import type { Location } from '../types/location.types'

// ============================================================================
// PRICE GENERATION
// ============================================================================

/**
 * Base prices by product group (USD per gallon)
 */
const BASE_PRICES: Record<string, number> = {
  gasoline: 2.30,
  diesel: 2.45,
  biodiesel: 2.40,
}

/**
 * Generate a realistic price with variation
 * @param group - Product group for base price
 * @param variation - Max +/- variation (default 0.15)
 */
export function generatePrice(group: string, variation = 0.15): number {
  const base = BASE_PRICES[group] || 2.5
  const delta = (Math.random() - 0.5) * 2 * variation
  return Number((base + delta).toFixed(2))
}

/**
 * Generate a seeded price (deterministic based on product+location IDs)
 * Ensures same product/location combo always gets same price
 */
export function generateSeededPrice(productId: number, locationId: number, group: string): number {
  const seed = (productId * 1000 + locationId) % 100
  const base = BASE_PRICES[group] || 2.38
  const delta = ((seed - 50) / 50) * 0.25 // -0.25 to +0.25 based on seed
  // Clamp to 2.01 – 2.75 range
  return Number(Math.min(2.75, Math.max(2.01, base + delta)).toFixed(4))
}

// ============================================================================
// TIERED PRICING GENERATORS
// ============================================================================

export interface GeneratedTieredPricingRow {
  id: number
  location: string
  product: string
  tier1: number
  tier2: number | null
  tier3: number | null
  tier2Override: boolean
  tier3Override: boolean
}

/**
 * Generate tiered pricing data from shared products and locations
 * @param maxRows - Maximum rows to generate (default 50)
 * @param locationsPerProduct - How many locations per product (default 5)
 */
export function generateTieredPricingData(maxRows = 50, locationsPerProduct = 5): GeneratedTieredPricingRow[] {
  const terminals = getTerminalLocations().slice(0, 20) // Use first 20 terminals
  const products = [...getProductsByGroup('gasoline').slice(0, 4), ...getProductsByGroup('diesel').slice(0, 3)]

  const rows: GeneratedTieredPricingRow[] = []
  let id = 1

  // Use seeded randomness for consistent results
  const seededShuffle = <T>(arr: T[], seed: number): T[] => {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(((seed * (i + 1)) % 100) / 100 * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  for (const product of products) {
    // Pick terminals for this product using seeded shuffle
    const shuffledTerminals = seededShuffle(terminals, product.ProductId)
    const selectedTerminals = shuffledTerminals.slice(0, locationsPerProduct)

    for (const terminal of selectedTerminals) {
      if (rows.length >= maxRows) break

      rows.push({
        id: id++,
        location: terminal.Name,
        product: product.Name,
        tier1: generateSeededPrice(product.ProductId, terminal.LocationId, product.ProductGroup),
        tier2: null,
        tier3: null,
        tier2Override: false,
        tier3Override: false,
      })
    }
    if (rows.length >= maxRows) break
  }

  return rows
}

// ============================================================================
// RFP DETAIL GENERATORS
// ============================================================================

export interface GeneratedDetailRow {
  id: string
  product: string
  location: string
  supplierValues: Record<string, number>
}

/**
 * Generate RFP detail rows from shared data
 * Creates product × location combinations with supplier prices
 */
export function generateRFPDetails(
  productNames: string[],
  locationNames: string[],
  supplierIds: string[]
): GeneratedDetailRow[] {
  const rows: GeneratedDetailRow[] = []

  for (const product of productNames) {
    const productData = PRODUCTS.find((p) => p.Name === product || p.Abbreviation === product)
    const group = productData?.ProductGroup || 'gasoline'

    for (const location of locationNames) {
      const locationData = LOCATIONS.find((l) => l.Name === location || l.Abbreviation === location)

      const supplierValues: Record<string, number> = {}
      const basePrice = generateSeededPrice(productData?.ProductId || 1, locationData?.LocationId || 1, group)

      // Generate prices for each supplier with slight variations
      supplierIds.forEach((supplierId, index) => {
        const variation = ((index - supplierIds.length / 2) / supplierIds.length) * 0.08
        supplierValues[supplierId] = Number((basePrice + variation).toFixed(2))
      })

      rows.push({
        id: `detail-${product.toLowerCase().replace(/\s+/g, '-')}-${location.toLowerCase().replace(/\s+/g, '-')}`,
        product,
        location,
        supplierValues,
      })
    }
  }

  return rows
}

// ============================================================================
// ONLINE SELLING PLATFORM GENERATORS
// ============================================================================

export interface GeneratedMarketContextData {
  offerId: number
  terminal: string
  product: string
  opusContractLow: number
  opusContract2ndLow: number
  opusContractAvg: number
  opusRackPrice: number
  myRackPrice: number
  rackPriceDelta: number
  argusPrice: number | null
  plattsPrice: number | null
  spotContractPrice: number | null
  brandedPercentage: number
  unbrandedPercentage: number
  volumeMTD: number
  volumeGoal: number
  volumePacingPercent: number
  marketRank: number
  totalCompetitors: number
}

/**
 * Generate market context data for Online Selling Platform
 * @param count - Number of market context entries to generate (default 15)
 */
export function generateMarketContextData(count = 15): GeneratedMarketContextData[] {
  const terminals = getTerminalLocations().slice(0, Math.ceil(count / 3))
  const products = [...getProductsByGroup('gasoline').slice(0, 3), ...getProductsByGroup('diesel').slice(0, 2)]

  const data: GeneratedMarketContextData[] = []
  let offerId = 1

  for (const terminal of terminals) {
    for (const product of products) {
      if (data.length >= count) break

      const basePrice = generateSeededPrice(product.ProductId, terminal.LocationId, product.ProductGroup)
      const opusLow = Number((basePrice - 0.05).toFixed(2))
      const opus2ndLow = Number((basePrice - 0.02).toFixed(2))
      const opusAvg = Number((basePrice + 0.03).toFixed(2))
      const rackPrice = Number(basePrice.toFixed(2))
      const myPrice = Number((basePrice - 0.02 + ((product.ProductId * terminal.LocationId) % 10) * 0.004).toFixed(2))

      const volumeGoal = 50000 + ((product.ProductId * terminal.LocationId * 1234) % 100000)
      const volumeMTD = Math.floor(volumeGoal * (0.3 + ((terminal.LocationId * product.ProductId) % 70) / 100))

      const brandedPct = 45 + ((product.ProductId + terminal.LocationId) % 35)

      data.push({
        offerId: offerId++,
        terminal: terminal.Name,
        product: product.Name,
        opusContractLow: opusLow,
        opusContract2ndLow: opus2ndLow,
        opusContractAvg: opusAvg,
        opusRackPrice: rackPrice,
        myRackPrice: myPrice,
        rackPriceDelta: Number((myPrice - rackPrice).toFixed(2)),
        argusPrice: (offerId % 5 !== 0) ? Number((basePrice + 0.02).toFixed(2)) : null,
        plattsPrice: (offerId % 4 !== 0) ? Number((basePrice + 0.03).toFixed(2)) : null,
        spotContractPrice: (offerId % 5 !== 0) ? Number((basePrice + 0.08).toFixed(2)) : null,
        brandedPercentage: brandedPct,
        unbrandedPercentage: 100 - brandedPct,
        volumeMTD,
        volumeGoal,
        volumePacingPercent: Math.round((volumeMTD / volumeGoal) * 100),
        marketRank: 1 + ((terminal.LocationId + product.ProductId) % 10),
        totalCompetitors: 10,
      })
    }
    if (data.length >= count) break
  }

  return data
}

// ============================================================================
// INDEX OFFER GENERATORS (for main grid in Online Selling Platform)
// ============================================================================

export interface GeneratedIndexOfferRow {
  id: number
  terminal: string
  product: string
  formulaTemplate: string
  differential: string
  status: 'Active' | 'Inactive'
  createdBy: string
  createdDate: string
}

/**
 * Sample formula templates for index offers
 */
const FORMULA_TEMPLATES = [
  '90% Prior Day Argus CBOB USGC, 10% Prior Day Argus CBOB USGC, Less 10% OPIS Current Year RIN',
  '100% Prior Day OPIS {location} ULSD',
  '90% Prior Day Argus CBOB USGC, 10% Current OPIS RIN',
  '100% Prior Day OPIS {location} ULSD Rack',
  '95% Prior Day Argus CBOB Group 3, Less 5% OPIS RIN',
  '90% Prior Day Argus Premium USGC, 10% Prior Day Argus RFG USGC',
  '100% Current Day OPIS {location} Rack',
  '93% Prior Day Argus ULSD, 7% Prior Day Argus Biodiesel',
  '50% Prior Day OPIS 87 Gas, 50% Prior Day OPIS 93 Premium',
  '100% Prior Day Platts USGC CBOB',
]

/**
 * Generate index offer data for Online Selling Platform main grid
 * @param count - Number of offers to generate (default 15)
 */
export function generateIndexOfferData(count = 15): GeneratedIndexOfferRow[] {
  const terminals = getTerminalLocations()
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 4),
    ...getProductsByGroup('diesel').slice(0, 2),
    ...getProductsByGroup('biodiesel').slice(0, 1),
  ]

  const data: GeneratedIndexOfferRow[] = []
  let id = 1

  // Base date for created dates
  const baseDate = new Date('2025-10-01')

  for (const terminal of terminals) {
    for (const product of products) {
      if (data.length >= count) break

      // Deterministic values based on IDs
      const seed = product.ProductId * 100 + terminal.LocationId
      const templateIndex = seed % FORMULA_TEMPLATES.length
      const template = FORMULA_TEMPLATES[templateIndex].replace('{location}', terminal.Name.replace(' Terminal', ''))

      const differential = ((seed % 6) / 100).toFixed(2)
      const isActive = seed % 4 !== 0 // 75% active

      // Create date varies by a few days
      const createdDate = new Date(baseDate)
      createdDate.setDate(createdDate.getDate() + (seed % 10))

      data.push({
        id: id++,
        terminal: terminal.Name,
        product: product.Name,
        formulaTemplate: template,
        differential,
        status: isActive ? 'Active' : 'Inactive',
        createdBy: 'Sarah Johnson',
        createdDate: createdDate.toISOString().split('T')[0],
      })
    }
    if (data.length >= count) break
  }

  return data
}

// ============================================================================
// CONTRACT MEASUREMENT GENERATORS
// ============================================================================

export interface GeneratedContractDetail {
  detailId: string
  product: string
  location: string
  volume: number
  percentTotal: number
  contractPrice: number
  productGroup: string
  locationRegion: string
  effectiveStartDate: string
  effectiveEndDate: string
}

/**
 * Generate contract details from shared products and locations
 * @param count - Number of details to generate (default 10)
 */
export function generateContractDetails(count = 10): GeneratedContractDetail[] {
  const terminals = getTerminalLocations()
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 3),
    ...getProductsByGroup('diesel').slice(0, 2),
    ...getProductsByGroup('biodiesel').slice(0, 1),
  ]

  const details: GeneratedContractDetail[] = []
  let detailNum = 1
  let totalVolume = 0

  // First pass: generate volumes
  const tempDetails: Array<{ product: Product; terminal: Location; volume: number }> = []

  for (const terminal of terminals) {
    for (const product of products) {
      if (tempDetails.length >= count) break

      // Deterministic volume based on IDs
      const seed = product.ProductId * 100 + terminal.LocationId
      const volume = 50000 + (seed % 150000)
      totalVolume += volume

      tempDetails.push({ product, terminal, volume })
    }
    if (tempDetails.length >= count) break
  }

  // Contract date range
  const contractStart = '2024-01-01'
  const contractEnd = '2025-12-31'

  // Second pass: calculate percentages and create final details
  for (const item of tempDetails) {
    // ~30% of rows get a later start date (1-6 months offset), deterministic based on seed
    const seed = item.product.ProductId * 100 + item.terminal.LocationId
    const hasLaterStart = seed % 10 < 3 // 30% chance
    let effectiveStart = contractStart
    if (hasLaterStart) {
      const monthOffset = 1 + (seed % 6) // 1-6 months
      const startDate = new Date(2024, monthOffset, 1)
      effectiveStart = startDate.toISOString().split('T')[0]
    }

    details.push({
      detailId: `DTL-${String(detailNum++).padStart(3, '0')}`,
      product: item.product.Name,
      location: item.terminal.Name,
      volume: item.volume,
      percentTotal: Number(((item.volume / totalVolume) * 100).toFixed(1)),
      contractPrice: generateSeededPrice(item.product.ProductId, item.terminal.LocationId, item.product.ProductGroup),
      productGroup: item.product.ProductGroup,
      locationRegion: item.terminal.Region,
      effectiveStartDate: effectiveStart,
      effectiveEndDate: contractEnd,
    })
  }

  return details
}

/**
 * Generate dynamic product options with real counts from shared data
 */
export function generateProductSelectionOptions(): Array<{ value: string; label: string }> {
  const gasoline = getProductsByGroup('gasoline')
  const diesel = getProductsByGroup('diesel')
  const biodiesel = getProductsByGroup('biodiesel')
  const all = PRODUCTS.filter((p) => p.IsActive)

  return [
    { value: 'all', label: `All Details (${all.length})` },
    { value: 'gasoline', label: `Gasoline Only (${gasoline.length})` },
    { value: 'diesel', label: `Diesel Only (${diesel.length})` },
    { value: 'biodiesel', label: `Biodiesel Only (${biodiesel.length})` },
    { value: 'custom', label: 'Custom Selection...' },
  ]
}

// ============================================================================
// SUPPLIER ANALYSIS GENERATORS
// ============================================================================

export interface GeneratedSupplierAnalysisRow {
  id: number
  supplier: string
  location: string
  locationGroup: string
  product: string
  productGroup: string
  brand: 'Branded' | 'Unbranded'
  strategyTag: 'Leader' | 'Follower' | 'Position'
  spotDeltaCapture: number
  consistency: { level: 'High' | 'Medium' | 'Low'; percentage: number }
}

/**
 * Generate supplier analysis data from shared suppliers, locations, and products
 * @param count - Number of rows to generate (default 15)
 */
export function generateSupplierAnalysisData(count = 15): GeneratedSupplierAnalysisRow[] {
  const suppliers = getSuppliers()
  const locations = LOCATIONS.filter((l) => l.IsActive).slice(0, 20)
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 4),
    ...getProductsByGroup('diesel').slice(0, 2),
  ]

  const strategyTags: Array<'Leader' | 'Follower' | 'Position'> = ['Leader', 'Follower', 'Position']
  const brands: Array<'Branded' | 'Unbranded'> = ['Branded', 'Unbranded']

  const data: GeneratedSupplierAnalysisRow[] = []
  let id = 1

  for (const supplier of suppliers) {
    if (data.length >= count) break

    // Pick a location and product based on supplier ID for determinism
    const locationIndex = supplier.CounterPartyId % locations.length
    const productIndex = supplier.CounterPartyId % products.length
    const location = locations[locationIndex]
    const product = products[productIndex]

    // Deterministic values based on IDs
    const seed = supplier.CounterPartyId * 7 + (location?.LocationId || 1) * 3

    const spotDeltaCapture = 70 + (seed % 30) + Math.round((seed % 100) / 10) / 10
    const consistencyPercentage = 60 + (seed % 35) + Math.round((seed % 100) / 10) / 10
    const consistencyLevel: 'High' | 'Medium' | 'Low' =
      consistencyPercentage >= 85 ? 'High' : consistencyPercentage >= 70 ? 'Medium' : 'Low'

    data.push({
      id: id++,
      supplier: supplier.Name,
      location: location?.Name || 'Houston',
      locationGroup: location?.Region || 'Gulf Coast',
      product: product.Name,
      productGroup: product.ProductGroup === 'gasoline' ? (product.Grade || 'Regular') : 'Diesel',
      brand: brands[seed % 2],
      strategyTag: strategyTags[seed % 3],
      spotDeltaCapture: Number(spotDeltaCapture.toFixed(1)),
      consistency: {
        level: consistencyLevel,
        percentage: Number(consistencyPercentage.toFixed(1)),
      },
    })
  }

  return data
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a subset of products suitable for demo grids
 * Returns a mix of gasoline and diesel products
 */
export function getDemoProducts(count = 6): Product[] {
  return [
    ...getProductsByGroup('gasoline').slice(0, Math.ceil(count * 0.6)),
    ...getProductsByGroup('diesel').slice(0, Math.floor(count * 0.4)),
  ].slice(0, count)
}

/**
 * Get a subset of terminal locations suitable for demo grids
 */
export function getDemoTerminals(count = 5): Location[] {
  return getTerminalLocations().slice(0, count)
}

/**
 * Get product names for demo use
 */
export function getDemoProductNames(count = 3): string[] {
  return getDemoProducts(count).map((p) => p.Name)
}

/**
 * Get terminal names for demo use
 */
export function getDemoTerminalNames(count = 5): string[] {
  return getDemoTerminals(count).map((t) => t.Name)
}

// ============================================================================
// BUY PROMPTS GENERATORS (Rack Prices for Online Selling Platform)
// ============================================================================

export interface GeneratedBuyPromptRow {
  id: number
  location: string
  product: string
  price: string
  dailyHigh: string
  dailyLow: string
}

/**
 * Generate buy prompts (rack prices) data for Online Selling Platform
 * @param count - Number of rows to generate (default 15)
 */
export function generateBuyPromptsData(count = 15): GeneratedBuyPromptRow[] {
  const terminals = getTerminalLocations()
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 4),
    ...getProductsByGroup('diesel').slice(0, 2),
    ...getProductsByGroup('biodiesel').slice(0, 1),
  ]

  const data: GeneratedBuyPromptRow[] = []
  let id = 1

  for (const terminal of terminals) {
    for (const product of products) {
      if (data.length >= count) break

      const basePrice = generateSeededPrice(product.ProductId, terminal.LocationId, product.ProductGroup)
      // Daily high is 1-3% above base, daily low is 1-3% below base
      const seed = product.ProductId * 100 + terminal.LocationId
      const highVariation = 0.01 + (seed % 30) / 1000
      const lowVariation = 0.01 + ((seed + 17) % 30) / 1000

      data.push({
        id: id++,
        location: terminal.Name,
        product: product.Name,
        price: `$${basePrice.toFixed(4)}`,
        dailyHigh: `$${(basePrice + highVariation).toFixed(4)}`,
        dailyLow: `$${(basePrice - lowVariation).toFixed(4)}`,
      })
    }
    if (data.length >= count) break
  }

  return data
}

// ============================================================================
// BUY FORWARDS GENERATORS (Forward Contracts for Online Selling Platform)
// ============================================================================

export interface GeneratedBuyForwardRow {
  id: number
  location: string
  product: string
  deliveryMonth: string
  price: string
  dailyHigh: string
  dailyLow: string
}

/**
 * Generate buy forwards data for Online Selling Platform
 * @param count - Number of rows to generate (default 10)
 */
export function generateBuyForwardsData(count = 10): GeneratedBuyForwardRow[] {
  const terminals = getTerminalLocations().slice(0, 6) // Use fewer terminals for forwards
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 2),
    ...getProductsByGroup('diesel').slice(0, 1),
  ]

  // Generate delivery months (next 6 months)
  const deliveryMonths: string[] = []
  const now = new Date()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  for (let i = 1; i <= 6; i++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
    deliveryMonths.push(`${monthNames[futureDate.getMonth()]} ${futureDate.getFullYear()}`)
  }

  const data: GeneratedBuyForwardRow[] = []
  let id = 1

  for (const terminal of terminals) {
    for (const product of products) {
      if (data.length >= count) break

      const seed = product.ProductId * 100 + terminal.LocationId
      const monthIndex = seed % deliveryMonths.length

      const basePrice = generateSeededPrice(product.ProductId, terminal.LocationId, product.ProductGroup)
      // Forward prices are typically slightly higher
      const forwardPremium = 0.05 + (seed % 20) / 100
      const forwardPrice = basePrice + forwardPremium

      const highVariation = 0.02 + (seed % 30) / 1000
      const lowVariation = 0.02 + ((seed + 13) % 30) / 1000

      data.push({
        id: id++,
        location: terminal.Name,
        product: product.Name,
        deliveryMonth: deliveryMonths[monthIndex],
        price: `$${forwardPrice.toFixed(4)}`,
        dailyHigh: `$${(forwardPrice + highVariation).toFixed(4)}`,
        dailyLow: `$${(forwardPrice - lowVariation).toFixed(4)}`,
      })
    }
    if (data.length >= count) break
  }

  return data
}

// ============================================================================
// ONLINE SELLING PLATFORM INDEX OFFERS (Home page version)
// ============================================================================

export interface GeneratedHomeIndexOfferRow {
  id: number
  terminal: string
  product: string
  type: string
  formulaName: string
  diff: string
}

/**
 * Generate index offers for Online Selling Platform home page
 * @param count - Number of offers to generate (default 12)
 */
export function generateHomeIndexOffersData(count = 12): GeneratedHomeIndexOfferRow[] {
  const terminals = getTerminalLocations()
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 4),
    ...getProductsByGroup('diesel').slice(0, 2),
    ...getProductsByGroup('biodiesel').slice(0, 1),
  ]

  const offerTypes = ['Spot Index', 'OPIS', 'OPIS Rack', 'Platts']

  const data: GeneratedHomeIndexOfferRow[] = []
  let id = 1

  for (const terminal of terminals) {
    for (const product of products) {
      if (data.length >= count) break

      const seed = product.ProductId * 100 + terminal.LocationId
      const templateIndex = seed % FORMULA_TEMPLATES.length
      const typeIndex = seed % offerTypes.length
      const locationShort = terminal.Name.replace(' Terminal', '')
      const formula = FORMULA_TEMPLATES[templateIndex].replace('{location}', locationShort)

      const differential = ((seed % 6) / 100).toFixed(2)

      data.push({
        id: id++,
        terminal: locationShort,
        product: product.Name,
        type: offerTypes[typeIndex],
        formulaName: formula,
        diff: differential,
      })
    }
    if (data.length >= count) break
  }

  return data
}

// ============================================================================
// CONTRACT BENCHMARK GENERATORS
// ============================================================================

export interface GeneratedContractProduct {
  id: string
  name: string
  location: string
  volume: number
  currentPrice: number
}

/**
 * Generate sample contract products for benchmark calculations
 * @param count - Number of products to generate (default 6)
 */
export function generateContractProducts(count = 6): GeneratedContractProduct[] {
  const terminals = getTerminalLocations().slice(0, 4)
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 3),
    ...getProductsByGroup('diesel').slice(0, 2),
  ]

  const data: GeneratedContractProduct[] = []

  for (const terminal of terminals) {
    for (const product of products) {
      if (data.length >= count) break

      const seed = product.ProductId * 100 + terminal.LocationId
      const basePrice = generateSeededPrice(product.ProductId, terminal.LocationId, product.ProductGroup)
      const volume = 75000 + (seed % 100) * 1000

      data.push({
        id: `P${String(data.length + 1).padStart(3, '0')}`,
        name: product.Name,
        location: terminal.Name,
        volume,
        currentPrice: basePrice,
      })
    }
    if (data.length >= count) break
  }

  return data
}

// ============================================================================
// PERFORMANCE DETAILS GENERATORS
// ============================================================================

export interface GeneratedPerformanceRecord {
  id: number
  productName: string
  location: string
  targetVolume: number
  actualVolume: number
  fulfillmentPercentage: number
  dailyAverageLifting: number
  requiredDailyPace: number
  paceVariance: number
  benchmarkPrice: number
  varianceVsBenchmark: number
  varianceVsRack: number
  benchmarkVariance: 'above' | 'below' | 'at'
  margin: number
  lowerOfImpact: number
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  performanceStatus: 'ahead' | 'on-track' | 'behind' | 'critical'
  trend: 'improving' | 'stable' | 'declining'
  trendData: number[]
}

/**
 * Generate performance detail records from shared data
 * @param count - Number of records to generate (default 8)
 */
export function generatePerformanceDetails(count = 8): GeneratedPerformanceRecord[] {
  const terminals = getTerminalLocations().slice(0, 4)
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 3),
    ...getProductsByGroup('diesel').slice(0, 2),
  ]

  const data: GeneratedPerformanceRecord[] = []
  let id = 1

  for (const terminal of terminals) {
    for (const product of products) {
      if (data.length >= count) break

      const seed = product.ProductId * 100 + terminal.LocationId
      const basePrice = generateSeededPrice(product.ProductId, terminal.LocationId, product.ProductGroup)

      // Generate realistic performance metrics
      const targetVolume = 150000 + (seed % 200) * 1000
      const fulfillmentPercentage = 70 + (seed % 45)
      const actualVolume = Math.floor((targetVolume * fulfillmentPercentage) / 100)

      const dailyAverageLifting = Math.floor(actualVolume / 25)
      const requiredDailyPace = Math.floor(targetVolume / 25)
      const paceVariance = Number((((dailyAverageLifting - requiredDailyPace) / requiredDailyPace) * 100).toFixed(1))

      const varianceVsBenchmark = Number((((seed % 100) - 50) / 1000).toFixed(4))
      const varianceVsRack = Number(((((seed * 7) % 100) - 50) / 1000).toFixed(4))
      const benchmarkVariance: 'above' | 'below' | 'at' =
        varianceVsBenchmark > 0.005 ? 'above' : varianceVsBenchmark < -0.005 ? 'below' : 'at'

      // Margin: avg cents per gallon as dollar value, range -$0.0250 to +$0.2500
      const margin = Number((-0.025 + ((seed % 1000) / 1000) * 0.275).toFixed(4))

      // Lower-of Impact: total $ loss when rack price undercuts contract terms
      // Only negative when varianceVsRack < 0 (rack won), otherwise 0
      const lowerOfImpact = varianceVsRack < 0
        ? Math.round(varianceVsRack * actualVolume)
        : 0

      const riskScore = Math.max(0, Math.min(100, 100 - fulfillmentPercentage + Math.abs(paceVariance)))
      const riskLevel: 'low' | 'medium' | 'high' | 'critical' =
        riskScore < 25 ? 'low' : riskScore < 50 ? 'medium' : riskScore < 75 ? 'high' : 'critical'

      const performanceStatus: 'ahead' | 'on-track' | 'behind' | 'critical' =
        fulfillmentPercentage >= 100 ? 'ahead' : fulfillmentPercentage >= 90 ? 'on-track' : fulfillmentPercentage >= 75 ? 'behind' : 'critical'

      const trend: 'improving' | 'stable' | 'declining' = seed % 3 === 0 ? 'improving' : seed % 3 === 1 ? 'stable' : 'declining'

      // Generate trend data (30 points)
      const trendData: number[] = []
      let trendValue = fulfillmentPercentage - 10
      for (let i = 0; i < 30; i++) {
        const noise = (((seed + i) % 10) - 5) / 2
        if (trend === 'improving') trendValue += 0.3
        else if (trend === 'declining') trendValue -= 0.2
        trendData.push(Number((trendValue + noise).toFixed(1)))
      }

      data.push({
        id: id++,
        productName: product.Name,
        location: terminal.Name,
        targetVolume,
        actualVolume,
        fulfillmentPercentage,
        dailyAverageLifting,
        requiredDailyPace,
        paceVariance,
        benchmarkPrice: basePrice,
        varianceVsBenchmark,
        varianceVsRack,
        benchmarkVariance,
        margin,
        lowerOfImpact,
        riskScore: Math.round(riskScore),
        riskLevel,
        performanceStatus,
        trend,
        trendData,
      })
    }
    if (data.length >= count) break
  }

  return data
}

// ============================================================================
// DETAILED COMPARISON GENERATORS
// ============================================================================

export interface GeneratedComparisonRow {
  key: string
  product: string
  location: string
  volume: number
  percentTotal: number
  benchmarkData: Record<string, { delta: number; impact: number }>
}

/**
 * Generate comparison table data for benchmarks section
 * @param count - Number of rows to generate (default 4)
 */
export function generateComparisonData(count = 4): GeneratedComparisonRow[] {
  const terminals = getTerminalLocations().slice(0, 3)
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 3),
    ...getProductsByGroup('diesel').slice(0, 1),
  ]

  const data: GeneratedComparisonRow[] = []
  let totalVolume = 0

  // First pass: generate base data
  const tempData: Array<{ product: Product; terminal: Location; volume: number }> = []

  for (const terminal of terminals) {
    for (const product of products) {
      if (tempData.length >= count) break
      const seed = product.ProductId * 100 + terminal.LocationId
      const volume = 18000 + (seed % 15) * 1000
      totalVolume += volume
      tempData.push({ product, terminal, volume })
    }
    if (tempData.length >= count) break
  }

  // Second pass: create final data with percentages
  tempData.forEach((item, index) => {
    const seed = item.product.ProductId * 100 + item.terminal.LocationId

    data.push({
      key: String(index + 1),
      product: item.product.Name,
      location: item.terminal.Name,
      volume: item.volume,
      percentTotal: Number(((item.volume / totalVolume) * 100).toFixed(1)),
      benchmarkData: {
        'rack-average': {
          delta: Number((((seed % 20) - 10) / 100).toFixed(4)),
          impact: Math.round(((seed % 20) - 10) * 50),
        },
        'rack-low': {
          delta: Number((((seed % 16) - 8) / 100).toFixed(4)),
          impact: Math.round(((seed % 16) - 8) * 60),
        },
      },
    })
  })

  return data
}

// ============================================================================
// OFFER PRICING GENERATORS
// ============================================================================

export interface GeneratedPricingRow {
  id: number
  product: string
  location: string
  type: string
  formula: string
  currentDiff: number
  currentPrice: number
  proposedDiff: number
  proposedPrice: number
}

/**
 * Generate pricing row data for offer pricing tab
 * @param count - Number of rows to generate (default 10)
 */
export function generatePricingData(count = 10): GeneratedPricingRow[] {
  const terminals = getTerminalLocations()
  const products = [
    ...getProductsByGroup('gasoline').slice(0, 4),
    ...getProductsByGroup('diesel').slice(0, 2),
    ...getProductsByGroup('biodiesel').slice(0, 1),
  ]

  const priceTypes = ['Argus', 'OPIS', 'Platts']

  const data: GeneratedPricingRow[] = []
  let id = 1

  for (const terminal of terminals) {
    for (const product of products) {
      if (data.length >= count) break

      const seed = product.ProductId * 100 + terminal.LocationId
      const basePrice = generateSeededPrice(product.ProductId, terminal.LocationId, product.ProductGroup)
      const typeIndex = seed % priceTypes.length
      const type = priceTypes[typeIndex]

      const templateIndex = seed % FORMULA_TEMPLATES.length
      const locationShort = terminal.Name.replace(' Terminal', '')
      const formula = FORMULA_TEMPLATES[templateIndex].replace('{location}', locationShort)

      const currentDiff = Number(((seed % 6) / 100).toFixed(4))
      const proposedDiff = Number((currentDiff + ((seed % 5) - 2) / 100).toFixed(4))
      const currentPrice = basePrice
      const proposedPrice = Number((currentPrice + (proposedDiff - currentDiff)).toFixed(4))

      data.push({
        id: id++,
        product: product.Name,
        location: terminal.Name,
        type,
        formula,
        currentDiff,
        currentPrice,
        proposedDiff,
        proposedPrice,
      })
    }
    if (data.length >= count) break
  }

  return data
}

export interface GeneratedAnalyticsRow {
  id: number
  competitor: string
  currentPrice: string
  rank: string
  trendIndicator: 'normal' | 'above' | 'below'
  lastRevalueDate: string
  changeFromPrevious: string
  differenceToSelected: string
  isSelected: boolean
}

/**
 * Generate analytics comparison data
 * @param count - Number of rows to generate (default 7)
 */
export function generateAnalyticsData(count = 7): GeneratedAnalyticsRow[] {
  const competitors = [
    'Your Offer (Selected)',
    'Platts USGC Index',
    'Argus CBOB Index',
    'Competitor A Rack Post',
    'Competitor B Rack Post',
    'Bottom Line Average',
    'Internal Contract Low',
  ]

  const basePrice = 2.45
  const data: GeneratedAnalyticsRow[] = []

  for (let i = 0; i < Math.min(count, competitors.length); i++) {
    const seed = (i + 1) * 17
    const priceOffset = ((seed % 10) - 5) / 100
    const price = basePrice + priceOffset
    const isSelected = i === 0

    const changeValue = ((seed % 6) - 3) / 100
    const diffValue = isSelected ? 0 : priceOffset

    data.push({
      id: i + 1,
      competitor: competitors[i],
      currentPrice: `$${price.toFixed(4)}`,
      rank: `Position ${i + 1}`,
      trendIndicator: isSelected ? 'normal' : priceOffset > 0 ? 'above' : 'below',
      lastRevalueDate: `2025-11-0${(i % 3) + 1}`,
      changeFromPrevious: `${changeValue >= 0 ? '+' : ''}$${changeValue.toFixed(2)}`,
      differenceToSelected: isSelected ? '$0.00' : `${diffValue >= 0 ? '+' : ''}$${diffValue.toFixed(2)}`,
      isSelected,
    })
  }

  return data
}

// ============================================================================
// DELIVERED PRICING GENERATORS (Quote Book EOD Mode)
// ============================================================================

export type DeliveredPricingStrategy =
  | 'Lowest Price'
  | 'Lowest Rack'
  | 'Lowest Contract'
  | 'Average Rack'
  | 'Allocation Maintenance'

export const DELIVERED_PRICING_STRATEGIES: DeliveredPricingStrategy[] = [
  'Lowest Price',
  'Lowest Rack',
  'Lowest Contract',
  'Average Rack',
  'Allocation Maintenance',
]

/** Severity levels for supply exceptions */
export type ExceptionSeverity = 'info' | 'warning' | 'critical'

/** Structured supply exception with severity, label, and optional context */
export interface SupplyException {
  /** Short label displayed as a chip */
  label: string
  /** Severity determines color: info (blue), warning (orange), critical (red) */
  severity: ExceptionSeverity
  /** Optional detail shown on hover */
  detail?: string
}

export interface DeliveredPricingQuoteRow {
  id: number
  QuoteConfigurationMappingId: number
  QuoteConfigurationName: string
  LocationName: string
  DestinationLocationName: string
  CounterpartyName: string
  ProductName: string
  ProductGroup: string
  Strategy: DeliveredPricingStrategy
  // Current period
  PriorQuotePeriod: {
    Liftings: number
    LastPrice: number
  }
  // Exception alerting — structured array of supply exceptions
  Exception: SupplyException[] | null
  // Whether the user has manually overridden the strategy default
  IsStrategyOverridden: boolean
  // Proposed period
  Cost: number | null
  Diff: number
  Freight: number
  Tax: number
  /** Carrier assigned to this freight lane */
  CarrierName: string
  /** Freight type (e.g. Common Carrier, Dedicated, Pipeline) */
  FreightType: string
  /** Original freight for the row's origin — used as reference when supply option origin changes */
  BaseFreight: number
  /** Original tax for the row's origin — used as reference when supply option origin changes */
  BaseTax: number
  /** Per-gallon total federal tax (excise + LUST) */
  FederalTax: number
  /** Per-gallon federal motor fuel excise tax (18.3¢ gasoline, 24.3¢ diesel) */
  FederalExciseTaxRate: number
  /** Per-gallon federal Leaking Underground Storage Tank (LUST) Trust Fund tax (0.1¢) */
  FederalLUSTTaxRate: number
  /** Per-gallon state excise tax */
  StateTax: number
  /** Per-gallon local excise tax (0 if none) */
  LocalTax: number
  /** Destination state abbreviation (drives tax jurisdiction) */
  DestinationState: string
  ProposedPrice: number
  PriceDelta: number
  Margin: number
}

/**
 * Generate delivered pricing data modeled after the Pricing Engine Quote Book EOD mode.
 * Produces rows with quote configuration, origin/destination, product,
 * current period (sold volume, price), and proposed columns
 * (cost, diff, freight, tax, price, price delta, margin).
 * Price = Cost + Freight + Tax + Diff.
 *
 * @param count - Number of rows to generate (default 40)
 */
export function generateDeliveredPricingData(count = 40): DeliveredPricingQuoteRow[] {
  const origins = LOCATIONS.filter((l) => l.IsTerminal && l.IsActive)
  const destinations = LOCATIONS.filter((l) => !l.IsTerminal && l.IsActive && l.State === 'TX').slice(0, 30)
  const products = [
    { ProductId: 901, Name: '87 E10', ProductGroup: 'gasoline' },
    { ProductId: 902, Name: '93 E10', ProductGroup: 'gasoline' },
    { ProductId: 903, Name: 'ULSD2', ProductGroup: 'diesel' },
  ]

  const quoteConfigs = [
    'Delivered',
  ]

  const counterparties = [
    'Scharf Fuels',
    'Johnson Oil',
    'Hunt Petroleum',
    'Davies Energy',
  ]

  const carriers = [
    'TransAm Logistics',
    'Gulf Coast Carriers',
    'Patriot Transport',
    'Eagle Fleet Services',
    'Lone Star Freight',
    'Pinnacle Hauling',
  ]

  const freightTypes = [
    'Point-to-Point',
    'Mileage',
  ]

  // Retail store destinations (address-style names)
  const retailDestinations = [
    '123 Main St',
    '456 Elm Ave',
    '789 Oak Blvd',
    '1020 Cedar Ln',
    '3350 Maple Dr',
    '510 Walnut St',
    '1475 Pine Rd',
    '2200 Birch Way',
    '680 Spruce Ct',
    '4100 Ash Pkwy',
    '915 Willow Trl',
    '1340 Hickory Pl',
    '2780 Poplar Ave',
    '365 Magnolia Blvd',
    '5020 Cypress Ln',
    '1190 Juniper Dr',
    '830 Redwood St',
    '2460 Sycamore Rd',
    '4725 Chestnut Way',
    '190 Pecan Ct',
    '3610 Dogwood Pkwy',
    '1055 Hawthorn Trl',
    '2890 Locust Pl',
    '540 Mulberry Ave',
    '4215 Sequoia Blvd',
    '1780 Alder Ln',
    '3140 Aspen Dr',
    '660 Cottonwood St',
    '2025 Laurel Rd',
    '4480 Mesquite Way',
  ]

  const data: DeliveredPricingQuoteRow[] = []
  let id = 1

  for (const origin of origins) {
    for (let destIdx = 0; destIdx < destinations.length; destIdx++) {
      const destination = destinations[destIdx]
      for (const product of products) {
        if (data.length >= count) break

        const seed = product.ProductId * 1000 + origin.LocationId * 100 + destination.LocationId
        const configIndex = seed % quoteConfigs.length
        const baseCost = generateSeededPrice(product.ProductId, origin.LocationId, product.ProductGroup)

        // Freight based on distance proxy (difference in IDs)
        const freight = Number((0.03 + (Math.abs(origin.LocationId - destination.LocationId) % 15) * 0.008).toFixed(4))

        // Diff (strategy differential)
        const diff = Number(((seed % 12 - 6) / 100).toFixed(4))

        // Per-gallon excise tax — destination-driven (all TX destinations)
        const isGasoline = product.ProductGroup === 'gasoline'
        // Federal: Motor Fuel Excise (18.3¢ gas / 24.3¢ diesel) + LUST Trust Fund (0.1¢)
        const federalExciseTaxRate = isGasoline ? 0.1830 : 0.2430
        const federalLUSTTaxRate = 0.0010
        const federalTax = Number((federalExciseTaxRate + federalLUSTTaxRate).toFixed(4)) // 18.4¢ / 24.4¢
        const stateTax = 0.2000 // TX state motor fuel tax (same for gasoline and diesel)
        const localTax = 0      // Texas does not authorize local fuel taxes
        const tax = Number((federalTax + stateTax + localTax).toFixed(4))

        // Price = Cost + Freight + Tax + Diff
        const proposedPrice = Number((baseCost + freight + tax + diff).toFixed(4))

        // Prior period price with slight variation
        const priorPrice = Number((proposedPrice + ((seed % 10) - 5) / 100).toFixed(4))
        const priceDelta = Number((proposedPrice - priorPrice).toFixed(4))
        const margin = Number((proposedPrice - baseCost).toFixed(4))

        // Sold volume
        const liftings = 1000 + (seed % 50) * 200

        const strategy = DELIVERED_PRICING_STRATEGIES[seed % DELIVERED_PRICING_STRATEGIES.length]
        const counterparty = counterparties[seed % counterparties.length]
        const carrier = carriers[(seed * 3 + 7) % carriers.length]
        const freightType = freightTypes[(seed * 5 + 11) % freightTypes.length]

        data.push({
          id: id++,
          QuoteConfigurationMappingId: id,
          QuoteConfigurationName: quoteConfigs[configIndex],
          LocationName: origin.Name,
          DestinationLocationName: retailDestinations[seed % retailDestinations.length],
          CounterpartyName: counterparty,
          ProductName: product.Name,
          ProductGroup: product.ProductGroup,
          Strategy: strategy,
          Exception: null, // computed at runtime based on supply options
          IsStrategyOverridden: false,
          PriorQuotePeriod: {
            Liftings: liftings,
            LastPrice: priorPrice,
          },
          Cost: baseCost,
          Diff: diff,
          Freight: freight,
          Tax: tax,
          CarrierName: carrier,
          FreightType: freightType,
          BaseFreight: freight,
          BaseTax: tax,
          FederalTax: federalTax,
          FederalExciseTaxRate: federalExciseTaxRate,
          FederalLUSTTaxRate: federalLUSTTaxRate,
          StateTax: stateTax,
          LocalTax: localTax,
          DestinationState: 'TX',
          ProposedPrice: proposedPrice,
          PriceDelta: priceDelta,
          Margin: margin,
        })
      }
      if (data.length >= count) break
    }
    if (data.length >= count) break
  }

  return data
}
