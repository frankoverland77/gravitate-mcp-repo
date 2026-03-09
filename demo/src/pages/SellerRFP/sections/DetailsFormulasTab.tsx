import { useMemo, useCallback, useRef } from 'react'
import { Vertical, Horizontal, Texto, GraviGrid, GraviButton, BBDTag } from '@gravitate-js/excalibrr'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Select, Tooltip } from 'antd'
import type { ColDef, ColGroupDef, ICellRendererParams, ValueGetterParams, GetContextMenuItemsParams } from 'ag-grid-community'
import type { SellerRFP, SellerRFPDetail, RFPRoundHistory, Formula, FormulaVariable, BenchmarkType } from '../types/sellerRfp.types'
import {
  COST_TYPE_LABELS,
  COST_TYPE_COLORS,
  DETAIL_STATUS_LABELS,
  BENCHMARK_LABELS,
  BENCHMARK_TYPES,
  formatPrice,
  formatMarginCpg,
  formatFormulaDiff,
  formatFormulaDisplay,
  formatBenchmarkDelta,
  getBenchmarkDeltaColor,
  getMarginColor,
  calculateMarginCpg,
  formatVolume,
  formatVolumeTotal,
  getAvailabilityColor,
} from '../types/sellerRfp.types'
import { CostTypePopover } from '../components/CostTypePopover'
import { AvailabilityPopover } from '../components/AvailabilityPopover'
import { SaleFormulaDrawer } from '../components/SaleFormulaDrawer'
import { SELLER_PRODUCTS, SELLER_TERMINALS, SAMPLE_SUPPLY_AGREEMENTS, SAMPLE_INVENTORY_CAPACITY, computeDetailAvailability, resolveBenchmarkPrice, calculateBenchmarkDelta } from '../data/sellerRfp.data'
import styles from './DetailsFormulasTab.module.css'

// Helpers for fill-handle formula copy
const FILL_BASE_PRICES: Record<string, number> = {
  '87 Octane': 2.30, '89 Octane': 2.34, '93 Octane': 2.42, 'ULSD': 2.26, 'Kerosene': 2.31,
}

function resolveFormulaPrice(variables: FormulaVariable[], product: string): number | null {
  if (variables.length === 0) return null
  const base = FILL_BASE_PRICES[product] || 2.30
  return variables.reduce((sum, v) => {
    const pct = typeof v.percentage === 'number' ? v.percentage / 100 : 1
    return sum + (base + v.differential) * pct
  }, 0)
}

function cloneFormula(formula: Formula): Formula {
  return {
    ...formula,
    id: `formula-fill-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    variables: formula.variables.map((v) => ({
      ...v,
      id: `var-fill-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    })),
  }
}

function createBenchmarkColumnPair(benchmarkType: BenchmarkType): ColDef[] {
  const label = BENCHMARK_LABELS[benchmarkType]
  return [
    {
      headerName: label,
      colId: `benchmark-${benchmarkType}`,
      width: 120,
      hide: true,
      sortable: true,
      valueGetter: (params: ValueGetterParams) => {
        const detail = params.data as SellerRFPDetail
        if (!detail?.product) return null
        return resolveBenchmarkPrice(detail.product, benchmarkType)
      },
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value as number | null
        return <span>{formatPrice(value)}</span>
      },
    },
    {
      headerName: `${label} Δ`,
      colId: `benchmark-delta-${benchmarkType}`,
      width: 120,
      hide: true,
      sortable: true,
      valueGetter: (params: ValueGetterParams) => {
        const detail = params.data as SellerRFPDetail
        if (!detail?.product || detail.salePrice === null) return null
        return calculateBenchmarkDelta(detail.salePrice, detail.product, benchmarkType)
      },
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value as number | null
        const color = getBenchmarkDeltaColor(value)
        return (
          <span style={{ color, fontWeight: 600 }}>
            {formatBenchmarkDelta(value)}
          </span>
        )
      },
    },
  ]
}

function getPriorRoundValue(
  rounds: RFPRoundHistory[],
  roundNumber: number,
  detailId: string,
  field: 'salePrice' | 'margin'
): number | null {
  const roundHistory = rounds.find(r => r.round === roundNumber)
  if (!roundHistory?.detailSnapshot) return null
  const priorDetail = roundHistory.detailSnapshot.find(d => d.id === detailId)
  if (!priorDetail) return null
  return priorDetail[field]
}

interface DetailsFormulasTabProps {
  rfp: SellerRFP
  rfps: SellerRFP[]
  onDetailUpdate: (detail: SellerRFPDetail) => void
  onDetailsReplace: (details: SellerRFPDetail[]) => void
  onOpenSaleFormula: (detailId: string) => void
  onCloseSaleFormula: () => void
  saleFormulaDrawerOpen: boolean
  activeDetail: SellerRFPDetail | null
}

export function DetailsFormulasTab({
  rfp,
  rfps,
  onDetailUpdate,
  onDetailsReplace,
  onOpenSaleFormula,
  onCloseSaleFormula,
  saleFormulaDrawerOpen,
  activeDetail,
}: DetailsFormulasTabProps) {
  // Clipboard ref for formula copy/paste
  const formulaClipboardRef = useRef<Formula | null>(null)

  // Round diff tracking
  const hasRoundDiffs = rfp.currentRound > 1

  // Cost Type cell renderer
  const costTypeRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null

    if (!detail.costType) {
      return (
        <CostTypePopover detail={detail} onUpdate={onDetailUpdate}>
          <span className={styles['click-to-configure']}>Set cost type...</span>
        </CostTypePopover>
      )
    }

    const colors = COST_TYPE_COLORS[detail.costType]
    return (
      <CostTypePopover detail={detail} onUpdate={onDetailUpdate}>
        <span
          className={styles['cost-tag']}
          style={{ color: colors.color, backgroundColor: colors.background, cursor: 'pointer' }}
        >
          {COST_TYPE_LABELS[detail.costType]}
        </span>
      </CostTypePopover>
    )
  }, [onDetailUpdate])

  // Cost Formula renderer
  const costFormulaRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail?.costFormula) return <span className={styles['cell-empty']}>—</span>
    return (
      <Tooltip title={detail.costFormula.expression}>
        <span className={styles['formula-display']}>{formatFormulaDisplay(detail.costFormula)}</span>
      </Tooltip>
    )
  }, [])

  // Sale Formula renderer
  const saleFormulaRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null

    if (!detail.saleFormula) {
      return (
        <span
          className={styles['click-to-configure']}
          onClick={() => onOpenSaleFormula(detail.id)}
        >
          Click to configure...
        </span>
      )
    }

    const displayText = formatFormulaDisplay(detail.saleFormula)
    return (
      <span
        className={styles['formula-link']}
        onClick={() => onOpenSaleFormula(detail.id)}
      >
        {displayText}
      </span>
    )
  }, [onOpenSaleFormula])

  // Price renderers
  const priceRenderer = useCallback((params: ICellRendererParams) => {
    const value = params.value as number | null
    return <span>{formatPrice(value)}</span>
  }, [])

  // Margin renderer with color and round diff
  const marginRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null

    const color = getMarginColor(detail.margin)
    const colorMap = { green: '#52c41a', yellow: '#faad14', red: '#ff4d4f', neutral: '#8c8c8c' }

    const display = (
      <span style={{ color: colorMap[color], fontWeight: 600 }}>
        {formatMarginCpg(detail.margin)}
      </span>
    )

    if (hasRoundDiffs && detail.priorRoundValues?.margin != null && detail.margin != null) {
      const diff = detail.margin - detail.priorRoundValues.margin

      // Build multi-round progression tooltip
      const advancedRounds = rfp.rounds.filter(r => r.adjudication === 'advanced')
      let tooltipText: string

      if (advancedRounds.length >= 2) {
        // Round 3+: show full progression
        const parts: string[] = []
        for (const r of advancedRounds) {
          const rMargin = getPriorRoundValue(rfp.rounds, r.round, detail.id, 'margin')
          if (rMargin != null) {
            parts.push(`R${r.round}: ${formatMarginCpg(rMargin)}`)
          }
        }
        parts.push(`R${rfp.currentRound}: ${formatMarginCpg(detail.margin)}`)
        const lastDiff = diff >= 0 ? `+${formatMarginCpg(diff)}` : formatMarginCpg(diff)
        tooltipText = `${parts.join(' → ')} (R${rfp.currentRound - 1}→R${rfp.currentRound}: ${lastDiff})`
      } else {
        // Round 2: simple comparison
        tooltipText = `R${rfp.currentRound - 1}: ${formatMarginCpg(detail.priorRoundValues.margin)} → R${rfp.currentRound}: ${formatMarginCpg(detail.margin)} (${diff >= 0 ? '+' : ''}${formatMarginCpg(diff)})`
      }

      return (
        <Tooltip title={tooltipText}>
          <Horizontal gap={4} alignItems="center">
            {display}
            <span className={styles['diff-indicator']} style={{ color: diff >= 0 ? '#52c41a' : '#ff4d4f' }}>
              {diff >= 0 ? '▲' : '▼'}
            </span>
          </Horizontal>
        </Tooltip>
      )
    }

    return display
  }, [hasRoundDiffs, rfp.currentRound, rfp.rounds])

  // Volume renderer (editable)
  const volumeRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null
    return <span>{formatVolume(detail.volume)}</span>
  }, [])

  // Availability color map
  const availColorMap = { green: '#52c41a', amber: '#faad14', red: '#ff4d4f', neutral: '#8c8c8c' }

  // Net Avail/mo renderer
  const netAvailMonthRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null

    const avail = computeDetailAvailability(detail, rfp.terms, SAMPLE_SUPPLY_AGREEMENTS, SAMPLE_INVENTORY_CAPACITY)

    if (!detail.costType) {
      return (
        <Tooltip title="Select a cost type to view supply availability">
          <span style={{ color: '#8c8c8c', fontStyle: 'italic', fontSize: '12px' }}>Set cost type</span>
        </Tooltip>
      )
    }

    if (detail.costType === 'estimated') {
      return (
        <Tooltip title="No committed supply for estimated/spot cost type">
          <span style={{ color: '#8c8c8c' }}>—</span>
        </Tooltip>
      )
    }

    const color = getAvailabilityColor(avail.netPerMonth, detail.volume)
    const displayValue = avail.hasVolume ? avail.netPerMonth : avail.availablePerMonth

    return (
      <AvailabilityPopover detail={detail} avail={avail}>
        <span style={{ color: availColorMap[color], fontWeight: 600, cursor: 'pointer' }}>
          {formatVolume(displayValue)}
        </span>
      </AvailabilityPopover>
    )
  }, [rfp.terms])

  // Net Avail/Term renderer
  const netAvailTermRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null

    const avail = computeDetailAvailability(detail, rfp.terms, SAMPLE_SUPPLY_AGREEMENTS, SAMPLE_INVENTORY_CAPACITY)

    if (!avail.hasCostType || detail.costType === 'estimated') {
      return <span style={{ color: '#8c8c8c' }}>—</span>
    }

    if (detail.costType === null) {
      return <span style={{ color: '#8c8c8c' }}>—</span>
    }

    if (!avail.hasContractDates || avail.netPerTerm === null) {
      return (
        <Tooltip title="Set contract dates in Terms tab">
          <span style={{ color: '#8c8c8c' }}>—</span>
        </Tooltip>
      )
    }

    const color = getAvailabilityColor(avail.netPerMonth, detail.volume)
    const displayValue = avail.hasVolume ? avail.netPerTerm : (avail.availablePerMonth !== null && avail.contractMonths !== null ? avail.availablePerMonth * avail.contractMonths : null)

    return (
      <span style={{ color: availColorMap[color], fontWeight: 600 }}>
        {formatVolumeTotal(displayValue)}
      </span>
    )
  }, [rfp.terms])

  // Status renderer
  const statusRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null
    const status = detail.status
    return (
      <BBDTag
        success={status === 'ready'}
        warning={status === 'in-progress'}
      >
        {DETAIL_STATUS_LABELS[status]}
      </BBDTag>
    )
  }, [])

  // Product cell renderer — dropdown for unconfigured rows
  const productRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null
    if (detail.product) return <span>{detail.product}</span>
    return (
      <Select
        size="small"
        placeholder="Select product..."
        style={{ width: '100%' }}
        options={SELLER_PRODUCTS.map((p) => ({ value: p, label: p }))}
        onClick={(e) => e.stopPropagation()}
        onChange={(value) => onDetailUpdate({ ...detail, product: value })}
      />
    )
  }, [onDetailUpdate])

  // Terminal cell renderer — dropdown for unconfigured rows
  const terminalRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null
    if (detail.terminal) return <span>{detail.terminal}</span>
    return (
      <Select
        size="small"
        placeholder="Select terminal..."
        style={{ width: '100%' }}
        options={SELLER_TERMINALS.map((t) => ({ value: t, label: t }))}
        onClick={(e) => e.stopPropagation()}
        onChange={(value) => onDetailUpdate({ ...detail, terminal: value })}
      />
    )
  }, [onDetailUpdate])

  // Delete action renderer
  const deleteRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null
    return (
      <DeleteOutlined
        style={{ color: '#8c8c8c', cursor: 'pointer', fontSize: 14 }}
        onClick={(e) => {
          e.stopPropagation()
          onDetailsReplace(rfp.details.filter((d) => d.id !== detail.id))
        }}
      />
    )
  }, [rfp.details, onDetailsReplace])

  // Generate prior round columns dynamically
  const advancedRounds = useMemo(
    () => rfp.rounds.filter(r => r.adjudication === 'advanced'),
    [rfp.rounds],
  )

  const priorRoundColumns: ColDef[] = useMemo(() => {
    return advancedRounds.flatMap((roundHistory): ColDef[] => {
      const rn = roundHistory.round
      return [
        {
          headerName: `R${rn} Sale`,
          colId: `prior-r${rn}-sale`,
          width: 100,
          sortable: true,
          editable: false,
          valueGetter: (params: ValueGetterParams) => {
            const detail = params.data as SellerRFPDetail
            if (!detail) return null
            return getPriorRoundValue(rfp.rounds, rn, detail.id, 'salePrice')
          },
          cellRenderer: (params: ICellRendererParams) => {
            const value = params.value as number | null
            return <span style={{ color: '#8c8c8c' }}>{value != null ? formatPrice(value) : '—'}</span>
          },
        },
        {
          headerName: `R${rn} Margin`,
          colId: `prior-r${rn}-margin`,
          width: 100,
          sortable: true,
          editable: false,
          valueGetter: (params: ValueGetterParams) => {
            const detail = params.data as SellerRFPDetail
            if (!detail) return null
            return getPriorRoundValue(rfp.rounds, rn, detail.id, 'margin')
          },
          cellRenderer: (params: ICellRendererParams) => {
            const value = params.value as number | null
            if (value == null) return <span style={{ color: '#8c8c8c' }}>—</span>
            const color = getMarginColor(value)
            const colorMap = { green: '#52c41a', yellow: '#faad14', red: '#ff4d4f', neutral: '#8c8c8c' }
            return (
              <span style={{ color: colorMap[color], fontWeight: 600, opacity: 0.6 }}>
                {formatMarginCpg(value)}
              </span>
            )
          },
        },
      ]
    })
  }, [advancedRounds, rfp.rounds])

  const priorRoundGroup: ColGroupDef[] = useMemo(() => {
    if (priorRoundColumns.length === 0) return []
    return [{
      headerName: 'Prior Rounds',
      headerClass: styles['prior-rounds-header'],
      children: priorRoundColumns,
    }]
  }, [priorRoundColumns])

  const columnDefs: (ColDef | ColGroupDef)[] = useMemo(
    () => [
      { headerName: 'Product', field: 'product', width: 140, pinned: 'left', cellRenderer: productRenderer },
      { headerName: 'Terminal', field: 'terminal', width: 170, pinned: 'left', cellRenderer: terminalRenderer },
      { headerName: 'Cost Type', field: 'costType', width: 110, cellRenderer: costTypeRenderer },
      {
        headerName: 'Cost Formula',
        field: 'costFormula',
        width: 200,
        cellRenderer: costFormulaRenderer,
        sortable: false,
        editable: true,
        valueSetter: (params) => {
          const source = params.newValue
          if (!source || typeof source !== 'object' || !('variables' in source)) return false
          const cloned = cloneFormula(source as Formula)
          const price = resolveFormulaPrice((source as Formula).variables, params.data.product)
          params.data.costFormula = cloned
          params.data.costPrice = price ? Math.round(price * 10000) / 10000 : null
          params.data.margin = params.data.salePrice != null && params.data.costPrice != null
            ? params.data.salePrice - params.data.costPrice : null
          return true
        },
      },
      { headerName: 'Cost Price', field: 'costPrice', width: 100, cellRenderer: priceRenderer },
      {
        headerName: 'Sale Formula',
        field: 'saleFormula',
        width: 200,
        cellRenderer: saleFormulaRenderer,
        sortable: false,
        editable: true,
        valueSetter: (params) => {
          const source = params.newValue
          if (!source || typeof source !== 'object' || !('variables' in source)) return false
          const cloned = cloneFormula(source as Formula)
          const price = resolveFormulaPrice((source as Formula).variables, params.data.product)
          params.data.saleFormula = cloned
          const resolvedPrice = price ? Math.round(price * 10000) / 10000 : null
          params.data.salePrice = resolvedPrice !== null ? Math.round((resolvedPrice + (params.data.formulaDiff ?? 0)) * 10000) / 10000 : null
          params.data.margin = calculateMarginCpg(params.data.salePrice, params.data.costPrice)
          return true
        },
      },
      {
        headerName: 'Formula Diff',
        field: 'formulaDiff',
        width: 110,
        editable: true,
        cellRenderer: (params: ICellRendererParams) => {
          const detail = params.data as SellerRFPDetail
          if (!detail) return null
          return (
            <span style={{ fontWeight: 500 }}>{formatFormulaDiff(detail.formulaDiff)}</span>
          )
        },
        valueSetter: (params) => {
          const raw = params.newValue
          const parsed = raw === '' || raw === null || raw === undefined ? null : parseFloat(raw)
          const newValue = parsed !== null && !isNaN(parsed) ? parsed : null
          params.data.formulaDiff = newValue
          if (params.data.saleFormula) {
            const price = resolveFormulaPrice(params.data.saleFormula.variables, params.data.product)
            const resolvedPrice = price ? Math.round(price * 10000) / 10000 : null
            params.data.salePrice = resolvedPrice !== null ? Math.round((resolvedPrice + (newValue ?? 0)) * 10000) / 10000 : null
          }
          params.data.margin = calculateMarginCpg(params.data.salePrice, params.data.costPrice)
          return true
        },
      },
      { headerName: 'Sale Price', field: 'salePrice', width: 100, cellRenderer: priceRenderer },
      { headerName: 'Margin', field: 'margin', width: 110, cellRenderer: marginRenderer },
      // Prior round benchmark columns (dynamic — only present in Round 2+)
      ...priorRoundGroup,
      // Benchmark columns (hidden by default — toggle via column menu)
      ...BENCHMARK_TYPES.flatMap((bt) => createBenchmarkColumnPair(bt)),
      {
        headerName: 'Volume',
        field: 'volume',
        width: 120,
        cellRenderer: volumeRenderer,
        editable: true,
        valueSetter: (params) => {
          const raw = params.newValue
          const newValue = typeof raw === 'number' ? raw : (raw ? parseInt(raw) : null)
          if (newValue !== params.data.volume) {
            params.data.volume = newValue
            return true
          }
          return false
        },
      },
      {
        headerName: 'Net Avail/mo',
        field: 'netAvailMonth',
        width: 140,
        cellRenderer: netAvailMonthRenderer,
        sortable: true,
        valueGetter: (params: ValueGetterParams) => {
          const detail = params.data as SellerRFPDetail
          if (!detail) return null
          const avail = computeDetailAvailability(detail, rfp.terms, SAMPLE_SUPPLY_AGREEMENTS, SAMPLE_INVENTORY_CAPACITY)
          return avail.netPerMonth
        },
        headerClass: styles['supply-header'],
      },
      {
        headerName: 'Net Avail/Term',
        field: 'netAvailTerm',
        width: 140,
        cellRenderer: netAvailTermRenderer,
        sortable: true,
        valueGetter: (params: ValueGetterParams) => {
          const detail = params.data as SellerRFPDetail
          if (!detail) return null
          const avail = computeDetailAvailability(detail, rfp.terms, SAMPLE_SUPPLY_AGREEMENTS, SAMPLE_INVENTORY_CAPACITY)
          return avail.netPerTerm
        },
        headerClass: styles['supply-header'],
      },
      { headerName: 'Status', field: 'status', width: 100, cellRenderer: statusRenderer },
      { headerName: '', field: 'actions', width: 50, cellRenderer: deleteRenderer, sortable: false, filter: false, resizable: false, suppressHeaderMenuButton: true },
    ],
    [productRenderer, terminalRenderer, costTypeRenderer, costFormulaRenderer, priceRenderer, saleFormulaRenderer, marginRenderer, priorRoundGroup, volumeRenderer, netAvailMonthRenderer, netAvailTermRenderer, statusRenderer, deleteRenderer, onDetailUpdate, rfp.terms],
  )

  // Add empty detail row
  const handleAddDetail = useCallback(() => {
    const newDetail: SellerRFPDetail = {
      id: `detail-add-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      product: '',
      terminal: '',
      costType: null,
      costFormula: null,
      costPrice: null,
      saleFormula: null,
      formulaDiff: null,
      salePrice: null,
      margin: null,
      volume: null,
      status: 'empty',
      termOverrides: null,
    }
    onDetailsReplace([...rfp.details, newDetail])
  }, [rfp.details, onDetailsReplace])

  // Handle cell value changes (from fill handle drag or direct edit)
  const handleCellValueChanged = useCallback((event: { data: SellerRFPDetail }) => {
    onDetailUpdate({ ...event.data })
  }, [onDetailUpdate])

  // Context menu for right-click copy/paste
  const getContextMenuItems = useCallback((params: GetContextMenuItemsParams<SellerRFPDetail>) => {
    const colId = params.column?.getColId()
    const isFormulaCol = colId === 'costFormula' || colId === 'saleFormula'
    const detail = params.node?.data

    return [
      'copy',
      'copyWithHeaders',
      'separator',
      {
        name: 'Copy Formula',
        disabled: !isFormulaCol || !detail || (colId === 'costFormula' ? !detail.costFormula : !detail.saleFormula),
        action: () => {
          if (!detail) return
          formulaClipboardRef.current = colId === 'costFormula' ? detail.costFormula : detail.saleFormula
        },
      },
      {
        name: 'Paste Formula',
        disabled: !isFormulaCol || !formulaClipboardRef.current || !detail,
        action: () => {
          if (!detail || !formulaClipboardRef.current) return
          const formulaCopy: Formula = {
            ...formulaClipboardRef.current,
            id: `formula-paste-${Date.now()}`,
            variables: formulaClipboardRef.current.variables.map((v) => ({ ...v, id: `var-paste-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` })),
          }
          if (colId === 'costFormula') {
            onDetailUpdate({ ...detail, costFormula: formulaCopy })
          } else {
            onDetailUpdate({ ...detail, saleFormula: formulaCopy })
          }
        },
      },
      'separator',
      {
        name: 'Duplicate Row',
        action: () => {
          if (!detail) return
          const duplicated: SellerRFPDetail = {
            ...detail,
            id: `detail-dup-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          }
          onDetailsReplace([...rfp.details, duplicated])
        },
      },
      {
        name: 'Delete Row',
        action: () => {
          if (!detail) return
          onDetailsReplace(rfp.details.filter((d) => d.id !== detail.id))
        },
      },
    ]
  }, [rfp.details, onDetailUpdate, onDetailsReplace])

  // Sale formula apply handler
  const handleSaleFormulaApply = useCallback((updatedDetail: SellerRFPDetail) => {
    onDetailUpdate(updatedDetail)
    onCloseSaleFormula()
  }, [onDetailUpdate, onCloseSaleFormula])

  // Round diff summary (includes formulaDiff as primary lever between rounds)
  const changedCount = hasRoundDiffs
    ? rfp.details.filter((d) => d.priorRoundValues && (
      d.salePrice !== d.priorRoundValues.salePrice ||
      d.formulaDiff !== d.priorRoundValues.formulaDiff ||
      d.volume !== d.priorRoundValues.volume
    )).length
    : 0

  return (
    <Vertical gap={16}>
      {/* Round diff indicator */}
      {hasRoundDiffs && changedCount > 0 && (
        <div className={styles['diff-banner']}>
          <Texto category="p2">
            {changedCount} detail{changedCount !== 1 ? 's' : ''} changed from Round {rfp.currentRound - 1}. Compare against the R{rfp.currentRound - 1} Sale and R{rfp.currentRound - 1} Margin columns.
          </Texto>
        </div>
      )}

      {/* Toolbar */}
      <Horizontal gap={8} justifyContent="flex-end">
        <GraviButton
          buttonText="Add Detail"
          icon={<PlusOutlined />}
          onClick={handleAddDetail}
        />
      </Horizontal>

      {/* Details Grid */}
      <div className={styles['grid-container']}>
        <GraviGrid
          rowData={rfp.details}
          columnDefs={columnDefs}
          agPropOverrides={{
            domLayout: 'autoHeight',
            getRowId: (params) => params.data.id,
            undoRedoCellEditing: true,
            undoRedoCellEditingLimit: 20,
            enableFillHandle: true,
            enableRangeSelection: true,
            onCellValueChanged: handleCellValueChanged,
            getContextMenuItems,
            allowContextMenuWithControlKey: true,
            onCellEditingStarted: (event: { column: { getColId: () => string }; api: { stopEditing: (cancel: boolean) => void } }) => {
              const colId = event.column.getColId()
              if (colId === 'costFormula' || colId === 'saleFormula') {
                event.api.stopEditing(true)
              }
            },
          }}
          storageKey="SellerRFPDetailsGrid"
        />
      </div>

      {/* Sale Formula Drawer */}
      <SaleFormulaDrawer
        open={saleFormulaDrawerOpen}
        detail={activeDetail}
        onClose={onCloseSaleFormula}
        onApply={handleSaleFormulaApply}
        rfps={rfps}
        currentRfpId={rfp.id}
      />
    </Vertical>
  )
}
