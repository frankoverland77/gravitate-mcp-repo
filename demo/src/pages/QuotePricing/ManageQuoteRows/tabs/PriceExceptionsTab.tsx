import { useState, useMemo, useCallback, useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { GridApi } from 'ag-grid-community'
import { GraviGrid, Vertical, NotificationMessage } from '@gravitate-js/excalibrr'
import { priceExceptionData } from '../PriceExceptions.data'
import { getPriceExceptionColumnDefs, validateThresholdOrdering } from '../PriceExceptions.columnDefs'
import { useFeatureMode } from '../../../../contexts/FeatureModeContext'
import { QuoteBookExceptionProfiles } from '../../QuoteBook/components/QuoteBookExceptionProfiles'
import { exceptionProfiles as seedProfiles } from '../../QuoteBook/QuoteBook.exceptions.data'
import type { ExceptionProfile } from '../../QuoteBook/QuoteBook.types'

export function PriceExceptionsTab() {
  const { isFutureMode } = useFeatureMode()
  const gridRef = useRef() as MutableRefObject<GridApi>
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)
  const [rowData, setRowData] = useState(priceExceptionData)
  const [activeSubTab, setActiveSubTab] = useState<'configuration' | 'profiles'>('configuration')
  const [profiles, setProfiles] = useState<ExceptionProfile[]>(() =>
    seedProfiles.map(p => ({ ...p, thresholds: p.thresholds.map(t => ({ ...t })) }))
  )

  const columnDefs = useMemo(() => getPriceExceptionColumnDefs(), [])

  const handleSelectionChanged = useCallback((event: any) => {
    const ids = event.api.getSelectedRows().map((r: any) => String(r.id))
    setSelectedIds(ids)
  }, [])

  const reselectRows = useCallback(() => {
    if (!gridRef.current || selectedIds.length === 0) return
    setTimeout(() => {
      gridRef.current.forEachNode((node: any) => {
        if (node.data && selectedIds.includes(String(node.data.id))) {
          node.setSelected(true)
        }
      })
    }, 0)
  }, [selectedIds])

  const handleBulkUpdate = useCallback(async (rows: any | any[]) => {
    const updatedRows = Array.isArray(rows) ? rows : [rows]
    for (const row of updatedRows) {
      const error = validateThresholdOrdering(row)
      if (error) {
        NotificationMessage('Validation Error', error, true)
        reselectRows()
        return
      }
    }
    const updatedMap = new Map(updatedRows.map((u: any) => [u.id, u]))
    setRowData((prev) => prev.map((row) => updatedMap.get(row.id) || row))
    NotificationMessage('Success', `Updated ${updatedRows.length} row(s)`, false)
  }, [reselectRows])

  const handleCreateProfile = useCallback((profile: ExceptionProfile) => {
    setProfiles(prev => [...prev, profile])
  }, [])

  const handleUpdateProfile = useCallback((updated: ExceptionProfile) => {
    setProfiles(prev => prev.map(p => p.key === updated.key ? updated : p))
  }, [])

  const handleDeleteProfile = useCallback((key: string) => {
    setProfiles(prev => prev.filter(p => p.key !== key))
  }, [])

  return (
    <Vertical height="100%">
      <style>{`
        .price-exception-header {
          background-color: #f5f5f5 !important;
        }
      `}</style>

      {/* Sub-tab bar (Future State only) */}
      {isFutureMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: '0 16px',
          background: 'var(--bg-1)',
          borderBottom: '2px solid var(--gray-200)',
          flexShrink: 0,
        }}>
          {([
            { key: 'configuration' as const, label: 'Configuration' },
            { key: 'profiles' as const, label: 'Exception Profiles' },
          ]).map(tab => (
            <span
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: activeSubTab === tab.key ? 600 : 500,
                color: activeSubTab === tab.key ? 'var(--theme-color-1)' : 'var(--gray-500)',
                cursor: 'pointer',
                borderBottom: activeSubTab === tab.key ? '2px solid var(--theme-color-1)' : '2px solid transparent',
                marginBottom: '-2px',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </span>
          ))}
        </div>
      )}

      {/* Configuration sub-tab (or default in MVP mode) */}
      {(!isFutureMode || activeSubTab === 'configuration') && (
        <GraviGrid
          externalRef={gridRef}
          storageKey="price-exceptions-grid"
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={{
            getRowId: (p: any) => String(p.data.id),
            groupDefaultExpanded: -1,
            rowSelection: 'multiple',
            suppressRowClickSelection: true,
            groupDisplayType: 'groupRows',
            suppressAggFuncInHeader: true,
          }}
          isBulkChangeVisible={isBulkChangeVisible}
          setIsBulkChangeVisible={setIsBulkChangeVisible}
          updateEP={handleBulkUpdate}
          onSelectionChanged={handleSelectionChanged}
          controlBarProps={{
            title: 'Price Exceptions',
            hideActiveFilters: true,
          }}
        />
      )}

      {/* Exception Profiles sub-tab (Future State only) */}
      {isFutureMode && activeSubTab === 'profiles' && (
        <QuoteBookExceptionProfiles
          profiles={profiles}
          onCreateProfile={handleCreateProfile}
          onUpdateProfile={handleUpdateProfile}
          onDeleteProfile={handleDeleteProfile}
        />
      )}
    </Vertical>
  )
}
