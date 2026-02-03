// Preview Notifications Types

export interface PriceNotification {
  QuoteConfigId: number
  QuoteConfigName: string
  LocationId: number
  LocationName: string
  ProductId: number
  ProductName: string
  EffectiveTime: string
  Price: number | null
  PriceDelta: number | null
  CustomerCount: number
  HasBeenSent: boolean
  DTNSent: boolean
  EmailSent: boolean
  LastNotificationTime: string | null
  QuoteConfigurationMappingId: number
  QuotedValueId: number | null
}

export type PreviewMode = 'EndOfDay' | 'IntraDay' | 'EndOfDayCurrentPeriod'

export type NotificationMethod = 'DTN' | 'Email' | 'Both'
