/**
 * Shared Price Publishers Data
 *
 * Price publisher configurations and instruments for fuel industry demos.
 */

import type { PricePublisher, PriceType, DateRule, PricePublisherConfig, PriceInstrument } from '../types/price.types'

// Price publishers
export const PRICE_PUBLISHERS: PricePublisherConfig[] = [
  {
    id: 'opis',
    name: 'OPIS',
    instruments: [],
    isActive: true,
  },
  {
    id: 'platts',
    name: 'Platts',
    instruments: [],
    isActive: true,
  },
  {
    id: 'argus',
    name: 'Argus',
    instruments: [],
    isActive: true,
  },
]

// Price instruments
export const PRICE_INSTRUMENTS: PriceInstrument[] = [
  // OPIS Gasoline
  { id: 'opis-cbob-usgc', name: 'CBOB USGC', publisher: 'OPIS', productGroup: 'gasoline', region: 'Gulf Coast', isActive: true },
  { id: 'opis-cbob-atlantic', name: 'CBOB Atlantic', publisher: 'OPIS', productGroup: 'gasoline', region: 'Atlantic', isActive: true },
  { id: 'opis-rbob-usgc', name: 'RBOB USGC', publisher: 'OPIS', productGroup: 'gasoline', region: 'Gulf Coast', isActive: true },
  { id: 'opis-rbob-nyh', name: 'RBOB NYH', publisher: 'OPIS', productGroup: 'gasoline', region: 'New York Harbor', isActive: true },

  // OPIS Diesel
  { id: 'opis-ulsd-usgc', name: 'ULSD USGC', publisher: 'OPIS', productGroup: 'diesel', region: 'Gulf Coast', isActive: true },
  { id: 'opis-ulsd-nyh', name: 'ULSD NYH', publisher: 'OPIS', productGroup: 'diesel', region: 'New York Harbor', isActive: true },
  { id: 'opis-ulsd-midwest', name: 'ULSD Midwest', publisher: 'OPIS', productGroup: 'diesel', region: 'Midwest', isActive: true },
  { id: 'opis-ulsd-la', name: 'ULSD LA', publisher: 'OPIS', productGroup: 'diesel', region: 'Los Angeles', isActive: true },

  // Platts
  { id: 'platts-cbob-usgc', name: 'CBOB USGC', publisher: 'Platts', productGroup: 'gasoline', region: 'Gulf Coast', isActive: true },
  { id: 'platts-ulsd-usgc', name: 'ULSD USGC', publisher: 'Platts', productGroup: 'diesel', region: 'Gulf Coast', isActive: true },

  // Argus
  { id: 'argus-cbob-usgc', name: 'CBOB USGC', publisher: 'Argus', productGroup: 'gasoline', region: 'Gulf Coast', isActive: true },
  { id: 'argus-ulsd-usgc', name: 'ULSD USGC', publisher: 'Argus', productGroup: 'diesel', region: 'Gulf Coast', isActive: true },
]

// Dropdown options
export const PRICE_PUBLISHER_OPTIONS: PricePublisher[] = ['OPIS', 'Platts', 'Argus']
export const PRICE_TYPE_OPTIONS: PriceType[] = ['Low', 'High', 'Average', 'Mean']
export const DATE_RULE_OPTIONS: DateRule[] = ['Prior Day', 'Month Average', 'Week Average', 'Day Of']

/**
 * Get price instruments by publisher
 */
export function getInstrumentsByPublisher(publisher: PricePublisher): PriceInstrument[] {
  return PRICE_INSTRUMENTS.filter((i) => i.publisher === publisher && i.isActive)
}

/**
 * Get price instruments by product group
 */
export function getInstrumentsByProductGroup(group: 'gasoline' | 'diesel'): PriceInstrument[] {
  return PRICE_INSTRUMENTS.filter((i) => i.productGroup === group && i.isActive)
}

/**
 * Sample market prices for formula resolution (mock data)
 * Key format: {Publisher}-{Instrument}-{PriceType}
 */
export const SAMPLE_MARKET_PRICES: Record<string, number> = {
  'OPIS-CBOB USGC-Low': 2.3,
  'OPIS-CBOB USGC-High': 2.35,
  'OPIS-CBOB USGC-Average': 2.325,
  'OPIS-ULSD USGC-Low': 2.26,
  'OPIS-ULSD USGC-High': 2.31,
  'OPIS-ULSD USGC-Average': 2.285,
  'Platts-CBOB USGC-Low': 2.31,
  'Platts-CBOB USGC-High': 2.36,
  'Platts-CBOB USGC-Average': 2.335,
  'Argus-CBOB USGC-Low': 2.29,
  'Argus-CBOB USGC-High': 2.34,
  'Argus-CBOB USGC-Average': 2.315,
}

/**
 * Get market price for a specific combination
 */
export function getMarketPrice(publisher: PricePublisher, instrument: string, priceType: PriceType): number | undefined {
  const key = `${publisher}-${instrument}-${priceType}`
  return SAMPLE_MARKET_PRICES[key]
}
