/**
 * ColumnDefs Component Examples Database
 *
 * This file contains production-tested examples of column definitions (ColDef[])
 * extracted from the Gravitate frontend codebase. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality column definition implementations.
 */

export interface ColumnDefsExample {
  id: string;
  name: string;
  description: string;
  complexity: "simple" | "medium" | "complex";
  category?: string;
  tags: string[];
  code: string;
  props: Record<string, any>;
  dependencies?: string[];
  notes?: string;
  sourceFile?: string;
}

export const COLDEFS_EXAMPLES: ColumnDefsExample[] = [
  {
    id: "column_defs_simple_01",
    name: "Basic Text Columns",
    description:
      "Simple column definitions with basic field mapping and headers",
    complexity: "simple",
    category: "basic-usage",
    tags: ["basic", "text-fields", "headers", "minimal"],
    code: `[
  {
    field: 'LocationName',
    headerName: 'Location',
    minWidth: 450,
    maxWidth: 650,
  },
  {
    headerName: 'Product',
    field: 'ProductName',
    minWidth: 450,
    maxWidth: 650,
  }
]`,
    props: {
      field: "data property name",
      headerName: "column display title",
      minWidth: "minimum column width in pixels",
      maxWidth: "maximum column width in pixels",
    },
    dependencies: ["ag-grid-community"],
    sourceFile:
      "/src/modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid/columns/columnDefs.tsx",
    notes:
      "Perfect for simple data display grids. Use minWidth/maxWidth to control column sizing.",
  },

  {
    id: "column_defs_simple_02",
    name: "Hidden and Group Columns",
    description:
      "Basic column configurations with hidden fields and row grouping",
    complexity: "simple",
    category: "basic-usage",
    tags: ["hidden", "grouping", "field-mapping", "basic"],
    code: `[
  {
    field: 'Key',
    hide: true,
  },
  {
    field: 'QuoteConfigurationName',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: 'Instrument',
    field: 'MarketPlatformInstrumentName',
    minWidth: 110,
  }
]`,
    props: {
      hide: "true to hide column from display",
      rowGroup: "true to group rows by this field",
      field: "data property name",
      headerName: "column display title",
    },
    dependencies: ["ag-grid-community"],
    sourceFile:
      "/src/modules/SellingPlatform/CalculatedValueReport/colDefs.tsx",
    notes:
      "Use hide: true for data columns that should not be visible. rowGroup creates hierarchical data grouping.",
  },

  {
    id: "column_defs_simple_03",
    name: "Number Columns with Formatting",
    description: "Number columns with currency formatting and number filters",
    complexity: "simple",
    category: "data-display",
    tags: ["numbers", "currency", "formatting", "filters"],
    code: `[
  {
    headerName: 'Market Price',
    field: 'Market',
    valueFormatter: fmt.currency,
    filter: 'agNumberColumnFilter',
  },
  {
    headerName: 'Full Price',
    field: 'FullPrice',
    valueFormatter: fmt.currency,
    filter: 'agNumberColumnFilter',
  }
]`,
    props: {
      valueFormatter: "fmt.currency for currency display",
      filter: '"agNumberColumnFilter" for numeric filtering',
      field: "numeric data property",
      headerName: "column display title",
    },
    dependencies: ["ag-grid-community"],
    sourceFile:
      "/src/modules/SellingPlatform/CalculatedValueReport/colDefs.tsx",
    notes:
      'Use filter: "agNumberColumnFilter" for numeric data. fmt.currency provides consistent currency formatting.',
  },

  {
    id: "column_defs_medium_01",
    name: "Selection and Group Cell Column",
    description:
      "Checkbox selection column with master-detail group cell renderer",
    complexity: "medium",
    category: "interactive",
    tags: ["selection", "checkbox", "master-detail", "group-renderer"],
    code: `[
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    maxWidth: 50,
    headerCheckboxSelectionFilteredOnly: true,
  },
  {
    cellRenderer: 'agGroupCellRenderer',
    headerName: '',
    colId: 'group-column',
    maxWidth: 40,
  }
]`,
    props: {
      headerCheckboxSelection: "checkbox in header for select all",
      checkboxSelection: "checkbox in each row",
      headerCheckboxSelectionFilteredOnly: "only select filtered rows",
      cellRenderer: '"agGroupCellRenderer" for expandable groups',
      colId: "unique column identifier",
    },
    dependencies: ["ag-grid-community"],
    sourceFile:
      "/src/modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/AllDetailsGridColumnDefs.tsx",
    notes:
      "Essential for grids with row selection and master-detail views. Use colId for group columns.",
  },

  {
    id: "column_defs_medium_02",
    name: "Date Formatting with Filters",
    description:
      "Date columns with moment.js formatting and ag-grid date filters",
    complexity: "medium",
    category: "data-display",
    tags: ["dates", "formatting", "filters", "moment-js"],
    code: `[
  {
    headerName: 'Effective From',
    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
    filter: 'agDateColumnFilter',
    field: 'FromDateTime',
  },
  {
    field: 'TargetPeriodEffectiveFrom',
    headerName: 'Price Effective',
    editable: false,
    sortable: true,
    valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_TIME) : ''),
    filterParams: {
      buttons: ['reset'],
      valueFormatter: (params) => (params.value ? moment(params.value).format(dateFormat.SHORT_TIME) : ''),
    }
  }
]`,
    props: {
      valueFormatter: "moment.js date formatting function",
      filter: '"agDateColumnFilter" for date filtering',
      filterParams: "custom filter configuration",
      editable: "false to prevent editing",
      sortable: "true to enable sorting",
    },
    dependencies: ["ag-grid-community", "moment"],
    sourceFile:
      "/src/modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/AllDetailsGridColumnDefs.tsx",
    notes:
      "Use moment.js with dateFormat constants for consistent date display. agDateColumnFilter provides date range filtering.",
  },

  {
    id: "column_defs_medium_03",
    name: "Custom Cell Renderers with Tags",
    description:
      "Columns with custom React cell renderers using BBDTag components",
    complexity: "medium",
    category: "interactive",
    tags: ["cell-renderer", "react-components", "tags", "conditional-styling"],
    code: `[
  {
    headerName: 'Detail Id',
    field: 'TradeEntryDetailId',
    maxWidth: 120,
    headerTooltip: 'Contract Detail Id',
    valueGetter: ({ data }) => {
      return data?.TradeEntryDetailId ?? 'Draft'
    },
    cellRenderer: ({ value }) => {
      if (value && value !== 'Draft') {
        return <Texto>{value}</Texto>
      }
      return (
        <BBDTag title='Draft' style={{ textAlign: 'center' }}>
          Draft
        </BBDTag>
      )
    },
  },
  {
    field: 'IsMissingPricing',
    minWidth: 130,
    valueFormatter: ({ value }) => (value ? 'Missing' : 'Not Missing'),
    cellRenderer: ({ value }) => (
      <BBDTag theme2={!value} error={value} style={{ textAlign: 'center' }}>
        {value ? 'Prices Missing!' : 'All Prices Present'}
      </BBDTag>
    ),
  }
]`,
    props: {
      valueGetter: "function to transform data for display",
      cellRenderer: "React component for custom cell display",
      headerTooltip: "tooltip text for column header",
      valueFormatter: "simple data transformation function",
    },
    dependencies: ["ag-grid-community", "react", "@gravitate-js/excalibrr"],
    sourceFile:
      "/src/modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/AllDetailsGridColumnDefs.tsx",
    notes:
      "cellRenderer allows full React components in cells. Use BBDTag for consistent status indicators.",
  },

  {
    id: "column_defs_medium_04",
    name: "Editable Boolean Columns with Dropdowns",
    description:
      "Boolean columns with SearchableSelect editor and custom cell renderers",
    complexity: "medium",
    category: "form-input",
    tags: ["editable", "boolean", "dropdown", "cell-editor"],
    code: `[
  {
    headerName: 'Status',
    field: 'IsActive',
    maxWidth: 120,
    editable: canWrite,
    isBulkEditable: canWrite,
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    filterParams: {
      valueFormatter: (params) => (params.value ? "Active" : "Inactive"),
    },
    cellEditorParams: {
      options: [
        {
          value: true,
          label: 'Active',
        },
        {
          value: false,
          label: 'Inactive',
        },
      ],
      showSearch: false,
      allowClear: false,
    },
    cellRenderer: ({ value }) =>
      value ? (
        <BBDTag success style={{ textAlign: 'center' }}>
          Active
        </BBDTag>
      ) : (
        <BBDTag error style={{ textAlign: 'center' }}>
          Inactive
        </BBDTag>
      ),
  }
]`,
    props: {
      editable: "canWrite permission for editing",
      isBulkEditable: "enables bulk editing functionality",
      cellEditor: '"SearchableSelect" for dropdown editing',
      suppressKeyboardEvent: "prevents keyboard interference",
      cellEditorParams: "configuration for dropdown options",
      filterParams: "custom filter display formatting",
    },
    dependencies: ["ag-grid-community", "react", "@gravitate-js/excalibrr"],
    sourceFile:
      "/src/modules/Admin/ManageProducts/components/Grid/columnDefs.tsx",
    notes:
      "Perfect pattern for boolean fields with user-friendly labels. Use isBulkEditable for mass updates.",
  },

  {
    id: "column_defs_complex_01",
    name: "Advanced Editable Column with Custom Validation",
    description:
      "Complex editable column with custom value setters, validation, and metadata integration",
    complexity: "complex",
    category: "advanced-config",
    tags: [
      "editable",
      "validation",
      "metadata",
      "custom-setter",
      "complex-logic",
    ],
    code: `{
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'NetOrGrossCvId',
    placeholder: 'Select Net/Gross',
    options: metadata?.Data?.NetOrGrossTypeCodeValues?.map(toAntOption) ?? [],
  },
  field: 'NetOrGrossCvId',
  headerName: 'Net/Gross',
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorPopup: true,
  cellEditorParams: (params) => ({
    matchOptionId: params?.data?.DefaultNetOrGrossCvId?.toString(),
    showSelectedValue: true,
    showSearch: true,
    onKeyDown: stopCloseOnEnter,
    options: metadata?.Data?.NetOrGrossTypeCodeValues?.map(toAntOption) ?? [],
  }),
  cellStyle: (params) => {
    const backgroundColor =
      params?.data.NetOrGrossCvId &&
      params?.data?.DefaultNetOrGrossCvId &&
      params?.data?.NetOrGrossCvId?.toString() !== params?.data?.DefaultNetOrGrossCvId?.toString()
        ? 'var(--theme-warning-dim)'
        : undefined
    if (backgroundColor)
      return {
        backgroundColor,
      }
  },
  cellRenderer: NetGrossDefaultRenderer,
  valueGetter: (props) => {
    return metadata?.Data?.NetOrGrossTypeCodeValues?.find((option) => option.Value == props?.data?.NetOrGrossCvId)?.Text
  },
}`,
    props: {
      isBulkEditable: "enables bulk editing operations",
      bulkCellEditor: "custom bulk editor component",
      bulkCellEditorParams: "bulk editor configuration",
      cellEditorPopup: "true for popup editing interface",
      cellEditorParams: "function returning editor configuration",
      cellStyle: "function for conditional cell styling",
      cellRenderer: "custom React renderer component",
      valueGetter: "function to resolve display value from metadata",
    },
    dependencies: ["ag-grid-community", "react", "@gravitate-js/excalibrr"],
    sourceFile:
      "/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/columns/columnDefs.tsx",
    notes:
      "Advanced pattern for complex business logic. Includes validation highlighting, metadata resolution, and bulk operations.",
  },

  {
    id: "column_defs_complex_02",
    name: "Dynamic Strategy Column with JSON Value Handling",
    description:
      "Complex column with conditional editing, JSON value setters, and dynamic option generation",
    complexity: "complex",
    category: "advanced-config",
    tags: [
      "dynamic-options",
      "json-values",
      "conditional-editing",
      "complex-getter-setter",
    ],
    code: `{
  field: 'StrategyQuoteBenchmarkId',
  headerName: 'Strategy',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'StrategyQuoteBenchmarkId',
    placeholder: 'Select Strategy',
    options: getStategyOptions(metadata, null),
    getChanges: (value) => {
      const newValues = JSON.parse(value)
      return {
        StrategyBaseTypeCvId: newValues.StrategyBaseTypeCvId,
        StrategyQuoteBenchmarkId: newValues.StrategyQuoteBenchmarkId,
      }
    },
  },
  editable: (params) => !params?.data?.SpreadParentMappingId && canWrite,
  valueGetter: (params) => {
    if (params.data?.SpreadParentMappingId) return 'Spread'
    const strategyBaseTypeDisplay = metadata?.Data?.StrategyBaseTypeCodeValues?.find(
      (option) => option.Value == params?.data?.StrategyBaseTypeCvId
    )?.Text
    const benchmarkDisplay = metadata?.Data?.Benchmarks?.find(
      (option) => option.Value == params?.data?.StrategyQuoteBenchmarkId
    )?.Text
    return benchmarkDisplay || strategyBaseTypeDisplay || 'Cost'
  },
  valueSetter: (params) => {
    const newValues = JSON.parse(params.newValue)
    params.data.StrategyBaseTypeCvId = newValues.StrategyBaseTypeCvId
    params.data.StrategyQuoteBenchmarkId = newValues.StrategyQuoteBenchmarkId
    return true
  },
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorPopup: true,
  cellEditorParams: (params) => {
    return {
      showSearch: true,
      onKeyDown: stopCloseOnEnter,
      options: getStategyOptions(metadata, params?.data?.QuoteConfigurationId),
    }
  },
}`,
    props: {
      editable: "function for conditional editability",
      valueGetter:
        "complex function resolving display value from multiple sources",
      valueSetter: "function parsing JSON and updating multiple fields",
      getChanges: "bulk editor function for transforming values",
      cellEditorParams: "function providing dynamic options based on row data",
    },
    dependencies: ["ag-grid-community", "react", "@gravitate-js/excalibrr"],
    sourceFile:
      "/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/columns/columnDefs.tsx",
    notes:
      "Advanced pattern for handling complex business relationships. Uses JSON for multi-field updates and dynamic option filtering.",
  },

  {
    id: "column_defs_complex_03",
    name: "Actions Column with Conditional Rendering",
    description:
      "Actions column with permissions-based rendering and confirmation dialogs",
    complexity: "complex",
    category: "interactive",
    tags: [
      "actions",
      "permissions",
      "conditional-rendering",
      "popconfirm",
      "mutations",
    ],
    code: `{
  colId: 'actions',
  headerName: 'Actions',
  maxWidth: 160,
  cellRenderer: (params) => {
    if (!canWrite) return null
    
    return (
      <Horizontal>
        <Popconfirm
          title='Are you sure you want to delete this quote?'
          onConfirm={() => mutationRef?.current?.mutate({ 
            rowOrRows: { ...params?.data, IsActive: false } 
          })}
          okText='Yes'
          cancelText='No'
        >
          <Button type='link' danger>
            Delete
          </Button>
        </Popconfirm>
      </Horizontal>
    )
  },
}`,
    props: {
      colId: "unique identifier for actions column",
      cellRenderer: "React component with conditional logic",
      maxWidth: "fixed width for actions column",
      mutationRef: "React ref to mutation function for API calls",
    },
    dependencies: [
      "ag-grid-community",
      "react",
      "antd",
      "@gravitate-js/excalibrr",
    ],
    sourceFile:
      "/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/columns/columnDefs.tsx",
    notes:
      "Standard pattern for action columns. Always check permissions and use confirmation dialogs for destructive actions.",
  },

  {
    id: "column_defs_complex_04",
    name: "Dynamic Category Rank Columns",
    description:
      "Complex dynamic column generation with nested children and value getters",
    complexity: "complex",
    category: "data-display",
    tags: [
      "dynamic-columns",
      "nested-children",
      "complex-value-getter",
      "category-ranking",
    ],
    code: `{
  headerName: 'Publisher Rank',
  headerTooltip: 'Publisher Rank',
  marryChildren: true,
  children: categories.map((item, index) => ({
    colId: \`Rank \${item.CategoryId}\`,
    hide: false,
    ...defaultNumberColumn,
    minWidth: 60,
    headerTooltip: \`\${item.Category} Rank\`,
    headerName: \`\${item.Category} Rank\`,
    field: \`\${item.Category} Rank\`,
    suppressColumnsToolPanel: false,
    valueGetter: (params) => {
      if (!isDefinedAndNotNull(params.data)) return null

      const row = params.data as CompetitorPricingRecord
      if (row.IsSelectedRow && isDefinedAndNotNull(row.RankByCategory)) {
        return row.RankByCategory[item.CategoryId] || null
      }
      return row.CategoryId === item.CategoryId ? row.CategoryRank : null
    },
  }))
}`,
    props: {
      marryChildren: "true to group child columns under parent header",
      children: "array of child column definitions",
      colId: "dynamic unique identifier",
      valueGetter: "complex function for extracting nested data",
      suppressColumnsToolPanel: "control column visibility in panel",
    },
    dependencies: ["ag-grid-community", "react"],
    sourceFile:
      "/src/modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/Grid/columnDefs.tsx",
    notes:
      "Advanced pattern for dynamic column generation. Use marryChildren for grouped headers and complex valueGetters for nested data.",
  },

  {
    id: "column_defs_complex_05",
    name: "Multi-Field Source Column with Custom Editor",
    description:
      "Complex column combining multiple data sources with custom modal editor",
    complexity: "complex",
    category: "advanced-config",
    tags: [
      "multi-field",
      "custom-editor",
      "modal",
      "complex-renderer",
      "permissions",
    ],
    code: `{
  field: 'sourceInfo',
  editable: false,
  headerName: 'Source',
  sortable: false,
  colId: 'sourceInfo',
  filterValueGetter: ({ data }) => data?.SourceInfo?.SourceId || data?.SourceInfo?.SourceIdString,
  flex: 1,
  width: 140,
  cellRenderer: (params) => {
    const SourceInfo = params?.data?.SourceInfo
    const SourceId = SourceInfo?.SourceId
    const SourceSystemId = SourceInfo?.SourceSystemId
    const SourceIdString = SourceInfo?.SourceIdString
    const sourceSystem = metadata?.Data?.EditableSources?.find((item) => item.Value === SourceSystemId?.toString())
    
    if (!SourceId && !SourceSystemId && canWrite) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type='text'
            style={{ color: 'var(--theme-color-2)', minWidth: 175 }}
            onClick={() => initializeSourceModal(params?.data)}
          >
            + Add Source
          </Button>
        </div>
      )
    }
    
    if (sourceSystem !== undefined && canWrite) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button.Group>
            <Button type='link' style={{ pointerEvents: 'none', minWidth: 100, color: 'black' }}>
              {params?.data?.SourceInfo?.SourceId || params?.data?.SourceInfo?.SourceIdString}
            </Button>
            <Button icon={<EditOutlined />} onClick={() => initializeSourceModal(params?.data)} />
          </Button.Group>
        </div>
      )
    }
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button.Group>
          <Button type='link' style={{ pointerEvents: 'none', minWidth: 140, color: 'black' }}>
            {params?.data?.SourceInfo?.SourceId || params?.data?.SourceInfo?.SourceIdString}
          </Button>
        </Button.Group>
      </div>
    )
  },
}`,
    props: {
      filterValueGetter:
        "function to extract filterable value from complex data",
      cellRenderer: "complex React component with conditional UI states",
      flex: "flexible column sizing",
      initializeSourceModal: "function to open custom editor modal",
      canWrite: "permission check for editing capabilities",
    },
    dependencies: ["ag-grid-community", "react", "antd", "@ant-design/icons"],
    sourceFile:
      "/src/modules/Admin/ManageProducts/components/Grid/columnDefs.tsx",
    notes:
      "Advanced pattern for complex data editing. Uses conditional rendering based on data state and permissions. Custom modal editors for complex workflows.",
  },

  // BULK CHANGE COLUMN DEFINITIONS
  {
    id: "column_defs_bulk_01",
    name: "Simple Boolean Bulk Editable Column",
    description:
      "Basic boolean column with bulk editing enabled using BulkSelectEditor",
    complexity: "simple",
    category: "bulk-change",
    tags: ["bulk-change", "bulk-edit", "boolean", "select", "simple"],
    code: `{
  field: 'IsActive',
  headerName: 'Active',
  maxWidth: 120,
  // Enable bulk editing
  isBulkEditable: true,
  // Use select editor for bulk changes
  bulkCellEditor: BulkSelectEditor,
  // Configure the bulk editor options
  bulkCellEditorParams: {
    accessor: 'IsActive',
    options: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],
    placeholder: 'Select Option',
  },
  // Regular cell display
  cellRenderer: ({ value }) => (
    <BBDTag success={value} error={!value}>
      {value ? 'Active' : 'Inactive'}
    </BBDTag>
  ),
}`,
    props: {
      isBulkEditable: "true to enable bulk editing for this column",
      bulkCellEditor: "BulkSelectEditor component for dropdown selection",
      bulkCellEditorParams: "accessor (field name), options (value/label pairs), placeholder",
    },
    dependencies: ["ag-grid-community", "@gravitate-js/excalibrr"],
    sourceFile:
      "/src/components/shared/Grid/defaultColumnDefs/TrueFalseBulkEditableColumn.tsx",
    notes:
      "Foundation pattern for bulk-editable boolean columns. Use TrueFalseBulkEditableColumn helper for production code.",
  },

  {
    id: "column_defs_bulk_02",
    name: "Select Dropdown Bulk Editable Column",
    description:
      "Dropdown select column with bulk editing and metadata-driven options",
    complexity: "medium",
    category: "bulk-change",
    tags: ["bulk-change", "bulk-edit", "select", "dropdown", "metadata"],
    code: `{
  field: 'CategoryCvId',
  headerName: 'Category',
  minWidth: 150,
  // Conditionally enable based on permissions
  isBulkEditable: canWrite,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'CategoryCvId',
    placeholder: 'Select Category',
    // Map metadata to options
    options: metadata?.Categories?.map(item => ({
      value: item.Value,
      label: item.Text,
    })) ?? [],
  },
  // Regular inline editing
  editable: canWrite,
  cellEditor: 'SearchableSelect',
  cellEditorParams: {
    showSearch: true,
    options: metadata?.Categories?.map(item => ({
      value: item.Value,
      label: item.Text,
    })) ?? [],
  },
  // Display resolved text value
  valueGetter: ({ data }) => {
    const category = metadata?.Categories?.find(
      c => c.Value === data?.CategoryCvId
    );
    return category?.Text ?? '';
  },
}`,
    props: {
      isBulkEditable: "canWrite permission check - can be boolean or function",
      bulkCellEditorParams: "accessor, placeholder, and dynamically generated options from metadata",
      editable: "enables regular inline cell editing",
      cellEditor: "SearchableSelect for single-row editing",
      valueGetter: "resolves ID to display text from metadata",
    },
    dependencies: ["ag-grid-community", "@gravitate-js/excalibrr"],
    sourceFile:
      "/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/columns/columnDefs.tsx",
    notes:
      "Common pattern for category/type fields. Options generated from metadata ensure consistency between bulk and inline editing.",
  },

  {
    id: "column_defs_bulk_03",
    name: "Multi-Field Bulk Update Column",
    description:
      "Advanced bulk editing that updates multiple related fields from a single selection",
    complexity: "complex",
    category: "bulk-change",
    tags: ["bulk-change", "bulk-edit", "multi-field", "advanced", "transformation"],
    code: `{
  field: 'StrategyQuoteBenchmarkId',
  headerName: 'Strategy',
  isBulkEditable: true,
  bulkCellEditor: BulkSelectEditor,
  bulkCellEditorParams: {
    accessor: 'StrategyQuoteBenchmarkId',
    placeholder: 'Select Strategy',
    options: getStrategyOptions(metadata),
    // Custom transformation - updates multiple fields from single selection
    getChanges: (value) => {
      const newValues = JSON.parse(value);
      return {
        StrategyBaseTypeCvId: newValues.StrategyBaseTypeCvId,
        StrategyQuoteBenchmarkId: newValues.StrategyQuoteBenchmarkId,
      };
    },
  },
  // Regular editing also uses JSON for multi-field updates
  editable: (params) => !params?.data?.SpreadParentMappingId && canWrite,
  valueSetter: (params) => {
    const newValues = JSON.parse(params.newValue);
    params.data.StrategyBaseTypeCvId = newValues.StrategyBaseTypeCvId;
    params.data.StrategyQuoteBenchmarkId = newValues.StrategyQuoteBenchmarkId;
    return true;
  },
  valueGetter: (params) => {
    if (params.data?.SpreadParentMappingId) return 'Spread';
    const typeDisplay = metadata?.StrategyBaseTypes?.find(
      t => t.Value === params?.data?.StrategyBaseTypeCvId
    )?.Text;
    const benchmarkDisplay = metadata?.Benchmarks?.find(
      b => b.Value === params?.data?.StrategyQuoteBenchmarkId
    )?.Text;
    return benchmarkDisplay || typeDisplay || 'Cost';
  },
}

// Helper to build options with encoded multi-field values
const getStrategyOptions = (metadata) => {
  const options = [];
  metadata?.StrategyBaseTypes?.forEach(type => {
    options.push({
      value: JSON.stringify({
        StrategyBaseTypeCvId: type.Value,
        StrategyQuoteBenchmarkId: null,
      }),
      label: type.Text,
    });
  });
  metadata?.Benchmarks?.forEach(benchmark => {
    options.push({
      value: JSON.stringify({
        StrategyBaseTypeCvId: null,
        StrategyQuoteBenchmarkId: benchmark.Value,
      }),
      label: benchmark.Text,
    });
  });
  return options;
};`,
    props: {
      getChanges: "custom function in bulkCellEditorParams to transform selection into multiple field updates",
      valueSetter: "parses JSON and updates multiple fields on the row data",
      valueGetter: "resolves display value from multiple possible sources",
      editable: "function for conditional editability based on row data",
    },
    dependencies: ["ag-grid-community", "@gravitate-js/excalibrr"],
    sourceFile:
      "/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/columns/columnDefs.tsx",
    notes:
      "Advanced pattern for when selecting one option should update multiple data fields. Uses JSON.stringify/parse to encode multi-field values.",
  },

  {
    id: "column_defs_bulk_04",
    name: "Conditional Bulk Editable Column",
    description:
      "Column with conditional bulk editing based on row data and permissions",
    complexity: "medium",
    category: "bulk-change",
    tags: ["bulk-change", "bulk-edit", "conditional", "permissions", "validation"],
    code: `{
  field: 'Price',
  headerName: 'Price',
  // Function-based bulk edit control
  isBulkEditable: (params) => {
    // Only enable for non-locked rows with write permission
    return !params?.data?.IsLocked && canWrite;
  },
  bulkCellEditor: BulkNumberEditor,
  bulkCellEditorParams: {
    accessor: 'Price',
    min: 0,
    max: 999999,
    precision: 2,
    step: 0.01,
  },
  // Regular editing with same condition
  editable: (params) => !params?.data?.IsLocked && canWrite,
  cellEditor: 'NumericEditor',
  cellEditorParams: {
    min: 0,
    precision: 2,
  },
  // Highlight edited cells
  cellStyle: (params) => {
    if (params?.data?.IsModified) {
      return { backgroundColor: 'var(--theme-warning-dim)' };
    }
  },
  valueFormatter: ({ value }) => value?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }),
}`,
    props: {
      isBulkEditable: "function receiving params, returns boolean based on row data",
      editable: "same conditional logic for inline editing consistency",
      cellStyle: "highlights modified cells for visual feedback",
      BulkNumberEditor: "bulk editor for numeric fields with min/max/precision",
    },
    dependencies: ["ag-grid-community", "@gravitate-js/excalibrr"],
    sourceFile:
      "/src/modules/PricingEngine/QuoteBook/components/Grid/components/columns/",
    notes:
      "Use function-based isBulkEditable when bulk editing should be conditionally available per-row. Combine with same condition on editable for consistency.",
  },
];

export default COLDEFS_EXAMPLES;
