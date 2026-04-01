/**
 * Delivered Pricing Column Definitions
 *
 * Modeled after the Pricing Engine Quote Book EOD mode column structure.
 * Groups: Price Info | Current Period | Proposed
 */

import type { CellClassParams, ColDef, ColGroupDef, ICellRendererParams, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community'
import { Popover, Tooltip } from 'antd'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { DELIVERED_PRICING_STRATEGIES, type SupplyException, type ExceptionSeverity } from '../../shared/data'

import styles from './DeliveredPricing.module.css'

const currencyFormatter = (params: ValueFormatterParams) => {
  if (params.value === null || params.value === undefined) return ''
  return `$${Number(params.value).toFixed(4)}`
}

const integerFormatter = (params: ValueFormatterParams) => {
  if (params.value === null || params.value === undefined) return ''
  return Number(params.value).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function getDeliveredPricingColumnDefs(): (ColDef | ColGroupDef)[] {
  return [
    // Quote Configuration as grouped row
    {
      field: 'QuoteConfigurationName',
      headerName: 'Quote Configuration',
      rowGroup: true,
      rowGroupIndex: 0,
      hide: true,
      sort: 'asc' as const,
    },

    // Price Info column group
    {
      headerName: 'Price Info',
      marryChildren: true,
      children: [
        {
          field: 'LocationName',
          headerName: 'Origin Location',
          rowGroup: true,
          rowGroupIndex: 1,
          sort: 'asc' as const,
          filter: true,
          flex: 1,
          minWidth: 150,
        },
        {
          field: 'DestinationLocationName',
          headerName: 'Destination Location',
          filter: true,
          flex: 1,
          minWidth: 160,
          editable: false,
        },
        {
          field: 'CounterpartyName',
          headerName: 'Counterparty',
          filter: true,
          flex: 1,
          minWidth: 140,
          editable: false,
        },
        {
          field: 'ProductName',
          headerName: 'Product',
          filter: true,
          flex: 1,
          minWidth: 130,
          editable: false,
        },
        {
          field: 'Strategy',
          headerName: 'Strategy',
          filter: true,
          editable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: DELIVERED_PRICING_STRATEGIES,
          },
          width: 195,
          // Plain text for copy/export — renderer handles visual display
          valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) return ''
            return params.value
          },
          cellRenderer: (params: ICellRendererParams) => {
            if (!params.value) return null
            const strategy: string = params.value
            const isOverridden = params.data?.IsStrategyOverridden

            // Strategy → color + abbreviated label
            const strategyConfig: Record<string, { color: string; bg: string; abbrev: string }> = {
              'Lowest Price': { color: '#389e0d', bg: 'rgba(56, 158, 13, 0.08)', abbrev: 'Lowest Price' },
              'Lowest Rack': { color: '#389e0d', bg: 'rgba(56, 158, 13, 0.08)', abbrev: 'Lowest Rack' },
              'Lowest Contract': { color: '#1890ff', bg: 'rgba(24, 144, 255, 0.08)', abbrev: 'Low Contract' },
              'Average Rack': { color: '#722ed1', bg: 'rgba(114, 46, 209, 0.08)', abbrev: 'Avg Rack' },
              'Allocation Maintenance': { color: '#d48806', bg: 'rgba(212, 136, 6, 0.08)', abbrev: 'Alloc Maint' },
            }

            const config = strategyConfig[strategy] ?? { color: '#595959', bg: '#f5f5f5', abbrev: strategy }

            return (
              <Horizontal alignItems="center" gap={4} height="100%">
                <Texto
                  className={styles.strategyBadge}
                  style={{
                    color: isOverridden ? '#d48806' : config.color,
                    backgroundColor: isOverridden ? 'rgba(250, 173, 20, 0.08)' : config.bg,
                    border: isOverridden ? '1px dashed rgba(212, 136, 6, 0.3)' : '1px solid transparent',
                  }}
                >
                  {isOverridden && (
                    <Texto className={styles.overrideIcon}>{'\u270E'}</Texto>
                  )}
                  {config.abbrev}
                </Texto>
                {/* Edit affordance — subtle dropdown arrow */}
                <Texto className={styles.dropdownArrow}>{'\u25BE'}</Texto>
              </Horizontal>
            )
          },
        },
        {
          field: 'Exception',
          headerName: 'Supply Exceptions',
          filter: true,
          sortable: true,
          editable: false,
          width: 220,
          // Value getter returns exception count for sorting (0 = no issues, higher = more issues)
          comparator: (a: SupplyException[] | null, b: SupplyException[] | null) => {
            const aLen = a?.length ?? 0
            const bLen = b?.length ?? 0
            if (aLen !== bLen) return bLen - aLen // more exceptions sort first
            // Secondary sort by highest severity
            const severityRank: Record<ExceptionSeverity, number> = { critical: 3, warning: 2, info: 1 }
            const aMax = a ? Math.max(...a.map((e) => severityRank[e.severity] ?? 0)) : 0
            const bMax = b ? Math.max(...b.map((e) => severityRank[e.severity] ?? 0)) : 0
            return bMax - aMax
          },
          // Filter on the labels joined as text
          valueFormatter: (params: ValueFormatterParams) => {
            const exceptions: SupplyException[] | null = params.value
            if (!exceptions?.length) return '\u2014'
            return exceptions.map((e) => e.label).join(', ')
          },
          cellRenderer: (params: ICellRendererParams) => {
            const exceptions: SupplyException[] | null = params.value
            if (!exceptions?.length) {
              return <Texto className={styles.dashPlaceholder}>{'\u2014'}</Texto>
            }

            const severityConfig: Record<ExceptionSeverity, { bg: string; color: string; icon: string }> = {
              critical: { bg: 'rgba(207, 19, 34, 0.08)', color: '#cf1322', icon: '\u2716' },
              warning: { bg: 'rgba(250, 173, 20, 0.10)', color: '#d48806', icon: '\u26A0' },
              info: { bg: 'rgba(24, 144, 255, 0.08)', color: '#1890ff', icon: '\u2139' },
            }

            return (
              <Horizontal alignItems="center" gap={4} height="100%" style={{ overflow: 'hidden' }}>
                {exceptions.map((exc, i) => {
                  const config = severityConfig[exc.severity]
                  return (
                    <Tooltip key={i} title={exc.detail ?? exc.label} mouseEnterDelay={0.2}>
                      <Texto
                        className={styles.exceptionBadge}
                        style={{
                          color: config.color,
                          backgroundColor: config.bg,
                        }}
                      >
                        <Texto className={styles.exceptionIcon}>{config.icon}</Texto>
                        {exc.label}
                      </Texto>
                    </Tooltip>
                  )
                })}
              </Horizontal>
            )
          },
        },
      ],
    },

    // Current Period column group
    {
      headerName: 'Current Period',
      marryChildren: true,
      children: [
        {
          field: 'PriorQuotePeriod.Liftings',
          headerName: 'Sold Vol',
          filter: 'agNumberColumnFilter',
          valueFormatter: integerFormatter,
          editable: false,
          type: 'rightAligned',
          width: 110,
        },
        {
          field: 'PriorQuotePeriod.LastPrice',
          headerName: 'Price',
          filter: 'agNumberColumnFilter',
          valueFormatter: currencyFormatter,
          editable: false,
          type: 'rightAligned',
          width: 120,
        },
      ],
    },

    // Proposed column group
    {
      headerName: 'Proposed',
      marryChildren: true,
      children: [
        {
          field: 'Cost',
          headerName: 'Cost',
          filter: 'agNumberColumnFilter',
          valueFormatter: currencyFormatter,
          editable: false,
          type: 'rightAligned',
          width: 110,
        },
        {
          field: 'Diff',
          headerName: 'Diff',
          filter: 'agNumberColumnFilter',
          editable: true,
          type: 'rightAligned',
          width: 110,
          valueFormatter: currencyFormatter,
          cellStyle: (params: CellClassParams) => {
            if (params.value < 0) return { color: 'var(--theme-error, #ff4d4f)', fontWeight: 'bold' }
            if (params.value > 0) return { color: '#389e0d', fontWeight: 'bold' }
            return {}
          },
        },
        {
          field: 'Freight',
          headerName: 'Freight',
          filter: 'agNumberColumnFilter',
          editable: false,
          type: 'rightAligned',
          width: 110,
          cellRenderer: (params: ICellRendererParams) => {
            const data = params.data
            if (!data || data.Freight === null || data.Freight === undefined) return null
            const freightDisplay = `$${Number(data.Freight).toFixed(4)}`

            const popoverContent = (
              <Vertical gap={4} style={{ width: 240 }}>
                <Horizontal justifyContent="space-between">
                  <Texto>Carrier</Texto>
                  <Texto weight={600}>{data.CarrierName ?? '\u2014'}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto>Origin</Texto>
                  <Texto weight={600}>{data.LocationName ?? '\u2014'}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto>Destination</Texto>
                  <Texto weight={600}>{data.DestinationLocationName ?? '\u2014'}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto>Product</Texto>
                  <Texto weight={600}>{data.ProductName ?? '\u2014'}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto>Freight Type</Texto>
                  <Texto weight={600}>{data.FreightType ?? '\u2014'}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto>Freight Rate</Texto>
                  <Texto weight={600}>{freightDisplay}</Texto>
                </Horizontal>
              </Vertical>
            )

            return (
              <Popover placement="top" content={popoverContent}>
                <Texto className={styles.clickableValue}>
                  {freightDisplay}
                </Texto>
              </Popover>
            )
          },
        },
        {
          field: 'Tax',
          headerName: 'Tax',
          filter: 'agNumberColumnFilter',
          editable: false,
          type: 'rightAligned',
          width: 100,
          cellRenderer: (params: ICellRendererParams) => {
            const data = params.data
            if (!data || data.Tax === null || data.Tax === undefined) return null
            const totalTax = Number(data.Tax)
            const taxDisplay = `$${totalTax.toFixed(4)}`

            // Use actual per-gallon tax breakdown from the data model
            const federalTax = data.FederalTax ?? 0
            const federalExcise = data.FederalExciseTaxRate ?? 0
            const federalLUST = data.FederalLUSTTaxRate ?? 0
            const stateTax = data.StateTax ?? 0
            const localTax = data.LocalTax ?? 0
            const destState = data.DestinationState ?? 'TX'
            const commodity = data.ProductGroup === 'gasoline' ? 'Gasoline' : 'Diesel'
            const productName = data.ProductName ?? commodity

            const popoverContent = (
              <Vertical gap={4} style={{ width: 280 }}>
                {/* Context */}
                <Horizontal justifyContent="space-between">
                  <Texto size={12} color="#8c8c8c">Destination</Texto>
                  <Texto weight={600}>{destState}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto size={12} color="#8c8c8c">Product</Texto>
                  <Texto weight={600}>{productName}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto size={12} color="#8c8c8c">Commodity</Texto>
                  <Texto weight={600}>{commodity}</Texto>
                </Horizontal>

                {/* Federal taxes */}
                <Vertical className={styles.taxSection}>
                  <Texto className={styles.taxSectionHeader} style={{ color: '#722ed1', backgroundColor: 'rgba(114, 46, 209, 0.08)' }}>
                    Federal
                  </Texto>
                </Vertical>
                <Horizontal justifyContent="space-between">
                  <Texto size={12}>Motor Fuel Excise Tax</Texto>
                  <Texto weight={600}>${Number(federalExcise).toFixed(4)}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto size={12}>LUST Trust Fund Tax</Texto>
                  <Texto weight={600}>${Number(federalLUST).toFixed(4)}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between" style={{ paddingTop: 2 }}>
                  <Texto size={12} weight={600} color="#722ed1">Federal Subtotal</Texto>
                  <Texto weight={600} color="#722ed1">${Number(federalTax).toFixed(4)}</Texto>
                </Horizontal>

                {/* State taxes */}
                <Vertical className={styles.taxSection}>
                  <Texto className={styles.taxSectionHeader} style={{ color: '#1890ff', backgroundColor: 'rgba(24, 144, 255, 0.08)' }}>
                    State — Texas
                  </Texto>
                </Vertical>
                <Horizontal justifyContent="space-between">
                  <Texto size={12}>Motor Fuel Tax</Texto>
                  <Texto weight={600}>${Number(stateTax).toFixed(4)}</Texto>
                </Horizontal>

                {/* Local taxes */}
                <Vertical className={styles.taxSection}>
                  <Texto className={styles.taxSectionHeader} style={{ color: '#fa8c16', backgroundColor: 'rgba(250, 140, 22, 0.08)' }}>
                    Local
                  </Texto>
                </Vertical>
                <Horizontal justifyContent="space-between">
                  <Texto size={12} color="#8c8c8c">No local fuel tax in TX</Texto>
                  <Texto weight={600}>${Number(localTax).toFixed(4)}</Texto>
                </Horizontal>

                {/* Total */}
                <Vertical className={styles.taxTotal}>
                  <Horizontal justifyContent="space-between">
                    <Texto weight={600}>Total Tax / Gal</Texto>
                    <Texto weight={700} size={14}>{taxDisplay}</Texto>
                  </Horizontal>
                </Vertical>
              </Vertical>
            )

            return (
              <Popover placement="top" content={popoverContent}>
                <Texto className={styles.clickableValue}>
                  {taxDisplay}
                </Texto>
              </Popover>
            )
          },
        },
        {
          field: 'ProposedPrice',
          headerName: 'Price',
          filter: 'agNumberColumnFilter',
          valueFormatter: currencyFormatter,
          editable: false,
          type: 'rightAligned',
          width: 120,
          cellStyle: () => ({ fontWeight: 'bold' }),
          valueGetter: (params: ValueGetterParams) => {
            const data = params.data
            if (!data) return null
            const cost = data.Cost ?? 0
            return Number((cost + (data.Freight ?? 0) + (data.Tax ?? 0) + (data.Diff ?? 0)).toFixed(4))
          },
        },
        {
          field: 'PriceDelta',
          headerName: 'Price Delta',
          filter: 'agNumberColumnFilter',
          valueFormatter: currencyFormatter,
          editable: false,
          type: 'rightAligned',
          width: 120,
          cellStyle: (params: CellClassParams) => {
            // Buyer perspective: negative delta = savings (green), positive = cost increase (red)
            if (params.value < 0) return { color: '#389e0d' }
            if (params.value > 0) return { color: '#cf1322' }
            return {}
          },
        },
        {
          field: 'Margin',
          headerName: 'Margin',
          filter: 'agNumberColumnFilter',
          valueFormatter: currencyFormatter,
          editable: false,
          type: 'rightAligned',
          width: 110,
          valueGetter: (params: ValueGetterParams) => {
            const data = params.data
            if (!data) return null
            const price = Number(((data.Cost ?? 0) + (data.Freight ?? 0) + (data.Tax ?? 0) + (data.Diff ?? 0)).toFixed(4))
            return Number((price - (data.Cost ?? 0)).toFixed(4))
          },
          cellStyle: (params: CellClassParams) => {
            if (params.value < 0)
              return { backgroundColor: 'var(--theme-error-dim)', fontWeight: 'bold' }
            if (params.value > 0)
              return { backgroundColor: 'var(--theme-success-dim)', fontWeight: 'bold' }
            return { fontWeight: 'bold' }
          },
        },
      ],
    },
  ]
}
