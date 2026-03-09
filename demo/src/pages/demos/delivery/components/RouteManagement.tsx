import { useMemo, useState } from 'react';
import { GraviGrid, BBDTag, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Input, Select, DatePicker, Card, Tabs } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined, CalendarOutlined, DragOutlined, SwapOutlined, ThunderboltOutlined, DollarOutlined, ClockCircleOutlined, CarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDelivery } from '../contexts/DeliveryContext';
import { mockRoutes, mockDrivers, mockVehicles, Route } from '../data/delivery.mock-data';
import { optimizeRoute, calculateRouteDistance, calculateRouteTime, calculateRouteCosts, type Coordinates, type OptimizationResult } from '../utils/route-optimization';
import { formatCurrency, formatDuration, formatDistance } from '../utils/data-mappers';

interface RouteManagementProps {
  onCreateRoute: () => void;
}

export function RouteManagement({ onCreateRoute }: RouteManagementProps) {
  const {
    routes,
    orders,
    drivers,
    vehicles,
    getFilteredRoutes,
    searchState,
    setSearchQuery,
    sortState,
    setSortConfig,
    activeFilters,
    setRouteFilters,
    dateRangeState,
    setDateRange,
    dragDropState,
    startDrag,
    endDrag,
    setDragOverTarget,
    moveOrderToRoute,
    reorderOrdersInRoute,
    simulationState
  } = useDelivery();
  
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('cards');
  
  // Get filtered routes for the grid
  const filteredRoutes = useMemo(() => getFilteredRoutes(), [getFilteredRoutes]);
  
  // Bakery location for optimization calculations
  const BAKERY_LOCATION: Coordinates = { lat: 37.7599, lng: -122.4148 };

  // Create coordinate mapping for orders
  const coordinateMapping = useMemo(() => {
    const mapping: Record<string, Coordinates> = {};
    orders.forEach((order, index) => {
      // Simple coordinate generation based on order ID for demo
      const hash = order.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      mapping[order.id] = {
        lat: BAKERY_LOCATION.lat + ((hash % 100) * 0.001 - 0.05),
        lng: BAKERY_LOCATION.lng + (((hash * 3) % 100) * 0.001 - 0.05)
      };
    });
    return mapping;
  }, [orders]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const activeRoutes = routes.filter(route => route.status === 'ACTIVE').length;
    const scheduledRoutes = routes.filter(route => route.status === 'SCHEDULED').length;
    const completedToday = routes.filter(route => 
      route.status === 'COMPLETED' && 
      new Date(route.actualEndTime || '').toDateString() === new Date().toDateString()
    ).length;
    
    const totalActiveDeliveries = routes
      .filter(route => route.status === 'ACTIVE')
      .reduce((sum, route) => sum + route.progress.total, 0);
    
    const completedDeliveries = routes
      .filter(route => route.status === 'ACTIVE')
      .reduce((sum, route) => sum + route.progress.completed, 0);
    
    const onTimeRate = totalActiveDeliveries > 0 
      ? Math.round((completedDeliveries / totalActiveDeliveries) * 100)
      : 95; // fallback value

    // Calculate optimization potential
    const activeAndScheduledRoutes = routes.filter(route => 
      (route.status === 'ACTIVE' || route.status === 'SCHEDULED') && 
      route.orderIds && route.orderIds.length > 1
    );
    
    let totalOptimizationSavings = 0;
    let averageEfficiency = 0;
    
    if (activeAndScheduledRoutes.length > 0) {
      const routeMetrics = activeAndScheduledRoutes.map(route => {
        const routeOrders = orders.filter(order => route.orderIds?.includes(order.id));
        const vehicle = vehicles.find(v => v.id === route.vehicleId);
        
        if (routeOrders.length > 1 && vehicle) {
          try {
            const optimizationResult = optimizeRoute(
              BAKERY_LOCATION,
              routeOrders,
              coordinateMapping,
              vehicle
            );
            totalOptimizationSavings += optimizationResult.savings.costSaved;
            return optimizationResult.efficiency;
          } catch (error) {
            return 85; // fallback efficiency
          }
        }
        return 85; // fallback efficiency
      });
      
      averageEfficiency = Math.round(
        routeMetrics.reduce((sum, eff) => sum + eff, 0) / routeMetrics.length
      );
    } else {
      averageEfficiency = 85;
    }
    
    return {
      activeRoutes,
      scheduledRoutes,
      completedToday,
      onTimeRate,
      optimizationSavings: totalOptimizationSavings,
      averageEfficiency
    };
  }, [routes, orders, vehicles, coordinateMapping]);

  // Drag handlers for inter-route order movement
  const handleOrderDragStart = (e: React.DragEvent, orderId: string, fromRouteId: string) => {
    console.log('Starting drag from route:', fromRouteId, 'order:', orderId);
    startDrag(orderId, fromRouteId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleOrderDragEnd = (e: React.DragEvent) => {
    console.log('Drag end in RouteManagement');
    endDrag();
  };

  const handleRouteDragOver = (e: React.DragEvent, targetRouteId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(targetRouteId);
  };

  const handleRouteDrop = (e: React.DragEvent, targetRouteId: string) => {
    e.preventDefault();
    if (dragDropState.draggedOrderId && dragDropState.draggedFromRoute) {
      console.log('Moving order from route:', dragDropState.draggedFromRoute, 'to route:', targetRouteId);
      moveOrderToRoute(
        dragDropState.draggedOrderId,
        dragDropState.draggedFromRoute,
        targetRouteId
      );
    }
    endDrag();
    setDragOverTarget(null);
  };

  const handleRouteDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverTarget(null);
    }
  };

  // Get status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { color: '#1890ff', backgroundColor: '#e6f7ff' };
      case 'SCHEDULED':
        return { color: '#fa8c16', backgroundColor: '#fff7e6' };
      case 'COMPLETED':
        return { color: '#52c41a', backgroundColor: '#f6ffed' };
      case 'DRAFT':
        return { color: '#666', backgroundColor: '#f5f5f5' };
      case 'CANCELLED':
        return { color: '#ff4d4f', backgroundColor: '#fff2f0' };
      default:
        return { color: '#666', backgroundColor: '#f5f5f5' };
    }
  };

  // Grid column definitions
  const columnDefs = useMemo(() => [
    {
      field: "id",
      headerName: "Route ID",
      width: 120,
      resizable: true,
      sortable: true
    },
    {
      field: "name",
      headerName: "Route Name",
      width: 200,
      resizable: true,
      sortable: true
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: true,
      cellRenderer: (params: any) => {
        const statusColor = getStatusColor(params.value);
        return (
          <BBDTag style={{ 
            ...statusColor,
            width: 'fit-content' 
          }}>
            {params.value}
          </BBDTag>
        );
      }
    },
    {
      field: "driverId",
      headerName: "Driver",
      width: 150,
      sortable: true,
      cellRenderer: (params: any) => {
        if (!params.value) return <span style={{ color: '#999' }}>Unassigned</span>;
        const driver = drivers.find(d => d.id === params.value);
        return driver ? driver.name : params.value;
      }
    },
    {
      field: "vehicleId",
      headerName: "Vehicle",
      width: 150,
      sortable: true,
      cellRenderer: (params: any) => {
        if (!params.value) return <span style={{ color: '#999' }}>Unassigned</span>;
        const vehicle = vehicles.find(v => v.id === params.value);
        return vehicle ? vehicle.name : params.value;
      }
    },
    {
      field: "progress",
      headerName: "Progress",
      width: 120,
      sortable: true,
      cellRenderer: (params: any) => {
        const { completed, total } = params.value;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {completed}/{total}
            </span>
            <span style={{ 
              fontSize: '12px', 
              color: percentage === 100 ? '#52c41a' : '#1890ff' 
            }}>
              ({percentage}%)
            </span>
          </div>
        );
      }
    },
    {
      field: "scheduledStartTime",
      headerName: "Scheduled Start",
      width: 150,
      sortable: true,
      cellRenderer: (params: any) => {
        const date = new Date(params.value);
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      field: "estimatedDuration",
      headerName: "Duration",
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => {
        const hours = Math.floor(params.value / 60);
        const minutes = params.value % 60;
        return `${hours}h ${minutes}m`;
      }
    },
    {
      field: "totalDistance",
      headerName: "Distance",
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => `${params.value} mi`
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => (
        <BBDTag style={{ 
          color: params.value === 'HIGH' ? '#fa8c16' : 
                 params.value === 'MEDIUM' ? '#1890ff' : '#52c41a',
          backgroundColor: params.value === 'HIGH' ? '#fff7e6' : 
                          params.value === 'MEDIUM' ? '#e6f7ff' : '#f6ffed',
          width: 'fit-content',
          fontSize: '10px'
        }}>
          {params.value}
        </BBDTag>
      )
    },
    {
      field: "efficiency",
      headerName: "Efficiency",
      width: 110,
      sortable: true,
      cellRenderer: (params: any) => {
        const route = params.data;
        const routeOrders = orders.filter(order => route.orderIds?.includes(order.id));
        const vehicle = vehicles.find(v => v.id === route.vehicleId);
        
        if (routeOrders.length > 1 && vehicle) {
          try {
            const optimizationResult = optimizeRoute(
              BAKERY_LOCATION,
              routeOrders,
              coordinateMapping,
              vehicle
            );
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ThunderboltOutlined style={{ 
                  color: optimizationResult.efficiency >= 90 ? '#52c41a' : 
                        optimizationResult.efficiency >= 75 ? '#1890ff' : '#fa8c16',
                  fontSize: '12px'
                }} />
                <span style={{ 
                  color: optimizationResult.efficiency >= 90 ? '#52c41a' : 
                        optimizationResult.efficiency >= 75 ? '#1890ff' : '#fa8c16',
                  fontWeight: 600,
                  fontSize: '12px'
                }}>
                  {optimizationResult.efficiency}%
                </span>
              </div>
            );
          } catch (error) {
            return <span style={{ color: '#999', fontSize: '11px' }}>N/A</span>;
          }
        }
        return <span style={{ color: '#999', fontSize: '11px' }}>--</span>;
      }
    }
  ], [orders, vehicles, coordinateMapping]);

  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.id,
    // Enable sorting functionality
    onSortChanged: (event: any) => {
      const sortModel = event.api.getSortModel();
      if (sortModel.length > 0) {
        const { colId, sort } = sortModel[0];
        setSortConfig('routes', {
          field: colId,
          direction: sort as 'asc' | 'desc'
        });
      } else {
        setSortConfig('routes', null);
      }
    },
  }), [setSortConfig]);

  const controlBarProps = useMemo(() => ({
    title: 'Route Management Dashboard',
    hideActiveFilters: false,
  }), []);

  const updateEP = async (params: any) => {
    console.log('Update called with:', params);
    return Promise.resolve();
  };

  // Render route cards view with drag & drop
  const renderRouteCards = () => {
    const activeAndScheduledRoutes = filteredRoutes.filter(route => 
      route.status === 'ACTIVE' || route.status === 'SCHEDULED'
    );

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', padding: '16px' }}>
        {activeAndScheduledRoutes.map((route) => {
          const routeOrders = orders.filter(order => 
            route.orderIds && route.orderIds.includes(order.id)
          );
          const driver = drivers.find(d => d.id === route.driverId);
          const vehicle = vehicles.find(v => v.id === route.vehicleId);
          const isDropTarget = dragDropState.dragOverTarget === route.id;

          return (
            <Card
              key={route.id}
              className={`route-card drop-zone ${isDropTarget ? 'drop-target' : ''}`}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>{route.name}</span>
                  <BBDTag style={{ 
                    ...getStatusColor(route.status),
                    width: 'fit-content'
                  }}>
                    {route.status}
                  </BBDTag>
                </div>
              }
              style={{
                borderColor: isDropTarget ? '#1890ff' : '#d9d9d9',
                backgroundColor: isDropTarget ? '#f0f8ff' : '#fff'
              }}
              size="small"
              onDragOver={(e) => handleRouteDragOver(e, route.id)}
              onDrop={(e) => handleRouteDrop(e, route.id)}
              onDragLeave={handleRouteDragLeave}
            >
              {/* Route Info */}
              <div style={{ marginBottom: '16px', fontSize: '12px', color: '#666' }}>
                <div><strong>Driver:</strong> {driver?.name || 'Unassigned'}</div>
                <div><strong>Vehicle:</strong> {vehicle?.name || 'Unassigned'}</div>
                <div>
                  <strong>Progress:</strong> {route.progress.completed}/{route.progress.total} (
                  {Math.round(simulationState.progressAnimations[route.id]?.currentProgress || 
                    (route.progress.completed / route.progress.total) * 100)}%
                  {simulationState.isRunning && route.status === 'ACTIVE' && (
                    <span style={{ color: '#52c41a', marginLeft: '4px' }}>🟢 LIVE</span>
                  )}
                  )
                </div>
                <div><strong>Distance:</strong> {route.totalDistance} mi</div>
                
                {/* Optimization Info */}
                {routeOrders.length > 1 && vehicle && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '6px 8px', 
                    backgroundColor: '#f0f8ff', 
                    borderRadius: '4px',
                    border: '1px solid #d6f3ff'
                  }}>
                    {(() => {
                      try {
                        const optimizationResult = optimizeRoute(
                          BAKERY_LOCATION,
                          routeOrders,
                          coordinateMapping,
                          vehicle
                        );
                        return (
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#1890ff', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ThunderboltOutlined style={{ fontSize: '10px' }} />
                              Route Optimization
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>Efficiency: {optimizationResult.efficiency}%</span>
                              <BBDTag style={{
                                color: optimizationResult.efficiency >= 90 ? '#52c41a' : 
                                      optimizationResult.efficiency >= 75 ? '#1890ff' : '#fa8c16',
                                backgroundColor: optimizationResult.efficiency >= 90 ? '#f6ffed' : 
                                                optimizationResult.efficiency >= 75 ? '#e6f7ff' : '#fff7e6',
                                fontSize: '9px',
                                padding: '1px 4px'
                              }}>
                                {optimizationResult.efficiency >= 90 ? 'EXCELLENT' : 
                                 optimizationResult.efficiency >= 75 ? 'GOOD' : 'NEEDS OPTIMIZATION'}
                              </BBDTag>
                            </div>
                            {optimizationResult.savings.costSaved > 0 && (
                              <div style={{ fontSize: '10px', color: '#52c41a', marginTop: '2px' }}>
                                💰 Potential savings: {formatCurrency(optimizationResult.savings.costSaved)}
                              </div>
                            )}
                          </div>
                        );
                      } catch (error) {
                        return (
                          <div style={{ fontSize: '10px', color: '#999' }}>
                            ⚡ Optimization available with valid data
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>

              {/* Orders List */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
                  Orders ({routeOrders.length})
                  {isDropTarget && (
                    <span style={{ color: '#1890ff', marginLeft: '8px' }}>← Drop here</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {routeOrders.map((order, index) => (
                    <div
                      key={order.id}
                      draggable
                      onDragStart={(e) => handleOrderDragStart(e, order.id, route.id)}
                      onDragEnd={handleOrderDragEnd}
                      className={`order-item drag-item ${dragDropState.draggedOrderId === order.id ? 'being-dragged' : ''}`}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        backgroundColor: dragDropState.draggedOrderId === order.id ? '#f0f8ff' : '#fafafa',
                        cursor: 'grab',
                        fontSize: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      title="Drag to move between routes"
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#333' }}>{order.id}</div>
                        <div style={{ color: '#666' }}>{order.customerName}</div>
                      </div>
                      <DragOutlined className="drag-handle" style={{ color: '#666', fontSize: '10px' }} />
                    </div>
                  ))}
                  {routeOrders.length === 0 && (
                    <div style={{ 
                      padding: '20px', 
                      textAlign: 'center' as const, 
                      color: '#999',
                      border: isDropTarget ? '2px dashed #1890ff' : '1px dashed #d9d9d9',
                      borderRadius: '4px',
                      backgroundColor: isDropTarget ? '#f0f8ff' : '#fafafa'
                    }}>
                      {isDropTarget ? 'Drop order here' : 'No orders assigned'}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px' }}>
      
      {/* Summary Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
            Route Overview
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor: viewMode === 'cards' ? '#1890ff' : '#fff',
                  color: viewMode === 'cards' ? '#fff' : '#666',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                📋 Cards View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? '#1890ff' : '#fff',
                  color: viewMode === 'grid' ? '#fff' : '#666',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                📊 Grid View
              </button>
            </div>
            <GraviButton 
              buttonText="Create New Route"
              theme1
              size="medium"
              onClick={onCreateRoute}
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {/* Active Routes Card */}
          <div style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div className="text-center">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
                {summaryMetrics.activeRoutes}
              </div>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                Active Routes
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Currently in progress
              </div>
            </div>
          </div>

          {/* Scheduled Routes Card */}
          <div style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div className="text-center">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fa8c16', marginBottom: '8px' }}>
                {summaryMetrics.scheduledRoutes}
              </div>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                Scheduled Routes
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Awaiting departure
              </div>
            </div>
          </div>

          {/* Completed Today Card */}
          <div style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div className="text-center">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a', marginBottom: '8px' }}>
                {summaryMetrics.completedToday}
              </div>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                Completed Today
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Successfully delivered
              </div>
            </div>
          </div>

          {/* On-Time Performance Card */}
          <div style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div className="text-center">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1', marginBottom: '8px' }}>
                {summaryMetrics.onTimeRate}%
              </div>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                On-Time Rate
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Delivery performance
              </div>
            </div>
          </div>

          {/* Route Efficiency Card */}
          <div style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div className="text-center">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#13c2c2', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ThunderboltOutlined style={{ fontSize: '24px' }} />
                {summaryMetrics.averageEfficiency}%
              </div>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                Route Efficiency
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Optimization score
              </div>
            </div>
          </div>

          {/* Cost Savings Card */}
          <div style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div className="text-center">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f759ab', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <DollarOutlined style={{ fontSize: '24px' }} />
                {formatCurrency(summaryMetrics.optimizationSavings)}
              </div>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                Potential Savings
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Through optimization
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routes Section */}
      <div style={{ flex: 1, minHeight: '400px' }}>
        {viewMode === 'cards' ? (
          // Cards View with Drag & Drop
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
              Active & Scheduled Routes - Drag & Drop View
            </h3>
            {dragDropState.isDragging && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#e6f7ff', 
                borderRadius: '6px', 
                marginBottom: '16px',
                border: '1px solid #91d5ff',
                textAlign: 'center' as const,
                fontSize: '14px',
                color: '#1890ff',
                fontWeight: 500
              }}>
                🔄 Drag orders between routes to reorganize deliveries
              </div>
            )}
            {renderRouteCards()}
          </div>
        ) : (
          // Grid View
          <div>
        {/* Search and Filter Bar for Routes */}
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px', 
          backgroundColor: '#fafafa', 
          borderRadius: '6px',
          border: '1px solid #d9d9d9'
        }}>
          {/* Search Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <SearchOutlined style={{ color: '#666' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Search Routes:</span>
            
            <Input
              placeholder="Search by route ID, name, driver, vehicle..."
              value={searchState.routes}
              onChange={(e) => setSearchQuery('routes', e.target.value)}
              style={{ flex: 1, maxWidth: '400px' }}
              allowClear
            />
            
            {searchState.routes && (
              <span style={{ fontSize: '12px', color: '#666' }}>
                {filteredRoutes.length} result{filteredRoutes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {/* Filter Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <FilterOutlined style={{ color: '#666' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Filters:</span>
            
            <Select
              mode="multiple"
              placeholder="Filter by Status"
              style={{ minWidth: 150 }}
              value={activeFilters.routes.status || []}
              onChange={(values: any[]) => setRouteFilters({ status: values })}
              allowClear
              options={[
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Scheduled', value: 'SCHEDULED' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
            />
            
            <Select
              mode="multiple"
              placeholder="Filter by Priority"
              style={{ minWidth: 150 }}
              value={activeFilters.routes.priority || []}
              onChange={(values: string[]) => setRouteFilters({ priority: values })}
              allowClear
              options={[
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' },
              ]}
            />
            
            <Select
              placeholder="Filter by Driver"
              style={{ minWidth: 150 }}
              value={activeFilters.routes.driverId}
              onChange={(value: string | undefined) => setRouteFilters({ driverId: value })}
              allowClear
              options={drivers.map(driver => ({ label: driver.name, value: driver.id }))}
            />
            
            {(activeFilters.routes.status?.length || activeFilters.routes.priority?.length || activeFilters.routes.driverId || searchState.routes) ? (
              <GraviButton 
                buttonText="Clear All"
                appearance="outlined"
                size="small"
                onClick={() => {
                  setRouteFilters({ status: [], priority: [], driverId: undefined });
                  setSearchQuery('routes', '');
                }}
              />
            ) : null}
            
            <span style={{ fontSize: '12px', color: '#666', marginLeft: 'auto' }}>
              Showing {filteredRoutes.length} routes
            </span>
          </div>
          
          {/* Date Range Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e8e8e8' }}>
            <CalendarOutlined style={{ color: '#666' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Date Range:</span>
            
            <DatePicker.RangePicker
              value={[
                dateRangeState.routes.start ? dayjs(dateRangeState.routes.start) : null,
                dateRangeState.routes.end ? dayjs(dateRangeState.routes.end) : null
              ]}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange('routes', {
                    start: dates[0].format('YYYY-MM-DD'),
                    end: dates[1].format('YYYY-MM-DD')
                  });
                } else {
                  setDateRange('routes', {
                    start: new Date().toISOString().split('T')[0],
                    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  });
                }
              }}
              placeholder={['Start Date', 'End Date']}
              format="YYYY-MM-DD"
              allowClear
            />
            
            <span style={{ fontSize: '12px', color: '#666' }}>
              Scheduled routes in selected date range
            </span>
          </div>
        </div>
        
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
          All Routes ({filteredRoutes.length})
        </h3>
        
        <div style={{ height: '500px' }}>
          <GraviGrid
            storageKey="route-management-grid"
            rowData={filteredRoutes}
            columnDefs={columnDefs}
            agPropOverrides={agPropOverrides}
            controlBarProps={controlBarProps}
            updateEP={updateEP}
          />
        </div>
          </div>
        )}
      </div>
    </div>
  );
}