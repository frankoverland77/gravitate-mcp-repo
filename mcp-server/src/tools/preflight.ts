/**
 * Preflight Tool
 * 
 * Returns condensed API reference for components likely needed for a task.
 * Call ONCE before generating code to get all component APIs in one bundle.
 */

import { getComponent, listComponents } from "../registry/index.js";
import { ComponentMetadata } from "../registry/types.js";

interface PreflightArgs {
  task?: string;
  components?: string[];
  includeConventions?: boolean;
}

// Task keywords mapped to component IDs
const TASK_COMPONENT_MAP: Record<string, string[]> = {
  // Forms
  form: ["vertical", "horizontal", "texto", "gravi-button", "modal", "select"],
  modal: ["modal", "vertical", "horizontal", "texto", "gravi-button"],
  drawer: ["modal", "vertical", "horizontal", "texto", "gravi-button"], // Drawer uses similar patterns
  
  // Data display
  grid: ["gravi-grid", "vertical", "horizontal", "texto", "gravi-button"],
  table: ["gravi-grid", "vertical", "horizontal", "texto"],
  list: ["vertical", "horizontal", "texto"],
  
  // Layout
  page: ["vertical", "horizontal", "texto", "gravi-button"],
  layout: ["vertical", "horizontal"],
  card: ["vertical", "horizontal", "texto", "gravi-button"],
  
  // Navigation
  tabs: ["tabs", "vertical", "horizontal", "texto"],
  
  // Actions
  button: ["gravi-button"],
  actions: ["gravi-button", "popover"],
  
  // Full features
  crud: ["gravi-grid", "modal", "vertical", "horizontal", "texto", "gravi-button", "select"],
  management: ["gravi-grid", "modal", "vertical", "horizontal", "texto", "gravi-button", "select"],
  dashboard: ["gravi-grid", "vertical", "horizontal", "texto", "gravi-button", "tabs"],
};

// Core conventions quick reference
const CORE_CONVENTIONS = `
## ⚠️ Critical Conventions

### Layout Components
- **NEVER** use \`<div style={{display:'flex'}}>\` → Use \`<Vertical>\` or \`<Horizontal>\`
- Use component props for \`justifyContent\` and \`alignItems\` (not style)
- **NO gap prop** on Vertical/Horizontal → Use \`style={{ gap: '12px' }}\` or \`className="gap-12"\`
- Use \`flex="1"\` prop instead of \`style={{ flex: 1 }}\`
- Use \`height="100%"\` prop instead of \`style={{ height: '100%' }}\`

### Text
- **NEVER** use \`<p>\`, \`<h1>\`, \`<span>\` → Use \`<Texto category="...">\`
- \`appearance="secondary"\` is BLUE, not gray → Use \`appearance="medium"\` for gray

### Buttons
- Use \`<GraviButton buttonText="..."/>\` (not children)
- Boolean theme props: \`success\`, \`theme1\`, \`danger\` (not \`theme="success"\`)
- No \`htmlType\` prop → Use \`onClick={() => form.submit()}\`

### Modal/Drawer
- Use \`visible={...}\` prop (not \`open={...}\`)

### GraviGrid
- Always include \`agPropOverrides={{}}\`
- Always include \`storageKey="UniqueGridName"\`

### Styling
- Prefer utility classes: \`mb-2\`, \`p-3\`, \`gap-16\`, \`border-radius-5\`
- Use CSS variables: \`var(--theme-color-2)\`, \`var(--theme-bg-elevated)\`
`;

/**
 * Extract condensed API for a component (key props only)
 */
function getCondensedAPI(component: ComponentMetadata): string {
  let output = `### ${component.name}\n`;
  output += `${component.description}\n\n`;
  
  // Key props only (required + commonly used)
  const keyProps = component.props?.filter(p => 
    p.required || 
    ['justifyContent', 'alignItems', 'flex', 'height', 'className', 'style',
     'buttonText', 'success', 'theme1', 'danger', 'onClick',
     'visible', 'onCancel', 'title', 'footer',
     'columnDefs', 'rowData', 'storageKey', 'agPropOverrides',
     'category', 'appearance', 'weight'].includes(p.name)
  ) || [];
  
  if (keyProps.length > 0) {
    output += `**Key Props:**\n`;
    for (const prop of keyProps) {
      const req = prop.required ? ' *(required)*' : '';
      const def = prop.defaultValue ? ` = \`${prop.defaultValue}\`` : '';
      output += `- \`${prop.name}: ${prop.type}\`${req}${def}\n`;
    }
    output += '\n';
  }
  
  // Notes/gotchas
  if (component.notes) {
    output += `**Notes:**\n${component.notes.trim()}\n\n`;
  }
  
  // One good example (skip warning examples)
  const goodExample = component.examples?.find(e => !e.name.includes('WRONG') && !e.name.includes('⚠️'));
  if (goodExample) {
    output += `**Example:** ${goodExample.name}\n\`\`\`tsx\n${goodExample.code}\n\`\`\`\n`;
  }
  
  return output;
}

/**
 * Detect components needed from task description
 */
function detectComponentsFromTask(task: string): string[] {
  const taskLower = task.toLowerCase();
  const componentIds = new Set<string>();
  
  // Check each keyword
  for (const [keyword, components] of Object.entries(TASK_COMPONENT_MAP)) {
    if (taskLower.includes(keyword)) {
      components.forEach(c => componentIds.add(c));
    }
  }
  
  // Always include core layout components
  componentIds.add('vertical');
  componentIds.add('horizontal');
  componentIds.add('texto');
  
  return Array.from(componentIds);
}

export async function preflightTool(args: PreflightArgs) {
  try {
    let componentIds: string[] = [];
    
    // Determine which components to include
    if (args.components && args.components.length > 0) {
      // Explicit list provided
      componentIds = args.components;
    } else if (args.task) {
      // Detect from task description
      componentIds = detectComponentsFromTask(args.task);
    } else {
      // Default: core layout components
      componentIds = ['vertical', 'horizontal', 'texto', 'gravi-button'];
    }
    
    // Build response
    let response = `# Preflight: Component API Reference\n\n`;
    
    if (args.task) {
      response += `**Task:** ${args.task}\n`;
      response += `**Components detected:** ${componentIds.join(', ')}\n\n`;
    }
    
    response += `---\n\n`;
    
    // Add conventions first (unless explicitly disabled)
    if (args.includeConventions !== false) {
      response += CORE_CONVENTIONS;
      response += `\n---\n\n`;
    }
    
    // Add component APIs
    response += `## Component APIs\n\n`;
    
    for (const id of componentIds) {
      const component = getComponent(id);
      if (component) {
        response += getCondensedAPI(component);
        response += `\n---\n\n`;
      } else {
        response += `### ${id}\n*Component not found in registry*\n\n---\n\n`;
      }
    }
    
    // Usage reminder
    response += `## Next Steps\n\n`;
    response += `1. Generate code following the conventions above\n`;
    response += `2. Run \`validate_code\` before presenting to user\n`;
    response += `3. Fix any errors before presenting\n`;
    
    return {
      content: [{ type: "text" as const, text: response }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error in preflight: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

// Tool definition for MCP
export const preflightToolDefinition = {
  name: "preflight",
  description: "Get condensed API reference for components before code generation. Call ONCE at the start of any code generation task. Detects needed components from task description or accepts explicit list.",
  inputSchema: {
    type: "object" as const,
    properties: {
      task: {
        type: "string",
        description: "Task description (e.g., 'build a form modal', 'create a grid page'). Components will be auto-detected."
      },
      components: {
        type: "array",
        items: { type: "string" },
        description: "Explicit list of component IDs (e.g., ['vertical', 'gravi-grid', 'modal'])"
      },
      includeConventions: {
        type: "boolean",
        default: true,
        description: "Include critical conventions quick reference"
      }
    }
  }
};
