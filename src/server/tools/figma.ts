// Figma integration tools for MCP server
// src/server/tools/figma.ts

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FigmaClient } from "../../lib/figma/client.js";
import { TokenExtractor } from "../../lib/figma/tokenExtractor.js";
import * as fs from "fs/promises";
import * as path from "path";

export function registerFigmaTools(server: McpServer): void {
  // Get Figma API token from environment
  const getFigmaToken = (): string => {
    const token = process.env.FIGMA_API_TOKEN;
    if (!token) {
      throw new Error("FIGMA_API_TOKEN environment variable is required");
    }
    return token;
  };

  /**
   * Tool: Extract design tokens from Figma file
   */
  server.tool(
    "figma_extract_design_tokens",
    "Extract design tokens (colors, typography, spacing, effects) from a Figma file",
    {
      figmaUrl: z.string().describe("Figma file URL or file key"),
      outputPath: z.string().optional().describe("Optional path to save tokens as JSON file"),
      tokenTypes: z.array(z.enum(["colors", "typography", "spacing", "effects"])).optional()
        .describe("Specific token types to extract (default: all)")
    },
    async ({ figmaUrl, outputPath, tokenTypes = ["colors", "typography", "spacing", "effects"] }) => {
      try {
        const client = new FigmaClient(getFigmaToken());
        
        // Extract file key from URL
        const fileKey = FigmaClient.extractFileKey(figmaUrl) || figmaUrl;
        if (!fileKey) {
          throw new Error("Invalid Figma URL or file key");
        }

        // Get Figma file data
        const figmaFile = await client.getFile(fileKey);
        
        // Extract tokens
        const extractor = new TokenExtractor();
        const allTokens = extractor.extractTokens(figmaFile);
        
        // Filter tokens based on requested types
        const filteredTokens: any = {};
        tokenTypes.forEach(type => {
          filteredTokens[type] = allTokens[type];
        });

        // Save to file if requested
        if (outputPath) {
          const fullPath = path.resolve(outputPath);
          await fs.writeFile(fullPath, JSON.stringify(filteredTokens, null, 2));
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                fileName: figmaFile.name,
                fileKey,
                tokens: filteredTokens,
                summary: {
                  colors: filteredTokens.colors?.length || 0,
                  typography: filteredTokens.typography?.length || 0,
                  spacing: filteredTokens.spacing?.length || 0,
                  effects: filteredTokens.effects?.length || 0
                },
                outputPath: outputPath || null
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  /**
   * Tool: Generate Excalibrr theme from Figma tokens
   */
  server.tool(
    "figma_generate_excalibrr_theme",
    "Generate Excalibrr theme file from Figma design tokens",
    {
      figmaUrl: z.string().describe("Figma file URL or file key"),
      themeName: z.string().default("FigmaTheme").describe("Name for the generated theme"),
      outputPath: z.string().optional().describe("Path to save the theme file")
    },
    async ({ figmaUrl, themeName, outputPath }) => {
      try {
        const client = new FigmaClient(getFigmaToken());
        const fileKey = FigmaClient.extractFileKey(figmaUrl) || figmaUrl;
        
        const figmaFile = await client.getFile(fileKey);
        const extractor = new TokenExtractor();
        const tokens = extractor.extractTokens(figmaFile);

        // Generate Excalibrr theme object
        const theme = {
          name: themeName,
          colors: {},
          typography: {},
          spacing: {},
          effects: {}
        };

        // Convert color tokens
        tokens.colors.forEach((color, index) => {
          (theme.colors as any)[`color${index + 1}`] = color.hex;
          (theme.colors as any)[color.name] = color.hex;
        });

        // Convert typography tokens
        tokens.typography.forEach((typo, index) => {
          (theme.typography as any)[`heading${index + 1}`] = {
            fontFamily: typo.fontFamily,
            fontSize: `${typo.fontSize}px`,
            fontWeight: typo.fontWeight,
            lineHeight: `${typo.lineHeight}px`,
            letterSpacing: `${typo.letterSpacing}px`
          };
        });

        // Convert spacing tokens
        tokens.spacing.forEach((space, index) => {
          (theme.spacing as any)[`space${index + 1}`] = `${space.value}px`;
          (theme.spacing as any)[space.name] = `${space.value}px`;
        });

        // Convert effect tokens
        tokens.effects.forEach((effect, index) => {
          (theme.effects as any)[effect.name] = effect.css;
        });

        // Generate TypeScript theme file content
        const themeFileContent = `// Generated Excalibrr theme from Figma
// Source: ${figmaFile.name}
// Generated: ${new Date().toISOString()}

export const ${themeName} = ${JSON.stringify(theme, null, 2)};

export default ${themeName};
`;

        // Save to file if requested
        if (outputPath) {
          const fullPath = path.resolve(outputPath);
          await fs.writeFile(fullPath, themeFileContent);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                themeName,
                figmaFileName: figmaFile.name,
                theme,
                themeFileContent,
                outputPath: outputPath || null,
                tokensSummary: {
                  colors: tokens.colors.length,
                  typography: tokens.typography.length,
                  spacing: tokens.spacing.length,
                  effects: tokens.effects.length
                }
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  /**
   * Tool: Analyze Figma component and suggest Excalibrr mapping
   */
  server.tool(
    "figma_analyze_component",
    "Analyze a Figma component and suggest Excalibrr component mapping",
    {
      figmaUrl: z.string().describe("Figma URL with node-id parameter"),
      componentName: z.string().optional().describe("Optional name for the component")
    },
    async ({ figmaUrl, componentName }) => {
      try {
        const client = new FigmaClient(getFigmaToken());
        
        const fileKey = FigmaClient.extractFileKey(figmaUrl);
        const nodeId = FigmaClient.extractNodeId(figmaUrl);
        
        if (!fileKey || !nodeId) {
          throw new Error("Invalid Figma URL. Must include file key and node-id parameter");
        }

        // Get the specific node
        const { nodes } = await client.getNodes(fileKey, [nodeId]);
        const node = nodes[nodeId];
        
        if (!node) {
          throw new Error("Node not found");
        }

        // Analyze component and suggest Excalibrr mapping
        const analysis = analyzeNodeForExcalibrr(node);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                figmaComponent: {
                  id: nodeId,
                  name: componentName || node.name,
                  type: node.type
                },
                suggestedMapping: analysis,
                excalibrCode: generateExcalibrCodeFromAnalysis(analysis, componentName || node.name)
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  /**
   * Tool: Get Figma file structure
   */
  server.tool(
    "figma_get_file_structure",
    "Get the structure and components of a Figma file",
    {
      figmaUrl: z.string().describe("Figma file URL or file key"),
      depth: z.number().default(3).describe("Maximum depth to traverse (default: 3)")
    },
    async ({ figmaUrl, depth }) => {
      try {
        const client = new FigmaClient(getFigmaToken());
        const fileKey = FigmaClient.extractFileKey(figmaUrl) || figmaUrl;
        
        const figmaFile = await client.getFile(fileKey);
        
        // Build file structure
        const structure = buildFileStructure(figmaFile.document, depth);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                fileName: figmaFile.name,
                fileKey,
                structure,
                components: Object.keys(figmaFile.components).length,
                styles: Object.keys(figmaFile.styles).length
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  /**
   * Tool: Test Figma API connection
   */
  server.tool(
    "figma_test_connection",
    "Test Figma API connection and token validity",
    {},
    async () => {
      try {
        const client = new FigmaClient(getFigmaToken());
        const isValid = await client.validateToken();
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: isValid,
                message: isValid ? "Figma API connection successful" : "Invalid Figma API token",
                token: isValid ? "Valid" : "Invalid"
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}

// Helper functions
function analyzeNodeForExcalibrr(node: any): any {
  const analysis = {
    suggestedComponent: "unknown",
    confidence: 0,
    props: {},
    notes: [] as string[]
  };

  // Analyze based on node type and properties
  switch (node.type) {
    case "RECTANGLE":
    case "FRAME":
      if (node.children && node.children.length > 0) {
        // Check if it's a layout container
        analysis.suggestedComponent = "Horizontal or Vertical";
        analysis.confidence = 0.7;
        analysis.props = {
          gap: "analyze spacing between children",
          alignment: "analyze alignment properties"
        };
      } else {
        analysis.suggestedComponent = "Box or Card";
        analysis.confidence = 0.6;
      }
      break;
    
    case "TEXT":
      analysis.suggestedComponent = "Typography";
      analysis.confidence = 0.9;
      analysis.props = {
        variant: "based on font size and weight",
        color: "extract from fills"
      };
      break;
    
    case "COMPONENT":
    case "COMPONENT_SET":
      analysis.suggestedComponent = "Custom Component";
      analysis.confidence = 0.8;
      analysis.notes.push("This is a Figma component - consider creating matching Excalibrr component");
      break;
  }

  // Add general notes
  if (node.fills && node.fills.length > 0) {
    analysis.notes.push("Has fill colors - extract for theme");
  }
  
  if (node.effects && node.effects.length > 0) {
    analysis.notes.push("Has effects (shadows/blur) - extract for theme");
  }

  return analysis;
}

function generateExcalibrCodeFromAnalysis(analysis: any, componentName: string): string {
  const cleanName = componentName.replace(/[^a-zA-Z0-9]/g, '');
  
  switch (analysis.suggestedComponent) {
    case "Horizontal or Vertical":
      return `<Horizontal gap={16}>
  {/* Add child components here */}
</Horizontal>`;
    
    case "Typography":
      return `<Typography variant="body1">
  ${componentName}
</Typography>`;
    
    default:
      return `// Custom component for: ${componentName}
// Suggested Excalibrr component: ${analysis.suggestedComponent}
// Consider using: <${analysis.suggestedComponent} />`;
  }
}

function buildFileStructure(node: any, maxDepth: number, currentDepth = 0): any {
  if (currentDepth >= maxDepth) {
    return {
      id: node.id,
      name: node.name,
      type: node.type,
      hasChildren: !!(node.children && node.children.length > 0)
    };
  }

  const structure: any = {
    id: node.id,
    name: node.name,
    type: node.type
  };

  if (node.children && node.children.length > 0) {
    structure.children = node.children.map((child: any) => 
      buildFileStructure(child, maxDepth, currentDepth + 1)
    );
  }

  return structure;
}
