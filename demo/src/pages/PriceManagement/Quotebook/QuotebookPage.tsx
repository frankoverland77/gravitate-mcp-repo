import {
  LinkOutlined,
  MoreOutlined,
  FileTextOutlined,
  SyncOutlined,
  SaveOutlined,
  CloudServerOutlined,
  ArrowsAltOutlined,
  ShrinkOutlined,
  EnvironmentFilled,
  ExperimentFilled,
  CloseOutlined,
  BarChartOutlined,
  LineChartOutlined,
  ClockCircleFilled,
  ExclamationCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import { BBDTag, GraviButton, GraviGrid, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Drawer, Menu, Popover, Select, Switch, Tooltip } from 'antd';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useFeatureMode } from '@contexts/FeatureModeContext';

import type {
  FormulaBreakdownDetail,
  FormulaResultComponent,
  PriceInstrumentContext,
  PublicationMode,
  QuotebookGroup,
  QuotebookRow,
} from '../shared/types';
import { mockQuotebookRows, mockQuotebookGroups, mockFormulaBreakdowns } from '../shared/mockData';
import { PriceManagementDrawer } from '../shared/PriceManagementDrawer';
import { getComponentCellStyle } from '../shared/statusStyles';
import { PRICE_MANAGEMENT_STYLES } from '../shared/priceManagement.styles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtCurrency = (v: number | null) =>
  v != null ? v.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '\u2014';

const getSign = (v: number) => (v > 0 ? '+' : '');

const PUBLICATION_MODE_OPTIONS = [
  { value: 'EndOfDay', label: 'End of Day' },
  { value: 'EndOfDayCurrentPeriod', label: 'Current Period' },
];

// ─── Quotebook Group Tabs ────────────────────────────────────────────────────

function QuotebookGroupTabs({
  groups,
  selectedGroups,
  onToggleGroup,
}: {
  groups: QuotebookGroup[];
  selectedGroups: string[];
  onToggleGroup: (name: string) => void;
}) {
  return (
    <Horizontal style={{ width: '100%', overflowX: 'scroll', flexShrink: 0 }}>
      {[...groups, { GroupId: -1, GroupName: 'Other' }].map((g) => {
        const isSelected = selectedGroups.includes(g.GroupName);
        return (
          <div
            key={g.GroupId}
            onClick={() => onToggleGroup(g.GroupName)}
            className={`p-3 ${isSelected ? 'bg-theme1' : 'bg-1'}`}
            style={{
              cursor: 'pointer',
              borderRadius: 6,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              border: '1px solid var(--gray-200)',
              borderBottom: 0,
            }}
          >
            <Texto weight="bold" appearance={isSelected ? 'white' : 'default'}>
              {g.GroupName}
            </Texto>
          </div>
        );
      })}
    </Horizontal>
  );
}

// ─── Action Buttons (in grid control bar) ────────────────────────────────────

function QuotebookActionButtons({
  publicationMode,
  setPublicationMode,
  hasPermission,
  showSpreadRows,
  setShowSpreadRows,
  showAnalytics,
  setShowAnalytics,
  publishMode,
  lastSaveDate,
}: {
  publicationMode: PublicationMode;
  setPublicationMode: (m: PublicationMode) => void;
  hasPermission: boolean;
  showSpreadRows: boolean;
  setShowSpreadRows: (v: boolean) => void;
  showAnalytics: boolean;
  setShowAnalytics: (v: boolean) => void;
  publishMode: boolean;
  lastSaveDate: string | null;
}) {
  return (
    <Horizontal alignItems="center" style={{ gap: '1rem' }}>
      {hasPermission && publicationMode !== 'IntraDay' && (
        <Horizontal alignItems="center" style={{ gap: '0.5rem' }}>
          <Texto>Publishing For</Texto>
          <Select
            options={PUBLICATION_MODE_OPTIONS}
            value={publicationMode}
            onChange={(v: string) => setPublicationMode(v as PublicationMode)}
            style={{ width: 150 }}
          />
        </Horizontal>
      )}

      <Tooltip title="Show spread rows">
        <Switch
          checked={showSpreadRows}
          onChange={setShowSpreadRows}
          checkedChildren={<ShrinkOutlined />}
          unCheckedChildren={<ArrowsAltOutlined />}
          className="mr-4"
        />
      </Tooltip>

      <Tooltip title={publishMode ? 'Cannot show analytics during publish' : 'Show analytics'}>
        <Switch
          checked={showAnalytics}
          onChange={setShowAnalytics}
          checkedChildren={<BarChartOutlined />}
          unCheckedChildren={<BarChartOutlined />}
          className="mr-4"
          disabled={publishMode}
        />
      </Tooltip>

      <Horizontal className="mr-4">
        {lastSaveDate && (
          <Texto appearance="secondary">
            Last Save: {lastSaveDate}
          </Texto>
        )}
      </Horizontal>
    </Horizontal>
  );
}

// ─── Publish Footer ──────────────────────────────────────────────────────────

function QuotebookPublishFooter({
  hasPermission,
  dirtyCount,
  onReset,
  onSave,
  onPublish,
}: {
  hasPermission: boolean;
  dirtyCount: number;
  onReset: () => void;
  onSave: () => void;
  onPublish: () => void;
}) {
  return (
    <Horizontal
      alignItems="center"
      justifyContent="space-between"
      className="px-4 py-2"
      style={{ borderTop: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-1)', flexShrink: 0 }}
    >
      <Horizontal alignItems="center" style={{ gap: '0.5rem' }}>
        <FileTextOutlined />
        <Texto appearance="medium">Quote Publisher</Texto>
      </Horizontal>

      {hasPermission && (
        <Horizontal style={{ gap: '8px' }}>
          <GraviButton buttonText="Reset" icon={<SyncOutlined />} size="large" onClick={onReset} />
          <GraviButton
            buttonText="Save Adjustments"
            icon={<SaveOutlined />}
            size="large"
            disabled={dirtyCount === 0}
            onClick={onSave}
          />
          <GraviButton
            theme1
            buttonText="Publish Prices"
            icon={<CloudServerOutlined />}
            size="large"
            onClick={onPublish}
          />
        </Horizontal>
      )}
    </Horizontal>
  );
}

// ─── Variable Action Menu (NET NEW — inside valuation drawer) ────────────────

function VariableActionMenu({
  component,
  hasPermission,
  onUploadPrice,
}: {
  component: FormulaResultComponent;
  hasPermission: boolean;
  onUploadPrice: (comp: FormulaResultComponent) => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover
      content={
        <Menu
          onClick={({ key }) => {
            if (key === 'uploadPrice') onUploadPrice(component);
            setPopoverOpen(false);
          }}
          items={[{
            key: 'uploadPrice',
            disabled: !hasPermission,
            label: hasPermission ? 'Upload Price' : (
              <Tooltip title="You do not have price upload permission">
                <span style={{ color: 'var(--theme-text-disabled)' }}>Upload Price</span>
              </Tooltip>
            ),
          }]}
        />
      }
      trigger="click"
      placement="bottomRight"
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
      overlayStyle={{ padding: 0 }}
    >
      <GraviButton
        size="small"
        type="link"
        icon={<MoreOutlined style={{ fontSize: 14 }} />}
        style={{ border: 'none', boxShadow: 'none' }}
      />
    </Popover>
  );
}

// ─── Valuation Drawer Content (matches production layout) ────────────────────

function ValuationDrawerContent({
  data,
  hasPermission,
  onUploadPrice,
}: {
  data: FormulaBreakdownDetail;
  hasPermission: boolean;
  onUploadPrice: (comp: FormulaResultComponent) => void;
}) {
  const columnDefs = useMemo((): ColDef[] => [
    { field: 'ComponentDisplayName', headerName: 'Component', flex: 1 },
    { field: 'ComponentName', headerName: 'Variable', flex: 1 },
    {
      field: 'ComponentResult',
      headerName: 'Value',
      width: 120,
      cellStyle: { textAlign: 'right', fontWeight: '600' },
      valueFormatter: ({ value }: any) =>
        value != null ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '\u2014',
    },
    {
      field: 'ComponentStatus',
      headerName: 'Status',
      width: 80,
      cellStyle: (params: any) => getComponentCellStyle(params.value),
    },
    { field: 'PriceTypeCodeValueDisplay', headerName: 'Type', width: 100 },
    { field: 'PriceInstrumentName', headerName: 'Instrument', flex: 2 },
    {
      field: 'EffectiveAsOfDate',
      headerName: 'As of Date',
      width: 160,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YYYY hh:mm A') : ''),
    },
    {
      field: '_actions',
      headerName: '',
      width: 50,
      sortable: false,
      filter: false,
      pinned: 'right',
      cellRenderer: ({ data: rowData }: { data: FormulaResultComponent }) => {
        if (!rowData.IsPriceVariable) return null;
        return (
          <VariableActionMenu
            component={rowData}
            hasPermission={hasPermission}
            onUploadPrice={onUploadPrice}
          />
        );
      },
    },
  ], [hasPermission, onUploadPrice]);

  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.FormulaResultComponentId.toString(),
    suppressDragLeaveHidesColumns: true,
    rowGroupPanelShow: 'never' as const,
  }), []);

  return (
    <Vertical height="100%">
      {/* ── Header (production layout: flex 5/2, h6 typography, tooltips) ── */}
      <Horizontal className="p-4 bg-2 bordered" style={{ flexShrink: 0 }}>
        <Vertical flex="5" style={{ gap: 10 }}>
          <Horizontal alignItems="center">
            <Tooltip title="Product">
              <BBDTag className="py-1" success>
                <Horizontal alignItems="center">
                  <ExperimentFilled style={{ marginRight: 5, fontSize: 12 }} />
                  <Texto category="h6">{data.ForProductName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
            <Texto category="h5" className="mr-2">@</Texto>
            <Tooltip title="Location">
              <BBDTag className="py-1" success>
                <Horizontal alignItems="center">
                  <EnvironmentFilled style={{ marginRight: 5, fontSize: 12 }} />
                  <Texto category="h6">{data.ForLocationName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
          </Horizontal>
          <Horizontal alignItems="center">
            <Texto className="mr-3 mt-1">COUNTERPARTY: </Texto>
            <Texto category="h6">{data.ForCounterPartyName}</Texto>
          </Horizontal>
        </Vertical>

        <Vertical flex="2" style={{ gap: 10 }}>
          <Horizontal alignItems="center" justifyContent="flex-end">
            <Texto category="p2" className="px-3">PRICE:</Texto>
            <Texto category="h4">
              {data.Result !== 0 ? `${getSign(data.Result)}${fmtCurrency(data.Result)}` : '\u2014'}
            </Texto>
          </Horizontal>
          <Horizontal alignItems="center" justifyContent="flex-end">
            <Texto category="p2" className="px-3">AS OF DATE:</Texto>
            <Texto category="h6">{dayjs(data.CalculationDate).format('MM/DD/YYYY hh:mm A')}</Texto>
          </Horizontal>
        </Vertical>
      </Horizontal>

      {/* ── Formula Info ── */}
      <Horizontal className="px-4 py-2" alignItems="center">
        <Texto className="mr-4">Formula Name:</Texto>
        <Texto category="h6">{data.CalculationName}</Texto>
      </Horizontal>
      <div
        className="mx-4"
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          padding: '12px 16px',
          backgroundColor: '#1e1e1e',
          color: '#f5f5f5',
          borderRadius: 6,
          border: '1px solid #333',
          whiteSpace: 'pre-wrap',
        }}
      >
        {data.Formula}
      </div>

      {/* ── Variables Grid ── */}
      <Horizontal flex="1" style={{ marginTop: 8 }}>
        <Vertical height="100%">
          <GraviGrid
            storageKey="QB-ValuationVariables"
            controlBarProps={{ title: 'Variables', hideActiveFilters: true }}
            agPropOverrides={agPropOverrides}
            rowData={data.ResultComponents}
            columnDefs={columnDefs}
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  );
}

// ─── Cost Status Symbol Colors (production: A/M/O/E) ────────────────────────

function getCostStatusStyle(symbol: string | null): React.CSSProperties {
  switch (symbol) {
    case 'A': return { color: 'var(--theme-success)' };
    case 'M': return { color: 'var(--theme-error)' };
    case 'O': return { color: 'var(--theme-warning)' };
    case 'E': return { fontStyle: 'italic' };
    default:  return { fontStyle: 'italic' };
  }
}

// ─── Benchmark Price Cell (blue clickable link for Cost columns) ─────────────

function BenchmarkPriceCell({
  value,
  hasValuation,
  statusSymbol,
  onClick,
}: {
  value: number | null;
  hasValuation: boolean;
  statusSymbol?: string | null;
  onClick: () => void;
}) {
  if (value == null) {
    return <span style={{ color: 'var(--gray-500)' }}>N/A</span>;
  }
  if (!hasValuation) {
    return <span style={{ fontWeight: 600 }}>{fmtCurrency(value)}</span>;
  }
  const symbolStyle = statusSymbol ? getCostStatusStyle(statusSymbol) : {};
  return (
    <Horizontal
      alignItems="center"
      justifyContent="flex-end"
      style={{ gap: '4px', width: '100%', cursor: 'pointer' }}
      onClick={onClick}
    >
      <LinkOutlined style={{ color: 'var(--theme-color-1)', fontSize: 12 }} />
      <span style={{ color: 'var(--theme-color-1)', textDecoration: 'underline', fontWeight: 600 }}>
        {fmtCurrency(value)}
      </span>
      {statusSymbol && (
        <span style={{ ...symbolStyle, fontSize: 11 }}>({statusSymbol})</span>
      )}
    </Horizontal>
  );
}

// ─── Published Indicator Color (production: green <2hrs, red >3days) ─────────

function getPublishedColor(latestQuoteDate: string | null): string {
  if (!latestQuoteDate) return 'var(--gray-400)';
  const hoursDiff = dayjs().diff(dayjs(latestQuoteDate), 'hour');
  if (hoursDiff < 2) return 'var(--theme-success)';
  if (hoursDiff > 72) return 'var(--theme-error)';
  return 'var(--theme-warning)';
}

// ─── Quotebook Grid Column Defs (production column sections) ─────────────────

function getQuotebookColumnDefs(
  onCostClick: (row: QuotebookRow) => void,
  onQuoteHistoryClick: (row: QuotebookRow) => void,
  hasPermission: boolean,
): (ColDef | ColGroupDef)[] {
  return [
    // Hidden grouping column
    {
      field: 'QuoteConfigurationName',
      rowGroup: true,
      rowGroupIndex: 0,
      hide: true,
    },
    // ── Price Info section ──
    {
      headerName: 'Price Info',
      marryChildren: true,
      children: [
        {
          headerName: '',
          width: 40,
          sortable: false,
          filter: false,
          cellRenderer: ({ data }: { data: QuotebookRow }) => {
            if (!data) return null;
            return (
              <LineChartOutlined
                style={{ color: 'var(--theme-color-1)', cursor: 'pointer', fontSize: 14 }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onQuoteHistoryClick(data);
                }}
              />
            );
          },
        },
        {
          field: 'NetOrGrossDisplay',
          headerName: 'Published',
          width: 100,
          cellRenderer: ({ data }: { data: QuotebookRow }) => {
            if (!data) return null;
            const color = getPublishedColor(data.LatestQuoteDate);
            const tooltip = data.LatestQuoteDate
              ? `Published ${dayjs(data.LatestQuoteDate).format('M/D h:mm A')}`
              : 'Not published';
            return (
              <Tooltip title={tooltip}>
                <Horizontal alignItems="center" style={{ gap: 4 }}>
                  <ClockCircleFilled style={{ color, fontSize: 12 }} />
                  <span>{data.NetOrGrossDisplay}</span>
                </Horizontal>
              </Tooltip>
            );
          },
        },
        {
          field: 'Exceptions',
          headerName: '',
          width: 40,
          sortable: false,
          filter: false,
          cellRenderer: ({ data }: { data: QuotebookRow }) => {
            if (!data || !data.Exceptions?.length) return null;
            const hasError = data.Exceptions.some((e) => e.Severity === 'Error');
            const message = data.Exceptions.map((e) => e.Message).join('; ');
            return (
              <Tooltip title={message}>
                {hasError
                  ? <CloseCircleFilled style={{ color: 'var(--theme-error)', fontSize: 14 }} />
                  : <ExclamationCircleFilled style={{ color: 'var(--theme-warning)', fontSize: 14 }} />
                }
              </Tooltip>
            );
          },
        },
        { field: 'LocationName', headerName: 'Location', flex: 1, minWidth: 130 },
        { field: 'ProductName', headerName: 'Product', width: 130 },
        { field: 'ProductGroup', headerName: 'Commodity', width: 110 },
      ],
    },
    // ── Current section ──
    {
      headerName: 'Current',
      marryChildren: true,
      children: [
        {
          field: 'SoldVolume',
          headerName: 'Sold Vol',
          width: 100,
          cellStyle: { textAlign: 'right' },
          valueFormatter: ({ value }: any) =>
            value != null ? Math.round(value).toLocaleString('en-US') : '\u2014',
        },
        {
          field: 'CurrentCost',
          headerName: 'Cost',
          width: 110,
          cellRenderer: ({ data }: { data: QuotebookRow }) => {
            if (!data) return null;
            return (
              <BenchmarkPriceCell
                value={data.CurrentCost}
                hasValuation={!!data.CostValuationId}
                onClick={() => onCostClick(data)}
              />
            );
          },
        },
        {
          field: 'CurrentDiff',
          headerName: 'Diff',
          width: 110,
          cellRenderer: ({ data }: { data: QuotebookRow }) => {
            if (!data || data.CurrentDiff == null) return '\u2014';
            const v = data.CurrentDiff;
            const color = v > 0 ? 'green' : v < 0 ? 'var(--theme-error)' : 'inherit';
            return (
              <span style={{ color, fontWeight: v !== 0 ? 'bold' : 'normal' }}>
                {getSign(v)}{fmtCurrency(v)}
              </span>
            );
          },
        },
        {
          field: 'CurrentPrice',
          headerName: 'Price',
          width: 110,
          cellStyle: { textAlign: 'right' },
          valueFormatter: ({ value }: any) => fmtCurrency(value),
        },
        {
          field: 'CurrentProfit',
          headerName: 'Profit',
          width: 100,
          cellStyle: { textAlign: 'right' },
          valueFormatter: ({ value }: any) =>
            value != null ? Math.round(value).toLocaleString('en-US') : '\u2014',
        },
      ],
    },
    // ── Proposed section ──
    {
      headerName: 'Proposed',
      marryChildren: true,
      children: [
        {
          field: 'Cost',
          headerName: 'Cost',
          width: 105,
          cellRenderer: ({ data }: { data: QuotebookRow }) => {
            if (!data) return null;
            if (data.Cost == null) {
              return <span style={{ color: 'var(--theme-error)', fontWeight: 600 }}>Missing</span>;
            }
            return (
              <BenchmarkPriceCell
                value={data.Cost}
                hasValuation={!!data.CostValuationId}
                statusSymbol={data.CostStatusSymbol}
                onClick={() => onCostClick(data)}
              />
            );
          },
        },
        {
          field: 'Adjustment',
          headerName: 'Diff',
          width: 120,
          editable: (params: any) => hasPermission && !params.data?.IsSpreadRow,
          cellRenderer: ({ data }: { data: QuotebookRow }) => {
            if (!data || data.Adjustment == null) return '\u2014';
            const v = data.Adjustment;
            let style: React.CSSProperties = {};
            if (v < 0) style = { color: 'var(--theme-error)', fontWeight: 'bold' };
            if (v > 0) style = { color: 'green', fontWeight: 'bold' };
            if (data.IsSpreadRow) style = { color: 'var(--gray-600)', fontStyle: 'italic' };
            return (
              <span style={style}>
                {getSign(v)}{fmtCurrency(v)}
              </span>
            );
          },
        },
        {
          field: 'ProposedPrice',
          headerName: 'Price',
          width: 120,
          cellStyle: (params: any) => {
            const base: any = { textAlign: 'right', fontWeight: 600 };
            if (params.data?.IsSpreadRow) {
              base.color = 'var(--gray-600)';
              base.fontStyle = 'italic';
            }
            return base;
          },
          valueFormatter: ({ value }: any) => fmtCurrency(value),
        },
        {
          field: 'ProposedPriceDelta',
          headerName: 'Price Delta',
          width: 110,
          cellStyle: (params: any) => ({
            textAlign: 'right',
            color: params.value > 0 ? 'var(--theme-success)' : params.value < 0 ? 'var(--theme-error)' : 'inherit',
          }) as any,
          valueFormatter: ({ value }: any) => (value != null ? `${getSign(value)}${fmtCurrency(value)}` : '\u2014'),
        },
        {
          field: 'Margin',
          headerName: 'Margin',
          width: 90,
          cellStyle: (params: any) => {
            const v = Number(params.value);
            const style: any = { fontWeight: 'bold', textAlign: 'right' };
            if (v < 0) style.backgroundColor = 'var(--theme-error-dim)';
            if (v > 0) style.backgroundColor = 'var(--theme-success-dim)';
            return style;
          },
          valueFormatter: ({ value }: any) => fmtCurrency(value),
        },
      ],
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

  // Close on click outside
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
    <div className="qb-fab-container" ref={containerRef}>
      <div className={`qb-fab-panel ${expanded ? 'visible' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Demo Options</span>
          <button className="qb-fab-close" onClick={() => setExpanded(false)} aria-label="Close">
            <CloseOutlined />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="qb-fab-option">
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

        {/* Permission toggle */}
        <div className="qb-fab-option">
          <span style={{ fontSize: 13 }}>Upload Permission</span>
          <Switch checked={hasPermission} onChange={setHasPermission} size="small" />
        </div>
      </div>

      <button
        className="qb-fab-button"
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

// ─── Quotebook-specific Styles ───────────────────────────────────────────────

const QUOTEBOOK_STYLES = `
  .qb-grid .ag-cell { font-size: 12px; }
  .qb-grid .ag-header-cell { font-size: 13px; font-weight: 900; padding: 0 8px; }
  .qb-grid .ag-header-group-cell { font-size: 13px; font-weight: 900; padding: 0 8px; }
  .qb-grid .ag-row-group { font-weight: 600; }

  .qb-fab-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; }
  .qb-fab-button {
    width: 48px; height: 48px; border-radius: 50%;
    background-color: #1890ff; color: white; border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.3s ease;
  }
  .qb-fab-button:hover { background-color: #40a9ff; box-shadow: 0 6px 16px rgba(0,0,0,0.2); transform: scale(1.05); }
  .qb-fab-button:focus { outline: 2px solid #1890ff; outline-offset: 2px; }
  .qb-fab-panel {
    position: absolute; bottom: 60px; right: 0;
    background: white; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 12px; min-width: 220px;
    opacity: 0; transform: translateY(10px); pointer-events: none;
    transition: all 0.3s ease;
  }
  .qb-fab-panel.visible { opacity: 1; transform: translateY(0); pointer-events: all; }
  .qb-fab-option {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 0; font-size: 13px;
  }
  .qb-fab-close {
    width: 20px; height: 20px; border: none; background: #f5f5f5;
    border-radius: 50%; cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 10px; color: #666; transition: all 0.2s ease;
  }
  .qb-fab-close:hover { background: #e8e8e8; color: #333; }
`;

// ─── Main Page Component ────────────────────────────────────────────────────

export function QuotebookPage() {
  // Permission & mode state
  const [hasPermission, setHasPermission] = useState(true);
  const [publicationMode, setPublicationMode] = useState<PublicationMode>('EndOfDay');
  const [showSpreadRows, setShowSpreadRows] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [publishMode, setPublishMode] = useState(false);

  // Group tab selection (all selected by default)
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    () => mockQuotebookGroups.map((g) => g.GroupName),
  );

  // Bulk change state
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false);
  const handleBulkUpdate = useCallback(async () => {
    NotificationMessage('Bulk Change', 'Bulk update applied.', false);
  }, []);

  // Dirty quote tracking
  const [dirtyQuoteIds, setDirtyQuoteIds] = useState<Set<number>>(new Set());

  // Valuation drawer state (Layer 1)
  const [valuationDrawerOpen, setValuationDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<QuotebookRow | null>(null);

  // Quote History drawer state
  const [quoteHistoryOpen, setQuoteHistoryOpen] = useState(false);
  const [quoteHistoryRow, setQuoteHistoryRow] = useState<QuotebookRow | null>(null);

  // Price drawer state (Layer 2 — nested inside valuation drawer)
  const [priceDrawerOpen, setPriceDrawerOpen] = useState(false);
  const [selectedInstrumentContext, setSelectedInstrumentContext] = useState<PriceInstrumentContext | null>(null);

  // Toggle group tab (prevent deselecting all)
  const handleToggleGroup = useCallback((groupName: string) => {
    setSelectedGroups((prev) => {
      const isSelected = prev.includes(groupName);
      if (isSelected && prev.length === 1) return prev;
      return isSelected ? prev.filter((g) => g !== groupName) : [...prev, groupName];
    });
  }, []);

  // Filter rows by selected groups
  const filteredRows = useMemo(
    () => mockQuotebookRows.filter((r) => selectedGroups.includes(r.QuoteConfigurationMappingGroup)),
    [selectedGroups],
  );

  // Cost click → open valuation drawer
  const handleCostClick = useCallback((row: QuotebookRow) => {
    setSelectedRow(row);
    setValuationDrawerOpen(true);
  }, []);

  // Quote History click → open history drawer
  const handleQuoteHistoryClick = useCallback((row: QuotebookRow) => {
    setQuoteHistoryRow(row);
    setQuoteHistoryOpen(true);
  }, []);

  // Variable action menu → open nested price drawer
  const handleUploadPrice = useCallback((comp: FormulaResultComponent) => {
    const breakdown = selectedRow?.CostValuationId ? mockFormulaBreakdowns[selectedRow.CostValuationId] : null;
    setSelectedInstrumentContext({
      instrumentId: comp.PriceInstrumentId,
      instrumentName: comp.PriceInstrumentName,
      product: breakdown?.ForProductName ?? '',
      location: breakdown?.ForLocationName ?? '',
      counterparty: breakdown?.ForCounterPartyName ?? '',
      currentPrice: comp.ComponentResult,
      priceType: comp.PriceTypeCodeValueDisplay,
      publisher: '',
      effectiveFrom: comp.EffectiveAsOfDate,
      effectiveTo: '',
      asOfDate: comp.EffectiveAsOfDate,
    });
    setPriceDrawerOpen(true);
  }, [selectedRow]);

  // Price save success → close inner drawer, show notification
  const handlePriceSaveSuccess = useCallback((_instrumentId: number, _newPrice: number) => {
    setPriceDrawerOpen(false);
    setSelectedInstrumentContext(null);
    NotificationMessage(
      'Price saved successfully',
      `${selectedInstrumentContext?.instrumentName ?? 'Instrument'} updated. Formula is being revalued.`,
      false,
    );
  }, [selectedInstrumentContext]);

  // Close valuation drawer — also closes nested price drawer
  const handleCloseValuationDrawer = useCallback(() => {
    setPriceDrawerOpen(false);
    setSelectedInstrumentContext(null);
    setValuationDrawerOpen(false);
    setSelectedRow(null);
  }, []);

  const handleClosePriceDrawer = useCallback(() => {
    setPriceDrawerOpen(false);
    setSelectedInstrumentContext(null);
  }, []);

  // Publish footer handlers
  const handleReset = useCallback(() => {
    setDirtyQuoteIds(new Set());
    NotificationMessage('Grid Reset', 'All adjustments have been reset.', false);
  }, []);

  const handleSaveAdjustments = useCallback(() => {
    NotificationMessage('Adjustments Saved', `${dirtyQuoteIds.size} quote(s) saved successfully.`, false);
    setDirtyQuoteIds(new Set());
  }, [dirtyQuoteIds]);

  const handlePublish = useCallback(() => {
    NotificationMessage('Publish', 'Publication workflow initiated.', false);
  }, []);

  // Last save date (most recent AdjustmentUpdatedDateTime)
  const lastSaveDate = useMemo(() => {
    const dates = mockQuotebookRows
      .map((r) => r.AdjustmentUpdatedDateTime)
      .filter(Boolean)
      .sort()
      .reverse();
    return dates[0] ? dayjs(dates[0]).format('M/D, h:mmA') : 'None for period';
  }, []);

  // Column defs
  const columnDefs = useMemo(
    () => getQuotebookColumnDefs(handleCostClick, handleQuoteHistoryClick, hasPermission),
    [handleCostClick, handleQuoteHistoryClick, hasPermission],
  );

  const publicationModeLabel =
    publicationMode === 'EndOfDay' ? 'End of Day'
      : publicationMode === 'EndOfDayCurrentPeriod' ? 'Current Period'
        : 'Intra Day';

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.QuoteConfigurationMappingId.toString(),
      groupDefaultExpanded: 2,
      rowSelection: 'multiple' as const,
      rowHeight: 35,
      headerHeight: 32,
      groupHeaderHeight: 28,
      suppressDragLeaveHidesColumns: true,
      isRowSelectable: (row: any) => !row?.group,
    }),
    [],
  );

  const breakdownData = selectedRow?.CostValuationId
    ? mockFormulaBreakdowns[selectedRow.CostValuationId]
    : null;

  return (
    <Vertical height="100%" style={{ overflow: 'hidden' }}>
      {/* ── GROUP TABS ──────────────────────────────────────── */}
      <QuotebookGroupTabs
        groups={mockQuotebookGroups}
        selectedGroups={selectedGroups}
        onToggleGroup={handleToggleGroup}
      />

      {/* ── QUOTEBOOK GRID ──────────────────────────────────── */}
      <Vertical flex="1" className="qb-grid">
        <GraviGrid
          storageKey="PriceMgmt-Quotebook"
          controlBarProps={{
            title: `Quote Book ${publicationModeLabel}`,
            showSelectedCount: hasPermission,
            actionButtons: (
              <QuotebookActionButtons
                publicationMode={publicationMode}
                setPublicationMode={setPublicationMode}
                hasPermission={hasPermission}
                showSpreadRows={showSpreadRows}
                setShowSpreadRows={setShowSpreadRows}
                showAnalytics={showAnalytics}
                setShowAnalytics={setShowAnalytics}
                publishMode={publishMode}
                lastSaveDate={lastSaveDate}
              />
            ),
          }}
          agPropOverrides={agPropOverrides}
          rowData={filteredRows}
          columnDefs={columnDefs}
          isBulkChangeVisible={isBulkChangeVisible}
          setIsBulkChangeVisible={setIsBulkChangeVisible}
          updateEP={handleBulkUpdate}
        />
      </Vertical>

      {/* ── PUBLISH FOOTER ──────────────────────────────────── */}
      <QuotebookPublishFooter
        hasPermission={hasPermission}
        dirtyCount={dirtyQuoteIds.size}
        onReset={handleReset}
        onSave={handleSaveAdjustments}
        onPublish={handlePublish}
      />

      {/* ── LAYER 1: VALUATION DRAWER (50vw, production layout) ── */}
      <Drawer
        className="pm-drawer"
        title="Valuation Breakdown"
        placement="right"
        onClose={handleCloseValuationDrawer}
        width="50vw"
        visible={valuationDrawerOpen}
      >
        {breakdownData ? (
          <ValuationDrawerContent
            data={breakdownData}
            hasPermission={hasPermission}
            onUploadPrice={handleUploadPrice}
          />
        ) : (
          <Horizontal height="100%" justifyContent="center" alignItems="center">
            <Texto className="bg-3 p-4" category="h5" style={{ borderRadius: 10 }}>
              No valuation details found
            </Texto>
          </Horizontal>
        )}

        {/* ── LAYER 2: NESTED PRICE MANAGEMENT DRAWER (NET NEW) ── */}
        <PriceManagementDrawer
          open={priceDrawerOpen}
          instrumentContext={selectedInstrumentContext}
          onSaveSuccess={handlePriceSaveSuccess}
          onClose={handleClosePriceDrawer}
        />
      </Drawer>

      {/* ── QUOTE HISTORY DRAWER (stub) ─────────────────────── */}
      <Drawer
        className="pm-drawer"
        title="Quote History"
        placement="right"
        onClose={() => { setQuoteHistoryOpen(false); setQuoteHistoryRow(null); }}
        width="50vw"
        visible={quoteHistoryOpen}
      >
        {quoteHistoryRow && (
          <Vertical className="p-4" style={{ gap: 16 }}>
            <Horizontal className="p-4 bg-2 bordered" style={{ gap: 16 }} alignItems="center">
              <Tooltip title="Product">
                <BBDTag className="py-1" success>
                  <Horizontal alignItems="center">
                    <ExperimentFilled style={{ marginRight: 5, fontSize: 12 }} />
                    <Texto category="h6">{quoteHistoryRow.ProductName}</Texto>
                  </Horizontal>
                </BBDTag>
              </Tooltip>
              <Texto category="h5">@</Texto>
              <Tooltip title="Location">
                <BBDTag className="py-1" success>
                  <Horizontal alignItems="center">
                    <EnvironmentFilled style={{ marginRight: 5, fontSize: 12 }} />
                    <Texto category="h6">{quoteHistoryRow.LocationName}</Texto>
                  </Horizontal>
                </BBDTag>
              </Tooltip>
            </Horizontal>
            <Horizontal alignItems="center" style={{ gap: 8 }}>
              <Texto appearance="medium">Counterparty:</Texto>
              <Texto category="h6">{quoteHistoryRow.CounterPartyName}</Texto>
            </Horizontal>
            <Horizontal alignItems="center" style={{ gap: 8 }}>
              <Texto appearance="medium">Description:</Texto>
              <Texto category="h6">{quoteHistoryRow.Description}</Texto>
            </Horizontal>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                backgroundColor: 'var(--theme-bg-3)',
                borderRadius: 8,
                border: '1px dashed var(--theme-border)',
              }}
            >
              <Vertical style={{ gap: 8, alignItems: 'center' }}>
                <LineChartOutlined style={{ fontSize: 48, color: 'var(--gray-400)' }} />
                <Texto appearance="medium" category="h6">Quote History Chart</Texto>
                <Texto appearance="medium">Historical pricing chart and grid will appear here</Texto>
              </Vertical>
            </div>
          </Vertical>
        )}
      </Drawer>

      {/* ── DEMO OPTIONS FAB ────────────────────────────────── */}
      <DemoOptionsFab hasPermission={hasPermission} setHasPermission={setHasPermission} />

      <style>{PRICE_MANAGEMENT_STYLES}{QUOTEBOOK_STYLES}</style>
    </Vertical>
  );
}
