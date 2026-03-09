import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CaretDownOutlined, CloseOutlined, CopyOutlined, SnippetsOutlined, FileTextOutlined } from '@ant-design/icons'
import { Drawer, Input, InputNumber, Segmented } from 'antd'
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

// Enlarged Sparkline with current margin reference line and axis labels
function MarginSparkline({ data, currentMargin }: { data: MarginHistoryPoint[]; currentMargin: number | null }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = container.clientWidth
    const height = 72
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)

    const margins = data.map((d) => d.marginCpg)
    const allValues = [...margins]
    if (currentMargin !== null) allValues.push(currentMargin)
    const maxMargin = Math.max(...allValues, 0.5)
    const minMargin = Math.min(...allValues, -0.5)
    const range = maxMargin - minMargin || 1

    const toY = (val: number) => height - ((val - minMargin) / range) * height
    const zeroY = toY(0)

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
      const y1 = toY(margins[i])
      const y2 = toY(margins[i + 1])

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
      const y = toY(margins[i])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Draw current margin reference line
    if (currentMargin !== null) {
      const refY = toY(currentMargin)
      ctx.strokeStyle = '#1890ff'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(0, refY)
      ctx.lineTo(width - 60, refY)
      ctx.stroke()
      ctx.setLineDash([])

      // Label
      ctx.font = '9px sans-serif'
      ctx.fillStyle = '#1890ff'
      ctx.textAlign = 'left'
      ctx.fillText(`Current: ${currentMargin.toFixed(1)}¢`, width - 58, refY + 3)
    }

    // Axis labels
    ctx.font = '9px sans-serif'
    ctx.fillStyle = '#bfbfbf'
    ctx.textAlign = 'left'
    ctx.fillText(`${maxMargin.toFixed(1)}¢`, 2, 10)
    ctx.fillText(`${minMargin.toFixed(1)}¢`, 2, height - 3)
  }, [data, currentMargin])

  if (data.length === 0) return null

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '72px' }} />
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

export function SaleFormulaDrawer({ visible, detail, onClose, onApply, rfps, currentRfpId }: SaleFormulaDrawerProps) {
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
      open={visible}
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

                {/* §5 — Enlarged Sparkline with Current Margin Reference */}
                <Vertical gap={4}>
                  <Texto category="p3" weight="500" appearance="medium">Historical Margin (6mo)</Texto>
                  {!detail.costFormula ? (
                    <Texto category="p3" appearance="medium">Set cost to see historical margin.</Texto>
                  ) : variables.length === 0 ? (
                    <Texto category="p3" appearance="medium">Configure formula to see historical margin.</Texto>
                  ) : marginHistory.length > 0 ? (
                    <>
                      <MarginSparkline data={marginHistory} currentMargin={currentMargin} />
                      {marginHistoryStats && (
                        <Vertical gap={2}>
                          <Horizontal gap={4} alignItems="center">
                            <Texto category="p3" style={{ fontSize: '11px' }}>6mo avg: {marginHistoryStats.avgMarginCpg.toFixed(1)}¢/gal</Texto>
                            <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>&middot;</Texto>
                            <Texto category="p3" style={{ fontSize: '11px' }}>
                              {marginHistoryStats.negativeDays === 0
                                ? 'No negative margin days'
                                : `Negative: ${marginHistoryStats.negativeDays}d (${marginHistoryStats.negativePct}%)`}
                            </Texto>
                          </Horizontal>
                          {currentMargin !== null && (
                            <Texto
                              category="p3"
                              style={{
                                fontSize: '11px',
                                color: currentMargin >= marginHistoryStats.avgMarginCpg ? '#52c41a' : '#ff4d4f',
                              }}
                            >
                              Current vs avg: {currentMargin >= marginHistoryStats.avgMarginCpg ? '+' : ''}{(currentMargin - marginHistoryStats.avgMarginCpg).toFixed(1)}¢
                            </Texto>
                          )}
                        </Vertical>
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
