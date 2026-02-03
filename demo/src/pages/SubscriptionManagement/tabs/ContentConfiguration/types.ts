// Content Configuration Types

export interface ContentConfiguration {
  QuoteConfigId: number
  QuoteConfigName: string
  EmailSubject: string
  EmailBody: string
  // 16 Content Configuration Fields
  IncludeCounterparty: boolean
  IncludeLoadingNumber: boolean
  IncludePortalLink: boolean
  IncludeEffectiveDate: boolean
  IncludeEffectiveTime: boolean
  IncludeExpirationDate: boolean
  IncludeProduct: boolean
  IncludeOriginLocation: boolean
  IncludeDestinationLocation: boolean
  IncludeProductPrice: boolean
  IncludeFreight: boolean
  IncludeTaxAllIn: boolean
  IncludeTaxLocal: boolean
  IncludeTaxState: boolean
  IncludeTaxFederal: boolean
  IncludeAllInPrice: boolean
  // Metadata
  LastModified: string | null
  ModifiedBy: string | null
}

// Field metadata for generating UI
export const CONTENT_CONFIG_FIELDS = [
  { field: 'IncludeCounterparty', label: 'Counterparty' },
  { field: 'IncludeLoadingNumber', label: 'Loading Number' },
  { field: 'IncludePortalLink', label: 'Portal Link' },
  { field: 'IncludeEffectiveDate', label: 'Effective Date' },
  { field: 'IncludeEffectiveTime', label: 'Effective Time' },
  { field: 'IncludeExpirationDate', label: 'Expiration Date' },
  { field: 'IncludeProduct', label: 'Product' },
  { field: 'IncludeOriginLocation', label: 'Origin Location' },
  { field: 'IncludeDestinationLocation', label: 'Destination Location' },
  { field: 'IncludeProductPrice', label: 'Product Price' },
  { field: 'IncludeFreight', label: 'Freight' },
  { field: 'IncludeTaxAllIn', label: 'Tax (All-in)' },
  { field: 'IncludeTaxLocal', label: 'Tax - Local' },
  { field: 'IncludeTaxState', label: 'Tax - State' },
  { field: 'IncludeTaxFederal', label: 'Tax - Federal' },
  { field: 'IncludeAllInPrice', label: 'All-in Price' },
] as const

// Default values for content configuration
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
}
