/**
 * Vertical Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const verticalComponent: ComponentMetadata = {
  id: "vertical",
  name: "Vertical",
  description: "Flexbox layout component for vertical arrangement of children. Provides consistent spacing and alignment.",
  category: "layout",
  complexity: "simple",
  tags: ["layout", "flex", "vertical", "column"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Child elements to arrange vertically"
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
      defaultValue: "'stretch'",
      description: "Horizontal alignment of children"
    },
    {
      name: "justifyContent",
      type: "'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'",
      required: false,
      defaultValue: "'flex-start'",
      description: "Vertical alignment/distribution"
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
      name: "Form Fields",
      description: "Vertical stack of form fields",
      code: `import { Vertical, Texto } from '@gravitate-js/excalibrr';

function ContactForm() {
  return (
    <Vertical gap="16px">
      <div>
        <Texto weight="semibold">Name</Texto>
        <input type="text" name="name" />
      </div>
      <div>
        <Texto weight="semibold">Email</Texto>
        <input type="email" name="email" />
      </div>
      <div>
        <Texto weight="semibold">Message</Texto>
        <textarea name="message" rows={4} />
      </div>
    </Vertical>
  );
}`,
      tags: ["form"]
    },
    {
      name: "Card Content",
      description: "Vertical content layout for cards",
      code: `import { Vertical, Texto, Horizontal, GraviButton } from '@gravitate-js/excalibrr';

function ProductCard({ product }) {
  return (
    <Vertical gap="12px" className="card">
      <Texto size="lg" weight="bold">{product.name}</Texto>
      <Texto>{product.description}</Texto>
      <Texto size="xl" weight="semibold">\${product.price}</Texto>
      <Horizontal gap="8px">
        <GraviButton theme="theme1">Add to Cart</GraviButton>
        <GraviButton>Details</GraviButton>
      </Horizontal>
    </Vertical>
  );
}`,
      tags: ["card", "content"]
    },
    {
      name: "Centered Content",
      description: "Vertically and horizontally centered content",
      code: `import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr';

function EmptyState() {
  return (
    <Vertical
      gap="16px"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '400px' }}
    >
      <Texto size="xl" weight="bold">No items found</Texto>
      <Texto>Get started by creating your first item</Texto>
      <GraviButton theme="success">Create Item</GraviButton>
    </Vertical>
  );
}`,
      tags: ["centered", "empty-state"]
    }
  ]
};