import { useState, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton, NotificationMessage } from '@gravitate-js/excalibrr'
import { LeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'

const { TabPane } = Tabs
import type {
  SellerRFP,
  SellerRFPDetail,
  SellerRFPPageState,
  WorkspaceTab,
  RFPTerms,
  EntryPath,
} from './types/sellerRfp.types'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  isDeadlineUrgent,
  deriveDetailStatus,
  calculateMarginCpg,
} from './types/sellerRfp.types'
import { SAMPLE_SELLER_RFPS } from './data/sellerRfp.data'
import { PipelineGrid } from './sections/PipelineGrid'
import { DetailsFormulasTab } from './sections/DetailsFormulasTab'
import { TermsTab } from './sections/TermsTab'
import { SummaryExportTab } from './sections/SummaryExportTab'
import { AnalysisTab } from './sections/AnalysisTab'
import { EntryPathModal } from './components/EntryPathModal'
import { IntakeDrawer } from './components/IntakeDrawer'
import { UploadRFPModal } from './components/UploadRFPModal'
import { CopyResponseModal } from './components/CopyResponseModal'
import { ManualEntryDrawer } from './components/ManualEntryDrawer'
import { AdjudicationModal } from './components/AdjudicationModal'
import styles from './SellerRFPPage.module.css'

const initialState: SellerRFPPageState = {
  currentScreen: 'pipeline',
  selectedRFP: null,
  activeTab: 'details',
  isDirty: false,
  rfps: [...SAMPLE_SELLER_RFPS],
  entryPathModalOpen: false,
  activeEntryPath: null,
  intakeDrawerOpen: false,
  saleFormulaDrawerOpen: false,
  adjudicationModalOpen: false,
  activeDetailId: null,
}

export function SellerRFPPage() {
  const [state, setState] = useState<SellerRFPPageState>(initialState)

  // =========================================================================
  // NAVIGATION
  // =========================================================================

  const handleRFPClick = useCallback((rfp: SellerRFP) => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'workspace',
      selectedRFP: rfp,
      activeTab: 'details',
      isDirty: false,
    }))
  }, [])

  const handleBackToPipeline = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'pipeline',
      selectedRFP: null,
      isDirty: false,
      saleFormulaDrawerOpen: false,
      activeDetailId: null,
    }))
  }, [])

  const handleTabChange = useCallback((key: string) => {
    setState((prev) => ({ ...prev, activeTab: key as WorkspaceTab }))
  }, [])

  // =========================================================================
  // ENTRY PATH & INTAKE
  // =========================================================================

  const handleOpenEntryPath = useCallback(() => {
    setState((prev) => ({ ...prev, entryPathModalOpen: true }))
  }, [])

  const handleCloseEntryPath = useCallback(() => {
    setState((prev) => ({ ...prev, entryPathModalOpen: false, activeEntryPath: null }))
  }, [])

  const handleSelectEntryPath = useCallback((path: EntryPath) => {
    setState((prev) => ({
      ...prev,
      entryPathModalOpen: false,
      activeEntryPath: path,
      intakeDrawerOpen: path === 'matrix',
    }))
  }, [])

  const handleCloseIntake = useCallback(() => {
    setState((prev) => ({ ...prev, intakeDrawerOpen: false, activeEntryPath: null }))
  }, [])

  const handleCloseUpload = useCallback(() => {
    setState((prev) => ({ ...prev, activeEntryPath: null }))
  }, [])

  const handleCloseCopy = useCallback(() => {
    setState((prev) => ({ ...prev, activeEntryPath: null }))
  }, [])

  const handleCloseManual = useCallback(() => {
    setState((prev) => ({ ...prev, activeEntryPath: null }))
  }, [])

  const handleCreateRFP = useCallback((newRFP: SellerRFP) => {
    setState((prev) => ({
      ...prev,
      rfps: [newRFP, ...prev.rfps],
      intakeDrawerOpen: false,
      activeEntryPath: null,
      entryPathModalOpen: false,
      currentScreen: 'workspace',
      selectedRFP: newRFP,
      activeTab: 'details',
      isDirty: false,
    }))
  }, [])

  const handleDeclineRFP = useCallback((declinedRFP: SellerRFP) => {
    setState((prev) => ({
      ...prev,
      rfps: [declinedRFP, ...prev.rfps],
      intakeDrawerOpen: false,
      activeEntryPath: null,
    }))
    NotificationMessage('Declined', `RFP declined — ${declinedRFP.buyerName}.`, false)
  }, [])

  // =========================================================================
  // DETAIL UPDATES
  // =========================================================================

  const handleDetailUpdate = useCallback((updatedDetail: SellerRFPDetail) => {
    setState((prev) => {
      if (!prev.selectedRFP) return prev

      const updatedDetails = prev.selectedRFP.details.map((d) =>
        d.id === updatedDetail.id
          ? { ...updatedDetail, status: deriveDetailStatus(updatedDetail) }
          : d,
      )

      const updatedRFP = { ...prev.selectedRFP, details: updatedDetails, updatedAt: new Date().toISOString() }
      const updatedRfps = prev.rfps.map((r) => (r.id === updatedRFP.id ? updatedRFP : r))

      return { ...prev, selectedRFP: updatedRFP, rfps: updatedRfps, isDirty: true }
    })
  }, [])

  const handleDetailsReplace = useCallback((newDetails: SellerRFPDetail[]) => {
    setState((prev) => {
      if (!prev.selectedRFP) return prev
      const updatedRFP = { ...prev.selectedRFP, details: newDetails, updatedAt: new Date().toISOString() }
      const updatedRfps = prev.rfps.map((r) => (r.id === updatedRFP.id ? updatedRFP : r))
      return { ...prev, selectedRFP: updatedRFP, rfps: updatedRfps, isDirty: true }
    })
  }, [])

  const handleTermsUpdate = useCallback((terms: RFPTerms) => {
    setState((prev) => {
      if (!prev.selectedRFP) return prev
      const updatedRFP = { ...prev.selectedRFP, terms, updatedAt: new Date().toISOString() }
      const updatedRfps = prev.rfps.map((r) => (r.id === updatedRFP.id ? updatedRFP : r))
      return { ...prev, selectedRFP: updatedRFP, rfps: updatedRfps, isDirty: true }
    })
  }, [])

  // =========================================================================
  // FORMULA DRAWER
  // =========================================================================

  const handleOpenSaleFormula = useCallback((detailId: string) => {
    setState((prev) => ({
      ...prev,
      saleFormulaDrawerOpen: true,
      activeDetailId: detailId,
    }))
  }, [])

  const handleCloseSaleFormula = useCallback(() => {
    setState((prev) => ({
      ...prev,
      saleFormulaDrawerOpen: false,
      activeDetailId: null,
    }))
  }, [])

  // =========================================================================
  // SAVE & SUBMIT
  // =========================================================================

  const handleSave = useCallback(() => {
    setState((prev) => ({ ...prev, isDirty: false }))
    NotificationMessage('Saved', 'RFP response saved successfully.', false)
  }, [])

  const handleSubmit = useCallback(() => {
    setState((prev) => {
      if (!prev.selectedRFP) return prev
      const now = new Date().toISOString()
      const round = prev.selectedRFP.currentRound
      const newRound = {
        round,
        submittedAt: now,
        adjudication: null as null,
        adjudicationReason: null as null,
        adjudicationNotes: null as null,
        detailSnapshot: prev.selectedRFP.details.map((d) => ({ ...d })),
      }
      const updatedRFP = {
        ...prev.selectedRFP,
        status: 'submitted' as const,
        rounds: [...prev.selectedRFP.rounds, newRound],
        updatedAt: now,
      }
      const updatedRfps = prev.rfps.map((r) => (r.id === updatedRFP.id ? updatedRFP : r))
      return { ...prev, selectedRFP: updatedRFP, rfps: updatedRfps, isDirty: false }
    })
    NotificationMessage('Submitted', 'RFP response submitted to buyer.', false)
  }, [])

  // =========================================================================
  // ADJUDICATION
  // =========================================================================

  const handleOpenAdjudication = useCallback(() => {
    setState((prev) => ({ ...prev, adjudicationModalOpen: true }))
  }, [])

  const handleCloseAdjudication = useCallback(() => {
    setState((prev) => ({ ...prev, adjudicationModalOpen: false }))
  }, [])

  const handleAdjudicate = useCallback((result: 'won' | 'lost' | 'advanced', reason?: string, notes?: string) => {
    setState((prev) => {
      if (!prev.selectedRFP) return prev
      const now = new Date().toISOString()
      const currentRound = prev.selectedRFP.rounds.length > 0
        ? prev.selectedRFP.rounds[prev.selectedRFP.rounds.length - 1]
        : null

      // Update the last round with adjudication
      const updatedRounds = prev.selectedRFP.rounds.map((r, i) =>
        i === prev.selectedRFP!.rounds.length - 1
          ? { ...r, adjudication: result, adjudicationReason: reason || null, adjudicationNotes: notes || null }
          : r,
      )

      let updatedRFP: SellerRFP

      if (result === 'advanced') {
        // Create next round with prior round snapshot
        const priorDetails = prev.selectedRFP.details.map((d) => ({
          ...d,
          priorRoundValues: {
            costPrice: d.costPrice,
            salePrice: d.salePrice,
            margin: d.margin,
            saleFormulaDisplay: d.saleFormula ? d.saleFormula.expression : null,
            volume: d.volume,
          },
        }))

        updatedRFP = {
          ...prev.selectedRFP,
          status: 'in-progress',
          currentRound: prev.selectedRFP.currentRound + 1,
          rounds: updatedRounds,
          details: priorDetails,
          updatedAt: now,
        }
      } else {
        updatedRFP = {
          ...prev.selectedRFP,
          status: result,
          rounds: updatedRounds,
          updatedAt: now,
        }
      }

      const updatedRfps = prev.rfps.map((r) => (r.id === updatedRFP.id ? updatedRFP : r))
      return {
        ...prev,
        selectedRFP: updatedRFP,
        rfps: updatedRfps,
        adjudicationModalOpen: false,
        isDirty: false,
      }
    })

    const messages = {
      won: 'Congratulations! RFP marked as won.',
      lost: 'RFP marked as lost. Outcome recorded.',
      advanced: 'Advanced to next round. Prior submission loaded.',
    }
    NotificationMessage(result === 'won' ? 'Won!' : result === 'lost' ? 'Lost' : 'Advanced', messages[result], false)
  }, [])

  // =========================================================================
  // RENDER
  // =========================================================================

  const renderWorkspace = () => {
    const rfp = state.selectedRFP
    if (!rfp) return null

    const deadlineUrgent = isDeadlineUrgent(rfp.deadline)
    const deadlineDate = new Date(rfp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const statusColors = STATUS_COLORS[rfp.status]

    const activeDetail = state.activeDetailId
      ? rfp.details.find((d) => d.id === state.activeDetailId) || null
      : null

    return (
      <>
        {/* Header */}
        <div className={styles['workspace-header']}>
          <button className={styles['back-button']} onClick={handleBackToPipeline}>
            <LeftOutlined /> RFP Pipeline
          </button>

          <div className={styles['header-row']}>
            <div className={styles['header-left']}>
              <Texto category="h3" weight="600">{rfp.name}</Texto>
              <Texto category="p1" appearance="medium">{rfp.buyerName}</Texto>
              <span className={`${styles['deadline-badge']} ${deadlineUrgent ? styles['deadline-badge-urgent'] : ''}`}>
                Due {deadlineDate}
              </span>
              <span className={styles['round-indicator']}>Round {rfp.currentRound}</span>
              <span className={styles['status-tag']} style={{ color: statusColors.color, backgroundColor: statusColors.background }}>
                {STATUS_LABELS[rfp.status]}
              </span>
            </div>

            <div className={styles['header-right']}>
              {rfp.status === 'submitted' && (
                <GraviButton
                  buttonText="Record Result"
                  onClick={handleOpenAdjudication}
                />
              )}
              <GraviButton
                buttonText="Save"
                icon={<SaveOutlined />}
                onClick={handleSave}
                disabled={!state.isDirty}
              />
              {rfp.status !== 'submitted' && rfp.status !== 'won' && rfp.status !== 'lost' && (
                <GraviButton
                  buttonText="Submit Response"
                  icon={<SendOutlined />}
                  theme1
                  onClick={handleSubmit}
                />
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles['workspace-content']}>
          <Tabs
            activeKey={state.activeTab}
            onChange={handleTabChange}
          >
            <TabPane tab="Details & Formulas" key="details">
              <DetailsFormulasTab
                rfp={rfp}
                rfps={state.rfps}
                onDetailUpdate={handleDetailUpdate}
                onDetailsReplace={handleDetailsReplace}
                onOpenSaleFormula={handleOpenSaleFormula}
                onCloseSaleFormula={handleCloseSaleFormula}
                saleFormulaDrawerOpen={state.saleFormulaDrawerOpen}
                activeDetail={activeDetail}
              />
            </TabPane>
            <TabPane tab="Terms" key="terms">
              <TermsTab
                rfp={rfp}
                onTermsUpdate={handleTermsUpdate}
              />
            </TabPane>
            <TabPane tab="Summary & Export" key="summary">
              <SummaryExportTab rfp={rfp} />
            </TabPane>
            <TabPane tab="Analysis" key="analysis">
              <AnalysisTab rfp={rfp} />
            </TabPane>
          </Tabs>
        </div>

        {/* Adjudication Modal */}
        <AdjudicationModal
          visible={state.adjudicationModalOpen}
          rfp={rfp}
          onClose={handleCloseAdjudication}
          onResult={handleAdjudicate}
        />
      </>
    )
  }

  return (
    <div className={styles.page}>
      {state.currentScreen === 'pipeline' ? (
        <>
          <PipelineGrid
            rfps={state.rfps}
            onRFPClick={handleRFPClick}
            onNewRFP={handleOpenEntryPath}
          />

          {/* Entry Path Selection Modal */}
          <EntryPathModal
            visible={state.entryPathModalOpen}
            onClose={handleCloseEntryPath}
            onSelect={handleSelectEntryPath}
          />

          {/* Path 1: Build from Matrix */}
          <IntakeDrawer
            visible={state.intakeDrawerOpen}
            onClose={handleCloseIntake}
            onCreate={handleCreateRFP}
            onDecline={handleDeclineRFP}
            rfps={state.rfps}
          />

          {/* Path 2: Upload Buyer's RFP */}
          <UploadRFPModal
            visible={state.activeEntryPath === 'upload'}
            onClose={handleCloseUpload}
            onCreate={handleCreateRFP}
          />

          {/* Path 3: Copy Previous Response */}
          <CopyResponseModal
            visible={state.activeEntryPath === 'copy'}
            onClose={handleCloseCopy}
            onCreate={handleCreateRFP}
            rfps={state.rfps}
          />

          {/* Path 4: Add Rows Manually */}
          <ManualEntryDrawer
            visible={state.activeEntryPath === 'manual'}
            onClose={handleCloseManual}
            onCreate={handleCreateRFP}
          />
        </>
      ) : (
        renderWorkspace()
      )}
    </div>
  )
}
