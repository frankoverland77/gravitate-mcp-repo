// GraviGrid Component Examples

export interface ComponentExample {
  id?: string;
  name: string;
  description: string;
  code: string;
  category?: string;
  complexity: "simple" | "medium" | "complex";
  tags?: string[];
  props?: Record<string, any>;
  dependencies?: string[];
  notes?: string;
  sourceFile?: string;
}
import { COLDEFS_EXAMPLES } from "./colDefs.js";

export const GRAVI_GRID_EXAMPLES: ComponentExample[] = [
  {
    name: "Pending Orders Dashboard Grid",
    description:
      "Simple read-only grid showing pending orders with basic column definitions",
    category: "data",
    complexity: "simple",
    tags: ["grid", "readonly", "dashboard", "simple"],
    code: `import { GraviGrid } from '@gravitate-js/excalibrr';
import React from 'react';

function PendingOrdersGrid({ data, isFetching }) {
  return (
    <GraviGrid
      agPropOverrides={{
        rowGroupPanelShow: 'never',
        getRowId: (row) => row?.data?.TradeEntryId,
        suppressCellSelection: true,
      }}
      columnDefs={[
        {
          headerName: 'ID #',
          field: 'TradeEntryId',
        },
        {
          headerName: 'Product',
          field: 'ProductName',
        },
        {
          headerName: 'Location',
          field: 'FromLocationName',
        },
        {
          headerName: 'Quantity (Gal)',
          field: 'Quantity',
          valueFormatter: ({ value }) => value?.toLocaleString(),
        },
        {
          headerName: 'Price',
          field: 'Price',
          valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`,
        }
      ]}
      rowData={data}
      loading={isFetching}
      controlBarProps={{ title: 'Pending Orders' }}
      rowSelection="none"
      enableRangeSelection={false}
    />
  );
}

export default PendingOrdersGrid;`,
  },

  {
    name: "Analytics Price Performance Grid",
    description: "Simple analytics grid with grouped data and basic filtering",
    category: "data",
    complexity: "medium",
    tags: ["grid", "analytics", "grouping", "readonly"],
    code: `import { GraviGrid } from '@gravitate-js/excalibrr';
import React, { useMemo } from 'react';

function PricePerformanceGrid({ gridData, loading, onRowSelected }) {
  const agPropOverrides = useMemo(() => ({
    onRowSelected,
    rowMultiSelectWithClick: true,
    suppressCellSelection: true,
    rowSelection: 'multiple',
    getRowId: (row) => \`\${row.data?.LocationId}-\${row.data?.ProductId}-\${row.data?.TradeEntryId}\`,
    rowHeight: 35,
    groupDefaultExpanded: -1,
    enableRangeSelection: true,
    showSelectedCount: true,
  }), [onRowSelected]);

  const columnDefs = [
    {
      headerName: 'External Counterparty',
      field: 'ExternalCounterParty',
    },
    {
      headerName: 'Start Date',
      field: 'StartDate',
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      headerName: 'End Date', 
      field: 'EndDate',
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      headerName: 'Product',
      field: 'Product',
    },
    {
      headerName: 'Location',
      field: 'Location',
    }
  ];

  return (
    <GraviGrid
      agPropOverrides={agPropOverrides}
      headerHeight={35}
      toolPanelWidth={260}
      rowData={gridData}
      loading={loading}
      columnDefs={columnDefs}
      storageKey="PricePerformanceGrid"
    />
  );
}

export default PricePerformanceGrid;`,
  },

  {
    name: "Basic Data List Grid",
    description:
      "Simple data listing with minimal configuration and standard patterns",
    category: "data",
    complexity: "simple",
    tags: ["grid", "list", "simple", "standard"],
    code: `import { GraviGrid } from '@gravitate-js/excalibrr';
import React, { useMemo } from 'react';

function DataListGrid({ data, loading, onSelectionChange }) {
  const agPropOverrides = useMemo(() => ({
    getRowId: (row) => row.data?.Id,
    rowSelection: 'multiple',
    rowHeight: 40,
  }), []);

  const columnDefs = [
    {
      headerName: 'Name',
      field: 'Name',
    },
    {
      headerName: 'Status',
      field: 'IsActive',
      valueFormatter: ({ value }) => value ? 'Active' : 'Inactive',
    },
    {
      headerName: 'Created',
      field: 'CreatedDate',
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      headerName: 'Description',
      field: 'Description',
    }
  ];

  return (
    <GraviGrid
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={data}
      loading={loading}
      onSelectionChanged={onSelectionChange}
      controlBarProps={{ title: 'Data List' }}
      storageKey="DataListGrid"
    />
  );
}

export default DataListGrid;`,
  },

  {
    name: "Grid with Bulk Change",
    description:
      "Complete GraviGrid with bulk change functionality for mass-updating multiple rows",
    category: "interactive",
    complexity: "complex",
    tags: ["grid", "bulk-change", "bulk-edit", "multi-select", "mass-update", "editable"],
    code: `import { GraviGrid, BBDTag, NotificationMessage } from '@gravitate-js/excalibrr';
import { useState, useMemo, useCallback } from 'react';
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors';

function ProductBulkEditGrid({ data, onUpdateProducts }) {
  // State for bulk change visibility
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false);

  const columnDefs = useMemo(() => [
    {
      field: 'ProductId',
      headerName: 'ID',
      maxWidth: 80,
    },
    {
      field: 'ProductName',
      headerName: 'Product',
      minWidth: 200,
    },
    {
      field: 'IsActive',
      headerName: 'Status',
      maxWidth: 120,
      // Enable bulk editing for this column
      isBulkEditable: true,
      // Specify the bulk editor component
      bulkCellEditor: BulkSelectEditor,
      // Configure the bulk editor
      bulkCellEditorParams: {
        accessor: 'IsActive',
        placeholder: 'Select Status',
        options: [
          { value: true, label: 'Active' },
          { value: false, label: 'Inactive' },
        ],
      },
      // Regular cell display
      cellRenderer: ({ value }) => (
        <BBDTag success={value} error={!value}>
          {value ? 'Active' : 'Inactive'}
        </BBDTag>
      ),
    },
    {
      field: 'CategoryId',
      headerName: 'Category',
      isBulkEditable: true,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        accessor: 'CategoryId',
        placeholder: 'Select Category',
        options: [
          { value: 1, label: 'Electronics' },
          { value: 2, label: 'Clothing' },
          { value: 3, label: 'Food' },
        ],
      },
      valueGetter: ({ data }) => {
        const categories = { 1: 'Electronics', 2: 'Clothing', 3: 'Food' };
        return categories[data?.CategoryId] ?? '';
      },
    },
  ], []);

  // Handler for saving bulk changes
  const handleBulkUpdate = useCallback(async (rows) => {
    try {
      await onUpdateProducts(rows);
      NotificationMessage('Success', 'Products updated successfully', false);
    } catch (error) {
      NotificationMessage('Error', 'Failed to update products', true);
    }
  }, [onUpdateProducts]);

  return (
    <GraviGrid
      agPropOverrides={{
        getRowId: (params) => params.data.ProductId,
      }}
      columnDefs={columnDefs}
      rowData={data}
      storageKey="ProductBulkEditGrid"
      // Bulk change props - REQUIRED
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={setIsBulkChangeVisible}
      isBulkChangeCompactMode
      updateEP={handleBulkUpdate}
      controlBarProps={{ title: 'Products' }}
    />
  );
}

export { ProductBulkEditGrid };`,
    notes: `
BULK CHANGE SETUP:
1. isBulkChangeVisible + setIsBulkChangeVisible control the bulk change bar
2. Each bulk-editable column needs: isBulkEditable, bulkCellEditor, bulkCellEditorParams
3. updateEP callback receives all selected rows with changes applied
4. Checkbox column auto-added when bulk mode active

FLOW:
1. User selects rows -> clicks "Bulk Change" -> bar appears
2. Select property from dropdown -> enter value -> confirm
3. updateEP called with modified rows
`,
  },

  {
    name: "Bulk Editable Status Grid",
    description:
      "Grid with bulk-editable status column using TrueFalseBulkEditableColumn pattern",
    category: "interactive",
    complexity: "medium",
    tags: ["grid", "bulk-change", "status", "boolean", "editable"],
    code: `import { GraviGrid, BBDTag } from '@gravitate-js/excalibrr';
import { useState, useMemo } from 'react';
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors';

// Reusable helper for boolean bulk-editable columns
const TrueFalseBulkEditableColumn = (field, headerName) => ({
  field,
  headerName,
  maxWidth: 120,
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: field,
    options: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],
    placeholder: 'Select Option',
  },
  cellRenderer: ({ value }) => (
    <BBDTag success={value} error={!value}>
      {value ? 'Yes' : 'No'}
    </BBDTag>
  ),
});

function UserStatusGrid({ users, onUpdateUsers }) {
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false);

  const columnDefs = useMemo(() => [
    { field: 'UserId', headerName: 'ID', maxWidth: 80 },
    { field: 'UserName', headerName: 'Name', minWidth: 150 },
    { field: 'Email', headerName: 'Email', minWidth: 200 },
    TrueFalseBulkEditableColumn('IsActive', 'Active'),
    TrueFalseBulkEditableColumn('IsVerified', 'Verified'),
    TrueFalseBulkEditableColumn('CanLogin', 'Can Login'),
  ], []);

  return (
    <GraviGrid
      agPropOverrides={{
        getRowId: (params) => params.data.UserId,
      }}
      columnDefs={columnDefs}
      rowData={users}
      storageKey="UserStatusGrid"
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={setIsBulkChangeVisible}
      updateEP={onUpdateUsers}
      controlBarProps={{ title: 'User Management' }}
    />
  );
}

export { UserStatusGrid };`,
    notes: `
PATTERN: TrueFalseBulkEditableColumn helper
- Reusable for any boolean Yes/No field
- Consistent styling with BBDTag
- Easy to add multiple boolean columns

USAGE: TrueFalseBulkEditableColumn('fieldName', 'Header Name')
`,
  },

  // Include all column definition examples
  ...COLDEFS_EXAMPLES,
];
