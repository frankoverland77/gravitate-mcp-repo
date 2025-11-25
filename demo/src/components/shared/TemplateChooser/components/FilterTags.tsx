/**
 * Component for displaying and managing filter tags
 */

import React from 'react';
import { Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Texto } from '@gravitate-js/excalibrr';
import { FilterField, FilterStateMap } from '../types';
import { getUnusedFilters } from '../utils/filterUtils';

export interface FilterTagsProps {
  /** Currently active filters */
  activeFilters: FilterStateMap;

  /** All available filter fields */
  availableFilterFields: FilterField[];

  /** Whether the filter dropdown is visible */
  showFilterDropdown: boolean;

  /** Set dropdown visibility */
  setShowFilterDropdown: (visible: boolean) => void;

  /** Toggle a filter's enabled state */
  onToggleFilter: (filterKey: string) => void;

  /** Remove a filter */
  onRemoveFilter: (filterKey: string) => void;

  /** Add a new filter */
  onAddFilter: (filterKey: string, value: string) => void;

  /** Ref for the dropdown container (for click-outside detection) */
  filterDropdownRef: React.RefObject<HTMLDivElement>;
}

/**
 * Displays active filter tags with ability to add new filters
 */
export function FilterTags({
  activeFilters,
  availableFilterFields,
  showFilterDropdown,
  setShowFilterDropdown,
  onToggleFilter,
  onRemoveFilter,
  onAddFilter,
  filterDropdownRef,
}: FilterTagsProps) {
  const unusedFilters = getUnusedFilters(availableFilterFields, activeFilters);

  return (
    <div className="filter-tags-container">
      <Texto className="filter-tags-label">Auto Filters:</Texto>

      <div className="filter-tags-list">
        {/* Active filter tags */}
        {Object.entries(activeFilters).map(([key, filter]) => {
          const filterDef = availableFilterFields.find((f) => f.key === key);
          const tagClass = filter.enabled ? 'filter-tag filter-tag-enabled' : 'filter-tag';

          return (
            <Tag
              key={key}
              onClick={() => onToggleFilter(key)}
              closable
              onClose={(e) => {
                e.preventDefault();
                onRemoveFilter(key);
              }}
              className={tagClass}
            >
              <strong>{filterDef?.label}:</strong> {filter.value}
            </Tag>
          );
        })}

        {/* Add Filter Button */}
        <div ref={filterDropdownRef} className="filter-add-button-container">
          <div
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="filter-add-button"
          >
            <PlusOutlined className="filter-add-button-icon" />
          </div>

          {/* Filter Dropdown */}
          {showFilterDropdown && unusedFilters.length > 0 && (
            <div className="filter-dropdown">
              {unusedFilters.map((filter) => (
                <div
                  key={filter.key}
                  onClick={() => onAddFilter(filter.key, filter.value)}
                  className="filter-dropdown-item"
                >
                  <span className="filter-dropdown-item-label">{filter.label}:</span>{' '}
                  <span className="filter-dropdown-item-value">{filter.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
