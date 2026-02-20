/**
 * Shared Supply Options Data
 *
 * Generates supply option rows with integrated price and volume commitment data.
 * Each row represents a unique origin/supplier/channel combination with:
 *   - Price info: price, priceRank, change
 *   - Volume commitments per period (Month, Week, Day): Forecast, Liftings, Status,
 *     To Date Forecast, To Date % of Forecast
 *
 * Used by the unified SupplyOptionsView analytics grid and the main DeliveredPricing page
 * for strategy-based default cost selection.
 */

import type { DeliveredPricingQuoteRow } from './DeliveredPricing.data'

/** Volume metrics for a single period */
export interface PeriodVolume {
  forecast: number | null
  liftings: number | null
  status: string | null
  toDateForecast: number | null
  toDatePctOfForecast: number | null
}

export interface SupplyOptionRow {
  id: number
  originLocation: string
  supplier: string
  price: number
  priceRank: number
  change: number
  channel: string
  /** Volume commitment data per period — null for Rack options */
  month: PeriodVolume | null
  week: PeriodVolume | null
  day: PeriodVolume | null
}

/** Fixed supply option entries: [origin, supplier, channel] */
export const SUPPLY_OPTIONS: Array<[string, string, string]> = [
  // Day Deal — only Chevron Houston
  ['Houston', 'Chevron', 'Day Deal'],
  // Contracts
  ['Houston', 'Chevron', 'Contract'],
  ['Houston', 'Valero', 'Contract'],
  ['Houston', 'Marathon', 'Contract'],
  ['Beaumont', 'Motiva', 'Contract'],
  ['Dallas', 'Marathon', 'Contract'],
  ['Dallas', 'Motiva', 'Contract'],
  ['Dallas', 'Valero', 'Contract'],
  // Rack Houston
  ['Houston', 'Valero', 'Rack'],
  ['Houston', 'Motiva', 'Rack'],
  ['Houston', 'Chevron', 'Rack'],
  ['Houston', 'Marathon', 'Rack'],
  // Rack Dallas
  ['Dallas', 'Valero', 'Rack'],
  ['Dallas', 'Marathon', 'Rack'],
  ['Dallas', 'Motiva', 'Rack'],
  ['Dallas', 'HF Sinclair', 'Rack'],
]

/** Non-Rack supply options (used for Volume Commitments) */
export const COMMITMENT_ENTRIES = SUPPLY_OPTIONS.filter(([, , ch]) => ch !== 'Rack')

/** Seeded value generator for deterministic demo data */
function seededValue(seed: number, base: number): number {
  return Math.round(base + ((seed * 7 + 13) % 97) * (base / 80))
}

/** Generate volume metrics for a single period */
function generatePeriodVolume(baseSeed: number, ci: number, periodBase: number): PeriodVolume {
  const cellSeed = baseSeed + ci * 17

  // Forecast
  const forecast = seededValue(cellSeed, periodBase)

  // Liftings (60-100% of forecast)
  const liftSeed = cellSeed + 31
  const liftPct = 0.6 + ((liftSeed % 41) / 100)
  const liftings = Math.round(forecast * liftPct)

  // Status
  const statuses = ['On Track', 'Behind', 'Ahead', 'At Risk']
  const statusSeed = cellSeed + 62
  const status = statuses[statusSeed % statuses.length]

  // To Date Forecast (40-90% of forecast)
  const tdSeed = cellSeed + 93
  const tdPct = 0.4 + ((tdSeed % 51) / 100)
  const toDateForecast = Math.round(forecast * tdPct)

  // To Date % of Forecast
  const toDatePctOfForecast = toDateForecast > 0 ? Math.round((liftings / toDateForecast) * 100) : 0

  return { forecast, liftings, status, toDateForecast, toDatePctOfForecast }
}

export function generateSupplyOptionsData(selectedRow: DeliveredPricingQuoteRow): SupplyOptionRow[] {
  const rows: SupplyOptionRow[] = []
  // Use stable fields for seeding — id and QuoteConfigurationMappingId never change
  // when the user selects supply options (unlike Cost which updates on selection)
  const priceSeed = selectedRow.id * 7 + selectedRow.QuoteConfigurationMappingId * 31
  const volumeSeed = selectedRow.id * 13 + (selectedRow.QuoteConfigurationMappingId ?? 0)
  // Anchor price derived from stable row fields, centred within the 2.01–2.75 range
  const anchorRaw = 2.01 + ((priceSeed % 740) / 1000) // 2.01 – 2.75
  const anchorPrice = Number(Math.min(2.75, Math.max(2.01, anchorRaw)).toFixed(4))

  // Track the commitment index (only non-Rack entries get volume data)
  let commitmentIdx = 0

  SUPPLY_OPTIONS.forEach(([origin, supplier, channel], idx) => {
    const rowSeed = (idx + 1) * 31 + Math.round(priceSeed)
    // Change in points per gallon (e.g. 0.0001 = 1 point, 0.0100 = 1 cent)
    const change = Number(((rowSeed % 101 - 50) / 10000).toFixed(4))
    // Base price anchored to a stable value, varied per entry
    const basePrice = anchorPrice + ((rowSeed % 200) - 100) / 10000
    // Clamp final price to 2.01 – 2.75
    const price = Number(Math.min(2.75, Math.max(2.01, basePrice + change)).toFixed(4))

    // Volume data: only for non-Rack entries
    let month: PeriodVolume | null = null
    let week: PeriodVolume | null = null
    let day: PeriodVolume | null = null

    if (channel !== 'Rack') {
      const ci = commitmentIdx
      const isDayDealChevron = channel === 'Day Deal' && supplier === 'Chevron' && origin === 'Houston'

      // Month — null for Day Deal Chevron Houston (weekly-only)
      month = isDayDealChevron ? null : generatePeriodVolume(volumeSeed + 1000, ci, 50000)
      // Week
      week = generatePeriodVolume(volumeSeed + 2000, ci, 12000)
      // Day — null for Day Deal Chevron Houston (weekly-only)
      day = isDayDealChevron ? null : generatePeriodVolume(volumeSeed + 3000, ci, 2000)

      commitmentIdx++
    }

    rows.push({
      id: idx + 1,
      originLocation: origin,
      supplier,
      price,
      priceRank: 0,
      change,
      channel,
      month,
      week,
      day,
    })
  })

  // Assign absolute price rank across all rows (1 = lowest price)
  const sorted = [...rows].sort((a, b) => a.price - b.price)
  sorted.forEach((row, idx) => {
    row.priceRank = idx + 1
  })

  return rows
}

/**
 * Get the monthly To Date % of Forecast for each supply option (by ID).
 * Used by the Low Lifting strategy to pick the option with the lowest monthly utilization.
 */
export function getMonthlyToDatePctBySupplyOption(
  selectedRow: DeliveredPricingQuoteRow
): Map<number, number> {
  const options = generateSupplyOptionsData(selectedRow)
  const result = new Map<number, number>()

  for (const row of options) {
    if (row.month?.toDatePctOfForecast != null) {
      result.set(row.id, row.month.toDatePctOfForecast)
    }
  }

  return result
}

/**
 * Compute exception alerts for a quote book row based on its strategy selection.
 *
 * Exception types:
 * - "Lower price available" — a Rack or non-over-lifted Contract has a lower price than the active selection
 * - "Over lifting contract" — the active selection is a Contract and its MTD % of forecast exceeds 100%
 * - "Under lifting contract" — the active selection is a Contract and its MTD % of forecast is below 75%
 * - "Day Deal volume requirement" — a Day Deal option's price is lower than the strategy price
 *
 * Returns a string summary of exceptions (or null if none).
 */
export function computeQuoteRowExceptions(
  _quoteRow: DeliveredPricingQuoteRow,
  supplyOptions: SupplyOptionRow[],
  activeOption: SupplyOptionRow | null
): string | null {
  if (!activeOption || !supplyOptions.length) return null

  const alerts: string[] = []
  const strategyPrice = activeOption.price

  // 1. A viable supply option has a lower price than the strategy selection.
  //    Viable = Rack (no volume constraints) or Contract with MTD % of forecast under 100%
  //    (an over-lifted contract is not a viable cheaper alternative).
  const cheaperOption = supplyOptions.find((o) => {
    if (o.id === activeOption.id || o.price >= strategyPrice) return false
    if (o.channel === 'Rack') return true
    if (o.channel === 'Contract') {
      const pct = o.month?.toDatePctOfForecast
      return pct == null || pct < 100
    }
    return false
  })
  if (cheaperOption) {
    alerts.push('Lower price available')
  }

  // 2. Contract lifting status — only applies when the active selection is a Contract
  if (activeOption.channel === 'Contract' && activeOption.month?.toDatePctOfForecast != null) {
    if (activeOption.month.toDatePctOfForecast > 100) {
      alerts.push('Over lifting contract')
    } else if (activeOption.month.toDatePctOfForecast < 75) {
      alerts.push('Under lifting contract')
    }
  }

  // 3. Day Deal price is lower than strategy-selected price — signals volume opportunity
  const cheaperDayDeal = supplyOptions.find(
    (o) => o.channel === 'Day Deal' && o.id !== activeOption.id && o.price < strategyPrice
  )
  if (cheaperDayDeal) {
    alerts.push('Day Deal volume requirement')
  }

  return alerts.length > 0 ? alerts.join(' · ') : null
}

/**
 * Resolve which supply option should be selected by default given a strategy.
 *
 * - "Lowest Price": lowest price across all supply options
 * - "Lowest Rack": lowest price among Rack-only supply options
 * - "Lowest Contract": lowest price among Contract-only supply options
 * - "Average Rack": the Rack option closest to the average Rack price
 * - "Allocation Maintenance": the non-Rack option with the lowest monthly To Date % of Forecast
 *   (selects the supplier most in need of volume to maintain allocation commitments)
 */
export function resolveStrategyDefault(
  strategy: string,
  supplyOptions: SupplyOptionRow[],
  liftingPctMap: Map<number, number>
): SupplyOptionRow | null {
  if (!supplyOptions.length) return null

  switch (strategy) {
    case 'Lowest Price': {
      return supplyOptions.reduce((best, row) =>
        row.price < best.price ? row : best
      )
    }
    case 'Lowest Rack': {
      const racks = supplyOptions.filter((r) => r.channel === 'Rack')
      if (!racks.length) return null
      return racks.reduce((best, row) =>
        row.price < best.price ? row : best
      )
    }
    case 'Lowest Contract': {
      const contracts = supplyOptions.filter((r) => r.channel === 'Contract')
      if (!contracts.length) return null
      return contracts.reduce((best, row) =>
        row.price < best.price ? row : best
      )
    }
    case 'Average Rack': {
      const racks = supplyOptions.filter((r) => r.channel === 'Rack')
      if (!racks.length) return null
      const avgPrice = racks.reduce((sum, r) => sum + r.price, 0) / racks.length
      // Select the Rack option closest to the average price
      return racks.reduce((best, row) =>
        Math.abs(row.price - avgPrice) < Math.abs(best.price - avgPrice) ? row : best
      )
    }
    case 'Allocation Maintenance': {
      // Select the non-Rack option with the lowest monthly To Date % of Forecast
      // i.e. the supplier most behind on commitments and needing volume
      const nonRack = supplyOptions.filter((r) => r.channel !== 'Rack')
      if (!nonRack.length) return null
      let best = nonRack[0]
      let bestPct = liftingPctMap.get(best.id) ?? Infinity
      for (const row of nonRack) {
        const pct = liftingPctMap.get(row.id) ?? Infinity
        if (pct < bestPct) {
          best = row
          bestPct = pct
        }
      }
      return best
    }
    default:
      return supplyOptions.reduce((best, row) =>
        row.price < best.price ? row : best
      )
  }
}
