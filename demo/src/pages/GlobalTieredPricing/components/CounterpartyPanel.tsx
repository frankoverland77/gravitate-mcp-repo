import { useMemo } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { UserOutlined } from '@ant-design/icons'
import type { TieredPricingRow, CounterpartyAssignment } from '../GlobalTieredPricing.types'

interface CounterpartyPanelProps {
  selectedRow: TieredPricingRow | null
  activeGroupId: string
  assignments: CounterpartyAssignment[]
}

export function CounterpartyPanel({ selectedRow, activeGroupId, assignments }: CounterpartyPanelProps) {
  const matched = useMemo(() => {
    if (!selectedRow) return []
    return assignments.filter(
      a => a.groupId === activeGroupId && a.location === selectedRow.location && a.product === selectedRow.product
    )
  }, [selectedRow, activeGroupId, assignments])

  return (
    <div style={{
      width: 440,
      flexShrink: 0,
      borderLeft: '1px solid var(--gray-200)',
      background: 'var(--bg-1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--gray-200)',
        flexShrink: 0,
      }}>
        <Texto category="h5" weight="600">Affected Counterparties</Texto>
        {selectedRow && (
          <Texto appearance="medium" style={{ marginTop: 4, fontSize: 12 }}>
            {selectedRow.location} — {selectedRow.product}
          </Texto>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {!selectedRow ? (
          <Vertical flex="1" justifyContent="center" alignItems="center" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <UserOutlined style={{ fontSize: 40, color: 'var(--gray-400)', marginBottom: 12 }} />
            <Texto appearance="medium">
              Click a row to see which counterparties are affected.
            </Texto>
          </Vertical>
        ) : (
          <>
            {/* Table header */}
            <Horizontal style={{
              padding: '8px 16px',
              borderBottom: '2px solid var(--gray-300)',
              background: 'var(--gray-50)',
            }}>
              <Texto weight="bold" style={{ flex: 1 }}>Counterparty</Texto>
              <Texto weight="bold" style={{ width: 120, textAlign: 'right' }}>Tier Level</Texto>
            </Horizontal>

            {/* Rows */}
            {matched.map((a, i) => (
              <Horizontal
                key={i}
                style={{
                  padding: '8px 16px',
                  borderBottom: '1px solid var(--gray-100)',
                }}
              >
                <Texto style={{ flex: 1 }}>{a.counterparty}</Texto>
                <Texto appearance="medium" style={{ width: 120, textAlign: 'right' }}>{a.tierLevel}</Texto>
              </Horizontal>
            ))}

            {matched.length === 0 && (
              <Texto appearance="medium" style={{ padding: '16px' }}>
                No counterparties assigned to this product-location in the active group.
              </Texto>
            )}
          </>
        )}
      </div>
    </div>
  )
}
