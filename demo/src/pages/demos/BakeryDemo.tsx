import { useMemo, useEffect, useState } from 'react';
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr';
import { bakeryProducts } from './BakeryDemo.data';
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors';
import { ICellRendererParams, GetRowIdParams } from 'ag-grid-community';

type Product = {
  ProductId: string;
  BaseCost: number;
  IngredientsCost: number;
  FinalPrice: number;
  IsAvailable: boolean;
};

const columnDefs = [
  {
    field: 'ProductId',
    headerName: 'Product ID',
    width: 120,
  },
  {
    field: 'Name',
    headerName: 'Product Name',
    resizable: true,
    width: 200,
  },
  {
    field: 'Category',
    headerName: 'Category',
    width: 120,
    isBulkEditable: true,
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      propKey: 'Category',
      options: [
        { Value: 'Breads', Text: 'Breads' },
        { Value: 'Pastries', Text: 'Pastries' },
        { Value: 'Cakes', Text: 'Cakes' },
        { Value: 'Cookies', Text: 'Cookies' },
        { Value: 'Muffins', Text: 'Muffins' },
      ],
    },
  },
  {
    field: 'Description',
    headerName: 'Description',
    resizable: true,
    width: 300,
  },
  {
    field: 'BaseCost',
    headerName: 'Base Cost',
    width: 120,
    cellRenderer: (params: ICellRendererParams<Product>) => `$${params.value?.toFixed(2)}`,
  },
  {
    field: 'IngredientsCost',
    headerName: 'Ingredients Cost',
    width: 140,
    cellRenderer: (params: ICellRendererParams<Product>) => `$${params.value?.toFixed(2)}`,
  },
  {
    field: 'PricingFormula',
    headerName: 'Pricing Formula',
    resizable: true,
    width: 350,
  },
  {
    field: 'FinalPrice',
    headerName: 'Final Price',
    width: 120,
    cellRenderer: (params: ICellRendererParams<Product>) => `$${params.value?.toFixed(2)}`,
  },
  {
    field: 'IsAvailable',
    headerName: 'Status',
    width: 120,
    cellRenderer: (params: ICellRendererParams<Product>) =>
      params.value ? 'Available' : 'Out of Stock',
    isBulkEditable: true,
    bulkCellEditor: BulkSelectEditor,
    bulkCellEditorParams: {
      propKey: 'IsAvailable',
      options: [
        { Value: true, Text: 'Available' },
        { Value: false, Text: 'Out of Stock' },
      ],
    },
  },
];

export function BakeryDemo() {
  const storageKey = 'bakery-demo-grid';
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false);

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: GetRowIdParams<Product>) => params.data.ProductId,
    }),
    []
  );

  const controlBarProps = useMemo(
    () => ({
      title: 'Bakery Products - Formula-Based Pricing',
      hideActiveFilters: false,
    }),
    []
  );

  const updateEP = async () => {
    return Promise.resolve();
  };

  /* MCP Theme Script */
  // Set BP theme for this demo (follows ControlPanel pattern)
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('TYPE_OF_THEME', 'BP');
    }
  }, []);
  /* End MCP Theme Script */

  return (
    <Vertical height="100%">
      <GraviGrid
        storageKey={storageKey}
        rowData={bakeryProducts}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        updateEP={updateEP}
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={setIsBulkChangeVisible}
      />
    </Vertical>
  );
}
