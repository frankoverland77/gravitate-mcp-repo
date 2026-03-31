import React, { useMemo, useState, useCallback } from 'react';
import { GraviGrid, Horizontal, Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { InputNumber, Checkbox, Modal, message, Alert } from 'antd';
import { EditOutlined, UndoOutlined, RedoOutlined, WarningOutlined } from '@ant-design/icons';
import { CheckboxColumn } from '../../components/shared/Grid/sharedColumnDefs/CheckboxColumn';
import { tieredPricingData } from './GlobalTieredPricing.data';

export function GlobalTieredPricing() {
    // State management for editable grid data
    const [rowData, setRowData] = useState(tieredPricingData);

    // Spread configuration state
    const [tier2Spread, setTier2Spread] = useState(0.0025);
    const [tier3Spread, setTier3Spread] = useState(0.0025);
    const [autoCalculate, setAutoCalculate] = useState(true);

    // Bulk edit state
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false);
    const [bulkTier1Value, setBulkTier1Value] = useState<number | null>(null);
    const [gridApi, setGridApi] = useState<any>(null);


    // Undo/Redo state
    const [history, setHistory] = useState<any[][]>([tieredPricingData]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Status indicator state
    const [lastUpdateCount, setLastUpdateCount] = useState(0);
    const [showUpdateStatus, setShowUpdateStatus] = useState(false);

    // Validation warnings state
    const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

    // Calculation utility functions (now using state-based spreads)
    const calculateTier2 = (tier1: number) => tier1 + tier2Spread;
    const calculateTier3 = (tier2: number) => tier2 + tier3Spread;
    const formatPrice = (value: number) => value != null ? `$${value.toFixed(4)}` : '';
    const parsePrice = (value: string) => {
        if (typeof value === 'number') return value;
        return parseFloat(value.replace('$', '').replace(',', ''));
    };

    // Validation function
    const validateRowData = useCallback((data: any[]) => {
        const warnings: string[] = [];
        let invalidOrderCount = 0;
        let negativeValueCount = 0;

        data.forEach((row) => {
            const tier1 = row.tier1;
            const tier2 = row.tier2Override ? row.tier2 : calculateTier2(row.tier1);
            const tier3 = row.tier3Override ? row.tier3 : calculateTier3(tier2);

            // Check for negative values
            if (tier1 < 0 || tier2 < 0 || tier3 < 0) {
                negativeValueCount++;
            }

            // Check tier order (Tier 1 < Tier 2 < Tier 3)
            if (tier1 >= tier2 || tier2 >= tier3) {
                invalidOrderCount++;
            }
        });

        if (negativeValueCount > 0) {
            warnings.push(`${negativeValueCount} row(s) have negative tier values`);
        }
        if (invalidOrderCount > 0) {
            warnings.push(`${invalidOrderCount} row(s) have invalid tier ordering (Tier 1 should be < Tier 2 < Tier 3)`);
        }

        return warnings;
    }, [calculateTier2, calculateTier3]);

    // Add to history for undo/redo
    const addToHistory = useCallback((newData: any[]) => {
        // Remove any future history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newData);

        // Limit history to 50 entries
        if (newHistory.length > 50) {
            newHistory.shift();
        } else {
            setHistoryIndex(historyIndex + 1);
        }

        setHistory(newHistory);
    }, [history, historyIndex]);

    // Undo handler
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setRowData(history[newIndex]);
            setValidationWarnings(validateRowData(history[newIndex]));
            message.info('Undo applied');
        }
    }, [historyIndex, history, validateRowData]);

    // Redo handler
    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setRowData(history[newIndex]);
            setValidationWarnings(validateRowData(history[newIndex]));
            message.info('Redo applied');
        }
    }, [historyIndex, history, validateRowData]);

    // Show update status with auto-hide
    const showUpdateIndicator = useCallback((count: number) => {
        setLastUpdateCount(count);
        setShowUpdateStatus(true);
        setTimeout(() => setShowUpdateStatus(false), 3000);
    }, []);

    // Handler for spread value changes
    const handleSpreadChange = (tier: 'tier2' | 'tier3', value: number | null) => {
        if (value === null) return;

        // Validate positive number
        if (value < 0) {
            message.error('Spread values must be positive');
            return;
        }

        if (tier === 'tier2') {
            setTier2Spread(value);
        } else {
            setTier3Spread(value);
        }

        // Trigger recalculation by forcing grid refresh
        // The valueGetters will automatically use the new spread values
        setTimeout(() => {
            const newData = rowData.map(row => ({ ...row }));

            // Add to history
            addToHistory(newData);

            // Validate
            const warnings = validateRowData(newData);
            setValidationWarnings(warnings);

            setRowData(newData);
        }, 0);
    };

    // Handler for auto-calculate toggle
    const handleAutoCalculateToggle = (checked: boolean) => {
        setAutoCalculate(checked);

        if (checked) {
            // When turning auto-calc ON, recalculate all non-overridden values
            const newData = rowData.map(row => ({ ...row }));

            // Add to history
            addToHistory(newData);

            // Validate
            const warnings = validateRowData(newData);
            setValidationWarnings(warnings);

            setRowData(newData);
        } else {
            // When turning auto-calc OFF, store current calculated values
            // so they become the "manual" values
            const newData = rowData.map(row => {
                const tier2Value = row.tier2Override ? row.tier2 : (row.tier1 + tier2Spread);
                const tier3Value = row.tier3Override ? row.tier3 : (tier2Value + tier3Spread);

                return {
                    ...row,
                    tier2: tier2Value,
                    tier3: tier3Value,
                    tier2Override: true,  // Mark as manual now
                    tier3Override: true,
                };
            });

            // Add to history
            addToHistory(newData);

            // Validate
            const warnings = validateRowData(newData);
            setValidationWarnings(warnings);

            setRowData(newData);
        }
    };

    const columnDefs = useMemo(() => [
        CheckboxColumn('checkbox'),
        {
            field: 'location',
            headerName: 'LOCATION',
            width: 200,
            sortable: true,
            filter: true,
        },
        {
            field: 'product',
            headerName: 'PRODUCT',
            width: 250,
            sortable: true,
            filter: true,
        },
        {
            field: 'tier1',
            headerName: 'TIER 1',
            width: 150,
            sortable: true,
            filter: true,
            type: 'rightAligned',
            editable: true,
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
                precision: 4,
                step: 0.0001,
                min: 0, // Prevent negative values
            },
            valueFormatter: (params: any) => formatPrice(params.value),
            valueParser: (params: any) => {
                const parsed = parsePrice(params.newValue);
                if (parsed < 0) {
                    message.error('Tier values must be positive');
                    return params.data.tier1; // Return original value
                }
                return parsed;
            },
        },
        {
            field: 'tier2',
            headerName: 'TIER 2',
            width: 150,
            sortable: true,
            filter: true,
            type: 'rightAligned',
            editable: true,
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
                precision: 4,
                step: 0.0001,
                min: 0, // Prevent negative values
            },
            valueGetter: (params: any) => {
                if (!autoCalculate) {
                    // When auto-calc is off, use stored value or Tier 1 as fallback
                    return params.data.tier2 !== null ? params.data.tier2 : params.data.tier1;
                }
                if (params.data.tier2Override && params.data.tier2 !== null) {
                    return params.data.tier2;  // Use manual value
                }
                return calculateTier2(params.data.tier1);  // Calculate from Tier 1
            },
            valueFormatter: (params: any) => formatPrice(params.value),
            valueParser: (params: any) => {
                const parsed = parsePrice(params.newValue);
                if (parsed < 0) {
                    message.error('Tier values must be positive');
                    return params.data.tier2; // Return original value
                }
                // Warn if tier order is invalid
                if (parsed <= params.data.tier1) {
                    message.warning('Tier 2 should be greater than Tier 1');
                }
                return parsed;
            },
            cellStyle: (params: any) => {
                // Visual indicator for calculated values (only when auto-calc is ON)
                if (autoCalculate && !params.data.tier2Override) {
                    return { backgroundColor: '#f5f5f5', fontStyle: 'italic' };
                }
                return null;
            },
        },
        {
            field: 'tier3',
            headerName: 'TIER 3',
            width: 150,
            sortable: true,
            filter: true,
            type: 'rightAligned',
            editable: true,
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
                precision: 4,
                step: 0.0001,
                min: 0, // Prevent negative values
            },
            valueGetter: (params: any) => {
                if (!autoCalculate) {
                    // When auto-calc is off, use stored value or Tier 2 as fallback
                    const tier2Value = params.data.tier2 !== null ? params.data.tier2 : params.data.tier1;
                    return params.data.tier3 !== null ? params.data.tier3 : tier2Value;
                }
                if (params.data.tier3Override && params.data.tier3 !== null) {
                    return params.data.tier3;  // Use manual value
                }
                // Calculate from Tier 2 (which might also be calculated)
                const tier2Value = params.data.tier2Override ? params.data.tier2 : calculateTier2(params.data.tier1);
                return calculateTier3(tier2Value);
            },
            valueFormatter: (params: any) => formatPrice(params.value),
            valueParser: (params: any) => {
                const parsed = parsePrice(params.newValue);
                if (parsed < 0) {
                    message.error('Tier values must be positive');
                    return params.data.tier3; // Return original value
                }
                // Get tier2 value for comparison
                const tier2Value = params.data.tier2Override ? params.data.tier2 : calculateTier2(params.data.tier1);
                // Warn if tier order is invalid
                if (parsed <= tier2Value) {
                    message.warning('Tier 3 should be greater than Tier 2');
                }
                return parsed;
            },
            cellStyle: (params: any) => {
                // Visual indicator for calculated values (only when auto-calc is ON)
                if (autoCalculate && !params.data.tier3Override) {
                    return { backgroundColor: '#f5f5f5', fontStyle: 'italic' };
                }
                return null;
            },
        },
    ], [autoCalculate, tier2Spread, tier3Spread, calculateTier2, calculateTier3, formatPrice, parsePrice]);

    const agPropOverrides = useMemo(() => ({
        getRowId: (params: any) => params.data.id,
        domLayout: 'normal',
        rowSelection: 'multiple' as const,
        suppressRowClickSelection: true,
        onGridReady: (event: any) => {
            console.log('✅ Grid ready, storing API reference');
            setGridApi(event.api);
        },
        onRowSelected: (event: any) => {
            console.log('🔵 onRowSelected fired:', event.node.isSelected());
            const selected = event.api.getSelectedRows();
            console.log('🔵 Currently selected rows:', selected.length, selected);
            setSelectedRows(selected);
        },
        onSelectionChanged: (event: any) => {
            console.log('🟢 onSelectionChanged fired');
            const selected = event.api.getSelectedRows();
            console.log('🟢 Selection changed - count:', selected.length);
            console.log('🟢 Selected row data:', selected);
            setSelectedRows(selected);
        },
        onCellValueChanged: (event: any) => {
            const field = event.colDef.field;
            const rowIndex = event.rowIndex;

            // Update the data with new value
            const newData = [...rowData];

            if (field === 'tier1') {
                // Tier 1 changed - update base value
                newData[rowIndex] = {
                    ...newData[rowIndex],
                    tier1: event.newValue,
                };
            } else if (field === 'tier2') {
                // Manual override of Tier 2
                newData[rowIndex] = {
                    ...newData[rowIndex],
                    tier2: event.newValue,
                    tier2Override: true,
                };
            } else if (field === 'tier3') {
                // Manual override of Tier 3
                newData[rowIndex] = {
                    ...newData[rowIndex],
                    tier3: event.newValue,
                    tier3Override: true,
                };
            }

            // Add to history for undo/redo
            addToHistory(newData);

            // Validate and update warnings
            const warnings = validateRowData(newData);
            setValidationWarnings(warnings);

            // Show update status
            showUpdateIndicator(1);

            setRowData(newData);
            // Force grid refresh to update calculated cells
            event.api.refreshCells({ force: true });
        },
    }), [rowData, addToHistory, validateRowData, showUpdateIndicator]); // Fixed: Added dependencies to prevent stale closures

    const controlBarProps = useMemo(() => {
        return {
            title: 'Global Tiered Pricing',
            subtitle: 'Tier 2 and Tier 3 auto-calculate with 25-point (0.0025) spreads. Click any calculated cell to override manually.',
            hideActiveFilters: false,
            actionButtons: (
                <Horizontal gap={8}>
                    <GraviButton
                        buttonText="Undo"
                        icon={<UndoOutlined />}
                        appearance="outlined"
                        disabled={historyIndex <= 0}
                        onClick={handleUndo}
                        style={{ fontWeight: 'normal' }}
                    />
                    <GraviButton
                        buttonText="Redo"
                        icon={<RedoOutlined />}
                        appearance="outlined"
                        disabled={historyIndex >= history.length - 1}
                        onClick={handleRedo}
                        style={{ fontWeight: 'normal' }}
                    />
                    <GraviButton
                        buttonText={`Bulk Edit Tier 1 (${selectedRows.length} selected)`}
                        icon={<EditOutlined />}
                        appearance="solid"
                        disabled={selectedRows.length === 0}
                        onClick={() => {
                            setBulkEditModalOpen(true);
                            setBulkTier1Value(null);
                        }}
                        style={{
                            fontWeight: 'bold',
                            backgroundColor: selectedRows.length > 0 ? '#51b073' : undefined,
                            color: selectedRows.length > 0 ? 'white' : undefined
                        }}
                    />
                </Horizontal>
            )
        };
    }, [selectedRows.length, historyIndex, history.length, handleUndo, handleRedo, bulkEditModalOpen, setBulkEditModalOpen, setBulkTier1Value]);

    const updateEP = async (params: any) => {
        console.log('Update called with:', params);
        return Promise.resolve();
    };

    // Bulk edit handler
    const handleBulkEditApply = () => {
        if (bulkTier1Value === null) {
            message.warning('Please enter a Tier 1 value');
            return;
        }

        // Validate positive number
        if (bulkTier1Value < 0) {
            message.error('Tier 1 value must be positive');
            return;
        }

        const updateCount = selectedRows.length;

        // Update all selected rows
        const selectedIds = selectedRows.map(row => row.id);
        const newData = rowData.map(row => {
            if (selectedIds.includes(row.id)) {
                return {
                    ...row,
                    tier1: bulkTier1Value,
                    tier2Override: false,  // Reset overrides to allow recalculation
                    tier3Override: false,
                };
            }
            return row;
        });

        // Add to history for undo/redo
        addToHistory(newData);

        // Validate and update warnings
        const warnings = validateRowData(newData);
        setValidationWarnings(warnings);

        // Show update status
        showUpdateIndicator(updateCount);

        setRowData(newData);
        setBulkEditModalOpen(false);
        setBulkTier1Value(null);

        // Clear grid selection
        if (gridApi) {
            gridApi.deselectAll();
        }
        setSelectedRows([]);

        message.success(`Updated Tier 1 for ${updateCount} rows`);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Validation Warnings */}
            {validationWarnings.length > 0 && (
                <Alert
                    message="Validation Warnings"
                    description={
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {validationWarnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    }
                    type="warning"
                    icon={<WarningOutlined />}
                    showIcon
                    closable
                    onClose={() => setValidationWarnings([])}
                    style={{ marginBottom: '16px' }}
                />
            )}

            {/* Update Status Indicator */}
            {showUpdateStatus && (
                <Alert
                    message={`${lastUpdateCount} row${lastUpdateCount !== 1 ? 's' : ''} updated`}
                    type="success"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            )}

            {/* Spread Configuration Panel */}
            <div style={{
                backgroundColor: '#fafafa',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '16px 24px',
                marginBottom: '16px',
                flexShrink: 0
            }}>
                <Horizontal gap={32} style={{ alignItems: 'center' }}>
                    <Texto style={{ fontSize: '12px', fontWeight: 700, color: '#595959', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Default Tier Spreads
                    </Texto>

                    <Horizontal gap={16} style={{ alignItems: 'center' }}>
                        <Checkbox
                            checked={autoCalculate}
                            onChange={(e) => handleAutoCalculateToggle(e.target.checked)}
                        >
                            <Texto style={{ fontSize: '11px', color: '#8c8c8c' }}>
                                Auto-calculate Tier 2 & 3
                            </Texto>
                        </Checkbox>

                        {autoCalculate && (
                            <>
                                <Horizontal gap={8} style={{ alignItems: 'center' }}>
                                    <Texto style={{ fontSize: '11px', color: '#8c8c8c' }}>
                                        Tier 2 Spread:
                                    </Texto>
                                    <InputNumber
                                        value={tier2Spread}
                                        onChange={(value) => handleSpreadChange('tier2', value)}
                                        precision={4}
                                        step={0.0001}
                                        size="small"
                                        style={{ width: '100px' }}
                                    />
                                </Horizontal>

                                <Horizontal gap={8} style={{ alignItems: 'center' }}>
                                    <Texto style={{ fontSize: '11px', color: '#8c8c8c' }}>
                                        Tier 3 Spread:
                                    </Texto>
                                    <InputNumber
                                        value={tier3Spread}
                                        onChange={(value) => handleSpreadChange('tier3', value)}
                                        precision={4}
                                        step={0.0001}
                                        size="small"
                                        style={{ width: '100px' }}
                                    />
                                </Horizontal>
                            </>
                        )}
                    </Horizontal>
                </Horizontal>
            </div>

            {/* Grid */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <GraviGrid
                    storageKey="global-tiered-pricing-grid-v3"
                    rowData={rowData}
                    columnDefs={columnDefs}
                    agPropOverrides={agPropOverrides}
                    controlBarProps={controlBarProps}
                    updateEP={updateEP}
                />
            </div>

            {/* Bulk Edit Modal */}
            <Modal
                title="Bulk Edit Tier 1"
                open={bulkEditModalOpen}
                onOk={handleBulkEditApply}
                onCancel={() => {
                    setBulkEditModalOpen(false);
                    setBulkTier1Value(null);
                }}
                okText="Apply"
                cancelText="Cancel"
                width={500}
                centered
                destroyOnHidden
            >
                <Vertical gap={20}>
                    <Texto style={{ fontSize: '14px', color: '#595959' }}>
                        Updating Tier 1 for <strong>{selectedRows.length}</strong> selected row{selectedRows.length !== 1 ? 's' : ''}
                    </Texto>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                            New Tier 1 Value
                        </label>
                        <InputNumber
                            value={bulkTier1Value}
                            onChange={(value) => setBulkTier1Value(value)}
                            precision={4}
                            step={0.0001}
                            placeholder="Enter value (e.g., 2.5000)"
                            style={{ width: '100%' }}
                            size="large"
                            autoFocus
                        />
                    </div>

                    <Alert
                        message="Tier 2 and Tier 3 will be recalculated automatically"
                        type="info"
                        showIcon
                        style={{ margin: 0 }}
                    />
                </Vertical>
            </Modal>
        </div>
    );
}
