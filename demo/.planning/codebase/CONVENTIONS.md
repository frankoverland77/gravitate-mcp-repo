# Coding Conventions

**Analysis Date:** 2026-01-16

## Naming Patterns

**Files:**
- Component files: `PascalCase.tsx` (e.g., `DogGroomingPage.tsx`, `CustomerForm.tsx`)
- Data files: `ComponentName.data.ts` (e.g., `FormulaTemplates.data.ts`)
- Type files: `types.schema.ts` or `ComponentName.types.ts`
- Hook files: `useFeatureName.ts` (e.g., `useDogGrooming.ts`, `useTemplateFilters.ts`)
- Context files: `FeatureContext.tsx` (e.g., `FeatureModeContext.tsx`)
- Style files: kebab-case for CSS (e.g., `dragdrop.css`), PascalCase.module.css for modules

**Functions:**
- Components: PascalCase named exports (e.g., `export function DogGroomingPage()`)
- Hooks: `useFeatureName` pattern (e.g., `useFeatureMode`, `useTemplateFilters`)
- Event handlers: `handleAction` pattern (e.g., `handleDelete`, `handleOpenDrawer`)
- Callbacks: `onAction` pattern for props (e.g., `onTemplateSelect`, `onClose`)

**Variables:**
- State: descriptive camelCase (e.g., `isModalOpen`, `editingTemplateId`)
- Boolean state: `is/has/show` prefix (e.g., `isLoading`, `hasPlaceholders`, `showFilterDropdown`)
- Refs: `nameRef` pattern (e.g., `gridAPIRef`, `cardsScrollRef`)
- Constants: SCREAMING_SNAKE_CASE for values (e.g., `PLACEHOLDER_VALUES`)

**Types/Interfaces:**
- Interfaces: PascalCase with descriptive suffix (e.g., `TemplateChooserProps`, `DogGroomingData`)
- Type aliases: PascalCase (e.g., `FeatureMode`, `TemplateViewMode`)
- API response types: `FeatureAPIResponse` pattern

## Code Style

**Formatting:**
- Tool: Prettier
- Config location: `.prettierrc`
- Key settings:
  - Single quotes for strings: `'value'`
  - Double quotes for JSX attributes: `prop="value"`
  - Semicolons: enabled
  - Tab width: 2 spaces
  - Print width: 100 characters
  - Trailing commas: ES5 style
  - Bracket spacing: enabled

**Linting:**
- Tool: ESLint (flat config)
- Config location: `eslint.config.js`
- Key rules enforced:
  - `max-lines`: 500 lines per file (error)
  - `max-lines-per-function`: 200 lines (error)
  - `complexity`: max 15 (error)
  - `max-depth`: 4 levels (error)
  - `@typescript-eslint/no-explicit-any`: error
  - `unused-imports/no-unused-imports`: error (auto-fixes)
  - `no-console`: warn (allow `console.warn`, `console.error`)
  - `react-hooks/rules-of-hooks`: error
  - `react-hooks/exhaustive-deps`: warn
  - `react/forbid-dom-props`: warn on `style` prop (prefer utility classes)

**Style Linting:**
- Tool: Stylelint
- Config location: `.stylelintrc.json`
- Class naming: kebab-case only (`selector-class-pattern: ^[a-z][a-z0-9]*(-[a-z0-9]+)*$`)
- No BEM naming (no `__` or `--` in class names)

## Import Organization

**Order:**
1. React imports (`import React, { useState, useEffect } from 'react'`)
2. External libraries (`import { Modal } from 'antd'`, `import { useNavigate } from 'react-router-dom'`)
3. Excalibrr components (`import { GraviButton, GraviGrid, Vertical } from '@gravitate-js/excalibrr'`)
4. Ant Design icons (`import { PlusOutlined, EditOutlined } from '@ant-design/icons'`)
5. Local path aliases (`import { useDogGrooming } from './api/useDogGrooming'`)
6. Relative imports (`import { DogGroomingColumnDefs } from './components/DogGroomingColumnDefs'`)

**Path Aliases:**
- `@api/*` → `./src/api/*`
- `@assets/*` → `./src/assets/*`
- `@components/*` → `./src/components/*`
- `@constants/*` → `./src/constants/*`
- `@utils/*` → `./src/utils/*`
- `@pages/*` → `./src/pages/*`
- `@contexts/*` → `./src/contexts/*`
- `@modules/*` → `./src/modules/*`
- `@hooks/*` → `./src/hooks/*`

## Error Handling

**Patterns:**
- React Query mutations handle success/error via `onSuccess`/`onError` callbacks
- User feedback via `NotificationMessage` from Excalibrr:
  ```typescript
  // Success
  NotificationMessage('Success.', 'Created successfully', false);
  // Error
  NotificationMessage('Error.', 'Failed to create', true);
  ```
- Form validation errors collected in array and displayed via Ant Design `Alert`:
  ```typescript
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  ```
- Modal.confirm for destructive actions (delete confirmations)

**API Error Pattern:**
```typescript
const useCreateMutation = () =>
  useMutation((request: CreateRequest) => api.post(endpoint, request), {
    onSuccess: () => {
      NotificationMessage('Success.', 'Created successfully', false);
      queryClient.invalidateQueries([endpoints.read]);
    },
    onError: () => {
      NotificationMessage('Error.', 'Failed to create', true);
    },
  });
```

## Logging

**Framework:** Native `console` (restricted by ESLint)

**Patterns:**
- Use `console.warn` for non-critical warnings
- Use `console.error` for actual errors
- Debug logging via `console.log` with descriptive prefixes (will show lint warnings):
  ```typescript
  console.log('=== EDIT BUTTON CLICKED ===');
  console.log('Template ID:', templateId);
  ```

## Comments

**When to Comment:**
- Complex business logic
- Non-obvious workarounds
- TODO/FIXME markers for incomplete features
- JSDoc for exported interfaces and hooks

**JSDoc/TSDoc:**
- Used for hooks and utility functions:
  ```typescript
  /**
   * Manages filter state and provides filter manipulation functions
   *
   * @param defaultFilters - Initial filters to apply on mount
   * @returns Object with filter state and manipulation functions
   */
  export function useTemplateFilters(defaultFilters: FilterStateMap = {}): UseTemplateFiltersReturn
  ```
- Interface properties documented inline:
  ```typescript
  export interface TemplateChooserProps {
    /** Array of templates to display */
    templates: Template[];
    /** Callback when a template is selected */
    onTemplateSelect: (template: Template) => void;
  }
  ```

## Function Design

**Size:**
- Max 200 lines per function (enforced by ESLint)
- Max 500 lines per file (enforced by ESLint)

**Parameters:**
- Max 5 parameters (enforced by ESLint)
- Prefer object destructuring for multiple optional params:
  ```typescript
  function TemplateChooser({
    templates,
    onTemplateSelect,
    showManageButton = false,
    title = 'Default Title',
  }: TemplateChooserProps)
  ```

**Return Values:**
- Hooks return typed objects
- Components return JSX
- Utility functions return strongly typed values

## Module Design

**Exports:**
- Named exports for components: `export function ComponentName()`
- Named exports for hooks: `export function useHookName()`
- NO default exports

**Barrel Files:**
- Use `index.ts` for grouping related exports:
  ```typescript
  // src/components/shared/SaveTemplateModal/index.ts
  export { SaveTemplateModal } from './SaveTemplateModal';
  ```

## Component Patterns

**Excalibrr Components (Prefer over native HTML):**
```typescript
// Layout
<Vertical flex="1">     // NOT <div style={{display:'flex',flexDirection:'column',flex:1}}>
<Horizontal justifyContent="space-between">  // NOT <div style={{display:'flex'}}>

// Typography
<Texto category="h4" weight="600">Title</Texto>  // NOT <h4>Title</h4>

// Buttons
<GraviButton buttonText="Save" success onClick={handleSave} />  // NOT <button>

// Grids
<GraviGrid
  columnDefs={columnDefs}
  rowData={data}
  agPropOverrides={{}}  // REQUIRED
  storageKey="UniqueKey"
/>
```

**Ant Design Components:**
- Modals/Drawers use `visible` prop (not `open`)
- Forms via `Form.useForm()` pattern
- Select/Input from antd for form fields

**Props Patterns:**
- Boolean props use shorthand when true: `<GraviButton success />` not `<GraviButton success={true} />`
- Style theming via props when available: `<Texto appearance="medium" />` for gray text

---

*Convention analysis: 2026-01-16*
