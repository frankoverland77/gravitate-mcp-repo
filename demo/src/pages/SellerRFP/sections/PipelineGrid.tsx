import { useMemo, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviGrid, GraviButton } from '@gravitate-js/excalibrr'
import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import type { ColDef, ICellRendererParams, RowStyle } from 'ag-grid-community'
import type { SellerRFP } from '../types/sellerRfp.types'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  formatVolume,
  formatMarginCpg,
  getMarginColor,
  isDeadlineUrgent,
  isDeadlinePast,
} from '../types/sellerRfp.types'
import {
  getActiveCount,
  getDueThisWeekCount,
  getAwaitingAdjudicationCount,
  getWinRate,
  getProductChips,
  getTerminalChips,
  getTotalVolume,
  getEstimatedMarginCpg,
} from '../data/sellerRfp.data'
import styles from './PipelineGrid.module.css'

interface PipelineGridProps {
  rfps: SellerRFP[]
  onRFPClick: (rfp: SellerRFP) => void
  onNewRFP: () => void
}

function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <Vertical className={`${styles['stat-card']} ${highlight ? styles['stat-card-highlight'] : ''}`}>
      <Texto category="h2" weight="600">
        {value}
      </Texto>
      <Texto category="p2" appearance="medium">
        {label}
      </Texto>
    </Vertical>
  )
}

export function PipelineGrid({ rfps, onRFPClick, onNewRFP }: PipelineGridProps) {
  // Status cell renderer
  const statusRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    const colors = STATUS_COLORS[rfp.status]
    return (
      <span
        className={styles['status-tag']}
        style={{ color: colors.color, backgroundColor: colors.background }}
      >
        {STATUS_LABELS[rfp.status]}
      </span>
    )
  }, [])

  // Products chip renderer
  const productsRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    const chips = getProductChips(rfp)
    const maxShow = 2
    return (
      <div className={styles['chip-container']}>
        {chips.slice(0, maxShow).map((p) => (
          <span key={p} className={styles.chip}>{p}</span>
        ))}
        {chips.length > maxShow && (
          <span className={styles['chip-overflow']}>+{chips.length - maxShow}</span>
        )}
      </div>
    )
  }, [])

  // Terminals chip renderer
  const terminalsRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    const chips = getTerminalChips(rfp)
    const maxShow = 2
    return (
      <div className={styles['chip-container']}>
        {chips.slice(0, maxShow).map((t) => (
          <span key={t} className={styles.chip}>{t.replace(' Terminal', '')}</span>
        ))}
        {chips.length > maxShow && (
          <span className={styles['chip-overflow']}>+{chips.length - maxShow}</span>
        )}
      </div>
    )
  }, [])

  // Deadline renderer
  const deadlineRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    const date = new Date(rfp.deadline)
    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const isPast = isDeadlinePast(rfp.deadline)
    const isUrgent = isDeadlineUrgent(rfp.deadline)
    const className = isPast ? styles['deadline-past'] : isUrgent ? styles['deadline-urgent'] : ''
    return <span className={className}>{formatted}</span>
  }, [])

  // Round badge renderer
  const roundRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    return <span className={styles['round-badge']}>R{rfp.currentRound}</span>
  }, [])

  // Margin renderer
  const marginRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    const marginCpg = getEstimatedMarginCpg(rfp)
    const color = getMarginColor(marginCpg)
    return <span className={styles[`margin-${color}`]}>{formatMarginCpg(marginCpg)}</span>
  }, [])

  // Volume renderer
  const volumeRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    const volume = getTotalVolume(rfp)
    return <Texto>{formatVolume(volume || null)}</Texto>
  }, [])

  // Action chevron
  const actionRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    return (
      <RightOutlined
        className={styles['action-chevron']}
        onClick={() => onRFPClick(rfp)}
      />
    )
  }, [onRFPClick])

  // Last modified renderer
  const lastModifiedRenderer = useCallback((params: ICellRendererParams) => {
    const rfp = params.data as SellerRFP
    if (!rfp) return null
    const date = new Date(rfp.updatedAt)
    const now = new Date()
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    if (diffHours < 1) return <Texto appearance="medium">Just now</Texto>
    if (diffHours < 24) return <Texto appearance="medium">{Math.floor(diffHours)}h ago</Texto>
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return <Texto appearance="medium">{diffDays}d ago</Texto>
    return <Texto appearance="medium">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Texto>
  }, [])

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: 'RFP Name',
        field: 'name',
        flex: 2,
        minWidth: 220,
      },
      {
        headerName: 'Buyer',
        field: 'buyerName',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Products',
        field: 'details',
        width: 160,
        cellRenderer: productsRenderer,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Terminals',
        field: 'details',
        width: 170,
        cellRenderer: terminalsRenderer,
        sortable: false,
        filter: false,
        colId: 'terminals',
      },
      {
        headerName: 'Deadline',
        field: 'deadline',
        width: 140,
        cellRenderer: deadlineRenderer,
        sort: 'asc',
      },
      {
        headerName: 'Round',
        field: 'currentRound',
        width: 80,
        cellRenderer: roundRenderer,
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 120,
        cellRenderer: statusRenderer,
      },
      {
        headerName: 'Est. Margin',
        field: 'details',
        width: 110,
        cellRenderer: marginRenderer,
        sortable: false,
        colId: 'margin',
      },
      {
        headerName: 'Volume',
        field: 'details',
        width: 120,
        cellRenderer: volumeRenderer,
        sortable: false,
        colId: 'volume',
      },
      {
        headerName: 'Modified',
        field: 'updatedAt',
        width: 100,
        cellRenderer: lastModifiedRenderer,
      },
      {
        headerName: '',
        field: 'id',
        width: 50,
        cellRenderer: actionRenderer,
        sortable: false,
        filter: false,
      },
    ],
    [statusRenderer, productsRenderer, terminalsRenderer, deadlineRenderer, roundRenderer, marginRenderer, volumeRenderer, lastModifiedRenderer, actionRenderer],
  )

  const handleRowClick = useCallback(
    (params: { data: SellerRFP | undefined }) => {
      if (params.data) onRFPClick(params.data)
    },
    [onRFPClick],
  )

  return (
    <Vertical style={{ gap: '24px' }}>
      {/* Header */}
      <Horizontal justifyContent="space-between" alignItems="center">
        <Texto category="h3" weight="600">
          Seller RFP Pipeline
        </Texto>
        <GraviButton
          buttonText="New RFP Response"
          icon={<PlusOutlined />}
          success
          onClick={onNewRFP}
        />
      </Horizontal>

      {/* Stat Cards */}
      <Horizontal style={{ gap: '16px' }}>
        <StatCard label="Active RFPs" value={getActiveCount(rfps)} highlight />
        <StatCard label="Due This Week" value={getDueThisWeekCount(rfps)} />
        <StatCard label="Awaiting Adjudication" value={getAwaitingAdjudicationCount(rfps)} />
        <StatCard label="Win Rate" value={getWinRate(rfps)} />
      </Horizontal>

      {/* Pipeline Grid */}
      <div className={styles['grid-container']}>
        <GraviGrid
          rowData={rfps}
          columnDefs={columnDefs}
          agPropOverrides={{
            domLayout: 'autoHeight',
            onRowClicked: handleRowClick,
            getRowStyle: (): RowStyle | undefined => ({
              cursor: 'pointer',
              backgroundColor: '#ffffff',
            }),
          }}
          storageKey="SellerRFPPipelineGrid"
        />
      </div>
    </Vertical>
  )
}
