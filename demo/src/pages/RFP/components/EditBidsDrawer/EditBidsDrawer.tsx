/**
 * Edit Bids Drawer
 *
 * Main container for the Excel-based bid editing workflow
 * 4-step wizard: Download → Upload → Validate → Confirm
 */

import { useState, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CloseOutlined } from '@ant-design/icons'
import { Drawer, Steps } from 'antd'
import type { RFP, Supplier, DetailRowExtended, BidValidationResult, BidChange } from '../../rfp.types'
import type { ParseResult } from '../../utils/excelImport'
import { matchUploadedBids } from '../../utils/excelImport'
import { validateBidsComplete } from '../../utils/bidValidation'
import { SAMPLE_MARKET_PRICES } from '../../rfp.data'
import { DownloadStep } from './DownloadStep'
import { UploadStep } from './UploadStep'
import { ValidationStep } from './ValidationStep'
import { ConfirmStep } from './ConfirmStep'
import styles from './EditBidsDrawer.module.css'

const { Step } = Steps

type WizardStep = 'download' | 'upload' | 'validate' | 'confirm'

interface EditBidsDrawerProps {
  visible: boolean
  onClose: () => void
  rfp: RFP | null
  round: number
  suppliers: Supplier[]
  details: DetailRowExtended[]
  onSave: (updatedDetails: DetailRowExtended[], changes: BidChange[]) => void
}

export function EditBidsDrawer({
  visible,
  onClose,
  rfp,
  round,
  suppliers,
  details,
  onSave,
}: EditBidsDrawerProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('download')
  const [validationResult, setValidationResult] = useState<BidValidationResult | null>(null)
  const [updatedDetails, setUpdatedDetails] = useState<DetailRowExtended[]>([])

  // Step index for Steps component
  const stepIndex = {
    download: 0,
    upload: 1,
    validate: 2,
    confirm: 3,
  }[currentStep]

  // Reset wizard when drawer closes
  const handleClose = useCallback(() => {
    setCurrentStep('download')
    setValidationResult(null)
    setUpdatedDetails([])
    onClose()
  }, [onClose])

  // Step transitions
  const handleDownloadComplete = useCallback(() => {
    setCurrentStep('upload')
  }, [])

  const handleUploadComplete = useCallback(
    (result: ParseResult) => {
      // Match uploaded data to existing details
      const matchResult = matchUploadedBids(result, details, SAMPLE_MARKET_PRICES)
      setUpdatedDetails(matchResult.updatedDetails)

      // Run full validation
      const validation = validateBidsComplete(result, matchResult.changes, details, suppliers)
      setValidationResult(validation)

      setCurrentStep('validate')
    },
    [details, suppliers]
  )

  const handleValidationComplete = useCallback(() => {
    setCurrentStep('confirm')
  }, [])

  const handleApplyChanges = useCallback(
    (finalDetails: DetailRowExtended[], changes: BidChange[]) => {
      onSave(finalDetails, changes)
      handleClose()
    },
    [onSave, handleClose]
  )

  const handleBackToDownload = useCallback(() => {
    setCurrentStep('download')
  }, [])

  const handleBackToUpload = useCallback(() => {
    setCurrentStep('upload')
  }, [])

  const handleBackToValidation = useCallback(() => {
    setCurrentStep('validate')
  }, [])

  // Don't render if no RFP
  if (!rfp) return null

  return (
    <Drawer
      open={visible}
      onClose={handleClose}
      placement='bottom'
      height='80vh'
      title={null}
      closable={false}
      className={styles.drawer}
      styles={{ body: { padding: 0 } }}
    >
      <Vertical height='100%'>
        {/* Header */}
        <Horizontal
          justifyContent='space-between'
          alignItems='center'
          className={styles.drawerHeader}
        >
          <Vertical>
            <Texto category='h3' weight='600'>
              Edit Bids - Round {round}
            </Texto>
            <Texto category='p2' appearance='medium'>
              {rfp.name}
            </Texto>
          </Vertical>
          <GraviButton
            type='text'
            icon={<CloseOutlined />}
            onClick={handleClose}
            style={{ padding: '8px' }}
          />
        </Horizontal>

        {/* Steps indicator */}
        <div className={styles.stepsWrapper}>
          <Steps current={stepIndex} size='small'>
            <Step title='Download' description='Get Excel file' />
            <Step title='Upload' description='Upload modified file' />
            <Step title='Validate' description='Review changes' />
            <Step title='Apply' description='Confirm changes' />
          </Steps>
        </div>

        {/* Step content */}
        <div className={styles.stepContainer}>
          {currentStep === 'download' && (
            <DownloadStep
              rfp={rfp}
              round={round}
              suppliers={suppliers}
              details={details}
              onNext={handleDownloadComplete}
            />
          )}

          {currentStep === 'upload' && (
            <UploadStep onParsed={handleUploadComplete} onBack={handleBackToDownload} />
          )}

          {currentStep === 'validate' && validationResult && (
            <ValidationStep
              validationResult={validationResult}
              onConfirm={handleValidationComplete}
              onBack={handleBackToUpload}
            />
          )}

          {currentStep === 'confirm' && validationResult && (
            <ConfirmStep
              changes={validationResult.changes}
              updatedDetails={updatedDetails}
              onApply={handleApplyChanges}
              onBack={handleBackToValidation}
            />
          )}
        </div>
      </Vertical>
    </Drawer>
  )
}
