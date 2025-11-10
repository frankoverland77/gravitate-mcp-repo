// Formula Field Options
// Centralized data for formula component field dropdowns

export const PUBLISHERS = [
    'Argus',
    'OPIS',
    'Platts',
    'NYMEX',
    'ICE',
    'CME'
] as const;

export const INSTRUMENTS = [
    'CBOB',
    'CBOB USGC',
    'CBOB Chicago',
    'CBOB Gulf',
    'Premium USGC',
    'CARBOB',
    'WTI',
    'Brent',
    'ULSD',
    'Jet Fuel',
    'Ethanol',
    'RBOB Futures',
    'Renewable Diesel'
] as const;

export const DATE_RULES = [
    'Prior Day',
    'Current',
    'Friday Close',
    'Settlement',
    'Month Average',
    'M+1',
    'M+2'
] as const;

export const PRICE_TYPES = [
    'Settle',
    'Average',
    'Spot',
    'Futures',
    'Fixed',
    'High',
    'Low',
    'Close'
] as const;

export type Publisher = typeof PUBLISHERS[number];
export type Instrument = typeof INSTRUMENTS[number];
export type DateRule = typeof DATE_RULES[number];
export type PriceType = typeof PRICE_TYPES[number];
