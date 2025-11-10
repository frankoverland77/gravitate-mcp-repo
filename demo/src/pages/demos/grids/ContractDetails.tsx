import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Vertical, Horizontal, Texto, GraviButton, CheckCard, GraviGrid } from '@gravitate-js/excalibrr';
import { LeftOutlined, SyncOutlined, CheckCircleFilled, PlusOutlined, DownOutlined, MoreOutlined, SwapRightOutlined, CalendarOutlined, CloseOutlined, MenuOutlined, SaveOutlined, LockOutlined, DeleteOutlined, RightOutlined, EditOutlined } from '@ant-design/icons';
import { Divider, Tag, DatePicker, Select, Drawer, Input, Segmented, Checkbox, message, Modal } from 'antd';
import { FormulaEditorDrawer } from './components/FormulaEditorDrawer';
import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext';
import type { TemplateComponent } from './FormulaTemplates.data';
import { isPlaceholder, getPlaceholderDisplayText } from './FormulaTemplates.data';
import { PUBLISHERS, INSTRUMENTS, DATE_RULES, PRICE_TYPES } from './FormulaFieldOptions';

// Detail cell renderer for formula components
const FormulaDetailCellRenderer = (props: any) => {
    const formulas = props.data?.formulas || [];

    // Legacy support - check for old formulaComponents structure
    if (formulas.length === 0 && props.data?.formulaComponents) {
        const legacyFormulas = [{ name: props.data.formulaName || 'Formula', rows: props.data.formulaComponents }];
        return renderFormulasDetail(legacyFormulas);
    }

    if (formulas.length === 0) return null;

    return renderFormulasDetail(formulas);
};

// Helper to render formula details
const renderFormulasDetail = (formulas: Array<{ name: string; rows: any[] }>) => {
    return (
        <div style={{
            padding: '16px 48px',
            backgroundColor: '#fafafa'
        }}>
            {formulas.map((formula, formulaIndex) => (
                <div key={formulaIndex} style={{ marginBottom: formulaIndex < formulas.length - 1 ? '20px' : 0 }}>
                    {/* Formula Header */}
                    {formulas.length > 1 && (
                        <div style={{
                            backgroundColor: '#e8e8e8',
                            padding: '8px 12px',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            fontSize: '12px',
                            color: '#595959'
                        }}>
                            FORMULA {formulaIndex + 1}
                        </div>
                    )}

                    <div style={{
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        {/* Table headers */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '100px 100px 130px 80px 70px 100px 100px 180px',
                            gap: '8px',
                            padding: '8px 12px',
                            backgroundColor: '#fafafa',
                            borderBottom: '1px solid #d9d9d9',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#595959'
                        }}>
                            <div>PUBLISHER</div>
                            <div>PUBLISHER PERCENTAGE</div>
                            <div>INSTRUMENT</div>
                            <div>TYPE</div>
                            <div>DIFF</div>
                            <div>DATE RULE</div>
                            <div>REQUIRED</div>
                            <div>DISPLAY</div>
                        </div>

                        {/* Component rows */}
                        {formula.rows.map((comp: any, index: number) => (
                            <div
                                key={index}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '100px 100px 130px 80px 70px 100px 100px 180px',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    backgroundColor: 'white',
                                    borderBottom: index < formula.rows.length - 1 ? '1px solid #e8e8e8' : 'none',
                                    fontSize: '13px',
                                    color: '#262626'
                                }}
                            >
                                <div>
                                    {typeof comp.publisher === 'number'
                                        ? comp.publisher.toFixed(4)
                                        : (comp.publisher || '-')
                                    }
                                </div>
                                <div>{comp.baseDiff || '-'}</div>
                                <div>{comp.instrument || '-'}</div>
                                <div>{comp.type || '-'}</div>
                                <div>{comp.diff || 0}</div>
                                <div>{comp.dateRule || '-'}</div>
                                <div>{comp.required || '-'}</div>
                                <div>{comp.display || '-'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export function ContractDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { addTemplate } = useFormulaTemplateContext();

    const [activeTab, setActiveTab] = useState('pending');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingRow, setEditingRow] = useState<any>(null);
    const [formulas, setFormulas] = useState<Array<{ name: string; rows: any[] }>>([{ name: '', rows: [] }]);
    const [activeFormulaIndex, setActiveFormulaIndex] = useState(0);
    const [showTemplateManager, setShowTemplateManager] = useState(false);
    const [templateViewMode, setTemplateViewMode] = useState<'cards' | 'list'>('cards');
    const cardsScrollRef = useRef<HTMLDivElement>(null);
    const gridApiRef = useRef<any>(null);

    // New state for workflow management
    const [pendingDetailVisible, setPendingDetailVisible] = useState(true);
    const [selectedComponents, setSelectedComponents] = useState<{[templateId: string]: {[compId: number]: boolean}}>({});
    const [savedDetails, setSavedDetails] = useState<any[]>([]);

    // Save as Template modal state
    const [saveTemplateModalOpen, setSaveTemplateModalOpen] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [newTemplateDescription, setNewTemplateDescription] = useState('');
    const [newTemplateCategory, setNewTemplateCategory] = useState<'Popular' | 'Partner' | 'Advanced' | 'Specialty' | 'Regional' | 'Seasonal'>('Popular');

    // Get contract details from navigation state or use mock data
    // Use params.id from URL if available, otherwise fall back to location.state.id or default
    const contractData = location.state || {
        id: params.id || 1,
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

    // Auto-filter state management
    const [activeFilters, setActiveFilters] = useState<{[key: string]: {value: string; enabled: boolean}}>({
        product: { value: contractData.product, enabled: true },
        location: { value: contractData.originLocation, enabled: true },
        counterparty: { value: contractData.externalCompany, enabled: true }
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterDropdownRef = useRef<HTMLDivElement>(null);


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

    const contractId = contractData.id;
    const contractTitle = contractData.externalCompany || `Contract #${contractId}`;

    // Available filter options
    const availableFilterFields = [
        { key: 'product', label: 'Product', value: contractData.product },
        { key: 'location', label: 'Location', value: contractData.originLocation },
        { key: 'counterparty', label: 'Counterparty', value: contractData.externalCompany },
        { key: 'contractType', label: 'Contract Type', value: contractData.contractType },
        { key: 'volumeBasis', label: 'Volume Basis', value: contractData.volumeBasis },
        { key: 'uom', label: 'Unit of Measure', value: contractData.unitOfMeasure }
    ];

    // Filter helper functions
    const toggleFilter = (filterKey: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: {
                ...prev[filterKey],
                enabled: !prev[filterKey].enabled
            }
        }));
    };

    const addFilter = (filterKey: string, filterValue: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: { value: filterValue, enabled: true }
        }));
        setShowFilterDropdown(false);
    };

    const removeFilter = (filterKey: string) => {
        setActiveFilters(prev => {
            const updated = {...prev};
            delete updated[filterKey];
            return updated;
        });
    };

    const getUnusedFilters = () => {
        return availableFilterFields.filter(f => !activeFilters[f.key]);
    };

    const handleBack = () => {
        navigate('/ContractFormulas/PromptsGrid');
    };

    // Use shared template data from context (same as IndexOfferManagement)
    const { templates: templateFamilies } = useFormulaTemplateContext();

    // Click outside handler to close filter dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setShowFilterDropdown(false);
            }
        };

        if (showFilterDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilterDropdown]);

    // Initialize all components as selected when template manager opens
    useEffect(() => {
        if (showTemplateManager) {
            // Reset component selection each time template manager opens
            const initialSelection: {[templateId: string]: {[compId: number]: boolean}} = {};
            templateFamilies.forEach(template => {
                initialSelection[template.id] = {};
                template.components.forEach(comp => {
                    initialSelection[template.id][comp.id] = true;
                });
            });
            setSelectedComponents(initialSelection);
        }
    }, [showTemplateManager]);

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

    // Handle template selection from template manager
    const handleTemplateSelect = (template: typeof templateFamilies[0]) => {
        const selected = template.components.filter(c => isComponentSelected(template.id, c.id));

        const updated = [...formulas];
        const currentFormula = updated[activeFormulaIndex];

        // Get highest ID from existing rows in this formula
        const maxId = currentFormula.rows.length > 0 ? Math.max(...currentFormula.rows.map(r => r.id)) : 0;

        // Convert to formula rows
        const newRows = selected.map((comp, index) => ({
            id: maxId + index + 1,
            publisher: comp.source,
            percentage: comp.percentage,
            instrument: comp.instrument,
            type: comp.type,
            diff: 0,
            dateRule: comp.dateRule,
            required: 'Required',
            display: `${comp.percentage} ${comp.operator} ${comp.source} ${comp.instrument}`,
            uomCurrency: editingRow?.currency || ''
        }));

        // ALWAYS APPEND - never replace
        currentFormula.rows = [...currentFormula.rows, ...newRows];

        // Set or append template name
        if (!currentFormula.name) {
            currentFormula.name = template.name;
        } else if (!currentFormula.name.includes(template.name)) {
            currentFormula.name += ` + ${template.name}`;
        }

        setFormulas(updated);

        // Close template manager
        setShowTemplateManager(false);
    };


    // Handle Save Formula
    const handleSaveFormula = () => {
        // Validation - get non-empty formulas
        const nonEmptyFormulas = formulas.filter(f => f.rows.length > 0);

        if (nonEmptyFormulas.length === 0) {
            message.warning('Please add at least one formula component');
            return;
        }

        // Check all non-empty formulas have names
        for (const formula of nonEmptyFormulas) {
            if (!formula.name || formula.name.trim() === '') {
                message.warning('Please name all formulas');
                return;
            }
        }

        // Generate display name with colon separator: "Formula1Name : Formula2Name"
        const displayName = nonEmptyFormulas.map(f => f.name).join(' : ');

        // Build formula strings for each
        const formulaStrings = nonEmptyFormulas.map(f =>
            f.rows.map((row, i) =>
                `${i > 0 ? ' ' + (row.display.includes('-') ? '-' : '+') + ' ' : ''}${row.display}`
            ).join('')
        );

        // Update the pricing grid row
        if (editingRow) {
            const updatedRow = {
                ...editingRow,
                formula: displayName,  // Display the combined name
                formulaName: displayName,
                formulas: nonEmptyFormulas,  // Store all formulas
                formulaStrings: formulaStrings,  // Store individual formula strings
                // Keep legacy support for single formula
                formulaComponents: nonEmptyFormulas[0]?.rows || []
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
            type: 'Formula',
            effectiveFrom: '05/22/2025',
            effectiveTo: '05/02/2026',
            currency: 'US Dollars',
            uom: 'gal',
            payReceive: 'Pay',
            fixedValue: 0.0000,
            formula: 'Platts + 0.50',
            formulaName: 'Platts + 0.50',
            formulas: [{
                name: 'Platts + 0.50',
                rows: [
                    {
                        id: 1,
                        publisher: 'Platts',
                        percentage: '100',
                        instrument: 'WTI',
                        diff: '+0.50',
                        timing: 'M+1'
                    }
                ]
            }],
            formulaStrings: ['Platts + 0.50']
        },
        {
            id: 2,
            type: 'Lesser Of 2',
            effectiveFrom: '06/01/2025',
            effectiveTo: '06/30/2025',
            currency: 'US Dollars',
            uom: 'gal',
            payReceive: 'Pay',
            fixedValue: 0.0000,
            formula: 'Lesser of Formula 1 or Formula 2',
            formulaName: 'Lesser of Formula 1 or Formula 2',
            formulas: [
                {
                    name: 'Platts WTI',
                    rows: [
                        {
                            id: 1,
                            publisher: 'Platts',
                            percentage: '100',
                            instrument: 'WTI',
                            diff: '+0.25',
                            timing: 'M+1'
                        }
                    ]
                },
                {
                    name: 'Argus Brent',
                    rows: [
                        {
                            id: 1,
                            publisher: 'Argus',
                            percentage: '100',
                            instrument: 'Brent',
                            diff: '+0.35',
                            timing: 'M+1'
                        }
                    ]
                }
            ],
            formulaStrings: ['Platts WTI', 'Argus Brent']
        },
        {
            id: 3,
            type: 'Lesser Of 3',
            effectiveFrom: '07/01/2025',
            effectiveTo: '07/31/2025',
            currency: 'US Dollars',
            uom: 'gal',
            payReceive: 'Receive',
            fixedValue: 0.0000,
            formula: 'Lesser of Formula 1, Formula 2, or Formula 3',
            formulaName: 'Lesser of Formula 1, Formula 2, or Formula 3',
            formulas: [
                {
                    name: 'Platts WTI',
                    rows: [
                        {
                            id: 1,
                            publisher: 'Platts',
                            percentage: '100',
                            instrument: 'WTI',
                            diff: '+0.10',
                            timing: 'M+1'
                        }
                    ]
                },
                {
                    name: 'Argus Brent',
                    rows: [
                        {
                            id: 1,
                            publisher: 'Argus',
                            percentage: '100',
                            instrument: 'Brent',
                            diff: '+0.15',
                            timing: 'M+1'
                        }
                    ]
                },
                {
                    name: 'OPIS Dubai',
                    rows: [
                        {
                            id: 1,
                            publisher: 'OPIS',
                            percentage: '100',
                            instrument: 'Dubai',
                            diff: '+0.20',
                            timing: 'M+1'
                        }
                    ]
                }
            ],
            formulaStrings: ['Platts WTI', 'Argus Brent', 'OPIS Dubai']
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

    const handleSaveAsTemplate = () => {
        // Check if there are any rows with formulas
        const rowsWithFormulas = gridRowData.filter(row =>
            row.formulas && row.formulas.length > 0 && row.formulas.some((f: any) => f.rows.length > 0)
        );

        if (rowsWithFormulas.length === 0) {
            message.warning('No formulas configured. Please add and configure a formula first.');
            return;
        }

        // Open the modal to collect template details
        setSaveTemplateModalOpen(true);
    };

    const handleSaveTemplateConfirm = () => {
        if (!newTemplateName.trim()) {
            message.warning('Please enter a template name');
            return;
        }

        // Get the first row with formulas (or could let user select which one)
        const rowWithFormula = gridRowData.find(row =>
            row.formulas && row.formulas.length > 0 && row.formulas.some((f: any) => f.rows.length > 0)
        );

        if (!rowWithFormula) {
            message.error('No formula found to save');
            return;
        }

        // Extract formula components from the first formula
        const firstFormula = rowWithFormula.formulas[0];
        const components: TemplateComponent[] = firstFormula.rows.map((row: any, index: number) => ({
            id: index + 1,
            percentage: row.percentage || '',
            operator: row.display?.includes('-') ? '-' : '+',
            source: row.publisher || '',
            instrument: row.instrument || '',
            dateRule: row.dateRule || '',
            type: row.type || ''
        }));

        // Create the template
        console.log('=== SAVING TEMPLATE ===');
        console.log('contractData.product:', contractData.product);
        console.log('contractData.originLocation:', contractData.originLocation);
        console.log('usedInProducts will be:', contractData.product ? [contractData.product] : []);
        console.log('usedInLocations will be:', contractData.originLocation ? [contractData.originLocation] : []);

        const newTemplate = addTemplate({
            name: newTemplateName,
            contractType: contractData.contractType || 'Day - Fixed',
            usedInProducts: contractData.product ? [contractData.product] : [],
            usedInLocations: contractData.originLocation ? [contractData.originLocation] : [],
            category: newTemplateCategory,
            description: newTemplateDescription || `Template created from contract ${contractData.id}`,
            createdBy: 'User',
            components
        });

        console.log('Template created:', newTemplate);
        console.log('Template usedInProducts:', newTemplate.usedInProducts);
        console.log('Template usedInLocations:', newTemplate.usedInLocations);

        message.success(`Template "${newTemplateName}" created successfully!`);

        // Reset modal state
        setSaveTemplateModalOpen(false);
        setNewTemplateName('');
        setNewTemplateDescription('');
        setNewTemplateCategory('Popular');
    };

    const handleEditRow = (row: any) => {
        setEditingRow(row);

        // Determine required number of formulas based on type
        const formulaCount = row.type === 'Lesser Of 3' ? 3 :
                            row.type === 'Lesser Of 2' ? 2 : 1;

        // Load existing formula data if present
        if (row.formulas) {
            // Multi-formula support - ensure we have the right number
            const currentFormulas = row.formulas;

            // If we need more formulas than we have, add empty ones
            if (currentFormulas.length < formulaCount) {
                const additionalFormulas = Array(formulaCount - currentFormulas.length)
                    .fill(null)
                    .map(() => ({ name: '', rows: [] }));
                setFormulas([...currentFormulas, ...additionalFormulas]);
            } else {
                setFormulas(currentFormulas.slice(0, formulaCount));
            }
        } else if (row.formulaName) {
            // Legacy single formula support - expand to multiple if needed
            const existingFormula = { name: row.formulaName, rows: row.formulaComponents || [] };
            if (formulaCount > 1) {
                const additionalFormulas = Array(formulaCount - 1)
                    .fill(null)
                    .map(() => ({ name: '', rows: [] }));
                setFormulas([existingFormula, ...additionalFormulas]);
            } else {
                setFormulas([existingFormula]);
            }
        } else {
            // New empty formulas based on type
            setFormulas(Array(formulaCount).fill(null).map(() => ({ name: '', rows: [] })));
        }

        setShowTemplateManager(false);
        setDrawerOpen(true);
    };

    const gridColumnDefs = useMemo(() => [
        {
            headerName: '',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 80,
            pinned: 'left',
            cellRenderer: 'agGroupCellRenderer'
        },
        {
            field: 'type',
            headerName: 'TYPE',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Fixed', 'Formula', 'Lesser Of 2', 'Lesser Of 3', 'Index']
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
                const formulaComponents = params.data.formulaComponents || [];

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
                            <span style={{
                                margin: 0,
                                fontSize: '11px',
                                color: '#595959'
                            }}>
                                {formulaComponents.length} components
                            </span>
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
            cellRenderer: (params: any) => {
                const hasFormula = ['Formula', 'Lesser Of 2', 'Lesser Of 3'].includes(params.data.type);
                return (
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', gap: '12px' }}>
                        {hasFormula && (
                            <EditOutlined
                                style={{
                                    color: '#595959',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                                onClick={() => handleEditRow(params.data)}
                            />
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
                            onClick={() => handleDeleteRow(params.data.id)}
                        />
                    </div>
                );
            }
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
            <div style={{ display: 'flex', gap: '8px' }}>
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
                    buttonText="Save as Template"
                    icon={<PlusOutlined />}
                    appearance="outlined"
                    onClick={handleSaveAsTemplate}
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
            </div>
        )
    }), [gridRowData, handleSaveAsTemplate, handleAddPrice]);

    const gridAgPropOverrides = useMemo(() => ({
        domLayout: 'normal',
        headerHeight: 40,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        overlayNoRowsTemplate: '<span style="padding: 10px; color: #666;">No Rows To Show</span>',
        rowGroupPanelShow: 'never',
        suppressDragLeaveHidesColumns: true,
        masterDetail: true,
        detailRowAutoHeight: true,
        isRowMaster: (dataItem: any) => {
            return dataItem.formulaComponents && dataItem.formulaComponents.length > 0;
        },
        detailCellRenderer: FormulaDetailCellRenderer,
        onGridReady: (params: any) => {
            gridApiRef.current = params.api;
        }
    }), []);

    const updateEP = async (params: any) => {
        // GraviGrid passes the entire updated row data object to updateEP
        // Check if the TYPE field was changed to a formula type
        const isFormulaType = ['Formula', 'Lesser Of 2', 'Lesser Of 3'].includes(params.type);

        if (isFormulaType) {
            setEditingRow(params);

            // Determine number of formulas needed based on type
            const formulaCount = params.type === 'Lesser Of 3' ? 3 :
                                params.type === 'Lesser Of 2' ? 2 : 1;

            // Reset formula state for new price row or load existing
            if (!params.formulas && !params.formulaName) {
                // New formula - create empty formulas based on type
                setFormulas(Array(formulaCount).fill(null).map(() => ({ name: '', rows: [] })));
                setShowTemplateManager(false);
            } else if (params.formulas) {
                // Editing existing multi-formula
                setFormulas(params.formulas);
            } else {
                // Legacy single formula support
                setFormulas([{ name: params.formulaName || '', rows: params.formulaComponents || [] }]);
            }

            setDrawerOpen(true);
        }

        return Promise.resolve();
    };

    // Formula grid column definitions generator
    const getFormulaColumnDefs = (formulaIndex: number) => [
        {
            colId: 'rowDragHandle',
            rowDrag: true,
            width: 50,
            suppressMenu: true,
            headerName: '',
            pinned: 'left',
            lockPosition: true,
            rowDragText: (params: any) => params.rowNode.data.percentage || ''
        },
        {
            field: 'percentage',
            headerName: '%',
            width: 100,
            editable: true,
            pinned: 'left',
            lockPosition: true,
            cellRenderer: (params: any) => {
                return getPlaceholderDisplayText(params.value);
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return {
                        backgroundColor: '#d2f9f8',
                        color: '#0c5a58',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    };
                }
                return null;
            },
            onCellValueChanged: (params: any) => {
                // Update display when any field changes
                const row = params.data;
                row.display = `${row.percentage} ${row.publisher} ${row.instrument}`;
                params.api.refreshCells({ rowNodes: [params.node], force: true });
            }
        },
        {
            field: 'publisher',
            headerName: 'PUBLISHER',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: [...PUBLISHERS]
            },
            cellRenderer: (params: any) => {
                return getPlaceholderDisplayText(params.value);
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return {
                        backgroundColor: '#d2f9f8',
                        color: '#0c5a58',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    };
                }
                return null;
            },
            onCellValueChanged: (params: any) => {
                // Update display when any field changes
                const row = params.data;
                row.display = `${row.percentage} ${row.publisher} ${row.instrument}`;
                params.api.refreshCells({ rowNodes: [params.node], force: true });
            }
        },
        {
            field: 'instrument',
            headerName: 'INSTRUMENT',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: [...INSTRUMENTS]
            },
            cellRenderer: (params: any) => {
                return getPlaceholderDisplayText(params.value);
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return {
                        backgroundColor: '#d2f9f8',
                        color: '#0c5a58',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    };
                }
                return null;
            },
            onCellValueChanged: (params: any) => {
                // Update display when any field changes
                const row = params.data;
                row.display = `${row.percentage} ${row.publisher} ${row.instrument}`;
                params.api.refreshCells({ rowNodes: [params.node], force: true });
            }
        },
        {
            field: 'type',
            headerName: 'TYPE',
            width: 120,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: [...PRICE_TYPES]
            },
            cellRenderer: (params: any) => {
                return getPlaceholderDisplayText(params.value);
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return {
                        backgroundColor: '#d2f9f8',
                        color: '#0c5a58',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    };
                }
                return null;
            },
            onCellValueChanged: (params: any) => {
                // Update display when any field changes
                const row = params.data;
                row.display = `${row.percentage} ${row.publisher} ${row.instrument}`;
                params.api.refreshCells({ rowNodes: [params.node], force: true });
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
                values: [...DATE_RULES]
            },
            cellRenderer: (params: any) => {
                return getPlaceholderDisplayText(params.value);
            },
            cellStyle: (params: any) => {
                if (isPlaceholder(params.value)) {
                    return {
                        backgroundColor: '#d2f9f8',
                        color: '#0c5a58',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    };
                }
                return null;
            },
            onCellValueChanged: (params: any) => {
                // Update display when any field changes
                const row = params.data;
                row.display = `${row.percentage} ${row.publisher} ${row.instrument}`;
                params.api.refreshCells({ rowNodes: [params.node], force: true });
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
            width: 250,
            editable: false,
            cellRenderer: (params: any) => {
                const row = params.data;
                const parts = [
                    row.percentage,
                    row.publisher,
                    row.instrument
                ];

                // Check if any part has placeholders
                const hasPlaceholder = parts.some(p => isPlaceholder(p));

                if (hasPlaceholder) {
                    // Render with mixed styling for placeholders
                    return (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '100%' }}>
                            {parts.map((part, idx) => {
                                const isPH = isPlaceholder(part);
                                return (
                                    <span
                                        key={idx}
                                        style={{
                                            color: isPH ? '#0c5a58' : '#262626',
                                            fontWeight: isPH ? 'bold' : 'normal',
                                            fontFamily: isPH ? 'monospace' : 'inherit',
                                            fontSize: isPH ? '11px' : '13px'
                                        }}
                                    >
                                        {getPlaceholderDisplayText(part)}
                                    </span>
                                );
                            })}
                        </div>
                    );
                }

                return row.display || parts.join(' ');
            }
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
                            color: '#595959',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                        onClick={() => {
                            const updated = [...formulas];
                            updated[formulaIndex].rows = updated[formulaIndex].rows.filter(row => row.id !== params.data.id);
                            setFormulas(updated);
                        }}
                    />
                </div>
            )
        }
    ];

    // Handler for row drag end event
    const handleFormulaRowDragEnd = (formulaIndex: number) => (event: any) => {
        const newRows: any[] = [];
        event.api.forEachNodeAfterFilterAndSort((node: any) => {
            newRows.push(node.data);
        });

        const updated = [...formulas];
        updated[formulaIndex].rows = newRows;
        setFormulas(updated);
    };

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
        suppressMenuHide: true,
        rowDragManaged: true,
        animateRows: true
    }), []);

    const handleAddFormulaRow = (formulaIndex: number) => {
        const updated = [...formulas];
        const currentFormula = updated[formulaIndex];

        const newRow = {
            id: currentFormula.rows.length + 1,
            publisher: 0,
            percentage: '',
            instrument: '',
            type: '',
            diff: 0,
            dateRule: '',
            required: '',
            display: '',
            uomCurrency: ''
        };

        currentFormula.rows = [...currentFormula.rows, newRow];
        setFormulas(updated);
    };

    return (
        <>
            <Vertical className="mb-4">
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
            <FormulaEditorDrawer
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                editingRow={editingRow}
                formulas={formulas}
                setFormulas={setFormulas}
                handleSaveFormula={handleSaveFormula}
                showTemplateManager={showTemplateManager}
                setShowTemplateManager={setShowTemplateManager}
                activeFormulaIndex={activeFormulaIndex}
                setActiveFormulaIndex={setActiveFormulaIndex}
                handleAddFormulaRow={handleAddFormulaRow}
                handleFormulaRowDragEnd={handleFormulaRowDragEnd}
                getFormulaColumnDefs={getFormulaColumnDefs}
                formulaGridAgProps={formulaGridAgProps}
                templates={templateFamilies}
                buildFormulaPreview={buildFormulaPreview}
                handleTemplateSelect={handleTemplateSelect}
            />

            {/* Save as Template Modal */}
            <Modal
                title="Save Formula as Template"
                visible={saveTemplateModalOpen}
                onOk={handleSaveTemplateConfirm}
                onCancel={() => {
                    setSaveTemplateModalOpen(false);
                    setNewTemplateName('');
                    setNewTemplateDescription('');
                    setNewTemplateCategory('Popular');
                }}
                okText="Save Template"
                cancelText="Cancel"
                width={600}
                getContainer={() => document.body}
                destroyOnClose={false}
            >
                <Vertical style={{ gap: '16px', marginTop: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Template Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            placeholder="Enter template name"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Category
                        </label>
                        <Select
                            value={newTemplateCategory}
                            onChange={(value) => setNewTemplateCategory(value)}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="Popular">Popular</Select.Option>
                            <Select.Option value="Partner">Partner</Select.Option>
                            <Select.Option value="Advanced">Advanced</Select.Option>
                            <Select.Option value="Specialty">Specialty</Select.Option>
                            <Select.Option value="Regional">Regional</Select.Option>
                            <Select.Option value="Seasonal">Seasonal</Select.Option>
                        </Select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Description
                        </label>
                        <Input.TextArea
                            placeholder="Enter template description (optional)"
                            value={newTemplateDescription}
                            onChange={(e) => setNewTemplateDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div style={{
                        padding: '12px',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '4px',
                        border: '1px solid #91d5ff'
                    }}>
                        <Texto style={{ margin: 0, fontSize: '12px', color: '#1890ff' }}>
                            💡 This will save the formula configuration from your price setup as a reusable template.
                            The template will be available in the Formula Template Chooser for future contracts.
                        </Texto>
                    </div>
                </Vertical>
            </Modal>
        </>
    );
}
