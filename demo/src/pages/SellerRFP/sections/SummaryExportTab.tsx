import { useMemo, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton, GraviGrid, NotificationMessage } from '@gravitate-js/excalibrr'
import { FileExcelOutlined, FilePdfOutlined, CopyOutlined } from '@ant-design/icons'
import type { ColDef, ColGroupDef, ICellRendererParams, ValueGetterParams } from 'ag-grid-community'
import type { SellerRFP, SellerRFPDetail, RFPRoundHistory } from '../types/sellerRfp.types'
import {
  formatPrice,
  formatMarginCpg,
  formatFormulaDiff,
  formatVolume,
  getMarginColor,
  COST_TYPE_LABELS,
  COST_TYPE_COLORS,
  formatFormulaDisplay,
  PAYMENT_TERMS_OPTIONS,
} from '../types/sellerRfp.types'
import { ALLOCATION_PERIOD_OPTIONS } from '../../RFP/rfp.types'
import styles from './SummaryExportTab.module.css'

interface SummaryExportTabProps {
  rfp: SellerRFP
}

export function SummaryExportTab({ rfp }: SummaryExportTabProps) {
  const stats = useMemo(() => {
    const readyDetails = rfp.details.filter((d) => d.status === 'ready')
    const allDetails = rfp.details

    const totalVolume = allDetails.reduce((sum, d) => sum + (d.volume || 0), 0)
    const marginsWithVolume = readyDetails.filter((d) => d.margin !== null && d.volume)
    const weightedMargin = marginsWithVolume.length > 0
      ? marginsWithVolume.reduce((sum, d) => sum + (d.margin! * (d.volume || 0)), 0) /
        marginsWithVolume.reduce((sum, d) => sum + (d.volume || 0), 0)
      : 0

    const uniqueProducts = new Set(allDetails.map((d) => d.product))
    const uniqueTerminals = new Set(allDetails.map((d) => d.terminal))

    return {
      totalVolume,
      weightedMargin: Math.round(weightedMargin * 100) / 100,
      productCount: uniqueProducts.size,
      terminalCount: uniqueTerminals.size,
      readyCount: readyDetails.length,
      totalCount: allDetails.length,
    }
  }, [rfp.details])

  const handleExportExcel = () => {
    NotificationMessage('Export Started', `Exporting ${rfp.name} to Excel...`, false)
  }

  const handleExportPDF = () => {
    NotificationMessage('Export Started', `Exporting ${rfp.name} to PDF...`, false)
  }

  const handleCopy = () => {
    NotificationMessage('Copied', 'Summary copied to clipboard.', false)
  }

  // Determine prior rounds with 'advanced' adjudication
  const advancedRounds = useMemo(
    () => rfp.rounds.filter((r: RFPRoundHistory) => r.adjudication === 'advanced'),
    [rfp.rounds],
  )

  const getPriorValue = useCallback((roundNumber: number, detailId: string, field: 'salePrice' | 'margin'): number | null => {
    const roundHistory = rfp.rounds.find(r => r.round === roundNumber)
    if (!roundHistory?.detailSnapshot) return null
    const priorDetail = roundHistory.detailSnapshot.find(d => d.id === detailId)
    if (!priorDetail) return null
    return priorDetail[field]
  }, [rfp.rounds])

  // AG Grid column definitions for detail summary
  const priorRoundColumns: ColDef[] = useMemo(() => {
    return advancedRounds.flatMap((roundHistory): ColDef[] => {
      const rn = roundHistory.round
      return [
        {
          headerName: `R${rn} Sale`,
          colId: `prior-r${rn}-sale`,
          width: 110,
          sortable: true,
          filter: 'agNumberColumnFilter',
          valueGetter: (params: ValueGetterParams) => {
            const detail = params.data as SellerRFPDetail
            if (!detail) return null
            return getPriorValue(rn, detail.id, 'salePrice')
          },
          cellRenderer: (params: ICellRendererParams) => {
            const value = params.value as number | null
            return <span style={{ color: '#8c8c8c' }}>{value != null ? formatPrice(value) : '—'}</span>
          },
        },
        {
          headerName: `R${rn} Margin`,
          colId: `prior-r${rn}-margin`,
          width: 110,
          sortable: true,
          filter: 'agNumberColumnFilter',
          valueGetter: (params: ValueGetterParams) => {
            const detail = params.data as SellerRFPDetail
            if (!detail) return null
            return getPriorValue(rn, detail.id, 'margin')
          },
          cellRenderer: (params: ICellRendererParams) => {
            const value = params.value as number | null
            if (value == null) return <span style={{ color: '#8c8c8c' }}>—</span>
            const color = getMarginColor(value)
            const colorMap: Record<string, string> = { green: '#52c41a', yellow: '#faad14', red: '#ff4d4f', neutral: '#8c8c8c' }
            return (
              <span style={{ color: colorMap[color], fontWeight: 600, opacity: 0.6 }}>
                {formatMarginCpg(value)}
              </span>
            )
          },
        },
      ]
    })
  }, [advancedRounds, getPriorValue])

  const priorRoundGroup: ColGroupDef[] = useMemo(() => {
    if (priorRoundColumns.length === 0) return []
    return [{
      headerName: 'Prior Rounds',
      children: priorRoundColumns,
    }]
  }, [priorRoundColumns])

  const columnDefs: (ColDef | ColGroupDef)[] = useMemo(() => [
    {
      headerName: 'Product',
      field: 'product',
      width: 140,
      pinned: 'left' as const,
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: 'Terminal',
      field: 'terminal',
      width: 170,
      pinned: 'left' as const,
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: 'Cost Type',
      field: 'costType',
      width: 120,
      sortable: true,
      filter: true,
      enableRowGroup: true,
      cellRenderer: (params: ICellRendererParams) => {
        const detail = params.data as SellerRFPDetail
        if (!detail?.costType) return <span style={{ color: '#8c8c8c' }}>—</span>
        const colors = COST_TYPE_COLORS[detail.costType]
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              color: colors.color,
              backgroundColor: colors.background,
            }}
          >
            {COST_TYPE_LABELS[detail.costType]}
          </span>
        )
      },
      valueGetter: (params: ValueGetterParams) => {
        const detail = params.data as SellerRFPDetail
        return detail?.costType ? COST_TYPE_LABELS[detail.costType] : null
      },
    },
    {
      headerName: 'Cost Price',
      field: 'costPrice',
      width: 110,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: (params: ICellRendererParams) => <span>{formatPrice(params.value)}</span>,
    },
    {
      headerName: 'Sale Formula',
      field: 'saleFormula',
      width: 200,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams) => {
        const detail = params.data as SellerRFPDetail
        return <span style={{ color: '#8c8c8c' }}>{formatFormulaDisplay(detail?.saleFormula) || '—'}</span>
      },
    },
    {
      headerName: 'Formula Diff',
      field: 'formulaDiff',
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: (params: ICellRendererParams) => (
        <span style={{ fontWeight: 500 }}>{formatFormulaDiff(params.value)}</span>
      ),
    },
    {
      headerName: 'Sale Price',
      field: 'salePrice',
      width: 110,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: (params: ICellRendererParams) => <span>{formatPrice(params.value)}</span>,
    },
    {
      headerName: 'Margin',
      field: 'margin',
      width: 110,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        const detail = params.data as SellerRFPDetail
        if (!detail) return null
        const color = getMarginColor(detail.margin)
        const colorMap: Record<string, string | undefined> = { green: '#52c41a', yellow: '#faad14', red: '#ff4d4f' }
        return (
          <span style={{ fontWeight: 600, color: colorMap[color] }}>
            {formatMarginCpg(detail.margin)}
          </span>
        )
      },
    },
    ...priorRoundGroup,
    {
      headerName: 'Volume',
      field: 'volume',
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        const detail = params.data as SellerRFPDetail
        return <span>{detail?.volume ? detail.volume.toLocaleString() : '—'}</span>
      },
    },
  ], [priorRoundGroup])

  const allocationLabel = rfp.terms.allocationPeriod
    ? ALLOCATION_PERIOD_OPTIONS.find((o) => o.value === rfp.terms.allocationPeriod)?.label || rfp.terms.allocationPeriod
    : '—'
  const paymentLabel = rfp.terms.paymentTerms
    ? PAYMENT_TERMS_OPTIONS.find((o) => o.value === rfp.terms.paymentTerms)?.label || rfp.terms.paymentTerms
    : '—'

  return (
    <Vertical gap={32} style={{ overflow: 'visible' }}>
      {/* Summary Cards */}
      <div className={styles['stats-row']}>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700">{formatVolume(stats.totalVolume)}</Texto>
          <Texto category="p2" appearance="medium">Total Volume</Texto>
        </div>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700" style={{ color: getMarginColor(stats.weightedMargin) === 'green' ? '#52c41a' : getMarginColor(stats.weightedMargin) === 'yellow' ? '#faad14' : getMarginColor(stats.weightedMargin) === 'red' ? '#ff4d4f' : undefined }}>
            {formatMarginCpg(stats.weightedMargin)}
          </Texto>
          <Texto category="p2" appearance="medium">Weighted Avg Margin</Texto>
        </div>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700">{stats.productCount}</Texto>
          <Texto category="p2" appearance="medium">Products</Texto>
        </div>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700">{stats.terminalCount}</Texto>
          <Texto category="p2" appearance="medium">Terminals</Texto>
        </div>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700">{stats.readyCount}/{stats.totalCount}</Texto>
          <Texto category="p2" appearance="medium">Details Ready</Texto>
        </div>
      </div>

      {/* Terms Summary */}
      <Vertical gap={12} style={{ overflow: 'visible' }}>
        <Texto category="h5" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Terms Summary
        </Texto>
        <div className={styles['terms-grid']}>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Volume Commitment</Texto>
            <Texto category="p1" weight="500">{rfp.terms.volumeCommitment ? `${rfp.terms.volumeCommitment.toLocaleString()} gal/mo` : '—'}</Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Contract Period</Texto>
            <Texto category="p1" weight="500">
              {rfp.terms.contractStart && rfp.terms.contractEnd
                ? `${new Date(rfp.terms.contractStart).toLocaleDateString()} – ${new Date(rfp.terms.contractEnd).toLocaleDateString()}`
                : '—'}
            </Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Allocation Period</Texto>
            <Texto category="p1" weight="500">{allocationLabel}</Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Payment Terms</Texto>
            <Texto category="p1" weight="500">{paymentLabel}</Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Ratability</Texto>
            <Texto category="p1" weight="500">
              {rfp.terms.ratabilityMin !== null && rfp.terms.ratabilityMax !== null
                ? `${rfp.terms.ratabilityMin}% – ${rfp.terms.ratabilityMax}%`
                : '—'}
            </Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Deficiency Penalty</Texto>
            <Texto category="p1" weight="500">{rfp.terms.penaltyCpg !== null ? `${rfp.terms.penaltyCpg}¢/gal` : '—'}</Texto>
          </div>
        </div>
      </Vertical>

      {/* Detail Summary Grid */}
      <Vertical gap={12} style={{ overflow: 'visible' }}>
        <Texto category="h5" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Detail Summary
        </Texto>

        <div className={styles['detail-grid-container']}>
          <GraviGrid
            rowData={rfp.details}
            columnDefs={columnDefs}
            agPropOverrides={{
              domLayout: 'autoHeight',
              getRowId: (params) => params.data.id,
              rowGroupPanelShow: 'always',
              groupDisplayType: 'groupRows',
            }}
            storageKey="SellerRFPSummaryGrid"
          />
        </div>
      </Vertical>

      {/* Export Actions */}
      <Vertical gap={12}>
        <Texto category="h5" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Export
        </Texto>
        <Horizontal gap={12}>
          <GraviButton
            buttonText="Export to Excel"
            icon={<FileExcelOutlined />}
            theme1
            onClick={handleExportExcel}
          />
          <GraviButton
            buttonText="Export to PDF"
            icon={<FilePdfOutlined />}
            onClick={handleExportPDF}
          />
          <GraviButton
            buttonText="Copy Summary"
            icon={<CopyOutlined />}
            onClick={handleCopy}
          />
        </Horizontal>
      </Vertical>
    </Vertical>
  )
}
