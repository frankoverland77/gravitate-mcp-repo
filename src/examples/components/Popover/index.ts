/**
 * Popover Component Examples Database
 *
 * This file contains high-quality Popover component examples extracted from production codebase.
 * Examples range from simple to complex implementations, covering various use cases and patterns.
 *
 * Used by MCP server for generating Popover component code with real-world patterns.
 */

export interface PopoverExample {
  id?: string;
  name: string;
  description: string;
  complexity: "simple" | "medium" | "complex";
  category?: string;
  tags: string[];
  code: string;
  props?: Record<string, any>;
  dependencies?: string[];
  notes?: string;
  sourceFile?: string;
}

export const PopoverExamples: PopoverExample[] = [
  {
    name: "Map Marker Popover",
    description: "Simple popover with content and title for map markers",
    complexity: "simple",
    category: "interactive",
    tags: ["basic", "map", "tooltip", "simple", "content", "title"],
    code: `<Popover content={popOverContent} title={popOverTitle}>
  <div
    className='map-mark-icon'
    lat={location.lat}
    lng={location.lon}
  />
</Popover>`,
  },

  {
    name: "Action Menu Popover",
    description:
      "Simple click-triggered popover with menu content and state management",
    complexity: "simple",
    category: "interactive",
    tags: ["menu", "click", "state", "action", "button", "trigger"],
    code: `const [popoverVisible, setPopoverVisible] = useState<boolean>(false)

const menu = (
  <Menu>
    <Menu.Item key='action1' icon={<DollarOutlined />} onClick={() => handleAction()}>
      Action Item
    </Menu.Item>
  </Menu>
)

<Popover
  visible={popoverVisible}
  onVisibleChange={setPopoverVisible}
  overlayClassName='custom-popover-no-padding'
  placement='bottomRight'
  trigger='click'
  content={menu}
>
  <GraviButton icon={<MoreOutlined />} />
</Popover>`,
  },

  {
    name: "Form Creation Popover",
    description:
      "Popover containing a form with submission handling and visibility control",
    complexity: "medium",
    category: "forms",
    tags: ["form", "creation", "submit", "state-management", "button-trigger"],
    code: `const CreateMappingPopover: React.FC<PopoverProps> = ({ selectedFormula, handleSubmit, metadata }) => {
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false)

  return (
    <Popover
      visible={isPopoverVisible}
      trigger='click'
      onVisibleChange={(visible) => setIsPopoverVisible(visible)}
      content={
        <NewMappingForm
          onSubmit={(values) => {
            handleSubmit(values)
            setIsPopoverVisible(false)
          }}
          locationOptions={metadata?.Locations}
          productOptions={metadata?.Products}
          formula={selectedFormula}
        />
      }
      placement='bottomRight'
    >
      <GraviButton
        buttonText='New Mapping'
        theme2
        size='small'
        icon={<PlusOutlined />}
        onClick={() => {
          setIsPopoverVisible(true)
        }}
      />
    </Popover>
  )
}`,
  },

  {
    name: "Dynamic Action Menu",
    description:
      "Context-aware action menu with dynamic action building and event propagation control",
    complexity: "medium",
    category: "interactive",
    tags: [
      "dynamic",
      "actions",
      "context",
      "menu",
      "events",
      "stopPropagation",
    ],
    code: `export function ActionMenu({ detail, openTab, newTab, deleteDetail, isActive = false, hideViewEdit = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)

  const actions = buildActions(detail, openTab, newTab, deleteDetail, closeMenu, hideViewEdit)

  return (
    <Popover
      className='action-popover'
      placement='bottomRight'
      content={() => <ActionMenuItems actions={actions} />}
      trigger='click'
      onVisibleChange={(event) => setIsMenuOpen(event)}
      visible={isMenuOpen}
    >
      <MenuButton
        onClick={(e) => {
          e.stopPropagation()
          openMenu()
        }}
        isActive={isActive}
      />
    </Popover>
  )
}`,
  },

  {
    name: "Price Information Display",
    description:
      "Complex popover with calculations, conditional rendering, and formatted data display",
    complexity: "complex",
    category: "data",
    tags: [
      "calculations",
      "conditional",
      "formatting",
      "price",
      "data",
      "complex-content",
    ],
    code: `const NetOrGrossDisplay = () => ({
  cellRenderer: (params) => {
    const secondaryBasis = params?.data?.NetOrGrossDisplay === 'Net' ? 'Gross' : 'Net'
    const secondaryPrice = params.data.TCIIsMultiplication
      ? params.data.ProposedPrice * (params?.data?.TCIValue || 0)
      : params.data.TCIValue !== 0
      ? params.data.ProposedPrice / params.data.TCIValue
      : 0
    const showTCIPopover = params?.data?.PublishesNetAndGross && !!params?.data?.TCIValue

    return (
      <Horizontal style={{ minHeight: 22 }} verticalCenter>
        {showTCIPopover && (
          <Popover
            className='action-popover'
            placement='top'
            content={() => {
              return (
                <Vertical verticalCenter style={{ width: 200 }}>
                  <Horizontal justifyContent='space-between'>
                    <Texto>
                      Secondary{' '}
                      <span style={{ color: secondaryBasis === 'Gross' ? '#51B073' : '#0C5A58' }}>
                        {secondaryBasis}
                      </span>{' '}
                      Price{' '}
                    </Texto>
                    <Texto weight={600}>{fmt.currency(secondaryPrice)}</Texto>
                  </Horizontal>
                  <Horizontal justifyContent='space-between'>
                    <Texto>TCI Factor</Texto>
                    <Texto>{fmt.decimal(params?.data?.TCIValue)}</Texto>
                  </Horizontal>
                  <Texto className='my-3'>
                    Note: Value based on row proposed period price and currently effective TCI conversion
                  </Texto>
                </Vertical>
              )
            }}
          >
            <div style={{ fontSize: 13, width: 20, display: 'flex' }}>
              {getNetGrossIcon(params?.data?.NetOrGrossDisplay)}
            </div>
          </Popover>
        )}
      </Horizontal>
    )
  }
})`,
  },

  {
    name: "Dual Mode Form Popover",
    description:
      "Advanced form popover supporting both create and edit modes with validation and API integration",
    complexity: "complex",
    category: "forms",
    tags: [
      "form",
      "dual-mode",
      "create",
      "edit",
      "validation",
      "api",
      "advanced",
    ],
    code: `export const NewMarkerPopover: React.FC<IProps> = ({
  visible,
  onVisibleChange,
  productOptions,
  locationOptions,
  setNewMarkerFormVisible,
  setActiveEditMarkerKey,
  activeMarker,
  canInsertNewMarker = true,
}) => {
  const [form] = useForm()
  const { useMarketPlatformFormulaMarkerUpsertMutation } = useMarketPlatformFormulas()
  const upsert = useMarketPlatformFormulaMarkerUpsertMutation()

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      upsert.mutate({ ...values })
      setNewMarkerFormVisible(false)
      setActiveEditMarkerKey(null)
      form.resetFields()
    } catch (error) {
      message.error('Please fill in all required fields')
    }
  }

  const mode = useMemo(() => (activeMarker ? 'edit' : 'create'), [activeMarker])

  return (
    <Popover
      trigger='click'
      visible={visible || !!activeMarker}
      onVisibleChange={(visible) => {
        if (!visible) {
          form.resetFields()
          setActiveEditMarkerKey(null)
        }
        setNewMarkerFormVisible(visible)
      }}
      placement='bottom'
      content={
        <Form form={form} onFinish={handleSubmit} layout='vertical' style={{ minWidth: 280 }}>
          <Vertical style={{ gap: '1rem' }} className='p-3'>
            <Texto category='h5' style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <FolderAddOutlined />
              {mode === 'edit' ? 'Edit Marker' : 'New Marker'}
            </Texto>
            
            <Form.Item name='Name' label='Name' rules={[{ required: true, message: 'Name is required' }]}>
              <Input placeholder='Marker Name' disabled={!canInsertNewMarker} />
            </Form.Item>
            
            <Form.Item name='ProductHierarchyTypeCvId' label='Product Hierarchy'>
              <Select placeholder='Product Hierarchy'>
                {productOptions?.map((option) => (
                  <Select.Option value={option.Value} key={option.Value}>
                    {option.Text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Vertical>
        </Form>
      }
    >
      {canInsertNewMarker && (
        <Tooltip title='Create New Marker' placement='bottomRight'>
          <Button icon={<FolderAddOutlined />} onClick={() => onVisibleChange(true)} />
        </Tooltip>
      )}
    </Popover>
  )
}`,
  },

  {
    name: "Hover-Triggered Rule Details",
    description:
      "Sophisticated hover popover with API data fetching, loading states, and rule visualization",
    complexity: "complex",
    category: "data",
    tags: ["hover", "api", "loading", "rules", "data-fetching", "conditional"],
    code: `export function NetGrossDefaultRenderer({ value, data }) {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const hasDefaultRule = !!data.DefaultNetOrGrossCvId
  const hasRuleApplied = !!data.NetOrGrossCvId
  const isOverridden = hasDefaultRule && hasRuleApplied && 
    data?.NetOrGrossCvId?.toString() !== data?.DefaultNetOrGrossCvId?.toString()

  const { useNetGrossGetDefault } = useNetOrGross()
  const query = useNetGrossGetDefault(data, { enabled: popoverVisible && hasDefaultRule })

  return (
    <Popover
      overlayClassName='quoterow-rule-popover'
      trigger='hover'
      placement='bottom'
      visible={popoverVisible && hasDefaultRule}
      onVisibleChange={(visible) => setPopoverVisible(visible)}
      content={() => {
        return (
          <Vertical style={{ minWidth: 400 }}>
            {query.isFetching || query.isLoading ? (
              <Vertical justifyContent='center' alignItems='center' className='p-3' style={{ minHeight: 300 }}>
                <div>
                  <Texto align='center'>Loading Rules</Texto>
                  <FormulaStatusSpinner />
                </div>
              </Vertical>
            ) : (
              <>
                <Horizontal alignItems='center' justifyContent='space-between' className='p-3'>
                  <Texto>NET / GROSS:</Texto>
                  <Horizontal style={{ gap: '0.35rem' }}>
                    <span>{getIcon(data?.NetOrGrossCvId, value, data?.DefaultNetOrGrossCvId)}</span>
                    <Texto>{value}</Texto>
                  </Horizontal>
                </Horizontal>
                <Horizontal className={\`\${isOverridden ? 'bg-warning-dim' : 'bg-success-dim'} p-3\`}>
                  <Texto>
                    This quote row has {isOverridden ? 'updated to override' : 'matched with'} the following rule:
                  </Texto>
                </Horizontal>
                <Horizontal justifyContent='space-between' className='p-3'>
                  <Texto>Rule #</Texto>
                  <Texto category='p2'>{query.data?.NetGrossDefault?.Order}</Texto>
                </Horizontal>
              </>
            )}
          </Vertical>
        )
      }}
    >
      <div className='p-4' style={{ display: 'flex', gap: 10, verticalAlign: 'center', width: '100%' }}>
        <Texto>{getIcon(data?.NetOrGrossCvId, value, data?.DefaultNetOrGrossCvId)}</Texto>
        <Texto category='p2'>{value}</Texto>
      </div>
    </Popover>
  )
}`,
  },

  {
    name: "Grid Cell Editor Popover",
    description:
      "Highly sophisticated popover for grid cell editing with forwardRef, filtering, and dynamic content",
    complexity: "complex",
    category: "ui",
    tags: [
      "grid",
      "editor",
      "forwardRef",
      "filtering",
      "cascader",
      "multi-step",
      "dynamic",
    ],
    code: `export const CostLinkEditor = forwardRef((params: IProps, editorRef) => {
  const [selectedId, setSelectedId] = useState<string>()
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [selectedLocationId, setSelectedLocationId] = useState(null)

  useImperativeHandle(editorRef, () => {
    return {
      getValue() {
        return selectedId
      },
      isCancelBeforeStart() {
        return false
      },
      isCancelAfterEnd() {
        return false
      },
    }
  })

  const contractFilter = useCallback(
    (contract) => {
      if (selectedProduct && contract.Product !== selectedProduct.Text) return false
      if (selectedLocation && contract.Location !== selectedLocation.Text) return false
      return true
    },
    [selectedProduct, selectedLocation]
  )

  const searchFilter = useCallback(
    (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    []
  )

  return (
    <Popover
      placement='bottom'
      visible={true}
      content={() => {
        if (params.data.CostSourceType?.toLowerCase()?.includes('instrument')) {
          return (
            <Vertical width={700} style={{ gap: '1rem' }} className='p-3'>
              <Texto category='label' appearance='medium'>
                Select a Price Instrument
              </Texto>
              <Cascader
                showSearch
                onChange={([_publisher, instrument]) => {
                  setSelectedId(instrument as string)
                }}
                style={{ width: '100%' }}
                options={pricePublisherOptions}
              />
            </Vertical>
          )
        }
        if (params.data.CostSourceType?.toLowerCase()?.includes('contract')) {
          return (
            <Vertical width={500} style={{ gap: '1rem' }} className='p-3'>
              <Horizontal width='100%' style={{ gap: '1rem' }}>
                <Vertical className='flex-1'>
                  <Texto category='label'>Product</Texto>
                  <Select
                    placeholder='Filter by Product'
                    filterOption={searchFilter}
                    showSearch
                    value={selectedProductId}
                    onChange={(value) => setSelectedProductId(value)}
                    options={productOptions}
                  />
                </Vertical>
                <Vertical className='flex-1'>
                  <Texto category='label'>Location</Texto>
                  <Select
                    placeholder='Filter by Location'
                    filterOption={searchFilter}
                    showSearch
                    value={selectedLocationId}
                    options={locationOptions}
                    onChange={(value) => setSelectedLocationId(value)}
                  />
                </Vertical>
              </Horizontal>
              <Select
                filterOption={searchFilter}
                showSearch
                value={selectedId}
                onChange={(id) => setSelectedId(id)}
                placeholder='Select a Contract'
                options={filteredContractOptions}
              />
            </Vertical>
          )
        }
      }}
    >
      <div />
    </Popover>
  )
})`,
  },
];

export default PopoverExamples;
