# Layout Patterns

Patterns for page layout, spacing, theming, and visual structure.

## Table of Contents
- [Page Layout Templates](#page-layout-templates)
- [Spacing System](#spacing-system)
- [Theme Variables](#theme-variables)
- [Card and Panel Patterns](#card-and-panel-patterns)
- [Detail Panels](#detail-panels)
- [Dashboard Layouts](#dashboard-layouts)
- [Empty and Loading States](#empty-and-loading-states)

---

## Page Layout Templates

### Standard Grid Page
Most common layout — control bar header + full-height grid.

```tsx
<Vertical flex='1'>
  {/* Control bar — fixed height */}
  <Vertical flex='0 55px'>
    <Horizontal justifyContent='space-between' alignItems='center'>
      <Texto category='h2'>Page Title</Texto>
      <Horizontal gap={12}>
        <GraviButton buttonText='Export' appearance='outlined' />
        <GraviButton buttonText='Add New' theme1 icon={<PlusOutlined />} />
      </Horizontal>
    </Horizontal>
  </Vertical>

  {/* Grid fills remaining space */}
  <Vertical flex='1'>
    <GraviGrid ... />
  </Vertical>
</Vertical>
```

### Tabbed Page
```tsx
<Vertical flex='1'>
  <Vertical flex='0 55px'>
    <Tabs
      items={[
        { key: 'overview', label: 'Overview', children: <OverviewTab /> },
        { key: 'details', label: 'Details', children: <DetailsTab /> },
        { key: 'history', label: 'History', children: <HistoryTab /> },
      ]}
    />
  </Vertical>
</Vertical>
```

### Two-Column Layout
```tsx
<Horizontal gap={24} flex='1'>
  <Vertical flex='2'>
    {/* Main content — takes 2/3 width */}
  </Vertical>
  <Vertical flex='1'>
    {/* Sidebar — takes 1/3 width */}
  </Vertical>
</Horizontal>
```

### Sidebar + Main Content
```tsx
<Horizontal flex='1'>
  <Vertical style={{ width: 280, borderRight: '1px solid var(--theme-border-color)' }} className='p-3'>
    {/* Sidebar navigation or filters */}
  </Vertical>
  <Vertical flex='1' className='p-3'>
    {/* Main content */}
  </Vertical>
</Horizontal>
```

### Grid + Detail Panel
Grid on top/left, detail panel shows when a row is selected.

```tsx
const [selectedRow, setSelectedRow] = useState(null)

<Horizontal flex='1' gap={16}>
  <Vertical flex='1'>
    <GraviGrid
      agPropOverrides={{
        onRowClicked: (event) => setSelectedRow(event.data),
      }}
      ...
    />
  </Vertical>
  {selectedRow && (
    <Vertical style={{ width: 400, borderLeft: '1px solid var(--theme-border-color)' }} className='p-3'>
      <DetailPanel data={selectedRow} onClose={() => setSelectedRow(null)} />
    </Vertical>
  )}
</Horizontal>
```

---

## Spacing System

### Utility Classes

| Class | CSS Property | Value |
|-------|-------------|-------|
| `mb-1` | margin-bottom | 4px |
| `mb-2` | margin-bottom | 8px |
| `mb-3` | margin-bottom | 12px |
| `mb-4` | margin-bottom | 16px |
| `mt-1` | margin-top | 4px |
| `mt-2` | margin-top | 8px |
| `ml-1` | margin-left | 4px |
| `ml-2` | margin-left | 8px |
| `mr-1` | margin-right | 4px |
| `mr-2` | margin-right | 8px |
| `p-1` | padding | 4px |
| `p-2` | padding | 8px |
| `p-3` | padding | 16px |
| `gap-8` | gap | 8px |
| `gap-10` | gap | 10px |
| `gap-12` | gap | 12px |
| `gap-16` | gap | 16px |
| `border-radius-5` | border-radius | 5px |
| `text-center` | text-align | center |

### Standard Spacing Values

| Context | Spacing |
|---------|---------|
| Between sections | 24px (`gap={24}`) |
| Between related elements | 16px (`gap={16}` or `className='gap-16'`) |
| Between form fields | 12-16px (AntD Form default) |
| Between buttons | 8-12px (`gap={8}` or `gap={12}`) |
| Page padding | 16-24px (`className='p-3'`) |
| Card internal padding | 16px (`className='p-3'`) |

### Spacing Priority

1. **Component `gap` prop** — preferred for flex containers: `<Horizontal gap={12}>`
2. **Utility classes** — for margins/padding: `className='mb-2 p-3'`
3. **Inline styles** — only for dynamic or theme-variable values: `style={{ marginTop: spacing }}`

---

## Theme Variables

Use CSS variables instead of hardcoded colors. These adapt to the active brand theme (OSP, BP, Sunoco, PE, etc.).

### Backgrounds
```css
var(--theme-bg-default)       /* Page background */
var(--theme-bg-elevated)      /* Card/panel background */
var(--theme-bg-subtle)        /* Subtle background for sections */
```

### Text Colors
```css
var(--theme-color-text)       /* Primary text */
var(--theme-color-2)          /* Brand accent color (links, highlights) */
var(--theme-color-text-muted) /* Muted/secondary text */
```

### Borders
```css
var(--theme-border-color)     /* Standard border */
```

### Usage
```tsx
// Elevated card
<Vertical
  className='p-3 border-radius-5'
  style={{
    backgroundColor: 'var(--theme-bg-elevated)',
    border: '1px solid var(--theme-border-color)',
  }}
>
  {content}
</Vertical>

// Subtle section background
<Vertical className='p-3' style={{ backgroundColor: 'var(--theme-bg-subtle)' }}>
  {content}
</Vertical>
```

---

## Card and Panel Patterns

### Elevated Card
```tsx
<Vertical
  className='p-3 border-radius-5'
  style={{
    backgroundColor: 'var(--theme-bg-elevated)',
    border: '1px solid var(--theme-border-color)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  }}
>
  <Texto category='h5' weight='600'>Card Title</Texto>
  <Texto category='p2' appearance='medium' className='mt-1'>Description text</Texto>
</Vertical>
```

### Bordered Section
```tsx
<Vertical
  className='p-3'
  style={{ border: '1px solid var(--theme-border-color)', borderRadius: 6 }}
>
  <Texto category='h6' appearance='medium' weight='600'
         style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
    Section Header
  </Texto>
  <Vertical className='mt-2' gap={8}>
    {content}
  </Vertical>
</Vertical>
```

### Metric Card (for Dashboards)
```tsx
<Vertical
  className='p-3 border-radius-5'
  style={{
    backgroundColor: 'var(--theme-bg-elevated)',
    border: '1px solid var(--theme-border-color)',
  }}
>
  <Texto category='p2' appearance='medium'>Total Contracts</Texto>
  <Texto category='h2' weight='700'>1,247</Texto>
  <Horizontal gap={4} alignItems='center'>
    <ArrowUpOutlined style={{ color: '#059669', fontSize: 12 }} />
    <Texto category='p2' style={{ color: '#059669' }}>+12.5%</Texto>
    <Texto category='p2' appearance='medium'>vs last month</Texto>
  </Horizontal>
</Vertical>
```

---

## Detail Panels

Label/value pairs for showing record details.

### Vertical Label/Value
```tsx
<Vertical gap={4}>
  <Texto category='p2' appearance='medium'
         style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
    Contract Name
  </Texto>
  <Texto category='p1' weight='600'>{record.name}</Texto>
</Vertical>
```

### Two-Column Detail Grid
```tsx
<Horizontal gap={24} style={{ flexWrap: 'wrap' }}>
  <Vertical gap={4} style={{ minWidth: 200 }}>
    <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase' }}>Type</Texto>
    <Texto category='p1' weight='600'>{record.type}</Texto>
  </Vertical>
  <Vertical gap={4} style={{ minWidth: 200 }}>
    <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase' }}>Status</Texto>
    <BBDTag success={record.status === 'Active'}>{record.status}</BBDTag>
  </Vertical>
  <Vertical gap={4} style={{ minWidth: 200 }}>
    <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase' }}>Volume</Texto>
    <Texto category='p1' weight='600'>{record.volume?.toLocaleString()} BBL</Texto>
  </Vertical>
  <Vertical gap={4} style={{ minWidth: 200 }}>
    <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase' }}>Price</Texto>
    <Texto category='p1' weight='600'>${record.price?.toFixed(2)}</Texto>
  </Vertical>
</Horizontal>
```

### Inline Label/Value
```tsx
<Horizontal gap={8} alignItems='center'>
  <Texto category='p2' appearance='medium'>Status:</Texto>
  <Texto category='p2' weight='600'>{record.status}</Texto>
</Horizontal>
```

---

## Dashboard Layouts

### Metrics Row + Content Grid
```tsx
<Vertical flex='1' gap={24} className='p-3'>
  {/* Metrics row */}
  <Horizontal gap={16}>
    <MetricCard title='Total Revenue' value='$2.4M' change='+8.2%' />
    <MetricCard title='Active Contracts' value='847' change='+3.1%' />
    <MetricCard title='Deliveries' value='12,340' change='-1.4%' />
    <MetricCard title='Open Issues' value='23' change='-15%' />
  </Horizontal>

  {/* Content area */}
  <Horizontal gap={24} flex='1'>
    <Vertical flex='2'>
      <GraviGrid ... /> {/* Recent activity grid */}
    </Vertical>
    <Vertical flex='1' gap={16}>
      {/* Quick stats / sidebar widgets */}
    </Vertical>
  </Horizontal>
</Vertical>
```

---

## Empty and Loading States

### Empty State
```tsx
<Vertical flex='1' justifyContent='center' alignItems='center' gap={16}>
  <InboxOutlined style={{ fontSize: 48, color: 'var(--theme-color-text-muted)' }} />
  <Texto category='h4' appearance='medium'>No contracts found</Texto>
  <Texto category='p2' appearance='medium'>Create your first contract to get started.</Texto>
  <GraviButton buttonText='Create Contract' theme1 icon={<PlusOutlined />} />
</Vertical>
```

### Loading State
```tsx
import { Spin } from 'antd'

<Vertical flex='1' justifyContent='center' alignItems='center'>
  <Spin size='large' />
  <Texto category='p2' appearance='medium' className='mt-2'>Loading contracts...</Texto>
</Vertical>
```
