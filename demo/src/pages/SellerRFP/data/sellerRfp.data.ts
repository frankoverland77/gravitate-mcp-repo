/**
 * Seller RFP Response Management - Mock Data
 *
 * Sample RFPs, detail rows, formulas, and price history data for the prototype.
 */

import type { Formula } from '../../../shared/types/formula.types'
import type {
  SellerRFP,
  SellerRFPDetail,
  RFPTerms,
  RFPRoundHistory,
  CostType,
  SellerRFPStatus,
  PriorRoundSnapshot,
} from '../types/sellerRfp.types'

// =============================================================================
// PRODUCTS & TERMINALS FOR SELLER RFP
// =============================================================================

export const SELLER_PRODUCTS = ['87 Octane', '89 Octane', '93 Octane', 'ULSD', 'Kerosene'] as const
export type SellerProduct = (typeof SELLER_PRODUCTS)[number]

export const SELLER_TERMINALS = [
  'Houston Terminal',
  'Pasadena Terminal',
  'Beaumont Terminal',
  'Dallas Terminal',
  'Baton Rouge Terminal',
] as const
export type SellerTerminal = (typeof SELLER_TERMINALS)[number]

// Product to instrument mapping for realistic formulas
const PRODUCT_INSTRUMENTS: Record<string, { instrument: string; productGroup: 'gasoline' | 'diesel' }> = {
  '87 Octane': { instrument: 'CBOB USGC', productGroup: 'gasoline' },
  '89 Octane': { instrument: 'CBOB USGC', productGroup: 'gasoline' },
  '93 Octane': { instrument: 'RBOB USGC', productGroup: 'gasoline' },
  'ULSD': { instrument: 'ULSD USGC', productGroup: 'diesel' },
  'Kerosene': { instrument: 'ULSD USGC', productGroup: 'diesel' },
}

// =============================================================================
// FORMULA BUILDERS
// =============================================================================

let formulaIdCounter = 1

function createFormula(
  publisher: string,
  instrument: string,
  priceType: string,
  differential: number,
  name?: string,
): Formula {
  const id = `formula-seller-${formulaIdCounter++}`
  const diffStr = differential >= 0 ? `+ $${differential.toFixed(3)}` : `- $${Math.abs(differential).toFixed(3)}`
  return {
    id,
    name: name || `${publisher} ${instrument} ${priceType} ${diffStr}`,
    expression: `${publisher} ${instrument} ${priceType} ${diffStr}`,
    variables: [
      {
        id: `var-${id}-1`,
        variableName: 'var_1_group_1',
        displayName: `${publisher} ${instrument}`,
        pricePublisher: publisher,
        priceInstrument: instrument,
        priceType,
        dateRule: 'Prior Day',
        percentage: 100,
        differential,
      },
    ],
  }
}

function createLesserOf2Formula(
  pub1: string, inst1: string, type1: string, diff1: number,
  pub2: string, inst2: string, type2: string, diff2: number,
  name?: string,
): Formula {
  const id = `formula-seller-${formulaIdCounter++}`
  return {
    id,
    name: name || `Lower of ${pub1} ${type1} / ${pub2} ${type2}`,
    expression: `MIN(${pub1} ${inst1} ${type1}, ${pub2} ${inst2} ${type2})`,
    variables: [
      {
        id: `var-${id}-1`,
        variableName: 'var_1_group_1',
        displayName: `${pub1} ${inst1}`,
        pricePublisher: pub1,
        priceInstrument: inst1,
        priceType: type1,
        dateRule: 'Prior Day',
        percentage: 100,
        differential: diff1,
      },
      {
        id: `var-${id}-2`,
        variableName: 'var_2_group_2',
        displayName: `${pub2} ${inst2}`,
        pricePublisher: pub2,
        priceInstrument: inst2,
        priceType: type2,
        dateRule: 'Prior Day',
        percentage: 100,
        differential: diff2,
      },
    ],
  }
}

// Base market prices by product
const BASE_PRICES: Record<string, number> = {
  '87 Octane': 2.3000,
  '89 Octane': 2.3400,
  '93 Octane': 2.4200,
  'ULSD': 2.2600,
  'Kerosene': 2.3100,
}

function resolvePrice(formula: Formula | null, product: string): number | null {
  if (!formula || formula.variables.length === 0) return null
  const base = BASE_PRICES[product] || 2.30
  const v = formula.variables[0]
  return Math.round((base + v.differential) * 10000) / 10000
}

// =============================================================================
// DETAIL ROW GENERATORS
// =============================================================================

let detailIdCounter = 1

function createDetail(
  product: string,
  terminal: string,
  costType: CostType | null,
  costDiff: number | null,
  saleDiff: number | null,
  volume: number | null,
  overrides?: { costFormula?: Formula; saleFormula?: Formula; priorRoundValues?: PriorRoundSnapshot },
): SellerRFPDetail {
  const id = `detail-${detailIdCounter++}`
  const pi = PRODUCT_INSTRUMENTS[product] || { instrument: 'CBOB USGC', productGroup: 'gasoline' }

  const costFormula = overrides?.costFormula ??
    (costDiff !== null ? createFormula('OPIS', pi.instrument, 'Low', costDiff) : null)
  const saleFormula = overrides?.saleFormula ??
    (saleDiff !== null ? createFormula('OPIS', pi.instrument, 'Low', saleDiff) : null)

  const costPrice = resolvePrice(costFormula, product)
  const salePrice = resolvePrice(saleFormula, product)

  let margin: number | null = null
  if (costPrice !== null && salePrice !== null) {
    margin = Math.round((salePrice - costPrice) * 10000) / 100 // cpg
  }

  const hasCost = costType !== null && costPrice !== null
  const hasSale = saleFormula !== null && salePrice !== null
  const status = hasCost && hasSale ? 'ready' : hasCost || hasSale ? 'in-progress' : 'empty'

  return {
    id,
    product,
    terminal,
    costType,
    costFormula,
    costPrice,
    saleFormula,
    salePrice,
    margin,
    volume,
    status,
    termOverrides: null,
    priorRoundValues: overrides?.priorRoundValues,
  }
}

function createEmptyDetails(products: string[], terminals: string[]): SellerRFPDetail[] {
  return products.flatMap((product) =>
    terminals.map((terminal) =>
      createDetail(product, terminal, null, null, null, null),
    ),
  )
}

// =============================================================================
// DEFAULT TERMS
// =============================================================================

const DEFAULT_TERMS: RFPTerms = {
  volumeCommitment: null,
  contractStart: null,
  contractEnd: null,
  allocationPeriod: null,
  ratabilityMin: null,
  ratabilityMax: null,
  penaltyCpg: null,
  paymentTerms: null,
  notes: null,
}

// =============================================================================
// SAMPLE RFPS
// =============================================================================

export const SAMPLE_SELLER_RFPS: SellerRFP[] = [
  // 1. In Progress - FleetCor - Houston/Pasadena - 87/93/ULSD
  {
    id: 'srfp-1',
    name: 'Gulf Coast Gasoline Supply 2026',
    buyerId: '101',
    buyerName: 'Pilot Travel Centers',
    deadline: '2026-03-07',
    currentRound: 1,
    status: 'in-progress',
    details: [
      createDetail('87 Octane', 'Houston Terminal', 'inventory', -0.020, 0.015, 200000),
      createDetail('87 Octane', 'Pasadena Terminal', 'inventory', -0.018, 0.018, 180000),
      createDetail('93 Octane', 'Houston Terminal', 'contract', -0.010, 0.025, 100000),
      createDetail('93 Octane', 'Pasadena Terminal', 'contract', -0.010, null, 90000),
      createDetail('ULSD', 'Houston Terminal', 'estimated', 0.005, 0.035, 150000),
      createDetail('ULSD', 'Pasadena Terminal', null, null, null, null),
    ],
    terms: {
      volumeCommitment: 720000,
      contractStart: '2026-04-01',
      contractEnd: '2027-03-31',
      allocationPeriod: 'daily',
      ratabilityMin: 80,
      ratabilityMax: 120,
      penaltyCpg: 2.0,
      paymentTerms: 'net-10',
      notes: 'Pilot requires daily allocation with strict ratability compliance.',
    },
    rounds: [],
    createdAt: '2026-02-25T10:30:00Z',
    updatedAt: '2026-02-28T14:15:00Z',
  },

  // 2. In Progress - Love's - Dallas/Beaumont - 87/89/ULSD
  {
    id: 'srfp-2',
    name: "Love's Dallas Region Supply",
    buyerId: '105',
    buyerName: "Love's Travel Stops",
    deadline: '2026-03-12',
    currentRound: 1,
    status: 'in-progress',
    details: [
      createDetail('87 Octane', 'Dallas Terminal', 'inventory', -0.022, 0.012, 250000),
      createDetail('89 Octane', 'Dallas Terminal', 'inventory', -0.020, 0.015, 80000),
      createDetail('ULSD', 'Dallas Terminal', 'estimated', 0.008, 0.040, 180000),
      createDetail('87 Octane', 'Beaumont Terminal', 'contract', -0.015, null, 200000),
      createDetail('89 Octane', 'Beaumont Terminal', null, null, null, null),
      createDetail('ULSD', 'Beaumont Terminal', null, null, null, null),
    ],
    terms: {
      volumeCommitment: 710000,
      contractStart: '2026-05-01',
      contractEnd: '2027-04-30',
      allocationPeriod: 'weekly',
      ratabilityMin: 85,
      ratabilityMax: 115,
      penaltyCpg: 1.5,
      paymentTerms: 'net-15',
      notes: null,
    },
    rounds: [],
    createdAt: '2026-02-26T09:00:00Z',
    updatedAt: '2026-02-28T11:30:00Z',
  },

  // 3. Draft - Casey's - just created
  {
    id: 'srfp-3',
    name: "Casey's Midwest Fuel RFP",
    buyerId: '200',
    buyerName: "Casey's General Stores",
    deadline: '2026-03-20',
    currentRound: 1,
    status: 'draft',
    details: createEmptyDetails(
      ['87 Octane', '89 Octane', 'ULSD'],
      ['Dallas Terminal', 'Houston Terminal'],
    ),
    terms: { ...DEFAULT_TERMS },
    rounds: [],
    createdAt: '2026-02-28T08:00:00Z',
    updatedAt: '2026-02-28T08:00:00Z',
  },

  // 4. Submitted - Wawa - awaiting adjudication
  {
    id: 'srfp-4',
    name: 'Wawa Southeast Supply Agreement',
    buyerId: '201',
    buyerName: 'Wawa Inc.',
    deadline: '2026-03-01',
    currentRound: 1,
    status: 'submitted',
    details: [
      createDetail('87 Octane', 'Houston Terminal', 'inventory', -0.020, 0.020, 300000),
      createDetail('93 Octane', 'Houston Terminal', 'inventory', -0.015, 0.030, 150000),
      createDetail('ULSD', 'Houston Terminal', 'contract', -0.010, 0.035, 200000),
    ],
    terms: {
      volumeCommitment: 650000,
      contractStart: '2026-04-01',
      contractEnd: '2027-03-31',
      allocationPeriod: 'daily',
      ratabilityMin: 90,
      ratabilityMax: 110,
      penaltyCpg: 2.5,
      paymentTerms: 'net-10',
      notes: 'Wawa requires daily allocation at all terminals.',
    },
    rounds: [
      {
        round: 1,
        submittedAt: '2026-02-27T16:00:00Z',
        adjudication: null,
        adjudicationReason: null,
        adjudicationNotes: null,
        detailSnapshot: [
          createDetail('87 Octane', 'Houston Terminal', 'inventory', -0.020, 0.020, 300000),
          createDetail('93 Octane', 'Houston Terminal', 'inventory', -0.015, 0.030, 150000),
          createDetail('ULSD', 'Houston Terminal', 'contract', -0.010, 0.035, 200000),
        ],
      },
    ],
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-27T16:00:00Z',
  },

  // 5. Advanced to R2 - Sheetz - with prior round data
  {
    id: 'srfp-5',
    name: 'Sheetz Mid-Atlantic Supply 2026',
    buyerId: '202',
    buyerName: 'Sheetz Inc.',
    deadline: '2026-03-15',
    currentRound: 2,
    status: 'in-progress',
    details: [
      createDetail('87 Octane', 'Houston Terminal', 'inventory', -0.020, 0.012, 220000, {
        priorRoundValues: { costPrice: 2.2800, salePrice: 2.3200, margin: 4.00, saleFormulaDisplay: 'OPIS CBOB USGC Low + $0.020', volume: 200000 },
      }),
      createDetail('93 Octane', 'Houston Terminal', 'contract', -0.012, 0.020, 120000, {
        priorRoundValues: { costPrice: 2.4080, salePrice: 2.4500, margin: 4.20, saleFormulaDisplay: 'OPIS RBOB USGC Low + $0.030', volume: 100000 },
      }),
      createDetail('ULSD', 'Houston Terminal', 'estimated', 0.005, 0.030, 160000, {
        priorRoundValues: { costPrice: 2.2650, salePrice: 2.3000, margin: 3.50, saleFormulaDisplay: 'OPIS ULSD USGC Low + $0.040', volume: 150000 },
      }),
      createDetail('87 Octane', 'Beaumont Terminal', 'inventory', -0.022, 0.010, 200000, {
        priorRoundValues: { costPrice: 2.2780, salePrice: 2.3180, margin: 4.00, saleFormulaDisplay: 'OPIS CBOB USGC Low + $0.018', volume: 180000 },
      }),
    ],
    terms: {
      volumeCommitment: 700000,
      contractStart: '2026-04-01',
      contractEnd: '2027-03-31',
      allocationPeriod: 'daily',
      ratabilityMin: 85,
      ratabilityMax: 115,
      penaltyCpg: 2.0,
      paymentTerms: 'net-10',
      notes: 'Round 2 — tightened differentials per buyer feedback. Increased volume commitment.',
    },
    rounds: [
      {
        round: 1,
        submittedAt: '2026-02-22T15:00:00Z',
        adjudication: 'advanced',
        adjudicationReason: null,
        adjudicationNotes: 'Buyer requested tighter pricing on gasoline grades.',
        detailSnapshot: [
          createDetail('87 Octane', 'Houston Terminal', 'inventory', -0.020, 0.020, 200000),
          createDetail('93 Octane', 'Houston Terminal', 'contract', -0.012, 0.030, 100000),
          createDetail('ULSD', 'Houston Terminal', 'estimated', 0.005, 0.040, 150000),
          createDetail('87 Octane', 'Beaumont Terminal', 'inventory', -0.022, 0.018, 180000),
        ],
      },
    ],
    createdAt: '2026-02-18T09:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z',
  },

  // 6. Won - FleetCor
  {
    id: 'srfp-6',
    name: 'FleetCor Houston Fuel Supply',
    buyerId: '203',
    buyerName: 'FleetCor Technologies',
    deadline: '2026-01-15',
    currentRound: 2,
    status: 'won',
    details: [
      createDetail('87 Octane', 'Houston Terminal', 'inventory', -0.020, 0.018, 350000),
      createDetail('ULSD', 'Houston Terminal', 'contract', -0.010, 0.032, 250000),
    ],
    terms: {
      volumeCommitment: 600000,
      contractStart: '2026-02-01',
      contractEnd: '2027-01-31',
      allocationPeriod: 'daily',
      ratabilityMin: 85,
      ratabilityMax: 115,
      penaltyCpg: 2.0,
      paymentTerms: 'net-10',
      notes: null,
    },
    rounds: [
      {
        round: 1,
        submittedAt: '2026-01-08T14:00:00Z',
        adjudication: 'advanced',
        adjudicationReason: null,
        adjudicationNotes: null,
        detailSnapshot: [],
      },
      {
        round: 2,
        submittedAt: '2026-01-13T16:00:00Z',
        adjudication: 'won',
        adjudicationReason: 'best-price',
        adjudicationNotes: 'Won on competitive pricing and daily allocation.',
        detailSnapshot: [],
      },
    ],
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },

  // 7. Lost - Pilot
  {
    id: 'srfp-7',
    name: 'Pilot Baton Rouge Diesel',
    buyerId: '101',
    buyerName: 'Pilot Travel Centers',
    deadline: '2026-02-01',
    currentRound: 1,
    status: 'lost',
    details: [
      createDetail('ULSD', 'Baton Rouge Terminal', 'estimated', 0.008, 0.045, 400000),
      createDetail('87 Octane', 'Baton Rouge Terminal', 'estimated', 0.005, 0.025, 200000),
    ],
    terms: {
      volumeCommitment: 600000,
      contractStart: '2026-03-01',
      contractEnd: '2027-02-28',
      allocationPeriod: 'weekly',
      ratabilityMin: 80,
      ratabilityMax: 120,
      penaltyCpg: 1.5,
      paymentTerms: 'net-15',
      notes: null,
    },
    rounds: [
      {
        round: 1,
        submittedAt: '2026-01-28T12:00:00Z',
        adjudication: 'lost',
        adjudicationReason: 'price-too-high',
        adjudicationNotes: 'Incumbent supplier retained with lower differential.',
        detailSnapshot: [],
      },
    ],
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
]

// =============================================================================
// STAT CARD HELPERS
// =============================================================================

export function getActiveCount(rfps: SellerRFP[]): number {
  return rfps.filter((r) => !['won', 'lost'].includes(r.status)).length
}

export function getDueThisWeekCount(rfps: SellerRFP[]): number {
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return rfps.filter((r) => {
    if (['won', 'lost'].includes(r.status)) return false
    const deadline = new Date(r.deadline)
    return deadline >= now && deadline <= weekFromNow
  }).length
}

export function getAwaitingAdjudicationCount(rfps: SellerRFP[]): number {
  return rfps.filter((r) => r.status === 'submitted').length
}

export function getWinRate(rfps: SellerRFP[]): string {
  const won = rfps.filter((r) => r.status === 'won').length
  const lost = rfps.filter((r) => r.status === 'lost').length
  const total = won + lost
  if (total === 0) return '—'
  return `${Math.round((won / total) * 100)}%`
}

export function getAverageMargin(rfps: SellerRFP[]): string {
  const activeRfps = rfps.filter((r) => ['in-progress', 'submitted', 'advanced'].includes(r.status))
  const margins: number[] = []
  for (const rfp of activeRfps) {
    for (const d of rfp.details) {
      if (d.margin !== null) margins.push(d.margin)
    }
  }
  if (margins.length === 0) return '—'
  const avg = margins.reduce((a, b) => a + b, 0) / margins.length
  return `${avg.toFixed(1)}¢`
}

// =============================================================================
// PIPELINE GRID HELPERS
// =============================================================================

export function getProductChips(rfp: SellerRFP): string[] {
  const products = new Set(rfp.details.map((d) => d.product))
  return Array.from(products)
}

export function getTerminalChips(rfp: SellerRFP): string[] {
  const terminals = new Set(rfp.details.map((d) => d.terminal))
  return Array.from(terminals)
}

export function getTotalVolume(rfp: SellerRFP): number {
  return rfp.details.reduce((sum, d) => sum + (d.volume || 0), 0)
}

export function getEstimatedMarginCpg(rfp: SellerRFP): number | null {
  const marginsWithVolume = rfp.details.filter((d) => d.margin !== null && d.volume !== null)
  if (marginsWithVolume.length === 0) return null
  const totalVolume = marginsWithVolume.reduce((s, d) => s + (d.volume || 0), 0)
  if (totalVolume === 0) return null
  const weightedMargin = marginsWithVolume.reduce((s, d) => s + (d.margin || 0) * (d.volume || 0), 0)
  return Math.round((weightedMargin / totalVolume) * 100) / 100
}

// =============================================================================
// PRICE HISTORY DATA (for Analysis tab)
// =============================================================================

export interface PriceHistoryPoint {
  date: string // ISO date
  costPrice: number
  salePrice: number
  rackAverage: number
  margin: number // cpg
}

/**
 * Generate 12 months of daily price history data with realistic seasonal variation.
 * Uses a seeded approach for deterministic results.
 */
export function generatePriceHistory(
  product: string,
  months: number = 12,
): PriceHistoryPoint[] {
  const basePrice = BASE_PRICES[product] || 2.30
  const points: PriceHistoryPoint[] = []
  const endDate = new Date('2026-02-28')
  const startDate = new Date(endDate)
  startDate.setMonth(startDate.getMonth() - months)

  let seed = product.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const seededRandom = () => {
    seed = (seed * 16807 + 0) % 2147483647
    return (seed - 1) / 2147483646
  }

  const current = new Date(startDate)
  let priceOffset = 0

  while (current <= endDate) {
    // Skip weekends
    const dayOfWeek = current.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      current.setDate(current.getDate() + 1)
      continue
    }

    // Seasonal factor (summer premium for gasoline)
    const month = current.getMonth()
    const seasonalFactor = (month >= 4 && month <= 8)
      ? 0.08 * Math.sin(((month - 4) / 4) * Math.PI)
      : -0.03 * Math.sin(((month - 10) / 4) * Math.PI)

    // Random walk
    priceOffset += (seededRandom() - 0.5) * 0.01
    priceOffset = Math.max(-0.15, Math.min(0.15, priceOffset))

    const rackAvg = basePrice + seasonalFactor + priceOffset
    const costSpread = -0.015 + (seededRandom() - 0.5) * 0.005
    const saleSpread = 0.020 + (seededRandom() - 0.5) * 0.008

    const costPrice = rackAvg + costSpread
    const salePrice = rackAvg + saleSpread
    const margin = Math.round((salePrice - costPrice) * 10000) / 100

    points.push({
      date: current.toISOString().split('T')[0],
      costPrice: Math.round(costPrice * 10000) / 10000,
      salePrice: Math.round(salePrice * 10000) / 10000,
      rackAverage: Math.round(rackAvg * 10000) / 10000,
      margin,
    })

    current.setDate(current.getDate() + 1)
  }

  return points
}

// =============================================================================
// MARGIN SENSITIVITY DATA (for Analysis tab)
// =============================================================================

export interface SensitivityRow {
  adjustment: number // cpg adjustment
  newMargin: number // cpg
  monthlyImpact: number // dollars
  isCurrent: boolean
}

export function generateSensitivityData(
  currentMarginCpg: number,
  totalVolume: number,
): SensitivityRow[] {
  return [-3, -2, -1, 0, 1, 2, 3].map((adj) => ({
    adjustment: adj,
    newMargin: Math.round((currentMarginCpg + adj) * 100) / 100,
    monthlyImpact: Math.round(((currentMarginCpg + adj) / 100) * totalVolume),
    isCurrent: adj === 0,
  }))
}

// =============================================================================
// SUPPLY AGREEMENTS (for Contract cost type)
// =============================================================================

export interface SupplyAgreement {
  id: string
  supplierName: string
  terminal: string
  products: string[]
  formula: Formula
  availableVolumePercent: number
}

export const SAMPLE_SUPPLY_AGREEMENTS: SupplyAgreement[] = [
  {
    id: 'sa-1',
    supplierName: 'Marathon Petroleum',
    terminal: 'Houston Terminal',
    products: ['87 Octane', '89 Octane', '93 Octane'],
    formula: createFormula('OPIS', 'CBOB USGC', 'Low', -0.015, 'Marathon Houston Gasoline'),
    availableVolumePercent: 85,
  },
  {
    id: 'sa-2',
    supplierName: 'Valero',
    terminal: 'Houston Terminal',
    products: ['ULSD', 'Kerosene'],
    formula: createFormula('OPIS', 'ULSD USGC', 'Low', -0.010, 'Valero Houston Diesel'),
    availableVolumePercent: 70,
  },
  {
    id: 'sa-3',
    supplierName: 'Phillips 66',
    terminal: 'Pasadena Terminal',
    products: ['87 Octane', '93 Octane'],
    formula: createFormula('OPIS', 'CBOB USGC', 'Low', -0.018, 'P66 Pasadena Gasoline'),
    availableVolumePercent: 90,
  },
  {
    id: 'sa-4',
    supplierName: 'Shell',
    terminal: 'Beaumont Terminal',
    products: ['87 Octane', '89 Octane', '93 Octane', 'ULSD'],
    formula: createFormula('OPIS', 'CBOB USGC', 'Low', -0.012, 'Shell Beaumont Supply'),
    availableVolumePercent: 75,
  },
  {
    id: 'sa-5',
    supplierName: 'Marathon Petroleum',
    terminal: 'Dallas Terminal',
    products: ['87 Octane', '89 Octane', 'ULSD'],
    formula: createFormula('OPIS', 'CBOB USGC', 'Low', -0.020, 'Marathon Dallas Supply'),
    availableVolumePercent: 60,
  },
  {
    id: 'sa-6',
    supplierName: 'Valero',
    terminal: 'Baton Rouge Terminal',
    products: ['87 Octane', 'ULSD', 'Kerosene'],
    formula: createFormula('OPIS', 'CBOB USGC', 'Low', -0.016, 'Valero Baton Rouge Supply'),
    availableVolumePercent: 80,
  },
]

/**
 * Get supply agreements matching a specific terminal and product
 */
export function getMatchingSupplyAgreements(terminal: string, product: string): SupplyAgreement[] {
  return SAMPLE_SUPPLY_AGREEMENTS.filter(
    (sa) => sa.terminal === terminal && sa.products.includes(product),
  )
}

// =============================================================================
// INVENTORY COST FORMULAS (pre-configured per terminal x product)
// =============================================================================

const INVENTORY_COSTS: Record<string, Formula> = {}

// Generate inventory cost formulas for common terminal x product combos
for (const product of SELLER_PRODUCTS) {
  for (const terminal of SELLER_TERMINALS) {
    const pi = PRODUCT_INSTRUMENTS[product]
    if (!pi) continue
    const key = `${terminal}|${product}`
    const diff = -0.020 + (terminal.length + product.length) % 5 * 0.002 // Slight variation
    INVENTORY_COSTS[key] = createFormula(
      'OPIS',
      pi.instrument,
      'Low',
      Math.round(diff * 1000) / 1000,
      `Inventory ${terminal.replace(' Terminal', '')} ${product}`,
    )
  }
}

/**
 * Get pre-configured inventory replacement cost formula for a terminal x product
 */
export function getInventoryCostFormula(terminal: string, product: string): Formula | null {
  return INVENTORY_COSTS[`${terminal}|${product}`] || null
}
