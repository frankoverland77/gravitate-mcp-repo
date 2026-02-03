/**
 * Shared Data Context
 *
 * Provides centralized access to shared data (products, locations, counterparties)
 * across all fuel industry demo pages.
 */

import React, { createContext, useContext, useMemo } from 'react'

// Import types
import type { Product, ProductOption } from '../types/product.types'
import type { Location, LocationOption } from '../types/location.types'
import type { Counterparty, CounterpartyOption } from '../types/counterparty.types'

// Import data and helper functions
import {
  PRODUCTS,
  getProductById,
  getProductByName,
  getProductOptions,
  getProductsByGroup,
  getGasolineProducts,
  getDieselProducts,
} from '../data/products.data'

import {
  LOCATIONS,
  getLocationById,
  getLocationByName,
  getLocationOptions,
  getTerminalLocations,
  getTerminalOptions,
  getLocationsByRegion,
} from '../data/locations.data'

import {
  COUNTERPARTIES,
  getCounterpartyById,
  getCounterpartyByName,
  getSuppliers,
  getSupplierOptions,
  getCustomers,
  getCustomerOptions,
} from '../data/counterparties.data'

/**
 * Context value interface
 */
interface SharedDataContextValue {
  // Products
  products: Product[]
  productOptions: ProductOption[]
  getProductById: (id: number) => Product | undefined
  getProductByName: (name: string) => Product | undefined
  getProductsByGroup: (group: Product['ProductGroup']) => Product[]
  getGasolineProducts: () => Product[]
  getDieselProducts: () => Product[]

  // Locations
  locations: Location[]
  locationOptions: LocationOption[]
  terminalOptions: LocationOption[]
  getLocationById: (id: number) => Location | undefined
  getLocationByName: (name: string) => Location | undefined
  getTerminalLocations: () => Location[]
  getLocationsByRegion: (region: string) => Location[]

  // Counterparties
  counterparties: Counterparty[]
  suppliers: Counterparty[]
  customers: Counterparty[]
  supplierOptions: CounterpartyOption[]
  customerOptions: CounterpartyOption[]
  getCounterpartyById: (id: number) => Counterparty | undefined
  getCounterpartyByName: (name: string) => Counterparty | undefined
}

const SharedDataContext = createContext<SharedDataContextValue | undefined>(undefined)

interface SharedDataProviderProps {
  children: React.ReactNode
}

/**
 * Provider component for shared data
 */
export function SharedDataProvider({ children }: SharedDataProviderProps) {
  const value = useMemo<SharedDataContextValue>(
    () => ({
      // Products
      products: PRODUCTS,
      productOptions: getProductOptions(),
      getProductById,
      getProductByName,
      getProductsByGroup,
      getGasolineProducts,
      getDieselProducts,

      // Locations
      locations: LOCATIONS,
      locationOptions: getLocationOptions(),
      terminalOptions: getTerminalOptions(),
      getLocationById,
      getLocationByName,
      getTerminalLocations,
      getLocationsByRegion,

      // Counterparties
      counterparties: COUNTERPARTIES,
      suppliers: getSuppliers(),
      customers: getCustomers(),
      supplierOptions: getSupplierOptions(),
      customerOptions: getCustomerOptions(),
      getCounterpartyById,
      getCounterpartyByName,
    }),
    []
  )

  return <SharedDataContext.Provider value={value}>{children}</SharedDataContext.Provider>
}

/**
 * Hook to access shared data context
 */
export function useSharedData(): SharedDataContextValue {
  const context = useContext(SharedDataContext)
  if (!context) {
    throw new Error('useSharedData must be used within SharedDataProvider')
  }
  return context
}

// ============================================================================
// Convenience hooks for specific data types
// ============================================================================

/**
 * Hook to access products
 */
export function useProducts() {
  const { products } = useSharedData()
  return products
}

/**
 * Hook to access product dropdown options
 */
export function useProductOptions() {
  const { productOptions } = useSharedData()
  return productOptions
}

/**
 * Hook to access locations
 */
export function useLocations() {
  const { locations } = useSharedData()
  return locations
}

/**
 * Hook to access location dropdown options
 */
export function useLocationOptions() {
  const { locationOptions } = useSharedData()
  return locationOptions
}

/**
 * Hook to access terminal dropdown options
 */
export function useTerminalOptions() {
  const { terminalOptions } = useSharedData()
  return terminalOptions
}

/**
 * Hook to access counterparties
 */
export function useCounterparties() {
  const { counterparties } = useSharedData()
  return counterparties
}

/**
 * Hook to access suppliers
 */
export function useSuppliers() {
  const { suppliers } = useSharedData()
  return suppliers
}

/**
 * Hook to access supplier dropdown options
 */
export function useSupplierOptions() {
  const { supplierOptions } = useSharedData()
  return supplierOptions
}

/**
 * Hook to access customers
 */
export function useCustomers() {
  const { customers } = useSharedData()
  return customers
}

/**
 * Hook to access customer dropdown options
 */
export function useCustomerOptions() {
  const { customerOptions } = useSharedData()
  return customerOptions
}
