import {
  GraviGrid,
  Vertical,
  Horizontal,
  Texto,
  NotificationMessage,
} from '@gravitate-js/excalibrr';
import { Tag } from 'antd';
import { useState, useMemo, useCallback } from 'react';
import { ColDef } from 'ag-grid-community';
import { BulkMultiSelectEditor } from './BulkMultiSelectEditor';
import {
  mockProducts,
  ProductRow,
  categoryOptions,
  tagOptions,
  regionOptions,
} from './BulkChangeTest.data';

export function BulkChangeTest() {
  const [rowData, setRowData] = useState<ProductRow[]>(mockProducts);
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false);

  const columnDefs: ColDef<ProductRow>[] = useMemo(
    () => [
      {
        field: 'ProductId',
        headerName: 'ID',
        maxWidth: 100,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        field: 'Name',
        headerName: 'Product Name',
        minWidth: 200,
      },
      {
        field: 'Categories',
        headerName: 'Categories',
        minWidth: 200,
        isBulkEditable: true,
        bulkCellEditor: BulkMultiSelectEditor,
        bulkCellEditorParams: {
          propKey: 'Categories',
          options: categoryOptions,
        },
        cellRenderer: ({ value }: { value: string[] }) => (
          <Horizontal gap={4} style={{ flexWrap: 'wrap' }}>
            {(value || []).map((cat) => {
              const option = categoryOptions.find((o) => o.Value === cat);
              return (
                <Tag key={cat} color="blue">
                  {option?.Text || cat}
                </Tag>
              );
            })}
          </Horizontal>
        ),
      },
      {
        field: 'Tags',
        headerName: 'Tags',
        minWidth: 180,
        isBulkEditable: true,
        bulkCellEditor: BulkMultiSelectEditor,
        bulkCellEditorParams: {
          propKey: 'Tags',
          options: tagOptions,
        },
        cellRenderer: ({ value }: { value: string[] }) => (
          <Horizontal gap={4} style={{ flexWrap: 'wrap' }}>
            {(value || []).map((tag) => {
              const option = tagOptions.find((o) => o.Value === tag);
              return (
                <Tag key={tag} color="green">
                  {option?.Text || tag}
                </Tag>
              );
            })}
          </Horizontal>
        ),
      },
      {
        field: 'Regions',
        headerName: 'Regions',
        minWidth: 180,
        isBulkEditable: true,
        bulkCellEditor: BulkMultiSelectEditor,
        bulkCellEditorParams: {
          propKey: 'Regions',
          options: regionOptions,
        },
        cellRenderer: ({ value }: { value: string[] }) => (
          <Horizontal gap={4} style={{ flexWrap: 'wrap' }}>
            {(value || []).map((region) => {
              const option = regionOptions.find((o) => o.Value === region);
              return (
                <Tag key={region} color="purple">
                  {option?.Text || region}
                </Tag>
              );
            })}
          </Horizontal>
        ),
      },
      {
        field: 'Price',
        headerName: 'Price',
        maxWidth: 120,
        valueFormatter: ({ value }: { value: number }) => value != null ? `$${value.toFixed(2)}` : '',
      },
      {
        field: 'IsActive',
        headerName: 'Active',
        maxWidth: 100,
        cellRenderer: ({ value }: { value: boolean }) => (
          <Tag color={value ? 'success' : 'default'}>{value ? 'Active' : 'Inactive'}</Tag>
        ),
      },
    ],
    []
  );

  const handleBulkUpdate = useCallback(async (rows: ProductRow | ProductRow[]) => {
    const updatedRows = Array.isArray(rows) ? rows : [rows];
    const updatedMap = new Map(updatedRows.map((u) => [u.ProductId, u]));

    setRowData((prev) => prev.map((row) => updatedMap.get(row.ProductId) || row));

    NotificationMessage('Success', `Updated ${updatedRows.length} products`, false);
    return Promise.resolve();
  }, []);

  return (
    <Vertical height="100%">
      <Vertical className="p-3 mb-2">
        <Texto category="h1">Bulk Change Test</Texto>
        <Texto category="p1" appearance="medium">
          Test bulk change with Replace, Increment (Add To), and Decrement (Remove From) modes for
          array-based columns. Select rows and click the bulk change button to modify Categories,
          Tags, or Regions.
        </Texto>
      </Vertical>

      <GraviGrid
        agPropOverrides={{
          getRowId: (params) => params.data.ProductId,
          rowSelection: 'multiple',
        }}
        columnDefs={columnDefs}
        rowData={rowData}
        storageKey="BulkChangeTestGrid"
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={setIsBulkChangeVisible}
        isBulkChangeCompactMode={false}
        bulkDrawerTitle="Bulk Edit Products"
        updateEP={handleBulkUpdate}
        controlBarProps={{
          title: 'Products',
          hideActiveFilters: true,
        }}
      />
    </Vertical>
  );
}
