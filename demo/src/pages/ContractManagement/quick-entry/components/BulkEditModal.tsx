/**
 * Bulk Edit Modal
 *
 * Modal for applying changes to multiple selected rows.
 */

import { useState, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal, Radio, Select, InputNumber, DatePicker } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import moment from 'moment'

import type { ContractDetail, CalendarType, EffectiveTime } from '../../types/contract.types'
import { PRODUCT_OPTIONS, LOCATION_OPTIONS, CALENDAR_OPTIONS, EFFECTIVE_TIME_OPTIONS } from '../../data/contract.data'

interface BulkEditModalProps {
  visible: boolean
  selectedCount: number
  onClose: () => void
  onApply: (field: keyof ContractDetail, value: unknown) => void
}

type EditableField = 'product' | 'location' | 'calendar' | 'startDate' | 'endDate' | 'effectiveTime' | 'quantity'

interface FieldConfig {
  key: EditableField
  label: string
}

const EDITABLE_FIELDS: FieldConfig[] = [
  { key: 'product', label: 'Product' },
  { key: 'location', label: 'Location' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'effectiveTime', label: 'Effective Time' },
  { key: 'quantity', label: 'Quantity' },
]

export function BulkEditModal({
  visible,
  selectedCount,
  onClose,
  onApply,
}: BulkEditModalProps) {
  const [selectedField, setSelectedField] = useState<EditableField>('product')
  const [fieldValue, setFieldValue] = useState<unknown>(null)

  // Reset state on close
  const handleClose = useCallback(() => {
    setSelectedField('product')
    setFieldValue(null)
    onClose()
  }, [onClose])

  // Handle apply
  const handleApply = useCallback(() => {
    if (fieldValue !== null && fieldValue !== undefined) {
      onApply(selectedField, fieldValue)
    }
  }, [selectedField, fieldValue, onApply])

  // Render value input based on selected field
  const renderValueInput = () => {
    switch (selectedField) {
      case 'product':
        return (
          <Select
            value={fieldValue as string}
            onChange={setFieldValue}
            placeholder='Select product'
            style={{ width: '100%' }}
            options={PRODUCT_OPTIONS.map((p) => ({ value: p.name, label: p.name }))}
          />
        )

      case 'location':
        return (
          <Select
            value={fieldValue as string}
            onChange={setFieldValue}
            placeholder='Select location'
            style={{ width: '100%' }}
            options={LOCATION_OPTIONS.map((l) => ({ value: l.name, label: l.name }))}
          />
        )

      case 'calendar':
        return (
          <Select
            value={fieldValue as CalendarType}
            onChange={setFieldValue}
            placeholder='Select calendar'
            style={{ width: '100%' }}
            options={CALENDAR_OPTIONS.map((c) => ({ value: c, label: c }))}
          />
        )

      case 'startDate':
      case 'endDate':
        return (
          <DatePicker
            value={fieldValue ? moment(fieldValue as Date) : null}
            onChange={(date) => setFieldValue(date?.toDate())}
            style={{ width: '100%' }}
            format='MMM D, YYYY'
          />
        )

      case 'effectiveTime':
        return (
          <Select
            value={fieldValue as EffectiveTime}
            onChange={setFieldValue}
            placeholder='Select effective time'
            style={{ width: '100%' }}
            options={EFFECTIVE_TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
          />
        )

      case 'quantity':
        return (
          <InputNumber
            value={fieldValue as number}
            onChange={setFieldValue}
            placeholder='Enter quantity'
            style={{ width: '100%' }}
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
          />
        )

      default:
        return null
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      title={`Edit ${selectedCount} Selected Row${selectedCount !== 1 ? 's' : ''}`}
      footer={
        <Horizontal justifyContent='flex-end' style={{ gap: '8px' }}>
          <GraviButton buttonText='Cancel' onClick={handleClose} />
          <GraviButton
            buttonText='Apply to All Selected'
            theme1
            icon={<EditOutlined />}
            onClick={handleApply}
            disabled={fieldValue === null || fieldValue === undefined}
          />
        </Horizontal>
      }
    >
      <Vertical style={{ gap: '24px' }}>
        {/* Field Selection */}
        <Vertical>
          <Texto
            category='p2'
            appearance='medium'
            weight='500'
            style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}
          >
            Which field do you want to update?
          </Texto>
          <Radio.Group
            value={selectedField}
            onChange={(e) => {
              setSelectedField(e.target.value)
              setFieldValue(null)
            }}
          >
            <Vertical style={{ gap: '8px' }}>
              {EDITABLE_FIELDS.map((field) => (
                <Radio key={field.key} value={field.key}>
                  {field.label}
                </Radio>
              ))}
            </Vertical>
          </Radio.Group>
        </Vertical>

        {/* Value Input */}
        <Vertical>
          <Texto
            category='p2'
            appearance='medium'
            weight='500'
            style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}
          >
            New Value
          </Texto>
          {renderValueInput()}
        </Vertical>
      </Vertical>
    </Modal>
  )
}
