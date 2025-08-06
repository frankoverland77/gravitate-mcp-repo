// Dashboard Layout Patterns

import type { ComponentExample } from "../../index.js";

export const DASHBOARD_PATTERNS: ComponentExample[] = [
  {
    name: "Metrics Dashboard",
    description:
      "Complete dashboard layout with key performance metrics and data visualization",
    category: "patterns",
    complexity: "advanced",
    tags: ["dashboard", "metrics", "kpi", "layout"],
    code: `import { 
  Vertical, 
  Horizontal, 
  DashboardWidget, 
  GraviGrid 
} from '@gravitate-js/excalibrr';
import { useState } from 'react';

function MetricCard({ title, value, change, changeType = 'positive' }) {
  const changeColor = changeType === 'positive' ? '#059669' : '#dc2626';
  
  return (
    <DashboardWidget title={title}>
      <Vertical spacing={8}>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937' 
        }}>
          {value}
        </div>
        <div style={{ 
          color: changeColor, 
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {change}
        </div>
      </Vertical>
    </DashboardWidget>
  );
}

function MetricsDashboard() {
  const [recentOrders] = useState([
    { id: 1001, customer: 'Acme Corp', amount: 2500, status: 'Completed' },
    { id: 1002, customer: 'Tech Solutions', amount: 1200, status: 'Processing' },
    { id: 1003, customer: 'Global Industries', amount: 3800, status: 'Pending' }
  ]);

  const orderColumns = [
    { field: 'id', headerName: 'Order ID', width: 100 },
    { field: 'customer', headerName: 'Customer', width: 180 },
    { field: 'amount', headerName: 'Amount', width: 120, type: 'currency' },
    { field: 'status', headerName: 'Status', width: 120 }
  ];

  return (
    <Vertical spacing={24} style={{ padding: '24px', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <Horizontal justify="space-between" align="center">
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
          Dashboard
        </h1>
        <Horizontal spacing={12}>
          <button style={{ padding: '8px 16px' }}>Export Report</button>
          <button style={{ padding: '8px 16px' }}>Settings</button>
        </Horizontal>
      </Horizontal>

      {/* Key Metrics Row */}
      <Horizontal spacing={20}>
        <MetricCard 
          title="Total Revenue"
          value="$124,560" 
          change="+12% from last month"
          changeType="positive"
        />
        <MetricCard 
          title="Total Orders" 
          value="1,234"
          change="+8% from last month" 
          changeType="positive"
        />
        <MetricCard 
          title="Active Customers"
          value="856"
          change="+15% from last month"
          changeType="positive" 
        />
        <MetricCard 
          title="Avg Order Value"
          value="$89.50"
          change="-3% from last month"
          changeType="negative"
        />
      </Horizontal>

      {/* Content Row */}
      <Horizontal spacing={20} align="stretch">
        {/* Recent Orders */}
        <div style={{ flex: 2 }}>
          <DashboardWidget 
            title="Recent Orders" 
            subtitle="Last 24 hours"
            style={{ height: '400px' }}
          >
            <GraviGrid 
              columns={orderColumns}
              data={recentOrders}
              getRowId={(row) => row.id}
              pagination={{ pageSize: 10 }}
            />
          </DashboardWidget>
        </div>

        {/* Quick Stats */}
        <div style={{ flex: 1 }}>
          <Vertical spacing={16}>
            <DashboardWidget title="Quick Stats">
              <Vertical spacing={16}>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Conversion Rate
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '600' }}>
                    3.2%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Avg Session Duration
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '600' }}>
                    4m 32s
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Bounce Rate
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '600' }}>
                    28%
                  </div>
                </div>
              </Vertical>
            </DashboardWidget>

            <DashboardWidget title="Top Products">
              <Vertical spacing={12}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Premium Plan</span>
                  <strong>156 sales</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Basic Plan</span>
                  <strong>89 sales</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Enterprise</span>
                  <strong>23 sales</strong>
                </div>
              </Vertical>
            </DashboardWidget>
          </Vertical>
        </div>
      </Horizontal>
    </Vertical>
  );
}

export default MetricsDashboard;`,
  },

  {
    name: "Simple Status Dashboard",
    description: "Minimal dashboard focusing on system status and alerts",
    category: "patterns",
    complexity: "intermediate",
    tags: ["dashboard", "status", "monitoring", "alerts"],
    code: `import { 
  Vertical, 
  Horizontal, 
  DashboardWidget 
} from '@gravitate-js/excalibrr';

function StatusIndicator({ status, label, description }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#059669';
      case 'warning': return '#d97706'; 
      case 'error': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  return (
    <Horizontal spacing={12} align="center">
      <span style={{ fontSize: '18px' }}>
        {getStatusIcon(status)}
      </span>
      <Vertical spacing={4}>
        <div style={{ fontWeight: '500', fontSize: '14px' }}>
          {label}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280' 
        }}>
          {description}
        </div>
      </Vertical>
    </Horizontal>
  );
}

function StatusDashboard() {
  const systemStatus = [
    { 
      status: 'healthy', 
      label: 'API Server', 
      description: 'All endpoints responding normally' 
    },
    { 
      status: 'healthy', 
      label: 'Database', 
      description: 'Query time: 45ms average' 
    },
    { 
      status: 'warning', 
      label: 'Cache', 
      description: 'High memory usage (78%)' 
    },
    { 
      status: 'error', 
      label: 'Email Service', 
      description: 'Connection timeout errors' 
    }
  ];

  return (
    <Vertical spacing={24} style={{ padding: '24px', maxWidth: '800px' }}>
      {/* Header */}
      <Horizontal justify="space-between" align="center">
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
          System Status
        </h1>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Last updated: {new Date().toLocaleString()}
        </div>
      </Horizontal>

      {/* Overall Status */}
      <DashboardWidget title="Overall System Health">
        <Horizontal spacing={16} align="center">
          <div style={{ fontSize: '24px' }}>⚠️</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#d97706' }}>
              Degraded Performance
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Some services experiencing issues
            </div>
          </div>
        </Horizontal>
      </DashboardWidget>

      {/* Service Status */}
      <DashboardWidget title="Service Status">
        <Vertical spacing={20}>
          {systemStatus.map((service, index) => (
            <StatusIndicator
              key={index}
              status={service.status}
              label={service.label}
              description={service.description}
            />
          ))}
        </Vertical>
      </DashboardWidget>

      {/* Recent Alerts */}
      <DashboardWidget title="Recent Alerts">
        <Vertical spacing={16}>
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '6px'
          }}>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>
              High Cache Usage
            </div>
            <div style={{ fontSize: '12px', color: '#92400e' }}>
              2 minutes ago • Cache usage is at 78%
            </div>
          </div>
          
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#fee2e2',
            border: '1px solid #f87171', 
            borderRadius: '6px'
          }}>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>
              Email Service Down
            </div>
            <div style={{ fontSize: '12px', color: '#991b1b' }}>
              15 minutes ago • Connection timeout to email provider
            </div>
          </div>
        </Vertical>
      </DashboardWidget>
    </Vertical>
  );
}

export default StatusDashboard;`,
  },
];
