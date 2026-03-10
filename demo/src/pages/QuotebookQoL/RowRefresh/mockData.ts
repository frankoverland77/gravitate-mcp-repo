// ─── Types ──────────────────────────────────────────────────────────────────

export interface QuotebookRow {
  QuoteConfigurationMappingId: number;
  SpreadFamilyId: number | null;
  IsSpreadParent: boolean;
  ParentMappingId: number | null;
  QuoteGroupName: string;
  ProductName: string;
  LocationName: string;
  CounterPartyName: string;
  PriorPrice: number | null;
  CurrentPrice: number | null;
  ProposedPrice: number | null;
  SpreadOverride: number | null;
  Adjustment: number | null;
  MarketMove: number | null;
  ValuationResult: number | null;
  PublicationMode: string;
  UpdatedDateTime: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
// Three spread families + standalone rows to demonstrate the row refresh UX

export const mockQuotebookRows: QuotebookRow[] = [
  // ── Spread Family 1: Growmark Chicago ULSD (parent + 3 children) ──
  {
    QuoteConfigurationMappingId: 101,
    SpreadFamilyId: 1,
    IsSpreadParent: true,
    ParentMappingId: null,
    QuoteGroupName: 'Growmark IL',
    ProductName: 'ULSD',
    LocationName: 'Chicago Terminal',
    CounterPartyName: 'Growmark Inc.',
    PriorPrice: 2.4120,
    CurrentPrice: 2.4567,
    ProposedPrice: 2.4567,
    SpreadOverride: null,
    Adjustment: 0.0450,
    MarketMove: 0.0120,
    ValuationResult: 2.4567,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-09T14:30:00',
  },
  {
    QuoteConfigurationMappingId: 102,
    SpreadFamilyId: 1,
    IsSpreadParent: false,
    ParentMappingId: 101,
    QuoteGroupName: 'Growmark IL',
    ProductName: 'ULSD',
    LocationName: 'Joliet Terminal',
    CounterPartyName: 'Growmark Inc.',
    PriorPrice: 2.4220,
    CurrentPrice: 2.4667,
    ProposedPrice: 2.4667,
    SpreadOverride: 0.0100,
    Adjustment: 0.0450,
    MarketMove: 0.0120,
    ValuationResult: 2.4667,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-09T14:30:00',
  },
  {
    QuoteConfigurationMappingId: 103,
    SpreadFamilyId: 1,
    IsSpreadParent: false,
    ParentMappingId: 101,
    QuoteGroupName: 'Growmark IL',
    ProductName: 'ULSD',
    LocationName: 'Springfield Terminal',
    CounterPartyName: 'Growmark Inc.',
    PriorPrice: 2.4320,
    CurrentPrice: 2.4767,
    ProposedPrice: 2.4767,
    SpreadOverride: 0.0200,
    Adjustment: 0.0450,
    MarketMove: 0.0120,
    ValuationResult: 2.4767,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-09T14:30:00',
  },
  {
    QuoteConfigurationMappingId: 104,
    SpreadFamilyId: 1,
    IsSpreadParent: false,
    ParentMappingId: 101,
    QuoteGroupName: 'Growmark IL',
    ProductName: 'ULSD',
    LocationName: 'Peoria Terminal',
    CounterPartyName: 'Growmark Inc.',
    PriorPrice: 2.4020,
    CurrentPrice: 2.4467,
    ProposedPrice: 2.4467,
    SpreadOverride: -0.0100,
    Adjustment: 0.0450,
    MarketMove: 0.0120,
    ValuationResult: 2.4467,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-09T14:30:00',
  },

  // ── Standalone Row: Growmark Unleaded ──
  {
    QuoteConfigurationMappingId: 105,
    SpreadFamilyId: null,
    IsSpreadParent: false,
    ParentMappingId: null,
    QuoteGroupName: 'Growmark IL',
    ProductName: 'Unleaded Regular',
    LocationName: 'Chicago Terminal',
    CounterPartyName: 'Growmark Inc.',
    PriorPrice: 2.0890,
    CurrentPrice: 2.1234,
    ProposedPrice: 2.1234,
    SpreadOverride: null,
    Adjustment: 0.0380,
    MarketMove: 0.0085,
    ValuationResult: 2.1234,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-09T14:30:00',
  },

  // ── Spread Family 2: HF Sinclair Tulsa ULSD (parent + 2 children) ──
  {
    QuoteConfigurationMappingId: 201,
    SpreadFamilyId: 2,
    IsSpreadParent: true,
    ParentMappingId: null,
    QuoteGroupName: 'HF Sinclair OK',
    ProductName: 'ULSD',
    LocationName: 'Tulsa Refinery',
    CounterPartyName: 'HF Sinclair',
    PriorPrice: 2.3550,
    CurrentPrice: 2.3890,
    ProposedPrice: 2.3890,
    SpreadOverride: null,
    Adjustment: 0.0320,
    MarketMove: 0.0095,
    ValuationResult: 2.3890,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-08T09:15:00',
  },
  {
    QuoteConfigurationMappingId: 202,
    SpreadFamilyId: 2,
    IsSpreadParent: false,
    ParentMappingId: 201,
    QuoteGroupName: 'HF Sinclair OK',
    ProductName: 'ULSD',
    LocationName: 'OKC Terminal',
    CounterPartyName: 'HF Sinclair',
    PriorPrice: 2.3650,
    CurrentPrice: 2.3990,
    ProposedPrice: 2.3990,
    SpreadOverride: 0.0100,
    Adjustment: 0.0320,
    MarketMove: 0.0095,
    ValuationResult: 2.3990,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-08T09:15:00',
  },
  {
    QuoteConfigurationMappingId: 203,
    SpreadFamilyId: 2,
    IsSpreadParent: false,
    ParentMappingId: 201,
    QuoteGroupName: 'HF Sinclair OK',
    ProductName: 'ULSD',
    LocationName: 'Enid Terminal',
    CounterPartyName: 'HF Sinclair',
    PriorPrice: 2.3750,
    CurrentPrice: 2.4090,
    ProposedPrice: 2.4090,
    SpreadOverride: 0.0200,
    Adjustment: 0.0320,
    MarketMove: 0.0095,
    ValuationResult: 2.4090,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-08T09:15:00',
  },

  // ── Standalone Row: HF Sinclair Jet Fuel ──
  {
    QuoteConfigurationMappingId: 204,
    SpreadFamilyId: null,
    IsSpreadParent: false,
    ParentMappingId: null,
    QuoteGroupName: 'HF Sinclair OK',
    ProductName: 'Jet Fuel',
    LocationName: 'Tulsa Refinery',
    CounterPartyName: 'HF Sinclair',
    PriorPrice: 2.5100,
    CurrentPrice: 2.5440,
    ProposedPrice: 2.5440,
    SpreadOverride: null,
    Adjustment: 0.0500,
    MarketMove: 0.0110,
    ValuationResult: 2.5440,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-08T09:15:00',
  },

  // ── Spread Family 3: Motiva Port Arthur (parent + 2 children) ──
  {
    QuoteConfigurationMappingId: 301,
    SpreadFamilyId: 3,
    IsSpreadParent: true,
    ParentMappingId: null,
    QuoteGroupName: 'Motiva TX',
    ProductName: 'ULSD',
    LocationName: 'Port Arthur Refinery',
    CounterPartyName: 'Motiva Enterprises',
    PriorPrice: 2.4800,
    CurrentPrice: 2.5120,
    ProposedPrice: 2.5120,
    SpreadOverride: null,
    Adjustment: 0.0410,
    MarketMove: 0.0105,
    ValuationResult: 2.5120,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-09T08:00:00',
  },
  {
    QuoteConfigurationMappingId: 302,
    SpreadFamilyId: 3,
    IsSpreadParent: false,
    ParentMappingId: 301,
    QuoteGroupName: 'Motiva TX',
    ProductName: 'ULSD',
    LocationName: 'Houston Terminal',
    CounterPartyName: 'Motiva Enterprises',
    PriorPrice: 2.4900,
    CurrentPrice: 2.5220,
    ProposedPrice: 2.5220,
    SpreadOverride: 0.0100,
    Adjustment: 0.0410,
    MarketMove: 0.0105,
    ValuationResult: 2.5220,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-09T08:00:00',
  },
  {
    QuoteConfigurationMappingId: 303,
    SpreadFamilyId: 3,
    IsSpreadParent: false,
    ParentMappingId: 301,
    QuoteGroupName: 'Motiva TX',
    ProductName: 'ULSD',
    LocationName: 'Beaumont Terminal',
    CounterPartyName: 'Motiva Enterprises',
    PriorPrice: 2.4850,
    CurrentPrice: 2.5170,
    ProposedPrice: 2.5170,
    SpreadOverride: 0.0050,
    Adjustment: 0.0410,
    MarketMove: 0.0105,
    ValuationResult: 2.5170,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-09T08:00:00',
  },

  // ── Standalone Rows ──
  {
    QuoteConfigurationMappingId: 401,
    SpreadFamilyId: null,
    IsSpreadParent: false,
    ParentMappingId: null,
    QuoteGroupName: 'Shell TX',
    ProductName: 'Unleaded Premium',
    LocationName: 'Houston Ship Channel',
    CounterPartyName: 'Shell Trading',
    PriorPrice: 2.6450,
    CurrentPrice: 2.6789,
    ProposedPrice: 2.6789,
    SpreadOverride: null,
    Adjustment: 0.0560,
    MarketMove: 0.0130,
    ValuationResult: 2.6789,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-08T11:20:00',
  },
  {
    QuoteConfigurationMappingId: 402,
    SpreadFamilyId: null,
    IsSpreadParent: false,
    ParentMappingId: null,
    QuoteGroupName: 'Shell TX',
    ProductName: 'ULSD',
    LocationName: 'Houston Ship Channel',
    CounterPartyName: 'Shell Trading',
    PriorPrice: 2.4300,
    CurrentPrice: 2.4650,
    ProposedPrice: 2.4650,
    SpreadOverride: null,
    Adjustment: 0.0420,
    MarketMove: 0.0115,
    ValuationResult: 2.4650,
    PublicationMode: 'EOD',
    UpdatedDateTime: '2026-03-08T11:20:00',
  },
];

// ─── Helper: Get spread family members for a given row ──────────────────────

export function getSpreadFamilyIds(
  row: QuotebookRow,
  allRows: QuotebookRow[]
): number[] {
  if (!row.SpreadFamilyId) {
    // Standalone row — just itself
    return [row.QuoteConfigurationMappingId];
  }
  // Return all rows in the same spread family
  return allRows
    .filter((r) => r.SpreadFamilyId === row.SpreadFamilyId)
    .map((r) => r.QuoteConfigurationMappingId);
}
