/**
 * Extend Contract Modal
 *
 * Date extension modal for expired contracts.
 * Allows updating start and end dates to extend the contract.
 */

import { useState } from 'react'
import { Modal, DatePicker } from 'antd'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import dayjs from 'dayjs'

interface ExtendContractModalProps {
  open: boolean
  currentStartDate: Date
  currentEndDate: Date
  onClose: () => void
  onExtend: (startDate: Date, endDate: Date) => void
}

export function ExtendContractModal({
  open,
  currentStartDate,
  currentEndDate,
  onClose,
  onExtend,
}: ExtendContractModalProps) {
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs(currentStartDate))
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs(currentEndDate))

  const handleExtend = () => {
    onExtend(startDate.toDate(), endDate.toDate())
    onClose()
  }

  return (
    <Modal
      open={open}
      title='Extend Contract'
      onCancel={onClose}
      footer={
        <Horizontal gap={8} justifyContent='flex-end'>
          <GraviButton buttonText='Cancel' onClick={onClose} />
          <GraviButton buttonText='Extend' theme1 onClick={handleExtend} />
        </Horizontal>
      }
      width={480}
      destroyOnHidden
    >
      <Vertical gap={16} className='py-3'>
        <Texto category='p2' appearance='medium'>
          Extend the contract by updating the start and end dates. This will update all detail rows.
        </Texto>

        <Vertical gap={4}>
          <Texto category='p2' weight='600'>
            Start Date
          </Texto>
          <DatePicker
            value={startDate}
            onChange={(date) => date && setStartDate(date)}
            style={{ width: '100%' }}
          />
        </Vertical>

        <Vertical gap={4}>
          <Texto category='p2' weight='600'>
            End Date
          </Texto>
          <DatePicker
            value={endDate}
            onChange={(date) => date && setEndDate(date)}
            style={{ width: '100%' }}
          />
        </Vertical>
      </Vertical>
    </Modal>
  )
}
