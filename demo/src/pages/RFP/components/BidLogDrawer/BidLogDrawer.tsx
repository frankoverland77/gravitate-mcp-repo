/**
 * Bid Log Drawer
 *
 * Shows chronological history of bid edits with revert capability.
 * Displays both inline edits and bulk uploads with filtering.
 */

import { useState, useMemo, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CloseOutlined } from '@ant-design/icons'
import { Drawer, Tabs, Empty, Modal } from 'antd'
import type { BidEdit, BidEditFilter } from '../../rfp.types'
import { HistoryEntry } from './HistoryEntry'
import styles from './BidLogDrawer.module.css'


interface BidLogDrawerProps {
  visible: boolean
  onClose: () => void
  bidEdits: BidEdit[]
  onRevert: (editId: string) => void
}

interface BulkUploadGroup {
  bulkUploadId: string
  filename: string
  timestamp: Date
  userName: string
  edits: BidEdit[]
  isExpanded: boolean
}

export function BidLogDrawer({ visible, onClose, bidEdits, onRevert }: BidLogDrawerProps) {
  const [filter, setFilter] = useState<BidEditFilter>('all')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [cascadeWarning, setCascadeWarning] = useState<{
    editId: string
    laterEditsCount: number
  } | null>(null)

  // Filter edits based on selected tab
  const filteredEdits = useMemo(() => {
    if (filter === 'all') return bidEdits
    return bidEdits.filter((edit) => edit.source === filter)
  }, [bidEdits, filter])

  // Group bulk uploads together, keep inline edits separate
  const groupedEntries = useMemo(() => {
    const inlineEdits: BidEdit[] = []
    const bulkGroups = new Map<string, BulkUploadGroup>()

    filteredEdits.forEach((edit) => {
      if (edit.source === 'inline') {
        inlineEdits.push(edit)
      } else if (edit.bulkUploadId) {
        const existing = bulkGroups.get(edit.bulkUploadId)
        if (existing) {
          existing.edits.push(edit)
        } else {
          bulkGroups.set(edit.bulkUploadId, {
            bulkUploadId: edit.bulkUploadId,
            filename: edit.bulkUploadFilename || 'Unknown file',
            timestamp: edit.timestamp,
            userName: edit.userName,
            edits: [edit],
            isExpanded: expandedGroups.has(edit.bulkUploadId),
          })
        }
      }
    })

    // Combine and sort by timestamp (newest first)
    const allEntries: Array<{ type: 'inline'; edit: BidEdit } | { type: 'bulk'; group: BulkUploadGroup }> = []

    inlineEdits.forEach((edit) => allEntries.push({ type: 'inline', edit }))
    bulkGroups.forEach((group) => allEntries.push({ type: 'bulk', group }))

    allEntries.sort((a, b) => {
      const aTime = a.type === 'inline' ? a.edit.timestamp : a.group.timestamp
      const bTime = b.type === 'inline' ? b.edit.timestamp : b.group.timestamp
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    })

    return allEntries
  }, [filteredEdits, expandedGroups])

  // Toggle bulk group expansion
  const handleToggleGroup = useCallback((bulkUploadId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(bulkUploadId)) {
        next.delete(bulkUploadId)
      } else {
        next.add(bulkUploadId)
      }
      return next
    })
  }, [])

  // Check for cascade before reverting
  const handleRevertClick = useCallback(
    (editId: string) => {
      const editIndex = bidEdits.findIndex((e) => e.id === editId)
      if (editIndex === -1) return

      const edit = bidEdits[editIndex]

      // Check for later edits on the same cell
      const laterEdits = bidEdits.slice(0, editIndex).filter((e) => e.cellKey === edit.cellKey && !e.isReverted)

      if (laterEdits.length > 0) {
        // Show cascade warning
        setCascadeWarning({
          editId,
          laterEditsCount: laterEdits.length,
        })
      } else {
        // No cascade, revert directly
        onRevert(editId)
      }
    },
    [bidEdits, onRevert]
  )

  // Confirm cascade revert
  const handleConfirmCascadeRevert = useCallback(() => {
    if (cascadeWarning) {
      onRevert(cascadeWarning.editId)
      setCascadeWarning(null)
    }
  }, [cascadeWarning, onRevert])

  // Count active (non-reverted) edits
  const activeEditCount = useMemo(() => {
    return bidEdits.filter((e) => !e.isReverted).length
  }, [bidEdits])

  return (
    <>
      <Drawer
        open={visible}
        onClose={onClose}
        placement='right'
        width={420}
        title={null}
        closable={false}
        className={styles.drawer}
        styles={{ body: { padding: 0 } }}
      >
        <Vertical height='100%'>
          {/* Header */}
          <Horizontal justifyContent='space-between' alignItems='center' className={styles.drawerHeader}>
            <Vertical>
              <Texto category='h4' weight='600'>
                Bid Log
              </Texto>
              <Texto category='p2' appearance='medium'>
                {activeEditCount} active edit{activeEditCount !== 1 ? 's' : ''}
              </Texto>
            </Vertical>
            <GraviButton type='text' icon={<CloseOutlined />} onClick={onClose} style={{ padding: '8px' }} />
          </Horizontal>

          {/* Filter tabs */}
          <div className={styles.tabsWrapper}>
            <Tabs activeKey={filter} onChange={(key) => setFilter(key as BidEditFilter)} size='small' items={[
              { key: 'all', label: 'All' },
              { key: 'inline', label: 'Inline' },
              { key: 'bulk-upload', label: 'Bulk Upload' },
            ]} />
          </div>

          {/* Entry list */}
          <div className={styles.entryList}>
            {groupedEntries.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Texto appearance='medium'>No bid edits yet. Changes will appear here when you edit cells.</Texto>
                }
              />
            ) : (
              groupedEntries.map((entry) => {
                if (entry.type === 'inline') {
                  return (
                    <HistoryEntry
                      key={entry.edit.id}
                      edit={entry.edit}
                      onRevert={() => handleRevertClick(entry.edit.id)}
                    />
                  )
                } else {
                  return (
                    <div key={entry.group.bulkUploadId} className={styles.bulkGroup}>
                      <Horizontal
                        justifyContent='space-between'
                        alignItems='center'
                        className={styles.bulkGroupHeader}
                        onClick={() => handleToggleGroup(entry.group.bulkUploadId)}
                      >
                        <Vertical>
                          <Texto weight='600'>{entry.group.filename}</Texto>
                          <Texto category='p2' appearance='medium'>
                            {entry.group.edits.length} change{entry.group.edits.length !== 1 ? 's' : ''} by{' '}
                            {entry.group.userName}
                          </Texto>
                        </Vertical>
                        <Texto category='p2' appearance='medium'>
                          {expandedGroups.has(entry.group.bulkUploadId) ? '▼' : '▶'}
                        </Texto>
                      </Horizontal>
                      {expandedGroups.has(entry.group.bulkUploadId) && (
                        <div className={styles.bulkGroupContent}>
                          {entry.group.edits.map((edit) => (
                            <HistoryEntry
                              key={edit.id}
                              edit={edit}
                              onRevert={() => handleRevertClick(edit.id)}
                              compact
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
              })
            )}
          </div>
        </Vertical>
      </Drawer>

      {/* Cascade warning modal */}
      <Modal
        open={cascadeWarning !== null}
        title='Revert Multiple Edits?'
        onOk={handleConfirmCascadeRevert}
        onCancel={() => setCascadeWarning(null)}
        okText='Revert All'
        cancelText='Cancel'
        okButtonProps={{ danger: true }}
      >
        <Texto>
          This cell has {cascadeWarning?.laterEditsCount} more recent edit
          {cascadeWarning?.laterEditsCount !== 1 ? 's' : ''}. Reverting will restore the value to before this edit,
          which will also undo the later changes.
        </Texto>
      </Modal>
    </>
  )
}
