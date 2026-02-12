/**
 * Details Grid Section
 *
 * Main grid with inline editing for contract details.
 * Formula cell click opens the formula editor drawer.
 * Action buttons rendered via GraviGrid controlBarProps.
 */

import { useMemo, useCallback, useRef } from 'react'
import { Vertical, GraviGrid, GraviButton, BBDTag } from '@gravitate-js/excalibrr'
import { PlusOutlined, AppstoreAddOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColDef, ICellRendererParams, GetContextMenuItemsParams, GridApi } from 'ag-grid-community'

import type { ContractDetail, ContractDetailStatus, ContractStatus } from '../../types/contract.types'
import { PRODUCT_OPTIONS, LOCATION_OPTIONS, CALENDAR_OPTIONS, EFFECTIVE_TIME_OPTIONS } from '../../data/contract.data'
import styles from './DetailsGridSection.module.css'

interface DetailsGridSectionProps {
  details: ContractDetail[]
  selectedIds: string[]
  onFormulaClick: (detail: ContractDetail) => void
  onDetailUpdate: (detail: ContractDetail) => void
  onDetailDelete: (detailId: string) => void
  onSelectionChange: (selectedIds: string[]) => void
  onAddDetail: () => void
  onBulkEdit: () => void
  onBulkCreate: () => void
  contractStatus?: ContractStatus
}

/**
 * Status cell renderer
 */
function StatusRenderer({ value }: { value: ContractDetailStatus }) {
  const config: Record<ContractDetailStatus, { success?: boolean; warning?: boolean; label: string }> = {
    ready: { success: true, label: 'Ready' },
    'in-progress': { warning: true, label: 'In Progress' },
    empty: { label: 'Empty' },
  }

  const { success, warning, label } = config[value] || { label: value }

  return (
    <BBDTag success={success} warning={warning}>
      {label}
    </BBDTag>
  )
}

/**
 * Formula cell renderer - clickable
 */
function FormulaRenderer({
  value,
  data,
  onClick,
}: {
  value: ContractDetail['formula']
  data: ContractDetail
  onClick: (detail: ContractDetail) => void
}) {
  const handleClick = () => onClick(data)
  const prefix =
    data.provisionType === 'Lesser Of 2'
      ? 'MIN\u2082: '
      : data.provisionType === 'Lesser Of 3'
        ? 'MIN\u2083: '
        : ''

  if (!value) {
    return (
      <span
        style={{ cursor: 'pointer', fontStyle: 'italic', color: 'var(--theme-color-3)' }}
        onClick={handleClick}
      >
        Click to configure...
      </span>
    )
  }

  return (
    <span style={{ cursor: 'pointer', color: 'var(--theme-color-link)' }} onClick={handleClick}>
      {prefix}{value.name || value.expression}
    </span>
  )
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

export function DetailsGridSection({
  details,
  selectedIds,
  onFormulaClick,
  onDetailUpdate,
  onDetailDelete,
  onSelectionChange,
  onAddDetail,
  onBulkEdit,
  onBulkCreate,
  contractStatus,
}: DetailsGridSectionProps) {
  const gridApiRef = useRef<GridApi | null>(null)

  const isExpired = contractStatus === 'expired'
  const isActive = contractStatus === 'active'
  const isReadOnly = isExpired

  function isFieldEditable(field: string, data: ContractDetail): boolean {
    if (isExpired) return false
    if (isActive) {
      if (['product', 'location', 'destination'].includes(field)) {
        return data.isNew === true
      }
      return true
    }
    return true
  }

  // Column definitions
  const columnDefs = useMemo<ColDef<ContractDetail>[]>(() => {
    const cols: ColDef<ContractDetail>[] = [
      ...(!isExpired
        ? [
            {
              headerCheckboxSelection: true,
              checkboxSelection: true,
              width: 50,
              pinned: 'left' as const,
              lockPosition: true,
              suppressMenu: true,
            },
          ]
        : []),
      {
        field: 'product',
        headerName: 'Product',
        minWidth: 140,
        editable: (params) => isFieldEditable('product', params.data!),
        cellClassRules: {
          'locked-cell': (params) => !isFieldEditable('product', params.data!),
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: PRODUCT_OPTIONS.map((p) => p.name),
        },
      },
      {
        field: 'location',
        headerName: 'Location',
        minWidth: 160,
        editable: (params) => isFieldEditable('location', params.data!),
        cellClassRules: {
          'locked-cell': (params) => !isFieldEditable('location', params.data!),
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: LOCATION_OPTIONS.map((l) => l.name),
        },
      },
      {
        field: 'destination',
        headerName: 'Destination',
        minWidth: 160,
        editable: (params) => isFieldEditable('destination', params.data!),
        cellClassRules: {
          'locked-cell': (params) => !isFieldEditable('destination', params.data!),
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['', ...LOCATION_OPTIONS.map((l) => l.name)],
        },
      },
      {
        field: 'calendar',
        headerName: 'Calendar',
        minWidth: 140,
        editable: !isReadOnly,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [...CALENDAR_OPTIONS],
        },
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        minWidth: 120,
        valueFormatter: ({ value }) => (value ? formatDate(value) : ''),
        editable: !isReadOnly,
        cellEditor: 'agDateCellEditor',
      },
      {
        field: 'endDate',
        headerName: 'End Date',
        minWidth: 120,
        valueFormatter: ({ value }) => (value ? formatDate(value) : ''),
        editable: !isReadOnly,
        cellEditor: 'agDateCellEditor',
      },
      {
        field: 'effectiveTime',
        headerName: 'Eff. Time',
        minWidth: 110,
        editable: !isReadOnly,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [...EFFECTIVE_TIME_OPTIONS],
        },
      },
      {
        field: 'formula',
        headerName: 'Formula',
        minWidth: 180,
        flex: 1,
        cellRenderer: isExpired
          ? (params: ICellRendererParams<ContractDetail>) => {
              const formula = params.value
              const data = params.data!
              const prefix =
                data.provisionType === 'Lesser Of 2'
                  ? 'MIN\u2082: '
                  : data.provisionType === 'Lesser Of 3'
                    ? 'MIN\u2083: '
                    : ''
              if (!formula) return <span style={{ fontStyle: 'italic', color: 'var(--theme-color-3)' }}>—</span>
              return (
                <span>
                  {prefix}
                  {formula.name || formula.expression}
                </span>
              )
            }
          : (params: ICellRendererParams<ContractDetail>) => (
              <FormulaRenderer value={params.value} data={params.data!} onClick={onFormulaClick} />
            ),
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        minWidth: 120,
        type: 'numericColumn',
        editable: !isReadOnly,
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
        field: 'status',
        headerName: 'Status',
        minWidth: 110,
        cellRenderer: StatusRenderer,
        pinned: 'right',
      },
      ...(!isExpired
        ? [
            {
              headerName: '',
              width: 50,
              pinned: 'right' as const,
              lockPosition: true,
              suppressMenu: true,
              cellRenderer: (params: ICellRendererParams<ContractDetail>) => (
                <DeleteOutlined
                  style={{ cursor: 'pointer', color: 'var(--theme-color-3)' }}
                  onClick={() => params.data && onDetailDelete(params.data.id)}
                />
              ),
            },
          ]
        : []),
    ]
    return cols
  }, [onFormulaClick, onDetailDelete, contractStatus])

  // Handle cell value changes
  const handleCellValueChanged = useCallback(
    (event: { data: ContractDetail }) => {
      onDetailUpdate({ ...event.data })
    },
    [onDetailUpdate]
  )

  // Handle selection changes
  const handleSelectionChanged = useCallback(() => {
    if (gridApiRef.current) {
      const selectedRows = gridApiRef.current.getSelectedRows()
      const ids = selectedRows.map((row: ContractDetail) => row.id)
      onSelectionChange(ids)
    }
  }, [onSelectionChange])

  // Context menu items
  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams<ContractDetail>) => {
      const result = [
        {
          name: 'Copy Formula',
          action: () => {
            if (params.node?.data?.formula) {
              // Store formula in clipboard context
              console.log('Copy formula:', params.node.data.formula)
            }
          },
          disabled: !params.node?.data?.formula,
        },
        {
          name: 'Paste Formula',
          action: () => {
            // Paste formula from clipboard context
            console.log('Paste formula to:', params.node?.data?.id)
          },
        },
        'separator',
        {
          name: 'Duplicate Row',
          disabled: isExpired,
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
          disabled: isExpired,
          action: () => {
            if (params.node?.data) {
              onDetailDelete(params.node.data.id)
            }
          },
        },
      ]
      return result
    },
    [onDetailUpdate, onDetailDelete]
  )

  return (
    <Vertical className={styles.container}>
      {/* Grid - takes full height */}
      <Vertical flex='1' className={styles.gridWrapper}>
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
          }}
          columnDefs={columnDefs}
          rowData={details}
          storageKey='QuickEntryDetailsGrid'
          controlBarProps={{
            title: `Contract Details (${details.length} Results)`,
            hideActiveFilters: true,
            actionButtons: isExpired ? undefined : (
              <>
                {selectedIds.length > 0 && (
                  <GraviButton
                    buttonText={`Apply to Selected (${selectedIds.length})`}
                    onClick={onBulkEdit}
                  />
                )}
                <GraviButton buttonText='Bulk Add' icon={<AppstoreAddOutlined />} onClick={onBulkCreate} />
                <GraviButton
                  buttonText='Add Detail'
                  theme1
                  icon={<PlusOutlined />}
                  onClick={onAddDetail}
                />
              </>
            ),
          }}
        />
      </Vertical>
    </Vertical>
  )
}
