import { CheckCircleFilled } from '@ant-design/icons'
import { Texto } from '@gravitate-js/excalibrr'
import { Button } from 'antd'
import type { ReactNode } from 'react'

interface DealSelectionButtonsItem<T extends string | number = string | number> {
  id: T
  label: string
  description: string
  renderIcon?: (selected: boolean) => ReactNode
}

interface DealSelectionButtonsProps<T extends string | number = string | number> {
  item: DealSelectionButtonsItem<T>
  selectedId: T | undefined
  onSelect: (id: T) => void
  variant?: 'deal' | 'subtype'
}

export function DealSelectionButtons({ item, selectedId, onSelect, variant = 'deal' }: DealSelectionButtonsProps) {
  const isSelected = selectedId === item.id
  const isDeal = variant === 'deal'

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      {/* Checkmark - top-right corner, centered on the border intersection */}
      {isSelected && (
        <CheckCircleFilled
          style={{
            fontSize: '22px',
            position: 'absolute',
            top: '-11px',
            right: '-11px',
            zIndex: 2,
            color: 'var(--theme-color-1)',
            background: 'var(--bg-2)',
            borderRadius: '50%',
          }}
        />
      )}

      <Button
        className='border-radius-10'
        style={{
          height: '100%',
          width: '100%',
          minHeight: isDeal ? '120px' : '70px',
          padding: isDeal ? '16px' : '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          color: isSelected ? 'var(--theme-color-1)' : 'inherit',
          backgroundColor: isSelected ? 'var(--bg-2)' : 'var(--bg-1)',
          borderColor: isSelected ? 'var(--theme-color-1)' : undefined,
        }}
        onClick={() => onSelect(item.id)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left', width: '100%' }}>
          {isDeal && item.renderIcon && (
            <div style={{ flexShrink: 0, paddingTop: '2px' }}>
              {item.renderIcon(isSelected)}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Texto category='h5' style={{ color: isSelected ? 'var(--theme-color-1)' : 'inherit' }} className={isDeal ? 'text-18' : undefined}>
              {item.label}
            </Texto>
            <Texto
              weight='normal'
              style={{ whiteSpace: 'break-spaces', color: isSelected ? 'var(--theme-color-1)' : 'var(--gray-600)' }}
              className={isDeal ? 'text-14' : undefined}
            >
              {item.description}
            </Texto>
          </div>
        </div>
      </Button>
    </div>
  )
}
