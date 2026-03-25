/**
 * GraviButton Component Metadata - CORRECTED
 * 
 * Based on actual Excalibrr implementation and production usage patterns.
 */

import { ComponentMetadata } from "../types.js";

export const graviButtonComponent: ComponentMetadata = {
  id: "gravi-button",
  name: "GraviButton",
  description: "Themed button component. ALWAYS use instead of raw HTML <button>. Uses boolean props for themes (theme1, success, danger) not a 'theme' string prop.",
  category: "forms",
  complexity: "simple",
  tags: ["button", "action", "form", "theme", "interactive"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  notes: `
⚠️ CRITICAL RULES:
- NEVER use raw HTML <button> - ALWAYS use GraviButton
- Theme is set via BOOLEAN props (theme1, success, danger), NOT a 'theme' string prop
- NO htmlType prop - use onClick={() => form.submit()} for form submission
- Use buttonText prop OR children for label text
`,
  props: [
    {
      name: "buttonText",
      type: "string",
      required: false,
      description: "Button label text (alternative to children)"
    },
    {
      name: "children",
      type: "ReactNode",
      required: false,
      description: "Button content (alternative to buttonText)"
    },
    {
      name: "onClick",
      type: "(event: MouseEvent) => void",
      required: false,
      description: "Click handler function"
    },
    {
      name: "theme1",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Primary theme button (blue). Use for main actions."
    },
    {
      name: "success",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Success/green theme. Use for positive actions like Save, Confirm."
    },
    {
      name: "danger",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Danger/red theme. Use for destructive actions like Delete."
    },
    {
      name: "warning",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Warning/orange theme."
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Disable button interaction"
    },
    {
      name: "loading",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Show loading spinner and disable interaction"
    },
    {
      name: "type",
      type: "'text' | 'link' | 'default' | 'primary' | 'dashed'",
      required: false,
      defaultValue: "'default'",
      description: "Ant Design button type for styling variant"
    },
    {
      name: "size",
      type: "'small' | 'middle' | 'large'",
      required: false,
      defaultValue: "'middle'",
      description: "Button size"
    },
    {
      name: "icon",
      type: "ReactNode",
      required: false,
      description: "Icon element to display (use @ant-design/icons)"
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "Additional CSS classes"
    }
  ],
  examples: [
    {
      name: "Primary Action Button",
      description: "Main action button with theme1",
      code: `import { GraviButton } from '@gravitate-js/excalibrr'
import { PlusOutlined } from '@ant-design/icons'

<GraviButton 
  buttonText='Add Product' 
  theme1 
  icon={<PlusOutlined />}
  onClick={handleAdd}
/>`,
      tags: ["primary", "icon", "action"]
    },
    {
      name: "Form Action Buttons",
      description: "Standard form save/cancel pattern",
      code: `import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'

<Horizontal justifyContent='flex-end' style={{ gap: '12px' }}>
  <GraviButton buttonText='Cancel' onClick={handleCancel} />
  <GraviButton buttonText='Save' success onClick={() => form.submit()} />
</Horizontal>`,
      tags: ["form", "save", "cancel"]
    },
    {
      name: "Danger Button",
      description: "Destructive action button",
      code: `import { GraviButton } from '@gravitate-js/excalibrr'
import { DeleteOutlined } from '@ant-design/icons'

<GraviButton 
  buttonText='Delete' 
  danger 
  icon={<DeleteOutlined />}
  onClick={handleDelete}
/>`,
      tags: ["danger", "delete", "destructive"]
    },
    {
      name: "Icon-Only Button",
      description: "Small icon button for grid actions",
      code: `import { GraviButton } from '@gravitate-js/excalibrr'
import { EditOutlined } from '@ant-design/icons'

<GraviButton 
  type='text' 
  size='small' 
  icon={<EditOutlined />}
  onClick={() => onEdit(row)}
/>`,
      tags: ["icon", "small", "grid", "action"]
    },
    {
      name: "Loading State",
      description: "Button with loading indicator",
      code: `import { GraviButton } from '@gravitate-js/excalibrr'

<GraviButton 
  buttonText={isSubmitting ? 'Saving...' : 'Save'}
  success
  loading={isSubmitting}
  onClick={handleSubmit}
/>`,
      tags: ["loading", "async", "submit"]
    },
    {
      name: "⚠️ WRONG: Using theme prop",
      description: "Common mistake - don't use theme as string prop",
      code: `// ❌ WRONG - No 'theme' string prop exists
<GraviButton theme='success' buttonText='Save' />

// ✅ CORRECT - Use boolean prop
<GraviButton success buttonText='Save' />

// ❌ WRONG - No htmlType prop
<GraviButton htmlType='submit' buttonText='Submit' />

// ✅ CORRECT - Use onClick to submit
<GraviButton success buttonText='Submit' onClick={() => form.submit()} />`,
      tags: ["warning", "mistake", "theme"]
    }
  ]
};
