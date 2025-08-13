// Theming system generators

// NEW: Updated theme configuration to match working example
export function generateThemeConfig() {
  return `import React from 'react';

export const themeConfigs = {
  LIGHT_MODE: {
    isFallback: true,
    display: 'Light',
    key: 'LIGHT_MODE',
    ThemeImportComponent: React.lazy(() => import('./ThemeComponents/LightTheme')),
    isDark: false,
    default: true,
  },
  DARK_MODE: {
    display: 'Dark',
    key: 'DARK_MODE',
    ThemeImportComponent: React.lazy(() => import('./ThemeComponents/DarkTheme')),
    isDark: true,
    default: false,
  },
};

export const getFilteredThemes = () => {
  const defaultKey = Object.entries(themeConfigs).find(
    ([_, theme]) => theme.display === "Light"
  )?.[0];
  
  const augmentedThemes = Object.entries(themeConfigs)
    .filter(([_, theme]) => ["Light", "Dark"].includes(theme.display))
    .reduce((obj, [key, value]) => {
      obj[key] = { ...value, default: defaultKey === key };
      return obj;
    }, {});
    
  return augmentedThemes;
};

export type ThemeConfigs = typeof themeConfigs;
export type ThemeConfigDisplay = ThemeConfigs[keyof ThemeConfigs]['display'];`;
}

// NEW: Theme component files
export function generateLightTheme() {
  return `import React from 'react';
import '../../Theming/Themes/Light/light-theme.less';
import '@gravitate-js/excalibrr/dist/index.css';

const LightTheme: React.FC = () => <React.Fragment />;
export default LightTheme;`;
}

export function generateDarkTheme() {
  return `import React from 'react';
import '../../Theming/Themes/Dark/dark-theme.less';
import '@gravitate-js/excalibrr/dist/index.css';

const DarkTheme: React.FC = () => <React.Fragment />;
export default DarkTheme;`;
}

// NEW: Theme LESS files (basic theming structure)
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
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u8w4BMUTPHjxsAXC-qNiXg7Q.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
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

@font-face {
  font-family: 'Lato';
  src: url('https://fonts.gstatic.com/s/lato/v24/S6u_w4BMUTPHjxsI5wq_FQftx9897sxZ.woff2') format('woff2');
  font-weight: 600;
  font-style: italic;
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

.ag-theme-alpine .ag-ltr .ag-cell,
.ag-theme-alpine-dark .ag-ltr .ag-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px;
  line-height: 1.5;
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* Header cells with proper Lato font */
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

.ag-header-cell-filtered {
  background-color: var(--theme-color-2) !important;
  color: #fff !important;
}

.ag-header-cell-filtered span {
  color: #fff !important;
}

.ag-cell-wrapper.ag-row-group {
  align-items: center;
}

/* Force Lato font on all ag-Grid elements */
.ag-root-wrapper,
.ag-root-wrapper * {
  font-family: 'Lato', sans-serif !important;
}

input[type='number'] {
  border: none;
  font-family: 'Lato', sans-serif !important;
}`;
}

export function generateLightThemeLess() {
  return `/* Light Theme Variables */
@import 'antd/dist/antd.less';

/*** Theme YOUR Colors here!! **/
@bg-1: #ffffff;
@bg-2: #f8f9fa;
@bg-3: #eef0f8;

@theme-color-1: #0C5A58;
@theme-color-2: #51B073;
@theme-color-3: #64D28D;
@theme-color-4: #725ac1;
@theme-optimal: #c79c02;

@theme-error: #f22939;
@theme-success: #64d28d;
@theme-warning: #f26e29;
@theme-info: #cce5ff;
@theme-option: #8dabc4;

/*** Theme color generation and 3rd party overrides **/
@import url('../../ThemeBase/light.less');
/*** Base styles and overrides **/
@import url('../../ThemeBase/base.less');

.horizontal-nav .logo {
  background-image: url('../../../../assets/SiteImages/grav-logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 200px;
}
`;
}

export function generateDarkThemeLess() {
  return `/* Dark Theme Variables */
@import '../../core.less';

:root {
  --background-color: #141414;
  --component-background: #1f1f1f;
  --body-background: #000000;
  --text-color: rgba(255, 255, 255, 0.85);
  --text-color-secondary: rgba(255, 255, 255, 0.65);
  --border-color-base: #434343;
  --theme-color-2: #177ddc;
  --gray-100: #ffffff;
  --gray-300: #434343;
  --gray-400: #595959;
  --bg-1: #1f1f1f;
  --theme-option: #237804;
}

body {
  background-color: var(--body-background);
  color: var(--text-color);
}`;
}

export function generateLightThemeJsx() {
  return `import React from 'react';

const LightTheme = () => <React.Fragment />;
export default LightTheme;`;
}

export function generateDarkThemeJsx() {
  return `import React from 'react';

const DarkTheme = () => <React.Fragment />;
export default DarkTheme;`;
}

// NEW: Theme Base files that were missing
export function generateThemeBaseLess() {
  return `@import '../core.less';
@border-radius-base: 0px;
@font-size-base: 14px; /* FIXED: Changed from 12px to normal 14px */
@font-family: 'lato';
@text-color: var(--gray-700);

@component-background: @bg-1;
@popover-background: @bg-1;
@border-color-split: @bg-2;
@btn-default-bg: @bg-2;

@border-color-base: var(--gray-300);
@table-header-sort-active-bg: var(--theme-color-2-dim);
@table-header-sort-active-bg: var(--theme-color-2-dim);

@dark-gray: #303030;
@primary-color: @theme-color-2;`;
}

export function generateThemeBaseLightLess() {
  return `:root {
  /* GRAY SCALE*/
  --gray-900: lighten(@dark-gray, 2%);
  --gray-800: lighten(@dark-gray, 5%);
  --gray-700: lighten(@dark-gray, 16%);
  --gray-600: lighten(@dark-gray, 28%);
  --gray-500: lighten(@dark-gray, 45%);
  --gray-400: lighten(@dark-gray, 58%);
  --gray-300: lighten(@dark-gray, 68%);
  --gray-200: lighten(@dark-gray, 72%);
  --gray-100: lighten(@dark-gray, 80%);
  --dark-gray: @dark-gray;

  --bg-1: @bg-1;
  --bg-2: @bg-2;
  --bg-3: @bg-3;
  --site-bg: #f5f6fa;
  /* THEME COLORS*/
  --theme-color-1: @theme-color-1;
  --theme-color-2: @theme-color-2;
  --theme-color-3: @theme-color-3;
  --theme-color-4: @theme-color-4;
  --theme-optimal: @theme-optimal;

  /* CONTROL COLORS*/
  --theme-error: @theme-error;
  --theme-success: @theme-success;
  --theme-warning: @theme-warning;
  --theme-info: @theme-info;
  --theme-option: @theme-option;

  --theme-color-1-dim: lighten(@theme-color-1, 70%);
  --theme-color-2-dim: lighten(@theme-color-2, 70%);
  --theme-color-3-dim: lighten(@theme-color-3, 40%);
  --theme-color-4-dim: lighten(@theme-color-4, 40%);
  --theme-success-dim: #DBF4E4;
  --theme-warning-dim: #FCE0D1;
  --theme-error-dim: #FCD1D5;
  --theme-optimal-dim: lighten(@theme-optimal, 40%);

  --theme-color-1-trans: fade(@theme-color-1, 15%);
  --theme-color-2-trans: fade(@theme-color-2, 15%);
  --theme-color-3-trans: fade(@theme-color-3, 15%);
  --theme-color-4-trans: fade(@theme-color-4, 15%);
  --theme-success-trans: fade(@theme-success, 15%);
  --theme-warning-trans: fade(@theme-warning, 15%);
  --theme-error-trans: fade(@theme-error, 15%);

  /* THEME GRADIENTS*/
  --primary-gradient: linear-gradient(darken(@theme-color-1, 10%) 0%, lighten(@theme-color-1, 0%) 100%);
  --secondary-gradient: linear-gradient(@theme-color-2 0%, lighten(@theme-color-2, 10%) 100%);
  --third-gradient: linear-gradient(@theme-color-3 0%, lighten(@theme-color-3, 10%) 100%);
  --success-gradient: linear-gradient(@theme-success 0%, lighten(@theme-success, 10%) 100%);
  --warning-gradient: linear-gradient(@theme-warning 0%, lighten(@theme-warning, 10%) 100%);
  --error-gradient: linear-gradient(@theme-error 0%, lighten(@theme-error, 10%) 100%);

  /* NON-COLOR VARIABLES*/
  --container-border-radius: @border-radius-base;
  --button-border-radius: 2px;
  --box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15);
  --box-shadow-light: 0px 2px 6px rgba(0, 0, 0, 0.05);

  /* Theme Root Vars */
  --nav-background: var(--primary-gradient);
  --nav-highlight: var(--theme-color-2);
}

.orders-grid-container .orders-row-container {
  background: var(--bg-1);
}

.trip-grid-row .ant-col .scheduled-cell {
  background: var(--gray-200);
  border-right: solid 1px var(--gray-400);
}

.ant-select-tree-checkbox-inner {
  border: solid 1px var(--gray-300);
}

.notification-icon {
  color: lighten(@primary-color, 10%);
}

.ag-theme-alpine {
  /* use theme parameters where possible */
  --ag-foreground-color: var(--gray-900);
  --ag-secondary-foreground-color: var(--gray-700);
  --ag-border-color: var(--gray-300);
  --ag-border-radius: 5px;
  --ag-font-size: 1em;
  font-family: 'Lato';
  --ag-selected-row-background-color: var(--theme-color-1-trans);
  --ag-range-selection-border-color: var(--theme-color-1);
  --ag-row-hover-color: var(--theme-color-1-trans);
  --ag-checkbox-checked-color: var(--theme-color-2);
  --ag-checkbox-unchecked-color: var(--gray-200);

  --ag-range-selection-background-color: var(--theme-color-1-trans);

  .ag-cell-wrapper.ag-row-group {
    align-items: center;
  }

  .ag-row {
    font-size: 1em;
  }

  font-size: 1em;
}

.ag-header-cell-text {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.9em;
}

.site-toolbar {
  h5 {
    padding: 0.25em 1em;
  }

  .selected-group {
    background: var(--theme-color-1);
    color: white;
    font-weight: 600;
    border-radius: 6px;
  }

  .selected-group a {
    color: white;
  }

  h5,
  h5 a {
    color: var(--gray-600);
  }

  .heading {
    font-size: 1.3em;
  }

  .submenu-links a {
    color: var(--gray-600);
  }

  .submenu-links a:hover {
    color: var(--theme-color-2);
  }

  .submenu-links a.selected {
    font-weight: bold;
    color: var(--theme-color-2);
  }

  .submenu-dropdown-link {
    font-size: 1.4em;
    font-weight: bold;
    color: var(--gray-600);
    transition: 0.5s ease;
  }

  .submenu-dropdown-link:hover {
    color: var(--theme-color-2);
  }
}


.control-panel-trigger {
  cursor: pointer;
  border-radius: 5px;
}

.control-panel-trigger:hover {
  background: var(--gray-200);
}

.trans-login-logo {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
}
.login-logo {
  width: 350px;
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
}
.nav-logo {
  background-image: url('../../../../assets/SiteImages/grav-logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
}`;
}

export function generateThemeBaseDarkLess() {
  return `:root {
  /* GRAY SCALE*/
  --dark-gray: @dark-gray;
  --gray-100: lighten(@dark-gray, 5%);
  --gray-200: lighten(@dark-gray, 16%);
  --gray-300: lighten(@dark-gray, 28%);
  --gray-400: lighten(@dark-gray, 45%);
  --gray-500: lighten(@dark-gray, 52%);
  --gray-600: lighten(@dark-gray, 65%);
  --gray-700: lighten(@dark-gray, 72%);
  --gray-800: lighten(@dark-gray, 80%);

  --bg-1: @bg-1;
  --bg-2: @bg-2;
  --bg-3: @bg-3;

  --theme-color-1: @theme-color-1;
  --theme-color-2: @theme-color-2;
  --theme-color-3: @theme-color-3;
  --theme-color-4: @theme-color-4;
  --theme-optimal: @theme-optimal;

  /* CONTROL COLORS*/
  --theme-error: @theme-error;
  --theme-success: @theme-success;
  --theme-warning: @theme-warning;
  --theme-info: @theme-info;
  --theme-option: @theme-option;

  --theme-color-1-dim: fade(@theme-color-1, 15%);
  --theme-color-2-dim: fade(@theme-color-2, 15%);
  --theme-color-3-dim: fade(@theme-color-3, 15%);
  --theme-color-4-dim: fade(@theme-color-4, 15%);
  --theme-success-dim: fade(@theme-success, 15%);
  --theme-warning-dim: fade(@theme-warning, 15%);
  --theme-error-dim: fade(@theme-error, 15%);
  --theme-optimal-dim: fade(@theme-optimal, 15%);

  --theme-color-1-trans: fade(@theme-color-1, 15%);
  --theme-color-2-trans: fade(@theme-color-2, 15%);
  --theme-color-3-trans: fade(@theme-color-3, 15%);
  --theme-color-4-trans: fade(@theme-color-4, 15%);
  --theme-success-trans: fade(@theme-success, 15%);
  --theme-warning-trans: fade(@theme-warning, 15%);
  --theme-error-trans: fade(@theme-error, 15%);

  /* THEME GRADIENTS*/
  --primary-gradient: linear-gradient(@theme-color-1 0%, lighten(@theme-color-1, 15%) 100%);
  --secondary-gradient: linear-gradient(@theme-color-2 0%, lighten(@theme-color-2, 10%) 100%);
  --third-gradient: linear-gradient(@theme-color-3 0%, lighten(@theme-color-3, 10%) 100%);
  --success-gradient: linear-gradient(@theme-success 0%, lighten(@theme-success, 10%) 100%);
  --warning-gradient: linear-gradient(@theme-warning 0%, lighten(@theme-warning, 10%) 100%);
  --error-gradient: linear-gradient(@theme-error 0%, lighten(@theme-error, 10%) 100%);

  /* NON-COLOR VARIABLES*/
  --container-border-radius: 7px;
  --button-border-radius: 30px;
  --box-shadow: 0 10px 20px rgb(0 2 15 / 34%);
  --box-shadow-light: 0 10px 20px rgb(0 2 15 / 14%);

  /* Theme Root Vars */
  --nav-background: var(--primary-gradient);
  --nav-highlight: var(--theme-color-3);
}

.ant-layout .page-toolbar {
  background-color: var(--bg-1);
}
.rdrDateRangePickerWrapper,
.rdrCalendarWrapper,
.rdrDateDisplayWrapper,
.rdrDateDisplayItem,
.rdrDefinedRangesWrapper,
.rdrStaticRangeLabel {
  background: var(--bg-2);
}
.rdrCalendarWrapper {
  color: var(--gray-700);
}
.rdrMonthName,
.rdrDayNumber span,
.rdrMonthAndYearPickers select,
.rdrDateDisplayItemActive input,
.rdrDateDisplayItem input {
  color: var(--gray-700);
}
.rdrStaticRange:hover .rdrStaticRangeLabel {
  background-color: var(--bg-3);
}
.rdrInputRange .rdrInputRangeInput {
  background: var(--bg-3);
  color: var(--gray-700);
}
.rdrMonthAndYearWrapper .rdrNextPrevButton {
  background: var(---theme-color-2-dim);
  color: var(---theme-color-2);
  border: solid 1px var(--theme-color-2);
}
.rdrMonthAndYearPickers .rdrPprevButton i,
.rdrMonthAndYearPickers .rdrNextButton i {
  border-color: transparent transparent transparent var(--theme-color-2);
}
.rdrNextPrevButton.rdrPprevButton {
  background: var(--bg-2);
  color: var(--gray-800);
}
tr.ant-table-row.ant-table-row-level-0 {
  background: var(--bg-2);
}

.ag-theme-alpine-dark {
  /* use theme parameters where possible */
  --ag-foreground-color: var(--gray-700);
  --ag-secondary-foreground-color: var(--gray-500);
  --ag-border-color: var(--gray-300);
  --ag-border-radius: 5px;
  --ag-font-size: 1em; /* FIXED: Changed from 11px to 1em to match light theme */
  --ag-background-color: var(--bg-1);
  --ag-control-panel-background-color: var(--bg-2);
  --ag-header-background-color: var(--bg-2);
  --ag-odd-row-background-color: var(--bg-1);
  font-family: 'Lato';
  .ag-row {
    font-size: 1em;
  }
  .ag-cell-wrapper.ag-row-group {
    align-items: center;
  }
  font-size: 1em; /* FIXED: Changed from 11px to 1em */
}
.ag-header-cell-text {
  text-transform: uppercase;
}`;
}

export function generateDarkMapThemeJs() {
  return `export const darkMapTheme = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ],
}`;
}
