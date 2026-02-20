import { Horizontal } from '@gravitate-js/excalibrr'
import React from 'react'

import { EXPIRATION_OPTIONS, NegotiationState, ProposalValues } from '../types'

interface ComparisonTableProps {
  negotiationState: NegotiationState
  originalBid: ProposalValues
  currentProposal: { volume: number; price: number; expiration: string }
  counterProposal?: { volume: number; price: number } | null
  isInternal: boolean
  selectedExpiration: string
  onExpirationChange: (value: string) => void
}

function formatVolume(volume: number): string {
  return volume.toLocaleString() + ' gal'
}

function formatPrice(price: number): string {
  return '$' + price.toFixed(4) + ' /gal'
}

function formatDelta(original: number, proposed: number, type: 'volume' | 'price'): React.ReactNode {
  const diff = proposed - original
  if (diff === 0) return null

  const isPositive = diff > 0
  const className = `delta ${isPositive ? 'positive' : 'negative'}`

  if (type === 'volume') {
    return <span className={className}>({isPositive ? '+' : ''}{diff.toLocaleString()})</span>
  }
  return <span className={className}>({isPositive ? '+' : '-'}${Math.abs(diff).toFixed(4)})</span>
}

export function ComparisonTable({
  negotiationState,
  originalBid,
  currentProposal,
  counterProposal,
  isInternal,
  selectedExpiration,
  onExpirationChange,
}: ComparisonTableProps) {
  const isProposing = negotiationState === 'proposing'
  const isConfirmed = negotiationState === 'confirmed'
  const hasCounter = negotiationState === 'action-required' && counterProposal

  const proposalColumnLabel = (() => {
    if (isConfirmed) return 'Confirmed Terms'
    if (isProposing) return 'Your Proposal'
    if (isInternal) return 'Your Proposal'
    return 'Proposed Changes'
  })()

  return (
    <table className='comparison-table'>
      <thead>
        <tr>
          <th></th>
          <th>{isInternal ? 'Original Bid' : 'Your Original Bid'}</th>
          {hasCounter && <th>Your Proposal</th>}
          <th>{hasCounter ? (isInternal ? 'Customer Counter' : 'Seller Counter') : proposalColumnLabel}</th>
        </tr>
      </thead>
      <tbody>
        {/* Volume Row */}
        <tr>
          <td className='field-name'>Volume</td>
          <td className='original-value'>{formatVolume(originalBid.volume)}</td>
          {hasCounter && <td className='original-value'>{formatVolume(currentProposal.volume)}</td>}
          <td className={isConfirmed ? 'confirmed-value' : 'proposed-value'}>
            {isConfirmed && <span className='checkmark'>&#10003;</span>}
            {!isConfirmed && <span className='arrow'>&#9654;</span>}
            {formatVolume(hasCounter ? counterProposal.volume : currentProposal.volume)}
            {isProposing && formatDelta(originalBid.volume, currentProposal.volume, 'volume')}
          </td>
        </tr>

        {/* Price Row */}
        <tr>
          <td className='field-name'>Price</td>
          <td className='original-value'>{formatPrice(originalBid.price)}</td>
          {hasCounter && <td className='original-value'>{formatPrice(currentProposal.price)}</td>}
          <td className={isConfirmed ? 'confirmed-value' : 'proposed-value'}>
            {isConfirmed && <span className='checkmark'>&#10003;</span>}
            {!isConfirmed && <span className='arrow'>&#9654;</span>}
            {formatPrice(hasCounter ? counterProposal.price : currentProposal.price)}
            {isProposing && formatDelta(originalBid.price, currentProposal.price, 'price')}
          </td>
        </tr>

        {/* Expiration Row - only shown when proposing */}
        {isProposing && (
          <tr>
            <td className='field-name'>Expiration</td>
            <td className='original-value'>{originalBid.expiration}</td>
            <td className='proposed-value'>
              <Horizontal verticalCenter style={{ gap: 8 }}>
                <select
                  className='expiration-select'
                  value={selectedExpiration}
                  onChange={(e) => onExpirationChange(e.target.value)}
                >
                  {EXPIRATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Horizontal>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
