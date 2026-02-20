/**
 * Delivered Pricing Column Definitions
 *
 * Modeled after the Pricing Engine Quote Book EOD mode column structure.
 * Groups: Price Info | Current Period | Proposed
 */

import type { ColDef, ColGroupDef } from 'ag-grid-community'
import { Popover } from 'antd'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { DELIVERED_PRICING_STRATEGIES } from '../../shared/data'

const currencyFormatter = (params: any) => {
  if (params.value == null) return ''
  return `$${Number(params.value).toFixed(4)}`
}

const integerFormatter = (params: any) => {
  if (params.value == null) return ''
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
          cellStyle: (params: any) => {
            if (params.data?.IsStrategyOverridden) {
              return {
                fontStyle: 'italic',
                color: 'var(--theme-warning, #faad14)',
              }
            }
            return {
              fontStyle: 'italic',
              color: 'var(--theme-primary, #1890ff)',
            }
          },
          valueFormatter: (params: any) => {
            if (!params.value) return ''
            if (params.data?.IsStrategyOverridden) {
              return `\u270E ${params.value}`
            }
            return params.value
          },
        },
        {
          field: 'Exception',
          headerName: 'Supply Exceptions',
          filter: true,
          sortable: true,
          editable: false,
          width: 220,
          cellStyle: (params: any) => {
            if (params.value) {
              return {
                color: 'var(--theme-error, #ff4d4f)',
                fontWeight: 'bold',
                backgroundColor: 'var(--theme-error-dim, rgba(255, 77, 79, 0.06))',
              }
            }
            return { color: '#8c8c8c' }
          },
          valueFormatter: (params: any) => {
            if (!params.value) return '\u2014'
            return `\u26A0 ${params.value}`
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
          valueFormatter: currencyFormatter,
          editable: true,
          type: 'rightAligned',
          width: 100,
          cellStyle: (params: any) => {
            if (params.value < 0) return { color: 'var(--theme-error)', fontWeight: 'bold' }
            if (params.value > 0) return { color: 'green', fontWeight: 'bold' }
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
          cellRenderer: (params: any) => {
            const data = params.data
            if (!data || data.Freight == null) return null
            const freightDisplay = `$${Number(data.Freight).toFixed(4)}`

            const popoverContent = (
              <Vertical style={{ width: 240, gap: 4 }}>
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
                <span style={{ cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: '3px' }}>
                  {freightDisplay}
                </span>
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
          cellRenderer: (params: any) => {
            const data = params.data
            if (!data || data.Tax == null) return null
            const totalTax = Number(data.Tax)
            const taxDisplay = `$${totalTax.toFixed(4)}`

            // Deterministic split: federal ~40%, state ~35%, local ~25% of total tax
            const seed = (data.id ?? 0) * 17 + 31
            const federalPct = 0.38 + ((seed % 7) / 100)       // ~38-44%
            const statePct = 0.33 + (((seed * 3) % 6) / 100)   // ~33-38%
            const federalTax = Number((totalTax * federalPct).toFixed(4))
            const stateTax = Number((totalTax * statePct).toFixed(4))
            const localTax = Number((totalTax - federalTax - stateTax).toFixed(4))

            const popoverContent = (
              <Vertical style={{ width: 220, gap: 4 }}>
                <Horizontal justifyContent="space-between">
                  <Texto>Federal Tax</Texto>
                  <Texto weight={600}>${federalTax.toFixed(4)}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto>State Tax</Texto>
                  <Texto weight={600}>${stateTax.toFixed(4)}</Texto>
                </Horizontal>
                <Horizontal justifyContent="space-between">
                  <Texto>Local Tax</Texto>
                  <Texto weight={600}>${localTax.toFixed(4)}</Texto>
                </Horizontal>
                <div style={{ borderTop: '1px solid var(--theme-border, #d9d9d9)', marginTop: 4, paddingTop: 4 }}>
                  <Horizontal justifyContent="space-between">
                    <Texto weight={600}>Total Tax</Texto>
                    <Texto weight={600}>{taxDisplay}</Texto>
                  </Horizontal>
                </div>
              </Vertical>
            )

            return (
              <Popover placement="top" content={popoverContent}>
                <span style={{ cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: '3px' }}>
                  {taxDisplay}
                </span>
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
          valueGetter: (params: any) => {
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
          cellStyle: (params: any) => {
            if (params.value < 0) return { color: 'var(--theme-error)' }
            if (params.value > 0) return { color: 'green' }
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
          valueGetter: (params: any) => {
            const data = params.data
            if (!data) return null
            const price = Number(((data.Cost ?? 0) + (data.Freight ?? 0) + (data.Tax ?? 0) + (data.Diff ?? 0)).toFixed(4))
            return Number((price - (data.Cost ?? 0)).toFixed(4))
          },
          cellStyle: (params: any) => {
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
