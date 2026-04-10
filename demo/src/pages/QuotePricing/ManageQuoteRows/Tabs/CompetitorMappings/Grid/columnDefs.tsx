import { ColDef } from 'ag-grid-community'
import { BBDTag } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'
import { getLocationName, getProductName } from './mockData'
import type { CompetitorQuoteRow, CompetitorAssociation } from './mockData'

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
    cellRenderer: 'agGroupCellRenderer',
    colId: 'expand-column',
    headerName: '',
    maxWidth: 40,
    sortable: false,
    suppressMenu: true,
  },
  {
    field: 'counterparty',
    headerName: 'Counterparty',
    minWidth: 200,
  },
  {
    field: 'existingCompetitorCount',
    headerName: 'Count',
    width: 100,
    cellRenderer: ({ value, data }: { value: number; data: CompetitorQuoteRow }) => {
      if (!data) return null
      if (value === 0) {
        return (
          <Tooltip title="No competitor mappings configured">
            <span>
              <BBDTag warning style={{ margin: 0, width: 'fit-content' }}>
                None
              </BBDTag>
            </span>
          </Tooltip>
        )
      }
      const names = data.existingCompetitors.slice(0, 5).join(', ')
      const suffix =
        data.existingCompetitors.length > 5
          ? `, +${data.existingCompetitors.length - 5} more`
          : ''
      return (
        <Tooltip title={`${names}${suffix}`}>
          <span>
            <BBDTag theme1 style={{ margin: 0, width: 'fit-content' }}>
              {value}
            </BBDTag>
          </span>
        </Tooltip>
      )
    },
  },
  {
    field: 'locationId',
    headerName: 'Terminal',
    minWidth: 200,
    valueGetter: ({ data }: any) => (data ? getLocationName(data.locationId) : ''),
  },
  {
    field: 'productId',
    headerName: 'Product',
    minWidth: 130,
    valueGetter: ({ data }: any) => (data ? getProductName(data.productId) : ''),
  },
  {
    field: 'costType',
    headerName: 'Cost Type',
    width: 100,
  },
]

export const getCompetitorDetailColumnDefs = (
  onToggleVisibility?: (associationId: number) => void,
): ColDef<CompetitorAssociation>[] => [
  {
    headerName: '',
    width: 40,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    sortable: false,
    suppressMenu: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    minWidth: 140,
    sortable: true,
    sort: 'asc',
  },
  {
    field: 'publisher',
    headerName: 'Publisher 1',
    minWidth: 160,
  },
  {
    field: 'region',
    headerName: 'Region',
    minWidth: 100,
  },
  {
    field: 'terminal',
    headerName: 'Terminal',
    minWidth: 180,
  },
  {
    field: 'productGroup',
    headerName: 'Product Group',
    minWidth: 120,
  },
  {
    field: 'product',
    headerName: 'Product',
    minWidth: 200,
  },
  {
    field: 'visibility',
    headerName: 'Visibility',
    width: 110,
    cellRenderer: ({
      value,
      data,
    }: {
      value: 'Show' | 'Hide'
      data: CompetitorAssociation
    }) => (
      <span
        onClick={(e) => {
          e.stopPropagation()
          onToggleVisibility?.(data.id)
        }}
        style={{ cursor: onToggleVisibility ? 'pointer' : 'default' }}
      >
        <BBDTag
          success={value === 'Show'}
          warning={value === 'Hide'}
          style={{ margin: 0, width: 'fit-content' }}
        >
          {value}
        </BBDTag>
      </span>
    ),
  },
]
