import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Vertical, Horizontal, Texto, GraviButton, CheckCard, GraviGrid } from '@gravitate-js/excalibrr';
import { LeftOutlined, SyncOutlined, CheckCircleFilled, PlusOutlined, DownOutlined, MoreOutlined, SwapRightOutlined, CalendarOutlined, CloseOutlined, MenuOutlined, SaveOutlined, LockOutlined, DeleteOutlined, RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Divider, Tag, DatePicker, Select, Drawer, Input, Segmented, Checkbox, Modal, message } from 'antd';

export function ContractDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('pending');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingRow, setEditingRow] = useState<any>(null);
    const [formulaName, setFormulaName] = useState('');
    const [showTemplateManager, setShowTemplateManager] = useState(false);
    const [templateViewMode, setTemplateViewMode] = useState<'cards' | 'list'>('cards');
    const cardsScrollRef = useRef<HTMLDivElement>(null);

    // New state for workflow management
    const [pendingDetailVisible, setPendingDetailVisible] = useState(true);
    const [selectedComponents, setSelectedComponents] = useState<{[templateId: string]: {[compId: number]: boolean}}>({});
    const [savedDetails, setSavedDetails] = useState<any[]>([]);

    // Confirmation modal state
    const [showReplaceConfirmation, setShowReplaceConfirmation] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState<any>(null);

    const scrollCards = (direction: 'left' | 'right') => {
        if (cardsScrollRef.current) {
            const scrollAmount = 320; // Card width (300) + gap (16) + some padding
            const currentScroll = cardsScrollRef.current.scrollLeft;
            const targetScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            cardsScrollRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };
    const [formulaRows, setFormulaRows] = useState([
        {
            id: 1,
            publisher: 100.0000,
            baseDiff: 'Base Diff',
            instrument: 'Instrument',
            type: 'Type',
            diff: 0,
            dateRule: 'Rule',
            required: 'Required',
            display: '',
            uomCurrency: ''
        }
    ]);

    // Get contract details from navigation state or use mock data
    const contractData = location.state || {
        id: 1,
        externalCompany: '3D OIL & LP LLC',
        internalCompany: 'capSpire',
        internalContact: 'Cameron Carver',
        externalContact: 'N/A',
        contractType: 'Day - Fixed',
        effectiveStart: '09/30/2025',
        effectiveEnd: '10/31/2025',
        contractDate: '09/30/2025',
        requireQuantities: 'No',
        product: '87 GHL',
        originLocation: 'Columbus Terminal',
        destinationLocation: 'Columbus Terminal',
        volumeBasis: 'Gross',
        unitOfMeasure: 'gal'
    };
    const contractId = contractData.id;
    const contractTitle = contractData.externalCompany || `Contract #${contractId}`;

    const handleBack = () => {
        navigate('/ContractFormulas/PromptsGrid');
    };

    // Template families data
    const templateFamilies = [
        {
            id: 'columbus-standard',
            name: 'Standard Columbus Index',
            contractType: 'Day Deal',
            location: 'Columbus Terminal',
            components: [
                { id: 1, percentage: '90%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
                { id: 2, percentage: '10%', operator: '+', source: 'OPIS', instrument: 'CBOB USGC', dateRule: 'Current', type: 'Average' },
                { id: 3, percentage: '5%', operator: '+', source: 'Platts', instrument: 'CBOB', dateRule: 'Prior Day', type: 'High' },
                { id: 4, percentage: '$0.025', operator: '+', source: 'Fixed', instrument: 'Differential', dateRule: 'Current', type: 'Fixed' },
                { id: 5, percentage: '$0.015', operator: '-', source: 'Fixed', instrument: 'Discount', dateRule: 'Current', type: 'Fixed' }
            ]
        },
        {
            id: 'shell-negotiated',
            name: 'Shell Negotiated Rates',
            contractType: 'Day Deal',
            location: 'Columbus Terminal',
            components: [
                { id: 1, percentage: '100%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Average' },
                { id: 2, percentage: '$0.005', operator: '-', source: 'Fixed', instrument: 'Shell Discount', dateRule: 'Current', type: 'Fixed' },
                { id: 3, percentage: '$0.010', operator: '-', source: 'Fixed', instrument: 'Volume Discount', dateRule: 'Current', type: 'Fixed' },
                { id: 4, percentage: '$0.015', operator: '+', source: 'Formula', instrument: 'Seasonal Factor', dateRule: 'Current', type: 'Variable' }
            ]
        },
        {
            id: 'complex-multivariable',
            name: 'Complex Multi-Variable',
            contractType: 'Index Deal',
            location: 'Columbus Terminal',
            components: [
                { id: 1, percentage: '90%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
                { id: 2, percentage: '10%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Current', type: 'Average' },
                { id: 3, percentage: '10%', operator: '-', source: 'OPIS', instrument: 'Current RIN', dateRule: 'Current', type: 'Spot' },
                { id: 4, percentage: '$0.035', operator: '+', source: 'Formula', instrument: 'Premium', dateRule: 'Current', type: 'Fixed' },
                { id: 5, percentage: '75%', operator: '+', source: 'Platts', instrument: 'CBOB', dateRule: 'Prior Day', type: 'High' },
                { id: 6, percentage: '25%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Current', type: 'Low' }
            ]
        },
        {
            id: 'weekend-special',
            name: 'Weekend Special Formulas',
            contractType: 'Contract',
            location: 'Columbus Terminal',
            components: [
                { id: 1, percentage: '80%', operator: '+', source: 'OPIS', instrument: 'CBOB USGC', dateRule: 'Friday Close', type: 'Settle' },
                { id: 2, percentage: '20%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Average' },
                { id: 3, percentage: '$0.015', operator: '+', source: 'Fixed', instrument: 'Weekend Premium', dateRule: 'Current', type: 'Fixed' },
                { id: 4, percentage: '$0.025', operator: '+', source: 'Formula', instrument: 'Holiday Factor', dateRule: 'Current', type: 'Variable' }
            ]
        },
        {
            id: 'marathon-supply',
            name: 'Marathon Supply Agreement',
            contractType: 'Index Deal',
            location: 'Columbus Terminal',
            components: [
                { id: 1, percentage: '85%', operator: '+', source: 'Platts', instrument: 'CBOB', dateRule: 'Prior Day', type: 'Average' },
                { id: 2, percentage: '15%', operator: '+', source: 'OPIS', instrument: 'CBOB USGC', dateRule: 'Current', type: 'Settle' },
                { id: 3, percentage: '$0.012', operator: '-', source: 'Fixed', instrument: 'Volume Discount', dateRule: 'Current', type: 'Fixed' },
                { id: 4, percentage: '$0.018', operator: '-', source: 'Fixed', instrument: 'Enhanced Discount', dateRule: 'Current', type: 'Fixed' },
                { id: 5, percentage: '$0.008', operator: '+', source: 'Fixed', instrument: 'Q4 Premium', dateRule: 'Current', type: 'Fixed' }
            ]
        }
    ];

    // Initialize all components as selected when drawer opens
    useEffect(() => {
        if (drawerOpen && Object.keys(selectedComponents).length === 0) {
            const initialSelection: {[templateId: string]: {[compId: number]: boolean}} = {};
            templateFamilies.forEach(template => {
                initialSelection[template.id] = {};
                template.components.forEach(comp => {
                    initialSelection[template.id][comp.id] = true;
                });
            });
            setSelectedComponents(initialSelection);
        }
    }, [drawerOpen]);

    // Toggle component selection
    const toggleComponent = (templateId: string, compId: number) => {
        setSelectedComponents(prev => ({
            ...prev,
            [templateId]: {
                ...prev[templateId],
                [compId]: !prev[templateId]?.[compId]
            }
        }));
    };

    // Check if component is selected
    const isComponentSelected = (templateId: string, compId: number) => {
        return selectedComponents[templateId]?.[compId] ?? true;
    };

    // Get selected components count for a template
    const getSelectedCount = (templateId: string) => {
        if (!selectedComponents[templateId]) return 0;
        return Object.values(selectedComponents[templateId]).filter(Boolean).length;
    };

    // Build formula preview from selected components
    const buildFormulaPreview = (template: typeof templateFamilies[0]) => {
        const selected = template.components.filter(c => isComponentSelected(template.id, c.id));
        if (selected.length === 0) return 'No components selected';
        return selected.map((c, i) =>
            `${i > 0 ? ' ' + c.operator + ' ' : ''}${c.percentage} ${c.source} ${c.instrument}`
        ).join('');
    };

    // Handle template selection
    const handleTemplateSelect = (template: typeof templateFamilies[0]) => {
        // Check if there's existing formula data
        const hasExistingFormula = formulaRows.length > 0 &&
            (formulaRows[0].publisher !== 100.0000 || formulaName !== '');

        if (hasExistingFormula) {
            // Show confirmation modal
            setPendingTemplate(template);
            setShowReplaceConfirmation(true);
        } else {
            // No existing data, proceed directly
            applyTemplate(template);
        }
    };

    // Apply template (replace all)
    const applyTemplate = (template: typeof templateFamilies[0]) => {
        const selected = template.components.filter(c => isComponentSelected(template.id, c.id));

        // Convert to formula rows for the formula grid
        const newFormulaRows = selected.map((comp, index) => ({
            id: index + 1,
            publisher: comp.source,
            baseDiff: 'Base Diff',
            instrument: comp.instrument,
            type: comp.type,
            diff: 0,
            dateRule: comp.dateRule,
            required: 'Required',
            display: `${comp.percentage} ${comp.operator} ${comp.source} ${comp.instrument}`,
            uomCurrency: editingRow?.currency || ''
        }));

        setFormulaRows(newFormulaRows);
        setFormulaName(template.name);

        // Close template manager
        setShowTemplateManager(false);
    };

    // Handle Replace All confirmation
    const handleReplaceAll = () => {
        if (pendingTemplate) {
            applyTemplate(pendingTemplate);
            setShowReplaceConfirmation(false);
            setPendingTemplate(null);
        }
    };

    // Handle Add Components confirmation
    const handleAddComponents = () => {
        if (pendingTemplate) {
            const selected = pendingTemplate.components.filter((c: any) =>
                isComponentSelected(pendingTemplate.id, c.id)
            );

            // Get highest ID from existing rows
            const maxId = formulaRows.length > 0 ? Math.max(...formulaRows.map(r => r.id)) : 0;

            // Convert to formula rows and append
            const newRows = selected.map((comp: any, index: number) => ({
                id: maxId + index + 1,
                publisher: comp.source,
                baseDiff: 'Base Diff',
                instrument: comp.instrument,
                type: comp.type,
                diff: 0,
                dateRule: comp.dateRule,
                required: 'Required',
                display: `${comp.percentage} ${comp.operator} ${comp.source} ${comp.instrument}`,
                uomCurrency: editingRow?.currency || ''
            }));

            setFormulaRows([...formulaRows, ...newRows]);

            // Optionally append template name
            if (formulaName && !formulaName.includes(pendingTemplate.name)) {
                setFormulaName(`${formulaName} + ${pendingTemplate.name}`);
            }

            setShowTemplateManager(false);
            setShowReplaceConfirmation(false);
            setPendingTemplate(null);
        }
    };

    // Handle cancel confirmation
    const handleCancelReplace = () => {
        setShowReplaceConfirmation(false);
        setPendingTemplate(null);
    };

    // Handle Save Formula
    const handleSaveFormula = () => {
        // Validation
        if (formulaRows.length === 0 || (formulaRows.length === 1 && formulaRows[0].publisher === 100.0000)) {
            message.warning('Please add at least one formula component');
            return;
        }

        if (!formulaName || formulaName.trim() === '') {
            message.warning('Please enter a formula name');
            return;
        }

        // Build formula string from all rows
        const formulaString = formulaRows.map((row, i) =>
            `${i > 0 ? ' ' + (row.display.includes('-') ? '-' : '+') + ' ' : ''}${row.display}`
        ).join('');

        // Update the pricing grid row
        if (editingRow) {
            const updatedRow = {
                ...editingRow,
                formula: formulaString,
                formulaName: formulaName,
                formulaComponents: formulaRows
            };

            setGridRowData(prev => prev.map(row =>
                row.id === editingRow.id ? updatedRow : row
            ));

            message.success('Formula saved successfully');
        }

        // Close drawer
        setDrawerOpen(false);
        setShowTemplateManager(false);
    };

    // Pricing grid data
    const [gridRowData, setGridRowData] = useState([
        {
            id: 1,
            type: 'Fixed',
            effectiveFrom: '05/22/2025',
            effectiveTo: '05/02/2026',
            currency: 'US Dollars',
            uom: 'gal',
            payReceive: 'Pay',
            fixedValue: 0.0000
        }
    ]);

    const handleAddPrice = () => {
        const newRow = {
            id: gridRowData.length + 1,
            type: '',
            effectiveFrom: '',
            effectiveTo: '',
            currency: '',
            uom: '',
            payReceive: '',
            fixedValue: 0.0000
        };
        setGridRowData([...gridRowData, newRow]);
    };

    const handleDeleteRow = (rowId: number) => {
        setGridRowData(gridRowData.filter(row => row.id !== rowId));
    };

    const gridColumnDefs = useMemo(() => [
        {
            headerName: '',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            pinned: 'left'
        },
        {
            field: 'type',
            headerName: 'TYPE',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Fixed', 'Formula', 'Index']
            },
            cellRenderer: (params: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
                    {params.value === 'Fixed' && <LockOutlined style={{ fontSize: '12px' }} />}
                    <Tag style={{ margin: 0, backgroundColor: '#e8e8e8', border: 'none' }}>
                        {params.value || 'Select'}
                    </Tag>
                </div>
            )
        },
        {
            field: 'effectiveFrom',
            headerName: 'EFFECTIVE FROM',
            width: 180,
            editable: true
        },
        {
            field: 'effectiveTo',
            headerName: 'EFFECTIVE TO',
            width: 180,
            editable: true
        },
        {
            field: 'currency',
            headerName: 'CURRENCY',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['US Dollars', 'EUR', 'GBP', 'CAD']
            }
        },
        {
            field: 'uom',
            headerName: 'UOM',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['gal', 'bbl', 'ton', 'lb']
            }
        },
        {
            field: 'payReceive',
            headerName: 'PAY/RECEIVE',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Pay', 'Receive']
            }
        },
        {
            field: 'fixedValue',
            headerName: 'FIXED VALUE',
            width: 150,
            editable: true,
            cellRenderer: (params: any) => {
                const value = params.value !== null && params.value !== undefined ? params.value : 0;
                return `$${value.toFixed(4)}`;
            }
        },
        {
            field: 'formula',
            headerName: 'FORMULA',
            width: 300,
            cellRenderer: (params: any) => {
                if (params.value && params.data.formulaName) {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
                            <Tag style={{
                                margin: 0,
                                backgroundColor: '#d2f9f8',
                                border: '1px solid #0c5a58',
                                color: '#0c5a58',
                                fontSize: '11px',
                                fontWeight: 'bold'
                            }}>
                                {params.data.formulaName}
                            </Tag>
                            <Texto style={{
                                margin: 0,
                                fontSize: '11px',
                                color: '#595959',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {params.data.formulaComponents?.length || 0} components
                            </Texto>
                        </div>
                    );
                }
                return '';
            }
        },
        {
            headerName: 'ACTIONS',
            width: 100,
            pinned: 'right',
            cellRenderer: (params: any) => (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    <DeleteOutlined
                        style={{
                            color: '#ff4d4f',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                        onClick={() => handleDeleteRow(params.data.id)}
                    />
                </div>
            )
        }
    ], [gridRowData]);

    const gridControlBarProps = useMemo(() => ({
        title: 'Prices',
        hideActiveFilters: true,
        showResultCount: true,
        resultCount: gridRowData.length,
        showSearch: true,
        searchPlaceholder: 'Search here',
        actionButtons: (
            <>
                <GraviButton
                    buttonText="Refresh Values"
                    appearance="outlined"
                    style={{
                        backgroundColor: '#e8e8e8',
                        color: '#595959',
                        border: 'none'
                    }}
                />
                <GraviButton
                    buttonText="Add Price"
                    appearance="solid"
                    onClick={handleAddPrice}
                    style={{
                        fontWeight: 'bold',
                        backgroundColor: '#51b073',
                        color: 'white'
                    }}
                />
            </>
        )
    }), [gridRowData]);

    const gridAgPropOverrides = useMemo(() => ({
        domLayout: 'normal',
        headerHeight: 40,
        rowHeight: 40,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        overlayNoRowsTemplate: '<span style="padding: 10px; color: #666;">No Rows To Show</span>',
        rowGroupPanelShow: 'never',
        suppressDragLeaveHidesColumns: true
    }), []);

    const updateEP = async (params: any) => {
        // GraviGrid passes the entire updated row data object to updateEP
        // Check if the TYPE field was changed to "Formula"
        if (params.type === 'Formula') {
            setEditingRow(params);
            setDrawerOpen(true);
        }

        return Promise.resolve();
    };

    // Formula grid column definitions
    const formulaColumnDefs = useMemo(() => [
        {
            field: 'publisher',
            headerName: 'PUBLISHER',
            width: 120,
            editable: true
        },
        {
            field: 'baseDiff',
            headerName: 'BASE DIFF',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Base Diff', 'Other']
            }
        },
        {
            field: 'instrument',
            headerName: 'INSTRUMENT',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Instrument', 'Other']
            }
        },
        {
            field: 'type',
            headerName: 'TYPE',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Type', 'Other']
            }
        },
        {
            field: 'diff',
            headerName: 'DIFF',
            width: 100,
            editable: true
        },
        {
            field: 'dateRule',
            headerName: 'DATE RULE',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Rule', 'Other']
            }
        },
        {
            field: 'required',
            headerName: 'REQUIRED',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Required', 'Optional']
            }
        },
        {
            field: 'display',
            headerName: 'DISPLAY',
            width: 150,
            editable: true
        },
        {
            field: 'uomCurrency',
            headerName: 'UOM / CURRENCY',
            width: 150,
            editable: true
        },
        {
            headerName: 'ACTIONS',
            width: 120,
            cellRenderer: (params: any) => (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '8px' }}>
                    <span style={{ cursor: 'pointer', color: '#595959', fontSize: '12px' }}>
                        Options
                    </span>
                    <DeleteOutlined
                        style={{
                            color: '#ff4d4f',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                        onClick={() => {
                            setFormulaRows(formulaRows.filter(row => row.id !== params.data.id));
                        }}
                    />
                </div>
            )
        }
    ], [formulaRows]);

    const formulaGridAgProps = useMemo(() => ({
        domLayout: 'autoHeight',
        headerHeight: 40,
        rowHeight: 40,
        suppressRowClickSelection: true,
        suppressMovableColumns: true,
        suppressColumnResize: false,
        enableSorting: false,
        overlayNoRowsTemplate: '<span style="padding: 10px; color: #666;">No Rows To Show</span>',
        rowGroupPanelShow: 'never',
        suppressMenuHide: true
    }), []);

    const handleAddFormulaRow = () => {
        const newRow = {
            id: formulaRows.length + 1,
            publisher: 0,
            baseDiff: '',
            instrument: '',
            type: '',
            diff: 0,
            dateRule: '',
            required: '',
            display: '',
            uomCurrency: ''
        };
        setFormulaRows([...formulaRows, newRow]);
    };

    return (
        <>
            <Vertical className="mb-4">
                {/* Header with Back Button and Title */}
                <Horizontal style={{ gap: "10px" }} verticalCenter>
                    <GraviButton
                        buttonText="Back to Contracts"
                        icon={<LeftOutlined />}
                        appearance="outlined"
                        onClick={handleBack}
                    />
                    <Texto category="h3" style={{ margin: 0 }}>
                        {contractTitle}
                    </Texto>
                </Horizontal>

            {/* Two Column Layout */}
            <Horizontal style={{ flex: 1, gap: 0, height: '100%' }}>
                {/* Left Column - 20% - Contract Form */}
                <Vertical style={{
                    width: '20%',
                    backgroundColor: '#f8f9fa',
                    padding: '13px',
                    borderRight: '1px solid #e8e8e8',
                    overflowY: 'auto'
                }}>
                    {/* Back Button */}
                    <div
                        onClick={handleBack}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '13px',
                            padding: 0
                        }}
                    >
                        <LeftOutlined style={{ fontSize: '12px', color: '#595959', flexShrink: 0 }} />
                        <Texto style={{
                            margin: 0,
                            color: '#595959',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            lineHeight: '18px',
                            whiteSpace: 'nowrap'
                        }}>
                            Back to All Contracts
                        </Texto>
                    </div>

                    {/* Header Section - Teal */}
                    <div style={{
                        backgroundColor: '#d2f9f8',
                        padding: '10px 13px',
                        border: '1px solid #0c5a58',
                        borderBottom: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Texto style={{
                                margin: 0,
                                color: '#3d3d3d',
                                fontWeight: '600',
                                fontSize: '14px',
                                lineHeight: '18px'
                            }}>
                                Creating Contract
                            </Texto>
                            <Texto style={{
                                margin: 0,
                                color: '#595959',
                                fontSize: '12px',
                                lineHeight: '18px'
                            }}>
                                Enter your contract details.
                            </Texto>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Texto style={{
                                    margin: 0,
                                    fontWeight: 'bold',
                                    color: '#595959',
                                    fontSize: '13px',
                                    lineHeight: '18px'
                                }}>
                                    Awaiting
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    fontWeight: 'bold',
                                    color: '#595959',
                                    fontSize: '13px',
                                    lineHeight: '18px'
                                }}>
                                    Save
                                </Texto>
                            </div>
                            <SyncOutlined style={{ fontSize: '36px', color: '#595959' }} />
                        </div>
                    </div>

                    {/* Divider - Flush with Teal Box */}
                    <div style={{
                        height: '1px',
                        backgroundColor: 'black',
                        margin: '0'
                    }} />

                    {/* Contract Type */}
                    <Horizontal style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '13px 0',
                        marginBottom: '6px'
                    }}>
                        <Texto category="p2" style={{
                            margin: 0,
                            fontWeight: 'bold',
                            color: '#595959',
                            fontSize: '9.35px',
                            lineHeight: '18px'
                        }}>
                            Contract Type
                        </Texto>
                        <Tag
                            style={{
                                backgroundColor: '#d2f9f8',
                                color: '#3d3d3d',
                                borderRadius: '16px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '9.35px',
                                padding: '2px 12px',
                                lineHeight: '18px'
                            }}
                        >
                            {contractData.contractType}
                        </Tag>
                    </Horizontal>

                    {/* Counterparty Info Card */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        overflow: 'hidden'
                    }}>
                        {/* Card Header */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '12px',
                            borderBottom: '1px solid #d9d9d9'
                        }}>
                            <Texto style={{
                                margin: 0,
                                fontWeight: '600',
                                color: '#595959',
                                fontSize: '11.05px',
                                lineHeight: '18px'
                            }}>
                                Counterparty Info
                            </Texto>
                        </div>

                        {/* Card Content */}
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {/* Internal Company */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Texto style={{
                                    margin: 0,
                                    color: '#a3a3a3',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    <span style={{ fontWeight: 'bold' }}>Internal</span> Company
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    fontWeight: '600',
                                    color: '#3d3d3d',
                                    fontSize: '11.05px',
                                    lineHeight: '18px'
                                }}>
                                    {contractData.internalCompany}
                                </Texto>
                            </div>

                            {/* Internal Contact */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Texto style={{
                                    margin: 0,
                                    color: '#a3a3a3',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    <span style={{ fontWeight: 'bold' }}>Internal</span> Contact
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    color: '#3d3d3d',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    {contractData.internalContact}
                                </Texto>
                            </div>

                            <Divider style={{ margin: '12px 0', borderTop: '1px solid black' }} />

                            {/* External Company */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Texto style={{
                                    margin: 0,
                                    color: '#a3a3a3',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    <span style={{ fontWeight: 'bold' }}>External</span> Company
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    fontWeight: '600',
                                    color: '#3d3d3d',
                                    fontSize: '11.05px',
                                    textAlign: 'right',
                                    lineHeight: '18px'
                                }}>
                                    {contractData.externalCompany}
                                </Texto>
                            </div>

                            {/* External Contact */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Texto style={{
                                    margin: 0,
                                    color: '#a3a3a3',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    <span style={{ fontWeight: 'bold' }}>External</span> Contact
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    color: '#3d3d3d',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    {contractData.externalContact}
                                </Texto>
                            </div>
                        </div>
                    </div>

                    {/* Contract Dates Card */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        overflow: 'hidden'
                    }}>
                        {/* Card Header */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '12px',
                            borderBottom: '1px solid #d9d9d9'
                        }}>
                            <Texto style={{
                                margin: 0,
                                fontWeight: '600',
                                color: '#595959',
                                fontSize: '11.05px',
                                lineHeight: '18px'
                            }}>
                                Contract Dates
                            </Texto>
                        </div>

                        {/* Card Content */}
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {/* Effective Dates */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Texto style={{
                                    margin: 0,
                                    color: '#a3a3a3',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    Effective Dates
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    fontWeight: '600',
                                    color: '#3d3d3d',
                                    fontSize: '11.05px',
                                    lineHeight: '18px'
                                }}>
                                    {contractData.effectiveStart} - {contractData.effectiveEnd}
                                </Texto>
                            </div>

                            {/* Contract Date */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Texto style={{
                                    margin: 0,
                                    color: '#a3a3a3',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    Contract Date
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    color: '#3d3d3d',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    {contractData.contractDate}
                                </Texto>
                            </div>
                        </div>
                    </div>

                    {/* Require Quantities Section */}
                    <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        <Texto style={{
                            margin: 0,
                            color: '#a3a3a3',
                            fontSize: '11.05px',
                            lineHeight: '18px'
                        }}>
                            Require Quantities
                        </Texto>
                        <Tag
                            style={{
                                backgroundColor: 'white',
                                color: '#51b073',
                                borderRadius: '10px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '11.05px',
                                width: 'fit-content',
                                padding: '0px 7px',
                                lineHeight: '20px'
                            }}
                        >
                            {contractData.requireQuantities}
                        </Tag>
                    </div>
                </Vertical>

                {/* Right Column - 80% */}
                <div style={{
                    width: '80%',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Tab Navigation */}
                    <div style={{
                        backgroundColor: '#f5f6fa',
                        display: 'flex',
                        gap: '2px',
                        padding: '0',
                        borderTopLeftRadius: '5px',
                        borderTopRightRadius: '5px'
                    }}>
                        {/* All Details Tab - Off State */}
                        <div
                            onClick={() => setActiveTab('all')}
                            style={{
                                backgroundColor: activeTab === 'all' ? '#51b073' : 'white',
                                border: '1px solid #dddddd',
                                borderTopLeftRadius: '10px',
                                borderTopRightRadius: '10px',
                                padding: '11px 17px',
                                cursor: 'pointer',
                                minWidth: '123px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Texto style={{
                                margin: 0,
                                color: activeTab === 'all' ? 'white' : '#595959',
                                fontSize: '11.05px',
                                lineHeight: '18px'
                            }}>
                                All Details
                            </Texto>
                        </div>

                        {/* Pending Detail Tab - On State (Active) */}
                        <div
                            onClick={() => setActiveTab('pending')}
                            style={{
                                backgroundColor: activeTab === 'pending' ? '#51b073' : 'white',
                                border: '1px solid #dddddd',
                                borderTopLeftRadius: '10px',
                                borderTopRightRadius: '10px',
                                padding: '13px 17px',
                                cursor: 'pointer',
                                minWidth: '147px',
                                display: 'flex',
                                gap: '0px'
                            }}
                        >
                            {activeTab === 'pending' && (
                                <CheckCircleFilled style={{
                                    fontSize: '12px',
                                    color: 'white',
                                    marginRight: '8px',
                                    marginTop: '4px'
                                }} />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Texto style={{
                                    margin: 0,
                                    color: activeTab === 'pending' ? 'white' : '#595959',
                                    fontSize: '11.05px',
                                    lineHeight: '18px'
                                }}>
                                    Pending Detail
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    color: activeTab === 'pending' ? 'white' : '#595959',
                                    fontSize: '10.2px',
                                    lineHeight: '18px'
                                }}>
                                    Awaiting Save
                                </Texto>
                            </div>
                        </div>

                        {/* New Detail Tab - Off State with Plus Icon */}
                        <div
                            onClick={() => setActiveTab('new')}
                            style={{
                                backgroundColor: activeTab === 'new' ? '#51b073' : '#fafafa',
                                border: '1px solid #f8f9fa',
                                padding: '11px 9px',
                                cursor: 'pointer',
                                minWidth: '94px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <PlusOutlined style={{
                                fontSize: '12px',
                                color: activeTab === 'new' ? 'white' : '#595959'
                            }} />
                            <Texto style={{
                                margin: 0,
                                color: activeTab === 'new' ? 'white' : '#595959',
                                fontSize: '10.2px',
                                lineHeight: '18px'
                            }}>
                                New Detail
                            </Texto>
                        </div>
                    </div>

                    {/* Tab Content Area */}
                    <div style={{
                        flex: 1,
                        backgroundColor: 'white',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}>
                        {activeTab === 'all' && <Texto>All Details Content</Texto>}

                        {activeTab === 'pending' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
                                {/* Form Fields Row */}
                                <div style={{
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                    padding: '16px 8px'
                                }}>
                                    {/* Effective Dates */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <Texto style={{
                                            margin: 0,
                                            fontWeight: '500',
                                            color: '#595959',
                                            fontSize: '10px',
                                            lineHeight: '18px'
                                        }}>
                                            Effective Dates
                                        </Texto>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            backgroundColor: 'white',
                                            border: '1px solid #dddddd',
                                            height: '40px',
                                            padding: '0 12px',
                                            width: '276px'
                                        }}>
                                            <Texto style={{
                                                margin: 0,
                                                color: '#595959',
                                                fontSize: '14px',
                                                lineHeight: '22px'
                                            }}>
                                                09/30/2025
                                            </Texto>
                                            <SwapRightOutlined style={{ fontSize: '14px', color: '#595959' }} />
                                            <Texto style={{
                                                margin: 0,
                                                color: '#595959',
                                                fontSize: '14px',
                                                lineHeight: '22px'
                                            }}>
                                                10/31/2025
                                            </Texto>
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                                <CalendarOutlined style={{ fontSize: '12px', color: '#595959' }} />
                                                <SwapRightOutlined style={{ fontSize: '12px', color: '#595959' }} />
                                                <CloseOutlined style={{ fontSize: '12px', color: '#595959' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Effective Time */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <Texto style={{
                                            margin: 0,
                                            fontWeight: '500',
                                            color: '#595959',
                                            fontSize: '10px',
                                            lineHeight: '18px'
                                        }}>
                                            Effective Time
                                        </Texto>
                                        <Select
                                            placeholder="Effective Time"
                                            suffixIcon={<DownOutlined style={{ fontSize: '12px', color: '#595959' }} />}
                                            style={{ width: '276px', height: '40px' }}
                                            bordered
                                        />
                                    </div>

                                    {/* Origin Location */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <Texto style={{
                                            margin: 0,
                                            fontWeight: '500',
                                            color: '#595959',
                                            fontSize: '10px',
                                            lineHeight: '18px'
                                        }}>
                                            Origin Location
                                        </Texto>
                                        <Select
                                            placeholder="Origin Location"
                                            suffixIcon={<DownOutlined style={{ fontSize: '12px', color: '#595959' }} />}
                                            style={{ width: '276px', height: '40px' }}
                                            bordered
                                        />
                                    </div>

                                    {/* Destination Location */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <Texto style={{
                                            margin: 0,
                                            fontWeight: '500',
                                            color: '#595959',
                                            fontSize: '10px',
                                            lineHeight: '18px'
                                        }}>
                                            Destination Location
                                        </Texto>
                                        <Select
                                            placeholder="Destination Location"
                                            suffixIcon={<DownOutlined style={{ fontSize: '12px', color: '#595959' }} />}
                                            style={{ width: '276px', height: '40px' }}
                                            bordered
                                        />
                                    </div>

                                    {/* Product */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <Texto style={{
                                            margin: 0,
                                            fontWeight: '500',
                                            color: '#595959',
                                            fontSize: '10px',
                                            lineHeight: '18px'
                                        }}>
                                            Product
                                        </Texto>
                                        <Select
                                            placeholder="Product"
                                            suffixIcon={<DownOutlined style={{ fontSize: '12px', color: '#595959' }} />}
                                            style={{ width: '276px', height: '40px' }}
                                            bordered
                                        />
                                    </div>

                                    {/* More Button */}
                                    <div style={{ paddingBottom: '12px' }}>
                                        <MoreOutlined
                                            rotate={90}
                                            style={{
                                                fontSize: '21px',
                                                color: '#595959',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Data Grid */}
                                <div style={{ flex: 1, width: '100%' }}>
                                    <GraviGrid
                                        rowData={gridRowData}
                                        columnDefs={gridColumnDefs}
                                        agPropOverrides={gridAgPropOverrides}
                                        controlBarProps={gridControlBarProps}
                                        updateEP={updateEP}
                                    />
                                </div>

                                {/* Bottom Bar - Volume Basis and Unit of Measure */}
                                <div style={{
                                    backgroundColor: '#eef0f8',
                                    padding: '6px 24px',
                                    display: 'flex',
                                    gap: '488px',
                                    alignItems: 'center'
                                }}>
                                    {/* Volume Basis */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '300px' }}>
                                        <Texto style={{
                                            margin: 0,
                                            fontWeight: '500',
                                            color: '#595959',
                                            fontSize: '10px',
                                            lineHeight: '18px'
                                        }}>
                                            Volume Basis
                                        </Texto>
                                        <Select
                                            placeholder="Select Volume Basis"
                                            suffixIcon={<DownOutlined style={{ fontSize: '12px', color: '#595959' }} />}
                                            style={{ width: '300px', height: '40px' }}
                                            bordered
                                        />
                                    </div>

                                    {/* Unit Of Measure */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '300px' }}>
                                        <Texto style={{
                                            margin: 0,
                                            fontWeight: '500',
                                            color: '#595959',
                                            fontSize: '10px',
                                            lineHeight: '18px'
                                        }}>
                                            Unit Of Measure
                                        </Texto>
                                        <Select
                                            placeholder="Select Unit Of Measure"
                                            suffixIcon={<DownOutlined style={{ fontSize: '12px', color: '#595959' }} />}
                                            style={{ width: '300px', height: '40px' }}
                                            bordered
                                        />
                                    </div>
                                </div>

                                {/* Footer Bar - Manage Detail and Action Buttons */}
                                <div style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e8e8e8',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0 32px 0 0'
                                }}>
                                    {/* Left - Manage Detail */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center',
                                        padding: '12px 18px',
                                        borderBottom: '4px solid #51b073',
                                        width: '304px'
                                    }}>
                                        <MenuOutlined style={{ fontSize: '24px', color: '#51b073' }} />
                                        <Texto style={{
                                            margin: 0,
                                            fontWeight: 'bold',
                                            color: '#51b073',
                                            fontSize: '16px',
                                            lineHeight: '18px'
                                        }}>
                                            Manage Detail
                                        </Texto>
                                    </div>

                                    {/* Right - Action Buttons */}
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <GraviButton
                                            buttonText="Cancel"
                                            appearance="outlined"
                                            style={{
                                                backgroundColor: '#e8e8e8',
                                                color: '#3d3d3d',
                                                border: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '12.75px'
                                            }}
                                        />
                                        <GraviButton
                                            buttonText="Save Detail"
                                            icon={<SaveOutlined />}
                                            appearance="success"
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'new' && <Texto>New Detail Content</Texto>}
                    </div>
                </div>
            </Horizontal>
            </Vertical>

            {/* Bottom Drawer for Formula Editing */}
            <Drawer
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CloseOutlined style={{ fontSize: '14px', color: 'rgba(0,0,0,0.85)' }} />
                            <Texto style={{ margin: 0, color: 'rgba(0,0,0,0.85)', fontWeight: 'bold', fontSize: '16px' }}>
                                Edit Provision
                            </Texto>
                        </div>
                        <GraviButton
                            buttonText="Save"
                            appearance="solid"
                            style={{
                                fontWeight: 'bold',
                                backgroundColor: '#64d28d',
                                color: 'white'
                            }}
                            onClick={handleSaveFormula}
                        />
                    </div>
                }
                placement="bottom"
                height="80%"
                visible={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                closable={false}
                headerStyle={{
                    backgroundColor: '#E5E5E5',
                    padding: '16px 24px',
                    borderBottom: '1px solid #d9d9d9'
                }}
                bodyStyle={{
                    backgroundColor: '#f5f5f5',
                    padding: 0
                }}
            >
                {/* Green Panel */}
                <div style={{
                    backgroundColor: '#51b073',
                    padding: '12px 36px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px'
                }}>
                    {/* Effective Dates */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '170px' }}>
                        <Texto style={{ margin: 0, color: '#e8e8e8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '18px' }}>
                            Effective Dates
                        </Texto>
                        <Texto style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 'bold', lineHeight: '18px' }}>
                            {editingRow ? `${editingRow.effectiveFrom} - ${editingRow.effectiveTo}` : ''}
                        </Texto>
                    </div>

                    {/* Currency */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '170px' }}>
                        <Texto style={{ margin: 0, color: '#e8e8e8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '18px' }}>
                            Currency
                        </Texto>
                        <Texto style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 'bold', lineHeight: '18px' }}>
                            {editingRow?.currency || ''}
                        </Texto>
                    </div>

                    {/* Unit Of Measure */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '170px' }}>
                        <Texto style={{ margin: 0, color: '#e8e8e8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '18px' }}>
                            Unit Of Measure
                        </Texto>
                        <Texto style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 'bold', lineHeight: '18px' }}>
                            {editingRow?.uom || ''}
                        </Texto>
                    </div>

                    {/* Pay / Receive */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '170px' }}>
                        <Texto style={{ margin: 0, color: '#e8e8e8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '18px' }}>
                            Pay / Receive
                        </Texto>
                        <Texto style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 'bold', lineHeight: '18px' }}>
                            {editingRow?.payReceive || ''}
                        </Texto>
                    </div>

                    {/* Volume Basis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '170px' }}>
                        <Texto style={{ margin: 0, color: '#e8e8e8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '18px' }}>
                            Volume Basis
                        </Texto>
                        <Texto style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 'bold', lineHeight: '18px' }}>
                            XXXXXX
                        </Texto>
                    </div>
                </div>

                {/* Price Formulas Header Bar */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '8px 34px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Texto style={{ margin: 0, color: '#595959', fontSize: '14px', fontWeight: 'bold', lineHeight: '18px' }}>
                        Price Formulas
                    </Texto>
                    <Tag
                        style={{
                            backgroundColor: '#d2f9f8',
                            color: '#0c5a58',
                            borderRadius: '10px',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            padding: '2px 6px',
                            lineHeight: '20px'
                        }}
                    >
                        Formula
                    </Tag>
                </div>

                {/* Name Input Field */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '8px 16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                }}>
                    <Texto style={{ margin: 0, color: '#595959', fontSize: '14px', fontWeight: 'bold', lineHeight: '18px' }}>
                        Name:
                    </Texto>
                    <Input
                        placeholder="Enter Name"
                        value={formulaName}
                        onChange={(e) => setFormulaName(e.target.value)}
                        maxLength={255}
                        showCount
                        style={{
                            flex: 1,
                            fontSize: '12px'
                        }}
                    />
                </div>

                {/* Formula Editor Content */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px 16px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    {!showTemplateManager ? (
                        <>
                            {/* Custom Control Bar */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 0'
                            }}>
                                <Texto style={{ margin: 0, color: '#595959', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    Formula
                                </Texto>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <GraviButton
                                        buttonText="Add Row"
                                        icon={<PlusOutlined />}
                                        appearance="success"
                                        onClick={handleAddFormulaRow}
                                    />
                                    <GraviButton
                                        buttonText="Add Template"
                                        icon={<PlusOutlined />}
                                        appearance="outlined"
                                        onClick={() => setShowTemplateManager(true)}
                                    />
                                </div>
                            </div>

                            {/* Formula Grid */}
                            <GraviGrid
                                rowData={formulaRows}
                                columnDefs={formulaColumnDefs}
                                agPropOverrides={formulaGridAgProps}
                                hideControlBar={true}
                            />
                        </>
                    ) : (
                        /* Template Manager View */
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            padding: '20px',
                            flex: 1,
                            borderRadius: '4px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            {/* Close Link */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    cursor: 'pointer',
                                    color: '#595959',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                                onClick={() => setShowTemplateManager(false)}
                            >
                                <CloseOutlined style={{ fontSize: '12px' }} />
                                <span>Close</span>
                            </div>

                            {/* Title and Description */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                marginBottom: '20px'
                            }}>
                                <Texto style={{
                                    margin: 0,
                                    color: '#262626',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    lineHeight: '28px'
                                }}>
                                    Formula Template Manager
                                </Texto>
                                <Texto style={{
                                    margin: 0,
                                    color: '#8c8c8c',
                                    fontSize: '14px',
                                    lineHeight: '22px'
                                }}>
                                    Select a pre-built formula template to quickly apply common pricing calculations to your provision.
                                </Texto>
                            </div>

                            {/* Segmented Tabs and Auto-filtered Tags Section */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                marginBottom: '20px',
                                flexWrap: 'wrap'
                            }}>
                                {/* Segmented Tabs - Left Side */}
                                <Segmented
                                    options={[
                                        { label: 'Cards', value: 'cards' },
                                        { label: 'List', value: 'list' }
                                    ]}
                                    value={templateViewMode}
                                    onChange={(value) => setTemplateViewMode(value as 'cards' | 'list')}
                                />

                                {/* Auto-filtered Tags - Right Side */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    flexWrap: 'wrap'
                                }}>
                                    <Texto style={{
                                        margin: 0,
                                        color: '#595959',
                                        fontSize: '12px',
                                        fontWeight: 'normal',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        Auto Filters:
                                    </Texto>
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <Tag style={{
                                            backgroundColor: '#e6f7ff',
                                            color: '#1890ff',
                                            border: '1px solid #91d5ff',
                                            borderRadius: '12px',
                                            padding: '2px 8px',
                                            fontSize: '11px'
                                        }}>
                                            Product: 87 GHL
                                        </Tag>
                                        <Tag style={{
                                            backgroundColor: '#e6f7ff',
                                            color: '#1890ff',
                                            border: '1px solid #91d5ff',
                                            borderRadius: '12px',
                                            padding: '2px 8px',
                                            fontSize: '11px'
                                        }}>
                                            Location: Columbus Terminal
                                        </Tag>
                                        <Tag style={{
                                            backgroundColor: '#e6f7ff',
                                            color: '#1890ff',
                                            border: '1px solid #91d5ff',
                                            borderRadius: '12px',
                                            padding: '2px 8px',
                                            fontSize: '11px'
                                        }}>
                                            Counterparty: Shell Oil
                                        </Tag>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            {templateViewMode === 'cards' ? (
                                /* Cards View - Horizontal Scrolling with Arrows */
                                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    {/* Left Arrow */}
                                    <div
                                        onClick={() => scrollCards('left')}
                                        style={{
                                            position: 'absolute',
                                            left: '0',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            zIndex: 10,
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                                    >
                                        <LeftOutlined style={{ fontSize: '16px', color: '#595959' }} />
                                    </div>

                                    {/* Scrollable Cards Container */}
                                    <div
                                        ref={cardsScrollRef}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            gap: '16px',
                                            overflowX: 'auto',
                                            overflowY: 'hidden',
                                            padding: '20px 50px',
                                            backgroundColor: 'transparent',
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none'
                                        }}
                                        className="hide-scrollbar"
                                    >
                                        <style>{`
                                            .hide-scrollbar::-webkit-scrollbar {
                                                display: none;
                                            }
                                        `}</style>
                                        {templateFamilies.map((template) => (
                                            <div
                                                key={template.id}
                                                style={{
                                                    width: '280px',
                                                    height: '420px',
                                                    minWidth: '280px',
                                                    backgroundColor: 'white',
                                                    border: '1px solid #d9d9d9',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                    transition: 'transform 0.2s, box-shadow 0.2s'
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
                                                    <Texto style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', lineHeight: '18px', textAlign: 'center' }}>
                                                        {template.name}
                                                    </Texto>
                                                    <Texto style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#666', lineHeight: '14px', textAlign: 'center' }}>
                                                        {template.contractType} • {template.location}
                                                    </Texto>
                                                </div>

                                                {/* Card Content */}
                                                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                    {/* Components Header */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                        <Texto style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: '#333' }}>
                                                            Select Components:
                                                        </Texto>
                                                        <Texto style={{ margin: 0, fontSize: '10px', fontWeight: '600', color: '#1890ff' }}>
                                                            {getSelectedCount(template.id)} selected
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
                                                        padding: '6px'
                                                    }}>
                                                        {template.components.map((comp) => {
                                                            const isSelected = isComponentSelected(template.id, comp.id);
                                                            return (
                                                            <div
                                                                key={comp.id}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'flex-start',
                                                                    gap: '6px',
                                                                    padding: '6px 8px',
                                                                    marginBottom: '4px',
                                                                    backgroundColor: isSelected ? '#e8f4fd' : '#f5f5f5',
                                                                    border: `1px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                                                                    borderRadius: '4px',
                                                                    opacity: isSelected ? 1 : 0.6,
                                                                    transition: 'all 0.2s'
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onChange={() => toggleComponent(template.id, comp.id)}
                                                                    style={{ marginTop: '2px' }}
                                                                />
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: '2px' }}>
                                                                        <Texto style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#1890ff' }}>
                                                                            {comp.percentage}
                                                                        </Texto>
                                                                        <Texto style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: comp.operator === '+' ? '#28a745' : '#dc3545' }}>
                                                                            {comp.operator}
                                                                        </Texto>
                                                                        <Texto style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: '#333' }}>
                                                                            {comp.source}
                                                                        </Texto>
                                                                        <Texto style={{ margin: 0, fontSize: '11px', color: '#666' }}>
                                                                            {comp.instrument}
                                                                        </Texto>
                                                                    </div>
                                                                    <Texto style={{ margin: 0, fontSize: '10px', color: '#8c8c8c' }}>
                                                                        {comp.dateRule} • {comp.type}
                                                                    </Texto>
                                                                </div>
                                                            </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Formula Preview */}
                                                    <div style={{ marginBottom: '8px' }}>
                                                        <Texto style={{ margin: 0, fontSize: '10px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>
                                                            Formula Preview:
                                                        </Texto>
                                                        <div style={{
                                                            padding: '6px 8px',
                                                            backgroundColor: '#f5f5f5',
                                                            border: '1px solid #d9d9d9',
                                                            borderRadius: '4px',
                                                            minHeight: '28px'
                                                        }}>
                                                            <Texto style={{ margin: 0, fontSize: '10px', color: '#595959', lineHeight: '14px' }}>
                                                                {buildFormulaPreview(template)}
                                                            </Texto>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Footer */}
                                                <div style={{ padding: '12px', flexShrink: 0 }}>
                                                    <GraviButton
                                                        buttonText="Select Template"
                                                        appearance="success"
                                                        onClick={() => handleTemplateSelect(template)}
                                                        style={{ width: '100%', fontSize: '12px' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Arrow */}
                                    <div
                                        onClick={() => scrollCards('right')}
                                        style={{
                                            position: 'absolute',
                                            right: '0',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            zIndex: 10,
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                                    >
                                        <RightOutlined style={{ fontSize: '16px', color: '#595959' }} />
                                    </div>
                                </div>
                            ) : (
                                /* List View - Vertical Stacking */
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    padding: '20px',
                                    overflowY: 'auto',
                                    backgroundColor: 'transparent'
                                }}>
                                    {templateFamilies.map((template) => (
                                        <div
                                            key={template.id}
                                            style={{
                                                width: '100%',
                                                backgroundColor: 'white',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
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
                                                <div>
                                                    <Texto style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1a1a1a', lineHeight: '22px' }}>
                                                        {template.name}
                                                    </Texto>
                                                    <Texto style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666', lineHeight: '16px' }}>
                                                        {template.contractType} • {template.location}
                                                    </Texto>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <Texto style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1890ff' }}>
                                                        {getSelectedCount(template.id)} components selected
                                                    </Texto>
                                                    <GraviButton
                                                        buttonText="Select Template"
                                                        appearance="success"
                                                        onClick={() => handleTemplateSelect(template)}
                                                        style={{ fontSize: '12px' }}
                                                    />
                                                </div>
                                            </div>

                                            {/* List Card Content */}
                                            <div style={{ padding: '20px' }}>
                                                {/* Components Grid */}
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                                    gap: '12px',
                                                    marginBottom: '16px'
                                                }}>
                                                    {template.components.map((comp) => {
                                                        const isSelected = isComponentSelected(template.id, comp.id);
                                                        return (
                                                        <div
                                                            key={comp.id}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '8px',
                                                                padding: '10px 12px',
                                                                backgroundColor: isSelected ? '#e8f4fd' : '#f5f5f5',
                                                                border: `1px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                                                                borderRadius: '6px',
                                                                opacity: isSelected ? 1 : 0.6,
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onChange={() => toggleComponent(template.id, comp.id)}
                                                                style={{ marginTop: '2px' }}
                                                            />
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                                                    <Texto style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#1890ff' }}>
                                                                        {comp.percentage}
                                                                    </Texto>
                                                                    <Texto style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: comp.operator === '+' ? '#28a745' : '#dc3545' }}>
                                                                        {comp.operator}
                                                                    </Texto>
                                                                    <Texto style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#333' }}>
                                                                        {comp.source}
                                                                    </Texto>
                                                                    <Texto style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                                                        {comp.instrument}
                                                                    </Texto>
                                                                </div>
                                                                <Texto style={{ margin: 0, fontSize: '11px', color: '#8c8c8c' }}>
                                                                    {comp.dateRule} • {comp.type}
                                                                </Texto>
                                                            </div>
                                                        </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Formula Preview */}
                                                <div style={{
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '12px',
                                                    borderRadius: '6px',
                                                    borderLeft: '4px solid #1890ff',
                                                    minHeight: '60px'
                                                }}>
                                                    <Texto style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                                        Formula Preview
                                                    </Texto>
                                                    <Texto style={{ margin: 0, fontSize: '12px', color: '#1a1a1a', lineHeight: '18px', fontFamily: 'monospace' }}>
                                                        {buildFormulaPreview(template)}
                                                    </Texto>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Drawer>

            {/* Confirmation Modal for Template Replacement */}
            <Modal
                title={
                    <Horizontal style={{ gap: '8px', alignItems: 'center' }}>
                        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                        <Texto style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>
                            Replace Existing Formula?
                        </Texto>
                    </Horizontal>
                }
                open={showReplaceConfirmation}
                onCancel={handleCancelReplace}
                footer={
                    <Horizontal justifyContent="flex-end" style={{ gap: '12px' }}>
                        <GraviButton
                            buttonText="Cancel"
                            appearance="outlined"
                            onClick={handleCancelReplace}
                        />
                        <GraviButton
                            buttonText="Add Components"
                            appearance="success"
                            onClick={handleAddComponents}
                        />
                        <GraviButton
                            buttonText="Replace All"
                            appearance="solid"
                            style={{
                                backgroundColor: '#ff4d4f',
                                color: 'white',
                                borderColor: '#ff4d4f'
                            }}
                            onClick={handleReplaceAll}
                        />
                    </Horizontal>
                }
                width={600}
            >
                <Vertical style={{ gap: '16px', padding: '16px 0' }}>
                    <Texto style={{ margin: 0, fontSize: '14px', color: '#262626' }}>
                        You currently have an existing formula with components. How would you like to proceed?
                    </Texto>

                    {/* Current Formula Info */}
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        padding: '12px'
                    }}>
                        <Texto style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#595959', marginBottom: '8px' }}>
                            Current Formula:
                        </Texto>
                        <Texto style={{ margin: 0, fontSize: '13px', color: '#262626', marginBottom: '4px' }}>
                            {formulaName || 'Unnamed Formula'}
                        </Texto>
                        <Texto style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                            {formulaRows.length} component{formulaRows.length !== 1 ? 's' : ''}
                        </Texto>
                    </div>

                    {/* New Template Info */}
                    {pendingTemplate && (
                        <div style={{
                            backgroundColor: '#e6f7ff',
                            border: '1px solid #91d5ff',
                            borderRadius: '4px',
                            padding: '12px'
                        }}>
                            <Texto style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#0050b3', marginBottom: '8px' }}>
                                New Template:
                            </Texto>
                            <Texto style={{ margin: 0, fontSize: '13px', color: '#262626', marginBottom: '4px' }}>
                                {pendingTemplate.name}
                            </Texto>
                            <Texto style={{ margin: 0, fontSize: '12px', color: '#595959' }}>
                                {getSelectedCount(pendingTemplate.id)} selected component{getSelectedCount(pendingTemplate.id) !== 1 ? 's' : ''}
                            </Texto>
                        </div>
                    )}

                    <div style={{
                        backgroundColor: '#fff7e6',
                        border: '1px solid #ffd591',
                        borderRadius: '4px',
                        padding: '12px'
                    }}>
                        <Texto style={{ margin: 0, fontSize: '13px', color: '#ad6800' }}>
                            <strong>Replace All:</strong> This will remove your current formula and replace it entirely with the selected template.
                        </Texto>
                        <Texto style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#ad6800' }}>
                            <strong>Add Components:</strong> This will keep your current formula and append the selected template components to it.
                        </Texto>
                    </div>
                </Vertical>
            </Modal>
        </>
    );
}
