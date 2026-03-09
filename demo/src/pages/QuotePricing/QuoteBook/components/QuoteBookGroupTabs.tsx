import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { quoteGroups } from '../QuoteBook.data'

interface QuoteBookGroupTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function QuoteBookGroupTabs({ activeTab, onTabChange }: QuoteBookGroupTabsProps) {
  return (
    <Horizontal gap={4} style={{ padding: '8px 16px', borderBottom: '1px solid var(--gray-200)' }}>
      {quoteGroups.map(group => (
        <div
          key={group.id}
          onClick={() => onTabChange(group.id)}
          style={{
            padding: '6px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            background: activeTab === group.id ? 'var(--theme-color-1)' : 'var(--gray-100)',
          }}
        >
          <Texto
            weight="bold"
            appearance={activeTab === group.id ? 'white' : 'default'}
          >
            {group.label}
          </Texto>
        </div>
      ))}
    </Horizontal>
  )
}
