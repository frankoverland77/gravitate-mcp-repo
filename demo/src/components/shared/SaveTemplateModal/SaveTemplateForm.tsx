import React, { useState, useEffect, useMemo } from 'react';
import { Input, Select, Checkbox, Button } from 'antd';
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';
import { FormulaComponentsGrid } from '../Grid/FormulaComponentsGrid';
import { PLACEHOLDER_VALUES, buildAutoFormulaPreview } from '../../../pages/demos/grids/FormulaTemplates.data';
import { getTerminalLocations } from '../../../shared/data';

export interface SaveTemplateFormProps {
    initialData: {
        formulaName?: string;
        components: any[];
        product?: string | string[];
        location?: string | string[];
    };
    onSave: (templateData: any) => void;
    onCancel: () => void;
}

export function SaveTemplateForm({
    initialData,
    onSave,
    onCancel
}: SaveTemplateFormProps) {
    // Form state
    const [templateName, setTemplateName] = useState('');
    const [products, setProducts] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [category, setCategory] = useState('Formula');
    const [description, setDescription] = useState('');
    const [useCustomPreview, setUseCustomPreview] = useState(false);
    const [customPreview, setCustomPreview] = useState('');
    const [components, setComponents] = useState<any[]>([]);

    // Initialize form with provided data
    useEffect(() => {
        setTemplateName(initialData.formulaName || '');

        // Handle product - could be string or array
        if (Array.isArray(initialData.product)) {
            setProducts(initialData.product);
        } else if (initialData.product) {
            setProducts([initialData.product]);
        } else {
            setProducts([]);
        }

        // Handle location - could be string or array
        if (Array.isArray(initialData.location)) {
            setLocations(initialData.location);
        } else if (initialData.location) {
            setLocations([initialData.location]);
        } else {
            setLocations([]);
        }

        setCategory('Formula');
        setDescription(`Saved on ${new Date().toLocaleDateString()}`);
        setUseCustomPreview(false);
        setCustomPreview('');

        // Initialize components with IDs
        setComponents(initialData.components.map((comp, index) => ({
            ...comp,
            id: comp.id || index + 1
        })));
    }, [initialData]);

    // Build auto-generated formula preview using the shared helper - memoized to react to component changes
    const formulaPreview = useMemo(() => {
        if (!components || components.length === 0) {
            return 'No components';
        }
        return buildAutoFormulaPreview(components);
    }, [components]);

    const handleAddComponent = () => {
        const maxId = components.length > 0 ? Math.max(...components.map(c => c.id || 0)) : 0;
        const newComponent = {
            id: maxId + 1,
            percentage: PLACEHOLDER_VALUES.PERCENTAGE,  // [*PCT*]
            source: PLACEHOLDER_VALUES.SOURCE,          // [*SRC*]
            instrument: PLACEHOLDER_VALUES.INSTRUMENT,  // [*INSTR*]
            dateRule: PLACEHOLDER_VALUES.DATE_RULE,     // [*DATE*]
            type: PLACEHOLDER_VALUES.TYPE,              // [*TYPE*]
            display: ''  // Will be auto-generated
        };
        setComponents([...components, newComponent]);
    };

    const handleSave = () => {
        // Basic validation
        if (!templateName.trim()) {
            console.error('Template name is required');
            return;
        }

        if (components.length === 0) {
            console.error('No components to save');
            return;
        }

        // Prepare template data
        const templateData = {
            name: templateName,
            products, // Now arrays
            locations, // Now arrays
            category, // This becomes contractType
            description,
            components,
            customFormulaPreview: useCustomPreview ? customPreview : undefined,
            createdBy: 'Frank Overland'
        };

        onSave(templateData);
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{
                marginBottom: '12px',
                flexShrink: 0
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        <Texto style={{
                            margin: 0,
                            color: '#262626',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            lineHeight: '28px'
                        }}>
                            Save Formula as Template
                        </Texto>
                        <Texto style={{
                            margin: 0,
                            color: '#8c8c8c',
                            fontSize: '14px',
                            lineHeight: '22px'
                        }}>
                            Create a reusable template from this formula
                        </Texto>
                    </div>
                    <div
                        style={{
                            cursor: 'pointer',
                            color: '#595959',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                        onClick={onCancel}
                    >
                        <LeftOutlined style={{ fontSize: '12px' }} />
                        <span>Back to Edit Formula</span>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px',
                paddingBottom: '80px' // Space for fixed footer
            }}>
                <Vertical style={{ gap: '16px' }}>
                    {/* Template Information Section - All on one row */}
                    <div>
                        <Texto style={{
                            margin: '0 0 8px 0',
                            color: '#595959',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            Template Information
                        </Texto>

                        <Horizontal style={{ gap: '12px', flexWrap: 'nowrap' }}>
                            <div style={{ flex: '2', minWidth: '150px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 500 }}>
                                    Template Name *
                                </label>
                                <Input
                                    placeholder="Enter template name"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    style={{ width: '100%' }}
                                    size="small"
                                />
                            </div>
                            <div style={{ flex: '1.5', minWidth: '120px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 500 }}>
                                    Products
                                </label>
                                <Select
                                    mode="multiple"
                                    placeholder="Select products"
                                    value={products}
                                    onChange={setProducts}
                                    style={{ width: '100%' }}
                                    size="small"
                                    options={[
                                        { value: 'Gasoline', label: 'Gasoline' },
                                        { value: 'Diesel', label: 'Diesel' },
                                        { value: 'Crude', label: 'Crude' },
                                        { value: 'Jet Fuel', label: 'Jet Fuel' },
                                        { value: 'CBOB', label: 'CBOB' },
                                        { value: 'RFG', label: 'RFG' },
                                        { value: '87 GHL', label: '87 GHL' },
                                        { value: '93 Premium', label: '93 Premium' }
                                    ]}
                                />
                            </div>
                            <div style={{ flex: '1.5', minWidth: '120px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 500 }}>
                                    Locations
                                </label>
                                <Select
                                    mode="multiple"
                                    placeholder="Select locations"
                                    value={locations}
                                    onChange={setLocations}
                                    style={{ width: '100%' }}
                                    size="small"
                                    options={[
                                        { value: 'USGC', label: 'USGC' },
                                        { value: 'Cushing', label: 'Cushing' },
                                        { value: 'PADD 1', label: 'PADD 1' },
                                        { value: 'PADD 5', label: 'PADD 5' },
                                        ...getTerminalLocations().slice(0, 5).map(loc => ({ value: loc.Name, label: loc.Name }))
                                    ]}
                                />
                            </div>
                            <div style={{ flex: '1', minWidth: '100px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 500 }}>
                                    Category *
                                </label>
                                <Select
                                    placeholder="Select category"
                                    value={category}
                                    onChange={setCategory}
                                    style={{ width: '100%' }}
                                    size="small"
                                    options={[
                                        { value: 'Fixed', label: 'Fixed' },
                                        { value: 'Index', label: 'Index' },
                                        { value: 'Formula', label: 'Formula' }
                                    ]}
                                />
                            </div>
                            <div style={{ flex: '1.5', minWidth: '120px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 500 }}>
                                    Description
                                </label>
                                <Input
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ width: '100%' }}
                                    size="small"
                                />
                            </div>
                            <div style={{ flex: '1', minWidth: '100px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 500 }}>
                                    Created By
                                </label>
                                <Input
                                    value="Frank Overland"
                                    disabled
                                    style={{ width: '100%', backgroundColor: '#f5f5f5' }}
                                    size="small"
                                />
                            </div>
                        </Horizontal>
                    </div>

                    {/* Formula Preview Section - Compact */}
                    <div>
                        <Texto style={{
                            margin: '0 0 6px 0',
                            color: '#595959',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            Formula Preview
                        </Texto>

                        <div style={{
                            padding: '8px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            marginBottom: '8px'
                        }}>
                            <Texto style={{ fontSize: '11px', color: '#595959', fontFamily: 'monospace' }}>
                                {formulaPreview}
                            </Texto>
                        </div>

                        <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                            <Checkbox
                                checked={useCustomPreview}
                                onChange={(e) => setUseCustomPreview(e.target.checked)}
                            >
                                <Texto style={{ fontSize: '11px', color: '#262626' }}>
                                    Custom Formula Name
                                </Texto>
                            </Checkbox>
                            {useCustomPreview && (
                                <Input
                                    placeholder="Enter custom formula name"
                                    value={customPreview}
                                    onChange={(e) => setCustomPreview(e.target.value)}
                                    style={{ flex: 1 }}
                                    size="small"
                                />
                            )}
                        </Horizontal>
                    </div>

                    {/* Editable Components Grid */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <Texto style={{
                                margin: 0,
                                color: '#595959',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}>
                                Formula Components ({components.length})
                            </Texto>
                            <GraviButton
                                buttonText="Add Component"
                                icon={<PlusOutlined />}
                                appearance="success"
                                onClick={handleAddComponent}
                            />
                        </Horizontal>

                        <FormulaComponentsGrid
                            components={components}
                            onComponentsChange={setComponents}
                            domLayout="normal"
                            height="300px"
                        />

                        <Texto style={{ fontSize: '10px', color: '#8c8c8c', marginTop: '6px', fontStyle: 'italic' }}>
                            Tip: Use placeholder values like [*SRC*], [*PCT*], [*DATE*], or [*TYPE*] to create reusable templates
                        </Texto>
                    </div>
                </Vertical>
            </div>

            {/* Fixed Footer */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 20px',
                borderTop: '1px solid #e8e8e8',
                backgroundColor: 'white',
                zIndex: 100,
                flexShrink: 0
            }}>
                <Horizontal style={{ justifyContent: 'flex-end', gap: '12px' }}>
                    <GraviButton
                        buttonText="Cancel"
                        appearance="outlined"
                        onClick={onCancel}
                        style={{ minWidth: '100px' }}
                    />
                    <GraviButton
                        buttonText="Save Template"
                        appearance="success"
                        onClick={handleSave}
                        style={{ minWidth: '120px' }}
                    />
                </Horizontal>
            </div>
        </div>
    );
}
