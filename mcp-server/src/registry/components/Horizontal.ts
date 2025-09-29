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
      name: "gap",
      type: "string",
      required: false,
      defaultValue: "'0px'",
      description: "Space between children (CSS gap value)"
    },
    {
      name: "alignItems",
      type: "'flex-start' | 'center' | 'flex-end' | 'stretch'",
      required: false,
      defaultValue: "'center'",
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
      name: "wrap",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Allow children to wrap to new lines"
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
      name: "Button Group",
      description: "Horizontal arrangement of buttons",
      code: `import { Horizontal, GraviButton } from '@gravitate-js/excalibrr';

function ButtonGroup() {
  return (
    <Horizontal gap="8px">
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
    <Horizontal gap="16px" alignItems="flex-start">
      <Vertical gap="4px" style={{ flex: 1 }}>
        <Texto weight="semibold">First Name</Texto>
        <input type="text" name="firstName" />
      </Vertical>
      <Vertical gap="4px" style={{ flex: 1 }}>
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
    <Horizontal justifyContent="space-between" alignItems="center">
      <Texto size="xl" weight="bold">Products</Texto>
      <Horizontal gap="8px">
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