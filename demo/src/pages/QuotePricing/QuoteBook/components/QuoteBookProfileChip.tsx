import { Horizontal, Texto, MaterialIcon } from '@gravitate-js/excalibrr'

type QuoteBookProfileChipProps = {
  profileName?: string
}

export function QuoteBookProfileChip({ profileName = 'Standard Day' }: QuoteBookProfileChipProps) {
  return (
    <Horizontal
      alignItems="center"
      style={{
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '16px',
        backgroundColor: 'var(--gravi-color-bg-secondary, #f0f0f0)',
        cursor: 'default',
      }}
    >
      <MaterialIcon icon="shield" style={{ fontSize: '16px', color: 'var(--gravi-color-primary, #1890ff)' }} />
      <Texto appearance="medium" style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
        {profileName}
      </Texto>
    </Horizontal>
  )
}
