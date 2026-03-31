import { Texto } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../ManageOffers.types'
import { fmt } from '../../../../utils/formatters'
import { Card } from 'antd'

const { Meta } = Card

type ReservePriceProps = {
  data: SpecialOfferBreakdownResponseData
}

export function Price({ data }: ReservePriceProps) {
  const offer = data?.OfferInfo
  const indexDisplay = offer?.IndexOfferDisplay

  if (indexDisplay) {
    return (
      <div className='offer-info-item'>
        <Card className='offer-info-card'>
          <Meta
            title='Formula'
            description={<span className='formula-string-mono'>{offer?.IndexOfferDisplay?.FormulaString}</span>}
          />
        </Card>
      </div>
    )
  }

  const isFixedPricing = offer?.PricingMechanismName === 'Fixed'

  if (isFixedPricing) {
    if (!offer?.FixedPrice) return null
    return (
      <div className='offer-info-item'>
        <Card className='offer-info-card'>
          <Meta title='Fixed Price' description={<Texto category='h4'>{fmt.currency(offer.FixedPrice)}</Texto>} />
        </Card>
      </div>
    )
  }

  if (!offer?.ReservePrice) return null

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card'>
        <Meta title='Reserve Price' description={<Texto category='h4'>{fmt.currency(offer.ReservePrice)}</Texto>} />
      </Card>
    </div>
  )
}
