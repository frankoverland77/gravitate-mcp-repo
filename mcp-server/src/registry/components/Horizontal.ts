/**
 * Horizontal Component Metadata - CORRECTED
 * 
 * Based on actual Excalibrr implementation and production usage patterns.
 */

import { ComponentMetadata } from "../types.js";

export const horizontalComponent: ComponentMetadata = {
  id: "horizontal",
  name: "Horizontal",
  description: "Flexbox row layout component. ALWAYS use instead of <div style={{display:'flex'}}>. Use component props for alignment, style/className for gap.",
  category: "layout",
  complexity: "simple",
  tags: ["layout", "flex", "horizontal", "row"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  notes: `
⚠️ CRITICAL RULES:
- NEVER use <div style={{display:'flex'}}> - ALWAYS use Horizontal or Vertical
- Use COMPONENT PROPS for justifyContent and alignItems (not inline styles)
- NO gap prop - use style={{ gap: '12px' }} or className='gap-16'
- Prefer utility classes (gap-8, gap-10, gap-12, gap-16) over inline gap styles
`,
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Child elements to arrange horizontally"
    },
    {
      name: "justifyContent",
      type: "'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'",
      required: false,
      defaultValue: "'flex-start'",
      description: "Horizontal distribution. USE THIS PROP instead of style."
    },
    {
      name: "alignItems",
      type: "'flex-start' | 'center' | 'flex-end' | 'stretch'",
      required: false,
      defaultValue: "'stretch'",
      description: "Vertical alignment. USE THIS PROP instead of style."
    },
    {
      name: "verticalCenter",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Shorthand for alignItems='center'"
    },
    {
      name: "horizontalCenter",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Shorthand for justifyContent='center'"
    },
    {
      name: "flex",
      type: "string",
      required: false,
      description: "CSS flex property value (e.g., '1', '0 1 auto')"
    },
    {
      name: "fullHeight",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Apply h-100 class for full height"
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "CSS classes. Use gap-8, gap-10, gap-12, gap-16 for spacing."
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      description: "Inline styles. Use for gap if no utility class fits, or theme variables."
    }
  ],
  examples: [
    {
      name: "Space Between Header",
      description: "Title on left, actions on right",
      code: `import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'

// ✅ CORRECT - use component props for alignment
<Horizontal justifyContent='space-between' alignItems='center'>
  <Texto category='h2'>Products</Texto>
  <GraviButton buttonText='Add Product' theme1 />
</Horizontal>`,
      tags: ["header", "space-between", "alignment"]
    },
    {
      name: "Button Group with Gap",
      description: "Buttons with spacing using utility class",
      code: `import { Horizontal, GraviButton } from '@gravitate-js/excalibrr'

// ✅ CORRECT - use className for gap
<Horizontal alignItems='center' className='gap-12'>
  <GraviButton buttonText='Cancel' />
  <GraviButton buttonText='Save' success />
</Horizontal>`,
      tags: ["buttons", "gap", "utility-class"]
    },
    {
      name: "Form Actions (Right-Aligned)",
      description: "Standard form action buttons pattern",
      code: `import { Horizontal, GraviButton } from '@gravitate-js/excalibrr'

<Horizontal justifyContent='flex-end' style={{ gap: '12px' }}>
  <GraviButton buttonText='Cancel' onClick={onCancel} />
  <GraviButton buttonText='Save' success onClick={() => form.submit()} />
</Horizontal>`,
      tags: ["form", "actions", "right-aligned"]
    },
    {
      name: "⚠️ WRONG: Inline Alignment Styles",
      description: "Common mistake - use props not style for alignment",
      code: `// ❌ WRONG - Don't use style for alignment
<Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>

// ✅ CORRECT - Use component props
<Horizontal justifyContent='space-between' alignItems='center'>

// ❌ WRONG - No gap prop exists
<Horizontal gap={12}>

// ✅ CORRECT - Use style or className for gap
<Horizontal style={{ gap: '12px' }}>
<Horizontal className='gap-12'>`,
      tags: ["warning", "mistake", "props"]
    }
  ]
};
