import { promises as fs } from "fs";
import path from "path";

interface ModifyGridArgs {
  demoName: string;
  action: "add_column" | "modify_column" | "add_renderer" | "change_props" | "make_editable";
  config: any;
}

/**
 * Simplified version of modifyGrid that works with string manipulation
 * instead of trying to parse TypeScript as JSON
 */
export async function modifyGridTool(args: ModifyGridArgs) {
  const { demoName, action, config } = args;

  // Align with createDemo tool - demos are in demo/src/pages/demos/
  const demoPath = path.join(process.cwd(), "demo", "src", "pages", "demos", `${demoName}.tsx`);

  // Check if demo exists
  try {
    await fs.access(demoPath);
  } catch {
    throw new Error(
      `Demo '${demoName}' not found at ${demoPath}. Create it first with create_demo.`
    );
  }

  // Read the current TSX file
  const tsxContent = await fs.readFile(demoPath, "utf-8");

  let updatedContent: string;

  switch (action) {
    case "add_column":
      updatedContent = await addColumnToGrid(tsxContent, config);
      break;
    case "modify_column":
      updatedContent = await modifyColumnInGrid(tsxContent, config);
      break;
    case "add_renderer":
      updatedContent = await addRendererToGrid(tsxContent, config);
      break;
    case "change_props":
      updatedContent = await changeGridProps(tsxContent, config);
      break;
    case "make_editable":
      // Handle make_editable as a special case of modify_column
      updatedContent = await makeColumnEditable(tsxContent, config);
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }

  // Write the updated content back
  await fs.writeFile(demoPath, updatedContent);

  return {
    content: [
      {
        type: "text",
        text: `✅ Modified ${demoName} grid: ${action}

🔄 Changes applied successfully
📁 Location: ./demo/src/pages/demos/${demoName}.tsx

The demo will hot-reload automatically if the dev server is running.`,
      },
    ],
  };
}

/**
 * Add a new column to the grid using string manipulation
 */
async function addColumnToGrid(
  tsxContent: string,
  config: any
): Promise<string> {
  const { field, headerName, type, width, cellRenderer, editable } = config;

  // Find the end of columnDefs array (look for the last closing brace before the closing bracket)
  const columnDefsMatch = tsxContent.match(/const columnDefs\s*=\s*\[([\s\S]*?)\];/);
  if (!columnDefsMatch) {
    throw new Error("Could not find columnDefs in the demo file");
  }

  // Create new column definition as a string
  let newColumn = `    {\n`;
  newColumn += `        "field": "${field}",\n`;
  newColumn += `        "headerName": "${headerName}"`;
  
  if (width) {
    newColumn += `,\n        "width": ${width}`;
  }
  
  // Check if this is a number column
  const isNumberColumn = type === 'number' || 
    field.toLowerCase().includes('price') || 
    field.toLowerCase().includes('quantity') || 
    field.toLowerCase().includes('amount') ||
    field.toLowerCase().includes('value');
  
  // Auto-add number filter for number columns
  if (isNumberColumn) {
    newColumn += `,\n        "filter": "agNumberColumnFilter"`;
  }
  
  // Handle editable configuration
  if (editable !== undefined) {
    if (editable && isNumberColumn) {
      // For editable number columns, add NumberCellEditor
      newColumn += `,\n        "cellEditor": NumberCellEditor`;
      newColumn += `,\n        "editable": true`;
      
      // Ensure NumberCellEditor is imported
      if (!tsxContent.includes('NumberCellEditor')) {
        tsxContent = tsxContent.replace(
          /import { GraviGrid } from '@gravitate-js\/excalibrr';/,
          `import { GraviGrid } from '@gravitate-js/excalibrr';\nimport { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor';`
        );
      }
    } else {
      newColumn += `,\n        "editable": ${editable}`;
    }
  }
  
  if (cellRenderer && typeof cellRenderer === 'string') {
    // If it's a function string, add it without quotes
    if (cellRenderer.includes('=>') || cellRenderer.includes('function')) {
      newColumn += `,\n        "cellRenderer": ${cellRenderer}`;
    } else {
      newColumn += `,\n        "cellRenderer": "${cellRenderer}"`;
    }
  }
  
  newColumn += `\n    }`;

  // Insert the new column before the closing bracket of columnDefs
  const insertPosition = columnDefsMatch[0].lastIndexOf(']');
  const beforeBracket = columnDefsMatch[0].substring(0, insertPosition);
  const afterBracket = columnDefsMatch[0].substring(insertPosition);
  
  // Add comma after the last column if there are existing columns
  const hasExistingColumns = beforeBracket.includes('{');
  const newColumnDefs = hasExistingColumns 
    ? `${beforeBracket},\n${newColumn}${afterBracket}`
    : `${beforeBracket}\n${newColumn}${afterBracket}`;
  
  return tsxContent.replace(columnDefsMatch[0], newColumnDefs);
}

/**
 * Modify an existing column in the grid
 */
async function modifyColumnInGrid(
  tsxContent: string,
  config: any
): Promise<string> {
  const { field, updates } = config;

  // Find the column definition for the specified field
  const columnRegex = new RegExp(
    `{[^}]*"field"\\s*:\\s*"${field}"[^}]*}`,
    's'
  );
  
  const columnMatch = tsxContent.match(columnRegex);
  if (!columnMatch) {
    throw new Error(`Column '${field}' not found`);
  }

  let updatedColumn = columnMatch[0];

  // Apply each update
  for (const [key, value] of Object.entries(updates)) {
    const keyRegex = new RegExp(`"${key}"\\s*:\\s*[^,}]+`);
    
    let newValue: string;
    if (typeof value === 'string') {
      // Check if it's a function or reference
      if (value.includes('=>') || value.includes('function') || /^[A-Z]/.test(value)) {
        newValue = `"${key}": ${value}`;
      } else {
        newValue = `"${key}": "${value}"`;
      }
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      newValue = `"${key}": ${value}`;
    } else {
      newValue = `"${key}": ${JSON.stringify(value)}`;
    }

    if (keyRegex.test(updatedColumn)) {
      // Replace existing property
      updatedColumn = updatedColumn.replace(keyRegex, newValue);
    } else {
      // Add new property before the closing brace
      const insertPos = updatedColumn.lastIndexOf('}');
      updatedColumn = updatedColumn.substring(0, insertPos) + 
        `,\n        ${newValue}` + 
        updatedColumn.substring(insertPos);
    }
  }

  return tsxContent.replace(columnMatch[0], updatedColumn);
}

/**
 * Add a custom cell renderer to a column
 */
async function addRendererToGrid(
  tsxContent: string,
  config: any
): Promise<string> {
  const { field, renderer } = config;

  return modifyColumnInGrid(tsxContent, {
    field,
    updates: { cellRenderer: renderer },
  });
}

/**
 * Make a column editable
 */
async function makeColumnEditable(
  tsxContent: string,
  config: any
): Promise<string> {
  const { field, editable = true } = config;
  
  // Check if it's a number field
  const isNumberField = field.toLowerCase().includes('price') || 
    field.toLowerCase().includes('quantity') || 
    field.toLowerCase().includes('amount') ||
    field.toLowerCase().includes('value');
  
  const updates: any = { editable };
  
  if (editable && isNumberField) {
    updates.cellEditor = 'NumberCellEditor';
    
    // Ensure NumberCellEditor is imported
    if (!tsxContent.includes('NumberCellEditor')) {
      tsxContent = tsxContent.replace(
        /import { GraviGrid } from '@gravitate-js\/excalibrr';/,
        `import { GraviGrid } from '@gravitate-js/excalibrr';\nimport { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor';`
      );
    }
  }
  
  return modifyColumnInGrid(tsxContent, { field, updates });
}

/**
 * Change grid properties
 */
async function changeGridProps(
  tsxContent: string,
  config: any
): Promise<string> {
  // This would modify the GraviGrid props in the React component
  // For now, return unchanged - this is more complex and would need more sophisticated parsing
  console.log("Grid props change not yet implemented:", config);
  return tsxContent;
}