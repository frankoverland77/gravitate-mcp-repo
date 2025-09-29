/**
 * GraviGrid Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const graviGridComponent: ComponentMetadata = {
  id: "gravi-grid",
  name: "GraviGrid",
  description: "Powerful data grid component built on AG Grid with Gravitate theming and features. Supports sorting, filtering, grouping, editing, and more.",
  category: "data",
  complexity: "medium",
  tags: ["grid", "table", "data", "ag-grid", "editable", "sortable", "filterable"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: [
    "@gravitate-js/excalibrr",
    "ag-grid-react",
    "ag-grid-community",
    "ag-grid-enterprise",
    "react"
  ],
  props: [
    {
      name: "rowData",
      type: "any[]",
      required: true,
      description: "Array of data objects to display in the grid"
    },
    {
      name: "columnDefs",
      type: "ColDef[]",
      required: true,
      description: "Column definitions for the grid"
    },
    {
      name: "loading",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Show loading spinner overlay"
    },
    {
      name: "agPropOverrides",
      type: "GridOptions",
      required: false,
      description: "AG Grid options to override default behavior"
    },
    {
      name: "controlBarProps",
      type: "{ title?: string; actions?: ReactNode }",
      required: false,
      description: "Props for the grid control bar (title, custom actions)"
    },
    {
      name: "rowSelection",
      type: "'single' | 'multiple' | 'none'",
      required: false,
      defaultValue: "'multiple'",
      description: "Row selection mode"
    },
    {
      name: "enableRangeSelection",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Enable Excel-like range selection"
    },
    {
      name: "storageKey",
      type: "string",
      required: false,
      description: "Key for persisting grid state in localStorage"
    },
    {
      name: "headerHeight",
      type: "number",
      required: false,
      defaultValue: "40",
      description: "Height of the grid header in pixels"
    },
    {
      name: "toolPanelWidth",
      type: "number",
      required: false,
      defaultValue: "200",
      description: "Width of the side panel for columns/filters"
    }
  ],
  examples: [
    {
      name: "Basic Read-Only Grid",
      description: "Simple grid for displaying data without editing capabilities",
      code: `import { GraviGrid } from '@gravitate-js/excalibrr';

function ProductGrid({ products, loading }) {
  return (
    <GraviGrid
      rowData={products}
      loading={loading}
      columnDefs={[
        { headerName: 'ID', field: 'id' },
        { headerName: 'Name', field: 'name' },
        { headerName: 'Price', field: 'price', valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\` },
        { headerName: 'Stock', field: 'stock', type: 'numericColumn' }
      ]}
      controlBarProps={{ title: 'Products' }}
      rowSelection="multiple"
    />
  );
}`,
      tags: ["basic", "readonly"]
    },
    {
      name: "Editable Grid with Cell Editors",
      description: "Grid with inline editing capabilities using custom cell editors",
      code: `import { GraviGrid } from '@gravitate-js/excalibrr';
import { NumberCellEditor } from '@gravitate-js/excalibrr';

function EditableInventoryGrid({ inventory, onDataChange }) {
  const columnDefs = [
    { headerName: 'Product', field: 'product', editable: false },
    {
      headerName: 'Quantity',
      field: 'quantity',
      editable: true,
      cellEditor: NumberCellEditor,
      type: 'numericColumn'
    },
    {
      headerName: 'Price',
      field: 'price',
      editable: true,
      cellEditor: NumberCellEditor,
      valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`
    }
  ];

  return (
    <GraviGrid
      rowData={inventory}
      columnDefs={columnDefs}
      agPropOverrides={{
        onCellValueChanged: onDataChange,
        stopEditingWhenCellsLoseFocus: true
      }}
      controlBarProps={{ title: 'Inventory Management' }}
    />
  );
}`,
      tags: ["editable", "cell-editor"]
    },
    {
      name: "Grid with Grouping and Aggregation",
      description: "Advanced grid with row grouping and aggregate functions",
      code: `import { GraviGrid } from '@gravitate-js/excalibrr';

function SalesReportGrid({ salesData }) {
  const columnDefs = [
    {
      headerName: 'Region',
      field: 'region',
      rowGroup: true,
      hide: true
    },
    { headerName: 'Product', field: 'product' },
    {
      headerName: 'Revenue',
      field: 'revenue',
      aggFunc: 'sum',
      valueFormatter: ({ value }) => \`$\${value?.toLocaleString()}\`
    },
    {
      headerName: 'Units Sold',
      field: 'units',
      aggFunc: 'sum'
    }
  ];

  return (
    <GraviGrid
      rowData={salesData}
      columnDefs={columnDefs}
      agPropOverrides={{
        groupDefaultExpanded: 1,
        grandTotalRow: 'bottom'
      }}
      controlBarProps={{ title: 'Sales by Region' }}
    />
  );
}`,
      tags: ["grouping", "aggregation", "advanced"]
    }
  ],
  notes: "GraviGrid requires AG Grid Enterprise license for advanced features like grouping, pivoting, and Excel export. Make sure to configure your AG Grid license key."
};