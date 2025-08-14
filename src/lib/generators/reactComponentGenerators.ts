// Business logic component generators

import { ReactProjectConfig } from "./types.js";

// Generate the actual component files - FIXED TO REMOVE TYPE PROPERTIES
export function generateComponentFiles(config: ReactProjectConfig) {
  const {
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
  } = config;

  return [
    // Main page component
    {
      type: "text" as const,
      text: `📄 **src/components/${componentName}.tsx**\n\`\`\`typescript\n${generateMainComponent(
        config
      )}\n\`\`\``,
    },

    // Column definitions - FIXED
    {
      type: "text" as const,
      text: `📄 **src/components/columnDefs.ts**\n\`\`\`typescript\n${generateColumnDefs(
        featureName,
        columns
      )}\n\`\`\``,
    },

    // Sample data
    {
      type: "text" as const,
      text: `📄 **src/data/dummyData.ts**\n\`\`\`typescript\n${generateDummyData(
        dataConstName,
        sampleData
      )}\n\`\`\``,
    },

    // API hook
    {
      type: "text" as const,
      text: `📄 **src/api/${hookName}.ts**\n\`\`\`typescript\n${generateApiHook(
        config
      )}\n\`\`\``,
    },

    // Types
    {
      type: "text" as const,
      text: `📄 **src/api/types.ts**\n\`\`\`typescript\n${generateTypes(
        featureName,
        sampleData[0] || {}
      )}\n\`\`\``,
    },
  ];
}

// Helper functions for generating component code
function generateMainComponent(config: {
  componentName: string;
  featureName: string;
  uniqueIdField: string;
  displayTitle: string;
  storageKey: string;
  hookName: string;
  getDataFunctionName: string;
}) {
  const {
    componentName,
    featureName,
    uniqueIdField,
    displayTitle,
    storageKey,
    hookName,
    getDataFunctionName,
  } = config;

  return `import { GraviGrid } from "@gravitate-js/excalibrr";
import { useMemo } from "react";
import { get${featureName}ColumnDefs } from "./columnDefs";
import { ${hookName} } from "../api/${hookName}";
import { ${featureName}Row } from "../api/types";

export function ${componentName}() {
  const storageKey = "${storageKey}";
  const { ${getDataFunctionName} } = ${hookName}();

  const columnDefs = useMemo(() => get${featureName}ColumnDefs(), []);

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params) => params.data.${uniqueIdField},
    }),
    []
  );

  const controlBarProps = useMemo(
    () => ({
      title: "${displayTitle}",
      hideActiveFilters: false,
    }),
    []
  );

  const data: ${featureName}Row[] = ${getDataFunctionName}();

  return (
    <div
      style={{
        height: "calc(100vh - 140px)",
        width: "100%",
        position: "relative",
      }}
    >
      <GraviGrid
        controlBarProps={controlBarProps}
        agPropOverrides={agPropOverrides}
        columnDefs={columnDefs}
        rowData={data}
        storageKey={storageKey}
      />
    </div>
  );
}`;
}

// FIXED: Enhanced column definitions with proper ag-Grid properties
function generateColumnDefs(
  featureName: string,
  columns: Array<{ field: string; headerName: string; type?: string }>
) {
  const columnDefsArray = columns
    .map((col) => {
      // Determine width and special properties
      let width = 150; // default width
      let extraProps = "";

      // Set width based on field type or name (only set once!)
      if (
        col.type === "numericColumn" ||
        col.field.toLowerCase().includes("id")
      ) {
        width = 120;
      } else if (
        col.field.toLowerCase().includes("name") ||
        col.field.toLowerCase().includes("title")
      ) {
        width = 180;
      } else if (col.field.toLowerCase().includes("date")) {
        width = 120;
      } else if (
        col.type === "booleanColumn" ||
        col.field.toLowerCase().includes("active") ||
        col.field.toLowerCase().includes("enabled")
      ) {
        width = 100;
      }

      // Add special formatters
      if (
        col.field.toLowerCase().includes("salary") ||
        col.field.toLowerCase().includes("price") ||
        col.field.toLowerCase().includes("cost") ||
        col.field.toLowerCase().includes("revenue")
      ) {
        extraProps += `,
      valueFormatter: (params) => params.value ? \`$\${params.value.toLocaleString()}\` : ""`;
        if (width === 150) width = 120; // Set smaller width for currency fields if not already set
      }

      if (
        col.type === "booleanColumn" ||
        col.field.toLowerCase().includes("active") ||
        col.field.toLowerCase().includes("enabled") ||
        col.field.toLowerCase().includes("achieved")
      ) {
        extraProps += `,
      cellRenderer: (params) => (params.value ? "Yes" : "No")`;
      }

      // Build the complete column definition
      const colDef = `{
      field: "${col.field}",
      headerName: "${col.headerName}",
      width: ${width},
      sortable: true,
      filter: true${extraProps}
    }`;

      return `    ${colDef}`;
    })
    .join(",\n");

  return `import { ColDef } from "ag-grid-community";

export function get${featureName}ColumnDefs(): ColDef[] {
  return [
${columnDefsArray},
  ];
}`;
}

function generateDummyData(
  dataConstName: string,
  sampleData: Array<Record<string, any>>
) {
  // FIXED: Keep double quotes to avoid syntax errors with apostrophes in data
  const formattedData = JSON.stringify(sampleData, null, 2);

  return `export const ${dataConstName} = ${formattedData}`;
}

function generateApiHook(config: {
  featureName: string;
  hookName: string;
  getDataFunctionName: string;
  dataConstName: string;
}) {
  const { featureName, hookName, getDataFunctionName, dataConstName } = config;

  return `import { ${dataConstName} } from "../data/dummyData";
import {
  ${featureName}DataResponse,
  ${featureName}Request
} from "./types";

const endpoints = {
  ${getDataFunctionName}: "${featureName}/GetData",
} as const;

const USE_DUMMY_DATA = true;

export function ${hookName}() {
  const ${getDataFunctionName} = () => {
    return ${dataConstName};
  };

  return {
    ${getDataFunctionName},
  };
}`;
}

function generateTypes(featureName: string, sampleRow: Record<string, any>) {
  let rowInterface = "";

  if (Object.keys(sampleRow).length === 0) {
    rowInterface = `export interface ${featureName}Row {
  // Define your row structure here
}`;
  } else {
    const properties = Object.entries(sampleRow)
      .map(([key, value]) => {
        const type =
          typeof value === "number"
            ? "number"
            : typeof value === "boolean"
            ? "boolean"
            : "string";
        return `  ${key}: ${type}`;
      })
      .join("\n");

    rowInterface = `export interface ${featureName}Row {
${properties}
}`;
  }

  return `${rowInterface}

export interface ${featureName}Request {
  // Add request parameters as needed
}

export interface ${featureName}DataResponse {
  data: ${featureName}Row[]
  total?: number
  // Add other response properties as needed
}`;
}
