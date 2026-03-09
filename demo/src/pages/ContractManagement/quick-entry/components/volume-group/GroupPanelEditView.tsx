/**
 * GroupPanelEditView
 *
 * Edit view for a volume group. Shows back navigation, form fields for
 * group settings and thresholds, assigned detail chips with remove buttons,
 * and cancel/save footer.
 */

import { useState } from 'react'
import { Texto, GraviButton } from '@gravitate-js/excalibrr'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Input, InputNumber, Select } from 'antd'

import type {
  ContractDetail,
  VolumeGroup,
  AllocationUnit,
  GroupFrequency,
} from '../../../types/contract.types'
import { formatVolume } from '../../../data/contract.data'
import { GroupDetailChip } from './GroupDetailChip'
import styles from './GroupPanelEditView.module.css'

interface GroupPanelEditViewProps {
  group: VolumeGroup
  details: ContractDetail[]
  onSave: (updated: VolumeGroup) => void
  onCancel: () => void
  onRemoveDetail: (detailId: string) => void
}

const UNIT_OPTIONS: AllocationUnit[] = ['gal/yr', 'gal/mo', 'gal/qtr', 'bbl/yr', 'bbl/mo']
const FREQUENCY_OPTIONS: GroupFrequency[] = ['Monthly', 'Quarterly', 'Annually']

export function GroupPanelEditView({
  group,
  details,
  onSave,
  onCancel,
  onRemoveDetail,
}: GroupPanelEditViewProps) {
  const [name, setName] = useState(group.name)
  const [allocation, setAllocation] = useState(group.allocation)
  const [allocationUnit, setAllocationUnit] = useState<AllocationUnit>(group.allocationUnit)
  const [frequency, setFrequency] = useState<GroupFrequency>(group.frequency)
  const [minPercent, setMinPercent] = useState(group.minPercent)
  const [maxPercent, setMaxPercent] = useState(group.maxPercent)

  const assignedDetails = details.filter(
    (d) => d.volumeGroupIds && d.volumeGroupIds.includes(group.id)
  )

  const minVolume = Math.round((allocation * minPercent) / 100)
  const maxVolume = Math.round((allocation * maxPercent) / 100)

  function handleSave() {
    onSave({
      ...group,
      name,
      allocation,
      allocationUnit,
      frequency,
      minPercent,
      maxPercent,
    })
  }

  return (
    <div className={styles['edit-container']}>
      {/* Back header */}
      <div className={styles['back-header']} onClick={onCancel}>
        <ArrowLeftOutlined style={{ fontSize: '14px', color: '#6b7280' }} />
        <Texto category='p1' weight='600'>
          {group.name}
        </Texto>
      </div>

      {/* Form content */}
      <div className={styles['form-content']}>
        {/* Group Settings */}
        <div className={styles['form-section']}>
          <Texto category='h5' appearance='medium' weight='600' className={styles['section-label']}>
            Group Settings
          </Texto>

          <div className={styles['field-group']}>
            <Texto category='p2' appearance='medium' className={styles['field-label']}>
              Group Name
            </Texto>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
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
          <Texto category='h5' appearance='medium' weight='600' className={styles['section-label']}>
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
            <Texto category='p2' appearance='medium' className={styles['computed-value']}>
              = {formatVolume(minVolume)} {allocationUnit}
            </Texto>
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
            <Texto category='p2' appearance='medium' className={styles['computed-value']}>
              = {formatVolume(maxVolume)} {allocationUnit}
            </Texto>
          </div>
        </div>

        {/* Assigned Details */}
        <div className={styles['form-section']}>
          <Texto category='h5' appearance='medium' weight='600' className={styles['section-label']}>
            Assigned Details
          </Texto>

          {assignedDetails.length === 0 ? (
            <Texto category='p2' appearance='medium' style={{ fontStyle: 'italic' }}>
              No details assigned
            </Texto>
          ) : (
            <div className={styles['assigned-details']}>
              {assignedDetails.map((d) => (
                <GroupDetailChip
                  key={d.id}
                  product={d.product}
                  location={d.location}
                  onRemove={() => onRemoveDetail(d.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <GraviButton buttonText='Cancel' onClick={onCancel} />
        <GraviButton buttonText='Save' theme1 onClick={handleSave} />
      </div>
    </div>
  )
}
