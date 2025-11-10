# Excalibrr Demo Workspace

This workspace is for creating and testing Excalibrr component demos.

## 🚨 IMPORTANT: Design System Rules

**Before writing any code, read:** [`.claude/DESIGN_SYSTEM_RULES.md`](./.claude/DESIGN_SYSTEM_RULES.md)

### Critical Rule: NO INLINE STYLES

The most common mistake is using inline `style={{...}}` on Excalibrr components. This breaks theming and component behavior.

❌ **WRONG:**
```tsx
<GraviButton style={{ backgroundColor: 'red' }}>Click</GraviButton>
<Horizontal style={{ gap: '16px' }}>...</Horizontal>
```

✅ **CORRECT:**
```tsx
<GraviButton theme="danger">Click</GraviButton>
<Horizontal spacing="md">...</Horizontal>
```

### Quick Start for Claude Code Users

When working with Excalibrr in Cursor/Claude Code:

1. **Read the rules first**: `.claude/DESIGN_SYSTEM_RULES.md`
2. **Use the Figma mapper**: Use the `figma-excalibrr-mapper` agent for design translation
3. **Search components**: Use `excalibrr:search_components` to find the right component
4. **Check docs**: Use `excalibrr:get_component` for detailed component info
5. **Clean up after**: Run `excalibrr:cleanup_styles` to auto-fix inline styles

### Component Usage Cheat Sheet

| Need to... | Use... | NOT... |
|------------|--------|--------|
| Create horizontal layout | `<Horizontal spacing="md">` | `<div style={{ display: 'flex', gap: '16px' }}>` |
| Create vertical layout | `<Vertical spacing="md">` | `<div style={{ display: 'flex', flexDirection: 'column' }}>` |
| Style text | `<Texto variant="h2" color="primary">` | `<span style={{ fontSize: '24px', color: '#333' }}>` |
| Create button | `<GraviButton theme="success">` | `<button style={{ backgroundColor: 'green' }}>` |
| Create data grid | `<GraviGrid columnDefs={...}>` | `<div style={{ height: '500px' }}>` |

## MCP Tools Available

- `excalibrr:list_components` - Browse all available components
- `excalibrr:search_components` - Search for specific components
- `excalibrr:get_component` - Get detailed component documentation
- `excalibrr:create_demo` - Create a new demo
- `excalibrr:cleanup_styles` - Auto-fix inline styles violations
- `excalibrr:help` - Get help when stuck

## Project Structure

```
demo/
├── .claude/
│   ├── DESIGN_SYSTEM_RULES.md    ← Read this first!
│   └── agents/
│       └── figma-excalibrr-mapper.md
├── .cursorrules                   ← Auto-loaded by Cursor
├── src/
│   ├── pages/demos/               ← Your demos here
│   └── components/                ← Shared components
└── README.md                      ← You are here
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Clean up inline styles
excalibrr:cleanup_styles
```

## Common Mistakes to Avoid

1. ❌ Using `style={{...}}` on Excalibrr components
2. ❌ Hardcoding colors instead of using theme colors
3. ❌ Using `<div>` for layout instead of `Horizontal`/`Vertical`
4. ❌ Using `cellStyle` in GraviGrid (use `cellClass` instead)
5. ❌ Creating buttons with `<button>` (use `GraviButton`)

## Getting Help

If Claude Code is generating incorrect code:

1. Reference `.claude/DESIGN_SYSTEM_RULES.md` explicitly
2. Use `excalibrr:help --query "your question"`
3. Run `excalibrr:cleanup_styles` after generation
4. Check component docs with `excalibrr:get_component`

## License

Proprietary - Gravitate-JS
