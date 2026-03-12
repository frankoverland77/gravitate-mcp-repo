import { MoreOutlined } from '@ant-design/icons';
import { GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Menu, Popover, Switch, Tooltip } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useMemo, useRef, useState } from 'react';
import moment from 'moment';

import type { AllPricesRow, PriceInstrumentContext } from '../shared/types';
import { mockAllPricesRows } from '../shared/mockData';
import { PriceManagementDrawer } from '../shared/PriceManagementDrawer';

// ─── All Prices Grid Column Defs ────────────────────────────────────────────

function getAllPricesColumnDefs(
  onUploadPrice: (row: AllPricesRow) => void,
  hasPermission: boolean,
): ColDef[] {
  return [
    { field: 'InstrumentName', headerName: 'Instrument Name', flex: 2, minWidth: 220 },
    { field: 'Product', headerName: 'Product', width: 130 },
    { field: 'Location', headerName: 'Location', width: 160 },
    { field: 'Counterparty', headerName: 'Counterparty', width: 160 },
    {
      field: 'EffectiveFrom',
      headerName: 'Eff From',
      width: 120,
      valueFormatter: ({ value }: any) => (value ? moment(value).format('MM/DD/YYYY') : ''),
    },
    {
      field: 'EffectiveTo',
      headerName: 'Eff To',
      width: 110,
      valueFormatter: ({ value }: any) => {
        if (!value) return '';
        return moment(value).year() >= 9999 ? 'max' : moment(value).format('MM/DD/YYYY');
      },
    },
    {
      field: 'Price',
      headerName: 'Price',
      width: 120,
      cellStyle: { textAlign: 'right', fontWeight: '600' },
      valueFormatter: ({ value }: any) =>
        value != null
          ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
          : '\u2014',
    },
    { field: 'PriceType', headerName: 'Type', width: 110 },
    { field: 'Publisher', headerName: 'Publisher', width: 100 },
    {
      field: 'Status',
      headerName: 'Status',
      width: 90,
      cellStyle: (params: any) => ({
        color: params.value === 'Estimate' ? 'var(--theme-color-1)' : 'var(--theme-text)',
        fontStyle: params.value === 'Estimate' ? 'italic' : 'normal',
      }),
    },
    {
      field: 'UpdatedDateTime',
      headerName: 'Updated',
      width: 160,
      valueFormatter: ({ value }: any) => (value ? moment(value).format('MM/DD/YY hh:mm A') : ''),
    },
    {
      field: '_actions',
      headerName: '',
      width: 50,
      sortable: false,
      filter: false,
      pinned: 'right',
      cellRenderer: ({ data }: { data: AllPricesRow }) => {
        if (data.Source !== 'Database') return null;

        return (
          <ActionMenu
            row={data}
            onUploadPrice={onUploadPrice}
            hasPermission={hasPermission}
          />
        );
      },
    },
  ];
}

// ─── Action Menu (ellipsis dots → popover with menu) ────────────────────────

function ActionMenu({
  row,
  onUploadPrice,
  hasPermission,
}: {
  row: AllPricesRow;
  onUploadPrice: (row: AllPricesRow) => void;
  hasPermission: boolean;
}) {
  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === 'uploadPrice') {
          onUploadPrice(row);
        }
        setVisible(false);
      }}
    >
      <Menu.Item key="uploadPrice" disabled={!hasPermission}>
        {hasPermission ? 'Upload Price' : (
          <Tooltip title="You do not have price upload permission">
            <span style={{ color: 'var(--theme-text-disabled)' }}>Upload Price</span>
          </Tooltip>
        )}
      </Menu.Item>
    </Menu>
  );

  return (
    <Popover
      content={menu}
      trigger="click"
      placement="bottomRight"
      visible={visible}
      onVisibleChange={setVisible}
      overlayStyle={{ padding: 0 }}
    >
      <GraviButton
        size="small"
        type="link"
        icon={<MoreOutlined style={{ fontSize: 16 }} />}
        style={{ border: 'none', boxShadow: 'none' }}
      />
    </Popover>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export function AllPricesPage() {
  const [hasPermission, setHasPermission] = useState(true);
  const [gridRowData, setGridRowData] = useState(mockAllPricesRows);

  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedInstrumentContext, setSelectedInstrumentContext] = useState<PriceInstrumentContext | null>(null);

  // Handle "Upload Price" action from grid
  const handleUploadPrice = useCallback((row: AllPricesRow) => {
    setSelectedInstrumentContext({
      instrumentId: row.PriceInstrumentId,
      instrumentName: row.InstrumentName,
      product: row.Product,
      location: row.Location,
      counterparty: row.Counterparty,
      currentPrice: row.Price,
      priceType: row.PriceType,
      publisher: row.Publisher,
      effectiveFrom: row.EffectiveFrom,
      effectiveTo: row.EffectiveTo,
      asOfDate: row.UpdatedDateTime,
    });
    setDrawerVisible(true);
  }, []);

  // Handle successful save — refresh grid row
  const handleSaveSuccess = useCallback((instrumentId: number, newPrice: number) => {
    setGridRowData((prev) =>
      prev.map((row) =>
        row.PriceInstrumentId === instrumentId
          ? {
              ...row,
              Price: newPrice,
              UpdatedDateTime: new Date().toISOString(),
              Status: 'Actual' as const,
            }
          : row
      )
    );
    setDrawerVisible(false);
    setSelectedInstrumentContext(null);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false);
    setSelectedInstrumentContext(null);
  }, []);

  const columnDefs = useMemo(
    () => getAllPricesColumnDefs(handleUploadPrice, hasPermission),
    [handleUploadPrice, hasPermission]
  );

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.PriceId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
    }),
    []
  );

  return (
    <Vertical height="100%">
      {/* ── INSTRUCTION BAR ──────────────────────────────────── */}
      <div className="p-4 bg-2 bordered" style={{ borderBottom: '1px solid var(--theme-border)', flexShrink: 0 }}>
        <Horizontal verticalCenter>
          <Vertical flex="1">
            <Texto category="h5">All Prices</Texto>
            <Texto appearance="medium" style={{ marginTop: 4, fontSize: 13 }}>
              View all price instruments. Click the action menu (&#8943;) on any database-sourced row to upload or correct a price inline.
            </Texto>
          </Vertical>
          <Horizontal verticalCenter style={{ gap: 8 }}>
            <Texto style={{ fontSize: 13 }}>Has price upload permission</Texto>
            <Switch checked={hasPermission} onChange={setHasPermission} size="small" />
          </Horizontal>
        </Horizontal>
      </div>

      {/* ── ALL PRICES GRID ──────────────────────────────────── */}
      <Horizontal flex="1">
        <Vertical height="100%">
          <GraviGrid
            storageKey="PriceMgmt-AllPrices"
            controlBarProps={{
              title: `All Prices (${gridRowData.length})`,
              hideActiveFilters: false,
            }}
            agPropOverrides={agPropOverrides}
            rowData={gridRowData}
            columnDefs={columnDefs}
          />
        </Vertical>
      </Horizontal>

      {/* ── PRICE MANAGEMENT DRAWER ──────────────────────────── */}
      <PriceManagementDrawer
        visible={drawerVisible}
        instrumentContext={selectedInstrumentContext}
        onSaveSuccess={handleSaveSuccess}
        onClose={handleCloseDrawer}
      />
    </Vertical>
  );
}
