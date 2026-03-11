import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Alert } from 'antd'
import { SyncOutlined, SaveOutlined, CloseOutlined, CloudUploadOutlined, FileTextOutlined, WarningOutlined } from '@ant-design/icons'

interface QuoteBookFooterProps {
  publicationMode: 'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay'
  publishMode: boolean
  setPublishMode: (v: boolean) => void
  dirtyCount: number
  onPublish: () => void
  onReset: () => void
  hardExceptionCount: number
}

export function QuoteBookFooter({
  publicationMode,
  publishMode,
  setPublishMode,
  dirtyCount,
  onPublish,
  onReset,
  hardExceptionCount,
}: QuoteBookFooterProps) {
  return (
    <Horizontal
      alignItems="center"
      style={{ gap: '8px', padding: '8px 16px', borderTop: '1px solid var(--gray-200)', background: 'var(--bg-1)' }}
    >
      <Horizontal flex="1" alignItems="center" style={{ gap: '8px' }}>
        <FileTextOutlined />
        <Texto category="h4">Quote Publisher</Texto>
        {hardExceptionCount > 0 && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 10px',
            background: '#fef2f2',
            color: '#dc2626',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 500,
          }}>
            <WarningOutlined style={{ fontSize: 11 }} />
            {hardExceptionCount} hard exception{hardExceptionCount !== 1 ? 's' : ''} block publishing
          </span>
        )}
        {publicationMode === 'EndOfDayCurrentPeriod' && (
          <Alert message="Publishing For Current Period" type="warning" showIcon style={{ padding: '2px 8px' }} />
        )}
      </Horizontal>
      <Horizontal style={{ gap: '8px' }}>
        <GraviButton buttonText="Reset" icon={<SyncOutlined />} onClick={onReset} />
        <GraviButton buttonText="Save Adjustments" icon={<SaveOutlined />} disabled={dirtyCount === 0} />
        {publishMode && (
          <GraviButton buttonText="Cancel Publish" icon={<CloseOutlined />} onClick={() => setPublishMode(false)} />
        )}
        <GraviButton theme1 buttonText="Publish Prices" icon={<CloudUploadOutlined />} onClick={onPublish} />
      </Horizontal>
    </Horizontal>
  )
}
