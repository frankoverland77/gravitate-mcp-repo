import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CheckCircleFilled } from '@ant-design/icons'
import type { RFP, Supplier, ContractPreview } from '../rfp.types'
import { SAMPLE_CONTRACT_PREVIEW } from '../rfp.data'
import styles from './SuccessSection.module.css'

interface SuccessSectionProps {
  rfp: RFP
  winner: Supplier
  contractPreview?: ContractPreview
  onViewContract: () => void
  onBackToList: () => void
}

export function SuccessSection({
  rfp,
  winner,
  contractPreview = SAMPLE_CONTRACT_PREVIEW,
  onViewContract,
  onBackToList,
}: SuccessSectionProps) {
  return (
    <Vertical alignItems="center" justifyContent="center" className={styles.successContainer}>
      <Vertical alignItems="center" style={{ gap: '24px', maxWidth: '600px', textAlign: 'center' }}>
        {/* Success Icon */}
        <div className={styles.successIcon}>
          <CheckCircleFilled />
        </div>

        {/* Success Message */}
        <Vertical alignItems="center" style={{ gap: '8px' }}>
          <Texto category="h1" weight="600">
            Contract Created Successfully!
          </Texto>
          <Texto category="p1" appearance="medium">
            The contract for <strong>{rfp.name}</strong> has been created with{' '}
            <strong>{winner.name}</strong> as the counterparty.
          </Texto>
        </Vertical>

        {/* Contract Details Card */}
        <div className={styles.detailsCard}>
          <Texto category="h6" weight="600" appearance="medium" className="mb-2">
            CONTRACT DETAILS
          </Texto>
          <Vertical style={{ gap: '12px' }}>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Contract Name</Texto>
              <Texto weight="600">{contractPreview.name}</Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Counterparty</Texto>
              <Texto weight="600">{contractPreview.counterparty}</Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Term</Texto>
              <Texto weight="600">
                {contractPreview.startDate} - {contractPreview.endDate}
              </Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Pricing Formula</Texto>
              <Texto weight="600">{contractPreview.pricingFormula}</Texto>
            </Horizontal>
            <Horizontal justifyContent="space-between">
              <Texto appearance="medium">Status</Texto>
              <span className={styles.statusBadge}>Active</span>
            </Horizontal>
          </Vertical>
        </div>

        {/* Next Steps */}
        <div className={styles.nextStepsCard}>
          <Texto category="p2" weight="600" className="mb-1">
            Next Steps
          </Texto>
          <Vertical style={{ gap: '8px' }}>
            <Horizontal alignItems="flex-start" style={{ gap: '8px' }}>
              <span className={styles.stepNumber}>1</span>
              <Texto category="p2">Review and configure pricing rules in the Pricing Engine</Texto>
            </Horizontal>
            <Horizontal alignItems="flex-start" style={{ gap: '8px' }}>
              <span className={styles.stepNumber}>2</span>
              <Texto category="p2">Set up daily pricing automation for the contract</Texto>
            </Horizontal>
            <Horizontal alignItems="flex-start" style={{ gap: '8px' }}>
              <span className={styles.stepNumber}>3</span>
              <Texto category="p2">Notify {winner.name} that the contract is ready</Texto>
            </Horizontal>
          </Vertical>
        </div>

        {/* Action Buttons */}
        <Horizontal style={{ gap: '12px' }} className="mt-2">
          <GraviButton buttonText="Back to RFP List" onClick={onBackToList} />
          <GraviButton buttonText="View Contract in Pricing Engine" success onClick={onViewContract} />
        </Horizontal>
      </Vertical>
    </Vertical>
  )
}
