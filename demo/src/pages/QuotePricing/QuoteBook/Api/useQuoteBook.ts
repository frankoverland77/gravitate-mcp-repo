import { useState } from 'react'
import { quoteBookData, quoteGroups } from './mockData'
import type { QuoteRow } from './mockData'
import { exceptionProfiles } from './exceptionProfiles.data'
import type { ExceptionProfile } from './types.schema'

export function useQuoteBook() {
  function useQuoteBookQuery() {
    const [data] = useState<QuoteRow[]>(() =>
      quoteBookData.map(r => ({ ...r, overrides: r.overrides ? [...r.overrides] : [] }))
    )
    return { data, isLoading: false, error: null }
  }

  function useGroupsQuery() {
    return { data: quoteGroups, isLoading: false, error: null }
  }

  function useProfilesQuery() {
    const [data] = useState<ExceptionProfile[]>(() =>
      exceptionProfiles.map(p => ({ ...p, thresholds: p.thresholds.map(t => ({ ...t })) }))
    )
    return { data, isLoading: false, error: null }
  }

  return {
    useQuoteBookQuery,
    useGroupsQuery,
    useProfilesQuery,
  }
}
