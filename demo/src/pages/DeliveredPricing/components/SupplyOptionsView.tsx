/**
 * Unified Supply Options & Volume Commitments View
 *
 * A single integrated grid where each row is a supply option (origin, supplier, channel)
 * with both price columns and volume commitment columns grouped by period (Month, Week, Day).
 * Users can search, sort, filter, and select a supply option to set the proposed cost.
 */

import { useMemo } from 'react'
import { GraviGrid } from '@gravitate-js/excalibrr'
import type { DeliveredPricingQuoteRow } from '../DeliveredPricing.data'
import { generateSupplyOptionsData, type SupplyOptionRow } from '../supplyOptions.data'

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

const changeFormatter = (params: any) => {
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

function statusCellStyle(params: any) {
  if (params.value == null) return {}
  switch (params.value) {
    case 'Ahead':
      return { color: 'var(--theme-success)', fontWeight: 'bold' }
    case 'On Track':
      return { color: 'green' }
    case 'Behind':
      return { color: 'var(--theme-warning)' }
    case 'At Risk':
      return { color: 'var(--theme-error)', fontWeight: 'bold' }
    default:
      return {}
  }
}

function pctCellStyle(params: any) {
  if (params.value == null) return {}
  if (params.value >= 100) return { color: 'var(--theme-success)', fontWeight: 'bold' }
  if (params.value < 70) return { color: 'var(--theme-error)' }
  return {}
}

// ============================================================================
// Column Definitions
// ============================================================================

/** Build volume metric columns for a given period key (month, week, day) */
function periodColumns(periodKey: 'month' | 'week' | 'day', headerName: string) {
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
      },
      {
        field: `${periodKey}.liftings`,
        headerName: 'Liftings',
        valueFormatter: numberFormatter,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 100,
      },
      {
        field: `${periodKey}.status`,
        headerName: 'Status',
        cellStyle: statusCellStyle,
        filter: true,
        sortable: true,
        width: 95,
      },
      {
        field: `${periodKey}.toDateForecast`,
        headerName: 'TD Forecast',
        valueFormatter: numberFormatter,
        type: 'rightAligned',
        filter: 'agNumberColumnFilter',
        sortable: true,
        width: 110,
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
      },
      {
        field: 'supplier',
        headerName: 'Supplier',
        filter: true,
        sortable: true,
        width: 110,
        pinned: 'left' as const,
      },
      {
        field: 'channel',
        headerName: 'Channel',
        filter: true,
        sortable: true,
        width: 100,
        pinned: 'left' as const,
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
      },
      {
        field: 'priceRank',
        headerName: 'Rank',
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        width: 80,
        cellStyle: (params: any) => {
          if (params.value === 1) return { color: 'var(--theme-success)', fontWeight: 'bold' }
          return {}
        },
      },
      {
        field: 'change',
        headerName: 'Change',
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        valueFormatter: changeFormatter,
        width: 95,
        cellStyle: (params: any) => {
          if (params.value < 0) return { color: 'var(--theme-error)' }
          if (params.value > 0) return { color: 'green' }
          return {}
        },
      },
    ],
  },
  // Period volume groups
  periodColumns('month', 'Month'),
  periodColumns('week', 'Week'),
  periodColumns('day', 'Day'),
]

// ============================================================================
// Component
// ============================================================================

export function SupplyOptionsView({
  selectedRow,
  activeSupplyOptionIds,
  onSupplyOptionsSelected,
}: SupplyOptionsViewProps) {
  const rowData = useMemo(() => generateSupplyOptionsData(selectedRow), [selectedRow])

  const activeIdSet = useMemo(
    () => new Set(activeSupplyOptionIds ?? []),
    [activeSupplyOptionIds]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => String(params.data?.id),
      domLayout: 'normal' as const,
      headerHeight: 28,
      rowHeight: 26,
      rowSelection: 'multiple' as const,
      onRowSelected: (event: any) => {
        if (!onSupplyOptionsSelected || !event.node.isSelected()) return
        const selected: SupplyOptionRow[] = event.api.getSelectedRows()
        if (selected.length > 0) {
          onSupplyOptionsSelected(selected)
        }
      },
      getRowStyle: (params: any) => {
        if (activeIdSet.has(params.data?.id)) {
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
      controlBarProps={{ title: 'Supply Options', hideActiveFilters: true }}
      headerHeight={28}
    />
  )
}
