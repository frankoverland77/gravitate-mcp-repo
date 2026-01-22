/**
 * Excel Import Utilities
 *
 * Parses uploaded Excel files and extracts bid data
 * Validates structure and maps to internal types
 */

import * as XLSX from 'xlsx'
import type {
  DetailRowExtended,
  BidProvision,
  Formula,
  FormulaVariable,
  ProvisionType,
  PricePublisher,
  PriceType,
  DateRule,
  BidChange,
} from '../rfp.types'

// Sheet names expected in uploaded file
const SHEET_NAMES = {
  DETAILS: 'Bid Details',
  FORMULAS: 'Formula Components',
}

/**
 * Parsed row from Bid Details sheet
 */
export interface ParsedDetailRow {
  detailId: string
  product: string
  location: string
  supplierId: string
  supplierName: string
  provisionType: ProvisionType
  fixedValue: number | null
  formulaId: string | null
  rowIndex: number // For error reporting
}

/**
 * Parsed row from Formula Components sheet
 */
export interface ParsedFormulaRow {
  formulaId: string
  formulaName: string
  varIndex: number
  group: number
  percentage: number
  publisher: PricePublisher
  instrument: string
  priceType: PriceType
  dateRule: DateRule
  differential: number
  rowIndex: number // For error reporting
}

/**
 * Result of parsing an Excel file
 */
export interface ParseResult {
  success: boolean
  details: ParsedDetailRow[]
  formulas: Map<string, ParsedFormulaRow[]>
  errors: ParseError[]
}

export interface ParseError {
  sheet: string
  row: number
  column: string
  message: string
}

/**
 * Read an Excel file from a File object
 */
export async function readExcelFile(file: File): Promise<XLSX.WorkBook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        resolve(workbook)
      } catch (error) {
        reject(new Error('Failed to parse Excel file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse the Bid Details sheet
 */
function parseDetailsSheet(wb: XLSX.WorkBook): { rows: ParsedDetailRow[]; errors: ParseError[] } {
  const rows: ParsedDetailRow[] = []
  const errors: ParseError[] = []

  const ws = wb.Sheets[SHEET_NAMES.DETAILS]
  if (!ws) {
    errors.push({
      sheet: SHEET_NAMES.DETAILS,
      row: 0,
      column: '',
      message: `Sheet "${SHEET_NAMES.DETAILS}" not found`,
    })
    return { rows, errors }
  }

  const data = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i] as unknown[]
    if (!row || row.length === 0) continue

    const rowIndex = i + 1 // Excel row number (1-indexed)

    const detailId = String(row[0] ?? '')
    const product = String(row[1] ?? '')
    const location = String(row[2] ?? '')
    const supplierId = String(row[3] ?? '')
    const supplierName = String(row[4] ?? '')
    const provisionType = String(row[5] ?? 'Fixed') as ProvisionType
    const fixedValueRaw = row[6]
    const formulaId = row[7] ? String(row[7]) : null

    // Validate required fields
    if (!detailId) {
      errors.push({
        sheet: SHEET_NAMES.DETAILS,
        row: rowIndex,
        column: 'A',
        message: 'Detail ID is required',
      })
      continue
    }

    if (!supplierId) {
      errors.push({
        sheet: SHEET_NAMES.DETAILS,
        row: rowIndex,
        column: 'D',
        message: 'Supplier ID is required',
      })
      continue
    }

    // Parse fixed value
    let fixedValue: number | null = null
    if (fixedValueRaw !== '' && fixedValueRaw !== undefined && fixedValueRaw !== null) {
      const parsed = parseFloat(String(fixedValueRaw))
      if (isNaN(parsed)) {
        errors.push({
          sheet: SHEET_NAMES.DETAILS,
          row: rowIndex,
          column: 'G',
          message: `Invalid fixed value: ${fixedValueRaw}`,
        })
      } else {
        fixedValue = parsed
      }
    }

    // Validate provision type
    if (!['Fixed', 'Formula', 'Lesser Of 2', 'Lesser Of 3'].includes(provisionType)) {
      errors.push({
        sheet: SHEET_NAMES.DETAILS,
        row: rowIndex,
        column: 'F',
        message: `Invalid provision type: ${provisionType}`,
      })
      continue
    }

    rows.push({
      detailId,
      product,
      location,
      supplierId,
      supplierName,
      provisionType,
      fixedValue,
      formulaId,
      rowIndex,
    })
  }

  return { rows, errors }
}

/**
 * Parse the Formula Components sheet
 */
function parseFormulasSheet(wb: XLSX.WorkBook): {
  formulas: Map<string, ParsedFormulaRow[]>
  errors: ParseError[]
} {
  const formulas = new Map<string, ParsedFormulaRow[]>()
  const errors: ParseError[] = []

  const ws = wb.Sheets[SHEET_NAMES.FORMULAS]
  if (!ws) {
    // Formulas sheet is optional - may not have any formula-based provisions
    return { formulas, errors }
  }

  const data = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i] as unknown[]
    if (!row || row.length === 0) continue

    const rowIndex = i + 1

    const formulaId = String(row[0] ?? '')
    if (!formulaId) continue

    const formulaName = String(row[1] ?? '')
    const varIndex = parseInt(String(row[2] ?? '1'), 10) || 1
    const group = parseInt(String(row[3] ?? '1'), 10) || 1
    const percentage = parseFloat(String(row[4] ?? '100')) || 100
    const publisher = String(row[5] ?? 'OPIS') as PricePublisher
    const instrument = String(row[6] ?? '')
    const priceType = String(row[7] ?? 'Low') as PriceType
    const dateRule = String(row[8] ?? 'Prior Day') as DateRule
    const differential = parseFloat(String(row[9] ?? '0')) || 0

    // Validate publisher
    if (!['OPIS', 'Platts', 'Argus'].includes(publisher)) {
      errors.push({
        sheet: SHEET_NAMES.FORMULAS,
        row: rowIndex,
        column: 'F',
        message: `Invalid publisher: ${publisher}`,
      })
    }

    // Validate price type
    if (!['Low', 'High', 'Average', 'Mean'].includes(priceType)) {
      errors.push({
        sheet: SHEET_NAMES.FORMULAS,
        row: rowIndex,
        column: 'H',
        message: `Invalid price type: ${priceType}`,
      })
    }

    const formulaRow: ParsedFormulaRow = {
      formulaId,
      formulaName,
      varIndex,
      group,
      percentage,
      publisher,
      instrument,
      priceType,
      dateRule,
      differential,
      rowIndex,
    }

    // Group by formula ID
    if (!formulas.has(formulaId)) {
      formulas.set(formulaId, [])
    }
    formulas.get(formulaId)!.push(formulaRow)
  }

  return { formulas, errors }
}

/**
 * Parse an uploaded Excel file
 */
export async function parseExcelUpload(file: File): Promise<ParseResult> {
  try {
    const wb = await readExcelFile(file)

    const detailsResult = parseDetailsSheet(wb)
    const formulasResult = parseFormulasSheet(wb)

    return {
      success: detailsResult.errors.length === 0 && formulasResult.errors.length === 0,
      details: detailsResult.rows,
      formulas: formulasResult.formulas,
      errors: [...detailsResult.errors, ...formulasResult.errors],
    }
  } catch (error) {
    return {
      success: false,
      details: [],
      formulas: new Map(),
      errors: [
        {
          sheet: '',
          row: 0,
          column: '',
          message: error instanceof Error ? error.message : 'Unknown error parsing file',
        },
      ],
    }
  }
}

/**
 * Build Formula objects from parsed formula rows
 */
export function buildFormulasFromParsed(
  formulaRows: Map<string, ParsedFormulaRow[]>
): Map<string, Formula> {
  const formulas = new Map<string, Formula>()

  for (const [formulaId, rows] of formulaRows) {
    if (rows.length === 0) continue

    const firstRow = rows[0]
    const variables: FormulaVariable[] = rows
      .sort((a, b) => a.varIndex - b.varIndex)
      .map((row) => ({
        id: `var-${formulaId}-${row.varIndex}`,
        variableName: `var_${row.varIndex}_group_${row.group}`,
        displayName: null,
        pricePublisher: row.publisher,
        priceInstrument: row.instrument,
        priceType: row.priceType,
        dateRule: row.dateRule,
        percentage: row.percentage,
        differential: row.differential,
      }))

    // Build formula expression
    const expressionParts = variables.map((v) => {
      const diffStr = v.differential >= 0 ? `+ $${v.differential.toFixed(2)}` : `- $${Math.abs(v.differential).toFixed(2)}`
      return `${v.pricePublisher} ${v.priceInstrument} ${v.priceType} ${diffStr}`
    })

    formulas.set(formulaId, {
      id: formulaId,
      name: firstRow.formulaName,
      formulaExpression: expressionParts.join(' + '),
      variables,
    })
  }

  return formulas
}

/**
 * Match parsed data to existing detail rows and identify changes
 */
export function matchUploadedBids(
  parsed: ParseResult,
  existingDetails: DetailRowExtended[],
  marketPrices: Record<string, number>
): {
  updatedDetails: DetailRowExtended[]
  changes: BidChange[]
  unmatchedRows: ParsedDetailRow[]
} {
  const changes: BidChange[] = []
  const unmatchedRows: ParsedDetailRow[] = []

  // Build formulas from parsed data
  const parsedFormulas = buildFormulasFromParsed(parsed.formulas)

  // Create a map of existing details by ID
  const detailsMap = new Map<string, DetailRowExtended>()
  for (const detail of existingDetails) {
    detailsMap.set(detail.id, { ...detail, supplierProvisions: { ...detail.supplierProvisions } })
  }

  // Process each parsed row
  for (const row of parsed.details) {
    const detail = detailsMap.get(row.detailId)
    if (!detail) {
      unmatchedRows.push(row)
      continue
    }

    const existingProvision = detail.supplierProvisions[row.supplierId]
    if (!existingProvision) {
      unmatchedRows.push(row)
      continue
    }

    // Determine new provision
    let newProvision: BidProvision
    let newDisplayPrice: number

    if (row.provisionType === 'Fixed') {
      newDisplayPrice = row.fixedValue ?? existingProvision.displayPrice
      newProvision = {
        ...existingProvision,
        provisionType: 'Fixed',
        fixedValue: newDisplayPrice,
        formula: null,
        displayPrice: newDisplayPrice,
        status: 'Valid',
      }
    } else if (row.formulaId && parsedFormulas.has(row.formulaId)) {
      const formula = parsedFormulas.get(row.formulaId)!
      // Calculate resolved price from formula
      newDisplayPrice = resolveFormulaPriceSimple(formula, marketPrices)
      newProvision = {
        ...existingProvision,
        provisionType: row.provisionType,
        fixedValue: null,
        formula,
        displayPrice: newDisplayPrice,
        status: 'Valid',
      }
    } else {
      // Formula reference but no formula data - keep existing or mark needs config
      newProvision = {
        ...existingProvision,
        provisionType: row.provisionType,
        status: row.formulaId ? 'Needs Configuration' : 'Valid',
      }
      newDisplayPrice = existingProvision.displayPrice
    }

    // Track changes
    if (existingProvision.provisionType !== row.provisionType) {
      changes.push({
        detailId: row.detailId,
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        product: detail.product,
        location: detail.location,
        field: 'Provision Type',
        oldValue: existingProvision.provisionType,
        newValue: row.provisionType,
        changeType: 'provision_type',
      })
    }

    if (Math.abs(existingProvision.displayPrice - newDisplayPrice) > 0.0001) {
      changes.push({
        detailId: row.detailId,
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        product: detail.product,
        location: detail.location,
        field: 'Price',
        oldValue: existingProvision.displayPrice,
        newValue: newDisplayPrice,
        changeType: 'price',
      })
    }

    // Update the provision
    detail.supplierProvisions[row.supplierId] = newProvision
    // Also update supplierValues for backward compatibility
    detail.supplierValues[row.supplierId] = newDisplayPrice
  }

  return {
    updatedDetails: Array.from(detailsMap.values()),
    changes,
    unmatchedRows,
  }
}

/**
 * Simple formula price resolution
 */
function resolveFormulaPriceSimple(formula: Formula, marketPrices: Record<string, number>): number {
  if (formula.variables.length === 0) return 0

  let total = 0
  for (const v of formula.variables) {
    const key = `${v.pricePublisher}-${v.priceInstrument}-${v.priceType}`
    const basePrice = marketPrices[key] ?? 2.25
    const adjustedPrice = basePrice * (v.percentage / 100) + v.differential
    total += adjustedPrice
  }

  return Number(total.toFixed(4))
}
