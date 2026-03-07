import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { Scenario, ComparisonRowData } from '../../types/scenario.types'

function setColumnWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ws['!cols'] = widths.map((w) => ({ wch: w }))
}

function generateDetailsSheet(scenarios: Scenario[], rows: ComparisonRowData[]): unknown[][] {
  const fixedHeaders = [
    'Product',
    'Location',
    'Eff. Start',
    'Eff. End',
    'Volume (gal)',
    '% of Total',
    'Contract Price',
  ]

  const scenarioHeaders: string[] = []
  for (const s of scenarios) {
    scenarioHeaders.push(`${s.name} $/gal`, `${s.name} Delta`, `${s.name} Delta%`)
  }

  const headers = [...fixedHeaders, ...scenarioHeaders]
  const dataRows: unknown[][] = [headers]

  for (const row of rows) {
    const baseRow: unknown[] = [
      row.product,
      row.location,
      row.effectiveStartDate,
      row.effectiveEndDate,
      row.volume,
      row.percentTotal / 100,
      row.contractPrice,
    ]

    for (const s of scenarios) {
      const cell = row.scenarios[s.id]
      if (!cell || (cell.isMissingPrice && !cell.missingPriceInfo)) {
        baseRow.push('N/A', 'N/A', 'N/A')
      } else {
        const delta = cell.price - row.contractPrice
        const deltaPercent = row.contractPrice !== 0 ? delta / row.contractPrice : 0
        baseRow.push(
          parseFloat(cell.price.toFixed(4)),
          parseFloat(delta.toFixed(4)),
          parseFloat(deltaPercent.toFixed(6)),
        )
      }
    }

    dataRows.push(baseRow)
  }

  return dataRows
}

function generateSummarySheet(
  scenarios: Scenario[],
  totals: Record<string, { volume: number; impact: number; avgCpgDelta: number; includedCount: number; excludedCount: number }>
): unknown[][] {
  const headers = ['Scenario', 'Avg $/gal Delta', 'Total Volume (gal)', 'Details Included']
  const rows: unknown[][] = [headers]

  for (const s of scenarios) {
    const t = totals[s.id]
    if (!t) continue
    rows.push([
      s.name,
      parseFloat(t.avgCpgDelta.toFixed(4)),
      t.volume,
      t.includedCount,
    ])
  }

  return rows
}

export function exportScenarioComparison(
  scenarios: Scenario[],
  rows: ComparisonRowData[],
  totals: Record<string, { volume: number; impact: number; avgCpgDelta: number; includedCount: number; excludedCount: number }>
): void {
  const wb = XLSX.utils.book_new()

  // Sheet 1 — Comparison Details
  const detailsData = generateDetailsSheet(scenarios, rows)
  const detailsWs = XLSX.utils.aoa_to_sheet(detailsData)
  const fixedWidths = [18, 15, 12, 12, 14, 10, 14]
  const scenarioWidths = scenarios.flatMap(() => [12, 12, 10])
  setColumnWidths(detailsWs, [...fixedWidths, ...scenarioWidths])
  XLSX.utils.book_append_sheet(wb, detailsWs, 'Comparison Details')

  // Sheet 2 — Summary
  const summaryData = generateSummarySheet(scenarios, totals)
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
  setColumnWidths(summaryWs, [25, 16, 18, 16])
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')

  const dateStr = new Date().toISOString().split('T')[0]
  const filename = `Scenario_Comparison_${dateStr}.xlsx`

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })
  saveAs(blob, filename)
}
