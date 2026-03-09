# Excalibrr MCP Server - Skill & Command Guide

This guide explains how to use the Excalibrr MCP Server with both **Claude Desktop** and **Claude Code CLI**.

---

## Table of Contents

1. [Overview](#overview)
2. [Mandatory Workflow](#mandatory-workflow)
3. [Installation](#installation)
4. [Available Tools](#available-tools)
5. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
6. [Component Patterns](#component-patterns)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Excalibrr MCP Server provides 16 tools for generating, modifying, and managing Excalibrr component demos:

| Category | Tools |
|----------|-------|
| **Workflow (NEW)** | `preflight`, `validate_code`, `register_demo` |
| **Demo Creation** | `create_demo`, `create_form_demo` |
| **Demo Modification** | `modify_grid`, `change_theme` |
| **Project Management** | `run_dev_server`, `cleanup_demo`, `cleanup_styles` |
| **Component Discovery** | `list_components`, `search_components`, `get_component`, `install_component` |
| **Figma Integration** | `import_from_figma`, `list_figma_components` |
| **Support** | `help` |

---

## Mandatory Workflow

**ALWAYS follow this workflow when generating Excalibrr code:**

### Step 1: Call `preflight`
```javascript
preflight({ task: "create a customer grid with edit modal" })
```
Returns conventions + component APIs needed for the task.

### Step 2: Generate Code
Write code following the conventions returned by preflight.

### Step 3: Call `validate_code`
```javascript
validate_code({ code: "<your generated code>" })
```
Catches common mistakes before presenting to user.

### Step 4: Fix Any Errors
Address all errors and warnings from validation.

### Step 5: Call `register_demo`
```javascript
register_demo({
  name: "CustomerList",
  title: "Customer List",
  description: "Customer grid with edit modal",
  category: "grids",
  componentPath: "./pages/demos/CustomerList"
})
```
Auto-configures navigation so demo appears in sidebar.

---

## Installation

### Prerequisites

```bash
# Ensure Node.js 18+ installed
node --version

# Navigate to MCP server directory
cd /Users/frankoverland/Documents/repos/excalibrr-mcp-server

# Run setup
./setup.sh

# Or manually:
cd mcp-server && npm install && npm run build
```

### Claude Desktop Setup

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "excalibrr-mcp": {
      "command": "node",
      "args": [
        "/Users/frankoverland/Documents/repos/excalibrr-mcp-server/mcp-server/build/index.js"
      ]
    }
  }
}
```

### Cursor Setup

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "excalibrr": {
      "command": "node",
      "args": ["/Users/frankoverland/Documents/repos/excalibrr-mcp-server/mcp-server/build/index.js"]
    }
  }
}
```

### Claude Code CLI

Slash commands available in repo at `.claude/commands/`:
- `/excalibrr` - Full development assistant
- `/excalibrr-create` - Quick demo creation
- `/excalibrr-patterns` - Look up design patterns

---

## Available Tools

### Workflow Tools (NEW)

#### `preflight`
**Purpose:** Get everything needed before code generation in one call.

```javascript
preflight({ task: "build a form modal with customer fields" })
// Returns: conventions + APIs for detected components
```

Auto-detects components needed based on task keywords.

#### `validate_code`
**Purpose:** Catch common mistakes before presenting code.

```javascript
validate_code({ code: "<Vertical style={{ flex: 1 }}>..." })
// Returns: errors, warnings, and suggestions
```

#### `register_demo`
**Purpose:** Auto-configure navigation for new demos.

```javascript
register_demo({
  name: "CustomerList",
  title: "Customer List",
  description: "Grid with edit modal",
  category: "grids",  // grids | forms | dashboards
  componentPath: "./pages/demos/CustomerList"
})
```

Updates both `pageConfig.tsx` and `AuthenticatedRoute.jsx` automatically.

---

### Demo Creation Tools

#### `create_demo`
Creates grid, form, or dashboard demos from natural language.

```javascript
create_demo({ instruction: "Create a product inventory grid" })
```

#### `create_form_demo`
Creates forms with validation and field types.

```javascript
create_form_demo({
  name: "CustomerForm",
  type: "simple",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
  ],
  actions: [
    { type: "cancel", label: "Cancel" },
    { type: "submit", label: "Save", theme: "success" }
  ]
})
```

---

### Demo Modification Tools

#### `modify_grid`
Add/modify columns in existing grids.

```javascript
modify_grid({
  demoName: "ProductGrid",
  action: "add_column",
  config: { field: "price", headerName: "Price", type: "number", editable: true }
})
```

#### `change_theme`
Switch theme for a demo.

```javascript
change_theme({ demoName: "ProductGrid", theme: "PE" })
// Themes: OSP, PE, PE_LIGHT, BP, default
```

---

### Component Discovery Tools

#### `get_component`
Get full details with examples for a component.

```javascript
get_component({ componentId: "gravi-grid" })
```

#### `list_components` / `search_components`
Browse or search the component registry.

---

## Common Mistakes to Avoid

**CRITICAL: These patterns will fail validation!**

| Mistake | Correct |
|---------|---------|
| `<Vertical style={{ flex: 1 }}>` | `<Vertical flex="1">` |
| `<Horizontal style={{ gap: '12px' }}>` | `<Horizontal gap={12}>` |
| `<Modal visible={isOpen}>` | `<Modal open={isOpen}>` |
| `<Drawer visible={isOpen}>` | `<Drawer open={isOpen}>` |
| `<GraviButton theme="success">` | `<GraviButton success>` |
| `<GraviButton htmlType="submit">` | `<GraviButton onClick={() => form.submit()}>` |
| `<Texto appearance="secondary">` (for gray) | `<Texto appearance="medium">` |
| `<div style={{ display: 'flex' }}>` | `<Vertical>` or `<Horizontal>` |
| `destroyOnClose` | `destroyOnHidden` |
| `onVisibleChange` | `onOpenChange` |
| `appearance='outline'` | `appearance='outlined'` |
| `style={{ justifyContent: 'center' }}` | `justifyContent="center"` prop |

---

## Component Patterns

### Layout Components

```typescript
import { Vertical, Horizontal } from '@gravitate-js/excalibrr';

// Vertical stack - use flex prop, not style
<Vertical flex="1" height="100%">
  {children}
</Vertical>

// Horizontal row - use gap prop (v5), props for alignment
<Horizontal
  justifyContent="space-between"
  alignItems="center"
  gap={12}
>
  {children}
</Horizontal>
```

### Typography (CRITICAL)

```typescript
import { Texto } from '@gravitate-js/excalibrr';

// Appearances:
//   "primary"   - Black/dark text (default)
//   "secondary" - BLUE color (NOT for gray!)
//   "medium"    - Medium gray - USE FOR LABELS
//   "light"     - Very light gray
//   "error", "success", "warning" - Status colors

// Section header
<Texto category="h6" appearance="medium" weight="600"
  style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
  Section Header
</Texto>

// Field label
<Texto category="p2" appearance="medium">Label</Texto>

// Field value
<Texto category="p1" weight="600">Value</Texto>

// Helper text
<Texto category="p2" appearance="medium">Helper text</Texto>
```

### Modal & Drawer (CRITICAL)

```typescript
import { Modal, Drawer } from 'antd';

// Use "open" NOT "visible" (antd v5)!
<Modal
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  title="Edit Customer"
  destroyOnHidden
>
  {content}
</Modal>

<Drawer
  open={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  destroyOnHidden
>
  {content}
</Drawer>
```

### Button Component

```typescript
import { GraviButton } from '@gravitate-js/excalibrr';

// Use boolean props for variants, NOT theme string
<GraviButton success>Save</GraviButton>        // Green button
<GraviButton ghost>Cancel</GraviButton>        // Ghost button
<GraviButton danger>Delete</GraviButton>       // Red button
<GraviButton type="submit">Submit</GraviButton> // Form submit

// WRONG:
// <GraviButton theme="success">Save</GraviButton>
// <GraviButton htmlType="submit">Submit</GraviButton>
```

### Grid Component

```typescript
import { GraviGrid } from '@gravitate-js/excalibrr';

<GraviGrid
  storageKey="unique-grid-key"
  rowData={data}
  columnDefs={columnDefs}
  agPropOverrides={{
    getRowId: (params) => params.data.id,
  }}
  controlBarProps={{
    title: 'Grid Title',
    actionButtons: <Horizontal className="gap-12">{buttons}</Horizontal>,
  }}
  updateEP={async (params) => {
    // Handle cell edits
    return Promise.resolve();
  }}
/>
```

### Card Section Pattern

```typescript
<Vertical className="bg-1 bordered pb-4" style={{ borderRadius: 8 }}>
  <Horizontal className="p-4 bg-2 border-bottom">
    <Texto category="h6">Section Title</Texto>
  </Horizontal>

  <Horizontal className="px-4 py-2">
    <Vertical flex="0.25" className="my-2 mx-4">
      <Texto category="heading-small" appearance="medium">FIELD LABEL</Texto>
      <Texto category="p1" weight="600">Field Value</Texto>
    </Vertical>
  </Horizontal>
</Vertical>
```

---

## Usage Examples

### Complete Workflow Example

```
User: Create a customer management grid with edit drawer

Claude:
1. preflight({ task: "customer grid with edit drawer" })
   -> Gets conventions + GraviGrid, Drawer, Vertical, Horizontal, Texto, GraviButton APIs

2. Generates code following conventions:
   - Uses <Drawer visible={...}> not open
   - Uses <Vertical flex="1"> not style={{ flex: 1 }}
   - Uses <Horizontal className="gap-12"> not gap prop
   - Uses <GraviButton success> not theme="success"

3. validate_code({ code: "..." })
   -> Catches any remaining issues

4. Fixes any errors

5. register_demo({
     name: "CustomerGrid",
     title: "Customer Management",
     category: "grids",
     componentPath: "./pages/demos/CustomerGrid"
   })
   -> Demo appears in Bakery -> Customer Management in sidebar
```

### Quick Grid Creation

```
/excalibrr Create a product catalog grid with:
- Product ID (readonly)
- Name (editable)
- Category (dropdown: Electronics, Clothing, Food)
- Price (editable number with currency format)
- Stock (editable number)
- Status (Active/Inactive badge)
```

### Quick Form Creation

```
/excalibrr-create Customer registration form with:
- First Name (required)
- Last Name (required)
- Email (required, email validation)
- Phone
- Account Type (select: Individual, Business, Enterprise)
- Newsletter (switch)
- Terms (checkbox, required)
```

---

## CSS Naming Convention

**ALWAYS kebab-case, NEVER BEM double underscores or dashes:**

```css
/* Correct */
.template-list-item-header { }
.product-grid-container { }

/* Wrong */
.template-list-item__header { }
.product-grid--expanded { }
```

---

## Theme Configuration

```typescript
// Set in component useEffect
useEffect(() => {
  localStorage.setItem("TYPE_OF_THEME", "BP");
}, []);
```

Available: `OSP`, `PE`, `PE_LIGHT`, `BP`, `default`

---

## Reference Repository

For real-world examples:
```
/Users/frankoverland/Documents/Gravitate Repo/Gravitate.Dotnet.Next/frontend/src/
```

| Pattern | Location |
|---------|----------|
| Grid Examples | `modules/ContractManagement/pages/ContractsReport/` |
| Form Examples | `modules/ContractManagement/pages/CreateContract/` |
| Column Defs | Search for `columnDefs.ts` |
| API Hooks | `modules/**/api/` |

---

## Troubleshooting

### MCP Server Not Connecting

1. Verify build: `ls mcp-server/build/index.js`
2. Check path is absolute in config
3. Restart app completely (quit, not just close)

### Demo Not in Navigation

1. Check `register_demo` was called
2. Verify both pageConfig.tsx AND AuthenticatedRoute.jsx updated
3. Keys must match exactly (case-sensitive)

### Validation Errors

Run `validate_code` to see specific issues. Common fixes:
- `use-flex-prop-not-style` -> Use `flex="1"` prop
- `modal-drawer-visible-not-open` -> Use `visible` not `open`
- `no-horizontal-gap-prop` -> Use `className="gap-12"`

---

## Quick Reference

| Task | Tool/Command |
|------|--------------|
| Start workflow | `preflight({ task: "..." })` |
| Validate code | `validate_code({ code: "..." })` |
| Register demo | `register_demo({ name, title, category, ... })` |
| Create grid | `create_demo({ instruction: "..." })` |
| Create form | `create_form_demo({ name, fields, ... })` |
| Modify grid | `modify_grid({ demoName, action, config })` |
| Change theme | `change_theme({ demoName, theme })` |
| Get component API | `get_component({ componentId: "..." })` |

---

*Excalibrr MCP Server v2.1.0 - With Preflight Workflow*
