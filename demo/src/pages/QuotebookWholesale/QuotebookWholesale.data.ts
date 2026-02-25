export interface QuotebookWholesaleRow {
  QuoteConfigurationMappingId: number
  QuoteConfigurationName: string
  QuoteConfigurationMappingGroupId: number
  QuoteConfigurationMappingGroup: string
  ProductName: string
  ProductGroup: string
  LocationName: string
  UnitOfMeasureName: string
  SupplierCounterPartyName: string
  CostStatusSymbol: string
  Cost: number
  StrategyBaseValue: number
  Adjustment: number
  ProposedPrice: number
  MarketMoveValue: number
  PriorLiftings: number
  PriorCost: number
  PriorDiff: number
  PriorProfit: number
  PriorPrice: number
  SecondPriorLiftings: number
  SecondPriorPrice: number
  SecondPriorProfit: number
  Margin: number
  Allocation: number
  LatestQuoteDate: string
  NetOrGross: string
}

const products = ['87 Gas', '89 Gas', '93 Gas', 'ULSD2', 'ULSD Dyed'] as const
const locations = ['Chicago', 'Houston', 'Bainbridge', 'Baltimore', 'Tulsa'] as const

const productGroups: Record<string, string> = {
  '87 Gas': 'Gasoline',
  '89 Gas': 'Gasoline',
  '93 Gas': 'Gasoline',
  ULSD2: 'Distillate',
  'ULSD Dyed': 'Distillate',
}

const basePrices: Record<string, number> = {
  '87 Gas': 2.45,
  '89 Gas': 2.58,
  '93 Gas': 2.72,
  ULSD2: 3.15,
  'ULSD Dyed': 3.28,
}

const locationPremiums: Record<string, number> = {
  Chicago: 0.08,
  Houston: -0.03,
  Bainbridge: 0.12,
  Baltimore: 0.06,
  Tulsa: -0.01,
}

const suppliers = ['Valero', 'Marathon', 'Phillips 66', 'Citgo', 'Shell']

function round(n: number, decimals = 4): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function seededBetween(seed: number, min: number, max: number): number {
  return round(min + seededRandom(seed) * (max - min))
}

function generateRow(product: string, location: string, index: number): QuotebookWholesaleRow {
  const base = basePrices[product] + locationPremiums[location]
  const cost = round(base + seededBetween(index * 7 + 1, -0.05, 0.05))
  const adjustment = round(seededBetween(index * 13 + 3, -0.04, 0.08))
  const proposedPrice = round(cost + adjustment)
  const priorPrice = round(proposedPrice + seededBetween(index * 17 + 5, -0.1, 0.1))
  const priorCost = round(cost + seededBetween(index * 19 + 7, -0.03, 0.03))
  const priorDiff = round(priorPrice - priorCost)
  const priorLiftings = Math.floor(seededRandom(index * 23 + 11) * 50000) + 5000
  const priorProfit = round(priorDiff * priorLiftings)
  const secondPriorPrice = round(priorPrice + seededBetween(index * 29 + 13, -0.08, 0.08))
  const secondPriorLiftings = Math.floor(seededRandom(index * 31 + 17) * 45000) + 4000
  const secondPriorProfit = round((secondPriorPrice - priorCost) * secondPriorLiftings)
  const now = new Date()
  const recentDate = new Date(now.getTime() - seededRandom(index * 37 + 19) * 3600000)

  return {
    QuoteConfigurationMappingId: 1000 + index,
    QuoteConfigurationName: `${productGroups[product]} - Standard`,
    QuoteConfigurationMappingGroupId: productGroups[product] === 'Gasoline' ? 1 : 2,
    QuoteConfigurationMappingGroup: productGroups[product],
    ProductName: product,
    ProductGroup: productGroups[product],
    LocationName: location,
    UnitOfMeasureName: 'GAL',
    SupplierCounterPartyName: suppliers[index % 5],
    CostStatusSymbol: ['A', 'A', 'A', 'M', 'A'][index % 5],
    Cost: cost,
    StrategyBaseValue: round(cost + seededBetween(index * 41 + 23, -0.02, 0.02)),
    Adjustment: adjustment,
    ProposedPrice: proposedPrice,
    MarketMoveValue: round(seededBetween(index * 43 + 29, -0.03, 0.03)),
    PriorLiftings: priorLiftings,
    PriorCost: priorCost,
    PriorDiff: priorDiff,
    PriorProfit: priorProfit,
    PriorPrice: priorPrice,
    SecondPriorLiftings: secondPriorLiftings,
    SecondPriorPrice: secondPriorPrice,
    SecondPriorProfit: secondPriorProfit,
    Margin: round(proposedPrice - cost),
    Allocation: Math.floor(seededRandom(index * 47 + 31) * 100),
    LatestQuoteDate: recentDate.toISOString(),
    NetOrGross: index % 2 === 0 ? 'Net' : 'Gross',
  }
}

export function generateQuotebookWholesaleData(): QuotebookWholesaleRow[] {
  const rows: QuotebookWholesaleRow[] = []
  let index = 0
  for (const location of locations) {
    for (const product of products) {
      rows.push(generateRow(product, location, index))
      index++
    }
  }
  return rows
}

export const quotebookWholesaleData = generateQuotebookWholesaleData()
