/**
 * Contract Management Types
 *
 * Types for contract management including Quick Entry and Full Entry flows.
 * Uses shared formula types for pricing configuration.
 */

import type { Formula, ProvisionType } from '../../../shared/types/formula.types';

/**
 * Contract detail status - derived from completeness of data
 */
export type ContractDetailStatus = 'empty' | 'in-progress' | 'ready';

/**
 * Calendar types for contract details
 */
export type CalendarType = 'Contract Calendar' | 'NYX' | 'Rack';

/**
 * Contract status
 */
export type ContractStatus = 'draft' | 'active' | 'expired' | 'pending';

/**
 * Effective time options for contract details
 */
export type EffectiveTime = '12:00 AM' | '4:00 PM' | '5:00 PM' | '6:00 PM';

/**
 * Contract detail - a single line item within a contract
 */
export interface ContractDetail {
  id: string;
  supplier?: string;
  product: string;
  location: string;
  destination?: string;
  calendar: CalendarType;
  startDate: Date;
  endDate: Date;
  effectiveTime: EffectiveTime;
  provisionType: ProvisionType;
  fixedValue?: number;
  formula?: Formula;
  quantity: number;
  status: ContractDetailStatus;
  isNew?: boolean;
  volumeGroupIds?: string[];
}

/**
 * Contract header - common information for a contract
 */
export interface ContractHeader {
  internalParty: string;
  externalParty: string;
  startDate: Date;
  endDate: Date;
  effectiveTime: EffectiveTime;
  currency: string;
  unitOfMeasure: string;
  // New optional fields (from Figma design)
  contractType?: string;
  description?: string;
  internalContact?: string;
  externalContact?: string;
  contractDate?: Date | null;
  contractCalendar?: string;
  requireQuantities?: boolean;
}

/**
 * Contract - full contract with header and details
 */
export interface Contract {
  id: string;
  name: string;
  header: ContractHeader;
  details: ContractDetail[];
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contract list item for the contracts grid (with embedded details for master-detail)
 */
export interface ContractListItem {
  id: string;
  name: string;
  type: string;
  internalParty: string;
  externalParty: string;
  startDate: Date;
  endDate: Date;
  status: ContractStatus;
  detailCount: number;
  totalQuantity: number;
  locations: string[];
  products: string[];
  createdAt: Date;
  updatedAt: Date;
  details: ContractDetail[];
}

/**
 * Screen state for Quick Entry flow
 */
export type QuickEntryScreen = 'empty' | 'grid';

/**
 * Create mode selection
 */
export type CreateMode = 'quick' | 'full' | 'day-deal';

/**
 * Page mode for create/edit/view
 */
export type PageMode = 'create' | 'edit' | 'view';

/**
 * Product options for dropdowns
 */
export interface ProductOption {
  id: string;
  name: string;
  group: 'gasoline' | 'diesel';
}

/**
 * Location options for dropdowns
 */
export interface LocationOption {
  id: string;
  name: string;
  region: string;
}

/**
 * Bulk create selection
 */
export interface BulkCreateSelection {
  products: string[];
  locations: string[];
  formulaTemplateId?: string;
}

/**
 * Volume group allocation unit
 */
export type AllocationUnit = 'gal/yr' | 'gal/mo' | 'gal/qtr' | 'bbl/yr' | 'bbl/mo'

/**
 * Volume group frequency
 */
export type GroupFrequency = 'Monthly' | 'Quarterly' | 'Annually'

/**
 * Volume group compliance status
 */
export type GroupCompliance = 'ok' | 'warning'

/**
 * Volume group panel view state
 */
export type VolumeGroupPanelView = 'list' | 'edit' | 'create'

/**
 * Volume group - defines an allocation bucket that contract details can belong to
 */
export interface VolumeGroup {
  id: string
  name: string
  allocation: number
  allocationUnit: AllocationUnit
  minPercent: number
  maxPercent: number
  frequency: GroupFrequency
  detailIds: string[]
  compliance: GroupCompliance
  liftedPercent: number
}

/**
 * External allocation - imported from external systems for group creation
 */
export interface ExternalAllocation {
  id: string
  source: string
  sourceName: string
  name: string
  allocation: number
  unit: AllocationUnit
  frequency: GroupFrequency
}
