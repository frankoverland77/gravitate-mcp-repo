import '../styles.css'

import { ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Checkbox, Form, List, Modal } from 'antd'
import React from 'react'

import { NegotiationPanel } from './NegotiationPanel'
import { NegotiationPanelProps } from '../types'

// ─── Order data shape (mirrors Model from useOnlineOrderViewTypes) ──────

export interface OrderData {
  tradeEntryId: number
  orderStatusCodeValueMeaning: 'Pending' | 'Accepted' | 'Canceled' | 'Declined'
  tradeTypeCodeValueMeaning: 'Prompt' | 'Forward'
  isBidOrOffer: boolean
  isInternalUser: boolean
  areSetupsStillValid: boolean

  productName: string
  fromLocationName: string
  quantity: number
  price: number

  purchaseType: 'Market' | 'Bid' | 'Index'
  orderOrigin: string
  instrument: string
  counterparty: string
  contactName: string

  marketPrice: number | null
  margin: number | null

  // Index offer fields
  sourceIndexOfferId: number | null
  pricingDisplayText: string | null
  contractDifferential: number | null
  formulaVariables: { name: string; source: string; value: string }[]
  pricingEffectiveTimes: string | null
  pricingWeekendBehavior: string | null
  pricingHolidayBehavior: string | null
  additionalFreetextTerms: string | null

  comments: string | null
  createdDate: string

  // Additional items
  additionalProducts: { name: string; location: string; price: number }[]
  destinationLocations: string[]
  loadingNumbers: string[]

  // Validation
  exportStatus?: string
  exportDate?: string
  externalStatus?: string

  // Lifting days (for prompt accepted orders)
  liftingDaysFrom?: string
  liftingDaysTo?: string

  // Negotiation
  negotiationState: string
  statusColor: string
  negotiationProps: NegotiationPanelProps
}

interface OrderDetailsModalProps {
  visible: boolean
  order: OrderData | null
  onClose: () => void
}

// ─── Status badge (matches Header.tsx in vNext) ─────────────────────

function getStatus(status: string) {
  switch (status) {
    case 'Accepted':
    case 'Filled':
      return (
        <BBDTag success className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          Accepted
        </BBDTag>
      )
    case 'Canceled':
      return (
        <BBDTag error className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          Canceled
        </BBDTag>
      )
    case 'Declined':
      return (
        <BBDTag error className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          Declined
        </BBDTag>
      )
    default:
      return (
        <BBDTag className='mr-0 py-1 px-4' style={{ fontSize: 13 }}>
          <ClockCircleOutlined className='mr-2' /> {status}
        </BBDTag>
      )
  }
}

// ─── Modal ──────────────────────────────────────────────────────────

export function OrderDetailsModal({ visible, order, onClose }: OrderDetailsModalProps) {
  if (!order) return null

  const isPendingStatus = order.orderStatusCodeValueMeaning === 'Pending'
  const isAcceptedStatus = order.orderStatusCodeValueMeaning === 'Accepted'
  const isIndexOffer = order.sourceIndexOfferId != null
  const isBid = order.isBidOrOffer
  const isInternal = order.isInternalUser
  const isPrompt = order.tradeTypeCodeValueMeaning === 'Prompt'
  const canAcceptRejectOrder = isPendingStatus && !isBid && isInternal

  const orderHasAdditionalInfo =
    !!order.loadingNumbers.length ||
    !!order.destinationLocations.length ||
    (order.liftingDaysFrom && order.liftingDaysTo && isPrompt && isAcceptedStatus)

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={800}
      styles={{ body: { padding: 0 } }}
      footer={null}
      destroyOnHidden
      title='VIEW DETAILS'
    >
      <Form style={{ width: '100%' }}>
        <Vertical className='bg-2'>
          {/* ── Header (mirrors Header.tsx) ───────────────────────── */}
          <Horizontal className='secondary-gradient-background py-2 px-4' width='100%' flex={1}>
            <Vertical gap={2} className='py-2'>
              <Horizontal className='justify-sb' width='100%' verticalCenter>
                <Texto appearance='white' category='h4'>
                  Order# {order.tradeEntryId}
                </Texto>
                {getStatus(order.orderStatusCodeValueMeaning)}
              </Horizontal>
              <Horizontal className='justify-sb' width='100%' verticalCenter>
                <Texto appearance='white' category='h3'>
                  {order.productName}
                </Texto>
                <Texto appearance='white' category='h3'>
                  {order.quantity.toLocaleString()} GAL(S)
                </Texto>
              </Horizontal>
              <Horizontal className='justify-sb' width='100%' verticalCenter>
                <Texto appearance='white' category='h4'>
                  {order.fromLocationName}
                </Texto>
                {!isIndexOffer && (
                  <Texto appearance='white' category='h4'>
                    ${order.price.toFixed(4)} gal
                  </Texto>
                )}
                {isIndexOffer && order.contractDifferential != null && (
                  <Texto appearance='white' category='h4'>
                    ${order.contractDifferential.toFixed(4)}
                  </Texto>
                )}
              </Horizontal>
              {isIndexOffer && order.pricingDisplayText && (
                <Texto appearance='white' category='h4'>
                  {order.pricingDisplayText}
                </Texto>
              )}
            </Vertical>
          </Horizontal>

          {/* ── Bid indicator (mirrors UpdateFields) ─────────────── */}
          {isPendingStatus && isBid && (
            <Horizontal
              className='px-4 py-2'
              verticalCenter
              gap={8} style={{ backgroundColor: 'var(--theme-color-2-trans, rgba(24,144,255,0.06))' }}
            >
              <DownloadOutlined style={{ color: 'var(--theme-color-2, #1890ff)' }} />
              <Texto category='p2' weight={600} appearance='primary'>
                BID ORDER
              </Texto>
            </Horizontal>
          )}

          {/* ── Content sections (flex-wrap, flex-half) ──────────── */}
          <Horizontal className='m-4' style={{ flexWrap: 'wrap' }}>
            {/* Additional Products */}
            {order.additionalProducts.length > 0 && (
              <div className='flex-half'>
                <Vertical className='mx-4'>
                  <Horizontal className='border-bottom'>
                    <Texto category='h5' appearance='medium'>
                      ADDITIONAL PRODUCTS
                    </Texto>
                  </Horizontal>
                  <Horizontal
                    className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                    style={{ borderRadius: 5, fontSize: 12 }}
                  >
                    <Vertical style={{ width: '100%' }}>
                      {order.additionalProducts.map((p, i) => (
                        <Horizontal
                          key={i}
                          className={`justify-sb bg-1 ${i > 0 ? 'mt-2' : ''}`}
                          style={{ borderRadius: 5 }}
                        >
                          <Texto appearance='medium' weight={600}>
                            {p.name} @ {p.location}
                          </Texto>
                          <Texto appearance='medium'>${p.price.toFixed(4)}</Texto>
                        </Horizontal>
                      ))}
                    </Vertical>
                  </Horizontal>
                </Vertical>
              </div>
            )}

            {/* Formula Components (Index) */}
            {isIndexOffer && order.formulaVariables.length > 0 && (
              <div className='flex-half'>
                <Vertical className='mx-4'>
                  <Horizontal className='border-bottom'>
                    <Texto category='h5' appearance='medium'>
                      FORMULA COMPONENTS
                    </Texto>
                  </Horizontal>
                  <div className='mt-3'>
                    <List
                      className='formula-components-list'
                      size='small'
                      header={
                        <div className='formula-components-row'>
                          <Texto category='p2' weight={600} className='formula-col-name'>
                            Variable
                          </Texto>
                          <Texto category='p2' weight={600} className='formula-col-source'>
                            Source
                          </Texto>
                          <Texto category='p2' weight={600} className='formula-col-value'>
                            Value
                          </Texto>
                        </div>
                      }
                      footer={
                        <div className='formula-components-row'>
                          <Texto category='p2' weight={600} className='formula-col-name'>
                            Contract Differential
                          </Texto>
                          <Texto category='p2' className='formula-col-source'>
                            {isBid ? 'Bid' : ''}
                          </Texto>
                          <Texto category='p2' weight={600} className='formula-col-value'>
                            {isBid ? '' : `$${order.contractDifferential?.toFixed(4) || '0.0000'}`}
                          </Texto>
                        </div>
                      }
                      dataSource={order.formulaVariables}
                      renderItem={(item: any) => (
                        <List.Item style={{ padding: '5px 8px' }}>
                          <div className='formula-components-row'>
                            <Texto category='p2' className='formula-col-name'>
                              {item.name}
                            </Texto>
                            <Texto category='p2' className='formula-col-source'>
                              {item.source}
                            </Texto>
                            <Texto category='p2' className='formula-col-value'>
                              {item.value}
                            </Texto>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                </Vertical>
              </div>
            )}

            {/* Pricing Terms (Index) */}
            {isIndexOffer && (
              <div className='flex-half'>
                <Vertical className='mx-4'>
                  <Horizontal className='border-bottom'>
                    <Texto category='h5' appearance='medium'>
                      PRICING TERMS
                    </Texto>
                  </Horizontal>
                  <Vertical>
                    {order.pricingEffectiveTimes && (
                      <Horizontal
                        className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                        style={{ borderRadius: 5, fontSize: 12 }}
                      >
                        <Texto appearance='medium' weight={600}>
                          Effective Times
                        </Texto>
                        <Texto appearance='medium'>{order.pricingEffectiveTimes}</Texto>
                      </Horizontal>
                    )}
                    {order.pricingWeekendBehavior && (
                      <Horizontal
                        className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                        style={{ borderRadius: 5, fontSize: 12 }}
                      >
                        <Texto appearance='medium' weight={600}>
                          Weekend Behavior
                        </Texto>
                        <Texto appearance='medium'>{order.pricingWeekendBehavior}</Texto>
                      </Horizontal>
                    )}
                    {order.pricingHolidayBehavior && (
                      <Horizontal
                        className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                        style={{ borderRadius: 5, fontSize: 12 }}
                      >
                        <Texto appearance='medium' weight={600}>
                          Holiday Behavior
                        </Texto>
                        <Texto appearance='medium'>{order.pricingHolidayBehavior}</Texto>
                      </Horizontal>
                    )}
                    {order.additionalFreetextTerms && (
                      <Horizontal
                        className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                        style={{ borderRadius: 5, fontSize: 12 }}
                      >
                        <Texto appearance='medium' weight={600}>
                          Terms
                        </Texto>
                        <Texto appearance='medium' style={{ maxWidth: '70%', textAlign: 'right' }}>
                          {order.additionalFreetextTerms}
                        </Texto>
                      </Horizontal>
                    )}
                  </Vertical>
                </Vertical>
              </div>
            )}

            {/* Trade Notes */}
            {order.comments && (
              <div className='flex-half'>
                <Vertical className='mx-4'>
                  <Horizontal className='border-bottom'>
                    <Texto category='h5' appearance='medium'>
                      TRADE NOTE
                    </Texto>
                  </Horizontal>
                  <Horizontal
                    className='mt-3 p-2 bg-1 bordered border-rounded'
                    style={{ borderRadius: 5, fontSize: 12 }}
                  >
                    <Texto appearance='medium'>{order.comments}</Texto>
                  </Horizontal>
                </Vertical>
              </div>
            )}

            {/* Additional Info (mirrors AdditionalInfo.tsx) */}
            {orderHasAdditionalInfo && (
              <div className='flex-half'>
                <Vertical className='mx-4'>
                  <Horizontal className='border-bottom'>
                    <Texto category='h5' appearance='medium'>
                      ADDITIONAL INFO
                    </Texto>
                  </Horizontal>
                  {order.liftingDaysFrom && order.liftingDaysTo && (
                    <Horizontal
                      className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                      style={{ borderRadius: 5, fontSize: 12 }}
                    >
                      <Texto appearance='medium' weight={600}>
                        Lifting Days
                      </Texto>
                      <Texto appearance='medium'>
                        {order.liftingDaysFrom} - {order.liftingDaysTo}
                      </Texto>
                    </Horizontal>
                  )}
                  {order.destinationLocations.length > 0 && (
                    <Horizontal
                      className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                      style={{ borderRadius: 5, fontSize: 12 }}
                    >
                      <Texto appearance='medium' weight={600}>
                        Destination States
                      </Texto>
                      <Texto appearance='medium'>{order.destinationLocations.join(', ')}</Texto>
                    </Horizontal>
                  )}
                  {order.loadingNumbers.length > 0 && (
                    <Horizontal
                      className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                      verticalCenter
                      style={{ borderRadius: 5, fontSize: 12 }}
                    >
                      <Texto appearance='medium' weight={600} style={{ whiteSpace: 'nowrap' }} className='mr-4'>
                        Loading Numbers
                      </Texto>
                      <Texto appearance='medium'>{order.loadingNumbers.join(', ')}</Texto>
                    </Horizontal>
                  )}
                </Vertical>
              </div>
            )}

            {/* Counterparty Info (mirrors CounterPartyInfo.tsx) */}
            <div className='flex-half'>
              <Vertical className='mx-4'>
                <Horizontal className='border-bottom'>
                  <Texto category='h5' appearance='medium'>
                    COUNTERPARTY INFO
                  </Texto>
                </Horizontal>
                <Horizontal
                  className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
                  style={{ borderRadius: 5, fontSize: 12 }}
                >
                  <Vertical>
                    <Horizontal className='justify-sb bg-1' style={{ borderRadius: 5 }}>
                      <Texto appearance='medium' weight={600}>
                        Contact
                      </Texto>
                      <Texto appearance='medium'>{order.contactName}</Texto>
                    </Horizontal>
                    <Horizontal className='mt-2 justify-sb bg-1' style={{ borderRadius: 5 }}>
                      <Texto appearance='medium' weight={600}>
                        Counterparty
                      </Texto>
                      <Texto appearance='medium'>{order.counterparty}</Texto>
                    </Horizontal>
                  </Vertical>
                </Horizontal>
              </Vertical>
            </div>
          </Horizontal>

          {/* ── Validation Issues & Counterparty (bottom row) ────── */}
          <Horizontal className='mx-4' style={{ flexWrap: 'wrap' }}>
            {/* Validation Issues (mirrors ValidationIssues.tsx) */}
            {isInternal && (
              <div className='flex-half'>
                <Vertical className='m-4'>
                  <Horizontal className='border-bottom'>
                    <Texto category='h5' appearance='medium'>
                      VALIDATION ISSUES
                    </Texto>
                  </Horizontal>
                  <Horizontal className='mt-3 justify-sb' style={{ borderRadius: 5, fontSize: 12 }}>
                    <Vertical>
                      <Horizontal className='justify-sb p-2 bg-1 bordered border-rounded' style={{ borderRadius: 5 }}>
                        <Texto appearance='medium' weight={600}>
                          Export Status
                        </Texto>
                        <Texto appearance='medium'>{order.exportStatus || 'Pending'}</Texto>
                      </Horizontal>
                      <Horizontal
                        className='justify-sb p-2 mt-3 bg-1 bordered border-rounded'
                        style={{ borderRadius: 5 }}
                      >
                        <Texto appearance='medium' weight={600}>
                          Export Date
                        </Texto>
                        <Texto appearance='medium'>{order.exportDate || 'N/A'}</Texto>
                      </Horizontal>
                      <Horizontal
                        className='justify-sb p-2 mt-3 bg-1 bordered border-rounded'
                        style={{ borderRadius: 5 }}
                      >
                        <Texto appearance='medium' weight={600}>
                          External Status
                        </Texto>
                        <Texto appearance='medium'>{order.externalStatus || 'N/A'}</Texto>
                      </Horizontal>
                    </Vertical>
                  </Horizontal>
                </Vertical>
              </div>
            )}
          </Horizontal>

          {/* ── NEGOTIATION (new subcomponent added to existing modal) */}
          {isPendingStatus && (
            <div className='mx-4 mb-4'>
              <Vertical className='mx-4'>
                <Horizontal className='border-bottom'>
                  <Texto category='h5' appearance='medium'>
                    NEGOTIATION
                  </Texto>
                </Horizontal>
                <div className='mt-3'>
                  <NegotiationPanel {...order.negotiationProps} />
                </div>
              </Vertical>
            </div>
          )}

          {/* ── Footer (mirrors Footer.tsx) ───────────────────────── */}
          {isPendingStatus && (
            <Horizontal
              className='bg-3 px-4 py-3 justify-sb'
              verticalCenter
              style={{ fontSize: 12 }}
            >
              <Horizontal verticalCenter>
                {isInternal && (
                  <Button
                    style={{
                      fontSize: '10px',
                      justifyContent: 'space-between',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'var(--theme-color-2-dim, rgba(24,144,255,0.08))',
                    }}
                  >
                    <Texto appearance='primary' style={{ fontSize: 12 }}>
                      Send External Notification
                    </Texto>
                    <Checkbox defaultChecked className='ml-4' />
                  </Button>
                )}
              </Horizontal>
              <Horizontal gap={25}>
                {isBid && (
                  <GraviButton theme1 buttonText='Save Changes' onClick={() => {}} disabled />
                )}

                {!canAcceptRejectOrder && order.areSetupsStillValid && (
                  <Horizontal gap={10} verticalCenter>
                    <GraviButton
                      style={{
                        border: '1px solid var(--theme-error, #ff4d4f)',
                        color: 'var(--theme-error, #ff4d4f)',
                        backgroundColor: 'var(--theme-error-trans, rgba(255,77,79,0.06))',
                      }}
                      buttonText={`Cancel ${isBid ? 'Bid' : 'Order'}`}
                      onClick={() => {}}
                    />
                    {isInternal && (
                      <GraviButton theme3 buttonText='Accept Bid' onClick={() => {}} />
                    )}
                  </Horizontal>
                )}

                {canAcceptRejectOrder && order.areSetupsStillValid && (
                  <Horizontal gap={20} verticalCenter>
                    <GraviButton
                      buttonText='Reject'
                      onClick={() => {}}
                      style={{
                        border: '1px solid var(--theme-error, #ff4d4f)',
                        color: 'var(--theme-error, #ff4d4f)',
                        backgroundColor: 'var(--theme-error-trans, rgba(255,77,79,0.06))',
                      }}
                    />
                    <GraviButton theme3 buttonText='Accept' onClick={() => {}} />
                  </Horizontal>
                )}
              </Horizontal>
            </Horizontal>
          )}
        </Vertical>
      </Form>
    </Modal>
  )
}
