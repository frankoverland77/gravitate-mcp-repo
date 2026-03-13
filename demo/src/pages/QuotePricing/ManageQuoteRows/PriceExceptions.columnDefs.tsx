import type { ColDef, ColGroupDef } from 'ag-grid-community'

const HEADER_CLASS = 'price-exception-header'

const decimalFormatter = (params: any) => {
  if (params.value == null) return ''
  return Number(params.value).toFixed(4)
}

const HARD_CELL_STYLE = { backgroundColor: 'rgba(255, 77, 79, 0.06)' }
const SOFT_CELL_STYLE = { backgroundColor: 'rgba(250, 173, 20, 0.06)' }
const DISABLED_CELL_STYLE = {
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
  color: '#bfbfbf',
}

type ThresholdGroupConfig = {
  headerName: string
  prefix: string
  isAbsolute?: boolean
}

function makeThresholdGroup(config: ThresholdGroupConfig): ColGroupDef {
  const { headerName, prefix, isAbsolute } = config

  const children: ColDef[] = [
    {
      field: `${prefix}_hardLow`,
      headerName: 'Hard Low',
      width: 85,
      editable: !isAbsolute,
      valueFormatter: decimalFormatter,
      headerClass: HEADER_CLASS,
      type: 'rightAligned',
      cellStyle: isAbsolute ? DISABLED_CELL_STYLE : HARD_CELL_STYLE,
    },
    {
      field: `${prefix}_softLow`,
      headerName: 'Soft Low',
      width: 85,
      editable: !isAbsolute,
      valueFormatter: decimalFormatter,
      headerClass: HEADER_CLASS,
      type: 'rightAligned',
      cellStyle: isAbsolute ? DISABLED_CELL_STYLE : SOFT_CELL_STYLE,
    },
    {
      field: `${prefix}_softHigh`,
      headerName: 'Soft High',
      width: 85,
      editable: true,
      valueFormatter: decimalFormatter,
      headerClass: HEADER_CLASS,
      type: 'rightAligned',
      cellStyle: SOFT_CELL_STYLE,
    },
    {
      field: `${prefix}_hardHigh`,
      headerName: 'Hard High',
      width: 85,
      editable: true,
      valueFormatter: decimalFormatter,
      headerClass: HEADER_CLASS,
      type: 'rightAligned',
      cellStyle: HARD_CELL_STYLE,
    },
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
  { headerName: 'Market Move', prefix: 'marketMove', isAbsolute: true },
  { headerName: 'Price Delta', prefix: 'priceDelta' },
  { headerName: 'Price', prefix: 'price' },
  { headerName: 'Ref Strategy to Price', prefix: 'benchDelta', isAbsolute: true },
  { headerName: 'Bench Value', prefix: 'benchValue' },
]

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
