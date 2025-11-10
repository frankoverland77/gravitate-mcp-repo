# Claude Code Instructions for Excalibrr Development

This file provides specific guidance for Claude Code (Cursor AI) when working with Excalibrr components.

## Primary Directive

**NEVER generate inline styles (`style={{...}}`) for Excalibrr components.** 

This is the #1 rule violation. Excalibrr components use a prop-based configuration system, not CSS-based styling.

## Code Generation Workflow

When asked to create or modify Excalibrr components, follow this workflow:

### 1. **Understand the Request**
   - What component type is needed? (layout, form, data grid, etc.)
   - What are the functional requirements?
   - What visual requirements are mentioned?

### 2. **Find the Right Component**
   ```typescript
   // Use these MCP commands:
   // - excalibrr:search_components --query "keyword"
   // - excalibrr:get_component --componentId "component-name"
   ```

### 3. **Map Requirements to Props**
   - **Spacing** → Use `spacing` prop on Horizontal/Vertical
   - **Colors** → Use `theme` or `color` props
   - **Sizes** → Use `size` or `variant` props
   - **Layout** → Use Horizontal/Vertical components
   - **Typography** → Use Texto with `variant` prop

### 4. **Generate Code Using Props**

   **Example Pattern:**
   ```tsx
   import { Horizontal, Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr';

   // ✅ CORRECT
   export const MyComponent = () => {
     return (
       <Vertical spacing="lg">
         <Horizontal spacing="md" align="space-between">
           <Texto variant="h2" color="primary">Title</Texto>
           <GraviButton theme="success" onClick={handleClick}>
             Save
           </GraviButton>
         </Horizontal>
         
         <GraviGrid
           columnDefs={columnDefs}
           rowData={data}
           domLayout="autoHeight"
         />
       </Vertical>
     );
   };
   ```

### 5. **Avoid These Anti-Patterns**

   ```tsx
   // ❌ NEVER DO THIS
   <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
     <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
       Title
     </span>
     <button style={{ backgroundColor: 'green', padding: '10px 20px' }}>
       Save
     </button>
   </div>
   ```

## Component-Specific Patterns

### Layout Components

```tsx
// Horizontal layout
<Horizontal 
  spacing="sm" | "md" | "lg"
  align="start" | "center" | "end" | "space-between" | "space-around"
  wrap={true}
>
  {children}
</Horizontal>

// Vertical layout
<Vertical 
  spacing="sm" | "md" | "lg"
  align="start" | "center" | "end"
>
  {children}
</Vertical>
```

### Typography

```tsx
<Texto 
  variant="h1" | "h2" | "h3" | "body1" | "body2" | "caption"
  color="primary" | "secondary" | "success" | "error" | "warning"
  weight="normal" | "medium" | "bold"
  align="left" | "center" | "right"
>
  Text content
</Texto>
```

### Buttons

```tsx
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
```

### Data Grids

```tsx
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
      editable: true,
      cellEditor: NumberCellEditor,
      type: 'numericColumn'
    }
  ]}
  rowData={data}
  domLayout="autoHeight"
  onCellValueChanged={handleCellChange}
/>
```

### Forms

```tsx
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
```

## Figma to Excalibrr Translation

When translating Figma designs:

1. **Use the mapper agent**: Reference `.claude/agents/figma-excalibrr-mapper.md`
2. **Map visual properties to props**:
   - Figma gap → Excalibrr `spacing` prop
   - Figma font size → Excalibrr `variant` prop
   - Figma colors → Excalibrr theme colors
   - Figma flex → Excalibrr Horizontal/Vertical

3. **Common mappings**:

| Figma Property | Excalibrr Component & Prop |
|----------------|---------------------------|
| Auto Layout (horizontal) | `<Horizontal spacing="md">` |
| Auto Layout (vertical) | `<Vertical spacing="md">` |
| Text with style | `<Texto variant="h2">` |
| Button | `<GraviButton theme="success">` |
| Data table | `<GraviGrid columnDefs={...}>` |
| Form | `<Form>` with `<Vertical>` layout |

## Self-Correction Checklist

Before finalizing generated code, verify:

- [ ] No `style={{...}}` attributes on Excalibrr components
- [ ] Layout uses `Horizontal` or `Vertical` (not `<div>` with flexbox styles)
- [ ] Typography uses `Texto` with `variant` (not styled `<span>` or `<p>`)
- [ ] Buttons use `GraviButton` with `theme` (not styled `<button>`)
- [ ] Spacing uses `spacing` prop (not margin/padding styles)
- [ ] Colors use theme colors via props (not hardcoded hex/rgb)
- [ ] Grid uses `columnDefs` configuration (not inline styles)

## Error Recovery

If you generate code with inline styles:

1. **Acknowledge the error**: "I apologize, I used inline styles which violates Excalibrr's design system."
2. **Reference the rules**: "Let me correct this following the design system rules..."
3. **Regenerate using props**: Provide corrected code using proper props
4. **Suggest cleanup**: "You can also run `excalibrr:cleanup_styles` to auto-fix these issues."

## Example: Complete Component

```tsx
import { Horizontal, Vertical, Texto, GraviButton, GraviGrid } from '@gravitate-js/excalibrr';
import { NumberCellEditor } from '@gravitate-js/excalibrr';
import { useState } from 'react';

export const ProductManager = () => {
  const [rowData, setRowData] = useState([]);

  const columnDefs = [
    {
      field: 'name',
      headerName: 'Product Name',
      width: 200,
      editable: true
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
      editable: true,
      cellEditor: NumberCellEditor,
      cellEditorParams: {
        min: 0,
        precision: 2
      }
    }
  ];

  const handleAddProduct = () => {
    // Add product logic
  };

  return (
    <Vertical spacing="lg">
      <Horizontal spacing="md" align="space-between">
        <Texto variant="h2" color="primary">
          Product Management
        </Texto>
        <GraviButton theme="success" onClick={handleAddProduct}>
          Add Product
        </GraviButton>
      </Horizontal>

      <GraviGrid
        columnDefs={columnDefs}
        rowData={rowData}
        domLayout="autoHeight"
      />
    </Vertical>
  );
};
```

## Remember

Every time you're about to use `style={{...}}` on an Excalibrr component, STOP and find the prop-based alternative. The component props are designed to handle all styling needs while maintaining theme consistency.

If you're unsure about a prop, use `excalibrr:get_component` to check the component's API.
