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
import { generateContractProducts } from '../../../../shared/data';

// Sample products for demo (generated from shared data)
export const SAMPLE_CONTRACT_PRODUCTS = generateContractProducts(6);

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
      noMatchCount: 0,
      totalProducts: products.length,
      matchPercentage: 0,
    };
  }

  const totalProducts = products.length;
  let matchRate: number;
  let noMatchCount = 0;

  // Quick selections (managed benchmarks) have predefined match rates and no failures
  if (benchmark.type === 'quick') {
    matchRate = 0.85;
    noMatchCount = 0;
  } else {
    // Custom benchmark match rate + no-match count depends on hierarchy
    switch (benchmark.productHierarchy) {
      case 'target-index':
        matchRate = 0.85;
        noMatchCount = 1;
        break;
      case 'product-grade':
        matchRate = 0.75;
        noMatchCount = 1;
        break;
      case 'product-family':
        matchRate = 0.6;
        noMatchCount = 2;
        break;
      case 'any':
        matchRate = 1.0;
        noMatchCount = 0;
        break;
      default:
        matchRate = 0.85;
        noMatchCount = 0;
    }
  }

  // Ensure noMatchCount doesn't exceed total
  noMatchCount = Math.min(noMatchCount, totalProducts);
  const matchedCount = Math.floor((totalProducts - noMatchCount) * matchRate);
  const rollupCount = totalProducts - matchedCount - noMatchCount;
  const coveragePercentage = Math.round(((matchedCount + rollupCount) / totalProducts) * 100);

  return {
    matchedCount,
    rollupCount,
    noMatchCount,
    totalProducts,
    matchPercentage: coveragePercentage,
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
    // Last N products are "no match", preceding ones are rollup, first ones are direct
    const noMatchStart = products.length - matchingInfo.noMatchCount;
    const isNoMatch = index >= noMatchStart;
    const isDirectMatch = index < matchingInfo.matchedCount;
    const matchType: 'direct' | 'rollup' | 'none' = isNoMatch
      ? 'none'
      : isDirectMatch
        ? 'direct'
        : 'rollup';

    // No-match products have no price data
    if (matchType === 'none') {
      return {
        productId: product.id,
        productName: product.name,
        location: product.location,
        matchType,
        price: 0,
        delta: 0,
      };
    }

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

    // Simulate missing prices on the first rollup product
    const isFirstRollup = matchType === 'rollup' && index === matchingInfo.matchedCount;
    const hasMissingPrices = isFirstRollup && matchingInfo.rollupCount > 0;

    return {
      productId: product.id,
      productName: product.name,
      location: product.location,
      matchType,
      price: product.currentPrice + priceDelta,
      delta: Math.round(priceDelta * 100) / 100,
      ...(hasMissingPrices && {
        hasMissingPrices: true,
        availablePriceCount: 18,
        totalPriceCount: 22,
      }),
    };
  });
}
