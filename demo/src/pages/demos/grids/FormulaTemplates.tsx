import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraviGrid, GraviButton, Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr';
import { PlusOutlined, EditOutlined, CloseOutlined, SaveOutlined, CopyOutlined, EyeOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { Drawer, Input, Select, Modal, message, Alert, Checkbox, Button, Radio, Popconfirm } from 'antd';
import { useFeatureMode } from '../../../contexts/FeatureModeContext';
import { getComponentCount, buildFormulaPreview, buildAutoFormulaPreview, formatMultipleDisplay, formatTooltipList, getFilterValue, PLACEHOLDER_VALUES, isPlaceholder, getPlaceholderDisplayText } from './FormulaTemplates.data';
import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext';
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor';
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors';

// Custom tooltip component for displaying vertical lists
const CustomTooltip = (props: any) => {
    const data = props.value;
    if (!data) return null;

    const items = data.split('\n');

    return (
        <div style={{
            backgroundColor: 'white',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxWidth: '300px'
        }}>
            {items.map((item: string, index: number) => (
                <div key={index} style={{
                    padding: '4px 0',
                    fontSize: '13px',
                    color: '#262626',
                    whiteSpace: 'nowrap'
                }}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export function FormulaTemplates() {
    const navigate = useNavigate();
    const { templates, addTemplate, updateTemplate, getTemplateById } = useFormulaTemplateContext();
    const { featureMode, setFeatureMode, isFutureMode } = useFeatureMode();

    // State for create template drawer
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
    const [isDuplicateMode, setIsDuplicateMode] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [product, setProduct] = useState('');
    const [contractType, setContractType] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [components, setComponents] = useState([
        { id: 1, percentage: '90%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
        { id: 2, percentage: '10%', operator: '+', source: 'OPIS', instrument: 'CBOB', dateRule: 'Current', type: 'Average' },
        { id: 3, percentage: '5%', operator: '-', source: 'Platts', instrument: 'Differential', dateRule: 'Prior Day', type: 'Fixed' }
    ]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // State for formula preview override
    const [useCustomPreview, setUseCustomPreview] = useState(false);
    const [customPreview, setCustomPreview] = useState('');

    // State for placeholder info modal
    const [placeholderModalVisible, setPlaceholderModalVisible] = useState(false);

    // Handlers for drawer
    const handleOpenDrawer = () => {
        // Reset form
        setTemplateName('');
        setProduct('');
        setContractType('');
        setLocation('');
        setComponents([]);
        setValidationErrors([]);
        setUseCustomPreview(false);
        setCustomPreview('');
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setShowConfirmModal(false);
        setValidationErrors([]);
    };

    // Handlers for edit drawer
    const handleOpenEditDrawer = useCallback((templateId: string) => {
        console.log('=== EDIT BUTTON CLICKED ===');
        console.log('Received Template ID:', templateId);
        console.log('Template ID type:', typeof templateId);

        const template = getTemplateById(templateId);
        console.log('Template found:', template);

        if (!template) {
            console.log('ERROR: Template not found for ID:', templateId);
            console.log('All templates:', templates);
            return;
        }

        console.log('=== OPENING EDIT DRAWER ===');
        console.log('Template ID:', templateId);
        console.log('Template object:', template);
        console.log('customFormulaPreview value:', template.customFormulaPreview);
        console.log('customFormulaPreview type:', typeof template.customFormulaPreview);
        console.log('customFormulaPreview !== undefined:', template.customFormulaPreview !== undefined);

        setEditingTemplateId(templateId);
        setTemplateName(template.name);
        setContractType(template.contractType);
        setComponents(template.components || []);

        const shouldUseCustom = template.customFormulaPreview !== undefined;
        const customText = template.customFormulaPreview || '';

        console.log('Setting useCustomPreview to:', shouldUseCustom);
        console.log('Setting customPreview to:', customText);

        setUseCustomPreview(shouldUseCustom);
        setCustomPreview(customText);
        setValidationErrors([]);
        setEditDrawerOpen(true);
    }, [getTemplateById, templates]);

    const handleCloseEditDrawer = () => {
        setEditDrawerOpen(false);
        setEditingTemplateId(null);
        setIsDuplicateMode(false);
        setValidationErrors([]);
        setUseCustomPreview(false);
        setCustomPreview('');
    };

    const handleDuplicate = useCallback((templateId: string) => {
        const template = getTemplateById(templateId);
        if (!template) return;

        setEditingTemplateId(null); // No ID means we're creating new
        setIsDuplicateMode(true);
        setTemplateName(template.name + ' (Copy)');
        setContractType(template.contractType);
        setComponents(template.components || []);
        setUseCustomPreview(template.customFormulaPreview !== undefined);
        setCustomPreview(template.customFormulaPreview || '');
        setValidationErrors([]);
        setEditDrawerOpen(true);
    }, [getTemplateById]);

    const checkNameConflict = (name: string, excludeId?: string): boolean => {
        return templates.some(t =>
            t.name.toLowerCase() === name.toLowerCase().trim() &&
            t.id !== excludeId
        );
    };

    const handleSaveEdit = () => {
        console.log('=== HANDLE SAVE EDIT CLICKED ===');
        console.log('useCustomPreview:', useCustomPreview);
        console.log('customPreview:', customPreview);
        console.log('editingTemplateId:', editingTemplateId);
        console.log('isDuplicateMode:', isDuplicateMode);

        const errors: string[] = [];
        if (!templateName || templateName.trim().length < 3) {
            errors.push('Template name must be at least 3 characters');
        }
        if (!contractType) errors.push('Contract type is required');
        if (components.length === 0) {
            errors.push('At least one component is required');
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            message.warning('Please fix the validation errors before saving');
            return;
        }

        // Handle duplicate/create mode
        if (isDuplicateMode || !editingTemplateId) {
            // Check for name conflict
            if (checkNameConflict(templateName)) {
                Modal.confirm({
                    title: 'Template Name Already Exists',
                    content: `A template named "${templateName}" already exists. Do you want to replace it?`,
                    okText: 'Replace Existing',
                    cancelText: 'Go Back and Modify Name',
                    onOk: () => {
                        // Find and update the existing template
                        const existing = templates.find(t => t.name.toLowerCase() === templateName.toLowerCase().trim());
                        if (existing) {
                            updateTemplate(existing.id, {
                                name: templateName,
                                contractType,
                                components,
                                customFormulaPreview: useCustomPreview ? (customPreview || '') : undefined
                            });
                            setEditDrawerOpen(false);
                            setIsDuplicateMode(false);
                            message.success(`Template '${templateName}' replaced successfully`);
                        }
                    }
                });
                return;
            }

            // Create new template
            addTemplate({
                name: templateName,
                contractType,
                product: '',
                location: '',
                category: 'Popular',
                description: `Created ${new Date().toLocaleDateString()}`,
                createdBy: 'Frank Overland',
                components,
                customFormulaPreview: useCustomPreview ? (customPreview || '') : undefined
            });

            setEditDrawerOpen(false);
            setIsDuplicateMode(false);
            message.success(`Template '${templateName}' created successfully`);
        } else {
            // Edit existing template - check name conflict with other templates
            if (checkNameConflict(templateName, editingTemplateId)) {
                Modal.confirm({
                    title: 'Template Name Already Exists',
                    content: `A template named "${templateName}" already exists. Do you want to replace it?`,
                    okText: 'Replace Existing',
                    cancelText: 'Go Back and Modify Name',
                    onOk: () => {
                        const existing = templates.find(t =>
                            t.name.toLowerCase() === templateName.toLowerCase().trim() &&
                            t.id !== editingTemplateId
                        );
                        if (existing) {
                            updateTemplate(existing.id, {
                                name: templateName,
                                contractType,
                                components,
                                customFormulaPreview: useCustomPreview ? (customPreview || '') : undefined
                            });
                            setEditDrawerOpen(false);
                            message.success(`Template '${templateName}' replaced successfully`);
                        }
                    }
                });
                return;
            }

            // Update existing template
            console.log('=== UPDATING EXISTING TEMPLATE ===');
            console.log('Template ID:', editingTemplateId);
            console.log('Updating with customFormulaPreview:', useCustomPreview ? (customPreview || '') : undefined);

            updateTemplate(editingTemplateId, {
                name: templateName,
                contractType,
                components,
                customFormulaPreview: useCustomPreview ? (customPreview || '') : undefined
            });

            setEditDrawerOpen(false);
            message.success(`Template '${templateName}' updated successfully`);
        }
    };

    const handleAddComponent = () => {
        const maxId = components.length > 0 ? Math.max(...components.map(c => c.id)) : 0;
        const newComponent = {
            id: maxId + 1,
            percentage: PLACEHOLDER_VALUES.PERCENTAGE,
            source: PLACEHOLDER_VALUES.SOURCE,
            instrument: PLACEHOLDER_VALUES.INSTRUMENT,
            dateRule: PLACEHOLDER_VALUES.DATE_RULE,
            type: PLACEHOLDER_VALUES.TYPE,
            display: ''  // Will be auto-generated by valueGetter
        };
        setComponents([...components, newComponent]);
    };

    // Auto-generated formula preview (updates as components change)
    const autoGeneratedPreview = useMemo(() => {
        return buildAutoFormulaPreview(components);
    }, [components]);

    const validateForm = (): string[] => {
        const errors: string[] = [];

        if (!templateName || templateName.trim().length < 3) {
            errors.push('Template name must be at least 3 characters');
        }
        if (!product) errors.push('Product is required');
        if (!contractType) errors.push('Contract type is required');
        if (!location) errors.push('Location is required');
        if (components.length === 0) {
            errors.push('At least one component is required');
        }

        return errors;
    };

    const handleSave = () => {
        console.log('handleSave clicked');
        console.log('Current state:', { templateName, product, contractType, location, category, components });

        const errors = validateForm();
        console.log('Validation errors:', errors);

        if (errors.length > 0) {
            setValidationErrors(errors);
            message.warning('Please fix the validation errors before saving');
            return;
        }

        setValidationErrors([]);

        // Save directly without confirmation
        console.log('=== SAVING NEW TEMPLATE (CREATE DRAWER) ===');
        console.log('useCustomPreview:', useCustomPreview);
        console.log('customPreview:', customPreview);
        console.log('Will save customFormulaPreview as:', useCustomPreview ? (customPreview || '') : undefined);

        const newTemplate = addTemplate({
            name: templateName,
            contractType,
            product,
            location,
            category: category as any,
            description: `Created ${new Date().toLocaleDateString()}`,
            createdBy: 'Frank Overland',
            components,
            customFormulaPreview: useCustomPreview ? (customPreview || '') : undefined
        });

        // Close drawer and show success message
        setDrawerOpen(false);
        message.success(`Template '${templateName}' created successfully`);
    };

    // Column definitions for the templates grid
    const columnDefs = useMemo(() => {
        const baseColumns = [
        {
            field: 'name',
            headerName: 'NAME',
            width: 250,
            pinned: 'left',
            lockPosition: true,
            cellStyle: { fontWeight: 600 },
            sortable: true,
            filter: true
        },
        {
            field: 'contractType',
            headerName: 'CONTRACT TYPE',
            width: 140,
            sortable: true,
            filter: true
        },
        {
            field: 'usedInProducts',
            headerName: 'PRODUCTS',
            width: 180,
            valueGetter: (params: any) => formatMultipleDisplay(params.data?.usedInProducts || [], 'Products'),
            tooltipValueGetter: (params: any) => formatTooltipList(params.data?.usedInProducts || []),
            tooltipComponent: CustomTooltip,
            filterValueGetter: (params: any) => getFilterValue(params.data?.usedInProducts || []),
            sortable: true,
            filter: true,
            cellRenderer: (params: any) => {
                const items = params.data?.usedInProducts || [];
                if (items.length > 1) {
                    return (
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                            {params.value}
                        </span>
                    );
                }
                return <span>{params.value}</span>;
            }
        },
        {
            field: 'usedInLocations',
            headerName: 'LOCATIONS',
            width: 180,
            valueGetter: (params: any) => formatMultipleDisplay(params.data?.usedInLocations || [], 'Locations'),
            tooltipValueGetter: (params: any) => formatTooltipList(params.data?.usedInLocations || []),
            tooltipComponent: CustomTooltip,
            filterValueGetter: (params: any) => getFilterValue(params.data?.usedInLocations || []),
            sortable: true,
            filter: true,
            cellRenderer: (params: any) => {
                const items = params.data?.usedInLocations || [];
                if (items.length > 1) {
                    return (
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                            {params.value}
                        </span>
                    );
                }
                return <span>{params.value}</span>;
            }
        },
        {
            field: 'preview',
            headerName: 'FORMULA',
            flex: 1,
            minWidth: 300,
            valueGetter: (params: any) => buildFormulaPreview(params.data),
            cellRenderer: (params: any) => {
                const preview = params.value;
                const components = params.data?.components || [];

                // Check if any component has placeholders
                const hasPlaceholders = components.some((comp: any) =>
                    isPlaceholder(comp.percentage) ||
                    isPlaceholder(comp.source) ||
                    isPlaceholder(comp.instrument) ||
                    isPlaceholder(comp.dateRule) ||
                    isPlaceholder(comp.type)
                );

                if (hasPlaceholders) {
                    // Build a more readable preview with placeholder text
                    const previewParts = components.map((comp: any, idx: number) => {
                        const operator = idx > 0 ? (comp.percentage?.toString().startsWith('-') ? ' - ' : ' + ') : '';
                        const pct = getPlaceholderDisplayText(comp.percentage);
                        const src = getPlaceholderDisplayText(comp.source);
                        const instr = getPlaceholderDisplayText(comp.instrument);
                        return `${operator}${pct} ${src} ${instr}`;
                    }).join('');

                    return (
                        <div style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '11px',
                            color: '#0c5a58',
                            fontWeight: 'bold'
                        }}>
                            {previewParts}
                        </div>
                    );
                }

                return (
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#595959'
                    }}>
                        {preview}
                    </div>
                );
            },
            sortable: false,
            filter: false
        },
        {
            field: 'lastModified',
            headerName: 'LAST MODIFIED',
            width: 140,
            valueFormatter: (params: any) => {
                if (!params.value) return '';
                const date = new Date(params.value);
                return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
            },
            sortable: true,
            filter: 'agDateColumnFilter'
        },
        {
            headerName: 'ACTIONS',
            width: 120,
            pinned: 'right',
            lockPosition: true,
            cellRenderer: (params: any) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    height: '100%'
                }}>
                    <EditOutlined
                        style={{
                            color: '#595959',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                        onClick={() => handleOpenEditDrawer(params.data.id)}
                        title="Edit template"
                    />
                    <CopyOutlined
                        style={{
                            color: '#595959',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#262626'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                        onClick={() => handleDuplicate(params.data.id)}
                        title="Duplicate template"
                    />
                </div>
            ),
            suppressMenu: true,
            sortable: false,
            filter: false
        }
        ];

        // Future state columns (only shown when featureMode is 'future')
        const futureColumns = isFutureMode ? [
            {
                field: 'totalUsage',
                headerName: 'USAGE',
                width: 100,
                type: 'rightAligned',
                cellRenderer: (params: any) => (
                    <span style={{ fontWeight: 500 }}>{params.value}</span>
                ),
                sortable: true,
                filter: 'agNumberColumnFilter'
            },
            {
                field: 'lastUsedDate',
                headerName: 'LAST USED',
                width: 140,
                valueFormatter: (params: any) => {
                    if (!params.value) return '';
                    const date = new Date(params.value);
                    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                },
                sortable: true,
                filter: 'agDateColumnFilter'
            }
        ] : [];

        // Insert future columns before LAST MODIFIED and ACTIONS
        const lastModifiedIndex = baseColumns.findIndex(col => col.field === 'lastModified');
        return [
            ...baseColumns.slice(0, lastModifiedIndex),
            ...futureColumns,
            ...baseColumns.slice(lastModifiedIndex)
        ];
    }, [navigate, handleOpenEditDrawer, handleDuplicate, isFutureMode]);

    // Grid configuration
    const agPropOverrides = useMemo(() => ({
        domLayout: 'normal',
        headerHeight: 40,
        rowHeight: 48,
        suppressRowClickSelection: true,
        suppressMovableColumns: true,
        suppressColumnVirtualisation: true,
        enableSorting: true,
        pagination: true,
        paginationPageSize: 20,
        animateRows: true,
        tooltipShowDelay: 500,
        enableBrowserTooltips: false,
        singleClickEdit: false,
        stopEditingWhenCellsLoseFocus: true,
        suppressClickEdit: true,
        defaultColDef: {
            editable: false
        }
    }), []);

    // Control bar configuration
    const controlBarProps = useMemo(() => ({
        title: 'Formula Templates',
        hideActiveFilters: false,
        actionButtons: (
            <GraviButton
                buttonText="Add New Formula Template"
                icon={<PlusOutlined />}
                appearance="solid"
                onClick={handleOpenDrawer}
                style={{
                    fontWeight: 'bold',
                    backgroundColor: '#51b073',
                    color: 'white'
                }}
            />
        )
    }), [handleOpenDrawer]);

    const updateEP = async (params: any) => {
        console.log('Update called with:', params);
        return Promise.resolve();
    };

    // Component grid column definitions
    const componentColumnDefs = [
        {
            rowDrag: true,
            width: 40,
            suppressMenu: true,
            lockPosition: true,
            pinned: 'left',
            rowDragText: (params: any) => params.rowNode.data.percentage
        },
        {
            field: 'percentage',
            headerName: '%',
            width: 100,
            editable: true,
            cellEditor: SearchableSelect,
            suppressKeyboardEvent,
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
            pinned: 'right',
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
                                setComponents(components.filter(c => c.id !== params.data.id));
                            }}
                        />
                    </div>
                );
            }
        }
    ];

    // Formula preview based on components
    const formulaPreview = useMemo(() => {
        console.log('Rebuilding formula preview with components:', components);
        if (components.length === 0) return 'No components';
        const preview = components.map((c, i) => {
            // Determine operator based on percentage sign
            let operator = '';
            if (i > 0) {
                const isNegative = c.percentage.toString().trim().startsWith('-');
                operator = isNegative ? ' - ' : ' + ';
            }
            // Remove leading - from percentage if it exists
            const displayPercentage = c.percentage.toString().trim().replace(/^-/, '');
            return `${operator}${displayPercentage} ${c.source} ${c.instrument}`;
        }).join('');
        console.log('Formula preview:', preview);
        return preview;
    }, [components]);


    return (
        <>
            <div style={{ height: '100%', padding: '24px' }}>
                <GraviGrid
                    key={featureMode}
                    rowData={templates}
                    columnDefs={columnDefs}
                    agPropOverrides={agPropOverrides}
                    controlBarProps={controlBarProps}
                    updateEP={updateEP}
                />
            </div>

            {/* Create Template Drawer */}
            <Drawer
                title={null}
                placement="bottom"
                height="80%"
                visible={drawerOpen}
                onClose={handleCloseDrawer}
                closable={false}
                bodyStyle={{ padding: 0 }}
            >
                {/* Drawer Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff'
                }}>
                    <Horizontal style={{ gap: '16px', alignItems: 'center' }}>
                        <CloseOutlined
                            style={{ fontSize: '16px', cursor: 'pointer', color: '#595959' }}
                            onClick={handleCloseDrawer}
                        />
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                            Create Formula Template
                        </h2>
                    </Horizontal>
                    <GraviButton
                        buttonText="Save"
                        icon={<SaveOutlined />}
                        appearance="solid"
                        onClick={handleSave}
                        style={{
                            fontWeight: 'bold',
                            backgroundColor: '#51b073',
                            color: 'white'
                        }}
                    />
                </div>

                {/* Drawer Content */}
                <Vertical style={{ padding: '24px', gap: '24px', height: 'calc(100% - 72px)', overflow: 'auto' }}>
                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                        <Alert
                            message="Validation Errors"
                            description={
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    {validationErrors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            }
                            type="error"
                            closable
                            onClose={() => setValidationErrors([])}
                        />
                    )}

                    {/* Template Information */}
                    <div>
                        <Texto style={{
                            margin: '0 0 16px 0',
                            color: '#595959',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            Template Information
                        </Texto>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Single Row: All fields */}
                            <Horizontal style={{ gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Template Name *
                                    </label>
                                    <Input
                                        placeholder="Enter template name"
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Product *
                                    </label>
                                    <Select
                                        placeholder="Select product"
                                        value={product}
                                        onChange={setProduct}
                                        style={{ width: '100%' }}
                                        options={[
                                            { value: 'Gasoline', label: 'Gasoline' },
                                            { value: 'Diesel', label: 'Diesel' },
                                            { value: 'Crude', label: 'Crude' },
                                            { value: 'Jet Fuel', label: 'Jet Fuel' }
                                        ]}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Location *
                                    </label>
                                    <Select
                                        placeholder="Select location"
                                        value={location}
                                        onChange={setLocation}
                                        style={{ width: '100%' }}
                                        options={[
                                            { value: 'USGC', label: 'USGC' },
                                            { value: 'Cushing', label: 'Cushing' },
                                            { value: 'PADD 1', label: 'PADD 1' },
                                            { value: 'PADD 5', label: 'PADD 5' }
                                        ]}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Category *
                                    </label>
                                    <Select
                                        placeholder="Select category"
                                        value={contractType}
                                        onChange={setContractType}
                                        style={{ width: '100%' }}
                                        options={[
                                            { value: 'Fixed', label: 'Fixed' },
                                            { value: 'Index', label: 'Index' },
                                            { value: 'Formula', label: 'Formula' }
                                        ]}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Created By
                                    </label>
                                    <Input
                                        value="Frank Overland"
                                        disabled
                                        style={{ width: '100%', backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    {/* Empty spacer to maintain even layout */}
                                </div>
                            </Horizontal>
                        </div>
                    </div>

                    {/* Formula */}
                    <div>
                        <Texto style={{
                            margin: '0 0 12px 0',
                            color: '#595959',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            Formula
                        </Texto>

                        {/* Auto-Generated Preview */}
                        <div className="mb-2">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                Auto-Generated
                            </label>
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
                                wordBreak: 'break-word',
                                minHeight: '60px'
                            }}>
                                {autoGeneratedPreview || 'No components added yet'}
                            </div>
                        </div>

                        {/* Override Checkbox - Below Auto-Generated Preview */}
                        <div className="mb-2">
                            <Checkbox
                                checked={useCustomPreview}
                                onChange={(e) => setUseCustomPreview(e.target.checked)}
                            >
                                Custom Formula Name
                            </Checkbox>
                        </div>

                        {/* Custom Preview (only visible when override checkbox is checked) */}
                        {useCustomPreview && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                    Custom Formula Name (Customer-Facing)
                                </label>
                                <Input.TextArea
                                    placeholder="Enter custom formula name for internal visibility"
                                    value={customPreview}
                                    onChange={(e) => setCustomPreview(e.target.value)}
                                    rows={3}
                                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '13px' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Formula Components */}
                    <div>
                        <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <Texto style={{
                                margin: 0,
                                color: '#595959',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}>
                                Formula Components
                            </Texto>
                            <GraviButton
                                buttonText="Add Component"
                                icon={<PlusOutlined />}
                                appearance="solid"
                                onClick={handleAddComponent}
                                style={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#51b073',
                                    color: 'white'
                                }}
                            />
                        </Horizontal>

                        {/* Guidance Text */}
                        <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f0f5ff', borderRadius: '4px', border: '1px solid #d6e4ff' }}>
                            <Texto category="p2" appearance="medium">
                                Use placeholders (e.g., <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600 }}>[*INSTR*]</span>) for fields that will be customized later when applying this template.{' '}
                                <a
                                    onClick={() => setPlaceholderModalVisible(true)}
                                    style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Tell me more
                                </a>
                            </Texto>
                        </div>

                        <div style={{ height: '300px', width: '100%' }}>
                            <GraviGrid
                                rowData={components}
                                columnDefs={componentColumnDefs}
                                agPropOverrides={{
                                    domLayout: 'autoHeight',
                                    headerHeight: 40,
                                    rowHeight: 40,
                                    suppressRowClickSelection: true,
                                    suppressMovableColumns: true,
                                    animateRows: true,
                                    rowDragManaged: true,
                                    rowDragEntireRow: true,
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
                                    },
                                    onRowDragEnd: (event: any) => {
                                        console.log('Row drag ended');
                                        // Get all rows in their new order
                                        const newOrder: any[] = [];
                                        event.api.forEachNode((node: any) => newOrder.push(node.data));
                                        setComponents(newOrder);
                                        console.log('Updated component order:', newOrder);
                                    }
                                }}
                                hideControlBar={true}
                            />
                        </div>
                    </div>
                </Vertical>
            </Drawer>

            {/* Edit Template Drawer */}
            <Drawer
                title={null}
                placement="bottom"
                height="85%"
                visible={editDrawerOpen}
                onClose={handleCloseEditDrawer}
                closable={false}
                bodyStyle={{ padding: 0 }}
            >
                {/* Drawer Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff'
                }}>
                    <Horizontal style={{ gap: '16px', alignItems: 'center' }}>
                        <CloseOutlined
                            style={{ fontSize: '16px', cursor: 'pointer', color: '#595959' }}
                            onClick={handleCloseEditDrawer}
                        />
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                            {isDuplicateMode ? 'Duplicate Formula Template' : 'Edit Formula Template'}
                        </h2>
                    </Horizontal>
                    <GraviButton
                        buttonText="Save"
                        icon={<SaveOutlined />}
                        appearance="solid"
                        onClick={handleSaveEdit}
                        style={{
                            fontWeight: 'bold',
                            backgroundColor: '#51b073',
                            color: 'white'
                        }}
                    />
                </div>

                {/* Drawer Body */}
                <Vertical style={{ padding: '24px', gap: '20px', height: 'calc(100% - 65px)', overflow: 'auto' }}>
                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                        <Alert
                            message="Validation Errors"
                            description={
                                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                                    {validationErrors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            }
                            type="error"
                            closable
                            onClose={() => setValidationErrors([])}
                        />
                    )}

                    {/* Compressed Template Information - Single Row */}
                    <div>
                        <Texto style={{
                            margin: '0 0 12px 0',
                            color: '#595959',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            Template Information
                        </Texto>
                        <div style={{ padding: '20px', backgroundColor: '#fafafa', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
                            <Horizontal style={{ gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Template Name *
                                    </label>
                                    <Input
                                        placeholder="Enter template name"
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Product *
                                    </label>
                                    <Select
                                        placeholder="Select product"
                                        value={product}
                                        onChange={setProduct}
                                        style={{ width: '100%' }}
                                        options={[
                                            { value: 'Gasoline', label: 'Gasoline' },
                                            { value: 'Diesel', label: 'Diesel' },
                                            { value: 'Crude', label: 'Crude' },
                                            { value: 'Jet Fuel', label: 'Jet Fuel' }
                                        ]}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Location *
                                    </label>
                                    <Select
                                        placeholder="Select location"
                                        value={location}
                                        onChange={setLocation}
                                        style={{ width: '100%' }}
                                        options={[
                                            { value: 'USGC', label: 'USGC' },
                                            { value: 'Cushing', label: 'Cushing' },
                                            { value: 'PADD 1', label: 'PADD 1' },
                                            { value: 'PADD 5', label: 'PADD 5' }
                                        ]}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Category *
                                    </label>
                                    <Select
                                        placeholder="Select category"
                                        value={contractType}
                                        onChange={setContractType}
                                        style={{ width: '100%' }}
                                        options={[
                                            { value: 'Fixed', label: 'Fixed' },
                                            { value: 'Index', label: 'Index' },
                                            { value: 'Formula', label: 'Formula' }
                                        ]}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                        Created By
                                    </label>
                                    <Input
                                        value="Frank Overland"
                                        disabled
                                        style={{ width: '100%', backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                            </Horizontal>
                        </div>
                    </div>

                    {/* Formula Preview Section */}
                    <div>
                        <Texto style={{
                            margin: '0 0 12px 0',
                            color: '#595959',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            Formula
                        </Texto>

                        {/* Auto-Generated Preview (always visible, grayed out when override is active) */}
                        <div className="mb-2">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                                Auto-Generated
                            </label>
                            <div style={{
                                padding: '12px 16px',
                                backgroundColor: useCustomPreview ? '#f5f5f5' : '#fafafa',
                                borderRadius: '4px',
                                border: '1px solid #d9d9d9',
                                fontFamily: 'monospace',
                                fontSize: '13px',
                                lineHeight: '1.6',
                                color: useCustomPreview ? '#8c8c8c' : '#262626',
                                minHeight: '48px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {autoGeneratedPreview || 'No components added yet'}
                            </div>
                        </div>

                        {/* Override Checkbox - Below Auto-Generated Preview */}
                        <div className="mb-2">
                            <Checkbox
                                checked={useCustomPreview}
                                onChange={(e) => setUseCustomPreview(e.target.checked)}
                            >
                                Override Formula
                            </Checkbox>
                        </div>

                        {/* Custom Preview (only visible when override checkbox is checked) */}
                        {useCustomPreview && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                                    Custom Preview (Customer-Facing)
                                </label>
                                <Input.TextArea
                                    value={customPreview}
                                    onChange={(e) => setCustomPreview(e.target.value)}
                                    placeholder="Enter custom formula preview (e.g., 'Spot + Differential')"
                                    rows={3}
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: '13px'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Formula Components - Takes Most Space */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
                        <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <Texto style={{
                                margin: 0,
                                color: '#595959',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}>
                                Formula Components
                            </Texto>
                            <GraviButton
                                buttonText="Add Component"
                                icon={<PlusOutlined />}
                                appearance="solid"
                                onClick={handleAddComponent}
                                style={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#51b073',
                                    color: 'white'
                                }}
                            />
                        </Horizontal>

                        {/* Guidance Text */}
                        <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f0f5ff', borderRadius: '4px', border: '1px solid #d6e4ff' }}>
                            <Texto category="p2" appearance="medium">
                                Use placeholders (e.g., <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600 }}>[*INSTR*]</span>) for fields that will be customized later when applying this template.{' '}
                                <a
                                    onClick={() => setPlaceholderModalVisible(true)}
                                    style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Tell me more
                                </a>
                            </Texto>
                        </div>

                        <div style={{ flex: 1, width: '100%' }}>
                            <GraviGrid
                                rowData={components}
                                columnDefs={componentColumnDefs}
                                agPropOverrides={{
                                    domLayout: 'normal',
                                    headerHeight: 40,
                                    rowHeight: 40,
                                    suppressRowClickSelection: true,
                                    suppressMovableColumns: true,
                                    animateRows: true,
                                    rowDragManaged: true,
                                    rowDragEntireRow: true,
                                    onCellValueChanged: (event: any) => {
                                        setComponents([...components]);
                                    },
                                    onRowDragEnd: (event: any) => {
                                        console.log('Row drag ended in EDIT drawer');
                                        // Get all rows in their new order
                                        const newOrder: any[] = [];
                                        event.api.forEachNode((node: any) => newOrder.push(node.data));
                                        setComponents(newOrder);
                                        console.log('Updated component order:', newOrder);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </Vertical>
            </Drawer>

            {/* Floating Action Button for View Settings */}
            <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
                size="large"
                onClick={() => setSettingsDrawerVisible(true)}
                style={{
                    position: 'fixed',
                    right: '24px',
                    bottom: '24px',
                    width: '56px',
                    height: '56px',
                    fontSize: '24px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            />

            {/* Settings Drawer */}
            <Drawer
                title="View Settings"
                placement="right"
                width={450}
                onClose={() => setSettingsDrawerVisible(false)}
                visible={settingsDrawerVisible}
                zIndex={2000}
                maskClosable={true}
                destroyOnClose={true}
                getContainer={() => document.body}
            >
                <Vertical style={{ gap: '24px' }}>
                    {/* Feature Prioritization Section */}
                    <div>
                        <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
                            Feature Prioritization
                        </Texto>
                        <Texto category="p2" appearance="medium" style={{ marginBottom: '16px', display: 'block', color: '#8c8c8c' }}>
                            Control which features are visible
                        </Texto>

                        <Radio.Group
                            value={featureMode}
                            onChange={(e) => setFeatureMode(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <Vertical style={{ gap: '12px' }}>
                                <Radio value="mvp" style={{ width: '100%', padding: '12px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                                    <div>
                                        <Texto weight="600">MVP (Minimum Viable Product)</Texto>
                                        <Texto category="p2" appearance="medium" style={{ color: '#8c8c8c', marginTop: '4px' }}>
                                            Show only essential features
                                        </Texto>
                                    </div>
                                </Radio>
                                <Radio value="future-state" style={{ width: '100%', padding: '12px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                                    <div>
                                        <Texto weight="600">Future State</Texto>
                                        <Texto category="p2" appearance="medium" style={{ color: '#8c8c8c', marginTop: '4px' }}>
                                            Show all features including future enhancements
                                        </Texto>
                                    </div>
                                </Radio>
                            </Vertical>
                        </Radio.Group>
                    </div>

                    {/* Feature Details */}
                    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                        <Texto category="p2" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
                            {isFutureMode ? 'Future State Features' : 'MVP Features'}
                        </Texto>
                        <Texto category="p2" appearance="medium" style={{ color: '#595959' }}>
                            {isFutureMode
                                ? 'Shows USAGE and LAST USED columns for advanced tracking.'
                                : 'Shows core formula template management features only.'}
                        </Texto>
                    </div>
                </Vertical>
            </Drawer>

            {/* Placeholder Info Modal */}
            <Modal
                title={<Texto category="h5" weight="600">About Placeholders in Formula Templates</Texto>}
                visible={placeholderModalVisible}
                onCancel={() => setPlaceholderModalVisible(false)}
                footer={[
                    <GraviButton
                        key="close"
                        buttonText="Got It"
                        appearance="solid"
                        onClick={() => setPlaceholderModalVisible(false)}
                        style={{
                            fontWeight: 'bold',
                            backgroundColor: '#51b073',
                            color: 'white'
                        }}
                    />
                ]}
                width={700}
            >
                <Vertical style={{ gap: '20px' }}>
                    {/* What are placeholders */}
                    <div>
                        <Texto category="p1" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
                            What are placeholders?
                        </Texto>
                        <Texto category="p2" appearance="medium">
                            Placeholders allow you to create flexible, reusable formula templates by marking fields that will be customized later. Instead of specifying exact values for every field, you can use placeholder values like <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600 }}>[*INSTR*]</span> for instrument or <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600 }}>[*SRC*]</span> for publisher.
                        </Texto>
                    </div>

                    {/* When to use them */}
                    <div>
                        <Texto category="p1" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
                            When should I use placeholders?
                        </Texto>
                        <Texto category="p2" appearance="medium">
                            Use placeholders when you want to create a template that can be applied to multiple products, locations, or scenarios where certain fields will vary. For example, if you have a standard pricing structure that works for multiple instruments, you can leave the instrument field as a placeholder.
                        </Texto>
                    </div>

                    {/* Available placeholders */}
                    <div>
                        <Texto category="p1" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
                            Available placeholders:
                        </Texto>
                        <div style={{ padding: '12px', backgroundColor: '#fafafa', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
                            <Vertical style={{ gap: '8px' }}>
                                <Horizontal style={{ gap: '12px' }}>
                                    <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600, minWidth: '120px' }}>[*PCT*]</span>
                                    <Texto category="p2" appearance="medium">Percentage value</Texto>
                                </Horizontal>
                                <Horizontal style={{ gap: '12px' }}>
                                    <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600, minWidth: '120px' }}>[*SRC*]</span>
                                    <Texto category="p2" appearance="medium">Publisher/Source (Argus, OPIS, etc.)</Texto>
                                </Horizontal>
                                <Horizontal style={{ gap: '12px' }}>
                                    <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600, minWidth: '120px' }}>[*INSTR*]</span>
                                    <Texto category="p2" appearance="medium">Instrument (CBOB, ULSD, etc.)</Texto>
                                </Horizontal>
                                <Horizontal style={{ gap: '12px' }}>
                                    <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600, minWidth: '120px' }}>[*DATE*]</span>
                                    <Texto category="p2" appearance="medium">Date Rule (Prior Day, Current, etc.)</Texto>
                                </Horizontal>
                                <Horizontal style={{ gap: '12px' }}>
                                    <span style={{ fontFamily: 'monospace', color: '#722ed1', fontWeight: 600, minWidth: '120px' }}>[*TYPE*]</span>
                                    <Texto category="p2" appearance="medium">Type (Settle, Average, Fixed, etc.)</Texto>
                                </Horizontal>
                            </Vertical>
                        </div>
                    </div>

                    {/* How they work */}
                    <div>
                        <Texto category="p1" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
                            How do placeholders work?
                        </Texto>
                        <div style={{ padding: '16px', backgroundColor: '#f0f5ff', borderRadius: '4px', border: '1px solid #d6e4ff' }}>
                            <Vertical style={{ gap: '12px' }}>
                                <div>
                                    <Texto category="p2" weight="600" style={{ marginBottom: '4px', display: 'block' }}>
                                        1. Create Template with Placeholders
                                    </Texto>
                                    <Texto category="p2" appearance="medium" style={{ fontSize: '12px' }}>
                                        When building your template, select placeholder options from the dropdowns for any fields you want to customize later.
                                    </Texto>
                                </div>
                                <div>
                                    <Texto category="p2" weight="600" style={{ marginBottom: '4px', display: 'block' }}>
                                        2. Visual Highlighting
                                    </Texto>
                                    <Texto category="p2" appearance="medium" style={{ fontSize: '12px' }}>
                                        Placeholder cells are highlighted in <span style={{ backgroundColor: '#f3e8ff', color: '#722ed1', padding: '2px 6px', borderRadius: '3px', fontWeight: 600 }}>purple</span> so you can easily identify which fields need to be filled in later.
                                    </Texto>
                                </div>
                                <div>
                                    <Texto category="p2" weight="600" style={{ marginBottom: '4px', display: 'block' }}>
                                        3. Apply Template
                                    </Texto>
                                    <Texto category="p2" appearance="medium" style={{ fontSize: '12px' }}>
                                        When you import this template into a contract formula, you'll fill in the specific values for each placeholder field.
                                    </Texto>
                                </div>
                                <div>
                                    <Texto category="p2" weight="600" style={{ marginBottom: '4px', display: 'block' }}>
                                        4. Template Ready to Use
                                    </Texto>
                                    <Texto category="p2" appearance="medium" style={{ fontSize: '12px' }}>
                                        Once all placeholders are replaced with actual values, your formula is complete and ready to use.
                                    </Texto>
                                </div>
                            </Vertical>
                        </div>
                    </div>

                    {/* Example */}
                    <div>
                        <Texto category="p1" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
                            Example:
                        </Texto>
                        <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
                            <Vertical style={{ gap: '12px' }}>
                                <div>
                                    <Texto category="p2" appearance="medium" style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                        Template Formula:
                                    </Texto>
                                    <Texto category="p2" style={{ fontFamily: 'monospace', marginTop: '4px', display: 'block' }}>
                                        100% <span style={{ color: '#722ed1', fontWeight: 600 }}>[*SRC*]</span> <span style={{ color: '#722ed1', fontWeight: 600 }}>[*INSTR*]</span> Prior Day Settle
                                    </Texto>
                                </div>
                                <div style={{ borderLeft: '3px solid #1890ff', paddingLeft: '12px' }}>
                                    <Texto category="p2" appearance="medium" style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                        After Importing (User fills in):
                                    </Texto>
                                    <Texto category="p2" style={{ fontFamily: 'monospace', marginTop: '4px', display: 'block' }}>
                                        100% <span style={{ color: '#52c41a', fontWeight: 600 }}>Argus</span> <span style={{ color: '#52c41a', fontWeight: 600 }}>CBOB USGC</span> Prior Day Settle
                                    </Texto>
                                </div>
                            </Vertical>
                        </div>
                    </div>
                </Vertical>
            </Modal>

        </>
    );
}
