import React, { useMemo } from 'react';
import { GraviGrid, GraviButton, Vertical, Texto, Horizontal } from '@gravitate-js/excalibrr';
import { Checkbox, Popconfirm } from 'antd';
import { PlusOutlined, SettingOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor';
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors';
import { PLACEHOLDER_VALUES, isPlaceholder } from '../../demos/grids/FormulaTemplates.data';
import { FormulaComponentsGridProps } from '../IndexOfferManagement.types';
import { COLORS, PLACEHOLDER_CELL_STYLE } from '../IndexOfferManagement.constants';

// =============================================================================
// Select Options
// =============================================================================

const PERCENTAGE_OPTIONS = [
  { value: PLACEHOLDER_VALUES.PERCENTAGE, label: PLACEHOLDER_VALUES.PERCENTAGE },
  { value: '0%', label: '0%' },
  { value: '5%', label: '5%' },
  { value: '10%', label: '10%' },
  { value: '25%', label: '25%' },
  { value: '50%', label: '50%' },
  { value: '75%', label: '75%' },
  { value: '90%', label: '90%' },
  { value: '95%', label: '95%' },
  { value: '100%', label: '100%' }
];

const SOURCE_OPTIONS = [
  { value: PLACEHOLDER_VALUES.SOURCE, label: PLACEHOLDER_VALUES.SOURCE },
  { value: 'Argus', label: 'Argus' },
  { value: 'OPIS', label: 'OPIS' },
  { value: 'Platts', label: 'Platts' },
  { value: 'Bloomberg', label: 'Bloomberg' },
  { value: 'ICE', label: 'ICE' },
  { value: 'NYMEX', label: 'NYMEX' },
  { value: 'Fixed', label: 'Fixed' },
  { value: 'Formula', label: 'Formula' }
];

const INSTRUMENT_OPTIONS = [
  { value: PLACEHOLDER_VALUES.INSTRUMENT, label: PLACEHOLDER_VALUES.INSTRUMENT },
  { value: 'CBOB USGC', label: 'CBOB USGC' },
  { value: 'CBOB', label: 'CBOB' },
  { value: 'CBOB Chicago', label: 'CBOB Chicago' },
  { value: 'CBOB Gulf', label: 'CBOB Gulf' },
  { value: 'Premium USGC', label: 'Premium USGC' },
  { value: 'CARBOB', label: 'CARBOB' },
  { value: 'ULSD', label: 'ULSD' },
  { value: 'Jet Fuel', label: 'Jet Fuel' },
  { value: 'Ethanol', label: 'Ethanol' },
  { value: 'RBOB Futures', label: 'RBOB Futures' },
  { value: 'Renewable Diesel', label: 'Renewable Diesel' },
  { value: 'Differential', label: 'Differential' },
  { value: 'Discount', label: 'Discount' },
  { value: 'Shell Discount', label: 'Shell Discount' },
  { value: 'Volume Discount', label: 'Volume Discount' },
  { value: 'Marathon Discount', label: 'Marathon Discount' },
  { value: 'BP Discount', label: 'BP Discount' },
  { value: 'Partner Discount', label: 'Partner Discount' },
  { value: 'Seasonal Factor', label: 'Seasonal Factor' },
  { value: 'Terminal Fee', label: 'Terminal Fee' },
  { value: 'Quality Premium', label: 'Quality Premium' },
  { value: 'Octane Premium', label: 'Octane Premium' },
  { value: 'Volume Rebate', label: 'Volume Rebate' },
  { value: 'Freight Diff', label: 'Freight Diff' },
  { value: 'Spot Discount', label: 'Spot Discount' },
  { value: 'Airport Fee', label: 'Airport Fee' },
  { value: 'Quality Cert', label: 'Quality Cert' },
  { value: 'Delivery Charge', label: 'Delivery Charge' },
  { value: 'Contract Discount', label: 'Contract Discount' },
  { value: 'RIN Credit D6', label: 'RIN Credit D6' },
  { value: 'D4 RIN Credit', label: 'D4 RIN Credit' },
  { value: 'Transport Charge', label: 'Transport Charge' },
  { value: 'Weekend Premium', label: 'Weekend Premium' },
  { value: 'Holiday Factor', label: 'Holiday Factor' },
  { value: 'Loyalty Credit', label: 'Loyalty Credit' },
  { value: 'CARB Fee', label: 'CARB Fee' },
  { value: 'Spec Premium', label: 'Spec Premium' },
  { value: 'LCFS Credit', label: 'LCFS Credit' },
  { value: 'Regional Diff', label: 'Regional Diff' },
  { value: 'Local Discount', label: 'Local Discount' },
  { value: 'Basis Adjustment', label: 'Basis Adjustment' },
  { value: 'Hedge Cost', label: 'Hedge Cost' },
  { value: 'Contango Factor', label: 'Contango Factor' },
  { value: 'Summer Premium', label: 'Summer Premium' },
  { value: 'RVP Compliance', label: 'RVP Compliance' },
  { value: 'Volume Tier', label: 'Volume Tier' },
  { value: 'Winter Premium', label: 'Winter Premium' },
  { value: 'Cold Filter', label: 'Cold Filter' },
  { value: 'Additive Cost', label: 'Additive Cost' },
  { value: 'Brand Premium', label: 'Brand Premium' },
  { value: 'Arbitrage Factor', label: 'Arbitrage Factor' },
  { value: 'Transaction Cost', label: 'Transaction Cost' },
  { value: 'Pipeline Diff', label: 'Pipeline Diff' },
  { value: 'Regional Discount', label: 'Regional Discount' },
  { value: 'Tier 1 Discount', label: 'Tier 1 Discount' },
  { value: 'Tier 2 Discount', label: 'Tier 2 Discount' },
  { value: 'Loyalty Bonus', label: 'Loyalty Bonus' },
  { value: 'Base Terminal Fee', label: 'Base Terminal Fee' },
  { value: 'Renewable Premium', label: 'Renewable Premium' },
  { value: 'Volume Incentive', label: 'Volume Incentive' },
  { value: 'Blend Credit', label: 'Blend Credit' }
];

const TYPE_OPTIONS = [
  { value: PLACEHOLDER_VALUES.TYPE, label: PLACEHOLDER_VALUES.TYPE },
  { value: 'Settle', label: 'Settle' },
  { value: 'Average', label: 'Average' },
  { value: 'Fixed', label: 'Fixed' },
  { value: 'High', label: 'High' },
  { value: 'Low', label: 'Low' },
  { value: 'Spot', label: 'Spot' },
  { value: 'Variable', label: 'Variable' },
  { value: 'Futures', label: 'Futures' }
];

const DATE_RULE_OPTIONS = [
  { value: PLACEHOLDER_VALUES.DATE_RULE, label: PLACEHOLDER_VALUES.DATE_RULE },
  { value: 'Prior Day', label: 'Prior Day' },
  { value: 'Current', label: 'Current' },
  { value: 'Next Day', label: 'Next Day' },
  { value: 'Month Average', label: 'Month Average' },
  { value: 'Week Average', label: 'Week Average' },
  { value: 'Friday Close', label: 'Friday Close' },
  { value: 'Settlement', label: 'Settlement' }
];

// =============================================================================
// Cell Style Helper
// =============================================================================

const getPlaceholderCellStyle = (value: unknown): React.CSSProperties => {
  if (isPlaceholder(value)) {
    return PLACEHOLDER_CELL_STYLE;
  }
  return {};
};

// =============================================================================
// Component
// =============================================================================

/**
 * FormulaComponentsGrid - Editable grid for formula components
 *
 * Features:
 * - Row drag and drop for reordering
 * - Searchable select dropdowns for each field
 * - Auto-generated display names with custom override support
 * - Delete and reset actions per row
 */
export function FormulaComponentsGrid({
  components,
  setComponents,
  onAddRow,
  onOpenTemplateChooser,
  onSaveAsTemplate,
}: FormulaComponentsGridProps) {
  // Column definitions
  const columnDefs = useMemo(() => [
    {
      rowDrag: true,
      width: 40,
      suppressMenu: true,
      lockPosition: true,
      pinned: 'left' as const,
      rowDragText: (params: { rowNode: { data: { percentage: string } } }) => params.rowNode.data.percentage
    },
    {
      field: 'percentage',
      headerName: '%',
      width: 100,
      editable: true,
      cellEditor: SearchableSelect,
      suppressKeyboardEvent,
      cellEditorParams: {
        options: PERCENTAGE_OPTIONS,
        showSearch: true,
        closeOnBlur: true
      },
      cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value)
    },
    {
      field: 'source',
      headerName: 'PUBLISHER',
      width: 120,
      editable: true,
      cellEditor: SearchableSelect,
      suppressKeyboardEvent,
      cellEditorParams: {
        options: SOURCE_OPTIONS,
        showSearch: true,
        closeOnBlur: true
      },
      cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value)
    },
    {
      field: 'instrument',
      headerName: 'INSTRUMENT',
      width: 180,
      editable: true,
      cellEditor: SearchableSelect,
      suppressKeyboardEvent,
      cellEditorParams: {
        options: INSTRUMENT_OPTIONS,
        showSearch: true,
        closeOnBlur: true
      },
      cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value)
    },
    {
      field: 'type',
      headerName: 'TYPE',
      width: 120,
      editable: true,
      cellEditor: SearchableSelect,
      suppressKeyboardEvent,
      cellEditorParams: {
        options: TYPE_OPTIONS,
        showSearch: true,
        closeOnBlur: true
      },
      cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value)
    },
    {
      field: 'dateRule',
      headerName: 'DATE RULE',
      width: 130,
      editable: true,
      cellEditor: SearchableSelect,
      suppressKeyboardEvent,
      cellEditorParams: {
        options: DATE_RULE_OPTIONS,
        showSearch: true,
        closeOnBlur: true
      },
      cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value)
    },
    {
      field: 'required',
      headerName: 'Required',
      width: 100,
      cellRenderer: (params: { value: boolean }) => (
        <Checkbox checked={params.value} disabled />
      ),
    },
    {
      field: 'display',
      headerName: 'DISPLAY',
      width: 200,
      editable: true,
      valueGetter: (params: { data: FormulaComponentData | undefined }) => {
        const comp = params.data;
        if (!comp) return '';
        if (comp.customDisplayName) return comp.customDisplayName;
        return `${comp.percentage || ''} ${comp.source || ''} ${comp.instrument || ''} ${comp.dateRule || ''} ${comp.type || ''}`.trim();
      },
      valueSetter: (params: { data: FormulaComponentData; newValue: string }) => {
        params.data.customDisplayName = params.newValue;
        return true;
      },
      cellStyle: (params: { data?: FormulaComponentData }) => {
        if (params.data?.customDisplayName) {
          return { fontWeight: 600, color: COLORS.DARK_TEXT };
        }
        return { backgroundColor: '#f5f5f5', fontStyle: 'italic', color: COLORS.MEDIUM_TEXT };
      }
    },
    {
      headerName: 'ACTIONS',
      width: 100,
      pinned: 'right' as const,
      cellRenderer: (params: { data?: FormulaComponentData; api: { refreshCells: (config: { rowNodes: unknown[]; force: boolean }) => void }; node: unknown }) => {
        const hasCustomName = !!params.data?.customDisplayName;

        return (
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', gap: '12px' }}>
            {hasCustomName && (
              <Popconfirm
                title="Reset display name?"
                description="This will restore the auto-generated display name."
                onConfirm={() => {
                  if (params.data) {
                    params.data.customDisplayName = null;
                    params.api.refreshCells({ rowNodes: [params.node], force: true });
                  }
                }}
                okText="Reset"
                cancelText="Cancel"
              >
                <UndoOutlined
                  style={{
                    color: COLORS.MEDIUM_TEXT,
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = COLORS.DARK_TEXT}
                  onMouseLeave={(e) => e.currentTarget.style.color = COLORS.MEDIUM_TEXT}
                />
              </Popconfirm>
            )}
            <DeleteOutlined
              style={{
                color: COLORS.MEDIUM_TEXT,
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLORS.DARK_TEXT}
              onMouseLeave={(e) => e.currentTarget.style.color = COLORS.MEDIUM_TEXT}
              onClick={() => {
                if (params.data) {
                  setComponents(components.filter(c => c.id !== params.data!.id));
                }
              }}
            />
          </div>
        );
      }
    }
  ], [components, setComponents]);

  // Grid configuration
  const agPropOverrides = useMemo(() => ({
    rowDragManaged: true,
    rowDragEntireRow: true,
    animateRows: true,
    suppressRowClickSelection: true,
    suppressMovableColumns: true,
    domLayout: 'normal' as const,
    headerHeight: 40,
    rowHeight: 40,
    defaultColDef: {
      sortable: false,
      filter: false,
      resizable: true,
    },
    onCellValueChanged: () => {
      // Force re-render to update formula preview
      setComponents([...components]);
    },
    onRowDragEnd: (event: { api: { forEachNode: (callback: (node: { data: FormulaComponentData }) => void) => void } }) => {
      // Get all rows in their new order
      const newOrder: FormulaComponentData[] = [];
      event.api.forEachNode((node) => newOrder.push(node.data));
      setComponents(newOrder);
    }
  }), [components, setComponents]);

  return (
    <div>
      <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <Texto style={{ fontSize: '12px', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: COLORS.MEDIUM_TEXT }}>
          Components
        </Texto>
        <div style={{ display: 'flex', gap: '8px' }}>
          <GraviButton
            buttonText="Add Row"
            icon={<PlusOutlined />}
            appearance="success"
            onClick={onAddRow}
          />
          {onOpenTemplateChooser && (
            <GraviButton
              buttonText="Add Template"
              icon={<PlusOutlined />}
              appearance="outlined"
              onClick={onOpenTemplateChooser}
            />
          )}
          {onSaveAsTemplate && (
            <GraviButton
              buttonText="Save as Template"
              icon={<SettingOutlined />}
              appearance="outlined"
              onClick={onSaveAsTemplate}
            />
          )}
        </div>
      </Horizontal>
      <div style={{ height: '300px', width: '100%' }}>
        <GraviGrid
          rowData={components}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          hideControlBar={true}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Internal Types
// =============================================================================

interface FormulaComponentData {
  id: number;
  percentage: string;
  source: string;
  instrument: string;
  type: string;
  dateRule: string;
  required: boolean;
  customDisplayName?: string | null;
}

export default FormulaComponentsGrid;
