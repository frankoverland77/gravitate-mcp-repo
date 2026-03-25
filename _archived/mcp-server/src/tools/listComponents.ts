/**
 * List Components Tool
 * Browse all available Excalibrr components
 */

import {
  listComponents,
  getCategories,
  getTags,
  SearchOptions,
} from "../registry/index.js";

interface ListComponentsArgs {
  category?: string;
  complexity?: "simple" | "medium" | "complex";
  tags?: string[];
  limit?: number;
}

export async function listComponentsTool(args: ListComponentsArgs) {
  try {
    const options: SearchOptions = {
      category: args.category,
      complexity: args.complexity,
      tags: args.tags,
      limit: args.limit,
    };

    const components = listComponents(options);

    // Format the response
    let response = `# Excalibrr Component Registry\n\n`;
    response += `Found ${components.length} component${components.length !== 1 ? "s" : ""}`;

    if (args.category) response += ` in category "${args.category}"`;
    if (args.complexity) response += ` with complexity "${args.complexity}"`;
    if (args.tags && args.tags.length > 0)
      response += ` tagged: ${args.tags.join(", ")}`;

    response += "\n\n";

    // Group by category
    const byCategory = components.reduce(
      (acc, comp) => {
        if (!acc[comp.category]) acc[comp.category] = [];
        acc[comp.category].push(comp);
        return acc;
      },
      {} as Record<string, typeof components>
    );

    // List components by category
    for (const [category, comps] of Object.entries(byCategory)) {
      response += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;

      for (const comp of comps) {
        response += `### ${comp.name} (${comp.id})\n`;
        response += `${comp.description}\n\n`;
        response += `- **Complexity:** ${comp.complexity}\n`;
        response += `- **Tags:** ${comp.tags.join(", ")}\n`;
        response += `- **Source:** ${comp.source}\n`;

        if (comp.examples && comp.examples.length > 0) {
          response += `- **Examples:** ${comp.examples.length} available\n`;
        }

        response += "\n";
      }
    }

    // Add helpful info
    response += "\n---\n\n";
    response += `**Available Categories:** ${getCategories().join(", ")}\n\n`;
    response += `**Available Tags:** ${getTags().join(", ")}\n\n`;
    response += `**Next Steps:**\n`;
    response += `- Use \`search_components\` to find specific components\n`;
    response += `- Use \`get_component\` to see full details and examples\n`;
    response += `- Use \`install_component\` to add a component to your project\n`;

    return {
      content: [{ type: "text" as const, text: response }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error listing components: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}