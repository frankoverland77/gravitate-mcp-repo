// Workflow Orchestrator - The brain of the intelligent MCP server
// This orchestrates multiple tool calls automatically based on the task

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RelationshipInfo, PatternInfo } from "../types.js";
import {
  ProjectComponentRegistry,
  ProjectComponent,
} from "../projectComponents.js";
import { ProjectComponentScanner } from "../projectComponentScanner.js";

export interface WorkflowStep {
  tool: string;
  params: Record<string, any>;
  processResult?: (result: any) => Record<string, any>;
  skipIf?: (context: WorkflowContext) => boolean;
}

export interface WorkflowContext {
  // Shared context across all workflow steps
  moduleName?: string;
  featureName?: string;
  theme?: string;
  components?: string[];
  query?: string; // User's original query for component discovery
  gridConfig?: {
    columns?: any[];
    apiEndpoint?: string;
    title?: string;
  };
  results: Record<string, any>;
  errors: string[];
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  steps: WorkflowStep[];
  outputFormatter?: (context: WorkflowContext) => any;
}

export class WorkflowOrchestrator {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private projectScanner: ProjectComponentScanner;

  constructor(private server: McpServer) {
    this.projectScanner = new ProjectComponentScanner();
    this.registerBuiltInWorkflows();
  }

  private registerBuiltInWorkflows() {
    // Workflow: Create a complete feature with grid
    this.registerWorkflow({
      name: "create-feature-with-grid",
      description:
        "Creates a complete feature module with grid, API hooks, and proper structure",
      steps: [
        {
          tool: "discover_components",
          params: { includeExamples: true },
          processResult: (result) => {
            // Extract available grid components
            const components = result?.content?.[0]?.text || "";
            const gridComponents =
              components.match(/GraviGrid|ConfigurableGridViews/g) || [];
            return { availableComponents: gridComponents };
          },
        },
        {
          tool: "get_component_details",
          params: { componentName: "GraviGrid" },
          processResult: (result) => {
            // Extract GraviGrid props and patterns
            return { graviGridDetails: result };
          },
        },
        {
          tool: "analyze_module_structure",
          params: {}, // Will be filled from context
          skipIf: (ctx) => !ctx.moduleName,
          processResult: (result) => {
            return { moduleStructure: result };
          },
        },
        {
          tool: "generate_feature_in_module",
          params: {}, // Will be filled from context
          processResult: (result) => {
            return { generatedFeature: result };
          },
        },
      ],
      outputFormatter: (context) => {
        return {
          success: context.errors.length === 0,
          feature: {
            module: context.moduleName,
            name: context.featureName,
            path: `src/modules/${context.moduleName}/${context.featureName}`,
            theme: context.theme,
          },
          files: context.results.generatedFeature?.files || [],
          errors: context.errors,
          nextSteps: [
            `1. Review generated files in src/modules/${context.moduleName}/${context.featureName}`,
            "2. Run 'yarn' to install any new dependencies",
            "3. Import the feature in your router",
            "4. Test the grid with sample data",
          ],
        };
      },
    });

    // Workflow: Apply theme to existing component
    this.registerWorkflow({
      name: "apply-theme",
      description: "Applies a Gravitate theme (OSP, PE, BP) to components",
      steps: [
        {
          tool: "list_gravitate_themes",
          params: {},
          processResult: (result) => {
            return { availableThemes: result };
          },
        },
        {
          tool: "preview_theme_colors",
          params: {}, // themeKey from context
          skipIf: (ctx) => !ctx.theme,
          processResult: (result) => {
            return { themeColors: result };
          },
        },
        {
          tool: "generate_themed_component",
          params: {}, // Will use context
          processResult: (result) => {
            return { themedComponent: result };
          },
        },
      ],
    });

    // Workflow: Discover and suggest components
    this.registerWorkflow({
      name: "smart-discovery",
      description:
        "Intelligently discovers Excalibrr and project components based on use case",
      steps: [
        {
          tool: "search_components",
          params: {}, // query from context
          processResult: (result) => {
            const excalibrComponents = this.parseComponentList(result);
            return { excalibrComponents };
          },
        },
        {
          tool: "find_component_relationships",
          params: {}, // componentName from context
          skipIf: (ctx) => !ctx.results.excalibrComponents?.length,
          processResult: (result) => {
            return { excalibrRelationships: result };
          },
        },
      ],
      outputFormatter: async (context) => {
        const excalibrComponents = context.results.excalibrComponents || [];
        const excalibrRelationships = context.results.excalibrRelationships;

        // Get project components that match the query
        const projectComponents = await this.discoverProjectComponents(
          context.query || ""
        );

        // Generate enhanced recommendations
        const recommendations = this.generateEnhancedRecommendations(
          excalibrComponents,
          projectComponents,
          excalibrRelationships,
          context.query || ""
        );

        return {
          excalibrComponents,
          projectComponents,
          recommendations,
          smartSuggestion: this.generateSmartSuggestion(
            [...excalibrComponents, ...projectComponents],
            excalibrRelationships
          ),
        };
      },
    });

    // Workflow: Generate production-ready grid
    this.registerWorkflow({
      name: "production-grid",
      description:
        "Generates a production-ready grid following Gravitate patterns",
      steps: [
        {
          tool: "analyze_module_structure",
          params: {},
          skipIf: (ctx) => !ctx.moduleName,
        },
        {
          tool: "generate_grid_component",
          params: {}, // Uses context for all params
          processResult: (result) => {
            return { gridComponent: result };
          },
        },
        {
          tool: "generate_form_for_feature",
          params: {},
          skipIf: (ctx) => !ctx.gridConfig?.columns,
          processResult: (result) => {
            return { formComponent: result };
          },
        },
      ],
    });
  }

  registerWorkflow(workflow: WorkflowDefinition) {
    this.workflows.set(workflow.name, workflow);
  }

  async executeWorkflow(
    workflowName: string,
    initialContext: Partial<WorkflowContext>
  ): Promise<any> {
    const workflow = this.workflows.get(workflowName);
    if (!workflow) {
      throw new Error(`Workflow '${workflowName}' not found`);
    }

    const context: WorkflowContext = {
      results: {},
      errors: [],
      ...initialContext,
    };

    console.error(`🔄 Starting workflow: ${workflow.name}`);

    for (const [index, step] of workflow.steps.entries()) {
      // Check if step should be skipped
      if (step.skipIf && step.skipIf(context)) {
        console.error(`⏭️  Skipping step ${index + 1}: ${step.tool}`);
        continue;
      }

      try {
        console.error(
          `▶️  Step ${index + 1}/${workflow.steps.length}: ${step.tool}`
        );

        // Merge context values into params
        const params = this.buildParams(step.params, context);

        // Execute the tool
        const result = await this.executeToolDirectly(step.tool, params);

        // Process the result if needed
        if (step.processResult) {
          const processed = step.processResult(result);
          Object.assign(context.results, processed);
        } else {
          context.results[step.tool] = result;
        }

        console.error(`✅ Step ${index + 1} completed`);
      } catch (error) {
        const errorMsg = `Error in step ${index + 1} (${step.tool}): ${error}`;
        console.error(`❌ ${errorMsg}`);
        context.errors.push(errorMsg);

        // Decide whether to continue or abort
        if (this.shouldAbortOnError(step, error)) {
          break;
        }
      }
    }

    console.error(`🏁 Workflow completed with ${context.errors.length} errors`);

    // Format the output
    if (workflow.outputFormatter) {
      return workflow.outputFormatter(context);
    }

    return {
      success: context.errors.length === 0,
      results: context.results,
      errors: context.errors,
    };
  }

  private buildParams(
    stepParams: Record<string, any>,
    context: WorkflowContext
  ): Record<string, any> {
    const params = { ...stepParams };

    // Auto-fill common parameters from context
    if (context.moduleName && !params.moduleName) {
      params.moduleName = context.moduleName;
    }
    if (context.featureName && !params.featureName) {
      params.featureName = context.featureName;
    }
    if (context.theme && !params.themeKey) {
      params.themeKey = context.theme;
    }
    if (context.gridConfig) {
      Object.assign(params, context.gridConfig);
    }

    // Handle dynamic params from previous results
    if (context.results.searchResults?.length && !params.componentName) {
      params.componentName = context.results.searchResults[0].name;
    }

    return params;
  }

  private async executeToolDirectly(
    toolName: string,
    params: any
  ): Promise<any> {
    // This will be connected to the actual MCP tools
    // For now, returning a placeholder
    console.error(`  📞 Calling tool: ${toolName} with params:`, params);

    // TODO: Connect to actual MCP server tools
    // return await this.server.callTool(toolName, params);

    return {
      content: [
        {
          type: "text",
          text: `Executed ${toolName}`,
        },
      ],
    };
  }

  private shouldAbortOnError(step: WorkflowStep, error: any): boolean {
    // Critical tools that should stop the workflow if they fail
    const criticalTools = [
      "generate_feature_in_module",
      "generate_grid_component",
      "generate_themed_component",
    ];

    return criticalTools.includes(step.tool);
  }

  private parseComponentList(result: any): any[] {
    // Parse component list from tool result
    const text = result?.content?.[0]?.text || "";
    const components = [];

    // Extract component info from the text
    const matches = text.matchAll(/\*\*([^*]+)\*\* \(([^)]+)\)/g);
    for (const match of matches) {
      components.push({
        name: match[1],
        category: match[2],
      });
    }

    return components;
  }

  private generateSmartSuggestion(
    components: any[],
    relationships: any
  ): string {
    if (!components.length) {
      return "No components found for your use case.";
    }

    let suggestion = `Based on your requirements, I recommend using:\n\n`;

    // Primary component
    suggestion += `**Primary:** ${components[0].name} (${components[0].category})\n`;

    // Commonly used with
    if (relationships?.commonlyUsedWith?.length) {
      suggestion += `\n**Works well with:**\n`;
      relationships.commonlyUsedWith
        .slice(0, 3)
        .forEach((rel: RelationshipInfo) => {
          suggestion += `- ${rel.component}: ${rel.reason}\n`;
        });
    }

    // Patterns
    if (relationships?.patterns?.length) {
      suggestion += `\n**Common patterns:**\n`;
      relationships.patterns.slice(0, 2).forEach((pattern: PatternInfo) => {
        suggestion += `- ${pattern.name}: ${pattern.useCase}\n`;
      });
    }

    return suggestion;
  }

  // Enhanced project component discovery
  private async discoverProjectComponents(
    query: string
  ): Promise<ProjectComponent[]> {
    try {
      // First check the manual registry for exact matches
      const registryMatches = ProjectComponentRegistry.findForUseCase(query);

      if (registryMatches.length > 0) {
        return registryMatches;
      }

      // If no manual registry matches, try automated discovery
      const discoveredComponents =
        await this.projectScanner.discoverAllComponents();

      // Filter discovered components by query relevance
      const lowerQuery = query.toLowerCase();
      const relevantComponents = discoveredComponents.filter(
        (comp) =>
          comp.name.toLowerCase().includes(lowerQuery) ||
          comp.description?.toLowerCase().includes(lowerQuery) ||
          comp.commonUseCases.some((useCase) =>
            useCase.toLowerCase().includes(lowerQuery)
          ) ||
          comp.usageContext.toLowerCase().includes(lowerQuery)
      );

      return relevantComponents.slice(0, 10); // Limit results
    } catch (error) {
      console.error(`Error discovering project components: ${error}`);
      return [];
    }
  }

  // Generate enhanced recommendations combining Excalibrr and project components
  private generateEnhancedRecommendations(
    excalibrComponents: any[],
    projectComponents: ProjectComponent[],
    relationships: any,
    query: string
  ): any {
    const recommendations: any = {
      primaryRecommendation: null,
      excalibrComponents: [],
      projectComponents: [],
      completeExample: null,
      imports: [],
    };

    // Determine primary component based on query intent
    if (query.toLowerCase().includes("grid")) {
      recommendations.primaryRecommendation = {
        component: "GraviGrid",
        type: "excalibrr",
        reason: "Core grid component from Excalibrr library",
      };

      // Add relevant project components for grids
      const gridProjectComponents = projectComponents.filter(
        (comp) =>
          comp.projectCategory === "cell-editors" ||
          comp.projectCategory === "bulk-editors" ||
          comp.projectCategory === "column-defs"
      );
      recommendations.projectComponents = gridProjectComponents;
    }

    // Add compatible project components for primary Excalibrr components
    excalibrComponents.forEach((excalibrComp) => {
      const compatibleProjectComps =
        ProjectComponentRegistry.findCompatibleComponents(excalibrComp.name);
      recommendations.projectComponents.push(...compatibleProjectComps);
    });

    // Generate import statements
    const excalibrImports = excalibrComponents.map((comp) => comp.name);
    const projectImports = recommendations.projectComponents.map(
      (comp: ProjectComponent) => comp.name
    );

    if (excalibrImports.length > 0) {
      recommendations.imports.push(
        `import { ${excalibrImports.join(
          ", "
        )} } from '@gravitate-js/excalibrr';`
      );
    }

    if (projectImports.length > 0) {
      recommendations.imports.push(
        ProjectComponentRegistry.generateImports(projectImports)
      );
    }

    // Generate a complete usage example
    if (recommendations.primaryRecommendation?.component === "GraviGrid") {
      recommendations.completeExample =
        this.generateGridExample(recommendations);
    }

    return recommendations;
  }

  // Generate a complete grid example with project components
  private generateGridExample(recommendations: any): string {
    const cellEditors = recommendations.projectComponents
      .filter(
        (comp: ProjectComponent) => comp.projectCategory === "cell-editors"
      )
      .slice(0, 2);

    const columnDefs = recommendations.projectComponents
      .filter(
        (comp: ProjectComponent) => comp.projectCategory === "column-defs"
      )
      .slice(0, 1);

    let example = `// Complete grid setup with project components
import { GraviGrid, Vertical, Horizontal } from '@gravitate-js/excalibrr';`;

    if (cellEditors.length > 0) {
      const cellEditorNames = cellEditors.map(
        (comp: ProjectComponent) => comp.name
      );
      example += `\nimport { ${cellEditorNames.join(
        ", "
      )} } from '@components/shared/Grid/cellEditors';`;
    }

    if (columnDefs.length > 0) {
      const columnDefNames = columnDefs.map(
        (comp: ProjectComponent) => comp.name
      );
      example += `\nimport { ${columnDefNames.join(
        ", "
      )} } from '@components/shared/Grid/sharedColumnDefs';`;
    }

    example += `

const columnDefs = [
  {
    field: 'name',
    headerName: 'Name',
    editable: true
  },`;

    if (
      cellEditors.some(
        (comp: ProjectComponent) => comp.name === "SearchableSelect"
      )
    ) {
      example += `
  {
    field: 'category',
    headerName: 'Category', 
    cellEditor: SearchableSelect,
    cellEditorParams: {
      options: categoryOptions,
      showSearch: true
    }
  },`;
    }

    if (
      cellEditors.some(
        (comp: ProjectComponent) => comp.name === "NumberCellEditor"
      )
    ) {
      example += `
  {
    field: 'price',
    headerName: 'Price',
    cellEditor: NumberCellEditor,
    cellEditorParams: {
      precision: 2,
      min: 0
    }
  },`;
    }

    example += `
];

export function MyGrid() {
  return (
    <Vertical>
      <GraviGrid
        columnDefs={columnDefs}
        rowData={data}
        enableBulkEdit={true}
        storageKey="my-grid"
      />
    </Vertical>
  );
}`;

    return example;
  }

  // Public method to list available workflows
  getAvailableWorkflows(): Array<{ name: string; description: string }> {
    return Array.from(this.workflows.values()).map((w) => ({
      name: w.name,
      description: w.description,
    }));
  }

  // Analyze a natural language request and suggest workflows
  suggestWorkflow(request: string): string | null {
    const requestLower = request.toLowerCase();

    const workflowMappings = {
      "create-feature-with-grid": [
        "create a grid",
        "new feature",
        "make a grid",
        "build a feature",
        "product management",
        "admin panel",
      ],
      "apply-theme": [
        "apply theme",
        "change theme",
        "use osp",
        "use pe theme",
        "theme it",
        "make it look like",
      ],
      "smart-discovery": [
        "what components",
        "find components",
        "search for",
        "discover",
        "what can i use",
      ],
      "production-grid": [
        "production grid",
        "real grid",
        "grid with api",
        "data grid",
      ],
    };

    for (const [workflow, triggers] of Object.entries(workflowMappings)) {
      if (triggers.some((trigger) => requestLower.includes(trigger))) {
        return workflow;
      }
    }

    return null;
  }
}
