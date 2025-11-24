/**
 * Type definitions for the TemplateChooser component
 */

/**
 * Represents a single component within a formula template
 */
export interface TemplateComponent {
  id: number;
  percentage: string;
  operator: string;
  source: string;
  instrument: string;
  dateRule: string;
  type: string;
  display?: string;
  customDisplayName?: string;
}

/**
 * Represents a formula template
 */
export interface Template {
  id: string;
  name: string;
  contractType: string;
  product?: string;
  location?: string;
  category?: string;
  description?: string;
  createdBy?: string;
  lastModified?: string;
  lastUsedDate?: string;
  totalUsage?: number;
  usedInLocations?: string[];
  usedInProducts?: string[];
  components: TemplateComponent[];
  customFormulaPreview?: string;
}

/**
 * Represents a filter field option
 */
export interface FilterField {
  key: string;
  label: string;
  value: string;
}

/**
 * Represents a filter with its enabled state
 */
export interface FilterState {
  value: string;
  enabled: boolean;
}

/**
 * Map of filter keys to their state
 */
export type FilterStateMap = Record<string, FilterState>;

/**
 * Map of template IDs to component selection state
 */
export type ComponentSelectionMap = Record<string, Record<number, boolean>>;

/**
 * View mode for displaying templates
 */
export type TemplateViewMode = 'cards' | 'list';

/**
 * Props for the TemplateChooser component
 */
export interface TemplateChooserProps {
  /** Array of templates to display */
  templates: Template[];

  /** Callback when a template is selected */
  onTemplateSelect: (template: Template) => void;

  /** Function to build formula preview string from template */
  buildFormulaPreview: (template: Template) => string;

  /** Whether to show the manage templates button */
  showManageButton?: boolean;

  /** Path to navigate to when manage button is clicked */
  manageButtonPath?: string;

  /** Title text for the chooser */
  title?: string;

  /** Subtitle/description text for the chooser */
  subtitle?: string;

  /** Default filters to apply on mount */
  defaultFilters?: FilterStateMap;

  /** Callback when manage templates button is clicked */
  onManageTemplates?: () => void;

  /** Callback when close/exit button is clicked */
  onClose?: () => void;

  /** Whether to show the external display name section */
  showExternalName?: boolean;
}
