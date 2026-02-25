import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { DeliveredPricingQuoteRow } from '../DeliveredPricing.data'
import type { SupplyOptionRow } from '../supplyOptions.data'
import { SupplyOptionsView } from './SupplyOptionsView'

interface DeliveredPricingAnalyticsProps {
  selectedRow: DeliveredPricingQuoteRow | null
  activeSupplyOptionIds?: number[]
  /** The supply option ID that the current strategy would auto-select */
  strategyDefaultId?: number | null
  onSupplyOptionsSelected?: (rows: SupplyOptionRow[]) => void
}

export function DeliveredPricingAnalytics({
  selectedRow,
  activeSupplyOptionIds,
  strategyDefaultId,
  onSupplyOptionsSelected,
}: DeliveredPricingAnalyticsProps) {
  if (!selectedRow) {
    return (
      <Vertical className="bg-1 bordered" style={{ height: '100%' }}>
        <Horizontal className="px-4 py-2 bordered" verticalCenter>
          <Texto category="h5">Delivered Pricing Analytics</Texto>
        </Horizontal>
        <Vertical
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Texto style={{ color: '#8c8c8c' }}>
            Select a quote row in the grid to view analytics
          </Texto>
        </Vertical>
      </Vertical>
    )
  }

  return (
    <Vertical className="bg-1 bordered" style={{ height: '100%' }}>
      {/* Header */}
      <Horizontal className="px-4 py-2 bordered" verticalCenter>
        <Texto category="h5">Delivered Pricing Analytics</Texto>
        <Texto className="ml-4" style={{ color: '#8c8c8c' }}>
          {selectedRow.LocationName} → {selectedRow.DestinationLocationName} · {selectedRow.ProductName}
        </Texto>
        <Texto className="ml-4" style={{ color: 'var(--theme-primary, #1890ff)', fontStyle: 'italic' }}>
          Strategy: {selectedRow.Strategy}
        </Texto>
      </Horizontal>

      {/* Unified Supply Options + Volume Grid */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <SupplyOptionsView
          selectedRow={selectedRow}
          activeSupplyOptionIds={activeSupplyOptionIds}
          strategyDefaultId={strategyDefaultId}
          onSupplyOptionsSelected={onSupplyOptionsSelected}
        />
      </div>
    </Vertical>
  )
}
