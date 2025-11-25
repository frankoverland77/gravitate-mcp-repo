import React from 'react';
import { CellStyleParams } from 'ag-grid-community';

// =============================================================================
// Colors
// =============================================================================

export const COLORS = {
  // Row selection states
  SELECTED_ROW_BG: '#000000',
  SELECTED_ROW_TEXT: '#ffffff',

  // Price change indicators
  PRICE_INCREASE_BG: '#fff7e6',
  PRICE_INCREASE_TEXT: '#d46b08',
  PRICE_DECREASE_BG: '#f6ffed',
  PRICE_DECREASE_TEXT: '#52c41a',

  // Placeholder styling
  PLACEHOLDER_BG: '#f3e8ff',
  PLACEHOLDER_TEXT: '#722ed1',

  // Text hierarchy
  DARK_TEXT: '#262626',
  MEDIUM_TEXT: '#595959',
  LIGHT_TEXT: '#8c8c8c',

  // Status colors
  ERROR_BG: '#fff1f0',
  ERROR_TEXT: '#cf1322',
  SUCCESS_BG: '#f6ffed',
  SUCCESS_TEXT: '#52c41a',
  WARNING_BG: '#fffbe6',
  WARNING_TEXT: '#d48806',

  // UI elements
  PRIMARY_BLUE: '#0958d9',
  SUCCESS_GREEN: '#51b073',
  BORDER_GRAY: '#d9d9d9',
  BACKGROUND_GRAY: '#fafafa',
} as const;

// =============================================================================
// Cell Styles
// =============================================================================

export const SELECTED_ROW_STYLE: React.CSSProperties = {
  backgroundColor: COLORS.SELECTED_ROW_BG,
  color: COLORS.SELECTED_ROW_TEXT,
  fontWeight: 600,
};

export const MONOSPACE_CELL_STYLE: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '11px',
};

export const RIGHT_ALIGNED_MONOSPACE_STYLE: React.CSSProperties = {
  textAlign: 'right',
  fontFamily: 'monospace',
};

export const PLACEHOLDER_CELL_STYLE: React.CSSProperties = {
  backgroundColor: COLORS.PLACEHOLDER_BG,
  color: COLORS.PLACEHOLDER_TEXT,
  fontWeight: 600,
};

export const PRICE_INCREASE_STYLE: React.CSSProperties = {
  ...RIGHT_ALIGNED_MONOSPACE_STYLE,
  backgroundColor: COLORS.PRICE_INCREASE_BG,
  color: COLORS.PRICE_INCREASE_TEXT,
};

export const PRICE_DECREASE_STYLE: React.CSSProperties = {
  ...RIGHT_ALIGNED_MONOSPACE_STYLE,
  backgroundColor: COLORS.PRICE_DECREASE_BG,
  color: COLORS.PRICE_DECREASE_TEXT,
};

// =============================================================================
// Cell Style Helper Functions
// =============================================================================

/** Returns selected row styling if row is selected, empty object otherwise */
export const getSelectedRowCellStyle = <T extends { isSelected?: boolean }>(
  params: CellStyleParams<T>
): React.CSSProperties => {
  if (params.data?.isSelected) {
    return SELECTED_ROW_STYLE;
  }
  return {};
};

/** Returns appropriate styling for price change values */
export const getPriceChangeCellStyle = (value: string | null): React.CSSProperties => {
  if (!value) return { color: COLORS.DARK_TEXT };
  if (value.startsWith('+')) {
    return { color: COLORS.ERROR_TEXT };
  }
  if (value.startsWith('-')) {
    return { color: COLORS.SUCCESS_TEXT };
  }
  return { color: COLORS.DARK_TEXT };
};

/** Returns styling based on proposed vs current price comparison */
export const getProposedPriceCellStyle = (
  proposedPrice: number | undefined,
  currentPrice: number | undefined
): React.CSSProperties => {
  if (proposedPrice === undefined || currentPrice === undefined) {
    return RIGHT_ALIGNED_MONOSPACE_STYLE;
  }
  const priceDiff = proposedPrice - currentPrice;
  if (priceDiff > 0) {
    return PRICE_INCREASE_STYLE;
  }
  if (priceDiff < 0) {
    return PRICE_DECREASE_STYLE;
  }
  return RIGHT_ALIGNED_MONOSPACE_STYLE;
};

// =============================================================================
// Value Formatters
// =============================================================================

/** Format a number as currency with 4 decimal places */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return '';
  return `$${value.toFixed(4)}`;
};

/** Format a number with 4 decimal places */
export const formatDecimal = (value: number | null | undefined): string => {
  if (value == null) return '';
  return value.toFixed(4);
};

/** Format a number as percentage with 1 decimal place */
export const formatPercentage = (value: number | null | undefined): string => {
  if (value == null) return '';
  return `${value.toFixed(1)}%`;
};

// =============================================================================
// Form Options
// =============================================================================

export const VALID_FOR_OPTIONS = [
  { value: 'midnight-midnight', label: 'Midnight to Midnight' },
  { value: '24-hours', label: '24 Hours' },
  { value: '48-hours', label: '48 Hours' },
  { value: '1-week', label: '1 Week' },
  { value: 'until-cancelled', label: 'Until Cancelled' },
];

export const WEEKEND_RULE_OPTIONS = [
  { value: 'use-friday', label: 'Use Friday' },
  { value: 'use-saturday', label: 'Use Saturday' },
  { value: 'skip', label: 'Skip Weekend' },
];

export const HOLIDAY_RULE_OPTIONS = [
  { value: 'use-last-business-day', label: 'Use Last Business Day' },
  { value: 'use-prior-day', label: 'Use Prior Day' },
  { value: 'use-next-day', label: 'Use Next Day' },
  { value: 'skip', label: 'Skip Holiday' },
];

export const PAYMENT_TERMS_OPTIONS = [
  { value: 'net-30', label: 'Net 30' },
  { value: 'net-15', label: 'Net 15' },
  { value: 'net-10', label: 'Net 10' },
  { value: 'due-on-receipt', label: 'Due on Receipt' },
  { value: '2-10-net-30', label: '2/10 Net 30' },
];

export const FREIGHT_TERMS_OPTIONS = [
  { value: 'fob-origin', label: 'FOB Origin' },
  { value: 'fob-destination', label: 'FOB Destination' },
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'collect', label: 'Collect' },
];

// =============================================================================
// Formula Component Options
// =============================================================================

export const PERCENTAGE_OPTIONS = [
  { value: '0%', label: '0%' },
  { value: '5%', label: '5%' },
  { value: '10%', label: '10%' },
  { value: '25%', label: '25%' },
  { value: '50%', label: '50%' },
  { value: '75%', label: '75%' },
  { value: '90%', label: '90%' },
  { value: '95%', label: '95%' },
  { value: '100%', label: '100%' },
];

export const SOURCE_OPTIONS = [
  { value: 'Argus', label: 'Argus' },
  { value: 'OPIS', label: 'OPIS' },
  { value: 'Platts', label: 'Platts' },
  { value: 'Bloomberg', label: 'Bloomberg' },
  { value: 'ICE', label: 'ICE' },
  { value: 'NYMEX', label: 'NYMEX' },
  { value: 'Fixed', label: 'Fixed' },
  { value: 'Formula', label: 'Formula' },
];

export const INSTRUMENT_OPTIONS = [
  { value: 'CBOB USGC', label: 'CBOB USGC' },
  { value: 'CBOB', label: 'CBOB' },
  { value: 'CBOB Chicago', label: 'CBOB Chicago' },
  { value: 'CBOB Gulf', label: 'CBOB Gulf' },
  { value: 'Premium USGC', label: 'Premium USGC' },
  { value: 'CARBOB', label: 'CARBOB' },
  { value: 'ULSD', label: 'ULSD' },
  { value: 'Jet Fuel', label: 'Jet Fuel' },
  { value: 'Ethanol', label: 'Ethanol' },
  { value: 'RBOB Futures', label: 'RBOB Futures' },
  { value: 'Renewable Diesel', label: 'Renewable Diesel' },
  { value: 'Differential', label: 'Differential' },
  { value: 'Discount', label: 'Discount' },
];

export const TIMING_OPTIONS = [
  { value: 'Prior Day', label: 'Prior Day' },
  { value: 'Current Day', label: 'Current Day' },
  { value: 'Weekly Avg', label: 'Weekly Avg' },
  { value: 'Monthly Avg', label: 'Monthly Avg' },
  { value: 'Spot', label: 'Spot' },
];

export const LOCATION_OPTIONS = [
  { value: 'Gulf Coast', label: 'Gulf Coast' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'New York', label: 'New York' },
  { value: 'Houston', label: 'Houston' },
  { value: 'Los Angeles', label: 'Los Angeles' },
  { value: 'Group 3', label: 'Group 3' },
];

// =============================================================================
// Grid Defaults
// =============================================================================

export const DEFAULT_GRID_OPTIONS = {
  headerHeight: 40,
  rowHeight: 40,
  domLayout: 'normal' as const,
  suppressRowClickSelection: false,
  rowSelection: 'multiple' as const,
};

export const GRID_COLUMN_WIDTHS = {
  CHECKBOX: 50,
  ACTIONS: 100,
  SMALL: 80,
  MEDIUM: 120,
  LARGE: 160,
  EXTRA_LARGE: 200,
  FORMULA: 400,
};

// =============================================================================
// Default Text Values
// =============================================================================

export const DEFAULT_TERMS = 'Standard terms and conditions apply. Payment due within 30 days of delivery.';

// =============================================================================
// View Mode Options
// =============================================================================

export const VIEW_MODE_OPTIONS = [
  { value: 'panel', label: 'Panel View' },
  { value: 'columns', label: 'Column View' },
  { value: 'rank', label: 'Rank View' },
  { value: 'analytics', label: 'Analytics View' },
];

// =============================================================================
// Feature Mode Options
// =============================================================================

export const FEATURE_MODE_OPTIONS = [
  { value: 'mvp', label: 'MVP Mode' },
  { value: 'future', label: 'Future State' },
];
