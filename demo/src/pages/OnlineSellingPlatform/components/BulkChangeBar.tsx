import React, { useState } from 'react';
import { Select, InputNumber } from 'antd';
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr';

// =============================================================================
// Types
// =============================================================================

export type BulkChangeAction = 'set' | 'add' | 'subtract';

export interface BulkEditControlsProps {
    onApply: (property: string, value: number, action: BulkChangeAction) => void;
}

// =============================================================================
// BulkEditControls Component
// =============================================================================

/**
 * BulkEditControls - Inline control bar for bulk editing grid values
 *
 * Features:
 * - Property selector (Proposed Diff or Proposed Price)
 * - Action selector (Set, Add, Subtract)
 * - Value input with 4 decimal precision
 * - Apply button to execute changes on selected range
 *
 * Usage:
 * Designed to be used in GraviGrid's controlBarProps.actionButtons
 * Works with AG Grid's range selection to apply changes to selected cells
 */
export function BulkEditControls({ onApply }: BulkEditControlsProps) {
    const [selectedProperty, setSelectedProperty] = useState<string>('proposedDiff');
    const [value, setValue] = useState<number | null>(null);
    const [action, setAction] = useState<BulkChangeAction>('set');

    const handleApply = () => {
        if (value !== null) {
            onApply(selectedProperty, value, action);
            // Reset value after apply for next operation
            setValue(null);
        }
    };

    return (
        <Horizontal style={{ gap: '8px', alignItems: 'center' }}>
            <Select
                value={selectedProperty}
                onChange={setSelectedProperty}
                style={{ width: 150 }}
                size="small"
                options={[
                    { value: 'proposedDiff', label: 'Proposed Diff' },
                    { value: 'proposedPrice', label: 'Proposed Price' }
                ]}
            />
            <Select
                value={action}
                onChange={setAction}
                style={{ width: 100 }}
                size="small"
                options={[
                    { value: 'set', label: 'Set to' },
                    { value: 'add', label: 'Add' },
                    { value: 'subtract', label: 'Subtract' }
                ]}
            />
            <InputNumber
                value={value}
                onChange={setValue}
                step={0.0001}
                precision={4}
                style={{ width: 120 }}
                size="small"
                placeholder="0.0000"
            />
            <GraviButton
                buttonText="Apply to Selection"
                appearance="solid"
                size="small"
                onClick={handleApply}
                disabled={value === null}
            />
        </Horizontal>
    );
}

export default BulkEditControls;
