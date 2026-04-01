import React, { useEffect } from 'react'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { Modal, Form, Input, Select, InputNumber, DatePicker } from 'antd'

interface ContractRecord {
  id: string
  name: string
  type: string
  volume: number
  effectiveDate: string
}

interface ContractFormModalProps {
  open: boolean
  onClose: () => void
  editRecord: ContractRecord | null
  onSave: (record: ContractRecord) => void
}

const contractTypeOptions = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'index', label: 'Index Based' },
  { value: 'formula', label: 'Formula' },
  { value: 'rack', label: 'Rack Plus' },
]

export function ContractFormModal({ open, onClose, editRecord, onSave }: ContractFormModalProps) {
  const [form] = Form.useForm()
  const isEditing = !!editRecord

  useEffect(() => {
    if (editRecord) {
      form.setFieldsValue(editRecord)
    } else {
      form.resetFields()
    }
  }, [editRecord, form])

  const handleFinish = (values: Record<string, unknown>) => {
    onSave({
      ...values,
      id: editRecord?.id ?? crypto.randomUUID(),
    } as ContractRecord)
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      open={open}
      title={isEditing ? 'Edit Contract' : 'New Contract'}
      onCancel={onClose}
      destroyOnHidden
      width={600}
      footer={
        <Horizontal justifyContent='flex-end' gap={12}>
          <GraviButton buttonText='Cancel' onClick={onClose} />
          <GraviButton buttonText={isEditing ? 'Update' : 'Create'} theme1 onClick={() => form.submit()} />
        </Horizontal>
      }
    >
      <Form form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item name='name' label='Contract Name' rules={[{ required: true, message: 'Contract name is required' }]}>
          <Input placeholder='Enter contract name' />
        </Form.Item>
        <Form.Item name='type' label='Contract Type' rules={[{ required: true, message: 'Select a contract type' }]}>
          <Select placeholder='Select type' options={contractTypeOptions} />
        </Form.Item>
        <Horizontal gap={16}>
          <Form.Item name='volume' label='Volume (gal)' style={{ flex: 1 }}>
            <InputNumber style={{ width: '100%' }} min={0} placeholder='0' />
          </Form.Item>
          <Form.Item name='effectiveDate' label='Effective Date' style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Horizontal>
      </Form>
    </Modal>
  )
}
