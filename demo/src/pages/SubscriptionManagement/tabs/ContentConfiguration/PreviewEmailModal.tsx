// Preview Email Modal - Shows a preview of what the email would look like

import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Divider, Modal, Tag } from 'antd'

import { CONTENT_CONFIG_FIELDS, ContentConfiguration } from './types'

interface PreviewEmailModalProps {
  visible: boolean
  config: ContentConfiguration | null
  onClose: () => void
}

// Sample data for placeholder replacement
const SAMPLE_DATA = {
  '{LocationName}': 'Denver Terminal',
  '{LocationCode}': 'DEN-001',
  '{ProductName}': 'Regular Unleaded',
  '{ProductCode}': 'RUL',
  '{Price}': '$2.4567',
  '{PriceChange}': '+$0.0250',
  '{EffectiveDate}': 'Feb 3, 2026',
  '{EffectiveTime}': '6:00 AM MST',
  '{ContractCode}': 'CNT-2026-001',
  '{FleetCode}': 'FLT-500',
  '{Counterparty}': 'ABC Fuel Distributors',
  '{LoadingNumber}': 'LD-78542',
}

function replacePlaceholders(template: string): string {
  let result = template
  Object.entries(SAMPLE_DATA).forEach(([placeholder, value]) => {
    result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
  })
  return result
}

export function PreviewEmailModal({ visible, config, onClose }: PreviewEmailModalProps) {
  if (!config) return null

  const previewSubject = replacePlaceholders(config.EmailSubject)
  const previewBody = replacePlaceholders(config.EmailBody)

  // Get enabled content fields
  const enabledFields = CONTENT_CONFIG_FIELDS.filter(
    (field) => config[field.field as keyof ContentConfiguration] === true
  )

  return (
    <Modal
      title={`Email Preview - ${config.QuoteConfigName}`}
      visible={visible}
      onCancel={onClose}
      width={700}
      footer={null}
    >
      <Vertical style={{ gap: '16px' }}>
        {/* Email Preview Section */}
        <Vertical
          style={{
            backgroundColor: 'var(--theme-bg-1)',
            borderRadius: '8px',
            border: '1px solid var(--gray-300)',
            overflow: 'hidden',
          }}
        >
          {/* Email Header */}
          <Vertical
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              padding: '12px 16px',
              borderBottom: '1px solid var(--gray-300)',
              gap: '8px',
            }}
          >
            <Horizontal style={{ gap: '8px' }}>
              <Texto category='p2' appearance='medium' style={{ minWidth: '60px' }}>
                From:
              </Texto>
              <Texto category='p2'>noreply@company.com</Texto>
            </Horizontal>
            <Horizontal style={{ gap: '8px' }}>
              <Texto category='p2' appearance='medium' style={{ minWidth: '60px' }}>
                To:
              </Texto>
              <Texto category='p2'>customer@example.com</Texto>
            </Horizontal>
            <Horizontal style={{ gap: '8px' }}>
              <Texto category='p2' appearance='medium' style={{ minWidth: '60px' }}>
                Subject:
              </Texto>
              <Texto category='p2' weight='600'>
                {previewSubject}
              </Texto>
            </Horizontal>
          </Vertical>

          {/* Email Body */}
          <Vertical style={{ padding: '16px', gap: '12px' }}>
            <Texto
              category='p1'
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
              }}
            >
              {previewBody}
            </Texto>
          </Vertical>
        </Vertical>

        <Divider style={{ margin: '8px 0' }} />

        {/* Included Fields Section */}
        <Vertical style={{ gap: '8px' }}>
          <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Included Content Fields
          </Texto>
          <Horizontal style={{ gap: '8px', flexWrap: 'wrap' }}>
            {enabledFields.length > 0 ? (
              enabledFields.map((field) => (
                <Tag key={field.field} color='blue'>
                  {field.label}
                </Tag>
              ))
            ) : (
              <Texto category='p2' appearance='medium'>
                No content fields enabled
              </Texto>
            )}
          </Horizontal>
        </Vertical>

        {/* Sample Data Note */}
        <Vertical
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid var(--gray-300)',
          }}
        >
          <Texto category='p2' appearance='medium'>
            Note: This preview uses sample data for placeholder values. Actual emails will contain real data based on
            the price notification being sent.
          </Texto>
        </Vertical>
      </Vertical>
    </Modal>
  )
}
