/**
 * Select Component Examples Database
 *
 * This file contains production-tested examples of the Select component
 * extracted from the Gravitate frontend codebase. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality Select implementations.
 */

export interface SelectExample {
  id: string
  name: string
  description: string
  complexity: 'simple' | 'medium' | 'complex'
  category?: string
  tags: string[]
  code: string
  props: Record<string, any>
  dependencies?: string[]
  notes?: string
  sourceFile?: string
}

export const SelectExamples: SelectExample[] = [
  {
    id: 'select_simple_01',
    name: 'Basic Contact Select',
    description: 'Simple contact selection with search functionality and form validation',
    complexity: 'simple',
    category: 'form-input',
    tags: ['basic', 'search', 'validation', 'form'],
    code: `<Form.Item
  name="ExternalColleagueId"
  rules={[{ required: true, message: "Please select a contact" }]}
  style={{ width: "60%" }}
>
  <Select
    showSearch
    placeholder="Select contact"
    style={{ minWidth: "100%" }}
    className="test-Contact"
    options={selectedItemMeta?.ExternalColleagueOverride.map((item) => ({
      value: item.key,
      label: item.value,
    }))}
    filterOption={(input, option) => {
      return (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
    }}
  />
</Form.Item>`,
    props: {
      showSearch: 'enables search functionality',
      placeholder: '"Select contact"',
      className: '"test-Contact"',
      options: 'dynamic options array mapped from data',
      filterOption: 'custom search filtering by label text',
      rules: 'form validation with required field',
    },
    dependencies: ['react', 'antd', '@gravitate-js/excalibrr'],
    sourceFile: '/src/modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/ContactSelect.tsx',
    notes:
      'Perfect for simple dropdown selection with search. Uses Form.Item wrapper for validation and options prop for dynamic data.',
  },
  {
    id: 'select_simple_02',
    name: 'Time Range Filter',
    description: 'Basic time range selection with conditional disable functionality',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['filter', 'conditional', 'disable', 'options'],
    code: `const timeFilterOptions = useMemo(() => {
  if (title === "Volume Pace" || title === "Intraday Competitor Movement") {
    return [{ label: "Current Period", value: "OneDay" }]
  }
  return [
    { label: "Today", value: "OneDay" },
    { label: "Last 7 Days", value: "SevenDays" },
    { label: "Last 30 Days", value: "ThirtyDays" },
  ]
}, [title])

<Form.Item name="DateRange">
  <Select options={timeFilterOptions} disabled={timeFilterOptions?.length === 1} />
</Form.Item>`,
    props: {
      options: 'dynamic options array based on context',
      disabled: 'conditional disable when only one option available',
    },
    dependencies: ['react', 'antd'],
    sourceFile: '/src/modules/CommandCenter/components/GridSettingsDrawer/GridSettingsDrawer.tsx',
    notes:
      'Ideal for filter controls where options change based on context. Automatically disables when only one option is available.',
  },
  {
    id: 'select_medium_01',
    name: 'Counterparty Select with Dynamic Filtering',
    description: 'Dynamic counterparty selection with complex filtering based on related data',
    complexity: 'medium',
    category: 'data-display',
    tags: ['dynamic', 'filtering', 'search', 'related-data', 'useMemo'],
    code: `const counterpartyOptions = useMemo(() => {
  if (selectedPricePublisherIds?.length) {
    const selectedId = index !== undefined ? selectedPricePublisherIds[index] : selectedPricePublisherIds[0]
    return metadata?.Data.CounterParties.filter((cp) => cp?.GroupingValue === selectedId).map(toAntOption) || []
  }
  return []
}, [metadata, selectedPricePublisherIds])

<Form.Item
  name={name}
  className="my-2 w-full"
  rules={[{ required: true, message: "Please choose a counterparty" }]}
>
  <Select
    options={counterpartyOptions}
    allowClear
    placeholder={placeholder || "Choose a counterparty"}
    disabled={isDisabled}
    mode={mode}
    showSearch
    filterOption={(input, option) =>
      option?.label.toLowerCase().includes(input.toLowerCase()) ||
      option?.value.toString().toLowerCase().includes(input.toLowerCase())
    }
  />
</Form.Item>`,
    props: {
      options: 'dynamically filtered based on selected publishers',
      allowClear: 'enables clearing selection',
      mode: 'supports multiple selection modes',
      filterOption: 'searches both label and value fields',
      disabled: 'conditional disable state',
    },
    dependencies: ['react', 'antd', '@utils/index'],
    sourceFile:
      '/src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/competitorFields/CounterpartySelectField.tsx',
    notes:
      'Excellent for cascading dropdowns where options depend on other selections. Uses useMemo for performance optimization.',
  },
  {
    id: 'select_medium_02',
    name: 'Configuration Modal Selects',
    description: 'Multiple related select fields in a configuration modal with icons and dynamic updates',
    complexity: 'medium',
    category: 'form-input',
    tags: ['modal', 'multiple-selects', 'icons', 'configuration', 'dynamic-updates'],
    code: `<Form.Item label="Default Cost Source" name="DefaultCostSourceMarkerId">
  <Select
    allowClear
    showSearch
    optionFilterProp="label"
    options={metadata?.CostSources?.filter((cst) => cst.IsMarker).map((option) => ({
      value: option.Value,
      label: <span><FunctionOutlined /> {option.Text}</span>,
    }))}
  />
</Form.Item>

<Form.Item label="Calendar" name="CalendarId">
  <Select
    allowClear
    showSearch
    optionFilterProp="label"
    options={metadata?.Calendars?.map(toAntOption)}
  />
</Form.Item>

<Form.Item label="Cost Counterparty Type" name="BaseCostCounterPartyComparisonTypeCvId">
  <Select
    allowClear
    showSearch
    optionFilterProp="label"
    options={metadata?.CounterPartyComparisonTypes?.map(toAntOption)}
  />
</Form.Item>`,
    props: {
      allowClear: 'enables clearing selections',
      showSearch: 'search functionality',
      optionFilterProp: '"label" for filtering by displayed text',
      options: 'metadata-driven options with toAntOption transformation',
    },
    dependencies: ['react', 'antd', '@ant-design/icons', '@utils/index'],
    sourceFile: '/src/modules/Admin/ManageQuoteConfigs/components/CreateConfigurationModal.tsx',
    notes:
      'Perfect for configuration forms with multiple related dropdowns. Uses options prop consistently across all selects.',
  },
  {
    id: 'select_medium_03',
    name: 'Bulk Editor Select',
    description: 'Select component for bulk editing with state management and imperative API',
    complexity: 'medium',
    category: 'data-management',
    tags: ['bulk-edit', 'state-management', 'imperative-api', 'dynamic-styling'],
    code: `const [state, setState] = useState<Record<string, string>>({})

const setDynamicState = (key: string, value: string) => {
  setState((prevState) => ({
    ...prevState,
    [key]: value,
  }))
}

const dynamicValue = state[props.propKey]

useImperativeHandle(ref, () => ({
  getChanges: () => ({ [props.propKey]: dynamicValue }),
  isChangeReady: () => !!dynamicValue,
}))

<Select
  placeholder="Select option"
  showSearch
  style={{ ...props.selectEditorStyle, minWidth: 260 }}
  value={dynamicValue}
  onChange={(value) => setDynamicState(props.propKey, value)}
  options={props?.options?.map(toAntOption) ?? []}
  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
  {...props.selectEditorProps}
/>`,
    props: {
      placeholder: '"Select option"',
      showSearch: 'search functionality',
      style: 'dynamic styling with spread and minWidth',
      value: 'controlled component with dynamic state',
      onChange: 'state management function',
      options: 'transformed options with fallback',
      filterOption: 'case-insensitive label filtering',
    },
    dependencies: ['react', 'antd', '@utils/index'],
    sourceFile: '/src/components/shared/Grid/bulkChange/bulkCellEditors.tsx',
    notes: 'Ideal for bulk editing scenarios in grids. Uses imperative API pattern and dynamic state management.',
  },
  {
    id: 'select_complex_01',
    name: 'Multi-Select Tags for Products',
    description: 'Complex multi-select with tags mode for product associations in grid cells',
    complexity: 'complex',
    category: 'data-management',
    tags: ['multi-select', 'tags', 'grid-editor', 'associations', 'bulk-operations'],
    code: `{
  field: "ProductIds",
  headerName: "Products",
  cellEditor: "SearchableSelect",
  suppressKeyboardEvent,
  editable: canWrite,
  filter: true,
  minWidth: 500,
  cellEditorPopup: true,
  flex: 2,
  autoHeight: true,
  cellEditorParams: {
    showSearch: true,
    allowClear: true,
    closeOnBlur: true,
    mode: "tags",
    options: metadata?.Products.map((option) => ({
      value: option.Value,
      label: option.Text,
    })),
  },
  cellRenderer: ({ value }) => {
    const tagItems = value?.map((id) => {
      return metadata?.Products.find((p) => p.Value === id)?.Text
    })
    return <ManyTag tagItems={tagItems} maxCount={5} />
  },
}`,
    props: {
      mode: '"tags" for multi-select with tag display',
      showSearch: 'search functionality',
      allowClear: 'enables clearing all selections',
      closeOnBlur: 'closes dropdown when losing focus',
      cellEditorPopup: 'displays as popup in grid',
      autoHeight: 'adjusts cell height for content',
    },
    dependencies: ['react', 'antd', '@gravitate-js/excalibrr', 'ag-grid-community'],
    sourceFile: '/src/modules/Admin/Integrations/AllocationMappings/Tabs/Products/columnDefs.tsx',
    notes:
      'Perfect for complex association management in grids. Combines tags mode with custom rendering using ManyTag component.',
  },
  {
    id: 'select_complex_02',
    name: 'User Roles Multi-Select with Value Transformation',
    description: 'Advanced multi-select for user roles with complex value transformation and dynamic options',
    complexity: 'complex',
    category: 'data-management',
    tags: ['multi-select', 'value-transformation', 'dynamic-options', 'complex-data', 'grid-editor'],
    code: `cellEditorParams: ({ data, value }) => {
  const rolesList = getRolesList(userMetadata, data)
  return {
    mode: "multiple",
    options: rolesList?.map(toAntOptionParsedNumberValue),
    value: value?.map((item) => Number(item.Id)),
  }
},
valueSetter: (params) => {
  const rolesList = getRolesList(userMetadata, params.data)
  params.data[params.colDef.field] = params.newValue.map((id) => {
    return { Id: id, Name: rolesList.find((role) => role.Value === id.toString())?.Text }
  })
  if (!params?.newValue?.find((id) => checkLimitedImpersonationRole(id))) {
    params.data.CounterPartyAssociations = []
  }
},
cellRenderer: ({ value }) => {
  return <ManyTag tagItems={value?.map((item) => item.Name)} maxCount={5} />
}`,
    props: {
      mode: '"multiple" for multi-selection',
      options: 'dynamically generated from user metadata',
      value: 'complex value transformation from objects to numbers',
      valueSetter: 'custom logic for saving transformed values',
      cellRenderer: 'custom rendering with ManyTag component',
    },
    dependencies: ['react', 'antd', '@gravitate-js/excalibrr', 'ag-grid-community'],
    sourceFile: '/src/modules/Admin/ManageUsers/components/colDefs.tsx',
    notes:
      'Excellent for complex data relationships requiring transformation between display and storage formats. Includes business logic for related field updates.',
  },
  {
    id: 'select_complex_03',
    name: 'Advanced Searchable Select with Confirmation',
    description: 'Highly advanced select with custom clear confirmation, search filtering, and grid integration',
    complexity: 'complex',
    category: 'advanced-config',
    tags: ['confirmation', 'custom-clear', 'advanced-search', 'grid-integration', 'refs', 'popup-confirm'],
    code: `const [selected, setSelected] = useState(null)
const [isPopConfirmOpen, setIsPopConfirmOpen] = useState(false)
const [searchQuery, setSearchQuery] = useState("")
const refInput = useRef(null)

const handleSelectChange = useCallback((value, option) => {
  setSelected(value)
  if (props.onChange) {
    props.onChange(value, option, props.data)
  }
}, [props])

<Select
  defaultOpen={props?.defaultOpen ?? true}
  onBlur={() => {
    if (props?.closeOnBlur) {
      props?.api?.stopEditing()
      props?.api?.setFocusedCell(props?.rowIndex, props?.column?.colId)
    }
  }}
  showSearch={props.showSearch}
  allowClear={props.allowClear}
  ref={refInput}
  style={{ minWidth: props.minWidth ?? 260, maxWidth: props.width ?? 260 }}
  placeholder={props.placeholder || "Please select"}
  value={selected}
  onChange={handleSelectChange}
  mode={props.mode}
  maxTagCount={25}
  onSearch={setSearchQuery}
  filterOption={(params) => {
    return true
  }}
  clearIcon={
    <Popconfirm
      title="Are you sure you want to clear this field?"
      open={isPopConfirmOpen}
      onConfirm={() => {
        setSelected([])
        setIsPopConfirmOpen(false)
      }}
      onCancel={() => {
        setIsPopConfirmOpen(false)
      }}
    >
      <CloseOutlined
        onClick={() => {
          if (props.showPopConfirmOnClear) {
            setIsPopConfirmOpen(true)
          } else {
            setSelected(null)
          }
        }}
      />
    </Popconfirm>
  }
>`,
    props: {
      defaultOpen: 'automatically opens dropdown',
      onBlur: 'custom blur handling for grid integration',
      ref: 'imperative access to select component',
      maxTagCount: '25 for large multi-selections',
      onSearch: 'custom search state management',
      filterOption: 'custom filtering logic',
      clearIcon: 'custom clear icon with confirmation dialog',
    },
    dependencies: ['react', 'antd', '@ant-design/icons'],
    sourceFile: '/src/components/shared/Grid/cellEditors/SelectCellEditor.tsx',
    notes:
      'Most advanced select pattern for professional grid editing. Includes confirmation dialogs, custom search, and complete grid API integration.',
  },
  {
    id: 'select_complex_04',
    name: 'Price Types Multi-Select with Custom Rendering',
    description: 'Complex multi-select for price types with custom cell rendering and filtering',
    complexity: 'complex',
    category: 'data-display',
    tags: ['multi-select', 'custom-rendering', 'filtering', 'price-types', 'many-tag'],
    code: `{
  field: "PriceTypes",
  headerName: "Price Types",
  enableRowGroup: false,
  flex: 1,
  cellRenderer: (props) => (
    <ManyTag
      tagItems={props?.value
        ?.map((v) => priceTypes?.CodeValues?.find((cv) => cv?.CodeValueId === v?.PriceTypeCvId)?.Display)
        .sort()}
      maxCount={5}
    />
  ),
  filter: true,
  cellEditor: "SearchableSelect",
  suppressKeyboardEvent,
  cellEditorPopup: true,
  filterParams: {
    valueGetter: (params) => {
      return params.data.PriceTypes.map(
        (option) => priceTypes?.CodeValues?.find((cv) => cv?.CodeValueId === option?.PriceTypeCvId)?.Display
      )
    },
  },
  cellEditorParams: (params) => {
    const value = params?.data?.PriceTypes
    return {
      options: priceTypes?.CodeValues?.map((option) => ({
        value: option.CodeValueId,
        label: option.Display,
      })),
      placeholder: "Select Price Types",
      mode: "multiple",
      value: value?.map((item) => item.PriceTypeCvId),
    }
  },
}`,
    props: {
      cellRenderer: 'custom rendering with ManyTag and sorting',
      filterParams: 'custom filter value extraction',
      cellEditorParams: 'function returning dynamic editor configuration',
      mode: '"multiple" for multi-selection',
      placeholder: '"Select Price Types"',
      cellEditorPopup: 'popup mode for grid editing',
    },
    dependencies: ['react', 'antd', '@gravitate-js/excalibrr', 'ag-grid-community'],
    sourceFile: '/src/modules/Admin/PricePublishers/columnDefs.tsx',
    notes:
      'Perfect for complex grid columns requiring multi-select with custom display. Shows advanced patterns for value transformation and custom filtering.',
  },
]

export default SelectExamples
