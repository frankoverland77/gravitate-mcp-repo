import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Horizontal } from '@gravitate-js/excalibrr'
import { fmt } from '../../../../../utils/formatters'

export const renderCustomLegend = (isOver?: boolean, overPct?: number) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        marginBottom: 8,
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 35,
      }}
    >
      <Horizontal style={{ gap: 20 }}>
        <LegendItem color='#14a349' label='Accepted' />
        <LegendItem color='#f59e0c' label='Pending' />
        <LegendItem color='#e4e6ea' label='Remaining' />
      </Horizontal>

      {isOver && (
        <Horizontal
          style={{
            alignItems: 'center',
            gap: 6,
            color: 'var(--theme-warning)',
            fontSize: 14,
          }}
        >
          <ExclamationCircleOutlined />
          {fmt.integer(overPct ?? 0, 0)}% oversubscribed
        </Horizontal>
      )}
    </div>
  )
}

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style={{ width: 12, height: 12, background: color, display: 'inline-block', borderRadius: 2 }} />
    <span style={{ fontSize: 12 }}>{label}</span>
  </div>
)
