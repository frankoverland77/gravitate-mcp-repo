import { useState, useMemo, useCallback, useRef } from 'react'
import {
  GraviGrid,
  Vertical,
  Horizontal,
  Texto,
  GraviButton,
} from '@gravitate-js/excalibrr'
import { Input, Modal, Select, message } from 'antd'
import {
  SearchOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import {
  competitorQuoteRows as initialQuoteRows,
  generateMatchResults,
  toggleAssociationVisibility,
  bulkSetVisibility,
  publisherOptions,
  productHierarchyOptions,
  locationHierarchyOptions,
  getLocationName,
  getProductName,
} from '../CompetitorMappings.data'
import type {
  CompetitorQuoteRow,
  CompetitorAssociation,
  MatchResult,
} from '../CompetitorMappings.data'
import {
  getCompetitorMappingsColumnDefs,
  getCompetitorDetailColumnDefs,
} from '../CompetitorMappings.columnDefs'

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
  }, [])

  const canFindMatches = publisher && productHierarchy && locationHierarchy

  const handleFindMatches = useCallback(() => {
    if (!publisher) return
    const results = generateMatchResults(selectedRows, publisher)
    setMatchResults(results)
    setPreviewVisible(true)
  }, [selectedRows, publisher])

  const handleConfirm = useCallback(() => {
    const totalNew = matchResults.reduce(
      (sum, r) => sum + r.instruments.filter((i) => !i.alreadyExists).length,
      0,
    )
    setPreviewVisible(false)
    setMatchResults([])
    setSelectedRows([])
    setPublisher(undefined)
    setProductHierarchy(undefined)
    setLocationHierarchy(undefined)
    message.success(`Successfully created ${totalNew} new competitor mappings`)
  }, [matchResults])

  const handleClearSelection = useCallback(() => {
    setSelectedRows([])
  }, [])

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

  // Single visibility toggle
  const handleToggleVisibility = useCallback(
    (quoteRowId: number, associationId: number) => {
      setQuoteRows((prev) => {
        const next = toggleAssociationVisibility(prev, quoteRowId, associationId)
        const row = next.find((r) => r.id === quoteRowId)
        const assoc = row?.competitorAssociations.find((a) => a.id === associationId)
        if (assoc) {
          message.success(`${assoc.name} set to ${assoc.visibility}`)
        }
        return next
      })
    },
    [],
  )

  // Bulk visibility set
  const handleBulkVisibility = useCallback(
    (quoteRowId: number, associations: CompetitorAssociation[], value: 'Show' | 'Hide') => {
      const ids = associations.map((a) => a.id)
      setQuoteRows((prev) => bulkSetVisibility(prev, quoteRowId, ids, value))
      message.success(`Set ${ids.length} associations to ${value}`)
    },
    [],
  )

  // Custom detail cell renderer
  const CompetitorDetailRenderer = useCallback(
    (params: any) => {
      const parentRow = params.data as CompetitorQuoteRow
      if (!parentRow) return null
      const associations = parentRow.competitorAssociations ?? []

      const detailColDefs = getCompetitorDetailColumnDefs((associationId) =>
        handleToggleVisibility(parentRow.id, associationId),
      )

      return <CompetitorDetailPanel
        parentRow={parentRow}
        associations={associations}
        detailColDefs={detailColDefs}
        onBulkVisibility={handleBulkVisibility}
      />
    },
    [handleToggleVisibility, handleBulkVisibility],
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
        .selection-banner {
          padding: 8px 16px;
          background: var(--success-light, #ecfdf5);
          border-bottom: 1px solid #a7f3d0;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
        .preview-stat-cards {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
        }
        .preview-stat-card {
          flex: 1;
          padding: 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          text-align: center;
        }
        .preview-stat-card .stat-number {
          font-size: 22px;
          font-weight: 700;
          color: #333;
        }
        .preview-stat-card .stat-label {
          font-size: 11px;
          color: #999;
          margin-top: 2px;
        }
        .preview-warning {
          margin: 0 20px 12px;
          padding: 10px 14px;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 6px;
          font-size: 12px;
          color: #92400e;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview-group {
          margin: 0 20px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .preview-group-header {
          padding: 10px 14px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview-group-header .qr-detail {
          font-weight: 400;
          color: #999;
          font-size: 11px;
        }
        .preview-group-header .badges {
          margin-left: auto;
          display: flex;
          gap: 4px;
        }
        .preview-table {
          width: 100%;
          font-size: 11px;
          border-collapse: collapse;
        }
        .preview-table th {
          padding: 6px 10px;
          text-align: left;
          font-weight: 600;
          color: #666;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .preview-table td {
          padding: 6px 10px;
          border-bottom: 1px solid #f3f4f6;
        }
        .preview-table tr.existing td {
          color: #999;
        }
        .preview-table tr.new-mapping {
          background: #f0fdf4;
        }
        .preview-table tr.new-mapping td:first-child {
          font-weight: 500;
        }
        .status-new {
          color: var(--success-color, #10b981);
          font-weight: 600;
          font-size: 10px;
        }
        .status-exists {
          color: #999;
          font-size: 10px;
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
          {/* Selection banner */}
          {selectedRows.length > 0 && (
            <div className="selection-banner">
              <Horizontal alignItems="center" className="gap-8">
                <span
                  style={{
                    background: 'var(--success-color, #10b981)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    minWidth: 24,
                    height: 24,
                    borderRadius: 12,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 6px',
                  }}
                >
                  {selectedRows.length}
                </span>
                <Texto style={{ fontSize: 12, fontWeight: 600, color: '#065f46' }}>
                  rows selected
                </Texto>
              </Horizontal>
              <GraviButton
                buttonText="Clear All"
                onClick={handleClearSelection}
                style={{ fontSize: 11, padding: '2px 8px' }}
              />
            </div>
          )}

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
                  <GraviButton
                    buttonText={allExpanded ? 'Collapse All' : 'Expand All'}
                    icon={allExpanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
                    onClick={handleToggleExpandAll}
                  />
                ),
              }}
            />
          </Vertical>
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
                    <Horizontal alignItems="center" className="gap-8">
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

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title={null}
        footer={null}
        width={900}
        onCancel={() => setPreviewVisible(false)}
        styles={{ body: { padding: 0, maxHeight: '75vh', display: 'flex', flexDirection: 'column' } }}
        closable={false}
      >
        {/* Modal header */}
        <Horizontal
          justifyContent="space-between"
          alignItems="center"
          style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}
        >
          <Texto category="h5">Review New Competitor Mappings</Texto>
          <GraviButton
            icon={<CloseOutlined />}
            onClick={() => setPreviewVisible(false)}
          />
        </Horizontal>

        {previewStats && (
          <>
            {/* Stat cards */}
            <div className="preview-stat-cards">
              <div className="preview-stat-card">
                <div className="stat-number">{previewStats.quoteRowCount}</div>
                <div className="stat-label">Quote Rows</div>
              </div>
              <div className="preview-stat-card">
                <div className="stat-number">{previewStats.competitorsFound}</div>
                <div className="stat-label">Competitors Found</div>
              </div>
              <div className="preview-stat-card">
                <div className="stat-number">{previewStats.newMappings}</div>
                <div className="stat-label">New Mappings</div>
              </div>
              <div className="preview-stat-card">
                <div className="stat-number">{previewStats.alreadyExist}</div>
                <div className="stat-label">Already Exist (skipped)</div>
              </div>
            </div>

            {/* Warning banner */}
            {previewStats.alreadyExist > 0 && (
              <div className="preview-warning">
                <WarningOutlined />
                <span>
                  <strong>{previewStats.alreadyExist} mappings</strong> already exist
                  and will be skipped. Only{' '}
                  <strong>{previewStats.newMappings} new mappings</strong> will be
                  created.
                </span>
              </div>
            )}
          </>
        )}

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8, paddingBottom: 8 }}>
          {matchResults.map((result) => {
            const quoteRow = quoteRows.find(
              (r) => r.id === result.quoteRowId,
            )
            if (!quoteRow) return null
            const newCount = result.instruments.filter((i) => !i.alreadyExists).length
            const existCount = result.instruments.filter((i) => i.alreadyExists).length

            return (
              <div className="preview-group" key={result.quoteRowId}>
                <div className="preview-group-header">
                  <InfoCircleOutlined style={{ color: 'var(--success-color, #10b981)' }} />
                  <span>{getProductName(quoteRow.productId)}</span>
                  <span className="qr-detail">
                    {quoteRow.counterparty} · {getLocationName(quoteRow.locationId)} ·{' '}
                    {quoteRow.costType}
                  </span>
                  <span className="badges">
                    <span
                      style={{
                        background: '#e0edff',
                        color: '#1d4ed8',
                        fontSize: 9,
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 10,
                      }}
                    >
                      +{newCount} new
                    </span>
                    {existCount > 0 && (
                      <span
                        style={{
                          background: '#f3f4f6',
                          color: '#999',
                          fontSize: 9,
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: 10,
                        }}
                      >
                        {existCount} exist
                      </span>
                    )}
                  </span>
                </div>
                <table className="preview-table">
                  <thead>
                    <tr>
                      <th>Competitor</th>
                      <th>Publisher</th>
                      <th>Terminal</th>
                      <th>Product</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.instruments.map((inst) => (
                      <tr
                        key={inst.id}
                        className={inst.alreadyExists ? 'existing' : 'new-mapping'}
                      >
                        <td>{inst.competitor}</td>
                        <td>{inst.publisher}</td>
                        <td>{inst.terminal}</td>
                        <td>{inst.product}</td>
                        <td>
                          {inst.alreadyExists ? (
                            <span className="status-exists">Already exists</span>
                          ) : (
                            <span className="status-new">● New</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>

        {/* Fixed footer */}
        <Horizontal
          justifyContent="flex-end"
          alignItems="center"
          className="gap-8"
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e5e7eb',
            background: '#fff',
          }}
        >
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
      </Modal>
    </Vertical>
  )
}

/** Detail panel rendered inside each expanded master row */
function CompetitorDetailPanel({
  parentRow,
  associations,
  detailColDefs,
  onBulkVisibility,
}: {
  parentRow: CompetitorQuoteRow
  associations: CompetitorAssociation[]
  detailColDefs: any[]
  onBulkVisibility: (quoteRowId: number, associations: CompetitorAssociation[], value: 'Show' | 'Hide') => void
}) {
  const [selectedDetailRows, setSelectedDetailRows] = useState<CompetitorAssociation[]>([])

  const handleDetailSelection = useCallback((event: any) => {
    setSelectedDetailRows(event.api.getSelectedRows() as CompetitorAssociation[])
  }, [])

  return (
    <div className="competitor-detail-panel">
      <div className="competitor-detail-toolbar">
        <Texto appearance="medium" style={{ fontSize: 11 }}>
          {associations.length} competitor associations
        </Texto>
        {selectedDetailRows.length > 0 && (
          <Horizontal className="gap-8">
            <GraviButton
              success
              buttonText={`Show (${selectedDetailRows.length})`}
              icon={<EyeOutlined />}
              onClick={() => onBulkVisibility(parentRow.id, selectedDetailRows, 'Show')}
              style={{ fontSize: 11, padding: '2px 8px' }}
            />
            <GraviButton
              buttonText={`Hide (${selectedDetailRows.length})`}
              icon={<EyeInvisibleOutlined />}
              onClick={() => onBulkVisibility(parentRow.id, selectedDetailRows, 'Hide')}
              style={{ fontSize: 11, padding: '2px 8px' }}
            />
          </Horizontal>
        )}
      </div>
      <GraviGrid
        storageKey={`competitor-detail-${parentRow.id}`}
        rowData={associations}
        columnDefs={detailColDefs}
        agPropOverrides={{
          domLayout: 'autoHeight',
          rowSelection: 'multiple',
          suppressRowClickSelection: true,
          getRowId: (p: any) => String(p.data.id),
        }}
        onSelectionChanged={handleDetailSelection}
        hideControlBar={true}
      />
    </div>
  )
}
