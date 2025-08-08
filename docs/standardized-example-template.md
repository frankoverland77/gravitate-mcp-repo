# Standardized Component Example Template

This template is based on the high-quality production examples in `/src/examples/components/` and should be used for creating all new component example files.

## File Structure Template

```typescript
/**
 * {ComponentName} Component Examples Database
 *
 * This file contains production-tested examples of the {ComponentName} component
 * extracted from the Gravitate frontend codebase. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality {ComponentName} implementations.
 */

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

export const {ComponentName}Examples: {ComponentName}Example[] = [
  // Examples go here...
]

export default {ComponentName}Examples
```

## Example Entry Template

```typescript
{
  id: '{component_name}_{complexity}_{number}',
  name: '{Descriptive Name}',
  description: '{What this example demonstrates}',
  complexity: 'simple' | 'medium' | 'complex',
  category: '{category}',
  tags: ['{tag1}', '{tag2}', '{tag3}'],
  code: `{PRODUCTION_CODE_HERE}`,
  props: {
    // Key-value pairs of props with descriptions
  },
  dependencies: ['react', 'antd', '@gravitate-js/excalibrr'],
  sourceFile: '{FULL_PATH_TO_SOURCE_FILE}',
  notes: '{When to use this pattern and why it\'s effective}'
}
```

## Naming Conventions

### ID Format

- Pattern: `{component_name}_{complexity}_{sequential_number}`
- Examples:
  - `gravi_grid_simple_01`
  - `modal_medium_02`
  - `popover_complex_03`

### Component Name Format

- Use descriptive, business-focused names
- Examples:
  - "Basic Confirmation Modal"
  - "Trading Grid with Range Selection"
  - "Command Center Tree Data Grid"

## Complexity Guidelines

### Simple

- **Criteria**: 1-3 main props, minimal configuration, basic usage
- **Examples**: Basic data display, simple confirmations, minimal forms
- **Props**: Usually includes basic props like `visible`, `title`, `onCancel`

### Medium

- **Criteria**: 4-7 props, moderate configuration, some business logic
- **Examples**: Forms with validation, grids with selection, interactive components
- **Props**: Includes event handlers, moderate `agPropOverrides`, `controlBarProps`

### Complex

- **Criteria**: 8+ props, extensive configuration, advanced business logic
- **Examples**: Multi-step wizards, advanced grids, complex integrations
- **Props**: Extensive `agPropOverrides`, custom renderers, complex state management

## Category Standards

Based on production examples, use these categories:

- **`basic-usage`** - Simple, getting started examples
- **`data-display`** - Showing data, lists, tables, analytics
- **`interactive`** - Click handlers, form submission, user actions
- **`advanced-config`** - Complex configuration, customization
- **`integration`** - Working with other components
- **`form-input`** - Form handling, validation, input management
- **`data-management`** - CRUD operations, bulk actions, associations

## Code Quality Standards

### Production Code Requirements

1. **Real Business Logic**: Use actual `agPropOverrides`, `controlBarProps`, etc.
2. **Complete Context**: Show full component usage with surrounding patterns
3. **TypeScript Compliance**: All code should be error-free
4. **Realistic Data**: Use actual field names and structures from production

### Code Formatting

- Use double quotes for strings: `title: "All Contract Details"`
- Format long lines appropriately:
  ```typescript
  getRowId: (row) =>
    row?.data?.TradeEntryDetailId || row?.data?.LocalTradeEntryDetailId,
  ```
- Include proper spacing and indentation

## Props Documentation

Document props using descriptive strings that explain the purpose:

```typescript
props: {
  agPropOverrides: 'selection and delete mode handling',
  controlBarProps: 'complex action buttons with state management',
  storageKey: '"allocation-associations-grid"',
  // Use quotes around string literals
}
```

## Dependencies

### Required Dependencies

- `react` - Always include
- `antd` - For Ant Design components
- `@gravitate-js/excalibrr` - For Excalibrr components

### Optional Dependencies

- `@ant-design/icons` - For icon usage
- `@tanstack/react-query` - For API integration examples
- `@hooks/useGridViewManager` - For grid management hooks

## Notes Guidelines

Write helpful notes that explain:

- **When to use**: Specific scenarios where this pattern is ideal
- **Why it works**: What makes this pattern effective
- **Key features**: Important aspects to highlight
- **Performance considerations**: Any optimization notes

### Example Notes

```typescript
notes: "Perfect for complex trading interfaces. Range selection and market status indicators provide professional trading experience.";
```

## Source File Attribution

Always include the full path to maintain traceability:

```typescript
sourceFile: "/src/modules/ContractManagement/components/DetailsSection/AllDetailsGrid/AllDetailsGrid.tsx";
```

## Validation Checklist

Before finalizing any example file:

- [ ] Header comment includes component name and purpose
- [ ] Interface follows exact naming convention
- [ ] All examples have unique IDs following pattern
- [ ] Code includes real production patterns
- [ ] Props are documented with meaningful descriptions
- [ ] Categories align with established standards
- [ ] Dependencies list is complete and accurate
- [ ] Source file paths are included and accurate
- [ ] Notes explain when/why to use each pattern
- [ ] TypeScript compliance verified
- [ ] Complexity levels are appropriate

## File Organization

### Directory Structure

```
src/examples/components/
├── ComponentName/
│   └── index.ts          # Main examples file
└── ...
```

### Import/Export Pattern

```typescript
export interface {ComponentName}Example { ... }
export const {ComponentName}Examples: {ComponentName}Example[] = [ ... ]
export default {ComponentName}Examples
```

This standardized template ensures all component examples maintain the high quality and consistency demonstrated in your production-based examples.
