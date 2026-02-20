import React, { useState } from 'react'

import { ProposalHistoryEntry } from '../types'

interface NegotiationHistoryProps {
  entries: ProposalHistoryEntry[]
}

function formatExpStatus(status?: string): React.ReactNode {
  if (!status) return null
  if (status === 'countered') return <span className='status-countered'>Countered</span>
  if (status === 'expired') return <span className='status-expired'>Expired</span>
  return null
}

export function NegotiationHistory({ entries }: NegotiationHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (entries.length === 0) return null

  return (
    <>
      <button className='history-toggle' onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '\u25BC' : '\u25B6'} Negotiation History ({entries.length})
      </button>

      {isExpanded && (
        <div className='history-expanded'>
          {entries.map((entry) => (
            <div key={entry.id} className={`history-entry ${entry.isCurrent ? 'current' : ''}`}>
              <div className='history-entry-header'>
                <span className='history-entry-marker' />
                <span className='history-entry-title'>{entry.title}</span>
                {entry.isCurrent && <span className='history-entry-label'>CURRENT</span>}
              </div>

              <div className='history-entry-meta'>
                {entry.submittedAt} &bull; {entry.submittedBy}
              </div>

              <div className='history-entry-values'>
                <span>
                  <span className='label'>Volume:</span> {entry.volume.toLocaleString()} gal
                </span>
                <span>
                  <span className='label'>Price:</span> ${entry.price.toFixed(4)} /gal
                </span>
              </div>

              <div className='history-entry-expiration'>
                {entry.expirationStatus === 'active'
                  ? `Expires: ${entry.expiration}`
                  : entry.expirationStatus === 'expired'
                    ? `Expired: ${entry.expiration}`
                    : `Bid Expiry: ${entry.expiration}`}
                {entry.expirationStatus && entry.expirationStatus !== 'active' && (
                  <> &bull; {formatExpStatus(entry.expirationStatus)}</>
                )}
              </div>

              {entry.note && <div className='history-entry-note'>&ldquo;{entry.note}&rdquo;</div>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
