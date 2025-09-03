import React, { useMemo } from "react";
import { GraviGrid } from "@gravitate-js/excalibrr";
import { mockData } from "./ProductGrid.data";
import { ColDef } from "ag-grid-community";

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
          resizable: true,
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
          field: "IsActive",
          headerName: "Status",
          cellRenderer: (params: any) => (params.value ? "Active" : "Inactive"),
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

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
