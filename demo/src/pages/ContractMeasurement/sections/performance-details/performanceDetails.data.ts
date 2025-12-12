// Performance Details Tab - Mock Data
// Product-level performance analysis data

import type {
  ProductPerformanceRecord,
  PerformanceSummary,
  DetailedAnalysisData,
} from '../../types/performanceDetails.types'

export const PRODUCT_PERFORMANCE_DATA: ProductPerformanceRecord[] = [
  {
    id: 1,
    productName: 'Regular Unleaded',
    location: 'Houston Terminal',
    targetVolume: 250000,
    actualVolume: 220000,
    fulfillmentPercentage: 88,
    dailyAverageLifting: 8500,
    requiredDailyPace: 9200,
    paceVariance: -7.6,
    benchmarkPrice: 2.45,
    varianceVsBenchmark: 3.2,
    benchmarkVariance: 'above',
    riskScore: 42,
    riskLevel: 'medium',
    performanceStatus: 'behind',
    trend: 'improving',
    trendData: [85, 86, 84, 87, 86, 88, 87, 89, 88, 90, 89, 91, 90, 92, 91, 93, 92, 94, 93, 95, 94, 96, 95, 97, 96, 98, 97, 99, 98, 100],
  },
  {
    id: 2,
    productName: 'Premium Unleaded',
    location: 'Houston Terminal',
    targetVolume: 180000,
    actualVolume: 195000,
    fulfillmentPercentage: 108,
    dailyAverageLifting: 7500,
    requiredDailyPace: 6800,
    paceVariance: 10.3,
    benchmarkPrice: 2.89,
    varianceVsBenchmark: 5.8,
    benchmarkVariance: 'above',
    riskScore: 15,
    riskLevel: 'low',
    performanceStatus: 'ahead',
    trend: 'stable',
    trendData: [105, 106, 107, 106, 108, 107, 109, 108, 110, 109, 108, 109, 110, 109, 108, 109, 110, 109, 108, 109, 110, 109, 108, 109, 110, 109, 108, 109, 108, 108],
  },
  {
    id: 3,
    productName: 'Diesel #2',
    location: 'Houston Terminal',
    targetVolume: 300000,
    actualVolume: 280000,
    fulfillmentPercentage: 93,
    dailyAverageLifting: 11200,
    requiredDailyPace: 11500,
    paceVariance: -2.6,
    benchmarkPrice: 2.68,
    varianceVsBenchmark: -1.5,
    benchmarkVariance: 'below',
    riskScore: 28,
    riskLevel: 'low',
    performanceStatus: 'on-track',
    trend: 'stable',
    trendData: [92, 93, 92, 93, 94, 93, 94, 93, 94, 93, 94, 93, 94, 93, 94, 93, 94, 93, 94, 93, 94, 93, 94, 93, 94, 93, 94, 93, 93, 93],
  },
  {
    id: 4,
    productName: 'Regular Unleaded',
    location: 'Dallas Terminal',
    targetVolume: 200000,
    actualVolume: 145000,
    fulfillmentPercentage: 72.5,
    dailyAverageLifting: 5800,
    requiredDailyPace: 8200,
    paceVariance: -29.3,
    benchmarkPrice: 2.42,
    varianceVsBenchmark: -4.2,
    benchmarkVariance: 'below',
    riskScore: 78,
    riskLevel: 'high',
    performanceStatus: 'critical',
    trend: 'declining',
    trendData: [80, 79, 78, 77, 76, 75, 74, 73, 74, 73, 72, 73, 72, 71, 72, 71, 70, 71, 72, 71, 72, 73, 72, 73, 72, 73, 72, 73, 72.5, 72.5],
  },
  {
    id: 5,
    productName: 'Premium Unleaded',
    location: 'Dallas Terminal',
    targetVolume: 150000,
    actualVolume: 160000,
    fulfillmentPercentage: 106.7,
    dailyAverageLifting: 6100,
    requiredDailyPace: 5700,
    paceVariance: 7.0,
    benchmarkPrice: 2.92,
    varianceVsBenchmark: 0.0,
    benchmarkVariance: 'at',
    riskScore: 12,
    riskLevel: 'low',
    performanceStatus: 'ahead',
    trend: 'improving',
    trendData: [102, 103, 102, 104, 103, 105, 104, 106, 105, 107, 106, 108, 107, 109, 108, 106, 105, 106, 107, 106, 107, 106, 107, 106, 107, 106, 107, 106, 106.7, 106.7],
  },
  {
    id: 6,
    productName: 'Diesel #2',
    location: 'Dallas Terminal',
    targetVolume: 220000,
    actualVolume: 198000,
    fulfillmentPercentage: 90,
    dailyAverageLifting: 7800,
    requiredDailyPace: 8500,
    paceVariance: -8.2,
    benchmarkPrice: 2.71,
    varianceVsBenchmark: 2.1,
    benchmarkVariance: 'above',
    riskScore: 35,
    riskLevel: 'medium',
    performanceStatus: 'behind',
    trend: 'stable',
    trendData: [89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 89, 90, 90, 90],
  },
  {
    id: 7,
    productName: 'Kerosene',
    location: 'Houston Terminal',
    targetVolume: 80000,
    actualVolume: 62000,
    fulfillmentPercentage: 77.5,
    dailyAverageLifting: 2400,
    requiredDailyPace: 3200,
    paceVariance: -25.0,
    benchmarkPrice: 2.95,
    varianceVsBenchmark: -6.8,
    benchmarkVariance: 'below',
    riskScore: 68,
    riskLevel: 'high',
    performanceStatus: 'behind',
    trend: 'declining',
    trendData: [82, 81, 80, 81, 80, 79, 80, 79, 78, 79, 78, 77, 78, 77, 78, 77, 78, 77, 78, 77, 78, 77, 78, 77, 78, 77, 78, 77, 77.5, 77.5],
  },
  {
    id: 8,
    productName: 'E85',
    location: 'Austin Terminal',
    targetVolume: 45000,
    actualVolume: 48500,
    fulfillmentPercentage: 107.8,
    dailyAverageLifting: 1850,
    requiredDailyPace: 1700,
    paceVariance: 8.8,
    benchmarkPrice: 2.15,
    varianceVsBenchmark: 4.5,
    benchmarkVariance: 'above',
    riskScore: 8,
    riskLevel: 'low',
    performanceStatus: 'ahead',
    trend: 'improving',
    trendData: [100, 101, 102, 103, 104, 103, 104, 105, 106, 105, 106, 107, 106, 107, 108, 107, 108, 107, 108, 107, 108, 107, 108, 107, 108, 107, 108, 107, 107.8, 107.8],
  },
]

// Calculate summary from data
export function calculatePerformanceSummary(data: ProductPerformanceRecord[]): PerformanceSummary {
  const totalDetails = data.length
  const aboveBenchmark = data.filter((d) => d.benchmarkVariance === 'above').length
  const atBenchmark = data.filter((d) => d.benchmarkVariance === 'at').length
  const belowBenchmark = data.filter((d) => d.benchmarkVariance === 'below').length
  const avgPerformance = data.reduce((sum, d) => sum + d.fulfillmentPercentage, 0) / totalDetails
  const underPerforming = data.filter((d) => d.performanceStatus === 'behind' || d.performanceStatus === 'critical').length
  const atRisk = data.filter((d) => d.riskLevel === 'high' || d.riskLevel === 'critical').length

  return {
    totalDetails,
    aboveBenchmark,
    atBenchmark,
    belowBenchmark,
    avgPerformance,
    underPerforming,
    atRisk,
  }
}

// Generate detailed analysis data for a product
export function getDetailedAnalysisData(product: ProductPerformanceRecord): DetailedAnalysisData {
  // Generate mock 30-day lifting data
  const dailyLiftingData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const targetDaily = product.requiredDailyPace
    const actualDaily = product.dailyAverageLifting + Math.floor((Math.random() - 0.5) * 2000)
    return {
      date: date.toISOString().split('T')[0],
      actual: Math.max(0, actualDaily),
      target: targetDaily,
    }
  })

  // Day of week pattern
  const dayOfWeekPattern = [
    { day: 'Mon', avgVolume: Math.floor(product.dailyAverageLifting * 1.1) },
    { day: 'Tue', avgVolume: Math.floor(product.dailyAverageLifting * 1.05) },
    { day: 'Wed', avgVolume: Math.floor(product.dailyAverageLifting * 1.02) },
    { day: 'Thu', avgVolume: Math.floor(product.dailyAverageLifting * 0.98) },
    { day: 'Fri', avgVolume: Math.floor(product.dailyAverageLifting * 0.95) },
    { day: 'Sat', avgVolume: Math.floor(product.dailyAverageLifting * 0.7) },
    { day: 'Sun', avgVolume: Math.floor(product.dailyAverageLifting * 0.6) },
  ]

  // Calculate projections
  const remainingVolume = product.targetVolume - product.actualVolume
  const daysToTarget = remainingVolume > 0 ? Math.ceil(remainingVolume / product.dailyAverageLifting) : 0
  const projectedFinalVolume = product.actualVolume + (product.dailyAverageLifting * 30) // 30 more days
  const projectedShortfall = Math.max(0, product.targetVolume - projectedFinalVolume)

  const projectedDate = new Date()
  projectedDate.setDate(projectedDate.getDate() + daysToTarget)

  // Generate recommendations based on status
  const recommendations: string[] = []
  if (product.performanceStatus === 'critical' || product.performanceStatus === 'behind') {
    recommendations.push(`Increase daily lifting rate by ${Math.abs(product.paceVariance).toFixed(1)}% to meet target`)
  }
  if (product.benchmarkVariance === 'below') {
    recommendations.push(`Review pricing strategy - currently ${Math.abs(product.varianceVsBenchmark).toFixed(1)}¢ below benchmark`)
  }
  if (product.riskLevel === 'high' || product.riskLevel === 'critical') {
    recommendations.push('Schedule review meeting with customer to discuss fulfillment concerns')
  }
  if (product.trend === 'declining') {
    recommendations.push('Investigate root cause of declining trend over past 30 days')
  }
  if (recommendations.length === 0) {
    recommendations.push('Continue current pace - performance is on track')
  }

  return {
    product,
    dailyLiftingData,
    dayOfWeekPattern,
    projectedCompletion: projectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    projectedFinalVolume,
    projectedShortfall,
    daysToTarget,
    recommendations,
  }
}
