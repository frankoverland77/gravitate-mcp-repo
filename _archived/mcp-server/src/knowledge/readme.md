# 📚 Excalibrr Component Examples

This directory contains curated, working examples of Excalibrr components and design patterns. These examples are used by the MCP server to provide real-world usage patterns and code templates.

## 📁 Directory Structure

```
examples/
├── components/          # Individual component examples
│   ├── GraviGrid/      # Data grid examples
│   ├── Horizontal/     # Horizontal layout examples
│   ├── Vertical/       # Vertical layout examples
│   └── DashboardWidget/ # Widget examples
├── patterns/           # Complete design patterns
│   ├── master-detail/  # Master-detail layouts
│   ├── dashboard/      # Dashboard layouts
│   └── forms/          # Form patterns
├── index.ts           # Main exports and utilities
└── README.md          # This file
```

## 🎯 Example Categories

### Components

- **Basic**: Simple, single-component usage
- **Intermediate**: Component with props and styling
- **Advanced**: Complex component with interactions

### Patterns

- **Layout Patterns**: Complete page/section layouts
- **Interaction Patterns**: Components working together
- **Data Patterns**: CRUD operations and data management

## 🔧 Adding New Examples

### 1. Component Examples

Create a new file: `components/{ComponentName}/index.ts`

```typescript
import type { ComponentExample } from "../../index.js";

export const COMPONENT_NAME_EXAMPLES: ComponentExample[] = [
  {
    name: "Example Name",
    description: "What this example demonstrates",
    category: "data|layout|ui|forms",
    complexity: "basic|intermediate|advanced",
    tags: ["tag1", "tag2"], // Optional
    code: `// Your example code here`,
  },
];
```

### 2. Design Patterns

Create a new file: `patterns/{PatternName}/index.ts`

```typescript
import type { ComponentExample } from "../../index.js";

export const PATTERN_NAME_PATTERNS: ComponentExample[] = [
  {
    name: "Pattern Name",
    description: "Complete pattern description",
    category: "patterns",
    complexity: "intermediate|advanced",
    tags: ["pattern", "layout"],
    code: `// Complete working pattern`,
  },
];
```

### 3. Update Main Index

Add your exports to `examples/index.ts`:

```typescript
// Import your examples
import { NEW_COMPONENT_EXAMPLES } from "./components/NewComponent/index.js";
import { NEW_PATTERN_PATTERNS } from "./patterns/new-pattern/index.js";

// Update the getExamplesForComponent function to include your examples
const exampleMap: Record<string, ComponentExample[]> = {
  GraviGrid: GRAVI_GRID_EXAMPLES,
  Horizontal: HORIZONTAL_EXAMPLES,
  Vertical: VERTICAL_EXAMPLES,
  NewComponent: NEW_COMPONENT_EXAMPLES, // Add here
};

// Update getAllExamples to include your examples
export function getAllExamples(): ComponentExample[] {
  return [
    ...GRAVI_GRID_EXAMPLES,
    ...HORIZONTAL_EXAMPLES,
    ...VERTICAL_EXAMPLES,
    ...NEW_COMPONENT_EXAMPLES,
    ...getAllPatterns(),
  ];
}
```

**⚠️ Important**: Every example file must be imported and added to the utility functions, otherwise the MCP server won't be able to access them.

## 📋 Example Guidelines

### ✅ Good Examples

- **Complete & Working**: Full, runnable code
- **Realistic**: Based on real use cases
- **Well-Documented**: Clear descriptions and comments
- **Progressive**: Build from basic to advanced
- **Clean**: Follow consistent code style

### ❌ Avoid

- **Incomplete Code**: Missing imports or broken syntax
- **Business Logic**: Private/confidential implementations
- **Complex Dependencies**: External services or APIs
- **Overly Abstract**: Examples that are too generic

## 🏷️ Tags

Use consistent tags to help with discovery:

**Component Tags**: `grid`, `table`, `layout`, `form`, `button`, `input`, `navigation`

**Feature Tags**: `filtering`, `sorting`, `pagination`, `validation`, `responsive`, `interactive`

**Pattern Tags**: `master-detail`, `dashboard`, `crud`, `wizard`, `toolbar`

**Complexity Tags**: Automatically added based on complexity level

## 🔍 Testing Examples

Before adding examples:

1. **Syntax Check**: Ensure TypeScript compiles
2. **Import Validation**: Verify all imports are correct
3. **Logic Review**: Check that the example makes sense
4. **Style Consistency**: Follow existing code patterns

## 📈 Usage Analytics

The MCP server tracks which examples are most requested to help prioritize new additions:

- Most requested components
- Popular complexity levels
- Common tag combinations
- Pattern usage frequency

## 🚀 Integration with MCP Server

Examples are automatically available through MCP tools:

- `get_component_usage_examples` - Returns examples for specific components
- `suggest_design_patterns` - Returns relevant patterns
- `generate_component_code` - Uses examples as templates
- `search_examples` - Find examples by tags or description
