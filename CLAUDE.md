# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Yarn monorepo workspace containing two main projects:
1. **MCP Server** (`/mcp-server/`) - Model Context Protocol server providing AI access to Excalibrr component generation tools
2. **Demo Project** (`/demo/`) - React/Vite application for generating and previewing Excalibrr component demos

## Common Development Commands

### Workspace Commands (from root)
```bash
# Initial setup - runs yarn install and builds MCP server
./setup.sh

# Quick workspace setup
yarn setup

# Build MCP server only
yarn build:mcp

# Start demo development server
yarn dev

# Start MCP server
yarn mcp
```

### MCP Server Development (`/mcp-server/`)
```bash
cd mcp-server

# Build TypeScript to JavaScript
npm run build

# Development with watch mode
npm run dev

# Start production server (STDIO mode for Claude Desktop)
npm start

# Clean build artifacts
npm run clean
```

### Demo Project Development (`/demo/`)
```bash
cd demo

# Start Vite development server (port 3000 configured, but may use 5173)
yarn dev

# Alternative: Direct Vite execution if yarn dev issues
npx vite

# Build demo project
yarn build

# Preview production build
yarn preview
```

## Architecture Overview

### MCP Server Architecture
The MCP server (`/mcp-server/`) implements the Model Context Protocol to provide AI assistants with structured tools for generating Excalibrr component demos:

- **Transport**: STDIO transport for Claude Desktop integration
- **Core Tools**: 11 specialized tools for demo generation, modification, and management
- **Tool Categories**:
  - Demo Creation: `create_demo`, `create_form_demo`
  - Demo Modification: `modify_grid`, `change_theme`
  - Project Management: `run_dev_server`, `cleanup_demo`, `cleanup_styles`
  - External Integration: `import_from_figma`, `list_figma_components`
  - Support: `help`

### Demo Project Architecture
The demo project (`/demo/`) is a Vite-based React application configured for rapid Excalibrr component prototyping:

- **Build System**: Vite 5 with TypeScript, React, and Less preprocessing
- **Dependencies**: Full Excalibrr component library (`@gravitate-js/excalibrr@4.0.34-osp`)
- **Path Aliases**: Configured for `@components`, `@pages`, `@utils`, `@api`, `@styles`, `@assets`
- **Theme System**: Supports multiple Gravitate themes (OSP, PE, BP)
- **Grid System**: AG Grid Community/Enterprise integration for data tables

### Key Integration Points

**Excalibrr Component Library Integration**:
- Uses production Excalibrr version with OSP theme variant
- Real component implementations, not mocks or stubs
- Theme switching via `ThemeContext` and configuration files

**Development Workflow**:
- MCP server generates component demo files in `/demo/src/pages/demos/`
- Vite provides hot module replacement for rapid iteration
- Component demos are self-contained with data files (`.data.ts`)

**Generated Demo Structure**:
```
demo/src/pages/demos/
├── ProductGrid.tsx          # Grid component demos
├── ProductGrid.data.ts      # Mock data for grid
├── ProductForm/             # Form component demos
│   ├── ProductForm.tsx
│   └── ProductForm.data.ts
└── BakeryDemoTabs.tsx      # Tabbed demo containers
```

## MCP Server Tool Capabilities

The server provides comprehensive tools for Excalibrr demo generation:

**Demo Creation Tools**:
- `create_demo`: Creates grid, form, or dashboard demos with real Excalibrr components
- `create_form_demo`: Specialized form generation with field validation and actions

**Demo Modification Tools**:
- `modify_grid`: Add/modify columns, renderers, and cell editors in existing grids
- `change_theme`: Switch between Gravitate themes (OSP, PE, BP)

**Project Management Tools**:
- `run_dev_server`: Start/stop/restart development servers with port management
- `cleanup_demo`: Remove demos and clean up references in configuration files
- `cleanup_styles`: Automated conversion of inline styles to utility classes

**External Integration Tools**:
- `import_from_figma`: Convert Figma designs to React/Excalibrr components
- `list_figma_components`: Browse available Figma components for import

## Configuration Files

**Vite Configuration** (`demo/vite.config.js`):
- Optimized for Excalibrr library bundling
- Path aliases for organized imports
- Less preprocessing for Ant Design integration
- SVG-as-React-component support
- Port 3000 server configuration (may fallback to 5173)

**TypeScript Configuration**:
- Strict mode enabled in both projects
- Path mapping aligned with Vite aliases
- ES module support throughout

**Package Management**:
- Yarn workspaces for efficient dependency management
- Shared node_modules between MCP server and demo project
- Production-grade dependency versions matching Gravitate standards

## Development Patterns

**Component Demo Generation**:
- All demos use real Excalibrr components, never HTML elements
- Mock data generation follows realistic business patterns
- Theme variables used instead of hardcoded colors
- Grid configurations support inline editing with appropriate cell editors

**File Organization**:
- Demo components in `/demo/src/pages/demos/`
- Shared theme configuration in `/demo/src/components/shared/Theming/`
- Path aliases prevent relative import chains
- Data files co-located with component files

**Navigation and Routing** ⚠️ CRITICAL:
- When adding navigation sections to `demo/src/pageConfig.tsx`, you MUST also update `demo/src/_Main/AuthenticatedRoute.jsx`
- The `scopes` object in AuthenticatedRoute controls which menu items appear
- Section keys in pageConfig MUST match scope keys exactly (case-sensitive)
- Example: Adding `config.Bakery = {...}` in pageConfig requires `Bakery: true` in scopes
- Failing to update both files will cause navigation items to not appear in the menu

**Theme System**:
- Multiple theme support via configuration objects
- Theme switching without component re-architecture
- CSS custom properties for dynamic theming
- Less preprocessing for advanced styling features

**Typography System** ⚠️ CRITICAL:
- ALWAYS use Excalibrr `Texto` component with `category` and `appearance` props for typography
- Typography categories: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p1`, `p2`, `heading`, `heading-small`
- Weight options: `"400"`, `"500"`, `"600"`, `"700"`, `"bold"`
- Appearance options:
  - `"primary"` - Primary text (black/dark)
  - `"secondary"` - **BLUE** theme color (NOT for gray text!)
  - `"light"` - **Very light gray** (use sparingly, can be hard to read on white backgrounds)
  - `"medium"` - **Medium gray** for labels, helper text, and secondary content ✅ PREFERRED
  - `"error"`, `"success"`, `"warning"` - Status colors
- **NEVER use `appearance="secondary"` for gray/muted text** - this applies BLUE color
- **ALWAYS use `appearance="medium"` for gray labels and helper text** - better readability than "light"
- Section headers (uppercase labels): `<Texto category="h6" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>`
- Field labels (uppercase): `<Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>`
- Field values (bold): `<Texto category="p1" weight="600">`
- Helper text/subdued content: `<Texto category="p2" appearance="medium">`
- Medium gray body text: `<Texto category="p1" appearance="medium">`
- Avoid hardcoded hex colors - use appearance props instead

**CSS Naming Convention** ⚠️ CRITICAL:
- ALWAYS use **kebab-case** (single dashes) for CSS class names
- NEVER use BEM-style double underscores (`__`) or double dashes (`--`)
- Class names should be prefixed with the component name for global uniqueness
- Examples:
  - ✅ `template-list-item-header` (correct)
  - ✅ `template-list-item-has-placeholders` (correct)
  - ❌ `template-list-item__header` (wrong - no double underscores)
  - ❌ `template-list-item--has-placeholders` (wrong - no double dashes)
- Use directory-level `styles.css` files, imported once in the parent component
- Child components use classes from the parent's `styles.css` without additional imports