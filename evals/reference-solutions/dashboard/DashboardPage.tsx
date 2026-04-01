import React, { useMemo } from 'react'
import { GraviGrid, Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import type { ColDef } from 'ag-grid-community'
import { ArrowUpOutlined, ArrowDownOutlined, PlusOutlined } from '@ant-design/icons'

interface MetricCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
}

function MetricCard({ title, value, change, isPositive }: MetricCardProps) {
  const color = isPositive ? '#059669' : '#dc2626'
  const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined

  return (
    <Vertical
      flex='1'
      className='p-3 border-radius-5'
      style={{
        backgroundColor: 'var(--theme-bg-elevated)',
        border: '1px solid var(--theme-border-color)',
      }}
    >
      <Texto category='p2' appearance='medium'>{title}</Texto>
      <Texto category='h2' weight='700'>{value}</Texto>
      <Horizontal gap={4} alignItems='center'>
        <Icon style={{ color, fontSize: 12 }} />
        <Texto category='p2' style={{ color }}>{change}</Texto>
        <Texto category='p2' appearance='medium'>vs last month</Texto>
      </Horizontal>
    </Vertical>
  )
}

const recentActivity = [
  { id: '1', action: 'Contract Created', entity: 'Valero ULSD Forward', user: 'J. Rivera', date: '2026-03-28' },
  { id: '2', action: 'Price Updated', entity: 'Marathon Heating Oil', user: 'M. Chen', date: '2026-03-28' },
  { id: '3', action: 'Delivery Confirmed', entity: 'Sprague E85 Spot', user: 'A. Patel', date: '2026-03-27' },
  { id: '4', action: 'Contract Renewed', entity: 'Global Partners ULSD', user: 'J. Rivera', date: '2026-03-27' },
  { id: '5', action: 'Price Updated', entity: 'Valero Gasoline Rack', user: 'S. Kim', date: '2026-03-26' },
  { id: '6', action: 'Delivery Scheduled', entity: 'Marathon ULSD Forward', user: 'M. Chen', date: '2026-03-26' },
  { id: '7', action: 'Contract Created', entity: 'Sprague Heating Oil', user: 'A. Patel', date: '2026-03-25' },
  { id: '8', action: 'Issue Resolved', entity: 'Albany Terminal Outage', user: 'S. Kim', date: '2026-03-25' },
  { id: '9', action: 'Price Updated', entity: 'Global Partners E85', user: 'J. Rivera', date: '2026-03-24' },
  { id: '10', action: 'Delivery Confirmed', entity: 'Valero ULSD Spot', user: 'M. Chen', date: '2026-03-24' },
]

export function DashboardPage() {
  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'action', headerName: 'Action', flex: 1, sortable: true },
    { field: 'entity', headerName: 'Entity', flex: 1.5, sortable: true },
    { field: 'user', headerName: 'User', width: 130, sortable: true },
    { field: 'date', headerName: 'Date', width: 130, sortable: true },
  ], [])

  const controlBarProps = useMemo(() => ({
    title: 'Recent Activity',
    actionButtons: (
      <GraviButton buttonText='New Contract' theme1 icon={<PlusOutlined />} />
    ),
  }), [])

  return (
    <Vertical flex='1' gap={24} className='p-3'>
      <Horizontal gap={16}>
        <MetricCard title='Total Revenue' value='$2.4M' change='+8.2%' isPositive />
        <MetricCard title='Active Contracts' value='847' change='+3.1%' isPositive />
        <MetricCard title='Deliveries' value='12,340' change='-1.4%' isPositive={false} />
        <MetricCard title='Open Issues' value='23' change='-15%' isPositive />
      </Horizontal>

      <Vertical flex='1'>
        <GraviGrid
          rowData={recentActivity}
          columnDefs={columnDefs}
          agPropOverrides={{}}
          storageKey='dashboard-activity-ref'
          controlBarProps={controlBarProps}
        />
      </Vertical>
    </Vertical>
  )
}
