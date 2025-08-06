// Core types and configuration for React project generation

export interface ReactProjectConfig {
  featureName: string;
  componentName: string;
  columns: Array<{ field: string; headerName: string; type?: string }>;
  sampleData: Array<Record<string, any>>;
  uniqueIdField: string;
  displayTitle: string;
  storageKey: string;
  dataConstName: string;
  hookName: string;
  getDataFunctionName: string;
}

export interface DependencyData {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  resolutions?: Record<string, string>;
}

// Helper function to get dynamic dependencies (will be called by MCP server)
export function getDynamicDependencies(): DependencyData {
  // Production-tested dependency versions based on working LemonadeCompetitors example
  return {
    dependencies: {
      "@ant-design/icons": "4.0.6",
      "@gravitate-js/excalibrr": "4.0.34-osp",
      "@nivo/bar": "0.79.1",
      "@nivo/core": "0.79.0",
      "@nivo/line": "0.79.0",
      "@nivo/tooltip": "0.79.0",
      "@tanstack/react-query": "4.10.3",
      "@vitejs/plugin-react": "^4.7.0",
      "ag-grid-community": "30.2.1",
      "ag-grid-react": "30.2.1",
      antd: "4.20",
      axios: "0.21.1",
      lodash: "4.17.15",
      moment: "2.24.0",
      react: "18.2.0",
      "react-dom": "18.2.0",
      "react-ga": "^3.3.1",
      "react-lottie": "^1.2.10",
      "react-router-dom": "6.16.0",
      vite: "^7.0.6",
      "vite-plugin-svgr": "^4.3.0",
      "vite-tsconfig-paths": "^5.1.4",
    },
    devDependencies: {
      "@types/node": "18.0.0",
      "@types/react": "^19.1.9",
      "@types/react-dom": "^19.1.7",
      less: "^3.9.0",
      typescript: "4.7.4",
    },
  };
}
