/**
 * ReportingAttributesCell
 *
 * AG Grid cell renderer for the multi-value "Reporting Attributes" column.
 * 0 attributes: empty cell (per spec — no placeholder).
 * 1–2 attributes: inline BBDTag chips.
 * 3+ attributes: first 2 chips + "+N more" badge with hover popover listing all.
 */

import { BBDTag } from '@gravitate-js/excalibrr'
import type { ICellRendererParams } from 'ag-grid-community'
import { Popover } from 'antd'

const MAX_INLINE_CHIPS = 2

function Chip({ label }: { label: string }) {
  return (
    <BBDTag theme3 style={{ margin: 0 }}>
      {label}
    </BBDTag>
  )
}

export function ReportingAttributesCell(params: ICellRendererParams) {
  const attributes: string[] = Array.isArray(params.value) ? params.value : []

  if (attributes.length === 0) return null

  const visible = attributes.slice(0, MAX_INLINE_CHIPS)
  const overflow = attributes.slice(MAX_INLINE_CHIPS)

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap' }}>
      {visible.map((attr) => (
        <Chip key={attr} label={attr} />
      ))}
      {overflow.length > 0 && (
        <Popover
          trigger="hover"
          placement="bottomLeft"
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 240 }}>
              {attributes.map((attr) => (
                <Chip key={attr} label={attr} />
              ))}
            </div>
          }
        >
          <span>
            <BBDTag style={{ margin: 0, cursor: 'default' }}>+{overflow.length} more</BBDTag>
          </span>
        </Popover>
      )}
    </span>
  )
}
