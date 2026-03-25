---
name: solutions-demo-builder
description: Build interactive demo pages for the Gravitate Selling Solutions platform. Use this skill whenever someone asks to create, modify, or scaffold a demo, prototype, or proof-of-concept that should look and feel like the real Gravitate application. Triggers on mentions of demo, prototype, POC, mock, scaffold feature, new page, delivery demo, pricing grid, contract management, or any request to build UI that uses Excalibrr components (GraviGrid, GraviButton, Texto, Horizontal, Vertical). Also use when someone asks to add a new page or feature to the demo app. This skill is designed for non-technical users (designers, product managers) who describe what they want in plain language — the agent translates their intent into production-quality code following Gravitate conventions.
---

# Solutions Demo Builder

You are building demos for the Gravitate Selling Solutions platform. These demos look and feel exactly like the real application — same components, same layout patterns, same visual language — but use mock data instead of real APIs. The audience is designers and product managers who want to rapidly iterate on ideas and show concepts to customers.

## The Golden Rule

**Every demo must be indistinguishable from a real feature at first glance.** This means using the exact same components, layout patterns, and conventions as the production app. No shortcuts, no raw HTML, no ad-hoc styling.

## How This Skill Works

This skill is an orchestrator. It tells you **what to do** and **when to read deeper references**. The actual component APIs, patterns, and conventions live in reference docs — read them on demand, not all at once.

## Workflow

When someone asks you to build a demo, follow these steps:

### Step 1: Understand the Request

Figure out what kind of demo they want. Common types:

| Request sounds like... | You're building... | Read these references |
|------------------------|--------------------|-----------------------|
| "grid", "table", "list of data", "spreadsheet" | Data grid page | `component-api.md` + `grid-patterns.md` |
| "form", "create", "edit", "input fields" | Form page or modal | `component-api.md` + `form-patterns.md` |
| "dashboard", "overview", "metrics", "KPIs" | Dashboard page | `component-api.md` + `layout-patterns.md` |
| "whole feature", "CRUD", "management page" | Full feature (grid + forms + modals) | All references |
| "modify existing", "add column", "change layout" | Edit to existing demo | Relevant reference for the change |

If the request is vague ("build me something for delivery tracking"), ask one clarifying question, then build. Don't over-interview — these are demos, not production features. Bias toward action.

### Step 2: Read the Relevant References

Before writing ANY code, read the reference docs you identified in Step 1. Always read `component-api.md` — it has the critical anti-pattern table that prevents the most common mistakes.

References live in `references/` next to this file:

| Reference | When to Read | What's In It |
|-----------|-------------|--------------|
| [component-api.md](./references/component-api.md) | **ALWAYS** | Component props, anti-patterns, the rules that prevent 90% of mistakes |
| [grid-patterns.md](./references/grid-patterns.md) | Building any data grid | GraviGrid setup, column defs, bulk editing, control bars |
| [form-patterns.md](./references/form-patterns.md) | Building forms or modals | AntD Form + Excalibrr layout, validation, edit/create flows |
| [layout-patterns.md](./references/layout-patterns.md) | Dashboards, layouts, spacing | Horizontal/Vertical patterns, spacing utilities, theming |
| [feature-structure.md](./references/feature-structure.md) | Building a full feature | Folder structure, API hooks (mocked), page scaffold, navigation |
| [demo-app-conventions.md](./references/demo-app-conventions.md) | Adding new pages to the demo app | Route registration, theming, mock data strategy |

### Step 3: Scaffold the Feature

Read `feature-structure.md` for the folder template. Every demo follows this shape:

```
src/pages/demos/{category}/{FeatureName}/
├── {FeatureName}Page.tsx           # Main page component
├── {FeatureName}.columnDefs.tsx    # Column definitions (if grid)
├── {FeatureName}.data.ts           # Mock data
├── components/                     # Sub-components (modals, forms, detail panels)
│   ├── {Name}Modal.tsx
│   └── {Name}DetailPanel.tsx
└── types.ts                        # TypeScript types for mock data
```

Simple demos (just a grid or form) can be 2-3 files. Complex features use the full structure.

### Step 4: Generate the Code

Write the code following the patterns from the references. Key principles:

1. **Never use raw HTML.** Replace `<div>`, `<p>`, `<span>`, `<button>` with Excalibrr/AntD components.
2. **Props over styles.** Use component props for layout, utility classes for spacing, inline styles only for theme variables.
3. **Mock data, not API calls.** Use static arrays or simple `useState` for data. No fetch calls, no React Query in demos.
4. **Named exports.** `export function FeatureName()` — no default exports, no arrow function exports.
5. **Realistic data.** Mock data should look like real energy industry data — commodity names, delivery locations, contract terms, pricing. Not "Lorem ipsum" or "Test Data 1".

### Step 5: Register the Demo

After creating the feature files, register it in the demo app's navigation. Read `demo-app-conventions.md` for the exact steps — you need to update both `pageConfig.tsx` AND `AuthenticatedRoute.jsx`.

### Step 6: Validate

Before presenting the code:

1. Check against the anti-pattern table in `component-api.md`
2. Verify all imports use correct path aliases (`@components/`, `@pages/`, etc.)
3. Confirm no raw HTML elements leaked in
4. Ensure `agPropOverrides={{}}` is present on every GraviGrid
5. Verify Modal/Drawer use `open` prop (not `visible`)
6. Run `yarn quality:check` if available

## Quick Anti-Pattern Reference

These are the most common mistakes. The full list is in `component-api.md`.

| Don't Do This | Do This Instead |
|---------------|-----------------|
| `<div style={{display:'flex'}}>` | `<Horizontal>` or `<Vertical>` |
| `<p>`, `<h1>`, `<span>` | `<Texto category="p1">` |
| `<button>` | `<GraviButton buttonText="...">` |
| `style={{ flex: 1 }}` | `flex="1"` prop |
| `style={{ gap: '12px' }}` | `gap={12}` prop |
| `appearance="secondary"` for gray text | `appearance="medium"` (secondary is BLUE) |
| `<Modal visible={...}>` | `<Modal open={...}>` |
| `destroyOnClose` | `destroyOnHidden` |
| `<Tabs.TabPane>` children | `<Tabs items={[...]}>` |
| `<GraviButton htmlType="submit">` | `<GraviButton onClick={() => form.submit()}>` |
| `<GraviGrid />` without agPropOverrides | `<GraviGrid agPropOverrides={{}} />` |

## Import Order

Always follow this order:

```tsx
// 1. React
import React, { useState, useMemo } from 'react'

// 2. Excalibrr (FIRST for UI components)
import { GraviButton, GraviGrid, Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr'

// 3. AntD
import { Form, Input, Modal, Select } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'

// 4. Local imports
import { mockData } from './FeatureName.data'
import { getColumnDefs } from './FeatureName.columnDefs'
```

## Code Style

```
singleQuote: true
jsxSingleQuote: true
semi: false
tabWidth: 2
printWidth: 120
```

Use named exports matching filename. Kebab-case CSS classes (no BEM). No hardcoded colors — use CSS variables like `var(--theme-color-2)`.

## When Modifying Existing Demos

1. Read the existing code first
2. Identify which patterns it uses
3. Read the relevant reference docs
4. Make changes following the same patterns
5. Don't refactor unrelated code in the same change
