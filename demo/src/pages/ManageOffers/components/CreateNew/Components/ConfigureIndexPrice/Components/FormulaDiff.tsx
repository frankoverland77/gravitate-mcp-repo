import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, InputNumber } from 'antd'

export function FormulaDiff({ isAuction }: { isAuction: boolean }) {
  const title = isAuction ? 'Reserve Price' : 'Formula Differential'
  const name = isAuction ? 'ReservePrice' : 'FormulaDifferential'
  return (
    <Vertical>
      <Vertical className={'mb-4'}>
        <Texto weight='bold' textTransform='uppercase' className='mb-2'>{title}</Texto>
        <Form.Item
          name={name}
          rules={[
            { required: true, message: `${title} is required` },
            {
              validator: (_: any, value: number) => {
                if (isAuction && value <= 0) {
                  return Promise.reject(new Error('Reserve Price must be greater than zero'))
                }
                return Promise.resolve()
              },
            },
          ]}
          className={'mb-4'}
        >
          <InputNumber
            min={isAuction ? 0 : undefined}
            prefix={'$'}
            precision={4}
            style={{ width: '100%' }}
            placeholder={'0.0000'}
            max={8765309}
          />
        </Form.Item>
      </Vertical>
    </Vertical>
  )
}
