import React, { useMemo } from 'react';
import { GraviGrid } from '@gravitate-js/excalibrr';
import { mockData } from './InventoryGrid.data';
import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor';

const columnDefs = [
    {
        "field": "LoadNumber",
        "headerName": "Load Number"
    },
    {
        "field": "ProductName",
        "headerName": "Product",
        "resizable": true
    ,
        "editable": true},
    {
        "field": "Quantity",
        "headerName": "Quantity",
        "filter": "agNumberColumnFilter",
        "cellEditor": NumberCellEditor,
        "editable": true
    },
    {
        "field": "LocationName",
        "headerName": "Location"
    },
    {
        "field": "IsActive",
        "headerName": "Status",
        "cellRenderer": (params: any) => params.value ? "Active" : "Inactive"
    }
];

export function InventoryGrid() {
  const storageKey = 'inventorygrid-grid';
  
  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => params.data.LoadNumber,
  }), []);
  
  const controlBarProps = useMemo(() => ({
    title: 'Inventory Grid',
    hideActiveFilters: false,
  }), []);
  
  const updateEP = async (params: any) => {
    // Empty function for now - will handle updates
    console.log('Update called with:', params);
    return Promise.resolve();
  };
  
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