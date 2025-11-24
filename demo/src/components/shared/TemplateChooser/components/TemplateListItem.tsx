/**
 * List view display for a single template
 */

import React from 'react';
import { Tag } from 'antd';
import { Texto, GraviButton } from '@gravitate-js/excalibrr';
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
  getSelectedCount
}: TemplateListItemProps) {
  const hasPlaceholders = templateHasPlaceholders(template);
  const previewText = buildFormulaPreviewFiltered(template, selectedComponents);

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'white',
        border: '1px solid #d9d9d9',
        borderLeft: hasPlaceholders ? '3px solid #722ed1' : '1px solid #d9d9d9',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
    >
      {/* List Card Header */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '16px 20px',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <Texto style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a1a1a',
              lineHeight: '22px'
            }}>
              {template.name}
            </Texto>
            {hasPlaceholders && (
              <Tag style={{
                margin: 0,
                backgroundColor: '#f3e8ff',
                color: '#722ed1',
                border: '1px solid #d3adf7',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 8px'
              }}>
                PLACEHOLDERS
              </Tag>
            )}
          </div>
          <Texto style={{ margin: 0, fontSize: '12px', color: '#666', lineHeight: '16px' }}>
            {template.contractType} • {template.usedInLocations?.join(', ') || 'N/A'}
          </Texto>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Texto style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1890ff' }}>
            {getSelectedCount()} components selected
          </Texto>
          <GraviButton
            buttonText="Select Template"
            appearance="success"
            onClick={onTemplateSelect}
            style={{ fontSize: '12px' }}
          />
        </div>
      </div>

      {/* List Card Content */}
      <div style={{ padding: '16px' }}>
        {/* Components Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px',
          marginBottom: '16px'
        }}>
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
        <FormulaPreview
          previewText={previewText}
          title="Formula Preview"
          compact={true}
        />
      </div>
    </div>
  );
}
