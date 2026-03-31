import dayjs, { type Dayjs } from 'dayjs'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import type { IndexPricingFormData, SpecialOfferMetadataResponseData } from '../../../ManageOffers.types'
import { PreviewDisplay } from './ConfigureIndexPrice/Components/PreviewDisplay'
import { dateFormat, fmt } from '../../../utils/formatters'
import { Form } from 'antd'
import type { FormInstance } from 'antd'
import { useMemo } from 'react'

const isDefinedAndNotNull = (val: any): boolean => val !== null && val !== undefined

interface PreviewPanelProps {
  dealType?: number
  productLocation?: number[]
  pricingStrategy?: number
  targetCustomers?: string[]
  metadata?: SpecialOfferMetadataResponseData
  selectedVisibilityWindowStart?: Dayjs
  selectedVisibilityWindowEnd?: Dayjs
  selectedPickupWindowStart?: Dayjs
  selectedPickupWindowEnd?: Dayjs
  form: FormInstance
  isIndexPricing: boolean
  indexPricingData?: IndexPricingFormData | null
  isAuction: boolean
}

export function PreviewPanel({
  dealType,
  productLocation,
  pricingStrategy,
  targetCustomers,
  metadata,
  selectedVisibilityWindowStart,
  selectedVisibilityWindowEnd,
  selectedPickupWindowStart,
  selectedPickupWindowEnd,
  form,
  isIndexPricing,
  indexPricingData,
  isAuction,
}: PreviewPanelProps) {
  const dealTypeLabel = useMemo(() => {
    if (!dealType || !metadata?.SpecialOfferTemplates) return ''
    const item = metadata.SpecialOfferTemplates.find((t) => t.SpecialOfferTemplateId === dealType)
    return item?.Name || dealType
  }, [dealType, metadata])

  const getProductValue = () => {
    if (!productLocation || !productLocation?.length || !metadata?.ProductLocationSelections) return ''
    const item = metadata.ProductLocationSelections.find((p) => p.TradeEntrySetupId === productLocation?.[0])
    if (!item) return ''
    return <Texto className={'text-wrap-whitespace text-14'}>{item?.ProductName} @ {item?.LocationName}</Texto>
  }
  const getPricingStrategyValue = () => {
    if (isIndexPricing) return <PreviewDisplay savedIndexData={indexPricingData} isAuction={isAuction} metadata={metadata} />
    if (!dealType || !isDefinedAndNotNull(pricingStrategy)) return ''
    const dealName = metadata?.SpecialOfferTemplates.find((t) => t.SpecialOfferTemplateId === dealType)?.Name
    const preface = dealName?.includes('Auction') ? 'Reserve' : 'Fixed'
    return <Texto className={'text-wrap-whitespace text-14'}>{preface}: {fmt.currency(pricingStrategy)}/gal</Texto>
  }
  const visibilityStartTime = Form.useWatch('VisibilityWindowStartTime', form)
  const visibilityEndTime = Form.useWatch('VisibilityWindowEndTime', form)
  const pickupStartTime = Form.useWatch('PickupWindowStartTime', form)
  const pickupEndTime = Form.useWatch('PickupWindowEndTime', form)
  const getTimingWindowsValue = () => {
    if (!selectedVisibilityWindowStart || !selectedVisibilityWindowEnd || !selectedPickupWindowStart || !selectedPickupWindowEnd) return ''
    const fmtStr = dateFormat.SHORT_DATE_YEAR_TIME_V2
    const VisStart = dayjs(selectedVisibilityWindowStart).hour(dayjs(visibilityStartTime).hour()).minute(dayjs(visibilityStartTime).minute())
    const VisEnd = dayjs(selectedVisibilityWindowEnd).hour(dayjs(visibilityEndTime).hour()).minute(dayjs(visibilityEndTime).minute())
    const PickStart = dayjs(selectedPickupWindowStart).hour(dayjs(pickupStartTime).hour()).minute(dayjs(pickupStartTime).minute())
    const PickEnd = dayjs(selectedPickupWindowEnd).hour(dayjs(pickupEndTime).hour()).minute(dayjs(pickupEndTime).minute())
    return (
      <>
        <Texto>Visibility:</Texto>
        <Texto className={'text-wrap-whitespace text-14'}>{VisStart.format(fmtStr)} - {VisEnd.format(fmtStr)}</Texto>
        <Texto>Pickup:</Texto>
        <Texto className={'text-wrap-whitespace text-14'}>{PickStart.format(fmtStr)} - {PickEnd.format(fmtStr)}</Texto>
      </>
    )
  }
  const getTargetCustomersValue = () => {
    if (!targetCustomers || !metadata?.EligibleCounterParties) return ''
    if (targetCustomers.length === 0) return ''
    return <Texto className={'text-14'}>{targetCustomers.length} Customers</Texto>
  }
  const items = useMemo(() => [
    { label: 'Product & Location', value: getProductValue() },
    { label: 'Pricing Strategy', value: getPricingStrategyValue() },
    { label: 'Timing Windows', value: getTimingWindowsValue() },
    { label: 'Target Customers', value: getTargetCustomersValue() },
  ], [productLocation, pricingStrategy, targetCustomers, metadata, selectedVisibilityWindowStart, selectedVisibilityWindowEnd, selectedPickupWindowStart, selectedPickupWindowEnd, visibilityStartTime, visibilityEndTime, pickupStartTime, pickupEndTime, isIndexPricing, indexPricingData, isAuction])

  return (
    <Vertical>
      <Vertical className={'mb-4'}>
        <Texto category={'h5'} className={'text-16'}>{dealTypeLabel}</Texto>
        <Texto className={'text-14 text-muted'}>What customers will see</Texto>
      </Vertical>
      {items.map((item) => (
        <Vertical className={`mb-4 p-3 border-radius-5 ${item.value ? 'bg-1 bordered' : 'bg-2 dotted-border'}`} key={item.label}>
          <Texto className={'text-muted mb-2'}>{item.label}</Texto>
          {item.value ? item.value : <Texto appearance={'medium'}><em>Not configured</em></Texto>}
        </Vertical>
      ))}
    </Vertical>
  )
}
