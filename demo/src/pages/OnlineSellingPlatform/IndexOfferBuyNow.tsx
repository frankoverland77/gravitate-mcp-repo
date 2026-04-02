import { useMemo, useState, useCallback } from 'react';
import {
  GraviGrid,
  GraviButton,
  Vertical,
  Texto,
  Horizontal,
  BBDTag,
} from '@gravitate-js/excalibrr';
import {
  Drawer,
  Button,
  Form,
  InputNumber,
  Select,
  Segmented,
  DatePicker,
  List,
  Spin,
  message,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// ---------------------------------------------------------------------------
// Mock data types
// ---------------------------------------------------------------------------

interface IndexOfferRow {
  id: number;
  offerId: number;
  offerName: string;
  product: string;
  location: string;
  timeZone: string;
  volumeAvailable: number;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  timeRemaining: string;
  minPerOrder: number;
  maxPerOrder: number;
  volumeIncrement: number;
  fixedPrice: number | null;
  formulaDifferential: number;
  formulaName: string;
  formulaVariables: { name: string; percentage: string }[];
  pricingMechanism: string;
  priceValidity: string;
  weekendRule: string;
  holidayRule: string;
  additionalTerms: string;
  currency: string;
  hasPendingSubmission: boolean;
  defaultBidExpiry: string;
  maximumBidExpiry: string;
}

// ---------------------------------------------------------------------------
// Mock data generator
// ---------------------------------------------------------------------------

function generateIndexOffers(count = 10): IndexOfferRow[] {
  const products = ['ULSD', 'CBOB', 'Premium Unleaded', 'Regular Conv', 'Ethanol'];
  const locations = [
    'Dallas Terminal',
    'Houston Terminal',
    'Nashville Terminal',
    'Atlanta Terminal',
    'Chicago Terminal',
    'Baton Rouge Terminal',
  ];
  const timeZones = ['CST', 'EST', 'CST', 'EST', 'CST', 'CST'];
  const formulaNames = [
    '90% Argus Prior Day CBOB USGC + 10% OPIS Rack + Differential',
    'OPIS Mean ULSD Gulf Coast + Differential',
    '80% Platts USGC + 20% Argus NYH + Differential',
    'OPIS Rack Low + Differential',
    'Argus Prior Day Premium USGC + Differential',
  ];
  const priceValidities = ['Midnight - Midnight', '6AM - 6AM', '8AM - 8AM'];
  const weekendRules = ['Use Friday', 'Include', 'Exclude'];
  const holidayRules = ['Use prior business day', 'Exclude', 'Include'];
  const terms = [
    'All deliveries subject to force majeure provisions. Buyer responsible for all applicable taxes, fees, and duties at point of delivery.',
    'Product must meet ASTM D975 Grade 2 standards. Quality testing by independent third-party laboratory.',
    'Delivery windows guaranteed within +/- 4 hours. Demurrage charges apply after 2 hours at standard industry rates.',
    'Payment terms net 10 days. 1.5% monthly interest on overdue balances.',
    'Subject to credit approval and existing credit limits.',
  ];

  const now = dayjs();
  const offers: IndexOfferRow[] = [];

  for (let i = 0; i < count; i++) {
    const locIdx = i % locations.length;
    const prodIdx = i % products.length;
    const pickupStart = now.add(Math.floor(i / 2) + 1, 'day').startOf('day');
    const pickupEnd = pickupStart.add(25 + (i % 10), 'day').endOf('day');
    const diff = ((i % 8) - 3) * 0.0125;

    offers.push({
      id: i + 1,
      offerId: 5000 + i,
      offerName: `Index Offer #${5000 + i}`,
      product: products[prodIdx],
      location: locations[locIdx],
      timeZone: timeZones[locIdx],
      volumeAvailable: (5 + (i % 6)) * 10000,
      pickupWindowStart: pickupStart.toISOString(),
      pickupWindowEnd: pickupEnd.toISOString(),
      timeRemaining: `${3 + (i % 5)}h ${10 + (i % 50)}m`,
      minPerOrder: 5000 + (i % 3) * 1000,
      maxPerOrder: 40000 + (i % 4) * 10000,
      volumeIncrement: 1000,
      fixedPrice: null,
      formulaDifferential: diff,
      formulaName: formulaNames[i % formulaNames.length],
      formulaVariables: [
        { name: 'Argus Prior Day CBOB USGC', percentage: '90%' },
        { name: 'OPIS Rack Low', percentage: '10%' },
        { name: 'OPIS Current Year RIN', percentage: '-10%' },
      ],
      pricingMechanism: 'Index',
      priceValidity: priceValidities[i % priceValidities.length],
      weekendRule: weekendRules[i % weekendRules.length],
      holidayRule: holidayRules[i % holidayRules.length],
      additionalTerms: terms[i % terms.length],
      currency: 'USD',
      hasPendingSubmission: i === 3, // one row has pending
      defaultBidExpiry: pickupEnd.subtract(1, 'day').hour(17).minute(0).toISOString(),
      maximumBidExpiry: pickupEnd.toISOString(),
    });
  }

  return offers;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatDifferential = (value: number | null | undefined): string => {
  if (value == null) return '-';
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}$${Math.abs(value).toFixed(4)}`;
};

const formatVolume = (value: number): string =>
  value.toLocaleString('en-US');

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IndexOfferBuyNow() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<IndexOfferRow | null>(null);
  const [orderMode, setOrderMode] = useState<'market' | 'bid'>('market');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const rowData = useMemo(() => generateIndexOffers(12), []);

  const handlePlaceOrder = useCallback((offer: IndexOfferRow) => {
    setSelectedOffer(offer);
    setOrderMode('market');
    setDrawerVisible(true);
    form.resetFields();
  }, [form]);

  const handleClose = () => {
    form.resetFields();
    setDrawerVisible(false);
    setSelectedOffer(null);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));
      message.success(`Order submitted successfully for ${selectedOffer?.product} @ ${selectedOffer?.location}`);
      handleClose();
    } catch {
      // validation failed
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Grid column definitions
  // -------------------------------------------------------------------------

  const columnDefs = useMemo(
    (): any[] => [
      {
        field: 'offerId',
        headerName: 'Offer ID',
        width: 100,
        sortable: true,
        filter: true,
      },
      {
        field: 'offerName',
        headerName: 'Offer Name',
        width: 170,
        sortable: true,
        filter: true,
      },
      {
        field: 'product',
        headerName: 'Product',
        width: 160,
        sortable: true,
        filter: true,
      },
      {
        field: 'location',
        headerName: 'Location',
        width: 170,
        sortable: true,
        filter: true,
      },
      {
        field: 'timeZone',
        headerName: 'TZ',
        width: 70,
        sortable: true,
      },
      {
        field: 'volumeAvailable',
        headerName: 'Vol Available',
        width: 130,
        sortable: true,
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        valueFormatter: ({ value }: any) => formatVolume(value),
      },
      {
        field: 'pickupWindowStart',
        headerName: 'Pickup Window',
        width: 160,
        sortable: true,
        filter: 'agDateColumnFilter',
        type: 'rightAligned',
        cellRenderer: ({ data }: any) => {
          const start = dayjs(data.pickupWindowStart).format('MMM DD');
          const end = dayjs(data.pickupWindowEnd).format('MMM DD');
          return (
            <Horizontal width="100%" justifyContent="flex-end">
              {start} - {end}
            </Horizontal>
          );
        },
      },
      {
        field: 'timeRemaining',
        headerName: 'Time Remaining',
        width: 130,
        sortable: true,
      },
      {
        field: 'minPerOrder',
        headerName: 'Min / Order',
        width: 110,
        sortable: true,
        type: 'rightAligned',
        valueFormatter: ({ value }: any) => formatVolume(value),
      },
      {
        field: 'maxPerOrder',
        headerName: 'Max / Order',
        width: 110,
        sortable: true,
        type: 'rightAligned',
        valueFormatter: ({ value }: any) => formatVolume(value),
      },
      {
        field: 'formulaDifferential',
        headerName: 'Differential',
        width: 120,
        sortable: true,
        type: 'rightAligned',
        cellRenderer: ({ value }: any) => {
          const color = value < 0 ? '#ff4d4f' : undefined;
          return (
            <Horizontal width="100%" justifyContent="flex-end">
              <Texto style={{ color }}>{formatDifferential(value)}</Texto>
            </Horizontal>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 170,
        pinned: 'right',
        cellRenderer: ({ data }: any) => {
          if (data.hasPendingSubmission) {
            return (
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button disabled size="small">
                  Pending
                </Button>
              </div>
            );
          }
          return (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <GraviButton
                buttonText="Place Index Order"
                success
                onClick={() => handlePlaceOrder(data)}
                size="small"
              />
            </div>
          );
        },
      },
    ],
    [handlePlaceOrder],
  );

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.id,
      domLayout: 'normal' as const,
      suppressRowClickSelection: true,
      rowHeight: 48,
      headerHeight: 40,
      enableCellTextSelection: true,
      ensureDomOrder: true,
    }),
    [],
  );

  const isBid = orderMode === 'bid';

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Grid */}
      <div style={{ flex: 1 }}>
        <GraviGrid
          storageKey="index-offer-buy-now-grid"
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={{ title: 'Special Offers - Index Pricing', hideActiveFilters: false }}
          updateEP={async () => {}}
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* INDEX OFFER BOTTOM DRAWER                                         */}
      {/* Mirrors the production IndexOfferDrawer component layout          */}
      {/* ----------------------------------------------------------------- */}
      <Drawer
        title={null}
        placement="bottom"
        height="65%"
        open={drawerVisible}
        onClose={handleClose}
        closable={false}
        destroyOnHidden
        styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
        className="index-offer-drawer"
      >
        {/* ---- HEADER ---- */}
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
                {selectedOffer?.product ?? '-'} @ {selectedOffer?.location ?? '-'}
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
      <Form form={form} name="indexOfferBuyNowForm" layout="vertical">
            {/* ---- PURCHASE TYPE BAR ---- */}
            <Horizontal
              gap={12} style={{ padding: '12px 24px',
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #e8e8e8',
                alignItems: 'center' }}
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
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </Horizontal>

            {/* ---- 3-COLUMN BODY ---- */}
            <Vertical>
              <Horizontal gap={32} style={{ padding: '24px' }}>
                {/* ============================================ */}
                {/* COLUMN 1 — DETAILS                           */}
                {/* ============================================ */}
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

                  {/* Product / Location & Lifting From / Lifting To — aligned grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 24px', marginBottom: 22 }}>
                    <div>
                      <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                        Product
                      </Texto>
                      <Texto category="p1" weight="bold">{selectedOffer?.product ?? '-'}</Texto>
                    </div>
                    <div>
                      <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                        Location
                      </Texto>
                      <Texto category="p1" weight="bold">{selectedOffer?.location ?? '-'}</Texto>
                    </div>
                    <div>
                      <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                        Lifting From
                      </Texto>
                      <Texto category="p1" weight="bold">
                        {selectedOffer?.pickupWindowStart
                          ? dayjs(selectedOffer.pickupWindowStart).format('MMM D, YYYY h:mm A')
                          : '-'}
                      </Texto>
                    </div>
                    <div>
                      <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                        Lifting To
                      </Texto>
                      <Texto category="p1" weight="bold">
                        {selectedOffer?.pickupWindowEnd
                          ? dayjs(selectedOffer.pickupWindowEnd).format('MMM D, YYYY h:mm A')
                          : '-'}
                      </Texto>
                    </div>
                  </div>

                  {/* Volume */}
                  <div style={{ marginBottom: 16 }}>
                    <Texto category="p2" style={{ color: '#595959', marginBottom: 4, display: 'block' }}>
                      Volume
                    </Texto>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <Form.Item
                        name="Volume"
                        rules={[
                          { required: true, message: 'Volume is required' },
                          {
                            validator: (_, value) => {
                              if (value != null && selectedOffer) {
                                if (value < selectedOffer.minPerOrder)
                                  return Promise.reject(
                                    `Min ${formatVolume(selectedOffer.minPerOrder)} gal`,
                                  );
                                if (value > selectedOffer.maxPerOrder)
                                  return Promise.reject(
                                    `Max ${formatVolume(selectedOffer.maxPerOrder)} gal`,
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
                          step={selectedOffer?.volumeIncrement ?? 1000}
                          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(v) => v?.replace(/,/g, '') as any}
                        />
                      </Form.Item>
                      <BBDTag style={{ marginTop: 4 }}>GAL</BBDTag>
                    </div>
                  </div>

                  {/* Loading Numbers */}
                  <div>
                    <Texto weight="bold" style={{ textTransform: 'uppercase', letterSpacing: '1px', color: '#595959', marginBottom: 8 }}>
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

                {/* ============================================ */}
                {/* COLUMN 2 — PRICING                           */}
                {/* ============================================ */}
                <Vertical flex={4} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 32 }}>
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

                  {/* Formula name */}
                  <div style={{ marginBottom: 20 }}>
                    <Texto category="p1" weight="bold" style={{ lineHeight: '1.5' }}>
                      {selectedOffer?.formulaName ?? '-'}
                    </Texto>
                  </div>

                  {/* Contract Differential box */}
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
                      <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <Texto category="p2" style={{ color: '#595959' }}>
                          Your Bid Differential
                        </Texto>
                        <BBDTag style={{ backgroundColor: '#1890ff', color: '#fff', fontSize: 11 }}>BID</BBDTag>
                      </Horizontal>
                      <Form.Item name="BidPrice" style={{ margin: 0 }} className="bid-differential-input">
                        <InputNumber
                          placeholder={selectedOffer?.formulaDifferential?.toFixed(4)}
                          precision={4}
                          step={0.0001}
                          size="large"
                          prefix="$"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Texto category="p2" style={{ color: '#8c8c8c', marginTop: 10, fontSize: 12 }}>
                        Offer differential: {formatDifferential(selectedOffer?.formulaDifferential)}
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
                      <Texto style={{ fontSize: 28, fontWeight: 700, whiteSpace: 'nowrap', color: '#262626', letterSpacing: '-0.5px' }}>
                        {formatDifferential(selectedOffer?.formulaDifferential)}
                      </Texto>
                      <Texto category="p2" style={{ color: '#8c8c8c', marginTop: 6, fontSize: 12 }}>
                        per gallon
                      </Texto>
                    </div>
                  )}

                  {/* Bid Expiration — only visible in bid mode */}
                  {isBid && (
                    <div style={{ marginBottom: 24 }}>
                      <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                        Bid Expiration
                      </Texto>
                      <Form.Item
                        name="BidExpiration"
                        rules={[{ required: true, message: 'Bid expiration is required' }]}
                        initialValue={selectedOffer ? dayjs(selectedOffer.defaultBidExpiry) : undefined}
                        style={{ margin: 0 }}
                      >
                        <DatePicker
                          format="MM/DD/YYYY hh:mm A"
                          showTime={{ format: 'HH:mm', use12Hours: true }}
                          style={{ width: '100%', maxWidth: 280 }}
                          disabledDate={(date) =>
                            selectedOffer
                              ? date.isAfter(dayjs(selectedOffer.maximumBidExpiry))
                              : false
                          }
                          placeholder="Select Date and Time"
                        />
                      </Form.Item>
                    </div>
                  )}

                  {/* Formula Components */}
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
                      <Texto category="p2" weight="bold" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: '#595959', fontSize: 12 }}>
                        Formula Components
                      </Texto>
                    </div>
                    {(selectedOffer?.formulaVariables ?? []).map((item, idx) => (
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
                      <Texto style={{ fontSize: 13, color: '#595959' }}>Contract Differential</Texto>
                      <Texto weight="bold" style={{ fontSize: 13, color: isBid ? '#1890ff' : '#52c41a' }}>
                        {isBid ? 'Your Bid' : formatDifferential(selectedOffer?.formulaDifferential)}
                      </Texto>
                    </div>
                  </div>
                </Vertical>

                {/* ============================================ */}
                {/* COLUMN 3 — ADDITIONAL TERMS                  */}
                {/* ============================================ */}
                <Vertical flex={3} style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 32 }}>
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

                  {/* Pricing rules — consistent 2-column grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 24px', marginBottom: 22 }}>
                    <div>
                      <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                        Price Validity
                      </Texto>
                      <Texto category="p1" weight="bold">
                        {selectedOffer?.priceValidity ?? '-'}
                      </Texto>
                    </div>
                    <div>
                      <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                        Weekend Rule
                      </Texto>
                      <Texto category="p1" weight="bold">
                        {selectedOffer?.weekendRule ?? '-'}
                      </Texto>
                    </div>
                    <div>
                      <Texto category="p2" style={{ color: '#595959', marginBottom: 4 }}>
                        Holiday Rule
                      </Texto>
                      <Texto category="p1" weight="bold">
                        {selectedOffer?.holidayRule ?? '-'}
                      </Texto>
                    </div>
                  </div>

                  {/* Terms text */}
                  <Texto
                    category="p2"
                    weight="bold"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: '#595959', marginBottom: 12 }}
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
                    <Texto style={{ fontSize: 13, color: '#595959', lineHeight: '1.6' }}>
                      {selectedOffer?.additionalTerms || 'N/A'}
                    </Texto>
                  </div>
                </Vertical>
              </Horizontal>
            </Vertical>
          </Form>
        </Spin>

        {/* ---- FOOTER ---- */}
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
    </div>
  );
}
