/**
 * Header component for the TemplateChooser with search, filters, and view controls
 */

import React from 'react';
import { Segmented, Input } from 'antd';
import { SearchOutlined, ExportOutlined, LeftOutlined } from '@ant-design/icons';
import { Texto, GraviButton } from '@gravitate-js/excalibrr';
import { FilterTags } from './FilterTags';
import { FilterField, FilterStateMap, TemplateViewMode } from '../types';

export interface TemplateHeaderProps {
  /** Title text for the chooser */
  title: string;

  /** Subtitle/description text */
  subtitle: string;

  /** Current view mode */
  templateViewMode: TemplateViewMode;

  /** Callback when view mode changes */
  onViewModeChange: (mode: TemplateViewMode) => void;

  /** Current search text */
  searchText: string;

  /** Callback when search text changes */
  onSearchChange: (text: string) => void;

  /** Active filters */
  activeFilters: FilterStateMap;

  /** Available filter fields */
  availableFilterFields: FilterField[];

  /** Whether filter dropdown is visible */
  showFilterDropdown: boolean;

  /** Set filter dropdown visibility */
  setShowFilterDropdown: (visible: boolean) => void;

  /** Toggle filter enabled state */
  onToggleFilter: (filterKey: string) => void;

  /** Remove a filter */
  onRemoveFilter: (filterKey: string) => void;

  /** Add a new filter */
  onAddFilter: (filterKey: string, value: string) => void;

  /** Ref for filter dropdown */
  filterDropdownRef: React.RefObject<HTMLDivElement>;

  /** Whether to show manage button */
  showManageButton: boolean;

  /** Manage button click handler */
  onManageTemplates?: () => void;

  /** Close button handler */
  onClose?: () => void;

  /** Path for manage button */
  manageButtonPath: string;
}

/**
 * Header section with title, search, filters, and view controls
 */
export function TemplateHeader({
  title,
  subtitle,
  templateViewMode,
  onViewModeChange,
  searchText,
  onSearchChange,
  activeFilters,
  availableFilterFields,
  showFilterDropdown,
  setShowFilterDropdown,
  onToggleFilter,
  onRemoveFilter,
  onAddFilter,
  filterDropdownRef,
  showManageButton,
  onManageTemplates,
  onClose,
  manageButtonPath
}: TemplateHeaderProps) {
  return (
    <>
      {/* Title and Manage Button Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Texto style={{
            margin: 0,
            color: '#262626',
            fontSize: '20px',
            fontWeight: 'bold',
            lineHeight: '28px'
          }}>
            {title}
          </Texto>
          <Texto style={{
            margin: 0,
            color: '#8c8c8c',
            fontSize: '14px',
            lineHeight: '22px'
          }}>
            {subtitle}
          </Texto>
        </div>

        {showManageButton && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <GraviButton
              buttonText="Manage Formula Templates"
              icon={<ExportOutlined />}
              appearance="outlined"
              onClick={() => {
                if (onManageTemplates) {
                  onManageTemplates();
                } else {
                  window.open(manageButtonPath, '_blank');
                }
              }}
              style={{
                fontWeight: 'bold',
                borderColor: '#1890ff',
                color: '#1890ff'
              }}
            />
            {onClose && (
              <div
                style={{
                  cursor: 'pointer',
                  color: '#595959',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onClick={onClose}
              >
                <LeftOutlined style={{ fontSize: '12px' }} />
                <span>Exit Templates</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Segmented Tabs, Search, and Filters Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Segmented Tabs - Left Side */}
        <Segmented
          options={[
            { label: 'Cards', value: 'cards' },
            { label: 'List', value: 'list' }
          ]}
          value={templateViewMode}
          onChange={(value) => onViewModeChange(value as TemplateViewMode)}
        />

        {/* Search Input - Middle */}
        <Input
          placeholder="Search templates..."
          prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
          allowClear
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '300px',
            borderRadius: '6px'
          }}
        />

        {/* Filter Tags - Right Side */}
        <FilterTags
          activeFilters={activeFilters}
          availableFilterFields={availableFilterFields}
          showFilterDropdown={showFilterDropdown}
          setShowFilterDropdown={setShowFilterDropdown}
          onToggleFilter={onToggleFilter}
          onRemoveFilter={onRemoveFilter}
          onAddFilter={onAddFilter}
          filterDropdownRef={filterDropdownRef}
        />
      </div>
    </>
  );
}
