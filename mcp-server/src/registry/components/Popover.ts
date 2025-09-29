/**
 * Popover Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const popoverComponent: ComponentMetadata = {
  id: "popover",
  name: "Popover",
  description: "Floating overlay component that displays content relative to a trigger element. Useful for tooltips, context menus, and additional information.",
  category: "overlay",
  complexity: "medium",
  tags: ["popover", "tooltip", "overlay", "floating"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "trigger",
      type: "ReactNode",
      required: true,
      description: "Element that triggers the popover"
    },
    {
      name: "content",
      type: "ReactNode",
      required: true,
      description: "Content to display in the popover"
    },
    {
      name: "placement",
      type: "'top' | 'bottom' | 'left' | 'right'",
      required: false,
      defaultValue: "'bottom'",
      description: "Popover placement relative to trigger"
    },
    {
      name: "visible",
      type: "boolean",
      required: false,
      description: "Controlled visibility (optional)"
    },
    {
      name: "onVisibleChange",
      type: "(visible: boolean) => void",
      required: false,
      description: "Handler for visibility changes"
    },
    {
      name: "trigger",
      type: "'click' | 'hover' | 'focus'",
      required: false,
      defaultValue: "'click'",
      description: "Interaction that triggers popover"
    }
  ],
  examples: [
    {
      name: "Basic Popover",
      description: "Simple popover with text content",
      code: `import { Popover, GraviButton } from '@gravitate-js/excalibrr';

function BasicPopover() {
  return (
    <Popover
      trigger={<GraviButton>Click me</GraviButton>}
      content={<div>This is popover content</div>}
    />
  );
}`,
      tags: ["basic"]
    },
    {
      name: "Action Menu Popover",
      description: "Popover with action buttons",
      code: `import { Popover, GraviButton, Vertical } from '@gravitate-js/excalibrr';

function ActionMenu({ onEdit, onDelete, onShare }) {
  const content = (
    <Vertical gap="4px">
      <GraviButton onClick={onEdit}>Edit</GraviButton>
      <GraviButton onClick={onShare}>Share</GraviButton>
      <GraviButton theme="danger" onClick={onDelete}>Delete</GraviButton>
    </Vertical>
  );

  return (
    <Popover
      trigger={<GraviButton>Actions</GraviButton>}
      content={content}
      placement="bottom"
    />
  );
}`,
      tags: ["menu", "actions"]
    }
  ]
};