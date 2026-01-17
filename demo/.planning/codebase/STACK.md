# Technology Stack

**Analysis Date:** 2026-01-16

## Languages

**Primary:**
- TypeScript 5.x - All source code in `src/`
- TSX - React components with TypeScript

**Secondary:**
- JavaScript (JSX) - Legacy files in `src/_Main/AuthenticatedRoute.jsx`, `src/_Main/index.jsx`
- Less - Stylesheets with CSS preprocessing
- CSS - Global styles and utility classes

## Runtime

**Environment:**
- Node.js (version not locked - no `.nvmrc`)
- Browser runtime (React SPA)

**Package Manager:**
- Yarn (primary)
- npm compatibility via `.npmrc`
- Lockfile: Not present in repository

## Frameworks

**Core:**
- React 18.2.0 - UI framework
- Vite 5.x - Build tool and dev server
- React Router DOM 6.16.0 - Client-side routing

**Data Management:**
- TanStack React Query 4.10.3 - Server state management

**Grid/Tables:**
- AG Grid Community 30.2.1 - Data grid foundation
- AG Grid Enterprise 30.2.1 - Advanced grid features (licensed)
- AG Grid React 30.2.1 - React bindings

**UI Components:**
- @gravitate-js/excalibrr 4.0.34-osp - Internal component library (primary)
- Ant Design 4.20 - Base UI components

**Charting/Visualization:**
- @nivo/bar 0.79.1, @nivo/line 0.79.1, @nivo/scatterplot 0.99.0 - Data visualization
- Recharts 3.5.1 - Additional charting
- Leaflet 1.9.4 + react-leaflet 4.0.0 - Map visualization
- leaflet.markercluster 1.5.3 - Map clustering

**Animation:**
- react-lottie 1.2.10 - Lottie animations

**Date/Time:**
- moment 2.24.0 - Date manipulation (legacy)
- date-fns 4.1.0 - Modern date utilities

**Build/Dev:**
- Vite 5.x - Bundler and dev server
- TypeScript 5.x - Type checking
- @vitejs/plugin-react 4.x - React support for Vite
- vite-tsconfig-paths 4.x - Path alias support
- vite-plugin-svgr 4.5.0 - SVG as React components

## Key Dependencies

**Critical:**
- `@gravitate-js/excalibrr@4.0.34-osp` - Core component library providing GraviGrid, Texto, GraviButton, Horizontal, Vertical, etc.
- `ag-grid-enterprise@30.2.1` - Enterprise grid features (requires license key)
- `react@18.2.0` - Core React framework

**Infrastructure:**
- `@tanstack/react-query@4.10.3` - Data fetching and caching
- `react-router-dom@6.16.0` - Navigation and routing
- `antd@4.20` - Form controls and UI primitives

**Dev Tools:**
- `eslint@9.39.1` - Code linting
- `prettier@3.6.2` - Code formatting
- `stylelint@16.26.0` - CSS/Less linting
- `typescript@5.x` - Type checking
- `husky@9.1.7` - Git hooks
- `lint-staged@16.2.7` - Pre-commit linting

## Configuration

**Environment:**
- Environment variables via Vite's `import.meta.env`
- `.env.local` for local development (gitignored)
- `.env.example` documents required variables
- Key variable: `VITE_AG_GRID_LICENSE_KEY` - AG Grid Enterprise license

**Build:**
- `vite.config.js` - Vite configuration with path aliases
- `tsconfig.json` - TypeScript with strict mode, path aliases
- `eslint.config.js` - ESLint flat config with TypeScript, React, Prettier
- `.prettierrc` - Prettier formatting rules
- `.stylelintrc.json` - Stylelint for Less files

**Path Aliases (configured in both tsconfig.json and vite.config.js):**
```
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

## Platform Requirements

**Development:**
- Node.js (LTS recommended)
- Yarn package manager
- NPM_TOKEN for private `@gravitate-js/excalibrr` package
- AG Grid license key for enterprise features

**Production:**
- Vercel (configured via `vercel.json`)
- Static SPA with client-side routing
- Asset caching enabled (1 year for `/assets/*`)

## Linting & Formatting

**ESLint Configuration (`eslint.config.js`):**
- File size limits: max 500 lines per file, 200 lines per function
- Complexity limits: max 15 cyclomatic complexity, max 4 nesting depth
- TypeScript: no `any` types, no unused imports/vars
- React: hooks rules enforced, inline styles warned
- Prettier integration for formatting conflicts

**Prettier Configuration (`.prettierrc`):**
- Single quotes for JS/TS
- Double quotes for JSX
- Semicolons enabled
- 2-space indentation
- 100 character line width
- ES5 trailing commas

**Stylelint Configuration (`.stylelintrc.json`):**
- Kebab-case class names enforced
- PostCSS Less syntax support
- Theming directory ignored

## Pre-commit Hooks

**Husky + lint-staged:**
- TypeScript/TSX files: ESLint fix + Prettier
- CSS/JSON/MD files: Prettier only

---

*Stack analysis: 2026-01-16*
