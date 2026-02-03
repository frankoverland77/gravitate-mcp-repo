/**
 * Shared Product Types
 *
 * Fuel industry products for RFP, Online Selling, Tiered Pricing, Contract Measurement.
 * Bakery demo keeps its own local types (different domain).
 */

export interface Product {
  ProductId: number
  Name: string
  Abbreviation: string
  Grade?: string // e.g., 'Regular', 'Premium', 'Midgrade'
  ProductGroup: 'gasoline' | 'diesel' | 'biodiesel' | 'jet'
  IsActive: boolean
}

// Lightweight version for dropdowns
export interface ProductOption {
  value: number // ProductId
  label: string // Name
  abbreviation?: string
  group?: 'gasoline' | 'diesel' | 'biodiesel' | 'jet'
}

// Product names as string literals for type-safe references
export type ProductName =
  | '87 Octane'
  | '89 Octane'
  | '93 Octane'
  | 'Diesel'
  | 'ULSD'
  | 'ULSD 2'
  | 'Biodiesel B20'
  | 'Jet A'
