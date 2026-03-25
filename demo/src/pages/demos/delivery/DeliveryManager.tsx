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
import { useTheme } from '@hooks/useTheme';

export function DeliveryManager() {
  useTheme('BP');

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
        items={[
        {
          key: 'order-queue',
          label: <span><UnorderedListOutlined /> Order Queue</span>,
          children: (
            <div style={{ height: 'calc(100vh - 200px)', padding: '16px' }}>
              <OrderQueue />
            </div>
          ),
        },
        {
          key: 'driver-management',
          label: <span><TeamOutlined /> Driver Management</span>,
          children: (
            <div style={{ height: 'calc(100vh - 200px)', padding: '16px' }}>
              <DriverManagement />
            </div>
          ),
        },
        {
          key: 'route-planning',
          label: <span><AimOutlined /> Route Planning</span>,
          children: <DeliveryRouteTab />,
        },
        {
          key: 'real-time-tracking',
          label: <span><DashboardOutlined /> Real-time Tracking</span>,
          children: (
            <div style={{ height: 'calc(100vh - 200px)' }}>
              <RealTimeTracking />
            </div>
          ),
        },
        {
          key: 'analytics',
          label: <span><BarChartOutlined /> Analytics</span>,
          children: (
            <div style={{ height: 'calc(100vh - 200px)', padding: '16px' }}>
              <Analytics />
            </div>
          ),
        },
        {
          key: 'settings',
          label: <span><SettingOutlined /> Settings</span>,
          children: (
            <Horizontal>
              <div className="p-3">
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
          ),
        },
      ]}
    />
    
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