/**
 * Search Components Tool
 * Search for components by name, description, or tags
 */

import { searchComponents, SearchOptions } from "../registry/index.js";

interface SearchComponentsArgs {
  query: string;
  category?: string;
  complexity?: "simple" | "medium" | "complex";
  tags?: string[];
  limit?: number;
}

export async function searchComponentsTool(args: SearchComponentsArgs) {
  try {
    const options: SearchOptions = {
      query: args.query,
      category: args.category,
      complexity: args.complexity,
      tags: args.tags,
      limit: args.limit || 10,
    };

    const results = searchComponents(options);

    let response = `# Search Results: "${args.query}"\n\n`;
    response += `Found ${results.length} matching component${results.length !== 1 ? "s" : ""}\n\n`;

    if (results.length === 0) {
      response += `No components found matching your search.\n\n`;
      response += `**Tips:**\n`;
      response += `- Try different keywords\n`;
      response += `- Use \`list_components\` to browse all available components\n`;
      response += `- Check available categories and tags\n`;
      return {
        content: [{ type: "text" as const, text: response }],
      };
    }

    // Display results
    for (const comp of results) {
      response += `## ${comp.name} (${comp.id})\n`;
      response += `${comp.description}\n\n`;
      response += `- **Category:** ${comp.category}\n`;
      response += `- **Complexity:** ${comp.complexity}\n`;
      response += `- **Tags:** ${comp.tags.join(", ")}\n`;
      response += `- **Source:** ${comp.source}\n`;

      // Highlight matching tags
      const matchingTags = comp.tags.filter((tag) =>
        tag.toLowerCase().includes(args.query.toLowerCase())
      );
      if (matchingTags.length > 0) {
        response += `- **Matching Tags:** ${matchingTags.join(", ")}\n`;
      }

      if (comp.examples && comp.examples.length > 0) {
        response += `- **Examples:** ${comp.examples.length} available\n`;
      }

      response += "\n";
    }

    response += "---\n\n";
    response += `**Next Steps:**\n`;
    response += `- Use \`get_component\` with a component ID to see full details\n`;
    response += `- Use \`install_component\` to add a component to your project\n`;

    return {
      content: [{ type: "text" as const, text: response }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error searching components: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}