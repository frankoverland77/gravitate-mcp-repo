import { useMemo } from 'react'
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { ColDef } from 'ag-grid-community'

const customerNames = [
  'Metro Petroleum',
  'Greenfield Fuels',
  'Coastal Supply Co',
  'Northeast Distributors',
  'Acme Energy',
  'Harbor Fuel Services',
  'Tri-State Petroleum',
  'Atlantic Fuel Corp',
  'Empire Gas & Oil',
  'Liberty Fuel Inc',
]

type CustomerRow = {
  customer: string
  avg7d: number
  yesterday: number
  today: number
  pctOfAvg: number
}

function generateCustomerData(): CustomerRow[] {
  return customerNames.map(name => {
    const avg7d = Math.round(2000 + Math.random() * 8000)
    const yesterday = Math.round(avg7d * (0.6 + Math.random() * 0.8))
    const today = Math.round(avg7d * (0.4 + Math.random() * 1.0))
    return {
      customer: name,
      avg7d,
      yesterday,
      today,
      pctOfAvg: +(today / avg7d * 100).toFixed(1),
    }
  })
}

export function CustomerLiftingsGrid() {
  const rowData = useMemo(() => generateCustomerData(), [])

  const totals = useMemo(() => {
    const totalAvg = rowData.reduce((s, r) => s + r.avg7d, 0)
    const totalYesterday = rowData.reduce((s, r) => s + r.yesterday, 0)
    const totalToday = rowData.reduce((s, r) => s + r.today, 0)
    return { avg7d: totalAvg, yesterday: totalYesterday, today: totalToday, pctOfAvg: +(totalToday / totalAvg * 100).toFixed(1) }
  }, [rowData])

  const columnDefs: ColDef[] = [
    { field: 'customer', headerName: 'Customer', width: 160 },
    { field: 'avg7d', headerName: '7d Avg', width: 90, valueFormatter: p => p.value?.toLocaleString() },
    { field: 'yesterday', headerName: 'Yesterday', width: 90, valueFormatter: p => p.value?.toLocaleString() },
    {
      field: 'today',
      headerName: 'Today',
      width: 90,
      valueFormatter: p => p.value?.toLocaleString(),
      cellStyle: (p: any) => {
        const pct = p.data?.pctOfAvg || 0
        if (pct >= 90) return { color: '#16a34a', fontWeight: 600 }
        if (pct >= 70) return { color: '#ca8a04', fontWeight: 500 }
        return { color: '#dc2626', fontWeight: 500 }
      },
    },
    {
      field: 'pctOfAvg',
      headerName: '% of Avg',
      width: 90,
      valueFormatter: p => `${p.value}%`,
      cellStyle: (p: any) => {
        const val = p.value || 0
        if (val >= 90) return { color: '#16a34a', fontWeight: 600 }
        if (val >= 70) return { color: '#ca8a04', fontWeight: 500 }
        return { color: '#dc2626', fontWeight: 500 }
      },
    },
  ]

  return (
    <Vertical height="100%">
      <Horizontal gap={16} style={{ padding: '8px 12px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
        <Horizontal gap={6} alignItems="center">
          <Texto appearance="medium" style={{ fontSize: 11 }}>Total 7d Avg</Texto>
          <Texto weight="700" style={{ fontSize: 13 }}>{totals.avg7d.toLocaleString()}</Texto>
        </Horizontal>
        <Horizontal gap={6} alignItems="center">
          <Texto appearance="medium" style={{ fontSize: 11 }}>Yesterday</Texto>
          <Texto weight="700" style={{ fontSize: 13 }}>{totals.yesterday.toLocaleString()}</Texto>
        </Horizontal>
        <Horizontal gap={6} alignItems="center">
          <Texto appearance="medium" style={{ fontSize: 11 }}>Today</Texto>
          <Texto weight="700" style={{ fontSize: 13 }}>{totals.today.toLocaleString()}</Texto>
        </Horizontal>
        <Horizontal gap={6} alignItems="center">
          <Texto appearance="medium" style={{ fontSize: 11 }}>% of Avg</Texto>
          <Texto weight="700" style={{ fontSize: 13 }}>{totals.pctOfAvg}%</Texto>
        </Horizontal>
      </Horizontal>
      <div style={{ flex: 1 }}>
        <GraviGrid
          agPropOverrides={{
            columnDefs,
            rowData,
            defaultColDef: { sortable: true, resizable: true },
            headerHeight: 28,
            rowHeight: 28,
          }}
        />
      </div>
    </Vertical>
  )
}
