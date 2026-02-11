/**
 * Full Entry Flow
 *
 * Two-column layout for contract header entry matching Gravitate production.
 * Features sidebar for contract type/description and main panel for form sections.
 * Footer bar with navigation to Details step.
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { FileAddOutlined } from '@ant-design/icons'

import type { ContractDetail, ContractStatus, PageMode } from '../types/contract.types'
import type { FullEntryHeader } from './fullentry.types'
import { DEFAULT_FULL_ENTRY_HEADER } from './fullentry.defaults'
import { createEmptyDetail } from './fullentry.defaults'
import { ContractTypeSidebar, CounterpartySection, TradeInfoSection, AdditionalInfoSection } from './sections'
import { DetailsGridSection } from '../quick-entry/sections/DetailsGridSection'
import { FormulaEditorDrawer } from '../quick-entry/components/FormulaEditorDrawer'
import { Footer } from '../components/Footer'
import styles from './FullEntryFlow.module.css'

interface FullEntryFlowProps {
  details: ContractDetail[]
  onDetailAdd: (detail: ContractDetail) => void
  onDetailUpdate: (detail: ContractDetail) => void
  onDetailDelete: (id: string) => void
  onBulkAddDetails: (details: ContractDetail[]) => void
  mode?: PageMode
  initialHeader?: FullEntryHeader
  contractStatus?: ContractStatus
}

export function FullEntryFlow({
  details,
  onDetailAdd,
  onDetailUpdate,
  onDetailDelete,
  onBulkAddDetails,
  mode = 'create',
  initialHeader,
  contractStatus,
}: FullEntryFlowProps) {
  const navigate = useNavigate()
  const isViewMode = mode === 'view'
  const isExpired = contractStatus === 'expired'
  const isActive = contractStatus === 'active'

  // Form state - auto-populated with defaults or initial data
  const [header, setHeader] = useState<FullEntryHeader>(initialHeader || DEFAULT_FULL_ENTRY_HEADER)
  const [showDetails, setShowDetails] = useState(false)
  const [formulaDrawerOpen, setFormulaDrawerOpen] = useState(false)
  const [activeDetail, setActiveDetail] = useState<ContractDetail | null>(null)
  const [selectedDetailIds, setSelectedDetailIds] = useState<string[]>([])

  const handleHeaderChange = useCallback((updates: Partial<FullEntryHeader>) => {
    setHeader((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleSidebarChange = useCallback((updates: Partial<FullEntryHeader>) => {
    setHeader((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleManageDetails = useCallback(() => {
    setShowDetails((prev) => !prev)
  }, [])

  const handleFormulaClick = useCallback((detail: ContractDetail) => {
    setActiveDetail(detail)
    setFormulaDrawerOpen(true)
  }, [])

  const handleFormulaSave = useCallback(
    (detail: ContractDetail) => {
      onDetailUpdate({
        ...detail,
        status: detail.formula && detail.quantity > 0 ? 'ready' : 'in-progress',
      })
      setFormulaDrawerOpen(false)
      setActiveDetail(null)
    },
    [onDetailUpdate],
  )

  const handleCancel = useCallback(() => {
    navigate('/Contracts')
  }, [navigate])

  return (
    <Vertical className={styles.container}>
      {/* Two-column content layout */}
      <Horizontal className={styles.formRow}>
        {/* Left Sidebar - Contract Type Selection */}
        <ContractTypeSidebar
          contractType={header.contractType}
          description={header.description}
          comments={header.comments}
          onChange={handleSidebarChange}
          disabled={isViewMode}
        />

        {/* Right Main Panel */}
        <Vertical className={styles.mainPanel}>
          {/* Form Container */}
          <Vertical className={styles.formContainer}>
            <Texto category='h4' weight='600' className='mb-4'>
              Contract Header
            </Texto>
            <Vertical style={{ gap: '2rem' }}>
              <CounterpartySection header={header} onChange={handleHeaderChange} disabled={isExpired} lockExternalParty={isActive} />
              <TradeInfoSection header={header} onChange={handleHeaderChange} disabled={isExpired} />
              <AdditionalInfoSection header={header} onChange={handleHeaderChange} disabled={isExpired} />
            </Vertical>
          </Vertical>

          {/* Footer */}
          <Footer
            title='Header Entry'
            icon={<FileAddOutlined />}
            buttonTitle={showDetails ? 'Hide Details' : 'Manage Details'}
            onClick={handleManageDetails}
            onClickCancel={isViewMode ? undefined : handleCancel}
            canWrite={!isViewMode}
          />
        </Vertical>
      </Horizontal>

      {showDetails && (
        <>
          <Vertical className={styles.detailsSection}>
            <Texto category='h4' weight='600' className='mb-2'>
              Contract Details
            </Texto>
            <DetailsGridSection
              details={details}
              selectedIds={selectedDetailIds}
              onFormulaClick={handleFormulaClick}
              onDetailUpdate={onDetailUpdate}
              onDetailDelete={onDetailDelete}
              onSelectionChange={setSelectedDetailIds}
              onAddDetail={() => onDetailAdd(createEmptyDetail())}
              onBulkEdit={() => {}}
              onBulkCreate={() => onBulkAddDetails([createEmptyDetail()])}
              contractStatus={contractStatus}
            />
          </Vertical>

          <FormulaEditorDrawer
            visible={formulaDrawerOpen}
            detail={activeDetail}
            onClose={() => {
              setFormulaDrawerOpen(false)
              setActiveDetail(null)
            }}
            onSave={handleFormulaSave}
          />
        </>
      )}
    </Vertical>
  )
}
