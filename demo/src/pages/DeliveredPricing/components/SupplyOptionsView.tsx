/**
 * Unified Supply Options & Volume Commitments View
 *
 * A single integrated grid where each row is a supply option (origin, supplier, channel)
 * with both price columns and volume commitment columns grouped by period (Month, Week).
 * Users can search, sort, filter, and select a supply option to set the proposed cost.
 */

import { useMemo, useState } from 'react'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { Segmented, Tooltip } from 'antd'
import type { DeliveredPricingQuoteRow } from '../DeliveredPricing.data'
import { generateSupplyOptionsData, type SupplyOptionRow } from '../supplyOptions.data'

type SupplyOptionsViewMode = 'all' | 'top5'

interface SupplyOptionsViewProps {
  selectedRow: DeliveredPricingQuoteRow
  /** The supply option IDs that should be highlighted as active */
  activeSupplyOptionIds?: number[]
  /** Called when the user selects one or more supply option rows (shift/ctrl/cmd multi-select) */
  onSupplyOptionsSelected?: (rows: SupplyOptionRow[]) => void
}

// ============================================================================
// Formatters & Styles
// ============================================================================

const currencyFormatter = (params: any) => {
  if (params.value == null) return ''
  return `$${Number(params.value).toFixed(4)}`
}

const deltaFormatter = (params: any) => {
  if (params.value == null) return ''
  const sign = params.value > 0 ? '+' : params.value < 0 ? '-' : ''
  return `${sign}${Math.abs(params.value).toFixed(4)}`
}

const numberFormatter = (params: any) => {
  if (params.value == null) return ''
  return Number(params.value).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const pctFormatter = (params: any) => {
  if (params.value == null) return ''
  return `${params.value}%`
}

/** Returns true when a supply option row has hit its allocation limit (month or week) */
function isAllocationLimitRow(data: SupplyOptionRow | undefined): boolean {
  if (!data) return false
  return data.month?.status === 'Allocation Limit' || data.week?.status === 'Allocation Limit'
}

/** Shared inactive cell style applied to every cell in an allocation-limited row */
const INACTIVE_CELL_STYLE = { color: '#bfbfbf' } as const

/** Status → stoplight color mapping */
const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  'On Track': { color: '#52c41a', label: 'On Track' },
  'Behind': { color: '#faad14', label: 'Behind' },
  'At Risk': { color: '#cf1322', label: 'At Risk' },
  'Allocation Limit': { color: '#bfbfbf', label: 'Allocation Limit' },
}

/** Renders a colored stoplight dot with tooltip showing the full status label */
function statusCellRenderer(params: any) {
  if (params.value == null) return null

  const config = STATUS_CONFIG[params.value]
  if (!config) return null

  // For allocation-limited rows, use muted gray regardless of individual cell status
  const isInactive = isAllocationLimitRow(params.data)
  const dotColor = isInactive ? '#d9d9d9' : config.color

  return (
    <Tooltip title={config.label} mouseEnterDelay={0.3}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: dotColor,
          }}
        />
      </div>
    </Tooltip>
  )
}

function pctCellStyle(params: any) {
  if (isAllocationLimitRow(params.data)) return INACTIVE_CELL_STYLE
  if (params.value == null) return {}
  if (params.value >= 100) return { color: 'var(--theme-success)', fontWeight: 'bold' }
  if (params.value < 70) return { color: 'var(--theme-error)' }
  return {}
}

// ============================================================================
// Column Definitions
// ============================================================================

/** Build volume metric columns for a given period key (month, week) */
function periodColumns(periodKey: 'month' | 'week', headerName: string) {
  return {
    headerName,
    marryChildren: true,
    children: [
      {
        field: `${periodKey}.forecast`,
        headerName: 'Forecast',
        valueFormatter: numberFormatter,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 100,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: `${periodKey}.liftings`,
        headerName: 'Liftings',
        valueFormatter: numberFormatter,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 100,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: `${periodKey}.status`,
        headerName: 'Status',
        cellRenderer: statusCellRenderer,
        filter: true,
        sortable: true,
        width: 55,
      },
      {
        field: `${periodKey}.toDateForecast`,
        headerName: 'TD Forecast',
        valueFormatter: numberFormatter,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 110,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: `${periodKey}.toDatePctOfForecast`,
        headerName: 'TD % Fcst',
        valueFormatter: pctFormatter,
        cellStyle: pctCellStyle,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 100,
      },
    ],
  }
}

const columnDefs = [
  // Supply option identity columns
  {
    headerName: 'Supply Option',
    marryChildren: true,
    children: [
      {
        field: 'originLocation',
        headerName: 'Origin',
        filter: true,
        sortable: true,
        width: 110,
        pinned: 'left' as const,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: 'supplier',
        headerName: 'Supplier',
        filter: true,
        sortable: true,
        width: 110,
        pinned: 'left' as const,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: 'channel',
        headerName: 'Channel',
        filter: true,
        sortable: true,
        width: 100,
        pinned: 'left' as const,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
    ],
  },
  // Pricing columns
  {
    headerName: 'Pricing',
    marryChildren: true,
    children: [
      {
        field: 'price',
        headerName: 'Price',
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        valueFormatter: currencyFormatter,
        width: 110,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: 'priceRank',
        headerName: 'Rank',
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        width: 80,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
      {
        field: 'delta',
        headerName: 'Delta',
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        valueFormatter: deltaFormatter,
        width: 95,
        cellStyle: (params: any) => (isAllocationLimitRow(params.data) ? INACTIVE_CELL_STYLE : {}),
      },
    ],
  },
  // Period volume groups
  periodColumns('month', 'Month'),
  periodColumns('week', 'Week'),
]

// ============================================================================
// Component
// ============================================================================

export function SupplyOptionsView({
  selectedRow,
  activeSupplyOptionIds,
  onSupplyOptionsSelected,
}: SupplyOptionsViewProps) {
  const [viewMode, setViewMode] = useState<SupplyOptionsViewMode>('all')

  const allRowData = useMemo(() => generateSupplyOptionsData(selectedRow), [selectedRow])

  const rowData = useMemo(() => {
    if (viewMode === 'top5') {
      // Focused view: all non-allocated contracts, top 3 rack prices, and all day deals
      const contracts = allRowData.filter(
        (row) => row.channel === 'Contract' && !isAllocationLimitRow(row)
      )
      const racks = allRowData
        .filter((row) => row.channel === 'Rack')
        .sort((a, b) => a.price - b.price)
        .slice(0, 3)
      const dayDeals = allRowData.filter((row) => row.channel === 'Day Deal')
      // Merge and deduplicate by id, preserving original order
      const idSet = new Set<number>()
      const merged: SupplyOptionRow[] = []
      for (const row of [...contracts, ...racks, ...dayDeals]) {
        if (!idSet.has(row.id)) {
          idSet.add(row.id)
          merged.push(row)
        }
      }
      // Sort by price rank for consistent display
      return merged.sort((a, b) => a.priceRank - b.priceRank)
    }
    return allRowData
  }, [allRowData, viewMode])

  const activeIdSet = useMemo(
    () => new Set(activeSupplyOptionIds ?? []),
    [activeSupplyOptionIds]
  )

  const controlBarProps = useMemo(
    () => ({
      title: viewMode === 'top5' ? 'Supply Options — Focused' : 'Supply Options',
      hideActiveFilters: true,
      actionButtons: (
        <Segmented
          size="small"
          value={viewMode}
          onChange={(val) => setViewMode(val as SupplyOptionsViewMode)}
          options={[
            { label: 'All', value: 'all' },
            { label: 'Top 5', value: 'top5' },
          ]}
        />
      ),
    }),
    [viewMode]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => String(params.data?.id),
      domLayout: 'normal' as const,
      headerHeight: 28,
      rowHeight: 26,
      rowSelection: 'multiple' as const,
      isRowSelectable: (node: any) => !isAllocationLimitRow(node.data),
      onRowSelected: (event: any) => {
        if (!onSupplyOptionsSelected || !event.node.isSelected()) return
        const selected: SupplyOptionRow[] = event.api.getSelectedRows()
        if (selected.length > 0) {
          onSupplyOptionsSelected(selected)
        }
      },
      getRowStyle: (params: any) => {
        const data: SupplyOptionRow | undefined = params.data
        if (isAllocationLimitRow(data)) {
          return {
            backgroundColor: 'var(--theme-bg-disabled, #f5f5f5)',
            color: '#bfbfbf',
            fontStyle: 'italic',
          }
        }
        if (activeIdSet.has(data?.id)) {
          return {
            backgroundColor: 'var(--theme-primary-dim, rgba(24, 144, 255, 0.08))',
            borderLeft: '3px solid var(--theme-primary, #1890ff)',
          }
        }
        return undefined
      },
    }),
    [activeIdSet, onSupplyOptionsSelected]
  )

  return (
    <GraviGrid
      storageKey="dp-supply-options-unified-grid"
      rowData={rowData}
      columnDefs={columnDefs}
      agPropOverrides={agPropOverrides}
      controlBarProps={controlBarProps}
      headerHeight={28}
    />
  )
}
