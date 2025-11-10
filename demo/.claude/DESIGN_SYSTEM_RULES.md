# Excalibrr Design System Rules

**CRITICAL**: These rules MUST be followed when working with Excalibrr components. Violations will break theme consistency and component functionality.

## 🚨 MANDATORY RULE: NO INLINE STYLES

**NEVER use inline styles (`style={{...}}`) with Excalibrr components.** This is the #1 violation that breaks theming and component behavior.

### ❌ WRONG:
```tsx
<GraviButton style={{ backgroundColor: 'red', padding: '10px' }}>
  Click Me
</GraviButton>

<Horizontal style={{ gap: '16px', marginTop: '20px' }}>
  <Texto style={{ color: 'blue', fontSize: '14px' }}>Text</Texto>
</Horizontal>
```

### ✅ CORRECT:
```tsx
<GraviButton theme="danger">
  Click Me
</GraviButton>

<Horizontal spacing="md">
  <Texto variant="body1" color="primary">Text</Texto>
</Horizontal>
```

---

## Component Usage Rules

### 1. Layout Components

#### Horizontal & Vertical
Use built-in props instead of CSS:

```tsx
// ✅ CORRECT - Use props
<Horizontal 
  spacing="sm" | "md" | "lg"  // Gap between children
  align="start" | "center" | "end" | "stretch" | "space-between" | "space-around"
  wrap={boolean}
  className="custom-class"  // Only if absolutely necessary
>
  {children}
</Horizontal>

<Vertical
  spacing="sm" | "md" | "lg"
  align="start" | "center" | "end" | "stretch"
  className="custom-class"
>
  {children}
</Vertical>

// ❌ WRONG - Inline styles
<Horizontal style={{ gap: '16px', justifyContent: 'space-between' }}>
  {children}
</Horizontal>
```

#### Texto (Typography)
Always use semantic variants and theme colors:

```tsx
// ✅ CORRECT
<Texto 
  variant="h1" | "h2" | "h3" | "body1" | "body2" | "caption"
  color="primary" | "secondary" | "success" | "error" | "warning"
  weight="normal" | "medium" | "bold"
  align="left" | "center" | "right"
>
  Your text
</Texto>

// ❌ WRONG
<Texto style={{ fontSize: '24px', color: '#333', fontWeight: 600 }}>
  Your text
</Texto>
```

### 2. Button Components

#### GraviButton
Use theme variants, not inline styles:

```tsx
// ✅ CORRECT
<GraviButton
  theme="success" | "theme1" | "danger" | "default"
  size="small" | "medium" | "large"
  disabled={boolean}
  loading={boolean}
  icon={<IconComponent />}
  onClick={handler}
>
  Button Text
</GraviButton>

// ❌ WRONG
<GraviButton 
  style={{ 
    backgroundColor: '#00ff00', 
    padding: '12px 24px',
    borderRadius: '4px'
  }}
>
  Button Text
</GraviButton>
```

### 3. Grid Components

#### GraviGrid
Configure through columnDefs and gridOptions, not styles:

```tsx
// ✅ CORRECT
<GraviGrid
  columnDefs={[
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
      editable: true,
      cellEditor: 'NumberCellEditor',  // Use Excalibrr's custom editors
      type: 'numericColumn'
    }
  ]}
  rowData={data}
  theme="ag-theme-alpine"
  domLayout="autoHeight"
/>

// ❌ WRONG
<GraviGrid
  style={{ height: '500px', width: '100%' }}
  columnDefs={columnDefs}
/>

// ❌ WRONG - Don't use inline cell styles
{
  field: 'status',
  cellStyle: { backgroundColor: 'red', color: 'white' }  // Use cellClass instead
}
```

#### Grid Cell Editors
Always use Excalibrr's custom cell editors:

```tsx
// ✅ CORRECT - Available editors
import { 
  NumberCellEditor,     // For numeric inputs with formatting
  SelectCellEditor      // For dropdown selections
} from '@gravitate-js/excalibrr';

// In columnDefs:
{
  field: 'quantity',
  editable: true,
  cellEditor: NumberCellEditor,
  cellEditorParams: {
    min: 0,
    max: 9999,
    precision: 2
  }
}

{
  field: 'status',
  editable: true,
  cellEditor: SelectCellEditor,
  cellEditorParams: {
    values: ['Active', 'Inactive', 'Pending']
  }
}
```

### 4. Form Components

#### Form Container
Use Form component for proper structure:

```tsx
// ✅ CORRECT
<Form onSubmit={handleSubmit}>
  <Vertical spacing="md">
    <FormField
      label="Name"
      name="name"
      required
      component={<Input />}
    />
    
    <Horizontal spacing="sm" align="end">
      <GraviButton theme="default" onClick={onCancel}>
        Cancel
      </GraviButton>
      <GraviButton theme="success" htmlType="submit">
        Save
      </GraviButton>
    </Horizontal>
  </Vertical>
</Form>

// ❌ WRONG - Don't use div with inline styles
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  <input style={{ padding: '8px', border: '1px solid #ccc' }} />
  <button style={{ backgroundColor: 'blue', color: 'white' }}>Save</button>
</div>
```

### 5. Select Component

```tsx
// ✅ CORRECT
<Select
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ]}
  value={selectedValue}
  onChange={handleChange}
  placeholder="Select an option"
  mode="multiple"  // For multi-select
  showSearch
  allowClear
/>

// ❌ WRONG
<select style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}>
  <option>Option 1</option>
</select>
```

---

## Theme System

### Theme Context
All components automatically inherit theme from ThemeProvider:

```tsx
// App-level (already configured in demo)
<ThemeProvider theme="OSP">  {/* or PE, BP */}
  <App />
</ThemeProvider>
```

### Theme-Aware Colors
Use theme colors instead of hardcoded values:

```tsx
// ✅ CORRECT - Uses theme colors
<Texto color="primary">Themed text</Texto>
<GraviButton theme="success">Themed button</GraviButton>

// ❌ WRONG - Hardcoded colors
<span style={{ color: '#0066cc' }}>Blue text</span>
```

---

## Utility Classes (When Props Aren't Enough)

If you absolutely need custom styling (rare), use utility classes:

```tsx
// ✅ ACCEPTABLE - Utility classes for spacing
<Horizontal className="mt-4 mb-2">
  {children}
</Horizontal>

// ✅ ACCEPTABLE - Custom class in your component's CSS
<GraviGrid className="my-custom-grid" />

// In your CSS file:
.my-custom-grid {
  max-height: 600px;
  border-radius: 8px;
}

// ❌ WRONG - Inline styles
<Horizontal style={{ marginTop: '16px', marginBottom: '8px' }}>
  {children}
</Horizontal>
```

---

## Common Violations to Avoid

### 1. ❌ Spacing with Inline Styles
```tsx
// WRONG
<div style={{ marginTop: '20px', marginBottom: '10px' }}>

// RIGHT
<Vertical spacing="md">  // Or use className="mt-5 mb-2"
```

### 2. ❌ Flexbox with Inline Styles
```tsx
// WRONG
<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

// RIGHT
<Horizontal spacing="md" align="center">
```

### 3. ❌ Typography with Inline Styles
```tsx
// WRONG
<span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>

// RIGHT
<Texto variant="h3" weight="bold" color="primary">
```

### 4. ❌ Button Styling with Inline Styles
```tsx
// WRONG
<button style={{ backgroundColor: 'green', padding: '10px 20px' }}>

// RIGHT
<GraviButton theme="success" size="medium">
```

### 5. ❌ Grid Dimensions with Inline Styles
```tsx
// WRONG
<GraviGrid style={{ height: '400px', width: '100%' }} />

// RIGHT
<GraviGrid domLayout="autoHeight" containerStyle={{ maxHeight: '400px' }} />
```

---

## Component Import Reference

```tsx
// Layout
import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';

// Buttons
import { GraviButton } from '@gravitate-js/excalibrr';

// Data
import { GraviGrid } from '@gravitate-js/excalibrr';

// Forms
import { Form, Select } from '@gravitate-js/excalibrr';

// Cell Editors (for GraviGrid)
import { NumberCellEditor, SelectCellEditor } from '@gravitate-js/excalibrr';
```

---

## Automated Style Cleanup

After making changes, run the cleanup tool to automatically fix inline styles:

```bash
# In Cursor/Claude Code terminal
excalibrr:cleanup_styles

# Or for specific file
excalibrr:cleanup_styles --filePath "src/pages/demos/MyDemo.tsx"
```

---

## Quick Reference: Prop Equivalents

| ❌ Inline Style | ✅ Correct Prop |
|----------------|----------------|
| `style={{ display: 'flex', gap: '16px' }}` | `<Horizontal spacing="md">` |
| `style={{ flexDirection: 'column' }}` | `<Vertical>` |
| `style={{ fontSize: '24px' }}` | `<Texto variant="h2">` |
| `style={{ color: 'blue' }}` | `<Texto color="primary">` |
| `style={{ backgroundColor: 'green' }}` | `<GraviButton theme="success">` |
| `style={{ padding: '20px' }}` | Use spacing prop or utility class |
| `style={{ width: '100%' }}` | Usually automatic, or use className |

---

## When to Ask for Help

If you need to:
1. Create a visual effect not supported by props
2. Override theme colors for a specific component
3. Implement a design pattern not covered here
4. Debug why a component isn't rendering correctly

Use: `excalibrr:help --query "your specific question"`

---

## Summary Checklist

Before committing code, verify:

- [ ] No `style={{...}}` inline styles on Excalibrr components
- [ ] Using appropriate prop-based configuration
- [ ] Layout uses `Horizontal`/`Vertical` with spacing props
- [ ] Typography uses `Texto` with variant props
- [ ] Buttons use `GraviButton` with theme props
- [ ] Grids use columnDefs configuration
- [ ] Theme colors used instead of hardcoded colors
- [ ] Form components use Form container
- [ ] No hardcoded dimensions unless absolutely necessary

---

**Remember**: Excalibrr components are designed to be configured through props, not styled through CSS. This ensures theme consistency, proper theming, and component functionality. When in doubt, check the component's available props before reaching for inline styles.
