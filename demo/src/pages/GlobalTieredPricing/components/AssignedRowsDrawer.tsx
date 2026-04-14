import { useMemo } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { CloseOutlined, InboxOutlined } from '@ant-design/icons'
import type { AssignedRowsDrawerState, TieredPricingRow, TierGroup } from '../GlobalTieredPricing.types'

interface AssignedRowsDrawerProps {
  drawerState: AssignedRowsDrawerState
  allRows: TieredPricingRow[]
  groups: TierGroup[]
  onClose: () => void
}

export function AssignedRowsDrawer({ drawerState, allRows, groups, onClose }: AssignedRowsDrawerProps) {
  const { isOpen, mode, selectedGroupId, selectedLevelId } = drawerState

  const matchedRows = useMemo(() => {
    if (mode === 'empty') return []
    if (mode === 'group' && selectedGroupId) {
      return allRows.filter(r => r.group === selectedGroupId)
    }
    if (mode === 'cell' && selectedGroupId && selectedLevelId) {
      // For now, all rows in a group have all 3 tiers, so cell mode = group filter
      return allRows.filter(r => r.group === selectedGroupId)
    }
    return []
  }, [mode, selectedGroupId, selectedLevelId, allRows])

  const groupLabel = groups.find(g => g.id === selectedGroupId)?.label ?? selectedGroupId

  return (
    <div style={{
      width: isOpen ? '460px' : '0px',
      minWidth: isOpen ? '460px' : '0px',
      overflow: 'hidden',
      transition: 'width 300ms ease, min-width 300ms ease',
      borderLeft: isOpen ? '1px solid var(--gray-200)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-1)',
      flexShrink: 0,
    }}>
      {/* Header */}
      <Horizontal
        justifyContent="space-between"
        alignItems="center"
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--gray-200)',
          flexShrink: 0,
        }}
      >
        <Texto category="h5" weight="600">
          Assigned Rows
        </Texto>
        <span
          onClick={onClose}
          style={{
            cursor: 'pointer',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-100)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <CloseOutlined style={{ fontSize: 14 }} />
        </span>
      </Horizontal>

      {/* Body */}
      <Vertical flex="1" style={{ overflow: 'auto', padding: '16px' }}>
        {mode === 'empty' && (
          <Vertical flex="1" justifyContent="center" alignItems="center" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <InboxOutlined style={{ fontSize: 40, color: 'var(--gray-400)', marginBottom: 12 }} />
            <Texto appearance="medium">
              Click a row count badge on a group tab to see which quote rows are assigned.
            </Texto>
          </Vertical>
        )}

        {mode !== 'empty' && (
          <>
            <Horizontal gap={8} alignItems="center" style={{ marginBottom: 16 }}>
              <Texto weight="bold">{groupLabel}</Texto>
              {selectedLevelId && (
                <Texto appearance="medium"> / {selectedLevelId}</Texto>
              )}
              <Texto appearance="medium">({matchedRows.length} rows)</Texto>
            </Horizontal>

            <Vertical gap={0}>
              {/* Column header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 80px 80px 80px',
                padding: '8px 12px',
                borderBottom: '2px solid var(--gray-300)',
                background: 'var(--gray-50)',
              }}>
                <Texto weight="bold" category="label">Location</Texto>
                <Texto weight="bold" category="label">Product</Texto>
                <Texto weight="bold" category="label" style={{ textAlign: 'right' }}>Tier 1</Texto>
                <Texto weight="bold" category="label" style={{ textAlign: 'right' }}>Tier 2</Texto>
                <Texto weight="bold" category="label" style={{ textAlign: 'right' }}>Tier 3</Texto>
              </div>

              {/* Rows */}
              {matchedRows.map(row => (
                <div
                  key={row.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 80px 80px 80px',
                    padding: '6px 12px',
                    borderBottom: '1px solid var(--gray-100)',
                  }}
                >
                  <Texto category="label">{row.location}</Texto>
                  <Texto category="label">{row.product}</Texto>
                  <Texto category="label" style={{ textAlign: 'right' }}>
                    {row.tier1 != null ? `$${row.tier1.toFixed(4)}` : '—'}
                  </Texto>
                  <Texto category="label" style={{ textAlign: 'right' }}>
                    {row.tier2 != null ? `$${row.tier2.toFixed(4)}` : '—'}
                  </Texto>
                  <Texto category="label" style={{ textAlign: 'right' }}>
                    {row.tier3 != null ? `$${row.tier3.toFixed(4)}` : '—'}
                  </Texto>
                </div>
              ))}

              {matchedRows.length === 0 && (
                <Texto appearance="medium" style={{ padding: '16px 12px' }}>
                  No rows assigned to this group.
                </Texto>
              )}
            </Vertical>
          </>
        )}
      </Vertical>
    </div>
  )
}
