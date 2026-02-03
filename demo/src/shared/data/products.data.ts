/**
 * Shared Products Data
 *
 * Master product list for fuel industry demos.
 * Curated standard fuel products used across RFP, Online Selling,
 * Tiered Pricing, and Contract Measurement features.
 */

import type { Product, ProductOption } from '../types/product.types'

// Curated standard fuel product list
export const PRODUCTS: Product[] = [
  {
    ProductId: 1,
    Name: '87 Octane',
    Abbreviation: '87',
    Grade: 'Regular',
    ProductGroup: 'gasoline',
    IsActive: true,
  },
  {
    ProductId: 2,
    Name: '89 Octane',
    Abbreviation: '89',
    Grade: 'Midgrade',
    ProductGroup: 'gasoline',
    IsActive: true,
  },
  {
    ProductId: 3,
    Name: '93 Octane',
    Abbreviation: '93',
    Grade: 'Premium',
    ProductGroup: 'gasoline',
    IsActive: true,
  },
  {
    ProductId: 4,
    Name: 'ULSD 2',
    Abbreviation: 'ULSD2',
    ProductGroup: 'diesel',
    IsActive: true,
  },
  {
    ProductId: 7,
    Name: 'Biodiesel B20',
    Abbreviation: 'B20',
    ProductGroup: 'biodiesel',
    IsActive: true,
  },
  {
    ProductId: 9,
    Name: 'B7 GHL',
    Abbreviation: 'B7',
    ProductGroup: 'biodiesel',
    IsActive: true,
  },
  {
    ProductId: 10,
    Name: '93 Premium',
    Abbreviation: '93P',
    Grade: 'Premium',
    ProductGroup: 'gasoline',
    IsActive: true,
  },
  {
    ProductId: 11,
    Name: '87 Gas',
    Abbreviation: '87G',
    Grade: 'Regular',
    ProductGroup: 'gasoline',
    IsActive: true,
  },
  {
    ProductId: 12,
    Name: 'Mid-Grade 88',
    Abbreviation: '88',
    Grade: 'Midgrade',
    ProductGroup: 'gasoline',
    IsActive: true,
  },

  // ============================================================================
  // BIODIESEL PRODUCTS
  // ============================================================================
  { ProductId: 13, Name: '#1 BIO 5%', Abbreviation: '0437', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 14, Name: '5% BIO CFI', Abbreviation: '1204', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 15, Name: 'ULS2W DY B11', Abbreviation: '0478', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 16, Name: 'BIO 20% PREM', Abbreviation: '0457', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 17, Name: 'BIO 20% PREM DYED', Abbreviation: '0458', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 18, Name: 'BIO 5% Prem', Abbreviation: '0539', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 19, Name: 'BIO 5% Prem DYED', Abbreviation: '0540', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 20, Name: 'BIO 5% Prem DYED', Abbreviation: '0799', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 21, Name: 'Bio 11% Prem', Abbreviation: '0798', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 22, Name: '#1 B2 DYED', Abbreviation: '0423', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 23, Name: '10% BIO', Abbreviation: '0445', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 24, Name: '10% BIO DYED', Abbreviation: '0446', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 25, Name: '11% BIO', Abbreviation: '0453', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 26, Name: '11% BIO DYED', Abbreviation: '0454', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 27, Name: '2% BIO', Abbreviation: '0414', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 28, Name: '2% BIO DYED', Abbreviation: '0415', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 29, Name: '2% WTR BIO DYED', Abbreviation: '0419', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 30, Name: '2% BIO PREM DYED', Abbreviation: '0417', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 31, Name: '2% PRM BIO', Abbreviation: '0416', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 32, Name: '2% WTR BIO', Abbreviation: '0418', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 33, Name: 'BIO 20%', Abbreviation: '0455', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 34, Name: '5% BIO', Abbreviation: '0429', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 35, Name: '5% BIO DYED', Abbreviation: '0430', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 36, Name: '20% BIO DYED', Abbreviation: '0456', ProductGroup: 'biodiesel', IsActive: true },
  { ProductId: 37, Name: '5% BIO CFI DYED', Abbreviation: '1205', ProductGroup: 'biodiesel', IsActive: true },

  // ============================================================================
  // GASOLINE - REGULAR/UNLEADED
  // ============================================================================
  { ProductId: 38, Name: '87 CBG E10%', Abbreviation: '1065', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 39, Name: 'U/L10% 7.8', Abbreviation: '0306', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 40, Name: 'U/L 85 LVP 7.8', Abbreviation: '0232', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 41, Name: 'U/L10%', Abbreviation: '0037', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 42, Name: 'U/L8510% 7.8', Abbreviation: '0330', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 43, Name: 'U10% LVP 7.0', Abbreviation: '0485', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 44, Name: 'U8510%', Abbreviation: '0208', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 45, Name: 'UNLD', Abbreviation: '0024', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 46, Name: 'UNLD LRVP', Abbreviation: '0077', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 47, Name: 'UNLD 85', Abbreviation: '0200', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 48, Name: 'UNLD LVP 7.0', Abbreviation: '0062', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 49, Name: 'U87 ETH EXPORT', Abbreviation: '1184', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 50, Name: 'U/L 15%', Abbreviation: '1004', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 51, Name: 'UNL 86 E 10%', Abbreviation: '0210', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 52, Name: 'UNLEAD 86', Abbreviation: '0202', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 53, Name: 'U87 EXPORT', Abbreviation: '1180', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 54, Name: 'U/L15% LRVP', Abbreviation: '1257', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },

  // ============================================================================
  // GASOLINE - MIDGRADE
  // ============================================================================
  { ProductId: 55, Name: '89 CBG E10%', Abbreviation: '1066', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 56, Name: 'MGRADE LRVP', Abbreviation: '0078', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 57, Name: 'M/G10%', Abbreviation: '0038', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 58, Name: 'M/G10% 7.8', Abbreviation: '0307', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 59, Name: 'M10% LVP 7.0', Abbreviation: '0486', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 60, Name: 'M8710%', Abbreviation: '0209', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 61, Name: 'M8710% 7.8', Abbreviation: '0331', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 62, Name: 'M8810%', Abbreviation: '0211', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 63, Name: 'M8810% LVP 7.8', Abbreviation: '0517', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 64, Name: 'MGRADE', Abbreviation: '0025', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 65, Name: 'MID 87', Abbreviation: '0201', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 66, Name: 'MID 88', Abbreviation: '0203', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 67, Name: 'MID88 7.8', Abbreviation: '0235', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 68, Name: 'MIDCLR 7.8', Abbreviation: '0233', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 69, Name: 'RFG M8710%', Abbreviation: '1211', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 70, Name: 'M87 RC LRVP', Abbreviation: '1233', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 71, Name: 'M/G10% LRVP', Abbreviation: '1038', Grade: 'Midgrade', ProductGroup: 'gasoline', IsActive: true },

  // ============================================================================
  // GASOLINE - PREMIUM
  // ============================================================================
  { ProductId: 72, Name: '91 CBG E10%', Abbreviation: '1067', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 73, Name: 'P10% LVP 7.0', Abbreviation: '0487', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 74, Name: 'P9310% LVP 7.0', Abbreviation: '0489', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 75, Name: 'PREM 91', Abbreviation: '0148', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 76, Name: 'PREM 91 7.0', Abbreviation: '0816', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 77, Name: 'PREM9210% LVP 7.8', Abbreviation: '0309', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 78, Name: 'PRM', Abbreviation: '0028', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 79, Name: 'PRM 90', Abbreviation: '0026', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 80, Name: 'PRM LVP 7.0', Abbreviation: '0064', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 81, Name: 'PRM10%', Abbreviation: '0041', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 82, Name: 'PREM10% 7.8', Abbreviation: '0308', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 83, Name: 'PRM9210%', Abbreviation: '0042', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 84, Name: 'PRM9310%', Abbreviation: '0043', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 85, Name: 'RFG PREM10%', Abbreviation: '0085', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 86, Name: 'PREM9310% LRVP', Abbreviation: '0310', Grade: 'Premium', ProductGroup: 'gasoline', IsActive: true },

  // ============================================================================
  // GASOLINE - VALUE GRADE
  // ============================================================================
  { ProductId: 87, Name: 'VGRADE', Abbreviation: '0023', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },
  { ProductId: 88, Name: 'VGRADE 7.0', Abbreviation: '0677', Grade: 'Regular', ProductGroup: 'gasoline', IsActive: true },

  // ============================================================================
  // DIESEL - EXPORT
  // ============================================================================
  { ProductId: 89, Name: 'ULS2 EXPORT', Abbreviation: '1182', ProductGroup: 'diesel', IsActive: true },
]

/**
 * Get product by ID
 */
export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.ProductId === id)
}

/**
 * Get product by name (exact match or abbreviation)
 */
export function getProductByName(name: string): Product | undefined {
  return PRODUCTS.find((p) => p.Name === name || p.Abbreviation === name)
}

/**
 * Get all active products as dropdown options
 */
export function getProductOptions(): ProductOption[] {
  return PRODUCTS.filter((p) => p.IsActive).map((p) => ({
    value: p.ProductId,
    label: p.Name,
    abbreviation: p.Abbreviation,
    group: p.ProductGroup,
  }))
}

/**
 * Get products filtered by group
 */
export function getProductsByGroup(group: Product['ProductGroup']): Product[] {
  return PRODUCTS.filter((p) => p.ProductGroup === group && p.IsActive)
}

/**
 * Get gasoline products only
 */
export function getGasolineProducts(): Product[] {
  return getProductsByGroup('gasoline')
}

/**
 * Get diesel products only
 */
export function getDieselProducts(): Product[] {
  return getProductsByGroup('diesel')
}

/**
 * Product name string literals for backward compatibility
 */
export const PRODUCT_NAMES = ['87 Octane', '93 Octane', 'ULSD 2'] as const
export type RFPProductName = (typeof PRODUCT_NAMES)[number]
