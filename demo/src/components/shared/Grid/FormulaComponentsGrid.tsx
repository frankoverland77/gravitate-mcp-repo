import React from 'react';
import { GraviGrid } from '@gravitate-js/excalibrr';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { SearchableSelect } from './cellEditors/SelectCellEditor';
import { suppressKeyboardEvent } from './cellEditors';
import { PLACEHOLDER_VALUES, isPlaceholder, TemplateComponent } from '../../../pages/demos/grids/FormulaTemplates.data';

export interface FormulaComponentsGridProps {
    components: TemplateComponent[];
    onComponentsChange: (components: TemplateComponent[]) => void;
    domLayout?: 'normal' | 'autoHeight' | 'print';
    height?: string | number;
}

export function FormulaComponentsGrid({
    components,
    onComponentsChange,
    domLayout = 'autoHeight',
    height
}: FormulaComponentsGridProps) {

    const componentColumnDefs = [
        {
            rowDrag: true,
            width: 40,
            suppressMenu: true,
            lockPosition: true,
            pinned: 'left' as const,
            rowDragText: (params: any) => params.rowNode.data.percentage
        },
        {
            field: 'percentage',
            headerName: '%',
            width: 100,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            valueFormatter: (params: any) => params.value || '',
            cellEditorParams: {
                options: [
                    { value: PLACEHOLDER_VALUES.PERCENTAGE, label: PLACEHOLDER_VALUES.PERCENTAGE },
                    { value: '0%', label: '0%' },
                    { value: '5%', label: '5%' },
                    { value: '10%', label: '10%' },
                    { value: '25%', label: '25%' },
                    { value: '50%', label: '50%' },
                    { value: '75%', label: '75%' },
                    { value: '90%', label: '90%' },
                    { value: '95%', label: '95%' },
                    { value: '100%', label: '100%' }
                ],
                showSearch: true,
                closeOnBlur: true
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
                }
                return {};
            }
        },
        {
            field: 'source',
            headerName: 'PUBLISHER',
            width: 120,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            valueFormatter: (params: any) => params.value || '',
            cellEditorParams: {
                options: [
                    { value: PLACEHOLDER_VALUES.SOURCE, label: PLACEHOLDER_VALUES.SOURCE },
                    { value: 'Argus', label: 'Argus' },
                    { value: 'OPIS', label: 'OPIS' },
                    { value: 'Platts', label: 'Platts' },
                    { value: 'Bloomberg', label: 'Bloomberg' },
                    { value: 'ICE', label: 'ICE' },
                    { value: 'NYMEX', label: 'NYMEX' },
                    { value: 'Fixed', label: 'Fixed' },
                    { value: 'Formula', label: 'Formula' }
                ],
                showSearch: true,
                closeOnBlur: true
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
                }
                return {};
            }
        },
        {
            field: 'instrument',
            headerName: 'INSTRUMENT',
            width: 180,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            valueFormatter: (params: any) => params.value || '',
            cellEditorParams: {
                options: [
                    { value: PLACEHOLDER_VALUES.INSTRUMENT, label: PLACEHOLDER_VALUES.INSTRUMENT },
                    { value: 'CBOB USGC', label: 'CBOB USGC' },
                    { value: 'CBOB', label: 'CBOB' },
                    { value: 'CBOB Chicago', label: 'CBOB Chicago' },
                    { value: 'CBOB Gulf', label: 'CBOB Gulf' },
                    { value: 'Premium USGC', label: 'Premium USGC' },
                    { value: 'CARBOB', label: 'CARBOB' },
                    { value: 'ULSD', label: 'ULSD' },
                    { value: 'Jet Fuel', label: 'Jet Fuel' },
                    { value: 'Ethanol', label: 'Ethanol' },
                    { value: 'RBOB Futures', label: 'RBOB Futures' },
                    { value: 'Renewable Diesel', label: 'Renewable Diesel' },
                    { value: 'Differential', label: 'Differential' },
                    { value: 'Discount', label: 'Discount' },
                    { value: 'Shell Discount', label: 'Shell Discount' },
                    { value: 'Volume Discount', label: 'Volume Discount' },
                    { value: 'Marathon Discount', label: 'Marathon Discount' },
                    { value: 'BP Discount', label: 'BP Discount' },
                    { value: 'Partner Discount', label: 'Partner Discount' },
                    { value: 'Seasonal Factor', label: 'Seasonal Factor' },
                    { value: 'Terminal Fee', label: 'Terminal Fee' },
                    { value: 'Quality Premium', label: 'Quality Premium' },
                    { value: 'Octane Premium', label: 'Octane Premium' },
                    { value: 'Volume Rebate', label: 'Volume Rebate' },
                    { value: 'Freight Diff', label: 'Freight Diff' },
                    { value: 'Spot Discount', label: 'Spot Discount' },
                    { value: 'Airport Fee', label: 'Airport Fee' },
                    { value: 'Quality Cert', label: 'Quality Cert' },
                    { value: 'Delivery Charge', label: 'Delivery Charge' },
                    { value: 'Contract Discount', label: 'Contract Discount' },
                    { value: 'RIN Credit D6', label: 'RIN Credit D6' },
                    { value: 'D4 RIN Credit', label: 'D4 RIN Credit' },
                    { value: 'Transport Charge', label: 'Transport Charge' },
                    { value: 'Weekend Premium', label: 'Weekend Premium' },
                    { value: 'Holiday Factor', label: 'Holiday Factor' },
                    { value: 'Loyalty Credit', label: 'Loyalty Credit' },
                    { value: 'CARB Fee', label: 'CARB Fee' },
                    { value: 'Spec Premium', label: 'Spec Premium' },
                    { value: 'LCFS Credit', label: 'LCFS Credit' },
                    { value: 'Regional Diff', label: 'Regional Diff' },
                    { value: 'Local Discount', label: 'Local Discount' },
                    { value: 'Basis Adjustment', label: 'Basis Adjustment' },
                    { value: 'Hedge Cost', label: 'Hedge Cost' },
                    { value: 'Contango Factor', label: 'Contango Factor' },
                    { value: 'Summer Premium', label: 'Summer Premium' },
                    { value: 'RVP Compliance', label: 'RVP Compliance' },
                    { value: 'Volume Tier', label: 'Volume Tier' },
                    { value: 'Winter Premium', label: 'Winter Premium' },
                    { value: 'Cold Filter', label: 'Cold Filter' },
                    { value: 'Additive Cost', label: 'Additive Cost' },
                    { value: 'Brand Premium', label: 'Brand Premium' },
                    { value: 'Arbitrage Factor', label: 'Arbitrage Factor' },
                    { value: 'Transaction Cost', label: 'Transaction Cost' },
                    { value: 'Pipeline Diff', label: 'Pipeline Diff' },
                    { value: 'Regional Discount', label: 'Regional Discount' },
                    { value: 'Tier 1 Discount', label: 'Tier 1 Discount' },
                    { value: 'Tier 2 Discount', label: 'Tier 2 Discount' },
                    { value: 'Loyalty Bonus', label: 'Loyalty Bonus' },
                    { value: 'Base Terminal Fee', label: 'Base Terminal Fee' },
                    { value: 'Renewable Premium', label: 'Renewable Premium' },
                    { value: 'Volume Incentive', label: 'Volume Incentive' },
                    { value: 'Blend Credit', label: 'Blend Credit' }
                ],
                showSearch: true,
                closeOnBlur: true
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
                }
                return {};
            }
        },
        {
            field: 'dateRule',
            headerName: 'DATE RULE',
            width: 130,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            valueFormatter: (params: any) => params.value || '',
            cellEditorParams: {
                options: [
                    { value: PLACEHOLDER_VALUES.DATE_RULE, label: PLACEHOLDER_VALUES.DATE_RULE },
                    { value: 'Prior Day', label: 'Prior Day' },
                    { value: 'Current', label: 'Current' },
                    { value: 'Next Day', label: 'Next Day' },
                    { value: 'Month Average', label: 'Month Average' },
                    { value: 'Week Average', label: 'Week Average' },
                    { value: 'Friday Close', label: 'Friday Close' },
                    { value: 'Settlement', label: 'Settlement' }
                ],
                showSearch: true,
                closeOnBlur: true
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
                }
                return {};
            }
        },
        {
            field: 'type',
            headerName: 'TYPE',
            width: 120,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            valueFormatter: (params: any) => params.value || '',
            cellEditorParams: {
                options: [
                    { value: PLACEHOLDER_VALUES.TYPE, label: PLACEHOLDER_VALUES.TYPE },
                    { value: 'Settle', label: 'Settle' },
                    { value: 'Average', label: 'Average' },
                    { value: 'Fixed', label: 'Fixed' },
                    { value: 'High', label: 'High' },
                    { value: 'Low', label: 'Low' },
                    { value: 'Spot', label: 'Spot' },
                    { value: 'Variable', label: 'Variable' },
                    { value: 'Futures', label: 'Futures' }
                ],
                showSearch: true,
                closeOnBlur: true
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return { backgroundColor: '#f3e8ff', color: '#722ed1', fontWeight: 600 };
                }
                return {};
            }
        },
        {
            field: 'display',
            headerName: 'DISPLAY',
            width: 200,
            editable: true,
            valueGetter: (params: any) => {
                // Use custom display name if set, otherwise auto-generate
                const comp = params.data;
                if (!comp) return '';
                if (comp.customDisplayName) return comp.customDisplayName;
                return `${comp.percentage || ''} ${comp.source || ''} ${comp.instrument || ''} ${comp.dateRule || ''} ${comp.type || ''}`.trim();
            },
            valueSetter: (params: any) => {
                // Save custom display name
                params.data.customDisplayName = params.newValue;
                return true;
            },
            cellStyle: (params: any) => {
                // Show visual distinction for custom vs auto-generated names
                if (params.data?.customDisplayName) {
                    return { fontWeight: 600, color: '#262626' };
                }
                return { backgroundColor: '#f5f5f5', fontStyle: 'italic', color: '#595959' };
            }
        },
        {
            headerName: 'ACTIONS',
            width: 100,
            pinned: 'right' as const,
            cellRenderer: (params: any) => {
                const hasCustomName = !!params.data?.customDisplayName;

                return (
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', gap: '12px' }}>
                        {hasCustomName && (
                            <Popconfirm
                                title="Reset display name?"
                                description="This will restore the auto-generated display name."
                                onConfirm={() => {
                                    params.data.customDisplayName = null;
                                    params.api.refreshCells({ rowNodes: [params.node], force: true });
                                }}
                                okText="Reset"
                                cancelText="Cancel"
                            >
                                <UndoOutlined
                                    style={{
                                        color: '#595959',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                                />
                            </Popconfirm>
                        )}
                        <DeleteOutlined
                            style={{
                                color: '#595959',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                            onClick={() => {
                                const updatedComponents = components.filter(c => c.id !== params.data.id);
                                onComponentsChange(updatedComponents);
                            }}
                        />
                    </div>
                );
            }
        }
    ];

    const agPropOverrides = {
        domLayout,
        headerHeight: 40,
        rowHeight: 40,
        suppressRowClickSelection: true,
        suppressMovableColumns: true,
        animateRows: true,
        rowDragManaged: true,
        rowDragEntireRow: true,
        onCellValueChanged: (event: any) => {
            onComponentsChange([...components]);  // Force re-render
        },
        onCellEditingStopped: (event: any) => {
            onComponentsChange([...components]);  // Force re-render
        },
        onRowDragEnd: (event: any) => {
            const newOrder: any[] = [];
            event.api.forEachNode((node: any) => newOrder.push(node.data));
            onComponentsChange(newOrder);
        }
    };

    const containerStyle: React.CSSProperties = height
        ? { height: typeof height === 'number' ? `${height}px` : height, width: '100%' }
        : { width: '100%' };

    return (
        <div style={containerStyle}>
            <GraviGrid
                rowData={components}
                columnDefs={componentColumnDefs}
                agPropOverrides={agPropOverrides}
                hideControlBar={true}
            />
        </div>
    );
}
