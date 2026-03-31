import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferMetadataResponseData } from '../../../../../ManageOffers.types'
import { Form, Input, Select } from 'antd'
import { useMemo } from 'react'

const toAntOption = (item: { Text: string; Value: string }) => ({ label: item.Text, value: item.Value })
const toStringOption = (str: string) => ({ label: str, value: str })

interface AdditionalTermsProps {
  metadata: SpecialOfferMetadataResponseData | undefined
}

export function AdditionalTerms({ metadata }: AdditionalTermsProps) {
  const effectiveTimeOptions = useMemo(
    () => metadata?.IndexOfferMetaData?.EffectiveTimes?.map(toAntOption) ?? [],
    [metadata?.IndexOfferMetaData?.EffectiveTimes]
  )
  const weekendRuleOptions = useMemo(
    () => metadata?.IndexOfferMetaData?.WeekendRuleOptions?.map(toStringOption) ?? [],
    [metadata?.IndexOfferMetaData?.WeekendRuleOptions]
  )
  const holidayRuleOptions = useMemo(
    () => metadata?.IndexOfferMetaData?.HolidayRuleOptions?.map(toStringOption) ?? [],
    [metadata?.IndexOfferMetaData?.HolidayRuleOptions]
  )

  return (
    <Vertical>
      <Texto weight='bold' textTransform='uppercase' className='mb-2'>Additional Terms</Texto>
      <Horizontal className={'gap-16'}>
        <Vertical flex="1">
          <Form.Item rules={[{ required: true, message: 'Effective Time is required' }]} name='PricingEffectiveTimes' label='Effective Time' style={{ width: '100%' }}>
            <Select allowClear options={effectiveTimeOptions} showSearch filterOption={(input: string, option?: { label: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
          </Form.Item>
        </Vertical>
        <Vertical flex="1">
          <Form.Item rules={[{ required: true, message: 'Weekend Rule is required' }]} name='PricingWeekendBehavior' label='Weekend Rule' style={{ width: '100%' }}>
            <Select allowClear options={weekendRuleOptions} showSearch filterOption={(input: string, option?: { label: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
          </Form.Item>
        </Vertical>
        <Vertical flex="1">
          <Form.Item rules={[{ required: true, message: 'Holiday Rule is required' }]} name='PricingHolidayBehavior' label='Holiday Rule' style={{ width: '100%' }}>
            <Select allowClear options={holidayRuleOptions} showSearch filterOption={(input: string, option?: { label: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
          </Form.Item>
        </Vertical>
      </Horizontal>
      <Vertical className={'mt-4'}>
        <Form.Item name='AdditionalFreetextTerms' label='Terms' initialValue=''>
          <Input.TextArea rows={4} style={{ width: '100%' }} />
        </Form.Item>
      </Vertical>
    </Vertical>
  )
}
