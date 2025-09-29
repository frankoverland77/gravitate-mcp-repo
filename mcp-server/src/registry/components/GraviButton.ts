/**
 * GraviButton Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const graviButtonComponent: ComponentMetadata = {
  id: "gravi-button",
  name: "GraviButton",
  description: "Themed button component with multiple variants and states. Supports icons, loading states, and consistent styling across themes.",
  category: "forms",
  complexity: "simple",
  tags: ["button", "action", "form", "theme", "interactive"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "children",
      type: "ReactNode",
      required: false,
      description: "Button content (text, icons, etc.)"
    },
    {
      name: "onClick",
      type: "(event: MouseEvent) => void",
      required: false,
      description: "Click handler function"
    },
    {
      name: "theme",
      type: "'default' | 'theme1' | 'theme2' | 'success' | 'danger' | 'warning'",
      required: false,
      defaultValue: "'default'",
      description: "Visual theme/color scheme for the button"
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
      name: "size",
      type: "'small' | 'medium' | 'large'",
      required: false,
      defaultValue: "'medium'",
      description: "Button size"
    },
    {
      name: "type",
      type: "'button' | 'submit' | 'reset'",
      required: false,
      defaultValue: "'button'",
      description: "HTML button type"
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
      name: "Basic Button",
      description: "Simple button with text",
      code: `import { GraviButton } from '@gravitate-js/excalibrr';

function Example() {
  return (
    <GraviButton onClick={() => console.log('Clicked!')}>
      Click Me
    </GraviButton>
  );
}`,
      tags: ["basic"]
    },
    {
      name: "Themed Buttons",
      description: "Buttons with different theme variants",
      code: `import { GraviButton } from '@gravitate-js/excalibrr';
import { Horizontal } from '@gravitate-js/excalibrr';

function ThemedButtons() {
  return (
    <Horizontal gap="8px">
      <GraviButton theme="default">Default</GraviButton>
      <GraviButton theme="theme1">Primary</GraviButton>
      <GraviButton theme="success">Success</GraviButton>
      <GraviButton theme="danger">Danger</GraviButton>
      <GraviButton theme="warning">Warning</GraviButton>
    </Horizontal>
  );
}`,
      tags: ["theme", "variants"]
    },
    {
      name: "Form Action Buttons",
      description: "Typical form button group with submit and cancel",
      code: `import { GraviButton } from '@gravitate-js/excalibrr';
import { Horizontal } from '@gravitate-js/excalibrr';

function FormActions({ onSubmit, onCancel, isSubmitting }) {
  return (
    <Horizontal gap="12px" justifyContent="flex-end">
      <GraviButton
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </GraviButton>
      <GraviButton
        theme="success"
        type="submit"
        onClick={onSubmit}
        loading={isSubmitting}
      >
        Save
      </GraviButton>
    </Horizontal>
  );
}`,
      tags: ["form", "loading"]
    }
  ],
  notes: "Buttons automatically adapt to the current theme (OSP, PE, BP, etc.). Use theme prop for emphasis."
};