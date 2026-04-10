import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import type { Supplier, ContractPreview } from '../rfp.types'

interface AwardConfirmModalProps {
  open: boolean
  winner?: Supplier
  contractPreview?: ContractPreview
  onClose: () => void
  onConfirm: () => void
}

export function AwardConfirmModal({
  open,
  winner,
  contractPreview,
  onClose,
  onConfirm,
}: AwardConfirmModalProps) {
  return (
    <Modal
      open={open}
      title="Create Contract"
      onCancel={onClose}
      footer={
        <Horizontal gap={8} justifyContent="flex-end">
          <GraviButton buttonText="Cancel" onClick={onClose} />
          <GraviButton buttonText="Create Contract" success onClick={onConfirm} />
        </Horizontal>
      }
    >
      <Vertical gap={16}>
        <Texto>
          This will create a new contract in the Pricing Engine with all the terms from{' '}
          <strong>{winner?.name}'s</strong> winning bid.
        </Texto>

        {contractPreview && (
          <Vertical
            gap={8} style={{ padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '8px' }}
          >
            <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Contract Preview
            </Texto>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Contract Name</Texto>
              <Texto weight="600">{contractPreview.name}</Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Counterparty</Texto>
              <Texto weight="600">{contractPreview.counterparty}</Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Start Date</Texto>
              <Texto weight="600">{contractPreview.startDate}</Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">End Date</Texto>
              <Texto weight="600">{contractPreview.endDate}</Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Pricing Formula</Texto>
              <Texto weight="600">{contractPreview.pricingFormula}</Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Volume Commitment</Texto>
              <Texto weight="600">{contractPreview.volumeCommitment}</Texto>
            </Horizontal>
          </Vertical>
        )}

        <Texto category="p2" appearance="medium">
          The contract will be set to Active status and ready for daily pricing.
        </Texto>
      </Vertical>
    </Modal>
  )
}
