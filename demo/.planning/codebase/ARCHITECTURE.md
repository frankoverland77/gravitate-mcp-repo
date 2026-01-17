# Architecture

**Analysis Date:** 2026-01-16

## Pattern Overview

**Overall:** Component-Based Feature Architecture with Centralized Navigation

**Key Characteristics:**
- React SPA with client-side routing via react-router-dom
- Excalibrr component library as primary UI framework (wraps AG Grid, AntD)
- Centralized page/route configuration with permission-based navigation
- Context-based state management for cross-cutting concerns
- Theme system with lazy-loaded theme configurations

## Layers

**Entry Layer:**
- Purpose: Bootstrap application, set up providers
- Location: `src/main.tsx`, `src/App.tsx`
- Contains: React root, QueryClient setup, AG Grid license, theme wrapper
- Depends on: React, Tanstack Query, Excalibrr ThemeContextProvider
- Used by: Browser entry point

**Navigation/Shell Layer:**
- Purpose: App shell with authenticated routing and navigation
- Location: `src/_Main/`
- Contains: Router configuration, authenticated route wrapper, navigation context
- Depends on: `src/pageConfig.tsx`, Excalibrr NavigationContextProvider
- Used by: All page components

**Page Configuration Layer:**
- Purpose: Centralized route and navigation definitions
- Location: `src/pageConfig.tsx`
- Contains: Route registry, section definitions, permission helpers
- Depends on: Page components, ThemeRouteWrapper
- Used by: `src/_Main/index.jsx`, `src/_Main/AuthenticatedRoute.jsx`

**Page Layer:**
- Purpose: Top-level page components representing routes
- Location: `src/pages/`
- Contains: Feature pages, detail views, tab containers
- Depends on: Excalibrr components, contexts, shared components
- Used by: pageConfig.tsx route definitions

**Shared Components Layer:**
- Purpose: Reusable UI components and utilities
- Location: `src/components/shared/`
- Contains: Grid utilities, theming, navigation controls, modals
- Depends on: Excalibrr library, AG Grid
- Used by: Page components across features

**Context Layer:**
- Purpose: Global state management and cross-cutting concerns
- Location: `src/contexts/`
- Contains: Feature mode, formula state, product data contexts
- Depends on: React Context API
- Used by: Any component needing shared state

**API Layer:**
- Purpose: Data fetching and server communication patterns
- Location: `src/api/` (global), `src/pages/*/api/` (feature-specific)
- Contains: React Query hooks, type schemas, endpoint definitions
- Depends on: Tanstack Query, Excalibrr useApi hook
- Used by: Page and feature components

**Asset Layer:**
- Purpose: Static resources and brand assets
- Location: `src/assets/`
- Contains: Theme images, logos, icons, fonts
- Depends on: Vite asset handling
- Used by: Theming system, components

## Data Flow

**Page Load Flow:**

1. `main.tsx` renders App with QueryClientProvider
2. `App.tsx` wraps with ThemeContextProvider using lazy-loaded themes
3. `Main` component creates router with routes from demoRegistry
4. `AuthenticatedRoute` provides navigation context and global providers
5. Page component renders based on matched route

**Theme Management:**

1. Theme stored in localStorage as `TYPE_OF_THEME`
2. `ThemeRouteWrapper` enforces theme per route section
3. Theme change triggers page reload to apply new CSS variables
4. Lazy-loaded theme components in `src/components/shared/Theming/Themes/`

**State Management:**

- **Global State**: React Context for feature mode, formulas, products
- **Server State**: Tanstack Query with custom hooks per feature
- **Local State**: useState for component-level concerns
- **Persistence**: localStorage for theme, feature mode preferences

## Key Abstractions

**Page Configuration:**
- Purpose: Declarative route and navigation setup
- Examples: `src/pageConfig.tsx`
- Pattern: Config objects with hasPermission, routes, elements

**GraviGrid:**
- Purpose: Enterprise data grid with Excalibrr customizations
- Examples: `src/pages/demos/grids/ProductGrid/ProductGrid.tsx`, `src/components/shared/Grid/FormulaComponentsGrid.tsx`
- Pattern: Props-based configuration with columnDefs, agPropOverrides, controlBarProps

**Feature API Hooks:**
- Purpose: Encapsulated data fetching with mutations
- Examples: `src/pages/demos/DogGrooming/api/useDogGrooming.ts`
- Pattern: Custom hook returning query and mutation functions

**Theme Route Wrapper:**
- Purpose: Enforce specific theme for route sections
- Examples: `src/components/shared/ThemeRouteWrapper.tsx`
- Pattern: HOC that manages localStorage and triggers reload

## Entry Points

**Application Entry:**
- Location: `src/main.tsx`
- Triggers: Browser loads index.html
- Responsibilities: React root, QueryClient, AG Grid license

**App Component:**
- Location: `src/App.tsx`
- Triggers: main.tsx render
- Responsibilities: Theme context, query provider

**Router Entry:**
- Location: `src/_Main/index.jsx`
- Triggers: App renders Main
- Responsibilities: Route creation from registry, navigation

**Authenticated Shell:**
- Location: `src/_Main/AuthenticatedRoute.jsx`
- Triggers: Route match
- Responsibilities: Scope-based navigation, context providers

## Error Handling

**Strategy:** Defensive rendering with fallbacks

**Patterns:**
- Query errors via Tanstack Query onError callbacks
- NotificationMessage for user feedback on mutations
- Modal.confirm for destructive action confirmation
- Try-catch in formula calculations with fallback values

## Cross-Cutting Concerns

**Logging:** Console-based (no structured logging framework)

**Validation:** Form-level validation via Excalibrr form components

**Authentication:** Mocked via scopes object in AuthenticatedRoute (demo app)

**Theming:** CSS variables loaded per theme, managed via ThemeContextProvider

**Notifications:** Excalibrr NotificationMessage utility function

---

*Architecture analysis: 2026-01-16*
