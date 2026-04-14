import type { InventoryQuoteRow, BenchmarkValue, PeriodData, InventoryForecastPoint } from './InventoryAnalytics.types'

const products = ['RUL 87', 'RBOB', 'Ethanol', 'Premium', 'ULSD']
const locations = ['Baltimore Terminal', 'Linden Terminal', 'Philadelphia Hub', 'Albany Terminal', 'New Haven Terminal']
const counterParties = ['Metro Petroleum', 'Greenfield Fuels', 'Coastal Supply', 'Northeast Distributors', 'Acme Energy']
const groups = ['wholesale-east', 'wholesale-west', 'retail-east']

export const inventoryGroups = [
  { id: 'wholesale-east', label: 'Wholesale East' },
  { id: 'wholesale-west', label: 'Wholesale West' },
  { id: 'retail-east', label: 'Retail East' },
]

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

function randomBetween(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min)
}

function makeBenchmarks(rand: () => number): BenchmarkValue[] {
  const symbols: ('A' | 'M' | 'O' | 'E')[] = ['A', 'M', 'O', 'E']
  return [
    { value: +(2.5 + rand() * 0.5).toFixed(4), statusSymbol: symbols[Math.floor(rand() * 4)], name: 'OPIS' },
    { value: +(2.4 + rand() * 0.6).toFixed(4), statusSymbol: symbols[Math.floor(rand() * 4)], name: 'Platts' },
  ]
}

function makePeriodData(rand: () => number): PeriodData {
  const cost = +(2.3 + rand() * 0.5).toFixed(4)
  const diff = +(0.01 + rand() * 0.08).toFixed(4)
  const price = +(cost + diff).toFixed(4)
  const liftings = Math.round(randomBetween(rand, 5000, 50000))
  return {
    liftings,
    cost,
    aggregateCost: +(cost - 0.005 + rand() * 0.01).toFixed(4),
    diff,
    aggregateDiff: +(diff - 0.002 + rand() * 0.004).toFixed(4),
    price,
    aggregatePrice: +(price - 0.003 + rand() * 0.006).toFixed(4),
    profit: Math.round(liftings * diff),
    margin: +diff.toFixed(4),
    benchmarks: makeBenchmarks(rand),
  }
}

function pickStatus(inventoryPct: number): 'containment' | 'runout' | 'normal' {
  if (inventoryPct < 0.20) return 'runout'
  if (inventoryPct > 0.90) return 'containment'
  return 'normal'
}

function pickInventoryStatus(inventoryPct: number): 'healthy' | 'low' | 'critical' | 'overstock' {
  if (inventoryPct < 0.15) return 'critical'
  if (inventoryPct < 0.30) return 'low'
  if (inventoryPct > 0.85) return 'overstock'
  return 'healthy'
}

function generateForecast(rand: () => number, currentInventory: number, tankTop: number, tankBottom: number): InventoryForecastPoint[] {
  const points: InventoryForecastPoint[] = []
  const today = new Date()
  const dailyUsage = randomBetween(rand, 800, 2500)
  let inv = currentInventory + dailyUsage * 14

  // 14 days of trailing actuals
  for (let i = -14; i <= 0; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    inv = Math.max(tankBottom, inv - dailyUsage + (rand() > 0.85 ? randomBetween(rand, 5000, 15000) : 0))
    points.push({
      date: d.toISOString().split('T')[0],
      inventory: Math.round(inv),
      isForecast: false,
    })
  }

  // Reset to current inventory at today
  inv = currentInventory

  // 16 days forecast with gradual decline and 2 batch spikes
  const batchDays = [5, 12]
  for (let i = 1; i <= 16; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    inv = Math.max(tankBottom, inv - dailyUsage * (0.8 + rand() * 0.4))
    if (batchDays.includes(i)) {
      inv = Math.min(tankTop, inv + randomBetween(rand, 15000, 35000))
    }
    points.push({
      date: d.toISOString().split('T')[0],
      inventory: Math.round(inv),
      isForecast: true,
    })
  }

  return points
}

function generateRows(): InventoryQuoteRow[] {
  const rand = seededRandom(42)
  const rows: InventoryQuoteRow[] = []

  for (let i = 0; i < 30; i++) {
    const product = products[i % products.length]
    const location = locations[Math.floor(i / 6) % locations.length]
    const counterParty = counterParties[i % counterParties.length]
    const group = groups[i % groups.length]

    const tankTop = 90000
    const tankBottom = Math.round(randomBetween(rand, 3000, 8000))
    const range = tankTop - tankBottom
    const inventoryPct = randomBetween(rand, 0.25, 0.75)
    const currentInventory = Math.round(tankBottom + range * inventoryPct)
    const currentBarrels = Math.round(currentInventory / 42)

    const dailyUsage = randomBetween(rand, 800, 2000)
    const daysOfSupply = Math.round((currentInventory - tankBottom) / dailyUsage)
    const reorderPoint = Math.round(tankBottom + dailyUsage * 7)
    const nextBatchSize = Math.round(randomBetween(rand, 15000, 40000))
    const batchDays = Math.round(randomBetween(rand, 3, 8))
    const nextBatchDate = new Date()
    nextBatchDate.setDate(nextBatchDate.getDate() + batchDays)

    const afterBatchInventory = Math.min(tankTop, currentInventory + nextBatchSize - Math.round(dailyUsage * batchDays))
    const afterBatchPct = (afterBatchInventory - tankBottom) / range

    const prior = makePeriodData(rand)
    const current = makePeriodData(rand)
    const proposedCost = +(current.cost + (rand() - 0.5) * 0.02).toFixed(4)
    const strategyBase = +(proposedCost + 0.02 + rand() * 0.03).toFixed(4)
    const marketMove = +((rand() - 0.5) * 0.01).toFixed(4)
    const proposedDiff = +(0.02 + rand() * 0.06).toFixed(4)
    const proposedPrice = +(proposedCost + proposedDiff).toFixed(4)
    const priceDelta = +(proposedPrice - prior.price).toFixed(4)
    const proposedMargin = proposedDiff
    const tempAdjustedMargin = +(proposedMargin + (rand() - 0.5) * 0.005).toFixed(4)

    const forecast = generateForecast(rand, currentInventory, tankTop, tankBottom)

    rows.push({
      id: i + 1,
      group,
      quoteConfigurationName: `${product} - ${location.split(' ')[0]}`,
      counterPartyName: counterParty,
      locationName: location,
      productName: product,
      productGroup: product.includes('UL') || product.includes('RUL') || product.includes('87') ? 'Gasoline' : product.includes('Ethanol') ? 'Ethanol' : 'Distillate',
      unitOfMeasure: 'GAL',
      prior,
      current,
      proposedCost,
      costStatusSymbol: (['A', 'M', 'O', 'E'] as const)[Math.floor(rand() * 4)],
      strategyBase,
      marketMove,
      marketMoveOverride: rand() > 0.7 ? +((rand() - 0.5) * 0.008).toFixed(4) : null,
      proposedDiff,
      proposedPrice,
      priceDelta,
      proposedMargin,
      tempAdjustedMargin,
      proposedBenchmarks: makeBenchmarks(rand),
      currentInventory,
      currentInventoryPct: +inventoryPct.toFixed(2),
      currentBarrels,
      nextBatchDate: nextBatchDate.toISOString().split('T')[0],
      nextBatchSize,
      currentStatus: pickStatus(inventoryPct),
      afterNextBatchStatus: pickStatus(afterBatchPct),
      afterBatchInventory,
      afterBatchInventoryPct: +afterBatchPct.toFixed(2),
      afterBatchBarrels: Math.round(afterBatchInventory / 42),
      afterBatchDaysOfSupply: Math.round((afterBatchInventory - tankBottom) / dailyUsage),
      averageSalesDays: Math.round(dailyUsage),
      barrels: currentBarrels,
      refineryBreakdown: rand() > 0.6,
      tankTop,
      tankBottom,
      inventoryForecast: forecast,
      daysOfSupply,
      reorderPoint,
      inventoryStatus: pickInventoryStatus(inventoryPct),
      isSpread: i >= 27,
      spreadParentId: i >= 27 ? (i - 27) + 1 : undefined,
    })
  }

  return rows
}

export const inventoryAnalyticsData: InventoryQuoteRow[] = generateRows()
