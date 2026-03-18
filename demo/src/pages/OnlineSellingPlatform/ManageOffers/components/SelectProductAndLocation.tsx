import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Form, InputNumber, Segmented } from 'antd';
import type { FormInstance } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useMemo, useCallback, useState } from 'react';

import { PRODUCT_LOCATIONS } from '../ManageOffers.data';
import type { OfferTemplate, ProductLocation } from '../ManageOffers.types';

interface SelectProductAndLocationProps {
  currentStep: number;
  form: FormInstance;
  isIndexPricing: boolean;
  isAuction: boolean;
  currentTemplate?: OfferTemplate;
}

const productLocationColumns: ColDef<ProductLocation>[] = [
  { field: 'ProductName', headerName: 'Product', flex: 1 },
  { field: 'ProductGroupName', headerName: 'Group', flex: 1 },
  { field: 'LocationName', headerName: 'Location', flex: 1 },
  { field: 'LocationGroupName', headerName: 'Region', flex: 1 },
  { field: 'TimeZoneAlias', headerName: 'TZ', width: 80 },
];

const defaultInputProps = {
  style: { width: '100%' },
  className: 'border-radius-5',
};

export function SelectProductAndLocation({
  currentStep,
  form,
  isIndexPricing,
  isAuction,
  currentTemplate,
}: SelectProductAndLocationProps) {
  const productLocation = Form.useWatch('ProductLocation', form);
  const [showVolumeDefaults, setShowVolumeDefaults] = useState(false);

  const onRowClicked = useCallback(
    (event: any) => {
      if (event.data) {
        event.node.setSelected(true);
        form.setFieldsValue({ ProductLocation: event.data.TradeEntrySetupId });
      }
    },
    [form],
  );

  const agPropOverrides = useMemo(
    () => ({
      rowSelection: 'single' as const,
      onRowClicked,
      getRowId: (params: any) => params.data.TradeEntrySetupId.toString(),
    }),
    [onRowClicked],
  );

  const resetToDefaults = useCallback(() => {
    if (currentTemplate) {
      form.setFieldsValue({
        MinimumVolumePerOrder: currentTemplate.DefaultMinimumVolumePerOrder,
        MaximumVolumePerOrder: currentTemplate.DefaultMaximumVolumePerOrder,
        VolumeIncrement: currentTemplate.DefaultVolumeIncrement,
      });
    }
    setShowVolumeDefaults(false);
  }, [form, currentTemplate]);

  const defaultMin = currentTemplate?.DefaultMinimumVolumePerOrder;
  const defaultMax = currentTemplate?.DefaultMaximumVolumePerOrder;
  const defaultIncrement = currentTemplate?.DefaultVolumeIncrement;

  const priceLabel = isAuction ? 'Reserve Price (per gallon)' : 'Offer Price (per gallon)';
  const priceDescription = isAuction
    ? "Set your minimum acceptable price for this auction"
    : 'Set your offer price for selected customers';

  return (
    <Vertical
      className="p-4"
      style={{
        visibility: currentStep === 1 ? 'visible' : 'hidden',
        display: currentStep === 1 ? 'block' : 'none',
      }}
    >
      <Texto category="h4" className="text-18">
        Select a Product
      </Texto>
      <Texto className="mb-4 text-14">Choose a product and configure volume requirements</Texto>

      <div style={{ height: '220px' }}>
        <GraviGrid
          storageKey="ManageOffers-ProductSelect"
          columnDefs={productLocationColumns}
          rowData={PRODUCT_LOCATIONS}
          agPropOverrides={agPropOverrides}
        />
      </div>

      <Form.Item name="ProductLocation" rules={[{ required: true, message: 'Product is required' }]}>
        <input type="hidden" />
      </Form.Item>

      <Vertical
        style={{
          visibility: productLocation ? 'visible' : 'hidden',
          display: productLocation ? 'block' : 'none',
        }}
      >
        <Texto category="h4" className="mt-4 text-18">
          Volume Configuration
        </Texto>
        <Texto className="mb-4 text-14">Set total volume available for this deal</Texto>

        <Texto className="mt-2 text-14">Total Offered Volume</Texto>
        <Form.Item name="TotalVolume" rules={[{ required: true, message: 'Total volume is required' }]}>
          <InputNumber precision={0} min={1} {...defaultInputProps} />
        </Form.Item>
        <Texto className="mb-2 text-14" appearance="medium">Total gallons available for this deal</Texto>

        {!showVolumeDefaults && (
          <Horizontal
            className="p-3 bordered border-radius-5 mb-2"
            justifyContent="space-between"
            verticalCenter
            style={{ backgroundColor: 'var(--bg-2)' }}
          >
            <Texto className="text-14" appearance="medium">
              Using template defaults: Min {defaultMin?.toLocaleString()} · Max {defaultMax?.toLocaleString()} · Increment {defaultIncrement?.toLocaleString()}
            </Texto>
            <button
              type="button"
              onClick={() => setShowVolumeDefaults(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--theme-color-1)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                padding: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Customize
            </button>
          </Horizontal>
        )}

        <Vertical
          className="p-3 bordered border-radius-5 mb-2"
          style={{ display: showVolumeDefaults ? 'flex' : 'none' }}
        >
          <Horizontal justifyContent="space-between" verticalCenter className="mb-2">
            <Texto className="text-14" weight="bold">Order Limits</Texto>
            <button
              type="button"
              onClick={resetToDefaults}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--theme-color-1)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                padding: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Reset to Defaults
            </button>
          </Horizontal>
          <Horizontal gap={20} className="pb-2">
            <Vertical flex="1">
              <Texto className="mt-2 text-14">Min Volume Per Order</Texto>
              <Form.Item name="MinimumVolumePerOrder" rules={[{ required: true, message: 'Required' }]}>
                <InputNumber precision={0} min={1} {...defaultInputProps} />
              </Form.Item>
            </Vertical>
            <Vertical flex="1">
              <Texto className="mt-2 text-14">Max Volume Per Order</Texto>
              <Form.Item name="MaximumVolumePerOrder" rules={[{ required: true, message: 'Required' }]}>
                <InputNumber precision={0} min={1} {...defaultInputProps} />
              </Form.Item>
            </Vertical>
            <Vertical flex="1">
              <Texto className="mt-2 text-14">Volume Increment</Texto>
              <Form.Item name="VolumeIncrement" rules={[{ required: true, message: 'Required' }]}>
                <InputNumber precision={0} min={1} {...defaultInputProps} />
              </Form.Item>
            </Vertical>
          </Horizontal>
        </Vertical>

        <Vertical className="border-top pt-4">
          <Texto category="h4" className="text-18">
            Pricing Strategy
          </Texto>
          <Texto className="mb-4 text-14">Choose how you want to set your price</Texto>
          <Segmented
            options={['Fixed Price', 'Index Price']}
            block
            value={isIndexPricing ? 'Index Price' : 'Fixed Price'}
            style={{ pointerEvents: 'none' }}
            className="mb-4"
          />

          {isIndexPricing ? (
            <Vertical className="p-4 bordered border-radius-5">
              <Texto category="h4" className="text-18">
                Index Pricing Configuration
              </Texto>
              <Texto className="mb-2 text-14" appearance="medium">
                Index pricing is configured based on your formula templates. Select a base index, timing, and differential.
              </Texto>
              <Texto className="mt-2 text-14">Differential (per gallon)</Texto>
              <Form.Item name="IndexDifferential">
                <InputNumber prefix="$" precision={4} style={{ width: '100%' }} className="border-radius-5" />
              </Form.Item>
              {isAuction && (
                <>
                  <Texto className="mt-2 text-14">Reserve Price (per gallon)</Texto>
                  <Form.Item name="ReservePrice" rules={[{ required: true, message: 'Reserve price required' }]}>
                    <InputNumber prefix="$" precision={4} min={0.0001} max={999} style={{ width: '100%' }} className="border-radius-5" />
                  </Form.Item>
                </>
              )}
            </Vertical>
          ) : (
            <>
              <Texto category="h4" className="mt-2 text-18">
                {isAuction ? 'Set Reserve Price' : 'Set Fixed Price'}
              </Texto>
              <Texto className="mb-2 text-14">{priceDescription}</Texto>
              <Texto className="mb-1 text-14">{priceLabel}</Texto>
              <Form.Item name="ReservePrice" rules={[{ required: true, message: 'Price is required' }]}>
                <InputNumber prefix="$" precision={4} min={0.0001} max={999} style={{ width: '100%' }} className="border-radius-5" />
              </Form.Item>
            </>
          )}
        </Vertical>
      </Vertical>
    </Vertical>
  );
}
