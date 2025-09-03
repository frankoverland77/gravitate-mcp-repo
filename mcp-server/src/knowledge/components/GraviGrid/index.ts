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

  // Include all column definition examples
  ...COLDEFS_EXAMPLES,
];
