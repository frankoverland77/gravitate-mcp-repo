// Authentic Excalibrr navigation component generator
// Uses real components: HorizontalToolbar, VerticalNav, PageWrapper

import { GravitateTheme } from "./themeSystem.js";
import { getAgGridFontCSS, getInlineFontStyles } from "./gridFontFix.js";

export interface ColumnConfig {
  field: string;
  headerName: string;
  type?: string;
  width?: number;
  maxWidth?: number;
}

export interface GridConfig {
  columns?: ColumnConfig[];
  sampleData?: Record<string, any>[];
  title?: string;
  uniqueIdField?: string;
}

export interface NavigationConfig {
  theme: GravitateTheme;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  currentModule?: string;
  currentPage?: string;
}

/**
 * Generate proper HorizontalToolbar component usage
 */
export function generateHorizontalToolbar(config: NavigationConfig): string {
  const { theme, user, currentModule = "PricingEngine" } = config;
  
  return `import { HorizontalToolbar } from '@gravitate-js/excalibrr';
import { NavigationContextProvider } from '@gravitate-js/excalibrr';

// Mock page configuration based on your actual structure
const pageConfig = {
  PricingEngine: {
    displayName: "Pricing Engine",
    pages: {
      ContractManagement: { displayName: "Contract Management" },
      PriceAudit: { displayName: "Price Audit" },
      Formulas: { displayName: "Formulas" }
    }
  },
  Admin: {
    displayName: "Admin",
    pages: {
      UserManagement: { displayName: "User Management" },
      SiteManagement: { displayName: "Site Management" }
    }
  }
};

function AppHorizontalNav() {
  return (
    <NavigationContextProvider
      currentModule="${currentModule}"
      pageConfig={pageConfig}
      user={{
        name: "${user?.name || 'Frank Designer'}",
        email: "${user?.email || 'frank@gravitate.energy'}",
        avatar: "${user?.avatar || ''}"
      }}
      theme="${theme.key}"
    >
      <HorizontalToolbar
        logoConfig={{
          src: "${theme.assets.logo || ''}",
          alt: "${theme.display} Logo",
          width: 200,
          height: 60
        }}
        userControls={{
          showProfile: true,
          showSettings: true,
          showLogout: true
        }}
        moduleNavigation={true}
        searchEnabled={true}
      />
    </NavigationContextProvider>
  );
}`;
}

/**
 * Generate proper VerticalNav component usage
 */
export function generateVerticalNav(config: NavigationConfig): string {
  const { theme, currentModule = "PricingEngine", currentPage = "ContractManagement" } = config;
  
  return `import { VerticalNav, PageWrapper } from '@gravitate-js/excalibrr';

// Navigation structure based on your actual modules
const navigationItems = [
  {
    key: 'contract-management',
    label: 'Contract Management',
    icon: 'ContractIcon',
    path: '/pricing-engine/contract-management',
    active: '${currentPage}' === 'ContractManagement'
  },
  {
    key: 'price-audit', 
    label: 'Price Audit',
    icon: 'AuditIcon',
    path: '/pricing-engine/price-audit',
    active: '${currentPage}' === 'PriceAudit'
  },
  {
    key: 'formulas',
    label: 'Formulas', 
    icon: 'FormulaIcon',
    path: '/pricing-engine/formulas',
    active: '${currentPage}' === 'Formulas'
  }
];

function AppVerticalNav() {
  return (
    <VerticalNav
      items={navigationItems}
      collapsed={false}
      theme="${theme.key}"
      moduleTitle="${currentModule}"
      onNavigate={(item) => {
        // Handle navigation
        console.log('Navigate to:', item.path);
      }}
      onToggleCollapse={(collapsed) => {
        // Handle sidebar collapse
        console.log('Sidebar collapsed:', collapsed);
      }}
      width={240}
      collapsedWidth={60}
    />
  );
}`;
}

/**
 * Generate complete page layout with proper navigation
 */
export function generateCompleteLayout(config: NavigationConfig, mainContent: string): string {
  const { theme } = config;
  
  return `import React from 'react';
import { 
  HorizontalToolbar, 
  VerticalNav, 
  PageWrapper,
  NavigationContextProvider,
  ThemeContextProvider 
} from '@gravitate-js/excalibrr';

// Theme configuration for ${theme.display}
const themeConfig = {
  key: '${theme.key}',
  display: '${theme.display}',
  isDark: ${theme.isDark},
  colors: ${JSON.stringify(theme.colors, null, 2)},
  assets: {
    logo: '${theme.assets.logo || ''}',
    loginBanner: '${theme.assets.loginBanner || ''}',
    poweredBy: '${theme.assets.poweredBy || ''}'
  }
};

// Page configuration matching your actual structure
const pageConfig = {
  PricingEngine: {
    displayName: "Pricing Engine",
    pages: {
      ContractManagement: { displayName: "Contract Management" },
      PriceAudit: { displayName: "Price Audit" },
      Formulas: { displayName: "Formulas" }
    }
  },
  Admin: {
    displayName: "Admin", 
    pages: {
      UserManagement: { displayName: "User Management" },
      SiteManagement: { displayName: "Site Management" }
    }
  }
};

function AppLayout({ children }) {
  return (
    <ThemeContextProvider theme={themeConfig}>
      <NavigationContextProvider
        currentModule="PricingEngine"
        currentPage="ContractManagement"
        pageConfig={pageConfig}
        user={{
          name: "Frank Designer",
          email: "frank@gravitate.energy"
        }}
      >
        <div className="app-layout theme-${theme.key.toLowerCase()}">
          {/* Horizontal Navigation Bar */}
          <HorizontalToolbar
            logoConfig={{
              src: themeConfig.assets.logo,
              alt: "${theme.display} Logo",
              width: 200,
              height: 60
            }}
            userControls={{
              showProfile: true,
              showSettings: true, 
              showLogout: true
            }}
            moduleNavigation={true}
            searchEnabled={true}
          />
          
          <div className="app-body">
            {/* Vertical Navigation Sidebar */}
            <VerticalNav
              items={[
                {
                  key: 'contract-management',
                  label: 'Contract Management',
                  icon: 'ContractIcon',
                  path: '/pricing-engine/contract-management',
                  active: true
                },
                {
                  key: 'price-audit',
                  label: 'Price Audit', 
                  icon: 'AuditIcon',
                  path: '/pricing-engine/price-audit'
                },
                {
                  key: 'formulas',
                  label: 'Formulas',
                  icon: 'FormulaIcon',
                  path: '/pricing-engine/formulas'
                }
              ]}
              collapsed={false}
              theme="${theme.key}"
              moduleTitle="Pricing Engine"
              width={240}
              collapsedWidth={60}
            />
            
            {/* Main Content Area */}
            <PageWrapper
              title="Contract Management"
              subtitle="Manage and track energy contracts"
              breadcrumbs={[
                { label: 'Pricing Engine', path: '/pricing-engine' },
                { label: 'Contract Management', path: '/pricing-engine/contract-management' }
              ]}
              actions={[
                {
                  label: 'New Contract',
                  type: 'primary',
                  onClick: () => console.log('Create new contract')
                }
              ]}
            >
              {/* Your main content goes here */}
              ${mainContent}
            </PageWrapper>
          </div>
        </div>
        
        <style jsx>{\`
          .app-layout {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          
          .app-body {
            flex: 1;
            display: flex;
          }
          
          /* Apply theme-specific styles */
          .theme-${theme.key.toLowerCase()} {
            ${generateThemeStyles(theme)}
          }
        \`}</style>
      </NavigationContextProvider>
    </ThemeContextProvider>
  );
}

export default AppLayout;`;
}

/**
 * Generate theme-specific CSS styles
 */
function generateThemeStyles(theme: GravitateTheme): string {
  return `
    /* ${theme.display} Theme Styles */
    --bg-primary: ${theme.colors.background[0]};
    --bg-secondary: ${theme.colors.background[1]};
    --bg-tertiary: ${theme.colors.background[2]};
    
    --color-primary: ${theme.colors.primary[0]};
    --color-secondary: ${theme.colors.primary[1]};
    --color-accent: ${theme.colors.primary[2]};
    --color-highlight: ${theme.colors.primary[3]};
    
    --text-primary: ${theme.colors.text[0]};
    --text-secondary: ${theme.colors.text[1]};
    
    --color-success: ${theme.colors.success};
    --color-error: ${theme.colors.error};
    --color-warning: ${theme.colors.warning};
    --color-info: ${theme.colors.info};
    
    background-color: var(--bg-primary);
    color: var(--text-primary);
  `;
}

/**
 * Generate GraviGrid with proper theme integration
 */
export function generateThemedGraviGrid(config: NavigationConfig, gridConfig: GridConfig): string {
  const { theme } = config;
  
  return `import { GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import React, { useEffect } from 'react';

function ThemedDataGrid() {
  // Ensure fonts are loaded
  useEffect(() => {
    // Force font loading
    const style = document.createElement('style');
    style.textContent = \`
      ${getAgGridFontCSS().replace(/`/g, '\\`')}
    \`;
    document.head.appendChild(style);
    
    // Validate fonts after grid renders
    setTimeout(() => {
      const elements = document.querySelectorAll('.ag-header-cell-text, .ag-cell');
      elements.forEach(el => {
        el.style.fontFamily = "'Lato', sans-serif";
      });
    }, 100);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const columnDefs = [
    ${gridConfig.columns?.map((col: ColumnConfig) => `
    {
      headerName: '${col.headerName}',
      field: '${col.field}',
      ${col.type === 'numericColumn' ? 'type: "numericColumn",' : ''}
      ${col.type === 'dateColumn' ? 'type: "dateColumn",' : ''}
      sortable: true,
      filter: true,
      resizable: true
    }`).join(',') || `
    { headerName: 'ID', field: 'id', type: 'numericColumn' },
    { headerName: 'Name', field: 'name', sortable: true },
    { headerName: 'Status', field: 'status', filter: true }`}
  ];
  
  const rowData = ${JSON.stringify(gridConfig.sampleData || [], null, 2)};
  
  return (
    <Vertical gap={16} className="themed-grid-container">
      {/* Grid Control Bar */}
      <Horizontal justify="space-between" align="center" className="grid-header">
        <h2 className="grid-title">${gridConfig.title || 'Data Grid'}</h2>
        <Horizontal gap={8}>
          {/* Add your action buttons here using real Excalibrr components */}
        </Horizontal>
      </Horizontal>
      
      {/* Main Data Grid */}
      <GraviGrid
        columnDefs={columnDefs}
        rowData={rowData}
        theme="${theme.key}"
        pagination={true}
        paginationPageSize={50}
        enableRangeSelection={true}
        enableCellSelection={true}
        animateRows={true}
        getRowId={(params) => params.data.${gridConfig.uniqueIdField || 'id'}}
        className="theme-${theme.key.toLowerCase()}-grid ag-theme-alpine"
        domLayout="autoHeight"
        headerHeight={40}
        rowHeight={35}
        controlBarProps={{
          title: '${gridConfig.title || 'Data Management'}',
          showSearch: true,
          showExport: true,
          showFilters: true,
          theme: '${theme.key}'
        }}
        sideBar={{
          toolPanels: ['filters', 'columns'],
          defaultToolPanel: 'filters'
        }}
      />
      
      <style jsx>{\`
        .themed-grid-container {
          padding: 24px;
          background: var(--bg-primary);
          border-radius: 8px;
          border: 1px solid var(--color-secondary);
        }
        
        .grid-title {
          color: var(--text-primary);
          margin: 0;
          font-weight: 600;
        }
        
        .grid-header {
          margin-bottom: 16px;
        }
        
        /* Critical font fix for ag-Grid */
        .theme-${theme.key.toLowerCase()}-grid {
          font-family: 'Lato', sans-serif !important;
          --ag-font-family: 'Lato', sans-serif !important;
          --ag-font-size: 12px !important;
          --ag-header-font-weight: 600 !important;
          
          /* Grid-specific theme styling */
          --ag-background-color: var(--bg-primary);
          --ag-header-background-color: var(--bg-secondary);
          --ag-odd-row-background-color: var(--bg-tertiary);
          --ag-border-color: var(--color-secondary);
          --ag-selected-row-background-color: var(--color-accent);
          --ag-row-hover-color: var(--bg-secondary);
        }
        
        .theme-${theme.key.toLowerCase()}-grid .ag-header-cell-text {
          font-family: 'Lato', sans-serif !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          font-size: 11px !important;
        }
        
        .theme-${theme.key.toLowerCase()}-grid .ag-cell {
          font-family: 'Lato', sans-serif !important;
          font-size: 12px !important;
        }
      \`}</style>
    </Vertical>
  );
}

export default ThemedDataGrid;`;
}
