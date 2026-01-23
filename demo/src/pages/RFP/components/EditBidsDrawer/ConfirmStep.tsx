/**
 * Confirm Step
 *
 * Step 4 of the Edit Bids wizard
 * Final confirmation before applying changes
 */

import { useState } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Alert, Spin } from 'antd'
import type { BidChange, DetailRowExtended } from '../../rfp.types'
import { calculateChangeSummary } from '../../utils/bidValidation'
import styles from './EditBidsDrawer.module.css'

interface ConfirmStepProps {
  changes: BidChange[]
  updatedDetails: DetailRowExtended[]
  onApply: (details: DetailRowExtended[], changes: BidChange[]) => void
  onBack: () => void
}

export function ConfirmStep({ changes, updatedDetails, onApply, onBack }: ConfirmStepProps) {
  const [isApplying, setIsApplying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const summary = calculateChangeSummary(changes)

  const handleApply = async () => {
    setIsApplying(true)

    // Simulate processing delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsApplying(false)
    setIsComplete(true)

    // Wait a moment to show success, then call onApply
    setTimeout(() => {
      onApply(updatedDetails, changes)
    }, 1500)
  }

  if (isComplete) {
    return (
      <Vertical className={styles.stepContent} alignItems='center' style={{ padding: '48px' }}>
        <CheckCircleOutlined
          style={{ fontSize: '64px', color: 'var(--theme-success-color)', marginBottom: '24px' }}
        />
        <Texto category='h3' weight='600' className='mb-2'>
          Changes Applied Successfully
        </Texto>
        <Texto category='p1' appearance='medium'>
          {summary.totalChanges} change(s) have been applied to the bid data.
        </Texto>
      </Vertical>
    )
  }

  if (isApplying) {
    return (
      <Vertical className={styles.stepContent} alignItems='center' style={{ padding: '48px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <Texto category='h4' weight='600' className='mt-4'>
          Applying Changes...
        </Texto>
        <Texto category='p1' appearance='medium'>
          Updating bid data and recalculating metrics
        </Texto>
      </Vertical>
    )
  }

  return (
    <Vertical className={styles.stepContent}>
      <Texto category='h4' weight='600' className='mb-2'>
        Step 4: Apply Changes
      </Texto>

      <Texto category='p1' appearance='medium' className='mb-4'>
        You are about to apply the following changes to the bid data. This action will update the
        supplier comparison view.
      </Texto>

      <Alert
        type='info'
        showIcon
        message='Summary of Changes'
        description={
          <Vertical style={{ gap: '8px' }}>
            <Horizontal style={{ gap: '24px' }}>
              <Texto category='p2'>
                <strong>{summary.totalChanges}</strong> total changes
              </Texto>
              <Texto category='p2'>
                <strong>{summary.priceChanges}</strong> price changes
              </Texto>
              <Texto category='p2'>
                <strong>{summary.formulaChanges}</strong> formula changes
              </Texto>
            </Horizontal>
            <Texto category='p2'>
              Affecting <strong>{summary.suppliersAffected}</strong> supplier(s)
            </Texto>
            {summary.avgPriceChange !== 0 && (
              <Texto category='p2'>
                Average price change:{' '}
                <strong>
                  {summary.avgPriceChange >= 0 ? '+' : ''}
                  {(summary.avgPriceChange * 100).toFixed(1)}¢
                </strong>
              </Texto>
            )}
          </Vertical>
        }
        className='mb-4'
      />

      <Alert
        type='warning'
        showIcon
        message='What will happen'
        description={
          <Vertical style={{ gap: '4px' }}>
            <Texto category='p2'>1. Bid prices will be updated in the comparison grid</Texto>
            <Texto category='p2'>2. Supplier rankings may change based on new prices</Texto>
            <Texto category='p2'>3. Metrics will be recalculated (avg price, score, etc.)</Texto>
            <Texto category='p2'>4. This action can be repeated with a new upload if needed</Texto>
          </Vertical>
        }
        className='mb-4'
      />

      <Horizontal justifyContent='space-between' className='mt-4'>
        <GraviButton buttonText='Back to Review' type='text' onClick={onBack} />
        <GraviButton buttonText='Apply Changes' success onClick={handleApply} />
      </Horizontal>
    </Vertical>
  )
}
