---
name: excalibrr-figma-library
description: "Build and maintain the Excalibrr 3.0 Design System library in Figma from the Excalibrr React codebase. Use whenever building Figma variables, components, or screens that match Excalibrr's component library (@gravitate-js/excalibrr). Triggers: 'build Excalibrr in Figma', 'create Figma library from Excalibrr', 'Figma design system', 'convert Excalibrr to Figma', 'build Figma tokens', 'Excalibrr Figma components'. This skill encodes the exact token values, component variant matrices, and AntD v5 inheritance patterns specific to Excalibrr 3.0 — preventing the common failures that occur when treating Excalibrr components as generic UI components."
---

# Excalibrr 3.0 → Figma Design System Builder

This skill encodes the complete knowledge needed to build a Figma design system library that matches the Excalibrr 3.0 React codebase 1:1. It works alongside `figma-use` (Plugin API rules) and `figma-generate-library` (workflow orchestration).

**MANDATORY**: Load `figma-use` before ANY `use_figma` call. Load `figma-generate-library` for workflow phase management. This skill provides the Excalibrr-specific domain knowledge that those general skills lack.

---

## Why This Skill Exists

Excalibrr is NOT a standard component library. It wraps Ant Design 5.23.0 with a custom API surface that diverges from typical patterns in ways that break naive Figma conversion:

1. **GraviButton uses boolean theme props, not a variant string.** `<GraviButton theme1>` not `<GraviButton variant="primary">`. The Figma component must use a VARIANT axis for Theme, not separate BOOLEAN properties.
2. **Texto `secondary` appearance is BLUE, not gray.** Use `medium` for gray/muted text. This is the #1 visual error.
3. **Layout components use direct props, not style objects.** `<Vertical gap={12}>` not `<Vertical style={{ gap: '12px' }}>`. Figma auto-layout gap should be bound to spacing variables.
4. **Border radius changes between themes.** Light = 2px buttons / 0px containers. Dark = 30px buttons / 7px containers. These MUST be mode-dependent variables.
5. **Gray scale numbering inverts between Light and Dark.** Light: gray-900 is darkest. Dark: gray-100 is darkest (same hex values, different numbers). The semantic color layer handles this.
6. **AntD v5 prop names.** `open` not `visible`, `destroyOnHidden` not `destroyOnClose`, items-based Menu/Tabs/Select.
7. **`buttonText` prop.** GraviButton uses `buttonText` for label text, not `children`. The Figma TEXT property should be named "Button Text".

---

## Architecture Overview

### Variable Collections (4 total)

```
Primitives (1 mode: "Value")
  ├── gray/100 through gray/900, dark-gray, white, black
  ├── gray-dark/100 through gray-dark/800 (inverted dark mode grays)
  ├── theme/1 through theme/4 (raw hex, light theme values)
  ├── theme-dark/1 through theme-dark/4 (dark theme values)
  ├── status/error, success, warning, info, optimal, option
  ├── dim/* (light mode dim colors), dim-dark/* (dark mode dim colors)
  ├── bg/light-1,2,3,site and bg/dark-1,2,3
  └── ~55 variables, scopes: [] (hidden from picker)

Color (2 modes: "Light", "Dark")
  ├── bg/1, bg/2, bg/3, bg/site (aliases to mode-specific bg primitives)
  ├── theme/1 through theme/4 (aliases to mode-specific theme primitives)
  ├── status/error, success, warning, info, optimal
  ├── dim/* (aliases to mode-specific dim primitives)
  ├── text/default, text/heading, text/muted, text/light, text/hint, text/white
  ├── border/default, border/light
  └── ~45 variables, scopes per-variable

Spacing (1 mode: "Value")
  ├── spacing/4, 8, 12, 16, 20, 24, 32, 48
  └── 8 variables, scopes: GAP, WIDTH_HEIGHT

Shape (1 mode: "Value")
  ├── radius/none, sm, md, lg, full
  └── 5 variables, scopes: CORNER_RADIUS
```

### V1 Components (7, in build order)
1. Texto — text display atom
2. GraviButton — action atom
3. MaterialIcon — icon atom (INSTANCE_SWAP library)
4. BBDTag — status tag
5. DeltaTag — change indicator tag
6. Vertical — flex column layout
7. Horizontal — flex row layout

---

## Critical Build Rules (Excalibrr-Specific)

### Rule 1: Boolean Theme Props → Figma VARIANT Axis
GraviButton and BBDTag use boolean props for theme selection. In Figma, model as a single VARIANT axis "Theme" with options: Default, Theme1, Theme2, Theme3, Theme4, Success, Warning, Error. The code uses booleans because only one can be true at a time — Figma VARIANT captures this correctly.

### Rule 2: Appearance → Separate VARIANT Axis
GraviButton's `appearance` prop is orthogonal to theme. Model as a second VARIANT axis.

### Rule 3: Texto Appearance → Color Variable Binding
Each Texto appearance maps to a specific color variable:
- `default` → `Color.text/default` (gray-700)
- `medium` → `Color.text/muted` (gray-500)
- `secondary` → `Color.theme/2` (**BLUE** — the gotcha)
- `primary` → `Color.theme/1`
- `success/warning/error` → corresponding status color
- `white` → Primitives.white
- `light` → `Color.text/light`, `hint` → `Color.text/hint`
- `optimal` → `Color.status/optimal`

### Rule 4: Font Loading
Excalibrr uses Lato. Before ANY text operation, probe and load:
```javascript
await figma.loadFontAsync({ family: "Lato", style: "Regular" });
await figma.loadFontAsync({ family: "Lato", style: "Bold" });
```
If Lato unavailable, fall back to Inter and document the substitution.

### Rule 5: Dim Colors Are NOT Just Opacity
Light mode: LESS lighten() = additive lightening. Dark mode: LESS fade() = 15% opacity. Store computed hex values as separate primitives for each mode.

---

## Reference Docs

| Doc | When to Load | Content |
|-----|-------------|---------|
| [token-map.md](references/token-map.md) | Phase 1 (foundations) | Every variable with exact hex values, scopes, code syntax |
| [component-specs.md](references/component-specs.md) | Phase 3 (components) | Variant matrices, properties, visual specs, auto-layout |
| [antd-inheritance.md](references/antd-inheritance.md) | Any component phase | AntD v5 patterns, CSS override patterns, icon system |

---

## Quick Reference: Common Mistakes

| Mistake | Correct |
|---------|---------|
| Texto `secondary` = gray | Texto `secondary` = BLUE (`Color.theme/2`) |
| Texto `medium` = accent color | Texto `medium` = gray (`Color.text/muted`) |
| GraviButton `variant="primary"` | GraviButton `theme1` boolean prop |
| `appearance='outline'` | `appearance='outlined'` (with 'd') |
| Same border-radius light and dark | Light: 2px button, Dark: 30px button |
| Same gray scale light and dark | Light: 900=darkest, Dark: inverted numbering |
| `<GraviButton>Save</GraviButton>` | `<GraviButton buttonText="Save" />` |
| Dim colors = just lower opacity | Dim colors = different computation per theme |
| Shadow variables in Figma | Shadows → Effect Styles (not variables) |
