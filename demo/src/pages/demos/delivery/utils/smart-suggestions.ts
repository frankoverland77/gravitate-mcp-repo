/**
 * Smart Suggestions Module for Delivery Management System
 * 
 * This module provides intelligent order batching, AI-style recommendations,
 * and conflict detection capabilities for optimizing delivery operations.
 * 
 * Features:
 * - Advanced order clustering and batching algorithms
 * - Rule-based AI recommendations 
 * - Time window and capacity conflict detection
 * - Multi-objective optimization
 */

import { DeliveryOrder, Vehicle, Driver, DeliveryRoute, TimeWindow } from '../types/delivery.types';
import { calculateDistance, Coordinates } from './route-optimization';

// ==================== TYPES ====================

export interface SmartSuggestion {
  id: string;
  type: 'batch' | 'optimization' | 'reassignment' | 'scheduling';
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  priority: 'critical' | 'high' | 'medium' | 'low';
  orderIds: string[];
  recommendation: string;
  reasoning: string[];
  estimatedSavings: {
    time: number; // minutes
    distance: number; // miles  
    cost: number; // dollars
    efficiency: number; // percentage improvement
  };
  conflicts?: Conflict[];
  applicableRoutes?: string[];
  requiredActions: string[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface BatchSuggestion {
  id: string;
  title: string;
  orderIds: string[];
  clusterId: string;
  center: Coordinates;
  radius: number;
  totalWeight: number;
  totalValue: number;
  estimatedTime: number;
  estimatedDistance: number;
  efficiency: 'high' | 'medium' | 'low';
  compatibility: {
    timeWindowOverlap: boolean;
    capacityFits: boolean;
    priorityCompatible: boolean;
    specialRequirements: boolean;
  };
  confidence: number; // 0-100
  reasoning: string[];
}

export interface Conflict {
  id: string;
  type: 'time_overlap' | 'capacity_exceeded' | 'impossible_schedule' | 'driver_unavailable' | 'vehicle_conflict';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affectedOrderIds: string[];
  affectedRouteIds?: string[];
  affectedDriverIds?: string[];
  affectedVehicleIds?: string[];
  detectedAt: Date;
  resolutionOptions: ResolutionOption[];
  estimatedImpact: {
    timeDelay: number;
    costIncrease: number;
    customerSatisfactionImpact: 'low' | 'medium' | 'high';
  };
}

export interface ResolutionOption {
  id: string;
  title: string;
  description: string;
  type: 'reschedule' | 'reassign' | 'split' | 'cancel' | 'upgrade';
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTime: number; // minutes to implement
  pros: string[];
  cons: string[];
  impact: {
    affectedOrders: number;
    costChange: number;
    timeChange: number;
    satisfactionChange: number;
  };
  autoApplicable: boolean;
}

export interface OrderCluster {
  id: string;
  center: Coordinates;
  orders: DeliveryOrder[];
  radius: number;
  density: number;
  totalWeight: number;
  timeWindowSpread: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  specialRequirements: string[];
}

export interface RecommendationConfig {
  maxBatchSize: number;
  maxTravelRadius: number; // miles
  timeWindowToleranceMinutes: number;
  priorityWeighting: number;
  efficiencyThreshold: number;
  conflictTolerance: 'strict' | 'moderate' | 'lenient';
  enablePatternLearning: boolean;
  historicalWeighting: number;
}

// ==================== CONFIGURATION ====================

const DEFAULT_CONFIG: RecommendationConfig = {
  maxBatchSize: 5,
  maxTravelRadius: 3.0,
  timeWindowToleranceMinutes: 30,
  priorityWeighting: 0.3,
  efficiencyThreshold: 70,
  conflictTolerance: 'moderate',
  enablePatternLearning: true,
  historicalWeighting: 0.2
};

// Mock coordinates for addresses (in real system, would use geocoding service)
const ADDRESS_COORDINATES: { [key: string]: Coordinates } = {
  // Downtown area
  'downtown': { lat: 40.7589, lng: -73.9851 },
  'main street': { lat: 40.7614, lng: -73.9776 },
  'business': { lat: 40.7505, lng: -73.9934 },
  
  // School area
  'school': { lat: 40.7831, lng: -73.9712 },
  'university': { lat: 40.8075, lng: -73.9626 },
  'academy': { lat: 40.7902, lng: -73.9441 },
  
  // Residential areas
  'residential': { lat: 40.7282, lng: -73.7949 },
  'avenue': { lat: 40.7489, lng: -73.9680 },
  'street': { lat: 40.7614, lng: -73.9776 },
  
  // Default fallback
  'default': { lat: 40.7589, lng: -73.9851 }
};

// ==================== CORE ALGORITHMS ====================

/**
 * Generate intelligent batch suggestions using clustering and optimization
 */
export function generateSmartBatches(
  orders: DeliveryOrder[], 
  drivers: Driver[], 
  vehicles: Vehicle[],
  config: RecommendationConfig = DEFAULT_CONFIG
): BatchSuggestion[] {
  const pendingOrders = orders.filter(order => order.status === 'PENDING');
  if (pendingOrders.length < 2) return [];

  // Step 1: Cluster orders by geographic proximity
  const clusters = clusterOrdersByLocation(pendingOrders, config);
  
  // Step 2: Generate batch suggestions from clusters
  const suggestions: BatchSuggestion[] = [];
  
  for (const cluster of clusters) {
    if (cluster.orders.length >= 2) {
      const batch = createBatchFromCluster(cluster, config);
      if (batch && batch.confidence >= 60) {
        suggestions.push(batch);
      }
    }
  }
  
  // Step 3: Sort by confidence and efficiency
  return suggestions.sort((a, b) => {
    const aScore = a.confidence * 0.7 + (a.efficiency === 'high' ? 30 : a.efficiency === 'medium' ? 20 : 10);
    const bScore = b.confidence * 0.7 + (b.efficiency === 'high' ? 30 : b.efficiency === 'medium' ? 20 : 10);
    return bScore - aScore;
  }).slice(0, 5); // Return top 5 suggestions
}

/**
 * Cluster orders by geographic proximity using simplified k-means
 */
function clusterOrdersByLocation(orders: DeliveryOrder[], config: RecommendationConfig): OrderCluster[] {
  const clusters: OrderCluster[] = [];
  const processedOrders = new Set<string>();
  
  for (const order of orders) {
    if (processedOrders.has(order.id)) continue;
    
    const orderCoords = getOrderCoordinates(order);
    const nearbyOrders = findNearbyOrders(order, orders, config.maxTravelRadius);
    
    if (nearbyOrders.length >= 2) {
      const cluster: OrderCluster = {
        id: `cluster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        center: orderCoords,
        orders: nearbyOrders,
        radius: calculateClusterRadius(nearbyOrders),
        density: nearbyOrders.length / Math.PI / Math.pow(config.maxTravelRadius, 2),
        totalWeight: nearbyOrders.reduce((sum, o) => sum + o.totalWeight, 0),
        timeWindowSpread: calculateTimeWindowSpread(nearbyOrders),
        priority: determinePriority(nearbyOrders),
        specialRequirements: extractSpecialRequirements(nearbyOrders)
      };
      
      clusters.push(cluster);
      nearbyOrders.forEach(o => processedOrders.add(o.id));
    }
  }
  
  return clusters;
}

/**
 * Find orders within specified radius of a target order
 */
function findNearbyOrders(targetOrder: DeliveryOrder, allOrders: DeliveryOrder[], radiusMiles: number): DeliveryOrder[] {
  const targetCoords = getOrderCoordinates(targetOrder);
  const nearby = [targetOrder];
  
  for (const order of allOrders) {
    if (order.id === targetOrder.id) continue;
    
    const orderCoords = getOrderCoordinates(order);
    const distance = calculateDistance(targetCoords, orderCoords);
    
    if (distance <= radiusMiles) {
      nearby.push(order);
    }
  }
  
  return nearby;
}

/**
 * Create batch suggestion from order cluster
 */
function createBatchFromCluster(cluster: OrderCluster, config: RecommendationConfig): BatchSuggestion | null {
  const orders = cluster.orders.slice(0, config.maxBatchSize);
  
  // Check compatibility
  const compatibility = {
    timeWindowOverlap: checkTimeWindowCompatibility(orders, config.timeWindowToleranceMinutes),
    capacityFits: checkCapacityCompatibility(orders),
    priorityCompatible: checkPriorityCompatibility(orders),
    specialRequirements: checkSpecialRequirements(orders)
  };
  
  // Calculate metrics
  const totalDistance = estimateBatchDistance(orders);
  const totalTime = estimateBatchTime(orders, totalDistance);
  
  // Calculate confidence score
  let confidence = 60; // Base confidence
  if (compatibility.timeWindowOverlap) confidence += 20;
  if (compatibility.capacityFits) confidence += 10;
  if (compatibility.priorityCompatible) confidence += 5;
  if (compatibility.specialRequirements) confidence += 5;
  if (cluster.density > 0.5) confidence += 10;
  if (orders.length >= 3) confidence += 5;
  
  // Generate reasoning
  const reasoning = generateBatchReasoning(cluster, compatibility, orders);
  
  return {
    id: `batch-${cluster.id}`,
    title: generateBatchTitle(cluster, orders),
    orderIds: orders.map(o => o.id),
    clusterId: cluster.id,
    center: cluster.center,
    radius: cluster.radius,
    totalWeight: cluster.totalWeight,
    totalValue: orders.reduce((sum, o) => sum + o.value, 0),
    estimatedTime: totalTime,
    estimatedDistance: totalDistance,
    efficiency: confidence >= 80 ? 'high' : confidence >= 65 ? 'medium' : 'low',
    compatibility,
    confidence: Math.min(confidence, 100),
    reasoning
  };
}

/**
 * Generate AI-style smart recommendations
 */
export function generateSmartRecommendations(
  orders: DeliveryOrder[],
  routes: DeliveryRoute[],
  drivers: Driver[],
  vehicles: Vehicle[],
  config: RecommendationConfig = DEFAULT_CONFIG
): SmartSuggestion[] {
  const recommendations: SmartSuggestion[] = [];
  
  // Pattern-based recommendations
  recommendations.push(...generatePatternBasedRecommendations(orders, routes, drivers, vehicles));
  
  // Resource optimization recommendations
  recommendations.push(...generateResourceOptimizationRecommendations(orders, routes, drivers, vehicles));
  
  // Efficiency improvement recommendations
  recommendations.push(...generateEfficiencyRecommendations(orders, routes, drivers, vehicles));
  
  // Time-sensitive recommendations
  recommendations.push(...generateTimeSensitiveRecommendations(orders, routes, drivers, vehicles));
  
  return recommendations.sort((a, b) => {
    const aPriority = getPriorityScore(a.priority);
    const bPriority = getPriorityScore(b.priority);
    const aConfidence = getConfidenceScore(a.confidence);
    const bConfidence = getConfidenceScore(b.confidence);
    
    return (bPriority * 0.6 + bConfidence * 0.4) - (aPriority * 0.6 + aConfidence * 0.4);
  }).slice(0, 10);
}

/**
 * Detect conflicts in delivery scheduling and routing
 */
export function detectConflicts(
  orders: DeliveryOrder[],
  routes: DeliveryRoute[],
  drivers: Driver[],
  vehicles: Vehicle[]
): Conflict[] {
  const conflicts: Conflict[] = [];
  
  // Time window conflicts
  conflicts.push(...detectTimeWindowConflicts(orders, routes));
  
  // Capacity conflicts
  conflicts.push(...detectCapacityConflicts(orders, routes, vehicles));
  
  // Driver availability conflicts
  conflicts.push(...detectDriverConflicts(routes, drivers));
  
  // Vehicle conflicts
  conflicts.push(...detectVehicleConflicts(routes, vehicles));
  
  // Schedule impossibility conflicts
  conflicts.push(...detectScheduleConflicts(orders, routes));
  
  return conflicts.sort((a, b) => {
    const severityOrder = { 'critical': 3, 'warning': 2, 'info': 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

// ==================== CONFLICT DETECTION ====================

/**
 * Detect overlapping time windows that create impossible schedules
 */
function detectTimeWindowConflicts(orders: DeliveryOrder[], routes: DeliveryRoute[]): Conflict[] {
  const conflicts: Conflict[] = [];
  
  for (const route of routes) {
    const routeOrders = orders.filter(o => route.orderIds.includes(o.id));
    if (routeOrders.length < 2) continue;
    
    // Sort orders by time window start
    const sortedOrders = routeOrders.sort((a, b) => 
      timeToMinutes(a.timeWindow.start) - timeToMinutes(b.timeWindow.start)
    );
    
    for (let i = 0; i < sortedOrders.length - 1; i++) {
      const current = sortedOrders[i];
      const next = sortedOrders[i + 1];
      
      const currentEnd = timeToMinutes(current.timeWindow.end);
      const nextStart = timeToMinutes(next.timeWindow.start);
      
      // Calculate minimum travel time between orders
      const distance = calculateDistance(
        getOrderCoordinates(current),
        getOrderCoordinates(next)
      );
      const minTravelTime = Math.ceil(distance * 2.5); // ~2.5 minutes per mile in city
      const serviceTime = 8; // 8 minutes service time per order
      
      if (currentEnd + minTravelTime + serviceTime > nextStart) {
        conflicts.push({
          id: `time-conflict-${route.id}-${current.id}-${next.id}`,
          type: 'time_overlap',
          severity: 'critical',
          title: 'Impossible Time Window Sequence',
          description: `Orders ${current.id} and ${next.id} have overlapping time windows that cannot be satisfied`,
          affectedOrderIds: [current.id, next.id],
          affectedRouteIds: [route.id],
          detectedAt: new Date(),
          resolutionOptions: generateTimeConflictResolutions(current, next, route),
          estimatedImpact: {
            timeDelay: minTravelTime + serviceTime - (nextStart - currentEnd),
            costIncrease: 25,
            customerSatisfactionImpact: 'high'
          }
        });
      }
    }
  }
  
  return conflicts;
}

/**
 * Detect capacity violations in routes
 */
function detectCapacityConflicts(orders: DeliveryOrder[], routes: DeliveryRoute[], vehicles: Vehicle[]): Conflict[] {
  const conflicts: Conflict[] = [];
  
  for (const route of routes) {
    if (!route.vehicleId) continue;
    
    const vehicle = vehicles.find(v => v.id === route.vehicleId);
    if (!vehicle) continue;
    
    const routeOrders = orders.filter(o => route.orderIds.includes(o.id));
    const totalWeight = routeOrders.reduce((sum, o) => sum + o.totalWeight, 0);
    
    if (totalWeight > vehicle.capacity) {
      const overweight = totalWeight - vehicle.capacity;
      
      conflicts.push({
        id: `capacity-conflict-${route.id}`,
        type: 'capacity_exceeded',
        severity: overweight > vehicle.capacity * 0.2 ? 'critical' : 'warning',
        title: 'Vehicle Capacity Exceeded',
        description: `Route ${route.id} exceeds vehicle capacity by ${overweight.toFixed(1)} lbs`,
        affectedOrderIds: route.orderIds,
        affectedRouteIds: [route.id],
        affectedVehicleIds: [vehicle.id],
        detectedAt: new Date(),
        resolutionOptions: generateCapacityConflictResolutions(route, routeOrders, vehicle, overweight),
        estimatedImpact: {
          timeDelay: 0,
          costIncrease: overweight * 0.5, // $0.50 per excess lb
          customerSatisfactionImpact: 'medium'
        }
      });
    }
  }
  
  return conflicts;
}

// ==================== HELPER FUNCTIONS ====================

function getOrderCoordinates(order: DeliveryOrder): Coordinates {
  const address = order.deliveryAddress.toLowerCase();
  
  // Simple pattern matching for demonstration
  for (const [keyword, coords] of Object.entries(ADDRESS_COORDINATES)) {
    if (address.includes(keyword)) {
      return coords;
    }
  }
  
  return ADDRESS_COORDINATES.default;
}

function calculateClusterRadius(orders: DeliveryOrder[]): number {
  if (orders.length <= 1) return 0;
  
  const center = calculateCenterPoint(orders);
  const distances = orders.map(order => 
    calculateDistance(center, getOrderCoordinates(order))
  );
  
  return Math.max(...distances);
}

function calculateCenterPoint(orders: DeliveryOrder[]): Coordinates {
  const coords = orders.map(getOrderCoordinates);
  const lat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
  const lng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;
  
  return { lat, lng };
}

function calculateTimeWindowSpread(orders: DeliveryOrder[]): number {
  const startTimes = orders.map(o => timeToMinutes(o.timeWindow.start));
  const endTimes = orders.map(o => timeToMinutes(o.timeWindow.end));
  
  return Math.max(...endTimes) - Math.min(...startTimes);
}

function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function determinePriority(orders: DeliveryOrder[]): 'HIGH' | 'MEDIUM' | 'LOW' {
  const highPriorityCount = orders.filter(o => o.priority === 'HIGH').length;
  const ratio = highPriorityCount / orders.length;
  
  if (ratio >= 0.5) return 'HIGH';
  if (ratio >= 0.25) return 'MEDIUM';
  return 'LOW';
}

function extractSpecialRequirements(orders: DeliveryOrder[]): string[] {
  const requirements = new Set<string>();
  
  orders.forEach(order => {
    order.products.forEach(product => {
      if (product.specialHandling) {
        product.specialHandling.forEach(req => requirements.add(req));
      }
    });
    
    if (order.specialInstructions) {
      if (order.specialInstructions.toLowerCase().includes('refrigerat')) {
        requirements.add('refrigeration');
      }
      if (order.specialInstructions.toLowerCase().includes('fragile')) {
        requirements.add('fragile');
      }
    }
  });
  
  return Array.from(requirements);
}

function checkTimeWindowCompatibility(orders: DeliveryOrder[], toleranceMinutes: number): boolean {
  if (orders.length <= 1) return true;
  
  for (let i = 0; i < orders.length - 1; i++) {
    for (let j = i + 1; j < orders.length; j++) {
      const order1 = orders[i];
      const order2 = orders[j];
      
      const start1 = timeToMinutes(order1.timeWindow.start);
      const end1 = timeToMinutes(order1.timeWindow.end);
      const start2 = timeToMinutes(order2.timeWindow.start);
      const end2 = timeToMinutes(order2.timeWindow.end);
      
      // Check if time windows can overlap with tolerance
      const overlap = Math.max(0, Math.min(end1, end2) - Math.max(start1, start2));
      if (overlap > toleranceMinutes) {
        return false;
      }
    }
  }
  
  return true;
}

function checkCapacityCompatibility(orders: DeliveryOrder[]): boolean {
  const totalWeight = orders.reduce((sum, o) => sum + o.totalWeight, 0);
  return totalWeight <= 80; // Assuming max 80 lbs per batch
}

function checkPriorityCompatibility(orders: DeliveryOrder[]): boolean {
  const priorities = orders.map(o => o.priority);
  const uniquePriorities = new Set(priorities);
  
  // High priority orders should not be mixed with low priority
  if (uniquePriorities.has('HIGH') && uniquePriorities.has('LOW')) {
    return false;
  }
  
  return true;
}

function checkSpecialRequirements(orders: DeliveryOrder[]): boolean {
  const allRequirements = extractSpecialRequirements(orders);
  
  // Check for conflicting requirements
  if (allRequirements.includes('refrigeration') && allRequirements.includes('heated')) {
    return false;
  }
  
  return true;
}

function estimateBatchDistance(orders: DeliveryOrder[]): number {
  if (orders.length <= 1) return 0;
  
  let totalDistance = 0;
  const coords = orders.map(getOrderCoordinates);
  
  // Simple nearest neighbor approximation
  for (let i = 0; i < coords.length - 1; i++) {
    totalDistance += calculateDistance(coords[i], coords[i + 1]);
  }
  
  return totalDistance;
}

function estimateBatchTime(orders: DeliveryOrder[], distance: number): number {
  const drivingTime = distance * 2.5; // 2.5 minutes per mile
  const serviceTime = orders.length * 8; // 8 minutes per stop
  const bufferTime = orders.length * 2; // 2 minutes buffer per stop
  
  return Math.ceil(drivingTime + serviceTime + bufferTime);
}

function generateBatchReasoning(cluster: OrderCluster, compatibility: any, orders: DeliveryOrder[]): string[] {
  const reasons: string[] = [];
  
  reasons.push(`${orders.length} orders clustered within ${cluster.radius.toFixed(1)} miles`);
  
  if (compatibility.timeWindowOverlap) {
    reasons.push('Compatible delivery time windows');
  }
  
  if (compatibility.capacityFits) {
    reasons.push('Total weight fits in standard delivery vehicle');
  }
  
  if (cluster.priority === 'HIGH') {
    reasons.push('High priority orders grouped together');
  }
  
  if (cluster.density > 0.5) {
    reasons.push('High order density in geographic area');
  }
  
  if (cluster.specialRequirements.length > 0) {
    reasons.push(`Special requirements: ${cluster.specialRequirements.join(', ')}`);
  }
  
  return reasons;
}

function generateBatchTitle(cluster: OrderCluster, orders: DeliveryOrder[]): string {
  const area = determineAreaName(cluster.center);
  const orderCount = orders.length;
  const priority = cluster.priority.toLowerCase();
  
  if (cluster.specialRequirements.includes('refrigeration')) {
    return `${area} Refrigerated Route (${orderCount} orders)`;
  }
  
  if (priority === 'high') {
    return `Priority ${area} Run (${orderCount} orders)`;
  }
  
  return `${area} Delivery Route (${orderCount} orders)`;
}

function determineAreaName(coords: Coordinates): string {
  // Simple area determination based on coordinates
  if (Math.abs(coords.lat - ADDRESS_COORDINATES.downtown.lat) < 0.01) {
    return 'Downtown';
  }
  if (Math.abs(coords.lat - ADDRESS_COORDINATES.school.lat) < 0.01) {
    return 'School District';
  }
  if (Math.abs(coords.lat - ADDRESS_COORDINATES.residential.lat) < 0.01) {
    return 'Residential';
  }
  return 'Mixed Area';
}

// Additional helper functions for recommendations and conflict resolution
function generatePatternBasedRecommendations(orders: DeliveryOrder[], routes: DeliveryRoute[], drivers: Driver[], vehicles: Vehicle[]): SmartSuggestion[] {
  return []; // Placeholder - would implement pattern recognition
}

function generateResourceOptimizationRecommendations(orders: DeliveryOrder[], routes: DeliveryRoute[], drivers: Driver[], vehicles: Vehicle[]): SmartSuggestion[] {
  return []; // Placeholder - would implement resource optimization
}

function generateEfficiencyRecommendations(orders: DeliveryOrder[], routes: DeliveryRoute[], drivers: Driver[], vehicles: Vehicle[]): SmartSuggestion[] {
  return []; // Placeholder - would implement efficiency recommendations
}

function generateTimeSensitiveRecommendations(orders: DeliveryOrder[], routes: DeliveryRoute[], drivers: Driver[], vehicles: Vehicle[]): SmartSuggestion[] {
  return []; // Placeholder - would implement time-sensitive recommendations
}

function detectDriverConflicts(routes: DeliveryRoute[], drivers: Driver[]): Conflict[] {
  return []; // Placeholder - would implement driver conflict detection
}

function detectVehicleConflicts(routes: DeliveryRoute[], vehicles: Vehicle[]): Conflict[] {
  return []; // Placeholder - would implement vehicle conflict detection
}

function detectScheduleConflicts(orders: DeliveryOrder[], routes: DeliveryRoute[]): Conflict[] {
  return []; // Placeholder - would implement schedule conflict detection
}

function generateTimeConflictResolutions(order1: DeliveryOrder, order2: DeliveryOrder, route: DeliveryRoute): ResolutionOption[] {
  return []; // Placeholder - would implement resolution options
}

function generateCapacityConflictResolutions(route: DeliveryRoute, orders: DeliveryOrder[], vehicle: Vehicle, overweight: number): ResolutionOption[] {
  return []; // Placeholder - would implement capacity resolution options
}

function getPriorityScore(priority: string): number {
  const scores = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
  return scores[priority as keyof typeof scores] || 1;
}

function getConfidenceScore(confidence: string): number {
  const scores = { 'high': 3, 'medium': 2, 'low': 1 };
  return scores[confidence as keyof typeof scores] || 1;
}