import { useState, useMemo, useCallback } from 'react'
import { GraviGrid, Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import type { GridApi } from 'ag-grid-community'
import type { CustomerElasticityRow, SegmentationLevel } from '../data/elasticity.types'
import {
  MOCK_CUSTOMER_ROWS,
  MOCK_CUSTOMER_TOTALS,
  CUSTOMER_CURVE_PARAMS,
  PRODUCT_CURVE_PARAMS,
} from '../data/elasticity.data'
import { getCustomerElasticityColDefs } from './CustomerElasticityColDefs'
import { CompactTotalsHeader } from './CompactTotalsHeader'
import { ElasticityCurveChart } from './ElasticityCurveChart'
import { WhatIfPanel } from './WhatIfPanel'

export function CustomerElasticityView() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerElasticityRow | null>(null)
  const [whatIfPrice, setWhatIfPrice] = useState<number>(0.04)
  const [segmentation, setSegmentation] = useState<SegmentationLevel>('product-customer')
  const [gridApi, setGridApi] = useState<GridApi | null>(null)

  const columnDefs = useMemo(() => getCustomerElasticityColDefs(), [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: { data: CustomerElasticityRow }) => String(params.data.counterPartyId),
      rowSelection: 'single' as const,
      onSelectionChanged: (event: { api: GridApi }) => {
        const selected = event.api.getSelectedRows()
        if (selected.length > 0) {
          const row = selected[0] as CustomerElasticityRow
          setSelectedCustomer(row)
          setWhatIfPrice(row.currentPricePosition)
        } else {
          setSelectedCustomer(null)
        }
      },
      onGridReady: (params: { api: GridApi }) => {
        setGridApi(params.api)
      },
    }),
    [],
  )

  const curveParams = useMemo(() => {
    if (!selectedCustomer) return PRODUCT_CURVE_PARAMS
    return CUSTOMER_CURVE_PARAMS[selectedCustomer.counterParty] || PRODUCT_CURVE_PARAMS
  }, [selectedCustomer])

  const handleDeselectCustomer = useCallback(() => {
    setSelectedCustomer(null)
    if (gridApi) {
      gridApi.deselectAll()
    }
  }, [gridApi])

  return (
    <Vertical gap={8} height="100%">
      {/* Compact totals header */}
      <CompactTotalsHeader totals={MOCK_CUSTOMER_TOTALS} />

      {/* Main content area */}
      <Horizontal flex="1" gap={0} style={{ minHeight: 0 }}>
        {/* Left panel - Elasticity Curve (visible when customer selected) */}
        {selectedCustomer && (
          <Vertical
            flex="1"
            gap={12} style={{ borderRight: '1px solid #e8e8e8',
              padding: '12px',
              overflow: 'auto' }}
          >
            {/* Panel header */}
            <Horizontal justifyContent="space-between" alignItems="center">
              <Vertical gap={2}>
                <Texto category="h5" weight="600">
                  {selectedCustomer.counterParty}
                </Texto>
                <Texto category="p2" appearance="medium">
                  Price Elasticity Curve
                </Texto>
              </Vertical>
              <Horizontal gap={8} alignItems="center">
                <Select
                  value={segmentation}
                  onChange={setSegmentation}
                  size="small"
                  style={{ width: 160 }}
                  options={[
                    { value: 'product', label: 'Product Level' },
                    { value: 'product-terminal', label: 'Product @ Terminal' },
                    { value: 'product-customer', label: 'Product / Customer' },
                  ]}
                />
                <span
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: '#8c8c8c', fontSize: '13px' }}
                  onClick={handleDeselectCustomer}
                >
                  Close
                </span>
              </Horizontal>
            </Horizontal>

            {/* Elasticity curve chart */}
            <ElasticityCurveChart
              curveParams={curveParams}
              currentPricePosition={selectedCustomer.currentPricePosition}
              title="Demand Curve"
              subtitle={`${selectedCustomer.counterParty} - ULSD @ Baltimore`}
              seedOffset={selectedCustomer.counterPartyId * 100}
              height="320px"
            />

            {/* What-If simulation */}
            <WhatIfPanel
              curveParams={curveParams}
              currentPricePosition={selectedCustomer.currentPricePosition}
              whatIfPricePosition={whatIfPrice}
              onWhatIfChange={setWhatIfPrice}
            />
          </Vertical>
        )}

        {/* Right panel - AG Grid */}
        <Vertical flex="1" style={{ minHeight: 0 }}>
          <GraviGrid
            storageKey="customer-elasticity-grid"
            columnDefs={columnDefs}
            rowData={MOCK_CUSTOMER_ROWS}
            agPropOverrides={agPropOverrides}
            controlBarProps={{ title: 'Customer Liftings', hideActiveFilters: false }}
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
