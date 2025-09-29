import { promises as fs } from "fs";
import path from "path";
import { generateComponentProps } from "../utils/cssUtils.js";

interface CreateDemoArgs {
  instruction: string;
}

interface ParsedInstruction {
  name: string;
  type: "grid" | "form" | "dashboard";
  description: string;
  features: string[];
  category: "grids" | "forms" | "dashboards";
}

/**
 * Main tool for creating new demos in the monorepo structure
 * Parses natural language instructions and generates production-quality components
 */
export async function createDemoTool(args: CreateDemoArgs) {
  const { instruction } = args;

  try {
    // 1. Parse the instruction
    const parsed = parseInstruction(instruction);

    // 2. Generate the component code
    const componentCode = generateDemoComponent(parsed);

    // 3. Create the demo file
    const demoPath = await createDemoFile(parsed, componentCode);

    // 4. Update the demo configuration
    await updateDemoConfig(parsed);

    // 5. Update AuthenticatedRoute.jsx to add scope
    await updateAuthenticatedRoute(parsed);

    return {
      content: [
        {
          type: "text",
          text: `✅ Created demo: ${parsed.name}

📁 Location: ${demoPath}
🎯 Type: ${parsed.type}
🔗 URL: http://localhost:3000/demos/${parsed.category}/${parsed.name
            .toLowerCase()
            .replace(/\s+/g, "-")}

Features:
${parsed.features.map((f) => `  • ${f}`).join("\n")}

🚀 Start the demo server:
  yarn dev

📝 Configuration updated:
  ✅ Page config with route
  ✅ Authenticated route with scope

Open in Cursor to see the generated code!`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error creating demo: ${
            error instanceof Error ? error.message : String(error)
          }

Please check the instruction and try again. Examples:
  • "Create a product inventory grid"
  • "Make a customer form with validation"
  • "Show me a trading dashboard"`,
        },
      ],
    };
  }
}

function parseInstruction(instruction: string): ParsedInstruction {
  const lowered = instruction.toLowerCase();

  // Determine type - be more specific about what makes something a form vs grid
  let type: ParsedInstruction["type"] = "grid";
  
  // Form indicators (highest priority)
  if (
    lowered.includes("form") ||
    lowered.includes("entry") ||
    lowered.includes("input") ||
    lowered.includes("create") && (lowered.includes("record") || lowered.includes("item")) ||
    lowered.includes("add") && !lowered.includes("column") ||
    lowered.includes("edit") && !lowered.includes("editable") && !lowered.includes("inline")
  ) {
    type = "form";
  }
  // Dashboard indicators
  else if (lowered.includes("dashboard") || lowered.includes("analytics") || lowered.includes("metrics")) {
    type = "dashboard";
  }
  // Grid indicators (default)
  else if (lowered.includes("grid") || lowered.includes("table") || lowered.includes("list") || lowered.includes("display") || lowered.includes("show")) {
    type = "grid";
  }

  // Extract name
  let name = "Demo";
  if (lowered.includes("product")) {
    name = type === "form" ? "Product Form" : "Product Grid";
  } else if (lowered.includes("inventory")) {
    name = type === "form" ? "Inventory Form" : "Inventory Grid";
  } else if (lowered.includes("customer")) {
    name = type === "form" ? "Customer Form" : "Customer Grid";
  } else if (lowered.includes("trading")) {
    name = "Trading Dashboard";
  } else {
    // Extract first noun after action words
    const words = instruction.split(" ");
    const actionIndex = words.findIndex((w) =>
      ["create", "make", "show", "build", "generate"].includes(w.toLowerCase())
    );
    if (actionIndex >= 0 && actionIndex < words.length - 1) {
      name = words[actionIndex + 1];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      name = type === "form" ? `${name} Form` : `${name} Grid`;
    }
  }

  // Extract features
  const features: string[] = [];
  if (lowered.includes("edit") || lowered.includes("inline")) {
    features.push("Inline editing");
  }
  if (lowered.includes("filter")) {
    features.push("Filtering");
  }
  if (lowered.includes("sort")) {
    features.push("Sorting");
  }
  if (lowered.includes("export")) {
    features.push("Export functionality");
  }
  if (lowered.includes("validation")) {
    features.push("Form validation");
  }
  if (lowered.includes("status") || lowered.includes("active")) {
    features.push("Status indicators");
  }

  // Default features based on type
  if (features.length === 0) {
    if (type === "grid") {
      features.push("Data display", "Sorting", "Real Excalibrr components");
    } else if (type === "form") {
      features.push("Form inputs", "Validation", "Submit handling");
    }
  }

  // Validation: Ensure name matches detected type
  const nameLower = name.toLowerCase();
  if (type === "form" && !nameLower.includes("form")) {
    // Fix mismatched names
    name = name.replace(/grid/gi, "Form").replace(/Grid/g, "Form");
  } else if (type === "grid" && !nameLower.includes("grid") && !nameLower.includes("table")) {
    // Fix mismatched names  
    name = name.replace(/form/gi, "Grid").replace(/Form/g, "Grid");
  }

  return {
    name,
    type,
    description: `${name} - ${instruction}`,
    features,
    category: (type + "s") as "grids" | "forms" | "dashboards", // "grid" -> "grids"
  };
}

function generateDemoComponent(parsed: ParsedInstruction): string {
  const componentName = parsed.name.replace(/\s+/g, "");

  if (parsed.type === "grid") {
    return generateGridComponent(componentName, parsed);
  } else if (parsed.type === "form") {
    return generateFormComponent(componentName, parsed);
  } else {
    return generateGridComponent(componentName, parsed); // Default to grid
  }
}

function generateGridComponent(
  componentName: string,
  parsed: ParsedInstruction
): string {
  const columnDefs = generateColumnDefs(parsed.name);
  const idField = getIdField(parsed.name);
  
  // Check if we need NumberCellEditor import
  const hasNumberColumns = columnDefs.some((col: any) => col.cellEditor === 'NumberCellEditor');

  // Convert columnDefs to proper JavaScript with functions
  const columnDefsString = JSON.stringify(columnDefs, null, 4)
    .replace(/"cellRenderer":\s*"([^"]+)"/g, '"cellRenderer": $1')
    .replace(/"cellEditor":\s*"NumberCellEditor"/g, '"cellEditor": NumberCellEditor');

  const imports = hasNumberColumns
    ? `import React, { useMemo, useEffect } from 'react';
import { GraviGrid } from '@gravitate-js/excalibrr';
import { mockData } from './${componentName}.data';
import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor';`
    : `import React, { useMemo, useEffect } from 'react';
import { GraviGrid } from '@gravitate-js/excalibrr';
import { mockData } from './${componentName}.data';`;

  return `${imports}

const columnDefs = ${columnDefsString};

export function ${componentName}() {
  const storageKey = '${componentName.toLowerCase()}-grid';
  
  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.${idField},
  }), []);
  
  const controlBarProps = useMemo(() => ({
    title: '${parsed.name}',
    hideActiveFilters: false,
  }), []);
  
  const updateEP = async (params: any) => {
    // Empty function for now - will handle updates
    console.log('Update called with:', params);
    return Promise.resolve();
  };

  /* MCP Theme Script */
  // Set theme for this demo (follows ControlPanel pattern)
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("TYPE_OF_THEME", "BP");
    }
  }, []);
  /* End MCP Theme Script */

  return (
    <div style={{ height: '100%' }}>
      <GraviGrid
        storageKey={storageKey}
        rowData={mockData}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        updateEP={updateEP}
      />
    </div>
  );
}`;
}

function generateFormComponent(
  componentName: string,
  parsed: ParsedInstruction
): string {
  return `import React, { useState, useEffect } from 'react';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { Form, Input, Select, Switch } from 'antd';

export function ${componentName}() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', values);
    setLoading(false);
  };

  /* MCP Theme Script */
  // Set theme for this demo (follows ControlPanel pattern)
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("TYPE_OF_THEME", "BP");
    }
  }, []);
  /* End MCP Theme Script */

  return (
    <Vertical className="p-2" style={{ height: '100%', maxWidth: '600px' }}>
      <Horizontal justifyContent="space-between" alignItems="center" className="mb-2">
        <Texto category="h4" style={{ color: 'var(--theme-color-2)' }}>
          ${parsed.name}
        </Texto>
      </Horizontal>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ flex: 1 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Horizontal justifyContent="flex-end" style={{ gap: '12px' }}>
            <GraviButton
              buttonText="Cancel"
              onClick={() => form.resetFields()}
            />
            <GraviButton
              buttonText="Save"
              success
              onClick={() => form.submit()}
              loading={loading}
            />
          </Horizontal>
        </Form.Item>
      </Form>
    </Vertical>
  );
}`;
}

function generateMockData(componentName: string) {
  const baseData = [];
  const count = 25;

  for (let i = 1; i <= count; i++) {
    if (componentName.includes("Product")) {
      baseData.push({
        ProductId: i,
        Name: `Product ${String.fromCharCode(64 + i)}`,
        Abbreviation: `PRD${i.toString().padStart(3, "0")}`,
        Commodity: ["Gasoline", "Diesel", "Heating Oil"][i % 3],
        Grade: ["87 Octane", "#2", "Premium"][i % 3],
        IsActive: Math.random() > 0.2,
        ProductGroup: ["Motor Fuels", "Distillates", "Chemicals"][i % 3],
        CreatedDateTime: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    } else if (componentName.includes("Inventory")) {
      baseData.push({
        LoadingNumberId: i,
        LoadNumber: `LD-2024-${i.toString().padStart(3, "0")}`,
        ProductName: `Product ${String.fromCharCode(64 + i)}`,
        Quantity: Math.floor(Math.random() * 10000),
        LocationName: ["Terminal A", "Terminal B", "Terminal C"][i % 3],
        IsActive: Math.random() > 0.1,
        CreatedDateTime: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    } else {
      baseData.push({
        id: i,
        name: `Item ${i}`,
        status: ["Active", "Inactive", "Pending"][i % 3],
        value: Math.floor(Math.random() * 1000),
        createdAt: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }
  }

  return baseData;
}

function getIdField(componentName: string): string {
  if (componentName.includes("Product")) {
    return "ProductId";
  } else if (componentName.includes("Inventory")) {
    return "LoadNumber";
  } else {
    return "id";
  }
}

function generateColumnDefs(componentName: string) {
  if (componentName.includes("Product")) {
    return [
      {
        field: "ProductId",
        headerName: "ID",
      },
      {
        field: "Name",
        headerName: "Product Name",
        resizable: true,
      },
      {
        field: "Abbreviation",
        headerName: "Code",
      },
      {
        field: "Commodity",
        headerName: "Commodity",
      },
      {
        field: "Grade",
        headerName: "Grade",
      },
      {
        field: "IsActive",
        headerName: "Status",
        cellRenderer: '(params: any) => params.value ? "Active" : "Inactive"',
      },
    ];
  } else if (componentName.includes("Inventory")) {
    return [
      {
        field: "LoadNumber",
        headerName: "Load Number",
      },
      {
        field: "ProductName",
        headerName: "Product",
        resizable: true,
      },
      {
        field: "Quantity",
        headerName: "Quantity",
        filter: 'agNumberColumnFilter',
        cellEditor: 'NumberCellEditor',
        editable: true,
      },
      {
        field: "LocationName",
        headerName: "Location",
      },
      {
        field: "IsActive",
        headerName: "Status",
        cellRenderer: '(params: any) => params.value ? "Active" : "Inactive"',
      },
    ];
  } else {
    return [
      {
        field: "id",
        headerName: "ID",
      },
      {
        field: "name",
        headerName: "Name",
        resizable: true,
      },
      {
        field: "status",
        headerName: "Status",
      },
      {
        field: "value",
        headerName: "Value",
        filter: 'agNumberColumnFilter',
      },
      {
        field: "createdAt",
        headerName: "Created",
        valueFormatter:
          '(params: any) => params.value ? new Date(params.value).toLocaleDateString() : ""',
      },
    ];
  }
}

function generateDataFile(
  componentName: string,
  parsed: ParsedInstruction
): string {
  const mockData = generateMockData(parsed.name);

  return `// Mock data for ${componentName} demo
export const mockData = ${JSON.stringify(mockData, null, 2)};`;
}

async function createDemoFile(
  parsed: ParsedInstruction,
  code: string
): Promise<string> {
  const componentName = parsed.name.replace(/\s+/g, "");
  const fileName = componentName + ".tsx";
  const dataFileName = componentName + ".data.ts";

  // Create organized directory structure: demos/[category]/[ComponentName]/
  const componentDir = path.resolve(
    process.cwd(),
    "demo/src/pages/demos",
    parsed.category,
    componentName
  );

  const demoPath = path.resolve(componentDir, fileName);
  const dataPath = path.resolve(componentDir, dataFileName);

  // Ensure component directory exists
  await fs.mkdir(componentDir, { recursive: true });

  // Write the demo component file
  await fs.writeFile(demoPath, code);

  // Generate and write the data file
  const dataCode = generateDataFile(componentName, parsed);
  await fs.writeFile(dataPath, dataCode);

  return demoPath;
}

async function updateDemoConfig(parsed: ParsedInstruction): Promise<void> {
  const configPath = path.resolve(process.cwd(), "demo/src/pageConfig.tsx");
  const componentName = parsed.name.replace(/\s+/g, "");
  const routePath = `/demos/${parsed.category}/${parsed.name.toLowerCase().replace(/\s+/g, "-")}`;

  // Read current config
  const configContent = await fs.readFile(configPath, "utf-8");

  // Create import statement for the new component with organized path
  const importStatement = `import { ${componentName} } from "./pages/demos/${parsed.category}/${componentName}/${componentName}";`;
  let updatedContent = configContent;

  // Add import if it doesn't exist
  if (!updatedContent.includes(importStatement)) {
    // Find the last import statement and add after it
    const lastImportMatch = updatedContent.match(/import.*from.*;\s*$/m);
    if (lastImportMatch) {
      const insertIndex = updatedContent.indexOf(lastImportMatch[0]) + lastImportMatch[0].length;
      updatedContent = updatedContent.slice(0, insertIndex) + '\n' + importStatement + updatedContent.slice(insertIndex);
    }
  }

  // Create new demo registry entry
  const newDemoEntry = `  {
    key: "${componentName}",
    title: "${parsed.name}",
    element: <${componentName} />,
    path: "${routePath}",
    description: "${parsed.description}",
    created: "${new Date().toISOString()}",
    category: "${parsed.category}"
  }`;

  // Find the demoRegistry array and add the new entry
  const registryRegex = /(export const demoRegistry: DemoRoute\[\] = \[)([\s\S]*?)(\s+\/\/ MCP server will add more demos here automatically\s*\];)/;
  const match = updatedContent.match(registryRegex);

  if (match) {
    const [fullMatch, arrayStart, existingEntries, arrayEnd] = match;

    // Check if this demo already exists
    const existingEntryRegex = new RegExp(`key:\\s*"${componentName}"`, 'g');
    if (!existingEntryRegex.test(existingEntries)) {
      // Add the new entry
      const updatedEntries = existingEntries.trim()
        ? existingEntries.trimEnd() + ',\n' + newDemoEntry + '\n'
        : '\n' + newDemoEntry + '\n';

      updatedContent = updatedContent.replace(
        fullMatch,
        arrayStart + updatedEntries + arrayEnd
      );
    }
  }

  // Write updated config
  await fs.writeFile(configPath, updatedContent);
}

/**
 * Update AuthenticatedRoute.jsx to add the new demo scope
 */
async function updateAuthenticatedRoute(parsed: ParsedInstruction): Promise<void> {
  const authRoutePath = path.resolve(
    process.cwd(),
    "demo/src/_Main/AuthenticatedRoute.jsx"
  );

  try {
    // Read current AuthenticatedRoute file
    let authRoute = await fs.readFile(authRoutePath, "utf-8");

    // Find the scopes object and add the new scope if it doesn't exist
    const scopesRegex = /const scopes = \{([^}]*)\}/;
    const scopesMatch = authRoute.match(scopesRegex);
    const componentName = parsed.name.replace(/\s+/g, "");

    if (scopesMatch && !authRoute.includes(`${componentName}: true`)) {
      const existingScopes = scopesMatch[1];
      const newScope = `    ${componentName}: true,`;
      const updatedScopes = existingScopes.trimEnd() + "\n" + newScope;
      authRoute = authRoute.replace(
        scopesRegex,
        `const scopes = {${updatedScopes}\n  }`
      );
      await fs.writeFile(authRoutePath, authRoute);
    }
  } catch (error) {
    console.error("Warning: Could not update AuthenticatedRoute.jsx:", error);
    // Don't fail the entire operation if this update fails
  }
}
