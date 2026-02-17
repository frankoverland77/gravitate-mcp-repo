/**
 * Details Grid Section
 *
 * Main grid with inline editing for contract details.
 * Formula cell click opens the formula editor drawer.
 * Action buttons rendered via GraviGrid controlBarProps.
 */

import { useMemo, useCallback, useRef, type MutableRefObject, type Dispatch, type SetStateAction } from 'react'
import { Vertical, Horizontal, GraviGrid, GraviButton, BBDTag } from '@gravitate-js/excalibrr'
import { PlusOutlined, AppstoreAddOutlined, DeleteOutlined, GroupOutlined } from '@ant-design/icons'
import type { ColDef, ICellRendererParams, GetContextMenuItemsParams, GridApi } from 'ag-grid-community'

import type { ContractDetail, ContractDetailStatus, ContractStatus, VolumeGroup } from '../../types/contract.types'
import { VolumeGroupCellRenderer, VolumeGroupCellEditor } from '../components/volume-group'
import { BulkSelectEditor, BulkNumberEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { BulkDateEditor } from '@components/shared/Grid/bulkChange/BulkDateEditor'
import { PRODUCT_OPTIONS, LOCATION_OPTIONS, CALENDAR_OPTIONS, EFFECTIVE_TIME_OPTIONS } from '../../data/contract.data'
import styles from './DetailsGridSection.module.css'

interface DetailsGridSectionProps {
  details: ContractDetail[]
  selectedIds?: string[]
  onFormulaClick: (detail: ContractDetail) => void
  onDetailUpdate: (detail: ContractDetail) => void
  onDetailDelete: (detailId: string) => void
  onSelectionChange: (selectedIds: string[]) => void
  onAddDetail: () => void
  onBulkCreate: () => void
  contractStatus?: ContractStatus
  isBulkChangeVisible?: boolean
  setIsBulkChangeVisible?: Dispatch<SetStateAction<boolean>>
  onBulkUpdate?: (rows: ContractDetail | ContractDetail[]) => Promise<void>
  volumeGroups?: VolumeGroup[]
  onManageGroups?: () => void
  onOpenCreateGroup?: () => void
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
        style={{ cursor: 'pointer', fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.35)' }}
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
  onFormulaClick,
  onDetailUpdate,
  onDetailDelete,
  onSelectionChange,
  onAddDetail,
  onBulkCreate,
  contractStatus,
  isBulkChangeVisible,
  setIsBulkChangeVisible,
  onBulkUpdate,
  volumeGroups = [],
  onManageGroups,
  onOpenCreateGroup,
}: DetailsGridSectionProps) {
  const gridApiRef = useRef() as MutableRefObject<GridApi>

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
              width: 48,
              maxWidth: 48,
              minWidth: 48,
              pinned: 'left' as const,
              lockPosition: true,
              suppressMenu: true,
              resizable: false,
              suppressMovable: true,
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
        ...(!isExpired && {
          isBulkEditable: true,
          bulkCellEditor: BulkSelectEditor,
          bulkCellEditorParams: {
            propKey: 'product',
            options: PRODUCT_OPTIONS.map((p) => ({ Value: p.name, Text: p.name })),
          },
        }),
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
        ...(!isExpired && {
          isBulkEditable: true,
          bulkCellEditor: BulkSelectEditor,
          bulkCellEditorParams: {
            propKey: 'location',
            options: LOCATION_OPTIONS.map((l) => ({ Value: l.name, Text: l.name })),
          },
        }),
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
        field: 'volumeGroupIds',
        headerName: 'Volume Group',
        minWidth: 180,
        editable: !isReadOnly,
        cellRenderer: VolumeGroupCellRenderer,
        cellRendererParams: {
          volumeGroups,
        },
        cellEditor: VolumeGroupCellEditor,
        cellEditorParams: {
          volumeGroups,
          onOpenCreateGroup,
        },
        cellEditorPopup: true,
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
        ...(!isExpired && {
          isBulkEditable: true,
          bulkCellEditor: BulkSelectEditor,
          bulkCellEditorParams: {
            propKey: 'calendar',
            options: CALENDAR_OPTIONS.map((c) => ({ Value: c, Text: c })),
          },
        }),
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        minWidth: 120,
        valueFormatter: ({ value }) => (value ? formatDate(value) : ''),
        editable: !isReadOnly,
        cellEditor: 'agDateCellEditor',
        ...(!isExpired && {
          isBulkEditable: true,
          bulkCellEditor: BulkDateEditor,
          bulkCellEditorParams: {
            propKey: 'startDate',
          },
        }),
      },
      {
        field: 'endDate',
        headerName: 'End Date',
        minWidth: 120,
        valueFormatter: ({ value }) => (value ? formatDate(value) : ''),
        editable: !isReadOnly,
        cellEditor: 'agDateCellEditor',
        ...(!isExpired && {
          isBulkEditable: true,
          bulkCellEditor: BulkDateEditor,
          bulkCellEditorParams: {
            propKey: 'endDate',
          },
        }),
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
        ...(!isExpired && {
          isBulkEditable: true,
          bulkCellEditor: BulkSelectEditor,
          bulkCellEditorParams: {
            propKey: 'effectiveTime',
            options: EFFECTIVE_TIME_OPTIONS.map((t) => ({ Value: t, Text: t })),
          },
        }),
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
              if (!formula) return <span style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.35)' }}>—</span>
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
        ...(!isExpired && {
          isBulkEditable: true,
          bulkCellEditor: BulkNumberEditor,
          bulkCellEditorParams: {
            propKey: 'quantity',
            min: 0,
          },
        }),
      },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 110,
        cellRenderer: StatusRenderer,
        pinned: 'right',
        cellStyle: { display: 'flex', alignItems: 'center' },
      },
      ...(!isExpired
        ? [
            {
              headerName: '',
              width: 48,
              maxWidth: 48,
              minWidth: 48,
              pinned: 'right' as const,
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
          ]
        : []),
    ]
    return cols
  }, [onFormulaClick, onDetailDelete, contractStatus, volumeGroups, onOpenCreateGroup])

  // Handle cell value changes
  const handleCellValueChanged = useCallback(
    (event: { data: ContractDetail }) => {
      onDetailUpdate({ ...event.data })
    },
    [onDetailUpdate]
  )

  // Handle selection changes (GraviGrid passes { api } in the event)
  const handleSelectionChanged = useCallback(
    (e: { api: GridApi }) => {
      const selectedRows = e.api.getSelectedRows() as ContractDetail[]
      const ids = selectedRows.map((row) => row.id)
      onSelectionChange(ids)
    },
    [onSelectionChange],
  )

  // Context menu items
  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams<ContractDetail>) => {
      const result = [
        'copy',
        'copyWithHeaders',
        'separator',
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
          externalRef={gridApiRef}
          agPropOverrides={{
            getRowId: (params) => params.data.id,
            onCellValueChanged: handleCellValueChanged,
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
          storageKey='QuickEntryDetailsGrid_v2'
          onSelectionChanged={handleSelectionChanged}
          isBulkChangeVisible={isBulkChangeVisible}
          setIsBulkChangeVisible={setIsBulkChangeVisible}
          isBulkChangeCompactMode
          bulkDrawerTitle='CONTRACT DETAILS'
          updateEP={onBulkUpdate}
          controlBarProps={{
            title: 'Contract Details',
            hideActiveFilters: true,
            actionButtons: isExpired ? undefined : (
              <Horizontal alignItems='center' style={{ gap: '8px' }}>
                <GraviButton buttonText='Manage Groups' icon={<GroupOutlined />} onClick={onManageGroups} />
                <GraviButton buttonText='Bulk Add' icon={<AppstoreAddOutlined />} onClick={onBulkCreate} />
                <GraviButton
                  buttonText='Add Detail'
                  theme1
                  icon={<PlusOutlined />}
                  onClick={onAddDetail}
                />
              </Horizontal>
            ),
          }}
        />
      </Vertical>
    </Vertical>
  )
}
