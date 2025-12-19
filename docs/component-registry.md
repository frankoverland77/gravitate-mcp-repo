# Excalibrr Component Registry Guide

## Overview

The Excalibrr MCP Server now includes a **Component Registry** that works like shadcn/ui's MCP server. You can browse, search, and access Excalibrr components using natural language in Claude Code.

## How It Works

1. **Registry System** - All Excalibrr components are cataloged with metadata, props, examples, and dependencies
2. **MCP Tools** - Four new tools provide access to the registry
3. **Natural Language** - Claude understands requests like "show me button components"
4. **Instant Access** - Get documentation and examples without leaving your conversation

## Available Tools

### 1. list_components

Browse all available components, optionally filtered by category, complexity, or tags.

**Examples:**
```
"List all components"
"Show me all form components"
"What components are available?"
"List simple components"
```

**Parameters:**
- `category` - Filter by category (data, forms, layout, overlay)
- `complexity` - Filter by complexity (simple, medium, complex)
- `tags` - Filter by tags (array)
- `limit` - Limit number of results

### 2. search_components

Search for components by name, description, or tags.

**Examples:**
```
"Search for grid components"
"Find button components"
"Search for editable components"
```

**Parameters:**
- `query` (required) - Search query string
- `category` - Filter results by category
- `complexity` - Filter by complexity level
- `tags` - Filter by specific tags
- `limit` - Limit results (default: 10)

### 3. get_component

Get full documentation, props, and examples for a specific component.

**Examples:**
```
"Show me GraviGrid documentation"
"How do I use the Modal component?"
"Get details for gravi-button"
```

**Parameters:**
- `componentId` (required) - Component ID (e.g., 'gravi-grid', 'modal')

**Returns:**
- Full component description
- Props table with types and descriptions
- Multiple usage examples with code
- Dependencies list
- Important notes

### 4. install_component

Get usage instructions and check dependencies for a component.

**Examples:**
```
"Install GraviGrid in my project"
"How do I add the Modal component?"
"Show me how to use Select"
```

**Parameters:**
- `componentId` (required) - Component to install
- `projectPath` - Target project (defaults to demo workspace)
- `installDependencies` - Check dependencies (default: true)
- `customName` - Custom component name (optional)

**Returns:**
- Import instructions
- First usage example
- Dependency check
- Key props overview

## Component Categories

### Data
- **GraviGrid** - AG Grid-based data grid with powerful features

### Forms
- **GraviButton** - Themed button with variants
- **Form** - Form container with validation
- **Select** - Dropdown with search

### Layout
- **Horizontal** - Flexbox horizontal layout
- **Vertical** - Flexbox vertical layout
- **Texto** - Themed typography

### Overlay
- **Modal** - Dialog overlays
- **Popover** - Floating popovers

## Usage Workflow

### Discovering Components

1. **Browse All Components**
   ```
   "List all components"
   ```

2. **Filter by Category**
   ```
   "Show me all form components"
   ```

3. **Search for Specific Features**
   ```
   "Search for grid components"
   "Find editable components"
   ```

### Learning Component APIs

1. **Get Full Documentation**
   ```
   "Show me GraviGrid documentation"
   ```

2. **See Examples**
   ```
   "How do I use the Modal component?"
   ```

3. **Check Props**
   ```
   "What props does GraviButton accept?"
   ```

### Using Components

1. **Get Usage Instructions**
   ```
   "How do I add a button to my project?"
   ```

2. **Install/Import**
   ```
   "Install GraviGrid"
   ```

3. **Copy Examples**
   - Full code examples are provided
   - Copy and adapt to your needs

## Component Metadata Structure

Each component in the registry includes:

```typescript
{
  id: "gravi-button",
  name: "GraviButton",
  description: "Themed button component...",
  category: "forms",
  complexity: "simple",
  tags: ["button", "action", "form"],
  source: "@gravitate-js/excalibrr",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "onClick",
      type: "(event: MouseEvent) => void",
      required: false,
      description: "Click handler function"
    },
    // ... more props
  ],
  examples: [
    {
      name: "Basic Button",
      description: "Simple button with text",
      code: "...",
      tags: ["basic"]
    },
    // ... more examples
  ]
}
```

## Comparison with shadcn/ui

| Feature | shadcn/ui | Excalibrr MCP |
|---------|-----------|---------------|
| Browse Components | ✅ | ✅ |
| Search Components | ✅ | ✅ |
| Component Details | ✅ | ✅ |
| Code Examples | ✅ | ✅ |
| Props Documentation | ✅ | ✅ |
| Natural Language | ✅ | ✅ |
| Demo Generation | ❌ | ✅ (bonus feature) |

## Benefits

1. **Faster Development** - Find and use components without leaving Claude Code
2. **Self-Documenting** - All components include full documentation and examples
3. **Discoverability** - Search and filter to find exactly what you need
4. **Type Safety** - Full TypeScript prop definitions
5. **Consistent Patterns** - Examples follow Excalibrr best practices

## Adding New Components

To add a new component to the registry:

1. Create metadata file in `mcp-server/src/registry/components/`
2. Follow the `ComponentMetadata` interface
3. Include props, examples, and dependencies
4. Export from `mcp-server/src/registry/components/index.ts`
5. Rebuild the server: `yarn build:mcp`

Example:
```typescript
// mcp-server/src/registry/components/NewComponent.ts
import { ComponentMetadata } from "../types.js";

export const newComponent: ComponentMetadata = {
  id: "new-component",
  name: "NewComponent",
  description: "...",
  category: "forms",
  complexity: "simple",
  tags: ["tag1", "tag2"],
  source: "@gravitate-js/excalibrr",
  dependencies: ["@gravitate-js/excalibrr"],
  props: [...],
  examples: [...]
};
```

## Tips

- Use natural language - Claude understands "show me buttons" just as well as formal tool calls
- Start broad ("list components") then narrow down ("show me GraviGrid details")
- Examples in the registry use real production patterns
- All components work with Gravitate themes (OSP, PE, BP, etc.)
- The registry complements the existing demo generation tools