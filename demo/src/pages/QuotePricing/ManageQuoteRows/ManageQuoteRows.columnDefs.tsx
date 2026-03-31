import { ColDef } from 'ag-grid-community'
import { DeleteOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Texto } from '@gravitate-js/excalibrr'

export const getManageQuoteRowsColumnDefs = (): ColDef[] => [
  {
    field: 'competitorCount',
    headerName: 'Competitors',
    width: 110,
    cellRenderer: ({ value }: { value: number }) => (
      <BBDTag theme1={value > 0} style={{ margin: 0, width: 'fit-content' }}>{value} Competitors</BBDTag>
    ),
  },
  {
    field: 'isActive',
    headerName: 'Active',
    width: 90,
    cellRenderer: ({ value }: { value: boolean }) => (
      <BBDTag success={value} style={{ margin: 0, width: 'fit-content' }}>{value ? 'Active' : 'Off'}</BBDTag>
    ),
  },
  {
    field: 'configurationName',
    headerName: 'Configuration',
    rowGroup: true,
    hide: true,
  },
  { field: 'counterparty', headerName: 'Counterparty', minWidth: 140 },
  { field: 'terminal', headerName: 'Terminal', minWidth: 130 },
  {
    field: 'netOrGross',
    headerName: 'Net/Gross',
    width: 100,
    cellStyle: (params: any) =>
      params.value !== 'Net'
        ? { backgroundColor: 'var(--warning-light, #fff7e6)' }
        : null,
  },
  { field: 'product', headerName: 'Product', minWidth: 120 },
  { field: 'costType', headerName: 'Cost Type', width: 110 },
  {
    field: 'group',
    headerName: 'Group',
    width: 100,
    cellRenderer: ({ value }: { value: string }) =>
      value !== 'None' ? (
        <BBDTag theme3 style={{ margin: 0, width: 'fit-content' }}>{value}</BBDTag>
      ) : (
        <Texto appearance="medium">—</Texto>
      ),
  },
  { field: 'strategy', headerName: 'Strategy', minWidth: 130 },
  {
    field: 'usesMarketMove',
    headerName: 'Market Move',
    width: 115,
    cellRenderer: ({ value }: { value: boolean }) => (
      <Texto
        style={{
          color: value
            ? 'var(--success-color, #52c41a)'
            : 'var(--gray-400)',
        }}
      >
        {value ? '☑' : '—'}
      </Texto>
    ),
  },
  { field: 'autoPublishType', headerName: 'Auto Publish', width: 115 },
  {
    field: 'allocation',
    headerName: 'Allocation',
    width: 100,
    valueFormatter: ({ value }: { value: number }) => value != null ? `${value}%` : '',
  },
  {
    headerName: '',
    width: 60,
    sortable: false,
    cellRenderer: () => (
      <GraviButton
        icon={<DeleteOutlined />}
        disabled
        style={{ padding: '0 4px' }}
      />
    ),
  },
]
