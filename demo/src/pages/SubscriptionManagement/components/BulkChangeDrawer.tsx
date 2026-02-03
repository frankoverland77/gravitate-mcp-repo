// Bulk Change Drawer - Allows bulk editing of content configuration fields

import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Checkbox, Drawer, Divider } from 'antd'
import { useState, useEffect } from 'react'

import { CONTENT_CONFIG_FIELDS, SubscriptionData } from '../SubscriptionManagement.types'

type FieldState = 'checked' | 'unchecked' | 'unchanged'

interface FieldSelection {
  field: string
  headerName: string
  state: FieldState
}

interface BulkChangeDrawerProps {
  visible: boolean
  selectedRows: SubscriptionData[]
  onClose: () => void
  onApply: (changes: Record<string, boolean>) => void
}

export function BulkChangeDrawer({ visible, selectedRows, onClose, onApply }: BulkChangeDrawerProps) {
  const [fieldSelections, setFieldSelections] = useState<FieldSelection[]>([])

  // Initialize field selections when drawer opens
  useEffect(() => {
    if (visible) {
      const initialSelections = CONTENT_CONFIG_FIELDS.map((fieldConfig) => ({
        field: fieldConfig.field,
        headerName: fieldConfig.headerName,
        state: 'unchanged' as FieldState,
      }))
      setFieldSelections(initialSelections)
    }
  }, [visible])

  const handleFieldChange = (field: string, newState: FieldState) => {
    setFieldSelections((prev) =>
      prev.map((f) => (f.field === field ? { ...f, state: newState } : f))
    )
  }

  const handleApply = () => {
    const changes: Record<string, boolean> = {}
    fieldSelections.forEach((f) => {
      if (f.state === 'checked') {
        changes[f.field] = true
      } else if (f.state === 'unchecked') {
        changes[f.field] = false
      }
    })
    onApply(changes)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  const changesCount = fieldSelections.filter((f) => f.state !== 'unchanged').length

  // Helper to cycle through states: unchanged -> checked -> unchecked -> unchanged
  const cycleState = (currentState: FieldState): FieldState => {
    switch (currentState) {
      case 'unchanged':
        return 'checked'
      case 'checked':
        return 'unchecked'
      case 'unchecked':
        return 'unchanged'
      default:
        return 'unchanged'
    }
  }

  const setAllChecked = () => {
    setFieldSelections((prev) => prev.map((f) => ({ ...f, state: 'checked' as FieldState })))
  }

  const setAllUnchecked = () => {
    setFieldSelections((prev) => prev.map((f) => ({ ...f, state: 'unchecked' as FieldState })))
  }

  const clearAll = () => {
    setFieldSelections((prev) => prev.map((f) => ({ ...f, state: 'unchanged' as FieldState })))
  }

  return (
    <Drawer
      title='Bulk Change Content Configuration'
      placement='right'
      width={450}
      visible={visible}
      onClose={handleClose}
      footer={
        <Horizontal justifyContent='space-between' alignItems='center'>
          <Texto appearance='medium'>
            {changesCount} field{changesCount !== 1 ? 's' : ''} will be changed for {selectedRows.length} row
            {selectedRows.length !== 1 ? 's' : ''}
          </Texto>
          <Horizontal style={{ gap: '8px' }}>
            <GraviButton buttonText='Cancel' onClick={handleClose} />
            <GraviButton buttonText='Apply Changes' success disabled={changesCount === 0} onClick={handleApply} />
          </Horizontal>
        </Horizontal>
      }
    >
      <Vertical style={{ gap: '16px' }}>
        <Vertical style={{ gap: '8px' }}>
          <Texto category='p2' appearance='medium'>
            Select fields to change for the {selectedRows.length} selected subscription
            {selectedRows.length !== 1 ? 's' : ''}. Click a field multiple times to cycle through: Include → Exclude →
            No Change.
          </Texto>

          <Horizontal style={{ gap: '8px' }}>
            <GraviButton buttonText='Include All' size='small' theme1 onClick={setAllChecked} />
            <GraviButton buttonText='Exclude All' size='small' onClick={setAllUnchecked} />
            <GraviButton buttonText='Clear All' size='small' onClick={clearAll} />
          </Horizontal>
        </Vertical>

        <Divider style={{ margin: '8px 0' }} />

        <Vertical style={{ gap: '4px' }}>
          {fieldSelections.map((fieldSelection) => (
            <Horizontal
              key={fieldSelection.field}
              justifyContent='space-between'
              alignItems='center'
              style={{
                padding: '8px 12px',
                backgroundColor:
                  fieldSelection.state === 'unchanged'
                    ? 'transparent'
                    : fieldSelection.state === 'checked'
                      ? 'rgba(81, 176, 115, 0.1)'
                      : 'rgba(255, 77, 79, 0.1)',
                borderRadius: '4px',
                border:
                  fieldSelection.state === 'unchanged'
                    ? '1px solid var(--gray-200)'
                    : fieldSelection.state === 'checked'
                      ? '1px solid var(--theme-success)'
                      : '1px solid var(--theme-error)',
                cursor: 'pointer',
              }}
              onClick={() => handleFieldChange(fieldSelection.field, cycleState(fieldSelection.state))}
            >
              <Texto>{fieldSelection.headerName}</Texto>
              <Horizontal alignItems='center' style={{ gap: '8px' }}>
                {fieldSelection.state === 'unchanged' && (
                  <Texto appearance='medium' category='p2'>
                    No Change
                  </Texto>
                )}
                {fieldSelection.state === 'checked' && (
                  <Horizontal alignItems='center' style={{ gap: '4px' }}>
                    <Checkbox checked disabled />
                    <Texto appearance='success' category='p2'>
                      Include
                    </Texto>
                  </Horizontal>
                )}
                {fieldSelection.state === 'unchecked' && (
                  <Horizontal alignItems='center' style={{ gap: '4px' }}>
                    <Checkbox checked={false} disabled />
                    <Texto appearance='error' category='p2'>
                      Exclude
                    </Texto>
                  </Horizontal>
                )}
              </Horizontal>
            </Horizontal>
          ))}
        </Vertical>
      </Vertical>
    </Drawer>
  )
}
