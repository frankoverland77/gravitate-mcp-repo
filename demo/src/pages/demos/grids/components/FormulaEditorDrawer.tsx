import React, { useRef, useState } from 'react';
import { Texto, GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import {
    PlusOutlined,
    CloseOutlined,
    LeftOutlined,
    RightOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Drawer, Tag, Input, Segmented, Checkbox, Button, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { isPlaceholder } from '../FormulaTemplates.data';
import { TemplateChooser } from '../../../../components/shared/TemplateChooser';
import { SaveTemplateForm } from '../../../../components/shared/SaveTemplateModal';

interface Formula {
    name: string;
    rows: any[];
}

interface FormulaEditorDrawerProps {
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
    editingRow: any;
    formulas: Formula[];
    setFormulas: (formulas: Formula[]) => void;
    handleSaveFormula: () => void;
    showTemplateManager: boolean;
    setShowTemplateManager: (show: boolean) => void;
    activeFormulaIndex: number;
    setActiveFormulaIndex: (index: number) => void;
    handleAddFormulaRow: (formulaIndex: number) => void;
    handleFormulaRowDragEnd: (formulaIndex: number) => (event: any) => void;
    getFormulaColumnDefs: (formulaIndex: number) => any[];
    formulaGridAgProps: any;
    templates: any[]; // All templates from context
    buildFormulaPreview: (template: any) => string;
    handleTemplateSelect: (template: any) => void;
    onSaveTemplate: (templateData: any) => void; // Handler for saving new templates
}

export function FormulaEditorDrawer({
    drawerOpen,
    setDrawerOpen,
    editingRow,
    formulas,
    setFormulas,
    handleSaveFormula,
    showTemplateManager,
    setShowTemplateManager,
    activeFormulaIndex,
    setActiveFormulaIndex,
    handleAddFormulaRow,
    handleFormulaRowDragEnd,
    getFormulaColumnDefs,
    formulaGridAgProps,
    templates,
    buildFormulaPreview,
    handleTemplateSelect,
    onSaveTemplate
}: FormulaEditorDrawerProps) {
    const navigateInternal = useNavigate();
    const [showSaveTemplateForm, setShowSaveTemplateForm] = useState(false);

    return (
        <>
            <Drawer
            placement="bottom"
            height="70%"
            visible={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            closable={false}
            title={null}
            headerStyle={{ display: 'none' }}
            bodyStyle={{
                backgroundColor: '#f5f5f5',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            {/* Custom Header with Green Background */}
            <div style={{
                backgroundColor: '#0C5A58',
                padding: '20px 24px',
                flexShrink: 0
            }}>
                <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Vertical style={{ gap: '4px' }}>
                        <Horizontal style={{ alignItems: 'center', gap: '12px' }}>
                            <Texto style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                                Edit Price Formula
                            </Texto>
                            {editingRow?.type && (
                                <Tag color="cyan" style={{ margin: 0 }}>
                                    {editingRow.type}
                                </Tag>
                            )}
                        </Horizontal>
                        <Texto style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
                            Configure the pricing formula structure and components for this provision
                        </Texto>
                    </Vertical>
                    <Button
                        type="text"
                        onClick={() => setDrawerOpen(false)}
                        style={{ color: '#ffffff', fontSize: '20px', padding: 0, height: 'auto' }}
                    >
                        ×
                    </Button>
                </Horizontal>
            </div>
            {/* Compact Effective Dates Display */}
            {editingRow?.effectiveFrom && editingRow?.effectiveTo && (
                <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '6px 24px',
                    borderBottom: '1px solid #e8e8e8'
                }}>
                    <Texto style={{ margin: 0, color: '#8c8c8c', fontSize: '11px', lineHeight: '18px' }}>
                        Effective: <span style={{ fontWeight: 'bold', color: '#595959' }}>{editingRow.effectiveFrom} - {editingRow.effectiveTo}</span>
                    </Texto>
                </div>
            )}

            {/* Formula Editor Content */}
            <div style={{
                backgroundColor: 'white',
                padding: 0,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                overflowY: 'auto',
                position: 'relative'
            }}>
                {showSaveTemplateForm ? (
                    /* Save Template Form View */
                    <SaveTemplateForm
                        key={Date.now()}
                        initialData={{
                            formulaName: formulas[activeFormulaIndex]?.name || '',
                            components: formulas[activeFormulaIndex]?.rows || [],
                            product: editingRow?.product || '',
                            location: editingRow?.location || ''
                        }}
                        onSave={(templateData) => {
                            onSaveTemplate(templateData);
                            setShowSaveTemplateForm(false);
                        }}
                        onCancel={() => setShowSaveTemplateForm(false)}
                    />
                ) : !showTemplateManager ? (
                    <>
                        {/* Main editing UI with padding */}
                        <div style={{
                            padding: '20px 16px 80px 16px'
                        }}>
                            {/* Render each formula section */}
                            {formulas.map((formula, formulaIndex) => (
                            <div key={formulaIndex} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                paddingBottom: formulaIndex < formulas.length - 1 ? '20px' : 0,
                                borderBottom: formulaIndex < formulas.length - 1 ? '2px solid #e8e8e8' : 'none'
                            }}>
                                {/* Formula Header */}
                                {formulas.length > 1 && (
                                    <Texto style={{
                                        margin: 0,
                                        color: '#595959',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        backgroundColor: '#f0f0f0',
                                        padding: '8px 12px',
                                        borderRadius: '4px'
                                    }}>
                                        FORMULA {formulaIndex + 1}
                                    </Texto>
                                )}

                                {/* Name Input */}
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'center'
                                }}>
                                    <Texto style={{ margin: 0, color: '#595959', fontSize: '14px', fontWeight: 'bold', minWidth: '50px' }}>
                                        Name:
                                    </Texto>
                                    <Input
                                        placeholder="Enter Name"
                                        value={formula.name}
                                        onChange={(e) => {
                                            const updated = [...formulas];
                                            updated[formulaIndex].name = e.target.value;
                                            setFormulas(updated);
                                        }}
                                        maxLength={255}
                                        showCount
                                        style={{
                                            flex: 1,
                                            fontSize: '12px'
                                        }}
                                    />
                                </div>

                                {/* Control Bar */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Texto style={{ margin: 0, color: '#595959', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        Components
                                    </Texto>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <GraviButton
                                            buttonText="Add Row"
                                            icon={<PlusOutlined />}
                                            appearance="success"
                                            onClick={() => handleAddFormulaRow(formulaIndex)}
                                        />
                                        <GraviButton
                                            buttonText="Add Template"
                                            icon={<PlusOutlined />}
                                            appearance="outlined"
                                            onClick={() => {
                                                setActiveFormulaIndex(formulaIndex);
                                                setShowTemplateManager(true);
                                            }}
                                        />
                                        <GraviButton
                                            buttonText="Save as Template"
                                            icon={<SettingOutlined />}
                                            appearance="outlined"
                                            onClick={() => {
                                                setActiveFormulaIndex(formulaIndex);
                                                setShowSaveTemplateForm(true);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Formula Grid */}
                                <GraviGrid
                                    rowData={formula.rows}
                                    columnDefs={getFormulaColumnDefs(formulaIndex)}
                                    agPropOverrides={{
                                        ...formulaGridAgProps,
                                        onRowDragEnd: handleFormulaRowDragEnd(formulaIndex)
                                    }}
                                    hideControlBar={true}
                                />
                            </div>
                        ))}
                        </div>

                        {/* Sticky Footer for Main Editor */}
                        <div style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '16px 24px',
                            borderTop: '1px solid #d9d9d9',
                            backgroundColor: '#ffffff',
                            zIndex: 10
                        }}>
                            <Horizontal style={{ justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                                <Button
                                    size="large"
                                    onClick={() => setDrawerOpen(false)}
                                    style={{ minWidth: '100px' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleSaveFormula}
                                    style={{ minWidth: '100px' }}
                                >
                                    Save
                                </Button>
                            </Horizontal>
                        </div>
                    </>
                ) : (
                    /* Template Manager View - Using TemplateChooser component */
                    <TemplateChooser
                        templates={templates}
                        onTemplateSelect={(template) => {
                            handleTemplateSelect(template);
                            setShowTemplateManager(false);
                        }}
                        buildFormulaPreview={buildFormulaPreview}
                        showManageButton={true}
                        title="Formula Template Chooser"
                        subtitle="Select a pre-built formula template to quickly apply common pricing calculations to your provision."
                        onManageTemplates={() => {
                            navigateInternal('/ContractFormulas/FormulaTemplates');
                        }}
                        onClose={() => setShowTemplateManager(false)}
                        showExternalName={false}
                    />
                )}
            </div>
            </Drawer>
        </>
    );
}
