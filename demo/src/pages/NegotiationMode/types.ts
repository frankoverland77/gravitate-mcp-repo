export type NegotiationState = 'proposing' | 'awaiting' | 'action-required' | 'confirmed'

export interface ProposalValues {
  volume: number
  price: number
  expiration: string
}

export interface ProposalHistoryEntry {
  id: string
  title: string
  submittedBy: string
  submittedAt: string
  volume: number
  price: number
  expiration: string
  expirationStatus?: 'active' | 'expired' | 'countered'
  note?: string
  isCurrent?: boolean
}

export interface NegotiationPanelProps {
  negotiationState: NegotiationState
  originalBid: ProposalValues
  currentProposal: {
    volume: number
    price: number
    expiration: string
    note: string
    submittedBy: string
    submittedAt: string
  }
  previousProposals: ProposalHistoryEntry[]
  isInternal: boolean
  onAcceptOriginal: () => void
  onAcceptProposed: () => void
  onPropose: (values: ProposalValues, note: string, expiration: string) => void
  onClear?: () => void
}

export const EXPIRATION_OPTIONS = [
  { label: '4 hours', value: '4h' },
  { label: '8 hours', value: '8h' },
  { label: '24 hours', value: '24h' },
  { label: '48 hours', value: '48h' },
  { label: '1 week', value: '1w' },
] as const

export type ExpirationOption = (typeof EXPIRATION_OPTIONS)[number]['value']
