// FIXED Theming system generators - now creates simpler structure without lazy loading issues

// UPGRADED: Complete theme configuration with ThemeImportComponent for proper navigation
export function generateThemeConfig() {
  return `import React from 'react';

export const themeConfigs = {
  OSP: {
    display: 'OSP',
    key: 'OSP',
    ThemeImportComponent: React.lazy(() => import('./ThemeComponents/OSPTheme')),
    isDark: false,
    default: false,
    colors: {
      info: '#002B58',
      nav1: '#0F1121',
      nav2: '#8da6c2',
    },
  },
  'PE Light': {
    display: 'PE Light',
    key: 'PE Light',
    ThemeImportComponent: React.lazy(() => import('./ThemeComponents/PELightTheme')),
    isDark: false,
    default: true,
    colors: {
      info: '#0C5A58',
      nav1: '#0C5A58',
      nav2: '#7bc093',
    },
  },
  'PE Dark': {
    display: 'PE Dark',
    key: 'PE Dark',
    ThemeImportComponent: React.lazy(() => import('./ThemeComponents/PEDarkTheme')),
    isDark: true,
    default: false,
    colors: {
      info: '#0eba9b',
      nav1: '#51B073',
      nav2: '#7bc093',
    },
  },
  BP: {
    display: 'BP',
    key: 'BP',
    ThemeImportComponent: React.lazy(() => import('./ThemeComponents/BPTheme')),
    isDark: false,
    default: false,
    colors: {
      info: '#74CDD7',
      nav1: '#007f00',
      nav2: '#33a233',
    },
  },
};

export const getFilteredThemes = () => {
  const defaultKey = Object.entries(themeConfigs).find(
    ([_, theme]) => theme.default
  )?.[0];
  
  const augmentedThemes = Object.entries(themeConfigs)
    .reduce((obj, [key, value]) => {
      obj[key] = { ...value, default: defaultKey === key };
      return obj;
    }, {} as Record<string, any>);
    
  return augmentedThemes;
};

export type ThemeConfigs = typeof themeConfigs;
export type ThemeConfigDisplay = ThemeConfigs[keyof ThemeConfigs]['display'];`;
}

// Theme component generators for proper navigation theming
export function generateOSPTheme() {
  return `import React from "react";
import "../../Theming/Themes/OSP/osp-theme.less";
import "@gravitate-js/excalibrr/dist/index.css";

const OSPTheme: React.FC = () => <React.Fragment />;
export default OSPTheme;`;
}

export function generatePELightTheme() {
  return `import React from "react";
import "../../Theming/Themes/PE/light-theme.less";
import "@gravitate-js/excalibrr/dist/index.css";

const PELightTheme: React.FC = () => <React.Fragment />;

export default PELightTheme;`;
}

export function generatePELightThemeCSS() {
  return `/* PE Light Theme LESS */
/* Based on production PE theme from Gravitate.Dotnet.Next */

@import '../core.less';
@import '../../ThemeBase/base.less';

:root {
  /* Background colors */
  --bg-1: #ffffff;
  --bg-2: #f8f9fa;
  --bg-3: #eef0f8;
  --site-bg: #f5f6fa;

  /* PE theme colors (green palette) */
  --theme-color-1: #0c5a58;
  --theme-color-2: #51b073;
  --theme-color-3: #64d28d;
  --theme-color-4: #725ac1;
  --theme-optimal: #c79c02;

  /* Status colors */
  --theme-error: #f22939;
  --theme-success: #64d28d;
  --theme-warning: #f26e29;
  --theme-info: #cce5ff;
  --theme-option: #8dabc4;

  /* Gray scale (matches production) */
  --gray-900: #333333;
  --gray-800: #3a3a3a;
  --gray-700: #474747;
  --gray-600: #5c5c5c;
  --gray-500: #808080;
  --gray-400: #999999;
  --gray-300: #b3b3b3;
  --gray-200: #c9c9c9;
  --gray-100: #e6e6e6;
  --dark-gray: #303030;

  /* Themed gradients */
  --primary-gradient: linear-gradient(#0a504e 0%, #0c5a58 100%);
  --secondary-gradient: linear-gradient(#51b073 0%, #5cc080 100%);
  --third-gradient: linear-gradient(#64d28d 0%, #71d797 100%);

  /* CRITICAL: Navigation variables that Excalibrr actually uses */
  --nav-background: var(--primary-gradient);
  --nav-highlight: var(--theme-color-2);
  
  /* Text colors */
  --text-color: #495057;
  --text-color-secondary: #6c757d;
}

/* Force all navigation elements to use theme colors */
.ant-layout-sider,
.ant-layout-sider-children,
[class*="ant-layout-sider"] {
  background: var(--nav-background) !important;
}

.ant-menu,
.ant-menu-root,
.ant-menu-vertical,
.ant-menu-inline {
  background: var(--nav-background) !important;
  color: #ffffff !important;
}

.ant-menu-item,
.ant-menu-submenu-title {
  color: #ffffff !important;
  background: transparent !important;
}

.ant-menu-item:hover,
.ant-menu-submenu-title:hover {
  background-color: var(--nav-highlight) !important;
  color: #ffffff !important;
}

.ant-menu-item-selected,
.ant-menu-item-active {
  background-color: var(--nav-highlight) !important;
  color: #ffffff !important;
}

/* Ant Design Icon colors in navigation */
.ant-menu-item .anticon,
.ant-menu-submenu-title .anticon {
  color: #ffffff !important;
}

/* Navigation title styling */
.ant-layout-sider .ant-menu-item-group-title {
  color: #ffffff !important;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

/* Header navigation */
.ant-layout-header {
  background: #ffffff !important;
  border-bottom: 1px solid var(--gray-300) !important;
  padding: 0 24px !important;
}

/* Avatar styling */
.ant-avatar {
  background: var(--primary-gradient) !important;
  color: #ffffff !important;
  border: 2px solid var(--theme-color-2) !important;
}

/* Primary button theming */
.ant-btn-primary {
  background-color: var(--theme-color-2);
  border-color: var(--theme-color-2);
}

.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background-color: var(--theme-color-3);
  border-color: var(--theme-color-3);
}`;
}

export function generatePEDarkTheme() {
  return `import React from 'react';
import '@gravitate-js/excalibrr/dist/index.css';

const PEDarkTheme: React.FC = () => <React.Fragment />;
export default PEDarkTheme;`;
}

export function generateBPTheme() {
  return `import React from 'react';
import '@gravitate-js/excalibrr/dist/index.css';

const BPTheme: React.FC = () => <React.Fragment />;
export default BPTheme;`;
}
// This prevents the import errors that were causing the React application to fail

// Legacy functions kept for backward compatibility but now return simple CSS
export function generateLightTheme() {
  return `/* OSP Theme Styles - Embedded directly in main CSS */`;
}

export function generateDarkTheme() {
  return `/* PE Dark Theme Styles - Embedded directly in main CSS */`;
}

// CSS Generators - These are still useful for styling
export function generateOSPThemeCSS() {
  return `/* OSP Theme Variables */
:root {
  --primary-color: #002B58;
  --info-color: #002B58;
  --nav1-color: #0F1121;
  --nav2-color: #8da6c2;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

/* OSP theme customizations */
.ant-btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.ant-btn-primary:hover {
  background-color: var(--info-color);
  border-color: var(--info-color);
}`;
}

export function generatePEDarkThemeCSS() {
  return `/* PE Dark Theme Variables */
:root {
  --primary-color: #0eba9b;
  --info-color: #0eba9b;
  --nav1-color: #51B073;
  --nav2-color: #7bc093;
  --background-color: #141414;
  --component-background: #1f1f1f;
  --body-background: #000000;
  --text-color: rgba(255, 255, 255, 0.85);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--body-background);
  color: var(--text-color);
}

/* PE Dark theme customizations */
.ant-btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.ant-btn-primary:hover {
  background-color: var(--info-color);
  border-color: var(--info-color);
}`;
}

export function generateBPThemeCSS() {
  return `/* BP Theme Variables */
:root {
  --primary-color: #74CDD7;
  --info-color: #74CDD7;
  --nav1-color: #007f00;
  --nav2-color: #33a233;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

/* BP theme customizations */
.ant-btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.ant-btn-primary:hover {
  background-color: var(--info-color);
  border-color: var(--info-color);
}`;
}

// Keep the rest of the legacy functions for backward compatibility
export function generateCoreLess() {
  return `/* Core Theming Variables with Lato Font Integration */

/* Font-face declarations using Google Fonts CDN for reliability */
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

/* Global font application */
body {
  font-family: 'Lato', sans-serif !important;
}

/* ag-Grid specific font styling */
.ag-theme-alpine,
.ag-theme-alpine-dark {
  font-family: 'Lato', sans-serif !important;
  --ag-font-family: 'Lato', sans-serif !important;
  --ag-font-size: 12px !important;
  --ag-header-font-family: 'Lato', sans-serif !important;
  --ag-header-font-size: 12px !important;
  --ag-header-font-weight: 600 !important;
}
`;
}

export function generateLightThemeLess() {
  return generateOSPThemeCSS();
}

export function generateDarkThemeLess() {
  return generatePEDarkThemeCSS();
}

export function generateLightThemeJsx() {
  return `/* Light theme styles embedded in main CSS */`;
}

export function generateDarkThemeJsx() {
  return `/* Dark theme styles embedded in main CSS */`;
}
