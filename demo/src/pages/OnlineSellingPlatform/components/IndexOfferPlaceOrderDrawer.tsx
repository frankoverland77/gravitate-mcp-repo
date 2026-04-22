import { useState } from 'react';
import { Vertical, Texto, Horizontal, BBDTag } from '@gravitate-js/excalibrr';
import {
  Drawer,
  Button,
  Form,
  InputNumber,
  Select,
  Segmented,
  DatePicker,
  Spin,
  message,
  FormInstance,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { IndexOfferRow, formatDifferential, formatVolume } from './indexOfferData';

export type { IndexOfferRow } from './indexOfferData';

interface IndexOfferPlaceOrderDrawerProps {
  open: boolean;
  offer: IndexOfferRow | null;
  onClose: () => void;
  form: FormInstance;
  /** When true, Lifting From / Lifting To are editable date pickers (defaults to the offer's pickup window). */
  editableLiftingDates?: boolean;
}

export function IndexOfferPlaceOrderDrawer({
  open,
  offer,
  onClose,
  form,
  editableLiftingDates = false,
}: IndexOfferPlaceOrderDrawerProps) {
  const [orderMode, setOrderMode] = useState<'market' | 'bid'>('market');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    form.resetFields();
    setOrderMode('market');
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      message.success(
        `Order submitted successfully for ${offer?.product} @ ${offer?.location}`
      );
      handleClose();
    } catch {
      // validation failed
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBid = orderMode === 'bid';

  return (
    <Drawer
      title={null}
      placement="bottom"
      height="90vh"
      open={open}
      onClose={handleClose}
      closable={false}
      destroyOnHidden
      styles={{
        body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' },
      }}
      className="index-offer-drawer"
    >
      {/* HEADER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2980b9, #3498db)',
          padding: '12px 40px 12px 24px',
          flexShrink: 0,
        }}
      >
        <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Vertical gap={8}>
            <BBDTag style={{ maxWidth: 120, fontWeight: 600 }}>Index Purchase</BBDTag>
            <Texto style={{ color: '#ffffff', fontSize: 14 }}>
              {offer?.product ?? '-'} @ {offer?.location ?? '-'}
            </Texto>
          </Vertical>
          <Button
            type="text"
            icon={<CloseOutlined style={{ color: '#ffffff' }} />}
            onClick={handleClose}
          />
        </Horizontal>
      </div>

      <Spin spinning={isSubmitting} size="large">
        <style>{`
          .bid-differential-input .ant-input-number {
            height: 52px;
          }
          .bid-differential-input .ant-input-number-input {
            font-size: 24px !important;
            font-weight: 700 !important;
            height: 50px !important;
          }
          .bid-differential-input .ant-input-number-prefix {
            font-size: 24px !important;
            font-weight: 700 !important;
          }
        `}</style>
        <Form form={form} name="indexOfferPlaceOrderForm" layout="vertical">
          {/* PURCHASE TYPE BAR */}
          <Horizontal
            gap={12}
            style={{
              padding: '12px 24px',
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #e8e8e8',
              alignItems: 'center',
            }}
          >
            <Texto
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#8c8c8c',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Purchase Type
            </Texto>
            <Segmented
              value={orderMode}
              onChange={(value) => setOrderMode(value as 'market' | 'bid')}
              options={[
                { label: 'Market', value: 'market' },
                { label: 'Bid', value: 'bid' },
              ]}
              size="large"
              style={{ fontWeight: 600 }}
              onPointerEnterCapture={undefined as any}
              onPointerLeaveCapture={undefined as any}
            />
          </Horizontal>

          {/* 3-COLUMN BODY */}
          <Vertical>
            <Horizontal gap={32} style={{ padding: '24px' }}>
              {/* COLUMN 1 — DETAILS */}
              <Vertical flex={3}>
                <Texto
                  category="h5"
                  weight={900}
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#595959',
                    marginBottom: 22,
                    paddingBottom: 8,
                    borderBottom: '1px solid #e8e8e8',
                  }}
                >
                  Details
                </Texto>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '22px 24px',
                    marginBottom: 22,
                  }}
                >
                  <div>
                    <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                      Product
                    </Texto>
                    <Texto category="p1" weight="bold">
                      {offer?.product ?? '-'}
                    </Texto>
                  </div>
                  <div>
                    <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                      Location
                    </Texto>
                    <Texto category="p1" weight="bold">
                      {offer?.location ?? '-'}
                    </Texto>
                  </div>
                  {!editableLiftingDates && (
                    <>
                      <div>
                        <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                          Lifting From
                        </Texto>
                        <Texto category="p1" weight="bold">
                          {offer?.pickupWindowStart
                            ? dayjs(offer.pickupWindowStart).format('MMM D, YYYY h:mm A')
                            : '-'}
                        </Texto>
                      </div>
                      <div>
                        <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                          Lifting To
                        </Texto>
                        <Texto category="p1" weight="bold">
                          {offer?.pickupWindowEnd
                            ? dayjs(offer.pickupWindowEnd).format('MMM D, YYYY h:mm A')
                            : '-'}
                        </Texto>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Texto
                    category="p2"
                    style={{ color: '#595959', marginBottom: 4, display: 'block' }}
                  >
                    Volume
                  </Texto>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <Form.Item
                      name="Volume"
                      rules={[
                        { required: true, message: 'Volume is required' },
                        {
                          validator: (_, value) => {
                            if (value != null && offer) {
                              if (offer.minPerOrder != null && value < offer.minPerOrder)
                                return Promise.reject(
                                  `Min ${formatVolume(offer.minPerOrder)} gal`
                                );
                              if (offer.maxPerOrder != null && value > offer.maxPerOrder)
                                return Promise.reject(
                                  `Max ${formatVolume(offer.maxPerOrder)} gal`
                                );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                      style={{ margin: 0 }}
                    >
                      <InputNumber
                        placeholder="Enter volume"
                        style={{ width: 200 }}
                        min={0}
                        step={offer?.volumeIncrement ?? 1000}
                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(v) => v?.replace(/,/g, '') as any}
                      />
                    </Form.Item>
                    <BBDTag style={{ marginTop: 4 }}>GAL</BBDTag>
                  </div>
                </div>

                {editableLiftingDates && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px 24px',
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <Texto
                        category="p2"
                        style={{ color: '#595959', marginBottom: 4, display: 'block' }}
                      >
                        Lifting From
                      </Texto>
                      <Form.Item
                        name="LiftingFrom"
                        rules={[{ required: true, message: 'Lifting From is required' }]}
                        initialValue={
                          offer?.pickupWindowStart
                            ? dayjs(offer.pickupWindowStart)
                            : undefined
                        }
                        style={{ margin: 0 }}
                      >
                        <DatePicker
                          format="MM/DD/YYYY h:mm A"
                          showTime={{ format: 'HH:mm', use12Hours: true }}
                          style={{ width: '100%' }}
                          placeholder="Select start date"
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <Texto
                        category="p2"
                        style={{ color: '#595959', marginBottom: 4, display: 'block' }}
                      >
                        Lifting To
                      </Texto>
                      <Form.Item
                        name="LiftingTo"
                        rules={[
                          { required: true, message: 'Lifting To is required' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const from = getFieldValue('LiftingFrom');
                              if (!value || !from) return Promise.resolve();
                              if (dayjs(value).isBefore(dayjs(from))) {
                                return Promise.reject('End must be after start');
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                        initialValue={
                          offer?.pickupWindowEnd
                            ? dayjs(offer.pickupWindowEnd)
                            : undefined
                        }
                        style={{ margin: 0 }}
                      >
                        <DatePicker
                          format="MM/DD/YYYY h:mm A"
                          showTime={{ format: 'HH:mm', use12Hours: true }}
                          style={{ width: '100%' }}
                          placeholder="Select end date"
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}

                <div>
                  <Texto
                    weight="bold"
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: '#595959',
                      marginBottom: 8,
                    }}
                  >
                    Loading Numbers (Optional)
                  </Texto>
                  <Form.Item name="LoadingNumbersIds" style={{ margin: 0 }}>
                    <Select
                      placeholder="Select Loading Number(s)"
                      allowClear
                      showSearch
                      mode="multiple"
                      optionFilterProp="label"
                      options={[
                        { value: 1, label: 'Loading #001 - Rack A' },
                        { value: 2, label: 'Loading #002 - Rack B' },
                        { value: 3, label: 'Loading #003 - Rack C' },
                      ]}
                    />
                  </Form.Item>
                </div>
              </Vertical>

              {/* COLUMN 2 — PRICING */}
              <Vertical
                flex={4}
                style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 32 }}
              >
                <Texto
                  category="h5"
                  weight={900}
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#595959',
                    marginBottom: 22,
                    paddingBottom: 8,
                    borderBottom: '1px solid #e8e8e8',
                  }}
                >
                  Pricing
                </Texto>

                <div style={{ marginBottom: 20 }}>
                  <Texto category="p1" weight="bold" style={{ lineHeight: '1.5' }}>
                    {offer?.formulaName ?? '-'}
                  </Texto>
                </div>

                {isBid ? (
                  <div
                    style={{
                      backgroundColor: '#f0f5ff',
                      border: '1px solid #adc6ff',
                      borderLeft: '3px solid #1890ff',
                      borderRadius: 6,
                      padding: '20px 24px',
                      marginBottom: 24,
                      maxWidth: 320,
                    }}
                  >
                    <Horizontal
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 14,
                      }}
                    >
                      <Texto category="p2" style={{ color: '#595959' }}>
                        Your Bid Differential
                      </Texto>
                      <BBDTag
                        style={{ backgroundColor: '#1890ff', color: '#fff', fontSize: 11 }}
                      >
                        BID
                      </BBDTag>
                    </Horizontal>
                    <Form.Item
                      name="BidPrice"
                      style={{ margin: 0 }}
                      className="bid-differential-input"
                    >
                      <InputNumber
                        placeholder={offer?.formulaDifferential?.toFixed(4)}
                        precision={4}
                        step={0.0001}
                        size="large"
                        prefix="$"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Texto
                      category="p2"
                      style={{ color: '#8c8c8c', marginTop: 10, fontSize: 12 }}
                    >
                      Offer differential: {formatDifferential(offer?.formulaDifferential)}
                    </Texto>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#f6ffed',
                      border: '1px solid #b7eb8f',
                      borderLeft: '3px solid #52c41a',
                      borderRadius: 6,
                      padding: '20px 24px',
                      marginBottom: 24,
                      maxWidth: 320,
                    }}
                  >
                    <Texto category="p2" style={{ color: '#595959', marginBottom: 6 }}>
                      Contract Differential
                    </Texto>
                    <Texto
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        color: '#262626',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {formatDifferential(offer?.formulaDifferential)}
                    </Texto>
                    <Texto
                      category="p2"
                      style={{ color: '#8c8c8c', marginTop: 6, fontSize: 12 }}
                    >
                      per gallon
                    </Texto>
                  </div>
                )}

                {isBid && (
                  <div style={{ marginBottom: 24 }}>
                    <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                      Bid Expiration
                    </Texto>
                    <Form.Item
                      name="BidExpiration"
                      rules={[{ required: true, message: 'Bid expiration is required' }]}
                      initialValue={
                        offer?.defaultBidExpiry ? dayjs(offer.defaultBidExpiry) : undefined
                      }
                      style={{ margin: 0 }}
                    >
                      <DatePicker
                        format="MM/DD/YYYY hh:mm A"
                        showTime={{ format: 'HH:mm', use12Hours: true }}
                        style={{ width: '100%', maxWidth: 280 }}
                        disabledDate={(date) =>
                          offer?.maximumBidExpiry
                            ? date.isAfter(dayjs(offer.maximumBidExpiry))
                            : false
                        }
                        placeholder="Select Date and Time"
                      />
                    </Form.Item>
                  </div>
                )}

                <div
                  style={{
                    border: '1px solid #e8e8e8',
                    borderRadius: 6,
                    overflow: 'hidden',
                    maxWidth: 440,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#fafafa',
                      padding: '10px 16px',
                      borderBottom: '1px solid #e8e8e8',
                    }}
                  >
                    <Texto
                      category="p2"
                      weight="bold"
                      style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#595959',
                        fontSize: 12,
                      }}
                    >
                      Formula Components
                    </Texto>
                  </div>
                  {(offer?.formulaVariables ?? []).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 16px',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <Texto
                        weight="bold"
                        style={{
                          width: 48,
                          flexShrink: 0,
                          color: item.percentage.startsWith('-') ? '#ff4d4f' : '#1890ff',
                          fontSize: 13,
                        }}
                      >
                        {item.percentage}
                      </Texto>
                      <Texto style={{ fontSize: 13, color: '#434343' }}>{item.name}</Texto>
                    </div>
                  ))}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 16px',
                      backgroundColor: isBid ? '#f0f5ff' : '#f6ffed',
                    }}
                  >
                    <Texto style={{ fontSize: 13, color: '#595959' }}>
                      Contract Differential
                    </Texto>
                    <Texto
                      weight="bold"
                      style={{ fontSize: 13, color: isBid ? '#1890ff' : '#52c41a' }}
                    >
                      {isBid ? 'Your Bid' : formatDifferential(offer?.formulaDifferential)}
                    </Texto>
                  </div>
                </div>
              </Vertical>

              {/* COLUMN 3 — ADDITIONAL TERMS */}
              <Vertical
                flex={3}
                style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 32 }}
              >
                <Texto
                  category="h5"
                  weight={900}
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#595959',
                    marginBottom: 22,
                    paddingBottom: 8,
                    borderBottom: '1px solid #e8e8e8',
                  }}
                >
                  Additional Terms
                </Texto>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '22px 24px',
                    marginBottom: 22,
                  }}
                >
                  <div>
                    <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                      Price Validity
                    </Texto>
                    <Texto category="p1" weight="bold">
                      {offer?.priceValidity ?? '-'}
                    </Texto>
                  </div>
                  <div>
                    <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                      Weekend Rule
                    </Texto>
                    <Texto category="p1" weight="bold">
                      {offer?.weekendRule ?? '-'}
                    </Texto>
                  </div>
                  <div>
                    <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                      Holiday Rule
                    </Texto>
                    <Texto category="p1" weight="bold">
                      {offer?.holidayRule ?? '-'}
                    </Texto>
                  </div>
                </div>

                <Texto
                  category="p2"
                  weight="bold"
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#595959',
                    marginBottom: 12,
                  }}
                >
                  Terms
                </Texto>
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#fafafa',
                    borderRadius: 4,
                    border: '1px solid #e8e8e8',
                    borderTop: '2px solid #d9d9d9',
                    maxHeight: 150,
                    overflowY: 'auto',
                  }}
                >
                  <Texto
                    style={{ fontSize: 13, color: '#595959', lineHeight: '1.6' }}
                  >
                    {offer?.additionalTerms || 'N/A'}
                  </Texto>
                </div>
              </Vertical>
            </Horizontal>
          </Vertical>
        </Form>
      </Spin>

      {/* FOOTER */}
      <div
        style={{
          borderTop: '1px solid #e8e8e8',
          padding: '16px 24px',
          backgroundColor: '#fafafa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
        }}
      >
        <div />
        <Horizontal gap={12} style={{ alignItems: 'center' }}>
          <Button size="large" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            loading={isSubmitting}
            style={{
              backgroundColor: isBid ? '#1890ff' : '#52c41a',
              borderColor: isBid ? '#1890ff' : '#52c41a',
              minWidth: 160,
              height: 44,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            {isBid ? 'Submit Bid' : 'Submit Order'}
          </Button>
        </Horizontal>
      </div>
    </Drawer>
  );
}

export default IndexOfferPlaceOrderDrawer;
