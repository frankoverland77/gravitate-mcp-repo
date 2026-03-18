export interface OfferTemplate {
  SpecialOfferTemplateId: number;
  Name: string;
  Description: string;
  CategoryType: string;
  PricingMechanismMeaning: 'Index' | 'Fixed';
  DefaultMinimumVolumePerOrder: number;
  DefaultMaximumVolumePerOrder: number;
  DefaultVolumeIncrement: number;
}

export interface ProductLocation {
  TradeEntrySetupId: number;
  ProductName: string;
  ProductGroupName: string;
  LocationName: string;
  LocationGroupName: string;
  ProductId: number;
  LocationId: number;
  TimeZoneAlias: string;
}

export interface CustomerGroupTag {
  TagId: number;
  TagName: string;
}

export interface EligibleCustomer {
  CounterPartyId: number;
  CounterPartyName: string;
  City: string;
  State: string;
  CreditStatus: string;
  AssociatedGroupTags: CustomerGroupTag[];
}

export interface OfferCategory {
  id: string;
  label: string;
  description: string;
}

export interface OfferGridRow {
  SpecialOfferId: number;
  OfferName: string;
  OfferType: string;
  PricingMechanism: string;
  ProductName: string;
  LocationName: string;
  TotalVolume: number;
  FixedPrice: number | null;
  Status: string;
  VisibilityStart: string;
  VisibilityEnd: string;
  PickupStart: string;
  PickupEnd: string;
  CustomerCount: number;
  CreatedDate: string;
}

export interface TimingWindowConfig {
  title: string;
  description: string;
  startDateName: string;
  startTimeName: string;
  endDateName: string;
  endTimeName: string;
}
