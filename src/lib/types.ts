// TypeScript interfaces and types for Excalibrr MCP Server

export interface ComponentInfo {
  name: string;
  file: string;
  props?: Record<string, any>;
  description?: string;
  examples?: string[];
  category?: string;
}

export interface ComponentLibrary {
  components: ComponentInfo[];
  lastUpdated: string;
  libraryPath: string;
}

export interface PropInfo {
  type: string;
  required: boolean;
  description: string | null;
}

export interface DesignPattern {
  title: string;
  [complexity: string]: any;
}

export interface LayoutComposition {
  title: string;
  structure: string;
  code: string;
  components: ComponentDefinition[];
  responsiveTips: string[];
  customizations: string[];
}

export interface ComponentDefinition {
  name: string;
  purpose: string;
  props: string[];
}

export interface PreviewResult {
  success: boolean;
  imagePath?: string;
  code: string;
  notes: string[];
  htmlPath?: string;
  error?: string;
}

export interface GalleryResult {
  success: boolean;
  galleryPath?: string;
  components: GalleryComponent[];
  count?: number;
  error?: string;
}

export interface GalleryComponent {
  name: string;
  category: string;
  previewPath: string;
  propsCount: number;
}

export interface LivePreviewResult {
  success: boolean;
  previewUrl?: string;
  controls: PropControl[];
  expiresAt?: string;
  previewPath?: string;
  error?: string;
}

export interface PropControl {
  name: string;
  description: string;
  type: string;
  required: boolean;
}

export interface ComponentRelationships {
  commonlyUsedWith: RelationshipInfo[];
  containers: RelationshipInfo[];
  patterns: PatternInfo[];
}

export interface RelationshipInfo {
  component: string;
  frequency: number;
  reason: string;
  exampleUsage: string;
}

export interface PatternInfo {
  name: string;
  components: string[];
  useCase: string;
}

export type ComponentCategory =
  | "data"
  | "forms"
  | "layout"
  | "interactive"
  | "ui"
  | "all";
export type UseCase =
  | "basic"
  | "with-props"
  | "full-example"
  | "grid-with-data";
export type Theme = "light" | "dark" | "auto";
export type PreviewSize = "small" | "medium" | "large";
export type LayoutType =
  | "two-column"
  | "three-column"
  | "dashboard-grid"
  | "master-detail"
  | "sidebar-content"
  | "header-content-footer";
export type DesignPatternType =
  | "dashboard"
  | "data-table"
  | "form-with-validation"
  | "master-detail"
  | "settings-panel"
  | "user-management"
  | "data-entry"
  | "report-view";
export type ComplexityLevel = "simple" | "standard" | "advanced";
export type RelationshipType =
  | "commonly-used-with"
  | "contains"
  | "contained-by"
  | "alternatives";
