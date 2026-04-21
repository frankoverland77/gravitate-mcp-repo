/**
 * ReportingAttributesEditor
 *
 * AG Grid cell editor for multi-selecting Reporting Attributes on a quote row.
 * Uses forwardRef + useImperativeHandle for the AG Grid editor contract.
 * Popup dropdown (cellEditorPopup: true). Closes on outside click.
 * Footer action: "+ New attribute…" lets analysts add a new attribute on the fly.
 *
 * Per MEMORY.md: getValue() can be called before React re-renders, so selected
 * values are mirrored into a ref that is updated synchronously inside the setter.
 */

import { forwardRef, useImperativeHandle, useState, useRef, useEffect, useCallback } from 'react'
import type { ICellEditorParams } from 'ag-grid-community'

export interface ReportingAttributeOption {
  id: number | string
  name: string
}

interface ReportingAttributesEditorProps extends ICellEditorParams {
  options: ReportingAttributeOption[]
  onCreateAttribute?: (name: string) => void
}

const dropdownStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid var(--gray-200, #e5e7eb)',
  borderRadius: 6,
  boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
  minWidth: 240,
  maxWidth: 320,
  fontSize: 13,
  paddingTop: 4,
  paddingBottom: 4,
}

const optionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  cursor: 'pointer',
  userSelect: 'none',
}

const footerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--gray-100, #f3f4f6)',
  padding: '6px 10px',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

export const ReportingAttributesEditor = forwardRef((props: ReportingAttributesEditorProps, ref) => {
  const initial: string[] = Array.isArray(props.value) ? props.value : []
  const [selected, setSelected] = useState<string[]>(initial)
  const selectedRef = useRef<string[]>(initial)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState('')

  const options = props.options ?? []

  useImperativeHandle(ref, () => ({
    getValue() {
      return selectedRef.current
    },
    isPopup() {
      return true
    },
  }))

  const stopEditing = useCallback(() => {
    if (props.api) props.api.stopEditing()
  }, [props.api])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        stopEditing()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [stopEditing])

  useEffect(() => {
    if (isCreating && inputRef.current) inputRef.current.focus()
  }, [isCreating])

  function toggle(name: string) {
    setSelected((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
      selectedRef.current = next
      return next
    })
  }

  function clearAll() {
    selectedRef.current = []
    setSelected([])
  }

  function commitDraft() {
    const trimmed = draft.trim()
    if (!trimmed) {
      setIsCreating(false)
      setDraft('')
      return
    }
    const exists = options.some((o) => o.name.toLowerCase() === trimmed.toLowerCase())
    if (!exists && props.onCreateAttribute) {
      props.onCreateAttribute(trimmed)
    }
    if (!selectedRef.current.includes(trimmed)) {
      const next = [...selectedRef.current, trimmed]
      selectedRef.current = next
      setSelected(next)
    }
    setDraft('')
    setIsCreating(false)
  }

  return (
    <div ref={containerRef} style={dropdownStyle}>
      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
        <div style={{ ...optionStyle, color: 'var(--gray-500, #6b7280)' }} onClick={clearAll}>
          <span style={{ width: 14, display: 'inline-block' }} />
          <span style={{ fontStyle: 'italic' }}>&mdash; Clear all</span>
        </div>
        {options.map((opt) => {
          const isSelected = selected.includes(opt.name)
          return (
            <div
              key={opt.id}
              style={{
                ...optionStyle,
                background: isSelected ? 'var(--gray-50, #f9fafb)' : 'transparent',
                fontWeight: isSelected ? 500 : 400,
              }}
              onClick={() => toggle(opt.name)}
            >
              <span style={{ width: 14, display: 'inline-block', textAlign: 'center' }}>
                {isSelected ? '✓' : ''}
              </span>
              <span>{opt.name}</span>
            </div>
          )
        })}
      </div>
      <div style={footerStyle}>
        {isCreating ? (
          <>
            <input
              ref={inputRef}
              value={draft}
              placeholder="New attribute name"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitDraft()
                if (e.key === 'Escape') {
                  setIsCreating(false)
                  setDraft('')
                }
              }}
              style={{
                flex: 1,
                border: '1px solid var(--gray-200, #e5e7eb)',
                borderRadius: 4,
                padding: '3px 6px',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={commitDraft}
              style={{
                border: 'none',
                background: 'var(--gray-100, #f3f4f6)',
                padding: '3px 8px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Add
            </button>
          </>
        ) : (
          <span
            onClick={() => setIsCreating(true)}
            style={{ color: 'var(--primary-600, #2563eb)', cursor: 'pointer', fontSize: 13 }}
          >
            + New attribute…
          </span>
        )}
      </div>
    </div>
  )
})

ReportingAttributesEditor.displayName = 'ReportingAttributesEditor'
