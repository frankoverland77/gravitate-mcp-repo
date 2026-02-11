/**
 * Footer Component
 *
 * Reusable footer bar matching the Gravitate Contract Management pattern.
 * Features:
 * - Left side: Icon + Title with blue underline
 * - Right side: Cancel button + Primary action button
 */

import { ArrowRightOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'

type FooterProps = {
  title: string
  icon: React.ReactNode
  buttonTitle: string
  onClick: () => void
  onClickCancel?: () => void
  disabled?: boolean
  loading?: boolean
  canWrite?: boolean
}

export function Footer({
  title,
  icon,
  buttonTitle,
  onClick,
  onClickCancel,
  disabled,
  loading,
  canWrite = true,
}: FooterProps) {
  return (
    <Horizontal
      className='bordered bg-1 pr-4'
      style={{
        borderTop: '1px solid var(--gray-200)',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 'none',
      }}
    >
      {/* Left side - Icon and Title with blue underline */}
      <Horizontal
        flex='none'
        className='py-3 pl-4'
        style={{
          minWidth: '300px',
          alignItems: 'center',
          borderBottom: '3px solid var(--theme-color-2)',
          color: 'var(--theme-color-2)',
        }}
      >
        <Horizontal className='mr-2' style={{ fontSize: '2em' }}>
          {icon}
        </Horizontal>
        <Texto category='h5' style={{ color: 'inherit' }}>
          {title}
        </Texto>
      </Horizontal>

      {/* Right side - Action buttons */}
      {canWrite && (
        <Horizontal flex='none' width='auto'>
          {onClickCancel && (
            <Vertical horizontalCenter>
              <GraviButton
                style={{
                  height: 35,
                  fontSize: 15,
                }}
                className='px-4 mr-3'
                onClick={onClickCancel}
                disabled={disabled}
                buttonText='Cancel'
              />
            </Vertical>
          )}
          <Vertical>
            <GraviButton
              icon={<ArrowRightOutlined />}
              style={{
                height: 35,
                fontSize: 15,
              }}
              theme2
              loading={loading}
              onClick={onClick}
              disabled={disabled}
              buttonText={buttonTitle}
              className='px-4 mr-3'
            />
          </Vertical>
        </Horizontal>
      )}
    </Horizontal>
  )
}
