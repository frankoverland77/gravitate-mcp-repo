// Component discovery tools

import { z } from "zod";
import * as path from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ComponentInfo,
  ComponentLibrary,
  ComponentCategory,
} from "../../lib/types.js";
import {
  getAllComponents,
  findComponentByName,
  findUsageExamples,
  analyzeComponentRelationships,
} from "../../lib/componentAnalysis.js";
import {
  EXCALIBRR_LIBRARY_PATH,
  USAGE_EXAMPLES_PATH,
} from "../../utils/constants.js";

export function registerDiscoveryTools(server: McpServer): void {
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
        const components = await getAllComponents();

        if (includeExamples) {
          for (const component of components) {
            component.examples = await findUsageExamples(
              component.name,
              USAGE_EXAMPLES_PATH
            );
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
      componentName: z
        .string()
        .describe("The name of the component to analyze"),
    },
    async ({ componentName }) => {
      try {
        const componentInfo = await findComponentByName(componentName);

        if (!componentInfo) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${componentName}" not found in the Excalibrr library.`,
              },
            ],
          };
        }

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
        const allComponents = await getAllComponents();

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

  // Tool: Find component relationships
  server.tool(
    "find_component_relationships",
    "Find components that work well together and are commonly used in combination",
    {
      componentName: z
        .string()
        .describe("The component to find relationships for"),
      relationshipType: z
        .enum([
          "commonly-used-with",
          "contains",
          "contained-by",
          "alternatives",
        ])
        .optional()
        .describe("Type of relationship to find"),
    },
    async ({ componentName, relationshipType = "commonly-used-with" }) => {
      try {
        const usageExamples = await findUsageExamples(
          componentName,
          USAGE_EXAMPLES_PATH
        );
        const relationships = await analyzeComponentRelationships(
          componentName,
          usageExamples
        );

        if (!relationships || Object.keys(relationships).length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No relationships found for "${componentName}". This might be a rarely used component or it may not exist.`,
              },
            ],
          };
        }

        let responseText = `# Component Relationships for ${componentName}\n\n`;

        if (
          relationshipType === "commonly-used-with" &&
          relationships.commonlyUsedWith?.length > 0
        ) {
          responseText += `## Commonly Used With:\n\n${relationships.commonlyUsedWith
            .map(
              (rel) =>
                `**${rel.component}** - ${rel.reason}\n` +
                `  Frequency: ${rel.frequency} occurrences\n` +
                `  Example: \`${rel.exampleUsage}\`\n\n`
            )
            .join("")}`;
        }

        if (relationships.containers?.length > 0) {
          responseText += `## Often Contains:\n\n${relationships.containers
            .map((rel) => `- **${rel.component}** (${rel.reason})`)
            .join("\n")}\n\n`;
        }

        if (relationships.patterns?.length > 0) {
          responseText += `## Common Patterns:\n\n${relationships.patterns
            .map(
              (pattern) =>
                `**${pattern.name}**: ${pattern.components.join(" + ")}\n` +
                `  Use case: ${pattern.useCase}\n\n`
            )
            .join("")}`;
        }

        return {
          content: [
            {
              type: "text",
              text: responseText,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error finding relationships: ${error}`,
            },
          ],
        };
      }
    }
  );
}
