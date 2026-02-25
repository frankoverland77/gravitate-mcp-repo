// ============================================================================
// PRICE ELASTICITY TYPES
// ============================================================================

export interface ElasticityDataPoint {
  pricePosition: number // relative to benchmark (e.g., -0.05 = 5 cents below)
  volumeResponse: number // normalized volume (0-100 scale)
  margin: number
  period: string
  product: string
  terminal: string
  customer?: string
}

export interface ElasticityCurveParams {
  elasticityCoefficient: number
  rSquared: number
  cliffThreshold: number // price position where volume drops sharply
  optimalPricePoint: number // price position that maximizes margin * volume
  sampleSize: number
  calculationDate: string
  observationPeriodStart: string
  observationPeriodEnd: string
  confidenceLevel: 'high' | 'moderate' | 'low'
}

export interface FittedCurvePoint {
  pricePosition: number
  fittedVolume: number
  confidenceUpper: number
  confidenceLower: number
  zone: 'optimal' | 'caution' | 'danger'
}

export interface CustomerElasticityRow {
  counterPartyId: number
  counterParty: string
  counterPartyTotalQuantity: number
  avgBoLsPerWeek: number
  avgDeltaToQuote: number
  avgInvoicedMargin: number
  avgQuotedMargin: number
  avgPercentDiscount: number
  avgMarginLostToDiscount: number
  totalProfitsLostToDiscount: number
  counterPartyAvgLiftingSize: number
  sharePercentage: number
  // Elasticity-specific fields
  elasticityCoefficient: number
  sensitivityRating: 'high' | 'moderate' | 'low'
  cliffThreshold: number
  optimalPrice: number
  currentPricePosition: number
}

export interface CustomerLiftingsTotals {
  totalVolume: number
  strategyDelta: number
  totalDiscounted: number
  activeCustomers: number
}

export interface WhatIfProjection {
  pricePosition: number
  projectedVolume: number
  projectedMargin: number
  projectedRevenue: number
}

export interface TerminalComparisonRow {
  terminalId: number
  terminal: string
  product: string
  elasticityCoefficient: number
  cliffThreshold: number
  optimalPrice: number
  currentPrice: number
  rSquared: number
  sampleSize: number
  confidenceLevel: 'high' | 'moderate' | 'low'
  sparklineData: FittedCurvePoint[]
}

export type SegmentationLevel = 'product' | 'product-terminal' | 'product-customer'
