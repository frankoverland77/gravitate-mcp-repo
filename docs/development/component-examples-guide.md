# Component Examples Guide

This document outlines the coding conventions and patterns for component examples in the Excalibrr MCP Server knowledge base. These examples are used by MCP tools to generate high-quality demos with real Excalibrr components.

## Quick Reference

- **Location**: `mcp-server/src/knowledge/components/ComponentName/index.ts`
- **Interface**: Generic `ComponentExample` (not component-specific)
- **Export**: `export const ComponentNameExamples: ComponentExample[]`
- **Required**: name, description, complexity, tags, code
- **Layout**: Always use Vertical, Horizontal, Texto from Excalibrr

## MCP Server Context

Component examples in `mcp-server/src/knowledge/components/` serve as the knowledge base for:

- **createDemo tool** - Generates grid and dashboard demos
- **createFormDemo tool** - Generates form-based demos  
- **modifyGrid tool** - Modifies existing grid demos
- **Theme switching** - All examples support OSP, PE, BP themes

Examples are inserted into demo templates and must work seamlessly with the monorepo structure.

## File Structure Conventions

### Directory Structure

```
mcp-server/src/knowledge/components/
├── ComponentName/
│   └── index.ts          # Main examples file
└── ...
```

### Header Comment Pattern

Every example file should start with this pattern:

```typescript
/**
 * {ComponentName} Component Examples Database
 *
 * This file contains production-inspired examples of the {ComponentName} component.
 * These examples are used by the MCP server tools to generate high-quality demos.
 */
```

### Interface Declaration

All component example files use the generic `ComponentExample` interface:

```typescript
export interface ComponentExample {
  id?: string                              // Optional unique identifier
  name: string                             // Business-focused name
  description: string                      // What this example demonstrates
  complexity: 'simple' | 'medium' | 'complex'
  category?: string                        // Usage category
  tags: string[]                           // Functionality tags
  code: string                             // React component code
  props?: Record<string, any>              // Props documentation
  dependencies?: string[]                  // Required packages
  notes?: string                           // Usage guidance
  sourceFile?: string                      // Optional source reference
}
```

**Key Points:**

- Use the generic `ComponentExample` interface (NOT `{ComponentName}Example`)
- Optional `id` field can be omitted
- `complexity` uses string literals, no semicolons
- Optional properties marked with `?`

### Export Pattern

```typescript
export const {ComponentName}Examples: ComponentExample[] = [
  // examples...
]

export default {ComponentName}Examples
```

**Example:**
```typescript
export const ModalExamples: ComponentExample[] = [...]
export default ModalExamples
```

## Naming Conventions

### Component Names

Use descriptive names that reflect business purpose and complexity:

**Good Examples:**
- "Basic Confirmation Modal"
- "User Creation Form" 
- "Advanced Filter Grid"
- "Login Form with Branding"

**Pattern:**
- Start with complexity when helpful ("Basic", "Advanced")
- Include primary business function
- Add distinguishing features when relevant

### ID Convention (Optional)

When using IDs, follow this pattern:
- `component_simple_01`
- `component_medium_02` 
- `component_complex_03`

**Examples:**
- `modal_simple_01`
- `form_medium_02`
- `grid_complex_03`

## Complexity Guidelines

### Simple Examples
- **Criteria**: 1-3 main props, minimal configuration, basic usage
- **Examples**: Basic confirmation modal, simple login form
- **Props**: Usually includes basic props like `visible`, `onCancel`, `title`

### Medium Examples  
- **Criteria**: 4-7 props, moderate configuration, business logic
- **Examples**: User creation forms, data grids with selection
- **Props**: Includes event handlers, form validation, `agPropOverrides`

### Complex Examples
- **Criteria**: 8+ props, advanced configuration, multiple integrations
- **Examples**: Multi-step wizards, dynamic filter forms, trading interfaces
- **Props**: Extensive configuration, custom renderers, complex state management

## Code Quality Standards

### Production-Ready Patterns

All examples should demonstrate realistic business scenarios:

```typescript
// ✅ Good - Real business context
code: `import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import { Vertical, Texto, NotificationMessage } from '@gravitate-js/excalibrr'

export function UserCreationForm({ onUserCreated }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      // Real API integration pattern
      await createUser(values)
      NotificationMessage('Success', 'User created successfully!', false)
      form.resetFields()
      onUserCreated?.(values)
    } catch (error) {
      NotificationMessage('Error', 'Failed to create user', true)
    } finally {
      setLoading(false)
    }
  }
  
  // Real form implementation...
}`
```

### Excalibrr Component Usage

Always prefer Excalibrr components for layout and typography:

```typescript
// ✅ Use Excalibrr components
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'

// Layout components
<Vertical style={{ gap: '1rem' }}>
<Horizontal justifyContent="space-between">

// Typography  
<Texto type="h3">Form Title</Texto>
<Texto category="p2">Description text</Texto>
```

### String Formatting

```typescript
// Use double quotes consistently
title: "User Creation Form"
className: "create-user-modal"
storageKey: "userManagementGrid"

// Format long function calls
getRowId: (row) =>
  row?.data?.userId || row?.data?.tempId,
```

## Category Standards

Use these established categories:

- **`basic-usage`** - Simple, getting started examples
- **`interactive`** - User interactions, confirmations, buttons
- **`data`** - Data display, grids, analytics  
- **`forms`** - Form handling, validation, input management
- **`advanced-config`** - Complex configuration, customization

## Tag Conventions

### Tagging Patterns

```typescript
// Simple examples
tags: ["basic", "confirmation", "modal", "excalibrr"]

// Medium examples  
tags: ["user-management", "form", "validation", "api-integration"]

// Complex examples
tags: ["dynamic", "multi-step", "wizard", "advanced-state"]
```

### Tag Categories:

- **Functionality**: `confirmation`, `validation`, `drag-drop`, `selection`
- **Complexity**: `basic`, `advanced`, `dynamic`, `complex`
- **Business Domain**: `user-management`, `trading`, `analytics`, `auth`
- **Technical Features**: `api-integration`, `state-management`, `async`, `file-upload`

## Dependencies Standards

### Required Dependencies

Always include the core dependencies:
```typescript
dependencies: ["react", "antd", "@gravitate-js/excalibrr"]
```

### Optional Dependencies

Add when used in the example:
```typescript
dependencies: [
  "react",
  "antd", 
  "@gravitate-js/excalibrr",
  "@ant-design/icons",        // For icon usage
  "@tanstack/react-query",    // For API integration
]
```

## Props Documentation

Document props using descriptive strings that explain purpose:

```typescript
// ✅ Good - Explains purpose
props: {
  visible: "controls modal visibility state",
  onCancel: "close handler function", 
  form: "Ant Design form instance for validation",
  loading: "async operation loading state"
}

// ❌ Bad - Just states type
props: {
  visible: "boolean",
  onCancel: "function",
  form: "Form instance",  
  loading: "boolean"
}
```

## Notes Guidelines

Write helpful notes that explain:

- **When to use**: Specific scenarios where this pattern is ideal
- **Why it works**: What makes this pattern effective  
- **Key features**: Important aspects to highlight

### Example Notes

```typescript
notes: "Perfect for user management systems. Shows proper form validation, loading states, and error handling patterns."

notes: "Excellent for confirmation dialogs. Uses Excalibrr components for consistent theming and provides clear user feedback."
```

## MCP Tool Integration

### Demo Generation Compatibility

Examples must work with MCP tools:

- **Code insertion**: Examples are inserted into demo templates
- **Theme compatibility**: All examples support theme switching
- **Import resolution**: Dependencies must resolve in demo workspace
- **Component patterns**: Use Excalibrr layout components

### Tool-Specific Requirements

**createDemo Integration:**
- Grid examples work with `type: "grid"` 
- Dashboard examples work with `type: "dashboard"`
- All examples support theme prop

**createFormDemo Integration:**  
- Form examples provide field configuration
- Support for validation patterns
- Loading state management

## Validation Checklist

Before finalizing any example:

- [ ] Uses generic `ComponentExample` interface
- [ ] Includes realistic business scenario  
- [ ] Uses Excalibrr components (Vertical, Horizontal, Texto)
- [ ] Includes proper error handling and loading states
- [ ] Tags accurately describe functionality
- [ ] Dependencies list is complete
- [ ] Code works with theme system
- [ ] Notes explain when/why to use the pattern

This guide ensures all component examples maintain consistency and work seamlessly with the MCP server tools for generating high-quality demos.