// Type definitions for Subscription Management feature
// Based on Gravitate ManagePriceNotifications module patterns

export interface SubscriptionData {
  Id: number;
  CounterPartyId: number;
  CounterPartyName: string;
  QuoteConfigurationName: string;
  ProductIds: number[];
  LocationIds: number[];
  IsActive: boolean;
  // Content Configuration fields (16 booleans)
  IncludeCounterparty: boolean;
  IncludeLoadingNumber: boolean;
  IncludePortalLink: boolean;
  IncludeEffectiveDate: boolean;
  IncludeEffectiveTime: boolean;
  IncludeExpirationDate: boolean;
  IncludeProduct: boolean;
  IncludeOriginLocation: boolean;
  IncludeDestinationLocation: boolean;
  IncludeProductPrice: boolean;
  IncludeFreight: boolean;
  IncludeTaxAllIn: boolean;
  IncludeTaxLocal: boolean;
  IncludeTaxState: boolean;
  IncludeTaxFederal: boolean;
  IncludeAllInPrice: boolean;
}

export interface OptedOutEmail {
  email: string;
  optedOutDate: string;
}

export interface RecipientData {
  CounterPartyId: string;
  CounterPartyName: string;
  SiteIds: string[];
  Emails: string[];
  OptedOutEmails?: OptedOutEmail[];
}

export interface Product {
  ProductId: number;
  Name: string;
  IsActive: boolean;
}

export interface Location {
  LocationId: number;
  Name: string;
  LocationType: string;
  Abbreviation: string;
  IsActive: boolean;
}

// Default values for Content Configuration when creating new subscriptions
export const DEFAULT_CONTENT_CONFIG = {
  IncludeCounterparty: true,
  IncludeLoadingNumber: true,
  IncludePortalLink: true,
  IncludeEffectiveDate: true,
  IncludeEffectiveTime: true,
  IncludeExpirationDate: false,
  IncludeProduct: true,
  IncludeOriginLocation: true,
  IncludeDestinationLocation: false,
  IncludeProductPrice: true,
  IncludeFreight: false,
  IncludeTaxAllIn: true,
  IncludeTaxLocal: false,
  IncludeTaxState: false,
  IncludeTaxFederal: false,
  IncludeAllInPrice: true,
};

// Content configuration field metadata for column generation
export const CONTENT_CONFIG_FIELDS = [
  { field: 'IncludeLoadingNumber', headerName: 'Loading Number' },
  { field: 'IncludePortalLink', headerName: 'Portal Link' },
  { field: 'IncludeEffectiveDate', headerName: 'Effective Date' },
  { field: 'IncludeEffectiveTime', headerName: 'Effective Time' },
  { field: 'IncludeExpirationDate', headerName: 'Expiration Date' },
  { field: 'IncludeProduct', headerName: 'Product' },
  { field: 'IncludeOriginLocation', headerName: 'Origin Location' },
  { field: 'IncludeDestinationLocation', headerName: 'Dest. Location' },
  { field: 'IncludeProductPrice', headerName: 'Product Price' },
  { field: 'IncludeFreight', headerName: 'Freight' },
  { field: 'IncludeTaxAllIn', headerName: 'Tax (All-in)' },
  { field: 'IncludeTaxLocal', headerName: 'Tax - Local' },
  { field: 'IncludeTaxState', headerName: 'Tax - State' },
  { field: 'IncludeTaxFederal', headerName: 'Tax - Federal' },
  { field: 'IncludeAllInPrice', headerName: 'All-in Price' },
] as const;

// Helper type for bulk edit mode
export interface BulkEditProps {
  isBulkEditMode: boolean;
  bulkEditRows: SubscriptionData[];
  canWrite: boolean;
}
