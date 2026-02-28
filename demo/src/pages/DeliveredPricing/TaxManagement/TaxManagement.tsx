/**
 * Tax Management Page
 *
 * Reference data management grid for fuel excise tax rates.
 * Allows viewing and editing per-gallon tax rates at federal, state,
 * and local levels for gasoline and diesel commodities.
 *
 * Tax is destination-driven: the applicable rate is determined by
 * the delivery location's jurisdiction.
 *
 * Nested under the Delivered Pricing menu as a subpage.
 */

import { useMemo, useState } from 'react'
import { GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { getTaxManagementColumnDefs } from './TaxManagement.columnDefs'
import { taxRates, type TaxRate } from './TaxManagement.data'

export function TaxManagement() {
  const [rowData] = useState<TaxRate[]>(taxRates)

  const columnDefs = useMemo(() => getTaxManagementColumnDefs(), [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => String(params.data?.id),
      domLayout: 'normal' as const,
      groupDefaultExpanded: 1,
      autoGroupColumnDef: {
        headerName: 'Tax Level / Jurisdiction',
        minWidth: 260,
        cellRendererParams: {
          suppressCount: false,
        },
      },
    }),
    []
  )

  const federalCount = rowData.filter((r) => r.TaxLevel === 'Federal').length
  const stateCount = new Set(rowData.filter((r) => r.TaxLevel === 'State').map((r) => r.State)).size
  const localCount = new Set(rowData.filter((r) => r.TaxLevel === 'Local').map((r) => r.Jurisdiction)).size
  const totalRates = rowData.length

  const controlBarProps = useMemo(
    () => ({
      title: 'Tax Management',
      subtitle: 'Manage per-gallon fuel excise tax rates by jurisdiction.',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal verticalCenter style={{ gap: '0.75rem' }}>
          <Horizontal verticalCenter style={{ gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#722ed1',
                backgroundColor: 'rgba(114, 46, 209, 0.08)',
                padding: '1px 8px',
                borderRadius: 3,
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {federalCount} Federal
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.08)',
                padding: '1px 8px',
                borderRadius: 3,
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {stateCount} States
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#fa8c16',
                backgroundColor: 'rgba(250, 140, 22, 0.08)',
                padding: '1px 8px',
                borderRadius: 3,
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {localCount} Local
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--theme-primary, #1890ff)',
                backgroundColor: 'rgba(24, 144, 255, 0.08)',
                padding: '1px 8px',
                borderRadius: 3,
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              {totalRates} Tax Rates
            </span>
          </Horizontal>
        </Horizontal>
      ),
    }),
    [federalCount, stateCount, localCount, totalRates]
  )

  const updateEP = async () => {
    return Promise.resolve()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraviGrid
          storageKey="tax-management-grid"
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          updateEP={updateEP}
          headerHeight={33}
        />
      </div>
    </div>
  )
}
