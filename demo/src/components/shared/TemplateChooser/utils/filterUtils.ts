/**
 * Utility functions for template filtering
 */

import { Template, FilterField, FilterStateMap } from '../types';

/**
 * Extracts available filter fields from templates
 * Dynamically builds filter options based on template data
 */
export function extractAvailableFilterFields(templates: Template[]): FilterField[] {
  const fields: FilterField[] = [];
  const seenFilters = new Set<string>();

  templates.forEach(template => {
    // Extract contract type filters
    if (template.contractType && !seenFilters.has(`contractType-${template.contractType}`)) {
      fields.push({
        key: `contractType-${template.contractType}`,
        label: 'Contract Type',
        value: template.contractType
      });
      seenFilters.add(`contractType-${template.contractType}`);
    }

    // Extract location filters
    if (template.usedInLocations && Array.isArray(template.usedInLocations)) {
      template.usedInLocations.forEach((location: string) => {
        if (!seenFilters.has(`location-${location}`)) {
          fields.push({
            key: `location-${location}`,
            label: 'Location',
            value: location
          });
          seenFilters.add(`location-${location}`);
        }
      });
    }
  });

  return fields;
}

/**
 * Filters templates based on search text and active filters
 */
export function filterTemplates(
  templates: Template[],
  searchText: string,
  activeFilters: FilterStateMap
): Template[] {
  let filtered = templates;

  // Apply search filter
  if (searchText.trim()) {
    const searchLower = searchText.toLowerCase();
    filtered = filtered.filter(template => {
      const nameMatch = template.name?.toLowerCase().includes(searchLower);
      const contractTypeMatch = template.contractType?.toLowerCase().includes(searchLower);
      const locationMatch = template.usedInLocations?.some((loc: string) =>
        loc.toLowerCase().includes(searchLower)
      );
      const productMatch = template.usedInProducts?.some((prod: string) =>
        prod.toLowerCase().includes(searchLower)
      );

      return nameMatch || contractTypeMatch || locationMatch || productMatch;
    });
  }

  // Apply active filters
  const enabledFilters = Object.entries(activeFilters)
    .filter(([_, filter]) => filter.enabled)
    .map(([key, filter]) => ({ key, value: filter.value }));

  if (enabledFilters.length > 0) {
    filtered = filtered.filter(template => {
      return enabledFilters.every(filter => {
        if (filter.key.startsWith('contractType-')) {
          return template.contractType === filter.value;
        }
        if (filter.key.startsWith('location-')) {
          return template.usedInLocations && template.usedInLocations.includes(filter.value);
        }
        return true;
      });
    });
  }

  return filtered;
}

/**
 * Gets filter fields that are not currently in the active filters
 */
export function getUnusedFilters(
  availableFilterFields: FilterField[],
  activeFilters: FilterStateMap
): FilterField[] {
  return availableFilterFields.filter(f => !activeFilters[f.key]);
}
