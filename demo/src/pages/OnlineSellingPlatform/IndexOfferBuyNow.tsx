import { useMemo, useState, useCallback } from 'react';
import {
  GraviGrid,
  GraviButton,
  Texto,
  Horizontal,
} from '@gravitate-js/excalibrr';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import {
  IndexOfferRow,
  generateIndexOffers,
  formatDifferential,
  formatVolume,
} from './components/indexOfferData';
import { IndexOfferPlaceOrderDrawer } from './components/IndexOfferPlaceOrderDrawer';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IndexOfferBuyNow() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<IndexOfferRow | null>(null);
  const [form] = Form.useForm();

  const rowData = useMemo(() => generateIndexOffers(12), []);

  const handlePlaceOrder = useCallback((offer: IndexOfferRow) => {
    setSelectedOffer(offer);
    setDrawerVisible(true);
    form.resetFields();
  }, [form]);

  const handleClose = () => {
    setDrawerVisible(false);
    setSelectedOffer(null);
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


      <IndexOfferPlaceOrderDrawer
        open={drawerVisible}
        offer={selectedOffer}
        onClose={handleClose}
        form={form}
      />
    </div>
  );
}
