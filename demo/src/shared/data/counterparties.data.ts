/**
 * Shared Counterparties Data
 *
 * Master counterparty list for fuel industry demos.
 * Includes suppliers and customers used across features.
 */

import type { Counterparty, CounterpartyOption } from '../types/counterparty.types'

// Curated counterparty list
export const COUNTERPARTIES: Counterparty[] = [
  // Suppliers
  {
    CounterPartyId: 1,
    Name: 'Marathon Petroleum',
    Abbreviation: 'Marathon',
    IsSupplier: true,
    IsCustomer: false,
    IsActive: true,
  },
  {
    CounterPartyId: 2,
    Name: 'Phillips 66',
    Abbreviation: 'P66',
    IsSupplier: true,
    IsCustomer: false,
    IsActive: true,
  },
  {
    CounterPartyId: 3,
    Name: 'Shell',
    Abbreviation: 'Shell',
    IsSupplier: true,
    IsCustomer: false,
    IsActive: true,
  },
  {
    CounterPartyId: 4,
    Name: 'Valero',
    Abbreviation: 'Valero',
    IsSupplier: true,
    IsCustomer: false,
    IsActive: true,
  },
  {
    CounterPartyId: 5,
    Name: 'FHR',
    Abbreviation: 'FHR',
    IsSupplier: true,
    IsCustomer: false,
    IsActive: true,
  },
  {
    CounterPartyId: 6,
    Name: 'HF Sinclair',
    Abbreviation: 'HFS',
    IsSupplier: true,
    IsCustomer: false,
    IsActive: true,
  },
  {
    CounterPartyId: 7,
    Name: 'BP',
    Abbreviation: 'BP',
    IsSupplier: true,
    IsCustomer: false,
    IsActive: true,
  },
  {
    CounterPartyId: 8,
    Name: 'Cenex',
    Abbreviation: 'Cenex',
    IsSupplier: true,
    IsCustomer: false,
    IsActive: true,
  },
  { CounterPartyId: 9, Name: '76-Motiva', Abbreviation: '76-Mot', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 10, Name: 'Chevron', Abbreviation: 'Chevron', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 11, Name: 'Citgo', Abbreviation: 'Citgo', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 12, Name: 'Gulf', Abbreviation: 'Gulf', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 13, Name: 'MPC-ARCO', Abbreviation: 'MPC-ARCO', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 14, Name: 'Motiva', Abbreviation: 'Motiva', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 15, Name: 'Shell-Motiva', Abbreviation: 'Shell-Mot', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 16, Name: 'Sunoco', Abbreviation: 'Sunoco', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 17, Name: 'Texaco', Abbreviation: 'Texaco', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 18, Name: 'ExxonMobil', Abbreviation: 'XOM', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 19, Name: 'Flint Hills Resources', Abbreviation: 'FlntHlsRs', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 20, Name: 'Murphy Oil', Abbreviation: 'Murphy', IsSupplier: true, IsCustomer: false, IsActive: true },
  { CounterPartyId: 21, Name: 'Tartan Oil', Abbreviation: 'TartanOil', IsSupplier: true, IsCustomer: false, IsActive: true },

  // Customers
  {
    CounterPartyId: 101,
    Name: 'Circle K Stores',
    Abbreviation: 'Circle K',
    IsSupplier: false,
    IsCustomer: true,
    IsActive: true,
  },
  {
    CounterPartyId: 102,
    Name: 'Costco Wholesale',
    Abbreviation: 'Costco',
    IsSupplier: false,
    IsCustomer: true,
    IsActive: true,
  },
  {
    CounterPartyId: 103,
    Name: 'Growmark',
    Abbreviation: 'Growmark',
    IsSupplier: false,
    IsCustomer: true,
    IsActive: true,
  },
  {
    CounterPartyId: 104,
    Name: 'Pilot Flying J',
    Abbreviation: 'Pilot',
    IsSupplier: false,
    IsCustomer: true,
    IsActive: true,
  },
  {
    CounterPartyId: 105,
    Name: "Love's Travel Stops",
    Abbreviation: "Love's",
    IsSupplier: false,
    IsCustomer: true,
    IsActive: true,
  },
  {
    CounterPartyId: 106,
    Name: 'Gravitate Purchasing',
    Abbreviation: 'Gravitate',
    IsSupplier: false,
    IsCustomer: true,
    IsActive: true,
  },
  {
    CounterPartyId: 107,
    Name: 'ACME Corporation',
    Abbreviation: 'ACME',
    IsSupplier: false,
    IsCustomer: true,
    IsActive: true,
  },
  {
    CounterPartyId: 108,
    Name: 'Globex Industries',
    Abbreviation: 'Globex',
    IsSupplier: false,
    IsCustomer: true,
    IsActive: true,
  },

  // ============================================================================
  // ADDITIONAL CUSTOMERS
  // ============================================================================
  { CounterPartyId: 109, Name: 'FEDEX FREIGHT, INC.', Abbreviation: 'FedEx Freight', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 110, Name: 'COLONIAL OIL INDUSTRIES, INC.', Abbreviation: 'Colonial Oil', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 111, Name: 'BRAD HALL & ASSOCIATES INC', Abbreviation: 'Brad Hall', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 112, Name: 'PETROSOUTH ENERGY LLC', Abbreviation: 'PetroSouth', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 113, Name: 'THOMPSON-KENNY, LLC', Abbreviation: 'Thompson-Kenny', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 114, Name: 'GLOBAL - SUPPLY', Abbreviation: 'Global Supply', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 115, Name: 'WALLIS OIL CO., INC.', Abbreviation: 'Wallis Oil', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 116, Name: 'Luke Oil Co, Inc.', Abbreviation: 'Luke Oil', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 117, Name: 'HUFFMAN OIL COMPANY INC', Abbreviation: 'Huffman Oil', IsSupplier: false, IsCustomer: true, IsActive: true },
  { CounterPartyId: 118, Name: 'OFFEN PETROLEUM LLC', Abbreviation: 'Offen Petroleum', IsSupplier: false, IsCustomer: true, IsActive: true },
]

/**
 * Get counterparty by ID
 */
export function getCounterpartyById(id: number): Counterparty | undefined {
  return COUNTERPARTIES.find((c) => c.CounterPartyId === id)
}

/**
 * Get counterparty by name or abbreviation
 */
export function getCounterpartyByName(name: string): Counterparty | undefined {
  return COUNTERPARTIES.find((c) => c.Name === name || c.Abbreviation === name)
}

/**
 * Get all suppliers
 */
export function getSuppliers(): Counterparty[] {
  return COUNTERPARTIES.filter((c) => c.IsSupplier && c.IsActive)
}

/**
 * Get suppliers as dropdown options
 */
export function getSupplierOptions(): CounterpartyOption[] {
  return getSuppliers().map((c) => ({
    value: c.CounterPartyId,
    label: c.Name,
    abbreviation: c.Abbreviation,
  }))
}

/**
 * Get all customers
 */
export function getCustomers(): Counterparty[] {
  return COUNTERPARTIES.filter((c) => c.IsCustomer && c.IsActive)
}

/**
 * Get customers as dropdown options
 */
export function getCustomerOptions(): CounterpartyOption[] {
  return getCustomers().map((c) => ({
    value: c.CounterPartyId,
    label: c.Name,
    abbreviation: c.Abbreviation,
  }))
}

/**
 * Supplier name constants for backward compatibility with RFP
 */
export const SUPPLIER_NAMES = [
  'Marathon',
  'P66',
  'Shell',
  'Valero',
  'FHR',
  'HF Sinclair',
  'BP',
  'Cenex',
  '76-Mot',
  'Chevron',
  'Citgo',
  'Gulf',
  'MPC-ARCO',
  'Motiva',
  'Shell-Mot',
  'Sunoco',
  'Texaco',
  'XOM',
  'FlntHlsRs',
  'Murphy',
  'TartanOil',
] as const
export type RFPSupplierName = (typeof SUPPLIER_NAMES)[number]
