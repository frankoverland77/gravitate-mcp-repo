import { PricePositioningData } from '../../CompetitorPriceProfiling.types';

export const MOTIVA_PRICE_POSITIONING: PricePositioningData = {
  cellId: 'Motiva · Port Arthur · CBOB · Price Positioning',
  title: 'Price Positioning',
  description:
    "How Motiva's price compares to the market average at this terminal-product over the selected window.",
  confidence: 'HIGH',
  takeaway:
    'Consistently priced Premium over the last 90 days — averaging +1.4¢/gal above market, with 65 of 90 prices above the +1.0¢ threshold.',
  tiles: [
    {
      label: 'Avg spread vs. market',
      value: '+1.4¢/gal',
      sub: 'Motiva − market average, 90d',
    },
    {
      label: 'Prices above +1.0¢',
      value: '65 of 90',
      sub: '72% of prices published',
    },
    {
      label: 'Min / Max spread',
      value: '+0.2¢ / +2.8¢',
      sub: 'lowest / highest daily spread, 90d',
    },
    {
      label: 'Stability',
      value: 'σ = 0.6¢',
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
      sub: '72% above +1.0¢ · ≥60% req.',
    },
  ],
  learnMore: {
    summary: 'Learn more · How Premium / Conformist / Discount / Independent are classified',
    rules: [
      {
        name: 'Premium',
        description: 'Priced ≥ +1.0¢/gal above market avg on 60%+ of prices published.',
        isCurrent: true,
      },
      {
        name: 'Discount',
        description: 'Priced ≤ −1.0¢/gal below market avg on 60%+ of prices published.',
        isCurrent: false,
      },
      {
        name: 'Conformist',
        description: 'Within ±0.5¢ of market avg on 70%+ of prices published.',
        isCurrent: false,
      },
      {
        name: 'Independent',
        description: 'High price variance, no persistent side of the market.',
        isCurrent: false,
      },
    ],
  },
};
