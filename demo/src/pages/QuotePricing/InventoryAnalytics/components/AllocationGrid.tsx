import { useState, useMemo } from 'react'
import { GraviGrid, Horizontal, GraviButton } from '@gravitate-js/excalibrr'
import { SwapOutlined } from '@ant-design/icons'
import type { ColDef, ColGroupDef } from 'ag-grid-community'

interface AllocationGridProps {
  productName: string
}

type AllocationRow = {
  allocationName: string
  monthlyForecast: number
  monthlyScale: number
  monthlyLiftings: number
  monthlyStatus: string
  monthlyTdForecast: number
  monthlyTdPct: number
  weeklyForecast: number
  weeklyScale: number
  weeklyLiftings: number
  weeklyStatus: string
  weeklyTdForecast: number
  weeklyTdPct: number
  dailyForecast: number
  dailyScale: number
  dailyLiftings: number
  dailyStatus: string
  dailyTdForecast: number
  dailyTdPct: number
}

function generateAllocations(productName: string): AllocationRow[] {
  const suffixes = ['Primary', 'Spot', 'Contract']
  return suffixes.map(suffix => ({
    allocationName: `${productName} - ${suffix}`,
    monthlyForecast: Math.round(40000 + Math.random() * 30000),
    monthlyScale: +(80 + Math.random() * 20).toFixed(1),
    monthlyLiftings: Math.round(30000 + Math.random() * 20000),
    monthlyStatus: Math.random() > 0.3 ? 'On Track' : 'Behind',
    monthlyTdForecast: Math.round(15000 + Math.random() * 10000),
    monthlyTdPct: +(50 + Math.random() * 50).toFixed(1),
    weeklyForecast: Math.round(10000 + Math.random() * 8000),
    weeklyScale: +(75 + Math.random() * 25).toFixed(1),
    weeklyLiftings: Math.round(7000 + Math.random() * 5000),
    weeklyStatus: Math.random() > 0.4 ? 'On Track' : 'Behind',
    weeklyTdForecast: Math.round(4000 + Math.random() * 3000),
    weeklyTdPct: +(40 + Math.random() * 60).toFixed(1),
    dailyForecast: Math.round(1500 + Math.random() * 1000),
    dailyScale: +(70 + Math.random() * 30).toFixed(1),
    dailyLiftings: Math.round(1000 + Math.random() * 800),
    dailyStatus: Math.random() > 0.5 ? 'On Track' : 'Behind',
    dailyTdForecast: Math.round(500 + Math.random() * 500),
    dailyTdPct: +(30 + Math.random() * 70).toFixed(1),
  }))
}

function makePeriodGroup(prefix: string, label: string): ColGroupDef {
  return {
    headerName: label,
    children: [
      { field: `${prefix}Forecast`, headerName: 'Forecast', width: 90, valueFormatter: p => p.value?.toLocaleString() },
      { field: `${prefix}Scale`, headerName: 'Scale%', width: 70, valueFormatter: p => `${p.value}%` },
      { field: `${prefix}Liftings`, headerName: 'Liftings', width: 90, valueFormatter: p => p.value?.toLocaleString() },
      {
        field: `${prefix}Status`,
        headerName: 'Status',
        width: 80,
        cellStyle: (p: any) => ({
          color: p.value === 'On Track' ? '#16a34a' : '#dc2626',
          fontWeight: 500,
        }),
      },
      { field: `${prefix}TdForecast`, headerName: 'TD Forecast', width: 95, valueFormatter: p => p.value?.toLocaleString() },
      { field: `${prefix}TdPct`, headerName: 'TD% Fcst', width: 80, valueFormatter: p => `${p.value}%` },
    ],
  }
}

export function AllocationGrid({ productName }: AllocationGridProps) {
  const [transposed, setTransposed] = useState(false)
  const rowData = useMemo(() => generateAllocations(productName), [productName])

  const columnDefs: (ColDef | ColGroupDef)[] = useMemo(() => {
    if (transposed) {
      // Simple transposed view: period as rows, allocation names as columns
      const cols: ColDef[] = [
        { field: 'metric', headerName: 'Metric', width: 120, pinned: 'left' },
      ]
      rowData.forEach(row => {
        cols.push({ field: row.allocationName, headerName: row.allocationName, width: 130 })
      })
      return cols
    }
    return [
      { field: 'allocationName', headerName: 'Allocation Name', width: 180, pinned: 'left' },
      makePeriodGroup('monthly', 'Monthly'),
      makePeriodGroup('weekly', 'Weekly'),
      makePeriodGroup('daily', 'Daily'),
    ]
  }, [transposed, rowData])

  const displayData = useMemo(() => {
    if (!transposed) return rowData
    const metrics = ['Forecast', 'Scale%', 'Liftings', 'Status', 'TD Forecast', 'TD% Fcst']
    const periods = ['monthly', 'weekly', 'daily']
    const rows: any[] = []
    periods.forEach(period => {
      metrics.forEach(metric => {
        const row: any = { metric: `${period.charAt(0).toUpperCase() + period.slice(1)} ${metric}` }
        const fieldKey = `${period}${metric.replace(/[% ]/g, '')}` as keyof AllocationRow
        rowData.forEach(r => {
          row[r.allocationName] = r[fieldKey]
        })
        rows.push(row)
      })
    })
    return rows
  }, [transposed, rowData])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Horizontal justifyContent="flex-end" style={{ padding: '4px 8px' }}>
        <GraviButton
          buttonText={transposed ? 'Normal View' : 'Transpose'}
          icon={<SwapOutlined />}
          onClick={() => setTransposed(v => !v)}
        />
      </Horizontal>
      <div style={{ flex: 1 }}>
        <GraviGrid
          agPropOverrides={{
            columnDefs,
            rowData: displayData,
            defaultColDef: { sortable: true, resizable: true },
            headerHeight: 28,
            rowHeight: 28,
          }}
        />
      </div>
    </div>
  )
}
