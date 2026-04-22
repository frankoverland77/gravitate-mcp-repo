/**
 * Download Step
 *
 * Step 1 of the Edit Bids wizard
 * Generates and downloads Excel template with current bid data
 */

import { useState } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import type { RFP, Supplier, DetailRowExtended } from '../../rfp.types'
import { exportBidsToExcel } from '../../utils/excelExport'
import styles from './EditBidsDrawer.module.css'

interface DownloadStepProps {
  rfp: RFP
  round: number
  suppliers: Supplier[]
  details: DetailRowExtended[]
  onNext: () => void
}

export function DownloadStep({ rfp, round, suppliers, details, onNext }: DownloadStepProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Small delay for UX feedback
      await new Promise((resolve) => setTimeout(resolve, 500))
      exportBidsToExcel(rfp, round, suppliers, details)
      setHasDownloaded(true)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Vertical className={styles.stepContent} height="auto">
      <Texto category='h4' weight='600' className='mb-2'>
        Step 1: Download Current Bids
      </Texto>

      <Texto category='p1' appearance='medium' className='mb-4'>
        Download an Excel file containing the current bid data. Edit the formulas and prices in Excel,
        then upload the modified file in the next step.
      </Texto>

      <Alert
        type='info'
        showIcon
        message='Excel File Structure'
        description={
          <Vertical gap={4}>
            <Texto category='p2'>
              <strong>Sheet 1 - Bid Summary:</strong> Read-only overview of all bids
            </Texto>
            <Texto category='p2'>
              <strong>Sheet 2 - Bid Details:</strong> Edit provision types and fixed values
            </Texto>
            <Texto category='p2'>
              <strong>Sheet 3 - Formula Components:</strong> Edit formula variable configurations
            </Texto>
            <Texto category='p2'>
              <strong>Sheet 4 - Reference Data:</strong> Valid options for dropdowns
            </Texto>
          </Vertical>
        }
        className='mb-4'
      />

      <Horizontal gap={16} className='mb-4'>
        <div className={styles.statCard}>
          <Texto category='h3' weight='600'>
            {suppliers.length}
          </Texto>
          <Texto category='p2' appearance='medium'>
            Suppliers
          </Texto>
        </div>
        <div className={styles.statCard}>
          <Texto category='h3' weight='600'>
            {details.length}
          </Texto>
          <Texto category='p2' appearance='medium'>
            Product/Locations
          </Texto>
        </div>
        <div className={styles.statCard}>
          <Texto category='h3' weight='600'>
            {suppliers.length * details.length}
          </Texto>
          <Texto category='p2' appearance='medium'>
            Total Bids
          </Texto>
        </div>
      </Horizontal>

      <Horizontal gap={16} alignItems='center'>
        <GraviButton
          buttonText={isDownloading ? 'Generating...' : 'Download Excel'}
          icon={isDownloading ? undefined : <DownloadOutlined />}
          theme1
          onClick={handleDownload}
          disabled={isDownloading}
        />

        {hasDownloaded && (
          <Horizontal gap={8} alignItems='center'>
            <FileExcelOutlined style={{ color: 'var(--theme-success-color)' }} />
            <Texto category='p2' appearance='medium'>
              File downloaded! Edit in Excel then continue.
            </Texto>
          </Horizontal>
        )}
      </Horizontal>

      {hasDownloaded && (
        <Horizontal justifyContent='flex-end' className='mt-4'>
          <GraviButton buttonText='Continue to Upload' success onClick={onNext} />
        </Horizontal>
      )}
    </Vertical>
  )
}
