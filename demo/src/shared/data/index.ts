/**
 * Shared Data - Barrel Export
 *
 * Central export for all shared data modules.
 */

// Products
export {
  PRODUCTS,
  getProductById,
  getProductByName,
  getProductOptions,
  getProductsByGroup,
  getGasolineProducts,
  getDieselProducts,
  PRODUCT_NAMES,
  type RFPProductName,
} from './products.data'

// Locations
export {
  LOCATIONS,
  getLocationById,
  getLocationByName,
  getLocationOptions,
  getTerminalLocations,
  getTerminalOptions,
  getLocationsByRegion,
  RFP_LOCATION_NAMES,
  TERMINAL_NAMES,
  type RFPLocationName,
  type TerminalName,
} from './locations.data'

// Counterparties
export {
  COUNTERPARTIES,
  getCounterpartyById,
  getCounterpartyByName,
  getSuppliers,
  getSupplierOptions,
  getCustomers,
  getCustomerOptions,
  SUPPLIER_NAMES,
  type RFPSupplierName,
} from './counterparties.data'

// Price Publishers
export {
  PRICE_PUBLISHERS,
  PRICE_INSTRUMENTS,
  PRICE_PUBLISHER_OPTIONS,
  PRICE_TYPE_OPTIONS,
  DATE_RULE_OPTIONS,
  getInstrumentsByPublisher,
  getInstrumentsByProductGroup,
  SAMPLE_MARKET_PRICES,
  getMarketPrice,
} from './pricePublishers.data'

// Formula Templates
export {
  FORMULA_TEMPLATES,
  getFormulaTemplateById,
  getFormulaById,
  getTemplatesByProductGroup,
  getDefaultTemplate,
  getFormulaTemplateOptions,
} from './formulaTemplates.data'

// Generators
export {
  generatePrice,
  generateSeededPrice,
  generateTieredPricingData,
  generateRFPDetails,
  generateMarketContextData,
  generateIndexOfferData,
  generateContractDetails,
  generateProductSelectionOptions,
  generateSupplierAnalysisData,
  generateBuyPromptsData,
  generateBuyForwardsData,
  generateHomeIndexOffersData,
  generateContractProducts,
  generatePerformanceDetails,
  generateComparisonData,
  generatePricingData,
  generateAnalyticsData,
  getDemoProducts,
  getDemoTerminals,
  getDemoProductNames,
  getDemoTerminalNames,
  type GeneratedTieredPricingRow,
  type GeneratedDetailRow,
  type GeneratedMarketContextData,
  type GeneratedIndexOfferRow,
  type GeneratedContractDetail,
  type GeneratedSupplierAnalysisRow,
  type GeneratedBuyPromptRow,
  type GeneratedBuyForwardRow,
  type GeneratedHomeIndexOfferRow,
  type GeneratedContractProduct,
  type GeneratedPerformanceRecord,
  type GeneratedComparisonRow,
  type GeneratedPricingRow,
  type GeneratedAnalyticsRow,
  generateDeliveredPricingData,
  type DeliveredPricingQuoteRow,
  type DeliveredPricingStrategy,
  DELIVERED_PRICING_STRATEGIES,
} from './generators.data'
