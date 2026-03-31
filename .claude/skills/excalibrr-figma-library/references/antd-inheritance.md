> Part of the [excalibrr-figma-library skill](../SKILL.md).

# Ant Design v5 Inheritance Patterns

Excalibrr wraps Ant Design 5.23.0. This document explains how each component relates to its antd base and the patterns to follow (and avoid) when building Figma equivalents.

---

## 1. General AntD v5 Migration Patterns

These antd v5 patterns affect ALL components. Apply them universally:

| v4 Pattern (WRONG) | v5 Pattern (CORRECT) | Components Affected |
|--------------------|--------------------|-------------------|
| `visible` prop | `open` prop | Modal, Drawer, Popover, Tooltip, Dropdown |
| `destroyOnClose` | `destroyOnHidden` | Modal, Drawer |
| `onVisibleChange` | `onOpenChange` | Modal, Drawer, Popover, Dropdown |
| `<Menu.Item key="x">Label</Menu.Item>` | `<Menu items={[{ key: 'x', label: 'Label' }]} />` | Menu |
| `<Tabs.TabPane tab="Title" key="x">` | `<Tabs items={[{ key: 'x', label: 'Title', children: ... }]} />` | Tabs |
| `<Select.Option value="x">Label</Select.Option>` | `<Select options={[{ value: 'x', label: 'Label' }]} />` | Select |
| `<Dropdown overlay={menu}>` | `<Dropdown menu={{ items }}` | Dropdown |
| `htmlType="submit"` | `onClick={() => form.submit()}` | Button |

---

## 2. Component-Level Inheritance

### GraviButton → antd Button

**What's inherited from antd:**
- Base button element rendering
- `size` prop (`small`, `middle`, `large`)
- `disabled` prop
- `loading` prop
- `icon` prop
- Click handling
- Focus/keyboard behavior

**What Excalibrr adds:**
- `buttonText` prop (replaces `children` for text content)
- Boolean theme props (`theme1`, `theme2`, `theme3`, `theme4`, `success`, `warning`, `error`)
- Custom `appearance` prop with values: `filled`, `outlined`, `text`, `link`, `dashed`, `solid`
- Theme-aware color system that maps boolean props to CSS variables
- Custom CSS classes that override antd's default color scheme

**Figma implications:**
- DO model the Excalibrr-specific props (theme booleans, appearance)
- DO NOT model raw antd props that aren't exposed (htmlType, ghost, block, etc.)
- The visual appearance should match Excalibrr's themed output, NOT raw antd styling

### Texto → antd Typography (loosely)

**Relationship:** Texto is NOT a direct wrapper of antd Typography. It's a custom component that renders native HTML elements (h1-h6, p, span, label) with Excalibrr-specific styling.

**What it shares with antd Typography:**
- Concept of text categories (heading levels, paragraph)
- Concept of appearance/type for color variants

**What's different:**
- `category` prop maps to HTML elements, not Typography.Title/Text/Paragraph
- `appearance` values are Excalibrr-specific (medium, secondary=BLUE, optimal)
- No `copyable`, `editable`, `ellipsis` features from antd Typography

**Figma implications:**
- Build from scratch as a text component, NOT by importing antd Typography
- Use Excalibrr's category/appearance taxonomy exactly

### BBDTag → antd Tag

**What's inherited from antd:**
- Base tag rendering
- `closable` prop
- `onClose` handler
- `bordered` prop
- `color` prop (but usually overridden by theme props)

**What Excalibrr adds:**
- Boolean theme props (same pattern as GraviButton)
- `textTransform` prop
- Custom CSS that applies theme colors via CSS variables
- Dim background colors for each theme

**Figma implications:**
- Model the Excalibrr theme variants, not antd's preset colors
- Background colors should use the `color/dim/*` variables
- Text colors should use the corresponding `color/theme/*` or `color/status/*` variables

### Modal → antd Modal (used directly)

**Not wrapped** — antd Modal is used directly in the demo app.

**Key v5 patterns:**
- `open` prop (not `visible`)
- `destroyOnHidden` (not `destroyOnClose`)
- `onOpenChange` (not `onVisibleChange`)

### Drawer → antd Drawer (used directly)

Same as Modal — used directly, follow v5 patterns.

### GraviGrid → AG Grid Enterprise (NOT antd)

**Relationship:** GraviGrid wraps AG Grid, not any antd component. However, it composes antd components for:
- Search/filter forms (antd Input, Select, DatePicker)
- Create modal (antd Modal + Form)
- Bulk edit toolbar (antd Button, Popconfirm)
- Cell editors (antd Select, DatePicker, InputNumber, Switch)

**Figma implications:**
- GraviGrid in Figma should be a complex organism component
- Its sub-components (toolbar, filter bar, cells) may use antd-derived components
- Not in v1 scope — build after atoms/molecules are solid

---

## 3. AntD Components Used Directly (No Wrapper)

These antd components appear in the demo app without an Excalibrr wrapper. When building them in Figma, use antd v5 patterns but apply Excalibrr theming (colors, fonts, radius):

- `Input` / `InputNumber` — antd Input with Excalibrr theme CSS overrides
- `Select` — antd Select with `options` array prop (v5)
- `DatePicker` — antd DatePicker (Excalibrr wraps as MomentDatePicker for dayjs)
- `Checkbox` / `Radio` — antd with theme color override
- `Switch` — antd Switch
- `Tooltip` — antd Tooltip with `open` prop (v5)
- `Popconfirm` — antd Popconfirm
- `Form` — antd Form for validation and submission
- `Space` — antd Space (similar role to Horizontal with gap)
- `Segmented` — antd Segmented toggle

**These are NOT in v1 scope** but listed here for future phases.

---

## 4. CSS Override Pattern

Excalibrr applies theme colors to antd components via CSS variable overrides:

```less
// GraviButton theme1 fills
.gravi-button.theme1 {
  background-color: var(--theme-color-1);
  border-color: var(--theme-color-1);
  color: white;
}

.gravi-button.theme1.outlined {
  background-color: transparent;
  border-color: var(--theme-color-1);
  color: var(--theme-color-1);
}

// BBDTag theme2
.bbd-tag.theme2 {
  background-color: var(--theme-color-2-dim);
  border-color: var(--theme-color-2);
  color: var(--theme-color-2);
}
```

This means in Figma, the same variable binding pattern applies:
- **Filled**: fill = theme color, text = white
- **Outlined**: fill = transparent, stroke = theme color, text = theme color
- **Tags**: fill = dim color, stroke = theme color, text = theme color

---

## 5. Icon System

Excalibrr uses TWO icon systems:

1. **Ant Design Icons** (`@ant-design/icons`) — Used in buttons, menus, form controls
   - Example: `<SaveOutlined />`, `<DeleteOutlined />`, `<SearchOutlined />`
   - Imported individually: `import { SaveOutlined } from '@ant-design/icons'`

2. **Material Symbols** (Google) — Used via `MaterialIcon` component
   - Example: `<MaterialIcon icon="search" />`
   - Renders via CSS font: `material-symbols-outlined`

**Figma approach:**
- Create a small library of the most-used icons as simple components
- Use INSTANCE_SWAP on components that have icon slots
- Don't try to import the entire icon font — just the common ones used in demos
