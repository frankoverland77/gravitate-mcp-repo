# Solutions Demo Builder — V2 Implementation Plan

## Context

We're cleaning up the `excalibrr-mcp-server` repo to become `solutions-demo-builder`. A new skill has already been created at `demo/skills/solutions-demo-builder/` with an orchestrator SKILL.md and 6 reference docs. This plan covers the remaining cleanup work.

**Important:** This repo is shared — Frank, product team, and designers all pull from it. Every change should be safe and not break the running Vercel deployment. Do each step as a separate commit.

---

## Phase 2: Cleanup (execute in order)

### Step 2a: Update CLAUDE.md

File: `/CLAUDE.md`

Replace the current "MANDATORY WORKFLOW" section that references MCP tools (`preflight`, `validate_code`, `register_demo`) with instructions pointing to the new skill.

Changes:
- Remove references to MCP tools (`preflight`, `validate_code`, `register_demo`)
- Add: "Before generating any code, read `demo/skills/solutions-demo-builder/SKILL.md` and follow its workflow"
- Keep the "Common Mistakes to Avoid" table but fix these entries:
  - `<Modal visible={isOpen}>` → `<Modal open={isOpen}>` should be the CORRECT pattern (AntD v5 uses `open`)
  - `<Drawer visible={isOpen}>` → `<Drawer open={isOpen}>` should be the CORRECT pattern
  - Add: `destroyOnClose` → `destroyOnHidden`
  - Add: `onVisibleChange` → `onOpenChange`
  - Add: `<Tabs.TabPane>` children → `<Tabs items={[...]}>`
  - Add: `<Menu><Menu.Item>` children → `<Menu items={[...]}/>`
- Keep the Navigation Configuration, Server Management, Path Aliases, and Project Context sections as-is
- Keep dev commands section as-is

Commit message: "Update CLAUDE.md to reference new skill, fix AntD v5 conventions"

---

### Step 2b: Remove orphaned demo files

First, verify these files have NO imports anywhere else in the codebase:
```bash
grep -r "BakeryDemo" demo/src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" -l
grep -r "BakeryDemoTabs" demo/src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" -l
grep -r "CustomerList" demo/src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" -l
grep -r "ScheduleDemo" demo/src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" -l
grep -r "InventoryGrid" demo/src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" -l
```

If they're only referenced by themselves (self-imports) or by files also being deleted, remove:
- `demo/src/pages/demos/BakeryDemo.tsx`
- `demo/src/pages/demos/BakeryDemoTabs.tsx`
- `demo/src/pages/demos/BakeryDemo.data.ts` (if exists)
- `demo/src/pages/demos/CustomerList.tsx`
- `demo/src/pages/demos/ScheduleDemo.tsx`
- `demo/src/pages/demos/InventoryGrid.tsx`
- `demo/src/pages/demos/grids/FormulaTemplates.tsx.backup`

Also check `pageConfig.tsx` — if any of these are imported there, remove those imports too.

Commit message: "Remove orphaned demo files not registered in navigation"

---

### Step 2c: Clean up AuthenticatedRoute.jsx

File: `demo/src/_Main/AuthenticatedRoute.jsx`

In the `DEFAULT_SCOPES` object (around line 13-42), remove these keys that reference the files we just deleted:
- `BakeryProducts: true`
- `CustomerList: true`
- `InventoryGrid: true`
- `ScheduleDemo: true`

Then run `yarn check:pages` to verify pageConfig and AuthenticatedRoute are now in sync.

Commit message: "Remove orphaned scope keys from AuthenticatedRoute"

---

### Step 2d: Centralize theming

The current state: 9 demo components have hardcoded `localStorage.setItem('TYPE_OF_THEME', '...')` in useEffect hooks. This is scattered and fragile.

**Approach:** Create a `useTheme` hook and a `ThemeWrapper` component that demos can use.

1. Create `demo/src/hooks/useTheme.ts`:
```tsx
import { useEffect } from 'react'

export function useTheme(theme: string) {
  useEffect(() => {
    const previous = localStorage.getItem('TYPE_OF_THEME')
    localStorage.setItem('TYPE_OF_THEME', theme)
    window.dispatchEvent(new Event('storage'))

    return () => {
      if (previous) {
        localStorage.setItem('TYPE_OF_THEME', previous)
      }
      window.dispatchEvent(new Event('storage'))
    }
  }, [theme])
}
```

2. Find all files with the hardcoded pattern:
```bash
grep -rn "localStorage.setItem.*TYPE_OF_THEME" demo/src/ --include="*.tsx" --include="*.ts" -l
```

3. In each file, replace the `useEffect` block that sets `TYPE_OF_THEME` with:
```tsx
import { useTheme } from '@hooks/useTheme'

// Inside the component, replace the useEffect with:
useTheme('BP')  // or whatever theme that file was using
```

4. Make sure to add `@hooks/*` to the path aliases in `tsconfig.json` and `vite.config.js` if not already present. Check:
```bash
grep "hooks" demo/tsconfig.json demo/vite.config.js
```

5. Verify the existing `ThemeRouteWrapper.tsx` in `demo/src/components/shared/Theming/` — if it's just returning children, update it to use the hook, or leave it if it's not actively used.

Commit message: "Centralize theme setting with useTheme hook"

---

### Step 2e: Fix PROJECT_CONTEXT.md

File: `demo/PROJECT_CONTEXT.md`

In the "Key Rules" section, fix:
- "Modal/Drawer use `visible` prop (not `open`)" → "Modal/Drawer use `open` prop (not `visible`) — AntD v5"

Commit message: "Fix Modal/Drawer prop documentation to match AntD v5"

---

### Step 2f: Archive the MCP server

Don't delete — move to archive so Frank can reference it if needed.

```bash
mkdir -p _archived
git mv mcp-server _archived/mcp-server
```

Add a note in `_archived/README.md`:
```
# Archived

## mcp-server (archived 2026-03-25)
Superseded by the solutions-demo-builder skill at `demo/skills/solutions-demo-builder/`.
The skill provides the same conventions, component knowledge, and patterns without requiring an MCP server.
```

Also update the root `package.json` — remove any `build:mcp` scripts that reference the mcp-server directory.

Commit message: "Archive mcp-server, superseded by solutions-demo-builder skill"

---

### Step 2g: Verify everything

```bash
cd demo
yarn quality:check    # TypeScript + ESLint + Prettier
yarn check:pages      # Page registration sync
yarn build            # Production build
```

Fix any errors that come up. This is the safety net.

Commit message: "Fix any build/lint issues from cleanup" (only if needed)

---

## Phase 3: Rename (coordinate with team first)

This requires a brief heads-up to Frank and anyone else who has the repo cloned.

### The migration

1. **GitHub:** Rename repo from `excalibrr-mcp-server` to `solutions-demo-builder`
   - GitHub automatically creates redirects from the old URL for a period
   - Anyone with existing clones can update their remote:
     ```bash
     git remote set-url origin git@github.com:YourOrg/solutions-demo-builder.git
     ```

2. **Vercel:** Update the project to point to the new repo name
   - Go to Vercel project settings → Git → Repository
   - Update to the new repo name

3. **Update package.json:** Change the `name` field in root `package.json` and `demo/package.json` to `solutions-demo-builder`

4. **Team notification:** Send a message with:
   - What changed: repo renamed from `excalibrr-mcp-server` to `solutions-demo-builder`
   - What they need to do: run `git remote set-url origin <new-url>`
   - Timeline: 30 seconds of work, one time

Commit message: "Rename project to solutions-demo-builder"

---

## Verification Checklist

After all phases:
- [ ] `yarn dev` starts and the demo app works
- [ ] `yarn build` succeeds
- [ ] `yarn quality:check` passes
- [ ] `yarn check:pages` shows no sync issues
- [ ] Vercel deployment works
- [ ] New skill files are committed and pushed
- [ ] MCP server is archived, not deleted
- [ ] CLAUDE.md references the new skill
- [ ] No orphaned files or scopes remain
- [ ] Theme is centralized via useTheme hook
