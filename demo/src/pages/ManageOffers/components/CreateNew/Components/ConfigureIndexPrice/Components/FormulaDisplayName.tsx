import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Checkbox, Form, Input } from 'antd'
import type { FormInstance } from 'antd'

interface FormulaDisplayNameProps {
  formula: string
  form: FormInstance
  showCustomInputForSeller: boolean
  setShowCustomInputForSeller: React.Dispatch<React.SetStateAction<boolean>>
  showCustomInputForBuyer: boolean
  setShowCustomInputForBuyer: React.Dispatch<React.SetStateAction<boolean>>
}

export function FormulaDisplayName({
  formula,
  form,
  showCustomInputForSeller,
  setShowCustomInputForSeller,
  showCustomInputForBuyer,
  setShowCustomInputForBuyer,
}: FormulaDisplayNameProps) {
  return (
    <Vertical>
      <Texto weight='bold' textTransform='uppercase' className='mb-2'>Formula Display Name</Texto>
      <Vertical className={'gap-10'}>
        <Vertical className='bordered p-3 border-radius-5' style={{ backgroundColor: 'var(--bg-2)' }}>
          <Texto className='text-muted'>Auto-Generated Formula</Texto>
          <Texto className='formula-text'>{formula}</Texto>
        </Vertical>
      </Vertical>
      <Vertical className={'gap-10 my-2'}>
        <Checkbox
          onChange={(value) => {
            setShowCustomInputForSeller(value.target.checked)
            if (!value.target.checked) form.resetFields(['InternalDisplayName'])
          }}
          checked={showCustomInputForSeller}
        >
          Override Internal Display Name (Seller View)
        </Checkbox>
        {showCustomInputForSeller && (
          <Form.Item name='InternalDisplayName' label='Internal Display Name (Seller View)'>
            <Input placeholder='Enter custom formula display name for internal/seller view' />
          </Form.Item>
        )}
      </Vertical>
      <Vertical className={'gap-10'}>
        <Checkbox
          className={'m-0'}
          onChange={(value) => {
            setShowCustomInputForBuyer(value.target.checked)
            if (!value.target.checked) form.resetFields(['ExternalDisplayName'])
          }}
          checked={showCustomInputForBuyer}
        >
          Override External Display Name (Buyer View)
        </Checkbox>
        {showCustomInputForBuyer && (
          <Form.Item name='ExternalDisplayName' label='External Display Name (Buyer View)'>
            <Input placeholder='Enter custom display formula name for external/buyer view' />
          </Form.Item>
        )}
      </Vertical>
    </Vertical>
  )
}
