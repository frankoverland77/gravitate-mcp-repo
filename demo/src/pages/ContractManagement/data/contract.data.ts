/**
 * Contract Management Mock Data
 */

import type {
  ContractListItem,
  ContractHeader,
  ProductOption,
  LocationOption,
  ContractDetail,
  EffectiveTime,
  PageMode,
} from '../types/contract.types'

/**
 * Product options for selection
 */
export const PRODUCT_OPTIONS: ProductOption[] = [
  { id: 'prod-1', name: 'CBOB', group: 'gasoline' },
  { id: 'prod-2', name: 'RBOB', group: 'gasoline' },
  { id: 'prod-3', name: 'Premium Unleaded', group: 'gasoline' },
  { id: 'prod-4', name: 'ULSD', group: 'diesel' },
  { id: 'prod-5', name: 'Biodiesel B5', group: 'diesel' },
  { id: 'prod-6', name: 'Biodiesel B20', group: 'diesel' },
]

/**
 * Location options for selection
 */
export const LOCATION_OPTIONS: LocationOption[] = [
  { id: 'loc-1', name: 'Houston Terminal', region: 'Gulf Coast' },
  { id: 'loc-2', name: 'New York Harbor', region: 'Northeast' },
  { id: 'loc-3', name: 'Chicago Terminal', region: 'Midwest' },
  { id: 'loc-4', name: 'Los Angeles Terminal', region: 'West Coast' },
  { id: 'loc-5', name: 'Atlanta Terminal', region: 'Southeast' },
  { id: 'loc-6', name: 'Dallas Terminal', region: 'Southwest' },
]

/**
 * Internal party options
 */
export const INTERNAL_PARTY_OPTIONS = [
  'Gravitate Energy LLC',
  'Gravitate Trading Co',
  'Gravitate Supply Inc',
]

/**
 * External party options (counterparties)
 */
export const EXTERNAL_PARTY_OPTIONS = [
  'Shell Trading',
  'BP Products',
  'Chevron USA',
  'Marathon Petroleum',
  'Valero Marketing',
  'Phillips 66',
  'ExxonMobil',
  'Citgo Petroleum',
]

/**
 * Calendar options
 */
export const CALENDAR_OPTIONS = ['Contract Calendar', 'NYX', 'Rack'] as const

/**
 * Currency options
 */
export const CURRENCY_OPTIONS = ['US Dollars', 'Canadian Dollars', 'Mexican Pesos']

/**
 * Unit of measure options
 */
export const UOM_OPTIONS = ['GAL', 'BBL', 'MT', 'LTR']

/**
 * Contract type options
 */
export const CONTRACT_TYPE_OPTIONS = ['Day - Fixed', 'Day - Formula', 'Intercompany', 'Term - Formula']

/**
 * Effective time options
 */
export const EFFECTIVE_TIME_OPTIONS = ['12:00 AM', '4:00 PM', '5:00 PM', '6:00 PM'] as const

/**
 * Mock contract list data with embedded details for master-detail grid
 */
export const MOCK_CONTRACTS: ContractListItem[] = [
  {
    id: 'contract-1',
    name: 'Shell Gulf Coast Supply 2026',
    type: 'Physical Supply',
    internalParty: 'Gravitate Energy LLC',
    externalParty: 'Shell Trading',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    status: 'active',
    detailCount: 4,
    totalQuantity: 2400000,
    locations: ['Houston Terminal', 'Dallas Terminal', 'Atlanta Terminal'],
    products: ['CBOB', 'RBOB', 'ULSD'],
    createdAt: new Date('2025-11-15'),
    updatedAt: new Date('2025-12-20'),
    details: [
      {
        id: 'detail-1-1',
        product: 'CBOB',
        location: 'Houston Terminal',
        destination: 'Dallas Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-11',
          name: 'OPIS CBOB Average + 1.5c',
          expression: 'OPIS_CBOB_USGC + $0.0150',
          variables: [
            {
              id: 'var-11',
              variableName: 'var_1_group_1',
              displayName: 'OPIS_CBOB_USGC',
              pricePublisher: 'OPIS',
              priceInstrument: 'CBOB USGC',
              priceType: 'Average',
              dateRule: 'Prior Day',
              percentage: 100,
              differential: 0.015,
            },
          ],
        },
        quantity: 800000,
        status: 'ready',
      },
      {
        id: 'detail-1-2',
        product: 'RBOB',
        location: 'Houston Terminal',
        destination: 'Atlanta Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-12',
          name: 'Platts RBOB Mean + 2c',
          expression: 'Platts_RBOB_USGC + $0.0200',
          variables: [
            {
              id: 'var-12',
              variableName: 'var_1_group_1',
              displayName: 'Platts_RBOB_USGC',
              pricePublisher: 'Platts',
              priceInstrument: 'RBOB USGC',
              priceType: 'Mean',
              dateRule: 'Day Of',
              percentage: 100,
              differential: 0.02,
            },
          ],
        },
        quantity: 600000,
        status: 'ready',
      },
      {
        id: 'detail-1-3',
        product: 'ULSD',
        location: 'Houston Terminal',
        destination: 'Dallas Terminal',
        calendar: 'NYX',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        effectiveTime: '6:00 PM',
        provisionType: 'Fixed',
        fixedValue: 2.85,
        quantity: 500000,
        status: 'ready',
      },
      {
        id: 'detail-1-4',
        product: 'CBOB',
        location: 'Houston Terminal',
        destination: 'Atlanta Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-12-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-14',
          name: 'Argus CBOB High - 1c',
          expression: 'Argus_CBOB_USGC - $0.0100',
          variables: [
            {
              id: 'var-14',
              variableName: 'var_1_group_1',
              displayName: 'Argus_CBOB_USGC',
              pricePublisher: 'Argus',
              priceInstrument: 'CBOB USGC',
              priceType: 'High',
              dateRule: 'Day Of',
              percentage: 100,
              differential: -0.01,
            },
          ],
        },
        quantity: 500000,
        status: 'in-progress',
      },
    ],
  },
  {
    id: 'contract-2',
    name: 'BP Northeast Supply Q1 2026',
    type: 'Physical Supply',
    internalParty: 'Gravitate Trading Co',
    externalParty: 'BP Products',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31'),
    status: 'active',
    detailCount: 3,
    totalQuantity: 600000,
    locations: ['New York Harbor'],
    products: ['RBOB', 'Premium Unleaded'],
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2025-12-15'),
    details: [
      {
        id: 'detail-2-1',
        product: 'RBOB',
        location: 'New York Harbor',
        calendar: 'NYX',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-21',
          name: 'OPIS RBOB Low + 1c',
          expression: 'OPIS_RBOB_NYH + $0.0100',
          variables: [
            {
              id: 'var-21',
              variableName: 'var_1_group_1',
              displayName: 'OPIS_RBOB_NYH',
              pricePublisher: 'OPIS',
              priceInstrument: 'RBOB NYH',
              priceType: 'Low',
              dateRule: 'Prior Day',
              percentage: 100,
              differential: 0.01,
            },
          ],
        },
        quantity: 300000,
        status: 'ready',
      },
      {
        id: 'detail-2-2',
        product: 'Premium Unleaded',
        location: 'New York Harbor',
        calendar: 'NYX',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-22',
          name: 'Platts Premium Mean + 3c',
          expression: 'Platts_Premium_NYH + $0.0300',
          variables: [
            {
              id: 'var-22',
              variableName: 'var_1_group_1',
              displayName: 'Platts_Premium_NYH',
              pricePublisher: 'Platts',
              priceInstrument: 'Premium Unleaded NYH',
              priceType: 'Mean',
              dateRule: 'Day Of',
              percentage: 100,
              differential: 0.03,
            },
          ],
        },
        quantity: 200000,
        status: 'ready',
      },
      {
        id: 'detail-2-3',
        product: 'RBOB',
        location: 'New York Harbor',
        calendar: 'NYX',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-03-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Fixed',
        fixedValue: 2.65,
        quantity: 100000,
        status: 'ready',
      },
    ],
  },
  {
    id: 'contract-3',
    name: 'Marathon Midwest Diesel',
    type: 'Term Supply',
    internalParty: 'Gravitate Supply Inc',
    externalParty: 'Marathon Petroleum',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-07-31'),
    status: 'draft',
    detailCount: 4,
    totalQuantity: 1200000,
    locations: ['Chicago Terminal'],
    products: ['ULSD', 'Biodiesel B5', 'Biodiesel B20'],
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-28'),
    details: [
      {
        id: 'detail-3-1',
        product: 'ULSD',
        location: 'Chicago Terminal',
        calendar: 'Rack',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-07-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-31',
          name: 'Argus ULSD Average + 2.5c',
          expression: 'Argus_ULSD_Chicago + $0.0250',
          variables: [
            {
              id: 'var-31',
              variableName: 'var_1_group_1',
              displayName: 'Argus_ULSD_Chicago',
              pricePublisher: 'Argus',
              priceInstrument: 'ULSD Chicago',
              priceType: 'Average',
              dateRule: 'Prior Day',
              percentage: 100,
              differential: 0.025,
            },
          ],
        },
        quantity: 600000,
        status: 'in-progress',
      },
      {
        id: 'detail-3-2',
        product: 'Biodiesel B5',
        location: 'Chicago Terminal',
        calendar: 'Rack',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-07-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-32',
          name: 'OPIS B5 Low + 4c',
          expression: 'OPIS_B5_Chicago + $0.0400',
          variables: [
            {
              id: 'var-32',
              variableName: 'var_1_group_1',
              displayName: 'OPIS_B5_Chicago',
              pricePublisher: 'OPIS',
              priceInstrument: 'Biodiesel B5 Chicago',
              priceType: 'Low',
              dateRule: 'Prior Day',
              percentage: 100,
              differential: 0.04,
            },
          ],
        },
        quantity: 300000,
        status: 'empty',
      },
      {
        id: 'detail-3-3',
        product: 'Biodiesel B20',
        location: 'Chicago Terminal',
        calendar: 'Rack',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-07-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-33',
          name: 'Platts B20 Mean + 5c',
          expression: 'Platts_B20_Chicago + $0.0500',
          variables: [
            {
              id: 'var-33',
              variableName: 'var_1_group_1',
              displayName: 'Platts_B20_Chicago',
              pricePublisher: 'Platts',
              priceInstrument: 'Biodiesel B20 Chicago',
              priceType: 'Mean',
              dateRule: 'Day Of',
              percentage: 100,
              differential: 0.05,
            },
          ],
        },
        quantity: 200000,
        status: 'empty',
      },
      {
        id: 'detail-3-4',
        product: 'ULSD',
        location: 'Chicago Terminal',
        calendar: 'Rack',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-07-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Fixed',
        fixedValue: 2.92,
        quantity: 100000,
        status: 'ready',
      },
    ],
  },
  {
    id: 'contract-4',
    name: 'Valero West Coast Q2 2026',
    type: 'Spot Purchase',
    internalParty: 'Gravitate Energy LLC',
    externalParty: 'Valero Marketing',
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-06-30'),
    status: 'pending',
    detailCount: 2,
    totalQuantity: 450000,
    locations: ['Los Angeles Terminal'],
    products: ['CBOB', 'Premium Unleaded'],
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-30'),
    details: [
      {
        id: 'detail-4-1',
        product: 'CBOB',
        location: 'Los Angeles Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-06-30'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-41',
          name: 'OPIS CBOB LA Average + 3c',
          expression: 'OPIS_CBOB_LA + $0.0300',
          variables: [
            {
              id: 'var-41',
              variableName: 'var_1_group_1',
              displayName: 'OPIS_CBOB_LA',
              pricePublisher: 'OPIS',
              priceInstrument: 'CBOB LA',
              priceType: 'Average',
              dateRule: 'Day Of',
              percentage: 100,
              differential: 0.03,
            },
          ],
        },
        quantity: 300000,
        status: 'in-progress',
      },
      {
        id: 'detail-4-2',
        product: 'Premium Unleaded',
        location: 'Los Angeles Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-06-30'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-42',
          name: 'Argus Premium LA High - 1.5c',
          expression: 'Argus_Premium_LA - $0.0150',
          variables: [
            {
              id: 'var-42',
              variableName: 'var_1_group_1',
              displayName: 'Argus_Premium_LA',
              pricePublisher: 'Argus',
              priceInstrument: 'Premium Unleaded LA',
              priceType: 'High',
              dateRule: 'Prior Day',
              percentage: 100,
              differential: -0.015,
            },
          ],
        },
        quantity: 150000,
        status: 'empty',
      },
    ],
  },
  {
    id: 'contract-5',
    name: 'ExxonMobil Southeast 2025',
    type: 'Physical Supply',
    internalParty: 'Gravitate Trading Co',
    externalParty: 'ExxonMobil',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: 'expired',
    detailCount: 5,
    totalQuantity: 3000000,
    locations: ['Atlanta Terminal', 'Houston Terminal'],
    products: ['CBOB', 'RBOB', 'ULSD', 'Premium Unleaded'],
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2025-12-31'),
    details: [
      {
        id: 'detail-5-1',
        product: 'CBOB',
        location: 'Atlanta Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-51',
          name: 'OPIS CBOB SE Average + 2c',
          expression: 'OPIS_CBOB_SE + $0.0200',
          variables: [
            {
              id: 'var-51',
              variableName: 'var_1_group_1',
              displayName: 'OPIS_CBOB_SE',
              pricePublisher: 'OPIS',
              priceInstrument: 'CBOB SE',
              priceType: 'Average',
              dateRule: 'Prior Day',
              percentage: 100,
              differential: 0.02,
            },
          ],
        },
        quantity: 800000,
        status: 'ready',
      },
      {
        id: 'detail-5-2',
        product: 'RBOB',
        location: 'Atlanta Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-52',
          name: 'Platts RBOB SE Mean + 1.5c',
          expression: 'Platts_RBOB_SE + $0.0150',
          variables: [
            {
              id: 'var-52',
              variableName: 'var_1_group_1',
              displayName: 'Platts_RBOB_SE',
              pricePublisher: 'Platts',
              priceInstrument: 'RBOB SE',
              priceType: 'Mean',
              dateRule: 'Day Of',
              percentage: 100,
              differential: 0.015,
            },
          ],
        },
        quantity: 700000,
        status: 'ready',
      },
      {
        id: 'detail-5-3',
        product: 'ULSD',
        location: 'Houston Terminal',
        calendar: 'NYX',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Fixed',
        fixedValue: 2.78,
        quantity: 600000,
        status: 'ready',
      },
      {
        id: 'detail-5-4',
        product: 'Premium Unleaded',
        location: 'Atlanta Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-54',
          name: 'Argus Premium SE Average + 3.5c',
          expression: 'Argus_Premium_SE + $0.0350',
          variables: [
            {
              id: 'var-54',
              variableName: 'var_1_group_1',
              displayName: 'Argus_Premium_SE',
              pricePublisher: 'Argus',
              priceInstrument: 'Premium Unleaded SE',
              priceType: 'Average',
              dateRule: 'Prior Day',
              percentage: 100,
              differential: 0.035,
            },
          ],
        },
        quantity: 500000,
        status: 'ready',
      },
      {
        id: 'detail-5-5',
        product: 'CBOB',
        location: 'Houston Terminal',
        destination: 'Atlanta Terminal',
        calendar: 'Contract Calendar',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-12-31'),
        effectiveTime: '6:00 PM',
        provisionType: 'Formula',
        formula: {
          id: 'formula-55',
          name: 'OPIS CBOB USGC Low + 1c',
          expression: 'OPIS_CBOB_USGC + $0.0100',
          variables: [
            {
              id: 'var-55',
              variableName: 'var_1_group_1',
              displayName: 'OPIS_CBOB_USGC',
              pricePublisher: 'OPIS',
              priceInstrument: 'CBOB USGC',
              priceType: 'Low',
              dateRule: 'Day Of',
              percentage: 100,
              differential: 0.01,
            },
          ],
        },
        quantity: 400000,
        status: 'ready',
      },
    ],
  },
]

/**
 * Mock contract details for a sample contract
 */
export const MOCK_CONTRACT_DETAILS: ContractDetail[] = [
  {
    id: 'detail-1',
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
    id: 'detail-2',
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
    id: 'detail-3',
    product: 'ULSD',
    location: 'New York Harbor',
    calendar: 'NYX',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
    effectiveTime: '6:00 PM',
    provisionType: 'Fixed',
    fixedValue: 2.8500,
    quantity: 150000,
    status: 'ready',
  },
  {
    id: 'detail-4',
    product: 'CBOB',
    location: 'Chicago Terminal',
    calendar: 'Rack',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-12-31'),
    effectiveTime: '6:00 PM',
    provisionType: 'Formula',
    formula: {
      id: 'formula-4',
      name: 'OPIS CBOB Low - 2c',
      expression: 'OPIS_CBOB_Low - $0.0200',
      variables: [
        {
          id: 'var-4',
          variableName: 'var_1_group_1',
          displayName: 'OPIS_CBOB_Low',
          pricePublisher: 'OPIS',
          priceInstrument: 'CBOB Chicago',
          priceType: 'Low',
          dateRule: 'Prior Day',
          percentage: 100,
          differential: -0.02,
        },
      ],
    },
    quantity: 200000,
    status: 'in-progress',
  },
  {
    id: 'detail-5',
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

export const DEMO_INITIAL_HEADER: ContractHeader = {
  internalParty: 'Gravitate Energy LLC',
  externalParty: 'Shell Trading',
  startDate: new Date('2026-01-01'),
  endDate: new Date('2026-12-31'),
  effectiveTime: '6:00 PM',
  currency: 'US Dollars',
  unitOfMeasure: 'GAL',
  contractType: 'Term - Formula',
  description: '(SW - 5)',
  internalContact: 'Jake Cook',
  externalContact: '',
  contractDate: new Date('2025-05-09'),
  contractCalendar: 'NYMEX',
  requireQuantities: false,
}

/**
 * Generate empty contract details for bulk create
 */
export function generateEmptyDetails(
  products: string[],
  locations: string[],
  startDate: Date,
  endDate: Date,
  effectiveTime: EffectiveTime = '6:00 PM'
): ContractDetail[] {
  const details: ContractDetail[] = []
  let counter = 1

  for (const product of products) {
    for (const location of locations) {
      details.push({
        id: `detail-new-${counter++}`,
        product,
        location,
        calendar: 'Contract Calendar',
        startDate,
        endDate,
        effectiveTime,
        provisionType: 'Formula',
        quantity: 0,
        status: 'empty',
      })
    }
  }

  return details
}

/**
 * Look up a contract by ID
 */
export function getContractById(id: string): ContractListItem | undefined {
  return MOCK_CONTRACTS.find((c) => c.id === id)
}

/**
 * Convert a ContractListItem to a ContractHeader for Quick Entry
 */
export function contractToHeader(contract: ContractListItem): ContractHeader {
  return {
    internalParty: contract.internalParty,
    externalParty: contract.externalParty,
    startDate: contract.startDate,
    endDate: contract.endDate,
    effectiveTime: contract.details[0]?.effectiveTime || '6:00 PM',
    currency: 'US Dollars',
    unitOfMeasure: 'GAL',
    contractType: contract.type || 'Term - Formula',
    description: '',
    internalContact: '',
    externalContact: '',
    contractDate: contract.createdAt || null,
    contractCalendar: 'Contract Calendar',
    requireQuantities: false,
  }
}

/**
 * Derive page mode from contract status
 */
export function derivePageMode(status: ContractListItem['status']): PageMode {
  if (status === 'expired') return 'view'
  return 'edit'
}

/**
 * Calculate detail status based on completeness
 */
export function calculateDetailStatus(detail: ContractDetail): ContractDetail['status'] {
  const hasProduct = !!detail.product
  const hasLocation = !!detail.location
  const hasQuantity = detail.quantity > 0

  if (!hasProduct || !hasLocation) {
    return 'empty'
  }

  if (detail.provisionType === 'Fixed') {
    return detail.fixedValue !== undefined && hasQuantity ? 'ready' : 'in-progress'
  }

  // Formula type
  const hasFormula = detail.formula && detail.formula.variables.length > 0
  if (hasFormula && hasQuantity) {
    return 'ready'
  }

  return 'in-progress'
}
