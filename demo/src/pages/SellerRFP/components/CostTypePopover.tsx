import { useState, useCallback } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Popover, Radio, Select, InputNumber } from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { SellerRFPDetail, CostType } from '../types/sellerRfp.types'
import { COST_TYPE_LABELS, COST_TYPE_COLORS } from '../types/sellerRfp.types'
import {
  getMatchingSupplyAgreements,
  getInventoryCostFormula,
} from '../data/sellerRfp.data'
import { PRICE_PUBLISHER_OPTIONS, PRICE_TYPE_OPTIONS } from '../../../shared/data'
import styles from './CostTypePopover.module.css'

interface CostTypePopoverProps {
  detail: SellerRFPDetail
  onUpdate: (detail: SellerRFPDetail) => void
  children: React.ReactNode
}

export function CostTypePopover({ detail, onUpdate, children }: CostTypePopoverProps) {
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<CostType | null>(detail.costType)

  const handleTypeChange = useCallback((e: RadioChangeEvent) => {
    const costType = e.target.value as CostType
    setSelectedType(costType)

    if (costType === 'inventory') {
      // Smart lookup - auto-assign inventory formula
      const formula = getInventoryCostFormula(detail.terminal, detail.product)
      if (formula) {
        const basePrice = { '87 Octane': 2.30, '89 Octane': 2.34, '93 Octane': 2.42, 'ULSD': 2.26, 'Kerosene': 2.31 }[detail.product] || 2.30
        const resolvedPrice = basePrice + formula.variables[0].differential
        onUpdate({
          ...detail,
          costType,
          costFormula: formula,
          costPrice: Math.round(resolvedPrice * 10000) / 10000,
        })
      } else {
        onUpdate({ ...detail, costType, costFormula: null, costPrice: null })
      }
      setOpen(false)
    } else if (costType === 'contract') {
      // Show supply agreements - for now just select the first matching one
      const agreements = getMatchingSupplyAgreements(detail.terminal, detail.product)
      if (agreements.length > 0) {
        const sa = agreements[0]
        const basePrice = { '87 Octane': 2.30, '89 Octane': 2.34, '93 Octane': 2.42, 'ULSD': 2.26, 'Kerosene': 2.31 }[detail.product] || 2.30
        const resolvedPrice = basePrice + sa.formula.variables[0].differential
        onUpdate({
          ...detail,
          costType,
          costFormula: sa.formula,
          costPrice: Math.round(resolvedPrice * 10000) / 10000,
        })
      } else {
        onUpdate({ ...detail, costType, costFormula: null, costPrice: null })
      }
      setOpen(false)
    }
    // For 'estimated', keep popover open for benchmark selector
  }, [detail, onUpdate])

  const handleEstimatedApply = useCallback((publisher: string, priceType: string, differential: number) => {
    const basePrice = { '87 Octane': 2.30, '89 Octane': 2.34, '93 Octane': 2.42, 'ULSD': 2.26, 'Kerosene': 2.31 }[detail.product] || 2.30
    const pi = { '87 Octane': 'CBOB USGC', '89 Octane': 'CBOB USGC', '93 Octane': 'RBOB USGC', 'ULSD': 'ULSD USGC', 'Kerosene': 'ULSD USGC' }[detail.product] || 'CBOB USGC'
    const resolvedPrice = basePrice + differential

    const formula = {
      id: `est-formula-${Date.now()}`,
      name: `${publisher} ${pi} ${priceType} ${differential >= 0 ? '+' : ''}${differential.toFixed(3)}`,
      expression: `${publisher} ${pi} ${priceType} ${differential >= 0 ? '+' : ''}$${Math.abs(differential).toFixed(3)}`,
      variables: [{
        id: `var-est-${Date.now()}`,
        variableName: 'var_1_group_1',
        displayName: `${publisher} ${pi}`,
        pricePublisher: publisher,
        priceInstrument: pi,
        priceType,
        dateRule: 'Prior Day',
        percentage: 100,
        differential,
      }],
    }

    onUpdate({
      ...detail,
      costType: 'estimated',
      costFormula: formula,
      costPrice: Math.round(resolvedPrice * 10000) / 10000,
    })
    setOpen(false)
  }, [detail, onUpdate])

  const agreements = getMatchingSupplyAgreements(detail.terminal, detail.product)

  const content = (
    <Vertical style={{ width: 320, gap: '16px' }} className={styles.popover}>
      <Texto category="p2" weight="600">Cost Type</Texto>

      <Radio.Group value={selectedType} onChange={handleTypeChange}>
        <Vertical style={{ gap: '12px' }}>
          <Radio value="inventory">
            <Vertical style={{ gap: '2px' }}>
              <Texto category="p2" weight="500">Inventory</Texto>
              <Texto category="p3" appearance="medium">
                Auto-lookup replacement cost formula
              </Texto>
            </Vertical>
          </Radio>

          <Radio value="contract">
            <Vertical style={{ gap: '2px' }}>
              <Texto category="p2" weight="500">Contract</Texto>
              <Texto category="p3" appearance="medium">
                {agreements.length > 0
                  ? `${agreements.length} supply agreement${agreements.length > 1 ? 's' : ''} available`
                  : 'No supply agreements at this terminal'}
              </Texto>
            </Vertical>
          </Radio>

          <Radio value="estimated">
            <Vertical style={{ gap: '2px' }}>
              <Texto category="p2" weight="500">Estimated</Texto>
              <Texto category="p3" appearance="medium">
                Configure benchmark price estimate
              </Texto>
            </Vertical>
          </Radio>
        </Vertical>
      </Radio.Group>

      {/* Estimated benchmark selector */}
      {selectedType === 'estimated' && (
        <EstimatedSelector onApply={handleEstimatedApply} />
      )}
    </Vertical>
  )

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
    >
      {children}
    </Popover>
  )
}

// Sub-component for estimated cost configuration
function EstimatedSelector({ onApply }: { onApply: (publisher: string, priceType: string, diff: number) => void }) {
  const [publisher, setPublisher] = useState<string>('OPIS')
  const [priceType, setPriceType] = useState<string>('Low')
  const [differential, setDifferential] = useState<number>(0)

  return (
    <Vertical style={{ gap: '8px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
      <Horizontal style={{ gap: '8px' }}>
        <Vertical style={{ flex: 1, gap: '4px' }}>
          <Texto category="p3" appearance="medium">Publisher</Texto>
          <Select
            size="small"
            value={publisher}
            onChange={setPublisher}
            options={PRICE_PUBLISHER_OPTIONS.map((p) => ({ value: p, label: p }))}
            style={{ width: '100%' }}
          />
        </Vertical>
        <Vertical style={{ flex: 1, gap: '4px' }}>
          <Texto category="p3" appearance="medium">Price Type</Texto>
          <Select
            size="small"
            value={priceType}
            onChange={setPriceType}
            options={PRICE_TYPE_OPTIONS.map((p) => ({ value: p, label: p }))}
            style={{ width: '100%' }}
          />
        </Vertical>
      </Horizontal>

      <Vertical style={{ gap: '4px' }}>
        <Texto category="p3" appearance="medium">Differential ($/gal)</Texto>
        <InputNumber
          size="small"
          value={differential}
          onChange={(v) => setDifferential(v ?? 0)}
          step={0.001}
          precision={3}
          style={{ width: '100%' }}
          addonBefore={differential >= 0 ? '+' : ''}
        />
      </Vertical>

      <Horizontal justifyContent="flex-end" style={{ paddingTop: '4px' }}>
        <button
          className={styles['apply-btn']}
          onClick={() => onApply(publisher, priceType, differential)}
        >
          Apply
        </button>
      </Horizontal>
    </Vertical>
  )
}
