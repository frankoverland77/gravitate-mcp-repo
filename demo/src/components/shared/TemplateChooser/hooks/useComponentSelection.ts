/**
 * Hook for managing component selection state within templates
 */

import { useState, useEffect } from 'react';
import { Template, ComponentSelectionMap } from '../types';

export interface UseComponentSelectionReturn {
  /** Map of template IDs to component selection states */
  selectedComponents: ComponentSelectionMap;

  /** Toggle selection state of a specific component */
  toggleComponent: (templateId: string, compId: number) => void;

  /** Check if a specific component is selected */
  isComponentSelected: (templateId: string, compId: number) => boolean;

  /** Get count of selected components for a template */
  getSelectedCount: (templateId: string) => number;
}

/**
 * Manages the selection state of components within formula templates
 *
 * @param templates - Array of templates to track selection for
 * @returns Object with selection state and manipulation functions
 */
export function useComponentSelection(templates: Template[]): UseComponentSelectionReturn {
  const [selectedComponents, setSelectedComponents] = useState<ComponentSelectionMap>({});

  // Initialize all components as selected by default
  useEffect(() => {
    console.log('=== useComponentSelection: Initializing component selection ===');
    console.log('Templates received:', templates.length);

    const initialSelection: ComponentSelectionMap = {};
    templates.forEach(template => {
      console.log(`Template "${template.name}" has ${template.components?.length || 0} components`);
      initialSelection[template.id] = {};
      if (template.components && Array.isArray(template.components)) {
        template.components.forEach((comp) => {
          initialSelection[template.id][comp.id] = true;
        });
      }
    });

    console.log('Initial selection state:', initialSelection);
    setSelectedComponents(initialSelection);
  }, [templates]);

  /**
   * Toggle the selection state of a component
   */
  const toggleComponent = (templateId: string, compId: number) => {
    setSelectedComponents(prev => {
      const templateSelections = prev[templateId] || {};
      const newTemplateSelections = {
        ...templateSelections,
        [compId]: !templateSelections[compId]
      };
      return {
        ...prev,
        [templateId]: newTemplateSelections
      };
    });
  };

  /**
   * Check if a component is selected (defaults to true if not in map)
   */
  const isComponentSelected = (templateId: string, compId: number): boolean => {
    return selectedComponents[templateId]?.[compId] ?? true;
  };

  /**
   * Get the count of selected components for a template
   */
  const getSelectedCount = (templateId: string): number => {
    if (!selectedComponents[templateId]) return 0;
    return Object.values(selectedComponents[templateId]).filter(Boolean).length;
  };

  return {
    selectedComponents,
    toggleComponent,
    isComponentSelected,
    getSelectedCount
  };
}
