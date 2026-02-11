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
 *
 * Fields use `string` (not strict enums) to accommodate placeholder values
 * like [*SRC*], [*TYPE*], [*DATE*] from formula templates.
 * PricePublisher, PriceType, DateRule are the "happy path" values.
 */
export interface FormulaVariable {
  id: string
  variableName: string // Pattern: var_{index}_group_{groupNum}
  displayName?: string | null

  // Price Source — string to support placeholder values from templates
  pricePublisher: string
  priceInstrument: string // 'CBOB USGC', 'ULSD Gulf', etc.
  priceType: string
  dateRule: string

  // Calculation — percentage can be string when placeholder '[*PCT*]'
  percentage: number | string // Default 100
  differential: number // +/- adjustment in $/gal
}

// Re-export enum types for consumers that need the strict values
export type { PricePublisher, PriceType, DateRule }

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
 * Formula editor UI mode (maps to ProvisionType on save)
 */
export type FormulaMode = 'formula' | 'lower-of-2' | 'lower-of-3'

/**
 * Provision status for validation
 */
export type ProvisionStatus = 'Valid' | 'Needs Configuration' | 'Needs Price'
