# Form Generation Guide - Excalibrr MCP Server

## Overview

The form generation tools create production-ready forms that integrate seamlessly with your existing grids and API patterns. Forms are built using Ant Design components wrapped with Excalibrr layout components.

## Form Generation Tools

### 1. `generate_form_for_feature`

Creates forms for existing features with full CRUD integration.

**Key Features:**

- Generates form component with validation
- Creates Modal or Drawer wrapper
- Integrates with existing TanStack Query hooks
- Updates grid component to use the form
- Smart field type inference
- Logical field grouping

### 2. `generate_standalone_form` (Coming Soon)

Creates independent form components for custom use cases.

## Usage Examples

### Basic Form Generation

```
Generate a form for the PriceAudit feature in Admin module at /Users/rebecca.hirai/repos/Gravitate.Dotnet.Next/frontend with fields:
- auditId (hidden in form)
- productName (text, required, label: "Product Name")
- oldPrice (number, required, label: "Previous Price")
- newPrice (number, required, label: "New Price")
- reason (textarea, required, label: "Change Reason")
- effectiveDate (date, required, label: "Effective Date")

Use Modal container and auditId as unique identifier
```

### Complex Form with Relations

```
Generate a form for the ContractDetails feature in ContractManagement module with fields:
- contractId (hidden)
- contractNumber (text, required, label: "Contract Number")
- counterpartyId (select, required, label: "Counterparty", options: will be fetched)
- productId (select, required, label: "Product", options: will be fetched)
- startDate (date, required, label: "Start Date")
- endDate (date, required, label: "End Date")
- quantity (number, required, label: "Quantity", validation: "min: 0")
- price (number, required, label: "Price per Unit", validation: "min: 0, precision: 2")
- terms (textarea, label: "Terms & Conditions")
- isActive (boolean, label: "Active Contract")

Use Drawer container with 800px width and contractId as unique identifier
```

### Form with Custom Validation

```
Generate a form for UserRegistration in Admin module with fields:
- userId (hidden)
- email (email, required, label: "Email Address", validation: "type: 'email'")
- firstName (text, required, label: "First Name")
- lastName (text, required, label: "Last Name")
- role (select, required, label: "User Role", options: [{label: "Admin", value: "admin"}, {label: "User", value: "user"}, {label: "Viewer", value: "viewer"}])
- department (select, required, label: "Department")
- startDate (date, required, label: "Start Date")
- isActive (boolean, label: "Active User")

Use Modal container and userId as unique identifier
```

## Generated Files

### 1. Form Component (`[Feature]Form.tsx`)

The main form component with:

- Ant Design Form with validation
- Field grouping (Basic Info, Details, Metadata)
- Date handling with moment.js
- Error notifications
- Loading states

### 2. Container Component (`[Feature]FormModal.tsx` or `[Feature]FormDrawer.tsx`)

Wrapper component that:

- Manages form visibility
- Handles create/edit modes
- Integrates with API mutations
- Triggers grid refresh on success

### 3. Enhanced Grid Component (optional)

Updates your existing grid to:

- Add Create button
- Handle edit actions
- Manage form state
- Refresh data after changes

## Field Types

### Automatic Type Inference

The tool infers field types from naming patterns:

- **Date fields**: Contains 'date' or 'time' → DatePicker
- **Boolean fields**: Starts with 'is', 'has' or contains 'active', 'enabled' → Switch
- **Number fields**: Contains 'id', 'count', 'amount', 'price', 'quantity' → InputNumber
- **Email fields**: Contains 'email' → Input with email validation
- **Long text**: Contains 'description', 'notes', 'comment' → TextArea
- **Select fields**: Contains 'status', 'type', 'category' → Select
- **Default**: Regular text → Input

### Manual Type Override

You can explicitly specify types:

```
- fieldName (type: select, required, label: "Field Label")
```

## Form Layout

Forms are automatically organized into logical groups:

1. **Basic Information**: Core fields
2. **Additional Details**: Descriptions, notes, comments
3. **Metadata**: Dates, created/updated info

## Integration Pattern

### 1. Column Definitions Update

```typescript
// columnDefs.tsx
export const getFeatureColumnDefs = ({ onEdit, onDelete }) => [
  // ... columns
  {
    headerName: "Actions",
    cellRenderer: ActionMenu,
    cellRendererParams: { onEdit, onDelete },
  },
];
```

### 2. Action Menu Update

```typescript
// components/actionMenu.tsx
export const ActionMenu = ({ data, onEdit, onDelete }) => {
  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={() => onEdit(data)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" danger onClick={() => onDelete(data)}>
        Delete
      </Menu.Item>
    </Menu>
  );
  // ...
};
```

### 3. Grid Component Integration

The enhanced grid automatically includes:

- Form state management
- Create/Edit mode handling
- Success callbacks for data refresh

## Best Practices

### 1. Field Validation

- Always mark required fields
- Add specific validation rules (min, max, patterns)
- Use appropriate field types for better UX

### 2. Select Fields

For fields that need dynamic options:

1. Mark them as select type
2. Add data fetching in the form component
3. Consider using a lookup hook

### 3. Form Width

- **Modal**: 600-800px for standard forms
- **Drawer**: 720-1000px for complex forms
- Consider field layout when choosing width

### 4. Error Handling

- Forms include automatic error notifications
- API errors are logged to console
- Add specific error handling as needed

## Common Customizations

### Adding Dependent Fields

```typescript
// In the form component
const [showAdvanced, setShowAdvanced] = useState(false);

<Form.Item
  name="type"
  onChange={(value) => setShowAdvanced(value === "advanced")}
>
  <Select />
</Form.Item>;

{
  showAdvanced && (
    <Form.Item name="advancedOption">
      <Input />
    </Form.Item>
  );
}
```

### Custom Submit Logic

```typescript
// In handleSubmit
const submitData = {
  ...values,
  // Custom transformations
  calculatedField: values.price * values.quantity,
};
```

### Dynamic Options Loading

```typescript
// In the form component
const { data: counterparties } = useQuery(["counterparties"], () =>
  api.get("/counterparties/list")
);

<Select
  options={counterparties?.map((c) => ({
    label: c.name,
    value: c.id,
  }))}
/>;
```

## Troubleshooting

### "Feature not found" Error

- Ensure the feature was previously generated
- Check the module and feature names match exactly
- Verify the project root path is correct

### Form Not Showing

- Check that the grid component imports the form
- Verify the form visibility state is managed correctly
- Ensure the Modal/Drawer is not behind other elements

### Validation Not Working

- Check that form field names match exactly
- Verify required fields have the required rule
- Ensure Form.Item wraps each input correctly

## Next Steps

After generating a form:

1. Test create and edit operations
2. Customize validation rules
3. Add any complex field interactions
4. Implement delete confirmations
5. Add success/error messages
6. Consider adding form drafts or auto-save
