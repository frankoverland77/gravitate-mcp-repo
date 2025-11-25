/**
 * Header component for the TemplateChooser with search, filters, and view controls
 */

import { Segmented, Input } from 'antd';
import { SearchOutlined, ExportOutlined, LeftOutlined } from '@ant-design/icons';
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
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
  manageButtonPath,
}: TemplateHeaderProps) {
  return (
    <>
      {/* Title and Manage Button Row */}
      <Horizontal
        justifyContent="space-between"
        alignItems="flex-start"
        className="template-header-title-row"
      >
        <Vertical className="template-header-title-column">
          <Texto category="h3" weight="bold">
            {title}
          </Texto>
          <Texto category="p1" appearance="hint">
            {subtitle}
          </Texto>
        </Vertical>

        {showManageButton && (
          <Horizontal verticalCenter className="template-header-actions">
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
              className="template-header-manage-button"
            />
            {onClose && (
              <Horizontal verticalCenter className="template-header-exit-link" onClick={onClose}>
                <LeftOutlined />
                <Texto category="p1">Exit Templates</Texto>
              </Horizontal>
            )}
          </Horizontal>
        )}
      </Horizontal>

      {/* Segmented Tabs, Search, and Filters Row */}
      <Horizontal verticalCenter className="template-header-controls-row">
        {/* Segmented Tabs - Left Side */}
        <Segmented
          options={[
            { label: 'Cards', value: 'cards' },
            { label: 'List', value: 'list' },
          ]}
          value={templateViewMode}
          onChange={(value) => onViewModeChange(value as TemplateViewMode)}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />

        {/* Search Input - Middle */}
        <Input
          placeholder="Search templates..."
          prefix={<SearchOutlined className="template-header-search-icon" />}
          allowClear
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="template-header-search"
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
      </Horizontal>
    </>
  );
}
