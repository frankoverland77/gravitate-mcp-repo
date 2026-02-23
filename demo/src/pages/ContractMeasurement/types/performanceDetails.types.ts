// Performance Details Tab - Type Definitions
// Product-level performance analysis data

export type PerformanceStatus = 'ahead' | 'on-track' | 'behind' | 'critical'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type Trend = 'improving' | 'declining' | 'stable'
export type BenchmarkVariance = 'above' | 'at' | 'below'

export interface ProductPerformanceRecord {
  id: number
  productName: string
  location: string
  targetVolume: number
  actualVolume: number
  fulfillmentPercentage: number
  dailyAverageLifting: number
  requiredDailyPace: number
  paceVariance: number // percentage difference
  benchmarkPrice: number
  varianceVsBenchmark: number // avg $/gal to 4 decimal places, range -0.0500 to +0.0500
  varianceVsRack: number // avg $/gal to 4 decimal places, range -0.0500 to +0.0500
  benchmarkVariance: BenchmarkVariance
  margin: number // avg $/gal to 4 decimal places, range -0.0250 to +0.2500
  lowerOfImpact: number // total $ revenue loss from rack being lower side of lower-of, always <= 0
  riskScore: number
  riskLevel: RiskLevel
  performanceStatus: PerformanceStatus
  trend: Trend
  trendData: number[] // 30-day sparkline data
}

export interface PerformanceSummary {
  totalDetails: number
  aboveBenchmark: number
  belowBenchmark: number
  volumeLifted: number
  totalMargin: number
  totalProfitability: number
}

export interface DetailedAnalysisData {
  product: ProductPerformanceRecord
  dailyLiftingData: { date: string; actual: number; target: number }[]
  dayOfWeekPattern: { day: string; avgVolume: number }[]
  projectedCompletion: string
  projectedFinalVolume: number
  projectedShortfall: number
  daysToTarget: number
  recommendations: string[]
}

// Filter options
export type GroupBy = 'none' | 'product' | 'location'
export type PerformanceFilter = 'all' | 'underperforming' | 'at-risk' | 'on-track' | 'ahead'
export type RiskFilter = 'all' | 'low' | 'medium' | 'high' | 'critical'
export type VarianceFilter = 'all' | 'above' | 'at' | 'below'

export interface PerformanceFilters {
  search: string
  groupBy: GroupBy
  performance: PerformanceFilter
  risk: RiskFilter
  variance: VarianceFilter
}
