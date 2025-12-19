# NotificationMessage & NothingMessage Components Examples

## Overview

These components handle user feedback and empty states throughout the application. **NotificationMessage** provides toast-style notifications for user actions, while **NothingMessage** displays empty states when no data is available.

## NotificationMessage Component

### Function Signature
```tsx
NotificationMessage(title: string, message: string, isError: boolean) => void
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | `string` | The title/heading of the notification |
| `message` | `string` | The detailed message content |
| `isError` | `boolean` | `true` for error notifications, `false` for success |

## Basic Usage

### Success Notifications
```tsx
// Simple success notification
NotificationMessage('Success', 'Form submitted successfully!', false)

// Dynamic success with data
NotificationMessage(
  'Success',
  `User ${response.data.name} created successfully with ID: ${response.data.id}`,
  false
)

// File upload success
NotificationMessage('Success', `${files.length} file(s) uploaded successfully`, false)
```

### Error Notifications
```tsx
// Basic error notification
NotificationMessage('Error', 'Failed to submit form', true)

// Validation error
NotificationMessage('Error', 'Please check the form fields', true)

// API error with fallback
NotificationMessage('Error', errorMessage || 'Login failed', true)
```

## Advanced Patterns

### Complex Validation Handling
```tsx
// Multiple validation errors
if (response?.Validations?.length > 0) {
  response.Validations.forEach((validation) => {
    NotificationMessage('Error Saving', validation.Message, true)
  })
} else {
  NotificationMessage(
    title ?? 'Save Successful',
    `${numberOfRecords} record(s) saved successfully`,
    false
  )
}
```

### First Error Display
```tsx
if (createUserValidationResponse?.errors?.length > 0) {
  const firstError = createUserValidationResponse.errors[0]
  NotificationMessage('Validation Error', firstError.errors[0], true)
} else {
  NotificationMessage('Error', 'Failed to create user. Please try again.', true)
}
```

## Common Use Cases

### Form Submissions
```tsx
const handleSubmit = async (formData) => {
  try {
    const response = await submitForm(formData)
    NotificationMessage('Success', 'Form submitted successfully!', false)
  } catch (error) {
    NotificationMessage('Error', error.message || 'Submission failed', true)
  }
}
```

### API Operations
```tsx
const handleUpdate = async () => {
  try {
    await updateRecord(recordId, data)
    NotificationMessage('Updated', `Record ${recordId} updated successfully`, false)
  } catch (error) {
    NotificationMessage('Update Failed', 'Could not update record', true)
  }
}
```

### Bulk Operations
```tsx
const handleBulkUpdate = async (items) => {
  try {
    const results = await bulkUpdate(items)
    NotificationMessage(
      'Bulk Update Complete',
      `${results.successful} of ${items.length} items updated successfully`,
      results.failed > 0
    )
  } catch (error) {
    NotificationMessage('Bulk Update Failed', 'Could not complete bulk operation', true)
  }
}
```

---

## NothingMessage Component

### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | The main heading for the empty state |
| `message` | `string` | Descriptive text explaining the empty state |
| `icon` | `ReactNode` | Optional icon to display |
| `actions` | `ReactNode[]` | Optional action buttons |

## Basic Usage

### Simple Empty States
```tsx
// No data available
<NothingMessage
  title="No Alerts"
  message="You have not received any alerts."
/>

// Empty search results
<NothingMessage
  title="No Results Found"
  message="Try adjusting your search criteria or filters."
/>

// Empty collection
<NothingMessage
  title="No Items"
  message="Get started by creating your first item."
/>
```

## Enhanced Empty States

### With Custom Icons
```tsx
<NothingMessage
  title="No Data Available"
  message="Data will appear here when it's available."
  icon={
    <DatabaseOutlined
      style={{ fontSize: '48px', color: 'var(--theme-color-3)' }}
    />
  }
/>
```

### Loading State Variant
```tsx
<NothingMessage
  title="Loading..."
  message="Please wait while we fetch your data."
  icon={<Spin size="large" />}
/>
```

## Interactive Empty States

### With Action Buttons
```tsx
<NothingMessage
  title="No Projects Yet"
  message="Create your first project to get started with managing your work."
  actions={[
    <GraviButton
      key="create"
      theme1
      buttonText="Create Project"
      icon={<PlusOutlined />}
      onClick={() => setShowCreateModal(true)}
    />,
    <GraviButton
      key="import"
      appearance="outline"
      buttonText="Import Project"
      icon={<UploadOutlined />}
      onClick={() => setShowImportModal(true)}
    />
  ]}
/>
```

## Conditional Rendering

### Data-Driven Empty States
```tsx
// Basic conditional rendering
{!loading && data?.length === 0 && (
  <NothingMessage
    title="No Records Found"
    message="No records match your current filters."
  />
)}

// Loading state management
{loading ? (
  <NothingMessage
    title="Loading..."
    message="Please wait while we fetch your data."
    icon={<Spin size="large" />}
  />
) : data?.length === 0 ? (
  <NothingMessage
    title="No Data"
    message="No data is available to display."
  />
) : (
  <DataDisplay data={data} />
)}
```

## Dynamic Content Based on Context

### Permission-Based Empty States
```tsx
<NothingMessage
  title={userCanCreate ? "No Items Created" : "No Items Available"}
  message={
    userCanCreate
      ? "You haven't created any items yet. Click the button below to create your first item."
      : "There are no items available to view at this time."
  }
  icon={
    <EmptyStateIcon
      type={userCanCreate ? "create" : "empty"}
      style={{ fontSize: '64px' }}
    />
  }
  actions={
    userCanCreate ? [
      <GraviButton
        key="create"
        theme1
        size="large"
        buttonText="Create First Item"
        icon={<PlusOutlined />}
        onClick={handleCreateItem}
      />
    ] : undefined
  }
/>
```

## Best Practices

### NotificationMessage
- **Clear Messaging**: Use descriptive titles and helpful messages
- **Consistent Terminology**: Use consistent language for similar actions
- **Error Context**: Provide specific error information when possible
- **Success Confirmation**: Always confirm successful actions
- **Batch Processing**: Handle multiple validations appropriately

### NothingMessage
- **Helpful Guidance**: Explain why the state is empty and what users can do
- **Consistent Theming**: Use theme colors and icons appropriately
- **Actionable Content**: Provide clear next steps when possible
- **Context Awareness**: Tailor messages to user permissions and context
- **Loading States**: Distinguish between loading and truly empty states

### Integration Patterns
- Use NotificationMessage for immediate feedback on user actions
- Use NothingMessage for persistent empty states in UI sections
- Combine both for complete user experience in data-driven interfaces
- Consider user permissions when showing different empty state content

## Common Integration Scenarios

### Form with Notifications
```tsx
const FormWithNotifications = () => {
  const handleSubmit = async (values) => {
    try {
      await submitData(values)
      NotificationMessage('Success', 'Data saved successfully', false)
      form.resetFields()
    } catch (error) {
      NotificationMessage('Error', 'Failed to save data', true)
    }
  }

  return (
    <Form onFinish={handleSubmit}>
      {/* form fields */}
    </Form>
  )
}
```

### Data List with Empty State
```tsx
const DataListWithEmpty = ({ data, loading }) => {
  if (loading) {
    return (
      <NothingMessage
        title="Loading..."
        message="Fetching your data..."
        icon={<Spin size="large" />}
      />
    )
  }

  if (data?.length === 0) {
    return (
      <NothingMessage
        title="No Data Found"
        message="Try adjusting your filters or create new items."
        actions={[
          <GraviButton
            key="create"
            theme1
            buttonText="Add Item"
            onClick={handleCreate}
          />
        ]}
      />
    )
  }

  return <DataGrid data={data} />
}
```