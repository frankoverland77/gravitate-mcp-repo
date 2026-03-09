import { useState, useCallback, useMemo } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Modal, Radio, Select, Input, Switch } from 'antd'
import type { SellerRFP, AdjudicationResult, DetailAdjudication, DetailOutcome } from '../types/sellerRfp.types'
import { WIN_REASON_OPTIONS, LOSS_REASON_OPTIONS } from '../types/sellerRfp.types'
import styles from './AdjudicationModal.module.css'

const { TextArea } = Input

interface AdjudicationModalProps {
  visible: boolean
  rfp: SellerRFP
  onClose: () => void
  onResult: (result: AdjudicationResult, reason?: string, notes?: string, detailAdjudications?: DetailAdjudication[]) => void
}

export function AdjudicationModal({ visible, rfp, onClose, onResult }: AdjudicationModalProps) {
  const [result, setResult] = useState<AdjudicationResult | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [splitAward, setSplitAward] = useState(false)
  const [detailOutcomes, setDetailOutcomes] = useState<Record<string, { outcome: DetailOutcome; reason: string | null; notes: string }>>({})

  // Initialize detail outcomes when result changes or split toggles on
  const initializeDetailOutcomes = useCallback((outcome: DetailOutcome) => {
    const init: Record<string, { outcome: DetailOutcome; reason: string | null; notes: string }> = {}
    rfp.details.forEach((d) => {
      init[d.id] = { outcome, reason: null, notes: '' }
    })
    setDetailOutcomes(init)
  }, [rfp.details])

  const isFinalDisposition = result === 'won' || result === 'lost'
  const confirmDisabled = !result || (isFinalDisposition && !reason)

  // Derive effective status from detail outcomes when split award is on
  const derivedStatus = useMemo(() => {
    if (!splitAward || !isFinalDisposition) return result
    const outcomes = Object.values(detailOutcomes)
    if (outcomes.length === 0) return result
    const allWon = outcomes.every((o) => o.outcome === 'won')
    const allLost = outcomes.every((o) => o.outcome === 'lost')
    if (allWon) return 'won'
    if (allLost) return 'lost'
    return 'partial-win'
  }, [splitAward, isFinalDisposition, result, detailOutcomes])

  const handleOk = useCallback(() => {
    if (!result) return
    const adjudications: DetailAdjudication[] | undefined = splitAward && isFinalDisposition
      ? Object.entries(detailOutcomes).map(([detailId, val]) => ({
        detailId,
        outcome: val.outcome,
        reason: val.reason || null,
        notes: val.notes || null,
      }))
      : undefined

    onResult(result, reason || undefined, notes || undefined, adjudications)
    // Reset
    setResult(null)
    setReason(null)
    setNotes('')
    setSplitAward(false)
    setDetailOutcomes({})
  }, [result, reason, notes, splitAward, isFinalDisposition, detailOutcomes, onResult])

  const handleCancel = useCallback(() => {
    setResult(null)
    setReason(null)
    setNotes('')
    setSplitAward(false)
    setDetailOutcomes({})
    onClose()
  }, [onClose])

  const updateDetailOutcome = useCallback((detailId: string, field: 'outcome' | 'reason' | 'notes', value: string) => {
    setDetailOutcomes((prev) => ({
      ...prev,
      [detailId]: { ...prev[detailId], [field]: value },
    }))
  }, [])

  return (
    <Modal
      title={`Round ${rfp.currentRound} Result`}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Confirm"
      okButtonProps={{ disabled: confirmDisabled }}
      width={splitAward && isFinalDisposition ? 700 : 480}
    >
      <Vertical gap={20} style={{ paddingTop: '8px' }}>
        <Radio.Group
          value={result}
          onChange={(e) => {
            const val = e.target.value as AdjudicationResult
            setResult(val)
            setReason(null)
            if (val === 'won' || val === 'lost') {
              initializeDetailOutcomes(val)
            }
          }}
        >
          <Vertical gap={12}>
            <Radio value="won">
              <Vertical gap={2}>
                <Texto category="p2" weight="500">Won</Texto>
                <Texto category="p3" appearance="medium">
                  RFP awarded to your organization
                </Texto>
              </Vertical>
            </Radio>
            <Radio value="lost">
              <Vertical gap={2}>
                <Texto category="p2" weight="500">Lost</Texto>
                <Texto category="p3" appearance="medium">
                  Another supplier was selected
                </Texto>
              </Vertical>
            </Radio>
            <Radio value="advanced">
              <Vertical gap={2}>
                <Texto category="p2" weight="500">Advanced to Next Round</Texto>
                <Texto category="p3" appearance="medium">
                  Invited to submit Round {rfp.currentRound + 1} response
                </Texto>
              </Vertical>
            </Radio>
          </Vertical>
        </Radio.Group>

        {/* Win reason — required */}
        {result === 'won' && (
          <Vertical gap={8}>
            <Texto category="p2" weight="500">Win Reason <span style={{ color: '#ff4d4f' }}>*</span></Texto>
            <Select
              placeholder="Select reason..."
              value={reason}
              onChange={setReason}
              options={WIN_REASON_OPTIONS}
              style={{ width: '100%' }}
            />
          </Vertical>
        )}

        {/* Loss reason — required */}
        {result === 'lost' && (
          <Vertical gap={8}>
            <Texto category="p2" weight="500">Loss Reason <span style={{ color: '#ff4d4f' }}>*</span></Texto>
            <Select
              placeholder="Select reason..."
              value={reason}
              onChange={setReason}
              options={LOSS_REASON_OPTIONS}
              style={{ width: '100%' }}
            />
          </Vertical>
        )}

        {/* Notes — optional */}
        {result && (
          <Vertical gap={8}>
            <Texto category="p2" weight="500">Notes (optional)</Texto>
            <TextArea
              placeholder="Additional context about the outcome..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </Vertical>
        )}

        {/* Split award toggle — only for won/lost */}
        {isFinalDisposition && (
          <Vertical gap={12}>
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <Switch
                size="small"
                checked={splitAward}
                onChange={(checked) => {
                  setSplitAward(checked)
                  if (checked && result) {
                    initializeDetailOutcomes(result as DetailOutcome)
                  }
                }}
              />
              <Texto category="p2" weight="500">Split award</Texto>
              <Texto category="p3" appearance="medium">— mark individual details as won or lost</Texto>
            </Horizontal>

            {splitAward && (
              <Vertical gap={8}>
                {derivedStatus === 'partial-win' && (
                  <div className={styles['partial-win-banner']}>
                    <Texto category="p2" weight="500" style={{ color: '#d48806' }}>
                      Mixed outcomes — RFP will be recorded as Partial Win
                    </Texto>
                  </div>
                )}

                <div className={styles['detail-table']}>
                  <div className={styles['detail-header']}>
                    <Texto category="p3" weight="600" style={{ flex: '1 1 120px' }}>Product</Texto>
                    <Texto category="p3" weight="600" style={{ flex: '1 1 120px' }}>Terminal</Texto>
                    <Texto category="p3" weight="600" style={{ flex: '0 0 100px' }}>Outcome</Texto>
                    <Texto category="p3" weight="600" style={{ flex: '1 1 140px' }}>Reason</Texto>
                    <Texto category="p3" weight="600" style={{ flex: '1 1 140px' }}>Notes</Texto>
                  </div>
                  {rfp.details.map((detail) => {
                    const detailState = detailOutcomes[detail.id]
                    if (!detailState) return null
                    return (
                      <div key={detail.id} className={styles['detail-row']}>
                        <Texto category="p2" style={{ flex: '1 1 120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {detail.product}
                        </Texto>
                        <Texto category="p2" style={{ flex: '1 1 120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {detail.terminal}
                        </Texto>
                        <div style={{ flex: '0 0 100px' }}>
                          <Select
                            size="small"
                            value={detailState.outcome}
                            onChange={(val) => {
                              updateDetailOutcome(detail.id, 'outcome', val)
                              // Reset reason when outcome changes
                              updateDetailOutcome(detail.id, 'reason', '')
                            }}
                            options={[
                              { value: 'won', label: 'Won' },
                              { value: 'lost', label: 'Lost' },
                            ]}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div style={{ flex: '1 1 140px' }}>
                          <Select
                            size="small"
                            placeholder="Optional..."
                            value={detailState.reason || undefined}
                            onChange={(val) => updateDetailOutcome(detail.id, 'reason', val)}
                            options={detailState.outcome === 'won' ? WIN_REASON_OPTIONS : LOSS_REASON_OPTIONS}
                            style={{ width: '100%' }}
                            allowClear
                          />
                        </div>
                        <div style={{ flex: '1 1 140px' }}>
                          <Input
                            size="small"
                            placeholder="Optional..."
                            value={detailState.notes}
                            onChange={(e) => updateDetailOutcome(detail.id, 'notes', e.target.value)}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Vertical>
            )}
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
