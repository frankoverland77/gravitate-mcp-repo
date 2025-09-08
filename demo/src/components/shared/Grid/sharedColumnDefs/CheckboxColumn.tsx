import { ColDef } from 'ag-grid-community'

export function CheckboxColumn(field = 'checkbox'): ColDef {
  return {
    headerName: '',
    field,
    maxWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    pinned: 'left',
  }
}
export function CheckboxColumnWithFilter(field = 'checkbox'): ColDef {
  return {
    headerName: '',
    field,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    pinned: 'left',
    maxWidth: 120,
    filter: 'agSetColumnFilter',
    filterParams: {
      values: ['Selected', 'Unselected'],
    },
    valueGetter: (params) => (params.node?.isSelected() ? 'Selected' : 'Unselected'),
    filterValueGetter: (params) => (params.node?.isSelected() ? 'Selected' : 'Unselected'),
    sortable: false,
  }
}
