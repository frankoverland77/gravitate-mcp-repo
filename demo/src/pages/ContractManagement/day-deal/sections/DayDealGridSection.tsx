/**
 * Day Deal Grid Section
 *
 * Simplified grid for day deal contract details.
 * 8 columns: checkbox, detail ID, product, location, start date, end date, price, quantity, delete.
 * No formula, destination, calendar, effectiveTime, or status columns.
 */

import { useMemo, useCallback, useRef } from 'react';
import { Vertical, GraviGrid, GraviButton, BBDTag } from '@gravitate-js/excalibrr';
import { PlusOutlined, AppstoreAddOutlined, DeleteOutlined } from '@ant-design/icons';
import type {
  ColDef,
  ICellRendererParams,
  GetContextMenuItemsParams,
  GridApi,
} from 'ag-grid-community';

import type { ContractDetail } from '../../types/contract.types';
import { PRODUCT_OPTIONS, LOCATION_OPTIONS } from '../../data/contract.data';
import styles from './DayDealGridSection.module.css';

interface DayDealGridSectionProps {
  details: ContractDetail[];
  selectedIds: string[];
  onDetailUpdate: (detail: ContractDetail) => void;
  onDetailDelete: (detailId: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  onAddDetail: () => void;
  onBulkEdit: () => void;
  onBulkCreate: () => void;
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Detail ID badge renderer
 */
function DetailIdRenderer({ value }: { value: string }) {
  return (
    <BBDTag>
      <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{value}</span>
    </BBDTag>
  );
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
}: DayDealGridSectionProps) {
  const gridApiRef = useRef<GridApi | null>(null);

  const columnDefs = useMemo<ColDef<ContractDetail>[]>(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        pinned: 'left',
        lockPosition: true,
        suppressMenu: true,
      },
      {
        field: 'id',
        headerName: 'Detail ID',
        minWidth: 130,
        cellRenderer: (params: ICellRendererParams<ContractDetail>) => (
          <DetailIdRenderer value={params.value} />
        ),
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
          const raw = String(params.newValue).replace(/[$,]/g, '');
          const newValue = parseFloat(raw);
          if (!isNaN(newValue)) {
            params.data.fixedValue = newValue;
            return true;
          }
          return false;
        },
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        minWidth: 120,
        type: 'numericColumn',
        editable: true,
        valueFormatter: ({ value }) => (value ? new Intl.NumberFormat('en-US').format(value) : ''),
        valueSetter: (params) => {
          const newValue = parseFloat(params.newValue);
          if (!isNaN(newValue)) {
            params.data.quantity = newValue;
            return true;
          }
          return false;
        },
      },
      {
        headerName: '',
        width: 50,
        pinned: 'right',
        lockPosition: true,
        suppressMenu: true,
        cellRenderer: (params: ICellRendererParams<ContractDetail>) => (
          <DeleteOutlined
            style={{ cursor: 'pointer', color: 'var(--theme-color-3)' }}
            onClick={() => params.data && onDetailDelete(params.data.id)}
          />
        ),
      },
    ],
    [onDetailDelete]
  );

  const handleCellValueChanged = useCallback(
    (event: { data: ContractDetail }) => {
      onDetailUpdate({ ...event.data });
    },
    [onDetailUpdate]
  );

  const handleSelectionChanged = useCallback(() => {
    if (gridApiRef.current) {
      const selectedRows = gridApiRef.current.getSelectedRows();
      const ids = selectedRows.map((row: ContractDetail) => row.id);
      onSelectionChange(ids);
    }
  }, [onSelectionChange]);

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams<ContractDetail>) => [
      {
        name: 'Duplicate Row',
        action: () => {
          if (params.node?.data) {
            const duplicated: ContractDetail = {
              ...params.node.data,
              id: `detail-${Date.now()}`,
            };
            onDetailUpdate(duplicated);
          }
        },
      },
      {
        name: 'Delete Row',
        action: () => {
          if (params.node?.data) {
            onDetailDelete(params.node.data.id);
          }
        },
      },
    ],
    [onDetailUpdate, onDetailDelete]
  );

  return (
    <Vertical className={styles.container}>
      <Vertical flex="1" className={styles['grid-wrapper']}>
        <GraviGrid
          agPropOverrides={{
            getRowId: (params) => params.data.id,
            onGridReady: (params) => {
              gridApiRef.current = params.api;
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
          storageKey="DayDealDetailsGrid"
          controlBarProps={{
            title: `Day Deal Details (${details.length} Results)`,
            hideActiveFilters: true,
            actionButtons: (
              <>
                {selectedIds.length > 0 && (
                  <GraviButton
                    buttonText={`Apply to Selected (${selectedIds.length})`}
                    onClick={onBulkEdit}
                    size="small"
                  />
                )}
                <GraviButton
                  buttonText="Bulk Add"
                  icon={<AppstoreAddOutlined />}
                  onClick={onBulkCreate}
                  size="small"
                />
                <GraviButton
                  buttonText="Add Detail"
                  theme1
                  icon={<PlusOutlined />}
                  onClick={onAddDetail}
                  size="small"
                />
              </>
            ),
          }}
        />
      </Vertical>
    </Vertical>
  );
}
