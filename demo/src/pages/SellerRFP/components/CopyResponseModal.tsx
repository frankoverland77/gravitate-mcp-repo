/**
 * Copy Response Modal
 *
 * Allows users to copy an existing RFP response as a starting point.
 * Two steps:
 * 1. Search/select from existing RFPs (radio-button list) with toggles
 *    for including sale formulas and cost data
 * 2. Edit metadata (name, buyer, deadline) before creation
 */

import { useState, useCallback, useMemo } from 'react'
import { Modal, Input, DatePicker, Select, Switch, Radio } from 'antd'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { SearchOutlined } from '@ant-design/icons'
import type { SellerRFP, SellerRFPDetail, RFPTerms } from '../types/sellerRfp.types'
import { STATUS_LABELS, STATUS_COLORS, formatVolume } from '../types/sellerRfp.types'
import { getCustomerOptions } from '../../../shared/data'
import styles from './CopyResponseModal.module.css'

type CopyStep = 'select' | 'metadata'

interface CopyResponseModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (rfp: SellerRFP) => void
  rfps: SellerRFP[]
}

export function CopyResponseModal({ visible, onClose, onCreate, rfps }: CopyResponseModalProps) {
  const [step, setStep] = useState<CopyStep>('select')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRfpId, setSelectedRfpId] = useState<string | null>(null)
  const [includeFormulas, setIncludeFormulas] = useState(true)
  const [includeCostData, setIncludeCostData] = useState(false)

  // Metadata
  const [rfpName, setRfpName] = useState('')
  const [buyerId, setBuyerId] = useState<string | null>(null)
  const [buyerName, setBuyerName] = useState('')
  const [deadline, setDeadline] = useState<string | null>(null)

  const customerOptions = getCustomerOptions().map((c) => ({
    value: String(c.value),
    label: c.label,
  }))

  // Filter RFPs: only show completed or in-progress ones
  const filteredRfps = useMemo(() => {
    const copyable = rfps.filter((r) =>
      ['won', 'lost', 'submitted', 'in-progress', 'advanced'].includes(r.status),
    )
    if (!searchTerm) return copyable
    const lower = searchTerm.toLowerCase()
    return copyable.filter((r) =>
      r.name.toLowerCase().includes(lower) ||
      r.buyerName.toLowerCase().includes(lower),
    )
  }, [rfps, searchTerm])

  const selectedRfp = useMemo(() =>
    rfps.find((r) => r.id === selectedRfpId) || null,
  [rfps, selectedRfpId])

  const resetForm = useCallback(() => {
    setStep('select')
    setSearchTerm('')
    setSelectedRfpId(null)
    setIncludeFormulas(true)
    setIncludeCostData(false)
    setRfpName('')
    setBuyerId(null)
    setBuyerName('')
    setDeadline(null)
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  const handleBuyerChange = useCallback((value: string) => {
    setBuyerId(value)
    const option = customerOptions.find((c) => c.value === value)
    setBuyerName(option?.label || '')
  }, [customerOptions])

  const handleNext = useCallback(() => {
    if (!selectedRfp) return
    setRfpName(`${selectedRfp.name} (Copy)`)
    setBuyerId(selectedRfp.buyerId)
    setBuyerName(selectedRfp.buyerName)
    setStep('metadata')
  }, [selectedRfp])

  const handleCreate = useCallback(() => {
    if (!selectedRfp || !rfpName || !buyerId || !deadline) return

    const details: SellerRFPDetail[] = selectedRfp.details.map((d, i) => ({
      id: `detail-copy-${Date.now()}-${i}`,
      product: d.product,
      terminal: d.terminal,
      costType: includeCostData ? d.costType : null,
      costFormula: includeCostData ? d.costFormula : null,
      costPrice: includeCostData ? d.costPrice : null,
      saleFormula: includeFormulas ? d.saleFormula : null,
      formulaDiff: includeFormulas ? d.formulaDiff : null,
      salePrice: includeFormulas ? d.salePrice : null,
      margin: includeFormulas && includeCostData ? d.margin : null,
      volume: d.volume,
      status: 'empty' as const,
      termOverrides: null,
    }))

    const defaultTerms: RFPTerms = {
      volumeCommitment: selectedRfp.terms.volumeCommitment,
      contractStart: null,
      contractEnd: null,
      allocationPeriod: selectedRfp.terms.allocationPeriod,
      ratabilityMin: selectedRfp.terms.ratabilityMin,
      ratabilityMax: selectedRfp.terms.ratabilityMax,
      penaltyCpg: selectedRfp.terms.penaltyCpg,
      paymentTerms: selectedRfp.terms.paymentTerms,
      notes: null,
    }

    const newRFP: SellerRFP = {
      id: `srfp-copy-${Date.now()}`,
      name: rfpName,
      buyerId: buyerId,
      buyerName: buyerName,
      deadline: deadline,
      currentRound: 1,
      status: 'draft',
      details,
      terms: defaultTerms,
      rounds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onCreate(newRFP)
    resetForm()
  }, [selectedRfp, rfpName, buyerId, buyerName, deadline, includeFormulas, includeCostData, onCreate, resetForm])

  const renderSelectStep = () => (
    <Vertical style={{ gap: '16px' }}>
      <Vertical style={{ gap: '4px' }}>
        <Texto category="h5" weight="600">Copy Previous Response</Texto>
        <Texto category="p2" appearance="medium">
          Select an existing RFP to use as a starting point
        </Texto>
      </Vertical>

      <Input
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        placeholder="Search by name or buyer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
      />

      <div className={styles['rfp-list']}>
        <Radio.Group
          value={selectedRfpId}
          onChange={(e) => setSelectedRfpId(e.target.value)}
          style={{ width: '100%' }}
        >
          <Vertical style={{ gap: '4px' }}>
            {filteredRfps.map((rfp) => {
              const totalVolume = rfp.details.reduce((s, d) => s + (d.volume || 0), 0)
              const statusColors = STATUS_COLORS[rfp.status]
              return (
                <label
                  key={rfp.id}
                  className={`${styles['rfp-item']} ${selectedRfpId === rfp.id ? styles['rfp-item-selected'] : ''}`}
                >
                  <Radio value={rfp.id} />
                  <Vertical style={{ flex: 1, gap: '2px', minWidth: 0 }}>
                    <Texto category="p2" weight="500" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rfp.name}
                    </Texto>
                    <Horizontal style={{ gap: '8px' }} alignItems="center">
                      <Texto category="p3" appearance="medium">{rfp.buyerName}</Texto>
                      <Texto category="p3" appearance="medium">{rfp.details.length} rows</Texto>
                      {totalVolume > 0 && (
                        <Texto category="p3" appearance="medium">{formatVolume(totalVolume)}</Texto>
                      )}
                    </Horizontal>
                  </Vertical>
                  <span
                    className={styles['rfp-status']}
                    style={{ color: statusColors.color, backgroundColor: statusColors.background }}
                  >
                    {STATUS_LABELS[rfp.status]}
                  </span>
                </label>
              )
            })}
            {filteredRfps.length === 0 && (
              <Texto category="p2" appearance="medium" style={{ textAlign: 'center', padding: '16px' }}>
                No matching RFPs found
              </Texto>
            )}
          </Vertical>
        </Radio.Group>
      </div>

      {/* Toggles */}
      <Vertical style={{ gap: '8px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
        <Horizontal justifyContent="space-between" alignItems="center">
          <Texto category="p2">Include sale formulas</Texto>
          <Switch size="small" checked={includeFormulas} onChange={setIncludeFormulas} />
        </Horizontal>
        <Horizontal justifyContent="space-between" alignItems="center">
          <Texto category="p2">Include cost data</Texto>
          <Switch size="small" checked={includeCostData} onChange={setIncludeCostData} />
        </Horizontal>
      </Vertical>
    </Vertical>
  )

  const renderMetadataStep = () => (
    <Vertical style={{ gap: '16px' }}>
      <Vertical style={{ gap: '4px' }}>
        <Texto category="h5" weight="600">RFP Details</Texto>
        <Texto category="p2" appearance="medium">
          Copying {selectedRfp?.details.length} rows from "{selectedRfp?.name}"
        </Texto>
      </Vertical>

      <Vertical style={{ gap: '12px' }}>
        <Vertical style={{ gap: '4px' }}>
          <Texto category="p2" weight="500">RFP Name</Texto>
          <Input
            value={rfpName}
            onChange={(e) => setRfpName(e.target.value)}
            placeholder="e.g., Gulf Coast Gasoline Supply 2026"
          />
        </Vertical>

        <Vertical style={{ gap: '4px' }}>
          <Texto category="p2" weight="500">Buyer</Texto>
          <Select
            placeholder="Select buyer..."
            showSearch
            value={buyerId}
            onChange={handleBuyerChange}
            options={customerOptions}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: '100%' }}
          />
        </Vertical>

        <Vertical style={{ gap: '4px' }}>
          <Texto category="p2" weight="500">Response Deadline</Texto>
          <DatePicker
            style={{ width: '100%' }}
            onChange={(_, dateString) => setDeadline(dateString as string)}
          />
        </Vertical>
      </Vertical>
    </Vertical>
  )

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      width={600}
      centered
      title={null}
      closable
      footer={
        <Horizontal justifyContent="space-between" style={{ width: '100%' }}>
          {step === 'metadata' ? (
            <GraviButton buttonText="Back" onClick={() => setStep('select')} />
          ) : (
            <span />
          )}
          <Horizontal style={{ gap: '8px' }}>
            <GraviButton buttonText="Cancel" onClick={handleClose} />
            {step === 'select' ? (
              <GraviButton
                buttonText="Next"
                theme1
                onClick={handleNext}
                disabled={!selectedRfpId}
              />
            ) : (
              <GraviButton
                buttonText="Create RFP Response"
                theme1
                onClick={handleCreate}
                disabled={!rfpName || !buyerId || !deadline}
              />
            )}
          </Horizontal>
        </Horizontal>
      }
    >
      {step === 'select' ? renderSelectStep() : renderMetadataStep()}
    </Modal>
  )
}
