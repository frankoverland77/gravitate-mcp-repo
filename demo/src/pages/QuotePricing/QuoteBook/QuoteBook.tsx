import { useState, useMemo, useCallback } from 'react'
import { GraviGrid, Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Drawer } from 'antd'
import { quoteBookData } from './QuoteBook.data'
import { getQuoteBookColumnDefs } from './QuoteBook.columnDefs'
import { QuoteBookGroupTabs } from './components/QuoteBookGroupTabs'
import { QuoteBookActionButtons } from './components/QuoteBookActionButtons'
import { QuoteBookAnalyticsPanel } from './components/QuoteBookAnalyticsPanel'
import { QuoteBookFooter } from './components/QuoteBookFooter'
import { QuoteBookHistoryDrawer } from './components/QuoteBookHistoryDrawer'
import { QuoteBookProfileChip } from './components/QuoteBookProfileChip'
import type { DrawerState } from './QuoteBook.types'

export function QuoteBook() {
  const [activeGroupTab, setActiveGroupTab] = useState('wholesale')
  const [publicationMode, setPublicationMode] = useState<'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay'>('EndOfDay')
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSpreadRows, setShowSpreadRows] = useState(false)
  const [publishMode, setPublishMode] = useState(false)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [isPublishDrawerOpen, setIsPublishDrawerOpen] = useState(false)
  const [dirtyCount, setDirtyCount] = useState(0)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [activePageTab, setActivePageTab] = useState<'configuration' | 'profiles'>('configuration')
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    mode: 'empty',
    selectedRowIds: [],
    actionMode: 'profile',
    selectedProfileKey: null,
  })

  const filteredRows = useMemo(() => {
    return quoteBookData.filter(row => {
      if (row.group !== activeGroupTab) return false
      if (!showSpreadRows && row.isSpread) return false
      return true
    })
  }, [activeGroupTab, showSpreadRows])

  const columnDefs = useMemo(() => getQuoteBookColumnDefs({
    onHistoryClick: () => setIsHistoryDrawerOpen(true),
  }), [])

  const handleSelectionChanged = useCallback((event: any) => {
    const selected = event.api?.getSelectedRows()
    setSelectedRow(selected?.[0] || null)
  }, [])

  return (
    <Vertical height="100%">
      <QuoteBookGroupTabs activeTab={activeGroupTab} onTabChange={setActiveGroupTab} />
      <QuoteBookAnalyticsPanel visible={showAnalytics} selectedRow={selectedRow} />
      <Horizontal style={{ display: 'none' }} data-testid="page-level-tabs">
        <Texto
          style={{ cursor: 'pointer', fontWeight: activePageTab === 'configuration' ? 600 : 400 }}
          onClick={() => setActivePageTab('configuration')}
        >
          Configuration
        </Texto>
        <Texto
          style={{ cursor: 'pointer', fontWeight: activePageTab === 'profiles' ? 600 : 400 }}
          onClick={() => setActivePageTab('profiles')}
        >
          Exception Profiles
        </Texto>
      </Horizontal>
      <GraviGrid
        storageKey="quotebook-main-grid"
        rowData={filteredRows}
        columnDefs={columnDefs}
        agPropOverrides={{
          getRowId: (p: any) => String(p.data.id),
          rowSelection: 'multiple',
          suppressRowClickSelection: true,
          groupDefaultExpanded: -1,
          rowHeight: 35,
          groupDisplayType: 'groupRows',
          suppressAggFuncInHeader: true,
        }}
        onSelectionChanged={handleSelectionChanged}
        controlBarProps={{
          title: 'Quote Book — EOD',
          hideActiveFilters: true,
          actionButtons: (
            <Horizontal alignItems="center" style={{ gap: '8px' }}>
              <QuoteBookProfileChip />
              <QuoteBookActionButtons
                publicationMode={publicationMode}
                setPublicationMode={setPublicationMode}
                showAnalytics={showAnalytics}
                setShowAnalytics={setShowAnalytics}
                showSpreadRows={showSpreadRows}
                setShowSpreadRows={setShowSpreadRows}
                publishMode={publishMode}
              />
            </Horizontal>
          ),
        }}
      />
      <QuoteBookFooter
        publicationMode={publicationMode}
        publishMode={publishMode}
        setPublishMode={setPublishMode}
        dirtyCount={dirtyCount}
        onPublish={() => setIsPublishDrawerOpen(true)}
        onReset={() => setDirtyCount(0)}
      />
      <QuoteBookHistoryDrawer
        visible={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
      />
      <Drawer
        title="Publish Prices — EOD"
        visible={isPublishDrawerOpen}
        placement="bottom"
        height="50vh"
        onClose={() => setIsPublishDrawerOpen(false)}
      >
        <Vertical style={{ padding: 16, gap: '16px' }}>
          <Texto category="h5">Review prices before publishing</Texto>
          <Texto appearance="medium">Select rows in the grid and confirm publication to external systems.</Texto>
        </Vertical>
      </Drawer>
    </Vertical>
  )
}
