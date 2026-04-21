/**
 * ManageListPanel
 *
 * Non-modal side panel (push layout, not overlay drawer) for managing reference
 * data lists. Visual styling mirrors the OSP ManageLocationGroups / GroupEditor
 * + AddLocationGroup pattern: Excalibrr Texto categories, GraviButton framed
 * icons, theme CSS vars (--theme-color-2-dim, --theme-error, --theme-success).
 */

import { useMemo, useState } from 'react'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Input, Popconfirm } from 'antd'
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
  DeleteFilled,
  EditFilled,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import styles from './ManageListPanel.module.css'

export type ListItem = { id: number; name: string }

interface ManageListPanelProps<T extends ListItem> {
  visible: boolean
  title: string
  sectionLabel: string
  items: T[]
  onClose: () => void
  onCreate: (name: string) => void
  onRename: (id: number, nextName: string) => void
  onDelete: (id: number) => void
  getUsageCount?: (name: string) => number
  getSubtitle?: (item: T, usageCount: number) => string
  addButtonLabel?: string
  addPlaceholder?: string
  searchPlaceholder?: string
  addInputLabel?: string
}

export function ManageListPanel<T extends ListItem>(props: ManageListPanelProps<T>) {
  const {
    visible,
    title,
    sectionLabel,
    items,
    onClose,
    onCreate,
    onRename,
    onDelete,
    getUsageCount,
    getSubtitle,
    addButtonLabel = 'ADD NEW',
    addPlaceholder = 'Enter a name',
    searchPlaceholder = 'Quick Search',
    addInputLabel = 'Name:',
  } = props

  const [searchQuery, setSearchQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draftName, setDraftName] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => i.name.toLowerCase().includes(q))
  }, [items, searchQuery])

  const commitAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setNewName('')
    setAdding(false)
  }

  const cancelAdd = () => {
    setNewName('')
    setAdding(false)
  }

  const commitRename = (item: T) => {
    const trimmed = draftName.trim()
    if (!trimmed || trimmed === item.name) {
      setEditingId(null)
      setDraftName('')
      return
    }
    onRename(item.id, trimmed)
    setEditingId(null)
    setDraftName('')
  }

  const className = `${styles.panel}${visible ? '' : ` ${styles['panel-hidden']}`}`

  return (
    <div className={className} aria-hidden={!visible}>
      <div className={styles['panel-header']}>
        <Texto category="h3">{title}</Texto>
        <GraviButton icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />} onClick={onClose} />
      </div>

      <div className={styles['panel-search']}>
        <Input
          prefix={<SearchOutlined style={{ color: 'var(--gray-400, #9ca3af)' }} />}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </div>

      <div className={styles['panel-section-label']}>
        <Texto category="heading-small">
          {sectionLabel} ({items.length})
        </Texto>
      </div>

      <div className={styles['panel-list']}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <Texto appearance="medium">
              {items.length === 0 ? 'Nothing here yet.' : 'No matches.'}
            </Texto>
          </div>
        ) : (
          filtered.map((item) => {
            const isEditing = editingId === item.id
            const usage = getUsageCount?.(item.name) ?? 0
            const inUse = usage > 0
            const subtitle = getSubtitle?.(item, usage)

            return (
              <div key={item.id} className={styles['list-row']}>
                <div className={styles['row-main']}>
                  {isEditing ? (
                    <Input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onPressEnter={() => commitRename(item)}
                      size="small"
                      autoFocus
                    />
                  ) : (
                    <Vertical>
                      <Texto category="h5" style={{ maxWidth: 260 }}>
                        {item.name}
                      </Texto>
                      {subtitle && <Texto category="p2">{subtitle}</Texto>}
                    </Vertical>
                  )}
                </div>
                <div className={styles['row-actions']}>
                  {isEditing ? (
                    <>
                      <GraviButton
                        icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />}
                        onClick={() => {
                          setEditingId(null)
                          setDraftName('')
                        }}
                      />
                      <GraviButton success icon={<CheckOutlined />} onClick={() => commitRename(item)} />
                    </>
                  ) : (
                    <>
                      <GraviButton
                        icon={
                          <EditFilled
                            onClick={() => {
                              setEditingId(item.id)
                              setDraftName(item.name)
                            }}
                          />
                        }
                      />
                      {inUse ? (
                        <Popconfirm
                          title="Can't delete"
                          description={`${usage} ${usage === 1 ? 'row uses' : 'rows use'} this. Remove them before deleting.`}
                          okText="Got it"
                          cancelButtonProps={{ style: { display: 'none' } }}
                        >
                          <GraviButton
                            disabled
                            icon={<DeleteFilled style={{ color: 'var(--gray-400)' }} />}
                          />
                        </Popconfirm>
                      ) : (
                        <Popconfirm
                          title={`Delete "${item.name}"?`}
                          okText="Delete"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => onDelete(item.id)}
                        >
                          <GraviButton
                            icon={<DeleteFilled style={{ color: 'var(--theme-error)' }} />}
                          />
                        </Popconfirm>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className={styles['panel-footer']}>
        {adding ? (
          <div className={styles['add-expanded']}>
            <div className={styles['add-field']}>
              <span className={styles['add-label']}>{addInputLabel}</span>
              <Input
                style={{ flex: 1 }}
                placeholder={addPlaceholder}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onPressEnter={commitAdd}
                autoFocus
              />
            </div>
            <Horizontal gap={12} justifyContent="flex-end">
              <CloseCircleFilled
                style={{ fontSize: 24, color: 'var(--gray-900, #111827)', cursor: 'pointer' }}
                onClick={cancelAdd}
              />
              <CheckCircleFilled
                style={{ fontSize: 24, color: 'var(--theme-success, #15803d)', cursor: 'pointer' }}
                onClick={commitAdd}
              />
            </Horizontal>
          </div>
        ) : (
          <div className={styles['add-collapsed']}>
            <GraviButton
              icon={<PlusOutlined style={{ color: 'var(--theme-color-2)' }} />}
              onClick={() => setAdding(true)}
              style={{ width: '100%' }}
              buttonText={
                <Texto category="heading-small" appearance="secondary">
                  {addButtonLabel}
                </Texto>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
