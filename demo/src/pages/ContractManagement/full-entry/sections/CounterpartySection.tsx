/**
 * Counterparty Section
 *
 * Form section for Internal and External counterparty selection.
 * Uses Gravitate production card pattern with header bar.
 */

import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import type { FullEntryHeader } from '../fullentry.types'
import { COUNTERPARTY_OPTIONS, CONTACT_OPTIONS } from '../fullentry.defaults'

interface CounterpartySectionProps {
  header: FullEntryHeader
  onChange: (updates: Partial<FullEntryHeader>) => void
  disabled?: boolean
  lockExternalParty?: boolean
}

export function CounterpartySection({ header, onChange, disabled, lockExternalParty }: CounterpartySectionProps) {
  return (
    <Vertical className='bg-1 bordered pb-4' style={{ borderRadius: 8, overflow: 'hidden' }} flex='none' height='auto'>
      {/* Header Bar */}
      <Horizontal className='p-4 bg-2 border-bottom'>
        <Texto category='h6' className='ml-3 font-weight-normal'>
          Counterparty Info
        </Texto>
      </Horizontal>

      {/* Content - Row 1: Internal and External */}
      <Horizontal className='px-4 py-3'>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Internal</Texto>
          <Select
            value={header.internalCounterparty}
            onChange={(value) => onChange({ internalCounterparty: value })}
            options={COUNTERPARTY_OPTIONS}
            placeholder='Select internal counterparty'
            style={{ width: '100%' }}
            disabled={disabled}
          />
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>External</Texto>
          <Select
            value={header.externalCounterparty}
            onChange={(value) => onChange({ externalCounterparty: value })}
            options={COUNTERPARTY_OPTIONS}
            placeholder='Select external counterparty'
            style={{ width: '100%' }}
            disabled={disabled || lockExternalParty}
          />
        </Vertical>
      </Horizontal>

      {/* Content - Row 2: Internal Contact and External Contact */}
      <Horizontal className='px-4 py-2'>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Internal Contact</Texto>
          <Select
            value={header.internalContact || undefined}
            onChange={(value) => onChange({ internalContact: value })}
            options={CONTACT_OPTIONS}
            placeholder='Select contact'
            style={{ width: '100%' }}
            allowClear
            disabled={disabled}
          />
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>External Contact</Texto>
          <Select
            value={header.externalContact || undefined}
            onChange={(value) => onChange({ externalContact: value })}
            options={CONTACT_OPTIONS}
            placeholder='Select contact'
            style={{ width: '100%' }}
            allowClear
            disabled={disabled || lockExternalParty}
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
