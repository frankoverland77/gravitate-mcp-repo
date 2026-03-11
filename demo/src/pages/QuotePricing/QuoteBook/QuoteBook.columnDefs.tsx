import { ColDef, ColGroupDef, ICellRendererParams } from 'ag-grid-community'
import { BBDTag } from '@gravitate-js/excalibrr'
import { HistoryOutlined } from '@ant-design/icons'
import type { ExceptionProfile, EvaluationResult } from './QuoteBook.types'

type ColumnOptions = {
  onHistoryClick: () => void
  evaluationMap?: Map<number, EvaluationResult>
  profileMap?: Record<string, ExceptionProfile>
  isFutureMode?: boolean
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

  const exceptionCols: (ColDef | ColGroupDef)[] = [{
    headerName: 'Exceptions',
    children: [
      {
        headerName: '',
        field: 'exceptionCount',
        width: 56,
        suppressMenu: true,
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.data) return null
          const { exceptionType, exceptionCount } = params.data
          if (!exceptionType || exceptionType === 'clean' || !exceptionCount) return null
          const bg = exceptionType === 'hard' ? '#dc2626' : '#d97706'
          return (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              minWidth: 22,
              flexShrink: 0,
              borderRadius: '50%',
              background: bg,
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1,
            }}>
              {exceptionCount}
            </span>
          )
        },
      },
      {
        headerName: 'Details',
        field: 'exceptions',
        width: 180,
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.data) return null
          const result = options.evaluationMap?.get(params.data.id)
          const violations = result?.violations || []
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
      ...(options.isFutureMode ? [{
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
          )
        },
      }] : []),
    ],
  }]

  const restCols: (ColDef | ColGroupDef)[] = [
  {
    field: 'uom',
    headerName: 'UOM',
    width: 70,
  },
  {
    headerName: 'Prior EOD',
    children: [
      {
        field: 'prior_lastPrice',
        headerName: 'Last Price',
        width: 110,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'prior_lastDiff',
        headerName: 'Last Diff',
        width: 100,
        valueFormatter: ({ value }) => value != null ? value.toFixed(4) : '',
      },
      {
        field: 'prior_profit',
        headerName: 'Profit',
        width: 90,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'prior_margin',
        headerName: 'Margin',
        width: 90,
        valueFormatter: ({ value }) => value != null ? `${value.toFixed(2)}%` : '',
      },
      {
        field: 'prior_volume',
        headerName: 'Volume',
        width: 100,
        valueFormatter: ({ value }) => value != null ? value.toLocaleString() : '',
      },
    ],
  },
  {
    headerName: 'New EOD',
    children: [
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
          const violation = getViolationStyle(options.evaluationMap, params.data.id, 'Price')
          if (violation) return violation
          if (params.data.proposed_price !== params.data.prior_lastPrice) {
            return { backgroundColor: 'rgba(var(--theme-color-1-rgb, 24, 144, 255), 0.08)' }
          }
          return null
        },
      },
      {
        field: 'proposed_delta',
        headerName: 'Delta',
        width: 90,
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
        width: 90,
        valueFormatter: ({ value }) => value != null ? `${value.toFixed(2)}%` : '',
        cellStyle: (params) => {
          if (!params.data) return null
          return getViolationStyle(options.evaluationMap, params.data.id, 'Margin')
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
    headerName: 'Benchmarks',
    children: [
      {
        field: 'benchmark_ulsd',
        headerName: 'ULSD',
        width: 100,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
      },
      {
        field: 'benchmark_unl',
        headerName: 'UNL',
        width: 100,
        valueFormatter: ({ value }) => value != null ? `$${value.toFixed(4)}` : '',
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
