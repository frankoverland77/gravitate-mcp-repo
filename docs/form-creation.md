# 📝 Form Creation Guide

## Overview

The MCP server provides a `create_form_demo` tool that creates simple form demos using Excalibrr components and Ant Design form elements.

## Available Tool

### `create_form_demo`

Creates a form component with validation using Excalibrr layout components.

**Features:**

- Ant Design Form with validation rules
- Excalibrr layout components (Vertical, Horizontal, Texto)
- GraviButton for actions
- Automatic field type rendering
- Mock data generation

## Usage Examples

### Basic Product Form

```
"Create a product form with name, price, category, and description fields"
```

This generates:

- Form component with proper validation
- Field types inferred from names
- Submit and cancel actions
- Mock data for testing

### Customer Registration Form

```
"Create a customer form with first name, last name, email, phone, and active status"
```

### Complex Form with Multiple Field Types

```
Create an inventory form with:
- itemName (text, required)
- sku (text, required)
- quantity (number, required)
- category (select with options: Electronics, Office, Hardware)
- description (text)
- isActive (switch)
- purchaseDate (date)
```

## Generated Components

### Form Component (`[Name].tsx`)

- Uses Excalibrr `Vertical`, `Horizontal`, `Texto`, `GraviButton`
- Ant Design `Form`, `Input`, `Select`, `Switch`, `DatePicker`, etc.
- Validation rules for required fields
- Submit handling with console logging
- Proper TypeScript types

### Mock Data (`[Name].data.ts`)

- Sample data matching form fields
- Options for select fields
- Realistic placeholder values

## Field Types

The tool automatically selects field types based on names:

- **text/email** → `Input` component
- **number** → `InputNumber` component
- **select** → `Select` with options
- **date** → `DatePicker`
- **dateRange** → `RangePicker`
- **switch** → `Switch` component
- **checkbox** → `Checkbox` component

## Form Actions

Default actions include:

- **Cancel** button (default theme)
- **Submit** button (success theme)

You can customize actions:

```javascript
actions: [
  { type: "cancel", label: "Cancel", theme: "default" },
  { type: "reset", label: "Reset Form", theme: "default" },
  { type: "submit", label: "Save Item", theme: "success" },
];
```

## Form Layout

Forms use a standard layout:

- `Vertical` container with padding
- `Texto` heading
- Ant Design `Form` with vertical layout
- Action buttons in a `Horizontal` container

## Best Practices

### 1. Field Specification

Be specific about field requirements:

```
"Create a user form with:
- firstName (text, required)
- email (email, required)
- role (select, options: Admin, User, Viewer)
- isActive (switch)"
```

### 2. Validation

Required fields automatically get validation:

```javascript
{ required: true, message: 'Field Name is required' }
```

### 3. Select Fields

Always provide options for select fields:

```javascript
options: ["Option1", "Option2", "Option3"];
```

## Integration

Generated forms automatically:

- Update `pageConfig.tsx` with new route
- Add scope to `AuthenticatedRoute.jsx`
- Import component properly
- Use utility CSS classes where possible

## Limitations

- Demo forms only (no API integration)
- Basic validation rules only
- Simple field types
- No complex form interactions
- No modal/drawer wrappers

## user's Workflow

1. **Specify form clearly**: Include field names, types, and requirements
2. **Test the form**: Forms are immediately available in demo showcase
3. **Iterate**: Use `cleanup_demo` to remove and recreate as needed
4. **Copy code**: Generated forms can be copied to actual projects

Perfect for prototyping forms and understanding Excalibrr component patterns!
