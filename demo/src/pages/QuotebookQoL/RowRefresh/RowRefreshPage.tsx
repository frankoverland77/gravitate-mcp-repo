import { LoadingOutlined } from '@ant-design/icons';
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Alert, InputNumber, Modal, Switch } from 'antd';
import { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@hooks/useTheme';

import { QuotebookRow, mockQuotebookRows, getSpreadFamilyIds } from './mockData';

// ─── Constants ──────────────────────────────────────────────────────────────

const REFRESH_DURATION_MS = 1800;
const HIGHLIGHT_DURATION_MS = 1200;

// ─── Price Formatter ────────────────────────────────────────────────────────

function formatPrice(value: number | null): string {
  if (value == null) return '—';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function formatSpread(value: number | null): string {
  if (value == null) return '—';
  return (value >= 0 ? '+' : '') + formatPrice(value);
}

function getDiffIcon(isSpread: boolean): React.ReactNode {
  if (!isSpread) return null;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 0,
        height: 0,
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        borderBottom: '6px solid var(--theme-color-1)',
        marginRight: 4,
      }}
      title="Spread differential"
    />
  );
}

// ─── Spread Override Modal ──────────────────────────────────────────────────

function SpreadOverrideModal({
  open,
  row,
  parentRow,
  onApply,
  onCancel,
}: {
  open: boolean;
  row: QuotebookRow | null;
  parentRow: QuotebookRow | null;
  onApply: (row: QuotebookRow, newValue: number) => void;
  onCancel: () => void;
}) {
  const [overrideValue, setOverrideValue] = useState<number | null>(null);
  const inputRef = useRef<any>(null);

  // Reset and auto-focus when modal opens
  useEffect(() => {
    if (open && row) {
      setOverrideValue(row.Adjustment);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [open, row]);

  if (!row) return null;

  return (
    <Modal
      className="spread-override-modal"
      open={open}
      title={<Texto category="h5">Override Spread Differential</Texto>}
      width={400}
      centered
      okText="Apply Override"
      okButtonProps={{ disabled: overrideValue == null }}
      onOk={() => {
        if (overrideValue != null) {
          onApply(row, overrideValue);
        }
      }}
      onCancel={onCancel}
    >
      <Vertical gap={8}>
        <div>
          <Texto category="h5" className="mb-1">Product:</Texto>
          <Texto category="p2">{row.ProductName}</Texto>
        </div>

        <div>
          <Texto category="h5" className="mb-1">Anchor Row:</Texto>
          <Texto category="p2">
            {parentRow
              ? `${parentRow.ProductName} @ ${parentRow.LocationName}`
              : '—'}
          </Texto>
        </div>

        <Horizontal className="my-2">
          <Texto className="mr-2">Current Differential:</Texto>
          <Texto style={{ fontWeight: 600 }}>
            ${formatPrice(row.Adjustment)}
          </Texto>
        </Horizontal>

        <Texto>Override Differential for Current Period</Texto>
        <InputNumber
          ref={inputRef}
          className="w-full mt-1"
          autoFocus
          value={overrideValue}
          step={0.0001}
          prefix="$"
          precision={4}
          onChange={(value) => setOverrideValue(value)}
          onPressEnter={() => {
            if (overrideValue != null) {
              onApply(row, overrideValue);
            }
          }}
        />

        <Texto category="p2" className="mt-2" style={{ fontSize: 12 }}>
          <span style={{ fontWeight: 'bolder' }}>Important: </span>
          This override will only apply to the current pricing period.
          The spread will revert to the standard value for future pricing periods.
        </Texto>

      </Vertical>
    </Modal>
  );
}

// ─── Column Definitions ─────────────────────────────────────────────────────

function getColumnDefs(
  refreshingRows: Set<number>,
  highlightedRows: Set<number>
): ColDef[] {
  const priceColStyle = (params: any) => {
    const id = params.data?.QuoteConfigurationMappingId;
    const base: Record<string, string> = { textAlign: 'right' };
    if (highlightedRows.has(id)) {
      base.backgroundColor = 'var(--theme-warning-dim)';
      base.transition = 'background-color 1s ease-out';
    }
    return base;
  };

  return [
    {
      headerName: '',
      field: '_spreadIndicator',
      width: 40,
      sortable: false,
      filter: false,
      cellRenderer: ({ data }: { data: QuotebookRow }) => {
        if (!data) return null;
        if (data.IsSpreadParent) {
          return (
            <Horizontal verticalCenter horizontalCenter style={{ height: '100%' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--theme-color-1)',
                }}
                title="Spread Parent"
              />
            </Horizontal>
          );
        }
        if (data.ParentMappingId != null) {
          return (
            <Horizontal verticalCenter horizontalCenter style={{ height: '100%' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 14,
                  borderTop: '1px solid var(--theme-color-1)',
                  marginLeft: 4,
                }}
                title="Spread Child"
              />
            </Horizontal>
          );
        }
        return null;
      },
    },
    {
      headerName: 'Quote Group',
      field: 'QuoteGroupName',
      width: 130,
      rowGroup: true,
      hide: true,
    },
    {
      headerName: 'Product',
      field: 'ProductName',
      width: 140,
    },
    {
      headerName: 'Location',
      field: 'LocationName',
      flex: 1,
    },
    {
      headerName: 'Prior',
      field: 'PriorPrice',
      width: 110,
      cellStyle: priceColStyle,
      valueFormatter: ({ value }: { value: number | null }) => formatPrice(value),
    },
    {
      headerName: 'Current',
      field: 'CurrentPrice',
      width: 110,
      cellStyle: priceColStyle,
      valueFormatter: ({ value }: { value: number | null }) => formatPrice(value),
    },
    {
      headerName: 'Proposed',
      field: 'ProposedPrice',
      width: 110,
      cellStyle: (params: any) => {
        const base = priceColStyle(params);
        base.fontWeight = '600';
        return base;
      },
      valueFormatter: ({ value }: { value: number | null }) => formatPrice(value),
    },
    {
      headerName: 'Diff',
      field: 'Adjustment',
      width: 130,
      cellStyle: (params: any) => {
        const id = params.data?.QuoteConfigurationMappingId;
        const base: Record<string, string> = { textAlign: 'right' };
        // Spread child rows: show override-eligible styling
        if (params.data?.ParentMappingId != null && !refreshingRows.has(id)) {
          base.backgroundColor = 'var(--theme-color-1-dim)';
          base.cursor = 'context-menu';
        }
        if (highlightedRows.has(id)) {
          base.backgroundColor = 'var(--theme-warning-dim)';
          base.transition = 'background-color 1s ease-out';
        }
        return base;
      },
      cellRenderer: ({ data }: { data: QuotebookRow }) => {
        if (!data) return null;
        const isSpread = data.ParentMappingId != null;
        const displayValue = data.SpreadOverride != null ? data.SpreadOverride : data.Adjustment;
        return (
          <Horizontal verticalCenter gap={4} style={{ height: '100%' }}>
            {getDiffIcon(isSpread)}
            <span>{formatSpread(displayValue)}</span>
          </Horizontal>
        );
      },
    },
    {
      headerName: 'Mkt Move',
      field: 'MarketMove',
      width: 100,
      cellStyle: priceColStyle,
      valueFormatter: ({ value }: { value: number | null }) =>
        value != null ? (value >= 0 ? '+' : '') + formatPrice(value) : '—',
    },
    {
      headerName: 'Valuation',
      field: 'ValuationResult',
      width: 110,
      cellStyle: (params: any) => {
        const base = priceColStyle(params);
        base.fontWeight = '600';
        return base;
      },
      valueFormatter: ({ value }: { value: number | null }) => formatPrice(value),
    },
    {
      headerName: 'Updated',
      field: 'UpdatedDateTime',
      width: 170,
      valueFormatter: ({ value }: { value: string }) =>
        value ? dayjs(value).format('MM/DD/YYYY hh:mm A') : '',
    },
  ];
}

// ─── Main Page Component ────────────────────────────────────────────────────

export function RowRefreshPage() {
  const [rowData, setRowData] = useState<QuotebookRow[]>(() =>
    mockQuotebookRows.map((r) => ({ ...r }))
  );
  const [refreshingRows, setRefreshingRows] = useState<Set<number>>(new Set());
  const [highlightedRows, setHighlightedRows] = useState<Set<number>>(new Set());
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<QuotebookRow | null>(null);

  useTheme('PE_LIGHT');

  // Find parent row for selected spread child
  const parentRow = useMemo(() => {
    if (!selectedRow?.ParentMappingId) return null;
    return rowData.find(
      (r) => r.QuoteConfigurationMappingId === selectedRow.ParentMappingId
    ) ?? null;
  }, [selectedRow, rowData]);

  // ── Row class rules for overlay + highlight ──

  const getRowClass = useCallback(
    (params: any) => {
      const id = params.data?.QuoteConfigurationMappingId;
      if (!id) return '';
      const classes: string[] = [];
      if (refreshingRows.has(id)) classes.push('row-refreshing');
      if (highlightedRows.has(id)) classes.push('row-highlight-success');
      return classes.join(' ');
    },
    [refreshingRows, highlightedRows]
  );

  // ── Context menu: "Override Spread for Current Period" ──

  const getContextMenuItems = useCallback(
    (params: any) => {
      const colId = params.column?.getColId?.();
      const row = params.node?.data as QuotebookRow | undefined;

      const defaultItems = ['copy', 'copyWithHeaders', 'separator', 'export'];

      // Only show override option on Adjustment column for spread child rows
      if (colId === 'Adjustment' && row?.ParentMappingId != null) {
        return [
          {
            name: 'Override Spread for Current Period',
            action: () => {
              setSelectedRow(row);
              setIsModalOpen(true);
            },
          },
          'separator',
          ...defaultItems,
        ];
      }

      return defaultItems;
    },
    []
  );

  // ── Apply override → triggers row refresh ──

  const handleApplyOverride = useCallback(
    (changedRow: QuotebookRow, newValue: number) => {
      const familyIds = getSpreadFamilyIds(changedRow, rowData);

      // Update the spread override value immediately
      setRowData((prev) =>
        prev.map((r) =>
          r.QuoteConfigurationMappingId === changedRow.QuoteConfigurationMappingId
            ? { ...r, SpreadOverride: newValue }
            : r
        )
      );

      setLastAction(
        `Saving spread override for ${changedRow.LocationName}... refreshing ${familyIds.length} row(s)`
      );

      // Mark family as refreshing
      setRefreshingRows((prev) => {
        const next = new Set(prev);
        familyIds.forEach((id) => next.add(id));
        return next;
      });

      // Simulate API call + revaluation
      setTimeout(() => {
        if (simulateFailure) {
          // ── Failure: silent fallback to full refresh ──
          setRefreshingRows((prev) => {
            const next = new Set(prev);
            familyIds.forEach((id) => next.delete(id));
            return next;
          });
          setLastAction('Row refresh failed — falling back to full Quotebook reload...');

          setTimeout(() => {
            setLastAction('Full reload complete. All rows refreshed.');
            setTimeout(() => setLastAction(null), 3000);
          }, 1200);
          return;
        }

        // ── Success: update row data with revaluation + show highlight ──
        setRowData((prev) =>
          prev.map((r) => {
            if (!familyIds.includes(r.QuoteConfigurationMappingId)) return r;
            const shift = (Math.random() - 0.3) * 0.015;
            const newProposed = (r.ProposedPrice ?? 0) + shift;
            return {
              ...r,
              ProposedPrice: parseFloat(newProposed.toFixed(4)),
              ValuationResult: parseFloat(newProposed.toFixed(4)),
              CurrentPrice: r.ProposedPrice,
              UpdatedDateTime: new Date().toISOString(),
            };
          })
        );

        setRefreshingRows((prev) => {
          const next = new Set(prev);
          familyIds.forEach((id) => next.delete(id));
          return next;
        });

        setHighlightedRows((prev) => {
          const next = new Set(prev);
          familyIds.forEach((id) => next.add(id));
          return next;
        });

        setLastAction(
          `Refreshed ${familyIds.length} row(s) with live revaluation — ${changedRow.ProductName} @ ${changedRow.QuoteGroupName}`
        );

        setTimeout(() => {
          setHighlightedRows((prev) => {
            const next = new Set(prev);
            familyIds.forEach((id) => next.delete(id));
            return next;
          });
          setTimeout(() => setLastAction(null), 3000);
        }, HIGHLIGHT_DURATION_MS);
      }, REFRESH_DURATION_MS);
    },
    [rowData, simulateFailure]
  );

  // ── Column defs ──

  const columnDefs = useMemo(
    () => getColumnDefs(refreshingRows, highlightedRows),
    [refreshingRows, highlightedRows]
  );

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: { data: QuotebookRow }) =>
        params.data.QuoteConfigurationMappingId.toString(),
      getRowClass,
      getContextMenuItems,
      groupDefaultExpanded: -1,
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
    }),
    [getRowClass, getContextMenuItems]
  );

  const controlBarProps = useMemo(
    () => ({
      title: refreshingRows.size > 0 ? (
        <Horizontal verticalCenter gap={8}>
          <span>Quotebook</span>
          <LoadingOutlined spin style={{ fontSize: 14, color: 'var(--theme-color-1)' }} />
          <Texto appearance="medium" style={{ fontSize: 13, color: 'var(--theme-color-1)' }}>
            Refreshing {refreshingRows.size} row(s)...
          </Texto>
        </Horizontal>
      ) : (
        'Quotebook — Row Refresh Demo (Story 2)'
      ),
      hideActiveFilters: false,
    }),
    [refreshingRows.size]
  );

  return (
    <Vertical height="100%">
      {/* ── INSTRUCTIONS / CONTROL PANEL ── */}
      <Horizontal className="p-3 bg-2 bordered mx-2 mt-2" verticalCenter gap={16}>
        <Vertical flex="1" gap={4}>
          <Texto category="h5">Interactive Demo: Single-Row Refresh with Live Revaluation</Texto>
          <Texto appearance="medium" style={{ fontSize: 13 }}>
            <strong>Right-click</strong> on any{' '}
            <strong style={{ color: 'var(--theme-color-1)' }}>Diff</strong> cell
            (highlighted blue, spread child rows) and select{' '}
            <strong>"Override Spread for Current Period"</strong>.
            Enter a new value in the modal and click <strong>"Apply Override"</strong>.
            The entire spread family refreshes with a loading overlay, then highlights yellow.
          </Texto>
        </Vertical>
        <Vertical gap={4} style={{ minWidth: 180 }}>
          <Horizontal verticalCenter gap={8}>
            <Switch
              size="small"
              checked={simulateFailure}
              onChange={setSimulateFailure}
            />
            <Texto appearance="medium" style={{ fontSize: 13 }}>
              Simulate refresh failure
            </Texto>
          </Horizontal>
          <Texto appearance="medium" style={{ fontSize: 11, opacity: 0.6 }}>
            {simulateFailure
              ? 'Next save will fail → falls back to full reload'
              : 'Normal flow: row refresh + revaluation'}
          </Texto>
        </Vertical>
      </Horizontal>

      {/* ── ACTION LOG ── */}
      {lastAction && (
        <div className="mx-2 mt-1">
          <Alert
            type={lastAction.includes('failed') || lastAction.includes('fallback') ? 'warning' : 'info'}
            showIcon
            message={lastAction}
            style={{ padding: '4px 12px', fontSize: 13 }}
          />
        </div>
      )}

      {/* ── GRID ── */}
      <Vertical flex="1" className="mt-1">
        <GraviGrid
          storageKey="QuotebookQoL-RowRefresh"
          controlBarProps={controlBarProps}
          agPropOverrides={agPropOverrides}
          columnDefs={columnDefs}
          rowData={rowData}
        />
      </Vertical>

      {/* ── SPREAD OVERRIDE MODAL ── */}
      {selectedRow && (
        <SpreadOverrideModal
          open={isModalOpen}
          row={selectedRow}
          parentRow={parentRow}
          onApply={(row, value) => {
            setIsModalOpen(false);
            setSelectedRow(null);
            handleApplyOverride(row, value);
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedRow(null);
          }}
        />
      )}

      {/* ── CSS for row overlay + highlight animations ── */}
      <style>{`
        .row-refreshing {
          position: relative;
        }
        .row-refreshing::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.6);
          pointer-events: none;
          z-index: 1;
        }
        .row-refreshing::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          border: 2px solid var(--theme-color-1);
          border-top-color: transparent;
          border-radius: 50%;
          animation: rowSpin 0.8s linear infinite;
          z-index: 2;
        }
        .row-highlight-success .ag-cell {
          background-color: var(--theme-warning-dim) !important;
          transition: background-color 1s ease-out !important;
        }
        @keyframes rowSpin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </Vertical>
  );
}
