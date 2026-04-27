import type {
  Confidence,
  MetricTileData,
  StatFitRow,
  ClassificationRule,
} from '../../CompetitorPriceProfiling.types';

export interface PassthroughScatterPoint {
  x: number; // spot price change ($/gal)
  y: number; // posted price change ($/gal)
}

export interface PassthroughScatterSeries {
  id: string;
  data: PassthroughScatterPoint[];
}

export interface SpotPassthroughData {
  cellId: string;
  title: string;
  description: string;
  confidence: Confidence;
  takeaway: string;
  up: number;
  down: number;
  upSlope: number;
  downSlope: number;
  upInterceptDollars: number;
  downInterceptDollars: number;
  upR2: number;
  downR2: number;
  upN: number;
  downN: number;
  tiles: MetricTileData[];
  statFit: StatFitRow[];
  learnMore: {
    summary: string;
    rules: ClassificationRule[];
  };
  scatter: PassthroughScatterSeries[];
}

// Deterministic seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Gaussian via Box–Muller using a seeded uniform
function makeGaussian(rand: () => number) {
  return function gauss() {
    let u = 0;
    let v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };
}

function generateScatter({
  seed,
  n,
  slope,
  interceptDollars,
  xMinDollars,
  xMaxDollars,
  noiseDollars,
}: {
  seed: number;
  n: number;
  slope: number;
  interceptDollars: number;
  xMinDollars: number;
  xMaxDollars: number;
  noiseDollars: number;
}): PassthroughScatterPoint[] {
  const rand = mulberry32(seed);
  const gauss = makeGaussian(rand);
  const points: PassthroughScatterPoint[] = [];
  for (let i = 0; i < n; i += 1) {
    const x = xMinDollars + rand() * (xMaxDollars - xMinDollars);
    const y = slope * x + interceptDollars + gauss() * noiseDollars;
    points.push({ x: Number(x.toFixed(5)), y: Number(y.toFixed(5)) });
  }
  return points;
}

const UP_SLOPE = 0.92;
const DOWN_SLOPE = 0.78;
const UP_INTERCEPT = 0.001; // dollars
const DOWN_INTERCEPT = -0.0005; // dollars

const upDays = generateScatter({
  seed: 20260416,
  n: 48,
  slope: UP_SLOPE,
  interceptDollars: UP_INTERCEPT,
  xMinDollars: 0.002, // positive moves only ($0.0020/gal)
  xMaxDollars: 0.06, // $0.0600/gal
  noiseDollars: 0.0055,
});

const downDays = generateScatter({
  seed: 20260417,
  n: 42,
  slope: DOWN_SLOPE,
  interceptDollars: DOWN_INTERCEPT,
  xMinDollars: -0.06, // negative moves only
  xMaxDollars: -0.002,
  noiseDollars: 0.0055,
});

// Classification flag matches PassThroughCell.tsx line 21 logic.
const ASYM_THRESHOLD = 10;
const asymGap = Math.abs(92 - 78);
const isAsym = asymGap >= ASYM_THRESHOLD;
const classification = isAsym ? 'ASYM' : 'SYM';

export const MOTIVA_SPOT_PASSTHROUGH: SpotPassthroughData = {
  cellId: 'Motiva · Port Arthur · CBOB · Spot Pass-through',
  title: 'Spot Pass-through',
  description:
    "How quickly Motiva's posted price moves when the spot price moves — split into up-day and down-day responsiveness.",
  confidence: 'HIGH',
  takeaway:
    'Asymmetric pass-through — faster to raise (92%) than to lower (78%). 14-pt gap triggers ASYM.',
  up: 92,
  down: 78,
  upSlope: UP_SLOPE,
  downSlope: DOWN_SLOPE,
  upInterceptDollars: UP_INTERCEPT,
  downInterceptDollars: DOWN_INTERCEPT,
  upR2: 0.86,
  downR2: 0.81,
  upN: 48,
  downN: 42,
  tiles: [
    {
      label: 'Up-day slope',
      value: 'β 0.92',
      sub: 'R²=0.86 · n=48',
    },
    {
      label: 'Down-day slope',
      value: 'β 0.78',
      sub: 'R²=0.81 · n=42',
    },
    {
      label: 'Asymmetry gap',
      value: '14 pts',
      sub: 'up-day β − down-day β',
    },
    {
      label: 'Classification',
      value: classification,
      sub: '≥ 10-pt gap between up / down β',
    },
  ],
  statFit: [
    {
      label: 'Data points',
      value: '90 paired observations',
      sub: '48 up-days + 42 down-days',
    },
    {
      label: 'Window',
      value: '90 days',
      sub: 'Jan 21 – Apr 21, 2026',
    },
    {
      label: 'Outliers removed',
      value: '3 of 90',
      sub: '|z| > 3 on spot Δ',
    },
    {
      label: 'Classification',
      value: classification,
      sub: '14-pt gap · ≥ 10-pt threshold',
    },
  ],
  learnMore: {
    summary: 'Learn more · OLS regression methodology',
    rules: [
      {
        // Phase 2 repurposes `name` as the rule-card heading. Cast to satisfy
        // the Phase-1 `ClassificationRule` type without modifying it.
        name: 'What the regression fits' as ClassificationRule['name'],
        description:
          'Posted-price Δ regressed on spot Δ via ordinary least squares. Up-days and down-days fit separately so asymmetric response shows up in the slopes.',
        isCurrent: false,
      },
      {
        name: 'Why split by direction' as ClassificationRule['name'],
        description:
          'A single combined slope hides whether a competitor raises faster than they lower. Splitting captures that asymmetry directly.',
        isCurrent: false,
      },
      {
        name: 'What ASYM means' as ClassificationRule['name'],
        description:
          "When the gap between up-day β and down-day β is ≥ 10 percentage points, the competitor is flagged ASYM. Motiva's gap is 14 points.",
        isCurrent: false,
      },
      {
        name: 'Underlying statistics' as ClassificationRule['name'],
        description:
          'Up-day slope β = 0.92 (R² = 0.86, n = 48). Down-day slope β = 0.78 (R² = 0.81, n = 42). R² measures how closely posted-price moves track spot moves — higher means the relationship is more predictable.',
        isCurrent: false,
      },
    ],
  },
  scatter: [
    { id: 'Up-days', data: upDays },
    { id: 'Down-days', data: downDays },
  ],
};
