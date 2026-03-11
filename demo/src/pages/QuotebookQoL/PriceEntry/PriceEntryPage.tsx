import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  EllipsisOutlined,
  EnvironmentFilled,
  ExperimentFilled,
  LoadingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { BBDTag, GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Alert, DatePicker, Drawer, Dropdown, Form, InputNumber, Menu, Modal, Select, Switch, Tooltip, message } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';

import {
  PriceEntryFormulaDetail,
  PriceEntryResultComponent,
  mockContractValuesRows,
  mockFormulaBreakdowns,
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
      valueFormatter: ({ value }: any) => (value ? moment(value).format('MM/DD/YYYY hh:mm A') : ''),
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
  effectiveFrom: moment.Moment;
  effectiveTo: moment.Moment;
}

// ─── Popover Price Entry Form ───────────────────────────────────────────────

interface PopoverPriceFormProps {
  component: PriceEntryResultComponent;
  onSave: (values: PriceFormValues) => void;
  onCancel: () => void;
  isSaving: boolean;
  saveError: string | null;
}

function PopoverPriceForm({
  component,
  onSave,
  onCancel,
  isSaving,
  saveError,
}: PopoverPriceFormProps) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSave({
      priceValue: values.priceValue,
      estimateActual: values.estimateActual,
      effectiveFrom: values.effectiveFrom,
      effectiveTo: values.effectiveTo,
    });
  };

  return (
    <div style={{ width: 340 }}>
      {/* Metadata header */}
      <Horizontal verticalCenter style={{ marginBottom: 8 }}>
        <Vertical flex="1">
          <Texto category="h6" style={{ fontSize: 13 }}>
            {component.ComponentDisplayName}
          </Texto>
          <Texto appearance="medium" style={{ fontSize: 11, marginTop: 2 }}>
            {component.PriceInstrumentName}
          </Texto>
        </Vertical>
        <GraviButton
          size="small"
          icon={<CloseOutlined />}
          onClick={onCancel}
          style={{ border: 'none', boxShadow: 'none' }}
        />
      </Horizontal>

      {/* Metadata tags */}
      <Horizontal verticalCenter style={{ gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <Texto appearance="medium" style={{ fontSize: 11 }}>Price Type:</Texto>
        <BBDTag style={{ fontSize: 10 }}>{component.PriceTypeCodeValueDisplay}</BBDTag>
        <Texto appearance="medium" style={{ fontSize: 11, marginLeft: 4 }}>Upload Type:</Texto>
        <BBDTag style={{ fontSize: 10 }}>{component.UploadType ?? 'N/A'}</BBDTag>
      </Horizontal>

      {/* Error alert */}
      {saveError && (
        <Alert
          type="error"
          showIcon
          message={saveError}
          style={{ marginBottom: 12, fontSize: 12 }}
          icon={<CloseCircleFilled />}
        />
      )}

      {/* Saving + revaluing progress */}
      {isSaving && (
        <Alert
          type="info"
          showIcon
          icon={<LoadingOutlined spin />}
          message="Price saved. Revaluing formula..."
          style={{ marginBottom: 12, fontSize: 12 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          estimateActual: 'Actual',
          effectiveFrom: moment(),
          effectiveTo: moment().endOf('month'),
        }}
        disabled={isSaving}
        size="small"
      >
        <Horizontal style={{ gap: 8 }}>
          <Form.Item
            label="Price Value"
            name="priceValue"
            rules={[{ required: true, message: 'Required' }]}
            style={{ flex: 1, marginBottom: 8 }}
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
            style={{ width: 110, marginBottom: 8 }}
          >
            <Select>
              <Select.Option value="Actual">Actual</Select.Option>
              <Select.Option value="Estimate">Estimate</Select.Option>
            </Select>
          </Form.Item>
        </Horizontal>

        <Form.Item
          label="Effective From"
          name="effectiveFrom"
          rules={[{ required: true, message: 'Required' }]}
          style={{ marginBottom: 8 }}
        >
          <DatePicker
            style={{ width: '100%' }}
            showTime={{ format: 'hh:mm A', use12Hours: true }}
            format="MM/DD/YYYY hh:mm A"
          />
        </Form.Item>

        <Form.Item
          label="Effective To"
          name="effectiveTo"
          rules={[{ required: true, message: 'Required' }]}
          style={{ marginBottom: 12 }}
        >
          <DatePicker
            style={{ width: '100%' }}
            showTime={{ format: 'hh:mm A', use12Hours: true }}
            format="MM/DD/YYYY hh:mm A"
          />
        </Form.Item>

        <Horizontal style={{ gap: 8 }}>
          <GraviButton
            theme1
            size="small"
            icon={isSaving ? <LoadingOutlined spin /> : undefined}
            buttonText={isSaving ? 'Saving...' : 'Save & Revalue'}
            onClick={() => form.submit()}
            disabled={isSaving}
          />
          <GraviButton size="small" buttonText="Cancel" onClick={onCancel} disabled={isSaving} />
        </Horizontal>
      </Form>
    </div>
  );
}

// ─── Drawer Content with Popover Price Entry ────────────────────────────────

interface DrawerContentProps {
  data: PriceEntryFormulaDetail;
  hasPermission: boolean;
  simulateLockConflict: boolean;
  onGridRowUpdated: () => void;
}

type RevalueState = 'idle' | 'loading' | 'cooldown' | 'error';

function DrawerContent({ data, hasPermission, simulateLockConflict, onGridRowUpdated }: DrawerContentProps) {
  const [revalueState, setRevalueState] = useState<RevalueState>('idle');
  const [displayResult, setDisplayResult] = useState(data.Result);
  const [displayDate, setDisplayDate] = useState(data.CalculationDate);
  const [showSuccessTimestamp, setShowSuccessTimestamp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultComponents, setResultComponents] = useState(data.ResultComponents);

  // Popover price entry state
  const [editingComponentId, setEditingComponentId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formDirty, setFormDirty] = useState(false);

  // Anchor position for the floating popover card
  const [popoverAnchorTop, setPopoverAnchorTop] = useState(0);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successLabelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for stable callbacks in AG Grid cell renderer
  const handleEditClickRef = useRef<(componentId: number, cellElement: HTMLElement) => void>(() => {});
  const editingComponentIdRef = useRef<number | null>(null);

  useEffect(() => {
    editingComponentIdRef.current = editingComponentId;
  }, [editingComponentId]);

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

  // ─── Popover Price Entry Logic ────────────────────────────────────────

  const handleEditClick = useCallback(
    (componentId: number, cellElement: HTMLElement) => {
      const currentEditing = editingComponentIdRef.current;
      if (currentEditing !== null && formDirty) {
        Modal.confirm({
          title: 'Unsaved Changes',
          content: 'You have unsaved changes. Discard and edit a different price?',
          okText: 'Discard',
          cancelText: 'Keep Editing',
          onOk: () => {
            setEditingComponentId(componentId);
            setSaveError(null);
            setFormDirty(false);
            updatePopoverPosition(cellElement);
          },
        });
        return;
      }
      setEditingComponentId(componentId);
      setSaveError(null);
      setFormDirty(false);
      updatePopoverPosition(cellElement);
    },
    [formDirty]
  );

  // Keep ref in sync
  useEffect(() => {
    handleEditClickRef.current = handleEditClick;
  }, [handleEditClick]);

  const updatePopoverPosition = (cellElement: HTMLElement) => {
    const container = gridContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const cellRect = cellElement.getBoundingClientRect();
    // Position the popover near the row that was clicked
    setPopoverAnchorTop(cellRect.top - containerRect.top);
  };

  const handleCancelEdit = useCallback(() => {
    setEditingComponentId(null);
    setSaveError(null);
    setFormDirty(false);
  }, []);

  const handleSavePrice = useCallback(
    (values: PriceFormValues) => {
      setIsSaving(true);
      setSaveError(null);
      setFormDirty(false);

      const editingComp = resultComponents.find(
        (c) => c.FormulaResultComponentId === editingComponentId
      );

      // Phase 1: Save price (simulated)
      setTimeout(() => {
        // Simulate lock conflict
        if (simulateLockConflict) {
          setIsSaving(false);
          setSaveError('This instrument is currently being updated. Please try again shortly.');
          return;
        }

        // Price saved — now simulate revaluation
        setTimeout(() => {
          // Update the component with the new price
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

          // Update the formula result
          const priceShift = (Math.random() - 0.5) * 0.01;
          setDisplayResult(values.priceValue + priceShift);
          setDisplayDate(new Date().toISOString());
          setShowSuccessTimestamp(true);

          successLabelTimer.current = setTimeout(() => setShowSuccessTimestamp(false), 5000);

          setIsSaving(false);
          setEditingComponentId(null);

          // Check if overlapping prices were end-dated (simulate 40% chance)
          const wasEndDated = Math.random() > 0.6;
          const instrumentName = editingComp?.PriceInstrumentName ?? 'Unknown';

          if (wasEndDated) {
            message.success({
              content: (
                <span>
                  <strong>Price saved successfully.</strong>
                  <br />
                  <span style={{ fontSize: 12, color: 'var(--theme-warning)' }}>
                    {instrumentName} was end-dated.
                  </span>
                </span>
              ),
              duration: 5,
            });
          } else {
            message.success({
              content: 'Price saved successfully.',
              duration: 3,
            });
          }

          onGridRowUpdated();
        }, REVALUE_DURATION_MS);
      }, SAVE_DURATION_MS);
    },
    [editingComponentId, resultComponents, simulateLockConflict, onGridRowUpdated]
  );

  // ─── Variables Grid Column Defs (stable — uses refs for callbacks) ────

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
          value ? moment(value).format('MM/DD/YYYY hh:mm A') : '',
      },
    ];

    // Right-side actions column with dropdown menu
    if (hasPermission) {
      cols.push({
        field: '_actions',
        headerName: '',
        width: 60,
        sortable: false,
        filter: false,
        pinned: 'right',
        cellRenderer: ({ data: rowData }: { data: PriceEntryResultComponent }) => {
          if (!rowData.IsPriceVariable) return null;

          const overlay = (
            <Menu
              onClick={({ key }) => {
                if (key === 'edit-price') {
                  // Find the trigger element for positioning
                  const trigger = document.querySelector(
                    `.price-entry-action-trigger[data-component-id="${rowData.FormulaResultComponentId}"]`
                  ) as HTMLElement;
                  handleEditClickRef.current(rowData.FormulaResultComponentId, trigger || document.body);
                }
              }}
            >
              <Menu.Item key="edit-price">Edit Price</Menu.Item>
            </Menu>
          );

          return (
            <Dropdown
              overlay={overlay}
              trigger={['click']}
              placement="bottomRight"
              getPopupContainer={(triggerNode) =>
                triggerNode.closest('.ant-drawer-body') as HTMLElement || document.body
              }
            >
              <span
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  transition: 'all 0.2s',
                }}
                className="price-entry-action-trigger"
                data-component-id={rowData.FormulaResultComponentId}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--theme-bg-3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <EllipsisOutlined style={{ fontSize: 16 }} />
              </span>
            </Dropdown>
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
      getRowClass: (params: any) => {
        if (params.data?.FormulaResultComponentId === editingComponentId) {
          return 'row-editing-active';
        }
        return '';
      },
    }),
    [editingComponentId]
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
      {/* ── HEADER BAR ─────────────────────────────────────────── */}
      <Horizontal className="p-4 bg-2 bordered">
        <Vertical flex="5" style={{ gap: 10 }}>
          <Horizontal verticalCenter>
            <Tooltip title="Product">
              <BBDTag className="py-1" style={{ whiteSpace: 'normal' }} success>
                <Horizontal verticalCenter>
                  <ExperimentFilled
                    style={{ marginRight: 5, fontSize: 12, color: 'var(--theme-color-2)' }}
                  />
                  <Texto category="h6">{data.ForProductName}</Texto>
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
                  <Texto category="h6">{data.ForLocationName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
          </Horizontal>
          <Horizontal verticalCenter>
            <Texto className="mr-3 mt-1">COUNTERPARTY: </Texto>
            <Texto category="h6">{data.ForCounterPartyName}</Texto>
          </Horizontal>
        </Vertical>

        <Vertical flex="2" style={{ gap: 8 }}>
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
              category="h6"
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
                : moment(displayDate).format('MM/DD/YYYY hh:mm A')}
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

      {/* ── ERROR BANNER ───────────────────────────────────────── */}
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

      {/* ── FORMULA NAME ───────────────────────────────────────── */}
      <Horizontal className="px-4 py-2" verticalCenter>
        <Texto className="mr-4">Formula Name:</Texto>
        <Texto category="h6">{data.CalculationName}</Texto>
      </Horizontal>

      {/* ── FORMULA EDITOR ─────────────────────────────────────── */}
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

      {/* ── VARIABLES GRID + FLOATING POPOVER ────────────────────── */}
      <div ref={gridContainerRef} style={{ flex: 5, position: 'relative', marginTop: 8 }}>
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

        {/* ── FLOATING POPOVER CARD ───────────────────────────── */}
        {editingComponent && (
          <div
            style={{
              position: 'absolute',
              right: 70,
              top: popoverAnchorTop,
              zIndex: 1050,
              padding: 16,
              backgroundColor: '#ffffff',
              border: '1px solid var(--theme-border)',
              borderRadius: 8,
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
              animation: 'popoverFadeIn 0.15s ease-out',
            }}
          >
            {/* Arrow pointing right toward the actions column */}
            <div
              style={{
                position: 'absolute',
                right: -8,
                top: 16,
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: '8px solid var(--theme-border)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -7,
                top: 16,
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: '8px solid #ffffff',
              }}
            />
            <PopoverPriceForm
              key={editingComponentId}
              component={editingComponent}
              onSave={handleSavePrice}
              onCancel={handleCancelEdit}
              isSaving={isSaving}
              saveError={saveError}
            />
          </div>
        )}
      </div>

      {/* ── CSS ANIMATIONS ─────────────────────────────────────── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes popoverFadeIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .row-editing-active .ag-cell {
          background-color: var(--theme-color-1-dim) !important;
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
  const [gridRowData, setGridRowData] = useState(mockContractValuesRows);

  useEffect(() => {
    localStorage.setItem('TYPE_OF_THEME', 'PE_LIGHT');
  }, []);

  const handleViewBuildup = useCallback((id: number) => {
    setSelectedValuationId(id);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedValuationId(null);
  }, []);

  const handleGridRowUpdated = useCallback(() => {
    // Simulate parent grid row updating after price save + revalue
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
              Click "View Buildup" on any row, then use the actions menu (⋯) on a price variable
              row to select "Edit Price". A popover form will appear for entering the price value,
              status, and effective date range with time.
            </Texto>
          </Vertical>
          <Vertical style={{ gap: 8, minWidth: 200, alignItems: 'flex-end' }}>
            <Horizontal verticalCenter style={{ gap: 8 }}>
              <Texto style={{ fontSize: 13 }}>Has price upload permission</Texto>
              <Switch checked={hasPermission} onChange={setHasPermission} size="small" />
            </Horizontal>
            <Horizontal verticalCenter style={{ gap: 8 }}>
              <Texto style={{ fontSize: 13 }}>Simulate lock conflict</Texto>
              <Switch checked={simulateLockConflict} onChange={setSimulateLockConflict} size="small" />
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
        visible={isDrawerOpen}
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
            onGridRowUpdated={handleGridRowUpdated}
          />
        )}
      </Drawer>
    </Vertical>
  );
}
