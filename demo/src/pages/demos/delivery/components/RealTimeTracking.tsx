import { useState } from 'react';
import { BBDTag, GraviButton, Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';
import { PhoneOutlined, MessageOutlined, MailOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { mockRoutes, mockDrivers, mockVehicles, mockOrders, mockCommunications, CommunicationEntry } from '../data/delivery.mock-data';
import { MapView } from './MapView';

export function RealTimeTracking() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-001');

  // Get active routes only
  const activeRoutes = mockRoutes.filter(route => route.status === 'ACTIVE');

  // Get selected order details
  const selectedOrder = mockOrders.find(order => order.id === selectedOrderId);
  
  // Get communications for selected order
  const orderCommunications = mockCommunications
    .filter(comm => comm.orderId === selectedOrderId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Get route status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { color: '#52c41a', backgroundColor: '#f6ffed' };
      case 'DELAYED':
        return { color: '#fa8c16', backgroundColor: '#fff7e6' };
      case 'ON_TIME':
        return { color: '#1890ff', backgroundColor: '#e6f7ff' };
      default:
        return { color: '#666', backgroundColor: '#f5f5f5' };
    }
  };

  // Get communication type icon and color
  const getCommunicationIcon = (type: string, direction: string) => {
    const iconStyle = { 
      fontSize: '14px', 
      color: direction === 'INBOUND' ? '#52c41a' : direction === 'OUTBOUND' ? '#1890ff' : '#666' 
    };
    
    switch (type) {
      case 'SMS': return <MessageOutlined style={iconStyle} />;
      case 'CALL': return <PhoneOutlined style={iconStyle} />;
      case 'EMAIL': return <MailOutlined style={iconStyle} />;
      case 'SYSTEM': return <ClockCircleOutlined style={iconStyle} />;
      case 'DRIVER_UPDATE': return <EnvironmentOutlined style={iconStyle} />;
      default: return <MessageOutlined style={iconStyle} />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ height: 'calc(100vh - 200px)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      

      {/* Three Column Layout - 20-60-20 */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, height: 'calc(100vh - 300px)' }}>
        
        {/* Left Column: Active Routes - 20% */}
        <Vertical gap={16} style={{ flex: '0 0 20%', minWidth: '280px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              Active Routes ({activeRoutes.length})
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {activeRoutes.map((route) => {
              const driver = mockDrivers.find(d => d.id === route.driverId);
              const vehicle = mockVehicles.find(v => v.id === route.vehicleId);
              const progressPercent = Math.round((route.progress.completed / route.progress.total) * 100);
              const nextOrder = mockOrders.find(order => 
                route.orderIds.includes(order.id) && order.status !== 'DELIVERED'
              );
              
              return (
                <div
                  key={route.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => nextOrder && setSelectedOrderId(nextOrder.id)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Route Header */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                          {route.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: '#52c41a',
                            animation: 'pulse 2s infinite'
                          }} />
                          <BBDTag style={{ 
                            ...getStatusColor('ACTIVE'),
                            fontSize: '10px',
                            width: 'fit-content'
                          }}>
                            LIVE
                          </BBDTag>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {driver?.name} • {vehicle?.name}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#666' }}>Progress</span>
                        <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>
                          {route.progress.completed}/{route.progress.total} ({progressPercent}%)
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progressPercent}%`,
                          height: '100%',
                          backgroundColor: '#52c41a',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    {/* Next Stop */}
                    {nextOrder && (
                      <div style={{ 
                        padding: '8px',
                        backgroundColor: '#f6ffed',
                        borderRadius: '4px',
                        border: '1px solid #b7eb8f'
                      }}>
                        <div style={{ fontSize: '11px', color: '#389e0d', fontWeight: 500, marginBottom: '2px' }}>
                          NEXT STOP
                        </div>
                        <div style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>
                          {nextOrder.customerName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          📍 {nextOrder.deliveryAddress}
                        </div>
                      </div>
                    )}

                    {/* ETA */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        ETA: 25 min
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {route.totalDistance} mi
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Vertical>

        {/* Center Column: Map - 60% */}
        <Vertical gap={16} style={{ flex: '1 1 60%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              Live Route Map
            </h2>
            <div style={{ height: '1px', backgroundColor: '#d9d9d9', width: '100%' }} />
          </div>
          
          <div style={{
            flex: 1,
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <MapView 
              height="100%" 
              showControls={true}
              showDrivers={true}
              showClusters={false}
            />
          </div>
        </Vertical>

        {/* Right Column: Order Details & Communications - 20% */}
        <Vertical gap={16} style={{ flex: '0 0 20%', minWidth: '320px' }}>
          
          {/* Order Details Panel */}
          <Vertical gap={12}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                Order Details
              </h2>
            </div>
            
            {selectedOrder && (
              <div style={{
                padding: '16px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                backgroundColor: '#fff'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Order Header */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                        {selectedOrder.id}
                      </div>
                      <BBDTag style={{
                        color: selectedOrder.priority === 'URGENT' ? '#ff4d4f' : 
                               selectedOrder.priority === 'HIGH' ? '#fa8c16' :
                               selectedOrder.priority === 'MEDIUM' ? '#1890ff' : '#52c41a',
                        backgroundColor: selectedOrder.priority === 'URGENT' ? '#fff2f0' : 
                                        selectedOrder.priority === 'HIGH' ? '#fff7e6' :
                                        selectedOrder.priority === 'MEDIUM' ? '#e6f7ff' : '#f6ffed',
                        fontSize: '10px',
                        width: 'fit-content'
                      }}>
                        {selectedOrder.priority}
                      </BBDTag>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>
                      {selectedOrder.customerName}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <div style={{ marginBottom: '4px' }}>
                      📍 {selectedOrder.deliveryAddress}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      📞 {selectedOrder.phone}
                    </div>
                    <div>
                      ⏰ {selectedOrder.timeWindow.start} - {selectedOrder.timeWindow.end}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: '#333', marginBottom: '6px' }}>
                      Items ({selectedOrder.products.length}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {selectedOrder.products.map((product, index) => (
                        <div key={index} style={{ fontSize: '11px', color: '#666' }}>
                          • {product.quantity}x {product.name} ({product.weight} lbs)
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {selectedOrder.specialInstructions && (
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f6f6f6',
                      borderRadius: '4px',
                      borderLeft: '3px solid #1890ff'
                    }}>
                      <div style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500, marginBottom: '2px' }}>
                        SPECIAL INSTRUCTIONS
                      </div>
                      <div style={{ fontSize: '11px', color: '#333' }}>
                        {selectedOrder.specialInstructions}
                      </div>
                    </div>
                  )}

                  {/* Order Value */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>Total Value:</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                      ${selectedOrder.value.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Vertical>

          {/* Communication Log */}
          <Vertical gap={12} style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                  Communications
                </h2>
                <GraviButton 
                  buttonText="Send Message"
                  size="small"
                  appearance="outlined"
                />
              </div>
              <div style={{ height: '1px', backgroundColor: '#d9d9d9', width: '100%' }} />
            </div>
            
            <div style={{
              flex: 1,
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                padding: '12px',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '12px',
                color: '#666',
                backgroundColor: '#fafafa'
              }}>
                Communication History ({orderCommunications.length})
              </div>
              
              <div style={{ 
                flex: 1, 
                overflowY: 'auto',
                padding: '8px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {orderCommunications.map((comm) => (
                    <div
                      key={comm.id}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        backgroundColor: comm.direction === 'INBOUND' ? '#f6ffed' : '#e6f7ff',
                        border: `1px solid ${comm.direction === 'INBOUND' ? '#b7eb8f' : '#91d5ff'}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {getCommunicationIcon(comm.type, comm.direction)}
                          <span style={{ fontSize: '11px', fontWeight: 500, color: '#333' }}>
                            {comm.type}
                          </span>
                          <BBDTag style={{
                            fontSize: '9px',
                            color: comm.direction === 'INBOUND' ? '#52c41a' : '#1890ff',
                            backgroundColor: 'transparent',
                            width: 'fit-content'
                          }}>
                            {comm.direction}
                          </BBDTag>
                        </div>
                        <span style={{ fontSize: '10px', color: '#666' }}>
                          {formatTime(comm.timestamp)}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.4' }}>
                        {comm.message}
                      </div>
                      
                      {comm.sender && comm.sender !== 'System' && (
                        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                          From: {comm.sender}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Vertical>
        </Vertical>
      </div>
    </div>
  );
}