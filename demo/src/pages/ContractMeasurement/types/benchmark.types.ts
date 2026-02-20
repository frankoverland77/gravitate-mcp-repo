export interface Benchmark {
  id: string;
  name: string;
  isReference: boolean;
  publisher?: string;
  benchmarkType?: string;
  productHierarchy?: string;
  locationHierarchy?: string;
}

export interface BenchmarkData {
  delta: number | null;
  impact: number | null;
}

export interface ComparisonRowData {
  key: string;
  product: string;
  location: string;
  volume: number;
  percentTotal: number;
  benchmarkData: Record<string, BenchmarkData>;
}

export const DEFAULT_BENCHMARKS: Benchmark[] = [
  {
    id: 'rack-average',
    name: 'Rack Average',
    isReference: true,
    publisher: 'OPIS',
    benchmarkType: 'Rack Average',
    productHierarchy: 'Target Index',
    locationHierarchy: 'OPIS City',
  },
  {
    id: 'rack-low',
    name: 'Rack Low',
    isReference: false,
    publisher: 'OPIS',
    benchmarkType: 'Rack Low',
    productHierarchy: 'Target Index',
    locationHierarchy: 'OPIS City',
  },
];

export const MAX_BENCHMARKS = 4;
