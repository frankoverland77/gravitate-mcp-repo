/**
 * Horizontal Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const horizontalComponent: ComponentMetadata = {
  id: "horizontal",
  name: "Horizontal",
  description: "Flexbox layout component for horizontal arrangement of children. Provides consistent spacing, alignment, and wrapping.",
  category: "layout",
  complexity: "simple",
  tags: ["layout", "flex", "horizontal", "row"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Child elements to arrange horizontally"
    },
    {
      name: "alignItems",
      type: "'flex-start' | 'center' | 'flex-end' | 'stretch'",
      required: false,
      description: "Vertical alignment of children"
    },
    {
      name: "justifyContent",
      type: "'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'",
      required: false,
      defaultValue: "'flex-start'",
      description: "Horizontal alignment/distribution"
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
      defaultValue: "'0 1 auto'",
      description: "CSS flex property value"
    },
    {
      name: "width",
      type: "string",
      required: false,
      description: "CSS width value"
    },
    {
      name: "height",
      type: "string",
      required: false,
      description: "CSS height value"
    },
    {
      name: "fullHeight",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Apply h-100 class for full height"
    },
    {
      name: "background",
      type: "string",
      required: false,
      description: "CSS variable name for background (e.g., 'bg-1')"
    },
    {
      name: "border",
      type: "string",
      required: false,
      description: "Border style key from borderEnum"
    },
    {
      name: "borderRadius",
      type: "string",
      required: false,
      description: "CSS border-radius value"
    },
    {
      name: "scroll",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Enable overflow: auto for scrollable content"
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "Additional CSS classes (use gap-8, gap-10, gap-12, gap-16 for spacing)"
    },
    {
      name: "style",
      type: "React.CSSProperties",
      required: false,
      description: "Inline styles"
    },
    {
      name: "onClick",
      type: "() => void",
      required: false,
      description: "Click handler"
    }
  ],
  examples: [
    {
      name: "Button Group",
      description: "Horizontal arrangement of buttons with gap",
      code: `import { Horizontal, GraviButton } from '@gravitate-js/excalibrr';

function ButtonGroup() {
  return (
    <Horizontal verticalCenter className="gap-8">
      <GraviButton>Cancel</GraviButton>
      <GraviButton theme="theme1">Save Draft</GraviButton>
      <GraviButton theme="success">Publish</GraviButton>
    </Horizontal>
  );
}`,
      tags: ["buttons"]
    },
    {
      name: "Form Row",
      description: "Form fields arranged horizontally",
      code: `import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';

function FormRow() {
  return (
    <Horizontal className="gap-16" alignItems="flex-start">
      <Vertical flex="1">
        <Texto weight="semibold">First Name</Texto>
        <input type="text" name="firstName" />
      </Vertical>
      <Vertical flex="1">
        <Texto weight="semibold">Last Name</Texto>
        <input type="text" name="lastName" />
      </Vertical>
    </Horizontal>
  );
}`,
      tags: ["form", "layout"]
    },
    {
      name: "Justified Header",
      description: "Header with title on left and actions on right",
      code: `import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';

function PageHeader() {
  return (
    <Horizontal justifyContent="space-between" verticalCenter>
      <Texto size="xl" weight="bold">Products</Texto>
      <Horizontal verticalCenter className="gap-8">
        <GraviButton>Export</GraviButton>
        <GraviButton theme="success">Add Product</GraviButton>
      </Horizontal>
    </Horizontal>
  );
}`,
      tags: ["header", "justified"]
    }
  ]
};