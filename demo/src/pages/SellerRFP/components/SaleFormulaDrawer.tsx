import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CaretDownOutlined, CloseOutlined, CopyOutlined, SnippetsOutlined, FileTextOutlined } from '@ant-design/icons'
import { Drawer, Input, InputNumber, Segmented } from 'antd'
import type { SellerRFP, SellerRFPDetail, Formula, FormulaVariable, PastBidReference, TerminalProductStats, DiffHistoryPoint } from '../types/sellerRfp.types'
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
  generateDiffHistory,
} from '../data/sellerRfp.data'
import { VariablesTable } from '../../ContractManagement/quick-entry/components/formula/VariablesTable'
import { TemplateChooser } from '../../../components/shared/TemplateChooser'
import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext'
import { buildFormulaPreview, isPlaceholder } from '../../demos/grids/FormulaTemplates.data'
import type { TemplateComponent } from '../../demos/grids/FormulaTemplates.data'
import styles from './SaleFormulaDrawer.module.css'

interface SaleFormulaDrawerProps {
  open: boolean
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

// Weekly margin history chart with labeled axes.
function DiffSparkline({ data }: { data: DiffHistoryPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const cssWidth = container.clientWidth
    const cssHeight = 180
    canvas.width = cssWidth * dpr
    canvas.height = cssHeight * dpr
    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${cssHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cssWidth, cssHeight)

    // Plot area insets: leave room for Y axis title + labels, X axis title + labels, and the Current label.
    const padLeft = 58
    const padRight = 16
    const padTop = 22
    const padBottom = 42
    const plotW = cssWidth - padLeft - padRight
    const plotH = cssHeight - padTop - padBottom
    const plotX = padLeft
    const plotY = padTop

    const diffs = data.map((d) => d.diff)
    // Keep Y scale fixed to the simulation range so the chart reads consistently across modes.
    const yMin = Math.min(0.0001, ...diffs)
    const yMax = Math.max(0.0565, ...diffs)
    const range = yMax - yMin || 1

    const toX = (i: number) => plotX + (plotW * i) / Math.max(1, data.length - 1)
    const toY = (val: number) => plotY + plotH - ((val - yMin) / range) * plotH

    // Horizontal gridlines + Y axis tick labels
    const yTickCount = 4
    ctx.font = '10px sans-serif'
    ctx.textBaseline = 'middle'
    for (let i = 0; i <= yTickCount; i++) {
      const val = yMin + ((yMax - yMin) * i) / yTickCount
      const y = toY(val)
      ctx.strokeStyle = '#f0f0f0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(plotX, y)
      ctx.lineTo(plotX + plotW, y)
      ctx.stroke()
      ctx.fillStyle = '#8c8c8c'
      ctx.textAlign = 'right'
      ctx.fillText(`$${val.toFixed(4)}`, plotX - 6, y)
    }

    // "Margin ($)" axis title above the Y axis column
    ctx.fillStyle = '#595959'
    ctx.font = '600 11px sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('Margin ($)', plotX - 6, plotY - 8)

    // Filled area under the line
    ctx.fillStyle = 'rgba(24, 144, 255, 0.12)'
    ctx.beginPath()
    ctx.moveTo(toX(0), plotY + plotH)
    for (let i = 0; i < data.length; i++) ctx.lineTo(toX(i), toY(diffs[i]))
    ctx.lineTo(toX(data.length - 1), plotY + plotH)
    ctx.closePath()
    ctx.fill()

    // Diff line
    ctx.strokeStyle = '#1f4e96'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < data.length; i++) {
      const x = toX(i)
      const y = toY(diffs[i])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Data point markers
    ctx.fillStyle = '#1f4e96'
    for (let i = 0; i < data.length; i++) {
      ctx.beginPath()
      ctx.arc(toX(i), toY(diffs[i]), 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // X axis weekly tick labels — skip points to avoid crowding, clamp edge labels so
    // the first/last don't bleed past the plot boundary.
    const labelStep = Math.max(1, Math.ceil(data.length / 6))
    ctx.font = '10px sans-serif'
    ctx.fillStyle = '#8c8c8c'
    ctx.textBaseline = 'top'
    for (let i = 0; i < data.length; i += labelStep) {
      const d = new Date(data[i].date)
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const isFirst = i === 0
      const isLast = i >= data.length - labelStep
      ctx.textAlign = isFirst ? 'left' : isLast ? 'right' : 'center'
      ctx.fillText(label, toX(i), plotY + plotH + 6)
    }
    // X axis title — centered under the plot, on its own line below tick labels
    ctx.font = '600 11px sans-serif'
    ctx.fillStyle = '#595959'
    ctx.textAlign = 'center'
    ctx.fillText('Weekly', plotX + plotW / 2, plotY + plotH + 24)
  }, [data])

  if (data.length === 0) return null

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '180px' }} />
    </div>
  )
}

// Past bid card component
function BidCard({ bid }: { bid: PastBidReference }) {
  return (
    <div className={styles['bid-card']}>
      <Horizontal gap={5} alignItems="center">
        <span className={`${styles['outcome-badge']} ${bid.outcome === 'won' ? styles['outcome-won'] : styles['outcome-lost']}`}>
          {bid.outcome === 'won' ? 'W' : 'L'}
        </span>
        <Texto category="p3" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
          {bid.saleFormulaDisplay.length > 45 ? bid.saleFormulaDisplay.slice(0, 42) + '...' : bid.saleFormulaDisplay}
        </Texto>
      </Horizontal>
      <Horizontal alignItems="center" gap={4} style={{ paddingLeft: '21px' }}>
        <Texto category="p3" weight="500" style={{ fontSize: '11px' }}>{bid.marginCpg.toFixed(1)}¢</Texto>
        <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>&middot;</Texto>
        <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>
          {bid.buyerName.length > 18 ? bid.buyerName.slice(0, 18) + '...' : bid.buyerName}
        </Texto>
        <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>&middot;</Texto>
        <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>
          {new Date(bid.outcomeDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
        </Texto>
      </Horizontal>
    </div>
  )
}

// Win rate progress bar
function WinRateBar({ stats }: { stats: TerminalProductStats }) {
  const lostCount = stats.totalBids - stats.wonCount
  return (
    <Vertical gap={4}>
      <Texto category="p3" weight="500" style={{ fontSize: '11px' }}>
        {stats.wonCount}W / {lostCount}L ({stats.winRate}%)
      </Texto>
      <div className={styles['winrate-bar']}>
        <div className={styles['winrate-fill']} style={{ width: `${stats.winRate}%` }} />
      </div>
    </Vertical>
  )
}

export function SaleFormulaDrawer({ open, detail, onClose, onApply, rfps, currentRfpId }: SaleFormulaDrawerProps) {
  const [mode, setMode] = useState<FormulaMode>('formula')
  const [variables, setVariables] = useState<FormulaVariable[]>([createEmptyVariable()])
  const [showTemplateChooser, setShowTemplateChooser] = useState(false)
  const [displayNameOverride, setDisplayNameOverride] = useState<string | null>(null)
  const [showAllBids, setShowAllBids] = useState(false)
  const [localFormulaDiff, setLocalFormulaDiff] = useState<number | null>(null)

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
      const detectedMode: FormulaMode = groupNums.size >= 3 ? 'lower-of-3' : groupNums.size >= 2 ? 'lower-of-2' : 'formula'
      setMode(detectedMode)

      // Check if name differs from auto-generated expression (i.e. user override)
      const autoExpression = buildFormulaExpression(detail.saleFormula.variables, detectedMode)
      const autoName = autoExpression.length > 50 ? autoExpression.slice(0, 47) + '...' : autoExpression
      if (detail.saleFormula.name && detail.saleFormula.name !== autoName) {
        setDisplayNameOverride(detail.saleFormula.name)
      } else {
        setDisplayNameOverride(null)
      }
    } else {
      setVariables([createEmptyVariable()])
      setMode('formula')
      setDisplayNameOverride(null)
    }
    setLocalFormulaDiff(detail?.formulaDiff ?? null)
    setShowTemplateChooser(false)
    setShowAllBids(false)
  }, [detail])

  const resolvedPrice = useMemo(() => {
    if (!detail) return null
    return resolveFormulaPrice(variables, detail.product, mode)
  }, [variables, detail, mode])

  const effectiveSalePrice = useMemo(() => {
    if (resolvedPrice === null) return null
    return Math.round((resolvedPrice + (localFormulaDiff ?? 0)) * 10000) / 10000
  }, [resolvedPrice, localFormulaDiff])

  const currentMargin = useMemo(() => {
    if (!detail || effectiveSalePrice === null) return null
    return calculateMarginCpg(effectiveSalePrice, detail.costPrice)
  }, [effectiveSalePrice, detail])

  // Intelligence data
  const pastBids = useMemo<PastBidReference[]>(() => {
    if (!detail) return []
    return getPastBidsAtTerminalProduct(rfps, detail.terminal, detail.product, currentRfpId)
  }, [rfps, detail, currentRfpId])

  const outcomeStats = useMemo<TerminalProductStats | null>(() => {
    if (!detail) return null
    return computeTerminalProductStats(rfps, detail.terminal, detail.product, currentRfpId)
  }, [rfps, detail, currentRfpId])

  const diffHistory = useMemo<DiffHistoryPoint[]>(() => {
    if (!detail) return []
    if (variables.length === 0) return []
    return generateDiffHistory(detail.product, 6)
  }, [detail, variables.length])

  const diffHistoryStats = useMemo(() => {
    if (diffHistory.length === 0) return null
    const avg = diffHistory.reduce((s, p) => s + p.diff, 0) / diffHistory.length
    const min = Math.min(...diffHistory.map((p) => p.diff))
    const max = Math.max(...diffHistory.map((p) => p.diff))
    return {
      avgDiff: Math.round(avg * 10000) / 10000,
      minDiff: Math.round(min * 10000) / 10000,
      maxDiff: Math.round(max * 10000) / 10000,
      totalWeeks: diffHistory.length,
    }
  }, [diffHistory])

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
    const name = displayNameOverride?.trim()
      || (expression.length > 50 ? expression.slice(0, 47) + '...' : expression)
    const formula: Formula = {
      id: detail.saleFormula?.id || `formula-sale-${Date.now()}`,
      name,
      expression,
      variables: [...variables],
    }

    const resolved = resolveFormulaPrice(variables, detail.product, mode)
    const salePriceWithDiff = resolved !== null ? Math.round((resolved + (localFormulaDiff ?? 0)) * 10000) / 10000 : null
    const margin = calculateMarginCpg(salePriceWithDiff, detail.costPrice)

    onApply({
      ...detail,
      saleFormula: formula,
      formulaDiff: localFormulaDiff,
      salePrice: salePriceWithDiff,
      margin,
    })
  }, [detail, variables, mode, onApply, displayNameOverride, localFormulaDiff])

  if (!detail) return null

  const marginColor = getMarginColor(currentMargin)
  const marginColorValue = marginColor === 'green' ? '#52c41a' : marginColor === 'yellow' ? '#faad14' : marginColor === 'red' ? '#ff4d4f' : '#8c8c8c'

  // Past bids display logic
  const visibleBids = showAllBids ? pastBids : pastBids.slice(0, 4)
  const hiddenBidCount = pastBids.length - 4

  return (
    <Drawer
      placement="bottom"
      height={720}
      open={open}
      closable={false}
      headerStyle={{ display: 'none' }}
      styles={{ body: { padding: 0 } }}
      className={styles.drawer}
    >
      {/* Header — now includes product, terminal, volume */}
      <Horizontal className={styles.header} alignItems="center" justifyContent="space-between">
        <Horizontal alignItems="center" gap={12} style={{ minWidth: 0 }}>
          <button className={styles['collapse-toggle']} onClick={onClose}>
            <CaretDownOutlined />
          </button>
          <Texto category="p1" weight="600" style={{ flexShrink: 0 }}>Sale Formula Editor</Texto>
          <span className={styles['row-badge']} title={`${detail.product} — ${detail.terminal}`}>
            {detail.product} — {detail.terminal}
          </span>
          {detail.volume && (
            <span className={styles['volume-badge']}>
              {(detail.volume / 1000).toFixed(0)}K gal/mo
            </span>
          )}
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
          {/* Left Panel - Pricing + Intelligence */}
          <Vertical className={styles['left-panel']}>
            <Vertical gap={16}>

              {/* §1 — Consolidated Pricing Summary */}
              <Vertical gap={10}>
                <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
                  Pricing
                </Texto>
                <Horizontal gap={1} style={{ backgroundColor: '#e8e8e8', borderRadius: '6px', overflow: 'hidden' }}>
                  {/* Cost */}
                  <Vertical gap={2} style={{ flex: 1, padding: '8px', backgroundColor: '#fff' }}>
                    <Texto category="p3" appearance="medium" style={{ fontSize: '10px' }}>Cost</Texto>
                    <Texto category="p1" weight="600">{formatPrice(detail.costPrice)}</Texto>
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
                  </Vertical>
                  {/* Sale */}
                  <Vertical gap={2} style={{ flex: 1, padding: '8px', backgroundColor: '#fff' }}>
                    <Texto category="p3" appearance="medium" style={{ fontSize: '10px' }}>Sale</Texto>
                    <Texto category="p1" weight="600">
                      {effectiveSalePrice !== null ? formatPrice(effectiveSalePrice) : '—'}
                    </Texto>
                  </Vertical>
                  {/* Margin */}
                  <Vertical gap={2} style={{ flex: 1, padding: '8px', backgroundColor: '#fff' }}>
                    <Texto category="p3" appearance="medium" style={{ fontSize: '10px' }}>Margin</Texto>
                    <Texto category="p1" weight="600" style={{ color: marginColorValue }}>
                      {formatMarginCpg(currentMargin)}
                    </Texto>
                  </Vertical>
                </Horizontal>
              </Vertical>

              {/* §3 + §4 — Intelligence Section */}
              <Vertical gap={12} style={{ paddingTop: '8px', borderTop: '1px solid #e8e8e8' }}>
                <Texto category="p2" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
                  Intelligence
                </Texto>

                {/* Past Bids as Stacked Cards */}
                <Vertical gap={6}>
                  <Texto category="p3" weight="500" appearance="medium">
                    Past Bids — {detail.terminal.replace(' Terminal', '')}, {detail.product}
                  </Texto>
                  {pastBids.length > 0 ? (
                    <Vertical gap={4}>
                      {visibleBids.map((bid) => (
                        <BidCard key={`${bid.rfpId}-${bid.buyerName}`} bid={bid} />
                      ))}
                      {!showAllBids && hiddenBidCount > 0 && (
                        <button
                          className={styles['show-more']}
                          onClick={() => setShowAllBids(true)}
                        >
                          Show {hiddenBidCount} more
                        </button>
                      )}
                      {showAllBids && pastBids.length > 4 && (
                        <button
                          className={styles['show-more']}
                          onClick={() => setShowAllBids(false)}
                        >
                          Show less
                        </button>
                      )}
                    </Vertical>
                  ) : (
                    <Texto category="p3" appearance="medium">
                      No prior bids at {detail.terminal} for {detail.product}.
                    </Texto>
                  )}
                </Vertical>

                {/* Win Rate Visual + Outcome Stats */}
                {outcomeStats && outcomeStats.totalBids >= 2 && (
                  <Vertical gap={8}>
                    <WinRateBar stats={outcomeStats} />

                    {outcomeStats.winningDifferentialRange && (
                      <div className={styles['winning-range']}>
                        <Texto category="p3" weight="600" style={{ fontSize: '12px' }}>
                          Winning range: +${outcomeStats.winningDifferentialRange.min.toFixed(3)} to +${outcomeStats.winningDifferentialRange.max.toFixed(3)}
                        </Texto>
                      </div>
                    )}

                    <Horizontal alignItems="center" gap={4} style={{ flexWrap: 'wrap' }}>
                      {outcomeStats.avgWinningMarginCpg !== null && (
                        <Texto category="p3" style={{ color: '#52c41a', fontSize: '11px' }}>
                          Avg win: {outcomeStats.avgWinningMarginCpg.toFixed(1)}¢/gal
                        </Texto>
                      )}
                      {outcomeStats.avgWinningMarginCpg !== null && outcomeStats.avgLosingMarginCpg !== null && (
                        <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>&middot;</Texto>
                      )}
                      {outcomeStats.avgLosingMarginCpg !== null && (
                        <Texto category="p3" style={{ color: '#ff4d4f', fontSize: '11px' }}>
                          Avg loss: {outcomeStats.avgLosingMarginCpg.toFixed(1)}¢/gal
                        </Texto>
                      )}
                    </Horizontal>
                  </Vertical>
                )}

                {/* §5 — Weekly Margin history */}
                <Vertical gap={6}>
                  <Texto category="p3" weight="500" appearance="medium">Historical Margin (6mo, weekly)</Texto>
                  {variables.length === 0 ? (
                    <Texto category="p3" appearance="medium">Configure formula to see historical margin.</Texto>
                  ) : diffHistory.length > 0 ? (
                    <>
                      <DiffSparkline data={diffHistory} />
                      {diffHistoryStats && (
                        <Horizontal gap={4} alignItems="center" style={{ flexWrap: 'wrap' }}>
                          <Texto category="p3" style={{ fontSize: '11px' }}>
                            6mo avg: ${diffHistoryStats.avgDiff.toFixed(4)}
                          </Texto>
                          <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>&middot;</Texto>
                          <Texto category="p3" style={{ fontSize: '11px' }}>
                            Range: ${diffHistoryStats.minDiff.toFixed(4)} – ${diffHistoryStats.maxDiff.toFixed(4)}
                          </Texto>
                        </Horizontal>
                      )}
                    </>
                  ) : (
                    <Texto category="p3" appearance="medium">Historical data unavailable.</Texto>
                  )}
                </Vertical>
              </Vertical>
            </Vertical>
          </Vertical>

          {/* Right Panel - Formula Editor */}
          <Vertical gap={16} className={styles['right-panel']}>
            {/* Mode selector + action buttons */}
            <Horizontal alignItems="center" justifyContent="space-between">
              <Segmented
                value={mode}
                onChange={handleModeChange}
                options={MODE_OPTIONS}
                size="small"
              />
              <Horizontal gap={8}>
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

            {/* Display Name Override */}
            <Vertical gap={4}>
              <Horizontal gap={6} alignItems="center">
                <Texto category="p3" appearance="medium">Display Name</Texto>
                <Texto category="p3" appearance="medium" style={{ fontSize: '10px', color: '#bfbfbf' }}>
                  Optional
                </Texto>
              </Horizontal>
              <Input
                size="small"
                placeholder="Override auto-generated expression label"
                value={displayNameOverride || ''}
                onChange={(e) => setDisplayNameOverride(e.target.value || null)}
                allowClear
                maxLength={80}
                style={{ fontFamily: 'monospace' }}
              />
            </Vertical>

            {/* Variables Grid */}
            <VariablesTable
              variables={variables}
              onVariableUpdate={handleVariableUpdate}
              onRemoveVariable={handleRemoveVariable}
            />

            <Horizontal gap={8}>
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
            <Vertical gap={4} style={{ padding: '12px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
              <Horizontal alignItems="center" justifyContent="space-between">
                <Texto category="p3" appearance="medium">Formula Expression</Texto>
                {displayNameOverride && (
                  <Texto category="p3" appearance="medium" style={{ color: '#1890ff', fontSize: '10px' }}>
                    CUSTOM NAME
                  </Texto>
                )}
              </Horizontal>
              {displayNameOverride ? (
                <Vertical gap={2}>
                  <Texto category="p2" weight="600">{displayNameOverride}</Texto>
                  <Texto category="p3" appearance="medium" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                    {buildFormulaExpression(variables, mode) || 'Configure variables above'}
                  </Texto>
                </Vertical>
              ) : (
                <Texto category="p2" weight="500" style={{ fontFamily: 'monospace' }}>
                  {buildFormulaExpression(variables, mode) || 'Configure variables above'}
                </Texto>
              )}
            </Vertical>

            {/* Formula Diff Input */}
            <Vertical gap={4}>
              <Horizontal gap={6} alignItems="center">
                <Texto category="p3" appearance="medium">Formula Diff</Texto>
                <Texto category="p3" appearance="medium" style={{ fontSize: '10px', color: '#bfbfbf' }}>
                  Applied to resolved formula price
                </Texto>
              </Horizontal>
              <InputNumber
                size="small"
                prefix="$"
                precision={4}
                step={0.001}
                value={localFormulaDiff}
                onChange={(value) => setLocalFormulaDiff(value)}
                placeholder="0.0000"
                style={{ width: '160px', fontFamily: 'monospace' }}
              />
            </Vertical>
          </Vertical>
        </div>
      )}

      {/* Footer */}
      <Horizontal className={styles.footer} justifyContent="space-between" alignItems="center">
        <Horizontal gap={8}>
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
