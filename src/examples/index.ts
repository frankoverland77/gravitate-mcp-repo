// Examples Entry Point - Export all component examples and patterns

import { GRAVI_GRID_EXAMPLES } from "./components/GraviGrid/index.js";
import { GRAVIBUTTON_EXAMPLES } from "./components/GraviButton/index.js";
import { HORIZONTAL_EXAMPLES } from "./components/Horizontal/index.js";
import { VERTICAL_EXAMPLES } from "./components/Vertical/index.js";
import { TEXTO_EXAMPLES } from "./components/Texto/index.js";
import { DASHBOARD_PATTERNS } from "./patterns/dashboard/index.js";

export interface ComponentExample {
  name: string;
  description: string;
  code: string;
  category: string;
  complexity: "basic" | "intermediate" | "advanced";
  tags?: string[];
}

// Utility functions
export function getExamplesForComponent(
  componentName: string
): ComponentExample[] {
  const exampleMap: Record<string, ComponentExample[]> = {
    GraviGrid: GRAVI_GRID_EXAMPLES,
    GraviButton: GRAVIBUTTON_EXAMPLES,
    Horizontal: HORIZONTAL_EXAMPLES,
    Vertical: VERTICAL_EXAMPLES,
    Texto: TEXTO_EXAMPLES,
  };

  return exampleMap[componentName] || [];
}

export function getAllPatterns(): ComponentExample[] {
  return [...DASHBOARD_PATTERNS];
}

export function getAllExamples(): ComponentExample[] {
  return [
    ...GRAVI_GRID_EXAMPLES,
    ...GRAVIBUTTON_EXAMPLES,
    ...HORIZONTAL_EXAMPLES,
    ...VERTICAL_EXAMPLES,
    ...TEXTO_EXAMPLES,
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
