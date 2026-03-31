import React, { useMemo } from 'react'
import { GraviGrid, Texto } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

interface SampleRow {
  id: number
  customer: string
  product: string
  volume: number
  price: number
}

const sampleData: SampleRow[] = [
  { id: 1, customer: 'Acme Corp', product: 'ULSD', volume: 12500, price: 2.4567 },
  { id: 2, customer: 'Beta Energy', product: 'Gasoline', volume: 8000, price: 2.8901 },
  { id: 3, customer: 'Gamma Fuels', product: 'Propane', volume: 15200, price: 1.2345 },
  { id: 4, customer: 'Delta Supply', product: 'Ethanol', volume: 6800, price: 2.1034 },
  { id: 5, customer: 'Echo Trading', product: 'ULSD', volume: 22000, price: 2.5123 },
]

const columnDefs = [
  { field: 'id', headerName: 'ID', width: 80, sortable: true },
  { field: 'customer', headerName: 'Customer', flex: 1, sortable: true, filter: true },
  { field: 'product', headerName: 'Product', width: 140, sortable: true, filter: true },
  {
    field: 'volume',
    headerName: 'Volume (gal)',
    width: 140,
    sortable: true,
    type: 'numericColumn',
    valueFormatter: (params: any) => params.value?.toLocaleString(),
  },
  {
    field: 'price',
    headerName: 'Price ($/gal)',
    width: 140,
    sortable: true,
    type: 'numericColumn',
    valueFormatter: (params: any) => params.value != null ? `$${params.value.toFixed(4)}` : '',
  },
]

export function GridShowcase() {
  return (
    <ShowcaseShell title="Grid" subtitle="GraviGrid — minimal data grid" accentColor="#722ed1" gridMode="wide">
      <SectionDivider title="GraviGrid — autoHeight" />
      <SpecimenCard
        label="GraviGrid"
        props='columnDefs={[...]} rowData={[...5 rows]} domLayout="autoHeight" storageKey="..."'
        wide
      >
        <div style={{ width: '100%' }}>
          <GraviGrid
            agPropOverrides={{
              domLayout: 'autoHeight',
            }}
            columnDefs={columnDefs}
            rowData={sampleData}
            storageKey="DesignSystemGridShowcase"
          />
        </div>
      </SpecimenCard>

      <SectionDivider title="GraviGrid Props Reference" />
      <SpecimenCard label="Required Props" column>
        <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#262626' }}>
          <div>
            <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>agPropOverrides={'{}'}</code>{' '}
            — Always required, even if empty
          </div>
          <div>
            <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>columnDefs</code> — Column
            definitions array
          </div>
          <div>
            <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>rowData</code> — Data array
          </div>
          <div>
            <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>storageKey</code> — Unique
            key for persisting column state
          </div>
        </div>
      </SpecimenCard>
    </ShowcaseShell>
  )
}
