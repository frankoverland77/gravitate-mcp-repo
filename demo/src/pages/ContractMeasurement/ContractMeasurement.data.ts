// Mock data for Contract Measurement grid
// Based on screenshot specifications

import { generateContractDetails, getCustomers, type GeneratedContractDetail } from '../../shared/data'

export interface ContractMeasurementRecord {
  id: number;
  contractId: string;
  customer: string;
  type: 'Sale' | 'Purchase';
  startDate: string;
  endDate: string;
  daysLeft: number;
  volumeCompleted: number;
  volumeTotal: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  riskScore: number;
  financialImpact: number;
  ratability: number;
  status: 'Active' | 'Inactive' | 'Pending';
}

// Get customer names from shared data for contract records
const customers = getCustomers()

export const MEASUREMENT_DATA: ContractMeasurementRecord[] = [
  {
    id: 1,
    contractId: 'CTR-001',
    customer: customers[0]?.Name || 'Circle K Stores',
    type: 'Sale',
    startDate: '2024-12-31',
    endDate: '2025-12-30',
    daysLeft: 26,
    volumeCompleted: 95250,
    volumeTotal: 100000,
    riskLevel: 'High',
    riskScore: 26.5,
    financialImpact: 5432,
    ratability: 0,
    status: 'Active',
  },
  {
    id: 2,
    contractId: 'CTR-002',
    customer: customers[1]?.Name || 'Costco Wholesale',
    type: 'Purchase',
    startDate: '2025-02-28',
    endDate: '2026-02-27',
    daysLeft: 85,
    volumeCompleted: 45000,
    volumeTotal: 150000,
    riskLevel: 'High',
    riskScore: 45.7,
    financialImpact: -4521,
    ratability: 14,
    status: 'Active',
  },
  {
    id: 3,
    contractId: 'CTR-003',
    customer: customers[2]?.Name || 'Growmark',
    type: 'Sale',
    startDate: '2025-01-15',
    endDate: '2025-07-15',
    daysLeft: 42,
    volumeCompleted: 78000,
    volumeTotal: 120000,
    riskLevel: 'Medium',
    riskScore: 18.3,
    financialImpact: 2150,
    ratability: 5,
    status: 'Active',
  },
  {
    id: 4,
    contractId: 'CTR-004',
    customer: customers[3]?.Name || 'Pilot Flying J',
    type: 'Purchase',
    startDate: '2024-11-01',
    endDate: '2025-04-30',
    daysLeft: 12,
    volumeCompleted: 88500,
    volumeTotal: 90000,
    riskLevel: 'Low',
    riskScore: 8.2,
    financialImpact: 890,
    ratability: 0,
    status: 'Active',
  },
  {
    id: 5,
    contractId: 'CTR-005',
    customer: customers[4]?.Name || "Love's Travel Stops",
    type: 'Sale',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    daysLeft: 120,
    volumeCompleted: 15000,
    volumeTotal: 200000,
    riskLevel: 'Medium',
    riskScore: 22.1,
    financialImpact: -1250,
    ratability: 8,
    status: 'Active',
  },
  {
    id: 6,
    contractId: 'CTR-006',
    customer: customers[5]?.Name || 'Gravitate Purchasing',
    type: 'Purchase',
    startDate: '2024-09-15',
    endDate: '2025-03-15',
    daysLeft: 5,
    volumeCompleted: 72000,
    volumeTotal: 75000,
    riskLevel: 'High',
    riskScore: 52.4,
    financialImpact: -8200,
    ratability: 22,
    status: 'Active',
  },
];

// Contract detail data (product/location combinations)
// Used in scenario comparison table and formula scenario drawer
// Now generated from shared products and locations
export interface ContractDetail extends GeneratedContractDetail {}

// Generate 10 contract details from shared products and terminal locations
export const SAMPLE_DETAILS: ContractDetail[] = generateContractDetails(10);
