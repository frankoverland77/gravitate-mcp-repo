interface GridTemplateArgs {
  name: string;
  title: string;
  columns: Array<{
    field: string;
    headerName: string;
    type?: string;
    width?: number;
  }>;
  theme: string;
  sampleData: any[];
}

/**
 * Generates a React component using real Excalibrr GraviGrid
 *
 * This template:
 * - Uses real @gravitate-js/excalibrr imports
 * - Follows production patterns from our examples
 * - Includes proper column definitions
 * - Sets up realistic sample data
 */
export function gridTemplate({
  name,
  title,
  columns,
  theme,
  sampleData,
}: GridTemplateArgs): string {
  // Generate column definitions using real Excalibrr patterns
  const columnDefs = columns.map((col) => {
    const colDef: any = {
      field: col.field,
      headerName: col.headerName,
    };

    // Add type-specific configurations
    switch (col.type) {
      case "dateColumn":
        colDef.type = "dateColumn";
        colDef.valueFormatter =
          "(params) => params.value ? new Date(params.value).toLocaleDateString() : ''";
        break;
    }

    // Add special renderers for common fields
    if (col.field === "status") {
      colDef.cellRenderer = `(params) => {
        const status = params.value;
        const type = status === 'Active' ? 'success' : status === 'Inactive' ? 'error' : 'warning';
        return React.createElement('span', { 
          className: \`status-badge status-\${type}\`,
          style: {
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#fff3cd',
            color: type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#856404'
          }
        }, status);
      }`;
    }

    return colDef;
  });

  return `
        // Import real Excalibrr components
        import React, { useMemo } from 'react';
        import { GraviGrid } from '@gravitate-js/excalibrr';
        import { mockData } from './${name}.data';
        
        export function ${name}() {
          const storageKey = '${name.toLowerCase()}-grid';
          
          const columnDefs = useMemo(() => columnDefs(), []);
          
          const agPropOverrides = useMemo(() => ({
            getRowId: (params) => params.data.id,
          }), []);
          
          const controlBarProps = useMemo(() => ({
            title: '${title}',
            hideActiveFilters: false,
          }), []);
          
          return (
            <div style={{ height: '100%' }}>
              <GraviGrid
                storageKey={storageKey}
                rowData={mockData}
                columnDefs={columnDefs}
                agPropOverrides={agPropOverrides}
                controlBarProps={controlBarProps}
              />
            </div>
          );
        }
  `;
}
