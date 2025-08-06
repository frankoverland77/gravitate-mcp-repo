// Production code generation tools for existing projects
// src/server/tools/productionCodeGeneration.ts

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as fs from "fs/promises";
import * as path from "path";

// Simple template engine without external dependencies
class SimpleTemplateEngine {
  static render(template: string, data: Record<string, any>): string {
    // Handle simple variable replacements {{variable}}
    let result = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });

    // Handle arrays {{#each items}}...{{/each}}
    result = result.replace(
      /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (match, arrayName, itemTemplate) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) return "";

        return array
          .map((item) => {
            // Create a new context with item properties
            const itemContext = { ...data, ...item };
            return SimpleTemplateEngine.render(itemTemplate, itemContext);
          })
          .join("");
      }
    );

    // Handle conditionals {{#if condition}}...{{/if}}
    result = result.replace(
      /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, condition, content) => {
        return data[condition]
          ? SimpleTemplateEngine.render(content, data)
          : "";
      }
    );

    return result;
  }
}

// Templates for production code generation
const API_HOOK_TEMPLATE = `import { useApi } from '@gravitate-js/excalibrr'
import { useQuery, useMutation } from '@tanstack/react-query'
import { {{FeatureName}}Response } from './types.schema'

const endpoints = {
  get{{FeatureName}}List: '{{ApiEndpoint}}/List',
  create{{FeatureName}}: '{{ApiEndpoint}}/Create',
  update{{FeatureName}}: '{{ApiEndpoint}}/Update',
  delete{{FeatureName}}: '{{ApiEndpoint}}/Delete',
}

export const use{{FeatureName}} = () => {
  const api = useApi()

  const get{{FeatureName}}List = () =>
    useQuery<{{FeatureName}}Response[]>(
      [endpoints.get{{FeatureName}}List],
      () => api.get(endpoints.get{{FeatureName}}List),
      {
        refetchOnWindowFocus: false,
        onError: (error) => {
          console.error('{{FeatureName}} fetch error:', error)
        },
      }
    )

  const create{{FeatureName}} = useMutation(
    (data: Partial<{{FeatureName}}Response>) =>
      api.post(endpoints.create{{FeatureName}}, data),
    {
      onSuccess: () => {
        console.log('{{FeatureName}} created successfully')
      },
      onError: (error) => {
        console.error('{{FeatureName}} creation error:', error)
      },
    }
  )

  const update{{FeatureName}} = useMutation(
    ({ id, data }: { id: number; data: Partial<{{FeatureName}}Response> }) =>
      api.put(\`\${endpoints.update{{FeatureName}}}/\${id}\`, data),
    {
      onSuccess: () => {
        console.log('{{FeatureName}} updated successfully')
      },
      onError: (error) => {
        console.error('{{FeatureName}} update error:', error)
      },
    }
  )

  const delete{{FeatureName}} = useMutation(
    (id: number) => api.delete(\`\${endpoints.delete{{FeatureName}}}/\${id}\`),
    {
      onSuccess: () => {
        console.log('{{FeatureName}} deleted successfully')
      },
      onError: (error) => {
        console.error('{{FeatureName}} deletion error:', error)
      },
    }
  )

  return {
    get{{FeatureName}}List,
    create{{FeatureName}},
    update{{FeatureName}},
    delete{{FeatureName}},
  }
}`;

const TYPES_SCHEMA_TEMPLATE = `// TypeScript types for {{FeatureName}}

export interface {{FeatureName}}Response {
  {{#each columns}}
  {{field}}: {{tsType}}
  {{/each}}
}`;

const COLUMN_DEFS_TEMPLATE = `import { ColDef } from 'ag-grid-community'
import { ActionMenu } from './components/actionMenu'

export const get{{FeatureName}}ColumnDefs = (): ColDef[] => [
  {
    field: '{{uniqueIdField}}',
    cellRenderer: 'agGroupCellRenderer',
    valueFormatter: () => '',
    headerName: '',
    maxWidth: 50,
  },
  {
    field: '{{uniqueIdField}}',
    headerName: 'Id',
    maxWidth: 70,
  },
  {{#each columns}}
  {
    field: '{{field}}',
    headerName: '{{headerName}}',
    {{#if width}}width: {{width}},{{/if}}
    {{#if maxWidth}}maxWidth: {{maxWidth}},{{/if}}
    {{#if type}}type: '{{type}}',{{/if}}
  },
  {{/each}}
  {
    headerName: 'Actions',
    pinned: 'right',
    cellRenderer: ActionMenu,
    cellRendererParams: {
      primaryKey: '{{uniqueIdField}}',
    },
    maxWidth: 180,
  },
]`;

const GRID_COMPONENT_TEMPLATE = `import React, { useMemo } from 'react'
import { GraviGrid, Vertical, Texto, Horizontal, GraviButton } from '@gravitate-js/excalibrr'
import { get{{FeatureName}}ColumnDefs } from './columnDefs'
import { use{{FeatureName}} } from './api/use{{FeatureName}}'

export function {{FeatureName}}Grid() {
  const { get{{FeatureName}}List } = use{{FeatureName}}()
  const { data, isLoading, error } = get{{FeatureName}}List()

  const columnDefs = useMemo(() => get{{FeatureName}}ColumnDefs(), [])

  const getRowId = useMemo(
    () => (params: any) => String(params.data.{{uniqueIdField}}),
    []
  )

  if (error) {
    return (
      <Vertical padding={4}>
        <Texto size="lg" color="error">
          Error loading {{displayTitle}} data
        </Texto>
        <Texto size="sm" color="subtle">
          {error.message}
        </Texto>
      </Vertical>
    )
  }

  return (
    <Vertical height="100%">
      <Horizontal justify="space-between" align="center" padding={2}>
        <Texto size="xl" weight="bold">
          {{displayTitle}}
        </Texto>
        <GraviButton variant="primary" size="md">
          Create New
        </GraviButton>
      </Horizontal>
      
      <GraviGrid
        rowData={data || []}
        columnDefs={columnDefs}
        getRowId={getRowId}
        loading={isLoading}
        storageKey="{{storageKey}}"
        enableRangeSelection
        rowSelection="multiple"
        animateRows
        pagination
        paginationPageSize={20}
      />
    </Vertical>
  )
}`;

const PAGE_COMPONENT_TEMPLATE = `import React from 'react'
import { {{FeatureName}}Grid } from './components/{{FeatureName}}Grid'

const {{FeatureName}}Page = () => {
  return <{{FeatureName}}Grid />
}

export default {{FeatureName}}Page`;

const ACTION_MENU_TEMPLATE = `import React from 'react'
import { Dropdown, Menu } from 'antd'
import { MoreOutlined } from '@ant-design/icons'

export const ActionMenu = ({ data, primaryKey }: any) => {
  const menu = (
    <Menu>
      <Menu.Item key="view">View Details</Menu.Item>
      <Menu.Item key="edit">Edit</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" danger>
        Delete
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <MoreOutlined style={{ cursor: 'pointer' }} />
    </Dropdown>
  )
}`;

// Type definitions
interface FeatureGenerationParams {
  moduleName: string;
  featureName: string;
  columns: Array<{
    field: string;
    headerName: string;
    type?: string;
    width?: number;
    maxWidth?: number;
  }>;
  apiEndpoint: string;
  uniqueIdField: string;
  includeApi: boolean;
  includeStyles: boolean;
}

interface ProjectStructure {
  projectRoot: string;
  srcPath: string;
  modulesPath: string;
  hasModules: boolean;
  existingModules: string[];
}

// Helper functions
async function detectProjectStructure(
  projectRoot: string
): Promise<ProjectStructure> {
  const srcPath = path.join(projectRoot, "src");
  const modulesPath = path.join(srcPath, "modules");

  try {
    const hasModules = await fs
      .access(modulesPath)
      .then(() => true)
      .catch(() => false);
    let existingModules: string[] = [];

    if (hasModules) {
      const items = await fs.readdir(modulesPath);
      existingModules = items.filter((item) => !item.startsWith("."));
    }

    return {
      projectRoot,
      srcPath,
      modulesPath,
      hasModules,
      existingModules,
    };
  } catch (error) {
    throw new Error(`Failed to detect project structure: ${error}`);
  }
}

function inferTypeScriptType(field: string, type?: string): string {
  // Based on field name patterns
  if (field.toLowerCase().includes("id")) return "number";
  if (field.toLowerCase().includes("date")) return "string"; // ISO date string
  if (field.toLowerCase().includes("time")) return "string";
  if (
    field.toLowerCase().includes("count") ||
    field.toLowerCase().includes("amount")
  )
    return "number";
  if (field.toLowerCase().includes("is") || field.toLowerCase().includes("has"))
    return "boolean";

  // Based on AG-Grid column types
  if (type === "numericColumn") return "number";
  if (type === "dateColumn") return "string";
  if (type === "booleanColumn") return "boolean";

  // Default
  return "string";
}

async function createFeatureStructure(
  projectStructure: ProjectStructure,
  moduleName: string,
  featureName: string
): Promise<string> {
  const featurePath = path.join(
    projectStructure.modulesPath,
    moduleName,
    featureName
  );

  // Create directory structure
  await fs.mkdir(path.join(featurePath, "api"), { recursive: true });
  await fs.mkdir(path.join(featurePath, "components"), { recursive: true });

  return featurePath;
}

export function registerProductionCodeGenerationTools(server: McpServer): void {
  // Tool: Generate feature in existing project
  server.tool(
    "generate_feature_in_module",
    "Generate a new grid feature within an existing Gravitate project module",
    {
      projectRoot: z.string().describe("Root path of the Gravitate project"),
      moduleName: z
        .string()
        .describe(
          "Module name (e.g., 'Admin', 'PricingEngine', 'ContractManagement')"
        ),
      featureName: z
        .string()
        .describe("Feature name in PascalCase (e.g., 'PriceAudit')"),
      columns: z
        .array(
          z.object({
            field: z.string().describe("The data field name"),
            headerName: z
              .string()
              .describe("Display name for the column header"),
            type: z
              .string()
              .optional()
              .describe("Column type (e.g., 'numericColumn', 'dateColumn')"),
            width: z.number().optional().describe("Fixed width for the column"),
            maxWidth: z
              .number()
              .optional()
              .describe("Maximum width for the column"),
          })
        )
        .describe("Column definitions for the grid"),
      apiEndpoint: z
        .string()
        .describe("Backend API endpoint path (e.g., 'PriceEngine/Audit')"),
      uniqueIdField: z
        .string()
        .describe("Field name that uniquely identifies each row"),
      includeApi: z
        .boolean()
        .default(true)
        .describe("Generate API hooks and types"),
      includeStyles: z.boolean().default(false).describe("Generate CSS file"),
    },
    async (params) => {
      try {
        const projectStructure = await detectProjectStructure(
          params.projectRoot
        );

        // Create or verify module exists
        const modulePath = path.join(
          projectStructure.modulesPath,
          params.moduleName
        );
        await fs.mkdir(modulePath, { recursive: true });

        // Create feature structure
        const featurePath = await createFeatureStructure(
          projectStructure,
          params.moduleName,
          params.featureName
        );

        // Prepare template data
        const templateData = {
          FeatureName: params.featureName,
          featureName:
            params.featureName.charAt(0).toLowerCase() +
            params.featureName.slice(1),
          ApiEndpoint: params.apiEndpoint,
          uniqueIdField: params.uniqueIdField,
          displayTitle: params.featureName.replace(/([A-Z])/g, " $1").trim(),
          storageKey: `${params.moduleName}_${params.featureName}`,
          columns: params.columns.map((col) => ({
            ...col,
            tsType: inferTypeScriptType(col.field, col.type),
          })),
        };

        const filesCreated: string[] = [];

        // Generate API files
        if (params.includeApi) {
          // API hook
          const apiHookContent = SimpleTemplateEngine.render(
            API_HOOK_TEMPLATE,
            templateData
          );
          const apiHookPath = path.join(
            featurePath,
            "api",
            `use${params.featureName}.ts`
          );
          await fs.writeFile(apiHookPath, apiHookContent, "utf-8");
          filesCreated.push(apiHookPath);

          // Types schema
          const typesContent = SimpleTemplateEngine.render(
            TYPES_SCHEMA_TEMPLATE,
            templateData
          );
          const typesPath = path.join(featurePath, "api", "types.schema.ts");
          await fs.writeFile(typesPath, typesContent, "utf-8");
          filesCreated.push(typesPath);
        }

        // Generate column definitions
        const columnDefsContent = SimpleTemplateEngine.render(
          COLUMN_DEFS_TEMPLATE,
          templateData
        );
        const columnDefsPath = path.join(featurePath, "columnDefs.tsx");
        await fs.writeFile(columnDefsPath, columnDefsContent, "utf-8");
        filesCreated.push(columnDefsPath);

        // Generate grid component
        const gridContent = SimpleTemplateEngine.render(
          GRID_COMPONENT_TEMPLATE,
          templateData
        );
        const gridPath = path.join(
          featurePath,
          "components",
          `${params.featureName}Grid.tsx`
        );
        await fs.writeFile(gridPath, gridContent, "utf-8");
        filesCreated.push(gridPath);

        // Generate action menu
        const actionMenuContent = SimpleTemplateEngine.render(
          ACTION_MENU_TEMPLATE,
          templateData
        );
        const actionMenuPath = path.join(
          featurePath,
          "components",
          "actionMenu.tsx"
        );
        await fs.writeFile(actionMenuPath, actionMenuContent, "utf-8");
        filesCreated.push(actionMenuPath);

        // Generate page component
        const pageContent = SimpleTemplateEngine.render(
          PAGE_COMPONENT_TEMPLATE,
          templateData
        );
        const pagePath = path.join(featurePath, "page.tsx");
        await fs.writeFile(pagePath, pageContent, "utf-8");
        filesCreated.push(pagePath);

        // Generate styles if requested
        if (params.includeStyles) {
          const stylesContent = `/* Styles for ${
            params.featureName
          } */\n\n.${params.featureName.toLowerCase()}-container {\n  height: 100%;\n}\n`;
          const stylesPath = path.join(featurePath, "styles.css");
          await fs.writeFile(stylesPath, stylesContent, "utf-8");
          filesCreated.push(stylesPath);
        }

        return {
          content: [
            {
              type: "text",
              text: `✅ **Feature Generated Successfully!**

**Module:** ${params.moduleName}
**Feature:** ${params.featureName}
**Location:** \`${featurePath}\`

**Files Created:**
${filesCreated
  .map((file) => `• ${path.relative(params.projectRoot, file)}`)
  .join("\n")}

**Structure Created:**
\`\`\`
${params.moduleName}/
└── ${params.featureName}/
    ├── page.tsx                    # Main page component
    ├── columnDefs.tsx              # AG-Grid column definitions
    ├── components/
    │   ├── ${params.featureName}Grid.tsx    # Grid component
    │   └── actionMenu.tsx          # Row actions menu
    ${
      params.includeApi
        ? `└── api/
        ├── use${params.featureName}.ts      # TanStack Query hooks
        └── types.schema.ts         # TypeScript types`
        : ""
    }
    ${
      params.includeStyles
        ? `└── styles.css                  # Feature styles`
        : ""
    }
\`\`\`

**Next Steps:**
1. **Update pageConfig.tsx** to add this feature to navigation
2. **Test the API endpoint** at \`${params.apiEndpoint}\`
3. **Customize the action menu** in \`components/actionMenu.tsx\`
4. **Add any feature-specific logic** to the grid component

**Integration Example:**
\`\`\`typescript
// In pageConfig.tsx, add:
{
  path: '${params.featureName.toLowerCase()}',
  element: lazy(() => import('@modules/${params.moduleName}/${
                params.featureName
              }/page')),
  name: '${templateData.displayTitle}',
  icon: <AppstoreOutlined />,
}
\`\`\`

**API Integration:**
The generated code expects endpoints at:
- GET: \`${params.apiEndpoint}/List\`
- POST: \`${params.apiEndpoint}/Create\`
- PUT: \`${params.apiEndpoint}/Update/{id}\`
- DELETE: \`${params.apiEndpoint}/Delete/{id}\`

Adjust the endpoints in \`api/use${params.featureName}.ts\` as needed.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error generating feature: ${error}`,
            },
          ],
        };
      }
    }
  );

  // Tool: Analyze existing module structure
  server.tool(
    "analyze_module_structure",
    "Analyze the structure of an existing module to understand patterns and conventions",
    {
      projectRoot: z.string().describe("Root path of the Gravitate project"),
      moduleName: z.string().describe("Module name to analyze"),
    },
    async ({ projectRoot, moduleName }) => {
      try {
        const modulePath = path.join(projectRoot, "src", "modules", moduleName);
        const items = await fs.readdir(modulePath);

        const features: string[] = [];
        const patterns = {
          hasApi: false,
          hasComponents: false,
          hasStyles: false,
          columnDefPattern: "",
          pagePattern: "",
        };

        for (const item of items) {
          const itemPath = path.join(modulePath, item);
          const stat = await fs.stat(itemPath);

          if (stat.isDirectory() && !item.startsWith(".")) {
            features.push(item);

            // Check for common patterns
            try {
              const subItems = await fs.readdir(itemPath);
              if (subItems.includes("api")) patterns.hasApi = true;
              if (subItems.includes("components"))
                patterns.hasComponents = true;
              if (subItems.includes("styles.css")) patterns.hasStyles = true;
              if (
                subItems.includes("columnDefs.tsx") ||
                subItems.includes("columnDefs.ts")
              ) {
                patterns.columnDefPattern = subItems.includes("columnDefs.tsx")
                  ? "tsx"
                  : "ts";
              }
              if (subItems.includes("page.tsx"))
                patterns.pagePattern = "page.tsx";
            } catch (e) {
              // Ignore errors for individual features
            }
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `# Module Analysis: ${moduleName}

**Module Path:** \`${modulePath}\`
**Features Found:** ${features.length}

**Features:**
${features.map((f) => `• ${f}`).join("\n")}

**Common Patterns:**
• API folders: ${patterns.hasApi ? "✅ Yes" : "❌ No"}
• Component folders: ${patterns.hasComponents ? "✅ Yes" : "❌ No"}
• Style files: ${patterns.hasStyles ? "✅ Yes" : "❌ No"}
• Column definitions: ${patterns.columnDefPattern || "Not found"}
• Page pattern: ${patterns.pagePattern || "Not found"}

**Recommendations:**
${
  patterns.hasApi
    ? "• Continue using api folders with TanStack Query hooks"
    : "• Consider adding api folders for data fetching"
}
${
  patterns.hasComponents
    ? "• Keep component organization in components folder"
    : "• Consider organizing components in subfolders"
}
${
  patterns.columnDefPattern
    ? `• Use .${patterns.columnDefPattern} extension for column definitions`
    : "• Add column definitions for grids"
}

Use this analysis to maintain consistency when adding new features to this module.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error analyzing module: ${error}`,
            },
          ],
        };
      }
    }
  );
}
