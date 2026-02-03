// Formula Template Data
// This file contains static template data for the Formula Template Manager

// Placeholder constants for template components
export const PLACEHOLDER_VALUES = {
    PERCENTAGE: '[*PCT*]',
    SOURCE: '[*SRC*]',
    INSTRUMENT: '[*INSTR*]',
    DATE_RULE: '[*DATE*]',
    TYPE: '[*TYPE*]'
} as const;

// Helper to check if a value is a placeholder
export const isPlaceholder = (value: any): boolean => {
    if (typeof value !== 'string') return false;
    return value?.startsWith('[*') && value?.includes('*]');
};

// Helper to extract placeholder abbreviation from full value
export const getPlaceholderAbbrev = (value: any): string => {
    if (typeof value !== 'string') return '';
    const match = value?.match(/\[\*([A-Z]+)\*\]/);
    return match ? match[1] : '';
};

// Helper to get user-friendly placeholder display text
export const getPlaceholderDisplayText = (value: any): string => {
    if (typeof value !== 'string') return String(value || '');
    if (!isPlaceholder(value)) return value;

    switch (value) {
        case PLACEHOLDER_VALUES.PERCENTAGE:
            return 'Enter percentage';
        case PLACEHOLDER_VALUES.SOURCE:
            return 'Choose a publisher';
        case PLACEHOLDER_VALUES.INSTRUMENT:
            return 'Choose instrument';
        case PLACEHOLDER_VALUES.DATE_RULE:
            return 'Choose date rule';
        case PLACEHOLDER_VALUES.TYPE:
            return 'Choose type';
        default:
            return value;
    }
};

export interface TemplateComponent {
    id: number;
    percentage: string;
    operator?: '+' | '-' | '*' | '/';  // Optional for backward compatibility, no longer used in UI
    source: string;  // Now represents Publisher (Argus, OPIS, Platts, etc.)
    instrument: string;
    dateRule: string;
    type: string;
    display?: string;  // Auto-generated display name for the component
}

export interface FormulaTemplate {
    id: string;
    name: string;
    contractType: string;
    usedInProducts: string[];  // Array of products where this template has been used
    usedInLocations: string[];  // Array of locations where this template has been used
    category: 'Popular' | 'Partner' | 'Advanced' | 'Specialty' | 'Regional' | 'Seasonal';
    totalUsage: number;
    description: string;
    lastModified: string;
    lastUsedDate: string;  // When template was last applied to a contract
    createdBy: string;
    components: TemplateComponent[];
    customFormulaPreview?: string;  // Optional custom preview that overrides auto-generated one
}

export const formulaTemplates: FormulaTemplate[] = [
    {
        id: 'columbus-standard',
        name: 'Standard Houston Index',
        contractType: 'Day Deal',
        usedInProducts: ['87 GHL', '93 Premium', 'CBOB', 'RFG'],
        usedInLocations: ['Houston Terminal', 'Nashville Terminal', 'Dallas'],
        category: 'Popular',
        totalUsage: 487,
        description: 'Most commonly used pricing formula for Houston Terminal day deals. Combines Argus, OPIS, and Platts with standard differentials.',
        lastModified: '2025-09-15',
        lastUsedDate: '2025-09-14',
        createdBy: 'John Smith',
        components: [
            { id: 1, percentage: '90%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
            { id: 2, percentage: '10%', operator: '+', source: 'OPIS', instrument: 'CBOB', dateRule: 'Current', type: 'Average' },
            { id: 3, percentage: '5%', operator: '+', source: 'Platts', instrument: 'CBOB', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'shell-negotiated',
        name: 'Shell Negotiated Rates',
        contractType: 'Day Deal',
        usedInProducts: ['87 GHL', 'CBOB'],
        usedInLocations: ['Houston Terminal', 'Nashville Terminal'],
        category: 'Partner',
        totalUsage: 342,
        description: 'Pre-negotiated pricing structure for Shell contracts with volume-based discounts.',
        lastModified: '2025-09-20',
        lastUsedDate: '2025-09-19',
        createdBy: 'Sarah Johnson',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'complex-multi-variable',
        name: 'Complex Multi-Variable',
        contractType: 'Index Deal',
        usedInProducts: ['87 GHL', 'CBOB', '93 Premium'],
        usedInLocations: ['Houston Terminal', 'Detroit Terminal'],
        category: 'Advanced',
        totalUsage: 156,
        description: 'Advanced formula with multiple data sources and RIN credit adjustments for index deals.',
        lastModified: '2025-08-30',
        lastUsedDate: '2025-08-29',
        createdBy: 'Michael Chen',
        components: [
            { id: 1, percentage: '50%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
            { id: 2, percentage: '30%', operator: '+', source: 'OPIS', instrument: 'CBOB', dateRule: 'Current', type: 'Average' },
            { id: 3, percentage: '20%', operator: '+', source: 'Platts', instrument: 'CBOB', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'weekend-special',
        name: 'Weekend Special Formulas',
        contractType: 'Contract',
        usedInProducts: ['87 GHL'],
        usedInLocations: ['Houston Terminal'],
        category: 'Seasonal',
        totalUsage: 89,
        description: 'Friday close pricing with weekend premiums for long-term contracts.',
        lastModified: '2025-09-10',
        lastUsedDate: '2025-09-09',
        createdBy: 'Emily Rodriguez',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Friday Close', type: 'Settle' },
        ]
    },
    {
        id: 'marathon-supply',
        name: 'Marathon Supply Agreement',
        contractType: 'Index Deal',
        usedInProducts: ['87 GHL', '93 Premium', 'ULSD'],
        usedInLocations: ['Houston Terminal', 'Nashville Terminal', 'Detroit Terminal'],
        category: 'Partner',
        totalUsage: 298,
        description: 'Custom pricing structure for Marathon Petroleum supply agreements with loyalty discounts.',
        lastModified: '2025-09-18',
        lastUsedDate: '2025-09-17',
        createdBy: 'David Williams',
        components: [
            { id: 1, percentage: '85%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
            { id: 2, percentage: '15%', operator: '+', source: 'OPIS', instrument: 'CBOB', dateRule: 'Current', type: 'Average' },
        ]
    },
    {
        id: 'premium-93-standard',
        name: 'Premium 93 Standard',
        contractType: 'Day Deal',
        usedInProducts: ['93 Premium'],
        usedInLocations: ['Dallas', 'Nashville Terminal', 'Detroit Terminal'],
        category: 'Popular',
        totalUsage: 412,
        description: 'Standard pricing formula for 93 octane premium gasoline at Dallas.',
        lastModified: '2025-09-22',
        lastUsedDate: '2025-09-21',
        createdBy: 'Jessica Martinez',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Argus', instrument: 'Premium USGC', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'ulsd-spot-deal',
        name: 'ULSD Spot Deal Formula',
        contractType: 'Spot Deal',
        usedInProducts: ['ULSD'],
        usedInLocations: ['Nashville Terminal', 'Detroit Terminal', 'Dallas'],
        category: 'Popular',
        totalUsage: 376,
        description: 'Ultra-low sulfur diesel spot pricing with freight differential.',
        lastModified: '2025-09-17',
        lastUsedDate: '2025-09-16',
        createdBy: 'Robert Taylor',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Platts', instrument: 'ULSD', dateRule: 'Current', type: 'Spot' },
        ]
    },
    {
        id: 'jet-a-airport',
        name: 'Jet A Airport Delivery',
        contractType: 'Contract',
        usedInProducts: ['Jet A'],
        usedInLocations: ['Detroit Terminal'],
        category: 'Specialty',
        totalUsage: 203,
        description: 'Aviation fuel pricing with quality certifications and airport delivery charges.',
        lastModified: '2025-09-12',
        lastUsedDate: '2025-09-11',
        createdBy: 'Amanda Lee',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Platts', instrument: 'Jet Fuel', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'e85-seasonal',
        name: 'E85 Seasonal Pricing',
        contractType: 'Index Deal',
        usedInProducts: ['E85'],
        usedInLocations: ['Detroit Terminal', 'Columbia Terminal'],
        category: 'Seasonal',
        totalUsage: 167,
        description: 'Ethanol blend pricing with seasonal RIN adjustments and cold weather premiums.',
        lastModified: '2025-09-05',
        lastUsedDate: '2025-09-04',
        createdBy: 'Christopher Brown',
        components: [
            { id: 1, percentage: '15%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
            { id: 2, percentage: '85%', operator: '+', source: 'OPIS', instrument: 'Ethanol', dateRule: 'Current', type: 'Average' },
        ]
    },
    {
        id: 'rfg-california',
        name: 'RFG California Spec',
        contractType: 'Contract',
        usedInProducts: ['RFG'],
        usedInLocations: ['Detroit Terminal'],
        category: 'Specialty',
        totalUsage: 145,
        description: 'Reformulated gasoline meeting California specifications with CARB compliance fees.',
        lastModified: '2025-08-28',
        lastUsedDate: '2025-08-27',
        createdBy: 'Nicole Anderson',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Argus', instrument: 'CARBOB', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'midwest-blend',
        name: 'Midwest Regional Blend',
        contractType: 'Day Deal',
        usedInProducts: ['CBOB', '87 GHL'],
        usedInLocations: ['Detroit Terminal', 'Columbia Terminal', 'Nashville Terminal'],
        category: 'Regional',
        totalUsage: 278,
        description: 'Regional blend formula optimized for Midwest markets with local price adjustments.',
        lastModified: '2025-09-14',
        lastUsedDate: '2025-09-13',
        createdBy: 'Kevin White',
        components: [
            { id: 1, percentage: '70%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
            { id: 2, percentage: '30%', operator: '+', source: 'OPIS', instrument: 'CBOB Chicago', dateRule: 'Current', type: 'Average' },
        ]
    },
    {
        id: 'futures-hedge',
        name: 'Futures Hedge Formula',
        contractType: 'Futures Deal',
        usedInProducts: ['87 GHL', 'CBOB'],
        usedInLocations: ['Detroit Terminal'],
        category: 'Advanced',
        totalUsage: 112,
        description: 'NYMEX futures-based pricing with basis adjustments for hedging strategies.',
        lastModified: '2025-09-08',
        lastUsedDate: '2025-09-07',
        createdBy: 'Brandon Lewis',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'NYMEX', instrument: 'RBOB Futures', dateRule: 'Settlement', type: 'Futures' },
        ]
    },
    {
        id: 'summer-grade',
        name: 'Summer Grade Premium',
        contractType: 'Contract',
        usedInProducts: ['93 Premium'],
        usedInLocations: ['Nashville Terminal', 'Dallas'],
        category: 'Seasonal',
        totalUsage: 234,
        description: 'Summer-grade premium gasoline with RVP specifications and seasonal premiums.',
        lastModified: '2025-09-01',
        lastUsedDate: '2025-08-31',
        createdBy: 'Stephanie Clark',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Argus', instrument: 'Premium USGC', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'bp-partnership',
        name: 'BP Partnership Formula',
        contractType: 'Index Deal',
        usedInProducts: ['ULSD'],
        usedInLocations: ['Dallas', 'Detroit Terminal', 'Nashville Terminal'],
        category: 'Partner',
        totalUsage: 321,
        description: 'BP-specific pricing with loyalty credits and volume-based tiered discounts.',
        lastModified: '2025-09-19',
        lastUsedDate: '2025-09-18',
        createdBy: 'Matthew Hall',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Platts', instrument: 'ULSD', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'winter-diesel',
        name: 'Winter Diesel Blend',
        contractType: 'Spot Deal',
        usedInProducts: ['ULSD'],
        usedInLocations: ['Detroit Terminal', 'Columbia Terminal'],
        category: 'Seasonal',
        totalUsage: 189,
        description: 'Cold-weather diesel formulation with cloud point depression and winter operability premiums.',
        lastModified: '2025-09-11',
        lastUsedDate: '2025-09-10',
        createdBy: 'Jennifer Young',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Platts', instrument: 'ULSD', dateRule: 'Current', type: 'Spot' },
        ]
    },
    {
        id: 'valero-standard',
        name: 'Valero Standard Rates',
        contractType: 'Day Deal',
        usedInProducts: ['87 GHL', 'CBOB', '93 Premium'],
        usedInLocations: ['Detroit Terminal', 'Houston Terminal'],
        category: 'Partner',
        totalUsage: 395,
        description: 'Standard Valero partnership pricing with branded fuel premiums.',
        lastModified: '2025-09-21',
        lastUsedDate: '2025-09-20',
        createdBy: 'Daniel King',
        components: [
            { id: 1, percentage: '95%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
            { id: 2, percentage: '5%', operator: '+', source: 'OPIS', instrument: 'CBOB', dateRule: 'Current', type: 'Average' },
        ]
    },
    {
        id: 'spot-arbitrage',
        name: 'Spot Market Arbitrage',
        contractType: 'Spot Deal',
        usedInProducts: ['87 GHL', 'CBOB'],
        usedInLocations: ['Nashville Terminal'],
        category: 'Advanced',
        totalUsage: 98,
        description: 'Advanced arbitrage formula tracking multiple spot markets with real-time adjustments.',
        lastModified: '2025-08-25',
        lastUsedDate: '2025-08-24',
        createdBy: 'Ryan Wright',
        components: [
            { id: 1, percentage: '40%', operator: '+', source: 'Platts', instrument: 'CBOB', dateRule: 'Current', type: 'Spot' },
            { id: 2, percentage: '35%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Current', type: 'Spot' },
            { id: 3, percentage: '25%', operator: '+', source: 'OPIS', instrument: 'CBOB', dateRule: 'Current', type: 'Spot' },
        ]
    },
    {
        id: 'gulf-coast-index',
        name: 'Gulf Coast Index Average',
        contractType: 'Index Deal',
        usedInProducts: ['CBOB', '87 GHL'],
        usedInLocations: ['Houston Terminal', 'Nashville Terminal'],
        category: 'Regional',
        totalUsage: 267,
        description: 'Gulf Coast pricing index with pipeline differential and delivery adjustments.',
        lastModified: '2025-09-16',
        lastUsedDate: '2025-09-15',
        createdBy: 'Laura Scott',
        components: [
            { id: 1, percentage: '80%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
            { id: 2, percentage: '20%', operator: '+', source: 'Platts', instrument: 'CBOB Gulf', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'multi-tier-volume',
        name: 'Multi-Tier Volume Pricing',
        contractType: 'Contract',
        usedInProducts: ['87 GHL'],
        usedInLocations: ['Dallas'],
        category: 'Advanced',
        totalUsage: 156,
        description: 'Complex tiered pricing structure with volume breakpoints and loyalty incentives.',
        lastModified: '2025-09-07',
        lastUsedDate: '2025-09-06',
        createdBy: 'Thomas Green',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'renewable-diesel',
        name: 'Renewable Diesel Formula',
        contractType: 'Index Deal',
        usedInProducts: ['ULSD'],
        usedInLocations: ['Detroit Terminal', 'Columbia Terminal'],
        category: 'Specialty',
        totalUsage: 134,
        description: 'Renewable diesel pricing with LCFS and RIN credits for sustainability compliance.',
        lastModified: '2025-09-13',
        lastUsedDate: '2025-09-12',
        createdBy: 'Michelle Adams',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Platts', instrument: 'Renewable Diesel', dateRule: 'Prior Day', type: 'Settle' },
        ]
    },
    {
        id: 'flexible-spot-pricing',
        name: 'Flexible Spot Pricing',
        contractType: 'Spot Deal',
        usedInProducts: ['87 GHL', 'CBOB', 'ULSD', '93 Premium'],
        usedInLocations: ['Houston Terminal', 'Nashville Terminal', 'Dallas', 'Detroit Terminal'],
        category: 'Popular',
        totalUsage: 87,
        description: 'Generic spot pricing template with customizable publisher and instrument. Perfect for quick spot deals where you need flexibility.',
        lastModified: '2025-10-30',
        lastUsedDate: '2025-10-29',
        createdBy: 'Frank Overland',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: PLACEHOLDER_VALUES.SOURCE, instrument: PLACEHOLDER_VALUES.INSTRUMENT, dateRule: 'Current', type: 'Spot' },
        ]
    },
    {
        id: 'multi-source-index',
        name: 'Multi-Source Index Builder',
        contractType: 'Index Deal',
        usedInProducts: ['87 GHL', 'CBOB', '93 Premium', 'ULSD'],
        usedInLocations: ['Houston Terminal', 'Nashville Terminal', 'Dallas', 'Detroit Terminal', 'Columbia Terminal'],
        category: 'Advanced',
        totalUsage: 45,
        description: 'Flexible template for building complex multi-source index formulas. Customize all fields including percentages, publishers, instruments, date rules, and price types.',
        lastModified: '2025-10-30',
        lastUsedDate: '2025-10-28',
        createdBy: 'Frank Overland',
        components: [
            { id: 1, percentage: PLACEHOLDER_VALUES.PERCENTAGE, operator: '+', source: PLACEHOLDER_VALUES.SOURCE, instrument: PLACEHOLDER_VALUES.INSTRUMENT, dateRule: PLACEHOLDER_VALUES.DATE_RULE, type: PLACEHOLDER_VALUES.TYPE },
            { id: 2, percentage: PLACEHOLDER_VALUES.PERCENTAGE, operator: '+', source: PLACEHOLDER_VALUES.SOURCE, instrument: PLACEHOLDER_VALUES.INSTRUMENT, dateRule: PLACEHOLDER_VALUES.DATE_RULE, type: PLACEHOLDER_VALUES.TYPE },
        ]
    },
    {
        id: 'standard-plus-adjustment',
        name: 'Standard Plus Adjustment',
        contractType: 'Day Deal',
        usedInProducts: ['87 GHL', 'CBOB'],
        usedInLocations: ['Houston Terminal', 'Nashville Terminal', 'Dallas'],
        category: 'Popular',
        totalUsage: 112,
        description: 'Standard Argus CBOB USGC base pricing with flexible adjustment component. Customize the adjustment percentage, publisher, and instrument for your specific needs.',
        lastModified: '2025-10-30',
        lastUsedDate: '2025-10-30',
        createdBy: 'Frank Overland',
        components: [
            { id: 1, percentage: '100%', operator: '+', source: 'Argus', instrument: 'CBOB USGC', dateRule: 'Prior Day', type: 'Settle' },
            { id: 2, percentage: PLACEHOLDER_VALUES.PERCENTAGE, operator: '+', source: PLACEHOLDER_VALUES.SOURCE, instrument: PLACEHOLDER_VALUES.INSTRUMENT, dateRule: 'Prior Day', type: 'Fixed' },
        ]
    }
];

// Helper function to get template by ID
export const getTemplateById = (id: string): FormulaTemplate | undefined => {
    return formulaTemplates.find(template => template.id === id);
};

// Helper function to get component count
export const getComponentCount = (template: FormulaTemplate): number => {
    return template.components.length;
};

// Helper function to build auto-generated formula preview string
export const buildAutoFormulaPreview = (components: TemplateComponent[]): string => {
    return components
        .map((comp, idx) => {
            // Determine operator based on percentage sign
            // First component has no operator, subsequent components use + for positive, - for negative
            let operator = '';
            if (idx > 0) {
                // Check if percentage starts with a minus sign
                const isNegative = comp.percentage.toString().trim().startsWith('-');
                operator = isNegative ? ' - ' : ' + ';
            }
            // Remove leading - from percentage if it exists (operator handles it)
            const displayPercentage = comp.percentage.toString().trim().replace(/^-/, '');
            return `${operator}${displayPercentage} ${comp.source} ${comp.instrument}`;
        })
        .join('');
};

// Helper function to build formula preview string (uses custom if available)
export const buildFormulaPreview = (template: FormulaTemplate): string => {
    if (template.customFormulaPreview) {
        return template.customFormulaPreview;
    }
    return buildAutoFormulaPreview(template.components);
};

// Helper function to format multiple items display (for products/locations)
export const formatMultipleDisplay = (items: string[], type: 'Products' | 'Locations'): string => {
    if (!items || items.length === 0) return '-';
    if (items.length === 1) return items[0];
    return `Multiple ${type}`;
};

// Helper function to format tooltip content for multiple items
export const formatTooltipList = (items: string[]): string => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    return items.join('\n');
};

// Helper function to get concatenated string for filtering
export const getFilterValue = (items: string[]): string => {
    return items.join(' ');
};

// Helper function to filter templates with new data structure
export const filterTemplates = (
    templates: FormulaTemplate[],
    filters: {
        contractType?: string;
        product?: string;
        location?: string;
        category?: string;
        searchQuery?: string;
    }
): FormulaTemplate[] => {
    return templates.filter(template => {
        if (filters.contractType && template.contractType !== filters.contractType) return false;
        if (filters.product && !template.usedInProducts.includes(filters.product)) return false;
        if (filters.location && !template.usedInLocations.includes(filters.location)) return false;
        if (filters.category && template.category !== filters.category) return false;
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            return (
                template.name.toLowerCase().includes(query) ||
                template.description.toLowerCase().includes(query) ||
                template.contractType.toLowerCase().includes(query) ||
                template.category.toLowerCase().includes(query) ||
                template.usedInProducts.some(p => p.toLowerCase().includes(query)) ||
                template.usedInLocations.some(l => l.toLowerCase().includes(query))
            );
        }
        return true;
    });
};
