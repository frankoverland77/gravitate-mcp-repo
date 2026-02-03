// Column definitions for Preview Notifications grid

import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import dayjs from 'dayjs'

const formatCurrency = (value: number | null): string => {
  if (value === null || value === undefined) return ''
  return `$${value.toFixed(4)}`
}

const formatDecimal = (value: number | null): string => {
  if (value === null || value === undefined) return ''
  return value.toFixed(4)
}

const formatDateTime = (value: string | null): string => {
  if (!value) return ''
  return dayjs(value).format('MMM D, YYYY h:mm A')
}

export function getColumnDefs(): ColDef[] {
  return [
    {
      headerName: '',
      field: 'QuoteConfigurationMappingId',
      maxWidth: 60,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      pinned: 'left',
      valueFormatter: () => '',
      filterValueGetter: (params) => {
        return params.node?.selected ? 'Selected' : 'Not Selected'
      },
      comparator: (_valueA, _valueB, nodeA) => {
        return nodeA?.selected ? -1 : 1
      },
    },
    {
      headerName: 'Quote Config',
      field: 'QuoteConfigName',
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: 'Location',
      field: 'LocationName',
      minWidth: 150,
    },
    {
      headerName: 'Product',
      field: 'ProductName',
      minWidth: 150,
    },
    {
      headerName: 'Effective',
      field: 'EffectiveTime',
      minWidth: 160,
      cellRenderer: (params: { value: string | null }) => {
        return params.value ? formatDateTime(params.value) : ''
      },
      filter: 'agDateColumnFilter',
    },
    {
      headerName: 'Price',
      field: 'Price',
      minWidth: 100,
      cellRenderer: (params: { value: number | null }) => {
        if (params.value === null || params.value === undefined) {
          return <Texto appearance='error'>(M)</Texto>
        }
        return formatCurrency(params.value)
      },
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Price Delta',
      field: 'PriceDelta',
      minWidth: 110,
      cellRenderer: (params: { value: number | null }) => {
        if (params.value === null || params.value === undefined) {
          return '-'
        }

        const value = params.value
        const isPositive = value > 0
        const color = isPositive ? 'var(--theme-success)' : value < 0 ? 'var(--theme-error)' : 'inherit'

        return (
          <span style={{ color }}>
            {isPositive ? '+' : ''}
            {formatDecimal(value)}
          </span>
        )
      },
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Customer Count',
      field: 'CustomerCount',
      minWidth: 140,
      cellRenderer: (params: { value: number }) => {
        const count = params.value || 0
        return (
          <Horizontal>
            <Texto appearance={count > 0 ? 'primary' : 'error'}>{count.toLocaleString()}</Texto>
          </Horizontal>
        )
      },
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'DTN Message',
      field: 'DTNSent',
      minWidth: 130,
      valueGetter: (params) => {
        return params.data?.DTNSent ? 'Sent' : 'Not Sent'
      },
      cellRenderer: (params: { data: { DTNSent: boolean } }) => {
        const dtnSent = params.data?.DTNSent
        return (
          <Horizontal>
            <BBDTag success={dtnSent} warning={!dtnSent}>
              {dtnSent ? 'Sent' : 'Not Sent'}
            </BBDTag>
          </Horizontal>
        )
      },
    },
    {
      headerName: 'Email',
      field: 'EmailSent',
      minWidth: 120,
      valueGetter: (params) => {
        return params.data?.EmailSent ? 'Sent' : 'Not Sent'
      },
      cellRenderer: (params: { data: { EmailSent: boolean } }) => {
        const emailSent = params.data?.EmailSent
        return (
          <Horizontal>
            <BBDTag success={emailSent} warning={!emailSent}>
              {emailSent ? 'Sent' : 'Not Sent'}
            </BBDTag>
          </Horizontal>
        )
      },
    },
    {
      headerName: 'Last Notification',
      field: 'LastNotificationTime',
      minWidth: 160,
      cellRenderer: (params: { value: string | null }) => {
        if (params.value) {
          return formatDateTime(params.value)
        }
        return '-'
      },
      filter: 'agDateColumnFilter',
    },
  ]
}
