import { Texto, Vertical } from '@gravitate-js/excalibrr'
import type { IndexPricingFormData, ProductLocationSelection, SpecialOfferMetadataResponseData } from '../../../ManageOffers.types'
import { ConfigureFixedPrice } from './ConfigureFixedPrice'
import { ConfigureIndexPrice } from './ConfigureIndexPrice/ConfigureIndexPrice'
import { ConfigureVolume } from './ConfigureVolume'
import { ProductLocationSelectColumnDefs } from './SelectionGrid/Columns/ProductLocationSelectColumnDefs'
import { SelectionGrid } from './SelectionGrid/SelectionGrid'
import { FixedPriceInfo, ReservePriceInfo } from '../../../utils/Constants/FormConstants'
import type { GridApi } from 'ag-grid-community'
import { Form, Segmented } from 'antd'
import type { FormInstance } from 'antd'
import { useEffect, useMemo, useRef } from 'react'

export interface SelectProductsLocationsProps {
  metadata?: SpecialOfferMetadataResponseData
  productLocation: string
  dealType?: number
  currentStep: number
  form: FormInstance
  gridRef: React.MutableRefObject<GridApi | undefined>
  isIndexPricing?: boolean
  isAuction: boolean
  onSaveIndexPricing: (data: IndexPricingFormData | null) => void
  savedIndexData?: IndexPricingFormData | null
  setShowIndexError: React.Dispatch<React.SetStateAction<boolean>>
  showIndexError: boolean
  formulaForm: FormInstance
}

export function SelectProductAndLocation({
  metadata,
  productLocation,
  dealType,
  currentStep,
  form,
  gridRef,
  isIndexPricing,
  isAuction,
  onSaveIndexPricing,
  savedIndexData,
  setShowIndexError,
  showIndexError,
  formulaForm,
}: SelectProductsLocationsProps) {
  const saveIndexPricing = (value: IndexPricingFormData | null) => {
    onSaveIndexPricing(value)
    form.setFieldsValue({ IndexPrice: value })
    setShowIndexError(false)
  }
  const price = useMemo(() => {
    const selectedTemplate = metadata?.SpecialOfferTemplates?.find((t) => t.SpecialOfferTemplateId === dealType)
    const dealName = selectedTemplate?.Name || ''
    if (dealName.includes('Auction')) return ReservePriceInfo
    return FixedPriceInfo
  }, [dealType, metadata?.SpecialOfferTemplates])

  const filteredProductLocations = useMemo(() => {
    if (!dealType || !metadata?.ProductLocationSelections) return []
    const selectedTemplate = metadata.SpecialOfferTemplates?.find((t) => t.SpecialOfferTemplateId === dealType)
    if (!selectedTemplate) return metadata.ProductLocationSelections
    return metadata.ProductLocationSelections.filter(
      (pl) => pl.MarketPlatformInstrumentId === selectedTemplate.MarketPlatformInstrumentId
    )
  }, [dealType, metadata?.ProductLocationSelections, metadata?.SpecialOfferTemplates])

  useEffect(() => {
    if (currentStep === 1 && gridRef?.current) {
      gridRef.current.setRowData(filteredProductLocations)
    }
  }, [currentStep, filteredProductLocations])

  const handleFormChange = (selection: ProductLocationSelection[]) => {
    const newValue = selection.length > 0 ? selection.map((s) => s['TradeEntrySetupId']) : undefined
    form.setFieldsValue({ ProductLocation: newValue })
    if (selection?.[0]) {
      formulaForm.setFieldsValue({
        ProductId: selection[0].ProductId?.toString(),
        LocationId: selection[0].LocationId?.toString(),
      })
    }
  }
  const currentValue = Form.useWatch('ProductLocation', form)
  const idRef = useRef(0)

  return (
    <Vertical
      className={'p-4'}
      style={{
        ...(currentStep !== 1 && {
          display: 'none',
        }),
      }}
    >
      <Texto category={'h4'} className={'text-18'}>Select a Product</Texto>
      <Texto className={'mb-4 text-14'}>Choose a product and configure volume requirements</Texto>
      <SelectionGrid
        rowData={filteredProductLocations}
        idField={'TradeEntrySetupId'}
        colDefFunc={ProductLocationSelectColumnDefs}
        rowSelection={'single'}
        handleFormChange={handleFormChange}
        currentValue={currentValue}
        gridRef={gridRef}
      />
      <Form.Item name='ProductLocation' rules={[{ required: true, message: 'Product is required' }]}>
        <div />
      </Form.Item>

      <Vertical style={{ visibility: productLocation ? 'visible' : 'hidden', display: productLocation ? 'block' : 'none' }}>
        <ConfigureVolume form={form} metadata={metadata} dealType={dealType} />
        <Texto category={'h4'} className={'text-18'}>Pricing Strategy</Texto>
        <Texto className={'mb-4 text-14'}>Choose how you want to set your price</Texto>
        <Segmented
          options={['Fixed Price', 'Index Price']}
          block
          value={isIndexPricing ? 'Index Price' : 'Fixed Price'}
          style={{ pointerEvents: 'none' }}
          className={'mb-4'}
        />
        <Vertical style={{ visibility: isIndexPricing ? 'visible' : 'hidden', display: isIndexPricing ? 'block' : 'none' }}>
          <ConfigureIndexPrice
            metadata={metadata}
            onSaveIndexPricing={saveIndexPricing}
            savedIndexData={savedIndexData}
            isAuction={isAuction}
            idRef={idRef}
            showIndexError={showIndexError}
            setShowIndexError={setShowIndexError}
            formulaForm={formulaForm}
            offerForm={form}
            selectedProductLocation={currentValue?.[0] || undefined}
          />
          <Form.Item style={{ marginTop: '-20px' }} name='IndexPrice' rules={[{ validator: (_: any, value: any) => !value && isIndexPricing ? Promise.reject('Index Price is required') : Promise.resolve() }]}>
            <div />
          </Form.Item>
          <Form.Item style={{ marginTop: '-20px' }} name='ReservePrice' rules={[{ validator: (_: any, value: any) => !value && isIndexPricing && isAuction ? Promise.reject('Reserve Price is required') : Promise.resolve() }]}>
            <div />
          </Form.Item>
        </Vertical>
        {!isIndexPricing && <ConfigureFixedPrice price={price} />}
      </Vertical>
    </Vertical>
  )
}
