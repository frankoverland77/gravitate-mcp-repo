/**
 * Excel Export Utilities
 *
 * Generates Excel workbook for bid editing with 4 sheets:
 * 1. Bid Summary (Read-only overview)
 * 2. Bid Details (Editable provision types and fixed values)
 * 3. Formula Components (Editable formula variables)
 * 4. Reference Data (Dropdown validation options)
 */

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { RFP, Supplier, DetailRowExtended } from '../rfp.types'
import {
  PRICE_PUBLISHER_OPTIONS,
  PRICE_TYPE_OPTIONS,
  DATE_RULE_OPTIONS,
  PROVISION_TYPE_OPTIONS,
} from '../rfp.types'

// Sheet names as constants
const SHEET_NAMES = {
  SUMMARY: 'Bid Summary',
  DETAILS: 'Bid Details',
  FORMULAS: 'Formula Components',
  REFERENCE: 'Reference Data',
}

/**
 * Generate summary sheet data
 * Read-only overview of all bids
 */
function generateSummarySheet(
  details: DetailRowExtended[],
  suppliers: Supplier[]
): unknown[][] {
  const headers = ['Product', 'Location', 'Supplier', 'Price', 'Type', 'Formula Name']

  const rows: unknown[][] = [headers]

  // Sort details by product then location
  const sortedDetails = [...details].sort((a, b) => {
    if (a.product !== b.product) return a.product.localeCompare(b.product)
    return a.location.localeCompare(b.location)
  })

  for (const detail of sortedDetails) {
    for (const supplier of suppliers) {
      const provision = detail.supplierProvisions[supplier.id]
      if (!provision) continue

      rows.push([
        detail.product,
        detail.location,
        supplier.name,
        `$${provision.displayPrice.toFixed(2)}`,
        provision.provisionType,
        provision.formula?.name ?? '',
      ])
    }
  }

  return rows
}

/**
 * Generate bid details sheet data
 * Editable sheet for provision types and fixed values
 */
function generateDetailsSheet(
  details: DetailRowExtended[],
  suppliers: Supplier[]
): unknown[][] {
  const headers = [
    'Detail ID',
    'Product',
    'Location',
    'Supplier ID',
    'Supplier',
    'Provision Type',
    'Fixed Value',
    'Formula ID',
  ]

  const rows: unknown[][] = [headers]

  for (const detail of details) {
    for (const supplier of suppliers) {
      const provision = detail.supplierProvisions[supplier.id]
      if (!provision) continue

      rows.push([
        detail.id,
        detail.product,
        detail.location,
        supplier.id,
        supplier.name,
        provision.provisionType,
        provision.fixedValue ?? '',
        provision.formula?.id ?? '',
      ])
    }
  }

  return rows
}

/**
 * Generate formula components sheet data
 * Editable sheet for formula variable configuration
 */
function generateFormulasSheet(details: DetailRowExtended[]): unknown[][] {
  const headers = [
    'Formula ID',
    'Formula Name',
    'Var Index',
    'Group',
    'Percentage',
    'Publisher',
    'Instrument',
    'Price Type',
    'Date Rule',
    'Differential',
  ]

  const rows: unknown[][] = [headers]

  // Track unique formulas we've already added
  const addedFormulas = new Set<string>()

  for (const detail of details) {
    for (const provision of Object.values(detail.supplierProvisions)) {
      if (!provision.formula || addedFormulas.has(provision.formula.id)) continue
      addedFormulas.add(provision.formula.id)

      // Add each variable as a row
      for (let i = 0; i < provision.formula.variables.length; i++) {
        const v = provision.formula.variables[i]
        rows.push([
          provision.formula.id,
          provision.formula.name,
          i + 1,
          1, // Group number (usually 1 for simple formulas)
          v.percentage,
          v.pricePublisher,
          v.priceInstrument,
          v.priceType,
          v.dateRule,
          v.differential,
        ])
      }
    }
  }

  return rows
}

/**
 * Generate reference data sheet
 * Contains dropdown options for validation
 */
function generateReferenceSheet(): unknown[][] {
  const maxRows = Math.max(
    PRICE_PUBLISHER_OPTIONS.length,
    PRICE_TYPE_OPTIONS.length,
    DATE_RULE_OPTIONS.length,
    PROVISION_TYPE_OPTIONS.length
  )

  const headers = ['Publishers', 'Price Types', 'Date Rules', 'Provision Types']
  const rows: unknown[][] = [headers]

  for (let i = 0; i < maxRows; i++) {
    rows.push([
      PRICE_PUBLISHER_OPTIONS[i] ?? '',
      PRICE_TYPE_OPTIONS[i] ?? '',
      DATE_RULE_OPTIONS[i] ?? '',
      PROVISION_TYPE_OPTIONS[i] ?? '',
    ])
  }

  return rows
}

/**
 * Set column widths for a worksheet
 */
function setColumnWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ws['!cols'] = widths.map((w) => ({ wch: w }))
}

/**
 * Export bids to Excel workbook
 */
export function exportBidsToExcel(
  rfp: RFP,
  round: number,
  suppliers: Supplier[],
  details: DetailRowExtended[]
): void {
  // Create workbook
  const wb = XLSX.utils.book_new()

  // Sheet 1: Bid Summary (read-only)
  const summaryData = generateSummarySheet(details, suppliers)
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
  setColumnWidths(summaryWs, [15, 15, 15, 12, 12, 25])
  XLSX.utils.book_append_sheet(wb, summaryWs, SHEET_NAMES.SUMMARY)

  // Sheet 2: Bid Details (editable)
  const detailsData = generateDetailsSheet(details, suppliers)
  const detailsWs = XLSX.utils.aoa_to_sheet(detailsData)
  setColumnWidths(detailsWs, [20, 15, 15, 20, 15, 15, 12, 25])
  XLSX.utils.book_append_sheet(wb, detailsWs, SHEET_NAMES.DETAILS)

  // Sheet 3: Formula Components (editable)
  const formulasData = generateFormulasSheet(details)
  const formulasWs = XLSX.utils.aoa_to_sheet(formulasData)
  setColumnWidths(formulasWs, [25, 25, 10, 8, 12, 12, 15, 12, 15, 12])
  XLSX.utils.book_append_sheet(wb, formulasWs, SHEET_NAMES.FORMULAS)

  // Sheet 4: Reference Data (for dropdowns)
  const referenceData = generateReferenceSheet()
  const referenceWs = XLSX.utils.aoa_to_sheet(referenceData)
  setColumnWidths(referenceWs, [15, 15, 15, 15])
  XLSX.utils.book_append_sheet(wb, referenceWs, SHEET_NAMES.REFERENCE)

  // Generate filename with RFP name and date
  const dateStr = new Date().toISOString().split('T')[0]
  const safeName = rfp.name.replace(/[^a-zA-Z0-9]/g, '_')
  const filename = `${safeName}_R${round}_Bids_${dateStr}.xlsx`

  // Export to blob and save
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, filename)
}

/**
 * Generate a blank template for new bid entry
 */
export function exportBlankTemplate(
  rfp: RFP,
  round: number,
  suppliers: Supplier[],
  products: string[],
  locations: string[]
): void {
  const wb = XLSX.utils.book_new()

  // Create empty details sheet structure
  const detailHeaders = [
    'Detail ID',
    'Product',
    'Location',
    'Supplier ID',
    'Supplier',
    'Provision Type',
    'Fixed Value',
    'Formula ID',
  ]

  const detailRows: unknown[][] = [detailHeaders]

  // Generate rows for each product/location/supplier combination
  for (const product of products) {
    for (const location of locations) {
      for (const supplier of suppliers) {
        const detailId = `detail-${product.toLowerCase().replace(/\s/g, '-')}-${location.toLowerCase()}`
        detailRows.push([detailId, product, location, supplier.id, supplier.name, 'Fixed', '', ''])
      }
    }
  }

  const detailsWs = XLSX.utils.aoa_to_sheet(detailRows)
  setColumnWidths(detailsWs, [25, 15, 15, 20, 15, 15, 12, 25])
  XLSX.utils.book_append_sheet(wb, detailsWs, SHEET_NAMES.DETAILS)

  // Add reference sheet
  const referenceData = generateReferenceSheet()
  const referenceWs = XLSX.utils.aoa_to_sheet(referenceData)
  XLSX.utils.book_append_sheet(wb, referenceWs, SHEET_NAMES.REFERENCE)

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0]
  const safeName = rfp.name.replace(/[^a-zA-Z0-9]/g, '_')
  const filename = `${safeName}_R${round}_Template_${dateStr}.xlsx`

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, filename)
}
