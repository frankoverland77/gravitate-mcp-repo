// MCP Server setup and configuration
// src/server/mcpServer.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERVER_CONFIG } from "../utils/constants.js";
import { registerDiscoveryTools } from "./tools/discovery.js";
import { registerCodeGenerationTools } from "./tools/codeGeneration.js";
import { registerVisualPreviewTools } from "./tools/visualPreview.js";
import { registerProductionCodeGenerationTools } from "./tools/productionCodeGeneration.js";
import { registerFormGenerationTools } from "./tools/formGeneration.js";
import { registerFigmaTools } from "./tools/figma.js";
import { registerDesignIterationTools } from "./tools/designIteration.js";
import { registerThemeIntegrationTools } from "./tools/themeIntegration.js";
import { registerEnhancedVisualPreviewTools } from "./tools/enhancedVisualPreview.js";

// Create and configure the MCP server
export function createMcpServer(): McpServer {
  const server = new McpServer(SERVER_CONFIG);

  console.error(`🔧 Registering MCP tools...`);

  // Register all tool modules
  try {
    registerDiscoveryTools(server);
    console.error(`✅ Discovery tools registered`);

    registerCodeGenerationTools(server);
    console.error(`✅ Code generation tools registered`);

    registerVisualPreviewTools(server);
    console.error(`✅ Visual preview tools registered`);

    registerProductionCodeGenerationTools(server);
    console.error(`✅ Production code tools registered`);

    registerFormGenerationTools(server);
    console.error(`✅ Form generation tools registered`);

    registerFigmaTools(server);
    console.error(`✅ Figma integration tools registered`);

    registerDesignIterationTools(server);
    console.error(`✅ Design iteration tools registered`);

    registerThemeIntegrationTools(server);
    console.error(`✅ Theme integration tools registered`);

    // registerEnhancedVisualPreviewTools(server);
    // console.error(`✅ Enhanced visual preview tools registered`);
    // Note: Enhanced visual preview tools temporarily disabled to avoid duplicate tool registration

    console.error(`🎯 All tools registered successfully`);
  } catch (error) {
    console.error(`❌ Error registering tools:`, error);
    throw error;
  }

  return server;
}
