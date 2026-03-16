import { ColDef, ColGroupDef, ICellRendererParams } from 'ag-grid-community'
import { BBDTag } from '@gravitate-js/excalibrr'
import { HistoryOutlined, StopFilled, WarningFilled } from '@ant-design/icons'
import type { ExceptionProfile, EvaluationResult, PeriodDisplay, PeriodToggleValue } from './QuoteBook.types'
import { PROPOSED_COMPONENTS, CURRENT_COMPONENTS } from './QuoteBook.types'

type ColumnOptions = {
  onHistoryClick: () => void
  evaluationMap?: Map<number, EvaluationResult>
  profileMap?: Record<string, ExceptionProfile>
  isFutureMode?: boolean
  periodDisplay?: PeriodDisplay
  periodToggleValue?: PeriodToggleValue
}

function getViolationStyle(
  evaluationMap: Map<number, EvaluationResult> | undefined,
  rowId: number,
  component: string,
): Record<string, string | number> | null {
  if (!evaluationMap) return null
  const result = evaluationMap.get(rowId)
  if (!result) return null
  const violation = result.violations.find(v => v.component === component)
  if (!violation) return null
  if (violation.severity === 'Hard') return { color: '#dc2626', fontWeight: 600 }
  if (violation.severity === 'Soft') return { color: '#d97706', fontWeight: 600 }
  return null
}

export const getQuoteBookColumnDefs = (options: ColumnOptions): (ColDef | ColGroupDef)[] => {
  const baseCols: (ColDef | ColGroupDef)[] = [
  {
    headerName: '',
    field: 'id',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 40,
    suppressMenu: true,
    pinned: 'left',
  },
  {
    headerName: '',
    field: '_history',
    width: 50,
    suppressMenu: true,
    pinned: 'left',
    cellRenderer: (params: ICellRendererParams) => {
      if (!params.data) return null
      return (
        <HistoryOutlined
          style={{ cursor: 'pointer', fontSize: 16, color: 'var(--theme-color-1)' }}
          onClick={() => options.onHistoryClick()}
        />
      )
    },
  },
  {
    field: 'product',
    headerName: 'Product',
    width: 140,
    pinned: 'left',
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 140,
    pinned: 'left',
  },
  ]

  function buildExceptionGroup(
    groupName: string,
    filterComponents: readonly string[] | null,
    groupOptions?: { marryChildren?: boolean; includeProfile?: boolean },
  ): ColGroupDef {
    const filterSet = filterComponents ? new Set(filterComponents) : null

    return {
      headerName: groupName,
      ...(groupOptions?.marryChildren ? { marryChildren: true } : {}),
      children: [
        {
          headerName: '',
          colId: `exceptionCount_${groupName}`,
          width: 100,
          suppressMenu: true,
          valueGetter: (params: any) => {
            if (!params.data) return null
            const result = options.evaluationMap?.get(params.data.id)
            if (!result) return null
            const violations = filterSet
              ? result.violations.filter((v: any) => filterSet.has(v.component))
              : result.violations
            if (violations.length === 0) return null
            const hasHard = violations.some((v: any) => v.severity === 'Hard')
            return hasHard ? 'Urgent' : 'Caution'
          },
          cellRenderer: (params: ICellRendererParams) => {
            if (!params.value) return null
            const isUrgent = params.value === 'Urgent'
            const Icon = isUrgent ? StopFilled : WarningFilled
            const iconColor = isUrgent ? '#dc2626' : '#d97706'

            const result = params.data ? options.evaluationMap?.get(params.data.id) : null
            const violations = result
              ? (filterSet ? result.violations.filter(v => filterSet.has(v.component)) : result.violations)
              : []

            return (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}>
                <Icon style={{ color: iconColor, fontSize: 14 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1f2937' }}>
                  {violations.length}
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>
                  {params.value}
                </span>
              </span>
            )
          },
        },
        {
          headerName: 'Details',
          field: filterComponents ? `exceptions_${groupName}` : 'exceptions',
          colId: `exceptions_${groupName}`,
          width: 180,
          cellRenderer: (params: ICellRendererParams) => {
            if (!params.data) return null
            const result = options.evaluationMap?.get(params.data.id)
            const allViolations = result?.violations || []
            const violations = filterSet
              ? allViolations.filter(v => filterSet.has(v.component))
              : allViolations
            if (violations.length === 0) return null
            return (
              <span style={{ display: 'flex', gap: 4, alignItems: 'center', height: '100%' }}>
                {violations.slice(0, 2).map((v, i) => (
                  <BBDTag key={i} error={v.severity === 'Hard'} warning={v.severity === 'Soft'} style={{ margin: 0, fontSize: 11, width: 'fit-content' }}>
                    {v.component}
                  </BBDTag>
                ))}
                {violations.length > 2 && (
                  <BBDTag style={{ margin: 0, fontSize: 11, width: 'fit-content' }}>+{violations.length - 2}</BBDTag>
                )}
              </span>
            )
          },
        },
        ...((groupOptions?.includeProfile !== false && options.isFutureMode) ? [{
          headerName: 'Profile',
          field: 'profileKey',
          width: 155,
          cellRenderer: (params: ICellRendererParams) => {
            if (!params.data || !params.data.profileKey) return null
            const profile = options.profileMap?.[params.data.profileKey]
            if (!profile) return null
            const hasOverrides = params.data.overrides && params.data.overrides.length > 0
            const bg = hasOverrides ? '#fffbeb' : '#eff6ff'
            const color = hasOverrides ? '#d97706' : '#2563eb'
            return (
              <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 500,
                  background: bg,
                  color: color,
                  lineHeight: '18px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 140,
                }}>
                  {hasOverrides ? `${profile.name} (Override)` : profile.name}
                </span>
              </span>
            )
          },
        }] : []),
      ],
    }
  }

  const periodDisplay = options.periodDisplay || 'neither'
  const periodToggleValue = options.periodToggleValue || 'proposed'

  let exceptionCols: ColGroupDef[]
  if (periodDisplay === 'column-families') {
    exceptionCols = [
      buildExceptionGroup('Proposed', PROPOSED_COMPONENTS, { marryChildren: true, includeProfile: true }),
      buildExceptionGroup('Current', CURRENT_COMPONENTS, { marryChildren: true, includeProfile: false }),
    ]
  } else if (periodDisplay === 'toggle') {
    const activeComponents = periodToggleValue === 'proposed' ? PROPOSED_COMPONENTS : CURRENT_COMPONENTS
    exceptionCols = [buildExceptionGroup('Exceptions', activeComponents)]
  } else {
    exceptionCols = [buildExceptionGroup('Exceptions', null)]
  }

  const restCols: (ColDef | ColGroupDef)[] = [
  {
    field: 'uom',
    headerName: 'UOM',
    width: 70,
  },
  {
    headerName: 'Current Period',
    children: [
      {
        field: 'prior_volume',
        headerName: 'Sold Vol',
        width: 100,
        valueFormatter: ({ value }) => value != null ? value.toLocaleString() : '',
      },
      {
        field: 'prior_cost',
        headerName: 'Cost',
        width: 110,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'prior_lastDiff',
        headerName: 'Diff',
        width: 100,
        valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
      },
      {
        field: 'prior_lastPrice',
        headerName: 'Price',
        width: 110,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'prior_profit',
        headerName: 'Profit',
        width: 90,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
    ],
  },
  {
    headerName: 'Proposed Period',
    children: [
      {
        field: 'proposed_cost',
        headerName: 'Cost',
        width: 110,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'proposed_diff',
        headerName: 'Diff',
        width: 100,
        editable: true,
        valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
      },
      {
        field: 'proposed_price',
        headerName: 'Price',
        width: 110,
        editable: true,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
        cellStyle: (params) => {
          if (!params.data) return null
          if (params.data.proposed_price !== params.data.prior_lastPrice) {
            return { backgroundColor: 'rgba(var(--theme-color-1-rgb, 24, 144, 255), 0.08)' }
          }
          return null
        },
      },
      {
        field: 'proposed_delta',
        headerName: 'Price Delta',
        width: 100,
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.value && params.value !== 0) return null
          const val = params.value as number
          const violation = getViolationStyle(options.evaluationMap, params.data?.id, 'Price Delta')
          const defaultColor = val > 0 ? '#52c41a' : val < 0 ? '#ff4d4f' : 'inherit'
          const color = violation ? violation.color as string : defaultColor
          const fontWeight = violation ? 600 : 600
          const arrow = val > 0 ? '\u25B2' : val < 0 ? '\u25BC' : ''
          return (
            <span style={{ color, fontWeight }}>
              {arrow} {Math.abs(val).toFixed(4)}
            </span>
          )
        },
      },
      {
        field: 'proposed_margin',
        headerName: 'Margin',
        width: 100,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
        cellStyle: (params) => {
          if (!params.data) return null
          const val = params.data.proposed_margin
          const violation = getViolationStyle(options.evaluationMap, params.data.id, 'Margin')
          if (violation) return violation
          if (val > 0) return { backgroundColor: 'rgba(82, 196, 26, 0.08)' }
          if (val < 0) return { backgroundColor: 'rgba(255, 77, 79, 0.08)' }
          return null
        },
      },
      {
        field: 'proposed_marketMove',
        headerName: 'Mkt Move',
        width: 100,
        valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
        cellStyle: (params) => {
          if (!params.data) return null
          return getViolationStyle(options.evaluationMap, params.data.id, 'Market Move')
        },
      },
    ],
  },
{
    field: 'allocation',
    headerName: 'Allocation',
    width: 100,
    valueFormatter: ({ value }) => value != null ? `${Math.round(value * 100)}%` : '',
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    width: 110,
  },
  {
    field: 'group',
    headerName: 'Group',
    rowGroup: true,
    hide: true,
  },
  ]

  return [...baseCols, ...exceptionCols, ...restCols]
}
