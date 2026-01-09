/**
 * Scenario Types for Benchmarks Tab
 *
 * A Scenario represents a complete pricing configuration containing
 * both price formula AND volume settings for comparison analysis.
 */

export type ProductSelection = 'all' | 'gasoline' | 'diesel' | 'jet' | 'custom';
export type EntryMethod = 'benchmark' | 'formula';
export type ScenarioStatus = 'complete' | 'incomplete';

// Benchmark selection types
export type QuickBenchmarkType = 'rack-average' | 'rack-low' | 'spot-price';
export type BenchmarkPublisher = 'opis' | 'platts' | 'argus';
export type BenchmarkTypeOption = 'rack-low' | 'rack-average' | 'contract-low' | 'spot';
export type ProductHierarchy = 'target-index' | 'product-grade' | 'product-family' | 'any';
export type LocationHierarchy = 'city' | 'state' | 'padd' | 'national';

export interface SelectedBenchmark {
  type: 'quick' | 'custom';
  quickType?: QuickBenchmarkType;
  publisher?: BenchmarkPublisher;
  benchmarkType?: BenchmarkTypeOption;
  productHierarchy?: ProductHierarchy;
  locationHierarchy?: LocationHierarchy;
}

export interface BenchmarkMatchingInfo {
  matchedCount: number;
  rollupCount: number;
  totalProducts: number;
  matchPercentage: number;
}

export interface BenchmarkImpactEstimate {
  revenueDelta: number;
  revenuePercentage: number;
  marginDelta: number;
  marginPercentage: number;
}

export interface ProductMatchDetail {
  productId: string;
  productName: string;
  location: string;
  matchType: 'direct' | 'rollup' | 'none';
  price: number;
  delta: number;
}

// Formula component type for the formula builder grid
export interface ScenarioFormulaComponent {
  id: number;
  percentage: string;
  source: string;
  instrument: string;
  type: string;
  dateRule: string;
  required: boolean;
  customDisplayName?: string | null;
}

export interface Scenario {
  id: string;
  name: string;
  counterparty?: string;
  products: ProductSelection;
  customProductIds?: string[]; // Used when products === 'custom'
  status: ScenarioStatus;
  entryMethod: EntryMethod;
  isPrimary?: boolean;
  createdAt: string;
  updatedAt: string;

  // Price Configuration (TBD - placeholder structure)
  priceConfig?: {
    benchmarkId?: string;
    formulaId?: string;
    // Additional fields TBD
  };

  // Volume Configuration (TBD - placeholder structure)
  volumeConfig?: {
    allocationMethod?: string;
    rateabilityMin?: number;
    rateabilityMax?: number;
    penaltiesEnabled?: boolean;
    // Additional fields TBD
  };
}

export interface ScenarioFormData {
  name: string;
  counterparty?: string;
  products: ProductSelection;
  customProductIds?: string[];
  entryMethod: EntryMethod;
  benchmark?: SelectedBenchmark;
}

// Parameters for historical analysis
export interface AnalysisParameters {
  price: {
    lookback: '6mo' | '12mo' | '18mo' | '24mo';
    aggregation: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    method: 'weighted' | 'simple' | 'median';
  };
  volume: {
    lookback: '6mo' | '12mo' | '18mo' | '24mo';
    granularity: 'weekly' | 'monthly' | 'quarterly';
    calculation: 'sum' | 'average';
  };
}

// Cell data for comparison table
export interface ScenarioCellData {
  scenarioId: string;
  price: number;
  delta?: number; // Difference from primary
  deltaPercent?: number;
  formulaRef: string; // e.g., "OPIS Houston Rack + $0.03"
  allocation: number;
  rateability: number;
  rateabilityStatus: 'on-track' | 'at-risk' | 'below-min';
  impact?: number; // Financial impact vs primary
  isPrimary: boolean;
  isLowest?: boolean;
}

// Row data for comparison table
export interface ComparisonRowData {
  detailId: string;
  product: string;
  location: string;
  volume: number;
  percentTotal: number;
  scenarios: Record<string, ScenarioCellData>;
}

// Default parameters
export const DEFAULT_PARAMETERS: AnalysisParameters = {
  price: {
    lookback: '12mo',
    aggregation: 'monthly',
    method: 'weighted',
  },
  volume: {
    lookback: '12mo',
    granularity: 'monthly',
    calculation: 'sum',
  },
};

// Product selection options for dropdown
export const PRODUCT_OPTIONS = [
  { value: 'all', label: 'All Details (47)' },
  { value: 'gasoline', label: 'Gasoline Only (32)' },
  { value: 'diesel', label: 'Diesel Only (12)' },
  { value: 'jet', label: 'Jet Fuel Only (3)' },
  { value: 'custom', label: 'Custom Selection...' },
];

// Counterparty options for dropdown (sample data)
export const COUNTERPARTY_OPTIONS = [
  { value: 'circle-k', label: 'Circle K Stores' },
  { value: 'costco', label: 'Costco Wholesale' },
  { value: 'growmark', label: 'Growmark' },
  { value: 'pilot', label: 'Pilot Flying J' },
  { value: 'loves', label: "Love's Travel Stops" },
];

// Benchmark dropdown options
export const PUBLISHER_OPTIONS = [
  { value: 'opis', label: 'OPIS' },
  { value: 'platts', label: 'Platts' },
  { value: 'argus', label: 'Argus' },
];

export const BENCHMARK_TYPE_OPTIONS = [
  { value: 'rack-low', label: 'Rack Low' },
  { value: 'rack-average', label: 'Rack Average' },
  { value: 'contract-low', label: 'Contract Low' },
  { value: 'spot', label: 'Spot Price' },
];

export const PRODUCT_HIERARCHY_OPTIONS = [
  { value: 'target-index', label: 'Target Index (~85% match)' },
  { value: 'product-grade', label: 'Product Grade (~75% match)' },
  { value: 'product-family', label: 'Product Family (~60% match)' },
  { value: 'any', label: 'Any Match (100%)' },
];

export const LOCATION_HIERARCHY_OPTIONS = [
  { value: 'city', label: 'OPIS City' },
  { value: 'state', label: 'State/Region' },
  { value: 'padd', label: 'PADD District' },
  { value: 'national', label: 'National' },
];

// Helper to generate scenario ID
export function generateScenarioId(): string {
  return `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to create new scenario with defaults
export function createNewScenario(name: string): Scenario {
  const now = new Date().toISOString();
  return {
    id: generateScenarioId(),
    name,
    products: 'all',
    status: 'incomplete',
    entryMethod: 'benchmark',
    isPrimary: false,
    createdAt: now,
    updatedAt: now,
  };
}
