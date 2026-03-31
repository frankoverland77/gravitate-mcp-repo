import { InfoCircleOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../../ManageOffers.types'
import { addCommasToNumber } from '../../../../../utils/formatters'

type VolumeAnalysisStatusBannerProps = {
  data: SpecialOfferBreakdownResponseData
}

export function VolumeAnalysisStatusBanner({ data }: VolumeAnalysisStatusBannerProps) {
  const totalBidAmount =
    data?.SubmittedOrders.filter((o) => o.OrderStatus === 'Pending').reduce((a, b) => a + b.OrderVolume, 0) ?? 0
  const acceptedVolumeAmount =
    data?.SubmittedOrders.filter((o) => o.OrderStatus === 'Accepted').reduce((a, b) => a + b.OrderVolume, 0) ?? 0

  const remainingCapacity = data?.VolumeAnalysis?.RemainingVolume ?? 0
  const totalAvailable = data?.VolumeAnalysis?.TotalVolume ?? 0

  const pendingOrdersAvailable = data?.SubmittedOrders.some((o) => o.OrderStatus === 'Pending')
  const showBanner = acceptedVolumeAmount + totalBidAmount > totalAvailable && pendingOrdersAvailable

  const exceedAmount = showBanner ? Math.abs(totalAvailable - (acceptedVolumeAmount + totalBidAmount)) : 0

  if (!showBanner) {
    return null
  }

  return (
    <Horizontal className='volume-analysis-status-banner-container' verticalCenter>
      <Texto className='mr-2'>
        <InfoCircleOutlined />
      </Texto>
      <Texto>
        Accepting all pending bids would exceed capacity by {addCommasToNumber(exceedAmount)} gal(s). You can accept up
        to {addCommasToNumber(remainingCapacity)} gal(s) more.
      </Texto>
    </Horizontal>
  )
}
