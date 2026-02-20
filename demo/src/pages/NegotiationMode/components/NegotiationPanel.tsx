import '../styles.css'

import React, { useState } from 'react'

import { NegotiationPanelProps, NegotiationState } from '../types'

import { ComparisonTable } from './ComparisonTable'
import { DeadlineCountdown } from './DeadlineCountdown'
import { NegotiationHistory } from './NegotiationHistory'

const STATE_CONFIG: Record<
  NegotiationState,
  { icon: string; className: string; getTitle: (isInternal: boolean) => string }
> = {
  proposing: {
    icon: '\uD83D\uDCCB',
    className: 'state-proposing',
    getTitle: () => 'Proposed Changes',
  },
  awaiting: {
    icon: '\u23F3',
    className: 'state-awaiting',
    getTitle: (isInternal) => (isInternal ? 'Awaiting Customer Confirmation' : 'Awaiting Seller Response'),
  },
  'action-required': {
    icon: '\uD83D\uDD35',
    className: 'state-action-required',
    getTitle: (isInternal) => (isInternal ? 'Customer Counter-Proposal' : 'Proposed Changes to Your Order'),
  },
  confirmed: {
    icon: '\u2705',
    className: 'state-confirmed',
    getTitle: (isInternal) => (isInternal ? 'Customer Confirmed' : 'Terms Confirmed'),
  },
}

export function NegotiationPanel({
  negotiationState,
  originalBid,
  currentProposal,
  previousProposals,
  isInternal,
  onClear,
}: NegotiationPanelProps) {
  const [selectedExpiration, setSelectedExpiration] = useState('24h')
  const [note, setNote] = useState(currentProposal.note || '')

  const config = STATE_CONFIG[negotiationState]
  const isProposing = negotiationState === 'proposing'
  const isAwaiting = negotiationState === 'awaiting'
  const isActionRequired = negotiationState === 'action-required'
  const isConfirmed = negotiationState === 'confirmed'

  const counterProposal =
    isActionRequired && previousProposals.length > 0 && previousProposals[0].isCurrent
      ? { volume: previousProposals[0].volume, price: previousProposals[0].price }
      : null

  const submittedAtFormatted = new Date(currentProposal.submittedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className='negotiation-component'>
      {/* Color-coded Header */}
      <div className={`negotiation-header ${config.className}`}>
        <span className='negotiation-header-icon'>{config.icon}</span>
        <span className='negotiation-header-title'>{config.getTitle(isInternal)}</span>
        {isProposing && onClear && (
          <button className='negotiation-clear-btn' onClick={onClear}>
            Clear &#10005;
          </button>
        )}
      </div>

      <div className='negotiation-body'>
        {/* Status line */}
        {isAwaiting && (
          <div className='negotiation-status'>
            Proposal sent to <strong>{currentProposal.submittedBy}</strong> on {submittedAtFormatted}
          </div>
        )}

        {isActionRequired && (
          <div className='negotiation-status'>
            {isInternal ? (
              <>
                <strong>{currentProposal.submittedBy}</strong> counter-proposed on {submittedAtFormatted}
              </>
            ) : (
              <>The seller has proposed modifications to your order.</>
            )}
          </div>
        )}

        {isConfirmed && (
          <div className='negotiation-status'>
            <strong>{currentProposal.submittedBy}</strong> confirmed your proposal on {submittedAtFormatted}
          </div>
        )}

        {/* Deadline countdown */}
        {(isAwaiting || isActionRequired) && currentProposal.expiration && (
          <DeadlineCountdown
            deadline={currentProposal.expiration}
            submittedAt={currentProposal.submittedAt}
            isExternal={!isInternal}
          />
        )}

        {/* Comparison table */}
        <ComparisonTable
          negotiationState={negotiationState}
          originalBid={originalBid}
          currentProposal={currentProposal}
          counterProposal={counterProposal}
          isInternal={isInternal}
          selectedExpiration={selectedExpiration}
          onExpirationChange={setSelectedExpiration}
        />

        {/* Note section */}
        {isProposing && (
          <div className='note-section'>
            <label>{isInternal ? 'Note to customer:' : 'Note to seller:'}</label>
            <textarea
              className='note-input'
              placeholder='Explain the proposed changes...'
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}

        {(isAwaiting || isActionRequired) && currentProposal.note && (
          <div className='note-section'>
            <label>
              {isAwaiting
                ? 'Your note:'
                : isInternal
                  ? 'Customer note:'
                  : 'Seller note:'}
            </label>
            <div className='note-display'>&ldquo;{currentProposal.note}&rdquo;</div>
          </div>
        )}

        {/* Negotiation history */}
        <NegotiationHistory entries={previousProposals} />
      </div>
    </div>
  )
}
