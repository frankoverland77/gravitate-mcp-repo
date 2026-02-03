// Edit Config Modal - Modal for editing content configuration

import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Checkbox, Divider, Input, Modal } from 'antd'
import { useEffect, useState } from 'react'

import { CONTENT_CONFIG_FIELDS, ContentConfiguration } from './types'

const { TextArea } = Input

interface EditConfigModalProps {
  visible: boolean
  config: ContentConfiguration | null
  onClose: () => void
  onSave: (config: ContentConfiguration) => void
}

export function EditConfigModal({ visible, config, onClose, onSave }: EditConfigModalProps) {
  const [formData, setFormData] = useState<ContentConfiguration | null>(null)

  useEffect(() => {
    if (config) {
      setFormData({ ...config })
    }
  }, [config])

  if (!formData) return null

  const handleSave = () => {
    onSave({
      ...formData,
      LastModified: new Date().toISOString(),
      ModifiedBy: 'Current User',
    })
    onClose()
  }

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData({ ...formData, [field]: checked })
  }

  // Split fields into two columns
  const leftColumnFields = CONTENT_CONFIG_FIELDS.slice(0, 8)
  const rightColumnFields = CONTENT_CONFIG_FIELDS.slice(8)

  return (
    <Modal
      title={`Edit Content Configuration - ${formData.QuoteConfigName}`}
      visible={visible}
      onCancel={onClose}
      width={800}
      footer={
        <Horizontal justifyContent='flex-end' style={{ gap: '8px' }}>
          <GraviButton buttonText='Cancel' onClick={onClose} />
          <GraviButton buttonText='Save' success onClick={handleSave} />
        </Horizontal>
      }
    >
      <Vertical style={{ gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
        {/* Template Section */}
        <Vertical style={{ gap: '12px' }}>
          <Texto category='h6' weight='600'>
            Email Templates
          </Texto>

          <Vertical style={{ gap: '4px' }}>
            <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Subject
            </Texto>
            <Input
              value={formData.EmailSubject}
              onChange={(e) => setFormData({ ...formData, EmailSubject: e.target.value })}
              placeholder='e.g., Price Update - {LocationName} - {ProductName}'
            />
            <Texto category='p2' appearance='medium'>
              Placeholders: {'{LocationName}'}, {'{ProductName}'}, {'{Price}'}, {'{PriceChange}'}, {'{EffectiveDate}'}
            </Texto>
          </Vertical>

          <Vertical style={{ gap: '4px' }}>
            <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Body
            </Texto>
            <TextArea
              value={formData.EmailBody}
              onChange={(e) => setFormData({ ...formData, EmailBody: e.target.value })}
              rows={5}
              placeholder='Enter email body template...'
            />
          </Vertical>

        </Vertical>

        <Divider style={{ margin: '8px 0' }} />

        {/* Content Configuration Fields Section */}
        <Vertical style={{ gap: '12px' }}>
          <Texto category='h6' weight='600'>
            Content Configuration Fields
          </Texto>
          <Texto category='p2' appearance='medium'>
            Select which fields to include in notifications for this quote configuration.
          </Texto>

          <Horizontal style={{ gap: '32px' }}>
            {/* Left Column */}
            <Vertical flex='1' style={{ gap: '8px' }}>
              {leftColumnFields.map((fieldConfig) => (
                <Checkbox
                  key={fieldConfig.field}
                  checked={formData[fieldConfig.field as keyof ContentConfiguration] as boolean}
                  onChange={(e) => handleCheckboxChange(fieldConfig.field, e.target.checked)}
                >
                  {fieldConfig.label}
                </Checkbox>
              ))}
            </Vertical>

            {/* Right Column */}
            <Vertical flex='1' style={{ gap: '8px' }}>
              {rightColumnFields.map((fieldConfig) => (
                <Checkbox
                  key={fieldConfig.field}
                  checked={formData[fieldConfig.field as keyof ContentConfiguration] as boolean}
                  onChange={(e) => handleCheckboxChange(fieldConfig.field, e.target.checked)}
                >
                  {fieldConfig.label}
                </Checkbox>
              ))}
            </Vertical>
          </Horizontal>
        </Vertical>
      </Vertical>
    </Modal>
  )
}
