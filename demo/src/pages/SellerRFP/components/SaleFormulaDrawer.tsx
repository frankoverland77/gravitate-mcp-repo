import { useState, useCallback, useEffect, useMemo } from 'react'
import { Vertical, Horizontal, Texto, GraviButton, BBDTag } from '@gravitate-js/excalibrr'
import { CaretDownOutlined, CloseOutlined, CopyOutlined, SnippetsOutlined } from '@ant-design/icons'
import { Drawer, Select, InputNumber, Segmented } from 'antd'
import type { SellerRFPDetail, Formula, FormulaVariable } from '../types/sellerRfp.types'
import {
  COST_TYPE_LABELS,
  COST_TYPE_COLORS,
  formatPrice,
  formatMarginCpg,
  calculateMarginCpg,
  getMarginColor,
} from '../types/sellerRfp.types'
import {
  PRICE_PUBLISHER_OPTIONS,
  PRICE_TYPE_OPTIONS,
  DATE_RULE_OPTIONS,
  getInstrumentsByProductGroup,
} from '../../../shared/data'
import styles from './SaleFormulaDrawer.module.css'

interface SaleFormulaDrawerProps {
  visible: boolean
  detail: SellerRFPDetail | null
  onClose: () => void
  onApply: (detail: SellerRFPDetail) => void
}

type FormulaMode = 'formula' | 'lower-of-2' | 'lower-of-3'

const MODE_OPTIONS = [
  { value: 'formula', label: 'Formula' },
  { value: 'lower-of-2', label: 'Lesser Of 2' },
  { value: 'lower-of-3', label: 'Lesser Of 3' },
]

const BASE_PRICES: Record<string, number> = {
  '87 Octane': 2.30,
  '89 Octane': 2.34,
  '93 Octane': 2.42,
  'ULSD': 2.26,
  'Kerosene': 2.31,
}

function createEmptyVariable(groupNum: number = 1, index: number = 1): FormulaVariable {
  return {
    id: `var-new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    variableName: `var_${index}_group_${groupNum}`,
    displayName: null,
    pricePublisher: 'OPIS',
    priceInstrument: 'CBOB USGC',
    priceType: 'Low',
    dateRule: 'Prior Day',
    percentage: 100,
    differential: 0,
  }
}

function resolveFormulaPrice(variables: FormulaVariable[], product: string, mode: FormulaMode): number | null {
  if (variables.length === 0) return null
  const base = BASE_PRICES[product] || 2.30

  if (mode === 'formula') {
    // Simple: sum of (base + diff) * pct/100
    return variables.reduce((sum, v) => {
      const pct = typeof v.percentage === 'number' ? v.percentage / 100 : 1
      return sum + (base + v.differential) * pct
    }, 0)
  }

  // Lesser Of: resolve each group, take min
  const groups: Record<number, FormulaVariable[]> = {}
  for (const v of variables) {
    const match = v.variableName.match(/group_(\d+)/)
    const g = match ? parseInt(match[1]) : 1
    if (!groups[g]) groups[g] = []
    groups[g].push(v)
  }

  const groupPrices = Object.values(groups).map((vars) =>
    vars.reduce((sum, v) => {
      const pct = typeof v.percentage === 'number' ? v.percentage / 100 : 1
      return sum + (base + v.differential) * pct
    }, 0),
  )

  return groupPrices.length > 0 ? Math.min(...groupPrices) : null
}

function buildFormulaExpression(variables: FormulaVariable[], mode: FormulaMode): string {
  if (variables.length === 0) return ''

  const formatVar = (v: FormulaVariable) => {
    const diffStr = v.differential >= 0 ? `+ $${v.differential.toFixed(3)}` : `- $${Math.abs(v.differential).toFixed(3)}`
    return `${v.pricePublisher} ${v.priceInstrument} ${v.priceType} ${diffStr}`
  }

  if (mode === 'formula') {
    return variables.map(formatVar).join(' + ')
  }

  // Group variables
  const groups: Record<number, FormulaVariable[]> = {}
  for (const v of variables) {
    const match = v.variableName.match(/group_(\d+)/)
    const g = match ? parseInt(match[1]) : 1
    if (!groups[g]) groups[g] = []
    groups[g].push(v)
  }

  const groupExprs = Object.values(groups).map((vars) =>
    vars.map(formatVar).join(' + '),
  )

  return `MIN(${groupExprs.join(', ')})`
}

export function SaleFormulaDrawer({ visible, detail, onClose, onApply }: SaleFormulaDrawerProps) {
  const [mode, setMode] = useState<FormulaMode>('formula')
  const [variables, setVariables] = useState<FormulaVariable[]>([createEmptyVariable()])

  // Load existing formula when detail changes
  useEffect(() => {
    if (detail?.saleFormula) {
      setVariables(detail.saleFormula.variables.map((v) => ({ ...v })))
      // Detect mode from variable group names
      const groupNums = new Set(detail.saleFormula.variables.map((v) => {
        const match = v.variableName.match(/group_(\d+)/)
        return match ? parseInt(match[1]) : 1
      }))
      if (groupNums.size >= 3) setMode('lower-of-3')
      else if (groupNums.size >= 2) setMode('lower-of-2')
      else setMode('formula')
    } else {
      setVariables([createEmptyVariable()])
      setMode('formula')
    }
  }, [detail])

  const productGroup = useMemo(() => {
    if (!detail) return 'gasoline'
    return ['ULSD', 'Kerosene'].includes(detail.product) ? 'diesel' : 'gasoline'
  }, [detail])

  const instruments = useMemo(() => {
    return getInstrumentsByProductGroup(productGroup as 'gasoline' | 'diesel')
  }, [productGroup])

  const resolvedPrice = useMemo(() => {
    if (!detail) return null
    return resolveFormulaPrice(variables, detail.product, mode)
  }, [variables, detail, mode])

  const currentMargin = useMemo(() => {
    if (!detail || resolvedPrice === null) return null
    return calculateMarginCpg(resolvedPrice, detail.costPrice)
  }, [resolvedPrice, detail])

  const handleVariableUpdate = useCallback((index: number, field: keyof FormulaVariable, value: string | number) => {
    setVariables((prev) => prev.map((v, i) =>
      i === index ? { ...v, [field]: value } : v,
    ))
  }, [])

  const handleAddVariable = useCallback((groupNum?: number) => {
    const newIndex = variables.length + 1
    const group = groupNum || 1
    setVariables((prev) => [...prev, createEmptyVariable(group, newIndex)])
  }, [variables.length])

  const handleRemoveVariable = useCallback((index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleModeChange = useCallback((value: string | number) => {
    const newMode = value as FormulaMode
    setMode(newMode)
    // Adjust variable groups based on mode
    if (newMode === 'formula') {
      setVariables((prev) => prev.map((v, i) => ({
        ...v,
        variableName: `var_${i + 1}_group_1`,
      })))
    } else if (newMode === 'lower-of-2' && variables.length < 2) {
      setVariables((prev) => [...prev, createEmptyVariable(2, prev.length + 1)])
    } else if (newMode === 'lower-of-3' && variables.length < 3) {
      const needed = 3 - variables.length
      const newVars = Array.from({ length: needed }, (_, i) =>
        createEmptyVariable(variables.length + i + 1, variables.length + i + 1),
      )
      setVariables((prev) => [...prev, ...newVars])
    }
  }, [variables.length])

  const handleCopyFromCost = useCallback(() => {
    if (!detail?.costFormula?.variables) return
    setVariables(detail.costFormula.variables.map((v) => ({ ...v, id: `var-copy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` })))
  }, [detail])

  const handleApply = useCallback(() => {
    if (!detail) return
    const expression = buildFormulaExpression(variables, mode)
    const formula: Formula = {
      id: detail.saleFormula?.id || `formula-sale-${Date.now()}`,
      name: expression.length > 50 ? expression.slice(0, 47) + '...' : expression,
      expression,
      variables: [...variables],
    }

    const resolved = resolveFormulaPrice(variables, detail.product, mode)
    const margin = calculateMarginCpg(resolved, detail.costPrice)

    onApply({
      ...detail,
      saleFormula: formula,
      salePrice: resolved ? Math.round(resolved * 10000) / 10000 : null,
      margin,
    })
  }, [detail, variables, mode, onApply])

  if (!detail) return null

  const marginColor = getMarginColor(currentMargin)

  return (
    <Drawer
      placement="bottom"
      height={720}
      open={visible}
      closable={false}
      styles={{ header: { display: 'none' }, body: { padding: 0 } }}
      className={styles.drawer}
    >
      {/* Header */}
      <Horizontal className={styles.header} alignItems="center" justifyContent="space-between">
        <Horizontal alignItems="center" style={{ gap: '12px' }}>
          <button className={styles['collapse-toggle']} onClick={onClose}>
            <CaretDownOutlined />
          </button>
          <Texto category="p1" weight="600">Sale Formula Editor</Texto>
          <span className={styles['row-badge']}>{detail.product} — {detail.terminal}</span>
        </Horizontal>
        <button className={styles['close-btn']} onClick={onClose}>
          <CloseOutlined />
        </button>
      </Horizontal>

      {/* Body */}
      <div className={styles.body}>
        {/* Left Panel - Context */}
        <Vertical className={styles['left-panel']} style={{ gap: '16px' }}>
          <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
            Context
          </Texto>

          <Vertical style={{ gap: '8px' }}>
            <Vertical style={{ gap: '2px' }}>
              <Texto category="p3" appearance="medium">Product</Texto>
              <Texto category="p2" weight="500">{detail.product}</Texto>
            </Vertical>
            <Vertical style={{ gap: '2px' }}>
              <Texto category="p3" appearance="medium">Terminal</Texto>
              <Texto category="p2" weight="500">{detail.terminal}</Texto>
            </Vertical>
            {detail.volume && (
              <Vertical style={{ gap: '2px' }}>
                <Texto category="p3" appearance="medium">Volume</Texto>
                <Texto category="p2" weight="500">{(detail.volume / 1000).toFixed(0)}K gal/mo</Texto>
              </Vertical>
            )}
          </Vertical>

          {/* Cost Info */}
          <Vertical style={{ gap: '8px', paddingTop: '8px', borderTop: '1px solid #e8e8e8' }}>
            <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
              Cost Basis
            </Texto>
            {detail.costType && (
              <span
                className={styles['cost-badge']}
                style={{
                  color: COST_TYPE_COLORS[detail.costType].color,
                  backgroundColor: COST_TYPE_COLORS[detail.costType].background,
                }}
              >
                {COST_TYPE_LABELS[detail.costType]}
              </span>
            )}
            <Vertical style={{ gap: '2px' }}>
              <Texto category="p3" appearance="medium">Cost Price</Texto>
              <Texto category="h4" weight="600">{formatPrice(detail.costPrice)}</Texto>
            </Vertical>
          </Vertical>

          {/* Live Margin */}
          <Vertical style={{ gap: '8px', paddingTop: '8px', borderTop: '1px solid #e8e8e8' }}>
            <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
              Preview
            </Texto>
            <Vertical style={{ gap: '2px' }}>
              <Texto category="p3" appearance="medium">Sale Price</Texto>
              <Texto category="h4" weight="600">{resolvedPrice !== null ? formatPrice(resolvedPrice) : '—'}</Texto>
            </Vertical>
            <Vertical style={{ gap: '2px' }}>
              <Texto category="p3" appearance="medium">Margin</Texto>
              <Texto
                category="h4"
                weight="600"
                style={{ color: marginColor === 'green' ? '#52c41a' : marginColor === 'yellow' ? '#faad14' : marginColor === 'red' ? '#ff4d4f' : '#8c8c8c' }}
              >
                {formatMarginCpg(currentMargin)}
              </Texto>
            </Vertical>
          </Vertical>
        </Vertical>

        {/* Right Panel - Formula Editor */}
        <Vertical className={styles['right-panel']} style={{ gap: '16px' }}>
          {/* Mode selector */}
          <Horizontal alignItems="center" justifyContent="space-between">
            <Segmented
              value={mode}
              onChange={handleModeChange}
              options={MODE_OPTIONS}
              size="small"
            />
            {detail.costFormula && (
              <GraviButton
                buttonText="Copy from Cost"
                icon={<CopyOutlined />}
                onClick={handleCopyFromCost}
              />
            )}
          </Horizontal>

          {/* Variables Table */}
          <div className={styles['variables-table']}>
            <table>
              <thead>
                <tr>
                  {mode !== 'formula' && <th>Group</th>}
                  <th>Publisher</th>
                  <th>Instrument</th>
                  <th>Price Type</th>
                  <th>Date Rule</th>
                  <th style={{ width: '70px' }}>%</th>
                  <th style={{ width: '90px' }}>Differential</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {variables.map((v, i) => {
                  const groupMatch = v.variableName.match(/group_(\d+)/)
                  const groupNum = groupMatch ? parseInt(groupMatch[1]) : 1

                  return (
                    <tr key={v.id}>
                      {mode !== 'formula' && <td>G{groupNum}</td>}
                      <td>
                        <Select
                          size="small"
                          value={v.pricePublisher}
                          onChange={(val) => handleVariableUpdate(i, 'pricePublisher', val)}
                          options={PRICE_PUBLISHER_OPTIONS.map((p) => ({ value: p, label: p }))}
                          style={{ width: '100%' }}
                        />
                      </td>
                      <td>
                        <Select
                          size="small"
                          value={v.priceInstrument}
                          onChange={(val) => handleVariableUpdate(i, 'priceInstrument', val)}
                          options={instruments.map((inst) => ({ value: inst.name, label: inst.name }))}
                          style={{ width: '100%' }}
                        />
                      </td>
                      <td>
                        <Select
                          size="small"
                          value={v.priceType}
                          onChange={(val) => handleVariableUpdate(i, 'priceType', val)}
                          options={PRICE_TYPE_OPTIONS.map((p) => ({ value: p, label: p }))}
                          style={{ width: '100%' }}
                        />
                      </td>
                      <td>
                        <Select
                          size="small"
                          value={v.dateRule}
                          onChange={(val) => handleVariableUpdate(i, 'dateRule', val)}
                          options={DATE_RULE_OPTIONS.map((d) => ({ value: d, label: d }))}
                          style={{ width: '100%' }}
                        />
                      </td>
                      <td>
                        <InputNumber
                          size="small"
                          value={typeof v.percentage === 'number' ? v.percentage : 100}
                          onChange={(val) => handleVariableUpdate(i, 'percentage', val ?? 100)}
                          min={0}
                          max={100}
                          style={{ width: '100%' }}
                        />
                      </td>
                      <td>
                        <InputNumber
                          size="small"
                          value={v.differential}
                          onChange={(val) => handleVariableUpdate(i, 'differential', val ?? 0)}
                          step={0.001}
                          precision={3}
                          style={{ width: '100%' }}
                        />
                      </td>
                      <td>
                        {variables.length > 1 && (
                          <button
                            className={styles['remove-btn']}
                            onClick={() => handleRemoveVariable(i)}
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <Horizontal style={{ gap: '8px', marginTop: '8px' }}>
              <GraviButton
                buttonText="Add Variable"
                onClick={() => handleAddVariable(1)}
              />
              {mode !== 'formula' && (
                <GraviButton
                  buttonText="Add to Group 2"
                  onClick={() => handleAddVariable(2)}
                />
              )}
            </Horizontal>
          </div>

          {/* Formula Preview */}
          <Vertical style={{ gap: '4px', padding: '12px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
            <Texto category="p3" appearance="medium">Formula Expression</Texto>
            <Texto category="p2" weight="500" style={{ fontFamily: 'monospace' }}>
              {buildFormulaExpression(variables, mode) || 'Configure variables above'}
            </Texto>
          </Vertical>
        </Vertical>
      </div>

      {/* Footer */}
      <Horizontal className={styles.footer} justifyContent="space-between" alignItems="center">
        <Horizontal style={{ gap: '8px' }}>
          <GraviButton buttonText="Copy" icon={<CopyOutlined />} />
          <GraviButton buttonText="Paste" icon={<SnippetsOutlined />} />
        </Horizontal>
        <GraviButton
          buttonText="Apply"
          theme1
          onClick={handleApply}
        />
      </Horizontal>
    </Drawer>
  )
}
