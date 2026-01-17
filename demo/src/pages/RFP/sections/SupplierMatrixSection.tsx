import { useMemo, useCallback } from 'react'
import { Vertical, Horizontal, Texto, BBDTag } from '@gravitate-js/excalibrr'
import {
  CheckOutlined,
  WarningOutlined,
  PushpinOutlined,
  PushpinFilled,
  EyeInvisibleOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { Table, Checkbox, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Supplier, DetailMetric } from '../rfp.types'
import { formatPrice, formatVolume, formatRatability, formatPenalties } from '../rfp.data'
import styles from './SupplierMatrixSection.module.css'

interface SupplierMatrixSectionProps {
  suppliers: Supplier[]
  round: number // Now supports any round number
  selectedSuppliers: Set<string>
  hiddenSuppliers: Set<string>
  pinnedSuppliers: Set<string>
  searchQuery?: string
  currentMetric?: DetailMetric
  isViewingHistory?: boolean
  onToggleSelection: (supplierId: string) => void
  onToggleHide: (supplierId: string) => void
  onTogglePin: (supplierId: string) => void
  onMetricClick?: (metric: DetailMetric) => void
}

// Metric row data structure
interface MetricRow {
  key: string
  metric: DetailMetric
  label: string
  values: Record<string, { value: string; status?: 'pass' | 'fail' }>
}

// Status indicator component
function StatusIndicator({ status }: { status?: 'pass' | 'fail' }) {
  if (!status) return null
  return status === 'pass' ? (
    <CheckOutlined className={styles.statusPass} style={{ color: '#52c41a' }} />
  ) : (
    <WarningOutlined className={styles.statusFail} style={{ color: '#faad14' }} />
  )
}

export function SupplierMatrixSection({
  suppliers,
  round: _round, // Kept in props for potential future round-specific display
  selectedSuppliers,
  hiddenSuppliers,
  pinnedSuppliers,
  searchQuery = '',
  currentMetric = 'price',
  isViewingHistory = false,
  onToggleSelection,
  onToggleHide,
  onTogglePin,
  onMetricClick,
}: SupplierMatrixSectionProps) {
  // Sort suppliers: incumbent first, then pinned, then others by rank
  const sortedSuppliers = useMemo(() => {
    const visible = suppliers.filter((s) => !hiddenSuppliers.has(s.id))
    const incumbent = visible.find((s) => s.isIncumbent)
    const pinned = visible.filter((s) => !s.isIncumbent && pinnedSuppliers.has(s.id))
    const others = visible.filter((s) => !s.isIncumbent && !pinnedSuppliers.has(s.id))

    // Sort pinned and others by rank
    pinned.sort((a, b) => a.rank - b.rank)
    others.sort((a, b) => a.rank - b.rank)

    return incumbent ? [incumbent, ...pinned, ...others] : [...pinned, ...others]
  }, [suppliers, hiddenSuppliers, pinnedSuppliers])

  // Build metric rows
  const metricRows: MetricRow[] = useMemo(() => {
    const rows: MetricRow[] = [
      {
        key: 'avgPrice',
        metric: 'price',
        label: 'Avg Price',
        values: {},
      },
      {
        key: 'totalVolume',
        metric: 'volume',
        label: 'Total Volume',
        values: {},
      },
      {
        key: 'ratability',
        metric: 'ratability',
        label: 'Ratability',
        values: {},
      },
      {
        key: 'allocation',
        metric: 'allocation',
        label: 'Allocation',
        values: {},
      },
      {
        key: 'penalties',
        metric: 'penalties',
        label: 'Penalties',
        values: {},
      },
      {
        key: 'issues',
        metric: 'price', // Issues doesn't have its own metric view
        label: 'Issues',
        values: {},
      },
    ]

    // Populate values for each supplier
    sortedSuppliers.forEach((supplier) => {
      const m = supplier.metrics
      rows[0].values[supplier.id] = { value: formatPrice(m.avgPrice) }
      rows[1].values[supplier.id] = { value: formatVolume(m.totalVolume) }
      rows[2].values[supplier.id] = { value: formatRatability(m.ratability), status: m.ratabilityStatus }
      rows[3].values[supplier.id] = {
        value: m.allocation.charAt(0).toUpperCase() + m.allocation.slice(1),
        status: m.allocationStatus,
      }
      rows[4].values[supplier.id] = { value: formatPenalties(m.penalties), status: m.penaltiesStatus }
      rows[5].values[supplier.id] = {
        value: m.issues.toString(),
        status: m.issues > 0 ? 'fail' : 'pass',
      }
    })

    return rows
  }, [sortedSuppliers])

  // Check if supplier is dimmed by search
  const isDimmed = useCallback(
    (supplier: Supplier) => {
      if (!searchQuery) return false
      return !supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    },
    [searchQuery]
  )

  // Render supplier header cell
  const renderSupplierHeader = useCallback(
    (supplier: Supplier) => {
      const isSelected = selectedSuppliers.has(supplier.id)
      const isPinned = pinnedSuppliers.has(supplier.id)
      const dimmed = isDimmed(supplier)

      return (
        <div
          className={`${styles.supplierHeader} ${supplier.isIncumbent ? styles.incumbent : ''} ${dimmed ? styles.dimmed : ''}`}
        >
          {/* Selection - always checkbox for multi-select in all rounds */}
          <Horizontal justifyContent="space-between" alignItems="center" className="mb-1">
            {!isViewingHistory && (
              <Checkbox checked={isSelected} onChange={() => onToggleSelection(supplier.id)} />
            )}
            {isViewingHistory && <div />}

            {/* Actions */}
            <Horizontal style={{ gap: '4px' }}>
              {!isViewingHistory && (
                <>
                  <Tooltip title={isPinned ? 'Unpin' : 'Pin'}>
                    <span className={styles.actionIcon} onClick={() => onTogglePin(supplier.id)}>
                      {isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                    </span>
                  </Tooltip>
                  {!supplier.isIncumbent ? (
                    <Tooltip title="Hide">
                      <span className={styles.actionIcon} onClick={() => onToggleHide(supplier.id)}>
                        <EyeInvisibleOutlined />
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Cannot hide incumbent">
                      <span className={`${styles.actionIcon} ${styles.disabled}`}>
                        <LockOutlined />
                      </span>
                    </Tooltip>
                  )}
                </>
              )}
            </Horizontal>
          </Horizontal>

          {/* Supplier name and badges */}
          <Vertical style={{ gap: '4px' }}>
            {supplier.isIncumbent && <span className={styles.incumbentFlag}>INCUMBENT</span>}
            <Texto weight="600">{supplier.name}</Texto>

            {/* Rank badge - centered */}
            <div className={styles.rankBadgeWrapper}>
              <BBDTag>#{supplier.rank} OVERALL</BBDTag>
            </div>
          </Vertical>
        </div>
      )
    },
    [selectedSuppliers, pinnedSuppliers, isDimmed, isViewingHistory, onToggleSelection, onTogglePin, onToggleHide]
  )

  // Build table columns
  const columns: ColumnsType<MetricRow> = useMemo(() => {
    const cols: ColumnsType<MetricRow> = [
      {
        title: 'METRIC',
        dataIndex: 'label',
        key: 'metric',
        width: 120,
        fixed: 'left',
        render: (label: string, record: MetricRow) => (
          <div
            className={`${styles.metricLabel} ${record.metric === currentMetric ? styles.metricActive : ''}`}
            onClick={() => onMetricClick?.(record.metric)}
          >
            <Texto weight="600">{label}</Texto>
          </div>
        ),
      },
    ]

    // Add a column for each supplier
    sortedSuppliers.forEach((supplier) => {
      cols.push({
        title: renderSupplierHeader(supplier),
        dataIndex: ['values', supplier.id, 'value'],
        key: supplier.id,
        width: 150,
        className: `${supplier.isIncumbent ? styles.incumbentColumn : ''} ${isDimmed(supplier) ? styles.dimmedColumn : ''}`,
        render: (_: unknown, record: MetricRow) => {
          const cellData = record.values[supplier.id]
          if (!cellData) return null
          return (
            <Horizontal alignItems="center" style={{ gap: '8px' }}>
              <Texto>{cellData.value}</Texto>
              <StatusIndicator status={cellData.status} />
            </Horizontal>
          )
        },
      })
    })

    return cols
  }, [sortedSuppliers, currentMetric, renderSupplierHeader, isDimmed, onMetricClick])

  return (
    <div className={styles.matrixContainer} style={{ height: 'auto', minHeight: 'fit-content', flexShrink: 0 }}>
      <Table
        columns={columns}
        dataSource={metricRows}
        rowKey="key"
        pagination={false}
        size="small"
        bordered
        tableLayout="auto"
      />
    </div>
  )
}
