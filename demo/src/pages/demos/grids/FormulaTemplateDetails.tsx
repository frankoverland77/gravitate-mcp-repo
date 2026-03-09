import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Vertical, Horizontal, GraviButton, GraviGrid, Texto } from '@gravitate-js/excalibrr';
import { LeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Modal, message, Tag, Input, Select } from 'antd';
import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext';
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor';
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors';
import { getTerminalLocations } from '../../../shared/data';

export function FormulaTemplateDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { getTemplateById, updateTemplate } = useFormulaTemplateContext();

    // Get template ID from URL params or location state
    const templateId = params.id || location.state?.id;
    const initialTemplate = getTemplateById(templateId);

    // State for editable fields
    const [templateName, setTemplateName] = useState(initialTemplate?.name || '');
    const [usedInProducts, setUsedInProducts] = useState(initialTemplate?.usedInProducts || []);
    const [contractType, setContractType] = useState(initialTemplate?.contractType || '');
    const [usedInLocations, setUsedInLocations] = useState(initialTemplate?.usedInLocations || []);
    const [category, setCategory] = useState(initialTemplate?.category || '');
    const [components, setComponents] = useState(initialTemplate?.components || []);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);

    // Track original data for change detection
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (!initialTemplate) return;

        const changed =
            templateName !== initialTemplate.name ||
            JSON.stringify(usedInProducts) !== JSON.stringify(initialTemplate.usedInProducts) ||
            contractType !== initialTemplate.contractType ||
            JSON.stringify(usedInLocations) !== JSON.stringify(initialTemplate.usedInLocations) ||
            category !== initialTemplate.category ||
            JSON.stringify(components) !== JSON.stringify(initialTemplate.components);

        setHasChanges(changed);
    }, [templateName, usedInProducts, contractType, usedInLocations, category, components, initialTemplate]);

    // If template not found, show error
    if (!initialTemplate) {
        return (
            <Vertical className="p-6" gap={24} style={{ height: '100%' }}>
                <div style={{
                    padding: '48px',
                    textAlign: 'center',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    border: '1px solid #f0f0f0'
                }}>
                    <h2 style={{ color: '#8c8c8c' }}>Template not found</h2>
                    <GraviButton
                        buttonText="Back to Templates"
                        onClick={() => navigate('/demos/grids/formula-templates')}
                        style={{ marginTop: '16px' }}
                    />
                </div>
            </Vertical>
        );
    }

    const categoryColorMap: { [key: string]: string } = {
        'Popular': 'green',
        'Partner': 'blue',
        'Advanced': 'purple',
        'Specialty': 'orange',
        'Regional': 'default',
        'Seasonal': 'cyan'
    };

    // Build formula preview from current components
    const currentFormulaPreview = useMemo(() => {
        if (components.length === 0) return 'No components';
        return components.map((c, i) =>
            `${i > 0 ? ' ' + c.operator + ' ' : ''}${c.percentage} ${c.source} ${c.instrument}`
        ).join('');
    }, [components]);

    // Simple column definitions
    const columnDefs = [
        { field: 'id', headerName: '#', width: 60 },
        {
            field: 'percentage',
            headerName: 'PERCENTAGE',
            width: 150,
            editable: true
        },
        {
            field: 'operator',
            headerName: 'OPERATOR',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['+', '-', '*', '/']
            }
        },
        {
            field: 'source',
            headerName: 'SOURCE',
            width: 150,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            cellEditorParams: {
                options: [
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
            }
        },
        {
            field: 'instrument',
            headerName: 'INSTRUMENT',
            width: 200,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            cellEditorParams: {
                options: [
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
            }
        },
        {
            field: 'dateRule',
            headerName: 'DATE RULE',
            width: 150,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            cellEditorParams: {
                options: [
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
            }
        },
        {
            field: 'type',
            headerName: 'TYPE',
            width: 120,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
            cellEditorParams: {
                options: [
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
            }
        }
    ];

    const handleAddRow = () => {
        const maxId = components.length > 0 ? Math.max(...components.map(c => c.id)) : 0;
        const newComponent = {
            id: maxId + 1,
            percentage: '0%',
            operator: '+',
            source: 'Argus',
            instrument: 'CBOB USGC',
            dateRule: 'Prior Day',
            type: 'Settle'
        };
        setComponents([...components, newComponent]);
    };

    const handleSave = () => {
        if (!hasChanges) return;
        setShowSaveConfirm(true);
    };

    const confirmSave = () => {
        if (!templateId) return;

        updateTemplate(templateId, {
            name: templateName,
            usedInProducts,
            contractType,
            usedInLocations,
            category: category as any,
            components
        });

        message.success(`Template '${templateName}' updated successfully`);
        setShowSaveConfirm(false);
        navigate('/demos/grids/formula-templates');
    };


    // Control bar props for the grid
    const controlBarProps = useMemo(() => ({
        title: 'Formula Components',
        hideActiveFilters: true,
        showResultCount: true,
        resultCount: components.length,
        showSearch: true,
        searchPlaceholder: 'Search components',
        actionButtons: (
            <GraviButton
                buttonText="Add Row"
                appearance="solid"
                onClick={handleAddRow}
                style={{
                    fontWeight: 'bold',
                    backgroundColor: '#51b073',
                    color: 'white'
                }}
            />
        )
    }), [components]);

    return (
        <Vertical className="p-6" gap={20} style={{ height: '100%', overflow: 'auto' }}>
            {/* Header with Back and Save buttons */}
            <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <GraviButton
                    buttonText="Back"
                    icon={<LeftOutlined />}
                    appearance="link"
                    onClick={() => navigate('/demos/grids/formula-templates')}
                />
                <GraviButton
                    buttonText="Save"
                    icon={<SaveOutlined />}
                    appearance="solid"
                    onClick={handleSave}
                    disabled={!hasChanges}
                    style={{
                        fontWeight: 'bold',
                        backgroundColor: hasChanges ? '#64d28d' : '#d9d9d9',
                        color: 'white',
                        opacity: hasChanges ? 1 : 0.6
                    }}
                />
            </Horizontal>

            {/* Template Name Field */}
            <div>
                <Texto style={{
                    margin: '0 0 8px 0',
                    color: '#595959',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    Template Name
                </Texto>
                <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        width: '400px'
                    }}
                />
            </div>

            {/* Editable Template Information */}
            <div>
                <Texto style={{
                    margin: '0 0 12px 0',
                    color: '#595959',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    Editable Information
                </Texto>
                <Horizontal gap={16}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                            Products (where used)
                        </label>
                        <Select
                            mode="multiple"
                            value={usedInProducts}
                            onChange={setUsedInProducts}
                            style={{ width: '100%' }}
                            placeholder="Select products..."
                            options={[
                                { value: '87 GHL', label: '87 GHL' },
                                { value: '93 Premium', label: '93 Premium' },
                                { value: 'ULSD', label: 'ULSD' },
                                { value: 'CBOB', label: 'CBOB' },
                                { value: 'Jet A', label: 'Jet A' },
                                { value: 'E85', label: 'E85' },
                                { value: 'RFG', label: 'RFG' }
                            ]}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                            Contract Type
                        </label>
                        <Select
                            value={contractType}
                            onChange={setContractType}
                            style={{ width: '100%' }}
                            options={[
                                { value: 'Day Deal', label: 'Day Deal' },
                                { value: 'Index Deal', label: 'Index Deal' },
                                { value: 'Contract', label: 'Contract' },
                                { value: 'Spot Deal', label: 'Spot Deal' },
                                { value: 'Futures Deal', label: 'Futures Deal' }
                            ]}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                            Locations (where used)
                        </label>
                        <Select
                            mode="multiple"
                            value={usedInLocations}
                            onChange={setUsedInLocations}
                            style={{ width: '100%' }}
                            placeholder="Select locations..."
                            options={getTerminalLocations().slice(0, 10).map(loc => ({ value: loc.Name, label: loc.Name }))}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                            Category
                        </label>
                        <Select
                            value={category}
                            onChange={setCategory}
                            style={{ width: '100%' }}
                            options={[
                                { value: 'Popular', label: 'Popular' },
                                { value: 'Partner', label: 'Partner' },
                                { value: 'Advanced', label: 'Advanced' },
                                { value: 'Specialty', label: 'Specialty' },
                                { value: 'Regional', label: 'Regional' },
                                { value: 'Seasonal', label: 'Seasonal' }
                            ]}
                        />
                    </div>
                </Horizontal>
            </div>

            {/* Read-Only Metadata */}
            <div>
                <Texto style={{
                    margin: '0 0 12px 0',
                    color: '#595959',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    Template Metadata
                </Texto>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    backgroundColor: '#fafafa',
                    padding: '16px',
                    borderRadius: '4px',
                    border: '1px solid #f0f0f0'
                }}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>Total Usage</div>
                        <div style={{ fontSize: '14px', color: '#262626', fontWeight: 500 }}>{initialTemplate.totalUsage} times</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>Last Modified</div>
                        <div style={{ fontSize: '14px', color: '#262626' }}>
                            {new Date(initialTemplate.lastModified).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>Created By</div>
                        <div style={{ fontSize: '14px', color: '#262626' }}>{initialTemplate.createdBy}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>Components</div>
                        <div style={{ fontSize: '14px', color: '#262626', fontWeight: 500 }}>{components.length}</div>
                    </div>
                </div>
            </div>

            {/* Formula Preview */}
            <div>
                <Texto style={{
                    margin: '0 0 8px 0',
                    color: '#595959',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    Formula Preview
                </Texto>
                <div style={{
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: '1.8',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                }}>
                    {currentFormulaPreview}
                </div>
            </div>

            {/* Formula Components Grid */}
            <div style={{ flex: 1, width: '100%', minHeight: '400px' }}>
                <GraviGrid
                    rowData={components}
                    columnDefs={columnDefs}
                    controlBarProps={controlBarProps}
                    agPropOverrides={{
                        domLayout: 'autoHeight',
                        headerHeight: 40,
                        rowHeight: 40,
                        suppressRowClickSelection: true,
                        suppressMovableColumns: true,
                        animateRows: true,
                        onCellValueChanged: (event: any) => {
                            console.log('Cell value changed:', event.data);
                            // Force a re-render by creating a new array reference
                            setComponents([...components]);
                            console.log('Triggered re-render with updated components');
                        },
                        onCellEditingStopped: (event: any) => {
                            console.log('Cell editing stopped:', event.data);
                            // Also trigger re-render when editing stops
                            setComponents([...components]);
                            console.log('Triggered re-render after editing stopped');
                        }
                    }}
                />
            </div>

            {/* Save Confirmation Modal */}
            <Modal
                title="Confirm Save"
                open={showSaveConfirm}
                onOk={confirmSave}
                onCancel={() => setShowSaveConfirm(false)}
                okText="Yes, Save"
                cancelText="Cancel"
            >
                <p>Are you sure you want to save changes to this template?</p>
            </Modal>
        </Vertical>
    );
}
