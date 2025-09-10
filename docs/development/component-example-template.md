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
import { Modal, Button } from 'antd'
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
      title="Example Modal"
      footer={
        <Horizontal justifyContent="flex-end" style={{ gap: 10 }}>
          <GraviButton buttonText="Cancel" onClick={onCancel} />
          <GraviButton 
            buttonText="Confirm" 
            theme1 
            onClick={handleConfirm}
            loading={loading}
          />
        </Horizontal>
      }
    >
      <Vertical>
        <Texto category="h6">Example Content</Texto>
        <Texto category="p2">This is example modal content.</Texto>
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
// Ant Design components as needed
import { Modal, Form, Button } from 'antd'
// Always use Excalibrr layout components
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
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
      <Vertical style={{ gap: '1rem' }}>
        <Texto type="h3">Title</Texto>
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
    NotificationMessage('Success', 'Operation completed!', false)
  } catch (error) {
    NotificationMessage('Error', 'Operation failed', true)
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
- `"moment"` - For date formatting (if needed)
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