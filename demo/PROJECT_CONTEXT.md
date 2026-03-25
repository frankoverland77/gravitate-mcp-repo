# Excalibrr Demo - Shared Infrastructure
*Last Updated: 2026-01-15*

This file covers **shared infrastructure only**. For feature-specific context, see each feature's own context file.

---

## Project Overview
**Name:** Excalibrr Demo Workspace
**Purpose:** React/Vite application for Excalibrr component demos and business application templates

---

## Feature Contexts (Primary Documentation)

| Feature | Context File |
|---------|-------------|
| Contract Measurement | `src/pages/ContractMeasurement/project-context.md` |
| Subscription Management | `src/pages/SubscriptionManagement/PROJECT_CONTEXT.md` |

---

## Technical Stack
- **Build:** Vite 5 + TypeScript + React 18
- **Components:** Excalibrr (5.2.0) + Ant Design (5.23+)
- **Grid:** AG Grid (Community/Enterprise)
- **Quality:** ESLint, Prettier, lint-staged pre-commit hooks

---

## Navigation System (CRITICAL)
Two files must stay in sync:
1. **`pageConfig.tsx`** - Defines sections, routes, icons
2. **`AuthenticatedRoute.jsx`** - Enables scopes (must match pageConfig keys exactly)

Run `yarn check:pages` to validate registration.

---

## Development Commands
```bash
yarn dev              # Start dev server (port 3000)
yarn quality:check    # TypeScript + ESLint + Prettier
yarn check:pages      # Verify page registration
```

---

## Key Rules
- Use Excalibrr components (Horizontal, Vertical, Texto, GraviButton) over raw HTML
- Use component props for layout, utility classes for spacing
- GraviGrid requires `agPropOverrides={{}}` prop
- Modal/Drawer use `open` prop (not `visible`) — AntD v5

---

## Context Management
This project uses feature-level context files. Each feature folder should contain its own `project-context.md` documenting:
- Feature decisions and rationale
- Session logs and progress
- Next actions specific to that feature
