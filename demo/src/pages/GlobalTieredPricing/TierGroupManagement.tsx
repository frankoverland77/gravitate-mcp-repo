import { useState } from 'react'
import { Vertical } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import type { TierGroup, TierLevel, TieredPricingRow } from './GlobalTieredPricing.types'
import { defaultTierGroups, defaultTierLevels, tieredPricingData } from './GlobalTieredPricing.data'
import { loadPersistedGroups, persistGroups, loadPersistedLevels, persistLevels, loadPersistedRows } from './GlobalTieredPricing.persistence'
import { TierGroupsPanel } from './components/TierGroupsPanel'
import { TierLevelsPanel } from './components/TierLevelsPanel'

export function TierGroupManagement() {
  const [groups, setGroups] = useState<TierGroup[]>(() => loadPersistedGroups() ?? defaultTierGroups)
  const [levels, setLevels] = useState<TierLevel[]>(() => loadPersistedLevels() ?? defaultTierLevels)
  const [rows] = useState<TieredPricingRow[]>(() => loadPersistedRows() ?? tieredPricingData)

  const handleGroupsChange = (newGroups: TierGroup[]) => {
    setGroups(newGroups)
    persistGroups(newGroups)
  }

  const handleLevelsChange = (newLevels: TierLevel[]) => {
    setLevels(newLevels)
    persistLevels(newLevels)
  }

  return (
    <Vertical height="100%">
      <Tabs
        defaultActiveKey="groups"
        style={{ height: '100%', padding: '0 16px' }}
        items={[
          {
            key: 'groups',
            label: 'Tier Groups',
            children: (
              <TierGroupsPanel
                groups={groups}
                rows={rows}
                onGroupsChange={handleGroupsChange}
              />
            ),
          },
          {
            key: 'levels',
            label: 'Tier Levels',
            children: (
              <TierLevelsPanel
                levels={levels}
                onLevelsChange={handleLevelsChange}
              />
            ),
          },
        ]}
      />
    </Vertical>
  )
}
