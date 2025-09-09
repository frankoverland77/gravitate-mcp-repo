import React, { useMemo } from "react";
import { GraviGrid, Horizontal } from "@gravitate-js/excalibrr";
import { mockData } from "./ProductGrid.data";
import { ColDef } from "ag-grid-community";
import { Switch } from "antd";
import { NumberCellEditor } from "@components/shared/Grid/cellEditors/NumberCellEditor";

export function ProductGrid() {
  const storageKey = "productgrid-grid";

  const columnDefs = useMemo(
    () =>
      [
        {
          field: "ProductId",
          headerName: "ID",
        },
        {
          field: "Name",
          headerName: "Product Name",
        },
        {
          field: "Abbreviation",
          headerName: "Code",
        },
        {
          field: "Commodity",
          headerName: "Commodity",
        },
        {
          field: "Grade",
          headerName: "Grade",
        },
        {
          field: "Price",
          headerName: "Price",
          filter: "agNumberColumnFilter",
          valueFormatter: (params: any) =>
            params.value ? `$${params.value.toFixed(2)}` : "",
          cellEditor: NumberCellEditor,
        },
        {
          field: "volumeAvailable",
          headerName: "Volume Available",
          filter: "agNumberColumnFilter",
          editable: true,
          cellEditor: NumberCellEditor,
          valueFormatter: (params: any) =>
            params.value ? `${params.value.toLocaleString()} gal` : "",
        },
        {
          field: "IsActive",
          headerName: "Status",
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <Horizontal>
                <Switch
                  checked={params.value}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  onChange={(checked) => {
                    params.setValue(checked);
                  }}
                />
              </Horizontal>
            );
          },
        },
      ] as ColDef[],
    []
  );

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.ProductId,
    }),
    []
  );

  const controlBarProps = useMemo(
    () => ({
      title: "Product Grid",
      hideActiveFilters: false,
    }),
    []
  );

  const updateEP = async (params: any) => {
    // Empty function for now - will handle updates
    console.log("Update called with:", params);
    return Promise.resolve();
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
