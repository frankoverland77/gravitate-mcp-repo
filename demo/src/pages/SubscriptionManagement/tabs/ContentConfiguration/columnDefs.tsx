// Column definitions for Content Configuration grid

import { Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import dayjs from 'dayjs'

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  return dayjs(value).format('MMM D, YYYY h:mm A')
}

export function getColumnDefs(): ColDef[] {
  return [
    {
      headerName: 'Quote Configuration',
      field: 'QuoteConfigName',
      minWidth: 250,
      flex: 1,
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName: 'Email Subject Template',
      field: 'EmailSubject',
      minWidth: 280,
      flex: 1,
      cellRenderer: (params: { value: string }) => {
        return (
          <Texto category='p2' style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            {params.value}
          </Texto>
        )
      },
    },
    {
      headerName: 'Email Body Template',
      field: 'EmailBody',
      minWidth: 300,
      flex: 1,
      cellRenderer: (params: { value: string }) => {
        // Truncate for display and replace newlines with spaces
        const truncated = params.value?.replace(/\n/g, ' ').substring(0, 100) + (params.value?.length > 100 ? '...' : '')
        return (
          <Texto category='p2' style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            {truncated}
          </Texto>
        )
      },
    },
    {
      headerName: 'Last Modified',
      field: 'LastModified',
      minWidth: 170,
      cellRenderer: (params: { value: string | null }) => {
        return formatDateTime(params.value)
      },
    },
    {
      headerName: 'Modified By',
      field: 'ModifiedBy',
      minWidth: 130,
      cellRenderer: (params: { value: string | null }) => {
        return params.value || '-'
      },
    },
  ]
}
