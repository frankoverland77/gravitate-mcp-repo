# Codebase Structure

**Analysis Date:** 2026-01-16

## Directory Layout

```
demo/
├── src/
│   ├── _Main/              # App shell and routing
│   ├── api/                # Global API utilities
│   ├── assets/             # Static resources by brand
│   ├── components/         # Shared UI components
│   │   └── shared/
│   │       ├── Grid/       # GraviGrid extensions
│   │       ├── Navigation/ # Nav controls
│   │       ├── Theming/    # Theme system
│   │       ├── TemplateChooser/
│   │       └── SaveTemplateModal/
│   ├── contexts/           # Global React contexts
│   ├── pages/              # Feature pages
│   │   ├── demos/          # Demo feature pages
│   │   ├── ContractMeasurement/
│   │   ├── OnlineSellingPlatform/
│   │   ├── GlobalTieredPricing/
│   │   ├── SubscriptionManagement/
│   │   └── WelcomePages/
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root app component
│   ├── main.tsx            # Entry point
│   ├── pageConfig.tsx      # Route/nav configuration
│   └── styles.css          # Global utility classes
├── docs/                   # Feature documentation
├── scripts/                # Build/dev scripts
├── context/                # Claude context files
├── build/                  # Production build output
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── eslint.config.js        # Linting rules
```

## Directory Purposes

**`src/_Main/`:**
- Purpose: Application shell with routing
- Contains: Router setup, authenticated route wrapper
- Key files: `index.jsx` (router), `AuthenticatedRoute.jsx` (shell)

**`src/api/`:**
- Purpose: Global API configuration and shared types
- Contains: Environment config, shared type definitions
- Key files: `useEnvironmentConfig.tsx`

**`src/assets/`:**
- Purpose: Static resources organized by brand/theme
- Contains: Logos, backgrounds, icons, fonts, sounds
- Key files: Brand-specific subdirectories (pe/, osp/, bp/, etc.)

**`src/components/shared/`:**
- Purpose: Reusable components used across features
- Contains: Grid utilities, theming, navigation
- Key files: `ThemeRouteWrapper.tsx`, `Grid/FormulaComponentsGrid.tsx`

**`src/components/shared/Grid/`:**
- Purpose: AG Grid customizations and extensions
- Contains: Cell editors, column definitions, bulk change utilities
- Key files: `cellEditors/SelectCellEditor.tsx`, `defaultColumnDefs/`

**`src/components/shared/Theming/`:**
- Purpose: Multi-theme support with brand variations
- Contains: Theme configs, theme-specific LESS files
- Key files: `themeconfigs.ts`, `Themes/*/`, `ThemeBase/`

**`src/contexts/`:**
- Purpose: Global state management via React Context
- Contains: Feature mode, formula management, product state
- Key files: `FeatureModeContext.tsx`, `ProductFormulaContext.tsx`, `FormulaTemplateContext.tsx`

**`src/pages/`:**
- Purpose: Feature page components organized by domain
- Contains: Main pages, tabs, sections, components
- Key files: Feature folders with page.tsx, components/, tabs/

**`src/pages/demos/`:**
- Purpose: Demo feature implementations
- Contains: Grid demos, form demos, delivery management
- Key files: `BakeryDemoTabs.tsx`, `grids/`, `forms/`, `delivery/`

**`src/utils/`:**
- Purpose: Shared utility functions
- Contains: Helper functions, formatters
- Key files: `index.ts`

## Key File Locations

**Entry Points:**
- `src/main.tsx`: Application bootstrap
- `src/App.tsx`: Root component with providers
- `src/_Main/index.jsx`: Router setup
- `index.html`: HTML template

**Configuration:**
- `src/pageConfig.tsx`: Routes, navigation, demo registry
- `vite.config.js`: Build config, path aliases
- `tsconfig.json`: TypeScript paths and settings
- `eslint.config.js`: Linting rules

**Core Logic:**
- `src/_Main/AuthenticatedRoute.jsx`: App shell with providers
- `src/components/shared/Theming/themeconfigs.ts`: Theme definitions
- `src/contexts/*.tsx`: Global state management

**Testing:**
- No test files detected in demo project

## Naming Conventions

**Files:**
- `ComponentName.tsx`: React components (PascalCase)
- `ComponentName.data.ts`: Static/mock data
- `ComponentName.types.ts` or `types.schema.ts`: Type definitions
- `useSomething.ts`: Custom hooks (camelCase with use prefix)
- `index.ts`: Barrel exports
- `*.module.css`: CSS modules
- `*.less`: Theme LESS files

**Directories:**
- `camelCase` or `PascalCase` for feature folders
- `lowercase` for utility folders (api/, hooks/, types/)
- Nested structure: `feature/components/`, `feature/tabs/`, `feature/sections/`

## Where to Add New Code

**New Feature Page:**
1. Create folder: `src/pages/FeatureName/`
2. Add main component: `src/pages/FeatureName/FeatureName.tsx`
3. Add to pageConfig.tsx: Import and add to demoRegistry or config
4. Add scope to AuthenticatedRoute.jsx scopes object

**New Demo (Grid/Form):**
1. Create component: `src/pages/demos/[grids|forms]/DemoName.tsx`
2. Add to demoRegistry in `src/pageConfig.tsx`
3. Add scope to `src/_Main/AuthenticatedRoute.jsx`

**New Feature with API:**
1. Create api folder: `src/pages/FeatureName/api/`
2. Add types: `api/types.schema.ts`
3. Add hooks: `api/useFeatureName.ts`
4. Import hooks in page component

**New Shared Component:**
1. Add to: `src/components/shared/ComponentName/`
2. Create: `ComponentName.tsx`
3. Optional: Add `index.ts` for clean exports

**New Context:**
1. Add to: `src/contexts/NewContext.tsx`
2. Export provider and hook
3. Wrap in `src/_Main/AuthenticatedRoute.jsx`

**Utilities:**
- Shared helpers: `src/utils/`
- Feature-specific: `src/pages/FeatureName/utils/`

## Special Directories

**`build/`:**
- Purpose: Vite production build output
- Generated: Yes
- Committed: No

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

**`docs/`:**
- Purpose: Feature documentation and wireframes
- Generated: No
- Committed: Yes

**`context/`:**
- Purpose: Claude AI context files
- Generated: No
- Committed: Yes

**`.planning/`:**
- Purpose: GSD planning and analysis documents
- Generated: Partially (by GSD tools)
- Committed: Depends on workflow

## Path Aliases

Configured in `vite.config.js` and `tsconfig.json`:

```typescript
@api/*       → src/api/*
@assets/*    → src/assets/*
@components/* → src/components/*
@constants/* → src/constants/*
@utils/*     → src/utils/*
@pages/*     → src/pages/*
@contexts/*  → src/contexts/*
@modules/*   → src/modules/*
@hooks/*     → src/hooks/*
```

**Usage Example:**
```typescript
import { useProductFormula } from '@contexts/ProductFormulaContext';
import { GraviGrid } from '@gravitate-js/excalibrr';
```

## Feature Structure Pattern

Complex features follow this organization:

```
FeatureName/
├── FeatureName.tsx          # Main page component
├── FeatureName.data.ts      # Mock/static data
├── FeatureName.types.ts     # TypeScript interfaces
├── api/
│   ├── types.schema.ts      # API types
│   └── useFeatureName.ts    # Query hooks
├── components/
│   └── SubComponent.tsx     # Feature-specific components
├── tabs/
│   ├── index.ts             # Barrel export
│   └── TabName.tsx          # Tab content
├── sections/
│   └── SectionName.tsx      # Page sections
└── docs/                    # Feature documentation
```

---

*Structure analysis: 2026-01-16*
