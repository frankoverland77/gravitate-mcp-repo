> Part of the [excalibrr-figma-library skill](../SKILL.md).

# Excalibrr 3.0 Token → Figma Variable Map

Complete mapping of every design token with exact values, Figma collection placement, variable scopes, and CSS code syntax.

---

## Collection 1: Primitives

**Modes:** 1 ("Value")
**Scopes:** `[]` (hidden from property picker)

### Gray Scale (base: #303030)

| Variable Name | Hex | CSS Code Syntax |
|--------------|-----|-----------------|
| `gray/100` | `#FCFCFC` | `var(--gray-100)` |
| `gray/200` | `#E8E8E8` | `var(--gray-200)` |
| `gray/300` | `#DDDDDD` | `var(--gray-300)` |
| `gray/400` | `#C4C4C4` | `var(--gray-400)` |
| `gray/500` | `#A3A3A3` | `var(--gray-500)` |
| `gray/600` | `#777777` | `var(--gray-600)` |
| `gray/700` | `#595959` | `var(--gray-700)` |
| `gray/800` | `#3D3D3D` | `var(--gray-800)` |
| `gray/900` | `#353535` | `var(--gray-900)` |
| `dark-gray` | `#303030` | `var(--dark-gray)` |
| `white` | `#FFFFFF` | — |
| `black` | `#000000` | — |

### Dark Mode Gray Scale (inverted numbering)

| Variable Name | Hex | Notes |
|--------------|-----|-------|
| `gray-dark/100` | `#3D3D3D` | Dark --gray-100 |
| `gray-dark/200` | `#595959` | Dark --gray-200 |
| `gray-dark/300` | `#777777` | Dark --gray-300 |
| `gray-dark/400` | `#A3A3A3` | Dark --gray-400 |
| `gray-dark/500` | `#B5B5B5` | Dark --gray-500 |
| `gray-dark/600` | `#D6D6D6` | Dark --gray-600 |
| `gray-dark/700` | `#E8E8E8` | Dark --gray-700 |
| `gray-dark/800` | `#FCFCFC` | Dark --gray-800 |

### Theme Colors (Light)

| Variable Name | Hex | CSS Code Syntax |
|--------------|-----|-----------------|
| `theme/1` | `#0C5A58` | `var(--theme-color-1)` |
| `theme/2` | `#51B073` | `var(--theme-color-2)` |
| `theme/3` | `#64D28D` | `var(--theme-color-3)` |
| `theme/4` | `#725AC1` | `var(--theme-color-4)` |

### Theme Colors (Dark)

| Variable Name | Hex |
|--------------|-----|
| `theme-dark/1` | `#102643` |
| `theme-dark/2` | `#76ABF3` |
| `theme-dark/3` | `#BF2A45` |
| `theme-dark/4` | `#725AC1` |

### Status Colors

| Variable Name | Hex | CSS Code Syntax |
|--------------|-----|-----------------|
| `status/error` | `#F22939` | `var(--theme-error)` |
| `status/success` | `#64D28D` | `var(--theme-success)` |
| `status/warning` | `#F26E29` | `var(--theme-warning)` |
| `status/info` | `#CCE5FF` | `var(--theme-info)` |
| `status/optimal` | `#C79C02` | `var(--theme-optimal)` |
| `status/option` | `#8DABC4` | `var(--theme-option)` |

### Background Colors

| Variable Name | Hex | Notes |
|--------------|-----|-------|
| `bg/light-1` | `#FFFFFF` | Light bg-1 |
| `bg/light-2` | `#F8F9FA` | Light bg-2 |
| `bg/light-3` | `#EEF0F8` | Light bg-3 |
| `bg/light-site` | `#F5F6FA` | Light site-bg |
| `bg/dark-1` | `#101E29` | Dark bg-1 |
| `bg/dark-2` | `#1B242E` | Dark bg-2 |
| `bg/dark-3` | `#181E23` | Dark bg-3 |

### Dim Colors (Light - lighten())

| Variable Name | Hex |
|--------------|-----|
| `dim/theme-1` | `#D2F9F8` |
| `dim/theme-2` | `#D9F0E2` |
| `dim/theme-3` | `#E0F5E9` |
| `dim/theme-4` | `#F1EEF9` |
| `dim/success` | `#DBF4E4` |
| `dim/warning` | `#FCE0D1` |
| `dim/error` | `#FCD1D5` |
| `dim/optimal` | `#FEE797` |

### Dim Colors (Dark - 15% opacity on dark bg)

| Variable Name | Hex |
|--------------|-----|
| `dim-dark/theme-1` | `#121F2C` |
| `dim-dark/theme-2` | `#1D2F41` |
| `dim-dark/theme-3` | `#261E2B` |
| `dim-dark/theme-4` | `#1E1F35` |
| `dim-dark/success` | `#182B24` |
| `dim-dark/warning` | `#271F22` |
| `dim-dark/error` | `#271C22` |
| `dim-dark/optimal` | `#252418` |

---

## Collection 2: Color (Semantic)

**Modes:** 2 ("Light", "Dark")
**All values are VARIABLE_ALIAS to Primitives**

### Backgrounds

| Variable Name | Light → | Dark → | Scopes | CSS |
|--------------|---------|--------|--------|-----|
| `bg/1` | `bg/light-1` | `bg/dark-1` | `FRAME_FILL, SHAPE_FILL` | `var(--bg-1)` |
| `bg/2` | `bg/light-2` | `bg/dark-2` | `FRAME_FILL, SHAPE_FILL` | `var(--bg-2)` |
| `bg/3` | `bg/light-3` | `bg/dark-3` | `FRAME_FILL, SHAPE_FILL` | `var(--bg-3)` |
| `bg/site` | `bg/light-site` | `bg/dark-1` | `FRAME_FILL` | `var(--site-bg)` |

### Theme Colors

| Variable Name | Light → | Dark → | Scopes | CSS |
|--------------|---------|--------|--------|-----|
| `theme/1` | `theme/1` | `theme-dark/1` | `FRAME_FILL, SHAPE_FILL, STROKE_COLOR` | `var(--theme-color-1)` |
| `theme/2` | `theme/2` | `theme-dark/2` | `FRAME_FILL, SHAPE_FILL, STROKE_COLOR` | `var(--theme-color-2)` |
| `theme/3` | `theme/3` | `theme-dark/3` | `FRAME_FILL, SHAPE_FILL, STROKE_COLOR` | `var(--theme-color-3)` |
| `theme/4` | `theme/4` | `theme-dark/4` | `FRAME_FILL, SHAPE_FILL, STROKE_COLOR` | `var(--theme-color-4)` |

### Status Colors (same both modes)

| Variable Name | Light → | Dark → | Scopes | CSS |
|--------------|---------|--------|--------|-----|
| `status/error` | `status/error` | `status/error` | `FRAME_FILL, SHAPE_FILL, STROKE_COLOR, TEXT_FILL` | `var(--theme-error)` |
| `status/success` | `status/success` | `status/success` | `FRAME_FILL, SHAPE_FILL, STROKE_COLOR, TEXT_FILL` | `var(--theme-success)` |
| `status/warning` | `status/warning` | `status/warning` | `FRAME_FILL, SHAPE_FILL, STROKE_COLOR, TEXT_FILL` | `var(--theme-warning)` |
| `status/info` | `status/info` | `status/info` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-info)` |
| `status/optimal` | `status/optimal` | `status/optimal` | `FRAME_FILL, SHAPE_FILL, STROKE_COLOR, TEXT_FILL` | `var(--theme-optimal)` |

### Dim Colors

| Variable Name | Light → | Dark → | Scopes | CSS |
|--------------|---------|--------|--------|-----|
| `dim/theme-1` | `dim/theme-1` | `dim-dark/theme-1` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-color-1-dim)` |
| `dim/theme-2` | `dim/theme-2` | `dim-dark/theme-2` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-color-2-dim)` |
| `dim/theme-3` | `dim/theme-3` | `dim-dark/theme-3` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-color-3-dim)` |
| `dim/theme-4` | `dim/theme-4` | `dim-dark/theme-4` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-color-4-dim)` |
| `dim/success` | `dim/success` | `dim-dark/success` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-success-dim)` |
| `dim/warning` | `dim/warning` | `dim-dark/warning` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-warning-dim)` |
| `dim/error` | `dim/error` | `dim-dark/error` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-error-dim)` |
| `dim/optimal` | `dim/optimal` | `dim-dark/optimal` | `FRAME_FILL, SHAPE_FILL` | `var(--theme-optimal-dim)` |

### Text Colors

| Variable Name | Light → | Dark → | Scopes | CSS |
|--------------|---------|--------|--------|-----|
| `text/default` | `gray/700` | `gray-dark/700` | `TEXT_FILL` | — |
| `text/heading` | `gray/900` | `gray-dark/800` | `TEXT_FILL` | — |
| `text/muted` | `gray/500` | `gray-dark/500` | `TEXT_FILL` | — |
| `text/light` | `gray/400` | `gray-dark/600` | `TEXT_FILL` | — |
| `text/hint` | `gray/300` | `gray-dark/500` | `TEXT_FILL` | — |
| `text/white` | `white` | `white` | `TEXT_FILL` | — |

### Border Colors

| Variable Name | Light → | Dark → | Scopes |
|--------------|---------|--------|--------|
| `border/default` | `gray/300` | `gray-dark/300` | `STROKE_COLOR` |
| `border/light` | `gray/200` | `gray-dark/200` | `STROKE_COLOR` |

---

## Collection 3: Spacing

**Modes:** 1 ("Value") | **Type:** FLOAT | **Scopes:** `["GAP", "WIDTH_HEIGHT"]`

| Variable Name | Value |
|--------------|-------|
| `spacing/4` | 4 |
| `spacing/8` | 8 |
| `spacing/12` | 12 |
| `spacing/16` | 16 |
| `spacing/20` | 20 |
| `spacing/24` | 24 |
| `spacing/32` | 32 |
| `spacing/48` | 48 |

---

## Collection 4: Shape

**Modes:** 1 ("Value") | **Type:** FLOAT | **Scopes:** `["CORNER_RADIUS"]`

| Variable Name | Value | CSS | Notes |
|--------------|-------|-----|-------|
| `radius/none` | 0 | — | Containers (light) |
| `radius/sm` | 2 | `var(--button-border-radius)` | Buttons (light) |
| `radius/md` | 5 | `var(--ag-border-radius)` | Grid, cards |
| `radius/lg` | 7 | `var(--container-border-radius)` | Containers (dark) |
| `radius/full` | 30 | — | Buttons (dark), pills |

---

## Effect Styles (2)

| Name | Type | x | y | radius | spread | color |
|------|------|---|---|--------|--------|-------|
| `shadow/default` | DROP_SHADOW | 3 | 3 | 6 | 0 | rgba(0,0,0,0.15) |
| `shadow/light` | DROP_SHADOW | 0 | 2 | 6 | 0 | rgba(0,0,0,0.05) |

---

## Text Styles (10)

All use **Lato** font family. Fallback: **Inter**.

| Name | Weight | Size | Line Height | Letter Spacing | Transform |
|------|--------|------|-------------|----------------|-----------|
| `heading/h1` | Bold (700) | 28 | {value:36,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `heading/h2` | Bold (700) | 24 | {value:32,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `heading/h3` | Bold (700) | 20 | {value:28,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `heading/h4` | Semi Bold (600) | 16 | {value:24,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `heading/h5` | Semi Bold (600) | 14 | {value:20,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `heading/display` | Semi Bold (600) | 18 | {value:26,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `heading/display-small` | Semi Bold (600) | 14 | {value:20,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `body/p1` | Regular (400) | 14 | {value:20,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `body/p2` | Regular (400) | 12 | {value:18,unit:"PIXELS"} | {value:0,unit:"PIXELS"} | none |
| `body/label` | Semi Bold (600) | 11 | {value:16,unit:"PIXELS"} | {value:0.5,unit:"PIXELS"} | UPPER |
