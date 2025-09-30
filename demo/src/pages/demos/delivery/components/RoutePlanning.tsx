import { useMemo, useState, useEffect } from 'react';
import { Horizontal, BBDTag, GraviButton } from '@gravitate-js/excalibrr';
import { Form, Input, Select, TimePicker, Checkbox } from 'antd';
import { DragOutlined, ArrowLeftOutlined, DeleteOutlined, MenuOutlined, PlusOutlined, ThunderboltOutlined, DollarOutlined, ClockCircleOutlined, CarOutlined } from '@ant-design/icons';
import { useDelivery } from '../contexts/DeliveryContext';
import { mockDrivers, mockVehicles, mockOrders } from '../data/delivery.mock-data';
import { MapView } from './MapView';
import { optimizeRoute, calculateRouteCosts, calculateRouteDistance, calculateRouteTime, generateOptimizationRecommendations, checkCapacityConstraints, type Coordinates, type OptimizationResult, type RouteMetrics } from '../utils/route-optimization';
import { formatCurrency, formatDuration, formatDistance } from '../utils/data-mappers';

const { Option } = Select;

interface RoutePlanningProps {
  onBackToRoutes: () => void;
}

export function RoutePlanning({ onBackToRoutes }: RoutePlanningProps) {
  const {
    getAvailableDrivers,
    getAvailableVehicles,
    getUnassignedOrders,
    dragDropState,
    routeBuilderState,
    startDrag,
    endDrag,
    setDragOverTarget,
    addOrderToBuilder,
    removeOrderFromBuilder,
    reorderOrdersInBuilder,
    clearRouteBuilder,
    saveRouteFromBuilder,
    initializeRouteBuilder,
    orders
  } = useDelivery();
  
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [showOptimization, setShowOptimization] = useState(false);
  
  // Initialize route builder on component mount
  useEffect(() => {
    initializeRouteBuilder();
    return () => {
      clearRouteBuilder();
    };
  }, [initializeRouteBuilder, clearRouteBuilder]);

  // Get available drivers and vehicles from context
  const availableDrivers = useMemo(() => getAvailableDrivers(), [getAvailableDrivers]);
  const availableVehicles = useMemo(() => getAvailableVehicles(), [getAvailableVehicles]);

  // Get unassigned orders for route planning
  const unassignedOrders = useMemo(() => 
    getUnassignedOrders().slice(0, 8), 
    [getUnassignedOrders]
  );

  // Bakery location for optimization calculations
  const BAKERY_LOCATION: Coordinates = { lat: 37.7599, lng: -122.4148 };

  // Create coordinate mapping for orders in route builder
  const coordinateMapping = useMemo(() => {
    const mapping: Record<string, Coordinates> = {};
    routeBuilderState.orderIds.forEach((orderId, index) => {
      // Simple coordinate generation based on order ID for demo
      const hash = orderId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      mapping[orderId] = {
        lat: BAKERY_LOCATION.lat + ((hash % 100) * 0.001 - 0.05),
        lng: BAKERY_LOCATION.lng + (((hash * 3) % 100) * 0.001 - 0.05)
      };
    });
    return mapping;
  }, [routeBuilderState.orderIds]);

  // Current route orders
  const routeOrders = useMemo(() => 
    routeBuilderState.orderIds.map(id => orders.find(o => o.id === id)).filter(Boolean) as any[],
    [routeBuilderState.orderIds, orders]
  );

  // Selected vehicle for optimization
  const selectedVehicle = useMemo(() => {
    const vehicleId = form.getFieldValue('vehicleId');
    return availableVehicles.find(v => v.id === vehicleId);
  }, [form, availableVehicles]);

  const handleOrderSelection = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  // Optimization functions
  const handleOptimizeRoute = () => {
    if (routeOrders.length < 2 || !selectedVehicle) {
      return;
    }
    
    const result = optimizeRoute(
      BAKERY_LOCATION,
      routeOrders,
      coordinateMapping,
      selectedVehicle
    );
    
    setOptimizationResult(result);
    setShowOptimization(true);
    
    // Reorder the route builder with optimized order
    result.optimizedOrderIds.forEach((orderId, index) => {
      reorderOrdersInBuilder(routeBuilderState.orderIds.indexOf(orderId), index);
    });
  };

  const calculateCurrentRouteMetrics = (): RouteMetrics | null => {
    if (routeOrders.length === 0) return null;
    
    const distance = calculateRouteDistance(BAKERY_LOCATION, routeOrders, coordinateMapping);
    const time = calculateRouteTime(distance, routeOrders.length);
    
    return calculateRouteCosts(distance, time, routeOrders);
  };

  const currentMetrics = useMemo(() => calculateCurrentRouteMetrics(), [routeOrders, coordinateMapping]);
  
  // Drag and drop handlers (following Formula Manager pattern)
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    console.log('Drag start:', orderId);
    startDrag(orderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    console.log('Drag end');
    endDrag();
  };

  const handleMouseDown = (orderId: string) => {
    setMouseDownTime(Date.now());
  };

  const handleMouseUp = (orderId: string) => {
    const timeDiff = Date.now() - mouseDownTime;
    // Only treat as click if it was a short press and not during drag
    if (timeDiff < 200 && !dragDropState.isDragging) {
      console.log('Click select order:', orderId);
      handleOrderSelection(orderId, !selectedOrders.includes(orderId));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget('route-builder');
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, position?: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Drop order:', dragDropState.draggedOrderId, 'at position:', position);
    
    if (dragDropState.draggedOrderId) {
      addOrderToBuilder(dragDropState.draggedOrderId, position);
    }
    endDrag();
  };
  
  const handleRemoveFromRoute = (orderId: string) => {
    removeOrderFromBuilder(orderId);
  };
  
  const handleReorderInRoute = (fromIndex: number, toIndex: number) => {
    reorderOrdersInBuilder(fromIndex, toIndex);
  };
  
  const handleSaveRoute = async () => {
    const routeId = await saveRouteFromBuilder();
    if (routeId) {
      console.log('Route saved with ID:', routeId);
      onBackToRoutes();
    }
  };
  
  // Get order details for display
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px' }}>
      
      {/* Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <GraviButton 
          buttonText="← Back to Routes"
          appearance="outlined"
          size="small"
          onClick={onBackToRoutes}
        />
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
          Create New Route
        </h1>
      </div>
      
      {/* CSS Styles */}
      <style>{`
        .order-item.draggable {
          cursor: grab !important;
          transition: all 0.2s ease;
          user-select: none;
        }
        .order-item.dragging {
          cursor: grabbing !important;
          transform: rotate(2deg);
          opacity: 0.7;
          z-index: 1000;
          position: relative;
          user-select: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .drop-zone.active {
          background: #e6f7ff;
          border: 2px dashed #1890ff;
        }
        .order-item.draggable:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .route-stop {
          transition: all 0.2s ease;
        }
        .route-stop:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }
      `}</style>
      
      {/* Main Content Area - Three Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', flex: 1 }}>
        
        {/* Left Column: Available Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Available Orders List */}
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>
              Available Orders ({unassignedOrders.length})
            </h3>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
              Drag orders to route builder →
            </div>
            
            <div style={{
              height: '500px',
              overflowY: 'auto',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              {unassignedOrders.map((order, index) => {
                const isDragging = dragDropState.draggedOrderId === order.id;
                return (
                  <div
                    key={order.id}
                    className={`order-item draggable ${isDragging ? 'dragging' : ''}`}
                    style={{
                      padding: '12px',
                      borderBottom: index < unassignedOrders.length - 1 ? '1px solid #f0f0f0' : 'none',
                      display: isDragging ? 'none' : 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'grab',
                      transition: 'all 0.2s ease',
                      userSelect: 'none'
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, order.id)}
                    onDragEnd={handleDragEnd}
                    onMouseDown={() => handleMouseDown(order.id)}
                    onMouseUp={() => handleMouseUp(order.id)}
                  >
                    <DragOutlined style={{ color: '#999', fontSize: '14px' }} />
                    
                    <Checkbox 
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleOrderSelection(order.id, e.target.checked);
                      }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                          {order.id} - {order.customerName}
                        </span>
                        <BBDTag style={{ 
                          color: order.priority === 'URGENT' ? '#ff4d4f' : 
                                order.priority === 'HIGH' ? '#fa8c16' :
                                order.priority === 'MEDIUM' ? '#1890ff' : '#52c41a',
                          backgroundColor: order.priority === 'URGENT' ? '#fff2f0' : 
                                          order.priority === 'HIGH' ? '#fff7e6' :
                                          order.priority === 'MEDIUM' ? '#e6f7ff' : '#f6ffed',
                          width: 'fit-content',
                          fontSize: '10px'
                        }}>
                          {order.priority}
                        </BBDTag>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        📍 {order.deliveryAddress}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        ⏰ {order.timeWindow.start} - {order.timeWindow.end}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle Column: Route Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>
            Route Builder ({routeBuilderState.orderIds.length} stops)
          </h3>
          
          {/* Drop Zone */}
          <div 
            style={{
              height: '500px',
              border: dragDropState.dragOverTarget === 'route-builder' ? '2px dashed #1890ff' : '2px dashed #d9d9d9',
              borderRadius: '8px',
              backgroundColor: dragDropState.dragOverTarget === 'route-builder' ? '#e6f7ff' : '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e)}
          >
            {routeBuilderState.orderIds.length === 0 ? (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                color: '#999'
              }}>
                <PlusOutlined style={{ fontSize: '32px' }} />
                <div style={{ fontSize: '16px', fontWeight: 500 }}>
                  Drop orders here to build route
                </div>
                <div style={{ fontSize: '12px', textAlign: 'center' }}>
                  Drag orders from the left panel to create your delivery route
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {routeBuilderState.orderIds.map((orderId, index) => {
                  const order = getOrderById(orderId);
                  if (!order) return null;
                  
                  return (
                    <div
                      key={orderId}
                      className="route-stop"
                      style={{
                        padding: '12px',
                        marginBottom: '8px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '6px',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ 
                        backgroundColor: '#1890ff',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </div>
                      
                      <MenuOutlined style={{ color: '#999', cursor: 'move' }} />
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '2px' }}>
                          {order.id} - {order.customerName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          📍 {order.deliveryAddress}
                        </div>
                      </div>
                      
                      <BBDTag style={{ 
                        color: order.priority === 'URGENT' ? '#ff4d4f' : 
                              order.priority === 'HIGH' ? '#fa8c16' :
                              order.priority === 'MEDIUM' ? '#1890ff' : '#52c41a',
                        backgroundColor: order.priority === 'URGENT' ? '#fff2f0' : 
                                        order.priority === 'HIGH' ? '#fff7e6' :
                                        order.priority === 'MEDIUM' ? '#e6f7ff' : '#f6ffed',
                        width: 'fit-content',
                        fontSize: '10px'
                      }}>
                        {order.priority}
                      </BBDTag>
                      
                      <DeleteOutlined 
                        style={{ 
                          color: '#ff4d4f', 
                          cursor: 'pointer', 
                          padding: '4px',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => handleRemoveFromRoute(orderId)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fff2f0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid #e8e8e8', paddingTop: '16px' }}>
              <GraviButton 
                buttonText="Save Route"
                theme1
                size="small"
                onClick={handleSaveRoute}
                disabled={routeBuilderState.orderIds.length === 0}
              />
              <GraviButton 
                buttonText="Clear All"
                appearance="outlined"
                size="small"
                onClick={clearRouteBuilder}
                disabled={routeBuilderState.orderIds.length === 0}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Route Form + Optimization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Route Details Form */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
              Route Configuration
            </h3>
            
            <div style={{
              padding: '16px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <Form form={form} layout="vertical" requiredMark={false} size="small">
                <Form.Item label="Route Name" name="routeName">
                  <Input placeholder="Enter route name" />
                </Form.Item>
                
                <Form.Item label="Priority Level" name="priority">
                  <Select placeholder="Select priority">
                    <Option value="high">High Priority</Option>
                    <Option value="medium">Medium Priority</Option>
                    <Option value="low">Low Priority</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item label="Assigned Driver" name="driverId">
                  <Select 
                    placeholder="Select driver"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase()?.includes(input.toLowerCase())
                    }
                    notFoundContent={availableDrivers.length === 0 ? "No drivers available" : "No matching drivers"}
                  >
                    {availableDrivers.map(driver => (
                      <Option key={driver.id} value={driver.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{driver.name}</span>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <BBDTag style={{ 
                              fontSize: '10px',
                              color: driver.status === 'AVAILABLE' ? '#52c41a' : '#fa8c16',
                              backgroundColor: driver.status === 'AVAILABLE' ? '#f6ffed' : '#fff7e6',
                              width: 'fit-content',
                              margin: 0
                            }}>
                              {driver.status}
                            </BBDTag>
                            <span style={{ fontSize: '10px', color: '#666' }}>⭐{driver.rating}</span>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item label="Vehicle" name="vehicleId">
                  <Select 
                    placeholder="Select vehicle"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase()?.includes(input.toLowerCase())
                    }
                    notFoundContent={availableVehicles.length === 0 ? "No vehicles available" : "No matching vehicles"}
                  >
                    {availableVehicles.map(vehicle => (
                      <Option key={vehicle.id} value={vehicle.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{vehicle.name}</span>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <BBDTag style={{ 
                              fontSize: '10px',
                              color: vehicle.type === 'TRUCK' ? '#722ed1' : vehicle.type === 'VAN' ? '#1890ff' : '#52c41a',
                              backgroundColor: vehicle.type === 'TRUCK' ? '#f9f0ff' : vehicle.type === 'VAN' ? '#e6f7ff' : '#f6ffed',
                              width: 'fit-content',
                              margin: 0
                            }}>
                              {vehicle.type}
                            </BBDTag>
                            <span style={{ fontSize: '10px', color: '#666' }}>{vehicle.capacity}lbs</span>
                            {vehicle.hasRefrigeration && (
                              <span style={{ fontSize: '10px', color: '#1890ff' }}>❄️</span>
                            )}
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Form.Item label="Start Time" name="startTime">
                    <TimePicker 
                      format="HH:mm" 
                      placeholder="Start time"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  
                  <Form.Item label="End Time" name="endTime">
                    <TimePicker 
                      format="HH:mm" 
                      placeholder="End time"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>

          {/* Optimization Panel */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
              Route Optimization
            </h3>
            
            <div style={{
              padding: '16px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              {routeBuilderState.orderIds.length > 1 && selectedVehicle ? (
                <div>
                  {/* Current Metrics */}
                  {currentMetrics && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
                        Current Route Metrics
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <ClockCircleOutlined />
                            {formatDuration(currentMetrics.time)}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Total Time</div>
                        </div>
                        
                        <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <CarOutlined />
                            {formatDistance(currentMetrics.distance)}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Distance</div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <DollarOutlined />
                            {formatCurrency(currentMetrics.cost)}
                          </div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Total Cost</div>
                        </div>
                        
                        <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ed1' }}>
                            {routeOrders.reduce((sum, order) => sum + order.totalWeight, 0)}lbs
                          </div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Total Weight</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optimization Results */}
                  {showOptimization && optimizationResult && (
                    <div style={{ 
                      marginBottom: '16px', 
                      padding: '12px', 
                      backgroundColor: '#e6f7ff', 
                      borderRadius: '6px',
                      border: '1px solid #91d5ff'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1890ff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ThunderboltOutlined />
                        Optimization Results
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                            -{formatDistance(optimizationResult.savings.distanceSaved)}
                          </div>
                          <div style={{ fontSize: '10px', color: '#666' }}>Distance Saved</div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                            -{formatDuration(optimizationResult.savings.timeSaved)}
                          </div>
                          <div style={{ fontSize: '10px', color: '#666' }}>Time Saved</div>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fa8c16' }}>
                            -{formatCurrency(optimizationResult.savings.costSaved)}
                          </div>
                          <div style={{ fontSize: '10px', color: '#666' }}>Cost Saved</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', marginTop: '8px' }}>
                        <BBDTag style={{
                          color: optimizationResult.efficiency >= 90 ? '#52c41a' : 
                                optimizationResult.efficiency >= 75 ? '#1890ff' : '#fa8c16',
                          backgroundColor: optimizationResult.efficiency >= 90 ? '#f6ffed' : 
                                          optimizationResult.efficiency >= 75 ? '#e6f7ff' : '#fff7e6',
                          fontSize: '12px'
                        }}>
                          Efficiency: {optimizationResult.efficiency}%
                        </BBDTag>
                      </div>

                      {optimizationResult.warnings.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#fa8c16', marginBottom: '4px' }}>
                            ⚠️ Warnings:
                          </div>
                          {optimizationResult.warnings.map((warning, index) => (
                            <div key={index} style={{ fontSize: '11px', color: '#fa8c16' }}>
                              • {warning}
                            </div>
                          ))}
                        </div>
                      )}

                      {(() => {
                        const recommendations = generateOptimizationRecommendations(optimizationResult, routeBuilderState.orderIds);
                        return recommendations.length > 0 ? (
                          <div style={{ marginTop: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1890ff', marginBottom: '4px' }}>
                              💡 Recommendations:
                            </div>
                            {recommendations.slice(0, 2).map((rec: string, index: number) => (
                              <div key={index} style={{ fontSize: '11px', color: '#1890ff' }}>
                                • {rec}
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                  
                  {/* Optimization Controls */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <GraviButton 
                      buttonText="🚀 Optimize Route"
                      theme1
                      size="small"
                      onClick={handleOptimizeRoute}
                      disabled={!selectedVehicle || routeOrders.length < 2}
                    />
                    {showOptimization && (
                      <GraviButton 
                        buttonText="Reset"
                        appearance="outlined"
                        size="small"
                        onClick={() => setShowOptimization(false)}
                      />
                    )}
                  </div>

                  {/* Capacity Check */}
                  {selectedVehicle && (
                    <div style={{ 
                      padding: '8px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                        Vehicle Capacity Check
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>
                          {routeOrders.reduce((sum, order) => sum + order.totalWeight, 0)}lbs / {selectedVehicle.capacity}lbs
                        </span>
                        <BBDTag style={{
                          color: routeOrders.reduce((sum, order) => sum + order.totalWeight, 0) <= selectedVehicle.capacity ? '#52c41a' : '#ff4d4f',
                          backgroundColor: routeOrders.reduce((sum, order) => sum + order.totalWeight, 0) <= selectedVehicle.capacity ? '#f6ffed' : '#fff2f0',
                          fontSize: '10px'
                        }}>
                          {routeOrders.reduce((sum, order) => sum + order.totalWeight, 0) <= selectedVehicle.capacity ? 'OK' : 'OVERWEIGHT'}
                        </BBDTag>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    {routeBuilderState.orderIds.length === 0 ? 'No orders in route' : 
                     routeBuilderState.orderIds.length === 1 ? 'Need 2+ orders to optimize' :
                     'Select a vehicle to see optimization'}
                  </div>
                  <div style={{ fontSize: '12px' }}>
                    {routeBuilderState.orderIds.length === 0 ? 'Add orders to see optimization metrics' :
                     routeBuilderState.orderIds.length === 1 ? 'Add more orders for route optimization' :
                     'Choose a vehicle in the configuration above'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Route Preview */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#333' }}>
              Route Preview {routeBuilderState.orderIds.length > 0 && `(${routeBuilderState.orderIds.length} stops)`}
            </h3>
            
            <div style={{
              height: '300px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {routeBuilderState.orderIds.length > 0 ? (
                <MapView 
                  height="100%" 
                  showControls={false}
                  showLegend={false}
                  showDrivers={false}
                  showClusters={false}
                />
              ) : (
                <div style={{
                  height: '100%',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '32px', color: '#d9d9d9' }}>🗺️</div>
                  <div style={{ fontSize: '14px', color: '#999' }}>Route preview</div>
                  <div style={{ fontSize: '12px', color: '#ccc' }}>Add orders to see route on map</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}