/**
 * Modal Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const modalComponent: ComponentMetadata = {
  id: "modal",
  name: "Modal",
  description: "Overlay dialog component for displaying content above the main page. Supports custom headers, footers, and sizes.",
  category: "overlay",
  complexity: "medium",
  tags: ["modal", "dialog", "overlay", "popup"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "visible",
      type: "boolean",
      required: true,
      description: "Controls modal visibility"
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      description: "Handler called when modal should close"
    },
    {
      name: "title",
      type: "string | ReactNode",
      required: false,
      description: "Modal title/header content"
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Modal body content"
    },
    {
      name: "footer",
      type: "ReactNode",
      required: false,
      description: "Custom footer content (buttons, actions, etc.)"
    },
    {
      name: "width",
      type: "string | number",
      required: false,
      defaultValue: "'600px'",
      description: "Modal width"
    },
    {
      name: "closable",
      type: "boolean",
      required: false,
      defaultValue: "true",
      description: "Show close button"
    },
    {
      name: "maskClosable",
      type: "boolean",
      required: false,
      defaultValue: "true",
      description: "Close modal when clicking outside"
    }
  ],
  examples: [
    {
      name: "Basic Modal",
      description: "Simple modal with title and content",
      code: `import { Modal, GraviButton } from '@gravitate-js/excalibrr';
import { useState } from 'react';

function BasicModal() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <GraviButton onClick={() => setVisible(true)}>
        Open Modal
      </GraviButton>
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        title="Information"
      >
        <p>This is a basic modal with some content.</p>
      </Modal>
    </>
  );
}`,
      tags: ["basic"]
    },
    {
      name: "Confirmation Modal",
      description: "Modal with custom footer actions",
      code: `import { Modal, GraviButton, Horizontal } from '@gravitate-js/excalibrr';
import { useState } from 'react';

function ConfirmationModal() {
  const [visible, setVisible] = useState(false);

  const handleConfirm = () => {
    // Perform action
    setVisible(false);
  };

  return (
    <>
      <GraviButton theme="danger" onClick={() => setVisible(true)}>
        Delete Item
      </GraviButton>
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        title="Confirm Deletion"
        footer={
          <Horizontal gap="8px" justifyContent="flex-end">
            <GraviButton onClick={() => setVisible(false)}>
              Cancel
            </GraviButton>
            <GraviButton theme="danger" onClick={handleConfirm}>
              Delete
            </GraviButton>
          </Horizontal>
        }
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Modal>
    </>
  );
}`,
      tags: ["confirmation", "actions"]
    }
  ]
};