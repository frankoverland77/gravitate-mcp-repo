/**
 * Additional Info Section
 *
 * Form section for contract numbers, movement type, and strategy.
 * Uses Gravitate production card pattern with header bar.
 */

import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Input, Select } from 'antd'
import type { FullEntryHeader } from '../fullentry.types'
import { MOVEMENT_TYPE_OPTIONS, STRATEGY_OPTIONS } from '../fullentry.defaults'

interface AdditionalInfoSectionProps {
  header: FullEntryHeader
  onChange: (updates: Partial<FullEntryHeader>) => void
  disabled?: boolean
}

export function AdditionalInfoSection({ header, onChange, disabled }: AdditionalInfoSectionProps) {
  return (
    <Vertical className='bg-1 bordered pb-4' style={{ borderRadius: 8, overflow: 'hidden' }} flex='none' height='auto'>
      {/* Header Bar */}
      <Horizontal className='p-4 bg-2 border-bottom'>
        <Texto category='h5' className='ml-3 font-weight-normal'>
          Additional Info
        </Texto>
      </Horizontal>

      {/* Content - Four columns */}
      <Horizontal className='px-4 py-3'>
        {/* Internal Contract Number */}
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Internal Contract #</Texto>
          <Input
            value={header.internalContractNumber}
            onChange={(e) => onChange({ internalContractNumber: e.target.value })}
            placeholder='Enter number'
            disabled={disabled}
          />
        </Vertical>

        {/* External Contract Number */}
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>External Contract #</Texto>
          <Input
            value={header.externalContractNumber}
            onChange={(e) => onChange({ externalContractNumber: e.target.value })}
            placeholder='Enter number'
            disabled={disabled}
          />
        </Vertical>

        {/* Movement Type */}
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Movement Type</Texto>
          <Select
            value={header.movementType || undefined}
            onChange={(value) => onChange({ movementType: value })}
            options={MOVEMENT_TYPE_OPTIONS}
            placeholder='Select type'
            style={{ width: '100%' }}
            allowClear
            disabled={disabled}
          />
        </Vertical>

        {/* Strategy */}
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Strategy</Texto>
          <Select
            value={header.strategy || undefined}
            onChange={(value) => onChange({ strategy: value })}
            options={STRATEGY_OPTIONS}
            placeholder='Select strategy'
            style={{ width: '100%' }}
            allowClear
            disabled={disabled}
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
