import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { getDeliveredPricingColumnDefs } from './DeliveredPricing.columnDefs'
import { deliveredPricingData, type DeliveredPricingQuoteRow } from './DeliveredPricing.data'
import { DeliveredPricingAnalytics } from './components/Analytics'
import {
  computeQuoteRowExceptions,
  generateSupplyOptionsData,
  getMonthlyToDatePctBySupplyOption,
  resolveStrategyDefault,
  type SupplyOptionRow,
} from './supplyOptions.data'

/**
 * Check whether a quote row's origin location matches a supply option's origin.
 * The quote row LocationName may be a full terminal name (e.g. "Houston Terminal")
 * while supply options use short names (e.g. "Houston"), so we use a startsWith check.
 */
function isSameOrigin(quoteRowLocation: string, supplyOptionOrigin: string): boolean {
  const rowLower = quoteRowLocation.toLowerCase()
  const optLower = supplyOptionOrigin.toLowerCase()
  return rowLower === optLower || rowLower.startsWith(optLower)
}

/**
 * Compute adjusted Freight and Tax when a supply option's origin differs from the
 * quote row's default origin. Returns the original base values when origins match.
 * The adjustment is a deterministic ±20% shift seeded by the origin strings.
 */
function adjustFreightAndTax(
  row: DeliveredPricingQuoteRow,
  supplyOptionOrigin: string
): { freight: number; tax: number } {
  // Use BaseFreight/BaseTax as reference, falling back to current Freight/Tax
  const baseFreight = row.BaseFreight ?? row.Freight
  const baseTax = row.BaseTax ?? row.Tax

  if (isSameOrigin(row.LocationName, supplyOptionOrigin)) {
    // Same origin — use original base values
    return { freight: baseFreight, tax: baseTax }
  }

  // Deterministic seed from the origin pair
  let hash = 0
  const combined = `${row.LocationName}->${supplyOptionOrigin}`
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) | 0
  }

  // Freight adjustment: ±20% of base freight
  const freightPct = ((Math.abs(hash) % 401) - 200) / 1000 // -0.20 to +0.20
  const freight = Number((baseFreight * (1 + freightPct)).toFixed(4))

  // Tax adjustment: ±20% of base tax (use a shifted seed)
  const taxPct = ((Math.abs(hash * 7 + 13) % 401) - 200) / 1000
  const tax = Number((baseTax * (1 + taxPct)).toFixed(4))

  return { freight, tax }
}

/**
 * Compute the full set of proposed fields for a quote row given a single supply option.
 * Adjusts Freight and Tax when the supply option's origin differs from the row's origin.
 */
function computeProposedFields(
  row: DeliveredPricingQuoteRow,
  option: SupplyOptionRow
): Pick<DeliveredPricingQuoteRow, 'Cost' | 'Freight' | 'Tax' | 'ProposedPrice' | 'PriceDelta' | 'Margin'> {
  const newCost = option.price
  const { freight, tax } = adjustFreightAndTax(row, option.originLocation)
  const proposedPrice = Number((newCost + freight + tax + (row.Diff ?? 0)).toFixed(4))
  const priceDelta = Number((proposedPrice - (row.PriorQuotePeriod?.LastPrice ?? 0)).toFixed(4))
  const margin = Number((proposedPrice - newCost).toFixed(4))
  return { Cost: newCost, Freight: freight, Tax: tax, ProposedPrice: proposedPrice, PriceDelta: priceDelta, Margin: margin }
}

/**
 * Compute proposed fields from multiple supply options by averaging.
 * Averages the cost (price) across selected options, and averages freight/tax
 * adjustments across the unique origins represented.
 */
function computeProposedFieldsFromMultiple(
  row: DeliveredPricingQuoteRow,
  options: SupplyOptionRow[]
): Pick<DeliveredPricingQuoteRow, 'Cost' | 'Freight' | 'Tax' | 'ProposedPrice' | 'PriceDelta' | 'Margin'> {
  if (options.length === 1) return computeProposedFields(row, options[0])

  // Average the prices
  const avgCost = Number((options.reduce((sum, o) => sum + o.price, 0) / options.length).toFixed(4))

  // Average freight and tax across selected supply options
  let totalFreight = 0
  let totalTax = 0
  for (const opt of options) {
    const { freight, tax } = adjustFreightAndTax(row, opt.originLocation)
    totalFreight += freight
    totalTax += tax
  }
  const avgFreight = Number((totalFreight / options.length).toFixed(4))
  const avgTax = Number((totalTax / options.length).toFixed(4))

  const proposedPrice = Number((avgCost + avgFreight + avgTax + (row.Diff ?? 0)).toFixed(4))
  const priceDelta = Number((proposedPrice - (row.PriorQuotePeriod?.LastPrice ?? 0)).toFixed(4))
  const margin = Number((proposedPrice - avgCost).toFixed(4))
  return { Cost: avgCost, Freight: avgFreight, Tax: avgTax, ProposedPrice: proposedPrice, PriceDelta: priceDelta, Margin: margin }
}

/**
 * Enrich a single quote row with Exception and IsStrategyOverridden fields
 * based on supply option analysis.
 * Resolves the strategy default for the row and evaluates exception conditions.
 * A row is considered overridden when the user has selected supply option(s)
 * that differ from what the strategy would automatically pick.
 */
function computeExceptionForRow(
  row: DeliveredPricingQuoteRow,
  overrides: Record<number, number[]>
): DeliveredPricingQuoteRow {
  const options = generateSupplyOptionsData(row)
  const lifting = getMonthlyToDatePctBySupplyOption(row)
  const strategyDefault = resolveStrategyDefault(row.Strategy, options, lifting)

  // Determine active option: for exception computation, use the first override or strategy default
  const overrideIds = overrides[row.id] ?? null
  const activeId = overrideIds?.[0] ?? strategyDefault?.id ?? null
  const activeOption = activeId != null ? options.find((o) => o.id === activeId) ?? null : null

  // Overridden = user picked different supply option(s) than the strategy default
  const isOverridden =
    overrideIds != null &&
    (overrideIds.length !== 1 || overrideIds[0] !== strategyDefault?.id)

  const exception = computeQuoteRowExceptions(row, options, activeOption)
  return { ...row, Exception: exception, IsStrategyOverridden: isOverridden }
}

/** Enrich all rows with computed Exception fields */
function enrichWithExceptions(
  rows: DeliveredPricingQuoteRow[],
  overrides: Record<number, number[]>
): DeliveredPricingQuoteRow[] {
  return rows.map((row) => computeExceptionForRow(row, overrides))
}

export function DeliveredPricing() {
  const [rowData, setRowData] = useState<DeliveredPricingQuoteRow[]>(() =>
    enrichWithExceptions(deliveredPricingData, {})
  )
  const [showAnalytics] = useState(true)
  const [selectedRow, setSelectedRow] = useState<DeliveredPricingQuoteRow | null>(null)

  // Track the active supply option IDs per quote row (keyed by quote row id)
  // Stores user overrides — if not present, strategy default is used
  const [overrides, setOverrides] = useState<Record<number, number[]>>({})

  // Validation: products must be sourced from a single origin
  const [originValidationError, setOriginValidationError] = useState<string | null>(null)

  // Auto-dismiss the validation error after 4 seconds
  useEffect(() => {
    if (!originValidationError) return
    const timer = setTimeout(() => setOriginValidationError(null), 4000)
    return () => clearTimeout(timer)
  }, [originValidationError])

  // AG Grid API ref for programmatic cell updates
  const gridApiRef = useRef<any>(null)

  // Compute supply options and strategy default for the selected row
  const supplyOptions = useMemo(
    () => (selectedRow ? generateSupplyOptionsData(selectedRow) : []),
    [selectedRow]
  )

  const liftingPctMap = useMemo(
    () => (selectedRow ? getMonthlyToDatePctBySupplyOption(selectedRow) : new Map<number, number>()),
    [selectedRow]
  )

  const strategyDefault = useMemo(() => {
    if (!selectedRow) return null
    return resolveStrategyDefault(selectedRow.Strategy, supplyOptions, liftingPctMap)
  }, [selectedRow, supplyOptions, liftingPctMap])

  // The active supply option IDs: user overrides if set, otherwise strategy default (single)
  const activeSupplyOptionIds = useMemo((): number[] => {
    if (!selectedRow) return []
    const overrideIds = overrides[selectedRow.id]
    if (overrideIds?.length) return overrideIds
    return strategyDefault ? [strategyDefault.id] : []
  }, [selectedRow, overrides, strategyDefault])

  // When supply options are selected (single or multi) in the analytics grid
  const handleSupplyOptionsSelected = useCallback(
    (selected: SupplyOptionRow[]) => {
      if (!selectedRow || !selected.length) return

      // Validate: all selected supply options must share the same origin location
      if (selected.length > 1) {
        const origins = new Set(selected.map((o) => o.originLocation))
        if (origins.size > 1) {
          const originList = [...origins].join(', ')
          setOriginValidationError(
            `Cannot split pricing across origins (${originList}). A product must be sourced from a single origin.`
          )
          return
        }
      }

      // Clear any previous validation error
      setOriginValidationError(null)

      // Store the user override (array of IDs)
      const newOverrides = { ...overrides, [selectedRow.id]: selected.map((o) => o.id) }
      setOverrides(newOverrides)

      // Compute averaged cost/freight/tax across selected options
      setRowData((prev) =>
        prev.map((row) => {
          if (row.id !== selectedRow.id) return row
          const proposed = computeProposedFieldsFromMultiple(row, selected)
          const updated = computeExceptionForRow({ ...row, ...proposed }, newOverrides)
          setSelectedRow(updated)
          return updated
        })
      )

      // Refresh grid cells
      if (gridApiRef.current) {
        gridApiRef.current.refreshCells({ force: true })
      }
    },
    [selectedRow, overrides]
  )

  // When a quote row is selected, apply the strategy default if no override exists
  const handleQuoteRowSelected = useCallback(
    (row: DeliveredPricingQuoteRow) => {
      setSelectedRow(row)

      // If no user override exists, apply the strategy default Cost (with freight/tax adjustment)
      if (overrides[row.id] == null) {
        const options = generateSupplyOptionsData(row)
        const lifting = getMonthlyToDatePctBySupplyOption(row)
        const defaultOption = resolveStrategyDefault(row.Strategy, options, lifting)
        if (defaultOption) {
          const proposed = computeProposedFields(row, defaultOption)
          const hasChanges = proposed.Cost !== row.Cost || proposed.Freight !== row.Freight || proposed.Tax !== row.Tax
          if (hasChanges) {
            setRowData((prev) =>
              prev.map((r) => {
                if (r.id !== row.id) return r
                const updated = computeExceptionForRow({ ...r, ...computeProposedFields(r, defaultOption) }, overrides)
                setSelectedRow(updated)
                return updated
              })
            )
          }
        }
      }
    },
    [overrides]
  )

  const columnDefs = useMemo(() => getDeliveredPricingColumnDefs(), [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => String(params.data?.id),
      domLayout: 'normal' as const,
      groupDefaultExpanded: 1,
      rowSelection: 'single' as const,
      autoGroupColumnDef: {
        headerName: 'Quote Configuration',
        minWidth: 250,
        cellRendererParams: {
          suppressCount: false,
        },
      },
      onGridReady: (params: any) => {
        gridApiRef.current = params.api
      },
      onRowSelected: (event: any) => {
        if (event.node.isSelected() && event.data && showAnalytics) {
          handleQuoteRowSelected(event.data)
        }
      },
      // When Strategy changes via cell edit, clear the override and re-resolve
      onCellValueChanged: (event: any) => {
        if (event.colDef.field === 'Strategy') {
          const updatedRow = event.data as DeliveredPricingQuoteRow
          // Clear any user override(s) so strategy default takes effect
          const newOverrides = { ...overrides }
          delete newOverrides[updatedRow.id]
          setOverrides(newOverrides)

          // Re-resolve strategy default and apply new Cost + freight/tax + recompute exception
          const options = generateSupplyOptionsData(updatedRow)
          const lifting = getMonthlyToDatePctBySupplyOption(updatedRow)
          const defaultOption = resolveStrategyDefault(updatedRow.Strategy, options, lifting)
          if (defaultOption) {
            setRowData((prev) =>
              prev.map((r) => {
                if (r.id !== updatedRow.id) return r
                const proposed = computeProposedFields(r, defaultOption)
                const updated = computeExceptionForRow(
                  { ...r, Strategy: updatedRow.Strategy, ...proposed },
                  newOverrides
                )
                if (selectedRow?.id === updatedRow.id) {
                  setSelectedRow(updated)
                }
                return updated
              })
            )
          }
        }
      },
    }),
    [showAnalytics, handleQuoteRowSelected, selectedRow]
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Delivered Pricing',
      subtitle:
        'End of Day quote book — review and adjust delivered pricing by origin, destination, and product.',
      hideActiveFilters: false,
    }),
    []
  )

  const updateEP = async () => {
    return Promise.resolve()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Origin validation error banner */}
      {originValidationError && (
        <div
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--theme-error-dim, rgba(255, 77, 79, 0.08))',
            borderLeft: '3px solid var(--theme-error, #ff4d4f)',
            color: 'var(--theme-error, #ff4d4f)',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <span>⚠</span>
          <span>{originValidationError}</span>
        </div>
      )}

      {/* Analytics Panel */}
      <div
        style={{
          height: showAnalytics ? '400px' : '0px',
          transition: 'height 0.5s ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <DeliveredPricingAnalytics
          selectedRow={selectedRow}
          activeSupplyOptionIds={activeSupplyOptionIds}
          strategyDefaultId={strategyDefault?.id ?? null}
          onSupplyOptionsSelected={handleSupplyOptionsSelected}
        />
      </div>

      {/* Grid */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraviGrid
          storageKey="delivered-pricing-grid"
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          updateEP={updateEP}
          headerHeight={33}
          className="quotebook-grid"
        />
      </div>
    </div>
  )
}
