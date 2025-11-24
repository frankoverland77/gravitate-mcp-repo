/**
 * TemplateChooser - Main component for browsing and selecting formula templates
 * Refactored version with modular architecture
 */

import React, { useState, useMemo } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Texto } from '@gravitate-js/excalibrr';
import { TemplateChooserProps } from './types';
import { TemplateHeader } from './components/TemplateHeader';
import { TemplateCard } from './components/TemplateCard';
import { TemplateListItem } from './components/TemplateListItem';
import { useComponentSelection } from './hooks/useComponentSelection';
import { useTemplateFilters } from './hooks/useTemplateFilters';
import { useScrollControls } from './hooks/useScrollControls';
import { extractAvailableFilterFields, filterTemplates } from './utils/filterUtils';
import './styles.css';

/**
 * TemplateChooser Component
 *
 * Displays a collection of formula templates in either card or list view,
 * with search, filtering, and component selection capabilities.
 *
 * @example
 * <TemplateChooser
 *   templates={formulaTemplates}
 *   onTemplateSelect={handleSelect}
 *   buildFormulaPreview={buildPreview}
 *   showManageButton={true}
 * />
 */
export function TemplateChooser({
  templates,
  onTemplateSelect,
  buildFormulaPreview,
  showManageButton = false,
  manageButtonPath = '/ContractFormulas/FormulaTemplates',
  title = 'Formula Template Chooser',
  subtitle = 'Select a pre-built formula template to quickly apply common pricing calculations.',
  defaultFilters = {},
  onManageTemplates,
  onClose,
  showExternalName = true
}: TemplateChooserProps) {
  // View mode state
  const [templateViewMode, setTemplateViewMode] = useState<'cards' | 'list'>('cards');

  // Search state
  const [searchText, setSearchText] = useState('');

  // Custom hooks for state management
  const {
    selectedComponents,
    toggleComponent,
    isComponentSelected,
    getSelectedCount
  } = useComponentSelection(templates);

  const {
    activeFilters,
    showFilterDropdown,
    setShowFilterDropdown,
    toggleFilter,
    removeFilter,
    addFilter,
    filterDropdownRef
  } = useTemplateFilters(defaultFilters);

  const { cardsScrollRef, scrollCards } = useScrollControls();

  // Extract available filter fields from templates
  const availableFilterFields = useMemo(
    () => extractAvailableFilterFields(templates),
    [templates]
  );

  // Filter templates based on search and active filters
  const filteredTemplates = useMemo(
    () => filterTemplates(templates, searchText, activeFilters),
    [templates, searchText, activeFilters]
  );

  // Handle template selection
  const handleTemplateSelect = (template: any) => {
    const selectedComps = template.components.filter((c: any) =>
      isComponentSelected(template.id, c.id)
    );
    const templateWithSelectedComponents = {
      ...template,
      components: selectedComps
    };
    onTemplateSelect(templateWithSelectedComponents);
  };

  return (
    <div className="template-chooser-container">
      {/* Header with search, filters, and view controls */}
      <TemplateHeader
        title={title}
        subtitle={subtitle}
        templateViewMode={templateViewMode}
        onViewModeChange={setTemplateViewMode}
        searchText={searchText}
        onSearchChange={setSearchText}
        activeFilters={activeFilters}
        availableFilterFields={availableFilterFields}
        showFilterDropdown={showFilterDropdown}
        setShowFilterDropdown={setShowFilterDropdown}
        onToggleFilter={toggleFilter}
        onRemoveFilter={removeFilter}
        onAddFilter={addFilter}
        filterDropdownRef={filterDropdownRef}
        showManageButton={showManageButton}
        onManageTemplates={onManageTemplates}
        onClose={onClose}
        manageButtonPath={manageButtonPath}
      />

      {/* Content Area - Cards or List View */}
      {templateViewMode === 'cards' ? (
        /* Cards View - Horizontal Scrolling with Arrows */
        <div className="template-chooser-cards-view">
          {/* Left Arrow */}
          <div
            onClick={() => scrollCards('left')}
            className="template-chooser-scroll-arrow template-chooser-scroll-arrow-left"
          >
            <LeftOutlined style={{ fontSize: '16px', color: '#595959' }} />
          </div>

          {/* Scrollable Cards Container */}
          <div ref={cardsScrollRef} className="template-chooser-cards-scroll">
            {filteredTemplates.length === 0 ? (
              <div className="template-chooser-empty">
                <div className="template-chooser-empty-icon">📋</div>
                <div className="template-chooser-empty-title">No templates found</div>
                <div className="template-chooser-empty-description">
                  No templates match the filters you selected. Try removing some filters or
                  adjusting your selection.
                </div>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selectedComponents={selectedComponents[template.id] || {}}
                  onComponentToggle={(compId) => toggleComponent(template.id, compId)}
                  onTemplateSelect={() => handleTemplateSelect(template)}
                  getSelectedCount={() => getSelectedCount(template.id)}
                  showExternalName={showExternalName}
                />
              ))
            )}
          </div>

          {/* Right Arrow */}
          <div
            onClick={() => scrollCards('right')}
            className="template-chooser-scroll-arrow template-chooser-scroll-arrow-right"
          >
            <RightOutlined style={{ fontSize: '16px', color: '#595959' }} />
          </div>
        </div>
      ) : (
        /* List View - Vertical Stacking */
        <div className="template-chooser-list-view">
          {filteredTemplates.length === 0 ? (
            <div className="template-chooser-empty">
              <div className="template-chooser-empty-icon">📋</div>
              <div className="template-chooser-empty-title">No templates found</div>
              <div className="template-chooser-empty-description">
                No templates match the filters you selected. Try removing some filters or
                adjusting your selection.
              </div>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <TemplateListItem
                key={template.id}
                template={template}
                selectedComponents={selectedComponents[template.id] || {}}
                onComponentToggle={(compId) => toggleComponent(template.id, compId)}
                onTemplateSelect={() => handleTemplateSelect(template)}
                getSelectedCount={() => getSelectedCount(template.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
