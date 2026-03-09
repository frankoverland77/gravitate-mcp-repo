import './styles.css'

import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { GraviGrid, Texto, Vertical, Horizontal } from '@gravitate-js/excalibrr'
import { Tag } from 'antd'
import React, { useCallback, useMemo, useState } from 'react'

import { OrderDetailsModal, OrderData } from './components/OrderDetailsModal'
import { NegotiationPanelProps, ProposalHistoryEntry } from './types'

// ─── Shared negotiation history entries ──────────────────────────────────

const historyOriginalEntry: ProposalHistoryEntry = {
  id: 'orig',
  title: 'Original Bid Submitted',
  submittedBy: 'Reece Johnson (Gravitate Purchasing)',
  submittedAt: 'Jan 14, 2026 at 9:15 AM',
  volume: 10000,
  price: 1.25,
  expiration: '01/14/2026 12:59 AM',
}

const historyInternalProposal: ProposalHistoryEntry = {
  id: 'prop1',
  title: 'Internal Proposed Changes',
  submittedBy: 'Mike Chen (Internal)',
  submittedAt: 'Jan 14, 2026 at 2:30 PM',
  volume: 15000,
  price: 1.22,
  expiration: 'Jan 15, 2026 at 2:30 PM',
  expirationStatus: 'countered',
  note: 'Better unit price available at higher volume. Current market conditions support this pricing.',
}

const historyCounterEntry: ProposalHistoryEntry = {
  id: 'counter1',
  title: 'Customer Counter-Proposed',
  submittedBy: 'Reece Johnson (Gravitate Purchasing)',
  submittedAt: 'Jan 15, 2026 at 10:15 AM',
  volume: 12500,
  price: 1.235,
  expiration: 'Jan 16, 2026 at 10:15 AM',
  expirationStatus: 'active',
  note: 'Can meet halfway on volume. Price needs to be closer to our original ask.',
  isCurrent: true,
}

// ─── Negotiation scenario props ──────────────────────────────────────────

const noop = () => {}

const scenario1Props: NegotiationPanelProps = {
  negotiationState: 'proposing',
  originalBid: { volume: 10000, price: 1.25, expiration: '01/14/2026 12:59 AM' },
  currentProposal: {
    volume: 15000,
    price: 1.22,
    expiration: '',
    note: 'Better unit price available at higher volume. Current market conditions support this pricing.',
    submittedBy: 'Mike Chen',
    submittedAt: new Date().toISOString(),
  },
  previousProposals: [],
  isInternal: true,
  onAcceptOriginal: noop,
  onAcceptProposed: noop,
  onPropose: noop,
  onClear: noop,
}

const scenario2Props: NegotiationPanelProps = {
  negotiationState: 'awaiting',
  originalBid: { volume: 8000, price: 2.385, expiration: '01/13/2026 5:00 PM' },
  currentProposal: {
    volume: 12000,
    price: 2.34,
    expiration: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    note: 'Better unit price available at higher volume. Current market conditions support this pricing.',
    submittedBy: 'Reece Johnson',
    submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  previousProposals: [historyOriginalEntry],
  isInternal: true,
  onAcceptOriginal: noop,
  onAcceptProposed: noop,
  onPropose: noop,
}

const scenario3Props: NegotiationPanelProps = {
  negotiationState: 'action-required',
  originalBid: { volume: 10000, price: 1.25, expiration: '01/14/2026 12:59 AM' },
  currentProposal: {
    volume: 15000,
    price: 1.22,
    expiration: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    note: 'Can meet halfway on volume. Price needs to be closer to our original ask.',
    submittedBy: 'Reece Johnson',
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  previousProposals: [historyCounterEntry, historyInternalProposal, historyOriginalEntry],
  isInternal: true,
  onAcceptOriginal: noop,
  onAcceptProposed: noop,
  onPropose: noop,
}

const scenario4Props: NegotiationPanelProps = {
  negotiationState: 'action-required',
  originalBid: { volume: 5000, price: 1.89, expiration: '01/15/2026 12:00 PM' },
  currentProposal: {
    volume: 7500,
    price: 1.845,
    expiration: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    note: 'Better unit price available at higher volume. Current market conditions support this pricing.',
    submittedBy: 'the seller',
    submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  previousProposals: [historyOriginalEntry],
  isInternal: false,
  onAcceptOriginal: noop,
  onAcceptProposed: noop,
  onPropose: noop,
}

const scenario5Props: NegotiationPanelProps = {
  negotiationState: 'confirmed',
  originalBid: { volume: 20000, price: 2.15, expiration: '01/12/2026 8:00 AM' },
  currentProposal: {
    volume: 25000,
    price: 2.105,
    expiration: '',
    note: '',
    submittedBy: 'Reece Johnson',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  previousProposals: [historyInternalProposal, historyOriginalEntry],
  isInternal: true,
  onAcceptOriginal: noop,
  onAcceptProposed: noop,
  onPropose: noop,
}

// ─── Shared fields for non-index orders ─────────────────────────────────

const noIndexFields = {
  sourceIndexOfferId: null,
  pricingDisplayText: null,
  contractDifferential: null,
  formulaVariables: [],
  pricingEffectiveTimes: null,
  pricingWeekendBehavior: null,
  pricingHolidayBehavior: null,
  additionalFreetextTerms: null,
}

// ─── Mock order data for the grid ────────────────────────────────────────

const pendingOrders: OrderData[] = [
  {
    tradeEntryId: 104521,
    orderStatusCodeValueMeaning: 'Pending',
    tradeTypeCodeValueMeaning: 'Prompt',
    isBidOrOffer: true,
    isInternalUser: true,
    areSetupsStillValid: true,
    productName: 'ULSD 2',
    fromLocationName: 'Nashville Terminal',
    quantity: 10000,
    price: 1.25,
    purchaseType: 'Bid',
    orderOrigin: 'Online',
    instrument: 'Prompt',
    counterparty: 'Gravitate Purchasing',
    contactName: 'Reece Johnson',
    marketPrice: 1.2734,
    margin: 0.0234,
    ...noIndexFields,
    comments: 'Standard prompt order for Nashville.',
    createdDate: 'Jan 14, 2026 9:15 AM',
    additionalProducts: [],
    destinationLocations: ['TN'],
    loadingNumbers: ['L-001', 'L-002'],
    exportStatus: 'Pending',
    exportDate: undefined,
    externalStatus: undefined,
    negotiationState: 'proposing',
    statusColor: 'gold',
    negotiationProps: scenario1Props,
  },
  {
    tradeEntryId: 104518,
    orderStatusCodeValueMeaning: 'Pending',
    tradeTypeCodeValueMeaning: 'Prompt',
    isBidOrOffer: false,
    isInternalUser: true,
    areSetupsStillValid: true,
    productName: 'CBOB Gasoline',
    fromLocationName: 'Houston Ship Channel',
    quantity: 8000,
    price: 2.385,
    purchaseType: 'Index',
    orderOrigin: 'Online',
    instrument: 'Prompt',
    counterparty: 'Gulf Coast Energy',
    contactName: 'Sarah Mitchell',
    marketPrice: 2.4012,
    margin: 0.0162,
    sourceIndexOfferId: 4521,
    pricingDisplayText: 'Index + $0.0250',
    contractDifferential: 0.025,
    formulaVariables: [
      { name: 'Argus Prior Day CBOB USGC', source: 'Argus', value: '$2.3600' },
      { name: 'OPIS Current Year RIN', source: 'OPIS', value: '-$0.0850' },
    ],
    pricingEffectiveTimes: 'Midnight - Midnight CST',
    pricingWeekendBehavior: 'Use Friday',
    pricingHolidayBehavior: 'Use prior business day',
    additionalFreetextTerms: 'Buyer responsible for all applicable taxes and duties at point of delivery.',
    comments: null,
    createdDate: 'Jan 13, 2026 3:42 PM',
    additionalProducts: [],
    destinationLocations: ['TX', 'LA'],
    loadingNumbers: [],
    exportStatus: 'Pending',
    exportDate: undefined,
    externalStatus: undefined,
    negotiationState: 'awaiting',
    statusColor: 'orange',
    negotiationProps: scenario2Props,
  },
  {
    tradeEntryId: 104515,
    orderStatusCodeValueMeaning: 'Pending',
    tradeTypeCodeValueMeaning: 'Prompt',
    isBidOrOffer: true,
    isInternalUser: true,
    areSetupsStillValid: true,
    productName: 'Premium Unleaded',
    fromLocationName: 'Collins Pipeline',
    quantity: 10000,
    price: 1.25,
    purchaseType: 'Bid',
    orderOrigin: 'Online',
    instrument: 'Prompt',
    counterparty: 'Gravitate Purchasing',
    contactName: 'Reece Johnson',
    marketPrice: 1.2891,
    margin: 0.0391,
    ...noIndexFields,
    comments: 'Customer has counter-proposed — review needed.',
    createdDate: 'Jan 13, 2026 11:20 AM',
    additionalProducts: [
      { name: 'Regular Unleaded', location: 'Collins Pipeline', price: 1.21 },
    ],
    destinationLocations: ['IL', 'IN'],
    loadingNumbers: ['L-005'],
    exportStatus: 'Pending',
    exportDate: undefined,
    externalStatus: undefined,
    negotiationState: 'action-required',
    statusColor: 'blue',
    negotiationProps: scenario3Props,
  },
  {
    tradeEntryId: 104512,
    orderStatusCodeValueMeaning: 'Pending',
    tradeTypeCodeValueMeaning: 'Prompt',
    isBidOrOffer: false,
    isInternalUser: false,
    areSetupsStillValid: true,
    productName: 'Ethanol',
    fromLocationName: 'Kinder Morgan Terminal',
    quantity: 5000,
    price: 1.89,
    purchaseType: 'Market',
    orderOrigin: 'External',
    instrument: 'Prompt',
    counterparty: 'Midwest Fuels LLC',
    contactName: 'David Park',
    marketPrice: 1.9102,
    margin: 0.0202,
    ...noIndexFields,
    comments: null,
    createdDate: 'Jan 12, 2026 2:55 PM',
    additionalProducts: [],
    destinationLocations: [],
    loadingNumbers: [],
    exportStatus: undefined,
    exportDate: undefined,
    externalStatus: undefined,
    negotiationState: 'action-required',
    statusColor: 'purple',
    negotiationProps: scenario4Props,
  },
  {
    tradeEntryId: 104508,
    orderStatusCodeValueMeaning: 'Pending',
    tradeTypeCodeValueMeaning: 'Prompt',
    isBidOrOffer: true,
    isInternalUser: true,
    areSetupsStillValid: true,
    productName: 'Jet Fuel A',
    fromLocationName: 'Magellan Pipeline',
    quantity: 20000,
    price: 2.15,
    purchaseType: 'Bid',
    orderOrigin: 'Online',
    instrument: 'Prompt',
    counterparty: 'Gravitate Purchasing',
    contactName: 'Reece Johnson',
    marketPrice: 2.1789,
    margin: 0.0289,
    ...noIndexFields,
    comments: 'Customer confirmed — ready to finalize.',
    createdDate: 'Jan 12, 2026 10:30 AM',
    additionalProducts: [],
    destinationLocations: ['OK', 'KS'],
    loadingNumbers: ['L-010', 'L-011', 'L-012'],
    exportStatus: 'Pending',
    exportDate: undefined,
    externalStatus: undefined,
    negotiationState: 'confirmed',
    statusColor: 'green',
    negotiationProps: scenario5Props,
  },
]

// ─── Negotiation state display helpers ───────────────────────────────────

const NEGOTIATION_STATE_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  proposing: { label: 'Proposing', color: 'gold', icon: <InfoCircleOutlined /> },
  awaiting: { label: 'Awaiting Response', color: 'orange', icon: <ClockCircleOutlined /> },
  'action-required': { label: 'Action Required', color: 'blue', icon: <ExclamationCircleOutlined /> },
  confirmed: { label: 'Confirmed', color: 'green', icon: <CheckCircleOutlined /> },
}

// ─── NegotiationModePage (Admin Dashboard) ───────────────────────────────

export function NegotiationModePage() {
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const handleViewOrder = useCallback((order: OrderData) => {
    setSelectedOrder(order)
    setModalVisible(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalVisible(false)
    setSelectedOrder(null)
  }, [])

  const columnDefs = useMemo(
    () => [
      {
        field: 'details',
        headerName: '',
        width: 50,
        pinned: 'left',
        cellRenderer: (params: any) => (
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }}
            onClick={() => handleViewOrder(params.data)}
          >
            <InfoCircleOutlined style={{ fontSize: 16, color: '#1890ff' }} />
          </div>
        ),
        sortable: false,
        filter: false,
      },
      {
        field: 'tradeEntryId',
        headerName: 'ORDER ID',
        width: 110,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => (
          <span style={{ fontWeight: 600, color: '#1890ff', cursor: 'pointer' }}>
            {params.value}
          </span>
        ),
      },
      {
        field: 'instrument',
        headerName: 'INSTRUMENT',
        width: 110,
        sortable: true,
        filter: true,
      },
      {
        field: 'orderOrigin',
        headerName: 'ORIGIN',
        width: 100,
        sortable: true,
        filter: true,
      },
      {
        field: 'purchaseType',
        headerName: 'TYPE',
        width: 90,
        sortable: true,
        filter: true,
      },
      {
        field: 'productName',
        headerName: 'PRODUCT',
        width: 170,
        sortable: true,
        filter: true,
      },
      {
        field: 'fromLocationName',
        headerName: 'LOCATION',
        width: 190,
        sortable: true,
        filter: true,
      },
      {
        field: 'counterparty',
        headerName: 'COUNTERPARTY',
        width: 180,
        sortable: true,
        filter: true,
      },
      {
        field: 'quantity',
        headerName: 'QUANTITY',
        width: 110,
        sortable: true,
        filter: true,
        type: 'rightAligned',
        valueFormatter: (params: any) => params.value?.toLocaleString() || '',
      },
      {
        field: 'marketPrice',
        headerName: 'MARKET PRICE',
        width: 130,
        sortable: true,
        filter: true,
        type: 'rightAligned',
        valueFormatter: (params: any) => (params.value ? `$${params.value.toFixed(4)}` : ''),
      },
      {
        field: 'price',
        headerName: 'ORDER PRICE',
        width: 120,
        sortable: true,
        filter: true,
        type: 'rightAligned',
        valueFormatter: (params: any) => (params.value ? `$${params.value.toFixed(4)}` : ''),
      },
      {
        field: 'negotiationState',
        headerName: 'NEGOTIATION',
        width: 170,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const state = NEGOTIATION_STATE_MAP[params.value]
          if (!state) return null
          return (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Tag
                color={state.color}
                icon={state.icon}
                style={{ margin: 0, fontSize: '11px' }}
              >
                {state.label}
              </Tag>
            </div>
          )
        },
      },
      {
        field: 'actions',
        headerName: 'ACTIONS',
        width: 130,
        pinned: 'right',
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <a
              style={{ color: '#1890ff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              onClick={() => handleViewOrder(params.data)}
            >
              View Details
            </a>
          </div>
        ),
      },
    ],
    [handleViewOrder],
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => String(params.data.tradeEntryId),
      domLayout: 'normal',
      suppressRowClickSelection: true,
      rowHeight: 48,
      headerHeight: 40,
      enableCellTextSelection: true,
      ensureDomOrder: true,
      onRowDoubleClicked: (params: any) => handleViewOrder(params.data),
    }),
    [handleViewOrder],
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Pending Prompts',
      hideActiveFilters: false,
    }),
    [],
  )

  return (
    <div className='negotiation-dashboard'>
      {/* Dashboard Header */}
      <div className='negotiation-dashboard-header'>
        <Vertical gap={2}>
          <Texto category='h4'>OSP Order Administration</Texto>
          <Texto category='p2' appearance='medium'>
            Manage pending orders and negotiations. Click an order to view details and negotiation
            status.
          </Texto>
        </Vertical>
        <Horizontal gap={16} verticalCenter>
          {Object.entries(NEGOTIATION_STATE_MAP).map(([key, state]) => {
            const count = pendingOrders.filter((o) => o.negotiationState === key).length
            return (
              <Horizontal gap={4} key={key} verticalCenter>
                <Tag color={state.color} icon={state.icon} style={{ margin: 0, fontSize: '11px' }}>
                  {state.label}
                </Tag>
                <Texto style={{ fontSize: '12px', fontWeight: 600, color: '#595959' }}>
                  {count}
                </Texto>
              </Horizontal>
            )
          })}
        </Horizontal>
      </div>

      {/* Grid */}
      <div className='negotiation-dashboard-grid'>
        <GraviGrid
          storageKey='negotiation-pending-prompts'
          rowData={pendingOrders}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          updateEP={async () => {}}
        />
      </div>

      {/* Order Details Modal with Negotiation Panel */}
      <OrderDetailsModal
        open={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </div>
  )
}
