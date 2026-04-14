import { ColDef, ColGroupDef } from 'ag-grid-community'
import type { InventoryQuoteRow } from './InventoryAnalytics.types'

const currencyFmt = (val: number | null | undefined) => {
  if (val == null) return ''
  return val.toFixed(4)
}

const numberFmt = (val: number | null | undefined) => {
  if (val == null) return ''
  return val.toLocaleString()
}

const pctFmt = (val: number | null | undefined) => {
  if (val == null) return ''
  return `${(val * 100).toFixed(1)}%`
}

function statusBadgeRenderer(params: { value: string }) {
  if (!params.value) return null
  const colorMap: Record<string, { bg: string; color: string }> = {
    healthy: { bg: '#dcfce7', color: '#16a34a' },
    low: { bg: '#fef9c3', color: '#ca8a04' },
    critical: { bg: '#fecaca', color: '#dc2626' },
    overstock: { bg: '#e9d5ff', color: '#7c3aed' },
  }
  const style = colorMap[params.value] || { bg: '#f3f4f6', color: '#6b7280' }
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      background: style.bg,
      color: style.color,
      textTransform: 'capitalize',
    }}>
      {params.value}
    </span>
  )
}

function deltaRenderer(params: { value: number }) {
  if (params.value == null) return null
  const color = params.value > 0 ? '#16a34a' : params.value < 0 ? '#dc2626' : 'inherit'
  const prefix = params.value > 0 ? '+' : ''
  return <span style={{ color, fontWeight: 500 }}>{prefix}{params.value.toFixed(4)}</span>
}

export function getInventoryAnalyticsColumnDefs(): (ColDef<InventoryQuoteRow> | ColGroupDef<InventoryQuoteRow>)[] {
  return [
    {
      headerName: 'Price Info',
      children: [
        { field: 'quoteConfigurationName', headerName: 'Config', width: 160, pinned: 'left' },
        { field: 'counterPartyName', headerName: 'Counter Party', width: 150 },
        { field: 'locationName', headerName: 'Location', width: 150 },
        { field: 'productName', headerName: 'Product', width: 100 },
        { field: 'productGroup', headerName: 'Product Group', width: 120 },
        { field: 'unitOfMeasure', headerName: 'UOM', width: 60 },
      ],
    },
    {
      headerName: 'Prior Period',
      children: [
        { field: 'prior.liftings', headerName: 'Liftings', width: 90, valueFormatter: p => numberFmt(p.value) },
        { field: 'prior.diff', headerName: 'Diff', width: 80, valueFormatter: p => currencyFmt(p.value) },
        { field: 'prior.price', headerName: 'Price', width: 80, valueFormatter: p => currencyFmt(p.value) },
        { field: 'prior.profit', headerName: 'Profit', width: 90, valueFormatter: p => numberFmt(p.value) },
        { field: 'prior.margin', headerName: 'Margin', width: 80, valueFormatter: p => currencyFmt(p.value) },
      ],
    },
    {
      headerName: 'Current Period',
      children: [
        { field: 'current.liftings', headerName: 'Liftings', width: 90, valueFormatter: p => numberFmt(p.value) },
        { field: 'current.cost', headerName: 'Cost', width: 80, valueFormatter: p => currencyFmt(p.value) },
        { field: 'current.diff', headerName: 'Diff', width: 80, valueFormatter: p => currencyFmt(p.value) },
        { field: 'current.price', headerName: 'Price', width: 80, valueFormatter: p => currencyFmt(p.value) },
        { field: 'current.profit', headerName: 'Profit', width: 90, valueFormatter: p => numberFmt(p.value) },
        { field: 'current.margin', headerName: 'Margin', width: 80, valueFormatter: p => currencyFmt(p.value) },
      ],
    },
    {
      headerName: 'Proposed',
      children: [
        { field: 'proposedCost', headerName: 'Cost', width: 80, valueFormatter: p => currencyFmt(p.value) },
        { field: 'costStatusSymbol', headerName: 'Status', width: 60 },
        { field: 'strategyBase', headerName: 'Strategy Base', width: 100, valueFormatter: p => currencyFmt(p.value) },
        { field: 'marketMove', headerName: 'Mkt Move', width: 90, valueFormatter: p => currencyFmt(p.value) },
        {
          field: 'proposedDiff',
          headerName: 'Diff',
          width: 80,
          editable: true,
          valueFormatter: p => currencyFmt(p.value),
          cellStyle: { backgroundColor: 'rgba(59, 130, 246, 0.05)' },
        },
        {
          field: 'proposedPrice',
          headerName: 'Price',
          width: 90,
          editable: true,
          valueFormatter: p => currencyFmt(p.value),
          cellStyle: { backgroundColor: 'rgba(59, 130, 246, 0.05)' },
        },
        {
          field: 'priceDelta',
          headerName: 'Delta',
          width: 80,
          cellRenderer: deltaRenderer,
        },
        { field: 'proposedMargin', headerName: 'Margin', width: 80, valueFormatter: p => currencyFmt(p.value) },
        { field: 'tempAdjustedMargin', headerName: 'Temp Adj Margin', width: 120, valueFormatter: p => currencyFmt(p.value) },
      ],
    },
    {
      headerName: 'Inventory',
      children: [
        { field: 'currentInventory', headerName: 'Inventory', width: 100, valueFormatter: p => numberFmt(p.value) },
        { field: 'daysOfSupply', headerName: 'Days Supply', width: 90 },
        { field: 'reorderPoint', headerName: 'Reorder Pt', width: 100, valueFormatter: p => numberFmt(p.value) },
        {
          field: 'inventoryStatus',
          headerName: 'Status',
          width: 100,
          cellRenderer: statusBadgeRenderer,
        },
      ],
    },
  ]
}
