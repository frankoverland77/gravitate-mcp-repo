export type CompetitorQuoteRow = {
  id: number
  configurationName: string
  counterparty: string
  terminal: string
  product: string
  costType: string
  existingCompetitorCount: number
  existingCompetitors: string[]
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

export const competitorQuoteRows: CompetitorQuoteRow[] = [
  // Branded Rack Prices (8 rows)
  {
    id: 1,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    terminal: 'ALBUQUERQUE, NM - HAMPTON',
    product: 'RUL BLD 003',
    costType: 'P. COST',
    existingCompetitorCount: 8,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL', 'VALERO', 'TESORO', 'CONOCOPHILLIPS'],
  },
  {
    id: 2,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    terminal: 'ALBUQUERQUE, NM - HAMPTON',
    product: 'PRMGAS .003',
    costType: 'P. COST',
    existingCompetitorCount: 6,
    existingCompetitors: ['CHEVRON', 'SHELL', 'VALERO', 'MARATHON', 'EXXONMOBIL', 'TESORO'],
  },
  {
    id: 3,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    terminal: 'ALBUQUERQUE, NM - HAMPTON',
    product: 'FRMGASN .636',
    costType: 'P. COST',
    existingCompetitorCount: 4,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'SHELL', 'VALERO'],
  },
  {
    id: 4,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    terminal: 'DALLAS, TX - MAGELLAN',
    product: 'UNL 84E 10%',
    costType: 'P. COST',
    existingCompetitorCount: 0,
    existingCompetitors: [],
  },
  {
    id: 5,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    terminal: 'DALLAS, TX - MAGELLAN',
    product: 'HSDO48S .005',
    costType: 'R. COST',
    existingCompetitorCount: 3,
    existingCompetitors: ['CHEVRON', 'MARATHON', 'SHELL'],
  },
  {
    id: 6,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    terminal: 'DENVER, CO - SUNCOR',
    product: 'UNL 87E 10%',
    costType: 'P. COST',
    existingCompetitorCount: 5,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL'],
  },
  {
    id: 7,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    terminal: 'DENVER, CO - SUNCOR',
    product: 'PRMGAS .003',
    costType: 'P. COST',
    existingCompetitorCount: 7,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL', 'VALERO', 'TESORO'],
  },
  {
    id: 8,
    configurationName: 'Branded Rack Prices',
    counterparty: 'SINCLAIR BRANDED - 1039',
    terminal: 'EL PASO, TX - HOLLOMAN',
    product: 'UNL 87E 10%',
    costType: 'P. COST',
    existingCompetitorCount: 0,
    existingCompetitors: [],
  },
  // Unbranded Rack Prices (7 rows)
  {
    id: 9,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    terminal: 'ALBUQUERQUE, NM - HAMPTON',
    product: 'UNL 84E 10%',
    costType: 'P. COST',
    existingCompetitorCount: 5,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'VALERO', 'CONOCOPHILLIPS'],
  },
  {
    id: 10,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    terminal: 'ALBUQUERQUE, NM - HAMPTON',
    product: 'HSDO48S .005',
    costType: 'P. COST',
    existingCompetitorCount: 3,
    existingCompetitors: ['CHEVRON', 'MARATHON', 'VALERO'],
  },
  {
    id: 11,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    terminal: 'DALLAS, TX - MAGELLAN',
    product: 'UNL 87E 10%',
    costType: 'P. COST',
    existingCompetitorCount: 10,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL', 'VALERO', 'TESORO', 'CONOCOPHILLIPS', 'CITGO', 'FLINT HILLS'],
  },
  {
    id: 12,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    terminal: 'DALLAS, TX - MAGELLAN',
    product: 'PRMGAS .003',
    costType: 'R. COST',
    existingCompetitorCount: 4,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'SHELL', 'VALERO'],
  },
  {
    id: 13,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    terminal: 'DENVER, CO - SUNCOR',
    product: 'RUL BLD 003',
    costType: 'P. COST',
    existingCompetitorCount: 0,
    existingCompetitors: [],
  },
  {
    id: 14,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    terminal: 'EL PASO, TX - HOLLOMAN',
    product: 'FRMGASN .636',
    costType: 'P. COST',
    existingCompetitorCount: 2,
    existingCompetitors: ['MARATHON', 'VALERO'],
  },
  {
    id: 15,
    configurationName: 'Unbranded Rack Prices',
    counterparty: 'SINCLAIR UNBRANDED - 2045',
    terminal: 'EL PASO, TX - HOLLOMAN',
    product: 'UNL 84E 10%',
    costType: 'R. COST',
    existingCompetitorCount: 6,
    existingCompetitors: ['CHEVRON', 'EXXONMOBIL', 'MARATHON', 'PHILLIPS 66', 'SHELL', 'CONOCOPHILLIPS'],
  },
]

const allCompetitors: { name: string; fullName: string }[] = [
  { name: 'CHEVRON', fullName: 'CHEVRON PRODUCTS CO' },
  { name: 'EXXONMOBIL', fullName: 'EXXONMOBIL ARC' },
  { name: 'MARATHON', fullName: 'MARATHON PETROLEUM' },
  { name: 'PHILLIPS 66', fullName: 'PHILLIPS 66 COMPANY' },
  { name: 'SHELL', fullName: 'SHELL OIL PRODUCTS' },
  { name: 'VALERO', fullName: 'VALERO MARKETING' },
  { name: 'TESORO', fullName: 'TESORO - 2000009' },
  { name: 'CONOCOPHILLIPS', fullName: 'CONOCOPHILLIPS - SAP' },
]

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

    const instruments = chosen.map((c, idx) => ({
      id: row.id * 100 + idx,
      competitor: c.fullName,
      publisher: publisherLabel,
      terminal: row.terminal.split(' - ')[0],
      product: row.product,
      alreadyExists: row.existingCompetitors.includes(c.name),
    }))

    return { quoteRowId: row.id, instruments }
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
