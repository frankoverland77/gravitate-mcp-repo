/**
 * Grid Guide Tool - Phase 2 Specialized Skill
 * 
 * Provides comprehensive guidance for creating grids with GraviGrid,
 * including column definitions, cell editors, renderers, and patterns.
 */

import { COLDEFS_EXAMPLES } from '../knowledge/index.js';

export interface GetGridGuideRequest {
  /** Get a specific topic */
  topic?: 'basics' | 'colDefs' | 'editors' | 'renderers' | 'grouping' | 'patterns' | 'all';
  /** Get examples by complexity */
  complexity?: 'simple' | 'medium' | 'complex';
  /** Return raw JSON instead of formatted markdown */
  raw?: boolean;
  /** Get condensed summary for quick reference */
  summary?: boolean;
}

export interface GetGridGuideResponse {
  content: Array<{ type: string; text: string }>;
}

function getGridSummary(): string {
  return `# GraviGrid Quick Reference

## Basic Usage
\`\`\`tsx
import { GraviGrid } from '@gravitate-js/excalibrr';

<GraviGrid
  rowData={data}
  columnDefs={columnDefs}
  loading={isLoading}
  controlBarProps={{ title: 'My Grid' }}
  rowSelection="multiple"
/>
\`\`\`

## Column Definition Patterns

### Simple Text Column
\`\`\`tsx
{ field: 'name', headerName: 'Name', minWidth: 200 }
\`\`\`

### Number with Formatting
\`\`\`tsx
{
  field: 'price',
  headerName: 'Price',
  valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`,
  filter: 'agNumberColumnFilter',
  type: 'numericColumn'
}
\`\`\`

### Date Column
\`\`\`tsx
{
  field: 'createdAt',
  headerName: 'Created',
  valueFormatter: ({ value }) => dayjs(value).format(dateFormat.DATE_SLASH),
  filter: 'agDateColumnFilter'
}
\`\`\`

### Editable Number (CORRECT)
\`\`\`tsx
import { NumberCellEditor } from '@gravitate-js/excalibrr';

{
  field: 'quantity',
  headerName: 'Qty',
  editable: true,
  cellEditor: NumberCellEditor,  // NOT 'agTextCellEditor'
  type: 'numericColumn'
}
\`\`\`

### Boolean with BBDTag Renderer
\`\`\`tsx
{
  field: 'isActive',
  headerName: 'Status',
  cellRenderer: ({ value }) => (
    <BBDTag success={value} error={!value}>
      {value ? 'Active' : 'Inactive'}
    </BBDTag>
  )
}
\`\`\`

### Actions Column
\`\`\`tsx
{
  colId: 'actions',
  headerName: 'Actions',
  maxWidth: 120,
  cellRenderer: ({ data }) => (
    <Horizontal>
      <GraviButton theme1 buttonText="Edit" onClick={() => onEdit(data)} />
    </Horizontal>
  )
}
\`\`\`

## Key Props
- \`rowData\`: Array of data objects
- \`columnDefs\`: Column configurations
- \`loading\`: Shows loading overlay
- \`controlBarProps\`: { title, actions }
- \`rowSelection\`: 'single' | 'multiple' | 'none'
- \`agPropOverrides\`: AG Grid native options
- \`storageKey\`: For persisting grid state

## Common Mistakes
❌ \`cellEditor: 'agTextCellEditor'\` → ✅ \`cellEditor: NumberCellEditor\`
❌ \`editable: true\` without cellEditor → ✅ Always specify cellEditor
❌ Inline styles in renderers → ✅ Use Excalibrr components
❌ \`<div>\` in cell renderers → ✅ Use \`<Horizontal>\`, \`<Vertical>\`
`;
}

function getColDefsGuide(): string {
  return `# Column Definitions Guide

Column definitions (ColDef[]) control how data is displayed and edited in GraviGrid.

## Column Structure

\`\`\`tsx
interface ColDef {
  // Required
  field: string;           // Data property name
  headerName: string;      // Display header
  
  // Sizing
  minWidth?: number;       // Minimum pixel width
  maxWidth?: number;       // Maximum pixel width
  flex?: number;           // Flexible sizing ratio
  width?: number;          // Fixed width
  
  // Display
  hide?: boolean;          // Hide column
  valueFormatter?: (params) => string;  // Format display value
  valueGetter?: (params) => any;        // Custom value extraction
  cellRenderer?: React.FC | string;     // Custom render component
  cellStyle?: object | ((params) => object);  // Conditional styling
  
  // Editing
  editable?: boolean | ((params) => boolean);
  cellEditor?: React.FC | string;
  cellEditorParams?: object | ((params) => object);
  cellEditorPopup?: boolean;
  valueSetter?: (params) => boolean;
  
  // Filtering & Sorting
  filter?: 'agTextColumnFilter' | 'agNumberColumnFilter' | 'agDateColumnFilter' | boolean;
  sortable?: boolean;
  
  // Grouping
  rowGroup?: boolean;
  aggFunc?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}
\`\`\`

## Patterns by Complexity

### Simple: Basic Display
\`\`\`tsx
const columnDefs = [
  { field: 'id', headerName: 'ID', maxWidth: 80 },
  { field: 'name', headerName: 'Product Name', minWidth: 200 },
  { field: 'category', headerName: 'Category' },
];
\`\`\`

### Medium: Formatting & Filtering
\`\`\`tsx
const columnDefs = [
  {
    field: 'price',
    headerName: 'Price',
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`,
    filter: 'agNumberColumnFilter',
    type: 'numericColumn',
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    valueFormatter: ({ value }) => dayjs(value).format('MM/DD/YYYY'),
    filter: 'agDateColumnFilter',
  },
];
\`\`\`

### Complex: Custom Editors & Renderers
\`\`\`tsx
const columnDefs = [
  {
    field: 'status',
    headerName: 'Status',
    editable: canEdit,
    cellEditor: 'SearchableSelect',
    cellEditorParams: {
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      showSearch: false,
    },
    cellRenderer: ({ value }) => (
      <BBDTag success={value === 'active'} error={value === 'inactive'}>
        {value}
      </BBDTag>
    ),
  },
];
\`\`\`

## Best Practices

1. **Separate columnDefs into own file**: \`columnDefs.tsx\`
2. **Use type: 'numericColumn'** for numbers (right-aligns)
3. **Always provide minWidth/maxWidth** for responsive layouts
4. **Use Excalibrr components** in cell renderers (Texto, BBDTag, Horizontal)
5. **Import NumberCellEditor** from excalibrr for number editing
`;
}

function getEditorsGuide(): string {
  return `# Cell Editors Guide

## Available Cell Editors

### NumberCellEditor (Excalibrr)
For editing numeric values with proper input handling.

\`\`\`tsx
import { NumberCellEditor } from '@gravitate-js/excalibrr';

{
  field: 'quantity',
  headerName: 'Quantity',
  editable: true,
  cellEditor: NumberCellEditor,
  type: 'numericColumn',
}
\`\`\`

### SearchableSelect (Excalibrr)
For dropdown selection with search capability.

\`\`\`tsx
{
  field: 'category',
  headerName: 'Category',
  editable: true,
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,  // Prevent grid keyboard handling
  cellEditorPopup: true,  // Render in popup for better UX
  cellEditorParams: {
    options: categories.map(c => ({ value: c.id, label: c.name })),
    showSearch: true,
    allowClear: true,
  },
}
\`\`\`

### Boolean Editor Pattern
\`\`\`tsx
{
  field: 'isActive',
  headerName: 'Active',
  editable: true,
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorParams: {
    options: [
      { value: true, label: 'Active' },
      { value: false, label: 'Inactive' },
    ],
    showSearch: false,
    allowClear: false,
  },
  cellRenderer: ({ value }) => (
    <BBDTag success={value} error={!value}>
      {value ? 'Active' : 'Inactive'}
    </BBDTag>
  ),
}
\`\`\`

## Bulk Editing Pattern
\`\`\`tsx
{
  field: 'status',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'status',
    placeholder: 'Select Status',
    options: statusOptions,
  },
}
\`\`\`

## Key Points

1. **Always use NumberCellEditor** for numeric columns, not 'agTextCellEditor'
2. **Use suppressKeyboardEvent** with dropdown editors
3. **Set cellEditorPopup: true** for better dropdown positioning
4. **Pair editors with renderers** for consistent display
`;
}

function getRenderersGuide(): string {
  return `# Cell Renderers Guide

Cell renderers customize how data is displayed in grid cells.

## Common Patterns

### Status Badge (BBDTag)
\`\`\`tsx
{
  field: 'status',
  cellRenderer: ({ value }) => (
    <BBDTag 
      success={value === 'approved'} 
      error={value === 'rejected'}
      theme2={value === 'pending'}
    >
      {value}
    </BBDTag>
  ),
}
\`\`\`

### Conditional Value Display
\`\`\`tsx
{
  field: 'detailId',
  cellRenderer: ({ value }) => {
    if (!value) {
      return <BBDTag>Draft</BBDTag>;
    }
    return <Texto>{value}</Texto>;
  },
}
\`\`\`

### Actions Column
\`\`\`tsx
{
  colId: 'actions',
  headerName: 'Actions',
  maxWidth: 160,
  cellRenderer: ({ data }) => (
    <Horizontal>
      <GraviButton 
        theme1 
        buttonText="Edit" 
        onClick={() => onEdit(data)} 
      />
      <Popconfirm
        title="Are you sure?"
        onConfirm={() => onDelete(data)}
        okText="Yes"
        cancelText="No"
      >
        <GraviButton danger buttonText="Delete" />
      </Popconfirm>
    </Horizontal>
  ),
}
\`\`\`

### Custom with Tooltip
\`\`\`tsx
{
  field: 'description',
  cellRenderer: ({ value }) => (
    <Tooltip title={value}>
      <Texto style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </Texto>
    </Tooltip>
  ),
}
\`\`\`

### Link Renderer
\`\`\`tsx
{
  field: 'orderId',
  cellRenderer: ({ value, data }) => (
    <a onClick={() => navigate(\`/orders/\${data.id}\`)}>
      <Texto category="p1" appearance="link">{value}</Texto>
    </a>
  ),
}
\`\`\`

## Best Practices

1. **Use Excalibrr components** (Texto, BBDTag, Horizontal) not raw HTML
2. **Keep renderers simple** - extract complex logic to functions
3. **Use BBDTag for status** with success/error/theme2 props
4. **Wrap actions in Horizontal** for proper alignment
5. **Use Popconfirm** for destructive actions
`;
}

function getGroupingGuide(): string {
  return `# Row Grouping & Aggregation Guide

## Basic Grouping
\`\`\`tsx
const columnDefs = [
  {
    field: 'category',
    headerName: 'Category',
    rowGroup: true,  // Group by this field
    hide: true,      // Hide the grouped column
  },
  { field: 'product', headerName: 'Product' },
  { field: 'quantity', headerName: 'Quantity', type: 'numericColumn' },
];
\`\`\`

## Aggregation Functions
\`\`\`tsx
{
  field: 'revenue',
  headerName: 'Total Revenue',
  aggFunc: 'sum',  // 'sum' | 'avg' | 'count' | 'min' | 'max'
  valueFormatter: ({ value }) => \`$\${value?.toLocaleString()}\`,
}
\`\`\`

## Multi-Level Grouping
\`\`\`tsx
const columnDefs = [
  {
    field: 'region',
    rowGroup: true,
    hide: true,
  },
  {
    field: 'category',
    rowGroup: true,
    hide: true,
  },
  { 
    field: 'sales', 
    aggFunc: 'sum',
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`,
  },
];

// In GraviGrid:
<GraviGrid
  rowData={data}
  columnDefs={columnDefs}
  agPropOverrides={{
    groupDefaultExpanded: 1,  // Expand first level
    grandTotalRow: 'bottom',  // Show grand total
  }}
/>
\`\`\`

## Dynamic Grouped Columns
\`\`\`tsx
// Generate columns dynamically from categories
const dynamicColumns = categories.map((cat, index) => ({
  colId: \`rank_\${cat.id}\`,
  headerName: \`\${cat.name} Rank\`,
  valueGetter: (params) => {
    const row = params.data;
    return row.rankByCategory?.[cat.id] || null;
  },
}));

// Grouped header with children
const groupedColumn = {
  headerName: 'Rankings by Category',
  marryChildren: true,  // Keep children together
  children: dynamicColumns,
};
\`\`\`

## Aggregation Grid Props
\`\`\`tsx
<GraviGrid
  agPropOverrides={{
    groupDefaultExpanded: 1,        // Default expansion level
    grandTotalRow: 'bottom',        // 'top' | 'bottom' | undefined
    groupIncludeFooter: true,       // Show group totals
    suppressAggFuncInHeader: false, // Show agg func in header
  }}
/>
\`\`\`
`;
}

function getPatternsGuide(): string {
  return `# Common Grid Patterns

## 1. Read-Only Data Grid
\`\`\`tsx
import { GraviGrid } from '@gravitate-js/excalibrr';

function ProductsGrid({ products, loading }) {
  const columnDefs = [
    { field: 'name', headerName: 'Product', minWidth: 200 },
    { 
      field: 'price', 
      headerName: 'Price',
      valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`,
      type: 'numericColumn',
    },
    { field: 'category', headerName: 'Category' },
  ];

  return (
    <GraviGrid
      rowData={products}
      columnDefs={columnDefs}
      loading={loading}
      controlBarProps={{ title: 'Products' }}
      rowSelection="multiple"
    />
  );
}
\`\`\`

## 2. Editable Grid with Mutations
\`\`\`tsx
import { GraviGrid, NumberCellEditor } from '@gravitate-js/excalibrr';

function InventoryGrid({ inventory, onUpdate }) {
  const columnDefs = [
    { field: 'sku', headerName: 'SKU', editable: false },
    {
      field: 'quantity',
      headerName: 'Quantity',
      editable: true,
      cellEditor: NumberCellEditor,
      type: 'numericColumn',
    },
    {
      field: 'price',
      headerName: 'Price',
      editable: true,
      cellEditor: NumberCellEditor,
      valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`,
    },
  ];

  return (
    <GraviGrid
      rowData={inventory}
      columnDefs={columnDefs}
      agPropOverrides={{
        onCellValueChanged: (event) => {
          onUpdate(event.data);
        },
        stopEditingWhenCellsLoseFocus: true,
      }}
    />
  );
}
\`\`\`

## 3. Grid with Actions & Permissions
\`\`\`tsx
function ManagementGrid({ data, canWrite, onEdit, onDelete }) {
  const columnDefs = [
    { field: 'name', headerName: 'Name' },
    {
      field: 'status',
      headerName: 'Status',
      editable: canWrite,  // Conditional editing
      cellEditor: 'SearchableSelect',
      cellEditorParams: { /* ... */ },
      cellRenderer: ({ value }) => (
        <BBDTag success={value === 'active'}>
          {value}
        </BBDTag>
      ),
    },
    {
      colId: 'actions',
      headerName: 'Actions',
      maxWidth: 160,
      cellRenderer: ({ data }) => {
        if (!canWrite) return null;
        
        return (
          <Horizontal>
            <GraviButton theme1 buttonText="Edit" onClick={() => onEdit(data)} />
            <Popconfirm
              title="Delete this item?"
              onConfirm={() => onDelete(data)}
            >
              <GraviButton danger buttonText="Delete" />
            </Popconfirm>
          </Horizontal>
        );
      },
    },
  ];

  return (
    <GraviGrid
      rowData={data}
      columnDefs={columnDefs}
      controlBarProps={{
        title: 'Items',
        actions: canWrite && (
          <GraviButton success buttonText="Add New" onClick={onAdd} />
        ),
      }}
    />
  );
}
\`\`\`

## 4. Master-Detail Grid
\`\`\`tsx
<GraviGrid
  rowData={orders}
  columnDefs={[
    {
      cellRenderer: 'agGroupCellRenderer',
      colId: 'group-column',
      maxWidth: 40,
    },
    { field: 'orderId', headerName: 'Order ID' },
    // ...
  ]}
  agPropOverrides={{
    masterDetail: true,
    detailCellRendererParams: {
      detailGridOptions: {
        columnDefs: detailColumnDefs,
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.orderLines);
      },
    },
  }}
/>
\`\`\`

## File Organization
\`\`\`
MyFeature/
├── components/
│   └── Grid/
│       ├── index.tsx        # Grid component
│       └── columnDefs.tsx   # Column definitions
├── page.tsx
└── types.ts
\`\`\`
`;
}

function getExamples(complexity?: 'simple' | 'medium' | 'complex'): string {
  let examples = COLDEFS_EXAMPLES;
  
  if (complexity) {
    examples = examples.filter(e => e.complexity === complexity);
  }
  
  let output = `# Column Definition Examples\n\n`;
  
  for (const example of examples) {
    output += `## ${example.name}\n`;
    output += `**Complexity:** ${example.complexity} | **Tags:** ${example.tags.join(', ')}\n\n`;
    output += `${example.description}\n\n`;
    output += `\`\`\`tsx\n${example.code}\n\`\`\`\n\n`;
    if (example.notes) {
      output += `> ${example.notes}\n\n`;
    }
    output += `---\n\n`;
  }
  
  return output;
}

export async function getGridGuideTool(args: GetGridGuideRequest): Promise<GetGridGuideResponse> {
  const { topic = 'all', complexity, raw = false, summary = false } = args;
  
  try {
    if (summary) {
      return {
        content: [{ type: 'text', text: getGridSummary() }]
      };
    }
    
    if (complexity) {
      return {
        content: [{ type: 'text', text: getExamples(complexity) }]
      };
    }
    
    let output = '';
    
    switch (topic) {
      case 'basics':
        output = getGridSummary();
        break;
      case 'colDefs':
        output = getColDefsGuide();
        break;
      case 'editors':
        output = getEditorsGuide();
        break;
      case 'renderers':
        output = getRenderersGuide();
        break;
      case 'grouping':
        output = getGroupingGuide();
        break;
      case 'patterns':
        output = getPatternsGuide();
        break;
      case 'all':
      default:
        output = [
          getGridSummary(),
          getColDefsGuide(),
          getEditorsGuide(),
          getRenderersGuide(),
          getGroupingGuide(),
          getPatternsGuide(),
        ].join('\n\n---\n\n');
    }
    
    if (raw) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ topic, content: output }, null, 2) }]
      };
    }
    
    return {
      content: [{ type: 'text', text: output }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error getting grid guide: ${errorMessage}` }]
    };
  }
}
