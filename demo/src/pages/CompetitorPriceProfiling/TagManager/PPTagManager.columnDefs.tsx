import { ColDef, ICellRendererParams, ValueFormatterParams, ValueSetterParams } from 'ag-grid-community';
import { BBDTag, GraviButton } from '@gravitate-js/excalibrr';
import { LockOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  PricePositioningPreset,
  BASELINE_LABELS,
  SCOPE_TYPE_LABELS,
} from './PPTagManager.types';
import { ScopeChip } from './components/ScopeChip';

type Row = PricePositioningPreset;
type Params = ICellRendererParams<Row>;

const notDefault = (params: { data?: Row }) => !!params.data && !params.data.isDefault;

export function createColumnDefs(onDelete: (id: string) => void): ColDef<Row>[] {
  return [
    {
      field: 'name',
      headerName: 'Name',
      width: 260,
      minWidth: 220,
      editable: notDefault,
      cellRenderer: (p: Params) => {
        if (!p.data) return null;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {p.data.isDefault && <LockOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />}
            <span style={{ fontWeight: 600 }}>{p.data.name}</span>
            {p.data.isDefault && <BBDTag style={{ width: 'fit-content' }}>Default</BBDTag>}
          </div>
        );
      },
    },
    {
      field: 'scope',
      headerName: 'Scope',
      width: 220,
      minWidth: 180,
      sortable: false,
      filter: false,
      cellRenderer: (p: Params) => {
        if (!p.data) return null;
        return <ScopeChip scope={p.data.scope} />;
      },
      valueFormatter: (p: ValueFormatterParams<Row>) => {
        const s = p.data?.scope;
        if (!s) return '';
        return s.type === 'all' ? SCOPE_TYPE_LABELS.all : `${SCOPE_TYPE_LABELS[s.type]}: ${s.value ?? ''}`;
      },
    },
    {
      field: 'baseline',
      headerName: 'Baseline',
      width: 160,
      editable: notDefault,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: Object.keys(BASELINE_LABELS),
      },
      valueFormatter: (p: ValueFormatterParams<Row>) =>
        p.value ? BASELINE_LABELS[p.value as keyof typeof BASELINE_LABELS] : '',
    },
    {
      field: 'magnitudeThresholdDollars',
      headerName: 'Magnitude',
      width: 130,
      editable: notDefault,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: { min: 0.0001, max: 0.05, precision: 4, step: 0.0001 },
      valueFormatter: (p: ValueFormatterParams<Row>) =>
        typeof p.value === 'number' ? `±$${p.value.toFixed(4)}` : '',
      valueSetter: (p: ValueSetterParams<Row>) => {
        const n = Number(p.newValue);
        if (Number.isNaN(n) || !p.data) return false;
        p.data.magnitudeThresholdDollars = n;
        return true;
      },
    },
    {
      field: 'frequencyThresholdPct',
      headerName: 'Frequency',
      width: 130,
      editable: notDefault,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: { min: 10, max: 95, step: 1 },
      valueFormatter: (p: ValueFormatterParams<Row>) =>
        typeof p.value === 'number' ? `${p.value}%` : '',
      valueSetter: (p: ValueSetterParams<Row>) => {
        const n = Number(p.newValue);
        if (Number.isNaN(n) || !p.data) return false;
        p.data.frequencyThresholdPct = n;
        return true;
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 120,
    },
    {
      colId: 'actions',
      headerName: '',
      width: 80,
      pinned: 'right',
      lockPinned: true,
      sortable: false,
      filter: false,
      cellRenderer: (p: Params) => {
        if (!p.data || p.data.isDefault) return null;
        return (
          <GraviButton appearance="link" onClick={() => onDelete(p.data!.id)}>
            <DeleteOutlined />
          </GraviButton>
        );
      },
    },
  ];
}
