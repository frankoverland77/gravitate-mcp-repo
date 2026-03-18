import { Texto, Vertical } from '@gravitate-js/excalibrr';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { OFFER_TEMPLATES, PRODUCT_LOCATIONS } from '../ManageOffers.data';

interface PreviewPanelProps {
  selectedTemplateId: number | undefined;
  form: FormInstance;
  isIndexPricing: boolean;
  isAuction: boolean;
}

export function PreviewPanel({ selectedTemplateId, form, isIndexPricing, isAuction }: PreviewPanelProps) {
  const productLocation = Form.useWatch('ProductLocation', form);
  const reservePrice = Form.useWatch('ReservePrice', form);
  const counterPartyIds = Form.useWatch('CounterPartyIds', form);
  const visibilityStart = Form.useWatch('VisibilityWindowStartDate', form);
  const visibilityEnd = Form.useWatch('VisibilityWindowEndDate', form);
  const pickupStart = Form.useWatch('PickupWindowStartDate', form);
  const pickupEnd = Form.useWatch('PickupWindowEndDate', form);
  const visStartTime = Form.useWatch('VisibilityWindowStartTime', form);
  const visEndTime = Form.useWatch('VisibilityWindowEndTime', form);
  const pickStartTime = Form.useWatch('PickupWindowStartTime', form);
  const pickEndTime = Form.useWatch('PickupWindowEndTime', form);
  const indexDifferential = Form.useWatch('IndexDifferential', form);

  const dealTypeLabel = useMemo(() => {
    if (!selectedTemplateId) return '';
    return OFFER_TEMPLATES.find((t) => t.SpecialOfferTemplateId === selectedTemplateId)?.Name || '';
  }, [selectedTemplateId]);

  const getProductValue = () => {
    if (!productLocation) return null;
    const item = PRODUCT_LOCATIONS.find((p) => p.TradeEntrySetupId === productLocation);
    if (!item) return null;
    return (
      <Texto className="text-14" style={{ whiteSpace: 'break-spaces' }}>
        {item.ProductName} @ {item.LocationName}
      </Texto>
    );
  };

  const getPricingValue = () => {
    if (isIndexPricing) {
      return (
        <Vertical gap={4}>
          <Texto className="text-14">Index Pricing</Texto>
          {indexDifferential != null && (
            <Texto className="text-14" appearance="medium">Differential: ${indexDifferential}/gal</Texto>
          )}
          {isAuction && reservePrice != null && (
            <Texto className="text-14" appearance="medium">Reserve: ${reservePrice}/gal</Texto>
          )}
        </Vertical>
      );
    }
    if (reservePrice == null) return null;
    const preface = isAuction ? 'Reserve' : 'Fixed';
    return (
      <Texto className="text-14" style={{ whiteSpace: 'break-spaces' }}>
        {preface}: ${reservePrice}/gal
      </Texto>
    );
  };

  const getTimingValue = () => {
    if (!visibilityStart || !visibilityEnd || !pickupStart || !pickupEnd) return null;
    const fmt = (date: any, time: any) => {
      if (!date || !time) return '';
      return dayjs(date).hour(dayjs(time).hour()).minute(dayjs(time).minute()).format('MMM D, YYYY h:mm A');
    };
    return (
      <Vertical gap={4}>
        <Texto className="text-14" weight="bold">Visibility:</Texto>
        <Texto className="text-14">{fmt(visibilityStart, visStartTime)} - {fmt(visibilityEnd, visEndTime)}</Texto>
        <Texto className="text-14 mt-2" weight="bold">Pickup:</Texto>
        <Texto className="text-14">{fmt(pickupStart, pickStartTime)} - {fmt(pickupEnd, pickEndTime)}</Texto>
      </Vertical>
    );
  };

  const getCustomerValue = () => {
    if (!counterPartyIds || counterPartyIds.length === 0) return null;
    return <Texto className="text-14">{counterPartyIds.length} Customer{counterPartyIds.length > 1 ? 's' : ''}</Texto>;
  };

  const items = [
    { label: 'Product & Location', value: getProductValue() },
    { label: 'Pricing Strategy', value: getPricingValue() },
    { label: 'Timing Windows', value: getTimingValue() },
    { label: 'Target Customers', value: getCustomerValue() },
  ];

  return (
    <Vertical>
      <Vertical className="mb-4">
        <Texto category="h5" className="text-16">
          {dealTypeLabel || 'New Offer'}
        </Texto>
        <Texto className="text-14" appearance="medium">What customers will see</Texto>
      </Vertical>
      {items.map((item) => (
        <Vertical
          className={`mb-4 p-3 border-radius-5 ${item.value ? 'bg-1 bordered' : 'bg-2 dotted-border'}`}
          key={item.label}
        >
          <Texto className="mb-2" appearance="medium">{item.label}</Texto>
          {item.value ? (
            item.value
          ) : (
            <Texto appearance="medium">
              <em>Not configured</em>
            </Texto>
          )}
        </Vertical>
      ))}
    </Vertical>
  );
}
