import type { ColDef } from 'ag-grid-community'

export function ProductLocationSelectColumnDefs(): ColDef[] {
  return [
    {
      headerCheckboxSelection: false,
      checkboxSelection: true,
      field: 'TradeEntrySetupId',
      headerName: '',
      width: 50,
      suppressMenu: true,
    },
    { headerName: 'Product', field: 'ProductName' },
    { headerName: 'Product Group', field: 'ProductGroupName' },
    { headerName: 'Location', field: 'LocationName' },
    { headerName: 'Location Group', field: 'LocationGroupName' },
  ]
}
