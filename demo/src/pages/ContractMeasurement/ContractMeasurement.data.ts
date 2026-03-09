// Mock data for Contract Measurement grid
// Based on screenshot specifications

import { generateContractDetails, getCustomers, type GeneratedContractDetail } from '../../shared/data'

export interface ContractMeasurementRecord {
  id: number;
  contractId: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Cancelled';
  createdDate: string;
  startDate: string;
  endDate: string;
  externalCounterparty: string;
  type: 'Sale' | 'Purchase';
  instrument: 'Spot' | 'Lower of Rack' | 'OPIS';
  locations: string[];
  products: string[];
  description: string;
  internalContractNumber: string;
  externalContractNumber: string;
  daysLeft: number;
  volumeCompleted: number;
  volumeTotal: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  riskScore: number;
  benchmarkImpactCpg: number;
  financialImpact: number;
  margin: number;
  ratability: number;
  isArchived: boolean;
}

// Get customer names from shared data for contract records
const customers = getCustomers()

export const MEASUREMENT_DATA: ContractMeasurementRecord[] = [
  {
    id: 1,
    contractId: 'CTR-001',
    status: 'Active',
    createdDate: '2024-11-15',
    startDate: '2024-12-31',
    endDate: '2025-12-30',
    externalCounterparty: customers[0]?.Name || 'Circle K Stores',
    type: 'Sale',
    instrument: 'OPIS',
    locations: ['Terminal 42 - Houston', 'Terminal 15 - Dallas'],
    products: ['ULSD', 'Regular Unleaded'],
    description: 'Annual fuel supply agreement',
    internalContractNumber: 'INT-2024-0451',
    externalContractNumber: 'CK-FY25-001',
    daysLeft: 26,
    volumeCompleted: 42862500,
    volumeTotal: 45000000,
    riskLevel: 'High',
    riskScore: 26.5,
    benchmarkImpactCpg: 0.0050,
    financialImpact: 5432,
    margin: 0.0843,
    ratability: 72,
    isArchived: false,
  },
  {
    id: 2,
    contractId: 'CTR-002',
    status: 'Active',
    createdDate: '2025-01-20',
    startDate: '2025-02-28',
    endDate: '2026-02-27',
    externalCounterparty: customers[1]?.Name || 'Costco',
    type: 'Purchase',
    instrument: 'Spot',
    locations: ['Terminal 8 - Chicago'],
    products: ['Premium Unleaded', 'ULSD', 'Ethanol'],
    description: 'Wholesale spot purchase contract',
    internalContractNumber: 'INT-2025-0012',
    externalContractNumber: 'COST-25-887',
    daysLeft: 85,
    volumeCompleted: 9000000,
    volumeTotal: 30000000,
    riskLevel: 'High',
    riskScore: 45.7,
    benchmarkImpactCpg: -0.0120,
    financialImpact: -4521,
    margin: -0.0147,
    ratability: 58,
    isArchived: false,
  },
  {
    id: 3,
    contractId: 'CTR-003',
    status: 'Active',
    createdDate: '2024-12-01',
    startDate: '2025-01-15',
    endDate: '2025-07-15',
    externalCounterparty: customers[2]?.Name || 'Growmark',
    type: 'Sale',
    instrument: 'Lower of Rack',
    locations: ['Terminal 22 - Indianapolis', 'Terminal 31 - Columbus', 'Terminal 7 - Detroit'],
    products: ['Regular Unleaded'],
    description: 'Lower of rack pricing for midwest distribution',
    internalContractNumber: 'INT-2024-0398',
    externalContractNumber: 'GRW-Q1-2025',
    daysLeft: 42,
    volumeCompleted: 39000000,
    volumeTotal: 60000000,
    riskLevel: 'Medium',
    riskScore: 18.3,
    benchmarkImpactCpg: 0.0035,
    financialImpact: 2150,
    margin: 0.1562,
    ratability: 81,
    isArchived: false,
  },
  {
    id: 4,
    contractId: 'CTR-004',
    status: 'Active',
    createdDate: '2024-09-28',
    startDate: '2024-11-01',
    endDate: '2025-04-30',
    externalCounterparty: customers[3]?.Name || 'Pilot Flying J',
    type: 'Purchase',
    instrument: 'OPIS',
    locations: ['Terminal 3 - Knoxville'],
    products: ['ULSD'],
    description: 'OPIS-based diesel purchase',
    internalContractNumber: 'INT-2024-0310',
    externalContractNumber: 'PFJ-D-2024-44',
    daysLeft: 12,
    volumeCompleted: 13275000,
    volumeTotal: 13500000,
    riskLevel: 'Low',
    riskScore: 8.2,
    benchmarkImpactCpg: 0.0015,
    financialImpact: 890,
    margin: 0.2104,
    ratability: 88,
    isArchived: false,
  },
  {
    id: 5,
    contractId: 'CTR-005',
    status: 'Active',
    createdDate: '2025-02-10',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    externalCounterparty: customers[4]?.Name || 'Musket',
    type: 'Sale',
    instrument: 'Spot',
    locations: ['Terminal 12 - Atlanta', 'Terminal 19 - Charlotte'],
    products: ['Regular Unleaded', 'Premium Unleaded', 'ULSD', 'Biodiesel'],
    description: 'Southeast spot sales agreement',
    internalContractNumber: 'INT-2025-0045',
    externalContractNumber: 'MSK-SE-2025',
    daysLeft: 120,
    volumeCompleted: 5625000,
    volumeTotal: 75000000,
    riskLevel: 'Medium',
    riskScore: 22.1,
    benchmarkImpactCpg: -0.0025,
    financialImpact: -1250,
    margin: 0.0391,
    ratability: 67,
    isArchived: false,
  },
  {
    id: 6,
    contractId: 'CTR-006',
    status: 'Active',
    createdDate: '2024-08-05',
    startDate: '2024-09-15',
    endDate: '2025-03-15',
    externalCounterparty: customers[5]?.Name || 'Gravitate Purchasing',
    type: 'Purchase',
    instrument: 'Lower of Rack',
    locations: ['Terminal 5 - Memphis'],
    products: ['Regular Unleaded', 'ULSD'],
    description: 'Winter season rack purchase',
    internalContractNumber: 'INT-2024-0275',
    externalContractNumber: 'GP-WIN-2024',
    daysLeft: 5,
    volumeCompleted: 17280000,
    volumeTotal: 18000000,
    riskLevel: 'High',
    riskScore: 52.4,
    benchmarkImpactCpg: -0.0200,
    financialImpact: -8200,
    margin: -0.0218,
    ratability: 53,
    isArchived: false,
  },
  {
    id: 7,
    contractId: 'CTR-007',
    status: 'Inactive',
    createdDate: '2024-04-20',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    externalCounterparty: customers[6]?.Name || 'Marathon Petroleum',
    type: 'Sale',
    instrument: 'OPIS',
    locations: ['Terminal 1 - Detroit', 'Terminal 9 - Toledo'],
    products: ['ULSD', 'Regular Unleaded'],
    description: 'H2 2024 OPIS-based sale',
    internalContractNumber: 'INT-2024-0188',
    externalContractNumber: 'MPC-H2-2024',
    daysLeft: 0,
    volumeCompleted: 22000000,
    volumeTotal: 22000000,
    riskLevel: 'Low',
    riskScore: 4.1,
    benchmarkImpactCpg: 0.0080,
    financialImpact: 3200,
    margin: 0.1275,
    ratability: 90,
    isArchived: true,
  },
  {
    id: 8,
    contractId: 'CTR-008',
    status: 'Inactive',
    createdDate: '2024-03-01',
    startDate: '2024-04-15',
    endDate: '2024-10-15',
    externalCounterparty: customers[7]?.Name || 'Valero Energy',
    type: 'Purchase',
    instrument: 'Spot',
    locations: ['Terminal 6 - Houston', 'Terminal 11 - Beaumont', 'Terminal 14 - Port Arthur'],
    products: ['Premium Unleaded'],
    description: 'Gulf coast spot purchase',
    internalContractNumber: 'INT-2024-0099',
    externalContractNumber: 'VLO-GC-2024-Q2',
    daysLeft: 0,
    volumeCompleted: 55000000,
    volumeTotal: 55000000,
    riskLevel: 'Medium',
    riskScore: 15.8,
    benchmarkImpactCpg: -0.0042,
    financialImpact: -2100,
    margin: 0.0612,
    ratability: 76,
    isArchived: true,
  },
];

// Contract detail data (product/location combinations)
// Used in scenario comparison table and formula scenario drawer
// Now generated from shared products and locations
export interface ContractDetail extends GeneratedContractDetail {}

// Generate 10 contract details from shared products and terminal locations
export const SAMPLE_DETAILS: ContractDetail[] = generateContractDetails(10);
