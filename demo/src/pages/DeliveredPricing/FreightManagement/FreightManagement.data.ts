/**
 * Freight Management Data
 *
 * Carrier lane rate reference data for the Delivered Pricing proof of concept.
 * Each row represents a freight rate for a specific carrier servicing
 * an origin → destination lane for a commodity group, expressed in cents per gallon.
 */

import { LOCATIONS } from '../../../shared/data'

// ============================================================================
// TYPES
// ============================================================================

export interface FreightLaneRate {
  id: number
  /** Carrier name */
  CarrierName: string
  /** Origin terminal location name */
  OriginLocationName: string
  /** Origin state abbreviation */
  OriginState: string
  /** Destination location name */
  DestinationLocationName: string
  /** Destination state abbreviation */
  DestinationState: string
  /** Commodity-level product group (gasoline, diesel) */
  Commodity: 'Gasoline' | 'Diesel'
  /** Freight rate expressed in dollars per gallon (4 decimal points, e.g. 0.0800) */
  Rate: number
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

const CARRIERS = [
  'TransAm Logistics',
  'Gulf Coast Carriers',
  'Patriot Transport',
  'Eagle Fleet Services',
  'Lone Star Freight',
  'Pinnacle Hauling',
] as const

const COMMODITIES: FreightLaneRate['Commodity'][] = ['Gasoline', 'Diesel']

// Use the terminal locations as origins
const ORIGINS = LOCATIONS.filter((l) => l.IsTerminal && l.IsActive)

// Use a representative set of non-terminal destinations
const DESTINATIONS = LOCATIONS.filter((l) => !l.IsTerminal && l.IsActive).slice(0, 30)

// ============================================================================
// DATA GENERATION
// ============================================================================

/**
 * Generate a deterministic freight rate based on carrier, origin, destination, and commodity.
 * Rates range from $0.0300 to $0.1500 per gallon, influenced by a distance proxy
 * (difference in location IDs) and carrier-specific pricing.
 * Values are expressed in dollars at 4 decimal places to match the quote book format.
 */
function generateRate(carrierId: number, originId: number, destId: number, commodityIdx: number): number {
  const distanceProxy = Math.abs(originId - destId)
  const carrierPremium = (carrierId % 3) * 0.005 // $0.0000, $0.0050, or $0.0100 carrier variance
  const commodityAdj = commodityIdx === 1 ? 0.003 : 0 // diesel slightly higher
  const base = 0.03 + distanceProxy * 0.0008 + carrierPremium + commodityAdj

  // Clamp to realistic range and round to 4 decimals
  return Number(Math.min(0.15, Math.max(0.03, base)).toFixed(4))
}

/**
 * Generate the full set of freight lane rates.
 * Not every carrier services every lane — uses a deterministic filter
 * so each lane has 2-4 carriers available.
 */
export function generateFreightLaneRates(): FreightLaneRate[] {
  const data: FreightLaneRate[] = []
  let id = 1

  for (let ci = 0; ci < CARRIERS.length; ci++) {
    const carrier = CARRIERS[ci]

    for (const origin of ORIGINS) {
      for (let di = 0; di < DESTINATIONS.length; di++) {
        const dest = DESTINATIONS[di]

        // Deterministic filter: each lane gets 2-4 carriers, not all 6
        const laneHash = (origin.LocationId * 31 + dest.LocationId * 7 + ci * 13) % 10
        if (laneHash > 5) continue // ~60% of carrier-lane combos exist

        for (let cmi = 0; cmi < COMMODITIES.length; cmi++) {
          const commodity = COMMODITIES[cmi]
          const rate = generateRate(ci, origin.LocationId, dest.LocationId, cmi)

          data.push({
            id: id++,
            CarrierName: carrier,
            OriginLocationName: origin.Name,
            OriginState: origin.State,
            DestinationLocationName: dest.Name,
            DestinationState: dest.State,
            Commodity: commodity,
            Rate: rate,
            EffectiveDate: '2026-01-01',
            ExpirationDate: null,
            IsActive: true,
          })
        }
      }
    }
  }

  return data
}

export const freightLaneRates: FreightLaneRate[] = generateFreightLaneRates()
