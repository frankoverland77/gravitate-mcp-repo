# Component Examples Quality Checklist

Use this checklist to ensure all component examples meet the quality standards for the Excalibrr MCP Server knowledge base. Examples must work seamlessly with MCP tools for demo generation.

## ✅ File Structure Quality

### Header & Documentation
- [ ] **Header comment** follows exact pattern with component name and MCP server purpose
- [ ] **Purpose statement** mentions "production-inspired examples"
- [ ] **Usage context** explains MCP server tool integration
- [ ] **Import structure** is clean and follows conventions

### Interface & Exports
- [ ] **Uses generic interface** `ComponentExample` (not component-specific)
- [ ] **Required fields present** name, description, complexity, tags, code
- [ ] **Export pattern correct** `export const {ComponentName}Examples: ComponentExample[]`
- [ ] **Default export included** `export default {ComponentName}Examples`

## ✅ Example Entry Quality

### Identification & Naming
- [ ] **Name is business-focused** Describes actual use case, not just technical details
- [ ] **Description is specific** Explains what this example demonstrates
- [ ] **Complexity is accurate** Simple (1-3 props), Medium (4-7 props), Complex (8+ props)
- [ ] **ID is optional** Only include if actually needed for organization

### Categorization
- [ ] **Category is meaningful** Uses established categories (interactive, data, forms, basic-usage, advanced-config)
- [ ] **Tags are descriptive** Include functionality, business domain, and technical features
- [ ] **Tags are relevant** All tags actually apply to the example code
- [ ] **3-6 tags total** Not too few, not overwhelming

### Code Quality Standards
- [ ] **Realistic business scenario** Real use cases, not simplified placeholders
- [ ] **Complete component context** Shows full usage with proper imports
- [ ] **Uses Excalibrr components** Vertical, Horizontal, Texto for layout and typography
- [ ] **Error handling included** Try/catch blocks, loading states, notifications
- [ ] **TypeScript compliant** No obvious errors or warnings

## ✅ MCP Tool Integration

### Demo Generation Compatibility
- [ ] **Imports resolve correctly** All dependencies available in demo workspace
- [ ] **Theme compatibility** Works with OSP, PE, BP theme switching
- [ ] **Layout components used** Vertical, Horizontal instead of generic divs
- [ ] **Code insertion ready** Can be dropped into demo templates

### Tool-Specific Requirements
- [ ] **createDemo compatible** Grid/dashboard examples work with tool
- [ ] **createFormDemo ready** Form examples provide proper structure
- [ ] **modifyGrid friendly** Grid examples support modification
- [ ] **Theme variables used** CSS custom properties instead of hardcoded colors

## ✅ Component-Specific Standards

### Modal Examples
- [ ] **Realistic titles** JSX structure with icons and Texto components
- [ ] **Footer patterns** GraviButton combinations with proper theming
- [ ] **Business context** Actual use cases (confirmations, settings, data entry)
- [ ] **State management** Proper visibility control and loading states
- [ ] **Event handlers** Realistic onCancel, onOk, onConfirm patterns

### Form Examples
- [ ] **Validation patterns** Real rules with meaningful error messages
- [ ] **Loading states** Async submission handling with notifications
- [ ] **Layout structure** Proper Vertical/Horizontal component usage
- [ ] **Form integration** Ant Design Form with proper field management
- [ ] **Error handling** onFinish and onFinishFailed implementations

### Grid Examples
- [ ] **agPropOverrides included** Realistic grid configuration
- [ ] **getRowId function** Proper row identification patterns
- [ ] **controlBarProps** Title and action buttons when appropriate
- [ ] **storageKey included** For grid state persistence
- [ ] **Selection patterns** Proper rowSelection and event handlers

## ✅ Props Documentation

### Descriptive Values
- [ ] **Purpose over type** Explains what props do, not just their data type
- [ ] **Realistic descriptions** Based on actual usage in the code
- [ ] **String literals quoted** Props with string values show quote marks
- [ ] **Complex objects explained** agPropOverrides, controlBarProps described meaningfully

### Examples of Good Documentation
```typescript
✅ Good:
props: {
  visible: "controls modal visibility state",
  onSubmit: "form submission handler with validation",
  agPropOverrides: "grid configuration with row selection",
  storageKey: "\"user-management-grid\" for persistence"
}

❌ Avoid:
props: {
  visible: "boolean",
  onSubmit: "function", 
  agPropOverrides: "object",
  storageKey: "string"
}
```

## ✅ Dependencies & Requirements

### Dependency Lists
- [ ] **Core dependencies present** Always includes 'react', 'antd', '@gravitate-js/excalibrr'
- [ ] **Icon dependencies** Includes '@ant-design/icons' when icons are used
- [ ] **API dependencies** Includes '@tanstack/react-query' when API calls shown
- [ ] **No missing dependencies** Everything imported is listed
- [ ] **No unnecessary dependencies** Only includes what's actually used

### Code Dependencies
- [ ] **Import statements match** All imports have corresponding dependencies
- [ ] **Excalibrr imports correct** Vertical, Horizontal, Texto imported properly
- [ ] **Ant Design imports** Specific component imports, not full library
- [ ] **Icon imports** Specific icons from @ant-design/icons

## ✅ Code Implementation Quality

### React Patterns
- [ ] **Modern React** Uses hooks, functional components
- [ ] **State management** useState, useEffect used appropriately
- [ ] **Event handlers** Proper async/await patterns
- [ ] **Component props** Proper destructuring and prop types

### Error Handling
- [ ] **Try/catch blocks** Proper error boundaries around async operations
- [ ] **Loading states** Boolean flags for async operations
- [ ] **User feedback** NotificationMessage for success/error states
- [ ] **Graceful failures** Proper error recovery and user communication

### Styling & Layout
- [ ] **Excalibrr theming** Uses CSS custom properties (var(--theme-*))
- [ ] **Consistent spacing** Uses gap, margins consistently
- [ ] **Responsive design** Layout works on different screen sizes
- [ ] **No hardcoded colors** All colors use theme variables

## ✅ Business Logic Quality

### Realistic Scenarios
- [ ] **Actual use cases** Real business problems, not generic examples
- [ ] **Field names realistic** firstName, lastName, email vs foo, bar, test
- [ ] **Validation rules** Meaningful validation that would be used in production
- [ ] **API patterns** Realistic async operations with proper data flow

### Data Patterns
- [ ] **Proper data structures** Objects and arrays that make business sense
- [ ] **Field relationships** Related data fields that work together logically
- [ ] **Realistic values** Example data that represents actual usage
- [ ] **Edge cases handled** Empty states, loading states, error states

## ✅ Notes & Documentation Quality

### Usage Notes
- [ ] **When to use** Specific scenarios where this pattern is ideal
- [ ] **Key features** What makes this pattern effective
- [ ] **Implementation tips** Guidance for using the pattern effectively
- [ ] **Business value** Why this pattern solves real problems

### Note Structure
```typescript
// ✅ Good pattern
notes: "Perfect for [specific use case]. [Key feature explanation]. [When to use or implementation tip]."

// Examples:
notes: "Perfect for user management interfaces. Shows proper validation and error handling. Use when you need comprehensive user creation workflows."

notes: "Excellent for confirmation dialogs. Uses Excalibrr theming system. Ideal for destructive actions requiring user confirmation."
```

## ✅ Integration Validation

### MCP Server Integration
- [ ] **Tool compatibility tested** Works with createDemo, createFormDemo tools
- [ ] **Theme switching tested** Supports OSP, PE, BP themes without breaking
- [ ] **Demo generation ready** Code can be inserted into templates successfully
- [ ] **Workspace compatibility** Imports resolve in demo workspace environment

### File Organization
- [ ] **Correct file location** `mcp-server/src/knowledge/components/{ComponentName}/index.ts`
- [ ] **Proper file structure** Single index.ts file per component
- [ ] **Import accessibility** Can be imported by MCP tools
- [ ] **Build compatibility** TypeScript compilation succeeds

## ✅ Final Quality Gates

### Before Committing
- [ ] **TypeScript compilation** No TS errors or warnings
- [ ] **Pattern consistency** Matches other examples in style and structure
- [ ] **Business relevance** Solves real problems that warrant demo generation
- [ ] **Documentation completeness** All required fields populated accurately
- [ ] **MCP tool testing** Verified to work with relevant MCP tools

### Quality Metrics
- [ ] **Production readiness** Code could be adapted for production with minimal changes
- [ ] **Educational value** Teaches proper patterns and best practices
- [ ] **Comprehensive coverage** Examples span simple to complex use cases
- [ ] **Maintainability** Clear structure allows for future updates and modifications

## 🚨 Red Flags (Immediate Revision Needed)

### Code Issues
- **Generic placeholder names** "Basic Modal", "Simple Form" without business context
- **Placeholder data** foo, bar, test, example in property names or values
- **Missing error handling** No try/catch blocks or loading states
- **Hardcoded values** Colors, sizes, or paths not using theme variables
- **Import mismatches** Importing components not listed in dependencies

### Integration Issues  
- **Wrong interface usage** Using component-specific interfaces instead of generic
- **Export pattern errors** Missing default export or wrong naming convention
- **MCP tool incompatibility** Code that won't work with demo generation tools
- **Theme incompatibility** Styles that break when themes are switched
- **Workspace issues** Dependencies that don't resolve in demo environment

### Business Logic Issues
- **Unrealistic scenarios** Examples that don't represent actual use cases
- **Incomplete patterns** Missing essential business logic for the scenario
- **Anti-patterns** Code that violates established conventions or best practices
- **Complexity mismatch** Simple tag on complex code or vice versa

Use this checklist for every component example to maintain the high quality standards required for effective MCP server demo generation.