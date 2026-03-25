# CLAUDE.md

---

## MANDATORY WORKFLOW - READ FIRST

**Before generating ANY Excalibrr component code, you MUST follow this workflow:**

1. Read `demo/skills/solutions-demo-builder/SKILL.md` and follow its workflow
2. Generate code following the conventions described in the skill
3. Run the pre-commit hook before presenting:
```bash
git add <your-files>
git hook run pre-commit
```
4. Fix ALL errors before presenting to user

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
| `<Tabs.TabPane>` children | `<Tabs items={[...]}/>` |

---

## Repository & Dev Commands

```bash
yarn dev              # Start demo dev server
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
@hooks       → src/hooks
```

---

## Project Context Updates

**After completing major work on any feature with a `project-context.md` or `PROJECT_CONTEXT.md`, update it with a session entry.** See `docs/` for full guide. Locations: `demo/src/pages/ContractMeasurement/project-context.md`, `demo/src/pages/SubscriptionManagement/PROJECT_CONTEXT.md`.

**Starting a new feature?** Run `/start-feature FeatureName` to auto-create project-context.md, a topic file, and update MEMORY.md pointers. It also archives the outgoing feature's context.
