import { CompetitorProfile } from './CompetitorPriceProfiling.types';

export const MOTIVA_PROFILE: CompetitorProfile = {
  id: 'motiva-port-arthur-cbob',
  competitor: 'Motiva',
  publisher: 'OPIS',
  counterpartyGroup: 'Refiner',
  location: 'Port Arthur, TX',
  region: 'Gulf Coast',
  product: 'CBOB',
  productGroup: 'Gasoline',
  classification: 'Premium',
  isLeader: true,
};

export const COMPETITOR_PROFILES: CompetitorProfile[] = [
  MOTIVA_PROFILE,
  {
    id: 'shell-port-arthur-cbob',
    competitor: 'Shell',
    publisher: 'OPIS',
    counterpartyGroup: 'Refiner',
    location: 'Port Arthur, TX',
    region: 'Gulf Coast',
    product: 'CBOB',
    productGroup: 'Gasoline',
    classification: 'Conformist',
    isLeader: false,
  },
  {
    id: 'valero-port-arthur-cbob',
    competitor: 'Valero',
    publisher: 'OPIS',
    counterpartyGroup: 'Refiner',
    location: 'Port Arthur, TX',
    region: 'Gulf Coast',
    product: 'CBOB',
    productGroup: 'Gasoline',
    classification: 'Discount',
    isLeader: false,
  },
];
