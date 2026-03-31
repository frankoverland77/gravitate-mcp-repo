import { Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferMetadataResponseData } from '../../../ManageOffers.types'
import { CustomerSelectColumnDefs } from './SelectionGrid/Columns/CustomerSelectColumnDefs'
import { SelectionGrid } from './SelectionGrid/SelectionGrid'
import type { GridApi } from 'ag-grid-community'
import { Form } from 'antd'
import { useEffect } from 'react'
import type { FormInstance } from 'antd'

export interface SelectCustomersProps {
  form: FormInstance
  currentStep: number
  metadata?: SpecialOfferMetadataResponseData
  gridRef: React.MutableRefObject<GridApi<any> | undefined>
}

export function SelectCustomers({ form, currentStep, metadata, gridRef }: SelectCustomersProps) {
  useEffect(() => {
    if (currentStep === 3 && gridRef?.current) {
      gridRef.current.setRowData(metadata?.EligibleCounterParties || [])
    }
  }, [currentStep, metadata?.EligibleCounterParties])

  const handleFormChange = (selection: any[]) => {
    form.setFieldsValue({ CounterPartyIds: selection.map((row) => row['Value']) })
  }
  const currentValue = Form.useWatch('CounterPartyIds', form) || []
  return (
    <Vertical
      style={{
        ...(currentStep !== 3 && {
          display: 'none',
        }),
      }}
      className={'p-4'}
    >
      <Texto category={'h5'}>Who should receive this deal?</Texto>
      <Texto className={'mb-2'}>Choose which customers can participate</Texto>
      <SelectionGrid
        rowData={metadata?.EligibleCounterParties || []}
        handleFormChange={handleFormChange}
        idField={'Value'}
        colDefFunc={CustomerSelectColumnDefs}
        rowSelection={'multiple'}
        currentValue={currentValue}
        gridRef={gridRef}
      />
      <Form.Item name='CounterPartyIds' rules={[{ required: true, message: 'Customer is required' }]}>
        <div />
      </Form.Item>
    </Vertical>
  )
}
