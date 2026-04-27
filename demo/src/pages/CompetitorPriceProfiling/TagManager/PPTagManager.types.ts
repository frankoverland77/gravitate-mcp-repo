export type BaselineMetric = 'market-avg' | 'second-low' | 'rack-low';

export type ScopeType = 'all' | 'terminal' | 'region' | 'product-group';

export interface PresetScope {
  type: ScopeType;
  value?: string;
}

export interface PricePositioningPreset {
  id: string;
  name: string;
  isDefault: boolean;
  scope: PresetScope;
  baseline: BaselineMetric;
  magnitudeThresholdDollars: number;
  frequencyThresholdPct: number;
  updatedAt: string;
}

export const BASELINE_LABELS: Record<BaselineMetric, string> = {
  'market-avg': 'Market average',
  'second-low': 'Second low',
  'rack-low': 'Rack low',
};

export const SCOPE_TYPE_LABELS: Record<ScopeType, string> = {
  all: 'All terminals',
  terminal: 'Terminal',
  region: 'Region',
  'product-group': 'Product group',
};

export const TERMINAL_OPTIONS = [
  'Port Arthur, TX',
  'Houston, TX',
  'Los Angeles, CA',
  'New York Harbor',
  'Chicago, IL',
];

export const REGION_OPTIONS = ['Gulf Coast', 'West Coast', 'Midwest', 'Northeast'];

export const PRODUCT_GROUP_OPTIONS = ['Gasoline', 'Diesel', 'Jet Fuel'];
