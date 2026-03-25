/**
 * Component Registry Types
 * Defines the structure for the Excalibrr component registry system
 */

export interface ComponentMetadata {
  /** Unique identifier for the component */
  id: string;
  /** Display name of the component */
  name: string;
  /** Brief description of what the component does */
  description: string;
  /** Category for organization (data, layout, forms, etc.) */
  category: string;
  /** Complexity level */
  complexity: "simple" | "medium" | "complex";
  /** Searchable tags */
  tags: string[];
  /** Component props interface */
  props?: ComponentProp[];
  /** Required dependencies */
  dependencies: string[];
  /** Import path or source location */
  source: string;
  /** Usage examples */
  examples?: ComponentExample[];
  /** Additional notes or warnings */
  notes?: string;
  /** Version of the component */
  version?: string;
}

export interface ComponentProp {
  /** Prop name */
  name: string;
  /** TypeScript type */
  type: string;
  /** Is this prop required? */
  required: boolean;
  /** Default value if any */
  defaultValue?: string;
  /** Description of the prop */
  description?: string;
}

export interface ComponentExample {
  /** Example name */
  name: string;
  /** Description of what this example shows */
  description: string;
  /** Code for the example */
  code: string;
  /** Tags for filtering examples */
  tags?: string[];
}

export interface RegistryIndex {
  /** All available components */
  components: ComponentMetadata[];
  /** Last updated timestamp */
  lastUpdated: string;
  /** Registry version */
  version: string;
}

export interface SearchOptions {
  /** Search query (matches name, description, tags) */
  query?: string;
  /** Filter by category */
  category?: string;
  /** Filter by complexity */
  complexity?: "simple" | "medium" | "complex";
  /** Filter by tags */
  tags?: string[];
  /** Limit results */
  limit?: number;
}

export interface InstallOptions {
  /** Component ID to install */
  componentId: string;
  /** Target project path */
  projectPath: string;
  /** Whether to install dependencies */
  installDependencies?: boolean;
  /** Custom component name (rename on install) */
  customName?: string;
}