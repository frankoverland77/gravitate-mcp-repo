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
  version: "4.20",
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
      name: "children",
      type: "Tabs.TabPane[]",
      required: true,
      description: "Tab panes (use Tabs.TabPane components)"
    }
  ],
  examples: [
    {
      name: "Basic Tabs",
      description: "Simple tabbed interface with multiple panels",
      code: `import { Tabs } from "antd";

function BasicTabs() {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Tab 1" key="1">
        Content of Tab Pane 1
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab 2" key="2">
        Content of Tab Pane 2
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab 3" key="3">
        Content of Tab Pane 3
      </Tabs.TabPane>
    </Tabs>
  );
}`,
      tags: ["basic"]
    },
    {
      name: "Tabs with Icons",
      description: "Tabs with icons and labels (from WelcomePage example)",
      code: `import { Tabs } from "antd";
import { HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";

function IconTabs() {
  const tabs = [
    {
      label: "Home",
      key: "home",
      icon: <HomeOutlined />,
      content: <div>Home Content</div>
    },
    {
      label: "Profile",
      key: "profile",
      icon: <UserOutlined />,
      content: <div>Profile Content</div>
    },
    {
      label: "Settings",
      key: "settings",
      icon: <SettingOutlined />,
      content: <div>Settings Content</div>
    }
  ];

  return (
    <Tabs>
      {tabs.map((tab) => (
        <Tabs.TabPane
          tab={
            <span>
              {tab.icon} {tab.label}
            </span>
          }
          key={tab.key}
        >
          {tab.content}
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}`,
      tags: ["icons", "dynamic"]
    },
    {
      name: "Card Style Tabs",
      description: "Tabs with card-style appearance",
      code: `import { Tabs } from "antd";

function CardTabs() {
  return (
    <Tabs type="card">
      <Tabs.TabPane tab="Products" key="products">
        <h3>Product List</h3>
        <p>Display your products here...</p>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Orders" key="orders">
        <h3>Order Management</h3>
        <p>Manage orders here...</p>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Customers" key="customers">
        <h3>Customer Database</h3>
        <p>View customers here...</p>
      </Tabs.TabPane>
    </Tabs>
  );
}`,
      tags: ["card", "style"]
    },
    {
      name: "Controlled Tabs with State",
      description: "Tabs with controlled active state",
      code: `import { Tabs } from "antd";
import { useState } from "react";

function ControlledTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (key: string) => {
    console.log("Switched to tab:", key);
    setActiveTab(key);
  };

  return (
    <div>
      <p>Current tab: {activeTab}</p>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.TabPane tab="Overview" key="overview">
          Overview content
        </Tabs.TabPane>
        <Tabs.TabPane tab="Details" key="details">
          Detailed information
        </Tabs.TabPane>
        <Tabs.TabPane tab="Analytics" key="analytics">
          Analytics dashboard
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}`,
      tags: ["controlled", "state"]
    },
    {
      name: "Full WelcomePage Example",
      description: "Complete example from the demo showing tabs with multiple component examples",
      code: `import { Tabs, Horizontal } from "@gravitate-js/excalibrr";
import { HomeOutlined, TabletOutlined, TagOutlined } from "@ant-design/icons";

export function WelcomePage() {
  const tabs = [
    {
      label: "Home",
      key: "home",
      component: <div>Home Page Content</div>,
      icon: <HomeOutlined />,
    },
    {
      label: "Components",
      key: "components",
      component: <div>Component Examples</div>,
      icon: <TabletOutlined />,
    },
    {
      label: "Tags",
      key: "tags",
      component: <div>Tag Examples</div>,
      icon: <TagOutlined />,
    },
  ];

  return (
    <Tabs style={{ minWidth: "100%" }}>
      {tabs?.map((tab) => (
        <Tabs.TabPane
          tab={
            <span>
              {tab.icon} {tab.label}
            </span>
          }
          key={tab.key}
        >
          <Horizontal>{tab.component}</Horizontal>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}`,
      tags: ["complete", "real-world", "icons"]
    }
  ],
  notes: "This component comes from Ant Design (antd v4.20) which is already included in the demo project. The Tabs component works well with Excalibrr theming and is used in the WelcomePage demo."
};