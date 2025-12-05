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
import { cleanupStylesTool } from "./tools/cleanupStyles.js";
import { importFromFigma, listFigmaComponents } from "./tools/figmaTools.js";
import { helpTool } from "./tools/helpTool.js";
import {
  processSafeguards,
  formatSafeguardResponse,
} from "./utils/safeguards.js";

// Import component registry tools
import { listComponentsTool } from "./tools/listComponents.js";
import { searchComponentsTool } from "./tools/searchComponents.js";
import { getComponentTool } from "./tools/getComponent.js";
import { installComponentTool } from "./tools/installComponent.js";

// Import validation and conventions tools
import { validateCodeTool } from "./tools/validateCode.js";
import { getConventionsTool } from "./tools/getConventions.js";
import { convertToExcalibrTool } from "./tools/convertToExcalibrr.js";
import { reviewComponentTool } from "./tools/reviewComponent.js";

// Import new Phase 2 tools
import { scaffoldFeatureTool } from "./tools/scaffoldFeature.js";
import { checkNavigationSyncTool } from "./tools/checkNavigationSync.js";
import { generateColumnDefsTool } from "./tools/generateColumnDefs.js";

// Import Phase 2 workflow tools
import { designReviewWorkflow } from "./tools/designReviewWorkflow.js";
import { featureBuilderWizard } from "./tools/featureBuilderWizard.js";
import { figmaToCodePipeline } from "./tools/figmaToCodePipeline.js";

/**
 * Excalibrr MCP Server v2.3 - Complete with Scaffolding & Workflow Tools
 *
 * This server provides tools for designer workflow:
 * 1. Create lightweight demo shells with real Excalibrr components
 * 2. Iteratively modify grids and components
 * 3. Switch themes (OSP, PE, BP)
 * 4. Run development servers
 * 5. Validate code against conventions (NEW)
 * 6. Get conventions reference (NEW)
 * 7. Convert raw HTML to Excalibrr (NEW)
 * 8. Review components for best practices (NEW)
 *
 * Key principles:
 * - Lightweight shells, not full React apps
 * - Real Excalibrr components only, no mocks
 * - Shared node_modules for efficiency
 * - Built for iteration and hot-reload
 * - Convention enforcement for consistent code
 */

const server = new Server(
  {
    name: "excalibrr-mcp-server",
    version: "2.3.0",
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
      // ============ VALIDATION & CONVENTIONS TOOLS (NEW) ============
      {
        name: "validate_code",
        description:
          "Validate TSX/JSX code against Excalibrr conventions. Returns detailed feedback on violations with line numbers and fix suggestions. Use this BEFORE generating code to check compliance.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Code string to validate",
            },
            filePath: {
              type: "string",
              description: "Path to file to validate (relative to demo/)",
            },
            directory: {
              type: "string",
              description: "Directory to validate all files in",
            },
            pattern: {
              type: "string",
              description: "File pattern for directory validation (default: \\.(tsx|jsx)$)",
            },
            raw: {
              type: "boolean",
              description: "Return raw JSON result instead of formatted markdown",
              default: false,
            },
          },
        },
      },
      {
        name: "get_conventions",
        description:
          "Get Excalibrr conventions and coding rules. Use 'summary: true' for a quick reference, or filter by category/severity. CALL THIS before generating code to ensure compliance.",
        inputSchema: {
          type: "object",
          properties: {
            summary: {
              type: "boolean",
              description: "Get condensed quick reference (recommended for context)",
              default: false,
            },
            category: {
              type: "string",
              enum: ["component", "styling", "structure", "naming", "typescript"],
              description: "Filter by category",
            },
            severity: {
              type: "string",
              enum: ["error", "warning", "info"],
              description: "Filter by severity level",
            },
            ruleId: {
              type: "string",
              description: "Get specific rule by ID",
            },
            raw: {
              type: "boolean",
              description: "Return raw JSON instead of formatted markdown",
              default: false,
            },
          },
        },
      },
      {
        name: "convert_to_excalibrr",
        description:
          "Transform raw HTML/CSS patterns into proper Excalibrr components. Converts divs to Horizontal/Vertical, text elements to Texto, buttons to GraviButton, and fixes common mistakes.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Code to convert",
            },
            dryRun: {
              type: "boolean",
              description: "Preview changes without converting",
              default: false,
            },
          },
          required: ["code"],
        },
      },
      {
        name: "review_component",
        description:
          "Get a detailed code review of a component including convention violations, best practice suggestions, and improvement opportunities.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Code to review",
            },
            filePath: {
              type: "string",
              description: "Path to file to review (relative to demo/)",
            },
            focus: {
              type: "string",
              enum: ["all", "styling", "components", "structure", "accessibility"],
              description: "Focus area for review",
              default: "all",
            },
          },
        },
      },
      
      // ============ PHASE 2: FEATURE SCAFFOLDING TOOLS ============
      {
        name: "scaffold_feature",
        description:
          "Create a complete feature folder structure with API hooks, types, page component, column definitions, and form modal. Generates production-ready scaffolding following Excalibrr patterns.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Feature name in PascalCase (e.g., 'ProductManagement', 'UserList')",
            },
            basePath: {
              type: "string",
              description: "Base path for feature folder (default: demo/src/pages/demos)",
            },
            includeGrid: {
              type: "boolean",
              description: "Include GraviGrid with column definitions",
              default: true,
            },
            includeForm: {
              type: "boolean",
              description: "Include form modal component",
              default: true,
            },
            fields: {
              type: "array",
              description: "Field definitions for the feature data",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string", enum: ["string", "number", "boolean", "date"] },
                  required: { type: "boolean" },
                },
              },
            },
            endpoints: {
              type: "object",
              description: "API endpoint paths",
              properties: {
                read: { type: "string" },
                create: { type: "string" },
                update: { type: "string" },
                delete: { type: "string" },
              },
            },
          },
          required: ["name"],
        },
      },
      {
        name: "check_navigation_sync",
        description:
          "Verify that pageConfig keys match AuthenticatedRoute scopes. Reports missing scopes and orphaned entries. Can auto-fix by adding missing scopes.",
        inputSchema: {
          type: "object",
          properties: {
            pageConfigPath: {
              type: "string",
              description: "Path to pageConfig.tsx file",
            },
            authenticatedRoutePath: {
              type: "string",
              description: "Path to AuthenticatedRoute.jsx file",
            },
            fix: {
              type: "boolean",
              description: "Auto-add missing scopes to AuthenticatedRoute",
              default: false,
            },
          },
        },
      },
      {
        name: "generate_column_defs",
        description:
          "Generate AG Grid column definitions from TypeScript interface, sample data, or field list. Creates complete ColDef array with filters, formatters, and renderers.",
        inputSchema: {
          type: "object",
          properties: {
            fields: {
              type: "array",
              description: "Array of field definitions with name, type, and options",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string", enum: ["string", "number", "boolean", "date", "array", "object"] },
                  headerName: { type: "string" },
                  editable: { type: "boolean" },
                  isStatus: { type: "boolean" },
                  format: { type: "string", enum: ["currency", "percent", "date", "datetime"] },
                },
              },
            },
            interfaceDefinition: {
              type: "string",
              description: "TypeScript interface definition as string",
            },
            sampleData: {
              type: "object",
              description: "Sample data object to infer types from",
            },
            includeActions: {
              type: "boolean",
              description: "Include edit/delete actions column",
              default: true,
            },
            dataTypeName: {
              type: "string",
              description: "Name for the row data type",
              default: "RowData",
            },
          },
        },
      },

      // ============ PHASE 2: WORKFLOW TOOLS ============
      {
        name: "design_review",
        description:
          "Multi-step design review workflow. Analyzes code for convention violations, checks component usage patterns, reviews styling consistency, and generates actionable fix suggestions. Can auto-apply fixes.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Path to file to review (relative to demo/)",
            },
            code: {
              type: "string",
              description: "Inline code to review",
            },
            directory: {
              type: "string",
              description: "Directory to scan for all TSX/JSX files",
            },
            autoFix: {
              type: "boolean",
              description: "Automatically apply fixes for auto-fixable issues",
              default: false,
            },
            focus: {
              type: "string",
              enum: ["all", "components", "styling", "structure"],
              description: "Focus area for the review",
              default: "all",
            },
            verbose: {
              type: "boolean",
              description: "Include detailed file list in report",
              default: false,
            },
          },
        },
      },
      {
        name: "feature_builder",
        description:
          "Interactive wizard for creating complete features. Guides through steps: define name → configure fields → set options → generate scaffolding. Creates API hooks, types, page component, grid columns, and form modal.",
        inputSchema: {
          type: "object",
          properties: {
            step: {
              type: "string",
              enum: ["start", "fields", "options", "generate"],
              description: "Current wizard step",
              default: "start",
            },
            name: {
              type: "string",
              description: "Feature name in PascalCase",
            },
            description: {
              type: "string",
              description: "Brief description of the feature",
            },
            fields: {
              type: "array",
              description: "Field definitions",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string", enum: ["string", "number", "boolean", "date", "select"] },
                  required: { type: "boolean" },
                  options: { type: "array", items: { type: "string" } },
                },
              },
            },
            includeGrid: { type: "boolean", default: true },
            includeForm: { type: "boolean", default: true },
            includeDetailPanel: { type: "boolean", default: false },
            includeFilters: { type: "boolean", default: false },
            apiPrefix: { type: "string" },
          },
        },
      },
      {
        name: "figma_to_code",
        description:
          "Convert Figma designs to Excalibrr code. Pipeline: analyze design structure → map to Excalibrr components → generate code → validate. Accepts Figma URL, node ID, or design structure JSON.",
        inputSchema: {
          type: "object",
          properties: {
            figmaUrl: {
              type: "string",
              description: "Figma file URL",
            },
            figmaFileId: {
              type: "string",
              description: "Figma file ID",
            },
            figmaNodeId: {
              type: "string",
              description: "Specific node ID to convert",
            },
            designStructure: {
              type: "object",
              description: "Design tree structure (from Figma MCP or manual)",
            },
            componentName: {
              type: "string",
              description: "Name for generated component",
              default: "GeneratedComponent",
            },
            outputPath: {
              type: "string",
              description: "Path to save generated file",
            },
            validate: {
              type: "boolean",
              description: "Validate generated code against conventions",
              default: true,
            },
          },
        },
      },

      // ============ DEMO CREATION TOOLS ============
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
        name: "create_form_demo",
        description:
          "Create a form demo with real Excalibrr components based on Gravitate patterns",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Name for the form demo (e.g., 'ProductForm', 'UserManagement')",
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
                    enum: [
                      "text",
                      "email",
                      "number",
                      "select",
                      "date",
                      "dateRange",
                      "switch",
                      "checkbox",
                    ],
                    description: "Field type",
                  },
                  required: {
                    type: "boolean",
                    description: "Whether field is required",
                  },
                  placeholder: {
                    type: "string",
                    description: "Placeholder text",
                  },
                  options: {
                    type: "array",
                    items: { type: "string" },
                    description: "Options for select fields",
                  },
                },
                required: ["name", "label", "type"],
              },
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
                    description: "Action type",
                  },
                  label: { type: "string", description: "Button label" },
                  theme: {
                    type: "string",
                    enum: ["success", "theme1", "default"],
                    description: "Button theme",
                  },
                },
                required: ["type", "label"],
              },
            },
          },
          required: ["name", "fields"],
        },
      },
      
      // ============ MODIFICATION TOOLS ============
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
              description:
                "Configuration for the modification. For add_column: include field, headerName, type, editable (boolean), etc.",
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
                  description:
                    "Whether the column should be editable. If true for number columns, NumberCellEditor will be added automatically.",
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
        name: "cleanup_styles",
        description:
          "Automatically clean up inline styles and replace with utility classes following the prefer-utility-css-classes rule",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Specific file to clean up (optional - if not provided, processes all TSX/JSX files in demo/src)",
            },
            pattern: {
              type: "string",
              description: "File pattern to match (default: **/*.{tsx,jsx})",
              default: "**/*.{tsx,jsx}",
            },
          },
        },
      },
      
      // ============ SERVER & MANAGEMENT TOOLS ============
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
        name: "cleanup_demo",
        description:
          "Remove a demo and clean up all references (pageConfig, scopes, files)",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "Name of the demo to remove (e.g., 'ProductForm', 'CustomerForm')",
            },
            force: {
              type: "boolean",
              description: "Skip confirmation and force removal",
              default: false,
            },
          },
          required: ["name"],
        },
      },
      
      // ============ FIGMA INTEGRATION TOOLS ============
      {
        name: "import_from_figma",
        description:
          "Import a component or design from Figma and convert to React/Excalibrr code",
        inputSchema: {
          type: "object",
          properties: {
            fileUrl: {
              type: "string",
              description: "Figma file URL (can paste directly from browser)",
            },
            fileId: {
              type: "string",
              description: "Figma file ID (alternative to fileUrl)",
            },
            nodeId: {
              type: "string",
              description: "Specific node/component ID to import",
            },
            componentName: {
              type: "string",
              description: "Name of component to import",
            },
          },
        },
      },
      {
        name: "list_figma_components",
        description: "List all available components in a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            fileUrl: {
              type: "string",
              description: "Figma file URL (can paste directly from browser)",
            },
            fileId: {
              type: "string",
              description: "Figma file ID (alternative to fileUrl)",
            },
          },
        },
      },
      
      // ============ COMPONENT REGISTRY TOOLS ============
      {
        name: "list_components",
        description:
          "Browse all available Excalibrr components from the registry. Filter by category, complexity, or tags.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Filter by category (e.g., 'data', 'forms', 'layout', 'overlay')",
            },
            complexity: {
              type: "string",
              enum: ["simple", "medium", "complex"],
              description: "Filter by complexity level",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Filter by tags (e.g., 'grid', 'button', 'form')",
            },
            limit: {
              type: "number",
              description: "Limit the number of results",
            },
          },
        },
      },
      {
        name: "search_components",
        description:
          "Search for Excalibrr components by name, description, or tags. Returns matching components with details.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query (matches name, description, tags)",
            },
            category: {
              type: "string",
              description: "Filter results by category",
            },
            complexity: {
              type: "string",
              enum: ["simple", "medium", "complex"],
              description: "Filter by complexity level",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Filter by specific tags",
            },
            limit: {
              type: "number",
              description: "Limit the number of results (default: 10)",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_component",
        description:
          "Get full details for a specific component including props, examples, and usage instructions.",
        inputSchema: {
          type: "object",
          properties: {
            componentId: {
              type: "string",
              description: "Component ID (e.g., 'gravi-grid', 'gravi-button')",
            },
          },
          required: ["componentId"],
        },
      },
      {
        name: "install_component",
        description:
          "Install an Excalibrr component into your project. Shows usage instructions and checks dependencies.",
        inputSchema: {
          type: "object",
          properties: {
            componentId: {
              type: "string",
              description: "Component ID to install",
            },
            projectPath: {
              type: "string",
              description: "Target project path (defaults to demo workspace)",
            },
            installDependencies: {
              type: "boolean",
              description: "Check and report missing dependencies",
              default: true,
            },
            customName: {
              type: "string",
              description: "Custom name for the component (optional)",
            },
          },
          required: ["componentId"],
        },
      },
      
      // ============ HELP TOOL ============
      {
        name: "help",
        description:
          "Get help when you're not sure what to do or if I don't understand your request",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "What you're trying to accomplish or what you need help with",
            },
            context: {
              type: "string",
              description: "Additional context about your situation",
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Validation & Conventions Tools
      case "validate_code":
        return await validateCodeTool(args as any);
      case "get_conventions":
        return await getConventionsTool(args as any);
      case "convert_to_excalibrr":
        return await convertToExcalibrTool(args as any);
      case "review_component":
        return await reviewComponentTool(args as any);
        
      // Phase 2: Feature Scaffolding Tools
      case "scaffold_feature":
        return await scaffoldFeatureTool(args as any);
      case "check_navigation_sync":
        return await checkNavigationSyncTool(args as any);
      case "generate_column_defs":
        return await generateColumnDefsTool(args as any);
        
      // Phase 2: Workflow Tools
      case "design_review":
        return await designReviewWorkflow(args as any);
      case "feature_builder":
        return await featureBuilderWizard(args as any);
      case "figma_to_code":
        return await figmaToCodePipeline(args as any);
        
      // Demo Creation Tools
      case "create_demo":
        return await createDemoTool(args as any);
      case "create_form_demo":
        return {
          content: [{ type: "text", text: await createFormDemo(args as any) }],
        };
        
      // Modification Tools
      case "modify_grid":
        return await modifyGridTool(args as any);
      case "change_theme":
        return await changeThemeTool(args as any);
      case "cleanup_styles":
        return await cleanupStylesTool(args as any);
        
      // Server & Management Tools
      case "run_dev_server":
        return await runDevServerTool(args as any);
      case "cleanup_demo":
        return {
          content: [{ type: "text", text: await cleanupDemo(args as any) }],
        };
        
      // Figma Tools
      case "import_from_figma":
        return {
          content: [{ type: "text", text: await importFromFigma(args as any) }],
        };
      case "list_figma_components":
        return {
          content: [
            { type: "text", text: await listFigmaComponents(args as any) },
          ],
        };
        
      // Component Registry Tools
      case "list_components":
        return await listComponentsTool(args as any);
      case "search_components":
        return await searchComponentsTool(args as any);
      case "get_component":
        return await getComponentTool(args as any);
      case "install_component":
        return await installComponentTool(args as any);
        
      // Help Tool
      case "help":
        return {
          content: [{ type: "text", text: await helpTool(args as any) }],
        };
        
      default:
        // Use safeguards for unknown tools
        const safeguardResult = processSafeguards(`Unknown tool: ${name}`);
        const response =
          formatSafeguardResponse(safeguardResult) ||
          `Unknown tool: ${name}. Use 'help' tool to see available options.`;
        return {
          content: [{ type: "text", text: response }],
          isError: true,
        };
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
  console.error("Excalibrr MCP Server v2.3 running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
