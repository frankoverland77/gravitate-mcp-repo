/**
 * Shared Location Types
 *
 * Locations/terminals for fuel industry demos.
 */

export interface Location {
  LocationId: number
  Name: string
  Abbreviation: string
  Region: string // e.g., 'Gulf Coast', 'Southeast', 'Midwest'
  State: string // e.g., 'TX', 'TN', 'MI'
  IsTerminal: boolean
  IsActive: boolean
}

// Lightweight version for dropdowns
export interface LocationOption {
  value: number // LocationId
  label: string // Name
  region?: string
  abbreviation?: string
}

// Location names as string literals for type-safe references
export type LocationName =
  | 'Houston'
  | 'Houston Terminal'
  | 'Dallas'
  | 'Beaumont'
  | 'Nashville Terminal'
  | 'Detroit Terminal'
  | 'Columbia Terminal'

// Region groupings
export type Region = 'Gulf Coast' | 'Texas' | 'Southeast' | 'Midwest' | 'Mid-Atlantic'
