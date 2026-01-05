// Bulk Change Patterns for GraviGrid
// Comprehensive documentation for bulk editing functionality

import type { ComponentExample } from '../../index.js'

/**
 * BULK CHANGE FEATURE OVERVIEW
 *
 * Bulk change allows users to modify multiple selected rows in a GraviGrid simultaneously.
 * When rows are selected, a Bulk Change Bar appears with editable columns, enabling
 * mass updates to specific fields across all selected rows at once.
 *
 * USE CASES:
 * - Updating status/active flags on multiple records
 * - Applying the same value (e.g., category, group) to many rows
 * - Mass price adjustments (add, subtract, replace)
 * - Bulk enabling/disabling features
 */

/**
 * TYPE DEFINITIONS
 */
export const BULK_CHANGE_TYPES = `
// The interface that all bulk cell editors must implement
type BulkCellEditorHandle<T> = {
  // Returns the changes to apply to a single row
  getChanges: (row: T) => Partial<T>;
  // Returns true when the editor has valid input ready to apply
  isChangeReady: () => boolean;
};

// Column definition props for bulk editing
interface BulkEditableColDef<T> extends ColDef<T> {
  // Enable bulk editing for this column
  isBulkEditable?: boolean | ((params: CellClassParams<T>) => boolean);
  // Component to render in bulk change bar for this column
  bulkCellEditor?: React.ForwardRefExoticComponent<BulkCellEditorHandle<T>>;
  // Props passed to the bulk cell editor
  bulkCellEditorParams?: {
    accessor?: string;           // Field name to update
    placeholder?: string;        // Placeholder text
    options?: Array<{ value: any; label: string }>;  // For select editors
    allowNullValue?: boolean;    // Allow clearing values
    getChanges?: (value: any) => Partial<T>;  // Custom change transformer
    min?: number;                // For number editors
    max?: number;                // For number editors
    precision?: number;          // Decimal places for numbers
    step?: number;               // Step value for number inputs
  };
}

// Metadata passed with bulk updates
interface ChangeMeta<T> {
  colId: string;
  newValue: any;
  oldValue: any;
  updatedRowIndex: number;
}
`

/**
 * GRAVIGRID PROPS FOR BULK CHANGE
 */
export const GRAVI_GRID_BULK_PROPS = `
// GraviGrid props related to bulk change functionality
interface GraviGridBulkChangeProps<T> {
  // Controls visibility of the bulk change bar
  isBulkChangeVisible?: boolean;

  // Callback to toggle bulk change visibility
  setIsBulkChangeVisible?: (visible: boolean) => void;

  // Use compact styling for the bulk change bar (40px vs 80px height)
  isBulkChangeCompactMode?: boolean;

  // Custom title for the bulk change drawer/bar
  bulkDrawerTitle?: string;

  // Custom sorting for bulk-editable properties in the dropdown
  bulkChangePropertiesComparator?: (a: ColDef<T>, b: ColDef<T>) => number;

  // REQUIRED: Callback to save bulk changes
  // Called with all selected rows that have changes applied
  updateEP?: (row: T | T[], meta?: ChangeMeta<T>) => Promise<any>;
}
`

export const BULK_CHANGE_PATTERNS: ComponentExample[] = [
  {
    name: 'Grid with Bulk Change - Complete Example',
    description: 'Full GraviGrid setup with bulk change functionality including multiple bulk-editable columns',
    category: 'patterns',
    complexity: 'complex',
    tags: ['grid', 'bulk-change', 'bulk-edit', 'multi-select', 'mass-update'],
    code: `import { GraviGrid } from '@gravitate-js/excalibrr'
import { useState, useMemo, useCallback } from 'react'
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'

function ProductGrid({ data, onUpdateProducts }) {
  // State for bulk change visibility
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)

  // Column definitions with bulk-editable columns
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
    },
  ], [])

  // Handler for saving bulk changes
  const handleBulkUpdate = useCallback(async (rows) => {
    try {
      await onUpdateProducts(rows)
      NotificationMessage('Success', 'Products updated successfully', false)
    } catch (error) {
      NotificationMessage('Error', 'Failed to update products', true)
    }
  }, [onUpdateProducts])

  return (
    <GraviGrid
      agPropOverrides={{
        getRowId: (params) => params.data.ProductId,
        rowSelection: 'multiple',
      }}
      columnDefs={columnDefs}
      rowData={data}
      storageKey="ProductGrid"
      // Bulk change props
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={setIsBulkChangeVisible}
      isBulkChangeCompactMode
      updateEP={handleBulkUpdate}
    />
  )
}`,
    notes: `
KEY POINTS:
1. isBulkChangeVisible and setIsBulkChangeVisible control the bulk change bar
2. Each bulk-editable column needs isBulkEditable: true
3. bulkCellEditor specifies which editor component to use
4. bulkCellEditorParams configures the editor (accessor, options, etc.)
5. updateEP is called with all modified rows when user confirms changes

BULK CHANGE FLOW:
1. User selects multiple rows (checkbox column auto-added when bulk mode active)
2. User clicks "Bulk Change" button in control bar
3. Bulk change bar appears with dropdown of editable columns
4. User selects column, enters new value, confirms
5. updateEP called with all selected rows having the new value applied
`,
  },

  {
    name: 'TrueFalseBulkEditableColumn Helper',
    description: 'Pre-configured column definition factory for boolean Yes/No bulk editable columns',
    category: 'patterns',
    complexity: 'simple',
    tags: ['grid', 'bulk-change', 'boolean', 'helper', 'column-definition'],
    code: `import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { TrueFalseEditableColumn } from '@components/shared/Grid/defaultColumnDefs'

/**
 * Creates a column definition for boolean fields with bulk editing enabled.
 * Displays Yes/No options in both regular editing and bulk editing modes.
 *
 * @param field - The data field name
 * @param headerName - The column header text
 * @param allowNullValue - Whether to allow clearing the value (optional)
 */
export const TrueFalseBulkEditableColumn = (
  field: string,
  headerName: string,
  allowNullValue?: boolean
) => ({
  minWidth: 100,
  // Enable bulk editing
  isBulkEditable: true,
  // Use select editor for bulk changes
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: field,
    options: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],
    placeholder: 'Select Option',
    allowNullValue,
  },
  // Extend the standard true/false column settings
  ...TrueFalseEditableColumn(field, headerName, allowNullValue),
})

// USAGE:
const columnDefs = [
  TrueFalseBulkEditableColumn('IsActive', 'Active'),
  TrueFalseBulkEditableColumn('IsFeatured', 'Featured'),
  TrueFalseBulkEditableColumn('AllowDiscounts', 'Allow Discounts', true),
]`,
    notes: `
This helper pattern is used extensively in production for boolean columns.
It combines regular editing (in-cell) with bulk editing capabilities.
The allowNullValue parameter lets users clear the field if needed.
`,
  },

  {
    name: 'Select Dropdown Bulk Editing',
    description: 'Column definition for select/dropdown fields with bulk editing and metadata resolution',
    category: 'patterns',
    complexity: 'medium',
    tags: ['grid', 'bulk-change', 'select', 'dropdown', 'metadata'],
    code: `import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'

// Column definition with select bulk editor and metadata lookup
const getCategoryColumn = (metadata, canWrite) => ({
  field: 'CategoryCvId',
  headerName: 'Category',
  minWidth: 150,
  // Conditionally enable bulk editing based on permissions
  isBulkEditable: canWrite,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'CategoryCvId',
    placeholder: 'Select Category',
    // Map metadata to select options
    options: metadata?.Categories?.map(item => ({
      value: item.Value,
      label: item.Text,
    })) ?? [],
  },
  // Regular cell editor for single-row editing
  cellEditor: 'SearchableSelect',
  cellEditorParams: {
    showSearch: true,
    options: metadata?.Categories?.map(item => ({
      value: item.Value,
      label: item.Text,
    })) ?? [],
  },
  // Display the resolved text value
  valueGetter: ({ data }) => {
    const category = metadata?.Categories?.find(
      c => c.Value === data?.CategoryCvId
    )
    return category?.Text ?? ''
  },
})`,
    notes: `
PATTERN HIGHLIGHTS:
1. Options can be dynamically generated from metadata
2. Use valueGetter to resolve ID to display text
3. canWrite permission controls bulk edit availability
4. Same options can be shared between regular and bulk editing
`,
  },

  {
    name: 'Bulk Change with Custom Value Transformation',
    description: 'Advanced bulk editing that updates multiple fields from a single selection',
    category: 'patterns',
    complexity: 'complex',
    tags: ['grid', 'bulk-change', 'multi-field', 'transformation', 'advanced'],
    code: `import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'

// When selecting a strategy, we need to update multiple related fields
const getStrategyColumn = (metadata) => ({
  field: 'StrategyQuoteBenchmarkId',
  headerName: 'Strategy',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'StrategyQuoteBenchmarkId',
    placeholder: 'Select Strategy',
    options: getStrategyOptions(metadata),
    // Custom transformation - updates multiple fields from single selection
    getChanges: (value) => {
      // Value is JSON string containing multiple field values
      const newValues = JSON.parse(value)
      return {
        StrategyBaseTypeCvId: newValues.StrategyBaseTypeCvId,
        StrategyQuoteBenchmarkId: newValues.StrategyQuoteBenchmarkId,
      }
    },
  },
  // Regular editing also uses JSON for multi-field updates
  valueSetter: (params) => {
    const newValues = JSON.parse(params.newValue)
    params.data.StrategyBaseTypeCvId = newValues.StrategyBaseTypeCvId
    params.data.StrategyQuoteBenchmarkId = newValues.StrategyQuoteBenchmarkId
    return true
  },
})

// Helper to build options with encoded multi-field values
const getStrategyOptions = (metadata) => {
  const options = []

  // Add base strategies
  metadata?.StrategyBaseTypes?.forEach(type => {
    options.push({
      value: JSON.stringify({
        StrategyBaseTypeCvId: type.Value,
        StrategyQuoteBenchmarkId: null,
      }),
      label: type.Text,
    })
  })

  // Add benchmark strategies
  metadata?.Benchmarks?.forEach(benchmark => {
    options.push({
      value: JSON.stringify({
        StrategyBaseTypeCvId: null,
        StrategyQuoteBenchmarkId: benchmark.Value,
      }),
      label: benchmark.Text,
    })
  })

  return options
}`,
    notes: `
ADVANCED PATTERN:
- getChanges callback allows custom transformation of selected value
- JSON.stringify/parse pattern enables multi-field updates from single selection
- Same pattern works for both bulk and regular cell editing
- Used when selecting one option should update multiple data fields
`,
  },

  {
    name: 'Conditional Bulk Editing',
    description: 'Enable bulk editing conditionally based on row data or permissions',
    category: 'patterns',
    complexity: 'medium',
    tags: ['grid', 'bulk-change', 'conditional', 'permissions'],
    code: `// isBulkEditable can be a function for conditional enabling
const columnDefs = [
  {
    field: 'Price',
    headerName: 'Price',
    // Only enable bulk edit for non-locked rows
    isBulkEditable: (params) => {
      return !params?.data?.IsLocked && canWrite
    },
    bulkCellEditor: BulkNumberEditor,
    bulkCellEditorParams: {
      accessor: 'Price',
      min: 0,
      precision: 2,
    },
  },
  {
    field: 'Status',
    headerName: 'Status',
    // Disable bulk edit for spread rows
    isBulkEditable: (params) => {
      return !params?.data?.SpreadParentMappingId
    },
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      accessor: 'Status',
      options: statusOptions,
    },
  },
  {
    field: 'Notes',
    headerName: 'Notes',
    // Simple boolean - always editable if user has write permission
    isBulkEditable: canWrite,
    bulkCellEditor: BulkTextEditor,
    bulkCellEditorParams: {
      accessor: 'Notes',
      placeholder: 'Enter notes...',
    },
  },
]`,
    notes: `
CONDITIONAL PATTERNS:
1. isBulkEditable: boolean - simple on/off based on permissions
2. isBulkEditable: (params) => boolean - evaluate per-row conditions
3. Combine with canWrite permission check for security
4. Function receives cell params with access to row data
`,
  },
]

/**
 * COMMON MISTAKES TO AVOID
 */
export const BULK_CHANGE_MISTAKES = `
## Common Bulk Change Mistakes

| Mistake | Correct |
|---------|---------|
| Missing agPropOverrides | Always include agPropOverrides={{}} on GraviGrid |
| No updateEP callback | Must provide updateEP to save bulk changes |
| isBulkEditable without bulkCellEditor | Both props required for bulk editing |
| Missing setIsBulkChangeVisible | Need state handler to toggle bulk mode |
| Forgetting rowSelection: 'multiple' | Bulk change requires multi-row selection |

## Required Setup Checklist

1. GraviGrid Props:
   - agPropOverrides={{}} (can be empty but must exist)
   - isBulkChangeVisible={state}
   - setIsBulkChangeVisible={setState}
   - updateEP={async (rows) => { /* save logic */ }}

2. Column Definition:
   - isBulkEditable: true (or function)
   - bulkCellEditor: BulkSelectEditor (or other editor)
   - bulkCellEditorParams: { accessor: 'fieldName', ... }

3. Row Selection:
   - rowSelection: 'multiple' in agPropOverrides (auto-added when bulk visible)
`

/**
 * PRODUCTION REFERENCE PATHS
 * For developers needing to create custom bulk cell editors
 */
export const BULK_CHANGE_REFERENCES = `
## Production Code References (gravitate.dotnet.next)

For custom bulk cell editor implementations, reference these files:

### Standard Bulk Editors
- BulkSelectEditor: frontend/src/components/shared/Grid/bulkChange/bulkCellEditors.tsx
- BulkNumberCellEditor: frontend/src/components/shared/Grid/bulkChange/BulkNumberCellEditor.tsx

### Advanced Custom Editors
- BulkPriceEditor (Add/Subtract/Replace): frontend/src/modules/PricingEngine/QuoteBook/components/Grid/components/cellEditors/BulkPriceEditor.tsx
- BulkDiffEditor: frontend/src/modules/PricingEngine/QuoteBook/components/Grid/components/cellEditors/BulkDiffEditor.tsx
- BulkStatusEditor: frontend/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/cellEditors/BulkStatusEditor.tsx
- BulkGroupEditor: frontend/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/cellEditors/BulkGroupEditor.tsx

### Helper Functions
- TrueFalseBulkEditableColumn: frontend/src/components/shared/Grid/defaultColumnDefs/TrueFalseBulkEditableColumn.tsx

### Real-World Grid Examples
- QuoteBook Grid: frontend/src/modules/PricingEngine/QuoteBook/components/Grid/
- ManageQuoteRows Grid: frontend/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/
- ManageProducts Grid: frontend/src/modules/Admin/ManageProducts/components/Grid/
`

export default BULK_CHANGE_PATTERNS
