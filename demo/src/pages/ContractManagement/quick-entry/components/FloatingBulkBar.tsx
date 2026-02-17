/**
 * Floating Bulk Bar
 *
 * Dark blue bar that appears at the bottom of the grid area when rows are selected.
 * Provides column/value pickers for bulk editing Volume Group and Calendar fields.
 */

import { useState, useCallback, useMemo } from 'react'
import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import type { VolumeGroup } from '../../types/contract.types'
import { CALENDAR_OPTIONS } from '../../data/contract.data'
import styles from './FloatingBulkBar.module.css'

interface FloatingBulkBarProps {
  visible: boolean
  selectedCount: number
  volumeGroups: VolumeGroup[]
  onClear: () => void
  onApply: (column: string, value: string) => void
}

type ColumnKey = 'volumeGroup' | 'calendar'

interface ColumnOption {
  value: ColumnKey
  label: string
}

const COLUMN_OPTIONS: ColumnOption[] = [
  { value: 'volumeGroup', label: 'Volume Group' },
  { value: 'calendar', label: 'Calendar' },
]

export function FloatingBulkBar({ visible, selectedCount, volumeGroups, onClear, onApply }: FloatingBulkBarProps) {
  const [column, setColumn] = useState<ColumnKey | null>(null)
  const [value, setValue] = useState<string | null>(null)

  const valueOptions = useMemo(() => {
    if (column === 'volumeGroup') {
      return [
        ...volumeGroups.map((g) => ({ value: g.id, label: g.name })),
        { value: '__none__', label: '\u2014 None' },
      ]
    }
    if (column === 'calendar') {
      return CALENDAR_OPTIONS.map((c) => ({ value: c, label: c }))
    }
    return []
  }, [column, volumeGroups])

  const handleColumnChange = useCallback((val: ColumnKey) => {
    setColumn(val)
    setValue(null)
  }, [])

  const handleApply = useCallback(() => {
    if (column && value) {
      onApply(column, value)
      setColumn(null)
      setValue(null)
    }
  }, [column, value, onApply])

  const handleClear = useCallback(() => {
    setColumn(null)
    setValue(null)
    onClear()
  }, [onClear])

  return (
    <div className={`${styles.bar}${visible ? '' : ` ${styles.hidden}`}`}>
      <Horizontal alignItems='center'>
        <Texto category='p2' weight='600' style={{ color: '#ffffff' }}>
          {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
        </Texto>
        <span className={styles['clear-link']} onClick={handleClear} role='button' tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClear()}>
          <Texto category='p2'>Clear</Texto>
        </span>
      </Horizontal>
      <Horizontal alignItems='center' className='gap-10'>
        <Select
          value={column}
          onChange={handleColumnChange}
          placeholder='Column'
          style={{ minWidth: 160 }}
          options={COLUMN_OPTIONS}
          allowClear={false}
        />
        <Select
          value={value}
          onChange={setValue}
          placeholder='Value'
          style={{ minWidth: 160 }}
          options={valueOptions}
          disabled={!column}
          allowClear={false}
        />
        <GraviButton buttonText='Apply' theme1 onClick={handleApply} disabled={!column || !value} />
      </Horizontal>
    </div>
  )
}
