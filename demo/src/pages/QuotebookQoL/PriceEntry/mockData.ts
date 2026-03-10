// ─── Types ──────────────────────────────────────────────────────────────────

export type UploadType = 'Posting' | 'EffectiveStart' | 'EffectiveDates';

export interface PriceEntryResultComponent {
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
  /** Whether this component is a database-sourced price variable (editable) */
  IsPriceVariable: boolean;
  /** Upload type determines which date fields the inline form shows */
  UploadType: UploadType | null;
}

export interface PriceEntryFormulaDetail {
  FilledFormula: string;
  IsMissingPrices: boolean;
  CalculationDate: string;
  CalculationName: string;
  ForCounterPartyName: string;
  ForLocationName: string;
  Formula: string;
  ForProductName: string;
  Result: number;
  ResultComponents: PriceEntryResultComponent[];
}

export interface ContractValuesRow {
  CurvePointPriceId: number;
  TradeEntryId: number;
  TradeEntryDetailId: number;
  CounterPartyName: string;
  LocationName: string;
  ProductName: string;
  EffectiveFromDateTime: string;
  EffectiveToDateTime: string;
  UpdatedDateTime: string;
  Price: number | null;
  ValuationStatusDisplay: string;
}

// ─── Mock Grid Rows ─────────────────────────────────────────────────────────

export const mockContractValuesRows: ContractValuesRow[] = [
  {
    CurvePointPriceId: 2001,
    TradeEntryId: 7001,
    TradeEntryDetailId: 8001,
    CounterPartyName: 'Growmark Inc.',
    LocationName: 'Chicago Terminal',
    ProductName: 'ULSD',
    EffectiveFromDateTime: '2026-03-01T00:00:00',
    EffectiveToDateTime: '2026-03-31T23:59:59',
    UpdatedDateTime: '2026-03-09T14:30:00',
    Price: 2.4567,
    ValuationStatusDisplay: 'Complete',
  },
  {
    CurvePointPriceId: 2002,
    TradeEntryId: 7002,
    TradeEntryDetailId: 8002,
    CounterPartyName: 'HF Sinclair',
    LocationName: 'Tulsa Refinery',
    ProductName: 'ULSD',
    EffectiveFromDateTime: '2026-03-01T00:00:00',
    EffectiveToDateTime: '2026-03-31T23:59:59',
    UpdatedDateTime: '2026-03-07T09:15:00',
    Price: 2.389,
    ValuationStatusDisplay: 'Stale',
  },
  {
    CurvePointPriceId: 2003,
    TradeEntryId: 7003,
    TradeEntryDetailId: 8003,
    CounterPartyName: 'Motiva Enterprises',
    LocationName: 'Port Arthur',
    ProductName: 'Jet Fuel',
    EffectiveFromDateTime: '2026-03-01T00:00:00',
    EffectiveToDateTime: '2026-03-31T23:59:59',
    UpdatedDateTime: '2026-03-06T16:45:00',
    Price: null,
    ValuationStatusDisplay: 'Missing Prices',
  },
  {
    CurvePointPriceId: 2004,
    TradeEntryId: 7004,
    TradeEntryDetailId: 8004,
    CounterPartyName: 'Shell Trading',
    LocationName: 'Houston Ship Channel',
    ProductName: 'Unleaded Premium',
    EffectiveFromDateTime: '2026-03-01T00:00:00',
    EffectiveToDateTime: '2026-03-31T23:59:59',
    UpdatedDateTime: '2026-03-08T11:20:00',
    Price: 2.6789,
    ValuationStatusDisplay: 'Complete',
  },
];

// ─── Mock Formula Breakdowns ────────────────────────────────────────────────
// Each formula has a mix of: price variables (editable), fixed values (not editable),
// and one missing price to demonstrate the missing-price inline entry use case.

export const mockFormulaBreakdowns: Record<number, PriceEntryFormulaDetail> = {
  // Growmark ULSD - Posting upload type, all prices present
  2001: {
    FilledFormula: '(OPIS_ULSD_CHI + 0.0450) * 1.00',
    IsMissingPrices: false,
    CalculationDate: '2026-03-09T14:30:00',
    CalculationName: 'ULSD Chicago Rack + Basis',
    ForCounterPartyName: 'Growmark Inc.',
    ForLocationName: 'Chicago Terminal',
    Formula: '(VAR_RACK_PRICE + VAR_BASIS_ADJ) * VAR_VOLUME_FACTOR',
    ForProductName: 'ULSD',
    Result: 2.4567,
    ResultComponents: [
      {
        FormulaResultComponentId: 101,
        ComponentDisplayName: 'Rack Price',
        ComponentName: 'VAR_RACK_PRICE',
        ComponentResult: 2.4117,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Rack',
        PriceInstrumentName: 'OPIS ULSD Chicago Group 3',
        PriceInstrumentId: 5001,
        PriceTypeCvId: 10,
        EffectiveAsOfDate: '2026-03-09T14:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: true,
        UploadType: 'Posting',
      },
      {
        FormulaResultComponentId: 102,
        ComponentDisplayName: 'Basis Adjustment',
        ComponentName: 'VAR_BASIS_ADJ',
        ComponentResult: 0.045,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Adjustment',
        PriceInstrumentName: 'Chicago Terminal Basis',
        PriceInstrumentId: 5002,
        PriceTypeCvId: 20,
        EffectiveAsOfDate: '2026-03-09T14:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: true,
        UploadType: 'EffectiveStart',
      },
      {
        FormulaResultComponentId: 103,
        ComponentDisplayName: 'Volume Factor',
        ComponentName: 'VAR_VOLUME_FACTOR',
        ComponentResult: 1.0,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Fixed',
        PriceInstrumentName: '',
        PriceInstrumentId: 0,
        PriceTypeCvId: 0,
        EffectiveAsOfDate: '2026-03-09T14:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: false,
        UploadType: null,
      },
    ],
  },

  // HF Sinclair ULSD - EffectiveStart upload type, stale rack price
  2002: {
    FilledFormula: '(OPIS_ULSD_TULSA + 0.0320) * 1.00',
    IsMissingPrices: false,
    CalculationDate: '2026-03-07T09:15:00',
    CalculationName: 'ULSD Tulsa Rack + Basis',
    ForCounterPartyName: 'HF Sinclair',
    ForLocationName: 'Tulsa Refinery',
    Formula: '(VAR_RACK_PRICE + VAR_BASIS_ADJ) * VAR_VOLUME_FACTOR',
    ForProductName: 'ULSD',
    Result: 2.389,
    ResultComponents: [
      {
        FormulaResultComponentId: 201,
        ComponentDisplayName: 'Rack Price',
        ComponentName: 'VAR_RACK_PRICE',
        ComponentResult: 2.357,
        ComponentStatus: 'O',
        PriceTypeCodeValueDisplay: 'Rack',
        PriceInstrumentName: 'OPIS ULSD Tulsa Group 3',
        PriceInstrumentId: 5003,
        PriceTypeCvId: 10,
        EffectiveAsOfDate: '2026-03-06T14:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: true,
        UploadType: 'EffectiveStart',
      },
      {
        FormulaResultComponentId: 202,
        ComponentDisplayName: 'Basis Adjustment',
        ComponentName: 'VAR_BASIS_ADJ',
        ComponentResult: 0.032,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Adjustment',
        PriceInstrumentName: 'Tulsa Terminal Basis',
        PriceInstrumentId: 5004,
        PriceTypeCvId: 20,
        EffectiveAsOfDate: '2026-03-07T09:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: true,
        UploadType: 'EffectiveDates',
      },
      {
        FormulaResultComponentId: 203,
        ComponentDisplayName: 'Volume Factor',
        ComponentName: 'VAR_VOLUME_FACTOR',
        ComponentResult: 1.0,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Fixed',
        PriceInstrumentName: '',
        PriceInstrumentId: 0,
        PriceTypeCvId: 0,
        EffectiveAsOfDate: '2026-03-07T09:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: false,
        UploadType: null,
      },
    ],
  },

  // Motiva Jet Fuel - Missing rack price (key demo scenario)
  2003: {
    FilledFormula: '(??? + 0.0500) * 1.00',
    IsMissingPrices: true,
    CalculationDate: '2026-03-06T16:45:00',
    CalculationName: 'Jet Fuel Port Arthur Rack + Basis',
    ForCounterPartyName: 'Motiva Enterprises',
    ForLocationName: 'Port Arthur',
    Formula: '(VAR_RACK_PRICE + VAR_BASIS_ADJ) * VAR_VOLUME_FACTOR',
    ForProductName: 'Jet Fuel',
    Result: 0,
    ResultComponents: [
      {
        FormulaResultComponentId: 301,
        ComponentDisplayName: 'Rack Price',
        ComponentName: 'VAR_RACK_PRICE',
        ComponentResult: 0,
        ComponentStatus: 'M',
        PriceTypeCodeValueDisplay: 'Rack',
        PriceInstrumentName: 'OPIS Jet Fuel Port Arthur',
        PriceInstrumentId: 5005,
        PriceTypeCvId: 10,
        EffectiveAsOfDate: '',
        IsMissing: true,
        IsRequired: true,
        IsPriceVariable: true,
        UploadType: 'Posting',
      },
      {
        FormulaResultComponentId: 302,
        ComponentDisplayName: 'Basis Adjustment',
        ComponentName: 'VAR_BASIS_ADJ',
        ComponentResult: 0.05,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Adjustment',
        PriceInstrumentName: 'Port Arthur Terminal Basis',
        PriceInstrumentId: 5006,
        PriceTypeCvId: 20,
        EffectiveAsOfDate: '2026-03-06T16:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: true,
        UploadType: 'EffectiveStart',
      },
      {
        FormulaResultComponentId: 303,
        ComponentDisplayName: 'Volume Factor',
        ComponentName: 'VAR_VOLUME_FACTOR',
        ComponentResult: 1.0,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Fixed',
        PriceInstrumentName: '',
        PriceInstrumentId: 0,
        PriceTypeCvId: 0,
        EffectiveAsOfDate: '2026-03-06T16:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: false,
        UploadType: null,
      },
    ],
  },

  // Shell Unleaded Premium - EffectiveDates upload type
  2004: {
    FilledFormula: '(OPIS_UNL_PREM_HSC + 0.0560) * 1.00',
    IsMissingPrices: false,
    CalculationDate: '2026-03-08T11:20:00',
    CalculationName: 'Unleaded Premium HSC Rack + Basis',
    ForCounterPartyName: 'Shell Trading',
    ForLocationName: 'Houston Ship Channel',
    Formula: '(VAR_RACK_PRICE + VAR_BASIS_ADJ) * VAR_VOLUME_FACTOR',
    ForProductName: 'Unleaded Premium',
    Result: 2.6789,
    ResultComponents: [
      {
        FormulaResultComponentId: 401,
        ComponentDisplayName: 'Rack Price',
        ComponentName: 'VAR_RACK_PRICE',
        ComponentResult: 2.6229,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Rack',
        PriceInstrumentName: 'OPIS Unleaded Premium Houston SC',
        PriceInstrumentId: 5007,
        PriceTypeCvId: 10,
        EffectiveAsOfDate: '2026-03-08T11:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: true,
        UploadType: 'EffectiveDates',
      },
      {
        FormulaResultComponentId: 402,
        ComponentDisplayName: 'Basis Adjustment',
        ComponentName: 'VAR_BASIS_ADJ',
        ComponentResult: 0.056,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'Adjustment',
        PriceInstrumentName: 'Houston SC Premium Basis',
        PriceInstrumentId: 5008,
        PriceTypeCvId: 20,
        EffectiveAsOfDate: '2026-03-08T11:00:00',
        IsMissing: false,
        IsRequired: true,
        IsPriceVariable: true,
        UploadType: 'EffectiveStart',
      },
      {
        FormulaResultComponentId: 403,
        ComponentDisplayName: 'External Provider Rate',
        ComponentName: 'VAR_EXT_RATE',
        ComponentResult: 0,
        ComponentStatus: 'A',
        PriceTypeCodeValueDisplay: 'ExternalProvider',
        PriceInstrumentName: '',
        PriceInstrumentId: 0,
        PriceTypeCvId: 0,
        EffectiveAsOfDate: '2026-03-08T11:00:00',
        IsMissing: false,
        IsRequired: false,
        IsPriceVariable: false,
        UploadType: null,
      },
    ],
  },
};
