export type Confidence = 'HIGH' | 'MED' | 'LOW';

export type Classification = 'Premium' | 'Conformist' | 'Discount' | 'Independent';

export type InsightKey =
  | 'followers'
  | 'leader'
  | 'price-positioning'
  | 'pass-through'
  | 'rank';

export type PopoverId =
  | 'pop-followers'
  | 'pop-leader'
  | 'pop-strategy'
  | 'pop-passthrough'
  | 'pop-passthrough-cell'
  | 'pop-rank'
  | 'pop-conf-generic'
  | 'pop-conf-low'
  | 'pop-followers-full';

export interface Follower {
  name: string;
  pValue: number;
  lag: number;
}

export interface PassThrough {
  up: number;
  down: number;
}

export interface Rank {
  avg90: number;
  avg30: number;
}

export interface Confidences {
  followers: Confidence;
  leader: Confidence;
  pricePositioning: Confidence;
  passThrough: Confidence;
  rank: Confidence;
}

export interface CompetitorProfile {
  id: string;
  competitor: string;
  publisher: string;
  counterpartyGroup: string;
  location: string;
  region: string;
  product: string;
  productGroup: string;
  classification: Classification;
  isLeader: boolean;
  followers: Follower[];
  passThrough: PassThrough;
  rank: Rank;
  confidences: Confidences;
  observations: number;
}

export interface MetricTileData {
  label: string;
  value: string;
  sub: string;
}

export interface StatFitRow {
  label: string;
  value: string;
  sub: string;
}

export interface ClassificationRule {
  name: Classification;
  description: string;
  isCurrent: boolean;
}

export interface PricePositioningData {
  cellId: string;
  title: string;
  description: string;
  confidence: Confidence;
  takeaway: string;
  tiles: MetricTileData[];
  chartPlaceholder: {
    heading: string;
    body: string;
    sub: string;
  };
  statFit: StatFitRow[];
  learnMore: {
    summary: string;
    rules: ClassificationRule[];
  };
}

export interface LearnMoreCard {
  title: string;
  body: string;
}

export interface RankOverTimePoint {
  date: string;
  rank: number;
}

export interface RankPositionData {
  cellId: string;
  title: string;
  description: string;
  confidence: Confidence;
  takeaway: string;
  tiles: MetricTileData[];
  chartSeries: RankOverTimePoint[];
  avg90Rank: number;
  avg30Rank: number;
  statFit: StatFitRow[];
  learnMore: {
    summary: string;
    cards: LearnMoreCard[];
  };
}
