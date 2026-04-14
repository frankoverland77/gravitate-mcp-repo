import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { SaveOutlined, CloseOutlined, CloudUploadOutlined, FileTextOutlined } from '@ant-design/icons'
import type { PublicationMode } from '../InventoryAnalytics.types'

interface InventoryAnalyticsFooterProps {
  publicationMode: PublicationMode
  dirtyCount: number
  onDiscard: () => void
  onSave: () => void
  onPublish: () => void
}

export function InventoryAnalyticsFooter({
  publicationMode,
  dirtyCount,
  onDiscard,
  onSave,
  onPublish,
}: InventoryAnalyticsFooterProps) {
  const modeLabels: Record<PublicationMode, string> = {
    EndOfDay: 'End of Day',
    EndOfDayCurrentPeriod: 'Current Period',
    IntraDay: 'Intraday',
  }

  return (
    <Horizontal
      alignItems="center"
      gap={8}
      style={{ padding: '8px 16px', borderTop: '1px solid var(--gray-200)', background: 'var(--bg-1)' }}
    >
      <Horizontal gap={8} flex="1" alignItems="center">
        <FileTextOutlined />
        <Texto category="h4">Inventory Pricing</Texto>
        <Texto appearance="medium">{modeLabels[publicationMode]}</Texto>
        {dirtyCount > 0 && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 10px',
            background: '#dbeafe',
            color: '#2563eb',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 500,
          }}>
            {dirtyCount} unsaved change{dirtyCount !== 1 ? 's' : ''}
          </span>
        )}
      </Horizontal>
      <Horizontal gap={8}>
        <GraviButton buttonText="Discard" icon={<CloseOutlined />} onClick={onDiscard} disabled={dirtyCount === 0} />
        <GraviButton buttonText="Save" icon={<SaveOutlined />} onClick={onSave} disabled={dirtyCount === 0} />
        <GraviButton theme1 buttonText="Publish Prices" icon={<CloudUploadOutlined />} onClick={onPublish} />
      </Horizontal>
    </Horizontal>
  )
}
