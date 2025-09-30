import React, { useMemo, useEffect } from 'react';
import { GraviGrid } from '@gravitate-js/excalibrr';
import { bakeryProducts } from './BakeryDemo.data';

const columnDefs = [
    {
        "field": "ProductId",
        "headerName": "Product ID",
        "width": 120
    },
    {
        "field": "Name",
        "headerName": "Product Name",
        "resizable": true,
        "width": 200
    },
    {
        "field": "Category",
        "headerName": "Category",
        "width": 120
    },
    {
        "field": "Description",
        "headerName": "Description",
        "resizable": true,
        "width": 300
    },
    {
        "field": "BaseCost",
        "headerName": "Base Cost",
        "width": 120,
        "cellRenderer": (params: any) => `$${params.value.toFixed(2)}`
    },
    {
        "field": "IngredientsCost",
        "headerName": "Ingredients Cost",
        "width": 140,
        "cellRenderer": (params: any) => `$${params.value.toFixed(2)}`
    },
    {
        "field": "PricingFormula",
        "headerName": "Pricing Formula",
        "resizable": true,
        "width": 350
    },
    {
        "field": "FinalPrice",
        "headerName": "Final Price",
        "width": 120,
        "cellRenderer": (params: any) => `$${params.value.toFixed(2)}`
    },
    {
        "field": "IsAvailable",
        "headerName": "Status",
        "width": 120,
        "cellRenderer": (params: any) => params.value ? "Available" : "Out of Stock"
    }
];

export function BakeryDemo() {
  const storageKey = 'bakery-demo-grid';
  
  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.ProductId,
  }), []);
  
  const controlBarProps = useMemo(() => ({
    title: 'Bakery Products - Formula-Based Pricing',
    hideActiveFilters: false,
  }), []);
  
  const updateEP = async (params: any) => {
    // Empty function for now - will handle updates
    console.log('Update called with:', params);
    return Promise.resolve();
  };
  
  /* MCP Theme Script */
  // Set BP theme for this demo (follows ControlPanel pattern)
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
        rowData={bakeryProducts}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        updateEP={updateEP}
      />
    </div>
  );
}