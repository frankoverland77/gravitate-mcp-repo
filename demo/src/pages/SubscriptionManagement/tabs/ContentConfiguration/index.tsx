// Content Configuration Tab - Main component
// Allows users to set up default content configuration for each quote configuration

import { GraviGrid, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import { useMemo, useState } from 'react'

import { getColumnDefs } from './columnDefs'
import { ContentDetailPanel } from './ContentDetailPanel'
import { CopyConfigModal } from './CopyConfigModal'
import { EditConfigModal } from './EditConfigModal'
import { mockContentConfigurations } from './mockData'
import { PreviewEmailModal } from './PreviewEmailModal'
import { ContentConfiguration } from './types'

export function ContentConfigurationTab() {
  const [rowData, setRowData] = useState<ContentConfiguration[]>(mockContentConfigurations)
  const [editingConfig, setEditingConfig] = useState<ContentConfiguration | null>(null)
  const [copyingConfig, setCopyingConfig] = useState<ContentConfiguration | null>(null)
  const [previewingConfig, setPreviewingConfig] = useState<ContentConfiguration | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const formatLastSaved = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const storageKey = 'SubscriptionManagement/ContentConfigurationTab'

  const handlePreview = (config: ContentConfiguration) => {
    setPreviewingConfig(config)
  }

  const handleEdit = (config: ContentConfiguration) => {
    setEditingConfig(config)
  }

  const handleSaveEdit = (updatedConfig: ContentConfiguration) => {
    setRowData((prev) =>
      prev.map((row) => (row.QuoteConfigId === updatedConfig.QuoteConfigId ? updatedConfig : row))
    )
    setLastSaved(new Date())
    NotificationMessage('Success', 'Content configuration updated successfully', false)
  }

  const handleCopy = (config: ContentConfiguration) => {
    setCopyingConfig(config)
  }

  const handleCopyConfirm = (sourceId: number, targetId: number) => {
    const sourceConfig = rowData.find((c) => c.QuoteConfigId === sourceId)
    if (sourceConfig) {
      setRowData((prev) =>
        prev.map((row) =>
          row.QuoteConfigId === targetId
            ? {
                ...row,
                EmailSubject: sourceConfig.EmailSubject,
                EmailBody: sourceConfig.EmailBody,
                LastModified: new Date().toISOString(),
                ModifiedBy: 'Current User',
              }
            : row
        )
      )
      setLastSaved(new Date())
      NotificationMessage('Success', 'Configuration copied successfully', false)
    }
  }

  const handleReset = (config: ContentConfiguration) => {
    Modal.confirm({
      title: 'Reset to Default',
      content: `Are you sure you want to reset the content configuration for "${config.QuoteConfigName}" to default values?`,
      okText: 'Reset',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setRowData((prev) =>
          prev.map((row) =>
            row.QuoteConfigId === config.QuoteConfigId
              ? {
                  ...row,
                  EmailSubject: 'Delivered Price Notification Effective From {EffectiveDate}',
                  EmailBody: 'Dear Customer,\n\nPlease be advised of the posted price changes below:\n\n{Table}\n\nThank you for your business.',
                  LastModified: new Date().toISOString(),
                  ModifiedBy: 'Current User',
                }
              : row
          )
        )
        setLastSaved(new Date())
        NotificationMessage('Success', 'Configuration reset to default', false)
      },
    })
  }

  const columnDefs = useMemo(() => getColumnDefs(), [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: { data: ContentConfiguration }) => String(row?.data?.QuoteConfigId),
      masterDetail: true,
      detailCellRenderer: (params: { data: ContentConfiguration }) => (
        <ContentDetailPanel
          data={params.data}
          onEdit={handleEdit}
          onCopy={handleCopy}
          onReset={handleReset}
          onPreview={handlePreview}
        />
      ),
      detailRowHeight: 320,
    }),
    []
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Content Configuration',
      hideActiveFilters: false,
      actionButtons: lastSaved ? (
        <Horizontal alignItems='center' style={{ gap: '8px' }}>
          <Texto category='p2' style={{ color: 'var(--theme-success)' }}>
            Last Saved: {formatLastSaved(lastSaved)}
          </Texto>
        </Horizontal>
      ) : null,
    }),
    [lastSaved]
  )

  return (
    <Vertical height='100%' className='content-configuration-container'>
      <GraviGrid
        rowData={rowData}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        storageKey={storageKey}
      />
      <EditConfigModal
        visible={editingConfig !== null}
        config={editingConfig}
        onClose={() => setEditingConfig(null)}
        onSave={handleSaveEdit}
      />
      <CopyConfigModal
        visible={copyingConfig !== null}
        targetConfig={copyingConfig}
        allConfigs={rowData}
        onClose={() => setCopyingConfig(null)}
        onCopy={handleCopyConfirm}
      />
      <PreviewEmailModal
        visible={previewingConfig !== null}
        config={previewingConfig}
        onClose={() => setPreviewingConfig(null)}
      />
    </Vertical>
  )
}
