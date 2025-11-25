import React, { useState } from 'react';
import { Select, InputNumber } from 'antd';
import { GraviButton, Texto } from '@gravitate-js/excalibrr';

interface BulkChangeBarProps {
    selectedRows: any[];
    onApply: (property: string, value: number) => void;
}

export function BulkChangeBar({ selectedRows, onApply }: BulkChangeBarProps) {
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [bulkChangeValue, setBulkChangeValue] = useState<number | null>(null);

    // Debug: Log when component mounts and when selectedRows changes
    React.useEffect(() => {
        console.log('[BulkChangeBar] selectedRows changed:', selectedRows.length, selectedRows);
    }, [selectedRows]);

    const handleApply = () => {
        if (selectedProperty && bulkChangeValue !== null) {
            onApply(selectedProperty, bulkChangeValue);
            // Reset form after apply
            setSelectedProperty(null);
            setBulkChangeValue(null);
        }
    };

    const handleCancel = () => {
        setSelectedProperty(null);
        setBulkChangeValue(null);
    };

    // State 1: No selection - null state
    if (selectedRows.length === 0) {
        return (
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#f5f5f5',
                borderTop: '1px solid #d9d9d9',
                padding: '16px 24px',
                zIndex: 1000
            }}>
                <Texto style={{
                    margin: 0,
                    color: '#0C5A58',
                    fontSize: '16px',
                    fontWeight: 600
                }}>
                    Select offer(s) to override
                </Texto>
            </div>
        );
    }

    // State 2: Rows selected - active bulk change interface
    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#0C5A58',
            borderTop: '1px solid #d9d9d9',
            padding: '16px 24px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
        }}>
            {/* Left: Selection count */}
            <Texto style={{
                margin: 0,
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                whiteSpace: 'nowrap'
            }}>
                {selectedRows.length} offer{selectedRows.length > 1 ? 's' : ''} will be updated
            </Texto>

            {/* Center-Left: Property selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Texto style={{ margin: 0, color: 'white', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    Property:
                </Texto>
                <Select
                    placeholder="Select property"
                    value={selectedProperty}
                    onChange={setSelectedProperty}
                    style={{ width: 200 }}
                    options={[
                        { value: 'proposedDiff', label: 'Proposed Differential' },
                        { value: 'proposedPrice', label: 'Proposed Price' }
                    ]}
                />
            </div>

            {/* Center-Right: Value input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Texto style={{ margin: 0, color: 'white', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    Value:
                </Texto>
                <InputNumber
                    placeholder="0.0000"
                    value={bulkChangeValue}
                    onChange={setBulkChangeValue}
                    step={0.0001}
                    precision={4}
                    style={{ width: 140 }}
                />
            </div>

            {/* Right: Action buttons */}
            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
                <GraviButton
                    buttonText="Cancel"
                    appearance="outlined"
                    onClick={handleCancel}
                    style={{
                        backgroundColor: 'transparent',
                        borderColor: 'white',
                        color: 'white'
                    }}
                />
                <GraviButton
                    buttonText="Apply"
                    appearance="solid"
                    onClick={handleApply}
                    disabled={!selectedProperty || bulkChangeValue === null}
                    style={{
                        backgroundColor: 'white',
                        color: '#0C5A58',
                        fontWeight: 600
                    }}
                />
            </div>
        </div>
    );
}
