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

  // REQUIRED: Enable multi-row selection for bulk operations
  agPropOverrides={{
    rowSelection: 'multiple' as const,
  }}
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
    propKey: 'IsActive',            // Field to update
    options: [                      // { Value, Text } format (converted via toAntOption)
      { Value: 'true', Text: 'Active' },
      { Value: 'false', Text: 'Inactive' },
    ],
    // For number editors:
    min: 0,
    max: 100,
    precision: 2,
  },
}
```

> **Important**: Use string `'true'`/`'false'` for boolean fields, not actual booleans. The confirm button uses `!!value` which fails for boolean `false`.

---

## Common Patterns

### Boolean Column (TrueFalseBulkEditableColumn)

```typescript
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'

const TrueFalseBulkEditableColumn = (field: string, headerName: string) => ({
  field,
  headerName,
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    propKey: field,
    options: [
      { Value: 'true', Text: 'Yes' },
      { Value: 'false', Text: 'No' },
    ],
  },
})
```

> **Note**: Use string `'true'`/`'false'` values. Convert back to boolean in your `updateEP` handler.

### Select Dropdown Column

```typescript
{
  field: 'CategoryId',
  headerName: 'Category',
  isBulkEditable: canWrite,  // Permission check
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    propKey: 'CategoryId',
    options: metadata?.Categories ?? [],  // Already in { Value, Text } format
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
    propKey: 'StrategyId',
    options: strategyOptions,  // { Value, Text } format
  },
}
```

> For complex multi-field updates, handle the transformation in your `updateEP` handler.

---

## Complete Example

```typescript
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useState } from 'react'
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'

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
        propKey: 'IsActive',
        options: [
          { Value: 'true', Text: 'Active' },
          { Value: 'false', Text: 'Inactive' },
        ],
      },
    },
  ]

  // Convert string booleans back to actual booleans
  const handleUpdate = async (rows: any) => {
    const updated = Array.isArray(rows) ? rows : [rows]
    const processed = updated.map(row => ({
      ...row,
      IsActive: typeof row.IsActive === 'string' ? row.IsActive === 'true' : row.IsActive,
    }))
    return onUpdate(processed)
  }

  return (
    <GraviGrid
      agPropOverrides={{
        getRowId: (p) => p.data.ProductId,
        rowSelection: 'multiple' as const,
      }}
      columnDefs={columnDefs}
      rowData={data}
      storageKey="ProductGrid"
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={setIsBulkChangeVisible}
      updateEP={handleUpdate}
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
| Can only select one row | Add `rowSelection: 'multiple' as const` to agPropOverrides |
| Boolean confirm button won't enable | Use string `'true'`/`'false'` not boolean (`!!false` is falsy) |
| Options format `{ value, label }` | Use `{ Value, Text }` format (converted via `toAntOption`) |
| Using `accessor` in params | Use `propKey` instead |

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
