import { useMemo } from 'react';
import { GraviGrid, Horizontal, BBDTag, GraviButton } from '@gravitate-js/excalibrr';
import { Popover, Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useDelivery } from '../contexts/DeliveryContext';
import { mockDrivers, mockVehicles, mockShifts } from '../data/delivery.mock-data';
import {
  getDriverStatusColor,
  getVehicleStatusColor,
  getVehicleTypeColor,
  formatWeight,
  formatPercentage,
  formatDate,
  calculateUtilizationRate,
  getFuelLevelColor
} from '../utils/data-mappers';

export function DriverManagement() {
  const {
    drivers,
    vehicles,
    getFilteredDrivers,
    getFilteredVehicles,
    searchState,
    setSearchQuery,
    sortState,
    setSortConfig,
    activeFilters,
    setDriverFilters,
    setVehicleFilters
  } = useDelivery();

  // Get unassigned drivers (not in any shift)
  const getUnassignedDrivers = () => {
    const assignedDriverIds = mockShifts.flatMap(shift => shift.driverIds);
    return drivers.filter(driver => !assignedDriverIds.includes(driver.id));
  };
  
  // Get filtered vehicles for the grid
  const filteredVehicles = useMemo(() => getFilteredVehicles(), [getFilteredVehicles]);

  // Create driver popover content  
  const getDriverPopoverContent = (driver: any) => (
    <div style={{ width: '250px', padding: '8px' }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
          {driver.name}
        </div>
        <BBDTag style={{ 
          ...getDriverStatusColor(driver.status),
          width: 'fit-content'
        }}>
          {driver.status.replace('_', ' ')}
        </BBDTag>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>ID:</strong> {driver.id}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>Phone:</strong> {driver.phone}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>Vehicle:</strong> {driver.vehicleId}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>Rating:</strong> ⭐ {driver.rating}/5.0
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>Total Deliveries:</strong> {driver.totalDeliveries}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>On-Time Rate:</strong> {driver.onTimeRate}%
        </div>
      </div>
    </div>
  );


  // Vehicle grid columns
  const vehicleColumnDefs = useMemo(() => [
    {
      field: "id",
      headerName: "Vehicle ID",
      width: 100,
      sortable: true
    },
    {
      field: "name",
      headerName: "Vehicle Name",
      width: 180,
      resizable: true,
      sortable: true
    },
    {
      field: "type",
      headerName: "Type",
      width: 80,
      sortable: true,
      cellRenderer: (params: any) => (
        <BBDTag style={{ 
          ...getVehicleTypeColor(params.value),
          width: 'fit-content' 
        }}>
          {params.value}
        </BBDTag>
      )
    },
    {
      field: "capacity",
      headerName: "Capacity",
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => formatWeight(params.value)
    },
    {
      field: "currentLoad",
      headerName: "Current Load",
      width: 120,
      sortable: true,
      cellRenderer: (params: any) => formatWeight(params.value)
    },
    {
      field: "utilizationRate",
      headerName: "Utilization",
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => {
        const rate = calculateUtilizationRate(params.data.currentLoad, params.data.capacity);
        return formatPercentage(rate);
      }
    },
    {
      field: "fuelLevel",
      headerName: "Fuel Level",
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => {
        const fuelColor = getFuelLevelColor(params.value);
        return (
          <span style={{ color: fuelColor, fontWeight: 'bold' }}>
            {params.value}%
          </span>
        );
      }
    },
    {
      field: "hasRefrigeration",
      headerName: "Refrigeration",
      width: 120,
      sortable: true,
      cellRenderer: (params: any) => (
        <BBDTag style={{ 
          color: params.value ? '#52c41a' : '#666',
          backgroundColor: params.value ? '#f6ffed' : '#f5f5f5',
          width: 'fit-content' 
        }}>
          {params.value ? 'Yes' : 'No'}
        </BBDTag>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: true,
      cellRenderer: (params: any) => {
        const statusColor = getVehicleStatusColor(params.value);
        return (
          <BBDTag style={{ 
            ...statusColor,
            width: 'fit-content' 
          }}>
            {params.value.replace('_', ' ')}
          </BBDTag>
        );
      }
    },
    {
      field: "lastServiceDate",
      headerName: "Last Service",
      width: 120,
      sortable: true,
      cellRenderer: (params: any) => formatDate(params.value)
    }
  ], []);

  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.id,
    // Enable sorting functionality for vehicles
    onSortChanged: (event: any) => {
      const sortModel = event.api.getSortModel();
      if (sortModel.length > 0) {
        const { colId, sort } = sortModel[0];
        setSortConfig('vehicles', {
          field: colId,
          direction: sort as 'asc' | 'desc'
        });
      } else {
        setSortConfig('vehicles', null);
      }
    },
  }), [setSortConfig]);

  const controlBarProps = useMemo(() => ({
    title: 'Vehicle Fleet - Capacity & Status',
    hideActiveFilters: false,
  }), []);

  const updateEP = async (params: any) => {
    console.log('Update called with:', params);
    return Promise.resolve();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px' }}>
      
      {/* Shift Schedule Display */}
      <div>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
          Shift Schedule
        </h2>    
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {mockShifts.map((shift) => (
            <div
              key={shift.id}
              style={{
                padding: '16px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
                    {shift.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                    {shift.startTime} - {shift.endTime}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    <strong>Assigned Drivers ({shift.driverIds.length}):</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {shift.driverIds.map((driverId) => {
                      const driver = drivers.find(d => d.id === driverId);
                      return driver ? (
                        <div key={driverId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Popover 
                            content={getDriverPopoverContent(driver)}
                            title={null}
                            trigger="click"
                            placement="right"
                          >
                            <span style={{ 
                              fontSize: '12px', 
                              color: '#1890ff', 
                              cursor: 'pointer',
                              textDecoration: 'underline'
                            }}>
                              {driver.name}
                            </span>
                          </Popover>
                          <BBDTag style={{ 
                            ...getDriverStatusColor(driver.status),
                            width: 'fit-content',
                            fontSize: '10px'
                          }}>
                            {driver.status.replace('_', ' ')}
                          </BBDTag>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Unassigned Drivers Card */}
          <div
            style={{
              padding: '16px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
                  Unassigned Drivers
                </div>
                <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                  Available
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  <strong>Available Drivers ({getUnassignedDrivers().length}):</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {getUnassignedDrivers().map((driver) => (
                    <div key={driver.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Popover 
                        content={getDriverPopoverContent(driver)}
                        title={null}
                        trigger="click"
                        placement="right"
                      >
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#1890ff', 
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}>
                          {driver.name}
                        </span>
                      </Popover>
                      <BBDTag style={{ 
                        ...getDriverStatusColor(driver.status),
                        width: 'fit-content',
                        fontSize: '10px'
                      }}>
                        {driver.status.replace('_', ' ')}
                      </BBDTag>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Fleet Grid */}
      <div style={{ flex: 1, minHeight: '400px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
          Vehicle Fleet Management
        </h2>
         
        <div style={{ height: '400px' }}>
          <GraviGrid
            storageKey="driver-management-vehicles-grid"
            rowData={filteredVehicles}
            columnDefs={vehicleColumnDefs}
            agPropOverrides={agPropOverrides}
            controlBarProps={controlBarProps}
            updateEP={updateEP}
          />
        </div>
      </div>
    </div>
  );
}