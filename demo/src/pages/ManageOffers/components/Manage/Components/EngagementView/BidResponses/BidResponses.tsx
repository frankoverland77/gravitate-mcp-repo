import { Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../../ManageOffers.types'
import { BidResponsesGrid } from './BidResponsesGrid'
import { Skeleton } from 'antd'

type BidResponsesProps = { data?: SpecialOfferBreakdownResponseData; loading: boolean }

export function BidResponses({ data, loading }: BidResponsesProps) {
  if (!data?.SubmittedOrders) return <Skeleton active />

  return (
    <Vertical className='mt-5'>
      <Texto category='h4'>Bid Responses</Texto>
      <Vertical className='mt-3'>
        <BidResponsesGrid
          rowData={data.SubmittedOrders}
          loading={loading}
          reservePrice={data.OfferInfo?.ReservePrice}
        />
      </Vertical>
    </Vertical>
  )
}
