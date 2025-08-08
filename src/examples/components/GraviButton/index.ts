/**
 * GraviButton Component Examples Database
 *
 * This file contains production-tested examples of the GraviButton component
 * extracted from the Gravitate frontend codebase. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality GraviButton implementations.
 */

export interface GraviButtonExample {
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

export const GraviButtonExamples: GraviButtonExample[] = [
  {
    id: 'gravi_button_simple_01',
    name: 'Basic Button',
    description: 'Simple button with text only',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['basic', 'minimal', 'text-only'],
    code: `<GraviButton
  buttonText='Clear Selection'
  onClick={handleClearSelection}
/>`,
    props: {
      buttonText: 'Clear Selection',
      onClick: 'handleClearSelection',
    },
    sourceFile: 'src/modules/SellingPlatform/BuyNow/Forwards/components/Grid/components/Grid.tsx',
    notes: 'Perfect for simple action buttons with no special styling',
  },

  {
    id: 'gravi_button_simple_02',
    name: 'Button with Icon',
    description: 'Button with icon and text',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['icon', 'text', 'download'],
    code: `<GraviButton
  buttonText='Export to CSV'
  onClick={handleCSVExport}
  icon={<DownloadOutlined />}
/>`,
    props: {
      buttonText: 'Export to CSV',
      onClick: 'handleCSVExport',
      icon: '<DownloadOutlined />',
    },
    dependencies: ['@ant-design/icons'],
    sourceFile: 'src/modules/SellingPlatform/BuyNow/Forwards/components/Grid/components/Grid.tsx',
    notes: 'Common pattern for export/download actions',
  },

  {
    id: 'gravi_button_simple_03',
    name: 'Icon-Only Button',
    description: 'Button with only an icon, no text',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['icon-only', 'minimal', 'ghost'],
    code: `<GraviButton 
  onClick={() => openDrawer(title)} 
  icon={<SettingOutlined />} 
  className='ghost-gravi-button' 
/>`,
    props: {
      onClick: '() => openDrawer(title)',
      icon: '<SettingOutlined />',
      className: 'ghost-gravi-button',
    },
    dependencies: ['@ant-design/icons'],
    sourceFile: 'src/modules/CommandCenter/components/Grids/sharedComponents/ActionButtons.tsx',
    notes: 'Great for compact interfaces and action bars',
  },

  {
    id: 'gravi_button_theme_01',
    name: 'Success Theme Button',
    description: 'Button with success theme styling',
    complexity: 'simple',
    category: 'themed',
    tags: ['success', 'theme', 'create', 'positive-action'],
    code: `<GraviButton
  buttonText='Create Contract'
  success
  className='mr-3'
  onClick={() => {
    navigate('/ContractManagement/createContract')
  }}
/>`,
    props: {
      buttonText: 'Create Contract',
      success: true,
      className: 'mr-3',
      onClick: 'navigation function',
    },
    sourceFile: 'src/components/shared/EntityReport/components/index.tsx',
    notes: 'Use success theme for positive actions like create, save, confirm',
  },

  {
    id: 'gravi_button_theme_02',
    name: 'Error Theme Button',
    description: 'Button with error theme for destructive actions',
    complexity: 'simple',
    category: 'themed',
    tags: ['error', 'destructive', 'delete'],
    code: `<GraviButton
  buttonText={selectedDetails?.length ? \`Delete (\${selectedDetails?.length})\` : 'Delete'}
  error
  loading={isFetchingDetailValuation || isFetchingContractValuation}
  disabled={isFetchingDetailValuation || isFetchingContractValuation || !selectedDetails?.length}
/>`,
    props: {
      buttonText: 'Dynamic text with count',
      error: true,
      loading: 'boolean',
      disabled: 'complex condition',
    },
    sourceFile:
      'src/modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/AllDetailsGridActionButtons.tsx',
    notes: 'Use error theme for destructive actions. Shows dynamic text and loading states.',
  },

  {
    id: 'gravi_button_theme_03',
    name: 'Theme2 Primary Button',
    description: 'Button with theme2 styling for primary actions',
    complexity: 'simple',
    category: 'themed',
    tags: ['theme2', 'primary', 'action'],
    code: `<GraviButton
  buttonText='Create Order'
  onClick={() => setIsModalVisible(true)}
  theme2
  disabled={!selectedPeriodIds?.length || !canWrite}
/>`,
    props: {
      buttonText: 'Create Order',
      onClick: '() => setIsModalVisible(true)',
      theme2: true,
      disabled: '!selectedPeriodIds?.length || !canWrite',
    },
    sourceFile: 'src/modules/SellingPlatform/BuyNow/Forwards/components/Grid/components/Grid.tsx',
    notes: 'Theme2 is commonly used for primary call-to-action buttons',
  },

  {
    id: 'gravi_button_medium_01',
    name: 'Loading State Button',
    description: 'Button with loading state and dynamic text',
    complexity: 'medium',
    category: 'interactive',
    tags: ['loading', 'dynamic-text', 'bulk-action'],
    code: `<GraviButton
  buttonText={selectedDetails?.length ? \`Duplicate (\${selectedDetails?.length})\` : 'Duplicate'}
  loading={isFetchingDetailValuation || isFetchingContractValuation}
  disabled={isFetchingDetailValuation || isFetchingContractValuation || !selectedDetails?.length}
/>`,
    props: {
      buttonText: 'Dynamic with count',
      loading: 'complex boolean condition',
      disabled: 'multiple conditions',
    },
    sourceFile:
      'src/modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/AllDetailsGridActionButtons.tsx',
    notes: 'Good pattern for bulk operations with loading states and dynamic text',
  },

  {
    id: 'gravi_button_medium_02',
    name: 'Conditional Theme Button',
    description: 'Button with conditional theme based on data state',
    complexity: 'medium',
    category: 'conditional',
    tags: ['conditional', 'theme', 'data-driven', 'icons'],
    code: `<GraviButton
  icon={buttonTitle.includes('Save') ? <SaveOutlined /> : <ArrowRightOutlined />}
  style={{
    height: 35,
    fontSize: 15,
  }}
  theme2={contract?.OrderStatusCodeValueDisplay !== 'Draft'}
  loading={loading}
  onClick={() => onClick('SaveChanges')}
  disabled={disabled}
  buttonText={buttonTitle}
  className='px-4 mr-3'
/>`,
    props: {
      icon: 'Conditional based on buttonTitle',
      style: 'Custom height and fontSize',
      theme2: 'Conditional based on contract status',
      loading: 'boolean',
      onClick: 'Function with parameter',
      disabled: 'boolean',
      buttonText: 'Dynamic',
      className: 'Utility classes',
    },
    sourceFile: 'src/components/shared/Navigation/Footer/Footer.tsx',
    notes: 'Shows conditional theming and icons based on data state',
  },

  {
    id: 'gravi_button_medium_03',
    name: 'Small Size Button',
    description: 'Small-sized button for compact interfaces',
    complexity: 'medium',
    category: 'sizing',
    tags: ['small', 'compact', 'bulk-actions'],
    code: `<GraviButton 
  buttonText='Activate All' 
  success 
  size='small' 
  onClick={onActivateAll} 
  className='mr-1' 
/>`,
    props: {
      buttonText: 'Activate All',
      success: true,
      size: 'small',
      onClick: 'onActivateAll',
      className: 'mr-1',
    },
    sourceFile:
      'src/modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/components/SubscriptionManagementActionButtons.tsx',
    notes: 'Small size perfect for bulk action toolbars and compact interfaces',
  },

  {
    id: 'gravi_button_complex_01',
    name: 'Custom Styled Error Button',
    description: 'Button with custom error styling using CSS variables',
    complexity: 'complex',
    category: 'custom-styling',
    tags: ['custom-style', 'css-variables', 'error', 'themes'],
    code: `<GraviButton
  style={{
    border: '1px solid var(--theme-error)',
    color: 'var(--theme-error)',
    backgroundColor: 'var(--theme-error-trans)',
  }}
  buttonText={\`Cancel \${orderDetails?.IsBidOrOffer ? 'Bid' : 'Order'}\`}
  onClick={rejectOrder}
  disabled={disableButtons || !canWrite}
/>`,
    props: {
      style: 'Custom error styling with CSS variables',
      buttonText: 'Dynamic text with conditional logic',
      onClick: 'rejectOrder',
      disabled: 'Multiple boolean conditions',
    },
    sourceFile:
      'src/components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/Footer.tsx',
    notes: 'Shows how to create custom error styling using theme CSS variables',
  },

  {
    id: 'gravi_button_complex_02',
    name: 'Action Buttons with Permissions',
    description: 'Button group with complex permission-based rendering',
    complexity: 'complex',
    category: 'permissions',
    tags: ['permissions', 'conditional-rendering', 'action-group'],
    code: `{canAcceptRejectOrder && orderDetails?.AreSetupsStillValid && (
  <Horizontal verticalCenter style={{ gap: 20 }}>
    <GraviButton
      buttonText='Reject'
      onClick={rejectOrder}
      disabled={disableButtons || !canWrite}
      style={{
        border: '1px solid var(--theme-error)',
        color: 'var(--theme-error)',
        backgroundColor: 'var(--theme-error-trans)',
      }}
    />
    <GraviButton
      theme3
      buttonText='Accept'
      onClick={acceptOrder}
      disabled={disableButtons || !canWrite || !canAcceptOrderDates}
    />
  </Horizontal>
)}`,
    props: {
      conditional: 'Complex permission and data checks',
      buttonText: 'Accept/Reject',
      onClick: 'Different handlers',
      disabled: 'Complex permission logic',
      style: 'Custom error styling',
      theme3: 'For accept action',
    },
    sourceFile:
      'src/components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/Footer.tsx',
    notes: 'Complex example showing permission-based rendering with custom styling',
  },

  {
    id: 'gravi_button_complex_03',
    name: 'Icon Buttons with Actions',
    description: 'Icon-only buttons with different action types in grid cells',
    complexity: 'complex',
    category: 'grid-actions',
    tags: ['icon-only', 'grid-cell', 'actions', 'transparent'],
    code: `<Horizontal style={{ gap: '1rem', alignItems: 'center' }}>
  <GraviButton
    icon={<CloseCircleTwoTone style={{ fontSize: 24 }} twoToneColor={twoToneColorReject} />}
    onClick={() => acceptOrRejectOrder(data, 'Withdraw')}
    style={{ backgroundColor: 'transparent' }}
    disabled={!canWrite}
  />
  <GraviButton
    icon={<CheckCircleTwoTone style={{ fontSize: 24 }} twoToneColor={twoToneColorSuccess} />}
    onClick={() => acceptOrRejectOrder(data, 'Accept')}
    style={{ backgroundColor: 'transparent' }}
    disabled={!canWrite}
  />
</Horizontal>`,
    props: {
      icon: 'TwoTone icons with dynamic colors',
      onClick: 'Functions with different actions',
      style: 'Transparent background',
      disabled: 'Permission-based',
    },
    sourceFile: 'src/modules/Dashboard/AdminDashboard/Tabs/PendingOrders/columnDefs.tsx',
    notes: 'Perfect for grid cell actions with icon-only buttons and dynamic colors',
  },

  {
    id: 'gravi_button_complex_04',
    name: 'Edit Mode Buttons',
    description: 'Buttons for edit/save/cancel operations with form submission',
    complexity: 'complex',
    category: 'form-actions',
    tags: ['edit-mode', 'form', 'icons', 'save', 'cancel'],
    code: `{editingGroupId === group.Value ? (
  <Space>
    <Form.Item>
      <GraviButton
        icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />}
        onClick={() => {
          setSaveDisabled(true)
          setEditingGroupId(undefined)
        }}
      />
    </Form.Item>
    <Form.Item>
      <GraviButton
        style={{ borderRadius: 0 }}
        success
        htmlType='submit'
        icon={<CheckOutlined />}
        disabled={saveDisabled}
      />
    </Form.Item>
  </Space>
) : (
  <Horizontal style={{ gap: 10 }}>
    <GraviButton icon={<EditFilled onClick={() => setEditingGroupId(group.Value)} />} />
    <GraviButton
      icon={<DeleteFilled style={{ color: 'var(--theme-error)' }} onClick={() => handleDelete(group.Value)} />}
    />
  </Horizontal>
)}`,
    props: {
      conditional: 'Edit mode vs view mode',
      icon: 'Different icons for each action',
      onClick: 'State management functions',
      htmlType: 'submit for form',
      success: 'For save action',
      disabled: 'Based on form state',
      style: 'Custom styling',
    },
    sourceFile: 'src/components/shared/GroupEditor/GroupEditor.tsx',
    notes: 'Complex edit mode pattern with conditional rendering and form integration',
  },
]

export default GraviButtonExamples
