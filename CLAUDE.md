# CLAUDE.md

---

## MANDATORY WORKFLOW - READ FIRST

**Before generating ANY Excalibrr component code, you MUST follow this workflow:**

### Step 1: Call `preflight` tool
```
preflight({ task: "<describe what you're building>" })
```
Returns: critical conventions, component APIs, and examples.

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

**NEVER skip the preflight step. It prevents 90% of common mistakes.**
**ALWAYS call register_demo for new demos. Otherwise they won't appear in navigation.**
**ALWAYS validate code with both validate_code AND pre-commit hook before presenting.**

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| `<Vertical style={{ flex: 1 }}>` | `<Vertical flex="1">` |
| `<Vertical style={{ height: '100%' }}>` | `<Vertical height="100%">` |
| `<Horizontal style={{ gap: '12px' }}>` | `<Horizontal gap={12}>` |
| `<Horizontal style={{ justifyContent: '...' }}>` | `<Horizontal justifyContent="...">` |
| `<Modal visible={isOpen}>` | `<Modal open={isOpen}>` |
| `<Drawer visible={isOpen}>` | `<Drawer open={isOpen}>` |
| `destroyOnClose` | `destroyOnHidden` |
| `onVisibleChange` | `onOpenChange` |
| `appearance='outline'` | `appearance='outlined'` |
| `<GraviButton theme="success">` | `<GraviButton success>` |
| `<GraviButton htmlType="submit">` | `<GraviButton onClick={() => form.submit()}>` |
| `<Texto appearance="secondary">` for gray | `<Texto appearance="medium">` (secondary is BLUE!) |
| `<GraviGrid />` without agPropOverrides | `<GraviGrid agPropOverrides={{}} />` |
| `<Menu><Menu.Item key="x">Label</Menu.Item></Menu>` | `<Menu items={[{ key: 'x', label: 'Label' }]} />` |

---

## Repository & Dev Commands

Yarn monorepo: **MCP Server** (`/mcp-server/`) + **Demo Project** (`/demo/`).

```bash
yarn dev              # Start demo dev server
yarn build:mcp        # Build MCP server
cd mcp-server && npm run build   # Build MCP server directly
cd demo && npx vite   # Alternative demo start
```

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
  Bakery: true,  // MUST match section key exactly (case-sensitive)
  Forms: true,
}
```

**If you forget to update AuthenticatedRoute.jsx, the menu item will NOT appear!**

---

## Server Management

ONE server per project — always kill existing, start fresh, use auto-detected ports.

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

## Project Context Updates

**After completing major work on any feature with a `project-context.md` or `PROJECT_CONTEXT.md`, update it with a session entry.** See `docs/` for full guide. Locations: `demo/src/pages/ContractMeasurement/project-context.md`, `demo/src/pages/SubscriptionManagement/PROJECT_CONTEXT.md`.

**Starting a new feature?** Run `/start-feature FeatureName` to auto-create project-context.md, a topic file, and update MEMORY.md pointers. It also archives the outgoing feature's context.
