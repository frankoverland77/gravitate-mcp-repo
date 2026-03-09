// Notification Method Modal - Select DTN Message or Emails

import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'

import { NotificationMethod } from './types'

interface NotificationMethodModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (method: NotificationMethod) => void
  selectedCount: number
}

export function NotificationMethodModal({
  visible,
  onClose,
  onSelect,
  selectedCount,
}: NotificationMethodModalProps) {
  return (
    <Modal
      title='Select Notification Method'
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Vertical gap={16}>
        <Texto appearance='medium'>
          How would you like to send notifications for {selectedCount} selected{' '}
          {selectedCount === 1 ? 'price' : 'prices'}?
        </Texto>
        <Horizontal justifyContent='center' gap={12} style={{ flexWrap: 'wrap' }}>
          <GraviButton
            buttonText='DTN Message'
            theme1
            onClick={() => onSelect('DTN')}
            style={{ minWidth: '130px' }}
          />
          <GraviButton
            buttonText='Emails'
            theme1
            onClick={() => onSelect('Email')}
            style={{ minWidth: '130px' }}
          />
          <GraviButton
            buttonText='Both'
            theme1
            onClick={() => onSelect('Both')}
            style={{ minWidth: '130px' }}
          />
        </Horizontal>
      </Vertical>
    </Modal>
  )
}
