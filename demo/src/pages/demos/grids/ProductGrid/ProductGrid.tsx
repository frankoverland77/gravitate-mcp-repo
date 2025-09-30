import React, { useMemo, useEffect } from 'react';
import { GraviGrid, BBDTag,  } from '@gravitate-js/excalibrr';
import { useProductFormula } from '@contexts/ProductFormulaContext'
import {SearchableSelect} from "@components/shared/Grid/cellEditors/SelectCellEditor";

export function ProductGrid() {
    const { products, formulas, applyFormulaToProducts, removeFormulaFromProduct } = useProductFormula();

    // Create formula options for dropdown
    const formulaOptions = useMemo(() => {
        const options = formulas.map(formula => ({
            value: formula.id,
            label: formula.name
        }));

        // Add "No Formula" option
        options.unshift({
            value: null,
            label: "No Formula"
        });

        return options;
    }, [formulas]);

    // Handle formula change for a product
    const handleFormulaChange = (formulaId: string | null, productData: any) => {
        if (formulaId) {
            applyFormulaToProducts(formulaId, [productData.ProductId]);
        } else {
            removeFormulaFromProduct(productData.ProductId);
        }
    };

    // Get formula name for display
    const getFormulaName = (product: any) => {
        if (product.appliedFormulaId) {
            const formula = formulas.find(f => f.id === product.appliedFormulaId);
            return formula ? formula.name : "Unknown Formula";
        }
        return "No Formula";
    };

    const columnDefs = useMemo(() => [
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
            "field": "appliedFormulaId",
            "headerName": "Pricing Formula",
            "resizable": true,
            "width": 350,
            "editable": true,
            "cellRenderer": (params: any) => getFormulaName(params.data),
            "cellEditor": SearchableSelect,
            "cellEditorParams": (params: any) => ({
                options: formulaOptions,
                onChange: (value: string | null) => handleFormulaChange(value, params.data),
                closeOnBlur: true,
                showSearch: true,
                value: params.data.appliedFormulaId
            })
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
            "cellRenderer": (params: any) => (
                <BBDTag warning={!params.value} style={{ width: 'fit-content' }}>
                    {params.value ? "Available" : "Out of Stock"}
                </BBDTag>
            )
        }
    ], [formulaOptions, formulas]);
    const storageKey = 'productgrid-grid';

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
                rowData={products}
                columnDefs={columnDefs}
                agPropOverrides={agPropOverrides}
                controlBarProps={controlBarProps}
                updateEP={updateEP}
            />
        </div>
    );
}