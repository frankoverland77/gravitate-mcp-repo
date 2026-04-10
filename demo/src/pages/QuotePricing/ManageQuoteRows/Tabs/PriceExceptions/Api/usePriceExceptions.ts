import { useState } from 'react'
import { priceExceptionData } from '../Grid/mockData'
import type { PriceExceptionRow } from '../Grid/mockData'

export function usePriceExceptions() {
  function usePriceExceptionsQuery() {
    const [data] = useState<PriceExceptionRow[]>(() => priceExceptionData.map(r => ({ ...r })))
    return { data, isLoading: false, error: null }
  }

  function useUpdateThresholdsMutation() {
    return {
      mutateAsync: async (_payload: Partial<PriceExceptionRow>[]) => {
        // Mock mutation — in production this would POST to API
      },
      isLoading: false,
    }
  }

  return {
    usePriceExceptionsQuery,
    useUpdateThresholdsMutation,
  }
}
