import React, { useRef, useState, useEffect } from 'react';
import { Texto, GraviButton } from '@gravitate-js/excalibrr';
import {
    PlusOutlined,
    LeftOutlined,
    RightOutlined,
    SearchOutlined,
    ExportOutlined
} from '@ant-design/icons';
import { Tag, Segmented, Checkbox, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { isPlaceholder } from '../../../pages/demos/grids/FormulaTemplates.data';

export interface TemplateChooserProps {
    templates: any[];
    onTemplateSelect: (template: any) => void;
    buildFormulaPreview: (template: any) => string;
    showManageButton?: boolean;
    manageButtonPath?: string;
    title?: string;
    subtitle?: string;
    defaultFilters?: {[key: string]: {value: string; enabled: boolean}};
    onManageTemplates?: () => void;
    onClose?: () => void;
    showExternalName?: boolean; // Controls visibility of External Display Name section
}


export function TemplateChooser({
    templates,
    onTemplateSelect,
    buildFormulaPreview,
    showManageButton = false,
    manageButtonPath = '/ContractFormulas/FormulaTemplates',
    title = 'Formula Template Chooser',
    subtitle = 'Select a pre-built formula template to quickly apply common pricing calculations.',
    defaultFilters = {},
    onManageTemplates,
    onClose,
    showExternalName = true // Default to true for backwards compatibility
}: TemplateChooserProps) {
    const navigateInternal = useNavigate();

    // View mode state
    const [templateViewMode, setTemplateViewMode] = useState<'cards' | 'list'>('cards');

    // Search state
    const [searchText, setSearchText] = useState('');

    // Filters state
    const [activeFilters, setActiveFilters] = useState<{[key: string]: {value: string; enabled: boolean}}>(defaultFilters);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const filterDropdownRef = useRef<HTMLDivElement>(null);

    // Component selection state
    const [selectedComponents, setSelectedComponents] = useState<{[templateId: string]: {[compId: number]: boolean}}>({});

    // Scroll ref
    const cardsScrollRef = useRef<HTMLDivElement>(null);

    // Initialize all components as selected by default
    useEffect(() => {
        console.log('=== TemplateChooser: Initializing component selection ===');
        console.log('Templates received:', templates.length);

        const initialSelection: {[templateId: string]: {[compId: number]: boolean}} = {};
        templates.forEach(template => {
            console.log(`Template "${template.name}" has ${template.components?.length || 0} components`);
            initialSelection[template.id] = {};
            if (template.components && Array.isArray(template.components)) {
                template.components.forEach((comp: any) => {
                    initialSelection[template.id][comp.id] = true;
                });
            }
        });

        console.log('Initial selection state:', initialSelection);
        setSelectedComponents(initialSelection);
    }, [templates]);

    // Available filter fields - dynamically extracted from templates
    const availableFilterFields = React.useMemo(() => {
        const fields: Array<{key: string; label: string; value: string}> = [];
        const seenFilters = new Set<string>();

        templates.forEach(template => {
            if (template.contractType && !seenFilters.has(`contractType-${template.contractType}`)) {
                fields.push({
                    key: `contractType-${template.contractType}`,
                    label: 'Contract Type',
                    value: template.contractType
                });
                seenFilters.add(`contractType-${template.contractType}`);
            }
            // Add filters for each location in usedInLocations array
            if (template.usedInLocations && Array.isArray(template.usedInLocations)) {
                template.usedInLocations.forEach((location: string) => {
                    if (!seenFilters.has(`location-${location}`)) {
                        fields.push({
                            key: `location-${location}`,
                            label: 'Location',
                            value: location
                        });
                        seenFilters.add(`location-${location}`);
                    }
                });
            }
        });

        return fields;
    }, [templates]);

    // Filtered templates based on search text and active filters
    const templateFamilies = React.useMemo(() => {
        let filtered = templates;

        // Apply search filter first
        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase();
            filtered = filtered.filter(template => {
                // Search across name, contract type, locations, and products
                const nameMatch = template.name?.toLowerCase().includes(searchLower);
                const contractTypeMatch = template.contractType?.toLowerCase().includes(searchLower);
                const locationMatch = template.usedInLocations?.some((loc: string) =>
                    loc.toLowerCase().includes(searchLower)
                );
                const productMatch = template.usedInProducts?.some((prod: string) =>
                    prod.toLowerCase().includes(searchLower)
                );

                return nameMatch || contractTypeMatch || locationMatch || productMatch;
            });
        }

        // Apply auto filters
        const enabledFilters = Object.entries(activeFilters)
            .filter(([_, filter]) => filter.enabled)
            .map(([key, filter]) => ({ key, value: filter.value }));

        if (enabledFilters.length > 0) {
            filtered = filtered.filter(template => {
                return enabledFilters.every(filter => {
                    if (filter.key.startsWith('contractType-')) {
                        return template.contractType === filter.value;
                    }
                    if (filter.key.startsWith('location-')) {
                        return template.usedInLocations && template.usedInLocations.includes(filter.value);
                    }
                    return true;
                });
            });
        }

        return filtered;
    }, [templates, searchText, activeFilters]);

    // Filter handlers
    const toggleFilter = (filterKey: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: {
                ...prev[filterKey],
                enabled: !prev[filterKey].enabled
            }
        }));
    };

    const removeFilter = (filterKey: string) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[filterKey];
            return newFilters;
        });
    };

    const addFilter = (filterKey: string, filterValue: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: { value: filterValue, enabled: true }
        }));
        setShowFilterDropdown(false);
    };

    const getUnusedFilters = () => {
        return availableFilterFields.filter(f => !activeFilters[f.key]);
    };

    // Component selection handlers
    const toggleComponent = (templateId: string, compId: number) => {
        setSelectedComponents(prev => {
            const templateSelections = prev[templateId] || {};
            const newTemplateSelections = {
                ...templateSelections,
                [compId]: !templateSelections[compId]
            };
            return {
                ...prev,
                [templateId]: newTemplateSelections
            };
        });
    };

    const isComponentSelected = (templateId: string, compId: number) => {
        return selectedComponents[templateId]?.[compId] ?? true;
    };

    const getSelectedCount = (templateId: string) => {
        if (!selectedComponents[templateId]) return 0;
        return Object.values(selectedComponents[templateId]).filter(Boolean).length;
    };

    // Check if template contains any placeholders
    const templateHasPlaceholders = (template: any) => {
        return template.components?.some((comp: any) =>
            isPlaceholder(comp.percentage) ||
            isPlaceholder(comp.source) ||
            isPlaceholder(comp.instrument) ||
            isPlaceholder(comp.dateRule) ||
            isPlaceholder(comp.type)
        ) || false;
    };

    // Build formula preview from selected components with placeholder styling
    const buildFormulaPreviewFiltered = (template: any) => {
        const selected = template.components.filter((c: any) => isComponentSelected(template.id, c.id));
        if (selected.length === 0) return 'No components selected';
        return selected.map((c: any, i: number) =>
            `${i > 0 ? ' ' + c.operator + ' ' : ''}${c.percentage} ${c.source} ${c.instrument}`
        ).join('');
    };

    // Render formula preview with placeholder highlighting
    const renderFormulaPreview = (preview: string) => {
        // Split by spaces and style placeholders
        const parts = preview.split(' ');
        return parts.map((part, index) => {
            if (isPlaceholder(part)) {
                return (
                    <span key={index} style={{ color: '#722ed1', fontWeight: 700, fontFamily: 'monospace' }}>
                        {part}{index < parts.length - 1 ? ' ' : ''}
                    </span>
                );
            }
            return <span key={index}>{part}{index < parts.length - 1 ? ' ' : ''}</span>;
        });
    };

    // Scroll handler
    const scrollCards = (direction: 'left' | 'right') => {
        if (cardsScrollRef.current) {
            const scrollAmount = 300;
            cardsScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Handle template selection
    const handleTemplateSelect = (template: any) => {
        // Filter components to only include selected ones
        const selectedComps = template.components.filter((c: any) => isComponentSelected(template.id, c.id));
        const templateWithSelectedComponents = {
            ...template,
            components: selectedComps
        };
        onTemplateSelect(templateWithSelectedComponents);
    };

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setShowFilterDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: '100%',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
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
                        {title}
                    </Texto>
                    <Texto style={{
                        margin: 0,
                        color: '#8c8c8c',
                        fontSize: '14px',
                        lineHeight: '22px'
                    }}>
                        {subtitle}
                    </Texto>
                </div>
                {showManageButton && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <GraviButton
                            buttonText="Manage Formula Templates"
                            icon={<ExportOutlined />}
                            appearance="outlined"
                            onClick={() => {
                                if (onManageTemplates) {
                                    onManageTemplates();
                                } else {
                                    window.open(manageButtonPath, '_blank');
                                }
                            }}
                            style={{
                                fontWeight: 'bold',
                                borderColor: '#1890ff',
                                color: '#1890ff'
                            }}
                        />
                        {onClose && (
                            <div
                                style={{
                                    cursor: 'pointer',
                                    color: '#595959',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                                onClick={onClose}
                            >
                                <LeftOutlined style={{ fontSize: '12px' }} />
                                <span>Exit Templates</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Segmented Tabs and Auto-filtered Tags Section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '16px',
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

                {/* Search Input - Middle */}
                <Input
                    placeholder="Search templates..."
                    prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        width: '300px',
                        borderRadius: '6px'
                    }}
                />

                {/* Auto-filtered Tags - Right Side */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    position: 'relative'
                }}>
                    <Texto style={{
                        margin: 0,
                        color: '#595959',
                        fontSize: '11px',
                        fontWeight: 'normal',
                        whiteSpace: 'nowrap'
                    }}>
                        Auto Filters:
                    </Texto>
                    <div style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        {Object.entries(activeFilters).map(([key, filter]) => {
                            const filterDef = availableFilterFields.find(f => f.key === key);
                            const isEnabled = filter.enabled;

                            return (
                                <Tag
                                    key={key}
                                    onClick={() => toggleFilter(key)}
                                    closable
                                    onClose={(e) => {
                                        e.preventDefault();
                                        removeFilter(key);
                                    }}
                                    style={{
                                        backgroundColor: isEnabled ? '#e8e8e8' : '#f5f5f5',
                                        color: isEnabled ? '#3d3d3d' : '#8c8c8c',
                                        border: `1px solid ${isEnabled ? '#bfbfbf' : '#d9d9d9'}`,
                                        borderRadius: '10px',
                                        padding: '1px 6px',
                                        fontSize: '10px',
                                        cursor: 'pointer',
                                        opacity: isEnabled ? 1 : 0.5,
                                        transition: 'all 0.2s',
                                        margin: 0
                                    }}
                                >
                                    <strong>{filterDef?.label}:</strong> {filter.value}
                                </Tag>
                            );
                        })}

                        {/* Add Filter Button */}
                        <div
                            ref={filterDropdownRef}
                            style={{ position: 'relative', display: 'inline-block' }}
                        >
                            <div
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: '#e8e8e8',
                                    border: '1px solid #bfbfbf',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#d9d9d9';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e8e8e8';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <PlusOutlined style={{ fontSize: '10px', color: '#3d3d3d', fontWeight: 'bold' }} />
                            </div>

                            {/* Filter Dropdown */}
                            {showFilterDropdown && getUnusedFilters().length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '4px',
                                    backgroundColor: 'white',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    zIndex: 1000,
                                    minWidth: '220px',
                                    maxHeight: '250px',
                                    overflowY: 'auto'
                                }}>
                                    {getUnusedFilters().map((filter, index) => (
                                        <div
                                            key={filter.key}
                                            onClick={() => addFilter(filter.key, filter.value)}
                                            style={{
                                                padding: '10px 12px',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                color: '#262626',
                                                borderBottom: index < getUnusedFilters().length - 1 ? '1px solid #f0f0f0' : 'none',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                        >
                                            <strong style={{ color: '#3d3d3d' }}>{filter.label}:</strong> <span style={{ color: '#595959' }}>{filter.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {templateViewMode === 'cards' ? (
                /* Cards View - Horizontal Scrolling with Arrows */
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-start', overflow: 'hidden', minHeight: 0 }}>
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
                            overflowY: 'visible',
                            padding: '20px 50px',
                            backgroundColor: 'transparent',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            position: 'relative',
                            zIndex: 1
                        }}
                        className="hide-scrollbar"
                    >
                        <style>{`
                            .hide-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {templateFamilies.length === 0 ? (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '40px',
                                textAlign: 'center'
                            }}>
                                <Texto style={{ fontSize: '48px', marginBottom: '16px' }}>📋</Texto>
                                <Texto style={{ fontSize: '18px', fontWeight: 'bold', color: '#262626', marginBottom: '8px' }}>
                                    No templates found
                                </Texto>
                                <Texto style={{ fontSize: '14px', color: '#8c8c8c', marginBottom: '16px' }}>
                                    No templates match the filters you selected. Try removing some filters or adjusting your selection.
                                </Texto>
                            </div>
                        ) : templateFamilies.map((template) => {
                            const hasPlaceholders = templateHasPlaceholders(template);
                            return (
                            <div
                                key={template.id}
                                style={{
                                    width: '320px',
                                    height: '480px',
                                    minWidth: '320px',
                                    backgroundColor: 'white',
                                    border: '1px solid #d9d9d9',
                                    borderLeft: hasPlaceholders ? '3px solid #722ed1' : '1px solid #d9d9d9',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    zIndex: 1
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
                                    {/* Display Name with Placeholder Badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <Texto style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', lineHeight: '18px', flex: 1 }}>
                                            {template.name}
                                        </Texto>
                                        {hasPlaceholders && (
                                            <Tag style={{
                                                margin: 0,
                                                backgroundColor: '#f3e8ff',
                                                color: '#722ed1',
                                                border: '1px solid #d3adf7',
                                                borderRadius: '4px',
                                                fontSize: '9px',
                                                fontWeight: 600,
                                                padding: '2px 6px',
                                                lineHeight: '12px'
                                            }}>
                                                PLACEHOLDERS
                                            </Tag>
                                        )}
                                    </div>

                                    {/* Type */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <Texto style={{ margin: 0, fontSize: '10px', fontWeight: '600', color: '#8c8c8c', lineHeight: '14px' }}>
                                            Type:
                                        </Texto>
                                        <Texto style={{ margin: 0, fontSize: '11px', color: '#333', lineHeight: '16px' }}>
                                            {template.contractType}
                                        </Texto>
                                    </div>

                                    {/* Location */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <Texto style={{ margin: 0, fontSize: '10px', fontWeight: '600', color: '#8c8c8c', lineHeight: '14px' }}>
                                            Location:
                                        </Texto>
                                        <Texto style={{ margin: 0, fontSize: '11px', color: '#333', lineHeight: '16px' }}>
                                            {template.usedInLocations?.join(', ') || 'N/A'}
                                        </Texto>
                                    </div>

                                    {/* Products */}
                                    <div>
                                        <Texto style={{ margin: 0, fontSize: '10px', fontWeight: '600', color: '#8c8c8c', lineHeight: '14px' }}>
                                            Products:
                                        </Texto>
                                        <Texto style={{ margin: 0, fontSize: '11px', color: '#333', lineHeight: '16px' }}>
                                            {template.usedInProducts?.join(', ') || 'N/A'}
                                        </Texto>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                                    {/* Components Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexShrink: 0 }}>
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
                                        padding: '6px',
                                        minHeight: 0
                                    }}>
                                        {(template.components || []).map((comp: any) => {
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
                                                        <Texto style={{
                                                            margin: 0,
                                                            fontSize: '11px',
                                                            fontWeight: '700',
                                                            color: isPlaceholder(comp.percentage) ? '#722ed1' : '#1890ff',
                                                            fontFamily: isPlaceholder(comp.percentage) ? 'monospace' : 'inherit'
                                                        }}>
                                                            {comp.percentage}
                                                        </Texto>
                                                        <Texto style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: comp.operator === '+' ? '#28a745' : '#dc3545' }}>
                                                            {comp.operator}
                                                        </Texto>
                                                        <Texto style={{
                                                            margin: 0,
                                                            fontSize: '11px',
                                                            fontWeight: '700',
                                                            color: isPlaceholder(comp.source) ? '#722ed1' : '#333',
                                                            fontFamily: isPlaceholder(comp.source) ? 'monospace' : 'inherit'
                                                        }}>
                                                            {comp.source}
                                                        </Texto>
                                                        <Texto style={{
                                                            margin: 0,
                                                            fontSize: '11px',
                                                            color: isPlaceholder(comp.instrument) ? '#722ed1' : '#666',
                                                            fontFamily: isPlaceholder(comp.instrument) ? 'monospace' : 'inherit',
                                                            fontWeight: '700'
                                                        }}>
                                                            {comp.instrument}
                                                        </Texto>
                                                    </div>
                                                    <Texto style={{ margin: 0, fontSize: '10px', color: '#8c8c8c' }}>
                                                        <span style={{
                                                            color: isPlaceholder(comp.dateRule) ? '#722ed1' : '#8c8c8c',
                                                            fontFamily: isPlaceholder(comp.dateRule) ? 'monospace' : 'inherit',
                                                            fontWeight: isPlaceholder(comp.dateRule) ? '700' : 'normal'
                                                        }}>
                                                            {comp.dateRule}
                                                        </span>
                                                        {' • '}
                                                        <span style={{
                                                            color: isPlaceholder(comp.type) ? '#722ed1' : '#8c8c8c',
                                                            fontFamily: isPlaceholder(comp.type) ? 'monospace' : 'inherit',
                                                            fontWeight: isPlaceholder(comp.type) ? '700' : 'normal'
                                                        }}>
                                                            {comp.type}
                                                        </span>
                                                    </Texto>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>

                                    {/* Formula Preview - Internal Display Name */}
                                    <div style={{ marginBottom: showExternalName ? '6px' : '0', flexShrink: 0 }}>
                                        <Texto style={{ margin: 0, fontSize: '9px', fontWeight: '600', color: '#666', marginBottom: '3px' }}>
                                            Internal Display Name:
                                        </Texto>
                                        <div style={{
                                            padding: '4px 6px',
                                            backgroundColor: '#f5f5f5',
                                            border: '1px solid #d9d9d9',
                                            borderRadius: '4px',
                                            minHeight: '24px',
                                            maxHeight: '40px',
                                            overflowY: 'auto'
                                        }}>
                                            <Texto style={{ margin: 0, fontSize: '9px', color: '#595959', lineHeight: '12px', fontFamily: 'monospace' }}>
                                                {renderFormulaPreview(buildFormulaPreviewFiltered(template))}
                                            </Texto>
                                        </div>
                                    </div>

                                    {/* Formula Preview - External Display Name */}
                                    {showExternalName && (
                                        <div style={{ marginBottom: '0', flexShrink: 0 }}>
                                            <Texto style={{ margin: 0, fontSize: '9px', fontWeight: '600', color: '#666', marginBottom: '3px' }}>
                                                External Display Name:
                                            </Texto>
                                            <div style={{
                                                padding: '4px 6px',
                                                backgroundColor: '#f5f5f5',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '4px',
                                                minHeight: '24px',
                                                maxHeight: '40px',
                                                overflowY: 'auto'
                                            }}>
                                                <Texto style={{ margin: 0, fontSize: '9px', color: '#595959', lineHeight: '12px', fontFamily: 'monospace' }}>
                                                    {renderFormulaPreview(buildFormulaPreviewFiltered(template))}
                                                </Texto>
                                            </div>
                                        </div>
                                    )}
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
                            );
                        })}
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
                    {templateFamilies.map((template) => {
                        const hasPlaceholders = templateHasPlaceholders(template);
                        return (
                        <div
                            key={template.id}
                            style={{
                                width: '100%',
                                backgroundColor: 'white',
                                border: '1px solid #d9d9d9',
                                borderLeft: hasPlaceholders ? '3px solid #722ed1' : '1px solid #d9d9d9',
                                borderRadius: '8px',
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
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        <Texto style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1a1a1a', lineHeight: '22px' }}>
                                            {template.name}
                                        </Texto>
                                        {hasPlaceholders && (
                                            <Tag style={{
                                                margin: 0,
                                                backgroundColor: '#f3e8ff',
                                                color: '#722ed1',
                                                border: '1px solid #d3adf7',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                padding: '2px 8px'
                                            }}>
                                                PLACEHOLDERS
                                            </Tag>
                                        )}
                                    </div>
                                    <Texto style={{ margin: 0, fontSize: '12px', color: '#666', lineHeight: '16px' }}>
                                        {template.contractType} • {template.usedInLocations?.join(', ') || 'N/A'}
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
                            <div style={{ padding: '16px' }}>
                                {/* Components Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    {template.components.map((comp: any) => {
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
                                                    <Texto style={{
                                                        margin: 0,
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        color: isPlaceholder(comp.percentage) ? '#722ed1' : '#1890ff',
                                                        fontFamily: isPlaceholder(comp.percentage) ? 'monospace' : 'inherit'
                                                    }}>
                                                        {comp.percentage}
                                                    </Texto>
                                                    <Texto style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: comp.operator === '+' ? '#28a745' : '#dc3545' }}>
                                                        {comp.operator}
                                                    </Texto>
                                                    <Texto style={{
                                                        margin: 0,
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        color: isPlaceholder(comp.source) ? '#722ed1' : '#333',
                                                        fontFamily: isPlaceholder(comp.source) ? 'monospace' : 'inherit'
                                                    }}>
                                                        {comp.source}
                                                    </Texto>
                                                    <Texto style={{
                                                        margin: 0,
                                                        fontSize: '12px',
                                                        color: isPlaceholder(comp.instrument) ? '#722ed1' : '#666',
                                                        fontFamily: isPlaceholder(comp.instrument) ? 'monospace' : 'inherit',
                                                        fontWeight: isPlaceholder(comp.instrument) ? 600 : 'normal'
                                                    }}>
                                                        {comp.instrument}
                                                    </Texto>
                                                </div>
                                                <Texto style={{ margin: 0, fontSize: '11px', color: '#8c8c8c' }}>
                                                    <span style={{
                                                        color: isPlaceholder(comp.dateRule) ? '#722ed1' : '#8c8c8c',
                                                        fontFamily: isPlaceholder(comp.dateRule) ? 'monospace' : 'inherit',
                                                        fontWeight: isPlaceholder(comp.dateRule) ? 600 : 'normal'
                                                    }}>
                                                        {comp.dateRule}
                                                    </span>
                                                    {' • '}
                                                    <span style={{
                                                        color: isPlaceholder(comp.type) ? '#722ed1' : '#8c8c8c',
                                                        fontFamily: isPlaceholder(comp.type) ? 'monospace' : 'inherit',
                                                        fontWeight: isPlaceholder(comp.type) ? 600 : 'normal'
                                                    }}>
                                                        {comp.type}
                                                    </span>
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
                                        {renderFormulaPreview(buildFormulaPreviewFiltered(template))}
                                    </Texto>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
