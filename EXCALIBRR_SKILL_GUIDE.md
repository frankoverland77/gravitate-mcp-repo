# Excalibrr MCP Server - Skill & Command Guide

This guide explains how to use the Excalibrr MCP Server with both **Claude Desktop** and **Claude Code CLI**.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Claude Desktop Setup](#claude-desktop-setup)
4. [Claude Code CLI Setup](#claude-code-cli-setup)
5. [Available Tools](#available-tools)
6. [Usage Examples](#usage-examples)
7. [Design Patterns Reference](#design-patterns-reference)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Excalibrr MCP Server provides 14 tools for generating, modifying, and managing Excalibrr component demos:

| Category | Tools |
|----------|-------|
| **Demo Creation** | `create_demo`, `create_form_demo` |
| **Demo Modification** | `modify_grid`, `change_theme` |
| **Project Management** | `run_dev_server`, `cleanup_demo`, `cleanup_styles` |
| **Component Discovery** | `list_components`, `search_components`, `get_component`, `install_component` |
| **Figma Integration** | `import_from_figma`, `list_figma_components` |
| **Support** | `help` |

---

## Installation

### Prerequisites

```bash
# Ensure you have Node.js 18+ installed
node --version

# Navigate to the MCP server directory
cd /Users/frankoverland/Documents/repos/excalibrr-mcp-server

# Run setup script (installs dependencies and builds)
./setup.sh

# Or manually:
cd mcp-server
npm install
npm run build
```

### Verify Build

```bash
# Check the build output exists
ls mcp-server/build/index.js
```

---

## Claude Desktop Setup

### Step 1: Locate Config File

Open Claude Desktop configuration:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Step 2: Add MCP Server Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "excalibrr-mcp": {
      "command": "node",
      "args": [
        "/Users/frankoverland/Documents/repos/excalibrr-mcp-server/mcp-server/build/index.js"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "YOUR_FIGMA_TOKEN_HERE"
      }
    }
  }
}
```

> **Note**: Replace `YOUR_FIGMA_TOKEN_HERE` with your actual Figma access token if using Figma integration.

### Step 3: Restart Claude Desktop

Completely quit and restart Claude Desktop for the MCP server to load.

### Step 4: Verify Connection

In Claude Desktop, you should see the MCP tools available. Try:
- "List all Excalibrr components"
- "Create a product inventory grid"

---

## Claude Code CLI Setup

### Slash Commands (Already Installed)

The following slash commands are available in this repository:

| Command | Description |
|---------|-------------|
| `/excalibrr [request]` | Full Excalibrr development assistant |
| `/excalibrr-create [description]` | Create a new demo component |
| `/excalibrr-patterns [type]` | Look up design patterns from Gravitate repo |

### Using Slash Commands

```bash
# Start Claude Code in the repo
cd /Users/frankoverland/Documents/repos/excalibrr-mcp-server
claude

# Use commands
/excalibrr Create a customer management grid with name, email, and status columns

/excalibrr-create Product inventory form with SKU, name, price, and quantity fields

/excalibrr-patterns grid cell editors
```

### Global Installation (Optional)

To use these commands in any project, copy the commands folder:

```bash
# Create global commands directory
mkdir -p ~/.claude/commands

# Copy the Excalibrr commands
cp -r .claude/commands/* ~/.claude/commands/
```

---

## Available Tools

### Demo Creation Tools

#### `create_demo`
Creates grid, form, or dashboard demos from natural language.

```
Instruction: "Create a product inventory grid"
Result: ProductInventory/ folder with component and mock data
```

#### `create_form_demo`
Creates forms with validation and multiple field types.

**Parameters:**
- `name`: Form component name
- `type`: "simple" | "management" | "bulk-edit" | "inline-edit"
- `fields`: Array of field definitions
- `actions`: Array of button definitions
- `layout`: "vertical" | "horizontal" | "grid"

**Field Types:** text, email, number, select, date, dateRange, switch, checkbox

---

### Demo Modification Tools

#### `modify_grid`
Add/modify columns in existing grids.

**Actions:**
- `add_column`: Add new column
- `modify_column`: Update column properties
- `add_renderer`: Add custom cell renderer
- `make_editable`: Enable cell editing

#### `change_theme`
Switch theme for a demo: "OSP", "PE", "BP", "default"

---

### Project Management Tools

#### `run_dev_server`
Start/stop the Vite dev server.
- `action`: "start" | "stop" | "restart"
- `port`: Optional port number

#### `cleanup_demo`
Remove a demo and all references.

#### `cleanup_styles`
Convert inline styles to utility classes.

---

### Component Discovery Tools

#### `list_components`
Browse all Excalibrr components by category.

#### `search_components`
Search by name, description, or tags.

#### `get_component`
Get full details with examples for a specific component.

#### `install_component`
Get installation instructions and usage examples.

---

## Usage Examples

### Example 1: Create a Product Grid

```
Create a product catalog grid with columns for:
- Product ID (readonly)
- Name (editable)
- Category (dropdown: Electronics, Clothing, Food)
- Price (editable number)
- Stock (editable number)
- Status (Active/Inactive badge)
```

### Example 2: Create a Customer Form

```
Create a customer registration form with:
- First Name (required text)
- Last Name (required text)
- Email (required email)
- Phone (text)
- Account Type (select: Individual, Business, Enterprise)
- Receive Newsletter (switch)
- Terms Accepted (checkbox, required)

With Save and Cancel buttons
```

### Example 3: Modify Existing Grid

```
Add a "Last Updated" date column to the ProductGrid demo
Make the Price column editable with a number editor
Add a status badge renderer to the Status column
```

### Example 4: Look Up Patterns

```
/excalibrr-patterns master-detail grid

/excalibrr-patterns form with multiple sections

/excalibrr-patterns searchable select cell editor
```

---

## Design Patterns Reference

### Typography Rules (CRITICAL)

Always use `Texto` component with proper appearances:

| Use Case | Code |
|----------|------|
| Section Header | `<Texto category="h6" appearance="medium" weight="600">` |
| Field Label | `<Texto category="p2" appearance="medium">` |
| Field Value | `<Texto category="p1" weight="600">` |
| Helper Text | `<Texto category="p2" appearance="medium">` |
| Error Text | `<Texto category="p2" appearance="error">` |

**NEVER use `appearance="secondary"` for gray text** - it renders BLUE!

---

### CSS Naming Convention

**ALWAYS kebab-case, NEVER BEM:**

```css
/* ✅ Correct */
.template-list-item-header { }
.product-grid-container { }

/* ❌ Wrong */
.template-list-item__header { }
.product-grid--expanded { }
```

---

### Layout Patterns

**Vertical/Horizontal Containers:**
```tsx
<Vertical className="p-3" style={{ height: '100%' }}>
  <Horizontal justifyContent="space-between" alignItems="center">
    <Texto category="h4">Title</Texto>
    <GraviButton success>Action</GraviButton>
  </Horizontal>
  {/* Content */}
</Vertical>
```

**Card Section:**
```tsx
<Vertical className="bg-1 bordered pb-4" style={{ borderRadius: 8 }}>
  <Horizontal className="p-4 bg-2 border-bottom">
    <Texto category="h6">Section Title</Texto>
  </Horizontal>
  <Horizontal className="px-4 py-2">
    {/* Content */}
  </Horizontal>
</Vertical>
```

---

### Theme Configuration

Set theme in component:
```tsx
useEffect(() => {
  localStorage.setItem("TYPE_OF_THEME", "BP");
}, []);
```

Available themes: `OSP`, `PE`, `PE_LIGHT`, `BP`, `default`

---

### Routing Requirements

When adding navigation items, update BOTH files:

1. **`pageConfig.tsx`** - Add route configuration
2. **`AuthenticatedRoute.jsx`** - Add scope: `SectionName: true`

Keys must match exactly (case-sensitive)!

---

## Reference Repository

For real-world examples, browse the Gravitate.Dotnet.Next repo:

**Path:** `/Users/frankoverland/Documents/Gravitate Repo/Gravitate.Dotnet.Next/frontend/src/`

| Pattern Type | Location |
|--------------|----------|
| Grid Examples | `modules/ContractManagement/pages/ContractsReport/` |
| Form Examples | `modules/ContractManagement/pages/CreateContract/` |
| Column Defs | Search for `columnDefs.ts` |
| API Hooks | `modules/**/api/` |
| Shared Components | `components/shared/` |

---

## Troubleshooting

### MCP Server Not Connecting (Claude Desktop)

1. Verify the build exists: `ls mcp-server/build/index.js`
2. Check config path is absolute
3. Restart Claude Desktop completely (quit, not just close window)
4. Check Claude Desktop logs for errors

### Slash Commands Not Found (Claude Code)

1. Ensure you're in the correct directory
2. Check `.claude/commands/` folder exists
3. Verify markdown files have correct format

### Demo Not Appearing in Navigation

1. Check both `pageConfig.tsx` AND `AuthenticatedRoute.jsx` were updated
2. Verify scope key matches exactly (case-sensitive)
3. Restart the dev server

### Theme Not Applying

1. Check localStorage is being set in useEffect
2. Verify theme name is correct ("BP", "PE", "OSP", etc.)
3. Try hard refresh (Cmd+Shift+R)

---

## Quick Reference

### Start Development

```bash
# Terminal 1: Start demo dev server
cd demo && yarn dev

# Terminal 2: Build MCP server (if modified)
cd mcp-server && npm run build
```

### Common Commands

| Task | Command |
|------|---------|
| Create Grid | `/excalibrr Create a [entity] grid` |
| Create Form | `/excalibrr-create [entity] form with [fields]` |
| Find Pattern | `/excalibrr-patterns [pattern type]` |
| Change Theme | Use `change_theme` tool with demo name and theme |
| Cleanup | Use `cleanup_demo` tool with demo name |

---

*Generated for Excalibrr MCP Server v2.0.0*
