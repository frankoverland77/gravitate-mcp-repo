import { ColDef } from 'ag-grid-community'
import { BBDTag } from '@gravitate-js/excalibrr'

export const getCompetitorMappingsColumnDefs = (): ColDef[] => [
  {
    field: 'configurationName',
    headerName: 'Configuration',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: '',
    width: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    sortable: false,
    suppressMenu: true,
  },
  {
    field: 'counterparty',
    headerName: 'Counterparty',
    minWidth: 200,
  },
  {
    field: 'terminal',
    headerName: 'Terminal',
    minWidth: 200,
  },
  {
    field: 'product',
    headerName: 'Product',
    minWidth: 130,
  },
  {
    field: 'costType',
    headerName: 'Cost Type',
    width: 100,
  },
  {
    field: 'existingCompetitorCount',
    headerName: 'Existing',
    width: 100,
    cellRenderer: ({ value }: { value: number }) => (
      <BBDTag
        theme1={value > 0}
        style={{ margin: 0, width: 'fit-content' }}
      >
        {value}
      </BBDTag>
    ),
  },
]
