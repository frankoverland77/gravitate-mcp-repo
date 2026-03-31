> Part of the [excalibrr-figma-library skill](../SKILL.md).

# Excalibrr 3.0 Component Specs for Figma

Each component section contains variant matrix, properties, visual specs, auto-layout config, and variable bindings.

---

## 1. Texto

**Split into two component sets to stay under 30 variants.**

### Component Set A: `Texto / Headings`
- Category: h1, h2, h3, h4, h5, display, display-small (7)
- Appearance: default, primary, secondary, medium (4)
- **Total: 28 variants**

### Component Set B: `Texto / Body`
- Category: p1, p2, label (3)
- Appearance: default, primary, secondary, medium, success, warning, error, white, light, hint, optimal (11)
- **Total: 33 variants** (acceptable slightly over 30)

### Properties
| Property | Type | Default |
|----------|------|---------|
| Text Content | TEXT | "Text" |

### Category → Text Style
| Category | Style | Element |
|----------|-------|---------|
| h1 | heading/h1 | h1 |
| h2 | heading/h2 | h2 |
| h3 | heading/h3 | h3 |
| h4 | heading/h4 | h4 |
| h5 | heading/h5 | h5 |
| display | heading/display | h4 |
| display-small | heading/display-small | h5 |
| p1 | body/p1 | p |
| p2 | body/p2 | p |
| label | body/label | label |

### Appearance → Color Variable
| Appearance | Variable | Visual |
|-----------|----------|--------|
| default | Color.text/default | gray-700 |
| primary | Color.theme/1 | Teal |
| secondary | Color.theme/2 | **BLUE** (not gray!) |
| medium | Color.text/muted | gray-500 |
| success | Color.status/success | Green |
| warning | Color.status/warning | Orange |
| error | Color.status/error | Red |
| white | Primitives.white | White |
| light | Color.text/light | gray-400 |
| hint | Color.text/hint | gray-300 |
| optimal | Color.status/optimal | Gold |

### Auto-Layout: HUG x HUG, no padding, no fill.

---

## 2. GraviButton

**Split into two component sets.**

### Component Set A: `GraviButton / Solid`
- Theme: Default, Theme1, Theme2, Success, Warning, Error (6)
- Appearance: Filled, Outlined (2)
- Size: Large, Middle, Small (3)
- **Total: 36 variants**

### Component Set B: `GraviButton / Subtle`
- Theme: Default, Theme1, Theme2, Success, Warning, Error (6)
- Appearance: Text, Link (2)
- Size: Large, Middle, Small (3)
- **Total: 36 variants**

### Properties
| Property | Type | Default |
|----------|------|---------|
| Button Text | TEXT | "Button" |
| Show Icon | BOOLEAN | false |
| Icon | INSTANCE_SWAP | — |
| Disabled | BOOLEAN | false |

### Filled Visual Specs
| Theme | Fill | Text | Border | Radius |
|-------|------|------|--------|--------|
| Default | Color.bg/2 | Color.text/default | 1px Color.border/default | Shape.radius/sm |
| Theme1 | Color.theme/1 | white | none | Shape.radius/sm |
| Theme2 | Color.theme/2 | white | none | Shape.radius/sm |
| Success | Color.status/success | white | none | Shape.radius/sm |
| Warning | Color.status/warning | white | none | Shape.radius/sm |
| Error | Color.status/error | white | none | Shape.radius/sm |

### Outlined Visual Specs
| Theme | Fill | Text | Border | Radius |
|-------|------|------|--------|--------|
| Default | transparent | Color.text/default | 1px Color.border/default | Shape.radius/sm |
| Theme1 | transparent | Color.theme/1 | 1px Color.theme/1 | Shape.radius/sm |
| Theme2 | transparent | Color.theme/2 | 1px Color.theme/2 | Shape.radius/sm |
| Success | transparent | Color.status/success | 1px Color.status/success | Shape.radius/sm |
| Warning | transparent | Color.status/warning | 1px Color.status/warning | Shape.radius/sm |
| Error | transparent | Color.status/error | 1px Color.status/error | Shape.radius/sm |

### Text/Link Visual Specs
- Fill: transparent (both)
- Text color: per theme (same as outlined)
- Border: none
- Link adds underline decoration

### Size Specs
| Size | Height | Pad H | Pad V | Font Size | Style |
|------|--------|-------|-------|-----------|-------|
| Large | 40 | 16 | 8 | 16 | — |
| Middle | 32 | 12 | 4 | 14 | body/p1 |
| Small | 24 | 8 | 2 | 12 | body/p2 |

### Auto-Layout: HORIZONTAL, CENTER x CENTER, gap=Spacing.spacing/8

### Internal Structure
```
[GraviButton Frame] — auto-layout horizontal
  ├── [Icon Instance] — INSTANCE_SWAP, hidden by default
  └── [Button Text] — TEXT property
```

---

## 3. MaterialIcon

**~20 individual COMPONENT nodes (not a component set).**

Icons: search, save, delete, edit, add, close, check, arrow_back, arrow_forward, chevron_right, chevron_left, settings, person, notifications, menu, visibility, visibility_off, download, upload, refresh

Each: 24x24 frame, vector shape, fill = Color.text/default

---

## 4. BBDTag

### Variant Axes
- Theme: Default, Theme1, Theme2, Theme3, Theme4, Success, Warning, Error, Optimal (9)
- Size: Default, Small (2)
- **Total: 18 variants**

### Properties
| Property | Type | Default |
|----------|------|---------|
| Tag Text | TEXT | "Tag" |
| Closable | BOOLEAN | false |

### Visual Specs
| Theme | Fill | Text | Border |
|-------|------|------|--------|
| Default | Color.bg/2 | Color.text/default | 1px Color.border/default |
| Theme1 | Color.dim/theme-1 | Color.theme/1 | 1px Color.theme/1 |
| Theme2 | Color.dim/theme-2 | Color.theme/2 | 1px Color.theme/2 |
| Theme3 | Color.dim/theme-3 | Color.theme/3 | 1px Color.theme/3 |
| Theme4 | Color.dim/theme-4 | Color.theme/4 | 1px Color.theme/4 |
| Success | Color.dim/success | Color.status/success | 1px Color.status/success |
| Warning | Color.dim/warning | Color.status/warning | 1px Color.status/warning |
| Error | Color.dim/error | Color.status/error | 1px Color.status/error |
| Optimal | Color.dim/optimal | Color.status/optimal | 1px Color.status/optimal |

### Size Specs
| Size | Height | Pad H | Pad V | Font |
|------|--------|-------|-------|------|
| Default | 24 | 8 | 4 | 12px |
| Small | 20 | 6 | 2 | 11px |

Radius: Shape.radius/sm. Auto-layout: HORIZONTAL, CENTER x CENTER, gap=4.

---

## 5. DeltaTag

### Variant Axes
- Direction: Up, Down, Neutral (3)
- **Total: 3 variants**

### Properties
| Property | Type | Default |
|----------|------|---------|
| Value | TEXT | "+5.2%" |

### Visual Specs
| Direction | Fill | Text | Icon |
|-----------|------|------|------|
| Up | Color.dim/success | Color.status/success | ▲ |
| Down | Color.dim/error | Color.status/error | ▼ |
| Neutral | Color.bg/2 | Color.text/muted | — |

Height: 24, Pad: 6h/4v, Font: 12px Semi Bold, Radius: Shape.radius/sm.

---

## 6. Vertical

**Single base component (not a set) — designers override via variable bindings.**

Auto-layout: VERTICAL, gap=Spacing.spacing/12, no padding, no fill, HUG x FILL.

---

## 7. Horizontal

**Single base component — same pattern as Vertical.**

Auto-layout: HORIZONTAL, gap=Spacing.spacing/12, counter-axis=CENTER, no padding, no fill, HUG x HUG.

---

## Build Order

| # | Component | Variants | Est. Calls |
|---|-----------|----------|------------|
| 1 | Texto / Headings | 28 | 5-8 |
| 2 | Texto / Body | 33 | 5-8 |
| 3 | GraviButton / Solid | 36 | 8-12 |
| 4 | GraviButton / Subtle | 36 | 8-12 |
| 5 | MaterialIcon | 20 individual | 5-8 |
| 6 | BBDTag | 18 | 5-8 |
| 7 | DeltaTag | 3 | 3-5 |
| 8 | Vertical | 1 | 2-3 |
| 9 | Horizontal | 1 | 2-3 |
| **Total** | | **~175** | **~45-65** |
