/**
 * Tax Management Data
 *
 * Fuel excise tax rate reference data for the Delivered Pricing proof of concept.
 * Each row represents a per-gallon tax rate at a federal, state, or local level
 * for a commodity group (gasoline or diesel).
 *
 * Tax is destination-driven: the applicable tax rate is determined by the
 * delivery location's jurisdiction, not the origin terminal.
 */

import { LOCATIONS } from '../../../shared/data'

// ============================================================================
// TYPES
// ============================================================================

export type TaxLevel = 'Federal' | 'State' | 'Local'

export interface TaxRate {
  id: number
  /** Tax jurisdiction level */
  TaxLevel: TaxLevel
  /** Jurisdiction name (e.g. "Federal", state name, or city/county name) */
  Jurisdiction: string
  /** State abbreviation (null for federal) */
  State: string | null
  /** Commodity group */
  Commodity: 'Gasoline' | 'Diesel'
  /** Per-gallon tax rate in dollars (4 decimal places, e.g. 0.1840) */
  RatePerGallon: number
  /** Rate effective date */
  EffectiveDate: string
  /** Rate expiration date (null = open-ended) */
  ExpirationDate: string | null
  /** Whether this rate is currently active */
  IsActive: boolean
}

// ============================================================================
// SHARED CONSTANTS
// ============================================================================

/** Federal excise tax rates (per gallon) */
const FEDERAL_RATES = {
  Gasoline: 0.184,
  Diesel: 0.244,
} as const

/**
 * Approximate state fuel tax rates per gallon (simplified for POC).
 * These are representative values — real rates change frequently and
 * may include multiple components (excise, sales, inspection fees, etc.).
 */
const STATE_TAX_RATES: Record<string, { Gasoline: number; Diesel: number }> = {
  TX: { Gasoline: 0.2000, Diesel: 0.2000 },
  OK: { Gasoline: 0.1900, Diesel: 0.1900 },
  KS: { Gasoline: 0.2441, Diesel: 0.2600 },
  NE: { Gasoline: 0.2460, Diesel: 0.2460 },
  IA: { Gasoline: 0.3000, Diesel: 0.3250 },
  MO: { Gasoline: 0.1950, Diesel: 0.1950 },
  AR: { Gasoline: 0.2460, Diesel: 0.2850 },
  MN: { Gasoline: 0.2850, Diesel: 0.2850 },
  WI: { Gasoline: 0.3090, Diesel: 0.3090 },
  ND: { Gasoline: 0.2300, Diesel: 0.2300 },
  SD: { Gasoline: 0.2800, Diesel: 0.2800 },
  MT: { Gasoline: 0.3275, Diesel: 0.2975 },
  WY: { Gasoline: 0.2400, Diesel: 0.2400 },
  CO: { Gasoline: 0.2200, Diesel: 0.2050 },
  UT: { Gasoline: 0.3190, Diesel: 0.3190 },
  ID: { Gasoline: 0.3300, Diesel: 0.3300 },
  NM: { Gasoline: 0.1870, Diesel: 0.2100 },
  AZ: { Gasoline: 0.1800, Diesel: 0.2600 },
  NV: { Gasoline: 0.2300, Diesel: 0.2700 },
  WA: { Gasoline: 0.4940, Diesel: 0.4940 },
  OR: { Gasoline: 0.4000, Diesel: 0.4000 },
  LA: { Gasoline: 0.2000, Diesel: 0.2000 },
  TN: { Gasoline: 0.2600, Diesel: 0.2700 },
  MS: { Gasoline: 0.1840, Diesel: 0.1840 },
  OH: { Gasoline: 0.3850, Diesel: 0.4700 },
  PA: { Gasoline: 0.5870, Diesel: 0.7410 },
  ME: { Gasoline: 0.3010, Diesel: 0.3120 },
  IL: { Gasoline: 0.3920, Diesel: 0.4670 },
  GA: { Gasoline: 0.2780, Diesel: 0.3130 },
  MI: { Gasoline: 0.2870, Diesel: 0.2870 },
  SC: { Gasoline: 0.2600, Diesel: 0.2600 },
}

/**
 * Local tax overrides — a handful of cities/counties that levy additional
 * per-gallon fuel taxes on top of state rates.
 */
const LOCAL_TAXES: {
  name: string
  state: string
  gasoline: number
  diesel: number
}[] = [
  { name: 'Chicago Metro', state: 'IL', gasoline: 0.08, diesel: 0.08 },
  { name: 'Allegheny County', state: 'PA', gasoline: 0.02, diesel: 0.02 },
  { name: 'Clark County', state: 'NV', gasoline: 0.0105, diesel: 0.0105 },
]

// ============================================================================
// DATA GENERATION
// ============================================================================

/**
 * Derive the unique set of destination states from the shared location data.
 * These are the states we need state-level tax rates for.
 */
function getDestinationStates(): string[] {
  const destinations = LOCATIONS.filter((l) => !l.IsTerminal && l.IsActive)
  const states = new Set(destinations.map((l) => l.State))
  return Array.from(states).sort()
}

/**
 * Generate the full set of tax rates across all three levels.
 */
export function generateTaxRates(): TaxRate[] {
  const data: TaxRate[] = []
  let id = 1
  const commodities: TaxRate['Commodity'][] = ['Gasoline', 'Diesel']

  // --- Federal level (2 rows: one per commodity) ---
  for (const commodity of commodities) {
    data.push({
      id: id++,
      TaxLevel: 'Federal',
      Jurisdiction: 'Federal',
      State: null,
      Commodity: commodity,
      RatePerGallon: FEDERAL_RATES[commodity],
      EffectiveDate: '2026-01-01',
      ExpirationDate: null,
      IsActive: true,
    })
  }

  // --- State level (2 rows per state: one per commodity) ---
  const destinationStates = getDestinationStates()
  for (const state of destinationStates) {
    const rates = STATE_TAX_RATES[state]
    if (!rates) continue

    for (const commodity of commodities) {
      data.push({
        id: id++,
        TaxLevel: 'State',
        Jurisdiction: state,
        State: state,
        Commodity: commodity,
        RatePerGallon: rates[commodity],
        EffectiveDate: '2026-01-01',
        ExpirationDate: null,
        IsActive: true,
      })
    }
  }

  // --- Local level (additional per-gallon taxes) ---
  for (const local of LOCAL_TAXES) {
    for (const commodity of commodities) {
      data.push({
        id: id++,
        TaxLevel: 'Local',
        Jurisdiction: local.name,
        State: local.state,
        Commodity: commodity,
        RatePerGallon: commodity === 'Gasoline' ? local.gasoline : local.diesel,
        EffectiveDate: '2026-01-01',
        ExpirationDate: null,
        IsActive: true,
      })
    }
  }

  return data
}

export const taxRates: TaxRate[] = generateTaxRates()
