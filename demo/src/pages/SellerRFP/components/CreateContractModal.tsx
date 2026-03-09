import { useMemo } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Modal, Tag } from 'antd'
import { FileTextOutlined, ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons'
import type { SellerRFP, SellerRFPDetail } from '../types/sellerRfp.types'
import { formatPrice, formatVolume } from '../types/sellerRfp.types'
import styles from './CreateContractModal.module.css'

interface CreateContractModalProps {
  visible: boolean
  rfp: SellerRFP
  onClose: () => void
  onConfirm: (wonDetails: SellerRFPDetail[]) => void
}

export function CreateContractModal({ visible, rfp, onClose, onConfirm }: CreateContractModalProps) {
  // Filter to won details only (all details for 'won', only won details for 'partial-win')
  const wonDetails = useMemo(() => {
    if (rfp.status === 'won') return rfp.details
    if (rfp.status === 'partial-win' && rfp.detailAdjudications) {
      const wonIds = new Set(
        rfp.detailAdjudications
          .filter((da) => da.outcome === 'won')
          .map((da) => da.detailId),
      )
      return rfp.details.filter((d) => wonIds.has(d.id))
    }
    return rfp.details
  }, [rfp])

  const totalVolume = useMemo(() => {
    return wonDetails.reduce((sum, d) => sum + (d.volume || 0), 0)
  }, [wonDetails])

  const contractStart = rfp.terms.contractStart
    ? new Date(rfp.terms.contractStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'
  const contractEnd = rfp.terms.contractEnd
    ? new Date(rfp.terms.contractEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <Modal
      title={
        <Horizontal gap={8} style={{ alignItems: 'center' }}>
          <FileTextOutlined style={{ color: '#1677ff' }} />
          <span>Create Contract from RFP</span>
        </Horizontal>
      }
      open={visible}
      onOk={() => onConfirm(wonDetails)}
      onCancel={onClose}
      okText="Create Contract"
      cancelText="Cancel"
      width={580}
    >
      <Vertical gap={20} style={{ paddingTop: '8px' }}>
        {/* Intro */}
        <div className={styles['intro-box']}>
          <Texto category="p2" appearance="medium">
            A new contract will be created from{' '}
            <strong>{wonDetails.length}</strong> won detail{wonDetails.length !== 1 ? 's' : ''}.
            Header fields, details, price formulas, volumes, and effective dates will be pre-populated from your RFP response.
          </Texto>
        </div>

        {/* Header mapping */}
        <Vertical gap={8}>
          <Texto category="p2" weight="600">Contract Header</Texto>
          <div className={styles['mapping-table']}>
            <MappingRow label="Contract Name" value={`${rfp.buyerName} — ${rfp.name}`} />
            <MappingRow label="Counterparty" value={rfp.buyerName} />
            <MappingRow label="Effective Dates" value={`${contractStart} — ${contractEnd}`} />
            <MappingRow label="Payment Terms" value={rfp.terms.paymentTerms ? rfp.terms.paymentTerms.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—'} />
            <MappingRow label="Volume Commitment" value={formatVolume(totalVolume)} />
          </div>
        </Vertical>

        {/* Won details preview */}
        <Vertical gap={8}>
          <Horizontal gap={8} style={{ alignItems: 'center' }}>
            <Texto category="p2" weight="600">Contract Details</Texto>
            {rfp.status === 'partial-win' && (
              <Tag color="orange" style={{ margin: 0, fontSize: '11px' }}>Won only</Tag>
            )}
          </Horizontal>
          <div className={styles['detail-preview']}>
            <div className={styles['detail-preview-header']}>
              <Texto category="p3" weight="600" style={{ flex: '1 1 120px' }}>Product</Texto>
              <Texto category="p3" weight="600" style={{ flex: '1 1 120px' }}>Terminal</Texto>
              <Texto category="p3" weight="600" style={{ flex: '0 0 100px', textAlign: 'right' }}>Sale Price</Texto>
              <Texto category="p3" weight="600" style={{ flex: '0 0 100px', textAlign: 'right' }}>Volume</Texto>
            </div>
            {wonDetails.map((detail) => (
              <div key={detail.id} className={styles['detail-preview-row']}>
                <Texto category="p2" style={{ flex: '1 1 120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {detail.product}
                </Texto>
                <Texto category="p2" style={{ flex: '1 1 120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {detail.terminal}
                </Texto>
                <Texto category="p2" style={{ flex: '0 0 100px', textAlign: 'right' }}>
                  {formatPrice(detail.salePrice)}
                </Texto>
                <Texto category="p2" style={{ flex: '0 0 100px', textAlign: 'right' }}>
                  {formatVolume(detail.volume)}
                </Texto>
              </div>
            ))}
          </div>
        </Vertical>

        {/* What gets created */}
        <Vertical gap={8}>
          <Texto category="p2" weight="600">What will be pre-populated</Texto>
          <div className={styles['checklist']}>
            <ChecklistItem text="Contract header with counterparty, dates, and payment terms" />
            <ChecklistItem text="Detail lines for each won product / terminal" />
            <ChecklistItem text="Price formulas carried over from RFP response" />
            <ChecklistItem text="Monthly volumes per detail line" />
            <ChecklistItem text="Effective dates from RFP terms" />
          </div>
        </Vertical>

        {/* Navigation hint */}
        <div className={styles['nav-hint']}>
          <Horizontal gap={8} style={{ alignItems: 'center' }}>
            <ArrowRightOutlined style={{ color: '#1677ff' }} />
            <Texto category="p3" appearance="medium">
              You'll be taken to the <strong>Create Contract</strong> page with all fields pre-filled. Review and adjust before saving.
            </Texto>
          </Horizontal>
        </div>
      </Vertical>
    </Modal>
  )
}

function MappingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles['mapping-row']}>
      <Texto category="p3" appearance="medium" style={{ flex: '0 0 140px' }}>{label}</Texto>
      <Texto category="p2">{value}</Texto>
    </div>
  )
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <Horizontal gap={8} style={{ alignItems: 'flex-start' }}>
      <CheckCircleFilled style={{ color: '#52c41a', fontSize: '14px', marginTop: '2px' }} />
      <Texto category="p2" appearance="medium">{text}</Texto>
    </Horizontal>
  )
}
