import { useMemo } from 'react'
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import { quotebookWholesaleData } from './QuotebookWholesale.data'
import { getQuotebookWholesaleColumnDefs } from './QuotebookWholesale.columnDefs'

export function QuotebookWholesale() {
  const rowData = useMemo(() => quotebookWholesaleData, [])
  const columnDefs = useMemo(() => getQuotebookWholesaleColumnDefs(), [])

  return (
    <Vertical gap={0} style={{ height: '100%' }}>
      <GraviGrid
        storageKey="quotebook-wholesale-grid"
        rowData={rowData}
        columnDefs={columnDefs}
        agPropOverrides={{
          groupDisplayType: 'groupRows',
          groupDefaultExpanded: -1,
          suppressAggFuncInHeader: true,
          domLayout: 'normal',
          enableCellTextSelection: true,
          rowGroupPanelShow: 'never',
        }}
        controlBarProps={{
          title: 'Quotebook Wholesale',
          subtitle: `EOD Pricing — ${rowData.length} Rows`,
          hideActiveFilters: true,
          hideFilterRow: true,
        }}
      />
    </Vertical>
  )
}
