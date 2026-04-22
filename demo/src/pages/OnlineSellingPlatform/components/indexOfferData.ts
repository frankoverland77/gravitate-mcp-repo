import dayjs from 'dayjs';

export interface IndexOfferRow {
  id: number;
  offerId: number;
  offerName: string;
  product: string;
  location: string;
  timeZone: string;
  volumeAvailable: number;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  timeRemaining: string;
  minPerOrder: number;
  maxPerOrder: number;
  volumeIncrement: number;
  fixedPrice: number | null;
  formulaDifferential: number;
  formulaName: string;
  formulaVariables: { name: string; percentage: string }[];
  pricingMechanism: string;
  priceValidity: string;
  weekendRule: string;
  holidayRule: string;
  additionalTerms: string;
  currency: string;
  hasPendingSubmission: boolean;
  defaultBidExpiry: string;
  maximumBidExpiry: string;
}

export function generateIndexOffers(count = 10): IndexOfferRow[] {
  const products = ['ULSD', 'CBOB', 'Premium Unleaded', 'Regular Conv', 'Ethanol'];
  const locations = [
    'Dallas Terminal',
    'Houston Terminal',
    'Nashville Terminal',
    'Atlanta Terminal',
    'Chicago Terminal',
    'Baton Rouge Terminal',
  ];
  const timeZones = ['CST', 'EST', 'CST', 'EST', 'CST', 'CST'];
  const formulaNames = [
    '90% Argus Prior Day CBOB USGC + 10% OPIS Rack + Differential',
    'OPIS Mean ULSD Gulf Coast + Differential',
    '80% Platts USGC + 20% Argus NYH + Differential',
    'OPIS Rack Low + Differential',
    'Argus Prior Day Premium USGC + Differential',
  ];
  const priceValidities = ['Midnight - Midnight', '6AM - 6AM', '8AM - 8AM'];
  const weekendRules = ['Use Friday', 'Include', 'Exclude'];
  const holidayRules = ['Use prior business day', 'Exclude', 'Include'];
  const terms = [
    'All deliveries subject to force majeure provisions. Buyer responsible for all applicable taxes, fees, and duties at point of delivery.',
    'Product must meet ASTM D975 Grade 2 standards. Quality testing by independent third-party laboratory.',
    'Delivery windows guaranteed within +/- 4 hours. Demurrage charges apply after 2 hours at standard industry rates.',
    'Payment terms net 10 days. 1.5% monthly interest on overdue balances.',
    'Subject to credit approval and existing credit limits.',
  ];

  const now = dayjs();
  const offers: IndexOfferRow[] = [];

  for (let i = 0; i < count; i++) {
    const locIdx = i % locations.length;
    const prodIdx = i % products.length;
    const pickupStart = now.add(Math.floor(i / 2) + 1, 'day').startOf('day');
    const pickupEnd = pickupStart.add(25 + (i % 10), 'day').endOf('day');
    const diff = ((i % 8) - 3) * 0.0125;

    offers.push({
      id: i + 1,
      offerId: 5000 + i,
      offerName: `Index Offer #${5000 + i}`,
      product: products[prodIdx],
      location: locations[locIdx],
      timeZone: timeZones[locIdx],
      volumeAvailable: (5 + (i % 6)) * 10000,
      pickupWindowStart: pickupStart.toISOString(),
      pickupWindowEnd: pickupEnd.toISOString(),
      timeRemaining: `${3 + (i % 5)}h ${10 + (i % 50)}m`,
      minPerOrder: 5000 + (i % 3) * 1000,
      maxPerOrder: 40000 + (i % 4) * 10000,
      volumeIncrement: 1000,
      fixedPrice: null,
      formulaDifferential: diff,
      formulaName: formulaNames[i % formulaNames.length],
      formulaVariables: [
        { name: 'Argus Prior Day CBOB USGC', percentage: '90%' },
        { name: 'OPIS Rack Low', percentage: '10%' },
        { name: 'OPIS Current Year RIN', percentage: '-10%' },
      ],
      pricingMechanism: 'Index',
      priceValidity: priceValidities[i % priceValidities.length],
      weekendRule: weekendRules[i % weekendRules.length],
      holidayRule: holidayRules[i % holidayRules.length],
      additionalTerms: terms[i % terms.length],
      currency: 'USD',
      hasPendingSubmission: i === 3,
      defaultBidExpiry: pickupEnd.subtract(1, 'day').hour(17).minute(0).toISOString(),
      maximumBidExpiry: pickupEnd.toISOString(),
    });
  }

  return offers;
}

export const formatDifferential = (value: number | null | undefined): string => {
  if (value == null) return '-';
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}$${Math.abs(value).toFixed(4)}`;
};

export const formatVolume = (value: number): string => value.toLocaleString('en-US');
