import dayjs from 'dayjs'

export interface TimingPreset {
  key: string
  label: string
  getInvitation: () => dayjs.Dayjs
  getVisibilityStart: () => dayjs.Dayjs
  getVisibilityEnd: () => dayjs.Dayjs
  getPickupStart: () => dayjs.Dayjs
  getPickupEnd: () => dayjs.Dayjs
}

export const TIMING_PRESETS: TimingPreset[] = [
  {
    key: 'next-day',
    label: 'Next Day',
    getInvitation: () => dayjs().hour(16).minute(0).second(0),
    getVisibilityStart: () => dayjs().hour(18).minute(0).second(0),
    getVisibilityEnd: () => dayjs().add(1, 'day').hour(18).minute(0).second(0),
    getPickupStart: () => dayjs().add(1, 'day').hour(0).minute(0).second(0),
    getPickupEnd: () => dayjs().add(15, 'day').hour(0).minute(0).second(0),
  },
  {
    key: 'weekend',
    label: 'Weekend',
    getInvitation: () => dayjs().hour(14).minute(0).second(0),
    getVisibilityStart: () => dayjs().day(5).hour(18).minute(0).second(0),
    getVisibilityEnd: () => dayjs().day(5).add(3, 'day').hour(6).minute(0).second(0),
    getPickupStart: () => dayjs().day(5).add(3, 'day').hour(0).minute(0).second(0),
    getPickupEnd: () => dayjs().day(5).add(10, 'day').hour(23).minute(59).second(0),
  },
  {
    key: 'same-day',
    label: 'Same Day',
    getInvitation: () => dayjs().hour(10).minute(0).second(0),
    getVisibilityStart: () => dayjs(),
    getVisibilityEnd: () => dayjs().hour(23).minute(59).second(0),
    getPickupStart: () => dayjs().hour(0).minute(0).second(0),
    getPickupEnd: () => dayjs().add(1, 'day').hour(23).minute(59).second(0),
  },
]

export interface TermsTemplate {
  id: number
  name: string
  effectiveTime: string
  weekendRule: string
  holidayRule: string
}

export const TERMS_TEMPLATES: TermsTemplate[] = [
  {
    id: 1,
    name: 'Standard Rack',
    effectiveTime: 'Friday, Midnight (CT)',
    weekendRule: 'Saturday & Sunday: Add $0.025/gal',
    holidayRule: 'None',
  },
  {
    id: 2,
    name: 'Evening Settlement',
    effectiveTime: 'Friday, 6:00 PM (CT)',
    weekendRule: 'Saturday & Sunday: Add $0.030/gal',
    holidayRule: 'Add $0.015/gal',
  },
  {
    id: 3,
    name: 'Custom',
    effectiveTime: '',
    weekendRule: '',
    holidayRule: '',
  },
]

export interface CustomerGroup {
  label: string
  customerIds: string[]
}

export const CUSTOMER_GROUPS: CustomerGroup[] = [
  { label: 'Gulf Coast', customerIds: ['101', '105', '107'] },
  { label: 'East Coast', customerIds: ['102', '106', '108'] },
  { label: 'All Customers', customerIds: ['101', '102', '103', '104', '105', '106', '107', '108'] },
]

export function resolveTemplateId(
  transactionType: 'Auction' | 'Offer',
  pricingStrategy: 'Fixed' | 'Index',
  templates: { SpecialOfferTemplateId: number; CategoryType: string; PricingMechanismMeaning: string }[]
): number {
  const categoryType = transactionType === 'Auction' ? 'auction' : 'special'
  const pricingMechanism = pricingStrategy === 'Fixed'
    ? (transactionType === 'Auction' ? 'Bid' : 'Fixed')
    : 'Index'

  const match = templates.find(
    (t) => t.CategoryType === categoryType && t.PricingMechanismMeaning === pricingMechanism
  )
  return match?.SpecialOfferTemplateId ?? templates[0]?.SpecialOfferTemplateId ?? 1
}
