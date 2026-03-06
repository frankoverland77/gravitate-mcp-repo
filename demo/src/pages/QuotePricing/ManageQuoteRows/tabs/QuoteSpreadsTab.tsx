import { useMemo } from 'react'
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'

const mockSpreadsData = [
  {
    id: 1,
    parentProduct: 'Diesel #2',
    spreadProduct: 'ULSD Futures',
    spreadValue: -0.015,
    terminal: 'Houston Term.',
    isActive: true,
  },
  {
    id: 2,
    parentProduct: 'Unleaded 87',
    spreadProduct: 'UNL Futures',
    spreadValue: -0.02,
    terminal: 'Dallas Hub',
    isActive: true,
  },
  {
    id: 3,
    parentProduct: 'Diesel #2',
    spreadProduct: 'ULSD Futures',
    spreadValue: -0.018,
    terminal: 'Chicago Term.',
    isActive: false,
  },
]

const spreadColumnDefs: ColDef[] = [
  { field: 'parentProduct', headerName: 'Product', minWidth: 140 },
  { field: 'spreadProduct', headerName: 'Spread Product', minWidth: 150 },
  {
    field: 'spreadValue',
    headerName: 'Spread Value',
    width: 120,
    valueFormatter: ({ value }: { value: number }) => value?.toFixed(4),
  },
  { field: 'terminal', headerName: 'Terminal', minWidth: 140 },
  {
    field: 'isActive',
    headerName: 'Active',
    width: 90,
    valueFormatter: ({ value }: { value: boolean }) =>
      value ? 'Yes' : 'No',
  },
]

export function QuoteSpreadsTab() {
  const columnDefs = useMemo(() => spreadColumnDefs, [])

  return (
    <Vertical height="100%">
      <GraviGrid
        storageKey="quote-spreads-grid"
        rowData={mockSpreadsData}
        columnDefs={columnDefs}
        agPropOverrides={{
          getRowId: (p: any) => String(p.data.id),
        }}
        controlBarProps={{ title: 'Quote Spreads', hideActiveFilters: true }}
      />
    </Vertical>
  )
}
