# Demo App Conventions

How to add new pages, register routes, configure themes, and work within the demo app infrastructure.

## Table of Contents
- [Adding a New Demo Page](#adding-a-new-demo-page)
- [Route Registration](#route-registration)
- [Theming](#theming)
- [Path Aliases](#path-aliases)
- [Development Commands](#development-commands)
- [Project Structure Overview](#project-structure-overview)

---

## Adding a New Demo Page

Complete steps to add a new demo to the app:

### 1. Create the Feature Files
Create your feature under `demo/src/pages/demos/{category}/{FeatureName}/`.
See `feature-structure.md` for the folder template.

### 2. Register in pageConfig.tsx
Open `demo/src/pageConfig.tsx` and add your demo to the appropriate section.

If adding to an existing section (like an existing "Grids" or "Forms" menu group):

```tsx
// Add to the routes array for that section
{
  path: '/contract-management',
  key: 'ContractManagement',
  title: 'Contract Management',
  element: <ContractManagementPage />,
}
```

If creating a new top-level section:

```tsx
import { ShopOutlined } from '@ant-design/icons'

config.NewSection = {
  hasPermission: () => true,
  key: 'NewSection',
  icon: <ShopOutlined />,
  title: 'New Section',
  routes: [
    {
      path: '/new-section/feature-one',
      key: 'FeatureOne',
      title: 'Feature One',
      element: <FeatureOnePage />,
    },
  ],
}
```

### 3. Enable the Scope in AuthenticatedRoute.jsx

**CRITICAL:** You must also update `demo/src/_Main/AuthenticatedRoute.jsx` to enable the new scope.

Open that file and add your section key to the `DEFAULT_SCOPES` object:

```javascript
const DEFAULT_SCOPES = {
  Welcome: true,
  // ... existing scopes ...
  NewSection: true,  // Must match the key in pageConfig EXACTLY (case-sensitive)
}
```

**If you forget this step, the menu item will not appear in the sidebar.**

### 4. Import Your Component
Add the import at the top of `pageConfig.tsx`:

```tsx
import { ContractManagementPage } from '@pages/demos/grids/ContractManagement/ContractManagementPage'
```

### 5. Verify
Run `yarn check:pages` to validate registration, then `yarn dev` to test.

---

## Route Registration

### The Two-File Requirement

Navigation requires entries in TWO files:

| File | Purpose | What to Add |
|------|---------|-------------|
| `pageConfig.tsx` | Defines routes, icons, menu structure | Route config object |
| `AuthenticatedRoute.jsx` | Enables scope visibility | Key in DEFAULT_SCOPES |

The keys must match exactly (case-sensitive). If they don't, the menu item either won't show or will show but the route won't work.

### Route Config Shape

```tsx
{
  path: string          // URL path
  key: string           // Unique identifier (used for scope matching)
  title: string         // Display name in sidebar
  element: JSX.Element  // React component to render
  icon?: ReactNode      // Optional icon (only for top-level sections)
}
```

### Checking Registration
```bash
yarn check:pages  # Validates pageConfig ↔ AuthenticatedRoute sync
```

---

## Theming

The demo app supports multiple brand themes: OSP, BP, PE, Sunoco, Motiva, and more.

### Current Theme System

Themes are defined in `demo/src/components/shared/Theming/themeconfigs.ts`. Each theme specifies CSS variables for colors, backgrounds, borders, and typography.

### Setting Theme for a Demo

The recommended approach is to use the theme context. For demos that need a specific brand theme:

```tsx
// In your demo component
import { useEffect } from 'react'

export function BPContractDemo() {
  useEffect(() => {
    localStorage.setItem('TYPE_OF_THEME', 'BP')
    // Trigger theme refresh
    window.dispatchEvent(new Event('storage'))
  }, [])

  return (
    // ... demo content
  )
}
```

### Available Themes

| Theme Key | Brand |
|-----------|-------|
| `Light` | Default light theme |
| `Dark` | Dark mode |
| `OSP` | OSP brand |
| `BP` | BP brand |
| `PE` | PE brand |
| `Sunoco` | Sunoco brand |
| `Motiva` | Motiva brand |
| `PE_LIGHT` | PE light variant |

### Theme CSS Variables

Always use CSS variables for colors — they adapt to the active theme:

```css
var(--theme-bg-default)       /* Page background */
var(--theme-bg-elevated)      /* Card/panel background */
var(--theme-color-2)          /* Primary brand color */
var(--theme-color-text)       /* Text color */
var(--theme-border-color)     /* Border color */
```

Never hardcode hex colors. See `layout-patterns.md` for the full variable reference.

---

## Path Aliases

The demo app uses these TypeScript path aliases:

| Alias | Maps To |
|-------|---------|
| `@components/*` | `src/components/*` |
| `@pages/*` | `src/pages/*` |
| `@utils/*` | `src/utils/*` |
| `@api/*` | `src/api/*` |
| `@styles/*` | `src/styles/*` |
| `@assets/*` | `src/assets/*` |

**Important:** Use `@components/...` not `@/components/...` — no slash after the `@`.

---

## Development Commands

```bash
yarn dev              # Start Vite dev server (port 3000)
yarn build            # Production build
yarn quality:check    # TypeScript + ESLint + Prettier
yarn check:pages      # Verify page registration consistency
```

---

## Project Structure Overview

```
demo/
├── src/
│   ├── _Main/
│   │   └── AuthenticatedRoute.jsx    # Scope enablement
│   ├── components/
│   │   └── shared/
│   │       └── Theming/
│   │           └── themeconfigs.ts    # Theme definitions
│   ├── pages/
│   │   ├── demos/                    # All demo features
│   │   │   ├── grids/                # Grid demos
│   │   │   ├── forms/                # Form demos
│   │   │   ├── dashboards/           # Dashboard demos
│   │   │   └── delivery/             # Delivery-specific demos
│   │   ├── ContractMeasurement/      # Major feature areas
│   │   ├── SubscriptionManagement/   # Major feature areas
│   │   └── ProjectHub/               # Navigation hub
│   ├── pageConfig.tsx                # Route definitions + sidebar structure
│   ├── App.tsx                       # Root component
│   └── main.tsx                      # Entry point
├── skills/                           # Skills (this skill lives here)
├── package.json
├── vite.config.js
└── tsconfig.json
```

### Key Files for Navigation

| File | Role |
|------|------|
| `src/pageConfig.tsx` | Defines all routes, menu items, icons |
| `src/_Main/AuthenticatedRoute.jsx` | Controls which sections are visible |
| `src/pages/ProjectHub/ProjectHub.tsx` | Renders the sidebar from pageConfig |
