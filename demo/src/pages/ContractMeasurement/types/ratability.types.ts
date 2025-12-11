export type RatabilityPeriod = 'weekly' | 'monthly' | 'quarterly' | 'annual';
export type VarianceThreshold = '1%' | '5%' | '10%' | 'custom';
export type CalculationMethod = 'simple-target' | 'rolling-average';

export interface RatabilitySettings {
  primaryPeriod: RatabilityPeriod;
  varianceThreshold: VarianceThreshold;
  customThresholdPercent?: number;
  calculationMethod: CalculationMethod;
  rollingPeriods: number;
  excludeOutliers: boolean;
  minimumPeriods: number;
  lastUpdated: Date;
}

export const DEFAULT_RATABILITY_SETTINGS: RatabilitySettings = {
  primaryPeriod: 'monthly',
  varianceThreshold: '5%',
  customThresholdPercent: 5,
  calculationMethod: 'simple-target',
  rollingPeriods: 3,
  excludeOutliers: false,
  minimumPeriods: 3,
  lastUpdated: new Date()
};

export const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Weekly', description: 'Higher sensitivity to short-term variations' },
  { value: 'monthly', label: 'Monthly', description: 'Recommended for most contracts' },
  { value: 'quarterly', label: 'Quarterly', description: 'Broader trend analysis' },
  { value: 'annual', label: 'Annual', description: 'Long-term consistency view' },
];

export const VARIANCE_OPTIONS = [
  { value: '1%', label: '±1%', description: 'Very Strict - minimal tolerance for variance' },
  { value: '5%', label: '±5%', description: 'Recommended - balanced tolerance' },
  { value: '10%', label: '±10%', description: 'Moderate - more flexible tolerance' },
  { value: 'custom', label: 'Custom', description: 'Set your own threshold percentage' },
];

export const CALCULATION_OPTIONS = [
  {
    value: 'simple-target',
    label: 'Simple Target',
    description: 'Compare against static contract targets. Best for fixed-volume contracts.'
  },
  {
    value: 'rolling-average',
    label: 'Rolling Average',
    description: 'Compare against rolling average of recent performance. Best for variable contracts.'
  },
];
