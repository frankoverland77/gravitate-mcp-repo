# Component API Reference

This is the single source of truth for Excalibrr and AntD component usage in the demo app. Read this before writing any code.

## Table of Contents
- [Horizontal & Vertical (Layout)](#horizontal--vertical)
- [Texto (Typography)](#texto)
- [GraviButton](#gravibutton)
- [GraviGrid](#gravigrid)
- [BBDTag](#bbdtag)
- [Modal & Drawer](#modal--drawer)
- [Form Components (AntD)](#form-components)
- [Tabs, Menu, Select (AntD v5)](#antd-v5-api-changes)
- [NotificationMessage](#notificationmessage)
- [Complete Anti-Pattern Table](#complete-anti-pattern-table)
- [Validation Rules](#validation-rules)

---

## Horizontal & Vertical

Flex containers. **Never use `<div style={{display:'flex'}}>` — always use these.**

```tsx
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `justifyContent` | CSS value | `'space-between'`, `'center'`, `'flex-end'`, etc. |
| `alignItems` | CSS value | `'center'`, `'flex-start'`, `'stretch'`, etc. |
| `flex` | string | Use `flex="1"` instead of `style={{ flex: 1 }}` |
| `height` | string | Use `height="100%"` instead of `style={{ height: '100%' }}` |
| `gap` | number | Use `gap={12}` for flex gap spacing |
| `fullHeight` | boolean | Shorthand for `height="100%"` |
| `className` | string | For utility classes like `p-3 mb-2` |

### Layout Patterns

```tsx
// Page wrapper — fills available space
<Vertical flex='1'>
  {children}
</Vertical>

// Control bar — fixed height header
<Vertical flex='0 55px'>
  <Horizontal justifyContent='space-between' alignItems='center'>
    <Texto category='h2'>Page Title</Texto>
    <Horizontal gap={12}>
      <GraviButton buttonText='Export' />
      <GraviButton buttonText='Add New' theme1 icon={<PlusOutlined />} />
    </Horizontal>
  </Horizontal>
</Vertical>

// Content area — fills remaining space
<Vertical flex='1'>
  <GraviGrid ... />
</Vertical>

// Two-column layout
<Horizontal gap={24} flex='1'>
  <Vertical flex='2'>{mainContent}</Vertical>
  <Vertical flex='1'>{sidebar}</Vertical>
</Horizontal>
```

---

## Texto

**Never use `<p>`, `<h1>`-`<h6>`, or `<span>`. Always use Texto.**

```tsx
import { Texto } from '@gravitate-js/excalibrr'
```

### Props

| Prop | Values | Description |
|------|--------|-------------|
| `category` | `'h1'`-`'h6'`, `'p1'`, `'p2'`, `'heading'`, `'heading-small'` | Size/semantic level |
| `appearance` | `'primary'`, `'secondary'`, `'medium'`, `'light'`, `'error'`, `'success'`, `'warning'` | Color |
| `weight` | `'400'`, `'500'`, `'600'`, `'700'`, `'bold'` | Font weight |

### CRITICAL: Appearance Colors

| Appearance | Actual Color | Use For |
|------------|-------------|---------|
| `primary` | Black/dark | Default body text |
| `secondary` | **BLUE** | Links, accent text. **NOT gray!** |
| `medium` | **Gray** | Labels, helper text, subdued content |
| `light` | Very light gray | Use sparingly |
| `error` / `success` / `warning` | Status colors | Feedback messages |

The #1 most common mistake is using `appearance="secondary"` when you want gray text. It's blue. Use `appearance="medium"` for gray.

### Common Typography Patterns

```tsx
// Page title
<Texto category='h2'>Delivery Management</Texto>

// Section header (uppercase label)
<Texto category='h6' appearance='medium' weight='600'
       style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
  Section Title
</Texto>

// Field label
<Texto category='p2' appearance='medium'
       style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
  Field Name
</Texto>

// Field value
<Texto category='p1' weight='600'>John Smith</Texto>

// Helper/description text
<Texto category='p2' appearance='medium'>Optional description text</Texto>

// Inline label + value
<Horizontal gap={8} alignItems='center'>
  <Texto category='p2' appearance='medium'>Status:</Texto>
  <Texto category='p2' weight='600'>Active</Texto>
</Horizontal>
```

---

## GraviButton

**Never use `<button>`. Always use GraviButton.**

```tsx
import { GraviButton } from '@gravitate-js/excalibrr'
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `buttonText` | string or JSX | Button label (use this, not children) |
| `onClick` | function | Click handler |
| `theme1` | boolean | Primary brand theme |
| `theme2` | boolean | Secondary brand theme |
| `success` | boolean | Green success button |
| `danger` / `error` | boolean | Red danger button |
| `warning` | boolean | Yellow warning button |
| `appearance` | `'filled'` or `'outlined'` | Button style (default: filled) |
| `icon` | ReactNode | Icon element |
| `size` | `'small'` or `'large'` | Button size |
| `loading` | boolean | Loading spinner state |

### Rules
- Use only ONE theme prop per button
- Use `buttonText` prop, not children
- No `htmlType` prop — use `onClick={() => form.submit()}` for form submission
- Use `appearance="outlined"` not `appearance="outline"` (note the 'd')
- Never use `type='primary'` — that's the AntD `<Button>` prop, not GraviButton
- Never override button colors with inline styles — use semantic theme props

### Semantic Action Mapping

| Action Type | Prop | Example Labels |
|-------------|------|----------------|
| Create / Add / Save | `theme1` | New Contract, Save Changes, Add Item |
| Delete / Remove | `danger` | Delete, Remove, Discard |
| Cancel / Dismiss | *(no theme — default gray)* | Cancel, Close, Back |
| Success / Approve | `success` | Approve, Confirm, Accept |
| Secondary / Export | `appearance='outlined'` | Export, Import, Download |

```tsx
// Primary action
<GraviButton buttonText='Create Order' theme1 icon={<PlusOutlined />} onClick={handleCreate} />

// Secondary/default action
<GraviButton buttonText='Cancel' onClick={handleCancel} />

// Danger action
<GraviButton buttonText='Delete' danger onClick={handleDelete} />

// Outlined variant
<GraviButton buttonText='Export' appearance='outlined' icon={<DownloadOutlined />} />
```

---

## GraviGrid

The data grid component. Wraps AG Grid with Gravitate defaults.

```tsx
import { GraviGrid } from '@gravitate-js/excalibrr'
```

### Required Props

| Prop | Type | Notes |
|------|------|-------|
| `columnDefs` | `ColDef[]` | Column definitions array |
| `rowData` | `any[]` | Data array (NOT `data` — it's `rowData`) |
| `agPropOverrides` | object | **MUST always be present**, even if empty `{}` |

### Common Optional Props

| Prop | Type | Description |
|------|------|-------------|
| `storageKey` | string | Persists column state. Use unique key per grid. |
| `loading` | boolean | Shows loading overlay |
| `controlBarProps` | object | Title and action buttons above the grid |
| `externalRef` | `MutableRefObject<GridApi>` | Access to AG Grid API |
| `sideBar` | boolean | Show/hide sidebar (valid despite TS warnings) |
| `masterDetail` | boolean | Enable row expansion |
| `detailCellRenderer` | component | Component for expanded row content |

### Control Bar

```tsx
<GraviGrid
  controlBarProps={{
    title: 'Contracts',
    actionButtons: (
      <Horizontal gap={8}>
        <GraviButton buttonText='Export' appearance='outlined' icon={<DownloadOutlined />} />
        <GraviButton buttonText='Add Contract' theme1 icon={<PlusOutlined />} />
      </Horizontal>
    ),
  }}
  // ...other props
/>
```

### Column Definitions

Always define in a separate file: `{FeatureName}.columnDefs.tsx`

```tsx
import { ColDef } from 'ag-grid-community'

export const getColumnDefs = (): ColDef[] => [
  { field: 'name', headerName: 'Name', flex: 1, sortable: true, filter: true },
  { field: 'status', headerName: 'Status', width: 120, cellRenderer: StatusRenderer },
  {
    field: 'price',
    headerName: 'Price',
    width: 120,
    valueFormatter: (params) => params.value ? `$${params.value.toFixed(2)}` : '',
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 140,
    valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
  },
  {
    // Virtual column — NO field prop
    headerName: 'Actions',
    width: 100,
    pinned: 'right',
    cellRenderer: (params) => (
      <Horizontal gap={8}>
        <EditOutlined onClick={() => handleEdit(params.data)} style={{ cursor: 'pointer' }} />
        <DeleteOutlined onClick={() => handleDelete(params.data.id)} style={{ cursor: 'pointer', color: 'red' }} />
      </Horizontal>
    ),
  },
]
```

### Virtual Columns

For columns that don't map to a data field (like Actions), do NOT include a `field` prop. This prevents TypeScript errors and AG Grid confusion.

### Styling GraviGrid

GraviGrid does not accept a `style` prop. Wrap it in a container:

```tsx
<Vertical flex='1'>
  <GraviGrid
    rowData={data}
    columnDefs={columnDefs}
    agPropOverrides={{}}
    storageKey='my-grid'
  />
</Vertical>
```

For deeper grid patterns (bulk editing, master-detail, server-side), see `grid-patterns.md`.

---

## BBDTag

Status/label tag component.

```tsx
import { BBDTag } from '@gravitate-js/excalibrr'

// Basic usage — children are REQUIRED
<BBDTag theme2 className='p-2 text-center'>14 Items</BBDTag>

// Status tags
<BBDTag success>Active</BBDTag>
<BBDTag error>Inactive</BBDTag>
<BBDTag warning>Pending</BBDTag>

// Dynamic
<BBDTag success={isActive} error={!isActive}>
  {isActive ? 'Active' : 'Inactive'}
</BBDTag>
```

Rules: children required, one theme prop only.

---

## Modal & Drawer

Use AntD Modal and Drawer. **Critical: use `open` prop, not `visible`.**

```tsx
import { Modal, Drawer } from 'antd'

// Modal
<Modal
  open={isModalOpen}
  title='Edit Contract'
  onCancel={() => setIsModalOpen(false)}
  footer={null}
  destroyOnHidden
  width={600}
>
  {/* Form content */}
</Modal>

// Drawer
<Drawer
  open={isDrawerOpen}
  title='Contract Details'
  onClose={() => setIsDrawerOpen(false)}
  width={480}
  destroyOnHidden
>
  {/* Detail content */}
</Drawer>
```

### AntD v5 Changes (Critical)

| Old (wrong) | New (correct) |
|-------------|---------------|
| `visible={...}` | `open={...}` |
| `destroyOnClose` | `destroyOnHidden` |
| `onVisibleChange` | `onOpenChange` |

---

## Form Components

AntD inputs with Excalibrr layout. See `form-patterns.md` for complete patterns.

```tsx
import { Form, Input, Select, DatePicker, InputNumber, Switch } from 'antd'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'

const [form] = Form.useForm()

<Form form={form} onFinish={handleSubmit} layout='vertical'>
  <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Name is required' }]}>
    <Input />
  </Form.Item>

  <Form.Item name='type' label='Type'>
    <Select options={[
      { value: 'fixed', label: 'Fixed Price' },
      { value: 'index', label: 'Index' },
    ]} />
  </Form.Item>

  <Horizontal justifyContent='flex-end' gap={12}>
    <GraviButton buttonText='Cancel' onClick={onCancel} />
    <GraviButton buttonText='Save' theme1 onClick={() => form.submit()} />
  </Horizontal>
</Form>
```

---

## AntD v5 API Changes

These components switched from children to props. Using the old pattern will break.

### Tabs
```tsx
// WRONG — old pattern
<Tabs>
  <Tabs.TabPane tab='Overview' key='1'>Content</Tabs.TabPane>
</Tabs>

// CORRECT — v5 pattern
<Tabs items={[
  { key: '1', label: 'Overview', children: <OverviewContent /> },
  { key: '2', label: 'Details', children: <DetailsContent /> },
]} />
```

### Menu
```tsx
// WRONG
<Menu><Menu.Item key='1'>Item</Menu.Item></Menu>

// CORRECT
<Menu items={[{ key: '1', label: 'Item' }]} />
```

### Select
```tsx
// WRONG
<Select><Select.Option value='a'>Option A</Select.Option></Select>

// CORRECT
<Select options={[{ value: 'a', label: 'Option A' }]} />
```

---

## NotificationMessage

User feedback utility.

```tsx
import { NotificationMessage } from '@gravitate-js/excalibrr'

// Success notification
NotificationMessage('Success.', 'Record saved successfully', false)

// Error notification
NotificationMessage('Error.', 'Failed to save record', true)
```

Third parameter: `true` = error, `false` = success.

---

## Complete Anti-Pattern Table

This is the full list of things that will break or look wrong. Check your code against this before finishing.

| Category | Anti-Pattern (Don't) | Correct Pattern (Do) | Why |
|----------|---------------------|---------------------|-----|
| Layout | `<div style={{display:'flex'}}>` | `<Horizontal>` or `<Vertical>` | Raw HTML breaks convention |
| Layout | `style={{ flex: 1 }}` | `flex="1"` prop | Use component props |
| Layout | `style={{ height: '100%' }}` | `height="100%"` prop | Use component props |
| Layout | `style={{ gap: '12px' }}` | `gap={12}` prop | Use component props |
| Layout | `style={{ justifyContent: '...' }}` | `justifyContent="..."` prop | Use component props |
| Text | `<p>`, `<h1>`, `<span>` | `<Texto>` | Raw HTML breaks convention |
| Text | `appearance="secondary"` for gray | `appearance="medium"` | Secondary is BLUE |
| Button | `<button>` | `<GraviButton>` | Raw HTML breaks convention |
| Button | `<GraviButton theme="success">` | `<GraviButton success>` | Theme is boolean prop |
| Button | `htmlType="submit"` | `onClick={() => form.submit()}` | htmlType not supported |
| Button | `appearance="outline"` | `appearance="outlined"` | Note the 'd' |
| Grid | Missing `agPropOverrides` | `agPropOverrides={{}}` | Required prop |
| Grid | `data={...}` on GraviGrid | `rowData={...}` | Wrong prop name |
| Grid | `field: 'actions'` on virtual column | Omit `field` entirely | Causes TS errors |
| Grid | `style={{}}` on GraviGrid | Wrap in Vertical/div | No style prop |
| Modal | `visible={...}` | `open={...}` | AntD v5 change |
| Modal | `destroyOnClose` | `destroyOnHidden` | AntD v5 change |
| Modal | `onVisibleChange` | `onOpenChange` | AntD v5 change |
| Tabs | `<Tabs.TabPane>` children | `<Tabs items={[...]}/>` | AntD v5 change |
| Menu | `<Menu.Item>` children | `<Menu items={[...]}/>` | AntD v5 change |
| Select | `<Select.Option>` children | `<Select options={[...]}/>` | AntD v5 change |
| Imports | `@/components/...` | `@components/...` | No slash after @ |
| Imports | `React.lazy()` | Direct imports | No lazy loading in demos |
| Style | Hardcoded hex colors | `var(--theme-color-2)` | Use CSS variables |
| Style | BEM naming (`__`, `--`) | Kebab-case (`-`) | No BEM convention |
| Exports | `export default function` | `export function Name()` | Named exports only |
| Exports | `const Name = () =>` | `export function Name()` | Function declarations |
| Grid | `valueGetter` without `valueSetter` on editable column | Add matching `valueSetter` | Edits silently lost |
| Grid | Inline arrow functions in `agPropOverrides` handlers | `useCallback` wrapper | Causes grid re-render |
| Grid | `cellRenderer` for simple text/number formatting | `valueFormatter` | Performance — no React mount per cell |
| Grid | Editable grid without `stopEditingWhenCellsLoseFocus` | Add to `agPropOverrides` | Cells stay in edit mode on blur |
| Grid | Unmemoized `columnDefs={getColumnDefs()}` | `useMemo(() => getColumnDefs(), [])` | Grid resets on every render |
| Button | `type='primary'` on GraviButton | `theme1` | Wrong prop (AntD Button, not GraviButton) |
| Form | Missing `form.resetFields()` on modal/drawer close | Reset on close AND after submit | Stale data appears in form |
| Form | Submit button without `loading` + `disabled` during save | Both `loading` and `disabled` while submitting | Double-submit possible |

---

## Validation Rules

When reviewing code, check for these in order of severity:

**Errors (must fix):**
- All anti-patterns in the table above
- Unmemoized column definitions or controlBarProps (grid resets on every render)

**Warnings (should fix):**
- GraviGrid missing `storageKey` (column state won't persist)
- `className="gap-12"` instead of `gap={12}` prop (works but prop is preferred)
- Alignment via className instead of component props

**Best practices:**
- Keep mock data in separate `.data.ts` files
- Column definitions in separate `.columnDefs.tsx` files
