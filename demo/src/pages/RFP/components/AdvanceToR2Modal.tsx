import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal, Alert } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

interface AdvanceToR2ModalProps {
  open: boolean
  selectedCount: number
  totalCount: number
  onClose: () => void
  onConfirm: () => void
}

export function AdvanceToR2Modal({
  open,
  selectedCount,
  totalCount,
  onClose,
  onConfirm,
}: AdvanceToR2ModalProps) {
  const eliminatedCount = totalCount - selectedCount

  return (
    <Modal
      open={open}
      title="Advance to Round 2"
      onCancel={onClose}
      footer={
        <Horizontal gap={8} justifyContent="flex-end">
          <GraviButton buttonText="Cancel" onClick={onClose} />
          <GraviButton buttonText="Confirm & Advance" success onClick={onConfirm} />
        </Horizontal>
      }
    >
      <Vertical gap={16}>
        <Texto>
          You're advancing <strong>{selectedCount} suppliers</strong> to Round 2. The remaining{' '}
          <strong>{eliminatedCount} suppliers</strong> will be marked as eliminated but can be restored if needed.
        </Texto>

        <Alert
          message="Contact Finalists"
          description="You'll need to contact the finalists outside of Gravitate to request updated bids."
          type="warning"
          showIcon
          icon={<InfoCircleOutlined />}
        />
      </Vertical>
    </Modal>
  )
}
