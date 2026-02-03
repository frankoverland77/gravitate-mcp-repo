/**
 * Shared Price Types
 *
 * Price-related types for fuel industry demos.
 * Standardized to 4 decimal places for fuel pricing precision.
 */

export type PricePublisher = 'OPIS' | 'Platts' | 'Argus'
export type PriceType = 'Low' | 'High' | 'Average' | 'Mean'
export type DateRule = 'Prior Day' | 'Day Of' | 'Month Average' | 'Week Average'
export type PriceUnit = 'gal' | 'bbl' | 'mt'

export interface PricePoint {
  value: number // Always 4 decimal places
  currency: 'USD'
  unit: PriceUnit
}

// Price publisher configuration
export interface PricePublisherConfig {
  id: string
  name: PricePublisher
  instruments: PriceInstrument[]
  isActive: boolean
}

// Price instrument (e.g., CBOB USGC, ULSD Gulf)
export interface PriceInstrument {
  id: string
  name: string
  publisher: PricePublisher
  productGroup: 'gasoline' | 'diesel'
  region: string
  isActive: boolean
}

// Common price instruments by product type
export const PRICE_INSTRUMENTS_BY_GROUP: Record<'gasoline' | 'diesel', string[]> = {
  gasoline: ['CBOB USGC', 'CBOB Atlantic', 'RBOB USGC', 'RBOB NYH'],
  diesel: ['ULSD USGC', 'ULSD NYH', 'ULSD Midwest', 'ULSD LA'],
}
