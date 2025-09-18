import React, { useMemo, useEffect } from 'react';
import { GraviGrid } from '@gravitate-js/excalibrr';
import { mockData } from './ProductGrid.data';

const columnDefs = [
    {
        "field": "ProductId",
        "headerName": "ID"
    },
    {
        "field": "Name",
        "headerName": "Product Name",
        "resizable": true
    },
    {
        "field": "Abbreviation",
        "headerName": "Code"
    },
    {
        "field": "Commodity",
        "headerName": "Commodity"
    },
    {
        "field": "Grade",
        "headerName": "Grade"
    },
    {
        "field": "IsActive",
        "headerName": "Status",
        "cellRenderer": (params: any) => params.value ? "Active" : "Inactive"
    }
];

export function ProductGrid() {
  const storageKey = 'productgrid-grid';
  
  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.ProductId,
  }), []);
  
  const controlBarProps = useMemo(() => ({
    title: 'Product Grid',
    hideActiveFilters: false,
  }), []);
  
  const updateEP = async (params: any) => {
    // Empty function for now - will handle updates
    console.log('Update called with:', params);
    return Promise.resolve();
  };
  
  /* MCP Theme Script */
  // Set PE theme for this demo (follows ControlPanel pattern)
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
}