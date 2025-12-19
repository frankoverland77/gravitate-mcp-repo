# Overlay Components Examples

## Overview

This guide covers four related overlay components: **Modal**, **Popover**, **Popconfirm**, and **Tooltip**. These components create overlays that appear above other content to provide additional information, confirm actions, or display complex interfaces.

---

## Modal Component

Modals are dialog overlays for displaying content that requires user attention or action.

### Basic Props

| Prop | Type | Description |
|------|------|-------------|
| `visible` | `boolean` | Controls modal visibility |
| `onCancel` | `() => void` | Handler for closing the modal |
| `title` | `ReactNode` | Modal title content |
| `footer` | `ReactNode` | Custom footer content |
| `width` | `number \| string` | Modal width |
| `destroyOnClose` | `boolean` | Destroy content when modal closes |

### Basic Usage

```tsx
<Modal
  visible={isVisible}
  onCancel={onCancel}
  title="Basic Modal"
  footer={
    <div>
      <Button onClick={onCancel}>Cancel</Button>
      <Button type="primary" onClick={onConfirm}>OK</Button>
    </div>
  }
>
  <p>Modal content goes here</p>
</Modal>
```

### Confirmation Modal
```tsx
<Modal
  visible={isVisible}
  onCancel={onCancel}
  title={
    <Horizontal alignItems='center'>
      <ExclamationCircleOutlined className='mr-2' style={{ color: 'var(--theme-error)' }} />
      <Texto category='h6'>Confirm Revaluation</Texto>
    </Horizontal>
  }
  footer={
    <Horizontal justifyContent='flex-end' style={{ gap: 10 }}>
      <GraviButton buttonText='Cancel' onClick={onCancel} />
      <GraviButton buttonText='Confirm Revaluation' theme1 onClick={() => onConfirm()} />
    </Horizontal>
  }
>
  <Vertical style={{ fontSize: '12px' }}>
    <Texto category='p2'>This action will recalculate all values.</Texto>
    <Texto category='p2' style={{ color: 'var(--theme-error)', marginTop: '8px' }}>
      This action cannot be undone.
    </Texto>
  </Vertical>
</Modal>
```

### Form Modal
```tsx
const FormModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm()

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Create New Item"
      destroyOnClose
      footer={
        <div>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea placeholder="Enter description" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
```

---

## Popover Component

Popovers display rich content in a floating container, triggered by click or hover.

### Basic Props

| Prop | Type | Description |
|------|------|-------------|
| `content` | `ReactNode` | Popover content |
| `title` | `ReactNode` | Popover title |
| `trigger` | `'hover' \| 'click' \| 'focus'` | Trigger method |
| `placement` | `string` | Positioning (top, bottom, left, right, etc.) |
| `visible` | `boolean` | Controlled visibility |

### Basic Usage

```tsx
// Simple content popover
<Popover content="This is popover content" title="Popover Title">
  <Button>Hover me</Button>
</Popover>

// Map marker popover
<Popover content={popOverContent} title={popOverTitle}>
  <div
    className='map-mark-icon'
    lat={location.lat}
    lng={location.lon}
  />
</Popover>
```

### Interactive Popover with Menu
```tsx
const [popoverVisible, setPopoverVisible] = useState(false)

const menu = (
  <Menu>
    <Menu.Item onClick={() => handleEdit()}>Edit</Menu.Item>
    <Menu.Item onClick={() => handleDelete()}>Delete</Menu.Item>
    <Menu.Item onClick={() => handleDuplicate()}>Duplicate</Menu.Item>
  </Menu>
)

<Popover
  content={menu}
  title="Actions"
  trigger="click"
  visible={popoverVisible}
  onVisibleChange={setPopoverVisible}
  placement="bottomRight"
>
  <Button icon={<MoreOutlined />} />
</Popover>
```

### Rich Content Popover
```tsx
const richContent = (
  <div style={{ maxWidth: '300px' }}>
    <Texto category="p1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
      Item Details
    </Texto>
    <div style={{ marginBottom: '8px' }}>
      <Texto category="p2">Status: Active</Texto>
      <Texto category="p2">Created: {formatDate(item.created)}</Texto>
      <Texto category="p2">Updated: {formatDate(item.updated)}</Texto>
    </div>
    <div>
      <Button size="small" type="primary">Edit</Button>
      <Button size="small" style={{ marginLeft: '8px' }}>View</Button>
    </div>
  </div>
)

<Popover
  content={richContent}
  trigger="click"
  placement="top"
>
  <InfoCircleOutlined style={{ cursor: 'pointer' }} />
</Popover>
```

---

## Popconfirm Component

Popconfirm provides a confirmation dialog in a popover-style overlay.

### Basic Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Confirmation message |
| `description` | `ReactNode` | Additional description |
| `onConfirm` | `() => void` | Confirm action handler |
| `onCancel` | `() => void` | Cancel action handler |
| `okText` | `string` | Confirm button text |
| `cancelText` | `string` | Cancel button text |
| `okButtonProps` | `ButtonProps` | Confirm button properties |

### Basic Usage

```tsx
// Simple delete confirmation
<Popconfirm
  title="Are you sure you want to delete this item?"
  onConfirm={() => handleDelete(item.id)}
  okText="Yes"
  cancelText="No"
>
  <Button danger icon={<DeleteOutlined />}>
    Delete
  </Button>
</Popconfirm>
```

### Advanced Confirmation
```tsx
<Popconfirm
  title={`Change status from "${currentStatus}" to "${newStatus}"?`}
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
</Popconfirm>
```

### Controlled Confirmation
```tsx
const [confirmVisible, setConfirmVisible] = useState(false)

<Popconfirm
  title="Are you sure you want to clear this field?"
  visible={confirmVisible}
  onConfirm={() => {
    setSelected([])
    setConfirmVisible(false)
  }}
  onCancel={() => setConfirmVisible(false)}
>
  <CloseOutlined
    onClick={() => setConfirmVisible(true)}
  />
</Popconfirm>
```

### Bulk Operation Confirmation
```tsx
<Popconfirm
  title={`Are you sure you want to delete ${selectedItems.length} item(s)?`}
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
</Popconfirm>
```

---

## Tooltip Component

Tooltips provide contextual information on hover or focus.

### Basic Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Tooltip content |
| `placement` | `string` | Positioning |
| `trigger` | `'hover' \| 'focus' \| 'click'` | Trigger method |
| `mouseEnterDelay` | `number` | Delay before showing (seconds) |
| `mouseLeaveDelay` | `number` | Delay before hiding (seconds) |
| `overlayStyle` | `CSSProperties` | Custom tooltip styling |

### Basic Usage

```tsx
// Simple tooltip
<Tooltip title="This is a helpful tooltip">
  <Button>Hover me</Button>
</Tooltip>

// Icon with tooltip
<Tooltip title="Click to edit this field">
  <EditOutlined style={{ cursor: 'pointer', color: 'var(--theme-color-2)' }} />
</Tooltip>
```

### Truncated Content Tooltip
```tsx
<Tooltip title={fullValue}>
  <div>
    <BBDTag
      className="text-ellipsis"
      style={{ maxWidth: "150px" }}
    >
      {truncatedValue}
    </BBDTag>
  </div>
</Tooltip>
```

### Rich Content Tooltip
```tsx
<Tooltip
  title={
    <div>
      <Texto category="p2" style={{ color: 'white', fontWeight: 'bold' }}>
        Complex nested content with calculation
      </Texto>
      <div style={{ marginTop: '4px' }}>
        <span style={{ color: '#91d5ff' }}>Value: </span>
        <span style={{ color: '#fff' }}>{formattedValue}</span>
      </div>
    </div>
  }
  overlayStyle={{ maxWidth: '300px' }}
>
  <BBDTag warning className="text-center">
    <span className="text-xs font-normal">
      <WarningOutlined className="mr-1" />
      Threshold: 85%
    </span>
  </BBDTag>
</Tooltip>
```

### Conditional Tooltip
```tsx
<Tooltip title={hasError ? errorMessage : undefined}>
  <Input
    status={hasError ? 'error' : undefined}
    placeholder="Enter value"
  />
</Tooltip>
```

---

## Integration Patterns

### Modal with Confirmation
```tsx
const DeleteModal = ({ visible, item, onCancel, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Confirm Deletion"
      footer={
        <div>
          <Button onClick={onCancel}>Cancel</Button>
          <Popconfirm
            title="This action cannot be undone"
            onConfirm={onConfirm}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger>Delete Item</Button>
          </Popconfirm>
        </div>
      }
    >
      <p>Are you sure you want to delete "{item.name}"?</p>
    </Modal>
  )
}
```

### Nested Overlays
```tsx
<Modal visible={modalVisible} onCancel={() => setModalVisible(false)}>
  <div>
    <Tooltip title="Additional information">
      <InfoCircleOutlined />
    </Tooltip>
    <Popover
      content={<Menu>...</Menu>}
      trigger="click"
    >
      <Button>Actions</Button>
    </Popover>
  </div>
</Modal>
```

## Best Practices

### Modal
- Use for content that requires full user attention
- Always provide a clear way to close (onCancel)
- Use appropriate sizing for content
- Consider mobile responsiveness
- Use `destroyOnClose` for forms to reset state

### Popover
- Use for contextual information that doesn't require full attention
- Keep content concise and relevant
- Consider trigger method based on user interaction patterns
- Use appropriate positioning to avoid viewport issues

### Popconfirm
- Use for destructive or important actions
- Provide clear, specific confirmation messages
- Use appropriate button styling (danger for destructive actions)
- Consider the impact of the action in the message

### Tooltip
- Keep content brief and informative
- Use for helpful hints and truncated content
- Consider delay timing for better user experience
- Ensure tooltips don't interfere with user interactions

### General Overlay Guidelines
- Maintain consistent z-index management
- Consider keyboard navigation and accessibility
- Test overlay behavior on different screen sizes
- Use appropriate positioning to stay within viewport
- Provide clear visual hierarchy when overlays are nested