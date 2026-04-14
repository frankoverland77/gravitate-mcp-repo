import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { inventoryGroups } from '../InventoryAnalytics.data'

interface InventoryAnalyticsGroupTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function InventoryAnalyticsGroupTabs({ activeTab, onTabChange }: InventoryAnalyticsGroupTabsProps) {
  return (
    <Horizontal gap={4} style={{ padding: '8px 16px', borderBottom: '1px solid var(--gray-200)' }}>
      {inventoryGroups.map(group => (
        <div
          key={group.id}
          onClick={() => onTabChange(group.id)}
          style={{
            padding: '6px 16px',
            cursor: 'pointer',
            borderBottom: activeTab === group.id ? '2px solid var(--theme-color-1)' : '2px solid transparent',
            transition: 'border-color 200ms ease',
          }}
        >
          <Texto
            weight={activeTab === group.id ? 'bold' : 'normal'}
            appearance={activeTab === group.id ? 'default' : 'medium'}
          >
            {group.label}
          </Texto>
        </div>
      ))}
    </Horizontal>
  )
}
