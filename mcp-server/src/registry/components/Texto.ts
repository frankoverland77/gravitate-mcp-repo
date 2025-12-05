/**
 * Texto Component Metadata - CORRECTED
 * 
 * Based on actual Excalibrr implementation and production usage patterns.
 * This is the ONLY way to render text in Excalibrr - NEVER use raw HTML text elements.
 */

import { ComponentMetadata } from "../types.js";

export const textoComponent: ComponentMetadata = {
  id: "texto",
  name: "Texto",
  description: "Themed typography component. ALWAYS use instead of <p>, <h1>, <span>, etc. Uses 'category' for size and 'appearance' for color.",
  category: "layout",
  complexity: "simple",
  tags: ["text", "typography", "label", "heading", "paragraph"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  notes: `
⚠️ CRITICAL RULES:
- NEVER use raw HTML text elements (<p>, <h1>, <span>, etc.) - ALWAYS use Texto
- Use 'category' for size (h1-h6, p1, p2, heading, heading-small, label)
- Use 'appearance' for color - WARNING: 'secondary' is BLUE not gray!
- Use 'medium' appearance for gray text (labels, helper text)
- Use 'weight' for font weight ("400", "500", "600", "700", "bold")
`,
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Text content to display"
    },
    {
      name: "category",
      type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p1' | 'p2' | 'heading' | 'heading-small' | 'label'",
      required: false,
      defaultValue: "'p1'",
      description: "Typography category - determines font size. Use h1-h6 for headings, p1/p2 for paragraphs, label for form labels."
    },
    {
      name: "appearance",
      type: "'primary' | 'secondary' | 'light' | 'medium' | 'error' | 'success' | 'warning' | 'white' | 'default'",
      required: false,
      defaultValue: "'primary'",
      description: "Text color appearance. ⚠️ 'secondary' is BLUE (not gray)! Use 'medium' for gray text."
    },
    {
      name: "weight",
      type: "'400' | '500' | '600' | '700' | 'bold' | 'normal' | 'medium' | 'semibold'",
      required: false,
      defaultValue: "'400'",
      description: "Font weight. Use '600' or 'bold' for emphasis."
    },
    {
      name: "align",
      type: "'left' | 'center' | 'right'",
      required: false,
      defaultValue: "'left'",
      description: "Text alignment"
    },
    {
      name: "textTransform",
      type: "'uppercase' | 'lowercase' | 'capitalize' | 'none'",
      required: false,
      description: "CSS text-transform property"
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "Additional CSS classes"
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      description: "Inline styles. Use for textTransform, letterSpacing, or theme color variables."
    }
  ],
  examples: [
    {
      name: "Page Heading",
      description: "Main page title",
      code: `import { Texto } from '@gravitate-js/excalibrr'

<Texto category='h1'>Products</Texto>`,
      tags: ["heading", "h1", "title"]
    },
    {
      name: "Section Header (Uppercase Label)",
      description: "Standard section header pattern - uppercase, gray, bold",
      code: `import { Texto } from '@gravitate-js/excalibrr'

<Texto 
  category='h6' 
  appearance='medium' 
  weight='600' 
  style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
>
  Product Details
</Texto>`,
      tags: ["section", "header", "uppercase", "label"]
    },
    {
      name: "Field Label",
      description: "Form field label - uppercase, gray",
      code: `import { Texto } from '@gravitate-js/excalibrr'

<Texto 
  category='p2' 
  appearance='medium' 
  style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
>
  Product Name
</Texto>`,
      tags: ["label", "field", "form"]
    },
    {
      name: "Field Value (Bold)",
      description: "Display value with emphasis",
      code: `import { Texto } from '@gravitate-js/excalibrr'

<Texto category='p1' weight='600'>John Smith</Texto>`,
      tags: ["value", "bold", "display"]
    },
    {
      name: "Helper Text",
      description: "Subdued helper or description text",
      code: `import { Texto } from '@gravitate-js/excalibrr'

<Texto category='p2' appearance='medium'>
  Enter the product SKU code
</Texto>`,
      tags: ["helper", "description", "subdued"]
    },
    {
      name: "Status Text",
      description: "Colored status indicators",
      code: `import { Texto } from '@gravitate-js/excalibrr'

<Texto category='p2' appearance='success'>Active</Texto>
<Texto category='p2' appearance='error'>Inactive</Texto>
<Texto category='p2' appearance='warning'>Pending</Texto>`,
      tags: ["status", "color", "indicator"]
    },
    {
      name: "White Text (Dark Backgrounds)",
      description: "For use on dark backgrounds",
      code: `import { Texto } from '@gravitate-js/excalibrr'

<Texto category='h3' appearance='white' weight='bold'>
  {productName}
</Texto>`,
      tags: ["white", "dark-bg", "contrast"]
    },
    {
      name: "Right-Aligned Number",
      description: "Right-aligned text for numerical values",
      code: `import { Texto } from '@gravitate-js/excalibrr'

<Texto category='p1' align='right' weight='600'>
  {value.toLocaleString()}
</Texto>`,
      tags: ["number", "right-align", "value"]
    },
    {
      name: "Label + Value Pattern",
      description: "Standard label/value vertical stack",
      code: `import { Texto, Vertical } from '@gravitate-js/excalibrr'

<Vertical>
  <Texto 
    category='p2' 
    appearance='medium'
    style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
  >
    Customer Name
  </Texto>
  <Texto category='p1' weight='600'>
    {customer.name}
  </Texto>
</Vertical>`,
      tags: ["pattern", "label-value", "detail"]
    },
    {
      name: "⚠️ WRONG: appearance='secondary' for gray",
      description: "Common mistake - secondary is BLUE not gray!",
      code: `// ❌ WRONG - 'secondary' appearance is BLUE, not gray!
<Texto appearance='secondary'>Gray label text</Texto>

// ✅ CORRECT - Use 'medium' for gray text
<Texto appearance='medium'>Gray label text</Texto>

// ❌ WRONG - Using raw HTML elements
<p>Some text</p>
<h1>Title</h1>
<span>Label</span>

// ✅ CORRECT - Always use Texto
<Texto category='p1'>Some text</Texto>
<Texto category='h1'>Title</Texto>
<Texto category='label'>Label</Texto>`,
      tags: ["warning", "mistake", "appearance", "secondary"]
    }
  ]
};
