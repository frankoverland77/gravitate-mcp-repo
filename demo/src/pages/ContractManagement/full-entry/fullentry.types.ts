/**
 * Full Entry Flow - Type Definitions
 *
 * Extended types for the two-column Full Entry wizard layout.
 */

/**
 * Contract type options for the left sidebar radio buttons
 */
export type ContractType = 'Day - Fixed' | 'Day - Formula' | 'Intercompany' | 'Term - Formula'

/**
 * Extended contract header for Full Entry flow
 * Includes all fields from the two-column layout design
 */
export interface FullEntryHeader {
  // Contract Type (left sidebar)
  contractType: ContractType
  description: string
  comments: string

  // Counterparty Info section
  internalCounterparty: string
  internalContact: string
  externalCounterparty: string
  externalContact: string

  // Trade Info section
  contractCalendar: string
  contractDate: Date | null
  effectiveDates: [Date, Date] | null
  requireQuantities: boolean

  // Additional Info section
  internalContractNumber: string
  externalContractNumber: string
  movementType: string
  strategy: string
}

/**
 * Step keys for wizard navigation
 */
export type FullEntryStep = 'header' | 'details' | 'prices' | 'review'

/**
 * Step definition with metadata
 */
export interface StepDefinition {
  key: FullEntryStep
  title: string
  icon: React.ReactNode
}
