import React, { createContext, useContext, useState, ReactNode } from 'react';
import { bakeryProducts } from '../pages/demos/BakeryDemo.data';

interface Product {
  ProductId: string;
  Name: string;
  Description: string;
  Category: string;
  BaseCost: number;
  IngredientsCost: number;
  PricingFormula: string;
  FormulaNote: string;
  FinalPrice: number;
  IsAvailable: boolean;
  appliedFormulaId?: string;
}

interface Formula {
  id: string;
  name: string;
  formula: string;
  folder: string;
}

interface ProductFormulaContextType {
  products: Product[];
  formulas: Formula[];
  setFormulas: (formulas: Formula[]) => void;
  applyFormulaToProducts: (formulaId: string, productIds: string[]) => void;
  removeFormulaFromProduct: (productId: string) => void;
  calculateProductPrice: (product: Product, formulaText: string) => number;
  getProductsWithFormula: (formulaId: string) => Product[];
  getAvailableProductsForFormula: (formulaId: string) => Product[];
  updateFormula: (formula: Formula) => void;
}

const ProductFormulaContext = createContext<ProductFormulaContextType | undefined>(undefined);

export function useProductFormula() {
  const context = useContext(ProductFormulaContext);
  if (!context) {
    throw new Error('useProductFormula must be used within a ProductFormulaProvider');
  }
  return context;
}

interface ProductFormulaProviderProps {
  children: ReactNode;
}

export function ProductFormulaProvider({ children }: ProductFormulaProviderProps) {
  const [products, setProducts] = useState<Product[]>(() => 
    bakeryProducts.map(product => ({ ...product }))
  );
  const [formulas, setFormulas] = useState<Formula[]>([]);

  // Calculate product price based on formula
  const calculateProductPrice = (product: Product, formulaText: string): number => {
    try {
      // Replace variables with actual product values
      let calculatedFormula = formulaText
        .replace(/base_cost/g, product.BaseCost.toString())
        .replace(/ingredients_cost/g, product.IngredientsCost.toString())
        .replace(/labor_rate/g, '15') // Default values for now
        .replace(/markup_percent/g, '1.4')
        .replace(/discount_rate/g, '0.1');
      
      // Evaluate the formula
      const result = Function('"use strict"; return (' + calculatedFormula + ')')();
      
      if (typeof result === 'number' && !isNaN(result)) {
        return Math.round(result * 100) / 100; // Round to 2 decimal places
      }
      
      return product.FinalPrice; // Fallback to original price
    } catch (error) {
      console.error('Error calculating price for product:', product.ProductId, error);
      return product.FinalPrice; // Fallback to original price
    }
  };

  // Apply formula to multiple products
  const applyFormulaToProducts = (formulaId: string, productIds: string[]) => {
    const formula = formulas.find(f => f.id === formulaId);
    if (!formula) return;

    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (productIds.includes(product.ProductId)) {
          const newPrice = calculateProductPrice(product, formula.formula);
          return {
            ...product,
            appliedFormulaId: formulaId,
            PricingFormula: formula.formula,
            FormulaNote: `Applied formula: ${formula.name}`,
            FinalPrice: newPrice
          };
        }
        return product;
      })
    );
  };

  // Remove formula from a product
  const removeFormulaFromProduct = (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.ProductId === productId) {
          // Find original product data to restore
          const originalProduct = bakeryProducts.find(p => p.ProductId === productId);
          if (originalProduct) {
            return {
              ...product,
              appliedFormulaId: undefined,
              PricingFormula: originalProduct.PricingFormula,
              FormulaNote: originalProduct.FormulaNote,
              FinalPrice: originalProduct.FinalPrice
            };
          }
        }
        return product;
      })
    );
  };

  // Get products that have a specific formula applied
  const getProductsWithFormula = (formulaId: string): Product[] => {
    return products.filter(product => product.appliedFormulaId === formulaId);
  };

  // Get products available for applying a formula (no formula currently applied)
  const getAvailableProductsForFormula = (formulaId: string): Product[] => {
    return products.filter(product => 
      !product.appliedFormulaId || product.appliedFormulaId === formulaId
    );
  };

  // Update formula and recalculate all products using it
  const updateFormula = (updatedFormula: Formula) => {
    setFormulas(prevFormulas => 
      prevFormulas.map(f => f.id === updatedFormula.id ? updatedFormula : f)
    );

    // Recalculate prices for all products using this formula
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.appliedFormulaId === updatedFormula.id) {
          const newPrice = calculateProductPrice(product, updatedFormula.formula);
          return {
            ...product,
            PricingFormula: updatedFormula.formula,
            FormulaNote: `Applied formula: ${updatedFormula.name}`,
            FinalPrice: newPrice
          };
        }
        return product;
      })
    );
  };

  const contextValue: ProductFormulaContextType = {
    products,
    formulas,
    setFormulas,
    applyFormulaToProducts,
    removeFormulaFromProduct,
    calculateProductPrice,
    getProductsWithFormula,
    getAvailableProductsForFormula,
    updateFormula
  };

  return (
    <ProductFormulaContext.Provider value={contextValue}>
      {children}
    </ProductFormulaContext.Provider>
  );
}