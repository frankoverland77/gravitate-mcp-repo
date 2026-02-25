/**
 * Shared Supply Options Data
 *
 * Generates supply option rows with integrated price and volume commitment data.
 * Each row represents a unique origin/supplier/channel combination with:
 *   - Price info: price, priceRank, delta (vs proposed cost)
 *   - Volume commitments per period (Month, Week): Forecast, Liftings, Status,
 *     To Date Forecast, To Date % of Forecast
 *
 * Used by the unified SupplyOptionsView analytics grid and the main DeliveredPricing page
 * for strategy-based default cost selection.
 */

import type { DeliveredPricingQuoteRow } from './DeliveredPricing.data'
import type { SupplyException } from '../../shared/data'

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
  /** Delta between this supply option price and the quote book's proposed cost */
  delta: number
  channel: string
  /** Volume commitment data per period — null for Rack options */
  month: PeriodVolume | null
  week: PeriodVolume | null
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

/** Derive commitment status from the To Date % of Forecast value */
function deriveStatus(toDatePctOfForecast: number): string {
  if (toDatePctOfForecast >= 90) return 'On Track'
  if (toDatePctOfForecast >= 50) return 'Behind'
  return 'At Risk'
}

/** Contract status assignment per quote row: index → target status category */
type ContractStatusTarget = 'at-risk' | 'behind' | 'no-commitment' | 'on-track'

/**
 * Returns the target status for each contract index (0-based among contracts only).
 * Each quote row gets: 1 at-risk, 1 behind, 1 no-commitment, rest on-track.
 * The specific indices rotate based on the quote row seed for variety.
 */
function getContractStatusTarget(contractIndex: number, quoteSeed: number): ContractStatusTarget {
  // Rotate the assignment based on the quote row so different rows highlight different contracts
  const offset = quoteSeed % 7
  const adjusted = (contractIndex + offset) % 7
  if (adjusted === 0) return 'at-risk'
  if (adjusted === 1) return 'behind'
  if (adjusted === 2) return 'no-commitment'
  return 'on-track'
}

/**
 * Generate volume metrics for a single period with a target TD% range.
 * - on-track:  TD% 90–110 (capped at 110%)
 * - behind:    TD% 50–89
 * - at-risk:   TD% 10–49
 */
function generatePeriodVolume(
  baseSeed: number,
  ci: number,
  periodBase: number,
  targetStatus: 'on-track' | 'behind' | 'at-risk'
): PeriodVolume {
  const cellSeed = baseSeed + ci * 17

  // Forecast
  const forecast = seededValue(cellSeed, periodBase)

  // To Date Forecast (40-90% of forecast)
  const tdSeed = cellSeed + 93
  const tdPct = 0.4 + ((tdSeed % 51) / 100)
  const toDateForecast = Math.round(forecast * tdPct)

  // Determine target TD% range based on status, then pick a value within it using seed
  const rangeSeed = cellSeed + 31
  let targetTdPct: number
  switch (targetStatus) {
    case 'on-track':
      // 90–110%, capped at 110%
      targetTdPct = 90 + (rangeSeed % 21) // 90 to 110
      break
    case 'behind':
      // 50–89%
      targetTdPct = 50 + (rangeSeed % 40) // 50 to 89
      break
    case 'at-risk':
      // 10–49%
      targetTdPct = 10 + (rangeSeed % 40) // 10 to 49
      break
  }

  // Derive liftings from the target TD% and toDateForecast
  const liftings = toDateForecast > 0 ? Math.round(toDateForecast * (targetTdPct / 100)) : 0

  // Recompute actual TD% from the rounded values
  const toDatePctOfForecast = toDateForecast > 0 ? Math.round((liftings / toDateForecast) * 100) : 0

  // Cap On Track at 110%
  const cappedPct = targetStatus === 'on-track' ? Math.min(toDatePctOfForecast, 110) : toDatePctOfForecast
  const cappedLiftings = targetStatus === 'on-track' && toDatePctOfForecast > 110
    ? Math.round(toDateForecast * 1.1)
    : liftings

  const status = deriveStatus(cappedPct)

  return {
    forecast,
    liftings: cappedLiftings,
    status,
    toDateForecast,
    toDatePctOfForecast: cappedPct,
  }
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
  // Track the contract index separately for status assignment
  let contractIdx = 0

  SUPPLY_OPTIONS.forEach(([origin, supplier, channel], idx) => {
    const rowSeed = (idx + 1) * 31 + Math.round(priceSeed)
    // Price variation per entry
    const priceVariation = Number(((rowSeed % 101 - 50) / 10000).toFixed(4))
    // Base price anchored to a stable value, varied per entry
    const basePrice = anchorPrice + ((rowSeed % 200) - 100) / 10000
    // Clamp final price to 2.01 – 2.75
    const price = Number(Math.min(2.75, Math.max(2.01, basePrice + priceVariation)).toFixed(4))
    // Delta: supply option price vs the quote book's proposed cost
    const proposedCost = selectedRow.Cost ?? 0
    const delta = Number((price - proposedCost).toFixed(4))

    // Volume data: only for non-Rack entries
    let month: PeriodVolume | null = null
    let week: PeriodVolume | null = null

    if (channel !== 'Rack') {
      const ci = commitmentIdx
      const isDayDealChevron = channel === 'Day Deal' && supplier === 'Chevron' && origin === 'Houston'

      if (channel === 'Contract') {
        // Each quote row gets: 1 at-risk, 1 behind, 1 no-commitment, rest on-track
        const target = getContractStatusTarget(contractIdx, selectedRow.id)
        contractIdx++

        if (target === 'no-commitment') {
          // No volume commitment for this contract
          month = null
          week = null
        } else {
          month = generatePeriodVolume(volumeSeed + 1000, ci, 50000, target)
          week = generatePeriodVolume(volumeSeed + 2000, ci, 12000, target)
        }
      } else {
        // Day Deal — weekly-only, on-track status
        month = isDayDealChevron ? null : generatePeriodVolume(volumeSeed + 1000, ci, 50000, 'on-track')
        week = generatePeriodVolume(volumeSeed + 2000, ci, 12000, 'on-track')
      }

      commitmentIdx++
    }

    rows.push({
      id: idx + 1,
      originLocation: origin,
      supplier,
      price,
      priceRank: 0,
      delta,
      channel,
      month,
      week,
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
 * Compute structured exception alerts for a quote book row based on its strategy selection.
 *
 * Exception types (with severity):
 * - "Lower price" (info) — a viable option is cheaper than the active selection
 * - "Over lifting" (critical) — active Contract exceeds 100% of monthly forecast
 * - "Under lifting" (warning) — active Contract below 75% of monthly forecast
 * - "Day Deal" (info) — a Day Deal option is cheaper than the strategy price
 *
 * Returns an array of structured exceptions (or null if none).
 */
export function computeQuoteRowExceptions(
  _quoteRow: DeliveredPricingQuoteRow,
  supplyOptions: SupplyOptionRow[],
  activeOption: SupplyOptionRow | null
): SupplyException[] | null {
  if (!activeOption || !supplyOptions.length) return null

  const alerts: SupplyException[] = []
  const strategyPrice = activeOption.price

  // 1. A viable supply option has a lower price than the strategy selection.
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
    const savings = Number((strategyPrice - cheaperOption.price).toFixed(4))
    alerts.push({
      label: 'Lower price',
      severity: 'info',
      detail: `${cheaperOption.supplier} ${cheaperOption.channel} is $${savings.toFixed(4)} cheaper`,
    })
  }

  // 2. Contract lifting status — only applies when the active selection is a Contract
  if (activeOption.channel === 'Contract' && activeOption.month?.toDatePctOfForecast != null) {
    if (activeOption.month.toDatePctOfForecast > 100) {
      alerts.push({
        label: 'Over lifting',
        severity: 'critical',
        detail: `${activeOption.supplier} at ${activeOption.month.toDatePctOfForecast}% of monthly forecast`,
      })
    } else if (activeOption.month.toDatePctOfForecast < 75) {
      alerts.push({
        label: 'Under lifting',
        severity: 'warning',
        detail: `${activeOption.supplier} at ${activeOption.month.toDatePctOfForecast}% of monthly forecast — needs volume`,
      })
    }
  }

  // 3. Day Deal price is lower than strategy-selected price
  const cheaperDayDeal = supplyOptions.find(
    (o) => o.channel === 'Day Deal' && o.id !== activeOption.id && o.price < strategyPrice
  )
  if (cheaperDayDeal) {
    const savings = Number((strategyPrice - cheaperDayDeal.price).toFixed(4))
    alerts.push({
      label: 'Day Deal',
      severity: 'info',
      detail: `Day Deal at $${cheaperDayDeal.price.toFixed(4)} saves $${savings.toFixed(4)}`,
    })
  }

  return alerts.length > 0 ? alerts : null
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
