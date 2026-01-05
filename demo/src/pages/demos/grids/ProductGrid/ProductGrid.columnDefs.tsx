import { BBDTag } from '@gravitate-js/excalibrr';
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor';
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors';
import { ICellRendererParams, ICellEditorParams } from 'ag-grid-community';

type FormulaOption = {
  value: string | null;
  label: string;
};

type Product = {
  ProductId: string;
  Name: string;
  Category: string;
  Description: string;
  BaseCost: number;
  IngredientsCost: number;
  FinalPrice: number;
  IsAvailable: boolean;
  appliedFormulaId?: string;
};

type ColumnDefsParams = {
  formulaOptions: FormulaOption[];
  getFormulaName: (product: Product) => string;
  handleFormulaChange: (formulaId: string | null, productData: Product) => void;
};

export function getProductGridColumnDefs(params: ColumnDefsParams) {
  const { formulaOptions, getFormulaName, handleFormulaChange } = params;

  return [
    {
      field: 'ProductId',
      headerName: 'Product ID',
    },
    {
      field: 'Name',
      headerName: 'Product Name',
    },
    {
      field: 'Category',
      headerName: 'Category',
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
    },
    {
      field: 'BaseCost',
      headerName: 'Base Cost',
      cellRenderer: (params: ICellRendererParams<Product>) => `$${params.value?.toFixed(2)}`,
    },
    {
      field: 'IngredientsCost',
      headerName: 'Ingredients Cost',
      cellRenderer: (params: ICellRendererParams<Product>) => `$${params.value?.toFixed(2)}`,
    },
    {
      field: 'appliedFormulaId',
      headerName: 'Pricing Formula',
      editable: true,
      cellRenderer: (params: ICellRendererParams<Product>) =>
        getFormulaName(params.data as Product),
      cellEditor: SearchableSelect,
      cellEditorParams: (params: ICellEditorParams<Product>) => ({
        options: formulaOptions,
        onChange: (value: string | null) => handleFormulaChange(value, params.data as Product),
        closeOnBlur: true,
        showSearch: true,
        value: params.data?.appliedFormulaId,
      }),
    },
    {
      field: 'FinalPrice',
      headerName: 'Final Price',
      cellRenderer: (params: ICellRendererParams<Product>) => `$${params.value?.toFixed(2)}`,
    },
    {
      field: 'IsAvailable',
      headerName: 'Status',
      cellRenderer: (params: ICellRendererParams<Product>) => (
        <BBDTag warning={!params.value} className="width-fit-content">
          {params.value ? 'Available' : 'Out of Stock'}
        </BBDTag>
      ),
      isBulkEditable: true,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        propKey: 'IsAvailable',
        options: [
          { Value: 'true', Text: 'Available' },
          { Value: 'false', Text: 'Out of Stock' },
        ],
      },
    },
  ];
}
