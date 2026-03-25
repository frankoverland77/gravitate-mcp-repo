/**
 * Register Demo Tool
 * 
 * Automatically registers a new demo in the navigation system.
 * Handles:
 * 1. Adding import statement to pageConfig.tsx
 * 2. Adding demo to demoRegistry array
 * 3. Adding scope to AuthenticatedRoute.jsx
 * 
 * This should be called automatically after creating a new demo component.
 */

import * as fs from 'fs';
import * as path from 'path';

interface RegisterDemoArgs {
  name: string;              // Component name (e.g., "ScheduleDemo")
  title: string;             // Display title (e.g., "Schedule Management")
  description: string;       // Brief description
  category: 'grids' | 'forms' | 'dashboards';
  componentPath: string;     // Relative path from src (e.g., "./pages/demos/ScheduleDemo")
  routePath?: string;        // Custom route path (auto-generated if not provided)
  theme?: 'OSP' | 'PE_LIGHT' | 'BP';  // Optional theme wrapper
  demoPath?: string;         // Path to demo project (defaults to standard location)
}

// Standard paths
const DEFAULT_DEMO_PATH = '/Users/rebecca/repos/excalibrr-mcp-server/demo';
const PAGE_CONFIG_PATH = 'src/pageConfig.tsx';
const AUTH_ROUTE_PATH = 'src/_Main/AuthenticatedRoute.jsx';

/**
 * Generate route path from component name and category
 */
function generateRoutePath(name: string, category: string): string {
  const kebabName = name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `/demos/${category}/${kebabName}`;
}

/**
 * Add import statement to pageConfig.tsx
 */
function addImport(pageConfigContent: string, name: string, componentPath: string): string {
  // Find the last import line before ThemeRouteWrapper
  const importRegex = /import { ThemeRouteWrapper } from/;
  const match = pageConfigContent.match(importRegex);
  
  if (!match || match.index === undefined) {
    throw new Error('Could not find ThemeRouteWrapper import in pageConfig.tsx');
  }
  
  const newImport = `import { ${name} } from "${componentPath}";\n`;
  
  // Check if import already exists
  if (pageConfigContent.includes(`import { ${name} }`)) {
    return pageConfigContent; // Already imported
  }
  
  // Insert before ThemeRouteWrapper import
  return (
    pageConfigContent.slice(0, match.index) +
    newImport +
    pageConfigContent.slice(match.index)
  );
}

/**
 * Add demo to demoRegistry array in pageConfig.tsx
 */
function addToRegistry(
  pageConfigContent: string, 
  name: string, 
  title: string, 
  description: string, 
  category: string, 
  routePath: string,
  theme?: string
): string {
  // Find the marker comment
  const markerRegex = /\/\/ MCP server will add more demos here automatically/;
  const match = pageConfigContent.match(markerRegex);
  
  if (!match || match.index === undefined) {
    throw new Error('Could not find demo registry marker in pageConfig.tsx');
  }
  
  // Check if already registered
  if (pageConfigContent.includes(`key: "${name}"`)) {
    return pageConfigContent; // Already registered
  }
  
  // Build the element JSX
  let elementJsx = `<${name} />`;
  if (theme) {
    elementJsx = `<ThemeRouteWrapper theme="${theme}"><${name} /></ThemeRouteWrapper>`;
  }
  
  const newEntry = `{
    key: "${name}",
    title: "${title}",
    element: ${elementJsx},
    path: "${routePath}",
    description: "${description}",
    created: new Date().toISOString(),
    category: "${category}",
  },
  `;
  
  // Insert before the marker
  return (
    pageConfigContent.slice(0, match.index) +
    newEntry +
    pageConfigContent.slice(match.index)
  );
}

/**
 * Add scope to AuthenticatedRoute.jsx
 */
function addScope(authRouteContent: string, name: string): string {
  // Check if scope already exists
  if (authRouteContent.includes(`${name}: true`)) {
    return authRouteContent; // Already has scope
  }
  
  // Find the scopes object and parse it properly
  // Look for pattern: const scopes = { ... };
  const scopesStartRegex = /const scopes = \{/;
  const startMatch = authRouteContent.match(scopesStartRegex);
  
  if (!startMatch || startMatch.index === undefined) {
    throw new Error('Could not find scopes object in AuthenticatedRoute.jsx');
  }
  
  // Find the closing brace by counting braces from the start
  const startIndex = startMatch.index + startMatch[0].length;
  let braceCount = 1;
  let endIndex = startIndex;
  
  while (braceCount > 0 && endIndex < authRouteContent.length) {
    const char = authRouteContent[endIndex];
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
    endIndex++;
  }
  
  if (braceCount !== 0) {
    throw new Error('Could not find closing brace for scopes object');
  }
  
  // endIndex is now just after the closing brace
  // We want to insert before the closing brace
  const closingBraceIndex = endIndex - 1;
  
  // Find the last non-whitespace character before the closing brace
  let insertIndex = closingBraceIndex - 1;
  while (insertIndex > startIndex && /\s/.test(authRouteContent[insertIndex])) {
    insertIndex--;
  }
  insertIndex++; // Move past the last non-whitespace char
  
  // Check if we need to add a comma (if the last entry doesn't have one)
  const lastChar = authRouteContent[insertIndex - 1];
  const needsComma = lastChar !== ',';
  
  // Build the new scope line with proper formatting
  const newScope = `${needsComma ? ',' : ''}\n    ${name}: true,`;
  
  // Insert the new scope
  return (
    authRouteContent.slice(0, insertIndex) +
    newScope +
    '\n  ' + // Add proper indentation before closing brace
    authRouteContent.slice(closingBraceIndex)
  );
}

export async function registerDemoTool(args: RegisterDemoArgs) {
  try {
    const demoPath = args.demoPath || DEFAULT_DEMO_PATH;
    const pageConfigFullPath = path.join(demoPath, PAGE_CONFIG_PATH);
    const authRouteFullPath = path.join(demoPath, AUTH_ROUTE_PATH);
    
    // Generate route path if not provided
    const routePath = args.routePath || generateRoutePath(args.name, args.category);
    
    // Read current files
    let pageConfigContent = fs.readFileSync(pageConfigFullPath, 'utf-8');
    let authRouteContent = fs.readFileSync(authRouteFullPath, 'utf-8');
    
    // Track changes
    const changes: string[] = [];
    
    // 1. Add import
    const originalPageConfig = pageConfigContent;
    pageConfigContent = addImport(pageConfigContent, args.name, args.componentPath);
    if (pageConfigContent !== originalPageConfig) {
      changes.push(`Added import for ${args.name}`);
    }
    
    // 2. Add to registry
    const afterImport = pageConfigContent;
    pageConfigContent = addToRegistry(
      pageConfigContent,
      args.name,
      args.title,
      args.description,
      args.category,
      routePath,
      args.theme
    );
    if (pageConfigContent !== afterImport) {
      changes.push(`Added ${args.name} to demoRegistry`);
    }
    
    // 3. Add scope
    const originalAuthRoute = authRouteContent;
    authRouteContent = addScope(authRouteContent, args.name);
    if (authRouteContent !== originalAuthRoute) {
      changes.push(`Added ${args.name} scope to AuthenticatedRoute`);
    }
    
    // Write files if there were changes
    if (changes.length > 0) {
      fs.writeFileSync(pageConfigFullPath, pageConfigContent);
      fs.writeFileSync(authRouteFullPath, authRouteContent);
    }
    
    // Build response
    let response = `# Demo Registration: ${args.name}\n\n`;
    
    if (changes.length > 0) {
      response += `## ✅ Changes Made\n\n`;
      for (const change of changes) {
        response += `- ${change}\n`;
      }
      response += `\n`;
    } else {
      response += `## ℹ️ No Changes Needed\n\nDemo "${args.name}" was already registered.\n\n`;
    }
    
    response += `## Demo Details\n\n`;
    response += `| Property | Value |\n`;
    response += `|----------|-------|\n`;
    response += `| **Name** | ${args.name} |\n`;
    response += `| **Title** | ${args.title} |\n`;
    response += `| **Category** | ${args.category} |\n`;
    response += `| **Route** | ${routePath} |\n`;
    response += `| **Component** | ${args.componentPath} |\n`;
    if (args.theme) {
      response += `| **Theme** | ${args.theme} |\n`;
    }
    response += `\n`;
    
    response += `## Next Steps\n\n`;
    response += `1. Start/restart the dev server to see changes\n`;
    response += `2. Navigate to **Bakery** → **${args.title}** in the sidebar\n`;
    
    return {
      content: [{ type: "text" as const, text: response }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error registering demo: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

// Tool definition for MCP
export const registerDemoToolDefinition = {
  name: "register_demo",
  description: "Register a new demo in the navigation system. Automatically adds import, registry entry, and scope. Called after creating a demo component file.",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: {
        type: "string",
        description: "Component name (e.g., 'ScheduleDemo', 'ProductGrid')",
      },
      title: {
        type: "string",
        description: "Display title for navigation (e.g., 'Schedule Management')",
      },
      description: {
        type: "string",
        description: "Brief description of the demo",
      },
      category: {
        type: "string",
        enum: ["grids", "forms", "dashboards"],
        description: "Demo category - determines which nav section it appears in",
      },
      componentPath: {
        type: "string",
        description: "Import path relative to src (e.g., './pages/demos/ScheduleDemo')",
      },
      routePath: {
        type: "string",
        description: "Custom route path (auto-generated from name if not provided)",
      },
      theme: {
        type: "string",
        enum: ["OSP", "PE_LIGHT", "BP"],
        description: "Optional theme wrapper",
      },
      demoPath: {
        type: "string",
        description: "Path to demo project (defaults to standard location)",
      },
    },
    required: ["name", "title", "description", "category", "componentPath"],
  },
};
