# Excalibrr MCP Server - Improvements Branch Summary

## Overview

This document summarizes all improvements made to the Excalibrr MCP server on the `improvements` branch. The goal was to make Claude more effective at generating correct Excalibrr code by improving validation, adding workflow tools, and automating repetitive tasks.

---

## 🎯 Problem Statement

Claude was generating code with common mistakes because:
1. **Skipped tool usage** - Didn't call `get_component` or `validate_code` before presenting
2. **Validation gaps** - Existing rules didn't catch important patterns (e.g., `style={{ flex: 1 }}` when a `flex` prop exists)
3. **No workflow enforcement** - No structured process to ensure quality before output
4. **Manual configuration** - Creating demos required manual navigation config updates

---

## 🛠️ New Tools Created

### 1. `preflight` Tool
**Purpose:** Single call to get everything needed before code generation

**What it does:**
- Accepts a task description (e.g., "build a form modal")
- Auto-detects which components are needed
- Returns condensed conventions + component APIs in one bundle

**Usage:**
```javascript
preflight({ task: "create a grid with edit drawer" })
// Returns: conventions + APIs for GraviGrid, Modal, Vertical, Horizontal, Texto, GraviButton
```

**File:** `mcp-server/src/tools/preflight.ts`

---

### 2. `register_demo` Tool
**Purpose:** Automatically register new demos in the navigation system

**What it does:**
- Adds import statement to `pageConfig.tsx`
- Adds entry to `demoRegistry` array
- Adds scope to `AuthenticatedRoute.jsx`

**Usage:**
```javascript
register_demo({
  name: "CustomerList",
  title: "Customer List",
  description: "Customer grid with edit modal",
  category: "grids",
  componentPath: "./pages/demos/CustomerList"
})
```

**File:** `mcp-server/src/tools/registerDemo.ts`

---

## ✅ Validation Rules Added

New rules added to `mcp-server/src/utils/conventions.ts`:

| Rule ID | Severity | What It Catches |
|---------|----------|-----------------|
| `use-flex-prop-not-style` | error | `<Vertical style={{ flex: 1 }}>` → should use `flex="1"` prop |
| `use-gap-utility-class` | warning | `style={{ gap: '12px' }}` → should use `className="gap-12"` |
| `modal-drawer-visible-not-open` | error | `<Modal open={...}>` or `<Drawer open={...}>` → should use `visible` |
| `no-horizontal-gap-prop` | error | `<Horizontal gap={12}>` → gap prop doesn't exist |
| `prefer-component-props-for-alignment` | warning | `style={{ justifyContent }}` on Horizontal/Vertical |

---

## 🔧 Bug Fixes

### 1. BEM False Positive Fix
**Problem:** String placeholder `"__STRING__"` triggered the BEM rule (no double underscores)

**Solution:** Changed placeholder from `"__STRING__"` to `"STRLIT"` in `stripStringLiterals()` function

### 2. Component Prop Documentation Fix
**Problem:** Documentation referenced non-existent `fullHeight` prop

**Solution:** Updated Vertical and Horizontal component docs to use actual `height` prop

### 3. register_demo Formatting Fix
**Problem:** Initial regex-based scope insertion produced malformed code

**Solution:** Rewrote `addScope()` function with proper brace counting for clean formatting

---

## 📚 Documentation Updates

### CLAUDE.md (Skill File)
Complete rewrite with:

1. **Mandatory Workflow Section** (top of file)
   - Step 1: Call `preflight`
   - Step 2: Generate code
   - Step 3: Call `validate_code`
   - Step 4: Fix errors
   - Step 5: Call `register_demo`

2. **Common Mistakes Table**
   | Mistake | Fix |
   |---------|-----|
   | `<Vertical style={{ flex: 1 }}>` | `<Vertical flex="1">` |
   | `<Horizontal gap={12}>` | `<Horizontal className="gap-12">` |
   | `<Modal open={isOpen}>` | `<Modal visible={isOpen}>` |
   | `<GraviButton theme="success">` | `<GraviButton success>` |
   | `<Texto appearance="secondary">` for gray | `<Texto appearance="medium">` |

3. **MCP Tools Quick Reference**
   - Categorized tool list
   - Usage guidance
   - Complete workflow example

### Component Registry Updates
- `Vertical.ts` - Fixed `fullHeight` → `height` prop
- `Horizontal.ts` - Fixed `fullHeight` → `height` prop

---

## 📁 Files Changed/Created

### New Files
```
mcp-server/src/tools/preflight.ts          # New preflight tool
mcp-server/src/tools/registerDemo.ts       # New register_demo tool
tests/validation/AntiPatternTestFile.tsx   # Test file for validation
tests/validation/EXPECTED_RESULTS.md       # Expected validation results
```

### Modified Files
```
mcp-server/src/index.ts                    # Registered new tools
mcp-server/src/utils/conventions.ts        # Added validation rules, fixed BEM
mcp-server/src/tools/getConventions.ts     # Updated quick reference
mcp-server/src/registry/components/Vertical.ts    # Fixed prop docs
mcp-server/src/registry/components/Horizontal.ts  # Fixed prop docs
CLAUDE.md                                  # Complete rewrite
demo/src/pageConfig.tsx                    # Added test demos
demo/src/_Main/AuthenticatedRoute.jsx      # Added test demo scopes
```

### Demo Files Created (for testing)
```
demo/src/pages/demos/ScheduleDemo.tsx      # Grid + drawer test
demo/src/pages/demos/CustomerList.tsx      # Grid + modal test
demo/src/pages/demos/InventoryGrid.tsx     # Simple grid test
```

---

## 🔄 Complete Workflow (Before vs After)

### Before (Error-Prone)
```
1. User asks for demo
2. Claude generates code (often with mistakes)
3. User finds bugs
4. Manual iteration to fix
5. User manually configures navigation
```

### After (Automated Quality)
```
1. User asks for demo
2. Claude calls preflight() → gets conventions + APIs
3. Claude generates code following conventions
4. Claude calls validate_code() → catches errors
5. Claude fixes any issues
6. Claude calls register_demo() → auto-configures navigation
7. User gets working demo in sidebar
```

---

## 📊 Validation Coverage

### What Gets Caught Now

| Pattern | Rule | Status |
|---------|------|--------|
| `<div style={{ display: 'flex' }}>` | no-raw-div-flex | ✅ |
| `<Vertical style={{ flex: 1 }}>` | use-flex-prop-not-style | ✅ |
| `<Horizontal gap={12}>` | no-horizontal-gap-prop | ✅ |
| `style={{ gap: '12px' }}` | use-gap-utility-class | ✅ |
| `<Modal open={...}>` | modal-drawer-visible-not-open | ✅ |
| `<Drawer open={...}>` | modal-drawer-visible-not-open | ✅ |
| `<GraviButton theme="success">` | gravi-button-no-theme-string | ✅ |
| `<GraviButton htmlType="submit">` | gravi-button-no-htmltype | ✅ |
| `<Texto appearance="secondary">` | texto-secondary-not-gray | ✅ |
| `<button>`, `<p>`, `<h1>` | no-raw-* rules | ✅ |

### Known False Positives (Low Priority)
- `named-exports` rule flags arrow function handlers (not components)
- `no-raw-text-elements` occasionally triggers incorrectly

---

## 🚀 Designer Experience

**Before:** "Create a grid" → code with bugs, no navigation, manual fixes

**After:** "Create a grid" → working demo appears in Bakery → [Demo Name] sidebar

The designer never needs to:
- Know about pageConfig.tsx
- Know about AuthenticatedRoute.jsx scopes
- Manually configure navigation
- Debug common prop mistakes

---

## 📋 Summary Statistics

| Metric | Count |
|--------|-------|
| New tools created | 2 |
| Validation rules added | 5 |
| Bug fixes | 3 |
| Files modified | 10 |
| Files created | 6 |

---

## 🔮 Future Improvements (Not Implemented)

1. **Fix remaining false positives** in named-exports and no-raw-text-elements rules
2. **Add `check_before_present` gating tool** - block output until validation passes
3. **Component prop registry for validation** - validate props against actual component APIs
4. **Auto-fix tool** - automatically apply fixes for auto-fixable issues
