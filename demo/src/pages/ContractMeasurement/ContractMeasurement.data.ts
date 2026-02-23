// Mock data for Contract Measurement grid
// Based on screenshot specifications

import { generateContractDetails, getCustomers, type GeneratedContractDetail } from '../../shared/data'

export interface ContractMeasurementRecord {
  id: number;
  contractId: string;
  customer: string;
  type: 'Sale' | 'Purchase';
  instrument: 'Spot' | 'Lower of Rack' | 'OPIS';
  startDate: string;
  endDate: string;
  daysLeft: number;
  volumeCompleted: number;
  volumeTotal: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  riskScore: number;
  financialImpact: number;
  margin: number;
  ratability: number;
  status: 'Active' | 'Inactive' | 'Pending';
  isArchived: boolean;
}

// Get customer names from shared data for contract records
const customers = getCustomers()

export const MEASUREMENT_DATA: ContractMeasurementRecord[] = [
  {
    id: 1,
    contractId: 'CTR-001',
    customer: customers[0]?.Name || 'Circle K Stores',
    type: 'Sale',
    instrument: 'OPIS',
    startDate: '2024-12-31',
    endDate: '2025-12-30',
    daysLeft: 26,
    volumeCompleted: 42862500,
    volumeTotal: 45000000,
    riskLevel: 'High',
    riskScore: 26.5,
    financialImpact: 5432,
    margin: 0.0843,
    ratability: 72,
    status: 'Active',
    isArchived: false,
  },
  {
    id: 2,
    contractId: 'CTR-002',
    customer: customers[1]?.Name || 'Costco',
    type: 'Purchase',
    instrument: 'Spot',
    startDate: '2025-02-28',
    endDate: '2026-02-27',
    daysLeft: 85,
    volumeCompleted: 9000000,
    volumeTotal: 30000000,
    riskLevel: 'High',
    riskScore: 45.7,
    financialImpact: -4521,
    margin: -0.0147,
    ratability: 58,
    status: 'Active',
    isArchived: false,
  },
  {
    id: 3,
    contractId: 'CTR-003',
    customer: customers[2]?.Name || 'Growmark',
    type: 'Sale',
    instrument: 'Lower of Rack',
    startDate: '2025-01-15',
    endDate: '2025-07-15',
    daysLeft: 42,
    volumeCompleted: 39000000,
    volumeTotal: 60000000,
    riskLevel: 'Medium',
    riskScore: 18.3,
    financialImpact: 2150,
    margin: 0.1562,
    ratability: 81,
    status: 'Active',
    isArchived: false,
  },
  {
    id: 4,
    contractId: 'CTR-004',
    customer: customers[3]?.Name || 'Pilot Flying J',
    type: 'Purchase',
    instrument: 'OPIS',
    startDate: '2024-11-01',
    endDate: '2025-04-30',
    daysLeft: 12,
    volumeCompleted: 13275000,
    volumeTotal: 13500000,
    riskLevel: 'Low',
    riskScore: 8.2,
    financialImpact: 890,
    margin: 0.2104,
    ratability: 88,
    status: 'Active',
    isArchived: false,
  },
  {
    id: 5,
    contractId: 'CTR-005',
    customer: customers[4]?.Name || 'Musket',
    type: 'Sale',
    instrument: 'Spot',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    daysLeft: 120,
    volumeCompleted: 5625000,
    volumeTotal: 75000000,
    riskLevel: 'Medium',
    riskScore: 22.1,
    financialImpact: -1250,
    margin: 0.0391,
    ratability: 67,
    status: 'Active',
    isArchived: false,
  },
  {
    id: 6,
    contractId: 'CTR-006',
    customer: customers[5]?.Name || 'Gravitate Purchasing',
    type: 'Purchase',
    instrument: 'Lower of Rack',
    startDate: '2024-09-15',
    endDate: '2025-03-15',
    daysLeft: 5,
    volumeCompleted: 17280000,
    volumeTotal: 18000000,
    riskLevel: 'High',
    riskScore: 52.4,
    financialImpact: -8200,
    margin: -0.0218,
    ratability: 53,
    status: 'Active',
    isArchived: false,
  },
  {
    id: 7,
    contractId: 'CTR-007',
    customer: customers[6]?.Name || 'Marathon Petroleum',
    type: 'Sale',
    instrument: 'OPIS',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    daysLeft: 0,
    volumeCompleted: 22000000,
    volumeTotal: 22000000,
    riskLevel: 'Low',
    riskScore: 4.1,
    financialImpact: 3200,
    margin: 0.1275,
    ratability: 90,
    status: 'Inactive',
    isArchived: true,
  },
  {
    id: 8,
    contractId: 'CTR-008',
    customer: customers[7]?.Name || 'Valero Energy',
    type: 'Purchase',
    instrument: 'Spot',
    startDate: '2024-04-15',
    endDate: '2024-10-15',
    daysLeft: 0,
    volumeCompleted: 55000000,
    volumeTotal: 55000000,
    riskLevel: 'Medium',
    riskScore: 15.8,
    financialImpact: -2100,
    margin: 0.0612,
    ratability: 76,
    status: 'Inactive',
    isArchived: true,
  },
];

// Contract detail data (product/location combinations)
// Used in scenario comparison table and formula scenario drawer
// Now generated from shared products and locations
export interface ContractDetail extends GeneratedContractDetail {}

// Generate 10 contract details from shared products and terminal locations
export const SAMPLE_DETAILS: ContractDetail[] = generateContractDetails(10);
