/**
 * Day Deal Flow
 *
 * Flat grid-first entry for day deals. No header bar, no calendar —
 * each row is a fully independent deal with its own supplier, product,
 * location, dates, and price.
 *
 * In create mode, users land on an empty state with 4 entry paths
 * (Upload, Add Row, Bulk Add, Copy). Once rows exist the grid takes over.
 *
 * Layout:
 * - EmptyStateSection (when no details, create mode)
 * - DayDealGridSection (when details exist)
 * - FooterBar (Create Day Deals)
 * - Modals/Drawers for bulk operations
 */

import { useState, useCallback } from 'react'
import { Vertical } from '@gravitate-js/excalibrr'
import { NotificationMessage } from '@gravitate-js/excalibrr'

import { EmptyStateSection } from '../quick-entry/sections/EmptyStateSection'
import { FooterBar } from '../quick-entry/components/FooterBar'
import { BulkCreateDrawer } from '../quick-entry/components/BulkCreateDrawer'
import { ImportFileModal } from '../quick-entry/components/ImportFileModal'
import { CopyDealModal } from '../quick-entry/components/CopyDealModal'
import { DayDealGridSection } from './sections/DayDealGridSection'
import type { ContractDetail, ContractHeader, PageMode } from '../types/contract.types'
import styles from './DayDealFlow.module.css'

interface DayDealFlowProps {
  details: ContractDetail[]
  onDetailAdd: (detail: ContractDetail) => void
  onDetailUpdate: (detail: ContractDetail) => void
  onDetailDelete: (id: string) => void
  onBulkAddDetails: (details: ContractDetail[]) => void
  mode?: PageMode
  initialHeader?: ContractHeader
}

const DEFAULT_HEADER: ContractHeader = {
  internalParty: '',
  externalParty: '',
  startDate: new Date(),
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  effectiveTime: '6:00 PM',
  currency: 'US Dollars',
  unitOfMeasure: 'GAL',
}

function createEmptyRow(): ContractDetail {
  const today = new Date()
  return {
    id: `detail-${Date.now()}`,
    supplier: '',
    product: '',
    location: '',
    calendar: 'Contract Calendar',
    startDate: today,
    endDate: today,
    effectiveTime: '6:00 PM',
    provisionType: 'Fixed',
    quantity: 0,
    status: 'empty',
  }
}

export function DayDealFlow({
  details,
  onDetailAdd,
  onDetailUpdate,
  onDetailDelete,
  onBulkAddDetails,
  mode = 'create',
  initialHeader,
}: DayDealFlowProps) {
  const [header] = useState<ContractHeader>(initialHeader || DEFAULT_HEADER)

  // Selection state
  const [selectedDetailIds, setSelectedDetailIds] = useState<string[]>([])

  // Modal/drawer states
  const [bulkCreateDrawerOpen, setBulkCreateDrawerOpen] = useState(false)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)
  const [importFileModalOpen, setImportFileModalOpen] = useState(false)
  const [copyDealModalOpen, setCopyDealModalOpen] = useState(false)

  // Screen state: show empty state or grid
  const screen = details.length > 0 ? 'grid' : 'empty'

  // Empty-state entry-path callbacks
  const handleUploadFile = useCallback(() => {
    setImportFileModalOpen(true)
  }, [])

  const handleAddRowManually = useCallback(() => {
    onDetailAdd(createEmptyRow())
  }, [onDetailAdd])

  const handleAddMultipleRows = useCallback(() => {
    setBulkCreateDrawerOpen(true)
  }, [])

  const handleCopyFromExisting = useCallback(() => {
    setCopyDealModalOpen(true)
  }, [])

  // Action handlers
  const handleCancel = useCallback(() => {
    console.log('Cancel clicked')
  }, [])

  const handleSaveDraft = useCallback(() => {
    NotificationMessage('Draft Saved', 'Day deal saved as draft', false)
  }, [])

  const handleCreateContract = useCallback(() => {
    NotificationMessage('Day Deals Created', 'Day deals have been created successfully', false)
  }, [])

  // Grid action handlers
  const handleAddDetail = useCallback(() => {
    onDetailAdd(createEmptyRow())
  }, [onDetailAdd])

  const handleDetailUpdate = useCallback(
    (updatedDetail: ContractDetail) => {
      onDetailUpdate(updatedDetail)
    },
    [onDetailUpdate],
  )

  const handleDetailDelete = useCallback(
    (detailId: string) => {
      onDetailDelete(detailId)
    },
    [onDetailDelete],
  )

  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedDetailIds(selectedIds)
  }, [])

  // Bulk create handler
  const handleBulkCreate = useCallback(
    (products: string[], locations: string[]) => {
      const newDetails: ContractDetail[] = []
      let counter = Date.now()
      const today = new Date()

      for (const product of products) {
        for (const location of locations) {
          newDetails.push({
            id: `detail-${counter++}`,
            supplier: '',
            product,
            location,
            calendar: 'Contract Calendar',
            startDate: today,
            endDate: today,
            effectiveTime: '6:00 PM',
            provisionType: 'Fixed',
            quantity: 0,
            status: 'empty',
          })
        }
      }

      onBulkAddDetails(newDetails)
      setBulkCreateDrawerOpen(false)
    },
    [onBulkAddDetails],
  )

  // Import file handler
  const handleImportComplete = useCallback(
    (importedDetails: ContractDetail[]) => {
      onBulkAddDetails(importedDetails)
      setImportFileModalOpen(false)
    },
    [onBulkAddDetails],
  )

  // Copy deal handler
  const handleCopyDeal = useCallback(
    (copiedDetails: ContractDetail[]) => {
      onBulkAddDetails(copiedDetails)
      setCopyDealModalOpen(false)
    },
    [onBulkAddDetails],
  )

  // Bulk change bar update handler (receives merged rows from GraviGrid)
  const handleBulkUpdate = useCallback(
    async (rows: ContractDetail | ContractDetail[]) => {
      const updatedRows = Array.isArray(rows) ? rows : [rows]
      updatedRows.forEach((row) => onDetailUpdate(row))
    },
    [onDetailUpdate],
  )

  // Day deal completeness: supplier, product, location, fixedValue required; quantity optional
  const isDetailComplete = (d: ContractDetail) =>
    d.supplier !== '' && d.product !== '' && d.location !== '' && d.fixedValue != null

  const hasIncompleteDetails = details.length === 0 || details.some((d) => !isDetailComplete(d))
  const isCreateDisabled = hasIncompleteDetails

  return (
    <Vertical height='100%' className={styles['page-wrapper']}>
      {/* Empty state or grid */}
      <Vertical flex='1'>
        {screen === 'empty' && mode === 'create' ? (
          <EmptyStateSection
            onUploadFile={handleUploadFile}
            onAddRowManually={handleAddRowManually}
            onAddMultipleRows={handleAddMultipleRows}
            onCopyFromExisting={handleCopyFromExisting}
          />
        ) : (
          <DayDealGridSection
            details={details}
            selectedIds={selectedDetailIds}
            onDetailUpdate={handleDetailUpdate}
            onDetailDelete={handleDetailDelete}
            onSelectionChange={handleSelectionChange}
            onAddDetail={handleAddDetail}
            onBulkCreate={() => setBulkCreateDrawerOpen(true)}
            onImport={() => setImportFileModalOpen(true)}
            isBulkChangeVisible={isBulkChangeVisible}
            setIsBulkChangeVisible={setIsBulkChangeVisible}
            onBulkUpdate={handleBulkUpdate}
          />
        )}
      </Vertical>

      {/* Footer Bar */}
      <FooterBar
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onCreateContract={handleCreateContract}
        isCreateDisabled={isCreateDisabled}
        validationMessage={
          hasIncompleteDetails && details.length > 0
            ? 'Please complete all required fields (supplier, product, location, price) for each row.'
            : undefined
        }
        mode={mode}
        createButtonText='Create Day Deals'
      />

      {/* Bulk Create Drawer */}
      <BulkCreateDrawer
        visible={bulkCreateDrawerOpen}
        onClose={() => setBulkCreateDrawerOpen(false)}
        onCreate={handleBulkCreate}
      />

      {/* Import File Modal */}
      <ImportFileModal
        visible={importFileModalOpen}
        onClose={() => setImportFileModalOpen(false)}
        onImport={handleImportComplete}
        headerDates={{ startDate: header.startDate, endDate: header.endDate }}
      />

      {/* Copy Deal Modal */}
      <CopyDealModal visible={copyDealModalOpen} onClose={() => setCopyDealModalOpen(false)} onCopy={handleCopyDeal} />
    </Vertical>
  )
}
