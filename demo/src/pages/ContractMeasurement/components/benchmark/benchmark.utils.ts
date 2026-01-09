/**
 * Benchmark Utility Functions
 *
 * Provides mock data and calculation functions for benchmark selection preview.
 * In production, these would be replaced with API calls.
 */

import type {
  SelectedBenchmark,
  BenchmarkMatchingInfo,
  BenchmarkImpactEstimate,
  ProductMatchDetail,
} from '../../types/scenario.types';

// Sample products for demo (would come from API in production)
export const SAMPLE_CONTRACT_PRODUCTS = [
  { id: 'P001', name: '87 Gas', location: 'Houston Terminal', volume: 120000, currentPrice: 2.45 },
  { id: 'P002', name: '89 Gas', location: 'Houston Terminal', volume: 160000, currentPrice: 2.52 },
  { id: 'P003', name: 'Diesel #2', location: 'Tulsa Terminal', volume: 85000, currentPrice: 2.78 },
  { id: 'P004', name: 'Jet Fuel', location: 'Dallas Terminal', volume: 100000, currentPrice: 2.95 },
  { id: 'P005', name: '87 Gas', location: 'Austin Terminal', volume: 75000, currentPrice: 2.48 },
  {
    id: 'P006',
    name: 'Diesel #2',
    location: 'Dallas Terminal',
    volume: 110000,
    currentPrice: 2.81,
  },
];

/**
 * Get display name for a benchmark selection
 */
export function getBenchmarkDisplayName(benchmark: SelectedBenchmark | undefined): string {
  if (!benchmark) return 'No Selection';

  if (benchmark.type === 'quick') {
    switch (benchmark.quickType) {
      case 'rack-average':
        return 'Rack Average';
      case 'rack-low':
        return 'Rack Low';
      case 'spot-price':
        return 'Spot Price';
      default:
        return 'Unknown';
    }
  }

  // Custom benchmark
  const publisher = benchmark.publisher?.toUpperCase() || 'Unknown';
  const typeMap: Record<string, string> = {
    'rack-low': 'Rack Low',
    'rack-average': 'Rack Average',
    'contract-low': 'Contract Low',
    spot: 'Spot',
  };
  const benchmarkType = benchmark.benchmarkType
    ? typeMap[benchmark.benchmarkType] || benchmark.benchmarkType
    : 'Unknown';
  return `${publisher} ${benchmarkType}`;
}

/**
 * Calculate matching info based on benchmark selection and product hierarchy
 */
export function calculateMatchingInfo(
  benchmark: SelectedBenchmark | undefined,
  products = SAMPLE_CONTRACT_PRODUCTS
): BenchmarkMatchingInfo {
  if (!benchmark) {
    return {
      matchedCount: 0,
      rollupCount: 0,
      totalProducts: products.length,
      matchPercentage: 0,
    };
  }

  const totalProducts = products.length;
  let matchRate: number;

  // Quick selections have predefined match rates
  if (benchmark.type === 'quick') {
    matchRate = 0.85; // Quick selections use target-index by default
  } else {
    // Custom benchmark match rate depends on hierarchy
    switch (benchmark.productHierarchy) {
      case 'target-index':
        matchRate = 0.85;
        break;
      case 'product-grade':
        matchRate = 0.75;
        break;
      case 'product-family':
        matchRate = 0.6;
        break;
      case 'any':
        matchRate = 1.0;
        break;
      default:
        matchRate = 0.85;
    }
  }

  const matchedCount = Math.floor(totalProducts * matchRate);
  const rollupCount = totalProducts - matchedCount;

  return {
    matchedCount,
    rollupCount,
    totalProducts,
    matchPercentage: Math.round(matchRate * 100),
  };
}

/**
 * Calculate estimated financial impact based on benchmark selection
 */
export function calculateImpactEstimate(
  benchmark: SelectedBenchmark | undefined,
  products = SAMPLE_CONTRACT_PRODUCTS
): BenchmarkImpactEstimate {
  if (!benchmark) {
    return {
      revenueDelta: 0,
      revenuePercentage: 0,
      marginDelta: 0,
      marginPercentage: 0,
    };
  }

  // Get adjustment factors based on benchmark type
  let priceAdjustment: number;
  let marginMultiplier: number;

  if (benchmark.type === 'quick') {
    switch (benchmark.quickType) {
      case 'rack-average':
        priceAdjustment = -0.021; // 2.1% lower (favorable)
        marginMultiplier = 0.96;
        break;
      case 'rack-low':
        priceAdjustment = -0.045; // 4.5% lower (more favorable)
        marginMultiplier = 0.94;
        break;
      case 'spot-price':
        priceAdjustment = 0.028; // 2.8% higher (unfavorable)
        marginMultiplier = 1.02;
        break;
      default:
        priceAdjustment = 0;
        marginMultiplier = 1;
    }
  } else {
    // Custom benchmark - adjust based on publisher
    switch (benchmark.publisher) {
      case 'platts':
        priceAdjustment = 0.018;
        marginMultiplier = 1.02;
        break;
      case 'argus':
        priceAdjustment = 0.012;
        marginMultiplier = 1.01;
        break;
      case 'opis':
      default:
        priceAdjustment = -0.015;
        marginMultiplier = 0.99;
    }

    // Adjust for benchmark type
    if (benchmark.benchmarkType === 'rack-low') {
      priceAdjustment -= 0.03;
      marginMultiplier *= 0.97;
    } else if (benchmark.benchmarkType === 'spot') {
      priceAdjustment += 0.02;
      marginMultiplier *= 1.01;
    }
  }

  // Calculate totals
  const totalRevenue = products.reduce((sum, p) => sum + p.volume * p.currentPrice, 0);

  const revenueDelta = totalRevenue * priceAdjustment;
  const marginDelta = totalRevenue * 0.08 * (marginMultiplier - 1); // Assume 8% base margin

  return {
    revenueDelta: Math.round(revenueDelta),
    revenuePercentage: Math.round(priceAdjustment * 1000) / 10,
    marginDelta: Math.round(marginDelta),
    marginPercentage: Math.round((marginMultiplier - 1) * 1000) / 10,
  };
}

/**
 * Get product match details for breakdown table
 */
export function getProductMatchDetails(
  benchmark: SelectedBenchmark | undefined,
  products = SAMPLE_CONTRACT_PRODUCTS
): ProductMatchDetail[] {
  const matchingInfo = calculateMatchingInfo(benchmark, products);

  return products.map((product, index) => {
    // Determine match type based on position (simulated)
    const isDirectMatch = index < matchingInfo.matchedCount;
    const matchType: 'direct' | 'rollup' | 'none' = isDirectMatch ? 'direct' : 'rollup';

    // Calculate price delta (simulated)
    let priceDelta = 0;
    if (benchmark) {
      if (benchmark.type === 'quick' && benchmark.quickType === 'rack-low') {
        priceDelta = -(0.03 + Math.random() * 0.04); // -3 to -7 cents
      } else if (benchmark.type === 'quick' && benchmark.quickType === 'spot-price') {
        priceDelta = 0.02 + Math.random() * 0.03; // +2 to +5 cents
      } else {
        priceDelta = -0.02 + Math.random() * 0.04; // -2 to +2 cents
      }
    }

    return {
      productId: product.id,
      productName: product.name,
      location: product.location,
      matchType,
      price: product.currentPrice + priceDelta,
      delta: Math.round(priceDelta * 100) / 100,
    };
  });
}
