/**
 * Reusable component for displaying a single formula component
 * Used in both card and list views
 */

import React from 'react';
import { Checkbox } from 'antd';
import { Texto } from '@gravitate-js/excalibrr';
import { TemplateComponent } from '../types';
import { isPlaceholder } from '../../../../pages/demos/grids/FormulaTemplates.data';

export interface ComponentItemProps {
  /** The component data to display */
  component: TemplateComponent;

  /** Whether this component is selected */
  isSelected: boolean;

  /** Callback when selection changes */
  onToggle: () => void;

  /** Compact mode for card view (smaller text) */
  compact?: boolean;
}

/**
 * Renders a single formula component with selection checkbox
 */
export function ComponentItem({
  component,
  isSelected,
  onToggle,
  compact = false
}: ComponentItemProps) {
  const fontSize = compact ? '11px' : '12px';
  const secondaryFontSize = compact ? '10px' : '11px';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: compact ? '6px' : '8px',
        padding: compact ? '6px 8px' : '10px 12px',
        marginBottom: compact ? '4px' : '0',
        backgroundColor: isSelected ? '#e8f4fd' : '#f5f5f5',
        border: `1px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
        borderRadius: compact ? '4px' : '6px',
        opacity: isSelected ? 1 : 0.6,
        transition: 'all 0.2s'
      }}
    >
      <Checkbox
        checked={isSelected}
        onChange={onToggle}
        style={{ marginTop: '2px' }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Main component info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? '4px' : '6px',
          flexWrap: 'wrap',
          marginBottom: '2px'
        }}>
          {/* Percentage */}
          <Texto style={{
            margin: 0,
            fontSize,
            fontWeight: '700',
            color: isPlaceholder(component.percentage) ? '#722ed1' : '#1890ff',
            fontFamily: isPlaceholder(component.percentage) ? 'monospace' : 'inherit'
          }}>
            {component.percentage}
          </Texto>

          {/* Operator */}
          <Texto style={{
            margin: 0,
            fontSize,
            fontWeight: '700',
            color: component.operator === '+' ? '#28a745' : '#dc3545'
          }}>
            {component.operator}
          </Texto>

          {/* Source */}
          <Texto style={{
            margin: 0,
            fontSize,
            fontWeight: compact ? '700' : '600',
            color: isPlaceholder(component.source) ? '#722ed1' : '#333',
            fontFamily: isPlaceholder(component.source) ? 'monospace' : 'inherit'
          }}>
            {component.source}
          </Texto>

          {/* Instrument */}
          <Texto style={{
            margin: 0,
            fontSize,
            color: isPlaceholder(component.instrument) ? '#722ed1' : '#666',
            fontFamily: isPlaceholder(component.instrument) ? 'monospace' : 'inherit',
            fontWeight: compact ? '700' : isPlaceholder(component.instrument) ? '600' : 'normal'
          }}>
            {component.instrument}
          </Texto>
        </div>

        {/* Secondary info (date rule and type) */}
        <Texto style={{ margin: 0, fontSize: secondaryFontSize, color: '#8c8c8c' }}>
          <span style={{
            color: isPlaceholder(component.dateRule) ? '#722ed1' : '#8c8c8c',
            fontFamily: isPlaceholder(component.dateRule) ? 'monospace' : 'inherit',
            fontWeight: isPlaceholder(component.dateRule) ? compact ? '700' : '600' : 'normal'
          }}>
            {component.dateRule}
          </span>
          {' • '}
          <span style={{
            color: isPlaceholder(component.type) ? '#722ed1' : '#8c8c8c',
            fontFamily: isPlaceholder(component.type) ? 'monospace' : 'inherit',
            fontWeight: isPlaceholder(component.type) ? compact ? '700' : '600' : 'normal'
          }}>
            {component.type}
          </span>
        </Texto>
      </div>
    </div>
  );
}
