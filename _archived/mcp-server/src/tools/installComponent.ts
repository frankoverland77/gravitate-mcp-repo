/**
 * Install Component Tool
 * Install an Excalibrr component into a user's project
 */

import { getComponent } from "../registry/index.js";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface InstallComponentArgs {
  componentId: string;
  projectPath?: string;
  installDependencies?: boolean;
  customName?: string;
}

export async function installComponentTool(args: InstallComponentArgs) {
  try {
    // Get component metadata
    const component = getComponent(args.componentId);

    if (!component) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Component "${args.componentId}" not found.\n\nUse \`list_components\` or \`search_components\` to find available components.`,
          },
        ],
        isError: true,
      };
    }

    // Determine project path (default to current demo workspace)
    const projectPath =
      args.projectPath || path.join(process.cwd(), "..", "..", "demo");

    // Verify project exists
    try {
      await fs.access(projectPath);
    } catch {
      return {
        content: [
          {
            type: "text" as const,
            text: `Project path "${projectPath}" does not exist.\n\nPlease provide a valid project path.`,
          },
        ],
        isError: true,
      };
    }

    let response = `# Installing ${component.name}\n\n`;
    const componentName = args.customName || component.name;

    // Check if component is from Excalibrr (no installation needed, just examples)
    if (component.source === "@gravitate-js/excalibrr") {
      response += `✅ **Component Source:** ${component.source}\n\n`;
      response += `This component is part of the Excalibrr library, which is already installed in your project.\n\n`;

      // Provide usage information
      response += `## Usage\n\n`;
      response += `Import the component in your code:\n\n`;
      response += "```tsx\n";
      response += `import { ${component.name} } from '@gravitate-js/excalibrr';\n`;
      response += "```\n\n";

      // Show first example if available
      if (component.examples && component.examples.length > 0) {
        const firstExample = component.examples[0];
        response += `## Example: ${firstExample.name}\n\n`;
        response += `${firstExample.description}\n\n`;
        response += "```tsx\n";
        response += firstExample.code;
        response += "\n```\n\n";

        if (component.examples.length > 1) {
          response += `📚 **${component.examples.length - 1} more example${component.examples.length > 2 ? "s" : ""} available**\n`;
          response += `Use \`get_component --componentId "${component.id}"\` to see all examples.\n\n`;
        }
      }

      // Show props if available
      if (component.props && component.props.length > 0) {
        response += `## Key Props\n\n`;
        const keyProps = component.props.filter((p) => p.required).slice(0, 5);
        for (const prop of keyProps) {
          response += `- **${prop.name}** (\`${prop.type}\`)${prop.required ? " *required*" : ""}: ${prop.description || ""}\n`;
        }
        response += `\n`;
        if (component.props.length > keyProps.length) {
          response += `*${component.props.length - keyProps.length} more props available*\n\n`;
        }
      }

      // Installation check for dependencies
      if (args.installDependencies) {
        response += `## Dependencies\n\n`;
        response += `Checking dependencies...\n\n`;

        try {
          const packageJsonPath = path.join(projectPath, "package.json");
          const packageJson = JSON.parse(
            await fs.readFile(packageJsonPath, "utf-8")
          );
          const allDeps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
          };

          const missingDeps = component.dependencies.filter(
            (dep) => !allDeps[dep]
          );

          if (missingDeps.length > 0) {
            response += `⚠️  Missing dependencies:\n`;
            for (const dep of missingDeps) {
              response += `  - ${dep}\n`;
            }
            response += `\nInstall with:\n`;
            response += "```bash\n";
            response += `npm install ${missingDeps.join(" ")}\n`;
            response += "```\n\n";
          } else {
            response += `✅ All dependencies are installed\n\n`;
          }
        } catch (error) {
          response += `Could not check dependencies: ${error instanceof Error ? error.message : String(error)}\n\n`;
        }
      }

      if (component.notes) {
        response += `## Important Notes\n\n`;
        response += `${component.notes}\n\n`;
      }

      response += `---\n\n`;
      response += `**Next Steps:**\n`;
      response += `1. Import the component in your file\n`;
      response += `2. Use the examples above as a starting point\n`;
      response += `3. Customize props and styling for your needs\n`;
      response += `4. Check the full component docs with \`get_component --componentId "${component.id}"\`\n`;

      return {
        content: [{ type: "text" as const, text: response }],
      };
    }

    // For custom components (not from Excalibrr), would copy files here
    // This is a placeholder for future expansion
    response += `Custom component installation not yet implemented.\n`;
    response += `This feature is planned for components not in the Excalibrr library.\n`;

    return {
      content: [{ type: "text" as const, text: response }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error installing component: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}