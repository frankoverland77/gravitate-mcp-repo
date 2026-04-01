import React, { useMemo } from 'react'
import { GraviGrid, Vertical, Texto } from '@gravitate-js/excalibrr'
import type { ColDef } from 'ag-grid-community'
import { PlusOutlined } from '@ant-design/icons'

const mockPricing = [
  { id: '1', supplier: 'Valero Energy', commodity: 'ULSD', location: 'Houston TX', price: 2.87, volume: 15000, status: 'Active' },
  { id: '2', supplier: 'Marathon Petroleum', commodity: 'Heating Oil', location: 'Albany NY', price: 3.12, volume: 8500, status: 'Active' },
  { id: '3', supplier: 'Sprague Resources', commodity: 'E85', location: 'Portland ME', price: 2.54, volume: 12000, status: 'Pending' },
  { id: '4', supplier: 'Valero Energy', commodity: 'Gasoline', location: 'Newark NJ', price: 2.95, volume: 22000, status: 'Active' },
  { id: '5', supplier: 'Marathon Petroleum', commodity: 'ULSD', location: 'Chicago IL', price: 2.91, volume: 18000, status: 'Active' },
  { id: '6', supplier: 'Sprague Resources', commodity: 'Heating Oil', location: 'Boston MA', price: 3.08, volume: 9500, status: 'Expired' },
  { id: '7', supplier: 'Global Partners', commodity: 'E85', location: 'Syracuse NY', price: 2.48, volume: 7000, status: 'Active' },
  { id: '8', supplier: 'Valero Energy', commodity: 'ULSD', location: 'Philadelphia PA', price: 2.83, volume: 20000, status: 'Pending' },
  { id: '9', supplier: 'Marathon Petroleum', commodity: 'Gasoline', location: 'Detroit MI', price: 3.01, volume: 16000, status: 'Active' },
  { id: '10', supplier: 'Sprague Resources', commodity: 'ULSD', location: 'Hartford CT', price: 2.89, volume: 11000, status: 'Active' },
  { id: '11', supplier: 'Global Partners', commodity: 'Heating Oil', location: 'Providence RI', price: 3.15, volume: 6500, status: 'Expired' },
  { id: '12', supplier: 'Valero Energy', commodity: 'E85', location: 'Baltimore MD', price: 2.52, volume: 13500, status: 'Active' },
]

export function SimpleGrid() {
  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'supplier', headerName: 'Supplier', flex: 1, sortable: true, filter: true },
    { field: 'commodity', headerName: 'Commodity', width: 140, sortable: true, filter: true },
    { field: 'location', headerName: 'Location', width: 160, sortable: true, filter: true },
    { field: 'price', headerName: 'Price ($/gal)', width: 130, type: 'numericColumn', valueFormatter: (p) => p.value != null ? `$${p.value.toFixed(2)}` : '' },
    { field: 'volume', headerName: 'Volume (gal)', width: 140, type: 'numericColumn', valueFormatter: (p) => p.value?.toLocaleString() ?? '' },
    { field: 'status', headerName: 'Status', width: 120, sortable: true, filter: true },
  ], [])

  const controlBarProps = useMemo(() => ({
    title: 'Global Tiered Pricing',
  }), [])

  return (
    <Vertical flex='1'>
      <GraviGrid
        rowData={mockPricing}
        columnDefs={columnDefs}
        agPropOverrides={{}}
        storageKey='simple-grid-ref'
        controlBarProps={controlBarProps}
      />
    </Vertical>
  )
}
