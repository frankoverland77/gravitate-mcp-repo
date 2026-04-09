import { useState, useCallback, useEffect } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal, Input, Tag } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface EliminationModalProps {
  open: boolean
  supplierNames: string[]
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function EliminationModal({ open, supplierNames, onConfirm, onCancel }: EliminationModalProps) {
  const [reason, setReason] = useState('')

  // Reset reason when modal opens
  useEffect(() => {
    if (open) {
      setReason('')
    }
  }, [open])

  const handleConfirm = useCallback(() => {
    onConfirm(reason.trim())
  }, [reason, onConfirm])

  return (
    <Modal
      open={open}
      title={
        <Horizontal gap={8} alignItems='center'>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          <Texto weight='600'>Eliminate {supplierNames.length} Supplier{supplierNames.length !== 1 ? 's' : ''}</Texto>
        </Horizontal>
      }
      onCancel={onCancel}
      footer={null}
      width={480}
    >
      <Vertical gap={16}>
        {/* Supplier list */}
        <Vertical gap={8}>
          <Texto category='p2' appearance='medium'>
            The following supplier{supplierNames.length !== 1 ? 's' : ''} will be eliminated from this round:
          </Texto>
          <Horizontal gap={8} style={{ flexWrap: 'wrap' }}>
            {supplierNames.map((name) => (
              <Tag key={name} color='orange'>
                {name}
              </Tag>
            ))}
          </Horizontal>
        </Vertical>

        {/* Reason input */}
        <Vertical gap={8}>
          <Texto category='p2' weight='600'>
            Reason for elimination
          </Texto>
          <TextArea
            placeholder='Enter the reason for eliminating these suppliers...'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={500}
            showCount
          />
        </Vertical>

        {/* Actions */}
        <Horizontal justifyContent='flex-end' gap={8} style={{ marginTop: '8px' }}>
          <GraviButton buttonText='Cancel' appearance='outlined' onClick={onCancel} />
          <GraviButton buttonText='Confirm Elimination' appearance='warning' onClick={handleConfirm} />
        </Horizontal>
      </Vertical>
    </Modal>
  )
}
