# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚨 MANDATORY WORKFLOW - READ FIRST

**Before generating ANY Excalibrr component code, you MUST follow this workflow:**

### Step 1: Call `preflight` tool
```
preflight({ task: "<describe what you're building>" })
```

This returns:
- Critical conventions (mistakes to avoid)
- Component APIs for detected components
- Examples for each component

### Step 2: Generate code following the conventions

### Step 3: Validate code before presenting
```
validate_code({ code: "<your generated code>" })
```
Then run the pre-commit hook:
```bash
git add <your-files>
git hook run pre-commit
```

This validates:
- Convention violations (via validate_code)
- No ESLint errors (no `any` types, proper imports)
- Prettier formatting
- React best practices

### Step 4: Fix ALL errors before presenting to user

### Step 5: Call `register_demo` to add navigation (for new demos)
```
register_demo({
  name: "ComponentName",
  title: "Display Title",
  description: "Brief description",
  category: "grids",  // or "forms" or "dashboards"
  componentPath: "./pages/demos/ComponentName"
})
```

**Example complete workflow:**
```
User: "Create a schedule management grid with edit drawer"

Claude:
1. preflight({ task: "grid page with edit drawer form" })
2. [Read conventions and component APIs]
3. [Generate ScheduleDemo.tsx code]
4. validate_code({ filePath: "demo/src/pages/demos/ScheduleDemo.tsx" })
5. git add && git hook run pre-commit
6. [Fix any errors from validation or pre-commit]
7. register_demo({
     name: "ScheduleDemo",
     title: "Schedule Management",
     description: "Schedule management with edit/create drawer",
     category: "grids",
     componentPath: "./pages/demos/ScheduleDemo"
   })
8. [Present to user with navigation instructions]
```

**⚠️ NEVER skip the preflight step. It prevents 90% of common mistakes.**
**⚠️ ALWAYS call register_demo for new demos. Otherwise they won't appear in navigation.**
**⚠️ ALWAYS validate code with both validate_code AND pre-commit hook before presenting.**

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| `<Vertical style={{ flex: 1 }}>` | `<Vertical flex="1">` |
| `<Vertical style={{ height: '100%' }}>` | `<Vertical height="100%">` |
| `<Horizontal gap={12}>` | `<Horizontal style={{ gap: '12px' }}>` or `className="gap-12"` |
| `<Horizontal style={{ justifyContent: '...' }}>` | `<Horizontal justifyContent="...">` |
| `<Modal open={isOpen}>` | `<Modal visible={isOpen}>` |
| `<Drawer open={isOpen}>` | `<Drawer visible={isOpen}>` |
| `<GraviButton theme="success">` | `<GraviButton success>` |
| `<GraviButton htmlType="submit">` | `<GraviButton onClick={() => form.submit()}>` |
| `<Texto appearance="secondary">` for gray | `<Texto appearance="medium">` (secondary is BLUE!) |
| `<GraviGrid />` without agPropOverrides | `<GraviGrid agPropOverrides={{}} />` |

---

## Repository Overview

This is a Yarn monorepo workspace containing two main projects:
1. **MCP Server** (`/mcp-server/`) - Model Context Protocol server providing AI access to Excalibrr component generation tools
2. **Demo Project** (`/demo/`) - React/Vite application for generating and previewing Excalibrr component demos

## Common Development Commands

### Workspace Commands (from root)
```bash
./setup.sh          # Initial setup - runs yarn install and builds MCP server
yarn setup          # Quick workspace setup
yarn build:mcp      # Build MCP server only
yarn dev            # Start demo development server
yarn mcp            # Start MCP server
```

### MCP Server Development (`/mcp-server/`)
```bash
cd mcp-server
npm run build       # Build TypeScript to JavaScript
npm run dev         # Development with watch mode
npm start           # Start production server (STDIO mode)
npm run clean       # Clean build artifacts
```

### Demo Project Development (`/demo/`)
```bash
cd demo
yarn dev            # Start Vite dev server (port 3000, may fallback to 5173)
npx vite            # Alternative if yarn dev has issues
yarn build          # Build demo project
yarn preview        # Preview production build
```

---

## ⚠️ MANDATORY RULES - ALWAYS FOLLOW

### Rule 1: Prefer Excalibrr Components Over Native HTML

**ALWAYS use Excalibrr/AntD components. NEVER use raw HTML elements.**

| Instead of | Use |
|------------|-----|
| `<div style={{display:'flex'}}>` | `<Horizontal>` or `<Vertical>` |
| `<p>`, `<h1>`, `<span>` | `<Texto category="p1">` |
| `<button>` | `<GraviButton>` |
| `<input>` | `<Input>` from AntD |
| `<select>` | `<Select>` from AntD |

```tsx
// ❌ WRONG
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <h1>Title</h1>
  <button onClick={handleClick}>Click</button>
</div>

// ✅ CORRECT
<Horizontal justifyContent='space-between'>
  <Texto category='h1'>Title</Texto>
  <GraviButton buttonText='Click' onClick={handleClick} />
</Horizontal>
```

### Rule 2: Typography - Use Texto Component

**NEVER use raw text elements. ALWAYS use `<Texto>` with proper props.**

```tsx
// Categories: h1, h2, h3, h4, h5, h6, p1, p2, heading, heading-small
// Weight: "400", "500", "600", "700", "bold"
// Appearance: "primary", "secondary" (BLUE!), "light", "medium" (gray), "error", "success", "warning"

// ⚠️ CRITICAL: "secondary" = BLUE, NOT gray!
// ⚠️ Use "medium" for gray labels and helper text

// Section headers (uppercase labels)
<Texto category='h6' appearance='medium' weight='600' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>

// Field labels
<Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>

// Field values (bold)
<Texto category='p1' weight='600'>

// Helper text / subdued content
<Texto category='p2' appearance='medium'>
```

### Rule 3: Utility Classes Over Inline Styles

**Priority order: Component Props → Utility Classes → Inline Styles (last resort)**

```tsx
// ❌ WRONG - inline styles for common properties
<Vertical style={{ padding: '24px', marginBottom: '16px', borderRadius: '8px' }}>

// ✅ CORRECT - utility classes + props
<Vertical className='p-3 mb-2 border-radius-5'>

// ❌ WRONG - inline layout styles
<Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>

// ✅ CORRECT - component props
<Horizontal justifyContent='space-between' alignItems='center'>
```

**Available utility classes:**
- Spacing: `mb-1`, `mb-2`, `mb-4`, `mt-1`, `ml-2`, `p-2`, `p-3`
- Layout: `border-radius-5`, `text-center`, `gap-16`, `gap-10`

**Inline styles ONLY for:** theme variables, dynamic values, complex one-offs
```tsx
style={{ backgroundColor: 'var(--theme-bg-elevated)' }}  // ✅ OK
style={{ width: `${progress}%` }}                         // ✅ OK
```

### Rule 4: CSS Naming Convention - Kebab-Case Only

```tsx
// ✅ CORRECT - kebab-case with component prefix
.template-list-item-header
.template-list-item-has-placeholders

// ❌ WRONG - no BEM double underscores or dashes
.template-list-item__header
.template-list-item--has-placeholders
```

### Rule 5: Theme Colors - Use Variables

**NEVER hardcode colors. ALWAYS use theme variables from `src/components/shared/Theming/`**

```tsx
// ❌ WRONG
style={{ color: '#333', backgroundColor: '#f5f5f5' }}

// ✅ CORRECT
style={{ color: 'var(--theme-color-2)', backgroundColor: 'var(--theme-bg-elevated)' }}
```

### Rule 6: Code Formatting - Prettier Config

All `.jsx`, `.tsx`, `.js`, `.ts` files must follow:
```json
{
  "singleQuote": true,
  "jsxSingleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "printWidth": 120
}
```

### Rule 7: Function Components - Named Exports

```tsx
// ✅ CORRECT - filename: ProductForm.tsx
export function ProductForm() {
  // ...
}

// ❌ WRONG - default exports, arrow functions as components
export default function ProductForm() { }
const ProductForm = () => { }
```

### Rule 8: No Lazy Imports

```tsx
// ❌ WRONG - causes duplicate mounting, white screens
component: React.lazy(() => import('./pages/demos/ProductForm'))

// ✅ CORRECT - direct imports
import { ProductForm } from './pages/demos/ProductForm'
// ...
component: ProductForm
```

### Rule 9: No TypeScript Errors

Resolve ALL TypeScript errors in `.tsx` and `.ts` files.

**Exception:** Ignore `sideBar` property errors on GraviGrid - this is a valid prop despite TypeScript warnings.

### Rule 10: No Console Errors

Code must not generate console errors. Common fixes:
- Check for duplicate route paths before adding
- Use correct component props (check component docs)
- Match import style to export style (named vs default)

---

## Navigation Configuration (CRITICAL)

When adding navigation sections, you **MUST** update TWO files:

### 1. `demo/src/pageConfig.tsx` - Define the route
```typescript
config.Bakery = {
  hasPermission: () => true,
  key: 'Bakery',
  icon: <ShopOutlined />,
  title: 'Bakery',
  routes: gridsRoutes,
}
```

### 2. `demo/src/_Main/AuthenticatedRoute.jsx` - Enable the scope
```javascript
const scopes = {
  Welcome: true,
  Bakery: true,  // ← MUST match section key exactly (case-sensitive)
  Forms: true,
}
```

**If you forget to update AuthenticatedRoute.jsx, the menu item will NOT appear!**

---

## Server Management

### ONE server per project - always clean restart

1. Check if server is already running
2. Kill existing server first
3. Start fresh server
4. Use auto-detected ports (don't assume 3000/3001)
5. Always show actual port in output

---

## Architecture

### MCP Server (`/mcp-server/`)
- **Transport**: STDIO for Claude Desktop
- **Key Tools**:
  - **Workflow**: `preflight` (CALL FIRST!), `validate_code`, `get_conventions`
  - **Demo Creation**: `create_demo`, `create_form_demo`, `scaffold_feature`
  - **Modification**: `modify_grid`, `change_theme`, `convert_to_excalibrr`
  - **Review**: `review_component`, `design_review`
  - **Registry**: `list_components`, `search_components`, `get_component`
  - **Management**: `run_dev_server`, `cleanup_demo`, `cleanup_styles`
  - **Figma**: `import_from_figma`, `figma_to_code`

### Demo Project (`/demo/`)
- **Build**: Vite 5 + TypeScript + React + Less
- **Components**: `@gravitate-js/excalibrr@4.0.34-osp`
- **Grid**: AG Grid Community/Enterprise
- **Themes**: OSP, PE, BP

### Generated Demo Structure
```
demo/src/pages/demos/
├── ProductGrid.tsx
├── ProductGrid.data.ts
├── ProductForm/
│   ├── ProductForm.tsx
│   └── ProductForm.data.ts
└── BakeryDemoTabs.tsx
```

---

## File Organization Patterns

### Feature Structure (Gravitate Pattern)
```
src/modules/Admin/FeatureName/
├── api/
│   ├── types.schema.ts       # Request/response types
│   └── useFeatureName.ts     # React Query hooks
├── FeatureNamePage.tsx       # Main page component
└── components/
    └── FeatureNameColumnDefs.tsx
```

### Naming Conventions
- `{ComponentName}.tsx` - Component files match export name
- `index.tsx` - Parent component in folder structure
- `page.tsx` - Top-level page referenced in pageConfig
- `columnDefs.tsx` - Grid column definitions
- `*.types.ts` or `*.schema.ts` - Type definitions

### Import Priority
1. First: `@gravitate-js/excalibrr`
2. Second: `antd`
3. Never: Raw HTML elements

---

## Component Quick Reference

### GraviGrid Required Props
```tsx
<GraviGrid
  agPropOverrides={{}}  // ← ALWAYS include this
  columnDefs={columnDefs}
  rowData={data}
  storageKey='UniqueStorageKey'
/>
```

### Modal - Use `visible` not `open`
```tsx
<Modal visible={isOpen} />  // ✅
<Modal open={isOpen} />     // ❌
```

### Horizontal/Vertical - No `gap` prop, use style
```tsx
<Horizontal style={{ gap: '12px' }}>  // ✅
<Horizontal gap={12}>                  // ❌
```

### NotificationMessage for User Feedback
```tsx
// Success
NotificationMessage('Success.', 'Record saved successfully', false)

// Error
NotificationMessage('Error.', 'Failed to save record', true)
```

---

## Path Aliases

```typescript
@components  → src/components
@pages       → src/pages
@utils       → src/utils
@api         → src/api
@styles      → src/styles
@assets      → src/assets
```

---

## References

For detailed documentation, see `/docs/`:
- `component-registry.md` - Component browsing and search
- `the-anatomy-of-a-feature.md` - Project structure patterns
- `feature-scaffolding-quick-start-guide.md` - Quick feature setup
- `form-creation.md` - Form patterns
- `figma-integration.md` - Figma import workflow

---

## MCP Tools Quick Reference

### 🚨 Workflow Tools (Use These!)

| Tool | When to Use |
|------|-------------|
| `preflight` | **FIRST** - Before generating any code. Pass task description. |
| `validate_code` | **BEFORE PRESENTING** - Check code for convention violations. |
| `register_demo` | **AFTER CREATING** - Register new demo in navigation system. |
| `get_conventions` | Get full conventions list (preflight includes condensed version). |

### Code Generation Tools

| Tool | Purpose |
|------|----------|
| `scaffold_feature` | Generate complete feature folder (API, types, page, grid, form) |
| `create_demo` | Create grid demo shell |
| `create_form_demo` | Create form demo shell |
| `generate_column_defs` | Generate AG Grid column definitions from fields |

### Code Quality Tools

| Tool | Purpose |
|------|----------|
| `review_component` | Detailed code review with suggestions |
| `design_review` | Multi-file design review workflow |
| `convert_to_excalibrr` | Convert raw HTML/CSS to Excalibrr components |
| `cleanup_styles` | Replace inline styles with utility classes |

### Component Registry Tools

| Tool | Purpose |
|------|----------|
| `get_component` | Get full details for a specific component |
| `search_components` | Search components by name/description |
| `list_components` | Browse all available components |

### Example: Full Workflow

```
// 1. Get component APIs and conventions
preflight({ task: "create a product management grid with edit modal" })

// 2. Generate the component code (or use scaffold_feature for full feature)
// [Write ProductManagement.tsx]

// 3. Validate before presenting
validate_code({ filePath: "demo/src/pages/demos/ProductManagement.tsx" })

// 4. Register in navigation
register_demo({
  name: "ProductManagement",
  title: "Product Management",
  description: "Product grid with edit/create modal",
  category: "grids",
  componentPath: "./pages/demos/ProductManagement"
})

// 5. Present to user - demo will appear under Bakery in sidebar
```
