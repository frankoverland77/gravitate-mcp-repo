import { promises as fs } from "fs";
import path from "path";

interface ModifyGridArgs {
  demoName: string;
  action: "add_column" | "modify_column" | "add_renderer" | "change_props" | "make_editable";
  config: any;
}

/**
 * Modifies an existing grid demo by updating the HTML file
 *
 * This tool allows iterative changes to grids:
 * - Add new columns
 * - Modify existing columns
 * - Add custom cell renderers
 * - Change grid properties
 */
export async function modifyGridTool(args: ModifyGridArgs) {
  const { demoName, action, config } = args;

  const demoPath = path.join(process.cwd(), "demos", demoName);
  const indexPath = path.join(demoPath, "index.html");

  // Check if demo exists
  try {
    await fs.access(demoPath);
  } catch {
    throw new Error(
      `Demo '${demoName}' not found. Create it first with create_demo.`
    );
  }

  // Read the current HTML file
  const htmlContent = await fs.readFile(indexPath, "utf-8");

  let updatedContent: string;

  switch (action) {
    case "add_column":
      updatedContent = await addColumnToGrid(htmlContent, config);
      break;
    case "modify_column":
      updatedContent = await modifyColumnInGrid(htmlContent, config);
      break;
    case "add_renderer":
      updatedContent = await addRendererToGrid(htmlContent, config);
      break;
    case "change_props":
      updatedContent = await changeGridProps(htmlContent, config);
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }

  // Write the updated content back
  await fs.writeFile(indexPath, updatedContent);

  return {
    content: [
      {
        type: "text",
        text: `✅ Modified ${demoName} grid: ${action}

🔄 Changes applied successfully
📁 Location: ./demos/${demoName}

The demo will hot-reload automatically if the dev server is running.`,
      },
    ],
  };
}

/**
 * Add a new column to the grid
 */
async function addColumnToGrid(
  htmlContent: string,
  config: any
): Promise<string> {
  const { field, headerName, type, width, cellRenderer, editable } = config;

  // Find the columnDefs array in the HTML
  const columnDefsMatch = htmlContent.match(
    /const columnDefs = (\[[\s\S]*?\]);/
  );
  if (!columnDefsMatch) {
    throw new Error("Could not find columnDefs in the demo file");
  }

  // Parse the existing column definitions
  const existingColumnDefs = eval(columnDefsMatch[1]);

  // Create new column definition
  const newColumn: any = {
    field,
    headerName,
  };

  if (width) newColumn.width = width;
  if (type) newColumn.type = type;
  if (cellRenderer) newColumn.cellRenderer = cellRenderer;
  
  // Check if this is a number column (but not IDs)
  const isNumberColumn = type === 'number' || field.toLowerCase().includes('price') || 
      field.toLowerCase().includes('quantity') || field.toLowerCase().includes('amount') ||
      field.toLowerCase().includes('value');
  
  // Auto-add number filter for number columns
  if (isNumberColumn) {
    newColumn.filter = 'agNumberColumnFilter';
  }
  
  // Handle editable configuration
  if (editable !== undefined) {
    newColumn.editable = editable;
    // If editable and number column, add NumberCellEditor
    if (editable && isNumberColumn) {
      newColumn.cellEditor = 'NumberCellEditor';
    }
  } else {
    // If editable not specified, log a reminder
    console.log(`Note: 'editable' not specified for column '${field}'. Column will be read-only by default.`);
  }

  // Add the new column
  existingColumnDefs.push(newColumn);

  // Replace in HTML
  const newColumnDefsStr = JSON.stringify(existingColumnDefs, null, 8);
  return htmlContent.replace(
    /const columnDefs = \[[\s\S]*?\];/,
    `const columnDefs = ${newColumnDefsStr};`
  );
}

/**
 * Modify an existing column in the grid
 */
async function modifyColumnInGrid(
  htmlContent: string,
  config: any
): Promise<string> {
  const { field, updates } = config;

  // Find the columnDefs array
  const columnDefsMatch = htmlContent.match(
    /const columnDefs = (\[[\s\S]*?\]);/
  );
  if (!columnDefsMatch) {
    throw new Error("Could not find columnDefs in the demo file");
  }

  // Parse and update column definitions
  const columnDefs = eval(columnDefsMatch[1]);
  const columnIndex = columnDefs.findIndex((col: any) => col.field === field);

  if (columnIndex === -1) {
    throw new Error(`Column '${field}' not found`);
  }

  // Apply updates
  Object.assign(columnDefs[columnIndex], updates);

  // Replace in HTML
  const newColumnDefsStr = JSON.stringify(columnDefs, null, 8);
  return htmlContent.replace(
    /const columnDefs = \[[\s\S]*?\];/,
    `const columnDefs = ${newColumnDefsStr};`
  );
}

/**
 * Add a custom cell renderer to a column
 */
async function addRendererToGrid(
  htmlContent: string,
  config: any
): Promise<string> {
  const { field, renderer } = config;

  return modifyColumnInGrid(htmlContent, {
    field,
    updates: { cellRenderer: renderer },
  });
}

/**
 * Change grid properties
 */
async function changeGridProps(
  htmlContent: string,
  config: any
): Promise<string> {
  // This would modify the GraviGrid props in the React.createElement call
  // For now, return unchanged - this is more complex and would need AST parsing
  console.log("Grid props change not yet implemented:", config);
  return htmlContent;
}
