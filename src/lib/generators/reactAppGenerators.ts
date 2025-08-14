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

// UPGRADED: App.tsx with full navigation and proper theme integration
export function generateAppTsx(featureName: string, componentName: string) {
  return `import React, { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ThemeContextProvider,
  NavigationContextProvider,
} from "@gravitate-js/excalibrr";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ${componentName} } from "./components/${componentName}";
import { createPageConfig } from "./mocks/mockPageConfig";
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

function ThemeWrapper() {
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



  return (
    <ThemeContextProvider themeConfigs={filteredConfigs}>
      <NavigationContextProvider
        getScopes={async () => mockScopes}
        handleLogout={() => console.log("Logout clicked")}
        pageConfig={createPageConfig()}
        userControlPane={<MockUserControlPanel />}
        navStyle="vertical"
      >
        <Routes>
          <Route path="/" element={<Navigate to="/PricingEngine/Prices" replace />} />
          <Route path="/PricingEngine/Prices" element={<${componentName} />} />
          <Route path="/PricingEngine/*" element={<Outlet />} />
          <Route path="/SalesManagement" element={<${componentName} />} />
          <Route path="/Admin/*" element={<Outlet />} />
        </Routes>
      </NavigationContextProvider>
    </ThemeContextProvider>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeWrapper />
      </Router>
    </QueryClientProvider>
  );
}`;
}

export function generateStylesCss() {
  return `/* Import Excalibrr styles */
@import "@gravitate-js/excalibrr/dist/index.css";

/* Additional utility classes for better layout */
.flex {
  display: flex;
}

.vertical-flex {
  display: flex;
  flex-direction: column;
}

.vertical-flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ml-4 {
  margin-left: 1rem;
}

.pr-2 {
  padding-right: 0.5rem;
}

.pl-3 {
  padding-left: 0.75rem;
}

.mr-0 {
  margin-right: 0;
}

.mt-1 {
  margin-top: 0.25rem;
}

/* PE Light Theme Specific Styles */
.pe-light-theme {
  /* Navigation theming */
  --nav-bg-color: var(--theme-color-1);
  --nav-text-color: #ffffff;
  --nav-hover-bg: var(--theme-color-2);
}

/* Apply theme colors to navigation components */
.ant-layout-sider {
  background: var(--theme-color-1) !important;
}

.ant-layout-sider .ant-menu {
  background: var(--theme-color-1) !important;
  color: #ffffff !important;
}

.ant-layout-sider .ant-menu-item {
  color: #ffffff !important;
}

.ant-layout-sider .ant-menu-item:hover {
  background-color: var(--theme-color-2) !important;
  color: #ffffff !important;
}

.ant-layout-sider .ant-menu-item-selected {
  background-color: var(--theme-color-2) !important;
  color: #ffffff !important;
}

/* Theme the top header */
.ant-layout-header {
  background: #ffffff !important;
  border-bottom: 1px solid var(--gray-300) !important;
}

/* User control panel theming */
.control-panel-trigger {
  background: transparent !important;
}

/* Ensure avatar uses primary gradient */
.ant-avatar[style*="--primary-gradient"] {
  background: var(--primary-gradient) !important;
  color: #ffffff !important;
  border: 2px solid var(--theme-color-2) !important;
}

/* Navigation icons and text sizing */
.ant-layout-sider .ant-menu-item {
  font-size: 13px !important;
  font-weight: 500 !important;
  padding: 8px 16px !important;
  height: auto !important;
  line-height: 1.4 !important;
}

.ant-layout-sider .anticon {
  font-size: 14px !important;
  margin-right: 8px !important;
}

/* Navigation header alignment */
.ant-layout-sider .ant-layout-sider-children {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Grid container theming */
.ag-root-wrapper {
  border: 1px solid var(--gray-300) !important;
  border-radius: 4px !important;
}

.ag-header {
  background: var(--bg-2) !important;
  border-bottom: 1px solid var(--gray-300) !important;
}

.ag-header-cell {
  background: var(--bg-2) !important;
  border-right: 1px solid var(--gray-300) !important;
}

/* Critical Font Fix for ag-Grid Components */

/* 1. Font-face declarations - MUST come first */
@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXiWtFCc.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 2. Global font application */
* {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

/* 3. ag-Grid specific font overrides - matching production */
.ag-theme-alpine,
.ag-theme-alpine-dark,
.ag-theme-material,
.ag-theme-balham {
  /* Set the font family at the theme level */
  font-family: 'Lato', sans-serif !important;
  
  /* ag-Grid CSS variables for fonts */
  --ag-font-family: 'Lato', sans-serif !important;
  --ag-font-size: 12px !important;
  --ag-header-font-family: 'Lato', sans-serif !important;
  --ag-header-font-size: 12px !important;
  --ag-header-font-weight: 600 !important;
}

/* 4. Header cells - matching production styling */
.ag-header-cell,
.ag-header-group-cell {
  font-family: 'Lato', sans-serif !important;
}

.ag-header-cell-label,
.ag-header-cell-text {
  font-family: 'Lato', sans-serif !important;
  text-transform: uppercase !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  letter-spacing: 0.5px !important;
}

/* 5. Grid cells */
.ag-cell {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
  font-weight: 400 !important;
}

/* 6. Cell values and text */
.ag-cell-value,
.ag-group-value {
  font-family: 'Lato', sans-serif !important;
}

/* 7. Filter and menu fonts */
.ag-filter,
.ag-menu,
.ag-menu-list,
.ag-filter-body-wrapper,
.ag-filter-condition {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 8. Pagination */
.ag-paging-panel,
.ag-paging-page-summary,
.ag-paging-description {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 9. Status bar */
.ag-status-bar {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 10. Overlay text (loading, no rows) */
.ag-overlay-loading-center,
.ag-overlay-no-rows-center {
  font-family: 'Lato', sans-serif !important;
}

/* 11. Force inheritance for all ag-Grid child elements */
.ag-root-wrapper,
.ag-root-wrapper * {
  font-family: inherit !important;
}

/* 12. GraviGrid specific overrides */
.gravi-grid-container {
  font-family: 'Lato', sans-serif !important;
}

.gravi-grid-container .ag-root-wrapper {
  font-family: 'Lato', sans-serif !important;
}

/* Ensure proper font rendering */
body {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Component-specific styles */
.detail-tabs .ant-tabs-tab.ant-tabs-tab-active {
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

/* Better responsive font sizing that matches Gravitate main app */
@media only screen and (max-width: 768px) {
  body {
    font-size: 12px !important;
  }
}

@media only screen and (max-width: 480px) {
  body {
    font-size: 11px !important;
  }
}`;
}
