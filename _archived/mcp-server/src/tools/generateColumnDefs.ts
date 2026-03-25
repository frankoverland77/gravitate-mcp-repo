/**
 * generate_column_defs - Create AG Grid column definitions from data schema
 *
 * Accepts:
 * - TypeScript interface definition (as string)
 * - Sample data object
 * - Field list with types
 *
 * Generates:
 * - Complete ColDef array with proper filters, formatters, and types
 */

interface Field {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "array" | "object";
  headerName?: string;
  editable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  minWidth?: number;
  isStatus?: boolean;
  isAction?: boolean;
  format?: "currency" | "percent" | "date" | "datetime";
}

interface GenerateColumnDefsArgs {
  // Option 1: Provide fields directly
  fields?: Field[];

  // Option 2: Provide TypeScript interface as string
  interfaceDefinition?: string;

  // Option 3: Provide sample data object
  sampleData?: Record<string, any>;

  // Options
  includeActions?: boolean;
  dataTypeName?: string;
  raw?: boolean;
}

export async function generateColumnDefsTool(args: GenerateColumnDefsArgs) {
  const {
    fields,
    interfaceDefinition,
    sampleData,
    includeActions = true,
    dataTypeName = "RowData",
    raw = false,
  } = args;

  try {
    let parsedFields: Field[] = [];

    // Parse fields from different sources
    if (fields && fields.length > 0) {
      parsedFields = fields;
    } else if (interfaceDefinition) {
      parsedFields = parseTypeScriptInterface(interfaceDefinition);
    } else if (sampleData) {
      parsedFields = inferFieldsFromData(sampleData);
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ No input provided. Please provide one of:
- \`fields\`: Array of field definitions
- \`interfaceDefinition\`: TypeScript interface as string
- \`sampleData\`: Sample data object to infer types from

Example:
\`\`\`json
{
  "fields": [
    { "name": "Id", "type": "number" },
    { "name": "Name", "type": "string" },
    { "name": "Status", "type": "string", "isStatus": true },
    { "name": "CreatedAt", "type": "date" }
  ]
}
\`\`\`
`,
          },
        ],
        isError: true,
      };
    }

    // Generate column definitions
    const columnDefs = generateColumnDefs(
      parsedFields,
      includeActions,
      dataTypeName
    );

    if (raw) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ fields: parsedFields, columnDefs }, null, 2),
          },
        ],
      };
    }

    const result = `# Generated Column Definitions

## Detected Fields
${parsedFields.map((f) => `- \`${f.name}\`: ${f.type}${f.isStatus ? " (status)" : ""}${f.format ? ` (${f.format})` : ""}`).join("\n")}

## Column Definitions

\`\`\`tsx
import { ColDef } from 'ag-grid-community'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

interface ColumnDefsProps {
  onDelete: (id: number) => void
  onEdit?: (data: ${dataTypeName}) => void
}

export function ${dataTypeName.replace("Data", "")}ColumnDefs({ onDelete, onEdit }: ColumnDefsProps): ColDef[] {
  return [
${columnDefs}
  ]
}
\`\`\`

## Usage

\`\`\`tsx
const columnDefs = useMemo(
  () => ${dataTypeName.replace("Data", "")}ColumnDefs({
    onDelete: handleDelete,
    onEdit: handleEdit,
  }),
  [handleDelete, handleEdit]
)
\`\`\`
`;

    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error generating column definitions: ${error}`,
        },
      ],
      isError: true,
    };
  }
}

function parseTypeScriptInterface(interfaceDef: string): Field[] {
  const fields: Field[] = [];

  // Match property definitions like: PropertyName: type or PropertyName?: type
  const propRegex = /(\w+)\??\s*:\s*([^;\n]+)/g;
  let match;

  while ((match = propRegex.exec(interfaceDef)) !== null) {
    const name = match[1];
    const typeStr = match[2].trim();

    const field: Field = {
      name,
      type: inferTypeFromString(typeStr),
    };

    // Detect special fields
    if (name.toLowerCase() === "status") {
      field.isStatus = true;
    }
    if (
      name.toLowerCase().includes("date") ||
      name.toLowerCase().endsWith("at")
    ) {
      field.type = "date";
    }
    if (
      name.toLowerCase().includes("price") ||
      name.toLowerCase().includes("amount") ||
      name.toLowerCase().includes("cost")
    ) {
      field.format = "currency";
    }
    if (
      name.toLowerCase().includes("percent") ||
      name.toLowerCase().includes("rate")
    ) {
      field.format = "percent";
    }

    fields.push(field);
  }

  return fields;
}

function inferTypeFromString(typeStr: string): Field["type"] {
  const lower = typeStr.toLowerCase();

  if (lower === "number" || lower === "number | null") return "number";
  if (lower === "boolean" || lower === "boolean | null") return "boolean";
  if (lower.includes("date")) return "date";
  if (lower.includes("[]") || lower.startsWith("array")) return "array";
  if (lower.includes("{") || lower === "object") return "object";

  return "string";
}

function inferFieldsFromData(data: Record<string, any>): Field[] {
  const fields: Field[] = [];

  for (const [key, value] of Object.entries(data)) {
    const field: Field = {
      name: key,
      type: inferTypeFromValue(value),
    };

    // Detect special fields
    if (key.toLowerCase() === "status") {
      field.isStatus = true;
    }
    if (
      key.toLowerCase().includes("date") ||
      key.toLowerCase().endsWith("at")
    ) {
      field.type = "date";
    }
    if (
      key.toLowerCase().includes("price") ||
      key.toLowerCase().includes("amount")
    ) {
      field.format = "currency";
    }

    fields.push(field);
  }

  return fields;
}

function inferTypeFromValue(value: any): Field["type"] {
  if (value === null || value === undefined) return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";

  // Check if string looks like a date
  if (typeof value === "string") {
    if (
      /^\d{4}-\d{2}-\d{2}/.test(value) ||
      /^\d{2}\/\d{2}\/\d{4}/.test(value)
    ) {
      return "date";
    }
  }

  return "string";
}

function generateColumnDefs(
  fields: Field[],
  includeActions: boolean,
  dataTypeName: string
): string {
  const columns: string[] = [];

  for (const field of fields) {
    if (field.isAction) continue; // Skip action fields, we add them at the end

    const headerName =
      field.headerName || field.name.replace(/([A-Z])/g, " $1").trim();
    const minWidth = field.minWidth;

    let columnDef = `    {\n`;
    columnDef += `      headerName: '${headerName}',\n`;
    columnDef += `      field: '${field.name}',\n`;
    columnDef += `      sortable: ${field.sortable !== false},\n`;

    // Add filter based on type
    if (field.filterable !== false) {
      if (field.type === "number") {
        columnDef += `      filter: 'agNumberColumnFilter',\n`;
      } else if (field.type === "date") {
        columnDef += `      filter: 'agDateColumnFilter',\n`;
      } else {
        columnDef += `      filter: true,\n`;
      }
    }
    if (minWidth) {
      columnDef += `      minWidth: ${minWidth},\n`;
    }

    // Add value formatter or cell renderer
    if (field.type === "date") {
      columnDef += `      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',\n`;
    } else if (field.format === "currency") {
      columnDef += `      valueFormatter: (params) => params.value != null ? \`$\${params.value.toFixed(2)}\` : '',\n`;
    } else if (field.format === "percent") {
      columnDef += `      valueFormatter: (params) => params.value != null ? \`\${(params.value * 100).toFixed(1)}%\` : '',\n`;
    } else if (field.isStatus) {
      columnDef += `      cellRenderer: (params: { value: string }) => {
        const appearance = params.value === 'Active' ? 'success'
          : params.value === 'Inactive' ? 'error'
          : 'primary'
        return <Texto category='p2' appearance={appearance}>{params.value}</Texto>
      },\n`;
    }

    // Add editable if specified
    if (field.editable) {
      columnDef += `      editable: true,\n`;
      if (field.type === "number") {
        columnDef += `      cellEditor: 'agNumberCellEditor',\n`;
      }
    }

    columnDef += `    }`;
    columns.push(columnDef);
  }

  // Add actions column if requested
  if (includeActions) {
    columns.push(`    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: ${dataTypeName} }) => (
        <Horizontal style={{ gap: '8px' }}>
          {onEdit && (
            <GraviButton
              type='text'
              size='small'
              icon={<EditOutlined />}
              onClick={() => onEdit(params.data)}
            />
          )}
          <GraviButton
            type='text'
            size='small'
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(params.data.Id)}
          />
        </Horizontal>
      ),
    }`);
  }

  return columns.join(",\n");
}
