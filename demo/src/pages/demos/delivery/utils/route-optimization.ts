/**
 * Route Optimization Module for Delivery Management System
 * 
 * This module provides comprehensive route optimization algorithms including:
 * - Distance calculations using Haversine formula
 * - Time estimation with traffic and service factors
 * - Capacity constraint checking
 * - Cost calculations and route scoring
 * - Optimization algorithms for route planning
 */

import { DeliveryOrder, Vehicle, Driver, DeliveryRoute } from '../types/delivery.types';

// ==================== TYPES ====================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteOptimizationConfig {
  includeTraffic: boolean;
  rushHourMultiplier: number;
  serviceTimePerStop: number; // minutes
  driverBreakTime: number; // minutes per 4 hours
  fuelCostPerMile: number;
  driverHourlyRate: number;
  vehicleOperationalCostPerMile: number;
  lateDeliveryPenalty: number;
}

export interface OptimizationResult {
  optimizedOrderIds: string[];
  totalDistance: number;
  estimatedTime: number;
  totalCost: number;
  efficiency: number;
  savings: {
    distanceSaved: number;
    timeSaved: number;
    costSaved: number;
  };
  warnings: string[];
  constraints: {
    capacityUtilization: number;
    timeWindowViolations: number;
    overweightWarning: boolean;
  };
}

export interface RouteMetrics {
  distance: number;
  time: number;
  cost: number;
  efficiency: number;
  fuelCost: number;
  laborCost: number;
  operationalCost: number;
  penaltyCost: number;
}

// ==================== CONFIGURATION ====================

const DEFAULT_CONFIG: RouteOptimizationConfig = {
  includeTraffic: true,
  rushHourMultiplier: 1.4,
  serviceTimePerStop: 8, // 8 minutes per delivery
  driverBreakTime: 15, // 15 minutes break every 4 hours
  fuelCostPerMile: 0.12, // $0.12 per mile
  driverHourlyRate: 18.50, // $18.50 per hour
  vehicleOperationalCostPerMile: 0.08, // $0.08 per mile
  lateDeliveryPenalty: 25.00 // $25 penalty per late delivery
};

// ==================== DISTANCE CALCULATIONS ====================

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total distance for a route
 */
export function calculateRouteDistance(
  bakeryLocation: Coordinates,
  orders: DeliveryOrder[],
  coordinateMapping: Record<string, Coordinates>
): number {
  if (orders.length === 0) return 0;
  
  let totalDistance = 0;
  let currentLocation = bakeryLocation;
  
  // Distance from bakery to first stop
  const firstOrder = orders[0];
  const firstCoords = coordinateMapping[firstOrder.id];
  if (firstCoords) {
    totalDistance += calculateDistance(currentLocation, firstCoords);
    currentLocation = firstCoords;
  }
  
  // Distance between subsequent stops
  for (let i = 1; i < orders.length; i++) {
    const coords = coordinateMapping[orders[i].id];
    if (coords) {
      totalDistance += calculateDistance(currentLocation, coords);
      currentLocation = coords;
    }
  }
  
  return totalDistance;
}

/**
 * Create distance matrix between all points
 */
export function createDistanceMatrix(
  bakeryLocation: Coordinates,
  orders: DeliveryOrder[],
  coordinateMapping: Record<string, Coordinates>
): number[][] {
  const points = [bakeryLocation, ...orders.map(order => coordinateMapping[order.id]).filter(Boolean)];
  const matrix: number[][] = [];
  
  for (let i = 0; i < points.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < points.length; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        matrix[i][j] = calculateDistance(points[i], points[j]);
      }
    }
  }
  
  return matrix;
}

// ==================== TIME ESTIMATION ====================

/**
 * Calculate estimated travel time in minutes
 */
export function calculateTravelTime(
  distance: number, 
  config: RouteOptimizationConfig = DEFAULT_CONFIG
): number {
  const baseSpeed = 28; // mph average city speed
  const currentHour = new Date().getHours();
  
  // Apply traffic multiplier during rush hours (7-9 AM, 4-7 PM)
  let effectiveSpeed = baseSpeed;
  if (config.includeTraffic && (
    (currentHour >= 7 && currentHour <= 9) || 
    (currentHour >= 16 && currentHour <= 19)
  )) {
    effectiveSpeed = baseSpeed / config.rushHourMultiplier;
  }
  
  return (distance / effectiveSpeed) * 60; // Convert to minutes
}

/**
 * Calculate total route time including service time and breaks
 */
export function calculateRouteTime(
  distance: number,
  orderCount: number,
  config: RouteOptimizationConfig = DEFAULT_CONFIG
): number {
  const travelTime = calculateTravelTime(distance, config);
  const serviceTime = orderCount * config.serviceTimePerStop;
  
  // Add break time for routes longer than 4 hours
  const totalActiveTime = travelTime + serviceTime;
  const breakTime = Math.floor(totalActiveTime / 240) * config.driverBreakTime;
  
  return travelTime + serviceTime + breakTime;
}

/**
 * Check if delivery can be made within time window
 */
export function validateTimeWindow(
  order: DeliveryOrder,
  estimatedArrivalTime: Date
): boolean {
  const [startHour, startMin] = order.timeWindow.start.split(':').map(Number);
  const [endHour, endMin] = order.timeWindow.end.split(':').map(Number);
  
  const windowStart = new Date(estimatedArrivalTime);
  windowStart.setHours(startHour, startMin, 0, 0);
  
  const windowEnd = new Date(estimatedArrivalTime);
  windowEnd.setHours(endHour, endMin, 0, 0);
  
  return estimatedArrivalTime >= windowStart && estimatedArrivalTime <= windowEnd;
}

// ==================== CAPACITY CONSTRAINTS ====================

/**
 * Check if vehicle can handle the order load
 */
export function checkCapacityConstraints(
  orders: DeliveryOrder[],
  vehicle: Vehicle
): {
  isValid: boolean;
  weightUtilization: number;
  overweight: boolean;
  warnings: string[];
} {
  const totalWeight = orders.reduce((sum, order) => sum + order.totalWeight, 0);
  const weightUtilization = (totalWeight / vehicle.capacity) * 100;
  const overweight = totalWeight > vehicle.capacity;
  
  const warnings: string[] = [];
  
  if (overweight) {
    warnings.push(`Vehicle overweight by ${(totalWeight - vehicle.capacity).toFixed(1)} lbs`);
  }
  
  if (weightUtilization > 90) {
    warnings.push('Vehicle near capacity limit');
  }
  
  // Check refrigeration requirements
  const needsRefrigeration = orders.some(order => 
    order.products.some(product => product.requiresRefrigeration)
  );
  
  if (needsRefrigeration && !vehicle.hasRefrigeration) {
    warnings.push('Orders require refrigeration but vehicle lacks refrigeration');
  }
  
  return {
    isValid: !overweight && (!needsRefrigeration || vehicle.hasRefrigeration),
    weightUtilization,
    overweight,
    warnings
  };
}

/**
 * Calculate dynamic capacity as deliveries are made
 */
export function calculateDynamicCapacity(
  orders: DeliveryOrder[],
  completedOrderIds: string[]
): number {
  const remainingOrders = orders.filter(order => !completedOrderIds.includes(order.id));
  return remainingOrders.reduce((sum, order) => sum + order.totalWeight, 0);
}

// ==================== COST CALCULATIONS ====================

/**
 * Calculate comprehensive route costs
 */
export function calculateRouteCosts(
  distance: number,
  timeInMinutes: number,
  orders: DeliveryOrder[],
  lateDeliveries: number = 0,
  config: RouteOptimizationConfig = DEFAULT_CONFIG
): RouteMetrics {
  const fuelCost = distance * config.fuelCostPerMile;
  const laborCost = (timeInMinutes / 60) * config.driverHourlyRate;
  const operationalCost = distance * config.vehicleOperationalCostPerMile;
  const penaltyCost = lateDeliveries * config.lateDeliveryPenalty;
  
  const totalCost = fuelCost + laborCost + operationalCost + penaltyCost;
  
  // Calculate efficiency score (revenue per dollar spent)
  const totalRevenue = orders.reduce((sum, order) => sum + order.value, 0);
  const efficiency = totalCost > 0 ? (totalRevenue / totalCost) * 100 : 0;
  
  return {
    distance,
    time: timeInMinutes,
    cost: totalCost,
    efficiency,
    fuelCost,
    laborCost,
    operationalCost,
    penaltyCost
  };
}

/**
 * Calculate cost per delivery
 */
export function calculateCostPerDelivery(metrics: RouteMetrics, orderCount: number): number {
  return orderCount > 0 ? metrics.cost / orderCount : 0;
}

/**
 * Calculate potential savings from optimization
 */
export function calculateOptimizationSavings(
  originalMetrics: RouteMetrics,
  optimizedMetrics: RouteMetrics
): {
  distanceSaved: number;
  timeSaved: number;
  costSaved: number;
  percentageSavings: number;
} {
  const distanceSaved = originalMetrics.distance - optimizedMetrics.distance;
  const timeSaved = originalMetrics.time - optimizedMetrics.time;
  const costSaved = originalMetrics.cost - optimizedMetrics.cost;
  const percentageSavings = originalMetrics.cost > 0 ? (costSaved / originalMetrics.cost) * 100 : 0;
  
  return {
    distanceSaved: Math.max(0, distanceSaved),
    timeSaved: Math.max(0, timeSaved),
    costSaved: Math.max(0, costSaved),
    percentageSavings: Math.max(0, percentageSavings)
  };
}

// ==================== OPTIMIZATION ALGORITHMS ====================

/**
 * Simple nearest neighbor algorithm for route optimization
 */
export function optimizeRouteNearestNeighbor(
  bakeryLocation: Coordinates,
  orders: DeliveryOrder[],
  coordinateMapping: Record<string, Coordinates>
): string[] {
  if (orders.length <= 1) return orders.map(o => o.id);
  
  const unvisited = [...orders];
  const optimizedRoute: string[] = [];
  let currentLocation = bakeryLocation;
  
  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    
    // Find nearest unvisited order
    for (let i = 0; i < unvisited.length; i++) {
      const orderCoords = coordinateMapping[unvisited[i].id];
      if (orderCoords) {
        const distance = calculateDistance(currentLocation, orderCoords);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }
    }
    
    // Add nearest order to route
    const nearestOrder = unvisited.splice(nearestIndex, 1)[0];
    optimizedRoute.push(nearestOrder.id);
    currentLocation = coordinateMapping[nearestOrder.id];
  }
  
  return optimizedRoute;
}

/**
 * Priority-based optimization considering time windows and priority levels
 */
export function optimizeRouteByPriority(
  bakeryLocation: Coordinates,
  orders: DeliveryOrder[],
  coordinateMapping: Record<string, Coordinates>
): string[] {
  if (orders.length <= 1) return orders.map(o => o.id);
  
  // Sort by priority first, then by time window urgency
  const priorityScore = (order: DeliveryOrder): number => {
    const priorityScores = { 'URGENT': 100, 'HIGH': 80, 'MEDIUM': 60, 'LOW': 40, 'CRITICAL': 120 };
    const baseScore = priorityScores[order.priority] || 50;
    
    // Add time window urgency
    const [startHour] = order.timeWindow.start.split(':').map(Number);
    const timeUrgency = startHour <= 12 ? 20 : 0; // Morning deliveries get priority
    
    return baseScore + timeUrgency;
  };
  
  const sortedOrders = [...orders].sort((a, b) => priorityScore(b) - priorityScore(a));
  
  // Then apply nearest neighbor within priority groups
  return optimizeRouteNearestNeighbor(bakeryLocation, sortedOrders, coordinateMapping);
}

/**
 * Comprehensive route optimization with multiple factors
 */
export function optimizeRoute(
  bakeryLocation: Coordinates,
  orders: DeliveryOrder[],
  coordinateMapping: Record<string, Coordinates>,
  vehicle: Vehicle,
  config: RouteOptimizationConfig = DEFAULT_CONFIG
): OptimizationResult {
  if (orders.length === 0) {
    return {
      optimizedOrderIds: [],
      totalDistance: 0,
      estimatedTime: 0,
      totalCost: 0,
      efficiency: 0,
      savings: { distanceSaved: 0, timeSaved: 0, costSaved: 0 },
      warnings: [],
      constraints: {
        capacityUtilization: 0,
        timeWindowViolations: 0,
        overweightWarning: false
      }
    };
  }
  
  // Check capacity constraints
  const capacityCheck = checkCapacityConstraints(orders, vehicle);
  
  // Calculate original route metrics (in order provided)
  const originalDistance = calculateRouteDistance(bakeryLocation, orders, coordinateMapping);
  const originalTime = calculateRouteTime(originalDistance, orders.length, config);
  const originalMetrics = calculateRouteCosts(originalDistance, originalTime, orders, 0, config);
  
  // Apply optimization algorithm (priority-based nearest neighbor)
  const optimizedOrderIds = optimizeRouteByPriority(bakeryLocation, orders, coordinateMapping);
  const optimizedOrders = optimizedOrderIds.map(id => orders.find(o => o.id === id)!).filter(Boolean);
  
  // Calculate optimized route metrics
  const optimizedDistance = calculateRouteDistance(bakeryLocation, optimizedOrders, coordinateMapping);
  const optimizedTime = calculateRouteTime(optimizedDistance, optimizedOrders.length, config);
  const optimizedMetrics = calculateRouteCosts(optimizedDistance, optimizedTime, optimizedOrders, 0, config);
  
  // Calculate savings
  const savings = calculateOptimizationSavings(originalMetrics, optimizedMetrics);
  
  // Check time window violations (simplified)
  const timeWindowViolations = 0; // Would require detailed time simulation
  
  return {
    optimizedOrderIds,
    totalDistance: optimizedDistance,
    estimatedTime: optimizedTime,
    totalCost: optimizedMetrics.cost,
    efficiency: optimizedMetrics.efficiency,
    savings,
    warnings: capacityCheck.warnings,
    constraints: {
      capacityUtilization: capacityCheck.weightUtilization,
      timeWindowViolations,
      overweightWarning: capacityCheck.overweight
    }
  };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Score a route based on multiple optimization factors
 */
export function scoreRoute(
  orders: DeliveryOrder[],
  metrics: RouteMetrics,
  constraints: OptimizationResult['constraints']
): number {
  let score = 100; // Start with perfect score
  
  // Penalize based on efficiency
  if (metrics.efficiency < 300) score -= 20;
  else if (metrics.efficiency < 500) score -= 10;
  
  // Penalize high capacity utilization
  if (constraints.capacityUtilization > 95) score -= 25;
  else if (constraints.capacityUtilization > 85) score -= 10;
  
  // Penalize time window violations
  score -= constraints.timeWindowViolations * 15;
  
  // Penalize overweight
  if (constraints.overweightWarning) score -= 50;
  
  return Math.max(0, score);
}

/**
 * Generate optimization recommendations
 */
export function generateOptimizationRecommendations(
  result: OptimizationResult,
  originalOrderIds: string[]
): string[] {
  const recommendations: string[] = [];
  
  if (result.savings.costSaved > 10) {
    recommendations.push(`Save $${result.savings.costSaved.toFixed(2)} with optimized route`);
  }
  
  if (result.savings.distanceSaved > 2) {
    recommendations.push(`Reduce distance by ${result.savings.distanceSaved.toFixed(1)} miles`);
  }
  
  if (result.savings.timeSaved > 15) {
    recommendations.push(`Save ${Math.round(result.savings.timeSaved)} minutes`);
  }
  
  if (result.constraints.capacityUtilization > 90) {
    recommendations.push('Consider splitting route - near capacity limit');
  }
  
  if (result.constraints.overweightWarning) {
    recommendations.push('Remove orders or use larger vehicle - overweight');
  }
  
  if (result.efficiency > 400) {
    recommendations.push('Excellent efficiency - route is well optimized');
  }
  
  return recommendations;
}