import { GraviGrid } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownSubmittedOrder } from '../../../../../ManageOffers.types'
import { BidResponsesColumns } from './BidResponsesColumnDef'
import { notification } from 'antd'
import { useMemo } from 'react'

type BidResponsesGridProps = {
  rowData?: SpecialOfferBreakdownSubmittedOrder[]
  loading?: boolean
  reservePrice?: number
}

export function BidResponsesGrid({ rowData, loading, reservePrice }: BidResponsesGridProps) {
  const handleApprove = async (row: SpecialOfferBreakdownSubmittedOrder) => {
    // Mock approve
    notification.success({
      message: 'Bid Accepted',
      description: `The bid from ${row.CustomerName} has been accepted`,
    })
  }

  const handleReject = async (row: SpecialOfferBreakdownSubmittedOrder) => {
    // Mock reject
    notification.success({
      message: 'Bid Rejected',
      description: `The bid from ${row.CustomerName} has been rejected`,
    })
  }

  const controlBarProps = useMemo(
    () => ({
      title: '',
      hideActiveFilters: false,
    }),
    []
  )

  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId: (row: any) => row.data.TradeEntryId?.toString(),
    }),
    []
  )

  const getColumnDefs = useMemo(() => {
    return BidResponsesColumns({ onApprove: handleApprove, onReject: handleReject, reservePrice })
  }, [rowData, reservePrice])

  return (
    <div style={{ height: '400px' }}>
      <GraviGrid
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        columnDefs={getColumnDefs}
        rowData={rowData}
        loading={loading}
      />
    </div>
  )
}
