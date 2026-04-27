import { PricePositioningPreset } from './PPTagManager.types';

export const SEED_PRESETS: PricePositioningPreset[] = [
  {
    id: 'standard',
    name: 'Standard',
    isDefault: true,
    scope: { type: 'all' },
    baseline: 'market-avg',
    magnitudeThresholdDollars: 0.01,
    frequencyThresholdPct: 60,
    updatedAt: '2026-04-24',
  },
  {
    id: 'california-rack',
    name: 'California Rack — wider spreads',
    isDefault: false,
    scope: { type: 'region', value: 'West Coast' },
    baseline: 'market-avg',
    magnitudeThresholdDollars: 0.015,
    frequencyThresholdPct: 65,
    updatedAt: '2026-04-12',
  },
  {
    id: 'gulf-coast-cbob',
    name: 'Gulf Coast CBOB — tighter',
    isDefault: false,
    scope: { type: 'terminal', value: 'Port Arthur, TX' },
    baseline: 'market-avg',
    magnitudeThresholdDollars: 0.007,
    frequencyThresholdPct: 70,
    updatedAt: '2026-03-30',
  },
];
