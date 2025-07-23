#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Create server instance
const server = new McpServer({
  name: "excalibrr-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Configuration for Excalibrr library paths
const EXCALIBRR_LIBRARY_PATH =
  process.env.EXCALIBRR_PATH || "/Users/rebecca.hirai/repos/excalibrr";
const USAGE_EXAMPLES_PATH =
  process.env.USAGE_EXAMPLES_PATH ||
  "/Users/rebecca.hirai/repos/Gravitate.Dotnet.Next/frontend/src";

// Types for our component analysis
interface ComponentInfo {
  name: string;
  file: string;
  props?: Record<string, any>;
  description?: string;
  examples?: string[];
  category?: string;
}

interface ComponentLibrary {
  components: ComponentInfo[];
  lastUpdated: string;
  libraryPath: string;
}

// Helper function to scan for TypeScript component files
async function scanForComponents(dirPath: string): Promise<string[]> {
  try {
    const files: string[] = [];

    async function scanDirectory(currentPath: string) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (
          entry.isDirectory() &&
          !entry.name.startsWith(".") &&
          entry.name !== "node_modules" &&
          entry.name !== "dist" && // Skip dist directory
          entry.name !== "build"
        ) {
          // Skip build directory
          await scanDirectory(fullPath);
        } else if (
          entry.isFile() &&
          (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) &&
          !entry.name.includes(".test.") &&
          !entry.name.includes(".spec.") &&
          !entry.name.includes(".d.ts")
        ) {
          // Skip type definition files
          files.push(fullPath);
        }
      }
    }

    await scanDirectory(dirPath);
    return files;
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
    return [];
  }
}

// Helper function to extract component info from file content
async function extractComponentInfo(
  filePath: string
): Promise<ComponentInfo | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const fileName = path.basename(filePath, path.extname(filePath));

    // Skip non-component files
    if (
      fileName.includes(".test") ||
      fileName.includes(".spec") ||
      fileName.includes(".stories")
    ) {
      return null;
    }

    // Multiple patterns to find component exports
    const exportPatterns = [
      /export\s+default\s+(?:function\s+)?(\w+)/,
      /export\s+(?:function|const)\s+(\w+)/,
      /export\s*{\s*(\w+)(?:\s+as\s+default)?\s*}/,
      /const\s+(\w+)\s*=.*=>\s*{/,
      /function\s+(\w+)\s*\(/,
    ];

    let componentName: string | null = null;
    for (const pattern of exportPatterns) {
      const match = content.match(pattern);
      if (match) {
        componentName = match[1];
        break;
      }
    }

    if (!componentName) return null;

    // Look for various interface patterns - more comprehensive search
    const interfacePatterns = [
      new RegExp(`interface\\s+${componentName}Props\\s*{([^}]*)}`, "s"),
      new RegExp(`type\\s+${componentName}Props\\s*=\\s*{([^}]*)}`, "s"),
      /interface\s+Props\s*{([^}]*)}/s,
      /type\s+Props\s*=\s*{([^}]*)}/s,
      /interface\s+(\w*Props)\s*{([^}]*)}/s,
      /type\s+(\w*Props)\s*=\s*{([^}]*)}/s,
      // Also look for inline prop types in function signatures
      new RegExp(`${componentName}\\s*[=:]\\s*\\([^)]*{([^}]*)}[^)]*\\)`, "s"),
    ];

    let props: Record<string, any> = {};
    let propsContent = "";

    for (const pattern of interfacePatterns) {
      const match = content.match(pattern);
      if (match) {
        // Get the props content from the last capture group that contains curly braces content
        propsContent =
          match.find((group) => group && group.includes(":")) ||
          match[match.length - 1];
        if (propsContent) break;
      }
    }

    // Parse the props content if found
    if (propsContent) {
      const propLines = propsContent
        .split(/[;\n,]/)
        .filter(
          (line) =>
            line.trim() &&
            !line.trim().startsWith("//") &&
            !line.trim().startsWith("/*") &&
            line.includes(":")
        );

      for (const line of propLines) {
        const propMatch = line.match(/(\w+)(\?)?:\s*([^;,\n}]+)/);
        if (propMatch) {
          const [, propName, optional, propType] = propMatch;
          props[propName] = {
            type: propType.trim(),
            required: !optional,
            description: null,
          };
        }
      }
    }

    // Look for JSDoc description
    const descriptionPatterns = [
      /\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/,
      /\/\*\*\s*(.+?)\s*\*\//s,
      /\/\/\s*(.+)$/m,
    ];

    let description: string | undefined;
    for (const pattern of descriptionPatterns) {
      const match = content.match(pattern);
      if (match) {
        description = match[1].replace(/\*/g, "").trim();
        break;
      }
    }

    // Better categorization based on component patterns
    let category = "ui";
    if (
      fileName.toLowerCase().includes("grid") ||
      componentName.toLowerCase().includes("grid")
    ) {
      category = "data";
    } else if (
      fileName.toLowerCase().includes("form") ||
      componentName.toLowerCase().includes("form")
    ) {
      category = "forms";
    } else if (
      fileName.toLowerCase().includes("layout") ||
      fileName.toLowerCase().includes("horizontal") ||
      fileName.toLowerCase().includes("vertical") ||
      componentName.toLowerCase().includes("layout")
    ) {
      category = "layout";
    } else if (content.includes("useState") || content.includes("useEffect")) {
      category = "interactive";
    }

    return {
      name: componentName,
      file: filePath,
      props,
      description,
      category,
    };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

// Helper function to find usage examples
async function findUsageExamples(
  componentName: string,
  examplesPath: string
): Promise<string[]> {
  try {
    const files = await scanForComponents(examplesPath);
    const examples: string[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      if (content.includes(componentName)) {
        // Extract the lines around the component usage
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(componentName)) {
            const start = Math.max(0, i - 2);
            const end = Math.min(lines.length, i + 5);
            const example = lines.slice(start, end).join("\n");
            examples.push(`// From ${path.basename(file)}:\n${example}`);
          }
        }
      }
    }

    return examples.slice(0, 3); // Limit to 3 examples
  } catch (error) {
    console.error(`Error finding usage examples:`, error);
    return [];
  }
}

// Tool: Discover all components in the Excalibrr library
server.tool(
  "discover_components",
  "Discover all available components in the Excalibrr library",
  {
    includeExamples: z
      .boolean()
      .optional()
      .describe("Whether to include usage examples from the main project"),
  },
  async ({ includeExamples = false }) => {
    try {
      const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);
      const components: ComponentInfo[] = [];

      for (const file of componentFiles) {
        const componentInfo = await extractComponentInfo(file);
        if (componentInfo) {
          if (includeExamples) {
            componentInfo.examples = await findUsageExamples(
              componentInfo.name,
              USAGE_EXAMPLES_PATH
            );
          }
          components.push(componentInfo);
        }
      }

      const library: ComponentLibrary = {
        components,
        lastUpdated: new Date().toISOString(),
        libraryPath: EXCALIBRR_LIBRARY_PATH,
      };

      return {
        content: [
          {
            type: "text",
            text: `Found ${
              components.length
            } components in Excalibrr library:\n\n${components
              .map(
                (comp) =>
                  `**${comp.name}** (${comp.category})\n` +
                  `  File: ${path.relative(
                    EXCALIBRR_LIBRARY_PATH,
                    comp.file
                  )}\n` +
                  (comp.description
                    ? `  Description: ${comp.description}\n`
                    : "") +
                  `  Props: ${
                    Object.keys(comp.props || {}).length
                  } properties\n` +
                  (comp.examples?.length
                    ? `  Examples: ${comp.examples.length} usage patterns found\n`
                    : "") +
                  "\n"
              )
              .join("")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error discovering components: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool: Get detailed information about a specific component
server.tool(
  "get_component_details",
  "Get detailed information about a specific Excalibrr component",
  {
    componentName: z.string().describe("The name of the component to analyze"),
  },
  async ({ componentName }) => {
    try {
      const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);

      for (const file of componentFiles) {
        const componentInfo = await extractComponentInfo(file);
        if (componentInfo && componentInfo.name === componentName) {
          // Add usage examples
          componentInfo.examples = await findUsageExamples(
            componentName,
            USAGE_EXAMPLES_PATH
          );

          const propsDetails = Object.entries(componentInfo.props || {})
            .map(
              ([name, info]) =>
                `  ${name}${info.required ? "" : "?"}: ${info.type}`
            )
            .join("\n");

          return {
            content: [
              {
                type: "text",
                text:
                  `# ${componentName}\n\n` +
                  `**Category:** ${componentInfo.category}\n` +
                  `**File:** ${path.relative(
                    EXCALIBRR_LIBRARY_PATH,
                    componentInfo.file
                  )}\n\n` +
                  (componentInfo.description
                    ? `**Description:** ${componentInfo.description}\n\n`
                    : "") +
                  `## Props\n\`\`\`typescript\n${
                    propsDetails || "No props interface found"
                  }\n\`\`\`\n\n` +
                  (componentInfo.examples?.length
                    ? `## Usage Examples\n\n${componentInfo.examples
                        .map((ex) => `\`\`\`tsx\n${ex}\n\`\`\``)
                        .join("\n\n")}\n`
                    : "No usage examples found in the main project.\n"),
              },
            ],
          };
        }
      }

      return {
        content: [
          {
            type: "text",
            text: `Component "${componentName}" not found in the Excalibrr library.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting component details: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool: Search components by category or functionality
server.tool(
  "search_components",
  "Search for components by category, name, or functionality",
  {
    query: z
      .string()
      .describe("Search query (component name, category, or functionality)"),
    category: z
      .enum(["data", "forms", "layout", "interactive", "ui", "all"])
      .optional()
      .describe("Filter by component category"),
  },
  async ({ query, category = "all" }) => {
    try {
      const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);
      const allComponents: ComponentInfo[] = [];

      for (const file of componentFiles) {
        const componentInfo = await extractComponentInfo(file);
        if (componentInfo) {
          allComponents.push(componentInfo);
        }
      }

      const filteredComponents = allComponents.filter((comp) => {
        const matchesQuery =
          comp.name.toLowerCase().includes(query.toLowerCase()) ||
          comp.description?.toLowerCase().includes(query.toLowerCase()) ||
          comp.file.toLowerCase().includes(query.toLowerCase());
        const matchesCategory =
          category === "all" || comp.category === category;

        return matchesQuery && matchesCategory;
      });

      if (filteredComponents.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No components found matching "${query}"${
                category !== "all" ? ` in category "${category}"` : ""
              }.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Found ${
              filteredComponents.length
            } component(s) matching "${query}":\n\n${filteredComponents
              .map(
                (comp) =>
                  `**${comp.name}** (${comp.category})\n` +
                  `  ${comp.description || "No description available"}\n` +
                  `  Props: ${
                    Object.keys(comp.props || {}).length
                  } properties\n\n`
              )
              .join("")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching components: ${error}`,
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Excalibrr MCP Server running on stdio");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
