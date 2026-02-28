import { useState, useCallback } from 'react'
import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { Modal, Radio, Select, Input } from 'antd'
import type { SellerRFP, AdjudicationResult } from '../types/sellerRfp.types'
import { WIN_REASON_OPTIONS, LOSS_REASON_OPTIONS } from '../types/sellerRfp.types'
import styles from './AdjudicationModal.module.css'

const { TextArea } = Input

interface AdjudicationModalProps {
  visible: boolean
  rfp: SellerRFP
  onClose: () => void
  onResult: (result: AdjudicationResult, reason?: string, notes?: string) => void
}

export function AdjudicationModal({ visible, rfp, onClose, onResult }: AdjudicationModalProps) {
  const [result, setResult] = useState<AdjudicationResult | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const handleOk = useCallback(() => {
    if (!result) return
    onResult(result, reason || undefined, notes || undefined)
    // Reset
    setResult(null)
    setReason(null)
    setNotes('')
  }, [result, reason, notes, onResult])

  const handleCancel = useCallback(() => {
    setResult(null)
    setReason(null)
    setNotes('')
    onClose()
  }, [onClose])

  return (
    <Modal
      title={`Round ${rfp.currentRound} Result`}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Confirm"
      okButtonProps={{ disabled: !result }}
      width={480}
    >
      <Vertical style={{ gap: '20px', paddingTop: '8px' }}>
        <Radio.Group
          value={result}
          onChange={(e) => {
            setResult(e.target.value)
            setReason(null)
          }}
        >
          <Vertical style={{ gap: '12px' }}>
            <Radio value="won">
              <Vertical style={{ gap: '2px' }}>
                <Texto category="p2" weight="500">Won</Texto>
                <Texto category="p3" appearance="medium">
                  RFP awarded to your organization
                </Texto>
              </Vertical>
            </Radio>
            <Radio value="lost">
              <Vertical style={{ gap: '2px' }}>
                <Texto category="p2" weight="500">Lost</Texto>
                <Texto category="p3" appearance="medium">
                  Another supplier was selected
                </Texto>
              </Vertical>
            </Radio>
            <Radio value="advanced">
              <Vertical style={{ gap: '2px' }}>
                <Texto category="p2" weight="500">Advanced to Next Round</Texto>
                <Texto category="p3" appearance="medium">
                  Invited to submit Round {rfp.currentRound + 1} response
                </Texto>
              </Vertical>
            </Radio>
          </Vertical>
        </Radio.Group>

        {/* Win reason */}
        {result === 'won' && (
          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" weight="500">Win Reason</Texto>
            <Select
              placeholder="Select reason..."
              value={reason}
              onChange={setReason}
              options={WIN_REASON_OPTIONS}
              style={{ width: '100%' }}
            />
          </Vertical>
        )}

        {/* Loss reason */}
        {result === 'lost' && (
          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" weight="500">Loss Reason</Texto>
            <Select
              placeholder="Select reason..."
              value={reason}
              onChange={setReason}
              options={LOSS_REASON_OPTIONS}
              style={{ width: '100%' }}
            />
          </Vertical>
        )}

        {/* Notes */}
        {result && (
          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" weight="500">Notes (optional)</Texto>
            <TextArea
              placeholder="Additional context about the outcome..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </Vertical>
        )}

        {/* Advanced info */}
        {result === 'advanced' && (
          <div className={styles['info-box']}>
            <Texto category="p2" appearance="medium">
              Advancing will create a Round {rfp.currentRound + 1} draft pre-loaded with your current submission.
              You can modify formulas and terms before re-submitting.
            </Texto>
          </div>
        )}
      </Vertical>
    </Modal>
  )
}
