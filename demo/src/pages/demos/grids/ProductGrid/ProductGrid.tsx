import { useMemo, useEffect, useState, useCallback } from 'react';
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr';
import { useProductFormula } from '@contexts/ProductFormulaContext';
import { getProductGridColumnDefs } from './ProductGrid.columnDefs';
import { GetRowIdParams } from 'ag-grid-community';

type Product = {
  ProductId: string;
  appliedFormulaId?: string;
};

export function ProductGrid() {
  const { products, formulas, applyFormulaToProducts, removeFormulaFromProduct, updateProducts } =
    useProductFormula();
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false);

  // Create formula options for dropdown
  const formulaOptions = useMemo(() => {
    const options: Array<{ value: string | null; label: string }> = formulas.map((formula) => ({
      value: formula.id,
      label: formula.name,
    }));

    // Add "No Formula" option
    options.unshift({
      value: null,
      label: 'No Formula',
    });

    return options;
  }, [formulas]);

  // Handle formula change for a product
  const handleFormulaChange = useCallback(
    (formulaId: string | null, productData: Product) => {
      if (formulaId) {
        applyFormulaToProducts(formulaId, [productData.ProductId]);
      } else {
        removeFormulaFromProduct(productData.ProductId);
      }
    },
    [applyFormulaToProducts, removeFormulaFromProduct]
  );

  // Get formula name for display
  const getFormulaName = useCallback(
    (product: Product) => {
      if (product.appliedFormulaId) {
        const formula = formulas.find((f) => f.id === product.appliedFormulaId);
        return formula ? formula.name : 'Unknown Formula';
      }
      return 'No Formula';
    },
    [formulas]
  );

  const columnDefs = useMemo(
    () => getProductGridColumnDefs({ formulaOptions, getFormulaName, handleFormulaChange }),
    [formulaOptions, getFormulaName, handleFormulaChange]
  );
  const storageKey = 'productgrid-grid';

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: GetRowIdParams<Product>) => params.data.ProductId,
      rowSelection: 'multiple' as const,
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

  const updateEP = async (rows: Product | Product[]) => {
    const updatedRows = Array.isArray(rows) ? rows : [rows];
    updateProducts(updatedRows);
    return Promise.resolve();
  };

  /* MCP Theme Script */
  // Set PE theme for this demo (follows ControlPanel pattern)
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
        rowData={products}
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
