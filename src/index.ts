#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Create server instance
const server = new McpServer({
  name: "excalibrr-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Configuration for Excalibrr library paths
const EXCALIBRR_LIBRARY_PATH =
  process.env.EXCALIBRR_PATH || "/Users/rebecca.hirai/repos/excalibrr";
const USAGE_EXAMPLES_PATH =
  process.env.USAGE_EXAMPLES_PATH ||
  "/Users/rebecca.hirai/repos/Gravitate.Dotnet.Next/frontend/src";

// Types for our component analysis
interface ComponentInfo {
  name: string;
  file: string;
  props?: Record<string, any>;
  description?: string;
  examples?: string[];
  category?: string;
}

interface ComponentLibrary {
  components: ComponentInfo[];
  lastUpdated: string;
  libraryPath: string;
}

// Helper function to scan for TypeScript component files
async function scanForComponents(dirPath: string): Promise<string[]> {
  try {
    const files: string[] = [];

    async function scanDirectory(currentPath: string) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (
          entry.isDirectory() &&
          !entry.name.startsWith(".") &&
          entry.name !== "node_modules" &&
          entry.name !== "dist" && // Skip dist directory
          entry.name !== "build"
        ) {
          // Skip build directory
          await scanDirectory(fullPath);
        } else if (
          entry.isFile() &&
          (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) &&
          !entry.name.includes(".test.") &&
          !entry.name.includes(".spec.") &&
          !entry.name.includes(".d.ts")
        ) {
          // Skip type definition files
          files.push(fullPath);
        }
      }
    }

    await scanDirectory(dirPath);
    return files;
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
    return [];
  }
}

// Helper function to extract component info from file content
async function extractComponentInfo(
  filePath: string
): Promise<ComponentInfo | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const fileName = path.basename(filePath, path.extname(filePath));

    // Skip non-component files
    if (
      fileName.includes(".test") ||
      fileName.includes(".spec") ||
      fileName.includes(".stories")
    ) {
      return null;
    }

    // Multiple patterns to find component exports
    const exportPatterns = [
      /export\s+default\s+(?:function\s+)?(\w+)/,
      /export\s+(?:function|const)\s+(\w+)/,
      /export\s*{\s*(\w+)(?:\s+as\s+default)?\s*}/,
      /const\s+(\w+)\s*=.*=>\s*{/,
      /function\s+(\w+)\s*\(/,
    ];

    let componentName: string | null = null;
    for (const pattern of exportPatterns) {
      const match = content.match(pattern);
      if (match) {
        componentName = match[1];
        break;
      }
    }

    if (!componentName) return null;

    // Look for various interface patterns - more comprehensive search
    const interfacePatterns = [
      new RegExp(`interface\\s+${componentName}Props\\s*{([^}]*)}`, "s"),
      new RegExp(`type\\s+${componentName}Props\\s*=\\s*{([^}]*)}`, "s"),
      /interface\s+Props\s*{([^}]*)}/s,
      /type\s+Props\s*=\s*{([^}]*)}/s,
      /interface\s+(\w*Props)\s*{([^}]*)}/s,
      /type\s+(\w*Props)\s*=\s*{([^}]*)}/s,
      // Also look for inline prop types in function signatures
      new RegExp(`${componentName}\\s*[=:]\\s*\\([^)]*{([^}]*)}[^)]*\\)`, "s"),
    ];

    let props: Record<string, any> = {};
    let propsContent = "";

    for (const pattern of interfacePatterns) {
      const match = content.match(pattern);
      if (match) {
        // Get the props content from the last capture group that contains curly braces content
        propsContent =
          match.find((group) => group && group.includes(":")) ||
          match[match.length - 1];
        if (propsContent) break;
      }
    }

    // Parse the props content if found
    if (propsContent) {
      const propLines = propsContent
        .split(/[;\n,]/)
        .filter(
          (line) =>
            line.trim() &&
            !line.trim().startsWith("//") &&
            !line.trim().startsWith("/*") &&
            line.includes(":")
        );

      for (const line of propLines) {
        const propMatch = line.match(/(\w+)(\?)?:\s*([^;,\n}]+)/);
        if (propMatch) {
          const [, propName, optional, propType] = propMatch;
          props[propName] = {
            type: propType.trim(),
            required: !optional,
            description: null,
          };
        }
      }
    }

    // Look for JSDoc description
    const descriptionPatterns = [
      /\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/,
      /\/\*\*\s*(.+?)\s*\*\//s,
      /\/\/\s*(.+)$/m,
    ];

    let description: string | undefined;
    for (const pattern of descriptionPatterns) {
      const match = content.match(pattern);
      if (match) {
        description = match[1].replace(/\*/g, "").trim();
        break;
      }
    }

    // Better categorization based on component patterns
    let category = "ui";
    if (
      fileName.toLowerCase().includes("grid") ||
      componentName.toLowerCase().includes("grid")
    ) {
      category = "data";
    } else if (
      fileName.toLowerCase().includes("form") ||
      componentName.toLowerCase().includes("form")
    ) {
      category = "forms";
    } else if (
      fileName.toLowerCase().includes("layout") ||
      fileName.toLowerCase().includes("horizontal") ||
      fileName.toLowerCase().includes("vertical") ||
      componentName.toLowerCase().includes("layout")
    ) {
      category = "layout";
    } else if (content.includes("useState") || content.includes("useEffect")) {
      category = "interactive";
    }

    return {
      name: componentName,
      file: filePath,
      props,
      description,
      category,
    };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

// Helper function to find usage examples
async function findUsageExamples(
  componentName: string,
  examplesPath: string
): Promise<string[]> {
  try {
    const files = await scanForComponents(examplesPath);
    const examples: string[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      if (content.includes(componentName)) {
        // Extract the lines around the component usage
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(componentName)) {
            const start = Math.max(0, i - 2);
            const end = Math.min(lines.length, i + 5);
            const example = lines.slice(start, end).join("\n");
            examples.push(`// From ${path.basename(file)}:\n${example}`);
          }
        }
      }
    }

    return examples.slice(0, 3); // Limit to 3 examples
  } catch (error) {
    console.error(`Error finding usage examples:`, error);
    return [];
  }
}

// Tool: Discover all components in the Excalibrr library
server.tool(
  "discover_components",
  "Discover all available components in the Excalibrr library",
  {
    includeExamples: z
      .boolean()
      .optional()
      .describe("Whether to include usage examples from the main project"),
  },
  async ({ includeExamples = false }) => {
    try {
      const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);
      const components: ComponentInfo[] = [];

      for (const file of componentFiles) {
        const componentInfo = await extractComponentInfo(file);
        if (componentInfo) {
          if (includeExamples) {
            componentInfo.examples = await findUsageExamples(
              componentInfo.name,
              USAGE_EXAMPLES_PATH
            );
          }
          components.push(componentInfo);
        }
      }

      const library: ComponentLibrary = {
        components,
        lastUpdated: new Date().toISOString(),
        libraryPath: EXCALIBRR_LIBRARY_PATH,
      };

      return {
        content: [
          {
            type: "text",
            text: `Found ${
              components.length
            } components in Excalibrr library:\n\n${components
              .map(
                (comp) =>
                  `**${comp.name}** (${comp.category})\n` +
                  `  File: ${path.relative(
                    EXCALIBRR_LIBRARY_PATH,
                    comp.file
                  )}\n` +
                  (comp.description
                    ? `  Description: ${comp.description}\n`
                    : "") +
                  `  Props: ${
                    Object.keys(comp.props || {}).length
                  } properties\n` +
                  (comp.examples?.length
                    ? `  Examples: ${comp.examples.length} usage patterns found\n`
                    : "") +
                  "\n"
              )
              .join("")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error discovering components: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool: Get detailed information about a specific component
server.tool(
  "get_component_details",
  "Get detailed information about a specific Excalibrr component",
  {
    componentName: z.string().describe("The name of the component to analyze"),
  },
  async ({ componentName }) => {
    try {
      const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);

      for (const file of componentFiles) {
        const componentInfo = await extractComponentInfo(file);
        if (componentInfo && componentInfo.name === componentName) {
          // Add usage examples
          componentInfo.examples = await findUsageExamples(
            componentName,
            USAGE_EXAMPLES_PATH
          );

          const propsDetails = Object.entries(componentInfo.props || {})
            .map(
              ([name, info]) =>
                `  ${name}${info.required ? "" : "?"}: ${info.type}`
            )
            .join("\n");

          return {
            content: [
              {
                type: "text",
                text:
                  `# ${componentName}\n\n` +
                  `**Category:** ${componentInfo.category}\n` +
                  `**File:** ${path.relative(
                    EXCALIBRR_LIBRARY_PATH,
                    componentInfo.file
                  )}\n\n` +
                  (componentInfo.description
                    ? `**Description:** ${componentInfo.description}\n\n`
                    : "") +
                  `## Props\n\`\`\`typescript\n${
                    propsDetails || "No props interface found"
                  }\n\`\`\`\n\n` +
                  (componentInfo.examples?.length
                    ? `## Usage Examples\n\n${componentInfo.examples
                        .map((ex) => `\`\`\`tsx\n${ex}\n\`\`\``)
                        .join("\n\n")}\n`
                    : "No usage examples found in the main project.\n"),
              },
            ],
          };
        }
      }

      return {
        content: [
          {
            type: "text",
            text: `Component "${componentName}" not found in the Excalibrr library.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting component details: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool: Generate component usage code
server.tool(
  "generate_component_code",
  "Generate boilerplate code for using Excalibrr components",
  {
    componentName: z
      .string()
      .describe("The name of the component to generate code for"),
    useCase: z
      .enum(["basic", "with-props", "full-example", "grid-with-data"])
      .optional()
      .describe("Type of code example to generate"),
    includeImports: z
      .boolean()
      .optional()
      .describe("Whether to include import statements"),
  },
  async ({ componentName, useCase = "basic", includeImports = true }) => {
    try {
      const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);
      let componentInfo: ComponentInfo | null = null;

      // Find the component
      for (const file of componentFiles) {
        const info = await extractComponentInfo(file);
        if (info && info.name === componentName) {
          componentInfo = info;
          break;
        }
      }

      if (!componentInfo) {
        return {
          content: [
            {
              type: "text",
              text: `Component "${componentName}" not found in the Excalibrr library.`,
            },
          ],
        };
      }

      // Generate code based on component type and use case
      let generatedCode = "";
      let imports = "";

      if (includeImports) {
        imports = `import { ${componentName} } from '@gravitate-js/excalibrr';\nimport React from 'react';\n\n`;
      }

      // Generate different examples based on component category and use case
      if (componentInfo.category === "data" && componentName === "GraviGrid") {
        generatedCode = generateGraviGridCode(useCase);
      } else if (componentInfo.category === "layout") {
        generatedCode = generateLayoutCode(
          componentName,
          componentInfo,
          useCase
        );
      } else if (componentInfo.category === "forms") {
        generatedCode = generateFormCode(componentName, componentInfo, useCase);
      } else {
        generatedCode = generateGenericCode(
          componentName,
          componentInfo,
          useCase
        );
      }

      return {
        content: [
          {
            type: "text",
            text:
              `# Generated Code for ${componentName}\n\n` +
              `**Category:** ${componentInfo.category}\n` +
              `**Use Case:** ${useCase}\n\n` +
              `\`\`\`tsx\n${imports}${generatedCode}\n\`\`\``,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating code: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool: Suggest component combinations for design patterns
server.tool(
  "suggest_design_patterns",
  "Suggest component combinations for common design patterns",
  {
    pattern: z
      .enum([
        "dashboard",
        "data-table",
        "form-with-validation",
        "master-detail",
        "settings-panel",
        "user-management",
        "data-entry",
        "report-view",
      ])
      .describe("The design pattern to suggest components for"),
    complexity: z
      .enum(["simple", "standard", "advanced"])
      .optional()
      .describe("Complexity level of the pattern"),
  },
  async ({ pattern, complexity = "standard" }) => {
    try {
      const patterns = getDesignPatterns();
      const selectedPattern = patterns[pattern];

      if (!selectedPattern) {
        return {
          content: [
            {
              type: "text",
              text: `Design pattern "${pattern}" not found.`,
            },
          ],
        };
      }

      const suggestion = selectedPattern[complexity];

      return {
        content: [
          {
            type: "text",
            text:
              `# ${selectedPattern.title} Pattern (${complexity})\n\n` +
              `**Description:** ${suggestion.description}\n\n` +
              `## Recommended Components:\n\n${suggestion.components
                .map(
                  (comp: any) =>
                    `**${comp.name}** (${comp.category})\n` +
                    `  Purpose: ${comp.purpose}\n` +
                    `  Props: ${
                      comp.keyProps?.join(", ") || "Standard props"
                    }\n\n`
                )
                .join("")}` +
              `## Implementation Example:\n\n\`\`\`tsx\n${suggestion.codeExample}\n\`\`\`\n\n` +
              `## Pro Tips:\n${suggestion.tips
                .map((tip: string) => `- ${tip}`)
                .join("\n")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error suggesting design patterns: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool: Find component relationships and what works well together
server.tool(
  "find_component_relationships",
  "Find components that work well together and are commonly used in combination",
  {
    componentName: z
      .string()
      .describe("The component to find relationships for"),
    relationshipType: z
      .enum(["commonly-used-with", "contains", "contained-by", "alternatives"])
      .optional()
      .describe("Type of relationship to find"),
  },
  async ({ componentName, relationshipType = "commonly-used-with" }) => {
    try {
      // Find usage examples and analyze relationships
      const usageExamples = await findUsageExamples(
        componentName,
        USAGE_EXAMPLES_PATH
      );
      const relationships = await analyzeComponentRelationships(
        componentName,
        usageExamples
      );

      if (!relationships || Object.keys(relationships).length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No relationships found for "${componentName}". This might be a rarely used component or it may not exist.`,
            },
          ],
        };
      }

      let responseText = `# Component Relationships for ${componentName}\n\n`;

      if (
        relationshipType === "commonly-used-with" &&
        relationships.commonlyUsedWith?.length > 0
      ) {
        responseText += `## Commonly Used With:\n\n${relationships.commonlyUsedWith
          .map(
            (rel: any) =>
              `**${rel.component}** - ${rel.reason}\n` +
              `  Frequency: ${rel.frequency} occurrences\n` +
              `  Example: \`${rel.exampleUsage}\`\n\n`
          )
          .join("")}`;
      }

      if (relationships.containers?.length > 0) {
        responseText += `## Often Contains:\n\n${relationships.containers
          .map((rel: any) => `- **${rel.component}** (${rel.purpose})`)
          .join("\n")}\n\n`;
      }

      if (relationships.patterns?.length > 0) {
        responseText += `## Common Patterns:\n\n${relationships.patterns
          .map(
            (pattern: any) =>
              `**${pattern.name}**: ${pattern.components.join(" + ")}\n` +
              `  Use case: ${pattern.useCase}\n\n`
          )
          .join("")}`;
      }

      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error finding relationships: ${error}`,
          },
        ],
      };
    }
  }
);

// Tool: Generate complete layout compositions
server.tool(
  "build_layout_composition",
  "Generate complete layout compositions using multiple Excalibrr components",
  {
    layoutType: z
      .enum([
        "two-column",
        "three-column",
        "dashboard-grid",
        "master-detail",
        "sidebar-content",
        "header-content-footer",
      ])
      .describe("Type of layout to build"),
    contentAreas: z
      .array(z.string())
      .describe(
        "Names of content areas (e.g., ['navigation', 'main-content', 'sidebar'])"
      ),
    responsive: z
      .boolean()
      .optional()
      .describe("Whether to include responsive design considerations"),
  },
  async ({ layoutType, contentAreas, responsive = true }) => {
    try {
      const layoutComposition = generateLayoutComposition(
        layoutType,
        contentAreas,
        responsive
      );

      return {
        content: [
          {
            type: "text",
            text:
              `# ${layoutComposition.title}\n\n` +
              `**Layout Type:** ${layoutType}\n` +
              `**Content Areas:** ${contentAreas.join(", ")}\n` +
              `**Responsive:** ${responsive ? "Yes" : "No"}\n\n` +
              `## Structure:\n\`\`\`\n${layoutComposition.structure}\n\`\`\`\n\n` +
              `## Implementation:\n\n\`\`\`tsx\n${layoutComposition.code}\n\`\`\`\n\n` +
              `## Key Components Used:\n\n${layoutComposition.components
                .map(
                  (comp: any) =>
                    `**${comp.name}** - ${comp.purpose}\n` +
                    `  Props: ${comp.props.join(", ")}\n\n`
                )
                .join("")}` +
              (responsive
                ? `## Responsive Considerations:\n${layoutComposition.responsiveTips
                    .map((tip: string) => `- ${tip}`)
                    .join("\n")}\n\n`
                : "") +
              `## Customization Options:\n${layoutComposition.customizations
                .map((opt: string) => `- ${opt}`)
                .join("\n")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error building layout composition: ${error}`,
          },
        ],
      };
    }
  }
);

// Helper functions for code generation
function generateGraviGridCode(useCase: string): string {
  switch (useCase) {
    case "basic":
      return `function MyDataGrid() {
  return (
    <GraviGrid
      controlBarProps={{
        title: 'My Data Grid',
      }}
      columnDefs={[
        { headerName: 'Name', field: 'name' },
        { headerName: 'Status', field: 'status' },
        { headerName: 'Date', field: 'date' },
      ]}
      rowData={[]}
    />
  );
}`;

    case "grid-with-data":
      return `function AdvancedDataGrid() {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true },
    { headerName: 'Name', field: 'name', filter: true },
    { headerName: 'Status', field: 'status', cellRenderer: 'statusRenderer' },
    { headerName: 'Actions', field: 'actions', cellRenderer: 'actionRenderer' },
  ];

  return (
    <GraviGrid
      controlBarProps={{
        title: 'Advanced Data Management',
        showSearch: true,
        showExport: true,
      }}
      columnDefs={columnDefs}
      rowData={rowData}
      loading={loading}
      pagination={true}
      sideBar={{
        toolPanels: ['filters', 'columns'],
      }}
    />
  );
}`;

    default:
      return `<GraviGrid
  controlBarProps={{ title: 'Data Grid' }}
  columnDefs={columnDefs}
  rowData={rowData}
/>`;
  }
}

function generateLayoutCode(
  componentName: string,
  componentInfo: ComponentInfo,
  useCase: string
): string {
  if (componentName === "Horizontal") {
    switch (useCase) {
      case "basic":
        return `<Horizontal>
  <div>Left content</div>
  <div>Right content</div>
</Horizontal>`;

      case "full-example":
        return `<Horizontal 
  fullHeight 
  horizontalCenter 
  verticalCenter
  flex={1}
  border="subtle"
  style={{ padding: '16px' }}
>
  <Vertical flex={1}>
    <h2>Main Content</h2>
    <p>Your main content goes here</p>
  </Vertical>
  
  <Vertical flex={0} style={{ minWidth: '200px' }}>
    <h3>Sidebar</h3>
    <p>Sidebar content</p>
  </Vertical>
</Horizontal>`;

      default:
        return `<Horizontal alignItems="center" justifyContent="space-between">
  {/* Your content here */}
</Horizontal>`;
    }
  }

  if (componentName === "Vertical") {
    switch (useCase) {
      case "basic":
        return `<Vertical>
  <div>Top content</div>
  <div>Bottom content</div>
</Vertical>`;

      case "full-example":
        return `<Vertical 
  fullHeight 
  justifyContent="space-between"
  style={{ padding: '24px' }}
>
  <div>Header area</div>
  
  <Vertical flex={1} scroll>
    <h1>Main Content Area</h1>
    <p>Scrollable content goes here</p>
  </Vertical>
  
  <div>Footer area</div>
</Vertical>`;

      default:
        return `<Vertical justifyContent="center" alignItems="stretch">
  {/* Your content here */}
</Vertical>`;
    }
  }

  return `<${componentName}>
  {/* Add your content here */}
</${componentName}>`;
}

function generateFormCode(
  componentName: string,
  componentInfo: ComponentInfo,
  useCase: string
): string {
  return `<${componentName}>
  {/* Form implementation */}
</${componentName}>`;
}

function generateGenericCode(
  componentName: string,
  componentInfo: ComponentInfo,
  useCase: string
): string {
  const props = Object.keys(componentInfo.props || {});

  if (useCase === "with-props" && props.length > 0) {
    const exampleProps = props
      .slice(0, 3)
      .map((prop) => `${prop}={/* value */}`)
      .join("\n  ");
    return `<${componentName}
  ${exampleProps}
>
  {/* Content */}
</${componentName}>`;
  }

  return `<${componentName}>
  {/* Add your content here */}
</${componentName}>`;
}

// Helper function for design patterns
function getDesignPatterns(): Record<string, any> {
  return {
    dashboard: {
      title: "Dashboard Layout",
      simple: {
        description: "Basic dashboard with header and grid content",
        components: [
          { name: "Vertical", category: "layout", purpose: "Main container" },
          { name: "Horizontal", category: "layout", purpose: "Header area" },
          { name: "GraviGrid", category: "data", purpose: "Data display" },
        ],
        codeExample: `<Vertical fullHeight>
  <Horizontal style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
    <h1>Dashboard</h1>
  </Horizontal>
  
  <GraviGrid
    controlBarProps={{ title: 'Data Overview' }}
    columnDefs={columnDefs}
    rowData={data}
  />
</Vertical>`,
        tips: [
          "Use fullHeight on main container",
          "Add padding for visual breathing room",
        ],
      },
      standard: {
        description:
          "Full-featured dashboard with sidebar navigation and multiple data sections",
        components: [
          {
            name: "Horizontal",
            category: "layout",
            purpose: "Main layout container",
            keyProps: ["fullHeight"],
          },
          {
            name: "VerticalNav",
            category: "layout",
            purpose: "Sidebar navigation",
          },
          { name: "Vertical", category: "layout", purpose: "Content area" },
          {
            name: "DashboardWidget",
            category: "ui",
            purpose: "Widget containers",
          },
          { name: "GraviGrid", category: "data", purpose: "Data tables" },
        ],
        codeExample: `<Horizontal fullHeight>
  <VerticalNav />
  
  <Vertical flex={1} style={{ padding: '24px' }}>
    <h1>Dashboard</h1>
    
    <Horizontal style={{ gap: '16px', marginBottom: '24px' }}>
      <DashboardWidget title="Total Users" value="1,234" />
      <DashboardWidget title="Revenue" value="$45,678" />
      <DashboardWidget title="Growth" value="+12%" />
    </Horizontal>
    
    <GraviGrid
      controlBarProps={{ 
        title: 'Recent Activity',
        showSearch: true,
        showExport: true 
      }}
      columnDefs={columnDefs}
      rowData={data}
    />
  </Vertical>
</Horizontal>`,
        tips: [
          "Use consistent spacing with gap and margin",
          "Include navigation for easy access to different sections",
          "Group related widgets together",
          "Enable search and export for data grids",
        ],
      },
    },

    "data-table": {
      title: "Data Table with Controls",
      simple: {
        description: "Basic data table with filtering",
        components: [
          { name: "GraviGrid", category: "data", purpose: "Main data display" },
          {
            name: "GridControlBar",
            category: "data",
            purpose: "Search and filters",
          },
        ],
        codeExample: `<GraviGrid
  controlBarProps={{
    title: 'Data Table',
    showSearch: true,
  }}
  columnDefs={columnDefs}
  rowData={data}
  pagination={true}
/>`,
        tips: [
          "Enable pagination for large datasets",
          "Use showSearch for quick filtering",
        ],
      },
    },

    "master-detail": {
      title: "Master-Detail View",
      standard: {
        description: "Split view with list and detail panels",
        components: [
          {
            name: "Horizontal",
            category: "layout",
            purpose: "Split container",
          },
          {
            name: "Vertical",
            category: "layout",
            purpose: "Master and detail panels",
          },
          { name: "GraviGrid", category: "data", purpose: "Master list" },
        ],
        codeExample: `<Horizontal fullHeight>
  <Vertical flex={1} style={{ borderRight: '1px solid #eee' }}>
    <GraviGrid
      controlBarProps={{ title: 'Items' }}
      columnDefs={masterColumns}
      rowData={items}
      onRowClicked={setSelectedItem}
    />
  </Vertical>
  
  <Vertical flex={1} style={{ padding: '24px' }}>
    {selectedItem ? (
      <div>
        <h2>{selectedItem.name}</h2>
        <p>{selectedItem.description}</p>
      </div>
    ) : (
      <NothingMessage message="Select an item to view details" />
    )}
  </Vertical>
</Horizontal>`,
        tips: [
          "Use onRowClicked to handle selection",
          "Show a helpful message when nothing is selected",
          "Consider responsive behavior for mobile",
        ],
      },
    },
  };
}

// Helper function to analyze component relationships
async function analyzeComponentRelationships(
  componentName: string,
  usageExamples: string[]
): Promise<any> {
  const relationships: any = {
    commonlyUsedWith: [],
    containers: [],
    patterns: [],
  };

  // Analyze usage examples to find relationships
  for (const example of usageExamples) {
    // Simple pattern matching to find other components used together
    const componentMatches = example.match(
      /import.*{([^}]+)}.*@gravitate-js\/excalibrr/
    );
    if (componentMatches) {
      const components = componentMatches[1].split(",").map((c) => c.trim());

      for (const comp of components) {
        if (comp !== componentName && comp.length > 0) {
          const existing = relationships.commonlyUsedWith.find(
            (r: any) => r.component === comp
          );
          if (existing) {
            existing.frequency++;
          } else {
            relationships.commonlyUsedWith.push({
              component: comp,
              frequency: 1,
              reason: "Found in same import statement",
              exampleUsage: example.substring(0, 100) + "...",
            });
          }
        }
      }
    }
  }

  // Add some known relationships based on component patterns
  if (componentName === "GraviGrid") {
    relationships.commonlyUsedWith.push(
      {
        component: "Vertical",
        frequency: 5,
        reason: "Grids are often wrapped in Vertical containers",
        exampleUsage: "<Vertical><GraviGrid /></Vertical>",
      },
      {
        component: "Horizontal",
        frequency: 3,
        reason: "Used with Horizontal for split layouts",
        exampleUsage: "<Horizontal><GraviGrid /><Sidebar /></Horizontal>",
      }
    );
  }

  if (componentName === "Horizontal") {
    relationships.commonlyUsedWith.push({
      component: "Vertical",
      frequency: 8,
      reason: "Horizontal and Vertical are commonly nested",
      exampleUsage: "<Horizontal><Vertical /></Horizontal>",
    });
  }

  return relationships;
}

// Helper function to generate layout compositions
function generateLayoutComposition(
  layoutType: string,
  contentAreas: string[],
  responsive: boolean
): any {
  const compositions: Record<string, any> = {
    "two-column": {
      title: "Two-Column Layout",
      structure: `┌─────────────┬─────────────┐
│   ${contentAreas[0] || "Left"}   │   ${contentAreas[1] || "Right"}   │
│             │             │
│             │             │
└─────────────┴─────────────┘`,
      code: `<Horizontal fullHeight>
  <Vertical flex={2} style={{ padding: '24px' }}>
    {/* ${contentAreas[0] || "Main content"} */}
  </Vertical>
  
  <Vertical flex={1} style={{ padding: '24px', borderLeft: '1px solid #eee' }}>
    {/* ${contentAreas[1] || "Sidebar content"} */}
  </Vertical>
</Horizontal>`,
      components: [
        {
          name: "Horizontal",
          purpose: "Main container",
          props: ["fullHeight"],
        },
        {
          name: "Vertical",
          purpose: "Content columns",
          props: ["flex", "style"],
        },
      ],
      responsiveTips: [
        "Consider stacking columns on mobile using media queries",
        "Use flex values to control column widths",
        "Add border or background to separate columns visually",
      ],
      customizations: [
        "Adjust flex ratios for different column widths",
        "Add borders, shadows, or background colors",
        "Include scroll behavior for long content",
      ],
    },

    "dashboard-grid": {
      title: "Dashboard Grid Layout",
      structure: `┌─────────────────────────────┐
│         ${contentAreas[0] || "Header"}         │
├─────────┬─────────┬─────────┤
│ ${contentAreas[1] || "Widget"} │ ${contentAreas[2] || "Widget"} │ ${
        contentAreas[3] || "Widget"
      } │
├─────────┴─────────┴─────────┤
│      ${contentAreas[4] || "Main Content"}      │
└─────────────────────────────┘`,
      code: `<Vertical fullHeight style={{ padding: '24px' }}>
  <Horizontal style={{ marginBottom: '24px' }}>
    <h1>${contentAreas[0] || "Dashboard"}</h1>
  </Horizontal>
  
  <Horizontal style={{ gap: '16px', marginBottom: '24px' }}>
    <DashboardWidget title="${contentAreas[1] || "Metric 1"}" />
    <DashboardWidget title="${contentAreas[2] || "Metric 2"}" />
    <DashboardWidget title="${contentAreas[3] || "Metric 3"}" />
  </Horizontal>
  
  <Vertical flex={1}>
    <GraviGrid
      controlBarProps={{ title: '${contentAreas[4] || "Data Overview"}' }}
      columnDefs={columnDefs}
      rowData={data}
    />
  </Vertical>
</Vertical>`,
      components: [
        {
          name: "Vertical",
          purpose: "Main container",
          props: ["fullHeight", "style"],
        },
        { name: "Horizontal", purpose: "Widget rows", props: ["style", "gap"] },
        {
          name: "DashboardWidget",
          purpose: "Metric display",
          props: ["title"],
        },
        {
          name: "GraviGrid",
          purpose: "Data table",
          props: ["controlBarProps", "columnDefs", "rowData"],
        },
      ],
      responsiveTips: [
        "Stack widgets vertically on mobile",
        "Reduce padding on smaller screens",
        "Consider hiding less important widgets on mobile",
      ],
      customizations: [
        "Add more widget rows as needed",
        "Customize widget content and styling",
        "Include charts or other data visualizations",
      ],
    },
  };

  // Return the specified layout type or default to two-column
  return compositions[layoutType] || compositions["two-column"];
}

// Tool: Search components by category or functionality (keeping the original)
server.tool(
  "search_components",
  "Search for components by category, name, or functionality",
  {
    query: z
      .string()
      .describe("Search query (component name, category, or functionality)"),
    category: z
      .enum(["data", "forms", "layout", "interactive", "ui", "all"])
      .optional()
      .describe("Filter by component category"),
  },
  async ({ query, category = "all" }) => {
    try {
      const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);
      const allComponents: ComponentInfo[] = [];

      for (const file of componentFiles) {
        const componentInfo = await extractComponentInfo(file);
        if (componentInfo) {
          allComponents.push(componentInfo);
        }
      }

      const filteredComponents = allComponents.filter((comp) => {
        const matchesQuery =
          comp.name.toLowerCase().includes(query.toLowerCase()) ||
          comp.description?.toLowerCase().includes(query.toLowerCase()) ||
          comp.file.toLowerCase().includes(query.toLowerCase());
        const matchesCategory =
          category === "all" || comp.category === category;

        return matchesQuery && matchesCategory;
      });

      if (filteredComponents.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No components found matching "${query}"${
                category !== "all" ? ` in category "${category}"` : ""
              }.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Found ${
              filteredComponents.length
            } component(s) matching "${query}":\n\n${filteredComponents
              .map(
                (comp) =>
                  `**${comp.name}** (${comp.category})\n` +
                  `  ${comp.description || "No description available"}\n` +
                  `  Props: ${
                    Object.keys(comp.props || {}).length
                  } properties\n\n`
              )
              .join("")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching components: ${error}`,
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Excalibrr MCP Server running on stdio");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
