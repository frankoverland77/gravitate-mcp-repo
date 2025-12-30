// Examples Entry Point - Export all component examples and patterns

import { GRAVI_GRID_EXAMPLES } from "./components/GraviGrid/index.js";
import { COLDEFS_EXAMPLES } from "./components/GraviGrid/colDefs.js";
import { GraviButtonExamples } from "./components/GraviButton/index.js";
import { BBDTagExamples } from "./components/BBDTag/index.js";
import { ModalExamples } from "./components/Modal/index.js";
import { PopoverExamples } from "./components/Popover/index.js";
import { HORIZONTAL_EXAMPLES } from "./components/Horizontal/index.js";
import { VERTICAL_EXAMPLES } from "./components/Vertical/index.js";
import { TextoExamples } from "./components/Texto/index.js";
import { SelectExamples } from "./components/Select/index.js";
import { FormExamples } from "./components/Form/index.js";
import { DASHBOARD_PATTERNS } from "./patterns/dashboard/index.js";
import { BULK_CHANGE_PATTERNS } from "./patterns/bulk-change/index.js";

export interface ComponentExample {
  id?: string;
  name: string;
  description: string;
  code: string;
  category?: string;
  complexity: "simple" | "medium" | "complex";
  tags?: string[];
  props?: Record<string, any>;
  dependencies?: string[];
  notes?: string;
  sourceFile?: string;
}

export interface ColumnDefsExample {
  id: string;
  name: string;
  description: string;
  complexity: "simple" | "medium" | "complex";
  category?: string;
  tags: string[];
  code: string;
  props: Record<string, any>;
  dependencies?: string[];
  notes?: string;
  sourceFile?: string;
}

// Utility functions
export function getExamplesForComponent(
  componentName: string
): ComponentExample[] {
  const exampleMap: Record<string, ComponentExample[]> = {
    GraviGrid: GRAVI_GRID_EXAMPLES,
    GraviButton: GraviButtonExamples,
    BBDTag: BBDTagExamples,
    Modal: ModalExamples,
    Popover: PopoverExamples,
    Horizontal: HORIZONTAL_EXAMPLES,
    Vertical: VERTICAL_EXAMPLES,
    Texto: TextoExamples,
    Select: SelectExamples,
    Form: FormExamples,
  };

  return exampleMap[componentName] || [];
}

export function getAllPatterns(): ComponentExample[] {
  return [...DASHBOARD_PATTERNS, ...BULK_CHANGE_PATTERNS];
}

export function getAllExamples(): ComponentExample[] {
  return [
    ...GRAVI_GRID_EXAMPLES,
    ...GraviButtonExamples,
    ...BBDTagExamples,
    ...ModalExamples,
    ...PopoverExamples,
    ...HORIZONTAL_EXAMPLES,
    ...VERTICAL_EXAMPLES,
    ...TextoExamples,
    ...SelectExamples,
    ...FormExamples,
    ...getAllPatterns(),
  ];
}

export function getExamplesByCategory(category: string): ComponentExample[] {
  return getAllExamples().filter((example) => example.category === category);
}

export function getExamplesByComplexity(
  complexity: ComponentExample["complexity"]
): ComponentExample[] {
  return getAllExamples().filter(
    (example) => example.complexity === complexity
  );
}

// Column Definitions specific functions
export function getAllColumnDefExamples(): ColumnDefsExample[] {
  return COLDEFS_EXAMPLES;
}

export function getColumnDefExamplesByComplexity(
  complexity: ColumnDefsExample["complexity"]
): ColumnDefsExample[] {
  return COLDEFS_EXAMPLES.filter(
    (example) => example.complexity === complexity
  );
}

export function getColumnDefExamplesByCategory(
  category: string
): ColumnDefsExample[] {
  return COLDEFS_EXAMPLES.filter((example) => example.category === category);
}

export function getColumnDefExamplesByTag(tag: string): ColumnDefsExample[] {
  return COLDEFS_EXAMPLES.filter((example) => example.tags.includes(tag));
}

// Export all examples
export {
  GRAVI_GRID_EXAMPLES,
  COLDEFS_EXAMPLES,
  GraviButtonExamples,
  BBDTagExamples,
  ModalExamples,
  PopoverExamples,
  HORIZONTAL_EXAMPLES,
  VERTICAL_EXAMPLES,
  TextoExamples,
  SelectExamples,
  FormExamples,
  DASHBOARD_PATTERNS,
  BULK_CHANGE_PATTERNS,
};
