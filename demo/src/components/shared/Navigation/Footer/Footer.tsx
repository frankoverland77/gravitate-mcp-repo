import { ArrowRightOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractDetails } from '@modules/ContractManagement/api/types.schema'
import React from 'react'

type footerProps = {
  title: string
  icon: JSX.Element
  buttonTitle: string
  onClick: ((string?: string) => void) | ((string?: string) => Promise<void>)
  disabled?: boolean
  contract?: ContractDetails
  isMakingActive?: boolean
  onClickCancel?: () => void
  loading?: boolean
  canWrite?: boolean
}

export function Footer({
  loading,
  title,
  icon,
  buttonTitle,
  onClick,
  onClickCancel,
  disabled,
  contract,
  isMakingActive,
  canWrite,
}: footerProps) {
  return (
    <Horizontal
      className='bordered bg-1 pr-4'
      style={{
        borderTop: '1px solid var(--gray-200)',
        justifyContent: 'space-between',
        alignItems: 'center',

        flex: 1,
      }}
    >
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
          <Vertical />
          <Vertical>
            <GraviButton
              icon={buttonTitle.includes('Save') ? <SaveOutlined /> : <ArrowRightOutlined />}
              style={{
                height: 35,
                fontSize: 15,
              }}
              theme2={contract?.OrderStatusCodeValueDisplay !== 'Draft'}
              loading={loading}
              onClick={() => onClick('SaveChanges')}
              disabled={disabled}
              buttonText={buttonTitle}
              className='px-4 mr-3'
            />
          </Vertical>
          {contract?.OrderStatusCodeValueDisplay === 'Draft' && (
            <GraviButton
              icon={<UploadOutlined />}
              style={{
                height: 35,
                fontSize: 15,
              }}
              theme2
              loading={isMakingActive}
              disabled={isMakingActive || loading}
              onClick={() => onClick('MakeActive')}
              buttonText='Make Contract Active'
            />
          )}
        </Horizontal>
      )}
    </Horizontal>
  )
}
