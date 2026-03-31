import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditOutlined,
  EnvironmentFilled,
  ExperimentFilled,
  HistoryOutlined,
  LoadingOutlined,
  SearchOutlined,
  MoreOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { BBDTag, GraviButton, GraviGrid, Horizontal, NotificationMessage, RangePicker, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Alert, Collapse, DatePicker, Drawer, Form, Input, InputNumber, Menu, Modal, Popover, Select, Switch, Tooltip } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import type {
  ContractValuesRow,
  FormulaBreakdownDetail,
  FormulaResultComponent,
  PriceFormValues,
  PriceHistoryRow,
  UploadType,
} from '../shared/types';
import { mockContractValuesRows, mockFormulaBreakdowns, mockPriceHistory } from '../shared/mockData';
import { ResizeHandle, useResizableDrawer } from '../shared/useResizableDrawer';

// ─── Constants ──────────────────────────────────────────────────────────────

const SAVE_DURATION_MS = 1200;
const REVALUE_DURATION_MS = 800;
const REVALUE_COOLDOWN_MS = 15000;

// ─── Contract Values Grid Column Defs ───────────────────────────────────────

function getGridColumnDefs(onViewBuildup: (id: number) => void): ColDef[] {
  return [
    { field: 'CounterPartyName', headerName: 'Counterparty', flex: 1 },
    { field: 'ProductName', headerName: 'Product', width: 140 },
    { field: 'LocationName', headerName: 'Location', flex: 1 },
    { field: 'FormulaName', headerName: 'Formula', flex: 1 },
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
    {
      field: 'ValuationStatusDisplay',
      headerName: 'Status',
      width: 130,
      cellStyle: (params: any) => {
        if (params.value === 'Missing Prices') return { color: 'var(--theme-error)', fontWeight: '600' };
        if (params.value === 'Stale') return { color: 'var(--theme-warning)', fontWeight: '600' };
        if (params.value === 'Estimate') return { color: 'var(--theme-color-1)', fontStyle: 'italic' };
        return { color: 'var(--theme-success)' };
      },
    },
    {
      field: 'UpdatedDateTime',
      headerName: 'Updated',
      width: 170,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YYYY hh:mm A') : ''),
    },
    {
      field: '_actions',
      headerName: '',
      width: 140,
      sortable: false,
      filter: false,
      cellRenderer: ({ data }: any) => (
        <GraviButton
          size="small"
          theme1
          buttonText="View Buildup"
          onClick={() => onViewBuildup(data.CurvePointPriceId)}
        />
      ),
    },
  ];
}

// ─── Variable Cell Styling ──────────────────────────────────────────────────

function getCellStyle(params: any) {
  switch (params.data?.ComponentStatus) {
    case 'M':
      return { backgroundColor: 'var(--theme-error-trans)' };
    case 'O':
      return { backgroundColor: 'var(--theme-optimal-dim)' };
    case 'A':
      return { backgroundColor: 'var(--theme-success-dim)' };
    case 'E':
      return { backgroundColor: 'var(--theme-color-1-dim)' };
    default:
      return {};
  }
}

// ─── Price History Grid Column Defs ─────────────────────────────────────────

function getPriceHistoryColumnDefs(): ColDef[] {
  return [
    { field: 'InstrumentName', headerName: 'Instrument', flex: 2, minWidth: 200 },
    { field: 'PriceType', headerName: 'Type', width: 100 },
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
    { field: 'Publisher', headerName: 'Publisher', width: 100 },
    { field: 'Product', headerName: 'Product', width: 120 },
    { field: 'Location', headerName: 'Location', flex: 1 },
    {
      field: 'Updated',
      headerName: 'Updated',
      width: 160,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YY hh:mm A') : ''),
    },
  ];
}

// ─── Inline Price Entry + History Section ───────────────────────────────────

interface InlinePriceEntryProps {
  component: FormulaResultComponent;
  onSave: (values: PriceFormValues) => void;
  onClose: () => void;
  isSaving: boolean;
  saveError: string | null;
}

function InlinePriceEntry({
  component,
  onSave,
  onClose,
  isSaving,
  saveError,
}: InlinePriceEntryProps) {
  const [form] = Form.useForm();
  const [selectedUploadType, setSelectedUploadType] = useState<UploadType>(component.UploadType ?? 'Posting');
  const [historyDates, setHistoryDates] = useState<dayjs.Dayjs[]>([
    dayjs().subtract(1, 'day').startOf('day'),
    dayjs().add(1, 'day').endOf('day'),
  ]);
  const [effectiveFrom, setEffectiveFrom] = useState<dayjs.Dayjs>(dayjs().startOf('day'));
  const [effectiveTo, setEffectiveTo] = useState<dayjs.Dayjs>(dayjs().add(1, 'day').endOf('day'));
  const [conflictState, setConflictState] = useState<'idle' | 'loading' | 'found' | 'none'>('idle');
  const [conflictRowIds, setConflictRowIds] = useState<Set<number>>(new Set());
  const [conflictCount, setConflictCount] = useState(0);
  const [formDirty, setFormDirty] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [historySearchText, setHistorySearchText] = useState('');

  const showEffectiveDates = selectedUploadType === 'EffectiveStart' || selectedUploadType === 'EffectiveDates';

  const allPriceHistory = mockPriceHistory[component.PriceInstrumentId] ?? [];
  const filteredPriceHistory = useMemo(() => {
    const [from, to] = historyDates;
    return allPriceHistory.filter((row) => {
      const effFrom = dayjs(row.EffectiveFrom);
      return effFrom.isSameOrAfter(from, 'day') && effFrom.isSameOrBefore(to, 'day');
    });
  }, [allPriceHistory, historyDates]);

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

  const handleFinish = (values: any) => {
    onSave({
      priceValue: values.priceValue,
      estimateActual: values.estimateActual,
      uploadType: values.uploadType,
      effectiveFrom: showEffectiveDates ? effectiveFrom.toDate() : undefined,
      effectiveTo: selectedUploadType === 'EffectiveDates' ? effectiveTo.toDate() : undefined,
    });
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

  const priceHistoryColDefs = useMemo(() => getPriceHistoryColumnDefs(), []);
  const priceHistoryAgProps = useMemo(
    () => ({
      getRowId: (params: any) => params.data.PriceHistoryId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
      quickFilterText: historySearchText,
      getRowClass: (params: any) => {
        if (conflictRowIds.has(params.data?.PriceHistoryId)) return 'cv-conflict-row';
        return '';
      },
    }),
    [conflictRowIds, historySearchText]
  );

  return (
    <Vertical flex="1" style={{ animation: 'stackedSlideUp 0.25s ease-out', minHeight: 0 }}>
      {/* ── ENTER PRICE FORM ─────────────────────────────────── */}
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
          onFinish={handleFinish}
          onValuesChange={() => setFormDirty(true)}
          initialValues={{
            estimateActual: 'Actual',
            uploadType: component.UploadType ?? 'Posting',
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
              {component.ComponentResult != null && (
                <Texto appearance="medium" style={{ fontSize: 11, marginTop: 2 }}>
                  Current: {component.ComponentResult.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
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
              buttonText={isSaving ? 'Saving...' : 'Save & Revalue'}
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
          <Alert type="success" showIcon icon={<CheckCircleFilled />} message="No conflicting prices found." style={{ fontSize: 12 }} />
        </div>
      )}

      {/* ── COLLAPSIBLE PRICE HISTORY ─────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: 16, backgroundColor: 'var(--theme-bg-2)', borderTop: '1px solid var(--theme-border)' }}>
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
                  <Texto category="h5" style={{ color: 'var(--theme-color-2)', fontWeight: 600 }}>
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
                    inputKey="cvPriceHistoryDates"
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
            <div className="price-history-grid" style={{ flex: 1, minHeight: 200 }}>
              <GraviGrid
                storageKey="CV-PriceHistory"
                controlBarProps={{ title: `${filteredPriceHistory.length} Results`, hideActiveFilters: true, size: 'small' }}
                agPropOverrides={priceHistoryAgProps}
                rowData={filteredPriceHistory}
                columnDefs={priceHistoryColDefs}
              />
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    </Vertical>
  );
}

// ─── Valuation Drawer Content ───────────────────────────────────────────────

interface DrawerContentProps {
  data: FormulaBreakdownDetail;
  hasPermission: boolean;
  onGridRowUpdated: () => void;
}

type RevalueState = 'idle' | 'loading' | 'cooldown' | 'error';

function DrawerContent({ data, hasPermission, onGridRowUpdated }: DrawerContentProps) {
  const [revalueState, setRevalueState] = useState<RevalueState>('idle');
  const [displayResult, setDisplayResult] = useState(data.Result);
  const [displayDate, setDisplayDate] = useState(data.CalculationDate);
  const [showSuccessTimestamp, setShowSuccessTimestamp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultComponents, setResultComponents] = useState(data.ResultComponents);

  // Editing state
  const [editingComponentId, setEditingComponentId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successLabelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleEditClickRef = useRef<(id: number) => void>(() => {});

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      if (successLabelTimer.current) clearTimeout(successLabelTimer.current);
    };
  }, []);

  const handleRevalue = useCallback(() => {
    setRevalueState('loading');
    setErrorMessage(null);
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      if (isSuccess) {
        const priceShift = (Math.random() - 0.5) * 0.02;
        setDisplayResult(data.Result + priceShift);
        setDisplayDate(new Date().toISOString());
        setShowSuccessTimestamp(true);
        setRevalueState('cooldown');
        successLabelTimer.current = setTimeout(() => setShowSuccessTimestamp(false), 5000);
        cooldownTimer.current = setTimeout(() => setRevalueState('idle'), REVALUE_COOLDOWN_MS);
      } else {
        setRevalueState('error');
        setErrorMessage('Lock conflict: Scheduled valuation is currently running. Try again shortly.');
        setTimeout(() => setRevalueState('idle'), 500);
      }
    }, 1500);
  }, [data.Result]);

  const handleEditClick = useCallback((componentId: number) => {
    setEditingComponentId(componentId);
    setSaveError(null);
  }, []);

  useEffect(() => {
    handleEditClickRef.current = handleEditClick;
  }, [handleEditClick]);

  const handleCloseEdit = useCallback(() => {
    setEditingComponentId(null);
    setSaveError(null);
  }, []);

  const handleSavePrice = useCallback(
    (values: PriceFormValues) => {
      setIsSaving(true);
      setSaveError(null);

      const editingComp = resultComponents.find((c) => c.FormulaResultComponentId === editingComponentId);

      setTimeout(() => {
        if (Math.random() < 0.1) {
          setIsSaving(false);
          setSaveError('This instrument is currently being updated. Please try again shortly.');
          return;
        }

        setTimeout(() => {
          setResultComponents((prev) =>
            prev.map((c) =>
              c.FormulaResultComponentId === editingComponentId
                ? { ...c, ComponentResult: values.priceValue, ComponentStatus: 'A' as const, IsMissing: false, EffectiveAsOfDate: new Date().toISOString() }
                : c
            )
          );

          const priceShift = (Math.random() - 0.5) * 0.01;
          setDisplayResult(values.priceValue + priceShift);
          setDisplayDate(new Date().toISOString());
          setShowSuccessTimestamp(true);
          successLabelTimer.current = setTimeout(() => setShowSuccessTimestamp(false), 5000);

          setIsSaving(false);
          setEditingComponentId(null);

          const wasEndDated = Math.random() > 0.6;
          const instrumentName = editingComp?.PriceInstrumentName ?? 'Unknown';

          NotificationMessage(
            'Price saved successfully',
            wasEndDated ? `${instrumentName} was end-dated.` : 'Formula is being revalued.',
            false
          );

          onGridRowUpdated();
        }, REVALUE_DURATION_MS);
      }, SAVE_DURATION_MS);
    },
    [editingComponentId, resultComponents, onGridRowUpdated]
  );

  const isLoading = revalueState === 'loading';
  const editingComponent = editingComponentId ? resultComponents.find((c) => c.FormulaResultComponentId === editingComponentId) : null;

  // When editing, filter variables grid to only the edited price variable
  const displayedComponents = editingComponent
    ? resultComponents.filter((c) => c.FormulaResultComponentId === editingComponentId)
    : resultComponents;

  const columnDefs = useMemo((): ColDef[] => {
    const cols: ColDef[] = [
      { field: 'ComponentDisplayName', headerName: 'Display', flex: 1 },
      { field: 'ComponentName', headerName: 'Name', flex: 1 },
      {
        field: 'ComponentResult',
        headerName: 'Value',
        flex: 1,
        cellRenderer: (params: any) => {
          if (isLoading) {
            return (
              <Horizontal verticalCenter style={{ height: '100%' }}>
                <div style={{ width: '60%', height: 12, borderRadius: 4, background: `linear-gradient(90deg, var(--theme-bg-3) 25%, var(--theme-bg-2) 50%, var(--theme-bg-3) 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </Horizontal>
            );
          }
          if (!params.data.IsRequired && params.data.IsMissing) return 'Optional Variable';
          return params.value?.toFixed(4) ?? '';
        },
        cellStyle: (params: any) => getCellStyle(params),
      },
      { field: 'ComponentStatus', headerName: 'Status', width: 80, cellStyle: (params: any) => getCellStyle(params) },
      { field: 'PriceTypeCodeValueDisplay', headerName: 'Type', width: 100 },
      { field: 'PriceInstrumentName', headerName: 'Description', flex: 2 },
      {
        field: 'EffectiveAsOfDate',
        headerName: 'As of Date',
        width: 160,
        cellRenderer: ({ value }: { value: string }) => value ? dayjs(value).format('MM/DD/YYYY hh:mm A') : '',
      },
    ];

    // Only show action column when NOT editing (full grid view)
    if (hasPermission && !editingComponent) {
      cols.push({
        field: '_actions',
        headerName: '',
        width: 50,
        sortable: false,
        filter: false,
        pinned: 'right',
        cellRenderer: ({ data: rowData }: { data: FormulaResultComponent }) => {
          if (!rowData.IsPriceVariable) return null;
          return (
            <Tooltip title={`Upload price for ${rowData.PriceInstrumentName}`}>
              <Popover
                trigger="click"
                placement="bottomRight"
                overlayStyle={{ padding: 0 }}
                content={
                  <Menu
                    onClick={() => handleEditClickRef.current(rowData.FormulaResultComponentId)}
                    items={[{ key: 'upload', label: 'Upload Price' }]}
                  />
                }
              >
                <GraviButton size="small" type="link" icon={<MoreOutlined style={{ fontSize: 14 }} />} />
              </Popover>
            </Tooltip>
          );
        },
      });
    }

    return cols;
  }, [hasPermission, isLoading, editingComponent]);

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: any) => row?.data?.FormulaResultComponentId?.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
      rowHeight: 44,
    }),
    []
  );

  const formatCurrency = (val: number) => Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  const getNumSign = (val: number) => (val >= 0 ? '+' : '');
  const isRevalueDisabled = revalueState === 'loading' || revalueState === 'cooldown';

  return (
    <Vertical height="100%">
      {/* Header bar — always visible */}
      <Horizontal className="p-4 bg-2 bordered" style={{ flexShrink: 0 }}>
        <Vertical flex="5" gap={10}>
          <Horizontal verticalCenter>
            <BBDTag className="py-1" success>
              <Horizontal verticalCenter>
                <ExperimentFilled style={{ marginRight: 5, fontSize: 12, color: 'var(--theme-color-2)' }} />
                <Texto category="h5">{data.ForProductName}</Texto>
              </Horizontal>
            </BBDTag>
            <Texto category="h5" className="mr-2">@</Texto>
            <BBDTag className="py-1" success>
              <Horizontal verticalCenter>
                <EnvironmentFilled style={{ marginRight: 5, fontSize: 12, color: 'var(--theme-color-2)' }} />
                <Texto category="h5">{data.ForLocationName}</Texto>
              </Horizontal>
            </BBDTag>
          </Horizontal>
          <Horizontal verticalCenter>
            <Texto className="mr-3 mt-1">COUNTERPARTY: </Texto>
            <Texto category="h5">{data.ForCounterPartyName}</Texto>
          </Horizontal>
        </Vertical>

        <Vertical flex="2" gap={8}>
          <Horizontal verticalCenter justifyContent="flex-end">
            <Texto category="p2" className="px-3">PRICE:</Texto>
            <Texto category="h4" style={{
              transition: 'color 0.3s ease',
              ...(showSuccessTimestamp ? { color: 'var(--theme-success)' } : {}),
              ...(isLoading ? { opacity: 0.5, animation: 'pulse 1.5s ease-in-out infinite' } : {}),
            }}>
              {displayResult !== 0 ? `${getNumSign(displayResult)}${formatCurrency(displayResult)}` : '\u2014'}
            </Texto>
          </Horizontal>
          <Horizontal verticalCenter justifyContent="flex-end">
            <Texto category="p2" className="px-3">AS OF DATE:</Texto>
            <Texto category="h5" style={{
              transition: 'color 0.3s ease',
              ...(showSuccessTimestamp ? { color: 'var(--theme-success)' } : {}),
              ...(isLoading ? { opacity: 0.5, animation: 'pulse 1.5s ease-in-out infinite' } : {}),
            }}>
              {showSuccessTimestamp ? 'Revalued just now' : dayjs(displayDate).format('MM/DD/YYYY hh:mm A')}
            </Texto>
          </Horizontal>
          <Horizontal justifyContent="flex-end" style={{ marginTop: 4 }}>
            <GraviButton
              size="small"
              theme1={revalueState === 'idle'}
              success={revalueState === 'cooldown'}
              icon={revalueState === 'loading' ? <LoadingOutlined spin /> : revalueState === 'cooldown' ? <CheckCircleFilled style={{ color: 'var(--theme-success)' }} /> : <SyncOutlined />}
              buttonText={revalueState === 'loading' ? 'Revaluing...' : revalueState === 'cooldown' ? 'Revalued' : 'Revalue Now'}
              disabled={isRevalueDisabled}
              onClick={handleRevalue}
              style={{ minWidth: 130, ...(revalueState === 'cooldown' ? { border: '1px solid var(--theme-success)', color: 'var(--theme-success)', backgroundColor: 'var(--theme-success-dim)', cursor: 'default' } : {}) }}
            />
          </Horizontal>
        </Vertical>
      </Horizontal>

      {/* Scrollable content area */}
      <Vertical flex="1" style={{ overflow: editingComponent ? 'hidden' : 'auto', minHeight: 0 }}>
        {errorMessage && (
          <div className="px-4 pt-2">
            <Alert type="error" showIcon closable message="Revaluation failed" description={errorMessage} onClose={() => setErrorMessage(null)} icon={<CloseCircleFilled />} />
          </div>
        )}

        {/* Formula info — hidden when editing */}
        {!editingComponent && (
          <>
            <Horizontal className="px-4 py-2" verticalCenter>
              <Texto className="mr-4">Formula Name:</Texto>
              <Texto category="h5">{data.CalculationName}</Texto>
            </Horizontal>

            <div className="mx-4" style={{ fontFamily: 'monospace', fontSize: 13, padding: '12px 16px', backgroundColor: 'var(--theme-bg-3)', borderRadius: 6, border: '1px solid var(--theme-border)', minHeight: 60, whiteSpace: 'pre-wrap', color: 'var(--theme-text)' }}>
              {data.Formula}
            </div>
          </>
        )}

        {/* Variables grid — shows all when not editing, single row when editing */}
        <div style={{ height: editingComponent ? 150 : undefined, flex: editingComponent ? undefined : 5, marginTop: 8, flexShrink: 0 }}>
          <Horizontal style={{ width: '100%', height: '100%' }}>
            <Vertical height="100%">
              <GraviGrid
                storageKey={editingComponent ? 'CV-Variables-Editing' : 'CV-Variables'}
                controlBarProps={{
                  title: editingComponent ? `Editing: ${editingComponent.ComponentDisplayName}` : 'Variables',
                  hideActiveFilters: !!editingComponent,
                  size: editingComponent ? 'small' as const : undefined,
                  actionButtons: editingComponent ? (
                    <GraviButton size="small" buttonText="Back to All Variables" onClick={handleCloseEdit} />
                  ) : undefined,
                }}
                agPropOverrides={agPropOverrides}
                rowData={displayedComponents}
                columnDefs={columnDefs}
              />
            </Vertical>
          </Horizontal>
        </div>

        {/* Inline price entry + history — only when editing */}
        {editingComponent && (
          <InlinePriceEntry
            key={editingComponentId}
            component={editingComponent}
            onSave={handleSavePrice}
            onClose={handleCloseEdit}
            isSaving={isSaving}
            saveError={saveError}
          />
        )}
      </Vertical>

      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        @keyframes stackedSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .cv-conflict-row .ag-cell { background-color: var(--theme-warning-dim, rgba(250, 173, 20, 0.15)) !important; }
        .quoteBook-drawer .ant-collapse-item {
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
        .quoteBook-drawer .ant-collapse-content {
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
        .quoteBook-drawer .ant-collapse-content-box {
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
        }
        .price-history-grid .search-control,
        .price-history-grid .page-control-bar {
          display: none !important;
        }
        .drawer-resizing .ant-drawer-content-wrapper { transition: none !important; }
      `}</style>
    </Vertical>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export function ContractValuesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedValuationId, setSelectedValuationId] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState(true);
  const [gridRowData, setGridRowData] = useState(mockContractValuesRows);
  const { drawerWidth, handleResize, resetWidth } = useResizableDrawer('50vw');

  const handleViewBuildup = useCallback((id: number) => {
    resetWidth();
    setSelectedValuationId(id);
    setIsDrawerOpen(true);
  }, [resetWidth]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedValuationId(null);
  }, []);

  const handleGridRowUpdated = useCallback(() => {
    if (selectedValuationId) {
      setGridRowData((prev) =>
        prev.map((row) =>
          row.CurvePointPriceId === selectedValuationId
            ? { ...row, Price: parseFloat((2.0 + Math.random() * 0.8).toFixed(4)), ValuationStatusDisplay: 'Complete', UpdatedDateTime: new Date().toISOString() }
            : row
        )
      );
    }
  }, [selectedValuationId]);

  const columnDefs = useMemo(() => getGridColumnDefs(handleViewBuildup), [handleViewBuildup]);

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.CurvePointPriceId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
    }),
    []
  );

  const data = selectedValuationId ? mockFormulaBreakdowns[selectedValuationId] : null;

  return (
    <Vertical height="100%">
      {/* Instruction bar */}
      <div className="p-4 bg-2 bordered" style={{ borderBottom: '1px solid var(--theme-border)', flexShrink: 0 }}>
        <Horizontal verticalCenter>
          <Vertical flex="1">
            <Texto category="h5">Contract Values</Texto>
            <Texto appearance="medium" style={{ marginTop: 4, fontSize: 13 }}>
              Click "View Buildup" on any row, then use the action menu (&#8943;) on a price variable row to upload a price via the stacked drawer.
            </Texto>
          </Vertical>
          <Horizontal verticalCenter gap={8}>
            <Texto style={{ fontSize: 13 }}>Has price upload permission</Texto>
            <Switch checked={hasPermission} onChange={setHasPermission} size="small" />
          </Horizontal>
        </Horizontal>
      </div>

      {/* Contract values grid */}
      <Horizontal flex="1">
        <Vertical height="100%">
          <GraviGrid
            storageKey="PriceMgmt-ContractValues"
            controlBarProps={{ title: `Contract Values (${gridRowData.length})`, hideActiveFilters: false }}
            agPropOverrides={agPropOverrides}
            rowData={gridRowData}
            columnDefs={columnDefs}
          />
        </Vertical>
      </Horizontal>

      {/* Valuation drawer */}
      <Drawer
        className="quoteBook-drawer"
        title="Valuation Drawer"
        placement="right"
        onClose={handleCloseDrawer}
        width={drawerWidth}
        open={isDrawerOpen}
        styles={{ body: { padding: 0, position: 'relative' } }}
      >
        <ResizeHandle onResize={handleResize} />
        {!data ? (
          <Horizontal fullHeight horizontalCenter verticalCenter>
            <Texto className="bg-3 p-4" category="h5" style={{ borderRadius: 10 }}>No valuation details found</Texto>
          </Horizontal>
        ) : (
          <DrawerContent key={selectedValuationId} data={data} hasPermission={hasPermission} onGridRowUpdated={handleGridRowUpdated} />
        )}
      </Drawer>
    </Vertical>
  );
}
