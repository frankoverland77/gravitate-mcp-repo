import { ColDef, ColGroupDef, ICellRendererParams, IRowNode } from 'ag-grid-community'
import { BBDTag } from '@gravitate-js/excalibrr'
import { HistoryOutlined, StopFilled, WarningFilled } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { ReportingAttributesCell } from '@components/shared/Grid/ReportingAttributesCell'
import type { ExceptionProfile, EvaluationResult, ComponentViolation, PeriodDisplay, PeriodToggleValue } from '../Api/types.schema'
import { PROPOSED_COMPONENTS, CURRENT_COMPONENTS } from '../Api/types.schema'

type ColumnOptions = {
  onHistoryClick: () => void
  evaluationMap?: Map<number, EvaluationResult>
  profileMap?: Record<string, ExceptionProfile>
  isFutureMode?: boolean
  periodDisplay?: PeriodDisplay
  periodToggleValue?: PeriodToggleValue
}

function getViolation(
  evaluationMap: Map<number, EvaluationResult> | undefined,
  rowId: number,
  component: string,
): ComponentViolation | null {
  if (!evaluationMap) return null
  const result = evaluationMap.get(rowId)
  if (!result) return null
  return result.violations.find(v => v.component === component) || null
}

const VIOLATION_STYLES = {
  Hard: { color: '#dc2626', fontWeight: 600, bg: 'rgba(220, 38, 38, 0.15)' },
  Soft: { color: '#d97706', fontWeight: 600, bg: 'rgba(217, 119, 6, 0.12)' },
} as const

function renderViolationCell(
  params: ICellRendererParams,
  component: string,
  evaluationMap: Map<number, EvaluationResult> | undefined,
  renderValue: (violation: ComponentViolation | null) => React.ReactNode,
): React.ReactElement | null {
  if (!params.data) return null
  const violation = getViolation(evaluationMap, params.data.id, component)
  const value = renderValue(violation)

  if (!violation) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        {value}
      </span>
    )
  }

  const style = VIOLATION_STYLES[violation.severity]
  const Icon = violation.severity === 'Hard' ? StopFilled : WarningFilled
  const tooltipText = `${violation.component}: ${violation.severity} — threshold ${violation.threshold}, value ${violation.value} (${violation.deviationPct > 0 ? '+' : ''}${violation.deviationPct.toFixed(1)}%)`

  return (
    <span style={{
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      backgroundColor: style.bg,
      padding: '0 4px',
      margin: '0 -4px',
    }}>
      <Tooltip title={tooltipText} mouseEnterDelay={0.4}>
        <Icon style={{ fontSize: 10, color: style.color, flexShrink: 0, marginRight: 4 }} />
      </Tooltip>
      {value}
    </span>
  )
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
    field: 'terminal',
    headerName: 'Terminal',
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
          field: filterComponents ? `exceptionCount_${groupName}` : 'exceptionCount',
          colId: `exceptionCount_${groupName}`,
          width: 100,
          suppressMenu: true,
          cellRenderer: (params: ICellRendererParams) => {
            if (!params.data) return null
            const result = options.evaluationMap?.get(params.data.id)
            if (!result) return null

            const violations = filterSet
              ? result.violations.filter(v => filterSet.has(v.component))
              : result.violations
            if (violations.length === 0) return null

            const hasHard = violations.some(v => v.severity === 'Hard')
            const Icon = hasHard ? StopFilled : WarningFilled
            const iconColor = hasHard ? '#dc2626' : '#d97706'
            const label = hasHard ? 'Urgent' : 'Caution'

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
                  {label}
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

  // Price Info column group — read-only Tier Group, Tier Level, and Reporting Attributes
  const priceInfoCols: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Price Info',
      marryChildren: true,
      children: [
        {
          field: 'tierGroup',
          headerName: 'Tier Group',
          width: 120,
          valueFormatter: ({ value }) => value ?? '',
          cellRenderer: (params: ICellRendererParams) => {
            if (!params.data || params.data.tierGroup == null) return <span style={{ display: 'flex', alignItems: 'center', height: '100%', color: 'var(--gray-400)' }}>—</span>
            return <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>{params.data.tierGroup}</span>
          },
        },
        {
          field: 'tierLevel',
          headerName: 'Tier Level',
          width: 110,
          valueFormatter: ({ value }) => value ?? '',
          cellRenderer: (params: ICellRendererParams) => {
            if (!params.data || params.data.tierLevel == null) return <span style={{ display: 'flex', alignItems: 'center', height: '100%', color: 'var(--gray-400)' }}>—</span>
            return <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>{params.data.tierLevel}</span>
          },
        },
        {
          field: 'reportingAttributes',
          headerName: 'Reporting Attributes',
          width: 240,
          cellRenderer: ReportingAttributesCell,
          // Stable canonical serialization used for sort, filter, and group-by-exact-combination.
          valueGetter: (p: { data?: { reportingAttributes?: string[] } }) => {
            const arr = p.data?.reportingAttributes ?? []
            return [...arr].sort().join(' · ')
          },
          // Keep the raw array available to the renderer (valueGetter above drives sort/filter/group).
          cellRendererParams: {},
          equals: (a: unknown, b: unknown) => a === b,
          comparator: (a: string, b: string) => a.localeCompare(b),
          enableRowGroup: true,
          // agSetColumnFilter shows one entry per unique exact-combination string.
          filter: 'agSetColumnFilter',
          filterParams: {
            valueFormatter: ({ value }: { value: string }) =>
              value === '' ? '(No attributes)' : value.split(' · ').join(', '),
          },
          // Group-header rendering: re-split the serialized string back into chips.
          cellRendererSelector: (params: ICellRendererParams) => {
            if (params.node?.group) {
              return {
                component: (p: ICellRendererParams) => {
                  const key = p.value as string
                  if (!key) return <span style={{ fontStyle: 'italic', color: 'var(--gray-500)' }}>No attributes ({(p.node as IRowNode)?.allChildrenCount ?? 0})</span>
                  const parts = key.split(' · ')
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                      {parts.map((n) => (
                        <BBDTag key={n} theme3 style={{ margin: 0 }}>{n}</BBDTag>
                      ))}
                      <span style={{ color: 'var(--gray-500)', marginLeft: 4 }}>
                        ({(p.node as IRowNode)?.allChildrenCount ?? 0})
                      </span>
                    </span>
                  )
                },
              }
            }
            // Rendered cells pass the raw array to ReportingAttributesCell.
            return {
              component: (p: ICellRendererParams) => (
                <ReportingAttributesCell
                  {...p}
                  value={p.data?.reportingAttributes ?? []}
                />
              ),
            }
          },
        },
      ],
    },
  ]

  const restCols: (ColDef | ColGroupDef)[] = [
  {
    field: 'prior_lastPrice',
    headerName: 'Cost',
    width: 110,
    valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
    cellRenderer: (params: ICellRendererParams) => renderViolationCell(
      params, 'Cost', options.evaluationMap,
      (violation) => {
        const val = params.value
        if (val == null) return null
        const style = violation ? VIOLATION_STYLES[violation.severity] : null
        return (
          <span style={style ? { color: style.color, fontWeight: style.fontWeight } : undefined}>
            ${val.toFixed(4)}
          </span>
        )
      },
    ),
  },
  {
    field: 'proposed_price',
    headerName: 'Proposed',
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
    field: 'proposed_margin',
    headerName: 'Margin',
    width: 100,
    valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
    cellRenderer: (params: ICellRendererParams) => renderViolationCell(
      params, 'Margin', options.evaluationMap,
      (violation) => {
        const val = params.value
        if (val == null) return null
        const style = violation ? VIOLATION_STYLES[violation.severity] : null
        return (
          <span style={style ? { color: style.color, fontWeight: style.fontWeight } : undefined}>
            ${val.toFixed(4)}
          </span>
        )
      },
    ),
  },
  {
    field: 'proposed_marketMove',
    headerName: 'Mkt Move',
    width: 100,
    valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
    cellRenderer: (params: ICellRendererParams) => renderViolationCell(
      params, 'Market Move', options.evaluationMap,
      (violation) => {
        const val = params.value
        if (val == null) return null
        const style = violation ? VIOLATION_STYLES[violation.severity] : null
        return (
          <span style={style ? { color: style.color, fontWeight: style.fontWeight } : undefined}>
            {val.toFixed(4)}
          </span>
        )
      },
    ),
  },
  {
    field: 'proposed_tierDiff',
    headerName: 'Tier Diff',
    width: 100,
    valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
    cellRenderer: (params: ICellRendererParams) => renderViolationCell(
      params, 'Tier Diff', options.evaluationMap,
      () => {
        const val = params.value
        if (val == null) return null
        return <span>{val.toFixed(4)}</span>
      },
    ),
  },
  {
    field: 'proposed_delta',
    headerName: 'Price Δ',
    width: 100,
    cellRenderer: (params: ICellRendererParams) => renderViolationCell(
      params, 'Price Delta', options.evaluationMap,
      (violation) => {
        if (!params.value && params.value !== 0) return null
        const val = params.value as number
        const defaultColor = val > 0 ? '#52c41a' : val < 0 ? '#ff4d4f' : 'inherit'
        const style = violation ? VIOLATION_STYLES[violation.severity] : null
        const color = style ? style.color : defaultColor
        const arrow = val > 0 ? '\u25B2' : val < 0 ? '\u25BC' : ''
        return (
          <span style={{ color, fontWeight: 600 }}>
            {arrow} {Math.abs(val).toFixed(4)}
          </span>
        )
      },
    ),
  },
  {
    headerName: 'Bench Δ',
    width: 100,
    valueGetter: (params: any) => {
      if (!params.data) return null
      return Math.abs(params.data.benchmark_ulsd - params.data.proposed_price)
    },
    valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
    cellRenderer: (params: ICellRendererParams) => renderViolationCell(
      params, 'Reference Strategy Delta', options.evaluationMap,
      (violation) => {
        if (!params.data) return null
        const val = Math.abs(params.data.benchmark_ulsd - params.data.proposed_price)
        const style = violation ? VIOLATION_STYLES[violation.severity] : null
        return (
          <span style={style ? { color: style.color, fontWeight: style.fontWeight } : undefined}>
            ${val.toFixed(4)}
          </span>
        )
      },
    ),
  },
  {
    field: 'proposed_adjustment',
    headerName: 'Adjustment',
    width: 110,
    editable: true,
    valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
  },
  {
    field: 'group',
    headerName: 'Group',
    rowGroup: true,
    hide: true,
  },
  ]

  return [...baseCols, ...exceptionCols, ...priceInfoCols, ...restCols]
}
