import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  EditOutlined,
  EnvironmentFilled,
  ExperimentFilled,
  LoadingOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { BBDTag, GraviButton, GraviGrid, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Alert, DatePicker, Drawer, Form, InputNumber, Modal, Select, Switch, Tooltip } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@hooks/useTheme';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import {
  PriceEntryFormulaDetail,
  PriceEntryResultComponent,
  UploadType,
  mockContractValuesRows,
  mockFormulaBreakdowns,
  mockPriceHistory,
} from './mockData';

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
      field: 'actions',
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

// ─── Variables Grid Cell Styling ────────────────────────────────────────────

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

// ─── Price Form Values ──────────────────────────────────────────────────────

interface PriceFormValues {
  priceValue: number;
  estimateActual: 'Actual' | 'Estimate';
  uploadType: UploadType;
  effectiveFrom?: dayjs.Dayjs;
  effectiveTo?: dayjs.Dayjs;
}

// ─── Price History Grid Column Defs ─────────────────────────────────────────

function getPriceHistoryColumnDefs(): ColDef[] {
  return [
    { field: 'InstrumentName', headerName: 'Instrument Name', flex: 2 },
    { field: 'PriceType', headerName: 'Price Type', width: 110 },
    {
      field: 'PriceValue',
      headerName: 'Price Value',
      width: 120,
      cellStyle: { textAlign: 'right', fontWeight: '600' },
      valueFormatter: ({ value }: any) =>
        value != null
          ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
          : '',
    },
    {
      field: 'EffectiveFrom',
      headerName: 'Effective From',
      width: 150,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YYYY') : ''),
    },
    {
      field: 'EffectiveTo',
      headerName: 'Effective To',
      width: 150,
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
      width: 170,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YYYY hh:mm A') : ''),
    },
  ];
}

// ─── Stacked Price Drawer ───────────────────────────────────────────────────

interface StackedPriceDrawerProps {
  component: PriceEntryResultComponent;
  onSave: (values: PriceFormValues) => void;
  onClose: () => void;
  isSaving: boolean;
  saveError: string | null;
  simulateConflicts: boolean;
}

function StackedPriceDrawer({
  component,
  onSave,
  onClose,
  isSaving,
  saveError,
  simulateConflicts,
}: StackedPriceDrawerProps) {
  const [form] = Form.useForm();

  // Date range filter state — default: yesterday through tomorrow
  const [dateFrom, setDateFrom] = useState<dayjs.Dayjs>(dayjs().subtract(1, 'day').startOf('day'));
  const [dateTo, setDateTo] = useState<dayjs.Dayjs>(dayjs().add(1, 'day').endOf('day'));

  // Upload type drives conditional date fields
  const [selectedUploadType, setSelectedUploadType] = useState<UploadType>(
    component.UploadType ?? 'Posting'
  );

  // Conflict check state
  const [conflictCheckState, setConflictCheckState] = useState<'idle' | 'loading' | 'found' | 'none'>('idle');
  const [conflictRowIds, setConflictRowIds] = useState<Set<number>>(new Set());
  const [conflictCount, setConflictCount] = useState(0);

  // Track form dirty state for unsaved changes guard
  const [formDirty, setFormDirty] = useState(false);

  const showEffectiveFrom = selectedUploadType === 'EffectiveStart' || selectedUploadType === 'EffectiveDates';
  const showEffectiveTo = selectedUploadType === 'EffectiveDates';

  // Filter price history by date range
  const allPriceHistory = mockPriceHistory[component.PriceInstrumentId] ?? [];
  const filteredPriceHistory = useMemo(() => {
    return allPriceHistory.filter((row) => {
      const effFrom = dayjs(row.EffectiveFrom);
      return effFrom.isSameOrAfter(dateFrom, 'day') && effFrom.isSameOrBefore(dateTo, 'day');
    });
  }, [allPriceHistory, dateFrom, dateTo]);

  // Clear conflict highlighting when date fields change
  const handleDateFromChange = (val: dayjs.Dayjs | null) => {
    if (val) {
      setDateFrom(val);
      clearConflicts();
    }
  };

  const handleDateToChange = (val: dayjs.Dayjs | null) => {
    if (val) {
      setDateTo(val);
      clearConflicts();
    }
  };

  const clearConflicts = () => {
    setConflictCheckState('idle');
    setConflictRowIds(new Set());
    setConflictCount(0);
  };

  // Upload type change handler
  const handleUploadTypeChange = (value: UploadType) => {
    setSelectedUploadType(value);
    if (value === 'Posting') {
      form.setFieldsValue({ effectiveFrom: undefined, effectiveTo: undefined });
    } else if (value === 'EffectiveStart') {
      form.setFieldsValue({ effectiveTo: undefined });
    }
    setFormDirty(true);
    clearConflicts();
  };

  // Conflict check handler
  const handleCheckConflicts = () => {
    setConflictCheckState('loading');
    setTimeout(() => {
      if (simulateConflicts && filteredPriceHistory.length >= 2) {
        // Simulate: mark last 2 rows as conflicting
        const ids = new Set(filteredPriceHistory.slice(-2).map((r) => r.PriceHistoryId));
        setConflictRowIds(ids);
        setConflictCount(ids.size);
        setConflictCheckState('found');
      } else {
        setConflictRowIds(new Set());
        setConflictCount(0);
        setConflictCheckState('none');
      }
    }, 800);
  };

  // Save handler
  const handleFinish = (values: any) => {
    onSave({
      priceValue: values.priceValue,
      estimateActual: values.estimateActual,
      uploadType: values.uploadType,
      effectiveFrom: values.effectiveFrom,
      effectiveTo: values.effectiveTo,
    });
  };

  // Close with unsaved changes guard
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

  // Price history grid column defs
  const priceHistoryColDefs = useMemo(() => getPriceHistoryColumnDefs(), []);

  const priceHistoryAgProps = useMemo(
    () => ({
      getRowId: (params: any) => params.data.PriceHistoryId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
      getRowClass: (params: any) => {
        if (conflictRowIds.has(params.data?.PriceHistoryId)) {
          return 'price-history-conflict-row';
        }
        return '';
      },
    }),
    [conflictRowIds]
  );

  return (
    <Vertical
      height="100%"
      style={{ animation: 'stackedDrawerSlideUp 0.25s ease-out' }}
    >
      {/* ── STACKED DRAWER HEADER ──────────────────────────── */}
      <Horizontal
        className="px-4 py-3"
        verticalCenter
        style={{ borderBottom: '1px solid var(--theme-border)' }}
      >
        <Vertical flex="1">
          <Texto category="h5">Price History</Texto>
          <Texto appearance="medium" style={{ fontSize: 12, marginTop: 2 }}>
            {component.PriceInstrumentName}
          </Texto>
        </Vertical>
        <Horizontal verticalCenter gap={6}>
          <BBDTag style={{ fontSize: 10 }}>{component.PriceTypeCodeValueDisplay}</BBDTag>
          <GraviButton
            size="small"
            icon={<CloseOutlined />}
            onClick={handleClose}
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </Horizontal>
      </Horizontal>

      {/* ── DATE RANGE FILTER ──────────────────────────────── */}
      <Horizontal className="px-4 py-2" verticalCenter gap={12}>
        <Horizontal verticalCenter gap={6}>
          <Texto style={{ fontSize: 12, whiteSpace: 'nowrap' }}>Effective From:</Texto>
          <DatePicker
            size="small"
            value={dateFrom}
            onChange={handleDateFromChange}
            format="MM/DD/YYYY"
            allowClear={false}
          />
        </Horizontal>
        <Horizontal verticalCenter gap={6}>
          <Texto style={{ fontSize: 12, whiteSpace: 'nowrap' }}>Effective To:</Texto>
          <DatePicker
            size="small"
            value={dateTo}
            onChange={handleDateToChange}
            format="MM/DD/YYYY"
            allowClear={false}
          />
        </Horizontal>
      </Horizontal>

      {/* ── PRICE HISTORY GRID ─────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <GraviGrid
          storageKey="QuotebookQoL-PriceHistory"
          controlBarProps={{ title: `Prices (${filteredPriceHistory.length})`, hideActiveFilters: true }}
          agPropOverrides={priceHistoryAgProps}
          rowData={filteredPriceHistory}
          columnDefs={priceHistoryColDefs}
        />
      </div>

      {/* ── CONFLICT MESSAGE ───────────────────────────────── */}
      {conflictCheckState === 'found' && (
        <div className="px-4 py-2">
          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            message={`${conflictCount} existing price${conflictCount > 1 ? 's' : ''} overlap and will be end-dated on save.`}
            style={{ fontSize: 12 }}
          />
        </div>
      )}
      {conflictCheckState === 'none' && (
        <div className="px-4 py-2">
          <Alert
            type="success"
            showIcon
            icon={<CheckCircleFilled />}
            message="No conflicting prices found."
            style={{ fontSize: 12 }}
          />
        </div>
      )}

      {/* ── PINNED PRICE ENTRY FORM ────────────────────────── */}
      <div
        className="px-4 py-3"
        style={{
          borderTop: '2px solid var(--theme-border)',
          backgroundColor: 'var(--theme-bg-2)',
          flexShrink: 0,
        }}
      >
        <Texto category="h5" style={{ marginBottom: 10 }}>Enter Price</Texto>

        {/* Error alert */}
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
            effectiveFrom: showEffectiveFrom ? dayjs() : undefined,
            effectiveTo: showEffectiveTo ? dayjs().endOf('month') : undefined,
          }}
          disabled={isSaving}
          size="small"
        >
          <Horizontal gap={12} style={{ flexWrap: 'wrap' }}>
            <Form.Item
              label="Price Value"
              name="priceValue"
              rules={[{ required: true, message: 'Required' }]}
              style={{ flex: 1, minWidth: 120, marginBottom: 8 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                precision={4}
                placeholder="0.0000"
                autoFocus
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="estimateActual"
              style={{ width: 120, marginBottom: 8 }}
            >
              <Select options={[{ value: 'Actual', label: 'Actual' }, { value: 'Estimate', label: 'Estimate' }]} />
            </Form.Item>

            <Form.Item
              label="Upload Type"
              name="uploadType"
              rules={[{ required: true, message: 'Required' }]}
              style={{ width: 160, marginBottom: 8 }}
            >
              <Select onChange={handleUploadTypeChange} options={[{ value: 'Posting', label: 'Posting' }, { value: 'EffectiveStart', label: 'Effective Start' }, { value: 'EffectiveDates', label: 'Effective Dates' }]} />
            </Form.Item>

            {showEffectiveFrom && (
              <Form.Item
                label="Effective From"
                name="effectiveFrom"
                rules={[{ required: true, message: 'Required' }]}
                style={{ flex: 1, minWidth: 190, marginBottom: 8 }}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  format="MM/DD/YYYY hh:mm A"
                />
              </Form.Item>
            )}

            {showEffectiveTo && (
              <Form.Item
                label="Effective To"
                name="effectiveTo"
                rules={[{ required: true, message: 'Required' }]}
                style={{ flex: 1, minWidth: 190, marginBottom: 8 }}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime={{ format: 'hh:mm A', use12Hours: true }}
                  format="MM/DD/YYYY hh:mm A"
                />
              </Form.Item>
            )}
          </Horizontal>

          <Horizontal gap={8} style={{ marginTop: 4 }}>
            <GraviButton
              size="small"
              buttonText={conflictCheckState === 'loading' ? 'Checking...' : 'Check Conflicts'}
              icon={conflictCheckState === 'loading' ? <LoadingOutlined spin /> : undefined}
              onClick={handleCheckConflicts}
              disabled={isSaving || conflictCheckState === 'loading'}
            />
            <GraviButton
              theme1
              size="small"
              icon={isSaving ? <LoadingOutlined spin /> : undefined}
              buttonText={isSaving ? 'Saving...' : 'Save & Revalue'}
              onClick={() => form.submit()}
              disabled={isSaving}
            />
            <GraviButton size="small" buttonText="Cancel" onClick={handleClose} disabled={isSaving} />
          </Horizontal>
        </Form>
      </div>
    </Vertical>
  );
}

// ─── Drawer Content ─────────────────────────────────────────────────────────

interface DrawerContentProps {
  data: PriceEntryFormulaDetail;
  hasPermission: boolean;
  simulateLockConflict: boolean;
  simulateConflicts: boolean;
  onGridRowUpdated: () => void;
}

type RevalueState = 'idle' | 'loading' | 'cooldown' | 'error';

function DrawerContent({
  data,
  hasPermission,
  simulateLockConflict,
  simulateConflicts,
  onGridRowUpdated,
}: DrawerContentProps) {
  const [revalueState, setRevalueState] = useState<RevalueState>('idle');
  const [displayResult, setDisplayResult] = useState(data.Result);
  const [displayDate, setDisplayDate] = useState(data.CalculationDate);
  const [showSuccessTimestamp, setShowSuccessTimestamp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultComponents, setResultComponents] = useState(data.ResultComponents);

  // Stacked drawer state
  const [editingComponentId, setEditingComponentId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successLabelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref for stable callback in AG Grid cell renderer
  const handleEditClickRef = useRef<(componentId: number) => void>(() => {});

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      if (successLabelTimer.current) clearTimeout(successLabelTimer.current);
    };
  }, []);

  // ─── Revalue Button Logic ───────────────────────────────────────────────

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
        setErrorMessage(
          'Lock conflict: Scheduled valuation is currently running for this formula. Try again shortly.'
        );
        setTimeout(() => setRevalueState('idle'), 500);
      }
    }, 1500);
  }, [data.Result]);

  // ─── Edit / Save Logic ─────────────────────────────────────────────────

  const handleEditClick = useCallback((componentId: number) => {
    setEditingComponentId(componentId);
    setSaveError(null);
  }, []);

  useEffect(() => {
    handleEditClickRef.current = handleEditClick;
  }, [handleEditClick]);

  const handleCloseStackedDrawer = useCallback(() => {
    setEditingComponentId(null);
    setSaveError(null);
  }, []);

  const handleSavePrice = useCallback(
    (values: PriceFormValues) => {
      setIsSaving(true);
      setSaveError(null);

      const editingComp = resultComponents.find(
        (c) => c.FormulaResultComponentId === editingComponentId
      );

      // Phase 1: Save price (simulated)
      setTimeout(() => {
        if (simulateLockConflict) {
          setIsSaving(false);
          setSaveError('This instrument is currently being updated. Please try again shortly.');
          return;
        }

        // Phase 2: Revalue (simulated)
        setTimeout(() => {
          setResultComponents((prev) =>
            prev.map((c) =>
              c.FormulaResultComponentId === editingComponentId
                ? {
                    ...c,
                    ComponentResult: values.priceValue,
                    ComponentStatus: 'A' as const,
                    IsMissing: false,
                    EffectiveAsOfDate: new Date().toISOString(),
                  }
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

          if (wasEndDated) {
            NotificationMessage(
              'Price saved successfully',
              `${instrumentName} was end-dated.`,
              false
            );
          } else {
            NotificationMessage('Price saved successfully', 'Formula is being revalued.', false);
          }

          onGridRowUpdated();
        }, REVALUE_DURATION_MS);
      }, SAVE_DURATION_MS);
    },
    [editingComponentId, resultComponents, simulateLockConflict, onGridRowUpdated]
  );

  // ─── Variables Grid Column Defs ────────────────────────────────────────

  const isLoading = revalueState === 'loading';

  const columnDefs = useMemo((): ColDef[] => {
    const cols: ColDef[] = [
      {
        field: 'ComponentDisplayName',
        headerName: 'Display',
        flex: 1,
        cellRenderer: ({ value }: { value: string }) => (
          <Texto className="text-truncate">{value}</Texto>
        ),
      },
      { field: 'ComponentName', headerName: 'Name', flex: 1 },
      {
        field: 'ComponentResult',
        headerName: 'Value',
        flex: 1,
        cellRenderer: (params: any) => {
          if (isLoading) {
            return (
              <Horizontal verticalCenter style={{ height: '100%' }}>
                <div
                  style={{
                    width: '60%',
                    height: 12,
                    borderRadius: 4,
                    background: `linear-gradient(90deg, var(--theme-bg-3) 25%, var(--theme-bg-2) 50%, var(--theme-bg-3) 75%)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
              </Horizontal>
            );
          }
          if (!params.data.IsRequired && params.data.IsMissing) return 'Optional Variable';
          return params.value?.toFixed(4) ?? '';
        },
        cellStyle: (params: any) => getCellStyle(params),
      },
      {
        field: 'ComponentStatus',
        headerName: 'Status',
        width: 90,
        cellStyle: (params: any) => getCellStyle(params),
      },
      { field: 'PriceTypeCodeValueDisplay', headerName: 'Type', width: 110 },
      { field: 'PriceInstrumentName', headerName: 'Description', flex: 2 },
      {
        field: 'EffectiveAsOfDate',
        headerName: 'As of Date',
        width: 170,
        cellRenderer: ({ value }: { value: string }) =>
          value ? dayjs(value).format('MM/DD/YYYY hh:mm A') : '',
      },
    ];

    // Pencil icon action column
    if (hasPermission) {
      cols.push({
        field: '_actions',
        headerName: '',
        width: 50,
        sortable: false,
        filter: false,
        pinned: 'right',
        cellRenderer: ({ data: rowData }: { data: PriceEntryResultComponent }) => {
          if (!rowData.IsPriceVariable) return null;

          return (
            <Tooltip title={`Enter or update price for ${rowData.PriceInstrumentName}`}>
              <GraviButton
                size="small"
                type="link"
                icon={<EditOutlined style={{ fontSize: 14 }} />}
                onClick={() => handleEditClickRef.current(rowData.FormulaResultComponentId)}
              />
            </Tooltip>
          );
        },
      });
    }

    return cols;
  }, [hasPermission, isLoading]);

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: any) => row?.data?.FormulaResultComponentId?.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
    }),
    []
  );

  const getNumSign = (val: number) => (val >= 0 ? '+' : '');
  const formatCurrency = (val: number) =>
    Math.abs(val).toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });

  const editingComponent = editingComponentId
    ? resultComponents.find((c) => c.FormulaResultComponentId === editingComponentId)
    : null;

  const isRevalueDisabled = revalueState === 'loading' || revalueState === 'cooldown';

  return (
    <Vertical height="100%">
      {/* ── HEADER BAR — always visible ────────────────────── */}
      <Horizontal className="p-4 bg-2 bordered" style={{ flexShrink: 0 }}>
        <Vertical flex="5" gap={10}>
          <Horizontal verticalCenter>
            <Tooltip title="Product">
              <BBDTag className="py-1" style={{ whiteSpace: 'normal' }} success>
                <Horizontal verticalCenter>
                  <ExperimentFilled
                    style={{ marginRight: 5, fontSize: 12, color: 'var(--theme-color-2)' }}
                  />
                  <Texto category="h5">{data.ForProductName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
            <Texto category="h5" className="mr-2">
              @
            </Texto>
            <Tooltip title="Location">
              <BBDTag className="py-1" success>
                <Horizontal verticalCenter>
                  <EnvironmentFilled
                    style={{ marginRight: 5, fontSize: 12, color: 'var(--theme-color-2)' }}
                  />
                  <Texto category="h5">{data.ForLocationName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
          </Horizontal>
          <Horizontal verticalCenter>
            <Texto className="mr-3 mt-1">COUNTERPARTY: </Texto>
            <Texto category="h5">{data.ForCounterPartyName}</Texto>
          </Horizontal>
        </Vertical>

        <Vertical flex="2" gap={8}>
          <Horizontal verticalCenter justifyContent="flex-end">
            <Texto category="p2" className="px-3">
              PRICE:
            </Texto>
            <Texto
              category="h4"
              style={{
                transition: 'color 0.3s ease',
                ...(showSuccessTimestamp ? { color: 'var(--theme-success)' } : {}),
                ...(isLoading
                  ? { opacity: 0.5, animation: 'pulse 1.5s ease-in-out infinite' }
                  : {}),
              }}
            >
              {displayResult !== 0
                ? `${getNumSign(displayResult)}${formatCurrency(displayResult)}`
                : '\u2014'}
            </Texto>
          </Horizontal>

          <Horizontal verticalCenter justifyContent="flex-end">
            <Texto category="p2" className="px-3">
              AS OF DATE:
            </Texto>
            <Texto
              category="h5"
              style={{
                transition: 'color 0.3s ease',
                ...(showSuccessTimestamp ? { color: 'var(--theme-success)' } : {}),
                ...(isLoading
                  ? { opacity: 0.5, animation: 'pulse 1.5s ease-in-out infinite' }
                  : {}),
              }}
            >
              {showSuccessTimestamp
                ? 'Revalued just now'
                : dayjs(displayDate).format('MM/DD/YYYY hh:mm A')}
            </Texto>
          </Horizontal>

          <Horizontal justifyContent="flex-end" style={{ marginTop: 4 }}>
            <Tooltip title={revalueState === 'cooldown' ? 'Recently revalued' : undefined}>
              <GraviButton
                size="small"
                theme1={revalueState === 'idle'}
                success={revalueState === 'cooldown'}
                icon={
                  revalueState === 'loading' ? (
                    <LoadingOutlined spin />
                  ) : revalueState === 'cooldown' ? (
                    <CheckCircleFilled style={{ color: 'var(--theme-success)' }} />
                  ) : (
                    <SyncOutlined />
                  )
                }
                buttonText={
                  revalueState === 'loading'
                    ? 'Revaluing...'
                    : revalueState === 'cooldown'
                      ? 'Revalued'
                      : 'Revalue Now'
                }
                disabled={isRevalueDisabled}
                onClick={handleRevalue}
                style={{
                  minWidth: 130,
                  ...(revalueState === 'cooldown'
                    ? {
                        border: '1px solid var(--theme-success)',
                        color: 'var(--theme-success)',
                        backgroundColor: 'var(--theme-success-dim)',
                        cursor: 'default',
                      }
                    : {}),
                }}
              />
            </Tooltip>
          </Horizontal>
        </Vertical>
      </Horizontal>

      {/* ── CONTENT AREA — switchable ──────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        {/* Normal valuation content */}
        <Vertical
          height="100%"
          style={{
            overflow: 'auto',
            ...(editingComponent ? { visibility: 'hidden' } : {}),
          }}
        >
          {/* Error banner */}
          {errorMessage && (
            <div className="px-4 pt-2">
              <Alert
                type="error"
                showIcon
                closable
                message="Revaluation failed"
                description={errorMessage}
                onClose={() => setErrorMessage(null)}
                icon={<CloseCircleFilled />}
              />
            </div>
          )}

          {/* Formula name */}
          <Horizontal className="px-4 py-2" verticalCenter>
            <Texto className="mr-4">Formula Name:</Texto>
            <Texto category="h5">{data.CalculationName}</Texto>
          </Horizontal>

          {/* Formula editor */}
          <div
            className="mx-4"
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              padding: '12px 16px',
              backgroundColor: 'var(--theme-bg-3)',
              borderRadius: 6,
              border: '1px solid var(--theme-border)',
              minHeight: 60,
              whiteSpace: 'pre-wrap',
              color: 'var(--theme-text)',
            }}
          >
            {data.Formula}
          </div>

          {/* Variables grid */}
          <div style={{ flex: 5, marginTop: 8 }}>
            <Horizontal style={{ width: '100%', height: '100%' }}>
              <Vertical height="100%">
                <GraviGrid
                  storageKey="QuotebookQoL-PriceEntry-Variables"
                  controlBarProps={{ title: 'Variables', hideActiveFilters: false }}
                  agPropOverrides={agPropOverrides}
                  rowData={resultComponents}
                  columnDefs={columnDefs}
                />
              </Vertical>
            </Horizontal>
          </div>
        </Vertical>

        {/* ── STACKED PRICE DRAWER — overlays content ────── */}
        {editingComponent && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--theme-bg-1)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <StackedPriceDrawer
              key={editingComponentId}
              component={editingComponent}
              onSave={handleSavePrice}
              onClose={handleCloseStackedDrawer}
              isSaving={isSaving}
              saveError={saveError}
              simulateConflicts={simulateConflicts}
            />
          </div>
        )}
      </div>

      {/* ── CSS ANIMATIONS ─────────────────────────────────── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes stackedDrawerSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .price-history-conflict-row .ag-cell {
          background-color: var(--theme-warning-dim, rgba(250, 173, 20, 0.15)) !important;
        }
      `}</style>
    </Vertical>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export function PriceEntryPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedValuationId, setSelectedValuationId] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState(true);
  const [simulateLockConflict, setSimulateLockConflict] = useState(false);
  const [simulateConflicts, setSimulateConflicts] = useState(false);
  const [gridRowData, setGridRowData] = useState(mockContractValuesRows);

  useTheme('PE_LIGHT');

  const handleViewBuildup = useCallback((id: number) => {
    setSelectedValuationId(id);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedValuationId(null);
  }, []);

  const handleGridRowUpdated = useCallback(() => {
    if (selectedValuationId) {
      setGridRowData((prev) =>
        prev.map((row) =>
          row.CurvePointPriceId === selectedValuationId
            ? {
                ...row,
                Price: parseFloat((2.0 + Math.random() * 0.8).toFixed(4)),
                ValuationStatusDisplay: 'Complete',
                UpdatedDateTime: new Date().toISOString(),
              }
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
      {/* ── INSTRUCTIONS / CONTROLS ──────────────────────────── */}
      <div className="p-4 bg-2 bordered" style={{ borderBottom: '1px solid var(--theme-border)' }}>
        <Horizontal verticalCenter>
          <Vertical flex="1">
            <Texto category="h5">Interactive Demo: Price Entry (Story 4)</Texto>
            <Texto appearance="medium" style={{ marginTop: 4, fontSize: 13 }}>
              Click "View Buildup" on any row, then click the pencil icon on a price variable
              row to open the stacked price entry drawer with price history grid.
            </Texto>
          </Vertical>
          <Vertical gap={8} style={{ minWidth: 220, alignItems: 'flex-end' }}>
            <Horizontal verticalCenter gap={8}>
              <Texto style={{ fontSize: 13 }}>Has price upload permission</Texto>
              <Switch checked={hasPermission} onChange={setHasPermission} size="small" />
            </Horizontal>
            <Horizontal verticalCenter gap={8}>
              <Texto style={{ fontSize: 13 }}>Simulate lock conflict</Texto>
              <Switch checked={simulateLockConflict} onChange={setSimulateLockConflict} size="small" />
            </Horizontal>
            <Horizontal verticalCenter gap={8}>
              <Texto style={{ fontSize: 13 }}>Simulate conflicts found</Texto>
              <Switch checked={simulateConflicts} onChange={setSimulateConflicts} size="small" />
            </Horizontal>
          </Vertical>
        </Horizontal>
      </div>

      {/* ── CONTRACT VALUES GRID ─────────────────────────────── */}
      <Horizontal flex="1">
        <Vertical height="100%">
          <GraviGrid
            storageKey="QuotebookQoL-PriceEntry-Grid"
            controlBarProps={{ title: 'Contract Values', hideActiveFilters: false }}
            agPropOverrides={agPropOverrides}
            rowData={gridRowData}
            columnDefs={columnDefs}
          />
        </Vertical>
      </Horizontal>

      {/* ── VALUATION DRAWER ─────────────────────────────────── */}
      <Drawer
        className="quoteBook-drawer"
        title="Valuation Drawer — Price Entry"
        placement="right"
        onClose={handleCloseDrawer}
        width="50vw"
        open={isDrawerOpen}
      >
        {!data ? (
          <Horizontal fullHeight horizontalCenter verticalCenter>
            <Texto className="bg-3 p-4" category="h5" style={{ borderRadius: 10 }}>
              No valuation details found
            </Texto>
          </Horizontal>
        ) : (
          <DrawerContent
            key={selectedValuationId}
            data={data}
            hasPermission={hasPermission}
            simulateLockConflict={simulateLockConflict}
            simulateConflicts={simulateConflicts}
            onGridRowUpdated={handleGridRowUpdated}
          />
        )}
      </Drawer>
    </Vertical>
  );
}
