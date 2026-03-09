import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { TrophyOutlined, LeftOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import type { RFP, Supplier, ContractPreview } from '../rfp.types'
import { formatPrice, formatVolume, SAMPLE_CONTRACT_PREVIEW } from '../rfp.data'
import styles from './AwardSection.module.css'

interface AwardSectionProps {
  rfp: RFP
  winner: Supplier
  contractPreview?: ContractPreview
  onBack: () => void
  onCreateContract: () => void
}

export function AwardSection({
  rfp,
  winner,
  contractPreview = SAMPLE_CONTRACT_PREVIEW,
  onBack,
  onCreateContract,
}: AwardSectionProps) {
  return (
    <Vertical gap={24}>
      {/* Header */}
      <Horizontal gap={12} alignItems="center">
        <GraviButton type="text" icon={<LeftOutlined />} onClick={onBack} style={{ padding: '4px 8px' }} />
        <Vertical>
          <Texto category="h3" weight="600">
            {rfp.name}
          </Texto>
          <Texto category="p2" appearance="medium">
            Awarding Contract
          </Texto>
        </Vertical>
      </Horizontal>

      {/* Ready to Award banner */}
      <Alert
        message="Ready to Award"
        description="Review the winning bid details and create the contract in Gravitate"
        type="success"
        showIcon
        icon={<TrophyOutlined />}
      />

      {/* Winner Card */}
      <div className={styles.winnerCard}>
        <Horizontal gap={16} alignItems="center" className="mb-2">
          <div className={styles.trophyIcon}>
            <TrophyOutlined />
          </div>
          <Vertical>
            <Horizontal gap={8} alignItems="center">
              <Texto category="h2" weight="600">
                {winner.name}
              </Texto>
              {winner.isIncumbent && <span className={styles.incumbentBadge}>INCUMBENT</span>}
            </Horizontal>
            <Texto category="p2" appearance="medium">
              Selected as winning supplier
            </Texto>
          </Vertical>
        </Horizontal>

        {/* Winner Metrics */}
        <Horizontal gap={24} className="mt-2">
          <Vertical gap={4}>
            <Texto category="p2" appearance="medium">
              Avg Price/Gal
            </Texto>
            <Texto category="h4" weight="600">
              {formatPrice(winner.metrics.avgPrice)}
            </Texto>
          </Vertical>
          <Vertical gap={4}>
            <Texto category="p2" appearance="medium">
              Gallons/Month
            </Texto>
            <Texto category="h4" weight="600">
              {formatVolume(winner.metrics.totalVolume)}
            </Texto>
          </Vertical>
          <Vertical gap={4}>
            <Texto category="p2" appearance="medium">
              Threshold Issues
            </Texto>
            <Texto category="h4" weight="600">
              {winner.metrics.issues}
            </Texto>
          </Vertical>
          <Vertical gap={4}>
            <Texto category="p2" appearance="medium">
              Contract Term
            </Texto>
            <Texto category="h4" weight="600">
              12 mo
            </Texto>
          </Vertical>
        </Horizontal>
      </div>

      {/* Contract Preview */}
      <div className={styles.contractPreview}>
        <Texto category="h5" weight="600" className="mb-2">
          Contract Preview
        </Texto>
        <Vertical gap={12}>
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
      </div>

      {/* Action buttons */}
      <Horizontal gap={12} justifyContent="flex-end">
        <GraviButton buttonText="Back to Comparison" onClick={onBack} />
        <GraviButton buttonText="Create Contract in Pricing Engine" success onClick={onCreateContract} />
      </Horizontal>
    </Vertical>
  )
}
