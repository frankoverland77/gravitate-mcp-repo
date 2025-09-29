/**
 * Get Component Tool
 * Retrieve full details, props, and examples for a specific component
 */

import { getComponent } from "../registry/index.js";

interface GetComponentArgs {
  componentId: string;
}

export async function getComponentTool(args: GetComponentArgs) {
  try {
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

    let response = `# ${component.name}\n\n`;
    response += `${component.description}\n\n`;

    // Metadata
    response += `## Metadata\n\n`;
    response += `- **ID:** ${component.id}\n`;
    response += `- **Category:** ${component.category}\n`;
    response += `- **Complexity:** ${component.complexity}\n`;
    response += `- **Source:** ${component.source}\n`;
    if (component.version) response += `- **Version:** ${component.version}\n`;
    response += `- **Tags:** ${component.tags.join(", ")}\n`;
    response += "\n";

    // Dependencies
    if (component.dependencies.length > 0) {
      response += `## Dependencies\n\n`;
      response += "```json\n";
      response += JSON.stringify(component.dependencies, null, 2);
      response += "\n```\n\n";
    }

    // Props
    if (component.props && component.props.length > 0) {
      response += `## Props\n\n`;
      response += "| Prop | Type | Required | Default | Description |\n";
      response += "|------|------|----------|---------|-------------|\n";

      for (const prop of component.props) {
        const required = prop.required ? "✅" : "❌";
        const defaultVal = prop.defaultValue || "-";
        const desc = prop.description || "";
        response += `| \`${prop.name}\` | \`${prop.type}\` | ${required} | \`${defaultVal}\` | ${desc} |\n`;
      }

      response += "\n";
    }

    // Examples
    if (component.examples && component.examples.length > 0) {
      response += `## Examples\n\n`;
      response += `${component.examples.length} example${component.examples.length !== 1 ? "s" : ""} available:\n\n`;

      for (let i = 0; i < component.examples.length; i++) {
        const example = component.examples[i];
        response += `### ${i + 1}. ${example.name}\n\n`;
        response += `${example.description}\n\n`;

        if (example.tags && example.tags.length > 0) {
          response += `**Tags:** ${example.tags.join(", ")}\n\n`;
        }

        response += "```tsx\n";
        response += example.code;
        response += "\n```\n\n";
      }
    }

    // Notes
    if (component.notes) {
      response += `## Notes\n\n`;
      response += `${component.notes}\n\n`;
    }

    // Installation
    response += `---\n\n`;
    response += `## Installation\n\n`;
    response += `To install this component in your project:\n\n`;
    response += "```bash\n";
    response += `# Using the MCP tool\n`;
    response += `install_component --componentId "${component.id}" --projectPath "/path/to/project"\n\n`;
    response += `# Or install manually\n`;
    response += `npm install ${component.dependencies.join(" ")}\n`;
    response += "```\n";

    return {
      content: [{ type: "text" as const, text: response }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error getting component: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}