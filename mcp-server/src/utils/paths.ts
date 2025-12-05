/**
 * Centralized path configuration for the Excalibrr MCP server
 * 
 * The MCP server runs as a separate process, so process.cwd() may not
 * point to the project root. This module resolves paths relative to
 * the MCP server's location in the monorepo.
 */

import path from "path";
import { fileURLToPath } from "url";

// Get the directory of this file (mcp-server/src/utils/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Navigate from mcp-server/dist/utils/ up to the monorepo root (3 levels)
const MONOREPO_ROOT = path.resolve(__dirname, "..", "..", "..");

// Demo app paths
export const DEMO_ROOT = path.join(MONOREPO_ROOT, "demo");
export const DEMO_SRC = path.join(DEMO_ROOT, "src");
export const DEMO_PAGES = path.join(DEMO_SRC, "pages");
export const DEMO_DEMOS = path.join(DEMO_PAGES, "demos");
export const PAGE_CONFIG_PATH = path.join(DEMO_SRC, "pageConfig.tsx");
export const AUTH_ROUTE_PATH = path.join(DEMO_SRC, "_Main", "AuthenticatedRoute.jsx");

/**
 * Get path to a specific demo folder
 */
export function getDemoPath(demoName: string): string {
  return path.join(DEMO_DEMOS, demoName);
}

/**
 * Get path to a demo file
 */
export function getDemoFilePath(demoName: string, fileName?: string): string {
  const file = fileName || `${demoName}.tsx`;
  return path.join(DEMO_DEMOS, demoName, file);
}

/**
 * Get path to a categorized demo (grids/forms/dashboards)
 */
export function getCategorizedDemoPath(category: string, demoName: string): string {
  return path.join(DEMO_DEMOS, category, demoName);
}

/**
 * Get path to demo data file
 */
export function getDemoDataPath(demoName: string): string {
  return path.join(DEMO_DEMOS, `${demoName}.data.ts`);
}

/**
 * Log paths for debugging (call during server startup)
 */
export function logPaths(): void {
  console.log("[Excalibrr MCP] Path configuration:");
  console.log(`  Monorepo root: ${MONOREPO_ROOT}`);
  console.log(`  Demo root: ${DEMO_ROOT}`);
  console.log(`  Demo pages: ${DEMO_DEMOS}`);
  console.log(`  Page config: ${PAGE_CONFIG_PATH}`);
  console.log(`  Auth route: ${AUTH_ROUTE_PATH}`);
}
