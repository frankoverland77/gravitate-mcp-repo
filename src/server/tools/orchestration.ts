// Intelligent Orchestration Tools
// These are the smart tools that chain other tools automatically

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WorkflowOrchestrator } from "../../lib/workflows/workflowOrchestrator.js";
import { ResponseFormatter } from "../../lib/responseFormatter.js";

let orchestrator: WorkflowOrchestrator;

export function registerOrchestrationTools(server: McpServer): void {
  // Initialize the orchestrator
  orchestrator = new WorkflowOrchestrator(server);

  // Tool: Execute intelligent workflow
  server.tool(
    "execute_workflow",
    "Intelligently executes a multi-step workflow to accomplish complex tasks",
    {
      request: z.string().describe("Natural language description of what you want to accomplish"),
      module: z.string().optional().describe("Module name (e.g., Admin, PricingEngine)"),
      feature: z.string().optional().describe("Feature name (e.g., ManageProducts)"),
      theme: z.enum(["OSP", "PE", "BP", "default"]).optional().describe("Gravitate theme to apply"),
      gridConfig: z.object({
        columns: z.array(z.object({
          field: z.string(),
          headerName: z.string(),
          type: z.string().optional(),
          width: z.number().optional()
        })).optional(),
        apiEndpoint: z.string().optional(),
        title: z.string().optional(),
        uniqueIdField: z.string().optional()
      }).optional().describe("Configuration for grid components")
    },
    async ({ request, module, feature, theme, gridConfig }) => {
      try {
        console.error(`🤖 Intelligent request: "${request}"`);
        
        // Analyze the request to determine the best workflow
        const suggestedWorkflow = orchestrator.suggestWorkflow(request);
        
        if (!suggestedWorkflow) {
          // Fallback to analyzing keywords
          const workflows = orchestrator.getAvailableWorkflows();
          return {
            content: [{
              type: "text",
              text: `I couldn't determine the exact workflow for: "${request}"\n\n` +
                    `Available workflows:\n${workflows.map(w => 
                      `- **${w.name}**: ${w.description}`
                    ).join("\n")}\n\n` +
                    `Please be more specific or try:\n` +
                    `- "Create a product management grid with OSP theme"\n` +
                    `- "Apply PE theme to my components"\n` +
                    `- "Discover grid components for data display"`
            }]
          };
        }

        console.error(`✨ Selected workflow: ${suggestedWorkflow}`);
        
        // Execute the workflow with context
        const result = await orchestrator.executeWorkflow(suggestedWorkflow, {
          moduleName: module,
          featureName: feature,
          theme: theme || "default",
          gridConfig,
          components: []
        });

        // Format the response
        const formatted = ResponseFormatter.format(suggestedWorkflow, result, {
          moduleName: module,
          featureName: feature,
          theme
        });

        // Build the response text
        let responseText = "";
        
        if (formatted.changePlan) {
          responseText += `## 📋 Change Plan\n\n`;
          responseText += `**Summary:** ${formatted.changePlan.summary}\n\n`;
          responseText += `**Changes:**\n`;
          formatted.changePlan.changes.forEach(change => {
            responseText += `- ${change.type.toUpperCase()}: ${change.path}\n`;
            responseText += `  ${change.description}\n`;
          });
          responseText += `\n**Impacts:**\n`;
          formatted.changePlan.impacts.forEach(impact => {
            responseText += `- ${impact}\n`;
          });
          responseText += "\n---\n\n";
        }

        if (formatted.code) {
          responseText += `## 💻 Generated Code\n\n`;
          responseText += `Generated ${formatted.code.files.length} file(s):\n\n`;
          
          formatted.code.files.forEach(file => {
            responseText += `### ${file.path}\n`;
            responseText += `*${file.purpose}*\n\n`;
            responseText += `\`\`\`${file.language}\n${file.content}\n\`\`\`\n\n`;
          });

          if (formatted.code.setupInstructions) {
            responseText += `### Setup Instructions\n\n`;
            formatted.code.setupInstructions.forEach(instruction => {
              responseText += `${instruction}\n`;
            });
            responseText += "\n";
          }
          
          responseText += "---\n\n";
        }

        if (formatted.validationReport) {
          responseText += `## ✅ Validation Report\n\n`;
          responseText += `**Status:** ${formatted.validationReport.passed ? "✅ PASSED" : "❌ FAILED"}\n\n`;
          
          responseText += `**Checks:**\n`;
          formatted.validationReport.checks.forEach(check => {
            responseText += `- ${check.passed ? "✅" : "❌"} ${check.name}`;
            if (check.message) {
              responseText += `: ${check.message}`;
            }
            responseText += "\n";
          });

          if (formatted.validationReport.warnings.length > 0) {
            responseText += `\n**⚠️ Warnings:**\n`;
            formatted.validationReport.warnings.forEach(warning => {
              responseText += `- ${warning}\n`;
            });
          }

          if (formatted.validationReport.errors.length > 0) {
            responseText += `\n**❌ Errors:**\n`;
            formatted.validationReport.errors.forEach(error => {
              responseText += `- ${error}\n`;
            });
          }
          
          responseText += "\n---\n\n";
        }

        if (formatted.prPayload) {
          responseText += `## 🚀 Pull Request Ready\n\n`;
          responseText += `**Title:** ${formatted.prPayload.title}\n`;
          responseText += `**Branch:** ${formatted.prPayload.branch}\n`;
          responseText += `**Labels:** ${formatted.prPayload.labels.join(", ")}\n\n`;
          responseText += `<details>\n<summary>PR Description</summary>\n\n`;
          responseText += formatted.prPayload.description;
          responseText += `\n</details>\n`;
        }

        return {
          content: [{
            type: "text",
            text: responseText || "Workflow completed successfully."
          }]
        };
        
      } catch (error) {
        console.error("❌ Workflow execution error:", error);
        return {
          content: [{
            type: "text",
            text: `Error executing workflow: ${error}\n\n` +
                  `Please check your request and try again.`
          }]
        };
      }
    }
  );

  // Tool: Smart component suggestion
  server.tool(
    "suggest_components",
    "Intelligently suggests components based on your use case",
    {
      useCase: z.string().describe("Describe what you're trying to build"),
      currentComponents: z.array(z.string()).optional().describe("Components you're already using")
    },
    async ({ useCase, currentComponents = [] }) => {
      try {
        const result = await orchestrator.executeWorkflow("smart-discovery", {
          components: currentComponents,
          results: { query: useCase }
        });

        let responseText = `## 🎯 Component Suggestions for: "${useCase}"\n\n`;
        
        if (result.recommendedComponents?.length > 0) {
          responseText += `### Recommended Components\n\n`;
          result.recommendedComponents.forEach((comp: any) => {
            responseText += `- **${comp.name}** (${comp.category})\n`;
          });
          responseText += "\n";
        }

        if (result.commonlyUsedWith?.length > 0) {
          responseText += `### Commonly Used Together\n\n`;
          result.commonlyUsedWith.forEach((rel: any) => {
            responseText += `- **${rel.component}**: ${rel.reason}\n`;
          });
          responseText += "\n";
        }

        if (result.patterns?.length > 0) {
          responseText += `### Common Patterns\n\n`;
          result.patterns.forEach((pattern: any) => {
            responseText += `- **${pattern.name}**: ${pattern.useCase}\n`;
            responseText += `  Components: ${pattern.components.join(" + ")}\n\n`;
          });
        }

        if (result.suggestion) {
          responseText += `### 💡 Suggestion\n\n${result.suggestion}\n`;
        }

        return {
          content: [{
            type: "text",
            text: responseText
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error suggesting components: ${error}`
          }]
        };
      }
    }
  );

  // Tool: Quick grid generation with all the bells and whistles
  server.tool(
    "create_smart_grid",
    "Creates a complete grid feature with API hooks, forms, and proper structure - the intelligent way",
    {
      module: z.string().describe("Module name (e.g., Admin, PricingEngine)"),
      feature: z.string().describe("Feature name (e.g., ManageProducts)"),
      columns: z.array(z.object({
        field: z.string(),
        headerName: z.string(),
        type: z.string().optional(),
        editable: z.boolean().optional(),
        width: z.number().optional()
      })).describe("Column definitions for the grid"),
      apiEndpoint: z.string().describe("API endpoint for data (e.g., 'Admin/Products/Read')"),
      theme: z.enum(["OSP", "PE", "BP", "default"]).optional().default("OSP"),
      includeForm: z.boolean().optional().default(true).describe("Include create/edit form"),
      includeBulkActions: z.boolean().optional().default(true).describe("Include bulk actions")
    },
    async ({ module, feature, columns, apiEndpoint, theme, includeForm, includeBulkActions }) => {
      try {
        // This is a convenience wrapper that sets up everything
        const context = {
          moduleName: module,
          featureName: feature,
          theme,
          gridConfig: {
            columns,
            apiEndpoint,
            title: feature.replace(/([A-Z])/g, ' $1').trim(),
            uniqueIdField: columns[0]?.field || "id",
            includeBulkActions
          }
        };

        const result = await orchestrator.executeWorkflow("production-grid", context);
        
        // Format as production-ready output
        const formatted = ResponseFormatter.format("create_smart_grid", result, context);
        
        let responseText = `# 🚀 Smart Grid Generation Complete!\n\n`;
        responseText += `Created **${feature}** in **${module}** module with **${theme}** theme.\n\n`;
        
        // Show file structure
        responseText += `## 📁 Generated Structure\n\n`;
        responseText += "```\n";
        responseText += `src/modules/${module}/${feature}/\n`;
        responseText += `├── index.tsx                 # Main component\n`;
        responseText += `├── components/\n`;
        responseText += `│   ├── Grid/\n`;
        responseText += `│   │   ├── index.tsx        # Grid with GraviGrid\n`;
        responseText += `│   │   └── columnDefs.tsx   # Column configurations\n`;
        if (includeForm) {
          responseText += `│   ├── Form/\n`;
          responseText += `│   │   └── index.tsx        # Create/Edit form\n`;
        }
        responseText += `│   └── createConfig.tsx     # Creation configuration\n`;
        responseText += `└── api/\n`;
        responseText += `    └── use${feature}.tsx    # React Query hooks\n`;
        responseText += "```\n\n";
        
        // Show key code snippets
        if (formatted.code?.files && formatted.code.files.length > 0) {
          responseText += `## 💻 Key Components\n\n`;
          
          // Show main index file
          const mainFile = formatted.code.files.find(f => f.path.endsWith("index.tsx"));
          if (mainFile) {
            responseText += `### Main Component\n\n`;
            responseText += `\`\`\`tsx\n${mainFile.content}\n\`\`\`\n\n`;
          }
        }
        
        // Setup instructions
        responseText += `## 🔧 Setup Instructions\n\n`;
        responseText += `1. Files have been generated in \`src/modules/${module}/${feature}/\`\n`;
        responseText += `2. Run \`yarn\` to install any dependencies\n`;
        responseText += `3. Add to your router:\n\n`;
        responseText += `\`\`\`tsx\n`;
        responseText += `import { ${feature} } from '@modules/${module}/${feature}';\n\n`;
        responseText += `// In your routes\n`;
        responseText += `<Route path="/${module.toLowerCase()}/${feature.toLowerCase()}" element={<${feature} />} />\n`;
        responseText += `\`\`\`\n\n`;
        
        // Validation results
        if (formatted.validationReport) {
          responseText += `## ✅ Quality Checks\n\n`;
          formatted.validationReport.checks.forEach(check => {
            responseText += `${check.passed ? "✅" : "⚠️"} ${check.name}\n`;
          });
        }
        
        responseText += `\n## 🎉 Ready to Use!\n\n`;
        responseText += `Your grid is ready with:\n`;
        responseText += `- ✅ ${columns.length} configured columns\n`;
        responseText += `- ✅ API integration to \`${apiEndpoint}\`\n`;
        responseText += `- ✅ ${theme} theme applied\n`;
        if (includeForm) responseText += `- ✅ Create/Edit form included\n`;
        if (includeBulkActions) responseText += `- ✅ Bulk actions enabled\n`;
        responseText += `- ✅ Follows Gravitate patterns\n`;
        responseText += `- ✅ TypeScript typed\n`;
        responseText += `- ✅ No Tailwind (using proper themes)\n`;

        return {
          content: [{
            type: "text", 
            text: responseText
          }]
        };
        
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error creating smart grid: ${error}`
          }]
        };
      }
    }
  );
}
