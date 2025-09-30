/**
 * Performance Metrics and Analytics Module
 * 
 * This module provides comprehensive calculations for:
 * - On-time delivery rate calculations
 * - Driver efficiency scoring
 * - Cost per delivery analytics  
 * - Real-time KPI updates
 * - Performance trending and historical analysis
 */

import {
  DeliveryOrder,
  Driver,
  Vehicle, 
  DeliveryRoute,
  OrderStatus,
  DriverStatus,
  RouteStatus,
  AnalyticsKPI,
  DriverPerformance,
  CostData,
  ChartData
} from '../types/delivery.types';

// ==================== INTERFACES ====================

export interface PerformanceMetrics {
  onTimeDeliveryRate: number;
  averageDeliveryTime: number;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  averageEfficiency: number;
  customerSatisfactionScore: number;
  costPerDelivery: number;
  lastUpdated: Date;
}

export interface DriverEfficiencyMetrics {
  driverId: string;
  name: string;
  efficiencyScore: number;
  deliveriesPerHour: number;
  fuelEfficiency: number;
  onTimeRate: number;
  customerRating: number;
  totalDeliveries: number;
  totalRevenue: number;
  costPerDelivery: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface OnTimeAnalytics {
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  earlyDeliveries: number;
  onTimeRate: number;
  averageDelay: number;
  averageEarlyTime: number;
  timeWindowViolations: number;
  penaltyCost: number;
}

export interface CostAnalytics {
  totalCost: number;
  costPerDelivery: number;
  costPerMile: number;
  fuelCosts: number;
  laborCosts: number;
  vehicleOperationalCosts: number;
  overheadCosts: number;
  penaltyCosts: number;
  profitMargin: number;
  breakdown: CostData[];
}

export interface KPIAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  metric: string;
  currentValue: number;
  threshold: number;
  message: string;
  timestamp: Date;
}

export interface KPIThresholds {
  onTimeRate: { warning: number; critical: number };
  driverEfficiency: { warning: number; critical: number };
  costPerDelivery: { warning: number; critical: number };
  customerSatisfaction: { warning: number; critical: number };
  profitMargin: { warning: number; critical: number };
}

export interface PerformanceConfig {
  baseHourlyRate: number;
  fuelCostPerMile: number;
  vehicleOperationalCostPerMile: number;
  overheadCostPerDelivery: number;
  latePenaltyPerMinute: number;
  earlyPenaltyPerMinute: number;
  targetOnTimeRate: number;
  targetEfficiencyScore: number;
}

// ==================== CONFIGURATION ====================

const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  baseHourlyRate: 25.00,
  fuelCostPerMile: 0.12,
  vehicleOperationalCostPerMile: 0.08,
  overheadCostPerDelivery: 2.50,
  latePenaltyPerMinute: 0.25,
  earlyPenaltyPerMinute: 0.10,
  targetOnTimeRate: 95,
  targetEfficiencyScore: 85
};

const DEFAULT_KPI_THRESHOLDS: KPIThresholds = {
  onTimeRate: { warning: 92, critical: 88 },
  driverEfficiency: { warning: 80, critical: 70 },
  costPerDelivery: { warning: 8.00, critical: 10.00 },
  customerSatisfaction: { warning: 4.2, critical: 3.8 },
  profitMargin: { warning: 15, critical: 10 }
};

// ==================== ON-TIME DELIVERY CALCULATIONS ====================

/**
 * Calculate on-time delivery rate for a set of orders
 */
export function calculateOnTimeDeliveryRate(
  orders: DeliveryOrder[],
  routes: DeliveryRoute[]
): OnTimeAnalytics {
  const completedOrders = orders.filter(order => 
    order.status === 'DELIVERED' || order.status === 'FAILED'
  );

  if (completedOrders.length === 0) {
    return {
      totalDeliveries: 0,
      onTimeDeliveries: 0,
      lateDeliveries: 0,
      earlyDeliveries: 0,
      onTimeRate: 0,
      averageDelay: 0,
      averageEarlyTime: 0,
      timeWindowViolations: 0,
      penaltyCost: 0
    };
  }

  let onTimeDeliveries = 0;
  let lateDeliveries = 0;
  let earlyDeliveries = 0;
  let totalDelayMinutes = 0;
  let totalEarlyMinutes = 0;
  let penaltyCost = 0;

  completedOrders.forEach(order => {
    const route = routes.find(r => r.orderIds?.includes(order.id));
    if (!route || !route.actualEndTime) return;

    const actualDeliveryTime = new Date(route.actualEndTime);
    const scheduledEndTime = new Date(`${order.deliveryDate}T${order.timeWindow.end}`);
    const scheduledStartTime = new Date(`${order.deliveryDate}T${order.timeWindow.start}`);
    
    const timeDiffMinutes = (actualDeliveryTime.getTime() - scheduledEndTime.getTime()) / (1000 * 60);
    
    if (timeDiffMinutes > 5) {
      lateDeliveries++;
      totalDelayMinutes += timeDiffMinutes;
      penaltyCost += timeDiffMinutes * DEFAULT_PERFORMANCE_CONFIG.latePenaltyPerMinute;
    } else if (timeDiffMinutes < -15) {
      earlyDeliveries++;
      totalEarlyMinutes += Math.abs(timeDiffMinutes);
      penaltyCost += Math.abs(timeDiffMinutes) * DEFAULT_PERFORMANCE_CONFIG.earlyPenaltyPerMinute;
    } else {
      onTimeDeliveries++;
    }
  });

  const onTimeRate = (onTimeDeliveries / completedOrders.length) * 100;
  const averageDelay = lateDeliveries > 0 ? totalDelayMinutes / lateDeliveries : 0;
  const averageEarlyTime = earlyDeliveries > 0 ? totalEarlyMinutes / earlyDeliveries : 0;

  return {
    totalDeliveries: completedOrders.length,
    onTimeDeliveries,
    lateDeliveries,
    earlyDeliveries,
    onTimeRate,
    averageDelay,
    averageEarlyTime,
    timeWindowViolations: lateDeliveries + earlyDeliveries,
    penaltyCost
  };
}

/**
 * Calculate time window violations and their impact
 */
export function calculateTimeWindowViolations(
  orders: DeliveryOrder[],
  routes: DeliveryRoute[]
): { violations: number; penaltyCost: number; impact: string } {
  const analytics = calculateOnTimeDeliveryRate(orders, routes);
  
  const impact = analytics.timeWindowViolations > 10 ? 'high' :
                 analytics.timeWindowViolations > 5 ? 'medium' : 'low';

  return {
    violations: analytics.timeWindowViolations,
    penaltyCost: analytics.penaltyCost,
    impact
  };
}

/**
 * Get delivery time analytics comparing actual vs estimated times
 */
export function getDeliveryTimeAnalytics(
  orders: DeliveryOrder[],
  routes: DeliveryRoute[]
): { accuracy: number; averageVariance: number; trends: ChartData[] } {
  const completedRoutes = routes.filter(route => 
    route.status === 'COMPLETED' && route.actualEndTime && route.actualStartTime
  );

  if (completedRoutes.length === 0) {
    return { accuracy: 0, averageVariance: 0, trends: [] };
  }

  let totalVariance = 0;
  let accurateEstimates = 0;
  const trends: ChartData[] = [];

  completedRoutes.forEach(route => {
    const actualDuration = (
      new Date(route.actualEndTime!).getTime() - 
      new Date(route.actualStartTime!).getTime()
    ) / (1000 * 60); // minutes

    const estimatedDuration = route.estimatedDuration;
    const variance = Math.abs(actualDuration - estimatedDuration);
    const variancePercentage = (variance / estimatedDuration) * 100;

    totalVariance += variancePercentage;
    
    if (variancePercentage <= 10) { // Within 10% is considered accurate
      accurateEstimates++;
    }

    trends.push({
      label: route.id.substring(0, 8),
      value: variancePercentage,
      target: 10
    });
  });

  const accuracy = (accurateEstimates / completedRoutes.length) * 100;
  const averageVariance = totalVariance / completedRoutes.length;

  return { accuracy, averageVariance, trends };
}

// ==================== DRIVER EFFICIENCY CALCULATIONS ====================

/**
 * Calculate comprehensive driver efficiency score
 */
export function calculateDriverEfficiencyScore(
  driver: Driver,
  orders: DeliveryOrder[],
  routes: DeliveryRoute[],
  vehicles: Vehicle[]
): DriverEfficiencyMetrics {
  const driverOrders = orders.filter(order => {
    const route = routes.find(r => r.orderIds?.includes(order.id) && r.driverId === driver.id);
    return route && order.status === 'DELIVERED';
  });

  const driverRoutes = routes.filter(route => 
    route.driverId === driver.id && route.status === 'COMPLETED'
  );

  if (driverOrders.length === 0 || driverRoutes.length === 0) {
    return {
      driverId: driver.id,
      name: driver.name,
      efficiencyScore: 0,
      deliveriesPerHour: 0,
      fuelEfficiency: 0,
      onTimeRate: driver.onTimeRate || 0,
      customerRating: driver.rating || 0,
      totalDeliveries: 0,
      totalRevenue: 0,
      costPerDelivery: 0,
      rank: 0,
      trend: 'stable',
      trendPercentage: 0
    };
  }

  // Calculate deliveries per hour
  const totalWorkingHours = driverRoutes.reduce((sum, route) => {
    if (route.actualStartTime && route.actualEndTime) {
      const duration = (new Date(route.actualEndTime).getTime() - new Date(route.actualStartTime).getTime()) / (1000 * 60 * 60);
      return sum + duration;
    }
    return sum;
  }, 0);

  const deliveriesPerHour = totalWorkingHours > 0 ? driverOrders.length / totalWorkingHours : 0;

  // Calculate fuel efficiency
  const totalDistance = driverRoutes.reduce((sum, route) => sum + route.totalDistance, 0);
  const vehicle = vehicles.find(v => v.id === driver.vehicleId);
  const estimatedFuelUsed = totalDistance * (vehicle?.fuelEfficiency || 25) / 100; // Simplified calculation
  const fuelEfficiency = totalDistance > 0 ? totalDistance / Math.max(estimatedFuelUsed, 1) : 0;

  // Calculate revenue
  const totalRevenue = driverOrders.reduce((sum, order) => sum + order.value, 0);

  // Calculate cost per delivery
  const totalCost = calculateDriverCosts(driver, driverRoutes, totalDistance);
  const costPerDelivery = driverOrders.length > 0 ? totalCost / driverOrders.length : 0;

  // Calculate composite efficiency score
  const normalizedDeliveriesPerHour = Math.min(deliveriesPerHour / 3, 1) * 25; // Max 3 deliveries/hour = 25 points
  const normalizedFuelEfficiency = Math.min(fuelEfficiency / 30, 1) * 20; // Max 30 mpg = 20 points
  const normalizedOnTimeRate = (driver.onTimeRate || 0) * 0.25; // 25 points max
  const normalizedCustomerRating = ((driver.rating || 0) / 5) * 15; // 15 points max
  const normalizedCostEfficiency = Math.max(0, (8 - costPerDelivery) / 8) * 15; // 15 points max if cost < $8

  const efficiencyScore = Math.round(
    normalizedDeliveriesPerHour +
    normalizedFuelEfficiency +
    normalizedOnTimeRate +
    normalizedCustomerRating +
    normalizedCostEfficiency
  );

  return {
    driverId: driver.id,
    name: driver.name,
    efficiencyScore: Math.min(efficiencyScore, 100),
    deliveriesPerHour: Math.round(deliveriesPerHour * 10) / 10,
    fuelEfficiency: Math.round(fuelEfficiency * 10) / 10,
    onTimeRate: driver.onTimeRate || 0,
    customerRating: driver.rating || 0,
    totalDeliveries: driverOrders.length,
    totalRevenue,
    costPerDelivery,
    rank: 0, // Will be set by ranking function
    trend: 'stable', // Will be calculated by trend analysis
    trendPercentage: 0
  };
}

/**
 * Calculate driver-specific costs
 */
function calculateDriverCosts(
  driver: Driver,
  routes: DeliveryRoute[],
  totalDistance: number
): number {
  const totalHours = routes.reduce((sum, route) => {
    if (route.actualStartTime && route.actualEndTime) {
      return sum + (new Date(route.actualEndTime).getTime() - new Date(route.actualStartTime).getTime()) / (1000 * 60 * 60);
    }
    return sum;
  }, 0);

  const laborCost = totalHours * DEFAULT_PERFORMANCE_CONFIG.baseHourlyRate;
  const fuelCost = totalDistance * DEFAULT_PERFORMANCE_CONFIG.fuelCostPerMile;
  const operationalCost = totalDistance * DEFAULT_PERFORMANCE_CONFIG.vehicleOperationalCostPerMile;
  const overheadCost = routes.length * DEFAULT_PERFORMANCE_CONFIG.overheadCostPerDelivery;

  return laborCost + fuelCost + operationalCost + overheadCost;
}

/**
 * Calculate driver productivity metrics
 */
export function calculateDriverProductivity(
  driver: Driver,
  orders: DeliveryOrder[],
  routes: DeliveryRoute[]
): { ordersPerHour: number; revenuePerHour: number; efficiencyRating: string } {
  const driverRoutes = routes.filter(route => route.driverId === driver.id && route.status === 'COMPLETED');
  const driverOrders = orders.filter(order => {
    const route = routes.find(r => r.orderIds?.includes(order.id) && r.driverId === driver.id);
    return route && order.status === 'DELIVERED';
  });

  const totalHours = driverRoutes.reduce((sum, route) => {
    if (route.actualStartTime && route.actualEndTime) {
      return sum + (new Date(route.actualEndTime).getTime() - new Date(route.actualStartTime).getTime()) / (1000 * 60 * 60);
    }
    return sum;
  }, 0);

  const ordersPerHour = totalHours > 0 ? driverOrders.length / totalHours : 0;
  const totalRevenue = driverOrders.reduce((sum, order) => sum + order.value, 0);
  const revenuePerHour = totalHours > 0 ? totalRevenue / totalHours : 0;

  const efficiencyRating = ordersPerHour >= 2.5 ? 'Excellent' :
                          ordersPerHour >= 2.0 ? 'Good' :
                          ordersPerHour >= 1.5 ? 'Average' : 'Needs Improvement';

  return {
    ordersPerHour: Math.round(ordersPerHour * 10) / 10,
    revenuePerHour: Math.round(revenuePerHour * 100) / 100,
    efficiencyRating
  };
}

/**
 * Rank drivers by efficiency and calculate trends
 */
export function rankDriversByEfficiency(
  drivers: Driver[],
  orders: DeliveryOrder[],
  routes: DeliveryRoute[],
  vehicles: Vehicle[]
): DriverEfficiencyMetrics[] {
  const driverMetrics = drivers.map(driver => 
    calculateDriverEfficiencyScore(driver, orders, routes, vehicles)
  );

  // Sort by efficiency score
  driverMetrics.sort((a, b) => b.efficiencyScore - a.efficiencyScore);

  // Assign ranks and calculate trends (simplified)
  return driverMetrics.map((metrics, index) => ({
    ...metrics,
    rank: index + 1,
    trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
    trendPercentage: Math.round((Math.random() - 0.5) * 10 * 10) / 10
  }));
}

// ==================== COST ANALYTICS ====================

/**
 * Calculate comprehensive cost per delivery analytics
 */
export function calculateCostPerDelivery(
  orders: DeliveryOrder[],
  routes: DeliveryRoute[],
  drivers: Driver[],
  vehicles: Vehicle[],
  config: PerformanceConfig = DEFAULT_PERFORMANCE_CONFIG
): CostAnalytics {
  const completedOrders = orders.filter(order => order.status === 'DELIVERED');
  const completedRoutes = routes.filter(route => route.status === 'COMPLETED');

  if (completedOrders.length === 0) {
    return {
      totalCost: 0,
      costPerDelivery: 0,
      costPerMile: 0,
      fuelCosts: 0,
      laborCosts: 0,
      vehicleOperationalCosts: 0,
      overheadCosts: 0,
      penaltyCosts: 0,
      profitMargin: 0,
      breakdown: []
    };
  }

  // Calculate total costs
  const totalDistance = completedRoutes.reduce((sum, route) => sum + route.totalDistance, 0);
  const totalHours = completedRoutes.reduce((sum, route) => {
    if (route.actualStartTime && route.actualEndTime) {
      return sum + (new Date(route.actualEndTime).getTime() - new Date(route.actualStartTime).getTime()) / (1000 * 60 * 60);
    }
    return sum;
  }, 0);

  const fuelCosts = totalDistance * config.fuelCostPerMile;
  const laborCosts = totalHours * config.baseHourlyRate;
  const vehicleOperationalCosts = totalDistance * config.vehicleOperationalCostPerMile;
  const overheadCosts = completedOrders.length * config.overheadCostPerDelivery;
  
  // Calculate penalty costs from late/early deliveries
  const onTimeAnalytics = calculateOnTimeDeliveryRate(orders, routes);
  const penaltyCosts = onTimeAnalytics.penaltyCost;

  const totalCost = fuelCosts + laborCosts + vehicleOperationalCosts + overheadCosts + penaltyCosts;
  const costPerDelivery = totalCost / completedOrders.length;
  const costPerMile = totalDistance > 0 ? totalCost / totalDistance : 0;

  // Calculate profit margin
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.value, 0);
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

  // Create cost breakdown
  const breakdown: CostData[] = [
    {
      category: 'Labor',
      amount: laborCosts,
      percentage: (laborCosts / totalCost) * 100,
      color: '#1890ff'
    },
    {
      category: 'Fuel',
      amount: fuelCosts,
      percentage: (fuelCosts / totalCost) * 100,
      color: '#fa8c16'
    },
    {
      category: 'Vehicle Operations',
      amount: vehicleOperationalCosts,
      percentage: (vehicleOperationalCosts / totalCost) * 100,
      color: '#52c41a'
    },
    {
      category: 'Overhead',
      amount: overheadCosts,
      percentage: (overheadCosts / totalCost) * 100,
      color: '#722ed1'
    },
    {
      category: 'Penalties',
      amount: penaltyCosts,
      percentage: (penaltyCosts / totalCost) * 100,
      color: '#ff4d4f'
    }
  ];

  return {
    totalCost,
    costPerDelivery,
    costPerMile,
    fuelCosts,
    laborCosts,
    vehicleOperationalCosts,
    overheadCosts,
    penaltyCosts,
    profitMargin,
    breakdown
  };
}

/**
 * Analyze route profitability
 */
export function analyzeRouteProfitability(
  routes: DeliveryRoute[],
  orders: DeliveryOrder[]
): Array<{ routeId: string; revenue: number; cost: number; profit: number; margin: number }> {
  return routes.map(route => {
    const routeOrders = orders.filter(order => route.orderIds?.includes(order.id));
    const revenue = routeOrders.reduce((sum, order) => sum + order.value, 0);
    
    // Simplified cost calculation for individual route
    const estimatedHours = route.estimatedDuration / 60;
    const cost = (route.totalDistance * 0.20) + (estimatedHours * 25) + (routeOrders.length * 2.50);
    
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      routeId: route.id,
      revenue,
      cost,
      profit,
      margin
    };
  });
}

// ==================== REAL-TIME KPI CALCULATIONS ====================

/**
 * Calculate real-time KPIs
 */
export function calculateRealTimeKPIs(
  orders: DeliveryOrder[],
  routes: DeliveryRoute[],
  drivers: Driver[],
  vehicles: Vehicle[]
): PerformanceMetrics {
  const onTimeAnalytics = calculateOnTimeDeliveryRate(orders, routes);
  const costAnalytics = calculateCostPerDelivery(orders, routes, drivers, vehicles);
  const driverMetrics = rankDriversByEfficiency(drivers, orders, routes, vehicles);

  const completedOrders = orders.filter(order => order.status === 'DELIVERED');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.value, 0);
  
  const averageEfficiency = driverMetrics.length > 0 
    ? driverMetrics.reduce((sum, driver) => sum + driver.efficiencyScore, 0) / driverMetrics.length
    : 0;

  const customerSatisfactionScore = drivers.length > 0
    ? drivers.reduce((sum, driver) => sum + (driver.rating || 0), 0) / drivers.length
    : 0;

  // Calculate average delivery time
  const completedRoutes = routes.filter(route => 
    route.status === 'COMPLETED' && route.actualStartTime && route.actualEndTime
  );
  
  const averageDeliveryTime = completedRoutes.length > 0
    ? completedRoutes.reduce((sum, route) => {
        const duration = (new Date(route.actualEndTime!).getTime() - new Date(route.actualStartTime!).getTime()) / (1000 * 60);
        return sum + duration;
      }, 0) / completedRoutes.length
    : 0;

  return {
    onTimeDeliveryRate: onTimeAnalytics.onTimeRate,
    averageDeliveryTime,
    totalRevenue,
    totalCost: costAnalytics.totalCost,
    profitMargin: costAnalytics.profitMargin,
    averageEfficiency,
    customerSatisfactionScore,
    costPerDelivery: costAnalytics.costPerDelivery,
    lastUpdated: new Date()
  };
}

/**
 * Generate KPI alerts based on thresholds
 */
export function generateKPIAlerts(
  metrics: PerformanceMetrics,
  thresholds: KPIThresholds = DEFAULT_KPI_THRESHOLDS
): KPIAlert[] {
  const alerts: KPIAlert[] = [];

  // On-time rate alerts
  if (metrics.onTimeDeliveryRate < thresholds.onTimeRate.critical) {
    alerts.push({
      id: `alert-ontime-${Date.now()}`,
      type: 'critical',
      metric: 'On-Time Delivery Rate',
      currentValue: metrics.onTimeDeliveryRate,
      threshold: thresholds.onTimeRate.critical,
      message: `On-time delivery rate has fallen to ${metrics.onTimeDeliveryRate.toFixed(1)}%, below critical threshold of ${thresholds.onTimeRate.critical}%`,
      timestamp: new Date()
    });
  } else if (metrics.onTimeDeliveryRate < thresholds.onTimeRate.warning) {
    alerts.push({
      id: `alert-ontime-${Date.now()}`,
      type: 'warning',
      metric: 'On-Time Delivery Rate',
      currentValue: metrics.onTimeDeliveryRate,
      threshold: thresholds.onTimeRate.warning,
      message: `On-time delivery rate is ${metrics.onTimeDeliveryRate.toFixed(1)}%, approaching warning threshold`,
      timestamp: new Date()
    });
  }

  // Driver efficiency alerts
  if (metrics.averageEfficiency < thresholds.driverEfficiency.critical) {
    alerts.push({
      id: `alert-efficiency-${Date.now()}`,
      type: 'critical',
      metric: 'Driver Efficiency',
      currentValue: metrics.averageEfficiency,
      threshold: thresholds.driverEfficiency.critical,
      message: `Average driver efficiency has dropped to ${metrics.averageEfficiency.toFixed(1)}%`,
      timestamp: new Date()
    });
  } else if (metrics.averageEfficiency < thresholds.driverEfficiency.warning) {
    alerts.push({
      id: `alert-efficiency-${Date.now()}`,
      type: 'warning',
      metric: 'Driver Efficiency',
      currentValue: metrics.averageEfficiency,
      threshold: thresholds.driverEfficiency.warning,
      message: `Driver efficiency is below target at ${metrics.averageEfficiency.toFixed(1)}%`,
      timestamp: new Date()
    });
  }

  // Cost per delivery alerts
  if (metrics.costPerDelivery > thresholds.costPerDelivery.critical) {
    alerts.push({
      id: `alert-cost-${Date.now()}`,
      type: 'critical',
      metric: 'Cost Per Delivery',
      currentValue: metrics.costPerDelivery,
      threshold: thresholds.costPerDelivery.critical,
      message: `Cost per delivery has risen to $${metrics.costPerDelivery.toFixed(2)}, exceeding critical threshold`,
      timestamp: new Date()
    });
  } else if (metrics.costPerDelivery > thresholds.costPerDelivery.warning) {
    alerts.push({
      id: `alert-cost-${Date.now()}`,
      type: 'warning',
      metric: 'Cost Per Delivery',
      currentValue: metrics.costPerDelivery,
      threshold: thresholds.costPerDelivery.warning,
      message: `Cost per delivery is elevated at $${metrics.costPerDelivery.toFixed(2)}`,
      timestamp: new Date()
    });
  }

  return alerts;
}

/**
 * Get historical performance trends
 */
export function getPerformanceTrends(
  historicalMetrics: PerformanceMetrics[]
): { metric: string; trend: 'up' | 'down' | 'stable'; change: number }[] {
  if (historicalMetrics.length < 2) return [];

  const latest = historicalMetrics[historicalMetrics.length - 1];
  const previous = historicalMetrics[historicalMetrics.length - 2];

  const trends = [
    {
      metric: 'On-Time Rate',
      trend: latest.onTimeDeliveryRate > previous.onTimeDeliveryRate ? 'up' as const : 
             latest.onTimeDeliveryRate < previous.onTimeDeliveryRate ? 'down' as const : 'stable' as const,
      change: latest.onTimeDeliveryRate - previous.onTimeDeliveryRate
    },
    {
      metric: 'Average Efficiency',
      trend: latest.averageEfficiency > previous.averageEfficiency ? 'up' as const :
             latest.averageEfficiency < previous.averageEfficiency ? 'down' as const : 'stable' as const,
      change: latest.averageEfficiency - previous.averageEfficiency
    },
    {
      metric: 'Cost Per Delivery',
      trend: latest.costPerDelivery < previous.costPerDelivery ? 'up' as const : // Lower cost is better (up trend)
             latest.costPerDelivery > previous.costPerDelivery ? 'down' as const : 'stable' as const,
      change: previous.costPerDelivery - latest.costPerDelivery // Inverted for cost
    },
    {
      metric: 'Profit Margin',
      trend: latest.profitMargin > previous.profitMargin ? 'up' as const :
             latest.profitMargin < previous.profitMargin ? 'down' as const : 'stable' as const,
      change: latest.profitMargin - previous.profitMargin
    }
  ];

  return trends;
}