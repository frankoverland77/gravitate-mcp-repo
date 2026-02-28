/**
 * Tax Management Column Definitions
 *
 * AG Grid column definitions for the fuel excise tax rate management grid.
 * Columns: Tax Level | Jurisdiction | State | Commodity | Rate Per Gallon | Effective | Expiration | Active
 */

import type { ColDef, ColGroupDef } from 'ag-grid-community'

const rateFormatter = (params: any) => {
  if (params.value == null) return ''
  return `$${Number(params.value).toFixed(4)}`
}

export function getTaxManagementColumnDefs(): (ColDef | ColGroupDef)[] {
  return [
    {
      headerName: 'Jurisdiction',
      marryChildren: true,
      children: [
        {
          field: 'TaxLevel',
          headerName: 'Tax Level',
          filter: true,
          rowGroup: true,
          rowGroupIndex: 0,
          hide: true,
          sort: 'asc' as const,
          flex: 1,
          minWidth: 140,
          cellRenderer: (params: any) => {
            if (!params.value) return null
            const colorMap: Record<string, { color: string; bg: string }> = {
              Federal: { color: '#722ed1', bg: 'rgba(114, 46, 209, 0.08)' },
              State: { color: '#1890ff', bg: 'rgba(24, 144, 255, 0.08)' },
              Local: { color: '#fa8c16', bg: 'rgba(250, 140, 22, 0.08)' },
            }
            const style = colorMap[params.value] ?? { color: '#595959', bg: '#f5f5f5' }
            return (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: style.color,
                  backgroundColor: style.bg,
                  padding: '1px 6px',
                  borderRadius: 3,
                  lineHeight: '18px',
                }}
              >
                {params.value}
              </span>
            )
          },
        },
        {
          field: 'Jurisdiction',
          headerName: 'Jurisdiction',
          filter: true,
          flex: 1,
          minWidth: 160,
        },
        {
          field: 'State',
          headerName: 'State',
          filter: true,
          width: 90,
          valueFormatter: (params: any) => params.value ?? '—',
        },
      ],
    },
    {
      headerName: 'Rate',
      marryChildren: true,
      children: [
        {
          field: 'Commodity',
          headerName: 'Commodity',
          filter: true,
          width: 120,
          cellRenderer: (params: any) => {
            if (!params.value) return null
            const isGasoline = params.value === 'Gasoline'
            return (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: isGasoline ? '#389e0d' : '#1890ff',
                  backgroundColor: isGasoline ? 'rgba(56, 158, 13, 0.08)' : 'rgba(24, 144, 255, 0.08)',
                  padding: '1px 6px',
                  borderRadius: 3,
                  lineHeight: '18px',
                }}
              >
                {params.value}
              </span>
            )
          },
        },
        {
          field: 'RatePerGallon',
          headerName: 'Rate / Gal',
          filter: 'agNumberColumnFilter',
          valueFormatter: rateFormatter,
          editable: true,
          type: 'rightAligned',
          width: 120,
          cellStyle: () => ({ fontWeight: 'bold' }),
        },
      ],
    },
    {
      headerName: 'Validity',
      marryChildren: true,
      children: [
        {
          field: 'EffectiveDate',
          headerName: 'Effective',
          filter: true,
          width: 120,
        },
        {
          field: 'ExpirationDate',
          headerName: 'Expiration',
          filter: true,
          width: 120,
          valueFormatter: (params: any) => params.value ?? 'Open',
        },
        {
          field: 'IsActive',
          headerName: 'Active',
          filter: true,
          width: 90,
          cellRenderer: (params: any) => {
            if (params.value == null) return null
            return (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: params.value ? '#389e0d' : '#8c8c8c',
                  backgroundColor: params.value ? 'rgba(56, 158, 13, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  padding: '1px 6px',
                  borderRadius: 3,
                  lineHeight: '18px',
                }}
              >
                {params.value ? 'Active' : 'Inactive'}
              </span>
            )
          },
        },
      ],
    },
  ]
}
