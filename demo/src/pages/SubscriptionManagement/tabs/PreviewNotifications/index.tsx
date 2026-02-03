// Preview Notifications Tab - Main component
// Based on Gravitate ManagePriceNotifications module patterns

import { GraviGrid, NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './columnDefs'
import { ConfirmModal } from './ConfirmModal'
import { mockPriceNotifications } from './mockData'
import { PreviewActionButtons } from './PreviewActionButtons'
import { NotificationMethodModal } from './NotificationMethodModal'
import { NotificationMethod, PreviewMode, PriceNotification } from './types'

export function PreviewNotificationsTab() {
  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const [selectedRows, setSelectedRows] = useState<PriceNotification[]>([])
  const [isShowingMethodModal, setIsShowingMethodModal] = useState(false)
  const [isShowingConfirmModal, setIsShowingConfirmModal] = useState(false)
  const [notificationMethod, setNotificationMethod] = useState<NotificationMethod | null>(null)
  const [mode, setMode] = useState<PreviewMode>('EndOfDay')
  const [isSending, setIsSending] = useState(false)
  const [rowData, setRowData] = useState<PriceNotification[]>(mockPriceNotifications)

  const storageKey = 'SubscriptionManagement/PreviewNotificationsTab'

  const onSelectionChanged = (e: { api: GridApi }) => {
    const currentSelection = e.api.getSelectedRows() as PriceNotification[]
    setSelectedRows(currentSelection)
  }

  const handleNotifyClick = () => {
    setIsShowingMethodModal(true)
  }

  const handleMethodSelect = (method: NotificationMethod) => {
    setNotificationMethod(method)
    setIsShowingMethodModal(false)
    setIsShowingConfirmModal(true)
  }

  const handleSendNotifications = async () => {
    setIsSending(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the sent status for selected rows based on notification method
      const sentIds = new Set(selectedRows.map((r) => r.QuoteConfigurationMappingId))
      setRowData((prev) =>
        prev.map((row) => {
          if (!sentIds.has(row.QuoteConfigurationMappingId)) return row

          const updates: Partial<PriceNotification> = {
            LastNotificationTime: new Date().toISOString(),
          }

          if (notificationMethod === 'DTN') {
            updates.DTNSent = true
          } else if (notificationMethod === 'Email') {
            updates.EmailSent = true
          } else if (notificationMethod === 'Both') {
            updates.DTNSent = true
            updates.EmailSent = true
            updates.HasBeenSent = true
          }

          // Update HasBeenSent if both DTN and Email are now sent
          const newDTNSent = updates.DTNSent ?? row.DTNSent
          const newEmailSent = updates.EmailSent ?? row.EmailSent
          if (newDTNSent && newEmailSent) {
            updates.HasBeenSent = true
          }

          return { ...row, ...updates }
        })
      )

      // Deselect all rows after successful notification
      gridAPIRef.current?.deselectAll()
      setSelectedRows([])

      const methodName = notificationMethod === 'DTN' ? 'DTN Message' : notificationMethod === 'Email' ? 'Email' : 'DTN Message & Email'
      NotificationMessage('Success', `Successfully sent ${selectedRows.length} ${methodName} notifications`, false)
    } catch (error) {
      console.error('Error sending notifications:', error)
      NotificationMessage('Error', 'Failed to send notifications', true)
    } finally {
      setIsShowingConfirmModal(false)
      setIsSending(false)
      setNotificationMethod(null)
    }
  }

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: { data: PriceNotification }) => String(row?.data?.QuoteConfigurationMappingId),
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      suppressDragLeaveHidesColumns: true,
      isRowSelectable: (row: { data: PriceNotification }) => row.data?.QuotedValueId !== null,
    }),
    []
  )

  const columnDefs = useMemo(() => getColumnDefs(), [])

  const controlBarProps = useMemo(
    () => ({
      title: 'Price Notifications Preview',
      showSelectedCount: true,
      hideActiveFilters: false,
      actionButtons: (
        <PreviewActionButtons
          selectedRows={selectedRows}
          onNotifyClick={handleNotifyClick}
          setMode={setMode}
          mode={mode}
        />
      ),
    }),
    [selectedRows, mode]
  )

  return (
    <Vertical height='100%' className='preview-notifications-container'>
      <GraviGrid
        rowData={rowData}
        externalRef={gridAPIRef}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        storageKey={storageKey}
        onSelectionChanged={onSelectionChanged}
      />
      <NotificationMethodModal
        visible={isShowingMethodModal}
        onClose={() => setIsShowingMethodModal(false)}
        onSelect={handleMethodSelect}
        selectedCount={selectedRows.length}
      />
      <ConfirmModal
        isShowingConfirmModal={isShowingConfirmModal}
        setIsShowingConfirmModal={setIsShowingConfirmModal}
        sendNotifications={handleSendNotifications}
        selectedQuoteConfigs={selectedRows}
        mode={mode}
        notificationMethod={notificationMethod}
        isSending={isSending}
      />
    </Vertical>
  )
}
