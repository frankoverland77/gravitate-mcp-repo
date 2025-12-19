# Excalibrr Component Props Reference

This document provides the definitive reference for Excalibrr component props based on the actual library source code. Use this as the single source of truth for proper component usage.

## Purpose

This reference complements the existing component examples in `/knowledge/components/` by providing:
- ✅ **Exact prop definitions** from library source code
- ✅ **Type information** and requirements
- ✅ **Common mistakes** to avoid
- ✅ **Virtual column patterns** for GraviGrid
- ✅ **Theme usage guidelines**

---

## GraviButton

### Props Interface (from library source)
```typescript
type Props = Partial<ThemeVariants & ButtonProps> & {
  className?: string
  buttonText?: string | JSX.Element
  appearance?: string  // 'filled' | 'outlined' (default: 'filled')
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

// ThemeVariants include:
type ThemeVariants = {
  theme1?: boolean
  theme2?: boolean
  theme3?: boolean
  theme4?: boolean
  error?: boolean
  warning?: boolean
  success?: boolean
}
```

### Usage Examples
```jsx
// ✅ CORRECT - Basic usage
<GraviButton 
  buttonText="Save Changes"
  onClick={handleSave}
/>

// ✅ CORRECT - With theme
<GraviButton 
  buttonText="Create Order" 
  theme2
  onClick={handleCreate}
/>

// ✅ CORRECT - With appearance
<GraviButton 
  buttonText="Add Folder"
  theme2
  appearance="outlined"
  icon={<FolderAddOutlined />}
  size="small"
/>

// ✅ CORRECT - Error state
<GraviButton 
  buttonText="Delete"
  error
  onClick={handleDelete}
/>
```

### Common Mistakes
```jsx
// ❌ WRONG - Multiple themes
<GraviButton theme1 theme2 buttonText="Button" />

// ❌ WRONG - Missing buttonText
<GraviButton onClick={handleClick}>Click Me</GraviButton>

// ✅ CORRECT - Use only one theme
<GraviButton theme2 buttonText="Button" />

// ✅ CORRECT - Use buttonText prop
<GraviButton buttonText="Click Me" onClick={handleClick} />
```

---

## BBDTag

### Props Interface (from library source)
```typescript
type Props = Partial<ThemeVariants & TagProps> & {
  textTransform?: CSSProperties['textTransform']
  className?: string
  children: ReactNode  // REQUIRED
  style?: CSSProperties
}

// ThemeVariants include:
type ThemeVariants = {
  theme1?: boolean
  theme2?: boolean
  theme3?: boolean
  theme4?: boolean
  success?: boolean
  warning?: boolean
  error?: boolean
}
```

### Usage Examples
```jsx
// ✅ CORRECT - Basic usage with theme
<BBDTag theme2 className="p-2 text-center">
  {availableDemos.length} Demos
</BBDTag>

// ✅ CORRECT - Success state
<BBDTag success>
  14 Themes
</BBDTag>

// ✅ CORRECT - With custom styling
<BBDTag error style={{ textTransform: 'uppercase' }}>
  Error Status
</BBDTag>

// ✅ CORRECT - With dynamic content
<BBDTag theme1>
  {isActive ? 'Active' : 'Inactive'}
</BBDTag>
```

### Common Mistakes
```jsx
// ❌ WRONG - Missing children
<BBDTag theme2 />

// ❌ WRONG - Multiple theme props
<BBDTag theme1 success>Content</BBDTag>

// ✅ CORRECT - Always include children
<BBDTag theme2>Content</BBDTag>

// ✅ CORRECT - Use only one theme
<BBDTag success>Content</BBDTag>
```

---

## GraviGrid

### Props Interface (from library source)
```typescript
type GraviGridProps<T extends Record<string, any>, F extends Filter> = {
  children?: ReactNode
  loading?: boolean
  rowData?: T[]  // NOT 'data'!
  columnDefs: Array<ColDef<T>>  // REQUIRED
  columnDefaultOverrides?: AgGridReactProps<T>['defaultColDef']
  controlBarProps?: ControlBarProps<F>
  externalRef?: React.MutableRefObject<GridApi>
  columnApiRef?: React.MutableRefObject<ColumnApi>
  primaryKey?: keyof T
  storageKey?: string
  agPropOverrides: Partial<AgGridReactProps<T>>  // REQUIRED
  // ... many more optional props
}
```

### Usage Examples
```jsx
// ✅ CORRECT - Basic grid
<GraviGrid
  rowData={data}
  columnDefs={[
    {
      field: 'name',
      headerName: 'Name',
      flex: 1
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 100
    }
  ]}
  agPropOverrides={{
    domLayout: 'normal',
    rowHeight: 40
  }}
/>

// ✅ CORRECT - With control bar
<GraviGrid
  rowData={data}
  columnDefs={columnDefs}
  agPropOverrides={{
    getRowId: (row) => row.data?.id,
    rowSelection: 'multiple'
  }}
  controlBarProps={{
    title: 'Data Grid',
    showSelectedCount: true
  }}
  storageKey="MyGrid"
/>
```

### Virtual Columns Pattern
When creating columns that don't correspond to actual data fields (like Actions), **DO NOT** use the `field` prop:

```jsx
// ✅ CORRECT - Virtual actions column
{
  headerName: 'Actions',
  width: 100,
  // NO field property here!
  cellRenderer: (params) => (
    <div>
      <EditOutlined onClick={() => edit(params.data.id)} />
      <DeleteOutlined onClick={() => delete(params.data.id)} />
    </div>
  )
}

// ❌ WRONG - Using field for virtual column
{
  field: 'actions',  // This will cause TypeScript errors
  headerName: 'Actions',
  cellRenderer: (params) => (...)
}
```

### Styling GraviGrid
GraviGrid does not accept a `style` prop directly. Use a wrapper div:

```jsx
// ✅ CORRECT - Wrapper div for styling
<div style={{ 
  height: '250px',
  border: '1px solid #d9d9d9', 
  borderRadius: '6px'
}}>
  <GraviGrid
    rowData={data}
    columnDefs={columnDefs}
    agPropOverrides={{...}}
  />
</div>

// ❌ WRONG - Style prop on GraviGrid
<GraviGrid
  rowData={data}
  columnDefs={columnDefs}
  agPropOverrides={{...}}
  style={{ height: '250px' }}  // This will cause errors
/>
```

### Common Mistakes
```jsx
// ❌ WRONG - Using 'data' instead of 'rowData'
<GraviGrid data={myData} columnDefs={...} />

// ❌ WRONG - Field prop for virtual columns
columnDefs={[
  { field: 'actions', headerName: 'Actions', cellRenderer: ... }
]}

// ❌ WRONG - Missing agPropOverrides
<GraviGrid rowData={data} columnDefs={columnDefs} />

// ✅ CORRECT - Proper usage
<GraviGrid 
  rowData={myData} 
  columnDefs={[
    { headerName: 'Actions', cellRenderer: ... }  // No field for virtual
  ]}
  agPropOverrides={{ domLayout: 'normal' }}
/>
```

---

## Theme Usage Guidelines

### Theme Variants Available
All themed components (GraviButton, BBDTag) support these theme props:
- `theme1`, `theme2`, `theme3`, `theme4`: Brand theme variants
- `success`: Success/positive state (green)
- `warning`: Warning state (yellow/orange)  
- `error`: Error/destructive state (red)

### Theme Rules
1. **Use only ONE theme prop per component**
2. **Theme props are boolean flags**
3. **Don't combine multiple themes**

```jsx
// ✅ CORRECT
<GraviButton theme2 buttonText="Primary Action" />
<BBDTag success>Success</BBDTag>

// ❌ WRONG - Multiple themes
<GraviButton theme1 theme2 buttonText="Confused Button" />
<BBDTag success error>Conflicted Tag</BBDTag>
```

---

## Integration with Existing Documentation

This reference works alongside existing component examples:
- **Examples**: See `/knowledge/components/GraviButton/index.ts` for production usage patterns
- **Grid Examples**: See `/knowledge/components/GraviGrid/index.ts` for complex implementations
- **Props Reference**: Use this document for exact prop definitions and types

---

## Quick Reference Checklist

### Before Using Any Component:
- [ ] Check prop requirements in this reference
- [ ] Use correct prop names (`rowData` not `data`)
- [ ] Use only one theme prop per component
- [ ] Include required props (`children` for BBDTag, `agPropOverrides` for GraviGrid)
- [ ] For virtual columns, omit the `field` prop
- [ ] Wrap GraviGrid in div for styling, don't use `style` prop directly

### TypeScript Errors to Watch For:
- `Property 'data' does not exist` → Use `rowData`
- `Property 'style' does not exist` → Use wrapper div
- `Type '"actions"' is not assignable` → Remove `field` from virtual columns
- `Property 'children' is missing` → Add children content to BBDTag