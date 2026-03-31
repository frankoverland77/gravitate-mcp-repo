import { Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../../ManageOffers.types'
import PriceDiscoveryChart from './PriceDiscoveryChart'
import { Skeleton } from 'antd'

type PriceDiscoveryProps = { data?: SpecialOfferBreakdownResponseData }

export function PriceDiscovery({ data }: PriceDiscoveryProps) {
  if (!data?.PriceDiscovery) return <Skeleton active />

  return (
    <Vertical className='mt-5'>
      <Texto category='h4'>Price Discovery</Texto>
      <Vertical className='info-container'>
        <PriceDiscoveryChart priceDiscovery={data.PriceDiscovery} />
      </Vertical>
    </Vertical>
  )
}
