// Mock data and navigation generators

export function generateMockScopes(featureName: string) {
  return `export const mockScopes = {
  ${featureName}: true,
  PricingEngine: true,
  Admin: true
}`;
}

// FIXED: Updated to match working example with proper icons and structure
export function generateMockPageConfig(
  featureName: string,
  componentName: string
) {
  return `import React from "react";
import { ${componentName} } from "../components/${componentName}";
import { 
  DashboardOutlined,
  CalculatorOutlined, 
  SettingOutlined,
  LineChartOutlined,
  BookOutlined,
  ControlOutlined
} from "@ant-design/icons";
import { Navigate } from "react-router-dom";

// Page configuration matching real Gravitate application structure
export const createPageConfig = () => ({
  PricingEngine: {
    hasPermission: () => true,
    key: "PricingEngine",
    title: "PRICING ENGINE",
    index: 0,
    icon: <DashboardOutlined />,
    element: <Navigate to="/PricingEngine/QuoteBook" replace />,
    query_page: "",
    routes: [
      {
        hasPermission: () => true,
        key: "QuoteBook",
        title: "Quote Book",
        element: (
          <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
            <h2>Quote Book</h2>
            <p>Real pricing quote management interface would be here.</p>
          </div>
        ),
        index: 0,
        query_page: "",
        path: "QuoteBook"
      },
      {
        hasPermission: () => true,
        key: "CommandCenter",
        title: "Command Center",
        element: (
          <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
            <h2>Command Center</h2>
            <p>Pricing command center interface would be here.</p>
          </div>
        ),
        index: 1,
        query_page: "",
        path: "CommandCenter"
      },
      {
        hasPermission: () => true,
        key: "Calculations",
        title: "Calculations",
        element: (
          <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
            <h2>Calculations</h2>
            <p>Pricing calculations interface would be here.</p>
          </div>
        ),
        index: 2,
        query_page: "",
        path: "Calculations"
      },
      {
        hasPermission: () => true,
        key: "Prices",
        title: "Prices",
        element: <${componentName} />,
        index: 3,
        query_page: "",
        path: "Prices"
      },
      {
        hasPermission: () => true,
        key: "AllPrices",
        title: "All Prices",
        element: (
          <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
            <h2>All Prices</h2>
            <p>All prices overview would be here.</p>
          </div>
        ),
        index: 4,
        query_page: "",
        path: "AllPrices"
      }
    ]
  },
  ${featureName}: {
    hasPermission: () => true,
    key: "${featureName}",
    title: "${featureName.toUpperCase()}",
    index: 1,
    icon: <BookOutlined />,
    element: <${componentName} />,
    query_page: "",
  },
  Admin: {
    hasPermission: () => true,
    key: "Admin", 
    title: "ADMIN",
    index: 2,
    icon: <SettingOutlined />,
    element: <Navigate to="/Admin/Users" replace />,
    query_page: "",
    routes: [
      {
        hasPermission: () => true,
        key: "Users",
        title: "Users",
        element: (
          <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
            <h2>User Management</h2>
            <p>User administration interface would be here.</p>
          </div>
        ),
        index: 0,
        query_page: "",
        path: "Users"
      },
      {
        hasPermission: () => true,
        key: "Settings",
        title: "Settings", 
        element: (
          <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
            <h2>System Settings</h2>
            <p>System configuration interface would be here.</p>
          </div>
        ),
        index: 1,
        query_page: "",
        path: "Settings"
      }
    ]
  }
});

// For backward compatibility
export const mockPageConfig = createPageConfig();`;
}

// FIXED: Updated to use Horizontal and Vertical components from Excalibrr
export function generateMockUserControlPanel() {
  return `import { UserOutlined } from "@ant-design/icons";
import { Horizontal, Texto } from "@gravitate-js/excalibrr";
import { Avatar } from "antd";

export function MockUserControlPanel() {
  return (
    <div className="flex ml-4">
      <div className="vertical-flex pr-2">
        <Texto align="right" category="p2" weight="bold">
          capspire support
        </Texto>
        <Horizontal className="mr-0 mt-1" alignItems="center" style={{ justifyContent: "space-evenly" }}>
          <UserOutlined className="pr-2" />
          All Companies
        </Horizontal>
      </div>
      <div className="vertical-flex-center pl-3">
        <Avatar
          shape="square"
          style={{ 
            borderRadius: 5, 
            background: "var(--primary-gradient)", 
            textTransform: "uppercase" 
          }}
          size={36}
        >
          CS
        </Avatar>
      </div>
    </div>
  );
}`;
}
