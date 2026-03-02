/**
 * Seller RFP Response Management Types
 *
 * Types for the seller-side RFP response workflow.
 * Reuses Formula, FormulaVariable, ProvisionType from shared types.
 */

import type { Formula } from '../../../shared/types/formula.types'
import type { AllocationPeriod } from '../../RFP/rfp.types'

// Re-export for convenience
export type { Formula, FormulaVariable, ProvisionType, FormulaMode } from '../../../shared/types/formula.types'
export type { PricePublisher, PriceType, DateRule } from '../../../shared/types/price.types'
export type { AllocationPeriod } from '../../RFP/rfp.types'

// =============================================================================
// STATUS & ENUMS
// =============================================================================

export type SellerRFPStatus = 'draft' | 'in-progress' | 'submitted' | 'won' | 'lost' | 'advanced' | 'declined'

export type CostType = 'inventory' | 'contract' | 'estimated'

export type SellerDetailStatus = 'empty' | 'in-progress' | 'ready'

export type AdjudicationResult = 'won' | 'lost' | 'advanced'

export type WinReason = 'best-price' | 'incumbent' | 'relationship' | 'volume-flexibility' | 'other'

export type LossReason = 'price-too-high' | 'lost-on-terms' | 'lost-on-volume' | 'incumbent-won' | 'unknown' | 'other'

export type PaymentTerms = 'net-10' | 'net-15' | 'net-30' | 'prepay'

export type DeclineReason =
  | 'no-supply'
  | 'margin-not-viable'
  | 'capacity-constraints'
  | 'deadline-too-tight'
  | 'strategic-pass'
  | 'other'

export interface DeclineMetadata {
  reason: DeclineReason
  notes: string | null
  declinedAt: string // ISO date
}

// =============================================================================
// CORE ENTITIES
// =============================================================================

export interface SellerRFP {
  id: string
  name: string
  buyerId: string
  buyerName: string
  deadline: string // ISO date
  currentRound: number
  status: SellerRFPStatus
  details: SellerRFPDetail[]
  terms: RFPTerms
  rounds: RFPRoundHistory[]
  declineMetadata?: DeclineMetadata | null
  createdAt: string
  updatedAt: string
}

export interface SellerRFPDetail {
  id: string
  product: string
  terminal: string
  costType: CostType | null
  costFormula: Formula | null
  costPrice: number | null // resolved $/gal
  saleFormula: Formula | null
  salePrice: number | null // resolved $/gal
  margin: number | null // salePrice - costPrice in cpg (cents per gallon)
  volume: number | null // gal/month
  status: SellerDetailStatus
  termOverrides: Partial<RFPTerms> | null
  priorRoundValues?: PriorRoundSnapshot
}

export interface RFPTerms {
  volumeCommitment: number | null
  contractStart: string | null // ISO date
  contractEnd: string | null // ISO date
  allocationPeriod: AllocationPeriod | null
  ratabilityMin: number | null // percentage
  ratabilityMax: number | null // percentage
  penaltyCpg: number | null
  paymentTerms: PaymentTerms | null
  notes: string | null
}

export interface RFPRoundHistory {
  round: number
  submittedAt: string | null
  adjudication: AdjudicationResult | null
  adjudicationReason: string | null
  adjudicationNotes: string | null
  detailSnapshot: SellerRFPDetail[]
}

export interface PriorRoundSnapshot {
  costPrice: number | null
  salePrice: number | null
  margin: number | null
  saleFormulaDisplay: string | null
  volume: number | null
}

// =============================================================================
// UI STATE
// =============================================================================

export type SellerRFPScreen = 'pipeline' | 'workspace'

export type WorkspaceTab = 'details' | 'terms' | 'summary' | 'analysis'

export type EntryPath = 'matrix' | 'upload' | 'copy' | 'manual'

export interface SellerRFPPageState {
  currentScreen: SellerRFPScreen
  selectedRFP: SellerRFP | null
  activeTab: WorkspaceTab
  isDirty: boolean
  rfps: SellerRFP[]

  // Drawer/modal visibility
  entryPathModalOpen: boolean
  activeEntryPath: EntryPath | null
  intakeDrawerOpen: boolean
  saleFormulaDrawerOpen: boolean
  adjudicationModalOpen: boolean

  // Active detail for formula editing
  activeDetailId: string | null
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

export const STATUS_LABELS: Record<SellerRFPStatus, string> = {
  'draft': 'Draft',
  'in-progress': 'In Progress',
  'submitted': 'Submitted',
  'won': 'Won',
  'lost': 'Lost',
  'advanced': 'Advanced',
  'declined': 'Declined',
}

export const STATUS_COLORS: Record<SellerRFPStatus, { color: string; background: string }> = {
  'draft': { color: '#595959', background: '#f5f5f5' },
  'in-progress': { color: '#1677ff', background: '#e6f4ff' },
  'submitted': { color: '#722ed1', background: '#f9f0ff' },
  'won': { color: '#52c41a', background: '#f6ffed' },
  'lost': { color: '#ff4d4f', background: '#fff2f0' },
  'advanced': { color: '#fa8c16', background: '#fff7e6' },
  'declined': { color: '#8c8c8c', background: '#fafafa' },
}

export const COST_TYPE_LABELS: Record<CostType, string> = {
  'inventory': 'Inventory',
  'contract': 'Contract',
  'estimated': 'Estimated',
}

export const COST_TYPE_COLORS: Record<CostType, { color: string; background: string }> = {
  'inventory': { color: '#1677ff', background: '#e6f4ff' },
  'contract': { color: '#52c41a', background: '#f6ffed' },
  'estimated': { color: '#fa8c16', background: '#fff7e6' },
}

export const DETAIL_STATUS_LABELS: Record<SellerDetailStatus, string> = {
  'empty': 'Empty',
  'in-progress': 'In Progress',
  'ready': 'Ready',
}

export const PAYMENT_TERMS_OPTIONS: Array<{ value: PaymentTerms; label: string }> = [
  { value: 'net-10', label: 'Net 10' },
  { value: 'net-15', label: 'Net 15' },
  { value: 'net-30', label: 'Net 30' },
  { value: 'prepay', label: 'Prepay' },
]

export const WIN_REASON_OPTIONS: Array<{ value: WinReason; label: string }> = [
  { value: 'best-price', label: 'Best Price' },
  { value: 'incumbent', label: 'Incumbent' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'volume-flexibility', label: 'Volume Flexibility' },
  { value: 'other', label: 'Other' },
]

export const LOSS_REASON_OPTIONS: Array<{ value: LossReason; label: string }> = [
  { value: 'price-too-high', label: 'Price Too High' },
  { value: 'lost-on-terms', label: 'Lost on Terms' },
  { value: 'lost-on-volume', label: 'Lost on Volume' },
  { value: 'incumbent-won', label: 'Incumbent Won' },
  { value: 'unknown', label: 'Unknown' },
  { value: 'other', label: 'Other' },
]

export const DECLINE_REASON_OPTIONS: Array<{ value: DeclineReason; label: string }> = [
  { value: 'no-supply', label: 'No supply position' },
  { value: 'margin-not-viable', label: 'Margin not viable' },
  { value: 'capacity-constraints', label: 'Capacity constraints' },
  { value: 'deadline-too-tight', label: 'Deadline too tight' },
  { value: 'strategic-pass', label: 'Relationship / strategic pass' },
  { value: 'other', label: 'Other' },
]

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Derive detail row status from field completeness
 */
export function deriveDetailStatus(detail: SellerRFPDetail): SellerDetailStatus {
  const hasCost = detail.costType !== null && detail.costPrice !== null
  const hasSale = detail.saleFormula !== null && detail.salePrice !== null

  if (!hasCost && !hasSale) return 'empty'
  if (hasCost && hasSale) return 'ready'
  return 'in-progress'
}

/**
 * Calculate margin in cents per gallon
 */
export function calculateMarginCpg(salePrice: number | null, costPrice: number | null): number | null {
  if (salePrice === null || costPrice === null) return null
  return Math.round((salePrice - costPrice) * 10000) / 100 // cpg with 2 decimal places
}

/**
 * Get margin color class based on cpg value
 */
export function getMarginColor(marginCpg: number | null): 'green' | 'yellow' | 'red' | 'neutral' {
  if (marginCpg === null) return 'neutral'
  if (marginCpg > 3) return 'green'
  if (marginCpg >= 1) return 'yellow'
  return 'red'
}

/**
 * Format a formula for display in grid cells
 */
export function formatFormulaDisplay(formula: Formula | null): string {
  if (!formula) return ''
  if (formula.name) return formula.name
  if (formula.expression) return formula.expression
  if (formula.variables.length === 0) return ''

  const v = formula.variables[0]
  const diffStr = v.differential >= 0 ? `+ ${v.differential.toFixed(1)}` : `- ${Math.abs(v.differential).toFixed(1)}`
  return `${v.pricePublisher} ${v.priceInstrument} ${v.priceType} ${diffStr}`
}

/**
 * Format price as $/gal with 4 decimal places
 */
export function formatPrice(price: number | null): string {
  if (price === null) return '—'
  return `$${price.toFixed(4)}`
}

/**
 * Format margin in $/gal (0.0100 = 1 cent, 0.0001 = 1 point)
 */
export function formatMarginCpg(marginCpg: number | null): string {
  if (marginCpg === null) return '—'
  const dollarValue = marginCpg / 100
  if (dollarValue < 0) return `-$${Math.abs(dollarValue).toFixed(4)}`
  return `$${dollarValue.toFixed(4)}`
}

/**
 * Format volume as gal/mo
 */
export function formatVolume(volume: number | null): string {
  if (volume === null) return '—'
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M gal/mo`
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K gal/mo`
  return `${volume} gal/mo`
}

/**
 * Check if deadline is within N days
 */
export function isDeadlineUrgent(deadline: string, daysThreshold: number = 3): boolean {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const diffMs = deadlineDate.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= daysThreshold
}

/**
 * Check if deadline is past
 */
export function isDeadlinePast(deadline: string): boolean {
  return new Date(deadline) < new Date()
}

// =============================================================================
// FEASIBILITY & INTELLIGENCE TYPES
// =============================================================================

export interface TerminalFeasibility {
  terminal: string
  agreements: Array<{
    supplierName: string
    productsCovered: string[]
    availableVolumePerMonth: number
  }>
  productsUncovered: string[]
  totalAvailableCapacity: number
  totalCommittedVolume: number
  netAvailable: number
}

export interface BuyerHistory {
  buyerId: string
  buyerName: string
  totalRfps: number
  wonCount: number
  lostCount: number
  declinedCount: number
  winRate: number
  terminalBreakdown: Array<{
    terminal: string
    rfpCount: number
    wonCount: number
    lostCount: number
    lastOutcome: {
      result: 'won' | 'lost'
      date: string
      reason: string | null
      avgMarginCpg: number | null
    } | null
  }>
}

export interface PastBidReference {
  rfpId: string
  rfpName: string
  buyerName: string
  outcome: 'won' | 'lost'
  outcomeDate: string
  lossReason: string | null
  saleFormulaDisplay: string
  saleDifferential: number
  marginCpg: number
  volume: number
}

export interface TerminalProductStats {
  terminal: string
  product: string
  totalBids: number
  wonCount: number
  lostCount: number
  winRate: number
  winningDifferentialRange: { min: number; max: number } | null
  avgWinningMarginCpg: number | null
  avgLosingMarginCpg: number | null
}

export interface MarginHistoryPoint {
  date: string
  marginCpg: number
}

// =============================================================================
// INVENTORY CAPACITY & DETAIL AVAILABILITY
// =============================================================================

export interface InventoryCapacity {
  id: string
  terminal: string
  product: string
  capacityPerMonth: number // total owned capacity in gal/mo
  currentUtilizationPercent: number // how much is already committed (0-100)
}

export interface DetailAvailability {
  availablePerMonth: number | null // aggregate available gal/mo for cost type
  netPerMonth: number | null // available - volume
  netPerTerm: number | null // netPerMonth × contract months
  sources: Array<{
    name: string // supplier name or "Owned Inventory"
    capacityPerMonth: number // total capacity
    availablePerMonth: number // capacity × availability %
  }>
  contractMonths: number | null // derived from terms
  hasCostType: boolean
  hasVolume: boolean
  hasContractDates: boolean
}

// =============================================================================
// AVAILABILITY FORMATTING HELPERS
// =============================================================================

/**
 * Format volume without "/mo" suffix — for total contract volumes
 */
export function formatVolumeTotal(volume: number | null): string {
  if (volume === null) return '—'
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M gal`
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K gal`
  return `${volume} gal`
}

/**
 * Get availability color based on net available vs demand volume
 */
export function getAvailabilityColor(
  netPerMonth: number | null,
  volume: number | null,
): 'green' | 'amber' | 'red' | 'neutral' {
  if (netPerMonth === null) return 'neutral'
  if (netPerMonth <= 0) return 'red'
  if (volume !== null && volume > 0 && netPerMonth <= volume * 0.2) return 'amber'
  return 'green'
}
