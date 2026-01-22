/**
 * RFP Management Types
 *
 * Types for the Request for Proposal (RFP) management feature
 * enabling large retail fuel buyers to compare supplier bids.
 */

export type RFPStatus = 'draft' | 'round1' | 'round2' | 'awarded';
export type ProductGroup = 'gasoline' | 'diesel';
export type RFPRound = number; // 1, 2, 3, 4... (any positive integer)
export type AllocationLevel = 'flexible' | 'moderate' | 'strict'; // Legacy - use AllocationPeriod for new code
export type AllocationPeriod = 'daily' | 'weekly' | 'tri-weekly' | 'monthly' | 'quarterly';
export type MetricStatus = 'pass' | 'fail';
export type SupplierDisposition = 'advance' | 'eliminate' | 'pending';
export type SortOption = 'recommended' | 'price-low' | 'volume' | 'fewest-issues';
export type DetailMetric = 'price' | 'volume' | 'ratability' | 'allocation' | 'penalties';
export type HistoricalMetric = 'price' | 'volume';

// Analysis parameter types for modal
export type HistoryLookback = '6mo' | '12mo' | '18mo' | '24mo';
export type AggregationMethod = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type PriceMethod = 'weighted' | 'simple' | 'median';
export type VolumeGranularity = 'weekly' | 'monthly' | 'quarterly';
export type VolumeCalculation = 'sum' | 'average';

// Importance factor keys for AI ranking
export type ImportanceFactor = 'price' | 'volume' | 'ratability' | 'allocation' | 'penalties';

// Importance ranking config - lower number = higher priority
export interface ImportanceRankingConfig {
  price: number; // 1-5
  volume: number;
  ratability: number;
  allocation: number;
  penalties: number;
}

// Screen navigation for RFP tab
// Now supports dynamic round screens: 'round1', 'round2', 'round3', etc.
export type RFPScreen = 'list' | `round${number}` | 'award' | 'success';

/**
 * Main RFP entity - container for procurement process
 */
export interface RFP {
  id: string;
  name: string;
  market: string;
  status: RFPStatus;
  currentRound: RFPRound | null;
  targetPrice: number | null;
  createdAt: string;
  supplierCount: number;
  winnerName?: string; // For awarded RFPs
}

/**
 * Supplier metrics for comparison
 */
export interface SupplierMetrics {
  avgPrice: number;
  totalVolume: number; // gallons/month
  ratability: number; // volume requirement (e.g., 80000 = 80K/mo)
  ratabilityStatus: MetricStatus;
  allocation: AllocationLevel; // Legacy field - kept for backwards compatibility
  allocationPeriod: AllocationPeriod; // New field - actual allocation frequency
  allocationStatus: MetricStatus;
  penalties: number; // $/gal
  penaltiesStatus: MetricStatus;
  issues: number; // count of threshold violations
}

/**
 * Individual supplier bid submission
 */
export interface Supplier {
  id: string;
  name: string;
  bidName?: string; // Bid variant name (e.g., "Best Price Option")
  bidCode?: string; // Short code for compact views: "A", "B", etc.
  isIncumbent: boolean;
  rank: number;
  score: number; // composite score for ranking
  metrics: SupplierMetrics;
  isEliminated?: boolean;
  eliminatedInRound?: RFPRound;
}

/**
 * Threshold configuration for flagging issues
 */
export interface ThresholdConfig {
  penaltyMax: number; // cents/gal
  ratabilityMin: number; // percentage
  ratabilityMax: number; // percentage
  allocationMin: AllocationPeriod;
}

/**
 * Parameter configuration for analysis lookback periods
 */
export interface ParameterConfig {
  // Price History
  priceHistoryLookback: HistoryLookback;
  priceAggregation: AggregationMethod;
  priceMethod: PriceMethod;
  // Volume History
  volumeHistoryLookback: HistoryLookback;
  volumeGranularity: VolumeGranularity;
  volumeCalculation: VolumeCalculation;
}

/**
 * Product/location detail row data
 */
export interface DetailRow {
  id: string;
  product: '87 Octane' | '93 Octane' | 'Diesel';
  location: 'Dallas' | 'Beaumont' | 'Houston';
  supplierValues: Record<string, number>; // supplierId -> value for current metric
}

/**
 * AI recommendation for supplier
 */
export interface AIRecommendation {
  rank: number;
  supplierId: string;
  supplierName: string;
  price: string;
  tags: string[];
}

/**
 * Contract preview for Award screen
 */
export interface ContractPreview {
  name: string;
  counterparty: string;
  startDate: string;
  endDate: string;
  pricingFormula: string;
  volumeCommitment: string;
}

/**
 * Summary stats for RFP list
 */
export interface RFPListStats {
  activeRFPs: number;
  inRound2: number;
  awardedThisYear: number;
  totalSuppliers: number;
}

/**
 * Historical bid data for round-over-round comparison chart
 */
export interface RoundBidData {
  supplierId: string;
  supplierName: string;
  isIncumbent: boolean;
  r1Price: number;
  r1Volume: number;
  r2Price: number | null; // null if R2 not yet submitted
  r2Volume: number | null;
  priceChange: number | null; // calculated delta (negative = improvement)
}

/**
 * Terminal history data point for time-series chart
 */
export interface TerminalHistoryDataPoint {
  date: Date;
  dateLabel: string;
  volume: number; // gallons lifted
  contractPrice: number; // what user paid
  rackAverage: number; // market benchmark (PRIMARY)
  spotPrice: number; // spot market
  rackAvgDiff: number; // contract vs rack (contractPrice - rackAverage)
  spotDiff: number; // contract vs spot (contractPrice - spotPrice)
}

/**
 * Terminal history data for time-series comparison chart
 */
export interface TerminalHistoryData {
  terminalId: string;
  terminalName: string;
  period: string; // e.g., "Last 12 Months"
  data: TerminalHistoryDataPoint[];
  // Current RFP context for overlay
  rfpProposedVolume: number; // gallons/month
  rfpProposedPrice: number; // $/gal
  avgHistoricalPrice: number; // calculated average for reference line
}

// Time period options for terminal history chart
export type TerminalHistoryPeriod = '6mo' | '12mo' | '18mo' | '24mo';

export const TERMINAL_HISTORY_PERIOD_OPTIONS: Array<{
  value: TerminalHistoryPeriod;
  label: string;
}> = [
  { value: '6mo', label: '6 Months' },
  { value: '12mo', label: '12 Months' },
  { value: '18mo', label: '18 Months' },
  { value: '24mo', label: '24 Months' },
];

// Default threshold configuration
export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  penaltyMax: 2, // 2 cents/gal
  ratabilityMin: 90,
  ratabilityMax: 110,
  allocationMin: 'monthly',
};

// Default parameter configuration
export const DEFAULT_PARAMETERS: ParameterConfig = {
  priceHistoryLookback: '12mo',
  priceAggregation: 'monthly',
  priceMethod: 'weighted',
  volumeHistoryLookback: '12mo',
  volumeGranularity: 'monthly',
  volumeCalculation: 'sum',
};

// History lookback options for dropdowns
export const HISTORY_LOOKBACK_OPTIONS: Array<{ value: HistoryLookback; label: string }> = [
  { value: '6mo', label: '6 Months' },
  { value: '12mo', label: '12 Months' },
  { value: '18mo', label: '18 Months' },
  { value: '24mo', label: '24 Months' },
];

// Aggregation method options for dropdowns
export const AGGREGATION_METHOD_OPTIONS: Array<{ value: AggregationMethod; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

// Price method options for dropdowns
export const PRICE_METHOD_OPTIONS: Array<{ value: PriceMethod; label: string }> = [
  { value: 'weighted', label: 'Weighted Average' },
  { value: 'simple', label: 'Simple Average' },
  { value: 'median', label: 'Median' },
];

// Volume granularity options for dropdowns
export const VOLUME_GRANULARITY_OPTIONS: Array<{ value: VolumeGranularity; label: string }> = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

// Volume calculation options for dropdowns
export const VOLUME_CALCULATION_OPTIONS: Array<{ value: VolumeCalculation; label: string }> = [
  { value: 'sum', label: 'Sum' },
  { value: 'average', label: 'Average' },
];

// Default importance ranking for AI recommendations
export const DEFAULT_IMPORTANCE_RANKING: ImportanceRankingConfig = {
  price: 1,
  volume: 2,
  ratability: 3,
  allocation: 4,
  penalties: 5,
};

// Importance factor labels for display
export const IMPORTANCE_FACTOR_LABELS: Record<ImportanceFactor, string> = {
  price: 'Price Competitiveness',
  volume: 'Volume Flexibility',
  ratability: 'Ratability',
  allocation: 'Allocation Tolerance',
  penalties: 'Penalty Terms',
};

// Sort option labels
export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'recommended', label: 'Gravitate Recommended' },
  { value: 'price-low', label: 'Price (Low to High)' },
  { value: 'volume', label: 'Volume Capacity' },
  { value: 'fewest-issues', label: 'Fewest Issues' },
];

// Product options for filtering
export const PRODUCT_OPTIONS = ['87 Octane', '93 Octane', 'Diesel'] as const;

// Location options for filtering
export const LOCATION_OPTIONS = ['Dallas', 'Beaumont', 'Houston'] as const;

// Market index options
export const MARKET_INDEX_OPTIONS = [
  { value: 'cbob-gulf', label: 'CBOB Gulf Coast' },
  { value: 'cbob-atlantic', label: 'CBOB Atlantic' },
  { value: 'ulsd-gulf', label: 'ULSD Gulf Coast' },
  { value: 'ulsd-midwest', label: 'ULSD Midwest' },
];

// Price assumption options
export const PRICE_ASSUMPTION_OPTIONS = [
  { value: 'current', label: 'Current Market' },
  { value: 'forward-curve', label: 'Forward Curve' },
  { value: 'flat', label: "Flat (Today's Price)" },
];

// Comparison period options
export const COMPARISON_PERIOD_OPTIONS = [
  { value: 'annual', label: 'Annual' },
  { value: 'q1', label: 'Q1' },
  { value: 'q2', label: 'Q2' },
  { value: 'q3', label: 'Q3' },
  { value: 'q4', label: 'Q4' },
  { value: 'custom', label: 'Custom Range' },
];

// Allocation level options (legacy)
export const ALLOCATION_OPTIONS: Array<{ value: AllocationLevel; label: string }> = [
  { value: 'flexible', label: 'Flexible only' },
  { value: 'moderate', label: 'Moderate OK' },
  { value: 'strict', label: 'Any' },
];

// Allocation period options (new)
export const ALLOCATION_PERIOD_OPTIONS: Array<{ value: AllocationPeriod; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'tri-weekly', label: 'Tri-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

// Helper to format allocation period for display
export function formatAllocationPeriod(period: AllocationPeriod): string {
  const labels: Record<AllocationPeriod, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    'tri-weekly': 'Tri-Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
  };
  return labels[period];
}

// Helper to generate RFP ID
export function generateRFPId(): string {
  return `rfp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to generate Supplier ID
export function generateSupplierId(): string {
  return `supplier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Eliminated supplier tracking per round
 */
export interface EliminatedSupplierInfo {
  supplierId: string;
  supplierName: string;
  eliminatedInRound: number;
  priceAtElimination: number;
  reason: string; // User-provided elimination reason
}

/**
 * Product group averages per supplier
 * Used for collapsible "Avg Price" row breakdown
 */
export interface ProductGroupMetrics {
  gasoline: Record<string, number>; // supplierId -> avg price for gasoline (87 + 93 octane)
  diesel: Record<string, number>; // supplierId -> avg price for diesel
}

// ============================================================================
// FORMULA/PROVISION TYPES - For Excel bid editing workflow
// Matches Contract Management FormulaVariable structure for seamless RFP-to-Contract transitions
// ============================================================================

/**
 * Formula variable - matches Contract Management FormulaVariable
 * Represents a single price index component in a formula
 */
export interface FormulaVariable {
  id: string;
  variableName: string; // Pattern: var_{index}_group_{groupNum}
  displayName: string | null;

  // Price Source
  pricePublisher: PricePublisher;
  priceInstrument: string; // 'CBOB USGC', 'ULSD Gulf', etc.
  priceType: PriceType;
  dateRule: DateRule;

  // Calculation
  percentage: number; // Default 100
  differential: number; // +/- adjustment in $/gal
}

/**
 * Formula definition for structured pricing
 */
export interface Formula {
  id: string;
  name: string;
  formulaExpression: string; // Human-readable expression
  variables: FormulaVariable[];
}

/**
 * Provision type for bid pricing
 */
export type ProvisionType = 'Fixed' | 'Formula' | 'Lesser Of 2' | 'Lesser Of 3';

/**
 * Provision status for validation
 */
export type ProvisionStatus = 'Valid' | 'Needs Configuration' | 'Needs Price';

/**
 * Bid provision - pricing configuration for a supplier's bid on a detail row
 */
export interface BidProvision {
  id: string;
  supplierId: string;
  detailId: string;
  provisionType: ProvisionType;
  fixedValue: number | null;
  formula: Formula | null;
  displayPrice: number; // Resolved price for display
  status: ProvisionStatus;
}

/**
 * Extended DetailRow with formula support - backward compatible
 */
export interface DetailRowExtended extends Omit<DetailRow, 'supplierValues'> {
  supplierValues: Record<string, number>; // For existing UI
  supplierProvisions: Record<string, BidProvision>; // Formula data
}

// Price publisher options
export type PricePublisher = 'OPIS' | 'Platts' | 'Argus';

// Price type options
export type PriceType = 'Low' | 'High' | 'Average' | 'Mean';

// Date rule options
export type DateRule = 'Prior Day' | 'Month Average' | 'Week Average' | 'Day Of';

// Reference data options for Excel dropdowns
export const PRICE_PUBLISHER_OPTIONS: PricePublisher[] = ['OPIS', 'Platts', 'Argus'];

export const PRICE_TYPE_OPTIONS: PriceType[] = ['Low', 'High', 'Average', 'Mean'];

export const DATE_RULE_OPTIONS: DateRule[] = ['Prior Day', 'Month Average', 'Week Average', 'Day Of'];

export const PROVISION_TYPE_OPTIONS: ProvisionType[] = ['Fixed', 'Formula', 'Lesser Of 2', 'Lesser Of 3'];

// Common price instruments by product type
export const PRICE_INSTRUMENT_OPTIONS: Record<string, string[]> = {
  gasoline: ['CBOB USGC', 'CBOB Atlantic', 'RBOB USGC', 'RBOB NYH'],
  diesel: ['ULSD USGC', 'ULSD NYH', 'ULSD Midwest', 'ULSD LA'],
};

/**
 * Bid change tracking for import validation
 */
export interface BidChange {
  detailId: string;
  supplierId: string;
  supplierName: string;
  product: string;
  location: string;
  field: string;
  oldValue: string | number;
  newValue: string | number;
  changeType: 'price' | 'formula' | 'provision_type';
}

/**
 * Validation result for imported bids
 */
export interface BidValidationResult {
  isValid: boolean;
  errors: BidValidationError[];
  warnings: BidValidationWarning[];
  changes: BidChange[];
}

export interface BidValidationError {
  row: number;
  field: string;
  message: string;
  value?: string | number;
}

export interface BidValidationWarning {
  row: number;
  field: string;
  message: string;
  value?: string | number;
}
