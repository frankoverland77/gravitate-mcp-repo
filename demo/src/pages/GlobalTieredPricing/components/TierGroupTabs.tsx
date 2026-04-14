import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { TierGroup } from '../GlobalTieredPricing.types'

interface TierGroupTabsProps {
  groups: TierGroup[]
  activeTab: string
  onTabChange: (tab: string) => void
  rowCounts?: Record<string, number>
  onCountClick?: (groupId: string) => void
}

export function TierGroupTabs({ groups, activeTab, onTabChange, rowCounts, onCountClick }: TierGroupTabsProps) {
  return (
    <Horizontal gap={4} style={{ padding: '8px 16px', borderBottom: '1px solid var(--gray-200)' }}>
      {groups.map(group => (
        <div
          key={group.id}
          onClick={() => onTabChange(group.id)}
          style={{
            padding: '6px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            background: activeTab === group.id ? 'var(--theme-color-1)' : 'var(--gray-100)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Texto
            weight="bold"
            appearance={activeTab === group.id ? 'white' : 'default'}
          >
            {group.label}
          </Texto>
          {rowCounts && rowCounts[group.id] !== undefined && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                onCountClick?.(group.id)
              }}
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '8px',
                background: activeTab === group.id ? 'rgba(255,255,255,0.25)' : 'var(--gray-300)',
                color: activeTab === group.id ? '#fff' : 'var(--gray-700)',
                cursor: onCountClick ? 'pointer' : 'default',
              }}
            >
              {rowCounts[group.id]}
            </span>
          )}
        </div>
      ))}
    </Horizontal>
  )
}
