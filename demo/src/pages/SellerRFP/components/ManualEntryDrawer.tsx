/**
 * Manual Entry Drawer
 *
 * Right-side drawer for manually building detail rows one at a time.
 * - Metadata section (name, buyer, deadline)
 * - Dynamic row list with product/terminal select pairs + remove buttons
 * - Add Row button
 * - Duplicate detection warning
 */

import { useState, useCallback, useMemo } from 'react'
import { Drawer, Input, DatePicker, Select } from 'antd'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { PlusOutlined, CloseOutlined, WarningFilled } from '@ant-design/icons'
import type { SellerRFP, SellerRFPDetail, RFPTerms } from '../types/sellerRfp.types'
import { SELLER_PRODUCTS, SELLER_TERMINALS } from '../data/sellerRfp.data'
import { getCustomerOptions } from '../../../shared/data'
import styles from './ManualEntryDrawer.module.css'

interface ManualRow {
  id: string
  product: string | null
  terminal: string | null
}

interface ManualEntryDrawerProps {
  open: boolean
  onClose: () => void
  onCreate: (rfp: SellerRFP) => void
}

const productOptions = SELLER_PRODUCTS.map((p) => ({ value: p, label: p }))
const terminalOptions = SELLER_TERMINALS.map((t) => ({ value: t, label: t.replace(' Terminal', '') }))

let rowIdCounter = 1
function newRow(): ManualRow {
  return { id: `mr-${rowIdCounter++}`, product: null, terminal: null }
}

export function ManualEntryDrawer({ open, onClose, onCreate }: ManualEntryDrawerProps) {
  const [rfpName, setRfpName] = useState('')
  const [buyerId, setBuyerId] = useState<string | null>(null)
  const [buyerName, setBuyerName] = useState('')
  const [deadline, setDeadline] = useState<string | null>(null)
  const [rows, setRows] = useState<ManualRow[]>([newRow()])

  const customerOptions = getCustomerOptions().map((c) => ({
    value: String(c.value),
    label: c.label,
  }))

  // Duplicate detection
  const duplicates = useMemo(() => {
    const seen = new Set<string>()
    const dupes = new Set<string>()
    for (const row of rows) {
      if (!row.product || !row.terminal) continue
      const key = `${row.product}|${row.terminal}`
      if (seen.has(key)) dupes.add(key)
      seen.add(key)
    }
    return dupes
  }, [rows])

  const validRows = useMemo(() =>
    rows.filter((r) => r.product && r.terminal),
  [rows])

  const resetForm = useCallback(() => {
    setRfpName('')
    setBuyerId(null)
    setBuyerName('')
    setDeadline(null)
    setRows([newRow()])
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

  const handleAddRow = useCallback(() => {
    setRows((prev) => [...prev, newRow()])
  }, [])

  const handleRemoveRow = useCallback((id: string) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((r) => r.id !== id)
    })
  }, [])

  const handleRowChange = useCallback((id: string, field: 'product' | 'terminal', value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    )
  }, [])

  const handleCreate = useCallback(() => {
    if (!rfpName || !buyerId || !deadline || validRows.length === 0) return

    // Deduplicate — take first occurrence
    const seen = new Set<string>()
    const uniqueRows = validRows.filter((r) => {
      const key = `${r.product}|${r.terminal}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    const details: SellerRFPDetail[] = uniqueRows.map((row, i) => ({
      id: `detail-manual-${Date.now()}-${i}`,
      product: row.product!,
      terminal: row.terminal!,
      costType: null,
      costFormula: null,
      costPrice: null,
      saleFormula: null,
      formulaDiff: null,
      salePrice: null,
      margin: null,
      volume: null,
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
      id: `srfp-manual-${Date.now()}`,
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
  }, [rfpName, buyerId, buyerName, deadline, validRows, onCreate, resetForm])

  return (
    <Drawer
      title="Add Rows Manually"
      placement="right"
      width={520}
      open={open}
      onClose={handleClose}
      footer={
        <Horizontal justifyContent="space-between" alignItems="center">
          <Texto category="p2" appearance="medium">
            {validRows.length > 0
              ? `${validRows.length} detail row${validRows.length !== 1 ? 's' : ''}`
              : 'Add at least one row'}
          </Texto>
          <Horizontal gap={8}>
            <GraviButton buttonText="Cancel" onClick={handleClose} />
            <GraviButton
              buttonText="Create RFP Response"
              theme1
              onClick={handleCreate}
              disabled={!rfpName || !buyerId || !deadline || validRows.length === 0}
            />
          </Horizontal>
        </Horizontal>
      }
    >
      <Vertical gap={24}>
        {/* Metadata */}
        <Vertical gap={16}>
          <Texto category="h5" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
            RFP Information
          </Texto>

          <Vertical gap={4}>
            <Texto category="p2" weight="500">RFP Name</Texto>
            <Input
              placeholder="e.g., Gulf Coast Gasoline Supply 2026"
              value={rfpName}
              onChange={(e) => setRfpName(e.target.value)}
            />
          </Vertical>

          <Vertical gap={4}>
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

          <Vertical gap={4}>
            <Texto category="p2" weight="500">Response Deadline</Texto>
            <DatePicker
              style={{ width: '100%' }}
              onChange={(_, dateString) => setDeadline(dateString as string)}
            />
          </Vertical>
        </Vertical>

        {/* Rows */}
        <Vertical gap={12}>
          <Horizontal justifyContent="space-between" alignItems="center">
            <Texto category="h5" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
              Detail Rows
            </Texto>
            <GraviButton
              buttonText="Add Row"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
            />
          </Horizontal>

          {duplicates.size > 0 && (
            <Horizontal alignItems="center" gap={6} style={{ padding: '6px 10px', backgroundColor: '#fff7e6', borderRadius: '6px', border: '1px solid #ffd591' }}>
              <WarningFilled style={{ color: '#fa8c16', fontSize: '13px' }} />
              <Texto category="p3" style={{ color: '#d46b08' }}>
                Duplicate rows detected — duplicates will be merged on creation
              </Texto>
            </Horizontal>
          )}

          <Vertical gap={8}>
            {rows.map((row, idx) => {
              const isDuplicate = row.product && row.terminal && duplicates.has(`${row.product}|${row.terminal}`)
              return (
                <div
                  key={row.id}
                  className={`${styles['row-entry']} ${isDuplicate ? styles['row-duplicate'] : ''}`}
                >
                  <Texto category="p3" appearance="medium" style={{ width: '20px', textAlign: 'center', flexShrink: 0 }}>
                    {idx + 1}
                  </Texto>
                  <Select
                    placeholder="Product"
                    value={row.product}
                    onChange={(v) => handleRowChange(row.id, 'product', v)}
                    options={productOptions}
                    style={{ flex: 1 }}
                    size="small"
                  />
                  <Select
                    placeholder="Terminal"
                    value={row.terminal}
                    onChange={(v) => handleRowChange(row.id, 'terminal', v)}
                    options={terminalOptions}
                    style={{ flex: 1 }}
                    size="small"
                  />
                  <button
                    className={styles['remove-row']}
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={rows.length <= 1}
                    title="Remove row"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              )
            })}
          </Vertical>
        </Vertical>
      </Vertical>
    </Drawer>
  )
}
