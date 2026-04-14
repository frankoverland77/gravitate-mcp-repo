import { useMemo } from 'react'
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { ColDef } from 'ag-grid-community'

interface RackRankingsGridProps {
  productName: string
}

type RackRow = {
  rank: number
  competitor: string
  pub: string
  price: number
  delta: number
  chg: number
  osp: number
  isYou: boolean
}

const competitors = ['PBF Energy', 'BP', 'ExxonMobil', 'Shell', 'Sunoco', 'You']

function generateRankings(productName: string): RackRow[] {
  const basePrice = productName.includes('ULSD') ? 2.78 : productName.includes('Premium') ? 2.95 : 2.65
  const rows: RackRow[] = competitors.map((comp, i) => {
    const offset = (i - 2) * 0.012 + (Math.random() - 0.5) * 0.008
    const price = +(basePrice + offset).toFixed(4)
    return {
      rank: 0,
      competitor: comp,
      pub: comp === 'You' ? 'OPIS' : ['OPIS', 'Platts', 'Argus'][i % 3],
      price,
      delta: +((Math.random() - 0.5) * 0.02).toFixed(4),
      chg: +((Math.random() - 0.5) * 0.015).toFixed(4),
      osp: +(price + (Math.random() - 0.5) * 0.005).toFixed(4),
      isYou: comp === 'You',
    }
  })
  rows.sort((a, b) => a.price - b.price)
  rows.forEach((r, i) => { r.rank = i + 1 })
  return rows
}

export function RackRankingsGrid({ productName }: RackRankingsGridProps) {
  const rowData = useMemo(() => generateRankings(productName), [productName])

  const yourRow = rowData.find(r => r.isYou)
  const prices = rowData.map(r => r.price)
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  const avg = +(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(4)

  const columnDefs: ColDef[] = [
    { field: 'rank', headerName: '#', width: 50 },
    { field: 'competitor', headerName: 'Competitor', width: 120, cellStyle: (p: any) => p.data?.isYou ? { fontWeight: 700, color: 'var(--theme-color-1)' } : {} },
    { field: 'pub', headerName: 'Pub', width: 70 },
    { field: 'price', headerName: 'Price', width: 90, valueFormatter: p => p.value?.toFixed(4) },
    {
      field: 'delta',
      headerName: 'Delta',
      width: 80,
      valueFormatter: p => (p.value > 0 ? '+' : '') + p.value?.toFixed(4),
      cellStyle: (p: any) => ({ color: p.value >= 0 ? '#16a34a' : '#dc2626', fontWeight: 500 }),
    },
    {
      field: 'chg',
      headerName: 'Chg',
      width: 80,
      valueFormatter: p => (p.value > 0 ? '+' : '') + p.value?.toFixed(4),
      cellStyle: (p: any) => ({ color: p.value >= 0 ? '#16a34a' : '#dc2626' }),
    },
    { field: 'osp', headerName: 'OSP', width: 90, valueFormatter: p => p.value?.toFixed(4) },
  ]

  return (
    <Vertical height="100%">
      <Horizontal gap={16} style={{ padding: '8px 12px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
        {[
          { label: 'Low', value: low.toFixed(4), color: '#16a34a' },
          { label: 'Avg', value: avg.toFixed(4), color: 'var(--gray-600)' },
          { label: 'High', value: high.toFixed(4), color: '#dc2626' },
          { label: 'You', value: yourRow?.price.toFixed(4) || '-', color: 'var(--theme-color-1)' },
        ].map(m => (
          <Horizontal key={m.label} gap={6} alignItems="center">
            <Texto appearance="medium" style={{ fontSize: 11 }}>{m.label}</Texto>
            <Texto weight="700" style={{ fontSize: 13, color: m.color }}>{m.value}</Texto>
          </Horizontal>
        ))}
      </Horizontal>
      <div style={{ flex: 1 }}>
        <GraviGrid
          agPropOverrides={{
            columnDefs,
            rowData,
            defaultColDef: { sortable: true, resizable: true },
            headerHeight: 28,
            rowHeight: 28,
            getRowStyle: (params: any) => params.data?.isYou ? { background: 'rgba(59, 130, 246, 0.08)' } : undefined,
          }}
        />
      </div>
    </Vertical>
  )
}
