import { useCallback, useMemo } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Input, InputNumber, Select, DatePicker, Segmented } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { SellerRFP, RFPTerms } from '../types/sellerRfp.types'
import { PAYMENT_TERMS_OPTIONS, formatVolume } from '../types/sellerRfp.types'
import { ALLOCATION_PERIOD_OPTIONS, formatAllocationPeriod } from '../../RFP/rfp.types'
import type { AllocationPeriod } from '../../RFP/rfp.types'
import styles from './TermsTab.module.css'

const { TextArea } = Input
const { RangePicker } = DatePicker

type VolumeMode = 'from-details' | 'rfp-total'

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

  // Volume aggregation from details
  const detailVolumeTotal = useMemo(() =>
    rfp.details.reduce((sum, d) => sum + (d.volume || 0), 0),
  [rfp.details])

  const detailsWithVolume = useMemo(() =>
    rfp.details.filter((d) => d.volume !== null && d.volume > 0).length,
  [rfp.details])

  // Determine volume mode: if RFP commitment differs meaningfully from detail sum, it's an RFP-level total
  const volumeMode: VolumeMode = terms.volumeCommitment !== null
    && Math.abs((terms.volumeCommitment || 0) - detailVolumeTotal) > 1000
    ? 'rfp-total'
    : 'from-details'

  // Group details by terminal for the overrides table
  const detailsByTerminal = useMemo(() => {
    const groups: Record<string, typeof rfp.details> = {}
    for (const detail of rfp.details) {
      const key = detail.terminal
      if (!groups[key]) groups[key] = []
      groups[key].push(detail)
    }
    return groups
  }, [rfp.details])

  return (
    <Vertical style={{ gap: '32px' }}>
      {/* Volume & Allocation */}
      <Vertical style={{ gap: '16px' }}>
        <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Volume & Allocation
        </Texto>

        {/* Volume Summary Card */}
        <div className={styles['volume-card']}>
          <Horizontal alignItems="stretch" style={{ gap: '1px', backgroundColor: '#e8e8e8' }}>
            {/* Aggregated from details */}
            <Vertical style={{ flex: 1, padding: '16px', backgroundColor: '#fff', gap: '4px' }}>
              <Texto category="p3" appearance="medium">Detail Volume (sum)</Texto>
              <Texto category="h5" weight="600">
                {detailVolumeTotal > 0 ? formatVolume(detailVolumeTotal) : '—'}
              </Texto>
              <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>
                {detailsWithVolume} of {rfp.details.length} details have volume assigned
              </Texto>
            </Vertical>

            {/* RFP-level commitment */}
            <Vertical style={{ flex: 1, padding: '16px', backgroundColor: '#fff', gap: '4px' }}>
              <Horizontal alignItems="center" justifyContent="space-between">
                <Texto category="p3" appearance="medium">RFP Volume Commitment</Texto>
                <Segmented
                  size="small"
                  value={volumeMode}
                  options={[
                    { value: 'from-details', label: 'From Details' },
                    { value: 'rfp-total', label: 'RFP Total' },
                  ]}
                  onChange={(v) => {
                    if (v === 'from-details') {
                      updateField('volumeCommitment', detailVolumeTotal || null)
                    }
                  }}
                  style={{ fontSize: '10px' }}
                />
              </Horizontal>
              {volumeMode === 'rfp-total' ? (
                <InputNumber
                  value={terms.volumeCommitment}
                  onChange={(v) => updateField('volumeCommitment', v)}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => parseInt(value?.replace(/,/g, '') || '0')}
                  style={{ width: '100%' }}
                  placeholder="Total gal/mo"
                  size="small"
                />
              ) : (
                <Texto category="h5" weight="600">
                  {detailVolumeTotal > 0 ? formatVolume(detailVolumeTotal) : '—'}
                </Texto>
              )}
              {volumeMode === 'rfp-total' && terms.volumeCommitment && detailVolumeTotal > 0 && (
                <Texto
                  category="p3"
                  style={{
                    fontSize: '11px',
                    color: terms.volumeCommitment > detailVolumeTotal ? '#faad14' : '#52c41a',
                  }}
                >
                  {terms.volumeCommitment > detailVolumeTotal
                    ? `${formatVolume(terms.volumeCommitment - detailVolumeTotal)} unassigned to details`
                    : 'Detail volumes cover commitment'}
                </Texto>
              )}
            </Vertical>

            {/* Allocation Period */}
            <Vertical style={{ flex: 1, padding: '16px', backgroundColor: '#fff', gap: '4px' }}>
              <Texto category="p3" appearance="medium">Allocation Period</Texto>
              <Select
                value={terms.allocationPeriod}
                onChange={(v) => updateField('allocationPeriod', v)}
                options={allocationOptions}
                placeholder="Select..."
                allowClear
                size="small"
                style={{ width: '100%' }}
              />
              <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>
                Applies to all details unless overridden below
              </Texto>
            </Vertical>
          </Horizontal>
        </div>

        {/* Per-Detail Volume & Allocation Table */}
        <div className={styles['overrides-table']}>
          <table>
            <thead>
              <tr>
                <th>Terminal</th>
                <th>Product</th>
                <th>Volume (gal/mo)</th>
                <th>Allocation</th>
                <th style={{ textAlign: 'center', width: '36px' }}></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(detailsByTerminal).map(([terminal, details]) => {
                const terminalTotal = details.reduce((s, d) => s + (d.volume || 0), 0)

                return details.map((detail, idx) => {
                  const overrides = detail.termOverrides || {}
                  const allocationOverride = (overrides as Record<string, unknown>).allocationPeriod as AllocationPeriod | undefined
                  const isFirstInGroup = idx === 0
                  const isLastInGroup = idx === details.length - 1

                  return (
                    <tr
                      key={detail.id}
                      className={`${allocationOverride ? styles['override-row'] : ''} ${isLastInGroup ? styles['group-last'] : ''}`}
                    >
                      {isFirstInGroup ? (
                        <td rowSpan={details.length} className={styles['terminal-cell']}>
                          <Vertical style={{ gap: '2px' }}>
                            <Texto category="p2" weight="500">{terminal.replace(' Terminal', '')}</Texto>
                            <Texto category="p3" appearance="medium" style={{ fontSize: '11px' }}>
                              {formatVolume(terminalTotal)}
                            </Texto>
                          </Vertical>
                        </td>
                      ) : null}
                      <td><Texto category="p2">{detail.product}</Texto></td>
                      <td>
                        <Texto category="p2">
                          {detail.volume ? detail.volume.toLocaleString() : <span style={{ color: '#bfbfbf' }}>—</span>}
                        </Texto>
                      </td>
                      <td>
                        {allocationOverride ? (
                          <span className={styles['override-badge']}>
                            {formatAllocationPeriod(allocationOverride)}
                          </span>
                        ) : (
                          <Texto category="p3" appearance="medium">
                            {terms.allocationPeriod ? formatAllocationPeriod(terms.allocationPeriod) : '—'}
                          </Texto>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className={styles['edit-trigger']} title="Edit volume & allocation overrides">
                          <EditOutlined />
                        </button>
                      </td>
                    </tr>
                  )
                })
              })}
            </tbody>
          </table>
        </div>
      </Vertical>

      {/* Contract & Payment Terms */}
      <Vertical style={{ gap: '16px' }}>
        <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Contract & Payment Terms
        </Texto>

        <div className={styles['form-grid']}>
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
              step={0.0001}
              precision={4}
              style={{ width: '100%' }}
              placeholder="e.g., 0.0200"
              addonBefore="$"
              addonAfter="/gal"
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
    </Vertical>
  )
}
