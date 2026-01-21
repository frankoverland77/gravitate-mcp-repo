import { useMemo, useCallback } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { FilterOutlined } from '@ant-design/icons'
import { Table, Select, Checkbox, Popover } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Supplier, DetailRow, DetailMetric } from '../rfp.types'
import { PRODUCT_OPTIONS, LOCATION_OPTIONS } from '../rfp.types'
import { SAMPLE_DETAILS, formatPrice } from '../rfp.data'
import styles from './DetailGridSection.module.css'

interface DetailGridSectionProps {
  suppliers: Supplier[]
  hiddenSuppliers: Set<string>
  pinnedSuppliers: Set<string>
  currentMetric: DetailMetric
  searchQuery?: string
  selectedProducts: Set<string>
  selectedLocations: Set<string>
  onMetricChange: (metric: DetailMetric) => void
  onToggleProduct: (product: string) => void
  onToggleLocation: (location: string) => void
}

// Filter dropdown content
function FilterDropdown({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[]
  selected: Set<string>
  onToggle: (value: string) => void
}) {
  return (
    <Vertical style={{ gap: '8px', padding: '8px', minWidth: '150px' }}>
      {options.map((option) => (
        <Checkbox key={option} checked={selected.has(option)} onChange={() => onToggle(option)}>
          {option}
        </Checkbox>
      ))}
    </Vertical>
  )
}

// Metric display options
const METRIC_OPTIONS = [
  { value: 'price', label: 'Price' },
  { value: 'volume', label: 'Volume' },
  { value: 'ratability', label: 'Ratability' },
  { value: 'allocation', label: 'Allocation' },
  { value: 'penalties', label: 'Penalties' },
]

export function DetailGridSection({
  suppliers,
  hiddenSuppliers,
  pinnedSuppliers,
  currentMetric,
  searchQuery = '',
  selectedProducts,
  selectedLocations,
  onMetricChange,
  onToggleProduct,
  onToggleLocation,
}: DetailGridSectionProps) {
  // Filter detail rows (using props from parent)
  const filteredDetails = useMemo(() => {
    return SAMPLE_DETAILS.filter(
      (detail) => selectedProducts.has(detail.product) && selectedLocations.has(detail.location)
    )
  }, [selectedProducts, selectedLocations])

  // Sort suppliers: incumbent first, then pinned, then others
  const sortedSuppliers = useMemo(() => {
    const visible = suppliers.filter((s) => !hiddenSuppliers.has(s.id))
    const incumbent = visible.find((s) => s.isIncumbent)
    const pinned = visible.filter((s) => !s.isIncumbent && pinnedSuppliers.has(s.id))
    const others = visible.filter((s) => !s.isIncumbent && !pinnedSuppliers.has(s.id))

    pinned.sort((a, b) => a.rank - b.rank)
    others.sort((a, b) => a.rank - b.rank)

    return incumbent ? [incumbent, ...pinned, ...others] : [...pinned, ...others]
  }, [suppliers, hiddenSuppliers, pinnedSuppliers])

  // Check if supplier is dimmed by search
  const isDimmed = useCallback(
    (supplier: Supplier) => {
      if (!searchQuery) return false
      return !supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    },
    [searchQuery]
  )

  // Build columns
  const columns: ColumnsType<DetailRow> = useMemo(() => {
    const cols: ColumnsType<DetailRow> = [
      {
        title: (
          <Horizontal alignItems="center" style={{ gap: '8px' }}>
            <Texto weight="600">Product</Texto>
            <Popover
              content={
                <FilterDropdown
                  options={PRODUCT_OPTIONS}
                  selected={selectedProducts}
                  onToggle={onToggleProduct}
                />
              }
              trigger="click"
              placement="bottomLeft"
            >
              <FilterOutlined className={styles.filterIcon} />
            </Popover>
          </Horizontal>
        ),
        dataIndex: 'product',
        key: 'product',
        width: 120,
        fixed: 'left',
      },
      {
        title: (
          <Horizontal alignItems="center" style={{ gap: '8px' }}>
            <Texto weight="600">Location</Texto>
            <Popover
              content={
                <FilterDropdown
                  options={LOCATION_OPTIONS}
                  selected={selectedLocations}
                  onToggle={onToggleLocation}
                />
              }
              trigger="click"
              placement="bottomLeft"
            >
              <FilterOutlined className={styles.filterIcon} />
            </Popover>
          </Horizontal>
        ),
        dataIndex: 'location',
        key: 'location',
        width: 120,
      },
    ]

    // Add supplier columns
    sortedSuppliers.forEach((supplier) => {
      const displayName = supplier.bidCode ? `${supplier.name} (${supplier.bidCode})` : supplier.name
      cols.push({
        title: <Texto weight="600">{displayName}</Texto>,
        dataIndex: ['supplierValues', supplier.id],
        key: supplier.id,
        width: 100,
        className: isDimmed(supplier) ? styles.dimmedColumn : '',
        render: (value: number) => {
          // Format based on current metric
          if (currentMetric === 'price') {
            return <Texto>{formatPrice(value)}</Texto>
          }
          return <Texto>{value}</Texto>
        },
      })
    })

    return cols
  }, [sortedSuppliers, selectedProducts, selectedLocations, currentMetric, isDimmed, onToggleProduct, onToggleLocation])

  // Filter status text
  const filterStatus = useMemo(() => {
    const total = SAMPLE_DETAILS.length
    const showing = filteredDetails.length
    if (showing === total) {
      return `Showing all ${total} details`
    }
    return `Showing ${showing} of ${total} details (filtered)`
  }, [filteredDetails])

  return (
    <Vertical style={{ gap: '12px' }}>
      {/* Header with metric selector */}
      <Horizontal justifyContent="space-between" alignItems="center">
        <Horizontal alignItems="center" style={{ gap: '12px' }}>
          <Texto category="h5" weight="600">
            Product/Location Details
          </Texto>
          <Select
            value={currentMetric}
            onChange={onMetricChange}
            options={METRIC_OPTIONS}
            style={{ width: 120 }}
            size="small"
          />
        </Horizontal>
        <Texto category="p2" appearance="medium">
          {filterStatus}
        </Texto>
      </Horizontal>

      {/* Details table */}
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={filteredDetails}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="small"
          bordered
        />
      </div>
    </Vertical>
  )
}
