import { promises as fs } from "fs";
import path from "path";
import { DEMO_DEMOS } from "./paths.js";

/**
 * Shared utilities for MCP demo tools
 */

/**
 * Get the path to a demo file
 */
export function getDemoPath(demoName: string): string {
  return path.join(DEMO_DEMOS, `${demoName}.tsx`);
}

/**
 * Get the path to a demo data file
 */
export function getDemoDataPath(demoName: string): string {
  return path.join(DEMO_DEMOS, `${demoName}.data.ts`);
}

/**
 * Check if a demo exists and validate it's a grid demo
 */
export async function validateGridDemo(demoName: string): Promise<{ path: string; content: string }> {
  const demoPath = getDemoPath(demoName);
  
  // Check if demo exists
  try {
    await fs.access(demoPath);
  } catch {
    throw new DemoError(`Demo '${demoName}' not found at ${demoPath}. Create it first with create_demo.`);
  }

  // Read and validate content
  const content = await fs.readFile(demoPath, "utf-8");
  
  // Check if it's a GraviGrid component
  if (!content.includes('GraviGrid')) {
    throw new DemoError(`${demoName} is not a grid demo. This tool only works with grid demos.`);
  }

  return { path: demoPath, content };
}

/**
 * Safely add React hooks to imports if not already present
 */
export function addReactHook(content: string, hookName: string): string {
  // Already imported
  if (content.includes(hookName)) {
    return content;
  }

  // Add to existing React import with hooks
  if (content.includes('import React, { ')) {
    return content.replace(
      /import React, { ([^}]+) }/,
      `import React, { $1, ${hookName} }`
    );
  }
  
  // Add to basic React import
  if (content.includes("import React from 'react';")) {
    return content.replace(
      "import React from 'react';",
      `import React, { ${hookName} } from 'react';`
    );
  }

  // No React import found - this shouldn't happen in our demos
  throw new DemoError('No React import found in demo file');
}

/**
 * Find the return statement in a React component
 */
export function findReturnStatement(content: string): { match: string; index: number } {
  const returnMatch = content.match(/(  return \()/);
  if (!returnMatch) {
    throw new DemoError('Could not find return statement in component');
  }
  
  return {
    match: returnMatch[1],
    index: content.indexOf(returnMatch[1])
  };
}

/**
 * Find the component export line
 */
export function findComponentExport(content: string): { match: string; index: number } {
  const exportMatch = content.match(/(export function \w+\(\) \{)/);
  if (!exportMatch) {
    throw new DemoError('Could not find component export in demo file');
  }
  
  return {
    match: exportMatch[1],
    index: content.indexOf(exportMatch[1])
  };
}

/**
 * Check if NumberCellEditor import exists, add if needed
 */
export function ensureNumberCellEditorImport(content: string): string {
  if (!content.includes('NumberCellEditor')) {
    return content.replace(
      /import { GraviGrid } from '@gravitate-js\/excalibrr';/,
      `import { GraviGrid } from '@gravitate-js/excalibrr';\nimport { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor';`
    );
  }
  return content;
}

/**
 * Create standardized tool response
 */
export function createToolResponse(
  action: string, 
  demoName: string, 
  details: string = '',
  location?: string
) {
  return {
    content: [
      {
        type: "text",
        text: `✅ ${action}

🔄 Changes applied successfully
📁 Location: ${location || `./demo/src/pages/demos/${demoName}.tsx`}${details ? `\n\n${details}` : ''}

The demo will hot-reload automatically if the dev server is running.`,
      },
    ],
  };
}

/**
 * Custom error class for demo operations
 */
export class DemoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DemoError';
  }
}

/**
 * Handle tool errors consistently
 */
export function handleToolError(action: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    content: [
      {
        type: "text",
        text: `❌ ${action} failed: ${message}

Please check the demo exists and try again.`,
      },
    ],
    isError: true,
  };
}