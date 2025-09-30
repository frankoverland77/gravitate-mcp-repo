import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { UnorderedListOutlined, TeamOutlined, AimOutlined, DashboardOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';
import { DeliveryProvider, useDelivery, DeliveryView } from './contexts/DeliveryContext';
import './styles/dragdrop.css';
import { OrderQueue } from './components/OrderQueue';
import { DriverManagement } from './components/DriverManagement';
import { RoutePlanning } from './components/RoutePlanning';
import { RouteManagement } from './components/RouteManagement';
import { RealTimeTracking } from './components/RealTimeTracking';
import { Analytics } from './components/Analytics';
import { SimulationControlDrawer } from './components/SimulationControlDrawer';

export function DeliveryManager() {
  /* MCP Theme Script */
  // Set BP theme for this demo (follows ControlPanel pattern)
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("TYPE_OF_THEME", "BP");
    }
  }, []);
  /* End MCP Theme Script */

  return (
    <DeliveryProvider>
      <DeliveryTabs />
    </DeliveryProvider>
  );
}

// Delivery tabs component with context integration
function DeliveryTabs() {
  const { currentView, setCurrentView } = useDelivery();
  
  // Map DeliveryView enum to tab keys
  const getTabKey = (view: DeliveryView): string => {
    const keyMap: Record<DeliveryView, string> = {
      'order-queue': 'order-queue',
      'driver-management': 'driver-management', 
      'route-planning': 'route-planning',
      'real-time-tracking': 'real-time-tracking',
      'analytics': 'analytics',
      'settings': 'settings'
    };
    return keyMap[view];
  };
  
  // Map tab keys back to DeliveryView enum
  const getViewFromKey = (key: string): DeliveryView => {
    const viewMap: Record<string, DeliveryView> = {
      'order-queue': 'order-queue',
      'driver-management': 'driver-management',
      'route-planning': 'route-planning', 
      'real-time-tracking': 'real-time-tracking',
      'analytics': 'analytics',
      'settings': 'settings'
    };
    return viewMap[key] || 'order-queue';
  };
  
  const handleTabChange = (activeKey: string) => {
    const newView = getViewFromKey(activeKey);
    setCurrentView(newView);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Tabs 
        style={{ minWidth: "100%" }}
        activeKey={getTabKey(currentView)}
        onChange={handleTabChange}
      >
      <Tabs.TabPane
        tab={
          <span>
            <UnorderedListOutlined /> Order Queue
          </span>
        }
        key="order-queue"
      >
        <div style={{ height: 'calc(100vh - 200px)', padding: '16px' }}>
          <OrderQueue />
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={
          <span>
            <TeamOutlined /> Driver Management
          </span>
        }
        key="driver-management"
      >
        <div style={{ height: 'calc(100vh - 200px)', padding: '16px' }}>
          <DriverManagement />
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={
          <span>
            <AimOutlined /> Route Planning
          </span>
        }
        key="route-planning"
      >
        <DeliveryRouteTab />
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={
          <span>
            <DashboardOutlined /> Real-time Tracking
          </span>
        }
        key="real-time-tracking"
      >
        <div style={{ height: 'calc(100vh - 200px)' }}>
          <RealTimeTracking />
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={
          <span>
            <BarChartOutlined /> Analytics
          </span>
        }
        key="analytics"
      >
        <div style={{ height: 'calc(100vh - 200px)', padding: '16px' }}>
          <Analytics />
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={
          <span>
            <SettingOutlined /> Settings
          </span>
        }
        key="settings"
      >
        <Horizontal>
          <div style={{ padding: '20px' }}>
            <Vertical gap={20}>
              <Texto variant="h2">⚙️ Delivery System Settings</Texto>
              <Texto variant="body1">
                Configure delivery zones, pricing, notification preferences, 
                and system-wide settings for optimal operations.
              </Texto>
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#f6f6f6', 
                borderRadius: '8px'
              }}>
                <Texto variant="body2">
                  🏗️ This section will include:
                  <br />• Delivery zone configuration
                  <br />• Pricing and fee settings
                  <br />• Notification preferences
                  <br />• User permissions and roles
                  <br />• Integration settings
                </Texto>
              </div>
            </Vertical>
          </div>
        </Horizontal>
      </Tabs.TabPane>
    </Tabs>
    
    {/* Global Simulation Control Drawer */}
    <SimulationControlDrawer />
    </div>
  );
}

// Route tab component with context-based state management
function DeliveryRouteTab() {
  const { routeViewState, setRouteViewState } = useDelivery();

  const handleCreateRoute = () => {
    setRouteViewState('create');
  };

  const handleBackToRoutes = () => {
    setRouteViewState('grid');
  };

  return (
    <div style={{ height: 'calc(100vh - 200px)', padding: '16px' }}>
      {routeViewState === 'grid' ? (
        <RouteManagement onCreateRoute={handleCreateRoute} />
      ) : (
        <RoutePlanning onBackToRoutes={handleBackToRoutes} />
      )}
    </div>
  );
}