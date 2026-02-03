/**
 * Shared Counterparty Types
 *
 * Suppliers and customers for fuel industry demos.
 */

export interface Counterparty {
  CounterPartyId: number
  Name: string
  Abbreviation: string
  IsSupplier: boolean
  IsCustomer: boolean
  IsActive: boolean
}

// Lightweight version for dropdowns
export interface CounterpartyOption {
  value: number // CounterPartyId
  label: string // Name
  abbreviation?: string
}

// Counterparty names as string literals for type-safe references
export type SupplierName =
  | 'Marathon Petroleum'
  | 'Phillips 66'
  | 'Shell'
  | 'Valero'
  | 'FHR'
  | 'HF Sinclair'
  | 'BP'
  | 'Cenex'

export type CustomerName =
  | 'Circle K Stores'
  | 'Costco Wholesale'
  | 'Growmark'
  | 'Pilot Flying J'
  | "Love's Travel Stops"
