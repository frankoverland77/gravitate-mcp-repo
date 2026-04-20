export type Confidence = 'HIGH' | 'MED' | 'LOW';

export type Classification = 'Premium' | 'Conformist' | 'Discount' | 'Independent';

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
