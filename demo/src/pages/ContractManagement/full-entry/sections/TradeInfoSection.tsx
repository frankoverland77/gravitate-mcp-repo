/**
 * Trade Info Section
 *
 * Form section for trade dates and quantities configuration.
 * Uses Gravitate production card pattern with header bar.
 */

import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Select, DatePicker, Switch } from 'antd'
import moment, { type Moment } from 'moment'
import type { FullEntryHeader } from '../fullentry.types'
import { CALENDAR_OPTIONS } from '../fullentry.defaults'
import styles from '../FullEntryFlow.module.css'

const { RangePicker } = DatePicker

interface TradeInfoSectionProps {
  header: FullEntryHeader
  onChange: (updates: Partial<FullEntryHeader>) => void
  disabled?: boolean
}

export function TradeInfoSection({ header, onChange, disabled }: TradeInfoSectionProps) {
  return (
    <Vertical className='bg-1 bordered pb-4' style={{ borderRadius: 8, overflow: 'hidden' }} flex='none' height='auto'>
      {/* Header Bar */}
      <Horizontal className='p-4 bg-2 border-bottom'>
        <Texto category='h6' className='ml-3 font-weight-normal'>
          Trade Info
        </Texto>
      </Horizontal>

      {/* Content - Two columns */}
      <Horizontal className='px-4 py-3'>
        {/* Trade Dates Column */}
        <Vertical flex={1} className='my-2 mx-4'>
          <Vertical className='mb-3'>
            <Texto className='py-2'>Contract Calendar</Texto>
            <Select
              value={header.contractCalendar}
              onChange={(value) => onChange({ contractCalendar: value })}
              options={CALENDAR_OPTIONS}
              placeholder='Select calendar'
              style={{ width: '100%' }}
              disabled={disabled}
            />
          </Vertical>

          <Vertical className='mb-3'>
            <Texto className='py-2'>Contract Date</Texto>
            <DatePicker
              value={header.contractDate ? moment(header.contractDate) : undefined}
              onChange={(date: Moment | null) => onChange({ contractDate: date?.toDate() || null })}
              style={{ width: '100%' }}
              placeholder='Select date'
              disabled={disabled}
            />
          </Vertical>

          <Vertical>
            <Texto className='py-2'>Effective Dates</Texto>
            <RangePicker
              value={
                header.effectiveDates
                  ? [moment(header.effectiveDates[0]), moment(header.effectiveDates[1])]
                  : undefined
              }
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  onChange({ effectiveDates: [dates[0].toDate(), dates[1].toDate()] })
                } else {
                  onChange({ effectiveDates: null })
                }
              }}
              style={{ width: '100%' }}
              className={styles.dateRangeField}
              disabled={disabled}
            />
          </Vertical>
        </Vertical>

        {/* Quantities Column */}
        <Vertical flex={1} className='my-2 mx-4'>
          <Vertical>
            <Texto className='py-2'>Quantities</Texto>
            <Horizontal className={styles.switchField}>
              <Switch
                checked={header.requireQuantities}
                onChange={(checked) => onChange({ requireQuantities: checked })}
                disabled={disabled}
              />
              <Texto category='p1'>Require Quantities</Texto>
            </Horizontal>
          </Vertical>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
