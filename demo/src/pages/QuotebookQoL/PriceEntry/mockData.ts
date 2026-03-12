// ─── Types ──────────────────────────────────────────────────────────────────

export type UploadType = 'Posting' | 'EffectiveStart' | 'EffectiveDates';

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
  Updated: string;
}

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

  // Shell Unleaded Premium — EffectiveDates upload type
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

// ─── Mock Price History Data ────────────────────────────────────────────────
// Keyed by PriceInstrumentId. Each instrument has prices spanning Mar 8-13 2026
// so the default filter (yesterday through tomorrow = Mar 10-12) shows a subset.

export const mockPriceHistory: Record<number, PriceHistoryRow[]> = {
  // OPIS ULSD Chicago Group 3
  5001: [
    { PriceHistoryId: 1001, InstrumentName: 'OPIS ULSD Chicago Group 3', PriceType: 'Rack', PriceValue: 2.3920, EffectiveFrom: '2026-03-08T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Chicago Terminal', Updated: '2026-03-08T14:00:00' },
    { PriceHistoryId: 1002, InstrumentName: 'OPIS ULSD Chicago Group 3', PriceType: 'Rack', PriceValue: 2.3985, EffectiveFrom: '2026-03-09T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Chicago Terminal', Updated: '2026-03-09T14:15:00' },
    { PriceHistoryId: 1003, InstrumentName: 'OPIS ULSD Chicago Group 3', PriceType: 'Rack', PriceValue: 2.4050, EffectiveFrom: '2026-03-10T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Chicago Terminal', Updated: '2026-03-10T14:30:00' },
    { PriceHistoryId: 1004, InstrumentName: 'OPIS ULSD Chicago Group 3', PriceType: 'Rack', PriceValue: 2.4117, EffectiveFrom: '2026-03-11T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Chicago Terminal', Updated: '2026-03-11T08:15:00' },
    { PriceHistoryId: 1005, InstrumentName: 'OPIS ULSD Chicago Group 3', PriceType: 'Rack', PriceValue: 2.4200, EffectiveFrom: '2026-03-12T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Chicago Terminal', Updated: '2026-03-11T16:00:00' },
  ],
  // Chicago Terminal Basis
  5002: [
    { PriceHistoryId: 1011, InstrumentName: 'Chicago Terminal Basis', PriceType: 'Adjustment', PriceValue: 0.0440, EffectiveFrom: '2026-03-08T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'ULSD', Location: 'Chicago Terminal', Updated: '2026-03-08T10:00:00' },
    { PriceHistoryId: 1012, InstrumentName: 'Chicago Terminal Basis', PriceType: 'Adjustment', PriceValue: 0.0450, EffectiveFrom: '2026-03-10T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'ULSD', Location: 'Chicago Terminal', Updated: '2026-03-10T09:30:00' },
    { PriceHistoryId: 1013, InstrumentName: 'Chicago Terminal Basis', PriceType: 'Adjustment', PriceValue: 0.0460, EffectiveFrom: '2026-03-12T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'ULSD', Location: 'Chicago Terminal', Updated: '2026-03-11T17:00:00' },
  ],
  // OPIS ULSD Tulsa Group 3
  5003: [
    { PriceHistoryId: 1021, InstrumentName: 'OPIS ULSD Tulsa Group 3', PriceType: 'Rack', PriceValue: 2.3410, EffectiveFrom: '2026-03-08T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Tulsa Refinery', Updated: '2026-03-08T14:00:00' },
    { PriceHistoryId: 1022, InstrumentName: 'OPIS ULSD Tulsa Group 3', PriceType: 'Rack', PriceValue: 2.3500, EffectiveFrom: '2026-03-09T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Tulsa Refinery', Updated: '2026-03-09T14:10:00' },
    { PriceHistoryId: 1023, InstrumentName: 'OPIS ULSD Tulsa Group 3', PriceType: 'Rack', PriceValue: 2.3570, EffectiveFrom: '2026-03-10T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Tulsa Refinery', Updated: '2026-03-10T14:20:00' },
    { PriceHistoryId: 1024, InstrumentName: 'OPIS ULSD Tulsa Group 3', PriceType: 'Rack', PriceValue: 2.3650, EffectiveFrom: '2026-03-11T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'ULSD', Location: 'Tulsa Refinery', Updated: '2026-03-11T08:30:00' },
  ],
  // Tulsa Terminal Basis
  5004: [
    { PriceHistoryId: 1031, InstrumentName: 'Tulsa Terminal Basis', PriceType: 'Adjustment', PriceValue: 0.0310, EffectiveFrom: '2026-03-08T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'ULSD', Location: 'Tulsa Refinery', Updated: '2026-03-08T09:00:00' },
    { PriceHistoryId: 1032, InstrumentName: 'Tulsa Terminal Basis', PriceType: 'Adjustment', PriceValue: 0.0320, EffectiveFrom: '2026-03-10T00:00:00', EffectiveTo: '2026-03-31T23:59:59', Publisher: 'Internal', Product: 'ULSD', Location: 'Tulsa Refinery', Updated: '2026-03-10T09:15:00' },
    { PriceHistoryId: 1033, InstrumentName: 'Tulsa Terminal Basis', PriceType: 'Adjustment', PriceValue: 0.0330, EffectiveFrom: '2026-03-12T00:00:00', EffectiveTo: '2026-03-31T23:59:59', Publisher: 'Internal', Product: 'ULSD', Location: 'Tulsa Refinery', Updated: '2026-03-11T16:45:00' },
  ],
  // OPIS Jet Fuel Port Arthur (missing price scenario — only old prices)
  5005: [
    { PriceHistoryId: 1041, InstrumentName: 'OPIS Jet Fuel Port Arthur', PriceType: 'Rack', PriceValue: 2.5100, EffectiveFrom: '2026-03-06T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'Jet Fuel', Location: 'Port Arthur', Updated: '2026-03-06T14:00:00' },
    { PriceHistoryId: 1042, InstrumentName: 'OPIS Jet Fuel Port Arthur', PriceType: 'Rack', PriceValue: 2.5250, EffectiveFrom: '2026-03-08T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'Jet Fuel', Location: 'Port Arthur', Updated: '2026-03-08T14:15:00' },
    { PriceHistoryId: 1043, InstrumentName: 'OPIS Jet Fuel Port Arthur', PriceType: 'Rack', PriceValue: 2.5380, EffectiveFrom: '2026-03-09T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'Jet Fuel', Location: 'Port Arthur', Updated: '2026-03-09T14:30:00' },
  ],
  // Port Arthur Terminal Basis
  5006: [
    { PriceHistoryId: 1051, InstrumentName: 'Port Arthur Terminal Basis', PriceType: 'Adjustment', PriceValue: 0.0490, EffectiveFrom: '2026-03-08T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'Jet Fuel', Location: 'Port Arthur', Updated: '2026-03-08T10:00:00' },
    { PriceHistoryId: 1052, InstrumentName: 'Port Arthur Terminal Basis', PriceType: 'Adjustment', PriceValue: 0.0500, EffectiveFrom: '2026-03-10T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'Jet Fuel', Location: 'Port Arthur', Updated: '2026-03-10T09:00:00' },
  ],
  // OPIS Unleaded Premium Houston SC
  5007: [
    { PriceHistoryId: 1061, InstrumentName: 'OPIS Unleaded Premium Houston SC', PriceType: 'Rack', PriceValue: 2.6050, EffectiveFrom: '2026-03-08T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'Unleaded Premium', Location: 'Houston Ship Channel', Updated: '2026-03-08T14:00:00' },
    { PriceHistoryId: 1062, InstrumentName: 'OPIS Unleaded Premium Houston SC', PriceType: 'Rack', PriceValue: 2.6140, EffectiveFrom: '2026-03-09T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'Unleaded Premium', Location: 'Houston Ship Channel', Updated: '2026-03-09T14:20:00' },
    { PriceHistoryId: 1063, InstrumentName: 'OPIS Unleaded Premium Houston SC', PriceType: 'Rack', PriceValue: 2.6229, EffectiveFrom: '2026-03-10T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'Unleaded Premium', Location: 'Houston Ship Channel', Updated: '2026-03-10T14:30:00' },
    { PriceHistoryId: 1064, InstrumentName: 'OPIS Unleaded Premium Houston SC', PriceType: 'Rack', PriceValue: 2.6310, EffectiveFrom: '2026-03-11T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'Unleaded Premium', Location: 'Houston Ship Channel', Updated: '2026-03-11T08:00:00' },
    { PriceHistoryId: 1065, InstrumentName: 'OPIS Unleaded Premium Houston SC', PriceType: 'Rack', PriceValue: 2.6400, EffectiveFrom: '2026-03-12T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'OPIS', Product: 'Unleaded Premium', Location: 'Houston Ship Channel', Updated: '2026-03-11T16:30:00' },
  ],
  // Houston SC Premium Basis
  5008: [
    { PriceHistoryId: 1071, InstrumentName: 'Houston SC Premium Basis', PriceType: 'Adjustment', PriceValue: 0.0550, EffectiveFrom: '2026-03-08T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'Unleaded Premium', Location: 'Houston Ship Channel', Updated: '2026-03-08T10:00:00' },
    { PriceHistoryId: 1072, InstrumentName: 'Houston SC Premium Basis', PriceType: 'Adjustment', PriceValue: 0.0560, EffectiveFrom: '2026-03-10T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'Unleaded Premium', Location: 'Houston Ship Channel', Updated: '2026-03-10T09:30:00' },
    { PriceHistoryId: 1073, InstrumentName: 'Houston SC Premium Basis', PriceType: 'Adjustment', PriceValue: 0.0570, EffectiveFrom: '2026-03-12T00:00:00', EffectiveTo: '9999-12-31T23:59:59', Publisher: 'Internal', Product: 'Unleaded Premium', Location: 'Houston Ship Channel', Updated: '2026-03-11T17:00:00' },
  ],
};
