import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'

const currency = (value: number | null | undefined): string => {
  if (value == null) return ''
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 })
}

const integer = (value: number | null | undefined): string => {
  if (value == null) return ''
  return Math.round(value).toLocaleString('en-US')
}

export function getQuotebookWholesaleColumnDefs(): ColDef[] {
  return [
    {
      field: 'QuoteConfigurationName',
      rowGroup: true,
      rowGroupIndex: 0,
      hide: true,
    },
    {
      headerName: 'Price Info',
      marryChildren: true,
      children: [
        { field: 'QuoteConfigurationMappingId', headerName: 'Id', hide: true },
        {
          field: 'NetOrGross',
          headerName: '',
          maxWidth: 60,
          editable: false,
          cellRenderer: (params: any) => {
            if (!params.data) return null
            const isNet = params.data.NetOrGross === 'Net'
            return (
              <BBDTag theme1={isNet} success={!isNet} style={{ margin: 0, fontSize: 10 }}>
                {params.data.NetOrGross}
              </BBDTag>
            )
          },
        },
        {
          field: 'LocationName',
          headerName: 'Location',
          rowGroup: true,
          rowGroupIndex: 1,
          sort: 'asc' as const,
          flex: 1,
          editable: false,
        },
        {
          field: 'ProductName',
          headerName: 'Product',
          editable: false,
        },
        {
          field: 'SupplierCounterPartyName',
          headerName: 'Counterparty',
          editable: false,
          hide: true,
        },
      ],
    },
    {
      headerName: 'Prior (Feb 10-16)',
      marryChildren: true,
      children: [
        {
          field: 'SecondPriorLiftings',
          headerName: 'Sold Vol',
          editable: false,
          hide: true,
          valueFormatter: (p: any) => integer(p.value),
        },
        {
          field: 'SecondPriorPrice',
          headerName: 'Price',
          editable: false,
          hide: true,
          valueFormatter: (p: any) => currency(p.value),
        },
        {
          field: 'SecondPriorProfit',
          headerName: 'Profit',
          editable: false,
          hide: true,
          valueFormatter: (p: any) => currency(p.value),
        },
      ],
    },
    {
      headerName: 'Current (Feb 17-23)',
      marryChildren: true,
      children: [
        {
          field: 'PriorLiftings',
          headerName: 'Sold Vol',
          editable: false,
          valueFormatter: (p: any) => integer(p.value),
        },
        {
          field: 'PriorCost',
          headerName: 'Cost',
          editable: false,
          valueFormatter: (p: any) => currency(p.value),
        },
        {
          field: 'PriorDiff',
          headerName: 'Diff',
          editable: false,
          valueFormatter: (p: any) => currency(p.value),
          cellStyle: (params: any) => {
            const v = Number(params.value)
            if (v < 0) return { color: 'var(--theme-error)', fontWeight: 'bold' }
            if (v > 0) return { color: 'green', fontWeight: 'bold' }
            return {}
          },
        },
        {
          field: 'PriorProfit',
          headerName: 'Profit',
          editable: false,
          valueFormatter: (p: any) => currency(p.value),
        },
        {
          field: 'PriorPrice',
          headerName: 'Price',
          editable: false,
          valueFormatter: (p: any) => currency(p.value),
        },
      ],
    },
    {
      headerName: 'Proposed (Feb 24, 2026)',
      marryChildren: true,
      children: [
        {
          field: 'Cost',
          headerName: 'Cost',
          editable: false,
          minWidth: 120,
          cellRenderer: (params: any) => {
            if (!params.data) return null
            const symbol = params.data.CostStatusSymbol
            let color = 'inherit'
            if (symbol === 'A') color = 'var(--theme-success)'
            if (symbol === 'M') color = 'var(--theme-error)'
            if (symbol === 'O') color = 'var(--theme-warning)'
            return (
              <Horizontal verticalCenter style={{ gap: '4px' }}>
                <Texto>{currency(params.data.Cost)}</Texto>
                {symbol && <Texto style={{ color }}>({symbol})</Texto>}
              </Horizontal>
            )
          },
        },
        {
          field: 'MarketMoveValue',
          headerName: 'Market Move',
          editable: false,
          valueFormatter: (p: any) => (p.value != null ? p.value.toFixed(4) : ''),
          cellStyle: (params: any) => {
            const v = Number(params.value)
            if (v < 0) return { color: 'var(--theme-error)' }
            if (v > 0) return { color: 'green' }
            return {}
          },
        },
        {
          field: 'Adjustment',
          headerName: 'Diff',
          editable: false,
          valueFormatter: (p: any) => currency(p.value),
          cellStyle: (params: any) => {
            const v = Number(params.value)
            if (v < 0) return { color: 'var(--theme-error)', fontWeight: 'bold' }
            if (v > 0) return { color: 'green', fontWeight: 'bold' }
            return {}
          },
        },
        {
          field: 'ProposedPrice',
          headerName: 'Price',
          editable: false,
          valueFormatter: (p: any) => currency(p.value),
          cellStyle: () => ({ fontWeight: 'bold' }),
        },
        {
          headerName: 'Price Delta',
          editable: false,
          valueGetter: (params: any) => {
            if (!params.data) return null
            return params.data.ProposedPrice - params.data.PriorPrice
          },
          valueFormatter: (p: any) => currency(p.value),
          cellStyle: (params: any) => {
            const v = Number(params.value)
            if (v < 0) return { color: 'var(--theme-error)' }
            if (v > 0) return { color: 'green' }
            return {}
          },
        },
        {
          field: 'Margin',
          headerName: 'Margin',
          minWidth: 90,
          editable: false,
          valueFormatter: (p: any) => currency(p.value),
          cellStyle: (params: any) => {
            if (params.value < 0) return { backgroundColor: 'var(--theme-error-dim)', fontWeight: 'bold' }
            if (params.value > 0) return { backgroundColor: 'var(--theme-success-dim)', fontWeight: 'bold' }
            return { fontWeight: 'bold' }
          },
        },
      ],
    },
  ]
}
