/**
 * Import File Modal
 *
 * Multi-stage modal for importing contract details from file.
 * Stage 1: File upload (dropzone)
 * Stage 2: Validation summary
 * Stage 3: Confirm and import
 */

import { useState, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal, Progress } from 'antd'
import {
  InboxOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'

import type { ContractDetail } from '../../types/contract.types'
import styles from './ImportFileModal.module.css'

interface ImportFileModalProps {
  open: boolean
  onClose: () => void
  onImport: (details: ContractDetail[]) => void
  headerDates: { startDate: Date; endDate: Date }
}

type Stage = 'upload' | 'validating' | 'review' | 'importing'

// Mock validation result
interface ValidationResult {
  validCount: number
  errorCount: number
  warnings: string[]
  details: ContractDetail[]
  errors: { row: number; message: string }[]
}

// Simulate file validation
function simulateValidation(headerDates: { startDate: Date; endDate: Date }): Promise<ValidationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock imported data
      const mockDetails: ContractDetail[] = [
        {
          id: `import-${Date.now()}-1`,
          product: 'CBOB',
          location: 'Houston Terminal',
          calendar: 'Contract Calendar',
          startDate: headerDates.startDate,
          endDate: headerDates.endDate,
          effectiveTime: '6:00 PM',
          provisionType: 'Formula',
          quantity: 150000,
          status: 'empty',
        },
        {
          id: `import-${Date.now()}-2`,
          product: 'ULSD',
          location: 'New York Harbor',
          calendar: 'NYX',
          startDate: headerDates.startDate,
          endDate: headerDates.endDate,
          effectiveTime: '6:00 PM',
          provisionType: 'Fixed',
          fixedValue: 2.85,
          quantity: 100000,
          status: 'in-progress',
        },
        {
          id: `import-${Date.now()}-3`,
          product: 'RBOB',
          location: 'Chicago Terminal',
          calendar: 'Rack',
          startDate: headerDates.startDate,
          endDate: headerDates.endDate,
          effectiveTime: '6:00 PM',
          provisionType: 'Formula',
          quantity: 75000,
          status: 'empty',
        },
      ]

      resolve({
        validCount: 3,
        errorCount: 1,
        warnings: ['Row 5: Quantity is empty, defaulting to 0'],
        details: mockDetails,
        errors: [{ row: 4, message: 'Product "XYZ123" not found in product list' }],
      })
    }, 1500)
  })
}

export function ImportFileModal({
  open,
  onClose,
  onImport,
  headerDates,
}: ImportFileModalProps) {
  const [stage, setStage] = useState<Stage>('upload')
  const [file, setFile] = useState<UploadFile | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [progress, setProgress] = useState(0)

  // Reset state on close
  const handleClose = useCallback(() => {
    setStage('upload')
    setFile(null)
    setValidationResult(null)
    setProgress(0)
    onClose()
  }, [onClose])

  // Handle file selection
  const handleFileSelect = useCallback(async () => {
    setFile({ uid: 'mock', name: 'contract_details.xlsx' } as UploadFile)
    setStage('validating')
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 100)

    const result = await simulateValidation(headerDates)

    clearInterval(progressInterval)
    setProgress(100)
    setValidationResult(result)
    setStage('review')
  }, [headerDates])

  // Handle import
  const handleImport = useCallback(() => {
    if (!validationResult) return

    setStage('importing')

    // Simulate import delay
    setTimeout(() => {
      onImport(validationResult.details)
    }, 500)
  }, [validationResult, onImport])

  // Render content based on stage
  const renderContent = () => {
    switch (stage) {
      case 'upload':
        return (
          <div className={styles.dropzone} onClick={handleFileSelect} style={{ cursor: 'pointer' }}>
            <Vertical alignItems='center'>
              <InboxOutlined className={styles.dropzoneIcon} />
              <Texto category='p1' weight='500' className='mb-1'>
                Click to upload file
              </Texto>
              <Texto category='p2' appearance='medium'>
                Simulates importing from .xlsx
              </Texto>
            </Vertical>
          </div>
        )

      case 'validating':
        return (
          <Vertical alignItems='center' className={styles.validating}>
            <FileExcelOutlined className={styles.fileIcon} />
            <Texto category='p1' weight='500' className='mb-2'>
              Validating {file?.name}
            </Texto>
            <Progress percent={progress} status='active' style={{ width: 300 }} />
          </Vertical>
        )

      case 'review':
        return (
          <Vertical gap={16}>
            {/* Summary */}
            <Horizontal gap={24}>
              <Vertical className={styles.summaryCard}>
                <Horizontal gap={8} alignItems='center'>
                  <CheckCircleOutlined style={{ color: 'var(--theme-color-success)', fontSize: 20 }} />
                  <Texto category='h4' weight='600'>
                    {validationResult?.validCount}
                  </Texto>
                </Horizontal>
                <Texto category='p2' appearance='medium'>
                  Valid rows
                </Texto>
              </Vertical>

              <Vertical className={styles.summaryCard}>
                <Horizontal gap={8} alignItems='center'>
                  <ExclamationCircleOutlined style={{ color: 'var(--theme-color-error)', fontSize: 20 }} />
                  <Texto category='h4' weight='600'>
                    {validationResult?.errorCount}
                  </Texto>
                </Horizontal>
                <Texto category='p2' appearance='medium'>
                  Errors (will be skipped)
                </Texto>
              </Vertical>
            </Horizontal>

            {/* Errors */}
            {validationResult && validationResult.errors.length > 0 && (
              <Vertical>
                <Texto category='p2' weight='500' className='mb-1'>
                  Errors
                </Texto>
                <Vertical className={styles.errorList}>
                  {validationResult.errors.map((error, index) => (
                    <Texto key={index} category='p2' appearance='error'>
                      Row {error.row}: {error.message}
                    </Texto>
                  ))}
                </Vertical>
              </Vertical>
            )}

            {/* Warnings */}
            {validationResult && validationResult.warnings.length > 0 && (
              <Vertical>
                <Texto category='p2' weight='500' className='mb-1'>
                  Warnings
                </Texto>
                <Vertical className={styles.warningList}>
                  {validationResult.warnings.map((warning, index) => (
                    <Texto key={index} category='p2' appearance='warning'>
                      {warning}
                    </Texto>
                  ))}
                </Vertical>
              </Vertical>
            )}
          </Vertical>
        )

      case 'importing':
        return (
          <Vertical alignItems='center' className={styles.validating}>
            <UploadOutlined className={styles.fileIcon} style={{ animation: 'pulse 1s infinite' }} />
            <Texto category='p1' weight='500'>
              Importing {validationResult?.validCount} rows...
            </Texto>
          </Vertical>
        )
    }
  }

  // Footer based on stage
  const renderFooter = () => {
    if (stage === 'upload' || stage === 'validating' || stage === 'importing') {
      return (
        <Horizontal justifyContent='flex-end'>
          <GraviButton buttonText='Cancel' onClick={handleClose} />
        </Horizontal>
      )
    }

    return (
      <Horizontal justifyContent='space-between' alignItems='center'>
        <GraviButton buttonText='Back' onClick={() => setStage('upload')} />
        <Horizontal gap={8}>
          <GraviButton buttonText='Cancel' onClick={handleClose} />
          <GraviButton
            buttonText={`Import ${validationResult?.validCount} Rows`}
            theme1
            icon={<UploadOutlined />}
            onClick={handleImport}
            disabled={(validationResult?.validCount ?? 0) === 0}
          />
        </Horizontal>
      </Horizontal>
    )
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title='Import from File'
      footer={renderFooter()}
      width={500}
    >
      {renderContent()}
    </Modal>
  )
}
