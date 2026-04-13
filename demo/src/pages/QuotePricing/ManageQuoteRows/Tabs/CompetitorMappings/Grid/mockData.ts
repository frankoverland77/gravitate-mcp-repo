import { getProductById, getLocationById } from '../../../../../../shared/data'

export type CompetitorAssociation = {
  id: number
  name: string
  publisher: string
  region: string
  terminal: string
  productGroup: string
  product: string
  visibility: 'Show' | 'Hide' | 'Highlight'
}

export type CompetitorQuoteRow = {
  id: number
  configurationName: string
  counterparty: string
  locationId: number
  productId: number
  costType: string
  existingCompetitorCount: number
  existingCompetitors: string[]
  competitorAssociations: CompetitorAssociation[]
}

export type CompetitorInstrument = {
  id: number
  competitor: string
  publisher: string
  terminal: string
  product: string
}

export type MatchResult = {
  quoteRowId: number
  instruments: (CompetitorInstrument & { alreadyExists: boolean })[]
}

/** Resolve a location ID to its display name */
export function getLocationName(locationId: number): string {
  const loc = getLocationById(locationId)
  return loc ? `${loc.Name}, ${loc.State}` : `Location ${locationId}`
}

/** Resolve a product ID to its display name */
export function getProductName(productId: number): string {
  const prod = getProductById(productId)
  return prod ? prod.Name : `Product ${productId}`
}

const _rawQuoteRows: Omit<CompetitorQuoteRow, 'competitorAssociations'>[] = [
  // Branded Rack Prices (8 rows)
  {
    id: 1,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    locationId: 118, // Albuquerque, NM
    productId: 41,   // U/L10%
    costType: 'P. COST',
    existingCompetitorCount: 8,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL', 'VALERO', 'TESORO', 'CONOCOPHILLIPS'],
  },
  {
    id: 2,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    locationId: 118, // Albuquerque, NM
    productId: 81,   // PRM10%
    costType: 'P. COST',
    existingCompetitorCount: 6,
    existingCompetitors: ['CHEVRON', 'SHELL', 'VALERO', 'MARATHON', 'EXXONMOBIL', 'TESORO'],
  },
  {
    id: 3,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    locationId: 118, // Albuquerque, NM
    productId: 57,   // M/G10%
    costType: 'P. COST',
    existingCompetitorCount: 4,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'SHELL', 'VALERO'],
  },
  {
    id: 4,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    locationId: 3,   // Dallas, TX
    productId: 41,   // U/L10%
    costType: 'P. COST',
    existingCompetitorCount: 0,
    existingCompetitors: [],
  },
  {
    id: 5,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    locationId: 3,   // Dallas, TX
    productId: 4,    // ULSD 2
    costType: 'R. COST',
    existingCompetitorCount: 3,
    existingCompetitors: ['CHEVRON', 'MARATHON', 'SHELL'],
  },
  {
    id: 6,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    locationId: 110, // Denver, CO
    productId: 41,   // U/L10%
    costType: 'P. COST',
    existingCompetitorCount: 5,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL'],
  },
  {
    id: 7,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    locationId: 110, // Denver, CO
    productId: 81,   // PRM10%
    costType: 'P. COST',
    existingCompetitorCount: 7,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL', 'VALERO', 'TESORO'],
  },
  {
    id: 8,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    locationId: 14,  // El Paso, TX
    productId: 41,   // U/L10%
    costType: 'P. COST',
    existingCompetitorCount: 0,
    existingCompetitors: [],
  },
  // Unbranded Rack Prices (7 rows)
  {
    id: 9,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    locationId: 118, // Albuquerque, NM
    productId: 41,   // U/L10%
    costType: 'P. COST',
    existingCompetitorCount: 5,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'VALERO', 'CONOCOPHILLIPS'],
  },
  {
    id: 10,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    locationId: 118, // Albuquerque, NM
    productId: 4,    // ULSD 2
    costType: 'P. COST',
    existingCompetitorCount: 3,
    existingCompetitors: ['CHEVRON', 'MARATHON', 'VALERO'],
  },
  {
    id: 11,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    locationId: 3,   // Dallas, TX
    productId: 41,   // U/L10%
    costType: 'P. COST',
    existingCompetitorCount: 10,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL', 'VALERO', 'TESORO', 'CONOCOPHILLIPS', 'CITGO', 'FLINT HILLS'],
  },
  {
    id: 12,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    locationId: 3,   // Dallas, TX
    productId: 81,   // PRM10%
    costType: 'R. COST',
    existingCompetitorCount: 4,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'SHELL', 'VALERO'],
  },
  {
    id: 13,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    locationId: 110, // Denver, CO
    productId: 41,   // U/L10%
    costType: 'P. COST',
    existingCompetitorCount: 0,
    existingCompetitors: [],
  },
  {
    id: 14,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    locationId: 14,  // El Paso, TX
    productId: 57,   // M/G10%
    costType: 'P. COST',
    existingCompetitorCount: 2,
    existingCompetitors: ['MARATHON', 'VALERO'],
  },
  {
    id: 15,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    locationId: 14,  // El Paso, TX
    productId: 41,   // U/L10%
    costType: 'R. COST',
    existingCompetitorCount: 6,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL', 'CONOCOPHILLIPS'],
  },
]

export const allCompetitors: { name: string; fullName: string; publisher: string }[] = [
  { name: 'CHEVRON', fullName: 'CHEVRON PRODUCTS CO', publisher: 'OPIS Competitor BR' },
  { name: 'EXXONMOBIL', fullName: 'EXXONMOBIL ARC', publisher: 'OPIS Competitor BR' },
  { name: 'MARATHON', fullName: 'MARATHON PETROLEUM', publisher: 'OPIS Competitor BR' },
  { name: 'PHILLIPS 66', fullName: 'PHILLIPS 66 COMPANY', publisher: 'OPIS Competitor BR' },
  { name: 'SHELL', fullName: 'SHELL OIL PRODUCTS', publisher: 'OPIS Competitor BR' },
  { name: 'VALERO', fullName: 'VALERO MARKETING', publisher: 'OPIS Competitor BR' },
  { name: 'TESORO', fullName: 'TESORO - 2000009', publisher: 'OPIS Competitor UB' },
  { name: 'CONOCOPHILLIPS', fullName: 'CONOCOPHILLIPS - SAP', publisher: 'OPIS Competitor UB' },
  { name: 'CITGO', fullName: 'Citgo', publisher: 'OPIS Competitor BR' },
  { name: 'FLINT HILLS', fullName: 'FlntHlsRs', publisher: 'OPIS Competitor UB' },
  { name: '76-MOT', fullName: '76-Mot', publisher: 'OPIS Competitor BR' },
  { name: 'GULF', fullName: 'Gulf', publisher: 'OPIS Competitor BR' },
  { name: 'MPC-ARCO', fullName: 'MPC-ARCO', publisher: 'OPIS Competitor BR' },
  { name: 'MOTIVA', fullName: 'Motiva', publisher: 'OPIS Competitor UB' },
  { name: 'SHELL-MOT', fullName: 'Shell-Mot', publisher: 'OPIS Competitor BR' },
  { name: 'SUNOCO', fullName: 'Sunoco', publisher: 'OPIS Competitor BR' },
  { name: 'TEXACO', fullName: 'Texaco', publisher: 'OPIS Competitor BR' },
  { name: 'MURPHY', fullName: 'Murphy', publisher: 'OPIS Competitor UB' },
  { name: 'TARTANOIL', fullName: 'TartanOil', publisher: 'OPIS Competitor UB' },
  { name: 'XOM', fullName: 'XOM', publisher: 'OPIS Competitor BR' },
]

/** Generate competitor associations for a quote row based on its existing competitors */
function generateAssociations(
  row: { id: number; existingCompetitors: string[]; locationId: number; productId: number },
): CompetitorAssociation[] {
  const terminalName = getLocationName(row.locationId)
  const productName = getProductName(row.productId)
  const productGroup = productName.includes('10%') ? 'Diesel' : 'Diesel'

  return row.existingCompetitors.map((name, idx) => {
    const comp = allCompetitors.find(
      (c) => c.name === name,
    )
    return {
      id: row.id * 1000 + idx,
      name: comp?.fullName ?? name,
      publisher: comp?.publisher ?? 'OPIS Competitor BR',
      region: '',
      terminal: terminalName,
      productGroup,
      product: productName,
      visibility: idx === row.existingCompetitors.length - 2 ? 'Hide' as const : 'Show' as const,
    }
  })
}

export const competitorQuoteRows: CompetitorQuoteRow[] = _rawQuoteRows.map((row) => ({
  ...row,
  competitorAssociations: generateAssociations(row),
}))

export function generateMatchResults(
  selectedRows: CompetitorQuoteRow[],
  publisher: string,
): MatchResult[] {
  const publisherLabel =
    publisher === 'opis-br'
      ? 'OPIS Competitor BR'
      : publisher === 'opis-ub'
        ? 'OPIS Competitor UB'
        : publisher === 'platts'
          ? 'Platts'
          : 'Argus'

  return selectedRows.map((row) => {
    // Pick 5-8 competitors per row
    const competitorCount = 5 + Math.floor(Math.abs(Math.sin(row.id * 7)) * 3)
    const shuffled = [...allCompetitors].sort(
      (a, b) =>
        Math.sin(a.name.length * row.id) - Math.sin(b.name.length * row.id),
    )
    const chosen = shuffled.slice(0, competitorCount)

    const terminalName = getLocationName(row.locationId)
    const productName = getProductName(row.productId)

    const instruments = chosen.map((c, idx) => ({
      id: row.id * 100 + idx,
      competitor: c.fullName,
      publisher: publisherLabel,
      terminal: terminalName,
      product: productName,
      alreadyExists: row.existingCompetitors.includes(c.name),
    }))

    return { quoteRowId: row.id, instruments }
  })
}

/** Set a single association's visibility to a specific value (immutable update) */
export function setAssociationVisibility(
  rows: CompetitorQuoteRow[],
  quoteRowId: number,
  associationId: number,
  value: 'Show' | 'Hide' | 'Highlight',
): CompetitorQuoteRow[] {
  return rows.map((row) => {
    if (row.id !== quoteRowId) return row
    return {
      ...row,
      competitorAssociations: row.competitorAssociations.map((a) => {
        if (a.id !== associationId) return a
        return { ...a, visibility: value }
      }),
    }
  })
}

/** Set visibility on multiple associations at once (immutable update) */
export function bulkSetVisibility(
  rows: CompetitorQuoteRow[],
  quoteRowId: number,
  associationIds: number[],
  value: 'Show' | 'Hide' | 'Highlight',
): CompetitorQuoteRow[] {
  const idSet = new Set(associationIds)
  return rows.map((row) => {
    if (row.id !== quoteRowId) return row
    return {
      ...row,
      competitorAssociations: row.competitorAssociations.map((a) => {
        if (!idSet.has(a.id)) return a
        return { ...a, visibility: value }
      }),
    }
  })
}

export const publisherOptions = [
  { value: 'opis-br', label: 'OPIS Competitor Branded' },
  { value: 'opis-ub', label: 'OPIS Competitor Unbranded' },
  { value: 'platts', label: 'Platts' },
  { value: 'argus', label: 'Argus' },
]

export const productHierarchyOptions = [
  { value: 'opis', label: 'OPIS Products' },
  { value: 'primary', label: 'Primary Hierarchy' },
]

export const locationHierarchyOptions = [
  { value: 'opis', label: 'OPIS City' },
  { value: 'primary', label: 'Primary Hierarchy' },
]

export const competitorSelectOptions = allCompetitors.map((c) => ({
  value: c.fullName,
  label: c.fullName,
}))

/** Add a new association to a specific quote row (immutable update) */
export function addAssociationToRow(
  rows: CompetitorQuoteRow[],
  quoteRowId: number,
  newAssoc: Omit<CompetitorAssociation, 'id'>,
): CompetitorQuoteRow[] {
  return rows.map((row) => {
    if (row.id !== quoteRowId) return row
    const maxId = row.competitorAssociations.reduce((max, a) => Math.max(max, a.id), 0)
    const association: CompetitorAssociation = { ...newAssoc, id: maxId + 1 }
    return {
      ...row,
      competitorAssociations: [...row.competitorAssociations, association],
      existingCompetitorCount: row.existingCompetitorCount + 1,
      existingCompetitors: [...row.existingCompetitors, newAssoc.name],
    }
  })
}

/** Set visibility on matching associations across multiple quote rows (immutable update) */
export function bulkSetVisibilityAcrossRows(
  rows: CompetitorQuoteRow[],
  quoteRowIds: number[],
  matchBy: 'name' | 'publisher' | 'terminal',
  matchValues: string[],
  visibility: 'Show' | 'Hide' | 'Highlight',
): CompetitorQuoteRow[] {
  const idSet = new Set(quoteRowIds)
  const valueSet = new Set(matchValues)
  return rows.map((row) => {
    if (!idSet.has(row.id)) return row
    return {
      ...row,
      competitorAssociations: row.competitorAssociations.map((a) => {
        if (!valueSet.has(a[matchBy])) return a
        return { ...a, visibility }
      }),
    }
  })
}
