import { DeleteOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Texto } from '@gravitate-js/excalibrr'
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { tierGroupOptions, tierLevelOptionsByGroup, allTierLevelOptions } from './mockData'

export const getManageQuoteRowsColumnDefs = (): any[] => [
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
    field: 'tierGroup',
    headerName: 'Tier Group',
    width: 130,
    editable: true,
    isBulkEditable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: [null, ...tierGroupOptions.map(o => o.Value)],
    },
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      propKey: 'tierGroup',
      options: tierGroupOptions,
    },
    onCellValueChanged: ({ data, api, node }: any) => {
      if (data) {
        data.tierLevel = null
        api.refreshCells({ rowNodes: [node], columns: ['tierLevel'], force: true })
      }
    },
    cellRenderer: ({ value }: { value: string | null }) =>
      value ? (
        <BBDTag theme1 style={{ margin: 0, width: 'fit-content' }}>{value}</BBDTag>
      ) : (
        <Texto appearance="medium">—</Texto>
      ),
  },
  {
    field: 'tierLevel',
    headerName: 'Tier Level',
    width: 120,
    editable: true,
    isBulkEditable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: (params: any) => {
      const group = params.data?.tierGroup
      const groupLevels = group ? (tierLevelOptionsByGroup[group] ?? []) : []
      return { values: [null, ...groupLevels.map((o: { Value: string }) => o.Value)] }
    },
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      propKey: 'tierLevel',
      options: allTierLevelOptions,
    },
    cellStyle: (params: any) => {
      if (params.data?.tierGroup && !params.data?.tierLevel) {
        return { backgroundColor: 'rgba(220, 38, 38, 0.08)' }
      }
      return null
    },
    cellRenderer: ({ value, data }: { value: string | null; data: any }) => {
      if (value) return <BBDTag theme3 style={{ margin: 0, width: 'fit-content' }}>{value}</BBDTag>
      if (data?.tierGroup) return <Texto style={{ color: 'var(--theme-error)', fontStyle: 'italic' }}>Required</Texto>
      return <Texto appearance="medium">—</Texto>
    },
  },
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
