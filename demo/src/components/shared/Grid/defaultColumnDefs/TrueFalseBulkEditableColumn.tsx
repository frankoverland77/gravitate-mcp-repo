import { TrueFalseEditableColumn } from '@components/shared/Grid/defaultColumnDefs/TrueFalseEditableColumn'
import { BulkSelectEditor } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/cellEditors/BulkSelectCellEditor'

export const TrueFalseBulkEditableColumn = (field: string, headerName: string, allowNullValue?: boolean) => ({
  minWidth: 100,
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: field,
    options: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
    placeholder: 'Select Option',
    allowNullValue,
  },
  ...TrueFalseEditableColumn(field, headerName, allowNullValue),
})
