import { useMemo, useCallback, useState } from 'react'
import { Vertical, Horizontal, Texto, BBDTag } from '@gravitate-js/excalibrr'
import {
  CheckOutlined,
  WarningOutlined,
  PushpinOutlined,
  PushpinFilled,
  EyeInvisibleOutlined,
  LockOutlined,
  RightOutlined,
  HolderOutlined,
} from '@ant-design/icons'
import { Table, Checkbox, Tooltip, Popover } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Supplier, DetailMetric, DetailRow } from '../rfp.types'
import { formatAllocationPeriod } from '../rfp.types'
import { formatPrice, formatVolume, formatRatability, formatPenalties, calculatePerProductAverages } from '../rfp.data'
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
  detailData?: DetailRow[] // For calculating product group averages
  columnOrder?: string[] // Custom column order (supplier IDs)
  isManualMode?: boolean // Controls drag reorder availability
  onToggleSelection: (supplierId: string) => void
  onToggleHide: (supplierId: string) => void
  onTogglePin: (supplierId: string) => void
  onMetricClick?: (metric: DetailMetric) => void
  onColumnReorder?: (newOrder: string[]) => void
}

// Metric row data structure
interface MetricRow {
  key: string
  metric: DetailMetric
  label: string
  values: Record<string, { value: string; status?: 'pass' | 'fail' }>
  isExpandable?: boolean
  children?: MetricRow[]
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

// Issues detail popup content
function IssuesDetailContent({ supplier }: { supplier: Supplier }) {
  const { metrics } = supplier
  const issues: Array<{ label: string; hasFailed: boolean }> = [
    { label: 'Ratability', hasFailed: metrics.ratabilityStatus === 'fail' },
    { label: 'Allocation', hasFailed: metrics.allocationStatus === 'fail' },
    { label: 'Penalties', hasFailed: metrics.penaltiesStatus === 'fail' },
  ]

  const failedIssues = issues.filter((i) => i.hasFailed)

  if (failedIssues.length === 0) {
    return (
      <Vertical style={{ gap: '4px', maxWidth: '200px' }}>
        <Texto category='p2' weight='600'>
          No Issues
        </Texto>
        <Texto category='p2' appearance='medium'>
          All metrics within threshold
        </Texto>
      </Vertical>
    )
  }

  return (
    <Vertical style={{ gap: '8px', maxWidth: '220px' }}>
      <Texto category='p2' weight='600'>
        {failedIssues.length} Issue{failedIssues.length !== 1 ? 's' : ''} Flagged
      </Texto>
      {failedIssues.map((issue) => (
        <Horizontal key={issue.label} alignItems='center' style={{ gap: '8px' }}>
          <WarningOutlined style={{ color: '#faad14' }} />
          <Texto category='p2'>{issue.label} out of threshold</Texto>
        </Horizontal>
      ))}
    </Vertical>
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
  detailData,
  columnOrder,
  isManualMode = false,
  onToggleSelection,
  onToggleHide,
  onTogglePin,
  onMetricClick,
  onColumnReorder,
}: SupplierMatrixSectionProps) {
  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  // State for drag-and-drop
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  // Sort suppliers: incumbent first, then by columnOrder if provided, else pinned then others by rank
  const sortedSuppliers = useMemo(() => {
    const visible = suppliers.filter((s) => !hiddenSuppliers.has(s.id))
    const incumbent = visible.find((s) => s.isIncumbent)
    const nonIncumbent = visible.filter((s) => !s.isIncumbent)

    // If columnOrder is provided, use it (keeping incumbent first)
    if (columnOrder && columnOrder.length > 0) {
      const orderedNonIncumbent = columnOrder
        .filter((id) => nonIncumbent.some((s) => s.id === id))
        .map((id) => nonIncumbent.find((s) => s.id === id)!)
        .filter(Boolean)
      // Add any suppliers not in columnOrder at the end
      const remainingSuppliers = nonIncumbent.filter((s) => !columnOrder.includes(s.id))
      return incumbent ? [incumbent, ...orderedNonIncumbent, ...remainingSuppliers] : [...orderedNonIncumbent, ...remainingSuppliers]
    }

    // Default: pinned first, then others by rank
    const pinned = nonIncumbent.filter((s) => pinnedSuppliers.has(s.id))
    const others = nonIncumbent.filter((s) => !pinnedSuppliers.has(s.id))

    // Sort pinned and others by rank
    pinned.sort((a, b) => a.rank - b.rank)
    others.sort((a, b) => a.rank - b.rank)

    return incumbent ? [incumbent, ...pinned, ...others] : [...pinned, ...others]
  }, [suppliers, hiddenSuppliers, pinnedSuppliers, columnOrder])

  // Calculate per-product averages if detailData is provided
  const perProductAverages = useMemo(() => {
    if (!detailData) return null
    const supplierIds = sortedSuppliers.map((s) => s.id)
    return calculatePerProductAverages(detailData, supplierIds)
  }, [detailData, sortedSuppliers])

  // Build metric rows
  const metricRows: MetricRow[] = useMemo(() => {
    // Build children rows for Avg Price if we have per-product data
    const avgPriceChildren: MetricRow[] = []
    if (perProductAverages) {
      // Order products in desired display order
      const productOrder = ['87 Octane', '93 Octane', 'Diesel']

      productOrder.forEach((product) => {
        if (perProductAverages[product]) {
          const productValues: Record<string, { value: string }> = {}
          sortedSuppliers.forEach((supplier) => {
            const avgValue = perProductAverages[product][supplier.id]
            productValues[supplier.id] = { value: avgValue ? formatPrice(avgValue) : '—' }
          })
          avgPriceChildren.push({
            key: `avgPrice-${product.toLowerCase().replace(' ', '-')}`,
            metric: 'price',
            label: product,
            values: productValues,
          })
        }
      })
    }

    const rows: MetricRow[] = [
      {
        key: 'avgPrice',
        metric: 'price',
        label: 'Avg Price',
        values: {},
        isExpandable: avgPriceChildren.length > 0,
        children: avgPriceChildren.length > 0 ? avgPriceChildren : undefined,
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
        value: formatAllocationPeriod(m.allocationPeriod),
        status: m.allocationStatus,
      }
      rows[4].values[supplier.id] = { value: formatPenalties(m.penalties), status: m.penaltiesStatus }
      rows[5].values[supplier.id] = {
        value: m.issues.toString(),
        status: m.issues > 0 ? 'fail' : 'pass',
      }
    })

    return rows
  }, [sortedSuppliers, perProductAverages])

  // Check if supplier is dimmed by search
  const isDimmed = useCallback(
    (supplier: Supplier) => {
      if (!searchQuery) return false
      return !supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    },
    [searchQuery]
  )

  // Drag handlers for column reordering
  const handleDragStart = useCallback(
    (e: React.DragEvent, supplierId: string) => {
      setDraggingId(supplierId)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', supplierId)
    },
    []
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent, supplierId: string) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (supplierId !== draggingId) {
        setDragOverId(supplierId)
      }
    },
    [draggingId]
  )

  const handleDragLeave = useCallback(() => {
    setDragOverId(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, targetSupplierId: string) => {
      e.preventDefault()
      const sourceSupplierId = e.dataTransfer.getData('text/plain')

      if (sourceSupplierId && sourceSupplierId !== targetSupplierId && onColumnReorder) {
        // Get current order (excluding incumbent)
        const nonIncumbent = sortedSuppliers.filter((s) => !s.isIncumbent)
        const currentOrder = nonIncumbent.map((s) => s.id)

        // Find positions
        const sourceIndex = currentOrder.indexOf(sourceSupplierId)
        const targetIndex = currentOrder.indexOf(targetSupplierId)

        if (sourceIndex !== -1 && targetIndex !== -1) {
          // Reorder
          const newOrder = [...currentOrder]
          newOrder.splice(sourceIndex, 1)
          newOrder.splice(targetIndex, 0, sourceSupplierId)
          onColumnReorder(newOrder)
        }
      }

      setDraggingId(null)
      setDragOverId(null)
    },
    [sortedSuppliers, onColumnReorder]
  )

  const handleDragEnd = useCallback(() => {
    setDraggingId(null)
    setDragOverId(null)
  }, [])

  // Toggle row expansion
  const handleToggleExpand = useCallback((key: string) => {
    setExpandedRows((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }, [])

  // Render supplier header cell
  const renderSupplierHeader = useCallback(
    (supplier: Supplier) => {
      const isSelected = selectedSuppliers.has(supplier.id)
      const isPinned = pinnedSuppliers.has(supplier.id)
      const dimmed = isDimmed(supplier)
      const isDragging = draggingId === supplier.id
      const isDragOver = dragOverId === supplier.id
      const canDrag = !supplier.isIncumbent && !isViewingHistory && isManualMode && onColumnReorder

      const headerClasses = [
        styles.supplierHeader,
        supplier.isIncumbent ? styles.incumbent : '',
        dimmed ? styles.dimmed : '',
        isDragging ? styles.supplierHeaderDragging : '',
        isDragOver ? styles.supplierHeaderDragOver : '',
      ]
        .filter(Boolean)
        .join(' ')

      return (
        <div
          className={headerClasses}
          draggable={!!canDrag}
          onDragStart={canDrag ? (e) => handleDragStart(e, supplier.id) : undefined}
          onDragOver={canDrag ? (e) => handleDragOver(e, supplier.id) : undefined}
          onDragLeave={canDrag ? handleDragLeave : undefined}
          onDrop={canDrag ? (e) => handleDrop(e, supplier.id) : undefined}
          onDragEnd={canDrag ? handleDragEnd : undefined}
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
                  {/* Drag handle - only for non-incumbent when reorder is enabled */}
                  {canDrag && (
                    <Tooltip title='Drag to reorder'>
                      <span className={styles.dragHandle}>
                        <HolderOutlined />
                      </span>
                    </Tooltip>
                  )}
                  {/* Pin icon - not shown for incumbent */}
                  {!supplier.isIncumbent && (
                    <Tooltip title={isPinned ? 'Unpin' : 'Pin'}>
                      <span className={styles.actionIcon} onClick={() => onTogglePin(supplier.id)}>
                        {isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                      </span>
                    </Tooltip>
                  )}
                  {/* Hide icon - not available for incumbent */}
                  {!supplier.isIncumbent ? (
                    <Tooltip title='Hide'>
                      <span className={styles.actionIcon} onClick={() => onToggleHide(supplier.id)}>
                        <EyeInvisibleOutlined />
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title='Incumbent'>
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
    [
      selectedSuppliers,
      pinnedSuppliers,
      isDimmed,
      isViewingHistory,
      isManualMode,
      onToggleSelection,
      onTogglePin,
      onToggleHide,
      onColumnReorder,
      draggingId,
      dragOverId,
      handleDragStart,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleDragEnd,
    ]
  )

  // Build table columns
  const columns: ColumnsType<MetricRow> = useMemo(() => {
    const cols: ColumnsType<MetricRow> = [
      {
        title: 'METRIC',
        dataIndex: 'label',
        key: 'metric',
        width: 140,
        fixed: 'left',
        render: (label: string, record: MetricRow) => {
          const isExpanded = expandedRows.includes(record.key)
          const isExpandable = record.isExpandable && record.children && record.children.length > 0

          return (
            <div
              className={`${styles.metricLabel} ${record.metric === currentMetric ? styles.metricActive : ''}`}
              onClick={() => onMetricClick?.(record.metric)}
            >
              <Horizontal alignItems='center' style={{ gap: '8px' }}>
                {isExpandable && (
                  <span
                    className={styles.expandIcon}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleExpand(record.key)
                    }}
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <RightOutlined />
                  </span>
                )}
                <Texto weight="600">{label}</Texto>
              </Horizontal>
            </div>
          )
        },
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

          // Special rendering for Issues row - wrap in Popover
          if (record.key === 'issues') {
            const hasIssues = supplier.metrics.issues > 0
            return (
              <Popover
                content={<IssuesDetailContent supplier={supplier} />}
                trigger='click'
                placement='bottom'
              >
                <Horizontal
                  alignItems='center'
                  style={{ gap: '8px', cursor: 'pointer' }}
                  className={hasIssues ? styles.issuesClickable : undefined}
                >
                  <Texto>{cellData.value}</Texto>
                  <StatusIndicator status={cellData.status} />
                </Horizontal>
              </Popover>
            )
          }

          return (
            <Horizontal alignItems='center' style={{ gap: '8px' }}>
              <Texto>{cellData.value}</Texto>
              <StatusIndicator status={cellData.status} />
            </Horizontal>
          )
        },
      })
    })

    return cols
  }, [sortedSuppliers, currentMetric, renderSupplierHeader, isDimmed, onMetricClick, expandedRows, handleToggleExpand])

  // Build table data with expanded children
  const tableData = useMemo(() => {
    const result: MetricRow[] = []
    metricRows.forEach((row) => {
      result.push(row)
      // If this row is expanded and has children, add them
      if (expandedRows.includes(row.key) && row.children) {
        row.children.forEach((child) => {
          result.push({
            ...child,
            key: child.key, // Keep the child key
          })
        })
      }
    })
    return result
  }, [metricRows, expandedRows])

  return (
    <div className={styles.matrixContainer} style={{ height: 'auto', minHeight: 'fit-content', flexShrink: 0 }}>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="key"
        pagination={false}
        size="small"
        bordered
        tableLayout="auto"
        expandable={{ childrenColumnName: 'notUsed' }}
        rowClassName={(record) =>
          record.key.startsWith('avgPrice-') && record.key !== 'avgPrice' ? styles.childRow : ''
        }
      />
    </div>
  )
}
