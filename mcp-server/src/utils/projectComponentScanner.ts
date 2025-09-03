// Automated scanner for project-specific components in Gravitate.Dotnet.Next
// Discovers and analyzes project components alongside Excalibrr components

import * as fs from "fs/promises";
import * as path from "path";
import { ComponentInfo } from "./types.js";
import {
  ProjectComponent,
  ProjectComponentCategory,
} from "./projectComponents.js";

export class ProjectComponentScanner {
  private projectPath: string;

  constructor(
    projectPath: string = "../Gravitate.Dotnet.Next/frontend/src/components"
  ) {
    this.projectPath = projectPath;
  }

  // Main method to discover all project components
  async discoverAllComponents(): Promise<ProjectComponent[]> {
    try {
      const gridComponents = await this.scanGridComponents();
      const sharedComponents = await this.scanSharedComponents();

      return [...gridComponents, ...sharedComponents];
    } catch (error) {
      console.error(`Error scanning project components: ${error}`);
      return [];
    }
  }

  // Scan the shared/Grid directory for grid-related components
  private async scanGridComponents(): Promise<ProjectComponent[]> {
    const components: ProjectComponent[] = [];
    const gridPath = path.join(this.projectPath, "shared/Grid");

    try {
      // Cell Editors
      const cellEditorsPath = path.join(gridPath, "cellEditors");
      const cellEditors = await this.scanDirectory(
        cellEditorsPath,
        "cell-editors"
      );
      components.push(...cellEditors);

      // Bulk Change Components
      const bulkChangePath = path.join(gridPath, "bulkChange");
      const bulkEditors = await this.scanDirectory(
        bulkChangePath,
        "bulk-editors"
      );
      components.push(...bulkEditors);

      // Shared Column Definitions
      const sharedColDefsPath = path.join(gridPath, "sharedColumnDefs");
      const columnDefs = await this.scanDirectory(
        sharedColDefsPath,
        "column-defs"
      );
      components.push(...columnDefs);

      // Default Column Definitions
      const defaultColDefsPath = path.join(gridPath, "defaultColumnDefs");
      const defaultColumnDefs = await this.scanDirectory(
        defaultColDefsPath,
        "column-defs"
      );
      components.push(...defaultColumnDefs);

      // Messages
      const messagesPath = path.join(gridPath, "Messages");
      const messages = await this.scanDirectory(messagesPath, "grid-messages");
      components.push(...messages);

      // Action Buttons
      const actionButtonsPath = path.join(gridPath, "sharedActionButtons");
      const actionButtons = await this.scanDirectory(
        actionButtonsPath,
        "action-buttons"
      );
      components.push(...actionButtons);
    } catch (error) {
      console.error(`Error scanning grid components: ${error}`);
    }

    return components;
  }

  // Scan other shared components
  private async scanSharedComponents(): Promise<ProjectComponent[]> {
    const components: ProjectComponent[] = [];
    const sharedPath = path.join(this.projectPath, "shared");

    try {
      // Look for other important shared components
      const directories = await fs.readdir(sharedPath, { withFileTypes: true });

      for (const dir of directories) {
        if (dir.isDirectory() && dir.name !== "Grid") {
          const dirPath = path.join(sharedPath, dir.name);
          const dirComponents = await this.scanDirectory(dirPath, "shared-ui");
          components.push(...dirComponents);
        }
      }
    } catch (error) {
      console.error(`Error scanning shared components: ${error}`);
    }

    return components;
  }

  // Scan a directory for components
  private async scanDirectory(
    directoryPath: string,
    category: ProjectComponentCategory
  ): Promise<ProjectComponent[]> {
    const components: ProjectComponent[] = [];

    try {
      const files = await fs.readdir(directoryPath, { withFileTypes: true });

      for (const file of files) {
        if (
          file.isFile() &&
          (file.name.endsWith(".tsx") || file.name.endsWith(".ts"))
        ) {
          const filePath = path.join(directoryPath, file.name);
          const component = await this.analyzeComponent(filePath, category);
          if (component) {
            components.push(component);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${directoryPath}: ${error}`);
    }

    return components;
  }

  // Analyze a specific component file
  private async analyzeComponent(
    filePath: string,
    projectCategory: ProjectComponentCategory
  ): Promise<ProjectComponent | null> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const fileName = path.basename(filePath, path.extname(filePath));

      // Skip index files and utility files for now
      if (fileName === "index" || fileName === "util" || fileName === "types") {
        return null;
      }

      const component = await this.extractComponentInfo(
        content,
        filePath,
        projectCategory
      );
      return component;
    } catch (error) {
      console.error(`Error analyzing component ${filePath}: ${error}`);
      return null;
    }
  }

  // Extract component information from file content
  private async extractComponentInfo(
    content: string,
    filePath: string,
    projectCategory: ProjectComponentCategory
  ): Promise<ProjectComponent | null> {
    const fileName = path.basename(filePath, path.extname(filePath));

    // Extract exports (component names)
    const exportMatches = content.matchAll(
      /export\s+(?:const|function)\s+([A-Z]\w+)/g
    );
    const componentNames = Array.from(exportMatches, (match) => match[1]);

    if (componentNames.length === 0) {
      return null;
    }

    // Use the first exported component as the main component
    const componentName = componentNames[0];

    // Extract description from comments
    const description = this.extractDescription(content, componentName);

    // Extract props interface
    const props = this.extractProps(content, componentName);

    // Determine usage context based on category and content
    const usageContext = this.inferUsageContext(content, projectCategory);

    // Determine common use cases
    const commonUseCases = this.inferUseCases(
      content,
      projectCategory,
      componentName
    );

    // Find related Excalibrr components
    const relatedExcalibrComponents = this.findExcalibrImports(content);

    // Convert absolute path to relative for consistency
    const relativePath = path.relative(this.projectPath, filePath);

    return {
      name: componentName,
      file: `src/components/${relativePath}`,
      projectCategory,
      category: this.mapProjectCategoryToGeneralCategory(projectCategory),
      description:
        description ||
        `${componentName} component for ${projectCategory.replace("-", " ")}`,
      usageContext,
      commonUseCases,
      relatedExcalibrComponents,
      props: props || {},
    };
  }

  // Extract description from JSDoc or comments
  private extractDescription(
    content: string,
    componentName: string
  ): string | undefined {
    // Look for JSDoc comments above the component
    const jsdocPattern = new RegExp(
      `/\\*\\*([\\s\\S]*?)\\*/\\s*export.*${componentName}`,
      "i"
    );
    const jsdocMatch = content.match(jsdocPattern);

    if (jsdocMatch) {
      return jsdocMatch[1].replace(/\*/g, "").replace(/\n/g, " ").trim();
    }

    // Look for single line comments
    const commentPattern = new RegExp(
      `//\\s*(.+)\\s*export.*${componentName}`,
      "i"
    );
    const commentMatch = content.match(commentPattern);

    if (commentMatch) {
      return commentMatch[1].trim();
    }

    return undefined;
  }

  // Extract props from TypeScript interfaces
  private extractProps(
    content: string,
    componentName: string
  ): Record<string, any> {
    const props: Record<string, any> = {};

    // Look for props interface or type
    const interfacePatterns = [
      new RegExp(`interface\\s+${componentName}Props\\s*{([^}]*)}`, "s"),
      new RegExp(`type\\s+${componentName}Props\\s*=\\s*{([^}]*)}`, "s"),
      new RegExp(`type\\s+${componentName}Params\\s*=.*?{([^}]*)}`, "s"),
      new RegExp(`export\\s+type\\s+\\w*Params.*?{([^}]*)}`, "s"),
    ];

    for (const pattern of interfacePatterns) {
      const match = content.match(pattern);
      if (match) {
        const propsContent = match[1];
        const propLines = propsContent.split("\n");

        for (const line of propLines) {
          const propMatch = line.match(/^\s*(\w+)\??\s*:\s*([^,;]+)/);
          if (propMatch) {
            const [, propName, propType] = propMatch;
            props[propName] = {
              type: propType.trim(),
              required: !line.includes("?:"),
              description: `${propName} property`,
            };
          }
        }
        break;
      }
    }

    return props;
  }

  // Infer usage context based on content and category
  private inferUsageContext(
    content: string,
    category: ProjectComponentCategory
  ): string {
    const contexts = {
      "cell-editors": "Used in grid cells for interactive data editing",
      "bulk-editors": "Used for bulk operations on multiple grid rows",
      "column-defs": "Used to define reusable column configurations",
      "grid-messages": "Used to display grid-related notifications",
      "action-buttons": "Used for grid-related actions and operations",
      "grid-utilities": "Utility functions for grid behavior",
      "shared-ui": "Shared UI components across the application",
    };

    return contexts[category] || "General purpose component";
  }

  // Infer common use cases based on content analysis
  private inferUseCases(
    content: string,
    category: ProjectComponentCategory,
    componentName: string
  ): string[] {
    const useCases: string[] = [];

    // Analyze content for keywords that indicate use cases
    if (content.includes("trading") || content.includes("Trade")) {
      useCases.push("Trading system operations");
    }

    if (content.includes("bulk") || content.includes("Bulk")) {
      useCases.push("Bulk data operations");
    }

    if (content.includes("select") || content.includes("Select")) {
      useCases.push("Data selection and filtering");
    }

    if (content.includes("date") || content.includes("Date")) {
      useCases.push("Date and time management");
    }

    if (content.includes("number") || content.includes("Number")) {
      useCases.push("Numeric data entry and validation");
    }

    if (content.includes("checkbox") || content.includes("Checkbox")) {
      useCases.push("Boolean data toggling");
    }

    if (content.includes("notification") || content.includes("message")) {
      useCases.push("User notifications and feedback");
    }

    // Default use cases by category
    if (useCases.length === 0) {
      const defaultUseCases = {
        "cell-editors": ["Grid cell data editing", "Interactive data entry"],
        "bulk-editors": ["Mass data updates", "Batch operations"],
        "column-defs": [
          "Grid column configuration",
          "Reusable column patterns",
        ],
        "grid-messages": ["Grid notifications", "Operation feedback"],
        "action-buttons": ["Grid actions", "User interactions"],
        "grid-utilities": ["Grid behavior customization", "Event handling"],
        "shared-ui": ["General UI operations", "Reusable interface patterns"],
      };

      useCases.push(...(defaultUseCases[category] || []));
    }

    return useCases;
  }

  // Find Excalibrr components imported in the file
  private findExcalibrImports(content: string): string[] {
    const excalibrComponents: string[] = [];

    // Look for Excalibrr imports
    const importMatches = content.matchAll(
      /import.*?from\s+['"`]@gravitate-js\/excalibrr['"`]/g
    );

    for (const match of importMatches) {
      const importStatement = match[0];
      // Extract component names from the import
      const componentMatches = importStatement.matchAll(/([A-Z]\w+)/g);
      for (const componentMatch of componentMatches) {
        excalibrComponents.push(componentMatch[1]);
      }
    }

    return [...new Set(excalibrComponents)]; // Remove duplicates
  }

  // Map project category to general component category
  private mapProjectCategoryToGeneralCategory(
    projectCategory: ProjectComponentCategory
  ): string {
    const mapping = {
      "cell-editors": "interactive",
      "bulk-editors": "interactive",
      "column-defs": "data",
      "grid-messages": "ui",
      "action-buttons": "interactive",
      "grid-utilities": "ui",
      "shared-ui": "ui",
    };

    return mapping[projectCategory] || "ui";
  }
}
