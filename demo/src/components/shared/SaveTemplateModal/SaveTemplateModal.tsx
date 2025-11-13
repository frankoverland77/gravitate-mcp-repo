import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Checkbox, Button } from 'antd';
import { Texto, GraviButton, Horizontal, Vertical, GraviGrid } from '@gravitate-js/excalibrr';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export interface SaveTemplateModalProps {
    visible: boolean;
    onClose: () => void;
    initialData: {
        formulaName?: string;
        components: any[];
        product?: string | string[];
        location?: string | string[];
    };
    onSave: (templateData: any) => void;
}

export function SaveTemplateModal({
    visible,
    onClose,
    initialData,
    onSave
}: SaveTemplateModalProps) {
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
        if (visible) {
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
        }
    }, [visible, initialData]);

    // Build auto-generated formula preview
    const buildFormulaPreview = () => {
        if (!components || components.length === 0) {
            return 'No components';
        }

        return components
            .map((comp, index) => {
                const operator = index === 0 ? '' : ` ${comp.operator || '+'} `;
                const percentage = comp.percentage || '?';
                const source = comp.source || comp.publisher || '?';
                const instrument = comp.instrument || '?';
                return `${operator}${percentage} ${source} ${instrument}`;
            })
            .join('');
    };

    const handleAddComponent = () => {
        const maxId = components.length > 0 ? Math.max(...components.map(c => c.id || 0)) : 0;
        const newComponent = {
            id: maxId + 1,
            percentage: '100',
            operator: '+',
            source: 'Argus',
            instrument: 'CBOB USGC',
            dateRule: 'Prior Day',
            type: 'Settle'
        };
        setComponents([...components, newComponent]);
    };

    const handleDeleteComponent = (id: number) => {
        setComponents(components.filter(c => c.id !== id));
    };

    const handleComponentChange = (id: number, field: string, value: any) => {
        setComponents(components.map(comp =>
            comp.id === id ? { ...comp, [field]: value } : comp
        ));
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
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    // Column definitions for editable grid
    const componentColumnDefs = [
        {
            headerName: '',
            field: 'drag',
            width: 40,
            rowDrag: true,
            suppressMenu: true
        },
        {
            headerName: 'Percentage',
            field: 'percentage',
            width: 120,
            editable: true,
            cellEditor: 'agTextCellEditor',
            cellEditorParams: {
                maxLength: 20
            }
        },
        {
            headerName: 'Operator',
            field: 'operator',
            width: 100,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['+', '-', '*', '/']
            }
        },
        {
            headerName: 'Source',
            field: 'source',
            width: 150,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Argus', 'OPIS', 'Platts', 'ICE', '[*SRC*]']
            },
            valueGetter: (params: any) => params.data.source || params.data.publisher
        },
        {
            headerName: 'Instrument',
            field: 'instrument',
            flex: 1,
            editable: true,
            cellEditor: 'agTextCellEditor'
        },
        {
            headerName: 'Date Rule',
            field: 'dateRule',
            width: 130,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Prior Day', 'Current', 'Next Day', '[*DATE*]']
            }
        },
        {
            headerName: 'Type',
            field: 'type',
            width: 110,
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Settle', 'Average', 'Spot', 'High', 'Low', '[*TYPE*]']
            }
        },
        {
            headerName: '',
            field: 'actions',
            width: 60,
            suppressMenu: true,
            cellRenderer: (params: any) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleDeleteComponent(params.data.id)}
                />
            )
        }
    ];

    return (
        <Modal
            title="Save Formula as Template"
            open={visible}
            onCancel={handleCancel}
            width={1200}
            footer={null}
            destroyOnClose
        >
            <Vertical style={{ gap: '20px', padding: '20px 0' }}>
                {/* Template Information Section */}
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

                    <Horizontal style={{ gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
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
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                Products
                            </label>
                            <Select
                                mode="multiple"
                                placeholder="Select products"
                                value={products}
                                onChange={setProducts}
                                style={{ width: '100%' }}
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
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                Locations
                            </label>
                            <Select
                                mode="multiple"
                                placeholder="Select locations"
                                value={locations}
                                onChange={setLocations}
                                style={{ width: '100%' }}
                                options={[
                                    { value: 'USGC', label: 'USGC' },
                                    { value: 'Cushing', label: 'Cushing' },
                                    { value: 'PADD 1', label: 'PADD 1' },
                                    { value: 'PADD 5', label: 'PADD 5' },
                                    { value: 'Columbus Terminal', label: 'Columbus Terminal' },
                                    { value: 'Toledo Terminal', label: 'Toledo Terminal' },
                                    { value: 'Cincinnati Rack', label: 'Cincinnati Rack' }
                                ]}
                            />
                        </div>
                    </Horizontal>

                    <Horizontal style={{ gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                Category *
                            </label>
                            <Select
                                placeholder="Select category"
                                value={category}
                                onChange={setCategory}
                                style={{ width: '100%' }}
                                options={[
                                    { value: 'Fixed', label: 'Fixed' },
                                    { value: 'Index', label: 'Index' },
                                    { value: 'Formula', label: 'Formula' }
                                ]}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                                Description
                            </label>
                            <Input.TextArea
                                placeholder="Enter description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={1}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
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

                {/* Formula Preview Section */}
                <div>
                    <Texto style={{
                        margin: '0 0 12px 0',
                        color: '#595959',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                        Formula Preview
                    </Texto>

                    <div style={{
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        marginBottom: '12px'
                    }}>
                        <Texto style={{ fontSize: '12px', color: '#262626', fontWeight: 500, marginBottom: '4px' }}>
                            Auto-Generated
                        </Texto>
                        <Texto style={{ fontSize: '12px', color: '#595959', fontFamily: 'monospace' }}>
                            {buildFormulaPreview()}
                        </Texto>
                    </div>

                    <Checkbox
                        checked={useCustomPreview}
                        onChange={(e) => setUseCustomPreview(e.target.checked)}
                        style={{ marginBottom: '8px' }}
                    >
                        <Texto style={{ fontSize: '12px', color: '#262626' }}>
                            Custom Formula Name
                        </Texto>
                    </Checkbox>

                    {useCustomPreview && (
                        <Input.TextArea
                            placeholder="Enter custom formula name"
                            value={customPreview}
                            onChange={(e) => setCustomPreview(e.target.value)}
                            rows={2}
                            style={{ width: '100%' }}
                        />
                    )}
                </div>

                {/* Editable Components Grid */}
                <div>
                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <Texto style={{
                            margin: 0,
                            color: '#595959',
                            fontSize: '12px',
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

                    <div style={{ height: '300px', width: '100%' }}>
                        <GraviGrid
                            rowData={components}
                            columnDefs={componentColumnDefs}
                            agPropOverrides={{
                                rowDragManaged: true,
                                animateRows: true,
                                onCellValueChanged: (event: any) => {
                                    handleComponentChange(event.data.id, event.colDef.field, event.value);
                                }
                            }}
                            hideControlBar={true}
                        />
                    </div>

                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '8px', fontStyle: 'italic' }}>
                        Tip: Use placeholder values like [*SRC*], [*PCT*], [*DATE*], or [*TYPE*] to create reusable templates
                    </Texto>
                </div>

                {/* Footer Buttons */}
                <Horizontal style={{ justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                    <GraviButton
                        buttonText="Cancel"
                        appearance="outlined"
                        onClick={handleCancel}
                        style={{ minWidth: '100px' }}
                    />
                    <GraviButton
                        buttonText="Save Template"
                        appearance="success"
                        onClick={handleSave}
                        style={{ minWidth: '120px' }}
                    />
                </Horizontal>
            </Vertical>
        </Modal>
    );
}
