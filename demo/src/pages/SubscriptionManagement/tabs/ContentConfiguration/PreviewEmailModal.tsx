// Preview Email Modal - Shows a preview of what the email would look like

import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal, Table } from 'antd'

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

// Sample table data - maps field names to sample values
const FIELD_SAMPLE_VALUES: Record<string, string[]> = {
  IncludeLoadingNumber: ['LD-78542', 'LD-78543'],
  IncludePortalLink: ['View Portal', 'View Portal'],
  IncludeEffectiveDate: ['2025-09-12', '2025-09-12'],
  IncludeEffectiveTime: ['18:00', '18:00'],
  IncludeExpirationDate: ['2025-09-19', '2025-09-19'],
  IncludeProduct: ['#2 ULSD', '#2 ULSD Dyed'],
  IncludeOriginLocation: ['Denver Terminal', 'Aurora Hub'],
  IncludeDestinationLocation: ['Denver Distribution Center', 'Aurora Truck Stop'],
  IncludeProductPrice: ['$2.0000', '$1.9600'],
  IncludeFreight: ['$0.1500', '$0.1800'],
  IncludeTaxAllIn: ['$0.4840', '$0.4840'],
  IncludeTaxLocal: ['$0.0800', '$0.0600'],
  IncludeTaxState: ['$0.2200', '$0.2400'],
  IncludeTaxFederal: ['$0.1840', '$0.1840'],
  IncludeAllInPrice: ['$2.4840', '$2.4440'],
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

  // Get enabled content fields
  const enabledFields = CONTENT_CONFIG_FIELDS.filter(
    (field) => config[field.field as keyof ContentConfiguration] === true
  )

  // Build the table component
  const tableComponent = enabledFields.length > 0 ? (
    <Table
      dataSource={[
        { key: '1', ...Object.fromEntries(enabledFields.map((f) => [f.field, FIELD_SAMPLE_VALUES[f.field]?.[0] || '-'])) },
        { key: '2', ...Object.fromEntries(enabledFields.map((f) => [f.field, FIELD_SAMPLE_VALUES[f.field]?.[1] || '-'])) },
      ]}
      columns={enabledFields.map((field) => ({
        title: field.label,
        dataIndex: field.field,
        key: field.field,
        ellipsis: true,
      }))}
      pagination={false}
      size='middle'
      bordered
      scroll={{ x: 'max-content' }}
    />
  ) : (
    <Texto category='p1' appearance='medium' style={{ fontStyle: 'italic' }}>
      (No content fields enabled - table will be empty)
    </Texto>
  )

  // Split body by {Table} placeholder and render with table embedded
  const bodyParts = config.EmailBody.split('{Table}')
  const renderBodyWithTable = () => {
    if (bodyParts.length === 1) {
      // No {Table} placeholder found, show body then table
      return (
        <Vertical className='gap-16'>
          <Texto category='p1' style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {replacePlaceholders(config.EmailBody)}
          </Texto>
          {tableComponent}
        </Vertical>
      )
    }

    // Render body parts with table in between
    return (
      <Vertical className='gap-16'>
        {bodyParts.map((part, index) => (
          <Vertical key={index} className='gap-16'>
            {index > 0 && tableComponent}
            {part.trim() && (
              <Texto category='p1' style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {replacePlaceholders(part)}
              </Texto>
            )}
          </Vertical>
        ))}
      </Vertical>
    )
  }

  return (
    <Modal
      title={`Email Preview - ${config.QuoteConfigName}`}
      visible={visible}
      onCancel={onClose}
      width='85vw'
      style={{ top: 160, marginLeft: '10vw' }}
      bodyStyle={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}
      footer={null}
    >
      <Vertical className='gap-16'>
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
            className='p-3 gap-8'
            style={{
              backgroundColor: 'var(--theme-bg-elevated)',
              borderBottom: '1px solid var(--gray-300)',
            }}
          >
            <Horizontal className='gap-12' alignItems='center'>
              <Texto category='p1' appearance='medium' style={{ minWidth: '70px' }}>
                From:
              </Texto>
              <Texto category='p1'>noreply@company.com</Texto>
            </Horizontal>
            <Horizontal className='gap-12' alignItems='center'>
              <Texto category='p1' appearance='medium' style={{ minWidth: '70px' }}>
                To:
              </Texto>
              <Texto category='p1'>customer@example.com</Texto>
            </Horizontal>
            <Horizontal className='gap-12' alignItems='center'>
              <Texto category='p1' appearance='medium' style={{ minWidth: '70px' }}>
                Subject:
              </Texto>
              <Texto category='p1' weight='600'>
                {previewSubject}
              </Texto>
            </Horizontal>
          </Vertical>

          {/* Email Body with Embedded Table */}
          <Vertical className='p-3 gap-16'>
            {renderBodyWithTable()}
          </Vertical>
        </Vertical>

        {/* Sample Data Note */}
        <Vertical
          className='p-2'
          style={{
            backgroundColor: 'var(--theme-bg-elevated)',
            borderRadius: '4px',
            border: '1px solid var(--gray-300)',
          }}
        >
          <Texto category='p2' appearance='medium'>
            Note: This preview uses sample data. Actual emails will contain real data based on the price notification
            being sent. The table columns reflect the enabled content configuration fields.
          </Texto>
        </Vertical>
      </Vertical>
    </Modal>
  )
}
