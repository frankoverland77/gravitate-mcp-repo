# Component Example Template

This template provides the exact structure for creating new component example files in the Excalibrr MCP Server knowledge base. Use this template to ensure consistency and MCP tool compatibility.

## Quick Start Checklist

- [ ] Create file at `mcp-server/src/knowledge/components/{ComponentName}/index.ts`
- [ ] Copy file template structure below
- [ ] Replace `{ComponentName}` with actual component name
- [ ] Add 3-6 examples: simple → medium → complex
- [ ] Use Excalibrr components (Vertical, Horizontal, Texto)
- [ ] Validate with component-examples-checklist.md

## File Template Structure

```typescript
/**
 * {ComponentName} Component Examples Database
 *
 * This file contains production-inspired examples of the {ComponentName} component.
 * These examples are used by the MCP server tools to generate high-quality demos.
 */

export interface ComponentExample {
  id?: string
  name: string
  description: string
  complexity: "simple" | "medium" | "complex"
  category?: string
  tags: string[]
  code: string
  props?: Record<string, any>
  dependencies?: string[]
  notes?: string
  sourceFile?: string
}

export const {ComponentName}Examples: ComponentExample[] = [
  // Examples go here using the template below
]

export default {ComponentName}Examples
```

## Example Entry Template

```typescript
{
  // Optional - can omit if not needed
  id: "optional_unique_identifier",
  
  // Required - Business-focused descriptive name
  name: "Business Use Case Name",
  
  // Required - Specific description of what this demonstrates  
  description: "What this specific example demonstrates and teaches",
  
  // Required - Based on props count and complexity
  complexity: "simple", // "simple" | "medium" | "complex"
  
  // Optional - Usage category
  category: "interactive", // See category guide below
  
  // Required - Functionality tags
  tags: ["functionality", "keywords", "that", "describe", "features"],
  
  // Required - Complete working React component
  code: `import React, { useState } from 'react'
import { Modal } from 'antd'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'

export function ExampleComponent({ visible, onCancel, onConfirm }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      // Success handling
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title='Example Modal'
      footer={
        <Horizontal justifyContent='flex-end' style={{ gap: '10px' }}>
          <GraviButton buttonText='Cancel' onClick={onCancel} />
          <GraviButton
            buttonText='Confirm'
            primary
            onClick={handleConfirm}
            loading={loading}
          />
        </Horizontal>
      }
    >
      <Vertical>
        <Texto category='h6'>Example Content</Texto>
        <Texto category='p2'>This is example modal content.</Texto>
      </Vertical>
    </Modal>
  )
}`,
  
  // Optional - Describe key props and their purpose
  props: {
    visible: "controls modal visibility",
    onCancel: "close handler function", 
    onConfirm: "confirmation action handler",
    loading: "async operation state"
  },
  
  // Required - All packages needed to run this code
  dependencies: ["react", "antd", "@gravitate-js/excalibrr"],
  
  // Optional - Reference to inspiration source
  sourceFile: "/optional/path/to/source/file.tsx",
  
  // Optional but recommended - Usage guidance
  notes: "Perfect for confirmation dialogs. Shows proper loading states and error handling patterns."
}
```

## Complexity Guidelines

### Simple Examples (1-3 main props)
**Criteria:**
- Basic component usage
- Minimal configuration  
- Clear single purpose
- Good starting point

**Examples:**
- Basic confirmation modal
- Simple login form
- Read-only data display

**Typical Props:** `visible`, `title`, `onCancel`, `children`

### Medium Examples (4-7 props)
**Criteria:** 
- Business logic included
- Event handling
- Form validation or data processing
- Realistic usage scenarios

**Examples:**
- User creation forms
- Data grids with selection
- Settings modals with validation

**Typical Props:** Form handling, validation, loading states, callbacks

### Complex Examples (8+ props)
**Criteria:**
- Advanced patterns
- Multiple integrations
- Complex state management
- Production-level scenarios

**Examples:**
- Multi-step wizards
- Dynamic filter interfaces
- Advanced trading components

**Typical Props:** Complex configuration objects, multiple callback handlers, advanced state

## Category Options

Choose the most appropriate category:

- **`basic-usage`** - Simple, getting started examples
- **`interactive`** - User interactions, confirmations, buttons
- **`data`** - Data display, grids, analytics, tables
- **`forms`** - Form handling, validation, input management  
- **`advanced-config`** - Complex configuration, customization

## Tag Guidelines

Include 3-6 tags that describe:

### Functionality Tags
- `confirmation`, `validation`, `selection`, `editing`
- `drag-drop`, `sorting`, `filtering`, `search`
- `file-upload`, `export`, `import`

### Complexity Tags  
- `basic`, `advanced`, `dynamic`, `configurable`
- `multi-step`, `wizard`, `complex`

### Business Domain Tags
- `user-management`, `authentication`, `trading`
- `analytics`, `reporting`, `settings`

### Technical Tags
- `api-integration`, `state-management`, `async`
- `real-time`, `websocket`, `caching`

## Code Requirements

### Required Imports
Always include core dependencies:
```typescript
import React from 'react'
// Ant Design components as needed (NOT Button - use GraviButton)
import { Modal, Form } from 'antd'
// Always use Excalibrr components for layout, typography, and buttons
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
```

### Component Structure
```typescript
export function ComponentName({ prop1, prop2, ...props }) {
  // State management
  const [state, setState] = useState(defaultValue)
  
  // Event handlers
  const handleAction = async () => {
    // Implementation with proper error handling
  }
  
  // Return JSX using Excalibrr components
  return (
    <ComponentWrapper>
      <Vertical className='gap-16'>
        <Texto category='h3'>Title</Texto>
        {/* Component content */}
      </Vertical>
    </ComponentWrapper>
  )
}
```

### Error Handling Pattern
Include realistic error handling:
```typescript
const handleSubmit = async (values) => {
  setLoading(true)
  try {
    await apiCall(values)
    NotificationMessage('Success.', 'Operation completed!', false)
  } catch (error) {
    NotificationMessage('Error.', 'Operation failed', true)
  } finally {
    setLoading(false)  
  }
}
```

## Dependencies List

### Always Include
```typescript
dependencies: ["react", "antd", "@gravitate-js/excalibrr"]
```

### Add When Used
- `"@ant-design/icons"` - When using Ant Design icons
- `"@tanstack/react-query"` - For API integration examples
- `"dayjs"` - For date formatting (if needed)
- Custom hooks or utilities as referenced

## Props Documentation Format

Document props with their purpose, not just types:

```typescript
props: {
  // ✅ Good - Explains purpose
  visible: "controls modal visibility state",
  onSubmit: "form submission handler with validation",
  loading: "async operation loading state",
  
  // ❌ Avoid - Just states type  
  visible: "boolean",
  onSubmit: "function",
  loading: "boolean"
}
```

## Notes Writing

Write helpful notes that explain:

```typescript
// Template
notes: "Perfect for [use case]. [Key feature explanation]. [Implementation tip or when to use]."

// Examples  
notes: "Perfect for user management interfaces. Shows proper form validation and error handling. Use when you need complex user creation workflows."

notes: "Excellent for confirmation dialogs. Uses Excalibrr theming system. Ideal for destructive actions that need user confirmation."
```

## File Location

Create the file at:
```
mcp-server/src/knowledge/components/{ComponentName}/index.ts
```

Replace `{ComponentName}` with the actual component name (e.g., `Modal`, `Form`, `Grid`).

## Critical Conventions

**These conventions are frequently violated. Examples MUST follow them:**

### Texto Appearance Values
```tsx
// ⚠️ CRITICAL: "secondary" = BLUE, NOT gray!
<Texto appearance='secondary'>This is BLUE text</Texto>  // Blue!
<Texto appearance='medium'>This is gray text</Texto>     // Gray - use for labels
```

### Modal/Drawer Visibility
```tsx
// ✅ CORRECT
<Modal visible={isOpen} />
<Drawer visible={isOpen} />

// ❌ WRONG - 'open' prop doesn't work
<Modal open={isOpen} />
```

### GraviButton Props
```tsx
// ✅ CORRECT - Boolean props
<GraviButton primary />
<GraviButton success />
<GraviButton danger />

// ❌ WRONG - theme string
<GraviButton theme='success' />
```

### GraviGrid Required Prop
```tsx
// ✅ CORRECT - Always include agPropOverrides
<GraviGrid
  agPropOverrides={{}}
  columnDefs={columnDefs}
  rowData={data}
/>

// ❌ WRONG - Missing required prop
<GraviGrid columnDefs={columnDefs} rowData={data} />
```

### Layout Component Props
```tsx
// ✅ CORRECT - Use component props for layout
<Horizontal justifyContent='space-between' alignItems='center'>

// ❌ WRONG - Inline styles for layout props
<Horizontal style={{ justifyContent: 'space-between' }}>
```

### Gap Handling
```tsx
// ✅ CORRECT - Utility class or style with string unit
<Vertical className='gap-16'>
<Horizontal style={{ gap: '12px' }}>

// ❌ WRONG - gap prop or number without unit
<Horizontal gap={12}>
<Vertical style={{ gap: 16 }}>
```

### Utility Classes (prefer over inline styles)
```
Spacing: mb-1, mb-2, mb-4, mt-1, ml-2, p-2, p-3
Layout: border-radius-5, text-center, gap-16, gap-10
```

### Named Exports Only
```tsx
// ✅ CORRECT
export function MyComponent() { }

// ❌ WRONG
export default function MyComponent() { }
const MyComponent = () => { }
```

---

## Validation Checklist

Before committing your new example file:

- [ ] Uses generic `ComponentExample` interface
- [ ] Export pattern: `export const {ComponentName}Examples: ComponentExample[]`
- [ ] Code includes realistic business scenario
- [ ] Uses Excalibrr layout components (Vertical, Horizontal, Texto)
- [ ] Includes proper error handling and loading states
- [ ] Dependencies list is complete and accurate
- [ ] Tags accurately describe the functionality
- [ ] Complexity level matches the actual code complexity
- [ ] Notes provide clear usage guidance
- [ ] Code would work when inserted into demo templates

This template ensures your component examples integrate seamlessly with the MCP server tools and provide valuable patterns for demo generation.