// Enhanced visual preview generation with authentic Gravitate styling
// src/lib/visual/authenticPreviewHelpers.ts

import * as fs from "fs/promises";
import * as path from "path";
import { ComponentInfo } from "../types.js";
import { getThemeByKey, GravitateTheme } from "../themeSystem.js";
import { saveHTMLPreview, createPreviewDirectory } from "./previewHelpers.js";

export interface AuthenticPreviewOptions {
  variant?: "basic" | "with-data" | "styled" | "interactive";
  themeKey?: string; // OSP, PE, BP, etc.
  size?: "mobile" | "tablet" | "desktop";
  width?: number;
  height?: number;
}

// Type alias to match existing PreviewOptions variant type
type VariantType = "basic" | "with-data" | "styled" | "interactive";

/**
 * Generate HTML template with authentic Gravitate styling
 */
export async function generateAuthenticPreviewHTML(
  componentName: string,
  componentInfo: ComponentInfo,
  options: AuthenticPreviewOptions
): Promise<string> {
  const { variant = "basic", themeKey = "PE", size = "desktop" } = options;
  
  // Load the actual Gravitate theme
  const theme = await getThemeByKey(themeKey);
  if (!theme) {
    throw new Error(`Theme ${themeKey} not found`);
  }
  
  // Generate component JSX based on variant
  const componentJSX = generateAuthenticComponentJSX(componentName, componentInfo, variant);
  
  return `<!DOCTYPE html>
<html lang="en" data-theme="${themeKey}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} Preview - ${themeKey} Theme</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Lato Font from Google Fonts (fallback) -->
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
    
    <style>
        ${generateAuthenticGravitateCSS(theme)}
        
        /* Layout Styles */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        /* Gravitate-style Application Layout */
        .gravitate-app {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: var(--bg-primary);
        }
        
        .gravitate-header {
            background: var(--color-primary);
            color: white;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-height: 60px;
        }
        
        .gravitate-header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 400;
            font-family: 'Lato', sans-serif;
        }
        
        .gravitate-body {
            display: flex;
            flex: 1;
            background-color: var(--bg-secondary);
        }
        
        .gravitate-sidebar {
            width: 280px;
            background: var(--color-primary);
            color: white;
            padding: 0;
            box-shadow: 2px 0 4px rgba(0,0,0,0.1);
        }
        
        .sidebar-nav {
            padding: 20px 0;
        }
        
        .nav-item {
            padding: 12px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .nav-item:hover {
            background-color: rgba(255,255,255,0.1);
        }
        
        .nav-item.active {
            background-color: var(--color-secondary);
            font-weight: 600;
        }
        
        .gravitate-content {
            flex: 1;
            padding: 24px;
            background-color: var(--bg-primary);
            overflow-y: auto;
        }
        
        .content-header {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--color-secondary);
        }
        
        .content-title {
            font-size: 24px;
            font-weight: 300;
            margin: 0;
            color: var(--text-primary);
            font-family: 'Lato', sans-serif;
        }
        
        .content-subtitle {
            font-size: 14px;
            color: var(--text-secondary);
            margin-top: 4px;
            font-family: 'Lato', sans-serif;
        }
        
        /* Component Preview Area */
        .component-preview {
            background-color: var(--bg-primary);
            border-radius: 4px;
            padding: 0;
            margin-bottom: 30px;
        }
        
        .preview-controls {
            background: var(--bg-secondary);
            padding: 16px 20px;
            border-bottom: 1px solid var(--color-secondary);
            border-radius: 4px 4px 0 0;
            display: flex;
            gap: 16px;
            align-items: center;
        }
        
        .control-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .control-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-secondary);
            font-family: 'Lato', sans-serif;
        }
        
        .control-input {
            padding: 6px 12px;
            border: 1px solid var(--color-secondary);
            border-radius: 4px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 12px;
            font-family: 'Lato', sans-serif;
        }
        
        .control-input:focus {
            outline: none;
            border-color: var(--color-accent);
        }
        
        /* Code Section */
        .code-section {
            background: var(--bg-secondary);
            border: 1px solid var(--color-secondary);
            border-radius: 4px;
            margin-top: 24px;
            overflow: hidden;
        }
        
        .code-header {
            background: var(--bg-tertiary);
            padding: 12px 16px;
            border-bottom: 1px solid var(--color-secondary);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .code-title {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-secondary);
            font-family: 'Lato', sans-serif;
        }
        
        .copy-button {
            background: var(--color-accent);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            font-family: 'Lato', sans-serif;
            transition: background-color 0.2s;
        }
        
        .copy-button:hover {
            background: var(--color-highlight);
        }
        
        .code-content {
            padding: 16px;
            background: var(--bg-primary);
        }
        
        .code-content pre {
            margin: 0;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 13px;
            line-height: 1.5;
            color: var(--text-primary);
            overflow-x: auto;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
            .gravitate-sidebar {
                width: 240px;
            }
        }
        
        @media (max-width: 768px) {
            .gravitate-body {
                flex-direction: column;
            }
            
            .gravitate-sidebar {
                width: 100%;
                height: auto;
            }
            
            .sidebar-nav {
                display: flex;
                overflow-x: auto;
                padding: 0;
            }
            
            .nav-item {
                white-space: nowrap;
                flex-shrink: 0;
            }
        }
    </style>
</head>
<body>
    <div class="gravitate-app">
        <div class="gravitate-header">
            <h1>${themeKey} - ${componentName} Component Preview</h1>
        </div>
        
        <div class="gravitate-body">
            <div class="gravitate-sidebar">
                <div class="sidebar-nav">
                    <div class="nav-item active">Dashboard</div>
                    <div class="nav-item">Data Grids</div>
                    <div class="nav-item">Forms</div>
                    <div class="nav-item">Reports</div>
                    <div class="nav-item">Settings</div>
                </div>
            </div>
            
            <div class="gravitate-content">
                <div class="content-header">
                    <h2 class="content-title">${componentName} Component</h2>
                    <div class="content-subtitle">
                        Variant: ${variant} | Theme: ${theme.display} | Generated: ${new Date().toLocaleString()}
                    </div>
                </div>
                
                ${variant === 'interactive' ? generateInteractiveControls(componentInfo) : ''}
                
                <div class="component-preview">
                    <div id="component-root"></div>
                </div>
                
                <div class="code-section">
                    <div class="code-header">
                        <div class="code-title">Generated Code</div>
                        <button class="copy-button" onclick="copyCode()">Copy Code</button>
                    </div>
                    <div class="code-content">
                        <pre id="component-code">${componentJSX}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/babel">
        const { useState, useEffect } = React;
        
        // Mock Excalibrr components with authentic Gravitate styling
        ${generateAuthenticMockComponents(componentName, componentInfo, theme)}
        
        // Main component preview
        function ComponentPreview() {
            ${generateComponentState(componentInfo, variant)}
            
            return (
                <div className="authentic-component-wrapper">
                    ${componentJSX}
                </div>
            );
        }
        
        // Render the component
        const root = ReactDOM.createRoot(document.getElementById('component-root'));
        root.render(<ComponentPreview />);
        
        // Copy functionality
        function copyCode() {
            const code = document.getElementById('component-code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                const button = document.querySelector('.copy-button');
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        }
        
        // Interactive controls
        ${variant === 'interactive' ? generateInteractiveScripts() : ''}
    </script>
</body>
</html>`;
}

/**
 * Generate authentic Gravitate CSS from theme
 */
function generateAuthenticGravitateCSS(theme: GravitateTheme): string {
  return `
/* ${theme.display} Theme - Authentic Gravitate Styling */
:root {
  /* Primary Colors */
  --color-primary: ${theme.colors.primary[0]};
  --color-secondary: ${theme.colors.primary[1]};
  --color-accent: ${theme.colors.primary[2]};
  --color-highlight: ${theme.colors.primary[3]};
  
  /* Background Colors */
  --bg-primary: ${theme.colors.background[0]};
  --bg-secondary: ${theme.colors.background[1]};
  --bg-tertiary: ${theme.colors.background[2] || '#f0f0f0'};
  
  /* Text Colors */
  --text-primary: ${theme.colors.text[0]};
  --text-secondary: ${theme.colors.text[1] || '#666666'};
  
  /* Status Colors */
  --color-success: ${theme.colors.success};
  --color-error: ${theme.colors.error};
  --color-warning: ${theme.colors.warning};
  --color-info: ${theme.colors.info};
  
  /* Grid Colors (matching ag-Grid theme) */
  --ag-background-color: var(--bg-primary);
  --ag-header-background-color: var(--bg-secondary);
  --ag-odd-row-background-color: rgba(0,0,0,0.02);
  --ag-border-color: #e0e0e0;
  --ag-selected-row-background-color: rgba(75, 173, 233, 0.1);
  --ag-foreground-color: var(--text-primary);
  --ag-secondary-foreground-color: var(--text-secondary);
  
  /* Typography */
  --font-family: 'Lato', sans-serif;
  --font-size-base: 12px;
  --font-size-header: 11px;
}

/* Global Font Application */
* {
  font-family: 'Lato', sans-serif;
}

/* ag-Grid Authentic Styling */
.ag-theme-alpine {
  --ag-font-family: 'Lato', sans-serif;
  --ag-font-size: 12px;
  --ag-header-height: 32px;
  --ag-row-height: 32px;
  --ag-list-item-height: 32px;
  
  /* Colors matching your production theme */
  --ag-background-color: var(--bg-primary);
  --ag-header-background-color: var(--bg-secondary);
  --ag-header-foreground-color: var(--text-primary);
  --ag-foreground-color: var(--text-primary);
  --ag-secondary-foreground-color: var(--text-secondary);
  --ag-border-color: #e0e0e0;
  --ag-row-border-color: #e0e0e0;
  --ag-odd-row-background-color: rgba(0,0,0,0.02);
  --ag-selected-row-background-color: rgba(75, 173, 233, 0.1);
  --ag-cell-horizontal-border: none;
  
  /* Header styling */
  --ag-header-cell-hover-background-color: rgba(0,0,0,0.05);
  --ag-header-cell-moving-background-color: rgba(0,0,0,0.05);
}

.ag-header-cell {
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 11px !important;
  letter-spacing: 0.5px;
  color: var(--text-primary) !important;
}

.ag-header-cell-text {
  font-family: 'Lato', sans-serif !important;
  font-weight: 600 !important;
  font-size: 11px !important;
}

.ag-cell {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
  display: flex !important;
  align-items: center !important;
  border-bottom: 1px solid var(--ag-border-color) !important;
}

.ag-row {
  border-bottom: 1px solid var(--ag-border-color);
}

.ag-row:hover {
  background-color: rgba(0,0,0,0.03) !important;
}

/* Control Bar Styling (if present) */
.control-bar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--ag-border-color);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Lato', sans-serif;
}

.control-bar-title {
  font-size: 16px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}

.control-bar-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Buttons */
.gravitate-button {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Lato', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 0.2s;
}

.gravitate-button:hover {
  background: var(--color-highlight);
}

.gravitate-button.secondary {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}

.gravitate-button.secondary:hover {
  background: var(--color-accent);
  color: white;
}

/* Form Controls */
.gravitate-input {
  padding: 8px 12px;
  border: 1px solid var(--ag-border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 12px;
  font-family: 'Lato', sans-serif;
}

.gravitate-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(75, 173, 233, 0.2);
}

/* Layout Components */
.horizontal-layout {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.vertical-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Status indicators */
.status-active {
  color: var(--color-success);
  font-weight: 600;
}

.status-inactive {
  color: var(--text-secondary);
}

.status-error {
  color: var(--color-error);
  font-weight: 600;
}

.status-warning {
  color: var(--color-warning);
  font-weight: 600;
}
`;
}

/**
 * Generate authentic mock components
 */
function generateAuthenticMockComponents(componentName: string, componentInfo: ComponentInfo, theme: GravitateTheme): string {
  return `
    // Authentic GraviGrid component matching your production styling
    function GraviGrid({ 
      data = [], 
      columns = [], 
      controlBarProps = {},
      pageSize = 25, 
      sortable = true, 
      filterable = true, 
      onRowClick,
      storageKey,
      ...props 
    }) {
      const [sortField, setSortField] = useState(null);
      const [sortDirection, setSortDirection] = useState('asc');
      const [filterText, setFilterText] = useState('');
      const [selectedRows, setSelectedRows] = useState(new Set());
      
      let filteredData = [...data];
      if (filterText) {
        filteredData = data.filter(row => 
          Object.values(row).some(value => 
            String(value).toLowerCase().includes(filterText.toLowerCase())
          )
        );
      }
      
      if (sortField) {
        filteredData.sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];
          const modifier = sortDirection === 'desc' ? -1 : 1;
          if (aVal === bVal) return 0;
          return (aVal > bVal ? 1 : -1) * modifier;
        });
      }
      
      const displayData = filteredData.slice(0, pageSize);
      
      const handleRowClick = (row, index) => {
        if (onRowClick) {
          onRowClick(row);
        }
      };
      
      const handleSort = (field) => {
        if (!sortable) return;
        
        if (sortField === field) {
          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field);
          setSortDirection('asc');
        }
      };
      
      return (
        <div className="gravi-grid-container" {...props}>
          {/* Control Bar */}
          {controlBarProps.title && (
            <div className="control-bar">
              <h3 className="control-bar-title">{controlBarProps.title}</h3>
              <div className="control-bar-actions">
                {filterable && (
                  <input
                    type="text"
                    placeholder="Search..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="gravitate-input"
                    style={{ width: '200px' }}
                  />
                )}
                <button className="gravitate-button secondary">Export</button>
                <button className="gravitate-button">+ Add New</button>
              </div>
            </div>
          )}
          
          {/* Grid */}
          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              backgroundColor: 'var(--ag-header-background-color)',
              borderBottom: '1px solid var(--ag-border-color)',
              minHeight: '32px'
            }}>
              {columns.map((col, i) => (
                <div 
                  key={i} 
                  className="ag-header-cell"
                  style={{ 
                    width: col.width ? \`\${col.width}px\` : 'auto',
                    flex: col.width ? 'none' : '1',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    cursor: sortable ? 'pointer' : 'default',
                    borderRight: i < columns.length - 1 ? '1px solid var(--ag-border-color)' : 'none',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backgroundColor: 'var(--ag-header-background-color)',
                    color: 'var(--ag-header-foreground-color)'
                  }}
                  onClick={() => handleSort(col.field)}
                >
                  <span className="ag-header-cell-text">
                    {col.headerName || col.field}
                  </span>
                  {sortable && sortField === col.field && (
                    <span style={{ marginLeft: '6px', fontSize: '10px' }}>
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Rows */}
            <div style={{ 
              maxHeight: '368px', 
              overflowY: 'auto',
              backgroundColor: 'var(--ag-background-color)'
            }}>
              {displayData.map((row, i) => (
                <div 
                  key={i} 
                  className="ag-row"
                  style={{ 
                    display: 'flex',
                    minHeight: '32px',
                    cursor: onRowClick ? 'pointer' : 'default',
                    backgroundColor: i % 2 === 1 ? 'var(--ag-odd-row-background-color)' : 'var(--ag-background-color)',
                    borderBottom: '1px solid var(--ag-border-color)'
                  }}
                  onClick={() => handleRowClick(row, i)}
                  onMouseEnter={(e) => {
                    if (i % 2 === 0) {
                      e.target.style.backgroundColor = 'rgba(0,0,0,0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (i % 2 === 0) {
                      e.target.style.backgroundColor = 'var(--ag-background-color)';
                    }
                  }}
                >
                  {columns.map((col, j) => (
                    <div 
                      key={j} 
                      className="ag-cell"
                      style={{ 
                        width: col.width ? \`\${col.width}px\` : 'auto',
                        flex: col.width ? 'none' : '1',
                        padding: '8px 12px',
                        borderRight: j < columns.length - 1 ? '1px solid var(--ag-border-color)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: 'var(--ag-foreground-color)',
                        fontFamily: "'Lato', sans-serif"
                      }}
                    >
                      {formatCellValue(row[col.field], col)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div style={{
              padding: '8px 12px',
              backgroundColor: 'var(--ag-header-background-color)',
              borderTop: '1px solid var(--ag-border-color)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Showing {displayData.length} of {filteredData.length} rows</span>
              {filteredData.length !== data.length && (
                <span>({data.length} total, {data.length - filteredData.length} filtered out)</span>
              )}
            </div>
          </div>
        </div>
      );
    }
    
    // Helper function to format cell values
    function formatCellValue(value, column) {
      if (value === null || value === undefined) return '';
      
      // Status formatting
      if (column.field === 'status' || column.field === 'Status') {
        const status = String(value).toLowerCase();
        const className = status === 'active' ? 'status-active' : 
                         status === 'inactive' ? 'status-inactive' :
                         status === 'error' ? 'status-error' :
                         status === 'warning' ? 'status-warning' : '';
        return <span className={className}>{value}</span>;
      }
      
      // Date formatting
      if (column.field.toLowerCase().includes('date') || column.type === 'date') {
        try {
          const date = new Date(value);
          return date.toLocaleDateString();
        } catch (e) {
          return value;
        }
      }
      
      // Number formatting
      if (typeof value === 'number' || column.type === 'number') {
        if (column.field.toLowerCase().includes('price') || 
            column.field.toLowerCase().includes('amount') ||
            column.field.toLowerCase().includes('cost')) {
          return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
          }).format(value);
        }
        return value.toLocaleString();
      }
      
      return value;
    }
    
    // Mock Horizontal component
    function Horizontal({ children, gap = 16, align = 'stretch', ...props }) {
      return (
        <div 
          className="horizontal-layout" 
          style={{ 
            gap: \`\${gap}px\`,
            alignItems: align
          }}
          {...props}
        >
          {children}
        </div>
      );
    }
    
    // Mock Vertical component  
    function Vertical({ children, gap = 16, ...props }) {
      return (
        <div 
          className="vertical-layout" 
          style={{ gap: \`\${gap}px\` }}
          {...props}
        >
          {children}
        </div>
      );
    }
  `;
}

/**
 * Generate component JSX with authentic props
 */
function generateAuthenticComponentJSX(
  componentName: string,
  componentInfo: ComponentInfo,
  variant: VariantType
): string {
  switch (variant) {
    case "with-data":
      return generateWithDataVariant(componentName);
    case "styled":
      return generateStyledVariant(componentName);
    case "interactive":
      return generateInteractiveVariant(componentName);
    default:
      return generateBasicVariant(componentName);
  }
}

function generateBasicVariant(componentName: string): string {
  if (componentName === "GraviGrid") {
    return `<GraviGrid
  controlBarProps={{
    title: "Sample Data Grid"
  }}
  columns={[
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 }
  ]}
  data={[
    { id: 1, name: 'Sample Item 1', status: 'Active' },
    { id: 2, name: 'Sample Item 2', status: 'Inactive' }
  ]}
  pageSize={25}
  sortable={true}
  filterable={true}
/>`;
  }
  
  if (componentName === "Horizontal") {
    return `<Horizontal gap={16} align="center">
  <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
    Item 1
  </div>
  <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
    Item 2
  </div>
  <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
    Item 3
  </div>
</Horizontal>`;
  }
  
  return `<${componentName} />`;
}

function generateWithDataVariant(componentName: string): string {
  if (componentName === "GraviGrid") {
    return `<GraviGrid
  controlBarProps={{
    title: "Customer Management",
    showSearch: true,
    showExport: true
  }}
  columns={[
    { field: 'id', headerName: 'Customer ID', width: 120 },
    { field: 'company', headerName: 'Company Name', width: 200 },
    { field: 'contact', headerName: 'Contact Person', width: 160 },
    { field: 'email', headerName: 'Email Address', width: 220 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'lastOrder', headerName: 'Last Order', width: 120 },
    { field: 'totalValue', headerName: 'Total Value', width: 130 }
  ]}
  data={[
    { 
      id: 'CUST001', 
      company: 'Acme Corporation', 
      contact: 'John Smith', 
      email: 'john.smith@acme.com', 
      status: 'Active',
      lastOrder: '2024-01-15',
      totalValue: 125000
    },
    { 
      id: 'CUST002', 
      company: 'Global Industries', 
      contact: 'Sarah Johnson', 
      email: 'sarah.j@global.com', 
      status: 'Active',
      lastOrder: '2024-01-12',
      totalValue: 89500
    },
    { 
      id: 'CUST003', 
      company: 'Metro Systems', 
      contact: 'Mike Chen', 
      email: 'mchen@metro.com', 
      status: 'Inactive',
      lastOrder: '2023-11-20',
      totalValue: 45000
    },
    { 
      id: 'CUST004', 
      company: 'Tech Solutions Ltd', 
      contact: 'Emily Davis', 
      email: 'e.davis@techsolutions.com', 
      status: 'Active',
      lastOrder: '2024-01-18',
      totalValue: 201000
    }
  ]}
  pageSize={25}
  sortable={true}
  filterable={true}
  onRowClick={(row) => console.log('Selected customer:', row.company)}
/>`;
  }
  
  return generateBasicVariant(componentName);
}

function generateStyledVariant(componentName: string): string {
  const basicVariant = generateBasicVariant(componentName);
  // Add custom styling to the component
  return basicVariant.replace(
    /(<\w+)/,
    '$1 style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px" }}'
  );
}

function generateInteractiveVariant(componentName: string): string {
  if (componentName === "GraviGrid") {
    return `<GraviGrid
  controlBarProps={{
    title: title,
    showSearch: showSearch,
    showExport: showExport
  }}
  columns={columns}
  data={data}
  pageSize={pageSize}
  sortable={sortable}
  filterable={filterable}
  onRowClick={(row) => {
    alert(\`Selected: \${row.name || row.company || 'Row ' + row.id}\`);
    console.log('Row data:', row);
  }}
/>`;
  }
  
  return generateBasicVariant(componentName);
}

function generateInteractiveControls(componentInfo: ComponentInfo): string {
  return `
    <div class="preview-controls">
      <div class="control-group">
        <label class="control-label">Title:</label>
        <input type="text" class="control-input" id="title-input" value="Interactive Data Grid" />
      </div>
      <div class="control-group">
        <label class="control-label">Page Size:</label>
        <select class="control-input" id="pagesize-select">
          <option value="10">10</option>
          <option value="25" selected>25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Features:</label>
        <label style="font-size: 12px; display: flex; align-items: center; gap: 4px;">
          <input type="checkbox" id="sortable-check" checked /> Sortable
        </label>
        <label style="font-size: 12px; display: flex; align-items: center; gap: 4px;">
          <input type="checkbox" id="filterable-check" checked /> Filterable
        </label>
      </div>
    </div>
  `;
}

function generateComponentState(componentInfo: ComponentInfo, variant: VariantType): string {
  if (variant !== 'interactive') return '';
  
  return `
    const [title, setTitle] = useState("Interactive Data Grid");
    const [pageSize, setPageSize] = useState(25);
    const [sortable, setSortable] = useState(true);
    const [filterable, setFilterable] = useState(true);
    const [showSearch, setShowSearch] = useState(true);
    const [showExport, setShowExport] = useState(true);
    
    const [data] = useState([
      { 
        id: 1, 
        name: 'Alice Johnson', 
        company: 'Tech Corp', 
        email: 'alice@techcorp.com', 
        status: 'Active',
        lastLogin: '2024-01-18',
        role: 'Admin'
      },
      { 
        id: 2, 
        name: 'Bob Smith', 
        company: 'Data Systems', 
        email: 'bob@datasys.com', 
        status: 'Active',
        lastLogin: '2024-01-17',
        role: 'User'
      },
      { 
        id: 3, 
        name: 'Carol Williams', 
        company: 'Global Inc', 
        email: 'carol@global.com', 
        status: 'Inactive',
        lastLogin: '2024-01-10',
        role: 'User'
      }
    ]);
    
    const [columns] = useState([
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Full Name', width: 150 },
      { field: 'company', headerName: 'Company', width: 140 },
      { field: 'email', headerName: 'Email', width: 180 },
      { field: 'status', headerName: 'Status', width: 100 },
      { field: 'lastLogin', headerName: 'Last Login', width: 120 },
      { field: 'role', headerName: 'Role', width: 100 }
    ]);
  `;
}

function generateInteractiveScripts(): string {
  return `
    // Interactive control handlers
    useEffect(() => {
      const titleInput = document.getElementById('title-input');
      const pageSizeSelect = document.getElementById('pagesize-select');
      const sortableCheck = document.getElementById('sortable-check');
      const filterableCheck = document.getElementById('filterable-check');
      
      if (titleInput) titleInput.addEventListener('input', (e) => setTitle(e.target.value));
      if (pageSizeSelect) pageSizeSelect.addEventListener('change', (e) => setPageSize(Number(e.target.value)));
      if (sortableCheck) sortableCheck.addEventListener('change', (e) => setSortable(e.target.checked));
      if (filterableCheck) filterableCheck.addEventListener('change', (e) => setFilterable(e.target.checked));
      
      return () => {
        if (titleInput) titleInput.removeEventListener('input');
        if (pageSizeSelect) pageSizeSelect.removeEventListener('change');
        if (sortableCheck) sortableCheck.removeEventListener('change');
        if (filterableCheck) filterableCheck.removeEventListener('change');
      };
    }, []);
  `;
}

// Re-export the helpers from the original previewHelpers.js
export { saveHTMLPreview, createPreviewDirectory };

// Note: AuthenticPreviewOptions and VariantType are already exported at the top of this file
