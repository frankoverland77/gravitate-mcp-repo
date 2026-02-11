/**
 * Quick Entry Flow
 *
 * Speed-optimized contract creation with inline editing grid.
 * Shows empty state with entry paths, then transitions to grid view.
 *
 * Layout matches wireframe:
 * - TopHeader: title + badge + Cancel/Save Draft buttons
 * - InfoBar: dark green compact bar with inline values
 * - Main content: Empty state or grid (grid has built-in controlBar header)
 * - FooterBar: Cancel / Save Draft / Create Contract
 */

import { useState, useCallback } from 'react'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { NotificationMessage } from '@gravitate-js/excalibrr'

import { FooterBar } from './components/FooterBar'
import { EditHeaderModal } from './components/EditHeaderModal'
import { EmptyStateSection } from './sections/EmptyStateSection'
import { ContractHeaderSection } from './sections/ContractHeaderSection'
import { ContractHeaderSidebar } from './sections/ContractHeaderSidebar'
import { DetailsGridSection } from './sections/DetailsGridSection'
import { FormulaEditorDrawer } from './components/FormulaEditorDrawer'
import { BulkCreateDrawer } from './components/BulkCreateDrawer'
import { BulkEditModal } from './components/BulkEditModal'
import { ImportFileModal } from './components/ImportFileModal'
import { CopyDealModal } from './components/CopyDealModal'
import { ExtendContractModal } from './components/ExtendContractModal'
import type { QuickEntryScreen, ContractDetail, ContractHeader, PageMode, ContractStatus } from '../types/contract.types'
import styles from './QuickEntryFlow.module.css'

interface QuickEntryFlowProps {
  details: ContractDetail[]
  onDetailAdd: (detail: ContractDetail) => void
  onDetailUpdate: (detail: ContractDetail) => void
  onDetailDelete: (id: string) => void
  onBulkAddDetails: (details: ContractDetail[]) => void
  mode?: PageMode
  initialHeader?: ContractHeader
  contractName?: string
  contractStatus?: ContractStatus
  createdAt?: Date
}

// Toggle between sidebar layout (left panel) and bar layout (green top bar)
const useSidebarLayout = true

// Default header values
const DEFAULT_HEADER: ContractHeader = {
  internalParty: '',
  externalParty: '',
  startDate: new Date(),
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  effectiveTime: '6:00 PM',
  currency: 'US Dollars',
  unitOfMeasure: 'GAL',
}

export function QuickEntryFlow({
  details,
  onDetailAdd,
  onDetailUpdate,
  onDetailDelete,
  onBulkAddDetails,
  mode = 'create',
  initialHeader,
  contractName,
  contractStatus,
  createdAt,
}: QuickEntryFlowProps) {
  const isViewMode = mode === 'view'

  // Derive screen from details
  const screen: QuickEntryScreen = details.length > 0 ? 'grid' : 'empty'

  // Contract data
  const [header, setHeader] = useState<ContractHeader>(initialHeader || DEFAULT_HEADER)
  const [selectedDetailIds, setSelectedDetailIds] = useState<string[]>([])

  // Modal/drawer states
  const [editHeaderModalOpen, setEditHeaderModalOpen] = useState(false)
  const [formulaDrawerOpen, setFormulaDrawerOpen] = useState(false)
  const [activeDetail, setActiveDetail] = useState<ContractDetail | null>(null)
  const [bulkCreateDrawerOpen, setBulkCreateDrawerOpen] = useState(false)
  const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false)
  const [importFileModalOpen, setImportFileModalOpen] = useState(false)
  const [copyDealModalOpen, setCopyDealModalOpen] = useState(false)
  const [extendModalOpen, setExtendModalOpen] = useState(false)

  // Top header action handlers
  const handleCancel = useCallback(() => {
    // Navigate back or reset
    console.log('Cancel clicked')
  }, [])

  const handleSaveDraft = useCallback(() => {
    NotificationMessage('Draft Saved', 'Contract saved as draft', false)
  }, [])

  // Footer action handlers
  const handleCreateContract = useCallback(() => {
    NotificationMessage('Contract Created', 'Contract has been created successfully', false)
  }, [])

  // Entry path handlers
  const handleUploadFile = useCallback(() => {
    setImportFileModalOpen(true)
  }, [])

  const handleAddRowManually = useCallback(() => {
    const newDetail: ContractDetail = {
      id: `detail-${Date.now()}`,
      product: '',
      location: '',
      calendar: 'Contract Calendar',
      startDate: header.startDate,
      endDate: header.endDate,
      effectiveTime: header.effectiveTime,
      provisionType: 'Formula',
      quantity: 0,
      status: 'empty',
      ...(contractStatus === 'active' ? { isNew: true } : {}),
    }
    onDetailAdd(newDetail)
  }, [header.startDate, header.endDate, header.effectiveTime, onDetailAdd, contractStatus])

  const handleAddMultipleRows = useCallback(() => {
    setBulkCreateDrawerOpen(true)
  }, [])

  const handleCopyFromExisting = useCallback(() => {
    setCopyDealModalOpen(true)
  }, [])

  // Grid action handlers
  const handleAddDetail = useCallback(() => {
    const newDetail: ContractDetail = {
      id: `detail-${Date.now()}`,
      product: '',
      location: '',
      calendar: 'Contract Calendar',
      startDate: header.startDate,
      endDate: header.endDate,
      effectiveTime: header.effectiveTime,
      provisionType: 'Formula',
      quantity: 0,
      status: 'empty',
      ...(contractStatus === 'active' ? { isNew: true } : {}),
    }
    onDetailAdd(newDetail)
  }, [header.startDate, header.endDate, header.effectiveTime, onDetailAdd, contractStatus])

  const handleFormulaClick = useCallback((detail: ContractDetail) => {
    setActiveDetail(detail)
    setFormulaDrawerOpen(true)
  }, [])

  const handleDetailUpdate = useCallback((updatedDetail: ContractDetail) => {
    onDetailUpdate(updatedDetail)
  }, [onDetailUpdate])

  const handleDetailDelete = useCallback((detailId: string) => {
    onDetailDelete(detailId)
  }, [onDetailDelete])

  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedDetailIds(selectedIds)
  }, [])

  const handleBulkEdit = useCallback(() => {
    if (selectedDetailIds.length > 0) {
      setBulkEditModalOpen(true)
    }
  }, [selectedDetailIds])

  // Bulk create handler
  const handleBulkCreate = useCallback(
    (products: string[], locations: string[]) => {
      const newDetails: ContractDetail[] = []
      let counter = Date.now()

      for (const product of products) {
        for (const location of locations) {
          newDetails.push({
            id: `detail-${counter++}`,
            product,
            location,
            calendar: 'Contract Calendar',
            startDate: header.startDate,
            endDate: header.endDate,
            effectiveTime: header.effectiveTime,
            provisionType: 'Formula',
            quantity: 0,
            status: 'empty',
            ...(contractStatus === 'active' ? { isNew: true } : {}),
          })
        }
      }

      onBulkAddDetails(newDetails)
      setBulkCreateDrawerOpen(false)
    },
    [header.startDate, header.endDate, header.effectiveTime, onBulkAddDetails, contractStatus]
  )

  // Import file handler
  const handleImportComplete = useCallback((importedDetails: ContractDetail[]) => {
    onBulkAddDetails(importedDetails)
    setImportFileModalOpen(false)
  }, [onBulkAddDetails])

  // Copy deal handler
  const handleCopyDeal = useCallback((copiedDetails: ContractDetail[]) => {
    onBulkAddDetails(copiedDetails)
    setCopyDealModalOpen(false)
  }, [onBulkAddDetails])

  // Extend contract handler (expired contracts)
  const handleExtendContract = useCallback(
    (startDate: Date, endDate: Date) => {
      setHeader((prev) => ({ ...prev, startDate, endDate }))
      details.forEach((d) => {
        onDetailUpdate({ ...d, startDate, endDate })
      })
      setExtendModalOpen(false)
    },
    [details, onDetailUpdate],
  )

  // Formula save handler
  const handleFormulaSave = useCallback(
    (detail: ContractDetail) => {
      onDetailUpdate({
        ...detail,
        status: detail.formula && detail.quantity > 0 ? 'ready' : 'in-progress',
      })
      setFormulaDrawerOpen(false)
      setActiveDetail(null)
    },
    [onDetailUpdate]
  )

  // Bulk edit apply handler
  const handleBulkEditApply = useCallback(
    (field: keyof ContractDetail, value: unknown) => {
      details
        .filter((d) => selectedDetailIds.includes(d.id))
        .forEach((d) => {
          onDetailUpdate({ ...d, [field]: value })
        })
      setBulkEditModalOpen(false)
    },
    [details, selectedDetailIds, onDetailUpdate]
  )

  // Validate all required fields before allowing contract creation
  const isDetailComplete = (d: ContractDetail) =>
    d.product !== '' && d.location !== '' && !!d.destination && d.destination !== '' && !!d.formula && d.quantity > 0

  const hasIncompleteDetails = details.length === 0 || details.some((d) => !isDetailComplete(d))
  const isCreateDisabled = hasIncompleteDetails

  return (
    <Vertical height='100%' className={styles.pageWrapper}>
      {useSidebarLayout ? (
        <Horizontal flex='1' className={styles.contentRow}>
          <ContractHeaderSidebar
            header={header}
            contractName={contractName}
            contractStatus={contractStatus}
            createdAt={createdAt}
            onEditClick={() => setEditHeaderModalOpen(true)}
          />
          <Vertical flex='1' className={styles.mainContent}>
            <div className={styles.gridPanel}>
              <div className={styles.panelBody}>
                {screen === 'empty' && mode === 'create' ? (
                  <EmptyStateSection
                    onUploadFile={handleUploadFile}
                    onAddRowManually={handleAddRowManually}
                    onAddMultipleRows={handleAddMultipleRows}
                    onCopyFromExisting={handleCopyFromExisting}
                  />
                ) : (
                  <DetailsGridSection
                    details={details}
                    selectedIds={selectedDetailIds}
                    onFormulaClick={handleFormulaClick}
                    onDetailUpdate={handleDetailUpdate}
                    onDetailDelete={handleDetailDelete}
                    onSelectionChange={handleSelectionChange}
                    onAddDetail={handleAddDetail}
                    onBulkEdit={handleBulkEdit}
                    onBulkCreate={() => setBulkCreateDrawerOpen(true)}
                    contractStatus={contractStatus}
                  />
                )}
              </div>
            </div>
          </Vertical>
        </Horizontal>
      ) : (
        <>
          <ContractHeaderSection header={header} onEditClick={() => setEditHeaderModalOpen(true)} />
          <Vertical flex='1' className={styles.mainContent}>
            <div className={styles.gridPanel}>
              <div className={styles.panelBody}>
                {screen === 'empty' && mode === 'create' ? (
                  <EmptyStateSection
                    onUploadFile={handleUploadFile}
                    onAddRowManually={handleAddRowManually}
                    onAddMultipleRows={handleAddMultipleRows}
                    onCopyFromExisting={handleCopyFromExisting}
                  />
                ) : (
                  <DetailsGridSection
                    details={details}
                    selectedIds={selectedDetailIds}
                    onFormulaClick={handleFormulaClick}
                    onDetailUpdate={handleDetailUpdate}
                    onDetailDelete={handleDetailDelete}
                    onSelectionChange={handleSelectionChange}
                    onAddDetail={handleAddDetail}
                    onBulkEdit={handleBulkEdit}
                    onBulkCreate={() => setBulkCreateDrawerOpen(true)}
                    contractStatus={contractStatus}
                  />
                )}
              </div>
            </div>
          </Vertical>
        </>
      )}

      {/* Footer Bar */}
      <FooterBar
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onCreateContract={handleCreateContract}
        isCreateDisabled={isCreateDisabled}
        validationMessage={
          hasIncompleteDetails && details.length > 0
            ? 'Please make sure all fields are complete before creating the contract.'
            : undefined
        }
        mode={mode}
        contractStatus={contractStatus}
        onExtendContract={() => setExtendModalOpen(true)}
      />

      {/* Edit Header Modal */}
      <EditHeaderModal
        visible={editHeaderModalOpen}
        header={header}
        onClose={() => setEditHeaderModalOpen(false)}
        onSave={setHeader}
      />

      {/* Formula Editor Drawer */}
      <FormulaEditorDrawer
        visible={formulaDrawerOpen}
        detail={activeDetail}
        onClose={() => {
          setFormulaDrawerOpen(false)
          setActiveDetail(null)
        }}
        onSave={handleFormulaSave}
      />

      {/* Bulk Create Drawer */}
      <BulkCreateDrawer
        visible={bulkCreateDrawerOpen}
        onClose={() => setBulkCreateDrawerOpen(false)}
        onCreate={handleBulkCreate}
      />

      {/* Bulk Edit Modal */}
      <BulkEditModal
        visible={bulkEditModalOpen}
        selectedCount={selectedDetailIds.length}
        onClose={() => setBulkEditModalOpen(false)}
        onApply={handleBulkEditApply}
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

      {/* Extend Contract Modal (expired) */}
      <ExtendContractModal
        visible={extendModalOpen}
        currentStartDate={header.startDate}
        currentEndDate={header.endDate}
        onClose={() => setExtendModalOpen(false)}
        onExtend={handleExtendContract}
      />
    </Vertical>
  )
}
