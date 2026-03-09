/**
 * Popconfirm Component Examples Database
 *
 * This file contains production-tested examples of the Popconfirm component
 * extracted from the Excalibrr component library. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality Popconfirm implementations.
 */

export interface PopconfirmExample {
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

export const PopconfirmExamples: PopconfirmExample[] = [
  {
    id: 'popconfirm_simple_01',
    name: 'Basic Delete Confirmation',
    description: 'Simple delete confirmation with confirm/cancel buttons',
    complexity: 'simple',
    category: 'confirmation',
    tags: ['delete', 'confirmation', 'basic'],
    code: `<Popconfirm
  title="Are you sure you want to delete this item?"
  onConfirm={() => handleDelete(item.id)}
  okText="Yes"
  cancelText="No"
>
  <Button danger icon={<DeleteOutlined />}>
    Delete
  </Button>
</Popconfirm>`,
    props: {
      title: '"Are you sure you want to delete this item?"',
      onConfirm: 'Delete handler function',
      okText: '"Yes"',
      cancelText: '"No"'
    },
    dependencies: ['antd', '@ant-design/icons'],
    notes: 'Standard delete confirmation pattern with clear Yes/No options'
  },

  {
    id: 'popconfirm_simple_02',
    name: 'Action Confirmation',
    description: 'Simple confirmation for non-destructive actions',
    complexity: 'simple',
    category: 'confirmation',
    tags: ['action', 'confirmation', 'non-destructive'],
    code: `<Popconfirm
  title="Confirm this action?"
  onConfirm={handleConfirm}
  okText="Confirm"
  cancelText="Cancel"
>
  <Button type="primary">
    Execute Action
  </Button>
</Popconfirm>`,
    props: {
      title: '"Confirm this action?"',
      onConfirm: 'Action handler function',
      okText: '"Confirm"',
      cancelText: '"Cancel"'
    },
    dependencies: ['antd'],
    notes: 'General confirmation pattern for actions requiring user verification'
  },

  {
    id: 'popconfirm_medium_01',
    name: 'Clear Field Confirmation',
    description: 'Confirmation dialog for clearing form fields or selections',
    complexity: 'medium',
    category: 'form-interaction',
    tags: ['clear', 'form', 'selection', 'custom-icon'],
    code: `<Popconfirm
  title="Are you sure you want to clear this field?"
  open={isPopConfirmOpen}
  onConfirm={() => {
    setSelected([])
    setIsPopConfirmVisible(false)
  }}
  onCancel={() => {
    setIsPopConfirmVisible(false)
  }}
>
  <CloseOutlined
    onClick={() => {
      if (props.showPopConfirmOnClear) {
        setIsPopConfirmVisible(true)
      } else {
        setSelected(null)
      }
    }}
  />
</Popconfirm>`,
    props: {
      title: '"Are you sure you want to clear this field?"',
      open: 'Controlled open state',
      onConfirm: 'Clear action with state cleanup',
      onCancel: 'Cancel action with state cleanup'
    },
    dependencies: ['antd', '@ant-design/icons'],
    sourceFile: 'src/knowledge/components/Select/index.ts',
    notes: 'Advanced pattern with controlled visibility and conditional display logic'
  },

  {
    id: 'popconfirm_medium_02',
    name: 'Bulk Action Confirmation',
    description: 'Confirmation for bulk operations with item count',
    complexity: 'medium',
    category: 'bulk-operations',
    tags: ['bulk', 'multiple-items', 'count', 'dynamic'],
    code: `<Popconfirm
  title={\`Are you sure you want to delete \${selectedItems.length} item(s)?\`}
  onConfirm={() => handleBulkDelete(selectedItems)}
  okText="Delete All"
  cancelText="Cancel"
  okButtonProps={{ danger: true }}
>
  <Button
    danger
    disabled={selectedItems.length === 0}
    icon={<DeleteOutlined />}
  >
    Delete Selected ({selectedItems.length})
  </Button>
</Popconfirm>`,
    props: {
      title: 'Dynamic message with item count',
      onConfirm: 'Bulk operation handler',
      okText: '"Delete All"',
      cancelText: '"Cancel"',
      okButtonProps: 'Danger styling for destructive action'
    },
    dependencies: ['antd', '@ant-design/icons'],
    notes: 'Dynamic confirmation for bulk operations with clear action indication'
  },

  {
    id: 'popconfirm_medium_03',
    name: 'Status Change Confirmation',
    description: 'Confirmation for changing item status with context',
    complexity: 'medium',
    category: 'status-change',
    tags: ['status', 'state-change', 'contextual'],
    code: `<Popconfirm
  title={\`Change status from "\${currentStatus}" to "\${newStatus}"?\`}
  description="This action cannot be undone."
  onConfirm={() => handleStatusChange(item.id, newStatus)}
  okText="Change Status"
  cancelText="Keep Current"
  placement="topLeft"
>
  <Button
    type={newStatus === 'active' ? 'primary' : 'default'}
    icon={newStatus === 'active' ? <CheckOutlined /> : <PauseOutlined />}
  >
    Set {newStatus}
  </Button>
</Popconfirm>`,
    props: {
      title: 'Dynamic title with current and new status',
      description: '"This action cannot be undone."',
      onConfirm: 'Status change handler',
      okText: '"Change Status"',
      cancelText: '"Keep Current"',
      placement: '"topLeft" positioning'
    },
    dependencies: ['antd', '@ant-design/icons'],
    notes: 'Contextual confirmation with additional description for important changes'
  },

  {
    id: 'popconfirm_complex_01',
    name: 'Advanced Confirmation with Custom Content',
    description: 'Complex confirmation with rich content and custom styling',
    complexity: 'complex',
    category: 'advanced',
    tags: ['custom-content', 'rich', 'styled', 'complex'],
    code: `<Popconfirm
  title={
    <div>
      <Texto category="p1" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Permanent Deletion
      </Texto>
      <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>
        This will permanently delete "{item.name}" and all associated data.
      </Texto>
    </div>
  }
  description={
    <div style={{ marginTop: '8px' }}>
      <Texto category="p2" style={{ color: 'var(--theme-error)' }}>
        This action cannot be undone.
      </Texto>
      <div style={{ marginTop: '4px' }}>
        <Texto category="p2">
          Items to be deleted:
        </Texto>
        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
          <li>Main record</li>
          <li>{relatedItems.length} related items</li>
          <li>{attachments.length} attachments</li>
        </ul>
      </div>
    </div>
  }
  onConfirm={handleComplexDelete}
  okText="Delete Permanently"
  cancelText="Keep Item"
  okButtonProps={{
    danger: true,
    size: 'small',
    style: { fontWeight: 'bold' }
  }}
  cancelButtonProps={{ size: 'small' }}
  overlayStyle={{ maxWidth: '300px' }}
>
  <Button
    danger
    size="small"
    icon={<DeleteOutlined />}
    style={{ padding: '4px 8px' }}
  >
    Delete
  </Button>
</Popconfirm>`,
    props: {
      title: 'Rich JSX content with styled text',
      description: 'Detailed description with lists and warnings',
      onConfirm: 'Complex deletion handler',
      okText: '"Delete Permanently"',
      cancelText: '"Keep Item"',
      okButtonProps: 'Custom styling for confirm button',
      cancelButtonProps: 'Custom styling for cancel button',
      overlayStyle: 'Custom popup styling'
    },
    dependencies: ['antd', '@gravitate-js/excalibrr', '@ant-design/icons'],
    notes: 'Professional confirmation dialog with comprehensive information and custom styling'
  },

  {
    id: 'popconfirm_complex_02',
    name: 'Conditional Confirmation with State Management',
    description: 'Advanced confirmation that changes based on conditions and manages complex state',
    complexity: 'complex',
    category: 'conditional',
    tags: ['conditional', 'state-management', 'dynamic', 'complex'],
    code: `const [confirmVisible, setConfirmVisible] = useState(false)
const [confirmType, setConfirmType] = useState('normal')

const handleConfirmation = () => {
  if (hasUnsavedChanges) {
    setConfirmType('unsaved')
  } else if (hasRelatedData) {
    setConfirmType('related')
  } else {
    setConfirmType('normal')
  }
  setConfirmVisible(true)
}

const getConfirmContent = () => {
  switch (confirmType) {
    case 'unsaved':
      return {
        title: 'Unsaved Changes Detected',
        description: 'You have unsaved changes. What would you like to do?',
        okText: 'Discard Changes',
        cancelText: 'Keep Editing'
      }
    case 'related':
      return {
        title: 'Related Data Found',
        description: \`This item has \${relatedDataCount} related records. Delete anyway?\`,
        okText: 'Delete All',
        cancelText: 'Cancel'
      }
    default:
      return {
        title: 'Confirm Deletion',
        description: 'Are you sure you want to delete this item?',
        okText: 'Delete',
        cancelText: 'Cancel'
      }
  }
}

const confirmContent = getConfirmContent()

<Popconfirm
  title={confirmContent.title}
  description={confirmContent.description}
  open={confirmVisible}
  onConfirm={() => {
    handleDeleteWithContext(confirmType)
    setConfirmVisible(false)
  }}
  onCancel={() => setConfirmVisible(false)}
  okText={confirmContent.okText}
  cancelText={confirmContent.cancelText}
  okButtonProps={{
    danger: confirmType !== 'normal',
    loading: isDeleting
  }}
>
  <Button onClick={handleConfirmation}>
    Delete Item
  </Button>
</Popconfirm>`,
    props: {
      title: 'Dynamic based on confirmation type',
      description: 'Contextual description based on state',
      open: 'Controlled visibility',
      onConfirm: 'Context-aware confirmation handler',
      onCancel: 'Cancel with state cleanup',
      okText: 'Dynamic confirm text',
      cancelText: 'Dynamic cancel text',
      okButtonProps: 'Dynamic styling and loading state'
    },
    dependencies: ['antd'],
    notes: 'Enterprise-level confirmation system with full context awareness and state management'
  }
]

export default PopconfirmExamples