import { CloseOutlined, ExperimentFilled, MoreOutlined } from '@ant-design/icons';
import { GraviButton, GraviGrid, Vertical } from '@gravitate-js/excalibrr';
import { Menu, Popover, Select, Switch, Tooltip } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFeatureMode } from '@contexts/FeatureModeContext';
import dayjs from 'dayjs';

import type { AllPricesRow, PriceInstrumentContext } from '../shared/types';
import { mockAllPricesRows } from '../shared/mockData';
import { PriceManagementDrawer } from '../shared/PriceManagementDrawer';
import { RevaluationConfirmModal } from '../shared/RevaluationConfirmModal';
import { RevaluationWizardModal } from '../shared/RevaluationWizardModal';
import { shouldShowRevaluationModal } from '../shared/shouldShowRevaluationModal';
import { getStatusCellStyle } from '../shared/statusStyles';
import { PRICE_MANAGEMENT_STYLES } from '../shared/priceManagement.styles';

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
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YYYY') : ''),
    },
    {
      field: 'EffectiveTo',
      headerName: 'Eff To',
      width: 110,
      valueFormatter: ({ value }: any) => {
        if (!value) return '';
        return dayjs(value).year() >= 9999 ? 'max' : dayjs(value).format('MM/DD/YYYY');
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
      cellStyle: (params: any) => getStatusCellStyle(params.value),
    },
    {
      field: 'UpdatedDateTime',
      headerName: 'Updated',
      width: 160,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YY hh:mm A') : ''),
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
      items={[
        {
          key: 'uploadPrice',
          disabled: !hasPermission,
          label: hasPermission ? 'Upload Price' : (
            <Tooltip title="You do not have price upload permission">
              <span style={{ color: 'var(--theme-text-disabled)' }}>Upload Price</span>
            </Tooltip>
          ),
        },
      ]}
    />
  );

  return (
    <Popover
      content={menu}
      trigger="click"
      placement="bottomRight"
      open={visible}
      onOpenChange={setVisible}
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

// ─── Demo Options FAB ────────────────────────────────────────────────────────

function DemoOptionsFab({
  hasPermission,
  setHasPermission,
}: {
  hasPermission: boolean;
  setHasPermission: (v: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { featureMode, setFeatureMode } = useFeatureMode();

  useEffect(() => {
    if (!expanded) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [expanded]);

  return (
    <div className="ap-fab-container" ref={containerRef}>
      <div className={`ap-fab-panel ${expanded ? 'visible' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Demo Options</span>
          <button className="ap-fab-close" onClick={() => setExpanded(false)} aria-label="Close">
            <CloseOutlined />
          </button>
        </div>
        <div className="ap-fab-option">
          <span style={{ fontSize: 13 }}>Mode</span>
          <Select
            value={featureMode}
            onChange={setFeatureMode}
            size="small"
            style={{ width: 120 }}
            options={[
              { value: 'mvp', label: 'MVP' },
              { value: 'future-state', label: 'Future' },
            ]}
          />
        </div>
        <div className="ap-fab-option">
          <span style={{ fontSize: 13 }}>Upload Permission</span>
          <Switch checked={hasPermission} onChange={setHasPermission} size="small" />
        </div>
      </div>
      <button
        className="ap-fab-button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label="Demo options"
        title="Demo Options"
      >
        <ExperimentFilled />
      </button>
    </div>
  );
}

const AP_FAB_STYLES = `
  .ap-fab-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; }
  .ap-fab-button {
    width: 48px; height: 48px; border-radius: 50%;
    background-color: #1890ff; color: white; border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.3s ease;
  }
  .ap-fab-button:hover { background-color: #40a9ff; box-shadow: 0 6px 16px rgba(0,0,0,0.2); transform: scale(1.05); }
  .ap-fab-button:focus { outline: 2px solid #1890ff; outline-offset: 2px; }
  .ap-fab-panel {
    position: absolute; bottom: 60px; right: 0;
    background: white; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 12px; min-width: 220px;
    opacity: 0; transform: translateY(10px); pointer-events: none;
    transition: all 0.3s ease;
  }
  .ap-fab-panel.visible { opacity: 1; transform: translateY(0); pointer-events: all; }
  .ap-fab-option {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 0; font-size: 13px;
  }
  .ap-fab-close {
    width: 20px; height: 20px; border: none; background: #f5f5f5;
    border-radius: 50%; cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 10px; color: #666; transition: all 0.2s ease;
  }
  .ap-fab-close:hover { background: #e8e8e8; color: #333; }
`;

// ─── Main Page Component ────────────────────────────────────────────────────

export function AllPricesPage() {
  const [hasPermission, setHasPermission] = useState(true);
  const [gridRowData, setGridRowData] = useState(mockAllPricesRows);

  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedInstrumentContext, setSelectedInstrumentContext] = useState<PriceInstrumentContext | null>(null);

  // Post-save green highlight
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);

  // Revaluation modal state
  const [revalConfirmOpen, setRevalConfirmOpen] = useState(false);
  const [revalWizardOpen, setRevalWizardOpen] = useState(false);
  const [revalContext, setRevalContext] = useState<{ instrumentId: number; instrumentName: string; effectiveFromDate: string; effectiveToDate?: string } | null>(null);

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

  // Handle successful save — refresh grid row, green highlight, check revaluation trigger
  const handleSaveSuccess = useCallback((instrumentId: number, newPrice: number, effectiveFromDate?: string, effectiveToDate?: string) => {
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

    // Green highlight for 3 seconds
    const updatedRow = gridRowData.find((r) => r.PriceInstrumentId === instrumentId);
    if (updatedRow) {
      setHighlightedRowId(updatedRow.PriceId);
      setTimeout(() => setHighlightedRowId(null), 3000);
    }

    // Check if revaluation modal should show (only when user entered an effective date)
    const ctx = selectedInstrumentContext;
    if (ctx && effectiveFromDate && shouldShowRevaluationModal(effectiveFromDate)) {
      setRevalContext({
        instrumentId: ctx.instrumentId,
        instrumentName: ctx.instrumentName,
        effectiveFromDate,
        effectiveToDate,
      });
      setRevalConfirmOpen(true);
    }

    setSelectedInstrumentContext(null);
  }, [selectedInstrumentContext, gridRowData]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerVisible(false);
    setSelectedInstrumentContext(null);
  }, []);

  const handleRevalDismiss = useCallback(() => {
    setRevalConfirmOpen(false);
    setRevalContext(null);
  }, []);

  const handleRevalCheckImpacted = useCallback(() => {
    setRevalConfirmOpen(false);
    setRevalWizardOpen(true);
  }, []);

  const handleRevalWizardClose = useCallback(() => {
    setRevalWizardOpen(false);
    setRevalContext(null);
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
      getRowClass: (params: any) => {
        if (params.data?.PriceId === highlightedRowId) return 'pm-save-highlight';
        return '';
      },
    }),
    [highlightedRowId]
  );

  return (
    <Vertical>
      {/* ── ALL PRICES GRID ──────────────────────────────────── */}
      <GraviGrid
        storageKey="PriceMgmt-AllPrices"
        controlBarProps={{
          title: `All Prices (${gridRowData.length})`,
          hideActiveFilters: false,
          actionButtons: null,
        }}
        agPropOverrides={agPropOverrides}
        rowData={gridRowData}
        columnDefs={columnDefs}
      />

      {/* ── PRICE MANAGEMENT DRAWER ──────────────────────────── */}
      <PriceManagementDrawer
        open={drawerVisible}
        instrumentContext={selectedInstrumentContext}
        onSaveSuccess={handleSaveSuccess}
        onClose={handleCloseDrawer}
      />

      {/* ── REVALUATION CONFIRM MODAL ────────────────────────── */}
      <RevaluationConfirmModal
        open={revalConfirmOpen}
        onDismiss={handleRevalDismiss}
        onCheckImpacted={handleRevalCheckImpacted}
      />

      {/* ── REVALUATION WIZARD MODAL ─────────────────────────── */}
      <RevaluationWizardModal
        open={revalWizardOpen}
        onClose={handleRevalWizardClose}
        context={revalContext}
        skipStep1
      />

      <DemoOptionsFab hasPermission={hasPermission} setHasPermission={setHasPermission} />
      <style>{PRICE_MANAGEMENT_STYLES}{AP_FAB_STYLES}</style>
    </Vertical>
  );
}
