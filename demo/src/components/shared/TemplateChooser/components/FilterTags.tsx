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
  filterDropdownRef
}: FilterTagsProps) {
  const unusedFilters = getUnusedFilters(availableFilterFields, activeFilters);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
      position: 'relative'
    }}>
      <Texto style={{
        margin: 0,
        color: '#595959',
        fontSize: '11px',
        fontWeight: 'normal',
        whiteSpace: 'nowrap'
      }}>
        Auto Filters:
      </Texto>

      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Active filter tags */}
        {Object.entries(activeFilters).map(([key, filter]) => {
          const filterDef = availableFilterFields.find(f => f.key === key);
          const isEnabled = filter.enabled;

          return (
            <Tag
              key={key}
              onClick={() => onToggleFilter(key)}
              closable
              onClose={(e) => {
                e.preventDefault();
                onRemoveFilter(key);
              }}
              style={{
                backgroundColor: isEnabled ? '#e8e8e8' : '#f5f5f5',
                color: isEnabled ? '#3d3d3d' : '#8c8c8c',
                border: `1px solid ${isEnabled ? '#bfbfbf' : '#d9d9d9'}`,
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '10px',
                cursor: 'pointer',
                opacity: isEnabled ? 1 : 0.5,
                transition: 'all 0.2s',
                margin: 0
              }}
            >
              <strong>{filterDef?.label}:</strong> {filter.value}
            </Tag>
          );
        })}

        {/* Add Filter Button */}
        <div
          ref={filterDropdownRef}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <div
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#e8e8e8',
              border: '1px solid #bfbfbf',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d9d9d9';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e8e8e8';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <PlusOutlined style={{ fontSize: '10px', color: '#3d3d3d', fontWeight: 'bold' }} />
          </div>

          {/* Filter Dropdown */}
          {showFilterDropdown && unusedFilters.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              backgroundColor: 'white',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '220px',
              maxHeight: '250px',
              overflowY: 'auto'
            }}>
              {unusedFilters.map((filter, index) => (
                <div
                  key={filter.key}
                  onClick={() => onAddFilter(filter.key, filter.value)}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: '#262626',
                    borderBottom: index < unusedFilters.length - 1 ? '1px solid #f0f0f0' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <strong style={{ color: '#3d3d3d' }}>{filter.label}:</strong>{' '}
                  <span style={{ color: '#595959' }}>{filter.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
