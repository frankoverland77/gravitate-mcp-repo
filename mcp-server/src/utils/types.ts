// Type definitions for the MCP server

export interface ProjectComponent {
  name: string;
  description?: string;
  file?: string;
  category: string;
  usage: string;
  props?: Record<string, any>;
}

export interface ComponentInfo {
  name: string;
  description: string;
  category: string;
  usage?: string;
  file?: string;
  props?: Record<string, any>;
}

export interface GridColumn {
  field: string;
  headerName: string;
  type?: string;
  width?: number;
  cellRenderer?: string;
}

export interface ThemeConfig {
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
}
