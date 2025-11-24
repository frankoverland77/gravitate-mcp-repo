/**
 * Card view display for a single template
 */

import React from 'react';
import { Tag } from 'antd';
import { Texto, GraviButton } from '@gravitate-js/excalibrr';
import { Template } from '../types';
import { ComponentItem } from './ComponentItem';
import { FormulaPreview } from './FormulaPreview';
import { templateHasPlaceholders, buildFormulaPreviewFiltered } from '../utils/formulaPreview';

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

/**
 * Renders a template as a card in the horizontal scrolling view
 */
export function TemplateCard({
  template,
  selectedComponents,
  onComponentToggle,
  onTemplateSelect,
  getSelectedCount,
  showExternalName
}: TemplateCardProps) {
  const hasPlaceholders = templateHasPlaceholders(template);
  const previewText = buildFormulaPreviewFiltered(template, selectedComponents);

  return (
    <div
      style={{
        width: '320px',
        height: '480px',
        minWidth: '320px',
        backgroundColor: 'white',
        border: '1px solid #d9d9d9',
        borderLeft: hasPlaceholders ? '3px solid #722ed1' : '1px solid #d9d9d9',
        borderRadius: '8px',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        zIndex: 1
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      {/* Card Header */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '12px',
        borderBottom: '1px solid #e9ecef',
        flexShrink: 0
      }}>
        {/* Display Name with Placeholder Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Texto style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            lineHeight: '18px',
            flex: 1
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
              fontSize: '9px',
              fontWeight: 600,
              padding: '2px 6px',
              lineHeight: '12px'
            }}>
              PLACEHOLDERS
            </Tag>
          )}
        </div>

        {/* Type */}
        <div style={{ marginBottom: '6px' }}>
          <Texto style={{
            margin: 0,
            fontSize: '10px',
            fontWeight: '600',
            color: '#8c8c8c',
            lineHeight: '14px'
          }}>
            Type:
          </Texto>
          <Texto style={{ margin: 0, fontSize: '11px', color: '#333', lineHeight: '16px' }}>
            {template.contractType}
          </Texto>
        </div>

        {/* Location */}
        <div style={{ marginBottom: '6px' }}>
          <Texto style={{
            margin: 0,
            fontSize: '10px',
            fontWeight: '600',
            color: '#8c8c8c',
            lineHeight: '14px'
          }}>
            Location:
          </Texto>
          <Texto style={{ margin: 0, fontSize: '11px', color: '#333', lineHeight: '16px' }}>
            {template.usedInLocations?.join(', ') || 'N/A'}
          </Texto>
        </div>

        {/* Products */}
        <div>
          <Texto style={{
            margin: 0,
            fontSize: '10px',
            fontWeight: '600',
            color: '#8c8c8c',
            lineHeight: '14px'
          }}>
            Products:
          </Texto>
          <Texto style={{ margin: 0, fontSize: '11px', color: '#333', lineHeight: '16px' }}>
            {template.usedInProducts?.join(', ') || 'N/A'}
          </Texto>
        </div>
      </div>

      {/* Card Content */}
      <div style={{
        padding: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Components Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          flexShrink: 0
        }}>
          <Texto style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: '#333' }}>
            Select Components:
          </Texto>
          <Texto style={{ margin: 0, fontSize: '10px', fontWeight: '600', color: '#1890ff' }}>
            {getSelectedCount()} selected
          </Texto>
        </div>

        {/* Scrollable Components List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: '8px',
          border: '1px solid #e9ecef',
          borderRadius: '6px',
          backgroundColor: '#fafafa',
          padding: '6px',
          minHeight: 0
        }}>
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

        {/* Formula Preview */}
        <FormulaPreview
          previewText={previewText}
          showExternalName={showExternalName}
          compact={false}
        />
      </div>

      {/* Card Footer */}
      <div style={{ padding: '12px', flexShrink: 0 }}>
        <GraviButton
          buttonText="Select Template"
          appearance="success"
          onClick={onTemplateSelect}
          style={{ width: '100%', fontSize: '12px' }}
        />
      </div>
    </div>
  );
}
