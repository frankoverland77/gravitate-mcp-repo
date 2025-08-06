// Configuration constants for Excalibrr MCP Server

export const EXCALIBRR_LIBRARY_PATH = 
  process.env.EXCALIBRR_PATH || "../excalibrr";

export const USAGE_EXAMPLES_PATH = 
  process.env.USAGE_EXAMPLES_PATH || 
  "../Gravitate.Dotnet.Next/frontend/src";

export const TEMP_PREVIEW_DIR = "temp-previews";

export const SERVER_CONFIG = {
  name: "excalibrr-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
};

export const PREVIEW_DIMENSIONS = {
  small: { width: 400, height: 300 },
  medium: { width: 800, height: 600 },
  large: { width: 1200, height: 800 },
};

export const PUPPETEER_CONFIG = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

export const FILE_PATTERNS = {
  COMPONENT_EXTENSIONS: ['.tsx', '.ts'],
  SKIP_PATTERNS: ['.test.', '.spec.', '.stories', '.d.ts'],
  SKIP_DIRECTORIES: ['node_modules', 'dist', 'build', '.git']
};