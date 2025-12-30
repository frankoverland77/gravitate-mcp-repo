# GraviGrid Bulk Change Reference

Quick reference for implementing bulk change functionality in GraviGrid.

## What is Bulk Change?

Bulk change allows users to modify multiple selected rows simultaneously. When enabled, a Bulk Change Bar appears with editable columns, enabling mass updates to specific fields across all selected rows.

---

## GraviGrid Props

```typescript
<GraviGrid
  // REQUIRED: Control bulk change visibility
  isBulkChangeVisible={isBulkChangeVisible}
  setIsBulkChangeVisible={setIsBulkChangeVisible}

  // REQUIRED: Save handler for bulk changes
  updateEP={async (rows) => { /* save logic */ }}

  // OPTIONAL: Compact mode (40px vs 80px height)
  isBulkChangeCompactMode

  // OPTIONAL: Custom title
  bulkDrawerTitle="Bulk Edit Products"

  // OPTIONAL: Custom sorting for editable properties
  bulkChangePropertiesComparator={(a, b) => a.headerName.localeCompare(b.headerName)}

  // REQUIRED: Must include (can be empty)
  agPropOverrides={{}}
/>
```

---

## Column Definition Props

```typescript
{
  field: 'IsActive',
  headerName: 'Status',

  // Enable bulk editing
  isBulkEditable: true,  // or (params) => boolean for conditional

  // Bulk editor component
  bulkCellEditor: BulkSelectEditor,

  // Editor configuration
  bulkCellEditorParams: {
    accessor: 'IsActive',           // Field to update
    placeholder: 'Select Status',   // Placeholder text
    options: [                      // For select editors
      { value: true, label: 'Active' },
      { value: false, label: 'Inactive' },
    ],
    allowNullValue: false,          // Allow clearing
    // For number editors:
    min: 0,
    max: 100,
    precision: 2,
  },
}
```

---

## Common Patterns

### Boolean Column (TrueFalseBulkEditableColumn)

```typescript
import { BulkSelectEditor } from '@/components/shared/Grid/bulkChange/bulkCellEditors'

const TrueFalseBulkEditableColumn = (field, headerName) => ({
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
  // ... other column props
})
```

### Select Dropdown Column

```typescript
{
  field: 'CategoryId',
  headerName: 'Category',
  isBulkEditable: canWrite,  // Permission check
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'CategoryId',
    placeholder: 'Select Category',
    options: metadata?.Categories?.map(c => ({
      value: c.Value,
      label: c.Text,
    })) ?? [],
  },
}
```

### Multi-Field Update (Advanced)

```typescript
{
  field: 'StrategyId',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'StrategyId',
    options: strategyOptions,
    // Custom transformation for multi-field updates
    getChanges: (value) => {
      const parsed = JSON.parse(value)
      return {
        StrategyTypeId: parsed.typeId,
        StrategyBenchmarkId: parsed.benchmarkId,
      }
    },
  },
}
```

---

## Complete Example

```typescript
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useState } from 'react'
import { BulkSelectEditor } from '@/components/shared/Grid/bulkChange/bulkCellEditors'

function ProductGrid({ data, onUpdate }) {
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)

  const columnDefs = [
    { field: 'ProductId', headerName: 'ID' },
    { field: 'Name', headerName: 'Product' },
    {
      field: 'IsActive',
      headerName: 'Status',
      isBulkEditable: true,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        accessor: 'IsActive',
        options: [
          { value: true, label: 'Active' },
          { value: false, label: 'Inactive' },
        ],
      },
    },
  ]

  return (
    <GraviGrid
      agPropOverrides={{
        getRowId: (p) => p.data.ProductId,
      }}
      columnDefs={columnDefs}
      rowData={data}
      storageKey="ProductGrid"
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={setIsBulkChangeVisible}
      updateEP={onUpdate}
    />
  )
}
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing `agPropOverrides` | Always include `agPropOverrides={{}}` |
| No `updateEP` callback | Required to save bulk changes |
| `isBulkEditable` without `bulkCellEditor` | Both props required |
| Missing `setIsBulkChangeVisible` | Need state handler for toggle |

---

## Production References (gravitate.dotnet.next)

For custom bulk cell editor implementations:

- **BulkSelectEditor**: `frontend/src/components/shared/Grid/bulkChange/bulkCellEditors.tsx`
- **BulkNumberCellEditor**: `frontend/src/components/shared/Grid/bulkChange/BulkNumberCellEditor.tsx`
- **BulkPriceEditor**: `frontend/src/modules/PricingEngine/QuoteBook/components/Grid/components/cellEditors/BulkPriceEditor.tsx`
- **TrueFalseBulkEditableColumn**: `frontend/src/components/shared/Grid/defaultColumnDefs/TrueFalseBulkEditableColumn.tsx`

---

## User Request: $ARGUMENTS

Search for bulk change implementation patterns and provide code samples based on the request above.
