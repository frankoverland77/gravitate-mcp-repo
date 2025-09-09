#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import our focused tools
import { createDemoTool } from "./tools/createDemo.js";
import { modifyGridTool } from "./tools/modifyGrid.js";
import { changeThemeTool } from "./tools/changeTheme.js";
import { runDevServerTool } from "./tools/runDevServer.js";
import { createFormDemo } from "./tools/createFormDemo.js";
import { cleanupDemo } from "./tools/cleanupDemo.js";

/**
 * Excalibrr MCP Server v2 - Clean, Focused Implementation
 *
 * This server provides tools for Frank's workflow:
 * 1. Create lightweight demo shells with real Excalibrr components
 * 2. Iteratively modify grids and components
 * 3. Switch themes (OSP, PE, BP)
 * 4. Run development servers
 *
 * Key principles:
 * - Lightweight shells, not full React apps
 * - Real Excalibrr components only, no mocks
 * - Shared node_modules for efficiency
 * - Built for iteration and hot-reload
 */

const server = new Server(
  {
    name: "excalibrr-mcp-server",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register our focused tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_demo",
        description:
          "Create a lightweight demo shell with real Excalibrr components",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Name for the demo (e.g., 'ProductGrid', 'InventoryManagement')",
            },
            type: {
              type: "string",
              enum: ["grid", "form", "dashboard"],
              description: "Type of demo to create",
            },
            theme: {
              type: "string",
              enum: ["OSP", "PE", "BP", "default"],
              description: "Gravitate theme to use",
              default: "OSP",
            },
            config: {
              type: "object",
              description: "Configuration specific to the demo type",
              properties: {
                columns: {
                  type: "array",
                  description: "For grid demos: column definitions",
                },
                title: {
                  type: "string",
                  description: "Display title for the demo",
                },
              },
            },
          },
          required: ["name", "type"],
        },
      },
      {
        name: "modify_grid",
        description:
          "Modify an existing grid demo (add columns, change renderers, etc.)",
        inputSchema: {
          type: "object",
          properties: {
            demoName: {
              type: "string",
              description: "Name of the demo to modify",
            },
            action: {
              type: "string",
              enum: [
                "add_column",
                "modify_column",
                "add_renderer",
                "change_props",
                "make_editable",
              ],
              description: "Type of modification to make",
            },
            config: {
              type: "object",
              description: "Configuration for the modification. For add_column: include field, headerName, type, editable (boolean), etc.",
              properties: {
                field: {
                  type: "string",
                  description: "Field name for the column",
                },
                headerName: {
                  type: "string",
                  description: "Display name for the column header",
                },
                type: {
                  type: "string",
                  description: "Column type (e.g., 'number', 'date', 'string')",
                },
                editable: {
                  type: "boolean",
                  description: "Whether the column should be editable. If true for number columns, NumberCellEditor will be added automatically.",
                },
              },
            },
          },
          required: ["demoName", "action", "config"],
        },
      },
      {
        name: "change_theme",
        description: "Switch the theme of an existing demo",
        inputSchema: {
          type: "object",
          properties: {
            demoName: {
              type: "string",
              description: "Name of the demo to change theme for",
            },
            theme: {
              type: "string",
              enum: ["OSP", "PE", "BP", "default"],
              description: "New theme to apply",
            },
          },
          required: ["demoName", "theme"],
        },
      },
      {
        name: "run_dev_server",
        description: "Start or stop development server for a demo",
        inputSchema: {
          type: "object",
          properties: {
            demoName: {
              type: "string",
              description: "Name of the demo to serve",
            },
            action: {
              type: "string",
              enum: ["start", "stop", "restart"],
              description: "Server action to perform",
              default: "start",
            },
            port: {
              type: "number",
              description: "Port to run on (auto-assigned if not specified)",
            },
          },
          required: ["demoName"],
        },
      },
      {
        name: "create_form_demo",
        description: "Create a form demo with real Excalibrr components based on Gravitate patterns",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name for the form demo (e.g., 'ProductForm', 'UserManagement')",
            },
            type: {
              type: "string",
              enum: ["simple", "management", "bulk-edit", "inline-edit"],
              description: "Type of form to create",
              default: "simple",
            },
            title: {
              type: "string",
              description: "Display title for the form",
            },
            fields: {
              type: "array",
              description: "Form fields configuration",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Field name" },
                  label: { type: "string", description: "Field label" },
                  type: { 
                    type: "string", 
                    enum: ["text", "email", "number", "select", "date", "dateRange", "switch", "checkbox"],
                    description: "Field type" 
                  },
                  required: { type: "boolean", description: "Whether field is required" },
                  placeholder: { type: "string", description: "Placeholder text" },
                  options: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Options for select fields"
                  }
                },
                required: ["name", "label", "type"]
              }
            },
            actions: {
              type: "array",
              description: "Form action buttons",
              items: {
                type: "object",
                properties: {
                  type: { 
                    type: "string", 
                    enum: ["submit", "cancel", "reset"],
                    description: "Action type"
                  },
                  label: { type: "string", description: "Button label" },
                  theme: { 
                    type: "string", 
                    enum: ["success", "theme1", "default"],
                    description: "Button theme"
                  }
                },
                required: ["type", "label"]
              }
            }
          },
          required: ["name", "fields"]
        }
      },
      {
        name: "cleanup_demo",
        description: "Remove a demo and clean up all references (pageConfig, scopes, files)",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the demo to remove (e.g., 'ProductForm', 'CustomerForm')",
            },
            force: {
              type: "boolean",
              description: "Skip confirmation and force removal",
              default: false,
            }
          },
          required: ["name"]
        }
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "create_demo":
        return await createDemoTool(args as any);
      case "modify_grid":
        return await modifyGridTool(args as any);
      case "change_theme":
        return await changeThemeTool(args as any);
      case "run_dev_server":
        return await runDevServerTool(args as any);
      case "create_form_demo":
        return { content: [{ type: "text", text: await createFormDemo(args as any) }] };
      case "cleanup_demo":
        return { content: [{ type: "text", text: await cleanupDemo(args as any) }] };
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Excalibrr MCP Server v2 running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
