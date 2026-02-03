/**
 * Shared Formula Types
 *
 * Formula and quote configuration types for fuel industry demos.
 * Compatible with Contract Management FormulaVariable structure.
 */

import type { PricePublisher, PriceType, DateRule } from './price.types'

/**
 * Formula variable - matches Contract Management FormulaVariable
 * Represents a single price index component in a formula
 */
export interface FormulaVariable {
  id: string
  variableName: string // Pattern: var_{index}_group_{groupNum}
  displayName?: string | null

  // Price Source
  pricePublisher: PricePublisher
  priceInstrument: string // 'CBOB USGC', 'ULSD Gulf', etc.
  priceType: PriceType
  dateRule: DateRule

  // Calculation
  percentage: number // Default 100
  differential: number // +/- adjustment in $/gal
}

/**
 * Formula definition for structured pricing
 */
export interface Formula {
  id: string
  name: string
  expression: string // Human-readable expression
  variables: FormulaVariable[]
}

/**
 * Formula template for reusable pricing patterns
 */
export interface FormulaTemplate {
  id: string
  name: string
  description?: string
  productGroup: 'gasoline' | 'diesel' | 'all'
  formula: Formula
  isDefault?: boolean
  isActive: boolean
}

/**
 * Provision type for bid/contract pricing
 */
export type ProvisionType = 'Fixed' | 'Formula' | 'Lesser Of 2' | 'Lesser Of 3'

/**
 * Provision status for validation
 */
export type ProvisionStatus = 'Valid' | 'Needs Configuration' | 'Needs Price'
