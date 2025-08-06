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
  CalculatorOutlined,
  SettingOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

export const mockPageConfig = {
  ${featureName}: {
    hasPermission: () => true,
    key: "${featureName}",
    title: "${featureName}",
    element: <${componentName} />,
    index: 0,
    icon: <TrophyOutlined />,
    query_page: "",
  },
  PricingEngine: {
    hasPermission: () => true,
    key: "PricingEngine",
    title: "Pricing Engine",
    index: 1,
    icon: <CalculatorOutlined />,
    query_page: "",
    routes: [
      {
        hasPermission: () => true,
        key: "Publishers",
        title: "Price Publishers",
        element: (
          <div style={{ padding: "20px" }}>
            Mock Pricing Engine - Publishers
          </div>
        ),
        index: 0,
        query_page: "",
      },
      {
        hasPermission: () => true,
        key: "Instruments",
        title: "Price Instruments",
        element: (
          <div style={{ padding: "20px" }}>
            Mock Pricing Engine - Instruments
          </div>
        ),
        index: 1,
        query_page: "",
      },
    ],
  },
  Admin: {
    hasPermission: () => true,
    key: "Admin",
    title: "Admin",
    index: 2,
    icon: <SettingOutlined />,
    query_page: "",
    routes: [
      {
        hasPermission: () => true,
        key: "Users",
        title: "Users",
        element: <div style={{ padding: "20px" }}>Mock Admin - Users</div>,
        index: 0,
        query_page: "",
      },
      {
        hasPermission: () => true,
        key: "Settings",
        title: "Settings",
        element: <div style={{ padding: "20px" }}>Mock Admin - Settings</div>,
        index: 1,
        query_page: "",
      },
    ],
  },
};`;
}

// FIXED: Updated to use Horizontal and Vertical components from Excalibrr
export function generateMockUserControlPanel() {
  return `import { Horizontal, Texto, Vertical } from "@gravitate-js/excalibrr";

export function MockUserControlPanel() {
  return (
    <Horizontal style={{ gap: "5px" }} verticalCenter>
      <Vertical verticalCenter alignItems="flex-end">
        <Texto>capspire support</Texto>
        <Texto>All Companies</Texto>
      </Vertical>
      <div
        style={{
          width: "32px",
          height: "32px",
          background: "#666",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
        }}
        onClick={() => {
          console.log("Mock For Demo Purposes");
        }}
      >
        CS
      </div>
    </Horizontal>
  );
}`;
}
