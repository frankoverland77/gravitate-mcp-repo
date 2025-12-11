# Validation Test: Expected Results

## Test File: `AntiPatternTestFile.tsx`

After rebuilding the MCP server, run:
```
validate_code on AntiPatternTestFile.tsx
```

## Expected Errors (Must be caught)

| Line | Rule ID | Issue |
|------|---------|-------|
| ~25 | `use-flex-prop-not-style` | `<Vertical style={{ flex: 1 }}>` |
| ~30 | `use-flex-prop-not-style` | `<Horizontal style={{ flex: '1 0 auto' }}>` |
| ~42 | `modal-drawer-visible-not-open` | `<Modal open={isModalOpen}>` |
| ~48 | `modal-drawer-visible-not-open` | `<Drawer open={isDrawerOpen}>` |
| ~54 | `no-horizontal-gap-prop` | `<Horizontal gap={12}>` |

**Total Expected Errors: 5**

## Expected Warnings (Should be caught)

| Line | Rule ID | Issue |
|------|---------|-------|
| ~68 | `use-gap-utility-class` | `style={{ gap: '12px' }}` |
| ~74 | `use-gap-utility-class` | `style={{ gap: '8px' }}` |
| ~84 | `prefer-component-props-for-alignment` | `style={{ justifyContent: 'space-between' }}` |
| ~90 | `prefer-component-props-for-alignment` | `style={{ alignItems: 'center' }}` |
| ~96 | `gravigrid-agpropoverrides` | Missing `agPropOverrides` |

**Total Expected Warnings: ~6** (gap utility may match multiple times)

## Should NOT Trigger (False Positives)

The following should NOT be flagged:

1. **CorrectComponent** (lines ~107-152) - Uses all correct patterns
2. **FalsePositiveTest** (lines ~160-172) - Contains HTML-like content inside strings:
   - Template literal: `` `...delete this <span>item</span>?` ``
   - String: `"Use <p> tags for paragraphs"`
   - Template literal: `` `The <h1> element...` ``
3. **Comments** - BEM-like patterns in comments (e.g., `// card__header--active`) should NOT trigger

These string contents should be stripped before pattern matching and NOT flagged as "raw HTML elements".

## How to Run the Test

### Option 1: Using MCP tool (after rebuild)
```
excalibrr:validate_code with filePath: "path/to/AntiPatternTestFile.tsx"
```

### Option 2: Manual verification
1. Rebuild the MCP server:
   ```bash
   cd /Users/rebecca/repos/excalibrr-mcp-server/mcp-server
   npm run build
   ```

2. Restart Claude Desktop

3. Ask Claude to validate the test file

## Pass Criteria

✅ **PASS** if:
- All 5 errors are caught
- All warnings are caught (5-6 depending on regex matching)
- No false positives on string content in FalsePositiveTest
- No false positives on comment lines (BEM rule)
- No issues flagged on CorrectComponent

❌ **FAIL** if:
- Any of the anti-patterns are NOT caught
- False positives occur on string content
- False positives occur on comments
- Correct patterns are flagged as violations

## Notes

- The `fullHeight` rule was removed - Vertical/Horizontal use `height` prop, not `fullHeight`
- BEM false positives fixed by changing string placeholder from `__STRING__` to `STRLIT`
