/**
 * Utility functions for building and rendering formula previews
 */

import React from 'react';
import { Template, TemplateComponent } from '../types';
import { isPlaceholder } from '../../../../pages/demos/grids/FormulaTemplates.data';

/**
 * Checks if a template contains any placeholder values in its components
 */
export function templateHasPlaceholders(template: Template): boolean {
  return template.components?.some((comp: TemplateComponent) =>
    isPlaceholder(comp.percentage) ||
    isPlaceholder(comp.source) ||
    isPlaceholder(comp.instrument) ||
    isPlaceholder(comp.dateRule) ||
    isPlaceholder(comp.type)
  ) || false;
}

/**
 * Builds a formula preview string from selected components
 */
export function buildFormulaPreviewFiltered(
  template: Template,
  selectedComponents: Record<number, boolean>
): string {
  const selected = template.components.filter((c: TemplateComponent) =>
    selectedComponents[c.id] !== false // Default to selected if not in map
  );

  if (selected.length === 0) return 'No components selected';

  return selected.map((c: TemplateComponent, i: number) =>
    `${i > 0 ? ' ' + c.operator + ' ' : ''}${c.percentage} ${c.source} ${c.instrument}`
  ).join('');
}

/**
 * Renders formula preview with placeholder highlighting
 * Placeholders are displayed in purple monospace font
 */
export function renderFormulaPreview(preview: string): React.ReactNode {
  // Split by spaces and style placeholders
  const parts = preview.split(' ');

  return parts.map((part, index) => {
    if (isPlaceholder(part)) {
      return (
        <span
          key={index}
          style={{
            color: '#722ed1',
            fontWeight: 700,
            fontFamily: 'monospace'
          }}
        >
          {part}{index < parts.length - 1 ? ' ' : ''}
        </span>
      );
    }
    return <span key={index}>{part}{index < parts.length - 1 ? ' ' : ''}</span>;
  });
}
