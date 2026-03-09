// Content Detail Panel - Expandable detail view for content configuration

import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { CopyOutlined, EditOutlined, EyeOutlined, UndoOutlined } from '@ant-design/icons'
import { Checkbox, Divider } from 'antd'

import { CONTENT_CONFIG_FIELDS, ContentConfiguration } from './types'

interface ContentDetailPanelProps {
  data: ContentConfiguration
  onEdit: (config: ContentConfiguration) => void
  onCopy: (config: ContentConfiguration) => void
  onReset: (config: ContentConfiguration) => void
  onPreview: (config: ContentConfiguration) => void
}

export function ContentDetailPanel({ data, onEdit, onCopy, onReset, onPreview }: ContentDetailPanelProps) {
  // Split fields into two columns for display
  const leftColumnFields = CONTENT_CONFIG_FIELDS.slice(0, 8)
  const rightColumnFields = CONTENT_CONFIG_FIELDS.slice(8)

  return (
    <Vertical className='p-3' gap={16} style={{ backgroundColor: 'var(--theme-bg-elevated)' }}>
      <Horizontal justifyContent='space-between' alignItems='center'>
        <Texto category='h5' weight='600'>
          Content Configuration Details
        </Texto>
        <Horizontal gap={8}>
          <GraviButton buttonText='Preview' icon={<EyeOutlined />} onClick={() => onPreview(data)} />
          <GraviButton buttonText='Edit' theme1 icon={<EditOutlined />} onClick={() => onEdit(data)} />
          <GraviButton buttonText='Copy From' icon={<CopyOutlined />} onClick={() => onCopy(data)} />
          <GraviButton buttonText='Reset to Default' danger icon={<UndoOutlined />} onClick={() => onReset(data)} />
        </Horizontal>
      </Horizontal>

      <Horizontal gap={32}>
        {/* Left Side - Templates */}
        <Vertical gap={12} flex='1'>
          <Vertical gap={4}>
            <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Subject
            </Texto>
            <Texto
              category='p1'
              style={{
                fontFamily: 'monospace',
                backgroundColor: 'var(--theme-bg-1)',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid var(--gray-300)',
                fontSize: '12px',
              }}
            >
              {data.EmailSubject}
            </Texto>
          </Vertical>

          <Vertical gap={4}>
            <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Body
            </Texto>
            <Texto
              category='p1'
              style={{
                fontFamily: 'monospace',
                backgroundColor: 'var(--theme-bg-1)',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid var(--gray-300)',
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                maxHeight: '120px',
                overflowY: 'auto',
              }}
            >
              {data.EmailBody}
            </Texto>
          </Vertical>

        </Vertical>

        {/* Right Side - Content Configuration Fields */}
        <Vertical gap={12} style={{ minWidth: '400px' }}>
          <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Content Configuration Fields
          </Texto>

          <Horizontal gap={24}>
            {/* Left Column of Checkboxes */}
            <Vertical gap={4} style={{ minWidth: '140px' }}>
              {leftColumnFields.map((fieldConfig) => (
                <div key={fieldConfig.field} style={{ height: '24px', display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={data[fieldConfig.field as keyof ContentConfiguration] as boolean}
                    disabled
                  >
                    {fieldConfig.label}
                  </Checkbox>
                </div>
              ))}
            </Vertical>

            {/* Right Column of Checkboxes */}
            <Vertical gap={4} style={{ minWidth: '160px' }}>
              {rightColumnFields.map((fieldConfig) => (
                <div key={fieldConfig.field} style={{ height: '24px', display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={data[fieldConfig.field as keyof ContentConfiguration] as boolean}
                    disabled
                  >
                    {fieldConfig.label}
                  </Checkbox>
                </div>
              ))}
            </Vertical>
          </Horizontal>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
