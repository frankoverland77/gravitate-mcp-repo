import { useMemo } from 'react';
import { Select, Dropdown, Menu, Button, Modal, Input, Row, Col } from 'antd';
import { FilterOutlined, ClearOutlined, DownOutlined, PlusOutlined, CloseOutlined, SearchOutlined, DragOutlined } from '@ant-design/icons';
import { GraviGrid, Horizontal, BBDTag, GraviButton } from '@gravitate-js/excalibrr';
import { useDelivery } from '../contexts/DeliveryContext';
import { OrderStatus, OrderPriority } from '../types/delivery.types';
import {
  getOrderStatusColor,
  getOrderPriorityColor,
  formatCurrency,
  formatWeight,
  formatTimeWindow,
  generateBatchSuggestions,
  getEfficiencyBadge
} from '../utils/data-mappers';

export function OrderQueue() {
  const { 
    orders, 
    selectedOrders, 
    selectOrders, 
    clearSelectedOrders,
    getUnassignedOrders,
    applyBatchSuggestion,
    createBatchFromSelectedOrders,
    activeFilters,
    setOrderFilters,
    getFilteredOrders,
    uiPreferences,
    openModal,
    closeModal,
    searchState,
    setSearchQuery,
    sortState,
    setSortConfig,
    dragDropState,
    startDrag,
    endDrag,
    setDragOverTarget,
    addOrderToBuilder
  } = useDelivery();
  
  // Use filtered orders if any filters are applied, otherwise show unassigned orders
  const displayOrders = useMemo(() => {
    const hasFilters = Object.keys(activeFilters.orders).some(key => {
      const filterValue = activeFilters.orders[key as keyof typeof activeFilters.orders];
      return Array.isArray(filterValue) ? filterValue.length > 0 : !!filterValue;
    });
    
    if (hasFilters) {
      return getFilteredOrders();
    }
    return getUnassignedOrders();
  }, [orders, activeFilters.orders, getFilteredOrders, getUnassignedOrders]);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    console.log('Drag start from OrderQueue:', orderId);
    startDrag(orderId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('Drag end from OrderQueue');
    endDrag();
  };

  const columnDefs = useMemo(() => [
    {
      field: "dragHandle",
      headerName: "",
      width: 40,
      cellRenderer: (params: any) => (
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, params.data.id)}
          onDragEnd={handleDragEnd}
          className={`drag-handle ${dragDropState.draggedOrderId === params.data.id ? 'dragging' : ''}`}
          style={{
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontSize: '12px'
          }}
          title="Drag to route builder"
        >
          <DragOutlined />
        </div>
      ),
      suppressSizeToFit: true,
      resizable: false,
      sortable: false
    },
    {
      field: "id",
      headerName: "Order ID",
      width: 90,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      sortable: true
    },
    {
      field: "customerName",
      headerName: "Customer",
      width: 180,
      resizable: true,
      sortable: true
    },
    {
      field: "deliveryAddress",
      headerName: "Delivery Address",
      width: 220,
      resizable: true,
      sortable: true
    },
    {
      field: "timeWindow",
      headerName: "Time Window",
      width: 140,
      sortable: true,
      cellRenderer: (params: any) => 
        formatTimeWindow(params.value.start, params.value.end)
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => {
        const style = getOrderPriorityColor(params.value);
        return (
          <BBDTag style={{ ...style, width: 'fit-content' }}>
            {params.value}
          </BBDTag>
        );
      }
    },
    {
      field: "totalWeight",
      headerName: "Weight (lbs)",
      width: 120,
      sortable: true,
      cellRenderer: (params: any) => formatWeight(params.value)
    },
    {
      field: "value",
      headerName: "Value",
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => formatCurrency(params.value)
    },
    {
      field: "specialInstructions",
      headerName: "Special Instructions",
      width: 200,
      resizable: true,
      cellRenderer: (params: any) => 
        params.value ? params.value.substring(0, 50) + '...' : '-'
    }
  ], [handleDragStart, handleDragEnd]);

  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.id,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    onSelectionChanged: (event: any) => {
      const selectedRows = event.api.getSelectedRows();
      const orderIds = selectedRows.map((row: any) => row.id);
      selectOrders(orderIds);
      console.log('Selected orders:', selectedRows.length, orderIds);
    },
    // Enable sorting functionality
    onSortChanged: (event: any) => {
      const sortModel = event.api.getSortModel();
      if (sortModel.length > 0) {
        const { colId, sort } = sortModel[0];
        setSortConfig('orders', {
          field: colId,
          direction: sort as 'asc' | 'desc'
        });
      } else {
        setSortConfig('orders', null);
      }
    },
    // Set selected rows based on context state
    onGridReady: (params: any) => {
      const nodesToSelect: any[] = [];
      params.api.forEachNode((node: any) => {
        if (selectedOrders.orderIds.includes(node.data.id)) {
          nodesToSelect.push(node);
        }
      });
      if (nodesToSelect.length > 0) {
        params.api.setNodesSelected(nodesToSelect, true);
      }
    }
  }), [selectedOrders.orderIds, selectOrders, setSortConfig]);

  const controlBarProps = useMemo(() => ({
    title: 'Unassigned Orders - Order Queue',
    hideActiveFilters: false,
  }), []);

  const updateEP = async (params: any) => {
    console.log('Update called with:', params);
    return Promise.resolve();
  };

  const batchSuggestions = useMemo(() => 
    generateBatchSuggestions(orders), 
    [orders]
  );

  // Batch suggestion drag handlers
  const handleBatchDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleBatchDrop = (e: React.DragEvent, batch: any) => {
    e.preventDefault();
    if (dragDropState.draggedOrderId) {
      console.log('Creating route from batch with dragged order:', dragDropState.draggedOrderId);
      // Apply the batch suggestion and add the dragged order
      applyBatchSuggestion(batch);
      // Add the dragged order to the route builder
      addOrderToBuilder(dragDropState.draggedOrderId);
      openModal('routeCreation');
    }
    endDrag();
  };

  return (
    <Horizontal style={{ height: '100%', gap: 16 }}>
      <div style={{ flex: 2 }}>
        
        <GraviGrid
          storageKey="order-queue-grid"
          rowData={displayOrders}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          updateEP={updateEP}
        />
      </div>

      <div style={{ width: 350, padding: '0 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Selection Status */}
          {selectedOrders.orderIds.length > 0 && (
            <div style={{
              padding: '12px',
              backgroundColor: '#e6f7ff',
              borderRadius: '6px',
              border: '1px solid #91d5ff'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1890ff', marginBottom: '4px' }}>
                📋 {selectedOrders.orderIds.length} Orders Selected
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <GraviButton 
                  buttonText="Create Route"
                  theme1
                  size="small"
                  onClick={() => openModal('routeCreation')}
                />
                <GraviButton 
                  buttonText="Clear Selection"
                  appearance="outlined"
                  size="small"
                  onClick={clearSelectedOrders}
                />
              </div>
            </div>
          )}
          
          {/* Quick Route Creation Drop Zone */}
          {dragDropState.isDragging && (
            <div 
              onDragOver={handleBatchDragOver}
              onDrop={(e) => {
                e.preventDefault();
                if (dragDropState.draggedOrderId) {
                  console.log('Creating quick route with order:', dragDropState.draggedOrderId);
                  addOrderToBuilder(dragDropState.draggedOrderId);
                  openModal('routeCreation');
                }
                endDrag();
              }}
              style={{
                padding: '20px',
                border: '3px dashed #52c41a',
                borderRadius: '8px',
                backgroundColor: '#f6ffed',
                textAlign: 'center' as const,
                transition: 'all 0.2s ease',
                cursor: 'copy'
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#52c41a', marginBottom: '8px' }}>
                🚚 Quick Route Creation
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Drop order here to start a new route
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              Batch Suggestions
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {batchSuggestions.map((batch, index) => (
              <div 
                key={index}
                onDragOver={handleBatchDragOver}
                onDrop={(e) => handleBatchDrop(e, batch)}
                className={`batch-suggestion drop-zone ${dragDropState.isDragging ? 'drag-over' : ''}`}
                style={{ 
                  padding: '16px', 
                  border: dragDropState.isDragging ? '2px dashed #1890ff' : '1px solid #d9d9d9', 
                  borderRadius: '6px', 
                  backgroundColor: dragDropState.isDragging ? '#f0f8ff' : '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: 'fit-content',
                  cursor: dragDropState.isDragging ? 'copy' : 'default'
                }}
                title={dragDropState.isDragging ? 'Drop order here to create route with this batch' : ''}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', flex: 1 }}>
                    {batch.title}
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <BBDTag style={{ 
                      ...getEfficiencyBadge(batch.efficiency),
                      width: 'fit-content',
                      display: 'inline-block'
                    }}>
                      {batch.efficiency}
                    </BBDTag>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Orders:</strong> {batch.orders.join(', ')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Est. Time:</strong> {batch.estimatedTime}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Distance:</strong> {batch.totalDistance}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <GraviButton 
                    buttonText="Select Orders"
                    appearance="outlined"
                    size="small"
                    style={{ flexShrink: 0 }}
                    onClick={() => applyBatchSuggestion(batch)}
                  />
                  <GraviButton 
                    buttonText="Create Route"
                    theme1
                    size="small"
                    style={{ flexShrink: 0 }}
                    onClick={() => {
                      applyBatchSuggestion(batch);
                      openModal('routeCreation');
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route Creation Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusOutlined style={{ color: '#1890ff' }} />
            <span>Create New Route</span>
          </div>
        }
        open={uiPreferences.modals?.routeCreation || false}
        onCancel={() => closeModal('routeCreation')}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => closeModal('routeCreation')}>
            Cancel
          </Button>,
          <Button 
            key="create" 
            type="primary" 
            onClick={() => {
              const batchId = createBatchFromSelectedOrders();
              console.log('Created route with ID:', batchId);
              closeModal('routeCreation');
            }}
            disabled={selectedOrders.orderIds.length === 0}
          >
            Create Route ({selectedOrders.orderIds.length} orders)
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Route Name
            </label>
            <Input 
              placeholder="Enter route name (e.g., Morning Downtown)"
              defaultValue={`Route ${new Date().toLocaleDateString()}`}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Selected Orders ({selectedOrders.orderIds.length})
            </label>
            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              padding: '8px'
            }}>
              {selectedOrders.orderIds.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  No orders selected. Please select orders from the grid above.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedOrders.orderIds.map((orderId) => {
                    const order = orders.find(o => o.id === orderId);
                    return order ? (
                      <div key={orderId} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px'
                      }}>
                        <span style={{ fontSize: '12px' }}>
                          <strong>{order.id}</strong> - {order.customerName}
                        </span>
                        <span style={{ fontSize: '11px', color: '#666' }}>
                          {order.deliveryAddress}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Estimated Duration
              </label>
              <Input 
                placeholder="4 hours 30 minutes"
                defaultValue="4 hours 30 minutes"
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </Col>
            <Col span={12}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Total Distance
              </label>
              <Input 
                placeholder="45.2 miles"
                defaultValue="45.2 miles"
                disabled
                style={{ backgroundColor: '#f5f5f5' }}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </Horizontal>
  );
}