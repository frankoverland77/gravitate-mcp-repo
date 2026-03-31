import { Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../ManageOffers.types'
import { SendReminderFooter } from './SendReminderFooter'
import { SendReminderHeader } from './SendReminderHeader'
import { SelectionGrid } from '../../../CreateNew/Components/SelectionGrid/SelectionGrid'
import { CustomerSelectColumnDefs } from '../../../CreateNew/Components/SelectionGrid/Columns/CustomerSelectColumnDefs'
import { Form, Modal, notification } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { type Dispatch, type SetStateAction, useMemo, useRef, useState } from 'react'

interface SendReminderProps {
  data: SpecialOfferBreakdownResponseData | undefined
  sendReminderModalOpen: boolean
  setSendReminderModalOpen: Dispatch<SetStateAction<boolean>>
}

export function SendReminderModal({ data, sendReminderModalOpen, setSendReminderModalOpen }: SendReminderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const gridRef = useRef<any>(null)

  const rowData = useMemo(() => {
    return data?.CustomerEngagement?.InvitedCounterParties || []
  }, [data])

  const [form] = useForm()

  const handleFormChange = (selection: any[]) => {
    form.setFieldsValue({ CounterPartyIds: selection.map((row) => row['Value']) })
  }

  const onClose = () => {
    form.resetFields()
    setSendReminderModalOpen(false)
  }

  const currentValue = Form.useWatch('CounterPartyIds', form) || []

  const onFinish = async () => {
    setIsLoading(true)
    try {
      // Mock send action
      await new Promise((resolve) => setTimeout(resolve, 800))
      notification.success({
        message: 'Reminders Sent',
        description: `Reminders sent to ${currentValue.length} customer(s).`,
      })
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <Modal
      centered
      open={sendReminderModalOpen}
      onCancel={() => setSendReminderModalOpen(false)}
      footer={<SendReminderFooter isLoading={isLoading} onClose={onClose} form={form} currentValue={currentValue} />}
      title={<SendReminderHeader />}
      width={800}
      destroyOnHidden
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Vertical style={{ fontSize: '12px' }}>
          <SelectionGrid
            rowData={rowData}
            handleFormChange={handleFormChange}
            idField='Value'
            colDefFunc={CustomerSelectColumnDefs}
            rowSelection='multiple'
            currentValue={currentValue}
            isLoading={isLoading}
            gridRef={gridRef}
          />
          <Form.Item name='CounterPartyIds' rules={[{ required: true, message: 'Customer is required' }]}>
            <div />
          </Form.Item>
        </Vertical>
      </Form>
    </Modal>
  )
}
