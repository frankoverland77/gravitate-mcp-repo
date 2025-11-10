# Excalibrr Quick Command Reference

## When Claude Code generates wrong code:

### 1. Tell it to use the rules:
```
"Follow .claude/DESIGN_SYSTEM_RULES.md - no inline styles, use props only"
```

### 2. Fix it automatically:
```
excalibrr:cleanup_styles
```

### 3. Show correct examples:
```
"Rewrite using Horizontal/Vertical/Texto/GraviButton with proper props"
```

## Before starting any work:

### Find the right component:
```
excalibrr:search_components --query "your keyword"
```

### See how to use it:
```
excalibrr:get_component --componentId "component-name"
```

### Check all available:
```
excalibrr:list_components
```

## The ONE rule to remember:

### ❌ NEVER:
```tsx
<div style={{ display: 'flex', gap: '16px' }}>
```

### ✅ ALWAYS:
```tsx
<Horizontal spacing="md">
```

---

## Quick Prop Reference

| Component | Common Props |
|-----------|--------------|
| `<Horizontal>` | `spacing="sm\|md\|lg"` `align="start\|center\|end\|space-between"` |
| `<Vertical>` | `spacing="sm\|md\|lg"` `align="start\|center\|end"` |
| `<Texto>` | `variant="h1\|h2\|h3\|body1"` `color="primary\|secondary"` `weight="normal\|bold"` |
| `<GraviButton>` | `theme="success\|danger\|default"` `size="small\|medium\|large"` |
| `<GraviGrid>` | `columnDefs={[...]}` `rowData={data}` `domLayout="autoHeight"` |

---

## Magic phrases for Claude Code:

### Starting a new component:
```
"Create [component] using Excalibrr. Follow DESIGN_SYSTEM_RULES.md."
```

### Fixing existing code:
```
"This has inline styles. Rewrite using Excalibrr props from DESIGN_SYSTEM_RULES.md."
```

### Working with Figma:
```
"Map this Figma design to Excalibrr components. Use figma-excalibrr-mapper agent."
```

### Verifying code:
```
"Review for inline style violations per DESIGN_SYSTEM_RULES.md."
```

---

## Emergency: Still getting inline styles?

1. **Say explicitly**: "No style={{}} allowed. Use component props only."
2. **Run**: `excalibrr:cleanup_styles`
3. **Point to examples**: "See correct patterns in .claude/DESIGN_SYSTEM_RULES.md section X"
4. **Ask for explanation**: "Why did you use inline styles? What props should be used instead?"

---

**Remember**: Every Excalibrr component has props for what you need. If Claude uses `style={{}}`, it's wrong.
