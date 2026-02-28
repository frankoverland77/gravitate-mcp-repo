import { useState, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Drawer, Input, DatePicker, Checkbox, Select } from 'antd'
import type { SellerRFP, SellerRFPDetail, RFPTerms } from '../types/sellerRfp.types'
import { SELLER_PRODUCTS, SELLER_TERMINALS } from '../data/sellerRfp.data'
import { getCustomerOptions } from '../../../shared/data'
import styles from './IntakeDrawer.module.css'

interface IntakeDrawerProps {
  visible: boolean
  onClose: () => void
  onCreate: (rfp: SellerRFP) => void
}

export function IntakeDrawer({ visible, onClose, onCreate }: IntakeDrawerProps) {
  const [rfpName, setRfpName] = useState('')
  const [buyerId, setBuyerId] = useState<string | null>(null)
  const [buyerName, setBuyerName] = useState('')
  const [deadline, setDeadline] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>([])

  const customerOptions = getCustomerOptions().map((c) => ({
    value: String(c.value),
    label: c.label,
  }))

  const previewCount = selectedProducts.length * selectedTerminals.length

  const handleProductToggle = useCallback((product: string, checked: boolean) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, product] : prev.filter((p) => p !== product),
    )
  }, [])

  const handleTerminalToggle = useCallback((terminal: string, checked: boolean) => {
    setSelectedTerminals((prev) =>
      checked ? [...prev, terminal] : prev.filter((t) => t !== terminal),
    )
  }, [])

  const handleSelectAllProducts = useCallback((checked: boolean) => {
    setSelectedProducts(checked ? [...SELLER_PRODUCTS] : [])
  }, [])

  const handleSelectAllTerminals = useCallback((checked: boolean) => {
    setSelectedTerminals(checked ? [...SELLER_TERMINALS] : [])
  }, [])

  const handleBuyerChange = useCallback((value: string) => {
    setBuyerId(value)
    const option = customerOptions.find((c) => c.value === value)
    setBuyerName(option?.label || '')
  }, [customerOptions])

  const handleCreate = useCallback(() => {
    if (!rfpName || !buyerId || !deadline || previewCount === 0) return

    const details: SellerRFPDetail[] = selectedProducts.flatMap((product) =>
      selectedTerminals.map((terminal) => ({
        id: `detail-new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        product,
        terminal,
        costType: null,
        costFormula: null,
        costPrice: null,
        saleFormula: null,
        salePrice: null,
        margin: null,
        volume: null,
        status: 'empty' as const,
        termOverrides: null,
      })),
    )

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
      id: `srfp-new-${Date.now()}`,
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

    // Reset form
    setRfpName('')
    setBuyerId(null)
    setBuyerName('')
    setDeadline(null)
    setSelectedProducts([])
    setSelectedTerminals([])
  }, [rfpName, buyerId, buyerName, deadline, selectedProducts, selectedTerminals, previewCount, onCreate])

  const handleClose = useCallback(() => {
    setRfpName('')
    setBuyerId(null)
    setBuyerName('')
    setDeadline(null)
    setSelectedProducts([])
    setSelectedTerminals([])
    onClose()
  }, [onClose])

  const allProductsSelected = selectedProducts.length === SELLER_PRODUCTS.length
  const allTerminalsSelected = selectedTerminals.length === SELLER_TERMINALS.length

  return (
    <Drawer
      title="New RFP Response"
      placement="right"
      width={520}
      open={visible}
      onClose={handleClose}
      footer={
        <Horizontal justifyContent="space-between" alignItems="center">
          <Texto category="p2" appearance="medium">
            {previewCount > 0 ? `${selectedProducts.length} products × ${selectedTerminals.length} terminals = ${previewCount} detail rows` : 'Select products and terminals'}
          </Texto>
          <Horizontal style={{ gap: '8px' }}>
            <GraviButton buttonText="Cancel" onClick={handleClose} />
            <GraviButton
              buttonText="Create RFP Response"
              theme1
              onClick={handleCreate}
              disabled={!rfpName || !buyerId || !deadline || previewCount === 0}
            />
          </Horizontal>
        </Horizontal>
      }
    >
      <Vertical style={{ gap: '24px' }}>
        {/* RFP Metadata */}
        <Vertical style={{ gap: '16px' }}>
          <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
            RFP Information
          </Texto>

          <Vertical style={{ gap: '4px' }}>
            <Texto category="p2" weight="500">RFP Name</Texto>
            <Input
              placeholder="e.g., Gulf Coast Gasoline Supply 2026"
              value={rfpName}
              onChange={(e) => setRfpName(e.target.value)}
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

        {/* Products */}
        <Vertical style={{ gap: '8px' }}>
          <Horizontal justifyContent="space-between" alignItems="center">
            <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
              Products
            </Texto>
            <Checkbox
              checked={allProductsSelected}
              indeterminate={selectedProducts.length > 0 && !allProductsSelected}
              onChange={(e) => handleSelectAllProducts(e.target.checked)}
            >
              <Texto category="p2">Select All</Texto>
            </Checkbox>
          </Horizontal>

          <div className={styles['checkbox-list']}>
            {SELLER_PRODUCTS.map((product) => (
              <div key={product} className={styles['checkbox-item']}>
                <Checkbox
                  checked={selectedProducts.includes(product)}
                  onChange={(e) => handleProductToggle(product, e.target.checked)}
                >
                  <Texto category="p2">{product}</Texto>
                </Checkbox>
              </div>
            ))}
          </div>
        </Vertical>

        {/* Terminals */}
        <Vertical style={{ gap: '8px' }}>
          <Horizontal justifyContent="space-between" alignItems="center">
            <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
              Terminals
            </Texto>
            <Checkbox
              checked={allTerminalsSelected}
              indeterminate={selectedTerminals.length > 0 && !allTerminalsSelected}
              onChange={(e) => handleSelectAllTerminals(e.target.checked)}
            >
              <Texto category="p2">Select All</Texto>
            </Checkbox>
          </Horizontal>

          <div className={styles['checkbox-list']}>
            {SELLER_TERMINALS.map((terminal) => (
              <div key={terminal} className={styles['checkbox-item']}>
                <Checkbox
                  checked={selectedTerminals.includes(terminal)}
                  onChange={(e) => handleTerminalToggle(terminal, e.target.checked)}
                >
                  <Texto category="p2">{terminal}</Texto>
                </Checkbox>
              </div>
            ))}
          </div>
        </Vertical>

        {/* Preview */}
        {previewCount > 0 && (
          <div className={styles.preview}>
            <Texto category="p2" appearance="medium">
              {previewCount} detail rows will be created ({selectedProducts.length} products × {selectedTerminals.length} terminals)
            </Texto>
          </div>
        )}
      </Vertical>
    </Drawer>
  )
}
