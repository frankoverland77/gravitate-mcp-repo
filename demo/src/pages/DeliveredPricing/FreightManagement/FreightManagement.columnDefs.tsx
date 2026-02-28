/**
 * Freight Management Column Definitions
 *
 * AG Grid column definitions for the carrier lane rate management grid.
 * Columns: Carrier | Origin | Destination | Commodity | Rate (CPG) | Effective | Expiration | Active
 */

import type { ColDef, ColGroupDef } from 'ag-grid-community'

const rateFormatter = (params: any) => {
  if (params.value == null) return ''
  return `$${Number(params.value).toFixed(4)}`
}

export function getFreightManagementColumnDefs(): (ColDef | ColGroupDef)[] {
  return [
    {
      headerName: 'Lane',
      marryChildren: true,
      children: [
        {
          field: 'CarrierName',
          headerName: 'Carrier',
          filter: true,
          rowGroup: true,
          rowGroupIndex: 0,
          hide: true,
          sort: 'asc' as const,
          flex: 1,
          minWidth: 160,
        },
        {
          field: 'OriginLocationName',
          headerName: 'Origin',
          filter: true,
          rowGroup: true,
          rowGroupIndex: 1,
          hide: true,
          sort: 'asc' as const,
          flex: 1,
          minWidth: 160,
        },
        {
          field: 'OriginState',
          headerName: 'Origin State',
          filter: true,
          width: 100,
        },
        {
          field: 'DestinationLocationName',
          headerName: 'Destination',
          filter: true,
          flex: 1,
          minWidth: 160,
        },
        {
          field: 'DestinationState',
          headerName: 'Dest State',
          filter: true,
          width: 100,
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
          field: 'Rate',
          headerName: 'Rate',
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
