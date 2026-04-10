export type PriceExceptionRow = {
  id: number
  QuoteConfigurationMappingId: number
  configurationName: string
  product: string
  ProductId: number
  location: string
  LocationId: number
  costType: string

  Margin_CriticalBelow: number | null
  Margin_WarningBelow: number | null
  Margin_WarningAbove: number | null
  Margin_CriticalAbove: number | null

  Cost_CriticalBelow: number | null
  Cost_WarningBelow: number | null
  Cost_WarningAbove: number | null
  Cost_CriticalAbove: number | null

  MarketMove_CriticalBelow: number | null
  MarketMove_WarningBelow: number | null
  MarketMove_WarningAbove: number | null
  MarketMove_CriticalAbove: number | null

  PriceDelta_CriticalBelow: number | null
  PriceDelta_WarningBelow: number | null
  PriceDelta_WarningAbove: number | null
  PriceDelta_CriticalAbove: number | null

  ReferenceStrategyDelta_CriticalBelow: number | null
  ReferenceStrategyDelta_WarningBelow: number | null
  ReferenceStrategyDelta_WarningAbove: number | null
  ReferenceStrategyDelta_CriticalAbove: number | null
}

export const priceExceptionData: PriceExceptionRow[] = [
  // Wholesale Config (5 rows)
  {
    id: 1, QuoteConfigurationMappingId: 101,
    configurationName: 'Wholesale Config',
    product: 'Diesel #2', ProductId: 1,
    location: 'Houston Term.', LocationId: 10,
    costType: 'Contract',
    Margin_CriticalBelow: -0.0500, Margin_WarningBelow: -0.0200, Margin_WarningAbove: 0.1500, Margin_CriticalAbove: 0.2500,
    Cost_CriticalBelow: 1.5000, Cost_WarningBelow: 1.8000, Cost_WarningAbove: 2.8000, Cost_CriticalAbove: 3.2000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0500, MarketMove_CriticalAbove: 0.1000,
    PriceDelta_CriticalBelow: -0.1500, PriceDelta_WarningBelow: -0.0800, PriceDelta_WarningAbove: 0.0800, PriceDelta_CriticalAbove: 0.1500,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0400, ReferenceStrategyDelta_CriticalAbove: 0.0800,
  },
  {
    id: 2, QuoteConfigurationMappingId: 102,
    configurationName: 'Wholesale Config',
    product: 'Unleaded 87', ProductId: 2,
    location: 'Dallas Hub', LocationId: 20,
    costType: 'Instrument',
    Margin_CriticalBelow: -0.0400, Margin_WarningBelow: -0.0100, Margin_WarningAbove: 0.1200, Margin_CriticalAbove: 0.2000,
    Cost_CriticalBelow: 1.6000, Cost_WarningBelow: 1.9000, Cost_WarningAbove: 2.7000, Cost_CriticalAbove: 3.0000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0400, MarketMove_CriticalAbove: 0.0800,
    PriceDelta_CriticalBelow: -0.1200, PriceDelta_WarningBelow: -0.0600, PriceDelta_WarningAbove: 0.0600, PriceDelta_CriticalAbove: 0.1200,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0350, ReferenceStrategyDelta_CriticalAbove: 0.0700,
  },
  {
    id: 3, QuoteConfigurationMappingId: 103,
    configurationName: 'Wholesale Config',
    product: 'Premium 91', ProductId: 3,
    location: 'Chicago Term.', LocationId: 30,
    costType: 'Marker',
    Margin_CriticalBelow: -0.0300, Margin_WarningBelow: -0.0100, Margin_WarningAbove: 0.1000, Margin_CriticalAbove: 0.1800,
    Cost_CriticalBelow: null, Cost_WarningBelow: null, Cost_WarningAbove: null, Cost_CriticalAbove: null,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: null, MarketMove_CriticalAbove: null,
    PriceDelta_CriticalBelow: null, PriceDelta_WarningBelow: null, PriceDelta_WarningAbove: null, PriceDelta_CriticalAbove: null,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: null, ReferenceStrategyDelta_CriticalAbove: null,
  },
  {
    id: 4, QuoteConfigurationMappingId: 104,
    configurationName: 'Wholesale Config',
    product: 'Diesel #2', ProductId: 1,
    location: 'Houston Term.', LocationId: 10,
    costType: 'Contract',
    Margin_CriticalBelow: -0.0600, Margin_WarningBelow: -0.0250, Margin_WarningAbove: 0.1600, Margin_CriticalAbove: 0.2800,
    Cost_CriticalBelow: 1.4500, Cost_WarningBelow: 1.7500, Cost_WarningAbove: 2.9000, Cost_CriticalAbove: 3.3000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0600, MarketMove_CriticalAbove: 0.1200,
    PriceDelta_CriticalBelow: -0.1800, PriceDelta_WarningBelow: -0.0900, PriceDelta_WarningAbove: 0.0900, PriceDelta_CriticalAbove: 0.1800,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0450, ReferenceStrategyDelta_CriticalAbove: 0.0900,
  },
  {
    id: 5, QuoteConfigurationMappingId: 105,
    configurationName: 'Wholesale Config',
    product: 'Unleaded 87', ProductId: 2,
    location: 'Dallas Hub', LocationId: 20,
    costType: 'Instrument',
    Margin_CriticalBelow: -0.0450, Margin_WarningBelow: -0.0150, Margin_WarningAbove: 0.1300, Margin_CriticalAbove: 0.2200,
    Cost_CriticalBelow: 1.5500, Cost_WarningBelow: 1.8500, Cost_WarningAbove: 2.7500, Cost_CriticalAbove: 3.1000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0450, MarketMove_CriticalAbove: 0.0900,
    PriceDelta_CriticalBelow: -0.1300, PriceDelta_WarningBelow: -0.0700, PriceDelta_WarningAbove: 0.0700, PriceDelta_CriticalAbove: 0.1300,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0380, ReferenceStrategyDelta_CriticalAbove: 0.0750,
  },
  // Industrial Config (5 rows)
  {
    id: 6, QuoteConfigurationMappingId: 201,
    configurationName: 'Industrial Config',
    product: 'Diesel #2', ProductId: 1,
    location: 'Chicago Term.', LocationId: 30,
    costType: 'Contract',
    Margin_CriticalBelow: -0.0350, Margin_WarningBelow: -0.0100, Margin_WarningAbove: 0.1100, Margin_CriticalAbove: 0.1900,
    Cost_CriticalBelow: 1.7000, Cost_WarningBelow: 2.0000, Cost_WarningAbove: 2.6000, Cost_CriticalAbove: 2.9000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0350, MarketMove_CriticalAbove: 0.0700,
    PriceDelta_CriticalBelow: -0.1000, PriceDelta_WarningBelow: -0.0500, PriceDelta_WarningAbove: 0.0500, PriceDelta_CriticalAbove: 0.1000,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0300, ReferenceStrategyDelta_CriticalAbove: 0.0600,
  },
  {
    id: 7, QuoteConfigurationMappingId: 202,
    configurationName: 'Industrial Config',
    product: 'Premium 91', ProductId: 3,
    location: 'Houston Term.', LocationId: 10,
    costType: 'Marker',
    Margin_CriticalBelow: -0.0400, Margin_WarningBelow: -0.0150, Margin_WarningAbove: 0.1400, Margin_CriticalAbove: 0.2400,
    Cost_CriticalBelow: null, Cost_WarningBelow: null, Cost_WarningAbove: null, Cost_CriticalAbove: null,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0500, MarketMove_CriticalAbove: 0.1000,
    PriceDelta_CriticalBelow: null, PriceDelta_WarningBelow: null, PriceDelta_WarningAbove: null, PriceDelta_CriticalAbove: null,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: null, ReferenceStrategyDelta_CriticalAbove: null,
  },
  {
    id: 8, QuoteConfigurationMappingId: 203,
    configurationName: 'Industrial Config',
    product: 'Unleaded 87', ProductId: 2,
    location: 'Dallas Hub', LocationId: 20,
    costType: 'Instrument',
    Margin_CriticalBelow: -0.0500, Margin_WarningBelow: -0.0200, Margin_WarningAbove: 0.1500, Margin_CriticalAbove: 0.2500,
    Cost_CriticalBelow: 1.5500, Cost_WarningBelow: 1.8500, Cost_WarningAbove: 2.8500, Cost_CriticalAbove: 3.2500,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0550, MarketMove_CriticalAbove: 0.1100,
    PriceDelta_CriticalBelow: -0.1400, PriceDelta_WarningBelow: -0.0700, PriceDelta_WarningAbove: 0.0700, PriceDelta_CriticalAbove: 0.1400,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0400, ReferenceStrategyDelta_CriticalAbove: 0.0800,
  },
  {
    id: 9, QuoteConfigurationMappingId: 204,
    configurationName: 'Industrial Config',
    product: 'Diesel #2', ProductId: 1,
    location: 'Chicago Term.', LocationId: 30,
    costType: 'Contract',
    Margin_CriticalBelow: -0.0300, Margin_WarningBelow: -0.0100, Margin_WarningAbove: 0.1000, Margin_CriticalAbove: 0.1800,
    Cost_CriticalBelow: 1.6500, Cost_WarningBelow: 1.9500, Cost_WarningAbove: 2.6500, Cost_CriticalAbove: 2.9500,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0400, MarketMove_CriticalAbove: 0.0800,
    PriceDelta_CriticalBelow: -0.1100, PriceDelta_WarningBelow: -0.0550, PriceDelta_WarningAbove: 0.0550, PriceDelta_CriticalAbove: 0.1100,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0350, ReferenceStrategyDelta_CriticalAbove: 0.0700,
  },
  {
    id: 10, QuoteConfigurationMappingId: 205,
    configurationName: 'Industrial Config',
    product: 'Premium 91', ProductId: 3,
    location: 'Houston Term.', LocationId: 10,
    costType: 'Marker',
    Margin_CriticalBelow: -0.0550, Margin_WarningBelow: -0.0200, Margin_WarningAbove: 0.1600, Margin_CriticalAbove: 0.2600,
    Cost_CriticalBelow: 1.7500, Cost_WarningBelow: 2.0500, Cost_WarningAbove: 2.8500, Cost_CriticalAbove: 3.1500,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0500, MarketMove_CriticalAbove: 0.1000,
    PriceDelta_CriticalBelow: -0.1600, PriceDelta_WarningBelow: -0.0800, PriceDelta_WarningAbove: 0.0800, PriceDelta_CriticalAbove: 0.1600,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0450, ReferenceStrategyDelta_CriticalAbove: 0.0900,
  },
  // Retail Config (5 rows)
  {
    id: 11, QuoteConfigurationMappingId: 301,
    configurationName: 'Retail Config',
    product: 'Unleaded 87', ProductId: 2,
    location: 'Dallas Hub', LocationId: 20,
    costType: 'Instrument',
    Margin_CriticalBelow: -0.0400, Margin_WarningBelow: -0.0150, Margin_WarningAbove: 0.1200, Margin_CriticalAbove: 0.2000,
    Cost_CriticalBelow: 1.6000, Cost_WarningBelow: 1.9000, Cost_WarningAbove: 2.7000, Cost_CriticalAbove: 3.0000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0400, MarketMove_CriticalAbove: 0.0800,
    PriceDelta_CriticalBelow: -0.1200, PriceDelta_WarningBelow: -0.0600, PriceDelta_WarningAbove: 0.0600, PriceDelta_CriticalAbove: 0.1200,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0350, ReferenceStrategyDelta_CriticalAbove: 0.0700,
  },
  {
    id: 12, QuoteConfigurationMappingId: 302,
    configurationName: 'Retail Config',
    product: 'Diesel #2', ProductId: 1,
    location: 'Houston Term.', LocationId: 10,
    costType: 'Contract',
    Margin_CriticalBelow: -0.0350, Margin_WarningBelow: -0.0100, Margin_WarningAbove: 0.1100, Margin_CriticalAbove: 0.1900,
    Cost_CriticalBelow: 1.5000, Cost_WarningBelow: 1.8000, Cost_WarningAbove: 2.8000, Cost_CriticalAbove: 3.2000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0450, MarketMove_CriticalAbove: 0.0900,
    PriceDelta_CriticalBelow: -0.1300, PriceDelta_WarningBelow: -0.0650, PriceDelta_WarningAbove: 0.0650, PriceDelta_CriticalAbove: 0.1300,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0400, ReferenceStrategyDelta_CriticalAbove: 0.0800,
  },
  {
    id: 13, QuoteConfigurationMappingId: 303,
    configurationName: 'Retail Config',
    product: 'Premium 91', ProductId: 3,
    location: 'Chicago Term.', LocationId: 30,
    costType: 'Marker',
    Margin_CriticalBelow: null, Margin_WarningBelow: null, Margin_WarningAbove: null, Margin_CriticalAbove: null,
    Cost_CriticalBelow: null, Cost_WarningBelow: null, Cost_WarningAbove: null, Cost_CriticalAbove: null,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: null, MarketMove_CriticalAbove: null,
    PriceDelta_CriticalBelow: null, PriceDelta_WarningBelow: null, PriceDelta_WarningAbove: null, PriceDelta_CriticalAbove: null,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: null, ReferenceStrategyDelta_CriticalAbove: null,
  },
  {
    id: 14, QuoteConfigurationMappingId: 304,
    configurationName: 'Retail Config',
    product: 'Unleaded 87', ProductId: 2,
    location: 'Dallas Hub', LocationId: 20,
    costType: 'Instrument',
    Margin_CriticalBelow: -0.0450, Margin_WarningBelow: -0.0150, Margin_WarningAbove: 0.1300, Margin_CriticalAbove: 0.2200,
    Cost_CriticalBelow: 1.5500, Cost_WarningBelow: 1.8500, Cost_WarningAbove: 2.7500, Cost_CriticalAbove: 3.1000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0500, MarketMove_CriticalAbove: 0.1000,
    PriceDelta_CriticalBelow: -0.1400, PriceDelta_WarningBelow: -0.0700, PriceDelta_WarningAbove: 0.0700, PriceDelta_CriticalAbove: 0.1400,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0380, ReferenceStrategyDelta_CriticalAbove: 0.0750,
  },
  {
    id: 15, QuoteConfigurationMappingId: 305,
    configurationName: 'Retail Config',
    product: 'Diesel #2', ProductId: 1,
    location: 'Houston Term.', LocationId: 10,
    costType: 'Contract',
    Margin_CriticalBelow: -0.0500, Margin_WarningBelow: -0.0200, Margin_WarningAbove: 0.1500, Margin_CriticalAbove: 0.2500,
    Cost_CriticalBelow: 1.4500, Cost_WarningBelow: 1.7500, Cost_WarningAbove: 2.9000, Cost_CriticalAbove: 3.3000,
    MarketMove_CriticalBelow: null, MarketMove_WarningBelow: null, MarketMove_WarningAbove: 0.0550, MarketMove_CriticalAbove: 0.1100,
    PriceDelta_CriticalBelow: -0.1500, PriceDelta_WarningBelow: -0.0800, PriceDelta_WarningAbove: 0.0800, PriceDelta_CriticalAbove: 0.1500,
    ReferenceStrategyDelta_CriticalBelow: null, ReferenceStrategyDelta_WarningBelow: null, ReferenceStrategyDelta_WarningAbove: 0.0450, ReferenceStrategyDelta_CriticalAbove: 0.0900,
  },
]
