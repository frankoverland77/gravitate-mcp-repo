import { GridApi, SelectionChangedEvent, GridReadyEvent, ValueFormatterParams, CellStyleParams, ICellRendererParams } from 'ag-grid-community';
import React from 'react';

// =============================================================================
// Core Data Types
// =============================================================================

/** Main offer row data shown in the Index Offer Management grid */
export interface OfferData {
  id: number;
  terminal: string;
  product: string;
  formulaTemplate: string;
  differential: string;
  status: 'Active' | 'Inactive';
  createdBy: string;
  createdDate: string;
}

/** Pricing row data for the Offer Pricing tab grid */
export interface PricingRow {
  id: number;
  product: string;
  location: string;
  type: 'Argus' | 'OPIS' | 'Platts';
  formula: string;
  currentDiff: number;
  currentPrice: number;
  proposedDiff: number;
  proposedPrice: number;
  isSelected?: boolean;
}

/** Analytics/Competitive Analysis row data */
export interface AnalyticsRow {
  id: number;
  competitor: string;
  currentPrice: string;
  rank: string;
  trendIndicator: 'normal' | 'above' | 'below';
  lastRevalueDate: string;
  changeFromPrevious: string;
  differenceToSelected: string;
  isSelected: boolean;
}

/** Formula component row in the formula builder grid */
export interface FormulaComponent {
  id: number;
  percentage: string;
  source: string;
  index: string;
  timing: string;
  location: string;
  isHeader?: boolean;
}

/** Market context data for competitive analysis */
export interface MarketContextItem {
  offerId: number;
  rank: number;
  captureRate: number;
  consistency: string;
  intradayChanges: string;
  upMarketCapture: number;
  downMarketCapture: number;
}

// =============================================================================
// Form State Types
// =============================================================================

/** Consolidated form state for offer creation/editing */
export interface OfferFormState {
  product: string;
  location: string;
  differential: string;
  isActive: boolean;
  sendNotification: boolean;
  validFor: string;
  weekendRule: string;
  holidayRule: string;
  paymentTerms: string;
  freightTerms: string;
  terms: string;
  useInternalOverride: boolean;
  internalOverride: string;
  useExternalOverride: boolean;
  externalOverride: string;
  isInternalOnly: boolean;
  internalName: string;
  externalName: string;
  sameAsInternal: boolean;
}

/** Initial/default values for offer form state */
export const initialOfferFormState: OfferFormState = {
  product: '',
  location: '',
  differential: '0.0000',
  isActive: true,
  sendNotification: false,
  validFor: 'midnight-midnight',
  weekendRule: 'use-friday',
  holidayRule: 'use-last-business-day',
  paymentTerms: '',
  freightTerms: '',
  terms: '',
  useInternalOverride: false,
  internalOverride: '',
  useExternalOverride: false,
  externalOverride: '',
  isInternalOnly: false,
  internalName: '',
  externalName: '',
  sameAsInternal: false,
};

// =============================================================================
// View Mode Types
// =============================================================================

/** Available view modes for the main grid */
export type ViewMode = 'panel' | 'columns' | 'rank' | 'analytics';

/** Available tabs in Future State mode */
export type TabKey = 'offer-management' | 'offer-pricing';

// =============================================================================
// Component Props Types
// =============================================================================

/** Props for the OfferFormDrawer component */
export interface OfferFormDrawerProps {
  visible: boolean;
  onClose: () => void;
  isEditMode: boolean;
  selectedOfferData: OfferData | null;
  formState: OfferFormState;
  setFormState: React.Dispatch<React.SetStateAction<OfferFormState>>;
  components: FormulaComponent[];
  setComponents: React.Dispatch<React.SetStateAction<FormulaComponent[]>>;
  onSave: (saveAsActive: boolean) => void;
  showTemplateChooser: boolean;
  setShowTemplateChooser: (show: boolean) => void;
  showSaveTemplateForm: boolean;
  setShowSaveTemplateForm: (show: boolean) => void;
}

/** Props for the OfferPricingTab component */
export interface OfferPricingTabProps {
  rowData: PricingRow[];
  onRowDataChange: (data: PricingRow[]) => void;
  selectedPricingRow: PricingRow | null;
  setSelectedPricingRow: (row: PricingRow | null) => void;
  isFutureMode: boolean;
  viewMode: ViewMode;
  analyticsRowData: AnalyticsRow[];
}

/** Props for the ViewSettingsDrawer component */
export interface ViewSettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isFutureMode: boolean;
  featureMode: string;
  setFeatureMode: (mode: string) => void;
}

/** Props for the FormulaComponentsGrid component */
export interface FormulaComponentsGridProps {
  components: FormulaComponent[];
  setComponents: React.Dispatch<React.SetStateAction<FormulaComponent[]>>;
  onAddRow: () => void;
  onOpenTemplateChooser?: () => void;
  onSaveAsTemplate?: () => void;
}

// =============================================================================
// AG Grid Typed Parameters
// =============================================================================

/** Typed cell style params for PricingRow grid */
export type PricingCellStyleParams = CellStyleParams<PricingRow>;

/** Typed value formatter params for PricingRow grid */
export type PricingValueFormatterParams = ValueFormatterParams<PricingRow>;

/** Typed cell renderer params for PricingRow grid */
export type PricingCellRendererParams = ICellRendererParams<PricingRow>;

/** Typed cell style params for AnalyticsRow grid */
export type AnalyticsCellStyleParams = CellStyleParams<AnalyticsRow>;

/** Typed cell renderer params for AnalyticsRow grid */
export type AnalyticsCellRendererParams = ICellRendererParams<AnalyticsRow>;

/** Typed cell style params for OfferData grid */
export type OfferCellStyleParams = CellStyleParams<OfferData>;

/** Typed cell renderer params for OfferData grid */
export type OfferCellRendererParams = ICellRendererParams<OfferData>;

/** Typed cell style params for FormulaComponent grid */
export type ComponentCellStyleParams = CellStyleParams<FormulaComponent>;

/** Typed cell renderer params for FormulaComponent grid */
export type ComponentCellRendererParams = ICellRendererParams<FormulaComponent>;

// =============================================================================
// Event Handler Types
// =============================================================================

/** Selection changed event handler type */
export type SelectionChangedHandler = (event: SelectionChangedEvent) => void;

/** Grid ready event handler type */
export type GridReadyHandler = (event: GridReadyEvent) => void;

// =============================================================================
// Bulk Change Types
// =============================================================================

/** Properties that can be bulk updated */
export type BulkChangeProperty = 'proposedDiff' | 'proposedPrice';

/** Bulk change update payload */
export interface BulkChangeUpdate {
  property: BulkChangeProperty;
  value: number;
}
