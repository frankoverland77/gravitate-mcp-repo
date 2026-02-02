// Preview Action Buttons - Mode selector and Send button

import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Radio } from 'antd'

import { PreviewMode, PriceNotification } from './types'

interface PreviewActionButtonsProps {
  selectedRows: PriceNotification[]
  setIsShowingConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
  mode: PreviewMode
  setMode: React.Dispatch<React.SetStateAction<PreviewMode>>
}

export function PreviewActionButtons({
  setIsShowingConfirmModal,
  selectedRows,
  mode,
  setMode,
}: PreviewActionButtonsProps) {
  return (
    <Horizontal alignItems='center' justifyContent='space-between' className='ml-2' style={{ width: '100%' }}>
      <Horizontal flex='1' alignItems='center' style={{ minWidth: '350px' }}>
        <Texto className='mr-2'>Mode:</Texto>
        <Radio.Group name='mode' value={mode} onChange={(e) => setMode(e.target.value)}>
          <Radio.Button value='EndOfDay'>End of Day Prices</Radio.Button>
          <Radio.Button value='IntraDay'>Midday Price Changes</Radio.Button>
          <Radio.Button value='EndOfDayCurrentPeriod'>Current Period Prices</Radio.Button>
        </Radio.Group>
      </Horizontal>
      <Horizontal alignItems='center' justifyContent='flex-end'>
        <GraviButton
          buttonText={`Notify Selected (${selectedRows.length})`}
          disabled={!selectedRows.length}
          theme1
          onClick={() => setIsShowingConfirmModal(true)}
        />
      </Horizontal>
    </Horizontal>
  )
}
