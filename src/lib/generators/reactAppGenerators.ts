// React application core file generators

export function generateIndexJs() {
  return `import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@gravitate-js/excalibrr/dist/index.css";
import "./styles.css";

import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const container = document.getElementById("root");
if (!container) throw new Error('Failed to find root element');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
}

// FIXED: Updated to match the working Lemonade Competitors structure
export function generateAppTsx(featureName: string, componentName: string) {
  return `import React, { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ThemeContextProvider,
  NavigationContextProvider,
} from "@gravitate-js/excalibrr";
import { BrowserRouter as Router } from "react-router-dom";
import { ${componentName} } from "./components/${componentName}";
import { mockPageConfig } from "./mocks/mockPageConfig";
import { mockScopes } from "./mocks/mockScopes";
import { MockUserControlPanel } from "./mocks/MockUserControlPanel";
import { themeConfigs, getFilteredThemes } from "./components/themeConfig";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ThemeWrapper({ themeConfigs }) {
  const filteredConfigs = useMemo(() => getFilteredThemes(), []);

  useEffect(() => {
    if (!localStorage.getItem("TYPE_OF_THEME")) {
      const defaultThemeKey = Object.keys(filteredConfigs).find(
        (key) => filteredConfigs[key].default
      );
      localStorage.setItem(
        "TYPE_OF_THEME",
        defaultThemeKey || Object.keys(filteredConfigs)[0]
      );
    }
  }, [filteredConfigs]);

  if (!filteredConfigs || Object.entries(filteredConfigs)?.length <= 0) {
    return <div>Loading themes...</div>;
  }

  console.log("ThemeWrapper: Using theme configs:", filteredConfigs);

  return (
    <ThemeContextProvider themeConfigs={filteredConfigs}>
      <NavigationContextProvider
        getScopes={async () => mockScopes}
        handleLogout={() => console.log("Logout clicked")}
        pageConfig={mockPageConfig}
        userControlPane={<MockUserControlPanel />}
        navStyle="vertical"
      >
        <${componentName} />
      </NavigationContextProvider>
    </ThemeContextProvider>
  );
}

export function App() {
  console.log("App component rendering with theme config:", themeConfigs);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeWrapper themeConfigs={themeConfigs} />
      </Router>
    </QueryClientProvider>
  );
}`;
}

export function generateStylesCss() {
  return `.detail-tabs .ant-tabs-tab.ant-tabs-tab-active {
  background: var(--theme-color-2) !important;
  color: var(--gray-100) !important;
  border-radius: 6px;
}

.detail-tabs-draft .ant-tabs-tab.ant-tabs-tab-active {
  background: var(--theme-option) !important;
  color: var(--gray-100) !important;
  border-radius: 6px;
}

.detail-tabs .ant-tabs-tab {
  background-color: var(--bg-1) !important;
  border-radius: 10px 10px 0 0 !important;
  border: 1px solid var(--gray-300) !important;
}

.detail-tabs-draft .ant-tabs-tab {
  background-color: var(--bg-1) !important;
  border-radius: 10px 10px 0 0 !important;
  border: 1px solid var(--gray-300) !important;
}

.detail-tabs .ant-tabs-tab-active button.ant-tabs-tab-remove {
  color: var(--gray-100);
}

.date-range-select {
  padding: 0.555em 1em !important;
  margin-left: 0 !important;
  display: flex;
  align-items: center;
}

.filter-drawer .ant-form.ant-form-inline.search-grid-form {
  align-items: center;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}

.disable-select {
  background-color: red !important;
  pointer-events: none;
}

.ghost-gravi-button {
  background: transparent !important;
  border: none;
  box-shadow: none !important;
}

.disabled-gravi-button {
  background: var(--gray-300) !important;
  color: var(--gray-100) !important;
  border: none;
  box-shadow: none;
  cursor: not-allowed;
}
.border-radius-5 {
  border-radius: 5px !important;
}
.hint {
  color: var(--gray-400) !important;
}
@media only screen and (max-width: 1440px) {
  body {
    font-size: 10px !important;
  }
}

@media only screen and (max-width: 1960px) {
  body {
    font-size: 11px !important;
  }
}`;
}
