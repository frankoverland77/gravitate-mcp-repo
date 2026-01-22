/**
 * Formula Utilities
 *
 * Factory functions and helpers for creating formula-based bid provisions
 * Designed to match Contract Management patterns for seamless transitions
 */

import type {
  Formula,
  FormulaVariable,
  BidProvision,
  ProvisionType,
  PricePublisher,
  PriceType,
  DateRule,
} from '../rfp.types'

// ID generation helpers
let variableCounter = 0
let formulaCounter = 0
let provisionCounter = 0

export function generateVariableId(): string {
  return `var-${Date.now()}-${++variableCounter}`
}

export function generateFormulaId(): string {
  return `formula-${Date.now()}-${++formulaCounter}`
}

export function generateProvisionId(): string {
  return `provision-${Date.now()}-${++provisionCounter}`
}

/**
 * Create a formula variable with sensible defaults
 */
export function createFormulaVariable(overrides: Partial<FormulaVariable> = {}): FormulaVariable {
  const id = overrides.id ?? generateVariableId()
  const index = variableCounter

  return {
    id,
    variableName: `var_${index}_group_1`,
    displayName: null,
    pricePublisher: 'OPIS',
    priceInstrument: 'CBOB USGC',
    priceType: 'Low',
    dateRule: 'Prior Day',
    percentage: 100,
    differential: 0,
    ...overrides,
  }
}

/**
 * Create a simple one-variable formula (most common case)
 */
export function createSimpleFormula(
  publisher: PricePublisher,
  instrument: string,
  priceType: PriceType,
  differential: number,
  dateRule: DateRule = 'Prior Day'
): Formula {
  const variable = createFormulaVariable({
    pricePublisher: publisher,
    priceInstrument: instrument,
    priceType: priceType,
    dateRule: dateRule,
    percentage: 100,
    differential: differential,
  })

  const diffStr = differential >= 0 ? `+ $${differential.toFixed(2)}` : `- $${Math.abs(differential).toFixed(2)}`
  const formulaName = `${publisher} ${priceType} ${diffStr}`

  return {
    id: generateFormulaId(),
    name: formulaName,
    formulaExpression: `${publisher} ${instrument} ${priceType} ${diffStr}`,
    variables: [variable],
  }
}

/**
 * Create a formula from human-readable string (for common patterns)
 * Examples: "OPIS Low - 2c", "Platts Average + 1c"
 */
export function parseFormulaString(formulaStr: string): Formula | null {
  // Pattern: "{Publisher} {PriceType} {+/-} {cents}c"
  const match = formulaStr.match(/^(OPIS|Platts|Argus)\s+(Low|High|Average|Mean)\s*([+-])\s*(\d+(?:\.\d+)?)\s*c?$/i)

  if (!match) return null

  const [, publisher, priceType, sign, cents] = match
  const differential = (sign === '-' ? -1 : 1) * (parseFloat(cents) / 100)

  return createSimpleFormula(
    publisher as PricePublisher,
    'CBOB USGC', // Default instrument
    priceType as PriceType,
    differential
  )
}

/**
 * Create a fixed price provision
 */
export function createFixedProvision(
  supplierId: string,
  detailId: string,
  fixedValue: number
): BidProvision {
  return {
    id: generateProvisionId(),
    supplierId,
    detailId,
    provisionType: 'Fixed',
    fixedValue,
    formula: null,
    displayPrice: fixedValue,
    status: 'Valid',
  }
}

/**
 * Create a formula-based provision
 */
export function createFormulaProvision(
  supplierId: string,
  detailId: string,
  formula: Formula,
  resolvedPrice: number
): BidProvision {
  return {
    id: generateProvisionId(),
    supplierId,
    detailId,
    provisionType: 'Formula',
    fixedValue: null,
    formula,
    displayPrice: resolvedPrice,
    status: formula.variables.length > 0 ? 'Valid' : 'Needs Configuration',
  }
}

/**
 * Create a "Lesser Of" provision (2 or 3 options)
 */
export function createLesserOfProvision(
  supplierId: string,
  detailId: string,
  formulas: Formula[],
  resolvedPrice: number
): BidProvision {
  const provisionType: ProvisionType = formulas.length === 2 ? 'Lesser Of 2' : 'Lesser Of 3'

  // For Lesser Of, we store only the first formula but the type indicates the structure
  return {
    id: generateProvisionId(),
    supplierId,
    detailId,
    provisionType,
    fixedValue: null,
    formula: formulas[0] || null,
    displayPrice: resolvedPrice,
    status: formulas.every((f) => f.variables.length > 0) ? 'Valid' : 'Needs Configuration',
  }
}

/**
 * Format a formula for display
 */
export function formatFormulaDisplay(formula: Formula): string {
  if (formula.variables.length === 0) {
    return formula.name || 'Unconfigured'
  }

  const v = formula.variables[0]
  const diffStr =
    v.differential >= 0 ? `+ ${formatCents(v.differential)}` : `- ${formatCents(Math.abs(v.differential))}`

  return `${v.pricePublisher} ${v.priceType} ${diffStr}`
}

/**
 * Format cents for display
 */
export function formatCents(value: number): string {
  const cents = Math.round(value * 100)
  return `${cents}¢`
}

/**
 * Calculate resolved price from formula and current market price
 * In production this would use real market data
 */
export function resolveFormulaPrice(formula: Formula, marketPrices: Record<string, number>): number {
  if (formula.variables.length === 0) return 0

  let total = 0
  for (const v of formula.variables) {
    const key = `${v.pricePublisher}-${v.priceInstrument}-${v.priceType}`
    const basePrice = marketPrices[key] ?? 2.25 // Default fallback price
    const adjustedPrice = basePrice * (v.percentage / 100) + v.differential
    total += adjustedPrice
  }

  return Number(total.toFixed(4))
}

/**
 * Validate a formula configuration
 */
export function validateFormula(formula: Formula): string[] {
  const errors: string[] = []

  if (!formula.name || formula.name.trim() === '') {
    errors.push('Formula name is required')
  }

  if (formula.variables.length === 0) {
    errors.push('Formula must have at least one variable')
  }

  for (const v of formula.variables) {
    if (!v.pricePublisher) {
      errors.push(`Variable ${v.variableName}: Publisher is required`)
    }
    if (!v.priceInstrument) {
      errors.push(`Variable ${v.variableName}: Instrument is required`)
    }
    if (v.percentage <= 0 || v.percentage > 200) {
      errors.push(`Variable ${v.variableName}: Percentage must be between 1 and 200`)
    }
  }

  return errors
}

/**
 * Clone a formula with new IDs
 */
export function cloneFormula(formula: Formula): Formula {
  return {
    ...formula,
    id: generateFormulaId(),
    variables: formula.variables.map((v) => ({
      ...v,
      id: generateVariableId(),
    })),
  }
}
