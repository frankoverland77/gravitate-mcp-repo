import { useState, useMemo, useCallback } from 'react'
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import { message } from 'antd'
import { inventoryAnalyticsData } from './InventoryAnalytics.data'
import { getInventoryAnalyticsColumnDefs } from './InventoryAnalytics.columnDefs'
import { InventoryAnalyticsGroupTabs } from './components/InventoryAnalyticsGroupTabs'
import { InventoryAnalyticsActionButtons } from './components/InventoryAnalyticsActionButtons'
import { InventoryAnalyticsPanel } from './components/InventoryAnalyticsPanel'
import { InventoryAnalyticsFooter } from './components/InventoryAnalyticsFooter'
import type { InventoryQuoteRow, PublicationMode, AnalyticsViewType } from './InventoryAnalytics.types'

const inventoryStatusRowStyles: Record<string, React.CSSProperties> = {
  critical: { background: 'rgba(220, 38, 38, 0.06)' },
  low: { background: 'rgba(202, 138, 4, 0.06)' },
  overstock: { background: 'rgba(124, 58, 237, 0.06)' },
}

export function InventoryAnalytics() {
  const [activeGroupTab, setActiveGroupTab] = useState('wholesale-east')
  const [publicationMode, setPublicationMode] = useState<PublicationMode>('EndOfDay')
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSpreadRows, setShowSpreadRows] = useState(false)
  const [dirtyCount, setDirtyCount] = useState(0)
  const [selectedRow, setSelectedRow] = useState<InventoryQuoteRow | null>(null)
  const [analyticsView, setAnalyticsView] = useState<AnalyticsViewType>('inventory')

  const columnDefs = useMemo(() => getInventoryAnalyticsColumnDefs(), [])

  const filteredRows = useMemo(() => {
    return inventoryAnalyticsData.filter(row => {
      if (row.group !== activeGroupTab) return false
      if (!showSpreadRows && row.isSpread) return false
      return true
    })
  }, [activeGroupTab, showSpreadRows])

  const handleSelectionChanged = useCallback((event: any) => {
    const selected = event.api.getSelectedRows()
    if (selected.length > 0) {
      setSelectedRow(selected[0])
    }
  }, [])

  const handleCellValueChanged = useCallback(() => {
    setDirtyCount(prev => prev + 1)
  }, [])

  const handleDiscard = useCallback(() => {
    setDirtyCount(0)
    message.info('Changes discarded')
  }, [])

  const handleSave = useCallback(() => {
    setDirtyCount(0)
    message.success('Changes saved')
  }, [])

  const handlePublish = useCallback(() => {
    message.success('Prices published')
  }, [])

  return (
    <Vertical height="100%">
      {/* Top bar: tabs + action buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px 0 0',
        borderBottom: '1px solid var(--gray-200)',
      }}>
        <InventoryAnalyticsGroupTabs activeTab={activeGroupTab} onTabChange={setActiveGroupTab} />
        <InventoryAnalyticsActionButtons
          publicationMode={publicationMode}
          setPublicationMode={setPublicationMode}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
          showSpreadRows={showSpreadRows}
          setShowSpreadRows={setShowSpreadRows}
        />
      </div>

      {/* Analytics panel (collapsible drawer) */}
      <InventoryAnalyticsPanel
        open={showAnalytics}
        selectedRow={selectedRow}
        selectedView={analyticsView}
        onViewChange={setAnalyticsView}
      />

      {/* Grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <GraviGrid
          storageKey="inventory-analytics-grid"
          rowData={filteredRows}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          onCellValueChanged={handleCellValueChanged}
          agPropOverrides={{
            getRowId: (p: any) => String(p.data.id),
            rowSelection: 'single' as const,
            suppressRowClickSelection: false,
            rowHeight: 35,
            getRowStyle: (params: any) => {
              const status = params.data?.inventoryStatus
              return status ? inventoryStatusRowStyles[status] : undefined
            },
          }}
          controlBarProps={{
            title: 'Inventory Analytics — Quote Book',
            hideActiveFilters: true,
          }}
        />
      </div>

      {/* Footer */}
      <InventoryAnalyticsFooter
        publicationMode={publicationMode}
        dirtyCount={dirtyCount}
        onDiscard={handleDiscard}
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </Vertical>
  )
}
