import { promises as fs } from "fs";
import { 
  validateGridDemo, 
  addReactHook, 
  findReturnStatement, 
  ensureNumberCellEditorImport, 
  createToolResponse, 
  handleToolError,
  DemoError 
} from "../utils/demoUtils.js";
import { 
  generateColumnDefinition, 
  insertColumnIntoArray, 
  findColumnDefinition, 
  formatPropertyValue,
  isNumberColumn 
} from "../utils/columnUtils.js";

interface ModifyGridArgs {
  demoName: string;
  action: "add_column" | "modify_column" | "add_renderer" | "change_props" | "make_editable";
  config: any;
}

/**
 * Modifies an existing grid demo by updating the TSX file
 *
 * This tool allows iterative changes to grids:
 * - Add new columns
 * - Modify existing columns
 * - Add custom cell renderers
 * - Change grid properties
 * - Make columns editable
 */
export async function modifyGridTool(args: ModifyGridArgs) {
  const { demoName, action, config } = args;

  try {
    const { path: demoPath, content: tsxContent } = await validateGridDemo(demoName);

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
        updatedContent = await modifyColumnInGrid(tsxContent, {
          field: config.field,
          updates: { editable: config.editable || true }
        });
        break;
      default:
        throw new DemoError(`Unknown action: ${action}`);
    }

    // Write the updated content back
    await fs.writeFile(demoPath, updatedContent);

    return createToolResponse(`Modified ${demoName} grid: ${action}`, demoName);

  } catch (error) {
    return handleToolError(`Modify ${demoName} grid (${action})`, error);
  }
}

/**
 * Add a new column to the grid using utilities
 */
async function addColumnToGrid(tsxContent: string, config: any): Promise<string> {
  const { field, headerName, type, width, cellRenderer, editable } = config;

  let updatedContent = tsxContent;

  // Generate the new column definition
  const newColumnStr = generateColumnDefinition({ 
    field, 
    headerName, 
    type, 
    width, 
    editable, 
    cellRenderer 
  });

  // Add NumberCellEditor import if needed for editable number columns
  if (editable && isNumberColumn(field, type)) {
    updatedContent = ensureNumberCellEditorImport(updatedContent);
  }

  // Insert the column into the array
  updatedContent = insertColumnIntoArray(updatedContent, newColumnStr);

  // Log reminder if editable not specified
  if (editable === undefined) {
    console.log(`Note: 'editable' not specified for column '${field}'. Column will be read-only by default.`);
  }

  return updatedContent;
}

/**
 * Modify an existing column in the grid
 */
async function modifyColumnInGrid(tsxContent: string, config: any): Promise<string> {
  const { field, updates } = config;

  let updatedContent = tsxContent;

  // Find the column definition
  const { match: columnMatch } = findColumnDefinition(updatedContent, field);
  let updatedColumn = columnMatch;

  // Apply each update
  for (const [key, value] of Object.entries(updates)) {
    const keyRegex = new RegExp(`"${key}"\\s*:\\s*[^,}]+`);
    const newValue = formatPropertyValue(key, value);

    if (keyRegex.test(updatedColumn)) {
      // Replace existing property
      updatedColumn = updatedColumn.replace(keyRegex, newValue);
    } else {
      // Add new property before the closing brace
      const insertPos = updatedColumn.lastIndexOf('}');
      // Check if there's already a trailing comma, if not add one to the previous line
      let beforeInsert = updatedColumn.substring(0, insertPos);
      const afterInsert = updatedColumn.substring(insertPos);
      
      // Ensure proper comma placement
      if (!beforeInsert.trim().endsWith(',')) {
        // Find the last property and add comma after it
        beforeInsert = beforeInsert.replace(/(["\w\d)]+)\s*$/m, '$1,');
      }
      
      updatedColumn = beforeInsert + `\n        ${newValue}` + afterInsert;
    }
    
    // Handle special case for NumberCellEditor
    if (key === 'cellEditor' && value === 'NumberCellEditor' && !updatedContent.includes('NumberCellEditor')) {
      updatedContent = ensureNumberCellEditorImport(updatedContent);
    }
  }

  return updatedContent.replace(columnMatch, updatedColumn);
}

/**
 * Add a custom cell renderer to a column
 */
async function addRendererToGrid(tsxContent: string, config: any): Promise<string> {
  const { field, renderer } = config;

  return modifyColumnInGrid(tsxContent, {
    field,
    updates: { cellRenderer: renderer },
  });
}

/**
 * Change grid properties (placeholder for future implementation)
 */
async function changeGridProps(tsxContent: string, config: any): Promise<string> {
  // This would modify the GraviGrid props in the React component
  // For now, return unchanged - this is more complex and would need AST parsing
  console.log("Grid props change not yet implemented:", config);
  return tsxContent;
}