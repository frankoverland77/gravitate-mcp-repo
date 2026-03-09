import { useMemo, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviGrid, GraviButton, NotificationMessage } from '@gravitate-js/excalibrr'
import { PlusOutlined, RightOutlined, CheckCircleFilled } from '@ant-design/icons'
import type { ColDef, ICellRendererParams, RowStyle } from 'ag-grid-community'
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

    if (status === 'draft') {
      return <span className={styles.statusDraft}>Draft</span>
    }

    if (status === 'awarded') {
      return (
        <span className={styles.statusAwarded}>
          <CheckCircleFilled className={styles.awardedIcon} />
          Awarded
        </span>
      )
    }

    // Round 1 and Round 2 - just plain text
    const label = status === 'round1' ? 'Round 1' : 'Round 2'
    return <span>{label}</span>
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

  // Action cell renderer - shows chevron icon for all RFPs
  const actionRenderer = useCallback(
    (params: ICellRendererParams<RFP>) => {
      const rfp = params.data
      if (!rfp) return null
      return (
        <RightOutlined
          className={styles.actionChevron}
          onClick={() => onRFPClick(rfp)}
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
        width: 60,
        cellRenderer: actionRenderer,
        sortable: false,
        filter: false,
      },
    ],
    [statusRenderer, suppliersRenderer, targetRenderer, actionRenderer]
  )

  // Row click handler - all RFPs are clickable
  const handleRowClick = useCallback(
    (params: { data: RFP | undefined }) => {
      const rfp = params.data
      if (rfp) {
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
    <Vertical gap={24}>
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
      <Horizontal gap={16}>
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
            getRowStyle: (): RowStyle | undefined => {
              return { cursor: 'pointer', backgroundColor: '#ffffff' }
            },
          }}
          storageKey="RFPListGrid"
        />
      </div>
    </Vertical>
  )
}
