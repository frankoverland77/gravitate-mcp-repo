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
  /** Jurisdiction name (e.g. "Federal Excise", "Federal LUST", state name, or city/county name) */
  Jurisdiction: string
  /** Tax component name for display */
  TaxComponent: string
  /** State abbreviation (null for federal) */
  State: string | null
  /** Commodity group */
  Commodity: 'Gasoline' | 'Diesel'
  /** Per-gallon tax rate in dollars (4 decimal places, e.g. 0.1830) */
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

/**
 * Federal motor fuel excise tax rates (per gallon).
 * These rates have been unchanged since October 1, 1993.
 */
const FEDERAL_EXCISE_RATES = {
  Gasoline: 0.1830,
  Diesel: 0.2430,
} as const

/**
 * Federal Leaking Underground Storage Tank (LUST) Trust Fund tax (per gallon).
 * Applies to all motor fuels; funds EPA cleanup of contaminated UST sites.
 */
const FEDERAL_LUST_RATE = 0.0010

/**
 * Texas state motor fuel tax rates per gallon.
 * Texas has maintained these rates since 1991.
 * 75% (15¢) dedicated to the state highway system, 25% (5¢) to public education.
 * Texas does not authorize local option motor fuel taxes.
 * Motor fuel is exempt from Texas sales tax.
 */
const STATE_TAX_RATES: Record<string, { Gasoline: number; Diesel: number }> = {
  TX: { Gasoline: 0.2000, Diesel: 0.2000 },
}

/**
 * Local tax overrides — Texas does not authorize local fuel taxes.
 * This array is kept for structural completeness but is empty for TX-only.
 */
const LOCAL_TAXES: {
  name: string
  state: string
  gasoline: number
  diesel: number
}[] = []

// ============================================================================
// DATA GENERATION
// ============================================================================

/**
 * Derive the unique set of destination states from the shared location data.
 * Filtered to TX-only destinations for this delivered pricing demo.
 */
function getDestinationStates(): string[] {
  const destinations = LOCATIONS.filter((l) => !l.IsTerminal && l.IsActive && l.State === 'TX')
  const states = new Set(destinations.map((l) => l.State))
  return Array.from(states).sort()
}

/**
 * Generate the full set of tax rates across all three levels.
 * Federal rates are broken out into Motor Fuel Excise and LUST Trust Fund components.
 */
export function generateTaxRates(): TaxRate[] {
  const data: TaxRate[] = []
  let id = 1
  const commodities: TaxRate['Commodity'][] = ['Gasoline', 'Diesel']

  // --- Federal level: Motor Fuel Excise Tax (2 rows: one per commodity) ---
  for (const commodity of commodities) {
    data.push({
      id: id++,
      TaxLevel: 'Federal',
      Jurisdiction: 'Federal',
      TaxComponent: 'Motor Fuel Excise Tax',
      State: null,
      Commodity: commodity,
      RatePerGallon: FEDERAL_EXCISE_RATES[commodity],
      EffectiveDate: '1993-10-01',
      ExpirationDate: null,
      IsActive: true,
    })
  }

  // --- Federal level: LUST Trust Fund Tax (2 rows: one per commodity) ---
  for (const commodity of commodities) {
    data.push({
      id: id++,
      TaxLevel: 'Federal',
      Jurisdiction: 'Federal',
      TaxComponent: 'LUST Trust Fund Tax',
      State: null,
      Commodity: commodity,
      RatePerGallon: FEDERAL_LUST_RATE,
      EffectiveDate: '1993-10-01',
      ExpirationDate: null,
      IsActive: true,
    })
  }

  // --- State level (TX only — 2 rows: one per commodity) ---
  const destinationStates = getDestinationStates()
  for (const state of destinationStates) {
    const rates = STATE_TAX_RATES[state]
    if (!rates) continue

    for (const commodity of commodities) {
      data.push({
        id: id++,
        TaxLevel: 'State',
        Jurisdiction: state,
        TaxComponent: 'Motor Fuel Tax',
        State: state,
        Commodity: commodity,
        RatePerGallon: rates[commodity],
        EffectiveDate: '1991-10-01',
        ExpirationDate: null,
        IsActive: true,
      })
    }
  }

  // --- Local level (none for TX — no local fuel taxes authorized) ---
  for (const local of LOCAL_TAXES) {
    for (const commodity of commodities) {
      data.push({
        id: id++,
        TaxLevel: 'Local',
        Jurisdiction: local.name,
        TaxComponent: 'Local Fuel Tax',
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
