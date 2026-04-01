/**
 * Bulk Edit Modal for applying Tier 1 values to multiple selected rows
 */

import { useState } from 'react'
import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { InputNumber, Modal, Alert, message } from 'antd'
import type { BulkEditModalProps } from '../GlobalTieredPricing.types'

export function BulkEditModal({ open, selectedCount, onApply, onCancel }: BulkEditModalProps) {
  const [tier1Value, setTier1Value] = useState<number | null>(null)

  const handleApply = () => {
    if (tier1Value === null) {
      message.warning('Please enter a Tier 1 value')
      return
    }
    if (tier1Value < 0) {
      message.error('Tier 1 value must be positive')
      return
    }
    onApply(tier1Value)
    setTier1Value(null)
  }

  const handleCancel = () => {
    onCancel()
    setTier1Value(null)
  }

  return (
    <Modal
      title='Bulk Edit Tier 1'
      open={open}
      onOk={handleApply}
      onCancel={handleCancel}
      okText='Apply'
      cancelText='Cancel'
      width={500}
      centered
      destroyOnHidden
    >
      <Vertical gap={20}>
        <Texto category='p1'>
          Updating Tier 1 for <strong>{selectedCount}</strong> selected row{selectedCount !== 1 ? 's' : ''}
        </Texto>

        <Vertical gap={8}>
          <Texto category='p2' appearance='medium'>New Tier 1 Value</Texto>
          <InputNumber
            value={tier1Value}
            onChange={(value) => setTier1Value(value)}
            precision={4}
            step={0.0001}
            placeholder='Enter value (e.g., 2.5000)'
            className='tiered-pricing-full-width-input'
            size='large'
            autoFocus
          />
        </Vertical>

        <Alert
          message='Tier 2 and Tier 3 will be recalculated automatically'
          type='info'
          showIcon
        />
      </Vertical>
    </Modal>
  )
}
