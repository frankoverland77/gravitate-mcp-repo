/**
 * Data mapping and transformation utilities for delivery management system
 * 
 * This file contains functions for:
 * - Display formatting (currency, dates, time)
 * - Status color mapping
 * - Data aggregation and calculations
 * - Grid data transformations
 * - Chart data preparation
 */

import {
  DeliveryOrder,
  Driver,
  Vehicle,
  DeliveryRoute,
  OrderStatus,
  DriverStatus,
  VehicleStatus,
  RouteStatus,
  OrderPriority,
  RoutePriority,
  ChartData,
  AnalyticsKPI,
  CostData,
  DriverPerformance
} from '../types/delivery.types';

// ==================== DISPLAY FORMATTERS ====================

/**
 * Format currency values for display
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Format currency for large amounts (with K/M notation)
 */
export const formatLargeCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
};

/**
 * Format weight values
 */
export const formatWeight = (weight: number): string => {
  return `${weight} lbs`;
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format time duration in minutes to human readable
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
};

/**
 * Format distance values
 */
export const formatDistance = (miles: number): string => {
  return `${miles.toFixed(1)} miles`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Format time for display (24-hour to 12-hour)
 */
export const formatTime = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Format time window for display
 */
export const formatTimeWindow = (start: string, end: string): string => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

// ==================== STATUS COLOR MAPPING ====================

/**
 * Get color scheme for order status
 */
export const getOrderStatusColor = (status: OrderStatus) => {
  const colorMap = {
    'PENDING': { color: '#fa8c16', backgroundColor: '#fff7e6' },
    'ASSIGNED': { color: '#1890ff', backgroundColor: '#e6f7ff' },
    'IN_TRANSIT': { color: '#722ed1', backgroundColor: '#f9f0ff' },
    'OUT_FOR_DELIVERY': { color: '#13c2c2', backgroundColor: '#e6fffb' },
    'DELIVERED': { color: '#52c41a', backgroundColor: '#f6ffed' },
    'FAILED': { color: '#ff4d4f', backgroundColor: '#fff2f0' },
    'CANCELLED': { color: '#666', backgroundColor: '#f5f5f5' },
    'RETURNED': { color: '#fa541c', backgroundColor: '#fff2e8' }
  };
  return colorMap[status] || { color: '#666', backgroundColor: '#f5f5f5' };
};

/**
 * Get color scheme for order priority
 */
export const getOrderPriorityColor = (priority: OrderPriority) => {
  const colorMap = {
    'LOW': { color: '#52c41a', backgroundColor: '#f6ffed' },
    'MEDIUM': { color: '#1890ff', backgroundColor: '#e6f7ff' },
    'HIGH': { color: '#fa8c16', backgroundColor: '#fff7e6' },
    'URGENT': { color: '#ff4d4f', backgroundColor: '#fff2f0' },
    'CRITICAL': { color: '#a0122a', backgroundColor: '#ffebee' }
  };
  return colorMap[priority] || { color: '#666', backgroundColor: '#f5f5f5' };
};

/**
 * Get color scheme for driver status
 */
export const getDriverStatusColor = (status: DriverStatus) => {
  const colorMap = {
    'AVAILABLE': { color: '#52c41a', backgroundColor: '#f6ffed' },
    'ON_ROUTE': { color: '#1890ff', backgroundColor: '#e6f7ff' },
    'AT_STOP': { color: '#722ed1', backgroundColor: '#f9f0ff' },
    'BREAK': { color: '#fa8c16', backgroundColor: '#fff7e6' },
    'OFFLINE': { color: '#666', backgroundColor: '#f5f5f5' },
    'SICK': { color: '#ff4d4f', backgroundColor: '#fff2f0' },
    'VACATION': { color: '#13c2c2', backgroundColor: '#e6fffb' }
  };
  return colorMap[status] || { color: '#666', backgroundColor: '#f5f5f5' };
};

/**
 * Get color scheme for vehicle status
 */
export const getVehicleStatusColor = (status: VehicleStatus) => {
  const colorMap = {
    'AVAILABLE': { color: '#52c41a', backgroundColor: '#f6ffed' },
    'IN_USE': { color: '#1890ff', backgroundColor: '#e6f7ff' },
    'MAINTENANCE': { color: '#ff4d4f', backgroundColor: '#fff2f0' },
    'OUT_OF_SERVICE': { color: '#666', backgroundColor: '#f5f5f5' },
    'REFUELING': { color: '#fa8c16', backgroundColor: '#fff7e6' }
  };
  return colorMap[status] || { color: '#666', backgroundColor: '#f5f5f5' };
};

/**
 * Get color scheme for route status
 */
export const getRouteStatusColor = (status: RouteStatus) => {
  const colorMap = {
    'DRAFT': { color: '#666', backgroundColor: '#f5f5f5' },
    'SCHEDULED': { color: '#1890ff', backgroundColor: '#e6f7ff' },
    'ACTIVE': { color: '#52c41a', backgroundColor: '#f6ffed' },
    'PAUSED': { color: '#fa8c16', backgroundColor: '#fff7e6' },
    'COMPLETED': { color: '#722ed1', backgroundColor: '#f9f0ff' },
    'CANCELLED': { color: '#ff4d4f', backgroundColor: '#fff2f0' },
    'FAILED': { color: '#a0122a', backgroundColor: '#ffebee' }
  };
  return colorMap[status] || { color: '#666', backgroundColor: '#f5f5f5' };
};

/**
 * Get color for vehicle type
 */
export const getVehicleTypeColor = (type: string) => {
  const colorMap = {
    'VAN': { color: '#1890ff', backgroundColor: '#e6f7ff' },
    'TRUCK': { color: '#fa8c16', backgroundColor: '#fff7e6' },
    'CAR': { color: '#52c41a', backgroundColor: '#f6ffed' },
    'MOTORCYCLE': { color: '#722ed1', backgroundColor: '#f9f0ff' },
    'BICYCLE': { color: '#13c2c2', backgroundColor: '#e6fffb' }
  };
  return colorMap[type] || { color: '#666', backgroundColor: '#f5f5f5' };
};

/**
 * Get color based on efficiency rating
 */
export const getEfficiencyColor = (efficiency: number): string => {
  if (efficiency >= 95) return '#52c41a';
  if (efficiency >= 85) return '#1890ff';
  if (efficiency >= 75) return '#fa8c16';
  return '#ff4d4f';
};

/**
 * Get color based on on-time rate
 */
export const getOnTimeRateColor = (rate: number): string => {
  if (rate >= 97) return '#52c41a';
  if (rate >= 95) return '#fa8c16';
  return '#ff4d4f';
};

/**
 * Get fuel level color based on percentage
 */
export const getFuelLevelColor = (level: number): string => {
  if (level >= 60) return '#52c41a';
  if (level >= 30) return '#fa8c16';
  return '#ff4d4f';
};

// ==================== DATA CALCULATIONS ====================

/**
 * Calculate vehicle utilization rate
 */
export const calculateUtilizationRate = (currentLoad: number, capacity: number): number => {
  return (currentLoad / capacity) * 100;
};

/**
 * Calculate route progress percentage
 */
export const calculateRouteProgress = (completed: number, total: number): number => {
  return total > 0 ? (completed / total) * 100 : 0;
};

/**
 * Calculate order total value
 */
export const calculateOrderTotal = (order: DeliveryOrder): number => {
  return order.products.reduce((total, product) => {
    return total + (product.quantity * (product.unitPrice || 0));
  }, 0);
};

/**
 * Calculate estimated delivery time based on distance and traffic
 */
export const calculateEstimatedDeliveryTime = (distance: number, hasTraffic: boolean = false): number => {
  const baseSpeed = hasTraffic ? 25 : 35; // mph
  const loadingTime = 10; // minutes
  return Math.round((distance / baseSpeed) * 60) + loadingTime;
};

// ==================== DATA AGGREGATIONS ====================

/**
 * Get orders by status count
 */
export const getOrdersByStatus = (orders: DeliveryOrder[]) => {
  return orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>);
};

/**
 * Get drivers by status count
 */
export const getDriversByStatus = (drivers: Driver[]) => {
  return drivers.reduce((acc, driver) => {
    acc[driver.status] = (acc[driver.status] || 0) + 1;
    return acc;
  }, {} as Record<DriverStatus, number>);
};

/**
 * Get vehicles by status count
 */
export const getVehiclesByStatus = (vehicles: Vehicle[]) => {
  return vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<VehicleStatus, number>);
};

/**
 * Calculate total revenue from orders
 */
export const calculateTotalRevenue = (orders: DeliveryOrder[]): number => {
  return orders.reduce((total, order) => total + order.value, 0);
};

/**
 * Calculate average delivery time
 */
export const calculateAverageDeliveryTime = (routes: DeliveryRoute[]): number => {
  const completedRoutes = routes.filter(route => route.actualEndTime && route.actualStartTime);
  if (completedRoutes.length === 0) return 0;
  
  const totalTime = completedRoutes.reduce((sum, route) => {
    const start = new Date(route.actualStartTime!).getTime();
    const end = new Date(route.actualEndTime!).getTime();
    return sum + ((end - start) / (1000 * 60)); // Convert to minutes
  }, 0);
  
  return totalTime / completedRoutes.length;
};

// ==================== BATCH SUGGESTIONS ====================

/**
 * Generate intelligent batch suggestions for orders
 */
export const generateBatchSuggestions = (orders: DeliveryOrder[]) => {
  const pendingOrders = orders.filter(order => order.status === 'PENDING');
  
  // Group by geographic proximity (simplified)
  const downtownOrders = pendingOrders.filter(order => 
    order.deliveryAddress.toLowerCase().includes('downtown') ||
    order.deliveryAddress.toLowerCase().includes('main street') ||
    order.deliveryAddress.toLowerCase().includes('business')
  );
  
  const schoolOrders = pendingOrders.filter(order =>
    order.deliveryAddress.toLowerCase().includes('school') ||
    order.deliveryAddress.toLowerCase().includes('elementary') ||
    order.deliveryAddress.toLowerCase().includes('office')
  );
  
  const residentialOrders = pendingOrders.filter(order =>
    order.deliveryAddress.toLowerCase().includes('street') ||
    order.deliveryAddress.toLowerCase().includes('drive') ||
    order.deliveryAddress.toLowerCase().includes('avenue')
  ).filter(order => !downtownOrders.includes(order) && !schoolOrders.includes(order));
  
  const suggestions = [];
  
  if (downtownOrders.length >= 2) {
    const totalWeight = downtownOrders.reduce((sum, order) => sum + order.totalWeight, 0);
    const estimatedTime = calculateEstimatedDeliveryTime(12.3, true);
    
    suggestions.push({
      title: "Downtown Route",
      orders: downtownOrders.slice(0, 3).map(order => order.id),
      estimatedTime: formatDuration(estimatedTime),
      totalDistance: "12.3 miles",
      efficiency: totalWeight > 25 ? "High" : "Medium",
      totalWeight,
      orderCount: Math.min(downtownOrders.length, 3)
    });
  }
  
  if (schoolOrders.length >= 2) {
    const totalWeight = schoolOrders.reduce((sum, order) => sum + order.totalWeight, 0);
    const estimatedTime = calculateEstimatedDeliveryTime(8.7, false);
    
    suggestions.push({
      title: "School & Office Run",
      orders: schoolOrders.slice(0, 2).map(order => order.id),
      estimatedTime: formatDuration(estimatedTime),
      totalDistance: "8.7 miles",
      efficiency: "Medium",
      totalWeight,
      orderCount: Math.min(schoolOrders.length, 2)
    });
  }
  
  if (residentialOrders.length >= 2) {
    const totalWeight = residentialOrders.reduce((sum, order) => sum + order.totalWeight, 0);
    const estimatedTime = calculateEstimatedDeliveryTime(15.6, false);
    
    suggestions.push({
      title: "Residential Areas",
      orders: residentialOrders.slice(0, 3).map(order => order.id),
      estimatedTime: formatDuration(estimatedTime),
      totalDistance: "15.6 miles",
      efficiency: totalWeight < 20 ? "Low" : "Medium",
      totalWeight,
      orderCount: Math.min(residentialOrders.length, 3)
    });
  }
  
  return suggestions;
};

// ==================== DISPLAY TRANSFORMS ====================

/**
 * Transform order data for grid display
 */
export const transformOrderForGrid = (order: DeliveryOrder) => {
  return {
    ...order,
    formattedValue: formatCurrency(order.value),
    formattedWeight: formatWeight(order.totalWeight),
    formattedTimeWindow: formatTimeWindow(order.timeWindow.start, order.timeWindow.end),
    statusColor: getOrderStatusColor(order.status),
    priorityColor: getOrderPriorityColor(order.priority),
    shortInstructions: order.specialInstructions 
      ? order.specialInstructions.length > 50 
        ? order.specialInstructions.substring(0, 50) + '...' 
        : order.specialInstructions
      : '-'
  };
};

/**
 * Transform driver data for display
 */
export const transformDriverForDisplay = (driver: Driver) => {
  return {
    ...driver,
    statusColor: getDriverStatusColor(driver.status),
    formattedRating: `⭐ ${driver.rating}/5.0`,
    formattedOnTimeRate: `${driver.onTimeRate}%`,
    statusDisplay: driver.status.replace('_', ' ')
  };
};

/**
 * Transform vehicle data for grid display
 */
export const transformVehicleForGrid = (vehicle: Vehicle) => {
  const utilizationRate = calculateUtilizationRate(vehicle.currentLoad, vehicle.capacity);
  
  return {
    ...vehicle,
    formattedCapacity: formatWeight(vehicle.capacity),
    formattedCurrentLoad: formatWeight(vehicle.currentLoad),
    utilizationRate: formatPercentage(utilizationRate),
    utilizationColor: getEfficiencyColor(utilizationRate),
    formattedFuelLevel: `${vehicle.fuelLevel}%`,
    fuelLevelColor: getFuelLevelColor(vehicle.fuelLevel),
    statusColor: getVehicleStatusColor(vehicle.status),
    typeColor: getVehicleTypeColor(vehicle.type),
    formattedLastService: formatDate(vehicle.lastServiceDate),
    refrigerationDisplay: vehicle.hasRefrigeration ? 'Yes' : 'No'
  };
};

/**
 * Transform route data for display
 */
export const transformRouteForDisplay = (route: DeliveryRoute) => {
  const progressPercentage = calculateRouteProgress(route.progress.completed, route.progress.total);
  
  return {
    ...route,
    formattedDistance: formatDistance(route.totalDistance),
    formattedDuration: formatDuration(route.estimatedDuration),
    progressPercentage: formatPercentage(progressPercentage),
    statusColor: getRouteStatusColor(route.status),
    formattedScheduledStart: formatDate(route.scheduledStartTime),
    orderCount: route.orderIds.length
  };
};

/**
 * Get efficiency badge color and text
 */
export const getEfficiencyBadge = (efficiency: string) => {
  const badgeMap = {
    'High': { color: '#52c41a', backgroundColor: '#f6ffed' },
    'Medium': { color: '#1890ff', backgroundColor: '#e6f7ff' },
    'Low': { color: '#fa8c16', backgroundColor: '#fff7e6' }
  };
  return badgeMap[efficiency] || { color: '#666', backgroundColor: '#f5f5f5' };
};