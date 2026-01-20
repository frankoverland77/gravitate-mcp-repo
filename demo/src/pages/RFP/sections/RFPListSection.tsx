import { useMemo, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviGrid, GraviButton, NotificationMessage } from '@gravitate-js/excalibrr'
import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import type { ColDef, ICellRendererParams, RowClassParams, RowStyle } from 'ag-grid-community'
import type { RFP } from '../rfp.types'
import { SAMPLE_RFPS, RFP_LIST_STATS } from '../rfp.data'
import styles from './RFPListSection.module.css'

interface RFPListSectionProps {
  onRFPClick: (rfp: RFP) => void
}

// Stat card component
function StatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <Vertical className={`${styles.statCard} ${highlight ? styles.statCardHighlight : ''}`}>
      <Texto category="h2" weight="600">
        {value}
      </Texto>
      <Texto category="p2" appearance="medium">
        {label}
      </Texto>
    </Vertical>
  )
}

export function RFPListSection({ onRFPClick }: RFPListSectionProps) {
  // Status cell renderer
  const statusRenderer = useCallback((params: ICellRendererParams<RFP>) => {
    const status = params.value as RFP['status']
    const statusConfig: Record<RFP['status'], { label: string; className: string }> = {
      draft: { label: 'Draft', className: styles.statusDraft },
      round1: { label: 'Round 1', className: styles.statusRound1 },
      round2: { label: 'Round 2', className: styles.statusRound2 },
      awarded: { label: 'Awarded', className: styles.statusAwarded },
    }
    const config = statusConfig[status]
    return (
      <span className={`${styles.statusBadge} ${config.className}`}>
        {config.label}
      </span>
    )
  }, [])

  // Suppliers cell renderer
  const suppliersRenderer = useCallback((params: ICellRendererParams<RFP>) => {
    const rfp = params.data
    if (!rfp) return null
    if (rfp.status === 'awarded' && rfp.winnerName) {
      return <Texto>{rfp.winnerName}</Texto>
    }
    return <Texto>{rfp.supplierCount}</Texto>
  }, [])

  // Target price cell renderer
  const targetRenderer = useCallback((params: ICellRendererParams<RFP>) => {
    const value = params.value as number | null
    if (value === null) {
      return <Texto appearance="medium">—</Texto>
    }
    return <Texto>${value.toFixed(2)}/gal</Texto>
  }, [])

  // Action button cell renderer - now shows for all statuses
  const actionRenderer = useCallback(
    (params: ICellRendererParams<RFP>) => {
      const rfp = params.data
      if (!rfp) return null
      // Show View button for active RFPs (round1, round2)
      // For draft/awarded, no click action but still render a placeholder for consistency
      if (rfp.status === 'draft' || rfp.status === 'awarded') {
        return <Texto appearance='medium'>—</Texto>
      }
      return (
        <GraviButton
          type='link'
          buttonText='View'
          icon={<RightOutlined />}
          onClick={() => onRFPClick(rfp)}
          style={{ padding: 0 }}
        />
      )
    },
    [onRFPClick]
  )

  // Column definitions
  const columnDefs: ColDef<RFP>[] = useMemo(
    () => [
      {
        headerName: 'RFP Name',
        field: 'name',
        flex: 2,
        minWidth: 250,
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 120,
        cellRenderer: statusRenderer,
      },
      {
        headerName: 'Suppliers',
        field: 'supplierCount',
        width: 120,
        cellRenderer: suppliersRenderer,
      },
      {
        headerName: 'Target',
        field: 'targetPrice',
        width: 130,
        cellRenderer: targetRenderer,
      },
      {
        headerName: 'Created',
        field: 'createdAt',
        width: 130,
      },
      {
        headerName: '',
        field: 'id',
        width: 100,
        cellRenderer: actionRenderer,
        sortable: false,
        filter: false,
      },
    ],
    [statusRenderer, suppliersRenderer, targetRenderer, actionRenderer]
  )

  // Row click handler
  const handleRowClick = useCallback(
    (params: { data: RFP | undefined }) => {
      const rfp = params.data
      if (rfp && rfp.status !== 'draft' && rfp.status !== 'awarded') {
        onRFPClick(rfp)
      }
    },
    [onRFPClick]
  )

  // New RFP button handler (placeholder)
  const handleNewRFP = useCallback(() => {
    NotificationMessage('Coming Soon', 'Create RFP functionality will be available in a future release.', false)
  }, [])

  return (
    <Vertical style={{ gap: '24px' }}>
      {/* Header */}
      <Horizontal justifyContent="space-between" alignItems="center">
        <Texto category="h3" weight="600">
          RFP Management
        </Texto>
        <GraviButton
          buttonText="New RFP"
          icon={<PlusOutlined />}
          success
          onClick={handleNewRFP}
        />
      </Horizontal>

      {/* Stats Cards */}
      <Horizontal style={{ gap: '16px' }}>
        <StatCard label="Active RFPs" value={RFP_LIST_STATS.activeRFPs} highlight />
        <StatCard label="In Round 2" value={RFP_LIST_STATS.inRound2} />
        <StatCard label="Awarded This Year" value={RFP_LIST_STATS.awardedThisYear} />
        <StatCard label="Total Suppliers" value={RFP_LIST_STATS.totalSuppliers} />
      </Horizontal>

      {/* RFP Grid */}
      <div className={styles.gridContainer}>
        <GraviGrid
          rowData={SAMPLE_RFPS}
          columnDefs={columnDefs}
          agPropOverrides={{
            domLayout: 'autoHeight',
            onRowClicked: handleRowClick,
            getRowStyle: (params: RowClassParams<RFP>): RowStyle | undefined => {
              const rfp = params.data
              if (rfp && (rfp.status === 'draft' || rfp.status === 'awarded')) {
                return { cursor: 'default', opacity: 0.7 }
              }
              return { cursor: 'pointer' }
            },
          }}
          storageKey="RFPListGrid"
        />
      </div>
    </Vertical>
  )
}
