# Grid Patterns

Comprehensive patterns for using GraviGrid in demos. For basic component API, see `component-api.md`.

## Table of Contents
- [Basic Grid Page](#basic-grid-page)
- [Column Definition Patterns](#column-definition-patterns)
- [Control Bar Patterns](#control-bar-patterns)
- [Row Selection](#row-selection)
- [Bulk Editing](#bulk-editing)
- [Master-Detail (Expandable Rows)](#master-detail)
- [Performance Tips](#performance-tips)

---

## Basic Grid Page

The simplest grid demo — a full-page data grid with mock data.

```tsx
import React, { useMemo } from 'react'
import { GraviGrid, Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { PlusOutlined } from '@ant-design/icons'
import { getColumnDefs } from './ContractGrid.columnDefs'
import { mockContracts } from './ContractGrid.data'

export function ContractGrid() {
  const columnDefs = useMemo(() => getColumnDefs(), [])

  const controlBarProps = useMemo(() => ({
    title: 'Contracts',
    actionButtons: (
      <GraviButton buttonText='New Contract' theme1 icon={<PlusOutlined />} />
    ),
  }), [])

  return (
    <Vertical flex='1'>
      <GraviGrid
        rowData={mockContracts}
        columnDefs={columnDefs}
        agPropOverrides={{}}
        storageKey='contract-grid'
        controlBarProps={controlBarProps}
      />
    </Vertical>
  )
}
```

---

## Column Definition Patterns

Always define columns in a separate `{FeatureName}.columnDefs.tsx` file.

### Text Column
```tsx
{ field: 'name', headerName: 'Contract Name', flex: 1, sortable: true, filter: true }
```

### Number Column
```tsx
{
  field: 'volume',
  headerName: 'Volume (BBL)',
  width: 140,
  type: 'numericColumn',
  valueFormatter: (params) => params.value?.toLocaleString() ?? '',
}
```

### Currency Column
```tsx
{
  field: 'price',
  headerName: 'Price',
  width: 120,
  type: 'numericColumn',
  valueFormatter: (params) => params.value != null ? `$${params.value.toFixed(2)}` : '',
}
```

### Date Column
```tsx
{
  field: 'startDate',
  headerName: 'Start Date',
  width: 140,
  valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
}
```

### Status Column with BBDTag
```tsx
import { BBDTag } from '@gravitate-js/excalibrr'

{
  field: 'status',
  headerName: 'Status',
  width: 130,
  cellRenderer: (params) => {
    const status = params.value
    if (!status) return null
    const isActive = status === 'Active'
    const isPending = status === 'Pending'
    return (
      <BBDTag success={isActive} warning={isPending} error={!isActive && !isPending}>
        {status}
      </BBDTag>
    )
  },
}
```

### Actions Column (Virtual — No Field)
```tsx
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Horizontal } from '@gravitate-js/excalibrr'

{
  // NO field prop — this is a virtual column
  headerName: 'Actions',
  width: 100,
  pinned: 'right',
  sortable: false,
  filter: false,
  cellRenderer: (params) => (
    <Horizontal gap={8} alignItems='center'>
      <EditOutlined
        onClick={() => handleEdit(params.data)}
        style={{ cursor: 'pointer', color: 'var(--theme-color-2)' }}
      />
      <DeleteOutlined
        onClick={() => handleDelete(params.data.id)}
        style={{ cursor: 'pointer', color: '#dc2626' }}
      />
    </Horizontal>
  ),
}
```

### Computed Column (No Direct Field)
```tsx
{
  headerName: 'Total',
  width: 120,
  valueGetter: (params) => {
    const qty = params.data?.quantity ?? 0
    const price = params.data?.unitPrice ?? 0
    return qty * price
  },
  valueFormatter: (params) => `$${params.value?.toFixed(2) ?? '0.00'}`,
}
```

---

## Control Bar Patterns

### Title Only
```tsx
controlBarProps={{ title: 'Contracts' }}
```

### Title + Single Action
```tsx
controlBarProps={{
  title: 'Contracts',
  actionButtons: <GraviButton buttonText='Add' theme1 icon={<PlusOutlined />} />,
}}
```

### Title + Multiple Actions
```tsx
controlBarProps={{
  title: 'Contracts',
  actionButtons: (
    <Horizontal gap={8}>
      <GraviButton buttonText='Export' appearance='outlined' icon={<DownloadOutlined />} />
      <GraviButton buttonText='Import' appearance='outlined' icon={<UploadOutlined />} />
      <GraviButton buttonText='New Contract' theme1 icon={<PlusOutlined />} />
    </Horizontal>
  ),
}}
```

### With Selected Count
```tsx
controlBarProps={{
  title: 'Contracts',
  showSelectedCount: true,
}}
```

---

## Row Selection

```tsx
<GraviGrid
  rowData={data}
  columnDefs={columnDefs}
  agPropOverrides={{
    rowSelection: 'multiple',
    onSelectionChanged: (event) => {
      const selected = event.api.getSelectedRows()
      setSelectedRows(selected)
    },
  }}
  storageKey='selectable-grid'
/>
```

---

## Bulk Editing

GraviGrid has built-in bulk editing support. This is a complex feature pattern — use it when the demo needs to show editing multiple rows at once.

### Grid Setup
```tsx
const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)

<GraviGrid
  rowData={data}
  columnDefs={columnDefs}
  agPropOverrides={{ rowSelection: 'multiple' }}
  storageKey='bulk-grid'
  isBulkChangeVisible={isBulkChangeVisible}
  setIsBulkChangeVisible={setIsBulkChangeVisible}
  isBulkChangeCompactMode
  updateEP={async (updatedRows) => {
    // In demos, just update local state
    setData(prev => prev.map(row => {
      const update = updatedRows.find(u => u.id === row.id)
      return update ? { ...row, ...update } : row
    }))
    NotificationMessage('Success.', `Updated ${updatedRows.length} rows`, false)
  }}
/>
```

### Bulk-Editable Column Definitions
```tsx
import { BulkSelectEditor, BulkNumberEditor } from '@gravitate-js/excalibrr'

// Select editor for bulk editing
{
  field: 'status',
  headerName: 'Status',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    propKey: 'status',
    options: [
      { Value: 'Active', Text: 'Active' },
      { Value: 'Inactive', Text: 'Inactive' },
      { Value: 'Pending', Text: 'Pending' },
    ],
    placeholder: 'Select status...',
  },
}

// Number editor for bulk editing
{
  field: 'price',
  headerName: 'Price',
  isBulkEditable: true,
  bulkCellEditor: BulkNumberEditor,
  bulkCellEditorParams: {
    propKey: 'price',
    min: 0,
    max: 10000,
    precision: 2,
    step: 0.01,
  },
}

// Boolean column with bulk editing
{
  field: 'isActive',
  headerName: 'Active',
  maxWidth: 120,
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    propKey: 'isActive',
    options: [
      { Value: true, Text: 'Active' },
      { Value: false, Text: 'Inactive' },
    ],
  },
  cellRenderer: ({ value }) => (
    <BBDTag success={value} error={!value}>
      {value ? 'Active' : 'Inactive'}
    </BBDTag>
  ),
}
```

### Bulk Editing Checklist
- `agPropOverrides` includes `rowSelection: 'multiple'`
- `isBulkChangeVisible` state + setter passed to grid
- `updateEP` async handler provided (handles the save)
- Each editable column has `isBulkEditable: true`
- Each editable column has `bulkCellEditor` and `bulkCellEditorParams`
- `bulkCellEditorParams.propKey` matches the `field` name
- Options use `{ Value, Text }` format (note capitalization)

---

## Master-Detail

Expandable rows that show a detail panel when clicked.

```tsx
<GraviGrid
  rowData={data}
  columnDefs={columnDefs}
  agPropOverrides={{
    masterDetail: true,
    detailRowAutoHeight: true,
  }}
  masterDetail
  detailCellRenderer={ContractDetailPanel}
  storageKey='master-detail-grid'
/>
```

The detail component receives the row data:

```tsx
export function ContractDetailPanel({ data }) {
  return (
    <Vertical className='p-3' gap={16}>
      <Horizontal gap={24}>
        <Vertical>
          <Texto category='p2' appearance='medium'>Contract Type</Texto>
          <Texto category='p1' weight='600'>{data.type}</Texto>
        </Vertical>
        <Vertical>
          <Texto category='p2' appearance='medium'>Volume</Texto>
          <Texto category='p1' weight='600'>{data.volume?.toLocaleString()} BBL</Texto>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
```

---

## Performance Tips

1. **Memoize column definitions** — Prevents grid re-renders:
   ```tsx
   const columnDefs = useMemo(() => getColumnDefs(), [])
   ```

2. **Memoize controlBarProps** — Same reason:
   ```tsx
   const controlBarProps = useMemo(() => ({ title: '...' }), [])
   ```

3. **Use storageKey** — Persists user column preferences:
   ```tsx
   storageKey='unique-feature-grid-key'
   ```

4. **Set getRowId for large datasets** — Enables efficient row updates:
   ```tsx
   agPropOverrides={{ getRowId: (params) => params.data.id }}
   ```

5. **Use filter types** for better UX:
   ```tsx
   { field: 'name', filter: 'agTextColumnFilter' }
   { field: 'price', filter: 'agNumberColumnFilter' }
   { field: 'date', filter: 'agDateColumnFilter' }
   ```
