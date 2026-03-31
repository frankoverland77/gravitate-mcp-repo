import type { SpecialOfferBreakdownResponseData } from '../../../../ManageOffers.types'
import { BidResponses } from './BidResponses/BidResponses'
import { CustomerEngagementFunnel } from './CustomerEngagementFunnel/CustomerEngagementFunnel'
import { PriceDiscovery } from './PriceDiscovery/PriceDiscovery'
import { VolumeAnalysis } from './VolumeAnalysis/VolumeAnalysis'

type EngagementViewProps = {
  loading: boolean
  data?: SpecialOfferBreakdownResponseData
}

export function EngagementView({ data, loading }: EngagementViewProps) {
  return (
    <div className='mt-4'>
      <CustomerEngagementFunnel data={data} />
      <PriceDiscovery data={data} />
      <VolumeAnalysis data={data} />
      <BidResponses data={data} loading={loading} />
    </div>
  )
}
