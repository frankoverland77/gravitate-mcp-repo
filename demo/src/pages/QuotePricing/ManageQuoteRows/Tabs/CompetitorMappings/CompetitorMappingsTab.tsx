import { useState, useMemo, useCallback, useRef } from 'react'
import {
  GraviGrid,
  Vertical,
  Horizontal,
  Texto,
  GraviButton,
} from '@gravitate-js/excalibrr'
import { Input, Drawer, Select, message } from 'antd'
import {
  SearchOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
} from '@ant-design/icons'
import {
  competitorQuoteRows as initialQuoteRows,
  generateMatchResults,
  setAssociationVisibility,
  addAssociationToRow,
  bulkSetVisibilityAcrossRows,
  publisherOptions,
  productHierarchyOptions,
  locationHierarchyOptions,
  getLocationName,
  getProductName,
} from './Grid/mockData'
import type {
  CompetitorQuoteRow,
  CompetitorAssociation,
  MatchResult,
} from './Grid/mockData'
import {
  getCompetitorMappingsColumnDefs,
  getCompetitorDetailColumnDefs,
} from './Grid/columnDefs'
import { CompetitorDetailPanel } from './CompetitorDetailPanel'

export function CompetitorMappingsTab() {
  const [quoteRows, setQuoteRows] = useState<CompetitorQuoteRow[]>(initialQuoteRows)
  const [selectedRows, setSelectedRows] = useState<CompetitorQuoteRow[]>([])
  const [publisher, setPublisher] = useState<string | undefined>(undefined)
  const [productHierarchy, setProductHierarchy] = useState<string | undefined>(undefined)
  const [locationHierarchy, setLocationHierarchy] = useState<string | undefined>(undefined)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [searchText, setSearchText] = useState('')
  const [configFilter, setConfigFilter] = useState<string | undefined>(undefined)
  const [allExpanded, setAllExpanded] = useState(false)
  const highlightedAssocIdsRef = useRef<Set<number>>(new Set())
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Bulk change state
  const [bulkBarVisible, setBulkBarVisible] = useState(false)
  const [bulkMatchBy, setBulkMatchBy] = useState<'name' | 'publisher' | 'terminal'>('name')
  const [bulkMatchValues, setBulkMatchValues] = useState<string[]>([])
  const [bulkVisibility, setBulkVisibility] = useState<'Show' | 'Hide' | 'Highlight'>('Show')

  const gridApiRef = useRef<any>(null)

  const columnDefs = useMemo(() => getCompetitorMappingsColumnDefs(), [])

  const filteredRows = useMemo(() => {
    let rows = quoteRows
    if (configFilter) {
      rows = rows.filter((r) => r.configurationName === configFilter)
    }
    if (searchText) {
      const lower = searchText.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.counterparty.toLowerCase().includes(lower) ||
          getLocationName(r.locationId).toLowerCase().includes(lower) ||
          getProductName(r.productId).toLowerCase().includes(lower) ||
          r.costType.toLowerCase().includes(lower),
      )
    }
    return rows
  }, [quoteRows, configFilter, searchText])

  const configOptions = useMemo(() => {
    const configs = [...new Set(quoteRows.map((r) => r.configurationName))]
    return configs.map((c) => ({ value: c, label: c }))
  }, [quoteRows])

  const handleSelectionChanged = useCallback((event: any) => {
    const rows = event.api.getSelectedRows() as CompetitorQuoteRow[]
    setSelectedRows(rows)
    if (rows.length === 0) {
      setBulkBarVisible(false)
      setBulkMatchValues([])
      setBulkMatchBy('name')
      setBulkVisibility('Show')
    }
  }, [])

  const canFindMatches = publisher && productHierarchy && locationHierarchy

  const handleFindMatches = useCallback(() => {
    if (!publisher) return
    const results = generateMatchResults(selectedRows, publisher)
    setMatchResults(results)
    setPreviewVisible(true)
  }, [selectedRows, publisher])

  const handleConfirm = useCallback(() => {
    // Build new associations from match results and add them to quote rows
    const newAssocIds = new Set<number>()
    const affectedQuoteRowIds = new Set<number>()

    setQuoteRows((prev) => {
      return prev.map((row) => {
        const result = matchResults.find((r) => r.quoteRowId === row.id)
        if (!result) return row
        const newInstruments = result.instruments.filter((i) => !i.alreadyExists)
        if (newInstruments.length === 0) return row

        affectedQuoteRowIds.add(row.id)
        const maxId = row.competitorAssociations.reduce((max, a) => Math.max(max, a.id), 0)
        const newAssocs = newInstruments.map((inst, idx) => {
          const id = maxId + 1 + idx
          newAssocIds.add(id)
          return {
            id,
            name: inst.competitor,
            publisher: inst.publisher,
            region: '',
            terminal: inst.terminal,
            productGroup: '',
            product: inst.product,
            visibility: 'Show' as const,
          }
        })

        return {
          ...row,
          competitorAssociations: [...row.competitorAssociations, ...newAssocs],
          existingCompetitorCount: row.existingCompetitorCount + newAssocs.length,
          existingCompetitors: [...row.existingCompetitors, ...newAssocs.map((a) => a.name)],
        }
      })
    })

    const totalNew = newAssocIds.size
    setPreviewVisible(false)
    setMatchResults([])
    setSelectedRows([])
    setPublisher(undefined)
    setProductHierarchy(undefined)
    setLocationHierarchy(undefined)
    message.success(`Successfully created ${totalNew} new competitor mappings`)

    // Highlight the new child association rows
    highlightedAssocIdsRef.current = newAssocIds
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)

    // Expand affected parent rows so new children are visible
    setTimeout(() => {
      const api = gridApiRef.current
      if (api) {
        api.forEachNode((node: any) => {
          if (node.data && affectedQuoteRowIds.has(node.data.id)) {
            node.setExpanded(true)
          }
        })
      }
    }, 100)

    // Clear highlights after 4 seconds
    highlightTimerRef.current = setTimeout(() => {
      highlightedAssocIdsRef.current = new Set()
      // Force detail panels to re-render by toggling a trivial state update
      setQuoteRows((prev) => [...prev])
    }, 4000)
  }, [matchResults])

  // Expand All / Collapse All
  const handleToggleExpandAll = useCallback(() => {
    const api = gridApiRef.current
    if (!api) return
    const next = !allExpanded
    api.forEachNode((node: any) => {
      if (node.master) node.setExpanded(next)
    })
    setAllExpanded(next)
  }, [allExpanded])

  // Set visibility on a single association
  const handleSetVisibility = useCallback(
    (quoteRowId: number, associationId: number, value: 'Show' | 'Hide' | 'Highlight') => {
      setQuoteRows((prev) => setAssociationVisibility(prev, quoteRowId, associationId, value))
    },
    [],
  )

  // Add single association
  const handleAddAssociation = useCallback(
    (quoteRowId: number, newAssoc: Omit<CompetitorAssociation, 'id'>) => {
      setQuoteRows((prev) => addAssociationToRow(prev, quoteRowId, newAssoc))
    },
    [],
  )

  // Bulk change across rows — dynamic options based on selected rows and match dimension
  const bulkMatchOptions = useMemo(() => {
    const allAssocs = selectedRows.flatMap((r) => r.competitorAssociations)
    const values = [...new Set(allAssocs.map((a) => a[bulkMatchBy]))]
    return values.sort().map((v) => ({ value: v, label: v }))
  }, [selectedRows, bulkMatchBy])

  // Bulk change impact preview
  const bulkPreview = useMemo(() => {
    if (bulkMatchValues.length === 0) return null
    const valueSet = new Set(bulkMatchValues)
    let affectedAssocs = 0
    let affectedRows = 0
    let noMatchRows: string[] = []
    for (const row of selectedRows) {
      const matching = row.competitorAssociations.filter((a) => valueSet.has(a[bulkMatchBy]))
      if (matching.length > 0) {
        affectedAssocs += matching.length
        affectedRows++
      } else {
        noMatchRows.push(`${getProductName(row.productId)} — ${row.counterparty}`)
      }
    }
    return { affectedAssocs, affectedRows, totalRows: selectedRows.length, noMatchRows }
  }, [selectedRows, bulkMatchBy, bulkMatchValues])

  const handleBulkApply = useCallback(() => {
    const ids = selectedRows.map((r) => r.id)
    setQuoteRows((prev) => bulkSetVisibilityAcrossRows(prev, ids, bulkMatchBy, bulkMatchValues, bulkVisibility))
    const preview = bulkPreview
    message.success(`Updated visibility on ${preview?.affectedAssocs ?? 0} associations across ${preview?.affectedRows ?? 0} quote rows`)
    setBulkBarVisible(false)
    setBulkMatchValues([])
    setBulkVisibility('Show')
  }, [selectedRows, bulkMatchBy, bulkMatchValues, bulkVisibility, bulkPreview])

  const matchByLabels: Record<string, string> = { name: 'Counterparty', publisher: 'Publisher', terminal: 'Terminal' }

  // Flat data for preview GraviGrid
  const previewGridData = useMemo(() => {
    return matchResults.flatMap((result) => {
      const quoteRow = quoteRows.find((r) => r.id === result.quoteRowId)
      if (!quoteRow) return []
      return result.instruments.map((inst) => ({
        id: `${result.quoteRowId}-${inst.id}`,
        quoteRowContext: `${getProductName(quoteRow.productId)} — ${quoteRow.counterparty} · ${getLocationName(quoteRow.locationId)}`,
        status: inst.alreadyExists ? 'Exists' : 'New',
        competitor: inst.competitor,
        publisher: inst.publisher,
        terminal: inst.terminal,
        product: inst.product,
      }))
    })
  }, [matchResults, quoteRows])

  // Custom detail cell renderer
  const CompetitorDetailRenderer = useCallback(
    (params: any) => {
      const parentRow = params.data as CompetitorQuoteRow
      if (!parentRow) return null
      const associations = parentRow.competitorAssociations ?? []

      const detailColDefs = getCompetitorDetailColumnDefs((associationId, value) =>
        handleSetVisibility(parentRow.id, associationId, value),
      )

      return <CompetitorDetailPanel
        parentRow={parentRow}
        associations={associations}
        detailColDefs={detailColDefs}
        onAddAssociation={handleAddAssociation}
        highlightedAssocIds={highlightedAssocIdsRef.current}
      />
    },
    [handleSetVisibility, handleAddAssociation],
  )

  // Compute stats for selected rows
  const selectionSummary = useMemo(() => {
    if (selectedRows.length === 0) return null
    const terminals = [...new Set(selectedRows.map((r) => getLocationName(r.locationId)))]
    const products = [...new Set(selectedRows.map((r) => getProductName(r.productId)))]
    return { terminals, products }
  }, [selectedRows])

  // Compute stats for preview modal
  const previewStats = useMemo(() => {
    if (matchResults.length === 0) return null
    const quoteRowCount = matchResults.length
    const allInstruments = matchResults.flatMap((r) => r.instruments)
    const competitorNames = [...new Set(allInstruments.map((i) => i.competitor))]
    const newMappings = allInstruments.filter((i) => !i.alreadyExists).length
    const alreadyExist = allInstruments.filter((i) => i.alreadyExists).length
    return { quoteRowCount, competitorsFound: competitorNames.length, newMappings, alreadyExist }
  }, [matchResults])

  // Get the label for a dropdown value
  const getPublisherLabel = (val?: string) =>
    publisherOptions.find((o) => o.value === val)?.label ?? '—'
  const getProductHierarchyLabel = (val?: string) =>
    productHierarchyOptions.find((o) => o.value === val)?.label ?? '—'
  const getLocationHierarchyLabel = (val?: string) =>
    locationHierarchyOptions.find((o) => o.value === val)?.label ?? '—'

  // Existing mappings total for selected rows
  const existingMappingsTotal = selectedRows.reduce(
    (sum, r) => sum + r.existingCompetitorCount,
    0,
  )

  return (
    <Vertical height="100%">
      <style>{`
        .competitor-mappings-layout {
          display: flex;
          flex: 1;
          min-height: 0;
          gap: 0;
        }
        .competitor-mappings-left {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e8e8e8;
        }
        .bulk-change-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #1e3a5f;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px 8px 0 0;
          transition: transform 0.2s ease, opacity 0.2s ease;
          transform: translateY(0);
          opacity: 1;
          flex-shrink: 0;
        }
        .bulk-change-bar-hidden {
          transform: translateY(100%);
          opacity: 0;
          pointer-events: none;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }
        .bulk-clear-link {
          color: #ffffff;
          cursor: pointer;
          margin-left: 12px;
          font-size: 13px;
          border: 1px solid rgba(255,255,255,0.4);
          padding: 2px 10px;
          border-radius: 4px;
          background: transparent;
        }
        .bulk-clear-link:hover {
          background: rgba(255,255,255,0.1);
        }
        .bulk-change-bar .ant-select-selector {
          background: rgba(255,255,255,0.15) !important;
          border-color: rgba(255,255,255,0.3) !important;
          color: #fff !important;
        }
        .bulk-change-bar .ant-select-selection-item {
          color: #fff !important;
        }
        .bulk-change-bar .ant-select-selection-placeholder {
          color: rgba(255,255,255,0.6) !important;
        }
        .bulk-change-bar .ant-select-arrow {
          color: rgba(255,255,255,0.6) !important;
        }
        .bulk-change-bar .ant-select-multiple .ant-select-selection-item {
          background: rgba(255,255,255,0.2) !important;
          border-color: rgba(255,255,255,0.3) !important;
        }
        .bulk-change-bar .ant-select-multiple .ant-select-selection-item-remove {
          color: rgba(255,255,255,0.6) !important;
        }
        .competitor-mappings-right {
          width: 440px;
          flex-shrink: 0;
          overflow-y: auto;
          background: #fafafa;
        }
        .config-card {
          background: #fff;
          border-bottom: 1px solid #e8e8e8;
        }
        .config-card-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          font-weight: 600;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .config-section {
          padding: 14px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .config-section:last-child {
          border-bottom: none;
        }
        .config-label {
          font-size: 12px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        .config-desc {
          font-size: 11px;
          color: #999;
          margin-bottom: 8px;
        }
        .selection-summary-line {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 12px;
        }
        .selection-summary-line .label {
          color: #999;
        }
        .selection-summary-line .value {
          color: #333;
          font-weight: 500;
          text-align: right;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .current-mappings-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          border-bottom: 1px solid #f5f5f5;
          font-size: 12px;
        }
        .current-mappings-row:last-child {
          border-bottom: none;
        }
        .preview-summary-strip {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 12px 24px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .preview-summary-strip .summary-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .preview-summary-strip .summary-metric .metric-value {
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }
        .preview-summary-strip .summary-metric .metric-label {
          font-size: 11px;
          color: #999;
        }
        .preview-summary-strip .metric-divider {
          width: 1px;
          height: 28px;
          background: #e5e7eb;
        }
        .preview-summary-strip .summary-warning {
          font-size: 11px;
          color: #92400e;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          padding: 4px 10px;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .empty-state {
          padding: 40px 24px;
          text-align: center;
        }
        .empty-state-icon {
          font-size: 32px;
          margin-bottom: 12px;
          opacity: 0.3;
        }
        .search-bar-row {
          padding: 8px 12px;
          display: flex;
          gap: 8px;
          align-items: center;
          border-bottom: 1px solid #e8e8e8;
          background: #fff;
        }
        /* Detail row expand/collapse animation */
        .competitor-mappings-left .ag-details-row {
          animation: detailSlideIn 0.25s ease-out;
        }
        @keyframes detailSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Sticky detail grid header */
        .competitor-mappings-left .ag-details-row .ag-header {
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .competitor-detail-panel {
          padding: 8px 16px 8px 48px;
          background: var(--theme-bg-elevated, #fafafa);
        }
        .competitor-detail-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0 8px;
        }
      `}</style>

      {/* Main Layout */}
      <div className="competitor-mappings-layout">
        {/* Left Panel — Quote Row Selection Grid */}
        <div className="competitor-mappings-left">
          {/* Grid */}
          <Vertical flex="1">
            <GraviGrid
              storageKey="competitor-mappings-grid"
              externalRef={gridApiRef}
              rowData={filteredRows}
              columnDefs={columnDefs}
              agPropOverrides={{
                getRowId: (p: any) => String(p.data.id),
                groupDefaultExpanded: -1,
                rowSelection: 'multiple',
                suppressRowClickSelection: true,
                groupDisplayType: 'groupRows',
                suppressAggFuncInHeader: true,
                groupSelectsChildren: true,
                masterDetail: true,
                detailRowAutoHeight: true,
                isRowMaster: (data: CompetitorQuoteRow) =>
                  data?.existingCompetitorCount > 0,
                detailCellRenderer: CompetitorDetailRenderer,
              }}
              onSelectionChanged={handleSelectionChanged}
              controlBarProps={{
                title: 'Quote Rows',
                hideActiveFilters: true,
                hideSearch: true,
                actionButtons: (
                  <Horizontal gap={8}>
                    <GraviButton
                      buttonText={allExpanded ? 'Collapse All' : 'Expand All'}
                      icon={allExpanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
                      onClick={handleToggleExpandAll}
                    />
                    <GraviButton
                      buttonText={bulkBarVisible ? 'Exit Bulk Change' : 'Bulk Change'}
                      disabled={selectedRows.length === 0}
                      onClick={() => setBulkBarVisible((v) => !v)}
                    />
                  </Horizontal>
                ),
              }}
            />
          </Vertical>

          {/* Floating Bulk Change Bar */}
          <div className={`bulk-change-bar${bulkBarVisible ? '' : ' bulk-change-bar-hidden'}`}>
            <Horizontal alignItems="center">
              <Texto category="p2" weight="600" style={{ color: '#fff' }}>
                {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected
              </Texto>
              <span
                className="bulk-clear-link"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setBulkBarVisible(false)
                  setSelectedRows([])
                  gridApiRef.current?.deselectAll()
                }}
              >
                <Texto category="p2" style={{ color: '#fff' }}>Clear</Texto>
              </span>
            </Horizontal>
            <Horizontal alignItems="center" gap={10}>
              <Select
                value={bulkMatchBy}
                onChange={(val) => { setBulkMatchBy(val); setBulkMatchValues([]) }}
                options={[
                  { value: 'name', label: 'Counterparty' },
                  { value: 'publisher', label: 'Publisher' },
                  { value: 'terminal', label: 'Terminal' },
                ]}
                style={{ minWidth: 150 }}
                placeholder="Match by"
                size="small"
              />
              <Select
                mode="multiple"
                value={bulkMatchValues}
                onChange={setBulkMatchValues}
                options={bulkMatchOptions}
                style={{ minWidth: 220 }}
                placeholder={`Select ${matchByLabels[bulkMatchBy]?.toLowerCase()}...`}
                size="small"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                maxTagCount={2}
              />
              <Select
                value={bulkVisibility}
                onChange={(val) => setBulkVisibility(val)}
                options={[
                  { value: 'Show', label: 'Show' },
                  { value: 'Hide', label: 'Hide' },
                  { value: 'Highlight', label: 'Highlight' },
                ]}
                style={{ minWidth: 120 }}
                size="small"
              />
              <GraviButton
                success
                buttonText="Apply"
                onClick={handleBulkApply}
                disabled={bulkMatchValues.length === 0}
                style={{ background: '#10b981', borderColor: '#10b981', color: '#fff' }}
              />
            </Horizontal>
          </div>
        </div>

        {/* Right Panel — Configuration */}
        <div className="competitor-mappings-right">
          {selectedRows.length === 0 ? (
            <div className="config-card">
              <div className="empty-state">
                <div className="empty-state-icon">☐</div>
                <Texto appearance="medium" style={{ fontSize: 13, marginBottom: 4 }}>
                  No quote rows selected
                </Texto>
                <Texto appearance="medium" style={{ fontSize: 11 }}>
                  Select one or more quote rows on the left to begin creating
                  competitor mappings.
                </Texto>
              </div>
            </div>
          ) : (
            <>
              {/* Configure Matching card */}
              <div className="config-card">
                <div className="config-card-header">Configure Matching</div>

                {/* Selection summary */}
                <div className="config-section">
                  <div className="config-label">Selected Quote Rows</div>
                  <div>
                    <div className="selection-summary-line">
                      <span className="label">Rows selected</span>
                      <span className="value">{selectedRows.length}</span>
                    </div>
                    {selectionSummary && (
                      <>
                        <div className="selection-summary-line">
                          <span className="label">Terminals</span>
                          <span className="value">
                            {selectionSummary.terminals.join(' · ')}
                          </span>
                        </div>
                        <div className="selection-summary-line">
                          <span className="label">Products</span>
                          <span className="value">
                            {selectionSummary.products.join(' · ')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Price Publisher */}
                <div className="config-section">
                  <div className="config-label">Price Publisher</div>
                  <div className="config-desc">
                    Select the competitor pricing source.
                  </div>
                  <Select
                    placeholder="Select a price publisher..."
                    value={publisher}
                    onChange={setPublisher}
                    options={publisherOptions}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Product Hierarchy */}
                <div className="config-section">
                  <div className="config-label">Product Hierarchy</div>
                  <div className="config-desc">
                    Choose which product hierarchy to use for matching.
                  </div>
                  <Select
                    placeholder="Select product hierarchy..."
                    value={productHierarchy}
                    onChange={setProductHierarchy}
                    options={productHierarchyOptions}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Location Hierarchy */}
                <div className="config-section">
                  <div className="config-label">Location Hierarchy</div>
                  <div className="config-desc">
                    Choose which location hierarchy to use for matching.
                  </div>
                  <Select
                    placeholder="Select location hierarchy..."
                    value={locationHierarchy}
                    onChange={setLocationHierarchy}
                    options={locationHierarchyOptions}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Find button */}
                <div className="config-section" style={{ borderBottom: 'none' }}>
                  <GraviButton
                    success
                    buttonText="Find Matching Competitors"
                    icon={<ThunderboltOutlined />}
                    onClick={handleFindMatches}
                    disabled={!canFindMatches}
                    style={{ width: '100%', justifyContent: 'center' }}
                  />
                  <Texto
                    appearance="medium"
                    style={{
                      fontSize: 11,
                      textAlign: 'center',
                      marginTop: 8,
                      display: 'block',
                    }}
                  >
                    {canFindMatches ? (
                      <>
                        Searches for price instruments within{' '}
                        <strong>{getPublisherLabel(publisher)}</strong> matching by{' '}
                        <strong>{getProductHierarchyLabel(productHierarchy)}</strong>{' '}
                        and <strong>{getLocationHierarchyLabel(locationHierarchy)}</strong>
                      </>
                    ) : (
                      'Select all options above to search for matching competitors.'
                    )}
                  </Texto>
                </div>
              </div>

              {/* Current Mappings card */}
              <div className="config-card" style={{ marginTop: 0 }}>
                <div className="config-card-header">
                  <span>Current Mappings</span>
                  <span
                    style={{
                      background: '#e0edff',
                      color: '#1d4ed8',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 10,
                    }}
                  >
                    {existingMappingsTotal} total
                  </span>
                </div>
                {selectedRows.map((row) => (
                  <div className="current-mappings-row" key={row.id}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{getProductName(row.productId)}</div>
                      <div style={{ fontSize: 10, color: '#999' }}>
                        {getLocationName(row.locationId)}
                      </div>
                    </div>
                    <Horizontal alignItems="center" gap={8}>
                      <span
                        style={{
                          background:
                            row.existingCompetitorCount > 0 ? '#e0edff' : '#f3f4f6',
                          color:
                            row.existingCompetitorCount > 0 ? '#1d4ed8' : '#999',
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 10,
                          flexShrink: 0,
                        }}
                      >
                        {row.existingCompetitorCount}
                      </span>
                      <Texto
                        appearance="medium"
                        style={{ fontSize: 10, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {row.existingCompetitorCount > 0
                          ? row.existingCompetitors.slice(0, 3).join(', ') +
                            (row.existingCompetitors.length > 3
                              ? `, +${row.existingCompetitors.length - 3}`
                              : '')
                          : 'No competitors mapped'}
                      </Texto>
                    </Horizontal>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Drawer */}
      <Drawer
        open={previewVisible}
        placement="bottom"
        height="80vh"
        title="Review New Competitor Mappings"
        closable={true}
        destroyOnHidden
        onClose={() => setPreviewVisible(false)}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
      >
        {/* Summary strip */}
        {previewStats && (
          <div className="preview-summary-strip">
            <div className="summary-metric">
              <span className="metric-value">{previewStats.quoteRowCount}</span>
              <span className="metric-label">Quote Rows</span>
            </div>
            <div className="metric-divider" />
            <div className="summary-metric">
              <span className="metric-value">{previewStats.competitorsFound}</span>
              <span className="metric-label">Competitors Found</span>
            </div>
            <div className="metric-divider" />
            <div className="summary-metric">
              <span className="metric-value">{previewStats.newMappings}</span>
              <span className="metric-label">New Mappings</span>
            </div>
            <div className="metric-divider" />
            <div className="summary-metric">
              <span className="metric-value">{previewStats.alreadyExist}</span>
              <span className="metric-label">Already Exist</span>
            </div>
            {previewStats.alreadyExist > 0 && (
              <span className="summary-warning">
                <WarningOutlined /> {previewStats.alreadyExist} will be skipped
              </span>
            )}
          </div>
        )}

        {/* Preview GraviGrid */}
        <div style={{ flex: 1 }} className="p-3">
          <GraviGrid
            storageKey="competitor-preview-results"
            rowData={previewGridData}
            columnDefs={[
              {
                field: 'quoteRowContext',
                headerName: 'Quote Row',
                rowGroup: true,
                hide: true,
              },
              {
                field: 'status',
                headerName: 'Status',
                width: 100,
                cellRenderer: ({ value }: any) => (
                  <span style={{
                    color: value === 'New' ? 'var(--success-color, #10b981)' : '#999',
                    fontWeight: value === 'New' ? 600 : 400,
                    fontSize: 12,
                  }}>
                    {value === 'New' ? '● New' : 'Already exists'}
                  </span>
                ),
              },
              { field: 'competitor', headerName: 'Competitor', minWidth: 180 },
              { field: 'publisher', headerName: 'Publisher', minWidth: 160 },
              { field: 'terminal', headerName: 'Terminal', minWidth: 160 },
              { field: 'product', headerName: 'Product', minWidth: 140 },
            ]}
            agPropOverrides={{
              groupDisplayType: 'groupRows',
              groupDefaultExpanded: -1,
              getRowId: (p: any) => String(p.data?.id ?? p.id),
              getRowStyle: (params: any) => {
                if (params.data?.status === 'New') {
                  return { background: '#f0fdf4' }
                }
                return undefined
              },
            }}
            controlBarProps={{
              title: 'Matching Results',
              hideActiveFilters: true,
            }}
          />
        </div>

        {/* Footer */}
        <Horizontal
          justifyContent="space-between"
          alignItems="center"
          className="p-3"
          style={{ borderTop: '1px solid #e5e7eb' }}
        >
          <Texto appearance="medium" style={{ fontSize: 13 }}>
            {previewStats?.newMappings ?? 0} new mappings will be created
            {previewStats && previewStats.alreadyExist > 0 && ` (${previewStats.alreadyExist} existing skipped)`}
          </Texto>
          <Horizontal gap={8}>
            <GraviButton
              buttonText="Cancel"
              onClick={() => setPreviewVisible(false)}
            />
            <GraviButton
              success
              buttonText={`Create ${previewStats?.newMappings ?? 0} Mappings`}
              icon={<CheckCircleOutlined />}
              onClick={handleConfirm}
            />
          </Horizontal>
        </Horizontal>
      </Drawer>

    </Vertical>
  )
}

