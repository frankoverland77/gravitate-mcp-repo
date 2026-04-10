import { Segmented } from 'antd'

interface PageTabsProps {
  activeTab: 'configuration' | 'profiles'
  onTabChange: (tab: 'configuration' | 'profiles') => void
}

export function PageTabs({ activeTab, onTabChange }: PageTabsProps) {
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
