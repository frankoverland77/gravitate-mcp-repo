/**
 * Contract Detail Panel
 *
 * Nested grid component for master-detail pattern in the Contracts grid.
 * Shows contract line items when a row is expanded.
 */

import { GraviGrid, BBDTag } from '@gravitate-js/excalibrr'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

import type { ContractListItem, ContractDetail, ContractDetailStatus } from '../types/contract.types'

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/**
 * Format number with commas
 */
function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Format currency
 */
function formatCurrency(value: number | undefined): string {
  if (value === undefined) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

/**
 * Detail status tag renderer
 */
function DetailStatusRenderer({ value }: { value: ContractDetailStatus }) {
  const statusConfig: Record<ContractDetailStatus, { success?: boolean; warning?: boolean; error?: boolean; label: string }> = {
    ready: { success: true, label: 'Ready' },
    'in-progress': { warning: true, label: 'In Progress' },
    empty: { error: true, label: 'Empty' },
  }

  const config = statusConfig[value] || { label: value }

  return (
    <BBDTag success={config.success} warning={config.warning} error={config.error}>
      {config.label}
    </BBDTag>
  )
}

/**
 * Column definitions for the detail grid
 */
const detailColumnDefs: ColDef<ContractDetail>[] = [
  {
    field: 'product',
    headerName: 'Product',
    minWidth: 130,
  },
  {
    field: 'location',
    headerName: 'Origin',
    minWidth: 150,
  },
  {
    field: 'destination',
    headerName: 'Destination',
    minWidth: 150,
    valueFormatter: ({ value }) => value || '-',
  },
  {
    field: 'calendar',
    headerName: 'Calendar',
    minWidth: 130,
  },
  {
    field: 'startDate',
    headerName: 'From',
    minWidth: 120,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: 'endDate',
    headerName: 'To',
    minWidth: 120,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: 'provisionType',
    headerName: 'Price Type',
    minWidth: 100,
  },
  {
    field: 'fixedValue',
    headerName: 'Fixed Price',
    minWidth: 110,
    type: 'numericColumn',
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: 'quantity',
    headerName: 'Volume (GAL)',
    minWidth: 130,
    type: 'numericColumn',
    valueFormatter: ({ value }) => formatNumber(value),
  },
  {
    field: 'status',
    headerName: 'Status',
    minWidth: 110,
    cellRenderer: DetailStatusRenderer,
  },
]

interface ContractDetailPanelProps {
  data: ContractListItem
}

/**
 * Contract Detail Panel Component
 *
 * Renders a nested GraviGrid showing contract line items.
 * Used as the detailCellRenderer in the parent grid's master-detail configuration.
 */
export function ContractDetailPanel({ data }: ContractDetailPanelProps) {
  return (
    <div className='p-3 ml-3' style={{ backgroundColor: 'var(--theme-bg-elevated)' }}>
      <GraviGrid
        agPropOverrides={{
          domLayout: 'autoHeight',
          getRowId: (params: { data: ContractDetail }) => params.data.id,
        }}
        rowData={data.details}
        columnDefs={detailColumnDefs}
        storageKey={`contract-${data.id}-details`}
        controlBarProps={{
          title: `Contract Details (${data.details.length} items)`,
          hideActiveFilters: true,
        }}
      />
    </div>
  )
}

/**
 * Detail cell renderer wrapper for AG Grid
 *
 * AG Grid passes the row data in params.data, so we wrap our component
 * to match the expected interface.
 */
export function ContractDetailCellRenderer(params: ICellRendererParams<ContractListItem>) {
  if (!params.data) return null
  return <ContractDetailPanel data={params.data} />
}
