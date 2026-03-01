import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CaretDownOutlined, CloseOutlined, CopyOutlined, SnippetsOutlined, FileTextOutlined } from '@ant-design/icons'
import { Drawer, Segmented } from 'antd'
import type { SellerRFP, SellerRFPDetail, Formula, FormulaVariable, PastBidReference, TerminalProductStats, MarginHistoryPoint } from '../types/sellerRfp.types'
import {
  COST_TYPE_LABELS,
  COST_TYPE_COLORS,
  formatPrice,
  formatMarginCpg,
  calculateMarginCpg,
  getMarginColor,
} from '../types/sellerRfp.types'
import {
  getPastBidsAtTerminalProduct,
  computeTerminalProductStats,
  generateMarginHistory,
} from '../data/sellerRfp.data'
import { VariablesTable } from '../../ContractManagement/quick-entry/components/formula/VariablesTable'
import { TemplateChooser } from '../../../components/shared/TemplateChooser'
import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext'
import { buildFormulaPreview, isPlaceholder } from '../../demos/grids/FormulaTemplates.data'
import type { TemplateComponent } from '../../demos/grids/FormulaTemplates.data'
import styles from './SaleFormulaDrawer.module.css'

interface SaleFormulaDrawerProps {
  visible: boolean
  detail: SellerRFPDetail | null
  onClose: () => void
  onApply: (detail: SellerRFPDetail) => void
  rfps: SellerRFP[]
  currentRfpId: string
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
    return variables.reduce((sum, v) => {
      const pct = typeof v.percentage === 'number' ? v.percentage / 100 : 1
      return sum + (base + v.differential) * pct
    }, 0)
  }

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
    const name = v.displayName || `${v.pricePublisher} ${v.priceInstrument} ${v.priceType}`
    const diffStr = v.differential >= 0 ? `+ $${v.differential.toFixed(3)}` : `- $${Math.abs(v.differential).toFixed(3)}`
    return `${name} ${diffStr}`
  }

  if (mode === 'formula') {
    return variables.map(formatVar).join(' + ')
  }

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

// Sparkline component
function MarginSparkline({ data }: { data: MarginHistoryPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = 200
    const height = 40
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)

    const margins = data.map((d) => d.marginCpg)
    const maxMargin = Math.max(...margins, 0.5)
    const minMargin = Math.min(...margins, -0.5)
    const range = maxMargin - minMargin || 1

    const zeroY = height - ((0 - minMargin) / range) * height

    // Draw zero line
    ctx.strokeStyle = '#d9d9d9'
    ctx.lineWidth = 0.5
    ctx.setLineDash([2, 2])
    ctx.beginPath()
    ctx.moveTo(0, zeroY)
    ctx.lineTo(width, zeroY)
    ctx.stroke()
    ctx.setLineDash([])

    const stepX = width / (data.length - 1 || 1)

    // Draw filled areas
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = i * stepX
      const x2 = (i + 1) * stepX
      const y1 = height - ((margins[i] - minMargin) / range) * height
      const y2 = height - ((margins[i + 1] - minMargin) / range) * height

      const avgMargin = (margins[i] + margins[i + 1]) / 2
      const fillColor = avgMargin >= 0 ? 'rgba(82, 196, 26, 0.15)' : 'rgba(255, 77, 79, 0.15)'

      ctx.fillStyle = fillColor
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineTo(x2, zeroY)
      ctx.lineTo(x1, zeroY)
      ctx.closePath()
      ctx.fill()
    }

    // Draw margin line
    ctx.strokeStyle = '#595959'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 0; i < data.length; i++) {
      const x = i * stepX
      const y = height - ((margins[i] - minMargin) / range) * height
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }, [data])

  if (data.length === 0) return null

  return <canvas ref={canvasRef} className={styles.sparkline} />
}

export function SaleFormulaDrawer({ visible, detail, onClose, onApply, rfps, currentRfpId }: SaleFormulaDrawerProps) {
  const [mode, setMode] = useState<FormulaMode>('formula')
  const [variables, setVariables] = useState<FormulaVariable[]>([createEmptyVariable()])
  const [showTemplateChooser, setShowTemplateChooser] = useState(false)

  // Template context
  const { templates } = useFormulaTemplateContext()

  // Load existing formula when detail changes
  useEffect(() => {
    if (detail?.saleFormula) {
      setVariables(detail.saleFormula.variables.map((v) => ({ ...v })))
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
    setShowTemplateChooser(false)
  }, [detail])

  const resolvedPrice = useMemo(() => {
    if (!detail) return null
    return resolveFormulaPrice(variables, detail.product, mode)
  }, [variables, detail, mode])

  const currentMargin = useMemo(() => {
    if (!detail || resolvedPrice === null) return null
    return calculateMarginCpg(resolvedPrice, detail.costPrice)
  }, [resolvedPrice, detail])

  // Intelligence data
  const pastBids = useMemo<PastBidReference[]>(() => {
    if (!detail) return []
    return getPastBidsAtTerminalProduct(rfps, detail.terminal, detail.product, currentRfpId)
  }, [rfps, detail, currentRfpId])

  const outcomeStats = useMemo<TerminalProductStats | null>(() => {
    if (!detail) return null
    return computeTerminalProductStats(rfps, detail.terminal, detail.product, currentRfpId)
  }, [rfps, detail, currentRfpId])

  // Debounced margin history for sparkline
  const [debouncedDiff, setDebouncedDiff] = useState<number>(0)
  useEffect(() => {
    const saleDiff = variables.length > 0 ? variables[0].differential : 0
    const timer = setTimeout(() => setDebouncedDiff(saleDiff), 300)
    return () => clearTimeout(timer)
  }, [variables])

  const marginHistory = useMemo<MarginHistoryPoint[]>(() => {
    if (!detail || !detail.costFormula || detail.costFormula.variables.length === 0) return []
    if (variables.length === 0) return []
    const costDiff = detail.costFormula.variables[0].differential
    return generateMarginHistory(detail.product, costDiff, debouncedDiff, 6)
  }, [detail, debouncedDiff, variables.length])

  const marginHistoryStats = useMemo(() => {
    if (marginHistory.length === 0) return null
    const avgMargin = marginHistory.reduce((s, p) => s + p.marginCpg, 0) / marginHistory.length
    const negativeDays = marginHistory.filter((p) => p.marginCpg < 0).length
    return {
      avgMarginCpg: Math.round(avgMargin * 100) / 100,
      negativeDays,
      totalDays: marginHistory.length,
      negativePct: Math.round((negativeDays / marginHistory.length) * 100),
    }
  }, [marginHistory])

  // ID-based variable update (for VariablesTable)
  const handleVariableUpdate = useCallback((variableId: string, updates: Partial<FormulaVariable>) => {
    setVariables((prev) => prev.map((v) =>
      v.id === variableId ? { ...v, ...updates } : v,
    ))
  }, [])

  const handleAddVariable = useCallback((groupNum?: number) => {
    const newIndex = variables.length + 1
    const group = groupNum || 1
    setVariables((prev) => [...prev, createEmptyVariable(group, newIndex)])
  }, [variables.length])

  // ID-based variable removal (for VariablesTable)
  const handleRemoveVariable = useCallback((variableId: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== variableId))
  }, [])

  const handleModeChange = useCallback((value: string | number) => {
    const newMode = value as FormulaMode
    setMode(newMode)
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

  // Template selection handler
  const handleTemplateSelect = useCallback((template: { components: TemplateComponent[] }) => {
    const newVariables: FormulaVariable[] = template.components.map((comp, index) => {
      const pctStr = String(comp.percentage).replace('%', '').trim()
      const percentage = isPlaceholder(comp.percentage) ? comp.percentage : (parseFloat(pctStr) || 100)

      return {
        id: `var-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
        variableName: `var_${index + 1}_group_1`,
        displayName:
          isPlaceholder(comp.source) || isPlaceholder(comp.instrument)
            ? null
            : `${comp.source} ${comp.instrument}`,
        pricePublisher: comp.source,
        priceInstrument: comp.instrument,
        priceType: comp.type,
        dateRule: comp.dateRule,
        percentage,
        differential: 0,
      }
    })

    setVariables(newVariables)
    setShowTemplateChooser(false)
  }, [])

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
      visible={visible}
      closable={false}
      headerStyle={{ display: 'none' }}
      bodyStyle={{ padding: 0 }}
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
      {showTemplateChooser ? (
        <div className={styles.body} style={{ flexDirection: 'column' }}>
          <TemplateChooser
            templates={templates}
            onTemplateSelect={handleTemplateSelect}
            buildFormulaPreview={buildFormulaPreview}
            showManageButton={false}
            title="Formula Template Chooser"
            subtitle="Select a pre-built formula template to apply to this sale formula."
            onClose={() => setShowTemplateChooser(false)}
            showExternalName={false}
          />
        </div>
      ) : (
        <div className={styles.body}>
          {/* Left Panel - Context + Intelligence */}
          <Vertical className={styles['left-panel']}>
            <Vertical style={{ gap: '16px' }}>
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

              {/* Intelligence Section */}
              <Vertical style={{ gap: '12px', paddingTop: '8px', borderTop: '1px solid #e8e8e8' }}>
                <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
                  Intelligence
                </Texto>

                {/* Past Bids */}
                <Vertical style={{ gap: '6px' }}>
                  <Texto category="p3" weight="500" appearance="medium">
                    Past Bids — {detail.terminal.replace(' Terminal', '')}, {detail.product}
                  </Texto>
                  {pastBids.length > 0 ? (
                    <Vertical style={{ gap: '3px' }}>
                      {pastBids.map((bid) => (
                        <Horizontal key={`${bid.rfpId}-${bid.buyerName}`} alignItems="center" style={{ gap: '5px' }}>
                          <span className={`${styles['outcome-badge']} ${bid.outcome === 'won' ? styles['outcome-won'] : styles['outcome-lost']}`}>
                            {bid.outcome === 'won' ? 'W' : 'L'}
                          </span>
                          <Texto category="p3" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                            {bid.saleFormulaDisplay.length > 22 ? bid.saleFormulaDisplay.slice(0, 22) + '...' : bid.saleFormulaDisplay}
                          </Texto>
                          <Texto category="p3" appearance="medium">&rarr;</Texto>
                          <Texto category="p3" weight="500">{bid.marginCpg.toFixed(1)}¢</Texto>
                          <Texto category="p3" appearance="medium">
                            {bid.buyerName.length > 10 ? bid.buyerName.slice(0, 10) + '...' : bid.buyerName},{' '}
                            {new Date(bid.outcomeDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                          </Texto>
                        </Horizontal>
                      ))}
                    </Vertical>
                  ) : (
                    <Texto category="p3" appearance="medium">
                      No prior bids at {detail.terminal} for {detail.product}.
                    </Texto>
                  )}
                </Vertical>

                {/* Outcome Stats */}
                {outcomeStats && outcomeStats.totalBids >= 2 && (
                  <Vertical style={{ gap: '3px' }}>
                    <Texto category="p3" weight="500" appearance="medium">Outcome Stats</Texto>
                    <Texto category="p3">
                      Win rate: {outcomeStats.winRate}% ({outcomeStats.wonCount} of {outcomeStats.totalBids})
                    </Texto>
                    {outcomeStats.winningDifferentialRange && (
                      <Texto category="p3">
                        Winning diff range: +${outcomeStats.winningDifferentialRange.min.toFixed(3)} to +${outcomeStats.winningDifferentialRange.max.toFixed(3)}
                      </Texto>
                    )}
                    {outcomeStats.avgWinningMarginCpg !== null && (
                      <Texto category="p3">
                        Avg winning margin: {outcomeStats.avgWinningMarginCpg.toFixed(1)}¢/gal
                      </Texto>
                    )}
                    {outcomeStats.avgLosingMarginCpg !== null && (
                      <Texto category="p3">
                        Avg losing margin: {outcomeStats.avgLosingMarginCpg.toFixed(1)}¢/gal
                      </Texto>
                    )}
                  </Vertical>
                )}

                {/* Historical Margin Sparkline */}
                <Vertical style={{ gap: '4px' }}>
                  <Texto category="p3" weight="500" appearance="medium">Historical Margin (6mo)</Texto>
                  {!detail.costFormula ? (
                    <Texto category="p3" appearance="medium">Set cost to see historical margin.</Texto>
                  ) : variables.length === 0 ? (
                    <Texto category="p3" appearance="medium">Configure formula to see historical margin.</Texto>
                  ) : marginHistory.length > 0 ? (
                    <>
                      <MarginSparkline data={marginHistory} />
                      {marginHistoryStats && (
                        <Horizontal alignItems="center" style={{ gap: '4px' }}>
                          <Texto category="p3">6mo avg: {marginHistoryStats.avgMarginCpg.toFixed(1)}¢/gal</Texto>
                          <Texto category="p3" appearance="medium">&middot;</Texto>
                          <Texto category="p3">
                            {marginHistoryStats.negativeDays === 0
                              ? 'No negative margin days'
                              : `Negative: ${marginHistoryStats.negativeDays} days (${marginHistoryStats.negativePct}%)`}
                          </Texto>
                        </Horizontal>
                      )}
                    </>
                  ) : (
                    <Texto category="p3" appearance="medium">Historical data unavailable.</Texto>
                  )}
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
          </Vertical>

          {/* Right Panel - Formula Editor */}
          <Vertical className={styles['right-panel']} style={{ gap: '16px' }}>
            {/* Mode selector + action buttons */}
            <Horizontal alignItems="center" justifyContent="space-between">
              <Segmented
                value={mode}
                onChange={handleModeChange}
                options={MODE_OPTIONS}
                size="small"
              />
              <Horizontal style={{ gap: '8px' }}>
                {detail.costFormula && (
                  <GraviButton
                    buttonText="Copy from Cost"
                    icon={<CopyOutlined />}
                    onClick={handleCopyFromCost}
                  />
                )}
                <GraviButton
                  buttonText="Use Template"
                  icon={<FileTextOutlined />}
                  onClick={() => setShowTemplateChooser(true)}
                />
              </Horizontal>
            </Horizontal>

            {/* Variables Grid */}
            <VariablesTable
              variables={variables}
              onVariableUpdate={handleVariableUpdate}
              onRemoveVariable={handleRemoveVariable}
            />

            <Horizontal style={{ gap: '8px' }}>
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

            {/* Formula Preview */}
            <Vertical style={{ gap: '4px', padding: '12px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
              <Texto category="p3" appearance="medium">Formula Expression</Texto>
              <Texto category="p2" weight="500" style={{ fontFamily: 'monospace' }}>
                {buildFormulaExpression(variables, mode) || 'Configure variables above'}
              </Texto>
            </Vertical>
          </Vertical>
        </div>
      )}

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
