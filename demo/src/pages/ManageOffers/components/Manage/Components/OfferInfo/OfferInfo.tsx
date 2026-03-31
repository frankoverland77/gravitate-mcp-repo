import '../../../../styles.css'

import { ClockCircleOutlined, SendOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOffer, SpecialOfferBreakdownResponseData } from '../../../../ManageOffers.types'
import { dateFormat } from '../../../../utils/formatters'
import { InvitationManagement } from '../InvitationManagement'
import { IndexOfferDisplay } from './IndexOfferDisplay'
import { PickupWindow } from './PickupWindow'
import { Price } from './Price'
import { Responses } from './Responses'
import { VisibilityWindow } from './VisibilityWindow'
import { Volume } from './Volume'
import {
  getOfferStatus,
  getRemainingLabel,
  getStatusTagStyle,
} from '../../../../utils/Utils/OfferInfoHelpers'
import { Skeleton } from 'antd'
import dayjs from 'dayjs'

type OfferInfoProps = {
  isLoading: boolean
  selectedSpecialOffer: SpecialOffer
  data?: SpecialOfferBreakdownResponseData
  onSendReminder?: () => void
  onCloseDeal?: () => void
  canWrite: boolean
}

export function OfferInfo({
  data,
  onSendReminder,
  isLoading,
  selectedSpecialOffer,
  canWrite,
}: OfferInfoProps) {
  if (!data) return null

  const offer = data.OfferInfo
  const price = data.PriceDiscovery

  const status = getOfferStatus(offer)
  const remainingLabel = getRemainingLabel(offer.VisibilityEndDateTime)
  const isAuction = !!price?.IsAuction
  const indexDisplay = offer?.IndexOfferDisplay

  if (isLoading) {
    return (
      <Horizontal className='p-4' style={{ minHeight: '100%', minWidth: '100%' }} horizontalCenter>
        <Skeleton active />
      </Horizontal>
    )
  }

  return (
    <div>
      <Horizontal className='offer-info-header-container'>
        <Vertical className='gap-6'>
          <Texto category='h3' weight='700'>
            {selectedSpecialOffer?.Product} @ {selectedSpecialOffer?.Location}
          </Texto>
          <Horizontal className='gap-10 mt-2' verticalCenter>
            <BBDTag style={getStatusTagStyle(status)}>{status}</BBDTag>
            {isAuction && <BBDTag>Silent Auction</BBDTag>}
            <Texto category='p2'>
              <ClockCircleOutlined className='mr-1' /> {remainingLabel}
            </Texto>
          </Horizontal>
        </Vertical>
        <Horizontal className='gap-10' verticalCenter>
          <GraviButton
            className='send-reminder-btn'
            icon={<SendOutlined className='send-reminder-icon' />}
            onClick={onSendReminder}
            buttonText='Send Reminder'
          />
        </Horizontal>
      </Horizontal>
      <Horizontal className='offer-info-wrap gap-24'>
        <VisibilityWindow data={data} canWrite={canWrite} />
        <InvitationManagement data={data} canWrite={canWrite} />
        <PickupWindow data={data} />
        <Volume data={data} canWrite={canWrite} status={status} />
        <Price data={data} />
        <Responses data={data} />
      </Horizontal>
      <Horizontal className='created-by-container'>
        {offer.CreatedBy && <Texto>Created by {offer.CreatedBy}</Texto>}
        {offer.CreatedBy && <Texto className='mx-3'>&bull;</Texto>}
        {offer.CreatedDateTime && (
          <Texto>{dayjs(offer.CreatedDateTime).format(dateFormat.DATE_TIME)}</Texto>
        )}
        <Texto className='ml-4'>ID:</Texto>
        <Texto className='ml-2'>{offer.SpecialOfferId}</Texto>
      </Horizontal>
      {indexDisplay && <IndexOfferDisplay indexDisplay={indexDisplay} />}
    </div>
  )
}
