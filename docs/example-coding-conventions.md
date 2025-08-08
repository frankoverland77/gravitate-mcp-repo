# Example Coding Conventions

Based on analysis of the high-quality production examples in `/src/examples/components/`, this document outlines the coding conventions and patterns to follow when creating component examples.

## File Structure Conventions

### Header Comment Pattern

Every example file should start with this exact pattern:

```typescript
/**
 * {ComponentName} Component Examples Database
 *
 * This file contains {high-quality/production-tested} examples of the {ComponentName} component
 * extracted from {the Gravitate frontend codebase/production codebase}. These examples range from
 * {simple to complex implementations/simple data display to complex interactive features}, covering various use cases and patterns.
 *
 * {Additional context like "Source: Gravitate.Dotnet.Next/frontend production codebase"}
 * Used by {the MCP server/MCP server} {to/for} generate{ing} high-quality {ComponentName} implementations.
 */
```

### Interface Declaration

```typescript
export interface {ComponentName}Example {
  id: string
  name: string
  description: string
  complexity: 'simple' | 'medium' | 'complex'
  category?: string
  tags: string[]
  code: string
  props: Record<string, any>
  dependencies?: string[]
  notes?: string
  sourceFile?: string
}
```

**Key Points:**

- No semicolons after property declarations
- Use single quotes for string literal types
- Optional properties marked with `?`

### Export Pattern

```typescript
export const {ComponentName}Examples: {ComponentName}Example[] = [
  // examples...
]

export default {ComponentName}Examples
```

## ID Naming Conventions

### Pattern: `{component_name}_{complexity}_{sequential_number}`

**Examples from production:**

- `gravi_grid_simple_01`
- `gravi_grid_medium_02`
- `modal_complex_03`
- `popover_medium_01`

**Rules:**

- Use lowercase component name with underscores
- Use full complexity word (`simple`, `medium`, `complex`)
- Use zero-padded numbers (`01`, `02`, `03`)

## Component Naming Patterns

### Business-Focused Names

Use descriptive names that reflect the business purpose:

**Good Examples:**

- "Basic Confirmation Modal"
- "Trading Grid with Range Selection"
- "Command Center Tree Data Grid"
- "Price Performance Analytics Grid"
- "Dual Mode Form Popover"

**Pattern:**

- Start with complexity indicator when helpful ("Basic", "Advanced")
- Include primary business function
- Add distinguishing features when relevant

## Code Quality Standards

### String Formatting

```typescript
// Use double quotes consistently
title: "All Contract Details"
className: "spread-override-modal"
storageKey: "energyTradingGrid"

// Format long function calls
getRowId: (row) =>
  row?.data?.TradeEntryDetailId || row?.data?.LocalTradeEntryDetailId,
```

### Production Code Patterns

#### GraviGrid Examples

```typescript
// Always show realistic agPropOverrides
agPropOverrides={{
  getRowId: (row) => row.data?.TradeEntryId,
  rowSelection: "multiple",
  suppressCellSelection: true,
  rowGroupPanelShow: "onlyWhenGrouping",
  onRowSelected: handleRowSelection,
}}

// Include controlBarProps when relevant
controlBarProps={{
  title: "Energy Trading",
  actionButtons: <ActionButtons onExport={handleExport} />
}}

// Always include storageKey for persistence
storageKey="energyTradingGrid"
```

#### Modal Examples

```typescript
// Show real footer patterns
footer={
  <Horizontal justifyContent="flex-end" style={{ gap: 10 }}>
    <GraviButton buttonText="Cancel" onClick={onCancel} />
    <GraviButton buttonText="Confirm" theme1 onClick={onConfirm} />
  </Horizontal>
}

// Include realistic titles
title={
  <Horizontal alignItems="center">
    <ExclamationCircleOutlined style={{ color: "var(--theme-error)" }} />
    <Texto category="h6">Confirm Revaluation</Texto>
  </Horizontal>
}
```

#### Popover Examples

```typescript
// Show complete component patterns
export const ComponentName: React.FC<IProps> = ({
  visible,
  onVisibleChange,
  // ... other props
}) => {
  // Real state management
  const [form] = useForm();
  const { useMutation } = useApiHook();

  // Actual event handlers
  const handleSubmit = async () => {
    // Real implementation
  };

  return (
    <Popover
      trigger="click"
      visible={visible}
      onVisibleChange={onVisibleChange}
      content={/* Real content */}
    >
      {/* Real trigger */}
    </Popover>
  );
};
```

## Props Documentation Standards

### Descriptive Values

```typescript
props: {
  agPropOverrides: 'selection and delete mode handling',
  controlBarProps: 'complex action buttons with state management',
  storageKey: '"allocation-associations-grid"',
  loading: 'isLoading',
  // Use quotes around string literals
}
```

### Patterns:

- Describe the purpose, not just the value
- Use quotes around string literals in the documentation
- Explain complex objects with their primary function

## Category Standards

### Established Categories (from production examples):

- **`basic-usage`** - Simple, getting started examples
- **`data-display`** - Showing data, lists, tables, analytics
- **`interactive`** - Click handlers, form submission, user actions
- **`advanced-config`** - Complex configuration, customization
- **`integration`** - Working with other components
- **`form-input`** - Form handling, validation, input management
- **`data-management`** - CRUD operations, bulk actions, associations

## Tag Conventions

### Tagging Patterns

```typescript
// Simple examples
tags: ["basic", "read-only", "quotes", "minimal"];

// Medium examples
tags: ["crud", "drag-drop", "reorder", "create", "update", "delete"];

// Complex examples
tags: [
  "trading",
  "range-selection",
  "csv-export",
  "market-status",
  "permissions",
];
```

### Tag Categories:

- **Functionality**: `crud`, `drag-drop`, `selection`, `filtering`
- **Complexity**: `basic`, `minimal`, `advanced`, `complex`
- **Business Domain**: `trading`, `analytics`, `contracts`, `pricing`
- **Technical Features**: `validation`, `api`, `state-management`, `async`

## Dependencies

### Standard Dependencies

```typescript
// Required for most examples
dependencies: ["react", "antd", "@gravitate-js/excalibrr"];

// Common additions
dependencies: [
  "react",
  "antd",
  "@gravitate-js/excalibrr",
  "@ant-design/icons", // For icon usage
  "@tanstack/react-query", // For API integration
  "@hooks/useGridViewManager", // For grid management
];
```

## Notes Writing Guidelines

### Structure

```typescript
notes: "Perfect for {use case}. {Key feature explanation}. {When to use or performance notes}.";
```

### Examples:

```typescript
notes: "Perfect for confirmation dialogs. Uses Excalibrr components for consistent styling.";

notes: "Excellent for analytics dashboards. Shows how to handle row selection and grouping with performance optimization.";

notes: "Advanced pattern for reusable modals. Configuration object determines modal behavior.";
```

### Patterns:

- Start with primary use case
- Explain what makes it effective
- Include implementation tips or when to use

## Source File Attribution

### Full Path Format

```typescript
sourceFile: "/src/modules/ContractManagement/components/DetailsSection/AllDetailsGrid/AllDetailsGrid.tsx";
```

### Patterns:

- Always use full path from project root
- Include module structure
- Maintain exact casing and structure

## Code Complexity Guidelines

### Simple Examples

- Focus on basic prop usage
- Minimal configuration
- Clear, straightforward patterns

### Medium Examples

- Show realistic business logic
- Include event handlers
- Demonstrate moderate configuration

### Complex Examples

- Full production patterns
- Advanced configuration
- Complete business scenarios
- Multiple integrated features

This document should be consulted when creating any new component examples to ensure consistency with established patterns.
