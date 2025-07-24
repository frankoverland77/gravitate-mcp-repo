#!/usr/bin/env node

// Excalibrr MCP Server - Main Entry Point
// A Model Context Protocol server for discovering and using Excalibrr components

import { startServer } from "./server/mcpServer.js";

// Start the server
async function main(): Promise<void> {
  try {
    await startServer();
  } catch (error) {
    console.error("Failed to start Excalibrr MCP Server:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
