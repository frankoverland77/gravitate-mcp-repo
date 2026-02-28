import { useCallback } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Input, InputNumber, Select, DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { SellerRFP, RFPTerms } from '../types/sellerRfp.types'
import { PAYMENT_TERMS_OPTIONS } from '../types/sellerRfp.types'
import { ALLOCATION_PERIOD_OPTIONS } from '../../RFP/rfp.types'
import styles from './TermsTab.module.css'

const { TextArea } = Input
const { RangePicker } = DatePicker

interface TermsTabProps {
  rfp: SellerRFP
  onTermsUpdate: (terms: RFPTerms) => void
}

export function TermsTab({ rfp, onTermsUpdate }: TermsTabProps) {
  const { terms } = rfp

  const updateField = useCallback(<K extends keyof RFPTerms>(field: K, value: RFPTerms[K]) => {
    onTermsUpdate({ ...terms, [field]: value })
  }, [terms, onTermsUpdate])

  const allocationOptions = ALLOCATION_PERIOD_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
  }))

  return (
    <Vertical style={{ gap: '32px' }}>
      {/* RFP-Level Terms */}
      <Vertical style={{ gap: '16px' }}>
        <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          RFP-Level Terms
        </Texto>

        <div className={styles['form-grid']}>
          {/* Volume Commitment */}
          <Vertical style={{ gap: '4px' }}>
            <Texto category="p2" weight="500">Volume Commitment (gal/mo)</Texto>
            <InputNumber
              value={terms.volumeCommitment}
              onChange={(v) => updateField('volumeCommitment', v)}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => parseInt(value?.replace(/,/g, '') || '0')}
              style={{ width: '100%' }}
              placeholder="e.g., 500,000"
            />
          </Vertical>

          {/* Contract Period */}
          <Vertical style={{ gap: '4px' }}>
            <Texto category="p2" weight="500">Contract Period</Texto>
            <RangePicker
              value={
                terms.contractStart && terms.contractEnd
                  ? [dayjs(terms.contractStart), dayjs(terms.contractEnd)]
                  : null
              }
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  updateField('contractStart', dates[0].format('YYYY-MM-DD'))
                  onTermsUpdate({
                    ...terms,
                    contractStart: dates[0].format('YYYY-MM-DD'),
                    contractEnd: dates[1].format('YYYY-MM-DD'),
                  })
                } else {
                  onTermsUpdate({ ...terms, contractStart: null, contractEnd: null })
                }
              }}
              style={{ width: '100%' }}
            />
          </Vertical>

          {/* Allocation Period */}
          <Vertical style={{ gap: '4px' }}>
            <Texto category="p2" weight="500">Allocation Period</Texto>
            <Select
              value={terms.allocationPeriod}
              onChange={(v) => updateField('allocationPeriod', v)}
              options={allocationOptions}
              placeholder="Select..."
              allowClear
              style={{ width: '100%' }}
            />
          </Vertical>

          {/* Payment Terms */}
          <Vertical style={{ gap: '4px' }}>
            <Texto category="p2" weight="500">Payment Terms</Texto>
            <Select
              value={terms.paymentTerms}
              onChange={(v) => updateField('paymentTerms', v)}
              options={PAYMENT_TERMS_OPTIONS}
              placeholder="Select..."
              allowClear
              style={{ width: '100%' }}
            />
          </Vertical>

          {/* Ratability Range */}
          <Vertical style={{ gap: '4px' }}>
            <Texto category="p2" weight="500">Ratability (% range)</Texto>
            <Horizontal style={{ gap: '8px' }} alignItems="center">
              <InputNumber
                value={terms.ratabilityMin}
                onChange={(v) => updateField('ratabilityMin', v)}
                min={0}
                max={100}
                style={{ width: '100%' }}
                placeholder="Min %"
                addonAfter="%"
              />
              <Texto appearance="medium">to</Texto>
              <InputNumber
                value={terms.ratabilityMax}
                onChange={(v) => updateField('ratabilityMax', v)}
                min={0}
                max={200}
                style={{ width: '100%' }}
                placeholder="Max %"
                addonAfter="%"
              />
            </Horizontal>
          </Vertical>

          {/* Deficiency Penalty */}
          <Vertical style={{ gap: '4px' }}>
            <Texto category="p2" weight="500">Deficiency Penalty</Texto>
            <InputNumber
              value={terms.penaltyCpg}
              onChange={(v) => updateField('penaltyCpg', v)}
              min={0}
              step={0.5}
              precision={1}
              style={{ width: '100%' }}
              placeholder="e.g., 2.0"
              addonAfter="¢/gal"
            />
          </Vertical>
        </div>

        {/* Notes */}
        <Vertical style={{ gap: '4px' }}>
          <Texto category="p2" weight="500">Notes</Texto>
          <TextArea
            value={terms.notes || ''}
            onChange={(e) => updateField('notes', e.target.value || null)}
            rows={3}
            placeholder="Additional terms, buyer requirements, special conditions..."
          />
        </Vertical>
      </Vertical>

      {/* Per-Detail Overrides */}
      <Vertical style={{ gap: '16px' }}>
        <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Per-Detail Overrides
        </Texto>
        <Texto category="p2" appearance="medium">
          Override RFP-level terms for specific product/terminal combinations. Rows without overrides inherit RFP-level terms.
        </Texto>

        <div className={styles['overrides-table']}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Terminal</th>
                <th>Volume Override</th>
                <th>Allocation Override</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rfp.details.map((detail) => {
                const overrides = detail.termOverrides || {}
                const hasOverride = Object.keys(overrides).length > 0

                return (
                  <tr key={detail.id} className={hasOverride ? styles['override-row'] : ''}>
                    <td><Texto category="p2">{detail.product}</Texto></td>
                    <td><Texto category="p2">{detail.terminal}</Texto></td>
                    <td>
                      <Texto category="p2" appearance="medium">
                        {(overrides as Record<string, unknown>).volumeCommitment
                          ? `${((overrides as Record<string, unknown>).volumeCommitment as number).toLocaleString()} gal/mo`
                          : 'Inherited'}
                      </Texto>
                    </td>
                    <td>
                      <Texto category="p2" appearance="medium">
                        {(overrides as Record<string, unknown>).allocationPeriod || 'Inherited'}
                      </Texto>
                    </td>
                    <td>
                      <Texto category="p2" appearance="medium">
                        {(overrides as Record<string, unknown>).notes || '—'}
                      </Texto>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Vertical>
    </Vertical>
  )
}
