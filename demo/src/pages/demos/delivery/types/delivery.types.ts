/**
 * TypeScript interfaces for the Bakery Delivery Management System
 * 
 * This file contains all type definitions for the delivery system components,
 * providing type safety and clear data contracts for the entire application.
 */

// ==================== CORE DELIVERY ENTITIES ====================

/**
 * Represents a delivery order in the system
 */
export interface DeliveryOrder {
  id: string;
  customerId: string;
  customerName: string;
  deliveryAddress: string;
  phone: string;
  products: OrderProduct[];
  totalWeight: number;
  value: number;
  timeWindow: TimeWindow;
  priority: OrderPriority;
  specialInstructions?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  assignedDriverId?: string;
  assignedRouteId?: string;
  deliveredAt?: string;
  customerSignature?: string;
}

/**
 * Product item within an order
 */
export interface OrderProduct {
  name: string;
  quantity: number;
  weight: number;
  unitPrice?: number;
  specialHandling?: string[];
}

/**
 * Time window for delivery
 */
export interface TimeWindow {
  start: string;
  end: string;
  flexible?: boolean;
}

/**
 * Driver information and current status
 */
export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleId: string;
  status: DriverStatus;
  currentLocation?: GeoLocation;
  rating: number;
  totalDeliveries: number;
  onTimeRate: number;
  efficiency?: number;
  shiftId?: string;
  breakStartTime?: string;
  hireDate?: string;
  licenseNumber?: string;
  emergencyContact?: ContactInfo;
}

/**
 * Vehicle information and specifications
 */
export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  capacity: number; // in lbs
  currentLoad: number;
  fuelLevel: number; // percentage
  hasRefrigeration: boolean;
  status: VehicleStatus;
  lastServiceDate: string;
  nextServiceDue?: string;
  licensePlate?: string;
  model?: string;
  year?: number;
  mileage?: number;
}

/**
 * Delivery route with stops and progress tracking
 */
export interface DeliveryRoute {
  id: string;
  name: string;
  status: RouteStatus;
  driverId?: string;
  vehicleId?: string;
  orderIds: string[];
  stops: RouteStop[];
  scheduledStartTime: string;
  estimatedDuration: number; // in minutes
  actualStartTime?: string;
  actualEndTime?: string;
  totalDistance: number; // in miles
  progress: RouteProgress;
  createdAt: string;
  priority: RoutePriority;
  optimized?: boolean;
  notes?: string;
}

/**
 * Individual stop within a route
 */
export interface RouteStop {
  id: string;
  routeId: string;
  orderId: string;
  sequence: number;
  address: string;
  location: GeoLocation;
  estimatedArrival: string;
  actualArrival?: string;
  estimatedDeparture: string;
  actualDeparture?: string;
  status: StopStatus;
  deliveryProof?: DeliveryProof;
  notes?: string;
}

/**
 * Metrics and KPIs for the delivery system
 */
export interface DeliveryMetrics {
  period: MetricsPeriod;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  onTimeDeliveries: number;
  onTimeRate: number;
  averageDeliveryTime: number; // in minutes
  totalRevenue: number;
  averageOrderValue: number;
  customerSatisfactionRating: number;
  fuelCost: number;
  maintenanceCost: number;
  laborCost: number;
  costPerDelivery: number;
  driversActive: number;
  vehiclesInUse: number;
  routesCompleted: number;
  milesDelivered: number;
  fuelEfficiency: number; // miles per gallon
}

// ==================== SUPPORTING TYPES ====================

/**
 * Geographic location coordinates
 */
export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: string;
}

/**
 * Contact information
 */
export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
  relationship?: string;
}

/**
 * Proof of delivery documentation
 */
export interface DeliveryProof {
  signatureUrl?: string;
  photoUrl?: string;
  recipientName?: string;
  deliveredAt: string;
  notes?: string;
}

/**
 * Route progress tracking
 */
export interface RouteProgress {
  completed: number;
  total: number;
  estimatedTimeRemaining?: number;
  distanceRemaining?: number;
}

/**
 * Shift schedule information
 */
export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  driverIds: string[];
  maxDrivers?: number;
  shiftLead?: string;
  notes?: string;
}

/**
 * Communication log entry
 */
export interface CommunicationEntry {
  id: string;
  orderId: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  timestamp: string;
  message: string;
  status: CommunicationStatus;
  sender?: string;
  recipient?: string;
  metadata?: Record<string, any>;
}

/**
 * Analytics KPI data
 */
export interface AnalyticsKPI {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
  period?: string;
  target?: number;
}

/**
 * Chart data for analytics
 */
export interface ChartData {
  label: string;
  value: number;
  target?: number;
  color?: string;
  metadata?: Record<string, any>;
}

/**
 * Cost breakdown data
 */
export interface CostData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  trend?: number;
}

/**
 * Driver performance metrics
 */
export interface DriverPerformance {
  rank: number;
  driverId: string;
  name: string;
  deliveries: number;
  onTimeRate: number;
  rating: number;
  revenue: number;
  efficiency: number;
  totalHours?: number;
  averageDeliveryTime?: number;
}

/**
 * Real-time tracking data
 */
export interface LiveTrackingData {
  routeId: string;
  driverId: string;
  vehicleId: string;
  currentLocation: GeoLocation;
  nextStopId: string;
  estimatedArrival: string;
  speed?: number;
  heading?: number;
  lastUpdate: string;
}

/**
 * Route optimization parameters
 */
export interface RouteOptimizationConfig {
  maxStopsPerRoute: number;
  maxRouteDistance: number;
  maxRouteDuration: number;
  prioritizeTimeWindows: boolean;
  considerTraffic: boolean;
  vehicleConstraints: boolean;
  allowPartialLoads: boolean;
}

// ==================== ENUMS AND UNION TYPES ====================

export type OrderStatus = 
  | 'PENDING' 
  | 'ASSIGNED' 
  | 'IN_TRANSIT' 
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED' 
  | 'FAILED'
  | 'CANCELLED'
  | 'RETURNED';

export type OrderPriority = 
  | 'LOW' 
  | 'MEDIUM' 
  | 'HIGH' 
  | 'URGENT'
  | 'CRITICAL';

export type DriverStatus = 
  | 'AVAILABLE' 
  | 'ON_ROUTE' 
  | 'AT_STOP'
  | 'BREAK' 
  | 'OFFLINE'
  | 'SICK'
  | 'VACATION';

export type VehicleType = 
  | 'VAN' 
  | 'TRUCK' 
  | 'CAR'
  | 'MOTORCYCLE'
  | 'BICYCLE';

export type VehicleStatus = 
  | 'AVAILABLE' 
  | 'IN_USE' 
  | 'MAINTENANCE'
  | 'OUT_OF_SERVICE'
  | 'REFUELING';

export type RouteStatus = 
  | 'DRAFT'
  | 'SCHEDULED' 
  | 'ACTIVE' 
  | 'PAUSED'
  | 'COMPLETED' 
  | 'CANCELLED'
  | 'FAILED';

export type RoutePriority = 
  | 'LOW' 
  | 'MEDIUM' 
  | 'HIGH'
  | 'URGENT';

export type StopStatus = 
  | 'PENDING'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'FAILED'
  | 'SKIPPED';

export type CommunicationType = 
  | 'SMS' 
  | 'CALL' 
  | 'EMAIL' 
  | 'PUSH_NOTIFICATION'
  | 'SYSTEM' 
  | 'DRIVER_UPDATE'
  | 'CUSTOMER_FEEDBACK';

export type CommunicationDirection = 
  | 'OUTBOUND' 
  | 'INBOUND' 
  | 'INTERNAL'
  | 'BROADCAST';

export type CommunicationStatus = 
  | 'DRAFT'
  | 'SENT' 
  | 'DELIVERED' 
  | 'READ' 
  | 'FAILED'
  | 'EXPIRED';

export type MetricsPeriod = 
  | 'HOURLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'YEARLY';

// ==================== API RESPONSE TYPES ====================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: PaginationInfo;
  metadata?: Record<string, any>;
}

/**
 * API error information
 */
export interface ApiError {
  code: string;
  message: string;
  details?: string;
  field?: string;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Filter and sorting options
 */
export interface QueryOptions {
  filters?: Record<string, any>;
  sort?: SortOption[];
  search?: string;
  include?: string[];
  pagination?: {
    page: number;
    limit: number;
  };
}

/**
 * Sorting configuration
 */
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// ==================== FORM AND UI TYPES ====================

/**
 * Form state for order creation/editing
 */
export interface OrderFormData {
  customerName: string;
  deliveryAddress: string;
  phone: string;
  products: OrderProduct[];
  timeWindow: TimeWindow;
  priority: OrderPriority;
  specialInstructions?: string;
  estimatedValue?: number;
}

/**
 * Form state for route creation
 */
export interface RouteFormData {
  name: string;
  driverId?: string;
  vehicleId?: string;
  orderIds: string[];
  scheduledStartTime: string;
  priority: RoutePriority;
  notes?: string;
}

/**
 * Filter options for delivery management
 */
export interface DeliveryFilters {
  status?: OrderStatus[];
  priority?: OrderPriority[];
  dateRange?: {
    start: string;
    end: string;
  };
  driverId?: string;
  vehicleId?: string;
  customerId?: string;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  widgets: DashboardWidget[];
  refreshInterval: number;
  dateRange: {
    start: string;
    end: string;
  };
  filters?: DeliveryFilters;
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'map';
  title: string;
  size: 'small' | 'medium' | 'large';
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ==================== EXPORT DEFAULTS ====================

/**
 * Default values for common entities
 */
export const DEFAULT_TIME_WINDOW: TimeWindow = {
  start: '09:00',
  end: '17:00',
  flexible: true
};

export const DEFAULT_ROUTE_OPTIMIZATION: RouteOptimizationConfig = {
  maxStopsPerRoute: 8,
  maxRouteDistance: 50,
  maxRouteDuration: 480, // 8 hours
  prioritizeTimeWindows: true,
  considerTraffic: true,
  vehicleConstraints: true,
  allowPartialLoads: false
};

export const DEFAULT_QUERY_OPTIONS: QueryOptions = {
  pagination: {
    page: 1,
    limit: 25
  },
  sort: [
    { field: 'createdAt', direction: 'desc' }
  ]
};

// ==================== SMART SUGGESTIONS ====================

/**
 * Smart suggestion for improving delivery operations
 */
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
  conflicts?: ConflictAlert[];
  applicableRoutes?: string[];
  requiredActions: string[];
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Batch suggestion for grouping orders efficiently
 */
export interface BatchSuggestion {
  id: string;
  title: string;
  orderIds: string[];
  clusterId: string;
  center: {lat: number; lng: number};
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

/**
 * Conflict alert for delivery scheduling issues
 */
export interface ConflictAlert {
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

/**
 * Resolution option for conflicts
 */
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

/**
 * Smart suggestion configuration
 */
export interface SmartSuggestionConfig {
  maxBatchSize: number;
  maxTravelRadius: number; // miles
  timeWindowToleranceMinutes: number;
  priorityWeighting: number;
  efficiencyThreshold: number;
  conflictTolerance: 'strict' | 'moderate' | 'lenient';
  enablePatternLearning: boolean;
  historicalWeighting: number;
  autoApplyLowRiskSuggestions: boolean;
}

/**
 * Smart suggestions state
 */
export interface SmartSuggestionsState {
  suggestions: SmartSuggestion[];
  batchSuggestions: BatchSuggestion[];
  conflicts: ConflictAlert[];
  config: SmartSuggestionConfig;
  lastUpdated: Date | null;
  isGenerating: boolean;
  enableAutoSuggestions: boolean;
  suggestionHistory: SmartSuggestion[];
  appliedSuggestions: string[]; // suggestion IDs
}

// Default smart suggestions configuration
export const DEFAULT_SMART_SUGGESTION_CONFIG: SmartSuggestionConfig = {
  maxBatchSize: 5,
  maxTravelRadius: 3.0,
  timeWindowToleranceMinutes: 30,
  priorityWeighting: 0.3,
  efficiencyThreshold: 70,
  conflictTolerance: 'moderate',
  enablePatternLearning: true,
  historicalWeighting: 0.2,
  autoApplyLowRiskSuggestions: false
};