import dayjs, { type Dayjs } from 'dayjs'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'

import type {
  SpecialOfferBreakdownCustomerEngagement,
  SpecialOfferBreakdownOfferInfo,
  SpecialOfferStatus,
} from '../../ManageOffers.types'
import { dateFormat, fmt } from '../formatters'

export function getOfferStatus(
  offer: Pick<SpecialOfferBreakdownOfferInfo, 'VisibilityStartDateTime' | 'VisibilityEndDateTime'>,
  now: Dayjs = dayjs()
): SpecialOfferStatus {
  const start = dayjs(offer.VisibilityStartDateTime)
  const end = dayjs(offer.VisibilityEndDateTime)

  if (now.isBefore(start)) return 'Scheduled'
  if (now.isAfter(end)) return 'Completed'
  return 'Active'
}

export function getRemainingLabel(end: string | Date | Dayjs, now: Dayjs = dayjs()): string {
  const visEnd = dayjs(end)
  if (!visEnd.isValid()) return '—'

  const hours = visEnd.diff(now, 'hour')

  if (hours <= 0) return 'Ended'
  if (hours < 24) return `${hours}h remaining`

  const days = Math.floor(hours / 24)
  const remHours = hours % 24
  return `${days}d ${remHours}h remaining`
}

export function getStatusPalette(status: SpecialOfferStatus): { bg: string; fg: string } {
  switch (status) {
    case 'Active':
      return { bg: 'var(--theme-success)', fg: '#fff' }
    case 'Completed':
      return { bg: 'var(--theme-color-2)', fg: '#fff' }
    default:
      return { bg: 'rgba(156,163,175,0.2)', fg: 'rgb(107,114,128)' }
  }
}

export function getStatusTagStyle(status: SpecialOfferStatus): React.CSSProperties {
  const { bg, fg } = getStatusPalette(status)
  return {
    background: bg,
    color: fg,
    borderColor: fg,
    width: '80px',
    textAlign: 'center',
  }
}

export function formatDateTimeRange(
  start: Dayjs | string | Date,
  end: Dayjs | string | Date,
  fmtStr = dateFormat.MONTH_DATE_TIME
): string {
  const s = dayjs(start)
  const e = dayjs(end)
  if (!s.isValid() || !e.isValid()) return '—'
  return `${s.format(fmtStr)} - ${e.format(fmtStr)}`
}

type ResponsesDescriptionProps = {
  offer: Pick<SpecialOfferBreakdownOfferInfo, 'TotalResponses'>
  engagement?: SpecialOfferBreakdownCustomerEngagement
  showPercent?: boolean
}

export function ResponsesDescription({ offer, engagement, showPercent = true }: ResponsesDescriptionProps) {
  const bids = offer.TotalResponses ?? 0
  const invited = engagement?.InvitedCount ?? 0
  const pct = invited > 0 ? (bids / invited) * 100 : undefined

  return (
    <Horizontal verticalCenter className={'gap-10'} style={{ alignItems: 'center' }}>
      <Texto category={'h4'}>{invited > 0 ? `${bids}/${invited}` : `${bids}`}</Texto>
      {showPercent && invited > 0 && pct != null && (
        <Texto category={'h4'} className='ml-3'>
          {fmt.decimal(pct, 2)}%
        </Texto>
      )}
    </Horizontal>
  )
}

export function getResponsePercent(
  offer: Pick<SpecialOfferBreakdownOfferInfo, 'TotalResponses'>,
  engagement?: SpecialOfferBreakdownCustomerEngagement
): number | null {
  const bids = offer.TotalResponses ?? 0
  const invited = engagement?.InvitedCount ?? 0
  if (invited <= 0) return bids === 0 ? 0 : null
  return Math.round((bids / invited) * 100)
}

export function getResponsesAccentColor(pct: number | null): string {
  if (pct == null) return ''

  if (pct === 0) return '#ef4444'
  if (pct >= 100) return '#20c55e'
  return '#f59e0b'
}
