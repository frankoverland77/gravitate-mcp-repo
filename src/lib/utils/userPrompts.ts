// User prompt utilities for getting input during MCP tool execution
// src/lib/utils/userPrompts.ts

import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export interface DirectoryPromptResult {
  outputDirectory: string;
  confirmed: boolean;
}

/**
 * Creates a user-friendly prompt for directory selection
 */
export function createDirectoryPrompt(
  operation: string,
  suggestedPath?: string
): string {
  const homePath = process.env.HOME || process.env.USERPROFILE || "~";
  const workspacePath = "/Users/rebecca.hirai/workspace";
  
  return `📁 **Choose Output Directory for ${operation}**

Where would you like to create the files?

**Suggested Options:**
1. **Workspace** (Recommended): \`${workspacePath}\`
2. **Home Directory**: \`${homePath}\`
3. **Current Project**: \`/Users/rebecca.hirai/repos\`
4. **Desktop**: \`${homePath}/Desktop\`
5. **Custom Path**: Specify any absolute path

${suggestedPath ? `**Suggested:** \`${suggestedPath}\`` : ""}

**Please provide the full path where you'd like the files created.**

*Example: /Users/rebecca.hirai/workspace/my-project*`;
}

/**
 * Validates a directory path
 */
export function validateDirectoryPath(dirPath: string): {
  isValid: boolean;
  error?: string;
  normalizedPath: string;
} {
  if (!dirPath || dirPath.trim() === "") {
    return {
      isValid: false,
      error: "Directory path cannot be empty",
      normalizedPath: "",
    };
  }

  // Normalize path
  let normalizedPath = dirPath.trim();
  
  // Handle ~ for home directory
  if (normalizedPath.startsWith("~/")) {
    const home = process.env.HOME || process.env.USERPROFILE;
    if (!home) {
      return {
        isValid: false,
        error: "Cannot resolve home directory",
        normalizedPath: "",
      };
    }
    normalizedPath = normalizedPath.replace("~", home);
  }

  // Must be absolute path
  if (!normalizedPath.startsWith("/")) {
    return {
      isValid: false,
      error: "Please provide an absolute path (starting with /)",
      normalizedPath: "",
    };
  }

  return {
    isValid: true,
    normalizedPath,
  };
}

/**
 * Creates an error for missing directory input
 */
export function createDirectoryInputError(operation: string): McpError {
  return new McpError(
    ErrorCode.InvalidParams,
    `Directory path required for ${operation}. Please specify where to create the files using the 'outputDirectory' parameter.`
  );
}

/**
 * Creates a success message with file locations
 */
export function createFileLocationMessage(
  outputDirectory: string,
  filesCreated: string[],
  operation: string
): string {
  return `✅ **${operation} Complete!**

**Files created in:** \`${outputDirectory}\`

**Files generated:**
${filesCreated.map((file) => `• ${file}`).join("\n")}

**Next Steps:**
1. Navigate to the directory: \`cd ${outputDirectory}\`
2. Open in your code editor
3. Follow any setup instructions in the generated README

📁 **Easy Access:** All files are saved in a single location for easy management.`;
}

/**
 * Suggests a default directory based on operation type
 */
export function suggestDirectory(
  operation: string,
  projectName?: string
): string {
  const workspace = "/Users/rebecca.hirai/workspace";
  
  switch (operation.toLowerCase()) {
    case "react project":
    case "grid component":
    case "full project":
      return projectName 
        ? `${workspace}/projects/${projectName}`
        : `${workspace}/projects`;
        
    case "production code":
    case "feature generation":
      return "/Users/rebecca.hirai/repos";
      
    case "design iteration":
    case "component gallery":
    case "visual preview":
      return `${workspace}/designs`;
      
    case "figma integration":
      return `${workspace}/figma-exports`;
      
    default:
      return workspace;
  }
}

/**
 * Creates a confirmation prompt for directory creation
 */
export function createDirectoryConfirmation(
  outputDirectory: string,
  operation: string,
  filesCount: number
): string {
  return `📋 **Confirm ${operation}**

**Output Directory:** \`${outputDirectory}\`
**Files to Create:** ${filesCount} files

The directory will be created if it doesn't exist.

**Proceed?** (Respond with "yes" or "no")`;
}
