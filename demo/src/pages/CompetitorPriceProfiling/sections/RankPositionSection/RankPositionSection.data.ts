import { RankPositionData } from '../../CompetitorPriceProfiling.types';

export const MOTIVA_RANK_POSITION: RankPositionData = {
  cellId: 'Motiva · Port Arthur · CBOB · Rank Position',
  title: 'Rank Position Over Time',
  description:
    "How Motiva's rank against the 7 refiners at this terminal-product has drifted over the window. Lower rank number = cheaper.",
  confidence: 'HIGH',
  takeaway:
    'Averaging rank 2 of 7 (90d), drifted to rank 3 of 7 (30d) — ▼ worsen 1 rank more expensive.',
  tiles: [
    {
      label: '90d avg rank',
      value: '2 of 7',
      sub: 'average daily rank, 90d',
    },
    {
      label: '30d avg rank',
      value: '3 of 7',
      sub: 'average daily rank, last 30d',
    },
    {
      label: 'Change',
      value: '▼ 1 rank',
      sub: 'worsen = more expensive',
    },
    {
      label: 'Best / worst rank',
      value: '1 / 4',
      sub: 'across the 90-day window',
    },
  ],
  avg90Rank: 2,
  avg30Rank: 3,
  chartSeries: [
    { date: '2026-01-21', rank: 2 },
    { date: '2026-01-28', rank: 2 },
    { date: '2026-02-04', rank: 1 },
    { date: '2026-02-11', rank: 2 },
    { date: '2026-02-18', rank: 1 },
    { date: '2026-02-25', rank: 2 },
    { date: '2026-03-04', rank: 2 },
    { date: '2026-03-11', rank: 2 },
    { date: '2026-03-18', rank: 2 },
    { date: '2026-03-25', rank: 3 },
    { date: '2026-04-01', rank: 3 },
    { date: '2026-04-08', rank: 4 },
    { date: '2026-04-15', rank: 3 },
  ],
  statFit: [
    {
      label: 'Data points',
      value: '90 daily ranks',
      sub: 'one per day this competitor posted',
    },
    {
      label: 'Window',
      value: '90 days',
      sub: 'Jan 21 – Apr 21, 2026',
    },
    {
      label: 'Tie handling',
      value: 'dense rank',
      sub: 'ties share a rank, next rank unskipped',
    },
    {
      label: 'Classification',
      value: 'Drifting up',
      sub: '+1 rank over last 30d vs. 90d avg',
    },
  ],
  learnMore: {
    summary: 'Learn more · How rank is computed and why the scale is inverted',
    cards: [
      {
        title: 'Inverted scale',
        body: 'Rank 1 is the cheapest price at this terminal-product for the day. Rank 7 is the priciest. "Drifting up" in rank number = more expensive.',
      },
      {
        title: 'Daily ranks only',
        body: "Ranks are computed per day, only for days this competitor posted a price. Missing days don't interpolate.",
      },
      {
        title: 'Whole integers',
        body: 'No decimal ranks. Tied prices get dense rank.',
      },
    ],
  },
};
