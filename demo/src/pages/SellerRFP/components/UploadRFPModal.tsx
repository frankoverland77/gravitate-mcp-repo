/**
 * Upload RFP Modal
 *
 * Multi-stage modal for importing buyer RFP documents:
 * 1. Upload — dropzone for file selection
 * 2. Validating — progress animation while "parsing"
 * 3. Review — show parsed rows with issue highlighting + metadata editing
 * 4. Creating — brief spinner then done
 */

import { useState, useCallback, useEffect } from 'react'
import { Modal, Input, DatePicker, Select, Spin } from 'antd'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import {
  InboxOutlined,
  CheckCircleFilled,
  WarningFilled,
  LoadingOutlined,
} from '@ant-design/icons'
import type { SellerRFP, SellerRFPDetail, RFPTerms } from '../types/sellerRfp.types'
import { SELLER_PRODUCTS, SELLER_TERMINALS } from '../data/sellerRfp.data'
import { getCustomerOptions } from '../../../shared/data'
import styles from './UploadRFPModal.module.css'

type UploadStage = 'upload' | 'validating' | 'review' | 'creating'

interface ParsedRow {
  product: string
  terminal: string
  volume: number | null
  issue: string | null // e.g. "Unrecognized terminal"
}

interface UploadRFPModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (rfp: SellerRFP) => void
}

// Simulated parsed rows from an uploaded file
function generateParsedRows(): ParsedRow[] {
  return [
    { product: '87 Octane', terminal: 'Houston Terminal', volume: 250000, issue: null },
    { product: '87 Octane', terminal: 'Pasadena Terminal', volume: 200000, issue: null },
    { product: '93 Octane', terminal: 'Houston Terminal', volume: 120000, issue: null },
    { product: 'ULSD', terminal: 'Houston Terminal', volume: 180000, issue: null },
    { product: 'ULSD', terminal: 'Beaumont Terminal', volume: 150000, issue: null },
    { product: 'Kerosene', terminal: 'Port Arthur Terminal', volume: 80000, issue: 'Unrecognized terminal' },
    { product: '89 Octane', terminal: 'Dallas Terminal', volume: null, issue: 'Missing volume' },
  ]
}

export function UploadRFPModal({ visible, onClose, onCreate }: UploadRFPModalProps) {
  const [stage, setStage] = useState<UploadStage>('upload')
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])

  // Metadata fields
  const [rfpName, setRfpName] = useState('')
  const [buyerId, setBuyerId] = useState<string | null>(null)
  const [buyerName, setBuyerName] = useState('')
  const [deadline, setDeadline] = useState<string | null>(null)

  const customerOptions = getCustomerOptions().map((c) => ({
    value: String(c.value),
    label: c.label,
  }))

  const resetForm = useCallback(() => {
    setStage('upload')
    setFileName(null)
    setParsedRows([])
    setRfpName('')
    setBuyerId(null)
    setBuyerName('')
    setDeadline(null)
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  // Simulate file drop → start validating
  const handleFileDrop = useCallback(() => {
    setFileName('Pilot_RFP_2026_Q2.xlsx')
    setStage('validating')
  }, [])

  // Auto-advance from validating → review after delay
  useEffect(() => {
    if (stage !== 'validating') return
    const timer = setTimeout(() => {
      setParsedRows(generateParsedRows())
      setRfpName('Pilot Gulf Coast Supply Q2 2026')
      setStage('review')
    }, 1800)
    return () => clearTimeout(timer)
  }, [stage])

  // Auto-advance from creating → done
  useEffect(() => {
    if (stage !== 'creating') return
    const timer = setTimeout(() => {
      const validRows = parsedRows.filter((r) => !r.issue)
      const details: SellerRFPDetail[] = validRows.map((row, i) => ({
        id: `detail-upload-${Date.now()}-${i}`,
        product: row.product,
        terminal: row.terminal,
        costType: null,
        costFormula: null,
        costPrice: null,
        saleFormula: null,
        salePrice: null,
        margin: null,
        volume: row.volume,
        status: 'empty' as const,
        termOverrides: null,
      }))

      const defaultTerms: RFPTerms = {
        volumeCommitment: null,
        contractStart: null,
        contractEnd: null,
        allocationPeriod: null,
        ratabilityMin: null,
        ratabilityMax: null,
        penaltyCpg: null,
        paymentTerms: null,
        notes: null,
      }

      const newRFP: SellerRFP = {
        id: `srfp-upload-${Date.now()}`,
        name: rfpName || 'Uploaded RFP',
        buyerId: buyerId || '',
        buyerName: buyerName || '',
        deadline: deadline || '',
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
    }, 1200)
    return () => clearTimeout(timer)
  }, [stage, parsedRows, rfpName, buyerId, buyerName, deadline, onCreate, resetForm])

  const handleBuyerChange = useCallback((value: string) => {
    setBuyerId(value)
    const option = customerOptions.find((c) => c.value === value)
    setBuyerName(option?.label || '')
  }, [customerOptions])

  const handleCreate = useCallback(() => {
    if (!rfpName || !buyerId || !deadline) return
    setStage('creating')
  }, [rfpName, buyerId, deadline])

  const validCount = parsedRows.filter((r) => !r.issue).length
  const issueCount = parsedRows.filter((r) => r.issue).length

  const renderStage = () => {
    switch (stage) {
      case 'upload':
        return (
          <Vertical style={{ gap: '20px' }}>
            <Vertical style={{ gap: '4px' }}>
              <Texto category="h5" weight="600">Upload Buyer's RFP</Texto>
              <Texto category="p2" appearance="medium">
                Drop a spreadsheet or PDF. We'll parse products, terminals, and volumes.
              </Texto>
            </Vertical>

            <button className={styles.dropzone} onClick={handleFileDrop}>
              <InboxOutlined style={{ fontSize: '36px', color: '#bfbfbf' }} />
              <Texto category="p1" appearance="medium">
                Click or drop file here
              </Texto>
              <Texto category="p3" appearance="medium">
                Supports .xlsx, .csv, .pdf
              </Texto>
            </button>
          </Vertical>
        )

      case 'validating':
        return (
          <Vertical alignItems="center" justifyContent="center" style={{ gap: '16px', padding: '40px 0' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
            <Texto category="p1" weight="500">Parsing {fileName}...</Texto>
            <Texto category="p3" appearance="medium">
              Extracting products, terminals, and volumes
            </Texto>
          </Vertical>
        )

      case 'review':
        return (
          <Vertical style={{ gap: '20px' }}>
            {/* Parse summary */}
            <Horizontal style={{ gap: '12px' }} alignItems="center">
              <span className={styles['status-pill-ok']}>
                <CheckCircleFilled /> {validCount} rows parsed
              </span>
              {issueCount > 0 && (
                <span className={styles['status-pill-warn']}>
                  <WarningFilled /> {issueCount} with issues
                </span>
              )}
            </Horizontal>

            {/* Parsed rows table */}
            <div className={styles['parsed-table']}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Terminal</th>
                    <th style={{ textAlign: 'right' }}>Volume (gal/mo)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row, i) => (
                    <tr key={i} className={row.issue ? styles['issue-row'] : ''}>
                      <td><Texto category="p2">{row.product}</Texto></td>
                      <td>
                        <Texto category="p2" style={row.issue?.includes('terminal') ? { color: '#fa8c16' } : {}}>
                          {row.terminal}
                        </Texto>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Texto category="p2" style={{ fontFamily: 'monospace' }}>
                          {row.volume ? row.volume.toLocaleString() : <span style={{ color: '#bfbfbf' }}>—</span>}
                        </Texto>
                      </td>
                      <td>
                        {row.issue ? (
                          <span className={styles['issue-badge']}>{row.issue}</span>
                        ) : (
                          <CheckCircleFilled style={{ color: '#52c41a', fontSize: '14px' }} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {issueCount > 0 && (
              <Texto category="p3" appearance="medium" style={{ fontStyle: 'italic' }}>
                Rows with issues will be skipped. You can add them manually after creation.
              </Texto>
            )}

            {/* Metadata section */}
            <Vertical style={{ gap: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
                RFP Information
              </Texto>

              <Vertical style={{ gap: '4px' }}>
                <Texto category="p2" weight="500">RFP Name</Texto>
                <Input
                  value={rfpName}
                  onChange={(e) => setRfpName(e.target.value)}
                  placeholder="e.g., Gulf Coast Gasoline Supply 2026"
                />
              </Vertical>

              <Horizontal style={{ gap: '12px' }}>
                <Vertical style={{ gap: '4px', flex: 1 }}>
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

                <Vertical style={{ gap: '4px', flex: 1 }}>
                  <Texto category="p2" weight="500">Response Deadline</Texto>
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={(_, dateString) => setDeadline(dateString as string)}
                  />
                </Vertical>
              </Horizontal>
            </Vertical>
          </Vertical>
        )

      case 'creating':
        return (
          <Vertical alignItems="center" justifyContent="center" style={{ gap: '16px', padding: '40px 0' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
            <Texto category="p1" weight="500">Creating RFP Response...</Texto>
            <Texto category="p3" appearance="medium">
              {validCount} detail rows from {fileName}
            </Texto>
          </Vertical>
        )
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      width={600}
      centered
      title={null}
      closable={stage !== 'validating' && stage !== 'creating'}
      maskClosable={stage === 'upload'}
      footer={
        stage === 'review' ? (
          <Horizontal justifyContent="flex-end" style={{ gap: '8px' }}>
            <GraviButton buttonText="Cancel" onClick={handleClose} />
            <GraviButton
              buttonText={`Create with ${validCount} Rows`}
              theme1
              onClick={handleCreate}
              disabled={!rfpName || !buyerId || !deadline || validCount === 0}
            />
          </Horizontal>
        ) : null
      }
    >
      {renderStage()}
    </Modal>
  )
}
