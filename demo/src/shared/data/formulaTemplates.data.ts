/**
 * Shared Formula Templates Data
 *
 * Reusable formula templates for fuel industry demos.
 */

import type { FormulaTemplate, Formula, FormulaVariable } from '../types/formula.types'

/**
 * Create a formula variable with defaults
 */
function createVariable(overrides: Partial<FormulaVariable> & { id: string }): FormulaVariable {
  return {
    variableName: 'var_1_group_1',
    pricePublisher: 'OPIS',
    priceInstrument: 'CBOB USGC',
    priceType: 'Low',
    dateRule: 'Prior Day',
    percentage: 100,
    differential: 0,
    ...overrides,
  }
}

// Standard formula templates
export const FORMULA_TEMPLATES: FormulaTemplate[] = [
  {
    id: 'template-opis-low-minus-2',
    name: 'OPIS Low - 2¢',
    description: 'Standard OPIS Low minus 2 cents differential',
    productGroup: 'gasoline',
    isDefault: true,
    isActive: true,
    formula: {
      id: 'formula-opis-low-minus-2',
      name: 'OPIS Low - 2¢',
      expression: 'OPIS CBOB USGC Low - $0.02',
      variables: [
        createVariable({
          id: 'var-1',
          displayName: 'OPIS CBOB',
          differential: -0.02,
        }),
      ],
    },
  },
  {
    id: 'template-opis-low-minus-3',
    name: 'OPIS Low - 3¢',
    description: 'OPIS Low minus 3 cents differential',
    productGroup: 'gasoline',
    isActive: true,
    formula: {
      id: 'formula-opis-low-minus-3',
      name: 'OPIS Low - 3¢',
      expression: 'OPIS CBOB USGC Low - $0.03',
      variables: [
        createVariable({
          id: 'var-2',
          displayName: 'OPIS CBOB',
          differential: -0.03,
        }),
      ],
    },
  },
  {
    id: 'template-platts-avg',
    name: 'Platts Average',
    description: 'Platts average price with no differential',
    productGroup: 'gasoline',
    isActive: true,
    formula: {
      id: 'formula-platts-avg',
      name: 'Platts Average',
      expression: 'Platts CBOB USGC Average',
      variables: [
        createVariable({
          id: 'var-3',
          pricePublisher: 'Platts',
          priceType: 'Average',
          displayName: 'Platts CBOB',
        }),
      ],
    },
  },
  {
    id: 'template-opis-ulsd-low-minus-2',
    name: 'OPIS ULSD Low - 2¢',
    description: 'OPIS diesel low minus 2 cents differential',
    productGroup: 'diesel',
    isDefault: true,
    isActive: true,
    formula: {
      id: 'formula-opis-ulsd-low-minus-2',
      name: 'OPIS ULSD Low - 2¢',
      expression: 'OPIS ULSD USGC Low - $0.02',
      variables: [
        createVariable({
          id: 'var-4',
          priceInstrument: 'ULSD USGC',
          displayName: 'OPIS ULSD',
          differential: -0.02,
        }),
      ],
    },
  },
  {
    id: 'template-argus-blend',
    name: 'Argus CBOB Blend',
    description: 'Blended formula with 90% Argus CBOB',
    productGroup: 'gasoline',
    isActive: true,
    formula: {
      id: 'formula-argus-blend',
      name: 'Argus CBOB Blend',
      expression: '90% Argus CBOB USGC + 10% RIN Credit',
      variables: [
        createVariable({
          id: 'var-5',
          variableName: 'var_1_group_1',
          pricePublisher: 'Argus',
          displayName: 'Argus CBOB',
          percentage: 90,
        }),
        createVariable({
          id: 'var-6',
          variableName: 'var_2_group_1',
          pricePublisher: 'OPIS',
          priceInstrument: 'RIN',
          displayName: 'RIN Credit',
          percentage: 10,
        }),
      ],
    },
  },
]

/**
 * Get formula template by ID
 */
export function getFormulaTemplateById(id: string): FormulaTemplate | undefined {
  return FORMULA_TEMPLATES.find((t) => t.id === id)
}

/**
 * Get formula by ID
 */
export function getFormulaById(id: string): Formula | undefined {
  const template = FORMULA_TEMPLATES.find((t) => t.formula.id === id)
  return template?.formula
}

/**
 * Get templates by product group
 */
export function getTemplatesByProductGroup(group: 'gasoline' | 'diesel' | 'all'): FormulaTemplate[] {
  if (group === 'all') {
    return FORMULA_TEMPLATES.filter((t) => t.isActive)
  }
  return FORMULA_TEMPLATES.filter((t) => (t.productGroup === group || t.productGroup === 'all') && t.isActive)
}

/**
 * Get default template for a product group
 */
export function getDefaultTemplate(group: 'gasoline' | 'diesel'): FormulaTemplate | undefined {
  return FORMULA_TEMPLATES.find((t) => t.productGroup === group && t.isDefault && t.isActive)
}

/**
 * Get active formula templates as dropdown options
 */
export function getFormulaTemplateOptions(): Array<{ value: string; label: string }> {
  return FORMULA_TEMPLATES.filter((t) => t.isActive).map((t) => ({
    value: t.id,
    label: t.name,
  }))
}
