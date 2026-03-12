import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  EditOutlined,
  EnvironmentFilled,
  ExperimentFilled,
  HistoryOutlined,
  LoadingOutlined,
  SearchOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { BBDTag, GraviButton, GraviGrid, Horizontal, NotificationMessage, RangePicker, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Alert, Collapse, DatePicker, Drawer, Form, Input, InputNumber, Modal, Select } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import type { PriceFormValues, PriceHistoryRow, PriceInstrumentContext, UploadType } from './types';
import { mockPriceHistory } from './mockData';
import { ResizeHandle, useResizableDrawer } from './useResizableDrawer';

// ─── Price History Grid Column Defs ─────────────────────────────────────────

function getPriceHistoryColumnDefs(): ColDef[] {
  return [
    { field: 'InstrumentName', headerName: 'Instrument', flex: 2, minWidth: 200 },
    { field: 'Product', headerName: 'Product', width: 130 },
    { field: 'Location', headerName: 'Location', flex: 1, minWidth: 130 },
    { field: 'Counterparty', headerName: 'Counterparty', flex: 1, minWidth: 130 },
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
      field: 'PriceValue',
      headerName: 'Price',
      width: 110,
      cellStyle: { textAlign: 'right', fontWeight: '600' },
      valueFormatter: ({ value }: any) =>
        value != null
          ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
          : '',
    },
    { field: 'PriceType', headerName: 'Type', width: 100 },
    { field: 'Publisher', headerName: 'Publisher', width: 100 },
    {
      field: 'Updated',
      headerName: 'Updated',
      width: 160,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YY hh:mm A') : ''),
    },
  ];
}

// ─── Instrument Context Grid Column Defs ────────────────────────────────────

function getInstrumentContextColumnDefs(): ColDef[] {
  return [
    { field: 'instrumentName', headerName: 'Instrument Name', flex: 2, minWidth: 220 },
    { field: 'product', headerName: 'Product', width: 130 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'counterparty', headerName: 'Counterparty', width: 150 },
    {
      field: 'effectiveFrom',
      headerName: 'Eff From',
      width: 120,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YYYY') : ''),
    },
    {
      field: 'effectiveTo',
      headerName: 'Eff To',
      width: 110,
      valueFormatter: ({ value }: any) => {
        if (!value) return '';
        return dayjs(value).year() >= 9999 ? 'max' : dayjs(value).format('MM/DD/YYYY');
      },
    },
    {
      field: 'currentPrice',
      headerName: 'Price',
      width: 110,
      cellStyle: { textAlign: 'right', fontWeight: '600' },
      valueFormatter: ({ value }: any) =>
        value != null
          ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
          : '\u2014',
    },
    { field: 'priceType', headerName: 'Type', width: 100 },
    { field: 'publisher', headerName: 'Publisher', width: 100 },
  ];
}

// ─── PriceManagementDrawer Props ────────────────────────────────────────────

interface PriceManagementDrawerProps {
  open: boolean;
  instrumentContext: PriceInstrumentContext | null;
  onSaveSuccess: (instrumentId: number, newPrice: number) => void;
  onClose: () => void;
  width?: string | number;
}

// ─── PriceManagementDrawer Component ────────────────────────────────────────

export function PriceManagementDrawer({
  open,
  instrumentContext,
  onSaveSuccess,
  onClose,
  width = '60vw',
}: PriceManagementDrawerProps) {
  const [form] = Form.useForm();
  const { drawerWidth, handleResize, resetWidth } = useResizableDrawer(typeof width === 'number' ? `${width}px` : width as string);

  // Upload type drives conditional date fields
  const [selectedUploadType, setSelectedUploadType] = useState<UploadType>('Posting');

  // Date range filter for price history
  const [historyDates, setHistoryDates] = useState<dayjs.Dayjs[]>([
    dayjs().subtract(1, 'day').startOf('day'),
    dayjs().add(1, 'day').endOf('day'),
  ]);

  // Effective dates for price entry (used when upload type requires dates)
  const [effectiveFrom, setEffectiveFrom] = useState<dayjs.Dayjs>(dayjs().startOf('day'));
  const [effectiveTo, setEffectiveTo] = useState<dayjs.Dayjs>(dayjs().add(1, 'day').endOf('day'));

  // Conflict check state
  const [conflictState, setConflictState] = useState<'idle' | 'loading' | 'found' | 'none'>('idle');
  const [conflictRowIds, setConflictRowIds] = useState<Set<number>>(new Set());
  const [conflictCount, setConflictCount] = useState(0);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form dirty tracking
  const [formDirty, setFormDirty] = useState(false);

  // Price history panel open state
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [historySearchText, setHistorySearchText] = useState('');

  const showEffectiveDates = selectedUploadType === 'EffectiveStart' || selectedUploadType === 'EffectiveDates';

  // Reset state when drawer opens with new context
  const handleAfterVisibleChange = useCallback(
    (vis: boolean) => {
      if (vis && instrumentContext) {
        resetWidth();
        form.resetFields();
        setSelectedUploadType('Posting');
        setConflictState('idle');
        setConflictRowIds(new Set());
        setConflictCount(0);
        setSaveError(null);
        setIsSaving(false);
        setFormDirty(false);
        setHistoryExpanded(true);
        setHistoryDates([dayjs().subtract(1, 'day').startOf('day'), dayjs().add(1, 'day').endOf('day')]);
        setEffectiveFrom(dayjs().startOf('day'));
        setEffectiveTo(dayjs().add(1, 'day').endOf('day'));
      }
    },
    [instrumentContext, form, resetWidth]
  );

  // Filter price history by date range
  const allPriceHistory: PriceHistoryRow[] = instrumentContext
    ? mockPriceHistory[instrumentContext.instrumentId] ?? []
    : [];

  const filteredPriceHistory = useMemo(() => {
    const [from, to] = historyDates;
    return allPriceHistory.filter((row) => {
      const effFrom = dayjs(row.EffectiveFrom);
      return effFrom.isSameOrAfter(from, 'day') && effFrom.isSameOrBefore(to, 'day');
    });
  }, [allPriceHistory, historyDates]);

  // Handlers
  const clearConflicts = () => {
    setConflictState('idle');
    setConflictRowIds(new Set());
    setConflictCount(0);
  };

  const handleUploadTypeChange = (value: UploadType) => {
    setSelectedUploadType(value);
    setEffectiveFrom(dayjs().startOf('day'));
    setEffectiveTo(dayjs().add(1, 'day').endOf('day'));
    setFormDirty(true);
    clearConflicts();
  };

  const handleCheckConflicts = () => {
    setConflictState('loading');
    setTimeout(() => {
      if (filteredPriceHistory.length >= 2) {
        const ids = new Set(filteredPriceHistory.slice(-2).map((r) => r.PriceHistoryId));
        setConflictRowIds(ids);
        setConflictCount(ids.size);
        setConflictState('found');
      } else {
        setConflictRowIds(new Set());
        setConflictCount(0);
        setConflictState('none');
      }
    }, 800);
  };

  const handleSave = (values: any) => {
    setIsSaving(true);
    setSaveError(null);

    setTimeout(() => {
      // Simulate occasional lock conflict
      if (Math.random() < 0.1) {
        setIsSaving(false);
        setSaveError('This instrument is currently being updated. Please try again shortly.');
        return;
      }

      const wasEndDated = conflictState === 'found';
      const instrumentName = instrumentContext?.instrumentName ?? 'Unknown';

      setIsSaving(false);

      if (wasEndDated) {
        NotificationMessage('Price saved successfully', `${instrumentName} was end-dated.`, false);
      } else {
        NotificationMessage('Price saved successfully', '', false);
      }

      onSaveSuccess(instrumentContext!.instrumentId, values.priceValue);
    }, 1200);
  };

  const handleClose = () => {
    if (formDirty && !isSaving) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes in the price entry form. Discard and close?',
        okText: 'Discard',
        cancelText: 'Keep Editing',
        onOk: onClose,
      });
      return;
    }
    onClose();
  };

  // Column defs
  const priceHistoryColDefs = useMemo(() => getPriceHistoryColumnDefs(), []);
  const instrumentContextColDefs = useMemo(() => getInstrumentContextColumnDefs(), []);

  const priceHistoryAgProps = useMemo(
    () => ({
      getRowId: (params: any) => params.data.PriceHistoryId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
      quickFilterText: historySearchText,
      getRowClass: (params: any) => {
        if (conflictRowIds.has(params.data?.PriceHistoryId)) {
          return 'price-mgmt-conflict-row';
        }
        return '';
      },
    }),
    [conflictRowIds, historySearchText]
  );

  const instrumentAgProps = useMemo(
    () => ({
      getRowId: () => 'instrument-row',
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
      headerHeight: 32,
      rowHeight: 44,
    }),
    []
  );

  const formatCurrency = (val: number) =>
    val.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  if (!instrumentContext) return null;

  return (
    <Drawer
      className="price-management-drawer"
      title={null}
      placement="right"
      onClose={handleClose}
      width={drawerWidth}
      open={open}
      closable={false}
      afterOpenChange={handleAfterVisibleChange}
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' } }}
    >
      <ResizeHandle onResize={handleResize} />
      <Vertical height="100%">
        {/* ── SECTION 1: CONTEXT HEADER ─────────────────────────── */}
        <div className="p-4 bg-2 bordered" style={{ flexShrink: 0, borderBottom: '1px solid var(--theme-border)' }}>
          <Horizontal verticalCenter>
            <Vertical flex="1" gap={8}>
              <Horizontal verticalCenter gap={8}>
                <BBDTag className="py-1" success>
                  <Horizontal verticalCenter>
                    <ExperimentFilled style={{ marginRight: 5, fontSize: 12, color: 'var(--theme-color-2)' }} />
                    <Texto category="h5">{instrumentContext.product}</Texto>
                  </Horizontal>
                </BBDTag>
                <BBDTag className="py-1" success>
                  <Horizontal verticalCenter>
                    <EnvironmentFilled style={{ marginRight: 5, fontSize: 12, color: 'var(--theme-color-2)' }} />
                    <Texto category="h5">{instrumentContext.location}</Texto>
                  </Horizontal>
                </BBDTag>
                {instrumentContext.counterparty && (
                  <Texto appearance="medium" style={{ marginLeft: 8 }}>
                    {instrumentContext.counterparty}
                  </Texto>
                )}
              </Horizontal>
            </Vertical>

            <Horizontal verticalCenter gap={16}>
              <Vertical style={{ textAlign: 'right' }}>
                <Horizontal verticalCenter justifyContent="flex-end" gap={6}>
                  <Texto appearance="medium" style={{ fontSize: 12 }}>PRICE</Texto>
                  <Texto category="h4" style={{ fontWeight: 700 }}>
                    {instrumentContext.currentPrice != null
                      ? formatCurrency(instrumentContext.currentPrice)
                      : '\u2014'}
                  </Texto>
                </Horizontal>
                <Horizontal verticalCenter justifyContent="flex-end" gap={6}>
                  <Texto appearance="medium" style={{ fontSize: 11 }}>AS OF</Texto>
                  <Texto style={{ fontSize: 12 }}>
                    {instrumentContext.asOfDate
                      ? dayjs(instrumentContext.asOfDate).format('MM/DD/YYYY hh:mm A')
                      : '\u2014'}
                  </Texto>
                </Horizontal>
              </Vertical>
              <GraviButton
                size="small"
                icon={<CloseOutlined />}
                onClick={handleClose}
                style={{ border: 'none', boxShadow: 'none' }}
              />
            </Horizontal>
          </Horizontal>
        </div>

        {/* ── SECTION 2: INSTRUMENT CONTEXT GRID ────────────────── */}
        <div style={{ height: 138, flexShrink: 0, marginBottom: 16, opacity: 0.92 }}>
          <GraviGrid
            storageKey="PriceMgmt-InstrumentContext"
            controlBarProps={{ title: 'Instrument', hideActiveFilters: true, size: 'small' }}
            agPropOverrides={instrumentAgProps}
            rowData={[instrumentContext]}
            columnDefs={instrumentContextColDefs}
          />
        </div>

        {/* ── SECTION 3: PRICE ENTRY FORM ───────────────────────── */}
        <div
          style={{
            borderTop: '2px solid var(--theme-border)',
            borderLeft: '3px solid var(--theme-color-2)',
            backgroundColor: 'var(--theme-bg-1)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
            padding: '20px 24px',
            flexShrink: 0,
          }}
        >
          <Texto category="h5" style={{ marginBottom: 14, fontWeight: 600, letterSpacing: '0.01em' }}>
            <EditOutlined style={{ marginRight: 6, fontSize: 13 }} />
            Enter Price
          </Texto>

          {saveError && (
            <Alert
              type="error"
              showIcon
              message={saveError}
              style={{ marginBottom: 10, fontSize: 12 }}
              icon={<CloseCircleFilled />}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            onValuesChange={() => setFormDirty(true)}
            initialValues={{
              estimateActual: 'Actual',
              uploadType: 'Posting',
            }}
            disabled={isSaving}
            size="small"
          >
            <Horizontal gap={12} style={{ flexWrap: 'wrap' }}>
              <div style={{ width: 140, marginBottom: 8 }}>
                <Form.Item
                  label="Price Value"
                  name="priceValue"
                  rules={[{ required: true, message: 'Required' }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber style={{ width: '100%', fontSize: 16, fontWeight: 500 }} precision={4} placeholder="0.0000" autoFocus />
                </Form.Item>
                {instrumentContext.currentPrice != null && (
                  <Texto appearance="medium" style={{ fontSize: 11, marginTop: 2 }}>
                    Current: {formatCurrency(instrumentContext.currentPrice)}
                  </Texto>
                )}
              </div>

              <Form.Item label="Status" name="estimateActual" style={{ width: 120, marginBottom: 8 }}>
                <Select options={[
                  { value: 'Actual', label: 'Actual' },
                  { value: 'Estimate', label: 'Estimate' },
                ]} />
              </Form.Item>

              <Form.Item
                label="Upload Type"
                name="uploadType"
                rules={[{ required: true, message: 'Required' }]}
                style={{ width: 160, marginBottom: 8 }}
              >
                <Select onChange={handleUploadTypeChange} options={[
                  { value: 'Posting', label: 'Posting' },
                  { value: 'EffectiveStart', label: 'Effective Start' },
                  { value: 'EffectiveDates', label: 'Effective Dates' },
                ]} />
              </Form.Item>

              {showEffectiveDates && (
                <>
                  <Form.Item label="Effective From" style={{ width: 150, marginBottom: 8 }}>
                    <DatePicker
                      value={effectiveFrom}
                      onChange={(date) => {
                        if (date) setEffectiveFrom(date);
                        setFormDirty(true);
                        clearConflicts();
                      }}
                      format="MM/DD/YYYY"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  {selectedUploadType === 'EffectiveDates' && (
                    <Form.Item label="Effective To" style={{ width: 150, marginBottom: 8 }}>
                      <DatePicker
                        value={effectiveTo}
                        onChange={(date) => {
                          if (date) setEffectiveTo(date);
                          setFormDirty(true);
                          clearConflicts();
                        }}
                        format="MM/DD/YYYY"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  )}
                </>
              )}
            </Horizontal>

            <Horizontal verticalCenter gap={8} style={{ marginTop: 4 }}>
              <GraviButton
                size="small"
                buttonText={conflictState === 'loading' ? 'Checking...' : 'Check Conflicts'}
                icon={conflictState === 'loading' ? <LoadingOutlined spin /> : undefined}
                onClick={handleCheckConflicts}
                disabled={isSaving || conflictState === 'loading'}
              />
              <div style={{ flex: 1 }} />
              <GraviButton
                size="small"
                buttonText="Cancel"
                onClick={handleClose}
                disabled={isSaving}
                style={{ border: 'none', boxShadow: 'none' }}
              />
              <GraviButton
                theme1
                size="small"
                icon={isSaving ? <LoadingOutlined spin /> : undefined}
                buttonText={isSaving ? 'Saving...' : 'Save'}
                onClick={() => form.submit()}
                disabled={isSaving}
                style={{ minWidth: 80 }}
              />
            </Horizontal>
          </Form>
        </div>

        {/* ── CONFLICT MESSAGES ─────────────────────────────────── */}
        {conflictState === 'found' && (
          <div className="px-4 py-2" style={{ flexShrink: 0 }}>
            <Alert
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              message={`${conflictCount} existing price${conflictCount > 1 ? 's' : ''} overlap and will be end-dated on save.`}
              style={{ fontSize: 12 }}
            />
          </div>
        )}
        {conflictState === 'none' && (
          <div className="px-4 py-2" style={{ flexShrink: 0 }}>
            <Alert
              type="success"
              showIcon
              icon={<CheckCircleFilled />}
              message="No conflicting prices found."
              style={{ fontSize: 12 }}
            />
          </div>
        )}

        {/* ── SECTION 4: PRICE HISTORY PANEL ────────────────────── */}
        <Vertical flex="1" style={{ minHeight: 0, overflow: 'hidden', marginTop: 16, backgroundColor: 'var(--theme-bg-2)', borderTop: '1px solid var(--theme-border)' }}>
          <Collapse
            activeKey={historyExpanded ? ['history'] : []}
            onChange={(keys) => setHistoryExpanded(Array.isArray(keys) ? keys.includes('history') : keys === 'history')}
            style={{ borderRadius: 0, border: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Collapse.Panel
              key="history"
              header={
                <Horizontal verticalCenter justifyContent="space-between" style={{ width: '100%' }}>
                  <Horizontal verticalCenter gap={16} onClick={(e: any) => e.stopPropagation()}>
                    <Texto category="h4" style={{ fontWeight: 600 }}>
                      Price History
                    </Texto>
                    <Texto category="h6" style={{ color: 'var(--theme-color-2)', fontWeight: 600 }}>
                      {filteredPriceHistory.length} Result{filteredPriceHistory.length !== 1 ? 's' : ''}
                    </Texto>
                    <Input
                      prefix={<SearchOutlined style={{ color: 'var(--gray-500)' }} />}
                      placeholder="Search..."
                      value={historySearchText}
                      onChange={(e) => setHistorySearchText(e.target.value)}
                      allowClear
                      style={{ width: 200 }}
                    />
                  </Horizontal>
                  <Horizontal verticalCenter style={{ marginLeft: 'auto' }} onClick={(e: any) => e.stopPropagation()}>
                    <RangePicker
                      inputKey="priceHistoryDates"
                      dates={historyDates}
                      onChange={(dates) => {
                        setHistoryDates(dates.map((d: any) => (dayjs.isDayjs(d) ? d : dayjs(d))));
                        clearConflicts();
                      }}
                      placement="bottomRight"
                      size="small"
                    />
                  </Horizontal>
                </Horizontal>
              }
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              {/* Price history grid */}
              <div className="price-history-grid" style={{ flex: 1, minHeight: 200 }}>
                <GraviGrid
                  storageKey="PriceMgmt-PriceHistory"
                  controlBarProps={{ title: `${filteredPriceHistory.length} Results`, hideActiveFilters: true, size: 'small' }}
                  agPropOverrides={priceHistoryAgProps}
                  rowData={filteredPriceHistory}
                  columnDefs={priceHistoryColDefs}
                />
              </div>
            </Collapse.Panel>
          </Collapse>
        </Vertical>
      </Vertical>

      {/* ── CSS ──────────────────────────────────────────────────── */}
      <style>{`
        .price-mgmt-conflict-row .ag-cell {
          background-color: var(--theme-warning-dim, rgba(250, 173, 20, 0.15)) !important;
        }
        .price-management-drawer .ant-drawer-body {
          padding: 0 !important;
        }
        .price-management-drawer .ant-collapse-item {
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
        .price-management-drawer .ant-collapse-content {
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
        .price-management-drawer .ant-collapse-content-box {
          padding: 0 !important;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .price-history-grid .search-control,
        .price-history-grid .page-control-bar {
          display: none !important;
        }
        .drawer-resizing .ant-drawer-content-wrapper {
          transition: none !important;
        }
      `}</style>
    </Drawer>
  );
}
