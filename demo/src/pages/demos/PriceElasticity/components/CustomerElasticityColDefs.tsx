import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { CustomerElasticityRow } from '../data/elasticity.types'
import { getSensitivityColor, formatPricePosition, numberToShortString } from '../data/elasticity.data'

export function getCustomerElasticityColDefs(): ColDef<CustomerElasticityRow>[] {
  return [
    {
      field: 'counterParty',
      headerName: 'Customer',
      flex: 2,
      minWidth: 160,
      cellRenderer: (params: ICellRendererParams<CustomerElasticityRow>) => {
        if (!params.data) return null
        return (
          <Horizontal alignItems="center" style={{ gap: '8px' }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: 'var(--theme-color-1, #0C5A58)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {(params.node?.rowIndex ?? 0) + 1}
            </div>
            <Texto category="p2" weight="500">
              {params.value}
            </Texto>
          </Horizontal>
        )
      },
    },
    {
      field: 'counterPartyTotalQuantity',
      headerName: 'Volume',
      width: 90,
      cellRenderer: (params: ICellRendererParams<CustomerElasticityRow>) => {
        if (!params.value) return null
        return (
          <Texto category="p2" weight="500">
            {numberToShortString(params.value)}
          </Texto>
        )
      },
    },
    {
      field: 'avgInvoicedMargin',
      headerName: 'Inv Margin',
      width: 100,
      cellRenderer: (params: ICellRendererParams<CustomerElasticityRow>) => {
        if (params.value === null || params.value === undefined) return null
        return (
          <Texto category="p2" style={{ textAlign: 'right', width: '100%', display: 'block' }}>
            ${params.value.toFixed(4)}
          </Texto>
        )
      },
    },
    {
      field: 'sharePercentage',
      headerName: 'Share',
      width: 80,
      cellRenderer: (params: ICellRendererParams<CustomerElasticityRow>) => {
        if (params.value === null || params.value === undefined) return null
        return (
          <Horizontal alignItems="center" style={{ gap: '6px', width: '100%' }}>
            <div
              style={{
                flex: 1,
                height: 6,
                backgroundColor: '#f0f0f0',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, params.value)}%`,
                  height: '100%',
                  backgroundColor: 'var(--theme-color-1, #0C5A58)',
                  borderRadius: 3,
                }}
              />
            </div>
            <Texto category="p2" appearance="medium" style={{ fontSize: '11px', minWidth: 30, textAlign: 'right' }}>
              {params.value.toFixed(1)}%
            </Texto>
          </Horizontal>
        )
      },
    },
    {
      field: 'sensitivityRating',
      headerName: 'Sensitivity',
      width: 110,
      cellRenderer: (params: ICellRendererParams<CustomerElasticityRow>) => {
        if (!params.data) return null
        const color = getSensitivityColor(params.data.sensitivityRating)
        return (
          <Horizontal alignItems="center" style={{ gap: '6px' }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
            <Texto category="p2" weight="500" style={{ color, textTransform: 'capitalize' }}>
              {params.data.sensitivityRating}
            </Texto>
          </Horizontal>
        )
      },
    },
    {
      field: 'elasticityCoefficient',
      headerName: 'Elasticity',
      width: 90,
      cellRenderer: (params: ICellRendererParams<CustomerElasticityRow>) => {
        if (params.value === null || params.value === undefined) return null
        return (
          <Texto category="p2" weight="500" style={{ textAlign: 'right', width: '100%', display: 'block' }}>
            {params.value.toFixed(2)}
          </Texto>
        )
      },
    },
    {
      field: 'cliffThreshold',
      headerName: 'Cliff',
      width: 80,
      cellRenderer: (params: ICellRendererParams<CustomerElasticityRow>) => {
        if (params.value === null || params.value === undefined) return null
        return (
          <Texto category="p2" appearance="error" style={{ textAlign: 'right', width: '100%', display: 'block' }}>
            {formatPricePosition(params.value)}
          </Texto>
        )
      },
    },
    {
      field: 'currentPricePosition',
      headerName: 'Current',
      width: 80,
      cellRenderer: (params: ICellRendererParams<CustomerElasticityRow>) => {
        if (!params.data) return null
        const isNearCliff = params.data.currentPricePosition >= params.data.cliffThreshold - 0.01
        const color = isNearCliff ? '#ff4d4f' : undefined
        return (
          <Texto category="p2" weight="600" style={{ textAlign: 'right', width: '100%', display: 'block', color }}>
            {formatPricePosition(params.data.currentPricePosition)}
          </Texto>
        )
      },
    },
  ]
}
