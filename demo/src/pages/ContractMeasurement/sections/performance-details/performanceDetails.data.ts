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
  benchmarkVariance: item.benchmarkVariance,
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
