import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Drawer, Form, Input, InputNumber, notification, Segmented, Select } from 'antd'
import { useCallback, useMemo, useState } from 'react'

import type { SpecialOfferMetadataResponseData } from '../../ManageOffers.types'
import { addCommasToNumber } from '../../utils/formatters'
import { constructDateTimeString } from '../../utils/Utils/FormHelpers'
import { TimingPresets } from './TimingPresets'
import {
  CUSTOMER_GROUPS,
  TERMS_TEMPLATES,
  resolveTemplateId,
} from './QuickSetupConstants'

interface QuickSetupPanelProps {
  open: boolean
  onClose: () => void
  metadata: SpecialOfferMetadataResponseData | undefined
  onOpenFullWizard: () => void
}

const numberInputProps = {
  formatter: (value: any) => (parseFloat(value) ? addCommasToNumber(parseFloat(value)) : value),
  parser: (value: any) => value?.replace(/(,*)/g, ''),
  style: { width: '100%' },
  className: 'border-radius-5',
}

export function QuickSetupPanel({ open, onClose, metadata, onOpenFullWizard }: QuickSetupPanelProps) {
  const [form] = Form.useForm()
  const [transactionType, setTransactionType] = useState<'Auction' | 'Offer'>('Offer')
  const [pricingStrategy, setPricingStrategy] = useState<'Fixed' | 'Index'>('Fixed')
  const [selectedTimingPreset, setSelectedTimingPreset] = useState('next-day')
  const [showAdvancedVolume, setShowAdvancedVolume] = useState(false)
  const [selectedTermsTemplate, setSelectedTermsTemplate] = useState<number | null>(1)

  const isAuction = transactionType === 'Auction'
  const isIndex = pricingStrategy === 'Index'
  const currentTemplate = TERMS_TEMPLATES.find((t) => t.id === selectedTermsTemplate)
  const isCustomTemplate = currentTemplate?.name === 'Custom'

  const productLocationOptions = useMemo(() =>
    metadata?.ProductLocationSelections?.map((pl) => ({
      label: `${pl.ProductName} — ${pl.LocationName}`,
      value: pl.TradeEntrySetupId,
    })) ?? [],
    [metadata]
  )

  const customerOptions = useMemo(() =>
    metadata?.EligibleCounterParties?.map((cp) => ({
      label: cp.Text,
      value: cp.Value,
    })) ?? [],
    [metadata]
  )

  const publisherOptions = useMemo(() =>
    metadata?.IndexOfferMetaData?.PricePublishers?.map((p) => ({
      label: p.Text,
      value: p.Value,
    })) ?? [],
    [metadata]
  )

  const handleGroupClick = useCallback((customerIds: string[]) => {
    const current: string[] = form.getFieldValue('CounterPartyIds') || []
    const merged = Array.from(new Set([...current, ...customerIds]))
    form.setFieldsValue({ CounterPartyIds: merged })
  }, [form])

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields()
      const templateId = resolveTemplateId(
        transactionType,
        pricingStrategy,
        metadata?.SpecialOfferTemplates ?? []
      )

      const payload = {
        SpecialOfferTemplateId: templateId,
        TotalVolume: values.TotalVolume,
        MinimumVolumePerOrder: values.MinimumVolumePerOrder || values.TotalVolume,
        MaximumVolumePerOrder: values.MaximumVolumePerOrder || values.TotalVolume,
        VolumeIncrement: values.VolumeIncrement || 1,
        ReservePrice: values.ReservePrice ?? undefined,
        FixedPrice: pricingStrategy === 'Fixed' ? values.Price : undefined,
        MarketOffset: pricingStrategy === 'Index' ? values.Differential : undefined,
        VisibilityStartDateTime: constructDateTimeString(values.VisibilityWindowStartDate, values.VisibilityWindowStartTime),
        VisibilityEndDateTime: constructDateTimeString(values.VisibilityWindowEndDate, values.VisibilityWindowEndTime),
        OrderEffectiveStartDateTime: constructDateTimeString(values.PickupWindowStartDate, values.PickupWindowStartTime),
        OrderEffectiveEndDateTime: constructDateTimeString(values.PickupWindowEndDate, values.PickupWindowEndTime),
        CounterPartyIds: values.CounterPartyIds,
        TradeEntrySetupIds: [values.ProductLocation],
        InvitationTriggerDateTimeTZ: constructDateTimeString(values.InviteTriggerDate, values.InviteTriggerTime),
      }

      console.info('[QuickSetup] Offer payload:', payload)
      notification.success({ message: 'Offer Created', description: 'Your offer has been submitted successfully.' })
      form.resetFields()
      setTransactionType('Offer')
      setPricingStrategy('Fixed')
      setSelectedTimingPreset('next-day')
      setShowAdvancedVolume(false)
      setSelectedTermsTemplate(1)
      onClose()
    } catch {
      // validation errors are shown inline by antd
    }
  }, [form, transactionType, pricingStrategy, metadata, onClose])

  const handleClose = useCallback(() => {
    form.resetFields()
    setTransactionType('Offer')
    setPricingStrategy('Fixed')
    setSelectedTimingPreset('next-day')
    setShowAdvancedVolume(false)
    setSelectedTermsTemplate(1)
    onClose()
  }, [form, onClose])

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      placement='right'
      width={600}
      destroyOnHidden
      title='Quick Setup — New Offer'
      footer={
        <Horizontal justifyContent='space-between' alignItems='center'>
          <GraviButton
            className='ghost-gravi-button'
            buttonText='Open Full Wizard →'
            onClick={onOpenFullWizard}
          />
          <Horizontal gap={12}>
            <GraviButton buttonText='Cancel' onClick={handleClose} />
            <GraviButton theme1 buttonText='Create Offer' onClick={handleSubmit} />
          </Horizontal>
        </Horizontal>
      }
    >
      <Form form={form} layout='vertical' scrollToFirstError>
        {/* §1 Transaction Type */}
        <Vertical style={{ marginBottom: 24 }}>
          <Texto style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }} appearance='medium'>
            Transaction Type
          </Texto>
          <Segmented
            options={['Auction', 'Offer']}
            block
            value={transactionType}
            onChange={(val) => setTransactionType(val as 'Auction' | 'Offer')}
            style={{ marginBottom: 12 }}
          />
          <div style={{ background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px' }}>
            <Texto style={{ fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>
              {isAuction ? 'Auction' : 'Offer'}
            </Texto>
            <Texto>
              {isAuction
                ? 'Buyers bid on your volume. Set a reserve price as your minimum acceptable price.'
                : 'You set the price. For index pricing, specify a differential from the index.'}
            </Texto>
          </div>
        </Vertical>

        {/* §2 Pricing Strategy */}
        <Vertical style={{ marginBottom: 24 }}>
          <Texto style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }} appearance='medium'>
            Pricing Strategy
          </Texto>
          <Segmented
            options={['Fixed', 'Index']}
            block
            value={pricingStrategy}
            onChange={(val) => setPricingStrategy(val as 'Fixed' | 'Index')}
            style={{ marginBottom: 16 }}
          />

          {!isIndex && (
            <>
              <Form.Item
                label='Price'
                name='Price'
                rules={[
                  { required: true, message: 'Price is required' },
                  { type: 'number', min: 0.0001, message: 'Must be greater than 0' },
                ]}
              >
                <InputNumber prefix='$' addonAfter='/gal' precision={4} style={{ width: '100%' }} />
              </Form.Item>
              {isAuction && (
                <Form.Item
                  label='Reserve Price'
                  name='ReservePrice'
                  rules={[
                    { required: true, message: 'Reserve price is required' },
                    { type: 'number', min: 0.0001, message: 'Must be greater than 0' },
                  ]}
                  extra='Minimum acceptable price per deal.'
                >
                  <InputNumber prefix='$' addonAfter='/gal' precision={4} style={{ width: '100%' }} />
                </Form.Item>
              )}
            </>
          )}

          {isIndex && (
            <>
              <Form.Item
                label='Price Index'
                name='PricePublisherId'
                rules={[{ required: true, message: 'Price index is required' }]}
                extra='The published index your price will reference'
              >
                <Select
                  showSearch
                  placeholder='Select price index'
                  options={publisherOptions}
                  optionFilterProp='label'
                />
              </Form.Item>

              <Form.Item
                label='Terms Template'
                name='TermsTemplateId'
                rules={[{ required: true, message: 'Terms template is required' }]}
                extra='Automatically fills timing basis and settlement terms'
              >
                <Select
                  placeholder='Select terms template'
                  options={TERMS_TEMPLATES.map((t) => ({ label: t.name, value: t.id }))}
                  onChange={(val: number) => setSelectedTermsTemplate(val)}
                />
              </Form.Item>

              {currentTemplate && !isCustomTemplate && (
                <div style={{ background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                  <Texto style={{ fontWeight: 600, marginBottom: 8 }}>Terms Preview</Texto>
                  <Vertical gap={4}>
                    <Horizontal justifyContent='space-between'>
                      <Texto appearance='medium'>Price Effective</Texto>
                      <Texto>{currentTemplate.effectiveTime}</Texto>
                    </Horizontal>
                    <Horizontal justifyContent='space-between'>
                      <Texto appearance='medium'>Weekend Rule</Texto>
                      <Texto>{currentTemplate.weekendRule}</Texto>
                    </Horizontal>
                    <Horizontal justifyContent='space-between'>
                      <Texto appearance='medium'>Holiday Rule</Texto>
                      <Texto>{currentTemplate.holidayRule}</Texto>
                    </Horizontal>
                  </Vertical>
                </div>
              )}

              {isCustomTemplate && (
                <>
                  <Form.Item label='Price Effective' name='PricingEffectiveTimes'>
                    <Input placeholder='e.g. Friday, Midnight (CT)' />
                  </Form.Item>
                  <Form.Item label='Weekend Rule' name='PricingWeekendBehavior'>
                    <Input placeholder='e.g. Saturday & Sunday: Add $0.025/gal' />
                  </Form.Item>
                  <Form.Item label='Holiday Rule' name='PricingHolidayBehavior'>
                    <Input placeholder='e.g. None' />
                  </Form.Item>
                </>
              )}

              {isAuction ? (
                <Form.Item
                  label='Reserve Price'
                  name='ReservePrice'
                  rules={[
                    { required: true, message: 'Reserve price is required' },
                    { type: 'number', min: 0.0001, message: 'Must be greater than 0' },
                  ]}
                  extra='Minimum acceptable price per deal'
                >
                  <InputNumber prefix='$' addonAfter='/gal' precision={4} style={{ width: '100%' }} />
                </Form.Item>
              ) : (
                <Form.Item
                  label='Differential'
                  name='Differential'
                  rules={[{ required: true, message: 'Differential is required' }]}
                  extra='Added to (or subtracted from) the index. Use negative values to discount.'
                >
                  <InputNumber prefix='$' addonAfter='/gal' precision={4} style={{ width: '100%' }} />
                </Form.Item>
              )}

              <Form.Item label='Additional Terms' name='AdditionalFreetextTerms'>
                <Input.TextArea rows={3} maxLength={500} showCount placeholder='Enter any extra terms, conditions, or special notes...' />
              </Form.Item>
            </>
          )}
        </Vertical>

        <div style={{ height: 1, background: '#e5e7eb', margin: '0 0 24px' }} />

        {/* §3 Product & Location */}
        <Vertical style={{ marginBottom: 24 }}>
          <Texto style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }} appearance='medium'>
            Product & Location
          </Texto>
          <Form.Item
            name='ProductLocation'
            rules={[{ required: true, message: 'Product & Location is required' }]}
          >
            <Select
              showSearch
              placeholder='Search products...'
              options={productLocationOptions}
              optionFilterProp='label'
            />
          </Form.Item>
        </Vertical>

        <div style={{ height: 1, background: '#e5e7eb', margin: '0 0 24px' }} />

        {/* §4 Volume */}
        <Vertical style={{ marginBottom: 24 }}>
          <Texto style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }} appearance='medium'>
            Volume
          </Texto>
          <Form.Item
            label='Total Volume'
            name='TotalVolume'
            rules={[
              { required: true, message: 'Total volume is required' },
              { type: 'number', min: 1, message: 'Must be greater than 0' },
            ]}
          >
            <InputNumber precision={0} addonAfter='gal' {...numberInputProps} />
          </Form.Item>

          <GraviButton
            className='ghost-gravi-button'
            buttonText={
              <>
                {showAdvancedVolume ? <CaretDownOutlined /> : <CaretRightOutlined />}
                {' '}Advanced Volume Settings
              </>
            }
            onClick={() => setShowAdvancedVolume(!showAdvancedVolume)}
            style={{ padding: '4px 0', marginBottom: showAdvancedVolume ? 12 : 0 }}
          />

          {showAdvancedVolume && (
            <Horizontal gap={12} style={{ overflow: 'visible' }}>
              <Vertical flex='1' style={{ overflow: 'visible' }}>
                <Form.Item
                  label='Min Volume'
                  name='MinimumVolumePerOrder'
                  rules={[{
                    validator: (_: any, value: number) => {
                      if (!value || value <= 0) return Promise.reject('Min Volume is required')
                      const maxVol = form.getFieldValue('MaximumVolumePerOrder')
                      if (maxVol && value > maxVol) return Promise.reject('Min cannot exceed max')
                      return Promise.resolve()
                    },
                  }]}
                >
                  <InputNumber precision={0} addonAfter='gal' {...numberInputProps} />
                </Form.Item>
              </Vertical>
              <Vertical flex='1' style={{ overflow: 'visible' }}>
                <Form.Item
                  label='Max Volume'
                  name='MaximumVolumePerOrder'
                  rules={[{
                    validator: (_: any, value: number) => {
                      if (!value || value <= 0) return Promise.reject('Max Volume is required')
                      const minVol = form.getFieldValue('MinimumVolumePerOrder')
                      if (minVol && value < minVol) return Promise.reject('Max cannot be less than min')
                      return Promise.resolve()
                    },
                  }]}
                >
                  <InputNumber precision={0} addonAfter='gal' {...numberInputProps} />
                </Form.Item>
              </Vertical>
              <Vertical flex='1' style={{ overflow: 'visible' }}>
                <Form.Item
                  label='Increment'
                  name='VolumeIncrement'
                  rules={[{
                    validator: (_: any, value: number) => {
                      if (!value || value <= 0) return Promise.reject('Increment is required')
                      return Promise.resolve()
                    },
                  }]}
                >
                  <InputNumber precision={0} addonAfter='gal' {...numberInputProps} />
                </Form.Item>
              </Vertical>
            </Horizontal>
          )}
        </Vertical>

        <div style={{ height: 1, background: '#e5e7eb', margin: '0 0 24px' }} />

        {/* §5 Timing */}
        <Vertical style={{ marginBottom: 24 }}>
          <Texto style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }} appearance='medium'>
            Timing
          </Texto>
          <TimingPresets
            form={form}
            selectedPreset={selectedTimingPreset}
            onSelectPreset={setSelectedTimingPreset}
          />
        </Vertical>

        <div style={{ height: 1, background: '#e5e7eb', margin: '0 0 24px' }} />

        {/* §6 Customers */}
        <Vertical style={{ marginBottom: 24 }}>
          <Texto style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }} appearance='medium'>
            Customers
          </Texto>
          <Horizontal gap={8} style={{ flexWrap: 'wrap', marginBottom: 12 }}>
            {CUSTOMER_GROUPS.map((group) => (
              <GraviButton
                key={group.label}
                className='ghost-gravi-button'
                buttonText={`${group.label} (${group.customerIds.length})`}
                onClick={() => handleGroupClick(group.customerIds)}
                size='small'
              />
            ))}
          </Horizontal>
          <Form.Item
            name='CounterPartyIds'
            rules={[{ required: true, message: 'At least one customer is required' }]}
          >
            <Select
              mode='multiple'
              showSearch
              placeholder='Search customers by name...'
              options={customerOptions}
              optionFilterProp='label'
            />
          </Form.Item>
        </Vertical>
      </Form>
    </Drawer>
  )
}
