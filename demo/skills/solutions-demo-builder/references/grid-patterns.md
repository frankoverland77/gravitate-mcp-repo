# Grid Patterns

Comprehensive patterns for using GraviGrid in demos. For basic component API, see `component-api.md`.

## Table of Contents
- [Basic Grid Page](#basic-grid-page)
- [Column Definition Patterns](#column-definition-patterns)
- [Control Bar Patterns](#control-bar-patterns)
- [Row Selection](#row-selection)
- [Bulk Editing](#bulk-editing)
- [Master-Detail (Expandable Rows)](#master-detail)
- [Column Definition Standards](#column-definition-standards)
- [Editable Grid Requirements](#editable-grid-requirements)
- [Cell Renderers vs valueFormatter](#cell-renderers-vs-valueformatter)
- [Custom Cell Editor Pattern](#custom-cell-editor-pattern)
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

## Column Definition Standards

### Named Functions for Complex Columns

For columns with renderers, formatters, or editors, define each as a named function and compose them in a factory. This keeps column defs readable and makes individual columns easy to reuse or test.

```tsx
function NameColumn(): ColDef {
  return { field: 'name', headerName: 'Contract Name', flex: 1, sortable: true, filter: true }
}

function StatusColumn(): ColDef {
  return {
    field: 'status',
    headerName: 'Status',
    width: 120,
    cellRenderer: (params) => {
      const s = params.value
      if (!s) return null
      return <BBDTag success={s === 'Active'} warning={s === 'Pending'} error={s === 'Expired'}>{s}</BBDTag>
    },
  }
}

function ActionsColumn({ onEdit, onDelete }): ColDef {
  return {
    headerName: 'Actions',
    width: 90,
    pinned: 'right',
    sortable: false,
    filter: false,
    cellRenderer: (params) => (
      <Horizontal gap={8} alignItems='center'>
        <EditOutlined onClick={() => onEdit(params.data)} style={{ cursor: 'pointer' }} />
        <DeleteOutlined onClick={() => onDelete(params.data.id)} style={{ cursor: 'pointer', color: '#dc2626' }} />
      </Horizontal>
    ),
  }
}

export function getColumnDefs(handlers: ColumnDefHandlers): ColDef[] {
  return [NameColumn(), StatusColumn(), ActionsColumn(handlers)]
}
```

Simple columns (just `field` + `headerName`) can stay as plain objects — the named function pattern is for columns with logic.

### Action Column Extraction

When an action column has more than ~15 lines (multiple buttons, conditional rendering, tooltips), extract it to a separate `ActionsRenderer` component in the `components/` folder instead of defining it inline.

### valueGetter + valueSetter Pairing

**If you use `valueGetter` on an editable column, you MUST also provide `valueSetter`.** Without it, the grid accepts edits visually but **never updates the data** — a silent data loss bug.

```tsx
// WRONG — edits appear to work but data never changes
{ headerName: 'Location', valueGetter: (p) => p.data?.location?.name, editable: true }

// CORRECT
{
  headerName: 'Location',
  valueGetter: (p) => p.data?.location?.name,
  valueSetter: (p) => { p.data.location.name = p.newValue; return true },
  editable: true,
}
```

### valueFormatter + Filter Pairing

When using `valueFormatter`, the filter dropdown shows raw unformatted values. Add a matching `filterParams.valueFormatter`:

```tsx
{
  field: 'price',
  valueFormatter: (p) => `$${p.value?.toFixed(2)}`,
  filterParams: { valueFormatter: (p) => `$${p.value?.toFixed(2)}` },
}
```

---

## Editable Grid Requirements

When building grids with inline cell editing, these are required:

### 1. stopEditingWhenCellsLoseFocus

Without this, cells stay in edit mode when the user clicks elsewhere, and bulk operations can fail.

```tsx
<GraviGrid
  agPropOverrides={{
    stopEditingWhenCellsLoseFocus: true,
  }}
/>
```

### 2. Stable Event Handler References

Grid event handlers in `agPropOverrides` must use `useCallback`. Inline arrows create a new reference every render, causing the grid to re-initialize.

```tsx
// WRONG
agPropOverrides={{ onCellValueChanged: (e) => handleChange(e) }}

// CORRECT
const onCellValueChanged = useCallback((e) => {
  setData(prev => prev.map(r => r.id === e.data.id ? { ...r, [e.colDef.field]: e.newValue } : r))
}, [])

agPropOverrides={{ onCellValueChanged, stopEditingWhenCellsLoseFocus: true }}
```

### 3. suppressKeyboardEvent for Custom Editors

When using custom cell editors, AG Grid intercepts keyboard events (Tab, Enter, Escape). Add `suppressKeyboardEvent` to prevent this:

```tsx
{
  field: 'status',
  editable: true,
  cellEditor: CustomSelectEditor,
  suppressKeyboardEvent: (params) => params.editing,
}
```

---

## Cell Renderers vs valueFormatter

### Decision Rule

- **`valueFormatter`** — For text-only transformations (currency, dates, numbers). Better performance because no React component mounts per cell.
- **`cellRenderer`** — Only when you need JSX (BBDTag, icons, buttons, clickable elements).

```tsx
// GOOD — valueFormatter for simple formatting (fast)
{ field: 'price', valueFormatter: (p) => p.value != null ? `$${p.value.toFixed(2)}` : '' }

// GOOD — cellRenderer because JSX is needed
{ field: 'status', cellRenderer: (p) => <BBDTag success={p.value === 'Active'}>{p.value}</BBDTag> }

// BAD — cellRenderer for what valueFormatter can do
{ field: 'price', cellRenderer: (p) => <span>${p.value?.toFixed(2)}</span> }
```

### Cell Renderer Rules

1. **Always handle null/undefined** — `if (!params.value) return null` as the first line
2. **No business logic** — Renderers format and display only. Compute values in `valueGetter`, not inside `cellRenderer`
3. **Pass metadata via closure** — Use the column def function's closure scope, not `cellRendererParams`

---

## Custom Cell Editor Pattern

> Advanced — for demos that need inline cell editing beyond built-in AG Grid editors.

Custom editors must use `forwardRef` + `useImperativeHandle` with required lifecycle methods:

```tsx
import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'
import { Select } from 'antd'

export const SelectCellEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const selectRef = useRef(null)

  // Auto-focus and open on mount
  useEffect(() => {
    selectRef.current?.focus()
  }, [])

  useImperativeHandle(ref, () => ({
    getValue: () => value,
    isCancelBeforeStart: () => false,
    isCancelAfterEnd: () => false,
  }))

  return (
    <Select
      ref={selectRef}
      value={value}
      defaultOpen
      onChange={(val) => {
        setValue(val)
        // For single-select, stop editing after selection
        setTimeout(() => props.api.stopEditing(), 0)
      }}
      onBlur={() => props.api.stopEditing()}
      options={props.options}
      style={{ width: '100%' }}
    />
  )
})
```

Key requirements:
- `getValue()` — returns the edited value
- `isCancelBeforeStart()` — return `true` to cancel edit before it starts
- `isCancelAfterEnd()` — return `true` to cancel edit after user finishes
- Auto-focus on mount and `defaultOpen` for selects/dates
- `stopEditing()` on blur and after single-select selection

---

## Performance Tips

1. **REQUIRED: Memoize column definitions** — Without this, the grid re-initializes on every render (resets column widths, sort, filters):
   ```tsx
   const columnDefs = useMemo(() => getColumnDefs(), [])
   ```

2. **REQUIRED: Memoize controlBarProps** — Same issue, new object reference causes re-render:
   ```tsx
   const controlBarProps = useMemo(() => ({ title: '...' }), [])
   ```

3. **Use storageKey** — Persists user column preferences. Use kebab-case naming: `{feature}-{descriptor}-grid`:
   ```tsx
   storageKey='contract-management-grid'
   ```
   storageKey must be unique across the entire app — duplicate keys cause one grid's column state to overwrite another's.

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

6. **React.memo for custom cell renderers** — Cell renderers re-render frequently during scroll/edit/resize. Wrap with `React.memo` when they receive the same data.

7. **Prefer valueFormatter over cellRenderer** — valueFormatter is plain text (no React mount per cell). Only use cellRenderer when you need JSX.
