import { ColDef, ColGroupDef, ICellRendererParams } from 'ag-grid-community'
import { Tag } from 'antd'
import { HistoryOutlined } from '@ant-design/icons'

type ColumnOptions = {
  onHistoryClick: () => void
}

export const getQuoteBookColumnDefs = (options: ColumnOptions): (ColDef | ColGroupDef)[] => [
  {
    headerName: '',
    field: 'id',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 40,
    suppressMenu: true,
    pinned: 'left',
  },
  {
    headerName: '',
    field: '_history',
    width: 50,
    suppressMenu: true,
    pinned: 'left',
    cellRenderer: (params: ICellRendererParams) => {
      if (!params.data) return null
      return (
        <HistoryOutlined
          style={{ cursor: 'pointer', fontSize: 16, color: 'var(--theme-color-1)' }}
          onClick={() => options.onHistoryClick()}
        />
      )
    },
  },
  {
    field: 'product',
    headerName: 'Product',
    width: 140,
    pinned: 'left',
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 140,
    pinned: 'left',
  },
  {
    field: 'uom',
    headerName: 'UOM',
    width: 70,
  },
  {
    headerName: 'Prior EOD',
    children: [
      {
        field: 'prior_lastPrice',
        headerName: 'Last Price',
        width: 110,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'prior_lastDiff',
        headerName: 'Last Diff',
        width: 100,
        valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
      },
      {
        field: 'prior_profit',
        headerName: 'Profit',
        width: 90,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'prior_margin',
        headerName: 'Margin',
        width: 90,
        valueFormatter: ({ value }) => value != null ? `${value.toFixed(2)}%` : '',
      },
      {
        field: 'prior_volume',
        headerName: 'Volume',
        width: 100,
        valueFormatter: ({ value }) => value != null ? value.toLocaleString() : '',
      },
    ],
  },
  {
    headerName: 'New EOD',
    children: [
      {
        field: 'proposed_diff',
        headerName: 'Diff',
        width: 100,
        editable: true,
        valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
      },
      {
        field: 'proposed_price',
        headerName: 'Price',
        width: 110,
        editable: true,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
        cellStyle: (params) => {
          if (params.data && params.data.proposed_price !== params.data.prior_lastPrice) {
            return { backgroundColor: 'rgba(var(--theme-color-1-rgb, 24, 144, 255), 0.08)' }
          }
          return null
        },
      },
      {
        field: 'proposed_delta',
        headerName: 'Delta',
        width: 90,
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.value && params.value !== 0) return null
          const val = params.value as number
          const color = val > 0 ? '#52c41a' : val < 0 ? '#ff4d4f' : 'inherit'
          const arrow = val > 0 ? '\u25B2' : val < 0 ? '\u25BC' : ''
          return (
            <span style={{ color, fontWeight: 600 }}>
              {arrow} {Math.abs(val).toFixed(4)}
            </span>
          )
        },
      },
      {
        field: 'proposed_margin',
        headerName: 'Margin',
        width: 90,
        valueFormatter: ({ value }) => value != null ? `${value.toFixed(2)}%` : '',
      },
      {
        field: 'proposed_marketMove',
        headerName: 'Mkt Move',
        width: 100,
        valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
      },
    ],
  },
  {
    headerName: 'Benchmarks',
    children: [
      {
        field: 'benchmark_ulsd',
        headerName: 'ULSD',
        width: 100,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'benchmark_unl',
        headerName: 'UNL',
        width: 100,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
    ],
  },
  {
    field: 'allocation',
    headerName: 'Allocation',
    width: 100,
    valueFormatter: ({ value }) => value != null ? `${Math.round(value * 100)}%` : '',
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    width: 110,
  },
  {
    field: 'exceptions',
    headerName: 'Exceptions',
    width: 180,
    cellRenderer: (params: ICellRendererParams) => {
      const exceptions = params.value as string[] | undefined
      if (!exceptions || exceptions.length === 0) return null
      return (
        <span style={{ display: 'flex', gap: 4, alignItems: 'center', height: '100%' }}>
          {exceptions.map((ex, i) => (
            <Tag key={i} color="red" style={{ margin: 0, fontSize: 11 }}>
              {ex}
            </Tag>
          ))}
        </span>
      )
    },
  },
  {
    field: 'group',
    headerName: 'Group',
    rowGroup: true,
    hide: true,
  },
]
