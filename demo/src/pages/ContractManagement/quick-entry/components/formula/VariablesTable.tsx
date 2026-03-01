/**
 * Variables Table
 *
 * Editable GraviGrid table of formula variables with dropdown selects.
 * Pattern based on ContractDetails demo grid.
 */

import { useMemo } from 'react'
import { Vertical, GraviGrid } from '@gravitate-js/excalibrr'
import { DeleteOutlined } from '@ant-design/icons'

import type { FormulaVariable } from '../../../../../shared/types/formula.types'
import { PRICE_INSTRUMENTS_BY_GROUP } from '../../../../../shared/types/price.types'
import { isPlaceholder, PLACEHOLDER_VALUES } from '../../../../demos/grids/FormulaTemplates.data'
import styles from './VariablesTable.module.css'

interface VariablesTableProps {
  variables: FormulaVariable[]
  onVariableUpdate: (variableId: string, updates: Partial<FormulaVariable>) => void
  onRemoveVariable: (variableId: string) => void
}

// Placeholder cell style — matches FormulaComponentsGrid pattern
const PLACEHOLDER_CELL_STYLE: React.CSSProperties = {
  backgroundColor: '#f3e8ff',
  color: '#722ed1',
  fontWeight: 600,
}

const getPlaceholderCellStyle = (value: unknown): React.CSSProperties => {
  if (isPlaceholder(value)) {
    return PLACEHOLDER_CELL_STYLE
  }
  return {}
}

// Publisher options — include placeholder + template values
const PUBLISHER_OPTIONS = [
  PLACEHOLDER_VALUES.SOURCE,
  'OPIS',
  'Platts',
  'Argus',
  'Bloomberg',
  'ICE',
  'NYMEX',
]

// Price type options — include placeholder + template values
const PRICE_TYPE_OPTIONS = [
  PLACEHOLDER_VALUES.TYPE,
  'Low',
  'High',
  'Average',
  'Mean',
  'Settle',
  'Spot',
  'Fixed',
  'Futures',
]

// Date rule options — include placeholder + template values
const DATE_RULE_OPTIONS = [
  PLACEHOLDER_VALUES.DATE_RULE,
  'Prior Day',
  'Day Of',
  'Month Average',
  'Week Average',
  'Current',
  'Friday Close',
  'Settlement',
]

// All available instruments — include placeholder + template instruments
const INSTRUMENT_OPTIONS = [
  PLACEHOLDER_VALUES.INSTRUMENT,
  ...PRICE_INSTRUMENTS_BY_GROUP.gasoline,
  ...PRICE_INSTRUMENTS_BY_GROUP.diesel,
  'CBOB',
  'CBOB Chicago',
  'CBOB Gulf',
  'Premium USGC',
  'CARBOB',
  'Ethanol',
  'RBOB Futures',
  'Renewable Diesel',
  'Jet Fuel',
]

export function VariablesTable({ variables, onVariableUpdate, onRemoveVariable }: VariablesTableProps) {
  const columnDefs = useMemo(
    () => [
      {
        field: 'variableName',
        headerName: 'VARIABLE',
        width: 100,
        editable: false,
        suppressMovable: true,
      },
      {
        field: 'percentage',
        headerName: '%',
        width: 80,
        editable: true,
        valueFormatter: (params: { value: number | string }) =>
          isPlaceholder(params.value) ? String(params.value) : `${params.value ?? 100}%`,
        valueParser: (params: { newValue: string }) => parseFloat(params.newValue) || 0,
        cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value),
      },
      {
        field: 'pricePublisher',
        headerName: 'PUBLISHER',
        width: 110,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: PUBLISHER_OPTIONS,
        },
        cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value),
      },
      {
        field: 'priceInstrument',
        headerName: 'INSTRUMENT',
        width: 140,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: INSTRUMENT_OPTIONS,
        },
        cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value),
      },
      {
        field: 'priceType',
        headerName: 'TYPE',
        width: 90,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: PRICE_TYPE_OPTIONS,
        },
        cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value),
      },
      {
        field: 'differential',
        headerName: 'DIFFERENTIAL',
        width: 110,
        editable: true,
        valueFormatter: (params: { value: number }) => `$${(params.value ?? 0).toFixed(4)}`,
        valueParser: (params: { newValue: string }) => parseFloat(params.newValue) || 0,
      },
      {
        field: 'dateRule',
        headerName: 'DATE RULE',
        width: 120,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: DATE_RULE_OPTIONS,
        },
        cellStyle: (params: { value: unknown }) => getPlaceholderCellStyle(params.value),
      },
      {
        field: 'displayName',
        headerName: 'DISPLAY NAME',
        width: 120,
        editable: true,
        valueFormatter: (params: { value: string | null }) => params.value || '',
      },
      {
        headerName: '',
        width: 50,
        suppressMovable: true,
        cellRenderer: (params: { data: { id: string } }) => (
          <DeleteOutlined
            style={{ cursor: 'pointer', color: '#595959' }}
            onClick={() => onRemoveVariable(params.data.id)}
          />
        ),
      },
    ],
    [onRemoveVariable]
  )

  const agPropOverrides = {
    getRowId: (params: { data: FormulaVariable }) => params.data.id,
    domLayout: 'autoHeight' as const,
    headerHeight: 36,
    rowHeight: 40,
    suppressRowClickSelection: true,
    suppressMovableColumns: true,
    enableRangeSelection: true,
    enableFillHandle: true,
    rowGroupPanelShow: 'never' as const,
    overlayNoRowsTemplate:
      '<div style="padding: 32px; text-align: center; color: #8c8c8c;">No variables defined. Click "+ Add Variable" or use a template.</div>',
    onCellValueChanged: (event: any) => {
      const { data, colDef, newValue } = event
      if (data && colDef.field) {
        onVariableUpdate(data.id, { [colDef.field]: newValue })
      }
      // Force AG Grid to re-evaluate cellStyle for all cells
      // (clears purple placeholder styling when value is filled)
      event.api.refreshCells({ force: true })
    },
  }

  return (
    <Vertical className={styles.container} height='auto'>
      <GraviGrid
        rowData={variables}
        // @ts-expect-error - GraviGrid type inference issue
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        hideControlBar={true}
      />
    </Vertical>
  )
}
