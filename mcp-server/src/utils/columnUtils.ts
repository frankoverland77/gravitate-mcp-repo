/**
 * Utilities for column manipulation in grid demos
 */

/**
 * Check if a field name indicates a number column
 */
export function isNumberColumn(field: string, type?: string): boolean {
  return type === 'number' || 
    field.toLowerCase().includes('price') || 
    field.toLowerCase().includes('quantity') || 
    field.toLowerCase().includes('amount') ||
    field.toLowerCase().includes('value');
}

/**
 * Find a specific column definition in TSX content
 */
export function findColumnDefinition(content: string, field: string): { match: string; index: number } {
  // Match a column object that contains this field
  const columnRegex = new RegExp(
    `{[^{}]*"field"\\s*:\\s*"${field}"[^{}]*}`,
    's'
  );
  
  const columnMatch = content.match(columnRegex);
  if (!columnMatch) {
    throw new Error(`Column '${field}' not found`);
  }

  return {
    match: columnMatch[0],
    index: content.indexOf(columnMatch[0])
  };
}

/**
 * Find the columnDefs array in TSX content
 */
export function findColumnDefsArray(content: string): { match: string; arrayContent: string } {
  const columnDefsMatch = content.match(/const columnDefs\s*=\s*\[([\s\S]*?)\];/);
  if (!columnDefsMatch) {
    throw new Error("Could not find columnDefs in the demo file");
  }

  return {
    match: columnDefsMatch[0],
    arrayContent: columnDefsMatch[1]
  };
}

/**
 * Format a property value for insertion into TSX
 */
export function formatPropertyValue(key: string, value: any): string {
  if (typeof value === 'string') {
    // Check if it's a function or a component reference (starts with capital letter)
    if (value.includes('=>') || value.includes('function') || /^[A-Z]/.test(value)) {
      return `"${key}": ${value}`;
    } else {
      return `"${key}": "${value}"`;
    }
  } else if (typeof value === 'boolean' || typeof value === 'number') {
    return `"${key}": ${value}`;
  } else {
    return `"${key}": ${JSON.stringify(value)}`;
  }
}

/**
 * Generate column definition string for insertion
 */
export function generateColumnDefinition(config: {
  field: string;
  headerName: string;
  type?: string;
  width?: number;
  editable?: boolean;
  cellRenderer?: string;
}): string {
  const { field, headerName, type, width, editable, cellRenderer } = config;
  
  let columnStr = `    {\n`;
  columnStr += `        "field": "${field}",\n`;
  columnStr += `        "headerName": "${headerName}"`;
  
  if (width) {
    columnStr += `,\n        "width": ${width}`;
  }
  
  // Auto-add number filter for number columns
  if (isNumberColumn(field, type)) {
    columnStr += `,\n        "filter": "agNumberColumnFilter"`;
  }
  
  // Handle editable configuration
  if (editable !== undefined) {
    columnStr += `,\n        "editable": ${editable}`;
    // If editable and number column, add NumberCellEditor
    if (editable && isNumberColumn(field, type)) {
      columnStr += `,\n        "cellEditor": NumberCellEditor`;
    }
  }
  
  if (cellRenderer && typeof cellRenderer === 'string') {
    // If it's a function string, add it without quotes
    if (cellRenderer.includes('=>') || cellRenderer.includes('function')) {
      columnStr += `,\n        "cellRenderer": ${cellRenderer}`;
    } else {
      columnStr += `,\n        "cellRenderer": "${cellRenderer}"`;
    }
  }
  
  columnStr += `\n    }`;
  return columnStr;
}

/**
 * Insert a new column into the columnDefs array
 */
export function insertColumnIntoArray(content: string, newColumnStr: string): string {
  const { match, arrayContent } = findColumnDefsArray(content);
  
  // Check if there are existing columns
  const hasExistingColumns = arrayContent.trim().length > 0;
  
  if (hasExistingColumns) {
    // Add comma after last existing column and then new column
    const updatedColumnDefs = `const columnDefs = [${arrayContent},\n${newColumnStr}\n];`;
    return content.replace(match, updatedColumnDefs);
  } else {
    // First column
    const updatedColumnDefs = `const columnDefs = [\n${newColumnStr}\n];`;
    return content.replace(match, updatedColumnDefs);
  }
}