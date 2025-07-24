// MCP Server setup and configuration

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SERVER_CONFIG } from "../utils/constants.js";
import { registerDiscoveryTools } from "./tools/discovery.js";
import { registerCodeGenerationTools } from "./tools/codeGeneration.js";

// Create and configure the MCP server
export function createMcpServer(): McpServer {
  const server = new McpServer(SERVER_CONFIG);

  // Register all tool modules
  registerDiscoveryTools(server);
  registerCodeGenerationTools(server);

  return server;
}

// Start the server
export async function startServer(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("Excalibrr MCP Server running on stdio");
}
