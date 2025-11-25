/**
 * List view display for a single template
 */

import { Tag } from 'antd';
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Template } from '../types';
import { ComponentItem } from './ComponentItem';
import { FormulaPreview } from './FormulaPreview';
import { templateHasPlaceholders, buildFormulaPreviewFiltered } from '../utils/formulaPreview';

export interface TemplateListItemProps {
  /** The template to display */
  template: Template;

  /** Component selection state for this template */
  selectedComponents: Record<number, boolean>;

  /** Callback when a component is toggled */
  onComponentToggle: (compId: number) => void;

  /** Callback when template is selected */
  onTemplateSelect: () => void;

  /** Get the count of selected components */
  getSelectedCount: () => number;
}

/**
 * Renders a template as a list item in the vertical scrolling view
 */
export function TemplateListItem({
  template,
  selectedComponents,
  onComponentToggle,
  onTemplateSelect,
  getSelectedCount,
}: TemplateListItemProps) {
  const hasPlaceholders = templateHasPlaceholders(template);
  const previewText = buildFormulaPreviewFiltered(template, selectedComponents);

  const containerClass = hasPlaceholders
    ? 'template-list-item template-list-item-has-placeholders'
    : 'template-list-item';

  return (
    <div className={containerClass}>
      {/* List Card Header */}
      <div className="template-list-item-header">
        <Vertical flex="1">
          <Horizontal verticalCenter className="gap-12 mb-1">
            <Texto className="template-list-item-name">{template.name}</Texto>
            {hasPlaceholders && (
              <Tag className="template-list-item-placeholder-tag">PLACEHOLDERS</Tag>
            )}
          </Horizontal>
          <Texto className="template-list-item-subtitle">
            {template.contractType} • {template.usedInLocations?.join(', ') || 'N/A'}
          </Texto>
        </Vertical>
        <Horizontal verticalCenter className="gap-16">
          <Texto className="template-list-item-selected-count">
            {getSelectedCount()} components selected
          </Texto>
          <GraviButton
            buttonText="Select Template"
            appearance="success"
            onClick={onTemplateSelect}
          />
        </Horizontal>
      </div>

      {/* List Card Content */}
      <Vertical className="p-4">
        {/* Components Grid */}
        <div className="template-list-item-components-grid">
          {template.components.map((comp) => (
            <ComponentItem
              key={comp.id}
              component={comp}
              isSelected={selectedComponents[comp.id] !== false}
              onToggle={() => onComponentToggle(comp.id)}
              compact={false}
            />
          ))}
        </div>

        {/* Formula Preview */}
        <FormulaPreview previewText={previewText} title="Formula Preview" compact={true} />
      </Vertical>
    </div>
  );
}
