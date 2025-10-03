// Template Family Data Structure - v4
// Components are now selectable/deselectable with all selected by default

const templateFamilies = [
    {
        id: 'columbus-standard',
        name: 'Standard Columbus Index',
        contractType: 'Day Deal',
        product: '87 GHL',
        location: 'Columbus Terminal',
        category: 'Popular',
        totalUsage: 156,
        description: 'Standard Columbus index pricing with multiple component options',
        components: [
            {
                id: 'comp-1',
                percentage: 90,
                operator: '+',
                source: 'Argus',
                instrument: 'CBOB USGC',
                dateRule: 'Prior Day',
                type: 'Settle',
                selected: true,
                usageCount: 156
            },
            {
                id: 'comp-2',
                percentage: 10,
                operator: '+',
                source: 'OPIS',
                instrument: 'CBOB USGC',
                dateRule: 'Current',
                type: 'Average',
                selected: true,
                usageCount: 142
            },
            {
                id: 'comp-3',
                percentage: 5,
                operator: '+',
                source: 'Platts',
                instrument: 'CBOB',
                dateRule: 'Prior Day',
                type: 'High',
                selected: true,
                usageCount: 89
            },
            {
                id: 'comp-4',
                percentage: 0.025,
                operator: '+',
                source: 'Fixed',
                instrument: 'Differential',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 134
            },
            {
                id: 'comp-5',
                percentage: 0.015,
                operator: '-',
                source: 'Fixed',
                instrument: 'Discount',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 98
            }
        ]
    },
    {
        id: 'shell-negotiated',
        name: 'Shell Negotiated Rates',
        contractType: 'Day Deal',
        product: '87 GHL',
        location: 'Columbus Terminal',
        category: 'Partner',
        totalUsage: 203,
        description: 'Shell-specific pricing formulas with negotiated discounts',
        components: [
            {
                id: 'shell-1',
                percentage: 100,
                operator: '+',
                source: 'Argus',
                instrument: 'CBOB USGC',
                dateRule: 'Prior Day',
                type: 'Average',
                selected: true,
                usageCount: 203
            },
            {
                id: 'shell-2',
                percentage: 0.005,
                operator: '-',
                source: 'Fixed',
                instrument: 'Shell Discount',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 203
            },
            {
                id: 'shell-3',
                percentage: 0.010,
                operator: '-',
                source: 'Fixed',
                instrument: 'Volume Discount',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 156
            },
            {
                id: 'shell-4',
                percentage: 0.015,
                operator: '+',
                source: 'Formula',
                instrument: 'Seasonal Factor',
                dateRule: 'Current',
                type: 'Variable',
                selected: true,
                usageCount: 87
            }
        ]
    },
    {
        id: 'complex-multivariable',
        name: 'Complex Multi-Variable',
        contractType: 'Index Deal',
        product: '87 GHL',
        location: 'Columbus Terminal',
        category: 'Advanced',
        totalUsage: 89,
        description: 'Advanced multi-source pricing with RIN adjustments',
        components: [
            {
                id: 'complex-1',
                percentage: 90,
                operator: '+',
                source: 'Argus',
                instrument: 'CBOB USGC',
                dateRule: 'Prior Day',
                type: 'Settle',
                selected: true,
                usageCount: 89
            },
            {
                id: 'complex-2',
                percentage: 10,
                operator: '+',
                source: 'Argus',
                instrument: 'CBOB USGC',
                dateRule: 'Current',
                type: 'Average',
                selected: true,
                usageCount: 89
            },
            {
                id: 'complex-3',
                percentage: 10,
                operator: '-',
                source: 'OPIS',
                instrument: 'Current RIN',
                dateRule: 'Current',
                type: 'Spot',
                selected: true,
                usageCount: 67
            },
            {
                id: 'complex-4',
                percentage: 0.035,
                operator: '+',
                source: 'Formula',
                instrument: 'Premium',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 89
            },
            {
                id: 'complex-5',
                percentage: 75,
                operator: '+',
                source: 'Platts',
                instrument: 'CBOB',
                dateRule: 'Prior Day',
                type: 'High',
                selected: true,
                usageCount: 54
            },
            {
                id: 'complex-6',
                percentage: 25,
                operator: '+',
                source: 'Argus',
                instrument: 'CBOB USGC',
                dateRule: 'Current',
                type: 'Low',
                selected: true,
                usageCount: 54
            }
        ]
    },
    {
        id: 'weekend-special',
        name: 'Weekend Special Formulas',
        contractType: 'Contract',
        product: '87 GHL',
        location: 'Columbus Terminal',
        category: 'Specialty',
        totalUsage: 42,
        description: 'Weekend and holiday pricing adjustments',
        components: [
            {
                id: 'weekend-1',
                percentage: 80,
                operator: '+',
                source: 'OPIS',
                instrument: 'CBOB USGC',
                dateRule: 'Friday Close',
                type: 'Settle',
                selected: true,
                usageCount: 42
            },
            {
                id: 'weekend-2',
                percentage: 20,
                operator: '+',
                source: 'Argus',
                instrument: 'CBOB USGC',
                dateRule: 'Prior Day',
                type: 'Average',
                selected: true,
                usageCount: 42
            },
            {
                id: 'weekend-3',
                percentage: 0.015,
                operator: '+',
                source: 'Fixed',
                instrument: 'Weekend Premium',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 28
            },
            {
                id: 'weekend-4',
                percentage: 0.025,
                operator: '+',
                source: 'Formula',
                instrument: 'Holiday Factor',
                dateRule: 'Current',
                type: 'Variable',
                selected: true,
                usageCount: 18
            }
        ]
    },
    {
        id: 'marathon-supply',
        name: 'Marathon Supply Agreement',
        contractType: 'Index Deal',
        product: '87 GHL',
        location: 'Columbus Terminal',
        category: 'Partner',
        totalUsage: 67,
        description: 'Marathon-specific supply agreement terms',
        components: [
            {
                id: 'marathon-1',
                percentage: 85,
                operator: '+',
                source: 'Platts',
                instrument: 'CBOB',
                dateRule: 'Prior Day',
                type: 'Average',
                selected: true,
                usageCount: 67
            },
            {
                id: 'marathon-2',
                percentage: 15,
                operator: '+',
                source: 'OPIS',
                instrument: 'CBOB USGC',
                dateRule: 'Current',
                type: 'Settle',
                selected: true,
                usageCount: 67
            },
            {
                id: 'marathon-3',
                percentage: 0.012,
                operator: '-',
                source: 'Fixed',
                instrument: 'Volume Discount',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 54
            },
            {
                id: 'marathon-4',
                percentage: 0.018,
                operator: '-',
                source: 'Fixed',
                instrument: 'Enhanced Discount',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 34
            },
            {
                id: 'marathon-5',
                percentage: 0.008,
                operator: '+',
                source: 'Fixed',
                instrument: 'Q4 Premium',
                dateRule: 'Current',
                type: 'Fixed',
                selected: true,
                usageCount: 23
            }
        ]
    }
];

// Filter options for search and categorization
const filterOptions = {
    contractTypes: ["Day Deal", "Contract", "Index Deal"],
    products: ["87 GHL", "93 Premium", "ULSD", "Jet A"],
    locations: ["Columbus Terminal", "Cincinnati Rack", "Toledo Terminal"],
    sources: ["Argus", "OPIS", "Platts", "Formula", "Fixed"],
    categories: ["Popular", "Partner", "Advanced", "Specialty"]
};

// Helper functions
function getTotalComponents() {
    return templateFamilies.reduce((total, family) => total + family.components.length, 0);
}

function searchFamilies(query) {
    if (!query) return templateFamilies;

    const lowerQuery = query.toLowerCase();
    return templateFamilies.filter(family =>
        family.name.toLowerCase().includes(lowerQuery) ||
        family.category.toLowerCase().includes(lowerQuery) ||
        family.contractType.toLowerCase().includes(lowerQuery) ||
        family.description.toLowerCase().includes(lowerQuery)
    );
}

function getFamilyById(familyId) {
    return templateFamilies.find(f => f.id === familyId);
}

function getSelectedComponents(family) {
    return family.components.filter(c => c.selected);
}

function buildFormulaString(family) {
    const selected = getSelectedComponents(family);
    if (selected.length === 0) return 'No components selected';

    return selected
        .map(comp => {
            if (comp.source === 'Fixed') {
                return `${comp.operator} $${comp.percentage.toFixed(3)}/gal ${comp.instrument}`;
            } else {
                return `${comp.percentage}% ${comp.source} ${comp.instrument} ${comp.dateRule}`;
            }
        })
        .join(' ');
}
