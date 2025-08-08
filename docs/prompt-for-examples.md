# Convert Examples to MCP Server Format

## Prompt Template

````
Convert these {COMPONENT_NAME} examples into a structured TypeScript file for the MCP server. Create a comprehensive examples database that the MCP server can use to generate high-quality code.

**Input:** The high-quality examples I found from our production codebase

**Output Format:** TypeScript file following this structure:

## File Structure Template:

```typescript
/**
 * {COMPONENT_NAME} Component Examples Database
 *
 * This file contains production-tested examples of the {COMPONENT_NAME} component
 * extracted from the Gravitate frontend codebase. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality {COMPONENT_NAME} implementations.
 */

export interface {COMPONENT_NAME}Example {
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

export const {COMPONENT_NAME}Examples: {COMPONENT_NAME}Example[] = [
  {
    id: '{component_name}_simple_01',
    name: 'Basic {Component Name}',
    description: 'Simple {component name} with minimal configuration',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['basic', 'minimal', 'starter'],
    code: `<{COMPONENT_NAME}
  prop1={value1}
  prop2={value2}
/>`,
    props: {
      prop1: 'value1',
      prop2: 'value2'
    },
    sourceFile: '/path/to/original/file.tsx',
    notes: 'Perfect for getting started with {component name}'
  },
  // ... more examples
];

export default {COMPONENT_NAME}Examples
````

## Requirements:

### 1. **Extract Key Information:**

- Clean up the code (remove extra context, focus on component usage)
- Identify all props used and their values
- Categorize by usage pattern (e.g., 'data-display', 'form-input', 'navigation')
- Add relevant tags for searchability

### 2. **Complexity Classification:**

- **Simple**: 1-3 props, basic values, no complex children
- **Medium**: 4-7 props, some complex values, moderate children/handlers
- **Complex**: 8+ props, complex values, extensive children, multiple handlers

### 3. **Code Cleaning:**

- Remove unnecessary surrounding code
- Keep essential context (like data structures if referenced)
- Ensure code is self-contained and runnable
- Fix any TypeScript issues
- Use placeholder data where needed

### 4. **Categorization:**

Create meaningful categories based on your production examples like:

- `basic-usage` - Simple, getting started examples
- `data-display` - Showing data, lists, tables, analytics
- `interactive` - Click handlers, form submission, user actions
- `advanced-config` - Complex configuration, customization
- `integration` - Working with other components
- `form-input` - Form handling, validation, input management
- `data-management` - CRUD operations, bulk actions, associations

### 5. **Dependencies:**

List any imports or external dependencies needed:

```typescript
dependencies: ["react", "@types/node", "lodash"];
```

### 6. **Helpful Metadata:**

- **Name**: Human-readable name
- **Description**: What this example demonstrates
- **Notes**: Usage tips, performance notes, when to use
- **Tags**: Searchable keywords

## Sample Conversion:

### Input Example:

```tsx
// From: /src/pages/energy/EnergyTrading.tsx
<GraviGrid
  columns={energyColumns}
  rows={energyData}
  getRowId={(row) => row.contractId}
  sidebar={false}
  onRowClick={handleRowClick}
  onSelectionChanged={handleSelection}
/>
```

### Output Example:

```typescript
{
  id: 'gravi_grid_complex_01',
  name: 'Energy Trading Grid',
  description: 'Complex data grid with advanced features for energy trading operations',
  complexity: 'complex',
  category: 'data-display',
  tags: ['trading', 'selection', 'grouping', 'energy', 'advanced-config'],
  code: `<GraviGrid
  agPropOverrides={{
    getRowId: (row) => row.data?.TradeEntryId,
    rowSelection: 'multiple',
    suppressCellSelection: true,
    rowGroupPanelShow: 'onlyWhenGrouping',
    groupDefaultExpanded: -1,
    onRowSelected: handleRowSelection,
  }}
  columnDefs={energyColumns}
  rowData={energyData}
  controlBarProps={{
    title: 'Energy Trading',
    actionButtons: <ActionButtons onExport={handleExport} />
  }}
  storageKey="energyTradingGrid"
  loading={isLoading}
/>`,
  props: {
    agPropOverrides: 'complex selection and grouping configuration',
    columnDefs: 'energyColumns',
    rowData: 'energyData',
    controlBarProps: 'title with action buttons',
    storageKey: '"energyTradingGrid"',
    loading: 'isLoading'
  },
  dependencies: ['react', '@gravitate-js/excalibrr'],
  sourceFile: '/src/modules/EnergyTrading/components/TradingGrid.tsx',
  notes: 'Perfect for complex trading interfaces. Shows real production patterns with proper selection handling and action buttons.'
}
```

## Component to process: **{COMPONENT_NAME}**

**Additional Instructions:**

- **Preserve production code quality** - Keep real business logic and patterns from actual codebase
- **Maintain source attribution** - Always include the actual source file path where found
- **Focus on realistic usage** - Use actual prop combinations and data structures from production
- **Include complete context** - Show agPropOverrides, controlBarProps, and other real configuration
- **Add meaningful notes** - Explain when to use each pattern and what makes it effective
- **Ensure TypeScript compliance** - All examples should be error-free and production-ready

````

## Usage:

Just replace `{COMPONENT_NAME}` with your component name:
- `GraviGrid` → `GraviGridExample`, `GraviGridExamples`
- `GraviButton` → `GraviButtonExample`, `GraviButtonExamples`
- `Horizontal` → `HorizontalExample`, `HorizontalExamples`

## Integration with MCP Server:

The generated files can be imported in your MCP server tools:

```typescript
// In your MCP server tool
import { GraviGridExamples } from '../src/examples/components/GraviGrid/index.js';

// Use for code generation
const getExampleByComplexity = (complexity: string) => {
  return GraviGridExamples.filter(ex => ex.complexity === complexity);
};
````
