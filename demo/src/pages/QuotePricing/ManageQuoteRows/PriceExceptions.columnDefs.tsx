import type { ColDef, ColGroupDef } from 'ag-grid-community'
import { BulkNumberEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { NotificationMessage } from '@gravitate-js/excalibrr'

const HEADER_CLASS = 'price-exception-header'

const THRESHOLD_FIELDS = ['hardLow', 'softLow', 'softHigh', 'hardHigh'] as const
const THRESHOLD_LABELS = ['Critical Below', 'Warning Below', 'Warning Above', 'Critical Above'] as const

const decimalFormatter = (params: any) => {
  if (params.value == null) return ''
  return Number(params.value).toFixed(4)
}

const CRITICAL_CELL_STYLE = { backgroundColor: 'rgba(255, 77, 79, 0.06)' }
const WARNING_CELL_STYLE = { backgroundColor: 'rgba(250, 173, 20, 0.06)' }
type ThresholdGroupConfig = {
  headerName: string
  prefix: string
}

function makeThresholdGroup(config: ThresholdGroupConfig): ColGroupDef {
  const { headerName, prefix } = config

  const validateThresholdOrder = (data: any, fieldBeingSet: string, newValue: number) => {
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

  const thresholdCol = (field: string, shortName: string, style: Record<string, string>) => ({
    field: `${prefix}_${field}`,
    headerName: `${headerName} ${shortName}`,
    headerValueGetter: () => shortName,
    width: 85,
    editable: true,
    isBulkEditable: true,
    bulkCellEditor: BulkNumberEditor,
    bulkCellEditorParams: {
      propKey: `${prefix}_${field}`,
      precision: 4,
      step: 0.0001,
    },
    valueSetter: (params: any) => {
      const newVal = Number(params.newValue)
      if (isNaN(newVal)) return false
      if (!validateThresholdOrder(params.data, `${prefix}_${field}`, newVal)) return false
      params.data[`${prefix}_${field}`] = newVal
      return true
    },
    valueFormatter: decimalFormatter,
    headerClass: HEADER_CLASS,
    type: 'rightAligned',
    cellStyle: style,
  })

  const children: ColDef[] = [
    thresholdCol('hardLow', 'Critical Below', CRITICAL_CELL_STYLE),
    thresholdCol('softLow', 'Warning Below', WARNING_CELL_STYLE),
    thresholdCol('softHigh', 'Warning Above', WARNING_CELL_STYLE),
    thresholdCol('hardHigh', 'Critical Above', CRITICAL_CELL_STYLE),
  ]

  return {
    headerName,
    headerClass: HEADER_CLASS,
    marryChildren: true,
    children,
  }
}

const COMPONENT_GROUPS: ThresholdGroupConfig[] = [
  { headerName: 'Margin', prefix: 'margin' },
  { headerName: 'Cost', prefix: 'cost' },
  { headerName: 'Market Move', prefix: 'marketMove' },
  { headerName: 'Price Delta', prefix: 'priceDelta' },
  { headerName: 'Price', prefix: 'price' },
  { headerName: 'Ref Strategy to Price', prefix: 'benchDelta' },
  { headerName: 'Bench Value', prefix: 'benchValue' },
]

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

export function getPriceExceptionColumnDefs(): (ColDef | ColGroupDef)[] {
  return [
    {
      field: 'configurationName',
      headerName: 'Configuration',
      rowGroup: true,
      hide: true,
    },
    {
      field: 'product',
      headerName: 'Product',
      width: 130,
      pinned: 'left',
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 130,
      pinned: 'left',
    },
    ...COMPONENT_GROUPS.map(makeThresholdGroup),
  ]
}
