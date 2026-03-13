import type { ExceptionProfile } from './QuoteBook.types'

// Absolute components (Market Move, Ref Strategy to Price) only use "above" boundaries.
// Mapping from old model:
//   Hard + floor/ceiling → criticalBelow=floor, criticalAbove=ceiling, warning ~10% inside
//   Soft + floor/ceiling → warningBelow=floor, warningAbove=ceiling, critical=null
//   Off → all null

export const exceptionProfiles: ExceptionProfile[] = [
  {
    key: 'standard',
    name: 'Standard Day',
    tier: 'org',
    description: 'Normal market conditions. Balanced thresholds for margin, cost, and price movements.',
    isSystem: false,
    scope: 'All rows',
    badge: null,
    thresholds: [
      { component: 'Margin', colorDot: '#2563eb', criticalBelow: 1.8000, warningBelow: 2.0200, warningAbove: 3.7800, criticalAbove: 4.0000, orgCriticalBelow: 1.0000, orgWarningBelow: 1.4000, orgWarningAbove: 4.6000, orgCriticalAbove: 5.0000 },
      { component: 'Cost', colorDot: '#16a34a', criticalBelow: 1.8000, warningBelow: 2.0000, warningAbove: 3.3000, criticalAbove: 3.5000, orgCriticalBelow: 1.5000, orgWarningBelow: 1.7500, orgWarningAbove: 3.7500, orgCriticalAbove: 4.0000 },
      { component: 'Market Move', colorDot: '#d97706', criticalBelow: null, warningBelow: null, warningAbove: 0.0040, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Price Delta', colorDot: '#ec4899', criticalBelow: null, warningBelow: -0.0500, warningAbove: 0.0500, criticalAbove: null, orgCriticalBelow: -0.1000, orgWarningBelow: -0.0800, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Ref Strategy to Price', colorDot: '#06b6d4', criticalBelow: null, warningBelow: null, warningAbove: null, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0400, orgCriticalAbove: 0.0500 },
    ],
  },
  {
    key: 'containment',
    name: 'Containment',
    tier: 'org',
    description: 'Tighter margins for volatile markets or allocation events.',
    isSystem: false,
    scope: 'All rows',
    badge: { text: 'Tight', variant: 'warning' },
    thresholds: [
      { component: 'Margin', colorDot: '#2563eb', criticalBelow: 2.5000, warningBelow: 2.6000, warningAbove: 3.4000, criticalAbove: 3.5000, orgCriticalBelow: 1.0000, orgWarningBelow: 1.4000, orgWarningAbove: 4.6000, orgCriticalAbove: 5.0000 },
      { component: 'Cost', colorDot: '#16a34a', criticalBelow: 2.0000, warningBelow: 2.1000, warningAbove: 2.9000, criticalAbove: 3.0000, orgCriticalBelow: 1.5000, orgWarningBelow: 1.7500, orgWarningAbove: 3.7500, orgCriticalAbove: 4.0000 },
      { component: 'Market Move', colorDot: '#d97706', criticalBelow: null, warningBelow: null, warningAbove: 0.0016, criticalAbove: 0.0020, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Price Delta', colorDot: '#ec4899', criticalBelow: -0.0200, warningBelow: -0.0160, warningAbove: 0.0160, criticalAbove: 0.0200, orgCriticalBelow: -0.1000, orgWarningBelow: -0.0800, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Ref Strategy to Price', colorDot: '#06b6d4', criticalBelow: null, warningBelow: null, warningAbove: 0.0080, criticalAbove: 0.0100, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0400, orgCriticalAbove: 0.0500 },
    ],
  },
  {
    key: 'highVolumePush',
    name: 'High Volume Push',
    tier: 'org',
    description: 'Maximize throughput. Accept thinner margins and wider price movements.',
    isSystem: false,
    scope: 'All rows',
    badge: { text: 'Wide', variant: 'primary' },
    thresholds: [
      { component: 'Margin', colorDot: '#2563eb', criticalBelow: null, warningBelow: 1.5000, warningAbove: 5.0000, criticalAbove: null, orgCriticalBelow: 1.0000, orgWarningBelow: 1.4000, orgWarningAbove: 4.6000, orgCriticalAbove: 5.0000 },
      { component: 'Cost', colorDot: '#16a34a', criticalBelow: 1.5000, warningBelow: 1.6500, warningAbove: 3.7500, criticalAbove: 4.0000, orgCriticalBelow: 1.5000, orgWarningBelow: 1.7500, orgWarningAbove: 3.7500, orgCriticalAbove: 4.0000 },
      { component: 'Market Move', colorDot: '#d97706', criticalBelow: null, warningBelow: null, warningAbove: 0.0060, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Price Delta', colorDot: '#ec4899', criticalBelow: null, warningBelow: -0.1000, warningAbove: 0.1000, criticalAbove: null, orgCriticalBelow: -0.1000, orgWarningBelow: -0.0800, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Ref Strategy to Price', colorDot: '#06b6d4', criticalBelow: null, warningBelow: null, warningAbove: null, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0400, orgCriticalAbove: 0.0500 },
    ],
  },
  {
    key: 'marginDefense',
    name: 'Margin Defense',
    tier: 'org',
    description: 'Protect margins during cost pressure. Tightest margin floors, hard enforcement.',
    isSystem: false,
    scope: 'All rows',
    badge: { text: 'Strict', variant: 'error' },
    thresholds: [
      { component: 'Margin', colorDot: '#2563eb', criticalBelow: 2.8000, warningBelow: 2.8700, warningAbove: 3.4300, criticalAbove: 3.5000, orgCriticalBelow: 1.0000, orgWarningBelow: 1.4000, orgWarningAbove: 4.6000, orgCriticalAbove: 5.0000 },
      { component: 'Cost', colorDot: '#16a34a', criticalBelow: 1.8000, warningBelow: 1.9400, warningAbove: 3.0600, criticalAbove: 3.2000, orgCriticalBelow: 1.5000, orgWarningBelow: 1.7500, orgWarningAbove: 3.7500, orgCriticalAbove: 4.0000 },
      { component: 'Market Move', colorDot: '#d97706', criticalBelow: null, warningBelow: null, warningAbove: 0.0020, criticalAbove: 0.0025, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Price Delta', colorDot: '#ec4899', criticalBelow: -0.0300, warningBelow: -0.0240, warningAbove: 0.0240, criticalAbove: 0.0300, orgCriticalBelow: -0.1000, orgWarningBelow: -0.0800, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Ref Strategy to Price', colorDot: '#06b6d4', criticalBelow: null, warningBelow: null, warningAbove: 0.0080, criticalAbove: 0.0100, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0400, orgCriticalAbove: 0.0500 },
    ],
  },
  {
    key: 'aggressive',
    name: 'Aggressive Sales',
    tier: 'org',
    description: 'Wider thresholds for aggressive pricing. When pushing volume or competing hard.',
    isSystem: false,
    scope: 'All rows',
    badge: { text: 'Wide', variant: 'primary' },
    thresholds: [
      { component: 'Margin', colorDot: '#2563eb', criticalBelow: null, warningBelow: 1.0000, warningAbove: 5.0000, criticalAbove: null, orgCriticalBelow: 1.0000, orgWarningBelow: 1.4000, orgWarningAbove: 4.6000, orgCriticalAbove: 5.0000 },
      { component: 'Cost', colorDot: '#16a34a', criticalBelow: 1.5000, warningBelow: 1.6500, warningAbove: 3.7500, criticalAbove: 4.0000, orgCriticalBelow: 1.5000, orgWarningBelow: 1.7500, orgWarningAbove: 3.7500, orgCriticalAbove: 4.0000 },
      { component: 'Market Move', colorDot: '#d97706', criticalBelow: null, warningBelow: null, warningAbove: 0.0050, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Price Delta', colorDot: '#ec4899', criticalBelow: null, warningBelow: -0.0800, warningAbove: 0.0800, criticalAbove: null, orgCriticalBelow: -0.1000, orgWarningBelow: -0.0800, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Ref Strategy to Price', colorDot: '#06b6d4', criticalBelow: null, warningBelow: null, warningAbove: null, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0400, orgCriticalAbove: 0.0500 },
    ],
  },
  {
    key: 'default',
    name: 'Default',
    tier: 'personal',
    description: 'Fallback thresholds applied when no profile is assigned. Cannot be deleted or renamed.',
    isSystem: true,
    scope: 'All rows',
    badge: { text: 'System', variant: 'default' },
    thresholds: [
      { component: 'Margin', colorDot: '#2563eb', criticalBelow: 1.8000, warningBelow: 2.0200, warningAbove: 3.7800, criticalAbove: 4.0000, orgCriticalBelow: 1.0000, orgWarningBelow: 1.4000, orgWarningAbove: 4.6000, orgCriticalAbove: 5.0000 },
      { component: 'Cost', colorDot: '#16a34a', criticalBelow: 1.8000, warningBelow: 2.0000, warningAbove: 3.3000, criticalAbove: 3.5000, orgCriticalBelow: 1.5000, orgWarningBelow: 1.7500, orgWarningAbove: 3.7500, orgCriticalAbove: 4.0000 },
      { component: 'Market Move', colorDot: '#d97706', criticalBelow: null, warningBelow: null, warningAbove: 0.0040, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Price Delta', colorDot: '#ec4899', criticalBelow: null, warningBelow: -0.0500, warningAbove: 0.0500, criticalAbove: null, orgCriticalBelow: -0.1000, orgWarningBelow: -0.0800, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Ref Strategy to Price', colorDot: '#06b6d4', criticalBelow: null, warningBelow: null, warningAbove: null, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0400, orgCriticalAbove: 0.0500 },
    ],
  },
  {
    key: 'q1Winter',
    name: 'Q1 Winter Blend',
    tier: 'personal',
    description: 'Adjusted for winter product mix and seasonal spreads.',
    isSystem: false,
    scope: 'All rows',
    badge: null,
    thresholds: [
      { component: 'Margin', colorDot: '#2563eb', criticalBelow: 1.8000, warningBelow: 2.0400, warningAbove: 3.9600, criticalAbove: 4.2000, orgCriticalBelow: 1.0000, orgWarningBelow: 1.4000, orgWarningAbove: 4.6000, orgCriticalAbove: 5.0000 },
      { component: 'Cost', colorDot: '#16a34a', criticalBelow: 1.9000, warningBelow: 2.0900, warningAbove: 3.6100, criticalAbove: 3.8000, orgCriticalBelow: 1.5000, orgWarningBelow: 1.7500, orgWarningAbove: 3.7500, orgCriticalAbove: 4.0000 },
      { component: 'Market Move', colorDot: '#d97706', criticalBelow: null, warningBelow: null, warningAbove: 0.0040, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Price Delta', colorDot: '#ec4899', criticalBelow: null, warningBelow: -0.0600, warningAbove: 0.0600, criticalAbove: null, orgCriticalBelow: -0.1000, orgWarningBelow: -0.0800, orgWarningAbove: 0.0800, orgCriticalAbove: 0.1000 },
      { component: 'Ref Strategy to Price', colorDot: '#06b6d4', criticalBelow: null, warningBelow: null, warningAbove: null, criticalAbove: null, orgCriticalBelow: null, orgWarningBelow: null, orgWarningAbove: 0.0400, orgCriticalAbove: 0.0500 },
    ],
  },
]

export const exceptionProfileMap: Record<string, ExceptionProfile> = Object.fromEntries(
  exceptionProfiles.map(p => [p.key, p])
)
