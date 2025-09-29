/**
 * Component Registry
 * Main registry system for Excalibrr components
 */

import { ComponentMetadata, RegistryIndex, SearchOptions } from "./types.js";
import { componentRegistry } from "./components/index.js";

/**
 * Get the full registry index
 */
export function getRegistryIndex(): RegistryIndex {
  return {
    components: componentRegistry,
    lastUpdated: new Date().toISOString(),
    version: "1.0.0",
  };
}

/**
 * List all components with optional filtering
 */
export function listComponents(options?: SearchOptions): ComponentMetadata[] {
  let results = [...componentRegistry];

  // Filter by category
  if (options?.category) {
    results = results.filter((c) => c.category === options.category);
  }

  // Filter by complexity
  if (options?.complexity) {
    results = results.filter((c) => c.complexity === options.complexity);
  }

  // Filter by tags
  if (options?.tags && options.tags.length > 0) {
    results = results.filter((c) =>
      options.tags!.some((tag) => c.tags.includes(tag))
    );
  }

  // Limit results
  if (options?.limit && options.limit > 0) {
    results = results.slice(0, options.limit);
  }

  return results;
}

/**
 * Search components by query
 */
export function searchComponents(options: SearchOptions): ComponentMetadata[] {
  let results = [...componentRegistry];

  // Search by query (name, description, tags)
  if (options.query) {
    const query = options.query.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Apply other filters
  return listComponents({ ...options, limit: undefined }).filter((c) =>
    results.some((r) => r.id === c.id)
  );
}

/**
 * Get a specific component by ID
 */
export function getComponent(componentId: string): ComponentMetadata | null {
  return componentRegistry.find((c) => c.id === componentId) || null;
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): ComponentMetadata[] {
  return componentRegistry.filter((c) => c.category === category);
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  const categories = new Set(componentRegistry.map((c) => c.category));
  return Array.from(categories).sort();
}

/**
 * Get all available tags
 */
export function getTags(): string[] {
  const tags = new Set(componentRegistry.flatMap((c) => c.tags));
  return Array.from(tags).sort();
}

export * from "./types.js";