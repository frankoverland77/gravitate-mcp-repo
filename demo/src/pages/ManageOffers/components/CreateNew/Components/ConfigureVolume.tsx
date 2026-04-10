import { DownOutlined, RightOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { volumeInputList } from '../../../utils/Constants/FormConstants'
import { addCommasToNumber } from '../../../utils/formatters'
import type { SpecialOfferMetadataResponseData } from '../../../ManageOffers.types'
import { Form, InputNumber } from 'antd'
import type { FormInstance } from 'antd'
import { useMemo, useState } from 'react'

interface ConfigureVolumeProps {
  form: FormInstance
  metadata?: SpecialOfferMetadataResponseData
  dealType?: number
}

export function ConfigureVolume({ form, metadata, dealType }: ConfigureVolumeProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const totalVolume = Form.useWatch('TotalVolume', form)
  const minVolume = Form.useWatch('MinimumVolumePerOrder', form)
  const maxVolume = Form.useWatch('MaximumVolumePerOrder', form)
  const increment = Form.useWatch('VolumeIncrement', form)
  const defaultInputProps = {
    formatter: (value: any) => {
      return parseFloat(value) ? addCommasToNumber(parseFloat(value)) : value
    },
    parser: (value: any) => {
      return value?.replace(/(,*)/g, '')
    },
    style: { width: '100%' },
    className: 'border-radius-5',
  }
  const warnings = useMemo(() => {
    const errors: { text: string }[] = []
    if (!totalVolume) return errors
    if (minVolume && totalVolume < minVolume) {
      errors.push({
        text: `Total offered volume (${addCommasToNumber(totalVolume)}) must be at least ${addCommasToNumber(minVolume)} gallons (minimum per order)`,
      })
    }
    if (maxVolume && totalVolume < maxVolume) {
      errors.push({
        text: `Total offered (${addCommasToNumber(totalVolume)}) is less than max per order (${addCommasToNumber(maxVolume)})`,
      })
    }
    if (increment && totalVolume % increment !== 0) {
      errors.push({
        text: `Total volume should be divisible by increment (${addCommasToNumber(increment)} gallons)`,
      })
    }
    return errors
  }, [totalVolume, minVolume, maxVolume, increment])

  const volumeValidator = (_field: any, value: number) => {
    if (!value || value <= 0) {
      return Promise.reject('Volume is required')
    }
    if (warnings.length > 0) {
      return Promise.reject()
    } else {
      return Promise.resolve(value)
    }
  }

  const selectedTemplate = useMemo(() => {
    if (!dealType || !metadata?.SpecialOfferTemplates) return undefined
    return metadata.SpecialOfferTemplates.find((t) => t.SpecialOfferTemplateId === dealType)
  }, [dealType, metadata?.SpecialOfferTemplates])

  const handleResetToTemplate = () => {
    if (!selectedTemplate) return
    form.setFieldsValue({
      MinimumVolumePerOrder: selectedTemplate.DefaultMinimumVolumePerOrder,
      MaximumVolumePerOrder: selectedTemplate.DefaultMaximumVolumePerOrder,
      VolumeIncrement: selectedTemplate.DefaultVolumeIncrement,
    })
  }

  return (
    <>
      <Texto category={'h4'} className={'mt-4 text-18'}>
        Volume Configuration
      </Texto>
      <Texto className={'mb-4 text-14'}>Set total volume available and individual order requirements</Texto>
      <Texto className={'mt-2 text-14'}>Total Offered Volume</Texto>
      <Form.Item name='TotalVolume' rules={[{ validator: volumeValidator }]} style={{ marginBottom: '4px' }}>
        <InputNumber precision={0} {...defaultInputProps} suffix='gal' />
      </Form.Item>
      <Texto className={'mb-2'}>Total gallons available for this deal</Texto>

      <div
        onClick={() => setAdvancedOpen((prev) => !prev)}
        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: advancedOpen ? 12 : 0 }}
      >
        {advancedOpen ? <DownOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
        <Texto className={'text-14'} style={{ color: 'var(--theme-primary)', fontWeight: 500 }}>Advanced Volume Settings</Texto>
      </div>

      <Vertical className={'my-4 pb-4 border-bottom'} style={{ overflow: 'visible', display: advancedOpen ? 'flex' : 'none' }}>
        <Horizontal justifyContent='space-between' verticalCenter className={'mb-2'}>
          <Texto className={'text-14'} weight='bold'>Advanced Settings</Texto>
          {selectedTemplate && (
            <Texto
              className={'text-14'}
              style={{ color: 'var(--theme-primary)', cursor: 'pointer' }}
              onClick={handleResetToTemplate}
            >
              Reset to Template
            </Texto>
          )}
        </Horizontal>
        <Horizontal className={'pb-2'} gap="20px" style={{ overflow: 'visible' }}>
          {volumeInputList.map((item) => {
            return (
              <Vertical key={item.title} flex="1" style={{ overflow: 'visible' }}>
                <Texto className={'text-14'} style={{ marginBottom: '4px' }}>{item.title}</Texto>
                <Form.Item
                  name={item.name}
                  rules={[{ validator: (field: any, value: any) => item.validator(field, value, form) }]}
                  style={{ marginBottom: '4px' }}
                >
                  <InputNumber {...defaultInputProps} />
                </Form.Item>
                <Texto className={'mb-1'}>{item.description}</Texto>
              </Vertical>
            )
          })}
        </Horizontal>
        {warnings?.map((err, index) => (
          <Texto key={index} appearance={'error'} className={'mb-1 text-14'}>
            {err.text}
          </Texto>
        ))}
      </Vertical>
    </>
  )
}
