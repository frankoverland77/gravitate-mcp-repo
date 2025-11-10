import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormulaTemplate, formulaTemplates as initialTemplates } from '../pages/demos/grids/FormulaTemplates.data';

interface FormulaTemplateContextType {
    templates: FormulaTemplate[];
    addTemplate: (template: Omit<FormulaTemplate, 'id' | 'totalUsage' | 'lastModified'>) => FormulaTemplate;
    updateTemplate: (id: string, updates: Partial<FormulaTemplate>) => void;
    deleteTemplate: (id: string) => void;
    getTemplateById: (id: string) => FormulaTemplate | undefined;
}

const FormulaTemplateContext = createContext<FormulaTemplateContextType | undefined>(undefined);

export function FormulaTemplateProvider({ children }: { children: ReactNode }) {
    const [templates, setTemplates] = useState<FormulaTemplate[]>(initialTemplates);

    const addTemplate = (template: Omit<FormulaTemplate, 'id' | 'totalUsage' | 'lastModified' | 'lastUsedDate'>): FormulaTemplate => {
        console.log('=== CONTEXT ADD TEMPLATE ===');
        console.log('Template input:', template);
        console.log('customFormulaPreview in input:', template.customFormulaPreview);
        console.log('usedInProducts in input:', template.usedInProducts);
        console.log('usedInLocations in input:', template.usedInLocations);

        const newTemplate: FormulaTemplate = {
            ...template,
            id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            totalUsage: 0,
            lastModified: new Date().toISOString(),
            lastUsedDate: new Date().toISOString()
        };

        console.log('New template created:', newTemplate);
        console.log('New template customFormulaPreview:', newTemplate.customFormulaPreview);
        console.log('New template usedInProducts:', newTemplate.usedInProducts);
        console.log('New template usedInLocations:', newTemplate.usedInLocations);

        setTemplates(prev => [newTemplate, ...prev]);
        return newTemplate;
    };

    const updateTemplate = (id: string, updates: Partial<FormulaTemplate>) => {
        console.log('=== CONTEXT UPDATE TEMPLATE ===');
        console.log('ID:', id);
        console.log('Updates:', updates);
        console.log('customFormulaPreview in updates:', updates.customFormulaPreview);

        setTemplates(prev =>
            prev.map(template =>
                template.id === id
                    ? {
                        ...template,
                        ...updates,
                        lastModified: new Date().toISOString()
                    }
                    : template
            )
        );

        // Log the updated template
        setTemplates(prev => {
            const updated = prev.find(t => t.id === id);
            if (updated) {
                console.log('Updated template:', updated);
                console.log('Updated customFormulaPreview:', updated.customFormulaPreview);
            }
            return prev;
        });
    };

    const deleteTemplate = (id: string) => {
        setTemplates(prev => prev.filter(template => template.id !== id));
    };

    const getTemplateById = (id: string): FormulaTemplate | undefined => {
        return templates.find(template => template.id === id);
    };

    return (
        <FormulaTemplateContext.Provider
            value={{
                templates,
                addTemplate,
                updateTemplate,
                deleteTemplate,
                getTemplateById
            }}
        >
            {children}
        </FormulaTemplateContext.Provider>
    );
}

export function useFormulaTemplateContext() {
    const context = useContext(FormulaTemplateContext);
    if (!context) {
        throw new Error('useFormulaTemplateContext must be used within FormulaTemplateProvider');
    }
    return context;
}
