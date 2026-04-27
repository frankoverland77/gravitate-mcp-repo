import { PricePositioningData } from '../../CompetitorPriceProfiling.types';

export const MOTIVA_PRICE_POSITIONING: PricePositioningData = {
  cellId: 'Motiva · Port Arthur · CBOB · Price Positioning',
  title: 'Price Positioning',
  description:
    "How Motiva's price compares to the market average at this terminal-product over the selected window.",
  confidence: 'HIGH',
  takeaway:
    'Consistently priced Premium over the last 90 days — averaging +$0.0140/gal above market, with 65 of 90 prices above the +$0.0100 threshold.',
  tiles: [
    {
      label: 'Avg spread vs. market',
      value: '+$0.0140/gal',
      sub: 'Motiva − market average, 90d',
    },
    {
      label: 'Prices above +$0.0100',
      value: '65 of 90',
      sub: '72% of prices published',
    },
    {
      label: 'Min / Max spread',
      value: '+$0.0020 / +$0.0280',
      sub: 'lowest / highest daily spread, 90d',
    },
    {
      label: 'Stability',
      value: 'σ = $0.0060',
      sub: 'std dev of daily spread',
    },
  ],
  chartPlaceholder: {
    heading: 'Chart pending design approval',
    body: 'Option A (±1σ overlay) vs. Option B (volatility toggle) — waiting on AG decision.',
    sub: "Will plot actual dollar price against a curving market-average line with Premium and Discount bands, and Motiva's published prices as dots.",
  },
  statFit: [
    {
      label: 'Data points',
      value: '90 prices',
      sub: 'one per day, incl. weekends',
    },
    {
      label: 'Window',
      value: '90 days',
      sub: 'Jan 16 – Apr 16, 2026',
    },
    {
      label: 'Outliers removed',
      value: '2 of 90',
      sub: '|z| > 3 vs. market',
    },
    {
      label: 'Classification',
      value: 'Premium',
      sub: '72% above +$0.0100 · ≥60% req.',
    },
  ],
  learnMore: {
    summary: 'Learn more · How Premium / Conformist / Discount / Independent are classified',
    rules: [
      {
        name: 'Premium',
        description: 'Priced ≥ +$0.0100/gal above market avg on 60%+ of prices published.',
        isCurrent: true,
      },
      {
        name: 'Discount',
        description: 'Priced ≤ −$0.0100/gal below market avg on 60%+ of prices published.',
        isCurrent: false,
      },
      {
        name: 'Conformist',
        description: 'Within ±$0.0050 of market avg on 70%+ of prices published.',
        isCurrent: false,
      },
      {
        name: 'Independent',
        description: 'High price variance, no persistent side of the market.',
        isCurrent: false,
      },
      {
        name: 'Methodology' as never,
        description:
          'Tags are based on the "Standard" preset, which uses market average as the baseline. A competitor is tagged Premium or Discount when they price at least $0.0100/gal off the baseline on 60%+ of days, and Conformist when they stay within ±$0.0050 on 70%+ of days. The baseline metric and the thresholds can be customized per terminal, region, or product group in the PP Manager.',
        isCurrent: false,
      },
    ],
  },
};
