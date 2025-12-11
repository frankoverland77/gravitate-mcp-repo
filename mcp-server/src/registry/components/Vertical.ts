/**
 * Vertical Component Metadata - CORRECTED
 * 
 * Based on actual Excalibrr implementation and production usage patterns.
 */

import { ComponentMetadata } from "../types.js";

export const verticalComponent: ComponentMetadata = {
  id: "vertical",
  name: "Vertical",
  description: "Flexbox column layout component. ALWAYS use instead of <div style={{display:'flex', flexDirection:'column'}}>. Use component props for alignment, style/className for gap.",
  category: "layout",
  complexity: "simple",
  tags: ["layout", "flex", "vertical", "column"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  notes: `
⚠️ CRITICAL RULES:
- NEVER use <div style={{display:'flex', flexDirection:'column'}}> - ALWAYS use Vertical
- Use COMPONENT PROPS for justifyContent and alignItems (not inline styles)
- NO gap prop - use style={{ gap: '12px' }} or className='gap-16'
- Prefer utility classes (mb-1, mb-2, p-2, p-3) over inline styles
`,
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Child elements to arrange vertically"
    },
    {
      name: "justifyContent",
      type: "'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'",
      required: false,
      defaultValue: "'flex-start'",
      description: "Vertical distribution. USE THIS PROP instead of style."
    },
    {
      name: "alignItems",
      type: "'flex-start' | 'center' | 'flex-end' | 'stretch'",
      required: false,
      defaultValue: "'stretch'",
      description: "Horizontal alignment. USE THIS PROP instead of style."
    },
    {
      name: "flex",
      type: "string",
      required: false,
      description: "CSS flex property value (e.g., '1', '0 1 auto')"
    },
    {
      name: "height",
      type: "CSSProperties['height']",
      required: false,
      description: "Height value (e.g., '100%', '400px'). Use instead of style={{ height: '100%' }}"
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "CSS classes. Use p-2, p-3, mb-2, gap-16 for spacing."
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      description: "Inline styles. Use for gap, theme variables, or unique one-offs."
    }
  ],
  examples: [
    {
      name: "Form Fields Stack",
      description: "Vertically stacked form fields with gap",
      code: `import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { Input } from 'antd'

<Vertical style={{ gap: '16px' }}>
  <Vertical>
    <Texto category='p2' appearance='medium'>Name</Texto>
    <Input placeholder='Enter name' />
  </Vertical>
  <Vertical>
    <Texto category='p2' appearance='medium'>Email</Texto>
    <Input placeholder='Enter email' />
  </Vertical>
</Vertical>`,
      tags: ["form", "fields", "stack"]
    },
    {
      name: "Card Content",
      description: "Card with padding and gap",
      code: `import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'

<Vertical 
  className='p-3 border-radius-5' 
  style={{ gap: '12px', backgroundColor: 'var(--theme-bg-elevated)' }}
>
  <Texto category='h4' weight='600'>Product Name</Texto>
  <Texto category='p2' appearance='medium'>Product description goes here</Texto>
  <GraviButton buttonText='View Details' theme1 />
</Vertical>`,
      tags: ["card", "padding", "elevated"]
    },
    {
      name: "Page Container",
      description: "Full-height page with flex layout",
      code: `import { Vertical, GraviGrid } from '@gravitate-js/excalibrr'

<Vertical flex='1'>
  <Vertical flex='1'>
    <GraviGrid
      columnDefs={columnDefs}
      rowData={data}
      storageKey='ProductsGrid'
      agPropOverrides={{}}
    />
  </Vertical>
</Vertical>`,
      tags: ["page", "full-height", "grid"]
    },
    {
      name: "Centered Content",
      description: "Vertically and horizontally centered content",
      code: `import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'

<Vertical 
  justifyContent='center' 
  alignItems='center' 
  style={{ minHeight: '400px', gap: '16px' }}
>
  <Texto category='h3'>No Results Found</Texto>
  <Texto category='p1' appearance='medium'>Try adjusting your filters</Texto>
  <GraviButton buttonText='Clear Filters' theme1 />
</Vertical>`,
      tags: ["centered", "empty-state"]
    },
    {
      name: "⚠️ WRONG: Gap Prop",
      description: "Common mistake - no gap prop exists",
      code: `// ❌ WRONG - No gap prop exists
<Vertical gap='16px'>

// ✅ CORRECT - Use style for gap
<Vertical style={{ gap: '16px' }}>

// ✅ CORRECT - Use className for gap
<Vertical className='gap-16'>

// ❌ WRONG - Inline flex styles
<Vertical style={{ alignItems: 'center', justifyContent: 'center' }}>

// ✅ CORRECT - Use component props
<Vertical alignItems='center' justifyContent='center'>`,
      tags: ["warning", "mistake", "gap"]
    }
  ]
};
