import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  DeliveryFilters
} from '../types/delivery.types';
import {
  mockOrders,
  mockDrivers,
  mockVehicles,
  mockRoutes,
  mockShifts,
  mockCommunications
} from '../data/delivery.mock-data';
import {
  PerformanceMetrics,
  DriverEfficiencyMetrics,
  OnTimeAnalytics,
  CostAnalytics,
  KPIAlert,
  KPIThresholds,
  calculateRealTimeKPIs,
  generateKPIAlerts,
  rankDriversByEfficiency,
  calculateOnTimeDeliveryRate,
  calculateCostPerDelivery,
  getPerformanceTrends
} from '../utils/performance-metrics';
import {
  SmartSuggestion,
  BatchSuggestion,
  ConflictAlert,
  SmartSuggestionsState,
  SmartSuggestionConfig,
  DEFAULT_SMART_SUGGESTION_CONFIG
} from '../types/delivery.types';
import {
  generateSmartBatches,
  generateSmartRecommendations,
  detectConflicts
} from '../utils/smart-suggestions';

// ==================== DELIVERY MANAGEMENT STATE ====================

export type DeliveryView = 'order-queue' | 'driver-management' | 'route-planning' | 'real-time-tracking' | 'analytics' | 'settings';

export type RouteViewState = 'grid' | 'create';

export interface SelectedOrdersState {
  orderIds: string[];
  batchId?: string;
  routeId?: string;
}

export interface SearchState {
  orders: string;
  drivers: string;
  vehicles: string;
  routes: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SortState {
  orders: SortConfig | null;
  drivers: SortConfig | null;
  vehicles: SortConfig | null;
  routes: SortConfig | null;
}

export interface DateRangeState {
  analytics: {
    start: string;
    end: string;
  };
  orders: {
    start: string;
    end: string;
  };
  routes: {
    start: string;
    end: string;
  };
}

export interface DragDropState {
  draggedOrderId: string | null;
  draggedFromRoute: string | null;
  dragOverTarget: string | null;
  isDragging: boolean;
  dragStartTime: number;
}

export interface RouteBuilderState {
  routeId: string | null;
  orderIds: string[];
  isModified: boolean;
}

// Real-time simulation interfaces
export interface SimulationAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  routeId?: string;
  orderId?: string;
  driverId?: string;
  autoClose?: boolean;
  duration?: number;
}

export interface SimulationEvent {
  id: string;
  type: 'route_progress' | 'delivery_completed' | 'delay_detected' | 'driver_status_change' | 'vehicle_issue';
  timestamp: Date;
  routeId?: string;
  orderId?: string;
  driverId?: string;
  vehicleId?: string;
  data: any;
}

export interface SimulationState {
  isRunning: boolean;
  speed: number; // 1x, 2x, 5x, 10x
  startTime: Date | null;
  alerts: SimulationAlert[];
  events: SimulationEvent[];
  lastUpdateTime: Date | null;
  progressAnimations: {
    [routeId: string]: {
      currentProgress: number;
      targetProgress: number;
      animationId?: number;
    };
  };
}

export interface PerformanceState {
  currentMetrics: PerformanceMetrics | null;
  historicalMetrics: PerformanceMetrics[];
  driverEfficiencyMetrics: DriverEfficiencyMetrics[];
  onTimeAnalytics: OnTimeAnalytics | null;
  costAnalytics: CostAnalytics | null;
  kpiAlerts: KPIAlert[];
  kpiThresholds: KPIThresholds;
  lastCalculated: Date | null;
  autoUpdateEnabled: boolean;
  updateInterval: number; // seconds
}

export interface ActiveFilters {
  orders: {
    status?: OrderStatus[];
    priority?: OrderPriority[];
    dateRange?: {
      start: string;
      end: string;
    };
    customerId?: string;
    assignedDriverId?: string;
  };
  drivers: {
    status?: DriverStatus[];
    shiftId?: string;
    vehicleId?: string;
  };
  vehicles: {
    status?: VehicleStatus[];
    type?: string[];
    hasRefrigeration?: boolean;
  };
  routes: {
    status?: RouteStatus[];
    driverId?: string;
    vehicleId?: string;
    priority?: string[];
  };
}

export interface UIPreferences {
  theme: 'light' | 'dark';
  gridDensity: 'compact' | 'comfortable' | 'spacious';
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  notifications: {
    orderUpdates: boolean;
    driverAlerts: boolean;
    routeCompletions: boolean;
    systemMessages: boolean;
  };
  modals: {
    routeCreation: boolean;
    orderDetails: boolean;
    driverAssignment: boolean;
    vehicleManagement: boolean;
  };
  dashboard: {
    showKPIs: boolean;
    showCharts: boolean;
    showDriverLeaderboard: boolean;
    defaultTimeRange: 'today' | 'week' | 'month' | 'quarter';
  };
}

export interface DeliveryContextType {
  // Core Data State
  orders: DeliveryOrder[];
  drivers: Driver[];
  vehicles: Vehicle[];
  routes: DeliveryRoute[];
  
  // UI State
  currentView: DeliveryView;
  routeViewState: RouteViewState;
  selectedOrders: SelectedOrdersState;
  activeFilters: ActiveFilters;
  uiPreferences: UIPreferences;
  searchState: SearchState;
  sortState: SortState;
  dateRangeState: DateRangeState;
  dragDropState: DragDropState;
  routeBuilderState: RouteBuilderState;
  simulationState: SimulationState;
  performanceState: PerformanceState;
  smartSuggestionsState: SmartSuggestionsState;
  
  // Loading States
  isLoading: boolean;
  isUpdating: boolean;
  
  // View Management
  setCurrentView: (view: DeliveryView) => void;
  setRouteViewState: (state: RouteViewState) => void;
  
  // Order Management
  selectOrders: (orderIds: string[], batchId?: string) => void;
  clearSelectedOrders: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignOrdersToRoute: (orderIds: string[], routeId: string) => void;
  
  // Route Management
  createRoute: (routeData: Partial<DeliveryRoute>) => Promise<string>;
  updateRoute: (routeId: string, updates: Partial<DeliveryRoute>) => void;
  deleteRoute: (routeId: string) => void;
  optimizeRoute: (routeId: string) => Promise<void>;
  
  // Driver Management
  updateDriverStatus: (driverId: string, status: DriverStatus) => void;
  assignDriverToRoute: (driverId: string, routeId: string) => void;
  unassignDriverFromRoute: (driverId: string) => void;
  
  // Vehicle Management
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  assignVehicleToRoute: (vehicleId: string, routeId: string) => void;
  unassignVehicleFromRoute: (vehicleId: string) => void;
  
  // Filter Management
  setOrderFilters: (filters: Partial<ActiveFilters['orders']>) => void;
  setDriverFilters: (filters: Partial<ActiveFilters['drivers']>) => void;
  setVehicleFilters: (filters: Partial<ActiveFilters['vehicles']>) => void;
  setRouteFilters: (filters: Partial<ActiveFilters['routes']>) => void;
  clearAllFilters: () => void;
  
  // Search Management
  setSearchQuery: (table: keyof SearchState, query: string) => void;
  clearAllSearches: () => void;
  
  // Sort Management
  setSortConfig: (table: keyof SortState, config: SortConfig | null) => void;
  clearAllSorts: () => void;
  
  // Date Range Management
  setDateRange: (view: keyof DateRangeState, range: { start: string; end: string }) => void;
  clearDateRanges: () => void;
  
  // Drag & Drop Management
  startDrag: (orderId: string, fromRouteId?: string) => void;
  endDrag: () => void;
  setDragOverTarget: (targetId: string | null) => void;
  reorderOrdersInRoute: (routeId: string, fromIndex: number, toIndex: number) => void;
  moveOrderToRoute: (orderId: string, fromRouteId: string | null, toRouteId: string, position?: number) => void;
  addOrderToRoute: (orderId: string, routeId: string, position?: number) => void;
  removeOrderFromRoute: (orderId: string, routeId: string) => void;
  
  // Route Builder Management
  initializeRouteBuilder: (routeId?: string) => void;
  addOrderToBuilder: (orderId: string, position?: number) => void;
  removeOrderFromBuilder: (orderId: string) => void;
  reorderOrdersInBuilder: (fromIndex: number, toIndex: number) => void;
  clearRouteBuilder: () => void;
  saveRouteFromBuilder: () => Promise<string | null>;
  
  // Preferences Management
  updateUIPreferences: (preferences: Partial<UIPreferences>) => void;
  resetUIPreferences: () => void;
  
  // Modal Management
  openModal: (modalType: keyof UIPreferences['modals']) => void;
  closeModal: (modalType: keyof UIPreferences['modals']) => void;
  closeAllModals: () => void;
  
  // Computed Values
  getFilteredOrders: () => DeliveryOrder[];
  getFilteredDrivers: () => Driver[];
  getFilteredVehicles: () => Vehicle[];
  getFilteredRoutes: () => DeliveryRoute[];
  getAvailableDrivers: () => Driver[];
  getAvailableVehicles: () => Vehicle[];
  getUnassignedOrders: () => DeliveryOrder[];
  
  // Batch Operations
  createBatchFromSelectedOrders: () => string;
  applyBatchSuggestion: (suggestion: any) => void;
  
  // Real-time Simulation Management
  startSimulation: (speed?: number) => void;
  stopSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  addAlert: (alert: Omit<SimulationAlert, 'id' | 'timestamp'>) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  generateRandomEvent: () => void;
  updateRouteProgress: (routeId: string, progress: number) => void;
  animateProgressTo: (routeId: string, targetProgress: number, duration?: number) => void;
  
  // Performance Metrics Management
  updatePerformanceMetrics: () => Promise<void>;
  trackDeliveryCompletion: (orderId: string, routeId: string, completedAt: Date) => void;
  updateKPIThresholds: (thresholds: Partial<KPIThresholds>) => void;
  toggleAutoPerformanceUpdates: (enabled: boolean) => void;
  setPerformanceUpdateInterval: (seconds: number) => void;
  refreshPerformanceData: () => Promise<void>;
  getDriverRankings: () => DriverEfficiencyMetrics[];
  generatePerformanceReport: (startDate: Date, endDate: Date) => Promise<PerformanceMetrics>;
  
  // Smart Suggestions Management
  generateSmartSuggestions: () => Promise<void>;
  applySmartSuggestion: (suggestionId: string) => Promise<void>;
  dismissSuggestion: (suggestionId: string) => void;
  updateSuggestionConfig: (config: Partial<SmartSuggestionConfig>) => void;
  detectAndResolveConflicts: () => Promise<void>;
  resolveConflict: (conflictId: string, resolutionId: string) => Promise<void>;
  dismissConflict: (conflictId: string) => void;
  getSmartBatches: () => BatchSuggestion[];
  toggleAutoSuggestions: (enabled: boolean) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}

interface DeliveryProviderProps {
  children: ReactNode;
}

const DEFAULT_UI_PREFERENCES: UIPreferences = {
  theme: 'light',
  gridDensity: 'comfortable',
  autoRefresh: false,
  refreshInterval: 30,
  notifications: {
    orderUpdates: true,
    driverAlerts: true,
    routeCompletions: true,
    systemMessages: false,
  },
  modals: {
    routeCreation: false,
    orderDetails: false,
    driverAssignment: false,
    vehicleManagement: false,
  },
  dashboard: {
    showKPIs: true,
    showCharts: true,
    showDriverLeaderboard: true,
    defaultTimeRange: 'today',
  },
};

const DEFAULT_FILTERS: ActiveFilters = {
  orders: {},
  drivers: {},
  vehicles: {},
  routes: {},
};

const DEFAULT_SEARCH_STATE: SearchState = {
  orders: '',
  drivers: '',
  vehicles: '',
  routes: '',
};

const DEFAULT_SORT_STATE: SortState = {
  orders: null,
  drivers: null,
  vehicles: null,
  routes: null,
};

const DEFAULT_DATE_RANGE_STATE: DateRangeState = {
  analytics: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0], // today
  },
  orders: {
    start: new Date().toISOString().split('T')[0], // today
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  },
  routes: {
    start: new Date().toISOString().split('T')[0], // today
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  },
};

const DEFAULT_DRAG_DROP_STATE: DragDropState = {
  draggedOrderId: null,
  draggedFromRoute: null,
  dragOverTarget: null,
  isDragging: false,
  dragStartTime: 0,
};

const DEFAULT_ROUTE_BUILDER_STATE: RouteBuilderState = {
  routeId: null,
  orderIds: [],
  isModified: false,
};

const DEFAULT_SIMULATION_STATE: SimulationState = {
  isRunning: false,
  speed: 1,
  startTime: null,
  alerts: [],
  events: [],
  lastUpdateTime: null,
  progressAnimations: {},
};

const DEFAULT_PERFORMANCE_STATE: PerformanceState = {
  currentMetrics: null,
  historicalMetrics: [],
  driverEfficiencyMetrics: [],
  onTimeAnalytics: null,
  costAnalytics: null,
  kpiAlerts: [],
  kpiThresholds: {
    onTimeDeliveryRate: { warning: 85, critical: 75 },
    avgDeliveryTime: { warning: 45, critical: 60 },
    costPerDelivery: { warning: 15, critical: 20 },
    driverEfficiency: { warning: 70, critical: 60 },
    fuelEfficiency: { warning: 8, critical: 10 },
    customerSatisfaction: { warning: 4.0, critical: 3.5 }
  },
  lastCalculated: null,
  autoUpdateEnabled: true,
  updateInterval: 300, // 5 minutes
};

const DEFAULT_SMART_SUGGESTIONS_STATE: SmartSuggestionsState = {
  suggestions: [],
  batchSuggestions: [],
  conflicts: [],
  config: DEFAULT_SMART_SUGGESTION_CONFIG,
  lastUpdated: null,
  isGenerating: false,
  enableAutoSuggestions: true,
  suggestionHistory: [],
  appliedSuggestions: []
};

export function DeliveryProvider({ children }: DeliveryProviderProps) {
  // Core Data State
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => 
    mockOrders.map(order => ({ ...order }))
  );
  const [drivers, setDrivers] = useState<Driver[]>(() => 
    mockDrivers.map(driver => ({ ...driver }))
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => 
    mockVehicles.map(vehicle => ({ ...vehicle }))
  );
  const [routes, setRoutes] = useState<DeliveryRoute[]>(() => 
    mockRoutes.map(route => ({ ...route }))
  );
  
  // UI State
  const [currentView, setCurrentView] = useState<DeliveryView>('order-queue');
  const [routeViewState, setRouteViewState] = useState<RouteViewState>('grid');
  const [selectedOrders, setSelectedOrders] = useState<SelectedOrdersState>({ orderIds: [] });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);
  const [uiPreferences, setUIPreferences] = useState<UIPreferences>(DEFAULT_UI_PREFERENCES);
  const [searchState, setSearchState] = useState<SearchState>(DEFAULT_SEARCH_STATE);
  const [sortState, setSortState] = useState<SortState>(DEFAULT_SORT_STATE);
  const [dateRangeState, setDateRangeState] = useState<DateRangeState>(DEFAULT_DATE_RANGE_STATE);
  const [dragDropState, setDragDropState] = useState<DragDropState>(DEFAULT_DRAG_DROP_STATE);
  const [routeBuilderState, setRouteBuilderState] = useState<RouteBuilderState>(DEFAULT_ROUTE_BUILDER_STATE);
  const [simulationState, setSimulationState] = useState<SimulationState>(DEFAULT_SIMULATION_STATE);
  const [performanceState, setPerformanceState] = useState<PerformanceState>(DEFAULT_PERFORMANCE_STATE);
  const [smartSuggestionsState, setSmartSuggestionsState] = useState<SmartSuggestionsState>(DEFAULT_SMART_SUGGESTIONS_STATE);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // ==================== ORDER MANAGEMENT ====================
  
  const selectOrders = (orderIds: string[], batchId?: string) => {
    setSelectedOrders({ orderIds, batchId });
  };

  const clearSelectedOrders = () => {
    setSelectedOrders({ orderIds: [] });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const assignOrdersToRoute = (orderIds: string[], routeId: string) => {
    // Update orders
    setOrders(prevOrders => 
      prevOrders.map(order => 
        orderIds.includes(order.id)
          ? { ...order, assignedRouteId: routeId, status: 'ASSIGNED' as OrderStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    
    // Update route
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId
          ? { ...route, orderIds: [...new Set([...route.orderIds, ...orderIds])] }
          : route
      )
    );
  };

  // ==================== ROUTE MANAGEMENT ====================
  
  const createRoute = async (routeData: Partial<DeliveryRoute>): Promise<string> => {
    setIsUpdating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRoute: DeliveryRoute = {
      id: `RTE-${Date.now()}`,
      name: routeData.name || `Route ${routes.length + 1}`,
      status: 'DRAFT',
      orderIds: routeData.orderIds || [],
      scheduledStartTime: routeData.scheduledStartTime || new Date().toISOString(),
      estimatedDuration: routeData.estimatedDuration || 120,
      totalDistance: routeData.totalDistance || 0,
      progress: { completed: 0, total: routeData.orderIds?.length || 0 },
      createdAt: new Date().toISOString(),
      priority: routeData.priority || 'MEDIUM',
      optimized: false,
      ...routeData
    };
    
    setRoutes(prevRoutes => [...prevRoutes, newRoute]);
    setIsUpdating(false);
    
    return newRoute.id;
  };

  const updateRoute = (routeId: string, updates: Partial<DeliveryRoute>) => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId 
          ? { ...route, ...updates }
          : route
      )
    );
  };

  const deleteRoute = (routeId: string) => {
    // Unassign orders from this route
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.assignedRouteId === routeId
          ? { ...order, assignedRouteId: undefined, status: 'PENDING' as OrderStatus }
          : order
      )
    );
    
    // Remove route
    setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== routeId));
  };

  const optimizeRoute = async (routeId: string): Promise<void> => {
    setIsUpdating(true);
    
    // Simulate route optimization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId
          ? { ...route, optimized: true, estimatedDuration: Math.max(60, route.estimatedDuration * 0.85) }
          : route
      )
    );
    
    setIsUpdating(false);
  };

  // ==================== DRIVER MANAGEMENT ====================
  
  const updateDriverStatus = (driverId: string, status: DriverStatus) => {
    setDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId 
          ? { ...driver, status }
          : driver
      )
    );
  };

  const assignDriverToRoute = (driverId: string, routeId: string) => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId
          ? { ...route, driverId }
          : route
      )
    );
  };

  const unassignDriverFromRoute = (driverId: string) => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.driverId === driverId
          ? { ...route, driverId: undefined }
          : route
      )
    );
  };

  // ==================== VEHICLE MANAGEMENT ====================
  
  const updateVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, status }
          : vehicle
      )
    );
  };

  const assignVehicleToRoute = (vehicleId: string, routeId: string) => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId
          ? { ...route, vehicleId }
          : route
      )
    );
  };

  const unassignVehicleFromRoute = (vehicleId: string) => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.vehicleId === vehicleId
          ? { ...route, vehicleId: undefined }
          : route
      )
    );
  };

  // ==================== FILTER MANAGEMENT ====================
  
  const setOrderFilters = (filters: Partial<ActiveFilters['orders']>) => {
    setActiveFilters(prev => ({
      ...prev,
      orders: { ...prev.orders, ...filters }
    }));
  };

  const setDriverFilters = (filters: Partial<ActiveFilters['drivers']>) => {
    setActiveFilters(prev => ({
      ...prev,
      drivers: { ...prev.drivers, ...filters }
    }));
  };

  const setVehicleFilters = (filters: Partial<ActiveFilters['vehicles']>) => {
    setActiveFilters(prev => ({
      ...prev,
      vehicles: { ...prev.vehicles, ...filters }
    }));
  };

  const setRouteFilters = (filters: Partial<ActiveFilters['routes']>) => {
    setActiveFilters(prev => ({
      ...prev,
      routes: { ...prev.routes, ...filters }
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters(DEFAULT_FILTERS);
  };

  // ==================== SEARCH MANAGEMENT ====================
  
  const setSearchQuery = (table: keyof SearchState, query: string) => {
    setSearchState(prev => ({ ...prev, [table]: query }));
  };

  const clearAllSearches = () => {
    setSearchState(DEFAULT_SEARCH_STATE);
  };

  // ==================== SORT MANAGEMENT ====================
  
  const setSortConfig = (table: keyof SortState, config: SortConfig | null) => {
    setSortState(prev => ({ ...prev, [table]: config }));
  };

  const clearAllSorts = () => {
    setSortState(DEFAULT_SORT_STATE);
  };

  // ==================== DATE RANGE MANAGEMENT ====================
  
  const setDateRange = (view: keyof DateRangeState, range: { start: string; end: string }) => {
    setDateRangeState(prev => ({ ...prev, [view]: range }));
  };

  const clearDateRanges = () => {
    setDateRangeState(DEFAULT_DATE_RANGE_STATE);
  };

  // ==================== DRAG & DROP MANAGEMENT ====================
  
  const startDrag = (orderId: string, fromRouteId?: string) => {
    setDragDropState({
      draggedOrderId: orderId,
      draggedFromRoute: fromRouteId || null,
      dragOverTarget: null,
      isDragging: true,
      dragStartTime: Date.now(),
    });
  };

  const endDrag = () => {
    setDragDropState(DEFAULT_DRAG_DROP_STATE);
  };

  const setDragOverTarget = (targetId: string | null) => {
    setDragDropState(prev => ({ ...prev, dragOverTarget: targetId }));
  };

  const reorderOrdersInRoute = (routeId: string, fromIndex: number, toIndex: number) => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => {
        if (route.id === routeId) {
          const newOrderIds = [...route.orderIds];
          const [movedOrder] = newOrderIds.splice(fromIndex, 1);
          newOrderIds.splice(toIndex, 0, movedOrder);
          return { ...route, orderIds: newOrderIds };
        }
        return route;
      })
    );
  };

  const moveOrderToRoute = (orderId: string, fromRouteId: string | null, toRouteId: string, position?: number) => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => {
        // Remove from source route
        if (route.id === fromRouteId) {
          return { 
            ...route, 
            orderIds: route.orderIds.filter(id => id !== orderId)
          };
        }
        // Add to target route
        if (route.id === toRouteId) {
          const newOrderIds = [...route.orderIds];
          if (position !== undefined) {
            newOrderIds.splice(position, 0, orderId);
          } else {
            newOrderIds.push(orderId);
          }
          return { ...route, orderIds: newOrderIds };
        }
        return route;
      })
    );
    
    // Update order assignment
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, assignedRouteId: toRouteId, status: 'ASSIGNED' as OrderStatus }
          : order
      )
    );
  };

  const addOrderToRoute = (orderId: string, routeId: string, position?: number) => {
    moveOrderToRoute(orderId, null, routeId, position);
  };

  const removeOrderFromRoute = (orderId: string, routeId: string) => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId
          ? { ...route, orderIds: route.orderIds.filter(id => id !== orderId) }
          : route
      )
    );
    
    // Update order to unassigned
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, assignedRouteId: undefined, status: 'PENDING' as OrderStatus }
          : order
      )
    );
  };

  // ==================== ROUTE BUILDER MANAGEMENT ====================
  
  const initializeRouteBuilder = (routeId?: string) => {
    if (routeId) {
      const route = routes.find(r => r.id === routeId);
      setRouteBuilderState({
        routeId,
        orderIds: route?.orderIds || [],
        isModified: false,
      });
    } else {
      setRouteBuilderState({
        routeId: null,
        orderIds: [],
        isModified: false,
      });
    }
  };

  const addOrderToBuilder = (orderId: string, position?: number) => {
    setRouteBuilderState(prev => {
      const newOrderIds = [...prev.orderIds];
      if (position !== undefined) {
        newOrderIds.splice(position, 0, orderId);
      } else {
        newOrderIds.push(orderId);
      }
      return {
        ...prev,
        orderIds: newOrderIds,
        isModified: true,
      };
    });
  };

  const removeOrderFromBuilder = (orderId: string) => {
    setRouteBuilderState(prev => ({
      ...prev,
      orderIds: prev.orderIds.filter(id => id !== orderId),
      isModified: true,
    }));
  };

  const reorderOrdersInBuilder = (fromIndex: number, toIndex: number) => {
    setRouteBuilderState(prev => {
      const newOrderIds = [...prev.orderIds];
      const [movedOrder] = newOrderIds.splice(fromIndex, 1);
      newOrderIds.splice(toIndex, 0, movedOrder);
      return {
        ...prev,
        orderIds: newOrderIds,
        isModified: true,
      };
    });
  };

  const clearRouteBuilder = () => {
    setRouteBuilderState(DEFAULT_ROUTE_BUILDER_STATE);
  };

  const saveRouteFromBuilder = async (): Promise<string | null> => {
    if (routeBuilderState.orderIds.length === 0) {
      return null;
    }
    
    setIsUpdating(true);
    
    try {
      if (routeBuilderState.routeId) {
        // Update existing route
        setRoutes(prevRoutes => 
          prevRoutes.map(route => 
            route.id === routeBuilderState.routeId
              ? { ...route, orderIds: routeBuilderState.orderIds }
              : route
          )
        );
        
        // Update order assignments
        setOrders(prevOrders => 
          prevOrders.map(order => 
            routeBuilderState.orderIds.includes(order.id)
              ? { ...order, assignedRouteId: routeBuilderState.routeId, status: 'ASSIGNED' as OrderStatus }
              : order
          )
        );
        
        setRouteBuilderState(prev => ({ ...prev, isModified: false }));
        return routeBuilderState.routeId;
      } else {
        // Create new route
        const newRouteId = await createRoute({
          orderIds: routeBuilderState.orderIds,
          name: `Route ${new Date().toLocaleDateString()}`,
        });
        
        clearRouteBuilder();
        return newRouteId;
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // ==================== PREFERENCES MANAGEMENT ====================
  
  const updateUIPreferences = (preferences: Partial<UIPreferences>) => {
    setUIPreferences(prev => ({ ...prev, ...preferences }));
  };

  const resetUIPreferences = () => {
    setUIPreferences(DEFAULT_UI_PREFERENCES);
  };

  // ==================== MODAL MANAGEMENT ====================
  const openModal = (modalType: keyof UIPreferences['modals']) => {
    setUIPreferences(prev => ({
      ...prev,
      modals: { ...prev.modals, [modalType]: true }
    }));
  };

  const closeModal = (modalType: keyof UIPreferences['modals']) => {
    setUIPreferences(prev => ({
      ...prev,
      modals: { ...prev.modals, [modalType]: false }
    }));
  };

  const closeAllModals = () => {
    setUIPreferences(prev => ({
      ...prev,
      modals: {
        routeCreation: false,
        orderDetails: false,
        driverAssignment: false,
        vehicleManagement: false,
      }
    }));
  };

  // ==================== COMPUTED VALUES ====================
  
  const getFilteredOrders = (): DeliveryOrder[] => {
    const filters = activeFilters.orders;
    const searchQuery = searchState.orders.toLowerCase();
    const sortConfig = sortState.orders;
    
    let filtered = orders.filter(order => {
      // Apply existing filters
      if (filters.status && filters.status.length > 0 && !filters.status.includes(order.status)) {
        return false;
      }
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(order.priority)) {
        return false;
      }
      if (filters.customerId && order.customerId !== filters.customerId) {
        return false;
      }
      if (filters.assignedDriverId && order.assignedDriverId !== filters.assignedDriverId) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const searchFields = [
          order.id,
          order.customerName,
          order.deliveryAddress,
          order.phone,
          order.specialInstructions || ''
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchQuery)) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof DeliveryOrder];
        const bValue = b[sortConfig.field as keyof DeliveryOrder];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  };

  const getFilteredDrivers = (): Driver[] => {
    const filters = activeFilters.drivers;
    const searchQuery = searchState.drivers.toLowerCase();
    const sortConfig = sortState.drivers;
    
    let filtered = drivers.filter(driver => {
      // Apply existing filters
      if (filters.status && filters.status.length > 0 && !filters.status.includes(driver.status)) {
        return false;
      }
      if (filters.vehicleId && driver.vehicleId !== filters.vehicleId) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const searchFields = [
          driver.id,
          driver.name,
          driver.email,
          driver.phone,
          driver.licenseNumber
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchQuery)) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof Driver];
        const bValue = b[sortConfig.field as keyof Driver];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  };

  const getFilteredVehicles = (): Vehicle[] => {
    const filters = activeFilters.vehicles;
    const searchQuery = searchState.vehicles.toLowerCase();
    const sortConfig = sortState.vehicles;
    
    let filtered = vehicles.filter(vehicle => {
      // Apply existing filters
      if (filters.status && filters.status.length > 0 && !filters.status.includes(vehicle.status)) {
        return false;
      }
      if (filters.type && filters.type.length > 0 && !filters.type.includes(vehicle.type)) {
        return false;
      }
      if (filters.hasRefrigeration !== undefined && vehicle.hasRefrigeration !== filters.hasRefrigeration) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const searchFields = [
          vehicle.id,
          vehicle.name,
          vehicle.licensePlate,
          vehicle.type,
          vehicle.make,
          vehicle.model
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchQuery)) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof Vehicle];
        const bValue = b[sortConfig.field as keyof Vehicle];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  };

  const getFilteredRoutes = (): DeliveryRoute[] => {
    const filters = activeFilters.routes;
    const searchQuery = searchState.routes.toLowerCase();
    const sortConfig = sortState.routes;
    
    let filtered = routes.filter(route => {
      // Apply existing filters
      if (filters.status && filters.status.length > 0 && !filters.status.includes(route.status)) {
        return false;
      }
      if (filters.driverId && route.driverId !== filters.driverId) {
        return false;
      }
      if (filters.vehicleId && route.vehicleId !== filters.vehicleId) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const driverName = drivers.find(d => d.id === route.driverId)?.name || '';
        const vehicleName = vehicles.find(v => v.id === route.vehicleId)?.name || '';
        
        const searchFields = [
          route.id,
          route.name,
          driverName,
          vehicleName,
          route.priority
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchQuery)) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof DeliveryRoute];
        const bValue = b[sortConfig.field as keyof DeliveryRoute];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  };

  const getAvailableDrivers = (): Driver[] => {
    return drivers.filter(driver => 
      ['AVAILABLE', 'BREAK'].includes(driver.status) &&
      !routes.some(route => route.driverId === driver.id && ['SCHEDULED', 'ACTIVE'].includes(route.status))
    );
  };

  const getAvailableVehicles = (): Vehicle[] => {
    return vehicles.filter(vehicle => 
      vehicle.status === 'AVAILABLE' &&
      !routes.some(route => route.vehicleId === vehicle.id && ['SCHEDULED', 'ACTIVE'].includes(route.status))
    );
  };

  const getUnassignedOrders = (): DeliveryOrder[] => {
    return orders.filter(order => 
      order.status === 'PENDING' && !order.assignedRouteId
    );
  };

  // ==================== BATCH OPERATIONS ====================
  
  const createBatchFromSelectedOrders = (): string => {
    const batchId = `BATCH-${Date.now()}`;
    setSelectedOrders(prev => ({ ...prev, batchId }));
    return batchId;
  };

  const applyBatchSuggestion = (suggestion: any) => {
    selectOrders(suggestion.orders);
  };

  // ==================== REAL-TIME SIMULATION SYSTEM ====================

  // Simulation useEffect to manage the timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (simulationState.isRunning) {
      const updateInterval = Math.max(100, 1000 / simulationState.speed); // Faster updates for higher speeds
      
      intervalId = setInterval(() => {
        setSimulationState(prev => ({ ...prev, lastUpdateTime: new Date() }));
        generateRandomEvent();
        
        // Update route progress for active routes
        routes.filter(route => route.status === 'ACTIVE').forEach(route => {
          const currentProgress = prev.progressAnimations[route.id]?.currentProgress || route.progress.completed / route.progress.total * 100;
          if (currentProgress < 100) {
            const progressIncrement = Math.random() * 2 * simulationState.speed; // Random progress increment
            const newProgress = Math.min(100, currentProgress + progressIncrement);
            animateProgressTo(route.id, newProgress);
          }
        });
      }, updateInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [simulationState.isRunning, simulationState.speed, routes]);

  // Simulation control functions
  const startSimulation = (speed: number = 1) => {
    setSimulationState(prev => ({
      ...prev,
      isRunning: true,
      speed,
      startTime: new Date(),
      lastUpdateTime: new Date()
    }));
    
    addAlert({
      type: 'info',
      title: 'Simulation Started',
      message: `Real-time simulation is now running at ${speed}x speed`,
      autoClose: true,
      duration: 3000
    });
  };

  const stopSimulation = () => {
    setSimulationState(prev => ({
      ...prev,
      isRunning: false,
      startTime: null,
      alerts: prev.alerts.filter(alert => alert.type !== 'info' || !alert.title.includes('Simulation'))
    }));
    
    addAlert({
      type: 'info',
      title: 'Simulation Stopped',
      message: 'Real-time simulation has been stopped',
      autoClose: true,
      duration: 2000
    });
  };

  const pauseSimulation = () => {
    setSimulationState(prev => ({ ...prev, isRunning: false }));
  };

  const resumeSimulation = () => {
    setSimulationState(prev => ({ ...prev, isRunning: true, lastUpdateTime: new Date() }));
  };

  const setSimulationSpeed = (speed: number) => {
    setSimulationState(prev => ({ ...prev, speed }));
    
    if (simulationState.isRunning) {
      addAlert({
        type: 'info',
        title: 'Simulation Speed Changed',
        message: `Simulation speed changed to ${speed}x`,
        autoClose: true,
        duration: 2000
      });
    }
  };

  // Alert management
  const addAlert = (alert: Omit<SimulationAlert, 'id' | 'timestamp'>) => {
    const newAlert: SimulationAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    setSimulationState(prev => ({
      ...prev,
      alerts: [...prev.alerts, newAlert]
    }));

    // Auto-remove alert if specified
    if (alert.autoClose && alert.duration) {
      setTimeout(() => {
        dismissAlert(newAlert.id);
      }, alert.duration);
    }
  };

  const dismissAlert = (alertId: string) => {
    setSimulationState(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }));
  };

  const clearAllAlerts = () => {
    setSimulationState(prev => ({
      ...prev,
      alerts: []
    }));
  };

  // Event generation
  const generateRandomEvent = () => {
    if (!simulationState.isRunning || Math.random() > 0.1 / simulationState.speed) return; // 10% chance per second at 1x speed

    const eventTypes: SimulationEvent['type'][] = [
      'route_progress', 
      'delivery_completed', 
      'delay_detected', 
      'driver_status_change', 
      'vehicle_issue'
    ];

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const activeRoutes = routes.filter(route => route.status === 'ACTIVE');
    
    if (activeRoutes.length === 0) return;

    const randomRoute = activeRoutes[Math.floor(Math.random() * activeRoutes.length)];
    const driver = drivers.find(d => d.id === randomRoute.driverId);
    const vehicle = vehicles.find(v => v.id === randomRoute.vehicleId);

    let eventData: any = {};
    let alertData: Omit<SimulationAlert, 'id' | 'timestamp'> | null = null;

    switch (eventType) {
      case 'route_progress':
        eventData = { progressUpdate: Math.random() * 10 };
        break;
        
      case 'delivery_completed':
        if (randomRoute.progress.completed < randomRoute.progress.total) {
          eventData = { orderCompleted: true };
          alertData = {
            type: 'success',
            title: '📦 Delivery Completed',
            message: `${driver?.name || 'Driver'} completed a delivery on ${randomRoute.name}`,
            routeId: randomRoute.id,
            driverId: randomRoute.driverId,
            autoClose: true,
            duration: 4000
          };
          
          // Update route progress
          setRoutes(prevRoutes => 
            prevRoutes.map(route => 
              route.id === randomRoute.id 
                ? { ...route, progress: { ...route.progress, completed: Math.min(route.progress.total, route.progress.completed + 1) }}
                : route
            )
          );
        }
        break;
        
      case 'delay_detected':
        eventData = { delayMinutes: Math.floor(Math.random() * 30) + 5 };
        alertData = {
          type: 'warning',
          title: '⚠️ Delivery Delay',
          message: `${randomRoute.name} is experiencing a ${eventData.delayMinutes}-minute delay`,
          routeId: randomRoute.id,
          driverId: randomRoute.driverId,
          autoClose: true,
          duration: 6000
        };
        break;
        
      case 'driver_status_change':
        const statuses: DriverStatus[] = ['AVAILABLE', 'ON_ROUTE', 'ON_BREAK'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        eventData = { newStatus };
        
        if (newStatus === 'ON_BREAK') {
          alertData = {
            type: 'info',
            title: '☕ Driver Break',
            message: `${driver?.name || 'Driver'} is taking a scheduled break`,
            driverId: randomRoute.driverId,
            autoClose: true,
            duration: 4000
          };
        }
        break;
        
      case 'vehicle_issue':
        const issues = ['low_fuel', 'maintenance_due', 'temperature_warning'];
        const issue = issues[Math.floor(Math.random() * issues.length)];
        eventData = { issue };
        
        alertData = {
          type: 'error',
          title: '🚛 Vehicle Issue',
          message: `${vehicle?.name || 'Vehicle'} reports: ${issue.replace('_', ' ')}`,
          vehicleId: randomRoute.vehicleId,
          routeId: randomRoute.id,
          autoClose: false // Keep vehicle alerts until manually dismissed
        };
        break;
    }

    // Add event to simulation state
    const newEvent: SimulationEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      timestamp: new Date(),
      routeId: randomRoute.id,
      driverId: randomRoute.driverId,
      vehicleId: randomRoute.vehicleId,
      data: eventData
    };

    setSimulationState(prev => ({
      ...prev,
      events: [...prev.events.slice(-49), newEvent] // Keep last 50 events
    }));

    // Add alert if generated
    if (alertData) {
      addAlert(alertData);
    }
  };

  // Progress animation functions
  const updateRouteProgress = (routeId: string, progress: number) => {
    setSimulationState(prev => ({
      ...prev,
      progressAnimations: {
        ...prev.progressAnimations,
        [routeId]: {
          currentProgress: progress,
          targetProgress: progress
        }
      }
    }));
  };

  const animateProgressTo = (routeId: string, targetProgress: number, duration: number = 1000) => {
    const currentProgress = simulationState.progressAnimations[routeId]?.currentProgress || 0;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Smooth easing
      
      const newProgress = currentProgress + (targetProgress - currentProgress) * easeOutQuart;
      
      setSimulationState(prev => ({
        ...prev,
        progressAnimations: {
          ...prev.progressAnimations,
          [routeId]: {
            currentProgress: newProgress,
            targetProgress,
            animationId: prev.progressAnimations[routeId]?.animationId
          }
        }
      }));

      if (progress < 1) {
        const animationId = requestAnimationFrame(animate);
        setSimulationState(prev => ({
          ...prev,
          progressAnimations: {
            ...prev.progressAnimations,
            [routeId]: {
              ...prev.progressAnimations[routeId],
              animationId
            }
          }
        }));
      }
    };

    // Cancel any existing animation for this route
    const existingAnimation = simulationState.progressAnimations[routeId]?.animationId;
    if (existingAnimation) {
      cancelAnimationFrame(existingAnimation);
    }

    animate();
  };

  // ==================== PERFORMANCE METRICS MANAGEMENT ====================

  const updatePerformanceMetrics = async (): Promise<void> => {
    setIsUpdating(true);
    
    try {
      // Calculate real-time metrics
      const currentMetrics = calculateRealTimeKPIs(orders, routes, drivers, vehicles);
      
      // Generate KPI alerts based on thresholds
      const kpiAlerts = generateKPIAlerts(currentMetrics, performanceState.kpiThresholds);
      
      // Update performance state
      setPerformanceState(prev => ({
        ...prev,
        currentMetrics,
        kpiAlerts,
        lastCalculated: new Date(),
        historicalMetrics: [...prev.historicalMetrics, currentMetrics].slice(-100), // Keep last 100 records
        driverEfficiencyMetrics: rankDriversByEfficiency(drivers, orders, routes, vehicles),
        onTimeAnalytics: calculateOnTimeDeliveryRate(orders, routes),
        costAnalytics: calculateCostPerDelivery(orders, routes, drivers, vehicles)
      }));
      
      // Add alerts to simulation state if there are critical issues
      kpiAlerts.forEach(alert => {
        if (alert.severity === 'critical') {
          addAlert({
            type: 'error',
            title: `🚨 Critical KPI Alert: ${alert.metric}`,
            message: alert.message,
            autoClose: false
          });
        } else if (alert.severity === 'warning') {
          addAlert({
            type: 'warning',
            title: `⚠️ KPI Warning: ${alert.metric}`,
            message: alert.message,
            autoClose: true,
            duration: 8000
          });
        }
      });
      
    } catch (error) {
      console.error('Error updating performance metrics:', error);
      addAlert({
        type: 'error',
        title: 'Performance Update Failed',
        message: 'Unable to calculate performance metrics',
        autoClose: true,
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const trackDeliveryCompletion = (orderId: string, routeId: string, completedAt: Date) => {
    // Update order status
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'DELIVERED' as OrderStatus, deliveredAt: completedAt.toISOString() }
          : order
      )
    );
    
    // Update route progress
    setRoutes(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId
          ? { ...route, progress: { ...route.progress, completed: route.progress.completed + 1 } }
          : route
      )
    );
    
    // Trigger performance metrics update if auto-update is enabled
    if (performanceState.autoUpdateEnabled) {
      updatePerformanceMetrics();
    }
  };

  const updateKPIThresholds = (thresholds: Partial<KPIThresholds>) => {
    setPerformanceState(prev => ({
      ...prev,
      kpiThresholds: { ...prev.kpiThresholds, ...thresholds }
    }));
  };

  const toggleAutoPerformanceUpdates = (enabled: boolean) => {
    setPerformanceState(prev => ({
      ...prev,
      autoUpdateEnabled: enabled
    }));
  };

  const setPerformanceUpdateInterval = (seconds: number) => {
    setPerformanceState(prev => ({
      ...prev,
      updateInterval: seconds
    }));
  };

  const refreshPerformanceData = async (): Promise<void> => {
    await updatePerformanceMetrics();
  };

  const getDriverRankings = (): DriverEfficiencyMetrics[] => {
    return performanceState.driverEfficiencyMetrics.sort((a, b) => b.overall.score - a.overall.score);
  };

  const generatePerformanceReport = async (startDate: Date, endDate: Date): Promise<PerformanceMetrics> => {
    // Filter data by date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.scheduledDeliveryTime);
      return orderDate >= startDate && orderDate <= endDate;
    });
    
    const filteredRoutes = routes.filter(route => {
      const routeDate = new Date(route.scheduledStartTime);
      return routeDate >= startDate && routeDate <= endDate;
    });
    
    // Calculate metrics for the specified period
    return calculateRealTimeKPIs(filteredOrders, filteredRoutes, drivers, vehicles);
  };

  // Performance metrics auto-update effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (performanceState.autoUpdateEnabled && performanceState.updateInterval > 0) {
      intervalId = setInterval(() => {
        updatePerformanceMetrics();
      }, performanceState.updateInterval * 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [performanceState.autoUpdateEnabled, performanceState.updateInterval, orders, routes, drivers, vehicles]);

  // Initial performance metrics calculation
  useEffect(() => {
    updatePerformanceMetrics();
  }, []);

  // ==================== SMART SUGGESTIONS MANAGEMENT ====================

  const generateSmartSuggestions = async (): Promise<void> => {
    setSmartSuggestionsState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      // Generate batch suggestions
      const batchSuggestions = generateSmartBatches(orders, drivers, vehicles, smartSuggestionsState.config);
      
      // Generate AI recommendations
      const smartSuggestions = generateSmartRecommendations(orders, routes, drivers, vehicles, smartSuggestionsState.config);
      
      // Detect conflicts
      const conflicts = detectConflicts(orders, routes, drivers, vehicles);
      
      setSmartSuggestionsState(prev => ({
        ...prev,
        suggestions: smartSuggestions,
        batchSuggestions,
        conflicts,
        lastUpdated: new Date(),
        isGenerating: false
      }));
      
      // Add alerts for critical conflicts
      conflicts.forEach(conflict => {
        if (conflict.severity === 'critical') {
          addAlert({
            type: 'error',
            title: `🚨 Critical Conflict: ${conflict.title}`,
            message: conflict.description,
            autoClose: false
          });
        }
      });
      
    } catch (error) {
      console.error('Error generating smart suggestions:', error);
      setSmartSuggestionsState(prev => ({ ...prev, isGenerating: false }));
      addAlert({
        type: 'error',
        title: 'Smart Suggestions Failed',
        message: 'Unable to generate smart suggestions',
        autoClose: true,
        duration: 5000
      });
    }
  };

  const applySmartSuggestion = async (suggestionId: string): Promise<void> => {
    const suggestion = smartSuggestionsState.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    setIsUpdating(true);
    
    try {
      // Apply the suggestion based on its type
      switch (suggestion.type) {
        case 'batch':
          // Select the orders for batch creation
          selectOrders(suggestion.orderIds);
          openModal('routeCreation');
          break;
          
        case 'reassignment':
          // Implement route reassignment logic
          if (suggestion.applicableRoutes && suggestion.applicableRoutes.length > 0) {
            const targetRouteId = suggestion.applicableRoutes[0];
            assignOrdersToRoute(suggestion.orderIds, targetRouteId);
          }
          break;
          
        case 'optimization':
          // Apply optimization recommendation
          if (suggestion.applicableRoutes && suggestion.applicableRoutes.length > 0) {
            for (const routeId of suggestion.applicableRoutes) {
              await optimizeRoute(routeId);
            }
          }
          break;
          
        case 'scheduling':
          // Apply scheduling changes
          // This would involve more complex scheduling logic
          break;
      }
      
      // Mark suggestion as applied
      setSmartSuggestionsState(prev => ({
        ...prev,
        appliedSuggestions: [...prev.appliedSuggestions, suggestionId],
        suggestions: prev.suggestions.filter(s => s.id !== suggestionId),
        suggestionHistory: [...prev.suggestionHistory, suggestion]
      }));
      
      addAlert({
        type: 'success',
        title: 'Suggestion Applied',
        message: `Successfully applied: ${suggestion.title}`,
        autoClose: true,
        duration: 4000
      });
      
    } catch (error) {
      console.error('Error applying suggestion:', error);
      addAlert({
        type: 'error',
        title: 'Application Failed',
        message: `Failed to apply suggestion: ${suggestion.title}`,
        autoClose: true,
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSmartSuggestionsState(prev => ({
      ...prev,
      suggestions: prev.suggestions.filter(s => s.id !== suggestionId)
    }));
  };

  const updateSuggestionConfig = (config: Partial<SmartSuggestionConfig>) => {
    setSmartSuggestionsState(prev => ({
      ...prev,
      config: { ...prev.config, ...config }
    }));
  };

  const detectAndResolveConflicts = async (): Promise<void> => {
    const conflicts = detectConflicts(orders, routes, drivers, vehicles);
    
    setSmartSuggestionsState(prev => ({
      ...prev,
      conflicts
    }));
    
    // Auto-resolve simple conflicts if enabled
    if (smartSuggestionsState.config.autoApplyLowRiskSuggestions) {
      for (const conflict of conflicts) {
        const autoResolution = conflict.resolutionOptions.find(opt => opt.autoApplicable);
        if (autoResolution && conflict.severity !== 'critical') {
          await resolveConflict(conflict.id, autoResolution.id);
        }
      }
    }
  };

  const resolveConflict = async (conflictId: string, resolutionId: string): Promise<void> => {
    const conflict = smartSuggestionsState.conflicts.find(c => c.id === conflictId);
    const resolution = conflict?.resolutionOptions.find(r => r.id === resolutionId);
    
    if (!conflict || !resolution) return;
    
    setIsUpdating(true);
    
    try {
      // Apply resolution based on type
      switch (resolution.type) {
        case 'reschedule':
          // Implement rescheduling logic
          for (const orderId of conflict.affectedOrderIds) {
            const order = orders.find(o => o.id === orderId);
            if (order) {
              // Adjust time window (simplified implementation)
              const newStart = new Date(Date.now() + 30 * 60 * 1000); // Add 30 minutes
              const newEnd = new Date(newStart.getTime() + 2 * 60 * 60 * 1000); // 2 hour window
              // Update order time window (would need proper implementation)
            }
          }
          break;
          
        case 'reassign':
          // Reassign orders to different routes
          if (conflict.affectedRouteIds && conflict.affectedRouteIds.length > 1) {
            const sourceRoute = conflict.affectedRouteIds[0];
            const targetRoute = conflict.affectedRouteIds[1];
            
            // Move half the orders to the target route
            const ordersToMove = conflict.affectedOrderIds.slice(0, Math.ceil(conflict.affectedOrderIds.length / 2));
            for (const orderId of ordersToMove) {
              moveOrderToRoute(orderId, sourceRoute, targetRoute);
            }
          }
          break;
          
        case 'split':
          // Split the route into multiple routes
          if (conflict.affectedRouteIds && conflict.affectedRouteIds.length > 0) {
            const routeId = conflict.affectedRouteIds[0];
            const ordersToSplit = conflict.affectedOrderIds.slice(Math.ceil(conflict.affectedOrderIds.length / 2));
            
            // Create new route with split orders
            const newRouteId = await createRoute({
              name: `Split Route - ${new Date().toLocaleTimeString()}`,
              orderIds: ordersToSplit
            });
            
            // Remove orders from original route
            for (const orderId of ordersToSplit) {
              removeOrderFromRoute(orderId, routeId);
            }
          }
          break;
      }
      
      // Remove resolved conflict
      setSmartSuggestionsState(prev => ({
        ...prev,
        conflicts: prev.conflicts.filter(c => c.id !== conflictId)
      }));
      
      addAlert({
        type: 'success',
        title: 'Conflict Resolved',
        message: `Successfully resolved: ${conflict.title}`,
        autoClose: true,
        duration: 4000
      });
      
    } catch (error) {
      console.error('Error resolving conflict:', error);
      addAlert({
        type: 'error',
        title: 'Resolution Failed',
        message: `Failed to resolve conflict: ${conflict.title}`,
        autoClose: true,
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const dismissConflict = (conflictId: string) => {
    setSmartSuggestionsState(prev => ({
      ...prev,
      conflicts: prev.conflicts.filter(c => c.id !== conflictId)
    }));
  };

  const getSmartBatches = (): BatchSuggestion[] => {
    return smartSuggestionsState.batchSuggestions.sort((a, b) => b.confidence - a.confidence);
  };

  const toggleAutoSuggestions = (enabled: boolean) => {
    setSmartSuggestionsState(prev => ({
      ...prev,
      enableAutoSuggestions: enabled
    }));
  };

  // Auto-generate suggestions when orders change
  useEffect(() => {
    if (smartSuggestionsState.enableAutoSuggestions && orders.length > 0) {
      const timeoutId = setTimeout(() => {
        generateSmartSuggestions();
      }, 2000); // Debounce for 2 seconds
      
      return () => clearTimeout(timeoutId);
    }
  }, [orders, routes, smartSuggestionsState.enableAutoSuggestions]);

  // Periodic conflict detection
  useEffect(() => {
    if (smartSuggestionsState.enableAutoSuggestions) {
      const intervalId = setInterval(() => {
        detectAndResolveConflicts();
      }, 60000); // Check every minute
      
      return () => clearInterval(intervalId);
    }
  }, [smartSuggestionsState.enableAutoSuggestions, orders, routes]);

  // ==================== CONTEXT VALUE ====================
  
  const contextValue: DeliveryContextType = {
    // Core Data State
    orders,
    drivers,
    vehicles,
    routes,
    
    // UI State
    currentView,
    routeViewState,
    selectedOrders,
    activeFilters,
    uiPreferences,
    searchState,
    sortState,
    dateRangeState,
    dragDropState,
    routeBuilderState,
    simulationState,
    performanceState,
    smartSuggestionsState,
    
    // Loading States
    isLoading,
    isUpdating,
    
    // View Management
    setCurrentView,
    setRouteViewState,
    
    // Order Management
    selectOrders,
    clearSelectedOrders,
    updateOrderStatus,
    assignOrdersToRoute,
    
    // Route Management
    createRoute,
    updateRoute,
    deleteRoute,
    optimizeRoute,
    
    // Driver Management
    updateDriverStatus,
    assignDriverToRoute,
    unassignDriverFromRoute,
    
    // Vehicle Management
    updateVehicleStatus,
    assignVehicleToRoute,
    unassignVehicleFromRoute,
    
    // Filter Management
    setOrderFilters,
    setDriverFilters,
    setVehicleFilters,
    setRouteFilters,
    clearAllFilters,
    
    // Search Management
    setSearchQuery,
    clearAllSearches,
    
    // Sort Management
    setSortConfig,
    clearAllSorts,
    
    // Date Range Management
    setDateRange,
    clearDateRanges,
    
    // Drag & Drop Management
    startDrag,
    endDrag,
    setDragOverTarget,
    reorderOrdersInRoute,
    moveOrderToRoute,
    addOrderToRoute,
    removeOrderFromRoute,
    
    // Route Builder Management
    initializeRouteBuilder,
    addOrderToBuilder,
    removeOrderFromBuilder,
    reorderOrdersInBuilder,
    clearRouteBuilder,
    saveRouteFromBuilder,
    
    // Preferences Management
    updateUIPreferences,
    resetUIPreferences,
    
    // Modal Management
    openModal,
    closeModal,
    closeAllModals,
    
    // Computed Values
    getFilteredOrders,
    getFilteredDrivers,
    getFilteredVehicles,
    getFilteredRoutes,
    getAvailableDrivers,
    getAvailableVehicles,
    getUnassignedOrders,
    
    // Batch Operations
    createBatchFromSelectedOrders,
    applyBatchSuggestion,
    
    // Real-time Simulation Management
    startSimulation,
    stopSimulation,
    pauseSimulation,
    resumeSimulation,
    setSimulationSpeed,
    addAlert,
    dismissAlert,
    clearAllAlerts,
    generateRandomEvent,
    updateRouteProgress,
    animateProgressTo,
    
    // Performance Metrics Management
    updatePerformanceMetrics,
    trackDeliveryCompletion,
    updateKPIThresholds,
    toggleAutoPerformanceUpdates,
    setPerformanceUpdateInterval,
    refreshPerformanceData,
    getDriverRankings,
    generatePerformanceReport,
    
    // Smart Suggestions Management
    generateSmartSuggestions,
    applySmartSuggestion,
    dismissSuggestion,
    updateSuggestionConfig,
    detectAndResolveConflicts,
    resolveConflict,
    dismissConflict,
    getSmartBatches,
    toggleAutoSuggestions,
  };

  return (
    <DeliveryContext.Provider value={contextValue}>
      {children}
    </DeliveryContext.Provider>
  );
}