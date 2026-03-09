import {
  EnvironmentFilled,
  ExperimentFilled,
  LoadingOutlined,
  SyncOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';
import { BBDTag, GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Alert, Drawer, Tooltip } from 'antd';
import { ColDef } from 'ag-grid-community';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';

import { FormulaBreakdownDetail, ResultComponent, mockFormulaBreakdowns } from '../data/mockData';

// ─── Types ──────────────────────────────────────────────────────────────────

type RevalueState = 'idle' | 'loading' | 'success' | 'error' | 'cooldown';

interface ValuationDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedValuationId: number | null;
}

// ─── Revalue Button Component ───────────────────────────────────────────────

function RevalueButton({
  state,
  onRevalue,
}: {
  state: RevalueState;
  onRevalue: () => void;
}) {
  const isDisabled = state === 'loading' || state === 'cooldown';

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return {
          icon: <LoadingOutlined spin />,
          text: 'Revaluing...',
        };
      case 'cooldown':
        return {
          icon: <CheckCircleFilled style={{ color: 'var(--theme-success)' }} />,
          text: 'Revalued',
        };
      default:
        return {
          icon: <SyncOutlined />,
          text: 'Revalue Now',
        };
    }
  };

  const { icon, text } = getButtonContent();

  const button = (
    <GraviButton
      size="small"
      theme1={state === 'idle'}
      success={state === 'cooldown'}
      icon={icon}
      buttonText={text}
      disabled={isDisabled}
      onClick={onRevalue}
      style={{
        minWidth: 130,
        ...(state === 'cooldown'
          ? {
              border: '1px solid var(--theme-success)',
              color: 'var(--theme-success)',
              backgroundColor: 'var(--theme-success-dim)',
              cursor: 'default',
            }
          : {}),
      }}
    />
  );

  if (state === 'cooldown') {
    return <Tooltip title="Recently revalued">{button}</Tooltip>;
  }

  return button;
}

// ─── Variables Grid Column Defs ─────────────────────────────────────────────

function getVariablesColumnDefs(isLoading: boolean): ColDef[] {
  return [
    {
      field: 'ComponentDisplayName',
      headerName: 'Display',
      flex: 1,
      cellRenderer: ({ value }: { value: string }) => (
        <Texto className="text-truncate">{value}</Texto>
      ),
    },
    {
      field: 'ComponentName',
      headerName: 'Name',
      flex: 1,
    },
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
        if (!params.data.IsRequired && params.data.IsMissing) {
          return 'Optional Variable';
        }
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
    {
      field: 'PriceTypeCodeValueDisplay',
      headerName: 'Type',
      width: 110,
    },
    {
      field: 'PriceInstrumentName',
      headerName: 'Description',
      flex: 2,
    },
    {
      field: 'EffectiveAsOfDate',
      headerName: 'As of Date',
      width: 170,
      cellRenderer: ({ value }: { value: string }) =>
        value ? dayjs(value).format('MM/DD/YYYY hh:mm A') : '',
    },
  ];
}

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

// ─── Drawer Content ─────────────────────────────────────────────────────────

function DrawerContent({ data }: { data: FormulaBreakdownDetail }) {
  const [revalueState, setRevalueState] = useState<RevalueState>('idle');
  const [displayResult, setDisplayResult] = useState(data.Result);
  const [displayDate, setDisplayDate] = useState(data.CalculationDate);
  const [showSuccessTimestamp, setShowSuccessTimestamp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successLabelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      if (successLabelTimer.current) clearTimeout(successLabelTimer.current);
    };
  }, []);

  const handleRevalue = useCallback(() => {
    setRevalueState('loading');
    setErrorMessage(null);

    // Simulate revaluation API call (1.5s)
    setTimeout(() => {
      // 80% success, 20% error for demo purposes
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        // Simulate a small price change
        const priceShift = (Math.random() - 0.5) * 0.02;
        const newResult = data.Result + priceShift;

        setDisplayResult(newResult);
        setDisplayDate(new Date().toISOString());
        setShowSuccessTimestamp(true);
        setRevalueState('cooldown');

        // Revert "Revalued just now" label after 5s
        successLabelTimer.current = setTimeout(() => {
          setShowSuccessTimestamp(false);
        }, 5000);

        // Re-enable button after 15s cooldown
        cooldownTimer.current = setTimeout(() => {
          setRevalueState('idle');
        }, 15000);
      } else {
        setRevalueState('error');
        setErrorMessage(
          'Lock conflict: Scheduled valuation is currently running for this formula. Try again shortly.'
        );

        // Reset to idle after showing error
        setTimeout(() => {
          setRevalueState('idle');
        }, 500);
      }
    }, 1500);
  }, [data.Result]);

  const isLoading = revalueState === 'loading';

  const columnDefs = useMemo(() => getVariablesColumnDefs(isLoading), [isLoading]);

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

  return (
    <Vertical height="100%">
      {/* ── HEADER BAR ─────────────────────────────────────────── */}
      <Horizontal className="p-4 bg-2 bordered">
        {/* Left: Product, Location, Counterparty */}
        <Vertical gap={10} flex="5">
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

        {/* Right: Price, As Of Date, REVALUE BUTTON */}
        <Vertical gap={8} flex="2">
          <Horizontal verticalCenter justifyContent="flex-end">
            <Texto category="p2" className="px-3">
              PRICE:
            </Texto>
            <Texto
              category="h4"
              style={{
                transition: 'color 0.3s ease',
                ...(revalueState === 'cooldown' && showSuccessTimestamp
                  ? { color: 'var(--theme-success)' }
                  : {}),
                ...(isLoading
                  ? {
                      opacity: 0.5,
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }
                  : {}),
              }}
            >
              {displayResult !== 0
                ? `${getNumSign(displayResult)}${formatCurrency(displayResult)}`
                : '—'}
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
                  ? {
                      opacity: 0.5,
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }
                  : {}),
              }}
            >
              {showSuccessTimestamp ? 'Revalued just now' : dayjs(displayDate).format('MM/DD/YYYY hh:mm A')}
            </Texto>
          </Horizontal>

          {/* ★ REVALUE BUTTON — positioned below AS OF DATE ★ */}
          <Horizontal justifyContent="flex-end" style={{ marginTop: 4 }}>
            <RevalueButton state={revalueState} onRevalue={handleRevalue} />
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
        <Texto category="h5">{data.CalculationName}</Texto>
      </Horizontal>

      {/* ── FORMULA EDITOR (simplified for demo) ───────────────── */}
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

      {/* ── VARIABLES GRID ─────────────────────────────────────── */}
      <Horizontal flex="7" style={{ width: '100%', marginTop: 8 }}>
        <Vertical height="100%">
          <GraviGrid
            controlBarProps={{
              title: 'Variables',
            }}
            agPropOverrides={agPropOverrides}
            rowData={data.ResultComponents}
            columnDefs={columnDefs}
          />
        </Vertical>
      </Horizontal>

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
      `}</style>
    </Vertical>
  );
}

// ─── Main Drawer Component ──────────────────────────────────────────────────

export function ValuationDrawer({ open, onClose, selectedValuationId }: ValuationDrawerProps) {
  const data = selectedValuationId ? mockFormulaBreakdowns[selectedValuationId] : null;

  return (
    <Drawer
      className="quoteBook-drawer"
      title="Valuation Drawer"
      placement="right"
      onClose={onClose}
      width="50vw"
      open={open}
    >
      {!data ? (
        <Horizontal fullHeight horizontalCenter verticalCenter>
          <Texto className="bg-3 p-4" category="h5" style={{ borderRadius: 10 }}>
            No valuation details found
          </Texto>
        </Horizontal>
      ) : (
        <DrawerContent key={selectedValuationId} data={data} />
      )}
    </Drawer>
  );
}
