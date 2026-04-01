/**
 * Column definitions for Global Tiered Pricing grid
 */

import type { ColDef, ValueFormatterParams, ValueGetterParams, ValueParserParams, CellClassParams } from 'ag-grid-community'
import { message } from 'antd'
import { CheckboxColumn } from '../../components/shared/Grid/sharedColumnDefs/CheckboxColumn'
import type { TieredPricingRow } from './GlobalTieredPricing.types'

function formatPrice(value: number): string {
  return value !== null && value !== undefined ? `$${value.toFixed(4)}` : ''
}

function parsePrice(value: string | number): number {
  if (typeof value === 'number') return value
  return parseFloat(value.replace('$', '').replace(',', ''))
}

interface TierColumnConfig {
  autoCalculate: boolean
  calculateTier2: (tier1: number) => number
  calculateTier3: (tier2: number) => number
}

export function getColumnDefs(config: TierColumnConfig): ColDef<TieredPricingRow>[] {
  const { autoCalculate, calculateTier2, calculateTier3 } = config

  return [
    CheckboxColumn('checkbox'),
    {
      field: 'location',
      headerName: 'LOCATION',
      width: 200,
      sortable: true,
      filter: true,
    },
    {
      field: 'product',
      headerName: 'PRODUCT',
      width: 250,
      sortable: true,
      filter: true,
    },
    {
      field: 'tier1',
      headerName: 'TIER 1',
      width: 150,
      sortable: true,
      filter: true,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        precision: 4,
        step: 0.0001,
        min: 0,
      },
      valueFormatter: (params: ValueFormatterParams<TieredPricingRow>) => formatPrice(params.value),
      valueParser: (params: ValueParserParams<TieredPricingRow>) => {
        const parsed = parsePrice(params.newValue)
        if (parsed < 0) {
          message.error('Tier values must be positive')
          return params.data?.tier1
        }
        return parsed
      },
    },
    {
      field: 'tier2',
      headerName: 'TIER 2',
      width: 150,
      sortable: true,
      filter: true,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        precision: 4,
        step: 0.0001,
        min: 0,
      },
      valueGetter: (params: ValueGetterParams<TieredPricingRow>) => {
        if (!params.data) return null
        if (!autoCalculate) {
          return params.data.tier2 !== null ? params.data.tier2 : params.data.tier1
        }
        if (params.data.tier2Override && params.data.tier2 !== null) {
          return params.data.tier2
        }
        return calculateTier2(params.data.tier1)
      },
      valueFormatter: (params: ValueFormatterParams<TieredPricingRow>) => formatPrice(params.value),
      valueParser: (params: ValueParserParams<TieredPricingRow>) => {
        const parsed = parsePrice(params.newValue)
        if (parsed < 0) {
          message.error('Tier values must be positive')
          return params.data?.tier2
        }
        if (params.data && parsed <= params.data.tier1) {
          message.warning('Tier 2 should be greater than Tier 1')
        }
        return parsed
      },
      cellClass: (params: CellClassParams<TieredPricingRow>) => {
        if (autoCalculate && params.data && !params.data.tier2Override) {
          return 'tiered-pricing-calculated-cell'
        }
        return ''
      },
    },
    {
      field: 'tier3',
      headerName: 'TIER 3',
      width: 150,
      sortable: true,
      filter: true,
      type: 'rightAligned',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        precision: 4,
        step: 0.0001,
        min: 0,
      },
      valueGetter: (params: ValueGetterParams<TieredPricingRow>) => {
        if (!params.data) return null
        if (!autoCalculate) {
          const tier2Value = params.data.tier2 !== null ? params.data.tier2 : params.data.tier1
          return params.data.tier3 !== null ? params.data.tier3 : tier2Value
        }
        if (params.data.tier3Override && params.data.tier3 !== null) {
          return params.data.tier3
        }
        const tier2Value = params.data.tier2Override ? params.data.tier2 : calculateTier2(params.data.tier1)
        return calculateTier3(tier2Value as number)
      },
      valueFormatter: (params: ValueFormatterParams<TieredPricingRow>) => formatPrice(params.value),
      valueParser: (params: ValueParserParams<TieredPricingRow>) => {
        const parsed = parsePrice(params.newValue)
        if (parsed < 0) {
          message.error('Tier values must be positive')
          return params.data?.tier3
        }
        if (params.data) {
          const tier2Value = params.data.tier2Override ? params.data.tier2 : calculateTier2(params.data.tier1)
          if (tier2Value !== null && parsed <= tier2Value) {
            message.warning('Tier 3 should be greater than Tier 2')
          }
        }
        return parsed
      },
      cellClass: (params: CellClassParams<TieredPricingRow>) => {
        if (autoCalculate && params.data && !params.data.tier3Override) {
          return 'tiered-pricing-calculated-cell'
        }
        return ''
      },
    },
  ]
}