import axios from "axios";

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the mcp-server directory (silently for MCP compatibility)
// quiet: true suppresses the "[dotenv@x.x.x] injecting env" message that breaks MCP JSON protocol
dotenv.config({ path: path.join(__dirname, '..', '..', '.env'), debug: false, quiet: true });

interface FigmaImportParams {
  fileUrl?: string;
  fileId?: string;
  nodeId?: string;
  componentName?: string;
}

interface FigmaComponent {
  name: string;
  type: string;
  properties: any;
  children?: FigmaComponent[];
}

// Get Figma configuration from environment
function getFigmaConfig() {
  const accessToken = process.env.FIGMA_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error(
      "FIGMA_ACCESS_TOKEN not found. Please add it to your .env file."
    );
  }
  
  return {
    accessToken,
    defaultFileId: process.env.FIGMA_DEFAULT_FILE_ID,
    teamId: process.env.FIGMA_TEAM_ID,
  };
}

// Extract file ID from Figma URL
function extractFileId(url: string): string {
  // Handle full Figma URLs like:
  // https://www.figma.com/file/ABC123XYZ/Design-Name?node-id=0%3A1
  const match = url.match(/\/file\/([a-zA-Z0-9]+)\//);
  if (match) {
    return match[1];
  }
  // If it's not a URL, assume it's already a file ID
  return url;
}

// Extract node ID from Figma URL
function extractNodeId(url: string): string | null {
  // Extract node-id from URL parameters
  const match = url.match(/node-id=([^&]+)/);
  if (match) {
    return decodeURIComponent(match[1]);
  }
  return null;
}

// Convert Figma color to CSS
function figmaColorToCSS(color: any): string {
  if (!color) return "transparent";
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a || 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Convert Figma component to React/Excalibrr component
function convertToExcalibrComponent(node: any): string {
  const { name, type, absoluteBoundingBox, fills, strokes, effects } = node;
  
  let componentCode = "";
  
  // Map Figma types to Excalibrr components
  switch (type) {
    case "TEXT":
      componentCode = `<Texto>${node.characters || name}</Texto>`;
      break;
      
    case "RECTANGLE":
    case "FRAME":
      const isButton = name.toLowerCase().includes("button");
      const isCard = name.toLowerCase().includes("card");
      
      if (isButton) {
        componentCode = `<GraviButton>${name}</GraviButton>`;
      } else if (isCard) {
        componentCode = `<Card style={{ padding: "16px" }}>${name}</Card>`;
      } else {
        // Default to Vertical container
        componentCode = `<Vertical style={{ padding: "16px" }}>\n  {/* ${name} content */}\n</Vertical>`;
      }
      break;
      
    case "GROUP":
      componentCode = `<Horizontal style={{ gap: "8px" }}>\n  {/* ${name} group */}\n</Horizontal>`;
      break;
      
    default:
      componentCode = `{/* TODO: Convert ${type}: ${name} */}`;
  }
  
  return componentCode;
}

// Main function to import from Figma
export async function importFromFigma(params: FigmaImportParams): Promise<string> {
  const config = getFigmaConfig();
  
  // Determine file ID
  let fileId: string;
  if (params.fileUrl) {
    fileId = extractFileId(params.fileUrl);
    params.nodeId = params.nodeId || extractNodeId(params.fileUrl) || undefined;
  } else if (params.fileId) {
    fileId = params.fileId;
  } else if (config.defaultFileId) {
    fileId = config.defaultFileId;
  } else {
    throw new Error("No Figma file specified. Please provide a fileUrl or fileId.");
  }
  
  try {
    // Fetch file data from Figma API
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: {
          "X-Figma-Token": config.accessToken,
        },
      }
    );
    
    const fileData = fileResponse.data;
    
    // Get specific node if requested
    let targetNode = fileData.document;
    if (params.nodeId) {
      const nodeResponse = await axios.get(
        `https://api.figma.com/v1/files/${fileId}/nodes?ids=${params.nodeId}`,
        {
          headers: {
            "X-Figma-Token": config.accessToken,
          },
        }
      );
      
      if (nodeResponse.data.nodes[params.nodeId]) {
        targetNode = nodeResponse.data.nodes[params.nodeId].document;
      }
    }
    
    // Extract component information
    const componentInfo = extractComponentInfo(targetNode);
    
    // Generate React component code
    const componentCode = generateReactComponent(componentInfo);
    
    return `✅ Successfully imported from Figma!

📄 File: ${fileData.name}
🎨 Component: ${targetNode.name}
📐 Type: ${targetNode.type}

Generated React component:

\`\`\`tsx
${componentCode}
\`\`\`

You can now use this component in your demo!`;
    
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Invalid Figma access token. Please check your .figmaconfig.json file.");
    }
    if (error.response?.status === 404) {
      throw new Error(`Figma file not found: ${fileId}`);
    }
    throw new Error(`Failed to import from Figma: ${error.message}`);
  }
}

// Extract component information from Figma node
function extractComponentInfo(node: any): FigmaComponent {
  const component: FigmaComponent = {
    name: node.name,
    type: node.type,
    properties: {},
  };
  
  // Extract style properties
  if (node.fills && node.fills.length > 0) {
    component.properties.backgroundColor = figmaColorToCSS(node.fills[0].color);
  }
  
  if (node.strokes && node.strokes.length > 0) {
    component.properties.borderColor = figmaColorToCSS(node.strokes[0].color);
  }
  
  if (node.absoluteBoundingBox) {
    component.properties.width = node.absoluteBoundingBox.width;
    component.properties.height = node.absoluteBoundingBox.height;
  }
  
  // Process children
  if (node.children && node.children.length > 0) {
    component.children = node.children.map((child: any) => extractComponentInfo(child));
  }
  
  return component;
}

// Generate React component code from extracted info
function generateReactComponent(component: FigmaComponent): string {
  const imports = new Set([
    "React",
    "Vertical",
    "Horizontal",
    "Texto",
    "GraviButton",
  ]);
  
  let componentBody = generateComponentBody(component, 1);
  
  return `import React from 'react';
import { ${Array.from(imports).filter(i => i !== "React").join(", ")} } from '@gravitate-js/excalibrr';

export function ${component.name.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
${componentBody}
  );
}`;
}

// Generate component body recursively
function generateComponentBody(component: FigmaComponent, indent: number): string {
  const spacing = "  ".repeat(indent);
  let body = "";
  
  // Determine container type based on component type and name
  const containerType = component.type === "FRAME" ? "Vertical" : 
                       component.type === "GROUP" ? "Horizontal" : 
                       "div";
  
  // Build style object
  const styles: any = {};
  if (component.properties.backgroundColor) {
    styles.backgroundColor = component.properties.backgroundColor;
  }
  if (component.properties.width) {
    styles.width = component.properties.width;
  }
  if (component.properties.height) {
    styles.height = component.properties.height;
  }
  
  const styleString = Object.keys(styles).length > 0 
    ? ` style={${JSON.stringify(styles)}}` 
    : "";
  
  if (component.type === "TEXT") {
    body = `${spacing}<Texto>${component.name}</Texto>`;
  } else if (component.children && component.children.length > 0) {
    body = `${spacing}<${containerType}${styleString}>`;
    for (const child of component.children) {
      body += "\n" + generateComponentBody(child, indent + 1);
    }
    body += `\n${spacing}</${containerType}>`;
  } else {
    body = `${spacing}<${containerType}${styleString}>\n${spacing}  {/* ${component.name} */}\n${spacing}</${containerType}>`;
  }
  
  return body;
}

// Fetch and list available components in a Figma file
export async function listFigmaComponents(params: { fileUrl?: string; fileId?: string }): Promise<string> {
  const config = getFigmaConfig();
  
  // Determine file ID
  let fileId: string;
  if (params.fileUrl) {
    fileId = extractFileId(params.fileUrl);
  } else if (params.fileId) {
    fileId = params.fileId;
  } else if (config.defaultFileId) {
    fileId = config.defaultFileId;
  } else {
    throw new Error("No Figma file specified. Please provide a fileUrl or fileId.");
  }
  
  try {
    // Fetch components from Figma API
    const response = await axios.get(
      `https://api.figma.com/v1/files/${fileId}/components`,
      {
        headers: {
          "X-Figma-Token": config.accessToken,
        },
      }
    );
    
    const components = response.data.meta.components;
    
    if (!components || Object.keys(components).length === 0) {
      return "No components found in this Figma file. Make sure you have published components in your design system.";
    }
    
    let result = `📦 Found ${Object.keys(components).length} components in Figma file:\n\n`;
    
    for (const [key, component] of Object.entries(components)) {
      const comp = component as any;
      result += `• ${comp.name} (${key})\n`;
      if (comp.description) {
        result += `  📝 ${comp.description}\n`;
      }
    }
    
    result += "\n💡 Use importFromFigma with a component name to import a specific component.";
    
    return result;
    
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Invalid Figma access token. Please check your .figmaconfig.json file.");
    }
    if (error.response?.status === 404) {
      throw new Error(`Figma file not found: ${fileId}`);
    }
    throw new Error(`Failed to list Figma components: ${error.message}`);
  }
}