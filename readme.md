# Excalibrr MCP Server

**Component Registry & Demo Generator for Excalibrr**

An MCP (Model Context Protocol) server that provides AI assistants with direct access to the Excalibrr component library. Browse components, generate demos, and build production-quality UIs using natural language.

**Key Features:**
- 📦 **Component Registry** - Browse and search 9+ Excalibrr components
- 🎨 **Demo Generation** - Create working demos instantly
- 🔍 **Smart Search** - Find components by name, category, or tags
- 💡 **Usage Examples** - Every component includes multiple examples
- 🎯 **Like shadcn/ui** - Similar workflow, built for Excalibrr

## 🚀 Quick Start

```bash
# One-time setup
./setup.sh

# Start using the MCP server
claude --chat

# Try these commands in Claude Code:
"List all available components"
"Search for grid components"
"Show me how to use GraviGrid"
"Create a product inventory demo"
```

## 💬 Natural Language Usage

The MCP server understands natural language. Try:

- **Browse Components:** "What components are available?" or "List all form components"
- **Search:** "Find button components" or "Search for data grids"
- **Get Details:** "Show me GraviGrid documentation" or "How do I use the Modal component?"
- **Install/Use:** "Add a button to my project" or "Show me button examples"
- **Generate Demos:** "Create a product grid" or "Make a customer form"

## 📂 Structure

```
excalibrr-workspace/
├── mcp-server/            # MCP server with tools
│   ├── src/
│   │   ├── tools/         # Demo generation tools
│   │   ├── knowledge/     # Production patterns
│   │   └── templates/     # Code templates
│   └── package.json
│
├── demo/                  # Demo project (user works here)
│   ├── src/
│   │   ├── components/shared/  # Theme system from production
│   │   └── pages/demos/        # Generated demos
│   ├── vite.config.js     # Production Vite config
│   └── package.json       # Production dependencies
│
└── docs/                  # Rules and conventions
    ├── rules/             # .mdc rule files
    └── development/       # Coding conventions
```

## 🎯 How It Works (Like shadcn/ui)

The Excalibrr MCP Server works just like shadcn/ui's MCP server:

1. **Registry Connection** - MCP connects to the Excalibrr component registry
2. **Natural Language** - You describe what you need in plain English
3. **AI Processing** - Claude translates your request into registry commands
4. **Component Delivery** - Components, examples, and docs are provided instantly

**Two Modes of Operation:**

### 1. Component Registry (New! 🎉)
Browse and install individual components:
- `list_components` - Browse all Excalibrr components
- `search_components` - Find specific components
- `get_component` - Get full documentation and examples
- `install_component` - Add components to your project

### 2. Demo Generation (Original)
Generate complete demo applications:
- `create_demo` - Create grid/form/dashboard demos
- `modify_grid` - Modify existing demos
- `change_theme` - Switch themes (OSP, PE, BP)
- `run_dev_server` - Start development server

## 🛠 Commands

```bash
# Workspace commands
yarn setup              # One-time setup
yarn dev                # Start demo project  
yarn build:mcp          # Build MCP server

# Demo project commands (in demo/)
yarn dev                # Start dev server
yarn dev:clean          # Kill existing + start fresh
yarn dev:check          # Check server status
yarn stop               # Stop dev server
```

## 📦 Available Components

The registry includes 9 core Excalibrr components:

### Data Components
- **GraviGrid** - Powerful AG Grid-based data grid with editing, grouping, and filtering

### Form Components
- **GraviButton** - Themed button with variants and loading states
- **Form** - Form container with validation support
- **Select** - Dropdown with search and multi-select

### Layout Components
- **Horizontal** - Flexbox horizontal layout
- **Vertical** - Flexbox vertical layout
- **Texto** - Themed text with typography options

### Overlay Components
- **Modal** - Dialog/modal overlays
- **Popover** - Floating content popovers

Each component includes:
- ✅ Full prop documentation
- ✅ Multiple usage examples
- ✅ TypeScript types
- ✅ Dependency information
- ✅ Theme support

## 📋 Rules Integration

The MCP server automatically applies rules from `docs/rules/`:
- ✅ Use Excalibrr components (no HTML elements)
- ✅ Apply theme variables (no hardcoded colors)
- ✅ Follow production patterns
- ✅ Generate realistic mock data

## ⚙️ Configuration

Projects can use `components.json` (like shadcn/ui) to configure the registry:

```json
{
  "registries": {
    "excalibrr": {
      "name": "Excalibrr Component Registry",
      "url": "mcp://excalibrr",
      "description": "Official Excalibrr component library"
    }
  },
  "aliases": {
    "components": "@components",
    "utils": "@lib/utils"
  }
}
```

The demo project includes this configuration by default.

## 🎨 Themes

Supports all production themes:
- **OSP** - Blue theme
- **PE** - Teal/Green theme  
- **BP** - Green theme
- Plus 10+ others from production

## 🔧 Development

```bash
# MCP server development
cd mcp-server
yarn dev                # Watch mode

# Add new tools in mcp-server/src/tools/
# Add new templates in mcp-server/src/templates/
# Add new knowledge in mcp-server/src/knowledge/
```