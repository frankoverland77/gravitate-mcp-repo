/**
 * Bid Validation Utilities
 *
 * Business rule validation for imported bid changes
 * Checks pricing thresholds, formula configuration, and data integrity
 */

import type {
  BidChange,
  BidValidationResult,
  BidValidationError,
  BidValidationWarning,
  DetailRowExtended,
  Supplier,
} from '../rfp.types'
import type { ParseResult, ParsedDetailRow } from './excelImport'

/**
 * Validation thresholds and rules
 */
const VALIDATION_RULES = {
  // Price must be within this range
  MIN_PRICE: 0.50,
  MAX_PRICE: 10.00,

  // Price change threshold for warnings
  SIGNIFICANT_CHANGE_PERCENT: 5, // 5% change triggers warning

  // Differential limits for formulas
  MIN_DIFFERENTIAL: -0.50,
  MAX_DIFFERENTIAL: 0.50,

  // Percentage limits for formula variables
  MIN_PERCENTAGE: 1,
  MAX_PERCENTAGE: 200,
}

/**
 * Validate parse results (structural validation)
 */
export function validateParseResults(parseResult: ParseResult): {
  errors: BidValidationError[]
  warnings: BidValidationWarning[]
} {
  const errors: BidValidationError[] = []
  const warnings: BidValidationWarning[] = []

  // Convert parse errors to validation errors
  for (const parseError of parseResult.errors) {
    errors.push({
      row: parseError.row,
      field: parseError.column,
      message: parseError.message,
    })
  }

  // Validate each detail row
  for (const row of parseResult.details) {
    const rowErrors = validateDetailRow(row)
    errors.push(...rowErrors)
  }

  // Validate formula configurations
  for (const [, formulaRows] of parseResult.formulas) {
    for (const formulaRow of formulaRows) {
      // Check percentage bounds
      if (formulaRow.percentage < VALIDATION_RULES.MIN_PERCENTAGE) {
        errors.push({
          row: formulaRow.rowIndex,
          field: 'Percentage',
          message: `Percentage ${formulaRow.percentage} is below minimum (${VALIDATION_RULES.MIN_PERCENTAGE})`,
          value: formulaRow.percentage,
        })
      }
      if (formulaRow.percentage > VALIDATION_RULES.MAX_PERCENTAGE) {
        errors.push({
          row: formulaRow.rowIndex,
          field: 'Percentage',
          message: `Percentage ${formulaRow.percentage} exceeds maximum (${VALIDATION_RULES.MAX_PERCENTAGE})`,
          value: formulaRow.percentage,
        })
      }

      // Check differential bounds
      if (formulaRow.differential < VALIDATION_RULES.MIN_DIFFERENTIAL) {
        warnings.push({
          row: formulaRow.rowIndex,
          field: 'Differential',
          message: `Large negative differential: $${formulaRow.differential.toFixed(2)}`,
          value: formulaRow.differential,
        })
      }
      if (formulaRow.differential > VALIDATION_RULES.MAX_DIFFERENTIAL) {
        warnings.push({
          row: formulaRow.rowIndex,
          field: 'Differential',
          message: `Large positive differential: $${formulaRow.differential.toFixed(2)}`,
          value: formulaRow.differential,
        })
      }

      // Check for missing instrument
      if (!formulaRow.instrument || formulaRow.instrument.trim() === '') {
        errors.push({
          row: formulaRow.rowIndex,
          field: 'Instrument',
          message: 'Price instrument is required for formula',
        })
      }
    }
  }

  return { errors, warnings }
}

/**
 * Validate a single detail row
 */
function validateDetailRow(row: ParsedDetailRow): BidValidationError[] {
  const errors: BidValidationError[] = []

  // Fixed provision must have a value
  if (row.provisionType === 'Fixed') {
    if (row.fixedValue === null || row.fixedValue === undefined) {
      errors.push({
        row: row.rowIndex,
        field: 'Fixed Value',
        message: 'Fixed provision requires a price value',
      })
    } else {
      // Validate price range
      if (row.fixedValue < VALIDATION_RULES.MIN_PRICE) {
        errors.push({
          row: row.rowIndex,
          field: 'Fixed Value',
          message: `Price $${row.fixedValue.toFixed(2)} is below minimum ($${VALIDATION_RULES.MIN_PRICE.toFixed(2)})`,
          value: row.fixedValue,
        })
      }
      if (row.fixedValue > VALIDATION_RULES.MAX_PRICE) {
        errors.push({
          row: row.rowIndex,
          field: 'Fixed Value',
          message: `Price $${row.fixedValue.toFixed(2)} exceeds maximum ($${VALIDATION_RULES.MAX_PRICE.toFixed(2)})`,
          value: row.fixedValue,
        })
      }
    }
  }

  // Formula provision must have a formula ID
  if (row.provisionType === 'Formula' || row.provisionType.startsWith('Lesser Of')) {
    if (!row.formulaId) {
      errors.push({
        row: row.rowIndex,
        field: 'Formula ID',
        message: `${row.provisionType} provision requires a formula reference`,
      })
    }
  }

  return errors
}

/**
 * Validate bid changes (business rule validation)
 */
export function validateBidChanges(
  changes: BidChange[],
  existingDetails: DetailRowExtended[],
  _suppliers: Supplier[]
): {
  errors: BidValidationError[]
  warnings: BidValidationWarning[]
} {
  const errors: BidValidationError[] = []
  const warnings: BidValidationWarning[] = []

  // Build lookup for existing prices
  const existingPrices = new Map<string, number>()
  for (const detail of existingDetails) {
    for (const [supplierId, provision] of Object.entries(detail.supplierProvisions)) {
      existingPrices.set(`${detail.id}-${supplierId}`, provision.displayPrice)
    }
  }

  for (const change of changes) {
    // Validate price changes
    if (change.changeType === 'price') {
      const oldPrice = change.oldValue as number
      const newPrice = change.newValue as number

      // Check for significant price change
      const changePercent = Math.abs((newPrice - oldPrice) / oldPrice) * 100
      if (changePercent > VALIDATION_RULES.SIGNIFICANT_CHANGE_PERCENT) {
        warnings.push({
          row: 0,
          field: 'Price',
          message: `${change.supplierName}: Price changed by ${changePercent.toFixed(1)}% for ${change.product} @ ${change.location}`,
          value: newPrice,
        })
      }

      // Validate new price range
      if (newPrice < VALIDATION_RULES.MIN_PRICE) {
        errors.push({
          row: 0,
          field: 'Price',
          message: `${change.supplierName}: Price $${newPrice.toFixed(2)} is below minimum for ${change.product} @ ${change.location}`,
          value: newPrice,
        })
      }
      if (newPrice > VALIDATION_RULES.MAX_PRICE) {
        errors.push({
          row: 0,
          field: 'Price',
          message: `${change.supplierName}: Price $${newPrice.toFixed(2)} exceeds maximum for ${change.product} @ ${change.location}`,
          value: newPrice,
        })
      }
    }
  }

  return { errors, warnings }
}

/**
 * Full validation pipeline
 */
export function validateBidsComplete(
  parseResult: ParseResult,
  changes: BidChange[],
  existingDetails: DetailRowExtended[],
  suppliers: Supplier[]
): BidValidationResult {
  // Phase 1: Structural validation
  const parseValidation = validateParseResults(parseResult)

  // Phase 2: Business rule validation
  const changeValidation = validateBidChanges(changes, existingDetails, suppliers)

  // Combine results
  const allErrors = [...parseValidation.errors, ...changeValidation.errors]
  const allWarnings = [...parseValidation.warnings, ...changeValidation.warnings]

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    changes,
  }
}

/**
 * Format validation result for display
 */
export function formatValidationSummary(result: BidValidationResult): string {
  const parts: string[] = []

  if (result.isValid) {
    parts.push(`✓ Validation passed`)
  } else {
    parts.push(`✗ Validation failed with ${result.errors.length} error(s)`)
  }

  parts.push(`${result.changes.length} change(s) detected`)

  if (result.warnings.length > 0) {
    parts.push(`${result.warnings.length} warning(s)`)
  }

  return parts.join(' · ')
}

/**
 * Group changes by supplier for display
 */
export function groupChangesBySupplier(changes: BidChange[]): Map<string, BidChange[]> {
  const grouped = new Map<string, BidChange[]>()

  for (const change of changes) {
    const key = `${change.supplierId}-${change.supplierName}`
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(change)
  }

  return grouped
}

/**
 * Calculate summary statistics for changes
 */
export function calculateChangeSummary(changes: BidChange[]): {
  totalChanges: number
  priceChanges: number
  formulaChanges: number
  suppliersAffected: number
  avgPriceChange: number
} {
  const priceChanges = changes.filter((c) => c.changeType === 'price')
  const formulaChanges = changes.filter((c) => c.changeType === 'formula' || c.changeType === 'provision_type')
  const uniqueSuppliers = new Set(changes.map((c) => c.supplierId))

  // Calculate average price change
  let avgPriceChange = 0
  if (priceChanges.length > 0) {
    const totalChange = priceChanges.reduce((sum, c) => {
      return sum + ((c.newValue as number) - (c.oldValue as number))
    }, 0)
    avgPriceChange = totalChange / priceChanges.length
  }

  return {
    totalChanges: changes.length,
    priceChanges: priceChanges.length,
    formulaChanges: formulaChanges.length,
    suppliersAffected: uniqueSuppliers.size,
    avgPriceChange,
  }
}
