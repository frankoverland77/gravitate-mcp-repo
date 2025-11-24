# Code Quality Enforcement Guide

This document explains the automated code quality tools that have been implemented to prevent common issues like the 1049-line TemplateChooser component.

## 🎯 Goals

Prevent:
- ❌ Files exceeding 400 lines
- ❌ Excessive inline styles (>10 per file)
- ❌ Use of `any` types in TypeScript
- ❌ Complex functions (cyclomatic complexity >15)
- ❌ Inconsistent code formatting

## 🛠️ Tools Installed

### 1. ESLint - Code Quality Linting

**Configuration**: `.eslintrc.js`

**Key Rules**:
- `max-lines: 400` - Blocks files over 400 lines
- `react/forbid-dom-props: ['error', { forbid: ['style'] }]` - Blocks inline styles
- `@typescript-eslint/no-explicit-any: 'error'` - Blocks `any` types
- `complexity: 15` - Limits function complexity

**Usage**:
```bash
cd demo

# Check for errors
yarn lint

# Auto-fix fixable issues
yarn lint:fix
```

### 2. Prettier - Code Formatting

**Configuration**: `.prettierrc`

**Settings**:
- Single quotes for JS/TS
- 2-space indentation
- 100 character line width
- Trailing commas (ES5)

**Usage**:
```bash
cd demo

# Format all files
yarn format

# Check formatting without changes
yarn format:check
```

### 3. TypeScript Strict Mode

**Configuration**: `tsconfig.json`

**Enabled Options**:
- `noImplicitAny: true` - No implicit any types
- `noUnusedLocals: true` - Report unused variables
- `noUnusedParameters: true` - Report unused parameters
- `noImplicitReturns: true` - Ensure consistent returns
- `noFallthroughCasesInSwitch: true` - Prevent switch fallthrough

**Usage**:
```bash
cd demo

# Type check without emitting files
yarn type-check
```

### 4. Combined Quality Check

**Usage**:
```bash
cd demo

# Run all checks at once
yarn quality:check
```

This runs: type-check → lint → format:check

## 📋 Installation Instructions

### Prerequisites
- Node.js 18+
- Yarn

### Step 1: Install Dependencies

```bash
cd demo

# Install ESLint and plugins
yarn add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react eslint-plugin-react-hooks

# Install Prettier
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

### Step 2: VS Code Setup (Recommended)

1. **Install Recommended Extensions**:
   - Open VS Code in this workspace
   - When prompted, install recommended extensions
   - Or manually: `Cmd+Shift+P` → "Extensions: Show Recommended Extensions"

2. **Required Extensions**:
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)

3. **Enable Format on Save**:
   - Already configured in `.vscode/settings.json`
   - Saves with auto-format and ESLint fixes

## 🚀 Daily Workflow

### Before Committing

1. **Check your code**:
   ```bash
   yarn quality:check
   ```

2. **Fix auto-fixable issues**:
   ```bash
   yarn lint:fix
   yarn format
   ```

3. **Manually fix remaining issues**
4. **Commit your changes**

### During Development

Your IDE will show:
- 🔴 **Red underlines**: ESLint errors (must fix)
- 🟡 **Yellow underlines**: ESLint warnings (should fix)
- **Blue underlines**: TypeScript errors (must fix)

## ❌ Common Violations and Fixes

### Violation 1: File Too Large (>400 lines)

**Error**: `File has too many lines (450). Maximum allowed is 400`

**Fix**: Refactor into multiple files
```
MyComponent/
├── index.tsx              # Main component (<200 lines)
├── types.ts              # Type definitions
├── styles.css            # Styles
├── components/           # Sub-components
│   ├── Header.tsx
│   └── Footer.tsx
└── hooks/                # Custom hooks
    └── useMyData.ts
```

### Violation 2: Inline Styles

**Error**: `Using the prop 'style' is forbidden`

**Bad**:
```tsx
<div style={{ padding: '20px', color: 'red' }}>
```

**Good**:
```tsx
// Use CSS classes
<div className="p-5 text-red-500">

// Or extract to styles.css
<div className="my-component-container">
```

### Violation 3: Any Type

**Error**: `Unexpected any. Specify a different type`

**Bad**:
```tsx
function MyComponent({ data }: { data: any }) {
```

**Good**:
```tsx
interface MyData {
  id: string;
  name: string;
}

function MyComponent({ data }: { data: MyData }) {
```

### Violation 4: Complex Function

**Error**: `Function has a complexity of 18. Maximum allowed is 15`

**Fix**: Break into smaller functions
```tsx
// Bad: One giant function
function processData(data) {
  // 100 lines of complex logic
}

// Good: Broken down
function processData(data) {
  const validated = validateData(data);
  const transformed = transformData(validated);
  return enrichData(transformed);
}

function validateData(data) { /* ... */ }
function transformData(data) { /* ... */ }
function enrichData(data) { /* ... */ }
```

## 📊 Measuring Quality

### Run Analysis

```bash
# Check file sizes
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | awk '$1 > 400 && NF > 1 { print }'

# Check inline styles
find src -name "*.tsx" | while read file; do
  count=$(grep -c 'style={{' "$file" || true)
  if [ "$count" -gt 10 ]; then
    echo "$file: $count inline styles"
  fi
done

# Check any usage
grep -r ":\s*any\b" src --include="*.ts" --include="*.tsx"
```

### Quality Metrics

**Target Goals**:
- Average file size: < 250 lines
- Inline styles per file: < 5
- `any` type usage: 0
- ESLint errors: 0
- TypeScript errors: 0

## 🔧 Troubleshooting

### ESLint not running in VS Code

1. Check ESLint extension is installed
2. Check `.eslintrc.js` exists in `demo/`
3. Reload VS Code: `Cmd+Shift+P` → "Reload Window"
4. Check output: VS Code → Output → ESLint

### Prettier not formatting on save

1. Check Prettier extension is installed
2. Check `.prettierrc` exists in `demo/`
3. Verify settings: `.vscode/settings.json` has `"editor.formatOnSave": true`
4. Set Prettier as default formatter: Right-click file → "Format Document With..." → "Prettier"

### TypeScript errors but code works

1. Your code may rely on implicit `any` types
2. Add explicit types to fix:
   ```tsx
   // Before
   function getData() { return fetch(...) }

   // After
   function getData(): Promise<Response> { return fetch(...) }
   ```

### Too many errors to fix at once

1. Create `.eslintignore`:
   ```
   # Legacy files to fix gradually
   src/legacy/
   src/old-components/
   ```

2. Fix new files first, gradually refactor old ones

## 📚 Additional Resources

- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [React Best Practices](https://react.dev/learn)

## 🆘 Getting Help

1. **Check this document** - Common issues above
2. **Ask the team** - Someone may have solved it
3. **Google the error** - ESLint/TypeScript errors are well-documented
4. **Open an issue** - If tools are misconfigured

---

**Remember**: These tools are here to help you write better code faster. They catch issues early before they become bugs!
