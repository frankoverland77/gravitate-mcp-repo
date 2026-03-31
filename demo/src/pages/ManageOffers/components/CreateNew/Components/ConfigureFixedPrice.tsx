import { Texto } from '@gravitate-js/excalibrr'
import { Form, InputNumber } from 'antd'

export function ConfigureFixedPrice({ price }: { price: { title: string; description: string; name: string; formLabel: string; extra: string } }) {
  return (
    <>
      <Texto category={'h4'} className={'mt-4 text-18'}>
        {price.title}
      </Texto>
      <Texto className={'mb-2 text-14'}>{price.description}</Texto>
      <Texto className={'mb-1 text-14'}>{price.formLabel}</Texto>
      <Form.Item name={price.name} rules={[{ required: true, message: 'Price is required' }]}>
        <InputNumber
          max={999}
          prefix={'$'}
          precision={4}
          style={{ width: '100%' }}
          className={'border-radius-5'}
          min={0.0001}
        />
      </Form.Item>
      <Texto>{price.extra || ''}</Texto>
    </>
  )
}
