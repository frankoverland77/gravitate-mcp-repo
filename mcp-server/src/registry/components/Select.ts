/**
 * Select Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const selectComponent: ComponentMetadata = {
  id: "select",
  name: "Select",
  description: "Dropdown select component with search, multi-select, and theming support.",
  category: "forms",
  complexity: "medium",
  tags: ["select", "dropdown", "input", "form", "search"],
  source: "@gravitate-js/excalibrr",
  version: "1.0.0",
  dependencies: ["@gravitate-js/excalibrr", "react"],
  props: [
    {
      name: "options",
      type: "Array<{ value: string | number; label: string }>",
      required: true,
      description: "Available options for the dropdown"
    },
    {
      name: "value",
      type: "string | number | Array<string | number>",
      required: false,
      description: "Selected value(s)"
    },
    {
      name: "onChange",
      type: "(value: any) => void",
      required: false,
      description: "Handler called when selection changes"
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      description: "Placeholder text when no selection"
    },
    {
      name: "multiple",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Enable multi-select mode"
    },
    {
      name: "searchable",
      type: "boolean",
      required: false,
      defaultValue: "true",
      description: "Enable search/filter functionality"
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      defaultValue: "false",
      description: "Disable the select"
    },
    {
      name: "clearable",
      type: "boolean",
      required: false,
      defaultValue: "true",
      description: "Allow clearing the selection"
    }
  ],
  examples: [
    {
      name: "Basic Select",
      description: "Simple dropdown with static options",
      code: `import { Select } from '@gravitate-js/excalibrr';
import { useState } from 'react';

function CountrySelect() {
  const [country, setCountry] = useState('');

  const options = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' }
  ];

  return (
    <Select
      options={options}
      value={country}
      onChange={setCountry}
      placeholder="Select a country..."
    />
  );
}`,
      tags: ["basic"]
    },
    {
      name: "Multi-Select",
      description: "Select with multiple selection enabled",
      code: `import { Select } from '@gravitate-js/excalibrr';
import { useState } from 'react';

function TagSelector() {
  const [tags, setTags] = useState([]);

  const options = [
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'node', label: 'Node.js' },
    { value: 'graphql', label: 'GraphQL' }
  ];

  return (
    <Select
      options={options}
      value={tags}
      onChange={setTags}
      multiple
      placeholder="Select technologies..."
    />
  );
}`,
      tags: ["multi-select"]
    }
  ]
};