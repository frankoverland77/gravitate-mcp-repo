/**
 * GroupPanelCreateView
 *
 * Create view for a new volume group. Supports two paths:
 * - Manual Entry: fill in name, allocation, frequency, thresholds
 * - External Source: search and select from external allocation systems
 */

import { useState, useMemo } from 'react'
import { Texto, GraviButton } from '@gravitate-js/excalibrr'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Input, InputNumber, Select, Segmented } from 'antd'

import type { AllocationUnit, GroupFrequency, VolumeGroup, ExternalAllocation } from '../../../types/contract.types'
import { EXTERNAL_ALLOCATIONS, formatVolume } from '../../../data/contract.data'
import styles from './GroupPanelCreateView.module.css'

interface GroupPanelCreateViewProps {
  onCreateGroup: (group: Omit<VolumeGroup, 'id' | 'detailIds' | 'compliance' | 'liftedPercent'>) => void
  onCancel: () => void
}

type SourceMode = 'Manual Entry' | 'External Source'

const UNIT_OPTIONS: AllocationUnit[] = ['gal/yr', 'gal/mo', 'gal/qtr', 'bbl/yr', 'bbl/mo']
const FREQUENCY_OPTIONS: GroupFrequency[] = ['Monthly', 'Quarterly', 'Annually']
const SOURCE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'DTN Tabs', value: 'dtn' },
  { label: 'Supply & Dispatch', value: 'sd' },
]

export function GroupPanelCreateView({ onCreateGroup, onCancel }: GroupPanelCreateViewProps) {
  const [sourceMode, setSourceMode] = useState<SourceMode>('Manual Entry')

  // Manual fields
  const [name, setName] = useState('')
  const [allocation, setAllocation] = useState<number>(0)
  const [allocationUnit, setAllocationUnit] = useState<AllocationUnit>('gal/yr')
  const [frequency, setFrequency] = useState<GroupFrequency>('Monthly')
  const [minPercent, setMinPercent] = useState<number>(80)
  const [maxPercent, setMaxPercent] = useState<number>(110)

  // External fields
  const [externalSource, setExternalSource] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [selectedExternal, setSelectedExternal] = useState<ExternalAllocation | null>(null)

  const filteredExternals = useMemo(() => {
    return EXTERNAL_ALLOCATIONS.filter((ext) => {
      const matchesSource = externalSource === 'all' || ext.source === externalSource
      const matchesSearch = !searchText || ext.name.toLowerCase().includes(searchText.toLowerCase())
      return matchesSource && matchesSearch
    })
  }, [externalSource, searchText])

  function handleCreate() {
    if (sourceMode === 'Manual Entry') {
      onCreateGroup({
        name,
        allocation,
        allocationUnit,
        frequency,
        minPercent,
        maxPercent,
      })
    } else if (selectedExternal) {
      onCreateGroup({
        name: selectedExternal.name,
        allocation: selectedExternal.allocation,
        allocationUnit: selectedExternal.unit,
        frequency: selectedExternal.frequency,
        minPercent: 80,
        maxPercent: 110,
      })
    }
  }

  const canCreate = sourceMode === 'Manual Entry'
    ? name.trim().length > 0 && allocation > 0
    : selectedExternal !== null

  return (
    <div className={styles['create-container']}>
      {/* Back header */}
      <div className={styles['back-header']} onClick={onCancel}>
        <ArrowLeftOutlined style={{ fontSize: '14px', color: '#6b7280' }} />
        <Texto category='p1' weight='600'>
          New Volume Group
        </Texto>
      </div>

      {/* Form content */}
      <div className={styles['form-content']}>
        {/* Source toggle */}
        <div className={styles['source-toggle']}>
          {/* @ts-expect-error antd Segmented typing mismatch with @types/react */}
          <Segmented
            options={['Manual Entry', 'External Source']}
            value={sourceMode}
            onChange={(v: string | number) => setSourceMode(v as SourceMode)}
            block
          />
        </div>

        {sourceMode === 'Manual Entry' ? (
          <>
            {/* Manual Entry Form */}
            <div className={styles['form-section']}>
              <Texto category='h6' appearance='medium' weight='600' className={styles['section-label']}>
                Group Settings
              </Texto>

              <div className={styles['field-group']}>
                <Texto category='p2' appearance='medium' className={styles['field-label']}>
                  Group Name
                </Texto>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter group name'
                />
              </div>

              <div className={styles['field-group']}>
                <Texto category='p2' appearance='medium' className={styles['field-label']}>
                  Allocation
                </Texto>
                <div className={styles['inline-fields']}>
                  <InputNumber
                    value={allocation}
                    onChange={(v) => setAllocation(v ?? 0)}
                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(v) => Number(v?.replace(/,/g, '') ?? 0)}
                    placeholder='Volume'
                    style={{ flex: 2 }}
                  />
                  <Select
                    value={allocationUnit}
                    onChange={(v) => setAllocationUnit(v)}
                    options={UNIT_OPTIONS.map((u) => ({ label: u, value: u }))}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className={styles['field-group']}>
                <Texto category='p2' appearance='medium' className={styles['field-label']}>
                  Frequency
                </Texto>
                <Select
                  value={frequency}
                  onChange={(v) => setFrequency(v)}
                  options={FREQUENCY_OPTIONS.map((f) => ({ label: f, value: f }))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Thresholds */}
            <div className={styles['form-section']}>
              <Texto category='h6' appearance='medium' weight='600' className={styles['section-label']}>
                Thresholds
              </Texto>

              <div className={styles['threshold-row']}>
                <Texto category='p2' appearance='medium'>Min %</Texto>
                <InputNumber
                  value={minPercent}
                  onChange={(v) => setMinPercent(v ?? 0)}
                  min={0}
                  max={100}
                  addonAfter='%'
                  style={{ width: 100 }}
                />
              </div>

              <div className={styles['threshold-row']}>
                <Texto category='p2' appearance='medium'>Max %</Texto>
                <InputNumber
                  value={maxPercent}
                  onChange={(v) => setMaxPercent(v ?? 0)}
                  min={0}
                  max={200}
                  addonAfter='%'
                  style={{ width: 100 }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* External Source */}
            <div className={styles['form-section']}>
              <Texto category='h6' appearance='medium' weight='600' className={styles['section-label']}>
                Source System
              </Texto>

              <div className={styles['field-group']}>
                <Select
                  value={externalSource}
                  onChange={(v) => {
                    setExternalSource(v)
                    setSelectedExternal(null)
                  }}
                  options={SOURCE_OPTIONS}
                  style={{ width: '100%' }}
                />
              </div>

              <div className={styles['search-row']}>
                <Input.Search
                  placeholder='Search allocations...'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </div>

              {/* Results list */}
              <div className={styles['result-list']}>
                {filteredExternals.map((ext) => {
                  const isSelected = selectedExternal?.id === ext.id
                  const itemClass = `${styles['result-item']}${isSelected ? ` ${styles['result-item-selected']}` : ''}`

                  return (
                    <div
                      key={ext.id}
                      className={itemClass}
                      onClick={() => setSelectedExternal(isSelected ? null : ext)}
                    >
                      <Texto category='p2' weight='600'>
                        {ext.name}
                      </Texto>
                      <Texto category='p2' appearance='medium'>
                        {ext.sourceName} &middot; {formatVolume(ext.allocation)} {ext.unit}
                      </Texto>
                    </div>
                  )
                })}
                {filteredExternals.length === 0 && (
                  <Texto category='p2' appearance='medium' style={{ fontStyle: 'italic', padding: '8px 0' }}>
                    No matching allocations found
                  </Texto>
                )}
              </div>

              {/* Preview card when selected */}
              {selectedExternal && (
                <div className={styles['preview-card']}>
                  <Texto category='p2' weight='600' style={{ marginBottom: '8px' }}>
                    Selected Allocation
                  </Texto>
                  <div className={styles['preview-row']}>
                    <Texto category='p2' appearance='medium'>Name</Texto>
                    <Texto category='p2'>{selectedExternal.name}</Texto>
                  </div>
                  <div className={styles['preview-row']}>
                    <Texto category='p2' appearance='medium'>Source</Texto>
                    <Texto category='p2'>{selectedExternal.sourceName}</Texto>
                  </div>
                  <div className={styles['preview-row']}>
                    <Texto category='p2' appearance='medium'>Allocation</Texto>
                    <Texto category='p2'>
                      {formatVolume(selectedExternal.allocation)} {selectedExternal.unit}
                    </Texto>
                  </div>
                  <div className={styles['preview-row']}>
                    <Texto category='p2' appearance='medium'>Frequency</Texto>
                    <Texto category='p2'>{selectedExternal.frequency}</Texto>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <GraviButton buttonText='Cancel' onClick={onCancel} />
        <GraviButton
          buttonText='Create Group'
          theme1
          onClick={handleCreate}
          disabled={!canCreate}
        />
      </div>
    </div>
  )
}
