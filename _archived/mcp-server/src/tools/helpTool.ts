/**
 * Help Tool - Provides guidance when user asks for something we don't know how to do
 */

import {
  processSafeguards,
  formatSafeguardResponse,
  KNOWN_TOOLS,
} from "../utils/safeguards.js";

export interface HelpRequest {
  query?: string;
  context?: string;
}

export async function helpTool(args: HelpRequest): Promise<string> {
  const { query = "", context = "" } = args;

  // If no specific query, provide general help
  if (!query.trim()) {
    return formatGeneralHelp();
  }

  // Process the query through our safeguards system
  const safeguardResult = processSafeguards(query);

  if (safeguardResult.shouldProceed) {
    // High confidence match - guide them to the right tool
    return (
      `Based on your request "${query}", it sounds like you want to use one of these tools:\n\n` +
      formatToolSuggestions(query)
    );
  }

  // Use safeguard response for clarification or alternatives
  const safeguardResponse = formatSafeguardResponse(safeguardResult);

  if (safeguardResponse) {
    return safeguardResponse + "\n\n" + formatAvailableTools();
  }

  return formatGeneralHelp();
}

function formatGeneralHelp(): string {
  return `# Excalibrr MCP Server Help

I'm here to help you work with Excalibrr components and create demos. Here's what I can do:

## Available Tools

${KNOWN_TOOLS.map((tool) => `• **${tool.name}**: ${tool.description}`).join(
  "\n"
)}

## Common Patterns

• **Creating new demos**: "create a product grid" or "make a customer form"
• **Modifying existing demos**: "add a column to ProductGrid" or "make the price column editable"
• **Changing themes**: "switch ProductGrid to OSP theme"
• **Running demos**: "start the server for CustomerForm"
• **Cleaning up**: "remove the old ProductGrid demo"

## Getting Help

If you ask me to do something I don't know how to do, I'll:
1. Ask clarifying questions to see if it matches something I can do
2. Suggest alternatives that might accomplish your goal
3. Guide you to the documentation or existing patterns

Just describe what you want to accomplish, and I'll do my best to help!`;
}

function formatToolSuggestions(query: string): string {
  // This would contain logic to suggest the most relevant tools
  // For now, return available tools
  return formatAvailableTools();
}

function formatAvailableTools(): string {
  return `## Available Tools:\n\n${KNOWN_TOOLS.map(
    (tool) =>
      `• **${tool.name}**: ${
        tool.description
      }\n  Keywords: ${tool.keywords.join(", ")}`
  ).join("\n\n")}`;
}
