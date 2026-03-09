/**
 * Card view display for a single template
 */

import { Tag } from 'antd';
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Template } from '../types';
import { ComponentItem } from './ComponentItem';
import { FormulaPreview } from './FormulaPreview';
import { templateHasPlaceholders, buildFormulaPreviewFiltered } from '../utils/formulaPreview';
import './TemplateCard.css';

export interface TemplateCardProps {
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

  /** Whether to show external name section */
  showExternalName: boolean;
}

interface CardHeaderProps {
  template: Template;
  hasPlaceholders: boolean;
}

function CardHeader({ template, hasPlaceholders }: CardHeaderProps) {
  return (
    <div className="template-card-header">
      <Horizontal verticalCenter className="mb-2" gap={8}>
        <Texto className="template-card-title">{template.name}</Texto>
        {hasPlaceholders && <Tag className="template-card-placeholder-tag">PLACEHOLDERS</Tag>}
      </Horizontal>

      <Vertical className="mb-1">
        <Texto className="template-card-field-label">Type:</Texto>
        <Texto className="template-card-field-value">{template.contractType}</Texto>
      </Vertical>

      <Vertical className="mb-1">
        <Texto className="template-card-field-label">Location:</Texto>
        <Texto className="template-card-field-value">
          {template.usedInLocations?.join(', ') || 'N/A'}
        </Texto>
      </Vertical>

      <Vertical>
        <Texto className="template-card-field-label">Products:</Texto>
        <Texto className="template-card-field-value">
          {template.usedInProducts?.join(', ') || 'N/A'}
        </Texto>
      </Vertical>
    </div>
  );
}

interface CardContentProps {
  template: Template;
  selectedComponents: Record<number, boolean>;
  onComponentToggle: (compId: number) => void;
  getSelectedCount: () => number;
  previewText: string;
  showExternalName: boolean;
}

function CardContent({
  template,
  selectedComponents,
  onComponentToggle,
  getSelectedCount,
  previewText,
  showExternalName,
}: CardContentProps) {
  return (
    <div className="template-card-content">
      <div className="template-card-components-header">
        <Texto className="template-card-components-label">Select Components:</Texto>
        <Texto className="template-card-components-count">{getSelectedCount()} selected</Texto>
      </div>

      <div className="template-card-components-list">
        {(template.components || []).map((comp) => (
          <ComponentItem
            key={comp.id}
            component={comp}
            isSelected={selectedComponents[comp.id] !== false}
            onToggle={() => onComponentToggle(comp.id)}
            compact={true}
          />
        ))}
      </div>

      <FormulaPreview
        previewText={previewText}
        showExternalName={showExternalName}
        compact={false}
      />
    </div>
  );
}

interface CardFooterProps {
  onTemplateSelect: () => void;
}

function CardFooter({ onTemplateSelect }: CardFooterProps) {
  return (
    <Vertical className="p-3">
      <GraviButton
        buttonText="Select Template"
        appearance="success"
        onClick={onTemplateSelect}
        className="template-card-select-button"
      />
    </Vertical>
  );
}

/**
 * Renders a template as a card in the horizontal scrolling view
 */
export function TemplateCard({
  template,
  selectedComponents,
  onComponentToggle,
  onTemplateSelect,
  getSelectedCount,
  showExternalName,
}: TemplateCardProps) {
  const hasPlaceholders = templateHasPlaceholders(template);
  const previewText = buildFormulaPreviewFiltered(template, selectedComponents);

  const cardClassName = hasPlaceholders
    ? 'template-card template-card-has-placeholders'
    : 'template-card';

  return (
    <div className={cardClassName}>
      <CardHeader template={template} hasPlaceholders={hasPlaceholders} />
      <CardContent
        template={template}
        selectedComponents={selectedComponents}
        onComponentToggle={onComponentToggle}
        getSelectedCount={getSelectedCount}
        previewText={previewText}
        showExternalName={showExternalName}
      />
      <CardFooter onTemplateSelect={onTemplateSelect} />
    </div>
  );
}
