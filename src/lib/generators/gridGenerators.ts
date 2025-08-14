// GraviGrid-specific code generation functions
import { ComponentInfo, UseCase } from "../types.js";

export interface GridConfig {
  featureName: string;
  componentName: string;
  columns: Array<{ field: string; headerName: string; type?: string }>;
  sampleData: Array<Record<string, any>>;
  uniqueIdField: string;
  displayTitle: string;
  storageKey: string;
  dataConstName: string;
  hookName: string;
  getDataFunctionName: string;
}

export function generateGraviGridCode(useCase: UseCase): string {
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

export function generateGridFiles(config: GridConfig) {
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

  // Generate TypeScript interface from sample data
  const rowInterface = generateRowInterface(featureName, sampleData[0] || {});

  return [
    // Main component file
    {
      type: "text" as const,
      text: `📄 **${componentName}.tsx**\n\`\`\`typescript\n${generateMainComponent(
        config
      )}\n\`\`\``,
    },

    // Column definitions
    {
      type: "text" as const,
      text: `📄 **components/columnDefs.ts**\n\`\`\`typescript\n${generateColumnDefs(
        featureName,
        columns
      )}\n\`\`\``,
    },

    // Dummy data
    {
      type: "text" as const,
      text: `📄 **dummyData.ts**\n\`\`\`typescript\n${generateDummyData(
        dataConstName,
        sampleData
      )}\n\`\`\``,
    },

    // API hook
    {
      type: "text" as const,
      text: `📄 **api/${hookName}.ts**\n\`\`\`typescript\n${generateApiHook(
        config
      )}\n\`\`\``,
    },

    // Types
    {
      type: "text" as const,
      text: `📄 **api/types.ts**\n\`\`\`typescript\n${generateTypes(
        featureName,
        rowInterface
      )}\n\`\`\``,
    },
  ];
}

export function generateMainComponent(config: {
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
  const storageKey = '${storageKey}'
  const { ${getDataFunctionName} } = ${hookName}()

  const columnDefs = useMemo(() => get${featureName}ColumnDefs(), [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params) => params.data.${uniqueIdField},
    }),
    []
  )

  const controlBarProps = useMemo(
    () => ({
      title: '${displayTitle}',
      hideActiveFilters: false,
    }),
    []
  )

  const data: ${featureName}Row[] = ${getDataFunctionName}()

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
  )
}`;
}

export function generateColumnDefs(
  featureName: string,
  columns: Array<{ field: string; headerName: string; type?: string }>
) {
  const columnDefsArray = columns
    .map((col) => {
      let colDef = `{
      field: "${col.field}",
      headerName: "${col.headerName}",
      width: 120,
      sortable: true,
      filter: true`;

      // Add special formatting for price fields
      if (col.field.toLowerCase().includes("price")) {
        colDef += `,
      valueFormatter: (params) => params.value ? \`$\${params.value.toLocaleString()}\` : ""`;
      }

      colDef += `
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

export function generateDummyData(
  dataConstName: string,
  sampleData: Array<Record<string, any>>
) {
  // FIXED: Keep double quotes to avoid syntax errors with apostrophes in data
  const formattedData = JSON.stringify(sampleData, null, 2);

  return `export const ${dataConstName} = ${formattedData}`;
}

export function generateApiHook(config: {
  featureName: string;
  hookName: string;
  getDataFunctionName: string;
  dataConstName: string;
}) {
  const { featureName, hookName, getDataFunctionName, dataConstName } = config;

  return `import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ${dataConstName} } from '../data/dummyData'
import {
  ${featureName}DataResponse,
  ${featureName}Request
} from './types'

const endpoints = {
  ${getDataFunctionName}: '${featureName}/GetData',
} as const

const USE_DUMMY_DATA = true

export function ${hookName}() {
  const ${getDataFunctionName} = (payload: ${featureName}Request) =>
    USE_DUMMY_DATA
      ? ${dataConstName}
      : useQuery([endpoints.${getDataFunctionName}, payload], () => 
          fetch(endpoints.${getDataFunctionName}, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(res => res.json())
        ) as UseQueryResult<${featureName}DataResponse, Error>

  return {
    ${getDataFunctionName}
  }
}`;
}

export function generateTypes(featureName: string, rowInterface: string) {
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

export function generateRowInterface(
  featureName: string,
  sampleRow: Record<string, any>
): string {
  if (Object.keys(sampleRow).length === 0) {
    return `export interface ${featureName}Row {
  // Define your row structure here
}`;
  }

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

  return `export interface ${featureName}Row {
${properties}
}`;
}
