/**
 * Texto Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const textoComponent: ComponentMetadata = {
  id: "texto",
  name: "Texto",
  description: "Themed text component for consistent typography. Supports various sizes, weights, colors, and semantic variants.",
  category: "layout",
  complexity: "simple",
  tags: ["text", "typography", "label", "theme"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Text content to display"
    },
    {
      name: "size",
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'",
      required: false,
      defaultValue: "'md'",
      description: "Text size"
    },
    {
      name: "weight",
      type: "'normal' | 'medium' | 'semibold' | 'bold'",
      required: false,
      defaultValue: "'normal'",
      description: "Font weight"
    },
    {
      name: "color",
      type: "string",
      required: false,
      description: "Text color (theme variable or CSS color)"
    },
    {
      name: "align",
      type: "'left' | 'center' | 'right'",
      required: false,
      defaultValue: "'left'",
      description: "Text alignment"
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
      name: "Text Sizes",
      description: "Different text sizes",
      code: `import { Texto, Vertical } from '@gravitate-js/excalibrr';

function TextSizes() {
  return (
    <Vertical gap="8px">
      <Texto size="xs">Extra Small Text</Texto>
      <Texto size="sm">Small Text</Texto>
      <Texto size="md">Medium Text (Default)</Texto>
      <Texto size="lg">Large Text</Texto>
      <Texto size="xl">Extra Large Text</Texto>
      <Texto size="xxl">2X Large Text</Texto>
    </Vertical>
  );
}`,
      tags: ["sizes"]
    },
    {
      name: "Text Weights",
      description: "Different font weights",
      code: `import { Texto, Vertical } from '@gravitate-js/excalibrr';

function TextWeights() {
  return (
    <Vertical gap="8px">
      <Texto weight="normal">Normal Weight</Texto>
      <Texto weight="medium">Medium Weight</Texto>
      <Texto weight="semibold">Semibold Weight</Texto>
      <Texto weight="bold">Bold Weight</Texto>
    </Vertical>
  );
}`,
      tags: ["weights"]
    },
    {
      name: "Themed Labels",
      description: "Labels using theme colors",
      code: `import { Texto, Vertical } from '@gravitate-js/excalibrr';

function FormLabels() {
  return (
    <Vertical gap="12px">
      <div>
        <Texto weight="semibold">Name</Texto>
        <input type="text" />
      </div>
      <div>
        <Texto weight="semibold" color="error">Error Message</Texto>
      </div>
      <div>
        <Texto weight="semibold" color="success">Success Message</Texto>
      </div>
    </Vertical>
  );
}`,
      tags: ["labels", "form"]
    }
  ]
};