import type { ColDef, ColGroupDef } from 'ag-grid-community'
import { BulkNumberEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { NotificationMessage } from '@gravitate-js/excalibrr'

const HEADER_CLASS = 'price-exception-header'

const THRESHOLD_FIELDS = ['CriticalBelow', 'WarningBelow', 'WarningAbove', 'CriticalAbove'] as const
const THRESHOLD_LABELS = ['Critical Below', 'Warning Below', 'Warning Above', 'Critical Above'] as const

const CRITICAL_CELL_STYLE = { backgroundColor: 'rgba(255, 77, 79, 0.06)' }
const WARNING_CELL_STYLE = { backgroundColor: 'rgba(250, 173, 20, 0.06)' }

type ThresholdGroupConfig = {
  headerName: string
  prefix: string
}

const COMPONENT_GROUPS: ThresholdGroupConfig[] = [
  { headerName: 'Margin', prefix: 'Margin' },
  { headerName: 'Cost', prefix: 'Cost' },
  { headerName: 'Market Move', prefix: 'MarketMove' },
  { headerName: 'Price Delta', prefix: 'PriceDelta' },
  { headerName: 'Reference Strategy Delta', prefix: 'ReferenceStrategyDelta' },
]

// --- Exports (grid shape at a glance) ---

interface PriceExceptionColumnDefParams {
  canWrite: boolean
}

export function getPriceExceptionColumnDefs({ canWrite }: PriceExceptionColumnDefParams): (ColDef | ColGroupDef)[] {
  return [
    Configuration(),
    Product(),
    Location(),
    ...COMPONENT_GROUPS.map(g => makeThresholdGroup(g, canWrite)),
  ]
}

export function validateThresholdOrdering(row: any): string | null {
  for (const { headerName, prefix } of COMPONENT_GROUPS) {
    const vals = THRESHOLD_FIELDS.map((f) => row[`${prefix}_${f}`])
    for (let i = 0; i < vals.length - 1; i++) {
      if (vals[i] != null && vals[i + 1] != null && vals[i] >= vals[i + 1]) {
        return `${headerName}: ${THRESHOLD_LABELS[i]} must be less than ${THRESHOLD_LABELS[i + 1]}`
      }
    }
  }
  return null
}

// --- Static columns ---

function Configuration(): ColDef {
  return {
    field: 'configurationName',
    headerName: 'Configuration',
    rowGroup: true,
    hide: true,
  }
}

function Product(): ColDef {
  return {
    field: 'product',
    headerName: 'Product',
    width: 130,
    pinned: 'left',
  }
}

function Location(): ColDef {
  return {
    field: 'location',
    headerName: 'Location',
    width: 130,
    pinned: 'left',
  }
}

// --- Threshold column group builder ---

function formatDecimal(params: any): string {
  if (params.value == null) return ''
  return Number(params.value).toFixed(4)
}

function makeThresholdColumn(
  prefix: string,
  headerName: string,
  field: string,
  shortName: string,
  style: Record<string, string>,
  validateOrder: (data: any, fieldBeingSet: string, newValue: number) => boolean,
  canWrite: boolean,
): ColDef {
  return {
    field: `${prefix}_${field}`,
    headerName: `${headerName} ${shortName}`,
    headerValueGetter: () => shortName,
    width: 85,
    editable: canWrite,
    isBulkEditable: canWrite,
    bulkCellEditor: BulkNumberEditor,
    bulkCellEditorParams: {
      propKey: `${prefix}_${field}`,
      precision: 4,
      step: 0.0001,
    },
    valueSetter: (params: any) => {
      const newVal = Number(params.newValue)
      if (isNaN(newVal)) return false
      if (!validateOrder(params.data, `${prefix}_${field}`, newVal)) return false
      params.data[`${prefix}_${field}`] = newVal
      return true
    },
    valueFormatter: formatDecimal,
    headerClass: HEADER_CLASS,
    type: 'rightAligned',
    cellStyle: style,
  }
}

function makeThresholdGroup(config: ThresholdGroupConfig, canWrite: boolean): ColGroupDef {
  const { headerName, prefix } = config

  function validateThresholdOrder(data: any, fieldBeingSet: string, newValue: number): boolean {
    const vals = THRESHOLD_FIELDS.map((f) => {
      const fullField = `${prefix}_${f}`
      return fullField === fieldBeingSet ? newValue : data[fullField]
    })
    for (let i = 0; i < vals.length - 1; i++) {
      if (vals[i] != null && vals[i + 1] != null && vals[i] >= vals[i + 1]) {
        const leftLabel = `${headerName} ${THRESHOLD_LABELS[i]}`
        const rightLabel = `${headerName} ${THRESHOLD_LABELS[i + 1]}`
        NotificationMessage('Validation Error', `${leftLabel} must be less than ${rightLabel}`, true)
        return false
      }
    }
    return true
  }

  const children: ColDef[] = [
    makeThresholdColumn(prefix, headerName, 'CriticalBelow', 'Critical Below', CRITICAL_CELL_STYLE, validateThresholdOrder, canWrite),
    makeThresholdColumn(prefix, headerName, 'WarningBelow', 'Warning Below', WARNING_CELL_STYLE, validateThresholdOrder, canWrite),
    makeThresholdColumn(prefix, headerName, 'WarningAbove', 'Warning Above', WARNING_CELL_STYLE, validateThresholdOrder, canWrite),
    makeThresholdColumn(prefix, headerName, 'CriticalAbove', 'Critical Above', CRITICAL_CELL_STYLE, validateThresholdOrder, canWrite),
  ]

  return {
    headerName,
    headerClass: HEADER_CLASS,
    marryChildren: true,
    children,
  }
}
