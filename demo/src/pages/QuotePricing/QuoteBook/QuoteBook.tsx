import { useState, useMemo, useCallback, useRef } from 'react'
import { GraviGrid, Vertical, Horizontal } from '@gravitate-js/excalibrr'
import { Modal, message, Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { quoteBookData } from './QuoteBook.data'
import type { QuoteRow } from './QuoteBook.data'
import { exceptionProfiles as seedProfiles } from './QuoteBook.exceptions.data'
import { getQuoteBookColumnDefs } from './QuoteBook.columnDefs'
import { evaluateAllRows } from './QuoteBook.evaluation'
import { QuoteBookGroupTabs } from './components/QuoteBookGroupTabs'
import { QuoteBookActionButtons } from './components/QuoteBookActionButtons'
import { QuoteBookAnalyticsPanel } from './components/QuoteBookAnalyticsPanel'
import { QuoteBookFooter } from './components/QuoteBookFooter'
import { QuoteBookHistoryDrawer } from './components/QuoteBookHistoryDrawer'
import { QuoteBookProfileChip } from './components/QuoteBookProfileChip'
import { QuoteBookExceptionDrawer } from './components/QuoteBookExceptionDrawer'
import { QuoteBookViewSettingsDrawer } from './components/QuoteBookViewSettingsDrawer'
import type { DrawerState, ExceptionProfile, ThresholdOverride } from './QuoteBook.types'
import { useFeatureMode } from '../../../contexts/FeatureModeContext'

export function QuoteBook() {
  const { isFutureMode } = useFeatureMode()
  const [activeGroupTab, setActiveGroupTab] = useState('wholesale')
  const [publicationMode, setPublicationMode] = useState<'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay'>('EndOfDay')
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSpreadRows, setShowSpreadRows] = useState(false)
  const [publishMode, setPublishMode] = useState(false)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [dirtyCount, setDirtyCount] = useState(0)
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<QuoteRow[]>([])
  const gridApiRef = useRef<any>(null)
  const [publishModalVisible, setPublishModalVisible] = useState(false)
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false)
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: true,
    mode: 'empty',
    selectedRowIds: [],
    actionMode: 'profile',
    selectedProfileKey: null,
  })

  // --- Task 2: Mutable state ---
  const [rows, setRows] = useState<QuoteRow[]>(() => quoteBookData.map(r => ({ ...r, overrides: r.overrides ? [...r.overrides] : [] })))
  const [profiles] = useState<ExceptionProfile[]>(() => seedProfiles.map(p => ({ ...p, thresholds: p.thresholds.map(t => ({ ...t })) })))

  const profileMap = useMemo(() => {
    const map: Record<string, ExceptionProfile> = {}
    profiles.forEach(p => { map[p.key] = p })
    return map
  }, [profiles])

  const evaluationMap = useMemo(() => evaluateAllRows(rows, profileMap), [rows, profileMap])

  const evaluatedRows = useMemo(() => {
    return rows.map(row => {
      const result = evaluationMap.get(row.id)
      if (!result) return row
      return {
        ...row,
        exceptionType: result.exceptionType,
        exceptionCount: result.exceptionCount,
      }
    })
  }, [rows, evaluationMap])

  const filteredRows = useMemo(() => {
    return evaluatedRows.filter(row => {
      if (row.group !== activeGroupTab) return false
      if (!showSpreadRows && row.isSpread) return false
      return true
    })
  }, [evaluatedRows, activeGroupTab, showSpreadRows])

  // --- Analytics data ---
  const analyticsData = useMemo(() => {
    const allRows = evaluatedRows
    const total = allRows.length
    const hardRows = allRows.filter(r => r.exceptionType === 'hard')
    const softRows = allRows.filter(r => r.exceptionType === 'soft')
    const cleanRows = allRows.filter(r => r.exceptionType === 'clean')
    const readinessPct = total > 0 ? Math.round((cleanRows.length / total) * 100) : 100

    // Flagged components
    const componentMap: Record<string, { count: number; worstSeverity: 'hard' | 'soft' }> = {}
    evaluationMap.forEach(result => {
      result.violations.forEach(v => {
        if (!componentMap[v.component]) {
          componentMap[v.component] = { count: 0, worstSeverity: 'soft' }
        }
        componentMap[v.component].count++
        if (v.severity === 'Hard') componentMap[v.component].worstSeverity = 'hard'
      })
    })
    const flaggedComponents = Object.entries(componentMap)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, data]) => ({ name, severity: data.worstSeverity as 'hard' | 'soft', count: data.count }))

    // Worst offenders — top 5 by max deviation %
    type OffenderEntry = { rowId: number; quote: string; location: string; deviation: string; excCount: number; type: 'hard' | 'soft'; maxDevPct: number }
    const offenders: OffenderEntry[] = []
    evaluationMap.forEach((result, rowId) => {
      if (result.violations.length === 0) return
      const row = allRows.find(r => r.id === rowId)
      if (!row) return
      const maxDev = Math.max(...result.violations.map(v => v.deviationPct))
      const worstV = result.violations.reduce((a, b) => a.deviationPct > b.deviationPct ? a : b)
      const dirLabel = worstV.direction === 'below_floor' ? 'below floor' : 'above ceiling'
      offenders.push({
        rowId,
        quote: `QC-${String(rowId).padStart(3, '0')}`,
        location: row.location,
        deviation: `${maxDev.toFixed(0)}% ${dirLabel}`,
        excCount: result.exceptionCount,
        type: result.exceptionType as 'hard' | 'soft',
        maxDevPct: maxDev,
      })
    })
    offenders.sort((a, b) => b.maxDevPct - a.maxDevPct)
    const worstOffenders = offenders.slice(0, 5)

    return {
      readinessPct,
      hardCount: hardRows.length,
      softCount: softRows.length,
      cleanCount: cleanRows.length,
      total,
      flaggedComponents,
      worstOffenders,
    }
  }, [evaluatedRows, evaluationMap])

  // --- Profile chip: most common profile ---
  const mostCommonProfileName = useMemo(() => {
    const counts: Record<string, number> = {}
    rows.forEach(r => {
      const k = r.profileKey || 'default'
      counts[k] = (counts[k] || 0) + 1
    })
    let maxKey = 'default'
    let maxCount = 0
    Object.entries(counts).forEach(([k, c]) => {
      if (c > maxCount) { maxKey = k; maxCount = c }
    })
    // If the top key has more than 50% of rows, show its name; otherwise "Mixed"
    if (maxCount > rows.length / 2) {
      return profileMap[maxKey]?.name || maxKey
    }
    return 'Mixed'
  }, [rows, profileMap])

  // --- Hard exception count for footer ---
  const hardExceptionCount = analyticsData.hardCount

  // --- Helpers ---
  const updateRows = useCallback((updater: (prev: QuoteRow[]) => QuoteRow[]) => {
    setRows(updater)
  }, [])

  const deselectAll = useCallback(() => {
    gridApiRef.current?.deselectAll()
  }, [])

  // --- Task 3: Drawer action handlers ---
  const handleApplyProfile = useCallback((profileKey: string) => {
    const selectedIds = new Set(drawerState.selectedRowIds)
    if (selectedIds.size === 0) return
    updateRows(prev => prev.map(r => {
      if (!selectedIds.has(r.id)) return r
      return { ...r, profileKey, overrides: [] }
    }))
    deselectAll()
    setDrawerState(prev => ({ ...prev, actionMode: 'profile', selectedProfileKey: null }))
  }, [drawerState.selectedRowIds, updateRows, deselectAll])

  const handleApplyOverride = useCallback((override: ThresholdOverride, overwriteExisting: boolean) => {
    const selectedIds = new Set(drawerState.selectedRowIds)
    if (selectedIds.size === 0) return
    updateRows(prev => prev.map(r => {
      if (!selectedIds.has(r.id)) return r
      const existing = r.overrides || []
      const hasExisting = existing.some(o => o.component === override.component)
      if (hasExisting && !overwriteExisting) return r
      const newOverrides = existing.filter(o => o.component !== override.component)
      newOverrides.push(override)
      return { ...r, overrides: newOverrides }
    }))
    deselectAll()
  }, [drawerState.selectedRowIds, updateRows, deselectAll])

  const handleResetToDefaults = useCallback(() => {
    const selectedIds = new Set(drawerState.selectedRowIds)
    if (selectedIds.size === 0) return
    Modal.confirm({
      title: 'Reset to Defaults',
      content: 'Reset selected rows to default profile and clear all overrides?',
      onOk: () => {
        updateRows(prev => prev.map(r => {
          if (!selectedIds.has(r.id)) return r
          return { ...r, profileKey: 'default', overrides: [] }
        }))
        deselectAll()
      },
    })
  }, [drawerState.selectedRowIds, updateRows, deselectAll])

  const handleClearSelection = useCallback(() => {
    deselectAll()
  }, [deselectAll])

  // --- Column defs with evaluationMap ---
  const columnDefs = useMemo(() => getQuoteBookColumnDefs({
    onHistoryClick: () => setIsHistoryDrawerOpen(true),
    evaluationMap,
    profileMap,
    isFutureMode,
  }), [evaluationMap, profileMap, isFutureMode])

  // Drive drawer state machine from grid row selection
  const handleSelectionChanged = useCallback((event: any) => {
    const selected = event.api?.getSelectedRows() || []
    setSelectedRow(selected[0] || null)
    setSelectedRows(selected)
    gridApiRef.current = event.api

    const selectedIds = selected.map((r: any) => r.id)
    const count = selectedIds.length

    setDrawerState(prev => ({
      ...prev,
      selectedRowIds: selectedIds,
      mode: count === 0 ? 'empty' : count === 1 ? 'single' : 'multi',
    }))
  }, [])

  // Drill-to-row from Worst Offenders analytics card
  const handleSelectRowById = useCallback((id: number) => {
    const api = gridApiRef.current
    if (!api) return
    api.deselectAll()
    api.forEachNode((node: any) => {
      if (node.data?.id === id) {
        node.setSelected(true)
        api.ensureNodeVisible(node)
      }
    })
    setDrawerState(prev => ({ ...prev, isOpen: true }))
  }, [])

  const handleDrawerClose = useCallback(() => {
    setDrawerState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const handleDrawerOpen = useCallback(() => {
    setDrawerState(prev => ({ ...prev, isOpen: true }))
  }, [])

  const handleActionModeChange = useCallback((mode: 'profile' | 'override') => {
    setDrawerState(prev => ({ ...prev, actionMode: mode }))
  }, [])

  // --- Task 7: Publish workflow ---
  const handlePublish = useCallback(() => {
    const hard = analyticsData.hardCount
    const soft = analyticsData.softCount
    const total = analyticsData.total

    if (hard > 0) {
      setPublishModalVisible(true)
    } else if (soft > 0) {
      Modal.confirm({
        title: 'Soft Exceptions',
        content: `${soft} rows have soft (advisory) exceptions. Publish anyway?`,
        okText: 'Publish',
        onOk: () => {
          message.success(`Published! ${total} rows submitted. ${soft} rows flagged with soft exceptions (advisory only).`)
        },
      })
    } else {
      message.success('All rows are clean. Published successfully!')
    }
  }, [analyticsData])

  const handlePublishCleanSoftOnly = useCallback(() => {
    const hard = analyticsData.hardCount
    const publishable = analyticsData.total - hard
    setPublishModalVisible(false)
    message.success(`Published ${publishable} rows (excluding ${hard} with hard exceptions).`)
  }, [analyticsData])

  // Hard rows for publish modal
  const hardRows = useMemo(() => {
    return evaluatedRows.filter(r => r.exceptionType === 'hard')
  }, [evaluatedRows])

  return (
    <Vertical height="100%">
      <QuoteBookGroupTabs activeTab={activeGroupTab} onTabChange={setActiveGroupTab} />

      {/* Analytics panel (quote-level + exceptions) */}
      <QuoteBookAnalyticsPanel visible={showAnalytics} selectedRow={selectedRow} analyticsData={analyticsData} onSelectRow={handleSelectRowById} />

      {/* Main content area — fills remaining space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Grid + Drawer side by side */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Grid area — flex-grows to fill space */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'flex 300ms ease' }}>
            <GraviGrid
              storageKey="quotebook-main-grid"
              rowData={filteredRows}
              columnDefs={columnDefs}
              agPropOverrides={{
                getRowId: (p: any) => String(p.data.id),
                rowSelection: 'multiple',
                suppressRowClickSelection: false,
                groupDefaultExpanded: -1,
                rowHeight: 35,
                groupDisplayType: 'groupRows',
                suppressAggFuncInHeader: true,
                getRowStyle: (params: any) => {
                  if (!params.data) return undefined
                  if (params.data.exceptionType === 'hard') return { background: 'rgba(220, 38, 38, 0.06)' }
                  if (params.data.exceptionType === 'soft') return { background: 'rgba(217, 119, 6, 0.06)' }
                  return undefined
                },
              }}
              onSelectionChanged={handleSelectionChanged}
              controlBarProps={{
                title: 'Quote Book — EOD',
                hideActiveFilters: true,
                actionButtons: (
                  <Horizontal alignItems="center" style={{ gap: '8px' }}>
                    {isFutureMode && <QuoteBookProfileChip profileName={mostCommonProfileName} />}
                    <QuoteBookActionButtons
                      publicationMode={publicationMode}
                      setPublicationMode={setPublicationMode}
                      showAnalytics={showAnalytics}
                      setShowAnalytics={setShowAnalytics}
                      showSpreadRows={showSpreadRows}
                      setShowSpreadRows={setShowSpreadRows}
                      publishMode={publishMode}
                      onManageThresholds={isFutureMode ? handleDrawerOpen : undefined}
                    />
                  </Horizontal>
                ),
              }}
            />
          </div>

          {/* Right drawer (Future State only) */}
          {isFutureMode && (
            <QuoteBookExceptionDrawer
              drawerState={drawerState}
              selectedRows={selectedRows}
              profiles={profiles}
              profileMap={profileMap}
              onClose={handleDrawerClose}
              onActionModeChange={handleActionModeChange}
              onApplyProfile={handleApplyProfile}
              onApplyOverride={handleApplyOverride}
              onResetToDefaults={handleResetToDefaults}
              onClearSelection={handleClearSelection}
            />
          )}
        </div>
      </div>

      <QuoteBookFooter
        publicationMode={publicationMode}
        publishMode={publishMode}
        setPublishMode={setPublishMode}
        dirtyCount={dirtyCount}
        onPublish={handlePublish}
        onReset={() => setDirtyCount(0)}
        hardExceptionCount={hardExceptionCount}
      />
      <QuoteBookHistoryDrawer
        visible={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
      />

      {/* Task 7: Publish blocking modal */}
      <Modal
        title={<span style={{ color: '#dc2626' }}>Cannot Publish — Hard Exceptions</span>}
        visible={publishModalVisible}
        onCancel={() => setPublishModalVisible(false)}
        footer={[
          <span key="cancel" onClick={() => setPublishModalVisible(false)} style={{ cursor: 'pointer', marginRight: 12, color: 'var(--gray-600)' }}>Cancel</span>,
          <span
            key="publish"
            onClick={handlePublishCleanSoftOnly}
            style={{
              cursor: 'pointer',
              padding: '6px 16px',
              background: 'var(--theme-color-1)',
              color: '#fff',
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            Publish Clean/Soft Only
          </span>,
        ]}
      >
        <p style={{ marginBottom: 12 }}>
          {hardRows.length} row{hardRows.length !== 1 ? 's' : ''} have hard exceptions that block publishing.
          Resolve these exceptions or publish without them.
        </p>
        <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid var(--gray-200)', borderRadius: 4 }}>
          {hardRows.map(row => (
            <div key={row.id} style={{
              padding: '6px 12px',
              borderBottom: '1px solid var(--gray-100)',
              fontSize: 12,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 500 }}>QC-{String(row.id).padStart(3, '0')} — {row.product}, {row.location}</span>
              <span style={{ color: '#dc2626', fontWeight: 600 }}>{row.exceptionCount} exc</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* View Settings Floating Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<EyeOutlined />}
        size="large"
        onClick={() => setSettingsDrawerVisible(true)}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '96px',
          zIndex: 9999,
          width: '48px',
          height: '48px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      />

      <QuoteBookViewSettingsDrawer
        visible={settingsDrawerVisible}
        onClose={() => setSettingsDrawerVisible(false)}
      />
    </Vertical>
  )
}
