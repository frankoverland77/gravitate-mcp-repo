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

  const publisher = benchmark.publisher?.toUpperCase() || 'Unknown';
  const hierarchyParts: string[] = [];

  if (benchmark.productHierarchy) {
    const productMap: Record<string, string> = {
      'target-index': 'Target Index',
      'product-grade': 'Product Grade',
      'product-family': 'Product Family',
      any: 'Any Match',
    };
    hierarchyParts.push(productMap[benchmark.productHierarchy] || benchmark.productHierarchy);
  }

  if (benchmark.locationHierarchy) {
    const locationMap: Record<string, string> = {
      city: 'City',
      state: 'State',
      padd: 'PADD',
      national: 'National',
    };
    hierarchyParts.push(locationMap[benchmark.locationHierarchy] || benchmark.locationHierarchy);
  }

  if (hierarchyParts.length > 0) {
    return `${publisher} (${hierarchyParts.join(' / ')})`;
  }
  return publisher;
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

  // Match rate depends on product hierarchy
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

  // Get adjustment factors based on publisher
  let priceAdjustment: number;
  let marginMultiplier: number;

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

    // Calculate price delta based on publisher
    let priceDelta = 0;
    if (benchmark) {
      if (benchmark.publisher === 'platts') {
        priceDelta = 0.02 + Math.random() * 0.03; // +2 to +5 cents
      } else if (benchmark.publisher === 'argus') {
        priceDelta = 0.01 + Math.random() * 0.02; // +1 to +3 cents
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
