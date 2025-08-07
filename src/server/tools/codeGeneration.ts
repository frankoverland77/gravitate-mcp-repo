// Code generation tools

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ComponentInfo, UseCase } from "../../lib/types.js";
import { findComponentByName } from "../../lib/componentAnalysis.js";
import {
  generateGraviGridCode,
  generateLayoutCode,
  generateFormCode,
  generateGenericCode,
  generateGridFiles,
  generateReactProject,
} from "../../lib/codeGenerators.js";
import * as fs from "fs/promises";
import * as path from "path";

// Helper function to write React project files to filesystem
async function writeProjectToFilesystem(
  projectName: string,
  files: Array<{ type: string; text: string }>
): Promise<string> {
  const isRunningInDocker = process.env.NODE_ENV === 'production';
  
  let baseDir, projectDir;
  
  if (isRunningInDocker) {
    // Docker: Write to /app/repos (we'll copy out manually)
    baseDir = "/app/repos";
    projectDir = path.join(baseDir, `${projectName}Demo`);
  } else {
    // Local development: write directly to parent directory
    baseDir = "../";
    projectDir = path.resolve(baseDir, `${projectName}Demo`);
  }

  console.error(`🏗️  Creating project at: ${projectDir}`);
  console.error(`🐳 Running in Docker: ${isRunningInDocker}`);

  try {
    // Create project directory
    await fs.mkdir(projectDir, { recursive: true });
    console.error(`📂 Project directory created: ${projectDir}`);

    let filesWritten = 0;
    // Write each file
    for (const file of files) {
      const fileMatch = file.text.match(
        /\*\*(.*?)\*\*\n```(?:\w+)?\n([\s\S]*?)\n```/
      );
      if (!fileMatch) {
        console.error(`⚠️  Skipping file with invalid format`);
        continue;
      }

      const fileName = fileMatch[1];
      const fileContent = fileMatch[2];
      const filePath = path.join(projectDir, fileName);
      const fileDir = path.dirname(filePath);
      
      await fs.mkdir(fileDir, { recursive: true });
      await fs.writeFile(filePath, fileContent, "utf-8");
      filesWritten++;
      console.error(`✅ Written: ${fileName}`);
    }

    console.error(`🎉 Successfully created ${filesWritten} files`);
    
    if (isRunningInDocker) {
      console.error(`📦 Project created in container. Use 'copy-projects-from-docker.sh' to copy to host.`);
    }
    
    return projectDir;
  } catch (error) {
    console.error(`❌ Error creating project: ${error}`);
    throw new Error(`Failed to create project: ${error}`);
  }
}

// Helper function to read dependencies from main repo
async function readDependenciesFromMainRepo(): Promise<{
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  resolutions?: Record<string, string>;
}> {
  try {
    const packageJsonPath = process.env.MAIN_PROJECT_PACKAGE_JSON || 
      "../Gravitate.Dotnet.Next/frontend/package.json";
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);

    // Helper function to remove version prefixes (^, ~, etc) to get exact versions
    const cleanVersion = (version: string): string => {
      if (!version) return version;
      return version.replace(/^[\^~>=<]/, "");
    };

    // Get core dependencies from gravitate project with cleaned versions
    const coreDependencies = {
      "@gravitate-js/excalibrr": cleanVersion(
        packageJson.dependencies["@gravitate-js/excalibrr"]
      ),
      "ag-grid-community": cleanVersion(
        packageJson.dependencies["ag-grid-community"]
      ),
      "ag-grid-react": cleanVersion(packageJson.dependencies["ag-grid-react"]),
      "@tanstack/react-query": cleanVersion(
        packageJson.dependencies["@tanstack/react-query"]
      ),
      "react-router-dom": cleanVersion(
        packageJson.dependencies["react-router-dom"]
      ),
      react: cleanVersion(packageJson.dependencies["react"]),
      "react-dom": cleanVersion(packageJson.dependencies["react-dom"]),
      "@ant-design/icons": cleanVersion(
        packageJson.dependencies["@ant-design/icons"]
      ),
      "@nivo/bar": cleanVersion(packageJson.dependencies["@nivo/bar"]),
      "@nivo/core": cleanVersion(packageJson.dependencies["@nivo/core"]),
      "@nivo/line": cleanVersion(packageJson.dependencies["@nivo/line"]),
      "@nivo/tooltip": cleanVersion(packageJson.dependencies["@nivo/tooltip"]),
      antd: cleanVersion(packageJson.dependencies["antd"]),
      lodash: cleanVersion(packageJson.dependencies["lodash"]),
      moment: cleanVersion(packageJson.dependencies["moment"]),
      axios: cleanVersion(packageJson.dependencies["axios"]),
      // ADD MISSING VITE DEPENDENCIES - These are critical!
      vite: "^7.0.6",
      "@vitejs/plugin-react": "^4.7.0",
      "vite-plugin-svgr": "^4.3.0",
      "vite-tsconfig-paths": "^5.1.4",
      // Additional packages from working LemonadeCompetitors
      "react-ga": "^3.3.1",
      "react-lottie": "^1.2.10",
    };

    // Get dev dependencies with cleaned versions
    const coreDevDependencies = {
      typescript: cleanVersion(
        packageJson.dependencies["typescript"] ||
          packageJson.devDependencies["typescript"]
      ),
      "@types/react": cleanVersion(packageJson.devDependencies["@types/react"]),
      "@types/react-dom": cleanVersion(
        packageJson.devDependencies["@types/react-dom"]
      ),
      "@types/node": cleanVersion(packageJson.devDependencies["@types/node"]),
      less: "^3.9.0", // Add less for theme compilation
    };

    // Get resolutions if they exist
    const resolutions = packageJson.resolutions || {};

    return {
      dependencies: coreDependencies,
      devDependencies: coreDevDependencies,
      resolutions,
    };
  } catch (error) {
    console.warn(
      "Could not read dependencies from main repo, using defaults:",
      error
    );
    // FIXED: Use the proper getDynamicDependencies as fallback
    const { getDynamicDependencies } = await import(
      "../../lib/codeGenerators.js"
    );
    return getDynamicDependencies();
  }
}

export function registerCodeGenerationTools(server: McpServer): void {
  // DEBUG TOOL: Test file generation
  server.tool(
    "test_file_generation",
    "Test file generation capabilities - creates a simple test file",
    {
      testName: z.string().default("FileGenerationTest").describe("Name for the test")
    },
    async ({ testName }) => {
      const isRunningInDocker = process.env.NODE_ENV === 'production';
      
      let baseDir;
      let testPath;
      
      if (isRunningInDocker) {
        baseDir = process.env.OUTPUT_DIR || "/app/repos";
        testPath = path.join(baseDir, `${testName}.txt`);
      } else {
        baseDir = "../";
        testPath = path.resolve(baseDir, `${testName}.txt`);
      }

      try {
        const testContent = `Test file generated at: ${new Date().toISOString()}\nDocker: ${isRunningInDocker}\nBase dir: ${baseDir}\nFull path: ${testPath}`;
        
        await fs.mkdir(path.dirname(testPath), { recursive: true });
        await fs.writeFile(testPath, testContent, 'utf-8');
        
        // Verify file exists
        const exists = await fs.access(testPath).then(() => true).catch(() => false);
        
        return {
          content: [
            {
              type: "text" as const,
              text: `🧪 Test File Generation\n\nStatus: ${exists ? '✅ SUCCESS' : '❌ FAILED'}\nFile: ${testPath}\nDocker: ${isRunningInDocker}\nBase Dir: ${baseDir}\n\n${exists ? 'Check your repos directory for: ' + path.basename(testPath) : 'File creation failed'}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `❌ File generation test failed: ${error}\nPath attempted: ${testPath}\nDocker: ${isRunningInDocker}`
            }
          ]
        };
      }
    }
  );
  // Enhanced Grid Generation Tool with Complete React Project
  server.tool(
    "generate_grid_component",
    "Generate a complete runnable React project with Excalibrr grid component and navigation",
    {
      featureName: z
        .string()
        .describe(
          "The name of the feature/grid (e.g., 'ApplePieMarkets', 'ContractManagement')"
        ),
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
          })
        )
        .describe("Array of column definitions"),
      sampleData: z
        .array(z.record(z.any()))
        .describe("Sample data rows for the grid"),
      uniqueIdField: z
        .string()
        .describe(
          "The field name that uniquely identifies each row (for getRowId)"
        ),
      title: z
        .string()
        .optional()
        .describe("Display title for the grid component"),
      generateFullProject: z
        .boolean()
        .default(true)
        .describe(
          "Generate complete React project (true) or just component files (false)"
        ),
    },
    async (args, extra) => {
      const {
        featureName,
        columns,
        sampleData,
        uniqueIdField,
        title,
        generateFullProject,
      } = args;

      // Validate uniqueIdField exists in sample data
      if (
        sampleData.length > 0 &&
        !sampleData[0].hasOwnProperty(uniqueIdField)
      ) {
        throw new Error(
          `Unique ID field "${uniqueIdField}" not found in sample data. Available fields: ${Object.keys(
            sampleData[0]
          ).join(", ")}`
        );
      }

      const componentName = `${featureName}Page`;
      const displayTitle = title || `${featureName}`;
      const storageKey = featureName;
      const dataConstName = `${featureName.toLowerCase()}Data`;
      const hookName = `use${featureName}`;
      const getDataFunctionName = `get${featureName}Data`;

      const config = {
        featureName,
        componentName,
        columns,
        sampleData,
        uniqueIdField,
        displayTitle,
        storageKey,
        dataConstName,
        hookName,
        getDataFunctionName,
      };

      if (generateFullProject) {
        // Read dependencies from main repo
        const dependencyData = await readDependenciesFromMainRepo();

        // Generate React project with dependencies
        const files = generateReactProject(config, dependencyData);

        // Write files to filesystem
        const projectPath = await writeProjectToFilesystem(featureName, files);

        return {
          content: [
            {
              type: "text" as const,
              text:
                `🎉 **SUCCESS!** Complete ${featureName} React project created!\n\n` +
                `📁 **Project Created In Docker Container**\n` +
                `Docker path: \`${projectPath}\`\n\n` +
                `🚀 **To access your project:**\n` +
                `\`\`\`bash\n` +
                `# Copy project from Docker container to your machine\n` +
                `./copy-projects-from-docker.sh\n` +
                `\n` +
                `# Then run the project\n` +
                `cd ../${featureName}Demo\n` +
                `yarn install\n` +
                `yarn dev\n` +
                `\`\`\`\n\n` +
                `🌐 **Then open:** http://localhost:3001\n\n` +
                `✨ **What's included:**\n` +
                `• Full Excalibrr navigation with sidebar & top nav\n` +
                `• Working data grid with ${sampleData.length} sample records\n` +
                `• ${columns.length} columns with proper types\n` +
                `• Mock navigation (PricingEngine, Admin sections)\n` +
                `• PE theme configuration\n` +
                `• TypeScript throughout\n` +
                `• Ready for real API integration\n\n` +
                `📦 **Important:** The project is created inside the Docker container.\n` +
                `Run \`./copy-projects-from-docker.sh\` to copy it to your repos directory!\n\n` +
                `📋 **Files created:** ${files.length} files written to container\n` +
                `🏗️ **Project Structure:**\n` +
                `\`\`\`\n` +
                `${featureName}Demo/\n` +
                `├── index.html                # Vite entry point\n` +
                `├── package.json              # React + Excalibrr deps\n` +
                `├── public/index.html         # HTML shell\n` +
                `├── src/\n` +
                `│   ├── index.tsx             # React entry point\n` +
                `│   ├── App.tsx               # Navigation setup\n` +
                `│   ├── styles.css            # Custom styles\n` +
                `│   ├── components/\n` +
                `│   │   ├── ${componentName}.tsx    # Your grid\n` +
                `│   │   └── columnDefs.ts     # Column definitions\n` +
                `│   ├── mocks/\n` +
                `│   │   ├── mockScopes.ts     # Permissions\n` +
                `│   │   ├── mockPageConfig.tsx # Navigation\n` +
                `│   │   └── MockUserControlPanel.tsx\n` +
                `│   ├── data/\n` +
                `│   │   └── dummyData.ts      # Sample data\n` +
                `│   └── api/\n` +
                `│       ├── ${hookName}.ts    # Data hook\n` +
                `│       └── types.ts          # TypeScript types\n` +
                `└── README.md                 # Setup instructions\n` +
                `\`\`\``,
            },
          ],
        };
      } else {
        // Generate just the component files (original behavior)
        const files = generateGridFiles(config);

        return {
          content: [
            {
              type: "text" as const,
              text:
                `Generated component files for "${featureName}"\n\n` +
                `📁 File Structure:\n` +
                `frontend/src/modules/${featureName}/\n` +
                `├── ${componentName}.tsx\n` +
                `├── dummyData.ts\n` +
                `├── components/\n` +
                `│   └── columnDefs.ts\n` +
                `└── api/\n` +
                `    ├── ${hookName}.ts\n` +
                `    └── types.ts\n\n` +
                `🔧 Features included:\n` +
                `• TypeScript interfaces for all data types\n` +
                `• useMemo optimization for performance\n` +
                `• Proper getRowId configuration for "${uniqueIdField}"\n` +
                `• Dummy data with USE_DUMMY_DATA flag for easy API migration\n` +
                `• Single quotes, no semicolons (ESLint/Prettier compliant)\n` +
                `• Storage key for grid state persistence\n\n` +
                `📋 Files generated below:`,
            },
            ...files,
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
    async (
      { componentName, useCase = "basic", includeImports = true },
      extra
    ) => {
      try {
        const componentInfo = await findComponentByName(componentName);

        if (!componentInfo) {
          return {
            content: [
              {
                type: "text" as const,
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
        if (
          componentInfo.category === "data" &&
          componentName === "GraviGrid"
        ) {
          generatedCode = generateGraviGridCode(useCase);
        } else if (componentInfo.category === "layout") {
          generatedCode = generateLayoutCode(
            componentName,
            componentInfo,
            useCase
          );
        } else if (componentInfo.category === "forms") {
          generatedCode = generateFormCode(
            componentName,
            componentInfo,
            useCase
          );
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
              type: "text" as const,
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
              type: "text" as const,
              text: `Error generating code: ${error}`,
            },
          ],
        };
      }
    }
  );
}
