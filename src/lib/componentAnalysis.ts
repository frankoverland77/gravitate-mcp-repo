// Component analysis and scanning utilities

import * as fs from "fs/promises";
import * as path from "path";
import {
  ComponentInfo,
  ComponentRelationships,
  RelationshipInfo,
} from "./types.js";
import {
  EXCALIBRR_LIBRARY_PATH,
  USAGE_EXAMPLES_PATH,
  FILE_PATTERNS,
} from "../utils/constants.js";

// Helper function to scan for TypeScript component files
export async function scanForComponents(dirPath: string): Promise<string[]> {
  try {
    const files: string[] = [];

    async function scanDirectory(currentPath: string) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (
          entry.isDirectory() &&
          !entry.name.startsWith(".") &&
          !FILE_PATTERNS.SKIP_DIRECTORIES.includes(entry.name)
        ) {
          await scanDirectory(fullPath);
        } else if (
          entry.isFile() &&
          FILE_PATTERNS.COMPONENT_EXTENSIONS.some((ext) =>
            entry.name.endsWith(ext)
          ) &&
          !FILE_PATTERNS.SKIP_PATTERNS.some((pattern) =>
            entry.name.includes(pattern)
          )
        ) {
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
export async function extractComponentInfo(
  filePath: string
): Promise<ComponentInfo | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const fileName = path.basename(filePath, path.extname(filePath));

    // Skip non-component files
    if (
      FILE_PATTERNS.SKIP_PATTERNS.some((pattern) => fileName.includes(pattern))
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

    // Look for various interface patterns
    const interfacePatterns = [
      new RegExp(`interface\\s+${componentName}Props\\s*{([^}]*)}`, "s"),
      new RegExp(`type\\s+${componentName}Props\\s*=\\s*{([^}]*)}`, "s"),
      /interface\s+Props\s*{([^}]*)}/s,
      /type\s+Props\s*=\s*{([^}]*)}/s,
      /interface\s+(\w*Props)\s*{([^}]*)}/s,
      /type\s+(\w*Props)\s*=\s*{([^}]*)}/s,
      new RegExp(`${componentName}\\s*[=:]\\s*\\([^)]*{([^}]*)}[^)]*\\)`, "s"),
    ];

    let props: Record<string, any> = {};
    let propsContent = "";

    for (const pattern of interfacePatterns) {
      const match = content.match(pattern);
      if (match) {
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
export async function findUsageExamples(
  componentName: string,
  examplesPath: string
): Promise<string[]> {
  try {
    const files = await scanForComponents(examplesPath);
    const examples: string[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      if (content.includes(componentName)) {
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

// Helper function to analyze component relationships
export async function analyzeComponentRelationships(
  componentName: string,
  usageExamples: string[]
): Promise<ComponentRelationships> {
  const relationships: ComponentRelationships = {
    commonlyUsedWith: [],
    containers: [],
    patterns: [],
  };

  // Analyze usage examples to find relationships
  for (const example of usageExamples) {
    const componentMatches = example.match(
      /import.*{([^}]+)}.*@gravitate-js\/excalibrr/
    );
    if (componentMatches) {
      const components = componentMatches[1].split(",").map((c) => c.trim());

      for (const comp of components) {
        if (comp !== componentName && comp.length > 0) {
          const existing = relationships.commonlyUsedWith.find(
            (r) => r.component === comp
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

// Get all components from the library
export async function getAllComponents(): Promise<ComponentInfo[]> {
  const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);
  const components: ComponentInfo[] = [];

  for (const file of componentFiles) {
    const componentInfo = await extractComponentInfo(file);
    if (componentInfo) {
      components.push(componentInfo);
    }
  }

  return components;
}

// Find a specific component by name
export async function findComponentByName(
  componentName: string
): Promise<ComponentInfo | null> {
  const componentFiles = await scanForComponents(EXCALIBRR_LIBRARY_PATH);

  for (const file of componentFiles) {
    const componentInfo = await extractComponentInfo(file);
    if (componentInfo && componentInfo.name === componentName) {
      return componentInfo;
    }
  }

  return null;
}
