import type { ColDef } from 'ag-grid-community'

export function CustomerSelectColumnDefs(): ColDef[] {
  return [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      field: 'Value',
      headerName: '',
      width: 50,
      suppressMenu: true,
    },
    { headerName: 'Counterparty', field: 'Text' },
  ]
}
