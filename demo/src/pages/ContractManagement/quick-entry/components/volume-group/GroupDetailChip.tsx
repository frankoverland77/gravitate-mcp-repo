/**
 * GroupDetailChip
 *
 * Small pill displaying "Product - Location" with an optional remove button.
 * Used in both list view group tiles and edit view.
 */

import { CloseOutlined } from '@ant-design/icons'

interface GroupDetailChipProps {
  product: string
  location: string
  onRemove?: () => void
}

export function GroupDetailChip({ product, location, onRemove }: GroupDetailChipProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: '#f3f4f6',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        lineHeight: '16px',
        whiteSpace: 'nowrap',
      }}
    >
      {product} &mdash; {location}
      {onRemove && (
        <CloseOutlined
          onClick={onRemove}
          style={{ fontSize: '10px', color: '#9ca3af', cursor: 'pointer' }}
        />
      )}
    </span>
  )
}
