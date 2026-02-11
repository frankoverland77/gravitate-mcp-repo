/**
 * Contract Type Sidebar
 *
 * Left sidebar component for selecting contract type and entering description/comments.
 * Styled to match Gravitate production HeaderEntry pattern.
 */

import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { Radio, Input } from 'antd'
import type { ContractType, FullEntryHeader } from '../fullentry.types'
import styles from '../FullEntryFlow.module.css'

const CONTRACT_TYPES: ContractType[] = ['Day - Fixed', 'Day - Formula', 'Intercompany', 'Term - Formula']

interface ContractTypeSidebarProps {
  contractType: ContractType
  description: string
  comments: string
  onChange: (updates: Partial<FullEntryHeader>) => void
  disabled?: boolean
}

export function ContractTypeSidebar({ contractType, description, comments, onChange, disabled }: ContractTypeSidebarProps) {
  return (
    <Vertical flex='1 0 150px' className='bg-2 p-5 bordered'>
      {/* Contract Type Selection */}
      <div className='mb-5'>
        <Texto category='h4' appearance='primary' style={{ marginBottom: '2rem' }}>
          Contract Type
        </Texto>
        <Radio.Group
          value={contractType}
          onChange={(e) => onChange({ contractType: e.target.value })}
          className={styles.radioGroup}
          disabled={disabled}
        >
          {CONTRACT_TYPES.map((type) => (
            <Radio key={type} value={type} className='trade-instrument-radio'>
              {type}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {/* Description */}
      <div className='mb-5'>
        <Texto category='h4' appearance='primary' style={{ marginBottom: '2rem' }}>
          Description
        </Texto>
        <Input
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder='Enter description'
          disabled={disabled}
        />
      </div>

      {/* Comments */}
      <div className='mb-5'>
        <Texto category='h4' appearance='primary' style={{ marginBottom: '2rem' }}>
          Comments
        </Texto>
        <Input.TextArea
          value={comments}
          onChange={(e) => onChange({ comments: e.target.value })}
          placeholder='Enter comments'
          rows={4}
          disabled={disabled}
        />
      </div>
    </Vertical>
  )
}
