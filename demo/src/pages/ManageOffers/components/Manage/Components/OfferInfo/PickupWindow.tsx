import { CalendarOutlined } from '@ant-design/icons'
import type { SpecialOfferBreakdownResponseData } from '../../../../ManageOffers.types'
import { formatDateTimeRange } from '../../../../utils/Utils/OfferInfoHelpers'
import { Card } from 'antd'
import dayjs from 'dayjs'

const { Meta } = Card

type PickupWindowProps = {
  data: SpecialOfferBreakdownResponseData
}

export function PickupWindow({ data }: PickupWindowProps) {
  const offer = data.OfferInfo

  const effStart = dayjs(offer.OrderEffectiveStartDateTime)
  const effEnd = dayjs(offer.OrderEffectiveEndDateTime)

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card offer-info-card--accent'>
        <Meta
          avatar={<CalendarOutlined style={{ fontSize: 18 }} />}
          title='Pickup Window'
          description={formatDateTimeRange(effStart, effEnd)}
        />
      </Card>
    </div>
  )
}
