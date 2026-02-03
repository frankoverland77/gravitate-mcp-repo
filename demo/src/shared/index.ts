/**
 * Shared Module - Main Barrel Export
 *
 * Central export for all shared types, data, and contexts.
 */

// Types
export * from './types'

// Data
export * from './data'

// Contexts
export {
  SharedDataProvider,
  useSharedData,
  useProducts,
  useProductOptions,
  useLocations,
  useLocationOptions,
  useTerminalOptions,
  useCounterparties,
  useSuppliers,
  useSupplierOptions,
  useCustomers,
  useCustomerOptions,
} from './contexts/SharedDataContext'
