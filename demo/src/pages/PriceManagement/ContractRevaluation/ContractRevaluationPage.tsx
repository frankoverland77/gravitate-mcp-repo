import { CloseOutlined, ExperimentFilled } from '@ant-design/icons';
import { GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { DatePicker, Select, Switch } from 'antd';
import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFeatureMode } from '@contexts/FeatureModeContext';
import dayjs from 'dayjs';

import type { RevaluationRow, RevaluationDetailRow } from '../shared/types';
import { mockRevaluationRows } from '../shared/mockData';
import { ManualRevaluationModal } from './ManualRevaluationModal';
import { getStatusCellStyle, getChangeColor } from '../shared/statusStyles';

const { RangePicker } = DatePicker;

// ─── Revaluation Grid Column Defs ───────────────────────────────────────────

function getRevaluationColumnDefs(): ColDef[] {
  return [
    { field: 'ContractName', headerName: 'Contract', flex: 2, minWidth: 260, cellRenderer: 'agGroupCellRenderer' },
    { field: 'Counterparty', headerName: 'Counterparty', width: 160 },
    { field: 'Product', headerName: 'Product', width: 130 },
    { field: 'Location', headerName: 'Location', width: 160 },
    {
      field: 'PriorValue',
      headerName: 'Prior Value',
      width: 120,
      cellStyle: { textAlign: 'right' },
      valueFormatter: ({ value }: any) =>
        value != null ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '\u2014',
    },
    {
      field: 'CurrentValue',
      headerName: 'Current Value',
      width: 130,
      cellStyle: { textAlign: 'right', fontWeight: '600' },
      valueFormatter: ({ value }: any) =>
        value != null ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '\u2014',
    },
    {
      field: 'ValueChange',
      headerName: 'Change',
      width: 110,
      cellStyle: (params: any) => ({
        textAlign: 'right',
        fontWeight: '600',
        color: getChangeColor(params.value),
      }),
      valueFormatter: ({ value }: any) => {
        if (value == null) return '\u2014';
        const sign = value > 0 ? '+' : '';
        return `${sign}${value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
      },
    },
    {
      field: 'RevaluationStatus',
      headerName: 'Status',
      width: 120,
      cellStyle: (params: any) => getStatusCellStyle(params.value),
    },
    {
      field: 'LastRevaluedDate',
      headerName: 'Last Revalued',
      width: 160,
      valueFormatter: ({ value }: any) => (value ? dayjs(value).format('MM/DD/YY hh:mm A') : ''),
    },
  ];
}

// ─── Detail Row Renderer ────────────────────────────────────────────────────

function DetailCellRenderer({ data }: { data: RevaluationRow }) {
  if (!data.details || data.details.length === 0) {
    return <div style={{ padding: 16 }}><Texto appearance="medium">No detail rows available.</Texto></div>;
  }

  return (
    <div style={{ padding: '12px 24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
            <th style={{ textAlign: 'left', padding: '6px 12px', fontWeight: 600 }}>Component</th>
            <th style={{ textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>Old Value</th>
            <th style={{ textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>New Value</th>
            <th style={{ textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>Change</th>
            <th style={{ textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>Change %</th>
          </tr>
        </thead>
        <tbody>
          {data.details.map((d: RevaluationDetailRow) => (
            <tr key={d.DetailId} style={{ borderBottom: '1px solid var(--theme-border)' }}>
              <td style={{ padding: '6px 12px' }}>{d.Component}</td>
              <td style={{ textAlign: 'right', padding: '6px 12px' }}>
                {d.OldValue.toLocaleString('en-US', { minimumFractionDigits: 4 })}
              </td>
              <td style={{ textAlign: 'right', padding: '6px 12px', fontWeight: 600 }}>
                {d.NewValue.toLocaleString('en-US', { minimumFractionDigits: 4 })}
              </td>
              <td style={{
                textAlign: 'right',
                padding: '6px 12px',
                fontWeight: 600,
                color: getChangeColor(d.Change),
              }}>
                {d.Change > 0 ? '+' : ''}{d.Change.toLocaleString('en-US', { minimumFractionDigits: 4 })}
              </td>
              <td style={{
                textAlign: 'right',
                padding: '6px 12px',
                color: getChangeColor(d.ChangePercent),
              }}>
                {d.ChangePercent > 0 ? '+' : ''}{d.ChangePercent.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
    <div className="cr-fab-container" ref={containerRef}>
      <div className={`cr-fab-panel ${expanded ? 'visible' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Demo Options</span>
          <button className="cr-fab-close" onClick={() => setExpanded(false)} aria-label="Close">
            <CloseOutlined />
          </button>
        </div>
        <div className="cr-fab-option">
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
        <div className="cr-fab-option">
          <span style={{ fontSize: 13 }}>Upload Permission</span>
          <Switch checked={hasPermission} onChange={setHasPermission} size="small" />
        </div>
      </div>
      <button
        className="cr-fab-button"
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

const CR_FAB_STYLES = `
  .cr-fab-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; }
  .cr-fab-button {
    width: 48px; height: 48px; border-radius: 50%;
    background-color: #1890ff; color: white; border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.3s ease;
  }
  .cr-fab-button:hover { background-color: #40a9ff; box-shadow: 0 6px 16px rgba(0,0,0,0.2); transform: scale(1.05); }
  .cr-fab-button:focus { outline: 2px solid #1890ff; outline-offset: 2px; }
  .cr-fab-panel {
    position: absolute; bottom: 60px; right: 0;
    background: white; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 12px; min-width: 220px;
    opacity: 0; transform: translateY(10px); pointer-events: none;
    transition: all 0.3s ease;
  }
  .cr-fab-panel.visible { opacity: 1; transform: translateY(0); pointer-events: all; }
  .cr-fab-option {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 0; font-size: 13px;
  }
  .cr-fab-close {
    width: 20px; height: 20px; border: none; background: #f5f5f5;
    border-radius: 50%; cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 10px; color: #666; transition: all 0.2s ease;
  }
  .cr-fab-close:hover { background: #e8e8e8; color: #333; }
`;

// ─── Main Page Component ────────────────────────────────────────────────────

export function ContractRevaluationPage() {
  const [hasPermission, setHasPermission] = useState(true);
  const [gridRowData, setGridRowData] = useState<RevaluationRow[]>(mockRevaluationRows);
  const [modalOpen, setModalOpen] = useState(false);

  const columnDefs = useMemo(() => getRevaluationColumnDefs(), []);

  const handleRevalueComplete = useCallback((revaluationIds: number[]) => {
    setGridRowData((prev) =>
      prev.map((row) =>
        revaluationIds.includes(row.RevaluationId)
          ? { ...row, RevaluationStatus: 'Complete' as const, LastRevaluedDate: new Date().toISOString() }
          : row,
      ),
    );
    setModalOpen(false);
  }, []);

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.RevaluationId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
      masterDetail: true,
      detailCellRenderer: DetailCellRenderer,
      detailRowAutoHeight: true,
    }),
    [],
  );

  return (
    <Vertical>
      {/* ── REVALUATION GRID ─────────────────────────────────── */}
      <GraviGrid
        storageKey="PriceMgmt-ContractRevaluation"
        controlBarProps={{
          title: `Contract Revaluation (${gridRowData.length})`,
          hideActiveFilters: false,
          actionButtons: (
            <Horizontal verticalCenter gap={8}>
              <RangePicker size="small" />
              <GraviButton theme1 size="small" disabled={!hasPermission} buttonText="Bulk Revalue" />
              <GraviButton size="small" onClick={() => setModalOpen(true)} disabled={!hasPermission} buttonText="Revaluation Wizard" />
            </Horizontal>
          ),
        }}
        agPropOverrides={agPropOverrides}
        rowData={gridRowData}
        columnDefs={columnDefs}
      />

      {/* ── MANUAL REVALUATION MODAL ─────────────────────────── */}
      <ManualRevaluationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={handleRevalueComplete}
      />

      <DemoOptionsFab hasPermission={hasPermission} setHasPermission={setHasPermission} />
      <style>{CR_FAB_STYLES}</style>
    </Vertical>
  );
}
