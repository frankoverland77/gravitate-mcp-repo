/**
 * Safeguards System for user's MCP Server
 *
 * This module provides safeguards to help user when he steps outside
 * the planned usage patterns, ensuring graceful handling of unknown requests
 * and providing helpful guidance.
 */

export interface KnownTool {
  name: string;
  description: string;
  keywords: string[];
  patterns: string[];
}

export interface ClarificationQuestion {
  question: string;
  suggestedTools: string[];
  context: string;
}

export interface FallbackSuggestion {
  message: string;
  alternatives: string[];
  documentation?: string;
}

/**
 * Known tools and their capabilities
 */
export const KNOWN_TOOLS: KnownTool[] = [
  {
    name: "create_demo",
    description:
      "Create lightweight demo shells with real Excalibrr components",
    keywords: [
      "create",
      "new",
      "demo",
      "grid",
      "form",
      "dashboard",
      "component",
      "shell",
    ],
    patterns: [
      "create a grid",
      "make a form",
      "new dashboard",
      "build a demo",
      "generate component",
    ],
  },
  {
    name: "modify_grid",
    description: "Modify existing grid demos (columns, renderers, editability)",
    keywords: [
      "modify",
      "change",
      "edit",
      "grid",
      "column",
      "add",
      "update",
      "renderer",
    ],
    patterns: [
      "add column",
      "change grid",
      "modify table",
      "edit column",
      "make editable",
      "update renderer",
    ],
  },
  {
    name: "change_theme",
    description: "Switch themes (OSP, PE, BP) for existing demos",
    keywords: [
      "theme",
      "change",
      "switch",
      "OSP",
      "PE",
      "BP",
      "style",
      "appearance",
    ],
    patterns: [
      "change theme",
      "switch to OSP",
      "apply BP theme",
      "update styling",
      "change appearance",
    ],
  },
  {
    name: "run_dev_server",
    description: "Start/stop development servers for demos",
    keywords: [
      "run",
      "start",
      "stop",
      "server",
      "dev",
      "development",
      "serve",
      "preview",
    ],
    patterns: [
      "start server",
      "run demo",
      "serve application",
      "preview changes",
      "launch development",
    ],
  },
  {
    name: "create_form_demo",
    description: "Create form demos with Excalibrr form components",
    keywords: ["form", "create", "input", "field", "validation", "submit"],
    patterns: [
      "create form",
      "build form",
      "make input form",
      "generate form demo",
    ],
  },
  {
    name: "cleanup_demo",
    description: "Remove demos and clean up all references",
    keywords: ["remove", "delete", "cleanup", "clean", "clear", "uninstall"],
    patterns: [
      "remove demo",
      "delete project",
      "clean up",
      "clear demo",
      "uninstall demo",
    ],
  },
  {
    name: "import_from_figma",
    description: "Import components/designs from Figma",
    keywords: ["figma", "import", "design", "component", "convert"],
    patterns: [
      "import from figma",
      "convert figma design",
      "bring in figma component",
    ],
  },
  {
    name: "list_figma_components",
    description: "List available components in Figma files",
    keywords: ["list", "figma", "components", "show", "available"],
    patterns: [
      "list figma components",
      "show figma designs",
      "what's in figma",
    ],
  },
  {
    name: "validate_code",
    description: "Check code against Excalibrr conventions and return violations",
    keywords: ["validate", "check", "lint", "review", "conventions", "rules", "violations", "errors"],
    patterns: [
      "validate code",
      "check my code",
      "review component",
      "find violations",
      "check conventions",
      "lint this",
    ],
  },
  {
    name: "get_conventions",
    description: "Get Excalibrr coding conventions and rules with examples",
    keywords: ["conventions", "rules", "guidelines", "standards", "patterns", "best practices"],
    patterns: [
      "get conventions",
      "show rules",
      "what are the conventions",
      "coding standards",
      "best practices",
      "how should I",
    ],
  },
];

/**
 * Analyze user request to find potential tool matches
 */
export function analyzeUserRequest(userInput: string): {
  exactMatches: KnownTool[];
  partialMatches: KnownTool[];
  confidence: number;
} {
  const input = userInput.toLowerCase();
  const exactMatches: KnownTool[] = [];
  const partialMatches: KnownTool[] = [];

  for (const tool of KNOWN_TOOLS) {
    let exactMatch = false;
    let partialMatch = false;

    // Check exact pattern matches
    for (const pattern of tool.patterns) {
      if (input.includes(pattern.toLowerCase())) {
        exactMatch = true;
        break;
      }
    }

    // Check keyword matches
    let keywordMatches = 0;
    for (const keyword of tool.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        keywordMatches++;
        if (keywordMatches >= 2) {
          partialMatch = true;
        }
      }
    }

    if (exactMatch) {
      exactMatches.push(tool);
    } else if (partialMatch) {
      partialMatches.push(tool);
    }
  }

  const confidence =
    exactMatches.length > 0 ? 0.9 : partialMatches.length > 0 ? 0.6 : 0.1;

  return { exactMatches, partialMatches, confidence };
}

/**
 * Generate clarification questions for ambiguous requests
 */
export function generateClarificationQuestions(
  userInput: string
): ClarificationQuestion[] {
  const analysis = analyzeUserRequest(userInput);
  const questions: ClarificationQuestion[] = [];

  // If we have partial matches, ask for clarification
  if (
    analysis.partialMatches.length > 0 &&
    analysis.exactMatches.length === 0
  ) {
    questions.push({
      question: `I found a few things I might be able to help with. Are you trying to:`,
      suggestedTools: analysis.partialMatches.map(
        (tool) => `${tool.name}: ${tool.description}`
      ),
      context: "partial_match",
    });
  }

  // If no matches at all, ask what they're trying to accomplish
  if (analysis.confidence < 0.3) {
    questions.push({
      question:
        "I'm not sure how to help with that specific request. Could you tell me more about what you're trying to accomplish?",
      suggestedTools: [
        "Are you trying to create something new?",
        "Do you want to modify an existing demo?",
        "Are you looking to change themes or styling?",
        "Do you need to start or stop a development server?",
      ],
      context: "no_match",
    });
  }

  return questions;
}

/**
 * Generate fallback suggestions when we can't help
 */
export function generateFallbackSuggestions(
  userInput: string
): FallbackSuggestion {
  const analysis = analyzeUserRequest(userInput);

  if (analysis.confidence < 0.3) {
    return {
      message:
        "I don't know how to do that specific thing yet, but here are some alternatives:",
      alternatives: [
        "Check if this matches any of the available tools: create_demo, modify_grid, change_theme, run_dev_server, create_form_demo, cleanup_demo, import_from_figma, list_figma_components",
        "Break down your request into smaller parts - I might be able to help with pieces of it",
        "Try describing what you want to accomplish in different terms",
        "Look for existing patterns in the demo directory that might be similar to what you want",
      ],
      documentation:
        "For a full list of capabilities, you can ask me to 'list tools' or check the MCP server documentation",
    };
  }

  return {
    message: "I might be able to help with a similar approach:",
    alternatives: analysis.partialMatches.map(
      (tool) => `Try using ${tool.name}: ${tool.description}`
    ),
  };
}

/**
 * Main safeguard function - call this before processing any user request
 */
export function processSafeguards(userInput: string): {
  shouldProceed: boolean;
  clarificationNeeded: boolean;
  questions: ClarificationQuestion[];
  suggestions: FallbackSuggestion | null;
  confidence: number;
} {
  const analysis = analyzeUserRequest(userInput);
  const questions = generateClarificationQuestions(userInput);

  // High confidence - proceed normally
  if (analysis.confidence >= 0.8) {
    return {
      shouldProceed: true,
      clarificationNeeded: false,
      questions: [],
      suggestions: null,
      confidence: analysis.confidence,
    };
  }

  // Medium confidence - ask for clarification
  if (analysis.confidence >= 0.4) {
    return {
      shouldProceed: false,
      clarificationNeeded: true,
      questions,
      suggestions: null,
      confidence: analysis.confidence,
    };
  }

  // Low confidence - provide fallbacks
  return {
    shouldProceed: false,
    clarificationNeeded: true,
    questions,
    suggestions: generateFallbackSuggestions(userInput),
    confidence: analysis.confidence,
  };
}

/**
 * Format response for user when safeguards are triggered
 */
export function formatSafeguardResponse(
  result: ReturnType<typeof processSafeguards>
): string {
  if (result.shouldProceed) {
    return ""; // No safeguard response needed
  }

  let response = "";

  // Add clarification questions
  if (result.questions.length > 0) {
    for (const question of result.questions) {
      response += `${question.question}\n\n`;
      for (const suggestion of question.suggestedTools) {
        response += `• ${suggestion}\n`;
      }
      response += "\n";
    }
  }

  // Add fallback suggestions
  if (result.suggestions) {
    response += `${result.suggestions.message}\n\n`;
    for (const alternative of result.suggestions.alternatives) {
      response += `• ${alternative}\n`;
    }
    if (result.suggestions.documentation) {
      response += `\n📚 ${result.suggestions.documentation}\n`;
    }
  }

  return response.trim();
}
