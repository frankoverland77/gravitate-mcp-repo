/**
 * Form Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const formComponent: ComponentMetadata = {
  id: "form",
  name: "Form",
  description: "Container component for form layouts with consistent spacing and structure. Handles form submission and validation.",
  category: "forms",
  complexity: "medium",
  tags: ["form", "layout", "container", "validation"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "onSubmit",
      type: "(event: FormEvent) => void",
      required: false,
      description: "Form submission handler"
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Form content (inputs, labels, buttons, etc.)"
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
      name: "Simple Form",
      description: "Basic form with text inputs and submit button",
      code: `import { Form, Vertical, GraviButton } from '@gravitate-js/excalibrr';

function ContactForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Vertical gap="16px">
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <GraviButton type="submit" theme="success">
          Submit
        </GraviButton>
      </Vertical>
    </Form>
  );
}`,
      tags: ["basic", "inputs"]
    },
    {
      name: "Form with Validation",
      description: "Form with client-side validation and error handling",
      code: `import { Form, Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { useState } from 'react';

function ValidatedForm() {
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};
    if (!data.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }
    if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Submit form
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Vertical gap="16px">
        <div>
          <label>Email</label>
          <input type="email" name="email" />
          {errors.email && <Texto color="error">{errors.email}</Texto>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" />
          {errors.password && <Texto color="error">{errors.password}</Texto>}
        </div>
        <GraviButton type="submit" theme="success">Sign Up</GraviButton>
      </Vertical>
    </Form>
  );
}`,
      tags: ["validation", "errors"]
    }
  ]
};