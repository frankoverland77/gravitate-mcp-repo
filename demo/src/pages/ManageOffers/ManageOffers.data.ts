import dayjs from 'dayjs'
import type { SpecialOffer, SpecialOfferMetadataResponseData, SpecialOfferBreakdownResponseData } from './ManageOffers.types'

const futureDate = (daysFromNow: number, hours = 0) =>
  dayjs().add(daysFromNow, 'day').add(hours, 'hour').toISOString()
const pastDate = (daysAgo: number) => dayjs().subtract(daysAgo, 'day').toISOString()

export const mockSpecialOffers: SpecialOffer[] = [
  { SpecialOfferId: 1001, Type: 'Fixed', Name: 'KDSL-H8-2023 -S', Product: 'Ultra Low Sulfur Diesel', Location: 'Columbus Terminal', Volume: 2500000, Status: 'Active', Response: 0, Created: pastDate(5), LiftingStartDate: futureDate(1), LiftingEndDate: futureDate(14), VisibilityStartDateTime: pastDate(2), VisibilityEndDateTime: futureDate(7), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1002, Type: 'Offer', Name: 'CONV WES-07', Product: 'Conventional Terminal', Volume: 24563800, Status: 'Active', Location: 'Columbus Terminal', Response: 0, Created: pastDate(3), LiftingStartDate: futureDate(2), LiftingEndDate: futureDate(21), VisibilityStartDateTime: pastDate(1), VisibilityEndDateTime: futureDate(10), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1003, Type: 'Fixed', Name: 'KDSL-H8-2023 -S', Product: 'Kerosene', Location: 'Columbus Terminal', Volume: 15000000, Status: 'Active', Response: 0, Created: pastDate(7), LiftingStartDate: futureDate(3), LiftingEndDate: futureDate(28), VisibilityStartDateTime: pastDate(5), VisibilityEndDateTime: futureDate(14), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1004, Type: 'Fixed', Name: 'KDSL-H8-2023 -S', Product: 'Conventional', Location: 'Columbus Terminal', Volume: 12000000, Status: 'Active', Response: 0, Created: pastDate(10), LiftingStartDate: futureDate(1), LiftingEndDate: futureDate(7), VisibilityStartDateTime: pastDate(3), VisibilityEndDateTime: futureDate(5), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1005, Type: 'Offer', Name: 'KDSL-H8-2023 -S', Product: 'Columbus Terminal', Location: 'Columbus Terminal', Volume: 25000000, Status: 'Active', Response: 0, Created: pastDate(2), LiftingStartDate: futureDate(5), LiftingEndDate: futureDate(21), VisibilityStartDateTime: pastDate(1), VisibilityEndDateTime: futureDate(12), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1006, Type: 'Fixed', Name: 'CONV WES-07', Product: 'Columbus Terminal', Location: 'Columbus Terminal', Volume: 21000000, Status: 'Active', Response: 0, Created: pastDate(4), LiftingStartDate: futureDate(2), LiftingEndDate: futureDate(14), VisibilityStartDateTime: pastDate(2), VisibilityEndDateTime: futureDate(8), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1007, Type: 'Fixed', Name: 'Auction', Product: 'KDSL-H8-2023 -S', Location: 'Columbus Terminal', Volume: 30000000, Status: 'Active', Response: 0, Created: pastDate(6), LiftingStartDate: futureDate(1), LiftingEndDate: futureDate(10), VisibilityStartDateTime: pastDate(4), VisibilityEndDateTime: futureDate(6), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1008, Type: 'Fixed', Name: 'Auction', Product: 'CONV WES-07', Location: 'Columbus Terminal', Volume: 15000000, Status: 'Active', Response: 1270000, Created: pastDate(8), LiftingStartDate: futureDate(3), LiftingEndDate: futureDate(21), VisibilityStartDateTime: pastDate(6), VisibilityEndDateTime: futureDate(14), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 1270000, PendingSubmissionCount: 1 },
  { SpecialOfferId: 1009, Type: 'Offer', Name: 'UGIO-1', Product: 'Columbus Terminal', Location: 'Columbus Terminal', Volume: 18000000, Status: 'Active', Response: 0, Created: pastDate(1), LiftingStartDate: futureDate(4), LiftingEndDate: futureDate(28), VisibilityStartDateTime: pastDate(0), VisibilityEndDateTime: futureDate(15), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1010, Type: 'Fixed', Name: 'Auction', Product: 'CONV WES-B1 F10', Location: 'Columbus Terminal', Volume: 8000000, Status: 'Active', Response: 0, Created: pastDate(12), LiftingStartDate: futureDate(1), LiftingEndDate: futureDate(7), VisibilityStartDateTime: pastDate(8), VisibilityEndDateTime: futureDate(3), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1011, Type: 'Fixed', Name: 'KDSL-H8-2023 -S', Product: 'Kerosene', Location: 'Columbus Terminal', Volume: 35000000, Status: 'Active', Response: 0, Created: pastDate(15), LiftingStartDate: futureDate(2), LiftingEndDate: futureDate(14), VisibilityStartDateTime: pastDate(10), VisibilityEndDateTime: futureDate(5), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1012, Type: 'Auction', Name: 'KDSL-H8-2023 -S', Product: 'Columbus Terminal', Location: 'Columbus Terminal', Volume: 12500000, Status: 'Active', Response: 0, Created: pastDate(9), LiftingStartDate: futureDate(5), LiftingEndDate: futureDate(21), VisibilityStartDateTime: pastDate(5), VisibilityEndDateTime: futureDate(10), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1013, Type: 'Fixed', Name: 'CONV MED-BH-IF', Product: 'Columbus Terminal', Location: 'Columbus Terminal', Volume: 50000000, Status: 'Active', Response: 0, Created: pastDate(20), LiftingStartDate: futureDate(3), LiftingEndDate: futureDate(28), VisibilityStartDateTime: pastDate(15), VisibilityEndDateTime: futureDate(14), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1014, Type: 'Fixed', Name: 'CONV MCS-B1-H1', Product: 'WHAN-HL276', Location: 'Columbus Terminal', Volume: 9000000, Status: 'Active', Response: 0, Created: pastDate(3), LiftingStartDate: futureDate(1), LiftingEndDate: futureDate(10), VisibilityStartDateTime: pastDate(1), VisibilityEndDateTime: futureDate(7), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1015, Type: 'Offer', Name: 'CONV MCS-B1-UN', Product: 'WHAN-HL276', Location: 'Columbus Terminal', Volume: 15000000, Status: 'Active', Response: 0, Created: pastDate(7), LiftingStartDate: futureDate(2), LiftingEndDate: futureDate(14), VisibilityStartDateTime: pastDate(4), VisibilityEndDateTime: futureDate(8), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 0, PendingSubmissionCount: 0 },
  { SpecialOfferId: 1016, Type: 'Offer', Name: 'Auction', Product: 'AV4H-AVF11', Location: 'Columbus Terminal', Volume: 20000000, Status: 'Completed', Response: 85.5, Created: pastDate(30), LiftingStartDate: pastDate(10), LiftingEndDate: pastDate(3), VisibilityStartDateTime: pastDate(28), VisibilityEndDateTime: pastDate(12), CreatedByUserName: 'superadmin@gravitate', AcceptedVolume: 17100000, PendingSubmissionCount: 0 },
]

export const mockMetadata: SpecialOfferMetadataResponseData = {
  SpecialOfferTemplates: [
    { SpecialOfferTemplateId: 1, Name: 'Auction', Description: 'Customers bid against offered listings for set durations', CategoryType: 'auction', MarketPlatformInstrumentId: 1, MarketPlatformInstrumentName: 'NYMEX ULSD', PricingMechanismMeaning: 'Bid', PricingMechanismCvId: 21, VolumeDistributionCvId: 1, EvaluationTypeCvId: 16, DefaultMinimumVolumePerOrder: 1000, DefaultMaximumVolumePerOrder: 100000, DefaultVolumeIncrement: 500 },
    { SpecialOfferTemplateId: 2, Name: 'Index Offer (Bid)', Description: 'Published index-based pricing where customers can submit bids on the index offer', CategoryType: 'auction', MarketPlatformInstrumentId: 1, MarketPlatformInstrumentName: 'NYMEX ULSD', PricingMechanismMeaning: 'Index', PricingMechanismCvId: 22, VolumeDistributionCvId: 1, EvaluationTypeCvId: 17, DefaultMinimumVolumePerOrder: 1000, DefaultMaximumVolumePerOrder: 50000, DefaultVolumeIncrement: 500 },
    { SpecialOfferTemplateId: 3, Name: 'Special', Description: 'Send specific price terms to selected customers for set durations', CategoryType: 'special', MarketPlatformInstrumentId: 1, MarketPlatformInstrumentName: 'NYMEX ULSD', PricingMechanismMeaning: 'Fixed', PricingMechanismCvId: 20, VolumeDistributionCvId: 1, EvaluationTypeCvId: 15, DefaultMinimumVolumePerOrder: 500, DefaultMaximumVolumePerOrder: 50000, DefaultVolumeIncrement: 250 },
    { SpecialOfferTemplateId: 4, Name: 'Index Offer', Description: 'Index-based pricing offer for selected customers', CategoryType: 'special', MarketPlatformInstrumentId: 2, MarketPlatformInstrumentName: 'NYMEX RBOB', PricingMechanismMeaning: 'Index', PricingMechanismCvId: 22, VolumeDistributionCvId: 1, EvaluationTypeCvId: 17, DefaultMinimumVolumePerOrder: 1000, DefaultMaximumVolumePerOrder: 50000, DefaultVolumeIncrement: 500 },
  ],
  ProductLocationSelections: [
    { TradeEntrySetupId: 1, MarketPlatformInstrumentId: 1, ProductName: 'Ultra Low Sulfur Diesel', ProductGroupName: 'Diesel', LocationName: 'Houston, TX', LocationGroupName: 'Gulf Coast', ProductId: 1, LocationId: 10 },
    { TradeEntrySetupId: 2, MarketPlatformInstrumentId: 1, ProductName: 'Unleaded Gasoline (87)', ProductGroupName: 'Gasoline', LocationName: 'New York Harbor, NY', LocationGroupName: 'East Coast', ProductId: 2, LocationId: 20 },
    { TradeEntrySetupId: 3, MarketPlatformInstrumentId: 2, ProductName: 'Jet A', ProductGroupName: 'Jet', LocationName: 'Chicago, IL', LocationGroupName: 'Midwest', ProductId: 3, LocationId: 30 },
    { TradeEntrySetupId: 4, MarketPlatformInstrumentId: 1, ProductName: 'Kerosene', ProductGroupName: 'Diesel', LocationName: 'Los Angeles, CA', LocationGroupName: 'West Coast', ProductId: 4, LocationId: 40 },
    { TradeEntrySetupId: 5, MarketPlatformInstrumentId: 2, ProductName: 'RBOB Gasoline', ProductGroupName: 'Gasoline', LocationName: 'Houston, TX', LocationGroupName: 'Gulf Coast', ProductId: 5, LocationId: 10 },
    { TradeEntrySetupId: 6, MarketPlatformInstrumentId: 2, ProductName: 'Reformulated Gasoline', ProductGroupName: 'Gasoline', LocationName: 'New York Harbor, NY', LocationGroupName: 'East Coast', ProductId: 6, LocationId: 20 },
  ],
  EligibleCounterParties: [
    { Text: 'Acme Fuel Co', Value: '101' },
    { Text: 'BlueStar Energy', Value: '102' },
    { Text: 'Cascade Petroleum', Value: '103' },
    { Text: 'Delta Refining LLC', Value: '104' },
    { Text: 'EaglePower Fuels', Value: '105' },
    { Text: 'FuelFirst Inc', Value: '106' },
    { Text: 'Gulf Coast Trading', Value: '107' },
    { Text: 'Harbor Logistics', Value: '108' },
  ],
  IndexOfferMetaData: {
    Products: [{ Text: 'Ultra Low Sulfur Diesel', Value: '1' }, { Text: 'Gasoline', Value: '2' }],
    Locations: [{ Text: 'Houston, TX', Value: '10' }, { Text: 'New York Harbor', Value: '20' }],
    EffectiveTimes: [{ Text: '06:00 - 18:00 CT', Value: '1' }, { Text: '07:00 - 17:00 ET', Value: '2' }],
    WeekendRuleOptions: ['Use Friday', 'Skip', 'Use Monday'],
    HolidayRuleOptions: ['Use Previous Business Day', 'Skip', 'Use Next Business Day'],
    FormulaTemplates: [],
    PricePublishers: [{ Text: 'OPIS', Value: '1' }, { Text: 'Platts', Value: '2' }],
    PriceInstruments: [],
    PublisherPriceTypes: {},
    PublisherPriceInstruments: {},
    TradePriceValuationRules: [{ Text: 'Average', Value: '1' }, { Text: 'High', Value: '2' }],
  },
}

export const mockBreakdownData: SpecialOfferBreakdownResponseData = {
  OfferInfo: {
    CreatedBy: 'superadmin@gravitate',
    CreatedDateTime: pastDate(5),
    SpecialOfferId: 1001,
    Name: 'KDSL-H8-2023 -S',
    Description: 'Spring ULSD flash sale for Gulf Coast terminals',
    VisibilityStartDateTime: pastDate(2),
    VisibilityEndDateTime: futureDate(7),
    OrderEffectiveStartDateTime: futureDate(1),
    OrderEffectiveEndDateTime: futureDate(14),
    TotalVolume: 2500000,
    ReservePrice: 2.35,
    FixedPrice: 2.485,
    MarketOffset: -0.025,
    PricingMechanismName: 'Fixed',
    VolumeDistributionName: 'First Come First Served',
    EvaluationTypeName: 'Flash Sale',
    TotalResponses: 3,
    InvitationNotificationTriggerDateTimeUTC: pastDate(2),
    InvitationNotificationSentDateTimeUTC: pastDate(2),
  },
  SubmittedOrders: [
    { TradeEntryId: 5001, CustomerName: 'Acme Fuel Co', OrderPrice: 2.485, OrderVolume: 500000, SubmittedDateTime: pastDate(1), OrderStatus: 'Approved', PriceType: 'Fixed', OrderStatusCvId: 10 },
    { TradeEntryId: 5002, CustomerName: 'BlueStar Energy', OrderPrice: 2.485, OrderVolume: 750000, SubmittedDateTime: pastDate(1), OrderStatus: 'Pending', PriceType: 'Fixed', OrderStatusCvId: 5 },
    { TradeEntryId: 5003, CustomerName: 'Gulf Coast Trading', OrderPrice: 2.485, OrderVolume: 250000, SubmittedDateTime: pastDate(0), OrderStatus: 'Pending', PriceType: 'Fixed', OrderStatusCvId: 5 },
  ],
  CustomerEngagement: {
    InvitedCount: 8,
    ViewedCount: 5,
    SubmittedCount: 3,
    AcceptedCount: 1,
    ApprovalPercentage: 33.3,
    InvitedCustomerNames: ['Acme Fuel Co', 'BlueStar Energy', 'Cascade Petroleum', 'Delta Refining LLC', 'EaglePower Fuels', 'FuelFirst Inc', 'Gulf Coast Trading', 'Harbor Logistics'],
    ViewedCustomerNames: ['Acme Fuel Co', 'BlueStar Energy', 'Cascade Petroleum', 'Gulf Coast Trading', 'Harbor Logistics'],
    SubmittedCustomerNames: ['Acme Fuel Co', 'BlueStar Energy', 'Gulf Coast Trading'],
    AcceptedCustomerNames: ['Acme Fuel Co'],
  },
  PriceDiscovery: {
    IsAuction: false,
    ReservePrice: 2.35,
    BidPrices: [
      { Price: 2.485, Volume: 500000, Status: 'Approved' },
      { Price: 2.485, Volume: 750000, Status: 'Pending' },
      { Price: 2.485, Volume: 250000, Status: 'Pending' },
    ],
  },
  VolumeAnalysis: {
    TotalVolume: 2500000,
    AcceptedVolume: 500000,
    PendingVolume: 1000000,
    RemainingVolume: 1000000,
    IsOverSubscribed: false,
    OverSubscriptionPercentage: 0,
    RejectedVolume: 0,
  },
}
