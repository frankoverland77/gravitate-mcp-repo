#!/usr/bin/env node

// Excalibrr MCP Server - Main Entry Point
// A Model Context Protocol server for discovering and using Excalibrr components

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createHttpServer } from "./server/httpServer.js";
import { createMcpServer } from "./server/mcpServer.js";

// Configuration
const TRANSPORT_MODE = process.env.MCP_TRANSPORT || "stdio"; // "stdio" or "http"
const HTTP_PORT = parseInt(process.env.PORT || "3000");

console.error(`🔧 Excalibrr MCP Server v1.0.0`);
console.error(`📦 Excalibrr: v4.0.34-osp`);
console.error(`💡 Examples: Built-in curated examples`);
console.error(`🚀 Transport: ${TRANSPORT_MODE}`);

async function startServer(): Promise<void> {
  try {
    if (TRANSPORT_MODE === "http") {
      console.error(`🌐 Starting HTTP mode on port ${HTTP_PORT}`);

      // Create HTTP server with a factory function to create new MCP server instances
      const httpServer = createHttpServer(() => createMcpServer(), {
        port: HTTP_PORT,
        host: "0.0.0.0",
        cors: true,
      });

      httpServer.start();
    } else {
      console.error(`📱 Starting STDIO mode`);

      const mcpServer = createMcpServer();
      const transport = new StdioServerTransport();
      await mcpServer.connect(transport);
      console.error("✅ MCP server connected via STDIO");
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  console.error("💥 Server startup failed:", error);
  process.exit(1);
});
