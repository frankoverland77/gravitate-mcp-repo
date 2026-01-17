# Testing Patterns

**Analysis Date:** 2026-01-16

## Test Framework

**Runner:**
- Framework: None currently configured
- Config: No test configuration files found (`jest.config.*`, `vitest.config.*`)

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# No test scripts defined in package.json
# Tests are not currently implemented in this demo project
```

## Test File Organization

**Location:**
- No test files found (`*.test.*`, `*.spec.*`)
- Pattern expected (based on CLAUDE.md): Co-located with components as `*.test.tsx`

**Naming:**
- Expected pattern: `ComponentName.test.tsx`

**Structure:**
```
src/components/
├── MyComponent.tsx
└── MyComponent.test.tsx  # Expected location
```

## Test Structure

**Suite Organization:**
- Not implemented in this project
- Based on CLAUDE.md guidance, expected pattern:
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // ...
  });

  it('should handle user interaction', () => {
    // ...
  });
});
```

**Patterns:**
- Setup: Not documented
- Teardown: Not documented
- Assertion: Not documented

## Mocking

**Framework:** Not configured

**Patterns:**
- Not implemented
- API mocking would be needed for React Query hooks

**What to Mock:**
- API calls via `useApi` hook
- External services
- Browser APIs (localStorage, etc.)

**What NOT to Mock:**
- Component props
- User interactions
- State management within components

## Fixtures and Factories

**Test Data:**
- Mock data patterns exist in `.data.ts` files that could serve as test fixtures
- Example from `src/pages/demos/delivery/data/delivery.mock-data.ts`
- Data file pattern: `FeatureName.data.ts`

**Location:**
- Mock data co-located with features in `data/` or as `*.data.ts` files

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
# Not configured
```

## Test Types

**Unit Tests:**
- Not implemented
- Expected scope: Individual components and hooks

**Integration Tests:**
- Not implemented
- Expected scope: Feature workflows, form submissions

**E2E Tests:**
- Not used
- No Playwright/Cypress configuration

## Common Patterns

**Async Testing:**
- Not documented (no tests exist)
- Expected pattern with React Query:
```typescript
// Expected pattern for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

**Error Testing:**
- Not documented (no tests exist)
- Expected pattern:
```typescript
// Expected pattern for error states
it('should show error notification on failure', async () => {
  // Mock API to return error
  // Trigger action
  // Assert error notification shown
});
```

## Quality Enforcement (Alternative to Tests)

**Pre-commit Hooks:**
- Tool: Husky + lint-staged
- Config in `package.json`:
```json
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "src/**/*.{css,json,md}": [
    "prettier --write"
  ]
}
```

**Type Checking:**
```bash
yarn type-check  # tsc --noEmit
```

**Quality Check Command:**
```bash
yarn quality:check  # type-check && lint && format:check
```

**Page Registration Check:**
```bash
yarn check:pages  # Validates page registration in pageConfig
```

## MCP Server Validation

The MCP server provides code validation tools as an alternative to automated tests:

**validate_code Tool:**
- Validates code against conventions
- Checks for common mistakes
- Run before presenting code to users

**Pre-commit Workflow:**
```bash
git add <files>
git hook run pre-commit  # Runs ESLint and Prettier
```

## Recommendations for Future Testing

**Framework Setup:**
1. Install Vitest (recommended for Vite projects):
   ```bash
   yarn add -D vitest @testing-library/react @testing-library/jest-dom
   ```

2. Add vitest.config.ts:
   ```typescript
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: './src/test/setup.ts',
     },
   });
   ```

3. Add test scripts to package.json:
   ```json
   "test": "vitest",
   "test:coverage": "vitest --coverage"
   ```

**Priority Areas for Testing:**
1. Custom hooks (e.g., `useTemplateFilters`, `useDogGrooming`)
2. Utility functions (e.g., `toAntOption` in `src/utils/index.ts`)
3. Context providers (e.g., `FeatureModeContext`)
4. Form validation logic
5. Grid column definitions and value formatters

---

*Testing analysis: 2026-01-16*
