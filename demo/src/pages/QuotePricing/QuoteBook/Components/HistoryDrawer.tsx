import { Drawer } from 'antd'
import { Vertical, Horizontal, Texto, GraviGrid } from '@gravitate-js/excalibrr'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ColDef } from 'ag-grid-community'

const mockHistoryChartData = [
  { date: 'Jan 20', price: 2.8200 },
  { date: 'Jan 21', price: 2.8350 },
  { date: 'Jan 22', price: 2.8100 },
  { date: 'Jan 23', price: 2.8540 },
  { date: 'Jan 24', price: 2.8600 },
  { date: 'Jan 27', price: 2.8750 },
  { date: 'Jan 28', price: 2.8900 },
]

const mockHistoryRows = [
  { date: 'Jan 28', diff: -0.0150, price: 2.8900, publishedBy: 'J. Smith', period: 'EOD' },
  { date: 'Jan 27', diff: -0.0200, price: 2.8750, publishedBy: 'J. Smith', period: 'EOD' },
  { date: 'Jan 24', diff: -0.0200, price: 2.8600, publishedBy: 'M. Johnson', period: 'EOD' },
  { date: 'Jan 23', diff: -0.0250, price: 2.8540, publishedBy: 'M. Johnson', period: 'EOD' },
]

const historyColumnDefs: ColDef[] = [
  { field: 'date', headerName: 'Date', width: 100 },
  { field: 'diff', headerName: 'Diff', width: 90, valueFormatter: ({ value }) => value?.toFixed(4) },
  { field: 'price', headerName: 'Price', width: 100, valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '' },
  { field: 'publishedBy', headerName: 'Published By', width: 130 },
  { field: 'period', headerName: 'Period', width: 80 },
]

interface HistoryDrawerProps {
  open: boolean
  onClose: () => void
}

export function HistoryDrawer({ open, onClose }: HistoryDrawerProps) {
  return (
    <Drawer
      title="Quote History — Diesel #2 / Houston Term."
      open={open}
      placement="bottom"
      height="70vh"
      onClose={onClose}
      styles={{ body: { padding: 0, display: 'flex', height: '100%' } }}
    >
      <Horizontal style={{ height: '100%' }}>
        <Vertical flex="2" style={{ padding: 16, borderRight: '1px solid var(--gray-200)' }}>
          <Texto category="h5">Price History</Texto>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockHistoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="var(--theme-color-1)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Vertical>
        <Vertical flex="3">
          <GraviGrid
            rowData={mockHistoryRows}
            columnDefs={historyColumnDefs}
            agPropOverrides={{}}
            storageKey="quotebook-history-grid"
            controlBarProps={{ title: 'Price History', hideActiveFilters: true }}
          />
        </Vertical>
      </Horizontal>
    </Drawer>
  )
}
