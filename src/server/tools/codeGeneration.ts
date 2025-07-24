// Code generation tools

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ComponentInfo, UseCase } from "../../lib/types.js";
import { findComponentByName } from "../../lib/componentAnalysis.js";
import {
  generateGraviGridCode,
  generateLayoutCode,
  generateFormCode,
  generateGenericCode,
} from "../../lib/codeGenerators.js";

export function registerCodeGenerationTools(server: McpServer): void {
  // Tool: Generate component usage code
  server.tool(
    "generate_component_code",
    "Generate boilerplate code for using Excalibrr components",
    {
      componentName: z
        .string()
        .describe("The name of the component to generate code for"),
      useCase: z
        .enum(["basic", "with-props", "full-example", "grid-with-data"])
        .optional()
        .describe("Type of code example to generate"),
      includeImports: z
        .boolean()
        .optional()
        .describe("Whether to include import statements"),
    },
    async ({ componentName, useCase = "basic", includeImports = true }) => {
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

        // Generate code based on component type and use case
        let generatedCode = "";
        let imports = "";

        if (includeImports) {
          imports = `import { ${componentName} } from '@gravitate-js/excalibrr';\nimport React from 'react';\n\n`;
        }

        // Generate different examples based on component category and use case
        if (
          componentInfo.category === "data" &&
          componentName === "GraviGrid"
        ) {
          generatedCode = generateGraviGridCode(useCase);
        } else if (componentInfo.category === "layout") {
          generatedCode = generateLayoutCode(
            componentName,
            componentInfo,
            useCase
          );
        } else if (componentInfo.category === "forms") {
          generatedCode = generateFormCode(
            componentName,
            componentInfo,
            useCase
          );
        } else {
          generatedCode = generateGenericCode(
            componentName,
            componentInfo,
            useCase
          );
        }

        return {
          content: [
            {
              type: "text",
              text:
                `# Generated Code for ${componentName}\n\n` +
                `**Category:** ${componentInfo.category}\n` +
                `**Use Case:** ${useCase}\n\n` +
                `\`\`\`tsx\n${imports}${generatedCode}\n\`\`\``,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error generating code: ${error}`,
            },
          ],
        };
      }
    }
  );
}
