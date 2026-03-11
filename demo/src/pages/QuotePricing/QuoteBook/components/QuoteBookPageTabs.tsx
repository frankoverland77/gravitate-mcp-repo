import { Texto } from '@gravitate-js/excalibrr'

interface QuoteBookPageTabsProps {
  activeTab: 'configuration' | 'profiles'
  onTabChange: (tab: 'configuration' | 'profiles') => void
}

export function QuoteBookPageTabs({ activeTab, onTabChange }: QuoteBookPageTabsProps) {
  const tabs: { key: 'configuration' | 'profiles'; label: string }[] = [
    { key: 'configuration', label: 'Configuration' },
    { key: 'profiles', label: 'Exception Profiles' },
  ]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '0 16px',
      background: 'var(--bg-1)',
      borderBottom: '2px solid var(--gray-200)',
      flexShrink: 0,
    }}>
      {tabs.map(tab => (
        <span
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: activeTab === tab.key ? 600 : 500,
            color: activeTab === tab.key ? 'var(--theme-color-1)' : 'var(--gray-500)',
            cursor: 'pointer',
            borderBottom: activeTab === tab.key ? '2px solid var(--theme-color-1)' : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.15s ease',
          }}
        >
          <Texto>{tab.label}</Texto>
        </span>
      ))}
    </div>
  )
}
