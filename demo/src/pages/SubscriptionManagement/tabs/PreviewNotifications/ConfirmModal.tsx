// Confirm Modal - Confirmation dialog before sending notifications

import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { NotificationMethod, PreviewMode, PriceNotification } from './types'

interface ConfirmModalProps {
  isShowingConfirmModal: boolean
  setIsShowingConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
  sendNotifications: () => void
  selectedQuoteConfigs: PriceNotification[]
  mode: PreviewMode
  notificationMethod: NotificationMethod | null
  isSending: boolean
}

export function ConfirmModal({
  isShowingConfirmModal,
  setIsShowingConfirmModal,
  sendNotifications,
  selectedQuoteConfigs,
  mode,
  notificationMethod,
  isSending,
}: ConfirmModalProps) {
  const hasMissingPrices = useMemo(
    () => selectedQuoteConfigs?.some((quote) => !quote.Price),
    [selectedQuoteConfigs]
  )

  const hasNoCustomers = useMemo(
    () => selectedQuoteConfigs?.some((quote) => !quote.CustomerCount),
    [selectedQuoteConfigs]
  )

  const totalCustomerCount = useMemo(
    () => selectedQuoteConfigs?.reduce((acc, curr) => acc + (curr.CustomerCount || 0), 0) || 0,
    [selectedQuoteConfigs]
  )

  const effectiveDateTime = useMemo(() => {
    const now = dayjs()
    return mode === 'EndOfDay'
      ? now.hour(18).minute(0).second(0).format('MMM D, YYYY h:mm A')
      : now.format('MMM D, YYYY h:mm A')
  }, [mode])

  const getModeDisplayName = (m: PreviewMode): string => {
    switch (m) {
      case 'EndOfDay':
        return 'End of Day'
      case 'IntraDay':
        return 'Midday'
      case 'EndOfDayCurrentPeriod':
        return 'Current Period'
      default:
        return m
    }
  }

  const getMethodDisplayName = (method: NotificationMethod | null): string => {
    switch (method) {
      case 'DTN':
        return 'DTN Message'
      case 'Email':
        return 'Emails'
      case 'Both':
        return 'DTN Message & Emails'
      default:
        return 'Unknown'
    }
  }

  return (
    <Modal
      title='Confirm Price Notification'
      open={isShowingConfirmModal}
      onCancel={() => setIsShowingConfirmModal(false)}
      footer={
        <Horizontal gap={8} justifyContent='flex-end' alignItems='center'>
          <GraviButton
            disabled={isSending}
            buttonText='Cancel'
            onClick={() => setIsShowingConfirmModal(false)}
          />
          <GraviButton
            disabled={isSending}
            buttonText='Confirm & Send'
            success
            onClick={sendNotifications}
            loading={isSending}
          />
        </Horizontal>
      }
    >
      <Vertical alignItems='center' className='p-2'>
        <Horizontal alignItems='center' className='mb-2'>
          <Texto>
            You are about to send price notifications for {selectedQuoteConfigs?.length.toLocaleString()}{' '}
            {selectedQuoteConfigs.length > 1 ? 'prices' : 'price'} to customers.
          </Texto>
        </Horizontal>

        {(hasMissingPrices || hasNoCustomers) && (
          <Vertical className='p-2 mb-2 notification-issues-detected'>
            <Texto appearance='error'>Warning: Issues Detected in Selected Prices</Texto>
            {hasNoCustomers && <Texto appearance='error'>• Some prices have zero customer count</Texto>}
            {hasMissingPrices && <Texto appearance='error'>• Some prices have missing (M) values</Texto>}
            <Texto appearance='error'>
              These issues may result in customers not receiving expected notifications.
            </Texto>
          </Vertical>
        )}

        <Vertical className='mt-2'>
          <Texto category='h5'>Notification Summary</Texto>
          <Texto>• Method: {getMethodDisplayName(notificationMethod)}</Texto>
          <Texto>• Mode: {getModeDisplayName(mode)}</Texto>
          <Texto>• Total Prices: {selectedQuoteConfigs?.length.toLocaleString()}</Texto>
          <Texto>• Effective Date: {effectiveDateTime}</Texto>
          <Texto>• Total Customer Count: {totalCustomerCount.toLocaleString()}</Texto>
        </Vertical>
      </Vertical>
    </Modal>
  )
}
