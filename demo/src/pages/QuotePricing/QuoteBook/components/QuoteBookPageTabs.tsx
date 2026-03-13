import { Segmented } from 'antd'

interface QuoteBookPageTabsProps {
  activeTab: 'configuration' | 'profiles'
  onTabChange: (tab: 'configuration' | 'profiles') => void
}

export function QuoteBookPageTabs({ activeTab, onTabChange }: QuoteBookPageTabsProps) {
  return (
    <div style={{ padding: '8px 16px' }}>
      <Segmented
        value={activeTab}
        onChange={value => onTabChange(value as 'configuration' | 'profiles')}
        options={[
          { label: 'Configuration', value: 'configuration' },
          { label: 'Exception Profiles', value: 'profiles' },
        ]}
        size="middle"
      />
    </div>
  )
}
