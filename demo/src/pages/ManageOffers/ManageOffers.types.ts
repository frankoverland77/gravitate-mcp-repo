/**
 * Types extracted from Gravitate production:
 * modules/Dashboard/SpecialOffers/Api/types.schema.ts
 */

export type SpecialOfferStatus = 'Scheduled' | 'Completed' | 'Active'

export interface SpecialOffer {
  SpecialOfferId: number
  Type: string
  Name: string
  Product: string
  Location: string
  Volume: number
  Status: SpecialOfferStatus
  Response: number
  Created: string
  LiftingStartDate: string
  LiftingEndDate: string
  VisibilityStartDateTime: string
  VisibilityEndDateTime: string
  CreatedByUserName: string
  AcceptedVolume: number
  PendingSubmissionCount: number
}

export interface SpecialOfferMetadataResponseData {
  SpecialOfferTemplates: SpecialOfferTemplate[]
  ProductLocationSelections: ProductLocationSelection[]
  EligibleCounterParties: { Text: string; Value: string }[]
  IndexOfferMetaData: IndexOfferMetaData
}

export interface ProductLocationSelection {
  TradeEntrySetupId: number
  MarketPlatformInstrumentId: number
  ProductName: string
  ProductGroupName: string
  LocationName: string
  LocationGroupName: string
  ProductId: number
  LocationId: number
}

export interface SpecialOfferTemplate {
  SpecialOfferTemplateId: number
  Name: string
  Description: string
  CategoryType: string
  MarketPlatformInstrumentId: number
  MarketPlatformInstrumentName: string
  PricingMechanismMeaning: string
  PricingMechanismCvId: number
  VolumeDistributionCvId: number
  EvaluationTypeCvId: number
  DefaultMinimumVolumePerOrder: number
  DefaultMaximumVolumePerOrder: number
  DefaultVolumeIncrement: number
}

export interface IndexOfferMetaData {
  Products: { Text: string; Value: string }[]
  Locations: { Text: string; Value: string }[]
  EffectiveTimes: { Text: string; Value: string }[]
  WeekendRuleOptions: string[]
  HolidayRuleOptions: string[]
  FormulaTemplates: any[]
  PricePublishers: { Text: string; Value: string }[]
  PriceInstruments: { CurrencyPerUnitDisplay: string; UnitOfMeasureDisplay: string; Text: string; Value: string; GroupingValue: string }[]
  PublisherPriceTypes: Record<string, { Text: string; Value: string }[]>
  PublisherPriceInstruments: Record<string, { Text: string; Value: string }[]>
  TradePriceValuationRules: { Text: string; Value: string }[]
}

export interface SpecialOfferBreakdownOfferInfo {
  CreatedBy: string | null
  CreatedDateTime: string
  SpecialOfferId: number
  Name: string
  Description: string
  VisibilityStartDateTime: string
  VisibilityEndDateTime: string
  OrderEffectiveStartDateTime: string
  OrderEffectiveEndDateTime: string
  TotalVolume: number
  ReservePrice: number
  FixedPrice: number
  MarketOffset: number
  PricingMechanismName: string
  VolumeDistributionName: string
  EvaluationTypeName: string
  TotalResponses: number
  InvitationNotificationTriggerDateTimeUTC: string | null
  InvitationNotificationSentDateTimeUTC: string | null
  IndexOfferDisplay?: IndexOfferViewDisplayModel
}

export interface IndexOfferViewDisplayModel {
  TradeEntryId: number
  FormulaDisplayName: string
  FormulaString: string
  ContractDifferential: number | null
  PricingEffectiveTimes: string | null
  PricingWeekendBehavior: string | null
  PricingHolidayBehavior: string | null
  AdditionalFreetextTerms: string | null
  FormulaVariables: IndexOfferViewFormulaVariableModel[]
}

export interface IndexOfferViewFormulaVariableModel {
  VariableName: string
  VariableDisplayName: string
  Value: number | null
  ValueSourceType: string
  PricePublisherName: string | null
  PriceInstrumentName: string | null
  PriceTypeName: string | null
  PriceValuationRuleName: string | null
}

export interface SpecialOfferBreakdownSubmittedOrder {
  TradeEntryId: number
  CustomerName: string
  OrderPrice: number
  OrderVolume: number
  SubmittedDateTime: string
  OrderStatus: string
  PriceType: string
  OrderStatusCvId: number
}

export interface SpecialOfferBreakdownCustomerEngagement {
  InvitedCount: number
  ViewedCount: number
  SubmittedCount: number
  AcceptedCount: number
  ApprovalPercentage: number
  InvitedCustomerNames?: string[]
  ViewedCustomerNames?: string[]
  SubmittedCustomerNames?: string[]
  AcceptedCustomerNames?: string[]
  InvitedCounterParties?: { Text: string; Value: string }[]
}

export interface SpecialOfferBreakdownPricePoint {
  Price: number
  Volume: number
  Status?: string
}

export interface SpecialOfferBreakdownPriceDiscovery {
  IsAuction: boolean
  ReservePrice: number
  BidPrices: SpecialOfferBreakdownPricePoint[]
}

export interface SpecialOfferBreakdownVolumeAnalysis {
  TotalVolume: number
  AcceptedVolume: number
  PendingVolume: number
  RemainingVolume: number
  IsOverSubscribed: boolean
  OverSubscriptionPercentage: number
  RejectedVolume?: number
}

export interface SpecialOfferBreakdownResponseData {
  OfferInfo: SpecialOfferBreakdownOfferInfo
  SubmittedOrders: SpecialOfferBreakdownSubmittedOrder[]
  CustomerEngagement: SpecialOfferBreakdownCustomerEngagement
  PriceDiscovery: SpecialOfferBreakdownPriceDiscovery
  VolumeAnalysis: SpecialOfferBreakdownVolumeAnalysis
}

export interface CreateSpecialOfferRequest {
  SpecialOfferId?: number
  SpecialOfferTemplateId: number
  MinimumVolumePerOrder: number
  MaximumVolumePerOrder: number
  VolumeIncrement: number
  TotalVolume: number
  ReservePrice?: number
  FixedPrice?: number
  MarketOffset?: number
  VisibilityStartDateTime: Date | string
  VisibilityEndDateTime: Date | string
  OrderEffectiveStartDateTime: Date | string
  OrderEffectiveEndDateTime: Date | string
  CounterPartyIds: string[]
  TradeEntrySetupIds: string[]
  InvitationTriggerDateTimeTZ: Date
  IndexPricingInfo?: any
}

export interface IndexOfferFormulaComponent {
  Percentage: number | null
  PricePublisherId: number | null
  PriceInstrumentId: number | null
  PriceValuationRuleId: number | null
  PriceTypeCvId: number | null
  DisplayName: string
  Differential?: number | null
  IdForGrid?: number
  isDisplayNameCustomized?: boolean
}

export interface IndexPricingFormData {
  ProductId: number
  LocationId: number
  PricingEffectiveTimes: string
  PricingWeekendBehavior: string
  PricingHolidayBehavior: string
  AdditionalFreetextTerms?: string
  FormulaDifferential: number
  IsInternalOnly?: boolean
  formulaComponents: IndexOfferFormulaComponent[]
  PricingFormulaDefaultText: string
  ReservePrice?: number
  InternalDisplayName?: string
  ExternalDisplayName?: string
}
