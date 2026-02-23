// Performance Details Tab - Mock Data
// Product-level performance analysis data

import type {
  ProductPerformanceRecord,
  PerformanceSummary,
  DetailedAnalysisData,
} from '../../types/performanceDetails.types'
import { generatePerformanceDetails } from '../../../../shared/data'

// Generate performance data from shared products and locations
const generatedData = generatePerformanceDetails(8)

// Map generated data to the expected ProductPerformanceRecord type
export const PRODUCT_PERFORMANCE_DATA: ProductPerformanceRecord[] = generatedData.map((item) => ({
  id: item.id,
  productName: item.productName,
  location: item.location,
  targetVolume: item.targetVolume,
  actualVolume: item.actualVolume,
  fulfillmentPercentage: item.fulfillmentPercentage,
  dailyAverageLifting: item.dailyAverageLifting,
  requiredDailyPace: item.requiredDailyPace,
  paceVariance: item.paceVariance,
  benchmarkPrice: item.benchmarkPrice,
  varianceVsBenchmark: item.varianceVsBenchmark,
  varianceVsRack: item.varianceVsRack,
  benchmarkVariance: item.benchmarkVariance,
  margin: item.margin,
  riskScore: item.riskScore,
  riskLevel: item.riskLevel,
  performanceStatus: item.performanceStatus,
  trend: item.trend,
  trendData: item.trendData,
}))

// Calculate summary from data
export function calculatePerformanceSummary(data: ProductPerformanceRecord[]): PerformanceSummary {
  const totalDetails = data.length
  const aboveBenchmark = data.filter((d) => d.benchmarkVariance === 'above').length
  const belowBenchmark = data.filter((d) => d.benchmarkVariance === 'below').length
  const volumeLifted = data.reduce((sum, d) => sum + d.actualVolume, 0)
  const totalMargin = data.length > 0
    ? data.reduce((sum, d) => sum + d.margin, 0) / data.length
    : 0
  const totalProfitability = data.reduce((sum, d) => sum + d.margin * d.actualVolume, 0)

  return {
    totalDetails,
    aboveBenchmark,
    belowBenchmark,
    volumeLifted,
    totalMargin,
    totalProfitability,
  }
}

// Generate detailed analysis data for a product
export function getDetailedAnalysisData(product: ProductPerformanceRecord): DetailedAnalysisData {
  // Generate mock 30-day lifting data - values normalized to 0-15k range
  const baseSeed = product.id * 137
  const dailyLiftingData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    // Use a hash-like function for more chaotic variance across days
    let daySeed = baseSeed + i * 2654435761
    daySeed = ((daySeed >>> 16) ^ daySeed) * 0x45d9f3b
    daySeed = ((daySeed >>> 16) ^ daySeed) & 0x7fffffff
    // Actual values range 5,000-15,000 with high day-to-day variance
    const actualDaily = 5000 + (daySeed % 10001)
    // Target is a steady line around 10,000
    const targetDaily = 9500 + (baseSeed % 1500)
    return {
      date: date.toISOString().split('T')[0],
      actual: actualDaily,
      target: targetDaily,
    }
  })

  // Day of week pattern - fixed ranges: Mon-Wed ~8-11k, Thu-Fri >12k, Sat-Sun <5k
  const seed = product.id * 137
  const dayOfWeekPattern = [
    { day: 'Mon', avgVolume: 8500 + (seed % 2500) },
    { day: 'Tue', avgVolume: 9000 + ((seed * 3) % 2000) },
    { day: 'Wed', avgVolume: 8200 + ((seed * 7) % 2800) },
    { day: 'Thu', avgVolume: 12200 + ((seed * 11) % 2500) },
    { day: 'Fri', avgVolume: 12500 + ((seed * 13) % 2200) },
    { day: 'Sat', avgVolume: 2500 + ((seed * 17) % 2400) },
    { day: 'Sun', avgVolume: 1800 + ((seed * 19) % 2800) },
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
    recommendations.push(`Review pricing strategy - currently $${Math.abs(product.varianceVsBenchmark).toFixed(4)}/gal below benchmark`)
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
