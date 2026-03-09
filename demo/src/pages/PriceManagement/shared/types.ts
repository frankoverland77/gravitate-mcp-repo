// ─── Price Management Types ──────────────────────────────────────────────────

export type UploadType = 'Posting' | 'EffectiveStart' | 'EffectiveDates';
export type EstimateActual = 'Actual' | 'Estimate';

/** Context passed to the PriceManagementDrawer from any launching surface */
export interface PriceInstrumentContext {
  instrumentId: number;
  instrumentName: string;
  product: string;
  location: string;
  counterparty: string;
  currentPrice: number | null;
  priceType: string;
  publisher: string;
  effectiveFrom: string;
  effectiveTo: string;
  asOfDate: string;
}

/** Row in the All Prices report grid */
export interface AllPricesRow {
  PriceId: number;
  PriceInstrumentId: number;
  InstrumentName: string;
  Product: string;
  Location: string;
  Counterparty: string;
  EffectiveFrom: string;
  EffectiveTo: string;
  Price: number | null;
  PriceType: string;
  Publisher: string;
  Status: 'Actual' | 'Estimate';
  UpdatedDateTime: string;
  Source: 'Database' | 'External';
}

/** Row in the Contract Values grid */
export interface ContractValuesRow {
  CurvePointPriceId: number;
  TradeEntryId: number;
  TradeEntryDetailId: number;
  CounterPartyName: string;
  LocationName: string;
  ProductName: string;
  FormulaName: string;
  EffectiveFromDateTime: string;
  EffectiveToDateTime: string;
  UpdatedDateTime: string;
  Price: number | null;
  ValuationStatusDisplay: string;
}

/** Formula variable row in the valuation drawer */
export interface FormulaResultComponent {
  FormulaResultComponentId: number;
  ComponentDisplayName: string;
  ComponentName: string;
  ComponentResult: number;
  ComponentStatus: 'A' | 'M' | 'O' | 'E';
  PriceTypeCodeValueDisplay: string;
  PriceInstrumentName: string;
  PriceInstrumentId: number;
  PriceTypeCvId: number;
  EffectiveAsOfDate: string;
  IsMissing: boolean;
  IsRequired: boolean;
  IsPriceVariable: boolean;
  UploadType: UploadType | null;
}

/** Full formula breakdown for the valuation drawer */
export interface FormulaBreakdownDetail {
  FilledFormula: string;
  IsMissingPrices: boolean;
  CalculationDate: string;
  CalculationName: string;
  ForCounterPartyName: string;
  ForLocationName: string;
  Formula: string;
  ForProductName: string;
  Result: number;
  ResultComponents: FormulaResultComponent[];
}

/** Row in the price history grid */
export interface PriceHistoryRow {
  PriceHistoryId: number;
  InstrumentName: string;
  PriceType: string;
  PriceValue: number;
  EffectiveFrom: string;
  EffectiveTo: string;
  Publisher: string;
  Product: string;
  Location: string;
  Counterparty: string;
  Updated: string;
}

/** Form values for saving a price */
export interface PriceFormValues {
  priceValue: number;
  estimateActual: EstimateActual;
  uploadType: UploadType;
  effectiveFrom?: dayjs.Dayjs;
  effectiveTo?: dayjs.Dayjs;
}

/** Result returned after a successful price save */
export interface SavedPriceResult {
  curvePointPriceId: number;
  instrumentId: number;
  value: number;
  effectiveFrom: string;
  effectiveTo: string;
  wasEndDated: boolean;
  endDatedInstrumentName?: string;
}

import dayjs from 'dayjs';
