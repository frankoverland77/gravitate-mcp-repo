import { useMemo, useCallback, useState } from 'react'
import { Vertical, Horizontal, Texto, GraviGrid, GraviButton, BBDTag } from '@gravitate-js/excalibrr'
import { PlusOutlined, AppstoreAddOutlined } from '@ant-design/icons'
import { Drawer, Checkbox, Tooltip } from 'antd'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import type { SellerRFP, SellerRFPDetail } from '../types/sellerRfp.types'
import {
  COST_TYPE_LABELS,
  COST_TYPE_COLORS,
  DETAIL_STATUS_LABELS,
  formatPrice,
  formatMarginCpg,
  formatFormulaDisplay,
  getMarginColor,
  formatVolume,
} from '../types/sellerRfp.types'
import { CostTypePopover } from '../components/CostTypePopover'
import { SaleFormulaDrawer } from '../components/SaleFormulaDrawer'
import { SELLER_PRODUCTS, SELLER_TERMINALS } from '../data/sellerRfp.data'
import styles from './DetailsFormulasTab.module.css'

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
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>([])

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
      return (
        <Tooltip title={`R${rfp.currentRound - 1}: ${formatMarginCpg(detail.priorRoundValues.margin)} → R${rfp.currentRound}: ${formatMarginCpg(detail.margin)} (${diff >= 0 ? '+' : ''}${diff.toFixed(2)}¢)`}>
          <Horizontal alignItems="center" style={{ gap: '4px' }}>
            {display}
            <span className={styles['diff-indicator']} style={{ color: diff >= 0 ? '#52c41a' : '#ff4d4f' }}>
              {diff >= 0 ? '▲' : '▼'}
            </span>
          </Horizontal>
        </Tooltip>
      )
    }

    return display
  }, [hasRoundDiffs, rfp.currentRound])

  // Volume renderer (editable)
  const volumeRenderer = useCallback((params: ICellRendererParams) => {
    const detail = params.data as SellerRFPDetail
    if (!detail) return null
    return <span>{formatVolume(detail.volume)}</span>
  }, [])

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

  const columnDefs: ColDef[] = useMemo(
    () => [
      { headerName: 'Product', field: 'product', width: 120, pinned: 'left' },
      { headerName: 'Terminal', field: 'terminal', width: 150, pinned: 'left' },
      { headerName: 'Cost Type', field: 'costType', width: 110, cellRenderer: costTypeRenderer },
      { headerName: 'Cost Formula', field: 'costFormula', width: 200, cellRenderer: costFormulaRenderer, sortable: false },
      { headerName: 'Cost Price', field: 'costPrice', width: 100, cellRenderer: priceRenderer },
      { headerName: 'Sale Formula', field: 'saleFormula', width: 200, cellRenderer: saleFormulaRenderer, sortable: false },
      { headerName: 'Sale Price', field: 'salePrice', width: 100, cellRenderer: priceRenderer },
      { headerName: 'Margin (cpg)', field: 'margin', width: 110, cellRenderer: marginRenderer },
      {
        headerName: 'Volume',
        field: 'volume',
        width: 120,
        cellRenderer: volumeRenderer,
        editable: true,
        valueSetter: (params) => {
          const newValue = params.newValue ? parseInt(params.newValue) : null
          if (newValue !== params.data.volume) {
            onDetailUpdate({ ...params.data, volume: newValue })
            return true
          }
          return false
        },
      },
      { headerName: 'Status', field: 'status', width: 100, cellRenderer: statusRenderer },
    ],
    [costTypeRenderer, costFormulaRenderer, priceRenderer, saleFormulaRenderer, marginRenderer, volumeRenderer, statusRenderer, onDetailUpdate],
  )

  // Add details handler
  const handleAddDetails = useCallback(() => {
    if (selectedProducts.length === 0 || selectedTerminals.length === 0) return

    const existingKeys = new Set(rfp.details.map((d) => `${d.product}|${d.terminal}`))
    const newDetails: SellerRFPDetail[] = []

    for (const product of selectedProducts) {
      for (const terminal of selectedTerminals) {
        const key = `${product}|${terminal}`
        if (!existingKeys.has(key)) {
          newDetails.push({
            id: `detail-add-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            product,
            terminal,
            costType: null,
            costFormula: null,
            costPrice: null,
            saleFormula: null,
            salePrice: null,
            margin: null,
            volume: null,
            status: 'empty',
            termOverrides: null,
          })
        }
      }
    }

    if (newDetails.length > 0) {
      onDetailsReplace([...rfp.details, ...newDetails])
    }

    setAddDrawerOpen(false)
    setSelectedProducts([])
    setSelectedTerminals([])
  }, [selectedProducts, selectedTerminals, rfp.details, onDetailsReplace])

  // Sale formula apply handler
  const handleSaleFormulaApply = useCallback((updatedDetail: SellerRFPDetail) => {
    onDetailUpdate(updatedDetail)
    onCloseSaleFormula()
  }, [onDetailUpdate, onCloseSaleFormula])

  // Round diff summary
  const changedCount = hasRoundDiffs
    ? rfp.details.filter((d) => d.priorRoundValues && (
      d.salePrice !== d.priorRoundValues.salePrice ||
      d.volume !== d.priorRoundValues.volume
    )).length
    : 0

  return (
    <Vertical style={{ gap: '16px' }}>
      {/* Round diff indicator */}
      {hasRoundDiffs && changedCount > 0 && (
        <div className={styles['diff-banner']}>
          <Texto category="p2">
            {changedCount} detail{changedCount !== 1 ? 's' : ''} changed from Round {rfp.currentRound - 1}. Look for ▲▼ indicators in the Margin column.
          </Texto>
        </div>
      )}

      {/* Toolbar */}
      <Horizontal justifyContent="flex-end" style={{ gap: '8px' }}>
        <GraviButton
          buttonText="Add Details"
          icon={<AppstoreAddOutlined />}
          onClick={() => setAddDrawerOpen(true)}
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
          }}
          storageKey="SellerRFPDetailsGrid"
        />
      </div>

      {/* Add Details Drawer */}
      <Drawer
        title="Add Detail Rows"
        placement="right"
        width={420}
        open={addDrawerOpen}
        onClose={() => { setAddDrawerOpen(false); setSelectedProducts([]); setSelectedTerminals([]) }}
        footer={
          <Horizontal justifyContent="flex-end" style={{ gap: '8px' }}>
            <GraviButton buttonText="Cancel" onClick={() => setAddDrawerOpen(false)} />
            <GraviButton
              buttonText={`Add ${selectedProducts.length * selectedTerminals.length} Rows`}
              theme1
              onClick={handleAddDetails}
              disabled={selectedProducts.length === 0 || selectedTerminals.length === 0}
            />
          </Horizontal>
        }
      >
        <Vertical style={{ gap: '20px' }}>
          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" weight="600">Products</Texto>
            <Vertical style={{ gap: '4px' }}>
              {SELLER_PRODUCTS.map((p) => (
                <Checkbox
                  key={p}
                  checked={selectedProducts.includes(p)}
                  onChange={(e) => setSelectedProducts((prev) =>
                    e.target.checked ? [...prev, p] : prev.filter((x) => x !== p),
                  )}
                >
                  {p}
                </Checkbox>
              ))}
            </Vertical>
          </Vertical>
          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" weight="600">Terminals</Texto>
            <Vertical style={{ gap: '4px' }}>
              {SELLER_TERMINALS.map((t) => (
                <Checkbox
                  key={t}
                  checked={selectedTerminals.includes(t)}
                  onChange={(e) => setSelectedTerminals((prev) =>
                    e.target.checked ? [...prev, t] : prev.filter((x) => x !== t),
                  )}
                >
                  {t}
                </Checkbox>
              ))}
            </Vertical>
          </Vertical>
        </Vertical>
      </Drawer>

      {/* Sale Formula Drawer */}
      <SaleFormulaDrawer
        visible={saleFormulaDrawerOpen}
        detail={activeDetail}
        onClose={onCloseSaleFormula}
        onApply={handleSaleFormulaApply}
        rfps={rfps}
        currentRfpId={rfp.id}
      />
    </Vertical>
  )
}
