import { useState, useMemo } from 'react'
import { Vertical } from '@gravitate-js/excalibrr'
import {
  PerformanceSummaryTiles,
  ProductPerformanceTable,
  DetailedAnalysisModal,
  PRODUCT_PERFORMANCE_DATA,
  calculatePerformanceSummary,
  getDetailedAnalysisData,
} from '../sections'
import type { ProductPerformanceRecord, DetailedAnalysisData } from '../types/performanceDetails.types'

export function PerformanceDetailsTab() {
  const [modalVisible, setModalVisible] = useState(false)
  const [analysisData, setAnalysisData] = useState<DetailedAnalysisData | null>(null)

  // Calculate summary metrics from data
  const summary = useMemo(() => calculatePerformanceSummary(PRODUCT_PERFORMANCE_DATA), [])

  // Handle row click - open modal with detailed analysis
  const handleRowClick = (record: ProductPerformanceRecord) => {
    const data = getDetailedAnalysisData(record)
    setAnalysisData(data)
    setModalVisible(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setModalVisible(false)
    setAnalysisData(null)
  }

  return (
    <Vertical>
      <PerformanceSummaryTiles summary={summary} />
      <ProductPerformanceTable data={PRODUCT_PERFORMANCE_DATA} onRowClick={handleRowClick} />
      <DetailedAnalysisModal open={modalVisible} onClose={handleCloseModal} data={analysisData} />
    </Vertical>
  )
}
