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
      getRowId: (row) => row.data.${uniqueIdField},
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

  const data: ${featureName}Row[] = ${getDataFunctionName}({});

  return (
    <GraviGrid
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={data}
      storageKey={storageKey}
    />
  );
}`;
}

// FIXED: Removed type properties from column definitions
function generateColumnDefs(
  featureName: string,
  columns: Array<{ field: string; headerName: string; type?: string }>
) {
  const columnDefsArray = columns
    .map((col) => {
      // CRITICAL FIX: Never include type property
      const colDef = `{ field: "${col.field}", headerName: "${col.headerName}" }`;
      return `    ${colDef}`;
    })
    .join(",\n");

  return `import { ColDef } from "ag-grid-community";

export function get${featureName}ColumnDefs() {
  return [
${columnDefsArray},
  ] as ColDef[];
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

  return `import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ${dataConstName} } from "../data/dummyData";
import {
  ${featureName}DataResponse,
  ${featureName}Request
} from "./types";

const endpoints = {
  ${getDataFunctionName}: "${featureName}/GetData",
} as const;

const USE_DUMMY_DATA = true;

export function ${hookName}() {
  const ${getDataFunctionName} = (payload: ${featureName}Request) =>
    USE_DUMMY_DATA
      ? ${dataConstName}
      : useQuery([endpoints.${getDataFunctionName}, payload], () => 
          fetch(endpoints.${getDataFunctionName}, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }).then(res => res.json())
        ) as UseQueryResult<${featureName}DataResponse, Error>;

  return {
    ${getDataFunctionName}
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
