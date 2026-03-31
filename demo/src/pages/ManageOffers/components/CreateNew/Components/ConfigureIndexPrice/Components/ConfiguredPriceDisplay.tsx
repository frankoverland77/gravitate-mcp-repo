import { CloseOutlined, EditOutlined, RiseOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { IndexPricingFormData, SpecialOfferMetadataResponseData } from '../../../../../ManageOffers.types'
import { getPriceAdjustValue } from '../../../Util/indexConfigHelpers'
import { Button, Popconfirm, Tag } from 'antd'
import { useMemo } from 'react'

interface ConfiguredPriceDisplayProps {
  savedIndexData: IndexPricingFormData | null
  onSaveIndexPricing: (formData: IndexPricingFormData | null) => void
  formula: string
  openConfig: React.Dispatch<React.SetStateAction<boolean>>
  isAuction: boolean
  metadata?: SpecialOfferMetadataResponseData
}

export function ConfiguredPriceDisplay({
  savedIndexData,
  onSaveIndexPricing,
  formula,
  openConfig,
  isAuction,
  metadata,
}: ConfiguredPriceDisplayProps) {
  const priceAugment = useMemo(() => getPriceAdjustValue(savedIndexData, isAuction), [savedIndexData, isAuction])

  const effectiveTime = useMemo(
    () => metadata?.IndexOfferMetaData?.EffectiveTimes?.find((item) => item.Value == savedIndexData?.PricingEffectiveTimes)?.Text || '',
    [metadata?.IndexOfferMetaData, savedIndexData?.PricingEffectiveTimes]
  )

  return (
    <Vertical className={'bordered border-radius-10 p-4 gap-16'} verticalCenter>
      <Horizontal>
        <Vertical className={'index-pricing-icon-container'} verticalCenter horizontalCenter>
          <RiseOutlined style={{ color: 'var(--theme-color-1)', fontSize: '24px' }} />
        </Vertical>
        <Vertical className={'ml-2 gap-4'}>
          <Horizontal className={'gap-10'}>
            <Texto category={'h5'}>Index Pricing</Texto>
            <Tag color='blue'>Formula</Tag>
          </Horizontal>
          <Texto>Active Configuration</Texto>
        </Vertical>
        <Popconfirm title={'Are you sure you want to delete this configuration?'} onConfirm={() => onSaveIndexPricing(null)} trigger={'click'}>
          <GraviButton className={'ghost-gravi-button'} icon={<CloseOutlined />} />
        </Popconfirm>
      </Horizontal>

      <Vertical className={'bordered p-4 border-radius-5'} style={{ flexWrap: 'wrap', whiteSpace: 'break-spaces', width: '100%', backgroundColor: 'var(--bg-2)' }}>
        <Texto>Formula:</Texto>
        <Texto weight={'bold'} className={'formula-text'}>{formula}</Texto>
      </Vertical>
      <Vertical>
        <Texto>Components ({savedIndexData?.formulaComponents?.length})</Texto>
        <Horizontal style={{ flexWrap: 'wrap', width: '100%' }}>
          {savedIndexData?.formulaComponents?.map((component) => (
            <Tag style={{ background: 'var(--bg-1)' }} className={'m-1'} key={component.DisplayName + component.IdForGrid}>
              {component.DisplayName}
            </Tag>
          ))}
        </Horizontal>
      </Vertical>

      <Vertical className={'bordered p-2 border-radius-5'} style={{ flexWrap: 'wrap', whiteSpace: 'break-spaces', width: '100%', backgroundColor: 'var(--bg-3)' }}>
        <Texto className={'text-muted'}>{isAuction ? 'Reserve Price' : 'Differential'}</Texto>
        <Texto category={'h5'}>{priceAugment}</Texto>
        <Texto>per gallon</Texto>
      </Vertical>

      <Vertical className={'gap-10'}>
        <Horizontal justifyContent={'space-between'} style={{ width: '100%' }}>
          <Vertical flex="1" justifyContent={'flex-start'}>
            <Texto>Effective Time:</Texto>
            <Texto className={'text-14'}>{effectiveTime}</Texto>
          </Vertical>
          <Vertical flex="1">
            <Texto>Weekend Rule:</Texto>
            <Texto className={'text-14'}>{savedIndexData?.PricingWeekendBehavior}</Texto>
          </Vertical>
        </Horizontal>
        <Horizontal>
          <Vertical>
            <Texto>Holiday Rule:</Texto>
            <Texto className={'text-14'}>{savedIndexData?.PricingHolidayBehavior}</Texto>
          </Vertical>
        </Horizontal>
      </Vertical>

      <Horizontal className={'mt-4'}>
        <Button className={'pl-0'} type={'link'} onClick={() => openConfig(true)}>
          <EditOutlined /> Edit Configuration
        </Button>
      </Horizontal>
    </Vertical>
  )
}
