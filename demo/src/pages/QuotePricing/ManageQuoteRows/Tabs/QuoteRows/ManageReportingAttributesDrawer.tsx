/**
 * ManageReportingAttributesDrawer
 *
 * Right-side drawer for managing Reporting Attributes — modeled on the OSP
 * counterparty-groups / product-location reference-data pattern.
 *
 * Structure:
 *   - Quick search at the top of the panel (filters the list as you type)
 *   - Scrollable list with one row per attribute — each row has edit + delete icons
 *   - Sticky Add control pinned to the bottom (input + green Add button) with
 *     preview placeholder copy
 *
 * Deletion is blocked inline when the attribute is still applied to rows.
 */

import { useMemo, useState } from 'react'
import { GraviButton, Texto } from '@gravitate-js/excalibrr'
import { Button, Drawer, Input, Popconfirm } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'

export type ReportingAttribute = { id: number; name: string }

interface Props {
  open: boolean
  attributes: ReportingAttribute[]
  getUsageCount: (name: string) => number
  onClose: () => void
  onCreate: (name: string) => void
  onRename: (id: number, nextName: string) => void
  onDelete: (id: number) => void
}

export function ManageReportingAttributesDrawer(props: Props) {
  const { open, attributes, getUsageCount, onClose, onCreate, onRename, onDelete } = props
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draftName, setDraftName] = useState('')
  const [newName, setNewName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAttributes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return attributes
    return attributes.filter((a) => a.name.toLowerCase().includes(q))
  }, [attributes, searchQuery])

  const handleRename = (attr: ReportingAttribute) => {
    const trimmed = draftName.trim()
    if (!trimmed || trimmed === attr.name) {
      setEditingId(null)
      setDraftName('')
      return
    }
    onRename(attr.id, trimmed)
    setEditingId(null)
    setDraftName('')
  }

  const handleAddNew = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setNewName('')
  }

  return (
    <Drawer
      title="Manage Reporting Attributes"
      open={open}
      placement="right"
      width={420}
      onClose={onClose}
      // Remove default body padding so we can use the full drawer height for
      // sticky-footer layout.
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      {/* Quick search at the top */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--gray-100, #f3f4f6)',
        }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: 'var(--gray-400, #9ca3af)' }} />}
          placeholder="Search attributes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px' }}>
        {filteredAttributes.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
            <Texto appearance="medium">
              {attributes.length === 0
                ? 'No attributes yet. Add one below to start tagging rows.'
                : 'No attributes match your search.'}
            </Texto>
          </div>
        ) : (
          filteredAttributes.map((attr) => {
            const usage = getUsageCount(attr.name)
            const inUse = usage > 0
            const isEditing = editingId === attr.id

            return (
              <div
                key={attr.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--gray-100, #f3f4f6)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  {isEditing ? (
                    <Input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onPressEnter={() => handleRename(attr)}
                      autoFocus
                      size="small"
                    />
                  ) : (
                    <>
                      <Texto>{attr.name}</Texto>
                      <Texto appearance="medium" category="p3">
                        Applied to {usage} {usage === 1 ? 'row' : 'rows'}
                      </Texto>
                    </>
                  )}
                </div>
                {isEditing ? (
                  <>
                    <Button type="text" icon={<CheckOutlined />} onClick={() => handleRename(attr)} />
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => {
                        setEditingId(null)
                        setDraftName('')
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingId(attr.id)
                        setDraftName(attr.name)
                      }}
                    />
                    {inUse ? (
                      <Popconfirm
                        title="Can't delete attribute"
                        description={`Applied to ${usage} ${usage === 1 ? 'row' : 'rows'}. Remove it from those rows before deleting.`}
                        okText="Got it"
                        cancelButtonProps={{ style: { display: 'none' } }}
                      >
                        <Button type="text" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title={`Delete "${attr.name}"?`}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => onDelete(attr.id)}
                      >
                        <Button type="text" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    )}
                  </>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Sticky Add control pinned to bottom */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--gray-100, #f3f4f6)',
          background: 'var(--gray-50, #f9fafb)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Input
          placeholder="Name a new attribute, then press Enter"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onPressEnter={handleAddNew}
        />
        <GraviButton
          success
          buttonText="Add"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
        />
      </div>
    </Drawer>
  )
}
