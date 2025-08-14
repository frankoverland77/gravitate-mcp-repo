# Example Quality Checklist

Use this checklist to ensure all component examples meet the production-quality standards established by the examples in `/src/examples/components/`.

## ✅ File Structure Quality

### Header & Documentation

- [ ] **Header comment** follows the exact pattern with component name and purpose
- [ ] **Source attribution** mentions "Gravitate frontend codebase" or "production codebase"
- [ ] **Purpose statement** explains MCP server usage
- [ ] **Additional context** included when relevant (e.g., "Component: Ant Design Modal")

### Interface & Exports

- [ ] **Interface name** follows `{ComponentName}Example` pattern (not generic)
- [ ] **No semicolons** after interface property declarations
- [ ] **Export pattern** matches: `export const {ComponentName}Examples` and `export default`
- [ ] **Type safety** - all properties properly typed

## ✅ Example Entry Quality

### Identification & Naming

- [ ] **ID follows pattern**: `{component_name}_{complexity}_{number}` (e.g., `gravi_grid_simple_01`)
- [ ] **Name is business-focused**: Describes the actual use case, not just technical details
- [ ] **Description is specific**: Explains what this example demonstrates
- [ ] **Complexity is accurate**: Simple (1-3 props), Medium (4-7 props), Complex (8+ props)

### Categorization

- [ ] **Category is meaningful**: Uses established categories from production examples
- [ ] **Tags are descriptive**: Include functionality, business domain, and technical features
- [ ] **Tags are relevant**: All tags actually apply to the example

### Code Quality Standards

- [ ] **Production code**: Real business logic, not simplified placeholders
- [ ] **Complete context**: Shows full component usage with surrounding patterns
- [ ] **TypeScript compliant**: No obvious errors or warnings
- [ ] **Realistic data**: Uses actual field names and structures from production

## ✅ Component-Specific Standards

### GraviGrid Examples

- [ ] **agPropOverrides included**: Shows realistic grid configuration
- [ ] **getRowId function**: Proper row identification pattern
- [ ] **controlBarProps**: Includes title and action buttons when relevant
- [ ] **storageKey**: Included for grid persistence
- [ ] **Selection handling**: Proper rowSelection and event handlers
- [ ] **Column definitions**: Realistic field names and formatters

### Modal Examples

- [ ] **Footer patterns**: Real button combinations with Excalibrr components
- [ ] **Title structures**: JSX titles with icons and Texto components
- [ ] **Event handlers**: Realistic onCancel, onOk patterns
- [ ] **Form integration**: Shows actual form usage when applicable
- [ ] **Styling props**: bodyStyle, width, className when used

### Popover Examples

- [ ] **Trigger patterns**: Appropriate trigger types (click, hover)
- [ ] **Content complexity**: Real forms, menus, or data display
- [ ] **State management**: Proper visibility control
- [ ] **Event propagation**: stopPropagation when needed
- [ ] **Placement strategy**: Logical placement values

## ✅ Props Documentation

### Descriptive Values

- [ ] **Purpose over value**: Explains what props do, not just their value
- [ ] **String literals quoted**: Props with string values show quotes
- [ ] **Complex objects explained**: agPropOverrides, controlBarProps described meaningfully
- [ ] **Function references**: Event handlers described by purpose

### Examples

```typescript
// ✅ Good
props: {
  agPropOverrides: 'selection and delete mode handling',
  storageKey: '"allocation-associations-grid"',
  loading: 'isLoading'
}

// ❌ Bad
props: {
  agPropOverrides: 'object',
  storageKey: 'string',
  loading: 'boolean'
}
```

## ✅ Dependencies & Attribution

### Dependency Lists

- [ ] **Core dependencies**: Always includes 'react', 'antd', '@gravitate-js/excalibrr'
- [ ] **Icon usage**: Includes '@ant-design/icons' when icons are used
- [ ] **API integration**: Includes '@tanstack/react-query' when API calls shown
- [ ] **Hook usage**: Includes custom hooks when referenced
- [ ] **No unnecessary dependencies**: Only includes what's actually used

### Source Attribution

- [ ] **Full path provided**: Complete path from project root
- [ ] **Accurate location**: Path actually exists and is correct
- [ ] **Module structure preserved**: Shows proper module organization
- [ ] **Exact casing**: Matches actual file system casing

## ✅ Notes & Documentation

### Quality Notes

- [ ] **Use case clarity**: Explains when this pattern is ideal
- [ ] **Value proposition**: What makes this pattern effective
- [ ] **Implementation guidance**: Tips for using the pattern
- [ ] **Context awareness**: Notes about performance, UX, or business value

### Note Structure

```typescript
// ✅ Good pattern
notes: "Perfect for [use case]. [Key feature]. [Implementation tip or when to use].";

// Examples:
notes: "Perfect for confirmation dialogs. Uses Excalibrr components for consistent styling.";
notes: "Excellent for analytics dashboards. Shows how to handle row selection and grouping with performance optimization.";
```

## ✅ Code Formatting Standards

### String Conventions

- [ ] **Double quotes**: All strings use double quotes consistently
- [ ] **Line formatting**: Long functions properly formatted across lines
- [ ] **Indentation**: Consistent with production codebase
- [ ] **JSX formatting**: Proper spacing and structure

### Production Patterns

- [ ] **Real function names**: handleSubmit, handleSelection, not placeholder names
- [ ] **Business field names**: ProductName, TradeEntryId, not generic fields
- [ ] **Actual configurations**: Real rowHeight, headerHeight values
- [ ] **Proper event handling**: Realistic async/await patterns

## ✅ Complexity Validation

### Simple Examples (1-3 main props)

- [ ] **Minimal configuration**: Basic usage without extensive setup
- [ ] **Clear purpose**: Single, focused functionality
- [ ] **Beginner-friendly**: Good starting point for developers

### Medium Examples (4-7 props)

- [ ] **Moderate complexity**: Shows realistic business usage
- [ ] **Event handling**: Includes interaction patterns
- [ ] **Configuration examples**: Moderate agPropOverrides or similar

### Complex Examples (8+ props)

- [ ] **Production-level**: Full business scenarios
- [ ] **Advanced features**: Multiple integrated capabilities
- [ ] **Complete patterns**: End-to-end implementation examples

## ✅ Final Validation

### Before Committing

- [ ] **TypeScript check**: No compilation errors
- [ ] **Pattern consistency**: Matches other examples in style
- [ ] **Business relevance**: Examples solve real problems
- [ ] **Documentation completeness**: All required fields populated
- [ ] **Source verification**: Original source file confirmed to exist

### Quality Metrics

- [ ] **Realistic usage**: Could be copy-pasted into production with minimal changes
- [ ] **Educational value**: Teaches proper patterns and best practices
- [ ] **Comprehensive coverage**: Examples span simple to complex use cases
- [ ] **Maintainability**: Source attribution allows for future updates

## 🚨 Red Flags (Immediate Revision Needed)

- **Generic names**: "Basic Grid", "Simple Modal" without business context
- **Placeholder data**: foo, bar, test, example in property names
- **Incomplete patterns**: Missing agPropOverrides in GraviGrid examples
- **Missing dependencies**: Required imports not listed
- **No source file**: Unable to trace back to original implementation
- **TypeScript errors**: Code that wouldn't compile
- **Anti-patterns**: Code that violates established conventions

Use this checklist for every example file to maintain the high quality standards established by your production-based examples.
