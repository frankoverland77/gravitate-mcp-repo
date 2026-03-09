/**
 * Tabs Component Metadata
 */

import { ComponentMetadata } from "../types.js";

export const tabsComponent: ComponentMetadata = {
  id: "tabs",
  name: "Tabs",
  description: "Tabbed navigation component from Ant Design. Organize content into switchable panels with tab headers. Supports icons, custom styling, and various positions.",
  category: "layout",
  complexity: "medium",
  tags: ["tabs", "navigation", "tabbed", "panel", "layout", "antd"],
  source: "antd",
  version: "5.0",
  dependencies: ["antd", "react"],
  props: [
    {
      name: "defaultActiveKey",
      type: "string",
      required: false,
      description: "Initial active tab's key"
    },
    {
      name: "activeKey",
      type: "string",
      required: false,
      description: "Current active tab's key (controlled)"
    },
    {
      name: "onChange",
      type: "(activeKey: string) => void",
      required: false,
      description: "Callback when tab is switched"
    },
    {
      name: "type",
      type: "'line' | 'card' | 'editable-card'",
      required: false,
      defaultValue: "'line'",
      description: "Tab style type"
    },
    {
      name: "tabPosition",
      type: "'top' | 'bottom' | 'left' | 'right'",
      required: false,
      defaultValue: "'top'",
      description: "Position of tabs"
    },
    {
      name: "size",
      type: "'large' | 'default' | 'small'",
      required: false,
      defaultValue: "'default'",
      description: "Tab size"
    },
    {
      name: "animated",
      type: "boolean | { inkBar: boolean; tabPane: boolean }",
      required: false,
      defaultValue: "true",
      description: "Enable tab switch animation"
    },
    {
      name: "tabBarExtraContent",
      type: "ReactNode",
      required: false,
      description: "Extra content in tab bar"
    },
    {
      name: "items",
      type: "TabsProps['items']",
      required: true,
      description: "Array of tab items with key, label, and children properties"
    }
  ],
  examples: [
    {
      name: "Basic Tabs",
      description: "Simple tabbed interface with multiple panels using items prop",
      code: `import { Tabs } from "antd";

function BasicTabs() {
  const items = [
    { key: "1", label: "Tab 1", children: "Content of Tab Pane 1" },
    { key: "2", label: "Tab 2", children: "Content of Tab Pane 2" },
    { key: "3", label: "Tab 3", children: "Content of Tab Pane 3" },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
}`,
      tags: ["basic"]
    },
    {
      name: "Tabs with Icons",
      description: "Tabs with icons and labels using items prop",
      code: `import { Tabs } from "antd";
import { HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";

function IconTabs() {
  const items = [
    {
      key: "home",
      label: <span><HomeOutlined /> Home</span>,
      children: <div>Home Content</div>,
    },
    {
      key: "profile",
      label: <span><UserOutlined /> Profile</span>,
      children: <div>Profile Content</div>,
    },
    {
      key: "settings",
      label: <span><SettingOutlined /> Settings</span>,
      children: <div>Settings Content</div>,
    },
  ];

  return <Tabs items={items} />;
}`,
      tags: ["icons", "dynamic"]
    },
    {
      name: "Card Style Tabs",
      description: "Tabs with card-style appearance using items prop",
      code: `import { Tabs } from "antd";

function CardTabs() {
  const items = [
    {
      key: "products",
      label: "Products",
      children: (
        <>
          <h3>Product List</h3>
          <p>Display your products here...</p>
        </>
      ),
    },
    {
      key: "orders",
      label: "Orders",
      children: (
        <>
          <h3>Order Management</h3>
          <p>Manage orders here...</p>
        </>
      ),
    },
    {
      key: "customers",
      label: "Customers",
      children: (
        <>
          <h3>Customer Database</h3>
          <p>View customers here...</p>
        </>
      ),
    },
  ];

  return <Tabs type="card" items={items} />;
}`,
      tags: ["card", "style"]
    },
    {
      name: "Controlled Tabs with State",
      description: "Tabs with controlled active state using items prop",
      code: `import { Tabs } from "antd";
import { useState } from "react";

function ControlledTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (key: string) => {
    console.log("Switched to tab:", key);
    setActiveTab(key);
  };

  const items = [
    { key: "overview", label: "Overview", children: "Overview content" },
    { key: "details", label: "Details", children: "Detailed information" },
    { key: "analytics", label: "Analytics", children: "Analytics dashboard" },
  ];

  return (
    <div>
      <p>Current tab: {activeTab}</p>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={items} />
    </div>
  );
}`,
      tags: ["controlled", "state"]
    },
    {
      name: "Full WelcomePage Example",
      description: "Complete example from the demo showing tabs with items prop and icons",
      code: `import { Tabs, Horizontal } from "@gravitate-js/excalibrr";
import { HomeOutlined, TabletOutlined, TagOutlined } from "@ant-design/icons";

export function WelcomePage() {
  const items = [
    {
      key: "home",
      label: <span><HomeOutlined /> Home</span>,
      children: <Horizontal><div>Home Page Content</div></Horizontal>,
    },
    {
      key: "components",
      label: <span><TabletOutlined /> Components</span>,
      children: <Horizontal><div>Component Examples</div></Horizontal>,
    },
    {
      key: "tags",
      label: <span><TagOutlined /> Tags</span>,
      children: <Horizontal><div>Tag Examples</div></Horizontal>,
    },
  ];

  return <Tabs style={{ minWidth: "100%" }} items={items} />;
}`,
      tags: ["complete", "real-world", "icons"]
    }
  ],
  notes: "This component comes from Ant Design (antd v5) which is already included in the demo project. The Tabs component uses the items prop (not Tabs.TabPane children) and works well with Excalibrr theming."
};