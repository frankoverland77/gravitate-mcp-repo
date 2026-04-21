/**
 * BulkAttributesEditor
 *
 * Bulk-edit cell editor for the "Reporting Attributes" column.
 * Three modes via Segmented control:
 *   - Add: merge selected values into each row's existing array (non-destructive)
 *   - Remove: strip selected values from each row's existing array (non-destructive)
 *   - Replace: overwrite each row's array with exactly the selected values (destructive)
 *
 * Encodes the intent as a sentinel object so the row's handleBulkUpdate can
 * compute the per-row result via applyBulkAttributesPayload().
 */

import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { Select } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export const BULK_ATTRS_OP = '__bulkAttrsMerge__' as const

export type BulkAttributesMode = 'add' | 'remove' | 'replace'

export type BulkAttributesPayload = {
  [BULK_ATTRS_OP]: true
  mode: BulkAttributesMode
  values: string[]
}

export function isBulkAttributesPayload(value: unknown): value is BulkAttributesPayload {
  return !!value && typeof value === 'object' && BULK_ATTRS_OP in (value as Record<string, unknown>)
}

type BulkAttributesEditorParams = {
  propKey: string
  options: { id: number | string; name: string }[]
  refreshBulkDrawerUI: () => void
}

const MODE_COPY: Record<BulkAttributesMode, { placeholder: string }> = {
  add: { placeholder: 'Attributes to add' },
  remove: { placeholder: 'Attributes to remove' },
  replace: { placeholder: 'Attributes to set (replaces existing)' },
}

export const BulkAttributesEditor = forwardRef<
  BulkCellEditorHandle<unknown>,
  BulkAttributesEditorParams
>((props, ref) => {
  const { propKey, options, refreshBulkDrawerUI } = props
  const [mode, setMode] = useState<BulkAttributesMode>('add')
  const [values, setValues] = useState<string[]>([])

  const antOptions = options.map((o) => ({ label: o.name, value: o.name }))

  useImperativeHandle(ref, () => ({
    getChanges: () => {
      // Replace with empty values is still meaningful (clears the list on every selected row).
      if (mode !== 'replace' && values.length === 0) return {}
      const payload: BulkAttributesPayload = {
        [BULK_ATTRS_OP]: true,
        mode,
        values,
      }
      return { [propKey]: payload }
    },
    isChangeReady: () => mode === 'replace' || values.length > 0,
  }))

  useEffect(() => {
    refreshBulkDrawerUI?.()
  }, [mode, values, refreshBulkDrawerUI])

  const longestLabel = antOptions.reduce((max, o) => Math.max(max, o.label.length), 0)
  const selectWidth = Math.min(320, Math.max(200, longestLabel * 8 + 90))

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <Select
        value={mode}
        onChange={(v) => setMode(v as BulkAttributesMode)}
        options={[
          { label: 'Add', value: 'add' },
          { label: 'Remove', value: 'remove' },
          { label: 'Replace', value: 'replace' },
        ]}
        style={{ width: 120 }}
      />
      <Select
        mode="multiple"
        allowClear
        maxTagCount="responsive"
        placeholder={MODE_COPY[mode].placeholder}
        value={values}
        onChange={setValues}
        options={antOptions}
        style={{ width: selectWidth }}
      />
    </div>
  )
})

BulkAttributesEditor.displayName = 'BulkAttributesEditor'

/**
 * Apply a BulkAttributesPayload to an existing row's attribute array.
 *   add     → (existing ∪ values)
 *   remove  → (existing \ values)
 *   replace → values (copy)
 */
export function applyBulkAttributesPayload(
  existing: string[] | undefined,
  payload: BulkAttributesPayload
): string[] {
  const prev = existing ?? []
  switch (payload.mode) {
    case 'add': {
      const set = new Set(prev)
      for (const v of payload.values) set.add(v)
      return Array.from(set)
    }
    case 'remove': {
      const remove = new Set(payload.values)
      return prev.filter((v) => !remove.has(v))
    }
    case 'replace':
      return [...payload.values]
    default:
      return prev
  }
}
