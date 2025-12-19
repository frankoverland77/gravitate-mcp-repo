# The Anatomy of a Feature

This document describes our standard frontend feature folder structure for React projects.

## Folder Layout

```
modules/
└── {Category}/
    └── {FeatureName}/
        ├── api/
        │   ├── use{FeatureName}.ts      # API hooks
        │   └── types.schema.ts          # API types & schemas
        ├── components/
        │   ├── ComponentA/
        │   │   └── ComponentA.tsx       # Component in its own folder
        │   ├── ComponentB.tsx           # Component as a single file
        │   └── Grid/
        │       ├── ActionButtons.tsx    # Grid control bar actions
        │       ├── Columns/
        │       │   └── columnDefs.tsx   # Column definitions
        │       ├── GridEvents.ts        # Grid event handlers
        │       └── {FeatureName}Grid.tsx # Grid rendering logic
        ├── styles.css                   # Styles for the feature
        ├── {FeatureName}Page.tsx        # Main feature component
        └── utils/
            ├── Constants.ts             # Constants & Config
            └── Utils.ts                 # Utility functions
```

## Guiding Principles

1. **Keep API (data) peeled away from UI (components)**
2. **Favor small, composable pieces with clear names**
3. **Co-locate everything inside the feature folder**

---

## Folder Descriptions

### `modules/`

Monorepo root bucket for all app modules. Each product area becomes a Category folder under `modules/`.

### `{Category}/`

Logical area (e.g., `Contracts`, `Market`, `Billing`). Group related features here. Keep category spelling consistent across the app.

### `{FeatureName}/`

Self-contained feature boundary (UI + data + helpers). One feature per folder. Keep everything feature-scoped here.

---

## API Layer

### `api/`

Data layer for the feature. Hooks and types only—no UI. Keep API concerns isolated. No DOM or component imports.

### `use{FeatureName}.ts`

React hook(s) for fetching/mutating this feature's data.

**Naming conventions:**
- `useThing` - fetch single item
- `useThingList` - fetch collection
- `useCreateThing` - create mutation
- `useUpdateThing` - update mutation
- `useDeleteThing` - delete mutation

**Guidelines:**
- Prefer React Query patterns
- Co-locate query keys
- Return typed data + status

```typescript
// Example
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Thing } from "./types.schema";

export function useThings() {
  return useQuery({ queryKey: ["things"], queryFn: fetchThings });
}

export function useCreateThing() {
  return useMutation({ mutationFn: createThing });
}
```

### `types.schema.ts`

Types for requests/responses, schemas, enums. Export types used in `use{FeatureName}.ts` and components.

```typescript
// Example
export type Thing = { id: string; name: string; active: boolean };
export type CreateThingInput = Pick<Thing, "name" | "active">;
```

---

## Components Layer

### `components/`

Feature-only UI components. Keep presentational + small state. No cross-feature imports.

### `ComponentA/` (folder)

Use when a component needs its own folder (extra files/tests/styles) or has subparts/grows complex.

### `ComponentA.tsx`

The component implementation. Export default; keep props typed.

```typescript
// Example
type Props = { title: string };

export default function ComponentA({ title }: Props) {
  return <div>{title}</div>;
}
```

---

## Grid Structure

For features with data grids, use this structure:

```
components/
└── Grid/
    ├── ActionButtons.tsx       # Control bar actions
    ├── Columns/
    │   └── columnDefs.tsx      # Column definitions
    ├── GridEvents.ts           # Event handlers (onRowSelected, etc.)
    └── {FeatureName}Grid.tsx   # Grid component
```

---

## File Extensions

Every new file that includes JavaScript code should use the `.ts` extension (or `.tsx` for files including JSX). This is required as part of our broader initiative to reach 100% TypeScript coverage on the frontend.

---

## Quick Reference

| What | Where | Naming |
|------|-------|--------|
| Page component | `{Feature}/` | `{FeatureName}Page.tsx` |
| API hooks | `{Feature}/api/` | `use{FeatureName}.ts` |
| Types/schemas | `{Feature}/api/` | `types.schema.ts` |
| UI components | `{Feature}/components/` | `{ComponentName}.tsx` |
| Grid columns | `{Feature}/components/Grid/Columns/` | `columnDefs.tsx` |
| Feature styles | `{Feature}/` | `styles.css` |
| Utilities | `{Feature}/utils/` | `Utils.ts`, `Constants.ts` |
