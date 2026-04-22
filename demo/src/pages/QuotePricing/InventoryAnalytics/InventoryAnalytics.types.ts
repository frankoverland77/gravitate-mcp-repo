export type BenchmarkValue = {
  value: number
  statusSymbol: 'A' | 'M' | 'O' | 'E'
  name: string
}

export type PeriodData = {
  liftings: number
  cost: number
  aggregateCost: number
  diff: number
  aggregateDiff: number
  price: number
  aggregatePrice: number
  profit: number
  margin: number
  benchmarks: BenchmarkValue[]
}

export type InventoryRecordType = 'actual' | 'estimate'

export type InventoryForecastPoint = {
  date: string
  inventory: number
  recordType: InventoryRecordType
}

export type InventoryQuoteRow = {
  id: number
  group: string
  quoteConfigurationName: string
  counterPartyName: string
  locationName: string
  productName: string
  productGroup: string
  unitOfMeasure: string
  prior: PeriodData
  current: PeriodData
  proposedCost: number
  costStatusSymbol: 'A' | 'M' | 'O' | 'E'
  strategyBase: number
  marketMove: number
  marketMoveOverride: number | null
  proposedDiff: number
  proposedPrice: number
  priceDelta: number
  proposedMargin: number
  tempAdjustedMargin: number
  proposedBenchmarks: BenchmarkValue[]
  currentInventory: number
  currentInventoryPct: number
  currentBarrels: number
  nextBatchDate: string
  nextBatchSize: number
  currentStatus: 'containment' | 'runout' | 'normal'
  afterNextBatchStatus: 'containment' | 'runout' | 'normal'
  afterBatchInventory: number
  afterBatchInventoryPct: number
  afterBatchBarrels: number
  lastUpdated: string
  barrels: number
  refineryBreakdown: boolean
  tankTop: number
  tankBottom: number
  inventoryForecast: InventoryForecastPoint[]
  reorderPoint: number
  inventoryStatus: 'healthy' | 'low' | 'critical' | 'overstock'
  isSpread: boolean
  spreadParentId?: number
}

export type AnalyticsViewType =
  | 'inventory'
  | 'total_volume'
  | 'unified_view'
  | 'liftings_vs_benchmark'
  | 'liftings_vs_margin'
  | 'customer_liftings'
  | 'competitor_prices'
  | 'allocation'

export type PublicationMode = 'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay'
