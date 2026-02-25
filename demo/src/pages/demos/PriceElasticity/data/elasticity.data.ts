import type {
  CustomerElasticityRow,
  CustomerLiftingsTotals,
  ElasticityDataPoint,
  ElasticityCurveParams,
  FittedCurvePoint,
  TerminalComparisonRow,
} from './elasticity.types'

// ============================================================================
// SEEDED NOISE (deterministic randomness for demo data)
// ============================================================================

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// ============================================================================
// FITTED CURVE GENERATOR
// ============================================================================

export function generateFittedCurve(
  elasticity: number,
  cliffThreshold: number,
  sampleSize: number,
): FittedCurvePoint[] {
  const points: FittedCurvePoint[] = []
  const steps = 60

  for (let i = 0; i <= steps; i++) {
    const pricePosition = -0.15 + (i / steps) * 0.30

    // Log-log demand curve with cliff effect
    let fittedVolume: number
    if (pricePosition < cliffThreshold) {
      // Normal elasticity region
      fittedVolume = 75 + elasticity * pricePosition * 100
    } else {
      // Cliff region - volume drops exponentially
      const distancePastCliff = pricePosition - cliffThreshold
      const normalVolume = 75 + elasticity * cliffThreshold * 100
      fittedVolume = normalVolume * Math.exp(-distancePastCliff * 25)
    }

    fittedVolume = Math.max(0, Math.min(100, fittedVolume))

    // Confidence bands widen with fewer data points and at extremes
    const baseConfidence = 30 / Math.sqrt(sampleSize)
    const extremePenalty = 1 + Math.abs(pricePosition) * 8
    const bandwidth = baseConfidence * extremePenalty

    const zone: FittedCurvePoint['zone'] =
      pricePosition >= cliffThreshold
        ? 'danger'
        : pricePosition >= cliffThreshold - 0.03
          ? 'caution'
          : 'optimal'

    points.push({
      pricePosition: Number(pricePosition.toFixed(4)),
      fittedVolume: Number(fittedVolume.toFixed(1)),
      confidenceUpper: Number(Math.min(100, fittedVolume + bandwidth).toFixed(1)),
      confidenceLower: Number(Math.max(0, fittedVolume - bandwidth).toFixed(1)),
      zone,
    })
  }

  return points
}

// ============================================================================
// RAW DATA POINTS (scatter observations)
// ============================================================================

export function generateScatterData(
  elasticity: number,
  cliffThreshold: number,
  sampleSize: number,
  seedOffset: number,
): ElasticityDataPoint[] {
  const points: ElasticityDataPoint[] = []

  for (let i = 0; i < sampleSize; i++) {
    const pricePosition = -0.12 + seededRandom(i + seedOffset) * 0.24
    let baseVolume: number

    if (pricePosition < cliffThreshold) {
      baseVolume = 75 + elasticity * pricePosition * 100
    } else {
      const distancePastCliff = pricePosition - cliffThreshold
      const normalVolume = 75 + elasticity * cliffThreshold * 100
      baseVolume = normalVolume * Math.exp(-distancePastCliff * 25)
    }

    const noise = (seededRandom(i * 3 + seedOffset + 777) - 0.5) * 15
    const volume = Math.max(0, Math.min(100, baseVolume + noise))
    const margin = 0.04 + pricePosition * 0.8

    points.push({
      pricePosition: Number(pricePosition.toFixed(4)),
      volumeResponse: Number(volume.toFixed(1)),
      margin: Number(margin.toFixed(4)),
      period: `2025-W${String(Math.floor(i / 2) + 1).padStart(2, '0')}`,
      product: 'ULSD',
      terminal: 'Baltimore',
    })
  }

  return points
}

// ============================================================================
// CURVE PARAMETERS FOR DIFFERENT CONTEXTS
// ============================================================================

export const PRODUCT_CURVE_PARAMS: ElasticityCurveParams = {
  elasticityCoefficient: -1.85,
  rSquared: 0.72,
  cliffThreshold: 0.06,
  optimalPricePoint: 0.025,
  sampleSize: 48,
  calculationDate: '2026-02-20',
  observationPeriodStart: '2025-02-01',
  observationPeriodEnd: '2026-02-15',
  confidenceLevel: 'high',
}

export const CUSTOMER_CURVE_PARAMS: Record<string, ElasticityCurveParams> = {
  'Acme Fuel Co': {
    elasticityCoefficient: -2.4,
    rSquared: 0.81,
    cliffThreshold: 0.045,
    optimalPricePoint: 0.018,
    sampleSize: 36,
    calculationDate: '2026-02-20',
    observationPeriodStart: '2025-04-01',
    observationPeriodEnd: '2026-02-15',
    confidenceLevel: 'high',
  },
  'Metro Petroleum': {
    elasticityCoefficient: -1.2,
    rSquared: 0.65,
    cliffThreshold: 0.09,
    optimalPricePoint: 0.04,
    sampleSize: 28,
    calculationDate: '2026-02-20',
    observationPeriodStart: '2025-06-01',
    observationPeriodEnd: '2026-02-15',
    confidenceLevel: 'moderate',
  },
  'Eastern Transport': {
    elasticityCoefficient: -3.1,
    rSquared: 0.58,
    cliffThreshold: 0.035,
    optimalPricePoint: 0.012,
    sampleSize: 18,
    calculationDate: '2026-02-20',
    observationPeriodStart: '2025-08-01',
    observationPeriodEnd: '2026-02-15',
    confidenceLevel: 'moderate',
  },
  'Harbor Logistics': {
    elasticityCoefficient: -0.8,
    rSquared: 0.42,
    cliffThreshold: 0.12,
    optimalPricePoint: 0.06,
    sampleSize: 10,
    calculationDate: '2026-02-20',
    observationPeriodStart: '2025-10-01',
    observationPeriodEnd: '2026-02-15',
    confidenceLevel: 'low',
  },
  'Tri-State Energy': {
    elasticityCoefficient: -2.0,
    rSquared: 0.74,
    cliffThreshold: 0.055,
    optimalPricePoint: 0.022,
    sampleSize: 42,
    calculationDate: '2026-02-20',
    observationPeriodStart: '2025-03-01',
    observationPeriodEnd: '2026-02-15',
    confidenceLevel: 'high',
  },
  'Northeast Fuels': {
    elasticityCoefficient: -1.5,
    rSquared: 0.69,
    cliffThreshold: 0.07,
    optimalPricePoint: 0.032,
    sampleSize: 32,
    calculationDate: '2026-02-20',
    observationPeriodStart: '2025-05-01',
    observationPeriodEnd: '2026-02-15',
    confidenceLevel: 'high',
  },
}

// ============================================================================
// CUSTOMER LIFTINGS GRID DATA
// ============================================================================

export const MOCK_CUSTOMER_TOTALS: CustomerLiftingsTotals = {
  totalVolume: 4285000,
  strategyDelta: -0.0234,
  totalDiscounted: 18420,
  activeCustomers: 12,
}

export const MOCK_CUSTOMER_ROWS: CustomerElasticityRow[] = [
  {
    counterPartyId: 1,
    counterParty: 'Acme Fuel Co',
    counterPartyTotalQuantity: 892000,
    avgBoLsPerWeek: 14.2,
    avgDeltaToQuote: -0.0180,
    avgInvoicedMargin: 0.0412,
    avgQuotedMargin: 0.0520,
    avgPercentDiscount: 4.2,
    avgMarginLostToDiscount: 0.0108,
    totalProfitsLostToDiscount: 9633,
    counterPartyAvgLiftingSize: 8200,
    sharePercentage: 20.8,
    elasticityCoefficient: -2.4,
    sensitivityRating: 'high',
    cliffThreshold: 0.045,
    optimalPrice: 0.018,
    currentPricePosition: 0.032,
  },
  {
    counterPartyId: 2,
    counterParty: 'Metro Petroleum',
    counterPartyTotalQuantity: 654000,
    avgBoLsPerWeek: 9.8,
    avgDeltaToQuote: -0.0120,
    avgInvoicedMargin: 0.0380,
    avgQuotedMargin: 0.0460,
    avgPercentDiscount: 2.8,
    avgMarginLostToDiscount: 0.0080,
    totalProfitsLostToDiscount: 5232,
    counterPartyAvgLiftingSize: 7500,
    sharePercentage: 15.3,
    elasticityCoefficient: -1.2,
    sensitivityRating: 'low',
    cliffThreshold: 0.09,
    optimalPrice: 0.04,
    currentPricePosition: 0.055,
  },
  {
    counterPartyId: 3,
    counterParty: 'Eastern Transport',
    counterPartyTotalQuantity: 438000,
    avgBoLsPerWeek: 6.1,
    avgDeltaToQuote: -0.0340,
    avgInvoicedMargin: 0.0290,
    avgQuotedMargin: 0.0480,
    avgPercentDiscount: 6.1,
    avgMarginLostToDiscount: 0.0190,
    totalProfitsLostToDiscount: 8322,
    counterPartyAvgLiftingSize: 6800,
    sharePercentage: 10.2,
    elasticityCoefficient: -3.1,
    sensitivityRating: 'high',
    cliffThreshold: 0.035,
    optimalPrice: 0.012,
    currentPricePosition: 0.028,
  },
  {
    counterPartyId: 4,
    counterParty: 'Harbor Logistics',
    counterPartyTotalQuantity: 325000,
    avgBoLsPerWeek: 4.5,
    avgDeltaToQuote: -0.0060,
    avgInvoicedMargin: 0.0510,
    avgQuotedMargin: 0.0540,
    avgPercentDiscount: 1.2,
    avgMarginLostToDiscount: 0.0030,
    totalProfitsLostToDiscount: 975,
    counterPartyAvgLiftingSize: 9200,
    sharePercentage: 7.6,
    elasticityCoefficient: -0.8,
    sensitivityRating: 'low',
    cliffThreshold: 0.12,
    optimalPrice: 0.06,
    currentPricePosition: 0.048,
  },
  {
    counterPartyId: 5,
    counterParty: 'Tri-State Energy',
    counterPartyTotalQuantity: 780000,
    avgBoLsPerWeek: 11.5,
    avgDeltaToQuote: -0.0210,
    avgInvoicedMargin: 0.0350,
    avgQuotedMargin: 0.0490,
    avgPercentDiscount: 3.5,
    avgMarginLostToDiscount: 0.0140,
    totalProfitsLostToDiscount: 10920,
    counterPartyAvgLiftingSize: 7800,
    sharePercentage: 18.2,
    elasticityCoefficient: -2.0,
    sensitivityRating: 'moderate',
    cliffThreshold: 0.055,
    optimalPrice: 0.022,
    currentPricePosition: 0.038,
  },
  {
    counterPartyId: 6,
    counterParty: 'Northeast Fuels',
    counterPartyTotalQuantity: 590000,
    avgBoLsPerWeek: 8.2,
    avgDeltaToQuote: -0.0150,
    avgInvoicedMargin: 0.0420,
    avgQuotedMargin: 0.0510,
    avgPercentDiscount: 2.4,
    avgMarginLostToDiscount: 0.0090,
    totalProfitsLostToDiscount: 5310,
    counterPartyAvgLiftingSize: 8500,
    sharePercentage: 13.8,
    elasticityCoefficient: -1.5,
    sensitivityRating: 'moderate',
    cliffThreshold: 0.07,
    optimalPrice: 0.032,
    currentPricePosition: 0.045,
  },
  {
    counterPartyId: 7,
    counterParty: 'Summit Distributors',
    counterPartyTotalQuantity: 210000,
    avgBoLsPerWeek: 3.2,
    avgDeltaToQuote: -0.0090,
    avgInvoicedMargin: 0.0480,
    avgQuotedMargin: 0.0530,
    avgPercentDiscount: 1.8,
    avgMarginLostToDiscount: 0.0050,
    totalProfitsLostToDiscount: 1050,
    counterPartyAvgLiftingSize: 7100,
    sharePercentage: 4.9,
    elasticityCoefficient: -1.1,
    sensitivityRating: 'low',
    cliffThreshold: 0.10,
    optimalPrice: 0.05,
    currentPricePosition: 0.042,
  },
  {
    counterPartyId: 8,
    counterParty: 'Coastal Energy Partners',
    counterPartyTotalQuantity: 396000,
    avgBoLsPerWeek: 5.8,
    avgDeltaToQuote: -0.0280,
    avgInvoicedMargin: 0.0310,
    avgQuotedMargin: 0.0470,
    avgPercentDiscount: 5.0,
    avgMarginLostToDiscount: 0.0160,
    totalProfitsLostToDiscount: 6336,
    counterPartyAvgLiftingSize: 6500,
    sharePercentage: 9.2,
    elasticityCoefficient: -2.7,
    sensitivityRating: 'high',
    cliffThreshold: 0.04,
    optimalPrice: 0.015,
    currentPricePosition: 0.033,
  },
]

// ============================================================================
// TERMINAL COMPARISON DATA
// ============================================================================

export const MOCK_TERMINAL_COMPARISON: TerminalComparisonRow[] = [
  {
    terminalId: 1,
    terminal: 'Baltimore',
    product: 'ULSD',
    elasticityCoefficient: -1.85,
    cliffThreshold: 0.06,
    optimalPrice: 0.025,
    currentPrice: 0.038,
    rSquared: 0.72,
    sampleSize: 48,
    confidenceLevel: 'high',
    sparklineData: generateFittedCurve(-1.85, 0.06, 48),
  },
  {
    terminalId: 2,
    terminal: 'Philadelphia',
    product: 'ULSD',
    elasticityCoefficient: -2.2,
    cliffThreshold: 0.05,
    optimalPrice: 0.02,
    currentPrice: 0.042,
    rSquared: 0.78,
    sampleSize: 52,
    confidenceLevel: 'high',
    sparklineData: generateFittedCurve(-2.2, 0.05, 52),
  },
  {
    terminalId: 3,
    terminal: 'Newark',
    product: 'ULSD',
    elasticityCoefficient: -1.4,
    cliffThreshold: 0.08,
    optimalPrice: 0.035,
    currentPrice: 0.055,
    rSquared: 0.65,
    sampleSize: 38,
    confidenceLevel: 'moderate',
    sparklineData: generateFittedCurve(-1.4, 0.08, 38),
  },
  {
    terminalId: 4,
    terminal: 'New Haven',
    product: 'ULSD',
    elasticityCoefficient: -3.0,
    cliffThreshold: 0.035,
    optimalPrice: 0.012,
    currentPrice: 0.025,
    rSquared: 0.56,
    sampleSize: 22,
    confidenceLevel: 'moderate',
    sparklineData: generateFittedCurve(-3.0, 0.035, 22),
  },
  {
    terminalId: 5,
    terminal: 'Albany',
    product: 'ULSD',
    elasticityCoefficient: -0.9,
    cliffThreshold: 0.11,
    optimalPrice: 0.055,
    currentPrice: 0.062,
    rSquared: 0.48,
    sampleSize: 14,
    confidenceLevel: 'low',
    sparklineData: generateFittedCurve(-0.9, 0.11, 14),
  },
  {
    terminalId: 6,
    terminal: 'Linden',
    product: 'ULSD',
    elasticityCoefficient: -1.7,
    cliffThreshold: 0.065,
    optimalPrice: 0.028,
    currentPrice: 0.044,
    rSquared: 0.70,
    sampleSize: 44,
    confidenceLevel: 'high',
    sparklineData: generateFittedCurve(-1.7, 0.065, 44),
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getConfidenceBadge(level: 'high' | 'moderate' | 'low'): {
  label: string
  color: string
} {
  switch (level) {
    case 'high':
      return { label: 'High Confidence', color: '#52c41a' }
    case 'moderate':
      return { label: 'Moderate', color: '#faad14' }
    case 'low':
      return { label: 'Low Confidence', color: '#ff4d4f' }
  }
}

export function getSensitivityColor(rating: 'high' | 'moderate' | 'low'): string {
  switch (rating) {
    case 'high':
      return '#ff4d4f'
    case 'moderate':
      return '#faad14'
    case 'low':
      return '#52c41a'
  }
}

export function formatCents(value: number): string {
  return `${(value * 100).toFixed(1)}c`
}

export function formatPricePosition(value: number): string {
  const cents = value * 100
  return cents >= 0 ? `+${cents.toFixed(1)}c` : `${cents.toFixed(1)}c`
}

export function numberToShortString(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toFixed(0)
}
