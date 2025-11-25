/**
 * Reusable component for displaying a single formula component
 * Used in both card and list views
 */

import { Checkbox } from 'antd';
import { Texto, Horizontal } from '@gravitate-js/excalibrr';
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
 * Helper to build class names conditionally
 */
const cx = (...classes: (string | false | undefined)[]): string =>
  classes.filter(Boolean).join(' ');

/**
 * Get value text class based on placeholder status
 */
const getValueClass = (value: string, compact: boolean, normalClass: string): string =>
  cx(
    compact ? 'component-item-value-compact' : 'component-item-value',
    isPlaceholder(value) ? 'component-item-placeholder' : normalClass
  );

/**
 * Renders a single formula component with selection checkbox
 */
export function ComponentItem({
  component,
  isSelected,
  onToggle,
  compact = false,
}: ComponentItemProps) {
  const containerClass = cx(
    'component-item',
    compact && 'component-item-compact',
    isSelected && 'component-item-selected'
  );

  const infoRowClass = cx('component-item-info-row', compact && 'component-item-info-row-compact');

  const secondaryClass = cx(
    'component-item-secondary',
    compact && 'component-item-secondary-compact'
  );

  const operatorClass =
    component.operator === '+' ? 'component-item-operator-plus' : 'component-item-operator-minus';

  return (
    <Horizontal alignItems="flex-start" className={containerClass}>
      <Checkbox checked={isSelected} onChange={onToggle} className="component-item-checkbox" />

      <div className="component-item-content">
        <div className={infoRowClass}>
          <Texto
            className={getValueClass(component.percentage, compact, 'component-item-percentage')}
          >
            {component.percentage}
          </Texto>

          <Texto
            className={cx(
              compact ? 'component-item-value-compact' : 'component-item-value',
              operatorClass
            )}
          >
            {component.operator}
          </Texto>

          <Texto
            className={getValueClass(component.source, compact, 'component-item-source')}
            weight={!isPlaceholder(component.source) && !compact ? '600' : undefined}
          >
            {component.source}
          </Texto>

          <Texto
            className={getValueClass(component.instrument, compact, 'component-item-instrument')}
            weight={isPlaceholder(component.instrument) && !compact ? '600' : undefined}
          >
            {component.instrument}
          </Texto>
        </div>

        <Texto className={secondaryClass}>
          <span
            className={isPlaceholder(component.dateRule) ? 'component-item-placeholder' : undefined}
          >
            {component.dateRule}
          </span>
          {' • '}
          <span
            className={isPlaceholder(component.type) ? 'component-item-placeholder' : undefined}
          >
            {component.type}
          </span>
        </Texto>
      </div>
    </Horizontal>
  );
}
