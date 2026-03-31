import { CloseOutlined, ExperimentFilled, MoreOutlined } from '@ant-design/icons';
import { BBDTag, GraviButton, GraviGrid, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Menu, Popover, Select, Switch, Tooltip } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFeatureMode } from '@contexts/FeatureModeContext';
import dayjs from 'dayjs';

import type { ContractDetailVariableRow, PriceInstrumentContext } from '../shared/types';
import { mockContractDetailHeader, mockContractDetailVariables } from '../shared/mockData';
import { PriceManagementDrawer } from '../shared/PriceManagementDrawer';
import { getStatusCellStyle, STATUS_COLOR_MAP } from '../shared/statusStyles';
import { PRICE_MANAGEMENT_STYLES } from '../shared/priceManagement.styles';

// ─── Variable Action Menu ───────────────────────────────────────────────────

function VariableActionMenu({
  row,
  hasPermission,
  onUploadPrice,
}: {
  row: ContractDetailVariableRow;
  hasPermission: boolean;
  onUploadPrice: (row: ContractDetailVariableRow) => void;
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

// ─── Variable Grid Column Defs ──────────────────────────────────────────────

function getVariableColumnDefs(
  hasPermission: boolean,
  onUploadPrice: (row: ContractDetailVariableRow) => void,
): ColDef[] {
  return [
    { field: 'Component', headerName: 'Component', flex: 1, minWidth: 140 },
    { field: 'Source', headerName: 'Source', width: 140 },
    { field: 'InstrumentName', headerName: 'Instrument', flex: 1, minWidth: 200,
      valueFormatter: ({ value }: any) => value || '\u2014',
    },
    {
      field: 'Value',
      headerName: 'Value',
      width: 130,
      cellStyle: { textAlign: 'right', fontWeight: '600' },
      valueFormatter: ({ value }: any) =>
        value != null
          ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
          : '\u2014',
    },
    { field: 'PriceType', headerName: 'Price Type', width: 110 },
    {
      field: 'EffectiveDate',
      headerName: 'Effective Date',
      width: 160,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YY hh:mm A') : ''),
    },
    {
      field: 'Status',
      headerName: 'Status',
      width: 100,
      cellStyle: (params: any) => getStatusCellStyle(params.value),
    },
    {
      field: '_actions',
      headerName: '',
      width: 50,
      sortable: false,
      filter: false,
      pinned: 'right',
      cellRenderer: ({ data }: { data: ContractDetailVariableRow }) => {
        if (data.Source !== 'Database') return <span style={{ color: 'var(--theme-text-disabled)' }}>{'\u2014'}</span>;
        return <VariableActionMenu row={data} hasPermission={hasPermission} onUploadPrice={onUploadPrice} />;
      },
    },
  ];
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
    <div className="cd-fab-container" ref={containerRef}>
      <div className={`cd-fab-panel ${expanded ? 'visible' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Demo Options</span>
          <button className="cd-fab-close" onClick={() => setExpanded(false)} aria-label="Close">
            <CloseOutlined />
          </button>
        </div>
        <div className="cd-fab-option">
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
        <div className="cd-fab-option">
          <span style={{ fontSize: 13 }}>Upload Permission</span>
          <Switch checked={hasPermission} onChange={setHasPermission} size="small" />
        </div>
      </div>
      <button
        className="cd-fab-button"
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

const CD_FAB_STYLES = `
  .cd-fab-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; }
  .cd-fab-button {
    width: 48px; height: 48px; border-radius: 50%;
    background-color: #1890ff; color: white; border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.3s ease;
  }
  .cd-fab-button:hover { background-color: #40a9ff; box-shadow: 0 6px 16px rgba(0,0,0,0.2); transform: scale(1.05); }
  .cd-fab-button:focus { outline: 2px solid #1890ff; outline-offset: 2px; }
  .cd-fab-panel {
    position: absolute; bottom: 60px; right: 0;
    background: white; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 12px; min-width: 220px;
    opacity: 0; transform: translateY(10px); pointer-events: none;
    transition: all 0.3s ease;
  }
  .cd-fab-panel.visible { opacity: 1; transform: translateY(0); pointer-events: all; }
  .cd-fab-option {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 0; font-size: 13px;
  }
  .cd-fab-close {
    width: 20px; height: 20px; border: none; background: #f5f5f5;
    border-radius: 50%; cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 10px; color: #666; transition: all 0.2s ease;
  }
  .cd-fab-close:hover { background: #e8e8e8; color: #333; }
`;

// ─── Main Page Component ────────────────────────────────────────────────────

export function ContractDetailPage() {
  const [hasPermission, setHasPermission] = useState(true);
  const [variableRows, setVariableRows] = useState(mockContractDetailVariables);
  const header = mockContractDetailHeader;

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInstrumentContext, setSelectedInstrumentContext] = useState<PriceInstrumentContext | null>(null);

  // Post-save green highlight
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);

  // Handle "Upload Price" from variable action menu
  const handleUploadPrice = useCallback((row: ContractDetailVariableRow) => {
    setSelectedInstrumentContext({
      instrumentId: row.PriceInstrumentId,
      instrumentName: row.InstrumentName,
      product: header.Product,
      location: header.Location,
      counterparty: header.Counterparty,
      currentPrice: row.Value,
      priceType: row.PriceType,
      publisher: '',
      effectiveFrom: row.EffectiveDate,
      effectiveTo: header.EffectiveTo,
      asOfDate: row.EffectiveDate,
    });
    setDrawerOpen(true);
  }, [header]);

  // Handle successful save — update variable row + green highlight + close drawer
  const handleSaveSuccess = useCallback((instrumentId: number, newPrice: number) => {
    setVariableRows((prev) =>
      prev.map((row) =>
        row.PriceInstrumentId === instrumentId
          ? { ...row, Value: newPrice, Status: 'Actual' as const, EffectiveDate: new Date().toISOString() }
          : row,
      ),
    );
    setDrawerOpen(false);

    // Green highlight for 3 seconds
    const updatedVar = variableRows.find((r) => r.PriceInstrumentId === instrumentId);
    if (updatedVar) {
      setHighlightedRowId(updatedVar.VariableId);
      setTimeout(() => setHighlightedRowId(null), 3000);
    }

    NotificationMessage('Price saved successfully', `${selectedInstrumentContext?.instrumentName ?? 'Instrument'} updated.`, false);
    setSelectedInstrumentContext(null);
  }, [selectedInstrumentContext, variableRows]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedInstrumentContext(null);
  }, []);

  const columnDefs = useMemo(
    () => getVariableColumnDefs(hasPermission, handleUploadPrice),
    [hasPermission, handleUploadPrice],
  );

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.VariableId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
      domLayout: 'autoHeight' as const,
      getRowClass: (params: any) => {
        if (params.data?.VariableId === highlightedRowId) return 'pm-save-highlight';
        return '';
      },
    }),
    [highlightedRowId],
  );

  return (
    <Vertical>
      {/* ── CONTRACT HEADER CARD ─────────────────────────────── */}
      <div className="p-4" style={{ flexShrink: 0, borderBottom: '1px solid var(--theme-border)' }}>
        <Horizontal verticalCenter>
          <Vertical flex="1" gap={8}>
            <Horizontal verticalCenter gap={12}>
              <Texto category="h5" style={{ fontWeight: 600 }}>{header.ContractNumber}</Texto>
              <BBDTag success>{header.Product}</BBDTag>
              <BBDTag success>{header.Location}</BBDTag>
              <BBDTag success>{header.Counterparty}</BBDTag>
            </Horizontal>
            <Horizontal gap={24}>
              <Texto appearance="medium" style={{ fontSize: 13 }}>
                Formula: <span style={{ fontWeight: 600, color: 'var(--theme-text)' }}>{header.FormulaName}</span>
              </Texto>
              <Texto appearance="medium" style={{ fontSize: 13 }}>
                {dayjs(header.EffectiveFrom).format('MM/DD/YYYY')} — {dayjs(header.EffectiveTo).format('MM/DD/YYYY')}
              </Texto>
            </Horizontal>
          </Vertical>
          <Vertical style={{ textAlign: 'right' }}>
            <Texto category="h3">
              {header.TotalValue != null
                ? `$${header.TotalValue.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`
                : '\u2014'}
            </Texto>
            <Texto style={{ fontSize: 13, fontWeight: 600, color: STATUS_COLOR_MAP[header.Status] || 'var(--theme-text)' }}>
              {header.Status}
            </Texto>
          </Vertical>
        </Horizontal>
      </div>

      {/* ── VARIABLES GRID ───────────────────────────────────── */}
      <GraviGrid
        storageKey="PriceMgmt-ContractDetail-Variables"
        controlBarProps={{
          title: `Pricing Variables (${variableRows.length})`,
          hideActiveFilters: true,
          actionButtons: null,
        }}
        agPropOverrides={agPropOverrides}
        rowData={variableRows}
        columnDefs={columnDefs}
      />

      {/* ── PRICE MANAGEMENT DRAWER ──────────────────────────── */}
      <PriceManagementDrawer
        open={drawerOpen}
        instrumentContext={selectedInstrumentContext}
        onSaveSuccess={handleSaveSuccess}
        onClose={handleCloseDrawer}
      />

      <DemoOptionsFab hasPermission={hasPermission} setHasPermission={setHasPermission} />
      <style>{PRICE_MANAGEMENT_STYLES}{CD_FAB_STYLES}</style>
    </Vertical>
  );
}
