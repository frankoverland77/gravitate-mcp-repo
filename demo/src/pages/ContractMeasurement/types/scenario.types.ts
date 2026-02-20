/**
 * Scenario Types for Benchmarks Tab
 *
 * A Scenario represents a complete pricing configuration containing
 * both price formula AND volume settings for comparison analysis.
 *
 * Uses shared types for consistency with other fuel industry demos.
 */

// Import shared types for price publisher consistency
import type { PricePublisher } from '../../../shared/types'

// Re-export for backward compatibility
export type { PricePublisher as BenchmarkPublisherType }

export type ProductSelection = 'all' | 'gasoline' | 'diesel' | 'biodiesel' | 'custom';
export type EntryMethod = 'benchmark' | 'formula' | 'upload';
export type ScenarioStatus = 'complete' | 'incomplete';

// Detail status for formula scenario per-detail configuration
export type DetailStatus = 'empty' | 'in-progress' | 'confirmed';

// Benchmark selection types
export type BenchmarkType = 'rack-average' | 'rack-low' | 'spot-price' | 'opis-contract' | 'custom';
export type QuickBenchmarkType = 'rack-average' | 'rack-low' | 'spot-price' | 'opis-contract';
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

export interface ManagedBenchmark {
  id: string;
  name: string;
  publisher: BenchmarkPublisher;
  benchmarkType: BenchmarkTypeOption;
  productHierarchy: ProductHierarchy;
  locationHierarchy: LocationHierarchy;
  description: string;
}

export interface BenchmarkMatchingInfo {
  matchedCount: number;
  rollupCount: number;
  noMatchCount: number;
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
  hasMissingPrices?: boolean;
  availablePriceCount?: number;
  totalPriceCount?: number;
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

// Per-detail formula configuration for formula scenarios
export interface DetailFormulaConfig {
  detailId: string;
  name: string; // e.g., "Regular Gasoline - Houston"
  product: string;
  location: string;
  status: DetailStatus;
  components: ScenarioFormulaComponent[];
  hasTemplate?: boolean;
}

// Clipboard state for copy/paste workflow
export interface FormulaClipboard {
  hasContent: boolean;
  sourceId: string | null;
  sourceName: string;
  components: ScenarioFormulaComponent[];
}

export interface Scenario {
  id: string;
  name: string;
  counterparty?: string;
  products: ProductSelection;
  customProductIds?: string[]; // Used when products === 'custom'
  status: ScenarioStatus;
  entryMethod: EntryMethod;
  isReference?: boolean;
  createdAt: string;
  updatedAt: string;

  // Price Configuration
  priceConfig?: {
    source: 'managed' | 'adhoc';
    managedBenchmarkId?: string;
    benchmarkId?: string;
    formulaId?: string;
    publisher?: BenchmarkPublisher;
    productHierarchy?: ProductHierarchy;
    locationHierarchy?: LocationHierarchy;
    diff?: {
      sign: '+' | '-';
      amount: number;
    };
  };

  // Volume Configuration (TBD - placeholder structure)
  volumeConfig?: {
    allocationMethod?: string;
    rateabilityMin?: number;
    rateabilityMax?: number;
    penaltiesEnabled?: boolean;
    // Additional fields TBD
  };

  // Per-detail formula configurations (for formula entry method)
  detailFormulas?: DetailFormulaConfig[];
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
    lookback: '30d' | '3mo' | '6mo' | '12mo' | 'full';
    method: 'simple' | 'weekly-median' | 'monthly-median';
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
  delta?: number; // Difference from reference
  deltaPercent?: number;
  formulaRef: string; // e.g., "OPIS Houston Rack + $0.03"
  allocation: number;
  rateability: number;
  rateabilityStatus: 'on-track' | 'at-risk' | 'below-min';
  impact?: number; // Financial impact vs reference
  isReference: boolean;
  isLowest?: boolean;
  isMissingPrice?: boolean;
  missingPriceInfo?: { available: number; total: number };
}

// Row data for comparison table
export interface ComparisonRowData {
  detailId: string;
  product: string;
  location: string;
  volume: number;
  percentTotal: number;
  contractPrice: number;
  productGroup: string;
  locationRegion: string;
  scenarios: Record<string, ScenarioCellData>;
}

// Grouping types
export type GroupingDimension = 'none' | 'product-family' | 'region';

export const GROUPING_OPTIONS: Array<{ value: GroupingDimension; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'product-family', label: 'Product Family' },
  { value: 'region', label: 'Region' },
];

export interface GroupHeaderRow {
  isGroupHeader: true;
  groupKey: string;
  groupLabel: string;
  rowCount: number;
  totalVolume: number;
  totalPercentage: number;
  contractPrice: number;
  aggregatedScenarios: Record<
    string,
    {
      avgPrice: number;
      avgDelta: number | undefined;
      totalVolume: number;
      totalImpact: number;
    }
  >;
}

export type TableRow = (ComparisonRowData & { isGroupHeader?: false; groupKey?: string }) | GroupHeaderRow;

// Blended reference summary (when rows have different reference scenarios)
export interface BlendedReferenceSummary {
  weightedAvgDelta: number
  assignedCount: number
  totalCount: number
  coveragePercent: number
  groupBreakdowns: BlendedGroupBreakdown[]
}

export interface BlendedGroupBreakdown {
  groupKey: string
  groupLabel: string
  avgDelta: number
  assignedCount: number
  totalCount: number
  referenceLabel: string // scenario name, "Mixed", or "-- (unassigned)"
}

// Default parameters
export const DEFAULT_PARAMETERS: AnalysisParameters = {
  price: {
    lookback: '12mo',
    method: 'simple',
  },
  volume: {
    lookback: '12mo',
    granularity: 'monthly',
    calculation: 'sum',
  },
};

// Product selection options for dropdown - dynamically generated from shared data
import { generateProductSelectionOptions } from '../../../shared/data'

export const PRODUCT_OPTIONS = generateProductSelectionOptions()

// Counterparty options for dropdown - using shared data
// Note: These are derived from shared counterparties for consistency
import { getCustomerOptions } from '../../../shared/data'

// Generate COUNTERPARTY_OPTIONS from shared customer data
export const COUNTERPARTY_OPTIONS = getCustomerOptions().map((c) => ({
  value: c.label.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  label: c.label,
}))

// Benchmark dropdown options - using shared price publisher data
import { PRICE_PUBLISHER_OPTIONS } from '../../../shared/data'

export const PUBLISHER_OPTIONS = PRICE_PUBLISHER_OPTIONS.map((p) => ({
  value: p.toLowerCase(),
  label: p,
}))

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
    isReference: false,
    createdAt: now,
    updatedAt: now,
  };
}
