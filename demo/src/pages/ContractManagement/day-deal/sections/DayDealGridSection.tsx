/**
 * Day Deal Grid Section
 *
 * Flat spreadsheet-like grid for day deal entry.
 * Each row is a fully independent deal: supplier, product, location, dates, price, volume.
 * Supports fill handle for drag-down, range selection, undo/redo, and context menu.
 */

import { useMemo, useCallback, useRef } from 'react'
import { Vertical, Horizontal, GraviGrid, GraviButton } from '@gravitate-js/excalibrr'
import { PlusOutlined, AppstoreAddOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import type { ColDef, ICellRendererParams, GetContextMenuItemsParams, GridApi } from 'ag-grid-community'

import type { ContractDetail } from '../../types/contract.types'
import { PRODUCT_OPTIONS, LOCATION_OPTIONS, EXTERNAL_PARTY_OPTIONS } from '../../data/contract.data'
import styles from './DayDealGridSection.module.css'

interface DayDealGridSectionProps {
  details: ContractDetail[]
  selectedIds: string[]
  onDetailUpdate: (detail: ContractDetail) => void
  onDetailDelete: (detailId: string) => void
  onSelectionChange: (selectedIds: string[]) => void
  onAddDetail: () => void
  onBulkEdit: () => void
  onBulkCreate: () => void
  onImport: () => void
}

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

export function DayDealGridSection({
  details,
  selectedIds,
  onDetailUpdate,
  onDetailDelete,
  onSelectionChange,
  onAddDetail,
  onBulkEdit,
  onBulkCreate,
  onImport,
}: DayDealGridSectionProps) {
  const gridApiRef = useRef<GridApi | null>(null)

  const columnDefs = useMemo<ColDef<ContractDetail>[]>(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 48,
        maxWidth: 48,
        minWidth: 48,
        pinned: 'left',
        lockPosition: true,
        suppressMenu: true,
        resizable: false,
        suppressMovable: true,
      },
      {
        field: 'supplier',
        headerName: 'Supplier',
        minWidth: 160,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: EXTERNAL_PARTY_OPTIONS,
        },
      },
      {
        field: 'product',
        headerName: 'Product',
        minWidth: 140,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: PRODUCT_OPTIONS.map((p) => p.name),
        },
      },
      {
        field: 'location',
        headerName: 'Location',
        minWidth: 160,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: LOCATION_OPTIONS.map((l) => l.name),
        },
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        minWidth: 120,
        valueFormatter: ({ value }) => (value ? formatDate(value) : ''),
        editable: true,
        cellEditor: 'agDateCellEditor',
      },
      {
        field: 'endDate',
        headerName: 'End Date',
        minWidth: 120,
        valueFormatter: ({ value }) => (value ? formatDate(value) : ''),
        editable: true,
        cellEditor: 'agDateCellEditor',
      },
      {
        field: 'fixedValue',
        headerName: 'Price ($)',
        minWidth: 120,
        type: 'numericColumn',
        editable: true,
        valueFormatter: ({ value }) => (value != null ? `$${Number(value).toFixed(4)}` : ''),
        valueSetter: (params) => {
          const raw = String(params.newValue).replace(/[$,]/g, '')
          const newValue = parseFloat(raw)
          if (!isNaN(newValue)) {
            params.data.fixedValue = newValue
            return true
          }
          return false
        },
      },
      {
        field: 'quantity',
        headerName: 'Volume',
        minWidth: 120,
        type: 'numericColumn',
        editable: true,
        valueFormatter: ({ value }) => (value ? new Intl.NumberFormat('en-US').format(value) : ''),
        valueSetter: (params) => {
          const newValue = parseFloat(params.newValue)
          if (!isNaN(newValue)) {
            params.data.quantity = newValue
            return true
          }
          return false
        },
      },
      {
        headerName: '',
        width: 48,
        maxWidth: 48,
        minWidth: 48,
        pinned: 'right',
        lockPosition: true,
        suppressMenu: true,
        resizable: false,
        suppressMovable: true,
        cellClass: 'action-cell',
        cellRenderer: (params: ICellRendererParams<ContractDetail>) => (
          <DeleteOutlined
            style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.45)', fontSize: 16 }}
            onClick={() => params.data && onDetailDelete(params.data.id)}
          />
        ),
      },
    ],
    [onDetailDelete],
  )

  const handleCellValueChanged = useCallback(
    (event: { data: ContractDetail }) => {
      onDetailUpdate({ ...event.data })
    },
    [onDetailUpdate],
  )

  const handleSelectionChanged = useCallback(() => {
    if (gridApiRef.current) {
      const selectedRows = gridApiRef.current.getSelectedRows()
      const ids = selectedRows.map((row: ContractDetail) => row.id)
      onSelectionChange(ids)
    }
  }, [onSelectionChange])

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams<ContractDetail>) => [
      'copy',
      'copyWithHeaders',
      'separator',
      {
        name: 'Duplicate Row',
        action: () => {
          if (params.node?.data) {
            const duplicated: ContractDetail = {
              ...params.node.data,
              id: `detail-${Date.now()}`,
            }
            onDetailUpdate(duplicated)
          }
        },
      },
      {
        name: 'Delete Row',
        action: () => {
          if (params.node?.data) {
            onDetailDelete(params.node.data.id)
          }
        },
      },
    ],
    [onDetailUpdate, onDetailDelete],
  )

  return (
    <Vertical className={styles.container}>
      <Vertical flex='1' className={styles['grid-wrapper']}>
        <GraviGrid
          agPropOverrides={{
            getRowId: (params) => params.data.id,
            onGridReady: (params) => {
              gridApiRef.current = params.api
            },
            onCellValueChanged: handleCellValueChanged,
            onSelectionChanged: handleSelectionChanged,
            getContextMenuItems,
            stopEditingWhenCellsLoseFocus: true,
            undoRedoCellEditing: true,
            undoRedoCellEditingLimit: 20,
            rowSelection: 'multiple' as const,
            enableFillHandle: true,
            enableRangeSelection: true,
            allowContextMenuWithControlKey: true,
          }}
          columnDefs={columnDefs}
          rowData={details}
          storageKey='DayDealDetailsGrid_v2'
          controlBarProps={{
            title: 'Day Deals',
            hideActiveFilters: true,
            actionButtons: (
              <Horizontal alignItems='center' style={{ gap: '8px' }}>
                {selectedIds.length > 0 && (
                  <GraviButton
                    buttonText={`Apply to Selected (${selectedIds.length})`}
                    onClick={onBulkEdit}
                  />
                )}
                <GraviButton buttonText='Import' icon={<UploadOutlined />} onClick={onImport} />
                <GraviButton buttonText='Bulk Add' icon={<AppstoreAddOutlined />} onClick={onBulkCreate} />
                <GraviButton buttonText='Add Day Deal' theme1 icon={<PlusOutlined />} onClick={onAddDetail} />
              </Horizontal>
            ),
          }}
        />
      </Vertical>
    </Vertical>
  )
}
