// Preview Notifications Tab - Main component
// Based on Gravitate ManagePriceNotifications module patterns

import { GraviGrid, NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './columnDefs'
import { ConfirmModal } from './ConfirmModal'
import { mockPriceNotifications } from './mockData'
import { PreviewActionButtons } from './PreviewActionButtons'
import { PreviewMode, PriceNotification } from './types'

export function PreviewNotificationsTab() {
  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const [selectedRows, setSelectedRows] = useState<PriceNotification[]>([])
  const [isShowingConfirmModal, setIsShowingConfirmModal] = useState(false)
  const [mode, setMode] = useState<PreviewMode>('EndOfDay')
  const [isSending, setIsSending] = useState(false)
  const [rowData, setRowData] = useState<PriceNotification[]>(mockPriceNotifications)

  const storageKey = 'SubscriptionManagement/PreviewNotificationsTab'

  const onSelectionChanged = (e: { api: GridApi }) => {
    const currentSelection = e.api.getSelectedRows() as PriceNotification[]
    setSelectedRows(currentSelection)
  }

  const handleSendNotifications = async () => {
    setIsSending(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the sent status for selected rows
      const sentIds = new Set(selectedRows.map((r) => r.QuoteConfigurationMappingId))
      setRowData((prev) =>
        prev.map((row) =>
          sentIds.has(row.QuoteConfigurationMappingId)
            ? { ...row, HasBeenSent: true, LastNotificationTime: new Date().toISOString() }
            : row
        )
      )

      // Deselect all rows after successful notification
      gridAPIRef.current?.deselectAll()
      setSelectedRows([])

      NotificationMessage('Success', `Successfully sent ${selectedRows.length} notifications`, false)
    } catch (error) {
      console.error('Error sending notifications:', error)
      NotificationMessage('Error', 'Failed to send notifications', true)
    } finally {
      setIsShowingConfirmModal(false)
      setIsSending(false)
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
          setIsShowingConfirmModal={setIsShowingConfirmModal}
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
      <ConfirmModal
        isShowingConfirmModal={isShowingConfirmModal}
        setIsShowingConfirmModal={setIsShowingConfirmModal}
        sendNotifications={handleSendNotifications}
        selectedQuoteConfigs={selectedRows}
        mode={mode}
        isSending={isSending}
      />
    </Vertical>
  )
}
