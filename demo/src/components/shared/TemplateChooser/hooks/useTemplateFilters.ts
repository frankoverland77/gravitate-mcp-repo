/**
 * Hook for managing template filter state and actions
 */

import { useState, useEffect, useRef } from 'react';
import { FilterStateMap } from '../types';

export interface UseTemplateFiltersReturn {
  /** Current active filters and their enabled state */
  activeFilters: FilterStateMap;

  /** Whether the filter dropdown is visible */
  showFilterDropdown: boolean;

  /** Set the filter dropdown visibility */
  setShowFilterDropdown: (visible: boolean) => void;

  /** Toggle a filter's enabled state */
  toggleFilter: (filterKey: string) => void;

  /** Remove a filter from active filters */
  removeFilter: (filterKey: string) => void;

  /** Add a new filter to active filters */
  addFilter: (filterKey: string, filterValue: string) => void;

  /** Ref for the filter dropdown element (for click-outside detection) */
  filterDropdownRef: React.RefObject<HTMLDivElement>;
}

/**
 * Manages filter state and provides filter manipulation functions
 *
 * @param defaultFilters - Initial filters to apply on mount
 * @returns Object with filter state and manipulation functions
 */
export function useTemplateFilters(
  defaultFilters: FilterStateMap = {}
): UseTemplateFiltersReturn {
  const [activeFilters, setActiveFilters] = useState<FilterStateMap>(defaultFilters);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Toggle the enabled state of a filter
   */
  const toggleFilter = (filterKey: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        enabled: !prev[filterKey].enabled
      }
    }));
  };

  /**
   * Remove a filter from the active filters
   */
  const removeFilter = (filterKey: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  /**
   * Add a new filter to the active filters
   */
  const addFilter = (filterKey: string, filterValue: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: { value: filterValue, enabled: true }
    }));
    setShowFilterDropdown(false);
  };

  return {
    activeFilters,
    showFilterDropdown,
    setShowFilterDropdown,
    toggleFilter,
    removeFilter,
    addFilter,
    filterDropdownRef
  };
}
