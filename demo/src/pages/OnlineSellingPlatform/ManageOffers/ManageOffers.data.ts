import type {
  EligibleCustomer,
  OfferCategory,
  OfferGridRow,
  OfferTemplate,
  ProductLocation,
  TimingWindowConfig,
} from './ManageOffers.types';

export const STEPS = ['Offer Type', 'Products', 'Timing', 'Customers'];

export const OFFER_CATEGORIES: OfferCategory[] = [
  {
    id: 'auction',
    label: 'Auction',
    description: 'Let customers bid on your inventory. Best price wins.',
  },
  {
    id: 'fixedprice',
    label: 'Fixed Price',
    description: 'Set a fixed price for your inventory. First come, first served.',
  },
];

export const OFFER_TEMPLATES: OfferTemplate[] = [
  {
    SpecialOfferTemplateId: 1,
    Name: 'Auction',
    Description: 'Standard auction with competitive bidding',
    CategoryType: 'auction',
    PricingMechanismMeaning: 'Fixed',
    DefaultMinimumVolumePerOrder: 1000,
    DefaultMaximumVolumePerOrder: 10000,
    DefaultVolumeIncrement: 500,
  },
  {
    SpecialOfferTemplateId: 2,
    Name: 'Auction (Index)',
    Description: 'Auction with index-based pricing',
    CategoryType: 'auction',
    PricingMechanismMeaning: 'Index',
    DefaultMinimumVolumePerOrder: 2000,
    DefaultMaximumVolumePerOrder: 20000,
    DefaultVolumeIncrement: 1000,
  },
  {
    SpecialOfferTemplateId: 3,
    Name: 'Fixed Price',
    Description: 'Standard fixed price offer',
    CategoryType: 'fixedprice',
    PricingMechanismMeaning: 'Fixed',
    DefaultMinimumVolumePerOrder: 500,
    DefaultMaximumVolumePerOrder: 8000,
    DefaultVolumeIncrement: 500,
  },
  {
    SpecialOfferTemplateId: 4,
    Name: 'Fixed Price (Index)',
    Description: 'Fixed price offer with index-based pricing',
    CategoryType: 'fixedprice',
    PricingMechanismMeaning: 'Index',
    DefaultMinimumVolumePerOrder: 1000,
    DefaultMaximumVolumePerOrder: 15000,
    DefaultVolumeIncrement: 1000,
  },
];

export const PRODUCT_LOCATIONS: ProductLocation[] = [
  {
    TradeEntrySetupId: 1,
    ProductName: 'ULSD',
    ProductGroupName: 'Diesel',
    LocationName: 'Chicago Terminal',
    LocationGroupName: 'Midwest',
    ProductId: 101,
    LocationId: 201,
    TimeZoneAlias: 'CT',
  },
  {
    TradeEntrySetupId: 2,
    ProductName: 'Regular Unleaded',
    ProductGroupName: 'Gasoline',
    LocationName: 'Houston Terminal',
    LocationGroupName: 'Gulf Coast',
    ProductId: 102,
    LocationId: 202,
    TimeZoneAlias: 'CT',
  },
  {
    TradeEntrySetupId: 3,
    ProductName: 'Premium Unleaded',
    ProductGroupName: 'Gasoline',
    LocationName: 'New York Harbor',
    LocationGroupName: 'East Coast',
    ProductId: 103,
    LocationId: 203,
    TimeZoneAlias: 'ET',
  },
  {
    TradeEntrySetupId: 4,
    ProductName: 'Kerosene',
    ProductGroupName: 'Distillates',
    LocationName: 'Atlanta Terminal',
    LocationGroupName: 'Southeast',
    ProductId: 104,
    LocationId: 204,
    TimeZoneAlias: 'ET',
  },
  {
    TradeEntrySetupId: 5,
    ProductName: 'Ethanol',
    ProductGroupName: 'Renewables',
    LocationName: 'Des Moines Terminal',
    LocationGroupName: 'Midwest',
    ProductId: 105,
    LocationId: 205,
    TimeZoneAlias: 'CT',
  },
  {
    TradeEntrySetupId: 6,
    ProductName: 'Biodiesel B20',
    ProductGroupName: 'Renewables',
    LocationName: 'Portland Terminal',
    LocationGroupName: 'West Coast',
    ProductId: 106,
    LocationId: 206,
    TimeZoneAlias: 'PT',
  },
];

export const ELIGIBLE_CUSTOMERS: EligibleCustomer[] = [
  { CounterPartyId: 1, CounterPartyName: 'Acme Fuel Co.', City: 'Chicago', State: 'IL', CreditStatus: 'Approved', AssociatedGroupTags: [{ TagId: 1, TagName: 'Midwest' }, { TagId: 2, TagName: 'Premium' }] },
  { CounterPartyId: 2, CounterPartyName: 'Blue Ridge Petroleum', City: 'Houston', State: 'TX', CreditStatus: 'Approved', AssociatedGroupTags: [{ TagId: 3, TagName: 'Gulf Coast' }] },
  { CounterPartyId: 3, CounterPartyName: 'Cascade Energy LLC', City: 'Portland', State: 'OR', CreditStatus: 'Approved', AssociatedGroupTags: [{ TagId: 4, TagName: 'West Coast' }, { TagId: 5, TagName: 'Renewables' }, { TagId: 6, TagName: 'Strategic' }] },
  { CounterPartyId: 4, CounterPartyName: 'Delta Fuels Inc.', City: 'Atlanta', State: 'GA', CreditStatus: 'Approved', AssociatedGroupTags: [{ TagId: 7, TagName: 'Southeast' }] },
  { CounterPartyId: 5, CounterPartyName: 'Eagle Transport', City: 'Denver', State: 'CO', CreditStatus: 'Pending', AssociatedGroupTags: [] },
  { CounterPartyId: 6, CounterPartyName: 'Frontier Logistics', City: 'Dallas', State: 'TX', CreditStatus: 'Approved', AssociatedGroupTags: [{ TagId: 3, TagName: 'Gulf Coast' }, { TagId: 8, TagName: 'Bulk Buyer' }] },
  { CounterPartyId: 7, CounterPartyName: 'Gulf States Energy', City: 'New Orleans', State: 'LA', CreditStatus: 'Approved', AssociatedGroupTags: [{ TagId: 3, TagName: 'Gulf Coast' }, { TagId: 2, TagName: 'Premium' }, { TagId: 9, TagName: 'Long-Term' }, { TagId: 10, TagName: 'Key Account' }] },
  { CounterPartyId: 8, CounterPartyName: 'Harbor Point Fuels', City: 'New York', State: 'NY', CreditStatus: 'Approved', AssociatedGroupTags: [{ TagId: 11, TagName: 'East Coast' }] },
  { CounterPartyId: 9, CounterPartyName: 'Interstate Fuel Dist.', City: 'Indianapolis', State: 'IN', CreditStatus: 'Approved', AssociatedGroupTags: [{ TagId: 1, TagName: 'Midwest' }, { TagId: 8, TagName: 'Bulk Buyer' }] },
  { CounterPartyId: 10, CounterPartyName: 'Jackson Energy Co.', City: 'Memphis', State: 'TN', CreditStatus: 'Pending', AssociatedGroupTags: [] },
];

export const TIMING_WINDOWS: TimingWindowConfig[] = [
  {
    title: 'Visibility Window',
    description: 'When customers can see and respond to your offer',
    startDateName: 'VisibilityWindowStartDate',
    startTimeName: 'VisibilityWindowStartTime',
    endDateName: 'VisibilityWindowEndDate',
    endTimeName: 'VisibilityWindowEndTime',
  },
  {
    title: 'Pickup Window',
    description: 'When customers can pick up or take delivery of the product',
    startDateName: 'PickupWindowStartDate',
    startTimeName: 'PickupWindowStartTime',
    endDateName: 'PickupWindowEndDate',
    endTimeName: 'PickupWindowEndTime',
  },
];

let nextOfferId = 100;

export function generateInitialOffers(): OfferGridRow[] {
  return [
    {
      SpecialOfferId: 1,
      OfferName: 'ULSD Chicago Auction',
      OfferType: 'Auction',
      PricingMechanism: 'Fixed',
      ProductName: 'ULSD',
      LocationName: 'Chicago Terminal',
      TotalVolume: 50000,
      FixedPrice: 2.45,
      Status: 'Active',
      VisibilityStart: '2026-03-18 08:00',
      VisibilityEnd: '2026-03-20 17:00',
      PickupStart: '2026-03-21 06:00',
      PickupEnd: '2026-03-25 18:00',
      CustomerCount: 5,
      CreatedDate: '2026-03-15',
    },
    {
      SpecialOfferId: 2,
      OfferName: 'Regular Unleaded Houston Fixed',
      OfferType: 'Fixed Price',
      PricingMechanism: 'Fixed',
      ProductName: 'Regular Unleaded',
      LocationName: 'Houston Terminal',
      TotalVolume: 30000,
      FixedPrice: 2.18,
      Status: 'Active',
      VisibilityStart: '2026-03-17 09:00',
      VisibilityEnd: '2026-03-19 17:00',
      PickupStart: '2026-03-20 06:00',
      PickupEnd: '2026-03-24 18:00',
      CustomerCount: 8,
      CreatedDate: '2026-03-14',
    },
    {
      SpecialOfferId: 3,
      OfferName: 'Premium Unleaded NYC Index',
      OfferType: 'Fixed Price (Index)',
      PricingMechanism: 'Index',
      ProductName: 'Premium Unleaded',
      LocationName: 'New York Harbor',
      TotalVolume: 25000,
      FixedPrice: null,
      Status: 'Draft',
      VisibilityStart: '2026-03-22 08:00',
      VisibilityEnd: '2026-03-24 17:00',
      PickupStart: '2026-03-25 06:00',
      PickupEnd: '2026-03-28 18:00',
      CustomerCount: 3,
      CreatedDate: '2026-03-16',
    },
    {
      SpecialOfferId: 4,
      OfferName: 'Kerosene Atlanta Auction',
      OfferType: 'Auction',
      PricingMechanism: 'Fixed',
      ProductName: 'Kerosene',
      LocationName: 'Atlanta Terminal',
      TotalVolume: 15000,
      FixedPrice: 2.89,
      Status: 'Expired',
      VisibilityStart: '2026-03-10 08:00',
      VisibilityEnd: '2026-03-12 17:00',
      PickupStart: '2026-03-13 06:00',
      PickupEnd: '2026-03-15 18:00',
      CustomerCount: 6,
      CreatedDate: '2026-03-08',
    },
  ];
}

export function getNextOfferId(): number {
  return ++nextOfferId;
}
