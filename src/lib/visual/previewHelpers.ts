// Visual preview generation utilities for Excalibrr components

import * as fs from "fs/promises";
import * as path from "path";
import { ComponentInfo } from "../types.js";

export interface PreviewOptions {
  variant?: "basic" | "with-data" | "styled" | "interactive";
  theme?: "light" | "dark";
  size?: "mobile" | "tablet" | "desktop";
  width?: number;
  height?: number;
}

export interface ShareablePreviewOptions {
  variant: string;
  theme: string;
  includeCodeExample: boolean;
}

export interface ScreenshotResult {
  imagePath: string;
  componentName: string;
  variant: string;
  theme: string;
  timestamp: string;
}

export interface LivePreviewResult {
  previewUrl: string;
  htmlPath: string;
  componentName: string;
  hasControls: boolean;
  timestamp: string;
}

/**
 * Generate HTML template for component preview
 */
export function generatePreviewHTML(
  componentName: string,
  componentInfo: ComponentInfo,
  options: PreviewOptions
): string {
  const { variant = "basic", theme = "light" } = options;
  
  // Generate mock component JSX based on variant
  const componentJSX = generateComponentJSX(componentName, componentInfo, variant);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} Preview - ${variant}</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
            color: ${theme === 'dark' ? '#ffffff' : '#000000'};
            min-height: 100vh;
        }
        
        .preview-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .preview-header {
            margin-bottom: 30px;
            border-bottom: 1px solid ${theme === 'dark' ? '#333' : '#eee'};
            padding-bottom: 20px;
        }
        
        .preview-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 10px 0;
        }
        
        .preview-meta {
            font-size: 14px;
            opacity: 0.7;
        }
        
        .component-preview {
            background-color: ${theme === 'dark' ? '#2a2a2a' : '#f8f9fa'};
            border: 1px solid ${theme === 'dark' ? '#444' : '#dee2e6'};
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .code-section {
            background-color: ${theme === 'dark' ? '#0d1117' : '#f6f8fa'};
            border: 1px solid ${theme === 'dark' ? '#30363d' : '#d0d7de'};
            border-radius: 6px;
            padding: 16px;
            margin-top: 20px;
        }
        
        .code-section pre {
            margin: 0;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            line-height: 1.45;
            color: ${theme === 'dark' ? '#f0f6fc' : '#24292f'};
            overflow-x: auto;
        }
        
        .props-controls {
            background-color: ${theme === 'dark' ? '#161b22' : '#ffffff'};
            border: 1px solid ${theme === 'dark' ? '#30363d' : '#d0d7de'};
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .control-group {
            margin-bottom: 15px;
        }
        
        .control-label {
            display: block;
            font-weight: 500;
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .control-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid ${theme === 'dark' ? '#30363d' : '#d0d7de'};
            border-radius: 4px;
            background-color: ${theme === 'dark' ? '#0d1117' : '#ffffff'};
            color: ${theme === 'dark' ? '#f0f6fc' : '#24292f'};
            font-size: 14px;
        }
        
        .copy-button {
            background-color: #0969da;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
        }
        
        .copy-button:hover {
            background-color: #0860ca;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="preview-header">
            <h1 class="preview-title">${componentName} Preview</h1>
            <div class="preview-meta">
                Variant: ${variant} | Theme: ${theme} | Generated: ${new Date().toLocaleString()}
            </div>
        </div>
        
        ${variant === 'interactive' ? generatePropsControls(componentInfo) : ''}
        
        <div class="component-preview">
            <div id="component-root"></div>
        </div>
        
        <div class="code-section">
            <button class="copy-button" onclick="copyCode()">Copy Code</button>
            <pre id="component-code">${componentJSX}</pre>
        </div>
    </div>

    <script type="text/babel">
        const { useState } = React;
        
        // Mock Excalibrr components for preview
        ${generateMockComponents(componentName, componentInfo)}
        
        // Main component preview
        function ComponentPreview() {
            ${generateComponentState(componentInfo, variant)}
            
            return (
                <div>
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
    </script>
</body>
</html>`;
}

/**
 * Generate component JSX based on variant
 */
function generateComponentJSX(
  componentName: string,
  componentInfo: ComponentInfo,
  variant: string
): string {
  const props = componentInfo.props || {};
  
  switch (variant) {
    case "with-data":
      return generateWithDataVariant(componentName, props);
    case "styled":
      return generateStyledVariant(componentName, props);
    case "interactive":
      return generateInteractiveVariant(componentName, props);
    default:
      return generateBasicVariant(componentName, props);
  }
}

function generateBasicVariant(componentName: string, props: any): string {
  if (componentName === "GraviGrid") {
    return `<GraviGrid
  data={[]}
  columns={[
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 }
  ]}
/>`;
  }
  
  if (componentName === "Horizontal") {
    return `<Horizontal>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Horizontal>`;
  }
  
  if (componentName === "Vertical") {
    return `<Vertical>
  <div>Item A</div>
  <div>Item B</div>
  <div>Item C</div>
</Vertical>`;
  }
  
  // Generic component
  return `<${componentName} />`;
}

function generateWithDataVariant(componentName: string, props: any): string {
  if (componentName === "GraviGrid") {
    return `<GraviGrid
  data={[
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Inactive' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', status: 'Active' }
  ]}
  columns={[
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'status', headerName: 'Status', width: 100 }
  ]}
  pageSize={10}
  sortable={true}
  filterable={true}
/>`;
  }
  
  return generateBasicVariant(componentName, props);
}

function generateStyledVariant(componentName: string, props: any): string {
  const basicVariant = generateBasicVariant(componentName, props);
  return basicVariant.replace(
    `<${componentName}`,
    `<${componentName} className="styled-variant" style={{ border: '2px solid #0969da', borderRadius: '8px', padding: '16px' }}`
  );
}

function generateInteractiveVariant(componentName: string, props: any): string {
  if (componentName === "GraviGrid") {
    return `<GraviGrid
  data={data}
  columns={columns}
  pageSize={pageSize}
  sortable={sortable}
  filterable={filterable}
  onRowClick={(row) => alert('Clicked: ' + row.name)}
/>`;
  }
  
  return generateBasicVariant(componentName, props);
}

/**
 * Generate mock component implementations for preview
 */
function generateMockComponents(componentName: string, componentInfo: ComponentInfo): string {
  const baseStyles = `
    .gravi-grid { border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
    .gravi-grid-header { background: #f5f5f5; padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd; }
    .gravi-grid-row { padding: 10px; border-bottom: 1px solid #eee; }
    .gravi-grid-row:hover { background: #f9f9f9; }
    .horizontal { display: flex; gap: 16px; align-items: center; }
    .vertical { display: flex; flex-direction: column; gap: 16px; }
  `;
  
  return `
    // Add base styles
    const style = document.createElement('style');
    style.textContent = \`${baseStyles}\`;
    document.head.appendChild(style);
    
    // Mock GraviGrid component
    function GraviGrid({ data = [], columns = [], pageSize = 10, sortable = false, filterable = false, onRowClick, ...props }) {
      const [sortField, setSortField] = useState(null);
      const [sortDirection, setSortDirection] = useState('asc');
      const [filterText, setFilterText] = useState('');
      
      let filteredData = data;
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
          return (aVal > bVal ? 1 : -1) * modifier;
        });
      }
      
      const displayData = filteredData.slice(0, pageSize);
      
      return (
        <div className="gravi-grid" {...props}>
          {filterable && (
            <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <input
                type="text"
                placeholder="Filter..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          )}
          <div style={{ display: 'flex', backgroundColor: '#f5f5f5' }}>
            {columns.map((col, i) => (
              <div 
                key={i} 
                className="gravi-grid-header" 
                style={{ 
                  width: col.width || 'auto', 
                  cursor: sortable ? 'pointer' : 'default',
                  flex: col.width ? 'none' : '1'
                }}
                onClick={() => sortable && setSortField(col.field)}
              >
                {col.headerName || col.field}
                {sortable && sortField === col.field && (
                  <span style={{ marginLeft: '5px' }}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            ))}
          </div>
          {displayData.map((row, i) => (
            <div 
              key={i} 
              className="gravi-grid-row" 
              style={{ display: 'flex', cursor: onRowClick ? 'pointer' : 'default' }}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, j) => (
                <div 
                  key={j} 
                  style={{ 
                    width: col.width || 'auto', 
                    padding: '10px',
                    flex: col.width ? 'none' : '1'
                  }}
                >
                  {row[col.field]}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    
    // Mock Horizontal component
    function Horizontal({ children, ...props }) {
      return <div className="horizontal" {...props}>{children}</div>;
    }
    
    // Mock Vertical component  
    function Vertical({ children, ...props }) {
      return <div className="vertical" {...props}>{children}</div>;
    }
  `;
}

/**
 * Generate props controls for interactive variant
 */
function generatePropsControls(componentInfo: ComponentInfo): string {
  const props = componentInfo.props || {};
  
  return `
    <div class="props-controls">
      <h3>Props Controls</h3>
      <div class="control-group">
        <label class="control-label">Variant:</label>
        <select class="control-input" id="variant-select">
          <option value="basic">Basic</option>
          <option value="with-data">With Data</option>
          <option value="styled">Styled</option>
          <option value="interactive" selected>Interactive</option>
        </select>
      </div>
      <!-- Add more controls based on component props -->
    </div>
  `;
}

/**
 * Generate component state for interactive variant
 */
function generateComponentState(componentInfo: ComponentInfo, variant: string): string {
  if (variant !== 'interactive') return '';
  
  return `
    const [data, setData] = useState([
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Inactive' },
      { id: 3, name: 'Carol Davis', email: 'carol@example.com', status: 'Active' }
    ]);
    
    const [columns, setColumns] = useState([
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Name', width: 150 },
      { field: 'email', headerName: 'Email', width: 200 },
      { field: 'status', headerName: 'Status', width: 100 }
    ]);
    
    const [pageSize, setPageSize] = useState(10);
    const [sortable, setSortable] = useState(true);
    const [filterable, setFilterable] = useState(true);
  `;
}

/**
 * Create preview directory structure
 */
export async function createPreviewDirectory(): Promise<string> {
  // Create previews directory in the MCP server directory first
  const mcpServerDir = process.cwd();
  const previewDir = path.join(mcpServerDir, "previews");
  
  try {
    await fs.mkdir(previewDir, { recursive: true });
    
    // Create subdirectories
    await fs.mkdir(path.join(previewDir, "screenshots"), { recursive: true });
    await fs.mkdir(path.join(previewDir, "html"), { recursive: true });
    await fs.mkdir(path.join(previewDir, "galleries"), { recursive: true });
    
    return previewDir;
  } catch (error) {
    // If that fails, try creating on the Desktop (much more accessible!)
    const homeDir = process.env.HOME || process.env.USERPROFILE || '~';
    const desktopDir = path.join(homeDir, 'Desktop', 'excalibrr-previews');
    
    try {
      await fs.mkdir(desktopDir, { recursive: true });
      
      // Create subdirectories on Desktop
      await fs.mkdir(path.join(desktopDir, "screenshots"), { recursive: true });
      await fs.mkdir(path.join(desktopDir, "html"), { recursive: true });
      await fs.mkdir(path.join(desktopDir, "galleries"), { recursive: true });
      
      return desktopDir;
    } catch (desktopError) {
      // Final fallback to temp directory
      const tempDir = path.join('/tmp', 'excalibrr-previews');
      await fs.mkdir(tempDir, { recursive: true });
      
      // Create subdirectories in temp
      await fs.mkdir(path.join(tempDir, "screenshots"), { recursive: true });
      await fs.mkdir(path.join(tempDir, "html"), { recursive: true });
      await fs.mkdir(path.join(tempDir, "galleries"), { recursive: true });
      
      return tempDir;
    }
  }
}

/**
 * Save HTML preview to file
 */
export async function saveHTMLPreview(
  componentName: string,
  html: string,
  variant: string = "basic"
): Promise<string> {
  const previewDir = await createPreviewDirectory();
  const filename = `${componentName}-${variant}-${Date.now()}.html`;
  const filePath = path.join(previewDir, "html", filename);
  
  await fs.writeFile(filePath, html, "utf8");
  return filePath;
}

/**
 * Generate shareable preview with embedded assets
 */
export async function generateShareablePreview(
  componentName: string,
  componentInfo: ComponentInfo,
  options: ShareablePreviewOptions
): Promise<string> {
  const { variant, theme, includeCodeExample } = options;
  const html = generatePreviewHTML(componentName, componentInfo, {
    variant: variant as "basic" | "with-data" | "styled" | "interactive",
    theme: theme as "light" | "dark",
  });

  // Create a completely self-contained version
  return html.replace(
    '<title>',
    `<title>📋 ${componentName} Preview - Excalibrr Design System | `
  );
}