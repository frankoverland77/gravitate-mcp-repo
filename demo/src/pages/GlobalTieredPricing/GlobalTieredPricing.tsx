/**
 * Global Tiered Pricing
 *
 * Editable pricing grid with auto-calculated tier spreads and bulk change
 * (increment/decrement/replace). Tier 2 and Tier 3 auto-calculate from
 * Tier 1 using configurable spreads (default 0.0025).
 */

import { useMemo, useState, useCallback } from 'react'
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import { Alert, message } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import type { GridApi, CellValueChangedEvent, GridReadyEvent } from 'ag-grid-community'

import { tieredPricingData, defaultTierGroups, counterpartyAssignments } from './GlobalTieredPricing.data'
import { getColumnDefs } from './GlobalTieredPricing.columnDefs'
import { SpreadConfigPanel } from './components/SpreadConfigPanel'
import { TierGroupTabs } from './components/TierGroupTabs'
import { CounterpartyPanel } from './components/CounterpartyPanel'
import { loadPersistedRows, persistRows, loadPersistedGroups } from './GlobalTieredPricing.persistence'
import type { TieredPricingRow } from './GlobalTieredPricing.types'
import './GlobalTieredPricing.css'

export function GlobalTieredPricing() {
  const [tierGroups] = useState(() => loadPersistedGroups() ?? defaultTierGroups)
  const [activeGroupTab, setActiveGroupTab] = useState(() => tierGroups[0]?.id ?? '')
  const [rowData, setRowData] = useState<TieredPricingRow[]>(() => loadPersistedRows() ?? tieredPricingData)
  const [tier2Spread, setTier2Spread] = useState(0.0025)
  const [tier3Spread, setTier3Spread] = useState(0.0025)
  const [autoCalculate, setAutoCalculate] = useState(true)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<TieredPricingRow | null>(null)

  const filteredRows = useMemo(
    () => rowData.filter(r => r.group === activeGroupTab),
    [rowData, activeGroupTab]
  )

  const rowCountsByGroup = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const row of rowData) {
      counts[row.group] = (counts[row.group] || 0) + 1
    }
    return counts
  }, [rowData])

  const calculateTier2 = useCallback((tier1: number) => tier1 + tier2Spread, [tier2Spread])
  const calculateTier3 = useCallback((tier2: number) => tier2 + tier3Spread, [tier3Spread])

  const validateRowData = useCallback((data: TieredPricingRow[]) => {
    const warnings: string[] = []
    let invalidOrderCount = 0
    let negativeValueCount = 0

    data.forEach((row) => {
      const t1 = row.tier1
      const t2 = row.tier2Override ? row.tier2 : calculateTier2(row.tier1)
      const t3 = row.tier3Override ? row.tier3 : (t2 !== null ? calculateTier3(t2) : null)
      if (t1 < 0 || (t2 !== null && t2 < 0) || (t3 !== null && t3 < 0)) negativeValueCount++
      if (t2 !== null && t3 !== null && (t1 >= t2 || t2 >= t3)) invalidOrderCount++
    })

    if (negativeValueCount > 0) warnings.push(`${negativeValueCount} row(s) have negative tier values`)
    if (invalidOrderCount > 0) warnings.push(`${invalidOrderCount} row(s) have invalid tier ordering (Tier 1 should be < Tier 2 < Tier 3)`)
    return warnings
  }, [calculateTier2, calculateTier3])

  const applyData = useCallback((newData: TieredPricingRow[]) => {
    setValidationWarnings(validateRowData(newData))
    setRowData(newData)
    persistRows(newData)
  }, [validateRowData])

  const handleSpreadChange = useCallback((tier: 'tier2' | 'tier3', value: number | null) => {
    if (value === null || value < 0) {
      if (value !== null) message.error('Spread values must be positive')
      return
    }
    if (tier === 'tier2') setTier2Spread(value)
    else setTier3Spread(value)
    setTimeout(() => {
      const newData = rowData.map(row => ({ ...row }))
      applyData(newData)
    }, 0)
  }, [rowData, applyData])

  const handleAutoCalculateToggle = useCallback((checked: boolean) => {
    setAutoCalculate(checked)
    if (checked) {
      applyData(rowData.map(row => ({ ...row })))
    } else {
      applyData(rowData.map(row => ({
        ...row,
        tier2: row.tier2Override ? row.tier2 : (row.tier1 + tier2Spread),
        tier3: row.tier3Override ? row.tier3 : ((row.tier2Override ? row.tier2 : (row.tier1 + tier2Spread)) as number + tier3Spread),
        tier2Override: true,
        tier3Override: true,
      })))
    }
  }, [rowData, tier2Spread, tier3Spread, applyData])

  const handleBulkUpdate = useCallback(async (rows: any | any[]) => {
    const updatedRows = Array.isArray(rows) ? rows : [rows]
    const updatedMap = new Map(updatedRows.map((u: any) => [u.id, u]))
    const newData = rowData.map(row => updatedMap.get(row.id) || row)
    applyData(newData)
  }, [rowData, applyData])

  const columnDefs = useMemo(
    () => getColumnDefs({ autoCalculate, calculateTier2, calculateTier3 }),
    [autoCalculate, calculateTier2, calculateTier3]
  )

  const agPropOverrides = useMemo(() => ({
    getRowId: (params: { data: TieredPricingRow }) => String(params.data.id),
    domLayout: 'normal' as const,
    rowSelection: 'multiple' as const,
    suppressRowClickSelection: true,
    enterNavigatesVertically: true,
    enterNavigatesVerticallyAfterEdit: true,
    stopEditingWhenCellsLoseFocus: true,
    onGridReady: (event: GridReadyEvent) => { setGridApi(event.api) },
    onRowClicked: (event: any) => { if (event.data) setSelectedRow(event.data) },
    onCellValueChanged: (event: CellValueChangedEvent<TieredPricingRow>) => {
      const field = event.colDef.field as keyof TieredPricingRow
      if (!event.data) return
      const newData = [...rowData]
      const rowIndex = newData.findIndex(r => r.id === event.data!.id)
      if (rowIndex === -1) return

      if (field === 'tier1') {
        newData[rowIndex] = { ...newData[rowIndex], tier1: event.newValue }
      } else if (field === 'tier2') {
        newData[rowIndex] = { ...newData[rowIndex], tier2: event.newValue, tier2Override: true }
      } else if (field === 'tier3') {
        newData[rowIndex] = { ...newData[rowIndex], tier3: event.newValue, tier3Override: true }
      }

      applyData(newData)
      event.api.refreshCells({ force: true })
    },
  }), [rowData, applyData])

  const controlBarProps = useMemo(() => ({
    title: 'Tier Diff Entry',
    subtitle: 'Tier 2 and Tier 3 auto-calculate with 25-point (0.0025) spreads. Click any calculated cell to override manually.',
    hideActiveFilters: false,
  }), [])

  return (
    <Vertical height='100%'>
      {validationWarnings.length > 0 && (
        <Alert
          message='Validation Warnings'
          description={validationWarnings.join('; ')}
          type='warning'
          icon={<WarningOutlined />}
          showIcon
          closable
          onClose={() => setValidationWarnings([])}
        />
      )}

      <SpreadConfigPanel
        tier2Spread={tier2Spread}
        tier3Spread={tier3Spread}
        autoCalculate={autoCalculate}
        onSpreadChange={handleSpreadChange}
        onAutoCalculateToggle={handleAutoCalculateToggle}
      />

      <TierGroupTabs
        groups={tierGroups}
        activeTab={activeGroupTab}
        onTabChange={(tab) => { setActiveGroupTab(tab); setSelectedRow(null) }}
        rowCounts={rowCountsByGroup}
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Vertical flex='1' style={{ minWidth: 0 }}>
          <GraviGrid
            storageKey='global-tiered-pricing-grid-v3'
            rowData={filteredRows}
            columnDefs={columnDefs}
            agPropOverrides={agPropOverrides}
            controlBarProps={controlBarProps}
            isBulkChangeVisible={isBulkChangeVisible}
            setIsBulkChangeVisible={setIsBulkChangeVisible}
            updateEP={handleBulkUpdate}
            isBulkChangeCompactMode
          />
        </Vertical>

        <CounterpartyPanel
          selectedRow={selectedRow}
          activeGroupId={activeGroupTab}
          assignments={counterpartyAssignments}
        />
      </div>

    </Vertical>
  )
}
