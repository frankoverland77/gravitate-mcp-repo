/**
 * Full Entry Flow - Default Data
 *
 * Auto-populated dummy data for the Full Entry wizard.
 */

import type { ContractDetail } from '../types/contract.types'
import type { FullEntryHeader } from './fullentry.types'

/**
 * Default full entry header - auto-populated with realistic data
 */
export const DEFAULT_FULL_ENTRY_HEADER: FullEntryHeader = {
  // Contract Type (left sidebar)
  contractType: 'Day - Fixed',
  description: '',
  comments: '',

  // Counterparty Info
  internalCounterparty: 'Gravitate Energy LLC',
  internalContact: '',
  externalCounterparty: 'Shell Trading',
  externalContact: '',

  // Trade Info
  contractCalendar: 'Contract Calendar',
  contractDate: new Date('2026-01-01'),
  effectiveDates: [new Date('2026-01-01'), new Date('2026-12-31')],
  requireQuantities: false,

  // Additional Info
  internalContractNumber: '',
  externalContractNumber: '',
  movementType: '',
  strategy: '',
}

/**
 * Default contract details for Full Entry - represents a new contract with 5 line items
 */
export const DEFAULT_FULL_ENTRY_DETAILS: ContractDetail[] = [
  {
    id: 'fe-detail-1',
    product: 'CBOB',
    location: 'Houston Terminal',
    destination: 'Dallas Terminal',
    calendar: 'Contract Calendar',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    effectiveTime: '6:00 PM',
    provisionType: 'Formula',
    formula: {
      id: 'formula-1',
      name: 'OPIS Rack + 0.02',
      expression: 'OPIS_Rack + $0.0200',
      variables: [
        {
          id: 'var-1',
          variableName: 'var_1_group_1',
          displayName: 'OPIS_Rack',
          pricePublisher: 'OPIS',
          priceInstrument: 'CBOB USGC',
          priceType: 'Average',
          dateRule: 'Prior Day',
          percentage: 100,
          differential: 0.02,
        },
      ],
    },
    quantity: 300000,
    status: 'ready',
  },
  {
    id: 'fe-detail-2',
    product: 'RBOB',
    location: 'Houston Terminal',
    destination: 'Atlanta Terminal',
    calendar: 'Contract Calendar',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    effectiveTime: '6:00 PM',
    provisionType: 'Formula',
    formula: {
      id: 'formula-2',
      name: 'Platts Mean + 0.015',
      expression: 'Platts_Mean + $0.0150',
      variables: [
        {
          id: 'var-2',
          variableName: 'var_1_group_1',
          displayName: 'Platts_Mean',
          pricePublisher: 'Platts',
          priceInstrument: 'RBOB USGC',
          priceType: 'Mean',
          dateRule: 'Day Of',
          percentage: 100,
          differential: 0.015,
        },
      ],
    },
    quantity: 250000,
    status: 'ready',
  },
  {
    id: 'fe-detail-3',
    product: 'ULSD',
    location: 'New York Harbor',
    calendar: 'NYX',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
    effectiveTime: '6:00 PM',
    provisionType: 'Fixed',
    fixedValue: 2.85,
    quantity: 150000,
    status: 'ready',
  },
  {
    id: 'fe-detail-4',
    product: 'CBOB',
    location: 'Chicago Terminal',
    calendar: 'Rack',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-12-31'),
    effectiveTime: '6:00 PM',
    provisionType: 'Formula',
    quantity: 200000,
    status: 'in-progress',
  },
  {
    id: 'fe-detail-5',
    product: 'Premium Unleaded',
    location: 'Los Angeles Terminal',
    calendar: 'Contract Calendar',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    effectiveTime: '6:00 PM',
    provisionType: 'Formula',
    quantity: 100000,
    status: 'empty',
  },
]

/**
 * Create empty contract detail
 */
export function createEmptyDetail(): ContractDetail {
  const id = `fe-detail-${Date.now()}`
  return {
    id,
    product: '',
    location: '',
    calendar: 'Contract Calendar',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    effectiveTime: '6:00 PM',
    provisionType: 'Formula',
    quantity: 0,
    status: 'empty',
  }
}

/**
 * Options for form dropdowns
 */
export const COUNTERPARTY_OPTIONS = [
  { value: 'Gravitate Energy LLC', label: 'Gravitate Energy LLC' },
  { value: 'Shell Trading', label: 'Shell Trading' },
  { value: 'ExxonMobil', label: 'ExxonMobil' },
  { value: 'Chevron', label: 'Chevron' },
  { value: 'BP Trading', label: 'BP Trading' },
]

export const CONTACT_OPTIONS = [
  { value: 'john.smith', label: 'John Smith' },
  { value: 'jane.doe', label: 'Jane Doe' },
  { value: 'bob.wilson', label: 'Bob Wilson' },
  { value: 'alice.brown', label: 'Alice Brown' },
]

export const CALENDAR_OPTIONS = [
  { value: 'Contract Calendar', label: 'Contract Calendar' },
  { value: 'NYX', label: 'NYX' },
  { value: 'Rack', label: 'Rack' },
  { value: 'NYMEX', label: 'NYMEX' },
]

export const MOVEMENT_TYPE_OPTIONS = [
  { value: 'pipeline', label: 'Pipeline' },
  { value: 'truck', label: 'Truck' },
  { value: 'rail', label: 'Rail' },
  { value: 'barge', label: 'Barge' },
]

export const STRATEGY_OPTIONS = [
  { value: 'hedging', label: 'Hedging' },
  { value: 'speculation', label: 'Speculation' },
  { value: 'arbitrage', label: 'Arbitrage' },
  { value: 'physical', label: 'Physical' },
]
